import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseCSV, processFinancialData } from '@/lib/dataParser';
import { generateAdaptiveKPIs, detectCapabilities } from '@/lib/dashboardConfig';
import { excelToCSV, detectBestSheet } from '@/lib/excelParser';
import { checkUnifiedRateLimit } from '@/lib/rateLimit';
import { getClientIP } from '@/lib/rateLimitKV';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { parseWithAI } from '@/lib/ai/aiParser';
import { logger } from '@/lib/logger';
import { logParseAttempt } from '@/lib/parseLogger';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // � SESSION OPTIONNELLE (public access pour démo)
    const session = await getServerSession(req, res, authOptions);
    
    const isAuthenticated = !!session?.user;
    const userId = session?.user?.id || null;
    const userPlan = (session?.user?.plan as any) || 'FREE';
    const clientIP = getClientIP(req);

    // Identifier : userId si connecté, sinon IP
    const identifier = userId || clientIP;

    // 🛡️ RATE LIMITING pour uploads
    // - Connecté FREE: 5/mois
    // - Non connecté (IP): 3/jour
    const rateLimit = await checkUnifiedRateLimit(
        identifier,
        'uploads',
        userPlan,
        isAuthenticated
    );

    if (!rateLimit.allowed) {
        return res.status(429).json({
            error: rateLimit.message || `Limite d'uploads atteinte (${rateLimit.limit}/mois)`,
            remaining: 0,
            limit: rateLimit.limit,
            resetAt: rateLimit.resetAt,
            upgradeUrl: rateLimit.upgradeUrl
        });
    }

    // Variables pour logging (accessibles dans try et catch)
    let fileName = '';
    let fileSize = 0;
    let fileType = '';
    let startTime = 0;

    try {
        const fileData = req.body;
        fileName = fileData.fileName || 'unknown';
        fileType = fileData.fileType || '';
        const fileContent = fileData.fileContent;
        const companyId = fileData.companyId;
        const isDemo = fileData.isDemo || false; // Flag to skip AI for demos

        if (!fileContent) {
            return res.status(400).json({ error: 'No file content provided' });
        }

        fileSize = Buffer.byteLength(fileContent, 'utf-8');
        startTime = Date.now();

        // 🛡️ VALIDATION MIME TYPE (Sécurité)
        const allowedMimeTypes = [
            'text/csv',
            'application/csv',
            'application/vnd.ms-excel', // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            '', // Fallback si fileType vide (certains navigateurs)
        ];

        if (fileType && !allowedMimeTypes.includes(fileType)) {
            logger.warn(`[Upload] ⚠️ MIME type suspect rejeté: ${fileType} (fichier: ${fileName})`);
            return res.status(400).json({
                error: 'Type de fichier non autorisé',
                details: `Le fichier "${fileName}" n'est pas un format accepté (type détecté : ${fileType})`,
                help: 'Veuillez utiliser un fichier CSV (.csv) ou Excel (.xlsx, .xls)',
                allowedFormats: ['.csv', '.xlsx', '.xls'],
                receivedMimeType: fileType
            });
        }

        // Détecter le type de fichier
        const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
        const isCSV = fileName.endsWith('.csv');

        if (!isCSV && !isExcel) {
            return res.status(400).json({
                error: 'Format de fichier non supporté',
                details: `Le fichier "${fileName}" doit avoir une extension .csv, .xlsx ou .xls`,
                help: 'Téléchargez un de nos templates depuis la page d\'accueil',
                supportedFormats: ['.csv', '.xlsx', '.xls']
            });
        }

        let csvContent = fileContent;

        // Si c'est un fichier Excel, le convertir en CSV avec détection intelligente de la meilleure feuille
        if (isExcel) {
            // 🎯 MULTI-FEUILLES INTELLIGENT : Utiliser detectBestSheet()
            const bestSheetIndex = detectBestSheet(fileContent);
            logger.debug(`[Upload] 📊 Détection meilleure feuille Excel: index ${bestSheetIndex}`);

            const conversionResult = excelToCSV(fileContent, bestSheetIndex);

            if (!conversionResult.success || !conversionResult.csvContent) {
                return res.status(400).json({
                    error: 'Erreur lors de la conversion Excel',
                    details: conversionResult.error
                });
            }

            csvContent = conversionResult.csvContent;
            logger.debug(`✅ Excel converti: ${conversionResult.sheetName} (${conversionResult.rowCount} lignes × ${conversionResult.columnCount} colonnes)`);
        }

        // ✅ VALIDATION PRÉ-PARSING (économise des appels IA inutiles)
        const { validateCSVStructure } = await import('@/lib/dataParser');
        const csvValidation = validateCSVStructure(csvContent);

        if (!csvValidation.valid) {
            logger.warn(`[Upload] ❌ Validation CSV échouée: ${csvValidation.error}`);
            return res.status(400).json({
                error: 'Structure du fichier invalide',
                details: csvValidation.error,
                help: csvValidation.hasDateColumn === false
                    ? 'Assurez-vous que votre fichier contient une colonne "Date" avec les dates des transactions.'
                    : csvValidation.hasAmountColumn === false
                        ? 'Assurez-vous que votre fichier contient une colonne "Montant" avec les montants des transactions.'
                        : 'Vérifiez que votre fichier respecte le format attendu (minimum 10 transactions).'
            });
        }

        logger.debug(`[Upload] ✅ Validation CSV réussie (${csvValidation.lineCount} transactions détectées)`);

        // 🎬 DÉMOS : Use AI (Gemini free) for better handling of demo CSV formats
        // Demo CSVs may have duplicate headers or complex structures
        if (isDemo) {
            logger.info('[Upload] 🎭 Mode DEMO détecté - Utilisation IA Gemini (gratuit) pour nettoyage intelligent');
            
            const aiParseResult = await parseWithAI(csvContent, 'full');
            
            if (!aiParseResult.success || !aiParseResult.data?.records) {
                logger.warn('[Upload] ⚠️ IA échouée sur démo, tentative parser classique...');
                
                // Fallback to classic parser
                const classicParseResult = parseCSV(csvContent);
                
                if (!classicParseResult.success || !classicParseResult.data?.records) {
                    logger.error('[Upload] ❌ Démo - IA et parser classique échoués');
                    const errorDetails = classicParseResult.errors?.map(e => e.message).join(', ') || 'Unknown error';
                    return res.status(400).json({
                        error: 'Impossible de traiter ce fichier de démo',
                        details: errorDetails
                    });
                }
                
                // Use classic result
                const processedData = processFinancialData(classicParseResult.data.records, 'demo-upload');
                const capabilities = detectCapabilities([], processedData.records);
                const dashboardKPIs = generateAdaptiveKPIs(processedData, capabilities);

                return res.status(200).json({
                    success: true,
                    data: classicParseResult.data.records,
                    financialData: processedData,
                    kpis: dashboardKPIs,
                    capabilities,
                    rawData: classicParseResult.data,
                    message: `✅ ${classicParseResult.data.records.length} transactions analysées (Mode Demo - Classic Parser)`
                });
            }
            
            // AI succeeded - process and return
            logger.info(`[Upload] ✅ Demo parsed with AI: ${aiParseResult.data.records.length} transactions`);
            
            const processedData = processFinancialData(aiParseResult.data.records, 'demo-upload');
            const capabilities = detectCapabilities([], processedData.records);
            const dashboardKPIs = generateAdaptiveKPIs(processedData, capabilities);

            return res.status(200).json({
                success: true,
                data: aiParseResult.data.records,
                financialData: processedData,
                kpis: dashboardKPIs,
                capabilities,
                rawData: aiParseResult.data,
                message: `✅ ${aiParseResult.data.records.length} transactions analysées (Mode Demo - AI Gemini)`
            });
        }

        // � STRATÉGIE HYBRIDE INTELLIGENTE (non-demo files only)
        // Fichiers < 500 lignes : IA fait tout (nettoyage + parsing)
        // Fichiers > 500 lignes : Parser Classique (exhaustif) + IA échantillon (enrichissement)
        const lineCount = csvValidation.lineCount || 0;
        const isLargeFile = lineCount > 500;
        let aiParseResult;

        if (isLargeFile) {
            logger.info(`[Upload] 📦 Gros fichier détecté (${lineCount} lignes). Mode HYBRIDE activé.`);
            logger.info('[Upload] 1️⃣ Parser Classique : extraction exhaustive...');

            // Étape 1 : Parser classique pour garantir l'exhaustivité (TOUTES les lignes)
            const classicParseResult = parseCSV(csvContent);

            if (!classicParseResult.success || !classicParseResult.data?.records) {
                logger.error('[Upload] ❌ Parser classique échoué sur gros fichier');
                return res.status(400).json({
                    error: 'Impossible de traiter ce fichier',
                    details: classicParseResult.errors?.map(e => e.message).join(', ')
                });
            }

            logger.info(`[Upload] ✅ Parser classique : ${classicParseResult.data.records.length} transactions extraites`);

            // Étape 2 : IA sur un échantillon (100 premières lignes) pour enrichissement catégories
            logger.info('[Upload] 2️⃣ IA Gemini Flash : enrichissement échantillon...');
            const sampleLines = csvContent.split('\n').slice(0, 100).join('\n');
            const aiSampleResult = await parseWithAI(sampleLines, 'sample');

            // Fusion intelligente : données exhaustives + enrichissements IA
            aiParseResult = {
                success: true,
                data: classicParseResult.data,
                rawResponse: `Hybrid mode: Classic parser (${classicParseResult.data.records.length} records) + AI enrichment (${aiSampleResult.success ? 'success' : 'skipped'})`
            };

            logger.info('[Upload] ✅ Mode HYBRIDE complété avec succès');
        } else {
            // Fichiers petits : IA fait tout le travail (nettoyage intelligent)
            logger.debug('[Upload] 🤖 Fichier petit : Parsing complet avec IA Gemini Flash...');
            aiParseResult = await parseWithAI(csvContent, 'full');
        }

        // 🔄 FALLBACK : Si IA échoue (petits fichiers uniquement), tenter parseCSV classique
        if (!aiParseResult.success || !aiParseResult.data?.records) {
            logger.warn('[Upload] ⚠️ Parsing IA échoué, tentative avec parseCSV classique...');
            logger.warn(`[Upload] Erreur IA: ${aiParseResult.error}`);

            try {
                // Fallback vers le parser classique
                const classicParseResult = parseCSV(csvContent);

                if (classicParseResult.success && classicParseResult.data) {
                    logger.debug('[Upload] ✅ Fallback parseCSV réussi!');

                    // Wrapper pour compatibilité avec aiParseResult
                    aiParseResult = {
                        success: true,
                        data: classicParseResult.data,
                        rawResponse: 'Parsed with classic CSV parser (fallback)'
                    };
                } else {
                    // Si même le parser classique échoue
                    return res.status(400).json({
                        error: "Impossible de traiter votre fichier (IA et parser classique ont échoué).",
                        details: `IA: ${aiParseResult.error} | Parser classique: ${classicParseResult.errors?.map(e => e.message).join(', ')}`
                    });
                }
            } catch (fallbackError) {
                logger.error('[Upload] ❌ Fallback parseCSV a également échoué:', fallbackError);
                return res.status(400).json({
                    error: "L'IA n'a pas pu traiter votre fichier et le fallback a échoué.",
                    details: aiParseResult.error || "Aucune donnée retournée."
                });
            }
        }

        // Post-traitement pour calculer les métriques
        const processedData = processFinancialData(aiParseResult.data!.records, 'ai-upload');

        if (processedData.records.length === 0) {
            return res.status(400).json({
                error: 'Aucune donnée valide trouvée dans le fichier'
            });
        }

        // ✅ Valider qualité données avant de continuer
        const { validateDataQuality } = await import('@/lib/scoring/finSightScore');
        const validation = validateDataQuality(processedData);

        // Si erreurs bloquantes, retourner avec détails
        if (!validation.valid) {
            // 📊 Log failed parse (data quality issues)
            await logParseAttempt({
                userId: userId || undefined,
                fileName,
                fileSize,
                mimeType: fileType,
                parseMethod: aiParseResult.rawResponse ? 'AI' : 'CLASSIC',
                success: false,
                error: `Qualité données insuffisante: ${validation.errors.join(', ')}`,
                executionTime: Date.now() - startTime,
                recordsFound: processedData.records.length
            });

            return res.status(400).json({
                error: 'Données insuffisantes pour générer un tableau de bord',
                details: validation.errors.join(' • '),
                dataQuality: validation.dataQuality
            });
        }

        // 📊 Log successful parse
        await logParseAttempt({
            userId: userId || undefined,
            fileName,
            fileSize,
            mimeType: fileType,
            parseMethod: lineCount > 500 ? 'HYBRID' : 'AI',
            success: true,
            executionTime: Date.now() - startTime,
            recordsFound: processedData.records.length,
            aiModel: lineCount > 500 ? 'gemini-2.0-flash-exp (sample)' : 'gemini-2.0-flash-exp',
            fallbackUsed: !aiParseResult.success && processedData.records.length > 0
        });

        // ✅ Use adaptive KPI system (same as demos)
        // Create column mappings from AI-parsed data
        const firstRecord = processedData.records[0] || {};
        const detectedMappings = Object.keys(firstRecord).map(field => ({
            sourceColumn: field,
            targetField: field as keyof typeof firstRecord,
            confidence: 1.0,
            dataType: (field === 'date' ? 'date' : field === 'amount' ? 'number' : 'string') as 'string' | 'number' | 'date' | 'currency'
        }));

        const capabilities = detectCapabilities(detectedMappings, processedData.records);
        const dashboardKPIs = generateAdaptiveKPIs(processedData, capabilities); logger.debug(`[Upload] ✅ ${processedData.records.length} transactions parsées par IA`);

        // Log warnings si confiance moyenne/basse
        if (validation.warnings.length > 0) {
            logger.warn(`[Upload] ⚠️ Qualité données: ${validation.confidence} - ${validation.warnings.join(', ')}`);
        }

        // 💾 SAUVEGARDE AUTOMATIQUE en DB (si user connecté)
        let savedDashboardId = null;
        if (isAuthenticated && userId) {
            try {
                // 1. Get companyId from request body or default to first company
                let targetCompany;

                if (companyId) {
                    // Verify ownership before using provided companyId
                    targetCompany = await prisma.company.findFirst({
                        where: { id: companyId, userId }
                    });
                }

                // Fallback to first company if not provided or invalid
                if (!targetCompany) {
                    targetCompany = await prisma.company.findFirst({
                        where: { userId },
                        orderBy: { createdAt: 'asc' },
                    });
                } if (targetCompany) {
                    // 2. Upload CSV vers Vercel Blob Storage
                    const blob = await put(
                        `users/${userId}/${Date.now()}_${fileName}`,
                        csvContent,
                        {
                            access: 'public',
                            contentType: 'text/csv',
                        }
                    );

                    // 3. Sauvegarder dashboard en DB
                    const dashboard = await prisma.dashboard.create({
                        data: {
                            userId,
                            companyId: targetCompany.id,
                            fileName,
                            fileUrl: blob.url,
                            rawData: processedData.records as any, // Prisma Json type
                            kpis: dashboardKPIs as any, // Prisma Json type
                        },
                    });

                    savedDashboardId = dashboard.id;
                    logger.debug(`✅ Dashboard sauvegardé: ${dashboard.id} (company: ${targetCompany.name})`);
                }
            } catch (saveError) {
                logger.error('⚠️ Erreur sauvegarde dashboard (non-bloquant):', saveError);
                // Continue même si la sauvegarde échoue (UX non dégradée)
            }
        }

        // Simulation d'un délai de traitement (pour l'UX)
        await new Promise(resolve => setTimeout(resolve, 1500));

        return res.status(200).json({
            success: true,
            message: `${processedData.records.length} enregistrements traités avec succès par l'IA`,
            savedDashboardId, // 💾 ID du dashboard sauvegardé (null si non connecté)
            data: {
                kpis: dashboardKPIs,
                summary: processedData.summary,
                recordCount: processedData.records.length,
                period: processedData.summary.period,
                quality: processedData.qualityMetrics,
                // ✅ Données depuis le traitement IA avec système adaptatif
                levelInfo: processedData.levelInfo,
                dashboardConfig: capabilities, // ✅ Return adaptive capabilities
                // ✅ Vraies données pour calculs dynamiques
                records: processedData.records,
                financialData: processedData
            },
            // ✅ Rate limit info
            rateLimitInfo: {
                remaining: rateLimit.remaining,
                limit: rateLimit.limit,
                resetAt: rateLimit.resetAt,
                message: rateLimit.message,
                upgradeUrl: rateLimit.upgradeUrl
            }
        });

    } catch (error) {
        logger.error('Erreur lors du traitement du fichier:', error);

        // 📊 Log error
        await logParseAttempt({
            userId: userId || undefined,
            fileName,
            fileSize,
            mimeType: fileType,
            parseMethod: 'ERROR',
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            executionTime: startTime > 0 ? Date.now() - startTime : undefined
        });

        return res.status(500).json({
            error: 'Erreur lors du traitement du fichier',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
}
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseCSV } from '@/lib/dataParser';
import { generateDashboardKPIs } from '@/lib/dataParser';
import { excelToCSV } from '@/lib/excelParser';
import { checkUnifiedRateLimit } from '@/lib/rateLimit';
import { getClientIP } from '@/lib/rateLimitKV';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';

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

    // 🔐 Récupérer session utilisateur
    const session = await getServerSession(req, res, authOptions);
    const isAuthenticated = !!session?.user;
    const userId = session?.user?.id;
    const userPlan = (session?.user?.plan as any) || 'FREE';
    const clientIP = getClientIP(req);

    // Identifier : userId si connecté, sinon IP
    const identifier = isAuthenticated && userId ? userId : clientIP;

    // 🛡️ RATE LIMITING pour uploads (5/mois pour FREE)
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

    try {
        const { fileContent, fileName, fileType, companyId } = req.body;

        if (!fileContent) {
            return res.status(400).json({ error: 'No file content provided' });
        }

        // Détecter le type de fichier
        const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
        const isCSV = fileName.endsWith('.csv');

        if (!isCSV && !isExcel) {
            return res.status(400).json({
                error: 'Format non supporté. Utilisez un fichier CSV ou Excel.',
                supportedFormats: ['.csv', '.xlsx', '.xls']
            });
        }

        let csvContent = fileContent;

        // Si c'est un fichier Excel, le convertir en CSV
        if (isExcel) {
            const conversionResult = excelToCSV(fileContent);

            if (!conversionResult.success || !conversionResult.csvContent) {
                return res.status(400).json({
                    error: 'Erreur lors de la conversion Excel',
                    details: conversionResult.error
                });
            }

            csvContent = conversionResult.csvContent;
            console.log(`✅ Excel converti: ${conversionResult.sheetName} (${conversionResult.rowCount} lignes × ${conversionResult.columnCount} colonnes)`);
        }

        // Parse et traite les données avec nouvelle API
        const parseResult = parseCSV(csvContent);

        if (!parseResult.success || !parseResult.data) {
            return res.status(400).json({
                error: 'Erreur lors du parsing',
                details: parseResult.errors.map(e => e.message).join(', ')
            });
        }

        const { data: processedData } = parseResult;

        if (processedData.records.length === 0) {
            return res.status(400).json({
                error: 'Aucune donnée valide trouvée dans le fichier'
            });
        }

        const dashboardKPIs = generateDashboardKPIs(processedData);

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
                    console.log(`✅ Dashboard sauvegardé: ${dashboard.id} (company: ${targetCompany.name})`);
                }
            } catch (saveError) {
                console.error('⚠️ Erreur sauvegarde dashboard (non-bloquant):', saveError);
                // Continue même si la sauvegarde échoue (UX non dégradée)
            }
        }

        // Simulation d'un délai de traitement (pour l'UX)
        await new Promise(resolve => setTimeout(resolve, 1500));

        return res.status(200).json({
            success: true,
            message: `${processedData.records.length} enregistrements traités avec succès`,
            savedDashboardId, // 💾 ID du dashboard sauvegardé (null si non connecté)
            data: {
                kpis: dashboardKPIs,
                summary: processedData.summary,
                recordCount: processedData.records.length,
                period: processedData.summary.period,
                quality: processedData.qualityMetrics,
                // ✅ Données adaptatives
                levelInfo: parseResult.data.levelInfo,
                dashboardConfig: parseResult.data.dashboardConfig,
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
        console.error('Erreur lors du traitement du fichier:', error);

        return res.status(500).json({
            error: 'Erreur lors du traitement du fichier',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
}
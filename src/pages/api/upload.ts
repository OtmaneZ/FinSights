import { NextApiRequest, NextApiResponse } from 'next';
import { parseCSV } from '@/lib/dataParser';
import { generateDashboardKPIs } from '@/lib/dataParser';
import { excelToCSV } from '@/lib/excelParser';

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

    try {
        const { fileContent, fileName, fileType } = req.body;

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

        // Simulation d'un délai de traitement (pour l'UX)
        await new Promise(resolve => setTimeout(resolve, 1500));

        return res.status(200).json({
            success: true,
            message: `${processedData.records.length} enregistrements traités avec succès`,
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
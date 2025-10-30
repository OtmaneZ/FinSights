import { NextApiRequest, NextApiResponse } from 'next';
import { parseCSV } from '@/lib/dataParser';
import { generateDashboardKPIs } from '@/lib/dataParser';

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

        // Pour commencer, on traite seulement les CSV
        if (!fileName.endsWith('.csv')) {
            return res.status(400).json({
                error: 'Format non supporté pour le moment. Utilisez un fichier CSV.',
                supportedFormats: ['.csv']
            });
        }

        // Parse et traite les données avec nouvelle API
        const parseResult = parseCSV(fileContent);

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
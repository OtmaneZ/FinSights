/**
 * Prédictions Cash Flow avec IA
 * Appelle l'API route /api/ai/predictions (server-side)
 */

import { FinancialRecord } from '@/lib/dataModel';
import { logger } from '@/lib/logger';

export interface CashFlowPrediction {
    month: string;
    predicted: number;
    confidence: number;
    breakdown?: {
        optimistic: number;
        realistic: number;
        pessimistic: number;
    };
}

export interface PredictionAlert {
    type: 'warning' | 'danger' | 'info';
    message: string;
    month?: string;
}

export interface CashFlowPredictionsResult {
    success: boolean;
    predictions?: CashFlowPrediction[];
    alerts?: PredictionAlert[];
    seasonalityDetected?: boolean;
    error?: string;
}

/**
 * Génère des prédictions de cash flow pour les 3 prochains mois
 */
export async function generateCashFlowPredictions(
    rawData: FinancialRecord[]
): Promise<CashFlowPredictionsResult> {
    try {
        logger.debug('[Predictions] 🔮 Appel API prédictions...');

        const response = await fetch('/api/ai/predictions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ records: rawData })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        logger.debug(`[Predictions] ✅ ${result.predictions?.length || 0} prédictions reçues`);

        return result;

    } catch (error) {
        logger.error('[Predictions] ❌ Erreur:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inattendue'
        };
    }
}

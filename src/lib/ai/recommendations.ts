/**
 * Recommandations IA Contextuelles
 * Appelle l'API route /api/ai/recommendations (server-side)
 */

import { FinancialRecord } from '@/lib/dataModel';
import { ScoreBreakdown, ScoreFactors, ScoreLevel } from '@/lib/scoring/finSightScore';
import { logger } from '@/lib/logger';

export interface RecommendationsResult {
    success: boolean;
    recommendations?: string[];
    error?: string;
}

/**
 * Génère des recommandations intelligentes basées sur le contexte complet
 */
export async function generateSmartRecommendations(
    breakdown: ScoreBreakdown,
    factors: ScoreFactors,
    level: ScoreLevel,
    rawData: FinancialRecord[],
    companyContext?: {
        sector?: string;
        companyName?: string;
        teamSize?: number;
    }
): Promise<RecommendationsResult> {
    try {
        logger.debug('[Recommendations] 💡 Appel API recommandations...');

        const response = await fetch('/api/ai/recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                breakdown,
                factors,
                level,
                rawData,
                context: companyContext
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        logger.debug(`[Recommendations] ✅ ${result.recommendations?.length || 0} recommandations reçues`);

        return result;

    } catch (error) {
        logger.error('[Recommendations] ❌ Erreur:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inattendue'
        };
    }
}

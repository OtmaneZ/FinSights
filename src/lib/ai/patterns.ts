/**
 * Détection de Patterns Avancés avec IA
 * Appelle l'API route /api/ai/patterns (server-side)
 */

import { FinancialRecord } from '@/lib/dataModel';
import { logger } from '@/lib/logger';

export type PatternType = 
    | 'seasonality'
    | 'correlation'
    | 'client_behavior'
    | 'cost_structure'
    | 'opportunity'
    | 'risk_signal';

export interface AdvancedPattern {
    type: PatternType;
    title: string;
    description: string;
    insight: string;
    impact?: string;
    confidence: number;
}

export interface PatternsResult {
    success: boolean;
    patterns?: AdvancedPattern[];
    error?: string;
}

/**
 * Détecte des patterns cachés dans les données financières
 */
export async function detectAdvancedPatterns(
    rawData: FinancialRecord[],
    context?: {
        sector?: string;
        companyName?: string;
        teamSize?: number;
    }
): Promise<PatternsResult> {
    try {
        logger.debug('[Patterns] 🔍 Appel API patterns...');

        const response = await fetch('/api/ai/patterns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rawData,
                context
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        logger.debug(`[Patterns] ✅ ${result.patterns?.length || 0} patterns détectés`);

        return result;

    } catch (error) {
        logger.error('[Patterns] ❌ Erreur:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inattendue'
        };
    }
}

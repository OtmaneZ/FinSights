/**
 * Prédictions Cash Flow avec IA
 * Analyse historique et prédit les 3 prochains mois
 */

import OpenAI from 'openai';
import { FinancialRecord } from '@/lib/dataModel';
import { logger } from '@/lib/logger';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://finsights.app',
        'X-Title': 'FinSight',
    }
});

export interface CashFlowPrediction {
    month: string; // "Janvier 2026"
    monthDate: Date; // Date object pour charting
    predicted: number; // Montant prédit
    confidence: number; // 0-100%
    scenario: 'optimistic' | 'realistic' | 'pessimistic';
    breakdown?: {
        expectedRevenue: number;
        expectedExpenses: number;
    };
}

export interface PredictionAlert {
    severity: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    action?: string;
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
    if (!rawData || rawData.length < 10) {
        return {
            success: false,
            error: 'Données insuffisantes pour générer des prédictions (minimum 10 transactions)'
        };
    }

    try {
        logger.debug('[Predictions] 🔮 Génération prédictions cash flow...');

        // Préparer résumé des données historiques
        const monthlyData = prepareMonthlyData(rawData);
        
        // Calculer tendances
        const trends = calculateTrends(monthlyData);

        // Construire prompt IA
        const systemPrompt = `
            Tu es un expert financier spécialisé dans les prévisions de trésorerie.
            Ta tâche est de prédire le cash flow des 3 prochains mois en analysant l'historique.

            Règles importantes :
            1. Détecte les patterns saisonniers (ex: pic en décembre, creux en août)
            2. Identifie les tendances de croissance/décroissance
            3. Prends en compte la volatilité historique
            4. Fournis 3 scénarios : optimiste, réaliste, pessimiste
            5. Génère des alertes si cash flow négatif prévu
            6. Suggère des actions concrètes si problème détecté

            Format de réponse EXACT (JSON) :
            {
                "predictions": [
                    {
                        "month": "Janvier 2026",
                        "predicted": 12500,
                        "confidence": 87,
                        "scenario": "realistic",
                        "breakdown": {
                            "expectedRevenue": 45000,
                            "expectedExpenses": 32500
                        }
                    }
                ],
                "alerts": [
                    {
                        "severity": "warning",
                        "title": "Trésorerie négative prévue",
                        "description": "Février 2026: -8000€ prévu",
                        "action": "Décaler charges AWS au 25 ou négocier délai paiement"
                    }
                ],
                "seasonalityDetected": true
            }
        `;

        const userPrompt = `
            Voici l'historique mensuel des 12 derniers mois :
            ${JSON.stringify(monthlyData, null, 2)}

            Tendances détectées :
            - Revenus: ${trends.revenueGrowth > 0 ? '+' : ''}${trends.revenueGrowth.toFixed(1)}% par mois
            - Dépenses: ${trends.expenseGrowth > 0 ? '+' : ''}${trends.expenseGrowth.toFixed(1)}% par mois
            - Volatilité cash flow: ${trends.volatility.toFixed(0)}€

            Prédit les 3 prochains mois de cash flow avec confiance et alertes.
        `;

        const response = await openai.chat.completions.create({
            model: "openai/gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3 // Basse température pour prédictions cohérentes
        });

        const rawJson = response.choices[0].message.content;
        if (!rawJson) {
            return { success: false, error: "Réponse IA vide" };
        }

        const result = JSON.parse(rawJson);

        // Valider et enrichir les prédictions
        const predictions: CashFlowPrediction[] = (result.predictions || []).map((p: any, index: number) => {
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + index + 1);

            return {
                month: p.month,
                monthDate: futureDate,
                predicted: p.predicted || 0,
                confidence: p.confidence || 70,
                scenario: p.scenario || 'realistic',
                breakdown: p.breakdown
            };
        });

        const alerts: PredictionAlert[] = (result.alerts || []).map((a: any) => ({
            severity: a.severity || 'info',
            title: a.title,
            description: a.description,
            action: a.action
        }));

        logger.debug(`[Predictions] ✅ ${predictions.length} mois prédits avec ${alerts.length} alertes`);

        return {
            success: true,
            predictions,
            alerts,
            seasonalityDetected: result.seasonalityDetected || false
        };

    } catch (error) {
        logger.error('[Predictions] ❌ Erreur génération prédictions:', error);
        if (error instanceof OpenAI.APIError) {
            return {
                success: false,
                error: `Erreur API OpenAI: ${error.message}`
            };
        }
        return {
            success: false,
            error: 'Erreur inattendue lors de la génération des prédictions'
        };
    }
}

/**
 * Prépare les données mensuelles pour l'analyse
 */
function prepareMonthlyData(rawData: FinancialRecord[]) {
    const monthlyMap: Record<string, { revenue: number; expenses: number; cashFlow: number; count: number }> = {};

    rawData.forEach(record => {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { revenue: 0, expenses: 0, cashFlow: 0, count: 0 };
        }

        if (record.type === 'income') {
            monthlyMap[monthKey].revenue += record.amount;
        } else {
            monthlyMap[monthKey].expenses += Math.abs(record.amount);
        }

        monthlyMap[monthKey].count += 1;
    });

    // Calculer cash flow et trier par date
    return Object.entries(monthlyMap)
        .map(([month, data]) => ({
            month,
            revenue: Math.round(data.revenue),
            expenses: Math.round(data.expenses),
            cashFlow: Math.round(data.revenue - data.expenses),
            transactionCount: data.count
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-12); // 12 derniers mois max
}

/**
 * Calcule les tendances de croissance
 */
function calculateTrends(monthlyData: any[]) {
    if (monthlyData.length < 2) {
        return { revenueGrowth: 0, expenseGrowth: 0, volatility: 0 };
    }

    const revenues = monthlyData.map(m => m.revenue);
    const expenses = monthlyData.map(m => m.expenses);
    const cashFlows = monthlyData.map(m => m.cashFlow);

    // Croissance moyenne mensuelle (régression linéaire simple)
    const revenueGrowth = calculateGrowthRate(revenues);
    const expenseGrowth = calculateGrowthRate(expenses);

    // Volatilité (écart-type du cash flow)
    const avgCashFlow = cashFlows.reduce((sum, cf) => sum + cf, 0) / cashFlows.length;
    const variance = cashFlows.reduce((sum, cf) => sum + Math.pow(cf - avgCashFlow, 2), 0) / cashFlows.length;
    const volatility = Math.sqrt(variance);

    return {
        revenueGrowth,
        expenseGrowth,
        volatility
    };
}

/**
 * Calcule le taux de croissance moyen
 */
function calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;

    const growthRates = [];
    for (let i = 1; i < values.length; i++) {
        if (values[i - 1] !== 0) {
            const growth = ((values[i] - values[i - 1]) / values[i - 1]) * 100;
            growthRates.push(growth);
        }
    }

    return growthRates.length > 0
        ? growthRates.reduce((sum, g) => sum + g, 0) / growthRates.length
        : 0;
}

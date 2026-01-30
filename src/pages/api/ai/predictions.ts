/**
 * API Route: Génération de prédictions cash flow avec IA
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { FinancialRecord } from '@/lib/dataModel';
import { logger } from '@/lib/logger';

// Lazy initialization - only create client when API key is present
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY) {
        return null;
    }
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1',
            defaultHeaders: {
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://finsights.app',
                'X-Title': 'FinSight',
            }
        });
    }
    return openaiClient;
}

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

interface PredictionsResponse {
    success: boolean;
    predictions?: CashFlowPrediction[];
    alerts?: PredictionAlert[];
    seasonalityDetected?: boolean;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PredictionsResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { records } = req.body as { records: FinancialRecord[] };

        if (!records || records.length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Au moins 10 transactions requises pour les prédictions'
            });
        }

        logger.debug('[API Predictions] Génération prédictions pour', records.length, 'transactions');

        // Préparer données mensuelles
        const monthlyData = prepareMonthlyData(records);
        const trends = calculateTrends(monthlyData);

        const systemPrompt = `
            Tu es un analyste financier expert en prévisions de trésorerie.
            Analyse l'historique de cash flow mensuel et génère des prédictions pour les 3 prochains mois.

            Règles :
            1. Prends en compte les tendances historiques ET la saisonnalité
            2. Fournis 3 scénarios par mois : optimiste (+15%), réaliste (tendance), pessimiste (-15%)
            3. Confiance basée sur la stabilité historique (volatilité faible = confiance haute)
            4. Génère des alertes si runway < 3 mois ou forte baisse prévue

            Format JSON EXACT :
            {
                "predictions": [
                    {
                        "month": "2025-01",
                        "predicted": 15000,
                        "confidence": 75,
                        "breakdown": {"optimistic": 17250, "realistic": 15000, "pessimistic": 12750}
                    }
                ],
                "alerts": [
                    {"type": "warning", "message": "Baisse 20% prévue en février", "month": "2025-02"}
                ],
                "seasonalityDetected": false
            }
        `;

        const userPrompt = `
            HISTORIQUE CASH FLOW MENSUEL :
            ${monthlyData.map(m => `${m.month}: ${m.cashFlow.toLocaleString('fr-FR')}€`).join('\n')}

            TENDANCES DÉTECTÉES :
            - Tendance moyenne: ${trends.avgTrend > 0 ? '+' : ''}${trends.avgTrend.toFixed(0)}€/mois
            - Volatilité: ${trends.volatility.toFixed(0)}€
            - Dernier mois: ${monthlyData[monthlyData.length - 1]?.cashFlow.toLocaleString('fr-FR')}€

            Génère les prédictions pour les 3 prochains mois.
        `;

        const client = getOpenAIClient();
        if (!client) {
            return res.status(200).json({
                success: true,
                predictions: [],
                alerts: [{ type: 'info' as const, message: 'Configuration IA manquante - prédictions non disponibles' }],
                seasonalityDetected: false
            });
        }

        const response = await client.chat.completions.create({
            model: "openai/gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3
        });

        const rawJson = response.choices[0].message.content;
        if (!rawJson) {
            throw new Error('Réponse IA vide');
        }

        const result = JSON.parse(rawJson);

        return res.status(200).json({
            success: true,
            predictions: result.predictions || [],
            alerts: result.alerts || [],
            seasonalityDetected: result.seasonalityDetected || false
        });

    } catch (error) {
        logger.error('[API Predictions] Erreur:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Erreur serveur'
        });
    }
}

function prepareMonthlyData(records: FinancialRecord[]) {
    const byMonth: Record<string, number> = {};

    records.forEach(r => {
        const date = new Date(r.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!byMonth[monthKey]) {
            byMonth[monthKey] = 0;
        }

        byMonth[monthKey] += r.type === 'income' ? r.amount : -Math.abs(r.amount);
    });

    return Object.entries(byMonth)
        .map(([month, cashFlow]) => ({ month, cashFlow }))
        .sort((a, b) => a.month.localeCompare(b.month));
}

function calculateTrends(monthlyData: { month: string; cashFlow: number }[]) {
    if (monthlyData.length < 2) {
        return { avgTrend: 0, volatility: 0 };
    }

    const trends: number[] = [];
    for (let i = 1; i < monthlyData.length; i++) {
        trends.push(monthlyData[i].cashFlow - monthlyData[i - 1].cashFlow);
    }

    const avgTrend = trends.reduce((sum, t) => sum + t, 0) / trends.length;
    const variance = trends.reduce((sum, t) => sum + Math.pow(t - avgTrend, 2), 0) / trends.length;
    const volatility = Math.sqrt(variance);

    return { avgTrend, volatility };
}

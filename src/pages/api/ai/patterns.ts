/**
 * API Route: Détection de patterns avancés avec IA
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

interface PatternsResponse {
    success: boolean;
    patterns?: AdvancedPattern[];
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PatternsResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { rawData, context } = req.body as {
            rawData: FinancialRecord[];
            context?: { sector?: string; companyName?: string };
        };

        if (!rawData || rawData.length < 20) {
            return res.status(200).json({ success: true, patterns: [] });
        }

        logger.debug('[API Patterns] Détection patterns pour', rawData.length, 'transactions');

        const aggregatedData = prepareAggregatedData(rawData);

        const systemPrompt = `
            Tu es un analyste financier expert spécialisé dans la détection de patterns cachés.

            Types de patterns à chercher :
            1. SEASONALITY : Variations saisonnières
            2. CORRELATION : Relations entre variables
            3. CLIENT_BEHAVIOR : Comportements clients récurrents
            4. COST_STRUCTURE : Anomalies dans structure coûts
            5. OPPORTUNITY : Opportunités d'optimisation
            6. RISK_SIGNAL : Signaux faibles de risque

            Principes :
            - Ne rapporte QUE les patterns significatifs (confiance >70%)
            - Quantifie quand possible
            - Limite à 3-5 patterns MAX

            Format JSON EXACT :
            {
                "patterns": [
                    {
                        "type": "seasonality",
                        "title": "Titre court",
                        "description": "Explication détaillée",
                        "insight": "Action suggérée",
                        "impact": "Impact quantifié",
                        "confidence": 85
                    }
                ]
            }
        `;

        const userPrompt = `
            DONNÉES FINANCIÈRES :
            ${aggregatedData}

            Analyse et détecte 3-5 patterns cachés significatifs.
        `;

        const client = getOpenAIClient();
        if (!client) {
            return res.status(200).json({
                success: true,
                patterns: []
            });
        }

        const response = await client.chat.completions.create({
            model: "openai/gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.6
        });

        const rawJson = response.choices[0].message.content;
        if (!rawJson) {
            throw new Error('Réponse IA vide');
        }

        const result = JSON.parse(rawJson);

        return res.status(200).json({
            success: true,
            patterns: result.patterns || []
        });

    } catch (error: any) {
        logger.error('[API Patterns] Erreur:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Erreur serveur'
        });
    }
}

function prepareAggregatedData(rawData: FinancialRecord[]): string {
    const lines: string[] = [];

    const totalRevenue = rawData.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = rawData.filter(r => r.type === 'expense').reduce((sum, r) => sum + Math.abs(r.amount), 0);

    lines.push(`📊 ${rawData.length} transactions`);
    lines.push(`CA: ${totalRevenue.toLocaleString('fr-FR')}€`);
    lines.push(`Charges: ${totalExpenses.toLocaleString('fr-FR')}€`);

    // Monthly aggregation
    const monthlyData = aggregateByMonth(rawData);
    if (monthlyData.length > 0) {
        lines.push(`\n📅 ÉVOLUTION MENSUELLE:`);
        monthlyData.slice(-6).forEach(m => {
            lines.push(`${m.month}: CA ${m.revenue.toLocaleString('fr-FR')}€, Net ${m.net.toLocaleString('fr-FR')}€`);
        });
    }

    return lines.join('\n');
}

function aggregateByMonth(rawData: FinancialRecord[]) {
    const byMonth: Record<string, { revenue: number; expenses: number }> = {};

    rawData.forEach(r => {
        const date = new Date(r.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!byMonth[monthKey]) {
            byMonth[monthKey] = { revenue: 0, expenses: 0 };
        }

        if (r.type === 'income') {
            byMonth[monthKey].revenue += r.amount;
        } else {
            byMonth[monthKey].expenses += Math.abs(r.amount);
        }
    });

    return Object.entries(byMonth)
        .map(([month, data]) => ({
            month,
            revenue: data.revenue,
            expenses: data.expenses,
            net: data.revenue - data.expenses
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
}

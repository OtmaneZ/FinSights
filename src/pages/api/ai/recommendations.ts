/**
 * API Route: Génération de recommandations intelligentes avec IA
 * Modèle : claude-opus-4-5 via OpenRouter (baseURL openrouter.ai/api/v1, clé OPENAI_API_KEY)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { FinancialRecord } from '@/lib/dataModel';
import { ScoreBreakdown, ScoreFactors, ScoreLevel } from '@/lib/scoring/finSightScore';
import { logger } from '@/lib/logger';

// Lazy initialization - only create client when API key is present
let openrouterClient: OpenAI | null = null;

function getOpenRouterClient(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY) {
        return null;
    }
    if (!openrouterClient) {
        openrouterClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1',
        });
    }
    return openrouterClient;
}

interface RecommendationsResponse {
    success: boolean;
    recommendations?: string[];
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RecommendationsResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { breakdown, factors, level, rawData, context } = req.body as {
            breakdown: ScoreBreakdown;
            factors: ScoreFactors;
            level: ScoreLevel;
            rawData: FinancialRecord[];
            context?: { sector?: string; companyName?: string };
        };

        logger.debug('[API Recommendations] Génération recommandations...');

        const financialContext = prepareFinancialContext(breakdown, factors, level, rawData);

        const systemPrompt = `
            Tu es un CFO expérimenté et conseiller financier expert.
            Ta mission : analyser la situation financière d'une entreprise et fournir 3-5 recommandations CONCRÈTES et PRIORISÉES.

            Principes clés :
            1. PRIORISATION : Classe par urgence (PRIORITÉ 1 = critique/urgent, 2 = important, 3 = optimisation)
            2. ACTIONNABLE : Chaque recommandation DOIT avoir une action concrète à réaliser
            3. QUANTIFIÉ : Donne un impact chiffré quand possible (ex: "+15k€ cash", "réduction 20% charges")
            4. CONTEXTUEL : Adapte au secteur, taille, et situation spécifique
            5. RÉALISTE : Recommandations faisables pour une PME/startup

            Format JSON EXACT :
            {
                "recommendations": [
                    "🎯 PRIORITÉ 1: [Titre court] - [Impact] - [Action concrète]",
                    "💡 PRIORITÉ 2: [Titre] - [Impact] - [Action]"
                ]
            }
        `;

        const userPrompt = `
            CONTEXTE ENTREPRISE :
            ${context?.sector || 'Non spécifié'}

            SCORE FINSIGHT™ : ${breakdown.cash + breakdown.margin + breakdown.resilience + breakdown.risk}/100 (${level})
            - Trésorerie: ${breakdown.cash}/25 ${breakdown.cash < 15 ? '⚠️ FAIBLE' : ''}
            - Marges: ${breakdown.margin}/25 ${breakdown.margin < 15 ? '⚠️ FAIBLE' : ''}
            - Résilience: ${breakdown.resilience}/25 ${breakdown.resilience < 15 ? '⚠️ FAIBLE' : ''}
            - Risques: ${breakdown.risk}/25 ${breakdown.risk < 15 ? '⚠️ ÉLEVÉ' : ''}

            INDICATEURS CLÉS :
            ${financialContext}

            Génère 3-5 recommandations priorisées et actionnables.
        `;

        const client = getOpenRouterClient();
        if (!client) {
            // Return default recommendations when AI not available
            return res.status(200).json({
                success: true,
                recommendations: [
                    '📊 Analysez vos flux de trésorerie mensuels pour identifier les tendances',
                    '💰 Optimisez vos délais de paiement clients (DSO)',
                    '📉 Réduisez les dépenses non essentielles pour améliorer vos marges',
                    '🎯 Diversifiez votre base client pour réduire la dépendance'
                ]
            });
        }

        const completion = await client.chat.completions.create({
            model: 'anthropic/claude-opus-4-5',
            max_tokens: 1024,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        });

        const rawContent = completion.choices[0]?.message?.content ?? '';
        if (!rawContent) {
            throw new Error('Réponse Opus vide');
        }

        // Parse JSON from response (may be wrapped in markdown code blocks)
        let jsonContent = rawContent;
        const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1].trim();
        }
        
        const result = JSON.parse(jsonContent);

        return res.status(200).json({
            success: true,
            recommendations: result.recommendations || []
        });

    } catch (error: any) {
        logger.error('[API Recommendations] Erreur:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Erreur serveur'
        });
    }
}

function prepareFinancialContext(
    breakdown: ScoreBreakdown,
    factors: ScoreFactors,
    level: ScoreLevel,
    rawData: FinancialRecord[]
): string {
    const lines: string[] = [];

    lines.push(`💰 Cash Flow Net: ${(factors.cashFlowNet || 0).toLocaleString('fr-FR')}€`);
    
    if (factors.runway !== null && factors.runway !== undefined) {
        lines.push(`📅 Runway: ${factors.runway.toFixed(1)} mois ${factors.runway < 6 ? '⚠️ CRITIQUE' : ''}`);
    }

    if (factors.dso !== null && factors.dso !== undefined && factors.dso > 0) {
        lines.push(`📅 DSO: ${factors.dso} jours ${factors.dso > 60 ? '⚠️ ÉLEVÉ' : ''}`);
    }

    lines.push(`📊 Marge Nette: ${(factors.marginPercentage || 0).toFixed(1)}%`);
    lines.push(`📈 Croissance CA: ${(factors.revenueGrowth || 0) > 0 ? '+' : ''}${(factors.revenueGrowth || 0).toFixed(1)}%`);
    lines.push(`🏢 Charges Fixes: ${factors.fixedCostsRatio || 0}% du CA`);
    lines.push(`👥 Dépendance Top Client: ${factors.topClientDependency || 0}%`);

    return lines.join('\n');
}

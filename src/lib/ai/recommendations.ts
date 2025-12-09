/**
 * Recommandations IA Contextuelles
 * Génère des recommandations priorisées et actionnables avec GPT-4
 */

import OpenAI from 'openai';
import { FinancialRecord } from '@/lib/dataModel';
import { ScoreBreakdown, ScoreFactors, ScoreLevel } from '@/lib/scoring/finSightScore';
import { logger } from '@/lib/logger';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://finsights.app',
        'X-Title': 'FinSight',
    }
});

export interface SmartRecommendation {
    priority: 1 | 2 | 3; // 1 = urgent, 2 = important, 3 = nice-to-have
    title: string;
    description: string;
    impact?: string; // Estimation impact quantifié
    action?: string; // Action concrète à faire
}

export interface RecommendationsResult {
    success: boolean;
    recommendations?: string[]; // Format compatible avec FinSightScore existant
    smartRecommendations?: SmartRecommendation[]; // Format détaillé
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
        logger.debug('[Recommendations] 💡 Génération recommandations IA...');

        // Préparer contexte financier enrichi
        const financialContext = prepareFinancialContext(breakdown, factors, level, rawData);

        // Construire prompt IA
        const systemPrompt = `
            Tu es un CFO expérimenté et conseiller financier expert.
            Ta mission : analyser la situation financière d'une entreprise et fournir 3-5 recommandations CONCRÈTES et PRIORISÉES.

            Principes clés :
            1. PRIORISATION : Classe par urgence (PRIORITÉ 1 = critique/urgent, 2 = important, 3 = optimisation)
            2. ACTIONNABLE : Chaque recommandation DOIT avoir une action concrète à réaliser
            3. QUANTIFIÉ : Donne un impact chiffré quand possible (ex: "+15k€ cash", "réduction 20% charges")
            4. CONTEXTUEL : Adapte au secteur, taille, et situation spécifique
            5. RÉALISTE : Recommandations faisables pour une PME/startup (pas de "levez 10M€")

            Format de réponse EXACT (JSON) :
            {
                "recommendations": [
                    "🎯 PRIORITÉ 1: [Titre court] - [Impact] - [Action concrète]",
                    "💡 PRIORITÉ 2: [Titre] - [Impact] - [Action]",
                    "📊 PRIORITÉ 3: [Titre] - [Impact] - [Action]"
                ]
            }

            Exemples de bonnes recommandations :
            - "🎯 PRIORITÉ 1: Sécuriser trésorerie (runway 4 mois critique) - Négocier paiement annuel top 3 clients = +80k€ cash immédiat"
            - "💡 PRIORITÉ 2: Diversifier portefeuille (45% CA sur 1 client) - Cibler 3 clients secteur X/Y/Z via partenariat distributeur"
            - "📊 PRIORITÉ 3: Optimiser charges AWS (8k€/an) - Basculer réservations instances = économie 18%"
        `;

        const userPrompt = `
            CONTEXTE ENTREPRISE :
            ${companyContext?.sector ? `Secteur: ${companyContext.sector}` : ''}
            ${companyContext?.teamSize ? `Taille équipe: ${companyContext.teamSize} personnes` : ''}

            SCORE FINSIGHT™ : ${breakdown.cash + breakdown.margin + breakdown.resilience + breakdown.risk}/100 (${level})
            - Trésorerie: ${breakdown.cash}/25 ${breakdown.cash < 15 ? '⚠️ FAIBLE' : breakdown.cash > 20 ? '✅ BON' : ''}
            - Marges: ${breakdown.margin}/25 ${breakdown.margin < 15 ? '⚠️ FAIBLE' : breakdown.margin > 20 ? '✅ BON' : ''}
            - Résilience: ${breakdown.resilience}/25 ${breakdown.resilience < 15 ? '⚠️ FAIBLE' : breakdown.resilience > 20 ? '✅ BON' : ''}
            - Risques: ${breakdown.risk}/25 ${breakdown.risk < 15 ? '⚠️ ÉLEVÉ' : breakdown.risk > 20 ? '✅ MAÎTRISÉ' : ''}

            INDICATEURS CLÉS :
            ${financialContext}

            DONNÉES HISTORIQUE :
            - ${rawData.length} transactions analysées
            - Période: ${rawData.length > 0 ? getDateRange(rawData) : 'N/A'}

            Génère 3-5 recommandations priorisées et actionnables, adaptées à cette situation spécifique.
        `;

        const response = await openai.chat.completions.create({
            model: "openai/gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7 // Un peu de créativité pour recommandations variées
        });

        const rawJson = response.choices[0].message.content;
        if (!rawJson) {
            return { success: false, error: "Réponse IA vide" };
        }

        const result = JSON.parse(rawJson);
        const recommendations: string[] = result.recommendations || [];

        logger.debug(`[Recommendations] ✅ ${recommendations.length} recommandations générées`);

        return {
            success: true,
            recommendations, // Format compatible existant
        };

    } catch (error) {
        logger.error('[Recommendations] ❌ Erreur génération recommandations:', error);
        if (error instanceof OpenAI.APIError) {
            return {
                success: false,
                error: `Erreur API OpenAI: ${error.message}`
            };
        }
        return {
            success: false,
            error: 'Erreur inattendue lors de la génération des recommandations'
        };
    }
}

/**
 * Prépare le contexte financier pour l'IA
 */
function prepareFinancialContext(
    breakdown: ScoreBreakdown,
    factors: ScoreFactors,
    level: ScoreLevel,
    rawData: FinancialRecord[]
): string {
    const lines: string[] = [];

    // Cash Flow & Runway
    lines.push(`💰 Cash Flow Net: ${factors.cashFlowNet.toLocaleString('fr-FR')}€`);
    if (factors.runway < 6) {
        lines.push(`⚠️ Runway CRITIQUE: ${factors.runway.toFixed(1)} mois de trésorerie`);
    } else {
        lines.push(`✅ Runway: ${factors.runway.toFixed(1)} mois`);
    }

    // DSO
    if (factors.dso > 0) {
        lines.push(`📅 DSO: ${factors.dso} jours ${factors.dso > 60 ? '⚠️ ÉLEVÉ' : factors.dso < 30 ? '✅ EXCELLENT' : ''}`);
    }

    // Marges
    lines.push(`📊 Marge Nette: ${factors.marginPercentage.toFixed(1)}% ${factors.marginPercentage < 10 ? '⚠️ FAIBLE' : factors.marginPercentage > 20 ? '✅ EXCELLENTE' : ''}`);
    lines.push(`📈 Croissance CA: ${factors.revenueGrowth > 0 ? '+' : ''}${factors.revenueGrowth.toFixed(1)}%`);
    lines.push(`📉 Croissance Charges: ${factors.expenseGrowth > 0 ? '+' : ''}${factors.expenseGrowth.toFixed(1)}%`);

    // Résilience
    lines.push(`🏢 Charges Fixes: ${factors.fixedCostsRatio}% du CA ${factors.fixedCostsRatio > 70 ? '⚠️ ÉLEVÉ' : '✅'}`);
    lines.push(`👥 Dépendance Top Client: ${factors.topClientDependency}% du CA ${factors.topClientDependency > 50 ? '⚠️ RISQUE' : factors.topClientDependency < 20 ? '✅ DIVERSIFIÉ' : ''}`);
    lines.push(`📂 Diversité Catégories: ${factors.categoryDiversity} catégories actives`);

    // Risques
    if (factors.anomalyCount > 0) {
        lines.push(`🔍 ${factors.anomalyCount} anomalie(s) détectée(s) ${factors.criticalAnomalies > 0 ? `dont ${factors.criticalAnomalies} critique(s)` : ''}`);
    }

    // Top dépenses/revenus
    const topExpenses = getTopExpenses(rawData, 3);
    if (topExpenses.length > 0) {
        lines.push(`💸 Top 3 Charges: ${topExpenses.map(e => `${e.name} (${e.total.toLocaleString('fr-FR')}€)`).join(', ')}`);
    }

    const topClients = getTopClients(rawData, 3);
    if (topClients.length > 0) {
        lines.push(`🎯 Top 3 Clients: ${topClients.map(c => `${c.name} (${c.total.toLocaleString('fr-FR')}€)`).join(', ')}`);
    }

    return lines.join('\n');
}

/**
 * Get date range from transactions
 */
function getDateRange(rawData: FinancialRecord[]): string {
    if (rawData.length === 0) return 'N/A';

    const dates = rawData.map(r => new Date(r.date).getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    return `${minDate.toLocaleDateString('fr-FR')} → ${maxDate.toLocaleDateString('fr-FR')}`;
}

/**
 * Get top expenses by category
 */
function getTopExpenses(rawData: FinancialRecord[], limit: number = 3) {
    const byCategory: Record<string, number> = {};

    rawData
        .filter(r => r.type === 'expense')
        .forEach(r => {
            const cat = r.category || 'Autres';
            byCategory[cat] = (byCategory[cat] || 0) + Math.abs(r.amount);
        });

    return Object.entries(byCategory)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);
}

/**
 * Get top clients by revenue
 */
function getTopClients(rawData: FinancialRecord[], limit: number = 3) {
    const byClient: Record<string, number> = {};

    rawData
        .filter(r => r.type === 'income')
        .forEach(r => {
            const client = r.counterparty || 'Inconnu';
            byClient[client] = (byClient[client] || 0) + r.amount;
        });

    return Object.entries(byClient)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);
}

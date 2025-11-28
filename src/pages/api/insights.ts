import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FinSightDataModel, AIAlert, AIRecommendation, AIResponse } from '@/lib/dataModel';

// Configuration OpenAI - à remplacer par vos clés
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface InsightsRequest {
    data: FinSightDataModel;
    query?: string;
    type?: 'full_analysis' | 'query_response' | 'alerts_only';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 🔐 AUTH CHECK - Optional but recommended
    const session = await getServerSession(req, res, authOptions);
    const isAuthenticated = !!session?.user;

    // Note: API insights peut rester publique pour la démo
    // Si tu veux la restreindre, décommente ci-dessous:
    // if (!isAuthenticated) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

    try {
        const { data, query, type = 'full_analysis' }: InsightsRequest = req.body;

        if (!data) {
            return res.status(400).json({ error: 'Données financières requises' });
        }

        // Analyse selon le type demandé
        let result;
        switch (type) {
            case 'full_analysis':
                result = await generateFullAnalysis(data);
                break;
            case 'query_response':
                if (!query) {
                    return res.status(400).json({ error: 'Question requise pour ce type d\'analyse' });
                }
                result = await generateQueryResponse(data, query);
                break;
            case 'alerts_only':
                result = await generateAlertsOnly(data);
                break;
            default:
                return res.status(400).json({ error: 'Type d\'analyse non supporté' });
        }

        return res.status(200).json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erreur API insights:', error);

        // Fallback vers analyse locale si OpenAI échoue
        if (error instanceof Error && error.message.includes('OpenAI')) {
            console.log('Fallback vers analyse locale...');
            const fallbackResult = generateLocalAnalysis(req.body.data);
            return res.status(200).json({
                success: true,
                data: fallbackResult,
                fallback: true,
                timestamp: new Date().toISOString()
            });
        }

        return res.status(500).json({
            error: 'Erreur lors de la génération des insights',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
}

// ===== FONCTIONS D'ANALYSE =====

async function generateFullAnalysis(data: FinSightDataModel) {
    const prompt = createAnalysisPrompt(data);

    try {
        const aiResponse = await callOpenAI(prompt);
        const parsed = parseAIAnalysis(aiResponse);

        return {
            alerts: parsed.alerts,
            recommendations: parsed.recommendations,
            summary: parsed.summary,
            riskScore: calculateRiskScore(data),
            source: 'openai'
        };
    } catch (error) {
        console.error('Erreur OpenAI:', error);
        return generateLocalAnalysis(data);
    }
}

async function generateQueryResponse(data: FinSightDataModel, query: string): Promise<AIResponse> {
    const prompt = createQueryPrompt(data, query);

    try {
        const aiResponse = await callOpenAI(prompt);

        return {
            answer: aiResponse,
            confidence: 0.85,
            sources: ['financial_data', 'kpi_analysis'],
            suggestions: generateFollowUpQuestions(query),
            followUp: ['Voulez-vous voir les détails?', 'Souhaitez-vous une prédiction?']
        };
    } catch (error) {
        console.error('Erreur requête IA:', error);
        return generateLocalQueryResponse(data, query);
    }
}

async function generateAlertsOnly(data: FinSightDataModel) {
    const alerts = analyzeForAlerts(data);

    return {
        alerts,
        alertCount: alerts.length,
        criticalCount: alerts.filter(a => a.type === 'urgent').length,
        source: 'local'
    };
}

// ===== OPENAI INTEGRATION =====

async function callOpenAI(prompt: string): Promise<string> {
    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini', // Modèle le plus récent et économique
            messages: [
                {
                    role: 'system',
                    content: `Tu es un expert financier français spécialisé dans l'analyse de PME/ETI.
                   Tu analyses des données financières et fournis des insights précis et actionnables.
                   Réponds toujours en français professionnel.`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 1500,
            temperature: 0.3
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content || '';
}

function createAnalysisPrompt(data: FinSightDataModel): string {
    const { kpis, period, recordCount } = data;

    return `
Analyse financière pour une PME française:

PÉRIODE: ${period.label}
TRANSACTIONS: ${recordCount} enregistrements

KPIS ACTUELS:
- Chiffre d'affaires: ${kpis.revenue.formatted} (${kpis.revenue.changeFormatted})
- Charges: ${kpis.expenses.formatted} (${kpis.expenses.changeFormatted})
- Marge: ${kpis.margin.formatted} (${kpis.margin.changeFormatted})
- Trésorerie: ${kpis.cashFlow.formatted} (${kpis.cashFlow.changeFormatted})
- DSO: ${kpis.dso.formatted} (${kpis.dso.changeFormatted})

DEMANDE:
1. Identifie 3-5 alertes prioritaires (urgent/warning/info)
2. Propose 3-4 recommandations concrètes avec impact chiffré
3. Fournis un résumé exécutif en 2-3 phrases

Format JSON attendu:
{
  "alerts": [{"type": "urgent", "title": "...", "description": "...", "impact": "..."}],
  "recommendations": [{"category": "cash_flow", "title": "...", "description": "...", "impact": "...", "potentialGain": 1000}],
  "summary": "Résumé de la situation financière..."
}
`;
}

function createQueryPrompt(data: FinSightDataModel, query: string): string {
    const context = `
Données financières disponibles:
- CA: ${data.kpis.revenue.formatted}
- Marge: ${data.kpis.margin.formatted}
- Trésorerie: ${data.kpis.cashFlow.formatted}
- DSO: ${data.kpis.dso.formatted}
- Période: ${data.period.label}
- ${data.recordCount} transactions
`;

    return `${context}\n\nQuestion: ${query}\n\nRéponds de manière précise et professionnelle en français.`;
}

// ===== ANALYSES LOCALES (FALLBACK) =====

function generateLocalAnalysis(data: FinSightDataModel) {
    return {
        alerts: analyzeForAlerts(data),
        recommendations: generateLocalRecommendations(data),
        summary: generateLocalSummary(data),
        riskScore: calculateRiskScore(data),
        source: 'local'
    };
}

function analyzeForAlerts(data: FinSightDataModel): AIAlert[] {
    const alerts: AIAlert[] = [];
    const { kpis } = data;

    // Alerte trésorerie
    if (kpis.cashFlow.value < 0) {
        alerts.push({
            id: 'cash_negative',
            type: 'urgent',
            title: 'Trésorerie négative',
            description: `Flux de trésorerie négatif de ${kpis.cashFlow.formatted}`,
            impact: 'Risque de rupture de paiement',
            action: 'Revoir les délais de paiement clients',
            priority: 1
        });
    }

    // Alerte marge
    if (kpis.margin.value < 10) {
        alerts.push({
            id: 'margin_low',
            type: 'warning',
            title: 'Marge faible',
            description: `Marge de seulement ${kpis.margin.formatted}`,
            impact: 'Rentabilité insuffisante',
            action: 'Optimiser les coûts ou augmenter les prix',
            priority: 2
        });
    }

    // Alerte DSO
    if (kpis.dso.value > 45) {
        alerts.push({
            id: 'dso_high',
            type: 'warning',
            title: 'Délais de paiement élevés',
            description: `DSO de ${kpis.dso.formatted}`,
            impact: 'Impact négatif sur la trésorerie',
            action: 'Relancer les impayés',
            priority: 3
        });
    }

    return alerts.sort((a, b) => a.priority - b.priority);
}

function generateLocalRecommendations(data: FinSightDataModel): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const { kpis } = data;

    if (kpis.cashFlow.value < 5000) {
        recommendations.push({
            id: 'improve_cashflow',
            category: 'cash_flow',
            title: 'Améliorer le recouvrement',
            description: 'Mettre en place un suivi systématique des créances',
            impact: 'Réduction du DSO de 10 jours',
            effort: 'low',
            potentialGain: 2000,
            priority: 1
        });
    }

    return recommendations;
}

function generateLocalSummary(data: FinSightDataModel): string {
    const { kpis } = data;
    return `Analyse de ${data.recordCount} transactions sur ${data.period.label}.
          CA de ${kpis.revenue.formatted} avec une marge de ${kpis.margin.formatted}.
          Points d'attention: trésorerie et délais de paiement.`;
}

function generateLocalQueryResponse(data: FinSightDataModel, query: string): AIResponse {
    // Réponses basiques selon des mots-clés
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('trésorerie') || lowerQuery.includes('cash')) {
        return {
            answer: `Votre trésorerie actuelle est de ${data.kpis.cashFlow.formatted}. ${data.kpis.cashFlow.value < 0 ? 'Attention, elle est négative.' : 'Elle est positive.'
                }`,
            confidence: 0.9,
            sources: ['cashflow_kpi'],
            suggestions: ['Comment améliorer ma trésorerie?', 'Prédiction à 90 jours?']
        };
    }

    if (lowerQuery.includes('marge') || lowerQuery.includes('rentabilité')) {
        return {
            answer: `Votre marge actuelle est de ${data.kpis.margin.formatted}. ${data.kpis.margin.value < 15 ? 'Elle pourrait être optimisée.' : 'Elle est correcte.'
                }`,
            confidence: 0.9,
            sources: ['margin_analysis'],
            suggestions: ['Comment améliorer ma marge?', 'Benchmark sectoriel?']
        };
    }

    return {
        answer: 'Je n\'ai pas suffisamment d\'informations pour répondre précisément à cette question.',
        confidence: 0.3,
        sources: [],
        suggestions: ['Posez une question sur la trésorerie', 'Demandez une analyse de marge']
    };
}

// ===== UTILITAIRES =====

function calculateRiskScore(data: FinSightDataModel): number {
    let score = 50; // Score de base

    const { kpis } = data;

    // Facteurs de risque
    if (kpis.cashFlow.value < 0) score += 30;
    if (kpis.margin.value < 10) score += 20;
    if (kpis.dso.value > 60) score += 15;

    // Facteurs positifs
    if (kpis.cashFlow.value > 10000) score -= 15;
    if (kpis.margin.value > 25) score -= 10;

    return Math.min(100, Math.max(0, score));
}

function parseAIAnalysis(aiResponse: string) {
    try {
        return JSON.parse(aiResponse);
    } catch {
        // Fallback si parsing JSON échoue
        return {
            alerts: [],
            recommendations: [],
            summary: aiResponse.substring(0, 200) + '...'
        };
    }
}

function generateFollowUpQuestions(query: string): string[] {
    return [
        'Voulez-vous voir les détails?',
        'Souhaitez-vous une prédiction?',
        'Comment puis-je améliorer cette situation?'
    ];
}
/**
 * API Route: Analyse TRESORIS avec IA réelle
 * Utilise OpenRouter (Gemini 2.5 Flash) pour analyse intelligente des risques clients
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Lazy initialization
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY) {
        return null
    }
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1',
            defaultHeaders: {
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://finsights.app',
                'X-Title': 'FinSight TRESORIS',
            }
        })
    }
    return openaiClient
}

interface AnalyzeRequest {
    client_name: string
    amount: number
    days_overdue: number
    context?: {
        current_runway_weeks?: number
        existing_warnings?: number
        company_sector?: string
    }
}

interface AIAnalysisResult {
    risk_assessment: {
        score: number // 0-100
        rating: 'A' | 'B' | 'C' | 'D'
        reasoning: string
    }
    warnings: Array<{
        type: string
        severity: 'low' | 'medium' | 'high' | 'critical'
        message: string
        reasoning: string
    }>
    actions: Array<{
        priority: 'P1' | 'P2' | 'P3'
        title: string
        description: string
        deadline_days: number
        expected_impact: string
    }>
    cash_impact: {
        runway_impact_weeks: number
        urgency_level: 'immediate' | 'high' | 'moderate' | 'low'
        mitigation_strategy: string
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: AnalyzeRequest = await request.json()
        const { client_name, amount, days_overdue, context } = body

        // Validation
        if (!client_name || !amount || typeof days_overdue !== 'number') {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const client = getOpenAIClient()
        
        // Fallback si pas de clé API
        if (!client) {
            console.warn('⚠️ OpenAI API key missing - using rule-based fallback')
            return NextResponse.json(generateRuleBasedAnalysis(body))
        }

        // Prompt système pour TRESORIS
        const systemPrompt = `Tu es TRESORIS, un agent IA expert en gestion de risque client et trésorerie pour PME/Scale-ups.

Tu analyses les factures impayées et génères :
1. RISK ASSESSMENT : Score 0-100 et rating A/B/C/D avec raisonnement
2. WARNINGS : Alertes graduées (low/medium/high/critical) avec contexte
3. ACTIONS : Recommandations P1/P2/P3 avec deadlines et impact attendu
4. CASH IMPACT : Impact runway + stratégie de mitigation

Principes :
- Contextuel : adapte selon montant, retard, secteur
- Actionnable : toute action doit être concrète et mesurable
- Gradué : P1 = urgent (2-3j), P2 = important (1 semaine), P3 = préventif (2 semaines)
- Réaliste : n'exagère pas le risque, reste factuel

Format JSON EXACT obligatoire.`

        const userPrompt = `CONTEXTE ENTREPRISE :
- Secteur: ${context?.company_sector || 'SaaS B2B'}
- Runway actuel: ${context?.current_runway_weeks || 18} semaines
- Alertes existantes: ${context?.existing_warnings || 3}

FACTURE À ANALYSER :
- Client: ${client_name}
- Montant: ${(amount / 1000).toFixed(0)}K€
- Retard: ${days_overdue} jours

MISSION : Analyse approfondie du risque et génération d'actions prioritaires.

Retourne JSON avec structure :
{
  "risk_assessment": {
    "score": number,
    "rating": "A" | "B" | "C" | "D",
    "reasoning": "Explication du rating"
  },
  "warnings": [{
    "type": "CLIENT_PAYMENT_DELAY" | "CASH_RUNWAY_LOW" | "MAJOR_CLIENT_RISK",
    "severity": "critical" | "high" | "medium" | "low",
    "message": "Alerte concise",
    "reasoning": "Pourquoi c'est un problème"
  }],
  "actions": [{
    "priority": "P1" | "P2" | "P3",
    "title": "Titre court action",
    "description": "Détail de l'action à mener",
    "deadline_days": number,
    "expected_impact": "Impact financier attendu"
  }],
  "cash_impact": {
    "runway_impact_weeks": number,
    "urgency_level": "immediate" | "high" | "moderate" | "low",
    "mitigation_strategy": "Stratégie pour limiter l'impact"
  }
}`

        console.log('🤖 [TRESORIS] Calling AI for analysis...')
        
        const response = await client.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free", // Gratuit pour démo
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 2000
        })

        const rawJson = response.choices[0].message.content
        if (!rawJson) {
            throw new Error('Empty AI response')
        }

        const aiResult: AIAnalysisResult = JSON.parse(rawJson)
        
        console.log('✅ [TRESORIS] AI analysis complete:', {
            rating: aiResult.risk_assessment.rating,
            warnings: aiResult.warnings.length,
            actions: aiResult.actions.length
        })

        return NextResponse.json({
            success: true,
            analysis: aiResult,
            powered_by: 'ai'
        })

    } catch (error) {
        console.error('❌ [TRESORIS] Analysis error:', error)
        
        // Fallback sur règles simples si IA échoue
        return NextResponse.json({
            success: true,
            analysis: generateRuleBasedAnalysis(await request.json()),
            powered_by: 'rules',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

// Fallback rule-based (comme avant, mais structuré comme l'IA)
function generateRuleBasedAnalysis(data: AnalyzeRequest): { analysis: AIAnalysisResult } {
    const { client_name, amount, days_overdue, context } = data
    
    // Simple scoring
    let score = 0
    let rating: 'A' | 'B' | 'C' | 'D' = 'A'
    
    if (days_overdue === 0) {
        score = Math.min(30, (amount / 10000) * 5)
        rating = 'A'
    } else if (days_overdue <= 30) {
        score = Math.min(50, 30 + days_overdue + (amount / 10000) * 3)
        rating = 'B'
    } else if (days_overdue <= 60) {
        score = Math.min(75, 50 + (days_overdue - 30) + (amount / 10000) * 5)
        rating = 'C'
    } else {
        score = Math.min(95, 70 + (days_overdue - 60) * 0.5 + (amount / 10000) * 8)
        rating = 'D'
    }

    const runwayBefore = context?.current_runway_weeks || 18
    const weeklyBurn = 45000
    const impactWeeks = Math.round(amount / weeklyBurn)

    const analysis: AIAnalysisResult = {
        risk_assessment: {
            score: Math.round(score),
            rating,
            reasoning: `Score calculé sur montant (${(amount/1000).toFixed(0)}K€) et retard (${days_overdue}j)`
        },
        warnings: [],
        actions: [],
        cash_impact: {
            runway_impact_weeks: impactWeeks,
            urgency_level: days_overdue > 60 ? 'immediate' : days_overdue > 30 ? 'high' : 'moderate',
            mitigation_strategy: `Recouvrement prioritaire + négociation délais de paiement`
        }
    }

    // Warnings
    if (days_overdue > 0) {
        analysis.warnings.push({
            type: 'CLIENT_PAYMENT_DELAY',
            severity: days_overdue > 60 ? 'critical' : days_overdue > 30 ? 'high' : 'medium',
            message: `${client_name} : retard de ${days_overdue} jours`,
            reasoning: `Retard inhabituel nécessitant action rapide`
        })
    }

    // Actions
    if (days_overdue > 45) {
        analysis.actions.push({
            priority: 'P1',
            title: `Relance urgente ${client_name}`,
            description: 'Appel immédiat + email formel avec échéancier',
            deadline_days: 2,
            expected_impact: `Récupération de ${(amount/1000).toFixed(0)}K€`
        })
    }

    return { analysis }
}

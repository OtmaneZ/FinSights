import { NextRequest, NextResponse } from 'next/server'
import type { SimulationRequest, SimulationResult, Warning, Action } from '@/components/tresoris/types'

/**
 * POST /api/tresoris/simulate
 * 
 * Simule l'impact d'une facture impayée sur la trésorerie.
 * Utilise l'IA (Gemini via OpenRouter) pour analyse intelligente.
 */
export async function POST(request: NextRequest) {
    try {
        const body: SimulationRequest = await request.json()
        const { client_name, amount, days_overdue } = body

        // Validation
        if (!client_name || !amount || typeof days_overdue !== 'number') {
            return NextResponse.json(
                { error: 'Missing required fields: client_name, amount, days_overdue' },
                { status: 400 }
            )
        }

        console.log('🎯 [TRESORIS Simulate] Starting AI analysis...', { client_name, amount, days_overdue })

        // Appel à l'API d'analyse IA
        const analyzeResponse = await fetch(new URL('/api/tresoris/analyze', request.url).toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_name,
                amount,
                days_overdue,
                context: {
                    current_runway_weeks: 18,
                    existing_warnings: 3,
                    company_sector: 'SaaS B2B'
                }
            })
        })

        if (!analyzeResponse.ok) {
            throw new Error('AI analysis failed')
        }

        const { analysis, powered_by } = await analyzeResponse.json()
        
        console.log(`✅ [TRESORIS Simulate] Analysis complete (powered by: ${powered_by})`)

        // Calcul de l'impact runway
        const runwayBefore = 18
        const runwayAfter = Math.max(0, runwayBefore - analysis.cash_impact.runway_impact_weeks)

        // Conversion du format IA vers SimulationResult
        const result: SimulationResult = {
            runway_before_weeks: runwayBefore,
            runway_after_weeks: runwayAfter,
            runway_delta_weeks: analysis.cash_impact.runway_impact_weeks,
            
            client_rating_before: null,
            client_rating_after: analysis.risk_assessment.rating,
            client_score_before: null,
            client_score_after: analysis.risk_assessment.score,
            rating_changed: true,
            
            risk_status: analysis.cash_impact.urgency_level === 'immediate' ? 'CRITICAL' 
                        : analysis.cash_impact.urgency_level === 'high' ? 'UNCERTAIN' 
                        : 'CERTAIN',
            risk_score: analysis.risk_assessment.score,
            
            warnings_triggered: analysis.warnings.map((w: any) => ({
                type: w.type,
                severity: w.severity,
                message: w.message,
                amount_at_risk: amount,
                client: client_name,
                days_overdue
            } as Warning)),
            
            actions_generated: analysis.actions.map((a: any) => ({
                priority: a.priority,
                title: a.title,
                description: a.description,
                deadline: new Date(Date.now() + a.deadline_days * 24 * 60 * 60 * 1000)
                    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                impact_amount: amount,
                validation_status: 'pending' as const
            } as Action)),
            
            simulation_summary: `${client_name} : ${(amount / 1000).toFixed(0)}K€ à ${days_overdue}j → ${analysis.risk_assessment.reasoning}`,
            is_demo: true
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error simulating TRESORIS impact:', error)
        return NextResponse.json(
            { error: 'Simulation failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

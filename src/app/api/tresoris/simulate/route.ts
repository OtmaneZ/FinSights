import { NextRequest, NextResponse } from 'next/server'
import type { SimulationRequest, SimulationResult, Warning, Action } from '@/components/tresoris/types'
import { 
    getAgentStatus, 
    evaluateTrigger, 
    recordDecision, 
    startAnalysis, 
    completeAnalysis,
    addLog 
} from '@/lib/tresoris/agent-state'

/**
 * POST /api/tresoris/simulate
 * 
 * Simule l'impact d'une facture impayée sur la trésorerie.
 * Utilise l'IA (Gemini via OpenRouter) pour analyse intelligente.
 * 
 * Si l'agent est en mode MONITORING, évalue automatiquement
 * si un trigger d'analyse doit être déclenché.
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

        // Check agent status for autonomous behavior
        const agentStatus = getAgentStatus()
        const isAgentActive = agentStatus.running && agentStatus.mode === 'monitoring'
        
        if (isAgentActive) {
            addLog('info', `Nouvelle simulation: ${client_name} - ${(amount/1000).toFixed(0)}K€`, {
                client: client_name,
                amount,
                days_overdue
            })
        }

        console.log('[TRESORIS Simulate] Starting AI analysis...', { client_name, amount, days_overdue })

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
            const errorText = await analyzeResponse.text()
            console.error('[TRESORIS Simulate] AI analysis failed:', {
                status: analyzeResponse.status,
                statusText: analyzeResponse.statusText,
                error: errorText
            })
            throw new Error(`AI analysis failed: ${analyzeResponse.status} ${errorText}`)
        }

        const analyzeResult = await analyzeResponse.json()
        const { analysis, powered_by } = analyzeResult
        
        if (!analysis) {
            console.error('[TRESORIS Simulate] No analysis in response:', analyzeResult)
            throw new Error('No analysis data received')
        }
        
        console.log(`[TRESORIS Simulate] Analysis complete (powered by: ${powered_by})`)

        // Calcul de l'impact runway avec limites réalistes
        const runwayBefore = 18 // semaines
        const weeklyBurn = 45000 // 45K€/semaine burn moyen pour une scale-up
        
        // Calcul de l'impact : une facture impayée RÉDUIT le runway disponible
        // Limiter l'impact à un maximum de 52 semaines (1 an) pour éviter absurdités
        const rawImpactWeeks = Math.round(amount / weeklyBurn)
        const runwayImpactWeeks = -Math.min(rawImpactWeeks, 52) // NÉGATIF car c'est une perte
        const runwayAfter = Math.max(0, runwayBefore + runwayImpactWeeks) // + car impactWeeks est négatif

        // Déterminer le niveau de risque
        const riskStatus = analysis.cash_impact.urgency_level === 'immediate' ? 'CRITICAL' 
            : analysis.cash_impact.urgency_level === 'high' ? 'UNCERTAIN' 
            : 'CERTAIN'

        // ═══════════════════════════════════════════════════════════════════
        // AUTONOMOUS AGENT BEHAVIOR
        // Si l'agent est actif, évaluer si un trigger automatique est requis
        // ═══════════════════════════════════════════════════════════════════
        
        let agentTriggered = false
        
        if (isAgentActive) {
            // Évaluer le trigger avec le contexte de simulation
            const triggerResult = evaluateTrigger({
                dso_moyen: 42 + (days_overdue > 30 ? 5 : 0), // Simule impact sur DSO
                concentration_max_client: 0.15,
                factures_retard_critique: days_overdue > 45 ? 1 : 0,
                nouvelle_simulation: true,
                simulation_risk_level: riskStatus
            })
            
            // Enregistrer la décision
            recordDecision(triggerResult.should_trigger, triggerResult.reason, triggerResult.source)
            
            // Si trigger → Lancer analyse automatique
            if (triggerResult.should_trigger) {
                agentTriggered = true
                const analysisId = startAnalysis(triggerResult.reason)
                
                // Compléter l'analyse avec les résultats de la simulation
                setTimeout(() => {
                    completeAnalysis({
                        risks_count: analysis.warnings.length + 1,
                        critical_count: riskStatus === 'CRITICAL' ? 1 : 0,
                        actions_count: analysis.actions.length,
                        summary: `Simulation ${client_name}: ${riskStatus} - ${analysis.actions.length} actions proposées`
                    })
                }, 1500) // Simulate 1.5s analysis time
            }
        }

        // Conversion du format IA vers SimulationResult
        const result: SimulationResult = {
            runway_before_weeks: runwayBefore,
            runway_after_weeks: runwayAfter,
            runway_delta_weeks: runwayImpactWeeks,
            
            client_rating_before: null,
            client_rating_after: analysis.risk_assessment.rating,
            client_score_before: null,
            client_score_after: analysis.risk_assessment.score,
            rating_changed: true,
            
            risk_status: riskStatus,
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
            
            simulation_summary: (() => {
                const formattedAmount = amount >= 1000000 
                    ? `${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M€`
                    : `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K€`
                return `${client_name} : ${formattedAmount} à ${days_overdue}j → ${analysis.risk_assessment.reasoning}`
            })(),
            is_demo: true
        }

        return NextResponse.json({
            ...result,
            agent_triggered: agentTriggered,
            agent_mode: isAgentActive ? 'monitoring' : 'inactive'
        })
    } catch (error) {
        console.error('❌ [TRESORIS Simulate] Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('[TRESORIS Simulate] Error details:', {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        })
        
        return NextResponse.json(
            { 
                error: 'Simulation failed', 
                details: errorMessage,
                hint: 'Vérifiez que OPENAI_API_KEY est configuré dans les variables d\'environnement'
            },
            { status: 500 }
        )
    }
}

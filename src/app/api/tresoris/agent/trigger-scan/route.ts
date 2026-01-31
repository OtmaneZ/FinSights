/**
 * TRESORIS Agent Trigger Scan API
 * POST /api/tresoris/agent/trigger-scan
 * 
 * Déclenche un scan manuel du portfolio.
 * L'agent évalue les conditions et peut auto-trigger une analyse.
 */

import { NextResponse } from 'next/server'
import { 
    getAgentStatus, 
    addLog, 
    evaluateTrigger, 
    recordDecision,
    startAnalysis,
    completeAnalysis,
    TriggerContext 
} from '@/lib/tresoris/agent-state'

// Données démo pour évaluation
const DEMO_CONTEXT: TriggerContext = {
    dso_moyen: 42,
    concentration_max_client: 0.22,
    factures_retard_critique: 0,
    nouvelle_simulation: false
}

export async function POST() {
    try {
        const status = getAgentStatus()
        
        if (!status.running) {
            return NextResponse.json(
                { success: false, error: 'Agent non actif' },
                { status: 400 }
            )
        }
        
        // Log du scan
        addLog('scan', 'Scan portfolio déclenché', { 
            source: 'manual',
            clients_checked: 85,
            invoices_checked: 234
        })
        
        // Évaluer les conditions de trigger
        const evaluation = evaluateTrigger(DEMO_CONTEXT)
        
        // Enregistrer la décision
        recordDecision(evaluation.should_trigger, evaluation.reason, evaluation.source)
        
        // Si trigger, lancer une analyse
        if (evaluation.should_trigger) {
            const analysisId = startAnalysis(evaluation.reason)
            
            // Simuler analyse (dans un vrai cas, ce serait async)
            setTimeout(() => {
                completeAnalysis({
                    risks_count: 3,
                    critical_count: 1,
                    actions_count: 4,
                    summary: 'Risque critique détecté sur 1 client, 3 actions prioritaires recommandées'
                })
            }, 3000)
            
            return NextResponse.json({
                success: true,
                triggered: true,
                analysis_id: analysisId,
                reason: evaluation.reason,
                status: getAgentStatus()
            })
        }
        
        return NextResponse.json({
            success: true,
            triggered: false,
            reason: evaluation.reason,
            status: getAgentStatus()
        })
        
    } catch (error) {
        console.error('Trigger scan error:', error)
        addLog('error', 'Erreur lors du scan', { error: String(error) })
        
        return NextResponse.json(
            { success: false, error: 'Erreur interne' },
            { status: 500 }
        )
    }
}

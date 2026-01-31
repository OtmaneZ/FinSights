import { NextRequest, NextResponse } from 'next/server'
import type { SimulationRequest, SimulationResult } from '@/components/tresoris/types'

/**
 * POST /api/tresoris/simulate
 * 
 * Simule l'impact d'une facture impayée sur la trésorerie.
 * L'agent analyse le client, calcule l'impact runway, génère warnings et actions.
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

        // Calcul de l'impact
        const runwayBefore = 18 // semaines
        const weeklyBurn = 45000 // dépenses hebdomadaires moyennes
        const impactWeeks = Math.round(amount / weeklyBurn)
        const runwayAfter = Math.max(0, runwayBefore - impactWeeks)

        // Scoring du risque basé sur montant et retard
        let riskScore = 0
        let riskStatus: 'CERTAIN' | 'UNCERTAIN' | 'CRITICAL' = 'CERTAIN'
        let clientRatingAfter: 'A' | 'B' | 'C' | 'D' = 'A'

        if (days_overdue === 0) {
            riskScore = Math.min(30, (amount / 10000) * 5)
            riskStatus = 'CERTAIN'
            clientRatingAfter = 'A'
        } else if (days_overdue <= 30) {
            riskScore = Math.min(50, 30 + days_overdue + (amount / 10000) * 3)
            riskStatus = 'CERTAIN'
            clientRatingAfter = 'B'
        } else if (days_overdue <= 60) {
            riskScore = Math.min(75, 50 + (days_overdue - 30) + (amount / 10000) * 5)
            riskStatus = 'UNCERTAIN'
            clientRatingAfter = 'C'
        } else {
            riskScore = Math.min(95, 70 + (days_overdue - 60) * 0.5 + (amount / 10000) * 8)
            riskStatus = 'CRITICAL'
            clientRatingAfter = 'D'
        }

        // Génération des warnings
        const warnings = []
        
        if (days_overdue > 0) {
            warnings.push({
                type: 'CLIENT_PAYMENT_DELAY',
                severity: days_overdue > 60 ? 'critical' : days_overdue > 30 ? 'high' : 'medium',
                message: `${client_name} : retard de ${days_overdue} jours sur facture de ${(amount / 1000).toFixed(0)}K€`,
                amount_at_risk: amount,
                client: client_name,
                days_overdue
            } as const)
        }

        if (runwayAfter < 12) {
            warnings.push({
                type: 'CASH_RUNWAY_CRITICAL',
                severity: 'critical',
                message: `Runway critique : ${runwayAfter} semaines de trésorerie disponible`,
                amount_at_risk: amount
            } as const)
        } else if (runwayAfter < 18) {
            warnings.push({
                type: 'CASH_RUNWAY_LOW',
                severity: 'high',
                message: `Runway en baisse : ${runwayAfter} semaines (vs ${runwayBefore} avant incident)`,
                amount_at_risk: amount
            } as const)
        }

        if (amount > 50000 && days_overdue > 45) {
            warnings.push({
                type: 'MAJOR_CLIENT_RISK',
                severity: 'critical',
                message: `Risque majeur : gros montant (${(amount / 1000).toFixed(0)}K€) + retard significatif`,
                amount_at_risk: amount,
                client: client_name
            } as const)
        }

        // Génération des actions
        const actions = []

        if (days_overdue > 45) {
            actions.push({
                priority: 'P1',
                title: `Relance urgente ${client_name}`,
                description: 'Appel téléphonique immédiat + email formel avec échéancier de paiement',
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                impact_amount: amount,
                validation_status: 'pending'
            } as const)
        } else if (days_overdue > 30) {
            actions.push({
                priority: 'P2',
                title: `Relance formelle ${client_name}`,
                description: 'Email de relance avec copie comptabilité client',
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                impact_amount: amount,
                validation_status: 'pending'
            } as const)
        }

        if (runwayAfter < 12) {
            actions.push({
                priority: 'P1',
                title: 'Mesures urgentes trésorerie',
                description: 'Négocier report charges sociales + activer ligne crédit court terme',
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                impact_amount: Math.round(amount * 0.4),
                validation_status: 'pending'
            } as const)
        }

        if (amount > 30000) {
            actions.push({
                priority: days_overdue > 60 ? 'P1' : 'P2',
                title: `Revoir conditions paiement ${client_name}`,
                description: 'Proposition passage en prépaiement ou acompte 50% pour futures commandes',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                impact_amount: amount,
                validation_status: 'pending'
            } as const)
        }

        if (actions.length === 0) {
            actions.push({
                priority: 'P3',
                title: `Surveillance ${client_name}`,
                description: 'Monitoring du comportement de paiement sur les 2 prochains mois',
                deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                impact_amount: amount,
                validation_status: 'pending'
            } as const)
        }

        const result: SimulationResult = {
            runway_before_weeks: runwayBefore,
            runway_after_weeks: runwayAfter,
            runway_delta_weeks: runwayBefore - runwayAfter,
            
            client_rating_before: null,
            client_rating_after: clientRatingAfter,
            client_score_before: null,
            client_score_after: riskScore,
            rating_changed: true,
            
            risk_status: riskStatus,
            risk_score: riskScore,
            
            warnings_triggered: warnings,
            actions_generated: actions,
            
            simulation_summary: `Impact de ${client_name} : ${(amount / 1000).toFixed(0)}K€ à ${days_overdue}j de retard → Runway ${runwayBefore}s → ${runwayAfter}s (-${impactWeeks}s) | Rating: ${clientRatingAfter} | ${warnings.length} alertes | ${actions.length} actions`,
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

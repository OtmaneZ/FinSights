import { NextResponse } from 'next/server'
import type { DashboardData } from '@/components/tresoris/types'

/**
 * GET /api/tresoris/dashboard
 * 
 * Retourne les données du dashboard TRESORIS avec métriques cash,
 * clients à risque, alertes et actions recommandées.
 */
export async function GET() {
    try {
        // Données démo réalistes pour NovaTech Solutions (Scale-up SaaS)
        const dashboard: DashboardData = {
            // Position cash
            total_pending: 485000,
            total_overdue: 142000,
            runway_weeks: 18,

            // Répartition risques
            risks_by_status: {
                CERTAIN: 12,
                UNCERTAIN: 5,
                CRITICAL: 3
            },
            amount_by_status: {
                CERTAIN: 285000,
                UNCERTAIN: 115000,
                CRITICAL: 85000
            },

            // Top clients à risque
            top_risky_clients: [
                {
                    client_name: 'DataViz Corp',
                    total_amount: 68000,
                    max_days_overdue: 47,
                    risk_count: 2,
                    max_score: 78,
                    status: 'CRITICAL'
                },
                {
                    client_name: 'CloudScale SA',
                    total_amount: 52000,
                    max_days_overdue: 35,
                    risk_count: 1,
                    max_score: 65,
                    status: 'UNCERTAIN'
                },
                {
                    client_name: 'InnoTech Industries',
                    total_amount: 45000,
                    max_days_overdue: 28,
                    risk_count: 1,
                    max_score: 58,
                    status: 'UNCERTAIN'
                },
                {
                    client_name: 'SecureNet SAS',
                    total_amount: 38000,
                    max_days_overdue: 15,
                    risk_count: 1,
                    max_score: 42,
                    status: 'CERTAIN'
                },
                {
                    client_name: 'MarketPro SARL',
                    total_amount: 32000,
                    max_days_overdue: 8,
                    risk_count: 0,
                    max_score: 28,
                    status: 'CERTAIN'
                }
            ],

            // Alertes actives
            active_warnings: [
                {
                    type: 'CLIENT_PAYMENT_DELAY',
                    severity: 'critical',
                    message: 'DataViz Corp : retard de paiement inhabituel (47 jours vs moyenne 12 jours)',
                    amount_at_risk: 68000,
                    client: 'DataViz Corp',
                    days_overdue: 47
                },
                {
                    type: 'CASH_RUNWAY_LOW',
                    severity: 'high',
                    message: 'Runway prévisionnel en baisse : 18 semaines (seuil 24 semaines recommandé)',
                    amount_at_risk: 142000
                },
                {
                    type: 'DSO_INCREASE',
                    severity: 'medium',
                    message: 'DSO en hausse : 48 jours (+12% vs mois dernier)',
                    amount_at_risk: 115000
                }
            ],

            // Actions recommandées
            pending_actions: [
                {
                    priority: 'P1',
                    title: 'Relance urgente DataViz Corp',
                    description: 'Appel téléphonique + email formel avec mise en demeure si pas de réponse sous 48h',
                    deadline: '2 févr. 2026',
                    impact_amount: 68000,
                    validation_status: 'pending'
                },
                {
                    priority: 'P1',
                    title: 'Négocier délai TVA avec URSSAF',
                    description: 'Demande de report échéance TVA du 15/02 au 28/02 pour sécuriser trésorerie',
                    deadline: '5 févr. 2026',
                    impact_amount: 23500,
                    validation_status: 'pending'
                },
                {
                    priority: 'P2',
                    title: 'Revoir conditions paiement CloudScale',
                    description: 'Proposition passage de 60j à 30j fin de mois avec remise 2% escompte',
                    deadline: '8 févr. 2026',
                    impact_amount: 52000,
                    validation_status: 'pending'
                },
                {
                    priority: 'P3',
                    title: 'Audit crédit client InnoTech',
                    description: 'Vérifier scoring bancaire et historique paiement autres fournisseurs',
                    deadline: '12 févr. 2026',
                    impact_amount: 45000,
                    validation_status: 'pending'
                }
            ],

            // Stats
            dso_moyen: 48,
            nb_clients: 85,
            nb_factures_pending: 43,

            // Agent
            last_analysis: new Date().toISOString(),
            agent_running: false
        }

        return NextResponse.json(dashboard)
    } catch (error) {
        console.error('Error generating TRESORIS dashboard:', error)
        return NextResponse.json(
            { error: 'Failed to generate dashboard' },
            { status: 500 }
        )
    }
}

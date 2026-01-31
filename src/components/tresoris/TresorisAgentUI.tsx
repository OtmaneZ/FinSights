'use client'

/**
 * TresorisAgentUI - Dashboard principal TRESORIS avec Agent Autonome
 * 
 * Version 2.0 - Architecture Agent Autonome Rigoureux
 * 
 * Features:
 * - AutonomousAgentPanel: Contrôle START/STOP + machine à états visible
 * - AgentActivityLog: Log terminal temps réel des décisions
 * - RiskSimulator: Démo interactive (trigger auto si agent actif)
 * - Dashboard KPIs dynamiques
 * - Validation actions DAF
 * 
 * Flux démo prouvant l'autonomie:
 * 1. Clic START → Agent passe en MONITORING
 * 2. Simulation facture → Agent détecte risque
 * 3. Si risque critique → TRIGGER automatique
 * 4. Agent passe en ANALYZING → génère actions
 * 5. Agent passe en WAITING → attend validation DAF
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    RefreshCw,
    Loader2,
    TrendingUp,
    AlertTriangle,
    Zap
} from 'lucide-react'

// Components
import AutonomousAgentPanel from './AutonomousAgentPanel'
import AgentActivityLog from './AgentActivityLog'
import RiskSimulator from './RiskSimulator'
import ClientRiskMatrix from './ClientRiskMatrix'
import EarlyWarningPanel from './EarlyWarningPanel'
import ActionRecommendations from './ActionRecommendations'

// Types
import {
    DashboardData,
    SimulationResult,
    TRESORIS_ENDPOINTS,
    DEMO_COMPANY
} from './types'

interface TresorisAgentUIProps {
    className?: string
}

export default function TresorisAgentUI({ className = '' }: TresorisAgentUIProps) {
    // ═══════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════
    
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [dashboard, setDashboard] = useState<DashboardData | null>(null)
    const [lastSimulation, setLastSimulation] = useState<SimulationResult | null>(null)
    const [agentTriggered, setAgentTriggered] = useState(false)
    
    // ═══════════════════════════════════════════════════════════════════
    // API CALLS
    // ═══════════════════════════════════════════════════════════════════
    
    const fetchDashboard = useCallback(async () => {
        try {
            const response = await fetch(TRESORIS_ENDPOINTS.dashboard)
            if (!response.ok) throw new Error('Failed to fetch dashboard')
            const data: DashboardData = await response.json()
            setDashboard(data)
            setError(null)
        } catch (err) {
            console.error('Dashboard fetch error:', err)
            setError('Erreur de chargement des données')
        }
    }, [])
    
    const validateAction = useCallback(async (actionId: string, decision: 'approved' | 'rejected') => {
        try {
            const response = await fetch(TRESORIS_ENDPOINTS.validate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action_id: actionId,
                    decision,
                    validated_by: 'DAF Demo'
                })
            })
            
            if (response.ok) {
                await fetchDashboard()
            }
        } catch (err) {
            console.error('Validate action error:', err)
        }
    }, [fetchDashboard])
    
    // ═══════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ═══════════════════════════════════════════════════════════════════
    
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            await fetchDashboard()
            setIsLoading(false)
        }
        loadData()
    }, [fetchDashboard])
    
    // Handle simulation complete
    const handleSimulationComplete = useCallback((result: SimulationResult & { agent_triggered?: boolean }) => {
        setLastSimulation(result)
        setAgentTriggered(result.agent_triggered || false)
        
        // Update dashboard with simulation impact
        if (dashboard) {
            setDashboard({
                ...dashboard,
                runway_weeks: result.runway_after_weeks,
                active_warnings: [
                    ...result.warnings_triggered,
                    ...dashboard.active_warnings
                ].slice(0, 5),
                pending_actions: [
                    ...result.actions_generated,
                    ...dashboard.pending_actions
                ].slice(0, 8),
                risks_by_status: {
                    ...dashboard.risks_by_status,
                    [result.risk_status]: (dashboard.risks_by_status[result.risk_status] || 0) + 1
                }
            })
        }
    }, [dashboard])
    
    // ═══════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════
    
    return (
        <div className={`min-h-screen bg-slate-50 ${className}`}>
            {/* Header Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Company Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {DEMO_COMPANY.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="font-semibold text-slate-900">{DEMO_COMPANY.name}</h1>
                                    <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full capitalize">
                                        {DEMO_COMPANY.type}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">{DEMO_COMPANY.sector}</p>
                            </div>
                        </div>
                        
                        {/* Refresh */}
                        <button
                            onClick={fetchDashboard}
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                            title="Rafraîchir"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                            <p className="text-slate-600">Connexion à TRESORIS...</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">Erreur de chargement</h2>
                            <p className="text-slate-600 text-center max-w-md mb-6">{error}</p>
                            <button
                                onClick={fetchDashboard}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Réessayer
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            {/* ═══════════════════════════════════════════════════════════
                                SECTION 1: Agent Autonome (HERO)
                            ═══════════════════════════════════════════════════════════ */}
                            <section>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    Agent Autonome TRESORIS
                                </h2>
                                
                                {/* Agent Control Panel */}
                                <AutonomousAgentPanel className="mb-6" />
                                
                                {/* Agent Activity Log */}
                                <AgentActivityLog maxLogs={12} />
                            </section>
                            
                            {/* ═══════════════════════════════════════════════════════════
                                SECTION 2: Simulateur (Trigger Demo)
                            ═══════════════════════════════════════════════════════════ */}
                            <section>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                                    Simuler une Facture
                                    <span className="ml-2 text-sm font-normal text-slate-500">
                                        (déclenche l'agent si actif)
                                    </span>
                                </h2>
                                <RiskSimulator onSimulationComplete={handleSimulationComplete} />
                                
                                {/* Trigger Feedback */}
                                <AnimatePresence>
                                    {agentTriggered && lastSimulation && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
                                        >
                                            <div className="flex items-center gap-2 text-emerald-700 font-medium">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                                </span>
                                                Agent déclenché automatiquement
                                            </div>
                                            <p className="mt-1 text-sm text-emerald-600">
                                                Risque {lastSimulation.risk_status} détecté → Analyse en cours
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </section>
                            
                            {/* ═══════════════════════════════════════════════════════════
                                SECTION 3: KPIs
                            ═══════════════════════════════════════════════════════════ */}
                            {dashboard && (
                                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-sm text-slate-500 mb-1">Encours total</div>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {(dashboard.total_pending / 1000).toFixed(0)}K€
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {dashboard.nb_factures_pending} factures
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-sm text-slate-500 mb-1">En retard</div>
                                        <div className="text-2xl font-bold text-red-500">
                                            {(dashboard.total_overdue / 1000).toFixed(0)}K€
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            DSO: {dashboard.dso_moyen.toFixed(0)}j
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-sm text-slate-500 mb-1">Runway</div>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {dashboard.runway_weeks.toFixed(1)} sem
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            Horizon trésorerie
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-sm text-slate-500 mb-1">Risques détectés</div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-red-500">
                                                {dashboard.risks_by_status.CRITICAL || 0}
                                            </span>
                                            <span className="text-amber-500 font-medium">
                                                +{dashboard.risks_by_status.UNCERTAIN || 0}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            Critique / Incertain
                                        </div>
                                    </div>
                                </section>
                            )}
                            
                            {/* ═══════════════════════════════════════════════════════════
                                SECTION 4: Clients & Warnings
                            ═══════════════════════════════════════════════════════════ */}
                            {dashboard && (
                                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <ClientRiskMatrix clients={dashboard.top_risky_clients} />
                                    <EarlyWarningPanel warnings={dashboard.active_warnings} />
                                </section>
                            )}
                            
                            {/* ═══════════════════════════════════════════════════════════
                                SECTION 5: Actions
                            ═══════════════════════════════════════════════════════════ */}
                            {dashboard && dashboard.pending_actions.length > 0 && (
                                <section>
                                    <ActionRecommendations
                                        actions={dashboard.pending_actions}
                                        onValidate={validateAction}
                                    />
                                </section>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

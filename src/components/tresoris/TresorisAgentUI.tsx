'use client'

/**
 * TresorisAgentUI - Dashboard principal TRESORIS
 * 
 * Assemble tous les composants modulaires pour créer
 * l'interface de surveillance trésorerie complète.
 * 
 * Features:
 * - API routes Next.js (pas de serveur externe)
 * - RiskSimulator pour démo interactive
 * - Dashboard avec métriques live
 * - Validation actions DAF
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Wifi,
    WifiOff,
    RefreshCw,
    Play,
    Square,
    Loader2,
    Building2,
    TrendingUp,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react'

// Components
import RiskSimulator from './RiskSimulator'
import CashRunwayGauge from './CashRunwayGauge'
import ClientRiskMatrix from './ClientRiskMatrix'
import EarlyWarningPanel from './EarlyWarningPanel'
import ActionRecommendations from './ActionRecommendations'
import AgentReactionTimeline, { DEFAULT_ANALYSIS_STEPS, TimelineStep } from './AgentReactionTimeline'

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
    
    // Connection
    const [isConnected, setIsConnected] = useState(true) // Toujours connecté avec API Next.js
    const [isAgentRunning, setIsAgentRunning] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // Data
    const [dashboard, setDashboard] = useState<DashboardData | null>(null)
    const [lastSimulation, setLastSimulation] = useState<SimulationResult | null>(null)
    
    // Timeline
    const [analysisSteps, setAnalysisSteps] = useState<TimelineStep[]>(DEFAULT_ANALYSIS_STEPS)
    const [currentStep, setCurrentStep] = useState<string | null>(null)
    
    // ═══════════════════════════════════════════════════════════════════
    // API CALLS
    // ═══════════════════════════════════════════════════════════════════
    
    // Fetch dashboard data
    const fetchDashboard = useCallback(async () => {
        try {
            const response = await fetch(TRESORIS_ENDPOINTS.dashboard)
            if (!response.ok) throw new Error('Failed to fetch dashboard')
            const data: DashboardData = await response.json()
            setDashboard(data)
            setIsAgentRunning(data.agent_running)
            setError(null)
            setIsConnected(true)
        } catch (err) {
            console.error('Dashboard fetch error:', err)
            setError('Erreur de chargement des données')
        }
    }, [])
    
    // Start/Stop agent (mode démo - juste toggle UI)
    const startAgent = useCallback(() => {
        setIsAgentRunning(true)
    }, [])
    
    const stopAgent = useCallback(() => {
        setIsAgentRunning(false)
    }, [])
    
    // Validate action
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
        // Initial load - pas de WebSocket, juste fetch HTTP
        const loadData = async () => {
            setIsLoading(true)
            await fetchDashboard()
            setIsLoading(false)
        }
        loadData()
    }, [fetchDashboard])
    
    // Handle simulation complete
    const handleSimulationComplete = useCallback((result: SimulationResult) => {
        setLastSimulation(result)
        // Refresh dashboard after simulation
        fetchDashboard()
    }, [fetchDashboard])
    
    // ═══════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════
    
    return (
        <div className={`min-h-screen bg-primary ${className}`}>
            {/* Header Bar */}
            <div className="bg-surface-elevated border-b border-border-subtle sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Company Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                {DEMO_COMPANY.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="font-semibold text-primary">{DEMO_COMPANY.name}</h1>
                                    <span className="px-2 py-0.5 text-xs font-medium bg-purple-500/10 text-purple-500 rounded-full capitalize">
                                        {DEMO_COMPANY.type}
                                    </span>
                                </div>
                                <p className="text-sm text-tertiary">{DEMO_COMPANY.sector}</p>
                            </div>
                        </div>
                        
                        {/* Status & Controls */}
                        <div className="flex items-center gap-4">
                            {/* Connection Status */}
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                                isConnected
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-red-500/10 text-red-500'
                            }`}>
                                {isConnected ? (
                                    <Wifi className="w-4 h-4" />
                                ) : (
                                    <WifiOff className="w-4 h-4" />
                                )}
                                <span className="text-sm font-medium">
                                    {isConnected ? 'Connecté' : 'Déconnecté'}
                                </span>
                            </div>
                            
                            {/* Agent Control */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={isAgentRunning ? stopAgent : startAgent}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                        isAgentRunning
                                            ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    }`}
                                >
                                    {isAgentRunning ? (
                                        <>
                                            <Square className="w-4 h-4" />
                                            Arrêter
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" />
                                            Démarrer
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    onClick={fetchDashboard}
                                    className="p-2 text-tertiary hover:text-primary hover:bg-surface-hover rounded-lg transition-all"
                                    title="Rafraîchir"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        // Loading State
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <Loader2 className="w-12 h-12 text-accent-primary animate-spin mb-4" />
                            <p className="text-secondary">Connexion à TRESORIS...</p>
                        </motion.div>
                    ) : error ? (
                        // Error State
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                            <h2 className="text-xl font-semibold text-primary mb-2">Erreur de chargement</h2>
                            <p className="text-secondary text-center max-w-md mb-6">{error}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={fetchDashboard}
                                    className="flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-all"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Réessayer
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        // Dashboard
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            {/* Section 1: Risk Simulator (Hero Feature) */}
                            <section>
                                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-accent-primary" />
                                    Simulateur de Risque
                                </h2>
                                <RiskSimulator onSimulationComplete={handleSimulationComplete} />
                            </section>
                            
                            {/* Section 2: KPIs Row */}
                            {dashboard && (
                                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Total Pending */}
                                    <div className="p-4 bg-surface-elevated rounded-xl border border-border-subtle">
                                        <div className="text-sm text-secondary mb-1">Encours total</div>
                                        <div className="text-2xl font-bold text-primary">
                                            {(dashboard.total_pending / 1000).toFixed(0)}K€
                                        </div>
                                        <div className="text-xs text-tertiary mt-1">
                                            {dashboard.nb_factures_pending} factures
                                        </div>
                                    </div>
                                    
                                    {/* Overdue */}
                                    <div className="p-4 bg-surface-elevated rounded-xl border border-border-subtle">
                                        <div className="text-sm text-secondary mb-1">En retard</div>
                                        <div className="text-2xl font-bold text-red-500">
                                            {(dashboard.total_overdue / 1000).toFixed(0)}K€
                                        </div>
                                        <div className="text-xs text-tertiary mt-1">
                                            DSO: {dashboard.dso_moyen.toFixed(0)}j
                                        </div>
                                    </div>
                                    
                                    {/* Runway */}
                                    <div className="p-4 bg-surface-elevated rounded-xl border border-border-subtle">
                                        <div className="text-sm text-secondary mb-1">Runway</div>
                                        <div className="text-2xl font-bold text-primary">
                                            {dashboard.runway_weeks.toFixed(1)} sem
                                        </div>
                                        <div className="text-xs text-tertiary mt-1">
                                            Horizon trésorerie
                                        </div>
                                    </div>
                                    
                                    {/* Risks */}
                                    <div className="p-4 bg-surface-elevated rounded-xl border border-border-subtle">
                                        <div className="text-sm text-secondary mb-1">Risques détectés</div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-red-500">
                                                {dashboard.risks_by_status.CRITICAL || 0}
                                            </span>
                                            <span className="text-amber-500 font-medium">
                                                +{dashboard.risks_by_status.UNCERTAIN || 0}
                                            </span>
                                        </div>
                                        <div className="text-xs text-tertiary mt-1">
                                            Critique / Incertain
                                        </div>
                                    </div>
                                </section>
                            )}
                            
                            {/* Section 3: Main Grid */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Client Matrix */}
                                {dashboard && (
                                    <ClientRiskMatrix
                                        clients={dashboard.top_risky_clients}
                                    />
                                )}
                                
                                {/* Warnings */}
                                {dashboard && (
                                    <EarlyWarningPanel
                                        warnings={dashboard.active_warnings}
                                    />
                                )}
                            </section>
                            
                            {/* Section 4: Actions */}
                            {dashboard && dashboard.pending_actions.length > 0 && (
                                <section>
                                    <ActionRecommendations
                                        actions={dashboard.pending_actions}
                                        onValidate={validateAction}
                                    />
                                </section>
                            )}
                            
                            {/* Section 5: Agent Timeline (if analysis in progress) */}
                            {currentStep && (
                                <section>
                                    <AgentReactionTimeline
                                        steps={analysisSteps}
                                        currentStep={currentStep}
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

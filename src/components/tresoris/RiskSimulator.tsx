'use client'

/**
 * RiskSimulator - Killer Feature TRESORIS
 * 
 * Permet à l'utilisateur d'ajouter une facture fictive et voir
 * TRESORIS réagir en temps réel (scoring, warnings, actions).
 * 
 * 100% dynamique - pas de hardcoding :
 * - L'utilisateur choisit le nom du client
 * - L'utilisateur définit le montant
 * - L'utilisateur choisit le retard
 * 
 * Démontre le comportement agentique pur.
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Zap,
    AlertTriangle,
    TrendingDown,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Loader2,
    Euro,
    Calendar,
    User,
    Play,
    RotateCcw,
    ArrowRight,
    Clock,
    Target,
    ShieldAlert,
    Building2
} from 'lucide-react'
import { SimulationRequest, SimulationResult, TRESORIS_ENDPOINTS } from './types'

interface RiskSimulatorProps {
    onSimulationComplete?: (result: SimulationResult) => void
    className?: string
}

// Presets de retard pour UX rapide
const DELAY_PRESETS = [
    { days: 0, label: 'À temps', color: 'bg-emerald-500' },
    { days: 15, label: '15j', color: 'bg-amber-400' },
    { days: 30, label: '30j', color: 'bg-orange-500' },
    { days: 60, label: '60j', color: 'bg-red-500' },
    { days: 90, label: '90j+', color: 'bg-red-700' }
]

// Presets de montant
const AMOUNT_PRESETS = [25000, 50000, 100000, 200000, 400000]

export default function RiskSimulator({ onSimulationComplete, className = '' }: RiskSimulatorProps) {
    // Form state
    const [clientName, setClientName] = useState('')
    const [amount, setAmount] = useState(100000)
    const [daysOverdue, setDaysOverdue] = useState(0)
    
    // UI state
    const [isSimulating, setIsSimulating] = useState(false)
    const [result, setResult] = useState<SimulationResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [showReaction, setShowReaction] = useState(false)
    
    // Reset form
    const handleReset = useCallback(() => {
        setClientName('')
        setAmount(100000)
        setDaysOverdue(0)
        setResult(null)
        setError(null)
        setShowReaction(false)
    }, [])
    
    // Simulate
    const handleSimulate = useCallback(async () => {
        if (!clientName.trim()) {
            setError('Veuillez saisir un nom de client')
            return
        }
        
        setIsSimulating(true)
        setError(null)
        setShowReaction(true)
        
        try {
            const request: SimulationRequest = {
                client_name: clientName.trim(),
                amount,
                days_overdue: daysOverdue
            }
            
            const response = await fetch(TRESORIS_ENDPOINTS.simulate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || 'Erreur simulation')
            }
            
            const data: SimulationResult = await response.json()
            setResult(data)
            onSimulationComplete?.(data)
            
        } catch (err) {
            console.error('Simulation error:', err)
            setError(err instanceof Error ? err.message : 'Erreur de connexion au backend TRESORIS')
        } finally {
            setIsSimulating(false)
        }
    }, [clientName, amount, daysOverdue, onSimulationComplete])
    
    // Get status color & icon
    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'CRITICAL':
                return { color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle, label: 'CRITIQUE' }
            case 'UNCERTAIN':
                return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertTriangle, label: 'INCERTAIN' }
            default:
                return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2, label: 'CERTAIN' }
        }
    }
    
    // Get rating color
    const getRatingColor = (rating: string | null) => {
        switch (rating) {
            case 'A': return 'bg-emerald-500'
            case 'B': return 'bg-blue-500'
            case 'C': return 'bg-amber-500'
            case 'D': return 'bg-red-500'
            default: return 'bg-slate-500'
        }
    }
    
    return (
        <div className={`bg-surface-elevated rounded-2xl border border-border-subtle overflow-hidden ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-accent-primary/10 via-purple-500/10 to-blue-500/10 px-6 py-4 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-primary/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-accent-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary">Simulateur de Risque</h3>
                        <p className="text-sm text-secondary">Ajoutez une facture et observez la réaction TRESORIS</p>
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Panel */}
                    <div className="space-y-6">
                        {/* Client Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-secondary mb-2">
                                <Building2 className="w-4 h-4" />
                                Nom du client facturé
                            </label>
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Ex: TechCorp Industries, Cabinet Martin..."
                                className="w-full px-4 py-3 bg-primary border border-border-subtle rounded-xl focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all text-primary placeholder:text-tertiary"
                            />
                            <p className="text-xs text-tertiary mt-1">
                                Choisissez n'importe quel nom - la simulation est 100% dynamique
                            </p>
                        </div>
                        
                        {/* Amount */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-secondary mb-2">
                                <Euro className="w-4 h-4" />
                                Montant de la facture
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    min={1000}
                                    step={1000}
                                    className="w-full px-4 py-3 pr-12 bg-primary border border-border-subtle rounded-xl focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all text-primary"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary">€</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                {AMOUNT_PRESETS.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setAmount(preset)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                            amount === preset
                                                ? 'bg-accent-primary text-white'
                                                : 'bg-secondary text-secondary hover:bg-surface-hover'
                                        }`}
                                    >
                                        {preset >= 1000 ? `${preset / 1000}K` : preset}€
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Days Overdue */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-secondary mb-2">
                                <Calendar className="w-4 h-4" />
                                Retard de paiement
                            </label>
                            <div className="flex gap-2">
                                {DELAY_PRESETS.map((preset) => (
                                    <button
                                        key={preset.days}
                                        onClick={() => setDaysOverdue(preset.days)}
                                        className={`flex-1 px-3 py-3 text-sm font-medium rounded-xl transition-all border-2 ${
                                            daysOverdue === preset.days
                                                ? `${preset.color} text-white border-transparent`
                                                : 'bg-primary text-secondary border-border-subtle hover:border-border-default'
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-3">
                                <input
                                    type="range"
                                    min={0}
                                    max={120}
                                    value={daysOverdue}
                                    onChange={(e) => setDaysOverdue(Number(e.target.value))}
                                    className="w-full accent-accent-primary"
                                />
                                <div className="flex justify-between text-xs text-tertiary">
                                    <span>0 jours</span>
                                    <span className="font-medium text-primary">{daysOverdue} jours</span>
                                    <span>120 jours</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleSimulate}
                                disabled={isSimulating || !clientName.trim()}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSimulating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyse TRESORIS...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" />
                                        Simuler l'impact
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-3 text-secondary hover:text-primary hover:bg-surface-hover rounded-xl transition-all"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Result Panel */}
                    <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {!showReaction ? (
                                // Placeholder
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center text-center p-8 bg-secondary/50 rounded-2xl border-2 border-dashed border-border-subtle"
                                >
                                    <ShieldAlert className="w-16 h-16 text-tertiary mb-4" />
                                    <h4 className="font-semibold text-primary mb-2">Réaction TRESORIS</h4>
                                    <p className="text-sm text-tertiary max-w-xs">
                                        Configurez une facture à gauche et cliquez sur "Simuler" pour voir comment TRESORIS analyse le risque
                                    </p>
                                </motion.div>
                            ) : isSimulating ? (
                                // Loading
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center p-8"
                                >
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full border-4 border-accent-primary/20 border-t-accent-primary animate-spin" />
                                        <Zap className="w-8 h-8 text-accent-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <div className="mt-6 space-y-2 text-center">
                                        <motion.p
                                            key="step1"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-sm text-secondary"
                                        >
                                            ✓ Analyse du pattern client...
                                        </motion.p>
                                        <motion.p
                                            key="step2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                            className="text-sm text-secondary"
                                        >
                                            ✓ Calcul du scoring risque...
                                        </motion.p>
                                        <motion.p
                                            key="step3"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.0 }}
                                            className="text-sm text-secondary"
                                        >
                                            ✓ Détection early warnings...
                                        </motion.p>
                                    </div>
                                </motion.div>
                            ) : result ? (
                                // Result
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="h-full space-y-4"
                                >
                                    {/* Status Header */}
                                    {(() => {
                                        const status = getStatusDisplay(result.risk_status)
                                        const StatusIcon = status.icon
                                        return (
                                            <div className={`p-4 rounded-xl ${status.bg} border border-current/20`}>
                                                <div className="flex items-center gap-3">
                                                    <StatusIcon className={`w-8 h-8 ${status.color}`} />
                                                    <div>
                                                        <div className={`font-bold text-lg ${status.color}`}>
                                                            {status.label}
                                                        </div>
                                                        <p className="text-sm text-secondary">
                                                            Score risque: {result.risk_score}/100
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })()}
                                    
                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Runway Impact */}
                                        <div className="p-4 bg-primary rounded-xl border border-border-subtle">
                                            <div className="flex items-center gap-2 text-sm text-secondary mb-2">
                                                <Clock className="w-4 h-4" />
                                                Impact Runway
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-primary">
                                                    {result.runway_delta_weeks > 0 ? '+' : ''}{result.runway_delta_weeks}
                                                </span>
                                                <span className="text-sm text-secondary">semaines</span>
                                            </div>
                                            <div className="text-xs text-tertiary mt-1">
                                                {result.runway_before_weeks} → {result.runway_after_weeks} sem
                                            </div>
                                        </div>
                                        
                                        {/* Rating Change */}
                                        <div className="p-4 bg-primary rounded-xl border border-border-subtle">
                                            <div className="flex items-center gap-2 text-sm text-secondary mb-2">
                                                <Target className="w-4 h-4" />
                                                Rating Client
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {result.client_rating_before ? (
                                                    <>
                                                        <span className={`w-8 h-8 rounded-lg ${getRatingColor(result.client_rating_before)} text-white font-bold flex items-center justify-center`}>
                                                            {result.client_rating_before}
                                                        </span>
                                                        <ArrowRight className="w-4 h-4 text-tertiary" />
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-tertiary mr-2">Nouveau:</span>
                                                )}
                                                <span className={`w-8 h-8 rounded-lg ${getRatingColor(result.client_rating_after)} text-white font-bold flex items-center justify-center`}>
                                                    {result.client_rating_after}
                                                </span>
                                            </div>
                                            {result.rating_changed && result.client_rating_before && (
                                                <div className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                                                    <TrendingDown className="w-3 h-3" />
                                                    Dégradation
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Warnings */}
                                    {result.warnings_triggered.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-secondary flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4" />
                                                Alertes déclenchées ({result.warnings_triggered.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {result.warnings_triggered.map((warning, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className={`p-3 rounded-lg border text-sm ${
                                                            warning.severity === 'critical'
                                                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                                                : warning.severity === 'high'
                                                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                                                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                                        }`}
                                                    >
                                                        <div className="font-medium">{warning.type.replace(/_/g, ' ')}</div>
                                                        <div className="text-xs opacity-80 mt-1">{warning.message}</div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Actions */}
                                    {result.actions_generated.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-secondary flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Actions recommandées ({result.actions_generated.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {result.actions_generated.map((action, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.3 + i * 0.1 }}
                                                        className="p-3 bg-primary rounded-lg border border-border-subtle"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                                                action.priority === 'P1'
                                                                    ? 'bg-red-500/20 text-red-400'
                                                                    : action.priority === 'P2'
                                                                    ? 'bg-amber-500/20 text-amber-400'
                                                                    : 'bg-blue-500/20 text-blue-400'
                                                            }`}>
                                                                {action.priority}
                                                            </span>
                                                            <span className="font-medium text-primary text-sm">{action.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-tertiary">
                                                            <span>📅 {action.deadline}</span>
                                                            <span>💰 {(action.impact_amount / 1000).toFixed(0)}K€</span>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Summary */}
                                    <div className="p-3 bg-secondary/50 rounded-lg text-xs text-tertiary">
                                        {result.simulation_summary}
                                    </div>
                                </motion.div>
                            ) : (
                                // Error state
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center text-center p-8"
                                >
                                    <XCircle className="w-16 h-16 text-red-500 mb-4" />
                                    <h4 className="font-semibold text-primary mb-2">Erreur de simulation</h4>
                                    <p className="text-sm text-tertiary">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}

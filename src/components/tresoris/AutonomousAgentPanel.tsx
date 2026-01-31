'use client'

/**
 * AutonomousAgentPanel - Panneau de contrôle de l'agent autonome
 * 
 * Affiche:
 * - Bouton START/STOP avec état visible
 * - Machine à états (IDLE → MONITORING → ANALYZING → WAITING)
 * - Uptime et compteurs de décisions/triggers
 * - Dernière décision de l'agent
 * 
 * Architecture McKinsey-grade: clair, rigoureux, factuel
 */

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Play,
    Square,
    Activity,
    Eye,
    Search,
    Clock,
    AlertCircle,
    CheckCircle,
    Zap,
    Timer,
    TrendingUp,
    Loader2
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

type AgentMode = 'idle' | 'monitoring' | 'analyzing' | 'waiting_validation'

interface AgentStatus {
    running: boolean
    mode: AgentMode
    uptime_seconds: number
    decisions_count: number
    triggers_count: number
    last_decision: {
        should_trigger: boolean
        reason: string
        timestamp: string
        trigger_source?: string
    } | null
    current_analysis: {
        id: string
        trigger_reason: string
        risks_count: number
        critical_count: number
        actions_count: number
    } | null
    thresholds: {
        dso_threshold: number
        concentration_max: number
        retard_critical_days: number
    }
}

interface AutonomousAgentPanelProps {
    onStatusChange?: (status: AgentStatus) => void
    className?: string
}

// ═══════════════════════════════════════════════════════════════════
// STATE MACHINE VISUALIZATION
// ═══════════════════════════════════════════════════════════════════

const MODES: { key: AgentMode; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'idle', label: 'ARRÊTÉ', icon: <Square className="w-4 h-4" />, color: 'bg-slate-400' },
    { key: 'monitoring', label: 'SURVEILLANCE', icon: <Eye className="w-4 h-4" />, color: 'bg-emerald-500' },
    { key: 'analyzing', label: 'ANALYSE', icon: <Search className="w-4 h-4" />, color: 'bg-blue-500' },
    { key: 'waiting_validation', label: 'ATTENTE DAF', icon: <Clock className="w-4 h-4" />, color: 'bg-amber-500' }
]

const formatUptime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m}m`
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function AutonomousAgentPanel({ 
    onStatusChange,
    className = '' 
}: AutonomousAgentPanelProps) {
    // State
    const [status, setStatus] = useState<AgentStatus | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    // ═══════════════════════════════════════════════════════════════
    // API CALLS
    // ═══════════════════════════════════════════════════════════════
    
    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch('/api/tresoris/agent/status')
            if (!response.ok) throw new Error('Failed to fetch status')
            const data = await response.json()
            setStatus(data)
            setError(null)
            onStatusChange?.(data)
        } catch (err) {
            console.error('Status fetch error:', err)
            setError('Erreur de connexion')
        }
    }, [onStatusChange])
    
    const startAgent = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/tresoris/agent/start', {
                method: 'POST'
            })
            if (!response.ok) throw new Error('Failed to start agent')
            await fetchStatus()
        } catch (err) {
            console.error('Start agent error:', err)
            setError('Erreur au démarrage')
        } finally {
            setIsLoading(false)
        }
    }, [fetchStatus])
    
    const stopAgent = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/tresoris/agent/stop', {
                method: 'POST'
            })
            if (!response.ok) throw new Error('Failed to stop agent')
            await fetchStatus()
        } catch (err) {
            console.error('Stop agent error:', err)
            setError('Erreur à l\'arrêt')
        } finally {
            setIsLoading(false)
        }
    }, [fetchStatus])
    
    // ═══════════════════════════════════════════════════════════════
    // LIFECYCLE & POLLING
    // ═══════════════════════════════════════════════════════════════
    
    useEffect(() => {
        // Initial fetch
        fetchStatus()
        
        // Poll every 3 seconds when running
        const interval = setInterval(() => {
            if (status?.running) {
                fetchStatus()
            }
        }, 3000)
        
        return () => clearInterval(interval)
    }, [fetchStatus, status?.running])
    
    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════
    
    const currentMode = status?.mode || 'idle'
    const isRunning = status?.running || false
    
    return (
        <div className={`bg-surface-elevated rounded-xl border border-border-subtle overflow-hidden ${className}`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-border-subtle bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isRunning ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}>
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary">Agent Autonome</h3>
                            <p className="text-xs text-tertiary">TRESORIS v2.0</p>
                        </div>
                    </div>
                    
                    {/* START/STOP Button */}
                    <button
                        onClick={isRunning ? stopAgent : startAgent}
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
                            isLoading 
                                ? 'bg-slate-200 text-slate-500 cursor-wait'
                                : isRunning
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isRunning ? (
                            <>
                                <Square className="w-5 h-5" />
                                <span>STOP</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" />
                                <span>START</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {/* State Machine Visualization */}
            <div className="px-5 py-4 border-b border-border-subtle">
                <div className="flex items-center justify-between gap-2">
                    {MODES.map((mode, idx) => {
                        const isActive = mode.key === currentMode
                        const isPast = MODES.findIndex(m => m.key === currentMode) > idx
                        
                        return (
                            <div key={mode.key} className="flex items-center flex-1">
                                {/* Node */}
                                <motion.div
                                    animate={{ 
                                        scale: isActive ? 1.05 : 1,
                                        opacity: isActive || isPast ? 1 : 0.4
                                    }}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                        isActive 
                                            ? `${mode.color} text-white shadow-md` 
                                            : isPast 
                                                ? 'bg-slate-200 text-slate-600'
                                                : 'bg-slate-100 text-slate-400'
                                    }`}
                                >
                                    {isActive && mode.key === 'monitoring' && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                        </span>
                                    )}
                                    {mode.icon}
                                    <span className="text-xs font-medium hidden sm:inline">{mode.label}</span>
                                </motion.div>
                                
                                {/* Connector */}
                                {idx < MODES.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${
                                        isPast ? 'bg-slate-300' : 'bg-slate-200'
                                    }`} />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-4 divide-x divide-border-subtle">
                <div className="px-4 py-3 text-center">
                    <div className="text-xs text-tertiary mb-1">Uptime</div>
                    <div className="text-lg font-semibold text-primary">
                        {status?.running ? formatUptime(status.uptime_seconds) : '—'}
                    </div>
                </div>
                <div className="px-4 py-3 text-center">
                    <div className="text-xs text-tertiary mb-1">Décisions</div>
                    <div className="text-lg font-semibold text-primary">
                        {status?.decisions_count || 0}
                    </div>
                </div>
                <div className="px-4 py-3 text-center">
                    <div className="text-xs text-tertiary mb-1">Triggers</div>
                    <div className="text-lg font-semibold text-emerald-600">
                        {status?.triggers_count || 0}
                    </div>
                </div>
                <div className="px-4 py-3 text-center">
                    <div className="text-xs text-tertiary mb-1">DSO Seuil</div>
                    <div className="text-lg font-semibold text-primary">
                        {status?.thresholds.dso_threshold || 45}j
                    </div>
                </div>
            </div>
            
            {/* Last Decision */}
            <AnimatePresence>
                {status?.last_decision && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border-subtle"
                    >
                        <div className="px-5 py-3 bg-slate-50">
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 p-1.5 rounded-full ${
                                    status.last_decision.should_trigger 
                                        ? 'bg-emerald-100 text-emerald-600' 
                                        : 'bg-slate-200 text-slate-500'
                                }`}>
                                    {status.last_decision.should_trigger ? (
                                        <Zap className="w-4 h-4" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                            status.last_decision.should_trigger 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {status.last_decision.should_trigger ? 'TRIGGER' : 'CHECK OK'}
                                        </span>
                                        <span className="text-xs text-tertiary">
                                            {new Date(status.last_decision.timestamp).toLocaleTimeString('fr-FR')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary truncate">
                                        {status.last_decision.reason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Current Analysis */}
            <AnimatePresence>
                {status?.current_analysis && status.mode === 'waiting_validation' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border-subtle"
                    >
                        <div className="px-5 py-3 bg-amber-50">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-5 h-5 text-amber-600" />
                                <span className="font-medium text-amber-800">Analyse en attente de validation</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-amber-700">
                                <span>
                                    <strong>{status.current_analysis.risks_count}</strong> risques
                                </span>
                                <span>
                                    <strong className="text-red-600">{status.current_analysis.critical_count}</strong> critiques
                                </span>
                                <span>
                                    <strong>{status.current_analysis.actions_count}</strong> actions proposées
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Error */}
            {error && (
                <div className="px-5 py-3 bg-red-50 border-t border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">{error}</span>
                </div>
            )}
        </div>
    )
}

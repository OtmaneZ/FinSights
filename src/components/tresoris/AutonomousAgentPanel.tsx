'use client'

/**
 * AutonomousAgentPanel - Panneau de contrôle de l'agent autonome
 * 
 * V2 Features:
 * - Bouton START/STOP avec état visible
 * - Machine à états (IDLE → MONITORING → ANALYZING → WAITING)
 * - MODE AUTO-SCAN: Scan automatique toutes les X secondes
 * - Uptime et compteurs de décisions/triggers
 * - Dernière décision de l'agent
 * - Callback pour ouvrir modal validation DAF
 * 
 * Architecture McKinsey-grade: clair, rigoureux, factuel
 */

import { useState, useCallback, useEffect, useRef } from 'react'
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
    Loader2,
    RotateCw,
    Settings2,
    Radio
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
        pending_actions?: ActionForValidation[]
    } | null
    thresholds: {
        dso_threshold: number
        concentration_max: number
        retard_critical_days: number
    }
}

export interface ActionForValidation {
    id: string
    priority: 'P1' | 'P2' | 'P3'
    title: string
    description?: string
    deadline: string
    impact_amount: number
    justification?: string
    validation_status: 'pending' | 'approved' | 'rejected' | 'postponed'
}

interface AutonomousAgentPanelProps {
    onStatusChange?: (status: AgentStatus) => void
    onWaitingValidation?: (actions: ActionForValidation[]) => void
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

const AUTO_SCAN_INTERVALS = [
    { value: 10, label: '10s' },
    { value: 30, label: '30s' },
    { value: 60, label: '1min' },
    { value: 120, label: '2min' }
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
    onWaitingValidation,
    className = '' 
}: AutonomousAgentPanelProps) {
    // State
    const [status, setStatus] = useState<AgentStatus | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    // Auto-Scan State
    const [autoScanEnabled, setAutoScanEnabled] = useState(false)
    const [autoScanInterval, setAutoScanInterval] = useState(30)
    const [nextScanIn, setNextScanIn] = useState<number | null>(null)
    const [showSettings, setShowSettings] = useState(false)
    const autoScanTimerRef = useRef<NodeJS.Timeout | null>(null)
    const countdownRef = useRef<NodeJS.Timeout | null>(null)
    
    // Refs pour callbacks stables
    const onStatusChangeRef = useRef(onStatusChange)
    const onWaitingValidationRef = useRef(onWaitingValidation)
    
    useEffect(() => {
        onStatusChangeRef.current = onStatusChange
        onWaitingValidationRef.current = onWaitingValidation
    }, [onStatusChange, onWaitingValidation])
    
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
            onStatusChangeRef.current?.(data)
            
            // Check if waiting for validation and has pending actions
            if (data.mode === 'waiting_validation' && data.current_analysis?.pending_actions) {
                onWaitingValidationRef.current?.(data.current_analysis.pending_actions)
            }
        } catch (err) {
            console.error('Status fetch error:', err)
            setError('Erreur de connexion')
        }
    }, [])
    
    const startAgent = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/tresoris/agent/start', {
                method: 'POST'
            })
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to start agent')
            }
            
            await fetchStatus()
        } catch (err) {
            console.error('Start agent error:', err)
            setError(err instanceof Error ? err.message : 'Erreur au démarrage')
        } finally {
            setIsLoading(false)
        }
    }, [fetchStatus])
    
    const stopAgent = useCallback(async () => {
        setIsLoading(true)
        setAutoScanEnabled(false) // Stop auto-scan when stopping agent
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
    
    // Trigger manual scan (simulates agent check)
    const triggerScan = useCallback(async () => {
        try {
            const response = await fetch('/api/tresoris/agent/trigger-scan', {
                method: 'POST'
            })
            if (!response.ok) throw new Error('Failed to trigger scan')
            await fetchStatus()
        } catch (err) {
            console.error('Trigger scan error:', err)
        }
    }, [fetchStatus])
    
    // ═══════════════════════════════════════════════════════════════
    // AUTO-SCAN LOGIC
    // ═══════════════════════════════════════════════════════════════
    
    useEffect(() => {
        // Clear existing timers
        if (autoScanTimerRef.current) {
            clearInterval(autoScanTimerRef.current)
            autoScanTimerRef.current = null
        }
        if (countdownRef.current) {
            clearInterval(countdownRef.current)
            countdownRef.current = null
        }
        
        if (autoScanEnabled && status?.running) {
            // Set countdown
            setNextScanIn(autoScanInterval)
            
            // Countdown timer
            countdownRef.current = setInterval(() => {
                setNextScanIn(prev => {
                    if (prev === null || prev <= 1) return autoScanInterval
                    return prev - 1
                })
            }, 1000)
            
            // Auto-scan timer
            autoScanTimerRef.current = setInterval(() => {
                triggerScan()
                setNextScanIn(autoScanInterval)
            }, autoScanInterval * 1000)
        } else {
            setNextScanIn(null)
        }
        
        return () => {
            if (autoScanTimerRef.current) clearInterval(autoScanTimerRef.current)
            if (countdownRef.current) clearInterval(countdownRef.current)
        }
    }, [autoScanEnabled, autoScanInterval, status?.running, triggerScan])
    
    // ═══════════════════════════════════════════════════════════════
    // LIFECYCLE & POLLING
    // ═══════════════════════════════════════════════════════════════
    
    useEffect(() => {
        // Initial fetch
        fetchStatus()
        
        // Poll every 3 seconds
        const interval = setInterval(() => {
            fetchStatus()
        }, 3000)
        
        return () => clearInterval(interval)
    }, [fetchStatus])
    
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
                    
                    <div className="flex items-center gap-3">
                        {/* Auto-Scan Toggle */}
                        {isRunning && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className={`p-2 rounded-lg transition-colors ${
                                        showSettings ? 'bg-slate-200 text-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                    }`}
                                    title="Paramètres Auto-Scan"
                                >
                                    <Settings2 className="w-4 h-4" />
                                </button>
                                
                                <button
                                    onClick={() => setAutoScanEnabled(!autoScanEnabled)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                                        autoScanEnabled
                                            ? 'bg-blue-500 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    <Radio className={`w-4 h-4 ${autoScanEnabled ? 'animate-pulse' : ''}`} />
                                    <span>Auto-Scan</span>
                                    {autoScanEnabled && nextScanIn !== null && (
                                        <span className="bg-blue-600 px-1.5 py-0.5 rounded text-xs">
                                            {nextScanIn}s
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}
                        
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
                
                {/* Auto-Scan Settings Panel */}
                <AnimatePresence>
                    {showSettings && isRunning && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-slate-200"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-700">Intervalle Auto-Scan</h4>
                                    <p className="text-xs text-slate-500">L'agent scannera automatiquement le portefeuille</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {AUTO_SCAN_INTERVALS.map(interval => (
                                        <button
                                            key={interval.value}
                                            onClick={() => setAutoScanInterval(interval.value)}
                                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                                autoScanInterval === interval.value
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {interval.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                    <div className="text-xs text-tertiary mb-1">Decisions</div>
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

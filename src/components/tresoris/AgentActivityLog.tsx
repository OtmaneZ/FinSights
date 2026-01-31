'use client'

/**
 * AgentActivityLog - Log d'activité enrichi de l'agent en temps réel
 * 
 * V2 Features:
 * - Affiche chaque étape de la boucle d'analyse
 * - Montre les calculs en cours (patterns, scoring, forecasting...)
 * - Style terminal avec timestamps précis
 * - Types de logs: scan, pattern, scoring, forecast, warning, action, decision
 * 
 * Style terminal pour crédibilité technique
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Terminal,
    RefreshCw,
    Info,
    Zap,
    Search,
    CheckCircle,
    AlertTriangle,
    XCircle,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    Target,
    BarChart3,
    Brain,
    ShieldAlert,
    ListChecks,
    Clock,
    Play,
    Square
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface AgentLog {
    id: string
    timestamp: string
    type: 'info' | 'trigger' | 'analysis' | 'decision' | 'warning' | 'error' | 
          'scan' | 'pattern' | 'scoring' | 'forecast' | 'action' | 'engine' | 'start' | 'stop'
    message: string
    details?: Record<string, unknown>
    step?: number  // Step number in analysis pipeline
    engine?: string  // Which engine is running
}

interface AgentActivityLogProps {
    className?: string
    maxLogs?: number
    autoRefresh?: boolean
    refreshInterval?: number
    onNewLog?: (log: AgentLog) => void
}

// ═══════════════════════════════════════════════════════════════════
// LOG TYPE CONFIG - Enhanced with new types
// ═══════════════════════════════════════════════════════════════════

const LOG_CONFIG: Record<AgentLog['type'], { 
    icon: React.ReactNode
    color: string
    bgColor: string
    prefix: string
    textColor: string
}> = {
    info: {
        icon: <Info className="w-3.5 h-3.5" />,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        prefix: 'INFO',
        textColor: 'text-blue-300'
    },
    start: {
        icon: <Play className="w-3.5 h-3.5" />,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        prefix: 'START',
        textColor: 'text-emerald-300'
    },
    stop: {
        icon: <Square className="w-3.5 h-3.5" />,
        color: 'text-slate-400',
        bgColor: 'bg-slate-500/10',
        prefix: 'STOP',
        textColor: 'text-slate-300'
    },
    scan: {
        icon: <Search className="w-3.5 h-3.5" />,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        prefix: 'SCAN',
        textColor: 'text-cyan-300'
    },
    trigger: {
        icon: <Zap className="w-3.5 h-3.5" />,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        prefix: 'TRIGGER',
        textColor: 'text-yellow-300'
    },
    pattern: {
        icon: <BarChart3 className="w-3.5 h-3.5" />,
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/10',
        prefix: 'PATTERN',
        textColor: 'text-violet-300'
    },
    scoring: {
        icon: <Target className="w-3.5 h-3.5" />,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        prefix: 'SCORING',
        textColor: 'text-orange-300'
    },
    forecast: {
        icon: <TrendingUp className="w-3.5 h-3.5" />,
        color: 'text-pink-400',
        bgColor: 'bg-pink-500/10',
        prefix: 'FORECAST',
        textColor: 'text-pink-300'
    },
    engine: {
        icon: <Brain className="w-3.5 h-3.5" />,
        color: 'text-indigo-400',
        bgColor: 'bg-indigo-500/10',
        prefix: 'ENGINE',
        textColor: 'text-indigo-300'
    },
    analysis: {
        icon: <Search className="w-3.5 h-3.5" />,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        prefix: 'ANALYSIS',
        textColor: 'text-purple-300'
    },
    warning: {
        icon: <ShieldAlert className="w-3.5 h-3.5" />,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        prefix: 'WARN',
        textColor: 'text-amber-300'
    },
    action: {
        icon: <ListChecks className="w-3.5 h-3.5" />,
        color: 'text-teal-400',
        bgColor: 'bg-teal-500/10',
        prefix: 'ACTION',
        textColor: 'text-teal-300'
    },
    decision: {
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        prefix: 'DECISION',
        textColor: 'text-emerald-300'
    },
    error: {
        icon: <XCircle className="w-3.5 h-3.5" />,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        prefix: 'ERROR',
        textColor: 'text-red-300'
    }
}

const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        fractionalSecondDigits: 2
    })
}

// Generate demo logs to show agent activity
const generateDemoLogs = (): AgentLog[] => {
    const now = new Date()
    const logs: AgentLog[] = []
    
    // Simulate a full analysis cycle
    const timestamps = Array.from({ length: 15 }, (_, i) => {
        const t = new Date(now.getTime() - (15 - i) * 2000)
        return t.toISOString()
    })
    
    logs.push(
        { id: '1', timestamp: timestamps[0], type: 'start', message: 'Agent TRESORIS démarré — Mode surveillance activé' },
        { id: '2', timestamp: timestamps[1], type: 'scan', message: 'Scan portefeuille — 18 factures pending, 1.25M€ encours total' },
        { id: '3', timestamp: timestamps[2], type: 'engine', message: 'ClientPaymentAnalyzer → Analyse patterns 7 clients...', engine: 'payment_patterns' },
        { id: '4', timestamp: timestamps[3], type: 'pattern', message: 'Pattern détecté: InnovCorp — avg_delay: 45j, trend: worsening [WARNING]' },
        { id: '5', timestamp: timestamps[4], type: 'engine', message: 'ClientRiskScorer → Calcul scores risque...', engine: 'client_scoring' },
        { id: '6', timestamp: timestamps[5], type: 'scoring', message: 'Score: InnovCorp → 72/100 (Rating D) | DataFlow → 35/100 (Rating A)' },
        { id: '7', timestamp: timestamps[6], type: 'engine', message: 'EarlyWarningDetector → Détection signaux faibles...', engine: 'early_warning' },
        { id: '8', timestamp: timestamps[7], type: 'warning', message: 'ALERTE: Retard progressif InnovCorp (+15j/mois depuis 3 mois)' },
        { id: '9', timestamp: timestamps[8], type: 'warning', message: 'ALERTE: Concentration client TechVision = 28% du portefeuille' },
        { id: '10', timestamp: timestamps[9], type: 'engine', message: 'SmartForecaster → Prévisions trésorerie 30/60/90j...', engine: 'smart_forecast' },
        { id: '11', timestamp: timestamps[10], type: 'forecast', message: 'Forecast: Runway actuel 8.2 semaines → Risque -2.1 sem si InnovCorp défaut' },
        { id: '12', timestamp: timestamps[11], type: 'trigger', message: 'TRIGGER: 2 risques critiques détectés — Analyse complète lancée' },
        { id: '13', timestamp: timestamps[12], type: 'engine', message: 'ActionPrioritizer → Génération actions priorisées...', engine: 'action_optimizer' },
        { id: '14', timestamp: timestamps[13], type: 'action', message: 'P1: Relance urgente InnovCorp (85K€) | P2: Diversification portefeuille' },
        { id: '15', timestamp: timestamps[14], type: 'decision', message: 'Analyse terminée — 2 risques, 3 actions générées — Attente validation DAF' }
    )
    
    return logs
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function AgentActivityLog({ 
    className = '',
    maxLogs = 20,
    autoRefresh = true,
    refreshInterval = 3000,
    onNewLog
}: AgentActivityLogProps) {
    const [logs, setLogs] = useState<AgentLog[]>([])
    const [isExpanded, setIsExpanded] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [useDemoLogs, setUseDemoLogs] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)
    const prevLogsLength = useRef(0)
    
    // ═══════════════════════════════════════════════════════════════
    // FETCH LOGS
    // ═══════════════════════════════════════════════════════════════
    
    const fetchLogs = useCallback(async () => {
        try {
            const response = await fetch('/api/tresoris/agent/status')
            if (!response.ok) {
                // Use demo logs if API not available
                setUseDemoLogs(true)
                return
            }
            const data = await response.json()
            if (data.logs && data.logs.length > 0) {
                setLogs(data.logs.slice(0, maxLogs))
                setUseDemoLogs(false)
                
                // Notify new logs
                if (data.logs.length > prevLogsLength.current && onNewLog) {
                    onNewLog(data.logs[0])
                }
                prevLogsLength.current = data.logs.length
            } else {
                setUseDemoLogs(true)
            }
        } catch (err) {
            console.error('Failed to fetch logs:', err)
            setUseDemoLogs(true)
        }
    }, [maxLogs, onNewLog])
    
    const manualRefresh = async () => {
        setIsLoading(true)
        await fetchLogs()
        setIsLoading(false)
    }
    
    // Auto-scroll to bottom on new logs
    useEffect(() => {
        if (scrollRef.current && logs.length > 0) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])
    
    // ═══════════════════════════════════════════════════════════════
    // LIFECYCLE & POLLING
    // ═══════════════════════════════════════════════════════════════
    
    useEffect(() => {
        fetchLogs()
        
        if (autoRefresh) {
            const interval = setInterval(fetchLogs, refreshInterval)
            return () => clearInterval(interval)
        }
    }, [fetchLogs, autoRefresh, refreshInterval])
    
    // Use demo logs if no real logs
    const displayLogs = useDemoLogs ? generateDemoLogs() : logs
    
    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════
    
    return (
        <div className={`bg-slate-900 rounded-xl border border-slate-700 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <Terminal className="w-4 h-4" />
                        <span className="font-mono text-sm font-medium">tresoris-agent.log</span>
                    </div>
                    {useDemoLogs && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">
                            DEMO
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">
                        {displayLogs.length} entrées
                    </span>
                    <button
                        onClick={manualRefresh}
                        disabled={isLoading}
                        className="p-1.5 text-slate-400 hover:text-white rounded transition-colors"
                        title="Rafraîchir"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 text-slate-400 hover:text-white rounded transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
            
            {/* Log Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div 
                            ref={scrollRef}
                            className="p-4 font-mono text-xs max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
                        >
                            {displayLogs.length === 0 ? (
                                <div className="text-slate-500 text-center py-8">
                                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>Aucune activité</p>
                                    <p className="text-xs mt-1">Démarrez l'agent pour voir les logs</p>
                                </div>
                            ) : (
                                <div className="space-y-0.5">
                                    <AnimatePresence mode="popLayout">
                                        {displayLogs.map((log, idx) => {
                                            const config = LOG_CONFIG[log.type] || LOG_CONFIG.info
                                            
                                            return (
                                                <motion.div
                                                    key={log.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ delay: idx * 0.02 }}
                                                    className="flex items-start gap-2 py-1 group hover:bg-slate-800/50 px-2 -mx-2 rounded"
                                                >
                                                    {/* Timestamp */}
                                                    <span className="text-slate-600 shrink-0 w-24 tabular-nums">
                                                        [{formatTime(log.timestamp)}]
                                                    </span>
                                                    
                                                    {/* Type Badge */}
                                                    <span className={`shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide ${config.bgColor} ${config.color}`}>
                                                        {config.icon}
                                                        <span className="font-bold">{config.prefix}</span>
                                                    </span>
                                                    
                                                    {/* Engine indicator */}
                                                    {log.engine && (
                                                        <span className="shrink-0 px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded text-[10px] font-mono">
                                                            {log.engine}
                                                        </span>
                                                    )}
                                                    
                                                    {/* Message */}
                                                    <span className={`flex-1 ${config.textColor}`}>
                                                        {log.message}
                                                    </span>
                                                </motion.div>
                                            )
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}
                            
                            {/* Blinking Cursor */}
                            <div className="flex items-center gap-2 mt-3 text-slate-500 border-t border-slate-800 pt-3">
                                <span className="text-emerald-500">tresoris@agent</span>
                                <span className="text-slate-600">~</span>
                                <span className="text-slate-500">$</span>
                                <span className="animate-pulse text-emerald-400">▌</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

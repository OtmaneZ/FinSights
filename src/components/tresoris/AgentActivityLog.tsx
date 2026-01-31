'use client'

/**
 * AgentActivityLog - Vue Events type Notion
 * 
 * V3 Features:
 * - Design moderne B2B (Notion/Linear style)
 * - Timeline verticale clean
 * - Événements groupés par catégorie
 * - Couleurs subtiles professionnelles
 * 
 * Plus de style terminal geek - design SaaS moderne
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Activity,
    RefreshCw,
    CheckCircle2,
    Zap,
    Search,
    AlertTriangle,
    XCircle,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    Target,
    BarChart3,
    Brain,
    ListChecks,
    Play,
    Square,
    Sparkles,
    FileText,
    Eye
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
    step?: number
    engine?: string
}

interface AgentActivityLogProps {
    className?: string
    maxLogs?: number
    autoRefresh?: boolean
    refreshInterval?: number
    onNewLog?: (log: AgentLog) => void
}

// ═══════════════════════════════════════════════════════════════════
// EVENT CONFIG - Notion style
// ═══════════════════════════════════════════════════════════════════

const EVENT_CONFIG: Record<AgentLog['type'], { 
    icon: React.ReactNode
    label: string
    colorClass: string
}> = {
    start: {
        icon: <Play className="w-4 h-4" />,
        label: 'Agent démarré',
        colorClass: 'emerald'
    },
    stop: {
        icon: <Square className="w-4 h-4" />,
        label: 'Agent arrêté',
        colorClass: 'slate'
    },
    scan: {
        icon: <Search className="w-4 h-4" />,
        label: 'Scan portfolio',
        colorClass: 'blue'
    },
    info: {
        icon: <Eye className="w-4 h-4" />,
        label: 'Information',
        colorClass: 'slate'
    },
    engine: {
        icon: <Brain className="w-4 h-4" />,
        label: 'Moteur actif',
        colorClass: 'violet'
    },
    pattern: {
        icon: <BarChart3 className="w-4 h-4" />,
        label: 'Analyse patterns',
        colorClass: 'indigo'
    },
    scoring: {
        icon: <Target className="w-4 h-4" />,
        label: 'Scoring client',
        colorClass: 'purple'
    },
    forecast: {
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Prévisions',
        colorClass: 'pink'
    },
    analysis: {
        icon: <Sparkles className="w-4 h-4" />,
        label: 'Analyse complète',
        colorClass: 'cyan'
    },
    warning: {
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'Alerte détectée',
        colorClass: 'amber'
    },
    trigger: {
        icon: <Zap className="w-4 h-4" />,
        label: 'Déclencheur activé',
        colorClass: 'orange'
    },
    action: {
        icon: <ListChecks className="w-4 h-4" />,
        label: 'Action générée',
        colorClass: 'teal'
    },
    decision: {
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: 'Décision prise',
        colorClass: 'emerald'
    },
    error: {
        icon: <XCircle className="w-4 h-4" />,
        label: 'Erreur',
        colorClass: 'red'
    }
}

const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit'
    })
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function AgentActivityLog({
    className = '',
    maxLogs = 20,
    autoRefresh = true,
    refreshInterval = 2000,
    onNewLog
}: AgentActivityLogProps) {
    const [logs, setLogs] = useState<AgentLog[]>([])
    const [isExpanded, setIsExpanded] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const lastLogCountRef = useRef(0)
    const onNewLogRef = useRef(onNewLog)
    
    useEffect(() => {
        onNewLogRef.current = onNewLog
    }, [onNewLog])

    // Fetch logs from API
    const fetchLogs = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await fetch('/api/tresoris/agent/status')
            if (!res.ok) throw new Error('Failed to fetch logs')
            
            const data = await res.json()
            const newLogs: AgentLog[] = data.logs || []
            
            setLogs(newLogs.slice(-maxLogs))
            
            // Notify on new logs
            if (newLogs.length > lastLogCountRef.current && onNewLogRef.current) {
                const latestLog = newLogs[newLogs.length - 1]
                if (latestLog) onNewLogRef.current(latestLog)
            }
            lastLogCountRef.current = newLogs.length
        } catch (err) {
            console.error('Error fetching agent logs:', err)
        } finally {
            setIsLoading(false)
        }
    }, [maxLogs])

    // Auto-refresh
    useEffect(() => {
        fetchLogs()
        
        if (!autoRefresh) return
        
        const interval = setInterval(fetchLogs, refreshInterval)
        return () => clearInterval(interval)
    }, [fetchLogs, autoRefresh, refreshInterval])

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    // Demo logs for display when agent not started
    const demoLogs: AgentLog[] = logs.length > 0 ? [] : [
        {
            id: '1',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            type: 'info',
            message: 'En attente - Cliquez START pour demarrer l\'agent'
        }
    ]

    const displayLogs = logs.length > 0 ? logs : demoLogs

    return (
        <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-border bg-surface-subtle">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary">Activite Agent</h3>
                            <p className="text-xs text-tertiary mt-0.5">
                                {logs.length} evenement{logs.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Expand/Collapse */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 hover:bg-surface-hover rounded-md transition-colors"
                        >
                            {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-secondary" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-secondary" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Events List */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div
                            ref={scrollRef}
                            className="max-h-[400px] overflow-y-auto p-4"
                        >
                            {logs.length === 0 ? (
                                <div className="py-8 text-center">
                                    <FileText className="w-12 h-12 mx-auto mb-3 text-tertiary opacity-30" />
                                    <p className="text-sm text-tertiary">Aucun événement</p>
                                    <p className="text-xs text-tertiary/60 mt-1">
                                        Démarrez l'agent pour voir l'activité
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-[19px] top-6 bottom-6 w-px bg-border" />
                                    
                                    {/* Events */}
                                    <div className="space-y-2 relative">
                                        {logs.map((log, index) => {
                                            const config = EVENT_CONFIG[log.type]
                                            
                                            return (
                                                <motion.div
                                                    key={log.id || index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    className="relative"
                                                >
                                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors">
                                                        {/* Icon */}
                                                        <div className={`
                                                            shrink-0 w-10 h-10 rounded-lg 
                                                            bg-${config.colorClass}-500/10 
                                                            border border-${config.colorClass}-200 dark:border-${config.colorClass}-800
                                                            flex items-center justify-center
                                                            text-${config.colorClass}-600 dark:text-${config.colorClass}-400
                                                            relative z-10
                                                        `}>
                                                            {config.icon}
                                                        </div>
                                                        
                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0 pt-1.5">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-primary leading-snug">
                                                                        {log.message}
                                                                    </p>
                                                                    {log.engine && (
                                                                        <p className="text-xs text-tertiary mt-1.5 flex items-center gap-1.5">
                                                                            <Brain className="w-3 h-3" />
                                                                            {log.engine.replace(/_/g, ' ')}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <time className="text-xs text-tertiary shrink-0 mt-0.5">
                                                                    {formatTime(log.timestamp)}
                                                                </time>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

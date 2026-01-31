'use client'

/**
 * AgentActivityLog - Log d'activité de l'agent en temps réel
 * 
 * Affiche les dernières actions de l'agent:
 * - Démarrage/arrêt
 * - Triggers automatiques
 * - Analyses lancées
 * - Décisions prises
 * 
 * Style terminal pour crédibilité technique
 */

import { useState, useEffect, useCallback } from 'react'
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
    ChevronUp
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface AgentLog {
    id: string
    timestamp: string
    type: 'info' | 'trigger' | 'analysis' | 'decision' | 'warning' | 'error'
    message: string
    details?: Record<string, unknown>
}

interface AgentActivityLogProps {
    className?: string
    maxLogs?: number
    autoRefresh?: boolean
    refreshInterval?: number
}

// ═══════════════════════════════════════════════════════════════════
// LOG TYPE CONFIG
// ═══════════════════════════════════════════════════════════════════

const LOG_CONFIG: Record<AgentLog['type'], { 
    icon: React.ReactNode
    color: string
    bgColor: string
    prefix: string
}> = {
    info: {
        icon: <Info className="w-3.5 h-3.5" />,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        prefix: 'INFO'
    },
    trigger: {
        icon: <Zap className="w-3.5 h-3.5" />,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        prefix: 'TRIGGER'
    },
    analysis: {
        icon: <Search className="w-3.5 h-3.5" />,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        prefix: 'ANALYSIS'
    },
    decision: {
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        prefix: 'DECISION'
    },
    warning: {
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        prefix: 'WARN'
    },
    error: {
        icon: <XCircle className="w-3.5 h-3.5" />,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        prefix: 'ERROR'
    }
}

const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    })
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function AgentActivityLog({ 
    className = '',
    maxLogs = 15,
    autoRefresh = true,
    refreshInterval = 3000
}: AgentActivityLogProps) {
    const [logs, setLogs] = useState<AgentLog[]>([])
    const [isExpanded, setIsExpanded] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    
    // ═══════════════════════════════════════════════════════════════
    // FETCH LOGS
    // ═══════════════════════════════════════════════════════════════
    
    const fetchLogs = useCallback(async () => {
        try {
            const response = await fetch('/api/tresoris/agent/status')
            if (!response.ok) return
            const data = await response.json()
            if (data.logs) {
                setLogs(data.logs.slice(0, maxLogs))
            }
        } catch (err) {
            console.error('Failed to fetch logs:', err)
        }
    }, [maxLogs])
    
    const manualRefresh = async () => {
        setIsLoading(true)
        await fetchLogs()
        setIsLoading(false)
    }
    
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
                        <span className="font-mono text-sm font-medium">agent.log</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
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
                        <div className="p-4 font-mono text-sm max-h-80 overflow-y-auto">
                            {logs.length === 0 ? (
                                <div className="text-slate-500 text-center py-8">
                                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>Aucune activité</p>
                                    <p className="text-xs mt-1">Démarrez l'agent pour voir les logs</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <AnimatePresence mode="popLayout">
                                        {logs.map((log, idx) => {
                                            const config = LOG_CONFIG[log.type]
                                            
                                            return (
                                                <motion.div
                                                    key={log.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ delay: idx * 0.03 }}
                                                    className="flex items-start gap-2 py-1 group"
                                                >
                                                    {/* Timestamp */}
                                                    <span className="text-slate-600 shrink-0 w-20">
                                                        [{formatTime(log.timestamp)}]
                                                    </span>
                                                    
                                                    {/* Type Badge */}
                                                    <span className={`shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${config.bgColor} ${config.color}`}>
                                                        {config.icon}
                                                        <span className="font-semibold">{config.prefix}</span>
                                                    </span>
                                                    
                                                    {/* Message */}
                                                    <span className="text-slate-300 flex-1">
                                                        {log.message}
                                                    </span>
                                                </motion.div>
                                            )
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}
                            
                            {/* Blinking Cursor */}
                            <div className="flex items-center gap-2 mt-2 text-slate-500">
                                <span>$</span>
                                <span className="animate-pulse">▌</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

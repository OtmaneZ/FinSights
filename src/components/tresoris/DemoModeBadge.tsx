'use client'

/**
 * DemoModeBadge - Badge indiquant le mode de fonctionnement
 * 
 * Détecte automatiquement si les endpoints sont mockés ou réels
 * et affiche le badge approprié.
 * 
 * - Demo Mode (Données Fictives) - Orange
 * - Live Mode (Données Réelles) - Vert
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Beaker,
    Radio,
    Wifi,
    WifiOff,
    AlertCircle,
    CheckCircle2,
    Info
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

type ConnectionMode = 'demo' | 'live' | 'checking' | 'error'

interface EndpointStatus {
    endpoint: string
    isLive: boolean
    latency?: number
}

interface DemoModeBadgeProps {
    className?: string
    showDetails?: boolean
    size?: 'sm' | 'md' | 'lg'
}

// ═══════════════════════════════════════════════════════════════════
// ENDPOINTS TO CHECK
// ═══════════════════════════════════════════════════════════════════

const ENDPOINTS_TO_CHECK = [
    '/api/tresoris/dashboard',
    '/api/tresoris/agent/status'
]

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function DemoModeBadge({ 
    className = '',
    showDetails = false,
    size = 'md'
}: DemoModeBadgeProps) {
    const [mode, setMode] = useState<ConnectionMode>('checking')
    const [endpointStatuses, setEndpointStatuses] = useState<EndpointStatus[]>([])
    const [showTooltip, setShowTooltip] = useState(false)
    
    // Check endpoints on mount
    useEffect(() => {
        const checkEndpoints = async () => {
            const statuses: EndpointStatus[] = []
            let hasLiveEndpoint = false
            
            for (const endpoint of ENDPOINTS_TO_CHECK) {
                try {
                    const start = performance.now()
                    const response = await fetch(endpoint, { 
                        method: 'GET',
                        headers: { 'Accept': 'application/json' }
                    })
                    const latency = Math.round(performance.now() - start)
                    
                    if (response.ok) {
                        const data = await response.json()
                        // Check if it's real data or mock
                        // Real data typically has more fields, timestamps, etc.
                        const isLive = data && !data.is_demo && !data.demo_mode
                        statuses.push({ endpoint, isLive, latency })
                        if (isLive) hasLiveEndpoint = true
                    } else {
                        statuses.push({ endpoint, isLive: false })
                    }
                } catch (err) {
                    statuses.push({ endpoint, isLive: false })
                }
            }
            
            setEndpointStatuses(statuses)
            
            // Determine overall mode
            // For this demo, we'll check if any endpoint returns live data
            // In practice, you'd want ALL endpoints to be live for "Live Mode"
            const allLive = statuses.every(s => s.isLive)
            const anyLive = statuses.some(s => s.isLive)
            
            if (allLive) {
                setMode('live')
            } else if (anyLive) {
                // Mixed mode - treat as demo for safety
                setMode('demo')
            } else {
                // All demo/mock
                setMode('demo')
            }
        }
        
        checkEndpoints()
        
        // Re-check every 30 seconds
        const interval = setInterval(checkEndpoints, 30000)
        return () => clearInterval(interval)
    }, [])
    
    // Size classes
    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    }
    
    // Mode config
    const modeConfig = {
        checking: {
            icon: <Radio className="w-4 h-4 animate-pulse" />,
            label: 'Vérification...',
            sublabel: '',
            bgColor: 'bg-slate-100',
            textColor: 'text-slate-600',
            borderColor: 'border-slate-200',
            pulseColor: 'bg-slate-400'
        },
        demo: {
            icon: <Beaker className="w-4 h-4" />,
            label: 'Demo Mode',
            sublabel: 'Données Fictives',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-200',
            pulseColor: 'bg-amber-500'
        },
        live: {
            icon: <Radio className="w-4 h-4" />,
            label: 'Live Mode',
            sublabel: 'Données Réelles',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-700',
            borderColor: 'border-emerald-200',
            pulseColor: 'bg-emerald-500'
        },
        error: {
            icon: <WifiOff className="w-4 h-4" />,
            label: 'Hors ligne',
            sublabel: 'Connexion perdue',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            borderColor: 'border-red-200',
            pulseColor: 'bg-red-500'
        }
    }
    
    const config = modeConfig[mode]
    
    return (
        <div 
            className={`relative inline-flex ${className}`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {/* Main Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                    inline-flex items-center gap-2 rounded-full border
                    ${config.bgColor} ${config.textColor} ${config.borderColor}
                    ${sizeClasses[size]}
                    cursor-help transition-all hover:shadow-sm
                `}
            >
                {/* Pulse Indicator */}
                <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${config.pulseColor}`}></span>
                </span>
                
                {/* Icon */}
                {config.icon}
                
                {/* Label */}
                <span className="font-medium">{config.label}</span>
                
                {/* Sublabel for larger sizes */}
                {size === 'lg' && config.sublabel && (
                    <span className="opacity-70">— {config.sublabel}</span>
                )}
            </motion.div>
            
            {/* Tooltip with Details */}
            {showDetails && showTooltip && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 z-50 w-64 p-3 bg-white rounded-lg shadow-xl border border-slate-200"
                >
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                        <div className={`p-1.5 rounded ${config.bgColor}`}>
                            {config.icon}
                        </div>
                        <div>
                            <div className="font-medium text-slate-900">{config.label}</div>
                            {config.sublabel && (
                                <div className="text-xs text-slate-500">{config.sublabel}</div>
                            )}
                        </div>
                    </div>
                    
                    {/* Endpoint Statuses */}
                    <div className="space-y-2">
                        <div className="text-xs text-slate-500 font-medium">Status Endpoints:</div>
                        {endpointStatuses.map((status, idx) => (
                            <div 
                                key={idx}
                                className="flex items-center justify-between text-xs"
                            >
                                <div className="flex items-center gap-1.5">
                                    {status.isLive ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                        <Beaker className="w-3.5 h-3.5 text-amber-500" />
                                    )}
                                    <span className="text-slate-600 truncate max-w-[140px]">
                                        {status.endpoint}
                                    </span>
                                </div>
                                {status.latency && (
                                    <span className="text-slate-400">{status.latency}ms</span>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    {/* Info */}
                    <div className="mt-3 pt-2 border-t border-slate-100">
                        <div className="flex items-start gap-1.5 text-xs text-slate-500">
                            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>
                                {mode === 'demo' 
                                    ? 'Les données affichées sont fictives pour démonstration.'
                                    : mode === 'live'
                                        ? 'Connecté aux APIs avec données réelles.'
                                        : 'Vérification de la connexion en cours...'
                                }
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════
// SIMPLE INLINE BADGE (for headers)
// ═══════════════════════════════════════════════════════════════════

export function DemoModeInlineBadge({ isDemo = true }: { isDemo?: boolean }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
            isDemo 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-emerald-100 text-emerald-700'
        }`}>
            <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isDemo ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                    isDemo ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
            </span>
            {isDemo ? 'DEMO' : 'LIVE'}
        </span>
    )
}

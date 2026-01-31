'use client'

/**
 * EarlyWarningPanel - Panneau d'alertes précoces
 * 
 * Affiche les warnings détectés par TRESORIS avec leur sévérité.
 */

import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertTriangle,
    Bell,
    Clock,
    TrendingDown,
    Users,
    Calendar,
    DollarSign,
    XCircle,
    CheckCircle2
} from 'lucide-react'
import { Warning } from './types'

interface EarlyWarningPanelProps {
    warnings: Warning[]
    onDismiss?: (id: string) => void
    className?: string
}

// Warning type icons
const WARNING_ICONS: Record<string, typeof AlertTriangle> = {
    critical_delay: Clock,
    significant_delay: Clock,
    progressive_delay: TrendingDown,
    concentration_risk: Users,
    seasonal_risk: Calendar,
    high_amount: DollarSign,
    rating_degradation: TrendingDown,
    partial_payments: DollarSign
}

// Severity configurations
const SEVERITY_CONFIG = {
    critical: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-500',
        icon: 'text-red-500',
        badge: 'bg-red-500',
        label: 'CRITIQUE'
    },
    high: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-500',
        icon: 'text-amber-500',
        badge: 'bg-amber-500',
        label: 'ÉLEVÉ'
    },
    medium: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-500',
        icon: 'text-blue-500',
        badge: 'bg-blue-500',
        label: 'MOYEN'
    },
    low: {
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        text: 'text-slate-400',
        icon: 'text-slate-400',
        badge: 'bg-slate-500',
        label: 'FAIBLE'
    }
}

export default function EarlyWarningPanel({
    warnings,
    onDismiss,
    className = ''
}: EarlyWarningPanelProps) {
    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    const sortedWarnings = [...warnings].sort(
        (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
    )
    
    // Count by severity
    const criticalCount = warnings.filter(w => w.severity === 'critical').length
    const highCount = warnings.filter(w => w.severity === 'high').length
    
    return (
        <div className={`bg-surface-elevated rounded-2xl border border-border-subtle ${className}`}>
            {/* Header */}
            <div className="p-6 border-b border-border-subtle">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center relative">
                            <Bell className="w-5 h-5 text-amber-500" />
                            {warnings.length > 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {warnings.length}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary">Alertes Précoces</h3>
                            <p className="text-sm text-secondary">Signaux faibles détectés</p>
                        </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex items-center gap-2">
                        {criticalCount > 0 && (
                            <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-medium rounded-full">
                                {criticalCount} critique(s)
                            </span>
                        )}
                        {highCount > 0 && (
                            <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-xs font-medium rounded-full">
                                {highCount} élevé(s)
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Warnings List */}
            <div className="divide-y divide-border-subtle max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                    {sortedWarnings.length === 0 ? (
                        <div className="p-8 text-center">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                            <p className="text-secondary">Aucune alerte active</p>
                            <p className="text-xs text-tertiary mt-1">Situation sous contrôle</p>
                        </div>
                    ) : (
                        sortedWarnings.map((warning, index) => {
                            const config = SEVERITY_CONFIG[warning.severity]
                            const IconComponent = WARNING_ICONS[warning.type] || AlertTriangle
                            
                            return (
                                <motion.div
                                    key={warning.id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 ${config.bg} hover:bg-opacity-20 transition-colors`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                            <IconComponent className={`w-4 h-4 ${config.icon}`} />
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-1.5 py-0.5 text-[10px] font-bold text-white rounded ${config.badge}`}>
                                                    {config.label}
                                                </span>
                                                <span className="text-sm font-medium text-primary capitalize">
                                                    {warning.type.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            
                                            <p className="text-sm text-secondary mb-2">
                                                {warning.message}
                                            </p>
                                            
                                            {/* Meta */}
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-tertiary">
                                                {warning.client && (
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {warning.client}
                                                    </span>
                                                )}
                                                {warning.amount_at_risk && (
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3" />
                                                        {(warning.amount_at_risk / 1000).toFixed(0)}K€ à risque
                                                    </span>
                                                )}
                                                {warning.days_overdue && warning.days_overdue > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {warning.days_overdue}j de retard
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Dismiss button */}
                                        {onDismiss && warning.id && (
                                            <button
                                                onClick={() => onDismiss(warning.id!)}
                                                className="p-1 text-tertiary hover:text-primary transition-colors shrink-0"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </AnimatePresence>
            </div>
            
            {/* Legend */}
            {warnings.length > 0 && (
                <div className="p-4 bg-secondary/30 border-t border-border-subtle">
                    <div className="flex items-center justify-center gap-4 text-xs">
                        {(['critical', 'high', 'medium', 'low'] as const).map((severity) => {
                            const config = SEVERITY_CONFIG[severity]
                            const count = warnings.filter(w => w.severity === severity).length
                            if (count === 0) return null
                            
                            return (
                                <div key={severity} className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${config.badge}`} />
                                    <span className="text-tertiary">{config.label}: {count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

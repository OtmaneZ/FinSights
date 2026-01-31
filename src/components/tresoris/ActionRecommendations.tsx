'use client'

/**
 * ActionRecommendations - Actions P1/P2/P3 avec validation
 * 
 * Affiche les actions recommandées par TRESORIS avec boutons de validation DAF.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    XCircle,
    Clock,
    Zap,
    Calendar,
    DollarSign,
    ChevronDown,
    ChevronUp,
    Loader2,
    ThumbsUp,
    ThumbsDown,
    AlertCircle,
    Circle,
    Lock
} from 'lucide-react'
import { Action } from './types'

interface ActionRecommendationsProps {
    actions: Action[]
    onValidate?: (actionId: string, decision: 'approved' | 'rejected') => Promise<void>
    className?: string
}

// Priority configurations
const PRIORITY_CONFIG = {
    P1: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-500',
        badge: 'bg-red-500',
        icon: AlertCircle,
        label: 'Immédiat',
        desc: 'Action requise dans les 24h'
    },
    P2: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-500',
        badge: 'bg-amber-500',
        icon: Circle,
        label: 'Cette semaine',
        desc: 'Action importante à planifier'
    },
    P3: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-500',
        badge: 'bg-blue-500',
        icon: Circle,
        label: 'Sous 2 semaines',
        desc: 'Action recommandée'
    }
}

export default function ActionRecommendations({
    actions,
    onValidate,
    className = ''
}: ActionRecommendationsProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [validatingId, setValidatingId] = useState<string | null>(null)
    
    // Handle validation
    const handleValidate = async (actionId: string, decision: 'approved' | 'rejected') => {
        if (!onValidate) return
        
        setValidatingId(actionId)
        try {
            await onValidate(actionId, decision)
        } catch (error) {
            console.error('Validation error:', error)
        } finally {
            setValidatingId(null)
        }
    }
    
    // Count by status
    const pendingCount = actions.filter(a => a.validation_status === 'pending' || !a.validation_status).length
    const approvedCount = actions.filter(a => a.validation_status === 'approved').length
    
    return (
        <div className={`bg-surface-elevated rounded-2xl border border-border-subtle ${className}`}>
            {/* Header */}
            <div className="p-6 border-b border-border-subtle">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary">Actions Recommandées</h3>
                            <p className="text-sm text-secondary">Propositions TRESORIS</p>
                        </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-2">
                        {pendingCount > 0 && (
                            <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-xs font-medium rounded-full">
                                {pendingCount} en attente
                            </span>
                        )}
                        {approvedCount > 0 && (
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-medium rounded-full">
                                {approvedCount} validée(s)
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Actions List */}
            <div className="divide-y divide-border-subtle">
                <AnimatePresence>
                    {actions.length === 0 ? (
                        <div className="p-8 text-center">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                            <p className="text-secondary">Aucune action requise</p>
                            <p className="text-xs text-tertiary mt-1">Situation sous contrôle</p>
                        </div>
                    ) : (
                        actions.map((action, index) => {
                            const config = PRIORITY_CONFIG[action.priority]
                            const isExpanded = expandedId === action.id
                            const isValidating = validatingId === action.id
                            const isPending = action.validation_status === 'pending' || !action.validation_status
                            
                            return (
                                <motion.div
                                    key={action.id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="overflow-hidden"
                                >
                                    {/* Main Row */}
                                    <div
                                        className={`p-4 hover:bg-surface-hover transition-colors ${
                                            action.validation_status === 'approved' ? 'bg-emerald-500/5' :
                                            action.validation_status === 'rejected' ? 'bg-red-500/5 opacity-60' :
                                            ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Priority Badge */}
                                            <div className={`px-2 py-1 ${config.badge} text-white text-xs font-bold rounded shrink-0`}>
                                                {action.priority}
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-primary">{action.title}</span>
                                                    
                                                    {/* Status indicator */}
                                                    {action.validation_status === 'approved' && (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                    )}
                                                    {action.validation_status === 'rejected' && (
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                    )}
                                                </div>
                                                
                                                {/* Meta */}
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-tertiary">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {action.deadline}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3" />
                                                        {(action.impact_amount / 1000).toFixed(0)}K€
                                                    </span>
                                                    <span className={`text-xs ${config.text}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Validation Buttons */}
                                            {isPending && onValidate && (
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {isValidating ? (
                                                        <Loader2 className="w-5 h-5 text-tertiary animate-spin" />
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleValidate(action.id!, 'approved')}
                                                                className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors"
                                                                title="Approuver"
                                                            >
                                                                <ThumbsUp className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleValidate(action.id!, 'rejected')}
                                                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                                                title="Rejeter"
                                                            >
                                                                <ThumbsDown className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {/* Expand Button */}
                                            {action.description && (
                                                <button
                                                    onClick={() => setExpandedId(isExpanded ? null : action.id || null)}
                                                    className="p-1 text-tertiary hover:text-primary transition-colors shrink-0"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        
                                        {/* Expanded Description */}
                                        <AnimatePresence>
                                            {isExpanded && action.description && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="mt-3 ml-10 p-3 bg-secondary/50 rounded-lg text-sm text-secondary whitespace-pre-wrap"
                                                >
                                                    {action.description}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </AnimatePresence>
            </div>
            
            {/* Governance Footer */}
            <div className="p-4 bg-secondary/30 border-t border-border-subtle">
                <div className="flex items-center justify-center gap-2 text-xs text-tertiary">
                    <Lock className="w-3 h-3" />
                    <span>Validation DAF requise • 0 exécution automatique</span>
                </div>
            </div>
        </div>
    )
}

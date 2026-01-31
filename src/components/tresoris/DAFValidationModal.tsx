'use client'

/**
 * DAFValidationModal - Modal de validation des actions par le DAF
 * 
 * S'ouvre automatiquement quand l'agent passe en mode WAITING_VALIDATION
 * 
 * Features:
 * - Affiche les actions recommandées avec détails
 * - Boutons: Approuver | Rejeter | Reporter
 * - Justification pour chaque action
 * - Impact estimé
 * - Feedback en temps réel
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Euro,
    Calendar,
    User,
    Zap,
    Shield,
    ArrowRight,
    Loader2,
    FileCheck,
    MessageSquare,
    Target,
    TrendingUp
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface ActionToValidate {
    id: string
    priority: 'P1' | 'P2' | 'P3'
    title: string
    description?: string
    deadline: string
    impact_amount: number
    justification?: string
    client?: string
    risk_id?: string
    validation_status: 'pending' | 'approved' | 'rejected' | 'postponed'
    roi_estimate?: number
    confidence?: 'high' | 'medium' | 'low'
}

interface DAFValidationModalProps {
    isOpen: boolean
    onClose: () => void
    actions: ActionToValidate[]
    onValidate: (actionId: string, decision: 'approved' | 'rejected' | 'postponed', comment?: string) => Promise<void>
    onValidateAll?: (decision: 'approved' | 'rejected') => Promise<void>
    analysisId?: string
    className?: string
}

// ═══════════════════════════════════════════════════════════════════
// PRIORITY CONFIG
// ═══════════════════════════════════════════════════════════════════

const PRIORITY_CONFIG = {
    P1: {
        label: 'Priorité 1',
        sublabel: 'Immédiat',
        color: 'bg-red-500',
        textColor: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <Zap className="w-4 h-4" />
    },
    P2: {
        label: 'Priorité 2',
        sublabel: 'Cette semaine',
        color: 'bg-amber-500',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: <Target className="w-4 h-4" />
    },
    P3: {
        label: 'Priorité 3',
        sublabel: 'Sous 2 semaines',
        color: 'bg-blue-500',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: <Calendar className="w-4 h-4" />
    }
}

// ═══════════════════════════════════════════════════════════════════
// ACTION CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════

function ActionCard({
    action,
    onValidate,
    isProcessing
}: {
    action: ActionToValidate
    onValidate: (decision: 'approved' | 'rejected' | 'postponed', comment?: string) => Promise<void>
    isProcessing: boolean
}) {
    const [comment, setComment] = useState('')
    const [showComment, setShowComment] = useState(false)
    const [localStatus, setLocalStatus] = useState(action.validation_status)
    
    const config = PRIORITY_CONFIG[action.priority]
    const isValidated = localStatus !== 'pending'
    
    const handleValidate = async (decision: 'approved' | 'rejected' | 'postponed') => {
        await onValidate(decision, comment || undefined)
        setLocalStatus(decision)
        setShowComment(false)
    }
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative border-2 rounded-xl overflow-hidden transition-all ${
                isValidated 
                    ? localStatus === 'approved'
                        ? 'border-emerald-300 bg-emerald-50'
                        : localStatus === 'rejected'
                            ? 'border-red-300 bg-red-50'
                            : 'border-amber-300 bg-amber-50'
                    : `${config.borderColor} ${config.bgColor}`
            }`}
        >
            {/* Priority Badge */}
            <div className={`absolute top-0 right-0 ${config.color} text-white text-xs font-bold px-3 py-1 rounded-bl-lg`}>
                {action.priority}
            </div>
            
            {/* Validation Status Overlay */}
            {isValidated && (
                <div className={`absolute inset-0 flex items-center justify-center bg-white/60 z-10`}>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                        localStatus === 'approved' 
                            ? 'bg-emerald-500 text-white'
                            : localStatus === 'rejected'
                                ? 'bg-red-500 text-white'
                                : 'bg-amber-500 text-white'
                    }`}>
                        {localStatus === 'approved' && <CheckCircle2 className="w-5 h-5" />}
                        {localStatus === 'rejected' && <XCircle className="w-5 h-5" />}
                        {localStatus === 'postponed' && <Clock className="w-5 h-5" />}
                        <span>
                            {localStatus === 'approved' && 'Approuvé'}
                            {localStatus === 'rejected' && 'Rejeté'}
                            {localStatus === 'postponed' && 'Reporté'}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgColor} ${config.textColor}`}>
                        {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 text-lg">{action.title}</h4>
                        {action.client && (
                            <div className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
                                <User className="w-3.5 h-3.5" />
                                <span>{action.client}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Description */}
                {action.description && (
                    <p className="text-sm text-slate-600 mb-4">
                        {action.description}
                    </p>
                )}
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <div className="text-xs text-slate-500">Montant</div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                            <Euro className="w-4 h-4 text-slate-400" />
                            {(action.impact_amount / 1000).toFixed(0)}K€
                        </div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <div className="text-xs text-slate-500">Deadline</div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {action.deadline}
                        </div>
                    </div>
                    {action.roi_estimate && (
                        <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div className="text-xs text-emerald-600">ROI estimé</div>
                            <div className="font-bold text-emerald-700 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {action.roi_estimate}%
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Justification */}
                {action.justification && (
                    <div className="p-3 bg-slate-100 rounded-lg mb-4">
                        <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Justification agent
                        </div>
                        <p className="text-sm text-slate-700 italic">
                            "{action.justification}"
                        </p>
                    </div>
                )}
                
                {/* Confidence */}
                {action.confidence && (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-slate-500">Confiance:</span>
                        <div className="flex items-center gap-1">
                            {['high', 'medium', 'low'].map((level, idx) => (
                                <div
                                    key={level}
                                    className={`w-2 h-2 rounded-full ${
                                        (action.confidence === 'high') ||
                                        (action.confidence === 'medium' && idx < 2) ||
                                        (action.confidence === 'low' && idx === 0)
                                            ? action.confidence === 'high' 
                                                ? 'bg-emerald-500'
                                                : action.confidence === 'medium'
                                                    ? 'bg-amber-500'
                                                    : 'bg-red-500'
                                            : 'bg-slate-200'
                                    }`}
                                />
                            ))}
                            <span className={`text-xs font-medium ml-1 ${
                                action.confidence === 'high' ? 'text-emerald-600' :
                                action.confidence === 'medium' ? 'text-amber-600' :
                                'text-red-600'
                            }`}>
                                {action.confidence === 'high' ? 'Haute' :
                                 action.confidence === 'medium' ? 'Moyenne' : 'Faible'}
                            </span>
                        </div>
                    </div>
                )}
                
                {/* Comment Input */}
                <AnimatePresence>
                    {showComment && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4"
                        >
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Ajouter un commentaire (optionnel)..."
                                className="w-full p-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={2}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Action Buttons */}
                {!isValidated && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleValidate('approved')}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            Approuver
                        </button>
                        <button
                            onClick={() => handleValidate('rejected')}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            <XCircle className="w-4 h-4" />
                            Rejeter
                        </button>
                        <button
                            onClick={() => handleValidate('postponed')}
                            disabled={isProcessing}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                            title="Reporter"
                        >
                            <Clock className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowComment(!showComment)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                            title="Ajouter un commentaire"
                        >
                            <MessageSquare className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function DAFValidationModal({
    isOpen,
    onClose,
    actions,
    onValidate,
    onValidateAll,
    analysisId,
    className = ''
}: DAFValidationModalProps) {
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [validationCounts, setValidationCounts] = useState({
        approved: 0,
        rejected: 0,
        postponed: 0,
        pending: actions.length
    })
    
    // Update counts when actions change
    useEffect(() => {
        setValidationCounts({
            approved: actions.filter(a => a.validation_status === 'approved').length,
            rejected: actions.filter(a => a.validation_status === 'rejected').length,
            postponed: actions.filter(a => a.validation_status === 'postponed').length,
            pending: actions.filter(a => a.validation_status === 'pending').length
        })
    }, [actions])
    
    const handleValidateAction = async (actionId: string, decision: 'approved' | 'rejected' | 'postponed', comment?: string) => {
        setProcessingId(actionId)
        try {
            await onValidate(actionId, decision, comment)
            // Update local counts
            setValidationCounts(prev => ({
                ...prev,
                [decision]: prev[decision] + 1,
                pending: prev.pending - 1
            }))
        } finally {
            setProcessingId(null)
        }
    }
    
    const handleValidateAllApprove = async () => {
        if (onValidateAll) {
            await onValidateAll('approved')
        }
    }
    
    const allValidated = validationCounts.pending === 0
    const totalImpact = actions.reduce((sum, a) => sum + a.impact_amount, 0)
    
    // Sort actions by priority
    const sortedActions = [...actions].sort((a, b) => {
        const order = { P1: 0, P2: 1, P3: 2 }
        return order[a.priority] - order[b.priority]
    })
    
    if (!isOpen) return null
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className={`w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ${className}`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Validation DAF Requise</h2>
                                <p className="text-sm text-slate-600">
                                    {actions.length} action{actions.length > 1 ? 's' : ''} recommandée{actions.length > 1 ? 's' : ''} par l'agent
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Summary Bar */}
                    <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-slate-600">{validationCounts.approved} approuvée{validationCounts.approved > 1 ? 's' : ''}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-slate-600">{validationCounts.rejected} rejetée{validationCounts.rejected > 1 ? 's' : ''}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-slate-600">{validationCounts.postponed} reportée{validationCounts.postponed > 1 ? 's' : ''}</span>
                            </span>
                        </div>
                        <div className="text-sm font-medium text-slate-700">
                            Impact total: <span className="text-emerald-600">{(totalImpact / 1000).toFixed(0)}K€</span>
                        </div>
                    </div>
                    
                    {/* Actions List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {sortedActions.map((action) => (
                            <ActionCard
                                key={action.id}
                                action={action}
                                onValidate={(decision, comment) => handleValidateAction(action.id, decision, comment)}
                                isProcessing={processingId === action.id}
                            />
                        ))}
                    </div>
                    
                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            {analysisId && <span>Analyse #{analysisId.slice(0, 8)}</span>}
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {!allValidated && onValidateAll && (
                                <button
                                    onClick={handleValidateAllApprove}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    <FileCheck className="w-4 h-4" />
                                    Tout approuver
                                </button>
                            )}
                            
                            <button
                                onClick={onClose}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                                    allValidated
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                }`}
                            >
                                {allValidated ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Terminé
                                    </>
                                ) : (
                                    'Fermer'
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

'use client'

/**
 * AgentReactionTimeline - Timeline temps réel de la réaction agent
 * 
 * Affiche les étapes de traitement TRESORIS avec animation.
 */

import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    Loader2,
    Database,
    Brain,
    AlertTriangle,
    Zap,
    FileText,
    Shield
} from 'lucide-react'

export interface TimelineStep {
    id: string
    label: string
    description?: string
    status: 'pending' | 'processing' | 'completed' | 'error'
    icon?: typeof CheckCircle2
}

interface AgentReactionTimelineProps {
    steps: TimelineStep[]
    currentStep?: string
    className?: string
}

// Default steps for TRESORIS analysis
export const DEFAULT_ANALYSIS_STEPS: TimelineStep[] = [
    {
        id: 'data',
        label: 'Chargement données',
        description: 'Lecture des factures clients',
        status: 'pending',
        icon: Database
    },
    {
        id: 'patterns',
        label: 'Analyse patterns',
        description: 'Comportement de paiement par client',
        status: 'pending',
        icon: Brain
    },
    {
        id: 'warnings',
        label: 'Détection signaux',
        description: 'Early warnings et anomalies',
        status: 'pending',
        icon: AlertTriangle
    },
    {
        id: 'actions',
        label: 'Proposition actions',
        description: 'Actions P1/P2/P3 optimisées',
        status: 'pending',
        icon: Zap
    },
    {
        id: 'report',
        label: 'Génération rapport',
        description: 'Note de synthèse DAF',
        status: 'pending',
        icon: FileText
    },
    {
        id: 'validation',
        label: 'Attente validation',
        description: 'STOP - Validation DAF requise',
        status: 'pending',
        icon: Shield
    }
]

export default function AgentReactionTimeline({
    steps,
    currentStep,
    className = ''
}: AgentReactionTimelineProps) {
    return (
        <div className={`bg-surface-elevated rounded-2xl border border-border-subtle p-6 ${className}`}>
            <h3 className="font-semibold text-primary mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent-primary" />
                Cycle d'analyse TRESORIS
            </h3>
            
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border-subtle" />
                
                {/* Steps */}
                <div className="space-y-4">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon || CheckCircle2
                        const isActive = step.id === currentStep
                        const isCompleted = step.status === 'completed'
                        const isProcessing = step.status === 'processing'
                        const isError = step.status === 'error'
                        
                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-10"
                            >
                                {/* Status Icon */}
                                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                                    isCompleted
                                        ? 'bg-emerald-500 text-white'
                                        : isProcessing || isActive
                                        ? 'bg-accent-primary text-white'
                                        : isError
                                        ? 'bg-red-500 text-white'
                                        : 'bg-secondary text-tertiary border border-border-subtle'
                                }`}>
                                    {isProcessing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                        <IconComponent className="w-4 h-4" />
                                    )}
                                </div>
                                
                                {/* Content */}
                                <div className={`p-3 rounded-lg transition-all ${
                                    isActive || isProcessing
                                        ? 'bg-accent-primary/10 border border-accent-primary/30'
                                        : isCompleted
                                        ? 'bg-emerald-500/5'
                                        : isError
                                        ? 'bg-red-500/10'
                                        : 'bg-secondary/30'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${
                                            isCompleted ? 'text-emerald-500' :
                                            isActive || isProcessing ? 'text-accent-primary' :
                                            isError ? 'text-red-500' :
                                            'text-secondary'
                                        }`}>
                                            {step.label}
                                        </span>
                                        
                                        {isProcessing && (
                                            <span className="text-xs text-accent-primary animate-pulse">
                                                En cours...
                                            </span>
                                        )}
                                    </div>
                                    
                                    {step.description && (
                                        <p className="text-xs text-tertiary mt-1">{step.description}</p>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-6 pt-4 border-t border-border-subtle">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-tertiary">Progression</span>
                    <span className="font-medium text-primary">
                        {steps.filter(s => s.status === 'completed').length} / {steps.length}
                    </span>
                </div>
                <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-accent-primary to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%`
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </div>
    )
}

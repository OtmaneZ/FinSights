'use client'

/**
 * CashRunwayGauge - Jauge visuelle du runway en semaines
 * 
 * Affiche le "temps de survie" de l'entreprise avant tension cash.
 */

import { motion } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react'

interface CashRunwayGaugeProps {
    runwayWeeks: number
    previousRunway?: number
    targetRunway?: number
    className?: string
}

export default function CashRunwayGauge({
    runwayWeeks,
    previousRunway,
    targetRunway = 12,
    className = ''
}: CashRunwayGaugeProps) {
    // Calculer le pourcentage (cap à 100%)
    const percentage = Math.min((runwayWeeks / targetRunway) * 100, 100)
    
    // Déterminer le statut
    const getStatus = () => {
        if (runwayWeeks >= 10) return { color: 'emerald', label: 'Confortable', icon: CheckCircle2 }
        if (runwayWeeks >= 6) return { color: 'amber', label: 'Surveillance', icon: AlertTriangle }
        return { color: 'red', label: 'Critique', icon: AlertTriangle }
    }
    
    const status = getStatus()
    const StatusIcon = status.icon
    
    // Delta vs previous
    const delta = previousRunway ? runwayWeeks - previousRunway : 0
    
    return (
        <div className={`p-6 bg-surface-elevated rounded-2xl border border-border-subtle ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary">Cash Runway</h3>
                        <p className="text-sm text-secondary">Horizon de trésorerie</p>
                    </div>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${status.color}-500/10`}>
                    <StatusIcon className={`w-4 h-4 text-${status.color}-500`} />
                    <span className={`text-sm font-medium text-${status.color}-500`}>{status.label}</span>
                </div>
            </div>
            
            {/* Main Value */}
            <div className="flex items-baseline gap-2 mb-4">
                <motion.span
                    key={runwayWeeks}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-primary"
                >
                    {runwayWeeks.toFixed(1)}
                </motion.span>
                <span className="text-lg text-secondary">semaines</span>
                
                {delta !== 0 && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`ml-2 flex items-center gap-1 text-sm font-medium ${
                            delta > 0 ? 'text-emerald-500' : 'text-red-500'
                        }`}
                    >
                        {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                        <TrendingDown className={`w-4 h-4 ${delta > 0 ? 'rotate-180' : ''}`} />
                    </motion.span>
                )}
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 rounded-full ${
                        status.color === 'emerald'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                            : status.color === 'amber'
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                            : 'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                />
                
                {/* Target marker */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-600"
                    style={{ left: '100%' }}
                >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-tertiary whitespace-nowrap">
                        Cible: {targetRunway}s
                    </div>
                </div>
            </div>
            
            {/* Scale */}
            <div className="flex justify-between mt-2 text-xs text-tertiary">
                <span>0 sem</span>
                <span>6 sem</span>
                <span>{targetRunway} sem</span>
            </div>
            
            {/* Context */}
            <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-sm text-secondary">
                {runwayWeeks >= 10 ? (
                    <p>✅ Situation confortable. Vous avez plus de 2 mois de visibilité.</p>
                ) : runwayWeeks >= 6 ? (
                    <p>⚠️ Surveillance recommandée. Anticipez les encaissements à risque.</p>
                ) : (
                    <p>🔴 Situation tendue. Actions de recouvrement prioritaires.</p>
                )}
            </div>
        </div>
    )
}

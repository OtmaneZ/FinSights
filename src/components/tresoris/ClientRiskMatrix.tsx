'use client'

/**
 * ClientRiskMatrix - Matrice de scoring clients A/B/C/D
 * 
 * Affiche les clients triés par niveau de risque avec leurs métriques.
 */

import { motion } from 'framer-motion'
import { Users, AlertTriangle, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'
import { RiskyClient } from './types'

interface ClientRiskMatrixProps {
    clients: RiskyClient[]
    onClientClick?: (clientName: string) => void
    className?: string
}

// Rating configurations
const RATING_CONFIG = {
    A: { color: 'emerald', label: 'Excellent', bg: 'bg-emerald-500', desc: 'Paiement régulier, faible risque' },
    B: { color: 'blue', label: 'Bon', bg: 'bg-blue-500', desc: 'Légères variations, risque modéré' },
    C: { color: 'amber', label: 'Surveillé', bg: 'bg-amber-500', desc: 'Retards occasionnels, attention requise' },
    D: { color: 'red', label: 'À risque', bg: 'bg-red-500', desc: 'Retards fréquents, action requise' }
}

// Get rating from score
const getRating = (score: number): 'A' | 'B' | 'C' | 'D' => {
    if (score < 35) return 'A'
    if (score < 50) return 'B'
    if (score < 70) return 'C'
    return 'D'
}

export default function ClientRiskMatrix({
    clients,
    onClientClick,
    className = ''
}: ClientRiskMatrixProps) {
    // Group clients by rating
    const clientsByRating = clients.reduce((acc, client) => {
        const rating = getRating(client.max_score)
        if (!acc[rating]) acc[rating] = []
        acc[rating].push(client)
        return acc
    }, {} as Record<string, RiskyClient[]>)
    
    // Stats
    const totalClients = clients.length
    const criticalClients = clients.filter(c => c.status === 'CRITICAL').length
    const totalAmount = clients.reduce((sum, c) => sum + c.total_amount, 0)
    
    return (
        <div className={`bg-surface-elevated rounded-2xl border border-border-subtle ${className}`}>
            {/* Header */}
            <div className="p-6 border-b border-border-subtle">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary">Matrice Clients</h3>
                            <p className="text-sm text-secondary">Scoring risque A/B/C/D</p>
                        </div>
                    </div>
                    
                    {/* Quick stats */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{totalClients}</div>
                            <div className="text-xs text-tertiary">clients</div>
                        </div>
                        {criticalClients > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium text-red-500">{criticalClients} critique(s)</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="p-4 bg-secondary/30 border-b border-border-subtle">
                <div className="flex gap-2">
                    {(['A', 'B', 'C', 'D'] as const).map((rating) => {
                        const count = clientsByRating[rating]?.length || 0
                        const config = RATING_CONFIG[rating]
                        const percentage = totalClients > 0 ? (count / totalClients) * 100 : 0
                        
                        return (
                            <div
                                key={rating}
                                className="flex-1 p-3 bg-primary rounded-xl border border-border-subtle text-center"
                            >
                                <div className={`w-8 h-8 ${config.bg} text-white font-bold rounded-lg mx-auto flex items-center justify-center mb-2`}>
                                    {rating}
                                </div>
                                <div className="text-lg font-semibold text-primary">{count}</div>
                                <div className="text-xs text-tertiary">{percentage.toFixed(0)}%</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            {/* Client List */}
            <div className="divide-y divide-border-subtle max-h-[400px] overflow-y-auto">
                {clients.length === 0 ? (
                    <div className="p-8 text-center text-tertiary">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Aucun client à afficher</p>
                    </div>
                ) : (
                    clients.map((client, index) => {
                        const rating = getRating(client.max_score)
                        const config = RATING_CONFIG[rating]
                        
                        return (
                            <motion.div
                                key={client.client_name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => onClientClick?.(client.client_name)}
                                className={`p-4 flex items-center gap-4 hover:bg-surface-hover transition-colors ${
                                    onClientClick ? 'cursor-pointer' : ''
                                }`}
                            >
                                {/* Rating Badge */}
                                <div className={`w-10 h-10 ${config.bg} text-white font-bold rounded-xl flex items-center justify-center shrink-0`}>
                                    {rating}
                                </div>
                                
                                {/* Client Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-primary truncate">{client.client_name}</div>
                                    <div className="flex items-center gap-3 text-sm text-tertiary">
                                        <span>{client.risk_count} facture(s)</span>
                                        {client.max_days_overdue > 0 && (
                                            <span className={`flex items-center gap-1 ${
                                                client.max_days_overdue > 60 ? 'text-red-500' :
                                                client.max_days_overdue > 30 ? 'text-amber-500' : 'text-secondary'
                                            }`}>
                                                <TrendingDown className="w-3 h-3" />
                                                {client.max_days_overdue}j retard
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Amount */}
                                <div className="text-right shrink-0">
                                    <div className="font-semibold text-primary">
                                        {(client.total_amount / 1000).toFixed(0)}K€
                                    </div>
                                    <div className="text-xs text-tertiary">
                                        Score: {client.max_score}/100
                                    </div>
                                </div>
                                
                                {/* Status indicator */}
                                {client.status === 'CRITICAL' && (
                                    <div className="shrink-0">
                                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                    </div>
                                )}
                                
                                {/* Arrow */}
                                {onClientClick && (
                                    <ChevronRight className="w-5 h-5 text-tertiary shrink-0" />
                                )}
                            </motion.div>
                        )
                    })
                )}
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-secondary/30 border-t border-border-subtle">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary">Total encours</span>
                    <span className="font-semibold text-primary">{(totalAmount / 1000).toFixed(0)}K€</span>
                </div>
            </div>
        </div>
    )
}

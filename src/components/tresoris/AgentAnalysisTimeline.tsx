'use client'

/**
 * AgentAnalysisTimeline - Timeline visuelle de l'analyse agent
 * 
 * Affiche 3 états:
 * - AVANT: État du portefeuille avant analyse
 * - PENDANT: Agent analyse (loader animé + engines actifs)
 * - APRÈS: Résultats avec diff (avant/après)
 * 
 * Montre visuellement la valeur ajoutée de l'agent autonome
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Clock,
    ArrowRight,
    CheckCircle2,
    AlertTriangle,
    TrendingDown,
    TrendingUp,
    Loader2,
    Brain,
    Eye,
    Zap,
    Shield,
    Target,
    BarChart3,
    Calendar
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

type TimelinePhase = 'before' | 'analyzing' | 'after'

interface PortfolioSnapshot {
    total_pending: number
    total_overdue: number
    runway_weeks: number
    dso_moyen: number
    risks_critical: number
    risks_uncertain: number
    risks_certain: number
    top_risk_client?: string
    top_risk_amount?: number
}

interface AnalysisResult {
    risks_detected: number
    risks_requalified: number
    actions_generated: number
    runway_impact: number
    amount_protected: number
    engines_used: string[]
}

interface AgentAnalysisTimelineProps {
    phase: TimelinePhase
    beforeSnapshot?: PortfolioSnapshot
    afterSnapshot?: PortfolioSnapshot
    analysisResult?: AnalysisResult
    analyzingEngines?: string[]
    className?: string
}

// ═══════════════════════════════════════════════════════════════════
// ENGINES CONFIG
// ═══════════════════════════════════════════════════════════════════

const ENGINES = [
    { id: 'payment_patterns', label: 'Patterns', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'client_scoring', label: 'Scoring', icon: <Target className="w-4 h-4" /> },
    { id: 'early_warning', label: 'Alertes', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'smart_forecast', label: 'Prévisions', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'action_optimizer', label: 'Actions', icon: <Zap className="w-4 h-4" /> },
    { id: 'seasonality', label: 'Saisonnalité', icon: <Calendar className="w-4 h-4" /> }
]

// ═══════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function MetricCard({ 
    label, 
    value, 
    suffix = '',
    trend,
    highlight = false 
}: { 
    label: string
    value: string | number
    suffix?: string
    trend?: 'up' | 'down' | 'neutral'
    highlight?: boolean
}) {
    return (
        <div className={`p-3 rounded-lg border ${
            highlight 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-white border-slate-200'
        }`}>
            <div className="text-xs text-slate-500 mb-1">{label}</div>
            <div className="flex items-center gap-1">
                <span className={`text-lg font-bold ${
                    highlight ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                    {value}{suffix}
                </span>
                {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
            </div>
        </div>
    )
}

function DiffIndicator({ before, after, suffix = '', inverse = false }: { 
    before: number
    after: number
    suffix?: string
    inverse?: boolean  // true = lower is better
}) {
    const diff = after - before
    const isPositive = inverse ? diff < 0 : diff > 0
    const isNegative = inverse ? diff > 0 : diff < 0
    
    if (diff === 0) return null
    
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${
            isPositive 
                ? 'bg-emerald-100 text-emerald-700' 
                : isNegative 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-600'
        }`}>
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {diff > 0 ? '+' : ''}{diff.toFixed(1)}{suffix}
        </span>
    )
}

// ═══════════════════════════════════════════════════════════════════
// PHASE COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function BeforePhase({ snapshot }: { snapshot: PortfolioSnapshot }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900">État actuel du portefeuille</h4>
                    <p className="text-xs text-slate-500">Avant analyse agent</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard 
                    label="Encours total" 
                    value={(snapshot.total_pending / 1000).toFixed(0)} 
                    suffix="K€" 
                />
                <MetricCard 
                    label="En retard" 
                    value={(snapshot.total_overdue / 1000).toFixed(0)} 
                    suffix="K€"
                    trend={snapshot.total_overdue > 50000 ? 'down' : undefined}
                />
                <MetricCard 
                    label="Runway" 
                    value={snapshot.runway_weeks.toFixed(1)} 
                    suffix=" sem"
                    trend={snapshot.runway_weeks < 6 ? 'down' : undefined}
                />
                <MetricCard 
                    label="DSO moyen" 
                    value={snapshot.dso_moyen.toFixed(0)} 
                    suffix="j"
                />
            </div>
            
            {/* Risk Distribution */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 mb-2">Répartition des risques</div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm font-medium">{snapshot.risks_critical} critiques</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-sm font-medium">{snapshot.risks_uncertain} incertains</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium">{snapshot.risks_certain} certains</span>
                    </div>
                </div>
            </div>
            
            {snapshot.top_risk_client && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-800">
                            Client à surveiller: <strong>{snapshot.top_risk_client}</strong> ({(snapshot.top_risk_amount! / 1000).toFixed(0)}K€)
                        </span>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

function AnalyzingPhase({ activeEngines = [] }: { activeEngines?: string[] }) {
    const [currentEngine, setCurrentEngine] = useState(0)
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEngine(prev => (prev + 1) % ENGINES.length)
        }, 1500)
        return () => clearInterval(interval)
    }, [])
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-600 animate-pulse" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900">Agent en analyse</h4>
                    <p className="text-xs text-slate-500">6 engines V2 en action...</p>
                </div>
            </div>
            
            {/* Engines Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {ENGINES.map((engine, idx) => {
                    const isActive = idx === currentEngine || activeEngines.includes(engine.id)
                    const isComplete = idx < currentEngine
                    
                    return (
                        <motion.div
                            key={engine.id}
                            animate={{ 
                                scale: isActive ? 1.05 : 1,
                                opacity: isComplete ? 0.6 : 1
                            }}
                            className={`relative p-3 rounded-lg border-2 transition-colors ${
                                isActive 
                                    ? 'bg-blue-50 border-blue-400 shadow-md' 
                                    : isComplete
                                        ? 'bg-emerald-50 border-emerald-300'
                                        : 'bg-slate-50 border-slate-200'
                            }`}
                        >
                            {isComplete && (
                                <div className="absolute -top-1.5 -right-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                                </div>
                            )}
                            
                            <div className={`mb-2 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                                {isActive ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    engine.icon
                                )}
                            </div>
                            <div className={`text-xs font-medium ${
                                isActive ? 'text-blue-700' : 'text-slate-600'
                            }`}>
                                {engine.label}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Analyse en cours...</span>
                    <span>{Math.round(((currentEngine + 1) / ENGINES.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                        animate={{ width: `${((currentEngine + 1) / ENGINES.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
            
            {/* Current Action */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-sm text-blue-800 font-medium">
                        {ENGINES[currentEngine].label}: Traitement en cours...
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

function AfterPhase({ 
    before, 
    after, 
    result 
}: { 
    before: PortfolioSnapshot
    after: PortfolioSnapshot
    result: AnalysisResult
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900">Analyse terminée</h4>
                    <p className="text-xs text-slate-500">Résultats et recommandations</p>
                </div>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-600">{result.risks_detected}</div>
                    <div className="text-xs text-emerald-700">Risques détectés</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.risks_requalified}</div>
                    <div className="text-xs text-blue-700">Requalifiés</div>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{result.actions_generated}</div>
                    <div className="text-xs text-purple-700">Actions P1/P2/P3</div>
                </div>
            </div>
            
            {/* Before/After Comparison */}
            <div className="space-y-2">
                <h5 className="text-sm font-medium text-slate-700">Comparaison avant/après</h5>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">Runway</div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-900">
                                {after.runway_weeks.toFixed(1)} sem
                            </span>
                            <DiffIndicator before={before.runway_weeks} after={after.runway_weeks} suffix=" sem" />
                        </div>
                    </div>
                    
                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">Risques critiques</div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-900">
                                {after.risks_critical}
                            </span>
                            <DiffIndicator before={before.risks_critical} after={after.risks_critical} inverse />
                        </div>
                    </div>
                    
                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">DSO</div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-900">
                                {after.dso_moyen.toFixed(0)}j
                            </span>
                            <DiffIndicator before={before.dso_moyen} after={after.dso_moyen} suffix="j" inverse />
                        </div>
                    </div>
                    
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="text-xs text-emerald-600 mb-1">Montant protégé</div>
                        <div className="text-lg font-bold text-emerald-700">
                            {(result.amount_protected / 1000).toFixed(0)}K€
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Engines Used */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 mb-2">Engines utilisés</div>
                <div className="flex flex-wrap gap-2">
                    {result.engines_used.map(engineId => {
                        const engine = ENGINES.find(e => e.id === engineId)
                        return (
                            <span 
                                key={engineId}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600"
                            >
                                {engine?.icon}
                                {engine?.label || engineId}
                            </span>
                        )
                    })}
                </div>
            </div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function AgentAnalysisTimeline({
    phase,
    beforeSnapshot,
    afterSnapshot,
    analysisResult,
    analyzingEngines = [],
    className = ''
}: AgentAnalysisTimelineProps) {
    // Default demo data
    const defaultBefore: PortfolioSnapshot = {
        total_pending: 1250000,
        total_overdue: 185000,
        runway_weeks: 8.2,
        dso_moyen: 45,
        risks_critical: 2,
        risks_uncertain: 5,
        risks_certain: 11,
        top_risk_client: 'InnovCorp',
        top_risk_amount: 85000
    }
    
    const defaultAfter: PortfolioSnapshot = {
        total_pending: 1250000,
        total_overdue: 185000,
        runway_weeks: 9.5,
        dso_moyen: 42,
        risks_critical: 1,
        risks_uncertain: 4,
        risks_certain: 13
    }
    
    const defaultResult: AnalysisResult = {
        risks_detected: 8,
        risks_requalified: 3,
        actions_generated: 3,
        runway_impact: 1.3,
        amount_protected: 120000,
        engines_used: ['payment_patterns', 'client_scoring', 'early_warning', 'smart_forecast', 'action_optimizer']
    }
    
    const before = beforeSnapshot || defaultBefore
    const after = afterSnapshot || defaultAfter
    const result = analysisResult || defaultResult
    
    return (
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
            {/* Phase Tabs */}
            <div className="flex border-b border-slate-200">
                {[
                    { key: 'before', label: 'Avant', icon: <Eye className="w-4 h-4" /> },
                    { key: 'analyzing', label: 'Analyse', icon: <Brain className="w-4 h-4" /> },
                    { key: 'after', label: 'Après', icon: <Shield className="w-4 h-4" /> }
                ].map((tab, idx) => {
                    const isActive = tab.key === phase
                    const isPast = ['before', 'analyzing', 'after'].indexOf(phase) > idx
                    
                    return (
                        <div 
                            key={tab.key}
                            className="flex-1 flex items-center"
                        >
                            <div className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-colors ${
                                isActive 
                                    ? 'bg-white text-slate-900 font-medium border-b-2 border-emerald-500' 
                                    : isPast
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-slate-50 text-slate-400'
                            }`}>
                                {isPast && !isActive ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    tab.icon
                                )}
                                <span className="text-sm">{tab.label}</span>
                            </div>
                            {idx < 2 && (
                                <ArrowRight className={`w-4 h-4 mx-2 ${
                                    isPast ? 'text-emerald-400' : 'text-slate-300'
                                }`} />
                            )}
                        </div>
                    )
                })}
            </div>
            
            {/* Phase Content */}
            <AnimatePresence mode="wait">
                {phase === 'before' && <BeforePhase key="before" snapshot={before} />}
                {phase === 'analyzing' && <AnalyzingPhase key="analyzing" activeEngines={analyzingEngines} />}
                {phase === 'after' && <AfterPhase key="after" before={before} after={after} result={result} />}
            </AnimatePresence>
        </div>
    )
}

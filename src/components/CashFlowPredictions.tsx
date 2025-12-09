'use client'

import { TrendingUp, TrendingDown, AlertTriangle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { CashFlowPrediction, PredictionAlert } from '@/lib/ai/predictions'
import { FinancialRecord } from '@/lib/dataModel'

interface CashFlowPredictionsProps {
    predictions: CashFlowPrediction[]
    alerts: PredictionAlert[]
    seasonalityDetected?: boolean
    rawData?: FinancialRecord[]
}

export default function CashFlowPredictions({
    predictions,
    alerts,
    seasonalityDetected,
    rawData
}: CashFlowPredictionsProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    if (!predictions || predictions.length === 0) {
        return null
    }

    // Calculer cash flow actuel pour comparaison
    const currentCashFlow = rawData
        ? rawData
            .filter(r => r.type === 'income')
            .reduce((sum, r) => sum + r.amount, 0) -
        rawData
            .filter(r => r.type === 'expense')
            .reduce((sum, r) => sum + Math.abs(r.amount), 0)
        : 0

    return (
        <div className="mb-8 surface rounded-2xl p-8 relative overflow-hidden border-2 border-accent-blue-border/20 bg-gradient-to-br from-accent-blue-subtle/10 to-transparent">
            {/* Badge IA */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-accent-blue to-accent-primary rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Prédictions IA
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <TrendingUp className="w-7 h-7 text-accent-blue" />
                    <div>
                        <h3 className="text-2xl font-bold">Prévisions Cash Flow</h3>
                        <p className="text-sm text-secondary mt-1">
                            Prédictions IA pour les 3 prochains mois
                            {seasonalityDetected && <span className="ml-2 text-accent-primary font-semibold">• Saisonnalité détectée</span>}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-4 py-2 bg-accent-blue-subtle border border-accent-blue-border rounded-lg text-accent-blue font-semibold text-sm hover:bg-accent-blue-border/20 transition-all flex items-center gap-2"
                >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {isExpanded ? 'Réduire' : 'Développer'}
                </button>
            </div>

            {isExpanded && (
                <>
                    {/* Alertes Critiques */}
                    {alerts.length > 0 && (
                        <div className="mb-6 space-y-3">
                            {alerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border-l-4 ${alert.severity === 'critical'
                                        ? 'bg-accent-red-subtle border-accent-red text-accent-red'
                                        : alert.severity === 'warning'
                                            ? 'bg-accent-orange-subtle border-accent-orange text-accent-orange'
                                            : 'bg-accent-blue-subtle border-accent-blue text-accent-blue'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
                                            <p className="text-sm opacity-90 mb-2">{alert.description}</p>
                                            {alert.action && (
                                                <p className="text-xs font-semibold opacity-80 mt-2">
                                                    💡 Action recommandée: {alert.action}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Prédictions par Mois */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {predictions.map((prediction, index) => {
                            const isNegative = prediction.predicted < 0
                            const vsCurrentChange = currentCashFlow !== 0
                                ? ((prediction.predicted - currentCashFlow) / Math.abs(currentCashFlow)) * 100
                                : 0

                            return (
                                <div
                                    key={index}
                                    className={`surface rounded-xl p-5 border-2 transition-all ${isNegative
                                        ? 'border-accent-red-border bg-accent-red-subtle/30'
                                        : 'border-accent-green-border bg-accent-green-subtle/30'
                                        }`}
                                >
                                    {/* Mois */}
                                    <div className="mb-3">
                                        <h4 className="text-sm font-bold text-secondary uppercase tracking-wide">
                                            {prediction.month}
                                        </h4>
                                    </div>

                                    {/* Montant Prédit */}
                                    <div className="mb-3">
                                        <div className={`text-3xl font-bold ${isNegative ? 'text-accent-red' : 'text-accent-green'
                                            }`}>
                                            {isNegative ? '-' : '+'}{Math.abs(prediction.predicted).toLocaleString('fr-FR')} €
                                        </div>
                                        {vsCurrentChange !== 0 && (
                                            <div className="flex items-center gap-1 mt-1">
                                                {vsCurrentChange > 0 ? (
                                                    <TrendingUp className="w-4 h-4 text-accent-green" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-accent-red" />
                                                )}
                                                <span className={`text-sm font-semibold ${vsCurrentChange > 0 ? 'text-accent-green' : 'text-accent-red'
                                                    }`}>
                                                    {vsCurrentChange > 0 ? '+' : ''}{vsCurrentChange.toFixed(0)}% vs actuel
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Breakdown */}
                                    {prediction.breakdown && (
                                        <div className="text-xs text-secondary space-y-1 mb-3">
                                            <div className="flex justify-between">
                                                <span>Revenus prévus:</span>
                                                <span className="font-semibold text-accent-green">
                                                    +{prediction.breakdown.expectedRevenue.toLocaleString('fr-FR')} €
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Charges prévues:</span>
                                                <span className="font-semibold text-accent-red">
                                                    -{prediction.breakdown.expectedExpenses.toLocaleString('fr-FR')} €
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Confiance */}
                                    <div className="pt-3 border-t border-border-subtle">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-secondary">Confiance</span>
                                            <span className="text-xs font-bold text-accent-primary">
                                                {prediction.confidence}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-accent-blue to-accent-primary rounded-full transition-all"
                                                style={{ width: `${prediction.confidence}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Scenario Tag */}
                                    <div className="mt-3">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${prediction.scenario === 'optimistic'
                                            ? 'bg-accent-green-subtle text-accent-green'
                                            : prediction.scenario === 'pessimistic'
                                                ? 'bg-accent-red-subtle text-accent-red'
                                                : 'bg-accent-blue-subtle text-accent-blue'
                                            }`}>
                                            {prediction.scenario === 'optimistic' && '📈 Optimiste'}
                                            {prediction.scenario === 'realistic' && '📊 Réaliste'}
                                            {prediction.scenario === 'pessimistic' && '📉 Pessimiste'}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-6 p-4 bg-surface-elevated rounded-lg border border-border-subtle">
                        <p className="text-xs text-secondary leading-relaxed">
                            <span className="font-semibold text-primary">💡 Comment utiliser ces prédictions :</span>{' '}
                            Les prédictions sont basées sur l'analyse de votre historique avec détection de saisonnalité et tendances.
                            Utilisez les sliders <strong>What-If Simulation</strong> ci-dessous pour tester différents scénarios d'optimisation.
                            {seasonalityDetected && (
                                <span className="block mt-2 text-accent-primary font-semibold">
                                    ✨ Pattern saisonnier détecté : l'IA a pris en compte les variations récurrentes de votre activité.
                                </span>
                            )}
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}

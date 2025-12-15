/**
 * SAAS METRICS SECTION
 *
 * Affiche les métriques SaaS spécifiques dans le dashboard
 * Visible uniquement pour les entreprises du secteur SaaS
 */

'use client'

import { TrendingUp, TrendingDown, Users, DollarSign, Target, Zap, AlertTriangle, Clock } from 'lucide-react'
import { SaaSMetrics, evaluateSaaSMetricHealth, formatSaaSMetric } from '@/lib/saasMetrics'

interface SaaSMetricsSectionProps {
    metrics: SaaSMetrics;
}

export default function SaaSMetricsSection({ metrics }: SaaSMetricsSectionProps) {

    const churnHealth = evaluateSaaSMetricHealth('churnRate', metrics.churnRate);
    const ltvCacHealth = evaluateSaaSMetricHealth('ltvCacRatio', metrics.ltvCacRatio);
    const runwayHealth = evaluateSaaSMetricHealth('runway', metrics.runway);
    const quickRatioHealth = evaluateSaaSMetricHealth('quickRatio', metrics.quickRatio);

    return (
        <div className="mb-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-primary">Métriques SaaS</h2>
                    <p className="text-sm text-tertiary">Indicateurs clés pour startups SaaS</p>
                </div>
            </div>

            {/* Grid de KPIs SaaS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* MRR - Monthly Recurring Revenue */}
                <div className="surface rounded-xl p-6 border border-border-subtle surface-hover">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary">MRR</span>
                        <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatSaaSMetric('mrr', metrics.mrr)}
                    </div>
                    <div className="flex items-center gap-2">
                        {metrics.mrrGrowth > 0 ? (
                            <>
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600">
                                    +{metrics.mrrGrowth}%
                                </span>
                            </>
                        ) : (
                            <>
                                <TrendingDown className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-600">
                                    {metrics.mrrGrowth}%
                                </span>
                            </>
                        )}
                        <span className="text-xs text-tertiary">vs mois précédent</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                        <div className="text-xs text-secondary">
                            <strong>ARR:</strong> {formatSaaSMetric('arr', metrics.arr)}
                        </div>
                    </div>
                </div>

                {/* Churn Rate */}
                <div className="surface rounded-xl p-6 border border-border-subtle surface-hover">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary">Churn Rate</span>
                        <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatSaaSMetric('churnRate', metrics.churnRate)}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${churnHealth.color}`}>
                            {churnHealth.label}
                        </span>
                        {churnHealth.severity === 'excellent' && <span className="text-xs">🎯</span>}
                        {churnHealth.severity === 'good' && <span className="text-xs">✅</span>}
                        {churnHealth.severity === 'warning' && <span className="text-xs">⚠️</span>}
                        {churnHealth.severity === 'critical' && <span className="text-xs">🚨</span>}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                        <div className="text-xs text-secondary">
                            <strong>Clients actifs:</strong> {metrics.customers}
                        </div>
                    </div>
                </div>

                {/* CAC - Customer Acquisition Cost */}
                <div className="surface rounded-xl p-6 border border-border-subtle surface-hover">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary">CAC</span>
                        <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatSaaSMetric('cac', metrics.cac)}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-secondary">
                            Coût d'acquisition
                        </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                        <div className="text-xs text-secondary">
                            <strong>ARPU:</strong> {formatSaaSMetric('arpu', metrics.arpu)}
                        </div>
                    </div>
                </div>

                {/* LTV/CAC Ratio */}
                <div className="surface rounded-xl p-6 border border-border-subtle surface-hover">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary">LTV/CAC</span>
                        <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatSaaSMetric('ltvCacRatio', metrics.ltvCacRatio)}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${ltvCacHealth.color}`}>
                            {ltvCacHealth.label}
                        </span>
                        {ltvCacHealth.severity === 'excellent' && <span className="text-xs">🚀</span>}
                        {ltvCacHealth.severity === 'good' && <span className="text-xs">✅</span>}
                        {ltvCacHealth.severity === 'warning' && <span className="text-xs">⚠️</span>}
                        {ltvCacHealth.severity === 'critical' && <span className="text-xs">🚨</span>}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                        <div className="text-xs text-secondary">
                            <strong>LTV:</strong> {formatSaaSMetric('ltv', metrics.ltv)}
                        </div>
                    </div>
                </div>

                {/* Burn Rate */}
                <div className="surface rounded-xl p-6 border border-border-subtle surface-hover">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary">Burn Rate</span>
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatSaaSMetric('burnRate', Math.abs(metrics.burnRate))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-red-600 font-medium">
                            Par mois
                        </span>
                        {metrics.burnRate < 0 && <span className="text-xs">🔥</span>}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                        <div className="text-xs text-tertiary">
                            Trésorerie brûlée mensuellement
                        </div>
                    </div>
                </div>

                {/* Runway */}
                <div className="surface rounded-xl p-6 border border-border-subtle surface-hover">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary">Runway</span>
                        <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatSaaSMetric('runway', metrics.runway)}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${runwayHealth.color}`}>
                            {runwayHealth.label}
                        </span>
                        {runwayHealth.severity === 'excellent' && <span className="text-xs">✅</span>}
                        {runwayHealth.severity === 'good' && <span className="text-xs">👍</span>}
                        {runwayHealth.severity === 'warning' && <span className="text-xs">⚠️</span>}
                        {runwayHealth.severity === 'critical' && <span className="text-xs">🚨</span>}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                        <div className="text-xs text-tertiary">
                            Avant épuisement trésorerie
                        </div>
                    </div>
                </div>

                {/* Quick Ratio */}
                <div className="surface rounded-xl p-6 border border-border-subtle surface-hover">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary">Quick Ratio</span>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatSaaSMetric('quickRatio', metrics.quickRatio)}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${quickRatioHealth.color}`}>
                            {quickRatioHealth.label}
                        </span>
                        {quickRatioHealth.severity === 'excellent' && <span className="text-xs">🚀</span>}
                        {quickRatioHealth.severity === 'good' && <span className="text-xs">✅</span>}
                        {quickRatioHealth.severity === 'warning' && <span className="text-xs">⚠️</span>}
                        {quickRatioHealth.severity === 'critical' && <span className="text-xs">🚨</span>}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                        <div className="text-xs text-tertiary">
                            Croissance vs Attrition
                        </div>
                    </div>
                </div>

                {/* Customers */}
                <div className="surface rounded-xl p-6 border border-border-subtle surface-hover">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary">Clients Actifs</span>
                        <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {metrics.customers}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-secondary">
                            Base clients
                        </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                        <div className="text-xs text-secondary">
                            <strong>ARPU:</strong> {formatSaaSMetric('arpu', metrics.arpu)}/mois
                        </div>
                    </div>
                </div>

            </div>

            {/* Info note */}
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-700">i</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-purple-900">
                            <strong>Métriques SaaS calculées</strong> depuis vos données financières.
                            Confiance: {Math.round(metrics.confidence * 100)}% • Méthode: {metrics.method}
                        </p>
                        <p className="text-xs text-purple-700 mt-1">
                            Pour des calculs plus précis, ajoutez les données de vos abonnements (nouveaux clients, churned customers, etc.)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

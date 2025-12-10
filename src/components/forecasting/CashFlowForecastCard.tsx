'use client'

import { useState } from 'react';
import { CashFlowForecast } from '@/lib/forecasting/types';
import { ForecastChart } from './ForecastChart';
import {
    ChartBarIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';

interface CashFlowForecastCardProps {
    forecast: CashFlowForecast;
}

/**
 * Card principale Prévisions Cash Flow
 * Format: Large (~400px) avec graphique + insights + recommandations
 */
export default function CashFlowForecastCard({ forecast }: CashFlowForecastCardProps) {
    const [showAllInsights, setShowAllInsights] = useState(false);

    const { metrics, insights, historical, baseline, optimistic, pessimistic, horizon } = forecast;

    // Couleurs selon niveau de risque
    const getRiskColor = (level: typeof metrics.riskLevel) => {
        switch (level) {
            case 'safe':
                return {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-200 dark:border-green-800',
                    text: 'text-green-800 dark:text-green-200',
                    badge: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                };
            case 'warning':
                return {
                    bg: 'bg-orange-50 dark:bg-orange-900/20',
                    border: 'border-orange-200 dark:border-orange-800',
                    text: 'text-orange-800 dark:text-orange-200',
                    badge: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                };
            case 'critical':
                return {
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    border: 'border-red-200 dark:border-red-800',
                    text: 'text-red-800 dark:text-red-200',
                    badge: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                };
        }
    };

    const getTrendIcon = (trend: typeof metrics.trend) => {
        switch (trend) {
            case 'improving':
                return '📈';
            case 'declining':
                return '📉';
            case 'stable':
                return '➡️';
        }
    };

    const getTrendLabel = (trend: typeof metrics.trend) => {
        switch (trend) {
            case 'improving':
                return 'En amélioration';
            case 'declining':
                return 'En dégradation';
            case 'stable':
                return 'Stable';
        }
    };

    const colors = getRiskColor(metrics.riskLevel);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className={`p-6 ${colors.bg} border-b-2 ${colors.border}`}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <ChartBarIcon className="w-7 h-7 text-accent-primary dark:text-blue-400" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                📈 Prévisions Trésorerie
                            </h2>
                            <InfoTooltip />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Projection {horizon} mois • Confiance: {Math.round(metrics.confidence * 100)}% • 3 scénarios
                        </p>
                    </div>

                    {/* Badge Runway */}
                    <div className="flex flex-col items-end gap-2">
                        <div className={`px-4 py-2 rounded-lg ${colors.badge}`}>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="w-5 h-5" />
                                <div>
                                    <div className="text-xs font-medium opacity-80">Runway</div>
                                    <div className="text-lg font-bold">
                                        {metrics.runway >= 12 ? '12+' : metrics.runway} mois
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span>{getTrendIcon(metrics.trend)}</span>
                            <span className={colors.text}>{getTrendLabel(metrics.trend)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Graphique */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
                <ForecastChart
                    historical={historical}
                    baseline={baseline}
                    optimistic={optimistic}
                    pessimistic={pessimistic}
                />
            </div>

            {/* Métriques clés */}
            <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-100 dark:border-gray-700">
                <MetricCard
                    icon="📊"
                    label="Scénario Baseline"
                    value={`${baseline[baseline.length - 1]?.value.toLocaleString('fr-FR')} €`}
                    sublabel={`Dans ${horizon} mois`}
                />
                <MetricCard
                    icon="🎯"
                    label="Scénario Optimiste"
                    value={`${optimistic[optimistic.length - 1]?.value.toLocaleString('fr-FR')} €`}
                    sublabel="+15% croissance"
                    positive
                />
                <MetricCard
                    icon="⚠️"
                    label="Scénario Pessimiste"
                    value={`${pessimistic[pessimistic.length - 1]?.value.toLocaleString('fr-FR')} €`}
                    sublabel="-20% récession"
                    warning={pessimistic[pessimistic.length - 1]?.value < 0}
                />
            </div>

            {/* Insights (toujours visibles) */}
            <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    💡 Insights Clés
                </h3>
                <div className="space-y-3">
                    {insights.slice(0, showAllInsights ? undefined : 2).map((insight, idx) => (
                        <InsightItem key={idx} insight={insight} />
                    ))}
                </div>

                {insights.length > 2 && (
                    <button
                        onClick={() => setShowAllInsights(!showAllInsights)}
                        className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-accent-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                        {showAllInsights ? (
                            <>
                                <ChevronUpIcon className="w-4 h-4" />
                                Masquer
                            </>
                        ) : (
                            <>
                                <ChevronDownIcon className="w-4 h-4" />
                                Voir {insights.length - 2} insight(s) supplémentaire(s)
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Footer info */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Prévisions basées sur {forecast.minDataMonths} mois d'historique • Générées le{' '}
                    {forecast.generatedAt.toLocaleDateString('fr-FR')} à{' '}
                    {forecast.generatedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
}

/**
 * Composant Métrique
 */
function MetricCard({
    icon,
    label,
    value,
    sublabel,
    positive,
    warning
}: {
    icon: string;
    label: string;
    value: string;
    sublabel: string;
    positive?: boolean;
    warning?: boolean;
}) {
    return (
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
            </div>
            <div className={`text-lg font-bold ${warning ? 'text-red-600 dark:text-red-400' : positive ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sublabel}</div>
        </div>
    );
}

/**
 * Composant Insight
 */
function InsightItem({ insight }: { insight: CashFlowForecast['insights'][0] }) {
    const getIcon = () => {
        switch (insight.type) {
            case 'positive':
                return <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'warning':
                return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
            case 'critical':
                return <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />;
        }
    };

    const getBgColor = () => {
        switch (insight.type) {
            case 'positive':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'warning':
                return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
            case 'critical':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        }
    };

    return (
        <div className={`p-4 rounded-lg border ${getBgColor()}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                        {insight.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {insight.description}
                    </p>
                    {insight.recommendation && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                <span className="font-semibold text-accent-primary dark:text-blue-400">💡 Action:</span>
                                <span>{insight.recommendation}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Tooltip explicatif
 */
function InfoTooltip() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
                <InformationCircleIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute z-10 left-0 top-8 w-96 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                    <p className="mb-2 font-semibold">📈 Prévisions Cash Flow</p>
                    <p className="text-gray-300 mb-3">
                        Projection 6 mois de votre trésorerie basée sur l'historique et la tendance actuelle.
                    </p>
                    <div className="space-y-2 text-gray-300">
                        <p><strong className="text-blue-400">• Baseline:</strong> Tendance naturelle (régression linéaire + saisonnalité)</p>
                        <p><strong className="text-green-400">• Optimiste:</strong> Croissance +15% (scenario favorable)</p>
                        <p><strong className="text-orange-400">• Pessimiste:</strong> Récession -20% (scenario stress test)</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-gray-400 text-xs">
                            <strong>Runway</strong> = Nombre de mois avant rupture trésorerie (calculé sur scénario pessimiste)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

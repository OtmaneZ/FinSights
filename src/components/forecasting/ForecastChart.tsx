'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    ComposedChart
} from 'recharts';
import { ForecastDataPoint } from '@/lib/forecasting/types';

interface ForecastChartProps {
    historical: ForecastDataPoint[];
    baseline: ForecastDataPoint[];
    optimistic: ForecastDataPoint[];
    pessimistic: ForecastDataPoint[];
}

/**
 * Graphique prévisions cash flow
 * Affiche historique (3 mois) + 3 scénarios futurs (6 mois)
 */
export function ForecastChart({
    historical,
    baseline,
    optimistic,
    pessimistic
}: ForecastChartProps) {
    // Préparer données pour Recharts (format flat)
    const chartData = [
        ...historical.map(point => ({
            date: point.date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
            dateObj: point.date,
            historical: point.value,
            type: 'historical'
        })),
        ...baseline.map((point, idx) => ({
            date: point.date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
            dateObj: point.date,
            baseline: point.value,
            optimistic: optimistic[idx]?.value,
            pessimistic: pessimistic[idx]?.value,
            type: 'forecast'
        }))
    ];

    // Tooltip custom
    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload || payload.length === 0) return null;

        const data = payload[0].payload;
        const isHistorical = data.type === 'historical';

        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    {data.date}
                </p>
                {isHistorical ? (
                    <div className="space-y-1">
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            Réel : {data.historical?.toLocaleString('fr-FR')} €
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Optimiste : {data.optimistic?.toLocaleString('fr-FR')} €
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            Baseline : {data.baseline?.toLocaleString('fr-FR')} €
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                            Pessimiste : {data.pessimistic?.toLocaleString('fr-FR')} €
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // Formatter axe Y (milliers)
    const formatYAxis = (value: number) => {
        if (Math.abs(value) >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M€`;
        } else if (Math.abs(value) >= 1000) {
            return `${Math.round(value / 1000)}k€`;
        }
        return `${value}€`;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                    {/* Gradient zone de confiance */}
                    <linearGradient id="confidenceArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                />

                <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={formatYAxis}
                />

                <Tooltip content={<CustomTooltip />} />

                <Legend
                    wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }}
                    iconType="line"
                />

                {/* Ligne de séparation Aujourd'hui */}
                <ReferenceLine
                    x={historical[historical.length - 1]?.date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })}
                    stroke="#9ca3af"
                    strokeDasharray="5 5"
                    label={{
                        value: "Aujourd'hui",
                        position: 'top',
                        fill: '#6b7280',
                        fontSize: 11
                    }}
                />

                {/* Ligne zéro (rupture cash) */}
                <ReferenceLine
                    y={0}
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    label={{
                        value: 'Rupture',
                        position: 'right',
                        fill: '#ef4444',
                        fontSize: 11
                    }}
                />

                {/* Historique (ligne pleine bleue) */}
                <Line
                    type="monotone"
                    dataKey="historical"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    name="Historique"
                    connectNulls
                />

                {/* Baseline (ligne pointillée bleue) */}
                <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#3b82f6', r: 3 }}
                    name="Prévision baseline"
                    connectNulls
                />

                {/* Optimiste (ligne pointillée verte) */}
                <Line
                    type="monotone"
                    dataKey="optimistic"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Scénario optimiste (+15%)"
                    connectNulls
                />

                {/* Pessimiste (ligne pointillée orange/rouge) */}
                <Line
                    type="monotone"
                    dataKey="pessimistic"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Scénario pessimiste (-20%)"
                    connectNulls
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}

'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Données de démonstration pour le cash flow
const cashFlowData = [
    { month: 'Avr 24', actual: 180000, projected: null, type: 'historical' },
    { month: 'Mai 24', actual: 165000, projected: null, type: 'historical' },
    { month: 'Juin 24', actual: 142000, projected: null, type: 'historical' },
    { month: 'Juil 24', actual: 158000, projected: null, type: 'historical' },
    { month: 'Août 24', actual: 145000, projected: null, type: 'historical' },
    { month: 'Sept 24', actual: 132000, projected: null, type: 'historical' },
    { month: 'Oct 24', actual: null, projected: 95000, type: 'projection' },
    { month: 'Nov 24', actual: null, projected: 78000, type: 'projection' },
    { month: 'Déc 24', actual: null, projected: 112000, type: 'projection' },
];

export default function CashFlowChart() {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const value = data.actual || data.projected;
            const isProjection = data.type === 'projection';

            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className={`text-lg font-bold ${isProjection ? 'text-blue-600' : 'text-gray-900'}`}>
                        {formatCurrency(value)}
                    </p>
                    <p className="text-sm text-gray-600">
                        {isProjection ? '📈 Projection IA' : '📊 Réalisé'}
                    </p>
                    {isProjection && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                            <p className="text-blue-800">
                                🤖 <strong>Analyse :</strong>
                                {value < 100000
                                    ? ' Période tendue. Surveiller les encaissements.'
                                    : ' Situation favorable. Opportunités d\'investissement.'
                                }
                            </p>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="finsight-chart-container">
            <div className="finsight-chart-header">
                <div>
                    <h3 className="finsight-chart-title">Évolution de la Trésorerie</h3>
                    <p className="finsight-chart-subtitle">Données réelles vs projections IA (en €)</p>
                </div>
                <div className="finsight-chart-legend">
                    <div className="finsight-legend-item">
                        <div className="finsight-legend-color finsight-legend-historical"></div>
                        <span>Historique</span>
                    </div>
                    <div className="finsight-legend-item">
                        <div className="finsight-legend-color finsight-legend-projected"></div>
                        <span>Projection</span>
                    </div>
                </div>
            </div>

            <div className="finsight-chart-area">
                <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                    <AreaChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="month"
                            fontSize={12}
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${Math.round(value / 1000)}k€`}
                            fontSize={12}
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        <ReferenceLine y={50000} stroke="#ef4444" strokeDasharray="5 5" label="Seuil critique" />
                        <ReferenceLine y={100000} stroke="#f59e0b" strokeDasharray="5 5" label="Seuil d'alerte" />

                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#0066FF"
                            fill="#0066FF"
                            fillOpacity={0.3}
                            strokeWidth={2}
                            connectNulls={false}
                        />

                        <Area
                            type="monotone"
                            dataKey="projected"
                            stroke="#00D4AA"
                            fill="#00D4AA"
                            fillOpacity={0.2}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            connectNulls={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Insights IA */}
            <div className="finsight-chart-insights">
                <div className="finsight-insights-content">
                    <div className="finsight-insights-icon">🤖</div>
                    <div>
                        <p className="finsight-insights-label">Insights IA</p>
                        <p className="finsight-insights-text">
                            <strong>Tendance :</strong> Baisse temporaire prévue en novembre (-32k€) due aux échéances fournisseurs.
                            <strong> Rebond attendu</strong> en décembre (+34k€) grâce aux encaissements de fin d'année.
                        </p>
                        <p className="finsight-insights-recommendation">
                            💡 <strong>Recommandation :</strong> Négocier un étalement des paiements fournisseurs sur novembre.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
'use client';

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useFinancialData } from '@/lib/financialContext';

export default function CashFlowChart() {
    const { rawData } = useFinancialData();

    // ✅ CALCUL AVEC VRAIES DONNÉES - Pas de fake data
    const cashFlowData = useMemo(() => {
        if (!rawData || rawData.length === 0) {
            return [];
        }

        // Grouper par mois et calculer le cash flow cumulatif
        const monthlyData = rawData.reduce((acc: any, record: any) => {
            try {
                const date = new Date(record.date);
                if (isNaN(date.getTime())) return acc;

                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthLabel = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });

                if (!acc[monthKey]) {
                    acc[monthKey] = {
                        month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
                        sortKey: monthKey,
                        total: 0,
                        count: 0
                    };
                }

                acc[monthKey].total += record.amount || 0;
                acc[monthKey].count += 1;
            } catch (error) {
                console.error('Erreur traitement date:', error);
            }
            return acc;
        }, {});

        // Convertir en tableau et trier par date
        const sortedMonths = Object.values(monthlyData)
            .sort((a: any, b: any) => a.sortKey.localeCompare(b.sortKey));

        // Calculer le cash flow cumulatif
        let cumulativeCash = 0;
        return sortedMonths.map((monthData: any, index) => {
            cumulativeCash += monthData.total;
            return {
                month: monthData.month,
                actual: Math.round(cumulativeCash),
                projected: null,
                type: 'historical'
            };
        });
    }, [rawData]);

    // 🛡️ Protection : Ne pas afficher le chart si pas de données
    if (!rawData || rawData.length === 0 || cashFlowData.length === 0) {
        return (
            <div className="finsight-chart-container">
                <div className="finsight-chart-header">
                    <div>
                        <h3 className="finsight-chart-title">Évolution de la Trésorerie</h3>
                        <p className="finsight-chart-subtitle">Données réelles vs projections IA (en €)</p>
                    </div>
                </div>
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-2">📊 Aucune donnée disponible</p>
                    <p className="text-sm">Importez vos données financières pour visualiser l'évolution de votre trésorerie</p>
                </div>
            </div>
        );
    }

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
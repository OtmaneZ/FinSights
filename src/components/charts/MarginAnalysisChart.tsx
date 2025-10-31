'use client';

import React, { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
    ComposedChart
} from 'recharts';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useFinancialData } from '@/lib/financialContext';

interface MarginData {
    period: string;
    revenue: number;
    cogs: number; // Cost of Goods Sold
    grossMargin: number;
    grossMarginPercent: number;
    segments: {
        software: { revenue: number; margin: number; marginPercent: number };
        consulting: { revenue: number; margin: number; marginPercent: number };
        support: { revenue: number; margin: number; marginPercent: number };
    };
}

interface SegmentDetail {
    name: string;
    revenue: number;
    margin: number;
    marginPercent: number;
    trend: 'up' | 'down' | 'stable';
    color: string;
}

export default function MarginAnalysisChart() {
    const { rawData } = useFinancialData();
    const [selectedView, setSelectedView] = useState<'overview' | 'segments' | 'trends'>('overview');
    const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

    // ✅ CALCUL AVEC VRAIES DONNÉES - Analyse des marges
    const marginData: MarginData[] = useMemo(() => {
        if (!rawData || rawData.length === 0) {
            return [];
        }

        // Grouper par mois/trimestre et calculer les marges
        const periodMap = rawData.reduce((acc: any, record: any) => {
            try {
                const date = new Date(record.date);
                if (isNaN(date.getTime())) return acc;

                // Grouper par mois
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthLabel = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });

                if (!acc[monthKey]) {
                    acc[monthKey] = {
                        period: monthLabel,
                        sortKey: monthKey,
                        revenue: 0,
                        cogs: 0,
                        transactions: []
                    };
                }

                const amount = record.amount || 0;

                // Classifier : revenu (positif) vs coûts (négatif)
                if (amount > 0) {
                    acc[monthKey].revenue += amount;
                } else {
                    acc[monthKey].cogs += Math.abs(amount);
                }

                acc[monthKey].transactions.push(record);
            } catch (error) {
                console.error('Erreur traitement marge:', error);
            }
            return acc;
        }, {});

        // Convertir en format MarginData
        return Object.values(periodMap)
            .sort((a: any, b: any) => a.sortKey.localeCompare(b.sortKey))
            .map((period: any) => {
                const grossMargin = period.revenue - period.cogs;
                const grossMarginPercent = period.revenue > 0
                    ? (grossMargin / period.revenue) * 100
                    : 0;

                return {
                    period: period.period,
                    revenue: Math.round(period.revenue),
                    cogs: Math.round(period.cogs),
                    grossMargin: Math.round(grossMargin),
                    grossMarginPercent: Math.round(grossMarginPercent * 10) / 10,
                    segments: {
                        software: { revenue: 0, margin: 0, marginPercent: 0 },
                        consulting: { revenue: 0, margin: 0, marginPercent: 0 },
                        support: { revenue: 0, margin: 0, marginPercent: 0 }
                    }
                };
            });
    }, [rawData]);

    // 🛡️ Protection : Ne pas afficher si pas de données
    if (!rawData || rawData.length === 0 || marginData.length === 0) {
        return (
            <div className="finsight-chart-container">
                <div className="finsight-chart-header">
                    <h3 className="finsight-chart-title">Analyse des Marges</h3>
                    <p className="finsight-chart-subtitle">Rentabilité par période • Évolution</p>
                </div>
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-2">📊 Aucune donnée de marge disponible</p>
                    <p className="text-sm">Importez vos données pour analyser la rentabilité</p>
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

    const formatPercent = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    // Préparer les données pour les graphiques
    const overviewData = marginData.map(item => ({
        period: item.period,
        revenue: item.revenue,
        cogs: item.cogs,
        grossMargin: item.grossMargin,
        marginPercent: item.grossMarginPercent
    }));

    const segmentData = marginData.map(item => ({
        period: item.period,
        software: item.segments.software.margin,
        consulting: item.segments.consulting.margin,
        support: item.segments.support.margin,
        softwarePercent: item.segments.software.marginPercent,
        consultingPercent: item.segments.consulting.marginPercent,
        supportPercent: item.segments.support.marginPercent
    }));

    const getSegmentInsights = (): SegmentDetail[] => {
        const latest = marginData[marginData.length - 1];
        const previous = marginData[marginData.length - 2];

        return [
            {
                name: 'Software',
                revenue: latest.segments.software.revenue,
                margin: latest.segments.software.margin,
                marginPercent: latest.segments.software.marginPercent,
                trend: latest.segments.software.marginPercent > previous.segments.software.marginPercent ? 'up' : 'down',
                color: '#3b82f6'
            },
            {
                name: 'Consulting',
                revenue: latest.segments.consulting.revenue,
                margin: latest.segments.consulting.margin,
                marginPercent: latest.segments.consulting.marginPercent,
                trend: latest.segments.consulting.marginPercent > previous.segments.consulting.marginPercent ? 'up' : 'down',
                color: '#10b981'
            },
            {
                name: 'Support',
                revenue: latest.segments.support.revenue,
                margin: latest.segments.support.margin,
                marginPercent: latest.segments.support.marginPercent,
                trend: latest.segments.support.marginPercent > previous.segments.support.marginPercent ? 'up' : 'down',
                color: '#f59e0b'
            }
        ];
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            if (selectedView === 'overview') {
                return (
                    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800">{label}</p>
                        <p className="text-blue-600">CA: {formatCurrency(payload[0]?.payload?.revenue || 0)}</p>
                        <p className="text-red-600">Coûts: {formatCurrency(payload[0]?.payload?.cogs || 0)}</p>
                        <p className="text-green-600">Marge: {formatCurrency(payload[0]?.payload?.grossMargin || 0)}</p>
                        <p className="text-gray-600">Taux: {formatPercent(payload[0]?.payload?.marginPercent || 0)}</p>
                    </div>
                );
            } else {
                return (
                    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800">{label}</p>
                        {payload.map((entry: any, index: number) => (
                            <p key={index} style={{ color: entry.color }}>
                                {entry.name}: {formatCurrency(entry.value)}
                            </p>
                        ))}
                    </div>
                );
            }
        }
        return null;
    };

    const getMarginInsights = () => {
        const latest = marginData[marginData.length - 1];
        const previous = marginData[marginData.length - 2];
        const marginTrend = latest.grossMarginPercent - previous.grossMarginPercent;

        return {
            trend: marginTrend > 0 ? 'up' : 'down',
            change: Math.abs(marginTrend),
            bestSegment: getSegmentInsights().reduce((best, current) =>
                current.marginPercent > best.marginPercent ? current : best
            ),
            worstSegment: getSegmentInsights().reduce((worst, current) =>
                current.marginPercent < worst.marginPercent ? current : worst
            )
        };
    };

    const insights = getMarginInsights();

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Analyse des Marges</h3>
                    <p className="text-sm text-gray-600">Évolution par segment et période</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setSelectedView('overview')}
                        className={`px-3 py-1 text-sm rounded ${selectedView === 'overview'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Vue Globale
                    </button>
                    <button
                        onClick={() => setSelectedView('segments')}
                        className={`px-3 py-1 text-sm rounded ${selectedView === 'segments'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Par Segment
                    </button>
                    <button
                        onClick={() => setSelectedView('trends')}
                        className={`px-3 py-1 text-sm rounded ${selectedView === 'trends'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Tendances
                    </button>
                </div>
            </div>

            <div className="h-80 min-h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                    {selectedView === 'overview' ? (
                        <ComposedChart data={overviewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" fontSize={12} />
                            <YAxis yAxisId="left" tickFormatter={(value) => `${Math.round(value / 1000)}k€`} fontSize={12} />
                            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Chiffre d'Affaires" />
                            <Bar yAxisId="left" dataKey="cogs" fill="#ef4444" name="Coûts" />
                            <Line yAxisId="right" type="monotone" dataKey="marginPercent" stroke="#10b981" strokeWidth={3} name="Marge %" />
                        </ComposedChart>
                    ) : selectedView === 'segments' ? (
                        <BarChart data={segmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" fontSize={12} />
                            <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k€`} fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="software" stackId="a" fill="#3b82f6" name="Software" />
                            <Bar dataKey="consulting" stackId="a" fill="#10b981" name="Consulting" />
                            <Bar dataKey="support" stackId="a" fill="#f59e0b" name="Support" />
                        </BarChart>
                    ) : (
                        <LineChart data={segmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" fontSize={12} />
                            <YAxis tickFormatter={(value) => `${value}%`} fontSize={12} />
                            <Tooltip
                                formatter={(value: any, name: string) => [formatPercent(value), name]}
                                labelFormatter={(label) => `Période: ${label}`}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="softwarePercent" stroke="#3b82f6" strokeWidth={2} name="Software %" />
                            <Line type="monotone" dataKey="consultingPercent" stroke="#10b981" strokeWidth={2} name="Consulting %" />
                            <Line type="monotone" dataKey="supportPercent" stroke="#f59e0b" strokeWidth={2} name="Support %" />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Insights par segment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {getSegmentInsights().map((segment, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">{segment.name}</h4>
                            <div className="flex items-center">
                                {segment.trend === 'up' ? (
                                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                                )}
                            </div>
                        </div>
                        <p className="text-lg font-bold" style={{ color: segment.color }}>
                            {formatPercent(segment.marginPercent)}
                        </p>
                        <p className="text-sm text-gray-600">
                            Marge: {formatCurrency(segment.margin)}
                        </p>
                        <p className="text-xs text-gray-500">
                            CA: {formatCurrency(segment.revenue)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Insights IA */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-3">
                    <div className="text-purple-600 text-lg">🤖</div>
                    <div>
                        <p className="text-sm font-semibold text-purple-900 mb-1">Analyse IA des Marges</p>
                        <p className="text-sm text-purple-800">
                            <strong>Tendance globale :</strong> Marge {insights.trend === 'up' ? 'en hausse' : 'en baisse'}
                            de {formatPercent(insights.change)} ce trimestre.
                            <strong> Segment star :</strong> {insights.bestSegment.name} ({formatPercent(insights.bestSegment.marginPercent)}).
                            <strong> Point d'attention :</strong> {insights.worstSegment.name} nécessite optimisation ({formatPercent(insights.worstSegment.marginPercent)}).
                        </p>
                        <p className="text-xs text-purple-700 mt-2">
                            💡 <strong>Recommandation :</strong> Investir davantage dans {insights.bestSegment.name}
                            et réviser la stratégie pricing de {insights.worstSegment.name}.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
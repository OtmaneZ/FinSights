/**
 * Optimized KPI Calculations Hook
 *
 * Uses useMemo to cache heavy computations
 * Only recalculates when data changes
 */

'use client';

import { useMemo } from 'react';
import { perfLogger } from '@/lib/logger';

interface Transaction {
    date: string;
    montant: number;
    type?: string;
    client?: string;
    [key: string]: any;
}

interface KPI {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    description: string;
}

export function useOptimizedKPIs(rawData: Transaction[] | null) {
    const kpis = useMemo<KPI[]>(() => {
        if (!rawData || rawData.length === 0) {
            return [];
        }

        perfLogger.time('KPI calculations');

        try {
            // Revenue calculation
            const revenue = rawData
                .filter((t) => t.montant > 0)
                .reduce((sum, t) => sum + t.montant, 0);

            // Expenses calculation
            const expenses = rawData
                .filter((t) => t.montant < 0)
                .reduce((sum, t) => sum + Math.abs(t.montant), 0);

            // Margin calculation
            const margin = revenue - expenses;
            const marginPercent = revenue > 0 ? ((margin / revenue) * 100).toFixed(1) : '0.0';

            // Cash Flow Net
            const cashFlow = margin;

            // DSO calculation (Days Sales Outstanding)
            const averageDailySales = revenue / 90; // Assume 90 days
            const receivables = rawData
                .filter((t) => t.type === 'créance' || (t.montant > 0 && !t.type))
                .reduce((sum, t) => sum + t.montant, 0);
            const dso = averageDailySales > 0 ? Math.round(receivables / averageDailySales) : 0;

            perfLogger.timeEnd('KPI calculations');

            return [
                {
                    title: 'Revenus & Croissance',
                    value: `${revenue.toLocaleString('fr-FR')} €`,
                    change: '+12.5%',
                    changeType: 'positive',
                    description: 'vs mois dernier',
                },
                {
                    title: 'Marge Brute & Rentabilité',
                    value: `${marginPercent}%`,
                    change: '+2.3%',
                    changeType: 'positive',
                    description: 'Marge nette',
                },
                {
                    title: 'Cash & Liquidité',
                    value: `${cashFlow.toLocaleString('fr-FR')} €`,
                    change: cashFlow >= 0 ? 'Positif' : 'Négatif',
                    changeType: cashFlow >= 0 ? 'positive' : 'negative',
                    description: 'Flux de trésorerie',
                },
                {
                    title: 'DSO & Cycles Paiement',
                    value: `${dso}j`,
                    change: dso > 45 ? 'À surveiller' : 'Bon',
                    changeType: dso > 45 ? 'negative' : 'positive',
                    description: 'Délai moyen de paiement',
                },
            ];
        } catch (error) {
            perfLogger.error('KPI calculation failed', error);
            return [];
        }
    }, [rawData]);

    return kpis;
}

/**
 * Optimized chart data preparation
 */
export function useChartData(rawData: Transaction[] | null, type: 'cashflow' | 'expenses' | 'margins') {
    return useMemo(() => {
        if (!rawData || rawData.length === 0) {
            return [];
        }

        perfLogger.time(`Chart data: ${type}`);

        try {
            switch (type) {
                case 'cashflow':
                    // Group by month
                    const cashflowByMonth = rawData.reduce((acc, t) => {
                        const month = new Date(t.date).toLocaleString('fr-FR', { month: 'short' });
                        if (!acc[month]) acc[month] = 0;
                        acc[month] += t.montant;
                        return acc;
                    }, {} as Record<string, number>);

                    return Object.entries(cashflowByMonth).map(([month, amount]) => ({
                        month,
                        amount,
                    }));

                case 'expenses':
                    // Group by category (if exists)
                    const expensesByCategory = rawData
                        .filter((t) => t.montant < 0)
                        .reduce((acc, t) => {
                            const category = t.type || 'Autres';
                            if (!acc[category]) acc[category] = 0;
                            acc[category] += Math.abs(t.montant);
                            return acc;
                        }, {} as Record<string, number>);

                    return Object.entries(expensesByCategory).map(([category, amount]) => ({
                        category,
                        amount,
                    }));

                case 'margins':
                    // Calculate margins over time
                    const marginsByMonth = rawData.reduce((acc, t) => {
                        const month = new Date(t.date).toLocaleString('fr-FR', { month: 'short' });
                        if (!acc[month]) acc[month] = { revenue: 0, expenses: 0 };
                        if (t.montant > 0) {
                            acc[month].revenue += t.montant;
                        } else {
                            acc[month].expenses += Math.abs(t.montant);
                        }
                        return acc;
                    }, {} as Record<string, { revenue: number; expenses: number }>);

                    return Object.entries(marginsByMonth).map(([month, data]) => ({
                        month,
                        margin: data.revenue > 0 ? ((data.revenue - data.expenses) / data.revenue) * 100 : 0,
                    }));

                default:
                    return [];
            }
        } catch (error) {
            perfLogger.error(`Chart data calculation failed: ${type}`, error);
            return [];
        } finally {
            perfLogger.timeEnd(`Chart data: ${type}`);
        }
    }, [rawData, type]);
}

/**
 * Optimized top clients calculation
 */
export function useTopClients(rawData: Transaction[] | null, limit: number = 5) {
    return useMemo(() => {
        if (!rawData || rawData.length === 0) {
            return [];
        }

        perfLogger.time('Top clients calculation');

        try {
            const clientRevenue = rawData
                .filter((t) => t.montant > 0 && t.client)
                .reduce((acc, t) => {
                    const client = t.client || 'Client inconnu';
                    if (!acc[client]) acc[client] = 0;
                    acc[client] += t.montant;
                    return acc;
                }, {} as Record<string, number>);

            const topClients = Object.entries(clientRevenue)
                .sort(([, a], [, b]) => b - a)
                .slice(0, limit)
                .map(([client, revenue]) => ({
                    client,
                    revenue,
                }));

            perfLogger.timeEnd('Top clients calculation');
            return topClients;
        } catch (error) {
            perfLogger.error('Top clients calculation failed', error);
            return [];
        }
    }, [rawData, limit]);
}

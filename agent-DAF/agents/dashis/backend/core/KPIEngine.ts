/**
 * KPI Engine - Calculs purs des KPIs et données charts
 * Extrait de FinancialDashboardV2.tsx pour autonomie
 */

import type {
    FinancialRecord,
    FinancialData,
    KPI,
    KPICalculationResult,
    MonthlyData,
    CategoryBreakdown,
    MarginData,
    TopClient,
    OutstandingInvoice,
    PaymentStatus,
    SankeyData,
    SunburstData,
    ChartDataset
} from './types';

export class KPIEngine {
    /**
     * Calcule tous les KPIs à partir des données brutes
     */
    calculateKPIs(data: FinancialData): KPICalculationResult {
        const { records, totalRevenue, totalExpenses, netCashFlow } = data;

        const kpis: KPI[] = [];

        // KPI 1: Chiffre d'Affaires
        kpis.push({
            id: 'revenue',
            title: 'Chiffre d\'Affaires',
            value: `${Math.round(totalRevenue).toLocaleString('fr-FR')} €`,
            numericValue: totalRevenue,
            change: this.calculateChange(records, 'income'),
            changeType: this.getChangeType(this.calculateChange(records, 'income')),
            description: 'Total des revenus',
            isAvailable: true,
            confidence: 1.0
        });

        // KPI 2: Charges
        kpis.push({
            id: 'expenses',
            title: 'Charges',
            value: `${Math.round(totalExpenses).toLocaleString('fr-FR')} €`,
            numericValue: totalExpenses,
            change: this.calculateChange(records, 'expense'),
            changeType: 'neutral',
            description: 'Total des dépenses',
            isAvailable: true,
            confidence: 1.0
        });

        // KPI 3: Marge nette
        const margin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
        kpis.push({
            id: 'margin',
            title: 'Marge Nette',
            value: `${margin.toFixed(1)}%`,
            numericValue: margin,
            change: `${Math.round(totalRevenue - totalExpenses).toLocaleString('fr-FR')} €`,
            changeType: margin > 20 ? 'positive' : margin > 10 ? 'neutral' : 'negative',
            description: 'Rentabilité nette',
            isAvailable: true,
            confidence: 1.0
        });

        // KPI 4: Cash Flow
        kpis.push({
            id: 'cashflow',
            title: 'Cash Flow',
            value: `${Math.round(netCashFlow).toLocaleString('fr-FR')} €`,
            numericValue: netCashFlow,
            change: netCashFlow > 0 ? 'Positif' : 'Négatif',
            changeType: netCashFlow > 0 ? 'positive' : 'negative',
            description: 'Flux de trésorerie net',
            isAvailable: true,
            confidence: 1.0
        });

        // KPI 5: DSO (Days Sales Outstanding)
        const dso = this.calculateDSO(records);
        if (dso !== null) {
            kpis.push({
                id: 'dso',
                title: 'DSO',
                value: `${dso} jours`,
                numericValue: dso,
                change: dso < 30 ? 'Excellent' : dso < 60 ? 'Bon' : 'À améliorer',
                changeType: dso < 30 ? 'positive' : dso < 60 ? 'neutral' : 'negative',
                description: 'Délai moyen de paiement',
                isAvailable: true,
                confidence: 0.8
            });
        }

        return {
            kpis,
            metadata: {
                calculatedAt: new Date(),
                recordsCount: records.length,
                period: `${data.period.start.toLocaleDateString()} - ${data.period.end.toLocaleDateString()}`,
                quality: records.length > 50 ? 'high' : records.length > 20 ? 'medium' : 'low'
            }
        };
    }

    /**
     * Calcule les données mensuelles agrégées
     */
    calculateMonthlyData(records: FinancialRecord[]): MonthlyData[] {
        if (!records || records.length === 0) return [];

        const monthlyStats = records.reduce((acc: any, record) => {
            const month = new Date(record.date).toLocaleDateString('fr-FR', { 
                month: 'short', 
                year: 'numeric' 
            });
            
            if (!acc[month]) {
                acc[month] = { month, revenue: 0, expenses: 0 };
            }

            if (record.type === 'income') {
                acc[month].revenue += record.amount;
            } else {
                acc[month].expenses += record.amount;
            }

            return acc;
        }, {});

        return Object.values(monthlyStats).map((m: any) => ({
            month: m.month,
            revenue: m.revenue,
            expenses: m.expenses,
            cashFlow: m.revenue - m.expenses
        }));
    }

    /**
     * Calcule la répartition des charges par catégorie
     */
    calculateCategoryBreakdown(records: FinancialRecord[]): CategoryBreakdown[] {
        if (!records || records.length === 0) return [];

        const expenses = records.filter(r => r.type === 'expense');
        if (expenses.length === 0) return [];

        const categoryTotals = expenses.reduce((acc: any, r) => {
            const cat = r.category || 'Autres';
            acc[cat] = (acc[cat] || 0) + r.amount;
            return acc;
        }, {});

        const total = expenses.reduce((sum, r) => sum + r.amount, 0);

        const allCategories = Object.entries(categoryTotals)
            .map(([name, value]: [string, any]) => ({
                name,
                value,
                percentage: ((value / total) * 100).toFixed(1)
            }))
            .sort((a, b) => b.value - a.value);

        // Regrouper les catégories < 3% en "Autres"
        const threshold = 3.0;
        const majorCategories = allCategories.filter(cat => parseFloat(cat.percentage) >= threshold);
        const minorCategories = allCategories.filter(cat => parseFloat(cat.percentage) < threshold);

        if (minorCategories.length > 0) {
            const othersValue = minorCategories.reduce((sum, cat) => sum + cat.value, 0);
            const othersPercentage = ((othersValue / total) * 100).toFixed(1);

            majorCategories.push({
                name: 'Autres',
                value: othersValue,
                percentage: othersPercentage
            });
        }

        return majorCategories;
    }

    /**
     * Calcule l'évolution des marges mensuelles
     */
    calculateMarginData(records: FinancialRecord[]): MarginData[] {
        if (!records || records.length === 0) return [];

        const monthlyStats = records.reduce((acc: any, record) => {
            const month = new Date(record.date).toLocaleDateString('fr-FR', { 
                month: 'short', 
                year: 'numeric' 
            });
            
            if (!acc[month]) {
                acc[month] = { month, revenue: 0, expenses: 0 };
            }

            if (record.type === 'income') {
                acc[month].revenue += record.amount;
            } else {
                acc[month].expenses += record.amount;
            }

            return acc;
        }, {});

        return Object.values(monthlyStats).map((m: any) => {
            const margin = m.revenue - m.expenses;
            const marginPercent = m.revenue > 0 ? (margin / m.revenue) * 100 : 0;
            
            return {
                month: m.month,
                revenue: m.revenue,
                expenses: m.expenses,
                margin,
                marginPercent
            };
        });
    }

    /**
     * Calcule le top 5 des clients par CA
     */
    calculateTopClients(records: FinancialRecord[]): TopClient[] {
        if (!records || records.length === 0) return [];

        const revenues = records.filter(r => r.type === 'income');
        if (revenues.length === 0) return [];

        const clientTotals = revenues.reduce((acc: any, record) => {
            const client = record.client || record.description || 'Client inconnu';
            if (!acc[client]) {
                acc[client] = { name: client, revenue: 0 };
            }
            acc[client].revenue += record.amount;
            return acc;
        }, {});

        const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

        return Object.values(clientTotals)
            .sort((a: any, b: any) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((client: any) => ({
                name: client.name,
                revenue: client.revenue,
                percentage: (client.revenue / totalRevenue) * 100
            }));
    }

    /**
     * Calcule les factures impayées
     */
    calculateOutstandingInvoices(records: FinancialRecord[]): OutstandingInvoice[] {
        const pending = records.filter(r => 
            r.type === 'income' && 
            (r.status === 'pending' || r.status === 'overdue') &&
            r.invoiceId &&
            r.dueDate
        );

        return pending.map(r => {
            const dueDate = new Date(r.dueDate!);
            const today = new Date();
            const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

            return {
                invoiceId: r.invoiceId!,
                client: r.client || r.description || 'Inconnu',
                amount: r.amount,
                dueDate: r.dueDate!,
                daysOverdue: Math.max(0, daysOverdue),
                status: (daysOverdue > 0 ? 'overdue' : 'pending') as 'pending' | 'overdue'
            };
        }).sort((a, b) => b.daysOverdue - a.daysOverdue);
    }

    /**
     * Calcule la répartition des statuts de paiement
     */
    calculatePaymentStatus(records: FinancialRecord[]): PaymentStatus[] {
        const invoices = records.filter(r => r.type === 'income' && r.status);
        if (invoices.length === 0) return [];

        const statusCounts = invoices.reduce((acc: any, r) => {
            const status = r.status || 'unknown';
            acc[status] = (acc[status] || 0) + r.amount;
            return acc;
        }, {});

        const total = invoices.reduce((sum, r) => sum + r.amount, 0);

        const statusLabels: any = {
            'paid': 'Payé',
            'pending': 'En attente',
            'overdue': 'En retard'
        };

        return Object.entries(statusCounts).map(([status, value]: [string, any]) => ({
            name: statusLabels[status] || status,
            value,
            percentage: (value / total) * 100
        }));
    }

    /**
     * Prépare les données Sankey (flux financiers)
     */
    calculateSankeyData(records: FinancialRecord[]): SankeyData {
        const revenues = records.filter(r => r.type === 'income');
        const expenses = records.filter(r => r.type === 'expense');

        const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
        const totalExpenses = expenses.reduce((sum, r) => sum + r.amount, 0);
        const netCashFlow = totalRevenue - totalExpenses;

        // Nodes: 0=Revenus, 1=Charges, 2=Trésorerie
        const nodes = [
            { name: 'Revenus' },
            { name: 'Charges' },
            { name: 'Trésorerie' }
        ];

        // Links: Revenus → Charges, Revenus → Trésorerie
        const links = [
            { source: 0, target: 1, value: totalExpenses },
            { source: 0, target: 2, value: netCashFlow > 0 ? netCashFlow : 0 }
        ];

        return { nodes, links };
    }

    /**
     * Prépare les données Sunburst (hiérarchie charges)
     */
    calculateSunburstData(records: FinancialRecord[]): SunburstData {
        const expenses = records.filter(r => r.type === 'expense');
        
        const categoryTotals = expenses.reduce((acc: any, r) => {
            const cat = r.category || 'Autres';
            acc[cat] = (acc[cat] || 0) + r.amount;
            return acc;
        }, {});

        const children = Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value: value as number
        }));

        return {
            name: 'Charges',
            children
        };
    }

    /**
     * Calcule toutes les données charts en une seule fois
     */
    calculateAllCharts(records: FinancialRecord[]): ChartDataset {
        return {
            monthlyData: this.calculateMonthlyData(records),
            categoryBreakdown: this.calculateCategoryBreakdown(records),
            marginData: this.calculateMarginData(records),
            topClients: this.calculateTopClients(records),
            outstandingInvoices: this.calculateOutstandingInvoices(records),
            paymentStatus: this.calculatePaymentStatus(records),
            sankeyData: this.calculateSankeyData(records),
            sunburstData: this.calculateSunburstData(records)
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HELPERS PRIVÉS
    // ═══════════════════════════════════════════════════════════════════════════

    private calculateChange(records: FinancialRecord[], type: 'income' | 'expense'): string {
        const filtered = records.filter(r => r.type === type);
        if (filtered.length === 0) return '+0%';

        // Simplification: comparer 2 derniers mois
        const sorted = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const recent = sorted.slice(0, Math.floor(sorted.length / 2));
        const older = sorted.slice(Math.floor(sorted.length / 2));

        const recentTotal = recent.reduce((sum, r) => sum + r.amount, 0);
        const olderTotal = older.reduce((sum, r) => sum + r.amount, 0);

        if (olderTotal === 0) return '+0%';

        const change = ((recentTotal - olderTotal) / olderTotal) * 100;
        return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    }

    private getChangeType(change: string): 'positive' | 'negative' | 'neutral' {
        if (change.startsWith('+') && !change.startsWith('+0')) return 'positive';
        if (change.startsWith('-')) return 'negative';
        return 'neutral';
    }

    private calculateDSO(records: FinancialRecord[]): number | null {
        const invoices = records.filter(r => 
            r.type === 'income' && 
            r.status === 'paid' &&
            r.dueDate
        );

        if (invoices.length === 0) return null;

        const totalDays = invoices.reduce((sum, inv) => {
            const issued = new Date(inv.date);
            const paid = new Date(inv.dueDate!);
            const days = Math.floor((paid.getTime() - issued.getTime()) / (1000 * 60 * 60 * 24));
            return sum + Math.max(0, days);
        }, 0);

        return Math.round(totalDays / invoices.length);
    }
}

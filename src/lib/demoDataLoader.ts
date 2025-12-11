/**
 * Demo Data Loader
 * Charge des configurations JSON pré-calculées pour les démos
 * Garantit 100% de cohérence entre KPIs, graphiques, anomalies
 */

import type { ProcessedData, FinancialRecord } from './dataModel';

export interface DemoConfig {
    id: string;
    company: string;
    sector: 'services' | 'commerce' | 'industrie' | 'saas';
    description: string;

    // KPIs pré-calculés
    kpis: {
        revenue: { value: number; variation: number };
        expenses: { value: number; variation: number };
        grossMargin: number;
        netMargin: number;
        cashFlow: { value: number; variation?: number; runway?: number };
        dso: number;
        bfr: { value: number; percent: number };
    };

    // Données pour graphiques (cohérentes avec KPIs)
    charts: {
        cashFlowEvolution: Array<{
            month: string;
            revenue: number;
            expenses: number;
            cashFlow: number;
        }>;
        marginEvolution: Array<{
            month: string;
            marginPercentage: number;
        }>;
        categoryBreakdown: Array<{
            name: string;
            value: number;
            percentage: string;
        }>;
        topClients: Array<{
            name: string;
            value: number;
        }>;
        sankeyFlow?: {
            totalRevenue: number;
            totalExpenses: number;
            cashFlowNet: number;
        };
    };

    // Anomalies détectées (pré-définies)
    anomalies: Array<{
        type: 'spike' | 'drop' | 'unusual' | 'pattern';
        severity: 'high' | 'medium' | 'low';
        category: string;
        amount: number;
        date: string;
        description: string;
        confidence: number;
    }>;

    // Alertes intelligentes
    alerts: Array<{
        type: 'critical' | 'warning' | 'info';
        title: string;
        description: string;
        value: number;
        threshold: number;
        actions: string[];
    }>;

    // Métadonnées pour affichage
    period: {
        start: string;
        end: string;
        months: number;
    };

    dataQuality: {
        confidence: number;
        transactionCount: number;
        clientsCount: number;
    };
}

/**
 * Charge une configuration de démo depuis JSON
 */
export async function loadDemoConfig(demoName: string): Promise<DemoConfig> {
    const response = await fetch(`/demo-configs/${demoName}.json`);
    if (!response.ok) {
        throw new Error(`Demo config not found: ${demoName}`);
    }

    const config: DemoConfig = await response.json();
    return config;
}

/**
 * Convertit une DemoConfig en ProcessedData (format attendu par le dashboard)
 */
export function convertDemoToProcessedData(config: DemoConfig): ProcessedData {
    const { kpis, charts, period, dataQuality } = config;

    // Créer des records fictifs pour compatibilité (non utilisés pour l'affichage)
    const dummyRecords: FinancialRecord[] = [];

    return {
        sourceId: `demo-${config.id}`,
        records: dummyRecords,

        summary: {
            totalRecords: dataQuality.transactionCount,
            totalIncome: kpis.revenue.value,
            totalExpenses: kpis.expenses.value,
            netCashFlow: kpis.cashFlow.value,
            period: {
                start: new Date(period.start),
                end: new Date(period.end)
            },
            accounts: [],
            categories: charts.categoryBreakdown.map(cat => ({
                name: cat.name,
                type: 'expense' as const,
                amount: cat.value,
                count: 1,
                percentage: parseFloat(cat.percentage)
            }))
        },

        kpis: {
            revenue: kpis.revenue.value,
            expenses: kpis.expenses.value,
            margin: kpis.cashFlow.value,
            marginPercentage: kpis.netMargin,
            averageTransaction: kpis.revenue.value / dataQuality.transactionCount,
            transactionFrequency: kpis.dso,
            topCategories: {
                income: [],
                expense: charts.categoryBreakdown.slice(0, 5).map(cat => ({
                    name: cat.name,
                    type: 'expense' as const,
                    amount: cat.value,
                    count: 1,
                    percentage: parseFloat(cat.percentage)
                }))
            },
            trends: {
                revenueGrowth: kpis.revenue.variation,
                expenseGrowth: kpis.expenses.variation,
                marginTrend: 0,
                cashFlowGrowth: kpis.cashFlow.variation || 0
            }
        },

        qualityMetrics: {
            completeness: dataQuality.confidence,
            consistency: dataQuality.confidence,
            accuracy: dataQuality.confidence,
            duplicates: 0,
            anomalies: [],
            suggestions: []
        }
    };
}

/**
 * Détecte si un fichier est une démo
 */
export function isDemoFile(filename: string | null | undefined): boolean {
    if (!filename) return false;
    return filename.startsWith('demo-') && filename.endsWith('.csv');
}

/**
 * Extrait le nom de la démo depuis le filename
 * demo-startup-difficulte.csv → startup-difficulte
 */
export function extractDemoName(filename: string): string {
    return filename
        .replace('demo-', '')
        .replace('.csv', '')
        .trim();
}

/**
 * Charge et convertit une démo en une passe
 */
export async function loadDemo(filename: string): Promise<{
    processedData: ProcessedData;
    config: DemoConfig;
}> {
    const demoName = extractDemoName(filename);
    const config = await loadDemoConfig(demoName);
    const processedData = convertDemoToProcessedData(config);

    return { processedData, config };
}

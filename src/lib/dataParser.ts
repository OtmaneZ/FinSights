// Utilitaires pour parser les données financières
// Version simple sans dépendances externes

export interface FinancialRecord {
    date: string;
    description: string;
    amount: number;
    category?: string;
    type: 'income' | 'expense';
}

export interface ProcessedData {
    records: FinancialRecord[];
    summary: {
        totalIncome: number;
        totalExpenses: number;
        netCashFlow: number;
        period: {
            start: string;
            end: string;
        };
    };
    kpis: {
        revenue: number;
        expenses: number;
        margin: number;
        averageTransaction: number;
    };
}

// Parse CSV simple (sans lib externe pour commencer)
export function parseCSV(csvText: string): FinancialRecord[] {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const records: FinancialRecord[] = [];

    // Détection automatique des colonnes
    const dateCol = findColumnIndex(headers, ['date', 'datum', 'période', 'period']);
    const amountCol = findColumnIndex(headers, ['amount', 'montant', 'valeur', 'value', 'sum']);
    const descCol = findColumnIndex(headers, ['description', 'libellé', 'libelle', 'desc', 'label']);

    if (dateCol === -1 || amountCol === -1) {
        throw new Error('Colonnes date et montant non trouvées');
    }

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < Math.max(dateCol, amountCol) + 1) continue;

        const amount = parseFloat(cols[amountCol].replace(/[€$,\s]/g, ''));
        if (isNaN(amount)) continue;

        records.push({
            date: cols[dateCol].trim(),
            description: descCol >= 0 ? cols[descCol].trim() : `Transaction ${i}`,
            amount: Math.abs(amount),
            type: amount >= 0 ? 'income' : 'expense'
        });
    }

    return records;
}

// Helper pour trouver les colonnes
function findColumnIndex(headers: string[], possibleNames: string[]): number {
    for (const name of possibleNames) {
        const index = headers.findIndex(h => h.includes(name));
        if (index >= 0) return index;
    }
    return -1;
}

// Traitement des données pour créer des KPIs
export function processFinancialData(records: FinancialRecord[]): ProcessedData {
    const income = records.filter(r => r.type === 'income');
    const expenses = records.filter(r => r.type === 'expense');

    const totalIncome = income.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = expenses.reduce((sum, r) => sum + r.amount, 0);

    // Détection période
    const dates = records.map(r => new Date(r.date)).filter(d => !isNaN(d.getTime()));
    const startDate = dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
    const endDate = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();

    return {
        records,
        summary: {
            totalIncome,
            totalExpenses,
            netCashFlow: totalIncome - totalExpenses,
            period: {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0]
            }
        },
        kpis: {
            revenue: totalIncome,
            expenses: totalExpenses,
            margin: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
            averageTransaction: records.length > 0 ? totalIncome / income.length : 0
        }
    };
}

// Génération des KPIs pour le dashboard
export function generateDashboardKPIs(data: ProcessedData) {
    const { kpis, summary } = data;

    return [
        {
            title: 'Chiffre d\'Affaires',
            value: `${Math.round(kpis.revenue).toLocaleString('fr-FR')} €`,
            change: '+0%', // TODO: calculer vs période précédente
            changeType: 'neutral' as const,
            description: `Période: ${summary.period.start} à ${summary.period.end}`
        },
        {
            title: 'Charges',
            value: `${Math.round(kpis.expenses).toLocaleString('fr-FR')} €`,
            change: '+0%',
            changeType: 'neutral' as const,
            description: 'Total des dépenses'
        },
        {
            title: 'Marge Nette',
            value: `${kpis.margin.toFixed(1)}%`,
            change: '+0%',
            changeType: kpis.margin > 20 ? 'positive' : kpis.margin > 10 ? 'neutral' : 'negative',
            description: 'Marge bénéficiaire'
        },
        {
            title: 'Cash Flow Net',
            value: `${Math.round(summary.netCashFlow).toLocaleString('fr-FR')} €`,
            change: '+0%',
            changeType: summary.netCashFlow > 0 ? 'positive' : 'negative',
            description: 'Flux de trésorerie net'
        }
    ];
}
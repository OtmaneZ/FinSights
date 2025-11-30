/**
 * Helpers pour agréger et filtrer les données du drill-down
 * Calcule les agrégations par client, catégorie, facture selon le KPI sélectionné
 */

export interface AggregatedEntity {
    name: string;
    value: number;
    count: number;
    percentage?: number;
    records?: any[]; // Enregistrements détaillés
}

export interface InvoiceDetail {
    id: string;
    date: Date;
    description: string;
    amount: number;
    status: string;
    client: string;
    category?: string;
    daysOverdue?: number;
}

/**
 * Agrège les données par contrepartie (client) pour un KPI donné
 */
export function aggregateByClient(
    rawData: any[],
    kpiTitle: string
): AggregatedEntity[] {
    if (!rawData || rawData.length === 0) return [];

    // Filtrer selon le type de KPI (Vocabulaire V3)
    let filteredData = rawData;

    if (kpiTitle.includes('Revenus') || kpiTitle.includes('Chiffre') || kpiTitle.includes('Affaires') || kpiTitle.includes('CA')) {
        // Pour CA/Revenus: seulement les revenus
        filteredData = rawData.filter(r => r.type === 'income');
    } else if (kpiTitle.includes('Charges') || kpiTitle.includes('Dépenses')) {
        // Pour Charges: seulement les dépenses
        filteredData = rawData.filter(r => r.type === 'expense');
    } else if (kpiTitle.includes('DSO') || kpiTitle.includes('Délai')) {
        // Pour DSO: factures en attente
        filteredData = rawData.filter(r => r.type === 'income' && r.paymentStatus === 'En attente');
    }

    // Grouper par client/contrepartie
    const clientMap = new Map<string, { total: number; count: number; records: any[] }>();

    filteredData.forEach(record => {
        const clientName = record.counterparty || record.client || record.description || 'Client inconnu';

        if (!clientMap.has(clientName)) {
            clientMap.set(clientName, { total: 0, count: 0, records: [] });
        }

        const client = clientMap.get(clientName)!;
        client.total += Math.abs(record.amount);
        client.count += 1;
        client.records.push(record);
    });

    // Convertir en array et calculer pourcentages
    const total = Array.from(clientMap.values()).reduce((sum, c) => sum + c.total, 0);

    const aggregated = Array.from(clientMap.entries())
        .map(([name, data]) => ({
            name,
            value: data.total,
            count: data.count,
            percentage: total > 0 ? (data.total / total) * 100 : 0,
            records: data.records
        }))
        .sort((a, b) => b.value - a.value); // Trier par montant décroissant

    return aggregated;
}

/**
 * Agrège les données par catégorie
 */
export function aggregateByCategory(
    rawData: any[],
    kpiTitle: string
): AggregatedEntity[] {
    if (!rawData || rawData.length === 0) return [];

    // Filtrer selon le type de KPI (Vocabulaire V3)
    let filteredData = rawData;

    if (kpiTitle.includes('Charges') || kpiTitle.includes('Dépenses')) {
        filteredData = rawData.filter(r => r.type === 'expense');
    } else if (kpiTitle.includes('Revenus') || kpiTitle.includes('Chiffre') || kpiTitle.includes('Affaires')) {
        filteredData = rawData.filter(r => r.type === 'income');
    }

    // Grouper par catégorie
    const categoryMap = new Map<string, { total: number; count: number; records: any[] }>();

    filteredData.forEach(record => {
        const categoryName = record.category || 'Non catégorisé';

        if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, { total: 0, count: 0, records: [] });
        }

        const category = categoryMap.get(categoryName)!;
        category.total += Math.abs(record.amount);
        category.count += 1;
        category.records.push(record);
    });

    // Convertir en array
    const total = Array.from(categoryMap.values()).reduce((sum, c) => sum + c.total, 0);

    const aggregated = Array.from(categoryMap.entries())
        .map(([name, data]) => ({
            name,
            value: data.total,
            count: data.count,
            percentage: total > 0 ? (data.total / total) * 100 : 0,
            records: data.records
        }))
        .sort((a, b) => b.value - a.value);

    return aggregated;
}

/**
 * Récupère les factures détaillées pour un client donné
 */
export function getInvoicesForEntity(
    rawData: any[],
    entityName: string,
    kpiTitle: string
): InvoiceDetail[] {
    if (!rawData || rawData.length === 0) return [];

    // Filtrer les enregistrements pour ce client
    const entityRecords = rawData.filter(record => {
        const clientName = record.counterparty || record.client || record.description || 'Client inconnu';
        const categoryName = record.category || 'Non catégorisé';

        return clientName === entityName || categoryName === entityName;
    });

    // Convertir en format InvoiceDetail
    const invoices: InvoiceDetail[] = entityRecords.map((record, index) => {
        // Calculer jours de retard pour DSO
        let daysOverdue = 0;
        if (record.paymentStatus === 'En attente' && record.date) {
            const now = new Date();
            const invoiceDate = new Date(record.date);
            const diffTime = now.getTime() - invoiceDate.getTime();
            daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }

        return {
            id: record.id || `inv-${index}`,
            date: new Date(record.date),
            description: record.description || 'Sans description',
            amount: record.amount,
            status: record.paymentStatus || 'Payé',
            client: record.counterparty || record.client || entityName,
            category: record.category,
            daysOverdue: daysOverdue > 0 ? daysOverdue : undefined
        };
    });

    // Trier par date décroissante (plus récent d'abord)
    return invoices.sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Calcule les statistiques agrégées pour un niveau de drill-down
 */
export function calculateDrillDownStats(entities: AggregatedEntity[]) {
    if (entities.length === 0) {
        return {
            totalAmount: 0,
            totalCount: 0,
            averageAmount: 0,
            topEntity: null,
            concentration: 0 // % du top 3
        };
    }

    const totalAmount = entities.reduce((sum, e) => sum + e.value, 0);
    const totalCount = entities.reduce((sum, e) => sum + e.count, 0);
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;

    const topEntity = entities[0];

    // Concentration: part des 3 premiers
    const top3Amount = entities.slice(0, 3).reduce((sum, e) => sum + e.value, 0);
    const concentration = totalAmount > 0 ? (top3Amount / totalAmount) * 100 : 0;

    return {
        totalAmount,
        totalCount,
        averageAmount,
        topEntity,
        concentration
    };
}

/**
 * Détermine le type d'agrégation selon le KPI
 */
export function getDrillDownType(kpiTitle: string): 'client' | 'category' | 'both' {
    if (kpiTitle.includes('DSO') || kpiTitle.includes('Délai') || kpiTitle.includes('Cash Flow')) {
        return 'client'; // Pour DSO et Cash Flow, drill-down par client
    } else if (kpiTitle.includes('Charges') || kpiTitle.includes('Dépenses')) {
        return 'category'; // Pour Charges, drill-down par catégorie
    } else {
        return 'both'; // Pour CA et Marge, permettre les deux
    }
}

/**
 * Formate un montant pour affichage
 */
export function formatCurrency(amount: number): string {
    return `${Math.round(amount).toLocaleString('fr-FR')} €`;
}

/**
 * Formate une date pour affichage
 */
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

/**
 * FORMULES FINANCIÈRES STANDARDS
 * Conformes aux normes comptables françaises (PCG 2025)
 * 
 * Références :
 * - Plan Comptable Général (PCG)
 * - Normes IFRS pour les ratios internationaux
 * - Standards DFCG (Association des Directeurs Financiers et Contrôleurs de Gestion)
 */

import { FinancialRecord } from './dataModel';

/**
 * DSO - Days Sales Outstanding (Délai moyen de paiement clients)
 * 
 * Formule standard : DSO = (Créances clients / Chiffre d'affaires) × 365
 * 
 * Interprétation :
 * - < 30 jours : Excellent (paiements rapides)
 * - 30-45 jours : Bon (standard secteur services)
 * - 45-60 jours : Correct (standard secteur industrie)
 * - > 60 jours : À surveiller (risque de trésorerie)
 * 
 * @param receivables - Créances clients en attente de paiement (€)
 * @param revenue - Chiffre d'affaires annuel (€)
 * @returns DSO en jours
 */
export function calculateDSO(receivables: number, revenue: number): number {
    if (revenue <= 0) return 0;
    return Math.round((receivables / revenue) * 365);
}

/**
 * DSO ALTERNATIF - Calculé depuis les transactions réelles
 * Quand on n'a pas les créances, on estime via les délais de paiement observés
 * 
 * @param records - Transactions financières
 * @returns DSO estimé en jours
 */
export function calculateDSOFromTransactions(records: FinancialRecord[]): number {
    // Filtrer les encaissements clients (revenus)
    const clientPayments = records.filter(r => r.type === 'income' && r.amount > 0);
    
    if (clientPayments.length === 0) return 0;

    // Calculer le délai moyen entre transactions
    const dates = clientPayments.map(r => r.date.getTime()).sort((a, b) => a - b);
    
    if (dates.length < 2) return 30; // Valeur par défaut si pas assez de données

    const intervals = [];
    for (let i = 1; i < dates.length; i++) {
        const daysBetween = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
        intervals.push(daysBetween);
    }

    const averageInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    return Math.round(averageInterval);
}

/**
 * BFR - Besoin en Fonds de Roulement
 * 
 * Formule standard : BFR = Stocks + Créances clients - Dettes fournisseurs
 * 
 * Interprétation :
 * - BFR négatif : Trésorerie structurellement positive (bon signe)
 * - BFR positif < 20% CA : Situation saine
 * - BFR positif > 30% CA : Tension sur la trésorerie
 * 
 * @param stocks - Valeur des stocks (€)
 * @param receivables - Créances clients (€)
 * @param payables - Dettes fournisseurs (€)
 * @returns BFR en euros
 */
export function calculateBFR(stocks: number, receivables: number, payables: number): number {
    return stocks + receivables - payables;
}

/**
 * BFR ESTIMÉ - Depuis transactions
 * Quand on n'a pas les données de bilan
 * 
 * @param records - Transactions financières
 * @param revenue - Chiffre d'affaires
 * @returns BFR estimé
 */
export function calculateEstimatedBFR(records: FinancialRecord[], revenue: number): {
    bfr: number;
    confidence: number;
    method: string;
} {
    // Estimer les créances (30 jours de CA moyen)
    const dailyRevenue = revenue / 365;
    const estimatedReceivables = dailyRevenue * 30;

    // Estimer les dettes fournisseurs (analyser les paiements récurrents)
    const supplierPayments = records.filter(r => r.type === 'expense' && r.amount < 0);
    const monthlySupplierPayments = supplierPayments.length > 0
        ? Math.abs(supplierPayments.reduce((sum, r) => sum + r.amount, 0)) / 12
        : 0;
    const estimatedPayables = monthlySupplierPayments;

    // Stocks : Non estimable depuis transactions (nécessite inventaire)
    const stocks = 0;

    const bfr = stocks + estimatedReceivables - estimatedPayables;

    return {
        bfr: Math.round(bfr),
        confidence: 0.6, // Estimation - pas de données réelles de bilan
        method: 'Estimation depuis flux de trésorerie'
    };
}

/**
 * MARGE BRUTE
 * 
 * Formule : Marge Brute (%) = ((CA - Coût d'achat marchandises) / CA) × 100
 * 
 * Benchmarks sectoriels :
 * - Services/Conseil : 60-80%
 * - Commerce : 20-40%
 * - Industrie : 30-50%
 * - SaaS/Software : 70-90%
 * 
 * @param revenue - Chiffre d'affaires (€)
 * @param cogs - Coût d'achat des marchandises vendues (€)
 * @returns Marge brute en pourcentage
 */
export function calculateGrossMargin(revenue: number, cogs: number): number {
    if (revenue <= 0) return 0;
    return Math.round(((revenue - cogs) / revenue) * 1000) / 10; // 1 décimale
}

/**
 * MARGE NETTE
 * 
 * Formule : Marge Nette (%) = ((CA - Toutes charges) / CA) × 100
 * 
 * @param revenue - Chiffre d'affaires
 * @param totalExpenses - Total des charges
 * @returns Marge nette en pourcentage
 */
export function calculateNetMargin(revenue: number, totalExpenses: number): number {
    if (revenue <= 0) return 0;
    const netProfit = revenue - totalExpenses;
    return Math.round((netProfit / revenue) * 1000) / 10;
}

/**
 * ROTATION DES STOCKS
 * 
 * Formule : Rotation = Coût d'achat annuel / Stock moyen
 * 
 * Interprétation :
 * - > 12 : Excellent (stock renouvelé chaque mois)
 * - 6-12 : Bon
 * - < 6 : Stock dormant (risque d'obsolescence)
 * 
 * @param cogs - Coût d'achat annuel
 * @param averageStock - Stock moyen
 * @returns Nombre de rotations par an
 */
export function calculateStockRotation(cogs: number, averageStock: number): number {
    if (averageStock <= 0) return 0;
    return Math.round((cogs / averageStock) * 10) / 10;
}

/**
 * RATIO DE LIQUIDITÉ GÉNÉRALE
 * 
 * Formule : Ratio = Actif circulant / Passif circulant
 * 
 * Interprétation :
 * - > 2 : Très bonne liquidité
 * - 1-2 : Liquidité correcte
 * - < 1 : Risque de défaut de paiement
 * 
 * @param currentAssets - Actif circulant
 * @param currentLiabilities - Passif circulant
 * @returns Ratio de liquidité
 */
export function calculateLiquidityRatio(currentAssets: number, currentLiabilities: number): number {
    if (currentLiabilities <= 0) return 0;
    return Math.round((currentAssets / currentLiabilities) * 100) / 100;
}

/**
 * CASH FLOW OPÉRATIONNEL
 * 
 * Formule simplifiée : Cash Flow = Revenus encaissés - Dépenses décaissées
 * 
 * @param records - Transactions
 * @returns Cash flow net
 */
export function calculateOperatingCashFlow(records: FinancialRecord[]): {
    cashIn: number;
    cashOut: number;
    netCashFlow: number;
} {
    const cashIn = records
        .filter(r => r.type === 'income' && r.amount > 0)
        .reduce((sum, r) => sum + r.amount, 0);

    const cashOut = Math.abs(
        records
            .filter(r => r.type === 'expense' && r.amount < 0)
            .reduce((sum, r) => sum + r.amount, 0)
    );

    return {
        cashIn: Math.round(cashIn),
        cashOut: Math.round(cashOut),
        netCashFlow: Math.round(cashIn - cashOut)
    };
}

/**
 * IDENTIFIER LES CRÉANCES
 * (Transactions positives non encore encaissées - approximation)
 * 
 * @param records - Transactions
 * @returns Estimation des créances
 */
export function estimateReceivables(records: FinancialRecord[]): number {
    // Calculer le CA mensuel moyen
    const incomeRecords = records.filter(r => r.type === 'income' && r.amount > 0);
    
    if (incomeRecords.length === 0) return 0;

    const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
    const monthlyIncome = totalIncome / 12;

    // Estimer créances = 1 mois de CA (hypothèse DSO 30j)
    return Math.round(monthlyIncome);
}

/**
 * IDENTIFIER LES DETTES FOURNISSEURS
 * 
 * @param records - Transactions
 * @returns Estimation des dettes fournisseurs
 */
export function estimatePayables(records: FinancialRecord[]): number {
    // Analyser les paiements récurrents
    const expenseRecords = records.filter(r => r.type === 'expense');
    
    if (expenseRecords.length === 0) return 0;

    const totalExpenses = Math.abs(expenseRecords.reduce((sum, r) => sum + r.amount, 0));
    const monthlyExpenses = totalExpenses / 12;

    // Estimer dettes = 1 mois de charges (hypothèse paiement à 30j)
    return Math.round(monthlyExpenses);
}

/**
 * SEUILS D'ALERTE STANDARDS
 */
export const FINANCIAL_THRESHOLDS = {
    DSO: {
        excellent: 30,
        good: 45,
        warning: 60,
        critical: 90
    },
    GROSS_MARGIN: {
        services: { min: 60, target: 70, excellent: 80 },
        commerce: { min: 20, target: 30, excellent: 40 },
        industrie: { min: 30, target: 40, excellent: 50 },
        saas: { min: 70, target: 80, excellent: 90 }
    },
    NET_MARGIN: {
        excellent: 20,
        good: 10,
        warning: 5,
        critical: 0
    },
    BFR_RATIO: {
        // En % du CA
        excellent: 10,
        good: 20,
        warning: 30,
        critical: 40
    },
    LIQUIDITY: {
        excellent: 2.0,
        good: 1.5,
        warning: 1.0,
        critical: 0.8
    }
};

/**
 * BENCHMARKS SECTORIELS
 */
export const SECTOR_BENCHMARKS = {
    SERVICES: {
        name: 'Services / Conseil',
        dso: { min: 30, median: 45, max: 60 },
        grossMargin: { min: 60, median: 70, max: 80 },
        netMargin: { min: 10, median: 15, max: 25 }
    },
    COMMERCE: {
        name: 'Commerce / Distribution',
        dso: { min: 15, median: 30, max: 45 },
        grossMargin: { min: 20, median: 30, max: 40 },
        netMargin: { min: 3, median: 5, max: 10 }
    },
    INDUSTRIE: {
        name: 'Industrie / Manufacturing',
        dso: { min: 45, median: 60, max: 75 },
        grossMargin: { min: 30, median: 40, max: 50 },
        netMargin: { min: 5, median: 10, max: 15 }
    },
    SAAS: {
        name: 'SaaS / Software',
        dso: { min: 0, median: 15, max: 30 },
        grossMargin: { min: 70, median: 80, max: 90 },
        netMargin: { min: 15, median: 25, max: 40 }
    }
};

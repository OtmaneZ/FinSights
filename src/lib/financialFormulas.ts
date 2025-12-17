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
import { logger } from '@/lib/logger';

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
 * DSO AVANCÉ - Calculé depuis les transactions réelles
 * Méthode 1 : Si dueDate disponible → calcul précis des retards
 * Méthode 2 : Sinon → estimation via créances moyennes
 *
 * @param records - Transactions financières
 * @returns DSO estimé en jours, ou null si données insuffisantes
 */
export function calculateDSOFromTransactions(records: FinancialRecord[]): number | null {
    if (!records || records.length === 0) {
        logger.warn('⚠️ DSO: Aucune transaction disponible');
        return null;
    }

    // Filtrage robuste avec validation complète
    const incomeRecords = records.filter(r => {
        const hasType = r.type && typeof r.type === 'string';
        const isIncome = hasType && r.type.toLowerCase() === 'income';
        const hasAmount = typeof r.amount === 'number' && !isNaN(r.amount);
        const isPositive = hasAmount && r.amount > 0;

        return isIncome && isPositive;
    });

    if (incomeRecords.length === 0) {
        logger.warn('⚠️ DSO: Aucune transaction de revenu détectée');
        return null;
    }

    // Minimum 3 transactions pour un calcul fiable
    if (incomeRecords.length < 3) {
        logger.warn('⚠️ DSO: Données insuffisantes (< 3 transactions revenus)');
        return null;
    }    // Méthode 1 : Si nous avons des dates d'échéance
    const recordsWithDueDate = incomeRecords.filter(r => {
        return r.dueDate && !isNaN(r.dueDate.getTime());
    });

    if (recordsWithDueDate.length >= 3) {
        const delays = recordsWithDueDate.map(r => {
            const issueDate = new Date(r.date);
            const dueDate = r.dueDate!;
            const daysDiff = Math.floor((dueDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
            return Math.max(0, daysDiff);
        });

        const avgDelay = delays.reduce((sum, d) => sum + d, 0) / delays.length;
        return Math.round(avgDelay);
    }

    // Méthode 2 : Estimation basée sur le CA et la période
    const totalRevenue = incomeRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    if (totalRevenue === 0 || isNaN(totalRevenue)) {
        logger.warn('⚠️ DSO: CA total invalide', { totalRevenue });
        return 30;
    }

    const dates = incomeRecords
        .map(r => new Date(r.date).getTime())
        .filter(t => !isNaN(t))
        .sort((a, b) => a - b);

    if (dates.length < 2) {
        logger.warn('⚠️ DSO: Pas assez de dates valides');
        return 30;
    }

    const periodDays = Math.max(1, (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24));
    const dailyRevenue = totalRevenue / Math.max(periodDays, 1);
    const estimatedReceivables = dailyRevenue * 30;
    const annualizedRevenue = totalRevenue * (365 / Math.max(periodDays, 1));

    const dso = (estimatedReceivables / annualizedRevenue) * 365;

    if (isNaN(dso) || dso < 0) {
        logger.error('❌ DSO invalide:', { dso, totalRevenue, periodDays });
        return null;
    }

    const finalDSO = Math.min(Math.round(dso), 120);

    return finalDSO;
}/**
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
 * @returns BFR estimé avec niveau de confiance
 */
export function calculateEstimatedBFR(records: FinancialRecord[], revenue: number): {
    bfr: number;
    confidence: number;
    method: string;
    details: {
        estimatedReceivables: number;
        estimatedPayables: number;
        estimatedStocks: number;
    };
} {
    if (revenue === 0 || records.length === 0) {
        return {
            bfr: 0,
            confidence: 0,
            method: 'Données insuffisantes',
            details: { estimatedReceivables: 0, estimatedPayables: 0, estimatedStocks: 0 }
        };
    }

    // ✅ ESTIMER LES CRÉANCES CLIENTS
    // Méthode : DSO × (CA annualisé / 365)
    const dso = calculateDSOFromTransactions(records);

    // ⚠️ Si DSO null, impossible de calculer BFR
    if (dso === null) {
        logger.warn('⚠️ BFR: DSO non calculable, estimation impossible');
        return {
            bfr: 0,
            confidence: 0,
            method: 'Impossible à estimer (DSO indisponible)',
            details: { estimatedReceivables: 0, estimatedPayables: 0, estimatedStocks: 0 }
        };
    }

    const periodDays = (() => {
        const dates = records.map(r => r.date.getTime()).sort((a, b) => a - b);
        return dates.length > 1
            ? (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24)
            : 365;
    })();

    const annualizedRevenue = revenue * (365 / Math.max(periodDays, 1));
    const estimatedReceivables = (dso / 365) * annualizedRevenue;

    // ✅ ESTIMER LES DETTES FOURNISSEURS
    // ⚠️ ATTENTION: DPO fixe de 30j = APPROXIMATION RISQUÉE
    // Méthode : DPO (Days Payable Outstanding) × Achats annualisés / 365
    const expenseRecords = records.filter(r => r.type === 'expense');
    const totalExpenses = Math.abs(expenseRecords.reduce((sum, r) => sum + r.amount, 0));
    const annualizedExpenses = totalExpenses * (365 / Math.max(periodDays, 1));
    const estimatedPayables = (30 / 365) * annualizedExpenses; // ⚠️ DPO HYPOTHÉTIQUE 30j

    // ✅ STOCKS : Non estimable depuis transactions (nécessite inventaire physique)
    const estimatedStocks = 0;

    const bfr = estimatedStocks + estimatedReceivables - estimatedPayables;

    // Niveau de confiance basé sur la qualité des données
    let confidence = 0.3; // ⚠️ Base réduite car DPO hypothétique
    if (dso > 0 && dso < 90) confidence += 0.2; // DSO réaliste
    if (records.length > 50) confidence += 0.1; // Beaucoup de données
    if (periodDays > 180) confidence += 0.1; // Période longue

    return {
        bfr: Math.round(bfr),
        confidence: Math.min(confidence, 0.7), // ⚠️ Max 70% (pas 90%) car DPO estimé
        method: '⚠️ Estimation approximative (DPO fixe 30j non réel)',
        details: {
            estimatedReceivables: Math.round(estimatedReceivables),
            estimatedPayables: Math.round(estimatedPayables),
            estimatedStocks: 0
        }
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
 * IDENTIFIER LES COGS (Cost of Goods Sold) depuis transactions
 * Détecte automatiquement les achats de marchandises
 *
 * @param records - Transactions
 * @returns Montant total des COGS
 */
export function extractCOGS(records: FinancialRecord[]): {
    cogs: number;
    confidence: number;
    method: string;
} {
    // Mots-clés pour identifier les achats de marchandises
    const cogsKeywords = [
        'achat', 'achats', 'marchandise', 'stock', 'produit',
        'matière', 'fourniture', 'approvisionnement', 'fournisseur',
        'cogs', 'cost of goods'
    ];

    // Filtrer les dépenses
    const expenseRecords = records.filter(r => r.type === 'expense');

    // Détecter les COGS par catégorie ou description
    const cogsRecords = expenseRecords.filter(record => {
        const category = (record.category || '').toLowerCase();
        const description = (record.description || '').toLowerCase();
        const counterparty = (record.counterparty || '').toLowerCase();

        return cogsKeywords.some(keyword =>
            category.includes(keyword) ||
            description.includes(keyword) ||
            counterparty.includes(keyword)
        );
    });

    const cogsAmount = Math.abs(cogsRecords.reduce((sum, r) => sum + r.amount, 0));

    // Si aucun COGS détecté, estimer à 0 (secteur services probablement)
    if (cogsRecords.length === 0) {
        return {
            cogs: 0,
            confidence: 0.5,
            method: 'Aucun achat de marchandise détecté (secteur services ?)'
        };
    }

    // Calculer le niveau de confiance
    const cogsRatio = cogsRecords.length / expenseRecords.length;
    const confidence = Math.min(0.5 + (cogsRatio * 0.4), 0.9);

    return {
        cogs: Math.round(cogsAmount),
        confidence,
        method: `${cogsRecords.length} transactions d'achat identifiées`
    };
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

/**
 * CALCUL DES VARIATIONS PÉRIODE N vs N-1
 *
 * Divise les données en 2 périodes et calcule l'évolution des KPIs
 *
 * @param records - Transactions financières
 * @returns Variations en % pour chaque KPI
 */
/**
 * 📊 Calcule les variations entre 2 périodes pour afficher les tendances (croissance %)
 *
 * ⚠️ IMPORTANT - Découpage par date médiane :
 * Cette fonction divise les transactions en 2 moitiés égales selon la date médiane.
 *
 * Exemple (demo-data.csv) :
 * - 89 transactions du 01/08/2024 au 14/11/2024
 * - Date médiane ≈ 02/09/2024 (index 44/89)
 * - Période N-1 : 26 transactions (01/08 → 01/09) = 90k€
 * - Période N   : 63 transactions (02/09 → 14/11) = 243k€ ✅ Affiché dans UI
 *
 * Le CA affiché (243k€) correspond donc à la période N (2ème moitié), pas au total !
 */
export function calculatePeriodVariations(records: FinancialRecord[]): {
    revenue: number;
    expenses: number;
    netMargin: number;
    cashFlow: number;
} {
    if (!records || records.length === 0) {
        return { revenue: 0, expenses: 0, netMargin: 0, cashFlow: 0 };
    }

    // Trier par date
    const sortedRecords = [...records].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Trouver la date médiane pour diviser en 2 périodes
    const midIndex = Math.floor(sortedRecords.length / 2);
    const midDate = new Date(sortedRecords[midIndex].date);

    // Période 1 (N-1) : première moitié
    const period1 = sortedRecords.filter(r => new Date(r.date) < midDate);

    // Période 2 (N) : deuxième moitié (c'est cette période qui est affichée comme CA principal !)
    const period2 = sortedRecords.filter(r => new Date(r.date) >= midDate);

    // Calculer les KPIs pour chaque période
    const calcKPIs = (recs: FinancialRecord[]) => {
        const revenue = recs.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
        const expenses = recs.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
        const cashFlow = revenue - expenses;
        const netMargin = revenue > 0 ? (cashFlow / revenue) * 100 : 0;
        return { revenue, expenses, cashFlow, netMargin };
    };

    const kpis1 = calcKPIs(period1);
    const kpis2 = calcKPIs(period2);

    // Calculer variations % = ((N - N-1) / N-1) * 100
    const calcVariation = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    return {
        revenue: calcVariation(kpis2.revenue, kpis1.revenue),
        expenses: calcVariation(kpis2.expenses, kpis1.expenses),
        netMargin: kpis2.netMargin - kpis1.netMargin, // Pour la marge, c'est la diff en points
        cashFlow: calcVariation(kpis2.cashFlow, kpis1.cashFlow)
    };
}

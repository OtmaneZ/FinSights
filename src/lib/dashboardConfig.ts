// Configuration adaptative du dashboard selon le niveau de données
import { DataLevel, DashboardConfig, DataLevelInfo, ColumnMapping, FinancialRecord } from './dataModel';
import { logger } from '@/lib/logger';
import {
    calculateDSOFromTransactions,
    calculateEstimatedBFR,
    calculateGrossMargin,
    calculateNetMargin,
    estimateReceivables,
    estimatePayables,
    extractCOGS
} from './financialFormulas';

// Détection granulaire des capacités réelles
export function detectCapabilities(mappings: ColumnMapping[], records: FinancialRecord[]) {
    const detectedFields = mappings.map(m => m.targetField);

    const hasDate = detectedFields.includes('date');
    const hasAmount = detectedFields.includes('amount');
    const hasDescription = detectedFields.includes('description');
    const hasCounterparty = detectedFields.includes('counterparty');
    const hasCategory = detectedFields.includes('category');
    const hasAccount = detectedFields.includes('account');
    const hasReference = detectedFields.includes('reference');

    // ✅ DÉTECTION INTELLIGENTE : Vérifier si dueDate existe dans les records
    const hasDueDateField = records.some(r => (r as any).dueDate !== undefined && (r as any).dueDate !== null);
    const incomeWithDueDates = records.filter(r => r.type === 'income' && (r as any).dueDate).length;

    logger.debug('🔍 detectCapabilities - dueDate:', {
        hasDueDateField,
        incomeWithDueDates,
        totalIncome: records.filter(r => r.type === 'income').length,
        sampleDueDate: records.find(r => (r as any).dueDate) ? (records.find(r => (r as any).dueDate) as any).dueDate : 'N/A'
    });

    // Analyse de la richesse des données réelles
    const recordCount = records.length;
    const uniqueCounterparties = hasCounterparty ? new Set(records.map(r => r.counterparty).filter(Boolean)).size : 0;
    const uniqueCategories = hasCategory ? new Set(records.map(r => r.category).filter(Boolean)).size : 0;
    const dateRange = records.length > 0 ? {
        start: new Date(Math.min(...records.map(r => r.date.getTime()))),
        end: new Date(Math.max(...records.map(r => r.date.getTime())))
    } : null;
    const monthsSpan = dateRange ? Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;

    return {
        // Capacités de base (toujours disponibles si date + amount)
        canShowKPIs: hasDate && hasAmount,
        canShowBasicCharts: hasDate && hasAmount && recordCount >= 5,

        // Capacités conditionnelles précises
        canShowTopClients: hasCounterparty && uniqueCounterparties >= 2,
        canShowCategoryAnalysis: hasCategory && uniqueCategories >= 2,
        canShowDSO: hasDueDateField && incomeWithDueDates >= 3, // ✅ Détection automatique des dates d'échéance
        canShowMonthlyTrends: monthsSpan >= 2 && recordCount >= 10,

        // Capacités avancées (désactivées - données insuffisantes)
        canShowProjections: false, // Nécessite historique > 6 mois
        canShowAlerts: false, // Nécessite règles business configurées
        canShowAIInsights: false, // Nécessite données enrichies

        // Métadonnées pour le feedback utilisateur
        recordCount,
        uniqueCounterparties,
        uniqueCategories,
        monthsSpan,
        suggestions: generateSmartSuggestions(detectedFields, recordCount, uniqueCounterparties, uniqueCategories)
    };
}

// Suggestions intelligentes basées sur les données réelles
function generateSmartSuggestions(fields: string[], recordCount: number, counterparties: number, categories: number): string[] {
    const suggestions: string[] = [];

    if (!fields.includes('counterparty')) {
        suggestions.push('Ajoutez une colonne "Client" pour débloquer l\'analyse des top clients');
    }

    if (!fields.includes('category')) {
        suggestions.push('Ajoutez une colonne "Catégorie" pour l\'analyse détaillée des charges');
    }

    if (recordCount < 10) {
        suggestions.push('Importez plus de transactions pour des analyses plus précises');
    }

    if (counterparties > 0 && counterparties < 3) {
        suggestions.push('Plus de clients permettront une analyse plus riche');
    }

    return suggestions;
}
// Configuration granulaire du dashboard (fini les niveaux !)
export function getDashboardConfig(capabilities: ReturnType<typeof detectCapabilities>): DashboardConfig {
    return {
        // Niveau descriptif (pour l'affichage uniquement)
        level: capabilities.canShowTopClients || capabilities.canShowCategoryAnalysis ? 'intermediate' : 'basic',

        // Configuration granulaire précise
        showTopClients: capabilities.canShowTopClients,
        showCategoryAnalysis: capabilities.canShowCategoryAnalysis,
        showDSO: capabilities.canShowDSO,

        // Fonctionnalités désactivées (pas assez de données)
        showProductMargin: false,
        showRatios: false,
        showProjections: false,
        showAlerts: false,
        showAIInsights: false,
        showTrendAnalysis: false,
        showDetailedAnalysis: false,
        showRecommendations: false,

        // Compteurs dynamiques
        kpiCount: 4 + (capabilities.canShowTopClients ? 1 : 0) + (capabilities.canShowDSO ? 1 : 0),
        chartCount: 1 + (capabilities.canShowMonthlyTrends ? 1 : 0)
    };
}

// Génération des KPIs selon les capacités réelles
export function generateAdaptiveKPIs(data: any, capabilities: ReturnType<typeof detectCapabilities>) {
    const kpis = [];

    // ✅ Extraire les COGS pour calculer la marge brute
    const cogsData = extractCOGS(data.records);

    // ✅ KPI 1 : Chiffre d'Affaires (Vocabulaire V3)
    kpis.push({
        title: 'Revenus & Croissance',
        value: `${Math.round(data.kpis.revenue).toLocaleString('fr-FR')} €`,
        change: `${data.kpis.trends.revenueGrowth.toFixed(1)}%`,
        changeType: data.kpis.trends.revenueGrowth > 0 ? 'positive' : data.kpis.trends.revenueGrowth < 0 ? 'negative' : 'neutral',
        description: `Période analysée: ${data.summary.period.start.toLocaleDateString('fr-FR')} à ${data.summary.period.end.toLocaleDateString('fr-FR')}`,
        confidence: data.qualityMetrics.accuracy,
        isAvailable: true // ✅ Toujours disponible
    });

    // ✅ KPI 2 : Charges (Vocabulaire V3)
    kpis.push({
        title: 'Charges & Contrôle',
        value: `${Math.round(data.kpis.expenses).toLocaleString('fr-FR')} €`,
        change: `${data.kpis.trends.expenseGrowth.toFixed(1)}%`, // Garder le vrai signe : négatif = baisse
        changeType: data.kpis.trends.expenseGrowth < 0 ? 'positive' : data.kpis.trends.expenseGrowth > 0 ? 'negative' : 'neutral', // Baisse = vert
        description: 'Total des dépenses',
        confidence: data.qualityMetrics.accuracy,
        isAvailable: true // ✅ Toujours disponible
    });

    // ✅ KPI 3 : Marge Brute (Vocabulaire V3 - si COGS détectés)
    if (cogsData.cogs > 0) {
        const grossMarginPercent = calculateGrossMargin(data.kpis.revenue, cogsData.cogs);
        kpis.push({
            title: 'Marge Brute & Rentabilité',
            value: `${grossMarginPercent.toFixed(1)}%`,
            change: cogsData.method,
            changeType: grossMarginPercent > 50 ? 'positive' : grossMarginPercent > 30 ? 'neutral' : 'negative',
            description: `CA - Coûts d'achat (${Math.round(cogsData.cogs).toLocaleString('fr-FR')} €)`,
            confidence: cogsData.confidence,
            isAvailable: true // ✅ Disponible car COGS détectés
        });
    }

    // ✅ KPI 4 : Marge Nette (Vocabulaire V3 - FORMULE CORRIGÉE)
    const netMarginPercent = calculateNetMargin(data.kpis.revenue, data.kpis.expenses);
    kpis.push({
        title: 'Marge Nette & Profitabilité',
        value: `${netMarginPercent.toFixed(1)}%`,
        change: `${data.kpis.trends.marginTrend.toFixed(1)}pt`,
        changeType: data.kpis.trends.marginTrend > 0 ? 'positive' : data.kpis.trends.marginTrend < 0 ? 'negative' : 'neutral',
        description: 'Rentabilité nette après toutes charges',
        confidence: data.qualityMetrics.consistency,
        isAvailable: true // ✅ Toujours disponible
    });

    // ✅ KPI 5 : Cash Flow Net (Vocabulaire V3)
    kpis.push({
        title: 'Cash & Liquidité',
        value: `${Math.round(data.summary.netCashFlow).toLocaleString('fr-FR')} €`,
        change: `${(data.kpis.trends.cashFlowGrowth || 0).toFixed(1)}%`,
        changeType: (data.kpis.trends.cashFlowGrowth || 0) > 0 ? 'positive' : (data.kpis.trends.cashFlowGrowth || 0) < 0 ? 'negative' : 'neutral',
        description: 'Flux de trésorerie net',
        confidence: data.qualityMetrics.completeness,
        isAvailable: true // ✅ Toujours disponible
    });

    // ✅ KPI 6 : DSO - Délai de paiement clients (Vocabulaire V3)
    if (data.records.length > 0) {
        const dsoValue = calculateDSOFromTransactions(data.records);
        if (dsoValue !== null) {
            kpis.push({
                title: 'DSO & Cycles Paiement',
                value: `${dsoValue} jours`,
                change: dsoValue < 45 ? 'Excellent' : dsoValue < 60 ? 'Bon' : 'À surveiller',
                changeType: dsoValue < 45 ? 'positive' : dsoValue < 60 ? 'neutral' : 'negative',
                description: capabilities.canShowDSO
                    ? (dsoValue === 0 ? 'Paiements instantanés (comptant)' : 'Délai moyen de paiement réel')
                    : 'Délai moyen de paiement (estimation)',
                confidence: capabilities.canShowDSO ? 0.95 : 0.7,
                isAvailable: true // ✅ Toujours affiché (avec indication estimation si pas de dates)
            });
        }
    }

    // ✅ KPI 7 : BFR - Besoin en Fonds de Roulement (Vocabulaire V3)
    if (data.records.length > 10) {
        const bfrData = calculateEstimatedBFR(data.records, data.kpis.revenue);
        const bfrRatio = data.kpis.revenue > 0 ? (bfrData.bfr / data.kpis.revenue) * 100 : 0;

        kpis.push({
            title: 'BFR & Résilience',
            value: `${Math.round(bfrData.bfr).toLocaleString('fr-FR')} €`,
            change: `${Math.abs(bfrRatio).toFixed(1)}% du CA`,
            changeType: bfrRatio < 15 ? 'positive' : bfrRatio < 25 ? 'neutral' : 'negative',
            description: `${bfrData.method} (confiance: ${Math.round(bfrData.confidence * 100)}%)`,
            confidence: bfrData.confidence,
            tooltip: `Créances: ${bfrData.details.estimatedReceivables.toLocaleString('fr-FR')} € | Dettes: ${bfrData.details.estimatedPayables.toLocaleString('fr-FR')} €`,
            isAvailable: true // ✅ Disponible si > 10 transactions
        });
    }

    return kpis;
}

// Messages d'encouragement pour débloquer plus de fonctionnalités
export function getUpgradeMessages(levelInfo: DataLevelInfo): string[] {
    const messages: string[] = [];

    if (levelInfo.missingFeatures.includes('topClients')) {
        messages.push('💡 Ajoutez une colonne "Client" pour débloquer l\'analyse des top clients');
    }

    if (levelInfo.missingFeatures.includes('categoryAnalysis')) {
        messages.push('📊 Ajoutez une colonne "Catégorie" pour l\'analyse détaillée des charges par poste');
    }

    if (levelInfo.level === 'basic') {
        messages.push('🚀 Enrichissez vos données pour débloquer jusqu\'à 8 KPIs supplémentaires et 3 graphiques avancés');
    }

    return messages;
}

// Fonction wrapper pour compatibilité (à terme, supprimer detectDataLevel)
export function detectDataLevel(mappings: ColumnMapping[], records: FinancialRecord[] = []): DataLevelInfo {
    const capabilities = detectCapabilities(mappings, records);

    return {
        level: capabilities.canShowTopClients || capabilities.canShowCategoryAnalysis ? 'intermediate' : 'basic',
        confidence: 0.9,
        availableFeatures: [
            'basicKPIs',
            ...(capabilities.canShowTopClients ? ['topClients'] : []),
            ...(capabilities.canShowCategoryAnalysis ? ['categoryAnalysis'] : []),
            ...(capabilities.canShowMonthlyTrends ? ['monthlyTrends'] : [])
        ],
        missingFeatures: [
            ...(!capabilities.canShowTopClients ? ['topClients'] : []),
            ...(!capabilities.canShowCategoryAnalysis ? ['categoryAnalysis'] : []),
            'dsoAnalysis', 'projections', 'alerts'
        ],
        suggestions: capabilities.suggestions,
        description: capabilities.canShowTopClients || capabilities.canShowCategoryAnalysis
            ? 'Données enrichies - Analyses clients et catégories disponibles'
            : 'Données basiques - Analyses financières essentielles'
    };
}
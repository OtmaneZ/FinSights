// Configuration adaptative du dashboard selon le niveau de données
import { DataLevel, DashboardConfig, DataLevelInfo, ColumnMapping, FinancialRecord } from './dataModel';

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
        canShowDSO: false, // Nécessite dates d'échéance (pas dans nos données)
        canShowMonthlyTrends: monthsSpan >= 2 && recordCount >= 10,

        // Capacités avancées (désactivées - données insuffisantes)
        canShowProjections: false, // Nécessite historique > 6 mois
        canShowAlerts: false, // Nécessite règles business configurées
        canShowAdvancedCharts: false, // Nécessite segments/produits
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

        // Graphiques conditionnels
        showAdvancedCharts: capabilities.canShowMonthlyTrends,

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

    // KPIs de base (toujours présents)
    kpis.push({
        title: 'Chiffre d\'Affaires',
        value: `${Math.round(data.kpis.revenue).toLocaleString('fr-FR')} €`,
        change: `${data.kpis.trends.revenueGrowth.toFixed(1)}%`,
        changeType: data.kpis.trends.revenueGrowth > 0 ? 'positive' : 'negative',
        description: `Période: ${data.summary.period.start.toLocaleDateString('fr-FR')} à ${data.summary.period.end.toLocaleDateString('fr-FR')}`,
        confidence: data.qualityMetrics.accuracy
    });

    kpis.push({
        title: 'Charges',
        value: `${Math.round(data.kpis.expenses).toLocaleString('fr-FR')} €`,
        change: `${data.kpis.trends.expenseGrowth.toFixed(1)}%`,
        changeType: data.kpis.trends.expenseGrowth < 0 ? 'positive' : 'negative',
        description: 'Total des dépenses',
        confidence: data.qualityMetrics.accuracy
    });

    kpis.push({
        title: 'Marge Nette',
        value: `${data.kpis.marginPercentage.toFixed(1)}%`,
        change: `${data.kpis.trends.marginTrend.toFixed(1)}pt`,
        changeType: data.kpis.marginPercentage > 20 ? 'positive' : data.kpis.marginPercentage > 10 ? 'neutral' : 'negative',
        description: 'Marge bénéficiaire',
        confidence: data.qualityMetrics.consistency
    });

    kpis.push({
        title: 'Cash Flow Net',
        value: `${Math.round(data.summary.netCashFlow).toLocaleString('fr-FR')} €`,
        change: `${data.kpis.trends.marginTrend.toFixed(1)}%`,
        changeType: data.summary.netCashFlow > 0 ? 'positive' : 'negative',
        description: 'Flux de trésorerie net',
        confidence: data.qualityMetrics.completeness
    });

    // KPIs conditionnels SEULEMENT si données réelles
    if (capabilities.canShowDSO) {
        kpis.push({
            title: 'DSO Clients',
            value: `${Math.round(data.kpis.transactionFrequency * 30)} jours`,
            change: '-2j',
            changeType: 'positive',
            description: 'Délai de paiement estimé',
            confidence: 0.6
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
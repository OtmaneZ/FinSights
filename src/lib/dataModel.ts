// Modèle de données unifié pour FinSight
// Définit les structures de données standards pour toutes les sources

export interface RawDataRow {
    [key: string]: string | number | Date | null;
}

export interface ColumnMapping {
    sourceColumn: string;
    targetField: keyof FinancialRecord;
    confidence: number; // 0-1, confiance dans le mapping
    dataType: 'string' | 'number' | 'date' | 'currency';
}

export interface DataSource {
    id: string;
    name: string;
    type: 'csv' | 'excel' | 'bank_api' | 'accounting_system';
    uploadedAt: Date;
    fileName?: string;
    columns: string[];
    mappings: ColumnMapping[];
    recordCount: number;
}

export interface FinancialRecord {
    id: string;
    date: Date;
    description: string;
    amount: number;
    category?: string;
    subcategory?: string;
    type: 'income' | 'expense';
    account?: string;
    reference?: string;
    counterparty?: string;
    sourceId: string;
    rawData?: RawDataRow;
    confidence: number; // 0-1, confiance dans la classification
}

export interface ProcessedData {
    sourceId: string;
    records: FinancialRecord[];
    summary: DataSummary;
    kpis: FinancialKPIs;
    qualityMetrics: DataQuality;
    levelInfo?: DataLevelInfo;
    dashboardConfig?: DashboardConfig;
}

export interface DataSummary {
    totalRecords: number;
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    period: {
        start: Date;
        end: Date;
    };
    accounts: string[];
    categories: CategorySummary[];
}

export interface CategorySummary {
    name: string;
    type: 'income' | 'expense';
    amount: number;
    count: number;
    percentage: number;
}

export interface FinancialKPIs {
    revenue: number;
    expenses: number;
    margin: number;
    marginPercentage: number;
    averageTransaction: number;
    transactionFrequency: number;
    topCategories: {
        income: CategorySummary[];
        expense: CategorySummary[];
    };
    trends: {
        revenueGrowth: number;
        expenseGrowth: number;
        marginTrend: number;
        cashFlowGrowth?: number;
    };
}

export interface DataQuality {
    completeness: number; // 0-1, pourcentage de champs remplis
    accuracy: number; // 0-1, confiance dans la précision
    consistency: number; // 0-1, cohérence des formats
    duplicates: number; // nombre de doublons détectés
    anomalies: DataAnomaly[];
    suggestions: string[];
}

export interface DataAnomaly {
    type: 'duplicate' | 'outlier' | 'format_error' | 'missing_data' | 'suspicious_amount';
    recordId: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    suggestion?: string;
}

export interface DashboardKPI {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    description: string;
    trend?: number[]; // Données pour mini-graphiques
    confidence?: number; // Confiance dans la donnée
}

// Types pour la détection automatique des colonnes
export interface ColumnDetectionResult {
    column: string;
    field: keyof FinancialRecord;
    confidence: number;
    dataType: 'string' | 'number' | 'date' | 'currency';
    samples: (string | number)[];
    pattern?: RegExp;
}

// Configuration pour différents formats de fichiers
export interface ParseConfig {
    delimiter: string;
    hasHeader: boolean;
    dateFormat: string;
    currencySymbol: string;
    decimalSeparator: string;
    thousandsSeparator: string;
    encoding: string;
}

// Résultat du parsing avec métadonnées
export interface ParseResult {
    success: boolean;
    data?: ProcessedData;
    errors: ParseError[];
    warnings: string[];
    config: ParseConfig;
    detectedMappings: ColumnMapping[];
}

export interface ParseError {
    row: number;
    column: string;
    message: string;
    severity: 'error' | 'warning';
}

// Utilitaires pour la validation
export const FINANCIAL_CATEGORIES = {
    income: [
        'ventes', 'prestations', 'subventions', 'intérêts', 'dividendes',
        'autres produits', 'reprises provisions'
    ],
    expense: [
        'achats', 'charges personnel', 'loyers', 'assurances', 'énergie',
        'télécom', 'marketing', 'frais bancaires', 'impôts', 'amortissements'
    ]
} as const;

export const DATE_FORMATS = [
    'DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY',
    'DD.MM.YYYY', 'YYYY/MM/DD', 'DD MMM YYYY'
] as const;

export const CURRENCY_PATTERNS = {
    EUR: /€|EUR|euro/i,
    USD: /\$|USD|dollar/i,
    GBP: /£|GBP|pound/i
} as const;

// Nouveaux types pour le système adaptatif
export type DataLevel = 'basic' | 'intermediate' | 'advanced';

export interface DataLevelInfo {
    level: DataLevel;
    confidence: number; // 0-1, confiance dans la détection
    availableFeatures: string[];
    missingFeatures: string[];
    suggestions: string[];
    description: string;
}

export interface DashboardConfig {
    level: DataLevel;
    showTopClients: boolean;
    showDSO: boolean;
    showCategoryAnalysis: boolean;
    showProductMargin: boolean;
    showRatios: boolean;
    showProjections: boolean;
    showAlerts: boolean;
    // ✅ Nouveaux flags pour sections factices
    showAIInsights: boolean;        // Actions Prioritaires IA
    showTrendAnalysis: boolean;     // Évolution Mensuelle CA
    showDetailedAnalysis: boolean;  // Analyse Détaillée (Flux)
    showRecommendations: boolean;   // Actions Recommandées
    kpiCount: number;
    chartCount: number;
}

// Mapping des fonctionnalités selon les colonnes détectées
export const FEATURE_REQUIREMENTS = {
    'topClients': ['counterparty'],
    'dso': ['counterparty', 'date'],
    'categoryAnalysis': ['category'],
    'productMargin': ['product', 'amount'],
    'advancedRatios': ['account', 'category'],
    'projections': ['date', 'amount'],
    'alerts': ['amount', 'date']
} as const;

// Types pour l'IA et les insights
export interface AIAlert {
    id: string;
    type: 'urgent' | 'warning' | 'info';
    title: string;
    description: string;
    impact: string;
    action?: string;
    priority: number;
}

export interface AIRecommendation {
    id: string;
    category: 'cash_flow' | 'margin' | 'efficiency' | 'growth';
    title: string;
    description: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    potentialGain: number;
    priority: number;
}

export interface AIResponse {
    answer: string;
    confidence: number;
    sources: string[];
    suggestions: string[];
    followUp?: string[];
}

// Modèle de données FinSight complet
export interface FinSightDataModel {
    id: string;
    timestamp: string;
    fileName: string;
    recordCount: number;
    period: {
        start: Date;
        end: Date;
        label: string;
    };
    kpis: {
        revenue: KPIMetric;
        expenses: KPIMetric;
        margin: KPIMetric;
        cashFlow: KPIMetric;
        dso: KPIMetric;
        ebitda: KPIMetric;
    };
    insights?: {
        alerts: AIAlert[];
        recommendations: AIRecommendation[];
        summary: string;
        riskScore: number;
    };
}

export interface KPIMetric {
    title: string;
    value: number;
    formatted: string;
    changeValue: number;
    changeFormatted: string;
    changeType: 'positive' | 'negative' | 'neutral';
    description: string;
}
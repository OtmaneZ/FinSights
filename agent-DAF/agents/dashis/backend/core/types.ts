/**
 * DASHIS Agent - Types Core
 * Types centralisés pour l'agent DASHIS
 * 
 * Réutilise les types du projet (src/lib/dataModel) pour la robustesse.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL DATA TYPES (réutilisés depuis dataModel)
// ═══════════════════════════════════════════════════════════════════════════════

// Réutiliser les types existants du projet pour garantir la compatibilité
import type { 
    FinancialRecord as DataModelFinancialRecord,
    ProcessedData 
} from '@/lib/dataModel';

// Ré-exporter pour usage dans l'agent
export type FinancialRecord = DataModelFinancialRecord;
export type { ProcessedData };

export interface FinancialData {
    records: FinancialRecord[];
    totalRevenue: number;
    totalExpenses: number;
    netCashFlow: number;
    period: {
        start: Date;
        end: Date;
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// KPI TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface KPI {
    id: string;
    title: string;
    value: string;
    numericValue?: number;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    description: string;
    isAvailable: boolean;
    missingData?: string;
    confidence?: number; // 0-1
}

export interface KPICalculationResult {
    kpis: KPI[];
    metadata: {
        calculatedAt: Date;
        recordsCount: number;
        period: string;
        quality: 'high' | 'medium' | 'low';
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHART DATA TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface MonthlyData {
    month: string;
    revenue: number;
    expenses: number;
    cashFlow: number;
}

export interface CategoryBreakdown {
    name: string;
    value: number;
    percentage: string;
}

export interface MarginData {
    month: string;
    revenue: number;
    expenses: number;
    margin: number;
    marginPercent: number;
}

export interface TopClient {
    name: string;
    revenue: number;
    percentage: number;
}

export interface OutstandingInvoice {
    invoiceId: string;
    client: string;
    amount: number;
    dueDate: string;
    daysOverdue: number;
    status: 'pending' | 'overdue';
}

export interface PaymentStatus {
    name: string;
    value: number;
    percentage: number;
}

export interface SankeyData {
    nodes: Array<{ name: string }>;
    links: Array<{ source: number; target: number; value: number }>;
}

export interface SunburstData {
    name: string;
    children?: SunburstData[];
    value?: number;
}

export interface ChartDataset {
    monthlyData: MonthlyData[];
    categoryBreakdown: CategoryBreakdown[];
    marginData: MarginData[];
    topClients: TopClient[];
    outstandingInvoices: OutstandingInvoice[];
    paymentStatus: PaymentStatus[];
    sankeyData: SankeyData;
    sunburstData: SunburstData;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIMULATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SimulationParams {
    chargesReduction?: number;      // 0-30%
    paiementsAcceleration?: number; // 0-15 days
    prixAugmentation?: number;      // 0-15%
}

export interface SimulationResult {
    simulatedKPIs: KPI[];
    impact: {
        revenueChange: number;
        expensesChange: number;
        cashFlowChange: number;
        marginChange: number;
    };
    summary: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS TYPES (ML/AI/Scoring)
// ═══════════════════════════════════════════════════════════════════════════════

export interface Anomaly {
    id: string;
    type: 'amount_outlier' | 'payment_delay' | 'category_spike' | 'duplicate';
    severity: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    date: string;
    confidence: number;
    
    // Optional fields from ML detector
    value?: number;
    expectedRange?: { min: number; max: number };
    metadata?: {
        amount?: number;
        counterparty?: string;
        category?: string;
        expectedValue?: number;
        actualValue?: number;
        deviation?: number;
    };
}

export interface CashFlowPrediction {
    month: string;
    predicted: number;
    confidence: number;
    breakdown?: {
        optimistic: number;
        realistic: number;
        pessimistic: number;
    };
}

export interface AdvancedPattern {
    id?: string; // Optional for compatibility with AI API
    type: 'seasonality' | 'correlation' | 'client_behavior' | 'cost_structure' | 'opportunity' | 'risk_signal';
    title: string;
    description: string;
    insight: string;
    impact?: string;
    confidence: number;
}

export type ScoreLevel = 'critical' | 'warning' | 'good' | 'excellent';
export type ScoreConfidence = 'low' | 'medium' | 'high';

export interface ScoreBreakdown {
    cash: number;
    margin: number;
    resilience: number;
    risk: number;
}

export interface DataQualityInfo {
    recordCount: number;
    hasRevenue: boolean;
    hasExpenses: boolean;
    counterpartyRate: number;
    categoryRate: number;
    timeSpanMonths: number;
}

export interface FinSightScore {
    total: number; // 0-100
    level: ScoreLevel;
    confidence: ScoreConfidence;
    breakdown: ScoreBreakdown;
    insights: string[];
    recommendations: string[];
    dataQuality: DataQualityInfo;
    calculatedAt: Date;
}

export interface PredictionAlert {
    type: 'warning' | 'danger' | 'info';
    message: string;
    month?: string;
}

export interface AnalysisResult {
    // ML/AI Results
    anomalies: Anomaly[];
    cashFlowPredictions: CashFlowPrediction[];
    predictionAlerts: PredictionAlert[];
    patterns: AdvancedPattern[];
    finSightScore: FinSightScore | null;
    seasonalityDetected: boolean;
    
    // Metadata
    metadata: {
        analyzedAt: Date;
        recordCount: number;
        modulesExecuted: string[];
        executionTimeMs: number;
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════════

export type DashisState = 
    | 'idle'        // Pas de données, en attente
    | 'loading'     // Upload/parsing en cours
    | 'analyzing'   // ML/AI/Scoring en cours
    | 'ready'       // Données chargées, dashboard prêt
    | 'simulating'  // Simulation What-If active
    | 'error';      // Erreur fatale

export interface AgentState {
    current: DashisState;
    data: FinancialData | null;
    kpis: KPI[];
    charts: ChartDataset | null;
    analysis: AnalysisResult | null;
    simulation: SimulationResult | null;
    error: string | null;
    metadata: {
        loadedAt?: Date;
        analyzedAt?: Date;
        recordsCount: number;
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgentConfig {
    companyName?: string;
    sector?: string;
    teamSize?: number;
    autoAnalyze?: boolean;        // Auto-lancer ML/AI après load
    enableSimulations?: boolean;  // Activer What-If
    enableRealtime?: boolean;     // Pusher WebSocket
    enableCache?: boolean;        // Enable caching
}

// ═══════════════════════════════════════════════════════════════════════════════
// STANDARD AGENT INTERFACE (Pour fusion future)
// ═══════════════════════════════════════════════════════════════════════════════

export type AgentCapability = 
    | 'data-processing'
    | 'kpi-calculation'
    | 'anomaly-detection'
    | 'ml-analysis'
    | 'ai-predictions'
    | 'cash-flow-prediction'
    | 'pattern-detection'
    | 'scoring'
    | 'simulation'
    | 'visualization';

export interface IFinancialAgent {
    // Metadata
    id: string;                    // 'dashis' | 'tresoris' | 'margis' | 'scoris' | 'scenaris'
    name: string;
    version: string;
    capabilities: AgentCapability[];
    
    // Lifecycle
    initialize(config: AgentConfig): Promise<void>;
    shutdown(): Promise<void>;
    
    // Core operations
    analyze(data: FinancialData): Promise<AnalysisResult>;
    getState(): AgentState;
    
    // Fusion support (future)
    canFuseWith(agent: IFinancialAgent): boolean;
    getCompatibilityScore(agent: IFinancialAgent): number; // 0-1
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTS (Pour communication inter-agents)
// ═══════════════════════════════════════════════════════════════════════════════

export type AgentEventType = 
    | 'state-changed'
    | 'data-loaded'
    | 'analysis-complete'
    | 'anomaly-detected'
    | 'error';

export interface AgentEvent {
    type: AgentEventType;
    agentId: string;
    timestamp: Date;
    payload: any;
}

export type AgentEventCallback = (event: AgentEvent) => void;

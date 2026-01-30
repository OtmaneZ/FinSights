/**
 * DASHIS Agent - Types Core
 * Types centralisés pour l'agent DASHIS
 */

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL DATA TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface FinancialRecord {
    date: string;
    type: 'income' | 'expense';
    amount: number;
    category?: string;
    client?: string;
    description?: string;
    invoiceId?: string;
    status?: 'paid' | 'pending' | 'overdue';
    dueDate?: string;
}

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
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    value: number;
    expectedRange: { min: number; max: number };
    date: string;
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
    id: string;
    type: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    confidence: number;
    recommendations?: string[];
}

export interface FinSightScore {
    score: number; // 0-100
    grade: string; // A+, A, B, C, D, E
    color: string;
    breakdown: {
        cashFlow: number;
        profitability: number;
        efficiency: number;
        growth: number;
    };
    recommendations: string[];
    strengths: string[];
    weaknesses: string[];
}

export interface AnalysisResult {
    anomalies: Anomaly[];
    predictions: CashFlowPrediction[];
    patterns: AdvancedPattern[];
    score: FinSightScore | null;
    seasonalityDetected: boolean;
    alerts: Array<{
        type: 'warning' | 'danger' | 'info';
        message: string;
        month?: string;
    }>;
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
    autoAnalyze?: boolean;        // Auto-lancer ML/AI après load
    enableSimulations?: boolean;  // Activer What-If
    enableRealtime?: boolean;     // Pusher WebSocket
}

// ═══════════════════════════════════════════════════════════════════════════════
// STANDARD AGENT INTERFACE (Pour fusion future)
// ═══════════════════════════════════════════════════════════════════════════════

export type AgentCapability = 
    | 'kpi-calculation'
    | 'anomaly-detection'
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

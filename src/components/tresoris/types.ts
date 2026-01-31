/**
 * Types pour les composants TRESORIS
 */

// ═══════════════════════════════════════════════════════════════════
// SIMULATION
// ═══════════════════════════════════════════════════════════════════

export interface SimulationRequest {
    client_name: string
    amount: number
    days_overdue: number
    due_date?: string
}

export interface SimulationResult {
    // Impact global
    runway_before_weeks: number
    runway_after_weeks: number
    runway_delta_weeks: number
    
    // Impact client
    client_rating_before: string | null
    client_rating_after: string
    client_score_before: number | null
    client_score_after: number
    rating_changed: boolean
    
    // Risques
    risk_status: 'CERTAIN' | 'UNCERTAIN' | 'CRITICAL'
    risk_score: number
    
    // Alertes
    warnings_triggered: Warning[]
    
    // Actions
    actions_generated: Action[]
    
    // Contexte
    simulation_summary: string
    is_demo: boolean
}

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD DATA
// ═══════════════════════════════════════════════════════════════════

export interface DashboardData {
    // Position cash
    total_pending: number
    total_overdue: number
    runway_weeks: number
    
    // Répartition risques
    risks_by_status: Record<string, number>
    amount_by_status: Record<string, number>
    
    // Top clients
    top_risky_clients: RiskyClient[]
    
    // Alertes
    active_warnings: Warning[]
    
    // Actions
    pending_actions: Action[]
    
    // Stats
    dso_moyen: number
    nb_clients: number
    nb_factures_pending: number
    
    // Agent
    last_analysis: string | null
    agent_running: boolean
}

export interface RiskyClient {
    client_name: string
    total_amount: number
    max_days_overdue: number
    risk_count: number
    max_score: number
    status: 'CERTAIN' | 'UNCERTAIN' | 'CRITICAL'
}

// ═══════════════════════════════════════════════════════════════════
// WARNINGS & ACTIONS
// ═══════════════════════════════════════════════════════════════════

export interface Warning {
    id?: string
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    message: string
    amount_at_risk?: number
    client?: string
    days_overdue?: number
}

export interface Action {
    id?: string
    priority: 'P1' | 'P2' | 'P3'
    title: string
    description?: string
    deadline: string
    impact_amount: number
    validation_status?: 'pending' | 'approved' | 'rejected'
}

// ═══════════════════════════════════════════════════════════════════
// CLIENT DETAILS
// ═══════════════════════════════════════════════════════════════════

export interface ClientDetails {
    client_id: string
    client_name: string
    pattern: ClientPattern | null
    scoring: ClientScoring | null
    invoices: InvoiceSummary
    warnings: Warning[]
    pending_invoices: Invoice[]
}

export interface ClientPattern {
    avg_delay_days: number | null
    on_time_rate: number | null
    trend: 'stable' | 'improving' | 'worsening' | null
    reliability_score: number | null
    risk_level: 'low' | 'medium' | 'high' | 'critical' | null
}

export interface ClientScoring {
    rating: 'A' | 'B' | 'C' | 'D' | null
    risk_score: number | null
    explanation: string | null
    risk_factors: string[]
    positive_factors: string[]
    confidence: 'low' | 'medium' | 'high' | null
}

export interface InvoiceSummary {
    total: number
    pending: number
    paid: number
    total_amount: number
    pending_amount: number
    overdue_amount: number
}

export interface Invoice {
    invoice_id: string
    client_name: string
    amount: number
    due_date: string
    days_overdue: number
    status: string
    risk_level?: string
}

// ═══════════════════════════════════════════════════════════════════
// DEMO COMPANY
// ═══════════════════════════════════════════════════════════════════

export interface DemoCompany {
    name: string
    type: 'startup' | 'pme' | 'scaleup' | 'eti'
    sector: string
    description: string
    metrics: {
        ca_annuel: number
        nb_clients: number
        dso_moyen: number
        encours_total: number
    }
}

// Entreprise démo par défaut : Scale-up SaaS B2B
export const DEMO_COMPANY: DemoCompany = {
    name: 'NovaTech Solutions',
    type: 'scaleup',
    sector: 'SaaS B2B - Logiciel de gestion',
    description: 'Scale-up française en forte croissance, 45 collaborateurs, ARR 3.2M€',
    metrics: {
        ca_annuel: 3200000,
        nb_clients: 85,
        dso_moyen: 42,
        encours_total: 1250000
    }
}

// ═══════════════════════════════════════════════════════════════════
// API CONFIG
// ═══════════════════════════════════════════════════════════════════

export const TRESORIS_API_BASE = process.env.NEXT_PUBLIC_TRESORIS_API_URL || 'http://localhost:8000'

export const TRESORIS_ENDPOINTS = {
    dashboard: `${TRESORIS_API_BASE}/dashboard`,
    simulate: `${TRESORIS_API_BASE}/agent/simulate`,
    demoInit: `${TRESORIS_API_BASE}/demo/init`,
    client: (id: string) => `${TRESORIS_API_BASE}/client/${id}`,
    agentStart: `${TRESORIS_API_BASE}/agent/start`,
    agentStop: `${TRESORIS_API_BASE}/agent/stop`,
    agentStatus: `${TRESORIS_API_BASE}/agent/status`,
    latestAnalysis: `${TRESORIS_API_BASE}/agent/analysis/latest`,
    validate: `${TRESORIS_API_BASE}/agent/validate`,
    upload: `${TRESORIS_API_BASE}/upload`,
    websocket: `${TRESORIS_API_BASE.replace('http', 'ws')}/ws`
}

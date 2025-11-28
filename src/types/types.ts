// Financial data types for FinSight platform

export interface FinancialMetric {
    id: string
    name: string
    value: number
    currency: string
    period: string
    change?: {
        value: number
        percentage: number
        period: string
    }
}

export interface CashFlowProjection {
    date: string
    amount: number
    type: 'inflow' | 'outflow'
    category: string
    description: string
    confidence: 'high' | 'medium' | 'low'
}

export interface AIInsight {
    id: string
    type: 'alert' | 'opportunity' | 'recommendation' | 'analysis'
    severity: 'low' | 'medium' | 'high'
    title: string
    description: string
    impact: string
    recommendations: string[]
    createdAt: Date
}

export interface CompanyData {
    id: string
    name: string
    industry: string
    size: 'PME' | 'ETI' | 'GE'
    currency: string
    fiscalYearEnd: string
}

export interface BankConnection {
    id: string
    bankName: string
    accountNumber: string
    balance: number
    lastSync: Date
    status: 'connected' | 'error' | 'pending'
}

export interface AccountingConnection {
    id: string
    system: string // 'Sage', 'Cegid', 'QuickBooks', etc.
    lastSync: Date
    status: 'connected' | 'error' | 'pending'
}

export interface Scenario {
    id: string
    name: string
    description: string
    parameters: {
        [key: string]: number
    }
    results: {
        cashFlow: CashFlowProjection[]
        kpis: FinancialMetric[]
    }
    createdAt: Date
}
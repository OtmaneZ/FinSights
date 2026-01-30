'use client'

/**
 * DASHIS Agent UI Wrapper
 * 
 * React component that wraps the autonomous DashisAgent backend.
 * Provides the same UI as FinancialDashboardV2 but powered by the new agent architecture.
 * 
 * Architecture:
 * - UI Layer (this file): React hooks, state management, event handlers
 * - Backend Layer: DashisAgent.ts (autonomous, testable, reusable)
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useActiveCompany } from '@/lib/companyContext'
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Clock,
    Download,
    Upload,
    FileText,
    Sparkles,
    AlertTriangle,
    Zap,
    Percent,
    Wallet,
    FolderOpen,
    Database
} from 'lucide-react'

// DASHIS Agent Backend (now in agent-DAF/agents)
import { DashisAgent } from '@agent/agents/dashis/backend/core/DashisAgent'
import type {
    FinancialRecord,
    FinancialData,
    KPI,
    ChartDataset,
    AnalysisResult,
    DashisState
} from '@agent/agents/dashis/backend/core/types'
import { 
    adaptMarginDataForChart, 
    adaptTopClientsForChart,
    adaptAnomaliesForUI 
} from '@agent/agents/dashis/backend/core/uiAdapters'

// Import UI Components
import { CashFlowEvolutionChart } from '@/components/charts/CashFlowEvolutionChart'
import { ExpenseBreakdownChart } from '@/components/charts/ExpenseBreakdownChart'
import { MarginEvolutionChart } from '@/components/charts/MarginEvolutionChart'
import { TopClientsVerticalChart } from '@/components/charts/TopClientsVerticalChart'

// Import Components (reuse existing)
import { BenchmarkBar } from '@/components/BenchmarkBar'
import EmptyDashboardStateV2 from '@/components/EmptyDashboardStateV2'
import FinSightScoreCard from '@/components/FinSightScoreCard'
import CashFlowPredictions from '@/components/CashFlowPredictions'
import { AnomalyPanel } from '@/components/AnomalyPanel'
import AICopilot from '@/components/AICopilot'

// Import Hooks
import { useTheme } from '@/lib/themeContext'
import { logger } from '@/lib/logger'

// Upload progress steps
type UploadStep = 'validating' | 'ai-parsing' | 'processing' | 'analyzing' | 'done'

export default function DashisAgentUI() {
    // ═══════════════════════════════════════════════════════════════════════════════
    // DASHIS AGENT BACKEND
    // ═══════════════════════════════════════════════════════════════════════════════
    
    const [agent] = useState(() => new DashisAgent({
        autoAnalyze: true,
        enableSimulations: true
    }))

    // ═══════════════════════════════════════════════════════════════════════════════
    // REACT STATE (UI only)
    // ═══════════════════════════════════════════════════════════════════════════════
    
    const [agentState, setAgentState] = useState<DashisState>('idle')
    const [financialData, setFinancialData] = useState<FinancialData | null>(null)
    const [kpis, setKpis] = useState<KPI[]>([])
    const [charts, setCharts] = useState<ChartDataset | null>(null)
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

    // Upload UI state
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStep, setUploadStep] = useState<UploadStep>('validating')
    const [uploadProgress, setUploadProgress] = useState(0)

    // Session & Context
    const { data: session } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { activeCompanyId } = useActiveCompany()
    const { theme } = useTheme()

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null)

    // ═══════════════════════════════════════════════════════════════════════════════
    // DATA UPLOAD HANDLER (defined early for useEffect)
    // ═══════════════════════════════════════════════════════════════════════════════

    const handleDataUpload = useCallback(async (rawRecords: FinancialRecord[]) => {
        try {
            logger.debug('[DashisAgentUI] 🚀 Processing with DASHIS Agent...', {
                recordCount: rawRecords.length
            })

            // STEP 1: Process data (validation, KPIs, charts)
            setAgentState('loading')
            const data = await agent.processData(rawRecords)
            
            // Update UI state from agent
            const state = agent.getState()
            setFinancialData(data)
            setKpis(state.kpis)
            setCharts(state.charts)
            setAgentState(state.current)

            logger.debug('[DashisAgentUI] ✅ Data processed', {
                kpiCount: state.kpis.length,
                chartCount: state.charts ? Object.keys(state.charts).length : 0
            })

            // STEP 2: Run AI/ML analysis (async, non-blocking)
            setUploadStep('analyzing')
            setAgentState('analyzing')

            const analysisResult = await agent.analyze(data)
            setAnalysis(analysisResult)
            setAgentState('ready')

            logger.debug('[DashisAgentUI] ✅ Analysis complete', {
                anomalies: analysisResult.anomalies.length,
                predictions: analysisResult.cashFlowPredictions.length,
                patterns: analysisResult.patterns.length,
                score: analysisResult.finSightScore?.total
            })

            setUploadStep('done')

        } catch (error) {
            logger.error('[DashisAgentUI] ❌ Processing failed:', error)
            setAgentState('error')
            throw error
        }
    }, [agent])

    // ═══════════════════════════════════════════════════════════════════════════════
    // DATA LOADING (from URL param or context)
    // ═══════════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        const loadData = async () => {
            if (!searchParams) return;
            
            const dataParam = searchParams.get('data')
            if (!dataParam) return

            try {
                const rawData = JSON.parse(decodeURIComponent(dataParam))
                await handleDataUpload(rawData)
            } catch (error) {
                logger.error('[DashisAgentUI] Failed to load data from URL:', error)
            }
        }

        loadData()
    }, [searchParams, handleDataUpload])

    // ═══════════════════════════════════════════════════════════════════════════════
    // FILE UPLOAD HANDLER
    // ═══════════════════════════════════════════════════════════════════════════════

    const handleFileUpload = async (files: FileList) => {
        if (!files || files.length === 0) return

        const file = files[0]
        setIsUploading(true)
        setUploadStep('validating')
        setUploadProgress(10)

        const reader = new FileReader()

        reader.onload = async (e) => {
            const fileContent = e.target?.result as string

            try {
                // STEP 1: Validating
                setUploadStep('validating')
                setUploadProgress(20)
                await new Promise(resolve => setTimeout(resolve, 300))

                // STEP 2: AI Parsing (call upload API)
                setUploadStep('ai-parsing')
                setUploadProgress(40)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileContent,
                        fileName: file.name,
                        fileType: file.type,
                        companyId: activeCompanyId
                    })
                })

                const result = await response.json()

                if (response.ok) {
                    // STEP 3: Processing with DASHIS Agent
                    setUploadStep('processing')
                    setUploadProgress(70)

                    const rawRecords: FinancialRecord[] = result.data.records || result.data.rawData || []
                    await handleDataUpload(rawRecords)

                    setUploadProgress(100)
                    await new Promise(resolve => setTimeout(resolve, 300))
                } else {
                    throw new Error(result.error || 'Upload failed')
                }
            } catch (error) {
                logger.error('[DashisAgentUI] Upload error:', error)
                alert(`Erreur: ${error instanceof Error ? error.message : 'Upload failed'}`)
            } finally {
                setIsUploading(false)
            }
        }

        reader.readAsText(file)
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // KPI ICON HELPER
    // ═══════════════════════════════════════════════════════════════════════════════

    const getKPIIcon = (title: string) => {
        if (title.includes('Chiffre') || title.includes('Affaires') || title.includes('CA')) {
            return <DollarSign className="w-6 h-6" />
        }
        if (title.includes('Marge')) {
            return <Percent className="w-6 h-6" />
        }
        if (title.includes('Cash') || title.includes('Trésorerie')) {
            return <Wallet className="w-6 h-6" />
        }
        if (title.includes('Charge')) {
            return <FileText className="w-6 h-6" />
        }
        if (title.includes('DSO') || title.includes('Délai')) {
            return <Clock className="w-6 h-6" />
        }
        return <TrendingUp className="w-6 h-6" />
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EMPTY STATE
    // ═══════════════════════════════════════════════════════════════════════════════

    if (agentState === 'idle' && !financialData) {
        return (
            <div className="min-h-screen bg-primary">
                <EmptyDashboardStateV2
                    onDemoLoad={(scenario) => {
                        // TODO: Charger les données de démo selon le scénario
                        console.log('Demo scenario:', scenario);
                    }}
                />
                
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
            </div>
        )
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // LOADING STATE
    // ═══════════════════════════════════════════════════════════════════════════════

    if (agentState === 'loading' || agentState === 'analyzing') {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-secondary text-lg mb-2">
                        {agentState === 'loading' ? '📊 Traitement des données...' : '🤖 Analyse IA en cours...'}
                    </p>
                    <p className="text-tertiary text-sm">
                        {uploadProgress}% - {uploadStep}
                    </p>
                </div>
            </div>
        )
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // DASHBOARD UI (Data Loaded)
    // ═══════════════════════════════════════════════════════════════════════════════

    return (
        <div className="min-h-screen bg-primary text-primary p-6">
            {/* Agent Status Badge */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                        agentState === 'ready' ? 'bg-green-500' :
                        (agentState === 'loading' as any) || (agentState === 'analyzing' as any) ? 'bg-yellow-500 animate-pulse' :
                        agentState === 'error' ? 'bg-red-500' :
                        'bg-gray-400'
                    }`} />
                    <span className="text-sm text-secondary">
                        DASHIS Agent: {agentState}
                    </span>
                </div>
                
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Nouveau fichier</span>
                </button>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {kpis.map((kpi) => (
                    <div
                        key={kpi.id}
                        className="bg-secondary border border-border-subtle rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary">
                                {getKPIIcon(kpi.title)}
                            </div>
                        </div>
                        <h3 className="text-sm text-secondary font-medium mb-1">{kpi.title}</h3>
                        <p className="text-2xl font-bold text-primary mb-1">{kpi.value}</p>
                        {kpi.change && (
                            <div className={`flex items-center gap-1 text-xs mt-2 ${
                                kpi.changeType === 'positive' ? 'text-green-600' :
                                kpi.changeType === 'negative' ? 'text-red-600' :
                                'text-gray-600'
                            }`}>
                                {kpi.changeType === 'positive' ? (
                                    <TrendingUp className="w-3 h-3" />
                                ) : kpi.changeType === 'negative' ? (
                                    <TrendingDown className="w-3 h-3" />
                                ) : null}
                                <span>{kpi.change}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* FinSight Score */}
            {analysis?.finSightScore && (
                <div className="mb-8">
                    <FinSightScoreCard score={analysis.finSightScore} />
                </div>
            )}

            {/* Charts Grid */}
            {charts && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Cash Flow Chart */}
                    {charts.monthlyData && charts.monthlyData.length > 0 && (
                        <div className="bg-secondary border border-border-subtle rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Évolution Cash Flow</h3>
                            <CashFlowEvolutionChart data={charts.monthlyData} />
                        </div>
                    )}

                    {/* Expense Breakdown */}
                    {charts.categoryBreakdown && charts.categoryBreakdown.length > 0 && (
                        <div className="bg-secondary border border-border-subtle rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Répartition des Charges</h3>
                            <ExpenseBreakdownChart data={charts.categoryBreakdown} />
                        </div>
                    )}

                    {/* Margin Evolution */}
                    {charts.marginData && charts.marginData.length > 0 && (
                        <div className="bg-secondary border border-border-subtle rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Évolution Marge</h3>
                            <MarginEvolutionChart data={adaptMarginDataForChart(charts.marginData)} />
                        </div>
                    )}

                    {/* Top Clients */}
                    {charts.topClients && charts.topClients.length > 0 && (
                        <div className="bg-secondary border border-border-subtle rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Top Clients</h3>
                            <TopClientsVerticalChart data={adaptTopClientsForChart(charts.topClients)} />
                        </div>
                    )}
                </div>
            )}

            {/* Cash Flow Predictions */}
            {analysis?.cashFlowPredictions && analysis.cashFlowPredictions.length > 0 && (
                <div className="mb-8">
                    <CashFlowPredictions
                        predictions={analysis.cashFlowPredictions}
                        alerts={analysis.predictionAlerts || []}
                        seasonalityDetected={analysis.seasonalityDetected}
                    />
                </div>
            )}

            {/* Anomalies Panel */}
            {analysis?.anomalies && analysis.anomalies.length > 0 && (
                <div className="mb-8">
                    <AnomalyPanel anomalies={adaptAnomaliesForUI(analysis.anomalies)} />
                </div>
            )}

            {/* AI Copilot */}
            {financialData && (
                <AICopilot />
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
        </div>
    )
}

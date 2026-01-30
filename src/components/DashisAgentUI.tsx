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
    // REACT STATE (UI only) - Compatible with API response format
    // ═══════════════════════════════════════════════════════════════════════════════
    
    const [agentState, setAgentState] = useState<DashisState>('idle')
    const [financialData, setFinancialData] = useState<any>(null)  // ProcessedData from API
    const [rawData, setRawData] = useState<FinancialRecord[]>([])  // Raw records for AI analysis
    const [kpis, setKpis] = useState<KPI[]>([])
    const [charts, setCharts] = useState<ChartDataset | null>(null)
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
    const [dashboardConfig, setDashboardConfig] = useState<any>(null)  // Capabilities

    // DASHIS Agent for optional AI/ML analysis
    const [agent] = useState(() => new DashisAgent({
        autoAnalyze: true,
        enableSimulations: true
    }))

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
    // PROCESS API RESPONSE (used by both file upload and demo load)
    // ═══════════════════════════════════════════════════════════════════════════════

    const processApiResponse = useCallback(async (result: any) => {
        // Extract data from API response (same structure as FinancialDashboardV2)
        const records = result.data.records || result.data.rawData || [];
        const apiKpis = result.data.kpis || [];
        const processedData = result.data.financialData || result.data.processedData;
        const capabilities = result.data.dashboardConfig;

        if (!records || records.length === 0) {
            throw new Error('Aucune transaction détectée. Vérifiez le format: Date, Montant, Type');
        }

        // Update state with API data
        setRawData(records);
        setFinancialData(processedData);
        setDashboardConfig(capabilities);
        
        // Convert API KPIs to our format
        const formattedKpis: KPI[] = apiKpis.map((kpi: any, index: number) => ({
            id: `kpi-${index}`,
            title: kpi.title,
            value: kpi.value,
            change: kpi.change || '',
            changeType: kpi.changeType || 'neutral',
            description: kpi.description || '',
            isAvailable: kpi.isAvailable !== false,
            confidence: kpi.confidence
        }));
        setKpis(formattedKpis);

        // Generate chart data from records
        const chartData = generateChartsFromRecords(records);
        setCharts(chartData);

        setAgentState('ready');
        
        logger.debug('[DashisAgentUI] ✅ API data processed', {
            recordCount: records.length,
            kpiCount: formattedKpis.length
        });

        // Optional: Run DASHIS Agent analysis in background (non-blocking)
        try {
            setUploadStep('analyzing');
            setAgentState('analyzing');
            
            // Process with agent for AI/ML analysis
            const agentData = await agent.processData(records);
            const analysisResult = await agent.analyze(agentData);
            setAnalysis(analysisResult);
            
            logger.debug('[DashisAgentUI] ✅ AI/ML analysis complete');
        } catch (analysisError) {
            // Non-blocking - continue even if analysis fails
            logger.warn('[DashisAgentUI] ⚠️ AI/ML analysis skipped:', analysisError);
        }
        
        setAgentState('ready');
        setUploadStep('done');
    }, [agent]);

    // ═══════════════════════════════════════════════════════════════════════════════
    // GENERATE CHARTS FROM RECORDS (helper function)
    // ═══════════════════════════════════════════════════════════════════════════════

    const generateChartsFromRecords = (records: FinancialRecord[]): ChartDataset => {
        // Group by month for cash flow evolution
        const monthlyData: { [key: string]: { income: number; expense: number } } = {};
        const categoryData: { [key: string]: number } = {};
        const clientData: { [key: string]: number } = {};

        records.forEach(record => {
            const date = new Date(record.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expense: 0 };
            }
            
            if (record.type === 'income') {
                monthlyData[monthKey].income += record.amount;
                // Track clients
                const client = record.counterparty || record.description || 'Inconnu';
                clientData[client] = (clientData[client] || 0) + record.amount;
            } else {
                monthlyData[monthKey].expense += record.amount;
                // Track categories
                const category = record.category || 'Autres';
                categoryData[category] = (categoryData[category] || 0) + record.amount;
            }
        });

        // Calculate totals for percentages
        const totalExpenses = Object.values(categoryData).reduce((a, b) => a + b, 0);
        const totalRevenue = Object.values(clientData).reduce((a, b) => a + b, 0);

        // Format monthly data
        const sortedMonths = Object.keys(monthlyData).sort();
        const formattedMonthlyData = sortedMonths.map(month => {
            const data = monthlyData[month];
            return {
                month,
                revenue: data.income,
                expenses: data.expense,
                cashFlow: data.income - data.expense
            };
        });

        // Format category breakdown with percentage
        const categoryBreakdown = Object.entries(categoryData)
            .map(([name, value]) => ({ 
                name, 
                value, 
                percentage: totalExpenses > 0 ? `${((value / totalExpenses) * 100).toFixed(1)}%` : '0%'
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        // Format top clients with percentage
        const topClients = Object.entries(clientData)
            .map(([name, revenue]) => ({ 
                name, 
                revenue, 
                percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Format margin data (monthly)
        const marginData = formattedMonthlyData.map(m => ({
            month: m.month,
            revenue: m.revenue,
            expenses: m.expenses,
            margin: m.revenue - m.expenses,
            marginPercent: m.revenue > 0 ? ((m.revenue - m.expenses) / m.revenue * 100) : 0
        }));

        return {
            monthlyData: formattedMonthlyData,
            categoryBreakdown,
            topClients,
            marginData,
            outstandingInvoices: [],
            paymentStatus: [],
            sankeyData: { nodes: [], links: [] },
            sunburstData: { name: 'root', children: [] }
        };
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // DATA LOADING (from URL param or context)
    // ═══════════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        const loadData = async () => {
            if (!searchParams) return;
            
            const dataParam = searchParams.get('data')
            if (!dataParam) return

            try {
                const data = JSON.parse(decodeURIComponent(dataParam))
                // Wrap in API-like response format
                await processApiResponse({ data: { records: data } });
            } catch (error) {
                logger.error('[DashisAgentUI] Failed to load data from URL:', error)
            }
        }

        loadData()
    }, [searchParams, processApiResponse])

    // ═══════════════════════════════════════════════════════════════════════════════
    // LISTEN FOR FILE UPLOAD EVENT FROM EmptyDashboardStateV2
    // ═══════════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        const handleFileSelected = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail) {
                handleFileUpload(customEvent.detail as FileList);
            }
        };

        window.addEventListener('fileUpload', handleFileSelected);
        return () => window.removeEventListener('fileUpload', handleFileSelected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ═══════════════════════════════════════════════════════════════════════════════
    // FILE UPLOAD HANDLER
    // ═══════════════════════════════════════════════════════════════════════════════

    const handleFileUpload = async (files: FileList) => {
        if (!files || files.length === 0) return

        const file = files[0]
        setIsUploading(true)
        setAgentState('loading')
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

                // STEP 2: AI Parsing (call upload API - same as FinancialDashboardV2)
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

                if (!response.ok) {
                    // Handle API errors
                    const errorMessage = result.details 
                        ? `${result.error}\n${result.details}`
                        : result.error || 'Upload failed'
                    throw new Error(errorMessage)
                }

                // STEP 3: Process API response
                setUploadStep('processing')
                setUploadProgress(70)

                await processApiResponse(result);

                setUploadProgress(100)
                await new Promise(resolve => setTimeout(resolve, 300))
            } catch (error) {
                logger.error('[DashisAgentUI] Upload error:', error)
                setAgentState('error')
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
    // DEMO SCENARIO LOADER
    // ═══════════════════════════════════════════════════════════════════════════════

    const loadDemoScenario = useCallback(async (scenario: 'saine' | 'difficulte' | 'croissance') => {
        const scenarioConfig = {
            saine: {
                file: '/demo-scaleup-hypercroissance.csv',
                name: 'Scale-up Hypercroissance'
            },
            difficulte: {
                file: '/demo-startup-difficulte.csv',
                name: 'Startup SaaS'
            },
            croissance: {
                file: '/demo-pme-saisonnalite.csv',
                name: 'PME Saisonnière'
            }
        };

        const config = scenarioConfig[scenario];
        
        setIsUploading(true);
        setUploadStep('validating');
        setUploadProgress(10);

        try {
            // Fetch the demo CSV file
            setUploadStep('validating');
            setUploadProgress(20);
            
            const response = await fetch(config.file);
            if (!response.ok) {
                throw new Error(`Failed to load demo file: ${config.file}`);
            }
            
            const fileContent = await response.text();
            
            // Call upload API (same as file upload)
            setUploadStep('ai-parsing');
            setUploadProgress(40);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileContent,
                    fileName: config.file.split('/').pop(),
                    fileType: 'text/csv',
                    companyId: activeCompanyId,
                    isDemo: true // Skip AI parsing for demos
                })
            });

            const result = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            // Process API response (same as file upload)
            setUploadStep('processing');
            setUploadProgress(70);

            await processApiResponse(result);

            setUploadProgress(100);
            
            logger.debug(`[DashisAgentUI] ✅ Demo loaded: ${config.name}`);
        } catch (error) {
            logger.error('[DashisAgentUI] Demo load error:', error);
            setAgentState('error');
            alert(`Erreur: ${error instanceof Error ? error.message : 'Failed to load demo'}`);
        } finally {
            setIsUploading(false);
        }
    }, [activeCompanyId, processApiResponse]);

    // ═══════════════════════════════════════════════════════════════════════════════
    // EMPTY STATE
    // ═══════════════════════════════════════════════════════════════════════════════

    if (agentState === 'idle' && !financialData) {
        return (
            <div className="min-h-screen bg-primary">
                <EmptyDashboardStateV2
                    onDemoLoad={loadDemoScenario}
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

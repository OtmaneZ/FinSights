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
    Database,
    RotateCcw
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
import { AlertsPanel } from '@/components/AlertsPanel'
import SaaSMetricsSection from '@/components/SaaSMetricsSection'
import { calculateSaaSMetrics } from '@/lib/saasMetrics'
import UploadSuccessBannerDashis from '@/components/UploadSuccessBannerDashis'
import BenchmarkSection from '@/components/BenchmarkSection'
import KPICardEnriched from '@/components/KPICardEnriched'
import ConsultingBannerDashis from '@/components/ConsultingBannerDashis'
import AdvancedPatternsInsights from '@/components/AdvancedPatternsInsights'
import SkeletonLoader from '@/components/SkeletonLoader'

// Import Hooks
import { useTheme } from '@/lib/themeContext'
import { logger } from '@/lib/logger'

// Import PDF Exporter
import { FinancialPDFExporter } from '@/lib/pdfExporter'

// Import Premium CSS
import '@/styles/premium-transitions.css'

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
    
    // Export state
    const [isExporting, setIsExporting] = useState(false)
    
    // Upload Success Banner state
    const [showSuccessBanner, setShowSuccessBanner] = useState(false)
    const [uploadStats, setUploadStats] = useState<{ transactionCount: number; processingTime: number } | null>(null)

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
        // Extract data from API response
        // API returns: { data: [...records], financialData: {...}, kpis: [...] }
        const records = result.data || result.rawData || [];
        const apiKpis = result.kpis || [];
        const processedData = result.financialData || result.processedData;
        const capabilities = result.capabilities || result.dashboardConfig;

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
        // DEBUG: Log first 3 records to see data structure
        logger.debug('[DashisAgentUI] Sample records:', records.slice(0, 3));
        
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

        // DEBUG: Log aggregated data
        logger.debug('[DashisAgentUI] Chart data summary:', {
            monthsCount: sortedMonths.length,
            months: sortedMonths,
            categoriesCount: Object.keys(categoryData).length,
            clientsCount: Object.keys(clientData).length,
            totalRevenue,
            totalExpenses,
            topClientsPreview: topClients.slice(0, 3)
        });

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
    // RESET HANDLER
    // ═══════════════════════════════════════════════════════════════════════════════

    const handleReset = useCallback(() => {
        if (confirm('Réinitialiser le dashboard et charger une nouvelle analyse ?')) {
            setFinancialData(null);
            setRawData([]);
            setKpis([]);
            setCharts(null);
            setAnalysis(null);
            setDashboardConfig(null);
            setAgentState('idle');
            setUploadStep('validating');
            setUploadProgress(0);
            logger.debug('[DashisAgentUI] Dashboard reset');
        }
    }, []);

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORT PDF
    // ═══════════════════════════════════════════════════════════════════════════════

    const exportToPDF = async () => {
        if (kpis.length === 0 || !financialData) return;

        setIsExporting(true);
        try {
            const exporter = new FinancialPDFExporter();

            const pdfOptions = {
                companyName: 'Entreprise (Démo)',
                reportPeriod: {
                    start: rawData && rawData.length > 0
                        ? new Date(Math.min(...rawData.map((r: any) => new Date(r.date).getTime())))
                        : new Date(),
                    end: rawData && rawData.length > 0
                        ? new Date(Math.max(...rawData.map((r: any) => new Date(r.date).getTime())))
                        : new Date()
                },
                kpis: kpis.map(kpi => ({
                    title: kpi.title,
                    value: kpi.value,
                    change: kpi.change,
                    description: kpi.description
                })),
                includeCharts: true,
                includeMethodology: true,
                confidential: true,
                userPlan: session?.user?.plan || 'FREE'
            };

            await exporter.generate(pdfOptions);

            const filename = `rapport-financier-dashis-${new Date().toISOString().split('T')[0]}.pdf`;
            exporter.download(filename);

            logger.debug('[DashisAgentUI] PDF exported successfully');
        } catch (error) {
            logger.error('[DashisAgentUI] Erreur export PDF:', error);
            alert('Erreur lors de l\'export PDF. Réessayez.');
        }
        setIsExporting(false);
    };

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
        const startTime = Date.now(); // Track processing time
        
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
                
                // Calculate processing time and show success banner
                const processingTime = Math.round((Date.now() - startTime) / 1000);
                const transactionCount = result.data?.length || result.rawData?.length || 0;
                
                setUploadStats({ transactionCount, processingTime });
                setShowSuccessBanner(true);
                
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
        setAgentState('loading');

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
            setUploadProgress(35);

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
            setUploadProgress(65);

            await processApiResponse(result);

            setUploadStep('analyzing');
            setUploadProgress(85);

            // Run AI analysis (agent.state.data est déjà défini par processApiResponse)
            await agent.analyze();
            const analysisResult = agent.getAnalysis();
            setAnalysis(analysisResult);

            setUploadProgress(100);
            setAgentState('ready');
            
            logger.debug(`[DashisAgentUI] ✅ Demo loaded: ${config.name}`);
        } catch (error) {
            logger.error('[DashisAgentUI] Demo load error:', error);
            setAgentState('error');
            alert(`Erreur: ${error instanceof Error ? error.message : 'Failed to load demo'}`);
        } finally {
            setIsUploading(false);
        }
    }, [activeCompanyId, processApiResponse, agent]);

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

    if (agentState === 'loading' || agentState === 'analyzing' || isUploading) {
        const steps = [
            { key: 'validating', label: 'Validation', description: 'Vérification de la structure et des colonnes', progress: 20 },
            { key: 'ai-parsing', label: 'Analyse IA en cours', description: 'Parsing intelligent de vos données financières', progress: 40 },
            { key: 'processing', label: 'Génération des KPIs', description: 'Calcul des métriques et du Score FinSight™', progress: 70 },
            { key: 'analyzing', label: 'Analyse avancée', description: 'Détection des signaux faibles et tendances', progress: 90 },
            { key: 'done', label: 'Finalisation', description: 'Préparation de votre dashboard', progress: 100 }
        ];

        const currentStepIndex = steps.findIndex(s => s.key === uploadStep);
        const displayProgress = Math.max(uploadProgress, currentStepIndex >= 0 ? steps[currentStepIndex].progress : 0);
        const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : steps[0];

        return (
            <div className="min-h-screen bg-primary flex items-center justify-center p-6">
                <div className="text-center max-w-md w-full">
                    {/* Spinner animé */}
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-accent-primary-border rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    
                    {/* Message principal */}
                    <h3 className="text-2xl font-bold text-primary mb-2">
                        {currentStep.label}
                    </h3>
                    <p className="text-sm text-secondary mb-6">
                        {currentStep.description}
                    </p>
                    
                    {/* Progress Bar Premium */}
                    <div className="mb-8">
                        <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-accent-primary to-accent-primary-hover rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${displayProgress}%` }}
                            />
                        </div>
                        <p className="text-tertiary text-sm mt-3 font-medium">{displayProgress}% complété</p>
                    </div>

                    {/* Steps avec affichage progressif */}
                    <div className="space-y-3 mb-6">
                        {steps.map((step, idx) => {
                            const isCompleted = idx < currentStepIndex;
                            const isCurrent = idx === currentStepIndex;
                            const isPending = idx > currentStepIndex;

                            return (
                                <div
                                    key={step.key}
                                    className={`text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                                        isCompleted
                                            ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
                                            : isCurrent
                                            ? 'bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 shadow-md'
                                            : 'bg-surface-elevated border border-border-subtle opacity-40'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Icône de statut */}
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                            isCompleted
                                                ? 'bg-green-500'
                                                : isCurrent
                                                ? 'bg-blue-500 animate-pulse'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                        }`}>
                                            {isCompleted ? (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : isCurrent ? (
                                                <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                                            )}
                                        </div>
                                        
                                        {/* Label */}
                                        <span className={`text-sm font-medium ${
                                            isCompleted
                                                ? 'text-green-700 dark:text-green-400'
                                                : isCurrent
                                                ? 'text-blue-700 dark:text-blue-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-tertiary text-xs">Cela prend généralement 10-20 secondes...</p>
                </div>
            </div>
        )
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // RESET FUNCTION
    // ═══════════════════════════════════════════════════════════════════════════════

    // (handleReset is already defined above)

    // ═══════════════════════════════════════════════════════════════════════════════
    // DASHBOARD UI (Data Loaded)
    // ═══════════════════════════════════════════════════════════════════════════════

    return (
        <div className="min-h-screen bg-primary text-primary p-6">
            {/* Header Actions */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                        agentState === 'ready' ? 'bg-green-500' :
                        (agentState === 'loading' as any) || (agentState === 'analyzing' as any) ? 'bg-yellow-500 animate-pulse' :
                        agentState === 'error' ? 'bg-red-500' :
                        'bg-gray-400'
                    }`} />
                    <span className="text-sm text-secondary font-medium">
                        DASHIS Agent: {agentState}
                    </span>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Export PDF Button */}
                    {kpis.length > 0 && (
                        <button
                            onClick={exportToPDF}
                            disabled={isExporting}
                            className="premium-button flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Exporter en PDF"
                        >
                            <Download className="premium-icon w-4 h-4" />
                            <span className="text-sm">{isExporting ? 'Export...' : 'Export PDF'}</span>
                        </button>
                    )}
                    
                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        className="premium-button flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-tertiary hover:text-primary text-sm font-medium"
                        title="Réinitialiser le dashboard"
                    >
                        <RotateCcw className="premium-icon w-4 h-4" />
                        <span className="hidden sm:inline">Réinitialiser</span>
                    </button>
                    
                    {/* Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="premium-button flex items-center gap-2 px-4 py-2.5 bg-accent-primary text-white rounded-xl hover:bg-accent-primary-hover shadow-lg shadow-accent-primary/25 font-semibold"
                    >
                        <Upload className="premium-icon w-4 h-4" />
                        <span className="text-sm">Nouveau fichier</span>
                    </button>
                </div>
            </div>

            {/* Upload Success Banner */}
            {showSuccessBanner && uploadStats && (
                <UploadSuccessBannerDashis
                    transactionCount={uploadStats.transactionCount}
                    processingTime={uploadStats.processingTime}
                    onDismiss={() => setShowSuccessBanner(false)}
                    onExport={exportToPDF}
                />
            )}

            {/* KPIs Section */}
            {kpis.length > 0 && (
                <div className="mb-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-accent-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary">📊 Indicateurs Clés</h3>
                            <p className="text-sm text-tertiary">Métriques financières essentielles</p>
                        </div>
                    </div>

                    {/* KPIs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {kpis.map((kpi) => (
                            <KPICardEnriched
                                key={kpi.id}
                                title={kpi.title}
                                value={kpi.value}
                                change={kpi.change}
                                changeType={kpi.changeType}
                                description={kpi.description}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Skeleton Loaders */}
            {kpis.length === 0 && rawData && rawData.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-5 bg-slate-200 rounded w-48 animate-pulse"></div>
                            <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <SkeletonLoader variant="kpi" count={5} />
                    </div>
                </div>
            )}

            {/* FinSight Score */}
            {analysis?.finSightScore && (
                <div className="mb-8">
                    <FinSightScoreCard score={analysis.finSightScore} />
                </div>
            )}

            {/* Benchmarks Sectoriels */}
            {financialData && analysis?.finSightScore && (
                <BenchmarkSection
                    margeNette={financialData.netMargin || analysis.finSightScore.breakdown.margin || 0}
                    dso={financialData.dso || 30}
                    bfr={financialData.bfr ? (financialData.bfr / financialData.totalRevenue * 100) : 5}
                    sector="saas"
                />
            )}

            {/* SaaS Metrics Section */}
            {financialData && rawData && rawData.length > 0 && (
                <div className="mb-8">
                    {(() => {
                        // Calculate totals
                        const totalRevenue = financialData.totalRevenue || 0;
                        const totalExpenses = financialData.totalExpenses || 0;
                        const cashFlow = totalRevenue - totalExpenses;
                        
                        const saasMetrics = calculateSaaSMetrics(rawData, totalRevenue, totalExpenses, cashFlow);
                        return saasMetrics ? (
                            <SaaSMetricsSection metrics={saasMetrics} />
                        ) : null;
                    })()}
                </div>
            )}

            {/* Alerts Panel - Signaux Faibles & Recommandations */}
            {analysis?.finSightScore && (
                <div className="mb-8">
                    <AlertsPanel 
                        dso={financialData?.dso || 0}
                        cashFlow={financialData?.cashFlowNet || 0}
                        netMargin={analysis.finSightScore?.breakdown?.margin || 0}
                        grossMargin={financialData?.grossMargin || 0}
                        bfr={financialData?.bfr || 0}
                    />
                </div>
            )}

            {/* Charts Grid */}
            {charts && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Cash Flow Chart */}
                    {charts.monthlyData && charts.monthlyData.length > 0 && (
                        <div className="premium-card bg-secondary border border-border-subtle rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Évolution Cash Flow</h3>
                            <CashFlowEvolutionChart data={charts.monthlyData} />
                        </div>
                    )}

                    {/* Expense Breakdown */}
                    {charts.categoryBreakdown && charts.categoryBreakdown.length > 0 && (
                        <div className="premium-card bg-secondary border border-border-subtle rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Répartition des Charges</h3>
                            <ExpenseBreakdownChart data={charts.categoryBreakdown} />
                        </div>
                    )}

                    {/* Margin Evolution */}
                    {charts.marginData && charts.marginData.length > 0 && (
                        <div className="premium-card bg-secondary border border-border-subtle rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Évolution Marge</h3>
                            <MarginEvolutionChart data={adaptMarginDataForChart(charts.marginData)} />
                        </div>
                    )}

                    {/* Top Clients */}
                    {charts.topClients && charts.topClients.length > 0 && (
                        <div className="premium-card bg-secondary border border-border-subtle rounded-xl p-6">
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

            {/* Advanced Patterns Insights - Tendances IA */}
            {analysis && (
                <AdvancedPatternsInsights
                    seasonalityDetected={analysis.seasonalityDetected}
                    patterns={analysis.patterns}
                />
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

            {/* Consulting Banner - CTA final */}
            <ConsultingBannerDashis />

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

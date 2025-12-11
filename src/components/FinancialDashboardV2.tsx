'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFinancialData } from '@/lib/financialContext'
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

// Import Charts
import { CashFlowEvolutionChart } from './charts/CashFlowEvolutionChart'
import { ExpenseBreakdownChart } from './charts/ExpenseBreakdownChart'
import { MarginEvolutionChart } from './charts/MarginEvolutionChart'
import { TopClientsVerticalChart } from './charts/TopClientsVerticalChart'
import { OutstandingInvoicesChart } from './charts/OutstandingInvoicesChart'
import { PaymentStatusChart } from './charts/PaymentStatusChart'

// Import D3 Advanced Charts
import { SankeyFlowChart } from './charts/SankeyFlowChart'
import { SunburstExpensesChart } from './charts/SunburstExpensesChart'

// Import Components
import { BenchmarkBar } from './BenchmarkBar'
import { AlertsPanel } from './AlertsPanel'
import { CompanyInfoModal, CompanySector } from './CompanyInfoModal'
import { DataPreviewPanel } from './DataPreviewPanel'
import { AnomalyPanel } from './AnomalyPanel'
import CommandPalette from './CommandPalette'

// Import AI Copilot
import AICopilot from './AICopilot'

// Import Empty State V2
import EmptyDashboardStateV2 from './EmptyDashboardStateV2'

// Import Score FinSight™
import FinSightScoreCard from './FinSightScoreCard'

// Import Consulting Banner
import ConsultingBanner from './dashboard/ConsultingBanner'

// Import Auth Banner
import AuthBanner from './AuthBanner'

// Import Upload Success Banner
import UploadSuccessBanner from './UploadSuccessBanner'

// Import Cash Flow Predictions
import CashFlowPredictions from './CashFlowPredictions'

// Import Drill-Down
import { useDrilldown } from '@/hooks/useDrilldown'
import { KPIDrilldownModal } from './drill-down/KPIDrilldownModal'

// Import ML
import { detectAnomalies } from '@/lib/ml/anomalyDetector'
import type { Anomaly } from '@/lib/ml/types'

// Import AI Predictions
import { generateCashFlowPredictions, type CashFlowPrediction, type PredictionAlert } from '@/lib/ai/predictions'

// Import AI Patterns
import { detectAdvancedPatterns, type AdvancedPattern } from '@/lib/ai/patterns'

// Import Score FinSight™ calculation
import { calculateFinSightScore, type FinSightScore } from '@/lib/scoring/finSightScore'

// Import Hooks
import { useKeyboard } from '@/lib/useKeyboard'
import { useTheme } from '@/lib/themeContext'
import { useRealtimeSync } from '@/lib/realtime/useRealtimeSync'

// Import Real-Time Components
import PresenceIndicator from './realtime/PresenceIndicator'
// import CursorTracker from './realtime/CursorTracker' // Disabled to reduce Pusher message consumption
import RealtimeToast, { ToastNotification } from './realtime/RealtimeToast'

// Import Alert Settings
import AlertSettings from './AlertSettings'

// Import Exporters
import { FinancialPDFExporter } from '@/lib/pdfExporter'
import { FinancialExcelExporter } from '@/lib/excelExporter'
import { logger } from '@/lib/logger';

interface KPI {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    description: string
    isAvailable?: boolean  // ✅ Flag pour masquer les KPIs sans données valides
    missingData?: string   // Raison si données manquantes
    confidence?: number    // Score de confiance (0-1)
}

export default function FinancialDashboardV2() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { finSightData, setFinSightData, rawData, setRawData, isDataLoaded, setIsDataLoaded } = useFinancialData();
    const { activeCompanyId } = useActiveCompany();
    const [kpis, setKpis] = useState<KPI[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Loading saved dashboard state
    const [loadingSavedDashboard, setLoadingSavedDashboard] = useState(false);
    const [loadedDashboardId, setLoadedDashboardId] = useState<string | null>(null);

    // Company Info states
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [companySector, setCompanySector] = useState<CompanySector>('services');

    // Drill-down state
    const [drillDownState, drillDownActions] = useDrilldown();

    // ML Anomaly Detection states
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [showAnomalies, setShowAnomalies] = useState(false);

    // AI Patterns states
    const [aiPatterns, setAIPatterns] = useState<AdvancedPattern[]>([]);
    const [isLoadingPatterns, setIsLoadingPatterns] = useState(false);

    // Score FinSight™ state
    const [finSightScore, setFinSightScore] = useState<FinSightScore | null>(null);

    // Command Palette state
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    // Real-Time states
    const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);

    // Alert Settings state
    const [showAlertSettings, setShowAlertSettings] = useState(false);

    // Upload Success Banner state
    const [showUploadBanner, setShowUploadBanner] = useState(false);

    // What-If Simulation states
    const [showSimulation, setShowSimulation] = useState(false);
    const [chargesReduction, setChargesReduction] = useState(0); // 0 à 30%
    const [paiementsAcceleration, setPaiementsAcceleration] = useState(0); // 0 à 15 jours
    const [prixAugmentation, setPrixAugmentation] = useState(0); // 0 à 15%
    const [simulatedKPIs, setSimulatedKPIs] = useState<KPI[]>([]);

    // Demo Loading states
    const [isLoadingDemo, setIsLoadingDemo] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');

    // Upload Loading state - Granular steps
    type UploadStep = 'idle' | 'validating' | 'ai-parsing' | 'processing' | 'done';
    const [uploadStep, setUploadStep] = useState<UploadStep>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);

    // Backward compatibility helper
    const isUploadingFile = uploadStep !== 'idle' && uploadStep !== 'done';

    // Dashboard Config state (capabilities pour affichage conditionnel)
    const [dashboardConfig, setDashboardConfig] = useState<any>(null);

    // AI Predictions states
    const [cashFlowPredictions, setCashFlowPredictions] = useState<CashFlowPrediction[]>([]);
    const [predictionAlerts, setPredictionAlerts] = useState<PredictionAlert[]>([]);
    const [seasonalityDetected, setSeasonalityDetected] = useState(false);
    const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

    // 🔔 Toast notifications - Défini tôt pour être accessible partout
    const addToast = (toast: Omit<ToastNotification, 'id'>) => {
        const newToast = { ...toast, id: Date.now().toString() };
        logger.debug('🔔 Adding toast:', newToast);
        setToastNotifications(prev => [...prev, newToast]);
    };

    // �🔧 Fonctions de préparation des données pour les charts

    const getMonthlyData = () => {
        // 🆕 Si données démo pré-calculées disponibles, les utiliser
        if (typeof window !== 'undefined' && (window as any).__demoChartData?.cashFlowEvolution) {
            return (window as any).__demoChartData.cashFlowEvolution;
        }

        // Sinon, calcul automatique
        if (!rawData || rawData.length === 0) return [];

        const monthlyStats = rawData.reduce((acc: any, record: any) => {
            const month = new Date(record.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
            if (!acc[month]) {
                acc[month] = { month, revenue: 0, expenses: 0 };
            }

            if (record.type === 'income') {
                acc[month].revenue += record.amount;
            } else {
                acc[month].expenses += record.amount;
            }

            return acc;
        }, {});

        return Object.values(monthlyStats).map((m: any) => ({
            ...m,
            cashFlow: m.revenue - m.expenses
        }));
    };

    const getCategoryBreakdown = () => {
        // 🆕 Si données démo pré-calculées disponibles, les utiliser
        if (typeof window !== 'undefined' && (window as any).__demoChartData?.categoryBreakdown) {
            return (window as any).__demoChartData.categoryBreakdown;
        }

        // Sinon, calcul automatique
        if (!rawData || rawData.length === 0) return [];

        const expenses = rawData.filter((r: any) => r.type === 'expense');
        if (expenses.length === 0) return [];

        const categoryTotals = expenses.reduce((acc: any, r: any) => {
            const cat = r.category || 'Autres';
            acc[cat] = (acc[cat] || 0) + r.amount;
            return acc;
        }, {});

        const total = expenses.reduce((sum: number, r: any) => sum + r.amount, 0);

        const allCategories = Object.entries(categoryTotals)
            .map(([name, value]: [string, any]) => ({
                name,
                value,
                percentage: ((value / total) * 100).toFixed(1)
            }))
            .sort((a, b) => b.value - a.value);

        // Regrouper les catégories < 3% en "Autres"
        const threshold = 3.0;
        const majorCategories = allCategories.filter(cat => parseFloat(cat.percentage) >= threshold);
        const minorCategories = allCategories.filter(cat => parseFloat(cat.percentage) < threshold);

        if (minorCategories.length > 0) {
            const othersValue = minorCategories.reduce((sum, cat) => sum + cat.value, 0);
            const othersPercentage = ((othersValue / total) * 100).toFixed(1);

            majorCategories.push({
                name: 'Autres',
                value: othersValue,
                percentage: othersPercentage
            });
        }

        return majorCategories;
    };

    const getMarginData = () => {
        // 🆕 Si données démo pré-calculées disponibles, les utiliser
        if (typeof window !== 'undefined' && (window as any).__demoChartData?.marginEvolution) {
            return (window as any).__demoChartData.marginEvolution;
        }

        // Sinon, calcul automatique
        if (!rawData || rawData.length === 0) return [];

        const monthlyStats = rawData.reduce((acc: any, record: any) => {
            const month = new Date(record.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
            if (!acc[month]) {
                acc[month] = { month, revenue: 0, expenses: 0 };
            }

            if (record.type === 'income') {
                acc[month].revenue += record.amount;
            } else {
                acc[month].expenses += record.amount;
            }

            return acc;
        }, {});

        return Object.values(monthlyStats).map((m: any) => ({
            month: m.month,
            marginPercentage: m.revenue > 0 ? ((m.revenue - m.expenses) / m.revenue) * 100 : 0
        }));
    };

    const getTopClients = () => {
        // 🆕 Si données démo pré-calculées disponibles, les utiliser
        if (typeof window !== 'undefined' && (window as any).__demoChartData?.topClients) {
            return (window as any).__demoChartData.topClients;
        }

        // Sinon, calcul automatique
        if (!rawData || !rawData.length) return [];

        const clientTotals = rawData
            .filter((record: any) => record.type === 'income')
            .reduce((acc: any, record: any) => {
                const client = record.counterparty || record.description || 'Client inconnu';
                if (!acc[client]) {
                    acc[client] = { name: client, total: 0, count: 0 };
                }
                acc[client].total += record.amount;
                acc[client].count += 1;
                return acc;
            }, {});

        return Object.values(clientTotals)
            .sort((a: any, b: any) => b.total - a.total)
            .slice(0, 5)
            .map((client: any) => ({
                name: client.name,
                value: client.total
            }));
    };

    // 🎨 Sankey Data - Revenus → Charges → Cash Flow
    const getSankeyData = () => {
        // 🆕 Utiliser les données JSON pré-calculées pour les démos
        if (typeof window !== 'undefined' && (window as any).__demoChartData?.sankeyFlow) {
            const sankey = (window as any).__demoChartData.sankeyFlow;
            const nodes = [
                { name: 'Revenus' },
                { name: 'Charges' },
                { name: 'Cash Flow Net' }
            ];

            const links = [
                { source: 0, target: 1, value: sankey.totalExpenses },
                { source: 0, target: 2, value: Math.max(0, sankey.cashFlowNet) }
            ];

            return { nodes, links };
        }

        // Sinon, calcul depuis rawData
        if (!rawData || rawData.length === 0) return { nodes: [], links: [] };

        const totalRevenue = rawData
            .filter((r: any) => r.type === 'income')
            .reduce((sum: number, r: any) => sum + r.amount, 0);

        const totalExpenses = rawData
            .filter((r: any) => r.type === 'expense')
            .reduce((sum: number, r: any) => sum + r.amount, 0);

        const cashFlow = totalRevenue - totalExpenses;

        const nodes = [
            { name: 'Revenus' },
            { name: 'Charges' },
            { name: 'Cash Flow Net' }
        ];

        const links = [
            { source: 0, target: 1, value: totalExpenses },
            { source: 0, target: 2, value: Math.max(0, cashFlow) }
        ];

        return { nodes, links };
    };

    // 🎨 Sunburst Data - Structure hiérarchique expenses
    const getSunburstData = () => {
        if (!rawData || rawData.length === 0) {
            return { name: 'Dépenses', children: [] };
        }

        const expenses = rawData.filter((r: any) => r.type === 'expense');
        if (expenses.length === 0) {
            return { name: 'Dépenses', children: [] };
        }

        const categoryMap = expenses.reduce((acc: any, r: any) => {
            const category = r.category || 'Autres';
            const subcategory = r.subcategory || r.description || 'Divers';

            if (!acc[category]) {
                acc[category] = {};
            }

            if (!acc[category][subcategory]) {
                acc[category][subcategory] = 0;
            }

            acc[category][subcategory] += r.amount;

            return acc;
        }, {});

        const children = Object.entries(categoryMap).map(([categoryName, subcategories]: [string, any]) => {
            const categoryChildren = Object.entries(subcategories).map(([subcategoryName, value]: [string, any]) => ({
                name: subcategoryName,
                value
            }));

            return {
                name: categoryName,
                children: categoryChildren
            };
        });

        return {
            name: 'Dépenses',
            children
        };
    };

    // 🔮 Calcul des KPIs simulés (What-If simulations en temps réel)
    const calculateSimulatedKPIs = () => {
        if (!isDataLoaded || kpis.length === 0 || !rawData) return;

        // Extraire valeurs actuelles
        const caKPI = kpis.find(k => k.title.includes('Chiffre d\'Affaires') || k.title.includes('CA'));
        const chargesKPI = kpis.find(k => k.title.includes('Charges'));
        const margeKPI = kpis.find(k => k.title.includes('Marge'));
        const cashFlowKPI = kpis.find(k => k.title.includes('Cash Flow') || k.title.includes('Trésorerie'));

        const currentCA = parseFloat(caKPI?.value.replace(/[^0-9.-]/g, '') || '0');
        const currentCharges = parseFloat(chargesKPI?.value.replace(/[^0-9.-]/g, '') || '0');
        const currentMarge = parseFloat(margeKPI?.value.replace(/[^0-9.-]/g, '') || '0');
        const currentCashFlow = parseFloat(cashFlowKPI?.value.replace(/[^0-9.-]/g, '') || '0');

        // Calculer depuis rawData
        const totalRevenue = rawData
            .filter((r: any) => r.type === 'income')
            .reduce((sum: number, r: any) => sum + r.amount, 0);

        const totalExpenses = rawData
            .filter((r: any) => r.type === 'expense')
            .reduce((sum: number, r: any) => sum + Math.abs(r.amount), 0);

        const pendingInvoices = rawData
            .filter((r: any) => r.type === 'income' && r.paymentStatus === 'En attente')
            .reduce((sum: number, r: any) => sum + r.amount, 0);

        // SIMULATION 1: Réduction charges → Marge
        const newCharges = totalExpenses * (1 - chargesReduction / 100);
        const economiesCharges = totalExpenses - newCharges;
        const newMarge = ((totalRevenue - newCharges) / totalRevenue) * 100;
        const margeDiff = newMarge - currentMarge;

        // SIMULATION 2: Accélération paiements → Cash Flow
        const cashLiberated = (pendingInvoices / 30) * paiementsAcceleration;
        const newCashFlow = currentCashFlow + cashLiberated;

        // SIMULATION 3: Augmentation prix → CA
        const newCA = totalRevenue * (1 + prixAugmentation / 100);
        const caDiff = newCA - totalRevenue;

        // Créer KPIs simulés
        const simulated: KPI[] = kpis.map(kpi => {
            // KPI CA
            if (kpi.title.includes('Chiffre d\'Affaires') || kpi.title.includes('CA')) {
                if (prixAugmentation > 0) {
                    return {
                        ...kpi,
                        value: `${Math.round(newCA).toLocaleString('fr-FR')} €`,
                        change: `+${Math.round(caDiff).toLocaleString('fr-FR')} € vs actuel`,
                        changeType: 'positive' as const
                    };
                }
            }

            // KPI Charges
            if (kpi.title.includes('Charges')) {
                if (chargesReduction > 0) {
                    return {
                        ...kpi,
                        value: `${Math.round(newCharges).toLocaleString('fr-FR')} €`,
                        change: `-${Math.round(economiesCharges).toLocaleString('fr-FR')} € vs actuel`,
                        changeType: 'positive' as const
                    };
                }
            }

            // KPI Marge
            if (kpi.title.includes('Marge')) {
                if (chargesReduction > 0) {
                    return {
                        ...kpi,
                        value: `${newMarge.toFixed(1)}%`,
                        change: `+${margeDiff.toFixed(1)}% = +${Math.round(economiesCharges).toLocaleString('fr-FR')} €`,
                        changeType: 'positive' as const
                    };
                }
            }

            // KPI Cash Flow
            if (kpi.title.includes('Cash Flow') || kpi.title.includes('Trésorerie')) {
                if (paiementsAcceleration > 0) {
                    return {
                        ...kpi,
                        value: `${Math.round(newCashFlow).toLocaleString('fr-FR')} €`,
                        change: `+${Math.round(cashLiberated).toLocaleString('fr-FR')} € libérés`,
                        changeType: 'positive' as const
                    };
                }
            }

            return kpi;
        });

        setSimulatedKPIs(simulated);
    };

    // 🤖 ML Anomaly Detection
    const detectAnomaliesFromData = async () => {
        if (!rawData || rawData.length === 0) return;

        try {
            const result = await detectAnomalies(rawData);
            setAnomalies(result.anomalies);
            logger.debug(`🤖 ML: ${result.anomalies.length} anomalies détectées`);
        } catch (error) {
            logger.error('Erreur détection anomalies:', error);
        }
    };

    // 🎨 Get KPI Icon
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
        return <TrendingUp className="w-6 h-6" /> // Défaut
    }

    // Handle file upload
    const handleFileUpload = async (files: FileList) => {
        if (!files || files.length === 0) return

        const file = files[0]

        // 🎯 STEP 1: Start upload (show loading immediately)
        setUploadStep('validating');
        setUploadProgress(10);

        // Read file content
        const reader = new FileReader()

        reader.onload = async (e) => {
            const fileContent = e.target?.result as string

            logger.debug('📤 Upload attempt:', {
                fileName: file.name,
                fileType: file.type,
                contentLength: fileContent.length,
                firstChars: fileContent.substring(0, 100)
            })

            try {
                // 🎯 STEP 2: Validating structure
                setUploadStep('validating');
                setUploadProgress(20);
                await new Promise(resolve => setTimeout(resolve, 300));

                // 🎯 STEP 3: AI Parsing (longest step)
                setUploadStep('ai-parsing');
                setUploadProgress(40);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileContent,
                        fileName: file.name,
                        fileType: file.type,
                        companyId: activeCompanyId // ✅ Pass active company ID
                    })
                })

                const result = await response.json()

                if (response.ok) {
                    // 🎯 STEP 4: Processing KPIs
                    setUploadStep('processing');
                    setUploadProgress(70);
                    await new Promise(resolve => setTimeout(resolve, 400));
                    // 🎯 STEP 4: Processing KPIs
                    setUploadStep('processing');
                    setUploadProgress(70);
                    await new Promise(resolve => setTimeout(resolve, 400));

                    setUploadProgress(90);
                    await new Promise(resolve => setTimeout(resolve, 300));

                    // 🎯 STEP 5: Done!
                    setUploadProgress(100);
                    await new Promise(resolve => setTimeout(resolve, 200));

                    setKpis(result.data.kpis || [])
                    const processedData = result.data.financialData || result.data.processedData
                    setFinSightData(processedData)
                    setRawData(result.data.records || result.data.rawData || [])
                    setIsDataLoaded(true)

                    // ✅ Store dashboardConfig for conditional chart rendering
                    if (result.data.dashboardConfig) {
                        setDashboardConfig(result.data.dashboardConfig)
                    }

                    // ✨ Calculate Score FinSight™ (async pour recommandations IA)
                    if (processedData) {
                        try {
                            const score = await calculateFinSightScore(processedData)
                            setFinSightScore(score)
                        } catch (scoreError) {
                            logger.error('Erreur calcul Score FinSight™:', scoreError)
                        }
                    }

                    // 🔮 Generate Cash Flow Predictions (asynchrone, non-bloquant)
                    if (result.data.records && result.data.records.length >= 10) {
                        setIsLoadingPredictions(true);
                        try {
                            const predictionResult = await generateCashFlowPredictions(result.data.records);

                            if (predictionResult.success && predictionResult.predictions) {
                                setCashFlowPredictions(predictionResult.predictions);
                                setPredictionAlerts(predictionResult.alerts || []);
                                setSeasonalityDetected(predictionResult.seasonalityDetected || false);
                                logger.debug(`✅ ${predictionResult.predictions.length} mois prédits`);
                            } else {
                                logger.warn('⚠️ Prédictions IA échouées:', predictionResult.error);
                            }
                        } catch (predError) {
                            logger.error('❌ Erreur prédictions cash flow:', predError);
                        } finally {
                            setIsLoadingPredictions(false);
                        }
                    }

                    // 🔍 Detect Advanced Patterns IA (asynchrone, non-bloquant)
                    if (result.data.records && result.data.records.length >= 20) {
                        setIsLoadingPatterns(true);
                        try {
                            const patternsResult = await detectAdvancedPatterns(result.data.records, {
                                sector: companySector,
                                companyName: companyName
                            });

                            if (patternsResult.success && patternsResult.patterns) {
                                setAIPatterns(patternsResult.patterns);
                                logger.debug(`✅ ${patternsResult.patterns.length} patterns IA détectés`);
                            } else {
                                logger.warn('⚠️ Détection patterns IA échouée:', patternsResult.error);
                            }
                        } catch (patternError) {
                            logger.error('❌ Erreur détection patterns:', patternError);
                        } finally {
                            setIsLoadingPatterns(false);
                        }
                    }

                    // Clear the loaded dashboard badge (new upload = new dashboard)
                    setLoadedDashboardId(null)

                    // ✨ Show upload success banner
                    setShowUploadBanner(true)

                    // Mark upload as done
                    setUploadStep('done');
                } else {
                    // ❌ ERROR → No progression, direct to toast
                    logger.error('API upload error:', response.status, result)

                    // Show different toast based on error type
                    if (response.status === 429) {
                        addToast({
                            type: 'warning',
                            title: 'Limite atteinte',
                            message: result.error || 'Créez un compte gratuit pour continuer',
                            duration: 6000
                        })
                    } else if (response.status === 400) {
                        // Erreur validation ou parsing
                        const errorMessage = result.details
                            ? `${result.error}\n${result.details}`
                            : result.error || 'Données invalides ou insuffisantes'

                        addToast({
                            type: 'error',
                            title: 'Fichier non valide',
                            message: errorMessage,
                            duration: 8000
                        })
                    } else {
                        addToast({
                            type: 'error',
                            title: 'Erreur d\'upload',
                            message: result.error || 'Une erreur est survenue lors du traitement',
                            duration: 5000
                        })
                    }
                }
            } catch (error) {
                logger.error('Erreur upload:', error)
                addToast({
                    type: 'error',
                    title: 'Erreur réseau',
                    message: 'Impossible de traiter le fichier. Vérifiez votre connexion.',
                    duration: 5000
                })
            } finally {
                // ✅ Reset upload state
                setUploadStep('idle');
                setUploadProgress(0);
            }
        }

        reader.onerror = () => {
            logger.error('Erreur lecture fichier')
            addToast({
                type: 'error',
                title: 'Erreur de lecture',
                message: 'Impossible de lire le fichier. Vérifiez le format.',
                duration: 5000
            })
            setUploadStep('idle');
            setUploadProgress(0);
        }

        reader.readAsText(file)
    }

    // Export PDF
    const exportToPDF = async () => {
        if (!dashboardRef.current || kpis.length === 0) return;

        setIsExporting(true);
        try {
            const exporter = new FinancialPDFExporter();

            const pdfOptions = {
                companyName: companyName || 'Entreprise',
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
                userPlan: session?.user?.plan || 'FREE' // ✨ Pass user plan for watermark
            };

            await exporter.generate(pdfOptions);

            const filename = `rapport-financier-${new Date().toISOString().split('T')[0]}.pdf`;
            exporter.download(filename);

        } catch (error) {
            logger.error('Erreur export PDF:', error);
            addToast({
                type: 'error',
                title: 'Erreur d\'export',
                message: 'Impossible de générer le PDF. Réessayez.',
                duration: 4000
            })
        }
        setIsExporting(false);
    }

    // Export Excel
    const exportToExcel = async () => {
        if (kpis.length === 0) return;

        setIsExporting(true);
        try {
            const exporter = new FinancialExcelExporter();

            const excelOptions = {
                companyName: companyName || 'Entreprise',
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
                    description: kpi.description,
                    changeType: kpi.changeType
                })),
                rawData: rawData && rawData.length > 0 ? rawData.map((r: any) => ({
                    date: r.date,
                    description: r.description,
                    amount: r.amount,
                    client: r.client,
                    category: r.category,
                    status: r.paymentStatus
                })) : [],
                includeRawData: true
            };

            await exporter.generate(excelOptions);

        } catch (error) {
            logger.error('Erreur export Excel:', error);
            addToast({
                type: 'error',
                title: 'Erreur d\'export',
                message: 'Impossible de générer le fichier Excel. Réessayez.',
                duration: 4000
            })
        }
        setIsExporting(false);
    }

    // 💾 LOAD SAVED DASHBOARD from API
    const loadSavedDashboard = async (dashboardId: string) => {
        setLoadingSavedDashboard(true);
        setIsLoadingDemo(true);
        setLoadingProgress(0);
        setLoadingMessage('Chargement du dashboard...');

        try {
            setLoadingProgress(30);

            // Fetch dashboard from API
            const response = await fetch(`/api/dashboards?id=${dashboardId}`);

            if (!response.ok) {
                throw new Error('Dashboard introuvable');
            }

            const data = await response.json();
            const dashboard = data.dashboard;

            setLoadingProgress(60);
            setLoadingMessage('Reconstruction des KPIs...');
            await new Promise(resolve => setTimeout(resolve, 500));

            // Load data from saved dashboard
            if (dashboard.kpis && Array.isArray(dashboard.kpis)) {
                setKpis(dashboard.kpis.map((kpi: any) => ({
                    title: kpi.title,
                    value: kpi.value,
                    change: kpi.change,
                    changeType: kpi.changeType as 'positive' | 'negative' | 'neutral',
                    description: kpi.description
                })));
            }

            if (dashboard.rawData && Array.isArray(dashboard.rawData)) {
                setRawData(dashboard.rawData);
            }

            // Set company info from dashboard
            if (dashboard.company) {
                setCompanyName(dashboard.company.name);
                setCompanySector(dashboard.company.sector as CompanySector);
            }

            // Set the loaded dashboard ID for the badge
            setLoadedDashboardId(dashboardId);

            setLoadingProgress(90);
            setLoadingMessage('Finalisation...');
            await new Promise(resolve => setTimeout(resolve, 300));

            setIsDataLoaded(true);
            setLoadingProgress(100);

            logger.debug(`✅ Dashboard "${dashboard.fileName}" chargé depuis DB`);

        } catch (error) {
            logger.error('❌ Erreur chargement dashboard:', error);
            addToast({
                type: 'error',
                title: 'Dashboard introuvable',
                message: 'Ce dashboard a peut-être été supprimé.',
                duration: 5000
            })
            router.push('/dashboard/list');
        } finally {
            setLoadingSavedDashboard(false);
            setIsLoadingDemo(false);
        }
    };

    // Load demo scenario avec animation de progression
    const loadDemoScenario = async (scenario: 'saine' | 'difficulte' | 'croissance') => {
        setIsLoadingDemo(true);
        setLoadingProgress(0);

        const scenarioConfig = {
            saine: {
                file: '/demo-data.csv',
                loadingMsg: '📤 Chargement données PME Services...',
                companyName: 'PME Services B2B',
                sector: 'services' as CompanySector
            },
            difficulte: {
                file: '/demo-startup-difficulte.csv',
                loadingMsg: '📤 Chargement données Startup SaaS...',
                companyName: 'Startup SaaS',
                sector: 'saas' as CompanySector
            },
            croissance: {
                file: '/demo-scaleup-croissance.csv',
                loadingMsg: '📤 Chargement données Scale-up Tech...',
                companyName: 'Scale-up Tech',
                sector: 'saas' as CompanySector
            }
        };

        const config = scenarioConfig[scenario];
        setLoadingMessage(config.loadingMsg);

        try {
            // 🆕 Détection si c'est une démo avec config JSON
            const { isDemoFile, loadDemo } = await import('@/lib/demoDataLoader');
            const filename = config.file.split('/').pop() || '';

            if (isDemoFile(filename)) {
                // 🆕 NOUVEAU : Chargement depuis JSON pré-calculé
                setLoadingProgress(30);
                setLoadingMessage('Chargement configuration démo...');
                await new Promise(resolve => setTimeout(resolve, 500));

                const { processedData, config: demoConfig } = await loadDemo(filename);

                setLoadingProgress(60);
                setLoadingMessage('Génération KPIs cohérents...');
                await new Promise(resolve => setTimeout(resolve, 500));

                // 🆕 Utiliser directement les KPIs du JSON (au lieu de les recalculer)
                const { generateKPIsFromConfig } = await import('@/lib/demoDataLoader');
                const kpis = generateKPIsFromConfig(demoConfig);

                // Import des capabilities pour les graphiques
                const { detectCapabilities } = await import('@/lib/dashboardConfig');

                // Créer capabilities fictifs pour la démo
                const capabilities = {
                    canShowKPIs: true,
                    canShowBasicCharts: true,
                    canShowMonthlyTrends: true,
                    canShowCategoryAnalysis: true,
                    canShowTopClients: true,
                    canShowDSO: true,
                    canShowProjections: false,
                    canShowAlerts: true,
                    canShowAIInsights: true,
                    recordCount: demoConfig.dataQuality.transactionCount,
                    uniqueCounterparties: demoConfig.dataQuality.clientsCount,
                    uniqueCategories: demoConfig.charts.categoryBreakdown.length,
                    monthsSpan: demoConfig.period.months,
                    suggestions: []
                };

                setDashboardConfig(capabilities);

                setLoadingProgress(90);
                setLoadingMessage('Finalisation...');
                await new Promise(resolve => setTimeout(resolve, 300));

                // Mise à jour state
                setKpis((kpis || []).map((kpi: any) => ({
                    title: kpi.title,
                    value: kpi.value,
                    change: kpi.change,
                    changeType: kpi.changeType as 'positive' | 'negative' | 'neutral',
                    description: kpi.description
                })));

                // Wrapper ProcessedData → FinSightDataModel
                const finSightModel: any = {
                    id: `demo-${scenario}-${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    userId: 'demo-user',
                    companyInfo: {
                        name: config.companyName,
                        sector: config.sector,
                        employees: 10
                    },
                    dataSource: { type: 'csv', filename: filename },
                    processedData: processedData,
                    mlInsights: [],
                    status: 'completed' as const
                };

                setFinSightData(finSightModel);
                // 🆕 Générer des records fictifs mais réalistes depuis les données charts
                const fakeRecords: any[] = [];
                let recordId = 1;

                // Générer des transactions mensuelles réalistes
                demoConfig.charts.cashFlowEvolution.forEach((month, monthIdx) => {
                    const monthDate = new Date(2024, 7 + monthIdx, 1); // Août = 7
                    const daysInMonth = new Date(2024, 8 + monthIdx, 0).getDate();

                    // Répartir les revenus sur plusieurs transactions
                    const avgRevenue = month.revenue / 15; // ~15 transactions/mois
                    for (let i = 0; i < 15; i++) {
                        fakeRecords.push({
                            id: `income-${recordId++}`,
                            date: new Date(2024, 7 + monthIdx, Math.floor(Math.random() * daysInMonth) + 1),
                            amount: avgRevenue * (0.5 + Math.random()),
                            type: 'income' as const,
                            description: `Licence SaaS ${month.month}`,
                            counterparty: demoConfig.charts.topClients[i % demoConfig.charts.topClients.length]?.name || 'Client Demo',
                            category: 'Ventes'
                        });
                    }

                    // Répartir les charges par catégorie
                    demoConfig.charts.categoryBreakdown.forEach(cat => {
                        const monthlyAmount = (cat.value / 4) * (0.8 + Math.random() * 0.4);
                        fakeRecords.push({
                            id: `expense-${recordId++}`,
                            date: new Date(2024, 7 + monthIdx, Math.floor(Math.random() * daysInMonth) + 1),
                            amount: monthlyAmount,
                            type: 'expense' as const,
                            description: `${cat.name} ${month.month}`,
                            counterparty: `Fournisseur ${cat.name}`,
                            category: cat.name
                        });
                    });
                });

                setRawData(fakeRecords);
                setIsDataLoaded(true);
                setLoadingProgress(100);
                setCompanySector(config.sector);

                // Store config for charts AND KPIs
                (window as any).__demoChartData = {
                    ...demoConfig.charts,
                    kpis: demoConfig.kpis // 🆕 Passer les KPIs pour le copilot
                };
                (window as any).__demoAnomalies = demoConfig.anomalies;
                (window as any).__demoAlerts = demoConfig.alerts;

                await new Promise(resolve => setTimeout(resolve, 500));
                setIsLoadingDemo(false);
                return;
            }

            // ⬇️ ANCIEN FLOW (pour démos sans config JSON)
            // Animation de progression
            setLoadingProgress(20);
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await fetch(config.file);
            const csvText = await response.text();

            setLoadingProgress(40);
            setLoadingMessage('Analyse des données...');
            await new Promise(resolve => setTimeout(resolve, 700));

            setLoadingProgress(60);
            setLoadingMessage('Calcul des KPIs...');

            // ✅ PARSING CLIENT-SIDE avec système adaptatif
            const { parseCSV } = await import('@/lib/dataParser');
            const { generateAdaptiveKPIs, detectCapabilities } = await import('@/lib/dashboardConfig');

            const parseResult = parseCSV(csvText);

            if (!parseResult.success || !parseResult.data) {
                throw new Error('Erreur parsing CSV démo');
            }

            const { data: processedData, detectedMappings } = parseResult;

            // ✅ Utiliser le système adaptatif
            const capabilities = detectCapabilities(detectedMappings || [], processedData.records || []);
            const kpis = generateAdaptiveKPIs(processedData, capabilities);

            // ✅ Store dashboardConfig for conditional chart rendering
            setDashboardConfig(capabilities);

            setLoadingProgress(80);
            setLoadingMessage('Génération du dashboard...');
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mise à jour state
            setKpis((kpis || []).map((kpi: any) => ({
                title: kpi.title,
                value: kpi.value,
                change: kpi.change,
                changeType: kpi.changeType as 'positive' | 'negative' | 'neutral',
                description: kpi.description
            })));

            // Wrapper ProcessedData → FinSightDataModel pour compatibility
            const finSightModel: any = {
                id: `demo-${scenario}-${Date.now()}`,
                timestamp: new Date().toISOString(),
                fileName: config.file.split('/').pop() || 'demo.csv',
                recordCount: processedData.records.length,
                period: processedData.summary?.period || {
                    start: new Date(),
                    end: new Date(),
                    label: 'Période démo'
                },
                ...processedData
            };

            setFinSightData(finSightModel);
            setRawData(processedData.records || []);
            setIsDataLoaded(true);
            setCompanyName(config.companyName);
            setCompanySector(config.sector);

            setLoadingProgress(100);
            setLoadingMessage('Dashboard prêt !');
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            logger.error('❌ Erreur chargement démo:', error);
            setLoadingMessage('❌ Erreur lors du chargement');
        } finally {
            setTimeout(() => {
                setIsLoadingDemo(false);
                setLoadingProgress(0);
                setLoadingMessage('');
            }, 500);
        }
    }

    // 🤖 Auto-detect anomalies when data changes
    useEffect(() => {
        if (rawData && rawData.length > 0) {
            detectAnomaliesFromData();
        }
    }, [rawData]);

    // 🔄 Load saved dashboard if ?id= parameter exists
    useEffect(() => {
        const dashboardId = searchParams?.get('id');
        if (dashboardId && !isDataLoaded && !loadingSavedDashboard) {
            loadSavedDashboard(dashboardId);
        }
    }, [searchParams]);

    // 🎨 Recalculer KPIs simulés quand sliders changent
    useEffect(() => {
        if (chargesReduction > 0 || paiementsAcceleration > 0 || prixAugmentation > 0) {
            calculateSimulatedKPIs();
        } else {
            setSimulatedKPIs([]);
        }
    }, [chargesReduction, paiementsAcceleration, prixAugmentation, kpis, rawData]);


    // 📂 Écouter l'événement d'upload depuis EmptyDashboardStateV2
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

    const { broadcastKPIUpdate, broadcastFileUpload, broadcastDrillDown } = useRealtimeSync({
        enabled: isDataLoaded,
        onKPIUpdate: (event) => {
            addToast({
                type: 'kpi-update',
                title: 'KPI mis à jour',
                message: `${event.kpiType} = ${event.value.toLocaleString()}€`,
            });
        },
        onFileUpload: (event) => {
            addToast({
                type: 'file-upload',
                title: 'Nouveau fichier',
                message: `${event.userName} a importé ${event.fileName}`,
            });
        },
        onDrillDown: (data) => {
            logger.debug('Drill-down reçu:', data);
        },
        onAnomalyDetected: (data) => {
            addToast({
                type: 'anomaly',
                title: 'Anomalie détectée',
                message: data.description,
            });
        }
    });

    // ⌨️ Keyboard Shortcuts
    useKeyboard({
        shortcuts: [
            {
                key: 'k',
                metaKey: true,
                action: () => setIsCommandPaletteOpen(true),
                description: 'Ouvrir palette de commandes'
            },
            {
                key: 'e',
                metaKey: true,
                action: () => {
                    if (isDataLoaded && kpis.length > 0) {
                        exportToPDF();
                    }
                },
                description: 'Exporter PDF'
            },
            {
                key: 'e',
                metaKey: true,
                shiftKey: true,
                action: () => {
                    if (isDataLoaded && kpis.length > 0) {
                        exportToExcel();
                    }
                },
                description: 'Exporter Excel'
            },
            {
                key: 'm',
                metaKey: true,
                action: () => setShowAnomalies(prev => !prev),
                description: 'Toggle Anomalies ML'
            },
            {
                key: 't',
                metaKey: true,
                action: toggleTheme,
                description: 'Toggle thème'
            },
            {
                key: 's',
                metaKey: true,
                action: () => setShowSimulation(prev => !prev),
                description: 'Toggle What-If Simulation'
            }
        ],
        enabled: isDataLoaded
    });

    // Si pas de données, afficher Empty State ou Loading
    if (!isDataLoaded) {
        return (
            <>
                {/* Toast notifications - TOUJOURS visible */}
                <RealtimeToast
                    notifications={toastNotifications}
                    onDismiss={(id) => setToastNotifications(prev => prev.filter(n => n.id !== id))}
                />

                {/* Animation de chargement démo */}
                {isLoadingDemo && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                        <div className="w-20 h-20 border-4 border-accent-primary-border border-t-accent-primary rounded-full animate-spin"></div>
                        <div className="text-center w-full max-w-md">
                            <h3 className="text-2xl font-bold mb-2">
                                {loadingMessage}
                            </h3>
                            <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden mt-4">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-primary to-accent-primary-hover rounded-full transition-all duration-300"
                                    style={{ width: `${loadingProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-secondary mt-3">
                                {loadingProgress}% complété
                            </p>
                        </div>
                    </div>
                )}

                {/* Animation de chargement upload - Granulaire */}
                {isUploadingFile && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                        <div className="w-20 h-20 border-4 border-accent-primary-border border-t-accent-primary rounded-full animate-spin"></div>
                        <div className="text-center w-full max-w-md">
                            <h3 className="text-2xl font-bold mb-2">
                                {uploadStep === 'validating' && 'Validation du fichier...'}
                                {uploadStep === 'ai-parsing' && 'Analyse IA en cours...'}
                                {uploadStep === 'processing' && 'Génération des KPIs...'}
                            </h3>
                            <p className="text-sm text-secondary mt-3">
                                {uploadStep === 'validating' && 'Vérification de la structure et des colonnes'}
                                {uploadStep === 'ai-parsing' && 'Parsing intelligent de vos données financières'}
                                {uploadStep === 'processing' && 'Calcul des métriques et du Score FinSight™'}
                            </p>
                            {/* Progress bar */}
                            <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-accent-primary h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-tertiary mt-2">{uploadProgress}%</p>
                        </div>
                    </div>
                )}

                {/* Empty State - affiché seulement si pas en chargement */}
                {!isLoadingDemo && !isUploadingFile && (
                    <EmptyDashboardStateV2 onDemoLoad={loadDemoScenario} />
                )}

                {showCompanyModal && (
                    <CompanyInfoModal
                        isOpen={showCompanyModal}
                        onClose={() => setShowCompanyModal(false)}
                        onSubmit={(name: string, sector: CompanySector) => {
                            setCompanyName(name);
                            setCompanySector(sector);
                            setShowCompanyModal(false);
                        }}
                    />
                )}
            </>
        );
    }

    return (
        <>
            {/* Upload Success Banner */}
            {showUploadBanner && (
                <UploadSuccessBanner onClose={() => setShowUploadBanner(false)} />
            )}

            {/* Container principal - Design corporate épuré */}
            <div ref={dashboardRef} className="max-w-7xl mx-auto px-6 py-8">
                {/* Auth Banner - Shown only for non-authenticated users */}
                <AuthBanner />

                {/* Real-Time Presence */}
                {isDataLoaded && (
                    <>
                        <PresenceIndicator />
                        {/* <CursorTracker /> - Disabled to reduce Pusher message consumption */}
                    </>
                )}

                {/* Toast toujours visible (même sans données chargées) */}
                <RealtimeToast
                    notifications={toastNotifications}
                    onDismiss={(id) => setToastNotifications(prev => prev.filter(n => n.id !== id))}
                />
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-primary">Tableau de Bord Financier</h1>
                            {loadedDashboardId && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                                    <Database className="w-3.5 h-3.5" />
                                    Dashboard sauvegardé
                                </span>
                            )}
                        </div>
                        <p className="text-secondary text-sm">Période Actuelle • Données en temps réel</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {/* Bouton Mes Dashboards - NEW */}
                        <button
                            onClick={() => router.push('/dashboard/list')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-accent-primary text-accent-primary hover:bg-accent-primary-subtle rounded-lg font-semibold text-sm transition-all"
                        >
                            <FolderOpen className="w-4 h-4" />
                            Mes Dashboards
                        </button>

                        <button
                            onClick={exportToPDF}
                            disabled={isExporting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            {isExporting ? 'Export...' : 'Export PDF'}
                        </button>

                        <button
                            onClick={exportToExcel}
                            disabled={isExporting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-success hover:bg-accent-success-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50"
                        >
                            <FileText className="w-4 h-4" />
                            {isExporting ? 'Export...' : 'Export Excel'}
                        </button>

                        <button
                            onClick={() => document.getElementById('dashboard-file-input')?.click()}
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold text-sm transition-all hover:bg-surface-elevated"
                        >
                            <Upload className="w-4 h-4" />
                            Importer Données
                        </button>

                        {/* Hidden file input */}
                        <input
                            id="dashboard-file-input"
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    handleFileUpload(e.target.files)
                                }
                            }}
                        />
                    </div>
                </div>

                {/* 🏆 Score FinSight™ - TOP POSITION */}
                {finSightScore && (
                    <div className="mb-8">
                        <FinSightScoreCard score={finSightScore} />
                    </div>
                )}

                {/* 🤝 CTA Consulting Banner - Subtle après upload */}
                {isDataLoaded && (
                    <ConsultingBanner variant="subtle" />
                )}

                {/* KPIs Grid - Layout CFO-friendly: 3 colonnes, plus dense */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 relative z-10">
                    {(simulatedKPIs.length > 0 ? simulatedKPIs : kpis)
                        .filter(kpi => kpi.isAvailable !== false) // ✅ Filtrer KPIs non disponibles
                        .map((kpi, index) => (
                            <div
                                key={index}
                                className="surface rounded-xl p-6 surface-hover group cursor-pointer"
                                onClick={() => drillDownActions.openDrillDown(kpi.title)}
                            >
                                {/* Header: Titre + Variation (pattern Excel/Power BI) */}
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-base font-semibold text-primary leading-tight">
                                        {kpi.title}
                                    </h3>
                                    <span className={`text-base font-bold ml-2 flex-shrink-0 ${kpi.changeType === 'positive' ? 'text-accent-success' :
                                        kpi.changeType === 'negative' ? 'text-accent-danger' :
                                            'text-secondary'
                                        }`}>
                                        {kpi.change}
                                    </span>
                                </div>

                                {/* Valeur principale - GROS et lisible */}
                                <p className="text-4xl font-bold mb-2 text-primary">{kpi.value}</p>

                                {/* Description contextuelle - lisible */}
                                <p className="text-sm text-secondary mb-3 leading-relaxed">{kpi.description}</p>

                                {/* BenchmarkBar - Comparaison sectorielle (sauf pour Cash absolu) */}
                                {!kpi.title.includes('Cash') && (
                                    <BenchmarkBar
                                        kpiName={
                                            kpi.title.includes('Revenus') ? 'REVENUS_CROISSANCE' :
                                                kpi.title.includes('Charges') ? 'CHARGES_CROISSANCE' :
                                                    kpi.title.includes('Marge') ? 'MARGE_NETTE' :
                                                        kpi.title.includes('DSO') ? 'DSO' :
                                                            kpi.title.includes('BFR') ? 'BFR' :
                                                                'DSO'
                                        }
                                        currentValue={
                                            kpi.title.includes('Revenus') || kpi.title.includes('Charges')
                                                ? parseFloat(kpi.change.replace('%', '')) || 0
                                                : kpi.title.includes('BFR')
                                                    ? parseFloat(kpi.change.replace(/[^\d.-]/g, '')) || 0
                                                    : parseFloat(kpi.value.replace(/[^\d.-]/g, '')) || 0
                                        }
                                        sector={companySector}
                                        unit={
                                            kpi.title.includes('Revenus') || kpi.title.includes('Charges') || kpi.title.includes('BFR')
                                                ? '%'
                                                : kpi.value.includes('%') ? '%' : kpi.value.includes('jours') ? 'jours' : '€'
                                        }
                                        inverse={kpi.title.includes('DSO') || kpi.title.includes('BFR') || kpi.title.includes('Charges')}
                                    />
                                )}
                            </div>
                        ))}
                </div>

                {/* 🔮 Cash Flow Predictions - NOUVEAU - Après KPIs, avant What-If */}
                {isDataLoaded && cashFlowPredictions.length > 0 && (
                    <CashFlowPredictions
                        predictions={cashFlowPredictions}
                        alerts={predictionAlerts}
                        seasonalityDetected={seasonalityDetected}
                        rawData={rawData || []}
                    />
                )}

                {/* Loading Predictions */}
                {isDataLoaded && isLoadingPredictions && (
                    <div className="mb-8 surface rounded-2xl p-8 flex items-center justify-center gap-3 text-accent-blue">
                        <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-semibold">Génération des prédictions IA...</span>
                    </div>
                )}

                {/* 🔮 What-If Simulation Panel - Juste après Predictions */}
                {isDataLoaded && (
                    <div className="mb-8 surface rounded-2xl p-8 relative overflow-hidden border-2 border-accent-primary-border/20 bg-gradient-to-br from-accent-primary-subtle/10 to-transparent">
                        {/* Badge Mode Simulation actif */}
                        {(chargesReduction > 0 || paiementsAcceleration > 0 || prixAugmentation > 0) && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-accent-green to-accent-green-hover rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg animate-pulse">
                                {[chargesReduction > 0, paiementsAcceleration > 0, prixAugmentation > 0].filter(Boolean).length} simulation{[chargesReduction > 0, paiementsAcceleration > 0, prixAugmentation > 0].filter(Boolean).length > 1 ? 's' : ''} active{[chargesReduction > 0, paiementsAcceleration > 0, prixAugmentation > 0].filter(Boolean).length > 1 ? 's' : ''}
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <Zap className="w-7 h-7 text-accent-primary" />
                                <div>
                                    <h3 className="text-2xl font-bold">Simulation What-If</h3>
                                    <p className="text-sm text-secondary mt-1">
                                        Mesurez l'impact en temps réel sur les KPIs ci-dessus
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {(chargesReduction > 0 || paiementsAcceleration > 0 || prixAugmentation > 0) && (
                                    <button
                                        onClick={() => {
                                            setChargesReduction(0);
                                            setPaiementsAcceleration(0);
                                            setPrixAugmentation(0);
                                        }}
                                        className="px-4 py-2 bg-accent-red-subtle border border-accent-red-border rounded-lg text-accent-red font-semibold text-xs hover:bg-accent-red-border/20 transition-all"
                                    >
                                        Reset
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowSimulation(!showSimulation)}
                                    className="px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-lg text-accent-primary font-semibold text-sm hover:bg-accent-primary-border/20 transition-all"
                                >
                                    {showSimulation ? '▼ Réduire' : '▶ Développer'}
                                </button>
                            </div>
                        </div>

                        {/* 3 Simulations */}
                        {showSimulation && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* SIMULATION 1: Réduction Charges → Marge */}
                                <div className={`surface rounded-xl p-5 transition-all ${chargesReduction > 0 ? 'border-2 border-accent-green' : ''}`}>
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-8 h-8 text-green-600" />
                                            <h4 className="text-base font-bold">Optimisation charges</h4>
                                        </div>
                                        <p className="text-xs text-secondary">
                                            Impact sur <strong className="text-accent-green">Marge Nette</strong>
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-secondary">Réduction</span>
                                            <span className={`text-xl font-bold ${chargesReduction > 0 ? 'text-accent-green' : 'text-accent-primary'}`}>
                                                -{chargesReduction}%
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="range"
                                                min="0"
                                                max="30"
                                                step="5"
                                                value={chargesReduction}
                                                onChange={(e) => setChargesReduction(Number(e.target.value))}
                                                className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-accent-green"
                                                style={{
                                                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(chargesReduction / 30) * 100}%, rgba(255,255,255,0.1) ${(chargesReduction / 30) * 100}%, rgba(255,255,255,0.1) 100%)`
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-secondary font-medium">0%</span>
                                            <span className="text-xs text-secondary font-medium">30%</span>
                                        </div>
                                    </div>

                                    {chargesReduction > 0 && simulatedKPIs.length > 0 && (
                                        <div className="bg-accent-green-subtle border border-accent-green-border rounded-lg p-3">
                                            <p className="text-xs text-secondary mb-1">Impact Marge</p>
                                            <p className="text-sm font-bold text-accent-green">
                                                {simulatedKPIs.find(k => k.title.includes('Marge'))?.change || 'Calcul...'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* SIMULATION 2: Accélération Paiements → Cash Flow */}
                                <div className={`surface rounded-xl p-5 transition-all ${paiementsAcceleration > 0 ? 'border-2 border-accent-blue' : ''}`}>
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-8 h-8 text-accent-primary" />
                                            <h4 className="text-base font-bold">Relance créances</h4>
                                        </div>
                                        <p className="text-xs text-secondary">
                                            Impact sur <strong className="text-accent-blue">Cash Flow</strong>
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-secondary">Réduction DSO</span>
                                            <span className={`text-xl font-bold ${paiementsAcceleration > 0 ? 'text-accent-blue' : 'text-accent-primary'}`}>
                                                -{paiementsAcceleration}j
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="range"
                                                min="0"
                                                max="15"
                                                step="3"
                                                value={paiementsAcceleration}
                                                onChange={(e) => setPaiementsAcceleration(Number(e.target.value))}
                                                className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-accent-blue"
                                                style={{
                                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(paiementsAcceleration / 15) * 100}%, rgba(255,255,255,0.1) ${(paiementsAcceleration / 15) * 100}%, rgba(255,255,255,0.1) 100%)`
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-secondary font-medium">0j</span>
                                            <span className="text-xs text-secondary font-medium">15j</span>
                                        </div>
                                    </div>

                                    {paiementsAcceleration > 0 && simulatedKPIs.length > 0 && (
                                        <div className="bg-accent-blue-subtle border border-accent-blue-border rounded-lg p-3">
                                            <p className="text-xs text-secondary mb-1">Impact Cash Flow</p>
                                            <p className="text-sm font-bold text-accent-blue">
                                                {simulatedKPIs.find(k => k.title.includes('Cash Flow') || k.title.includes('Trésorerie'))?.change || 'Calcul...'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* SIMULATION 3: Augmentation Prix → CA */}
                                <div className={`surface rounded-xl p-5 transition-all ${prixAugmentation > 0 ? 'border-2 border-accent-orange' : ''}`}>
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-8 h-8 text-purple-600" />
                                            <h4 className="text-base font-bold">Augmentation prix</h4>
                                        </div>
                                        <p className="text-xs text-secondary">
                                            Impact sur <strong className="text-accent-orange">Revenus & Croissance</strong>
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-secondary">Augmentation</span>
                                            <span className={`text-xl font-bold ${prixAugmentation > 0 ? 'text-accent-orange' : 'text-accent-primary'}`}>
                                                +{prixAugmentation}%
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="range"
                                                min="0"
                                                max="15"
                                                step="3"
                                                value={prixAugmentation}
                                                onChange={(e) => setPrixAugmentation(Number(e.target.value))}
                                                className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-accent-orange"
                                                style={{
                                                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${(prixAugmentation / 15) * 100}%, rgba(255,255,255,0.1) ${(prixAugmentation / 15) * 100}%, rgba(255,255,255,0.1) 100%)`
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-secondary font-medium">0%</span>
                                            <span className="text-xs text-secondary font-medium">15%</span>
                                        </div>
                                    </div>

                                    {prixAugmentation > 0 && simulatedKPIs.length > 0 && (
                                        <div className="bg-accent-orange-subtle border border-accent-orange-border rounded-lg p-3">
                                            <p className="text-xs text-secondary mb-1">Impact CA</p>
                                            <p className="text-sm font-bold text-accent-orange">
                                                {simulatedKPIs.find(k => k.title.includes('Chiffre d\'Affaires') || k.title.includes('CA'))?.change || 'Calcul...'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 📊 Alertes Intelligentes - Juste après What-If */}
                {kpis.length > 0 && (
                    <div className="mb-8 surface rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-accent-orange" />
                                <h3 className="text-xl font-semibold">Alertes Intelligentes</h3>
                            </div>
                            <button
                                onClick={() => setShowAlertSettings(true)}
                                className="text-sm text-accent-primary hover:text-accent-primary-hover transition-colors"
                            >
                                Configurer
                            </button>
                        </div>
                        <AlertsPanel
                            dso={parseFloat(kpis.find(k => k.title.includes('DSO'))?.value.replace(/[^\d.-]/g, '') || '0')}
                            cashFlow={parseFloat(kpis.find(k => k.title.includes('Cash'))?.value.replace(/[^\d.-]/g, '') || '0')}
                            netMargin={parseFloat(kpis.find(k => k.title.includes('Marge'))?.value.replace(/[^\d.-]/g, '') || '0')}
                        />
                    </div>
                )}

                {/* Charts Grid - Afficher uniquement si données disponibles */}
                {finSightData && rawData && rawData.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {/* Cash Flow Chart - Conditional on monthlyTrends capability */}
                        {dashboardConfig?.canShowMonthlyTrends && (
                            <div className="surface rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-6">Évolution Cash Flow</h3>
                                <CashFlowEvolutionChart data={getMonthlyData()} />
                            </div>
                        )}

                        {/* Margin Chart - Conditional on monthlyTrends capability */}
                        {dashboardConfig?.canShowMonthlyTrends && (
                            <div className="surface rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-6">Évolution Marge</h3>
                                <MarginEvolutionChart data={getMarginData()} />
                            </div>
                        )}

                        {/* Expense Breakdown - Conditional on category analysis */}
                        {dashboardConfig?.canShowCategoryAnalysis && (
                            <div className="surface rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-6">Répartition Charges</h3>
                                <ExpenseBreakdownChart data={getCategoryBreakdown()} />
                            </div>
                        )}

                        {/* Top Clients - Conditional on counterparty data */}
                        {dashboardConfig?.canShowTopClients && (
                            <div className="surface rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-6">Top Clients</h3>
                                <TopClientsVerticalChart data={getTopClients()} />
                            </div>
                        )}
                    </div>
                )}

                {/* 🎨 Charts Avancés D3.js - Sankey + Sunburst */}
                {finSightData && rawData && rawData.length > 0 && dashboardConfig?.canShowBasicCharts && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {/* Sankey Flow Chart - Always show if basic charts enabled */}
                        <div className="surface rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-5 h-5 text-accent-primary" />
                                <h3 className="text-xl font-semibold">Flux Financier (Sankey)</h3>
                            </div>
                            <SankeyFlowChart data={getSankeyData()} />
                        </div>

                        {/* Sunburst Expenses Chart - Conditional on category analysis */}
                        {dashboardConfig?.canShowCategoryAnalysis && (
                            <div className="surface rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles className="w-5 h-5 text-accent-primary" />
                                    <h3 className="text-xl font-semibold">Hiérarchie Dépenses (Sunburst)</h3>
                                </div>
                                <SunburstExpensesChart data={getSunburstData()} />
                            </div>
                        )}
                    </div>
                )}

                {/* 🤖 ML Anomaly Detection Panel + IA Patterns */}
                {(anomalies.length > 0 || aiPatterns.length > 0) && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-accent-orange" />
                                <h3 className="text-xl font-semibold">
                                    Anomalies & Insights IA {anomalies.length > 0 && `(${anomalies.length} anomalies)`}
                                    {aiPatterns.length > 0 && ` · ${aiPatterns.length} patterns`}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowAnomalies(!showAnomalies)}
                                className="text-sm text-accent-primary hover:text-accent-primary-hover transition-colors"
                            >
                                {showAnomalies ? 'Masquer' : 'Afficher'}
                            </button>
                        </div>
                        {showAnomalies && (
                            <AnomalyPanel
                                anomalies={anomalies}
                                patterns={aiPatterns}
                            />
                        )}
                    </div>
                )}

                {/* 📊 Data Preview Panel */}
                {rawData && rawData.length > 0 && (
                    <div className="mb-8 surface rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-6">Aperçu Données Brutes</h3>
                        <DataPreviewPanel rawData={rawData} companyName={companyName} />
                    </div>
                )}

                {/* AI Copilot */}
                <div className="mb-12" data-copilot>
                    <AICopilot />
                </div>

                {/* Modals & Overlays */}
                {drillDownState.isOpen && (
                    <KPIDrilldownModal
                        state={drillDownState}
                        actions={drillDownActions}
                        rawData={rawData || []}
                    />
                )}

                {isCommandPaletteOpen && (
                    <CommandPalette
                        isOpen={isCommandPaletteOpen}
                        onClose={() => setIsCommandPaletteOpen(false)}
                        onExportPDF={() => exportToPDF()}
                        onExportExcel={() => exportToExcel()}
                        onToggleAnomalies={() => setShowAnomalies(!showAnomalies)}
                        onToggleTheme={toggleTheme}
                    />
                )}

                {showAlertSettings && (
                    <AlertSettings
                        isOpen={showAlertSettings}
                        onClose={() => setShowAlertSettings(false)}
                    />
                )}

                {showCompanyModal && (
                    <CompanyInfoModal
                        isOpen={showCompanyModal}
                        onClose={() => setShowCompanyModal(false)}
                        onSubmit={(name: string, sector: CompanySector) => {
                            setCompanyName(name);
                            setCompanySector(sector);
                            setShowCompanyModal(false);
                        }}
                    />
                )}
            </div>
        </>
    )
}

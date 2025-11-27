'use client'

import { useState, useEffect, useRef } from 'react'
import { useFinancialData } from '@/lib/financialContext'
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
    Wallet
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

// Import Drill-Down
import { useDrilldown } from '@/hooks/useDrilldown'
import { KPIDrilldownModal } from './drill-down/KPIDrilldownModal'

// Import ML
import { detectAnomalies } from '@/lib/ml/anomalyDetector'
import type { Anomaly } from '@/lib/ml/types'

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

interface KPI {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    description: string
}

export default function FinancialDashboardV2() {
    const { finSightData, setFinSightData, rawData, setRawData, isDataLoaded, setIsDataLoaded } = useFinancialData();
    const [kpis, setKpis] = useState<KPI[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Company Info states
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [companySector, setCompanySector] = useState<CompanySector>('services');

    // Drill-down state
    const [drillDownState, drillDownActions] = useDrilldown();

    // ML Anomaly Detection states
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [showAnomalies, setShowAnomalies] = useState(false);

    // Command Palette state
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    // Real-Time states
    const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);

    // Alert Settings state
    const [showAlertSettings, setShowAlertSettings] = useState(false);

    // Upload Modal state (appointment booking)
    const [showUploadModal, setShowUploadModal] = useState(false);

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

    // 🔧 Fonctions de préparation des données pour les charts

    const getMonthlyData = () => {
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
            console.log(`🤖 ML: ${result.anomalies.length} anomalies détectées`);
        } catch (error) {
            console.error('Erreur détection anomalies:', error);
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
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const result = await response.json()

            if (response.ok) {
                setKpis(result.data.kpis || [])
                setFinSightData(result.data.financialData || result.data.processedData)
                setRawData(result.data.records || result.data.rawData || [])
                setIsDataLoaded(true)
            }
        } catch (error) {
            console.error('Erreur upload:', error)
        }
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
                confidential: true
            };

            await exporter.generate(pdfOptions);

            const filename = `rapport-financier-${new Date().toISOString().split('T')[0]}.pdf`;
            exporter.download(filename);

        } catch (error) {
            console.error('Erreur export PDF:', error);
            alert('Erreur lors de l\'export PDF');
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
            console.error('Erreur export Excel:', error);
            alert('Erreur lors de l\'export Excel');
        }
        setIsExporting(false);
    }

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
            // Animation de progression
            setLoadingProgress(20);
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await fetch(config.file);
            const csvText = await response.text();

            setLoadingProgress(40);
            setLoadingMessage('🔍 Analyse des données...');
            await new Promise(resolve => setTimeout(resolve, 700));

            setLoadingProgress(60);
            setLoadingMessage('📊 Calcul des KPIs...');

            const apiResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileContent: csvText,
                    fileName: config.file.split('/').pop(),
                    fileType: 'text/csv'
                })
            });

            const result = await apiResponse.json();

            setLoadingProgress(80);
            setLoadingMessage('✨ Génération du dashboard...');
            await new Promise(resolve => setTimeout(resolve, 500));

            if (apiResponse.ok) {
                setKpis(result.data.kpis || []);
                setFinSightData(result.data.financialData || result.data.processedData);
                setRawData(result.data.records || result.data.rawData || []);
                setIsDataLoaded(true);
                setCompanyName(config.companyName);
                setCompanySector(config.sector);

                setLoadingProgress(100);
                setLoadingMessage('✅ Dashboard prêt !');
                await new Promise(resolve => setTimeout(resolve, 300));
            } else {
                console.error('❌ Erreur API upload:', result);
                setLoadingMessage('❌ Erreur lors du chargement');
            }
        } catch (error) {
            console.error('❌ Erreur chargement démo:', error);
            setLoadingMessage('❌ Erreur lors du chargement');
        } finally {
            setTimeout(() => {
                setIsLoadingDemo(false);
                setLoadingProgress(0);
                setLoadingMessage('');
            }, 500);
        }
    }

    // Listen for file upload events
    useEffect(() => {
        const handleFileSelected = (event: Event) => {
            const customEvent = event as CustomEvent
            handleFileUpload(customEvent.detail as FileList)
        }

        window.addEventListener('fileSelected', handleFileSelected)
        return () => window.removeEventListener('fileSelected', handleFileSelected)
    }, [])

    // 🤖 Auto-detect anomalies when data changes
    useEffect(() => {
        if (rawData && rawData.length > 0) {
            detectAnomaliesFromData();
        }
    }, [rawData]);

    // � Recalculer KPIs simulés quand sliders changent
    useEffect(() => {
        if (chargesReduction > 0 || paiementsAcceleration > 0 || prixAugmentation > 0) {
            calculateSimulatedKPIs();
        } else {
            setSimulatedKPIs([]);
        }
    }, [chargesReduction, paiementsAcceleration, prixAugmentation, kpis, rawData]);

    // �📡 Real-Time Sync
    const addToast = (toast: Omit<ToastNotification, 'id'>) => {
        const newToast = { ...toast, id: Date.now().toString() };
        setToastNotifications(prev => [...prev, newToast]);
    };

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
            console.log('Drill-down reçu:', data);
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

                {/* Empty State - affiché seulement si pas en chargement */}
                {!isLoadingDemo && (
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
            {/* Container principal - Design corporate épuré */}
            <div ref={dashboardRef} className="max-w-7xl mx-auto px-6 py-8">
                {/* Real-Time Presence */}
                {isDataLoaded && (
                    <>
                        <PresenceIndicator />
                        {/* <CursorTracker /> - Disabled to reduce Pusher message consumption */}
                        <RealtimeToast
                            notifications={toastNotifications}
                            onDismiss={(id) => setToastNotifications(prev => prev.filter(n => n.id !== id))}
                        />
                    </>
                )}
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-primary">Tableau de Bord Financier</h1>
                        <p className="text-secondary text-sm">Période Actuelle • Données en temps réel</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
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
                            onClick={() => setShowUploadModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold text-sm transition-all hover:bg-surface-elevated"
                        >
                            <Upload className="w-4 h-4" />
                            Importer Données
                        </button>
                    </div>
                </div>

                {/* KPIs Grid - Layout CFO-friendly: 3 colonnes, plus dense */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 relative z-10">
                    {(simulatedKPIs.length > 0 ? simulatedKPIs : kpis).map((kpi, index) => (
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
                                <span className={`text-base font-bold ml-2 flex-shrink-0 ${
                                    kpi.changeType === 'positive' ? 'text-accent-success' :
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

                            {/* BenchmarkBar - Comparaison sectorielle */}
                            <BenchmarkBar
                                kpiName={
                                    kpi.title.includes('Marge') ? 'MARGE_NETTE' :
                                        kpi.title.includes('DSO') ? 'DSO' :
                                            kpi.title.includes('BFR') ? 'BFR' :
                                                'DSO'
                                }
                                currentValue={parseFloat(kpi.value.replace(/[^\d.-]/g, '')) || 0}
                                sector={companySector}
                                unit={kpi.value.includes('%') ? '%' : kpi.value.includes('jours') ? 'jours' : '€'}
                                inverse={kpi.title.includes('DSO')}
                            />
                        </div>
                    ))}
                </div>

                {/* 🔮 What-If Simulation Panel - Juste après KPIs pour montrer l'impact immédiat */}
                {isDataLoaded && (
                    <div className="mb-8 surface rounded-2xl p-8 relative overflow-hidden border-2 border-accent-primary-border/20 bg-gradient-to-br from-accent-primary-subtle/10 to-transparent">
                        {/* Badge Mode Simulation actif */}
                        {(chargesReduction > 0 || paiementsAcceleration > 0 || prixAugmentation > 0) && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-accent-green to-accent-green-hover rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg animate-pulse">
                                📊 {[chargesReduction > 0, paiementsAcceleration > 0, prixAugmentation > 0].filter(Boolean).length} simulation{[chargesReduction > 0, paiementsAcceleration > 0, prixAugmentation > 0].filter(Boolean).length > 1 ? 's' : ''} active{[chargesReduction > 0, paiementsAcceleration > 0, prixAugmentation > 0].filter(Boolean).length > 1 ? 's' : ''}
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
                                        🔄 Reset
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
                                            <span className="text-2xl">💰</span>
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
                                            <span className="text-xs text-tertiary">0%</span>
                                            <span className="text-xs text-tertiary">30%</span>
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
                                            <span className="text-2xl">⚡</span>
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
                                            <span className="text-xs text-tertiary">0j</span>
                                            <span className="text-xs text-tertiary">15j</span>
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
                                            <span className="text-2xl">📈</span>
                                            <h4 className="text-base font-bold">Augmentation prix</h4>
                                        </div>
                                        <p className="text-xs text-secondary">
                                            Impact sur <strong className="text-accent-orange">Chiffre d'Affaires</strong>
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
                                            <span className="text-xs text-tertiary">0%</span>
                                            <span className="text-xs text-tertiary">15%</span>
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
                        {/* Cash Flow Chart */}
                        <div className="surface rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-6">Évolution Cash Flow</h3>
                            <CashFlowEvolutionChart data={getMonthlyData()} />
                        </div>

                        {/* Margin Chart */}
                        <div className="surface rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-6">Évolution Marge</h3>
                            <MarginEvolutionChart data={getMarginData()} />
                        </div>

                        {/* Expense Breakdown */}
                        <div className="surface rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-6">Répartition Charges</h3>
                            <ExpenseBreakdownChart data={getCategoryBreakdown()} />
                        </div>

                        {/* Top Clients */}
                        <div className="surface rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-6">Top Clients</h3>
                            <TopClientsVerticalChart data={getTopClients()} />
                        </div>
                    </div>
                )}

                {/* 🎨 Charts Avancés D3.js - Sankey + Sunburst */}
                {finSightData && rawData && rawData.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {/* Sankey Flow Chart */}
                        <div className="surface rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-5 h-5 text-accent-primary" />
                                <h3 className="text-xl font-semibold">Flux Financier (Sankey)</h3>
                            </div>
                            <SankeyFlowChart data={getSankeyData()} />
                        </div>

                        {/* Sunburst Expenses Chart */}
                        <div className="surface rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-5 h-5 text-accent-primary" />
                                <h3 className="text-xl font-semibold">Hiérarchie Dépenses (Sunburst)</h3>
                            </div>
                            <SunburstExpensesChart data={getSunburstData()} />
                        </div>
                    </div>
                )}

                {/* 🤖 ML Anomaly Detection Panel */}
                {anomalies.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-accent-orange" />
                                <h3 className="text-xl font-semibold">Anomalies Détectées ({anomalies.length})</h3>
                            </div>
                            <button
                                onClick={() => setShowAnomalies(!showAnomalies)}
                                className="text-sm text-accent-primary hover:text-accent-primary-hover transition-colors"
                            >
                                {showAnomalies ? 'Masquer' : 'Afficher'}
                            </button>
                        </div>
                        {showAnomalies && <AnomalyPanel anomalies={anomalies} />}
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

                {/* 🔒 Modal Upload sur RDV */}
                {showUploadModal && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px',
                            overflowY: 'auto'
                        }}
                        onClick={() => setShowUploadModal(false)}
                    >
                        <div
                            style={{
                                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                borderRadius: '20px',
                                maxWidth: '550px',
                                maxHeight: '90vh',
                                width: '100%',
                                padding: '32px 28px',
                                position: 'relative',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                overflowY: 'auto'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowUploadModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    color: '#fff',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    transition: 'all 0.2s',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                            >
                                ✕
                            </button>

                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                                    Analyse de VOS données
                                </h3>
                                <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                                    Cette fonctionnalité est disponible uniquement sur rendez-vous pour garantir une analyse optimale et personnalisée.
                                </p>
                            </div>

                            {/* Bénéfices */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>✓</span>
                                    <div>
                                        <strong style={{ color: '#60a5fa', fontSize: '15px' }}>Audit gratuit de 30 min</strong>
                                        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0' }}>
                                            Analyse de vos besoins avec un expert
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>✓</span>
                                    <div>
                                        <strong style={{ color: '#60a5fa', fontSize: '15px' }}>Configuration personnalisée</strong>
                                        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0' }}>
                                            Dashboard adapté à votre système comptable
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>✓</span>
                                    <div>
                                        <strong style={{ color: '#60a5fa', fontSize: '15px' }}>Formation & support inclus</strong>
                                        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0' }}>
                                            Prise en main complète de votre outil
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <a
                                    href="https://calendly.com/zineinsight"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: '1',
                                        minWidth: '200px',
                                        padding: '16px 24px',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        color: '#fff',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                                        cursor: 'pointer',
                                        border: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
                                    }}
                                >
                                    📅 Prendre rendez-vous
                                </a>
                                <a
                                    href="mailto:otmane@zineinsight.com?subject=Analyse de mes données financières&body=Bonjour Otmane,%0A%0AJe suis intéressé(e) par l'analyse de mes données financières avec FinSight.%0A%0APouvez-vous me recontacter pour discuter de mes besoins ?%0A%0AMerci !"
                                    style={{
                                        flex: '1',
                                        minWidth: '200px',
                                        padding: '16px 24px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        color: '#fff',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        transition: 'all 0.3s',
                                        border: '2px solid rgba(255, 255, 255, 0.2)',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                    }}
                                >
                                    ✉️ Envoyer un email
                                </a>
                            </div>
                        </div>
                    </div>
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

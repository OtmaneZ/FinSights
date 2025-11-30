'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import React from 'react';
import dynamic from 'next/dynamic';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DashboardConfig, DataLevelInfo } from '@/lib/dataModel';
import { getUpgradeMessages } from '@/lib/dashboardConfig';
import { useFinancialData } from '@/lib/financialContext';
import { FinancialPDFExporter } from '@/lib/pdfExporter';
import { FinancialExcelExporter } from '@/lib/excelExporter';
import {
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    CalendarIcon,
    CloudArrowUpIcon,
    CheckCircleIcon,
    BellAlertIcon
} from '@heroicons/react/24/outline';

// Import nouveaux composants
import { BenchmarkBar } from './BenchmarkBar';
import { AlertsPanel } from './AlertsPanel';
import { CompanyInfoModal, CompanySector } from './CompanyInfoModal';
import { DataPreviewPanel } from './DataPreviewPanel';

// Import Charts
import { CashFlowEvolutionChart } from './charts/CashFlowEvolutionChart';
import { ExpenseBreakdownChart } from './charts/ExpenseBreakdownChart';
import { MarginEvolutionChart } from './charts/MarginEvolutionChart';
import { TopClientsVerticalChart } from './charts/TopClientsVerticalChart';
import { OutstandingInvoicesChart } from './charts/OutstandingInvoicesChart';
import { PaymentStatusChart } from './charts/PaymentStatusChart';

// 🎨 Import D3.js Advanced Charts
import { SankeyFlowChart } from './charts/SankeyFlowChart';
import { SunburstExpensesChart } from './charts/SunburstExpensesChart';

// 🤖 Import ML Anomaly Detection
import { AnomalyPanel } from './AnomalyPanel';
import { detectAnomalies } from '@/lib/ml/anomalyDetector';
import type { Anomaly } from '@/lib/ml/types';

// ⌨️ Import Command Palette & Keyboard Shortcuts
import CommandPalette from './CommandPalette';
import { useKeyboard } from '@/lib/useKeyboard';
import { useTheme } from '@/lib/themeContext';

// 📡 Import Real-Time Collaboration
import PresenceIndicator from './realtime/PresenceIndicator';
import CursorTracker from './realtime/CursorTracker';
import RealtimeToast, { ToastNotification } from './realtime/RealtimeToast';
import { useRealtimeSync } from '@/lib/realtime/useRealtimeSync';

// 🔔 Import Alert Settings
import AlertSettings from './AlertSettings';

// Import AICopilot
import AICopilot from './AICopilot';

// Import EmptyDashboardState
import EmptyDashboardState from './EmptyDashboardState';

// 🎯 Import Score FinSight™
import FinSightScoreCard from './FinSightScoreCard';
import { calculateFinSightScore, FinSightScore } from '@/lib/scoring/finSightScore';

// 📈 Import Cash Flow Forecast
import CashFlowForecastCard from './forecasting/CashFlowForecastCard';
import { forecastCashFlow } from '@/lib/forecasting/cashFlowForecast';
import type { CashFlowForecast } from '@/lib/forecasting/types';

// Import KPITooltip
import KPITooltip from './KPITooltip';

// Import Drill-Down
import { useDrilldown } from '@/hooks/useDrilldown';
import { KPIDrilldownModal } from './drill-down/KPIDrilldownModal';
import { logger } from '@/lib/logger';

interface KPI {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    description: string
}

export default function FinancialDashboard() {
    const { data: session } = useSession();
    const { finSightData, setFinSightData, isDataLoaded, setIsDataLoaded, rawData, setRawData } = useFinancialData()
    const [selectedPeriod, setSelectedPeriod] = useState('current')
    const [kpis, setKpis] = useState<KPI[]>([])
    const [isExporting, setIsExporting] = useState(false)
    const [showUploadZone, setShowUploadZone] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
    const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null)
    const [levelInfo, setLevelInfo] = useState<DataLevelInfo | null>(null)
    const [upgradeMessages, setUpgradeMessages] = useState<string[]>([])
    const dashboardRef = useRef<HTMLDivElement>(null)

    // ✅ Nouveaux states pour les fonctionnalités
    const [showCompanyModal, setShowCompanyModal] = useState(false)
    const [companyName, setCompanyName] = useState('')
    const [companySector, setCompanySector] = useState<CompanySector>('services')
    const [isDemoMode, setIsDemoMode] = useState(false)
    const [isLoadingDemo, setIsLoadingDemo] = useState(false)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [loadingMessage, setLoadingMessage] = useState('')
    const [showUploadModal, setShowUploadModal] = useState(false) // ✅ Modal upload sur RDV
    const [selectedScenario, setSelectedScenario] = useState<'saine' | 'difficulte' | 'croissance'>('saine')

    // 🔮 States pour simulation What-If (3 simulations liées aux KPIs)
    const [showSimulation, setShowSimulation] = useState(false)
    const [chargesReduction, setChargesReduction] = useState(0) // 0 à 30% - Impact Marge
    const [paiementsAcceleration, setPaiementsAcceleration] = useState(0) // 0 à 15 jours - Impact Cash Flow
    const [prixAugmentation, setPrixAugmentation] = useState(0) // 0 à 15% - Impact CA
    const [simulatedKPIs, setSimulatedKPIs] = useState<KPI[]>([])

    // 🎯 Score FinSight™ state
    const [finSightScore, setFinSightScore] = useState<FinSightScore | null>(null)

    // 📈 Cash Flow Forecast state
    const [cashFlowForecast, setCashFlowForecast] = useState<CashFlowForecast | null>(null)

    // 🎯 Hook drill-down interactif
    const [drillDownState, drillDownActions] = useDrilldown();

    // 🤖 ML Anomaly Detection states
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [showAnomalies, setShowAnomalies] = useState(false);

    // ⌨️ Command Palette states
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';

    // 📡 Real-Time Sync states
    const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);

    // � Alert Settings state
    const [showAlertSettings, setShowAlertSettings] = useState(false);

    // �📡 Real-Time Sync hook
    const { broadcastKPIUpdate, broadcastFileUpload, broadcastDrillDown } = useRealtimeSync({
        enabled: isDataLoaded,
        onKPIUpdate: (event) => {
            // Show toast notification
            addToast({
                type: 'kpi-update',
                title: 'KPI mis à jour',
                message: `${event.kpiType} = ${event.value.toLocaleString()}€`,
            });
        },
        onFileUpload: (event) => {
            // Show toast notification
            addToast({
                type: 'file-upload',
                title: 'Nouveau fichier',
                message: `${event.userName} a importé ${event.fileName}`,
            });
        },
        onDrillDown: (data) => {
            logger.debug('Drill-down event received:', data);
        },
        onAnomalyDetected: (data) => {
            addToast({
                type: 'anomaly',
                title: 'Anomalie détectée',
                message: data.message || 'Nouvelle anomalie ML détectée',
            });
        },
    });

    // Function to add toast notification
    const addToast = (toast: Omit<ToastNotification, 'id'>) => {
        const id = `toast-${Date.now()}`;
        setToastNotifications(prev => [...prev, { ...toast, id }]);
    };

    // Function to dismiss toast
    const dismissToast = (id: string) => {
        setToastNotifications(prev => prev.filter(t => t.id !== id));
    };

    // 🎯 Fonction pour charger la démo avec animation
    const handleLoadDemo = async (scenario: 'saine' | 'difficulte' | 'croissance' = 'saine') => {
        setIsLoadingDemo(true);
        setLoadingProgress(0);
        setSelectedScenario(scenario);

        // Messages personnalisés par scénario
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
                setKpis(result.data.kpis);
                setFinSightData(result.data.financialData || result.data.processedData);
                setRawData(result.data.records || result.data.rawData || []);
                setDashboardConfig(result.data.dashboardConfig || result.data.config);
                setLevelInfo(result.data.levelInfo);
                setUpgradeMessages(result.data.upgradeMessages || []);
                setIsDataLoaded(true);
                setIsDemoMode(true);
                setCompanyName(config.companyName);
                setCompanySector(config.sector);

                // 🎯 Calculer Score FinSight™
                if (result.data.financialData || result.data.processedData) {
                    const processedData = result.data.financialData || result.data.processedData;
                    const score = calculateFinSightScore(processedData);
                    setFinSightScore(score);
                    console.log('✅ Score FinSight™ calculé:', score.total);

                    // 📈 Calculer Cash Flow Forecast
                    if (result.data.records && result.data.records.length >= 10) {
                        const forecast = forecastCashFlow(result.data.records, { horizon: 6 });
                        if (forecast) {
                            setCashFlowForecast(forecast);
                            console.log('✅ Forecast calculé: Runway', forecast.metrics.runway, 'mois');
                        }
                    }
                }

                setLoadingProgress(100);
                setLoadingMessage('✅ Dashboard prêt !');
                await new Promise(resolve => setTimeout(resolve, 300));

                logger.info('Démo chargée avec succès');
            } else {
                logger.error('Erreur API upload:', result);
                setLoadingMessage('❌ Erreur lors du chargement');
            }
        } catch (error) {
            logger.error('Erreur chargement démo:', error);
            setLoadingMessage('❌ Erreur lors du chargement');
        } finally {
            setTimeout(() => {
                setIsLoadingDemo(false);
                setLoadingProgress(0);
                setLoadingMessage('');
            }, 500);
        }
    };

    useEffect(() => {
        // ✅ État initial vide - pas de données factices
        // Le dashboard se construira après upload de données réelles
    }, [selectedPeriod])

    // Écouter l'événement d'upload depuis EmptyDashboardState
    useEffect(() => {
        const handleFileSelected = (event: Event) => {
            const customEvent = event as CustomEvent;
            handleFileUpload(customEvent.detail as FileList);
        };

        window.addEventListener('fileSelected', handleFileSelected);
        return () => window.removeEventListener('fileSelected', handleFileSelected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 🤖 Détecter anomalies automatiquement quand rawData change
    useEffect(() => {
        if (rawData && rawData.length > 0) {
            detectAnomaliesFromData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawData]);

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
                    // Trigger export PDF if data loaded
                    if (isDataLoaded && kpis.length > 0) {
                        const exportBtn = document.querySelector('[data-action="export-pdf"]') as HTMLButtonElement;
                        exportBtn?.click();
                    }
                },
                description: 'Exporter PDF'
            },
            {
                key: 'e',
                metaKey: true,
                shiftKey: true,
                action: () => {
                    // Trigger export Excel if data loaded
                    if (isDataLoaded && kpis.length > 0) {
                        const exportBtn = document.querySelector('[data-action="export-excel"]') as HTMLButtonElement;
                        exportBtn?.click();
                    }
                },
                description: 'Exporter Excel'
            },
            {
                key: 'a',
                metaKey: true,
                action: () => {
                    const copilotSection = document.querySelector('[data-copilot]');
                    copilotSection?.scrollIntoView({ behavior: 'smooth' });
                },
                description: 'Aller au Copilot IA'
            },
            {
                key: 'm',
                metaKey: true,
                action: () => setShowAnomalies(prev => !prev),
                description: 'Toggle Anomalies ML'
            },
            {
                key: 'r',
                metaKey: true,
                action: () => {
                    if (rawData && rawData.length > 0) {
                        detectAnomaliesFromData();
                    }
                },
                description: 'Actualiser données'
            },
            {
                key: 't',
                metaKey: true,
                action: toggleTheme,
                description: 'Toggle thème'
            }
        ],
        enabled: isDataLoaded
    });

    // Fonction d'export PDF professionnelle
    const exportToPDF = async () => {
        if (!dashboardRef.current || kpis.length === 0) return;

        setIsExporting(true);
        try {
            // Créer l'exporteur PDF
            const exporter = new FinancialPDFExporter();

            // Préparer les options
            const pdfOptions = {
                companyName: companyName || 'Entreprise',  // ✅ Utiliser le nom de l'entreprise
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
                includeCharts: true,  // ✅ Activer les graphiques
                includeMethodology: true,
                confidential: true,
                userPlan: session?.user?.plan || 'FREE' // ✨ Pass user plan for watermark
            };

            // Générer le PDF
            await exporter.generate(pdfOptions);

            // Télécharger
            const filename = `rapport-financier-${new Date().toISOString().split('T')[0]}.pdf`;
            exporter.download(filename);

        } catch (error) {
            logger.error('Erreur lors de l\'export PDF:', error);
            alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
        }
        setIsExporting(false);
    };

    // Fonction d'export Excel
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
            logger.error('Erreur lors de l\'export Excel:', error);
            alert('Erreur lors de l\'export Excel. Veuillez réessayer.');
        }
        setIsExporting(false);
    };

    // Fonction d'upload réelle
    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];

        // Validation simple
        const isCSV = file.name.endsWith('.csv');
        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

        if (!isCSV && !isExcel) {
            setUploadStatus('error');
            setTimeout(() => setUploadStatus('idle'), 3000);
            return;
        }

        setUploadStatus('uploading');

        try {
            // Lecture du fichier
            let fileContent: string;

            if (isExcel) {
                // Pour Excel, lire en ArrayBuffer puis convertir en base64
                fileContent = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const arrayBuffer = e.target?.result as ArrayBuffer;
                        // Convertir en base64
                        const uint8Array = new Uint8Array(arrayBuffer);
                        const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                        const base64 = btoa(binaryString);
                        resolve(base64);
                    };
                    reader.onerror = (e) => reject(e);
                    reader.readAsArrayBuffer(file);
                });
            } else {
                // Pour CSV, lire en texte
                fileContent = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.onerror = (e) => reject(e);
                    reader.readAsText(file);
                });
            }

            // Envoi à l'API
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileContent,
                    fileName: file.name,
                    fileType: file.type
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de l\'upload');
            }

            // Mise à jour avec la configuration adaptative
            setKpis(result.data.kpis);

            // ✅ Stocker les données dans le contexte global pour le copilote
            if (result.data) {
                setFinSightData(result.data);
                setRawData(result.data.records || []);
                setIsDataLoaded(true);
                logger.debug('rawData défini dans contexte:', result.data.records?.length, 'enregistrements');

                // 🎯 Calculer Score FinSight™
                if (result.data.financialData || result.data.processedData || result.data) {
                    const processedData = result.data.financialData || result.data.processedData || result.data;
                    const score = calculateFinSightScore(processedData);
                    setFinSightScore(score);
                    console.log('✅ Score FinSight™ calculé:', score.total);

                    // 📈 Calculer Cash Flow Forecast
                    if (result.data.records && result.data.records.length >= 10) {
                        const forecast = forecastCashFlow(result.data.records, { horizon: 6 });
                        if (forecast) {
                            setCashFlowForecast(forecast);
                            console.log('✅ Forecast calculé: Runway', forecast.metrics.runway, 'mois');
                        }
                    }
                }
            }

            // Vérifier la configuration
            logger.debug('Configuration:', {
                levelInfo: result.data.levelInfo,
                dashboardConfig: result.data.dashboardConfig,
                recordsCount: result.data.records?.length || 0
            });

            // Configuration du dashboard selon les données
            if (result.data.levelInfo && result.data.dashboardConfig) {
                console.log('✅ Configuration adaptative appliquée:', result.data.dashboardConfig);
                setLevelInfo(result.data.levelInfo);
                setDashboardConfig(result.data.dashboardConfig);
                setUpgradeMessages(getUpgradeMessages(result.data.levelInfo));
            } else {
                console.log('❌ Configuration adaptative manquante');
            }

            setUploadStatus('success');

            // 📡 Broadcast file upload event
            broadcastFileUpload(file.name, file.size, companyName || 'Utilisateur');

            // ✅ Afficher le modal secteur après upload réussi
            setShowCompanyModal(true);

            // Auto-fermer la zone d'upload après succès
            setTimeout(() => {
                setUploadStatus('idle');
                setShowUploadZone(false);
            }, 2000);

        } catch (error) {
            console.error('Erreur upload:', error);
            setUploadStatus('error');
            setTimeout(() => setUploadStatus('idle'), 3000);
        }
    };

    // ✅ Plus de données par période factices - tout vient de l'upload CSV
    const getPeriodData = (period: string) => {
        return {
            title: 'Période Actuelle',
            data: [] // Vide - les vraies données viennent de handleFileUpload
        };
    };

    // 🔮 Fonction de calcul des KPIs simulés (3 simulations liées aux KPIs)
    const calculateSimulatedKPIs = () => {
        if (!isDataLoaded || kpis.length === 0 || !rawData) return;

        // 📊 Extraire les valeurs actuelles des KPIs (Vocabulaire V3)
        const caKPI = kpis.find(k => k.title.includes('Revenus') || k.title.includes('Chiffre d\'Affaires'));
        const chargesKPI = kpis.find(k => k.title.includes('Charges'));
        const margeKPI = kpis.find(k => k.title.includes('Marge'));
        const cashFlowKPI = kpis.find(k => k.title.includes('Cash') || k.title.includes('Liquidité') || k.title.includes('Trésorerie'));

        const currentCA = parseFloat(caKPI?.value.replace(/[^0-9.-]/g, '') || '0');
        const currentCharges = parseFloat(chargesKPI?.value.replace(/[^0-9.-]/g, '') || '0');
        const currentMarge = parseFloat(margeKPI?.value.replace(/[^0-9.-]/g, '') || '0');
        const currentCashFlow = parseFloat(cashFlowKPI?.value.replace(/[^0-9.-]/g, '') || '0');

        // 💰 Calculer depuis rawData réel
        const totalRevenue = rawData
            .filter((r: any) => r.type === 'income')
            .reduce((sum: number, r: any) => sum + r.amount, 0);

        const totalExpenses = rawData
            .filter((r: any) => r.type === 'expense')
            .reduce((sum: number, r: any) => sum + Math.abs(r.amount), 0);

        const pendingInvoices = rawData
            .filter((r: any) => r.type === 'income' && r.paymentStatus === 'En attente')
            .reduce((sum: number, r: any) => sum + r.amount, 0);

        // 🎯 SIMULATION 1: Réduction charges → Impact Marge
        const newCharges = totalExpenses * (1 - chargesReduction / 100);
        const economiesCharges = totalExpenses - newCharges;
        const newMarge = ((totalRevenue - newCharges) / totalRevenue) * 100;
        const margeDiff = newMarge - currentMarge;

        // 🎯 SIMULATION 2: Accélération paiements → Impact Cash Flow
        const daysAcceleration = paiementsAcceleration;
        const cashLiberated = (pendingInvoices / 30) * daysAcceleration; // Cash libéré par jour
        const newCashFlow = currentCashFlow + cashLiberated;

        // 🎯 SIMULATION 3: Augmentation prix → Impact CA
        const newCA = totalRevenue * (1 + prixAugmentation / 100);
        const caDiff = newCA - totalRevenue;

        // 📊 Créer les KPIs simulés
        const simulated: KPI[] = kpis.map(kpi => {
            // KPI CA / Revenus (V3)
            if (kpi.title.includes('Revenus') || kpi.title.includes('Chiffre d\'Affaires')) {
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

            // KPI Cash Flow / Liquidité (V3)
            if (kpi.title.includes('Cash') || kpi.title.includes('Liquidité') || kpi.title.includes('Trésorerie')) {
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

    // 🔄 Recalculer les KPIs simulés quand les sliders changent
    useEffect(() => {
        if (chargesReduction > 0 || paiementsAcceleration > 0 || prixAugmentation > 0) {
            calculateSimulatedKPIs();
        } else {
            setSimulatedKPIs([]);
        }
    }, [chargesReduction, paiementsAcceleration, prixAugmentation, kpis, rawData]);

    // ✅ KPIs chargés seulement depuis l'upload - pas de données factices par défaut
    // useEffect(() => {
    //     const periodData = getPeriodData(selectedPeriod);
    //     setKpis(periodData.data);
    // }, [selectedPeriod])

    const getChangeColor = (type: KPI['changeType']) => {
        switch (type) {
            case 'positive': return 'finsight-trend-up'
            case 'negative': return 'finsight-trend-down'
            default: return 'finsight-trend-neutral'
        }
    }

    const getChangeIcon = (type: KPI['changeType']) => {
        switch (type) {
            case 'positive': return '↗'
            case 'negative': return '↘'
            default: return '→'
        }
    }

    // ✅ AMÉLIORATION 1: Icônes pour chaque KPI
    const getKPIIcon = (title: string): string => {
        if (title.includes('Chiffre') || title.includes('Affaires') || title.includes('CA')) return '💰';
        if (title.includes('Charges') || title.includes('Dépenses')) return '📉';
        if (title.includes('Marge')) return '📊';
        if (title.includes('Cash') || title.includes('Trésorerie')) return '💵';
        if (title.includes('DSO') || title.includes('Délai')) return '⏱️';
        if (title.includes('BFR') || title.includes('Besoin')) return '🔄';
        if (title.includes('Clients')) return '👥';
        if (title.includes('Créances')) return '📄';
        return '📈'; // Défaut
    };

    // ✅ AMÉLIORATION 2: Contextualiser les variations
    const formatChangeWithContext = (change: string): string => {
        // Si la variation contient déjà "vs" ou "par rapport", on la garde telle quelle
        if (change.includes('vs') || change.includes('par rapport')) return change;
        // Sinon on ajoute "vs période précédente"
        return `${change} vs période précédente`;
    };

    // ✅ AMÉLIORATION 3: Tooltip intelligent pour "Excellent"
    const getBenchmarkTooltip = (kpiTitle: string, value: number, level: string): string => {
        if (!companySector) return '';

        if (kpiTitle.includes('Marge Nette')) {
            return `Votre marge (${value.toFixed(1)}%) dépasse 95% des entreprises ${companySector}.\nMédiane secteur: 10% | Vous: ${value.toFixed(1)}%`;
        }
        if (kpiTitle.includes('DSO')) {
            return `Votre DSO (${value} jours) est meilleur que 95% des entreprises ${companySector}.\nMédiane secteur: 45 jours | Vous: ${value} jours`;
        }
        return `Performance ${level} pour le secteur ${companySector}`;
    };

    // ✅ Fonctions pour calculer des vraies données depuis les records
    const getTopClients = () => {
        if (!rawData || !rawData.length) return [];

        // Grouper par contrepartie et calculer les totaux (SEULEMENT les revenus)
        const clientTotals = rawData
            .filter((record: any) => record.type === 'income') // ✅ Exclure les charges (URSSAF, etc.)
            .reduce((acc: any, record: any) => {
                const client = record.counterparty || record.description || 'Client inconnu';
                if (!acc[client]) {
                    acc[client] = { name: client, total: 0, count: 0 };
                }
                acc[client].total += record.amount;
                acc[client].count += 1;
                return acc;
            }, {});

        // Trier et prendre le top 5
        return Object.values(clientTotals)
            .sort((a: any, b: any) => b.total - a.total)
            .slice(0, 5)
            .map((client: any) => ({
                name: client.name,
                value: `${client.total.toLocaleString('fr-FR')} €`,
                total: client.total,  // ✅ Ajouter le total numérique pour les charts
                count: client.count
            }));
    };

    const getEvolutionData = () => {
        if (!rawData || !rawData.length) return [];

        // Grouper par mois depuis les vraies données
        const monthlyData = rawData.reduce((acc: any, record: any) => {
            const month = new Date(record.date).toLocaleDateString('fr-FR', { month: 'short' });
            if (!acc[month]) {
                acc[month] = 0;
            }
            acc[month] += record.amount;
            return acc;
        }, {});

        return Object.entries(monthlyData).map(([month, amount]: [string, any]) => ({
            month,
            amount: amount,
            display: `${(amount / 1000).toFixed(0)}k`
        }));
    };

    // Helper pour vérifier si un élément doit être affiché
    const shouldShowElement = (element: keyof DashboardConfig): boolean => {
        console.log(`🔍 shouldShowElement('${element}'):`, {
            hasDashboardConfig: !!dashboardConfig,
            configValue: dashboardConfig?.[element],
            result: !dashboardConfig ? false : dashboardConfig[element] as boolean
        });

        if (!dashboardConfig) return false; // ✅ Si pas de config, on n'affiche RIEN (sauf KPIs de base)
        return dashboardConfig[element] as boolean;
    }

    // ✅ Handler modal secteur
    const handleCompanyInfoSubmit = (name: string, sector: CompanySector) => {
        setCompanyName(name);
        setCompanySector(sector);
        setShowCompanyModal(false);
        console.log(`✅ Entreprise configurée: ${name} (${sector})`);
    };

    // ✅ Extraire les valeurs numériques des KPIs pour les benchmarks
    const getKPINumericValue = (kpiTitle: string): number | undefined => {
        const kpi = kpis.find(k => k.title.includes(kpiTitle));
        if (!kpi) return undefined;

        // Parser la valeur (ex: "45 jours" → 45, "12.5%" → 12.5, "-134.7%" → -134.7, "50 510 €" → 50510)
        // Supprimer tous les espaces, puis extraire les chiffres et virgules/points (avec signe optionnel)
        const cleanValue = kpi.value.replace(/\s/g, '');
        const match = cleanValue.match(/-?[\d,.]+/);
        if (!match) return undefined;

        return parseFloat(match[0].replace(',', '.'));
    };

    // ✅ Calculer le % de Cash Flow pour le benchmark (Cash Flow / CA * 100)
    const getCashFlowPercentage = (): number => {
        const cashFlow = getKPINumericValue('Cash') || getKPINumericValue('Liquidité');
        const revenue = getKPINumericValue('Revenus') || getKPINumericValue('Affaires'); // V3: "Revenus & Croissance"
        if (!cashFlow || !revenue || revenue === 0) return 0;
        return (cashFlow / revenue) * 100;
    };

    // ✅ Préparer données mensuelles pour CashFlowEvolutionChart
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

    // ✅ Calculer croissance cash flow pour annotation
    const getCashFlowGrowth = () => {
        const monthlyData = getMonthlyData();
        if (monthlyData.length < 2) return { growth: 0, firstMonth: 0, lastMonth: 0, displayText: '' };

        const firstMonth = monthlyData[0];
        const lastMonth = monthlyData[monthlyData.length - 1];

        const firstCF = firstMonth.cashFlow;
        const lastCF = lastMonth.cashFlow;

        const growth = firstCF !== 0 ? ((lastCF - firstCF) / Math.abs(firstCF)) * 100 : 0;

        return {
            growth: growth.toFixed(0),
            firstMonth: Math.round(firstCF / 1000),
            lastMonth: Math.round(lastCF / 1000),
            displayText: `${Math.round(firstCF / 1000)}k€ → ${Math.round(lastCF / 1000)}k€ (${growth > 0 ? '+' : ''}${growth.toFixed(0)}%)`
        };
    };

    // ✅ Préparer répartition des charges par catégorie pour ExpenseBreakdownChart
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
            .sort((a, b) => b.value - a.value); // Trier par montant décroissant

        // ✅ Regrouper les catégories < 3% en "Autres"
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

    // 🎨 TODO 6: Fonction getSankeyData() pour formater données Sankey (Revenus → Charges → Cash Flow)
    const getSankeyData = () => {
        if (!rawData || rawData.length === 0) return { nodes: [], links: [] };

        // Calculer totaux
        const totalRevenue = rawData
            .filter((r: any) => r.type === 'income')
            .reduce((sum: number, r: any) => sum + r.amount, 0);

        const totalExpenses = rawData
            .filter((r: any) => r.type === 'expense')
            .reduce((sum: number, r: any) => sum + r.amount, 0);

        const cashFlow = totalRevenue - totalExpenses;

        // Nodes: [Revenus, Charges, Cash Flow Net]
        const nodes = [
            { name: 'Revenus' },
            { name: 'Charges' },
            { name: 'Cash Flow Net' }
        ];

        // Links: Revenus → Charges, Revenus → Cash Flow
        const links = [
            { source: 0, target: 1, value: totalExpenses }, // Revenus → Charges
            { source: 0, target: 2, value: Math.max(0, cashFlow) } // Revenus → Cash Flow (si positif)
        ];

        return { nodes, links };
    };

    // 🎨 TODO 7: Fonction getSunburstData() pour structure hiérarchique expenses
    const getSunburstData = () => {
        if (!rawData || rawData.length === 0) {
            return {
                name: 'Dépenses',
                children: []
            };
        }

        const expenses = rawData.filter((r: any) => r.type === 'expense');
        if (expenses.length === 0) {
            return {
                name: 'Dépenses',
                children: []
            };
        }

        // Regrouper par catégorie et sous-catégorie
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

        // Construire structure hiérarchique
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

    // Fonction detectAnomaliesFromData() - Détection ML automatique
    const detectAnomaliesFromData = () => {
        if (!rawData || rawData.length === 0) {
            setAnomalies([]);
            return;
        }

        try {
            const result = detectAnomalies(rawData, {
                zScoreThreshold: 3,
                iqrMultiplier: 1.5,
                paymentDelayDays: 30,
                categorySpikeFactor: 2.5,
                minConfidence: 0.7
            });

            setAnomalies(result.anomalies);

            // Auto-show panel si anomalies critiques ou high
            const criticalCount = result.summary.byRisk.critical + result.summary.byRisk.high;
            if (criticalCount > 0 && !showAnomalies) {
                setShowAnomalies(true);
            }

            logger.debug(`ML Anomaly Detection: ${result.anomalies.length} anomalies détectées en ${result.executionTime}ms`);
        } catch (error) {
            logger.error('Erreur détection anomalies:', error);
            setAnomalies([]);
        }
    };

    // ✅ Préparer données Top Clients pour TopClientsChart

    // ✅ Préparer données Marge Nette par mois pour MarginEvolutionChart
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

    // ✅ Calculer progression marge pour affichage delta
    const getMarginGrowth = () => {
        const marginData = getMarginData();
        if (marginData.length < 2) return { delta: 0, displayText: '' };

        const firstMargin = marginData[0].marginPercentage;
        const lastMargin = marginData[marginData.length - 1].marginPercentage;
        const delta = lastMargin - firstMargin;

        return {
            delta: delta.toFixed(0),
            displayText: `${delta > 0 ? '+' : ''}${delta.toFixed(0)} points vs ${marginData[0].month}`
        };
    };

    // ✅ Préparer données Top Clients pour TopClientsVerticalChart
    const getTopClientsBarData = () => {
        const clients = getTopClients();
        return clients.map(client => ({
            name: client.name,
            value: client.total // Utiliser directement le total numérique
        }));
    };

    // ✅ Calculer le CA total et % du Top 5
    const getTopClientsPercentage = () => {
        if (!rawData || rawData.length === 0) return { percentage: 0, topTotal: 0, totalCA: 0 };

        // CA total = somme de tous les revenus
        const totalCA = rawData
            .filter((r: any) => r.type === 'income')
            .reduce((sum: number, r: any) => sum + r.amount, 0);

        // Top 5 total
        const topClients = getTopClients();
        const topTotal = topClients.reduce((sum, client) => sum + client.total, 0);

        const percentage = totalCA > 0 ? (topTotal / totalCA) * 100 : 0;

        return {
            percentage: percentage.toFixed(0),
            topTotal,
            totalCA
        };
    };

    // ✅ Préparer données Top 5 Créances en Attente (Outstanding Invoices)
    const getTopOutstandingInvoices = () => {
        if (!rawData || rawData.length === 0) return [];

        // Filtrer uniquement revenues non payés (En attente ou En cours)
        const unpaidInvoices = rawData.filter((r: any) => {
            const isIncome = r.type === 'income';
            const hasStatus = r.paymentStatus !== undefined && r.paymentStatus !== null;
            const isUnpaid = r.paymentStatus === 'En attente' || r.paymentStatus === 'En cours';
            return isIncome && isUnpaid;
        });

        if (unpaidInvoices.length === 0) return [];

        // Date actuelle pour calcul retard (CSV contient données 2024)
        const today = new Date('2024-11-30');

        return unpaidInvoices
            .map((r: any) => {
                const dueDate = r.dueDate ? new Date(r.dueDate) : null;
                const daysLate = dueDate ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

                return {
                    name: r.counterparty || r.description || 'Client inconnu',
                    value: r.amount,
                    daysLate,
                    dueDate: dueDate ? dueDate.toLocaleDateString('fr-FR') : 'N/A',
                    isLate: daysLate > 0
                };
            })
            .sort((a, b) => {
                // Tri hybride: d'abord par urgence (en retard vs pas en retard), puis par montant
                if (a.daysLate > 0 && b.daysLate <= 0) return -1; // a en retard, b pas encore échu → a d'abord
                if (a.daysLate <= 0 && b.daysLate > 0) return 1;  // b en retard, a pas encore échu → b d'abord
                // Si même catégorie (tous deux en retard ou tous deux pas échus), trier par montant
                return b.value - a.value;
            })
            .slice(0, 5);
    };

    // ✅ Calculer le total de TOUTES les créances en attente (pas seulement Top 5)
    const getTotalOutstandingInvoices = () => {
        if (!rawData || rawData.length === 0) return 0;

        return rawData
            .filter((r: any) => {
                const isIncome = r.type === 'income';
                const isUnpaid = r.paymentStatus === 'En attente' || r.paymentStatus === 'En cours';
                return isIncome && isUnpaid;
            })
            .reduce((sum: number, r: any) => sum + r.amount, 0);
    };

    // ✅ Préparer données Statuts de Paiement
    const getPaymentStatusData = (): Array<{ status: string; amount: number; count: number }> => {
        if (!rawData || rawData.length === 0) return [];

        const statusGroups = rawData.reduce((acc: any, r: any) => {
            const status = r.paymentStatus || 'Inconnu';
            if (!acc[status]) {
                acc[status] = { status, amount: 0, count: 0 };
            }
            acc[status].amount += Math.abs(r.amount);
            acc[status].count += 1;
            return acc;
        }, {});

        return (Object.values(statusGroups) as Array<{ status: string; amount: number; count: number }>).sort((a, b) => {
            const order: { [key: string]: number } = { 'Payé': 1, 'En attente': 2, 'En cours': 3 };
            return (order[a.status] || 99) - (order[b.status] || 99);
        });
    };

    // ✅ Calculer taux d'encaissement
    const getCollectionRate = () => {
        const statusData = getPaymentStatusData();
        if (statusData.length === 0) return { rate: 0, displayText: '' };

        const totalAmount = statusData.reduce((sum, s) => sum + s.amount, 0);
        const paidData = statusData.find(s => s.status === 'Payé');
        const paidAmount = paidData ? paidData.amount : 0;

        const rate = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

        return {
            rate: rate.toFixed(0),
            displayText: `Taux d'encaissement : ${rate.toFixed(0)}%`
        };
    };


    return (
        <div className="finsight-dashboard-container" ref={dashboardRef}>
            {/* Header with Period Selector */}
            <div className="finsight-dashboard-header">
                <div className="finsight-dashboard-header-content">
                    <h2 className="finsight-dashboard-title">Tableau de Bord Financier</h2>
                    <p className="finsight-dashboard-subtitle">{getPeriodData(selectedPeriod).title}</p>
                </div>
                <div className="finsight-dashboard-controls">
                    <div className="finsight-period-selector">
                        <CalendarIcon className="finsight-icon-sm" />
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="finsight-select"
                        >
                            <option value="current">Période Actuelle</option>
                            <option value="monthly">Vue Mensuelle</option>
                            <option value="quarterly">Vue Trimestrielle</option>
                            <option value="yearly">Vue Annuelle</option>
                        </select>
                    </div>
                    <button
                        onClick={exportToPDF}
                        disabled={isExporting}
                        data-action="export-pdf"
                        className="finsight-btn finsight-btn-revolutionary"
                    >
                        <DocumentArrowDownIcon className="finsight-icon-sm" />
                        <span>{isExporting ? 'Export...' : 'Export PDF'}</span>
                    </button>
                    <button
                        onClick={exportToExcel}
                        disabled={isExporting}
                        data-action="export-excel"
                        className="finsight-btn finsight-btn-secondary"
                        style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none'
                        }}
                    >
                        <DocumentArrowDownIcon className="finsight-icon-sm" />
                        <span>{isExporting ? 'Export...' : 'Export Excel'}</span>
                    </button>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="finsight-btn finsight-btn-secondary"
                    >
                        <CloudArrowUpIcon className="finsight-icon-sm" />
                        <span>Importer Données</span>
                    </button>

                    {/* � Alert Settings Button */}
                    {isDataLoaded && (
                        <button
                            onClick={() => setShowAlertSettings(true)}
                            className="finsight-btn finsight-btn-secondary relative group"
                            title="Configurer les alertes email"
                        >
                            <BellAlertIcon className="finsight-icon-sm" />
                            <span className="hidden md:inline">Alertes</span>
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        </button>
                    )}

                    {/* �📡 Real-Time Presence Indicator */}
                    <PresenceIndicator enabled={isDataLoaded} />
                </div>
            </div>

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
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '20px'
                    }}
                    onClick={() => setShowUploadModal(false)}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            borderRadius: '24px',
                            maxWidth: '600px',
                            width: '100%',
                            padding: '48px 40px',
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Bouton fermer */}
                        <button
                            onClick={() => setShowUploadModal(false)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#fff',
                                fontSize: '20px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        >
                            ✕
                        </button>

                        {/* Icône */}
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>💎</div>
                            <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                                Analyse de VOS données
                            </h3>
                            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6' }}>
                                Cette fonctionnalité est disponible uniquement sur rendez-vous pour garantir une analyse optimale et personnalisée.
                            </p>
                        </div>

                        {/* Bénéfices */}
                        <div style={{ marginBottom: '32px' }}>
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
                                � Nous contacter
                            </a>
                        </div>

                        {/* Note de bas */}
                        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                            🔒 Vos données restent 100% confidentielles
                        </p>
                    </div>
                </div>
            )}

            {/* 🎯 BANDEAU MODE DÉMO - Sticky en haut */}
            {isDemoMode && kpis.length > 0 && (
                <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                    background: 'linear-gradient(135deg, rgba(15, 61, 122, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '24px',
                    border: '2px solid rgba(251, 191, 36, 0.3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '24px' }}>💡</span>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>
                                    MODE DÉMONSTRATION
                                </h3>
                            </div>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.95)', fontWeight: '600', margin: 0 }}>
                                📊 Obtenez votre dashboard personnalisé :
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                    color: '#1f2937',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                📅 Prendre rendez-vous
                            </a>

                        </div>
                    </div>
                </div>
            )}

            {/* 🎬 Animation de chargement démo */}
            {isLoadingDemo && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: '24px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        border: '6px solid rgba(59, 130, 246, 0.2)',
                        borderTop: '6px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                            {loadingMessage}
                        </h3>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '999px',
                            overflow: 'hidden',
                            marginTop: '16px'
                        }}>
                            <div style={{
                                width: `${loadingProgress}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                                borderRadius: '999px',
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
                            {loadingProgress}% complété
                        </p>
                    </div>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `
                    }} />
                </div>
            )}

            {/* ✅ État vide - Juste le bouton démo */}
            {!isLoadingDemo && kpis.length === 0 && !showUploadZone && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: '48px',
                    padding: '48px 24px',
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>
                    {/* Titre principal */}
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{
                            fontSize: '36px',
                            fontWeight: '700',
                            color: '#1f2937',
                            marginBottom: '16px',
                            lineHeight: '1.2'
                        }}>
                            Votre Dashboard s'adapte à vos données
                        </h2>
                        <p style={{
                            fontSize: '18px',
                            color: '#6b7280',
                            lineHeight: '1.6'
                        }}>
                            FinSight analyse automatiquement votre fichier et génère les KPIs pertinents.
                        </p>
                    </div>

                    {/* Sélecteur de scénarios de démo */}
                    <div style={{
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '24px'
                        }}>
                            Choisissez un scénario de démonstration
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            maxWidth: '900px',
                            margin: '0 auto'
                        }}>
                            {/* Scénario 1: PME Saine */}
                            <button
                                onClick={() => handleLoadDemo('saine')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '24px 20px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                                    textAlign: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)';
                                }}
                            >
                                <span style={{ fontSize: '36px', marginBottom: '12px' }}>🟢</span>
                                <span style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>PME Services</span>
                                <span style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.4' }}>Santé financière solide</span>
                                <span style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px' }}>243k€ CA • Marges saines</span>
                            </button>

                            {/* Scénario 2: Startup Difficulté */}
                            <button
                                onClick={() => handleLoadDemo('difficulte')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '24px 20px',
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
                                    textAlign: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(245, 158, 11, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.3)';
                                }}
                            >
                                <span style={{ fontSize: '36px', marginBottom: '12px' }}>🟠</span>
                                <span style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Startup SaaS</span>
                                <span style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.4' }}>Difficulté trésorerie</span>
                                <span style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px' }}>30k€ CA • Créances bloquées</span>
                            </button>

                            {/* Scénario 3: Scale-up Croissance */}
                            <button
                                onClick={() => handleLoadDemo('croissance')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '24px 20px',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                                    textAlign: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.3)';
                                }}
                            >
                                <span style={{ fontSize: '36px', marginBottom: '12px' }}>🚀</span>
                                <span style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Scale-up Tech</span>
                                <span style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.4' }}>Hypercroissance</span>
                                <span style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px' }}>1.2M€ CA • Série A 500k€</span>
                            </button>
                        </div>

                        <p style={{
                            fontSize: '14px',
                            color: '#9ca3af',
                            marginTop: '24px',
                            lineHeight: '1.6'
                        }}>
                            Données de démonstration • 4 mois de transactions • Format CSV réaliste
                        </p>
                    </div>
                </div>
            )}            {/* ✅ Contenu principal - Affiché seulement après upload de données */}
            {!isLoadingDemo && kpis.length > 0 && (
                <>
                    {/* 🎯 Score FinSight™ - CARTE PRINCIPALE EN TOP (V3) */}
                    {finSightScore && (
                        <div className="mb-8">
                            <FinSightScoreCard score={finSightScore} />
                        </div>
                    )}

                    {/* 📈 Cash Flow Forecast - Prévisions & Scénarios */}
                    {cashFlowForecast && (
                        <div className="mb-8">
                            <CashFlowForecastCard forecast={cashFlowForecast} />
                        </div>
                    )}

                    {/* Message si pas assez de données pour forecast */}
                    {!cashFlowForecast && rawData && rawData.length > 0 && rawData.length < 10 && (
                        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 text-3xl">📊</div>
                                <div>
                                    <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">
                                        Prévisions Trésorerie disponibles bientôt
                                    </h3>
                                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                                        Vous avez {rawData.length} transaction(s). Minimum 10 transactions requises pour activer les prévisions 6 mois.
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                        💡 Uploadez un fichier avec au moins 2 mois de données (historique complet recommandé)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KPI Grid */}
                    <div className="finsight-kpi-grid" data-count={kpis.length}>
                        {(simulatedKPIs.length > 0 ? simulatedKPIs : kpis).map((kpi, index) => (
                            <div
                                key={index}
                                className="finsight-kpi-card finsight-kpi-hover"
                                onClick={() => drillDownActions.openDrillDown(kpi.title)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="finsight-kpi-header">
                                    <div className="flex items-center gap-1">
                                        <span style={{ fontSize: '1.2rem', marginRight: '4px' }}>{getKPIIcon(kpi.title)}</span>
                                        <h3 className="finsight-kpi-label">{kpi.title}</h3>
                                        <KPITooltip kpiTitle={kpi.title} />
                                    </div>
                                    <span className={`finsight-kpi-change ${getChangeColor(kpi.changeType)}`}>
                                        {getChangeIcon(kpi.changeType)} {formatChangeWithContext(kpi.change)}
                                    </span>
                                </div>
                                <p className="finsight-kpi-value">{kpi.value}</p>
                                <p className="finsight-kpi-description">{kpi.description}</p>

                                {/* ✅ Benchmark Bar pour chaque KPI */}
                                {companySector && kpi.title.includes('DSO') && (
                                    <BenchmarkBar
                                        kpiName="DSO"
                                        currentValue={getKPINumericValue('DSO') || 0}
                                        sector={companySector}
                                        unit=" jours"
                                        inverse={true}
                                    />
                                )}
                                {companySector && kpi.title.includes('BFR') && (
                                    <BenchmarkBar
                                        kpiName="BFR"
                                        currentValue={getKPINumericValue('BFR') || 0}
                                        sector={companySector}
                                        unit=" jours"
                                        inverse={true}
                                    />
                                )}
                                {companySector && kpi.title.includes('Marge Nette') && (
                                    <BenchmarkBar
                                        kpiName="MARGE_NETTE"
                                        currentValue={getKPINumericValue('Marge') || 0}
                                        sector={companySector}
                                        unit="%"
                                        inverse={false}
                                    />
                                )}
                                {companySector && kpi.title.includes('Marge Brute') && (
                                    <BenchmarkBar
                                        kpiName="MARGE_BRUTE"
                                        currentValue={getKPINumericValue('Brute') || 0}
                                        sector={companySector}
                                        unit="%"
                                        inverse={false}
                                    />
                                )}
                                {companySector && kpi.title.includes('Cash Flow') && !kpi.title.includes('Marge') && (
                                    <BenchmarkBar
                                        kpiName="CASH_FLOW"
                                        currentValue={getCashFlowPercentage()}
                                        sector={companySector}
                                        unit="%"
                                        inverse={false}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 🔮 SIMULATION WHAT-IF PANEL - 3 simulations liées aux KPIs */}
                    {isDataLoaded && (
                        <div style={{
                            marginTop: '32px',
                            marginBottom: '32px',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '16px',
                            padding: '24px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: showSimulation ? '28px' : '0'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '28px' }}>🔮</span>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#e2e8f0', marginBottom: '4px' }}>
                                            Simulation What-If
                                        </h3>
                                        <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                                            Mesurez l'impact financier de vos décisions en temps réel
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowSimulation(!showSimulation)}
                                    style={{
                                        background: showSimulation ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        color: '#a5b4fc',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {showSimulation ? '▼ Réduire' : '▶ Développer'}
                                </button>
                            </div>

                            {/* 3 Simulations */}
                            {showSimulation && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: '20px'
                                }}>
                                    {/* SIMULATION 1: Réduction Charges → Marge */}
                                    <div style={{
                                        background: 'rgba(15, 23, 42, 0.6)',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        border: chargesReduction > 0 ? '2px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(99, 102, 241, 0.15)'
                                    }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '24px' }}>💰</span>
                                                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', margin: 0 }}>
                                                    Optimisation des charges
                                                </h4>
                                            </div>
                                            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.4', margin: 0 }}>
                                                Impact sur <strong style={{ color: '#10b981' }}>Marge Nette</strong>
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Réduction</span>
                                                <span style={{ fontSize: '20px', fontWeight: '700', color: chargesReduction > 0 ? '#10b981' : '#6366f1' }}>
                                                    -{chargesReduction}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="30"
                                                step="5"
                                                value={chargesReduction}
                                                onChange={(e) => setChargesReduction(Number(e.target.value))}
                                                style={{
                                                    width: '100%',
                                                    height: '6px',
                                                    borderRadius: '3px',
                                                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(chargesReduction / 30) * 100}%, rgba(99, 102, 241, 0.2) ${(chargesReduction / 30) * 100}%, rgba(99, 102, 241, 0.2) 100%)`,
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                                <span style={{ fontSize: '11px', color: '#64748b' }}>0%</span>
                                                <span style={{ fontSize: '11px', color: '#64748b' }}>30%</span>
                                            </div>
                                        </div>

                                        {chargesReduction > 0 && simulatedKPIs.length > 0 && (
                                            <div style={{
                                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                border: '1px solid rgba(16, 185, 129, 0.3)'
                                            }}>
                                                <p style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', marginBottom: '6px' }}>
                                                    � Impact:
                                                </p>
                                                <p style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: '700', margin: 0 }}>
                                                    {simulatedKPIs.find(k => k.title.includes('Marge'))?.change || 'Calcul...'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* SIMULATION 2: Accélération Paiements → Cash Flow */}
                                    <div style={{
                                        background: 'rgba(15, 23, 42, 0.6)',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        border: paiementsAcceleration > 0 ? '2px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(99, 102, 241, 0.15)'
                                    }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '24px' }}>⚡</span>
                                                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', margin: 0 }}>
                                                    Accélération paiements
                                                </h4>
                                            </div>
                                            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.4', margin: 0 }}>
                                                Impact sur <strong style={{ color: '#8b5cf6' }}>Cash Flow Net</strong>
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Gain de délai</span>
                                                <span style={{ fontSize: '20px', fontWeight: '700', color: paiementsAcceleration > 0 ? '#8b5cf6' : '#6366f1' }}>
                                                    -{paiementsAcceleration} jours
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="15"
                                                step="3"
                                                value={paiementsAcceleration}
                                                onChange={(e) => setPaiementsAcceleration(Number(e.target.value))}
                                                style={{
                                                    width: '100%',
                                                    height: '6px',
                                                    borderRadius: '3px',
                                                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(paiementsAcceleration / 15) * 100}%, rgba(99, 102, 241, 0.2) ${(paiementsAcceleration / 15) * 100}%, rgba(99, 102, 241, 0.2) 100%)`,
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                                <span style={{ fontSize: '11px', color: '#64748b' }}>0j</span>
                                                <span style={{ fontSize: '11px', color: '#64748b' }}>15j</span>
                                            </div>
                                        </div>

                                        {paiementsAcceleration > 0 && simulatedKPIs.length > 0 && (
                                            <div style={{
                                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(109, 40, 217, 0.1) 100%)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                border: '1px solid rgba(139, 92, 246, 0.3)'
                                            }}>
                                                <p style={{ fontSize: '12px', color: '#a78bfa', fontWeight: '600', marginBottom: '6px' }}>
                                                    💵 Cash libéré:
                                                </p>
                                                <p style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: '700', margin: 0 }}>
                                                    {simulatedKPIs.find(k => k.title.includes('Cash Flow') || k.title.includes('Trésorerie'))?.change || 'Calcul...'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* SIMULATION 3: Augmentation Prix → CA */}
                                    <div style={{
                                        background: 'rgba(15, 23, 42, 0.6)',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        border: prixAugmentation > 0 ? '2px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(99, 102, 241, 0.15)'
                                    }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '24px' }}>📈</span>
                                                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', margin: 0 }}>
                                                    Augmentation tarifaire
                                                </h4>
                                            </div>
                                            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.4', margin: 0 }}>
                                                Impact sur <strong style={{ color: '#fbbf24' }}>Chiffre d'Affaires</strong>
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Hausse prix</span>
                                                <span style={{ fontSize: '20px', fontWeight: '700', color: prixAugmentation > 0 ? '#fbbf24' : '#6366f1' }}>
                                                    +{prixAugmentation}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="15"
                                                step="5"
                                                value={prixAugmentation}
                                                onChange={(e) => setPrixAugmentation(Number(e.target.value))}
                                                style={{
                                                    width: '100%',
                                                    height: '6px',
                                                    borderRadius: '3px',
                                                    background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(prixAugmentation / 15) * 100}%, rgba(99, 102, 241, 0.2) ${(prixAugmentation / 15) * 100}%, rgba(99, 102, 241, 0.2) 100%)`,
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                                <span style={{ fontSize: '11px', color: '#64748b' }}>0%</span>
                                                <span style={{ fontSize: '11px', color: '#64748b' }}>15%</span>
                                            </div>
                                        </div>

                                        {prixAugmentation > 0 && simulatedKPIs.length > 0 && (
                                            <div style={{
                                                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                border: '1px solid rgba(251, 191, 36, 0.3)'
                                            }}>
                                                <p style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '600', marginBottom: '6px' }}>
                                                    � CA additionnel:
                                                </p>
                                                <p style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: '700', margin: 0 }}>
                                                    {simulatedKPIs.find(k => k.title.includes('Chiffre d\'Affaires'))?.change || 'Calcul...'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Bouton Reset */}
                            {showSimulation && (chargesReduction > 0 || paiementsAcceleration > 0 || prixAugmentation > 0) && (
                                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => {
                                            setChargesReduction(0);
                                            setPaiementsAcceleration(0);
                                            setPrixAugmentation(0);
                                        }}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            borderRadius: '8px',
                                            padding: '10px 20px',
                                            color: '#f87171',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                        }}
                                    >
                                        🔄 Réinitialiser toutes les simulations
                                    </button>
                                </div>
                            )}

                            {/* Badge Mode Simulation actif */}
                            {(chargesReduction > 0 || paiementsAcceleration > 0 || prixAugmentation > 0) && (
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: showSimulation ? '180px' : '16px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    borderRadius: '20px',
                                    padding: '6px 14px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                                    animation: 'pulse 2s ease-in-out infinite'
                                }}>
                                    📊 {[chargesReduction > 0 && '1', paiementsAcceleration > 0 && '2', prixAugmentation > 0 && '3'].filter(Boolean).length} simulation{[chargesReduction > 0, paiementsAcceleration > 0, prixAugmentation > 0].filter(Boolean).length > 1 ? 's' : ''} active{[chargesReduction > 0, paiementsAcceleration > 0, prixAugmentation > 0].filter(Boolean).length > 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ✅ AMÉLIORATION 4: Alerte si marge > 60% (et positive) */}
                    {(() => {
                        const margeNette = getKPINumericValue('Marge');
                        if (margeNette && margeNette > 60) {
                            return (
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
                                    border: '1px solid rgba(251, 191, 36, 0.3)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    marginTop: '24px',
                                    marginBottom: '24px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px'
                                }}>
                                    <span style={{ fontSize: '24px', flexShrink: 0 }}>⚠️</span>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
                                            Marge exceptionnelle détectée ({margeNette.toFixed(1)}%)
                                        </h4>
                                        <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '8px' }}>
                                            Votre marge nette est très élevée. Veuillez vérifier :
                                        </p>
                                        <ul style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                                            <li>✓ Toutes les charges ont bien été enregistrées dans vos données</li>
                                            <li>✓ Les salaires et charges sociales sont inclus</li>
                                            <li>✓ Les frais généraux (loyer, assurances, etc.) sont comptabilisés</li>
                                        </ul>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {/* ✅ Preview Données (juste après upload) */}
                    {rawData && rawData.length > 0 && (
                        <DataPreviewPanel rawData={rawData} companyName={companyName} />
                    )}

                    {/* ✅ Alertes intelligentes */}
                    {kpis.length > 0 && (
                        <AlertsPanel
                            dso={getKPINumericValue('DSO')}
                            cashFlow={getKPINumericValue('Cash Flow')}
                            netMargin={getKPINumericValue('Marge')}
                            bfr={getKPINumericValue('BFR')}
                        />
                    )}

                    {/* 🤖 Section ML Anomaly Detection */}
                    {rawData && rawData.length > 0 && anomalies.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => setShowAnomalies(!showAnomalies)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                                >
                                    <ExclamationTriangleIcon className="w-5 h-5" />
                                    {anomalies.length} Anomalie{anomalies.length > 1 ? 's' : ''} Détectée{anomalies.length > 1 ? 's' : ''}
                                    <span className="text-xs surface/20 px-2 py-0.5 rounded">ML</span>
                                </button>
                                {showAnomalies && (
                                    <p className="text-xs text-gray-500">
                                        Détection automatique via Machine Learning (Z-score, IQR, patterns)
                                    </p>
                                )}
                            </div>
                            {showAnomalies && (
                                <div style={{ animation: 'slideDown 0.3s ease-out' }}>
                                    <AnomalyPanel
                                        anomalies={anomalies}
                                        onDismiss={(id) => {
                                            setAnomalies(prev => prev.filter(a => a.id !== id));
                                        }}
                                        onInvestigate={(anomaly) => {
                                            logger.debug('Investigate anomaly:', anomaly);
                                            // Feature drill-down en développement
                                            if (anomaly.metadata?.client) {
                                                // Option: ouvrir drill-down automatiquement
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* ✅ Section Charts Financiers */}
                    {rawData && rawData.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Chart 1: 🎨 Sankey Flow Chart (D3.js) - Flux de trésorerie */}
                            <div className="surface rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <ArrowTrendingUpIcon className="w-5 h-5 text-orange-600" />
                                    Flux de Trésorerie (Sankey)
                                </h3>
                                {/* ✅ Mini résumé croissance */}
                                {getCashFlowGrowth().growth !== '0' && (
                                    <p className="text-sm text-green-600 font-medium mb-2">
                                        📈 {getCashFlowGrowth().displayText}
                                    </p>
                                )}
                                <div id="sankey-flow-chart">
                                    <SankeyFlowChart data={getSankeyData()} />
                                </div>
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Visualisation des flux: Revenus → Charges → Cash Flow Net
                                </p>
                            </div>

                            {/* Chart 2: 🎨 Sunburst Expenses Chart (D3.js) - Répartition des Charges */}
                            <div className="surface rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <BanknotesIcon className="w-5 h-5 text-orange-600" />
                                    Structure des Dépenses (Sunburst)
                                </h3>
                                {getCategoryBreakdown().length > 0 ? (
                                    <>
                                        <div id="sunburst-expenses-chart">
                                            <SunburstExpensesChart data={getSunburstData()} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 text-center">
                                            Hiérarchie interactive: catégories et sous-catégories (cliquez pour zoomer)
                                        </p>
                                    </>
                                ) : (
                                    <div className="h-[280px] flex items-center justify-center text-gray-400">
                                        Pas de charges à afficher
                                    </div>
                                )}
                            </div>

                            {/* Chart 3: Cash Flow Evolution (Recharts - kept for comparison) */}
                            <div className="surface rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
                                    Évolution Mensuelle (Recharts)
                                </h3>
                                <div id="cashflow-evolution-chart">
                                    <CashFlowEvolutionChart data={getMonthlyData()} />
                                </div>
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Revenus, charges et cash flow net par mois
                                </p>
                            </div>

                            {/* Chart 4: Expense Breakdown (Recharts - kept for comparison) */}
                            <div className="surface rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <BanknotesIcon className="w-5 h-5 text-purple-600" />
                                    Répartition Charges (Recharts)
                                </h3>
                                {getCategoryBreakdown().length > 0 ? (
                                    <>
                                        <div id="expense-breakdown-chart">
                                            <ExpenseBreakdownChart data={getCategoryBreakdown()} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 text-center">
                                            Charges ventilées par catégorie (vue alternative)
                                        </p>
                                    </>
                                ) : (
                                    <div className="h-[280px] flex items-center justify-center text-gray-400">
                                        Pas de charges à afficher
                                    </div>
                                )}
                            </div>

                            {/* Chart 3: Marge Nette Evolution */}
                            <div className="surface rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
                                    Évolution de la Marge Nette
                                </h3>
                                {getMarginData().length > 0 ? (
                                    <>
                                        {/* ✅ Delta marge */}
                                        {getMarginGrowth().delta !== '0' && (
                                            <p className="text-sm text-blue-600 font-medium mb-2">
                                                📊 {getMarginGrowth().displayText}
                                            </p>
                                        )}
                                        <div id="margin-evolution-chart">
                                            <MarginEvolutionChart data={getMarginData()} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 text-center">
                                            Progression vers l'objectif de rentabilité optimale
                                        </p>
                                    </>
                                ) : (
                                    <div className="h-[280px] flex items-center justify-center text-gray-400">
                                        Pas assez de données historiques
                                    </div>
                                )}
                            </div>

                            {/* Chart 4: Top 5 Clients par Chiffre d'Affaires */}
                            <div className="surface rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                    Concentration Commerciale — Top 5
                                </h3>
                                {getTopClientsBarData().length > 0 ? (
                                    <>
                                        <div id="top-clients-chart">
                                            <TopClientsVerticalChart data={getTopClientsBarData()} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 text-center">
                                            Analyse de la dépendance client et diversification du portefeuille
                                        </p>
                                        {/* ✅ Afficher % du Top 5 */}
                                        <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-sm font-medium text-blue-800 text-center">
                                                Top 5 = {getTopClientsPercentage().percentage}% du CA total
                                                <span className="text-xs text-blue-600 ml-2">
                                                    ({getTopClientsPercentage().topTotal.toLocaleString('fr-FR')} € / {getTopClientsPercentage().totalCA.toLocaleString('fr-FR')} €)
                                                </span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-[280px] flex items-center justify-center text-gray-400">
                                        Pas de clients à afficher
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Charts Row 2 (2 cols) - Charts 5 & 6 */}
                    {rawData && rawData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Chart 5: Top 5 Créances en Attente */}
                            <div className="surface rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                                    Créances Prioritaires — Par Urgence
                                </h3>
                                {getTopOutstandingInvoices().length > 0 ? (
                                    <>
                                        <div id="outstanding-invoices-chart">
                                            <OutstandingInvoicesChart data={getTopOutstandingInvoices()} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 text-center">
                                            Factures impayées triées par impact financier — Couleur = niveau d'urgence
                                        </p>
                                        {/* ✅ Total créances en attente */}
                                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                            <p className="text-sm font-semibold text-red-800 text-center">
                                                💰 Total créances en attente : {getTotalOutstandingInvoices().toLocaleString('fr-FR')} €
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-[280px] flex items-center justify-center text-gray-400">
                                        Aucune créance en attente
                                    </div>
                                )}
                            </div>

                            {/* Chart 6: Statuts de Paiement */}
                            <div className="surface rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <ClockIcon className="w-5 h-5 text-purple-600" />
                                    Cycle d'Encaissement
                                </h3>
                                {getPaymentStatusData().length > 0 ? (
                                    <>
                                        {/* ✅ Taux d'encaissement */}
                                        {getCollectionRate().rate !== '0' && (
                                            <p className="text-sm text-purple-600 font-medium mb-2">
                                                ✅ {getCollectionRate().displayText}
                                            </p>
                                        )}
                                        <div id="payment-status-chart">
                                            <PaymentStatusChart data={getPaymentStatusData()} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 text-center">
                                            Suivi du workflow de facturation et état des recouvrements
                                        </p>
                                    </>
                                ) : (
                                    <div className="h-[320px] flex items-center justify-center text-gray-400">
                                        Pas de données de paiement
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick Insights */}
                    {shouldShowElement('showAIInsights') && (
                        <div className="surface rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Actions Prioritaires IA</h3>
                            <div className="text-center py-8 text-gray-500">
                                <p>💡 Insights IA nécessitent plus de données</p>
                                <p className="text-sm">Importez plusieurs mois d'historique pour des recommandations personnalisées</p>
                            </div>
                        </div>
                    )}

                    {/* Cash Flow Projection */}
                    {shouldShowElement('showProjections') && (
                        <div className="finsight-projection-card">
                            <h3 className="finsight-projection-title">🔮 Projection Trésorerie (90 jours)</h3>
                            <div className="text-center py-8 text-gray-500">
                                <p>💡 Projections nécessitent plus de données historiques</p>
                                <p className="text-sm">Importez au moins 6 mois de données pour des projections fiables</p>
                            </div>
                        </div>
                    )}

                    {/* Quick Analytics Cards */}
                    <div className="finsight-analytics-grid">
                        {shouldShowElement('showTrendAnalysis') && (
                            <div className="finsight-analytics-card">
                                <h3 className="finsight-analytics-title">📈 Évolution Mensuelle CA</h3>
                                <div className="finsight-trend-bars">
                                    {getEvolutionData().length > 0 ? (
                                        getEvolutionData().map((monthData, index) => (
                                            <div key={index} className="finsight-trend-bar" style={{ height: `${60 + index * 10}%` }}>
                                                <span className="finsight-trend-value">{monthData.display}</span>
                                                <span className="finsight-trend-month">{monthData.month}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>💡 Pas assez de données historiques</p>
                                            <p className="text-sm">Importez plusieurs mois pour voir l'évolution</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {shouldShowElement('showAlerts') && (
                            <div className="finsight-analytics-card">
                                <h3 className="finsight-analytics-title" style={{ color: '#60a5fa' }}>⚡ Alertes Actives</h3>
                                <div className="text-center py-8" style={{ color: '#94a3b8' }}>
                                    <p>💡 Alertes nécessitent des règles business configurées</p>
                                    <p className="text-sm">Contactez notre équipe pour configurer vos seuils d'alerte</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Detailed Analysis Section */}
                    {shouldShowElement('showDetailedAnalysis') && (
                        <div className="finsight-detailed-analysis">
                            <h3 className="finsight-analysis-title">🔍 Analyse Détaillée</h3>
                            <div className="finsight-analysis-grid">
                                <div className="finsight-analysis-card">
                                    <h4 className="finsight-analysis-subtitle">Flux de Trésorerie</h4>
                                    <div className="text-center py-8 text-gray-500">
                                        <p>💡 Analyse flux de trésorerie nécessite des données de trésorerie</p>
                                        <p className="text-sm">Connectez vos comptes bancaires pour un suivi en temps réel</p>
                                    </div>
                                </div>

                                {shouldShowElement('showRatios') && (
                                    <div className="finsight-analysis-card">
                                        <h4 className="finsight-analysis-subtitle">Ratios Financiers</h4>
                                        <div className="text-center py-8 text-gray-500">
                                            <p>💡 Calcul des ratios nécessite des données bilan/compte de résultat</p>
                                            <p className="text-sm">Importez vos états financiers pour des ratios précis</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Items */}
                    {shouldShowElement('showRecommendations') && (
                        <div className="finsight-action-items">
                            <h3 className="finsight-actions-title">⚡ Actions Recommandées</h3>
                            <div className="text-center py-8 text-gray-500">
                                <p>💡 Recommandations nécessitent plus de données d'historique</p>
                                <p className="text-sm">Importez plusieurs mois pour des recommandations personnalisées</p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* AI Copilot Section - Toujours visible */}
            <div className="mb-12" data-copilot>
                <AICopilot />
            </div>

            {/* ✅ Modal Secteur */}
            <CompanyInfoModal
                isOpen={showCompanyModal}
                onClose={() => setShowCompanyModal(false)}
                onSubmit={handleCompanyInfoSubmit}
            />

            {/* 🎯 Modal Drill-Down Interactif */}
            <KPIDrilldownModal
                state={drillDownState}
                actions={drillDownActions}
                rawData={rawData || []}
            />

            {/* ⌨️ Command Palette - Keyboard Shortcuts */}
            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                onExportPDF={() => {
                    setIsCommandPaletteOpen(false);
                    const exportBtn = document.querySelector('[data-action="export-pdf"]') as HTMLButtonElement;
                    exportBtn?.click();
                }}
                onExportExcel={() => {
                    setIsCommandPaletteOpen(false);
                    const exportBtn = document.querySelector('[data-action="export-excel"]') as HTMLButtonElement;
                    exportBtn?.click();
                }}
                onOpenCopilot={() => {
                    setIsCommandPaletteOpen(false);
                    const copilotSection = document.querySelector('[data-copilot]');
                    copilotSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                onToggleAnomalies={() => {
                    setIsCommandPaletteOpen(false);
                    setShowAnomalies(prev => !prev);
                }}
                onToggleTheme={() => {
                    setIsCommandPaletteOpen(false);
                    toggleTheme();
                }}
                onRefreshData={() => {
                    setIsCommandPaletteOpen(false);
                    if (rawData && rawData.length > 0) {
                        detectAnomaliesFromData();
                    }
                }}
                isDarkMode={isDarkMode}
            />

            {/* 📡 Real-Time Cursor Tracking */}
            <CursorTracker enabled={isDataLoaded} />

            {/* 📡 Real-Time Toast Notifications */}
            <RealtimeToast
                notifications={toastNotifications}
                onDismiss={dismissToast}
            />

            {/* 🔔 Alert Settings Modal */}
            <AlertSettings
                isOpen={showAlertSettings}
                onClose={() => setShowAlertSettings(false)}
                companyName={companyName}
            />
        </div>
    )
}
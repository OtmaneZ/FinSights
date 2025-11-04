'use client'

import { useState, useEffect, useRef } from 'react'
import React from 'react';
import dynamic from 'next/dynamic';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DashboardConfig, DataLevelInfo } from '@/lib/dataModel';
import { getUpgradeMessages } from '@/lib/dashboardConfig';
import { useFinancialData } from '@/lib/financialContext';
import { FinancialPDFExporter } from '@/lib/pdfExporter';
import {
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    CalendarIcon,
    CloudArrowUpIcon,
    CheckCircleIcon
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

// Import AICopilot
import AICopilot from './AICopilot';

// Import EmptyDashboardState
import EmptyDashboardState from './EmptyDashboardState';

// Import KPITooltip
import KPITooltip from './KPITooltip';

interface KPI {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    description: string
}

export default function FinancialDashboard() {
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
    const [isAutoLoading, setIsAutoLoading] = useState(true)
    const [showUploadModal, setShowUploadModal] = useState(false) // ✅ Modal upload sur RDV

    // 🚀 AUTO-LOAD DÉMO au premier chargement
    useEffect(() => {
        const loadDemoData = async () => {
            if (isDataLoaded) {
                setIsAutoLoading(false);
                return;
            }

            setIsAutoLoading(true);

            try {
                const response = await fetch('/demo-data.csv');
                const csvText = await response.text();

                // Simuler un fichier pour utiliser la même logique d'upload
                const apiResponse = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileContent: csvText,
                        fileName: 'demo-data.csv',
                        fileType: 'text/csv'
                    })
                });

                const result = await apiResponse.json();

                if (apiResponse.ok) {
                    setKpis(result.data.kpis);
                    setFinSightData(result.data.financialData || result.data.processedData);
                    setRawData(result.data.records || result.data.rawData || []);
                    setDashboardConfig(result.data.dashboardConfig || result.data.config);
                    setLevelInfo(result.data.levelInfo);
                    setUpgradeMessages(result.data.upgradeMessages || []);
                    setIsDataLoaded(true);
                    setIsDemoMode(true);
                    setCompanyName('PME Services B2B');
                    setCompanySector('services');
                    console.log('✅ Démo chargée avec succès:', result.data);
                    console.log('✅ rawData défini:', result.data.records?.length || 0, 'enregistrements');
                } else {
                    console.error('❌ Erreur API upload:', result);
                }
            } catch (error) {
                console.error('❌ Erreur chargement démo:', error);
            } finally {
                setIsAutoLoading(false);
            }
        };

        loadDemoData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                confidential: true
            };

            // Générer le PDF
            await exporter.generate(pdfOptions);

            // Télécharger
            const filename = `rapport-financier-${new Date().toISOString().split('T')[0]}.pdf`;
            exporter.download(filename);

        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
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
                console.log('✅ rawData défini dans contexte:', result.data.records?.length, 'enregistrements');
            }

            // DEBUG: Vérifier ce qui arrive
            console.log('🔍 Debug result.data:', {
                levelInfo: result.data.levelInfo,
                dashboardConfig: result.data.dashboardConfig,
                hasLevelInfo: !!result.data.levelInfo,
                hasDashboardConfig: !!result.data.dashboardConfig,
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

        // Parser la valeur (ex: "45 jours" → 45, "12.5%" → 12.5, "50 510 €" → 50510)
        // Supprimer tous les espaces, puis extraire les chiffres et virgules/points
        const cleanValue = kpi.value.replace(/\s/g, '');
        const match = cleanValue.match(/[\d,.]+/);
        if (!match) return undefined;

        return parseFloat(match[0].replace(',', '.'));
    };

    // ✅ Calculer le % de Cash Flow pour le benchmark (Cash Flow / CA * 100)
    const getCashFlowPercentage = (): number => {
        const cashFlow = getKPINumericValue('Cash Flow');
        const revenue = getKPINumericValue('Affaires'); // "Chiffre d'Affaires"
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
                        className="finsight-btn finsight-btn-revolutionary"
                    >
                        <DocumentArrowDownIcon className="finsight-icon-sm" />
                        <span>{isExporting ? 'Export...' : 'Export PDF'}</span>
                    </button>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="finsight-btn finsight-btn-secondary"
                    >
                        <CloudArrowUpIcon className="finsight-icon-sm" />
                        <span>Importer Données</span>
                    </button>
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
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                                Vous visualisez une <strong>PME Services B2B</strong> (8M€ CA • 120 transactions)
                            </p>
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

            {/* 🔄 LOADER - Pendant chargement auto de la démo */}
            {isAutoLoading && (
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
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                            Chargement de la démonstration
                        </h3>
                        <p style={{ fontSize: '16px', color: '#6b7280' }}>
                            Préparation du dashboard avec données de démonstration...
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

            {/* ✅ État vide avec explications - Affiché seulement si pas en auto-load */}
            {!isAutoLoading && kpis.length === 0 && !showUploadZone && (
                <EmptyDashboardState />
            )}

            {/* ✅ Contenu principal - Affiché seulement après upload de données */}
            {!isAutoLoading && kpis.length > 0 && (
                <>
                    {/* KPI Grid */}
                    <div className="finsight-kpi-grid" data-count={kpis.length}>
                        {kpis.map((kpi, index) => (
                            <div key={index} className="finsight-kpi-card finsight-kpi-hover">
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

                    {/* ✅ AMÉLIORATION 4: Alerte si marge > 60% */}
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

                    {/* ✅ Section Charts Financiers */}
                    {rawData && rawData.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Chart 1: Cash Flow Evolution */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <ArrowTrendingUpIcon className="w-5 h-5 text-orange-600" />
                                    Flux de Trésorerie Mensuels
                                </h3>
                                {/* ✅ Mini résumé croissance */}
                                {getCashFlowGrowth().growth !== '0' && (
                                    <p className="text-sm text-green-600 font-medium mb-2">
                                        📈 {getCashFlowGrowth().displayText}
                                    </p>
                                )}
                                <div id="cashflow-evolution-chart">
                                    <CashFlowEvolutionChart data={getMonthlyData()} />
                                </div>
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Revenus, charges et cash flow net par mois
                                </p>
                            </div>

                            {/* Chart 2: Répartition des Charges */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <BanknotesIcon className="w-5 h-5 text-orange-600" />
                                    Structure des Dépenses
                                </h3>
                                {getCategoryBreakdown().length > 0 ? (
                                    <>
                                        <div id="expense-breakdown-chart">
                                            <ExpenseBreakdownChart data={getCategoryBreakdown()} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 text-center">
                                            Charges ventilées par catégorie
                                        </p>
                                    </>
                                ) : (
                                    <div className="h-[280px] flex items-center justify-center text-gray-400">
                                        Pas de charges à afficher
                                    </div>
                                )}
                            </div>

                            {/* Chart 3: Marge Nette Evolution */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
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
                            <div className="bg-white rounded-lg shadow-lg p-6">
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
                            <div className="bg-white rounded-lg shadow-lg p-6">
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
                            <div className="bg-white rounded-lg shadow-lg p-6">
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
                        <div className="bg-white rounded-lg shadow-lg p-6">
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
            <div className="mb-12">
                <AICopilot />
            </div>

            {/* ✅ Modal Secteur */}
            <CompanyInfoModal
                isOpen={showCompanyModal}
                onClose={() => setShowCompanyModal(false)}
                onSubmit={handleCompanyInfoSubmit}
            />
        </div>
    )
}
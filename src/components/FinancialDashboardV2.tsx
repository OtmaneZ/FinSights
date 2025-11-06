'use client'

import { useState, useEffect } from 'react'
import { useFinancialData } from '@/lib/financialContext'
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Clock,
    Download,
    Upload,
    FileText
} from 'lucide-react'

// Import Charts
import { CashFlowEvolutionChart } from './charts/CashFlowEvolutionChart'
import { ExpenseBreakdownChart } from './charts/ExpenseBreakdownChart'
import { MarginEvolutionChart } from './charts/MarginEvolutionChart'
import { TopClientsVerticalChart } from './charts/TopClientsVerticalChart'

// Import AI Copilot
import AICopilot from './AICopilot'

// Import Empty State V2
import EmptyDashboardStateV2 from './EmptyDashboardStateV2'

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

    // 🎨 Fonction pour obtenir l'icône selon le titre du KPI
    const getKPIIcon = (title: string) => {
        if (title.includes('Chiffre') || title.includes('Affaires') || title.includes('CA')) {
            return <DollarSign className="w-6 h-6" />
        }
        if (title.includes('Marge')) {
            return <TrendingUp className="w-6 h-6" />
        }
        if (title.includes('Cash') || title.includes('Trésorerie')) {
            return <TrendingDown className="w-6 h-6" />
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
        setIsExporting(true)
        // TODO: Implement PDF export
        setTimeout(() => setIsExporting(false), 1000)
    }

    // Export Excel
    const exportToExcel = async () => {
        setIsExporting(true)
        // TODO: Implement Excel export
        setTimeout(() => setIsExporting(false), 1000)
    }

    // Load demo scenario
    const loadDemoScenario = async (scenario: 'saine' | 'difficulte' | 'croissance') => {
        const scenarioFiles = {
            saine: '/demo-data.csv',
            difficulte: '/demo-startup-difficulte.csv',
            croissance: '/demo-scaleup-croissance.csv'
        }

        try {
            const response = await fetch(scenarioFiles[scenario])
            const csvText = await response.text()

            const apiResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileContent: csvText,
                    fileName: scenarioFiles[scenario].split('/').pop(),
                    fileType: 'text/csv'
                })
            })

            const result = await apiResponse.json()

            if (apiResponse.ok) {
                setKpis(result.data.kpis || [])
                setFinSightData(result.data.financialData || result.data.processedData)
                setRawData(result.data.records || result.data.rawData || [])
                setIsDataLoaded(true)
            }
        } catch (error) {
            console.error('Erreur chargement démo:', error)
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

    // Si pas de données, afficher Empty State
    if (!isDataLoaded) {
        return <EmptyDashboardStateV2 onDemoLoad={loadDemoScenario} />
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Tableau de Bord Financier</h1>
                    <p className="text-text-secondary">Période Actuelle • Données en temps réel</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={exportToPDF}
                        disabled={isExporting}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-gold hover:bg-accent-gold-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {isExporting ? 'Export...' : 'Export PDF'}
                    </button>

                    <button
                        onClick={exportToExcel}
                        disabled={isExporting}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-green hover:bg-accent-green-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50"
                    >
                        <FileText className="w-4 h-4" />
                        {isExporting ? 'Export...' : 'Export Excel'}
                    </button>

                    <button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border-default hover:border-accent-gold-border text-text-primary rounded-lg font-semibold text-sm transition-all hover:bg-surface-elevated"
                    >
                        <Upload className="w-4 h-4" />
                        Importer Données
                    </button>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    />
                </div>
            </div>

            {/* KPIs Grid - Style Homepage Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                {kpis.map((kpi, index) => (
                    <div key={index} className="surface rounded-xl p-6 surface-hover group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-accent-gold transition-transform group-hover:scale-110">
                                {getKPIIcon(kpi.title)}
                            </div>
                            <span className={`text-sm font-semibold ${kpi.changeType === 'positive' ? 'text-accent-green' :
                                kpi.changeType === 'negative' ? 'text-accent-red' :
                                    'text-text-tertiary'
                                }`}>
                                {kpi.change}
                            </span>
                        </div>
                        <h3 className="text-sm text-text-secondary mb-2">{kpi.title}</h3>
                        <p className="text-3xl font-bold mb-1">{kpi.value}</p>
                        <p className="text-xs text-text-tertiary">{kpi.description}</p>
                    </div>
                ))}
            </div>

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

            {/* AI Copilot */}
            <div className="mb-12">
                <AICopilot />
            </div>
        </div>
    )
}

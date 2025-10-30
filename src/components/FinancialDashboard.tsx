'use client'

import { useState, useEffect, useRef } from 'react'
import React from 'react';
import dynamic from 'next/dynamic';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

// Import dynamique des charts pour éviter les problèmes SSR
const CashFlowChart = dynamic(() => import('./charts/CashFlowChart'), {
    ssr: false,
    loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center"><span className="text-gray-500">Chargement du graphique...</span></div>
});
const DSOClientChart = dynamic(() => import('./charts/DSOClientChart'), {
    ssr: false,
    loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center"><span className="text-gray-500">Chargement du graphique...</span></div>
});
const MarginAnalysisChart = dynamic(() => import('./charts/MarginAnalysisChart'), {
    ssr: false,
    loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center"><span className="text-gray-500">Chargement du graphique...</span></div>
});
const WhatIfSimulator = dynamic(() => import('./charts/WhatIfSimulator'), {
    ssr: false,
    loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center"><span className="text-gray-500">Chargement du simulateur...</span></div>
});

interface KPI {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    description: string
}

export default function FinancialDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('current')
    const [kpis, setKpis] = useState<KPI[]>([])
    const [isExporting, setIsExporting] = useState(false)
    const dashboardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Simulate loading KPIs
        const mockKPIs: KPI[] = [
            {
                title: 'Chiffre d\'Affaires',
                value: '1 250 000 €',
                change: '+8.5%',
                changeType: 'positive',
                description: 'vs même période N-1'
            },
            {
                title: 'Trésorerie Nette',
                value: '245 000 €',
                change: '+12.3%',
                changeType: 'positive',
                description: 'Position au jour J'
            },
            {
                title: 'Marge Brute',
                value: '42.8%',
                change: '-2.3pt',
                changeType: 'negative',
                description: 'vs mois précédent'
            },
            {
                title: 'DSO Clients',
                value: '47 jours',
                change: '+5j',
                changeType: 'negative',
                description: 'Délai moyen de paiement'
            },
            {
                title: 'EBITDA',
                value: '185 000 €',
                change: '+15.2%',
                changeType: 'positive',
                description: 'Marge opérationnelle'
            },
            {
                title: 'Charges Exploitation',
                value: '890 000 €',
                change: '+3.1%',
                changeType: 'neutral',
                description: 'Évolution maîtrisée'
            }
        ]
        setKpis(mockKPIs)
    }, [selectedPeriod])

    // Fonction d'export PDF
    const exportToPDF = async () => {
        if (!dashboardRef.current) return;

        setIsExporting(true);
        try {
            const canvas = await html2canvas(dashboardRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Calcul des dimensions
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;

            // En-tête
            pdf.setFontSize(16);
            pdf.text('Tableau de Bord FinSight', 20, 20);
            pdf.setFontSize(10);
            pdf.text(`Période: ${selectedPeriod}`, 20, 30);
            pdf.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);

            // Image du dashboard
            pdf.addImage(imgData, 'PNG', imgX, 40, imgWidth * ratio, imgHeight * ratio);

            // Pied de page
            pdf.setFontSize(8);
            pdf.text('Généré par FinSight - Tableau de bord financier intelligent', 20, pdfHeight - 10);

            pdf.save(`finsight-dashboard-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
        }
        setIsExporting(false);
    };

    // Données par période
    const getPeriodData = (period: string) => {
        const periodData = {
            current: {
                title: 'Période Actuelle',
                data: [
                    { title: 'Chiffre d\'Affaires', value: '1 250 000 €', change: '+8.5%', changeType: 'positive' as const, description: 'vs même période N-1' },
                    { title: 'Trésorerie Nette', value: '245 000 €', change: '+12.3%', changeType: 'positive' as const, description: 'Position au jour J' },
                    { title: 'Marge Brute', value: '42.8%', change: '-2.3pt', changeType: 'negative' as const, description: 'vs mois précédent' },
                    { title: 'DSO Clients', value: '47 jours', change: '+5j', changeType: 'negative' as const, description: 'Délai moyen de paiement' },
                    { title: 'EBITDA', value: '185 000 €', change: '+15.2%', changeType: 'positive' as const, description: 'Marge opérationnelle' },
                    { title: 'Charges Exploitation', value: '890 000 €', change: '+3.1%', changeType: 'neutral' as const, description: 'Évolution maîtrisée' }
                ]
            },
            monthly: {
                title: 'Vue Mensuelle',
                data: [
                    { title: 'Chiffre d\'Affaires', value: '104 000 €', change: '+6.2%', changeType: 'positive' as const, description: 'vs mois précédent' },
                    { title: 'Trésorerie Nette', value: '245 000 €', change: '+8.7%', changeType: 'positive' as const, description: 'Évolution mensuelle' },
                    { title: 'Marge Brute', value: '41.5%', change: '-1.8pt', changeType: 'negative' as const, description: 'vs mois précédent' },
                    { title: 'DSO Clients', value: '45 jours', change: '+2j', changeType: 'negative' as const, description: 'Délai mensuel' },
                    { title: 'EBITDA', value: '15 500 €', change: '+18.3%', changeType: 'positive' as const, description: 'Performance mensuelle' },
                    { title: 'Charges Exploitation', value: '74 200 €', change: '+2.8%', changeType: 'neutral' as const, description: 'Charges mensuelles' }
                ]
            },
            quarterly: {
                title: 'Vue Trimestrielle',
                data: [
                    { title: 'Chiffre d\'Affaires', value: '312 000 €', change: '+11.3%', changeType: 'positive' as const, description: 'vs T-1' },
                    { title: 'Trésorerie Nette', value: '245 000 €', change: '+22.1%', changeType: 'positive' as const, description: 'Évolution trimestrielle' },
                    { title: 'Marge Brute', value: '43.2%', change: '+0.8pt', changeType: 'positive' as const, description: 'vs trimestre précédent' },
                    { title: 'DSO Clients', value: '44 jours', change: '-3j', changeType: 'positive' as const, description: 'Amélioration trimestrielle' },
                    { title: 'EBITDA', value: '46 800 €', change: '+25.7%', changeType: 'positive' as const, description: 'Croissance trimestrielle' },
                    { title: 'Charges Exploitation', value: '223 000 €', change: '+4.2%', changeType: 'neutral' as const, description: 'Maîtrise des coûts' }
                ]
            },
            yearly: {
                title: 'Vue Annuelle',
                data: [
                    { title: 'Chiffre d\'Affaires', value: '1 250 000 €', change: '+18.5%', changeType: 'positive' as const, description: 'vs N-1' },
                    { title: 'Trésorerie Nette', value: '245 000 €', change: '+34.2%', changeType: 'positive' as const, description: 'Progression annuelle' },
                    { title: 'Marge Brute', value: '42.8%', change: '+1.5pt', changeType: 'positive' as const, description: 'vs année précédente' },
                    { title: 'DSO Clients', value: '47 jours', change: '+8j', changeType: 'negative' as const, description: 'Dégradation annuelle' },
                    { title: 'EBITDA', value: '185 000 €', change: '+42.3%', changeType: 'positive' as const, description: 'Excellente performance' },
                    { title: 'Charges Exploitation', value: '890 000 €', change: '+12.8%', changeType: 'neutral' as const, description: 'Inflation contrôlée' }
                ]
            }
        };
        return periodData[period as keyof typeof periodData] || periodData.current;
    };

    // Mise à jour des KPIs selon la période
    useEffect(() => {
        const periodData = getPeriodData(selectedPeriod);
        setKpis(periodData.data);
    }, [selectedPeriod])

    const getChangeColor = (type: KPI['changeType']) => {
        switch (type) {
            case 'positive': return 'text-green-600'
            case 'negative': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    const getChangeIcon = (type: KPI['changeType']) => {
        switch (type) {
            case 'positive': return '↗'
            case 'negative': return '↘'
            default: return '→'
        }
    }

    return (
        <div className="space-y-6" ref={dashboardRef}>
            {/* Header with Period Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord Financier</h2>
                    <p className="text-sm text-gray-600 mt-1">{getPeriodData(selectedPeriod).title}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                        <span>{isExporting ? 'Export...' : 'Export PDF'}</span>
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                            <span className={`text-sm font-medium ${getChangeColor(kpi.changeType)}`}>
                                {getChangeIcon(kpi.changeType)} {kpi.change}
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                        <p className="text-sm text-gray-500">{kpi.description}</p>
                    </div>
                ))}
            </div>

            {/* Quick Insights */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Insights IA du Jour</h3>
                <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <span className="text-green-600 font-bold">+</span>
                        <p className="text-gray-700">Votre chiffre d'affaires progresse de 8.5% grâce aux nouveaux contrats signés en septembre.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="text-red-600 font-bold">!</span>
                        <p className="text-gray-700">Attention : la marge brute diminue (-2.3pt) due à l'augmentation des coûts matières premières.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="text-orange-600 font-bold">⚠</span>
                        <p className="text-gray-700">Les délais de paiement clients s'allongent (+5j). Considérer une relance proactive.</p>
                    </div>
                </div>
            </div>

            {/* Cash Flow Projection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔮 Projection Trésorerie (90 jours)</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Aujourd'hui</p>
                        <p className="text-2xl font-bold text-gray-900">245k€</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Dans 30 jours</p>
                        <p className="text-2xl font-bold text-orange-600">198k€</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Dans 90 jours</p>
                        <p className="text-2xl font-bold text-green-600">285k€</p>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        📈 <strong>Prévision :</strong> Après une baisse temporaire due aux échéances de novembre,
                        votre trésorerie devrait rebondir grâce aux encaissements de fin d'année (+40k€ attendus).
                    </p>
                </div>
            </div>

            {/* Cash Flow Chart - NOUVELLE VISUALISATION */}
            <CashFlowChart />

            {/* DSO par Client - NOUVELLE VISUALISATION */}
            <DSOClientChart />

            {/* Analyse des Marges - NOUVELLE VISUALISATION */}
            <MarginAnalysisChart />

            {/* Simulations What-If - NOUVELLE VISUALISATION */}
            <WhatIfSimulator />
        </div>
    )
}
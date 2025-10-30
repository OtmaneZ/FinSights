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

// Import dynamique des charts avec stratégie robuste
const CashFlowChart = dynamic(() => import('./charts/CashFlowChart').catch(() => ({ default: () => <div className="finsight-chart-fallback">📊 Graphique temporairement indisponible</div> })), {
    ssr: false,
    loading: () => <div className="finsight-chart-loading">🔄 Chargement du graphique...</div>
});

const DSOClientChart = dynamic(() => import('./charts/DSOClientChart').catch(() => ({ default: () => <div className="finsight-chart-fallback">📈 Graphique temporairement indisponible</div> })), {
    ssr: false,
    loading: () => <div className="finsight-chart-loading">🔄 Chargement du graphique...</div>
});

const MarginAnalysisChart = dynamic(() => import('./charts/MarginAnalysisChart').catch(() => ({ default: () => <div className="finsight-chart-fallback">📉 Graphique temporairement indisponible</div> })), {
    ssr: false,
    loading: () => <div className="finsight-chart-loading">🔄 Chargement du graphique...</div>
});

const WhatIfSimulator = dynamic(() => import('./charts/WhatIfSimulator').catch(() => ({ default: () => <div className="finsight-chart-fallback">🎛️ Simulateur temporairement indisponible</div> })), {
    ssr: false,
    loading: () => <div className="finsight-chart-loading">🔄 Chargement du simulateur...</div>
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
                value: '1 847 450 €',
                change: '+12.3%',
                changeType: 'positive',
                description: 'vs Oct 2024 (↗️ nouveau contrat Safran)'
            },
            {
                title: 'Trésorerie Nette',
                value: '387 650 €',
                change: '+45 820 €',
                changeType: 'positive',
                description: 'Position J-1 (↗️ encaissement Thales)'
            },
            {
                title: 'Marge Brute',
                value: '43.8%',
                change: '-1.2pt',
                changeType: 'negative',
                description: 'vs Sep (⚠️ coûts matières premières)'
            },
            {
                title: 'DSO Clients',
                value: '42 jours',
                change: '-8j',
                changeType: 'positive',
                description: 'Amélioration (✅ relances automatisées)'
            },
            {
                title: 'EBITDA',
                value: '298 450 €',
                change: '+18.7%',
                changeType: 'positive',
                description: 'Performance T1 (🚀 optimisation charges)'
            },
            {
                title: 'Charges Exploitation',
                value: '1 124 300 €',
                change: '+2.1%',
                changeType: 'neutral',
                description: 'Maîtrise inflation (+5% secteur)'
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
                </div>
            </div>

            {/* KPI Grid */}
            <div className="finsight-kpi-grid">
                {kpis.map((kpi, index) => (
                    <div key={index} className="finsight-kpi-card finsight-kpi-hover">
                        <div className="finsight-kpi-header">
                            <h3 className="finsight-kpi-label">{kpi.title}</h3>
                            <span className={`finsight-kpi-change ${getChangeColor(kpi.changeType)}`}>
                                {getChangeIcon(kpi.changeType)} {kpi.change}
                            </span>
                        </div>
                        <p className="finsight-kpi-value">{kpi.value}</p>
                        <p className="finsight-kpi-description">{kpi.description}</p>
                    </div>
                ))}
            </div>

            {/* Quick Insights */}
            {/* Quick Insights */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Actions Prioritaires IA</h3>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <span className="text-green-600 font-bold text-lg">💰</span>
                        <div>
                            <p className="font-semibold text-green-800">Trésorerie: +45k€ libérés</p>
                            <p className="text-sm text-gray-700">Paiement Thales reçu hier. Relancez MAINTENANT Airbus (facture FAC-2024-0847, 62k€, +12j) pour optimiser novembre.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                        <span className="text-red-600 font-bold text-lg">⚠️</span>
                        <div>
                            <p className="font-semibold text-red-800">Marge sous pression (-1.2pt)</p>
                            <p className="text-sm text-gray-700">Coûts aluminium +15% sur commandes Q4. Négociez clause indexation avec fournisseur Mecachrome ou répercutez +2.8% prix clients nouveaux contrats.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-600 font-bold text-lg">🚀</span>
                        <div>
                            <p className="font-semibold text-blue-800">DSO amélioré: -8 jours</p>
                            <p className="text-sm text-gray-700">Vos relances automatisées fonctionnent! Dupliquez la méthode sur portfolio PME (potentiel -15j DSO = +180k€ trésorerie).</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                        <span className="text-purple-600 font-bold text-lg">📊</span>
                        <div>
                            <p className="font-semibold text-purple-800">EBITDA +18.7% = Top quartile</p>
                            <p className="text-sm text-gray-700">Performance exceptionnelle vs concurrents secteur (+12% moyenne). Communiquez résultats conseil admin et préparez plan investissement 2025.</p>
                        </div>
                    </div>
                </div>

                {/* Bouton action */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        📞 Programmer entretien CFO (15min) - Optimisations personnalisées
                    </button>
                </div>
            </div>

            {/* Cash Flow Projection */}
            <div className="finsight-projection-card">
                <h3 className="finsight-projection-title">🔮 Projection Trésorerie (90 jours)</h3>
                <div className="finsight-projection-grid">
                    <div className="finsight-projection-item">
                        <p className="finsight-projection-label">Aujourd'hui</p>
                        <p className="finsight-projection-value finsight-value-current">245k€</p>
                    </div>
                    <div className="finsight-projection-item">
                        <p className="finsight-projection-label">Dans 30 jours</p>
                        <p className="finsight-projection-value finsight-value-warning">198k€</p>
                    </div>
                    <div className="finsight-projection-item">
                        <p className="finsight-projection-label">Dans 90 jours</p>
                        <p className="finsight-projection-value finsight-value-positive">285k€</p>
                    </div>
                </div>
                <div className="finsight-projection-insight">
                    <p className="finsight-projection-text">
                        📈 <strong>Prévision :</strong> Après une baisse temporaire due aux échéances de novembre,
                        votre trésorerie devrait rebondir grâce aux encaissements de fin d'année (+40k€ attendus).
                    </p>
                </div>
            </div>

            {/* Quick Analytics Cards */}
            <div className="finsight-analytics-grid">
                <div className="finsight-analytics-card">
                    <h3 className="finsight-analytics-title">📈 Évolution Mensuelle CA</h3>
                    <div className="finsight-trend-bars">
                        <div className="finsight-trend-bar" style={{ height: '60%' }}>
                            <span className="finsight-trend-value">1.1M</span>
                            <span className="finsight-trend-month">Sep</span>
                        </div>
                        <div className="finsight-trend-bar" style={{ height: '80%' }}>
                            <span className="finsight-trend-value">1.2M</span>
                            <span className="finsight-trend-month">Oct</span>
                        </div>
                        <div className="finsight-trend-bar finsight-trend-projected" style={{ height: '70%' }}>
                            <span className="finsight-trend-value">1.15M</span>
                            <span className="finsight-trend-month">Nov</span>
                        </div>
                    </div>
                </div>

                <div className="finsight-analytics-card">
                    <h3 className="finsight-analytics-title">⚡ Alertes Actives</h3>
                    <div className="finsight-alerts-list">
                        <div className="finsight-alert-item finsight-alert-high">
                            <span className="finsight-alert-badge">URGENT</span>
                            <p>Facture Client A (45k€) en retard de 15j</p>
                        </div>
                        <div className="finsight-alert-item finsight-alert-medium">
                            <span className="finsight-alert-badge">MEDIUM</span>
                            <p>Marge produit X sous le seuil (38%)</p>
                        </div>
                        <div className="finsight-alert-item finsight-alert-low">
                            <span className="finsight-alert-badge">INFO</span>
                            <p>Nouveau contrat signé (+120k€)</p>
                        </div>
                    </div>
                </div>

                <div className="finsight-analytics-card">
                    <h3 className="finsight-analytics-title">🎯 Top 5 Clients</h3>
                    <div className="finsight-client-ranking">
                        <div className="finsight-client-item">
                            <span className="finsight-client-name">Client Alpha</span>
                            <span className="finsight-client-value">€285k</span>
                        </div>
                        <div className="finsight-client-item">
                            <span className="finsight-client-name">Client Beta</span>
                            <span className="finsight-client-value">€198k</span>
                        </div>
                        <div className="finsight-client-item">
                            <span className="finsight-client-name">Client Gamma</span>
                            <span className="finsight-client-value">€165k</span>
                        </div>
                        <div className="finsight-client-item">
                            <span className="finsight-client-name">Client Delta</span>
                            <span className="finsight-client-value">€142k</span>
                        </div>
                        <div className="finsight-client-item">
                            <span className="finsight-client-name">Client Epsilon</span>
                            <span className="finsight-client-value">€98k</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Analysis Section */}
            <div className="finsight-detailed-analysis">
                <h3 className="finsight-analysis-title">🔍 Analyse Détaillée</h3>
                <div className="finsight-analysis-grid">
                    <div className="finsight-analysis-card">
                        <h4 className="finsight-analysis-subtitle">Flux de Trésorerie</h4>
                        <div className="finsight-cashflow-visual">
                            <div className="finsight-cashflow-timeline">
                                <div className="finsight-cashflow-point finsight-point-past">
                                    <span className="finsight-point-value">+85k</span>
                                    <span className="finsight-point-date">Oct 15</span>
                                </div>
                                <div className="finsight-cashflow-point finsight-point-current">
                                    <span className="finsight-point-value">245k</span>
                                    <span className="finsight-point-date">Aujourd'hui</span>
                                </div>
                                <div className="finsight-cashflow-point finsight-point-future">
                                    <span className="finsight-point-value">-47k</span>
                                    <span className="finsight-point-date">Nov 15</span>
                                </div>
                                <div className="finsight-cashflow-point finsight-point-future">
                                    <span className="finsight-point-value">+125k</span>
                                    <span className="finsight-point-date">Déc 30</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="finsight-analysis-card">
                        <h4 className="finsight-analysis-subtitle">Ratios Financiers</h4>
                        <div className="finsight-ratios-list">
                            <div className="finsight-ratio-item">
                                <span className="finsight-ratio-name">Liquidité Générale</span>
                                <div className="finsight-ratio-bar">
                                    <div className="finsight-ratio-fill" style={{ width: '75%' }}></div>
                                    <span className="finsight-ratio-value">1.8</span>
                                </div>
                            </div>
                            <div className="finsight-ratio-item">
                                <span className="finsight-ratio-name">Endettement</span>
                                <div className="finsight-ratio-bar">
                                    <div className="finsight-ratio-fill finsight-ratio-warning" style={{ width: '45%' }}></div>
                                    <span className="finsight-ratio-value">0.45</span>
                                </div>
                            </div>
                            <div className="finsight-ratio-item">
                                <span className="finsight-ratio-name">Rentabilité</span>
                                <div className="finsight-ratio-bar">
                                    <div className="finsight-ratio-fill finsight-ratio-good" style={{ width: '82%' }}></div>
                                    <span className="finsight-ratio-value">14.8%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Items */}
            <div className="finsight-action-items">
                <h3 className="finsight-actions-title">⚡ Actions Recommandées</h3>
                <div className="finsight-actions-list">
                    <div className="finsight-action-card finsight-action-urgent">
                        <div className="finsight-action-header">
                            <span className="finsight-action-priority">URGENT</span>
                            <span className="finsight-action-impact">Impact: +45k€</span>
                        </div>
                        <h4 className="finsight-action-title">Relancer Client Alpha</h4>
                        <p className="finsight-action-description">
                            Facture de 45k€ en retard de 15 jours. Risque de dégradation du DSO.
                        </p>
                        <button className="finsight-action-btn">Contacter maintenant</button>
                    </div>

                    <div className="finsight-action-card finsight-action-medium">
                        <div className="finsight-action-header">
                            <span className="finsight-action-priority">MOYEN</span>
                            <span className="finsight-action-impact">Impact: +12k€/mois</span>
                        </div>
                        <h4 className="finsight-action-title">Optimiser Marge Produit X</h4>
                        <p className="finsight-action-description">
                            Marge actuelle 38% vs objectif 42%. Revoir les coûts matières premières.
                        </p>
                        <button className="finsight-action-btn">Analyser détails</button>
                    </div>

                    <div className="finsight-action-card finsight-action-opportunity">
                        <div className="finsight-action-header">
                            <span className="finsight-action-priority">OPPORTUNITÉ</span>
                            <span className="finsight-action-impact">Impact: +200k€</span>
                        </div>
                        <h4 className="finsight-action-title">Négocier Nouveau Contrat</h4>
                        <p className="finsight-action-description">
                            Client Beta a exprimé un intérêt pour étendre le périmètre. Moment idéal.
                        </p>
                        <button className="finsight-action-btn">Préparer proposition</button>
                    </div>
                </div>
            </div>

            {/* Charts interactifs - Section avancée */}
            <div className="finsight-advanced-charts">
                <h3 className="finsight-charts-title">📊 Analyses Avancées</h3>
                <div className="finsight-charts-grid">
                    <CashFlowChart />
                    <DSOClientChart />
                    <MarginAnalysisChart />
                    <WhatIfSimulator />
                </div>
            </div>
        </div>
    )
}
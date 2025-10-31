'use client'

import { useState, useEffect, useRef } from 'react'
import React from 'react';
import dynamic from 'next/dynamic';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DashboardConfig, DataLevelInfo } from '@/lib/dataModel';
import { getUpgradeMessages } from '@/lib/dashboardConfig';
import { useFinancialData } from '@/lib/financialContext';
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

// Import AICopilot
import AICopilot from './AICopilot';

// Import EmptyDashboardState
import EmptyDashboardState from './EmptyDashboardState';

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
    }, []);

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

    // Fonction d'upload réelle
    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];

        // Validation simple
        if (!file.name.endsWith('.csv')) {
            setUploadStatus('error');
            setTimeout(() => setUploadStatus('idle'), 3000);
            return;
        }

        setUploadStatus('uploading');

        try {
            // Lecture du fichier
            const fileContent = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = (e) => reject(e);
                reader.readAsText(file);
            });

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

            // Auto-fermer après succès
            setTimeout(() => {
                setUploadStatus('idle');
                setShowUploadZone(false);
            }, 3000);

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

    // ✅ Fonctions pour calculer des vraies données depuis les records
    const getTopClients = () => {
        if (!rawData || !rawData.length) return [];

        // Grouper par contrepartie et calculer les totaux
        const clientTotals = rawData.reduce((acc: any, record: any) => {
            const client = record.counterparty || record.description || 'Client inconnu';
            if (!acc[client]) {
                acc[client] = { name: client, total: 0, count: 0 };
            }
            acc[client].total += Math.abs(record.amount);
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
                        onClick={() => setShowUploadZone(!showUploadZone)}
                        className="finsight-btn finsight-btn-secondary"
                    >
                        <CloudArrowUpIcon className="finsight-icon-sm" />
                        <span>Importer Données</span>
                    </button>
                </div>
            </div>

            {/* Zone d'Upload */}
            {showUploadZone && (
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div className="text-center">
                        <CloudArrowUpIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Importer vos données financières
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Déposez vos fichiers Excel (.xlsx, .xls) ou CSV pour actualiser votre dashboard
                        </p>

                        {uploadStatus === 'idle' && (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 hover:border-blue-400 transition-colors cursor-pointer">
                                    <div className="text-blue-600 font-medium">
                                        📁 Cliquez pour sélectionner ou glissez vos fichiers ici
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        Formats supportés : .xlsx, .xls, .csv (max 10MB)
                                    </div>
                                </div>
                            </div>
                        )}

                        {uploadStatus === 'uploading' && (
                            <div className="text-center p-8">
                                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <div className="text-blue-600 font-medium">Traitement en cours...</div>
                                <div className="text-sm text-gray-500">Analyse et intégration de vos données</div>
                            </div>
                        )}

                        {uploadStatus === 'success' && (
                            <div className="text-center p-8">
                                <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <div className="text-green-600 font-medium text-lg">✅ Import réussi !</div>
                                <div className="text-sm text-gray-600">Vos données ont été intégrées au dashboard</div>
                            </div>
                        )}

                        {uploadStatus === 'error' && (
                            <div className="text-center p-8">
                                <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
                                <div className="text-red-600 font-medium">❌ Erreur d'import</div>
                                <div className="text-sm text-gray-500">Format non supporté. Utilisez .xlsx, .xls ou .csv</div>
                            </div>
                        )}

                        <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500">
                            <span>🔒 Données sécurisées</span>
                            <span>⚡ Traitement instantané</span>
                            <span>🎯 KPIs auto-générés</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ État vide avec explications - Affiché avant upload */}
            {kpis.length === 0 && !showUploadZone && (
                <EmptyDashboardState />
            )}

            {/* ✅ Contenu principal - Affiché seulement après upload de données */}
            {kpis.length > 0 && (
                <>
                    {/* Badge Niveau Détecté */}
                    {levelInfo && (
                        <div className={`mb-6 p-4 rounded-lg border-2 ${
                            levelInfo.level === 'basic' ? 'bg-blue-50 border-blue-300' :
                            levelInfo.level === 'intermediate' ? 'bg-blue-100 border-blue-400' :
                            'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-400'
                        }`}>
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        levelInfo.level === 'basic' ? 'bg-blue-500' :
                                        levelInfo.level === 'intermediate' ? 'bg-blue-600' :
                                        'bg-gradient-to-br from-purple-600 to-indigo-600'
                                    }`}>
                                        <span className="text-xl font-bold text-white">
                                            {levelInfo.level === 'basic' ? '1' : 
                                             levelInfo.level === 'intermediate' ? '2' : '3'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">
                                            {levelInfo.level === 'basic' ? '📊 Niveau Basique' :
                                             levelInfo.level === 'intermediate' ? '📈 Niveau Enrichi' :
                                             '🚀 Niveau Complet'}
                                        </div>
                                        <div className="text-sm text-gray-600">{levelInfo.description}</div>
                                    </div>
                                </div>
                                {levelInfo.level !== 'advanced' && levelInfo.suggestions && levelInfo.suggestions.length > 0 && (
                                    <div className="text-sm max-w-md">
                                        <span className="text-gray-600">💡 </span>
                                        <span className="text-gray-700">
                                            {levelInfo.suggestions[0]}
                                        </span>
                                    </div>
                                )}
                                {levelInfo.level === 'advanced' && (
                                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                                        <span>🎉</span>
                                        <span>Toutes les analyses sont disponibles !</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* KPI Grid */}
                    <div className="finsight-kpi-grid" data-count={kpis.length}>
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
                                <h3 className="finsight-analytics-title">⚡ Alertes Actives</h3>
                                <div className="text-center py-8 text-gray-500">
                                    <p>💡 Alertes nécessitent des règles business configurées</p>
                                    <p className="text-sm">Contactez notre équipe pour configurer vos seuils d'alerte</p>
                                </div>
                            </div>
                        )}

                        {shouldShowElement('showTopClients') && (
                            <div className="finsight-analytics-card">
                                <h3 className="finsight-analytics-title">🎯 Top 5 Clients</h3>
                                <div className="finsight-client-ranking">
                                    {getTopClients().length > 0 ? (
                                        getTopClients().map((client, index) => (
                                            <div key={index} className="finsight-client-item">
                                                <span className="finsight-client-name">{client.name}</span>
                                                <span className="finsight-client-value">{client.value}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>💡 Ajoutez une colonne "Client" ou "Contrepartie"</p>
                                            <p className="text-sm">pour voir l'analyse des top clients</p>
                                        </div>
                                    )}
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

                    {/* Charts interactifs - Section avancée */}
                    {shouldShowElement('showAdvancedCharts') && (
                        <div className="finsight-advanced-charts">
                            <h3 className="finsight-charts-title">📊 Analyses Avancées</h3>
                            <div className="finsight-charts-grid">
                                <CashFlowChart />
                                <DSOClientChart />
                                <MarginAnalysisChart />
                                <WhatIfSimulator />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* AI Copilot Section - Toujours visible */}
            <div className="mb-12">
                <AICopilot />
            </div>
        </div>
    )
}
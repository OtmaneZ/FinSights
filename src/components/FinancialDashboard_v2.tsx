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
    CalendarIcon,
    CloudArrowUpIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

// Nouveaux imports Phase 2
import { FinSightDataModel, KPIMetric } from '@/lib/dataModel';
import { useFinSightCache } from '@/lib/cache';
import AICopilot from './AICopilot';

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
    // États existants (gardés tels quels)
    const [selectedPeriod, setSelectedPeriod] = useState('current')
    const [kpis, setKpis] = useState<KPI[]>([])
    const [isExporting, setIsExporting] = useState(false)
    const [showUploadZone, setShowUploadZone] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
    const dashboardRef = useRef<HTMLDivElement>(null)

    // Nouveaux états Phase 2
    const [finSightData, setFinSightData] = useState<FinSightDataModel | null>(null)
    const [isDataLoaded, setIsDataLoaded] = useState(false)

    // Hook cache Phase 2
    const cache = useFinSightCache()

    // Chargement initial depuis le cache
    useEffect(() => {
        const cachedData = cache.loadData();
        if (cachedData) {
            setFinSightData(cachedData);
            setIsDataLoaded(true);
            updateKPIsFromFinSightData(cachedData);
            console.log('✅ Données chargées depuis le cache');
        } else {
            // Charger les KPIs par défaut si pas de cache
            loadDefaultKPIs();
        }
    }, [])

    // Fonction pour convertir FinSightData vers KPIs d'affichage
    const updateKPIsFromFinSightData = (data: FinSightDataModel) => {
        const convertedKPIs: KPI[] = [
            {
                title: data.kpis.revenue.title,
                value: data.kpis.revenue.formatted,
                change: data.kpis.revenue.changeFormatted,
                changeType: data.kpis.revenue.changeType,
                description: data.period.label
            },
            {
                title: data.kpis.cashFlow.title,
                value: data.kpis.cashFlow.formatted,
                change: data.kpis.cashFlow.changeFormatted,
                changeType: data.kpis.cashFlow.changeType,
                description: data.kpis.cashFlow.description
            },
            {
                title: data.kpis.margin.title,
                value: data.kpis.margin.formatted,
                change: data.kpis.margin.changeFormatted,
                changeType: data.kpis.margin.changeType,
                description: data.kpis.margin.description
            },
            {
                title: data.kpis.dso.title,
                value: data.kpis.dso.formatted,
                change: data.kpis.dso.changeFormatted,
                changeType: data.kpis.dso.changeType,
                description: data.kpis.dso.description
            },
            {
                title: data.kpis.ebitda.title,
                value: data.kpis.ebitda.formatted,
                change: data.kpis.ebitda.changeFormatted,
                changeType: data.kpis.ebitda.changeType,
                description: data.kpis.ebitda.description
            },
            {
                title: data.kpis.expenses.title,
                value: data.kpis.expenses.formatted,
                change: data.kpis.expenses.changeFormatted,
                changeType: data.kpis.expenses.changeType,
                description: data.kpis.expenses.description
            }
        ];
        setKpis(convertedKPIs);
    };

    // KPIs par défaut (gardés de l'original)
    const loadDefaultKPIs = () => {
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
        ];
        setKpis(mockKPIs);
    };

    // Utilitaire pour lire un fichier
    const readFileAsText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    };

    // Nouvelle fonction d'upload avec Phase 2
    const handleFileUploadV2 = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadStatus('uploading');
        setShowUploadZone(false);

        try {
            const fileContent = await readFileAsText(file);

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

            if (!response.ok) {
                throw new Error('Erreur lors de l\'upload');
            }

            const result = await response.json();

            if (result.success && result.data) {
                // Phase 2: Sauvegarder dans le cache
                cache.saveData(result.data);

                // Mettre à jour les états
                setFinSightData(result.data);
                setIsDataLoaded(true);
                updateKPIsFromFinSightData(result.data);
                setUploadStatus('success');

                // Déclencher l'analyse IA en arrière-plan
                triggerAIAnalysis(result.data);

                console.log('✅ Fichier traité et mis en cache:', file.name);
            } else {
                throw new Error(result.error || 'Erreur de traitement');
            }

        } catch (error) {
            console.error('❌ Erreur upload:', error);
            setUploadStatus('error');
        }

        // Reset après 3 secondes
        setTimeout(() => {
            setUploadStatus('idle');
        }, 3000);
    };

    // Déclencher l'analyse IA
    const triggerAIAnalysis = async (data: FinSightDataModel) => {
        try {
            const response = await fetch('/api/insights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data,
                    type: 'full_analysis'
                })
            });

            if (response.ok) {
                const result = await response.json();

                // Mettre à jour les données avec les insights IA
                const updatedData = {
                    ...data,
                    insights: result.data
                };

                cache.saveData(updatedData);
                setFinSightData(updatedData);

                console.log('🤖 Analyse IA terminée');
            }
        } catch (error) {
            console.error('❌ Erreur analyse IA:', error);
        }
    };

    // Fonction d'export PDF (gardée de l'original)
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
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297;
            const pageHeight = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`finsight-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    // Ancienne fonction d'upload (gardée pour compatibilité)
    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploadStatus('uploading');
        setShowUploadZone(false);

        try {
            const fileContent = await readFileAsText(file);

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

            if (!response.ok) {
                throw new Error('Erreur lors de l\'upload');
            }

            const result = await response.json();

            if (result.success) {
                // Utiliser les anciens KPIs pour compatibilité
                if (result.kpis) {
                    setKpis(result.kpis);
                }

                // Si on a les nouvelles données, les utiliser aussi
                if (result.data) {
                    cache.saveData(result.data);
                    setFinSightData(result.data);
                    setIsDataLoaded(true);
                }

                setUploadStatus('success');
                console.log('✅ Fichier traité:', file.name);
            } else {
                throw new Error(result.error || 'Erreur de traitement');
            }

        } catch (error) {
            console.error('❌ Erreur upload:', error);
            setUploadStatus('error');
        }

        setTimeout(() => {
            setUploadStatus('idle');
        }, 3000);
    };

    // Fonction getPeriodData (gardée de l'original)
    const getPeriodData = (period: string) => {
        switch (period) {
            case 'current':
                return {
                    title: 'Octobre 2025',
                    data: [
                        {
                            title: 'Chiffre d\'Affaires',
                            value: '1 847 450 €',
                            change: '+12.3%',
                            changeType: 'positive' as const,
                            description: 'vs Oct 2024 (↗️ nouveau contrat Safran)'
                        },
                        {
                            title: 'Trésorerie Nette',
                            value: '387 650 €',
                            change: '+45 820 €',
                            changeType: 'positive' as const,
                            description: 'Position J-1 (↗️ encaissement Thales)'
                        },
                        {
                            title: 'Marge Brute',
                            value: '43.8%',
                            change: '-1.2pt',
                            changeType: 'negative' as const,
                            description: 'vs Sep (⚠️ coûts matières premières)'
                        },
                        {
                            title: 'DSO Clients',
                            value: '42 jours',
                            change: '-8j',
                            changeType: 'positive' as const,
                            description: 'Amélioration (✅ relances automatisées)'
                        },
                        {
                            title: 'EBITDA',
                            value: '298 450 €',
                            change: '+18.7%',
                            changeType: 'positive' as const,
                            description: 'Performance T1 (🚀 optimisation charges)'
                        },
                        {
                            title: 'Charges Exploitation',
                            value: '1 124 300 €',
                            change: '+2.1%',
                            changeType: 'neutral' as const,
                            description: 'Maîtrise inflation (+5% secteur)'
                        }
                    ]
                };
            case 'previous':
                return {
                    title: 'Septembre 2025',
                    data: [
                        {
                            title: 'Chiffre d\'Affaires',
                            value: '1 642 180 €',
                            change: '+8.9%',
                            changeType: 'positive' as const,
                            description: 'vs Sep 2024'
                        },
                        {
                            title: 'Trésorerie Nette',
                            value: '341 830 €',
                            change: '-15 420 €',
                            changeType: 'negative' as const,
                            description: 'vs Août 2025'
                        }
                    ]
                };
            case 'ytd':
                return {
                    title: 'Année 2025 (YTD)',
                    data: [
                        {
                            title: 'Chiffre d\'Affaires',
                            value: '16 247 850 €',
                            change: '+15.6%',
                            changeType: 'positive' as const,
                            description: 'vs YTD 2024'
                        }
                    ]
                };
            default:
                return { title: 'Données non disponibles', data: [] };
        }
    };

    // useEffect pour les changements de période
    useEffect(() => {
        if (!isDataLoaded) {
            const periodData = getPeriodData(selectedPeriod);
            setKpis(periodData.data);
        }
    }, [selectedPeriod, isDataLoaded])

    return (
        <div className="min-h-screen finsight-bg">
            {/* Header */}
            <div className="finsight-header">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="finsight-title">FinSight Dashboard</h1>
                            <p className="finsight-dashboard-subtitle">{isDataLoaded && finSightData ? finSightData.period.label : getPeriodData(selectedPeriod).title}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Sélecteur de période */}
                            {!isDataLoaded && (
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                    className="finsight-select"
                                >
                                    <option value="current">Octobre 2025</option>
                                    <option value="previous">Septembre 2025</option>
                                    <option value="ytd">Année 2025</option>
                                </select>
                            )}

                            {/* Bouton Export */}
                            <button
                                onClick={exportToPDF}
                                disabled={isExporting}
                                className="finsight-btn-secondary"
                            >
                                <DocumentArrowDownIcon className="w-5 h-5" />
                                {isExporting ? 'Export...' : 'Export PDF'}
                            </button>

                            {/* Bouton Upload */}
                            <button
                                onClick={() => setShowUploadZone(!showUploadZone)}
                                className="finsight-btn-primary"
                            >
                                <CloudArrowUpIcon className="w-5 h-5" />
                                Import Données
                            </button>
                        </div>
                    </div>

                    {/* Zone d'upload */}
                    {showUploadZone && (
                        <div className="finsight-upload-zone">
                            <div className="text-center">
                                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <span className="mt-2 block text-sm font-medium text-gray-900">
                                            Glissez votre fichier CSV ici ou cliquez pour sélectionner
                                        </span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            accept=".csv"
                                            className="sr-only"
                                            onChange={handleFileUploadV2}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Status d'upload */}
                            {uploadStatus === 'uploading' && (
                                <div className="mt-4 text-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-sm text-gray-600">Traitement en cours...</p>
                                </div>
                            )}

                            {uploadStatus === 'success' && (
                                <div className="mt-4 text-center">
                                    <CheckCircleIcon className="h-6 w-6 text-green-600 mx-auto" />
                                    <p className="mt-2 text-sm text-green-600">Fichier traité avec succès !</p>
                                </div>
                            )}

                            {uploadStatus === 'error' && (
                                <div className="mt-4 text-center">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mx-auto" />
                                    <p className="mt-2 text-sm text-red-600">Erreur lors du traitement du fichier</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Dashboard Content */}
            <div ref={dashboardRef} className="container mx-auto px-6 pb-12">
                {/* KPIs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="finsight-card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{kpi.title}</h3>
                                <div className="finsight-icon-wrapper">
                                    {index === 0 && <BanknotesIcon className="w-6 h-6 text-green-600" />}
                                    {index === 1 && <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />}
                                    {index === 2 && <BanknotesIcon className="w-6 h-6 text-purple-600" />}
                                    {index === 3 && <ClockIcon className="w-6 h-6 text-orange-600" />}
                                    {index === 4 && <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />}
                                    {index === 5 && <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />}
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                                <div className="flex items-center mt-2">
                                    <span className={`text-sm font-medium ${kpi.changeType === 'positive' ? 'text-green-600' :
                                            kpi.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                        {kpi.change}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{kpi.description}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="finsight-card">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Évolution Trésorerie</h3>
                        <CashFlowChart />
                    </div>

                    <div className="finsight-card">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">DSO par Client</h3>
                        <DSOClientChart />
                    </div>

                    <div className="finsight-card">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Analyse Marge</h3>
                        <MarginAnalysisChart />
                    </div>

                    <div className="finsight-card">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Simulateur What-If</h3>
                        <WhatIfSimulator />
                    </div>
                </div>

                {/* AI Copilot Section - Phase 2 */}
                <div className="mb-12">
                    <AICopilot
                        finSightData={finSightData}
                        isDataLoaded={isDataLoaded}
                    />
                </div>
            </div>
        </div>
    )
}
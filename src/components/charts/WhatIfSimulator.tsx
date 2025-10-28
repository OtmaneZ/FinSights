'use client';

import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    ReferenceLine,
    Legend
} from 'recharts';
import {
    AdjustmentsHorizontalIcon,
    PlayIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Scenario {
    name: string;
    color: string;
    params: {
        revenueGrowth: number; // %
        costInflation: number; // %
        newHires: number; // nombre
        marketingBudget: number; // % du CA
        clientRetention: number; // %
    };
}

interface SimulationResult {
    month: string;
    baseline: number;
    optimistic: number;
    pessimistic: number;
    custom: number;
    cashFlow: number;
    runway: number; // mois
}

export default function WhatIfSimulator() {
    const [activeScenario, setActiveScenario] = useState<'baseline' | 'optimistic' | 'pessimistic' | 'custom'>('baseline');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);

    const [customParams, setCustomParams] = useState({
        revenueGrowth: 15, // %
        costInflation: 8, // %
        newHires: 3, // nombre
        marketingBudget: 12, // % du CA
        clientRetention: 92 // %
    });

    const scenarios: Record<string, Scenario> = {
        baseline: {
            name: 'Scénario de Base',
            color: '#6b7280',
            params: { revenueGrowth: 12, costInflation: 5, newHires: 2, marketingBudget: 8, clientRetention: 90 }
        },
        optimistic: {
            name: 'Scénario Optimiste',
            color: '#10b981',
            params: { revenueGrowth: 25, costInflation: 3, newHires: 5, marketingBudget: 15, clientRetention: 95 }
        },
        pessimistic: {
            name: 'Scénario Pessimiste',
            color: '#ef4444',
            params: { revenueGrowth: 5, costInflation: 12, newHires: 0, marketingBudget: 5, clientRetention: 80 }
        },
        custom: {
            name: 'Scénario Personnalisé',
            color: '#3b82f6',
            params: customParams
        }
    };

    // Simulation des résultats financiers
    const runSimulation = (params: Scenario['params']) => {
        const baseRevenue = 95000; // CA mensuel actuel
        const baseCosts = 65000; // Coûts mensuels actuels
        const currentCash = 245000; // Trésorerie actuelle

        const results: SimulationResult[] = [];
        let cashPosition = currentCash;

        for (let month = 1; month <= 12; month++) {
            // Calcul du CA avec croissance
            const revenue = baseRevenue * (1 + (params.revenueGrowth / 100) * (month / 12));

            // Calcul des coûts avec inflation + nouveaux employés
            const additionalCosts = params.newHires * 5000 * (month / 12); // 5k€/mois par employé
            const marketingCosts = revenue * (params.marketingBudget / 100);
            const operationalCosts = baseCosts * (1 + (params.costInflation / 100) * (month / 12));
            const totalCosts = operationalCosts + additionalCosts + marketingCosts;

            // Impact de la rétention client sur le CA
            const retentionImpact = (params.clientRetention / 100);
            const adjustedRevenue = revenue * retentionImpact;

            // Cash flow mensuel
            const monthlyCashFlow = adjustedRevenue - totalCosts;
            cashPosition += monthlyCashFlow;

            // Calcul du runway (mois de survie)
            const burnRate = totalCosts - adjustedRevenue;
            const runway = burnRate > 0 ? Math.max(0, cashPosition / burnRate) : 999;

            results.push({
                month: `M${month}`,
                baseline: month === 1 ? baseRevenue - baseCosts : 0,
                optimistic: 0,
                pessimistic: 0,
                custom: monthlyCashFlow,
                cashFlow: cashPosition,
                runway: runway
            });
        }

        return results;
    };

    // Exécuter toutes les simulations
    const runAllSimulations = () => {
        setIsSimulating(true);

        setTimeout(() => {
            const allResults: SimulationResult[] = [];

            for (let month = 1; month <= 12; month++) {
                const baselineResult = runSimulation(scenarios.baseline.params);
                const optimisticResult = runSimulation(scenarios.optimistic.params);
                const pessimisticResult = runSimulation(scenarios.pessimistic.params);
                const customResult = runSimulation(scenarios.custom.params);

                allResults.push({
                    month: `M${month}`,
                    baseline: baselineResult[month - 1].custom,
                    optimistic: optimisticResult[month - 1].custom,
                    pessimistic: pessimisticResult[month - 1].custom,
                    custom: customResult[month - 1].custom,
                    cashFlow: customResult[month - 1].cashFlow,
                    runway: customResult[month - 1].runway
                });
            }

            setSimulationResults(allResults);
            setIsSimulating(false);
        }, 1500);
    };

    useEffect(() => {
        runAllSimulations();
    }, [customParams]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const getScenarioImpact = () => {
        if (simulationResults.length === 0) return null;

        const lastResult = simulationResults[simulationResults.length - 1];
        const baseline = lastResult.baseline;
        const custom = lastResult.custom;
        const impact = ((custom - baseline) / Math.abs(baseline)) * 100;

        return {
            impact: impact,
            cashFlow: lastResult.cashFlow,
            runway: lastResult.runway,
            isPositive: impact > 0
        };
    };

    const impact = getScenarioImpact();

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Simulations What-If</h3>
                    <p className="text-sm text-gray-600">Modélisez l'impact de vos décisions stratégiques</p>
                </div>
                <button
                    onClick={runAllSimulations}
                    disabled={isSimulating}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSimulating ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    ) : (
                        <PlayIcon className="h-4 w-4" />
                    )}
                    <span>{isSimulating ? 'Simulation...' : 'Relancer'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panneau de contrôle */}
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                            Paramètres du Scénario
                        </h4>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Croissance CA: {customParams.revenueGrowth}%
                                </label>
                                <input
                                    type="range"
                                    min="-20"
                                    max="50"
                                    value={customParams.revenueGrowth}
                                    onChange={(e) => setCustomParams({ ...customParams, revenueGrowth: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Inflation Coûts: {customParams.costInflation}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="25"
                                    value={customParams.costInflation}
                                    onChange={(e) => setCustomParams({ ...customParams, costInflation: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nouveaux Employés: {customParams.newHires}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={customParams.newHires}
                                    onChange={(e) => setCustomParams({ ...customParams, newHires: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Budget Marketing: {customParams.marketingBudget}% CA
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    value={customParams.marketingBudget}
                                    onChange={(e) => setCustomParams({ ...customParams, marketingBudget: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rétention Clients: {customParams.clientRetention}%
                                </label>
                                <input
                                    type="range"
                                    min="70"
                                    max="100"
                                    value={customParams.clientRetention}
                                    onChange={(e) => setCustomParams({ ...customParams, clientRetention: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Scénarios prédéfinis */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Scénarios Prédéfinis</h4>
                        <div className="space-y-2">
                            {Object.entries(scenarios).map(([key, scenario]) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        if (key !== 'custom') {
                                            setCustomParams(scenario.params);
                                        }
                                        setActiveScenario(key as any);
                                    }}
                                    className={`w-full text-left p-3 rounded-lg border ${activeScenario === key
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: scenario.color }}
                                        />
                                        <span className="font-medium text-sm">{scenario.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visualisations */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Graphique principal */}
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={simulationResults} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" fontSize={12} />
                                <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k€`} fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="baseline" stroke={scenarios.baseline.color} strokeWidth={2} name="Base" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="optimistic" stroke={scenarios.optimistic.color} strokeWidth={2} name="Optimiste" />
                                <Line type="monotone" dataKey="pessimistic" stroke={scenarios.pessimistic.color} strokeWidth={2} name="Pessimiste" />
                                <Line type="monotone" dataKey="custom" stroke={scenarios.custom.color} strokeWidth={3} name="Personnalisé" />
                                <ReferenceLine y={0} stroke="#000" strokeDasharray="2 2" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Métriques d'impact */}
                    {impact && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-lg border-2 ${impact.isPositive ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                <div className="flex items-center space-x-2">
                                    {impact.isPositive ? (
                                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                                    )}
                                    <span className="text-sm font-medium text-gray-700">Impact vs Base</span>
                                </div>
                                <p className={`text-lg font-bold ${impact.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {impact.impact > 0 ? '+' : ''}{impact.impact.toFixed(1)}%
                                </p>
                            </div>

                            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                                <span className="text-sm font-medium text-gray-700">Trésorerie finale</span>
                                <p className="text-lg font-bold text-gray-800">
                                    {formatCurrency(impact.cashFlow)}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                                <span className="text-sm font-medium text-gray-700">Runway</span>
                                <p className="text-lg font-bold text-gray-800">
                                    {impact.runway > 100 ? '∞' : `${Math.round(impact.runway)} mois`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Insights IA */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                        <div className="flex items-start space-x-3">
                            <div className="text-orange-600 text-lg">🤖</div>
                            <div>
                                <p className="text-sm font-semibold text-orange-900 mb-1">Analyse de Scénario IA</p>
                                <p className="text-sm text-orange-800">
                                    {impact && impact.isPositive ? (
                                        <>
                                            <strong>Scénario favorable :</strong> +{impact.impact.toFixed(1)}% vs baseline.
                                            Forte croissance prévue avec trésorerie finale de {formatCurrency(impact.cashFlow)}.
                                        </>
                                    ) : (
                                        <>
                                            <strong>Attention :</strong> Scénario risqué ({impact?.impact.toFixed(1)}% vs baseline).
                                            Surveiller la trésorerie et optimiser les coûts.
                                        </>
                                    )}
                                </p>
                                <p className="text-xs text-orange-700 mt-2">
                                    💡 <strong>Recommandation :</strong> {
                                        (customParams.marketingBudget > 20) ? 'Réduire le budget marketing pour préserver la trésorerie.' :
                                            (customParams.newHires > 5) ? 'Étaler les recrutements sur plusieurs trimestres.' :
                                                'Scénario équilibré, surveiller l\'évolution mensuelle.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
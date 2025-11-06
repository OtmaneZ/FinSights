'use client'

import React, { useState } from 'react';
import type { Anomaly, RiskLevel } from '@/lib/ml/types';
import {
    ExclamationTriangleIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    XMarkIcon,
    CheckCircleIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

// Format date to French format (DD/MM/YYYY)
function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    } catch {
        return dateString; // Return original if parsing fails
    }
}

interface AnomalyPanelProps {
    anomalies: Anomaly[];
    onDismiss?: (anomalyId: string) => void;
    onInvestigate?: (anomaly: Anomaly) => void;
}

export function AnomalyPanel({ anomalies, onDismiss, onInvestigate }: AnomalyPanelProps) {
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

    const visibleAnomalies = anomalies.filter(a => !dismissedIds.has(a.id));

    const handleDismiss = (id: string) => {
        setDismissedIds(prev => new Set(prev).add(id));
        onDismiss?.(id);
    };

    if (visibleAnomalies.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-center text-green-600 gap-2">
                    <CheckCircleIcon className="w-6 h-6" />
                    <p className="text-sm font-semibold">Aucune anomalie détectée</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Anomalies Détectées ({visibleAnomalies.length})
                    </h3>
                </div>
                {visibleAnomalies.length > 0 && (
                    <div className="flex gap-2 text-xs">
                        {getRiskSummary(visibleAnomalies).map(([risk, count]) => (
                            count > 0 && (
                                <div key={risk} className="relative group">
                                    <span
                                        className={`px-2 py-1 rounded cursor-help ${getRiskBadgeClass(risk as RiskLevel)}`}
                                    >
                                        {count} {risk}
                                    </span>
                                    {/* Tooltip mini résumé */}
                                    <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-10 w-40">
                                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                                            <p className="text-gray-200">{getRiskTooltip(risk as RiskLevel)}</p>
                                            <div className="absolute right-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {visibleAnomalies.map((anomaly, index) => (
                    <div
                        key={anomaly.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
                        style={{
                            animation: `fadeIn 0.4s ease-out ${index * 0.08}s both, slideInRight 0.4s ease-out ${index * 0.08}s both`
                        }}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                                {/* Icon */}
                                <div className={`p-2 rounded-lg ${getIconBgClass(anomaly.riskLevel)}`}>
                                    {getAnomalyIcon(anomaly.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900">{anomaly.title}</h4>
                                        <div className="relative group">
                                            <span
                                                className={`px-2 py-0.5 text-xs font-medium rounded cursor-help ${getRiskBadgeClass(anomaly.riskLevel)} ${anomaly.riskLevel === 'critical' ? 'anomaly-critical-pulse' : ''}`}
                                            >
                                                {getRiskLabel(anomaly.riskLevel)}
                                            </span>
                                            {/* Tooltip */}
                                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-48">
                                                <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                                                    <div className="font-semibold mb-1">{getRiskLabel(anomaly.riskLevel)}</div>
                                                    <p className="text-gray-300">{getRiskTooltip(anomaly.riskLevel)}</p>
                                                    <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-2">
                                        {anomaly.description}
                                    </p>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                        {anomaly.metadata?.client && (
                                            <span className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                                                👤 {anomaly.metadata.client}
                                            </span>
                                        )}
                                        {anomaly.metadata?.category && (
                                            <span className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                                                📂 {anomaly.metadata.category}
                                            </span>
                                        )}
                                        {anomaly.metadata?.date && (
                                            <span className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                                                📅 {formatDate(anomaly.metadata.date)}
                                            </span>
                                        )}
                                        <div className="relative group">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded cursor-help hover:bg-blue-100 transition-colors">
                                                🎯 Confiance: {(anomaly.confidence * 100).toFixed(0)}%
                                            </span>
                                            {/* Tooltip confiance */}
                                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-56">
                                                <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                                                    <div className="font-semibold mb-1">Score de Confiance ML</div>
                                                    <p className="text-gray-300">
                                                        Probabilité que cette anomalie soit réelle.
                                                        {anomaly.confidence >= 0.9 ? ' Très fiable.' : anomaly.confidence >= 0.7 ? ' Fiabilité élevée.' : ' À vérifier.'}
                                                    </p>
                                                    <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1">
                                <div className="relative group">
                                    <button
                                        onClick={() => onInvestigate?.(anomaly)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 hover:scale-110"
                                        title="Investiguer"
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                    </button>
                                    <div className="absolute right-full mr-2 top-0 hidden group-hover:block z-10 whitespace-nowrap">
                                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1">
                                            Investiguer
                                        </div>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <button
                                        onClick={() => handleDismiss(anomaly.id)}
                                        className="p-2 text-gray-400 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110"
                                        title="Ignorer"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                    <div className="absolute right-full mr-2 top-0 hidden group-hover:block z-10 whitespace-nowrap">
                                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1">
                                            Ignorer
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend/Help */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    💡 <strong>Conseil:</strong> Les anomalies sont détectées automatiquement via Machine Learning (Z-score, IQR, patterns).
                    Cliquez sur <EyeIcon className="w-4 h-4 inline" /> pour investiguer ou <XMarkIcon className="w-4 h-4 inline" /> pour ignorer.
                </p>
            </div>
        </div>
    );
}

/**
 * Utilitaires
 */
function getAnomalyIcon(type: string) {
    switch (type) {
        case 'amount_outlier':
            return <CurrencyDollarIcon className="w-5 h-5 text-orange-600" />;
        case 'payment_delay':
            return <ClockIcon className="w-5 h-5 text-red-600" />;
        case 'category_spike':
            return <ChartBarIcon className="w-5 h-5 text-purple-600" />;
        default:
            return <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />;
    }
}

function getIconBgClass(risk: RiskLevel): string {
    switch (risk) {
        case 'critical':
            return 'bg-red-100';
        case 'high':
            return 'bg-orange-100';
        case 'medium':
            return 'bg-yellow-100';
        case 'low':
            return 'bg-blue-100';
    }
}

function getRiskBadgeClass(risk: RiskLevel): string {
    switch (risk) {
        case 'critical':
            return 'bg-red-100 text-red-800';
        case 'high':
            return 'bg-orange-100 text-orange-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'low':
            return 'bg-blue-100 text-blue-800';
    }
}

function getRiskLabel(risk: RiskLevel): string {
    switch (risk) {
        case 'critical':
            return '🚨 Critique';
        case 'high':
            return '⚠️ Élevé';
        case 'medium':
            return '⚡ Moyen';
        case 'low':
            return 'ℹ️ Faible';
    }
}

function getRiskTooltip(risk: RiskLevel): string {
    switch (risk) {
        case 'critical':
            return 'Nécessite une action immédiate. Impact potentiel très élevé sur la trésorerie ou la santé financière.';
        case 'high':
            return 'Requiert attention rapide. Risque significatif identifié par les algorithmes ML.';
        case 'medium':
            return 'À surveiller. Écart détecté mais dans des limites acceptables.';
        case 'low':
            return 'Information. Légère déviation par rapport aux patterns habituels.';
    }
}

function getRiskSummary(anomalies: Anomaly[]): [string, number][] {
    const counts: Record<RiskLevel, number> = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
    };

    anomalies.forEach(a => counts[a.riskLevel]++);

    return Object.entries(counts).filter(([_, count]) => count > 0);
}

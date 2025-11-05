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
                                <span
                                    key={risk}
                                    className={`px-2 py-1 rounded ${getRiskBadgeClass(risk as RiskLevel)}`}
                                >
                                    {count} {risk}
                                </span>
                            )
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {visibleAnomalies.map((anomaly, index) => (
                    <div
                        key={anomaly.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        style={{
                            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
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
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getRiskBadgeClass(anomaly.riskLevel)}`}>
                                            {anomaly.riskLevel}
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-2">
                                        {anomaly.description}
                                    </p>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                        {anomaly.metadata?.client && (
                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                👤 {anomaly.metadata.client}
                                            </span>
                                        )}
                                        {anomaly.metadata?.category && (
                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                📂 {anomaly.metadata.category}
                                            </span>
                                        )}
                                        {anomaly.metadata?.date && (
                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                📅 {anomaly.metadata.date}
                                            </span>
                                        )}
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                            🎯 Confiance: {(anomaly.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => onInvestigate?.(anomaly)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Investiguer"
                                >
                                    <EyeIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDismiss(anomaly.id)}
                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                                    title="Ignorer"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
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

'use client'

import { useState } from 'react';
import Link from 'next/link';
import {
    FinSightScore,
    ScoreLevel,
    ScoreBreakdown
} from '@/lib/scoring/finSightScore';
import {
    ShieldCheckIcon,
    BanknotesIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';

interface FinSightScoreProps {
    score: FinSightScore;
}

/**
 * Composant principal Score FinSight™
 * Affiche score 0-100 avec breakdown détaillé et recommandations
 */
export default function FinSightScoreCard({ score }: FinSightScoreProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const { total, level, breakdown, insights, recommendations } = score;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header avec score principal */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Score FinSight™
                            </h2>
                            <InfoTooltip />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Santé financière globale de votre entreprise
                        </p>
                    </div>

                    {/* Score circulaire */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <CircularScore score={total} level={level} />
                        </div>
                        <ScoreLevelBadge level={level} />
                    </div>
                </div>
            </div>

            {/* Breakdown 4 piliers */}
            <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <PillarCard
                    icon={BanknotesIcon}
                    title="Trésorerie"
                    score={breakdown.cash}
                    max={25}
                    color="blue"
                />
                <PillarCard
                    icon={ChartBarIcon}
                    title="Marges"
                    score={breakdown.margin}
                    max={25}
                    color="green"
                />
                <PillarCard
                    icon={ShieldCheckIcon}
                    title="Résilience"
                    score={breakdown.resilience}
                    max={25}
                    color="purple"
                />
                <PillarCard
                    icon={ExclamationTriangleIcon}
                    title="Risques"
                    score={breakdown.risk}
                    max={25}
                    color="orange"
                />
            </div>

            {/* Insights clés (toujours visibles) */}
            <div className="px-6 pb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    🎯 Insights Clés
                </h3>
                <div className="space-y-2">
                    {insights.slice(0, 3).map((insight, idx) => (
                        <div
                            key={idx}
                            className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                        >
                            <span className="mt-0.5">•</span>
                            <span>{insight}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bouton expand pour recommandations */}
            <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <span>
                        {isExpanded ? '📋 Masquer' : '💡 Voir'} les recommandations ({recommendations.length})
                    </span>
                    {isExpanded ? (
                        <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Recommandations (collapsible) */}
            {isExpanded && (
                <div className="px-6 pb-6 pt-2 bg-gray-50 dark:bg-gray-900 space-y-3">
                    {recommendations.map((rec, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {idx + 1}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                {rec}
                            </p>
                        </div>
                    ))}

                    {/* CTA Consulting conditionnel si score < 60 */}
                    {(level === 'warning' || level === 'critical') && (
                        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                                    <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                        Votre score révèle des signaux faibles critiques
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                        Un audit approfondi peut identifier les leviers d'action prioritaires et vous aider à redresser rapidement la situation. Nos consultants analysent votre trésorerie, marges et risques pour vous proposer un plan d'action concret.
                                    </p>
                                    <Link
                                        href="/consulting"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                                    >
                                        Réserver un audit express (2 500€)
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * Score circulaire avec couleur dynamique
 */
function CircularScore({ score, level }: { score: number; level: ScoreLevel }) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const colorMap: Record<ScoreLevel, string> = {
        excellent: 'text-green-600',
        good: 'text-blue-600',
        warning: 'text-orange-500',
        critical: 'text-red-600'
    };

    const strokeColorMap: Record<ScoreLevel, string> = {
        excellent: 'stroke-green-600',
        good: 'stroke-blue-600',
        warning: 'stroke-orange-500',
        critical: 'stroke-red-600'
    };

    return (
        <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`${strokeColorMap[level]} transition-all duration-1000 ease-out`}
                />
            </svg>
            {/* Score text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <span className={`text-4xl font-bold ${colorMap[level]}`}>
                        {score}
                    </span>
                    <span className="text-lg text-gray-500 dark:text-gray-400">/100</span>
                </div>
            </div>
        </div>
    );
}

/**
 * Badge niveau de score
 */
function ScoreLevelBadge({ level }: { level: ScoreLevel }) {
    const config: Record<ScoreLevel, { label: string; bgColor: string; textColor: string }> = {
        excellent: {
            label: 'Excellent',
            bgColor: 'bg-green-100 dark:bg-green-900',
            textColor: 'text-green-800 dark:text-green-200'
        },
        good: {
            label: 'Bon',
            bgColor: 'bg-blue-100 dark:bg-blue-900',
            textColor: 'text-blue-800 dark:text-blue-200'
        },
        warning: {
            label: 'Attention',
            bgColor: 'bg-orange-100 dark:bg-orange-900',
            textColor: 'text-orange-800 dark:text-orange-200'
        },
        critical: {
            label: 'Critique',
            bgColor: 'bg-red-100 dark:bg-red-900',
            textColor: 'text-red-800 dark:text-red-200'
        }
    };

    const { label, bgColor, textColor } = config[level];

    return (
        <span
            className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
        >
            {label}
        </span>
    );
}

/**
 * Carte pilier (Cash, Margin, Resilience, Risk)
 */
function PillarCard({
    icon: Icon,
    title,
    score,
    max,
    color
}: {
    icon: any;
    title: string;
    score: number;
    max: number;
    color: 'blue' | 'green' | 'purple' | 'orange';
}) {
    const percentage = (score / max) * 100;

    const colorMap = {
        blue: {
            icon: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-100 dark:bg-blue-900',
            bar: 'bg-blue-500'
        },
        green: {
            icon: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-100 dark:bg-green-900',
            bar: 'bg-green-500'
        },
        purple: {
            icon: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-100 dark:bg-purple-900',
            bar: 'bg-purple-500'
        },
        orange: {
            icon: 'text-orange-600 dark:text-orange-400',
            bg: 'bg-orange-100 dark:bg-orange-900',
            bar: 'bg-orange-500'
        }
    };

    const colors = colorMap[color];

    return (
        <div className={`p-4 rounded-lg ${colors.bg} border border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${colors.icon}`} />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {score}/{max}
                </span>
            </div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {title}
            </h4>
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colors.bar} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

/**
 * Tooltip explicatif
 */
function InfoTooltip() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
                <InformationCircleIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute z-10 left-0 top-8 w-80 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                    <p className="mb-2 font-semibold">Score FinSight™ 0-100</p>
                    <p className="text-gray-300 mb-3">
                        Évalue votre santé financière globale sur 4 piliers :
                    </p>
                    <ul className="space-y-1 text-gray-300">
                        <li>• <strong>Trésorerie</strong> (25pts) : Runway, cash flow, DSO</li>
                        <li>• <strong>Marges</strong> (25pts) : Rentabilité, croissance CA</li>
                        <li>• <strong>Résilience</strong> (25pts) : Charges fixes, dépendance clients</li>
                        <li>• <strong>Risques</strong> (25pts) : Anomalies, volatilité</li>
                    </ul>
                    <div className="mt-3 pt-3 border-t border-gray-700 text-gray-400 text-xs">
                        &gt; 80 : Excellent | 60-80 : Bon | 40-60 : Attention | &lt; 40 : Critique
                    </div>
                </div>
            )}
        </div>
    );
}

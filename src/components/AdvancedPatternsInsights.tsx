/**
 * ADVANCED PATTERNS INSIGHTS - DASHIS
 * 
 * Affiche les tendances détectées par l'IA
 * Style McKinsey : insights clairs et actionnables
 */

'use client'

import { TrendingUp, TrendingDown, AlertCircle, Calendar, Activity } from 'lucide-react'
import '@/styles/premium-transitions.css'

interface PatternInsight {
    icon: 'trending-up' | 'trending-down' | 'alert' | 'calendar' | 'activity';
    type: 'positive' | 'warning' | 'neutral';
    title: string;
    description: string;
}

interface AdvancedPatternsInsightsProps {
    seasonalityDetected?: boolean;
    patterns?: any[]; // From analysis.patterns
    showTitle?: boolean;
}

export default function AdvancedPatternsInsights({
    seasonalityDetected,
    patterns = [],
    showTitle = true
}: AdvancedPatternsInsightsProps) {

    // Générer des insights intelligents basés sur les données disponibles
    const generateInsights = (): PatternInsight[] => {
        const insights: PatternInsight[] = [];

        // 1. Saisonnalité détectée
        if (seasonalityDetected) {
            insights.push({
                icon: 'calendar',
                type: 'neutral',
                title: 'Saisonnalité forte détectée',
                description: 'Votre activité présente des variations saisonnières marquées. Anticipez les pics de trésorerie pour optimiser votre BFR.'
            });
        }

        // 2. Patterns depuis l'analyse
        if (patterns && patterns.length > 0) {
            patterns.slice(0, 2).forEach(pattern => {
                if (pattern.type === 'growth') {
                    insights.push({
                        icon: 'trending-up',
                        type: 'positive',
                        title: pattern.title || 'Croissance soutenue',
                        description: pattern.description || 'Votre CA progresse de manière stable sur les derniers mois.'
                    });
                } else if (pattern.type === 'degradation') {
                    insights.push({
                        icon: 'trending-down',
                        type: 'warning',
                        title: pattern.title || 'Dégradation progressive',
                        description: pattern.description || 'Certains indicateurs montrent une tendance baissière.'
                    });
                }
            });
        }

        // 3. Insights par défaut si pas de données
        if (insights.length === 0) {
            insights.push(
                {
                    icon: 'activity',
                    type: 'neutral',
                    title: 'Analyse en cours',
                    description: 'L\'IA continue d\'analyser vos données pour détecter des tendances cachées. Résultats disponibles après plusieurs imports.'
                },
                {
                    icon: 'trending-up',
                    type: 'positive',
                    title: 'Performance stable',
                    description: 'Aucune anomalie majeure détectée. Continuez à monitorer vos KPIs clés régulièrement.'
                }
            );
        }

        return insights.slice(0, 3); // Max 3 insights
    };

    const insights = generateInsights();

    const getIcon = (iconType: string) => {
        switch (iconType) {
            case 'trending-up':
                return <TrendingUp className="w-5 h-5" />;
            case 'trending-down':
                return <TrendingDown className="w-5 h-5" />;
            case 'alert':
                return <AlertCircle className="w-5 h-5" />;
            case 'calendar':
                return <Calendar className="w-5 h-5" />;
            case 'activity':
            default:
                return <Activity className="w-5 h-5" />;
        }
    };

    const getColors = (type: 'positive' | 'warning' | 'neutral') => {
        switch (type) {
            case 'positive':
                return {
                    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
                    border: 'border-emerald-200 dark:border-emerald-800',
                    icon: 'text-emerald-600 dark:text-emerald-400',
                    iconBg: 'bg-emerald-100 dark:bg-emerald-900/20'
                };
            case 'warning':
                return {
                    bg: 'bg-orange-50 dark:bg-orange-900/10',
                    border: 'border-orange-200 dark:border-orange-800',
                    icon: 'text-orange-600 dark:text-orange-400',
                    iconBg: 'bg-orange-100 dark:bg-orange-900/20'
                };
            case 'neutral':
            default:
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/10',
                    border: 'border-blue-200 dark:border-blue-800',
                    icon: 'text-blue-600 dark:text-blue-400',
                    iconBg: 'bg-blue-100 dark:bg-blue-900/20'
                };
        }
    };

    return (
        <div className="mb-8">
            {showTitle && (
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">🔍 Tendances détectées</h3>
                        <p className="text-sm text-tertiary">Insights IA sur votre activité</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {insights.map((insight, idx) => {
                    const colors = getColors(insight.type);
                    return (
                        <div
                            key={idx}
                            className={`premium-card ${colors.bg} ${colors.border} border rounded-xl p-5`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`${colors.iconBg} ${colors.icon} rounded-lg p-2.5 flex-shrink-0`}>
                                    {getIcon(insight.icon)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-primary mb-1">
                                        {insight.title}
                                    </h4>
                                    <p className="text-sm text-secondary leading-relaxed">
                                        {insight.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

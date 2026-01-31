/**
 * KPI CARD ENRICHED - DASHIS
 * 
 * Carte KPI premium avec :
 * - Icône métier spécifique
 * - Tooltip définition au survol
 * - Transitions smooth
 * - Style McKinsey
 */

'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'
import { getKPIMetadata } from '@/lib/kpiMetadata'
import '@/styles/premium-transitions.css'

interface KPICardEnrichedProps {
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    description?: string;
}

export default function KPICardEnriched({
    title,
    value,
    change,
    changeType = 'neutral',
    description
}: KPICardEnrichedProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const metadata = getKPIMetadata(title);
    const IconComponent = metadata.icon;

    return (
        <div 
            className="premium-card relative bg-secondary border border-border-subtle rounded-xl p-6 cursor-pointer group"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-50 w-72 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg shadow-xl px-4 py-3 border border-slate-700 dark:border-slate-300">
                        <div className="flex items-start gap-2 mb-2">
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400 dark:text-blue-600" />
                            <div>
                                <p className="text-xs font-semibold mb-1">{title}</p>
                                <p className="text-xs leading-relaxed text-slate-300 dark:text-slate-700">
                                    {metadata.definition}
                                </p>
                                {metadata.formula && (
                                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-2 font-mono">
                                        {metadata.formula}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Arrow */}
                    <div className="w-3 h-3 bg-slate-900 dark:bg-slate-100 border-r border-b border-slate-700 dark:border-slate-300 transform rotate-45 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"></div>
                </div>
            )}

            {/* Header avec icône */}
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                    showTooltip 
                        ? 'bg-accent-primary/20 scale-110' 
                        : 'bg-accent-primary/10'
                }`}>
                    <IconComponent className={`w-5 h-5 ${metadata.color} transition-transform duration-300 ${
                        showTooltip ? 'scale-110' : ''
                    }`} />
                </div>
                
                {/* Info icon hint */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Info className="w-4 h-4 text-tertiary" />
                </div>
            </div>

            {/* Title */}
            <h3 className="text-sm text-secondary font-medium mb-2 transition-colors duration-200 group-hover:text-primary">
                {title}
            </h3>

            {/* Value */}
            <p className="text-3xl font-bold text-primary mb-2 transition-transform duration-200 group-hover:scale-105">
                {value}
            </p>

            {/* Change indicator */}
            {change && (
                <div className={`flex items-center gap-1.5 text-xs mt-2 transition-all duration-200 ${
                    changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' :
                    changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
                    'text-slate-600 dark:text-slate-400'
                }`}>
                    {changeType === 'positive' ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                    ) : changeType === 'negative' ? (
                        <TrendingDown className="w-3.5 h-3.5" />
                    ) : null}
                    <span className="font-medium">{change}</span>
                </div>
            )}

            {/* Description (si disponible) */}
            {description && (
                <p className="text-xs text-tertiary mt-2 line-clamp-2">
                    {description}
                </p>
            )}
        </div>
    );
}

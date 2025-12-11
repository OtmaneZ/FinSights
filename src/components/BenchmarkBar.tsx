import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface BenchmarkBarProps {
    kpiName: string;
    currentValue: number;
    sector: 'services' | 'commerce' | 'industrie' | 'saas';
    unit?: string;
    inverse?: boolean; // Pour les KPIs où plus bas = mieux (ex: DSO)
}

const SECTOR_BENCHMARKS: Record<string, Record<string, { min: number; median: number; max: number }>> = {
    DSO: {
        services: { min: 30, median: 45, max: 60 },
        commerce: { min: 20, median: 35, max: 50 },
        industrie: { min: 45, median: 60, max: 90 },
        saas: { min: 15, median: 30, max: 45 },
    },
    BFR: {
        services: { min: 5, median: 10, max: 20 },
        commerce: { min: 10, median: 15, max: 25 },
        industrie: { min: 15, median: 25, max: 35 },
        saas: { min: 2, median: 5, max: 10 },
    },
    MARGE_NETTE: {
        services: { min: 5, median: 10, max: 20 },
        commerce: { min: 2, median: 5, max: 10 },
        industrie: { min: 4, median: 8, max: 15 },
        saas: { min: -50, median: 15, max: 35 }, // 🆕 Early-stage SaaS peut être négatif
    },
    MARGE_BRUTE: {
        services: { min: 30, median: 50, max: 70 },
        commerce: { min: 20, median: 30, max: 40 },
        industrie: { min: 25, median: 35, max: 50 },
        saas: { min: 75, median: 85, max: 95 }, // 🆕 SaaS doit avoir marge brute très élevée
    },
    // ✅ Nouveaux benchmarks : Croissance (en %)
    REVENUS_CROISSANCE: {
        services: { min: -5, median: 10, max: 30 },
        commerce: { min: -10, median: 5, max: 20 },
        industrie: { min: -5, median: 8, max: 25 },
        saas: { min: 20, median: 80, max: 150 },
    },
    CHARGES_CROISSANCE: {
        services: { min: -10, median: 0, max: 15 },
        commerce: { min: -5, median: 15, max: 30 },
        industrie: { min: 0, median: 10, max: 25 },
        saas: { min: 20, median: 40, max: 80 },
    },
    CASH_FLOW_CROISSANCE: {
        services: { min: 0, median: 15, max: 35 },
        commerce: { min: -5, median: 10, max: 30 },
        industrie: { min: 5, median: 12, max: 28 },
        saas: { min: 50, median: 120, max: 250 },
    },
};

export const BenchmarkBar: React.FC<BenchmarkBarProps> = ({
    kpiName,
    currentValue,
    sector,
    unit = '%',
    inverse = false,
}) => {
    const benchmark = SECTOR_BENCHMARKS[kpiName]?.[sector];

    if (!benchmark) {
        return null;
    }

    const { min, median, max } = benchmark;

    // Calculer la position sur la barre (0 à 100%)
    const calculatePosition = () => {
        if (currentValue <= min) return 0;
        if (currentValue >= max) return 100;
        return ((currentValue - min) / (max - min)) * 100;
    };

    // Déterminer la couleur selon la performance
    const getPerformanceColor = () => {
        if (inverse) {
            // Pour DSO, BFR : plus bas = mieux
            if (currentValue <= median) return 'text-emerald-600';
            if (currentValue <= max) return 'text-orange-500';
            return 'text-red-600';
        } else {
            // Pour marges, cash flow : plus haut = mieux
            if (currentValue >= median) return 'text-emerald-600';
            if (currentValue >= min) return 'text-orange-500';
            return 'text-red-600';
        }
    };

    const getPerformanceLabel = () => {
        if (inverse) {
            if (currentValue <= median) return 'Excellent';
            if (currentValue <= max) return 'À surveiller';
            return 'Critique';
        } else {
            if (currentValue >= median) return 'Excellent';
            if (currentValue >= min) return 'À améliorer';
            return 'Faible';
        }
    };

    const getBarColor = () => {
        if (inverse) {
            if (currentValue <= median) return 'bg-emerald-500';
            if (currentValue <= max) return 'bg-orange-500';
            return 'bg-red-500';
        } else {
            if (currentValue >= median) return 'bg-emerald-500';
            if (currentValue >= min) return 'bg-orange-500';
            return 'bg-red-500';
        }
    };

    const position = calculatePosition();
    const performanceColor = getPerformanceColor();
    const performanceLabel = getPerformanceLabel();
    const barColor = getBarColor();

    const getSectorLabel = (sector: string) => {
        const labels: Record<string, string> = {
            services: 'Services',
            commerce: 'Commerce',
            industrie: 'Industrie',
            saas: 'SaaS',
        };
        return labels[sector] || sector;
    };

    return (
        <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                    <ChartBarIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600 font-medium">
                        Benchmark {getSectorLabel(sector)}
                    </span>
                </div>
                <span className={`font-semibold ${performanceColor}`}>
                    {performanceLabel}
                </span>
            </div>

            {/* Barre de progression */}
            <div className="relative">
                {/* Background track */}
                <div className="h-2 bg-gradient-to-r from-emerald-100 via-orange-100 to-red-100 rounded-full" />

                {/* Markers pour min, median, max */}
                <div className="absolute top-0 left-0 w-full h-2 flex justify-between items-center">
                    {/* Min marker */}
                    <div className="absolute left-0 w-0.5 h-4 bg-slate-400 -mt-1" />
                    {/* Median marker */}
                    <div
                        className="absolute w-0.5 h-4 bg-slate-600 -mt-1"
                        style={{ left: '50%' }}
                    />
                    {/* Max marker */}
                    <div className="absolute right-0 w-0.5 h-4 bg-slate-400 -mt-1" />
                </div>

                {/* Current value indicator */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${position}%` }}
                >
                    <div className={`w-4 h-4 rounded-full border-2 border-slate-200 shadow-lg ${barColor}`} />
                </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between text-[10px] text-slate-500">
                <span>
                    Min: {min}
                    {unit}
                </span>
                <span className="font-semibold">
                    Médiane: {median}
                    {unit}
                </span>
                <span>
                    Max: {max}
                    {unit}
                </span>
            </div>

            {/* Current value */}
            <div className="text-center">
                <span className={`text-sm font-bold ${performanceColor}`}>
                    Votre entreprise: {currentValue.toFixed(1)}
                    {unit}
                </span>
            </div>
        </div>
    );
};

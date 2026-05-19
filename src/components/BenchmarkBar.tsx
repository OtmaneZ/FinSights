import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import {
    DSO_BENCHMARKS,
    resolveDsoSectorKey,
    type DsoSectorKey,
} from '@/lib/benchmarks/dso-sectoriels';

/** Secteurs legacy (dashboard, hub) — hors DSO unifié */
type LegacyBenchmarkSector = 'services' | 'commerce' | 'industrie' | 'saas';

interface BenchmarkBarProps {
    kpiName: string;
    currentValue: number;
    sector: LegacyBenchmarkSector | DsoSectorKey | string;
    unit?: string;
    inverse?: boolean;
}

const LEGACY_SECTOR_BENCHMARKS: Record<
    string,
    Record<LegacyBenchmarkSector, { min: number; median: number; max: number }>
> = {
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
        saas: { min: -50, median: 15, max: 35 },
    },
    MARGE_BRUTE: {
        services: { min: 30, median: 50, max: 70 },
        commerce: { min: 20, median: 30, max: 40 },
        industrie: { min: 25, median: 35, max: 50 },
        saas: { min: 75, median: 85, max: 95 },
    },
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

function getDsoBenchmark(sector: string) {
    const key = resolveDsoSectorKey(sector);
    if (!key) return null;
    const bench = DSO_BENCHMARKS[key];
    return {
        min: bench.good,
        median: bench.median,
        max: bench.bad,
        label: bench.label,
        source: bench.source,
    };
}

export const BenchmarkBar: React.FC<BenchmarkBarProps> = ({
    kpiName,
    currentValue,
    sector,
    unit = '%',
    inverse = false,
}) => {
    const isDso = kpiName === 'DSO';
    const dsoBenchmark = isDso ? getDsoBenchmark(sector) : null;
    const legacyRow = LEGACY_SECTOR_BENCHMARKS[kpiName]
    const legacyBenchmark =
        !isDso && legacyRow && sector in legacyRow
            ? legacyRow[sector as LegacyBenchmarkSector]
            : undefined;

    const benchmark = isDso ? dsoBenchmark : legacyBenchmark;

    if (!benchmark) {
        return null;
    }

    const { min, median, max } = benchmark;
    const sectorLabel = isDso && dsoBenchmark ? dsoBenchmark.label : getLegacySectorLabel(sector);
    const sourceCitation = isDso && dsoBenchmark ? dsoBenchmark.source : null;

    const range = max - min || 1;
    const calculatePosition = () => {
        if (currentValue <= min) return 0;
        if (currentValue >= max) return 100;
        return ((currentValue - min) / range) * 100;
    };

    const medianPosition = Math.min(100, Math.max(0, ((median - min) / range) * 100));

    const getPerformanceColor = () => {
        if (inverse) {
            if (currentValue <= median) return 'text-emerald-600';
            if (currentValue <= max) return 'text-orange-500';
            return 'text-red-600';
        }
        if (currentValue >= median) return 'text-emerald-600';
        if (currentValue >= min) return 'text-orange-500';
        return 'text-red-600';
    };

    const getPerformanceLabel = () => {
        if (inverse) {
            if (currentValue <= median) return 'Excellent';
            if (currentValue <= max) return 'À surveiller';
            return 'Critique';
        }
        if (currentValue >= median) return 'Excellent';
        if (currentValue >= min) return 'À améliorer';
        return 'Faible';
    };

    const getBarColor = () => {
        if (inverse) {
            if (currentValue <= median) return 'bg-emerald-500';
            if (currentValue <= max) return 'bg-orange-500';
            return 'bg-red-500';
        }
        if (currentValue >= median) return 'bg-emerald-500';
        if (currentValue >= min) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const position = calculatePosition();
    const performanceColor = getPerformanceColor();
    const performanceLabel = getPerformanceLabel();
    const barColor = getBarColor();

    return (
        <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                    <ChartBarIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600 font-medium">
                        Benchmark {sectorLabel}
                    </span>
                </div>
                <span className={`font-semibold ${performanceColor}`}>
                    {performanceLabel}
                </span>
            </div>

            <div className="relative">
                <div className="h-2 bg-gradient-to-r from-emerald-100 via-orange-100 to-red-100 rounded-full" />

                <div className="absolute top-0 left-0 w-full h-2 flex justify-between items-center">
                    <div className="absolute left-0 w-0.5 h-4 bg-slate-400 -mt-1" />
                    <div
                        className="absolute w-0.5 h-4 bg-slate-600 -mt-1"
                        style={{ left: `${medianPosition}%` }}
                    />
                    <div className="absolute right-0 w-0.5 h-4 bg-slate-400 -mt-1" />
                </div>

                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${position}%` }}
                >
                    <div className={`w-4 h-4 rounded-full border-2 border-slate-200 shadow-lg ${barColor}`} />
                </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500">
                <span>
                    Bon: {min}
                    {unit}
                </span>
                <span className="font-semibold">
                    Médiane: {median}
                    {unit}
                </span>
                <span>
                    Critique: {max}
                    {unit}
                </span>
            </div>

            <div className="text-center">
                <span className={`text-sm font-bold ${performanceColor}`}>
                    Votre entreprise: {currentValue.toFixed(1)}
                    {unit}
                </span>
            </div>

            {sourceCitation && (
                <p className="text-[10px] text-slate-500 text-center border-t border-slate-200/50 pt-2">
                    Source : {sourceCitation}
                </p>
            )}
        </div>
    );
};

function getLegacySectorLabel(sector: string): string {
    const labels: Record<string, string> = {
        services: 'Services',
        commerce: 'Commerce',
        industrie: 'Industrie',
        saas: 'SaaS',
    };
    return labels[sector] || sector;
}

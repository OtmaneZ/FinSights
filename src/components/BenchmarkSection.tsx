/**
 * BENCHMARK SECTION - DASHIS
 * 
 * Affiche 3 benchmarks sectoriels clés sous le FinSight Score
 * Style premium McKinsey : comparaison visuelle vs industrie
 */

'use client'

import { TrendingUp, Target, Clock } from 'lucide-react'
import { BenchmarkBar } from './BenchmarkBar'

interface BenchmarkSectionProps {
    margeNette: number;      // en %
    dso: number;             // en jours
    bfr: number;             // en % du CA
    sector?: 'services' | 'commerce' | 'industrie' | 'saas';
}

export default function BenchmarkSection({
    margeNette,
    dso,
    bfr,
    sector = 'saas'
}: BenchmarkSectionProps) {

    return (
        <div className="mb-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-primary">Benchmarks Sectoriels</h2>
                    <p className="text-sm text-tertiary">Positionnement vs industrie</p>
                </div>
            </div>

            {/* Grid de 3 benchmarks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Marge Nette */}
                <div className="surface rounded-xl p-6 border border-border-subtle">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-primary">Marge Nette</h3>
                            <p className="text-xs text-tertiary">Rentabilité finale</p>
                        </div>
                    </div>
                    
                    <BenchmarkBar
                        kpiName="MARGE_NETTE"
                        currentValue={margeNette}
                        sector={sector}
                        unit="%"
                        inverse={false}
                    />
                </div>

                {/* 2. DSO */}
                <div className="surface rounded-xl p-6 border border-border-subtle">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-primary">DSO</h3>
                            <p className="text-xs text-tertiary">Délai de paiement</p>
                        </div>
                    </div>
                    
                    <BenchmarkBar
                        kpiName="DSO"
                        currentValue={dso}
                        sector={sector}
                        unit=" jours"
                        inverse={true}
                    />
                </div>

                {/* 3. BFR */}
                <div className="surface rounded-xl p-6 border border-border-subtle">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-primary">BFR</h3>
                            <p className="text-xs text-tertiary">Besoin en fonds</p>
                        </div>
                    </div>
                    
                    <BenchmarkBar
                        kpiName="BFR"
                        currentValue={bfr}
                        sector={sector}
                        unit="% CA"
                        inverse={true}
                    />
                </div>

            </div>

            {/* Info note */}
            <div className="mt-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">💡 Benchmarks basés sur</span> : Données sectorielles moyennes (Xerfi, Banque de France). 
                    Comparaison indicative pour situer votre performance vs concurrents.
                </p>
            </div>
        </div>
    );
}

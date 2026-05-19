'use client'

import type { BdfQuartiles } from '@/lib/benchmarks/bdf-sectoriels'
import { MARGE_BDF_LABEL } from '@/lib/ebitdaFormula'

interface EbitdaQuartileBarProps {
    currentValue: number
    quartiles: BdfQuartiles
    secteurLabel: string
    sourceCitation: string
}

export default function EbitdaQuartileBar({
    currentValue,
    quartiles,
    secteurLabel,
    sourceCitation,
}: EbitdaQuartileBarProps) {
    const { Q1, Q2, Q3 } = quartiles
    const range = Q3 - Q1 || 1
    const clamp = (pct: number) => Math.min(100, Math.max(0, pct))
    const valuePos = clamp(((currentValue - Q1) / range) * 100)
    const medianPos = clamp(((Q2 - Q1) / range) * 100)

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">
                    {MARGE_BDF_LABEL} vs {secteurLabel}
                </p>
            </div>

            <div className="relative h-5">
                <div className="absolute inset-y-1 left-0 right-0 rounded-full bg-gradient-to-r from-red-100 via-amber-100 to-emerald-100 border border-slate-200" />
                <div
                    className="absolute inset-y-1 w-0.5 bg-slate-500 z-[1]"
                    style={{ left: `${medianPos}%` }}
                    aria-hidden
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow-md z-[2]"
                    style={{ left: `calc(${valuePos}% - 8px)` }}
                    title={`Votre marge : ${currentValue.toFixed(1)}%`}
                />
            </div>

            <div className="flex justify-between text-[11px] text-slate-600">
                <span>Q1 {Q1.toFixed(1)}%</span>
                <span className="font-semibold text-slate-800">Médiane {Q2.toFixed(1)}%</span>
                <span>Q3 {Q3.toFixed(1)}%</span>
            </div>

            <p className="text-center text-sm font-bold text-slate-900">
                Votre entreprise : {currentValue.toFixed(1)}%
            </p>

            <p className="text-[11px] text-slate-500 text-center border-t border-slate-200 pt-2">
                Source : {sourceCitation}
            </p>
        </div>
    )
}

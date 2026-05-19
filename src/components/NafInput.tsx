'use client'

import { useCallback, useId, useState } from 'react'
import { Info } from 'lucide-react'
import {
    formatNafCode,
    resolveNafToBenchmark,
    type NafConfidence,
    type NafResolutionResult,
} from '@/lib/benchmarks/nafResolver'

interface NafInputProps {
    onResolved: (result: NafResolutionResult | null) => void
    className?: string
}

function getConfidenceLabel(confidence: NafConfidence): string {
    switch (confidence) {
        case 'exact':
            return 'Référence fine (code NAF reconnu)'
        case 'section':
            return 'Correspondance approchée (section NAF)'
        case 'none':
            return 'Non couvert'
    }
}

export default function NafInput({ onResolved, className = '' }: NafInputProps) {
    const inputId = useId()
    const [rawValue, setRawValue] = useState('')
    const [displayValue, setDisplayValue] = useState('')
    const [resolution, setResolution] = useState<NafResolutionResult | null>(null)

    const runResolution = useCallback(
        (value: string) => {
            const trimmed = value.trim()
            if (!trimmed) {
                setResolution(null)
                onResolved(null)
                return
            }

            const formatted = formatNafCode(trimmed)
            if (!formatted || formatted.length < 6) {
                setResolution(null)
                onResolved(null)
                return
            }

            const result = resolveNafToBenchmark(trimmed)
            setResolution(result)
            onResolved(result)
        },
        [onResolved],
    )

    const handleChange = (value: string) => {
        setRawValue(value)
        const formatted = formatNafCode(value)
        setDisplayValue(formatted ?? value.toUpperCase())
        runResolution(formatted ?? value)
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <label htmlFor={inputId} className="block text-sm font-semibold text-slate-800">
                Code NAF (rév. 2)
            </label>
            <input
                id={inputId}
                type="text"
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="Ex. 56.10A ou 5610A"
                value={displayValue}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl font-mono text-sm uppercase tracking-wide"
            />

            {resolution?.nafLabel && (
                <p className="text-sm text-slate-700">
                    <span className="font-medium text-slate-500">Activité INSEE :</span>{' '}
                    {resolution.nafLabel}
                </p>
            )}

            {resolution && resolution.confidence !== 'none' && resolution.secteurLabel && (
                <p className="text-sm text-slate-800">
                    <span className="font-medium text-slate-500">Secteur BDF :</span>{' '}
                    {resolution.secteurLabel}
                    <span className="ml-2 text-xs text-slate-500">
                        ({getConfidenceLabel(resolution.confidence)})
                    </span>
                </p>
            )}

            {resolution?.confidence === 'section' && resolution.approximationNote && (
                <div
                    role="note"
                    className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900"
                >
                    <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                    <p>{resolution.approximationNote}</p>
                </div>
            )}

            {resolution?.confidence === 'none' && (
                <p className="text-sm text-red-600">
                    Secteur non disponible dans notre base de benchmarks
                </p>
            )}

            {rawValue.trim() && !resolution?.nafLabel && displayValue.length >= 6 && (
                <p className="text-xs text-amber-600">
                    Code NAF non reconnu dans le référentiel INSEE — vérifiez le format (ex. 62.01Z).
                </p>
            )}
        </div>
    )
}
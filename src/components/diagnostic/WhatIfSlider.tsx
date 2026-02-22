'use client'

/**
 * WhatIfSlider — Interactive What-If simulation panel
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 3 levers (charges, paiements, prix) that project their impact
 * on KPIs and Score FinSight™ in real-time.
 *
 * Shows:
 *   - Slider for each lever with current value label
 *   - Projected deltas on impacted KPIs
 *   - Score change indicator (+X pts → new level)
 *   - Natural language summary
 *
 * Used in:
 *   - Wizard synthesis phase
 *   - mon-diagnostic (future)
 */

import { useState, useCallback, useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus, Zap, Clock, DollarSign } from 'lucide-react'
import type { SimulationLever, SimulationVector, WizardResults, SectorKey } from '@/lib/scoris/types'
import { DEFAULT_SIMULATION_LEVERS } from '@/lib/scoris/types'
import { SECTOR_BENCHMARKS } from '@/lib/scoring/diagnosticScore'
import { computeSimulationVector } from '@/lib/scoris/orchestrator'
import type { DiagnosticScore } from '@/lib/scoring/diagnosticScore'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEVER ICONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const LEVER_ICONS: Record<string, typeof Zap> = {
  'charges-reduction': DollarSign,
  'paiements-acceleration': Clock,
  'prix-augmentation': TrendingUp,
}

const LEVER_COLORS: Record<string, string> = {
  'charges-reduction': 'text-blue-400',
  'paiements-acceleration': 'text-emerald-400',
  'prix-augmentation': 'text-purple-400',
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SINGLE LEVER SLIDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface LeverSliderProps {
  lever: SimulationLever
  value: number
  onChange: (leverId: string, value: number) => void
  vector: SimulationVector | null
}

function LeverSlider({ lever, value, onChange, vector }: LeverSliderProps) {
  const Icon = LEVER_ICONS[lever.id] || Zap
  const color = LEVER_COLORS[lever.id] || 'text-gray-400'

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(lever.id, parseFloat(e.target.value))
    },
    [lever.id, onChange],
  )

  return (
    <div className="space-y-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-xs font-medium text-gray-300">{lever.label}</span>
        </div>
        <span className={`text-sm font-semibold tabular-nums ${value > 0 ? color : 'text-gray-500'}`}>
          {value > 0 ? `${lever.id === 'paiements-acceleration' ? '−' : '+'}${value}` : '0'}
          {lever.unit === '%' ? '%' : ` ${lever.unit}`}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={lever.min}
        max={lever.max}
        step={lever.step}
        value={value}
        onChange={handleChange}
        className="w-full h-1.5 appearance-none rounded-full cursor-pointer
          bg-slate-700
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-400
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-400"
      />

      {/* Impact summary */}
      {vector && value > 0 && (
        <div className="flex items-center gap-2 mt-1">
          {vector.scoreImpact.delta > 0 ? (
            <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />
          ) : vector.scoreImpact.delta < 0 ? (
            <TrendingDown className="w-3 h-3 text-red-400 flex-shrink-0" />
          ) : (
            <Minus className="w-3 h-3 text-gray-500 flex-shrink-0" />
          )}
          <p className="text-[11px] text-gray-400 leading-relaxed">{vector.summary}</p>
        </div>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WHAT-IF PANEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface WhatIfSliderProps {
  /** Current wizard results */
  results: WizardResults
  /** Selected sector */
  sector: SectorKey
  /** Current diagnostic score */
  currentScore: DiagnosticScore
  /** CSS class */
  className?: string
}

export function WhatIfSlider({
  results,
  sector,
  currentScore,
  className = '',
}: WhatIfSliderProps) {
  const bench = SECTOR_BENCHMARKS[sector]

  // Lever values state
  const [leverValues, setLeverValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    for (const l of DEFAULT_SIMULATION_LEVERS) {
      init[l.id] = l.defaultValue
    }
    return init
  })

  const handleChange = useCallback((leverId: string, value: number) => {
    setLeverValues((prev) => ({ ...prev, [leverId]: value }))
  }, [])

  // Compute vectors for all levers
  const vectors = useMemo(() => {
    const vecs: Record<string, SimulationVector | null> = {}
    for (const lever of DEFAULT_SIMULATION_LEVERS) {
      const val = leverValues[lever.id] ?? 0
      if (val > 0) {
        vecs[lever.id] = computeSimulationVector(
          lever as SimulationLever,
          val,
          results,
          bench,
          currentScore,
        )
      } else {
        vecs[lever.id] = null
      }
    }
    return vecs
  }, [leverValues, results, bench, currentScore])

  // Total projected score delta
  const totalDelta = useMemo(() => {
    let maxDelta = 0
    for (const vec of Object.values(vectors)) {
      if (vec && vec.scoreImpact.delta > maxDelta) {
        maxDelta = vec.scoreImpact.delta
      }
    }
    return maxDelta
  }, [vectors])

  const hasActivity = Object.values(leverValues).some((v) => v > 0)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Simulation What-If
          </h4>
        </div>
        {hasActivity && totalDelta > 0 && (
          <span className="text-xs font-semibold text-emerald-400">
            Score potentiel : +{totalDelta} pts
          </span>
        )}
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed">
        Ajustez les leviers pour projeter l&apos;impact sur votre Score FinSight™
      </p>

      {/* Lever sliders */}
      <div className="space-y-3">
        {(DEFAULT_SIMULATION_LEVERS as readonly SimulationLever[]).map((lever) => (
          <LeverSlider
            key={lever.id}
            lever={lever}
            value={leverValues[lever.id] ?? 0}
            onChange={handleChange}
            vector={vectors[lever.id] ?? null}
          />
        ))}
      </div>

      {/* Combined impact card */}
      {hasActivity && (
        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
          <p className="text-xs font-medium text-gray-300">Impact combiné estimé</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(vectors)
              .filter((v): v is SimulationVector => v !== null)
              .flatMap((v) =>
                Object.entries(v.projections)
                  .filter(([, proj]) => proj && proj.delta !== 0)
                  .map(([key, proj]) => (
                    <span
                      key={`${v.leverId}-${key}`}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                        proj!.delta > 0
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      {key.toUpperCase()} {proj!.delta > 0 ? '+' : ''}
                      {Math.abs(proj!.delta) >= 1000
                        ? `${(proj!.delta / 1000).toFixed(0)}k`
                        : proj!.delta}
                    </span>
                  )),
              )}
          </div>
        </div>
      )}
    </div>
  )
}

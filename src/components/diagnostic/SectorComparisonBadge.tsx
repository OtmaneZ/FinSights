'use client'

/**
 * SectorComparisonBadge — Visual benchmark positioning indicator
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Shows a horizontal bar with color zones (critique → excellent) and
 * a pin/marker at the user's position. Includes a textual badge
 * ("Top 20%", "Médiane", "Derniers 10%").
 *
 * Used in:
 *   - Wizard synthesis phase (per-indicator breakdown)
 *   - mon-diagnostic dashboard (next to each KPI)
 */

import { useMemo } from 'react'
import type { SectorComparison, BenchmarkPosition } from '@/lib/scoris/types'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POSITION THEME
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const POSITION_THEME: Record<BenchmarkPosition, {
  bg: string
  text: string
  badge: string
  border: string
  dot: string
  label: string
}> = {
  excellent: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    label: 'Excellent',
  },
  bon: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
    label: 'Bon',
  },
  median: {
    bg: 'bg-slate-500/20',
    text: 'text-slate-400',
    badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    border: 'border-slate-500/30',
    dot: 'bg-slate-400',
    label: 'Médiane',
  },
  faible: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    label: 'Sous médiane',
  },
  critique: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    badge: 'bg-red-500/15 text-red-400 border-red-500/30',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    label: 'Critique',
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SectorComparisonBadgeProps {
  comparison: SectorComparison
  /** Compact mode: just badge + bar, no labels */
  compact?: boolean
  /** CSS class for the root container */
  className?: string
}

export function SectorComparisonBadge({
  comparison,
  compact = false,
  className = '',
}: SectorComparisonBadgeProps) {
  const theme = POSITION_THEME[comparison.position]

  // Compute pin position on the 0–100% bar
  const pinPosition = useMemo(() => {
    // Map percentile to 5-95% range to avoid edge clipping
    return Math.max(5, Math.min(95, comparison.percentile))
  }, [comparison.percentile])

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${theme.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
          {comparison.positionLabel}
        </span>
        <span className="text-[10px] text-gray-500">
          vs {comparison.sectorMedian}{comparison.unit === '%' ? '%' : ` ${comparison.unit}`} médiane
        </span>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header: value + badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className={`text-sm font-semibold ${theme.text}`}>
            {comparison.value}
            {comparison.unit === '%' ? '%' : comparison.unit === 'x' ? 'x' : ` ${comparison.unit}`}
          </span>
          <span className="text-xs text-gray-500">{comparison.label}</span>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${theme.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
          {comparison.positionLabel}
        </span>
      </div>

      {/* Gradient bar + pin */}
      <div className="relative">
        {/* Background gradient bar */}
        <div className="h-2 rounded-full overflow-hidden flex">
          <div className="w-[10%] bg-red-500/40" />
          <div className="w-[20%] bg-amber-500/40" />
          <div className="w-[20%] bg-slate-500/40" />
          <div className="w-[30%] bg-blue-500/40" />
          <div className="w-[20%] bg-emerald-500/40" />
        </div>

        {/* Pin marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{ left: `${pinPosition}%` }}
        >
          <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg -ml-1.5 ${theme.dot}`} />
        </div>

        {/* Sector median marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 opacity-50"
          style={{ left: '50%' }}
        >
          <div className="w-0.5 h-4 bg-gray-400 -ml-px" />
        </div>
      </div>

      {/* Labels under bar */}
      <div className="flex justify-between text-[9px] text-gray-500">
        <span>Critique</span>
        <span>Médiane ({comparison.sectorMedian}{comparison.unit === '%' ? '%' : ` ${comparison.unit}`})</span>
        <span>Excellent</span>
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MULTIPLE COMPARISONS — render a grid
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SectorComparisonGridProps {
  comparisons: SectorComparison[]
  className?: string
}

export function SectorComparisonGrid({ comparisons, className = '' }: SectorComparisonGridProps) {
  if (comparisons.length === 0) return null

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Positionnement sectoriel
      </h4>
      <div className="space-y-5">
        {comparisons.map((c) => (
          <SectorComparisonBadge key={c.indicator} comparison={c} />
        ))}
      </div>
    </div>
  )
}

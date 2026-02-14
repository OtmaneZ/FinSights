'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, DollarSign, Target, PieChart, BarChart3, ArrowRight, Clock, ArrowUpRight } from 'lucide-react'
import { useCalculatorHistory, type CalculatorType } from '@/hooks/useCalculatorHistory'

// ---------------------------------------------------------------------------
// Configuration par type de calculateur
// ---------------------------------------------------------------------------

const CALCULATOR_META: Record<
  CalculatorType,
  { label: string; icon: typeof TrendingUp; unit: string; href: string }
> = {
  dso: { label: 'DSO', icon: TrendingUp, unit: 'jours', href: '/calculateurs/dso' },
  bfr: { label: 'BFR', icon: DollarSign, unit: '€', href: '/calculateurs/bfr' },
  roi: { label: 'ROI', icon: Target, unit: '%', href: '/calculateurs/roi' },
  marge: { label: 'Marge', icon: PieChart, unit: '%', href: '/calculateurs/marge' },
  'seuil-rentabilite': { label: 'Seuil de rentabilité', icon: BarChart3, unit: '€', href: '/calculateurs/seuil-rentabilite' },
  ebitda: { label: 'EBITDA', icon: BarChart3, unit: '€', href: '/calculateurs' },
  'cac-ltv': { label: 'CAC / LTV', icon: Target, unit: '€', href: '/calculateurs' },
  'burn-rate': { label: 'Burn Rate', icon: TrendingUp, unit: '€/mois', href: '/calculateurs' },
  valorisation: { label: 'Valorisation', icon: DollarSign, unit: '€', href: '/calculateurs' },
}

const TOTAL_CALCULATORS = 9

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60_000)
  const diffH = Math.floor(diffMs / 3_600_000)
  const diffD = Math.floor(diffMs / 86_400_000)

  if (diffMin < 1) return "A l'instant"
  if (diffMin < 60) return `${diffMin} min`
  if (diffH < 24) return `${diffH}h`
  if (diffD === 1) return 'Hier'
  if (diffD < 30) return `${diffD}j`
  return `${Math.floor(diffD / 30)} mois`
}

function formatValue(value: number, unit: string): string {
  if (unit === '€') return `${value.toLocaleString('fr-FR')} €`
  if (unit === '€/mois') return `${value.toLocaleString('fr-FR')} €/mois`
  if (unit === '%') return `${value.toLocaleString('fr-FR')}%`
  if (unit === 'jours') return `${value} jours`
  return `${value}`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CalculatorHistory() {
  const { history, completedTypes } = useCalculatorHistory()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || history.length === 0) return null

  const completed = completedTypes()
  const completionPct = Math.round((completed.length / TOTAL_CALCULATORS) * 100)
  const remaining = TOTAL_CALCULATORS - completed.length

  return (
    <section className="mb-14">
      {/* En-tête */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">
            Analyse en cours
          </p>
          <h2 className="text-xl font-bold text-primary tracking-tight">
            Indicateurs calculés
          </h2>
        </div>
        {history.length >= 2 && (
          <Link
            href="/mon-diagnostic"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
          >
            Diagnostic complet
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Grille des derniers calculs */}
      <div className="grid md:grid-cols-3 gap-4">
        {history.slice(0, 3).map((calc, idx) => {
          const meta = CALCULATOR_META[calc.type]
          if (!meta) return null
          const Icon = meta.icon

          return (
            <Link
              key={`${calc.type}-${idx}`}
              href={meta.href}
              className="group surface rounded-xl p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary-subtle)] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
                </div>
                <span className="text-xs text-tertiary flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo(calc.date)}
                </span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
                {meta.label}
              </p>
              <p className="text-2xl font-bold text-primary font-tabular leading-tight">
                {formatValue(calc.value, calc.unit || meta.unit)}
              </p>

              {calc.secteur && (
                <p className="text-xs text-tertiary mt-2">
                  Secteur : {calc.secteur}
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center text-xs font-semibold text-secondary group-hover:text-[var(--accent-primary)] transition-colors">
                Mettre a jour
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Barre de progression + CTA */}
      <div className="mt-5 surface rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-primary">
            Couverture diagnostique
          </p>
          <span className="text-sm font-bold text-primary font-tabular">
            {completed.length}/{TOTAL_CALCULATORS}
          </span>
        </div>

        {/* Barre segmentée */}
        <div className="flex gap-1 mb-1">
          {Array.from({ length: TOTAL_CALCULATORS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i < completed.length
                  ? 'bg-[var(--accent-primary)]'
                  : 'bg-[var(--border-default)]'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-tertiary mb-0">
          {completionPct}% de couverture
        </p>

        {completed.length >= 2 && remaining > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <p className="text-sm text-secondary">
              {remaining} indicateur{remaining > 1 ? 's' : ''} restant{remaining > 1 ? 's' : ''} pour un diagnostic exhaustif.
            </p>
            <Link
              href="/mon-diagnostic"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent-primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors flex-shrink-0 ml-4"
            >
              Voir le diagnostic
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {remaining === 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <p className="text-sm text-[var(--accent-success)] font-semibold">
              Diagnostic complet. Tous les indicateurs sont couverts.
            </p>
            <Link
              href="/mon-diagnostic"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent-primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors flex-shrink-0 ml-4"
            >
              Consulter le rapport
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

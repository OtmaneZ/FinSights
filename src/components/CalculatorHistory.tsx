'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, DollarSign, Target, PieChart, BarChart3, ArrowRight, Clock } from 'lucide-react'
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

  if (diffMin < 1) return "À l'instant"
  if (diffMin < 60) return `Il y a ${diffMin} min`
  if (diffH < 24) return `Il y a ${diffH}h`
  if (diffD === 1) return 'Hier'
  if (diffD < 30) return `Il y a ${diffD} jours`
  return `Il y a ${Math.floor(diffD / 30)} mois`
}

function formatValue(value: number, unit: string): string {
  if (unit === '€') return `${value.toLocaleString('fr-FR')} €`
  if (unit === '€/mois') return `${value.toLocaleString('fr-FR')} €/mois`
  if (unit === '%') return `${value.toLocaleString('fr-FR')} %`
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

  // Ne rien afficher côté serveur ou si aucun historique
  if (!mounted || history.length === 0) return null

  const completed = completedTypes()
  const remaining = TOTAL_CALCULATORS - completed.length

  return (
    <section className="mb-12">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Vos diagnostics récents
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {completed.length} indicateur{completed.length > 1 ? 's' : ''} calculé{completed.length > 1 ? 's' : ''} sur {TOTAL_CALCULATORS}
          </p>
        </div>
        {history.length >= 2 && (
          <Link
            href="/mon-diagnostic"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
          >
            Voir le diagnostic complet
            <ArrowRight className="w-4 h-4" />
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
              className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-700" />
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo(calc.date)}
                </span>
              </div>

              <p className="text-sm font-medium text-gray-500 mb-0.5">
                {meta.label}
              </p>
              <p className="text-xl font-bold text-gray-900 font-tabular">
                {formatValue(calc.value, calc.unit || meta.unit)}
              </p>

              {calc.secteur && (
                <p className="text-xs text-gray-500 mt-1">
                  Secteur : {calc.secteur}
                </p>
              )}

              <div className="mt-3 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                Recalculer
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Barre de progression */}
      {remaining > 0 && (
        <div className="mt-6 bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Complétude du diagnostic :</span>{' '}
              {completed.length} / {TOTAL_CALCULATORS} indicateurs
            </p>
            <span className="text-sm font-semibold text-gray-900 font-tabular">
              {Math.round((completed.length / TOTAL_CALCULATORS) * 100)} %
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-700 rounded-full transition-all duration-500"
              style={{ width: `${(completed.length / TOTAL_CALCULATORS) * 100}%` }}
            />
          </div>
          {completed.length >= 3 && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Calculez les {remaining} indicateurs restants pour un diagnostic complet.
              </p>
              <Link
                href="/mon-diagnostic"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-700 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Voir mon diagnostic
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

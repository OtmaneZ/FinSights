'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  useCalculatorHistory,
  type Calculation,
  type CalculatorType,
} from '@/hooks/useCalculatorHistory'
import {
  TrendingUp,
  DollarSign,
  Target,
  PieChart,
  BarChart3,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowUpRight,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOTAL_CALCULATORS = 9

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

// ---------------------------------------------------------------------------
// Score FinSight simplifié (0-100)
// ---------------------------------------------------------------------------

interface ScoreResult {
  total: number
  completionScore: number
  cashScore: number
  marginScore: number
  recencyScore: number
  level: 'excellent' | 'bon' | 'vigilance' | 'action'
}

function computeScore(history: Calculation[]): ScoreResult {
  if (history.length === 0) {
    return { total: 0, completionScore: 0, cashScore: 0, marginScore: 0, recencyScore: 0, level: 'action' }
  }

  const types = new Set(history.map((c) => c.type))

  // 1. Complétude (40 pts) – nombre d'indicateurs distincts
  const completionScore = Math.min(Math.round((types.size / TOTAL_CALCULATORS) * 40), 40)

  // 2. Cash (20 pts) – DSO et BFR
  let cashScore = 0
  const dso = history.find((c) => c.type === 'dso')
  const bfr = history.find((c) => c.type === 'bfr')

  if (dso) {
    if (dso.value < 30) cashScore += 10
    else if (dso.value < 45) cashScore += 7
    else if (dso.value < 60) cashScore += 4
    else cashScore += 1
  }
  if (bfr) {
    if (bfr.value < 0) cashScore += 10 // BFR négatif
    else if (bfr.inputs?.ca && bfr.inputs.ca > 0) {
      const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
      if (joursCA < 15) cashScore += 10
      else if (joursCA < 30) cashScore += 7
      else if (joursCA < 45) cashScore += 4
      else cashScore += 1
    }
  }

  // 3. Marge (20 pts) – Marge et Seuil
  let marginScore = 0
  const marge = history.find((c) => c.type === 'marge')
  const seuil = history.find((c) => c.type === 'seuil-rentabilite')

  if (marge) {
    if (marge.value >= 100) marginScore += 10
    else if (marge.value >= 50) marginScore += 8
    else if (marge.value >= 25) marginScore += 5
    else marginScore += 2
  }
  if (seuil) {
    // Si le seuil est calculé, c'est déjà un bon signal
    const tauxMarge = seuil.inputs?.tauxMarge
    if (tauxMarge && tauxMarge >= 60) marginScore += 10
    else if (tauxMarge && tauxMarge >= 40) marginScore += 7
    else if (tauxMarge && tauxMarge >= 25) marginScore += 4
    else marginScore += 2
  }

  // 4. Récence (20 pts) – fraîcheur des données
  const latestDate = new Date(history[0].date)
  const daysSince = Math.floor((Date.now() - latestDate.getTime()) / 86_400_000)

  let recencyScore = 0
  if (daysSince < 7) recencyScore = 20
  else if (daysSince < 30) recencyScore = 15
  else if (daysSince < 90) recencyScore = 10
  else recencyScore = 5

  const total = Math.min(completionScore + cashScore + marginScore + recencyScore, 100)

  let level: ScoreResult['level'] = 'action'
  if (total >= 75) level = 'excellent'
  else if (total >= 55) level = 'bon'
  else if (total >= 35) level = 'vigilance'

  return { total, completionScore, cashScore, marginScore, recencyScore, level }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatValue(value: number, unit: string): string {
  if (unit === '€' || unit === '€/mois') return `${value.toLocaleString('fr-FR')} ${unit}`
  if (unit === '%') return `${value.toLocaleString('fr-FR')} %`
  if (unit === 'jours') return `${value} jours`
  return `${value}`
}

function timeAgo(dateStr: string): string {
  const diffD = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (diffD === 0) return "Aujourd'hui"
  if (diffD === 1) return 'Hier'
  if (diffD < 30) return `Il y a ${diffD} jours`
  return `Il y a ${Math.floor(diffD / 30)} mois`
}

const LEVEL_CONFIG = {
  excellent: {
    label: 'Excellente santé financière',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    bar: 'bg-green-600',
  },
  bon: {
    label: 'Bonne dynamique',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    bar: 'bg-blue-600',
  },
  vigilance: {
    label: 'Zone de vigilance',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    bar: 'bg-amber-600',
  },
  action: {
    label: 'Action recommandée',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    bar: 'bg-red-600',
  },
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function MonDiagnosticPage() {
  const { history, completedTypes, clearHistory } = useCalculatorHistory()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-primary text-primary font-sans">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-20" />
        <Footer />
      </div>
    )
  }

  const completed = completedTypes()
  const score = computeScore(history)
  const remaining = TOTAL_CALCULATORS - completed.length
  const levelCfg = LEVEL_CONFIG[score.level]

  // -----------------------------------------------------------------------
  // Empty State
  // -----------------------------------------------------------------------
  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-primary text-primary font-sans">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              Votre diagnostic financier
            </h1>
            <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
              Commencez par calculer un premier indicateur. Vos résultats
              apparaîtront ici avec un score global et un suivi dans le temps.
            </p>
            <Link
              href="/calculateurs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Accéder aux calculateurs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // -----------------------------------------------------------------------
  // Main Page
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-primary text-primary font-sans">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* ---- En-tête ---- */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Votre diagnostic financier
          </h1>
          <p className="text-base text-gray-600 mt-1">
            {completed.length} indicateur{completed.length > 1 ? 's' : ''} calculé
            {completed.length > 1 ? 's' : ''} — Dernière mise à jour : {timeAgo(history[0].date)}
          </p>
        </div>

        {/* ---- Score FinSight ---- */}
        <div className={`rounded-xl border ${levelCfg.border} ${levelCfg.bg} p-6 mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Score principal */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Score FinSight
              </p>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-bold ${levelCfg.color} font-tabular`}>
                  {score.total}
                </span>
                <span className="text-lg text-gray-500 font-medium">/ 100</span>
              </div>
              <p className={`text-sm font-semibold mt-1 ${levelCfg.color}`}>
                {levelCfg.label}
              </p>
            </div>

            {/* Métriques détaillées */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Complétude" value={`${completed.length}/${TOTAL_CALCULATORS}`} sub="indicateurs" />
              <MetricCard label="Trésorerie" value={`${score.cashScore}`} sub="/ 20 pts" />
              <MetricCard label="Marges" value={`${score.marginScore}`} sub="/ 20 pts" />
              <MetricCard label="Récence" value={`${score.recencyScore}`} sub="/ 20 pts" />
            </div>
          </div>

          {/* Barre de score */}
          <div className="mt-6">
            <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
              <div
                className={`h-full ${levelCfg.bar} rounded-full transition-all duration-700`}
                style={{ width: `${score.total}%` }}
              />
            </div>
          </div>
        </div>

        {/* ---- Actions rapides ---- */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <a
            href="https://calendly.com/zineinsight"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-400 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-slate-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Diagnostic gratuit 30 min</p>
              <p className="text-xs text-gray-500">Avec un expert CFO — Visio — Aucun engagement</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors flex-shrink-0" />
          </a>

          <Link
            href="/consulting"
            className="group flex items-center gap-4 bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-400 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-slate-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Audit approfondi 72h</p>
              <p className="text-xs text-gray-500">Rapport complet + plan d'action priorisé</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors flex-shrink-0" />
          </Link>
        </div>

        {/* ---- Historique des diagnostics ---- */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-gray-900">Historique des diagnostics</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {history.map((calc, idx) => {
              const meta = CALCULATOR_META[calc.type]
              if (!meta) return null
              const Icon = meta.icon

              return (
                <div key={`${calc.type}-${idx}`} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold text-gray-900">{meta.label}</p>
                      <span className="text-sm font-bold text-gray-900 font-tabular">
                        {formatValue(calc.value, calc.unit || meta.unit)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(calc.date)}</p>
                  </div>
                  <Link
                    href={meta.href}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0"
                  >
                    Recalculer
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* ---- Indicateurs manquants ---- */}
        {remaining > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Complétez votre diagnostic
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              {remaining} indicateur{remaining > 1 ? 's' : ''} restant{remaining > 1 ? 's' : ''} pour
              un diagnostic complet de votre santé financière.
            </p>

            <div className="grid md:grid-cols-3 gap-3">
              {(Object.keys(CALCULATOR_META) as CalculatorType[])
                .filter((type) => !completed.includes(type))
                .slice(0, 6)
                .map((type) => {
                  const meta = CALCULATOR_META[type]
                  const Icon = meta.icon
                  return (
                    <Link
                      key={type}
                      href={meta.href}
                      className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                        {meta.label}
                      </span>
                    </Link>
                  )
                })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="bg-white/60 rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900 font-tabular">{value}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  )
}

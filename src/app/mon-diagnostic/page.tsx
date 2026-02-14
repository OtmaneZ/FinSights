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
  ArrowUpRight,
  Calendar,
  FileText,
  Activity,
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
  'seuil-rentabilite': { label: 'Seuil de rentabilite', icon: BarChart3, unit: '€', href: '/calculateurs/seuil-rentabilite' },
  ebitda: { label: 'EBITDA', icon: BarChart3, unit: '€', href: '/calculateurs' },
  'cac-ltv': { label: 'CAC / LTV', icon: Target, unit: '€', href: '/calculateurs' },
  'burn-rate': { label: 'Burn Rate', icon: TrendingUp, unit: '€/mois', href: '/calculateurs' },
  valorisation: { label: 'Valorisation', icon: DollarSign, unit: '€', href: '/calculateurs' },
}

// ---------------------------------------------------------------------------
// Score FinSight (0-100)
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

  // 1. Completude (40 pts)
  const completionScore = Math.min(Math.round((types.size / TOTAL_CALCULATORS) * 40), 40)

  // 2. Cash (20 pts) - DSO et BFR
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
    if (bfr.value < 0) cashScore += 10
    else if (bfr.inputs?.ca && bfr.inputs.ca > 0) {
      const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
      if (joursCA < 15) cashScore += 10
      else if (joursCA < 30) cashScore += 7
      else if (joursCA < 45) cashScore += 4
      else cashScore += 1
    }
  }

  // 3. Marge (20 pts)
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
    const tauxMarge = seuil.inputs?.tauxMarge
    if (tauxMarge && tauxMarge >= 60) marginScore += 10
    else if (tauxMarge && tauxMarge >= 40) marginScore += 7
    else if (tauxMarge && tauxMarge >= 25) marginScore += 4
    else marginScore += 2
  }

  // 4. Recence (20 pts)
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
  if (unit === '%') return `${value.toLocaleString('fr-FR')}%`
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
    label: 'Sante financiere solide',
    sublabel: 'Vos indicateurs cles sont dans les normes attendues.',
    color: 'text-[var(--accent-success)]',
    bg: 'bg-[var(--accent-success-subtle)]',
    border: 'border-[var(--accent-success-border)]',
    bar: 'bg-[var(--accent-success)]',
  },
  bon: {
    label: 'Dynamique favorable',
    sublabel: 'Plusieurs indicateurs positifs. Completez le diagnostic pour affiner l\'analyse.',
    color: 'text-[var(--accent-primary)]',
    bg: 'bg-[var(--accent-primary-subtle)]',
    border: 'border-[var(--accent-primary-border)]',
    bar: 'bg-[var(--accent-primary)]',
  },
  vigilance: {
    label: 'Points de vigilance identifies',
    sublabel: 'Certains indicateurs meritent une attention particuliere.',
    color: 'text-[var(--accent-warning)]',
    bg: 'bg-[var(--accent-warning-subtle)]',
    border: 'border-[var(--accent-warning-border)]',
    bar: 'bg-[var(--accent-warning)]',
  },
  action: {
    label: 'Diagnostic incomplet',
    sublabel: 'Completez vos indicateurs pour obtenir une evaluation fiable.',
    color: 'text-[var(--accent-danger)]',
    bg: 'bg-[var(--accent-danger-subtle)]',
    border: 'border-[var(--accent-danger-border)]',
    bar: 'bg-[var(--accent-danger)]',
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
        <div className="max-w-3xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-[var(--accent-primary-subtle)] flex items-center justify-center mx-auto mb-6">
              <Activity className="w-7 h-7 text-[var(--accent-primary)]" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
              Diagnostic financier
            </p>
            <h1 className="text-3xl font-bold text-primary mb-4 tracking-tight">
              Evaluez la sante financiere de votre entreprise
            </h1>
            <p className="text-base text-secondary mb-10 max-w-lg mx-auto leading-relaxed">
              Calculez vos indicateurs cles (DSO, BFR, marge, ROI) pour obtenir
              un Score FinSight et identifier les axes d'amelioration prioritaires.
            </p>
            <Link
              href="/calculateurs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors shadow-md"
            >
              Commencer le diagnostic
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
        {/* ---- En-tete ---- */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
            Diagnostic financier
          </p>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-sm text-secondary mt-1">
            {completed.length} indicateur{completed.length > 1 ? 's' : ''} analyse
            {completed.length > 1 ? 's' : ''} — Derniere mise a jour : {timeAgo(history[0].date)}
          </p>
        </div>

        {/* ---- Score FinSight ---- */}
        <div className={`rounded-xl border ${levelCfg.border} ${levelCfg.bg} p-6 mb-8`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Score principal */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
                Score FinSight
              </p>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-bold ${levelCfg.color} font-tabular`}>
                  {score.total}
                </span>
                <span className="text-lg text-secondary font-medium">/ 100</span>
              </div>
              <p className={`text-sm font-semibold mt-2 ${levelCfg.color}`}>
                {levelCfg.label}
              </p>
              <p className="text-xs text-secondary mt-1 max-w-xs">
                {levelCfg.sublabel}
              </p>
            </div>

            {/* Metriques detaillees */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ScoreCard label="Completude" value={`${completed.length}/${TOTAL_CALCULATORS}`} sub="indicateurs" max={40} points={score.completionScore} />
              <ScoreCard label="Tresorerie" value={`${score.cashScore}`} sub="/ 20 pts" max={20} points={score.cashScore} />
              <ScoreCard label="Marges" value={`${score.marginScore}`} sub="/ 20 pts" max={20} points={score.marginScore} />
              <ScoreCard label="Recence" value={`${score.recencyScore}`} sub="/ 20 pts" max={20} points={score.recencyScore} />
            </div>
          </div>

          {/* Barre de score segmentee */}
          <div className="mt-6">
            <div className="flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    i < Math.ceil(score.total / 10)
                      ? levelCfg.bar
                      : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---- CTA Section ---- */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <a
            href="https://calendly.com/zineinsight"
            target="_blank"
            rel="noopener noreferrer"
            className="group surface rounded-xl p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary-subtle)] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary">Diagnostic approfondi gratuit</p>
                <p className="text-xs text-tertiary mt-0.5">
                  30 min avec un expert CFO — Visio — Aucun engagement
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-tertiary group-hover:text-[var(--accent-primary)] transition-colors flex-shrink-0" />
            </div>
          </a>

          <Link
            href="/consulting"
            className="group surface rounded-xl p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary-subtle)] flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary">Audit complet sous 72h</p>
                <p className="text-xs text-tertiary mt-0.5">
                  Rapport detaille + plan d'action priorise + recommandations chiffrees
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-tertiary group-hover:text-[var(--accent-primary)] transition-colors flex-shrink-0" />
            </div>
          </Link>
        </div>

        {/* ---- Historique des calculs ---- */}
        <div className="surface rounded-xl overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[var(--accent-primary)]" />
              <h2 className="text-base font-bold text-primary">Historique des analyses</h2>
            </div>
            <span className="text-xs text-tertiary font-tabular">
              {history.length} calcul{history.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {history.map((calc, idx) => {
              const meta = CALCULATOR_META[calc.type]
              if (!meta) return null
              const Icon = meta.icon

              return (
                <div key={`${calc.type}-${idx}`} className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--surface-hover)] transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary-subtle)] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold text-primary">{meta.label}</p>
                      <span className="text-sm font-bold text-primary font-tabular">
                        {formatValue(calc.value, calc.unit || meta.unit)}
                      </span>
                    </div>
                    <p className="text-xs text-tertiary">{formatDate(calc.date)}</p>
                  </div>
                  <Link
                    href={meta.href}
                    className="text-xs font-semibold text-secondary hover:text-[var(--accent-primary)] transition-colors flex-shrink-0"
                  >
                    Mettre a jour
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* ---- Indicateurs manquants ---- */}
        {remaining > 0 && (
          <div className="surface rounded-xl p-6 mb-10">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-primary mb-1">
                  Indicateurs non couverts
                </h2>
                <p className="text-sm text-secondary">
                  {remaining} indicateur{remaining > 1 ? 's' : ''} restant{remaining > 1 ? 's' : ''} pour
                  une couverture analytique complete.
                </p>
              </div>
              <span className="text-xs font-semibold text-tertiary font-tabular px-2 py-1 bg-[var(--background-primary)] rounded">
                {Math.round((completed.length / TOTAL_CALCULATORS) * 100)}%
              </span>
            </div>

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
                      className="group flex items-center gap-3 p-3 rounded-lg border border-[var(--border-default)] hover:border-[var(--accent-primary-border)] hover:bg-[var(--accent-primary-subtle)] transition-all"
                    >
                      <div className="w-8 h-8 rounded-md bg-[var(--background-primary)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent-primary-subtle)]">
                        <Icon className="w-4 h-4 text-secondary group-hover:text-[var(--accent-primary)]" />
                      </div>
                      <span className="text-sm font-medium text-secondary group-hover:text-[var(--accent-primary)] transition-colors">
                        {meta.label}
                      </span>
                      <ArrowRight className="w-3 h-3 text-tertiary group-hover:text-[var(--accent-primary)] ml-auto opacity-0 group-hover:opacity-100 transition-all" />
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

function ScoreCard({
  label,
  value,
  sub,
  max,
  points,
}: {
  label: string
  value: string
  sub: string
  max: number
  points: number
}) {
  const pct = max > 0 ? Math.round((points / max) * 100) : 0

  return (
    <div className="bg-white/60 rounded-lg p-3">
      <p className="text-xs text-secondary mb-1 font-medium">{label}</p>
      <p className="text-xl font-bold text-primary font-tabular leading-tight">{value}</p>
      <p className="text-xs text-tertiary">{sub}</p>
      <div className="mt-2 w-full h-1 bg-white/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

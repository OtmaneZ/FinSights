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
  Shield,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  ChevronDown,
  BookOpen,
  Layers,
  Database,
  Lock,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Constants & Metadata
// ---------------------------------------------------------------------------

const TOTAL_CALCULATORS = 9

const CALCULATOR_META: Record<
  CalculatorType,
  {
    label: string
    fullLabel: string
    icon: typeof TrendingUp
    unit: string
    href: string
    pillar: PillarKey
    description: string
  }
> = {
  dso: {
    label: 'DSO',
    fullLabel: 'Days Sales Outstanding',
    icon: TrendingUp,
    unit: 'jours',
    href: '/calculateurs/dso',
    pillar: 'cash',
    description: 'Delai moyen de paiement clients',
  },
  bfr: {
    label: 'BFR',
    fullLabel: 'Besoin en Fonds de Roulement',
    icon: DollarSign,
    unit: '\u20ac',
    href: '/calculateurs/bfr',
    pillar: 'cash',
    description: 'Capital immobilise dans le cycle d\'exploitation',
  },
  roi: {
    label: 'ROI',
    fullLabel: 'Retour sur Investissement',
    icon: Target,
    unit: '%',
    href: '/calculateurs/roi',
    pillar: 'margin',
    description: 'Rentabilite de vos investissements',
  },
  marge: {
    label: 'Marge',
    fullLabel: 'Taux de Marge',
    icon: PieChart,
    unit: '%',
    href: '/calculateurs/marge',
    pillar: 'margin',
    description: 'Rentabilite de votre activite commerciale',
  },
  'seuil-rentabilite': {
    label: 'Seuil de rentabilite',
    fullLabel: 'Seuil de Rentabilite',
    icon: BarChart3,
    unit: '\u20ac',
    href: '/calculateurs/seuil-rentabilite',
    pillar: 'margin',
    description: 'Chiffre d\'affaires minimum pour couvrir vos charges',
  },
  ebitda: {
    label: 'EBITDA',
    fullLabel: 'EBITDA',
    icon: BarChart3,
    unit: '\u20ac',
    href: '/calculateurs',
    pillar: 'margin',
    description: 'Resultat operationnel avant amortissements',
  },
  'cac-ltv': {
    label: 'CAC / LTV',
    fullLabel: 'Cout d\'Acquisition / Lifetime Value',
    icon: Target,
    unit: '\u20ac',
    href: '/calculateurs',
    pillar: 'resilience',
    description: 'Rentabilite de votre acquisition clients',
  },
  'burn-rate': {
    label: 'Burn Rate',
    fullLabel: 'Burn Rate',
    icon: TrendingUp,
    unit: '\u20ac/mois',
    href: '/calculateurs',
    pillar: 'cash',
    description: 'Consommation mensuelle de tresorerie',
  },
  valorisation: {
    label: 'Valorisation',
    fullLabel: 'Valorisation d\'Entreprise',
    icon: DollarSign,
    unit: '\u20ac',
    href: '/calculateurs',
    pillar: 'resilience',
    description: 'Estimation de la valeur de votre entreprise',
  },
}

// ---------------------------------------------------------------------------
// 4 Piliers — Score FinSight(tm)
// ---------------------------------------------------------------------------

type PillarKey = 'cash' | 'margin' | 'resilience' | 'risk'

interface PillarResult {
  score: number | null // null = donnees insuffisantes
  max: 25
  calculators: { type: CalculatorType; done: boolean }[]
  label: string
  sublabel: string
  icon: typeof DollarSign
  color: string
  borderColor: string
  bgColor: string
}

interface DiagnosticScore {
  total: number | null
  pillars: Record<PillarKey, PillarResult>
  level: 'excellent' | 'bon' | 'vigilance' | 'action' | 'incomplet'
  confidence: 'haute' | 'moyenne' | 'faible'
  completedPillars: number
}

function computeDiagnosticScore(history: Calculation[]): DiagnosticScore {
  const get = (t: CalculatorType) => history.find((c) => c.type === t)

  // --- Pilier CASH (25 pts) : DSO + BFR + Burn Rate ---
  const dso = get('dso')
  const bfr = get('bfr')
  const burnRate = get('burn-rate')
  const cashCalcs: { type: CalculatorType; done: boolean }[] = [
    { type: 'dso', done: !!dso },
    { type: 'bfr', done: !!bfr },
    { type: 'burn-rate', done: !!burnRate },
  ]
  const cashHasData = dso || bfr || burnRate

  let cashScore: number | null = null
  if (cashHasData) {
    let pts = 0
    let maxPossible = 0

    if (dso) {
      maxPossible += 10
      if (dso.value <= 30) pts += 10
      else if (dso.value <= 45) pts += 7
      else if (dso.value <= 60) pts += 4
      else pts += 1
    }

    if (bfr) {
      maxPossible += 10
      if (bfr.value < 0) {
        pts += 10 // BFR negatif = excellent
      } else if (bfr.inputs?.ca && bfr.inputs.ca > 0) {
        const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
        if (joursCA < 15) pts += 10
        else if (joursCA < 30) pts += 7
        else if (joursCA < 45) pts += 4
        else pts += 1
      } else {
        pts += 3
      }
    }

    if (burnRate) {
      maxPossible += 5
      // Burn rate bas = positif (normalize: plus c'est bas, mieux c'est)
      if (burnRate.value < 5000) pts += 5
      else if (burnRate.value < 15000) pts += 3
      else if (burnRate.value < 50000) pts += 1
    }

    // Normaliser sur 25
    cashScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
  }

  // --- Pilier MARGIN (25 pts) : Marge + ROI + Seuil + EBITDA ---
  const marge = get('marge')
  const roi = get('roi')
  const seuil = get('seuil-rentabilite')
  const ebitda = get('ebitda')
  const marginCalcs: { type: CalculatorType; done: boolean }[] = [
    { type: 'marge', done: !!marge },
    { type: 'roi', done: !!roi },
    { type: 'seuil-rentabilite', done: !!seuil },
    { type: 'ebitda', done: !!ebitda },
  ]
  const marginHasData = marge || roi || seuil || ebitda

  let marginScore: number | null = null
  if (marginHasData) {
    let pts = 0
    let maxPossible = 0

    if (marge) {
      maxPossible += 8
      if (marge.value >= 60) pts += 8
      else if (marge.value >= 40) pts += 6
      else if (marge.value >= 25) pts += 4
      else if (marge.value >= 10) pts += 2
      else pts += 1
    }

    if (roi) {
      maxPossible += 7
      if (roi.value >= 100) pts += 7
      else if (roi.value >= 50) pts += 5
      else if (roi.value >= 20) pts += 3
      else if (roi.value >= 0) pts += 1
    }

    if (seuil) {
      maxPossible += 6
      const tauxMarge = seuil.inputs?.tauxMarge
      if (tauxMarge && tauxMarge >= 60) pts += 6
      else if (tauxMarge && tauxMarge >= 40) pts += 4
      else if (tauxMarge && tauxMarge >= 25) pts += 2
      else pts += 1
    }

    if (ebitda) {
      maxPossible += 4
      if (ebitda.value > 0) pts += 4
      else pts += 1
    }

    marginScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
  }

  // --- Pilier RESILIENCE (25 pts) : CAC/LTV + Valorisation ---
  const cacLtv = get('cac-ltv')
  const valorisation = get('valorisation')
  const resilienceCalcs: { type: CalculatorType; done: boolean }[] = [
    { type: 'cac-ltv', done: !!cacLtv },
    { type: 'valorisation', done: !!valorisation },
  ]
  const resilienceHasData = cacLtv || valorisation

  let resilienceScore: number | null = null
  if (resilienceHasData) {
    let pts = 0
    let maxPossible = 0

    if (cacLtv) {
      maxPossible += 15
      // LTV/CAC ratio : > 3 = excellent
      if (cacLtv.value >= 3) pts += 15
      else if (cacLtv.value >= 2) pts += 10
      else if (cacLtv.value >= 1) pts += 5
      else pts += 1
    }

    if (valorisation) {
      maxPossible += 10
      if (valorisation.value > 0) pts += 10 // Valorisation positive = signal de resilience
      else pts += 2
    }

    resilienceScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
  }

  // --- Pilier RISK (25 pts) : Derive des inputs existants ---
  // Analyse croisee : DSO eleve + BFR eleve = risque majeur
  // Marge faible + seuil de rentabilite eleve = risque
  const riskCalcs: { type: CalculatorType; done: boolean }[] = [
    { type: 'dso', done: !!dso },
    { type: 'marge', done: !!marge },
    { type: 'seuil-rentabilite', done: !!seuil },
  ]
  const riskHasData = (dso || bfr) && (marge || seuil)

  let riskScore: number | null = null
  if (riskHasData) {
    let pts = 25 // On part de 25 et on deduit les risques

    // Risque tresorerie : DSO > 60 jours
    if (dso && dso.value > 60) pts -= 5
    else if (dso && dso.value > 45) pts -= 2

    // Risque BFR : BFR en jours CA > 45
    if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
      const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
      if (joursCA > 60) pts -= 6
      else if (joursCA > 45) pts -= 3
    }

    // Risque marge : marge < 15%
    if (marge && marge.value < 15) pts -= 5
    else if (marge && marge.value < 25) pts -= 2

    // Risque seuil : taux de marge < 30%
    if (seuil) {
      const tm = seuil.inputs?.tauxMarge
      if (tm && tm < 20) pts -= 6
      else if (tm && tm < 30) pts -= 3
    }

    // Risque croise : DSO eleve ET marge faible
    if (dso && dso.value > 45 && marge && marge.value < 25) pts -= 3

    riskScore = Math.max(0, Math.min(25, pts))
  }

  // --- Assemblage ---
  const pillars: Record<PillarKey, PillarResult> = {
    cash: {
      score: cashScore,
      max: 25,
      calculators: cashCalcs,
      label: 'CASH',
      sublabel: 'Tresorerie et Liquidite',
      icon: DollarSign,
      color: 'text-[var(--accent-primary)]',
      borderColor: 'border-[var(--accent-primary-border)]',
      bgColor: 'bg-[var(--accent-primary-subtle)]',
    },
    margin: {
      score: marginScore,
      max: 25,
      calculators: marginCalcs,
      label: 'MARGIN',
      sublabel: 'Rentabilite et Croissance',
      icon: TrendingUp,
      color: 'text-[var(--accent-success)]',
      borderColor: 'border-[var(--accent-success-border)]',
      bgColor: 'bg-[var(--accent-success-subtle)]',
    },
    resilience: {
      score: resilienceScore,
      max: 25,
      calculators: resilienceCalcs,
      label: 'RESILIENCE',
      sublabel: 'Stabilite et Diversification',
      icon: Shield,
      color: 'text-purple-600',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
    },
    risk: {
      score: riskScore,
      max: 25,
      calculators: riskCalcs,
      label: 'RISK',
      sublabel: 'Anomalies et Volatilite',
      icon: AlertTriangle,
      color: 'text-[var(--accent-warning)]',
      borderColor: 'border-[var(--accent-warning-border)]',
      bgColor: 'bg-[var(--accent-warning-subtle)]',
    },
  }

  const scored = Object.values(pillars).filter((p) => p.score !== null)
  const completedPillars = scored.length

  let total: number | null = null
  if (completedPillars > 0) {
    const sum = scored.reduce((acc, p) => acc + (p.score ?? 0), 0)
    // Extrapoler sur 100 si incomplet
    total = completedPillars === 4 ? sum : Math.round((sum / completedPillars) * 4)
  }

  let level: DiagnosticScore['level'] = 'incomplet'
  if (total !== null) {
    if (total >= 75) level = 'excellent'
    else if (total >= 55) level = 'bon'
    else if (total >= 35) level = 'vigilance'
    else level = 'action'
  }

  const confidence: DiagnosticScore['confidence'] =
    completedPillars >= 4 ? 'haute' : completedPillars >= 2 ? 'moyenne' : 'faible'

  return { total, pillars, level, confidence, completedPillars }
}

// ---------------------------------------------------------------------------
// Parcours recommande
// ---------------------------------------------------------------------------

/** Ordre optimal pour un diagnostic progressif */
const RECOMMENDED_ORDER: CalculatorType[] = [
  'dso',
  'bfr',
  'marge',
  'roi',
  'seuil-rentabilite',
  'ebitda',
  'cac-ltv',
  'burn-rate',
  'valorisation',
]

function getNextRecommended(completed: CalculatorType[]): CalculatorType | null {
  return RECOMMENDED_ORDER.find((t) => !completed.includes(t)) ?? null
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
  if (unit === '\u20ac' || unit === '\u20ac/mois') return `${value.toLocaleString('fr-FR')} ${unit}`
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

const LEVEL_CONFIG: Record<
  DiagnosticScore['level'],
  { label: string; sublabel: string; color: string; bg: string; border: string; bar: string }
> = {
  excellent: {
    label: 'Sante financiere solide',
    sublabel: 'Vos indicateurs cles sont conformes aux standards du secteur.',
    color: 'text-[var(--accent-success)]',
    bg: 'bg-[var(--accent-success-subtle)]',
    border: 'border-[var(--accent-success-border)]',
    bar: 'bg-[var(--accent-success)]',
  },
  bon: {
    label: 'Dynamique favorable',
    sublabel: 'La majorite de vos indicateurs sont positifs.',
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
    label: 'Actions correctives recommandees',
    sublabel: 'Plusieurs indicateurs necessitent une intervention rapide.',
    color: 'text-[var(--accent-danger)]',
    bg: 'bg-[var(--accent-danger-subtle)]',
    border: 'border-[var(--accent-danger-border)]',
    bar: 'bg-[var(--accent-danger)]',
  },
  incomplet: {
    label: 'Diagnostic en cours',
    sublabel: 'Completez vos indicateurs pour obtenir votre Score FinSight.',
    color: 'text-secondary',
    bg: 'bg-[var(--surface-primary)]',
    border: 'border-[var(--border-default)]',
    bar: 'bg-[var(--border-default)]',
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
  const diagnostic = computeDiagnosticScore(history)
  const coveragePct = Math.round((completed.length / TOTAL_CALCULATORS) * 100)
  const levelCfg = LEVEL_CONFIG[diagnostic.level]
  const nextCalc = getNextRecommended(completed)

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
            <p className="text-base text-secondary mb-6 max-w-lg mx-auto leading-relaxed">
              Le Score FinSight mesure 4 piliers fondamentaux : tresorerie,
              rentabilite, resilience et risques. Chaque pilier est note sur
              25 points pour un score global de 0 a 100.
            </p>

            {/* 4 piliers preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10">
              {(['cash', 'margin', 'resilience', 'risk'] as PillarKey[]).map((key) => {
                const p = computeDiagnosticScore([]).pillars[key]
                const Icon = p.icon
                return (
                  <div key={key} className="surface rounded-xl p-4 text-center">
                    <div className={`w-9 h-9 rounded-lg ${p.bgColor} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={`w-4 h-4 ${p.color}`} />
                    </div>
                    <p className="text-xs font-bold text-primary">{p.label}</p>
                    <p className="text-[10px] text-tertiary mt-0.5">{p.sublabel}</p>
                    <p className="text-lg font-bold text-tertiary mt-1 font-tabular">--/25</p>
                  </div>
                )
              })}
            </div>

            <Link
              href="/calculateurs/dso"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors shadow-md"
            >
              Commencer par le DSO
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-tertiary mt-3">
              Premiere analyse en moins de 2 minutes
            </p>
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

        {/* ================================================================
            SECTION 1 : Couverture diagnostique (gamification)
            ================================================================ */}
        <div className="surface rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-[var(--accent-primary)]" />
                <h2 className="text-sm font-bold text-primary uppercase tracking-wide">
                  Couverture diagnostique
                </h2>
              </div>
              <p className="text-xs text-secondary">
                {completed.length}/{TOTAL_CALCULATORS} analyses realisees
              </p>
            </div>
            <span className="text-2xl font-bold text-primary font-tabular">
              {coveragePct}%
            </span>
          </div>

          {/* Barre de progression segmentee */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: TOTAL_CALCULATORS }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  i < completed.length
                    ? 'bg-[var(--accent-primary)]'
                    : 'bg-[var(--border-subtle)]'
                }`}
              />
            ))}
          </div>

          {/* Prochaine analyse recommandee */}
          {nextCalc && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--accent-primary-subtle)] border border-[var(--accent-primary-border)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Prochaine analyse recommandee
                  </p>
                  <p className="text-xs text-secondary">
                    {CALCULATOR_META[nextCalc].fullLabel} — {CALCULATOR_META[nextCalc].description}
                  </p>
                </div>
              </div>
              <Link
                href={CALCULATOR_META[nextCalc].href}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent-primary)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors flex-shrink-0"
              >
                Calculer
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {completed.length === TOTAL_CALCULATORS && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--accent-success-subtle)] border border-[var(--accent-success-border)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent-success)] flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary">Diagnostic complet</p>
                <p className="text-xs text-secondary">
                  Tous les indicateurs ont ete analyses. Votre Score FinSight est au maximum de precision.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================
            SECTION 2 : Score FinSight(tm) — 4 Piliers x 25 pts
            ================================================================ */}
        <div className={`rounded-xl border ${levelCfg.border} ${levelCfg.bg} p-6 mb-6`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Score principal */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                  Score FinSight
                </p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  diagnostic.confidence === 'haute'
                    ? 'bg-[var(--accent-success-subtle)] text-[var(--accent-success)]'
                    : diagnostic.confidence === 'moyenne'
                    ? 'bg-[var(--accent-warning-subtle)] text-[var(--accent-warning)]'
                    : 'bg-[var(--surface-primary)] text-tertiary'
                }`}>
                  Confiance {diagnostic.confidence}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-bold ${levelCfg.color} font-tabular`}>
                  {diagnostic.total !== null ? diagnostic.total : '--'}
                </span>
                <span className="text-lg text-secondary font-medium">/ 100</span>
              </div>
              <p className={`text-sm font-semibold mt-2 ${levelCfg.color}`}>
                {levelCfg.label}
              </p>
              <p className="text-xs text-secondary mt-1 max-w-sm">
                {levelCfg.sublabel}
              </p>
              {diagnostic.completedPillars < 4 && (
                <div className="flex items-start gap-1.5 mt-3">
                  <Info className="w-3 h-3 text-tertiary mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-tertiary leading-relaxed">
                    Score base sur {diagnostic.completedPillars}/4 pilier{diagnostic.completedPillars > 1 ? 's' : ''}.
                    {' '}Valeur extrapolee. Completez le diagnostic pour un score definitif.
                  </p>
                </div>
              )}
            </div>

            {/* Barre de score segmentee */}
            <div className="flex-shrink-0 md:w-48 md:pt-6">
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      diagnostic.total !== null && i < Math.ceil(diagnostic.total / 10)
                        ? levelCfg.bar
                        : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-tertiary">0</span>
                <span className="text-[10px] text-tertiary">100</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---- 4 Piliers detail ---- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {(['cash', 'margin', 'resilience', 'risk'] as PillarKey[]).map((key) => {
            const pillar = diagnostic.pillars[key]
            return <PillarCard key={key} pillar={pillar} />
          })}
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
                  30 min avec un expert — Analyse de votre score — Aucun engagement
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
              const pillar = diagnostic.pillars[meta.pillar]

              return (
                <div key={`${calc.type}-${idx}`} className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--surface-hover)] transition-colors">
                  <div className={`w-9 h-9 rounded-lg ${pillar.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${pillar.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-primary">{meta.label}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${pillar.bgColor} ${pillar.color}`}>
                        {pillar.label}
                      </span>
                      <span className="text-sm font-bold text-primary font-tabular ml-auto mr-4">
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

        {/* ---- Indicateurs manquants (par pilier) ---- */}
        {completed.length < TOTAL_CALCULATORS && (
          <div className="surface rounded-xl p-6 mb-10">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-primary mb-1">
                  Analyses manquantes
                </h2>
                <p className="text-sm text-secondary">
                  {TOTAL_CALCULATORS - completed.length} indicateur{TOTAL_CALCULATORS - completed.length > 1 ? 's' : ''} restant{TOTAL_CALCULATORS - completed.length > 1 ? 's' : ''} pour
                  une couverture analytique complete.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(['cash', 'margin', 'resilience', 'risk'] as PillarKey[]).map((key) => {
                const pillar = diagnostic.pillars[key]
                const missing = pillar.calculators.filter((c) => !c.done)
                if (missing.length === 0) return null

                return (
                  <div key={key}>
                    <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${pillar.color}`}>
                      {pillar.label}
                    </p>
                    <div className="grid md:grid-cols-3 gap-2">
                      {missing.map(({ type }) => {
                        const meta = CALCULATOR_META[type]
                        const Icon = meta.icon
                        return (
                          <Link
                            key={type}
                            href={meta.href}
                            className="group flex items-center gap-3 p-3 rounded-lg border border-[var(--border-default)] hover:border-[var(--accent-primary-border)] hover:bg-[var(--accent-primary-subtle)] transition-all"
                          >
                            <div className={`w-8 h-8 rounded-md ${pillar.bgColor} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-4 h-4 ${pillar.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-primary group-hover:text-[var(--accent-primary)] transition-colors">
                                {meta.label}
                              </p>
                              <p className="text-[10px] text-tertiary">{meta.description}</p>
                            </div>
                            <ArrowRight className="w-3 h-3 text-tertiary group-hover:text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ================================================================
            SECTION : Methodologie & Transparence
            ================================================================ */}
        <MethodologySection />
      </div>

      <Footer />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PillarCard({ pillar }: { pillar: PillarResult }) {
  const Icon = pillar.icon
  const hasData = pillar.score !== null
  const doneCount = pillar.calculators.filter((c) => c.done).length
  const totalCount = pillar.calculators.length
  const pct = hasData ? Math.round((pillar.score! / 25) * 100) : 0

  return (
    <div className={`surface rounded-xl p-5 border ${hasData ? pillar.borderColor : 'border-[var(--border-default)]'} transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${pillar.bgColor} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${pillar.color}`} />
        </div>
        <span className="text-[10px] font-medium text-tertiary">
          {doneCount}/{totalCount} analyses
        </span>
      </div>

      {/* Label */}
      <p className="text-xs font-bold text-primary uppercase tracking-wide">{pillar.label}</p>
      <p className="text-[10px] text-tertiary mb-3">{pillar.sublabel}</p>

      {/* Score */}
      {hasData ? (
        <>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className={`text-2xl font-bold font-tabular ${pillar.color}`}>
              {pillar.score}
            </span>
            <span className="text-xs text-secondary font-medium">/ 25</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                pct >= 70
                  ? 'bg-[var(--accent-success)]'
                  : pct >= 40
                  ? 'bg-[var(--accent-warning)]'
                  : 'bg-[var(--accent-danger)]'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold font-tabular text-tertiary mb-2">--/25</p>
          <p className="text-[10px] text-tertiary">Donnees insuffisantes</p>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Methodology Section — collapsible accordion, McKinsey-style
// ---------------------------------------------------------------------------

const METHODOLOGY_ITEMS = [
  {
    id: 'pillars',
    icon: Layers,
    title: 'Les 4 piliers du Score FinSight',
    content: `Le Score FinSight (0-100) repose sur 4 piliers independants, chacun note sur 25 points :

**CASH** — Tresorerie et Liquidite (25 pts)
Evalue la capacite de l'entreprise a generer et preserver du cash. Indicateurs : DSO (delai clients), BFR (besoin en fonds de roulement), Burn Rate (consommation de tresorerie).

**MARGIN** — Rentabilite et Croissance (25 pts)
Mesure la performance operationnelle et la structure de couts. Indicateurs : Taux de marge, ROI, Seuil de rentabilite, EBITDA.

**RESILIENCE** — Stabilite et Diversification (25 pts)
Evalue la solidite du modele economique a moyen terme. Indicateurs : Ratio LTV/CAC, Valorisation d'entreprise.

**RISK** — Anomalies et Volatilite (25 pts)
Detecte les combinaisons de risques par analyse croisee des indicateurs. Un DSO eleve couple a une marge faible, par exemple, constitue un signal d'alerte specifique.`,
  },
  {
    id: 'benchmarks',
    icon: Database,
    title: 'Benchmarks et referentiels sectoriels',
    content: `Chaque indicateur est compare aux medianes sectorielles francaises pour une interpretation contextualisee.

**Sources des referentiels**
Les seuils utilises sont issus des publications de la Banque de France (etude statistique des entreprises), de l'INSEE (comptes d'entreprises) et des analyses Altares (comportement de paiement). Annee de reference : 2024-2025.

**Positionnement**
Chaque resultat est positionne sur une echelle a 4 niveaux — Excellent (top quartile), Bon (mediane superieure), Vigilance (mediane inferieure), Critique — specifique au secteur d'activite de l'entreprise.

**Secteurs couverts**
Services B2B, Commerce et Distribution, Industrie, SaaS et Tech, BTP et Construction, Restauration et CHR. En l'absence de secteur specifie, les medianes tous secteurs s'appliquent.`,
  },
  {
    id: 'scoring',
    icon: Target,
    title: 'Logique de calcul du score',
    content: `**Ponderation interne**
Au sein de chaque pilier, les indicateurs sont ponderes selon leur impact sur la sante financiere globale. Le DSO pese davantage que le Burn Rate dans le pilier CASH, par exemple, car il affecte directement la liquidite quotidienne.

**Gestion des donnees manquantes**
Lorsqu'un pilier n'a pas suffisamment de donnees, il est marque comme "Donnees insuffisantes" et n'affecte pas le score global. Le score total est extrapole sur 100 a partir des piliers disponibles.

**Indice de confiance**
Le score affiche un badge de confiance : Haute (4/4 piliers), Moyenne (2-3 piliers), Faible (1 pilier). Plus la couverture diagnostique est elevee, plus le score est fiable et comparable aux benchmarks.

**Pas de moyenne simple**
Le pilier RISK utilise une logique deductive (on part de 25 et on soustrait les risques identifies), contrairement aux 3 autres piliers qui utilisent une logique additive normalisee.`,
  },
  {
    id: 'privacy',
    icon: Lock,
    title: 'Confidentialite et stockage des donnees',
    content: `**Aucun envoi de donnees**
Toutes vos donnees financieres restent exclusivement dans votre navigateur (localStorage). Aucune information n'est transmise a un serveur, une base de donnees, ou un tiers.

**Pas de compte requis**
Le diagnostic fonctionne sans inscription. Vos calculs sont conserves localement et accessibles uniquement depuis votre navigateur.

**Suppression**
Vous pouvez supprimer l'ensemble de votre historique a tout moment. La suppression est definitive et irreversible.`,
  },
]

function MethodologySection() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="mb-10">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-default)] flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-primary">Methodologie et transparence</h2>
          <p className="text-xs text-secondary">
            Comment fonctionne le Score FinSight — sources, calcul et confidentialite
          </p>
        </div>
      </div>

      {/* Accordion */}
      <div className="space-y-2">
        {METHODOLOGY_ITEMS.map((item) => {
          const isOpen = openId === item.id
          const Icon = item.icon

          return (
            <div
              key={item.id}
              className={`surface rounded-xl border transition-all duration-200 ${
                isOpen
                  ? 'border-[var(--border-focus)] shadow-sm'
                  : 'border-[var(--border-default)]'
              }`}
            >
              {/* Toggle button */}
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left group"
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                  isOpen
                    ? 'bg-[var(--accent-primary-subtle)]'
                    : 'bg-[var(--surface-primary)]'
                }`}>
                  <Icon className={`w-4 h-4 transition-colors ${
                    isOpen ? 'text-[var(--accent-primary)]' : 'text-secondary'
                  }`} />
                </div>
                <span className={`text-sm font-semibold flex-1 transition-colors ${
                  isOpen ? 'text-[var(--accent-primary)]' : 'text-primary'
                }`}>
                  {item.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-tertiary transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Expandable content */}
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 pl-16">
                  <div className="text-xs text-secondary leading-relaxed space-y-3">
                    {item.content.split('\n\n').map((block, bIdx) => {
                      // Heading lines (bold)
                      if (block.startsWith('**') && block.includes('**\n')) {
                        const [heading, ...rest] = block.split('\n')
                        return (
                          <div key={bIdx}>
                            <p
                              className="text-xs font-semibold text-primary mb-1"
                              dangerouslySetInnerHTML={{
                                __html: heading
                                  .replace(/\*\*([^*]+)\*\*/g, '$1'),
                              }}
                            />
                            <p className="text-xs text-secondary leading-relaxed">
                              {rest.join(' ')}
                            </p>
                          </div>
                        )
                      }

                      // Blocks that contain bold markers
                      if (block.includes('**')) {
                        return (
                          <p
                            key={bIdx}
                            className="text-xs text-secondary leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: block
                                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>')
                                .replace(/\n/g, '<br />'),
                            }}
                          />
                        )
                      }

                      return (
                        <p key={bIdx} className="text-xs text-secondary leading-relaxed">
                          {block}
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Subtle footer link */}
      <div className="text-center mt-5">
        <Link
          href="/methodologie"
          className="text-[11px] font-medium text-tertiary hover:text-[var(--accent-primary)] transition-colors"
        >
          Documentation complete de la methodologie
        </Link>
      </div>
    </div>
  )
}

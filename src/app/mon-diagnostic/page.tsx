'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'
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
    label: 'Santé financière solide',
    sublabel: 'Vos indicateurs clés sont conformes aux standards du secteur.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    bar: 'bg-emerald-500',
  },
  bon: {
    label: 'Dynamique favorable',
    sublabel: 'La majorité de vos indicateurs sont positifs.',
    color: 'text-accent-primary',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    bar: 'bg-accent-primary',
  },
  vigilance: {
    label: 'Points de vigilance identifiés',
    sublabel: 'Certains indicateurs méritent une attention particulière.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    bar: 'bg-amber-500',
  },
  action: {
    label: 'Actions correctives recommandées',
    sublabel: 'Plusieurs indicateurs nécessitent une intervention rapide.',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    bar: 'bg-red-500',
  },
  incomplet: {
    label: 'Diagnostic en cours',
    sublabel: 'Complétez davantage d\'indicateurs pour affiner votre score.',
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    bar: 'bg-gray-400',
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
      <div className="min-h-screen bg-white text-gray-900 font-sans">
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
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Header />

        {/* ── Hero dark ── */}
        <section className="relative bg-slate-950 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,120,212,0.08)_0%,_transparent_60%)]" />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-28 text-center">
            <FadeIn delay={0.1} direction="none">
              <span className="inline-block text-accent-primary text-sm font-medium tracking-widest uppercase">
                Diagnostic financier
              </span>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="font-serif text-4xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-white mt-6">
                Votre Score FinSight™
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mt-6">
                Quatre piliers. Neuf indicateurs. Un score sur 100
                pour piloter avec clarté.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="text-sm text-gray-500 max-w-lg mx-auto mt-4 border-l border-gray-700 pl-4 text-left">
                Trésorerie · Rentabilité · Résilience · Risques — chaque pilier noté
                sur 25, construit à partir de vos données réelles.
              </p>
            </FadeIn>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        </section>

        {/* ── 4 piliers preview ── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn className="text-center mb-12">
              <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
                Architecture du score
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-medium text-gray-900 mt-4">
                4 piliers × 25 points
              </h2>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto" staggerDelay={0.12}>
              {(['cash', 'margin', 'resilience', 'risk'] as PillarKey[]).map((key) => {
                const p = computeDiagnosticScore([]).pillars[key]
                const Icon = p.icon
                return (
                  <StaggerItem key={key}>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:shadow-md hover:border-gray-300 transition-all duration-300">
                      <div className={`w-12 h-12 rounded-xl ${p.bgColor} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`w-5 h-5 ${p.color}`} />
                      </div>
                      <p className="text-sm font-bold text-gray-900 tracking-wide">{p.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{p.sublabel}</p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="font-serif text-2xl font-medium text-gray-300">—</span>
                        <span className="text-xs text-gray-400 ml-1">/ 25</span>
                      </div>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ── Comment ça fonctionne ── */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn className="text-center mb-12">
              <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
                Processus
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-medium text-gray-900 mt-4">
                Trois étapes, deux minutes
              </h2>
            </FadeIn>

            <StaggerContainer className="space-y-4" staggerDelay={0.15}>
              {[
                { step: '01', title: 'Renseignez vos chiffres clés', desc: 'Créances, chiffre d\'affaires, charges — 2 à 3 données par indicateur.', time: '2 min' },
                { step: '02', title: 'Chaque indicateur alimente un pilier', desc: 'Le calcul est instantané. Votre Score FinSight™ se construit progressivement.', time: 'Instantané' },
                { step: '03', title: 'Votre score se précise à chaque analyse', desc: 'Revenez ici pour voir l\'évolution. Plus vous renseignez, plus le diagnostic est fiable.', time: 'Cumulatif' },
              ].map((item) => (
                <StaggerItem key={item.step}>
                  <div className="flex items-start gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-300">
                    <span className="font-serif text-3xl font-medium text-gray-200 flex-shrink-0 leading-none mt-1">
                      {item.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium flex-shrink-0 mt-1 bg-white px-3 py-1 rounded-full border border-gray-200">
                      {item.time}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeIn delay={0.4} className="mt-4 text-center">
              <p className="text-xs text-gray-400 italic">
                Vos données restent dans votre navigateur — rien n'est envoyé à un serveur.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <FadeIn>
              <div className="bg-white rounded-2xl p-10 lg:p-14 border border-gray-200 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-serif text-3xl font-medium text-gray-900 mb-3">
                  Commencez par votre DSO
                </h2>
                <p className="text-gray-500 leading-relaxed max-w-lg mx-auto mb-8">
                  Le délai moyen de paiement clients est le premier indicateur
                  de santé de votre trésorerie. Résultat en moins de 2 minutes.
                </p>
                <Link
                  href="/calculateurs/dso"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white text-base font-semibold rounded-lg hover:bg-slate-800 transition-all duration-300"
                >
                  Obtenir mon Score FinSight™
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center justify-center gap-3 text-sm text-gray-400 mt-4">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>Premier indicateur en moins de 2 minutes</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Methodology ── */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <MethodologySection />
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  // -----------------------------------------------------------------------
  // Main Page
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* ── Hero dark with score ── */}
      <section className="relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,120,212,0.08)_0%,_transparent_60%)]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <FadeIn delay={0.1} direction="none">
                <span className="inline-block text-accent-primary text-sm font-medium tracking-widest uppercase">
                  Score FinSight™
                </span>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h1 className="font-serif text-4xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-white mt-4">
                  Votre diagnostic
                </h1>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="text-gray-400 mt-4 text-lg">
                  {completed.length} indicateur{completed.length > 1 ? 's' : ''} analysé{completed.length > 1 ? 's' : ''} · Dernière mise à jour : {timeAgo(history[0].date)}
                </p>
              </FadeIn>
            </div>

            <FadeIn delay={0.35} direction="none">
              <div className={`rounded-2xl border ${levelCfg.border} ${levelCfg.bg} p-8 min-w-[240px]`}>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Score global
                  </p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    diagnostic.confidence === 'haute'
                      ? 'bg-emerald-50 text-emerald-600'
                      : diagnostic.confidence === 'moyenne'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    Confiance {diagnostic.confidence}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`font-serif text-5xl font-medium ${levelCfg.color}`}>
                    {diagnostic.total !== null ? diagnostic.total : '—'}
                  </span>
                  <span className="text-lg text-gray-400 font-medium">/ 100</span>
                </div>
                <p className={`text-sm font-semibold mt-2 ${levelCfg.color}`}>
                  {levelCfg.label}
                </p>
                {diagnostic.completedPillars < 4 && (
                  <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                    Basé sur {diagnostic.completedPillars}/4 piliers — score extrapolé.
                  </p>
                )}
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      </section>

      {/* ── Couverture diagnostique + Piliers ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          {/* Progress bar */}
          <FadeIn className="mb-12">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Couverture diagnostique
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {completed.length}/{TOTAL_CALCULATORS} analyses réalisées
                  </p>
                </div>
                <span className="font-serif text-3xl font-medium text-gray-900">
                  {coveragePct}%
                </span>
              </div>

              <div className="flex gap-1.5 mb-5">
                {Array.from({ length: TOTAL_CALCULATORS }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      i < completed.length
                        ? 'bg-accent-primary'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {nextCalc && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-accent-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Prochaine analyse recommandée
                      </p>
                      <p className="text-xs text-gray-500">
                        {CALCULATOR_META[nextCalc].fullLabel} — {CALCULATOR_META[nextCalc].description}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={CALCULATOR_META[nextCalc].href}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
                  >
                    Calculer
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              )}

              {completed.length === TOTAL_CALCULATORS && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Diagnostic complet</p>
                    <p className="text-xs text-gray-500">
                      Tous les indicateurs ont été analysés. Votre Score FinSight™ est au maximum de précision.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* 4 Piliers */}
          <FadeIn className="text-center mb-10">
            <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
              Détail par pilier
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-gray-900 mt-3">
              Vos 4 piliers financiers
            </h2>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.1}>
            {(['cash', 'margin', 'resilience', 'risk'] as PillarKey[]).map((key) => {
              const pillar = diagnostic.pillars[key]
              return (
                <StaggerItem key={key}>
                  <PillarCard pillar={pillar} />
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="https://calendly.com/zineinsight"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 group-hover:text-accent-primary transition-colors">
                      Échange stratégique
                    </p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      30 min · Analyse de votre score · Confidentiel
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-accent-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </a>

              <Link
                href="/consulting"
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 group-hover:text-accent-primary transition-colors">
                      Audit complet sous 72h
                    </p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      Rapport détaillé + plan d'action priorisé + recommandations chiffrées
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-accent-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Historique des analyses ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="px-8 py-5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent-primary" />
                  <h2 className="text-base font-bold text-gray-900">Historique des analyses</h2>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {history.length} calcul{history.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {history.map((calc, idx) => {
                  const meta = CALCULATOR_META[calc.type]
                  if (!meta) return null
                  const Icon = meta.icon
                  const pillar = diagnostic.pillars[meta.pillar]

                  return (
                    <div key={`${calc.type}-${idx}`} className="flex items-center gap-4 px-8 py-4 hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg ${pillar.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${pillar.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{meta.label}</p>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${pillar.bgColor} ${pillar.color}`}>
                            {pillar.label}
                          </span>
                          <span className="text-sm font-bold text-gray-900 ml-auto mr-4">
                            {formatValue(calc.value, calc.unit || meta.unit)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(calc.date)}</p>
                      </div>
                      <Link
                        href={meta.href}
                        className="text-xs font-semibold text-gray-500 hover:text-accent-primary transition-colors flex-shrink-0"
                      >
                        Mettre à jour
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Indicateurs manquants ── */}
      {completed.length < TOTAL_CALCULATORS && (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn className="mb-10">
              <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
                Compléter le diagnostic
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-medium text-gray-900 mt-3">
                Analyses manquantes
              </h2>
              <p className="text-gray-500 mt-2">
                {TOTAL_CALCULATORS - completed.length} indicateur{TOTAL_CALCULATORS - completed.length > 1 ? 's' : ''} restant{TOTAL_CALCULATORS - completed.length > 1 ? 's' : ''} pour
                une couverture analytique complète.
              </p>
            </FadeIn>

            <div className="space-y-8">
              {(['cash', 'margin', 'resilience', 'risk'] as PillarKey[]).map((key) => {
                const pillar = diagnostic.pillars[key]
                const missing = pillar.calculators.filter((c) => !c.done)
                if (missing.length === 0) return null

                return (
                  <FadeIn key={key}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${pillar.color}`}>
                      {pillar.label} — {pillar.sublabel}
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                      {missing.map(({ type }) => {
                        const meta = CALCULATOR_META[type]
                        const Icon = meta.icon
                        return (
                          <Link
                            key={type}
                            href={meta.href}
                            className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                          >
                            <div className={`w-10 h-10 rounded-lg ${pillar.bgColor} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-4 h-4 ${pillar.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-accent-primary transition-colors">
                                {meta.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{meta.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent-primary opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                          </Link>
                        )
                      })}
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Méthodologie ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <MethodologySection />
        </div>
      </section>

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
    <div className={`bg-white rounded-xl p-6 border ${hasData ? pillar.borderColor : 'border-gray-200'} hover:shadow-md transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${pillar.bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${pillar.color}`} />
        </div>
        <span className="text-[11px] font-medium text-gray-400">
          {doneCount}/{totalCount} analyses
        </span>
      </div>

      {/* Label */}
      <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{pillar.label}</p>
      <p className="text-xs text-gray-500 mt-0.5 mb-4">{pillar.sublabel}</p>

      {/* Score */}
      {hasData ? (
        <>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className={`font-serif text-3xl font-medium ${pillar.color}`}>
              {pillar.score}
            </span>
            <span className="text-sm text-gray-400 font-medium">/ 25</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                pct >= 70
                  ? 'bg-emerald-500'
                  : pct >= 40
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      ) : (
        <>
          <p className="font-serif text-3xl font-medium text-gray-300 mb-3">—/25</p>
          <p className="text-xs text-gray-400">Données insuffisantes</p>
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
    <div>
      {/* Section header */}
      <FadeIn className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-medium text-gray-900">Méthodologie et transparence</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Comment fonctionne le Score FinSight™ — sources, calcul et confidentialité
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Accordion */}
      <div className="space-y-3">
        {METHODOLOGY_ITEMS.map((item) => {
          const isOpen = openId === item.id
          const Icon = item.icon

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border transition-all duration-200 ${
                isOpen
                  ? 'border-gray-300 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Toggle button */}
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center gap-4 px-6 py-5 text-left group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isOpen
                    ? 'bg-slate-950'
                    : 'bg-gray-100'
                }`}>
                  <Icon className={`w-4 h-4 transition-colors ${
                    isOpen ? 'text-white' : 'text-gray-500'
                  }`} />
                </div>
                <span className={`text-sm font-semibold flex-1 transition-colors ${
                  isOpen ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {item.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
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
                <div className="px-6 pb-6 pl-20">
                  <div className="text-sm text-gray-500 leading-relaxed space-y-3">
                    {item.content.split('\n\n').map((block, bIdx) => {
                      if (block.startsWith('**') && block.includes('**\n')) {
                        const [heading, ...rest] = block.split('\n')
                        return (
                          <div key={bIdx}>
                            <p
                              className="text-sm font-semibold text-gray-900 mb-1"
                              dangerouslySetInnerHTML={{
                                __html: heading.replace(/\*\*([^*]+)\*\*/g, '$1'),
                              }}
                            />
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {rest.join(' ')}
                            </p>
                          </div>
                        )
                      }

                      if (block.includes('**')) {
                        return (
                          <p
                            key={bIdx}
                            className="text-sm text-gray-500 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: block
                                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
                                .replace(/\n/g, '<br />'),
                            }}
                          />
                        )
                      }

                      return (
                        <p key={bIdx} className="text-sm text-gray-500 leading-relaxed">
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

      {/* Footer link */}
      <div className="text-center mt-6">
        <Link
          href="/methodologie"
          className="text-sm font-medium text-gray-400 hover:text-accent-primary transition-colors"
        >
          Documentation complète de la méthodologie →
        </Link>
      </div>
    </div>
  )
}

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
  type SectorKey,
  type PillarKey,
  type PillarResult,
  type DiagnosticScore,
  SECTOR_BENCHMARKS,
  LEVEL_CONFIG,
  computeDiagnosticScore,
  computeInsights,
  formatValue,
  formatDate,
  timeAgo,
  getContextualCTA,
} from '@/lib/scoring/diagnosticScore'
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
  Building2,
  Sparkles,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Constants & Metadata
// ---------------------------------------------------------------------------
const TOTAL_CALCULATORS = 10

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
  gearing: {
    label: 'Gearing',
    fullLabel: 'Dette nette / EBITDA',
    icon: Shield,
    unit: 'x',
    href: '/diagnostic/guide',
    pillar: 'resilience',
    description: 'Niveau d\'endettement rapporte a la capacite beneficiaire',
  },
}

// ---------------------------------------------------------------------------
// Pillar icon mapping (kept page-local to avoid coupling shared lib to lucide)
// ---------------------------------------------------------------------------
const PILLAR_ICONS: Record<PillarKey, typeof DollarSign> = {
  cash: DollarSign,
  margin: TrendingUp,
  resilience: Shield,
  risk: AlertTriangle,
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

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function MonDiagnosticPage() {
  const { history, completedTypes, clearHistory } = useCalculatorHistory()
  const [mounted, setMounted] = useState(false)
  const [sector, setSector] = useState<SectorKey>('autre')

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('finsight_sector') as SectorKey | null
    if (saved && saved in SECTOR_BENCHMARKS) setSector(saved)
  }, [])

  const handleSectorChange = (s: SectorKey) => {
    setSector(s)
    localStorage.setItem('finsight_sector', s)
  }

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
  const diagnostic = computeDiagnosticScore(history, sector)
  const insights = computeInsights(diagnostic, history, sector)
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

        {/* ── Sélecteur de secteur (empty state) ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mr-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Personnaliser les benchmarks :</span>
              </div>
              {(Object.entries(SECTOR_BENCHMARKS) as [SectorKey, typeof SECTOR_BENCHMARKS[SectorKey]][]).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => handleSectorChange(key)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${
                    sector === key
                      ? 'bg-slate-950 text-white border-slate-950'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2 ml-8">
              Le score sera calibré sur les ratios réels de votre secteur (Banque de France 2024, Altares)
            </p>
          </div>
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
                const Icon = PILLAR_ICONS[key]
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
                  Demarrer votre diagnostic
                </h2>
                <p className="text-gray-500 leading-relaxed max-w-lg mx-auto mb-8">
                  Un parcours guide en 4 piliers — tresorerie, rentabilite,
                  resilience, risques. Environ 7 minutes.
                </p>
                <Link
                  href="/diagnostic/guide"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white text-base font-semibold rounded-lg hover:bg-slate-800 transition-all duration-300"
                >
                  Demarrer le diagnostic guide
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-xs text-gray-400 mt-4">
                  Ou <Link href="/calculateurs/dso" className="underline hover:text-gray-600 transition-colors">commencez par un indicateur individuel</Link>
                </p>
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
                    {diagnostic.confidence === 'faible' ? 'Score provisoire' : 'Score global'}
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
                {diagnostic.total !== null ? (
                  diagnostic.confidence === 'faible' ? (
                    // 1 pilier — fourchette large ±12
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className={`font-serif text-4xl font-medium ${levelCfg.color}`}>
                          {Math.max(0, diagnostic.total - 12)}
                        </span>
                        <span className="text-lg text-gray-400 font-medium mx-1">–</span>
                        <span className={`font-serif text-4xl font-medium ${levelCfg.color}`}>
                          {Math.min(100, diagnostic.total + 12)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Fourchette estimée · Basé sur 1/4 piliers</p>
                    </div>
                  ) : diagnostic.confidence === 'moyenne' ? (
                    // 2–3 piliers — fourchette ±7
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className={`font-serif text-4xl font-medium ${levelCfg.color}`}>
                          {Math.max(0, diagnostic.total - 7)}
                        </span>
                        <span className="text-lg text-gray-400 font-medium mx-1">–</span>
                        <span className={`font-serif text-4xl font-medium ${levelCfg.color}`}>
                          {Math.min(100, diagnostic.total + 7)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Fourchette estimée · {diagnostic.completedPillars}/4 piliers</p>
                    </div>
                  ) : (
                    // 4 piliers — score exact
                    <div className="flex items-baseline gap-2">
                      <span className={`font-serif text-5xl font-medium ${levelCfg.color}`}>
                        {diagnostic.total}
                      </span>
                      <span className="text-lg text-gray-400 font-medium">/ 100</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-5xl font-medium text-gray-300">—</span>
                    <span className="text-lg text-gray-400 font-medium">/ 100</span>
                  </div>
                )}
                <p className={`text-sm font-semibold mt-2 ${levelCfg.color}`}>
                  {levelCfg.label}
                </p>
                {diagnostic.completedPillars < 4 && (
                  <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                    {diagnostic.confidence === 'faible'
                      ? 'Ajoutez 1–2 analyses pour affiner la fourchette.'
                      : `Basé sur ${diagnostic.completedPillars}/4 piliers — score extrapolé.`}
                  </p>
                )}
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      </section>

      {/* ── Sélecteur de secteur ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mr-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Secteur :</span>
            </div>
            {(Object.entries(SECTOR_BENCHMARKS) as [SectorKey, typeof SECTOR_BENCHMARKS[SectorKey]][]).map(([key, s]) => (
              <button
                key={key}
                onClick={() => handleSectorChange(key)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${
                  sector === key
                    ? 'bg-slate-950 text-white border-slate-950'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {sector !== 'autre' && (
            <p className="text-[11px] text-gray-400 mt-2 ml-8">
              Benchmarks : DSO médian {SECTOR_BENCHMARKS[sector].dsoMedian}j · Marge médiane {SECTOR_BENCHMARKS[sector].margeMedian}% · EBITDA médian {SECTOR_BENCHMARKS[sector].ebitdaMedian}% · Sources : Banque de France 2024, Altares
            </p>
          )}
        </div>
      </section>

      {/* ── Ce que cela signifie pour vous ── */}
      {(insights.forces.length > 0 || insights.vulnerabilites.length > 0) && (
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <div className="grid lg:grid-cols-3 gap-6">

                {/* Forces */}
                {insights.forces.length > 0 && (
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm font-bold text-emerald-800 uppercase tracking-wide">Forces</p>
                    </div>
                    <ul className="space-y-2.5">
                      {insights.forces.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-emerald-800 leading-snug">
                          <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Vulnérabilités */}
                {insights.vulnerabilites.length > 0 && (
                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm font-bold text-amber-800 uppercase tracking-wide">Vulnérabilités</p>
                    </div>
                    <ul className="space-y-2.5">
                      {insights.vulnerabilites.map((v, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-800 leading-snug">
                          <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">!</span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Priorité + Impact € */}
                <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-white uppercase tracking-wide">Priorité #1</p>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{insights.priorite}</p>

                  {insights.cashImpactLabel && (
                    <div className="mt-5 pt-5 border-t border-slate-800">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
                        Impact cash immobilisé
                      </p>
                      <p className="font-serif text-2xl font-medium text-accent-primary">
                        {insights.cashImpactLabel}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        {insights.cashImpactDetail}
                      </p>
                    </div>
                  )}

                  <a
                    href="https://calendly.com/zineinsight"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-5 inline-flex items-center gap-2 text-xs font-semibold text-accent-primary hover:text-blue-400 transition-colors"
                  >
                    En discuter avec un expert
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

              </div>
            </FadeIn>
          </div>
        </section>
      )}

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
                  <PillarCard pillar={pillar} pillarKey={key} />
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
            {/* Refaire le diagnostic guide */}
            <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Refaire le diagnostic guide</p>
                    <p className="text-xs text-gray-500 mt-0.5">Parcours structure en 4 piliers — environ 7 minutes</p>
                  </div>
                </div>
                <Link
                  href="/diagnostic/guide"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  Demarrer
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Email capture banner — collect email for report delivery */}
            {diagnostic.total !== null && (
              <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Recevez votre rapport de diagnostic
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 mb-3">
                      Score {diagnostic.total}/100 · {LEVEL_CONFIG[diagnostic.level].label} · Rapport PDF + recommandations personnalisées
                    </p>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault()
                        const form = e.currentTarget
                        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
                        if (!emailInput?.value) return
                        try {
                          await fetch('/api/diagnostic/email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              email: emailInput.value,
                              score: diagnostic.total,
                              sector,
                              pillars: diagnostic.pillars,
                              insights,
                            }),
                          })
                          emailInput.value = ''
                          emailInput.placeholder = '✓ Rapport envoyé !'
                        } catch {
                          // silently fail — non-blocking
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="email"
                        placeholder="email@entreprise.com"
                        required
                        className="flex-1 px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Envoyer le rapport
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Contextual CTA — adapté au score */}
              {(() => {
                const cta = getContextualCTA(diagnostic.total)
                return (
                  <a
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group rounded-xl p-6 border transition-all duration-300 hover:shadow-md ${
                      cta.urgency === 'high'
                        ? 'bg-red-50 border-red-200 hover:border-red-300'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        cta.urgency === 'high' ? 'bg-red-600' : 'bg-slate-950'
                      }`}>
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 group-hover:text-accent-primary transition-colors">
                          {cta.label}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          {cta.sublabel}
                        </p>
                        <p className={`text-xs font-bold mt-2 ${
                          cta.urgency === 'high' ? 'text-red-600' : 'text-gray-400'
                        }`}>{cta.price}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-accent-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </a>
                )
              })()}

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
                      Audit complet et pilotage financier
                    </p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      Rapport detaille sous 72h + plan d'action priorise
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

function PillarCard({ pillar, pillarKey }: { pillar: PillarResult; pillarKey: PillarKey }) {
  const Icon = PILLAR_ICONS[pillarKey]
  const hasData = pillar.score !== null
  const doneCount = pillar.calculators.filter((c: { type: CalculatorType; done: boolean }) => c.done).length
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
    title: 'Les 4 piliers du Score FinSight™',
    content: `Le Score FinSight™ (0–100) repose sur 4 piliers indépendants, chacun noté sur 25 points :

**CASH — Trésorerie et Liquidité (25 pts)**
Évalue la capacité à générer et préserver du cash. Indicateurs : DSO (délai clients), BFR (besoin en fonds de roulement en jours de CA), Burn Rate (en % du CA mensuel estimé). Tous les seuils sont relatifs aux benchmarks sectoriels — un DSO de 65 jours est normal en BTP, critique en CHR.

**MARGIN — Rentabilité et Croissance (25 pts)**
Mesure la performance opérationnelle. Indicateurs : Taux de marge (comparé à la médiane sectorielle), ROI, Taux de marge au seuil de rentabilité, EBITDA en % du CA. Le ratio EBITDA/CA est positionné par rapport au médian sectoriel (source : Banque de France).

**RÉSILIENCE — Stabilité Structurelle (25 pts)**
Évalue la solidité du modèle à moyen terme via trois sous-scores : ratio LTV/CAC (pertinent SaaS), valorisation rapportée au CA, et résilience structurelle dérivée (croisement DSO, BFR, marge, EBITDA). Ce dernier indicateur est calculable pour toutes les PME, même sans données de valorisation.

**RISQUES — Anomalies et Croisements (25 pts)**
Détecte les combinaisons de fragilité par logique déductive (départ à 25, déductions des risques identifiés). Signaux croisés : DSO > médiane sectorielle ET marge < médiane = double pression cash (−3 pts) ; BFR > médiane ET taux de marge tendu = fragilité structurelle (−2 pts) ; Burn Rate > 90% CA mensuel = structure déficitaire (−5 pts).`,
  },
  {
    id: 'benchmarks',
    icon: Database,
    title: 'Benchmarks sectoriels réels',
    content: `Chaque indicateur est comparé aux médianes sectorielles françaises pour une interprétation contextualisée, pas à des seuils universels arbitraires.

**Sources des référentiels (2024)**
- Banque de France — Statistiques d'entreprises par secteur NAF (DSO médian, BFR/CA, EBITDA%)
- INSEE — Comptes des entreprises par secteur
- Altares — Comportements de paiement inter-entreprises (DSO, délais)

**7 secteurs couverts**
| Secteur | DSO médian | Marge médiane | BFR (jours CA) | EBITDA médian |
|---|---|---|---|---|
| Services B2B | 45 j | 55% | 30 j | 12% |
| Commerce & Distribution | 30 j | 30% | 35 j | 5% |
| Industrie & Fabrication | 55 j | 38% | 50 j | 8% |
| SaaS & Tech | 25 j | 70% | 15 j | 15% |
| BTP & Construction | 65 j | 22% | 45 j | 5% |
| Restauration & CHR | 10 j | 68% | −5 j | 10% |
| Tous secteurs (défaut) | 45 j | 40% | 30 j | 8% |

**Positionnement sur 4 niveaux**
Top quartile (>1,3× médiane) · Au-dessus médiane · Dans la médiane · Sous le seuil critique`,
  },
  {
    id: 'scoring',
    icon: Target,
    title: 'Logique de calcul du score',
    content: `**Seuils relatifs, non absolus**
Un Burn Rate de 15 000 €/mois est maîtrisé pour une entreprise à 600 k€ CA (30%), mais critique pour une à 100 k€ CA (180%). Le moteur utilise systématiquement le CA mensuel estimé (depuis BFR.inputs.ca ou Seuil.chargesFixes ÷ tauxMarge) pour contextualiser tous les indicateurs monétaires.

**Pondération interne**
Au sein de chaque pilier, les indicateurs sont pondérés selon leur impact : DSO (10/25) > BFR (10/25) > Burn Rate (5/25) dans CASH ; Marge (8/25) > ROI (7/25) > Seuil (6/25) > EBITDA (4/25) dans MARGIN.

**Gestion des données manquantes**
Un pilier sans données est marqué "Données insuffisantes" et exclu du calcul. Le score est extrapolé sur 100 à partir des piliers disponibles.

**Indice de confiance**
Haute (4/4 piliers) · Moyenne (2–3 piliers) · Faible (1 pilier). Indiqué sur le score pour éviter les surinterprétations.

**Pilier RISQUES : logique déductive**
Contrairement aux 3 autres piliers (logique additive normalisée), RISQUES part de 25 et soustrait les signaux de fragilité identifiés. Plafond à 25, plancher à 0.`,
  },
  {
    id: 'privacy',
    icon: Lock,
    title: 'Confidentialité et stockage des données',
    content: `**Aucun envoi de données**
Toutes vos données financières restent exclusivement dans votre navigateur (localStorage). Aucune information n'est transmise à un serveur, une base de données, ou un tiers.

**Pas de compte requis**
Le diagnostic fonctionne sans inscription. Vos calculs sont conservés localement et accessibles uniquement depuis votre navigateur.

**Votre secteur est mémorisé localement**
Le secteur d'activité sélectionné est sauvegardé dans localStorage (clé : finsight_sector). Il ne quitte jamais votre navigateur.

**Suppression**
Vous pouvez supprimer l'ensemble de votre historique à tout moment. La suppression est définitive et irréversible.`,
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

      {/* Footer links */}
      <div className="text-center mt-6 space-y-2">
        <Link
          href="/methodologie"
          className="text-sm font-medium text-gray-400 hover:text-accent-primary transition-colors"
        >
          Documentation complète de la méthodologie →
        </Link>
        <div>
          <Link
            href="/pilotage-financier-pme"
            className="text-xs text-gray-500 hover:text-accent-primary transition-colors"
          >
            Guide complet : pilotage financier PME →
          </Link>
        </div>
      </div>
    </div>
  )
}

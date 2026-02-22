'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Building2,
  Activity,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useCalculatorHistory, type CalculatorType } from '@/hooks/useCalculatorHistory'
import {
  type SectorKey,
  type SectorBenchmark,
  type PillarKey,
  type SynthesisLever,
  SECTOR_BENCHMARKS,
  computeLiveScores,
  computeSynthesis,
  getBenchmarkHint,
  getContextualCTA,
} from '@/lib/scoring/diagnosticScore'
import { useScorisEngine } from '@/hooks/useScorisEngine'
import { SectorComparisonGrid } from '@/components/diagnostic/SectorComparisonBadge'
import { WhatIfSlider } from '@/components/diagnostic/WhatIfSlider'
import { ExecutiveSummary } from '@/components/diagnostic/ExecutiveSummary'
import { GuideDownloadCTA } from '@/components/diagnostic/GuideDownloadCTA'
import type { AnalysisStep } from '@/lib/scoris/types'
import { ANALYSIS_STEP_LABELS } from '@/lib/scoris/types'

// ---------------------------------------------------------------------------
// DiagnosticEmailCapture — email opt-in + newsletter (rendered inside guide)
// ---------------------------------------------------------------------------
interface DiagnosticEmailCaptureProps {
  totalScore: number
  sector: string
  pillarScores: Record<string, number | null>
  synthesis: Record<string, unknown>
  results: Record<string, { value: number; inputs: Record<string, number> }>
}

function DiagnosticEmailCapture({ totalScore, sector, pillarScores, synthesis, results }: DiagnosticEmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [reportUrl, setReportUrl] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Veuillez saisir une adresse email valide.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/diagnostic/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newsletterOptIn: newsletter,
          sector,
          totalScore,
          pillarScores,
          synthesis,
          results,
        }),
      })
      const data = await res.json()
      if (res.ok && data.reportUrl) {
        setStatus('success')
        setReportUrl(data.reportUrl)
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
          ;(window as any).gtag('event', 'diagnostic_report_requested', {
            event_category: 'lead_capture',
            score: totalScore,
            newsletter_opt_in: newsletter,
            email_domain: email.split('@')[1] || 'unknown',
          })
        }
      } else throw new Error(data.error || 'unknown')
    } catch {
      setStatus('error')
      setErrorMsg('Une erreur est survenue. Réessayez.')
    }
  }

  if (status === 'success') {
    return (
      <div className="px-6 py-5 bg-slate-800 rounded-lg border border-slate-700">
        <div className="flex items-start gap-3 mb-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">Rapport envoyé !</p>
            <p className="text-xs text-gray-400 mt-0.5">Vérifiez votre boîte mail dans les prochaines minutes.</p>
          </div>
        </div>
        {reportUrl && (
          <a
            href={reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
          >
            Voir le rapport maintenant →
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="px-6 py-5 bg-slate-800 rounded-lg border border-slate-700">
      <p className="text-sm font-semibold text-white mb-0.5">
        Recevez votre rapport Score FinSight™ {totalScore}/100 par email
      </p>
      <p className="text-xs text-gray-400 mb-3 leading-relaxed">
        Analyse détaillée des 4 piliers · Recommandations prioritaires · Plan d&apos;action personnalisé
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex gap-2 mb-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            autoComplete="email"
            inputMode="email"
            className="flex-1 px-3 py-2.5 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-400 min-w-0"
            aria-label="Votre adresse email"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-slate-900 text-sm font-semibold rounded transition-colors flex-shrink-0 disabled:opacity-60 flex items-center gap-1.5"
          >
            {status === 'loading' ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : 'Envoyer'}
          </button>
        </div>
        {errorMsg && <p className="text-xs text-red-400 mb-2">{errorMsg}</p>}
        <label className="flex items-start gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
            className="mt-0.5 accent-white flex-shrink-0"
          />
          <span className="text-[11px] text-gray-500 group-hover:text-gray-400 leading-relaxed transition-colors">
            Je souhaite recevoir le Flash Finance Hebdo — conseils DAF, benchmarks PME, cas pratiques.
            Désinscription à tout moment. Données protégées conformément au{' '}
            <a href="/politique-confidentialite" className="underline hover:text-gray-300">RGPD</a>.
          </span>
        </label>
      </form>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sector benchmarks & types imported from shared lib
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Pillar metadata (UI-specific, uses PillarKey from shared lib)
// ---------------------------------------------------------------------------

interface PillarMeta {
  key: PillarKey
  label: string
  sublabel: string
  icon: typeof DollarSign
  color: string
  bgMuted: string
  borderColor: string
}

const PILLARS: PillarMeta[] = [
  { key: 'cash', label: 'CASH', sublabel: 'Tresorerie et Liquidite', icon: DollarSign, color: 'text-blue-400', bgMuted: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  { key: 'margin', label: 'MARGIN', sublabel: 'Rentabilite et Performance', icon: TrendingUp, color: 'text-emerald-400', bgMuted: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' },
  { key: 'resilience', label: 'RESILIENCE', sublabel: 'Stabilite Structurelle', icon: Shield, color: 'text-purple-400', bgMuted: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
  { key: 'risk', label: 'RISQUES', sublabel: 'Anomalies et Croisements', icon: AlertTriangle, color: 'text-amber-400', bgMuted: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
]

// ---------------------------------------------------------------------------
// Wizard steps (forms within each pillar)
// ---------------------------------------------------------------------------

interface WizardField {
  id: string
  label: string
  placeholder: string
  suffix: string
  help?: string
}

interface WizardStep {
  id: string
  calcType: CalculatorType
  title: string
  subtitle: string
  pillar: PillarKey
  fields: WizardField[]
  compute: (inputs: Record<string, number>) => { value: number; unit: string }
  optional?: boolean
}

const WIZARD_STEPS: WizardStep[] = [
  // ── CASH ──────────────────────────────────────────────
  {
    id: 'dso',
    calcType: 'dso',
    title: 'Positionnement de votre tresorerie',
    subtitle: 'Delai moyen de recouvrement clients',
    pillar: 'cash',
    fields: [
      { id: 'creances', label: 'Creances clients', placeholder: '150 000', suffix: '\u20ac', help: 'Montant total des factures non encaissees' },
      { id: 'ca', label: 'Chiffre d\'affaires annuel', placeholder: '2 000 000', suffix: '\u20ac', help: 'CA sur les 12 derniers mois' },
    ],
    compute: (inputs) => ({
      value: inputs.ca > 0 ? Math.round((inputs.creances / inputs.ca) * 365) : 0,
      unit: 'jours',
    }),
  },
  {
    id: 'bfr',
    calcType: 'bfr',
    title: 'Capital immobilise dans le cycle',
    subtitle: 'Besoin en fonds de roulement',
    pillar: 'cash',
    fields: [
      { id: 'stocks', label: 'Stocks', placeholder: '80 000', suffix: '\u20ac' },
      { id: 'creances', label: 'Creances clients', placeholder: '150 000', suffix: '\u20ac' },
      { id: 'dettes', label: 'Dettes fournisseurs', placeholder: '100 000', suffix: '\u20ac' },
      { id: 'ca', label: 'Chiffre d\'affaires annuel', placeholder: '2 000 000', suffix: '\u20ac' },
    ],
    compute: (inputs) => ({
      value: Math.round((inputs.stocks || 0) + (inputs.creances || 0) - (inputs.dettes || 0)),
      unit: '\u20ac',
    }),
  },
  {
    id: 'burn-rate',
    calcType: 'burn-rate',
    title: 'Consommation mensuelle de cash',
    subtitle: 'Burn rate operationnel',
    pillar: 'cash',
    optional: true,
    fields: [
      { id: 'depensesMensuelles', label: 'Charges mensuelles totales', placeholder: '45 000', suffix: '\u20ac/mois', help: 'Salaires + loyer + achats + abonnements' },
    ],
    compute: (inputs) => ({
      value: Math.round(inputs.depensesMensuelles || 0),
      unit: '\u20ac/mois',
    }),
  },

  // ── MARGIN ────────────────────────────────────────────
  {
    id: 'marge',
    calcType: 'marge',
    title: 'Rentabilite de l\'activite commerciale',
    subtitle: 'Taux de marge brute',
    pillar: 'margin',
    fields: [
      { id: 'prixVente', label: 'Prix de vente HT', placeholder: '100', suffix: '\u20ac' },
      { id: 'coutRevient', label: 'Cout de revient', placeholder: '60', suffix: '\u20ac' },
    ],
    compute: (inputs) => ({
      value: inputs.prixVente > 0
        ? Math.round(((inputs.prixVente - inputs.coutRevient) / inputs.prixVente) * 100)
        : 0,
      unit: '%',
    }),
  },
  {
    id: 'seuil-rentabilite',
    calcType: 'seuil-rentabilite',
    title: 'Chiffre d\'affaires minimum de survie',
    subtitle: 'Seuil de rentabilite',
    pillar: 'margin',
    fields: [
      { id: 'chargesFixes', label: 'Charges fixes annuelles', placeholder: '300 000', suffix: '\u20ac', help: 'Loyer, salaires fixes, assurances, abonnements' },
      { id: 'tauxMarge', label: 'Taux de marge sur couts variables', placeholder: '40', suffix: '%' },
    ],
    compute: (inputs) => ({
      value: inputs.tauxMarge > 0
        ? Math.round(inputs.chargesFixes / (inputs.tauxMarge / 100))
        : 0,
      unit: '\u20ac',
    }),
  },
  {
    id: 'roi',
    calcType: 'roi',
    title: 'Retour sur investissement',
    subtitle: 'ROI sur un projet ou investissement',
    pillar: 'margin',
    optional: true,
    fields: [
      { id: 'gains', label: 'Gains generes', placeholder: '50 000', suffix: '\u20ac' },
      { id: 'investissement', label: 'Montant investi', placeholder: '20 000', suffix: '\u20ac' },
    ],
    compute: (inputs) => ({
      value: inputs.investissement > 0
        ? Math.round(((inputs.gains - inputs.investissement) / inputs.investissement) * 100)
        : 0,
      unit: '%',
    }),
  },

  // ── RESILIENCE ────────────────────────────────────────
  {
    id: 'ebitda',
    calcType: 'ebitda',
    title: 'Capacite beneficiaire operationnelle',
    subtitle: 'EBITDA',
    pillar: 'resilience',
    fields: [
      { id: 'ca', label: 'Chiffre d\'affaires', placeholder: '2 000 000', suffix: '\u20ac' },
      { id: 'charges', label: 'Charges d\'exploitation (hors amortissements)', placeholder: '1 700 000', suffix: '\u20ac' },
    ],
    compute: (inputs) => ({
      value: Math.round((inputs.ca || 0) - (inputs.charges || 0)),
      unit: '\u20ac',
    }),
  },
  {
    id: 'cac-ltv',
    calcType: 'cac-ltv',
    title: 'Rentabilite de l\'acquisition clients',
    subtitle: 'Ratio LTV / CAC',
    pillar: 'resilience',
    optional: true,
    fields: [
      { id: 'ltv', label: 'Valeur vie client (LTV)', placeholder: '15 000', suffix: '\u20ac', help: 'Revenu moyen genere par client sur toute sa duree' },
      { id: 'cac', label: 'Cout d\'acquisition client (CAC)', placeholder: '3 000', suffix: '\u20ac', help: 'Depenses marketing et ventes par nouveau client' },
    ],
    compute: (inputs) => ({
      value: inputs.cac > 0 ? Math.round((inputs.ltv / inputs.cac) * 10) / 10 : 0,
      unit: 'x',
    }),
  },
  {
    id: 'gearing',
    calcType: 'gearing',
    title: 'Poids de l\'endettement',
    subtitle: 'Ratio dette nette / EBITDA',
    pillar: 'resilience',
    optional: true,
    fields: [
      { id: 'detteNette', label: 'Dette financiere nette', placeholder: '400 000', suffix: '\u20ac', help: 'Dettes bancaires + obligataires - tresorerie disponible' },
      { id: 'ebitda', label: 'EBITDA annuel', placeholder: '200 000', suffix: '\u20ac', help: 'Resultat operationnel avant amortissements' },
    ],
    compute: (inputs) => ({
      value: inputs.ebitda > 0 ? Math.round((inputs.detteNette / inputs.ebitda) * 10) / 10 : 0,
      unit: 'x',
    }),
  },
]

// ---------------------------------------------------------------------------
// Wizard phases (narrative blocks)
// ---------------------------------------------------------------------------

type PhaseKey = 'intro' | 'cash' | 'margin' | 'resilience' | 'risk' | 'synthesis'

interface Phase {
  key: PhaseKey
  pillar?: PillarKey
  title: string
  subtitle: string
  transition?: string
}

const PHASES: Phase[] = [
  {
    key: 'intro',
    title: 'Protocole de diagnostic',
    subtitle: 'Nous allons analyser votre modele en 4 piliers. Le diagnostic prend environ 7 minutes.',
  },
  {
    key: 'cash',
    pillar: 'cash',
    title: 'Pilier I — Tresorerie et Liquidite',
    subtitle: 'Positionnement de votre cycle de tresorerie par rapport aux medianes sectorielles.',
    transition: 'Votre liquidite est positionnee. Analysons maintenant la performance.',
  },
  {
    key: 'margin',
    pillar: 'margin',
    title: 'Pilier II — Rentabilite et Performance',
    subtitle: 'Structure de couts, seuil de rentabilite et retour sur investissement.',
    transition: 'La rentabilite est evaluee. Passons a la solidite structurelle.',
  },
  {
    key: 'resilience',
    pillar: 'resilience',
    title: 'Pilier III — Stabilite Structurelle',
    subtitle: 'Capacite beneficiaire et perennite du modele economique.',
    transition: 'La resilience est evaluee. Analyse des croisements critiques.',
  },
  {
    key: 'risk',
    pillar: 'risk',
    title: 'Pilier IV — Croisements critiques',
    subtitle: 'Detection des combinaisons de fragilite entre vos indicateurs.',
    transition: 'Analyse des risques terminee. Consolidation de votre lecture strategique.',
  },
  {
    key: 'synthesis',
    title: 'Lecture strategique',
    subtitle: 'Synthese de votre diagnostic — forces, vulnerabilites, priorite d\'action.',
  },
]

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

function formatResult(value: number, unit: string): string {
  if (unit === '\u20ac' || unit === '\u20ac/mois') return `${value.toLocaleString('fr-FR')} ${unit}`
  if (unit === '%') return `${value}%`
  if (unit === 'jours') return `${value} jours`
  if (unit === 'x') return `${value}x`
  return `${value}`
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DiagnosticGuidePage() {
  const { saveCalculation } = useCalculatorHistory()
  const [mounted, setMounted] = useState(false)
  const [sector, setSector] = useState<SectorKey>('autre')
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState<number | null>(null) // null = phase transition screen
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({})
  const [results, setResults] = useState<Record<string, { value: number; inputs: Record<string, number>}>>({})
  const [skippedSteps, setSkippedSteps] = useState<Set<string>>(new Set())
  const [emailCapturedAfterCash, setEmailCapturedAfterCash] = useState(false)

  // SCORIS engine — drives IDLE → ANALYZING → SUCCESS micro-latency
  const [engineState, engineActions] = useScorisEngine()

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('finsight_sector') as SectorKey | null
    if (saved && saved in SECTOR_BENCHMARKS) setSector(saved)
  }, [])

  const bench = SECTOR_BENCHMARKS[sector]
  const phase = PHASES[phaseIndex]

  // Steps for current pillar phase
  const currentSteps = useMemo(() => {
    if (!phase.pillar) return []
    return WIZARD_STEPS.filter((s) => s.pillar === phase.pillar)
  }, [phase.pillar])

  const currentStep = stepIndex !== null ? currentSteps[stepIndex] : null

  // Live scores
  const liveScores = useMemo(() => computeLiveScores(results, bench), [results, bench])

  const totalScore = useMemo(() => {
    const scored = Object.values(liveScores).filter((s) => s !== null) as number[]
    if (scored.length === 0) return null
    return scored.length === 4
      ? scored.reduce((a, b) => a + b, 0)
      : Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 4)
  }, [liveScores])

  const synthesis = useMemo(() => computeSynthesis(results, liveScores, bench), [results, liveScores, bench])

  // Form handling
  const getFieldValue = useCallback((stepId: string, fieldId: string) => {
    return formValues[stepId]?.[fieldId] || ''
  }, [formValues])

  const setFieldValue = useCallback((stepId: string, fieldId: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [stepId]: { ...prev[stepId], [fieldId]: value },
    }))
  }, [])

  const isStepComplete = useCallback((step: WizardStep) => {
    const vals = formValues[step.id]
    if (!vals) return false
    return step.fields.every((f) => {
      const v = vals[f.id]
      return v && parseFloat(v) > 0
    })
  }, [formValues])

  const submitStep = useCallback((step: WizardStep) => {
    const vals = formValues[step.id] || {}
    const inputs: Record<string, number> = {}
    step.fields.forEach((f) => { inputs[f.id] = parseFloat(vals[f.id]) || 0 })
    const result = step.compute(inputs)

    setResults((prev) => ({ ...prev, [step.id]: { value: result.value, inputs } }))

    // Save to localStorage (same format as calculators)
    saveCalculation({
      type: step.calcType,
      value: result.value,
      inputs,
      unit: result.unit,
    })
  }, [formValues, saveCalculation])

  const handleSectorChange = useCallback((s: SectorKey) => {
    setSector(s)
    localStorage.setItem('finsight_sector', s)
  }, [])

  // Navigation
  const goNext = useCallback(() => {
    if (phase.key === 'intro') {
      setPhaseIndex(1)
      setStepIndex(null)
      return
    }

    if (phase.key === 'synthesis') return

    // Risk phase has no form steps — go directly to next phase
    if (phase.key === 'risk') {
      setStepIndex(null)
      setPhaseIndex((p) => Math.min(p + 1, PHASES.length - 1))
      // Trigger SCORIS analysis engine for micro-latency synthesis
      engineActions.analyze({
        sector,
        results,
        enabledModules: {
          causalAnalysis: true,
          sectorBenchmarks: true,
          whatIfSimulation: true,
        },
      })
      return
    }

    if (stepIndex === null) {
      // Phase transition → first step of this pillar
      setStepIndex(0)
      return
    }

    // Submit current step if complete
    if (currentStep && isStepComplete(currentStep)) {
      submitStep(currentStep)
    }

    // Move to next step or next phase
    if (stepIndex < currentSteps.length - 1) {
      setStepIndex(stepIndex + 1)
    } else {
      // Move to next phase
      setStepIndex(null)
      setPhaseIndex((p) => Math.min(p + 1, PHASES.length - 1))
    }
  }, [phase, stepIndex, currentStep, currentSteps, isStepComplete, submitStep, engineActions, results, sector])

  const goPrev = useCallback(() => {
    if (phase.key === 'intro') return

    if (phase.key === 'synthesis') {
      // Go back to risk phase (narrative, no form)
      const riskIdx = PHASES.findIndex((p) => p.key === 'risk')
      setPhaseIndex(riskIdx)
      setStepIndex(null)
      return
    }

    // Risk phase → go back to last step of resilience
    if (phase.key === 'risk') {
      const resIdx = PHASES.findIndex((p) => p.key === 'resilience')
      const resSteps = WIZARD_STEPS.filter((s) => s.pillar === 'resilience')
      setPhaseIndex(resIdx)
      setStepIndex(resSteps.length - 1)
      return
    }

    if (stepIndex === null) {
      // Phase intro → go back to last step of previous phase
      if (phaseIndex > 1) {
        const prevPhase = PHASES[phaseIndex - 1]
        const prevSteps = WIZARD_STEPS.filter((s) => s.pillar === prevPhase.pillar)
        setPhaseIndex(phaseIndex - 1)
        setStepIndex(prevSteps.length - 1)
      } else {
        setPhaseIndex(0)
        setStepIndex(null)
      }
      return
    }

    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
    } else {
      setStepIndex(null) // back to phase transition
    }
  }, [phase, stepIndex, phaseIndex])

  const skipStep = useCallback(() => {
    if (!currentStep) return
    setSkippedSteps((prev) => new Set(prev).add(currentStep.id))
    // Move forward
    if (stepIndex !== null && stepIndex < currentSteps.length - 1) {
      setStepIndex(stepIndex + 1)
    } else {
      setStepIndex(null)
      setPhaseIndex((p) => Math.min(p + 1, PHASES.length - 1))
    }
  }, [currentStep, stepIndex, currentSteps])

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext])

  if (!mounted) {
    return <div className="min-h-screen bg-slate-950" />
  }

  // Total steps for progress
  const allSteps = WIZARD_STEPS
  const completedStepCount = Object.keys(results).length + skippedSteps.size
  const progressPct = Math.round((completedStepCount / allSteps.length) * 100)

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">

      {/* ── Top bar ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/mon-diagnostic" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Quitter le diagnostic
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">
              Protocole de diagnostic
            </span>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progression du diagnostic : ${progressPct}%`}>
              <div
                className="h-full bg-gray-300 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[11px] text-gray-600 tabular-nums">{progressPct}%</span>
          </div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="flex-1 flex pt-14">

        {/* ── Sidebar: live score ── */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-gray-800/50 bg-slate-950 sticky top-14 h-[calc(100vh-3.5rem)]">
          <div className="flex-1 px-6 py-8 flex flex-col">
            {/* Score live */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                Score FinSight
              </p>
              {totalScore !== null ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-medium text-white">{totalScore}</span>
                  <span className="text-sm text-gray-600 font-medium">/ 100</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-medium text-gray-700">--</span>
                  <span className="text-sm text-gray-600 font-medium">/ 100</span>
                </div>
              )}
            </div>

            {/* Pillar scores */}
            <div className="space-y-3 flex-1">
              {PILLARS.map((p) => {
                const score = liveScores[p.key]
                const Icon = p.icon
                const isActive = phase.pillar === p.key
                return (
                  <div
                    key={p.key}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                      isActive
                        ? `${p.bgMuted} border ${p.borderColor}`
                        : 'border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${p.bgMuted} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${p.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-bold tracking-wide ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {p.label}
                      </p>
                    </div>
                    <span className={`font-serif text-lg font-medium tabular-nums ${
                      score !== null ? 'text-white' : 'text-gray-700'
                    }`}>
                      {score !== null ? score : '--'}
                    </span>
                    <span className="text-[10px] text-gray-600">/25</span>
                  </div>
                )
              })}
            </div>

            {/* Sector */}
            <div className="pt-6 border-t border-gray-800/50">
              <p className="text-[10px] text-gray-600 uppercase tracking-wide mb-2">Secteur</p>
              <p className="text-xs text-gray-400 font-medium">{SECTOR_BENCHMARKS[sector].label}</p>
            </div>
          </div>
        </aside>

        {/* ── Content area ── */}
        <main className="flex-1 flex flex-col min-h-[calc(100vh-3.5rem)]">

          <AnimatePresence mode="wait">
            {/* ── INTRO PHASE ── */}
            {phase.key === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex items-center justify-center px-6"
              >
                <div className="max-w-xl text-center">
                  <p className="text-[11px] text-gray-500 font-medium tracking-[0.2em] uppercase mb-8">
                    Score FinSight
                  </p>
                  <h1 className="font-serif text-4xl lg:text-5xl font-medium leading-tight tracking-tight text-white mb-6">
                    {phase.title}
                  </h1>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {phase.subtitle}
                  </p>
                  <div className="border-l border-gray-700 pl-4 text-left max-w-md mx-auto mb-4">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Ce protocole structure la premiere phase de notre intervention DAF externalisee.
                      Il repose sur la methode FinSight — quatre piliers, neuf indicateurs,
                      chaque ratio positionne face aux medianes sectorielles reelles.
                    </p>
                  </div>
                  {/* Trust signals strip */}
                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 max-w-sm mx-auto mb-10" aria-label="Signaux de confiance">
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <svg className="w-3.5 h-3.5 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      Banque de France 2024
                    </span>
                    <span className="w-px h-3 bg-gray-800 hidden sm:block" aria-hidden="true" />
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <svg className="w-3.5 h-3.5 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      Altares / INSEE
                    </span>
                    <span className="w-px h-3 bg-gray-800 hidden sm:block" aria-hidden="true" />
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <svg className="w-3.5 h-3.5 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      RGPD — 0 donnée transmise
                    </span>
                  </div>

                  {/* Sector selector */}
                  <div className="mb-10">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-3 font-medium">
                      Secteur d'activite
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {(Object.entries(SECTOR_BENCHMARKS) as [SectorKey, SectorBenchmark][]).map(([key, s]) => (
                        <button
                          key={key}
                          onClick={() => handleSectorChange(key)}
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${
                            sector === key
                              ? 'bg-white text-slate-950 border-white'
                              : 'bg-transparent text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={goNext}
                    aria-label="Démarrer le protocole de diagnostic financier"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-200 shadow-lg shadow-white/10"
                  >
                    Démarrer le diagnostic
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <p className="text-[11px] text-gray-600 mt-4">
                    ~7 min &middot; Donn&eacute;es stock&eacute;es localement &middot; Sans inscription
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── PILLAR PHASE: transition screen ── */}
            {phase.pillar && phase.key !== 'risk' && stepIndex === null && (
              <motion.div
                key={`phase-${phase.key}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex items-center justify-center px-6"
              >
                <div className="max-w-lg text-center">
                  {(() => {
                    const pillarMeta = PILLARS.find((p) => p.key === phase.pillar)!
                    const Icon = pillarMeta.icon
                    return (
                      <>
                        <div className={`w-14 h-14 rounded-xl ${pillarMeta.bgMuted} flex items-center justify-center mx-auto mb-6`}>
                          <Icon className={`w-6 h-6 ${pillarMeta.color}`} />
                        </div>
                        <p className={`text-[11px] font-semibold tracking-[0.2em] uppercase mb-4 ${pillarMeta.color}`}>
                          {pillarMeta.label}
                        </p>
                      </>
                    )
                  })()}
                  <h2 className="font-serif text-3xl font-medium leading-tight text-white mb-4">
                    {phase.title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed mb-10">
                    {phase.subtitle}
                  </p>

                  {/* Email capture — shown once on Margin transition (Cash pillar just completed) */}
                  {phase.key === 'margin' && !emailCapturedAfterCash && liveScores.cash !== null && (
                    <div className="mb-10 mx-auto max-w-md">
                      <div className="rounded-xl border border-blue-500/20 bg-blue-950/30 backdrop-blur p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          <p className="text-xs font-semibold text-blue-300">
                            Votre pilier Cash est évalué à {liveScores.cash}/25
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
                          Recevez votre rapport complet par email à la fin du diagnostic
                          — avec les recommandations personnalisées par secteur.
                        </p>
                        <DiagnosticEmailCapture
                          totalScore={liveScores.cash}
                          sector={sector}
                          pillarScores={liveScores}
                          synthesis={{}}
                          results={results}
                        />
                        <button
                          onClick={() => setEmailCapturedAfterCash(true)}
                          className="text-[10px] text-gray-600 hover:text-gray-400 mt-2 transition-colors"
                        >
                          Continuer sans email →
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={goNext}
                    className="group inline-flex items-center gap-3 px-7 py-3.5 bg-white text-slate-950 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Continuer
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── PILLAR PHASE: form step ── */}
            {phase.pillar && phase.key !== 'risk' && stepIndex !== null && currentStep && (
              <motion.div
                key={`step-${currentStep.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex items-center justify-center px-6"
              >
                <div className="max-w-lg w-full">
                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mb-8">
                    {(() => {
                      const pillarMeta = PILLARS.find((p) => p.key === phase.pillar)!
                      return (
                        <span className={`text-[10px] font-semibold tracking-[0.15em] uppercase ${pillarMeta.color}`}>
                          {pillarMeta.label} — {stepIndex + 1}/{currentSteps.length}
                        </span>
                      )
                    })()}
                    {currentStep.optional && (
                      <span className="text-[10px] text-amber-400 border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 rounded-full font-medium">
                        Optionnel — vous pouvez passer
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl lg:text-3xl font-medium leading-tight text-white mb-2">
                    {currentStep.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-8">
                    {currentStep.subtitle}
                  </p>

                  {/* Result inline if already computed */}
                  {results[currentStep.id] && (
                    <div className="mb-6 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Resultat enregistre</span>
                        <span className="font-serif text-lg font-medium text-white">
                          {formatResult(results[currentStep.id].value, currentStep.compute(results[currentStep.id].inputs).unit)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Fields */}
                  <div className="space-y-5">
                    {currentStep.fields.map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={`field-${currentStep.id}-${field.id}`}
                          className="block text-xs font-semibold text-gray-300 mb-2 tracking-wide"
                        >
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            id={`field-${currentStep.id}-${field.id}`}
                            type="number"
                            inputMode="decimal"
                            value={getFieldValue(currentStep.id, field.id)}
                            onChange={(e) => setFieldValue(currentStep.id, field.id, e.target.value)}
                            placeholder={field.placeholder}
                            aria-describedby={field.help ? `help-${currentStep.id}-${field.id}` : undefined}
                            className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/30 outline-none transition-all text-base tabular-nums"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium" aria-hidden="true">
                            {field.suffix}
                          </span>
                        </div>
                        {field.help && (
                          <p id={`help-${currentStep.id}-${field.id}`} className="text-[11px] text-gray-600 mt-1.5">{field.help}</p>
                        )}
                        {/* Benchmark hint — sector-specific reference under each field */}
                        {(() => {
                          const hint = getBenchmarkHint(currentStep.id, bench)
                          if (!hint) return null
                          return (
                            <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
                              <Activity className="w-3 h-3 text-gray-600 shrink-0" />
                              <span>
                                {hint.label} : <span className="text-gray-400 font-medium">{hint.median}</span>
                                <span className="mx-1.5 text-gray-700">·</span>
                                <span className="text-amber-500/70">{hint.critical}</span>
                              </span>
                            </div>
                          )
                        })()}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-10">
                    <button
                      onClick={goPrev}
                      className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      Retour
                    </button>

                    <div className="flex items-center gap-3">
                      {currentStep.optional && (
                        <button
                          onClick={skipStep}
                          className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
                        >
                          Passer
                        </button>
                      )}
                      <button
                        onClick={goNext}
                        disabled={!isStepComplete(currentStep) && !currentStep.optional}
                        className={`group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                          isStepComplete(currentStep)
                            ? 'bg-white text-slate-950 hover:bg-gray-100'
                            : currentStep.optional
                            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {stepIndex === currentSteps.length - 1 ? 'Valider et continuer' : 'Suivant'}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Keyboard hint */}
                  <p className="text-center text-[10px] text-gray-700 mt-6">
                    Appuyez sur Entree pour continuer
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── PHASE TRANSITION (between pillars) ── */}
            {phase.pillar && stepIndex === null && phaseIndex > 1 && PHASES[phaseIndex - 1].transition && (
              <motion.div
                key={`transition-${phase.key}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <p className="text-sm text-gray-500 italic max-w-md text-center">
                  {PHASES[phaseIndex - 1].transition}
                </p>
              </motion.div>
            )}

            {/* ── RISK PHASE: narrative analysis (no form) ── */}
            {phase.key === 'risk' && (
              <motion.div
                key="risk-analysis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex items-center justify-center px-6"
              >
                <div className="max-w-xl w-full">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  </div>
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4 text-amber-400">
                    RISQUES
                  </p>
                  <h2 className="font-serif text-3xl font-medium leading-tight text-white mb-3">
                    Croisements critiques
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-8">
                    Ce pilier ne repose pas sur un indicateur isole. Il croise vos donnees
                    pour detecter les combinaisons de fragilite structurelle.
                  </p>

                  {/* Cross-analysis grid */}
                  <div className="space-y-3 mb-10">
                    {/* DSO × Marge */}
                    {results.dso && results.marge && (
                      <div className={`px-4 py-3.5 rounded-lg border ${
                        results.dso.value > bench.dsoMedian && results.marge.value < bench.margeMedian
                          ? 'bg-red-500/5 border-red-500/20'
                          : 'bg-gray-800/30 border-gray-700/50'
                      }`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-semibold text-gray-300">DSO × Marge</p>
                          {results.dso.value > bench.dsoMedian && results.marge.value < bench.margeMedian ? (
                            <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Double pression</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">Maitrise</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {results.dso.value > bench.dsoMedian && results.marge.value < bench.margeMedian
                            ? `DSO ${results.dso.value}j au-dessus de la mediane (${bench.dsoMedian}j) et marge ${results.marge.value}% sous la mediane (${bench.margeMedian}%) — encaissements lents sur marge faible, double pression sur le cash.`
                            : `DSO ${results.dso.value}j et marge ${results.marge.value}% — pas de pression croisee detectee.`
                          }
                        </p>
                      </div>
                    )}

                    {/* BFR × Seuil */}
                    {results.bfr && results['seuil-rentabilite'] && (
                      <div className={`px-4 py-3.5 rounded-lg border ${
                        results.bfr.inputs.ca && results.bfr.inputs.ca > 0 &&
                        Math.round((results.bfr.value / results.bfr.inputs.ca) * 365) > bench.bfrJoursMedian &&
                        (results['seuil-rentabilite'].inputs.tauxMarge || 0) < bench.margeFaible
                          ? 'bg-red-500/5 border-red-500/20'
                          : 'bg-gray-800/30 border-gray-700/50'
                      }`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-semibold text-gray-300">BFR × Taux de marge</p>
                          {results.bfr.inputs.ca && results.bfr.inputs.ca > 0 &&
                           Math.round((results.bfr.value / results.bfr.inputs.ca) * 365) > bench.bfrJoursMedian &&
                           (results['seuil-rentabilite'].inputs.tauxMarge || 0) < bench.margeFaible ? (
                            <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Fragilite structurelle</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">Maitrise</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {(() => {
                            const bfrJ = results.bfr.inputs.ca && results.bfr.inputs.ca > 0
                              ? Math.round((results.bfr.value / results.bfr.inputs.ca) * 365)
                              : null
                            const tm = results['seuil-rentabilite'].inputs.tauxMarge || 0
                            if (bfrJ && bfrJ > bench.bfrJoursMedian && tm < bench.margeFaible)
                              return `BFR a ${bfrJ}j de CA (mediane ${bench.bfrJoursMedian}j) avec un taux de marge de ${tm}% (seuil critique ${bench.margeFaible}%) — le cycle d'exploitation absorbe plus de cash que la marge ne peut en generer.`
                            return `BFR et taux de marge dans des niveaux compatibles — pas de fragilite croisee detectee.`
                          })()}
                        </p>
                      </div>
                    )}

                    {/* Burn rate × CA */}
                    {results['burn-rate'] && (results.bfr?.inputs.ca || results.dso?.inputs.ca) && (
                      <div className={`px-4 py-3.5 rounded-lg border ${
                        (() => {
                          const ca = results.bfr?.inputs.ca || results.dso?.inputs.ca || 0
                          const pct = ca > 0 ? (results['burn-rate'].value / (ca / 12)) * 100 : 0
                          return pct > 90 ? 'bg-red-500/5 border-red-500/20' : 'bg-gray-800/30 border-gray-700/50'
                        })()
                      }`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-semibold text-gray-300">Burn Rate × CA mensuel</p>
                          {(() => {
                            const ca = results.bfr?.inputs.ca || results.dso?.inputs.ca || 0
                            const pct = ca > 0 ? Math.round((results['burn-rate'].value / (ca / 12)) * 100) : 0
                            return pct > 90 ? (
                              <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Structure deficitaire</span>
                            ) : pct > 70 ? (
                              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Tension</span>
                            ) : (
                              <span className="text-[10px] font-semibold text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">Maitrise</span>
                            )
                          })()}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {(() => {
                            const ca = results.bfr?.inputs.ca || results.dso?.inputs.ca || 0
                            const pct = ca > 0 ? Math.round((results['burn-rate'].value / (ca / 12)) * 100) : 0
                            if (pct > 90) return `Consommation mensuelle a ${pct}% du CA — les charges depassent la capacite de generation, runway limite.`
                            if (pct > 70) return `Consommation mensuelle a ${pct}% du CA — peu de marge de manoeuvre en cas d'aleas.`
                            return `Consommation mensuelle a ${pct}% du CA — niveau maitrise.`
                          })()}
                        </p>
                      </div>
                    )}

                    {/* No data fallback */}
                    {!results.dso && !results.bfr && !results.marge && (
                      <div className="px-4 py-3.5 rounded-lg bg-gray-800/30 border border-gray-700/50">
                        <p className="text-[11px] text-gray-500">
                          Donnees insuffisantes pour les croisements. Le pilier Risques sera calcule
                          a partir des indicateurs renseignes dans les piliers precedents.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Score risk live */}
                  {liveScores.risk !== null && (
                    <div className="flex items-center gap-4 px-4 py-3 rounded-lg bg-amber-500/5 border border-amber-500/10 mb-10">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Score Risques</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="font-serif text-2xl font-medium text-white">{liveScores.risk}</span>
                          <span className="text-xs text-gray-600">/25</span>
                        </div>
                      </div>
                      <div className="flex-1 ml-4">
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {liveScores.risk >= 20
                            ? 'Aucune combinaison critique detectee. Profil de risque maitrise.'
                            : liveScores.risk >= 15
                            ? 'Signaux de vigilance identifies. Pas de fragilite structurelle majeure.'
                            : liveScores.risk >= 10
                            ? 'Plusieurs pressions croisees detectees. Attention au cumul.'
                            : 'Combinaisons de fragilite multiples. Intervention prioritaire.'
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={goPrev}
                      className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      Retour
                    </button>
                    <button
                      onClick={goNext}
                      className="group inline-flex items-center gap-3 px-7 py-3.5 bg-white text-slate-950 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      Voir la synthese
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SYNTHESIS — ANALYZING OVERLAY (micro-latency) ── */}
            {phase.key === 'synthesis' && engineState.status === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex items-center justify-center px-6"
              >
                <div className="max-w-md text-center">
                  {/* Animated pulse ring */}
                  <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full bg-white/5 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="absolute inset-2 rounded-full bg-white/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
                    <div className="relative w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 font-medium tracking-[0.2em] uppercase mb-3">
                    Analyse en cours
                  </p>
                  <h2 className="font-serif text-2xl font-medium text-white mb-4">
                    {engineState.statusMessage || 'Initialisation…'}
                  </h2>

                  {/* Progress bar */}
                  <div className="w-64 mx-auto mb-4">
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${engineState.progress}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2 tabular-nums">
                      {engineState.progress}%
                    </p>
                  </div>

                  {/* Step dots */}
                  <div className="flex items-center justify-center gap-2">
                    {(['scoring', 'benchmarking', 'causal', 'simulation', 'enrichment', 'synthesis'] as AnalysisStep[]).map((step) => {
                      const isActive = engineState.currentStep === step
                      const isDone = engineState.report?.meta.stepsCompleted.includes(step) ?? false
                      return (
                        <div
                          key={step}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            isActive ? 'bg-white scale-125' :
                            isDone ? 'bg-gray-500' :
                            'bg-gray-800'
                          }`}
                        />
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SYNTHESIS ── */}
            {phase.key === 'synthesis' && engineState.status !== 'analyzing' && (
              <motion.div
                key="synthesis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 px-6 py-12 overflow-y-auto"
              >
                <div className="max-w-2xl mx-auto">
                  <p className="text-[11px] text-gray-500 font-medium tracking-[0.2em] uppercase mb-6">
                    Synthese
                  </p>
                  <h2 className="font-serif text-3xl lg:text-4xl font-medium leading-tight text-white mb-2">
                    Lecture strategique
                  </h2>
                  <p className="text-gray-500 mb-10">
                    Resultat consolide de votre diagnostic
                  </p>

                  {/* Executive Summary — DAF Virtuel typing animation */}
                  {engineState.report?.executiveSummary && (
                    <ExecutiveSummary
                      text={engineState.report.executiveSummary}
                      enrichedByTresoris={engineState.report.meta.enrichedBy.includes('tresoris')}
                      className="mb-10"
                    />
                  )}

                  {/* Score */}
                  <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-800">
                    <div>
                      {synthesis.total !== null ? (
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-6xl font-medium text-white">{synthesis.total}</span>
                          <span className="text-lg text-gray-600 font-medium">/ 100</span>
                        </div>
                      ) : (
                        <span className="font-serif text-6xl font-medium text-gray-700">--</span>
                      )}
                      <p className={`text-sm font-semibold mt-2 ${synthesis.levelColor}`}>
                        {synthesis.level}
                      </p>
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      {PILLARS.map((p) => {
                        const s = liveScores[p.key]
                        return (
                          <div key={p.key} className={`text-center px-2 py-3 rounded-lg ${p.bgMuted} border ${p.borderColor}`}>
                            <p className={`text-[10px] font-bold tracking-wider ${p.color}`}>{p.label}</p>
                            <p className="font-serif text-xl font-medium text-white mt-1">
                              {s !== null ? s : '--'}
                            </p>
                            <p className="text-[10px] text-gray-600">/25</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Forces */}
                  {synthesis.forces.length > 0 && (
                    <div className="mb-8">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                        Forces identifiees
                      </p>
                      <div className="space-y-2">
                        {synthesis.forces.map((f, i) => (
                          <div key={i} className="flex items-start gap-3 px-4 py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-300 leading-snug">{f}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vulnerabilites */}
                  {synthesis.vulnerabilites.length > 0 && (
                    <div className="mb-8">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                        Vulnerabilites
                      </p>
                      <div className="space-y-2">
                        {synthesis.vulnerabilites.map((v, i) => (
                          <div key={i} className="flex items-start gap-3 px-4 py-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-300 leading-snug">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Priorite */}
                  <div className="mb-8">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                      Priorite d'action
                    </p>
                    <div className="px-4 py-4 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-sm text-white leading-relaxed">{synthesis.priorite}</p>
                    </div>
                  </div>

                  {/* Cash impact */}
                  {synthesis.cashImpact && (
                    <div className="mb-10">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                        Impact cash immobilise
                      </p>
                      <div className="px-4 py-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                        <p className="text-sm text-blue-300">{synthesis.cashImpact}</p>
                      </div>
                    </div>
                  )}

                  {/* Sector Comparison — benchmark positioning */}
                  {engineState.report && engineState.report.sectorComparisons.length > 0 && (
                    <div className="mb-10 px-5 py-5 bg-white/[0.02] border border-white/10 rounded-lg">
                      <SectorComparisonGrid comparisons={engineState.report.sectorComparisons} />
                    </div>
                  )}

                  {/* What-If Simulation sliders */}
                  {totalScore !== null && (
                    <div className="mb-10 px-5 py-5 bg-white/[0.02] border border-white/10 rounded-lg">
                      <WhatIfSlider
                        results={results}
                        sector={sector}
                        currentScore={{
                          total: totalScore,
                          pillars: {
                            cash: { score: liveScores.cash, max: 25, calculators: [], label: 'CASH', sublabel: '', color: '', borderColor: '', bgColor: '' },
                            margin: { score: liveScores.margin, max: 25, calculators: [], label: 'MARGIN', sublabel: '', color: '', borderColor: '', bgColor: '' },
                            resilience: { score: liveScores.resilience, max: 25, calculators: [], label: 'RÉSILIENCE', sublabel: '', color: '', borderColor: '', bgColor: '' },
                            risk: { score: liveScores.risk, max: 25, calculators: [], label: 'RISQUES', sublabel: '', color: '', borderColor: '', bgColor: '' },
                          },
                          level: totalScore >= 75 ? 'excellent' : totalScore >= 55 ? 'bon' : totalScore >= 35 ? 'vigilance' : 'action',
                          confidence: Object.values(liveScores).filter(s => s !== null).length >= 4 ? 'haute' : 'moyenne',
                          completedPillars: Object.values(liveScores).filter(s => s !== null).length,
                        }}
                      />
                    </div>
                  )}

                  {/* Causal Insights — cross-pillar causal chains */}
                  {engineState.report && engineState.report.causalInsights.length > 0 && (
                    <div className="mb-10">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                        Analyse causale
                      </p>
                      <div className="space-y-2">
                        {engineState.report.causalInsights.map((insight) => (
                          <div
                            key={insight.id}
                            className={`px-4 py-3 rounded-lg border ${
                              insight.severity === 'critical' ? 'bg-red-500/5 border-red-500/15' :
                              insight.severity === 'danger' ? 'bg-amber-500/5 border-amber-500/15' :
                              'bg-white/[0.02] border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                insight.severity === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                insight.severity === 'danger' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-gray-700/50 text-gray-400 border-gray-600/30'
                              }`}>
                                {insight.source.label} → {insight.target.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">{insight.impact.description}</p>
                            {insight.impact.estimatedEuros && (
                              <p className="text-[11px] text-amber-400/80 mt-1 font-medium">
                                Impact estimé : {(insight.impact.estimatedEuros / 1000).toFixed(0)} k€
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Levers — actionable recommendations */}
                  {synthesis.levers && synthesis.levers.length > 0 && (
                    <div className="mb-10">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                        Leviers d'action prioritaires
                      </p>
                      <div className="space-y-2">
                        {synthesis.levers.map((lever: SynthesisLever, i: number) => (
                          <div key={lever.id || i} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                lever.type === 'cash' ? 'bg-blue-500/20 text-blue-400' :
                                lever.type === 'margin' ? 'bg-emerald-500/20 text-emerald-400' :
                                'bg-purple-500/20 text-purple-400'
                              }`}>
                                {i + 1}
                              </span>
                              <p className="text-sm font-semibold text-white">{lever.label}</p>
                            </div>
                            <p className="text-xs text-gray-400 ml-7 leading-relaxed">{lever.detail}</p>
                            <p className="text-[11px] text-amber-400/80 ml-7 mt-1 font-medium">{lever.impact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lecture dirigeant */}
                  {synthesis.total !== null && (
                    <div className="mb-10 px-5 py-5 bg-white/[0.03] border border-white/10 rounded-lg">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                        Lecture dirigeant
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {synthesis.total >= 75
                          ? 'Votre structure financiere est saine. Les fondamentaux sont en place pour absorber un aleas ou financer une phase de croissance. L\'enjeu n\'est plus la survie — c\'est l\'optimisation des leviers existants.'
                          : synthesis.total >= 55
                          ? 'Les indicateurs sont globalement positifs, mais certaines zones meritent une attention structurelle. Sans correction, un retournement de cycle ou un retard client majeur pourrait mettre la tresorerie sous tension a 6 mois.'
                          : synthesis.total >= 35
                          ? 'Plusieurs indicateurs signalent des fragilites croisees. Si rien n\'est fait, la trajectoire cash a 6 mois est sous tension. L\'enjeu est d\'identifier les 2-3 leviers a activer en priorite avant que les effets ne se cumulent.'
                          : 'Le diagnostic revele des tensions structurelles sur plusieurs piliers. Sans intervention rapide, le cumul des pressions — delais, marge, BFR — reduit significativement la marge de manoeuvre. Un plan d\'action priorise est necessaire dans les 30 jours.'
                        }
                      </p>
                    </div>
                  )}

                  {/* Guide Download CTA */}
                  <GuideDownloadCTA score={totalScore} className="mb-10" />

                  {/* Separator */}
                  <div className="border-t border-gray-800 pt-10 mb-10">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-2">
                      Limite de ce diagnostic
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-md">
                      Ce score repose sur les donnees declaratives saisies et les medianes sectorielles publiques
                      (Banque de France 2024, Altares). Il constitue un premier niveau de lecture.
                      Les resultats doivent etre interpretes en tenant compte de la saisonnalite eventuelle de l'activite.
                      Passer d'un diagnostic a un plan d'action priorise necessite un audit approfondi.
                    </p>
                  </div>

                  {/* CTAs — mission first, outil second */}
                  <div className="space-y-3">

                    {/* Opt-in rapport email + Flash Finance Hebdo */}
                    <DiagnosticEmailCapture
                      totalScore={totalScore ?? 0}
                      sector={sector}
                      pillarScores={liveScores}
                      synthesis={synthesis as unknown as Record<string, unknown>}
                      results={results}
                    />

                    {/* Contextual CTA — adapté selon le score */}
                    {(() => {
                      const cta = getContextualCTA(totalScore)
                      return (
                        <a
                          href={cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group flex items-center justify-between w-full px-6 py-5 rounded-lg transition-all ${
                            cta.urgency === 'high'
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : cta.urgency === 'medium'
                              ? 'bg-white text-slate-950 hover:bg-gray-100'
                              : 'bg-white text-slate-950 hover:bg-gray-100'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold">{cta.label}</p>
                            <p className={`text-xs mt-0.5 ${
                              cta.urgency === 'high' ? 'text-red-100' : 'text-gray-500'
                            }`}>
                              {cta.sublabel}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-xs font-bold ${
                              cta.urgency === 'high' ? 'text-white' : 'text-gray-400'
                            }`}>{cta.price}</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </a>
                      )
                    })()}

                    <Link
                      href="/consulting"
                      className="group flex items-center justify-between w-full px-6 py-4 bg-transparent border border-gray-700 rounded-lg hover:border-gray-500 transition-all"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">Audit complet et pilotage financier</p>
                        <p className="text-xs text-gray-500 mt-0.5">Rapport detaille sous 72h + plan d'action priorise + accompagnement</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors flex-shrink-0" />
                    </Link>

                    <Link
                      href="/mon-diagnostic"
                      className="group flex items-center justify-between w-full px-6 py-3 bg-transparent border border-gray-800/50 rounded-lg hover:border-gray-700 transition-all"
                    >
                      <div>
                        <p className="text-xs font-medium text-gray-400">Score sauvegardé — consulter le tableau de bord complet</p>
                        <p className="text-[11px] text-gray-600 mt-0.5">Piliers détaillés, historique, analyses manquantes — accessible à tout moment</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                    </Link>

                    <div className="flex items-center gap-3 pt-2">
                      <Link
                        href="/methodologie"
                        className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors underline underline-offset-2"
                      >
                        Comprendre la methodologie du Score
                      </Link>
                      <span className="text-gray-800 text-[10px]">&middot;</span>
                      <Link
                        href="/pilotage-financier-pme"
                        className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors underline underline-offset-2"
                      >
                        Guide du pilotage financier PME
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile score bar ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-sm border-t border-gray-800/50 px-4 py-3 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-400 font-medium">Score</span>
            <span className="font-serif text-lg font-medium text-white tabular-nums">
              {totalScore !== null ? totalScore : '--'}
            </span>
            <span className="text-xs text-gray-600">/100</span>
          </div>
          <div className="flex items-center gap-2">
            {PILLARS.map((p) => {
              const s = liveScores[p.key]
              return (
                <div key={p.key} className={`w-8 h-8 rounded ${p.bgMuted} flex items-center justify-center`}>
                  <span className={`text-[10px] font-bold tabular-nums ${s !== null ? 'text-white' : 'text-gray-700'}`}>
                    {s !== null ? s : '--'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Suspense, useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
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
  FileText,
} from 'lucide-react'
import { useCalculatorHistory, type CalculatorType } from '@/hooks/useCalculatorHistory'
import {
  type SectorKey,
  type SectorBenchmark,
  type PillarKey,
  type SynthesisLever,
  type ScorisLevel,
  type WizardResults,
  SECTOR_BENCHMARKS,
  computeLiveScores,
  computeSynthesis,
  getContextualCTA,
  computeDiagnosticScore,
  computeInsights,
  computeZScore,
  countWords,
} from '@/lib/scoring/diagnosticScore'
import { generateDiagnosticPDF } from '@/lib/pdf/generateDiagnosticPDF'
import type { StrategiqueContextPayload } from '@/lib/opus-engine'
import { useScorisEngine } from '@/hooks/useScorisEngine'
import { SectorComparisonGrid } from '@/components/diagnostic/SectorComparisonBadge'
import { WhatIfSlider } from '@/components/diagnostic/WhatIfSlider'
import { ExecutiveSummary } from '@/components/diagnostic/ExecutiveSummary'
import { GuideDownloadCTA } from '@/components/diagnostic/GuideDownloadCTA'
import { FECDropzone } from '@/components/diagnostic/FECDropzone'
import type { FECExtractedData, FECWizardData } from '@/lib/scoris/fecParser'
import type { AnalysisStep } from '@/lib/scoris/types'
import { ANALYSIS_STEP_LABELS } from '@/lib/scoris/types'
import ScorePaywall from '@/components/diagnostic/ScorePaywall'
import { FreePreviewReminderBanner } from '@/components/diagnostic/FreePreviewReminderBanner'

const TOTAL_CALCULATORS = 10

// ---------------------------------------------------------------------------
// DiagnosticEmailCapture — email opt-in + newsletter (rendered inside guide)
// ---------------------------------------------------------------------------
interface DiagnosticEmailCaptureProps {
  totalScore: number
  sector: string
  pillarScores: Record<string, number | null>
  synthesis: Record<string, unknown>
  results: WizardResults
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
  question?: string
  placeholder: string
  suffix: string
  help?: string
  required?: boolean
  type?: 'number' | 'toggle' | 'textarea' | 'choice'
  options?: { label: string; value: string }[]
  showWhen?: { fieldId: string; value: string }
  /** Limite pour textarea (questions stratégiques) */
  maxWords?: number
}

interface WizardStep {
  id: string
  calcType?: CalculatorType
  title: string
  subtitle: string
  pillar: PillarKey
  fields: WizardField[]
  compute: (inputs: Record<string, number | string>) => { value: number; unit: string }
  optional?: boolean
  /** Affichage pilier pour SCORIS Stratégique (Z-SCORE, SWOT, …) */
  strategicTag?: string
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'company',
    title: 'Votre entreprise',
    subtitle: 'Une base simple pour calibrer tout le diagnostic.',
    pillar: 'cash',
    fields: [
      {
        id: 'caAnnuel',
        label: 'Chiffre d\'affaires annuel',
        question: 'Quel est votre chiffre d\'affaires annuel ?',
        placeholder: 'Ex: 850 000',
        suffix: '€ / an',
        help: 'Une estimation suffit — votre dernier bilan ou votre intuition',
        required: true,
      },
    ],
    compute: (inputs) => ({ value: Math.round(Number(inputs.caAnnuel ?? 0)), unit: '€' }),
  },
  {
    id: 'dso',
    calcType: 'dso',
    title: 'Vos clients vous paient comment ?',
    subtitle: 'Lecture rapide de votre cycle d\'encaissement et paiement.',
    pillar: 'cash',
    fields: [
      {
        id: 'joursClients',
        label: 'Délai de paiement clients',
        question: 'En moyenne, vos clients vous règlent en combien de jours ?',
        placeholder: 'Ex: 45',
        suffix: 'jours',
        help: 'Regardez votre dernière facture envoyée',
        required: true,
      },
      {
        id: 'joursFournisseurs',
        label: 'Délai de paiement fournisseurs',
        question: 'Vous payez vos fournisseurs en combien de jours ?',
        placeholder: 'Ex: 30',
        suffix: 'jours',
        required: true,
      },
      {
        id: 'soldeBancaire',
        label: 'Solde bancaire',
        question: 'Quel est votre solde bancaire ce matin ?',
        placeholder: 'Approximatif — votre relevé bancaire',
        suffix: '€',
        required: false,
      },
    ],
    compute: (inputs) => ({ value: Math.round(Number(inputs.joursClients ?? 0)), unit: 'jours' }),
  },
  {
    id: 'seuil-rentabilite',
    calcType: 'seuil-rentabilite',
    title: 'Votre rentabilité',
    subtitle: 'Marge et charges fixes pour situer votre seuil de confort.',
    pillar: 'margin',
    fields: [
      {
        id: 'margeBrute',
        label: 'Marge brute',
        question: 'Sur 100 € encaissés, combien vous reste-t-il après vos coûts directs ?',
        placeholder: 'Ex: 35',
        suffix: '%',
        help: 'Coûts directs = matières, sous-traitants, achats liés à votre activité',
        required: true,
      },
      {
        id: 'chargesFixesMensuelles',
        label: 'Charges fixes mensuelles',
        question: 'Vos charges fixes mensuelles ?',
        placeholder: 'Ex: 12 000',
        suffix: '€ / mois',
        help: 'Loyer + salaires fixes + abonnements',
        required: true,
      },
    ],
    compute: (inputs) => {
      const margeBrute = Number(inputs.margeBrute ?? 0)
      const chargesFixesMensuelles = Number(inputs.chargesFixesMensuelles ?? 0)
      const seuilRentabilite = margeBrute > 0 ? Math.round((chargesFixesMensuelles * 12) / (margeBrute / 100)) : 0
      return { value: seuilRentabilite, unit: '€' }
    },
  },
  {
    id: 'gearing',
    calcType: 'gearing',
    title: 'Votre solidité',
    subtitle: 'Dépendance client, base clients et niveau de dette.',
    pillar: 'resilience',
    fields: [
      {
        id: 'concentrationClient',
        label: 'Concentration client',
        question: 'Votre plus gros client représente quel % de votre CA ?',
        placeholder: 'Ex: 40',
        suffix: '%',
        help: 'Si vous avez beaucoup de petits clients, mettez un chiffre faible',
        required: true,
      },
      {
        id: 'nombreClients',
        label: 'Nombre de clients actifs',
        question: 'Combien avez-vous de clients actifs en ce moment ?',
        placeholder: 'Ex: 8',
        suffix: 'clients',
        required: true,
      },
      {
        id: 'hasDetteBancaire',
        label: 'Emprunts bancaires',
        question: 'Avez-vous des emprunts bancaires en cours ?',
        placeholder: '',
        suffix: '',
        required: false,
        type: 'toggle',
        options: [
          { label: 'Non', value: '0' },
          { label: 'Oui', value: '1' },
        ],
      },
      {
        id: 'detteBancaire',
        label: 'Montant total restant dû',
        question: 'Montant total restant dû ?',
        placeholder: 'Ex: 80 000',
        suffix: '€',
        required: false,
        showWhen: { fieldId: 'hasDetteBancaire', value: '1' },
      },
    ],
    compute: (inputs) => {
      const caAnnuel = Number(inputs.caAnnuel || 0)
      const margeBrute = Number(inputs.margeBrute || 0)
      const detteBancaire = Number(inputs.detteBancaire || 0)
      const denom = caAnnuel > 0 && margeBrute > 0 ? caAnnuel * (margeBrute / 100) : 0
      const gearing = denom > 0 && detteBancaire > 0 ? Math.round((detteBancaire / denom) * 100) / 100 : 0
      return { value: gearing, unit: 'x' }
    },
  },
]

const STRATEGIC_WIZARD_STEPS: WizardStep[] = [
  {
    id: 'strategic-actif-total',
    title: 'Actif total',
    subtitle: 'Indicateur de structure pour le Z-Score Altman.',
    pillar: 'risk',
    strategicTag: 'Z-SCORE',
    fields: [
      {
        id: 'actifTotal',
        label: 'Valeur totale de vos actifs',
        question: 'Quelle est la valeur approximative de vos actifs ?',
        placeholder: 'Ex: 450 000',
        suffix: '€',
        help: 'Immobilisations + stocks + créances + trésorerie — disponible sur votre bilan',
        required: true,
      },
    ],
    compute: (inputs) => ({ value: Math.round(Number(inputs.actifTotal || 0)), unit: '€' }),
  },
  {
    id: 'strategic-capitaux',
    title: 'Capitaux propres',
    subtitle: 'Ratio fonds propres / dettes pour le Z-Score.',
    pillar: 'risk',
    strategicTag: 'Z-SCORE',
    fields: [
      {
        id: 'capitauxPropres',
        label: 'Capitaux propres',
        question: 'Quel est le montant de vos capitaux propres ?',
        placeholder: 'Ex: 120 000',
        suffix: '€',
        help: "Ligne 'Capitaux propres' de votre bilan — peut être négatif",
        required: true,
      },
    ],
    compute: (inputs) => ({ value: Math.round(Number(inputs.capitauxPropres || 0)), unit: '€' }),
  },
  {
    id: 'strategic-swot-force',
    title: 'Avantage concurrentiel',
    subtitle: 'Analyse SWOT — lecture IA du rapport stratégique.',
    pillar: 'risk',
    strategicTag: 'SWOT',
    fields: [
      {
        id: 'swotForce',
        label: 'Votre avantage concurrentiel',
        question: 'Pourquoi vos clients vous choisissent-ils plutôt qu\'un concurrent ?',
        placeholder:
          'Ex: Notre délai de livraison est 2x plus rapide que nos concurrents...',
        suffix: '',
        required: true,
        type: 'textarea',
        maxWords: 150,
      },
    ],
    compute: (inputs) => ({
      value: countWords(String(inputs.swotForce ?? '')),
      unit: 'mots',
    }),
  },
  {
    id: 'strategic-swot-menace',
    title: 'Menace externe',
    subtitle: 'Analyse SWOT — contexte marché.',
    pillar: 'risk',
    strategicTag: 'SWOT',
    fields: [
      {
        id: 'swotMenace',
        label: 'Principale menace externe',
        question: 'Quelle est la principale menace sur votre activité en ce moment ?',
        placeholder:
          'Ex: Un concurrent low-cost est entré sur notre marché...',
        suffix: '',
        required: true,
        type: 'textarea',
        maxWords: 150,
      },
    ],
    compute: (inputs) => ({
      value: countWords(String(inputs.swotMenace ?? '')),
      unit: 'mots',
    }),
  },
  {
    id: 'strategic-objectif',
    title: 'Horizon 12 mois',
    subtitle: 'Alignement stratégique — Porter & valorisation.',
    pillar: 'risk',
    strategicTag: 'STRATÉGIE',
    fields: [
      {
        id: 'objectif12mois',
        label: 'Votre objectif 12 mois',
        question: 'Quel est votre objectif principal pour les 12 prochains mois ?',
        placeholder: '',
        suffix: '',
        required: true,
        type: 'choice',
        options: [
          { label: 'Stabiliser et sécuriser la trésorerie', value: 'Stabiliser et sécuriser la trésorerie' },
          { label: 'Croître le CA de +20% minimum', value: 'Croître le CA de +20% minimum' },
          {
            label: 'Préparer une levée de fonds ou un crédit bancaire',
            value: 'Préparer une levée de fonds ou un crédit bancaire',
          },
          { label: 'Préparer la transmission ou la cession', value: 'Préparer la transmission ou la cession' },
        ],
      },
    ],
    compute: (inputs) => ({ value: 1, unit: '' }),
  },
]

// ---------------------------------------------------------------------------
// Wizard phases (narrative blocks)
// ---------------------------------------------------------------------------

type PhaseKey = 'intro' | 'cash' | 'margin' | 'resilience' | 'strategic' | 'risk' | 'synthesis'

interface Phase {
  key: PhaseKey
  pillar?: PillarKey
  title: string
  subtitle: string
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
  },
  {
    key: 'margin',
    pillar: 'margin',
    title: 'Pilier II — Rentabilite et Performance',
    subtitle: 'Structure de couts, seuil de rentabilite et retour sur investissement.',
  },
  {
    key: 'resilience',
    pillar: 'resilience',
    title: 'Pilier III — Stabilite Structurelle',
    subtitle: 'Capacite beneficiaire et perennite du modele economique.',
  },
  {
    key: 'strategic',
    title: 'SCORIS Stratégique',
    subtitle:
      'Z-Score Altman, lecture SWOT et objectifs — quelques étapes supplémentaires avant la synthèse.',
  },
  {
    key: 'risk',
    pillar: 'risk',
    title: 'Pilier IV — Croisements critiques',
    subtitle: 'Detection des combinaisons de fragilite entre vos indicateurs.',
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

function getWizardFieldHint(stepId: string, fieldId: string, bench: SectorBenchmark): string | null {
  if (stepId === 'dso') {
    if (fieldId === 'joursClients') return `Médiane ${bench.label} : ${bench.dsoMedian}j · Seuil critique : ${bench.dsoBad}j`
    if (fieldId === 'soldeBancaire') return 'Approximatif — votre relevé bancaire ce matin'
    return null
  }
  if (stepId === 'gearing') {
    if (fieldId === 'concentrationClient') return 'Seuil vigilance : 40% · Seuil critique : 60%'
    if (fieldId === 'nombreClients') return 'Plus vous avez de clients, moins vous êtes exposé'
    return null
  }
  return null
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function DiagnosticGuideContent() {
  const { saveCalculation, history, completedTypes } = useCalculatorHistory()
  const [mounted, setMounted] = useState(false)
  const [scorisLevel, setScorisLevel] = useState<ScorisLevel | null>(null)
  const [sector, setSector] = useState<SectorKey>('autre')
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState<number | null>(null) // null = phase transition screen
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({})
  const [results, setResults] = useState<WizardResults>({})
  const [skippedSteps, setSkippedSteps] = useState<Set<string>>(new Set())
  const [emailCapturedAfterCash, setEmailCapturedAfterCash] = useState(false)
  const [introMode, setIntroMode] = useState<'choose' | 'fec'>('choose') // 'choose' = Option A/B, 'fec' = FEC dropzone expanded
  const [paywallUnlocked, setPaywallUnlocked] = useState(false)

  const [fecMeta, setFecMeta] = useState<{
    source: string
    fileName: string
    nbEcritures: number
    dateDebut: string
    dateFin: string
    dataQuality: number
  } | null>(null)

  const [hasDownloadedFreeReport, setHasDownloadedFreeReport] = useState(false)
  const [freePreviewBannerDismissed, setFreePreviewBannerDismissed] = useState(false)
  const [freePreviewBannerVisible, setFreePreviewBannerVisible] = useState(false)
  const [generatingPreviewPdf, setGeneratingPreviewPdf] = useState(false)
  const freePreviewBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (freePreviewBannerTimerRef.current) clearTimeout(freePreviewBannerTimerRef.current)
    }
  }, [])

  const scrollToScorisPaywall = useCallback(() => {
    document.getElementById('scoris-paywall')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const dismissFreePreviewBanner = useCallback(() => {
    setFreePreviewBannerDismissed(true)
    setFreePreviewBannerVisible(false)
    if (freePreviewBannerTimerRef.current) {
      clearTimeout(freePreviewBannerTimerRef.current)
      freePreviewBannerTimerRef.current = null
    }
  }, [])

  // Detect Stripe success redirect and verify payment server-side
  const searchParams = useSearchParams()
  useEffect(() => {
    const success = searchParams?.get('success') === 'true'
    const sessionId = searchParams?.get('session_id')
    if (!success || !sessionId) return

    const verifySession = async () => {
      try {
        const res = await fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`)
        if (!res.ok) return
        const data = await res.json()
        if (data?.verified === true) {
          setPaywallUnlocked(true)
        }
      } catch {
        // No unlock on verification failure
      }
    }

    void verifySession()
  }, [searchParams])

  // SCORIS engine — drives IDLE → ANALYZING → SUCCESS micro-latency
  const [engineState, engineActions] = useScorisEngine()

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('finsight_sector') as SectorKey | null
    if (saved && saved in SECTOR_BENCHMARKS) setSector(saved)
    try {
      const raw = localStorage.getItem('finsight_fec_meta')
      if (raw) setFecMeta(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  const bench = SECTOR_BENCHMARKS[sector]
  const phase = PHASES[phaseIndex]

  // Steps for current pillar phase
  const currentSteps = useMemo(() => {
    if (phase.key === 'strategic') return STRATEGIC_WIZARD_STEPS
    if (!phase.pillar) return []
    return WIZARD_STEPS.filter((s) => s.pillar === phase.pillar)
  }, [phase])

  const currentStep = stepIndex !== null ? currentSteps[stepIndex] : null

  // Live scores (computed from in-progress form values + submitted results)
  const draftResults = useMemo(() => {
    const next = { ...results } as WizardResults
    const caAnnuel = parseFloat(formValues.company?.caAnnuel || '0') || 0
    const margeBrute = parseFloat(formValues['seuil-rentabilite']?.margeBrute || '0') || 0
    const chargesFixesMensuelles = parseFloat(formValues['seuil-rentabilite']?.chargesFixesMensuelles || '0') || 0

    const joursClients = parseFloat(formValues.dso?.joursClients || '0') || 0
    const joursFournisseurs = parseFloat(formValues.dso?.joursFournisseurs || '0') || 0
    const soldeBancaire = parseFloat(formValues.dso?.soldeBancaire || '0') || 0
    if (joursClients > 0) {
      next.dso = {
        value: joursClients,
        inputs: { joursClients, joursFournisseurs, soldeBancaire, caAnnuel, chargesFixesMensuelles },
      }
      const bfrJours = joursClients - joursFournisseurs
      next.bfr = { value: caAnnuel > 0 ? Math.round((bfrJours / 365) * caAnnuel) : 0, inputs: { bfrJours, caAnnuel } }
    }

    if (margeBrute > 0 || chargesFixesMensuelles > 0) {
      const seuilRentabilite = margeBrute > 0 ? Math.round((chargesFixesMensuelles * 12) / (margeBrute / 100)) : 0
      next['seuil-rentabilite'] = { value: seuilRentabilite, inputs: { margeBrute, chargesFixesMensuelles, caAnnuel } }
      next.marge = { value: margeBrute, inputs: { margeBrute, caAnnuel } }
    }

    const concentrationClient = parseFloat(formValues.gearing?.concentrationClient || '0') || 0
    const nombreClients = parseFloat(formValues.gearing?.nombreClients || '0') || 0
    const hasDetteBancaire = formValues.gearing?.hasDetteBancaire === '1'
    const detteBancaire = hasDetteBancaire ? (parseFloat(formValues.gearing?.detteBancaire || '0') || 0) : 0
    if (concentrationClient > 0 || nombreClients > 0 || detteBancaire > 0) {
      const denom = caAnnuel > 0 && margeBrute > 0 ? caAnnuel * (margeBrute / 100) : 0
      const gearingValue = denom > 0 && detteBancaire > 0 ? Math.round((detteBancaire / denom) * 100) / 100 : 0
      next.gearing = {
        value: gearingValue,
        inputs: { concentrationClient, nombreClients, detteBancaire, caAnnuel, margeBrute },
      }
    }

    return next
  }, [results, formValues])

  const liveScores = useMemo(() => computeLiveScores(draftResults, bench), [draftResults, bench])

  const totalScore = useMemo(() => {
    const scored = Object.values(liveScores).filter((s) => s !== null) as number[]
    if (scored.length === 0) return null
    return scored.length === 4
      ? scored.reduce((a, b) => a + b, 0)
      : Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 4)
  }, [liveScores])

  const synthesis = useMemo(() => computeSynthesis(draftResults, liveScores, bench), [draftResults, liveScores, bench])

  const zScoreResult = useMemo(() => computeZScore(draftResults, scorisLevel), [draftResults, scorisLevel])

  /** Données SCORIS Stratégique → PDF 13p + contexte Opus */
  const strategicPdfBundle = useMemo((): StrategiqueContextPayload | undefined => {
    if (scorisLevel !== 'strategique') return undefined
    const z = computeZScore(draftResults, 'strategique')
    const actifRaw = draftResults['strategic-actif-total']?.inputs?.actifTotal
    const cpRaw = draftResults['strategic-capitaux']?.inputs?.capitauxPropres
    const actifTotal =
      typeof actifRaw === 'number' ? actifRaw : parseFloat(String(actifRaw ?? '').replace(/\s/g, '').replace(',', '.')) || 0
    const capitauxPropres =
      typeof cpRaw === 'number' ? cpRaw : parseFloat(String(cpRaw ?? '').replace(/\s/g, '').replace(',', '.')) || 0
    return {
      swotForce: String(draftResults['strategic-swot-force']?.inputs?.swotForce ?? ''),
      swotMenace: String(draftResults['strategic-swot-menace']?.inputs?.swotMenace ?? ''),
      objectif12mois: String(draftResults['strategic-objectif']?.inputs?.objectif12mois ?? ''),
      zScore: z?.zScore ?? 0,
      zZone: (z?.zZone.zone ?? 'grise') as StrategiqueContextPayload['zZone'],
      actifTotal,
      capitauxPropres,
    }
  }, [draftResults, scorisLevel])

  useEffect(() => {
    if (scorisLevel !== 'strategique' || !strategicPdfBundle) return
    try {
      localStorage.setItem('finsight_scoris_strategic', JSON.stringify(strategicPdfBundle))
      localStorage.setItem('finsight_scoris_level', 'strategique')
    } catch {
      /* ignore */
    }
  }, [scorisLevel, strategicPdfBundle])

  const handleFreePreviewPDF = useCallback(async () => {
    if (generatingPreviewPdf) return
    setGeneratingPreviewPdf(true)
    try {
      const diagSnap = computeDiagnosticScore(history, sector)
      const insightsSnap = computeInsights(diagSnap, history, sector)
      await generateDiagnosticPDF({
        diagnostic: diagSnap,
        insights: insightsSnap,
        sector,
        history,
        companyName: fecMeta?.fileName?.replace(/\.[^.]+$/, '') || undefined,
        fileName: fecMeta?.fileName || undefined,
        fecMeta: fecMeta || undefined,
        completedCount: completedTypes().length,
        totalCalculators: TOTAL_CALCULATORS,
        isPremium: false,
        scorisLevel: scorisLevel ?? 'standard',
        strategique: scorisLevel === 'strategique' ? strategicPdfBundle : undefined,
      })
      setHasDownloadedFreeReport(true)
      if (!freePreviewBannerDismissed) {
        setFreePreviewBannerVisible(true)
        if (freePreviewBannerTimerRef.current) clearTimeout(freePreviewBannerTimerRef.current)
        freePreviewBannerTimerRef.current = setTimeout(() => {
          setFreePreviewBannerVisible(false)
          freePreviewBannerTimerRef.current = null
        }, 10000)
      }
    } catch (err) {
      console.error('[guide] Aperçu PDF gratuit:', err)
    } finally {
      setGeneratingPreviewPdf(false)
    }
  }, [
    generatingPreviewPdf,
    history,
    sector,
    fecMeta,
    completedTypes,
    freePreviewBannerDismissed,
    scorisLevel,
    strategicPdfBundle,
  ])

  /** Mode test weekend : rapport PDF premium sans paiement */
  const handlePremiumTestPDF = useCallback(async () => {
    const diagSnap = computeDiagnosticScore(history, sector)
    const insightsSnap = computeInsights(diagSnap, history, sector)
    await generateDiagnosticPDF({
      diagnostic: diagSnap,
      insights: insightsSnap,
      sector,
      history,
      companyName: fecMeta?.fileName?.replace(/\.[^.]+$/, '') || undefined,
      fileName: fecMeta?.fileName || undefined,
      fecMeta: fecMeta || undefined,
      completedCount: completedTypes().length,
      totalCalculators: TOTAL_CALCULATORS,
      isPremium: true,
      scorisLevel: scorisLevel ?? 'standard',
      strategique: scorisLevel === 'strategique' ? strategicPdfBundle : undefined,
    })
    setPaywallUnlocked(true)
  }, [history, sector, fecMeta, completedTypes, scorisLevel, strategicPdfBundle])

  const allSteps = useMemo(() => {
    if (scorisLevel === 'strategique') return [...WIZARD_STEPS, ...STRATEGIC_WIZARD_STEPS]
    return WIZARD_STEPS
  }, [scorisLevel])

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
      if (f.showWhen) {
        const parentVal = vals[f.showWhen.fieldId]
        if (parentVal !== f.showWhen.value) return true
      }
      if (f.required === false) return true
      if (f.type === 'toggle') return vals[f.id] === '0' || vals[f.id] === '1'
      if (f.type === 'textarea') {
        const t = vals[f.id] ?? ''
        const n = countWords(t)
        const max = f.maxWords ?? 150
        return n >= 1 && n <= max
      }
      if (f.type === 'choice') {
        const v = vals[f.id]
        return v !== undefined && v !== ''
      }
      const v = vals[f.id]
      return v !== undefined && v !== '' && Number.isFinite(parseFloat(v))
    })
  }, [formValues])

  const submitStep = useCallback((step: WizardStep) => {
    const vals = formValues[step.id] || {}
    const inputs: Record<string, number | string> = {}
    const caAnnuel = parseFloat(formValues.company?.caAnnuel || '0') || 0
    const margeBrute = parseFloat(formValues['seuil-rentabilite']?.margeBrute || '0') || 0
    const chargesFixesMensuelles = parseFloat(formValues['seuil-rentabilite']?.chargesFixesMensuelles || '0') || 0

    step.fields.forEach((f) => {
      if (f.type === 'toggle') {
        inputs[f.id] = vals[f.id] === '1' ? 1 : 0
        return
      }
      if (f.type === 'textarea' || f.type === 'choice') {
        inputs[f.id] = vals[f.id] ?? ''
        return
      }
      if (f.showWhen) {
        const parentVal = vals[f.showWhen.fieldId]
        if (parentVal !== f.showWhen.value) {
          inputs[f.id] = 0
          return
        }
      }
      inputs[f.id] = parseFloat(vals[f.id]) || 0
    })

    // Shared contextual inputs reused by all following steps
    if (!step.id.startsWith('strategic-')) {
      if (step.id !== 'company') inputs.caAnnuel = caAnnuel
      if (step.id === 'gearing') inputs.margeBrute = margeBrute
      if (step.id === 'dso' && chargesFixesMensuelles > 0) inputs.chargesFixesMensuelles = chargesFixesMensuelles
      if (step.id === 'seuil-rentabilite') inputs.caAnnuel = caAnnuel
    }

    // Derive BFR approximation step automatically from cash inputs
    if (step.id === 'dso') {
      const bfrJours = Number(inputs.joursClients ?? 0) - Number(inputs.joursFournisseurs ?? 0)
      const bfrEuros = caAnnuel > 0 ? Math.round((bfrJours / 365) * caAnnuel) : 0
      setResults((prev) => ({
        ...prev,
        bfr: {
          value: bfrEuros,
          inputs: { bfrJours, caAnnuel },
        },
      }))
      saveCalculation({
        type: 'bfr',
        value: bfrEuros,
        inputs: { bfrJours, caAnnuel },
        unit: '€',
      })
    }
    const result = step.compute(inputs)

    setResults((prev) => ({ ...prev, [step.id]: { value: result.value, inputs } }))

    // Save to localStorage (same format as calculators)
    if (step.calcType) {
      saveCalculation({
        type: step.calcType,
        value: result.value,
        inputs: inputs as Record<string, number>,
        unit: result.unit,
      })
    }

    // Persist margin as a calculator result for score engine compatibility
    if (step.id === 'seuil-rentabilite') {
      const margeN = Number(inputs.margeBrute ?? 0)
      saveCalculation({
        type: 'marge',
        value: margeN,
        inputs: { margeBrute: margeN, caAnnuel },
        unit: '%',
      })
      setResults((prev) => ({
        ...prev,
        marge: {
          value: margeN,
          inputs: { margeBrute: margeN, caAnnuel },
        },
      }))
    }
  }, [formValues, saveCalculation])

  const handleSectorChange = useCallback((s: SectorKey) => {
    setSector(s)
    localStorage.setItem('finsight_sector', s)
  }, [])

  // ── FEC data injection bridge ──
  const handleFECData = useCallback((wizard: FECWizardData, extracted: FECExtractedData) => {
    const newResults: WizardResults = {}
    const newFormValues: Record<string, Record<string, string>> = {}

    // Map FEC wizard data to each wizard step
    const fecMap: { stepId: string; calcType: CalculatorType; data: { value: number; inputs: Record<string, number> } | null; unit: string }[] = [
      { stepId: 'dso', calcType: 'dso', data: wizard.dso, unit: 'jours' },
      { stepId: 'bfr', calcType: 'bfr', data: wizard.bfr, unit: '€' },
      { stepId: 'marge', calcType: 'marge', data: wizard.marge, unit: '%' },
      { stepId: 'ebitda', calcType: 'ebitda', data: wizard.ebitda, unit: '€' },
      { stepId: 'burn-rate', calcType: 'burn-rate', data: wizard.burnRate, unit: '€/mois' },
      { stepId: 'seuil-rentabilite', calcType: 'seuil-rentabilite', data: wizard.seuilRentabilite, unit: '€' },
      { stepId: 'gearing', calcType: 'gearing', data: wizard.gearing, unit: 'x' },
    ]

    for (const entry of fecMap) {
      // Null-safe (gearing can be null if no debt data)
      if (!entry.data) continue
      // Defensive: skip NaN or Infinity values from parser edge cases
      if (!Number.isFinite(entry.data.value)) continue

      // Populate results (drives live scoring)
      newResults[entry.stepId] = { value: entry.data.value, inputs: entry.data.inputs }

      // Populate formValues (pre-fills the form fields visually)
      const fields: Record<string, string> = {}
      for (const [k, v] of Object.entries(entry.data.inputs)) {
        fields[k] = Number.isFinite(v) ? String(v) : '0'
      }
      newFormValues[entry.stepId] = fields

      // Persist to localStorage via saveCalculation
      saveCalculation({
        type: entry.calcType,
        value: entry.data.value,
        inputs: entry.data.inputs,
        unit: entry.unit,
      })
    }

    setResults(newResults)
    setFormValues(newFormValues)

    // Persist FEC source metadata so /mon-diagnostic can show certification badge
    try {
      localStorage.setItem('finsight_fec_meta', JSON.stringify({
        source: 'fec',
        fileName: extracted.fileName,
        nbEcritures: extracted.nbEcritures,
        dateDebut: extracted.dateDebut,
        dateFin: extracted.dateFin,
        dataQuality: Math.round(
          [extracted.ca > 0, extracted.creancesClients > 0, extracted.chargesExploitation > 0,
           extracted.tresorerie !== 0, extracted.stocks > 0, extracted.dettesFournisseurs > 0,
           extracted.detteFinanciere > 0].filter(Boolean).length / 7 * 100
        ),
        timestamp: new Date().toISOString(),
      }))
    } catch { /* localStorage full — non-blocking */ }

    const synthesisIdx = PHASES.findIndex((p) => p.key === 'synthesis')
    const strategicIdx = PHASES.findIndex((p) => p.key === 'strategic')

    if (scorisLevel === 'strategique') {
      setPhaseIndex(strategicIdx)
      setStepIndex(null)
    } else {
      engineActions.analyze({
        sector,
        results: newResults,
        enabledModules: {
          causalAnalysis: true,
          sectorBenchmarks: true,
          whatIfSimulation: true,
        },
      })
      setPhaseIndex(synthesisIdx)
      setStepIndex(null)
    }
  }, [saveCalculation, engineActions, sector, scorisLevel])

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
        results: draftResults,
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
      setStepIndex(null)
      const doneKey = phase.key
      if (doneKey === 'resilience') {
        if (scorisLevel === 'strategique') {
          setPhaseIndex(PHASES.findIndex((p) => p.key === 'strategic'))
        } else {
          setPhaseIndex(PHASES.findIndex((p) => p.key === 'risk'))
        }
      } else if (doneKey === 'strategic') {
        setPhaseIndex(PHASES.findIndex((p) => p.key === 'risk'))
      } else {
        setPhaseIndex((p) => Math.min(p + 1, PHASES.length - 1))
      }
    }
  }, [phase, stepIndex, currentStep, currentSteps, isStepComplete, submitStep, engineActions, draftResults, sector, scorisLevel])

  const goPrev = useCallback(() => {
    if (phase.key === 'intro') {
      setScorisLevel(null)
      setPhaseIndex(0)
      setStepIndex(null)
      return
    }

    if (phase.key === 'synthesis') {
      const riskIdx = PHASES.findIndex((p) => p.key === 'risk')
      setPhaseIndex(riskIdx)
      setStepIndex(null)
      return
    }

    if (phase.key === 'risk') {
      if (scorisLevel === 'strategique') {
        const stratIdx = PHASES.findIndex((p) => p.key === 'strategic')
        setPhaseIndex(stratIdx)
        setStepIndex(STRATEGIC_WIZARD_STEPS.length - 1)
      } else {
        const resIdx = PHASES.findIndex((p) => p.key === 'resilience')
        const resSteps = WIZARD_STEPS.filter((s) => s.pillar === 'resilience')
        setPhaseIndex(resIdx)
        setStepIndex(resSteps.length - 1)
      }
      return
    }

    if (stepIndex === null) {
      if (phaseIndex > 1) {
        const prevPhase = PHASES[phaseIndex - 1]
        const prevSteps =
          prevPhase.key === 'strategic'
            ? STRATEGIC_WIZARD_STEPS
            : WIZARD_STEPS.filter((s) => s.pillar === prevPhase.pillar)
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
      setStepIndex(null)
    }
  }, [phase, stepIndex, phaseIndex, scorisLevel])

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
    return <div className="min-h-dvh bg-slate-950" />
  }

  // ── Écran de choix SCORIS Standard / Stratégique (avant intro)
  if (scorisLevel === null) {
    return (
      <div className="flex min-h-dvh flex-col overflow-x-hidden overflow-y-auto bg-slate-950 font-sans text-white">
        <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/mon-diagnostic" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Quitter le diagnostic
            </Link>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-[max(4rem,env(safe-area-inset-bottom,0px)+3rem)]">
          <p className="text-[11px] text-gray-500 font-medium tracking-[0.2em] uppercase mb-6">SCORIS™</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-medium text-center text-white mb-10 max-w-2xl">
            Choisissez votre diagnostic
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <button
              type="button"
              onClick={() => setScorisLevel('standard')}
              className="group text-left rounded-xl border border-gray-700 bg-slate-900/50 hover:border-gray-500 hover:bg-slate-800/60 transition-all duration-200 px-6 py-7"
            >
              <p className="text-lg font-semibold text-white mb-1">SCORIS Standard</p>
              <p className="text-2xl font-serif font-medium text-white mb-2">49 €</p>
              <p className="text-[11px] text-gray-500 mb-5">~7 minutes · 8 pages</p>
              <ul className="space-y-2.5 mb-6 text-sm text-gray-300">
                {[
                  'Score financier 4 piliers',
                  'Plan d\'action 90 jours',
                  'Pack banquier préparé',
                  'Benchmarks BdF 2024',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                Commencer <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setScorisLevel('strategique')}
              className="group text-left rounded-xl border-2 border-blue-500/50 bg-slate-900/70 hover:border-blue-400/70 hover:bg-blue-950/30 transition-all duration-200 px-6 py-7 relative ring-1 ring-blue-500/20"
            >
              <span className="absolute -top-2.5 left-5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600 text-white uppercase tracking-wide">
                Recommandé
              </span>
              <p className="text-lg font-semibold text-white mb-1 mt-1">SCORIS Stratégique</p>
              <p className="text-2xl font-serif font-medium text-white mb-2">99 €</p>
              <p className="text-[11px] text-blue-400/80 mb-5">~12 minutes · 12 pages</p>
              <ul className="space-y-2.5 mb-6 text-sm text-gray-300">
                {[
                  'Tout SCORIS Standard',
                  'Z-Score Altman (risque défaillance)',
                  'Analyse SWOT par IA',
                  'Valorisation de votre entreprise',
                  'Porter simplifié',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300">
                Commencer <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const completedStepCount = Object.keys(results).length + skippedSteps.size
  const progressPct = Math.min(100, Math.round((completedStepCount / allSteps.length) * 100))

  return (
    <div className="box-border flex h-[100dvh] w-full min-h-0 flex-col overflow-hidden bg-slate-950 text-white font-sans">

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

      {/* ── Main layout (scrollable column; min-h-0 enables flex child overflow) ── */}
      <div className="flex min-h-0 flex-1 flex-col pt-14 lg:flex-row">

        {/* ── Sidebar: live score ── */}
        <aside className="hidden min-h-0 shrink-0 lg:flex lg:h-[calc(100dvh-3.5rem)] lg:max-h-[calc(100dvh-3.5rem)] lg:w-72 lg:flex-col lg:sticky lg:top-14 lg:overflow-y-auto border-r border-gray-800/50 bg-slate-950">
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

        {/* ── Content area (questions / synthèse scroll here on mobile + desktop) ── */}
        <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain pb-[calc(5rem+env(safe-area-inset-bottom,0px))] pt-1 touch-pan-y lg:pb-0">

          <AnimatePresence mode="wait">
            {/* ── INTRO PHASE ── */}
            {phase.key === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex w-full flex-1 flex-col justify-start px-6 py-10 sm:py-14"
              >
                <div className="mx-auto max-w-xl w-full text-center">
                  <p className="text-[11px] text-gray-500 font-medium tracking-[0.2em] uppercase mb-8">
                    Score FinSight
                  </p>
                  <h1 className="font-serif text-4xl lg:text-5xl font-medium leading-tight tracking-tight text-white mb-6">
                    {phase.title}
                  </h1>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {phase.key === 'intro'
                      ? scorisLevel === 'strategique'
                        ? 'Nous allons analyser votre modèle en 4 piliers, puis des indicateurs stratégiques (Z-Score, SWOT). Environ 12 minutes.'
                        : phase.subtitle
                      : phase.subtitle}
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

                  {/* ── Option A / B split ── */}
                  <AnimatePresence mode="wait">
                    {introMode === 'choose' && (
                      <motion.div
                        key="choose"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-lg mx-auto"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Option A — Saisie manuelle */}
                          <button
                            onClick={goNext}
                            className="group relative text-left px-5 py-5 rounded-xl border border-gray-700 bg-slate-900/50 hover:border-gray-500 hover:bg-slate-800/60 transition-all duration-200"
                          >
                            <div className="w-9 h-9 rounded-lg bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center mb-3 transition-colors">
                              <Activity className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                            <p className="text-sm font-semibold text-white mb-1">Saisie guidée</p>
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                              9 indicateurs, étape par étape. Idéal si vous connaissez vos chiffres clés.
                            </p>
                            <span className="inline-flex items-center gap-1 text-[10px] text-gray-600">
                              ~7 min · Sans inscription
                            </span>
                            <ArrowRight className="absolute top-5 right-4 w-4 h-4 text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                          </button>

                          {/* Option B — FEC Upload */}
                          <button
                            onClick={() => setIntroMode('fec')}
                            className="group relative text-left px-5 py-5 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:border-blue-400/30 hover:bg-blue-500/10 transition-all duration-200"
                          >
                            <div className="absolute -top-2 right-4">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 border border-blue-400/20 rounded-full text-[9px] font-semibold text-blue-400 uppercase tracking-wider">
                                <Sparkles className="w-2.5 h-2.5" /> Précision
                              </span>
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center mb-3 transition-colors">
                              <FileText className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                            </div>
                            <p className="text-sm font-semibold text-white mb-1">Upload FEC</p>
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                              Importez votre fichier d&apos;écritures comptables. Diagnostic instantané.
                            </p>
                            <span className="inline-flex items-center gap-1 text-[10px] text-blue-400/60">
                              ~30 sec · 100% local
                            </span>
                            <ArrowRight className="absolute top-5 right-4 w-4 h-4 text-blue-500/30 group-hover:text-blue-400/60 group-hover:translate-x-0.5 transition-all" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {introMode === 'fec' && (
                      <motion.div
                        key="fec"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-lg mx-auto"
                      >
                        <FECDropzone
                          onDataReady={handleFECData}
                          onSwitchToManual={() => {
                            setIntroMode('choose')
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ── PILLAR PHASE: transition screen ── */}
            {((phase.pillar && phase.key !== 'risk') || phase.key === 'strategic') && stepIndex === null && (
              <motion.div
                key={`phase-${phase.key}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex w-full flex-1 flex-col justify-start px-6 py-8 sm:py-12"
              >
                <div className="mx-auto max-w-lg w-full text-center">
                  {phase.key === 'strategic' ? (
                    <>
                      <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                        <TrendingUp className="w-6 h-6 text-indigo-400" />
                      </div>
                      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4 text-indigo-400">
                        Extension stratégique
                      </p>
                    </>
                  ) : (
                    (() => {
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
                    })()
                  )}
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
            {((phase.pillar && phase.key !== 'risk') || phase.key === 'strategic') && stepIndex !== null && currentStep && (
              <motion.div
                key={`step-${currentStep.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex w-full flex-1 flex-col justify-start px-6 pb-10 pt-4 sm:pb-14 sm:pt-6"
              >
                <div className="mx-auto max-w-lg w-full">
                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mb-8">
                    {currentStep.strategicTag ? (
                      <span
                        className={`text-[10px] font-semibold tracking-[0.15em] uppercase ${
                          currentStep.strategicTag === 'Z-SCORE'
                            ? 'text-blue-400'
                            : currentStep.strategicTag === 'SWOT'
                              ? 'text-purple-400'
                              : 'text-emerald-400'
                        }`}
                      >
                        {currentStep.strategicTag} — {stepIndex + 1}/{currentSteps.length}
                      </span>
                    ) : (
                      (() => {
                        const pillarMeta = PILLARS.find((p) => p.key === phase.pillar)!
                        return (
                          <span className={`text-[10px] font-semibold tracking-[0.15em] uppercase ${pillarMeta.color}`}>
                            {pillarMeta.label} — {stepIndex + 1}/{currentSteps.length}
                          </span>
                        )
                      })()
                    )}
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
                    {currentStep.fields
                      .filter((field) => {
                        if (!field.showWhen) return true
                        return getFieldValue(currentStep.id, field.showWhen.fieldId) === field.showWhen.value
                      })
                      .map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={`field-${currentStep.id}-${field.id}`}
                          className="block text-xs font-semibold text-gray-300 mb-2 tracking-wide"
                        >
                          {field.label}
                        </label>
                        {field.question && (
                          <p className="text-xs text-gray-500 mb-2">{field.question}</p>
                        )}
                        <div className="relative">
                          {field.type === 'toggle' ? (
                            <div className="flex items-center gap-3">
                              {(field.options || []).map((option) => {
                                const active = getFieldValue(currentStep.id, field.id) === option.value
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFieldValue(currentStep.id, field.id, option.value)}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                                      active
                                        ? 'bg-white text-slate-950 border-white'
                                        : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-500'
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                )
                              })}
                            </div>
                          ) : field.type === 'textarea' ? (
                            <>
                              <textarea
                                id={`field-${currentStep.id}-${field.id}`}
                                rows={5}
                                value={getFieldValue(currentStep.id, field.id)}
                                onChange={(e) => setFieldValue(currentStep.id, field.id, e.target.value)}
                                placeholder={field.placeholder}
                                aria-describedby={field.help ? `help-${currentStep.id}-${field.id}` : undefined}
                                className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/30 outline-none transition-all text-sm leading-relaxed resize-y min-h-[120px]"
                              />
                              <p className="text-[10px] text-gray-600 mt-1.5 tabular-nums">
                                {countWords(getFieldValue(currentStep.id, field.id))} / {field.maxWords ?? 150} mots
                              </p>
                            </>
                          ) : field.type === 'choice' ? (
                            <div className="flex flex-col gap-2">
                              {(field.options || []).map((option) => {
                                const active = getFieldValue(currentStep.id, field.id) === option.value
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFieldValue(currentStep.id, field.id, option.value)}
                                    className={`text-left px-4 py-3 rounded-lg text-sm border transition-colors ${
                                      active
                                        ? 'bg-white text-slate-950 border-white'
                                        : 'bg-gray-900/50 text-gray-300 border-gray-700 hover:border-gray-500'
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                )
                              })}
                            </div>
                          ) : (
                            <>
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
                              {field.suffix && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium" aria-hidden="true">
                                  {field.suffix}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        {field.help && (
                          <p id={`help-${currentStep.id}-${field.id}`} className="text-[11px] text-gray-600 mt-1.5">{field.help}</p>
                        )}
                        {/* Field hint */}
                        {(() => {
                          const hint = getWizardFieldHint(currentStep.id, field.id, bench)
                          if (!hint) return null
                          return (
                            <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
                              <Activity className="w-3 h-3 text-gray-600 shrink-0" />
                              <span>{hint}</span>
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

            {/* ── RISK PHASE: narrative analysis (no form) ── */}
            {phase.key === 'risk' && (
              <motion.div
                key="risk-analysis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex w-full flex-1 flex-col justify-start px-6 py-8 sm:py-12"
              >
                <div className="mx-auto max-w-xl w-full">
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
                        Number(results.bfr.inputs.bfrJours ?? 0) > 45 &&
                        Number(results['seuil-rentabilite'].inputs.margeBrute ?? 0) < 30
                          ? 'bg-red-500/5 border-red-500/20'
                          : 'bg-gray-800/30 border-gray-700/50'
                      }`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-semibold text-gray-300">BFR × Taux de marge</p>
                          {Number(results.bfr.inputs.bfrJours ?? 0) > 45 &&
                           Number(results['seuil-rentabilite'].inputs.margeBrute ?? 0) < 30 ? (
                            <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Fragilite structurelle</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">Maitrise</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {(() => {
                            const bfrJ = Number(results.bfr.inputs.bfrJours ?? 0)
                            const tm = Number(results['seuil-rentabilite'].inputs.margeBrute ?? 0)
                            if (bfrJ > 45 && tm < 30)
                              return `BFR a ${bfrJ}j avec une marge brute de ${tm}% — pression croisee elevee sur votre tresorerie.`
                            return `BFR et taux de marge dans des niveaux compatibles — pas de fragilite croisee detectee.`
                          })()}
                        </p>
                      </div>
                    )}

                    {/* Concentration client */}
                    {results.gearing?.inputs.concentrationClient !== undefined && (
                      <div className={`px-4 py-3.5 rounded-lg border ${
                        (() => {
                          const concentration = Number(results.gearing?.inputs.concentrationClient ?? 0)
                          if (concentration > 60) return 'bg-red-500/5 border-red-500/20'
                          if (concentration > 40) return 'bg-amber-500/5 border-amber-500/20'
                          return 'bg-emerald-500/5 border-emerald-500/20'
                        })()
                      }`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-semibold text-gray-300">Concentration client</p>
                          {(() => {
                            const concentration = Number(results.gearing?.inputs.concentrationClient ?? 0)
                            return concentration > 60 ? (
                              <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Critique</span>
                            ) : concentration > 40 ? (
                              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Vigilance</span>
                            ) : (
                              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Maitrise</span>
                            )
                          })()}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {(() => {
                            const concentration = Number(results.gearing?.inputs.concentrationClient ?? 0)
                            if (concentration > 60) return '🔴 Risque structurel critique — dépendance client excessive'
                            if (concentration > 40) return '🟡 Dépendance client élevée — diversification recommandée'
                            return '🟢 Concentration client maîtrisée'
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
                className="flex w-full flex-1 flex-col justify-center px-6 py-10 sm:py-14"
              >
                <div className="mx-auto max-w-md w-full text-center">
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
                className="w-full flex-1 px-6 py-10 sm:py-12"
              >
                <div className="mx-auto max-w-2xl w-full pb-4">
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

                  {/* Z-Score Altman — indicateur séparé du score /100 (SCORIS Stratégique) */}
                  {scorisLevel === 'strategique' && zScoreResult && (
                    <div
                      className={`mb-10 px-5 py-5 rounded-xl border ${
                        zScoreResult.zZone.color === 'red'
                          ? 'bg-red-500/5 border-red-500/25'
                          : zScoreResult.zZone.color === 'orange'
                            ? 'bg-amber-500/5 border-amber-500/25'
                            : 'bg-emerald-500/5 border-emerald-500/25'
                      }`}
                    >
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-2">
                        Z-Score Altman (non coté au score /100)
                      </p>
                      <div className="flex flex-wrap items-baseline gap-3 mb-2">
                        <span className="font-serif text-4xl font-medium text-white tabular-nums">
                          {zScoreResult.zScore.toFixed(2)}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            zScoreResult.zZone.color === 'red'
                              ? 'text-red-400'
                              : zScoreResult.zZone.color === 'orange'
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                          }`}
                        >
                          {zScoreResult.zZone.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Indicateur de risque de défaillance — distinct du Score FinSight™ 4 piliers.
                      </p>
                    </div>
                  )}
                  {scorisLevel === 'strategique' && !zScoreResult && (
                    <div className="mb-10 px-5 py-4 rounded-lg border border-gray-800 bg-gray-900/40">
                      <p className="text-xs text-gray-500">
                        Z-Score Altman : complétez les questions bilan (actif & capitaux propres) pour afficher l&apos;indicateur.
                      </p>
                    </div>
                  )}

                  {/* ── SCORIS Paywall — piliers floutés si non payé ── */}
                  {!paywallUnlocked && (
                    <div className="mb-10">
                      <ScorePaywall
                        score={totalScore}
                        sector={sector}
                        scorisLevel={scorisLevel ?? 'standard'}
                        onPreviewDownload={handleFreePreviewPDF}
                        previewLoading={generatingPreviewPdf}
                        onPremiumDownload={handlePremiumTestPDF}
                      />
                    </div>
                  )}

                  {/* Forces */}
                  {paywallUnlocked && synthesis.forces.length > 0 && (
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

                  {/* Vulnerabilites — blurred behind paywall */}
                  {!paywallUnlocked && synthesis.forces.length > 0 && (
                    <div className="mb-8 select-none pointer-events-none" style={{ filter: 'blur(6px)', opacity: 0.4 }}>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">Forces identifiees</p>
                      <div className="space-y-2">
                        {synthesis.forces.slice(0, 2).map((f, i) => (
                          <div key={i} className="flex items-start gap-3 px-4 py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                            <p className="text-sm text-gray-300 leading-snug">{f}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vulnerabilites */}
                  {synthesis.vulnerabilites.length > 0 && (
                    <div className={`mb-8 transition-all duration-300 ${!paywallUnlocked ? 'select-none pointer-events-none' : ''}`} style={!paywallUnlocked ? { filter: 'blur(6px)', opacity: 0.4 } : undefined}>
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
                  <div className={`mb-8 transition-all duration-300 ${!paywallUnlocked ? 'select-none pointer-events-none' : ''}`} style={!paywallUnlocked ? { filter: 'blur(6px)', opacity: 0.4 } : undefined}>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                      Priorite d'action
                    </p>
                    <div className="px-4 py-4 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-sm text-white leading-relaxed">{synthesis.priorite}</p>
                    </div>
                  </div>

                  {/* Cash impact */}
                  {synthesis.cashImpact && (
                    <div className={`mb-10 transition-all duration-300 ${!paywallUnlocked ? 'select-none pointer-events-none' : ''}`} style={!paywallUnlocked ? { filter: 'blur(6px)', opacity: 0.4 } : undefined}>
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
                    <div className={`mb-10 transition-all duration-300 ${!paywallUnlocked ? 'select-none pointer-events-none' : ''}`} style={!paywallUnlocked ? { filter: 'blur(6px)', opacity: 0.4 } : undefined}>
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

      <FreePreviewReminderBanner
        visible={
          hasDownloadedFreeReport && freePreviewBannerVisible && !freePreviewBannerDismissed
        }
        onDismiss={dismissFreePreviewBanner}
        onUnlock={scrollToScorisPaywall}
      />

      {/* ── Mobile score bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-800/50 bg-slate-950/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur-sm lg:hidden">
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

export default function DiagnosticGuidePage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-slate-950" />}>
      <DiagnosticGuideContent />
    </Suspense>
  )
}

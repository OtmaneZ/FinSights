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
} from 'lucide-react'
import { useCalculatorHistory, type CalculatorType } from '@/hooks/useCalculatorHistory'

// ---------------------------------------------------------------------------
// Sector benchmarks (aligned with /mon-diagnostic)
// ---------------------------------------------------------------------------

type SectorKey =
  | 'services-b2b'
  | 'commerce'
  | 'industrie'
  | 'saas-tech'
  | 'btp'
  | 'chr'
  | 'autre'

interface SectorBenchmark {
  label: string
  dsoMedian: number
  dsoGood: number
  dsoBad: number
  margeMedian: number
  margeBon: number
  margeFaible: number
  bfrJoursMedian: number
  bfrJoursBon: number
  bfrJoursBad: number
  ebitdaMedian: number
}

const SECTOR_BENCHMARKS: Record<SectorKey, SectorBenchmark> = {
  'services-b2b': {
    label: 'Services B2B',
    dsoMedian: 45, dsoGood: 35, dsoBad: 60,
    margeMedian: 55, margeBon: 45, margeFaible: 30,
    bfrJoursMedian: 30, bfrJoursBon: 20, bfrJoursBad: 50,
    ebitdaMedian: 12,
  },
  commerce: {
    label: 'Commerce & Distribution',
    dsoMedian: 30, dsoGood: 20, dsoBad: 45,
    margeMedian: 30, margeBon: 22, margeFaible: 15,
    bfrJoursMedian: 35, bfrJoursBon: 20, bfrJoursBad: 55,
    ebitdaMedian: 5,
  },
  industrie: {
    label: 'Industrie & Fabrication',
    dsoMedian: 55, dsoGood: 40, dsoBad: 75,
    margeMedian: 38, margeBon: 28, margeFaible: 18,
    bfrJoursMedian: 50, bfrJoursBon: 35, bfrJoursBad: 75,
    ebitdaMedian: 8,
  },
  'saas-tech': {
    label: 'SaaS & Tech',
    dsoMedian: 25, dsoGood: 15, dsoBad: 45,
    margeMedian: 70, margeBon: 55, margeFaible: 35,
    bfrJoursMedian: 15, bfrJoursBon: 10, bfrJoursBad: 30,
    ebitdaMedian: 15,
  },
  btp: {
    label: 'BTP & Construction',
    dsoMedian: 65, dsoGood: 50, dsoBad: 90,
    margeMedian: 22, margeBon: 15, margeFaible: 8,
    bfrJoursMedian: 45, bfrJoursBon: 30, bfrJoursBad: 70,
    ebitdaMedian: 5,
  },
  chr: {
    label: 'Restauration & CHR',
    dsoMedian: 10, dsoGood: 5, dsoBad: 20,
    margeMedian: 68, margeBon: 60, margeFaible: 50,
    bfrJoursMedian: -5, bfrJoursBon: -10, bfrJoursBad: 15,
    ebitdaMedian: 10,
  },
  autre: {
    label: 'Tous secteurs',
    dsoMedian: 45, dsoGood: 30, dsoBad: 60,
    margeMedian: 40, margeBon: 30, margeFaible: 20,
    bfrJoursMedian: 30, bfrJoursBon: 20, bfrJoursBad: 55,
    ebitdaMedian: 8,
  },
}

// ---------------------------------------------------------------------------
// Pillar types
// ---------------------------------------------------------------------------

type PillarKey = 'cash' | 'margin' | 'resilience' | 'risk'

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
// Scoring helpers (simplified for live sidebar)
// ---------------------------------------------------------------------------

function scoreDSO(value: number, bench: SectorBenchmark): number {
  if (value <= bench.dsoGood) return 10
  if (value <= bench.dsoMedian) return 7
  if (value <= bench.dsoBad) return 4
  return 1
}

function scoreBFR(value: number, ca: number, bench: SectorBenchmark): number {
  if (value < 0) return 10
  if (ca > 0) {
    const j = Math.round((value / ca) * 365)
    if (j <= bench.bfrJoursBon) return 10
    if (j <= bench.bfrJoursMedian) return 7
    if (j <= bench.bfrJoursBad) return 4
    return 1
  }
  return 3
}

function scoreMarge(value: number, bench: SectorBenchmark): number {
  if (value >= bench.margeBon * 1.3) return 8
  if (value >= bench.margeBon) return 6
  if (value >= bench.margeMedian) return 4
  if (value >= bench.margeFaible) return 2
  return 1
}

function scoreSeuil(tauxMarge: number, bench: SectorBenchmark): number {
  if (tauxMarge >= bench.margeBon) return 6
  if (tauxMarge >= bench.margeMedian) return 4
  if (tauxMarge >= bench.margeFaible) return 2
  return 1
}

function computeLiveScores(
  results: Record<string, { value: number; inputs: Record<string, number> }>,
  bench: SectorBenchmark,
) {
  const scores: Record<PillarKey, number | null> = {
    cash: null,
    margin: null,
    resilience: null,
    risk: null,
  }

  // Cash
  let cashPts = 0
  let cashMax = 0
  if (results.dso) {
    cashMax += 10
    cashPts += scoreDSO(results.dso.value, bench)
  }
  if (results.bfr) {
    cashMax += 10
    cashPts += scoreBFR(results.bfr.value, results.bfr.inputs.ca || 0, bench)
  }
  if (results['burn-rate']) {
    cashMax += 5
    const br = results['burn-rate'].value
    const ca = results.bfr?.inputs.ca || results.dso?.inputs.ca || 0
    const caMensuel = ca / 12
    if (caMensuel > 0) {
      const pct = (br / caMensuel) * 100
      if (pct < 30) cashPts += 5
      else if (pct < 60) cashPts += 3
      else if (pct < 90) cashPts += 1
    } else {
      if (br < 5000) cashPts += 5
      else if (br < 15000) cashPts += 3
      else if (br < 50000) cashPts += 1
    }
  }
  if (cashMax > 0) scores.cash = Math.round((cashPts / cashMax) * 25)

  // Margin
  let marginPts = 0
  let marginMax = 0
  if (results.marge) {
    marginMax += 8
    marginPts += scoreMarge(results.marge.value, bench)
  }
  if (results['seuil-rentabilite']) {
    marginMax += 6
    marginPts += scoreSeuil(results['seuil-rentabilite'].inputs.tauxMarge || 0, bench)
  }
  if (results.roi) {
    marginMax += 7
    const v = results.roi.value
    if (v >= 100) marginPts += 7
    else if (v >= 50) marginPts += 5
    else if (v >= 20) marginPts += 3
    else if (v >= 0) marginPts += 1
  }
  if (marginMax > 0) scores.margin = Math.round((marginPts / marginMax) * 25)

  // Resilience
  let resPts = 0
  let resMax = 0
  if (results.ebitda) {
    const ca = results.ebitda.inputs.ca || 0
    if (ca > 0) {
      resMax += 4
      const pct = (results.ebitda.value / ca) * 100
      if (pct >= bench.ebitdaMedian * 1.5) resPts += 4
      else if (pct >= bench.ebitdaMedian) resPts += 3
      else if (pct > 0) resPts += 2
      else resPts += 1
    }
  }
  if (results['cac-ltv']) {
    resMax += 10
    const v = results['cac-ltv'].value
    if (v >= 3) resPts += 10
    else if (v >= 2) resPts += 7
    else if (v >= 1) resPts += 3
    else resPts += 1
  }
  // derived resilience
  if ((results.dso || results.bfr) && (results.marge || results.ebitda)) {
    resMax += 7
    let sp = 7
    if (results.dso && results.dso.value > bench.dsoBad) sp -= 2
    else if (results.dso && results.dso.value > bench.dsoMedian) sp -= 1
    if (results.marge && results.marge.value >= bench.margeBon) sp += 1
    else if (results.marge && results.marge.value < bench.margeFaible) sp -= 1
    resPts += Math.max(0, Math.min(7, sp))
  }
  if (resMax > 0) scores.resilience = Math.round((resPts / resMax) * 25)

  // Risk
  if ((results.dso || results.bfr) && (results.marge || results['seuil-rentabilite'])) {
    let pts = 25
    if (results.dso && results.dso.value > bench.dsoBad) pts -= 5
    else if (results.dso && results.dso.value > bench.dsoMedian) pts -= 2
    if (results.bfr && results.bfr.inputs.ca && results.bfr.inputs.ca > 0) {
      const j = Math.round((results.bfr.value / results.bfr.inputs.ca) * 365)
      if (j > bench.bfrJoursBad) pts -= 6
      else if (j > bench.bfrJoursMedian) pts -= 3
    }
    if (results.marge && results.marge.value < bench.margeFaible) pts -= 5
    else if (results.marge && results.marge.value < bench.margeMedian) pts -= 2
    if (results['seuil-rentabilite']) {
      const tm = results['seuil-rentabilite'].inputs.tauxMarge
      if (tm && tm < bench.margeFaible * 0.7) pts -= 6
      else if (tm && tm < bench.margeFaible) pts -= 3
    }
    // crossed: DSO high + marge low
    if (results.dso && results.dso.value > bench.dsoMedian && results.marge && results.marge.value < bench.margeMedian) pts -= 3
    scores.risk = Math.max(0, Math.min(25, pts))
  }

  return scores
}

// ---------------------------------------------------------------------------
// Synthesis helpers
// ---------------------------------------------------------------------------

interface SynthesisResult {
  total: number | null
  level: string
  levelColor: string
  forces: string[]
  vulnerabilites: string[]
  priorite: string
  cashImpact: string | null
}

function computeSynthesis(
  results: Record<string, { value: number; inputs: Record<string, number> }>,
  scores: Record<PillarKey, number | null>,
  bench: SectorBenchmark,
): SynthesisResult {
  const scored = Object.values(scores).filter((s) => s !== null) as number[]
  const total = scored.length > 0
    ? (scored.length === 4 ? scored.reduce((a, b) => a + b, 0) : Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 4))
    : null

  let level = 'Diagnostic en cours'
  let levelColor = 'text-gray-400'
  if (total !== null) {
    if (total >= 75) { level = 'Sante financiere solide'; levelColor = 'text-emerald-400' }
    else if (total >= 55) { level = 'Dynamique favorable'; levelColor = 'text-blue-400' }
    else if (total >= 35) { level = 'Points de vigilance identifies'; levelColor = 'text-amber-400' }
    else { level = 'Actions correctives recommandees'; levelColor = 'text-red-400' }
  }

  const forces: string[] = []
  const vulnerabilites: string[] = []

  if (results.dso) {
    if (results.dso.value <= bench.dsoGood)
      forces.push(`DSO de ${results.dso.value}j — encaissements rapides vs mediane sectorielle ${bench.dsoMedian}j`)
    else if (results.dso.value > bench.dsoBad)
      vulnerabilites.push(`DSO de ${results.dso.value}j — depasse le seuil critique sectoriel (${bench.dsoBad}j)`)
    else if (results.dso.value > bench.dsoMedian)
      vulnerabilites.push(`DSO de ${results.dso.value}j — au-dessus de la mediane sectorielle (${bench.dsoMedian}j)`)
  }

  if (results.bfr) {
    if (results.bfr.value < 0) forces.push('BFR negatif — l\'activite genere de la tresorerie en amont')
    else if (results.bfr.inputs.ca && results.bfr.inputs.ca > 0) {
      const j = Math.round((results.bfr.value / results.bfr.inputs.ca) * 365)
      if (j <= bench.bfrJoursBon) forces.push(`BFR de ${j}j de CA — maitrise vs mediane ${bench.bfrJoursMedian}j`)
      else if (j > bench.bfrJoursBad) vulnerabilites.push(`BFR de ${j}j de CA — au-dessus du seuil sectoriel (${bench.bfrJoursBad}j)`)
    }
  }

  if (results.marge) {
    if (results.marge.value >= bench.margeBon) forces.push(`Taux de marge de ${results.marge.value}% — au-dessus du benchmark sectoriel (${bench.margeMedian}%)`)
    else if (results.marge.value < bench.margeFaible) vulnerabilites.push(`Taux de marge de ${results.marge.value}% — sous le seuil critique (${bench.margeFaible}%)`)
  }

  if (results.dso && results.dso.value > bench.dsoMedian && results.marge && results.marge.value < bench.margeMedian)
    vulnerabilites.push('Double pression cash : delais clients longs + marge sous la mediane')

  if (scores.cash !== null && scores.cash >= 20) forces.push('Pilier CASH solide — tresorerie saine')
  if (scores.margin !== null && scores.margin >= 20) forces.push('Rentabilite operationnelle forte')

  // Priorite
  let priorite = ''
  const ca = results.bfr?.inputs.ca || results.dso?.inputs.ca || results['seuil-rentabilite']?.inputs.chargesFixes
  if (results.dso && results.dso.value > bench.dsoBad && ca && ca > 0) {
    const gap = results.dso.value - bench.dsoMedian
    const impact = Math.round((gap / 365) * ca)
    priorite = `Reduire le DSO de ${gap}j pour liberer ${impact.toLocaleString('fr-FR')} \u20ac de tresorerie`
  } else if (results.marge && results.marge.value < bench.margeFaible) {
    priorite = `Revoir la structure de couts : marge de ${results.marge.value}% sous le seuil critique (${bench.margeFaible}%)`
  } else if (scores.cash !== null && scores.cash < 12) {
    priorite = 'Renforcer la tresorerie en priorite — pilier CASH fragile'
  } else if (scores.margin !== null && scores.margin < 12) {
    priorite = 'Ameliorer la rentabilite — pilier MARGIN sous les standards sectoriels'
  } else if (forces.length > vulnerabilites.length) {
    priorite = 'Diagnostic globalement solide — capitaliser sur les forces identifiees'
  } else {
    priorite = 'Completer le diagnostic pour identifier la priorite avec precision'
  }

  // Cash impact
  let cashImpact: string | null = null
  if (results.dso && results.dso.value > bench.dsoMedian && ca && ca > 0) {
    const gap = results.dso.value - bench.dsoMedian
    const impact = Math.round((gap / 365) * ca)
    cashImpact = `${impact.toLocaleString('fr-FR')} \u20ac immobilises (${gap}j DSO au-dessus de la mediane)`
  }

  return {
    total,
    level,
    levelColor,
    forces: forces.slice(0, 3),
    vulnerabilites: vulnerabilites.slice(0, 3),
    priorite,
    cashImpact,
  }
}

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
  }, [phase, stepIndex, currentStep, currentSteps, isStepComplete, submitStep])

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
            <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-500 rounded-full transition-all duration-700"
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
                  <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto mb-10">
                    Sources : Banque de France 2024, Altares, INSEE.
                    Vos donnees restent dans votre navigateur — rien n'est transmis.
                  </p>

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
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Demarrer le diagnostic
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
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
                      <span className="text-[10px] text-gray-600 border border-gray-700 px-2 py-0.5 rounded-full">
                        Optionnel
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
                        <label className="block text-xs font-semibold text-gray-300 mb-2 tracking-wide">
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={getFieldValue(currentStep.id, field.id)}
                            onChange={(e) => setFieldValue(currentStep.id, field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none transition-all text-base tabular-nums"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                            {field.suffix}
                          </span>
                        </div>
                        {field.help && (
                          <p className="text-[11px] text-gray-600 mt-1.5">{field.help}</p>
                        )}
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

            {/* ── SYNTHESIS ── */}
            {phase.key === 'synthesis' && (
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

                  {/* Separator */}
                  <div className="border-t border-gray-800 pt-10 mb-10">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-2">
                      Limite de ce diagnostic
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-md">
                      Ce score repose sur les donnees declaratives saisies et les medianes sectorielles publiques
                      (Banque de France 2024, Altares). Il constitue un premier niveau de lecture.
                      Passer d'un diagnostic a un plan d'action priorise necessite un audit approfondi.
                    </p>
                  </div>

                  {/* CTAs — mission first, outil second */}
                  <div className="space-y-3">
                    <a
                      href="https://calendly.com/zineinsight"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between w-full px-6 py-5 bg-white text-slate-950 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <div>
                        <p className="text-sm font-semibold">Passer du diagnostic au plan d'action</p>
                        <p className="text-xs text-gray-500 mt-0.5">Echange strategique 30 min — confidentiel, sans engagement</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                    </a>

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

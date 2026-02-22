/**
 * SCORE FINSIGHT™ — DIAGNOSTIC DÉCLARATIF (0-100)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Module unifié consommé par :
 *   - /mon-diagnostic  (dashboard agrégateur, lit localStorage)
 *   - /diagnostic/guide (wizard, saisie live)
 *
 * Source unique de vérité pour :
 *   • Les benchmarks sectoriels (Banque de France 2024, Altares, INSEE)
 *   • Le scoring 4 piliers × 25 pts
 *   • Les insights contextualisés (forces, vulnérabilités, priorité, impact €)
 *   • Les helpers de scoring par indicateur
 *
 * Architecture CTO :
 *   Ce module est le "contrat client-side". Il sera progressivement
 *   remplacé par des appels à /api/v1/score quand les engines
 *   TRESORIS (Python) et DASHIS (TS) seront branchés.
 */

import type { Calculation, CalculatorType } from '@/hooks/useCalculatorHistory'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type SectorKey =
  | 'services-b2b'
  | 'commerce'
  | 'industrie'
  | 'saas-tech'
  | 'btp'
  | 'chr'
  | 'autre'

export interface SectorBenchmark {
  label: string
  // DSO médian en jours (source : Altares 2024)
  dsoMedian: number
  dsoGood: number    // < ce seuil = bon
  dsoBad: number     // > ce seuil = problématique
  // Taux de marge brute médian (%)
  margeMedian: number
  margeBon: number
  margeFaible: number
  // BFR en jours de CA médian
  bfrJoursMedian: number
  bfrJoursBon: number
  bfrJoursBad: number
  // Taux EBITDA/CA médian (%)
  ebitdaMedian: number
  // Ratio dette nette / EBITDA — seuils sectoriels
  gearingMedian: number
  gearingBon: number
  gearingCritique: number
}

export type PillarKey = 'cash' | 'margin' | 'resilience' | 'risk'

export interface PillarResult {
  score: number | null
  max: 25
  calculators: { type: CalculatorType; done: boolean }[]
  label: string
  sublabel: string
  color: string
  borderColor: string
  bgColor: string
}

export interface DiagnosticScore {
  total: number | null
  pillars: Record<PillarKey, PillarResult>
  level: 'excellent' | 'bon' | 'vigilance' | 'action' | 'incomplet'
  confidence: 'haute' | 'moyenne' | 'faible'
  completedPillars: number
}

export interface Insight {
  forces: string[]
  vulnerabilites: string[]
  priorite: string
  cashImpactLabel: string | null
  cashImpactDetail: string | null
}

/** Shape used by wizard live-scoring (results keyed by step id) */
export type WizardResults = Record<string, { value: number; inputs: Record<string, number> }>

export interface SynthesisResult {
  total: number | null
  level: string
  levelColor: string
  forces: string[]
  vulnerabilites: string[]
  priorite: string
  cashImpact: string | null
  /** 3 leviers chiffrés — nouveau */
  levers: SynthesisLever[]
}

export interface SynthesisLever {
  id: string
  label: string
  detail: string
  impact: string
  type: 'cash' | 'margin' | 'resilience'
}

export interface LevelConfig {
  label: string
  sublabel: string
  color: string
  bg: string
  border: string
  bar: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BENCHMARKS SECTORIELS — Sources : Banque de France 2024, INSEE, Altares
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SECTOR_BENCHMARKS: Record<SectorKey, SectorBenchmark> = {
  'services-b2b': {
    label: 'Services B2B',
    dsoMedian: 45, dsoGood: 35, dsoBad: 60,
    margeMedian: 55, margeBon: 45, margeFaible: 30,
    bfrJoursMedian: 30, bfrJoursBon: 20, bfrJoursBad: 50,
    ebitdaMedian: 12,
    gearingMedian: 2, gearingBon: 1.5, gearingCritique: 4,
  },
  commerce: {
    label: 'Commerce & Distribution',
    dsoMedian: 30, dsoGood: 20, dsoBad: 45,
    margeMedian: 30, margeBon: 22, margeFaible: 15,
    bfrJoursMedian: 35, bfrJoursBon: 20, bfrJoursBad: 55,
    ebitdaMedian: 5,
    gearingMedian: 2.5, gearingBon: 2, gearingCritique: 4.5,
  },
  industrie: {
    label: 'Industrie & Fabrication',
    dsoMedian: 55, dsoGood: 40, dsoBad: 75,
    margeMedian: 38, margeBon: 28, margeFaible: 18,
    bfrJoursMedian: 50, bfrJoursBon: 35, bfrJoursBad: 75,
    ebitdaMedian: 8,
    gearingMedian: 3, gearingBon: 2, gearingCritique: 5,
  },
  'saas-tech': {
    label: 'SaaS & Tech',
    dsoMedian: 25, dsoGood: 15, dsoBad: 45,
    margeMedian: 70, margeBon: 55, margeFaible: 35,
    bfrJoursMedian: 15, bfrJoursBon: 10, bfrJoursBad: 30,
    ebitdaMedian: 15,
    gearingMedian: 1.5, gearingBon: 1, gearingCritique: 3.5,
  },
  btp: {
    label: 'BTP & Construction',
    dsoMedian: 65, dsoGood: 50, dsoBad: 90,
    margeMedian: 22, margeBon: 15, margeFaible: 8,
    bfrJoursMedian: 45, bfrJoursBon: 30, bfrJoursBad: 70,
    ebitdaMedian: 5,
    gearingMedian: 3.5, gearingBon: 2.5, gearingCritique: 5.5,
  },
  chr: {
    label: 'Restauration & CHR',
    dsoMedian: 10, dsoGood: 5, dsoBad: 20,
    margeMedian: 68, margeBon: 60, margeFaible: 50,
    bfrJoursMedian: -5, bfrJoursBon: -10, bfrJoursBad: 15,
    ebitdaMedian: 10,
    gearingMedian: 3, gearingBon: 2, gearingCritique: 5,
  },
  autre: {
    label: 'Autre / Tous secteurs',
    dsoMedian: 45, dsoGood: 30, dsoBad: 60,
    margeMedian: 40, margeBon: 30, margeFaible: 20,
    bfrJoursMedian: 30, bfrJoursBon: 20, bfrJoursBad: 55,
    ebitdaMedian: 8,
    gearingMedian: 2.5, gearingBon: 2, gearingCritique: 4.5,
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEVEL CONFIG — couleurs et labels par niveau de score
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LEVEL_CONFIG: Record<DiagnosticScore['level'], LevelConfig> = {
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCORING HELPERS — fonctions unitaires réutilisables
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function scoreDSO(value: number, bench: SectorBenchmark): number {
  if (value <= bench.dsoGood) return 10
  if (value <= bench.dsoMedian) return 7
  if (value <= bench.dsoBad) return 4
  return 1
}

export function scoreBFR(value: number, ca: number, bench: SectorBenchmark): number {
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

export function scoreBurnRate(value: number, caMensuel: number): number {
  if (caMensuel > 0) {
    const pct = (value / caMensuel) * 100
    if (pct < 30) return 5
    if (pct < 60) return 3
    if (pct < 90) return 1
    return 0
  }
  if (value < 5_000) return 5
  if (value < 15_000) return 3
  if (value < 50_000) return 1
  return 0
}

export function scoreMarge(value: number, bench: SectorBenchmark): number {
  if (value >= bench.margeBon * 1.3) return 8
  if (value >= bench.margeBon) return 6
  if (value >= bench.margeMedian) return 4
  if (value >= bench.margeFaible) return 2
  return 1
}

export function scoreROI(value: number): number {
  if (value >= 100) return 7
  if (value >= 50) return 5
  if (value >= 20) return 3
  if (value >= 0) return 1
  return 0
}

export function scoreSeuil(tauxMarge: number, bench: SectorBenchmark): number {
  if (tauxMarge >= bench.margeBon) return 6
  if (tauxMarge >= bench.margeMedian) return 4
  if (tauxMarge >= bench.margeFaible) return 2
  return 1
}

export function scoreEBITDA(ebitdaValue: number, caAnnuel: number | null, bench: SectorBenchmark): number {
  if (caAnnuel && caAnnuel > 0) {
    const pct = (ebitdaValue / caAnnuel) * 100
    if (pct >= bench.ebitdaMedian * 1.5) return 4
    if (pct >= bench.ebitdaMedian) return 3
    if (pct > 0) return 2
    return 1
  }
  return ebitdaValue > 0 ? 4 : 1
}

export function scoreGearing(value: number, bench: SectorBenchmark): number {
  if (value <= 0) return 8
  if (value <= bench.gearingBon) return 7
  if (value <= bench.gearingMedian) return 5
  if (value <= bench.gearingCritique) return 2
  return 0
}

export function scoreCACLTV(value: number): number {
  if (value >= 3) return 10
  if (value >= 2) return 7
  if (value >= 1) return 3
  return 1
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// estimateCA — déduit le CA annuel depuis les données disponibles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function estimateCA(
  get: (t: CalculatorType) => Calculation | undefined,
): number | null {
  const bfrRaw = get('bfr')
  const seuilRaw = get('seuil-rentabilite')
  return bfrRaw?.inputs?.ca
    ? bfrRaw.inputs.ca
    : seuilRaw?.inputs?.chargesFixes && seuilRaw?.inputs?.tauxMarge
    ? Math.round(seuilRaw.inputs.chargesFixes / (seuilRaw.inputs.tauxMarge / 100))
    : null
}

export function estimateCAFromResults(results: WizardResults): number | null {
  if (results.bfr?.inputs.ca && results.bfr.inputs.ca > 0) return results.bfr.inputs.ca
  if (results.dso?.inputs.ca && results.dso.inputs.ca > 0) return results.dso.inputs.ca
  if (results['seuil-rentabilite']?.inputs.chargesFixes && results['seuil-rentabilite']?.inputs.tauxMarge) {
    return Math.round(results['seuil-rentabilite'].inputs.chargesFixes / (results['seuil-rentabilite'].inputs.tauxMarge / 100))
  }
  return null
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// computeDiagnosticScore — depuis localStorage history (pour /mon-diagnostic)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function computeDiagnosticScore(
  history: Calculation[],
  sector: SectorKey = 'autre',
): DiagnosticScore {
  const get = (t: CalculatorType) => history.find((c) => c.type === t)
  const bench = SECTOR_BENCHMARKS[sector]
  const caAnnuel = estimateCA(get)
  const caMensuel = caAnnuel ? caAnnuel / 12 : null

  // --- Pilier CASH (25 pts) ---
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
    if (dso) { maxPossible += 10; pts += scoreDSO(dso.value, bench) }
    if (bfr) { maxPossible += 10; pts += scoreBFR(bfr.value, bfr.inputs?.ca ?? 0, bench) }
    if (burnRate) { maxPossible += 5; pts += scoreBurnRate(burnRate.value, caMensuel ?? 0) }
    cashScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
  }

  // --- Pilier MARGIN (25 pts) ---
  const marge = get('marge')
  const ebitda = get('ebitda')
  const roi = get('roi')
  const seuil = get('seuil-rentabilite')
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
    if (marge) { maxPossible += 8; pts += scoreMarge(marge.value, bench) }
    if (roi) { maxPossible += 7; pts += scoreROI(roi.value) }
    if (seuil) { maxPossible += 6; pts += scoreSeuil(seuil.inputs?.tauxMarge ?? 0, bench) }
    if (ebitda) { maxPossible += 4; pts += scoreEBITDA(ebitda.value, caAnnuel, bench) }
    marginScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
  }

  // --- Pilier RÉSILIENCE (25 pts) ---
  const cacLtv = get('cac-ltv')
  const valorisation = get('valorisation')
  const gearing = get('gearing')
  const resilienceCalcs: { type: CalculatorType; done: boolean }[] = [
    { type: 'cac-ltv', done: !!cacLtv },
    { type: 'valorisation', done: !!valorisation },
    { type: 'gearing', done: !!gearing },
  ]
  const hasDerivedResilience = (dso && bfr) || (marge && (ebitda || seuil))
  const resilienceHasData = cacLtv || valorisation || gearing || hasDerivedResilience
  let resilienceScore: number | null = null
  if (resilienceHasData) {
    let pts = 0
    let maxPossible = 0
    if (cacLtv) { maxPossible += 10; pts += scoreCACLTV(cacLtv.value) }
    if (valorisation) {
      maxPossible += 8
      if (valorisation.value > 0 && caAnnuel && caAnnuel > 0) {
        const multCA = valorisation.value / caAnnuel
        pts += multCA >= 2 ? 8 : multCA >= 1 ? 6 : multCA >= 0.5 ? 3 : 1
      } else pts += valorisation.value > 0 ? 5 : 1
    }
    if (hasDerivedResilience) {
      maxPossible += 7
      let structPts = 7
      if (dso && dso.value > bench.dsoBad) structPts -= 2
      else if (dso && dso.value > bench.dsoMedian) structPts -= 1
      if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
        const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
        if (joursCA > bench.bfrJoursBad) structPts -= 2
        else if (joursCA > bench.bfrJoursMedian) structPts -= 1
      }
      if (ebitda && ebitda.value > 0) structPts += 1
      if (marge) {
        if (marge.value >= bench.margeBon) structPts += 1
        else if (marge.value < bench.margeFaible) structPts -= 1
      }
      pts += Math.max(0, Math.min(7, structPts))
    }
    if (gearing) { maxPossible += 8; pts += scoreGearing(gearing.value, bench) }
    resilienceScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
  }

  // --- Pilier RISQUES (25 pts) ---
  const riskCalcs: { type: CalculatorType; done: boolean }[] = [
    { type: 'dso', done: !!dso },
    { type: 'marge', done: !!marge },
    { type: 'seuil-rentabilite', done: !!seuil },
  ]
  const riskHasData = (dso || bfr) && (marge || seuil)
  let riskScore: number | null = null
  if (riskHasData) {
    let pts = 25
    if (dso && dso.value > bench.dsoBad) pts -= 5
    else if (dso && dso.value > bench.dsoMedian) pts -= 2
    if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
      const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
      if (joursCA > bench.bfrJoursBad) pts -= 6
      else if (joursCA > bench.bfrJoursMedian) pts -= 3
    }
    if (marge && marge.value < bench.margeFaible) pts -= 5
    else if (marge && marge.value < bench.margeMedian) pts -= 2
    if (seuil) {
      const tm = seuil.inputs?.tauxMarge
      if (tm && tm < bench.margeFaible * 0.7) pts -= 6
      else if (tm && tm < bench.margeFaible) pts -= 3
    }
    if (burnRate && caMensuel && caMensuel > 0) {
      const burnPct = (burnRate.value / caMensuel) * 100
      if (burnPct > 90) pts -= 5
      else if (burnPct > 70) pts -= 2
    }
    if (dso && dso.value > bench.dsoMedian && marge && marge.value < bench.margeMedian) pts -= 3
    if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0 && seuil) {
      const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
      const tm = seuil.inputs?.tauxMarge
      if (joursCA > bench.bfrJoursMedian && tm && tm < bench.margeFaible) pts -= 2
    }
    riskScore = Math.max(0, Math.min(25, pts))
  }

  // --- Assemblage ---
  const pillars: Record<PillarKey, PillarResult> = {
    cash: {
      score: cashScore, max: 25, calculators: cashCalcs,
      label: 'CASH', sublabel: 'Trésorerie et Liquidité',
      color: 'text-blue-600', borderColor: 'border-blue-200', bgColor: 'bg-blue-50',
    },
    margin: {
      score: marginScore, max: 25, calculators: marginCalcs,
      label: 'MARGIN', sublabel: 'Rentabilité et Croissance',
      color: 'text-emerald-600', borderColor: 'border-emerald-200', bgColor: 'bg-emerald-50',
    },
    resilience: {
      score: resilienceScore, max: 25, calculators: resilienceCalcs,
      label: 'RÉSILIENCE', sublabel: 'Stabilité Structurelle',
      color: 'text-purple-600', borderColor: 'border-purple-200', bgColor: 'bg-purple-50',
    },
    risk: {
      score: riskScore, max: 25, calculators: riskCalcs,
      label: 'RISQUES', sublabel: 'Anomalies et Croisements',
      color: 'text-amber-600', borderColor: 'border-amber-200', bgColor: 'bg-amber-50',
    },
  }

  const scored = Object.values(pillars).filter((p) => p.score !== null)
  const completedPillars = scored.length
  let total: number | null = null
  if (completedPillars > 0) {
    const sum = scored.reduce((acc, p) => acc + (p.score ?? 0), 0)
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// computeLiveScores — pour le wizard (sidebar live-update)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function computeLiveScores(
  results: WizardResults,
  bench: SectorBenchmark,
): Record<PillarKey, number | null> {
  const scores: Record<PillarKey, number | null> = {
    cash: null, margin: null, resilience: null, risk: null,
  }

  // Cash
  let cashPts = 0, cashMax = 0
  if (results.dso) { cashMax += 10; cashPts += scoreDSO(results.dso.value, bench) }
  if (results.bfr) { cashMax += 10; cashPts += scoreBFR(results.bfr.value, results.bfr.inputs.ca || 0, bench) }
  if (results['burn-rate']) {
    cashMax += 5
    const ca = results.bfr?.inputs.ca || results.dso?.inputs.ca || 0
    cashPts += scoreBurnRate(results['burn-rate'].value, ca / 12)
  }
  if (cashMax > 0) scores.cash = Math.round((cashPts / cashMax) * 25)

  // Margin
  let marginPts = 0, marginMax = 0
  if (results.marge) { marginMax += 8; marginPts += scoreMarge(results.marge.value, bench) }
  if (results['seuil-rentabilite']) { marginMax += 6; marginPts += scoreSeuil(results['seuil-rentabilite'].inputs.tauxMarge || 0, bench) }
  if (results.roi) { marginMax += 7; marginPts += scoreROI(results.roi.value) }
  if (marginMax > 0) scores.margin = Math.round((marginPts / marginMax) * 25)

  // Resilience
  let resPts = 0, resMax = 0
  if (results.ebitda) {
    const ca = results.ebitda.inputs.ca || 0
    if (ca > 0) { resMax += 4; resPts += scoreEBITDA(results.ebitda.value, ca, bench) }
  }
  if (results['cac-ltv']) { resMax += 10; resPts += scoreCACLTV(results['cac-ltv'].value) }
  if (results.gearing) { resMax += 8; resPts += scoreGearing(results.gearing.value, bench) }
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
    if (results.dso && results.dso.value > bench.dsoMedian && results.marge && results.marge.value < bench.margeMedian) pts -= 3
    if (results.gearing && results.gearing.value > bench.gearingCritique) pts -= 4
    else if (results.gearing && results.gearing.value > bench.gearingMedian) pts -= 2
    scores.risk = Math.max(0, Math.min(25, pts))
  }

  return scores
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// computeInsights — pour /mon-diagnostic (depuis localStorage)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function computeInsights(
  diagnostic: DiagnosticScore,
  history: Calculation[],
  sector: SectorKey,
): Insight {
  const bench = SECTOR_BENCHMARKS[sector]
  const get = (t: CalculatorType) => history.find((c) => c.type === t)

  const dso = get('dso')
  const bfr = get('bfr')
  const marge = get('marge')
  const ebitda = get('ebitda')
  const burnRate = get('burn-rate')
  const seuil = get('seuil-rentabilite')
  const cacLtv = get('cac-ltv')
  const caAnnuel = estimateCA(get)

  const forces: string[] = []
  const vulnerabilites: string[] = []

  // ── Forces
  if (dso && dso.value <= bench.dsoGood)
    forces.push(`DSO de ${dso.value}j — encaissements rapides vs médiane sectorielle de ${bench.dsoMedian}j`)
  if (bfr && bfr.value < 0)
    forces.push('BFR négatif — votre activité génère de la trésorerie avant de payer vos fournisseurs')
  else if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
    const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
    if (joursCA <= bench.bfrJoursBon)
      forces.push(`BFR de ${joursCA}j de CA — maîtrisé vs médiane ${bench.bfrJoursMedian}j dans votre secteur`)
  }
  if (marge && marge.value >= bench.margeBon)
    forces.push(`Taux de marge de ${marge.value}% — au-dessus de la médiane sectorielle (${bench.margeMedian}%)`)
  if (ebitda && caAnnuel && caAnnuel > 0) {
    const ebitdaPct = Math.round((ebitda.value / caAnnuel) * 100)
    if (ebitdaPct >= bench.ebitdaMedian)
      forces.push(`EBITDA à ${ebitdaPct}% du CA — coussin de rentabilité solide vs ${bench.ebitdaMedian}% médian`)
  }
  if (cacLtv && cacLtv.value >= 3)
    forces.push(`Ratio LTV/CAC de ${cacLtv.value.toFixed(1)}x — acquisition client très rentable`)
  if (burnRate && caAnnuel) {
    const burnPct = Math.round((burnRate.value / (caAnnuel / 12)) * 100)
    if (burnPct < 30)
      forces.push(`Burn Rate à ${burnPct}% du CA mensuel — consommation de cash très maîtrisée`)
  }
  if (diagnostic.pillars.cash.score !== null && diagnostic.pillars.cash.score >= 20)
    forces.push('Pilier CASH solide — trésorerie saine sur l\'ensemble des indicateurs')
  if (diagnostic.pillars.margin.score !== null && diagnostic.pillars.margin.score >= 20)
    forces.push('Rentabilité opérationnelle forte — structure de coûts efficiente')

  // ── Vulnérabilités
  if (dso && dso.value > bench.dsoBad)
    vulnerabilites.push(`DSO de ${dso.value}j — dépasse le seuil critique sectoriel (${bench.dsoBad}j) : risque de tension cash`)
  else if (dso && dso.value > bench.dsoMedian)
    vulnerabilites.push(`DSO de ${dso.value}j — au-dessus de la médiane (${bench.dsoMedian}j) : créances qui s'allongent`)
  if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
    const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
    if (joursCA > bench.bfrJoursBad)
      vulnerabilites.push(`BFR de ${joursCA}j de CA — nettement au-dessus du seuil sectoriel (${bench.bfrJoursBad}j) : exposition aux aléas`)
    else if (joursCA > bench.bfrJoursMedian)
      vulnerabilites.push(`BFR de ${joursCA}j de CA — dépasse la médiane sectorielle (${bench.bfrJoursMedian}j)`)
  }
  if (marge && marge.value < bench.margeFaible)
    vulnerabilites.push(`Taux de marge de ${marge.value}% — sous le seuil critique (${bench.margeFaible}%) : structure de coûts à revoir`)
  else if (marge && marge.value < bench.margeMedian)
    vulnerabilites.push(`Taux de marge de ${marge.value}% — sous la médiane sectorielle (${bench.margeMedian}%)`)
  if (burnRate && caAnnuel) {
    const burnPct = Math.round((burnRate.value / (caAnnuel / 12)) * 100)
    if (burnPct > 90)
      vulnerabilites.push(`Burn Rate à ${burnPct}% du CA mensuel — structure déficitaire : runway limité`)
    else if (burnPct > 70)
      vulnerabilites.push(`Burn Rate à ${burnPct}% du CA mensuel — peu de marge de manœuvre`)
  }
  if (dso && dso.value > bench.dsoMedian && marge && marge.value < bench.margeMedian)
    vulnerabilites.push('Double pression cash : délais clients longs + marge sous la médiane — risque structurel')
  if (diagnostic.pillars.risk.score !== null && diagnostic.pillars.risk.score < 12)
    vulnerabilites.push('Plusieurs signaux de risque croisés détectés — combinaison défavorable d\'indicateurs')

  // ── Priorité
  let priorite = ''
  const cashScore = diagnostic.pillars.cash.score
  const marginScoreVal = diagnostic.pillars.margin.score
  const riskScoreVal = diagnostic.pillars.risk.score

  if (dso && dso.value > bench.dsoBad && caAnnuel) {
    const gapJours = dso.value - bench.dsoMedian
    const impact = Math.round((gapJours / 365) * caAnnuel)
    priorite = `Réduire le DSO de ${gapJours}j pour libérer ${impact.toLocaleString('fr-FR')} € de trésorerie — c'est votre levier cash #1`
  } else if (marge && marge.value < bench.margeFaible) {
    priorite = `Améliorer la structure de coûts : votre marge de ${marge.value}% est sous le seuil critique (${bench.margeFaible}%) — revoir les achats ou la tarification`
  } else if (burnRate && caAnnuel && (burnRate.value / (caAnnuel / 12)) > 0.7) {
    priorite = `Réduire le Burn Rate : votre consommation mensuelle représente ${Math.round((burnRate.value / (caAnnuel / 12)) * 100)}% du CA — identifier les charges compressibles en priorité`
  } else if (cashScore !== null && cashScore < 12) {
    priorite = 'Renforcer la trésorerie en priorité : le pilier CASH est votre point de fragilité majeur — agir sur DSO et BFR'
  } else if (marginScoreVal !== null && marginScoreVal < 12) {
    priorite = 'Améliorer la rentabilité : le pilier MARGIN est sous les standards du secteur — revoir la structure de coûts et la tarification'
  } else if (riskScoreVal !== null && riskScoreVal < 15) {
    priorite = 'Adresser les signaux de risque croisés : plusieurs indicateurs combinés indiquent une fragilité structurelle à corriger avant qu\'elle s\'aggrave'
  } else if (forces.length > vulnerabilites.length) {
    priorite = 'Votre diagnostic est globalement solide — capitaliser sur les forces identifiées et surveiller les indicateurs à la marge'
  } else {
    priorite = 'Compléter le diagnostic avec les indicateurs manquants pour identifier la priorité avec précision'
  }

  // ── Impact cash immobilisé
  let cashImpactLabel: string | null = null
  let cashImpactDetail: string | null = null
  if (dso && dso.value > bench.dsoMedian && caAnnuel && caAnnuel > 0) {
    const gapJours = dso.value - bench.dsoMedian
    const impact = Math.round((gapJours / 365) * caAnnuel)
    cashImpactLabel = `≈ ${impact.toLocaleString('fr-FR')} €`
    cashImpactDetail = `${gapJours}j de DSO au-dessus de la médiane · CA ${(caAnnuel / 1_000_000).toFixed(2).replace('.', ',')} M€ · à libérer par optimisation des encaissements`
  }

  return {
    forces: forces.slice(0, 3),
    vulnerabilites: vulnerabilites.slice(0, 3),
    priorite,
    cashImpactLabel,
    cashImpactDetail,
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// computeSynthesis — pour /diagnostic/guide (wizard) — 3 LEVIERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function computeSynthesis(
  results: WizardResults,
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
    if (total >= 75) { level = 'Santé financière solide'; levelColor = 'text-emerald-400' }
    else if (total >= 55) { level = 'Dynamique favorable'; levelColor = 'text-blue-400' }
    else if (total >= 35) { level = 'Points de vigilance identifiés'; levelColor = 'text-amber-400' }
    else { level = 'Actions correctives recommandées'; levelColor = 'text-red-400' }
  }

  const forces: string[] = []
  const vulnerabilites: string[] = []

  if (results.dso) {
    if (results.dso.value <= bench.dsoGood)
      forces.push(`DSO de ${results.dso.value}j — encaissements rapides vs médiane sectorielle ${bench.dsoMedian}j`)
    else if (results.dso.value > bench.dsoBad)
      vulnerabilites.push(`DSO de ${results.dso.value}j — dépasse le seuil critique sectoriel (${bench.dsoBad}j)`)
    else if (results.dso.value > bench.dsoMedian)
      vulnerabilites.push(`DSO de ${results.dso.value}j — au-dessus de la médiane sectorielle (${bench.dsoMedian}j)`)
  }

  if (results.bfr) {
    if (results.bfr.value < 0) forces.push('BFR négatif — l\'activité génère de la trésorerie en amont')
    else if (results.bfr.inputs.ca && results.bfr.inputs.ca > 0) {
      const j = Math.round((results.bfr.value / results.bfr.inputs.ca) * 365)
      if (j <= bench.bfrJoursBon) forces.push(`BFR de ${j}j de CA — maîtrisé vs médiane ${bench.bfrJoursMedian}j`)
      else if (j > bench.bfrJoursBad) vulnerabilites.push(`BFR de ${j}j de CA — au-dessus du seuil sectoriel (${bench.bfrJoursBad}j)`)
    }
  }

  if (results.marge) {
    if (results.marge.value >= bench.margeBon) forces.push(`Taux de marge de ${results.marge.value}% — au-dessus du benchmark sectoriel (${bench.margeMedian}%)`)
    else if (results.marge.value < bench.margeFaible) vulnerabilites.push(`Taux de marge de ${results.marge.value}% — sous le seuil critique (${bench.margeFaible}%)`)
  }

  if (results.dso && results.dso.value > bench.dsoMedian && results.marge && results.marge.value < bench.margeMedian)
    vulnerabilites.push('Double pression cash : délais clients longs + marge sous la médiane')

  if (results.gearing) {
    if (results.gearing.value <= bench.gearingBon)
      forces.push(`Endettement maîtrisé (${results.gearing.value}x EBITDA) — sous la médiane sectorielle ${bench.gearingMedian}x`)
    else if (results.gearing.value > bench.gearingCritique)
      vulnerabilites.push(`Endettement critique (${results.gearing.value}x EBITDA) — au-dessus du seuil sectoriel ${bench.gearingCritique}x`)
    else if (results.gearing.value > bench.gearingMedian)
      vulnerabilites.push(`Endettement en zone de vigilance (${results.gearing.value}x EBITDA) — médiane sectorielle ${bench.gearingMedian}x`)
  }

  if (scores.cash !== null && scores.cash >= 20) forces.push('Pilier CASH solide — trésorerie saine')
  if (scores.margin !== null && scores.margin >= 20) forces.push('Rentabilité opérationnelle forte')

  // Priorité
  const ca = estimateCAFromResults(results)
  let priorite = ''
  if (results.dso && results.dso.value > bench.dsoBad && ca && ca > 0) {
    const gap = results.dso.value - bench.dsoMedian
    const impact = Math.round((gap / 365) * ca)
    priorite = `Réduire le DSO de ${gap}j pour libérer ${impact.toLocaleString('fr-FR')} € de trésorerie`
  } else if (results.marge && results.marge.value < bench.margeFaible) {
    priorite = `Revoir la structure de coûts : marge de ${results.marge.value}% sous le seuil critique (${bench.margeFaible}%)`
  } else if (results.gearing && results.gearing.value > bench.gearingCritique) {
    priorite = `Réduire l'endettement net (${results.gearing.value}x EBITDA) — seuil sectoriel dépassé (${bench.gearingCritique}x)`
  } else if (scores.cash !== null && scores.cash < 12) {
    priorite = 'Renforcer la trésorerie en priorité — pilier CASH fragile'
  } else if (scores.margin !== null && scores.margin < 12) {
    priorite = 'Améliorer la rentabilité — pilier MARGIN sous les standards sectoriels'
  } else if (forces.length > vulnerabilites.length) {
    priorite = 'Diagnostic globalement solide — capitaliser sur les forces identifiées'
  } else {
    priorite = 'Compléter le diagnostic pour identifier la priorité avec précision'
  }

  // Cash impact
  let cashImpact: string | null = null
  if (results.dso && results.dso.value > bench.dsoMedian && ca && ca > 0) {
    const gap = results.dso.value - bench.dsoMedian
    const impact = Math.round((gap / 365) * ca)
    cashImpact = `${impact.toLocaleString('fr-FR')} € immobilisés (${gap}j DSO au-dessus de la médiane)`
  }

  // ━━━ 3 LEVIERS CHIFFRÉS (NOUVEAU) ━━━
  const levers: SynthesisLever[] = []

  // Levier 1 : DSO → Cash libéré
  if (results.dso && results.dso.value > bench.dsoMedian && ca && ca > 0) {
    const gap = results.dso.value - bench.dsoMedian
    const impact = Math.round((gap / 365) * ca)
    levers.push({
      id: 'dso-cash',
      label: 'Optimiser les délais clients',
      detail: `Ramener le DSO de ${results.dso.value}j à ${bench.dsoMedian}j (médiane ${bench.label})`,
      impact: `+${impact.toLocaleString('fr-FR')} € de trésorerie libérée`,
      type: 'cash',
    })
  }

  // Levier 2 : Marge → Gain sur résultat
  if (results.marge && results.marge.value < bench.margeBon && ca && ca > 0) {
    const targetMargin = bench.margeBon
    const currentMargin = results.marge.value
    const gapPts = targetMargin - currentMargin
    const impactEur = Math.round((gapPts / 100) * ca)
    levers.push({
      id: 'marge-gain',
      label: 'Améliorer la marge brute',
      detail: `Passer de ${currentMargin}% à ${targetMargin}% (benchmark ${bench.label})`,
      impact: `+${impactEur.toLocaleString('fr-FR')} € de marge additionnelle / an`,
      type: 'margin',
    })
  }

  // Levier 3 : Seuil de rentabilité → Marge de sécurité
  if (results['seuil-rentabilite'] && ca && ca > 0) {
    const seuilCA = results['seuil-rentabilite'].value
    if (seuilCA > 0 && seuilCA < ca) {
      const marginSecurite = Math.round(((ca - seuilCA) / ca) * 100)
      const excessCA = Math.round(ca - seuilCA)
      levers.push({
        id: 'seuil-securite',
        label: 'Marge de sécurité sur le seuil de rentabilité',
        detail: `Seuil à ${seuilCA.toLocaleString('fr-FR')} € vs CA de ${ca.toLocaleString('fr-FR')} €`,
        impact: `${marginSecurite}% de marge de sécurité (${excessCA.toLocaleString('fr-FR')} € d'excédent)`,
        type: 'resilience',
      })
    } else if (seuilCA > 0 && seuilCA >= ca) {
      const deficit = Math.round(seuilCA - ca)
      levers.push({
        id: 'seuil-deficit',
        label: '⚠️ Seuil de rentabilité non atteint',
        detail: `Seuil à ${seuilCA.toLocaleString('fr-FR')} € vs CA de ${ca.toLocaleString('fr-FR')} €`,
        impact: `${deficit.toLocaleString('fr-FR')} € de CA supplémentaire requis pour atteindre l'équilibre`,
        type: 'resilience',
      })
    }
  }

  // Levier bonus : BFR si élevé
  if (levers.length < 3 && results.bfr && results.bfr.value > 0 && results.bfr.inputs.ca && results.bfr.inputs.ca > 0) {
    const joursCA = Math.round((results.bfr.value / results.bfr.inputs.ca) * 365)
    if (joursCA > bench.bfrJoursMedian) {
      const gapJ = joursCA - bench.bfrJoursMedian
      const impact = Math.round((gapJ / 365) * results.bfr.inputs.ca)
      levers.push({
        id: 'bfr-optimisation',
        label: 'Réduire le BFR',
        detail: `Passer de ${joursCA}j à ${bench.bfrJoursMedian}j de CA (médiane sectorielle)`,
        impact: `+${impact.toLocaleString('fr-FR')} € de cash libéré`,
        type: 'cash',
      })
    }
  }

  return {
    total,
    level,
    levelColor,
    forces: forces.slice(0, 3),
    vulnerabilites: vulnerabilites.slice(0, 3),
    priorite,
    cashImpact,
    levers: levers.slice(0, 3),
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// getBenchmarkHint — inline benchmark pour chaque champ du wizard
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface BenchmarkHint {
  label: string
  median: string
  critical: string
}

/**
 * Retourne le benchmark sectoriel pertinent pour un champ du wizard.
 * Retourne null si aucun benchmark n'est applicable au step/field.
 */
export function getBenchmarkHint(
  stepId: string,
  bench: SectorBenchmark,
): BenchmarkHint | null {
  switch (stepId) {
    case 'dso':
      return {
        label: `Médiane ${bench.label}`,
        median: `${bench.dsoMedian}j`,
        critical: `Seuil critique : ${bench.dsoBad}j`,
      }
    case 'bfr':
      return {
        label: `Médiane ${bench.label}`,
        median: `${bench.bfrJoursMedian}j de CA`,
        critical: `Seuil critique : ${bench.bfrJoursBad}j de CA`,
      }
    case 'marge':
      return {
        label: `Médiane ${bench.label}`,
        median: `${bench.margeMedian}%`,
        critical: `Seuil critique : ${bench.margeFaible}%`,
      }
    case 'seuil-rentabilite':
      return {
        label: `Taux de marge médian ${bench.label}`,
        median: `${bench.margeMedian}%`,
        critical: `Seuil critique : ${bench.margeFaible}%`,
      }
    case 'ebitda':
      return {
        label: `EBITDA/CA médian ${bench.label}`,
        median: `${bench.ebitdaMedian}%`,
        critical: `Seuil d'alerte : < 3%`,
      }
    case 'gearing':
      return {
        label: `Médiane ${bench.label}`,
        median: `${bench.gearingMedian}x`,
        critical: `Seuil critique : ${bench.gearingCritique}x`,
      }
    default:
      return null
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// getContextualCTA — CTA adapté selon le score
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ContextualCTA {
  label: string
  sublabel: string
  price: string
  href: string
  urgency: 'high' | 'medium' | 'low'
}

export function getContextualCTA(score: number | null): ContextualCTA {
  if (score === null || score < 40) {
    return {
      label: 'Audit correctif prioritaire',
      sublabel: 'Diagnostic approfondi + plan de redressement cash sous 72h',
      price: '2 490 €',
      href: 'https://calendly.com/zineinsight',
      urgency: 'high',
    }
  }
  if (score < 65) {
    return {
      label: 'Diagnostic approfondi 90 jours',
      sublabel: 'Analyse complète + pilotage trimestriel + tableau de bord DAF',
      price: '6 990 €',
      href: 'https://calendly.com/zineinsight',
      urgency: 'medium',
    }
  }
  return {
    label: 'Optimisation des leviers',
    sublabel: 'Plan sur mesure pour maximiser votre score — croissance et optimisation',
    price: 'Sur mesure',
    href: 'https://calendly.com/zineinsight',
    urgency: 'low',
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Format helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function formatValue(value: number, unit: string): string {
  if (unit === '€' || unit === '€/mois') return `${value.toLocaleString('fr-FR')} ${unit}`
  if (unit === '%') return `${value.toLocaleString('fr-FR')}%`
  if (unit === 'jours') return `${value} jours`
  if (unit === 'x') return `${value}x`
  return `${value}`
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function timeAgo(dateStr: string): string {
  const diffD = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (diffD === 0) return "Aujourd'hui"
  if (diffD === 1) return 'Hier'
  if (diffD < 30) return `Il y a ${diffD} jours`
  return `Il y a ${Math.floor(diffD / 30)} mois`
}

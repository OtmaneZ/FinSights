/**
 * SCORE FINSIGHT™ - DIAGNOSTIC DÉCLARATIF (0-100)
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
import { getBenchmarkBySecteur } from '@/lib/benchmarks/bdf-sectoriels'
import { DSO_BENCHMARKS, resolveDsoSectorKey, type DsoSectorKey } from '@/lib/benchmarks/dso-sectoriels'
import { getMultiplesByBdfCode } from '@/lib/benchmarks/multiples-valorisation'

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
  // Ratio dette nette / EBITDA - seuils sectoriels
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

/** Valeurs saisies dans le wizard (numériques ou texte - questions stratégiques). */
export type WizardInputValue = number | string

export type ScorisLevel = 'standard' | 'strategique'

export interface ZScoreZoneResult {
  zone: 'danger' | 'grise' | 'saine'
  label: string
  /** Couleur sémantique UI - indicateur Altman distinct du score /100 */
  color: 'red' | 'orange' | 'green'
}

export interface DiagnosticScore {
  total: number | null
  pillars: Record<PillarKey, PillarResult>
  level: 'excellent' | 'bon' | 'vigilance' | 'action' | 'incomplet'
  confidence: 'haute' | 'moyenne' | 'faible'
  completedPillars: number
  /** Présent uniquement pour SCORIS Stratégique lorsque le Z-Score est calculable */
  zScore?: number | null
  zZone?: ZScoreZoneResult | null
}

export interface Insight {
  forces: string[]
  vulnerabilites: string[]
  priorite: string
  cashImpactLabel: string | null
  cashImpactDetail: string | null
}

/** Shape used by wizard live-scoring (results keyed by step id) */
export type WizardResults = Record<string, { value: number; inputs: Record<string, WizardInputValue> }>

export interface SynthesisResult {
  total: number | null
  level: string
  levelColor: string
  forces: string[]
  vulnerabilites: string[]
  priorite: string
  cashImpact: string | null
  /** 3 leviers chiffrés - nouveau */
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
// BENCHMARKS SECTORIELS - Sources : Banque de France 2024, INSEE, Altares
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function dsoBench(key: DsoSectorKey) {
  const b = DSO_BENCHMARKS[key]
  return { dsoMedian: b.median, dsoGood: b.good, dsoBad: b.bad }
}

/** Mappe le secteur stocké par le calculateur DSO vers SectorKey diagnostic. */
export function mapDsoSectorToSectorKey(secteur: string): SectorKey {
  const resolved = resolveDsoSectorKey(secteur)
  if (resolved && resolved in SECTOR_BENCHMARKS) {
    return resolved as SectorKey
  }
  return 'autre'
}

export const SECTOR_BENCHMARKS: Record<SectorKey, SectorBenchmark> = {
  'services-b2b': {
    label: 'Services B2B',
    ...dsoBench('services-b2b'),
    margeMedian: 55, margeBon: 45, margeFaible: 30,
    bfrJoursMedian: 30, bfrJoursBon: 20, bfrJoursBad: 50,
    ebitdaMedian: 12,
    gearingMedian: 2, gearingBon: 1.5, gearingCritique: 4,
  },
  commerce: {
    label: 'Commerce & Distribution',
    ...dsoBench('commerce'),
    margeMedian: 30, margeBon: 22, margeFaible: 15,
    bfrJoursMedian: 35, bfrJoursBon: 20, bfrJoursBad: 55,
    ebitdaMedian: 5,
    gearingMedian: 2.5, gearingBon: 2, gearingCritique: 4.5,
  },
  industrie: {
    label: 'Industrie & Fabrication',
    ...dsoBench('industrie'),
    margeMedian: 38, margeBon: 28, margeFaible: 18,
    bfrJoursMedian: 50, bfrJoursBon: 35, bfrJoursBad: 75,
    ebitdaMedian: 8,
    gearingMedian: 3, gearingBon: 2, gearingCritique: 5,
  },
  'saas-tech': {
    label: 'SaaS & Tech',
    ...dsoBench('saas-tech'),
    margeMedian: 70, margeBon: 55, margeFaible: 35,
    bfrJoursMedian: 15, bfrJoursBon: 10, bfrJoursBad: 30,
    ebitdaMedian: 15,
    gearingMedian: 1.5, gearingBon: 1, gearingCritique: 3.5,
  },
  btp: {
    label: 'BTP & Construction',
    ...dsoBench('btp'),
    margeMedian: 22, margeBon: 15, margeFaible: 8,
    bfrJoursMedian: 45, bfrJoursBon: 30, bfrJoursBad: 70,
    ebitdaMedian: 5,
    gearingMedian: 3.5, gearingBon: 2.5, gearingCritique: 5.5,
  },
  chr: {
    label: 'Restauration & CHR',
    ...dsoBench('chr'),
    margeMedian: 68, margeBon: 60, margeFaible: 50,
    bfrJoursMedian: -5, bfrJoursBon: -10, bfrJoursBad: 15,
    ebitdaMedian: 10,
    gearingMedian: 3, gearingBon: 2, gearingCritique: 5,
  },
  autre: {
    label: 'Autre / Tous secteurs',
    ...dsoBench('autre'),
    margeMedian: 40, margeBon: 30, margeFaible: 20,
    bfrJoursMedian: 30, bfrJoursBon: 20, bfrJoursBad: 55,
    ebitdaMedian: 8,
    gearingMedian: 2.5, gearingBon: 2, gearingCritique: 4.5,
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEVEL CONFIG - couleurs et labels par niveau de score
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
// SCORING HELPERS - fonctions unitaires réutilisables
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Points partiels : multiple EBITDA vs médiane M&A du secteur (calculateur valorisation). */
export function scoreValorisationMultiple(multiple: number, medianMultiple: number): number {
  if (medianMultiple <= 0) return multiple > 0 ? 4 : 1
  const ratio = multiple / medianMultiple
  if (ratio >= 1.15) return 8
  if (ratio >= 1.0) return 6
  if (ratio >= 0.85) return 4
  return 2
}

export function scoreDSO(value: number, bench: SectorBenchmark): number {
  if (value <= bench.dsoGood) return 10
  if (value <= bench.dsoMedian) return 7
  if (value <= bench.dsoBad) return 4
  return 1
}

export function scoreBFR(value: number, ca: number, bench: SectorBenchmark): number {
  if (value <= 15) return 10
  if (value <= 30) return 7
  if (value <= 45) return 4
  return 1
}

export function scoreBurnRate(value: number, caMensuel: number): number {
  if (value >= 6) return 5
  if (value >= 3) return 3
  if (value >= 1) return 1
  return 0
}

export function scoreMarge(value: number, bench: SectorBenchmark): number {
  if (value >= 55) return 8
  if (value >= 40) return 6
  if (value >= 30) return 4
  if (value >= 20) return 2
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
  if (tauxMarge >= 30) return 6
  if (tauxMarge >= 15) return 4
  if (tauxMarge >= 0) return 2
  return 0
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
  if (value <= 1) return 8
  if (value <= 2) return 6
  if (value <= 3) return 3
  return 0
}

export function scoreCACLTV(value: number): number {
  if (value >= 3) return 10
  if (value >= 2) return 7
  if (value >= 1) return 3
  return 1
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// estimateCA - déduit le CA annuel depuis les données disponibles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function estimateCA(
  get: (t: CalculatorType) => Calculation | undefined,
): number | null {
  const dsoRaw = get('dso')
  const bfrRaw = get('bfr')
  const seuilRaw = get('seuil-rentabilite')
  const ebitdaRaw = get('ebitda')
  const dsoCa = dsoRaw?.inputs?.caAnnuel ?? dsoRaw?.inputs?.ca
  return dsoCa
    ? dsoCa
    : bfrRaw?.inputs?.caAnnuel
    ? bfrRaw.inputs.caAnnuel
    : seuilRaw?.inputs?.caAnnuel
    ? seuilRaw.inputs.caAnnuel
    : ebitdaRaw?.inputs?.ca
    ? ebitdaRaw.inputs.ca
    : null
}

export function estimateCAFromResults(results: WizardResults): number | null {
  const pick = (v: WizardInputValue | undefined): number | null => {
    const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/\s/g, '').replace(',', '.'))
    return Number.isFinite(n) && n > 0 ? n : null
  }
  return (
    pick(results.company?.inputs?.caAnnuel) ??
    pick(results.dso?.inputs?.caAnnuel) ??
    pick(results.bfr?.inputs?.caAnnuel) ??
    pick(results['seuil-rentabilite']?.inputs?.caAnnuel)
  )
}

export function numericInput(v: WizardInputValue | number | undefined | null, fallback = 0): number {
  if (v === undefined || v === null) return fallback
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback
  const p = parseFloat(String(v).replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(p) ? p : fallback
}

/** CA au dénominateur pour les ratios BFR (legacy `ca` ou wizard `caAnnuel`). */
export function bfrDenominatorCA(inputs: Record<string, WizardInputValue> | undefined): number {
  if (!inputs) return 0
  return numericInput(inputs.ca ?? inputs.caAnnuel, 0)
}

/**
 * Compte les mots (séparateurs espaces) pour les champs textarea du volet stratégique.
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Z-Score Altman (approximation déclarative - indicateur séparé du score SCORIS /100).
 * X2 = 0 car le résultat non réinvesti n'est pas saisi.
 */
export function computeZScore(
  results: WizardResults,
  scorisLevel: ScorisLevel | null,
): { zScore: number; zZone: ZScoreZoneResult } | null {
  if (scorisLevel !== 'strategique') return null

  const rawActif = results['strategic-actif-total']?.inputs?.actifTotal
  const rawCp = results['strategic-capitaux']?.inputs?.capitauxPropres
  const actifTotal =
    typeof rawActif === 'number'
      ? rawActif
      : parseFloat(String(rawActif ?? '').replace(/\s/g, '').replace(',', '.'))
  const capitauxPropres =
    typeof rawCp === 'number'
      ? rawCp
      : parseFloat(String(rawCp ?? '').replace(/\s/g, '').replace(',', '.'))

  if (!Number.isFinite(actifTotal) || actifTotal <= 0) return null

  const caAnnuel = estimateCAFromResults(results) ?? 0
  const margeBrute = Number(results['seuil-rentabilite']?.inputs?.margeBrute ?? results.marge?.value ?? 0)
  const chargesFixesMensuelles = Number(results['seuil-rentabilite']?.inputs?.chargesFixesMensuelles ?? 0)

  const bfrEuros = Number(results.bfr?.value ?? 0)

  const X1 = bfrEuros / actifTotal
  const X2 = 0
  const X3 = (caAnnuel * (margeBrute / 100) - chargesFixesMensuelles * 12) / actifTotal
  const dettes = actifTotal - capitauxPropres
  const X4 =
    dettes > 0 && Number.isFinite(capitauxPropres) ? capitauxPropres / dettes : 0
  const X5 = caAnnuel / actifTotal

  const Z = 0.717 * X1 + 0.847 * X2 + 3.107 * X3 + 0.42 * X4 + 0.998 * X5

  let zZone: ZScoreZoneResult
  if (Z < 1.23) {
    zZone = { zone: 'danger', label: 'Zone de danger', color: 'red' }
  } else if (Z <= 2.9) {
    zZone = { zone: 'grise', label: "Zone d'incertitude", color: 'orange' }
  } else {
    zZone = { zone: 'saine', label: 'Zone saine', color: 'green' }
  }

  return { zScore: Z, zZone }
}

/** Détail des composantes Altman (poids × Xi) pour PDF / audit. X2 = 0 (non saisi). */
export interface ZScoreBreakdownRow {
  indicateur: string
  valeur: number
  poids: number
  contribution: number
}

export function computeZScoreBreakdownFromInputs(params: {
  actifTotal: number
  capitauxPropres: number
  bfrEuros: number
  caAnnuel: number
  margeBrute: number
  chargesFixesMensuelles: number
}): {
  rows: ZScoreBreakdownRow[]
  zScore: number
  zZone: ZScoreZoneResult
} | null {
  const actifTotal = params.actifTotal
  if (!Number.isFinite(actifTotal) || actifTotal <= 0) return null

  const capitauxPropres = Number.isFinite(params.capitauxPropres) ? params.capitauxPropres : 0
  const bfrEuros = Number.isFinite(params.bfrEuros) ? params.bfrEuros : 0
  const caAnnuel = Number.isFinite(params.caAnnuel) ? params.caAnnuel : 0
  const margeBrute = Number.isFinite(params.margeBrute) ? params.margeBrute : 0
  const chargesFixesMensuelles = Number.isFinite(params.chargesFixesMensuelles)
    ? params.chargesFixesMensuelles
    : 0

  const X1 = bfrEuros / actifTotal
  const X2 = 0
  const X3 = (caAnnuel * (margeBrute / 100) - chargesFixesMensuelles * 12) / actifTotal
  const dettes = actifTotal - capitauxPropres
  const X4 = dettes > 0 && Number.isFinite(capitauxPropres) ? capitauxPropres / dettes : 0
  const X5 = caAnnuel / actifTotal

  const w1 = 0.717
  const w2 = 0.847
  const w3 = 3.107
  const w4 = 0.42
  const w5 = 0.998

  const c1 = w1 * X1
  const c2 = w2 * X2
  const c3 = w3 * X3
  const c4 = w4 * X4
  const c5 = w5 * X5

  const Z = c1 + c2 + c3 + c4 + c5

  let zZone: ZScoreZoneResult
  if (Z < 1.23) {
    zZone = { zone: 'danger', label: 'Zone de danger', color: 'red' }
  } else if (Z <= 2.9) {
    zZone = { zone: 'grise', label: "Zone d'incertitude", color: 'orange' }
  } else {
    zZone = { zone: 'saine', label: 'Zone saine', color: 'green' }
  }

  const rows: ZScoreBreakdownRow[] = [
    { indicateur: 'BFR / Actif (X1)', valeur: X1, poids: w1, contribution: c1 },
    { indicateur: 'Résultat réinvesti / Actif (X2)', valeur: X2, poids: w2, contribution: c2 },
    {
      indicateur: 'Résultat d\'exploitation approx. / Actif (X3)',
      valeur: X3,
      poids: w3,
      contribution: c3,
    },
    { indicateur: 'Capitaux propres / Dettes (X4)', valeur: X4, poids: w4, contribution: c4 },
    { indicateur: 'CA / Actif (X5)', valeur: X5, poids: w5, contribution: c5 },
  ]

  return { rows, zScore: Z, zZone }
}

/** Fusionne Z-Score dans le diagnostic lorsque le niveau Stratégique et les données le permettent. */
export function enrichDiagnosticWithZScore(
  diagnostic: DiagnosticScore,
  results: WizardResults,
  scorisLevel: ScorisLevel | null,
): DiagnosticScore {
  const z = computeZScore(results, scorisLevel)
  if (!z) return diagnostic
  return { ...diagnostic, zScore: z.zScore, zZone: z.zZone }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// computeDiagnosticScore - depuis localStorage history (pour /mon-diagnostic)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** @deprecated Utiliser calculateUnifiedScore depuis unifiedScoreEngine.ts */
export function computeDiagnosticScore(
  history: Calculation[],
  sector: SectorKey = 'autre',
): DiagnosticScore {
  const get = (t: CalculatorType) => history.find((c) => c.type === t)
  const dsoEntry = get('dso')
  const effectiveSector: SectorKey =
    dsoEntry?.secteur != null && dsoEntry.secteur.length > 0
      ? mapDsoSectorToSectorKey(dsoEntry.secteur)
      : sector
  const bench = SECTOR_BENCHMARKS[effectiveSector]

  const dso = get('dso')
  const bfr = get('bfr')
  const marge = get('marge')
  const seuil = get('seuil-rentabilite')
  const gearing = get('gearing')
  const ebitda = get('ebitda')
  const valCalc = get('valorisation')

  const caAnnuel =
    dso?.inputs?.caAnnuel ||
    dso?.inputs?.ca ||
    bfr?.inputs?.caAnnuel ||
    seuil?.inputs?.caAnnuel ||
    marge?.inputs?.caAnnuel ||
    gearing?.inputs?.caAnnuel ||
    ebitda?.inputs?.ca ||
    null

  const joursClients = dso?.inputs?.joursClients ?? dso?.value ?? 0
  const joursFournisseurs = dso?.inputs?.joursFournisseurs ?? 0
  const bfrJours = bfr?.inputs?.bfrJours ?? (joursClients - joursFournisseurs)
  const margeBrute = seuil?.inputs?.margeBrute ?? marge?.value ?? 0
  const chargesFixesMensuelles = seuil?.inputs?.chargesFixesMensuelles ?? 0
  const soldeBancaire = dso?.inputs?.soldeBancaire ?? 0
  const runwayMonths = soldeBancaire > 0 && chargesFixesMensuelles > 0 ? soldeBancaire / chargesFixesMensuelles : null

  const concentrationClient = gearing?.inputs?.concentrationClient ?? 0
  const nombreClients = gearing?.inputs?.nombreClients ?? 0
  const detteBancaire = gearing?.inputs?.detteBancaire ?? 0

  const cashCalcs: { type: CalculatorType; done: boolean }[] = [
    { type: 'dso', done: !!dso },
    { type: 'bfr', done: !!bfr || !!dso },
    { type: 'seuil-rentabilite', done: runwayMonths !== null },
  ]

  let cashScore: number | null = null
  if (dso || bfr || runwayMonths !== null) {
    let pts = 0
    let maxPossible = 0
    if (dso || joursClients > 0) {
      maxPossible += 10
      pts += scoreDSO(joursClients, bench)
    }
    if ((bfr || dso) && Number.isFinite(bfrJours)) {
      maxPossible += 10
      pts += scoreBFR(bfrJours, 0, bench)
    }
    if (runwayMonths !== null) {
      maxPossible += 5
      pts += scoreBurnRate(runwayMonths, 0)
    }
    cashScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
  }

  const marginCalcs: { type: CalculatorType; done: boolean }[] = [
    { type: 'marge', done: !!marge || margeBrute > 0 },
    { type: 'seuil-rentabilite', done: !!seuil },
  ]

  let marginScore: number | null = null
  if (margeBrute > 0 || !!seuil) {
    let pts = 0
    let maxPossible = 0
    if (margeBrute > 0) {
      maxPossible += 8
      pts += scoreMarge(margeBrute, bench)
    }
    if (seuil && caAnnuel && caAnnuel > 0) {
      const margeSecurite = ((caAnnuel - seuil.value) / caAnnuel) * 100
      maxPossible += 6
      pts += scoreSeuil(margeSecurite, bench)
    }
    marginScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
  }

  const resilienceCalcs: { type: CalculatorType; done: boolean }[] = [
    { type: 'gearing', done: !!gearing },
    { type: 'marge', done: margeBrute > 0 },
    ...(valCalc ? [{ type: 'valorisation' as CalculatorType, done: true }] : []),
  ]

  let resilienceScore: number | null = null
  if (concentrationClient > 0 || nombreClients > 0 || detteBancaire > 0 || valCalc) {
    let pts = 0
    let maxPossible = 0

    if (concentrationClient > 0) {
      maxPossible += 10
      if (concentrationClient <= 20) pts += 10
      else if (concentrationClient <= 40) pts += 7
      else if (concentrationClient <= 60) pts += 4
      else pts += 1
    }

    if (nombreClients > 0) {
      maxPossible += 8
      if (nombreClients >= 20) pts += 8
      else if (nombreClients >= 10) pts += 6
      else if (nombreClients >= 5) pts += 4
      else pts += 2
    }

    if (detteBancaire > 0 && caAnnuel && caAnnuel > 0 && margeBrute > 0) {
      const gearingValue = detteBancaire / (caAnnuel * (margeBrute / 100))
      maxPossible += 8
      pts += scoreGearing(gearingValue, bench)
    }

    if (valCalc) {
      const multiple = valCalc.inputs.multiple ?? 0
      let medianMultiple = 6
      if (valCalc.secteur) {
        const bdfBench = getBenchmarkBySecteur(valCalc.secteur)
        const multRow = bdfBench ? getMultiplesByBdfCode(bdfBench.codeNaf) : null
        if (multRow) medianMultiple = multRow.multipleMedian
      }
      if (multiple > 0) {
        maxPossible += 8
        pts += scoreValorisationMultiple(multiple, medianMultiple)
      }
    }

    resilienceScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
  }

  const riskCalcs: { type: CalculatorType; done: boolean }[] = [
    { type: 'dso', done: !!dso },
    { type: 'marge', done: margeBrute > 0 },
    { type: 'seuil-rentabilite', done: !!seuil },
  ]

  const riskHasData = (dso || bfr) && (margeBrute > 0 || seuil)
  let riskScore: number | null = null
  if (riskHasData) {
    let pts = 25

    if (joursClients > bench.dsoBad) pts -= 5
    else if (joursClients > bench.dsoMedian) pts -= 2

    if (bfrJours > 45) pts -= 6
    else if (bfrJours > 30) pts -= 3

    if (margeBrute < 20) pts -= 5
    else if (margeBrute < 30) pts -= 2

    if (joursClients > bench.dsoMedian && margeBrute < bench.margeMedian) pts -= 3
    if (bfrJours > 45 && margeBrute < 30) pts -= 5

    if (concentrationClient > 60 && nombreClients < 5) pts -= 8
    else if (concentrationClient > 40) pts -= 4

    riskScore = Math.max(0, Math.min(25, pts))
  }

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
// computeLiveScores - pour le wizard (sidebar live-update)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function computeLiveScores(
  results: WizardResults,
  bench: SectorBenchmark,
): Record<PillarKey, number | null> {
  const scores: Record<PillarKey, number | null> = {
    cash: null, margin: null, resilience: null, risk: null,
  }

  const caAnnuel = estimateCAFromResults(results)

  const joursClients = numericInput(results.dso?.inputs.joursClients, numericInput(results.dso?.value, 0))
  const joursFournisseurs = numericInput(results.dso?.inputs.joursFournisseurs, 0)
  const bfrJours = numericInput(results.bfr?.inputs.bfrJours, joursClients - joursFournisseurs)
  const margeBrute = numericInput(results['seuil-rentabilite']?.inputs.margeBrute, numericInput(results.marge?.value, 0))
  const chargesFixesMensuelles = numericInput(results['seuil-rentabilite']?.inputs.chargesFixesMensuelles, 0)
  const soldeBancaire = numericInput(results.dso?.inputs.soldeBancaire, 0)

  const concentrationClient = numericInput(results.gearing?.inputs.concentrationClient, 0)
  const nombreClients = numericInput(results.gearing?.inputs.nombreClients, 0)
  const detteBancaire = numericInput(results.gearing?.inputs.detteBancaire, 0)

  // Cash
  let cashPts = 0, cashMax = 0
  if (joursClients > 0) { cashMax += 10; cashPts += scoreDSO(joursClients, bench) }
  if (results.bfr || results.dso) { cashMax += 10; cashPts += scoreBFR(bfrJours, 0, bench) }
  if (soldeBancaire > 0 && chargesFixesMensuelles > 0) {
    cashMax += 5
    cashPts += scoreBurnRate(soldeBancaire / chargesFixesMensuelles, 0)
  }
  if (cashMax > 0) scores.cash = Math.round((cashPts / cashMax) * 25)

  // Margin
  let marginPts = 0, marginMax = 0
  if (margeBrute > 0) { marginMax += 8; marginPts += scoreMarge(margeBrute, bench) }
  if (results['seuil-rentabilite'] && caAnnuel && caAnnuel > 0) {
    const seuilRentabilite = results['seuil-rentabilite'].value
    const margeSecurite = ((caAnnuel - seuilRentabilite) / caAnnuel) * 100
    marginMax += 6
    marginPts += scoreSeuil(margeSecurite, bench)
  }
  if (marginMax > 0) scores.margin = Math.round((marginPts / marginMax) * 25)

  // Resilience
  let resPts = 0, resMax = 0
  if (concentrationClient > 0) {
    resMax += 10
    if (concentrationClient <= 20) resPts += 10
    else if (concentrationClient <= 40) resPts += 7
    else if (concentrationClient <= 60) resPts += 4
    else resPts += 1
  }
  if (nombreClients > 0) {
    resMax += 8
    if (nombreClients >= 20) resPts += 8
    else if (nombreClients >= 10) resPts += 6
    else if (nombreClients >= 5) resPts += 4
    else resPts += 2
  }
  if (detteBancaire > 0 && caAnnuel && caAnnuel > 0 && margeBrute > 0) {
    const gearingValue = detteBancaire / (caAnnuel * (margeBrute / 100))
    resMax += 8
    resPts += scoreGearing(gearingValue, bench)
  }
  if (resMax > 0) scores.resilience = Math.round((resPts / resMax) * 25)

  // Risk
  if ((results.dso || results.bfr) && (margeBrute > 0 || results['seuil-rentabilite'])) {
    let pts = 25
    if (joursClients > bench.dsoBad) pts -= 5
    else if (joursClients > bench.dsoMedian) pts -= 2

    if (bfrJours > 45) pts -= 6
    else if (bfrJours > 30) pts -= 3

    if (margeBrute < 20) pts -= 5
    else if (margeBrute < 30) pts -= 2

    if (joursClients > bench.dsoMedian && margeBrute < bench.margeMedian) pts -= 3
    if (bfrJours > 45 && margeBrute < 30) pts -= 5

    if (concentrationClient > 60 && nombreClients < 5) pts -= 8
    else if (concentrationClient > 40) pts -= 4

    scores.risk = Math.max(0, Math.min(25, pts))
  }

  return scores
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// computeInsights - pour /mon-diagnostic (depuis localStorage)
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
    forces.push(`DSO de ${dso.value}j - encaissements rapides vs médiane sectorielle de ${bench.dsoMedian}j`)
  if (bfr && bfr.value < 0)
    forces.push('BFR négatif - votre activité génère de la trésorerie avant de payer vos fournisseurs')
  else if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
    const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
    if (joursCA <= bench.bfrJoursBon)
      forces.push(`BFR de ${joursCA}j de CA - maîtrisé vs médiane ${bench.bfrJoursMedian}j dans votre secteur`)
  }
  if (marge && marge.value >= bench.margeBon)
    forces.push(`Taux de marge de ${marge.value}% - au-dessus de la médiane sectorielle (${bench.margeMedian}%)`)
  if (ebitda && caAnnuel && caAnnuel > 0) {
    const ebitdaPct = Math.round((ebitda.value / caAnnuel) * 100)
    if (ebitdaPct >= bench.ebitdaMedian)
      forces.push(`EBITDA à ${ebitdaPct}% du CA - coussin de rentabilité solide vs ${bench.ebitdaMedian}% médian`)
  }
  if (cacLtv && cacLtv.value >= 3)
    forces.push(`Ratio LTV/CAC de ${cacLtv.value.toFixed(1)}x - acquisition client très rentable`)
  if (burnRate && caAnnuel) {
    const burnPct = Math.round((burnRate.value / (caAnnuel / 12)) * 100)
    if (burnPct < 30)
      forces.push(`Burn Rate à ${burnPct}% du CA mensuel - consommation de cash très maîtrisée`)
  }
  if (diagnostic.pillars.cash.score !== null && diagnostic.pillars.cash.score >= 20)
    forces.push('Pilier CASH solide - trésorerie saine sur l\'ensemble des indicateurs')
  if (diagnostic.pillars.margin.score !== null && diagnostic.pillars.margin.score >= 20)
    forces.push('Rentabilité opérationnelle forte - structure de coûts efficiente')

  // ── Vulnérabilités
  if (dso && dso.value > bench.dsoBad)
    vulnerabilites.push(`DSO de ${dso.value}j - dépasse le seuil critique sectoriel (${bench.dsoBad}j) : risque de tension cash`)
  else if (dso && dso.value > bench.dsoMedian)
    vulnerabilites.push(`DSO de ${dso.value}j - au-dessus de la médiane (${bench.dsoMedian}j) : créances qui s'allongent`)
  if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
    const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
    if (joursCA > bench.bfrJoursBad)
      vulnerabilites.push(`BFR de ${joursCA}j de CA - nettement au-dessus du seuil sectoriel (${bench.bfrJoursBad}j) : exposition aux aléas`)
    else if (joursCA > bench.bfrJoursMedian)
      vulnerabilites.push(`BFR de ${joursCA}j de CA - dépasse la médiane sectorielle (${bench.bfrJoursMedian}j)`)
  }
  if (marge && marge.value < bench.margeFaible)
    vulnerabilites.push(`Taux de marge de ${marge.value}% - sous le seuil critique (${bench.margeFaible}%) : structure de coûts à revoir`)
  else if (marge && marge.value < bench.margeMedian)
    vulnerabilites.push(`Taux de marge de ${marge.value}% - sous la médiane sectorielle (${bench.margeMedian}%)`)
  if (burnRate && caAnnuel) {
    const burnPct = Math.round((burnRate.value / (caAnnuel / 12)) * 100)
    if (burnPct > 90)
      vulnerabilites.push(`Burn Rate à ${burnPct}% du CA mensuel - structure déficitaire : runway limité`)
    else if (burnPct > 70)
      vulnerabilites.push(`Burn Rate à ${burnPct}% du CA mensuel - peu de marge de manœuvre`)
  }
  if (dso && dso.value > bench.dsoMedian && marge && marge.value < bench.margeMedian)
    vulnerabilites.push('Double pression cash : délais clients longs + marge sous la médiane - risque structurel')
  if (diagnostic.pillars.risk.score !== null && diagnostic.pillars.risk.score < 12)
    vulnerabilites.push('Plusieurs signaux de risque croisés détectés - combinaison défavorable d\'indicateurs')

  // ── Priorité
  let priorite = ''
  const cashScore = diagnostic.pillars.cash.score
  const marginScoreVal = diagnostic.pillars.margin.score
  const riskScoreVal = diagnostic.pillars.risk.score

  if (dso && dso.value > bench.dsoBad && caAnnuel) {
    const gapJours = dso.value - bench.dsoMedian
    const impact = Math.round((gapJours / 365) * caAnnuel)
    priorite = `Réduire le DSO de ${gapJours}j pour libérer ${impact.toLocaleString('fr-FR')} € de trésorerie - c'est votre levier cash #1`
  } else if (marge && marge.value < bench.margeFaible) {
    priorite = `Améliorer la structure de coûts : votre marge de ${marge.value}% est sous le seuil critique (${bench.margeFaible}%) - revoir les achats ou la tarification`
  } else if (burnRate && caAnnuel && (burnRate.value / (caAnnuel / 12)) > 0.7) {
    priorite = `Réduire le Burn Rate : votre consommation mensuelle représente ${Math.round((burnRate.value / (caAnnuel / 12)) * 100)}% du CA - identifier les charges compressibles en priorité`
  } else if (cashScore !== null && cashScore < 12) {
    priorite = 'Renforcer la trésorerie en priorité : le pilier CASH est votre point de fragilité majeur - agir sur DSO et BFR'
  } else if (marginScoreVal !== null && marginScoreVal < 12) {
    priorite = 'Améliorer la rentabilité : le pilier MARGIN est sous les standards du secteur - revoir la structure de coûts et la tarification'
  } else if (riskScoreVal !== null && riskScoreVal < 15) {
    priorite = 'Adresser les signaux de risque croisés : plusieurs indicateurs combinés indiquent une fragilité structurelle à corriger avant qu\'elle s\'aggrave'
  } else if (forces.length > vulnerabilites.length) {
    priorite = 'Votre diagnostic est globalement solide - capitaliser sur les forces identifiées et surveiller les indicateurs à la marge'
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
// computeSynthesis - pour /diagnostic/guide (wizard) - 3 LEVIERS
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
      forces.push(`DSO de ${results.dso.value}j - encaissements rapides vs médiane sectorielle ${bench.dsoMedian}j`)
    else if (results.dso.value > bench.dsoBad)
      vulnerabilites.push(`DSO de ${results.dso.value}j - dépasse le seuil critique sectoriel (${bench.dsoBad}j)`)
    else if (results.dso.value > bench.dsoMedian)
      vulnerabilites.push(`DSO de ${results.dso.value}j - au-dessus de la médiane sectorielle (${bench.dsoMedian}j)`)
  }

  if (results.bfr) {
    if (results.bfr.value < 0) forces.push('BFR négatif - l\'activité génère de la trésorerie en amont')
    else if (bfrDenominatorCA(results.bfr.inputs) > 0) {
      const caD = bfrDenominatorCA(results.bfr.inputs)
      const j = Math.round((results.bfr.value / caD) * 365)
      if (j <= bench.bfrJoursBon) forces.push(`BFR de ${j}j de CA - maîtrisé vs médiane ${bench.bfrJoursMedian}j`)
      else if (j > bench.bfrJoursBad) vulnerabilites.push(`BFR de ${j}j de CA - au-dessus du seuil sectoriel (${bench.bfrJoursBad}j)`)
    }
  }

  if (results.marge) {
    if (results.marge.value >= bench.margeBon) forces.push(`Taux de marge de ${results.marge.value}% - au-dessus du benchmark sectoriel (${bench.margeMedian}%)`)
    else if (results.marge.value < bench.margeFaible) vulnerabilites.push(`Taux de marge de ${results.marge.value}% - sous le seuil critique (${bench.margeFaible}%)`)
  }

  if (results.dso && results.dso.value > bench.dsoMedian && results.marge && results.marge.value < bench.margeMedian)
    vulnerabilites.push('Double pression cash : délais clients longs + marge sous la médiane')

  if (results.gearing) {
    if (results.gearing.value <= bench.gearingBon)
      forces.push(`Endettement maîtrisé (${results.gearing.value}x EBITDA) - sous la médiane sectorielle ${bench.gearingMedian}x`)
    else if (results.gearing.value > bench.gearingCritique)
      vulnerabilites.push(`Endettement critique (${results.gearing.value}x EBITDA) - au-dessus du seuil sectoriel ${bench.gearingCritique}x`)
    else if (results.gearing.value > bench.gearingMedian)
      vulnerabilites.push(`Endettement en zone de vigilance (${results.gearing.value}x EBITDA) - médiane sectorielle ${bench.gearingMedian}x`)
  }

  if (scores.cash !== null && scores.cash >= 20) forces.push('Pilier CASH solide - trésorerie saine')
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
    priorite = `Réduire l'endettement net (${results.gearing.value}x EBITDA) - seuil sectoriel dépassé (${bench.gearingCritique}x)`
  } else if (scores.cash !== null && scores.cash < 12) {
    priorite = 'Renforcer la trésorerie en priorité - pilier CASH fragile'
  } else if (scores.margin !== null && scores.margin < 12) {
    priorite = 'Améliorer la rentabilité - pilier MARGIN sous les standards sectoriels'
  } else if (forces.length > vulnerabilites.length) {
    priorite = 'Diagnostic globalement solide - capitaliser sur les forces identifiées'
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
  if (levers.length < 3 && results.bfr && results.bfr.value > 0 && bfrDenominatorCA(results.bfr.inputs) > 0) {
    const caD = bfrDenominatorCA(results.bfr.inputs)
    const joursCA = Math.round((results.bfr.value / caD) * 365)
    if (joursCA > bench.bfrJoursMedian) {
      const gapJ = joursCA - bench.bfrJoursMedian
      const impact = Math.round((gapJ / 365) * caD)
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
// getBenchmarkHint - inline benchmark pour chaque champ du wizard
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
    case 'valorisation':
      return {
        label: `Multiple EBITDA — ${bench.label}`,
        median: 'Médiane M&A sectorielle (voir calculateur valorisation)',
        critical: 'Multiple sous la médiane : signal de décote pour acquéreurs',
      }
    default:
      return null
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// getContextualCTA - CTA adapté selon le score
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
    sublabel: 'Plan sur mesure pour maximiser votre score - croissance et optimisation',
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

/** Moteur de scoring unifié — transactionnel + déclaratif → UnifiedScore */

import type { ProcessedData } from '../dataModel'
import { generateSmartRecommendations } from '../ai/recommendations'
import {
  extractScoreFactors,
  calculateFinSightScore,
  type ScoreBreakdown,
  type ScoreFactors,
} from './finSightScore'
import { estimateCA, numericInput, computeDiagnosticScore, computeInsights } from './diagnosticScore'
import type { CalculatorType } from '@/hooks/useCalculatorHistory'
import type {
  UnifiedScore,
  UnifiedScoreInput,
  TransactionalInput,
  DeclarativeInput,
  UnifiedBreakdown,
  AltmanResult,
  ScoreLevel,
  ScoreConfidence,
  SectorKey,
  ScoringMode,
} from './types/unifiedScore'

// ── 1. ROUTER ────────────────────────────────────────────────────────────────

export async function calculateUnifiedScore(input: UnifiedScoreInput): Promise<UnifiedScore> {
  const f = input.mode === 'transactional' ? adaptTransactionalInput(input) : adaptDeclarativeInput(input)
  const cash = scoreCash(f)
  const margin = scoreMargin(f)
  const resilience = scoreResilience(f)
  const risk = scoreRisk(f)
  const done = [cash, margin, resilience, risk].filter((s): s is number => s !== null)
  const sum = done.reduce((a, b) => a + b, 0)
  const total = done.length > 0 ? Math.round((sum / (done.length * 25)) * 100) : 0
  const breakdown: UnifiedBreakdown = { cash: cash ?? 0, margin: margin ?? 0, resilience: resilience ?? 0, risk }
  const { insights, recommendations } = await resolveInsightsAndRecommendations(input, breakdown, f, resolveLevel(total))
  return {
    total,
    level: resolveLevel(total),
    confidence: resolveConfidence(f.dataCompleteness),
    breakdown,
    altman: computeAltman(f),
    mode: f.mode,
    sector: f.sector,
    insights,
    recommendations,
    calculatedAt: new Date(),
    dataCompleteness: f.dataCompleteness,
  }
}

// ── 2. NormalizedFeatures ────────────────────────────────────────────────────

interface NormalizedFeatures {
  runwayMonths: number | null
  netCashFlow: number | null
  dso: number | null
  marginPct: number | null
  revenueGrowthPct: number | null
  expenseGrowthPct: number | null
  fixedCostRatioPct: number | null
  topClientPct: number | null
  categoryCount: number | null
  anomalyCount: number
  criticalAnomalyCount: number
  volatility: number | null
  bfr: number | null
  actifTotal: number | null
  resultatExploitation: number | null
  capitauxPropres: number | null
  detteTotale: number | null
  ca: number | null
  resultatNetN1: number | null
  sector: SectorKey
  mode: ScoringMode
  dataCompleteness: number
}

const DECL_CALCS: CalculatorType[] = ['dso', 'bfr', 'marge', 'seuil-rentabilite', 'gearing', 'ebitda', 'burn-rate', 'roi', 'cac-ltv']

// ── 3. PILIERS ───────────────────────────────────────────────────────────────

function scoreCash(f: NormalizedFeatures): number | null {
  if (f.runwayMonths === null && f.netCashFlow === null && f.dso === null) return null
  let s = 0
  if (f.runwayMonths !== null) s += f.runwayMonths >= 6 ? 12 : f.runwayMonths >= 3 ? 8 : 3
  if (f.netCashFlow !== null && f.netCashFlow > 0) s += 5
  if (f.dso !== null) s += f.dso <= 30 ? 5 : f.dso <= 45 ? 3 : 0
  return Math.min(25, s)
}

function scoreMargin(f: NormalizedFeatures): number | null {
  if (f.marginPct === null) return null
  const m = f.marginPct
  let s = m >= 20 ? 15 : m >= 15 ? 12 : m >= 10 ? 9 : m >= 5 ? 5 : 0
  if (f.revenueGrowthPct !== null) s += f.revenueGrowthPct >= 15 ? 5 : f.revenueGrowthPct >= 5 ? 3 : 0
  return Math.min(25, s)
}

function scoreResilience(f: NormalizedFeatures): number | null {
  if (f.fixedCostRatioPct === null && f.topClientPct === null) return null
  let s = 0
  if (f.fixedCostRatioPct !== null) s += f.fixedCostRatioPct <= 30 ? 10 : f.fixedCostRatioPct <= 50 ? 7 : 0
  if (f.topClientPct !== null) s += f.topClientPct <= 20 ? 10 : f.topClientPct <= 35 ? 7 : 0
  return Math.min(25, s)
}

function scoreRisk(f: NormalizedFeatures): number {
  let s = 25 - Math.min(10, f.criticalAnomalyCount * 3)
  if (f.volatility !== null) s -= Math.min(10, f.volatility * 10)
  return Math.max(0, Math.round(s))
}

// ── 4. ALTMAN ────────────────────────────────────────────────────────────────

function computeAltman(f: NormalizedFeatures): AltmanResult | undefined {
  if (f.actifTotal == null || f.ca == null || f.capitauxPropres == null) return undefined
  const actif = f.actifTotal
  let x2Estimated = f.bfr == null
  const x1 = f.bfr != null ? f.bfr / actif : 0
  const x2: number | null = f.resultatNetN1 != null ? f.resultatNetN1 / actif : null
  if (x2 === null) x2Estimated = true
  const x3 = f.resultatExploitation != null ? f.resultatExploitation / actif : 0
  const dette = f.detteTotale ?? actif - f.capitauxPropres
  const x4 = dette > 0 ? f.capitauxPropres / dette : 0
  const x5 = f.ca / actif
  const z = 0.717 * x1 + 0.847 * (x2 ?? 0) + 3.107 * x3 + 0.42 * x4 + 0.998 * x5
  const zone: AltmanResult['zone'] = z < 1.23 ? 'danger' : z <= 2.9 ? 'grey' : 'healthy'
  return { z, x1, x2, x3, x4, x5, zone, x2Estimated }
}

// ── 5. SCORE FINAL ───────────────────────────────────────────────────────────

function resolveLevel(total: number): ScoreLevel {
  return total >= 80 ? 'excellent' : total >= 60 ? 'good' : total >= 40 ? 'warning' : 'critical'
}

function resolveConfidence(d: number): ScoreConfidence {
  return d >= 0.75 ? 'high' : d >= 0.5 ? 'medium' : 'low'
}

function ratioNonNull(v: Array<number | null>): number {
  return v.length ? v.filter((x) => x !== null).length / v.length : 0
}

function toScoreFactors(f: NormalizedFeatures): ScoreFactors {
  return {
    cashFlowNet: f.netCashFlow ?? 0,
    runway: f.runwayMonths ?? 0,
    dso: f.dso,
    marginPercentage: f.marginPct ?? 0,
    revenueGrowth: f.revenueGrowthPct ?? 0,
    expenseGrowth: f.expenseGrowthPct ?? 0,
    fixedCostsRatio: f.fixedCostRatioPct ?? 0,
    topClientDependency: f.topClientPct ?? 0,
    categoryDiversity: f.categoryCount ?? 0,
    anomalyCount: f.anomalyCount,
    criticalAnomalies: f.criticalAnomalyCount,
    volatility: f.volatility ?? 0,
  }
}

// ── 6. ADAPTATEURS ───────────────────────────────────────────────────────────

function adaptTransactionalInput(input: TransactionalInput): NormalizedFeatures {
  const { data, sector } = input
  const x = extractScoreFactors(data)
  const tracked = [x.runway, x.cashFlowNet, x.dso, x.marginPercentage, x.revenueGrowth, x.expenseGrowth, x.fixedCostsRatio, x.topClientDependency, x.categoryDiversity, x.volatility]
  return {
    runwayMonths: x.runway,
    netCashFlow: x.cashFlowNet,
    dso: x.dso,
    marginPct: x.marginPercentage,
    revenueGrowthPct: x.revenueGrowth,
    expenseGrowthPct: x.expenseGrowth,
    fixedCostRatioPct: x.fixedCostsRatio,
    topClientPct: x.topClientDependency,
    categoryCount: x.categoryDiversity,
    anomalyCount: x.anomalyCount,
    criticalAnomalyCount: x.criticalAnomalies,
    volatility: x.volatility,
    bfr: null,
    actifTotal: null,
    resultatExploitation: null,
    capitauxPropres: null,
    detteTotale: null,
    ca: data.kpis.revenue > 0 ? data.kpis.revenue : null,
    resultatNetN1: null,
    sector,
    mode: 'transactional',
    dataCompleteness: ratioNonNull(tracked),
  }
}

function adaptDeclarativeInput(input: DeclarativeInput): NormalizedFeatures {
  const { calculations, sector } = input
  const get = (t: CalculatorType) => calculations.find((c) => c.type === t)
  const strategic = input.strategic
  const dso = get('dso')
  const seuil = get('seuil-rentabilite')
  const gearing = get('gearing')
  const caAnnuel = estimateCA(get) ?? null
  const joursClients = numericInput(dso?.inputs?.joursClients, numericInput(dso?.value, 0))
  const margeBrute = numericInput(seuil?.inputs?.margeBrute, numericInput(get('marge')?.value, 0))
  const chargesFixes = numericInput(seuil?.inputs?.chargesFixesMensuelles, 0)
  const solde = numericInput(dso?.inputs?.soldeBancaire, 0)
  const runwayMonths = solde > 0 && chargesFixes > 0 ? solde / chargesFixes : null
  const concentration = numericInput(gearing?.inputs?.concentrationClient, 0)
  const present = new Set(calculations.map((c) => c.type))
  const calcRatio = DECL_CALCS.filter((t) => present.has(t)).length / DECL_CALCS.length
  const tracked = [runwayMonths, joursClients > 0 ? joursClients : null, margeBrute > 0 ? margeBrute : null, concentration > 0 ? concentration : null, caAnnuel, strategic?.actifTotal ?? null, strategic?.capitauxPropres ?? null]
  return {
    runwayMonths,
    netCashFlow: null,
    dso: joursClients > 0 ? joursClients : null,
    marginPct: margeBrute > 0 ? margeBrute : null,
    revenueGrowthPct: null,
    expenseGrowthPct: null,
    fixedCostRatioPct: null,
    topClientPct: concentration > 0 ? concentration : null,
    categoryCount: null,
    anomalyCount: 0,
    criticalAnomalyCount: 0,
    volatility: null,
    bfr: get('bfr')?.value ?? null,
    actifTotal: strategic?.actifTotal ?? null,
    resultatExploitation: caAnnuel != null && margeBrute > 0 ? caAnnuel * (margeBrute / 100) - chargesFixes * 12 : null,
    capitauxPropres: strategic?.capitauxPropres ?? null,
    detteTotale: strategic?.detteBancaire ?? (numericInput(gearing?.inputs?.detteBancaire, 0) || null),
    ca: caAnnuel,
    resultatNetN1: strategic?.resultatNetN1 ?? null,
    sector,
    mode: 'declarative',
    dataCompleteness: Math.max(calcRatio, ratioNonNull(tracked)),
  }
}

// ── 7. INSIGHTS & RECOMMANDATIONS ────────────────────────────────────────────

async function resolveInsightsAndRecommendations(
  input: UnifiedScoreInput,
  breakdown: UnifiedBreakdown,
  f: NormalizedFeatures,
  level: ScoreLevel,
): Promise<{ insights: string[]; recommendations: string[] }> {
  const sb: ScoreBreakdown = breakdown
  const factors = toScoreFactors(f)
  if (input.mode === 'declarative') {
    const ins = computeInsights(computeDiagnosticScore(input.calculations, input.sector), input.calculations, input.sector)
    return {
      insights: [...ins.forces.slice(0, 2).map((s) => `💪 ${s}`), ...ins.vulnerabilites.slice(0, 2).map((s) => `⚠️ ${s}`), ins.priorite].filter(Boolean),
      recommendations: await fetchRecommendations(sb, factors, level, []),
    }
  }
  const legacy = await calculateFinSightScore(input.data)
  return {
    insights: legacy.insights,
    recommendations: await fetchRecommendations(sb, factors, level, input.data.records, legacy.recommendations),
  }
}

async function fetchRecommendations(
  breakdown: ScoreBreakdown,
  factors: ScoreFactors,
  level: ScoreLevel,
  records: ProcessedData['records'],
  fallback: string[] = [],
): Promise<string[]> {
  try {
    const ai = await generateSmartRecommendations(breakdown, factors, level, records)
    if (ai.success && ai.recommendations?.length) return ai.recommendations
  } catch { /* fallback */ }
  return fallback
}

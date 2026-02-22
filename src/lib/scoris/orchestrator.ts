/**
 * SCORIS — Analysis Orchestrator
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Le cerveau central qui coordonne :
 *   1. Le scoring déclaratif client-side (diagnosticScore.ts)
 *   2. L'analyse causale (cross-pillar causal insights)
 *   3. Le positionnement sectoriel (benchmark comparisons)
 *   4. Les simulations What-If (lever-based projections)
 *   5. L'enrichissement TRESORIS / DASHIS (futur — interface définie)
 *
 * Suit le pattern AnalysisOrchestrator de DASHIS mais :
 *   - Ne dépend d'aucun import ML/AI lourd (SSR-safe)
 *   - Fonctionne 100% client-side pour le MVP
 *   - Expose des hooks pour enrichissement serveur quand les agents sont prêts
 *
 * Chaque step émet un callback pour le progress UI.
 */

import {
  type SectorKey,
  type PillarKey,
  type SectorBenchmark,
  type DiagnosticScore,
  type WizardResults,
  SECTOR_BENCHMARKS,
  computeLiveScores,
  computeSynthesis,
  estimateCAFromResults,
  scoreDSO,
  scoreBFR,
  scoreMarge,
  scoreEBITDA,
  scoreGearing,
  scoreBurnRate,
  scoreCACLTV,
  scoreROI,
  scoreSeuil,
} from '@/lib/scoring/diagnosticScore'

import type {
  AnalysisStep,
  ScorisOutput,
  ScorisMetadata,
  CausalInsight,
  SectorComparison,
  BenchmarkPosition,
  SimulationVector,
  SimulationLever,
  AnalyzeRequest,
  TresorisEnrichmentData,
  DashisEnrichmentData,
} from './types'

import { ANALYSIS_PIPELINE, DEFAULT_SIMULATION_LEVERS } from './types'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface OrchestratorConfig {
  /** Which enrichment modules are enabled */
  enableCausal?: boolean
  enableBenchmarks?: boolean
  enableSimulation?: boolean
  enableTresoris?: boolean
  enableDashis?: boolean
  /** Callback fired at each pipeline step */
  onStepProgress?: (step: AnalysisStep, index: number, total: number) => void
  /** Abort signal for cancellation */
  signal?: AbortSignal
}

const DEFAULT_CONFIG: Required<Omit<OrchestratorConfig, 'onStepProgress' | 'signal'>> = {
  enableCausal: true,
  enableBenchmarks: true,
  enableSimulation: true,
  enableTresoris: false,  // Not yet connected
  enableDashis: false,    // Not yet connected
}

// Micro-delay between steps to allow UI render
const STEP_DELAY_MS = 180

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORCHESTRATOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Run the full SCORIS analysis pipeline.
 * Returns a ScorisOutput — the single JSON contract consumed by the frontend.
 */
export async function runAnalysis(
  request: AnalyzeRequest,
  config: OrchestratorConfig = {},
): Promise<ScorisOutput> {
  const startTime = performance.now()
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const { sector, results, simulationLevers } = request

  const bench = SECTOR_BENCHMARKS[sector]
  const stepsCompleted: AnalysisStep[] = []
  const enrichedBy: ScorisMetadata['enrichedBy'] = ['client-scoring']

  const emit = (step: AnalysisStep, index: number) => {
    config.onStepProgress?.(step, index, ANALYSIS_PIPELINE.length)
  }

  // Abort check helper
  const checkAbort = () => {
    if (config.signal?.aborted) {
      throw new DOMException('Analysis aborted', 'AbortError')
    }
  }

  // ── Step 1: Scoring ──────────────────────────────────
  emit('scoring', 0)
  checkAbort()

  const liveScores = computeLiveScores(results, bench)
  const score = buildDiagnosticScore(liveScores, results, bench)
  const synthesis = computeSynthesis(results, liveScores, bench)

  stepsCompleted.push('scoring')
  await sleep(STEP_DELAY_MS)

  // ── Step 2: Benchmarking ──────────────────────────────
  emit('benchmarking', 1)
  checkAbort()

  let sectorComparisons: SectorComparison[] = []
  if (cfg.enableBenchmarks) {
    sectorComparisons = computeSectorComparisons(results, bench)
    stepsCompleted.push('benchmarking')
  }
  await sleep(STEP_DELAY_MS)

  // ── Step 3: Causal Analysis ──────────────────────────
  emit('causal', 2)
  checkAbort()

  let causalInsights: CausalInsight[] = []
  if (cfg.enableCausal) {
    causalInsights = computeCausalInsights(results, bench, liveScores)
    stepsCompleted.push('causal')
  }
  await sleep(STEP_DELAY_MS)

  // ── Step 4: What-If Simulation ───────────────────────
  emit('simulation', 3)
  checkAbort()

  let simulationVectors: SimulationVector[] = []
  if (cfg.enableSimulation && simulationLevers) {
    for (const lever of DEFAULT_SIMULATION_LEVERS) {
      const value = simulationLevers[lever.id]
      if (value !== undefined && value > 0) {
        const vec = computeSimulationVector(lever, value, results, bench, score)
        if (vec) simulationVectors.push(vec)
      }
    }
    stepsCompleted.push('simulation')
  }
  await sleep(STEP_DELAY_MS)

  // ── Step 5: Enrichment (TRESORIS / DASHIS) ──────────
  emit('enrichment', 4)
  checkAbort()

  let tresorisEnrichment: TresorisEnrichmentData | undefined
  let dashisEnrichment: DashisEnrichmentData | undefined

  if (cfg.enableTresoris) {
    tresorisEnrichment = await fetchTresorisWithFallback(results, bench)
    enrichedBy.push('tresoris')
  }
  if (cfg.enableDashis) {
    dashisEnrichment = await fetchDashisWithFallback(results)
    enrichedBy.push('dashis')
  }
  stepsCompleted.push('enrichment')
  await sleep(STEP_DELAY_MS)

  // ── Step 6: Synthesis ────────────────────────────────
  emit('synthesis', 5)
  checkAbort()

  const cta = buildCTA(score, synthesis)
  const executiveSummary = generateExecutiveSummary(
    score,
    synthesis,
    causalInsights,
    results,
    bench,
    tresorisEnrichment,
  )
  stepsCompleted.push('synthesis')

  const durationMs = Math.round(performance.now() - startTime)

  // ── Final assembly ───────────────────────────────────
  const output: ScorisOutput = {
    score,
    executiveSummary,
    insights: {
      forces: synthesis.forces.slice(0, 3),
      vulnerabilites: synthesis.vulnerabilites.slice(0, 3),
      priorite: synthesis.priorite,
      cashImpactLabel: synthesis.cashImpact ?? null,
      cashImpactDetail: null,
    },
    causalInsights,
    sectorComparisons,
    simulationVectors,
    levers: synthesis.levers,
    cta,
    tresorisEnrichment,
    dashisEnrichment,
    meta: {
      sector,
      sectorLabel: bench.label,
      calculatedAt: new Date().toISOString(),
      durationMs,
      stepsCompleted,
      enrichedBy,
      version: '1.0.0',
      engine: 'scoris-v1',
    },
  }

  return output
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUILD DIAGNOSTIC SCORE — from wizard live scores
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function buildDiagnosticScore(
  liveScores: Record<PillarKey, number | null>,
  _results: WizardResults,
  _bench: SectorBenchmark,
): DiagnosticScore {
  const pillars: DiagnosticScore['pillars'] = {
    cash: {
      score: liveScores.cash, max: 25,
      calculators: [
        { type: 'dso', done: !!_results.dso },
        { type: 'bfr', done: !!_results.bfr },
        { type: 'burn-rate', done: !!_results['burn-rate'] },
      ],
      label: 'CASH', sublabel: 'Trésorerie et Liquidité',
      color: 'text-blue-600', borderColor: 'border-blue-200', bgColor: 'bg-blue-50',
    },
    margin: {
      score: liveScores.margin, max: 25,
      calculators: [
        { type: 'marge', done: !!_results.marge },
        { type: 'roi', done: !!_results.roi },
        { type: 'seuil-rentabilite', done: !!_results['seuil-rentabilite'] },
      ],
      label: 'MARGIN', sublabel: 'Rentabilité et Performance',
      color: 'text-emerald-600', borderColor: 'border-emerald-200', bgColor: 'bg-emerald-50',
    },
    resilience: {
      score: liveScores.resilience, max: 25,
      calculators: [
        { type: 'ebitda', done: !!_results.ebitda },
        { type: 'cac-ltv', done: !!_results['cac-ltv'] },
        { type: 'gearing', done: !!_results.gearing },
      ],
      label: 'RÉSILIENCE', sublabel: 'Stabilité Structurelle',
      color: 'text-purple-600', borderColor: 'border-purple-200', bgColor: 'bg-purple-50',
    },
    risk: {
      score: liveScores.risk, max: 25,
      calculators: [
        { type: 'dso', done: !!_results.dso },
        { type: 'marge', done: !!_results.marge },
        { type: 'seuil-rentabilite', done: !!_results['seuil-rentabilite'] },
      ],
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
// SECTOR COMPARISONS — position each indicator vs benchmark
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function computeSectorComparisons(
  results: WizardResults,
  bench: SectorBenchmark,
): SectorComparison[] {
  const comparisons: SectorComparison[] = []

  // DSO
  if (results.dso) {
    const v = results.dso.value
    comparisons.push({
      indicator: 'dso',
      label: 'Délai de paiement clients (DSO)',
      value: v,
      unit: 'jours',
      sectorMedian: bench.dsoMedian,
      sectorGood: bench.dsoGood,
      sectorBad: bench.dsoBad,
      // For DSO, lower = better → invert the position logic
      ...positionForInverse(v, bench.dsoGood, bench.dsoMedian, bench.dsoBad),
    })
  }

  // Marge brute
  if (results.marge) {
    const v = results.marge.value
    comparisons.push({
      indicator: 'marge',
      label: 'Taux de marge brute',
      value: v,
      unit: '%',
      sectorMedian: bench.margeMedian,
      sectorGood: bench.margeBon,
      sectorBad: bench.margeFaible,
      ...positionForDirect(v, bench.margeBon, bench.margeMedian, bench.margeFaible),
    })
  }

  // BFR en jours
  if (results.bfr && results.bfr.inputs.ca && results.bfr.inputs.ca > 0) {
    const j = Math.round((results.bfr.value / results.bfr.inputs.ca) * 365)
    comparisons.push({
      indicator: 'bfr',
      label: 'BFR en jours de CA',
      value: j,
      unit: 'jours',
      sectorMedian: bench.bfrJoursMedian,
      sectorGood: bench.bfrJoursBon,
      sectorBad: bench.bfrJoursBad,
      ...positionForInverse(j, bench.bfrJoursBon, bench.bfrJoursMedian, bench.bfrJoursBad),
    })
  }

  // EBITDA margin
  if (results.ebitda) {
    const ca = results.ebitda.inputs.ca || 0
    if (ca > 0) {
      const pct = Math.round((results.ebitda.value / ca) * 100)
      comparisons.push({
        indicator: 'ebitda',
        label: 'Taux d\'EBITDA',
        value: pct,
        unit: '%',
        sectorMedian: bench.ebitdaMedian,
        sectorGood: Math.round(bench.ebitdaMedian * 1.5),
        sectorBad: Math.round(bench.ebitdaMedian * 0.5),
        ...positionForDirect(pct, Math.round(bench.ebitdaMedian * 1.5), bench.ebitdaMedian, Math.round(bench.ebitdaMedian * 0.5)),
      })
    }
  }

  // Gearing
  if (results.gearing) {
    const v = results.gearing.value
    comparisons.push({
      indicator: 'gearing',
      label: 'Dette nette / EBITDA',
      value: v,
      unit: 'x',
      sectorMedian: bench.gearingMedian,
      sectorGood: bench.gearingBon,
      sectorBad: bench.gearingCritique,
      ...positionForInverse(v, bench.gearingBon, bench.gearingMedian, bench.gearingCritique),
    })
  }

  return comparisons
}

/** For indicators where higher = better (marge, EBITDA) */
function positionForDirect(
  value: number,
  good: number,
  median: number,
  bad: number,
): { position: BenchmarkPosition; percentile: number; positionLabel: string } {
  if (value >= good * 1.3) return { position: 'excellent', percentile: 95, positionLabel: 'Top 5%' }
  if (value >= good) return { position: 'bon', percentile: 80, positionLabel: 'Top 20%' }
  if (value >= median) return { position: 'median', percentile: 55, positionLabel: 'Médiane' }
  if (value >= bad) return { position: 'faible', percentile: 30, positionLabel: 'Sous la médiane' }
  return { position: 'critique', percentile: 10, positionLabel: 'Derniers 10%' }
}

/** For indicators where lower = better (DSO, BFR, gearing) */
function positionForInverse(
  value: number,
  good: number,
  median: number,
  bad: number,
): { position: BenchmarkPosition; percentile: number; positionLabel: string } {
  if (value <= good * 0.7) return { position: 'excellent', percentile: 95, positionLabel: 'Top 5%' }
  if (value <= good) return { position: 'bon', percentile: 80, positionLabel: 'Top 20%' }
  if (value <= median) return { position: 'median', percentile: 55, positionLabel: 'Médiane' }
  if (value <= bad) return { position: 'faible', percentile: 30, positionLabel: 'Sous la médiane' }
  return { position: 'critique', percentile: 10, positionLabel: 'Derniers 10%' }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAUSAL INSIGHTS — cross-pillar causal chains
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function computeCausalInsights(
  results: WizardResults,
  bench: SectorBenchmark,
  scores: Record<PillarKey, number | null>,
): CausalInsight[] {
  const insights: CausalInsight[] = []
  const ca = estimateCAFromResults(results)

  // ── DSO → BFR causal chain
  if (results.dso && results.dso.value > bench.dsoMedian && results.bfr) {
    const gapJours = results.dso.value - bench.dsoMedian
    const estimatedImpact = ca ? Math.round((gapJours / 365) * ca) : null

    insights.push({
      id: 'dso-bfr-cash',
      source: {
        indicator: 'dso',
        label: 'Délai de paiement clients',
        value: results.dso.value,
        unit: 'jours',
        pillar: 'cash',
      },
      target: {
        indicator: 'bfr',
        label: 'Besoin en fonds de roulement',
        value: results.bfr.value,
        unit: '€',
        pillar: 'cash',
      },
      benchmark: {
        sectorMedian: bench.dsoMedian,
        deviation: gapJours,
        deviationPercent: Math.round((gapJours / bench.dsoMedian) * 100),
        position: 'above',
      },
      impact: {
        direction: 'negative',
        magnitude: gapJours > 20 ? 'critical' : gapJours > 10 ? 'high' : 'medium',
        description: estimatedImpact
          ? `Immobilise ~${(estimatedImpact / 1000).toFixed(0)} k€ de trésorerie — ${gapJours}j au-dessus de la médiane sectorielle`
          : `${gapJours}j de DSO excédentaire alourdissent le BFR`,
        estimatedEuros: estimatedImpact ?? undefined,
      },
      confidence: 0.92,
      severity: gapJours > 20 ? 'critical' : gapJours > 10 ? 'danger' : 'warning',
    })
  }

  // ── Marge faible → Résilience
  if (results.marge && results.marge.value < bench.margeMedian && scores.resilience !== null) {
    const gap = bench.margeMedian - results.marge.value

    insights.push({
      id: 'marge-resilience',
      source: {
        indicator: 'marge',
        label: 'Taux de marge brute',
        value: results.marge.value,
        unit: '%',
        pillar: 'margin',
      },
      target: {
        indicator: 'resilience-score',
        label: 'Score Résilience',
        value: scores.resilience,
        unit: '/25',
        pillar: 'resilience',
      },
      benchmark: {
        sectorMedian: bench.margeMedian,
        deviation: -gap,
        deviationPercent: Math.round((-gap / bench.margeMedian) * 100),
        position: 'below',
      },
      impact: {
        direction: 'negative',
        magnitude: results.marge.value < bench.margeFaible ? 'critical' : 'medium',
        description: `Une marge de ${results.marge.value}% (vs ${bench.margeMedian}% médiane) réduit la capacité d'absorption des chocs`,
        estimatedEuros: ca ? Math.round((gap / 100) * ca) : undefined,
      },
      confidence: 0.85,
      severity: results.marge.value < bench.margeFaible ? 'danger' : 'warning',
    })
  }

  // ── DSO long + Marge faible → double pression
  if (
    results.dso && results.dso.value > bench.dsoMedian &&
    results.marge && results.marge.value < bench.margeMedian
  ) {
    insights.push({
      id: 'dso-marge-double-pression',
      source: {
        indicator: 'dso',
        label: 'Délai de paiement clients',
        value: results.dso.value,
        unit: 'jours',
        pillar: 'cash',
      },
      target: {
        indicator: 'marge',
        label: 'Taux de marge brute',
        value: results.marge.value,
        unit: '%',
        pillar: 'margin',
      },
      benchmark: {
        sectorMedian: bench.dsoMedian,
        deviation: results.dso.value - bench.dsoMedian,
        deviationPercent: Math.round(((results.dso.value - bench.dsoMedian) / bench.dsoMedian) * 100),
        position: 'above',
      },
      impact: {
        direction: 'negative',
        magnitude: 'critical',
        description: 'Double pression structurelle : les encaissements tardifs + la marge faible réduisent simultanément le coussin de sécurité',
      },
      confidence: 0.95,
      severity: 'critical',
    })
  }

  // ── Gearing élevé → Vulnérabilité
  if (results.gearing && results.gearing.value > bench.gearingMedian) {
    const gap = results.gearing.value - bench.gearingMedian

    insights.push({
      id: 'gearing-vulnerability',
      source: {
        indicator: 'gearing',
        label: 'Ratio dette nette / EBITDA',
        value: results.gearing.value,
        unit: 'x',
        pillar: 'resilience',
      },
      target: {
        indicator: 'risk-score',
        label: 'Score Risques',
        value: scores.risk ?? 0,
        unit: '/25',
        pillar: 'risk',
      },
      benchmark: {
        sectorMedian: bench.gearingMedian,
        deviation: gap,
        deviationPercent: Math.round((gap / bench.gearingMedian) * 100),
        position: 'above',
      },
      impact: {
        direction: 'negative',
        magnitude: results.gearing.value > bench.gearingCritique ? 'critical' : 'medium',
        description: `Un endettement de ${results.gearing.value}x EBITDA (vs ${bench.gearingMedian}x médiane) limite la capacité d'investissement et amplifie la sensibilité aux variations d'activité`,
      },
      confidence: 0.88,
      severity: results.gearing.value > bench.gearingCritique ? 'critical' : 'warning',
    })
  }

  // ── Burn Rate élevé → Cash pression
  if (results['burn-rate'] && ca) {
    const burnPct = Math.round((results['burn-rate'].value / (ca / 12)) * 100)
    if (burnPct > 70) {
      insights.push({
        id: 'burn-rate-cash',
        source: {
          indicator: 'burn-rate',
          label: 'Burn Rate mensuel',
          value: results['burn-rate'].value,
          unit: '€/mois',
          pillar: 'cash',
        },
        target: {
          indicator: 'cash-score',
          label: 'Score Cash',
          value: scores.cash ?? 0,
          unit: '/25',
          pillar: 'cash',
        },
        benchmark: {
          sectorMedian: Math.round(ca / 12 * 0.5),
          deviation: results['burn-rate'].value - Math.round(ca / 12 * 0.5),
          deviationPercent: burnPct - 50,
          position: 'above',
        },
        impact: {
          direction: 'negative',
          magnitude: burnPct > 90 ? 'critical' : 'high',
          description: `Consommation de ${burnPct}% du CA mensuel — runway limité, chaque impayé client représente un risque immédiat`,
          estimatedEuros: Math.round(results['burn-rate'].value - ca / 12 * 0.5),
        },
        confidence: 0.90,
        severity: burnPct > 90 ? 'critical' : 'danger',
      })
    }
  }

  // Sort by severity
  const severityOrder: Record<string, number> = { critical: 0, danger: 1, warning: 2, info: 3 }
  insights.sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9))

  return insights
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SIMULATION — compute one What-If vector
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function computeSimulationVector(
  lever: SimulationLever,
  value: number,
  results: WizardResults,
  bench: SectorBenchmark,
  currentScore: DiagnosticScore,
): SimulationVector | null {
  const ca = estimateCAFromResults(results)
  const projections: SimulationVector['projections'] = {}

  switch (lever.id) {
    case 'charges-reduction': {
      // Reducing charges improves margin and potentially EBITDA
      if (results.marge) {
        const currentCoutRevient = results.marge.inputs.coutRevient || 0
        const newCout = currentCoutRevient * (1 - value / 100)
        const prixVente = results.marge.inputs.prixVente || 100
        const newMarge = prixVente > 0 ? Math.round(((prixVente - newCout) / prixVente) * 100) : 0
        projections.marge = { current: results.marge.value, projected: newMarge, delta: newMarge - results.marge.value }
      }
      if (results.ebitda && results.ebitda.inputs.charges) {
        const newCharges = results.ebitda.inputs.charges * (1 - value / 100)
        const newEbitda = Math.round((results.ebitda.inputs.ca || 0) - newCharges)
        projections.ebitda = { current: results.ebitda.value, projected: newEbitda, delta: newEbitda - results.ebitda.value }
      }
      if (results['burn-rate']) {
        const newBurn = Math.round(results['burn-rate'].value * (1 - value / 100))
        projections.burnRate = { current: results['burn-rate'].value, projected: newBurn, delta: newBurn - results['burn-rate'].value }
      }
      break
    }

    case 'paiements-acceleration': {
      // Reducing DSO by N days
      if (results.dso) {
        const newDso = Math.max(0, results.dso.value - value)
        projections.dso = { current: results.dso.value, projected: newDso, delta: -value }
      }
      // Impact on BFR
      if (results.bfr && ca) {
        const dailyCA = ca / 365
        const bfrReduction = Math.round(dailyCA * value)
        const newBfr = results.bfr.value - bfrReduction
        projections.bfr = { current: results.bfr.value, projected: newBfr, delta: -bfrReduction }
        projections.cashFlow = { current: 0, projected: bfrReduction, delta: bfrReduction }
      }
      break
    }

    case 'prix-augmentation': {
      // Increasing prices improves marge
      if (results.marge) {
        const prixVente = results.marge.inputs.prixVente || 100
        const coutRevient = results.marge.inputs.coutRevient || 60
        const newPrix = prixVente * (1 + value / 100)
        const newMarge = newPrix > 0 ? Math.round(((newPrix - coutRevient) / newPrix) * 100) : 0
        projections.marge = { current: results.marge.value, projected: newMarge, delta: newMarge - results.marge.value }
      }
      if (results.ebitda && ca) {
        const revenueIncrease = Math.round(ca * value / 100)
        const newEbitda = results.ebitda.value + revenueIncrease
        projections.ebitda = { current: results.ebitda.value, projected: newEbitda, delta: revenueIncrease }
      }
      break
    }

    default:
      return null
  }

  // Recompute projected score with modified results
  const modifiedResults = applyProjections(results, projections)
  const projectedScores = computeLiveScores(modifiedResults, bench)
  const projectedScoredValues = Object.values(projectedScores).filter((s) => s !== null) as number[]
  const projectedTotal = projectedScoredValues.length > 0
    ? (projectedScoredValues.length === 4
      ? projectedScoredValues.reduce((a, b) => a + b, 0)
      : Math.round((projectedScoredValues.reduce((a, b) => a + b, 0) / projectedScoredValues.length) * 4))
    : currentScore.total

  let newLevel: DiagnosticScore['level'] = 'incomplet'
  if (projectedTotal !== null) {
    if (projectedTotal >= 75) newLevel = 'excellent'
    else if (projectedTotal >= 55) newLevel = 'bon'
    else if (projectedTotal >= 35) newLevel = 'vigilance'
    else newLevel = 'action'
  }

  const delta = (projectedTotal ?? 0) - (currentScore.total ?? 0)

  // Build summary
  const summaryParts: string[] = []
  if (projections.dso) summaryParts.push(`DSO −${Math.abs(projections.dso.delta)}j`)
  if (projections.bfr) summaryParts.push(`BFR ${projections.bfr.delta > 0 ? '+' : ''}${(projections.bfr.delta / 1000).toFixed(0)} k€`)
  if (projections.marge) summaryParts.push(`Marge +${projections.marge.delta}pts`)
  if (projections.ebitda) summaryParts.push(`EBITDA +${(projections.ebitda.delta / 1000).toFixed(0)} k€`)
  if (projections.cashFlow && projections.cashFlow.delta > 0) summaryParts.push(`Trésorerie +${(projections.cashFlow.delta / 1000).toFixed(0)} k€`)
  const summary = summaryParts.length > 0
    ? `${summaryParts.join(' · ')} → Score ${delta >= 0 ? '+' : ''}${delta} pts`
    : 'Impact non mesurable avec les données disponibles'

  return {
    leverId: lever.id,
    leverValue: value,
    projections,
    scoreImpact: {
      currentTotal: currentScore.total ?? 0,
      projectedTotal: projectedTotal ?? 0,
      delta,
      newLevel,
    },
    summary,
  }
}

/** Apply simulation projections back into WizardResults for re-scoring */
function applyProjections(
  results: WizardResults,
  projections: SimulationVector['projections'],
): WizardResults {
  const modified = { ...results }

  if (projections.dso && modified.dso) {
    modified.dso = { ...modified.dso, value: projections.dso.projected }
  }
  if (projections.bfr && modified.bfr) {
    modified.bfr = { ...modified.bfr, value: projections.bfr.projected }
  }
  if (projections.marge && modified.marge) {
    modified.marge = { ...modified.marge, value: projections.marge.projected }
  }
  if (projections.ebitda && modified.ebitda) {
    modified.ebitda = { ...modified.ebitda, value: projections.ebitda.projected }
  }
  if (projections.burnRate && modified['burn-rate']) {
    modified['burn-rate'] = { ...modified['burn-rate'], value: projections.burnRate.projected }
  }

  return modified
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXECUTIVE SUMMARY — DAF Virtuel paragraph (3 sentences)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Generate a 3-sentence executive summary in the voice of a DAF Virtuel.
 *
 * Structure :
 *   1. État de santé global (score + confidence)
 *   2. Point de blocage majeur identifié (worst causal insight or vulnerability)
 *   3. Action recommandée avec impact financier estimé
 */
function generateExecutiveSummary(
  score: DiagnosticScore,
  synthesis: { forces: string[]; vulnerabilites: string[]; priorite: string; cashImpact?: string | null; levers: { label: string; impact: string }[] },
  causalInsights: CausalInsight[],
  results: WizardResults,
  bench: SectorBenchmark,
  tresorisData?: TresorisEnrichmentData,
): string {
  const total = score.total ?? 0
  const ca = estimateCAFromResults(results)
  const sentences: string[] = []

  // ── Sentence 1: État de santé ──
  if (total >= 75) {
    sentences.push(
      `Votre structure financière affiche un Score FinSight™ de ${total}/100 — les fondamentaux sont solides avec ${score.completedPillars} piliers validés en confiance ${score.confidence}.`
    )
  } else if (total >= 55) {
    sentences.push(
      `Votre Score FinSight™ de ${total}/100 signale une trajectoire globalement positive, mais ${synthesis.vulnerabilites.length} point${synthesis.vulnerabilites.length > 1 ? 's' : ''} de vigilance mérite${synthesis.vulnerabilites.length > 1 ? 'nt' : ''} une attention structurelle.`
    )
  } else if (total >= 35) {
    sentences.push(
      `Avec un Score FinSight™ de ${total}/100, votre entreprise navigue en zone de vigilance — plusieurs indicateurs croisés signalent des tensions sur la trésorerie et la rentabilité.`
    )
  } else {
    sentences.push(
      `Score FinSight™ de ${total}/100 — le diagnostic révèle des fragilités structurelles sur ${synthesis.vulnerabilites.length} axe${synthesis.vulnerabilites.length > 1 ? 's' : ''} qui exigent une intervention prioritaire.`
    )
  }

  // ── Sentence 2: Point de blocage majeur ──
  const criticalInsight = causalInsights.find(i => i.severity === 'critical' || i.severity === 'danger')
  const tresorisWarning = tresorisData?.earlyWarnings?.[0]

  if (criticalInsight) {
    const euros = criticalInsight.impact.estimatedEuros
    const eurosLabel = euros ? ` (impact estimé : ${Math.round(euros / 1000)} k€)` : ''
    sentences.push(
      `Le point de blocage majeur : ${criticalInsight.impact.description.charAt(0).toLowerCase() + criticalInsight.impact.description.slice(1)}${eurosLabel}.`
    )
  } else if (tresorisWarning) {
    sentences.push(`Point d'attention TRESORIS : ${tresorisWarning}.`)
  } else if (synthesis.vulnerabilites.length > 0) {
    sentences.push(`Principal point de friction : ${synthesis.vulnerabilites[0].charAt(0).toLowerCase() + synthesis.vulnerabilites[0].slice(1)}.`)
  } else {
    sentences.push(`Aucun point de blocage critique détecté — votre structure est équilibrée sur l'ensemble des piliers.`)
  }

  // ── Sentence 3: Action recommandée avec impact € ──
  const topLever = synthesis.levers[0]
  if (topLever) {
    sentences.push(`Action recommandée : ${topLever.label.charAt(0).toLowerCase() + topLever.label.slice(1)} — ${topLever.impact.charAt(0).toLowerCase() + topLever.impact.slice(1)}.`)
  } else if (synthesis.cashImpact && ca) {
    sentences.push(`Priorité immédiate : libérer le cash immobilisé — ${synthesis.cashImpact.charAt(0).toLowerCase() + synthesis.cashImpact.slice(1)}.`)
  } else {
    sentences.push(
      total >= 55
        ? `Recommandation : consolidez vos acquis et explorez les leviers de croissance identifiés dans l'analyse What-If.`
        : `Recommandation : engagez un audit flash ciblé pour transformer ce diagnostic en plan d'action chiffré sous 48h.`
    )
  }

  return sentences.join(' ')
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRESORIS / DASHIS ENRICHMENT — fetch with mock fallback
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Attempt to fetch from TRESORIS Python API (port 5001).
 * If unreachable → return realistic mock data as fallback.
 */
async function fetchTresorisWithFallback(
  results: WizardResults,
  bench: SectorBenchmark,
): Promise<TresorisEnrichmentData> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000) // 3s timeout

    const res = await fetch('http://localhost:5001/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dso: results.dso?.value,
        bfr: results.bfr?.value,
        marge: results.marge?.value,
        burnRate: results['burn-rate']?.value,
        gearing: results.gearing?.value,
        ebitda: results.ebitda?.value,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (res.ok) {
      const data = await res.json()
      return { ...data, source: 'live' as const }
    }
  } catch {
    // TRESORIS unreachable — expected in dev/demo mode
  }

  // ── Mock fallback — generate realistic TRESORIS-style data ──
  return buildTresorisMock(results, bench)
}

/** Generate realistic mock TRESORIS enrichment data from wizard results */
function buildTresorisMock(
  results: WizardResults,
  bench: SectorBenchmark,
): TresorisEnrichmentData {
  const dso = results.dso?.value ?? 0
  const marge = results.marge?.value ?? 0
  const gearing = results.gearing?.value ?? 0

  // Risk rating derived from current indicators
  let riskRating: TresorisEnrichmentData['riskRating'] = 'B'
  let tresorisScore = 65

  if (dso > bench.dsoBad && marge < bench.margeFaible) {
    riskRating = 'D'
    tresorisScore = 30
  } else if (dso > bench.dsoMedian || marge < bench.margeMedian) {
    riskRating = 'C'
    tresorisScore = 50
  } else if (dso <= bench.dsoGood && marge >= bench.margeBon) {
    riskRating = 'A'
    tresorisScore = 85
  }

  // Early warnings
  const earlyWarnings: string[] = []
  if (dso > bench.dsoMedian) {
    earlyWarnings.push(`DSO de ${dso}j supérieur à la médiane sectorielle (${bench.dsoMedian}j) — risque d'impayé élevé`)
  }
  if (gearing > bench.gearingMedian) {
    earlyWarnings.push(`Endettement de ${gearing}x EBITDA au-dessus du seuil sectoriel — capacité d'emprunt réduite`)
  }
  if (results['burn-rate']) {
    const ca = estimateCAFromResults(results)
    if (ca) {
      const burnPct = Math.round((results['burn-rate'].value / (ca / 12)) * 100)
      if (burnPct > 80) {
        earlyWarnings.push(`Burn rate à ${burnPct}% du CA mensuel — runway critique`)
      }
    }
  }

  // Cash forecast (next 6 months)
  const now = new Date()
  const cashForecast = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() + i + 1)
    const monthLabel = month.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    const base = results.bfr?.value ?? 50000
    const trend = riskRating === 'D' ? -0.05 : riskRating === 'C' ? -0.02 : 0.01
    return {
      month: monthLabel,
      projected: Math.round(base * (1 + trend * (i + 1))),
      confidence: Math.max(0.5, 0.95 - i * 0.08),
    }
  })

  // Payment patterns
  const paymentPatterns: TresorisEnrichmentData['paymentPatterns'] = {
    avgDelay: dso || bench.dsoMedian,
    trend: dso > bench.dsoBad ? 'degrading' : dso > bench.dsoMedian ? 'stable' : 'improving',
    riskClients: dso > bench.dsoBad ? 3 : dso > bench.dsoMedian ? 1 : 0,
  }

  return {
    riskRating,
    tresorisScore,
    earlyWarnings,
    cashForecast,
    paymentPatterns,
    source: 'mock',
  }
}

/**
 * Attempt to invoke DASHIS AnalysisOrchestrator.
 * If unavailable → return mock fallback.
 */
async function fetchDashisWithFallback(
  results: WizardResults,
): Promise<DashisEnrichmentData> {
  // DASHIS is in-process TS — for now, return mock
  // Future: import { AnalysisOrchestrator } from '@agent-daf/dashis'
  const findings: string[] = []
  const recommendations: string[] = []

  if (results.marge && results.dso) {
    findings.push(`Corrélation détectée entre DSO (${results.dso.value}j) et pression sur la marge (${results.marge.value}%)`)
    recommendations.push('Mettre en place un suivi hebdomadaire des encaissements avec alertes automatiques')
  }
  if (results.ebitda && results.gearing) {
    findings.push(`Ratio dette/EBITDA de ${results.gearing.value}x détecté — analyse de sensibilité recommandée`)
    recommendations.push('Simuler l\'impact d\'une variation de ±10% de l\'activité sur la capacité de remboursement')
  }
  if (findings.length === 0) {
    findings.push('Données insuffisantes pour une analyse approfondie — compléter le diagnostic recommandé')
    recommendations.push('Renseigner les calculateurs manquants pour débloquer l\'analyse DASHIS complète')
  }

  return {
    analysisId: `dashis-mock-${Date.now()}`,
    findings,
    recommendations,
    source: 'mock',
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CTA BUILDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function buildCTA(
  score: DiagnosticScore,
  synthesis: { forces: string[]; vulnerabilites: string[] },
): ScorisOutput['cta'] {
  const hasWeakness = synthesis.vulnerabilites.length > 0
  const total = score.total ?? 0

  if (total < 35 || (hasWeakness && total < 50)) {
    return {
      label: 'Audit Flash Trésorerie — 45 min',
      sublabel: 'Un expert analyse vos données et identifie le plan d\'action en 48h',
      price: '290 €',
      urgency: 'high',
    }
  }

  if (total < 65 || hasWeakness) {
    return {
      label: 'Coaching DAF — Plan d\'optimisation',
      sublabel: 'Recommandations chiffrées sur vos leviers de performance',
      price: '490 €',
      urgency: 'medium',
    }
  }

  return {
    label: 'Accompagnement Croissance',
    sublabel: 'Pilotage avancé et benchmarks personnalisés pour scaler',
    price: '790 €',
    urgency: 'low',
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

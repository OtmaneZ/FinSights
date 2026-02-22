/**
 * SCORIS — Types & JSON Contract
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * "Le frontend est une surface de contrôle. Le backend est l'actif intellectuel."
 *
 * Ce fichier définit le **contrat strict** entre :
 *   - le frontend (wizard, hook useScorisEngine)
 *   - l'orchestrateur SCORIS (src/lib/scoris/orchestrator.ts)
 *   - l'API route /api/v1/analyze
 *   - les agents DASHIS (TS) et TRESORIS (Python)
 *
 * Toutes les interfaces ici sont **immutables par convention** :
 * rien ne les modifie après construction — le frontend les lit,
 * l'orchestrateur les écrit.
 *
 * Compatibilité :
 *   - diagnosticScore.ts  → PillarKey, SectorKey, SectorBenchmark réexportés
 *   - DASHIS types.ts     → SimulationParams/SimulationResult structure alignée
 *   - TRESORIS spec       → RiskRating A/B/C/D, score 0-100
 */

import type {
  SectorKey,
  SectorBenchmark,
  PillarKey,
  DiagnosticScore,
  SynthesisLever,
  WizardResults,
} from '@/lib/scoring/diagnosticScore'

import type { CalculatorType } from '@/hooks/useCalculatorHistory'

// Re-export for consumers that only depend on scoris/types
export type { SectorKey, SectorBenchmark, PillarKey, WizardResults }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ENGINE STATUS — state machine (wizard UI + hook)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Finite state machine for the analysis engine */
export type EngineStatus =
  | 'idle'          // Wizard open, no analysis running
  | 'analyzing'     // Engine is working — show micro-latency feedback
  | 'success'       // Report ready — unlock synthesis
  | 'error'         // Recoverable failure

/** Granular step within the 'analyzing' state — drives status messages */
export type AnalysisStep =
  | 'scoring'           // "Calcul du Score FinSight™…"
  | 'benchmarking'      // "Interrogation des benchmarks sectoriels…"
  | 'causal'            // "Analyse causale des indicateurs…"
  | 'simulation'        // "Modélisation What-If en cours…"
  | 'enrichment'        // "Enrichissement TRESORIS / DASHIS…"
  | 'synthesis'         // "Consolidation de la lecture stratégique…"

/** Human-readable labels for each analysis step (FR) */
export const ANALYSIS_STEP_LABELS: Record<AnalysisStep, string> = {
  scoring:      'Calcul du Score FinSight™…',
  benchmarking: 'Interrogation des benchmarks sectoriels…',
  causal:       'Analyse causale des indicateurs…',
  simulation:   'Modélisation What-If en cours…',
  enrichment:   'Enrichissement TRESORIS / DASHIS…',
  synthesis:    'Consolidation de la lecture stratégique…',
}

/** Ordered pipeline — the orchestrator runs steps in this sequence */
export const ANALYSIS_PIPELINE: readonly AnalysisStep[] = [
  'scoring',
  'benchmarking',
  'causal',
  'simulation',
  'enrichment',
  'synthesis',
] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAUSAL INSIGHTS — what drives what
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * A directional insight: "indicator X causes impact on Y".
 * Example: "Un DSO à 68j (vs médiane 45j) entraîne un BFR excédentaire de +23j,
 *           immobilisant ~63 k€ de trésorerie."
 */
export interface CausalInsight {
  id: string
  /** Source indicator that drives the effect */
  source: {
    indicator: string       // e.g. 'dso'
    label: string           // e.g. 'Délai de paiement clients'
    value: number
    unit: string
    pillar: PillarKey
  }
  /** Target indicator affected */
  target: {
    indicator: string       // e.g. 'bfr'
    label: string           // e.g. 'BFR'
    value: number
    unit: string
    pillar: PillarKey
  }
  /** Sector benchmark comparison */
  benchmark: {
    sectorMedian: number
    deviation: number       // positive = above median (worse for DSO)
    deviationPercent: number
    position: 'below' | 'at' | 'above'
  }
  /** Impact description */
  impact: {
    direction: 'positive' | 'negative' | 'neutral'
    magnitude: 'low' | 'medium' | 'high' | 'critical'
    description: string     // "Immobilise ~63 k€ de trésorerie"
    estimatedEuros?: number // Chiffrage € si calculable
  }
  /** Confidence in this causal link (0–1) */
  confidence: number
  /** Severity for UI sorting */
  severity: 'info' | 'warning' | 'danger' | 'critical'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SIMULATION VECTORS — What-If projections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** One scenario lever the user can adjust */
export interface SimulationLever {
  id: string
  label: string
  description: string
  /** Slider config */
  min: number
  max: number
  step: number
  defaultValue: number
  unit: '%' | 'jours' | '€' | '€/mois'
  /** Which pillar this lever impacts */
  impactedPillars: PillarKey[]
}

/** Result of a What-If simulation given lever values */
export interface SimulationVector {
  leverId: string
  leverValue: number
  /** Projected deltas on each KPI */
  projections: {
    dso?: { current: number; projected: number; delta: number }
    bfr?: { current: number; projected: number; delta: number }
    marge?: { current: number; projected: number; delta: number }
    ebitda?: { current: number; projected: number; delta: number }
    burnRate?: { current: number; projected: number; delta: number }
    cashFlow?: { current: number; projected: number; delta: number }
  }
  /** Overall score impact */
  scoreImpact: {
    currentTotal: number
    projectedTotal: number
    delta: number
    newLevel: DiagnosticScore['level']
  }
  /** Natural language summary */
  summary: string
}

/** Predefined simulation levers available in the What-If panel */
export const DEFAULT_SIMULATION_LEVERS: readonly SimulationLever[] = [
  {
    id: 'charges-reduction',
    label: 'Réduction des charges',
    description: 'Réduction du poste charges d\'exploitation',
    min: 0,
    max: 30,
    step: 1,
    defaultValue: 0,
    unit: '%',
    impactedPillars: ['margin', 'cash'],
  },
  {
    id: 'paiements-acceleration',
    label: 'Accélération des paiements',
    description: 'Réduction du délai moyen de paiement clients',
    min: 0,
    max: 30,
    step: 1,
    defaultValue: 0,
    unit: 'jours',
    impactedPillars: ['cash'],
  },
  {
    id: 'prix-augmentation',
    label: 'Augmentation des prix',
    description: 'Hausse moyenne des tarifs de vente',
    min: 0,
    max: 15,
    step: 0.5,
    defaultValue: 0,
    unit: '%',
    impactedPillars: ['margin', 'resilience'],
  },
] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTOR COMPARISON — benchmark positioning
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type BenchmarkPosition = 'excellent' | 'bon' | 'median' | 'faible' | 'critique'

/** One indicator compared to sector benchmarks */
export interface SectorComparison {
  indicator: CalculatorType | string
  label: string
  value: number
  unit: string
  sectorMedian: number
  sectorGood: number
  sectorBad: number
  /** Computed position vs sector */
  position: BenchmarkPosition
  /** Percentile 0-100 (approximated) */
  percentile: number
  /** Human label: "Top 20%", "Médiane", "Derniers 10%" */
  positionLabel: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRESORIS / DASHIS ENRICHMENT — agent data contracts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** TRESORIS Python agent enrichment data (port 5001) */
export interface TresorisEnrichmentData {
  /** Risk rating A/B/C/D */
  riskRating: 'A' | 'B' | 'C' | 'D'
  /** Score 0-100 from TRESORIS ML model */
  tresorisScore: number
  /** Early warnings detected */
  earlyWarnings: string[]
  /** Cash flow forecast (next 3-6 months) */
  cashForecast: {
    month: string
    projected: number
    confidence: number
  }[]
  /** Payment pattern analysis */
  paymentPatterns: {
    avgDelay: number
    trend: 'improving' | 'stable' | 'degrading'
    riskClients: number
  }
  /** Whether this came from a live fetch or the mock fallback */
  source: 'live' | 'mock'
}

/** DASHIS TS agent enrichment data */
export interface DashisEnrichmentData {
  /** Analysis result from DASHIS AnalysisOrchestrator */
  analysisId: string
  /** Key findings */
  findings: string[]
  /** Recommendations */
  recommendations: string[]
  /** Source indicator */
  source: 'live' | 'mock'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCORIS OUTPUT — The Final Report
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * The full output produced by the SCORIS orchestrator.
 * This is the **single JSON contract** consumed by:
 *   - useScorisEngine hook
 *   - /api/v1/analyze response body
 *   - Wizard synthesis phase
 *   - PDF report generator
 */
export interface ScorisOutput {
  /** Diagnostic score (from diagnosticScore.ts) */
  score: DiagnosticScore

  /**
   * Executive Summary — 3-phrase DAF Virtuel paragraph.
   * Structure : [État de santé] + [Point de blocage majeur] + [Action recommandée avec impact €]
   * Generated by orchestrator's `generateExecutiveSummary()`.
   */
  executiveSummary: string

  /** Contextual insights — forces, vulnérabilités, priorité */
  insights: {
    forces: string[]
    vulnerabilites: string[]
    priorite: string
    cashImpactLabel: string | null
    cashImpactDetail: string | null
  }

  /** Causal analysis — how indicators drive each other */
  causalInsights: CausalInsight[]

  /** Sector benchmarks for each indicator */
  sectorComparisons: SectorComparison[]

  /** What-If simulation vectors (empty until user interacts with sliders) */
  simulationVectors: SimulationVector[]

  /** Prioritized action levers */
  levers: SynthesisLever[]

  /** Contextual CTA */
  cta: {
    label: string
    sublabel: string
    price: string
    urgency: 'high' | 'medium' | 'low'
  }

  /** TRESORIS enrichment data (when agent is connected) */
  tresorisEnrichment?: TresorisEnrichmentData

  /** DASHIS enrichment data (when agent is connected) */
  dashisEnrichment?: DashisEnrichmentData

  /** Pipeline metadata */
  meta: ScorisMetadata
}

export interface ScorisMetadata {
  sector: SectorKey
  sectorLabel: string
  calculatedAt: string
  /** Pipeline duration in ms */
  durationMs: number
  /** Which steps ran successfully */
  stepsCompleted: AnalysisStep[]
  /** Which agents contributed */
  enrichedBy: ('client-scoring' | 'dashis' | 'tresoris')[]
  /** Engine version */
  version: string
  engine: 'scoris-v1'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANALYZE REQUEST — Input to /api/v1/analyze
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** The payload the frontend sends to trigger a full SCORIS analysis */
export interface AnalyzeRequest {
  /** Sector for benchmark comparison */
  sector: SectorKey
  /** Wizard results (same shape as WizardResults) */
  results: WizardResults
  /** Optional: simulation lever values for What-If */
  simulationLevers?: Record<string, number>
  /** Optional: which enrichment modules to enable */
  enabledModules?: {
    causalAnalysis?: boolean
    sectorBenchmarks?: boolean
    whatIfSimulation?: boolean
    tresorisEnrichment?: boolean
    dashisEnrichment?: boolean
  }
}

/** Wire-level response from /api/v1/analyze */
export interface AnalyzeResponse {
  success: true
  data: ScorisOutput
}

export interface AnalyzeErrorResponse {
  success: false
  error: string
  code: 'VALIDATION_ERROR' | 'ORCHESTRATION_ERROR' | 'TIMEOUT' | 'INTERNAL_ERROR'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ENGINE STATE — for useScorisEngine hook
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Complete state object exposed by useScorisEngine */
export interface ScorisEngineState {
  /** Current FSM status */
  status: EngineStatus
  /** Current sub-step when status === 'analyzing' */
  currentStep: AnalysisStep | null
  /** Progress 0-100 (derived from step index / total steps) */
  progress: number
  /** Status message for UI (FR) */
  statusMessage: string
  /** The final report (available when status === 'success') */
  report: ScorisOutput | null
  /** Error message (available when status === 'error') */
  error: string | null
  /** Timestamp of last successful analysis */
  lastAnalyzedAt: string | null
}

/** Actions exposed by useScorisEngine */
export interface ScorisEngineActions {
  /** Trigger a full analysis run */
  analyze: (request: AnalyzeRequest) => Promise<ScorisOutput | null>
  /** Run a What-If simulation on an existing report */
  simulate: (leverId: string, value: number) => SimulationVector | null
  /** Reset engine to idle */
  reset: () => void
  /** Abort a running analysis */
  abort: () => void
}

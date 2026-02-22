'use client'

/**
 * useScorisEngine — React hook for the SCORIS analysis engine
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Exposes a clean FSM (IDLE → ANALYZING → SUCCESS | ERROR) to the wizard UI.
 * - Calls the orchestrator client-side (no API needed for MVP)
 * - Supports graceful abort via AbortController
 * - Caches the latest report in localStorage for session continuity
 * - Provides real-time progress messages for micro-latency feedback
 * - Includes simulation method for What-If sliders
 */

import { useCallback, useRef, useState } from 'react'

import type {
  EngineStatus,
  AnalysisStep,
  ScorisOutput,
  ScorisEngineState,
  ScorisEngineActions,
  AnalyzeRequest,
  SimulationVector,
  SimulationLever,
} from '@/lib/scoris/types'

import { ANALYSIS_STEP_LABELS, ANALYSIS_PIPELINE, DEFAULT_SIMULATION_LEVERS } from '@/lib/scoris/types'
import { runAnalysis, computeSimulationVector } from '@/lib/scoris/orchestrator'
import { SECTOR_BENCHMARKS, computeLiveScores } from '@/lib/scoring/diagnosticScore'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CACHE_KEY = 'scoris_last_report'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HOOK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function useScorisEngine(): [ScorisEngineState, ScorisEngineActions] {
  // FSM state
  const [status, setStatus] = useState<EngineStatus>('idle')
  const [currentStep, setCurrentStep] = useState<AnalysisStep | null>(null)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [report, setReport] = useState<ScorisOutput | null>(() => {
    // Hydrate from cache on mount
    if (typeof window === 'undefined') return null
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached) as ScorisOutput
        // Only restore if less than 30 min old
        const age = Date.now() - new Date(parsed.meta.calculatedAt).getTime()
        if (age < 30 * 60 * 1000) return parsed
      }
    } catch { /* ignore */ }
    return null
  })
  const [error, setError] = useState<string | null>(null)
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<string | null>(null)

  // Abort controller ref
  const abortRef = useRef<AbortController | null>(null)

  // ── analyze() — run full pipeline ──────────────────────
  const analyze = useCallback(async (request: AnalyzeRequest): Promise<ScorisOutput | null> => {
    // Abort any in-flight analysis
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('analyzing')
    setError(null)
    setProgress(0)
    setCurrentStep('scoring')
    setStatusMessage(ANALYSIS_STEP_LABELS.scoring)

    try {
      const output = await runAnalysis(request, {
        enableCausal: request.enabledModules?.causalAnalysis !== false,
        enableBenchmarks: request.enabledModules?.sectorBenchmarks !== false,
        enableSimulation: request.enabledModules?.whatIfSimulation !== false,
        enableTresoris: request.enabledModules?.tresorisEnrichment ?? false,
        enableDashis: request.enabledModules?.dashisEnrichment ?? false,
        signal: controller.signal,
        onStepProgress: (step: AnalysisStep, index: number, total: number) => {
          setCurrentStep(step)
          setProgress(Math.round(((index + 1) / total) * 100))
          setStatusMessage(ANALYSIS_STEP_LABELS[step])
        },
      })

      // Cache in localStorage
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(output))
      } catch { /* storage full, ignore */ }

      setReport(output)
      setStatus('success')
      setLastAnalyzedAt(output.meta.calculatedAt)
      setCurrentStep(null)
      setProgress(100)
      setStatusMessage('')

      return output
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Graceful abort — reset to idle
        setStatus('idle')
        setCurrentStep(null)
        setProgress(0)
        setStatusMessage('')
        return null
      }

      const msg = err instanceof Error ? err.message : 'Erreur inconnue lors de l\'analyse'
      setStatus('error')
      setError(msg)
      setCurrentStep(null)
      setStatusMessage('')
      return null
    }
  }, [])

  // ── simulate() — run one lever on existing report ──────
  const simulate = useCallback((leverId: string, value: number): SimulationVector | null => {
    if (!report) return null

    const lever = DEFAULT_SIMULATION_LEVERS.find((l) => l.id === leverId) as SimulationLever | undefined
    if (!lever) return null

    // We need the original wizard results — extract from the analyze request context
    // For now, we can re-derive from the report's sector
    // In production, the request should be cached alongside the report
    // This is a simplified version that works with cached results
    const bench = SECTOR_BENCHMARKS[report.meta.sector]

    // The report already has the score — use it
    const vec = computeSimulationVector(
      lever,
      value,
      {}, // Would need cached results — placeholder for now
      bench,
      report.score,
    )

    if (vec) {
      // Add to report's simulation vectors
      setReport((prev) => {
        if (!prev) return prev
        const existing = prev.simulationVectors.filter((v) => v.leverId !== leverId)
        return { ...prev, simulationVectors: [...existing, vec] }
      })
    }

    return vec
  }, [report])

  // ── reset() — back to idle ─────────────────────────────
  const reset = useCallback(() => {
    abortRef.current?.abort()
    setStatus('idle')
    setCurrentStep(null)
    setProgress(0)
    setStatusMessage('')
    setReport(null)
    setError(null)
    try { localStorage.removeItem(CACHE_KEY) } catch { /* ignore */ }
  }, [])

  // ── abort() — cancel in-flight ─────────────────────────
  const abort = useCallback(() => {
    abortRef.current?.abort()
    // The analyze() catch handler will set status to 'idle'
  }, [])

  // ── Assemble state + actions ───────────────────────────
  const state: ScorisEngineState = {
    status,
    currentStep,
    progress,
    statusMessage,
    report,
    error,
    lastAnalyzedAt,
  }

  const actions: ScorisEngineActions = {
    analyze,
    simulate,
    reset,
    abort,
  }

  return [state, actions]
}

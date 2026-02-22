/**
 * API Route: POST /api/v1/score
 *
 * FinSight Score — Single endpoint for diagnostic scoring.
 * Accepts either:
 *   (A) Declarative inputs (from calculators / guided wizard)
 *   (B) Raw financial data (for future TRESORIS / DASHIS integration)
 *
 * Returns the full scoring payload: total, pillars, insights, levers, CTA.
 *
 * This is the contract that the Python TRESORIS engines and the TS DASHIS
 * agents will call to enrich with Monte‑Carlo, causal analysis, etc.
 *
 * Authentication: API key via x-api-key header (optional in demo mode).
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  type SectorKey,
  type PillarKey,
  SECTOR_BENCHMARKS,
  computeDiagnosticScore,
  computeInsights,
  computeLiveScores,
  computeSynthesis,
  getContextualCTA,
} from '@/lib/scoring/diagnosticScore'
import type { Calculation, CalculatorType } from '@/hooks/useCalculatorHistory'

// ---------------------------------------------------------------------------
// Types — Request / Response
// ---------------------------------------------------------------------------

interface ScoreRequestDeclarative {
  mode: 'declarative'
  sector?: SectorKey
  /** Array of completed calculator results */
  calculations: Array<{
    type: CalculatorType
    value: number
    inputs: Record<string, number>
    date?: string
  }>
}

interface ScoreRequestWizard {
  mode: 'wizard'
  sector?: SectorKey
  /** Key→value map from the guided wizard */
  results: Record<string, { value: number; inputs: Record<string, number> }>
}

type ScoreRequest = ScoreRequestDeclarative | ScoreRequestWizard

interface ScoreResponse {
  score: {
    total: number | null
    level: string
    confidence: string
    pillars: Record<PillarKey, { score: number | null; max: 25 }>
  }
  insights: {
    forces: string[]
    vulnerabilites: string[]
    priorite: string
    cashImpactLabel: string | null
    cashImpactDetail: string | null
  }
  levers: Array<{
    id: string
    label: string
    detail: string
    impact: string
    type: 'cash' | 'margin' | 'resilience'
  }>
  cta: {
    label: string
    sublabel: string
    price: string
    urgency: 'high' | 'medium' | 'low'
  }
  meta: {
    sector: string
    sectorLabel: string
    calculatedAt: string
    version: string
    engine: 'client-scoring-v1'
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_SECTORS = Object.keys(SECTOR_BENCHMARKS)

function validateRequest(body: unknown): { ok: true; data: ScoreRequest } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body is required (JSON)' }
  }

  const b = body as Record<string, unknown>

  if (!b.mode || !['declarative', 'wizard'].includes(b.mode as string)) {
    return { ok: false, error: 'Field "mode" is required: "declarative" | "wizard"' }
  }

  if (b.sector && !VALID_SECTORS.includes(b.sector as string)) {
    return { ok: false, error: `Invalid sector. Valid: ${VALID_SECTORS.join(', ')}` }
  }

  if (b.mode === 'declarative') {
    if (!Array.isArray(b.calculations) || b.calculations.length === 0) {
      return { ok: false, error: 'Field "calculations" is required (non-empty array) for mode=declarative' }
    }
    for (const c of b.calculations) {
      if (!c.type || c.value === undefined) {
        return { ok: false, error: 'Each calculation must have "type" and "value"' }
      }
    }
  }

  if (b.mode === 'wizard') {
    if (!b.results || typeof b.results !== 'object') {
      return { ok: false, error: 'Field "results" is required (object) for mode=wizard' }
    }
  }

  return { ok: true, data: b as unknown as ScoreRequest }
}

// ---------------------------------------------------------------------------
// POST /api/v1/score
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    // Optional API key check (soft — demo mode if missing)
    const apiKey = req.headers.get('x-api-key')
    const expectedKey = process.env.FINSIGHT_API_KEY
    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or missing x-api-key header' },
        { status: 401 },
      )
    }

    const body = await req.json()
    const validation = validateRequest(body)
    if (!validation.ok) {
      return NextResponse.json({ error: 'Bad Request', message: validation.error }, { status: 400 })
    }

    const data = validation.data
    const sector: SectorKey = data.sector || 'autre'
    const bench = SECTOR_BENCHMARKS[sector]

    let response: ScoreResponse

    if (data.mode === 'declarative') {
      // Convert to Calculation[] for computeDiagnosticScore
      const history: Calculation[] = data.calculations.map((c) => ({
        type: c.type,
        value: c.value,
        inputs: c.inputs || {},
        date: c.date || new Date().toISOString(),
        label: c.type,
      }))

      const diagnostic = computeDiagnosticScore(history, sector)
      const insights = computeInsights(diagnostic, history, sector)
      const cta = getContextualCTA(diagnostic.total)

      response = {
        score: {
          total: diagnostic.total,
          level: diagnostic.level,
          confidence: diagnostic.confidence,
          pillars: Object.fromEntries(
            (Object.keys(diagnostic.pillars) as PillarKey[]).map((k) => [
              k,
              { score: diagnostic.pillars[k].score, max: 25 as const },
            ]),
          ) as Record<PillarKey, { score: number | null; max: 25 }>,
        },
        insights: {
          forces: insights.forces,
          vulnerabilites: insights.vulnerabilites,
          priorite: insights.priorite,
          cashImpactLabel: insights.cashImpactLabel,
          cashImpactDetail: insights.cashImpactDetail,
        },
        levers: [], // Levers are computed from synthesis mode only
        cta: {
          label: cta.label,
          sublabel: cta.sublabel,
          price: cta.price,
          urgency: cta.urgency,
        },
        meta: {
          sector,
          sectorLabel: bench.label,
          calculatedAt: new Date().toISOString(),
          version: '1.0.0',
          engine: 'client-scoring-v1',
        },
      }
    } else {
      // Wizard mode — uses computeLiveScores + computeSynthesis
      const results = data.results
      const liveScores = computeLiveScores(results, bench)
      const synthesis = computeSynthesis(results, liveScores, bench)
      const cta = getContextualCTA(synthesis.total)

      response = {
        score: {
          total: synthesis.total,
          level: synthesis.level,
          confidence: 'haute',
          pillars: Object.fromEntries(
            (Object.keys(liveScores) as PillarKey[]).map((k) => [
              k,
              { score: liveScores[k], max: 25 as const },
            ]),
          ) as Record<PillarKey, { score: number | null; max: 25 }>,
        },
        insights: {
          forces: synthesis.forces,
          vulnerabilites: synthesis.vulnerabilites,
          priorite: synthesis.priorite,
          cashImpactLabel: synthesis.cashImpact,
          cashImpactDetail: null,
        },
        levers: synthesis.levers.map((l) => ({
          id: l.id,
          label: l.label,
          detail: l.detail,
          impact: l.impact,
          type: l.type,
        })),
        cta: {
          label: cta.label,
          sublabel: cta.sublabel,
          price: cta.price,
          urgency: cta.urgency,
        },
        meta: {
          sector,
          sectorLabel: bench.label,
          calculatedAt: new Date().toISOString(),
          version: '1.0.0',
          engine: 'client-scoring-v1',
        },
      }
    }

    return NextResponse.json(response, { status: 200 })
  } catch (err) {
    console.error('[/api/v1/score] Error:', err)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Scoring engine failed' },
      { status: 500 },
    )
  }
}

// ---------------------------------------------------------------------------
// GET /api/v1/score — API documentation
// ---------------------------------------------------------------------------

export async function GET() {
  return NextResponse.json({
    name: 'FinSight Score API',
    version: '1.0.0',
    documentation: {
      description: 'Compute the FinSight diagnostic score from financial indicators.',
      endpoint: 'POST /api/v1/score',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Required if FINSIGHT_API_KEY is set in environment',
      },
      modes: {
        declarative: {
          description: 'Score from individual calculator results (dashboard mode)',
          example: {
            mode: 'declarative',
            sector: 'services-b2b',
            calculations: [
              { type: 'dso', value: 45, inputs: { ca: 2000000, creancesClients: 250000 } },
              { type: 'marge', value: 35, inputs: { ca: 2000000, couts: 1300000 } },
            ],
          },
        },
        wizard: {
          description: 'Score from guided wizard results (4-pillar mode)',
          example: {
            mode: 'wizard',
            sector: 'saas-tech',
            results: {
              dso: { value: 30, inputs: { ca: 1500000, creancesClients: 123000 } },
              bfr: { value: 50000, inputs: { ca: 1500000 } },
              marge: { value: 65, inputs: { ca: 1500000, couts: 525000 } },
            },
          },
        },
      },
      response: {
        score: '{ total, level, confidence, pillars }',
        insights: '{ forces[], vulnerabilites[], priorite, cashImpactLabel }',
        levers: '[ { id, label, detail, impact, type } ] — up to 3',
        cta: '{ label, sublabel, price, urgency }',
        meta: '{ sector, sectorLabel, calculatedAt, version, engine }',
      },
      sectors: Object.entries(SECTOR_BENCHMARKS).map(([k, v]) => ({ key: k, label: v.label })),
    },
    _links: {
      tresoris: '/api/tresoris — Python engines (Monte-Carlo, causal analysis, etc.)',
      dashis: 'Coming soon — TS agent orchestration',
    },
  })
}

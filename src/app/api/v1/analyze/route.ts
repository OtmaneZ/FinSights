/**
 * API Route: POST /api/v1/analyze
 *
 * SCORIS Analysis Endpoint — orchestrates the full scoring + causal + benchmark
 * + simulation pipeline, returning a ScorisOutput contract.
 *
 * This route is the server-side equivalent of the client-side runAnalysis().
 * It exists so that:
 *   1. The scoring logic can be called from external systems (SDKs, partners)
 *   2. Future TRESORIS / DASHIS enrichments can run server-side securely
 *   3. We have a stable REST contract (/api/v1/analyze) for the frontend to call
 *      instead of doing everything client-side
 *
 * Authentication: API key via x-api-key header (soft — demo mode if absent).
 *
 * GET  → Self-documenting JSON (schema, examples)
 * POST → Run analysis pipeline
 */

import { NextRequest, NextResponse } from 'next/server'
import { SECTOR_BENCHMARKS } from '@/lib/scoring/diagnosticScore'
import { runAnalysis } from '@/lib/scoris/orchestrator'
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  AnalyzeErrorResponse,
  SectorKey,
} from '@/lib/scoris/types'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VALIDATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VALID_SECTORS = Object.keys(SECTOR_BENCHMARKS)

function validateRequest(
  body: unknown,
): { ok: true; data: AnalyzeRequest } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body is required (JSON)' }
  }

  const b = body as Record<string, unknown>

  // sector
  if (!b.sector || !VALID_SECTORS.includes(b.sector as string)) {
    return {
      ok: false,
      error: `Field "sector" is required. Valid: ${VALID_SECTORS.join(', ')}`,
    }
  }

  // results
  if (!b.results || typeof b.results !== 'object') {
    return { ok: false, error: 'Field "results" is required (object mapping step IDs to { value, inputs })' }
  }

  const results = b.results as Record<string, unknown>
  for (const [key, val] of Object.entries(results)) {
    if (!val || typeof val !== 'object') {
      return { ok: false, error: `results["${key}"] must be an object with { value, inputs }` }
    }
    const entry = val as Record<string, unknown>
    if (typeof entry.value !== 'number') {
      return { ok: false, error: `results["${key}"].value must be a number` }
    }
    if (!entry.inputs || typeof entry.inputs !== 'object') {
      return { ok: false, error: `results["${key}"].inputs must be an object` }
    }
  }

  // simulationLevers (optional)
  if (b.simulationLevers !== undefined && typeof b.simulationLevers !== 'object') {
    return { ok: false, error: 'Field "simulationLevers" must be an object (lever_id → number)' }
  }

  // enabledModules (optional)
  if (b.enabledModules !== undefined && typeof b.enabledModules !== 'object') {
    return { ok: false, error: 'Field "enabledModules" must be an object' }
  }

  return { ok: true, data: b as unknown as AnalyzeRequest }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET — self-documenting schema
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/analyze',
    method: 'POST',
    description:
      'SCORIS Analysis Pipeline — computes Score FinSight™, causal insights, sector benchmarks, and What-If simulations.',
    authentication: 'x-api-key header (optional in demo mode)',
    request: {
      sector: {
        type: 'string',
        required: true,
        values: VALID_SECTORS,
      },
      results: {
        type: 'Record<string, { value: number, inputs: Record<string, number> }>',
        required: true,
        description: 'Wizard results keyed by step ID (dso, bfr, marge, etc.)',
        example: {
          dso: { value: 52, inputs: { creances: 150000, ca: 2000000 } },
          marge: { value: 35, inputs: { prixVente: 100, coutRevient: 65 } },
        },
      },
      simulationLevers: {
        type: 'Record<string, number>',
        required: false,
        description: 'What-If lever values',
        example: {
          'charges-reduction': 10,
          'paiements-acceleration': 5,
        },
      },
      enabledModules: {
        type: 'object',
        required: false,
        fields: {
          causalAnalysis: 'boolean (default: true)',
          sectorBenchmarks: 'boolean (default: true)',
          whatIfSimulation: 'boolean (default: true)',
          tresorisEnrichment: 'boolean (default: false)',
          dashisEnrichment: 'boolean (default: false)',
        },
      },
    },
    response: {
      success: true,
      data: '→ ScorisOutput (score, insights, causalInsights, sectorComparisons, simulationVectors, levers, cta, meta)',
    },
    version: '1.0.0',
    engine: 'scoris-v1',
  })
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POST — run SCORIS analysis
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function POST(req: NextRequest) {
  try {
    // Optional API key check (soft in demo mode)
    const apiKey = req.headers.get('x-api-key')
    const expectedKey = process.env.FINSIGHT_API_KEY
    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'VALIDATION_ERROR' } satisfies AnalyzeErrorResponse,
        { status: 401 },
      )
    }

    const body = await req.json()
    const validation = validateRequest(body)

    if (!validation.ok) {
      return NextResponse.json(
        { success: false, error: validation.error, code: 'VALIDATION_ERROR' } satisfies AnalyzeErrorResponse,
        { status: 400 },
      )
    }

    const request = validation.data

    // Set a timeout for the analysis (15 seconds)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15_000)

    try {
      const output = await runAnalysis(request, {
        enableCausal: request.enabledModules?.causalAnalysis !== false,
        enableBenchmarks: request.enabledModules?.sectorBenchmarks !== false,
        enableSimulation: request.enabledModules?.whatIfSimulation !== false,
        enableTresoris: request.enabledModules?.tresorisEnrichment ?? false,
        enableDashis: request.enabledModules?.dashisEnrichment ?? false,
        signal: controller.signal,
      })

      clearTimeout(timeout)

      const response: AnalyzeResponse = {
        success: true,
        data: output,
      }

      return NextResponse.json(response, {
        headers: {
          'X-Scoris-Engine': 'scoris-v1',
          'X-Scoris-Duration': `${output.meta.durationMs}ms`,
        },
      })
    } catch (err) {
      clearTimeout(timeout)

      if (err instanceof DOMException && err.name === 'AbortError') {
        return NextResponse.json(
          { success: false, error: 'Analysis timed out (15s limit)', code: 'TIMEOUT' } satisfies AnalyzeErrorResponse,
          { status: 504 },
        )
      }

      throw err
    }
  } catch (err) {
    console.error('[SCORIS /api/v1/analyze] Error:', err)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error during analysis',
        code: 'INTERNAL_ERROR',
      } satisfies AnalyzeErrorResponse,
      { status: 500 },
    )
  }
}

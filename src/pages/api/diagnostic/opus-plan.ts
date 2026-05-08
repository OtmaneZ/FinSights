/**
 * POST /api/diagnostic/opus-plan
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Route API unifiée qui orchestre Claude Opus pour le diagnostic déclaratif.
 * Appelée par :
 *   - generateDiagnosticPDF (P1) : pour les 3 priorities page 3
 *   - orchestrator.ts (P2) : pour l'executiveSummary wizard
 *
 * Modes :
 *   - mode = 'full'    → RecommendationPlan complet (PDF)
 *   - mode = 'summary' → Executive summary uniquement (wizard)
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { callOpus, callOpusSummary, type ScoreContext, type RecommendationPlan } from '@/lib/opus-engine'
import { SECTOR_BENCHMARKS } from '@/lib/scoring/diagnosticScore'

interface OpusPlanRequest {
  context: ScoreContext
  mode?: 'full' | 'summary'
}

interface OpusPlanResponse {
  success: boolean
  plan?: RecommendationPlan
  summary?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpusPlanResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' })
  }

  try {
    const { context, mode = 'full' }: OpusPlanRequest = req.body

    // Validation minimale du contexte
    if (
      typeof context?.score !== 'number' ||
      !context?.sector ||
      !SECTOR_BENCHMARKS[context.sector]
    ) {
      return res.status(400).json({
        success: false,
        error: 'Contexte invalide : score et sector obligatoires',
      })
    }

    if (mode === 'summary') {
      const summary = await callOpusSummary(context)
      return res.status(200).json({ success: true, summary })
    }

    // mode = 'full'
    const plan = await callOpus(context, { maxRetries: 1 })
    return res.status(200).json({ success: true, plan })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur serveur inattendue'
    console.error('[opus-plan] Erreur:', message)
    return res.status(500).json({ success: false, error: message })
  }
}

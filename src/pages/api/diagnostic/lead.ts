/**
 * POST /api/diagnostic/lead
 * ─────────────────────────────────────────────────────────────────────────
 * Capture l'email du prospect AVANT le paiement Stripe (paywall SCORIS 49€).
 * Crée un DiagnosticLead en DB (upsert par email non-payé).
 *
 * Body : { email, score?, sector? }
 * Response : { success, leadId }
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

interface LeadBody {
  email: string
  score?: number
  sector?: string
}

interface LeadResponse {
  success: boolean
  leadId?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeadResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' })
  }

  const { email, score, sector } = req.body as LeadBody

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Email invalide' })
  }

  try {
    const normalizedEmail = email.toLowerCase().trim()

    // Chercher un lead non-payé existant pour cet email
    const existing = await prisma.diagnosticLead.findFirst({
      where: { email: normalizedEmail, paid: false },
      orderBy: { createdAt: 'desc' },
    })

    if (existing) {
      const updated = await prisma.diagnosticLead.update({
        where: { id: existing.id },
        data: {
          ...(score != null && { score }),
          ...(sector && { sector }),
        },
      })
      return res.status(200).json({ success: true, leadId: updated.id })
    }

    const created = await prisma.diagnosticLead.create({
      data: {
        email: normalizedEmail,
        score: score ?? null,
        sector: sector ?? null,
      },
    })

    logger.debug('[diagnostic/lead] Nouveau lead capturé:', normalizedEmail)
    return res.status(200).json({ success: true, leadId: created.id })

  } catch (err) {
    logger.error('[diagnostic/lead] Erreur DB:', err)
    // Non-bloquant : ne jamais bloquer l'UX paywall pour une erreur DB
    return res.status(200).json({ success: true })
  }
}

/**
 * POST /api/stripe/checkout
 * ─────────────────────────────────────────────────────────────────────────
 * Crée une Stripe Checkout Session one-time à 49€ pour le rapport SCORIS.
 *
 * Body : { email, score, sector, leadId? }
 * Response : { url } — redirect vers Stripe Checkout
 *
 * Fallback : si STRIPE_SECRET_KEY absent → 402 avec message explicite
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { logger } from '@/lib/logger'

interface CheckoutBody {
  email: string
  score?: number
  sector?: string
  leadId?: string
}

interface CheckoutResponse {
  url?: string
  success: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    logger.warn('[stripe/checkout] STRIPE_SECRET_KEY manquante')
    return res.status(402).json({
      success: false,
      error: 'stripe_not_configured',
    })
  }

  const { email, score, sector, leadId } = req.body as CheckoutBody

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Email invalide' })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
    })

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://finsight.zineinsight.com'

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      customer_email: email.toLowerCase().trim(),
      payment_method_types: ['card'],
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: 'eur',
                unit_amount: 4900, // 49,00 €
                product_data: {
                  name: 'Rapport SCORIS™ — Diagnostic financier personnalisé',
                  description:
                    'Score détaillé · 4 piliers · Plan d\'action 90j · PDF consulting format A4 · Généré par IA',
                  images: [`${appUrl}/images/og-default.jpg`],
                },
              },
              quantity: 1,
            },
          ],
      success_url: `${appUrl}/mon-diagnostic?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/mon-diagnostic`,
      metadata: {
        email: email.toLowerCase().trim(),
        score: score?.toString() ?? '',
        sector: sector ?? '',
        leadId: leadId ?? '',
        product: 'scoris_report',
      },
      locale: 'fr',
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    logger.debug('[stripe/checkout] Session créée:', session.id, 'pour', email)

    return res.status(200).json({ success: true, url: session.url! })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur Stripe'
    logger.error('[stripe/checkout] Erreur:', message)
    return res.status(500).json({ success: false, error: message })
  }
}

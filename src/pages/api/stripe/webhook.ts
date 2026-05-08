/**
 * POST /api/stripe/webhook
 * ─────────────────────────────────────────────────────────────────────────
 * Reçoit les événements Stripe signés et orchestre la livraison du rapport.
 *
 * Événements traités :
 *   - checkout.session.completed → marque lead comme payé + envoie email PDF
 *
 * Config Vercel : bodyParser désactivé (requis pour la vérification Stripe)
 * Env requis    : STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/emails/resend'
import { logger } from '@/lib/logger'

export const config = {
  api: { bodyParser: false },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecret || !webhookSecret) {
    logger.warn('[stripe/webhook] Variables manquantes')
    return res.status(500).json({ error: 'Stripe non configuré' })
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2025-11-17.clover' })

  // Vérification signature Stripe
  let event: Stripe.Event
  try {
    const chunks: Buffer[] = []
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    const rawBody = Buffer.concat(chunks)
    const sig = req.headers['stripe-signature'] as string
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Signature invalide'
    logger.error('[stripe/webhook] Signature invalide:', msg)
    return res.status(400).json({ error: `Webhook Error: ${msg}` })
  }

  // ── Traitement des événements ─────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const email = session.customer_email ?? session.metadata?.email
    const score = session.metadata?.score ? parseInt(session.metadata.score) : null
    const sector = session.metadata?.sector || 'autre'
    const leadId = session.metadata?.leadId

    logger.debug('[stripe/webhook] Paiement confirmé pour:', email, 'session:', session.id)

    try {
      // 1. Marquer le lead comme payé
      if (leadId) {
        await prisma.diagnosticLead.update({
          where: { id: leadId },
          data: {
            paid: true,
            stripeSessionId: session.id,
            paidAt: new Date(),
          },
        }).catch(() => null) // non-bloquant si leadId invalide
      } else if (email) {
        // Fallback : chercher par email
        const lead = await prisma.diagnosticLead.findFirst({
          where: { email: email.toLowerCase().trim(), paid: false },
          orderBy: { createdAt: 'desc' },
        })
        if (lead) {
          await prisma.diagnosticLead.update({
            where: { id: lead.id },
            data: {
              paid: true,
              stripeSessionId: session.id,
              paidAt: new Date(),
            },
          })
        } else {
          // Créer le lead s'il n'existe pas (achat direct sans capture préalable)
          await prisma.diagnosticLead.create({
            data: {
              email: email.toLowerCase().trim(),
              score,
              sector,
              paid: true,
              stripeSessionId: session.id,
              paidAt: new Date(),
            },
          })
        }
      }

      // 2. Envoyer l'email de confirmation avec lien de téléchargement
      if (email && process.env.RESEND_API_KEY) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://finsight.zineinsight.com'
        const downloadUrl = `${appUrl}/mon-diagnostic?success=true&session_id=${session.id}`

        const levelLabel = score
          ? score >= 75 ? 'Excellente santé financière'
          : score >= 55 ? 'Situation saine'
          : score >= 35 ? 'Vigilance requise'
          : 'Situation critique'
          : 'Score calculé'

        await resend.emails.send({
          from: FROM_EMAIL,
          replyTo: REPLY_TO_EMAIL,
          to: email,
          subject: `Votre rapport SCORIS™ est prêt — Score ${score ?? '—'}/100`,
          html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
    
    <!-- Header -->
    <div style="background:#0f172a;padding:32px 40px;">
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;color:#64748b;text-transform:uppercase;">FinSight · SCORIS™</p>
      <h1 style="margin:12px 0 0;font-size:24px;font-weight:600;color:#ffffff;line-height:1.2;">Votre rapport est prêt</h1>
    </div>

    <!-- Score badge -->
    <div style="background:#f1f5f9;padding:24px 40px;border-bottom:1px solid #e2e8f0;">
      <div style="display:inline-flex;align-items:baseline;gap:8px;">
        <span style="font-size:48px;font-weight:600;color:#0052cc;font-family:Georgia,serif;">${score ?? '—'}</span>
        <span style="font-size:20px;color:#94a3b8;font-weight:500;">/ 100</span>
      </div>
      <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#64748b;">${levelLabel}</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
        Merci pour votre confiance. Votre rapport SCORIS™ personnalisé a été généré.
        Il contient votre score détaillé, les 4 piliers financiers, le plan d'action 90 jours
        et une synthèse rédigée par IA calibrée sur les médianes de votre secteur.
      </p>

      <a href="${downloadUrl}" style="display:inline-block;padding:14px 28px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;">
        Télécharger mon rapport PDF →
      </a>

      <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;line-height:1.6;">
        Ce lien vous permet d'accéder à votre rapport depuis n'importe quel appareil.<br>
        En cas de problème, répondez directement à cet email.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 40px;border-top:1px solid #e2e8f0;background:#f8fafc;">
      <p style="margin:0;font-size:11px;color:#94a3b8;">
        FinSight · SCORIS™ — Diagnostic financier PME · <a href="${appUrl}" style="color:#94a3b8;">finsight.zineinsight.com</a>
      </p>
    </div>
  </div>
</body>
</html>`,
        })

        // Marquer PDF envoyé
        await prisma.diagnosticLead.updateMany({
          where: { stripeSessionId: session.id },
          data: { pdfSentAt: new Date() },
        }).catch(() => null)

        logger.debug('[stripe/webhook] Email envoyé à:', email)
      }

    } catch (err) {
      logger.error('[stripe/webhook] Erreur post-paiement:', err)
      // On retourne 200 quand même pour éviter que Stripe ne renouvelle l'événement
    }
  }

  return res.status(200).json({ received: true })
}

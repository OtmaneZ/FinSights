/**
 * API Route: Stripe Webhooks
 * POST /api/stripe/webhook
 * Gère les événements Stripe (payment success, subscription deleted, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe, isStripeConfigured, getPlanFromPriceId, STRIPE_PRICES } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import {
    sendUpgradeSuccessEmail,
    sendPaymentFailedEmail,
    isEmailEnabled,
} from '@/lib/emails/emailService';
import { resend, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/emails/resend';
import { generateCalculatorPDF, type CalculatorPDFCalculatorType } from '@/lib/pdf/generateCalculatorPDF';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const PREMIUM_CALC_TYPES: CalculatorPDFCalculatorType[] = [
    'dso',
    'bfr',
    'roi',
    'marge',
    'seuil-rentabilite',
    'ebitda',
    'cac-ltv',
    'burn-rate',
    'valorisation',
];

function readChunkedMeta(meta: Stripe.Metadata | null | undefined, baseKey: string): string {
    if (!meta) return '';
    const countRaw = meta[`${baseKey}_count`];
    if (countRaw) {
        const n = Math.min(parseInt(countRaw, 10) || 0, 48);
        let out = '';
        for (let i = 0; i < n; i++) {
            out += meta[`${baseKey}_${i}`] || '';
        }
        return out;
    }
    const single = meta[baseKey];
    return typeof single === 'string' ? single : '';
}

async function handleCalculatorPremiumCheckout(session: Stripe.Checkout.Session) {
    const meta = session.metadata || {};
    const calculatorType = meta.calculatorType as CalculatorPDFCalculatorType | undefined;

    if (!calculatorType || !PREMIUM_CALC_TYPES.includes(calculatorType)) {
        logger.error('❌ calculatorType metadata invalide pour premium');
        return;
    }

    const resultStr = readChunkedMeta(meta, 'result');
    const inputsStr = readChunkedMeta(meta, 'inputs');
    let result: Record<string, unknown> = {};
    let inputs: Record<string, unknown> = {};
    try {
        result = resultStr ? (JSON.parse(resultStr) as Record<string, unknown>) : {};
        inputs = inputsStr ? (JSON.parse(inputsStr) as Record<string, unknown>) : {};
    } catch (e: any) {
        logger.error('❌ JSON metadata premium invalide:', e?.message);
        return;
    }

    const email =
        (session.customer_details?.email as string | undefined) ||
        (session.customer_email as string | undefined) ||
        (typeof meta.email === 'string' ? meta.email : '');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        logger.error('❌ Email manquant pour rapport premium');
        return;
    }

    const pdfBase64 = generateCalculatorPDF({
        calculatorType,
        email: email.trim().toLowerCase(),
        result,
        inputs,
        isPremium: true,
    });

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const fileName = `FinSight_Premium_${calculatorType}_${new Date().toISOString().slice(0, 10)}.pdf`;

    const subject = `Votre Rapport Premium FinSight™ — ${calculatorType}`;

    const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:28px;border:1px solid #e2e8f0;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#0052cc;">FinSight™ · Premium</p>
        <h1 style="margin:0 0 12px;font-size:20px;">Votre rapport premium est prêt</h1>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#334155;">Bonjour,</p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#334155;">
          Vous trouverez en pièce jointe votre <strong>Rapport Premium FinSight™</strong> (PDF) pour le calculateur
          <strong>${calculatorType}</strong> : plan d’action 90 jours + benchmark sectoriel.
        </p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
          Paiement sécurisé confirmé · Sans abonnement
        </p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

    const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        replyTo: REPLY_TO_EMAIL,
        to: [email.trim().toLowerCase()],
        subject,
        html,
        attachments: [
            {
                filename: fileName,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    });

    if (error) {
        logger.error('❌ Envoi email premium échoué:', error.message);
        throw new Error(error.message);
    }

    logger.debug(`✅ Rapport premium envoyé à ${email} (${calculatorType})`);
}

export async function POST(req: NextRequest) {
    // Vérifier que Stripe est configuré
    if (!isStripeConfigured() || !webhookSecret) {
        logger.warn('⚠️ Stripe non configuré - webhook ignoré');
        return NextResponse.json(
            { error: 'Stripe non configuré' },
            { status: 503 }
        );
    }

    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    // Vérifier la signature Stripe
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
        logger.error('❌ Webhook signature invalide:', error.message);
        return NextResponse.json(
            { error: 'Webhook signature invalide' },
            { status: 400 }
        );
    }

    logger.debug(`✅ Webhook reçu: ${event.type}`);

    // Gérer les événements
    try {
        switch (event.type) {
            // ============================================
            // CHECKOUT COMPLETED → Abonnement créé
            // ============================================
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                // Rapport premium calculateur (paiement unique)
                if (session.metadata?.checkoutKind === 'calculator_premium') {
                    await handleCalculatorPremiumCheckout(session);
                    break;
                }

                // Upgrade abonnement (mode subscription)
                if (session.mode !== 'subscription' || !session.subscription) {
                    logger.debug('ℹ️ checkout.session.completed ignoré (pas premium calculateur, pas abonnement)');
                    break;
                }

                const userId = session.metadata?.userId;

                if (!userId) {
                    logger.error('❌ userId manquant dans metadata (abonnement)');
                    break;
                }

                // Récupérer les détails de l'abonnement
                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription as string
                );

                const priceId = subscription.items.data[0].price.id;
                const plan = getPlanFromPriceId(priceId);

                // Mettre à jour l'utilisateur
                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        stripeCustomerId: session.customer as string,
                        stripeSubscriptionId: subscription.id,
                        stripePriceId: priceId,
                        stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                        plan,
                    },
                });

                logger.debug(`✅ User ${userId} upgraded to ${plan}`);

                // Envoyer email de confirmation d'upgrade
                if (isEmailEnabled() && (plan === 'PRO' || plan === 'SCALE')) {
                    const amount = plan === 'PRO' ? 79 : 199;
                    const nextBillingDate = new Date(
                        (subscription as any).current_period_end * 1000
                    ).toLocaleDateString('fr-FR');

                    await sendUpgradeSuccessEmail({
                        to: updatedUser.email,
                        userName: updatedUser.name || 'Utilisateur',
                        plan: plan as 'PRO' | 'SCALE',
                        amount,
                        nextBillingDate,
                    }).catch((error) => {
                        logger.error('⚠️ Email upgrade échoué (non-bloquant):', error);
                    });
                }
                break;
            }

            // ============================================
            // SUBSCRIPTION UPDATED → Changement de plan
            // ============================================
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const stripeCustomerId = subscription.customer as string;

                const priceId = subscription.items.data[0].price.id;
                const plan = getPlanFromPriceId(priceId);

                await prisma.user.updateMany({
                    where: { stripeCustomerId },
                    data: {
                        stripePriceId: priceId,
                        stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                        plan,
                    },
                });

                logger.debug(`✅ Subscription updated for customer ${stripeCustomerId}`);
                break;
            }

            // ============================================
            // SUBSCRIPTION DELETED → Retour au plan FREE
            // ============================================
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const stripeCustomerId = subscription.customer as string;

                await prisma.user.updateMany({
                    where: { stripeCustomerId },
                    data: {
                        stripeSubscriptionId: null,
                        stripePriceId: null,
                        stripeCurrentPeriodEnd: null,
                        plan: 'FREE',
                    },
                });

                logger.debug(`✅ User downgraded to FREE (customer ${stripeCustomerId})`);

                // TODO: Envoyer email "Votre abonnement a expiré"
                break;
            }

            // ============================================
            // INVOICE PAYMENT FAILED → Alerte utilisateur
            // ============================================
            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const stripeCustomerId = invoice.customer as string;

                logger.debug(`⚠️ Payment failed for customer ${stripeCustomerId}`);

                // Récupérer l'utilisateur pour envoyer l'email
                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId },
                });

                if (user && isEmailEnabled() && (user.plan === 'PRO' || user.plan === 'SCALE')) {
                    const amount = user.plan === 'PRO' ? 79 : 199;

                    await sendPaymentFailedEmail({
                        to: user.email,
                        userName: user.name || 'Utilisateur',
                        plan: user.plan as 'PRO' | 'SCALE',
                        amount,
                        invoiceUrl: invoice.hosted_invoice_url || '',
                    }).catch((error) => {
                        logger.error('⚠️ Email payment failed échoué (non-bloquant):', error);
                    });
                }
                break;
            }

            default:
                logger.debug(`ℹ️ Unhandled event: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        logger.error('❌ Erreur webhook:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

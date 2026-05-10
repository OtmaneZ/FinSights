/**
 * API Route: Stripe Webhooks
 * POST /api/stripe/webhook
 *
 * Gère deux familles d'événements :
 *   A) SCORIS paywall (product = 'scoris_report') → marque lead payé + email PDF
 *   B) Abonnements SaaS PRO/SCALE → mise à jour plan utilisateur
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
import {
    resend,
    sendUserEmailWithAdminNotify,
    isResendConfigured,
    FROM_EMAIL,
    REPLY_TO_EMAIL,
} from '@/lib/emails/resend';
import { generateCalculatorPDF, type CalculatorPDFCalculatorType } from '@/lib/pdf/generateCalculatorPDF';
import { generateCalculatorAnalysis } from '@/lib/pdf/generateCalculatorAnalysis';

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

    const analysis = await generateCalculatorAnalysis({
        calculatorType,
        inputs,
        result,
    });

    const pdfBase64 = generateCalculatorPDF({
        calculatorType,
        email: email.trim().toLowerCase(),
        result,
        inputs,
        isPremium: true,
        ...(analysis ? { analysis } : {}),
    });

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const fileName = `FinSight_Premium_${calculatorType}_${new Date().toISOString().slice(0, 10)}.pdf`;

    const subject = `Votre Rapport Premium FinSight™ - ${calculatorType}`;

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
            // CHECKOUT COMPLETED - SCORIS rapport (one-time 49€)
            // ============================================
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                // Rapport premium calculateur (paiement unique)
                if (session.metadata?.checkoutKind === 'calculator_premium') {
                    await handleCalculatorPremiumCheckout(session);
                    break;
                }

                // ── Branche SCORIS ────────────────────────────────────────
                if (
                    session.metadata?.product === 'scoris_report' ||
                    session.metadata?.product === 'scoris_strategique'
                ) {
                    const isStrategicProduct = session.metadata?.product === 'scoris_strategique';
                    const email = session.customer_email ?? session.metadata?.email;
                    const score = session.metadata?.score ? parseInt(session.metadata.score) : null;
                    const sector = session.metadata?.sector || 'autre';
                    const leadId = session.metadata?.leadId;

                    logger.debug('[webhook] Paiement SCORIS confirmé pour:', email);

                    try {
                        if (leadId) {
                            await (prisma as any).diagnosticLead.update({
                                where: { id: leadId },
                                data: { paid: true, stripeSessionId: session.id, paidAt: new Date() },
                            }).catch(() => null);
                        } else if (email) {
                            const lead = await (prisma as any).diagnosticLead.findFirst({
                                where: { email: email.toLowerCase().trim(), paid: false },
                                orderBy: { createdAt: 'desc' },
                            });
                            if (lead) {
                                await (prisma as any).diagnosticLead.update({
                                    where: { id: lead.id },
                                    data: { paid: true, stripeSessionId: session.id, paidAt: new Date() },
                                });
                            } else {
                                await (prisma as any).diagnosticLead.create({
                                    data: { email: email!.toLowerCase().trim(), score, sector, paid: true, stripeSessionId: session.id, paidAt: new Date() },
                                });
                            }
                        }

                        const emailNorm =
                            typeof email === 'string' ? email.trim().toLowerCase() : '';

                        if (emailNorm && isResendConfigured()) {
                            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://finsight.zineinsight.com';
                            const downloadUrl = `${appUrl}/mon-diagnostic?success=true&session_id=${session.id}`;
                            const levelLabel = score
                                ? score >= 75 ? 'Excellente santé financière'
                                : score >= 55 ? 'Situation saine'
                                : score >= 35 ? 'Vigilance requise'
                                : 'Situation critique'
                                : 'Score calculé';

                            const rapportName = isStrategicProduct ? 'SCORIS Stratégique™' : 'SCORIS™';
                            const prixTag = isStrategicProduct ? '99€' : '49€';
                            const adminLine = `💰 Nouveau paiement ${rapportName} - ${emailNorm} - ${prixTag}`;
                            const mailIntro = isStrategicProduct
                                ? `Merci pour votre confiance. Votre rapport ${rapportName} inclut le diagnostic 4 piliers, le plan d'action 90 jours, le Z-Score Altman, l'analyse SWOT enrichie et une estimation indicative - synthèse IA calibrée sur les médianes de votre secteur.`
                                : `Merci pour votre confiance. Votre rapport SCORIS™ personnalisé a été généré avec votre score détaillé, les 4 piliers financiers, le plan d'action 90 jours et une synthèse IA calibrée sur les médianes de votre secteur.`;
                            const { error } = await sendUserEmailWithAdminNotify(
                                {
                                    from: FROM_EMAIL,
                                    replyTo: REPLY_TO_EMAIL,
                                    to: [emailNorm],
                                    subject: `Votre rapport ${rapportName} est prêt - Score ${score ?? '-'}/100`,
                                    html: `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,sans-serif;"><div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;"><div style="background:#0f172a;padding:32px 40px;"><p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;color:#64748b;text-transform:uppercase;">FinSight · ${rapportName}</p><h1 style="margin:12px 0 0;font-size:24px;font-weight:600;color:#fff;">Votre rapport est prêt</h1></div><div style="background:#f1f5f9;padding:24px 40px;border-bottom:1px solid #e2e8f0;"><span style="font-size:48px;font-weight:600;color:#0052cc;font-family:Georgia,serif;">${score ?? '-'}</span><span style="font-size:20px;color:#94a3b8;"> / 100</span><p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#64748b;">${levelLabel}</p></div><div style="padding:32px 40px;"><p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">${mailIntro}</p><a href="${downloadUrl}" style="display:inline-block;padding:14px 28px;background:#0f172a;color:#fff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;">Télécharger mon rapport PDF →</a><p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">En cas de problème, répondez directement à cet email.</p></div><div style="padding:20px 40px;border-top:1px solid #e2e8f0;background:#f8fafc;"><p style="margin:0;font-size:11px;color:#94a3b8;">FinSight · ${rapportName} - <a href="${appUrl}" style="color:#94a3b8;">finsight.zineinsight.com</a></p></div></div></body></html>`,
                                },
                                adminLine,
                                adminLine,
                            );

                            if (error) {
                                logger.error('❌ Envoi email SCORIS (acheteur):', error);
                            } else {
                                await (prisma as any).diagnosticLead.updateMany({
                                    where: { stripeSessionId: session.id },
                                    data: { pdfSentAt: new Date() },
                                }).catch(() => null);
                            }
                        } else if (emailNorm && !isResendConfigured()) {
                            logger.warn('⚠️ RESEND non configuré - email SCORIS non envoyé pour', emailNorm);
                        }
                    } catch (err) {
                        logger.error('[webhook] Erreur post-paiement SCORIS:', err);
                    }
                    break;
                }

                // ── Branche abonnement SaaS ───────────────────────────────
                if (session.mode !== 'subscription' || !session.subscription) {
                    logger.debug(
                        'ℹ️ checkout.session.completed ignoré (pas premium calculateur, pas SCORIS, pas abonnement)'
                    );
                    break;
                }

                const userId = session.metadata?.userId;
                if (!userId) {
                    logger.error('❌ userId manquant dans metadata (abonnement)');
                    break;
                }

                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription as string
                );
                const priceId = subscription.items.data[0].price.id;
                const plan = getPlanFromPriceId(priceId);

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

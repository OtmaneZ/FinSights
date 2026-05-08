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
import { resend, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/emails/resend';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
            // CHECKOUT COMPLETED — SCORIS rapport (one-time 49€)
            // ============================================
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                // ── Branche SCORIS ────────────────────────────────────────
                if (session.metadata?.product === 'scoris_report') {
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

                        if (email && process.env.RESEND_API_KEY) {
                            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://finsight.zineinsight.com';
                            const downloadUrl = `${appUrl}/mon-diagnostic?success=true&session_id=${session.id}`;
                            const levelLabel = score
                                ? score >= 75 ? 'Excellente santé financière'
                                : score >= 55 ? 'Situation saine'
                                : score >= 35 ? 'Vigilance requise'
                                : 'Situation critique'
                                : 'Score calculé';

                            await resend.emails.send({
                                from: FROM_EMAIL,
                                replyTo: REPLY_TO_EMAIL,
                                to: email,
                                subject: `Votre rapport SCORIS™ est prêt — Score ${score ?? '—'}/100`,
                                html: `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,sans-serif;"><div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;"><div style="background:#0f172a;padding:32px 40px;"><p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;color:#64748b;text-transform:uppercase;">FinSight · SCORIS™</p><h1 style="margin:12px 0 0;font-size:24px;font-weight:600;color:#fff;">Votre rapport est prêt</h1></div><div style="background:#f1f5f9;padding:24px 40px;border-bottom:1px solid #e2e8f0;"><span style="font-size:48px;font-weight:600;color:#0052cc;font-family:Georgia,serif;">${score ?? '—'}</span><span style="font-size:20px;color:#94a3b8;"> / 100</span><p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#64748b;">${levelLabel}</p></div><div style="padding:32px 40px;"><p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">Merci pour votre confiance. Votre rapport SCORIS™ personnalisé a été généré avec votre score détaillé, les 4 piliers financiers, le plan d'action 90 jours et une synthèse IA calibrée sur les médianes de votre secteur.</p><a href="${downloadUrl}" style="display:inline-block;padding:14px 28px;background:#0f172a;color:#fff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;">Télécharger mon rapport PDF →</a><p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">En cas de problème, répondez directement à cet email.</p></div><div style="padding:20px 40px;border-top:1px solid #e2e8f0;background:#f8fafc;"><p style="margin:0;font-size:11px;color:#94a3b8;">FinSight · SCORIS™ — <a href="${appUrl}" style="color:#94a3b8;">finsight.zineinsight.com</a></p></div></div></body></html>`,
                            });

                            await (prisma as any).diagnosticLead.updateMany({
                                where: { stripeSessionId: session.id },
                                data: { pdfSentAt: new Date() },
                            }).catch(() => null);
                        }
                    } catch (err) {
                        logger.error('[webhook] Erreur post-paiement SCORIS:', err);
                    }
                    break;
                }

                // ── Branche abonnement SaaS ───────────────────────────────
                const userId = session.metadata?.userId;
                if (!userId) {
                    logger.error('❌ userId manquant dans metadata');
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

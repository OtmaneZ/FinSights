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
            // CHECKOUT COMPLETED → Abonnement créé
            // ============================================
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;

                if (!userId) {
                    logger.error('❌ userId manquant dans metadata');
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

/**
 * API Route: Stripe Checkout
 * POST /api/stripe/checkout
 *
 * Deux modes :
 *   1. product = 'scoris_report' → paiement unique 49€ (SCORIS paywall, sans auth)
 *   2. priceId présent           → abonnement PRO/SCALE (auth requise)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, isStripeConfigured, STRIPE_PRICES } from '@/lib/stripe';
import Stripe from 'stripe';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        if (!isStripeConfigured()) {
            return NextResponse.json(
                { success: false, error: 'stripe_not_configured' },
                { status: 402 }
            );
        }

        const body = await req.json();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://finsight.zineinsight.com';

        // ── Mode SCORIS : paiement unique 49€ ou 99€ (Stratégique), pas d'auth requise ──
        const isScorisCheckout =
            body.product === 'scoris_report' ||
            body.product === 'scoris_strategique' ||
            (!body.priceId && body.email);

        if (isScorisCheckout) {
            const { email, score, sector, leadId, returnPath } = body as {
                email: string;
                score?: number;
                sector?: string;
                leadId?: string;
                returnPath?: string;
            };

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return NextResponse.json({ success: false, error: 'Email invalide' }, { status: 400 });
            }

            const isStrategic =
                body.product === 'scoris_strategique' ||
                (body as { scorisLevel?: string }).scorisLevel === 'strategique';

            const priceId = isStrategic
                ? process.env.NEXT_PUBLIC_STRIPE_PRICE_SCORIS_STRATEGIQUE
                : process.env.NEXT_PUBLIC_STRIPE_PRICE_SCORIS_REPORT;

            const fallbackAmount = isStrategic ? 9900 : 4900;
            const productSlug = isStrategic ? 'scoris_strategique' : 'scoris_report';

            const safeReturn =
                typeof returnPath === 'string' && returnPath.startsWith('/') ? returnPath : '/mon-diagnostic';

            const sessionParams: Stripe.Checkout.SessionCreateParams = {
                mode: 'payment',
                customer_email: email.toLowerCase().trim(),
                payment_method_types: ['card'],
                line_items: priceId
                    ? [{ price: priceId, quantity: 1 }]
                    : [{
                        price_data: {
                            currency: 'eur',
                            unit_amount: fallbackAmount,
                            product_data: {
                                name: isStrategic
                                    ? 'Rapport SCORIS Stratégique™ — Diagnostic & Z-Score'
                                    : 'Rapport SCORIS™ — Diagnostic financier personnalisé',
                                description: isStrategic
                                    ? 'Score 4 piliers · Z-Score Altman · SWOT IA · Valorisation · PDF consulting'
                                    : 'Score détaillé · 4 piliers · Plan d\'action 90j · PDF consulting A4 · Généré par IA',
                                images: [`${appUrl}/images/og-default.jpg`],
                            },
                        },
                        quantity: 1,
                    }],
                success_url: `${appUrl}${safeReturn}${safeReturn.includes('?') ? '&' : '?'}success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${appUrl}${safeReturn.split('?')[0]}`,
                metadata: {
                    email: email.toLowerCase().trim(),
                    score: score?.toString() ?? '',
                    sector: sector ?? '',
                    leadId: leadId ?? '',
                    product: productSlug,
                    scorisLevel: isStrategic ? 'strategique' : 'standard',
                },
                locale: 'fr',
            };

            const session = await stripe.checkout.sessions.create(sessionParams);
            logger.debug('[stripe/checkout] Session SCORIS créée:', session.id, 'pour', email);
            return NextResponse.json({ success: true, url: session.url });
        }

        // ── Mode abonnement PRO/SCALE (auth requise) ─────────────────────────
        const nextAuthSession = await getServerSession(authOptions);
        if (!nextAuthSession?.user?.email) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { priceId } = body;
        const validPriceIds = Object.values(STRIPE_PRICES);
        if (!validPriceIds.includes(priceId)) {
            return NextResponse.json({ error: 'Price ID invalide' }, { status: 400 });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer_email: nextAuthSession.user.email,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/tarifs`,
            metadata: { userId: nextAuthSession.user.id },
            subscription_data: { metadata: { userId: nextAuthSession.user.id } },
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error: any) {
        logger.error('❌ Erreur Stripe Checkout:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erreur Stripe' },
            { status: 500 }
        );
    }
}

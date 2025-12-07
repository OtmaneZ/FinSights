/**
 * API Route: Stripe Checkout
 * POST /api/stripe/checkout
 * Crée une session Stripe Checkout pour l'upgrade PRO/SCALE
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        // Vérifier l'authentification
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const { priceId } = await req.json();

        // Valider le priceId
        const validPriceIds = Object.values(STRIPE_PRICES);
        if (!validPriceIds.includes(priceId)) {
            return NextResponse.json(
                { error: 'Price ID invalide' },
                { status: 400 }
            );
        }

        // Créer la session Checkout
        const checkoutSession = await stripe.checkout.sessions.create({
            customer_email: session.user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
            metadata: {
                userId: session.user.id,
            },
            subscription_data: {
                metadata: {
                    userId: session.user.id,
                },
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
        logger.error('❌ Erreur Stripe Checkout:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur lors de la création de la session' },
            { status: 500 }
        );
    }
}

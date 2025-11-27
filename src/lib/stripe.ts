/**
 * Stripe Configuration
 * Client singleton + Price IDs
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY manquant dans .env');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia' as any, // Version Stripe actuelle (Nov 2024)
    typescript: true,
});

// ============================================
// STRIPE PRICE IDS (à créer dans Stripe Dashboard)
// ============================================

export const STRIPE_PRICES = {
    PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || 'price_xxx',
    PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || 'price_yyy',
    SCALE_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE_MONTHLY || 'price_zzz',
    SCALE_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE_YEARLY || 'price_aaa',
} as const;

// ============================================
// HELPERS
// ============================================

/**
 * Récupère le plan depuis le price ID Stripe
 */
export function getPlanFromPriceId(priceId: string): 'FREE' | 'PRO' | 'SCALE' | 'ENTERPRISE' {
    switch (priceId) {
        case STRIPE_PRICES.PRO_MONTHLY:
        case STRIPE_PRICES.PRO_YEARLY:
            return 'PRO';
        case STRIPE_PRICES.SCALE_MONTHLY:
        case STRIPE_PRICES.SCALE_YEARLY:
            return 'SCALE';
        default:
            return 'FREE';
    }
}

/**
 * Vérifie si l'abonnement est actif
 */
export function isSubscriptionActive(currentPeriodEnd: Date | null): boolean {
    if (!currentPeriodEnd) return false;
    return new Date(currentPeriodEnd) > new Date();
}

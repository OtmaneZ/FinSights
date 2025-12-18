/**
 * Stripe Configuration
 * Client singleton + Price IDs
 */

import Stripe from 'stripe';

// Créer le client Stripe uniquement si la clé est disponible
// Cela permet au build de fonctionner même sans STRIPE_SECRET_KEY
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey 
    ? new Stripe(stripeSecretKey, {
        apiVersion: '2024-11-20.acacia' as any, // Version Stripe actuelle (Nov 2024)
        typescript: true,
    })
    : null as unknown as Stripe; // Type assertion pour éviter les erreurs TS

// Helper pour vérifier si Stripe est configuré
export function isStripeConfigured(): boolean {
    return !!process.env.STRIPE_SECRET_KEY;
}

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

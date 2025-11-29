/**
 * Plan Mapping: Ancien → Nouveau
 *
 * IMPORTANT: Ce fichier gère la transition des anciens noms de plans vers les nouveaux
 *
 * Ancien système: FREE → PRO → SCALE → ENTERPRISE
 * Nouveau système: STARTER → BUSINESS → GROWTH → ENTERPRISE
 *
 * Compatibilité: Les anciens noms restent supportés pendant la migration
 */

export const OLD_TO_NEW_PLAN_MAPPING = {
    FREE: 'STARTER',
    PRO: 'BUSINESS',
    SCALE: 'GROWTH',
    ENTERPRISE: 'ENTERPRISE' // Reste identique
} as const;

export const NEW_TO_OLD_PLAN_MAPPING = {
    STARTER: 'FREE',
    BUSINESS: 'PRO',
    GROWTH: 'SCALE',
    ENTERPRISE: 'ENTERPRISE'
} as const;

export type OldPlan = keyof typeof OLD_TO_NEW_PLAN_MAPPING;
export type NewPlan = typeof OLD_TO_NEW_PLAN_MAPPING[OldPlan];

/**
 * Convertit un ancien nom de plan vers le nouveau
 */
export function mapOldPlanToNew(oldPlan: OldPlan): NewPlan {
    return OLD_TO_NEW_PLAN_MAPPING[oldPlan];
}

/**
 * Convertit un nouveau nom de plan vers l'ancien (pour compatibilité DB)
 */
export function mapNewPlanToOld(newPlan: NewPlan): OldPlan {
    return NEW_TO_OLD_PLAN_MAPPING[newPlan];
}

/**
 * Affiche le nom lisible du plan
 */
export const PLAN_DISPLAY_NAMES = {
    STARTER: 'Starter',
    BUSINESS: 'Business',
    GROWTH: 'Growth',
    ENTERPRISE: 'Enterprise'
} as const;

/**
 * Prix des plans (mensuel)
 */
export const PLAN_PRICES = {
    STARTER: 0,
    BUSINESS: 99,
    GROWTH: 199,
    ENTERPRISE: null // Sur devis
} as const;

/**
 * Prix des plans (annuel avec -20%)
 */
export const PLAN_PRICES_YEARLY = {
    STARTER: 0,
    BUSINESS: 950,  // 99 * 12 * 0.8
    GROWTH: 1910,   // 199 * 12 * 0.8
    ENTERPRISE: null
} as const;

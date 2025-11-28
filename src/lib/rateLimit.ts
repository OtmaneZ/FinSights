/**
 * Rate Limiting System with Vercel KV (Redis)
 * Enforces limits based on user plan (FREE/PRO/SCALE)
 */

import { kv } from '@vercel/kv';
import type { Plan } from '@prisma/client';

// ============================================
// RATE LIMITS BY PLAN (per day)
// Version finale optimale (ChatGPT + Otmane)
// ============================================

export const RATE_LIMITS = {
    FREE: {
        copilot_queries: 10,    // 10 questions/jour
        api_calls: 0,           // Pas d'API REST
        uploads: 5,             // 5 uploads/mois (protection storage)
        dashboards: 1,          // 1 entreprise
    },
    PRO: {
        copilot_queries: -1,    // Illimité (pas de soft cap)
        api_calls: 1000,        // 1000 calls/jour
        uploads: -1,            // Uploads illimités
        dashboards: 5,          // 5 entreprises
    },
    SCALE: {
        copilot_queries: -1,    // Illimité
        api_calls: 10000,       // 10k calls/jour
        uploads: -1,            // Illimité
        dashboards: -1,         // Illimité
    },
    ENTERPRISE: {
        copilot_queries: -1,    // Illimité
        api_calls: -1,          // Illimité
        uploads: -1,            // Illimité
        dashboards: -1,         // Illimité
    },
} as const;

export type RateLimitAction = keyof typeof RATE_LIMITS.FREE;

// ============================================
// UNIFIED RATE LIMITING (IP + User + Plan)
// ============================================

export interface UnifiedRateLimitResult {
    allowed: boolean;
    current: number;
    limit: number;
    remaining: number;
    resetAt: Date | null;
    message?: string;
    upgradeUrl?: string;
}

/**
 * Rate limiting unifié : gère IP (non connecté) ET user (connecté)
 * 
 * @param identifier - IP si non connecté, userId si connecté
 * @param action - Type d'action (copilot_queries, uploads, etc.)
 * @param userPlan - Plan de l'utilisateur (FREE, PRO, SCALE, ENTERPRISE)
 * @param isAuthenticated - True si utilisateur connecté
 */
export async function checkUnifiedRateLimit(
    identifier: string,
    action: RateLimitAction,
    userPlan: Plan = 'FREE',
    isAuthenticated: boolean = false
): Promise<UnifiedRateLimitResult> {
    
    // ============================================
    // CAS 1: User NON CONNECTÉ (IP-based)
    // ============================================
    if (!isAuthenticated) {
        // Limite spéciale pour visiteurs : 5 questions max permanent
        if (action === 'copilot_queries') {
            const limit = 5;
            const key = `ratelimit:ip:${identifier}:copilot`;

            try {
                const current = (await kv.get<number>(key)) || 0;

                if (current >= limit) {
                    return {
                        allowed: false,
                        current,
                        limit,
                        remaining: 0,
                        resetAt: null,
                        message: '🎁 Créez un compte gratuit pour 10 questions/jour',
                        upgradeUrl: '/auth/signup'
                    };
                }

                await kv.incr(key);
                // Pas d'expiration = permanent jusqu'à signup

                return {
                    allowed: true,
                    current: current + 1,
                    limit,
                    remaining: limit - current - 1,
                    resetAt: null,
                    message: current === 3 ? '🎁 Plus que 2 questions ! Créez un compte gratuit pour continuer' : undefined,
                    upgradeUrl: current === 3 ? '/auth/signup' : undefined
                };
            } catch (error) {
                console.error('Rate limit check failed (IP):', error);
                // Graceful fallback
                return {
                    allowed: true,
                    current: 0,
                    limit,
                    remaining: limit,
                    resetAt: null
                };
            }
        }

        // Autres actions bloquées pour non-connectés
        return {
            allowed: false,
            current: 0,
            limit: 0,
            remaining: 0,
            resetAt: null,
            message: 'Créez un compte gratuit pour accéder à cette fonctionnalité',
            upgradeUrl: '/auth/signup'
        };
    }

    // ============================================
    // CAS 2: User CONNECTÉ (User-based)
    // ============================================
    
    const limit = RATE_LIMITS[userPlan][action];

    // -1 = illimité
    if (limit === -1) {
        return {
            allowed: true,
            current: 0,
            limit: -1,
            remaining: -1,
            resetAt: null
        };
    }

    // Upload = limite MENSUELLE (pas journalière)
    const isMonthly = action === 'uploads';
    const period = isMonthly ? getMonth() : getToday();
    const key = `ratelimit:user:${identifier}:${action}:${period}`;
    const ttl = isMonthly ? 2592000 : 86400; // 30 jours ou 24h

    try {
        const current = (await kv.get<number>(key)) || 0;

        if (current >= limit) {
            const resetAt = isMonthly ? getNextMonth() : getNextMidnight();
            const periodText = isMonthly ? 'mois' : 'jour';
            
            let message = '';
            let upgradeUrl = '';

            if (userPlan === 'FREE') {
                if (action === 'copilot_queries') {
                    message = `💎 Limite FREE atteinte (${limit}/${periodText}). Passez PRO pour l'IA illimitée !`;
                    upgradeUrl = '/pricing';
                } else if (action === 'uploads') {
                    message = `📂 Limite FREE atteinte (${limit} uploads/${periodText}). Upgrade PRO pour uploads illimités !`;
                    upgradeUrl = '/pricing';
                }
            }

            return {
                allowed: false,
                current,
                limit,
                remaining: 0,
                resetAt,
                message,
                upgradeUrl
            };
        }

        await kv.incr(key);
        await kv.expire(key, ttl);

        const remaining = limit - current - 1;
        let message = undefined;
        let upgradeUrl = undefined;

        // Message d'avertissement quand proche de la limite
        if (userPlan === 'FREE' && remaining === 2 && action === 'copilot_queries') {
            message = '💎 Plus que 2 questions aujourd\'hui ! Passez PRO pour l\'illimité';
            upgradeUrl = '/pricing';
        }

        return {
            allowed: true,
            current: current + 1,
            limit,
            remaining,
            resetAt: isMonthly ? getNextMonth() : getNextMidnight(),
            message,
            upgradeUrl
        };
    } catch (error) {
        console.error(`Rate limit check failed (user ${action}):`, error);
        // Graceful fallback
        return {
            allowed: true,
            current: 0,
            limit,
            remaining: limit,
            resetAt: isMonthly ? getNextMonth() : getNextMidnight()
        };
    }
}

// ============================================
// LEGACY IN-MEMORY (Fallback)
// ============================================

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// ============================================
// MAIN FUNCTIONS (Vercel KV)
// ============================================

interface RateLimitResult {
    success: boolean;
    current: number;
    limit: number;
    remaining: number;
    resetAt: Date;
}

/**
 * Check rate limit for user action (Vercel KV)
 */
export async function checkRateLimitKV(
    userId: string,
    action: RateLimitAction,
    userPlan: Plan
): Promise<RateLimitResult> {
    const limit = RATE_LIMITS[userPlan][action];

    // -1 means unlimited
    if (limit === -1) {
        return {
            success: true,
            current: 0,
            limit: -1,
            remaining: -1,
            resetAt: getNextMidnight(),
        };
    }

    const today = getToday();
    const key = `ratelimit:${userId}:${action}:${today}`;

    try {
        const current = (await kv.get<number>(key)) || 0;

        if (current >= limit) {
            return {
                success: false,
                current,
                limit,
                remaining: 0,
                resetAt: getNextMidnight(),
            };
        }

        await kv.incr(key);
        await kv.expire(key, 86400); // 24h

        return {
            success: true,
            current: current + 1,
            limit,
            remaining: limit - current - 1,
            resetAt: getNextMidnight(),
        };
    } catch (error) {
        console.error('Rate limit check failed:', error);
        return {
            success: true,
            current: 0,
            limit,
            remaining: limit,
            resetAt: getNextMidnight(),
        };
    }
}

/**
 * Get remaining quota for a user
 */
export async function getRemainingQuota(
    userId: string,
    action: RateLimitAction,
    userPlan: Plan
): Promise<{ current: number; limit: number; remaining: number }> {
    const limit = RATE_LIMITS[userPlan][action];

    if (limit === -1) {
        return { current: 0, limit: -1, remaining: -1 };
    }

    const today = getToday();
    const key = `ratelimit:${userId}:${action}:${today}`;

    try {
        const current = (await kv.get<number>(key)) || 0;
        return {
            current,
            limit,
            remaining: Math.max(0, limit - current),
        };
    } catch (error) {
        console.error('Get quota failed:', error);
        return { current: 0, limit, remaining: limit };
    }
}

function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

function getMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getNextMidnight(): Date {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return tomorrow;
}

function getNextMonth(): Date {
    const nextMonth = new Date();
    nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
    nextMonth.setUTCDate(1);
    nextMonth.setUTCHours(0, 0, 0, 0);
    return nextMonth;
}

// ============================================
// LEGACY FUNCTIONS (In-memory fallback)
// ============================================

interface RateLimitConfig {
    maxRequests: number
    windowMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000
}

/**
 * Vérifie si une IP/clé a dépassé la limite de requêtes
 * @param identifier - IP ou identifiant unique
 * @param config - Configuration du rate limit
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): {
    allowed: boolean
    remaining: number
    resetTime: number
} {
    const now = Date.now()
    const entry = rateLimitMap.get(identifier)

    // Nettoyer les entrées expirées (garbage collection)
    if (entry && now > entry.resetTime) {
        rateLimitMap.delete(identifier)
    }

    // Première requête ou fenêtre expirée
    if (!entry || now > entry.resetTime) {
        const resetTime = now + config.windowMs
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime
        })
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime
        }
    }

    // Incrémenter le compteur
    entry.count += 1
    rateLimitMap.set(identifier, entry)

    // Vérifier la limite
    const allowed = entry.count <= config.maxRequests
    const remaining = Math.max(0, config.maxRequests - entry.count)

    return {
        allowed,
        remaining,
        resetTime: entry.resetTime
    }
}

/**
 * Extraire l'IP du client depuis la requête Next.js
 */
export function getClientIP(req: any): string {
    // Vercel forwarded IP
    const forwardedFor = req.headers['x-forwarded-for']
    if (forwardedFor) {
        return Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0]
    }

    // Vercel real IP
    const realIP = req.headers['x-real-ip']
    if (realIP) {
        return Array.isArray(realIP) ? realIP[0] : realIP
    }

    // Fallback
    return req.socket?.remoteAddress || 'unknown'
}

/**
 * Nettoyer les entrées expirées (à appeler périodiquement)
 */
export function cleanupExpiredEntries() {
    const now = Date.now()
    const keysToDelete: string[] = []

    rateLimitMap.forEach((entry, key) => {
        if (now > entry.resetTime) {
            keysToDelete.push(key)
        }
    })

    keysToDelete.forEach(key => rateLimitMap.delete(key))
}

// Nettoyer toutes les heures
setInterval(cleanupExpiredEntries, 60 * 60 * 1000)

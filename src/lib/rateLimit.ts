/**
 * Rate Limiting System with Vercel KV (Redis)
 * Enforces limits based on user plan (FREE/PRO/SCALE)
 */

import { kv } from '@vercel/kv';
import type { Plan } from '@prisma/client';

// ============================================
// RATE LIMITS BY PLAN (per day)
// ============================================

export const RATE_LIMITS = {
    FREE: {
        copilot_queries: 10,
        api_calls: 0,
        uploads: 10,
        dashboards: 1,
    },
    PRO: {
        copilot_queries: -1, // Unlimited
        api_calls: 1000,
        uploads: 100,
        dashboards: 5,
    },
    SCALE: {
        copilot_queries: -1, // Unlimited
        api_calls: 10000,
        uploads: 1000,
        dashboards: -1, // Unlimited
    },
    ENTERPRISE: {
        copilot_queries: -1,
        api_calls: -1,
        uploads: -1,
        dashboards: -1,
    },
} as const;

export type RateLimitAction = keyof typeof RATE_LIMITS.FREE;

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

function getNextMidnight(): Date {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return tomorrow;
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

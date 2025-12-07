/**
 * ⚠️ DEPRECATED - Use checkUnifiedRateLimit from '@/lib/rateLimit' instead
 * 
 * SMART RATE LIMITING - FinSight SaaS
 * 
 * This file is kept for backward compatibility but is NO LONGER USED.
 * All rate limiting is now handled by checkUnifiedRateLimit() in rateLimit.ts
 * which consolidates IP-based and user-based rate limiting.
 * 
 * User non connecté (IP-based):
 *   → 5 questions max → "Créez compte FREE"
 * 
 * User FREE (user-based):
 *   → 10 questions/jour → "Upgrade PRO"
 * 
 * User PRO/SCALE/ENTERPRISE:
 *   → Illimité
 */

import { kv } from '@vercel/kv';
import { RATE_LIMITS } from './rateLimit';
import type { Plan } from '@prisma/client';
import { logger } from '@/lib/logger';

export interface SmartRateLimitResult {
    allowed: boolean;
    remaining: number;
    limit: number;
    resetAt: Date | null;
    upgradeMessage?: string;
    upgradeUrl?: string;
}

/**
 * Check rate limit intelligemment (IP ou User selon session)
 */
export async function checkSmartRateLimit(
    identifier: string, // IP si non connecté, userId si connecté
    userPlan?: Plan,
    isAuthenticated: boolean = false
): Promise<SmartRateLimitResult> {
    
    // 🔓 User PRO/SCALE/ENTERPRISE = ILLIMITÉ
    if (isAuthenticated && userPlan && ['PRO', 'SCALE', 'ENTERPRISE'].includes(userPlan)) {
        return {
            allowed: true,
            remaining: -1,
            limit: -1,
            resetAt: null
        };
    }

    // 🟡 User FREE = 10 questions/jour (user-based)
    if (isAuthenticated && userPlan === 'FREE') {
        const limit = RATE_LIMITS.FREE.copilot_queries; // 10
        const today = getToday();
        const key = `ratelimit:user:${identifier}:copilot:${today}`;

        try {
            const current = (await kv.get<number>(key)) || 0;

            if (current >= limit) {
                return {
                    allowed: false,
                    remaining: 0,
                    limit,
                    resetAt: getNextMidnight(),
                    upgradeMessage: '💎 Passez PRO pour des questions IA illimitées',
                    upgradeUrl: '/pricing'
                };
            }

            await kv.incr(key);
            await kv.expire(key, 86400); // 24h

            return {
                allowed: true,
                remaining: limit - current - 1,
                limit,
                resetAt: getNextMidnight()
            };
        } catch (error) {
            logger.error('Rate limit check failed (user):', error);
            return {
                allowed: true,
                remaining: limit,
                limit,
                resetAt: getNextMidnight()
            };
        }
    }

    // ❌ User NON CONNECTÉ = 5 questions max permanent (IP-based)
    const limit = 5;
    const key = `ratelimit:ip:${identifier}:copilot`;

    try {
        const current = (await kv.get<number>(key)) || 0;

        if (current >= limit) {
            return {
                allowed: false,
                remaining: 0,
                limit,
                resetAt: null,
                upgradeMessage: '🎁 Créez un compte gratuit pour 10 questions/jour',
                upgradeUrl: '/auth/signup'
            };
        }

        await kv.incr(key);
        // Pas d'expiration = permanent jusqu'à signup

        const remainingQueries = limit - current - 1;

        return {
            allowed: true,
            remaining: remainingQueries,
            limit,
            resetAt: null,
            upgradeMessage: remainingQueries === 1 ? '🎁 Créez un compte gratuit pour plus' : undefined,
            upgradeUrl: remainingQueries === 1 ? '/auth/signup' : undefined
        };
    } catch (error) {
        logger.error('Rate limit check failed (IP):', error);
        return {
            allowed: true,
            remaining: limit,
            limit,
            resetAt: null
        };
    }
}

// Helper functions
function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

function getNextMidnight(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
}

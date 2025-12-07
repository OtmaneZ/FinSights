/**
 * RATE LIMITING avec Vercel KV (Production-Ready)
 *
 * Limite: 5 requêtes TOTALES par IP (permanent)
 * Après 5 requêtes → Redirection vers Calendly pour déblocage
 */

import { kv } from '@vercel/kv';
import { logger } from '@/lib/logger';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    total: number;
    resetTime: null; // Pas de reset, limite permanente
    calendlyUrl: string;
}

const MAX_REQUESTS_TOTAL = 5;
const CALENDLY_URL = 'https://calendly.com/zineinsight';

/**
 * Vérifie et incrémente le compteur de requêtes pour une IP
 * @param identifier - IP du client
 * @returns Résultat du rate limit
 */
export async function checkRateLimitKV(
    identifier: string
): Promise<RateLimitResult> {
    try {
        const key = `ratelimit:${identifier}`;

        // Récupérer le compteur actuel
        const currentCount = await kv.get<number>(key) || 0;

        // Si déjà dépassé
        if (currentCount >= MAX_REQUESTS_TOTAL) {
            return {
                allowed: false,
                remaining: 0,
                total: MAX_REQUESTS_TOTAL,
                resetTime: null,
                calendlyUrl: CALENDLY_URL
            };
        }

        // Incrémenter (pas d'expiration, permanent)
        const newCount = await kv.incr(key);

        return {
            allowed: true,
            remaining: Math.max(0, MAX_REQUESTS_TOTAL - newCount),
            total: MAX_REQUESTS_TOTAL,
            resetTime: null,
            calendlyUrl: CALENDLY_URL
        };
    } catch (error) {
        logger.error('❌ Erreur Vercel KV rate limit:', error);

        // Fallback: autoriser en cas d'erreur KV (graceful degradation)
        return {
            allowed: true,
            remaining: MAX_REQUESTS_TOTAL,
            total: MAX_REQUESTS_TOTAL,
            resetTime: null,
            calendlyUrl: CALENDLY_URL
        };
    }
}

/**
 * Récupère le statut actuel sans incrémenter
 */
export async function getRateLimitStatus(
    identifier: string
): Promise<RateLimitResult> {
    try {
        const key = `ratelimit:${identifier}`;
        const currentCount = await kv.get<number>(key) || 0;

        return {
            allowed: currentCount < MAX_REQUESTS_TOTAL,
            remaining: Math.max(0, MAX_REQUESTS_TOTAL - currentCount),
            total: MAX_REQUESTS_TOTAL,
            resetTime: null,
            calendlyUrl: CALENDLY_URL
        };
    } catch (error) {
        logger.error('❌ Erreur lecture status KV:', error);
        return {
            allowed: true,
            remaining: MAX_REQUESTS_TOTAL,
            total: MAX_REQUESTS_TOTAL,
            resetTime: null,
            calendlyUrl: CALENDLY_URL
        };
    }
}

/**
 * Reset manuel du compteur (admin only)
 */
export async function resetRateLimit(identifier: string): Promise<void> {
    try {
        const key = `ratelimit:${identifier}`;
        await kv.del(key);
        logger.debug(`✅ Rate limit reset pour: ${identifier}`);
    } catch (error) {
        logger.error('❌ Erreur reset rate limit:', error);
        throw error;
    }
}

/**
 * Cache pour embeddings OpenAI
 */
export async function getCachedEmbedding(text: string): Promise<number[] | null> {
    try {
        const key = `embedding:${Buffer.from(text).toString('base64').slice(0, 100)}`;
        const cached = await kv.get<number[]>(key);

        if (cached) {
            logger.debug('✅ Embedding cache HIT');
        }

        return cached;
    } catch (error) {
        logger.error('❌ Erreur lecture cache embedding:', error);
        return null;
    }
}

/**
 * Stocke un embedding dans le cache (30 jours)
 */
export async function setCachedEmbedding(text: string, embedding: number[]): Promise<void> {
    try {
        const key = `embedding:${Buffer.from(text).toString('base64').slice(0, 100)}`;

        // Cache 30 jours
        await kv.set(key, embedding, {
            ex: 30 * 24 * 60 * 60 // 30 jours en secondes
        });

        logger.debug('✅ Embedding mis en cache');
    } catch (error) {
        logger.error('❌ Erreur cache embedding:', error);
        // Ne pas bloquer si le cache échoue
    }
}

/**
 * Extraire l'IP du client depuis la requête Next.js
 */
export function getClientIP(req: any): string {
    // Vercel forwarded IP
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        return Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0];
    }

    // Vercel real IP
    const realIP = req.headers['x-real-ip'];
    if (realIP) {
        return Array.isArray(realIP) ? realIP[0] : realIP;
    }

    // Fallback
    return req.socket?.remoteAddress || 'unknown';
}

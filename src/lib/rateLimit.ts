// Simple in-memory rate limiting
// Pour une vraie prod, utiliser Redis ou Vercel KV

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

interface RateLimitConfig {
    maxRequests: number // Nombre max de requêtes
    windowMs: number // Fenêtre de temps en millisecondes
}

// Configuration par défaut : 10 requêtes par heure
const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000 // 1 heure
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

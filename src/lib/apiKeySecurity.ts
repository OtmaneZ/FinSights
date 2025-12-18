/**
 * Utilitaires Sécurité - Hashing API Keys
 * SHA-256 pour stockage sécurisé des clés API
 */

import crypto from 'crypto';

/**
 * Hash une API key avec SHA-256
 * @param apiKey - Clé API en clair
 * @returns Hash SHA-256 de la clé
 */
export function hashAPIKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Génère une API key sécurisée (32 bytes = 64 hex chars)
 * Format : fs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * @returns Nouvelle clé API
 */
export function generateAPIKey(): string {
    const randomBytes = crypto.randomBytes(32);
    return `fs_${randomBytes.toString('hex')}`;
}

/**
 * Vérifie qu'une API key correspond au hash stocké
 * @param apiKey - Clé fournie par l'utilisateur
 * @param hashedKey - Hash stocké en base
 * @returns true si correspondance
 */
export function verifyAPIKey(apiKey: string, hashedKey: string): boolean {
    const computedHash = hashAPIKey(apiKey);
    return crypto.timingSafeEqual(
        Buffer.from(computedHash, 'hex'),
        Buffer.from(hashedKey, 'hex')
    );
}

/**
 * Valide le format d'une API key FinSights
 * @param apiKey - Clé à valider
 * @returns true si format valide
 */
export function isValidAPIKeyFormat(apiKey: string): boolean {
    // Format: fs_[64 caractères hexadécimaux]
    return /^fs_[a-f0-9]{64}$/.test(apiKey);
}

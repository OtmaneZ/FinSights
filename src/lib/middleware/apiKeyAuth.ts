/**
 * Middleware Validation API Keys
 * Vérifie et authentifie les API keys hachées
 */

import { NextRequest, NextResponse } from 'next/server';
import { hashAPIKey, isValidAPIKeyFormat } from '@/lib/apiKeySecurity';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * Extrait et valide l'API key depuis les headers
 */
export async function validateAPIKeyMiddleware(
    req: NextRequest
): Promise<{ valid: boolean; userId?: string; error?: string }> {
    try {
        // 1. Extraire API key du header Authorization
        const authHeader = req.headers.get('authorization');

        if (!authHeader) {
            return { valid: false, error: 'Missing Authorization header' };
        }

        // Format: "Bearer fs_XXXXXXX..."
        const [scheme, apiKey] = authHeader.split(' ');

        if (scheme !== 'Bearer' || !apiKey) {
            return { valid: false, error: 'Invalid Authorization format. Use: Bearer <api_key>' };
        }

        // 2. Valider format API key
        if (!isValidAPIKeyFormat(apiKey)) {
            return { valid: false, error: 'Invalid API key format' };
        }

        // 3. Hacher la clé fournie
        const hashedKey = hashAPIKey(apiKey);

        // 4. Chercher en base (on compare les hashs)
        const apiKeyRecord = await prisma.apiKey.findFirst({
            where: {
                keyHash: hashedKey,
                revoked: false,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        plan: true,
                        email: true,
                    },
                },
            },
        });

        if (!apiKeyRecord) {
            logger.warn('[API Auth] Invalid API key attempt', { prefix: apiKey.substring(0, 8) });
            return { valid: false, error: 'Invalid or revoked API key' };
        }

        // 5. Vérifier expiration
        if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
            return { valid: false, error: 'API key expired' };
        }

        // 6. Mettre à jour lastUsed
        await prisma.apiKey.update({
            where: { id: apiKeyRecord.id },
            data: { lastUsed: new Date() },
        });

        logger.debug('[API Auth] Valid API key', {
            userId: apiKeyRecord.userId,
            keyName: apiKeyRecord.name,
        });

        return {
            valid: true,
            userId: apiKeyRecord.userId,
        };
    } catch (error) {
        logger.error('[API Auth] Error validating API key', error);
        return { valid: false, error: 'Internal server error' };
    }
}

/**
 * Middleware Next.js pour protéger routes API v1
 */
export async function withAPIKeyAuth(
    req: NextRequest,
    handler: (req: NextRequest, context: { userId: string }) => Promise<NextResponse>
): Promise<NextResponse> {
    const validation = await validateAPIKeyMiddleware(req);

    if (!validation.valid) {
        return NextResponse.json(
            { error: validation.error },
            { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } }
        );
    }

    return handler(req, { userId: validation.userId! });
}

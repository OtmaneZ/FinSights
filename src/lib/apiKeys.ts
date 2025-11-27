/**
 * API Keys Management System
 * Allows PRO/SCALE users to generate API keys for REST API access
 */

import { prisma } from './prisma';
import { randomBytes } from 'crypto';

/**
 * Generate a new API key for a user
 */
export async function createApiKey(
    userId: string,
    name: string
): Promise<{ id: string; key: string; name: string; createdAt: Date }> {
    // Generate secure random key
    const key = generateApiKey();

    const apiKey = await prisma.apiKey.create({
        data: {
            userId,
            key,
            name,
        },
    });

    return {
        id: apiKey.id,
        key: apiKey.key,
        name: apiKey.name,
        createdAt: apiKey.createdAt,
    };
}

/**
 * List all API keys for a user (without exposing full key)
 */
export async function listApiKeys(userId: string) {
    const apiKeys = await prisma.apiKey.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            lastUsed: true,
            createdAt: true,
            key: true, // Will be masked in response
        },
    });

    return apiKeys.map((key) => ({
        id: key.id,
        name: key.name,
        lastUsed: key.lastUsed,
        createdAt: key.createdAt,
        keyPreview: maskApiKey(key.key),
    }));
}

/**
 * Delete an API key
 */
export async function deleteApiKey(userId: string, keyId: string): Promise<boolean> {
    try {
        await prisma.apiKey.delete({
            where: {
                id: keyId,
                userId, // Ensure user owns this key
            },
        });
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Verify an API key and return user info
 */
export async function verifyApiKey(apiKey: string) {
    const key = await prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    plan: true,
                },
            },
        },
    });

    if (!key) {
        return null;
    }

    // Update lastUsed timestamp
    await prisma.apiKey.update({
        where: { id: key.id },
        data: { lastUsed: new Date() },
    });

    return {
        user: key.user,
        keyId: key.id,
        keyName: key.name,
    };
}

/**
 * Generate a secure API key
 * Format: fsk_live_[40 chars] or fsk_test_[40 chars]
 */
function generateApiKey(mode: 'live' | 'test' = 'live'): string {
    const randomPart = randomBytes(20).toString('hex');
    return `fsk_${mode}_${randomPart}`;
}

/**
 * Mask API key for display (show only first 8 and last 4 chars)
 * Example: fsk_live_abc1234...xyz9
 */
function maskApiKey(key: string): string {
    if (key.length < 20) return key;
    const start = key.substring(0, 12); // fsk_live_abc
    const end = key.substring(key.length - 4); // xyz9
    return `${start}...${end}`;
}

/**
 * API Key authentication error
 */
export class ApiKeyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiKeyError';
    }
}

/**
 * Middleware to authenticate API requests using API key
 */
export async function authenticateApiKey(
    authHeader: string | undefined
): Promise<{ userId: string; userPlan: string; keyName: string }> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiKeyError('Missing or invalid Authorization header');
    }

    const apiKey = authHeader.replace('Bearer ', '');

    if (!apiKey.startsWith('fsk_')) {
        throw new ApiKeyError('Invalid API key format');
    }

    const result = await verifyApiKey(apiKey);

    if (!result) {
        throw new ApiKeyError('Invalid API key');
    }

    // Check if user plan allows API access
    if (result.user.plan === 'FREE') {
        throw new ApiKeyError('API access requires PRO or SCALE plan');
    }

    return {
        userId: result.user.id,
        userPlan: result.user.plan,
        keyName: result.keyName,
    };
}

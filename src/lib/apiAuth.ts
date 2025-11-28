/**
 * API v1 Authentication Middleware
 * Validates Bearer tokens for public API access
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, ApiKeyError } from './apiKeys';

export interface ApiAuthContext {
    userId: string;
    userPlan: string;
    keyName: string;
}

/**
 * Authenticate API request using Bearer token
 * Returns authenticated user context or error response
 */
export async function authenticateRequest(
    request: NextRequest
): Promise<{ auth?: ApiAuthContext; error?: NextResponse }> {
    try {
        const authHeader = request.headers.get('Authorization');
        const auth = await authenticateApiKey(authHeader || '');

        return { auth };
    } catch (error) {
        if (error instanceof ApiKeyError) {
            return {
                error: NextResponse.json(
                    {
                        error: 'Authentication failed',
                        message: error.message,
                        code: 'INVALID_API_KEY',
                    },
                    { status: 401 }
                ),
            };
        }

        console.error('API authentication error:', error);
        return {
            error: NextResponse.json(
                {
                    error: 'Internal server error',
                    message: 'Failed to authenticate request',
                    code: 'AUTH_ERROR',
                },
                { status: 500 }
            ),
        };
    }
}

/**
 * Standard API error response
 */
export function apiError(
    message: string,
    code: string,
    status: number = 400
): NextResponse {
    return NextResponse.json(
        {
            error: message,
            code,
            timestamp: new Date().toISOString(),
        },
        { status }
    );
}

/**
 * Standard API success response
 */
export function apiSuccess<T>(data: T, meta?: Record<string, any>): NextResponse {
    return NextResponse.json({
        success: true,
        data,
        ...(meta && { meta }),
        timestamp: new Date().toISOString(),
    });
}

/**
 * Paginated API response
 */
export function apiPaginatedSuccess<T>(
    items: T[],
    total: number,
    page: number,
    limit: number
): NextResponse {
    return NextResponse.json({
        success: true,
        data: items,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
        },
        timestamp: new Date().toISOString(),
    });
}

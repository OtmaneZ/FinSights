/**
 * Middleware CORS avec Whitelist Domaines
 * Protection CSRF pour API publique
 */

import { NextRequest, NextResponse } from 'next/server';

// Liste blanche des domaines autorisés
const ALLOWED_ORIGINS = [
    'https://getfinsight.fr',
    'https://www.finsight.zineinsight.com',
    'https://finsights.app',
    'https://www.finsights.app',
    process.env.NEXT_PUBLIC_APP_URL || '',
    // Dev local
    ...(process.env.NODE_ENV === 'development'
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : []),
].filter(Boolean);

/**
 * Vérifie si l'origine est autorisée
 */
function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false;
    return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Middleware CORS pour API routes
 * @param req - Requête Next.js
 * @param res - Réponse Next.js
 */
export function corsMiddleware(req: NextRequest): NextResponse {
    const origin = req.headers.get('origin');
    const response = NextResponse.next();

    // 1. Vérifier origine
    if (origin && isOriginAllowed(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    // 2. Gérer preflight OPTIONS
    if (req.method === 'OPTIONS') {
        const preflightResponse = new NextResponse(null, { status: 204 });

        if (origin && isOriginAllowed(origin)) {
            preflightResponse.headers.set('Access-Control-Allow-Origin', origin);
            preflightResponse.headers.set('Access-Control-Allow-Credentials', 'true');
            preflightResponse.headers.set(
                'Access-Control-Allow-Methods',
                'GET, POST, PUT, DELETE, OPTIONS'
            );
            preflightResponse.headers.set(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization, X-Requested-With'
            );
            preflightResponse.headers.set('Access-Control-Max-Age', '86400'); // 24h cache
        }

        return preflightResponse;
    }

    return response;
}

/**
 * Applique CORS aux API routes v1
 */
export function withCORS(
    handler: (req: NextRequest) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
    return async (req: NextRequest) => {
        const origin = req.headers.get('origin');

        // Préflight OPTIONS
        if (req.method === 'OPTIONS') {
            const preflightResponse = new NextResponse(null, { status: 204 });

            if (origin && isOriginAllowed(origin)) {
                preflightResponse.headers.set('Access-Control-Allow-Origin', origin);
                preflightResponse.headers.set('Access-Control-Allow-Credentials', 'true');
                preflightResponse.headers.set(
                    'Access-Control-Allow-Methods',
                    'GET, POST, PUT, DELETE, OPTIONS'
                );
                preflightResponse.headers.set(
                    'Access-Control-Allow-Headers',
                    'Content-Type, Authorization'
                );
                preflightResponse.headers.set('Access-Control-Max-Age', '86400');
            }

            return preflightResponse;
        }

        // Exécuter handler
        const response = await handler(req);

        // Ajouter headers CORS si origine autorisée
        if (origin && isOriginAllowed(origin)) {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set('Access-Control-Allow-Credentials', 'true');
        }

        return response;
    };
}

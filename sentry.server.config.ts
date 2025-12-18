/**
 * Sentry Server Configuration (Backend)
 * Monitoring erreurs API routes + serveur
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV || 'development',
    enabled: process.env.NODE_ENV === 'production',

    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% des transactions

    // Erreurs à ignorer
    ignoreErrors: [
        'ECONNRESET',
        'ETIMEDOUT',
        'ENOTFOUND',
        // Rate limiting (attendu)
        'Rate limit exceeded',
    ],

    beforeSend(event, hint) {
        const error = hint.originalException;

        // Ne pas logger erreurs auth attendues
        if (
            event.exception?.values?.[0]?.value?.includes('Unauthorized') ||
            event.exception?.values?.[0]?.value?.includes('Invalid API key')
        ) {
            return null;
        }

        // Nettoyer données sensibles
        if (event.request) {
            delete event.request.cookies;
            if (event.request.headers) {
                delete event.request.headers['authorization'];
                delete event.request.headers['cookie'];
            }
        }

        return event;
    },

    // Tags contextuels
    initialScope: {
        tags: {
            app: 'finsights',
            runtime: 'nodejs',
            version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
        },
    },
});

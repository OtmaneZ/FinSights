/**
 * Sentry Client Configuration (Frontend)
 * Monitoring erreurs navigateur + performance
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV || 'development',
    enabled: process.env.NODE_ENV === 'production',

    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% des transactions (optimiser coûts)

    // Session Replay
    replaysSessionSampleRate: 0.01, // 1% sessions normales
    replaysOnErrorSampleRate: 1.0, // 100% sessions avec erreurs

    // Erreurs à ignorer (bruits)
    ignoreErrors: [
        // Erreurs navigateur courantes
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Network request failed',
        'Failed to fetch',
        // Erreurs extensions navigateur
        'chrome-extension://',
        'moz-extension://',
    ],

    beforeSend(event, hint) {
        // Filtrer erreurs non critiques
        const error = hint.originalException;

        // Ne pas envoyer erreurs 404/401 (normales)
        if (event.exception?.values?.[0]?.value?.includes('404')) {
            return null;
        }

        // Anonymiser données sensibles
        if (event.user) {
            delete event.user.email;
            delete event.user.ip_address;
        }

        return event;
    },

    // Tags contextuels
    initialScope: {
        tags: {
            app: 'finsights',
            version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
        },
    },
});

/**
 * Sentry Edge Configuration
 * Monitoring pour Edge Runtime (middleware)
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    enabled: process.env.NODE_ENV === 'production',
    tracesSampleRate: 0.05, // 5% pour edge (plus léger)
});

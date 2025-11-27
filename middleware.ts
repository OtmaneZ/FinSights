/**
 * Next.js Middleware
 * Protège les routes authentifiées
 */

export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/settings/:path*',
        '/api/dashboards/:path*',
        '/api/stripe/checkout',
    ],
};

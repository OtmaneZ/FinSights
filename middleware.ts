/**
 * Next.js Middleware
 * - Protège les routes authentifiées via NextAuth
 * - Protège /simulateurs/* via cookie sim_access (Magic Link)
 * - Laisse passer les bots Google/SEO sans cookie
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'

const BOTS_REGEX =
    /googlebot|adsbot-google|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|applebot|rogerbot|semrushbot|ahrefsbot/i

export default withAuth(
    function middleware(req: NextRequest) {
        const { pathname } = req.nextUrl

        // Protection Magic Link : /simulateurs/* sauf /simulateurs/acces et /simulateurs (liste)
        if (
            pathname.startsWith('/simulateurs/') &&
            pathname !== '/simulateurs/acces' &&
            !pathname.startsWith('/simulateurs/acces')
        ) {
            const ua = req.headers.get('user-agent') || ''
            // Laisser passer les bots SEO
            if (BOTS_REGEX.test(ua)) return NextResponse.next()

            const simCookie = req.cookies.get('sim_access')
            if (simCookie?.value !== '1') {
                return NextResponse.redirect(new URL('/simulateurs/acces', req.url))
            }
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            // NextAuth autorise par défaut si session valide.
            // On retourne true pour laisser notre middleware custom décider.
            authorized: () => true,
        },
    }
)

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/settings/:path*',
        '/api/dashboards/:path*',
        '/api/stripe/checkout',
        '/simulateurs/:path*',
    ],
}

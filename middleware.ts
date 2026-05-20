/**
 * Next.js Middleware
 * - Protège les routes authentifiées via NextAuth
 * - Les simulateurs publics (ex. coût salarié) ne sont plus redirigés ici ;
 *   le gate est géré en inline sur la page via cookie sim_access.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
    function middleware(_req: NextRequest) {
        return NextResponse.next()
    },
    {
        callbacks: {
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
    ],
}

/**
 * Next-Auth API Route Handler
 * Configuration centralisée dans @/lib/auth
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering (no static optimization)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

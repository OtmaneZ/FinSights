/**
 * Next-Auth API Route Handler
 * Configuration centralisée dans @/lib/auth
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

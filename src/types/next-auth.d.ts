/**
 * TypeScript Types Extensions
 * Augmente les types Next-Auth
 */

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            plan: 'FREE' | 'PRO' | 'SCALE' | 'ENTERPRISE';
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        email: string;
        name?: string | null;
        plan: 'FREE' | 'PRO' | 'SCALE' | 'ENTERPRISE';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        plan: 'FREE' | 'PRO' | 'SCALE' | 'ENTERPRISE';
    }
}

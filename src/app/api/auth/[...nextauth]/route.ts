/**
 * Next-Auth Configuration
 * Auth Provider: Credentials (email/password)
 * Session: JWT-based
 */

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'vous@exemple.com' },
                password: { label: 'Mot de passe', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email et mot de passe requis');
                }

                // Trouver l'utilisateur
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error('Email ou mot de passe incorrect');
                }

                // Vérifier le mot de passe
                const isPasswordValid = await compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Email ou mot de passe incorrect');
                }

                // Retourner les infos user (sans password)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    plan: user.plan,
                };
            },
        }),
    ],

    pages: {
        signIn: '/auth/signin',
        signUp: '/auth/signup',
        error: '/auth/error',
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.plan = user.plan;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.plan = token.plan as string;
            }
            return session;
        },
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 jours
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

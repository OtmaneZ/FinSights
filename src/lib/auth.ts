/**
 * Next-Auth Configuration (centralized)
 * Used by API routes and getServerSession()
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { compare } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

// Extend NextAuth types to include custom fields
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            plan: 'FREE' | 'PRO' | 'SCALE' | 'ENTERPRISE';
            provider?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    interface User {
        id: string;
        plan: 'FREE' | 'PRO' | 'SCALE' | 'ENTERPRISE';
        provider?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        plan: 'FREE' | 'PRO' | 'SCALE' | 'ENTERPRISE';
        provider?: string;
    }
}

// Lazy load Prisma to avoid build-time issues
const getPrisma = () => {
    const globalForPrisma = global as unknown as { prisma: PrismaClient };
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
    }
    return globalForPrisma.prisma;
};

export const authOptions: NextAuthOptions = {
    providers: [
        // ============================================
        // CREDENTIALS PROVIDER (Email/Password)
        // ============================================
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

                const prisma = getPrisma();

                // Trouver l'utilisateur
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error('Email ou mot de passe incorrect');
                }

                // Vérifier que c'est bien un compte credentials (pas SSO)
                if (user.provider && user.provider !== 'credentials') {
                    throw new Error(`Ce compte utilise ${user.provider}. Connectez-vous via ${user.provider}.`);
                }

                // Vérifier le mot de passe
                if (!user.password) {
                    throw new Error('Compte SSO - utilisez Google ou Microsoft');
                }

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
                    image: user.avatar,
                };
            },
        }),

        // ============================================
        // GOOGLE SSO PROVIDER
        // ============================================
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),

        // ============================================
        // MICROSOFT (AZURE AD) SSO PROVIDER
        // ============================================
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID || '',
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
            tenantId: process.env.AZURE_AD_TENANT_ID || 'common', // 'common' = multi-tenant
        }),
    ],

    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },

    callbacks: {
        // ============================================
        // SIGNIN CALLBACK - Gestion SSO
        // ============================================
        async signIn({ user, account, profile }) {
            if (!account) return true;

            const prisma = getPrisma();

            // Si connexion SSO (Google ou Azure AD)
            if (account.provider === 'google' || account.provider === 'azure-ad') {
                const email = user.email;
                const providerId = account.providerAccountId;
                const provider = account.provider;

                if (!email) {
                    console.error('Email manquant dans le profil SSO');
                    return false;
                }

                // Chercher un utilisateur existant avec cet email
                let existingUser = await prisma.user.findUnique({
                    where: { email },
                });

                if (!existingUser) {
                    // Créer un nouveau compte SSO
                    existingUser = await prisma.user.create({
                        data: {
                            email,
                            name: user.name || email.split('@')[0],
                            provider,
                            providerId,
                            providerEmail: email,
                            avatar: user.image || null,
                            password: null, // Pas de mot de passe pour SSO
                            plan: 'FREE',
                        },
                    });
                } else {
                    // Compte existant - mettre à jour les infos SSO si nécessaire
                    if (!existingUser.provider || !existingUser.providerId) {
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: {
                                provider,
                                providerId,
                                providerEmail: email,
                                avatar: user.image || existingUser.avatar,
                            },
                        });
                    }
                }

                // Stocker l'ID utilisateur dans le token
                user.id = existingUser.id;
                user.plan = existingUser.plan;
            }

            return true;
        },

        // ============================================
        // JWT CALLBACK
        // ============================================
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.plan = user.plan;
            }

            // Stocker les infos du provider
            if (account) {
                token.provider = account.provider;
            }

            return token;
        },

        // ============================================
        // SESSION CALLBACK
        // ============================================
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.plan = token.plan as 'FREE' | 'PRO' | 'SCALE' | 'ENTERPRISE';
                session.user.provider = token.provider as string;
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

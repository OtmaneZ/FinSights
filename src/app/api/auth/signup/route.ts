/**
 * API Route: Signup (Création compte)
 * POST /api/auth/signup
 */

import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail, isEmailEnabled } from '@/lib/emails/emailService';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email et mot de passe requis' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 8 caractères' },
                { status: 400 }
            );
        }

        // Vérifier si l'email existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Un compte existe déjà avec cet email' },
                { status: 409 }
            );
        }

        // Hash du password (10 rounds bcrypt)
        const hashedPassword = await hash(password, 10);

        // Créer l'utilisateur + company + CompanyMember OWNER (transaction atomique)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                plan: 'FREE', // Plan par défaut
                companies: {
                    create: {
                        name: 'Mon Entreprise', // Company par défaut
                        sector: 'services', // Secteur par défaut
                    },
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                plan: true,
                createdAt: true,
                companies: {
                    select: {
                        id: true,
                        name: true,
                        sector: true,
                    },
                },
            },
        });

        // Créer le CompanyMember OWNER pour la company créée
        if (user.companies.length > 0) {
            await prisma.companyMember.create({
                data: {
                    userId: user.id,
                    companyId: user.companies[0].id,
                    role: 'OWNER',
                },
            });
        }

        // Envoyer email de bienvenue
        if (isEmailEnabled()) {
            await sendWelcomeEmail({
                to: user.email,
                userName: user.name || 'Utilisateur',
                userEmail: user.email,
            }).catch((error) => {
                logger.error('⚠️ Email bienvenue échoué (non-bloquant):', error);
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Compte créé avec succès',
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        logger.error('❌ Erreur signup:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création du compte' },
            { status: 500 }
        );
    }
}

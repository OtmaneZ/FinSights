/**
 * API Route: PATCH /api/invitations/[token]/accept
 * Accepter une invitation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { token } = params;

        // Récupérer l'invitation
        const invitation = await prisma.invitation.findUnique({
            where: { token },
            include: { company: true },
        });

        if (!invitation) {
            return NextResponse.json(
                { error: 'Invitation introuvable' },
                { status: 404 }
            );
        }

        // Vérifier que l'invitation est pour l'email de l'utilisateur connecté
        if (invitation.email !== session.user.email) {
            return NextResponse.json(
                { error: 'Cette invitation n\'est pas pour votre compte' },
                { status: 403 }
            );
        }

        // Vérifier que l'invitation est toujours en attente
        if (invitation.status !== 'PENDING') {
            return NextResponse.json(
                { error: `Cette invitation a déjà été ${invitation.status === 'ACCEPTED' ? 'acceptée' : 'refusée'}` },
                { status: 409 }
            );
        }

        // Vérifier que l'invitation n'a pas expiré
        if (invitation.expiresAt < new Date()) {
            // Mettre à jour le statut à EXPIRED
            await prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: 'EXPIRED' },
            });

            return NextResponse.json(
                { error: 'Cette invitation a expiré' },
                { status: 410 }
            );
        }

        // Vérifier que l'utilisateur n'est pas déjà membre
        const existingMember = await prisma.companyMember.findFirst({
            where: {
                companyId: invitation.companyId,
                userId: session.user.id,
            },
        });

        if (existingMember) {
            // Mettre à jour l'invitation quand même
            await prisma.invitation.update({
                where: { id: invitation.id },
                data: {
                    status: 'ACCEPTED',
                    acceptedAt: new Date(),
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Vous êtes déjà membre de cette entreprise',
                member: existingMember,
            });
        }

        // Créer le membre et accepter l'invitation dans une transaction
        const result = await prisma.$transaction(async (tx) => {
            // Créer le membre
            const member = await tx.companyMember.create({
                data: {
                    companyId: invitation.companyId,
                    userId: session.user.id,
                    role: invitation.role,
                },
                include: {
                    company: true,
                    user: { select: { id: true, name: true, email: true } },
                },
            });

            // Mettre à jour l'invitation
            await tx.invitation.update({
                where: { id: invitation.id },
                data: {
                    status: 'ACCEPTED',
                    acceptedAt: new Date(),
                },
            });

            return member;
        });

        return NextResponse.json({
            success: true,
            message: `Vous avez rejoint ${invitation.company.name}`,
            member: result,
        });
    } catch (error) {
        console.error('Erreur acceptation invitation:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'acceptation de l\'invitation' },
            { status: 500 }
        );
    }
}

/**
 * API Route: DELETE /api/invitations/[token]/decline
 * Refuser une invitation
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { token } = params;

        // Récupérer l'invitation
        const invitation = await prisma.invitation.findUnique({
            where: { token },
        });

        if (!invitation) {
            return NextResponse.json(
                { error: 'Invitation introuvable' },
                { status: 404 }
            );
        }

        // Vérifier que l'invitation est pour l'email de l'utilisateur connecté
        if (invitation.email !== session.user.email) {
            return NextResponse.json(
                { error: 'Cette invitation n\'est pas pour votre compte' },
                { status: 403 }
            );
        }

        // Vérifier que l'invitation est toujours en attente
        if (invitation.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Cette invitation n\'est plus en attente' },
                { status: 409 }
            );
        }

        // Mettre à jour l'invitation
        await prisma.invitation.update({
            where: { id: invitation.id },
            data: {
                status: 'DECLINED',
                declinedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Invitation refusée',
        });
    } catch (error) {
        console.error('Erreur refus invitation:', error);
        return NextResponse.json(
            { error: 'Erreur lors du refus de l\'invitation' },
            { status: 500 }
        );
    }
}

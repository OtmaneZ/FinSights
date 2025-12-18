/**
 * API Route: DELETE/PATCH /api/companies/:companyId/members/:memberId
 * Supprimer ou changer le rôle d'un membre
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { companyId: string; memberId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { companyId, memberId } = params;

        // Vérifier les droits (OWNER ou ADMIN)
        const userMember = await prisma.companyMember.findFirst({
            where: {
                companyId,
                userId: session.user.id,
                role: { in: ['OWNER', 'ADMIN'] },
            },
        });

        if (!userMember) {
            return NextResponse.json(
                { error: 'Droits insuffisants' },
                { status: 403 }
            );
        }

        // Vérifier que ce n'est pas un OWNER
        const memberToDelete = await prisma.companyMember.findUnique({
            where: { id: memberId },
        });

        if (memberToDelete?.role === 'OWNER') {
            return NextResponse.json(
                { error: 'Impossible de supprimer le propriétaire' },
                { status: 403 }
            );
        }

        // Supprimer le membre
        await prisma.companyMember.delete({
            where: { id: memberId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting member:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du membre' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { companyId: string; memberId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { companyId, memberId } = params;
        const { role } = await req.json();

        if (!['VIEWER', 'EDITOR', 'ADMIN'].includes(role)) {
            return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
        }

        // Vérifier les droits
        const userMember = await prisma.companyMember.findFirst({
            where: {
                companyId,
                userId: session.user.id,
                role: { in: ['OWNER', 'ADMIN'] },
            },
        });

        if (!userMember) {
            return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 });
        }

        // Mettre à jour le rôle
        const updated = await prisma.companyMember.update({
            where: { id: memberId },
            data: { role },
        });

        return NextResponse.json({ success: true, member: updated });
    } catch (error) {
        console.error('Error updating member role:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la modification du rôle' },
            { status: 500 }
        );
    }
}

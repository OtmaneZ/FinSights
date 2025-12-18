/**
 * API Route: GET /api/companies/:companyId/members
 * Liste des membres d'une entreprise
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: { companyId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { companyId } = params;

        // Vérifier que l'utilisateur est membre de l'entreprise
        const userMember = await prisma.companyMember.findFirst({
            where: {
                companyId,
                userId: session.user.id,
            },
        });

        if (!userMember) {
            return NextResponse.json(
                { error: 'Vous n\'êtes pas membre de cette entreprise' },
                { status: 403 }
            );
        }

        // Récupérer tous les membres
        const members = await prisma.companyMember.findMany({
            where: { companyId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
            orderBy: [
                { role: 'asc' }, // OWNER first
                { createdAt: 'asc' },
            ],
        });

        return NextResponse.json({ members });
    } catch (error) {
        console.error('Error fetching members:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des membres' },
            { status: 500 }
        );
    }
}

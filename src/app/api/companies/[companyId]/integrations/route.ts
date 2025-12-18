/**
 * API Route: GET /api/companies/:companyId/integrations
 * Liste des intégrations d'une entreprise
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

        const integrations = await prisma.accountingIntegration.findMany({
            where: { companyId },
            select: {
                id: true,
                provider: true,
                active: true,
                lastSyncAt: true,
                autoSync: true,
            },
        });

        return NextResponse.json({ integrations });
    } catch (error) {
        console.error('Error fetching integrations:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des intégrations' },
            { status: 500 }
        );
    }
}

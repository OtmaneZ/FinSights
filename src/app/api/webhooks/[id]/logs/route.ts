/**
 * API Webhook Logs
 *
 * GET /api/webhooks/[id]/logs - Get delivery logs for webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
        }

        const webhookId = params.id;

        // Verify webhook ownership
        const webhook = await prisma.webhook.findUnique({
            where: { id: webhookId },
        });

        if (!webhook) {
            return NextResponse.json({ error: 'Webhook introuvable' }, { status: 404 });
        }

        if (webhook.userId !== user.id) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        // Get logs (last 100)
        const logs = await prisma.webhookLog.findMany({
            where: { webhookId },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });

        return NextResponse.json({
            logs: logs.map((log) => ({
                id: log.id,
                event: log.event,
                success: log.success,
                statusCode: log.statusCode,
                attempts: log.attempts,
                errorReason: log.errorReason,
                createdAt: log.createdAt,
            })),
            total: logs.length,
        });
    } catch (error) {
        logger.error('Error fetching webhook logs:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des logs' },
            { status: 500 }
        );
    }
}

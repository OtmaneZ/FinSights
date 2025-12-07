/**
 * API Webhook Details - Update & Delete
 *
 * Routes:
 * - PUT /api/webhooks/[id] - Update webhook (toggle active, change events)
 * - DELETE /api/webhooks/[id] - Delete webhook
 * - GET /api/webhooks/[id]/logs - Get webhook delivery logs
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// ============================================
// PUT - Update webhook
// ============================================

export async function PUT(
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
        const body = await req.json();
        const { active, events } = body;

        // Find webhook and verify ownership
        const webhook = await prisma.webhook.findUnique({
            where: { id: webhookId },
        });

        if (!webhook) {
            return NextResponse.json({ error: 'Webhook introuvable' }, { status: 404 });
        }

        if (webhook.userId !== user.id) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        // Update webhook
        const updated = await prisma.webhook.update({
            where: { id: webhookId },
            data: {
                ...(typeof active === 'boolean' && { active }),
                ...(events && Array.isArray(events) && { events }),
            },
        });

        return NextResponse.json({
            webhook: {
                id: updated.id,
                url: updated.url,
                events: updated.events,
                active: updated.active,
                updatedAt: updated.updatedAt,
            },
            message: 'Webhook mis à jour',
        });
    } catch (error) {
        logger.error('Error updating webhook:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

// ============================================
// DELETE - Delete webhook
// ============================================

export async function DELETE(
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

        // Find webhook and verify ownership
        const webhook = await prisma.webhook.findUnique({
            where: { id: webhookId },
        });

        if (!webhook) {
            return NextResponse.json({ error: 'Webhook introuvable' }, { status: 404 });
        }

        if (webhook.userId !== user.id) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        // Delete webhook (cascade deletes logs)
        await prisma.webhook.delete({
            where: { id: webhookId },
        });

        return NextResponse.json({
            message: 'Webhook supprimé',
        });
    } catch (error) {
        logger.error('Error deleting webhook:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}

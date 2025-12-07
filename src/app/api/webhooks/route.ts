/**
 * API Webhooks - CRUD Operations
 *
 * Routes:
 * - GET /api/webhooks - List user webhooks
 * - POST /api/webhooks - Create new webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateWebhookSecret, type WebhookEvent } from '@/lib/webhooks';
import { logger } from '@/lib/logger';

const VALID_EVENTS: WebhookEvent[] = [
    'dashboard.created',
    'dashboard.updated',
    'dashboard.deleted',
    'kpi.threshold_reached',
    'company.created',
    'company.updated',
];

// ============================================
// GET - List webhooks
// ============================================

export async function GET(req: NextRequest) {
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

        // Quotas: PRO+
        if (user.plan === 'FREE') {
            return NextResponse.json(
                { error: 'Les webhooks nécessitent un plan PRO ou supérieur' },
                { status: 403 }
            );
        }

        const webhooks = await prisma.webhook.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { logs: true },
                },
            },
        });

        return NextResponse.json({
            webhooks: webhooks.map((w) => ({
                id: w.id,
                url: w.url,
                events: w.events,
                active: w.active,
                lastTriggered: w.lastTriggered,
                totalDeliveries: w._count.logs,
                createdAt: w.createdAt,
            })),
        });
    } catch (error) {
        logger.error('Error fetching webhooks:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des webhooks' },
            { status: 500 }
        );
    }
}

// ============================================
// POST - Create webhook
// ============================================

export async function POST(req: NextRequest) {
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

        // Quotas: PRO+
        if (user.plan === 'FREE') {
            return NextResponse.json(
                { error: 'Les webhooks nécessitent un plan PRO ou supérieur' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { url, events } = body;

        // Validation
        if (!url || typeof url !== 'string' || !url.startsWith('http')) {
            return NextResponse.json(
                { error: 'URL invalide (doit commencer par http:// ou https://)' },
                { status: 400 }
            );
        }

        if (!events || !Array.isArray(events) || events.length === 0) {
            return NextResponse.json(
                { error: 'Au moins un événement doit être sélectionné' },
                { status: 400 }
            );
        }

        // Validate events
        const invalidEvents = events.filter((e) => !VALID_EVENTS.includes(e));
        if (invalidEvents.length > 0) {
            return NextResponse.json(
                { error: `Événements invalides: ${invalidEvents.join(', ')}` },
                { status: 400 }
            );
        }

        // Check webhook limit per plan
        const existingCount = await prisma.webhook.count({
            where: { userId: user.id },
        });

        const limits = {
            PRO: 5,
            SCALE: 20,
            ENTERPRISE: 100,
        };

        const limit = limits[user.plan as keyof typeof limits] || 0;
        if (existingCount >= limit) {
            return NextResponse.json(
                { error: `Limite de ${limit} webhooks atteinte pour votre plan` },
                { status: 403 }
            );
        }

        // Generate secret
        const secret = generateWebhookSecret();

        // Create webhook
        const webhook = await prisma.webhook.create({
            data: {
                url,
                events,
                secret,
                userId: user.id,
            },
        });

        return NextResponse.json(
            {
                webhook: {
                    id: webhook.id,
                    url: webhook.url,
                    events: webhook.events,
                    secret: webhook.secret, // Show only on creation
                    active: webhook.active,
                    createdAt: webhook.createdAt,
                },
                message: 'Webhook créé avec succès',
            },
            { status: 201 }
        );
    } catch (error) {
        logger.error('Error creating webhook:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création du webhook' },
            { status: 500 }
        );
    }
}

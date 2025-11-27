/**
 * Dashboards List API
 * GET /api/dashboards - List user's dashboards with pagination
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const companyId = searchParams.get('companyId');

        // Build where clause
        const where: any = { userId };
        if (companyId) {
            where.companyId = companyId;
        }

        // Get total count
        const total = await prisma.dashboard.count({ where });

        // Get dashboards
        const dashboards = await prisma.dashboard.findMany({
            where,
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        sector: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return NextResponse.json({
            dashboards: dashboards.map((d) => ({
                id: d.id,
                fileName: d.fileName,
                fileUrl: d.fileUrl,
                kpis: d.kpis,
                company: d.company,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('List dashboards error:', error);
        return NextResponse.json(
            { error: 'Failed to list dashboards' },
            { status: 500 }
        );
    }
}

/**
 * Delete dashboard
 * DELETE /api/dashboards?id=xxx
 */
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { searchParams } = new URL(req.url);
        const dashboardId = searchParams.get('id');

        if (!dashboardId) {
            return NextResponse.json({ error: 'Dashboard ID required' }, { status: 400 });
        }

        // Delete (verify ownership via userId)
        await prisma.dashboard.delete({
            where: {
                id: dashboardId,
                userId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete dashboard error:', error);
        return NextResponse.json(
            { error: 'Failed to delete dashboard' },
            { status: 404 }
        );
    }
}

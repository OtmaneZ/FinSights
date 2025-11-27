/**
 * Company Management API
 * GET    /api/companies - List user's companies
 * POST   /api/companies - Create new company
 * DELETE /api/companies?id=xxx - Delete company
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimitKV } from '@/lib/rateLimit';

// GET - List companies
export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        const companies = await prisma.company.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { dashboards: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            companies: companies.map((c) => ({
                id: c.id,
                name: c.name,
                sector: c.sector,
                dashboardsCount: c._count.dashboards,
                createdAt: c.createdAt,
            })),
        });
    } catch (error) {
        console.error('List companies error:', error);
        return NextResponse.json(
            { error: 'Failed to list companies' },
            { status: 500 }
        );
    }
}

// POST - Create company
export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const userPlan = (session.user as any).plan;

        // Check dashboards limit (companies use same quota)
        const rateLimit = await checkRateLimitKV(userId, 'dashboards', userPlan);
        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    error: 'Company limit exceeded for your plan',
                    limit: rateLimit.limit,
                },
                { status: 429 }
            );
        }

        const { name, sector } = await req.json();

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: 'Company name required' }, { status: 400 });
        }

        const company = await prisma.company.create({
            data: {
                userId,
                name: name.trim(),
                sector: sector?.trim() || null,
            },
        });

        return NextResponse.json({
            success: true,
            company: {
                id: company.id,
                name: company.name,
                sector: company.sector,
                createdAt: company.createdAt,
            },
        });
    } catch (error) {
        console.error('Create company error:', error);
        return NextResponse.json(
            { error: 'Failed to create company' },
            { status: 500 }
        );
    }
}

// DELETE - Delete company (cascades to dashboards)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get('id');

        if (!companyId) {
            return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
        }

        await prisma.company.delete({
            where: {
                id: companyId,
                userId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete company error:', error);
        return NextResponse.json(
            { error: 'Failed to delete company' },
            { status: 404 }
        );
    }
}

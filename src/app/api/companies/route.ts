/**
 * Company Management API
 * GET    /api/companies - List user's companies
 * POST   /api/companies - Create new company
 * DELETE /api/companies?id=xxx - Delete company
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimitKV } from '@/lib/rateLimit';

// GET - List companies
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
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
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const userPlan = (session.user as any).plan || 'FREE';

        // ✅ Company quotas by plan
        const companyQuotas: Record<string, number> = {
            FREE: 1,
            PRO: 5,
            SCALE: 999, // Virtually unlimited
            ENTERPRISE: 999
        };

        const maxCompanies = companyQuotas[userPlan] || 1;

        // Check current company count
        const currentCount = await prisma.company.count({
            where: { userId }
        });

        if (currentCount >= maxCompanies) {
            return NextResponse.json(
                {
                    error: 'Company limit reached',
                    message: `Plan ${userPlan}: maximum ${maxCompanies} company(ies). Upgrade to PRO to manage up to 5 companies.`,
                    currentCount,
                    maxCompanies
                },
                { status: 403 }
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

        console.log(`✅ Company created: ${company.name} by user ${userId} (${userPlan})`);

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

// PUT - Update company
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { id, name, sector } = await req.json();

        if (!id || !name || name.trim().length === 0) {
            return NextResponse.json({ error: 'Company ID and name required' }, { status: 400 });
        }

        // Verify ownership before update
        const existingCompany = await prisma.company.findUnique({
            where: { id }
        });

        if (!existingCompany || existingCompany.userId !== userId) {
            return NextResponse.json({ error: 'Company not found or access denied' }, { status: 404 });
        }

        const company = await prisma.company.update({
            where: { id, userId },
            data: {
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
            },
        });
    } catch (error) {
        console.error('Update company error:', error);
        return NextResponse.json(
            { error: 'Failed to update company' },
            { status: 500 }
        );
    }
}

// DELETE - Delete company (cascades to dashboards)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get('id');

        if (!companyId) {
            return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
        }

        // Check if user has at least 2 companies before deleting
        const userCompanies = await prisma.company.count({
            where: { userId }
        });

        if (userCompanies <= 1) {
            return NextResponse.json(
                { error: 'Cannot delete last company. You must have at least one company.' },
                { status: 403 }
            );
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

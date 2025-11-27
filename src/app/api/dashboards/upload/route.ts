/**
 * Dashboard Upload & Save API
 * POST /api/dashboards/upload - Upload CSV/Excel + Save to Blob + DB
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { checkRateLimitKV } from '@/lib/rateLimit';

// Next.js 14 App Router handles FormData/multipart natively, no config needed

export async function POST(req: Request) {
    try {
        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const userPlan = (session.user as any).plan;

        // Rate limit check
        const rateLimit = await checkRateLimitKV(userId, 'uploads', userPlan);
        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    error: 'Upload limit exceeded',
                    limit: rateLimit.limit,
                    resetAt: rateLimit.resetAt,
                },
                { status: 429 }
            );
        }

        // Parse FormData
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const companyId = formData.get('companyId') as string;
        const rawDataString = formData.get('rawData') as string;
        const kpisString = formData.get('kpis') as string;

        if (!file) {
            return NextResponse.json({ error: 'File is required' }, { status: 400 });
        }

        if (!companyId) {
            return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
        }

        // Verify company belongs to user
        const company = await prisma.company.findFirst({
            where: {
                id: companyId,
                userId,
            },
        });

        if (!company) {
            return NextResponse.json(
                { error: 'Company not found or unauthorized' },
                { status: 404 }
            );
        }

        // Upload file to Vercel Blob
        const blob = await put(`users/${userId}/${Date.now()}_${file.name}`, file, {
            access: 'public',
        });

        // Parse JSON data
        const rawData = rawDataString ? JSON.parse(rawDataString) : {};
        const kpis = kpisString ? JSON.parse(kpisString) : {};

        // Save dashboard to database
        const dashboard = await prisma.dashboard.create({
            data: {
                companyId,
                userId,
                fileName: file.name,
                fileUrl: blob.url,
                rawData,
                kpis,
            },
        });

        return NextResponse.json({
            success: true,
            dashboard: {
                id: dashboard.id,
                fileName: dashboard.fileName,
                fileUrl: dashboard.fileUrl,
                createdAt: dashboard.createdAt,
            },
            quota: {
                current: rateLimit.current,
                limit: rateLimit.limit,
                remaining: rateLimit.remaining,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload dashboard' },
            { status: 500 }
        );
    }
}

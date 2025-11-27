/**
 * API Keys Management Endpoints
 * GET    /api/keys - List user's API keys
 * POST   /api/keys - Create new API key
 * DELETE /api/keys/:id - Delete API key
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createApiKey, listApiKeys, deleteApiKey } from '@/lib/apiKeys';

// GET /api/keys - List API keys
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user has PRO or SCALE plan
        const userPlan = (session.user as any).plan;
        if (userPlan === 'FREE') {
            return NextResponse.json(
                { error: 'API keys require PRO or SCALE plan' },
                { status: 403 }
            );
        }

        const apiKeys = await listApiKeys((session.user as any).id);

        return NextResponse.json({ apiKeys });
    } catch (error) {
        console.error('List API keys error:', error);
        return NextResponse.json(
            { error: 'Failed to list API keys' },
            { status: 500 }
        );
    }
}

// POST /api/keys - Create new API key
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user has PRO or SCALE plan
        const userPlan = (session.user as any).plan;
        if (userPlan === 'FREE') {
            return NextResponse.json(
                { error: 'API keys require PRO or SCALE plan' },
                { status: 403 }
            );
        }

        const { name } = await req.json();

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { error: 'API key name is required' },
                { status: 400 }
            );
        }

        if (name.length > 50) {
            return NextResponse.json(
                { error: 'API key name must be less than 50 characters' },
                { status: 400 }
            );
        }

        const apiKey = await createApiKey((session.user as any).id, name.trim());

        return NextResponse.json({
            message: 'API key created successfully',
            apiKey: {
                id: apiKey.id,
                key: apiKey.key, // Only shown once!
                name: apiKey.name,
                createdAt: apiKey.createdAt,
            },
        });
    } catch (error) {
        console.error('Create API key error:', error);
        return NextResponse.json(
            { error: 'Failed to create API key' },
            { status: 500 }
        );
    }
}

// DELETE /api/keys - Delete API key
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const keyId = searchParams.get('id');

        if (!keyId) {
            return NextResponse.json(
                { error: 'API key ID is required' },
                { status: 400 }
            );
        }

        const success = await deleteApiKey((session.user as any).id, keyId);

        if (!success) {
            return NextResponse.json(
                { error: 'API key not found or already deleted' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'API key deleted successfully',
        });
    } catch (error) {
        console.error('Delete API key error:', error);
        return NextResponse.json(
            { error: 'Failed to delete API key' },
            { status: 500 }
        );
    }
}

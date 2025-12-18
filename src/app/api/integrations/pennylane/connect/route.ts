/**
 * API Route: POST /api/integrations/pennylane/connect
 * Démarrer le flow OAuth Pennylane
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PENNYLANE_OAUTH_URL = 'https://app.pennylane.com/oauth/authorize';
const PENNYLANE_CLIENT_ID = process.env.PENNYLANE_CLIENT_ID;
const PENNYLANE_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/pennylane/callback`;

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { companyId } = await req.json();

        if (!companyId) {
            return NextResponse.json({ error: 'companyId requis' }, { status: 400 });
        }

        if (!PENNYLANE_CLIENT_ID) {
            return NextResponse.json(
                { error: 'Pennylane non configuré (PENNYLANE_CLIENT_ID manquant)' },
                { status: 500 }
            );
        }

        // Générer un state pour la sécurité OAuth
        const state = Buffer.from(
            JSON.stringify({
                userId: session.user.id,
                companyId,
                timestamp: Date.now(),
            })
        ).toString('base64');

        // Construire l'URL d'autorisation Pennylane
        const authUrl = new URL(PENNYLANE_OAUTH_URL);
        authUrl.searchParams.append('client_id', PENNYLANE_CLIENT_ID);
        authUrl.searchParams.append('redirect_uri', PENNYLANE_REDIRECT_URI);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('state', state);
        authUrl.searchParams.append('scope', 'accounting:read invoices:read customers:read');

        return NextResponse.json({
            authUrl: authUrl.toString(),
        });
    } catch (error) {
        console.error('Erreur OAuth Pennylane:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la connexion à Pennylane' },
            { status: 500 }
        );
    }
}

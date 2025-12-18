/**
 * API Route: POST /api/integrations/quickbooks/connect
 * Démarrer le flow OAuth QuickBooks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const QUICKBOOKS_OAUTH_URL = 'https://appcenter.intuit.com/connect/oauth2';
const QUICKBOOKS_CLIENT_ID = process.env.QUICKBOOKS_CLIENT_ID;
const QUICKBOOKS_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/quickbooks/callback`;

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

        if (!QUICKBOOKS_CLIENT_ID) {
            return NextResponse.json(
                { error: 'QuickBooks non configuré (QUICKBOOKS_CLIENT_ID manquant)' },
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

        // Construire l'URL d'autorisation QuickBooks
        const authUrl = new URL(QUICKBOOKS_OAUTH_URL);
        authUrl.searchParams.append('client_id', QUICKBOOKS_CLIENT_ID);
        authUrl.searchParams.append('redirect_uri', QUICKBOOKS_REDIRECT_URI);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('state', state);
        authUrl.searchParams.append('scope', 'com.intuit.quickbooks.accounting');

        return NextResponse.json({
            authUrl: authUrl.toString(),
        });
    } catch (error) {
        console.error('Erreur OAuth QuickBooks:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la connexion à QuickBooks' },
            { status: 500 }
        );
    }
}

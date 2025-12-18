/**
 * API Route: GET /api/integrations/quickbooks/callback
 * Callback OAuth QuickBooks
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const QUICKBOOKS_TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
const QUICKBOOKS_CLIENT_ID = process.env.QUICKBOOKS_CLIENT_ID;
const QUICKBOOKS_CLIENT_SECRET = process.env.QUICKBOOKS_CLIENT_SECRET;
const QUICKBOOKS_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/quickbooks/callback`;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const realmId = searchParams.get('realmId'); // QuickBooks Company ID
        const error = searchParams.get('error');

        // Gestion des erreurs OAuth
        if (error) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?error=${error}`
            );
        }

        if (!code || !state || !realmId) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?error=missing_params`
            );
        }

        // Décoder le state
        let stateData: { userId: string; companyId: string; timestamp: number };
        try {
            stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        } catch {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?error=invalid_state`
            );
        }

        // Vérifier que le state n'est pas trop ancien (< 10 minutes)
        if (Date.now() - stateData.timestamp > 10 * 60 * 1000) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?error=expired_state`
            );
        }

        // Créer les credentials en base64 pour Basic Auth
        const credentials = Buffer.from(
            `${QUICKBOOKS_CLIENT_ID}:${QUICKBOOKS_CLIENT_SECRET}`
        ).toString('base64');

        // Échanger le code contre un access token
        const tokenResponse = await fetch(QUICKBOOKS_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${credentials}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: QUICKBOOKS_REDIRECT_URI,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error('Erreur échange token QuickBooks:', errorData);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?error=token_exchange_failed`
            );
        }

        const tokenData = await tokenResponse.json();

        // Calculer la date d'expiration
        const expiresAt = tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : null;

        // Créer ou mettre à jour l'intégration
        await prisma.accountingIntegration.upsert({
            where: {
                companyId_provider: {
                    companyId: stateData.companyId,
                    provider: 'quickbooks',
                },
            },
            create: {
                provider: 'quickbooks',
                companyId: stateData.companyId,
                userId: stateData.userId,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token || null,
                expiresAt,
                providerAccountId: realmId, // QuickBooks Company ID
                active: true,
                autoSync: false,
                metadata: {
                    realmId,
                    tokenType: tokenData.token_type,
                },
            },
            update: {
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token || null,
                expiresAt,
                providerAccountId: realmId,
                active: true,
                metadata: {
                    realmId,
                    tokenType: tokenData.token_type,
                },
            },
        });

        // Rediriger vers la page de succès
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?success=quickbooks_connected`
        );
    } catch (error) {
        console.error('Erreur callback QuickBooks:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?error=callback_failed`
        );
    }
}

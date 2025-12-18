/**
 * API Route: GET /api/integrations/pennylane/callback
 * Callback OAuth Pennylane
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PENNYLANE_TOKEN_URL = 'https://app.pennylane.com/oauth/token';
const PENNYLANE_CLIENT_ID = process.env.PENNYLANE_CLIENT_ID;
const PENNYLANE_CLIENT_SECRET = process.env.PENNYLANE_CLIENT_SECRET;
const PENNYLANE_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/pennylane/callback`;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Gestion des erreurs OAuth
        if (error) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?error=${error}`
            );
        }

        if (!code || !state) {
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

        // Échanger le code contre un access token
        const tokenResponse = await fetch(PENNYLANE_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: PENNYLANE_CLIENT_ID!,
                client_secret: PENNYLANE_CLIENT_SECRET!,
                code,
                redirect_uri: PENNYLANE_REDIRECT_URI,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error('Erreur échange token Pennylane:', errorData);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?error=token_exchange_failed`
            );
        }

        const tokenData = await tokenResponse.json();

        // Récupérer les infos du compte Pennylane
        const accountResponse = await fetch('https://app.pennylane.com/api/v1/companies', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        let providerAccountId = null;
        if (accountResponse.ok) {
            const accountData = await accountResponse.json();
            providerAccountId = accountData.companies?.[0]?.id || null;
        }

        // Calculer la date d'expiration
        const expiresAt = tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : null;

        // Créer ou mettre à jour l'intégration
        await prisma.accountingIntegration.upsert({
            where: {
                companyId_provider: {
                    companyId: stateData.companyId,
                    provider: 'pennylane',
                },
            },
            create: {
                provider: 'pennylane',
                companyId: stateData.companyId,
                userId: stateData.userId,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token || null,
                expiresAt,
                providerAccountId,
                active: true,
                autoSync: false,
                metadata: {
                    scope: tokenData.scope,
                    tokenType: tokenData.token_type,
                },
            },
            update: {
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token || null,
                expiresAt,
                providerAccountId,
                active: true,
                metadata: {
                    scope: tokenData.scope,
                    tokenType: tokenData.token_type,
                },
            },
        });

        // Rediriger vers la page de succès
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?success=pennylane_connected`
        );
    } catch (error) {
        console.error('Erreur callback Pennylane:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/integrations?error=callback_failed`
        );
    }
}

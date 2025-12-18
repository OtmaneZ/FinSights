/**
 * API Route: POST /api/integrations/quickbooks/sync
 * Synchronise les factures depuis QuickBooks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { companyId } = await req.json();

        const integration = await prisma.accountingIntegration.findFirst({
            where: {
                companyId,
                provider: 'QUICKBOOKS',
                active: true,
            },
        });

        if (!integration) {
            return NextResponse.json({ error: 'QuickBooks non connecté' }, { status: 400 });
        }

        if (integration.expiresAt && new Date(integration.expiresAt) < new Date()) {
            return NextResponse.json({ error: 'Token expiré, reconnectez-vous' }, { status: 401 });
        }

        // Fetch invoices from QuickBooks API
        const invoicesRes = await fetch(
            `https://quickbooks.api.intuit.com/v3/company/${integration.providerAccountId}/query?query=select * from Invoice`,
            {
                headers: {
                    Authorization: `Bearer ${integration.accessToken}`,
                    Accept: 'application/json',
                },
            }
        );

        if (!invoicesRes.ok) {
            throw new Error('Erreur QuickBooks API');
        }

        const invoicesData = await invoicesRes.json();
        const invoices = invoicesData.QueryResponse?.Invoice || [];

        // Transform to FinSights transaction format
        const transactions = invoices.map((inv: any) => ({
            date: inv.TxnDate,
            description: `Facture ${inv.DocNumber}`,
            amount: inv.TotalAmt,
            type: 'income',
            category: 'Ventes',
            client: inv.CustomerRef?.name || 'Client inconnu',
            source: 'quickbooks',
        }));

        // Update lastSyncAt
        await prisma.accountingIntegration.update({
            where: { id: integration.id },
            data: { lastSyncAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            count: transactions.length,
            transactions,
        });
    } catch (error) {
        console.error('Error syncing QuickBooks:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la synchronisation' },
            { status: 500 }
        );
    }
}

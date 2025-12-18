/**
 * API Route: POST /api/integrations/pennylane/sync
 * Synchroniser les données Pennylane
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

        if (!companyId) {
            return NextResponse.json({ error: 'companyId requis' }, { status: 400 });
        }

        // Récupérer l'intégration
        const integration = await prisma.accountingIntegration.findUnique({
            where: {
                companyId_provider: {
                    companyId,
                    provider: 'pennylane',
                },
            },
        });

        if (!integration) {
            return NextResponse.json(
                { error: 'Intégration Pennylane non trouvée' },
                { status: 404 }
            );
        }

        if (!integration.active) {
            return NextResponse.json(
                { error: 'Intégration Pennylane désactivée' },
                { status: 403 }
            );
        }

        // Vérifier si le token a expiré
        if (integration.expiresAt && integration.expiresAt < new Date()) {
            // TODO: Implémenter le refresh token
            return NextResponse.json(
                { error: 'Token expiré. Veuillez reconnecter Pennylane.' },
                { status: 401 }
            );
        }

        // Récupérer les factures depuis Pennylane
        const invoicesResponse = await fetch(
            'https://app.pennylane.com/api/v1/customer_invoices',
            {
                headers: {
                    Authorization: `Bearer ${integration.accessToken}`,
                },
            }
        );

        if (!invoicesResponse.ok) {
            const errorData = await invoicesResponse.text();
            console.error('Erreur API Pennylane:', errorData);
            return NextResponse.json(
                { error: 'Erreur lors de la récupération des factures Pennylane' },
                { status: 500 }
            );
        }

        const invoicesData = await invoicesResponse.json();

        // Transformer les factures Pennylane en format FinSights
        const transactions = invoicesData.invoices?.map((invoice: any) => ({
            date: invoice.date,
            label: invoice.label || `Facture ${invoice.invoice_number}`,
            amount: parseFloat(invoice.amount),
            client: invoice.customer?.name || 'Client inconnu',
            dueDate: invoice.due_date,
            status: invoice.status === 'paid' ? 'Payé' : 'En attente',
            category: 'Ventes',
            credit: parseFloat(invoice.amount),
            debit: 0,
        })) || [];

        // Mettre à jour la date de dernière sync
        await prisma.accountingIntegration.update({
            where: { id: integration.id },
            data: { lastSyncAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            transactions,
            syncedAt: new Date().toISOString(),
            count: transactions.length,
        });
    } catch (error) {
        console.error('Erreur sync Pennylane:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la synchronisation Pennylane' },
            { status: 500 }
        );
    }
}

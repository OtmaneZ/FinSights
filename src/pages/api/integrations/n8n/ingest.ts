/**
 * API n8n Integration - Ingest Transactions
 *
 * Endpoint pour recevoir des transactions depuis n8n workflows
 * Use case : CRM → Pennylane → n8n → FinSights
 *
 * POST /api/integrations/n8n/ingest
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

interface N8nTransaction {
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string;
    paymentStatus?: string;
    source?: string;
}

interface IngestRequest {
    transactions: N8nTransaction[];
    companyId: string;
    source?: string;
}

/**
 * Vérifier la signature HMAC du webhook
 */
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 🔐 Authentication via API Key (Bearer token)
        const authHeader = req.headers['authorization'] as string;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn('[n8n] ❌ Missing or invalid Authorization header');
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'API Key required. Use: Authorization: Bearer YOUR_API_KEY'
            });
        }

        const apiKey = authHeader.replace('Bearer ', '');

        // Vérifier l'API Key et récupérer le user
        const { verifyApiKey } = await import('@/lib/apiKeys');
        const keyInfo = await verifyApiKey(apiKey);

        if (!keyInfo) {
            logger.warn('[n8n] ❌ Invalid API Key');
            return res.status(401).json({ error: 'Invalid API Key' });
        }

        const userId = keyInfo.user.id;
        logger.debug(`[n8n] ✅ User authentifié: ${keyInfo.user.email}`);

        const { transactions, companyId, source = 'n8n' } = req.body as IngestRequest;

        // Validation
        if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).json({ error: 'No transactions provided' });
        }

        if (!companyId) {
            return res.status(400).json({ error: 'companyId is required' });
        }

        logger.info(`[n8n] 📥 Ingestion de ${transactions.length} transactions pour company ${companyId || 'default'}`);

        // Récupérer ou créer la company du user authentifié
        let company;

        if (companyId) {
            // Vérifier que la company existe ET appartient au user
            company = await prisma.company.findFirst({
                where: {
                    id: companyId,
                    userId: userId
                }
            });

            if (!company) {
                return res.status(404).json({
                    error: 'Company not found or unauthorized',
                    message: `No company with ID ${companyId} found for your account`
                });
            }
        } else {
            // Si pas de companyId fourni, utiliser la première company du user
            company = await prisma.company.findFirst({
                where: { userId },
                orderBy: { createdAt: 'asc' }
            });

            if (!company) {
                // Créer une company par défaut si le user n'en a pas
                company = await prisma.company.create({
                    data: {
                        name: 'Entreprise Principal',
                        sector: 'services',
                        userId: userId
                    }
                });
                logger.info(`[n8n] ✅ Company par défaut créée pour user ${userId}`);
            }
        }

        // 📊 Récupérer ou créer un dashboard pour cette company
        let dashboard = await prisma.dashboard.findFirst({
            where: {
                companyId: companyId,
                fileName: { contains: 'n8n_integration' }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Préparer les nouvelles transactions
        const newTransactions = transactions.map((t) => ({
            date: new Date(t.date).toISOString(),
            description: t.description,
            amount: t.amount,
            type: t.type,
            category: t.category || (t.type === 'income' ? 'Ventes' : 'Autres charges'),
            paymentStatus: t.paymentStatus || 'Payé',
            source: `${source}_integration`
        }));

        if (dashboard) {
            // Mettre à jour le dashboard existant
            const existingData = dashboard.rawData as any[];
            const updatedData = [...existingData, ...newTransactions];

            dashboard = await prisma.dashboard.update({
                where: { id: dashboard.id },
                data: {
                    rawData: updatedData,
                    updatedAt: new Date()
                }
            });

            logger.info(`[n8n] ✅ Dashboard mis à jour : ${newTransactions.length} transactions ajoutées`);
        } else {
            // Créer un nouveau dashboard
            dashboard = await prisma.dashboard.create({
                data: {
                    fileName: `n8n_integration_${Date.now()}.json`,
                    fileUrl: 'n8n://integration',
                    rawData: newTransactions,
                    kpis: {},
                    companyId: companyId,
                    userId: company.userId
                }
            });

            logger.info(`[n8n] ✅ Nouveau dashboard créé avec ${newTransactions.length} transactions`);
        }

        // 🔔 Trigger webhook "dashboard.updated" si configuré
        const webhooks = await prisma.webhook.findMany({
            where: {
                userId: company.userId,
                active: true,
                events: {
                    has: 'dashboard.updated'
                }
            }
        });

        if (webhooks.length > 0) {
            logger.debug(`[n8n] 🔔 Notification de ${webhooks.length} webhooks`);
            // TODO: Implémenter notification asynchrone
        }

        return res.status(200).json({
            success: true,
            inserted: newTransactions.length,
            dashboardId: dashboard.id,
            companyId,
            source
        });

    } catch (error: any) {
        logger.error('[n8n] ❌ Erreur ingestion:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

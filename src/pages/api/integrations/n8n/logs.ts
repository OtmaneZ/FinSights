import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
        const { page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }

        // Get dashboards created via n8n (check rawData.source or method)
        const dashboards = await prisma.dashboard.findMany({
            where: {
                userId: user.id,
                // Filter for n8n syncs (dashboards with rawData containing source: 'n8n')
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limitNum,
            select: {
                id: true,
                fileName: true,
                createdAt: true,
                rawData: true,
                company: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // Count total for pagination
        const total = await prisma.dashboard.count({
            where: {
                userId: user.id,
            }
        });

        // Transform to sync log format
        const logs = dashboards.map(dashboard => {
            const rawData = dashboard.rawData as any;
            const transactionCount = Array.isArray(rawData?.transactions)
                ? rawData.transactions.length
                : 0;

            return {
                id: dashboard.id,
                source: 'n8n',
                companyName: dashboard.company?.name || 'Entreprise',
                transactionCount,
                fileName: dashboard.fileName,
                status: 'success',
                createdAt: dashboard.createdAt,
            };
        });

        return res.status(200).json({
            success: true,
            logs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
}

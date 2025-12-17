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
        const { limit = '5' } = req.query;
        const limitNum = parseInt(limit as string);

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }

        // Fetch recent dashboards
        const dashboards = await prisma.dashboard.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limitNum,
            select: {
                id: true,
                fileName: true,
                createdAt: true,
                company: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return res.status(200).json({
            success: true,
            dashboards
        });
    } catch (error) {
        console.error('[Recent Dashboards API] Error:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des dashboards' });
    }
}

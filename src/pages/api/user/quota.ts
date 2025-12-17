import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Plan limits (matching pricing page)
const PLAN_LIMITS = {
    FREE: 10,
    PRO: Infinity, // Unlimited
    SCALE: Infinity,
    ENTERPRISE: Infinity
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
        // Get user with plan
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                plan: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }

        const userPlan = user.plan || 'FREE';
        const limit = PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.FREE;

        // Get upload count this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const uploadCount = await prisma.dashboard.count({
            where: {
                userId: user.id,
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                }
            }
        });

        const remaining = limit === Infinity ? Infinity : Math.max(0, limit - uploadCount);
        const percentage = limit === Infinity ? 0 : (uploadCount / limit) * 100;

        return res.status(200).json({
            success: true,
            quota: {
                used: uploadCount,
                limit: limit === Infinity ? '∞' : limit,
                remaining: remaining === Infinity ? '∞' : remaining,
                percentage: Math.round(percentage),
                plan: userPlan,
                resetDate: endOfMonth.toISOString(),
            }
        });
    } catch (error) {
        console.error('[Quota API] Error fetching quota:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération du quota' });
    }
}

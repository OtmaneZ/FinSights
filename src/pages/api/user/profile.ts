import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
        const { name } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: 'Le nom est requis' });
        }

        if (name.length > 100) {
            return res.status(400).json({ error: 'Le nom est trop long (max 100 caractères)' });
        }

        // Update user name
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { name: name.trim() },
            select: {
                id: true,
                name: true,
                email: true,
                plan: true,
            }
        });

        return res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
}

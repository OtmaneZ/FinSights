import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
        }

        // Get user with password
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                email: true,
                password: true,
            }
        });

        if (!user || !user.password) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return res.status(200).json({
            success: true,
            message: 'Mot de passe modifié avec succès'
        });
    } catch (error) {
        console.error('[Password API] Error updating password:', error);
        return res.status(500).json({ error: 'Erreur lors de la modification du mot de passe' });
    }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface NotificationSettings {
    emailAlerts: boolean;
    cashFlowThreshold: boolean;
    cashFlowAmount: number;
    anomalyDetection: boolean;
    syncErrors: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    // GET: Fetch notification settings
    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: {
                    id: true,
                    notificationSettings: true,
                }
            });

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur introuvable' });
            }

            // Default settings if none exist
            const defaultSettings: NotificationSettings = {
                emailAlerts: true,
                cashFlowThreshold: true,
                cashFlowAmount: 10000,
                anomalyDetection: true,
                syncErrors: true,
                weeklyReport: false,
                monthlyReport: true,
            };

            const settings = user.notificationSettings
                ? (typeof user.notificationSettings === 'string'
                    ? JSON.parse(user.notificationSettings)
                    : user.notificationSettings)
                : defaultSettings;

            return res.status(200).json({
                success: true,
                settings
            });
        } catch (error) {
            console.error('[Notifications API] Error fetching settings:', error);
            return res.status(500).json({ error: 'Erreur lors de la récupération des préférences' });
        }
    }

    // PUT: Update notification settings
    if (req.method === 'PUT') {
        try {
            const settings: NotificationSettings = req.body;

            // Validation
            if (typeof settings.emailAlerts !== 'boolean') {
                return res.status(400).json({ error: 'Données invalides' });
            }

            if (settings.cashFlowAmount && (settings.cashFlowAmount < 0 || settings.cashFlowAmount > 10000000)) {
                return res.status(400).json({ error: 'Montant de seuil invalide' });
            }

            // Update settings in database
            const updatedUser = await prisma.user.update({
                where: { email: session.user.email },
                data: {
                    notificationSettings: settings as any, // Prisma Json type
                },
                select: {
                    id: true,
                    notificationSettings: true,
                }
            });

            return res.status(200).json({
                success: true,
                settings: updatedUser.notificationSettings
            });
        } catch (error) {
            console.error('[Notifications API] Error updating settings:', error);
            return res.status(500).json({ error: 'Erreur lors de la sauvegarde des préférences' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * API Route: Send Email Alerts
 * Endpoint: POST /api/alerts/send
 *
 * Envoie des emails d'alerte via Resend
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { AlertEmailData, getEmailTemplate, getEmailSubject } from '@/lib/emails/templates';
import { logger } from '@/lib/logger';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendAlertRequest {
    to: string | string[];
    alertData: AlertEmailData;
    replyTo?: string;
    from?: string;
}

export interface SendAlertResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SendAlertResponse>
) {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Use POST.',
        });
    }

    // Vérifier la clé API Resend
    if (!process.env.RESEND_API_KEY) {
        logger.error('❌ RESEND_API_KEY manquante dans les variables d\'environnement');
        return res.status(500).json({
            success: false,
            error: 'Email service not configured',
        });
    }

    try {
        const { to, alertData, replyTo, from } = req.body as SendAlertRequest;

        // Validation des données
        if (!to || !alertData) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, alertData',
            });
        }

        if (!alertData.companyName || !alertData.alertType) {
            return res.status(400).json({
                success: false,
                error: 'alertData must include companyName and alertType',
            });
        }

        // Générer le sujet et le template HTML
        const subject = getEmailSubject(alertData);
        const html = getEmailTemplate(alertData);

        logger.debug(`📧 Envoi email alerte: ${alertData.alertType} pour ${alertData.companyName}`);
        logger.debug(`📨 Destinataire(s): ${Array.isArray(to) ? to.join(', ') : to}`);

        // Envoyer l'email via Resend
        const { data, error } = await resend.emails.send({
            from: from || 'FinSight Alerts <alerts@resend.dev>',
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
            replyTo: replyTo || 'support@finsight.com',
            tags: [
                { name: 'alert_type', value: alertData.alertType },
                { name: 'severity', value: alertData.severity },
                { name: 'company', value: alertData.companyName },
            ],
        });

        if (error) {
            logger.error('❌ Erreur Resend:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to send email',
            });
        }

        logger.debug(`✅ Email envoyé avec succès! ID: ${data?.id}`);

        return res.status(200).json({
            success: true,
            messageId: data?.id,
        });

    } catch (error: any) {
        logger.error('❌ Erreur lors de l\'envoi d\'email:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal server error',
        });
    }
}

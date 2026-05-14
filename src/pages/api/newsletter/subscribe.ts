/**
 * API Route: Newsletter Subscription
 * Endpoint: POST /api/newsletter/subscribe
 *
 * Ajoute un email à la liste de newsletter via Resend
 */

import { NextApiRequest, NextApiResponse } from 'next';
import {
    sendUserEmailWithAdminNotify,
    isResendConfigured,
    FROM_EMAIL,
    REPLY_TO_EMAIL,
    resend,
} from '@/lib/emails/resend';
import { sanitizeResendTagEntries } from '@/lib/emails/sanitizeResendTag';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const SITE_URL = 'https://finsight.zineinsight.com';
const NEWSLETTER_AUDIENCE_ID = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;

export interface SubscribeRequest {
    email: string;
    source?: string; // 'popup', 'footer', etc.
}

export interface SubscribeResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SubscribeResponse>
) {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Use POST.',
        });
    }

    if (!isResendConfigured()) {
        logger.error('❌ RESEND_API_KEY manquante ou invalide - newsletter désactivée');
        return res.status(500).json({
            success: false,
            error: 'Newsletter service not configured',
        });
    }

    try {
        const { email, source = 'popup' } = req.body as SubscribeRequest;

        // Validation de l'email
        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: 'Adresse email invalide',
            });
        }

        logger.debug(`📧 Inscription newsletter: ${email} (source: ${source})`);

        const emailTrim = email.trim().toLowerCase();
        const adminLine = `Newsletter - Nouvel abonné : ${emailTrim}`;
        const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(emailTrim)}`;

        if (NEWSLETTER_AUDIENCE_ID) {
            try {
                await resend.contacts.create({
                    email: emailTrim,
                    audienceId: NEWSLETTER_AUDIENCE_ID,
                    unsubscribed: false,
                });
            } catch (audienceError: any) {
                const raw = String(audienceError?.message || '').toLowerCase();
                const alreadyExists = raw.includes('already') || raw.includes('exists') || raw.includes('duplicate');
                if (!alreadyExists) {
                    logger.error('❌ Erreur ajout audience Resend:', audienceError);
                }
            }
        } else {
            logger.warn('⚠️ RESEND_NEWSLETTER_AUDIENCE_ID non configuré - ajout audience ignoré');
        }

        // Stocker/mettre à jour en base pour permettre le désabonnement et la séquence hebdo
        await prisma.lead.upsert({
            where: { email: emailTrim },
            update: {
                source: 'newsletter',
                unsubscribed: false,
            },
            create: {
                email: emailTrim,
                firstName: 'Abonne',
                source: 'newsletter',
                templateName: 'Newsletter FinSight',
                lastEmailSent: 'newsletter_welcome',
                nextEmailScheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                unsubscribed: false,
            },
        });

        const { data, error } = await sendUserEmailWithAdminNotify(
            {
                from: FROM_EMAIL,
                replyTo: REPLY_TO_EMAIL,
                to: [emailTrim],
                subject: '🎉 Bienvenue dans la newsletter FinSight !',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #1B3A5C; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">Bienvenue sur FinSight !</h1>
                    </div>

                    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 16px; margin-bottom: 20px;">Bonjour,</p>

                        <p style="font-size: 16px; margin-bottom: 20px;">
                            Merci de vous être inscrit(e) à la newsletter FinSight ! 🎉
                        </p>

                        <p style="font-size: 16px; margin-bottom: 20px;">
                            Chaque semaine, vous recevrez :
                        </p>

                        <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
                            <li>📊 Un article par semaine sur le pilotage financier PME</li>
                            <li>💡 Des conseils pratiques de gestion de trésorerie</li>
                            <li>🎯 Des cas concrets et retours terrain</li>
                            <li>🚀 Les nouveautés FinSight et outils utiles</li>
                        </ul>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://finsight.zineinsight.com/blog" style="display: inline-block; background: #1B3A5C; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                Découvrir le blog
                            </a>
                        </div>

                        <p style="font-size: 16px; margin-bottom: 20px;">
                            En attendant, n'hésitez pas à explorer nos <a href="https://finsight.zineinsight.com/ressources/guides" style="color: #1B3A5C; text-decoration: none;">guides pratiques</a> et notre <a href="https://finsight.zineinsight.com/diagnostic/guide" style="color: #1B3A5C; text-decoration: none;">Diagnostic Express gratuit</a>.
                        </p>

                        <p style="font-size: 16px; margin-top: 30px;">
                            À très bientôt,<br>
                            <strong>Otmane BOULAHIA</strong><br>
                            <span style="color: #666; font-size: 14px;">Expert Finance & Conseil PME</span>
                        </p>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                        <p style="font-size: 12px; color: #666; text-align: center;">
                            Vous recevez cet email car vous vous êtes inscrit(e) sur finsight.zineinsight.com.<br>
                            <a href="${unsubscribeUrl}" style="color: #1B3A5C; text-decoration: none;">Se désinscrire</a>
                        </p>
                    </div>
                </body>
                </html>
            `,
                tags: sanitizeResendTagEntries([
                    { name: 'type', value: 'newsletter_welcome' },
                    { name: 'source', value: source ?? '' },
                ]),
            },
            adminLine,
            adminLine,
        );

        if (error) {
            logger.error('❌ Erreur Resend:', error);
            return res.status(500).json({
                success: false,
                error: 'Erreur lors de l\'inscription. Veuillez réessayer.',
            });
        }

        logger.debug(`✅ Email de bienvenue envoyé! ID: ${data?.id}`);

        return res.status(200).json({
            success: true,
            message: 'Inscription réussie ! Vérifiez votre boîte email.',
        });

    } catch (error) {
        logger.error('❌ Erreur lors de l\'inscription newsletter:', error);
        return res.status(500).json({
            success: false,
            error: 'Une erreur est survenue. Veuillez réessayer.',
        });
    }
}

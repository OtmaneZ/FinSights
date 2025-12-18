/**
 * API Route: Newsletter Subscription
 * Endpoint: POST /api/newsletter/subscribe
 *
 * Ajoute un email à la liste de newsletter via Resend
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { logger } from '@/lib/logger';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Vérifier la clé API Resend
    if (!process.env.RESEND_API_KEY) {
        logger.error('❌ RESEND_API_KEY manquante dans les variables d\'environnement');
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

        // Envoyer un email de bienvenue via Resend
        const { data, error } = await resend.emails.send({
            from: 'FinSight Newsletter <newsletter@resend.dev>',
            to: [email],
            subject: '🎉 Bienvenue dans la newsletter FinSight !',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
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
                            <li>📊 Des analyses financières concrètes pour PME</li>
                            <li>💡 Des conseils pratiques de gestion de trésorerie</li>
                            <li>🎯 Des études de cas réels et retours terrain</li>
                            <li>🚀 Les nouvelles fonctionnalités de FinSight</li>
                        </ul>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://finsight.fr/blog" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                Découvrir le blog
                            </a>
                        </div>

                        <p style="font-size: 16px; margin-bottom: 20px;">
                            En attendant, n'hésitez pas à explorer nos <a href="https://finsight.fr/ressources/guides" style="color: #667eea; text-decoration: none;">guides pratiques</a> et notre <a href="https://finsight.fr/diagnostic" style="color: #667eea; text-decoration: none;">Diagnostic Express gratuit</a>.
                        </p>

                        <p style="font-size: 16px; margin-top: 30px;">
                            À très bientôt,<br>
                            <strong>Hugo Vallet</strong><br>
                            <span style="color: #666; font-size: 14px;">Expert Finance & Conseil PME</span>
                        </p>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                        <p style="font-size: 12px; color: #666; text-align: center;">
                            Vous recevez cet email car vous vous êtes inscrit(e) sur finsight.fr.<br>
                            <a href="#" style="color: #667eea; text-decoration: none;">Se désinscrire</a>
                        </p>
                    </div>
                </body>
                </html>
            `,
            tags: [
                { name: 'type', value: 'newsletter_welcome' },
                { name: 'source', value: source },
            ],
        });

        if (error) {
            logger.error('❌ Erreur Resend:', error);
            return res.status(500).json({
                success: false,
                error: 'Erreur lors de l\'inscription. Veuillez réessayer.',
            });
        }

        logger.debug(`✅ Email de bienvenue envoyé! ID: ${data?.id}`);

        // TODO: Ajouter l'email à une liste d'audience Resend (feature à venir)
        // Pour l'instant, on envoie juste un email de bienvenue

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

/**
 * API Route: Check Alerts Cron Job
 * Endpoint: GET /api/cron/check-alerts
 *
 * Exécuté quotidiennement par Vercel Cron (9h CET)
 * Vérifie les conditions d'alerte et envoie des emails
 */

import { NextApiRequest, NextApiResponse } from 'next';

export interface CronCheckResponse {
    success: boolean;
    timestamp: string;
    alertsChecked: number;
    alertsTriggered: number;
    emailsSent: number;
    errors: string[];
    details?: any[];
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CronCheckResponse>
) {
    const startTime = Date.now();
    console.log('⏰ [CRON] Starting alert check at', new Date().toISOString());

    // Vérifier la méthode HTTP
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            timestamp: new Date().toISOString(),
            alertsChecked: 0,
            alertsTriggered: 0,
            emailsSent: 0,
            errors: ['Method not allowed. Use GET.'],
        });
    }

    // Vérifier l'authentification Cron (Vercel Cron secret)
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;

    // Ne vérifier l'auth que si CRON_SECRET est vraiment défini (pas juste "your-secret-key-here-optional")
    if (cronSecret && cronSecret !== 'your-secret-key-here-optional' && authHeader !== `Bearer ${cronSecret}`) {
        console.error('❌ [CRON] Unauthorized access attempt');
        return res.status(401).json({
            success: false,
            timestamp: new Date().toISOString(),
            alertsChecked: 0,
            alertsTriggered: 0,
            emailsSent: 0,
            errors: ['Unauthorized'],
        });
    }

    console.log('✅ [CRON] Auth OK (or disabled for local testing)');

    const errors: string[] = [];
    const details: any[] = [];
    let alertsChecked = 0;
    let alertsTriggered = 0;
    let emailsSent = 0;

    try {
        // TODO: Dans une vraie implémentation, on récupérerait les données depuis une DB
        // Pour l'instant, on fait un exemple de logique

        console.log('📊 [CRON] Fetching latest financial data...');

        // Exemple de données (à remplacer par fetch depuis DB/API)
        const mockFinancialData = {
            tresorerie: 8500,
            dso: 52,
            marge: 18,
            hasAnomalies: true,
            upcomingDueDates: 5,
        };

        console.log('🔍 [CRON] Financial data:', mockFinancialData);

        // Exemple de configuration utilisateur (à récupérer depuis DB)
        const mockUserSettings = {
            userEmail: 'otmaneboulahia@gmail.com',
            companyName: 'ZineInsight',
            alerts: [
                { type: 'tresorerie', enabled: true, threshold: 10000, comparison: 'below', emailEnabled: true },
                { type: 'dso', enabled: true, threshold: 45, comparison: 'above', emailEnabled: true },
                { type: 'marge', enabled: true, threshold: 20, comparison: 'below', emailEnabled: true },
                { type: 'anomalie', enabled: true, threshold: 0, comparison: 'above', emailEnabled: true },
                { type: 'echeance', enabled: true, threshold: 3, comparison: 'below', emailEnabled: true },
            ],
        };

        console.log('⚙️ [CRON] User settings loaded');

        // Vérifier chaque alerte
        for (const alert of mockUserSettings.alerts) {
            if (!alert.enabled || !alert.emailEnabled) {
                continue;
            }

            alertsChecked++;
            let shouldTrigger = false;
            let alertValue: number | undefined;

            // Logique de vérification par type
            switch (alert.type) {
                case 'tresorerie':
                    alertValue = mockFinancialData.tresorerie;
                    if (alert.comparison === 'below' && alertValue < alert.threshold) {
                        shouldTrigger = true;
                    }
                    break;

                case 'dso':
                    alertValue = mockFinancialData.dso;
                    if (alert.comparison === 'above' && alertValue > alert.threshold) {
                        shouldTrigger = true;
                    }
                    break;

                case 'marge':
                    alertValue = mockFinancialData.marge;
                    if (alert.comparison === 'below' && alertValue < alert.threshold) {
                        shouldTrigger = true;
                    }
                    break;

                case 'anomalie':
                    if (mockFinancialData.hasAnomalies) {
                        shouldTrigger = true;
                        alertValue = 1;
                    }
                    break;

                case 'echeance':
                    alertValue = mockUserSettings.alerts.find(a => a.type === 'echeance')?.threshold;
                    if (mockFinancialData.upcomingDueDates > 0) {
                        shouldTrigger = true;
                    }
                    break;
            }

            if (shouldTrigger) {
                alertsTriggered++;
                console.log(`🚨 [CRON] Alert triggered: ${alert.type} (value: ${alertValue}, threshold: ${alert.threshold})`);

                // Envoyer l'email via l'API /api/alerts/send
                try {
                    const emailPayload = {
                        to: mockUserSettings.userEmail,
                        alertData: {
                            companyName: mockUserSettings.companyName,
                            alertType: alert.type,
                            severity: alert.type === 'tresorerie' ? 'critical' : 'warning',
                            value: alertValue,
                            threshold: alert.threshold,
                            details: `Alerte automatique détectée le ${new Date().toLocaleDateString('fr-FR')}`,
                            actionUrl: 'https://finsight.zineinsight.com/dashboard',
                        },
                    };

                    const sendResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/alerts/send`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(emailPayload),
                    });

                    const sendResult = await sendResponse.json();

                    if (sendResult.success) {
                        emailsSent++;
                        console.log(`✅ [CRON] Email sent for ${alert.type}: ${sendResult.messageId}`);
                        details.push({
                            type: alert.type,
                            status: 'sent',
                            messageId: sendResult.messageId,
                            value: alertValue,
                            threshold: alert.threshold,
                        });
                    } else {
                        errors.push(`Failed to send email for ${alert.type}: ${sendResult.error}`);
                        console.error(`❌ [CRON] Email failed for ${alert.type}:`, sendResult.error);
                    }
                } catch (emailError: any) {
                    errors.push(`Error sending email for ${alert.type}: ${emailError.message}`);
                    console.error(`❌ [CRON] Email error for ${alert.type}:`, emailError);
                }
            }
        }

        const duration = Date.now() - startTime;
        console.log(`✅ [CRON] Check completed in ${duration}ms`);
        console.log(`📊 [CRON] Summary: ${alertsChecked} checked, ${alertsTriggered} triggered, ${emailsSent} emails sent`);

        return res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            alertsChecked,
            alertsTriggered,
            emailsSent,
            errors,
            details,
        });

    } catch (error: any) {
        console.error('❌ [CRON] Fatal error:', error);
        return res.status(500).json({
            success: false,
            timestamp: new Date().toISOString(),
            alertsChecked,
            alertsTriggered,
            emailsSent,
            errors: [error.message || 'Internal server error'],
        });
    }
}

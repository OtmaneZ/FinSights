import { resend, FROM_EMAIL, REPLY_TO_EMAIL } from './resend'
import { render } from '@react-email/components'
import WelcomeEmail from './templates/WelcomeEmail'
import UpgradeSuccessEmail from './templates/UpgradeSuccessEmail'
import PaymentFailedEmail from './templates/PaymentFailedEmail'
import UsageAlertEmail from './templates/UsageAlertEmail'
import { logger } from '@/lib/logger';

/**
 * Email service for FinSight
 * All transactional emails go through this service
 */

// ============================================================================
// WELCOME EMAIL
// ============================================================================
export async function sendWelcomeEmail(params: {
    to: string
    userName: string
    userEmail: string
}) {
    try {
        const emailHtml = await render(
            WelcomeEmail({
                userName: params.userName,
                userEmail: params.userEmail,
                loginUrl: `${process.env.NEXTAUTH_URL}/auth/signin`,
            })
        )

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            replyTo: REPLY_TO_EMAIL,
            subject: '🎉 Bienvenue sur FinSight - Votre compte est prêt !',
            html: emailHtml,
        })

        if (error) {
            logger.error('[Email] Welcome email failed:', error)
            return { success: false, error }
        }

        logger.debug('[Email] Welcome email sent:', data?.id)
        return { success: true, id: data?.id }
    } catch (error) {
        logger.error('[Email] Welcome email exception:', error)
        return { success: false, error }
    }
}

// ============================================================================
// UPGRADE SUCCESS EMAIL
// ============================================================================
export async function sendUpgradeSuccessEmail(params: {
    to: string
    userName: string
    plan: 'PRO' | 'SCALE'
    amount: number
    nextBillingDate: string
}) {
    try {
        const emailHtml = await render(
            UpgradeSuccessEmail({
                userName: params.userName,
                plan: params.plan,
                amount: params.amount,
                nextBillingDate: params.nextBillingDate,
                dashboardUrl: `${process.env.NEXTAUTH_URL}/dashboard`,
            })
        )

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            replyTo: REPLY_TO_EMAIL,
            subject: `🚀 Bienvenue dans le plan ${params.plan} de FinSight !`,
            html: emailHtml,
        })

        if (error) {
            logger.error('[Email] Upgrade email failed:', error)
            return { success: false, error }
        }

        logger.debug('[Email] Upgrade email sent:', data?.id)
        return { success: true, id: data?.id }
    } catch (error) {
        logger.error('[Email] Upgrade email exception:', error)
        return { success: false, error }
    }
}

// ============================================================================
// PAYMENT FAILED EMAIL
// ============================================================================
export async function sendPaymentFailedEmail(params: {
    to: string
    userName: string
    plan: 'PRO' | 'SCALE'
    amount: number
    invoiceUrl: string
}) {
    try {
        const emailHtml = await render(
            PaymentFailedEmail({
                userName: params.userName,
                plan: params.plan,
                amount: params.amount,
                invoiceUrl: params.invoiceUrl,
                updatePaymentUrl: `${process.env.NEXTAUTH_URL}/account/billing`,
            })
        )

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            replyTo: REPLY_TO_EMAIL,
            subject: '⚠️ Échec du paiement FinSight - Action requise',
            html: emailHtml,
        })

        if (error) {
            logger.error('[Email] Payment failed email failed:', error)
            return { success: false, error }
        }

        logger.debug('[Email] Payment failed email sent:', data?.id)
        return { success: true, id: data?.id }
    } catch (error) {
        logger.error('[Email] Payment failed email exception:', error)
        return { success: false, error }
    }
}

// ============================================================================
// USAGE ALERT EMAIL
// ============================================================================
export async function sendUsageAlertEmail(params: {
    to: string
    userName: string
    plan: 'FREE' | 'PRO' | 'SCALE'
    resource: 'copilot_queries' | 'api_calls' | 'storage'
    currentUsage: number
    limit: number
    percentage: number
}) {
    try {
        const emailHtml = await render(
            UsageAlertEmail({
                userName: params.userName,
                plan: params.plan,
                resource: params.resource,
                currentUsage: params.currentUsage,
                limit: params.limit,
                percentage: params.percentage,
                upgradeUrl: `${process.env.NEXTAUTH_URL}/pricing`,
            })
        )

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            replyTo: REPLY_TO_EMAIL,
            subject: `⚠️ Alerte FinSight - ${params.percentage}% de votre quota atteint`,
            html: emailHtml,
        })

        if (error) {
            logger.error('[Email] Usage alert email failed:', error)
            return { success: false, error }
        }

        logger.debug('[Email] Usage alert email sent:', data?.id)
        return { success: true, id: data?.id }
    } catch (error) {
        logger.error('[Email] Usage alert email exception:', error)
        return { success: false, error }
    }
}

// ============================================================================
// HELPER: Check if email sending is enabled
// ============================================================================
export function isEmailEnabled(): boolean {
    return !!process.env.RESEND_API_KEY
}

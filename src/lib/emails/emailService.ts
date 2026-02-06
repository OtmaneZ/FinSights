import { resend, FROM_EMAIL, REPLY_TO_EMAIL } from './resend'
import { render } from '@react-email/components'
import WelcomeEmail from './templates/WelcomeEmail'
import UpgradeSuccessEmail from './templates/UpgradeSuccessEmail'
import PaymentFailedEmail from './templates/PaymentFailedEmail'
import UsageAlertEmail from './templates/UsageAlertEmail'
import TemplateWelcomeEmail from './templates/TemplateWelcomeEmail'
import TutorialEmail from './templates/TutorialEmail'
import CaseStudyEmail from './templates/CaseStudyEmail'
import AlertSignalsEmail from './templates/AlertSignalsEmail'
import DAFOfferEmail from './templates/DAFOfferEmail'
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

// ============================================================================
// NURTURING SEQUENCE: TEMPLATE DOWNLOAD
// ============================================================================

/**
 * J+0: Email de bienvenue après téléchargement template
 */
export async function sendTemplateWelcomeEmail(params: {
    to: string
    userName: string
    userEmail: string
    templateName: string
    downloadUrl: string
}) {
    try {
        const emailHtml = await render(
            TemplateWelcomeEmail({
                userName: params.userName,
                userEmail: params.userEmail,
                templateName: params.templateName,
                downloadUrl: params.downloadUrl,
            })
        )

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            replyTo: REPLY_TO_EMAIL,
            subject: `🎉 Votre template ${params.templateName} est prêt + 3 bonus exclusifs`,
            html: emailHtml,
            tags: [
                { name: 'email_type', value: 'nurturing_j0' },
                { name: 'template', value: params.templateName },
            ],
        })

        if (error) {
            logger.error('[Email] Template welcome email failed:', error)
            return { success: false, error }
        }

        logger.debug('[Email] Template welcome email sent:', data?.id)
        return { success: true, id: data?.id }
    } catch (error) {
        logger.error('[Email] Template welcome email exception:', error)
        return { success: false, error }
    }
}

/**
 * J+2: Email tutoriel d'utilisation
 */
export async function sendTutorialEmail(params: {
    to: string
    userName: string
    templateName: string
    videoUrl?: string
}) {
    try {
        const emailHtml = await render(
            TutorialEmail({
                userName: params.userName,
                templateName: params.templateName,
                videoUrl: params.videoUrl,
            })
        )

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            replyTo: REPLY_TO_EMAIL,
            subject: `🎬 Tutoriel : Maîtrisez votre ${params.templateName} (3 min)`,
            html: emailHtml,
            tags: [
                { name: 'email_type', value: 'nurturing_j2' },
                { name: 'template', value: params.templateName },
            ],
        })

        if (error) {
            logger.error('[Email] Tutorial email failed:', error)
            return { success: false, error }
        }

        logger.debug('[Email] Tutorial email sent:', data?.id)
        return { success: true, id: data?.id }
    } catch (error) {
        logger.error('[Email] Tutorial email exception:', error)
        return { success: false, error }
    }
}

/**
 * J+5: Email cas client / success story
 */
export async function sendCaseStudyEmail(params: {
    to: string
    userName: string
    caseStudyUrl?: string
}) {
    try {
        const emailHtml = await render(
            CaseStudyEmail({
                userName: params.userName,
                caseStudyUrl: params.caseStudyUrl,
            })
        )

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            replyTo: REPLY_TO_EMAIL,
            subject: '💼 Cas client : PME Services 8M€ - De 30j de visibilité à 120j en 60 jours',
            html: emailHtml,
            tags: [
                { name: 'email_type', value: 'nurturing_j5' },
                { name: 'content_type', value: 'case_study' },
            ],
        })

        if (error) {
            logger.error('[Email] Case study email failed:', error)
            return { success: false, error }
        }

        logger.debug('[Email] Case study email sent:', data?.id)
        return { success: true, id: data?.id }
    } catch (error) {
        logger.error('[Email] Case study email exception:', error)
        return { success: false, error }
    }
}

/**
 * J+10: Email signaux d'alerte trésorerie
 */
export async function sendAlertSignalsEmail(params: {
    to: string
    userName: string
}) {
    try {
        const emailHtml = await render(
            AlertSignalsEmail({
                userName: params.userName,
            })
        )

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            replyTo: REPLY_TO_EMAIL,
            subject: '🚨 3 signaux d\'alerte trésorerie que vous devez surveiller maintenant',
            html: emailHtml,
            tags: [
                { name: 'email_type', value: 'nurturing_j10' },
                { name: 'content_type', value: 'alert_signals' },
            ],
        })

        if (error) {
            logger.error('[Email] Alert signals email failed:', error)
            return { success: false, error }
        }

        logger.debug('[Email] Alert signals email sent:', data?.id)
        return { success: true, id: data?.id }
    } catch (error) {
        logger.error('[Email] Alert signals email exception:', error)
        return { success: false, error }
    }
}

/**
 * J+20: Email offre DAF externalisé (conversion)
 */
export async function sendDAFOfferEmail(params: {
    to: string
    userName: string
}) {
    try {
        const emailHtml = await render(
            DAFOfferEmail({
                userName: params.userName,
            })
        )

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            replyTo: REPLY_TO_EMAIL,
            subject: '💼 DAF Externalisé : Les 3 formules adaptées aux PME/ETI (tarifs transparents)',
            html: emailHtml,
            tags: [
                { name: 'email_type', value: 'nurturing_j20' },
                { name: 'content_type', value: 'daf_offer' },
            ],
        })

        if (error) {
            logger.error('[Email] DAF offer email failed:', error)
            return { success: false, error }
        }

        logger.debug('[Email] DAF offer email sent:', data?.id)
        return { success: true, id: data?.id }
    } catch (error) {
        logger.error('[Email] DAF offer email exception:', error)
        return { success: false, error }
    }
}

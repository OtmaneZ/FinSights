import { Resend } from 'resend'

// Allow build to succeed without RESEND_API_KEY (will fail at runtime if emails are sent)
const apiKey = process.env.RESEND_API_KEY || 'placeholder-key-for-build'

if (!process.env.RESEND_API_KEY && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ RESEND_API_KEY not set - email functionality will be disabled')
}

export const resend = new Resend(apiKey)

// Production domain - verify on resend.com/domains first
export const FROM_EMAIL = 'FinSight <noreply@finsight.zineinsight.com>'
export const REPLY_TO_EMAIL = 'support@zineinsight.com'

import { Resend } from 'resend'

// Allow build to succeed without RESEND_API_KEY (will fail at runtime if emails are sent)
const apiKey = process.env.RESEND_API_KEY || 'placeholder-key-for-build'

// Note: Email functionality requires RESEND_API_KEY in production
// Errors will be handled by the email service layer

export const resend = new Resend(apiKey)

// Production domain - verify on resend.com/domains first
export const FROM_EMAIL = 'FinSight <noreply@finsight.zineinsight.com>'
export const REPLY_TO_EMAIL = 'support@zineinsight.com'

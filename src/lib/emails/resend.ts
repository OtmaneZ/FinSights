import { Resend } from 'resend'

// Allow build to succeed without RESEND_API_KEY (will fail at runtime if emails are sent)
const apiKey = process.env.RESEND_API_KEY || 'placeholder-key-for-build'

// Note: Email functionality requires RESEND_API_KEY in production
// Errors will be handled by the email service layer

export const resend = new Resend(apiKey)

// Domaine vérifié Resend : finsight.zineinsight.com (DKIM resend._domainkey.finsight présent)
// Variable d'env RESEND_FROM_EMAIL pour override si besoin
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'FinSight <noreply@finsight.zineinsight.com>'
export const REPLY_TO_EMAIL = 'otmane@zineinsight.com'

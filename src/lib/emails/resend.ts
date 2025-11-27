import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY must be defined in environment variables')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Production domain - verify on resend.com/domains first
export const FROM_EMAIL = 'FinSight <noreply@finsight.zineinsight.com>'
export const REPLY_TO_EMAIL = 'support@zineinsight.com'

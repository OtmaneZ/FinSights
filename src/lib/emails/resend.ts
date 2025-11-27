import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY must be defined in environment variables')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Use Resend's onboarding domain for testing (verified by default)
// Replace with your verified domain in production
export const FROM_EMAIL = 'FinSight <onboarding@resend.dev>'
export const REPLY_TO_EMAIL = 'support@zineinsight.com'

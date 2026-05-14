import { Resend } from 'resend'
import { logger } from '@/lib/logger'

// Allow build to succeed without RESEND_API_KEY (will fail at runtime if emails are sent)
const apiKey = process.env.RESEND_API_KEY || 'placeholder-key-for-build'

// Note: Email functionality requires RESEND_API_KEY in production
// Errors will be handled by the email service layer

export const resend = new Resend(apiKey)

/**
 * Expéditeur par défaut : sous-domaine finsight.zineinsight.com
 * (à aligner avec un domaine « verified » dans le dashboard Resend - pas zineinsight.com racine sauf si configuré).
 * Override : RESEND_FROM_EMAIL
 */
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'FinSight <otmane@zineinsight.com>'
export const REPLY_TO_EMAIL = 'otmane@zineinsight.com'

/** Notifications internes (override : ADMIN_NOTIFY_EMAIL) */
export const ADMIN_NOTIFY_EMAIL =
  process.env.ADMIN_NOTIFY_EMAIL ?? 'otmane@zineinsight.com'

export function isResendConfigured(): boolean {
  const k = process.env.RESEND_API_KEY
  return Boolean(k && k !== 'placeholder-key-for-build')
}

type SendPayload = Parameters<typeof resend.emails.send>[0]

/**
 * Envoie l’email utilisateur et la notif admin en parallèle.
 * L’échec de la notif admin est logué uniquement (n’interdit pas le flux utilisateur).
 */
export async function sendUserEmailWithAdminNotify(
  userPayload: SendPayload,
  adminSubject: string,
  adminText: string,
): Promise<Awaited<ReturnType<typeof resend.emails.send>>> {
  const adminPayload: SendPayload = {
    from: FROM_EMAIL,
    to: [ADMIN_NOTIFY_EMAIL],
    subject: adminSubject,
    text: adminText,
  }
  const [userResult] = await Promise.all([
    resend.emails.send(userPayload),
    resend.emails.send(adminPayload).catch((err: unknown) => {
      logger.error('[admin notify] Échec envoi notification interne:', err)
    }),
  ])
  return userResult
}

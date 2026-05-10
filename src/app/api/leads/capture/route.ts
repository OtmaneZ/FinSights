import path from 'path'
import fs from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import prisma from '@/lib/prisma'
import {
  sendUserEmailWithAdminNotify,
  isResendConfigured,
  FROM_EMAIL,
  REPLY_TO_EMAIL,
} from '@/lib/emails/resend'
import { TemplateDownloadEmail } from '@/lib/emails/templates/TemplateDownloadEmail'
import { sanitizeResendTagEntries } from '@/lib/emails/sanitizeResendTag'
import { logger } from '@/lib/logger'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://finsight.zineinsight.com'

/** Chemins publics autorisés pour pièce jointe xlsx (lead magnets templates). */
const ALLOWED_TEMPLATE_XLSX = new Set([
  '/templates/excel/budget-previsionnel-2026.xlsx',
  '/templates/excel/tracker-dso.xlsx',
  '/templates/excel/dashboard-cashflow.xlsx',
])

interface LeadCapturePayload {
  email?: string
  source?: string
  firstName?: string
  lastName?: string
  company?: string
  sector?: string
  templateName?: string
  leadMagnet?: string
  xlsxPath?: string
  newsletter_opt_in?: boolean
  metadata?: {
    firstName?: string
    lastName?: string
    company?: string
    sector?: string
    templateName?: string
    [key: string]: unknown
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function getSafeTemplateName(source?: string, metadata?: LeadCapturePayload['metadata']): string {
  const templateFromMetadata = typeof metadata?.templateName === 'string' ? metadata.templateName.trim() : ''
  if (templateFromMetadata) return templateFromMetadata
  if (source === 'template_download') return 'Template FinSight'
  if (source?.startsWith('template_')) return 'Template Excel FinSight'
  return `Ressource ${source || 'unknown'}`
}

function buildConfirmationEmail(templateName: string): { subject: string; html: string } {
  return {
    subject: `Votre ressource FinSight est disponible : ${templateName}`,
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#0f172a;padding:24px;text-align:center;border-radius:10px 10px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">Merci pour votre demande</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 10px 10px;">
          <p>Votre accès à la ressource <strong>${templateName}</strong> est bien confirmé.</p>
          <p>Vous pouvez continuer à explorer les ressources FinSight depuis votre navigateur.</p>
          <p style="margin-top:24px;font-size:12px;color:#666;">
            FinSight · Direction Financière Externalisée<br />
            <a href="${SITE_URL}/politique-confidentialite" style="color:#666;">Politique de confidentialité</a>
          </p>
        </div>
      </body>
      </html>
    `,
  }
}

async function readPublicXlsx(xlsxPath: string): Promise<{ filename: string; content: Buffer } | null> {
  const relativeFromPublic = xlsxPath.replace(/^\//, '')
  const fullPath = path.join(process.cwd(), 'public', relativeFromPublic)
  const safeRoot = path.join(process.cwd(), 'public', 'templates', 'excel')
  const normalized = path.normalize(fullPath)
  if (!normalized.startsWith(safeRoot)) return null
  try {
    const content = await fs.readFile(normalized)
    return { filename: path.basename(normalized), content }
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  let payload: LeadCapturePayload

  try {
    payload = (await req.json()) as LeadCapturePayload
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 })
  }

  const email = payload.email?.trim().toLowerCase()
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 })
  }

  const source = payload.source?.trim() || 'template_download'
  const templateName =
    payload.leadMagnet?.trim() ||
    payload.templateName?.trim() ||
    getSafeTemplateName(source, payload.metadata)

  const rawFirstName = (payload.firstName || payload.metadata?.firstName || '').toString().trim()
  const xlsxPath = payload.xlsxPath?.trim()

  if (xlsxPath) {
    if (rawFirstName.length < 2) {
      return NextResponse.json({ success: false, error: 'Merci de saisir votre prénom.' }, { status: 400 })
    }
    if (!ALLOWED_TEMPLATE_XLSX.has(xlsxPath)) {
      return NextResponse.json({ success: false, error: 'Demande invalide.' }, { status: 400 })
    }
  }

  const firstName = rawFirstName || 'Prospect'
  const lastName = payload.lastName?.toString().trim() || payload.metadata?.lastName?.toString().trim() || null
  const company = payload.company?.toString().trim() || payload.metadata?.company?.toString().trim() || null
  const sector = payload.sector?.toString().trim() || payload.metadata?.sector?.toString().trim() || null

  let attachment:
    | { filename: string; content: Buffer; contentType: string }
    | undefined

  if (isResendConfigured() && xlsxPath) {
    const loaded = await readPublicXlsx(xlsxPath)
    if (!loaded) {
      return NextResponse.json(
        { success: false, error: 'Fichier template temporairement indisponible.' },
        { status: 503 },
      )
    }
    attachment = {
      filename: loaded.filename,
      content: loaded.content,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
  }

  let leadId: string | null = null

  try {
    const lead = await prisma.lead.upsert({
      where: { email },
      update: {
        firstName,
        lastName,
        company,
        sector,
        source,
        templateName,
        lastEmailSent: 'welcome',
        nextEmailScheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      create: {
        email,
        firstName,
        lastName,
        company,
        sector,
        source,
        templateName,
        lastEmailSent: 'welcome',
        nextEmailScheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    })
    leadId = lead.id
  } catch (dbErr) {
    logger.warn('⚠️ Lead DB indisponible ou erreur Prisma:', dbErr)
  }

  if (isResendConfigured()) {
    try {
      let subject: string
      let html: string

      if (attachment) {
        html = await render(
          TemplateDownloadEmail({
            firstName,
            templateName,
            calculatorsUrl: `${SITE_URL}/calculateurs`,
            privacyUrl: `${SITE_URL}/politique-confidentialite`,
          }),
        )
        subject = `Votre template Excel : ${templateName}`
      } else {
        const built = buildConfirmationEmail(templateName)
        subject = built.subject
        html = built.html
      }

      const adminSubject = `📥 Nouveau lead — ${templateName} — ${email}`

      const adminBodyLines = [
        'Nouveau lead FinSight',
        '',
        `Lead magnet : ${templateName}`,
        `Email : ${email}`,
        `Prénom : ${firstName}`,
        `Source : ${source}`,
        attachment ? `Pièce jointe : ${attachment.filename}` : 'Pièce jointe : —',
        leadId ? `ID lead : ${leadId}` : 'ID lead : —',
      ]
      const adminBody = adminBodyLines.join('\n')

      const { error } = await sendUserEmailWithAdminNotify(
        {
          from: FROM_EMAIL,
          replyTo: REPLY_TO_EMAIL,
          to: [email],
          subject,
          html,
          ...(attachment ? { attachments: [attachment] } : {}),
          tags: sanitizeResendTagEntries([
            { name: 'source', value: source },
            { name: 'template_name', value: templateName },
          ]),
        },
        adminSubject,
        adminBody,
      )
      if (error) {
        logger.error('❌ Envoi email confirmation lead (utilisateur):', error)
      }
    } catch (err) {
      logger.error('❌ Envoi email lead (exception):', err)
    }
  } else {
    logger.warn('⚠️ RESEND_API_KEY absente ou placeholder — email lead non envoyé')
  }

  return NextResponse.json({ success: true, leadId }, { status: 200 })
}

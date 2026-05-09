import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { resend, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/emails/resend'

interface LeadCapturePayload {
  email?: string
  source?: string
  firstName?: string
  lastName?: string
  company?: string
  sector?: string
  templateName?: string
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
            <a href="https://finsight.zineinsight.com/politique-confidentialite" style="color:#666;">Politique de confidentialité</a>
          </p>
        </div>
      </body>
      </html>
    `,
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
  const templateName = payload.templateName?.trim() || getSafeTemplateName(source, payload.metadata)
  const firstName = (payload.firstName || payload.metadata?.firstName || 'Prospect').toString().trim() || 'Prospect'
  const lastName = payload.lastName?.toString().trim() || payload.metadata?.lastName?.toString().trim() || null
  const company = payload.company?.toString().trim() || payload.metadata?.company?.toString().trim() || null
  const sector = payload.sector?.toString().trim() || payload.metadata?.sector?.toString().trim() || null

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
  } catch {
    // Fallback silencieux si la DB est indisponible
  }

  try {
    const { subject, html } = buildConfirmationEmail(templateName)
    await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO_EMAIL,
      to: [email],
      subject,
      html,
      tags: [
        { name: 'source', value: source },
        { name: 'template_name', value: templateName },
      ],
    })
  } catch {
    // Ne pas bloquer la réponse API si l'email échoue
  }

  return NextResponse.json({ success: true, leadId }, { status: 200 })
}

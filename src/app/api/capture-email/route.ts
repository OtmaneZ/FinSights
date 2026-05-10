import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import { resend, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/emails/resend'
import { generateCalculatorPDF, type CalculatorPDFCalculatorType } from '@/lib/pdf/generateCalculatorPDF'
import { CalculatorReportEmail } from '@/lib/emails/templates/CalculatorReportEmail'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://finsight.zineinsight.com'

const ALLOWED: CalculatorPDFCalculatorType[] = [
  'dso',
  'bfr',
  'roi',
  'marge',
  'seuil-rentabilite',
  'ebitda',
  'cac-ltv',
  'burn-rate',
  'valorisation',
]

const NAMES: Record<CalculatorPDFCalculatorType, string> = {
  dso: 'DSO',
  bfr: 'BFR',
  roi: 'ROI',
  marge: 'Marge',
  'seuil-rentabilite': 'Seuil de rentabilité',
  ebitda: 'EBITDA',
  'cac-ltv': 'CAC / LTV',
  'burn-rate': 'Burn rate',
  valorisation: 'Valorisation',
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function pickSummary(result: Record<string, unknown>) {
  const rows = Array.isArray(result.summary)
    ? (result.summary as { label: string; value: string }[])
        .filter((r) => r && typeof r.label === 'string' && typeof r.value === 'string')
        .map((r) => ({ label: r.label, value: r.value }))
    : []

  return rows.slice(0, 3)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, calculatorType, result, inputs } = body as {
      email?: string
      calculatorType?: string
      result?: unknown
      inputs?: unknown
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    if (!calculatorType || !ALLOWED.includes(calculatorType as CalculatorPDFCalculatorType)) {
      return NextResponse.json({ error: 'Type de calculateur invalide' }, { status: 400 })
    }

    if (!isPlainObject(result) || !isPlainObject(inputs)) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const cleanEmail = String(email).trim().toLowerCase()
    const type = calculatorType as CalculatorPDFCalculatorType
    const calcName = NAMES[type]

    const pdfBase64 = generateCalculatorPDF({
      calculatorType: type,
      calculatorName: calcName,
      email: cleanEmail,
      result,
      inputs,
    })

    const pdfBuffer = Buffer.from(pdfBase64, 'base64')
    const fileName = `FinSight_${type}_${new Date().toISOString().slice(0, 10)}.pdf`

    const diagnosticUrl = `${SITE_URL}/mon-diagnostic`
    const summary = pickSummary(result)

    const html = await render(
      CalculatorReportEmail({
        calculatorName: calcName,
        summary: summary.length ? summary : [{ label: 'Rapport', value: 'Voir PDF joint' }],
        diagnosticUrl,
      }),
    )

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO_EMAIL,
      to: [cleanEmail],
      subject: `Votre rapport ${calcName} - FinSight™`,
      html,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    if (error) {
      return NextResponse.json({ error: error.message || 'Erreur envoi email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur serveur' }, { status: 500 })
  }
}

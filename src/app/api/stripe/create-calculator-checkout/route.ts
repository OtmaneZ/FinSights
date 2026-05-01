import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { logger } from '@/lib/logger'
import type { CalculatorPDFCalculatorType } from '@/lib/pdf/generateCalculatorPDF'

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

const META_VALUE_MAX = 450

function chunkMetaField(baseKey: string, value: string): Record<string, string> {
  if (value.length <= META_VALUE_MAX) {
    return { [baseKey]: value }
  }
  const out: Record<string, string> = {}
  let i = 0
  let part = 0
  while (i < value.length) {
    out[`${baseKey}_${part}`] = value.slice(i, i + META_VALUE_MAX)
    i += META_VALUE_MAX
    part++
  }
  out[`${baseKey}_count`] = String(part)
  return out
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function safeBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'https://finsight.zineinsight.com'
  ).replace(/\/$/, '')
}

function validateCancelPath(path: string | undefined, calculatorType: string): string {
  const fallback = `/calculateurs/${calculatorType}`
  if (!path || typeof path !== 'string') return fallback
  if (!/^\/calculateurs\/[a-z0-9-]+$/.test(path)) return fallback
  return path
}

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
    }

    const body = await req.json()
    const { calculatorType, result, inputs, email, cancelPath } = body as {
      calculatorType?: string
      result?: unknown
      inputs?: unknown
      email?: string
      cancelPath?: string
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
    const base = safeBaseUrl()
    const cancel = validateCancelPath(cancelPath, calculatorType)

    const resultStr = JSON.stringify(result)
    const inputsStr = JSON.stringify(inputs)

    const metadata: Record<string, string> = {
      checkoutKind: 'calculator_premium',
      calculatorType,
      email: cleanEmail,
      ...chunkMetaField('result', resultStr),
      ...chunkMetaField('inputs', inputsStr),
    }

    const keyCount = Object.keys(metadata).length
    if (keyCount > 48) {
      logger.warn(`⚠️ Metadata calculator premium: ${keyCount} clés (proche limite Stripe)`)
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: cleanEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: 900,
            product_data: {
              name: 'Rapport Premium FinSight™',
              description: 'Rapport PDF premium + plan d’action 90 jours + benchmark sectoriel',
            },
          },
        },
      ],
      success_url: `${base}/rapport-premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}${cancel}`,
      metadata,
    })

    if (!checkoutSession.url) {
      return NextResponse.json({ error: 'Session Stripe sans URL' }, { status: 500 })
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur création session'
    logger.error('❌ create-calculator-checkout:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

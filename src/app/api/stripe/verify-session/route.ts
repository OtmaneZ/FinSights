import { NextRequest, NextResponse } from 'next/server'
import { isStripeConfigured, stripe } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ verified: false, reason: 'missing_session_id' }, { status: 400 })
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ verified: false, reason: 'stripe_not_configured' }, { status: 200 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const isPaid = session.payment_status === 'paid'
    const product = session.metadata?.product
    const isScoris =
      product === 'scoris_report' || product === 'scoris_strategique'

    return NextResponse.json({ verified: isPaid && isScoris }, { status: 200 })
  } catch {
    return NextResponse.json({ verified: false, reason: 'invalid_or_unreachable_session' }, { status: 200 })
  }
}

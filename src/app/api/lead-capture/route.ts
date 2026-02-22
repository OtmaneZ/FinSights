import { NextRequest, NextResponse } from 'next/server'

// Simple email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, source, leadMagnet, newsletterOptIn, score } = body

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    // Log lead (replace with your email service, CRM, or DB)
    console.log('[lead-capture]', {
      email: email.trim().toLowerCase(),
      source: source || 'unknown',
      leadMagnet: leadMagnet || null,
      newsletterOptIn: newsletterOptIn || false,
      score: score || null,
      capturedAt: new Date().toISOString(),
    })

    // TODO: Replace with actual integration:
    // - Resend: await resend.emails.send({ to: email, subject: '...', ... })
    // - Brevo / Mailchimp: await addToList(email, { source, ... })
    // - Prisma: await prisma.lead.create({ data: { email, source, ... } })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

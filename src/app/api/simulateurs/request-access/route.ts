import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL } from '@/lib/emails/resend'
import { buildMagicLinkEmail } from '@/lib/emails/magicLinkEmail'

const BASE_URL = process.env.NEXTAUTH_URL || 'https://finsight.zineinsight.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email: string = (body.email || '').trim().toLowerCase()

    // Validation email basique
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentCount = await prisma.simulatorToken.count({
      where: { email, createdAt: { gte: oneHourAgo } },
    })
    if (recentCount >= 3) {
      return NextResponse.json(
        { error: 'Trop de demandes pour cet email. Réessayez dans une heure.' },
        { status: 429 }
      )
    }

    // Générer un token UUID unique
    const token = randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // +24h

    // Stocker le token en base
    await prisma.simulatorToken.create({
      data: { email, token, expiresAt },
    })

    // Construire le lien magic
    const magicUrl = `${BASE_URL}/api/simulateurs/verify?token=${token}`
    const { subject, html } = buildMagicLinkEmail(magicUrl, email)

    // Envoyer l'email via Resend
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject,
      html,
      tags: [{ name: 'simulateur_acces', value: 'true' }],
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[simulateurs/request-access]', err)
    return NextResponse.json({ error: 'Erreur interne. Veuillez réessayer.' }, { status: 500 })
  }
}

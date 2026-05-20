import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/simulateurs/acces?error=missing', req.url))
  }

  try {
    const record = await prisma.simulatorToken.findUnique({ where: { token } })

    if (!record) {
      return NextResponse.redirect(new URL('/simulateurs/acces?error=invalid', req.url))
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.redirect(new URL('/simulateurs/acces?error=expired', req.url))
    }

    if (record.usedAt) {
      return NextResponse.redirect(new URL('/simulateurs/acces?error=used', req.url))
    }

    await prisma.simulatorToken.update({
      where: { token },
      data: { usedAt: new Date() },
    })

    const response = NextResponse.redirect(new URL('/simulateurs/cout-reel-salarie', req.url))
    response.cookies.set('sim_access', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })

    return response
  } catch (err) {
    console.error('[simulateurs/verify]', err)
    return NextResponse.redirect(new URL('/simulateurs/acces?error=server', req.url))
  }
}

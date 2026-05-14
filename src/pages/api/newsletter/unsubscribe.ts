import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed')
  }

  const emailParam = req.query.email
  const email = typeof emailParam === 'string' ? emailParam.trim().toLowerCase() : ''

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.redirect(302, '/desinscription-confirmee?status=invalid-email')
  }

  try {
    await prisma.lead.updateMany({
      where: { email },
      data: { unsubscribed: true },
    })
  } catch (error) {
    logger.error('❌ Newsletter unsubscribe error:', error)
  }

  return res.redirect(302, '/desinscription-confirmee')
}

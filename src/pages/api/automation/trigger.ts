/**
 * API Route: Email Automation Trigger (Cron Job)
 * Endpoint: GET /api/automation/trigger
 * 
 * Triggers scheduled nurturing emails (J+2, J+5, J+10, J+20)
 * Called by Vercel Cron daily at 9:00 AM Paris time
 * 
 * Protection: Requires CRON_SECRET env variable
 */

import { NextApiRequest, NextApiResponse } from 'next'
import {
    sendTutorialEmail,
    sendCaseStudyEmail,
    sendAlertSignalsEmail,
    sendDAFOfferEmail,
} from '@/lib/emails/emailService'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

interface TriggerResponse {
    success: boolean
    message?: string
    stats?: {
        j2_sent: number
        j5_sent: number
        j10_sent: number
        j20_sent: number
        errors: number
    }
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TriggerResponse>
) {
    // Only accept GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed',
        })
    }

    // Verify cron secret for security
    const authHeader = req.headers.authorization
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
        logger.error('❌ CRON_SECRET not configured')
        return res.status(500).json({
            success: false,
            error: 'Cron secret not configured',
        })
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
        logger.warn('⚠️ Unauthorized cron trigger attempt')
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
        })
    }

    try {
        logger.debug('🤖 Email automation trigger started')

        const stats = {
            j2_sent: 0,
            j5_sent: 0,
            j10_sent: 0,
            j20_sent: 0,
            errors: 0,
        }

        const now = new Date()
        const tolerance = 60 * 60 * 1000 // 1 hour tolerance
        
        // Query leads for J+2 emails (tutorial)
        const leadsJ2 = await prisma.lead.findMany({
            where: {
                nextEmailScheduled: {
                    gte: new Date(now.getTime() - tolerance),
                    lte: new Date(now.getTime() + tolerance),
                },
                lastEmailSent: 'welcome',
                unsubscribed: false,
            },
        })

        for (const lead of leadsJ2) {
            try {
                await sendTutorialEmail({
                    to: lead.email,
                    userName: lead.firstName,
                    templateName: lead.templateName,
                })
                
                // Update lead in database
                await prisma.lead.update({
                    where: { id: lead.id },
                    data: {
                        lastEmailSent: 'tutorial',
                        nextEmailScheduled: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // J+5
                    },
                })
                
                stats.j2_sent++
                logger.debug(`✅ Tutorial email sent to ${lead.email}`)
            } catch (error) {
                stats.errors++
                logger.error(`❌ Failed to send tutorial email to ${lead.email}:`, error)
            }
        }

        // Query leads for J+5 emails (case study)
        const leadsJ5 = await prisma.lead.findMany({
            where: {
                nextEmailScheduled: {
                    gte: new Date(now.getTime() - tolerance),
                    lte: new Date(now.getTime() + tolerance),
                },
                lastEmailSent: 'tutorial',
                unsubscribed: false,
            },
        })

        for (const lead of leadsJ5) {
            try {
                await sendCaseStudyEmail({
                    to: lead.email,
                    userName: lead.firstName,
                })
                
                await prisma.lead.update({
                    where: { id: lead.id },
                    data: {
                        lastEmailSent: 'case_study',
                        nextEmailScheduled: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // J+10
                    },
                })
                
                stats.j5_sent++
                logger.debug(`✅ Case study email sent to ${lead.email}`)
            } catch (error) {
                stats.errors++
                logger.error(`❌ Failed to send case study email to ${lead.email}:`, error)
            }
        }

        // Query leads for J+10 emails (alert signals)
        const leadsJ10 = await prisma.lead.findMany({
            where: {
                nextEmailScheduled: {
                    gte: new Date(now.getTime() - tolerance),
                    lte: new Date(now.getTime() + tolerance),
                },
                lastEmailSent: 'case_study',
                unsubscribed: false,
            },
        })

        for (const lead of leadsJ10) {
            try {
                await sendAlertSignalsEmail({
                    to: lead.email,
                    userName: lead.firstName,
                })
                
                await prisma.lead.update({
                    where: { id: lead.id },
                    data: {
                        lastEmailSent: 'alert_signals',
                        nextEmailScheduled: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // J+20
                    },
                })
                
                stats.j10_sent++
                logger.debug(`✅ Alert signals email sent to ${lead.email}`)
            } catch (error) {
                stats.errors++
                logger.error(`❌ Failed to send alert signals email to ${lead.email}:`, error)
            }
        }

        // Query leads for J+20 emails (DAF offer)
        const leadsJ20 = await prisma.lead.findMany({
            where: {
                nextEmailScheduled: {
                    gte: new Date(now.getTime() - tolerance),
                    lte: new Date(now.getTime() + tolerance),
                },
                lastEmailSent: 'alert_signals',
                unsubscribed: false,
            },
        })

        for (const lead of leadsJ20) {
            try {
                await sendDAFOfferEmail({
                    to: lead.email,
                    userName: lead.firstName,
                })
                
                await prisma.lead.update({
                    where: { id: lead.id },
                    data: {
                        lastEmailSent: 'daf_offer',
                        nextEmailScheduled: null, // Sequence terminée
                    },
                })
                
                stats.j20_sent++
                logger.debug(`✅ DAF offer email sent to ${lead.email}`)
            } catch (error) {
                stats.errors++
                logger.error(`❌ Failed to send DAF offer email to ${lead.email}:`, error)
            }
        }

        logger.debug(`🤖 Email automation completed: ${JSON.stringify(stats)}`)

        return res.status(200).json({
            success: true,
            message: 'Email automation trigger completed',
            stats,
        })

    } catch (error: any) {
        logger.error('❌ Error in email automation trigger:', error)
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal server error',
        })
    }
}

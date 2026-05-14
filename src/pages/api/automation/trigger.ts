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
    sendWeeklyNewsletterEmail,
} from '@/lib/emails/emailService'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const SITE_URL = 'https://finsight.zineinsight.com'

interface WeeklyNewsletterContentItem {
    title: string
    url: string
    summary: string
}

interface WeeklyNewsletterPayload {
    weeklyContent?: {
        week1?: WeeklyNewsletterContentItem
        week2?: WeeklyNewsletterContentItem
        recurring?: WeeklyNewsletterContentItem
    }
}

const DEFAULT_WEEKLY_CONTENT: Required<NonNullable<WeeklyNewsletterPayload['weeklyContent']>> = {
    week1: {
        title: '7 leviers pour ameliorer votre tresorerie PME',
        url: `${SITE_URL}/blog`,
        summary: 'Un guide concret pour reduire la tension de tresorerie et reprendre de la visibilite en moins de 30 jours.',
    },
    week2: {
        title: 'DSO, BFR, marge: les 3 indicateurs a suivre chaque semaine',
        url: `${SITE_URL}/calculateurs`,
        summary: 'Comment mettre en place un rituel de pilotage simple pour prendre de meilleures decisions financieres.',
    },
    recurring: {
        title: 'Le Pilote FinSight: article hebdomadaire',
        url: `${SITE_URL}/blog`,
        summary: 'Chaque semaine, un article pratique pour piloter cash, rentabilite et risques sans jargon inutile.',
    },
}

function sanitizeWeeklyContent(payload?: WeeklyNewsletterPayload): Required<NonNullable<WeeklyNewsletterPayload['weeklyContent']>> {
    const c = payload?.weeklyContent

    const pick = (
        value: WeeklyNewsletterContentItem | undefined,
        fallback: WeeklyNewsletterContentItem,
    ): WeeklyNewsletterContentItem => {
        if (!value) return fallback
        if (!value.title || !value.url || !value.summary) return fallback
        return {
            title: value.title,
            url: value.url,
            summary: value.summary,
        }
    }

    return {
        week1: pick(c?.week1, DEFAULT_WEEKLY_CONTENT.week1),
        week2: pick(c?.week2, DEFAULT_WEEKLY_CONTENT.week2),
        recurring: pick(c?.recurring, DEFAULT_WEEKLY_CONTENT.recurring),
    }
}

interface TriggerResponse {
    success: boolean
    message?: string
    stats?: {
        j2_sent: number
        j5_sent: number
        j10_sent: number
        j20_sent: number
        newsletter_j7_sent: number
        newsletter_j14_sent: number
        newsletter_weekly_sent: number
        errors: number
    }
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TriggerResponse>
) {
    // Keep GET for Vercel cron, allow POST for manual trigger with payload
    if (req.method !== 'GET' && req.method !== 'POST') {
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
            newsletter_j7_sent: 0,
            newsletter_j14_sent: 0,
            newsletter_weekly_sent: 0,
            errors: 0,
        }

        const bodyPayload = req.method === 'POST' ? (req.body as WeeklyNewsletterPayload) : undefined
        const weeklyContent = sanitizeWeeklyContent(bodyPayload)

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

        // Newsletter segment (distinct from template nurturing)
        const newsletterLeads = await prisma.lead.findMany({
            where: {
                source: 'newsletter',
                nextEmailScheduled: {
                    gte: new Date(now.getTime() - tolerance),
                    lte: new Date(now.getTime() + tolerance),
                },
                unsubscribed: false,
            },
        })

        for (const lead of newsletterLeads) {
            try {
                const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(lead.email)}`
                const recipientName = lead.firstName || 'abonne'
                const stage = lead.lastEmailSent || 'newsletter_welcome'

                let content = weeklyContent.recurring
                let nextStage = 'newsletter_weekly'
                let statKey: 'newsletter_j7_sent' | 'newsletter_j14_sent' | 'newsletter_weekly_sent' = 'newsletter_weekly_sent'

                if (stage === 'newsletter_welcome') {
                    content = weeklyContent.week1
                    nextStage = 'newsletter_article_1'
                    statKey = 'newsletter_j7_sent'
                } else if (stage === 'newsletter_article_1') {
                    content = weeklyContent.week2
                    nextStage = 'newsletter_article_2'
                    statKey = 'newsletter_j14_sent'
                }

                await sendWeeklyNewsletterEmail({
                    to: lead.email,
                    recipientName,
                    articleTitle: content.title,
                    articleUrl: content.url,
                    summary: content.summary,
                    unsubscribeUrl,
                })

                await prisma.lead.update({
                    where: { id: lead.id },
                    data: {
                        lastEmailSent: nextStage,
                        nextEmailScheduled: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                    },
                })

                stats[statKey]++
                logger.debug(`✅ Newsletter email sent to ${lead.email} (${nextStage})`)
            } catch (error) {
                stats.errors++
                logger.error(`❌ Failed to send newsletter email to ${lead.email}:`, error)
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

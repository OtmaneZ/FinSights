/**
 * API Route: Capture Lead (Template Download)
 * Endpoint: POST /api/leads/capture
 * 
 * Capture lead information when user downloads a template
 * Sends welcome email (J+0) and schedules nurturing sequence
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { sendTemplateWelcomeEmail } from '@/lib/emails/emailService'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

interface CaptureLeadRequest {
    email: string
    firstName: string
    lastName?: string
    company?: string
    sector?: string
    templateName: string
    source?: string // 'template_download', 'calculator', 'guide'
}

interface CaptureLeadResponse {
    success: boolean
    message?: string
    error?: string
    leadId?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CaptureLeadResponse>
) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed',
        })
    }

    try {
        const {
            email,
            firstName,
            lastName,
            company,
            sector,
            templateName,
            source = 'template_download',
        }: CaptureLeadRequest = req.body

        // Validate required fields
        if (!email || !firstName || !templateName) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: email, firstName, templateName',
            })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
            })
        }

        logger.debug(`📧 Lead capture: ${firstName} (${email}) - Template: ${templateName}`)

        // Store lead in database
        const lead = await prisma.lead.upsert({
            where: { email },
            update: {
                firstName,
                lastName,
                company,
                sector,
                templateName,
                lastEmailSent: 'welcome',
                nextEmailScheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // J+2
                updatedAt: new Date(),
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
                nextEmailScheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // J+2
            },
        })

        logger.debug(`💾 Lead saved to database: ${lead.id}`)

        // Generate download URL for template
        const downloadUrl = `${process.env.NEXTAUTH_URL}/templates/download?name=${encodeURIComponent(templateName)}`

        // Send welcome email (J+0)
        const emailResult = await sendTemplateWelcomeEmail({
            to: email,
            userName: firstName,
            userEmail: email,
            templateName,
            downloadUrl,
        })

        if (!emailResult.success) {
            logger.error('❌ Failed to send welcome email:', emailResult.error)
            return res.status(500).json({
                success: false,
                error: 'Failed to send welcome email',
            })
        }

        logger.debug(`✅ Lead captured and welcome email sent: ${email}`)

        // Return success
        return res.status(200).json({
            success: true,
            message: 'Lead captured successfully',
            leadId: lead.id,
        })

    } catch (error: any) {
        logger.error('❌ Error capturing lead:', error)
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal server error',
        })
    }
}

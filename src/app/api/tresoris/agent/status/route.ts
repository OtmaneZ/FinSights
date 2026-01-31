/**
 * TRESORIS Agent Status API
 * GET /api/tresoris/agent/status
 * 
 * Retourne l'état complet de l'agent:
 * - running: boolean
 * - mode: idle | monitoring | analyzing | waiting_validation
 * - uptime, decisions, triggers
 * - logs récents
 */

import { NextResponse } from 'next/server'
import { getAgentStatus, getAgentLogs } from '@/lib/tresoris/agent-state'

export async function GET() {
    try {
        const status = getAgentStatus()
        const logs = getAgentLogs(30)
        
        return NextResponse.json({
            success: true,
            ...status,
            logs,
            timestamp: new Date().toISOString()
        })
        
    } catch (error) {
        console.error('Agent status error:', error)
        
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erreur récupération statut agent',
                running: false,
                mode: 'idle'
            },
            { status: 500 }
        )
    }
}

/**
 * TRESORIS Agent Start API
 * POST /api/tresoris/agent/start
 * 
 * Démarre l'agent en mode surveillance autonome.
 * L'agent commence à monitorer les métriques et peut auto-trigger des analyses.
 */

import { NextResponse } from 'next/server'
import { startAgent, getAgentStatus, addLog } from '@/lib/tresoris/agent-state'

export async function POST() {
    try {
        const result = startAgent()
        
        if (!result.success) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: result.message,
                    status: getAgentStatus()
                },
                { status: 400 }
            )
        }
        
        const status = getAgentStatus()
        
        return NextResponse.json({
            success: true,
            message: result.message,
            status,
            version: 'TRESORIS v2.0 - Demo'
        })
        
    } catch (error) {
        console.error('Agent start error:', error)
        addLog('error', 'Erreur au démarrage de l\'agent', { error: String(error) })
        
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erreur interne au démarrage de l\'agent' 
            },
            { status: 500 }
        )
    }
}

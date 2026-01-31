/**
 * TRESORIS Agent Stop API
 * POST /api/tresoris/agent/stop
 * 
 * Arrête l'agent autonome.
 * Passe en mode IDLE, stoppe la surveillance.
 */

import { NextResponse } from 'next/server'
import { stopAgent, getAgentStatus, addLog } from '@/lib/tresoris/agent-state'

export async function POST() {
    try {
        const result = stopAgent()
        
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
            status
        })
        
    } catch (error) {
        console.error('Agent stop error:', error)
        addLog('error', 'Erreur à l\'arrêt de l\'agent', { error: String(error) })
        
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erreur interne à l\'arrêt de l\'agent' 
            },
            { status: 500 }
        )
    }
}

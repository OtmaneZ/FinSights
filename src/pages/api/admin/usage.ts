import type { NextApiRequest, NextApiResponse } from 'next'

// Simple authentication avec password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme'

interface UsageStats {
    totalRequests: number
    activeIPs: number
    rateLimitHits: number
}

// Compteurs globaux (en mémoire - pour Redis en prod)
let stats: UsageStats = {
    totalRequests: 0,
    activeIPs: 0,
    rateLimitHits: 0
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Vérifier l'auth
    const authHeader = req.headers.authorization
    if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
        return res.status(401).json({
            success: false,
            error: 'Non autorisé'
        })
    }

    if (req.method === 'GET') {
        // Retourner les stats
        return res.status(200).json({
            success: true,
            stats
        })
    }

    return res.status(405).json({
        success: false,
        error: 'Méthode non autorisée'
    })
}

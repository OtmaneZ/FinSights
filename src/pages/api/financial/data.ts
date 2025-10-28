import type { NextApiRequest, NextApiResponse } from 'next'

// Mock financial data for development
const mockFinancialData = {
    metrics: [
        {
            id: 'revenue',
            name: 'Chiffre d\'Affaires',
            value: 1250000,
            currency: 'EUR',
            period: 'current',
            change: {
                value: 97500,
                percentage: 8.5,
                period: 'year-over-year'
            }
        },
        {
            id: 'cash',
            name: 'Trésorerie Nette',
            value: 245000,
            currency: 'EUR',
            period: 'current',
            change: {
                value: 26700,
                percentage: 12.3,
                period: 'month-over-month'
            }
        },
        {
            id: 'margin',
            name: 'Marge Brute',
            value: 42.8,
            currency: '%',
            period: 'current',
            change: {
                value: -2.3,
                percentage: -5.1,
                period: 'month-over-month'
            }
        }
    ],
    insights: [
        {
            id: '1',
            type: 'opportunity',
            severity: 'medium',
            title: 'Optimisation des délais de paiement',
            description: 'Les délais de paiement clients ont augmenté de 5 jours',
            impact: 'Impact sur la trésorerie: -45k€',
            recommendations: [
                'Relancer les clients en retard',
                'Proposer des conditions préférentielles pour paiement rapide',
                'Mettre en place un processus de suivi automatisé'
            ],
            createdAt: new Date()
        }
    ]
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json(mockFinancialData)
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
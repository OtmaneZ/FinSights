'use client'

import { useState, useEffect } from 'react'
import React from 'react';
import {
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import CashFlowChart from './charts/CashFlowChart';
import DSOClientChart from './charts/DSOClientChart';

interface KPI {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    description: string
}

export default function FinancialDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('current')
    const [kpis, setKpis] = useState<KPI[]>([])

    useEffect(() => {
        // Simulate loading KPIs
        const mockKPIs: KPI[] = [
            {
                title: 'Chiffre d\'Affaires',
                value: '1 250 000 €',
                change: '+8.5%',
                changeType: 'positive',
                description: 'vs même période N-1'
            },
            {
                title: 'Trésorerie Nette',
                value: '245 000 €',
                change: '+12.3%',
                changeType: 'positive',
                description: 'Position au jour J'
            },
            {
                title: 'Marge Brute',
                value: '42.8%',
                change: '-2.3pt',
                changeType: 'negative',
                description: 'vs mois précédent'
            },
            {
                title: 'DSO Clients',
                value: '47 jours',
                change: '+5j',
                changeType: 'negative',
                description: 'Délai moyen de paiement'
            },
            {
                title: 'EBITDA',
                value: '185 000 €',
                change: '+15.2%',
                changeType: 'positive',
                description: 'Marge opérationnelle'
            },
            {
                title: 'Charges Exploitation',
                value: '890 000 €',
                change: '+3.1%',
                changeType: 'neutral',
                description: 'Évolution maîtrisée'
            }
        ]
        setKpis(mockKPIs)
    }, [selectedPeriod])

    const getChangeColor = (type: KPI['changeType']) => {
        switch (type) {
            case 'positive': return 'text-green-600'
            case 'negative': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    const getChangeIcon = (type: KPI['changeType']) => {
        switch (type) {
            case 'positive': return '↗'
            case 'negative': return '↘'
            default: return '→'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header with Period Selector */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord Financier</h2>
                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="current">Période Actuelle</option>
                    <option value="monthly">Vue Mensuelle</option>
                    <option value="quarterly">Vue Trimestrielle</option>
                    <option value="yearly">Vue Annuelle</option>
                </select>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                            <span className={`text-sm font-medium ${getChangeColor(kpi.changeType)}`}>
                                {getChangeIcon(kpi.changeType)} {kpi.change}
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                        <p className="text-sm text-gray-500">{kpi.description}</p>
                    </div>
                ))}
            </div>

            {/* Quick Insights */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Insights IA du Jour</h3>
                <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <span className="text-green-600 font-bold">+</span>
                        <p className="text-gray-700">Votre chiffre d'affaires progresse de 8.5% grâce aux nouveaux contrats signés en septembre.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="text-red-600 font-bold">!</span>
                        <p className="text-gray-700">Attention : la marge brute diminue (-2.3pt) due à l'augmentation des coûts matières premières.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="text-orange-600 font-bold">⚠</span>
                        <p className="text-gray-700">Les délais de paiement clients s'allongent (+5j). Considérer une relance proactive.</p>
                    </div>
                </div>
            </div>

            {/* Cash Flow Projection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔮 Projection Trésorerie (90 jours)</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Aujourd'hui</p>
                        <p className="text-2xl font-bold text-gray-900">245k€</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Dans 30 jours</p>
                        <p className="text-2xl font-bold text-orange-600">198k€</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Dans 90 jours</p>
                        <p className="text-2xl font-bold text-green-600">285k€</p>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        📈 <strong>Prévision :</strong> Après une baisse temporaire due aux échéances de novembre,
                        votre trésorerie devrait rebondir grâce aux encaissements de fin d'année (+40k€ attendus).
                    </p>
                </div>
            </div>

            {/* Cash Flow Chart - NOUVELLE VISUALISATION */}
            <CashFlowChart />

            {/* DSO par Client - NOUVELLE VISUALISATION */}
            <DSOClientChart />
        </div>
    )
}
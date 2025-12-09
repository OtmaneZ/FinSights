'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, Activity } from 'lucide-react'

export default function DashboardPreview() {
    const [counters, setCounters] = useState({ revenue: 0, margin: 0, cash: 0 })
    const [chartProgress, setChartProgress] = useState(0)

    // Animate counters on mount
    useEffect(() => {
        const interval = setInterval(() => {
            setCounters(prev => ({
                revenue: Math.min(prev.revenue + 8000, 850000),  // 850k€ CA annuel (PME services B2B)
                margin: Math.min(prev.margin + 2, 72),           // 72/100 Score FinSight (niveau "good")
                cash: Math.min(prev.cash + 3000, 180000)         // 180k€ tréso (cohérent avec 850k CA)
            }))
            setChartProgress(prev => Math.min(prev + 2, 100))
        }, 30)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl -z-10" />

            {/* Main Dashboard Container */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-2xl transform perspective-1000 hover:scale-[1.02] transition-transform duration-500">

                {/* Top Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                </div>

                {/* Score Badge (Floating) */}
                <div className="absolute -top-4 -right-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-xl animate-float">
                    <div className="text-3xl font-bold text-white">{counters.margin}</div>
                    <div className="text-xs text-white/80 font-medium">Score FinSight™</div>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">

                    {/* Revenue Card */}
                    <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-xl rounded-2xl p-4 border border-blue-200/50 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs text-gray-600 font-medium">Chiffre d&apos;affaires</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {(counters.revenue / 1000).toFixed(0)}k€
                        </div>
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            +12% vs prev
                        </div>
                    </div>

                    {/* Margin Card */}
                    <div className="group bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-xl rounded-2xl p-4 border border-green-200/50 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs text-gray-600 font-medium">Marge nette</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            28%
                        </div>
                        <div className="text-xs text-green-600 mt-1">Objectif: 25%</div>
                    </div>

                    {/* Cash Card */}
                    <div className="col-span-2 bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-xl rounded-2xl p-4 border border-purple-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600 font-medium">Trésorerie disponible</span>
                            <span className="text-xs text-purple-600 font-semibold">Runway: 6 mois</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {(counters.cash / 1000).toFixed(0)}k€
                        </div>
                    </div>
                </div>

                {/* Professional Chart - Revenus vs Dépenses */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 border border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-700 font-semibold">Revenus vs Dépenses (6 mois)</div>
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-0.5 bg-green-500"></div>
                                <span className="text-gray-600">Revenus</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-0.5 bg-red-400"></div>
                                <span className="text-gray-600">Dépenses</span>
                            </div>
                        </div>
                    </div>

                    <svg viewBox="0 0 300 120" className="w-full h-28">
                        {/* Axes */}
                        <line x1="30" y1="10" x2="30" y2="95" stroke="#9ca3af" strokeWidth="1" opacity="0.5" />
                        <line x1="30" y1="95" x2="290" y2="95" stroke="#9ca3af" strokeWidth="1" opacity="0.5" />

                        {/* Grid lines horizontales */}
                        <line x1="30" y1="25" x2="290" y2="25" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
                        <line x1="30" y1="45" x2="290" y2="45" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
                        <line x1="30" y1="65" x2="290" y2="65" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
                        <line x1="30" y1="85" x2="290" y2="85" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />

                        {/* Y-axis labels */}
                        <text x="22" y="28" fontSize="8" fill="#6b7280" textAnchor="end">200k</text>
                        <text x="22" y="48" fontSize="8" fill="#6b7280" textAnchor="end">150k</text>
                        <text x="22" y="68" fontSize="8" fill="#6b7280" textAnchor="end">100k</text>
                        <text x="22" y="88" fontSize="8" fill="#6b7280" textAnchor="end">50k</text>

                        {/* X-axis labels (mois) */}
                        <text x="50" y="107" fontSize="8" fill="#6b7280" textAnchor="middle">Juil</text>
                        <text x="90" y="107" fontSize="8" fill="#6b7280" textAnchor="middle">Août</text>
                        <text x="130" y="107" fontSize="8" fill="#6b7280" textAnchor="middle">Sept</text>
                        <text x="170" y="107" fontSize="8" fill="#6b7280" textAnchor="middle">Oct</text>
                        <text x="210" y="107" fontSize="8" fill="#6b7280" textAnchor="middle">Nov</text>
                        <text x="250" y="107" fontSize="8" fill="#6b7280" textAnchor="middle">Déc</text>

                        {/* Ligne REVENUS (verte, volatile réaliste) */}
                        {chartProgress > 10 && (
                            <path
                                d="M 50 72 L 90 68 L 130 75 L 170 58 L 210 52 L 250 45"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="240"
                                strokeDashoffset={240 - (chartProgress * 2.4)}
                                className="transition-all duration-500"
                            />
                        )}

                        {/* Fill area revenus */}
                        {chartProgress > 50 && (
                            <path
                                d="M 50 72 L 90 68 L 130 75 L 170 58 L 210 52 L 250 45 L 250 95 L 50 95 Z"
                                fill="#10b981"
                                opacity="0.08"
                            />
                        )}

                        {/* Ligne DÉPENSES (rouge, plus stable) */}
                        {chartProgress > 10 && (
                            <path
                                d="M 50 82 L 90 80 L 130 81 L 170 78 L 210 79 L 250 77"
                                fill="none"
                                stroke="#f87171"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="240"
                                strokeDashoffset={240 - (chartProgress * 2.4)}
                                className="transition-all duration-500"
                            />
                        )}

                        {/* Data points REVENUS */}
                        {chartProgress > 20 && <circle cx="50" cy="72" r="2.5" fill="#10b981" className="drop-shadow-sm" />}
                        {chartProgress > 35 && <circle cx="90" cy="68" r="2.5" fill="#10b981" className="drop-shadow-sm" />}
                        {chartProgress > 50 && <circle cx="130" cy="75" r="2.5" fill="#10b981" className="drop-shadow-sm" />}
                        {chartProgress > 65 && <circle cx="170" cy="58" r="2.5" fill="#10b981" className="drop-shadow-sm" />}
                        {chartProgress > 80 && <circle cx="210" cy="52" r="2.5" fill="#10b981" className="drop-shadow-sm" />}
                        {chartProgress > 95 && (
                            <circle cx="250" cy="45" r="3.5" fill="#10b981" className="animate-pulse drop-shadow-lg" />
                        )}

                        {/* Data points DÉPENSES */}
                        {chartProgress > 20 && <circle cx="50" cy="82" r="2" fill="#f87171" opacity="0.8" />}
                        {chartProgress > 35 && <circle cx="90" cy="80" r="2" fill="#f87171" opacity="0.8" />}
                        {chartProgress > 50 && <circle cx="130" cy="81" r="2" fill="#f87171" opacity="0.8" />}
                        {chartProgress > 65 && <circle cx="170" cy="78" r="2" fill="#f87171" opacity="0.8" />}
                        {chartProgress > 80 && <circle cx="210" cy="79" r="2" fill="#f87171" opacity="0.8" />}
                        {chartProgress > 95 && <circle cx="250" cy="77" r="2.5" fill="#f87171" opacity="0.8" />}

                        {/* Tooltip dernier point (Décembre) */}
                        {chartProgress > 95 && (
                            <>
                                <rect x="255" y="38" width="38" height="18" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
                                <text x="274" y="48" fontSize="7" fill="#10b981" fontWeight="600" textAnchor="middle">156k€</text>
                            </>
                        )}
                    </svg>

                    {/* Stats en bas */}
                    {chartProgress > 95 && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-500">
                                Cash Flow Net: <span className="font-semibold text-green-600">+68k€</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Marge moyenne: <span className="font-semibold text-gray-700">28%</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

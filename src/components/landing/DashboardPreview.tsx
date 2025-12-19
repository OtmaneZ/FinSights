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
                revenue: Math.min(prev.revenue + 8000, 850000),  // 850k€ CA annuel
                margin: Math.min(prev.margin + 2, 72),           // 72 Score FinSight
                cash: Math.min(prev.cash + 3000, 140000)         // 140k€ tréso
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
                <div className="absolute -top-6 -right-6 px-5 py-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded-[2rem] shadow-xl animate-float flex flex-col items-center justify-center min-w-[110px] border-4 border-white">
                    <div className="text-4xl font-extrabold text-white leading-none mb-1">{counters.margin}</div>
                    <div className="text-[10px] text-white/90 font-bold tracking-wider uppercase">FINSIGHT™</div>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 gap-5 mb-6">

                    {/* Revenue Card */}
                    <div className="group bg-blue-50/80 backdrop-blur-xl rounded-2xl p-5 border border-blue-100 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                                <DollarSign className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm text-gray-600 font-semibold">CA annuel</span>
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-2">
                            {(counters.revenue / 1000).toFixed(0)}k€
                        </div>
                        <div className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-100/50 px-2 py-1 rounded-full w-fit">
                            <TrendingUp className="w-3 h-3" />
                            +15% vs N-1
                        </div>
                    </div>

                    {/* Margin Card */}
                    <div className="group bg-orange-50/80 backdrop-blur-xl rounded-2xl p-5 border border-orange-100 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm">
                                <Activity className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm text-gray-600 font-semibold">Marge</span>
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-2">
                            24%
                        </div>
                        <div className="text-xs text-orange-600 font-medium">Obj: 28%</div>
                    </div>

                    {/* Cash Card */}
                    <div className="col-span-2 bg-orange-50/50 backdrop-blur-xl rounded-2xl p-5 border border-orange-100/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 font-semibold">Trésorerie</span>
                            <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg shadow-sm">
                                2.5 mois runway
                            </span>
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900">
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
                                <rect x="255" y="38" width="32" height="16" rx="4" fill="#10b981" />
                                <text x="271" y="49" fontSize="9" fill="white" fontWeight="bold" textAnchor="middle">73k€</text>
                                
                                <rect x="255" y="70" width="32" height="16" rx="4" fill="#f87171" />
                                <text x="271" y="81" fontSize="9" fill="white" fontWeight="bold" textAnchor="middle">55k€</text>
                            </>
                        )}
                    </svg>

                    {/* Stats en bas */}
                    {chartProgress > 95 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="text-sm text-gray-600 font-medium">
                                Cash Flow: <span className="font-bold text-green-600">+18k€</span>
                            </div>
                            <div className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                Tendance: <span className="font-bold text-green-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +15%</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

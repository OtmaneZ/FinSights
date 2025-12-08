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
                    <div className="text-xs text-gray-400 font-mono">fin-sights.com/dashboard</div>
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

                {/* Mini Chart */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 border border-gray-200/50">
                    <div className="text-xs text-gray-600 font-medium mb-3">Cash Flow Evolution</div>
                    <svg viewBox="0 0 240 80" className="w-full h-20">
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="240" y2="20" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                        <line x1="0" y1="40" x2="240" y2="40" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                        <line x1="0" y1="60" x2="240" y2="60" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />

                        {/* Realistic Cash Flow with volatility (saisonnalité Q4) */}
                        <path
                            d="M 10 58 L 30 55 L 50 60 L 70 52 L 90 48 L 110 55 L 130 42 L 150 38 L 170 32 L 190 28 L 210 22 L 230 18"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="300"
                            strokeDashoffset={300 - (chartProgress * 3)}
                            className="transition-all duration-300"
                        />

                        {/* Fill area under curve */}
                        <path
                            d="M 10 58 L 30 55 L 50 60 L 70 52 L 90 48 L 110 55 L 130 42 L 150 38 L 170 32 L 190 28 L 210 22 L 230 18 L 230 70 L 10 70 Z"
                            fill="url(#gradient-fill)"
                            opacity={chartProgress > 50 ? "0.1" : "0"}
                            className="transition-all duration-500"
                        />

                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                            <linearGradient id="gradient-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#ffffff" />
                            </linearGradient>
                        </defs>

                        {/* Data points */}
                        {chartProgress > 20 && <circle cx="30" cy="55" r="2" fill="#3b82f6" opacity="0.6" />}
                        {chartProgress > 30 && <circle cx="50" cy="60" r="2" fill="#3b82f6" opacity="0.6" />}
                        {chartProgress > 40 && <circle cx="70" cy="52" r="2" fill="#6366f1" opacity="0.6" />}
                        {chartProgress > 50 && <circle cx="90" cy="48" r="2" fill="#6366f1" opacity="0.6" />}
                        {chartProgress > 60 && <circle cx="110" cy="55" r="2" fill="#8b5cf6" opacity="0.6" />}
                        {chartProgress > 70 && <circle cx="150" cy="38" r="2" fill="#8b5cf6" opacity="0.6" />}
                        {chartProgress > 80 && <circle cx="190" cy="28" r="2" fill="#8b5cf6" opacity="0.6" />}

                        {/* Animated Dot at end */}
                        {chartProgress > 95 && (
                            <circle
                                cx="230"
                                cy="18"
                                r="4"
                                fill="#8b5cf6"
                                className="animate-pulse"
                            />
                        )}
                    </svg>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { DollarSign, BarChart3, Shield, AlertTriangle } from 'lucide-react'

interface PillarScore {
    icon: typeof DollarSign
    label: string
    score: number
    max: number
    color: string
    bgColor: string
}

export default function AnimatedScoreDisplay() {
    const [animationStep, setAnimationStep] = useState(0)
    const [displayedScores, setDisplayedScores] = useState([0, 0, 0, 0])
    const [totalScore, setTotalScore] = useState(0)
    const [gaugeProgress, setGaugeProgress] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const componentRef = useRef<HTMLDivElement>(null)

    // Scores réels du dashboard (850k€ CA, 28% marge, 180k€ tréso, runway 6 mois)
    const pillars: PillarScore[] = useMemo(() => [
        { icon: DollarSign, label: 'Cash & Liquidité', score: 18, max: 25, color: 'text-accent-primary', bgColor: 'bg-blue-50' },
        { icon: BarChart3, label: 'Marges & Rentabilité', score: 20, max: 25, color: 'text-green-600', bgColor: 'bg-green-50' },
        { icon: Shield, label: 'Résilience', score: 19, max: 25, color: 'text-purple-600', bgColor: 'bg-purple-50' },
        { icon: AlertTriangle, label: 'Gestion Risques', score: 15, max: 25, color: 'text-orange-600', bgColor: 'bg-orange-50' }
    ], [])

    const animatePillar = useCallback((index: number) => {
        const targetScore = pillars[index].score
        let current = 0
        const increment = targetScore / 20 // 20 frames pour atteindre le score

        const interval = setInterval(() => {
            current += increment
            if (current >= targetScore) {
                current = targetScore
                clearInterval(interval)
            }
            setDisplayedScores(prev => {
                const newScores = [...prev]
                newScores[index] = Math.round(current)
                return newScores
            })
        }, 25)

        setAnimationStep(index + 1)
    }, [pillars])

    const calculateTotal = useCallback(() => {
        const total = pillars.reduce((sum, p) => sum + p.score, 0)
        let current = 0
        const increment = total / 20

        const interval = setInterval(() => {
            current += increment
            if (current >= total) {
                current = total
                clearInterval(interval)
            }
            setTotalScore(Math.round(current))
        }, 25)

        setAnimationStep(5)
    }, [pillars])

    const fillGauge = useCallback(() => {
        let progress = 0
        const targetProgress = 72 // Score final

        const interval = setInterval(() => {
            progress += 2
            if (progress >= targetProgress) {
                progress = targetProgress
                clearInterval(interval)
            }
            setGaugeProgress(progress)
        }, 25)

        setAnimationStep(6)
    }, [])

    const startAnimation = useCallback(() => {
        // Séquence d'animation
        const sequence = [
            // Étape 1-4 : Animer chaque pilier (0-4s)
            { delay: 500, action: () => animatePillar(0) },
            { delay: 1000, action: () => animatePillar(1) },
            { delay: 1500, action: () => animatePillar(2) },
            { delay: 2000, action: () => animatePillar(3) },
            // Étape 5 : Calculer le total (4.5s)
            { delay: 2500, action: () => calculateTotal() },
            // Étape 6 : Remplir la jauge (5s)
            { delay: 3000, action: () => fillGauge() }
        ]

        sequence.forEach(({ delay, action }) => {
            setTimeout(action, delay)
        })
    }, [animatePillar, calculateTotal, fillGauge])

    useEffect(() => {
        // Capture la référence dans une variable locale pour le cleanup
        const currentRef = componentRef.current
        
        // Intersection Observer pour détecter quand le composant est visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true)
                        startAnimation()
                    }
                })
            },
            { threshold: 0.3 } // Démarre quand 30% du composant est visible
        )

        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [hasAnimated, startAnimation])

    // Couleur de la jauge selon le score
    const getGaugeColor = (score: number) => {
        if (score >= 80) return { stroke: '#10b981', bg: '#d1fae5' } // green
        if (score >= 60) return { stroke: '#3b82f6', bg: '#dbeafe' } // blue
        if (score >= 40) return { stroke: '#f59e0b', bg: '#fef3c7' } // orange
        return { stroke: '#ef4444', bg: '#fee2e2' } // red
    }

    const gaugeColors = getGaugeColor(gaugeProgress)

    return (
        <div ref={componentRef} className="max-w-6xl mx-auto">
            {/* 4 Piliers avec animation séquentielle */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {pillars.map((pillar, idx) => {
                    const Icon = pillar.icon
                    const isAnimating = animationStep === idx + 1
                    const hasAnimated = animationStep > idx

                    return (
                        <div
                            key={idx}
                            className={`bg-white rounded-xl p-8 border border-gray-200 transition-all duration-500 ${isAnimating ? 'ring-2 ring-blue-400 shadow-xl scale-105' : ''
                                } ${hasAnimated ? 'shadow-lg' : 'opacity-60'}`}
                        >
                            <div className={`w-12 h-12 ${pillar.bgColor} rounded-lg flex items-center justify-center mb-4 transition-all ${isAnimating ? 'scale-110' : ''
                                }`}>
                                <Icon className={`w-6 h-6 ${pillar.color}`} />
                            </div>

                            {/* Score animé */}
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className={`text-4xl font-bold text-gray-900 transition-all duration-300 ${isAnimating ? 'scale-110' : ''
                                    }`}>
                                    {displayedScores[idx]}
                                </span>
                                <span className="text-xl text-gray-400 font-medium">/{pillar.max}</span>
                            </div>

                            <div className="text-sm text-gray-600 font-medium leading-snug">
                                {pillar.label}
                            </div>

                            {/* Barre de progression */}
                            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${pillar.bgColor.replace('bg-', 'bg-opacity-100 bg-')} transition-all duration-500`}
                                    style={{ width: `${(displayedScores[idx] / pillar.max) * 100}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Score Total avec Jauge Circulaire */}
            <div className="flex justify-center">
                <div className="relative">
                    {/* Particules subtiles (effet Stripe) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-3xl blur-3xl animate-pulse" />

                    <div className="relative inline-flex items-center gap-10 px-12 py-10 bg-white border-2 border-blue-200 rounded-2xl shadow-xl">
                        {/* Jauge circulaire SVG */}
                        <div className="relative">
                            <svg width="140" height="140" className="transform -rotate-90">
                                {/* Background circle */}
                                <circle
                                    cx="70"
                                    cy="70"
                                    r="60"
                                    fill="none"
                                    stroke={gaugeColors.bg}
                                    strokeWidth="12"
                                />
                                {/* Progress circle */}
                                <circle
                                    cx="70"
                                    cy="70"
                                    r="60"
                                    fill="none"
                                    stroke={gaugeColors.stroke}
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 60}`}
                                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - gaugeProgress / 100)}`}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>

                            {/* Score au centre */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-5xl font-bold" style={{ color: gaugeColors.stroke }}>
                                        {gaugeProgress}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium mt-1">/100</div>
                                </div>
                            </div>
                        </div>

                        {/* Informations texte */}
                        <div className="text-left border-l-2 border-gray-200 pl-8">
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                                SCORE FINSIGHT™
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-2">
                                {gaugeProgress >= 60 ? 'Santé financière correcte' : 'Attention requise'}
                            </div>
                            <div className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${gaugeProgress >= 80 ? 'bg-green-50 text-green-600' :
                                gaugeProgress >= 60 ? 'bg-blue-50 text-accent-primary' :
                                    gaugeProgress >= 40 ? 'bg-orange-50 text-orange-600' :
                                        'bg-red-50 text-red-600'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${gaugeProgress >= 80 ? 'bg-green-500' :
                                    gaugeProgress >= 60 ? 'bg-blue-500' :
                                        gaugeProgress >= 40 ? 'bg-orange-500' :
                                            'bg-red-500'
                                    }`} />
                                <span className="font-semibold">
                                    {gaugeProgress >= 80 ? 'Zone verte (80-100)' :
                                        gaugeProgress >= 60 ? 'Zone bleue (60-80)' :
                                            gaugeProgress >= 40 ? 'Zone orange (40-60)' :
                                                'Zone rouge (0-40)'}
                                </span>
                            </div>

                            {/* Lien vers dashboard */}
                            <div className="mt-4 text-xs text-gray-500">
                                Basé sur votre tableau de bord ci-dessus
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
    id: number
    title: string
    description: string
    image: string
    badge: string
}

const slides: Slide[] = [
    {
        id: 1,
        title: 'Dashboard KPIs en Temps Réel',
        description: '15+ KPIs calculés automatiquement avec benchmarks sectoriels visuels',
        image: '/images/carousel/img1.png',
        badge: '📊 Analytics'
    },
    {
        id: 2,
        title: 'AI Copilot GPT-4',
        description: 'Posez vos questions financières en langage naturel, obtenez des insights experts',
        image: '/images/carousel/img2.png',
        badge: '🤖 IA'
    },
    {
        id: 3,
        title: 'Simulation What-If',
        description: 'Simulez des scénarios (réduction charges, accélération paiements) en temps réel',
        image: '/images/carousel/img3.png',
        badge: '🔮 Prédiction'
    },
    {
        id: 4,
        title: 'Visualisations Avancées D3.js',
        description: 'Charts interactifs (Sankey flows, Sunburst hiérarchique) pour analyses approfondies',
        image: '/images/carousel/img4.png',
        badge: '📈 Dataviz'
    },
    {
        id: 5,
        title: 'Détection d\'Anomalies ML',
        description: 'Machine Learning détecte automatiquement les risques et anomalies financières',
        image: '/images/carousel/img5.png',
        badge: '🚨 ML'
    },
    {
        id: 6,
        title: 'Collaboration Temps Réel',
        description: 'Travaillez en équipe simultanément avec curseurs et présence en direct (Pusher)',
        image: '/images/carousel/img6.png',
        badge: '👥 Team'
    },
    {
        id: 7,
        title: 'Export PDF & Excel',
        description: 'Générez des rapports financiers professionnels en 1 clic (PDF avec charts + Excel)',
        image: '/images/carousel/img7.png',
        badge: '📤 Export'
    }
]

export default function FeaturesCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Auto-scroll every 5 seconds
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
        setIsAutoPlaying(false)
    }

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        setIsAutoPlaying(false)
    }

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsAutoPlaying(false)
    }

    const slide = slides[currentSlide]

    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    Fonctionnalités Clés
                </h2>
                <p className="text-xl text-text-secondary">
                    Découvrez tout ce que FinSight peut faire pour votre analyse financière
                </p>
            </div>

            <div className="relative">
                {/* Main Carousel Container */}
                <div className="surface rounded-2xl overflow-hidden border border-border-subtle">
                    {/* Slide Content */}
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Left: Image */}
                        <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-surface-elevated to-bg-secondary overflow-hidden">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Right: Text Content */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-gold-subtle border border-accent-gold-border rounded-full mb-6 w-fit">
                                <span className="text-accent-gold text-sm font-medium">{slide.badge}</span>
                            </div>

                            <h3 className="text-3xl md:text-4xl font-bold mb-4">
                                {slide.title}
                            </h3>

                            <p className="text-lg text-text-secondary mb-8">
                                {slide.description}
                            </p>

                            {/* Slide Progress */}
                            <div className="flex items-center gap-2 text-sm text-text-tertiary">
                                <span className="font-mono">{String(currentSlide + 1).padStart(2, '0')}</span>
                                <div className="flex-1 h-1 bg-border-subtle rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent-gold transition-all duration-300"
                                        style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                                    />
                                </div>
                                <span className="font-mono">{String(slides.length).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-elevated border border-border-subtle hover:border-accent-gold hover:bg-accent-gold-subtle transition-all flex items-center justify-center group"
                    aria-label="Slide précédent"
                >
                    <ChevronLeft className="w-6 h-6 text-text-secondary group-hover:text-accent-gold" />
                </button>

                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-elevated border border-border-subtle hover:border-accent-gold hover:bg-accent-gold-subtle transition-all flex items-center justify-center group"
                    aria-label="Slide suivant"
                >
                    <ChevronRight className="w-6 h-6 text-text-secondary group-hover:text-accent-gold" />
                </button>

                {/* Dots Navigation */}
                <div className="flex justify-center gap-2 mt-8">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${index === currentSlide
                                ? 'w-8 bg-accent-gold'
                                : 'w-2 bg-border-subtle hover:bg-border-default'
                                }`}
                            aria-label={`Aller au slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Auto-play indicator */}
                {isAutoPlaying && (
                    <div className="text-center mt-4">
                        <span className="text-xs text-text-tertiary">
                            ⏱️ Défilement automatique actif
                        </span>
                    </div>
                )}
            </div>
        </section>
    )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Zap } from 'lucide-react'

interface BlogCTAProps {
    variant?: 'consultation' | 'platform'
    className?: string
}

export default function BlogCTA({ variant = 'platform', className = '' }: BlogCTAProps) {
    if (variant === 'consultation') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`my-12 rounded-2xl bg-gradient-to-br from-accent-primary to-blue-700 p-8 text-white shadow-xl ${className}`}
            >
                <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <Calendar className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-2 text-2xl font-bold">
                            Besoin d'un regard expert sur votre situation financière ?
                        </h3>
                        <p className="mb-4 text-lg text-white/90">
                            Réservez une consultation gratuite de 30 minutes avec un DAF expérimenté. 
                            Audit express, recommandations actionnables, sans engagement.
                        </p>
                        <a
                            href="https://calendly.com/zineinsight/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-accent-primary transition-all hover:scale-105 hover:shadow-lg"
                        >
                            Réserver ma consultation gratuite
                            <ArrowRight className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </motion.div>
        )
    }

    // Variant 'platform' (default)
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`my-12 rounded-2xl border-2 border-accent-primary/20 bg-gradient-to-br from-blue-50 to-white p-8 shadow-xl ${className}`}
        >
            <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-blue-600 text-white">
                        <Zap className="h-7 w-7" />
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="mb-2 text-2xl font-bold text-text-primary">
                        Automatisez votre pilotage financier avec FinSight
                    </h3>
                    <p className="mb-4 text-lg text-text-secondary">
                        Score FinSight™ 0-100, 4 agents IA spécialisés, dashboard interactif. 
                        Obtenez une vision claire de votre santé financière en moins de 5 minutes.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/demo"
                            className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                        >
                            Essayer gratuitement
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/agents"
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-accent-primary px-6 py-3 font-semibold text-accent-primary transition-all hover:bg-accent-primary/5"
                        >
                            Découvrir les agents IA
                        </Link>
                    </div>
                </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6 text-sm text-text-secondary">
                <span className="flex items-center gap-2">
                    ✓ Essai gratuit 14 jours
                </span>
                <span className="flex items-center gap-2">
                    ✓ Sans carte bancaire
                </span>
                <span className="flex items-center gap-2">
                    ✓ Installation en 5 minutes
                </span>
            </div>
        </motion.div>
    )
}

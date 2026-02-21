'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Zap, Shield } from 'lucide-react'

interface BlogCTAProps {
    variant?: 'consultation' | 'platform' | 'daf'
    className?: string
}

export default function BlogCTA({ variant = 'platform', className = '' }: BlogCTAProps) {
    // Variant 'daf' — Transition cabinet structurée
    if (variant === 'daf') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`my-12 rounded-xl bg-slate-50 border border-slate-200 p-8 ${className}`}
            >
                <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 font-serif">
                            Ce que révèle cette analyse
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Transition vers un accompagnement structuré
                        </p>
                    </div>
                </div>
                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                        <span className="text-sm font-bold text-slate-400 mt-0.5 w-4 flex-shrink-0">1.</span>
                        <div>
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Priorité immédiate</span>
                            <p className="text-slate-700 mt-1 text-sm">Identifier les indicateurs en écart par rapport aux médianes sectorielles et quantifier l&apos;impact cash.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-sm font-bold text-slate-400 mt-0.5 w-4 flex-shrink-0">2.</span>
                        <div>
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Risque structurel</span>
                            <p className="text-slate-700 mt-1 text-sm">Un pilotage financier sans lecture croisée des indicateurs masque les vulnérabilités structurelles.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-sm font-bold text-slate-400 mt-0.5 w-4 flex-shrink-0">3.</span>
                        <div>
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Arbitrage à court terme</span>
                            <p className="text-slate-700 mt-1 text-sm">Avant tout investissement en outils, structurer la méthodologie de pilotage. L&apos;outil vient après.</p>
                        </div>
                    </div>
                </div>
                <div className="pt-6 border-t border-slate-200">
                    <p className="text-slate-500 text-sm mb-4">
                        Pour transformer ce diagnostic en plan d&apos;action priorisé :
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="https://calendly.com/zineinsight/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white text-sm transition-all hover:bg-slate-800"
                        >
                            Réserver un échange stratégique
                            <ArrowRight className="h-4 w-4" />
                        </a>
                        <Link
                            href="/diagnostic/guide"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 text-sm transition-all hover:border-slate-400"
                        >
                            Lancer le diagnostic
                        </Link>
                    </div>
                </div>
            </motion.div>
        )
    }

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

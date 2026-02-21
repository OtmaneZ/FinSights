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
                        Vous vous reconnaissez dans cette situation ?
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="https://calendly.com/zineinsight/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white text-sm transition-all hover:bg-slate-800"
                        >
                            Identifier mes leviers financiers
                            <ArrowRight className="h-4 w-4" />
                        </a>
                        <Link
                            href="/diagnostic/guide"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 text-sm transition-all hover:border-slate-400"
                        >
                            Lancer mon diagnostic
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
                className={`my-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl ${className}`}
            >
                <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                            <Shield className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-2 text-2xl font-bold font-serif">
                            Votre structure financière est-elle réellement optimisée ?
                        </h3>
                        <p className="mb-4 text-lg text-white/80">
                            Un échange confidentiel pour identifier vos fuites de cash,
                            vos marges réelles par activité et les arbitrages à court terme.
                        </p>
                        <a
                            href="https://calendly.com/zineinsight/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 transition-all hover:bg-slate-100"
                        >
                            Identifier mes leviers financiers
                            <ArrowRight className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </motion.div>
        )
    }

    // Variant 'platform' (default) — Orienté diagnostic dirigeant
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`my-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg ${className}`}
        >
            <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <Zap className="h-7 w-7" />
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="mb-2 text-2xl font-bold text-text-primary font-serif">
                        Perdez-vous de l&apos;argent sans le voir ?
                    </h3>
                    <p className="mb-4 text-lg text-text-secondary">
                        DSO au-dessus de la médiane, BFR qui dérive, marges qui s&apos;érodent — 
                        le diagnostic FinSight identifie vos fuites de cash en 5 minutes.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/diagnostic/guide"
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-800"
                        >
                            Lancer mon diagnostic
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <a
                            href="https://calendly.com/zineinsight/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-all hover:border-slate-400"
                        >
                            Échanger sur ma situation
                        </a>
                    </div>
                </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6 text-sm text-text-secondary">
                <span className="flex items-center gap-2">
                    ✓ Confidentiel
                </span>
                <span className="flex items-center gap-2">
                    ✓ Sans engagement
                </span>
                <span className="flex items-center gap-2">
                    ✓ Résultats immédiats
                </span>
            </div>
        </motion.div>
    )
}

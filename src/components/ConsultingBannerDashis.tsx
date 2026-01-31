/**
 * CONSULTING BANNER - DASHIS
 * 
 * CTA final style McKinsey pour engager l'utilisateur
 * Inspiré de /agents avec ton professionnel
 */

'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Linkedin } from 'lucide-react'
import '@/styles/premium-transitions.css'

export default function ConsultingBannerDashis() {
    return (
        <section className="py-16 bg-white dark:bg-slate-900 border-t border-border-subtle">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                            💼 Consulting CFO & Stratégie
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Besoin d'aller plus loin ?
                    </h2>
                    
                    {/* Description */}
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Transformez ces insights en actions concrètes. Discutons de votre trajectoire de croissance 
                        et des leviers stratégiques à activer pour accélérer.
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            +50
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            PME accompagnées
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            12 ans
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Expérience finance
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            24h
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Délai de réponse
                        </div>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="https://calendly.com/zineinsight"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="premium-button inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover shadow-lg shadow-accent-primary/25"
                    >
                        <Calendar className="premium-icon w-5 h-5" />
                        Réserver un échange
                        <ArrowRight className="premium-icon w-5 h-5" />
                    </Link>
                    
                    <a
                        href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="premium-button inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                        <Linkedin className="premium-icon w-5 h-5" />
                        Me contacter sur LinkedIn
                    </a>
                </div>

                {/* Value propositions */}
                <div className="grid sm:grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">
                            Audit financier express
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Diagnostic complet en 48h avec plan d'action chiffré
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">
                            Stratégie de croissance
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Modélisation financière et roadmap levée de fonds
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">
                            CFO fractionnaire
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Direction financière à temps partagé pour scale-ups
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

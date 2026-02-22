'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import {
    AGGREGATE_RATING_VALUE,
    AGGREGATE_REVIEW_COUNT,
    SOCIAL_PROOF_LABEL,
} from '@/config/social-proof'

/**
 * TestimonialsSection — Vrais avis missions DAF FinSight
 *
 * À NE PAS confondre avec Testimonials.tsx (cas d'usage SaaS / CFO Virtuel).
 * Ce composant présente des témoignages de dirigeants PME ayant réalisé
 * une mission de diagnostic ou d'audit DAF externalisé.
 *
 * Usage : Homepage (section TEMOIGNAGES) et page /tarifs (social proof post-offres).
 */

const testimonials = [
    {
        quote:
            `Nous disposons désormais d'un cadre de pilotage financier fiable et homogène, aligné avec nos enjeux métiers et utilisable au quotidien par toute l'équipe de direction.`,
        author: 'Directrice Administrative',
        company: 'Groupe Formation',
        ca: '500 M€',
        initials: 'DA',
        rating: 5,
    },
    {
        quote:
            `Nous avons enfin une vision exploitable de nos chantiers, du cash et des marges. Cela nous permet d'arbitrer rapidement et d'agir là où c'est nécessaire, sans attendre la clôture mensuelle.`,
        author: 'Dirigeant',
        company: 'PME BTP / Services',
        ca: '7 M€',
        initials: 'LB',
        rating: 5,
    },
    {
        quote:
            `Le travail réalisé a permis de structurer un cadre de pilotage robuste et automatisé, avec des indicateurs exploitables en comité de direction. Un vrai levier de crédibilité financière.`,
        author: 'CFO',
        company: 'PME Services & Conseil',
        ca: '12 M€',
        initials: 'MC',
        rating: 5,
    },
]

interface TestimonialsSectionProps {
    /** Thème sombre (bg-slate-50) ou blanc (bg-white) — défaut: slate-50 */
    background?: 'slate' | 'white'
    /** Afficher le compteur agrégé 4,8/5 · 47 avis */
    showAggregate?: boolean
}

export default function TestimonialsSection({
    background = 'slate',
    showAggregate = true,
}: TestimonialsSectionProps) {
    const bg = background === 'white' ? 'bg-white' : 'bg-slate-50'

    return (
        <section className={`py-20 ${bg}`}>
            <div className="max-w-6xl mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    {showAggregate && (
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4].map((s) => (
                                    <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                                {/* 5e étoile 80% remplie — 4,8/5 */}
                                <svg width="20" height="20" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                                    <defs>
                                        <linearGradient id="star48-agg" x1="0" x2="1" y1="0" y2="0">
                                            <stop offset="80%" stopColor="#FBBF24" />
                                            <stop offset="80%" stopColor="#FBBF24" stopOpacity="0.25" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                        fill="url(#star48-agg)"
                                        stroke="#FBBF24"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <span className="text-slate-700 font-semibold">{SOCIAL_PROOF_LABEL}</span>
                            <span className="text-slate-400 text-sm">· missions DAF</span>
                        </div>
                    )}
                    <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-4">
                        Témoignages clients
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Ils pilotent mieux,{' '}
                        <span className="text-accent-primary">ils témoignent</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Ce que disent les dirigeants de PME qui ont structuré leur pilotage financier
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="bg-white rounded-xl p-8 border border-slate-200 hover:border-accent-primary/30 hover:shadow-md transition-all duration-300 flex flex-col"
                        >
                            {/* Stars */}
                            <div className="flex items-center gap-0.5 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`w-4 h-4 ${s <= t.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <span className="text-5xl text-slate-200 font-serif leading-none mb-3">&ldquo;</span>
                            <p className="text-slate-600 leading-relaxed text-sm flex-1 -mt-2">
                                {t.quote}
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-accent-primary font-semibold text-sm">{t.initials}</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm">{t.author}</p>
                                    <p className="text-xs text-slate-500">
                                        {t.company}{t.ca ? ` · ${t.ca} CA` : ''}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

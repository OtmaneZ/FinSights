'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight, CheckCircle, Shield, Star, TrendingUp, Target, Clock, Lock } from 'lucide-react'
import { SOCIAL_PROOF_LABEL, AGGREGATE_REVIEW_COUNT } from '@/config/social-proof'

// ---------------------------------------------------------------------------
// Before / After score data for the visual
// ---------------------------------------------------------------------------
const PILLARS = [
    { label: 'CASH', before: 42, after: 78, color: 'bg-blue-500' },
    { label: 'MARGIN', before: 65, after: 82, color: 'bg-emerald-500' },
    { label: 'RÉSILIENCE', before: 38, after: 71, color: 'bg-amber-500' },
    { label: 'RISQUE', before: 55, after: 80, color: 'bg-purple-500' },
]

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
const TESTIMONIALS = [
    {
        quote: "Le diagnostic a mis le doigt sur 180 k\u20AC de cash immobilis\u00E9 dans nos cr\u00E9ances. R\u00E9sultat en 7 minutes, sans fioriture. Exactement ce qu\u2019on attendait d\u2019un outil DAF.",
        author: 'Jean D.',
        role: 'CEO, PME distribution — 8 M€ CA',
        rating: 5,
        before: 44,
        after: 79,
    },
    {
        quote: "Enfin un outil qui positionne nos ratios par rapport aux vrais benchmarks sectoriels. Le Score R\u00C9SILIENCE a identifi\u00E9 notre endettement trop \u00E9lev\u00E9 bien avant notre banquier.",
        author: 'Directrice Administrative',
        role: 'PME industrie — 12 M€ CA',
        rating: 5,
        before: 51,
        after: 83,
    },
    {
        quote: "J\u2019utilisais Excel depuis 10 ans. FinSight m\u2019a montr\u00E9 en 7 minutes que mon BFR repr\u00E9sentait 94 jours de CA \u2014 un signal que je n\u2019avais jamais formalis\u00E9.",
        author: 'Directeur Général',
        role: 'PME services B2B — 5 M€ CA',
        rating: 5,
        before: 38,
        after: 74,
    },
]

// ---------------------------------------------------------------------------
// What the tool analyzes
// ---------------------------------------------------------------------------
const PILLAR_DETAILS = [
    {
        key: 'CASH',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        title: 'Pilier CASH — Liquidité & Trésorerie',
        indicators: ['DSO (délai de paiement clients)', 'BFR en jours de CA', 'Couverture de trésorerie'],
        insight: 'Identifie le cash immobilisé et les risques de tension à 90 jours.',
    },
    {
        key: 'MARGIN',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        title: 'Pilier MARGIN — Rentabilité',
        indicators: ['Taux de marge brute', 'EBITDA margin', 'Seuil de rentabilité'],
        insight: 'Mesure la capacité bénéficiaire réelle et la distance au point mort.',
    },
    {
        key: 'RÉSILIENCE',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        title: 'Pilier RÉSILIENCE — Solidité Financière',
        indicators: ["Ratio d\u2019endettement (dette/EBITDA)", "Couverture des int\u00E9r\u00EAts", "Capacit\u00E9 de remboursement"],
        insight: 'Évalue la robustesse face aux chocs de marché et aux hausses de taux.',
    },
    {
        key: 'RISQUE',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        title: 'Pilier RISQUE — Exposition',
        indicators: ['Concentration clients (top 3)', 'Volatilité du CA', 'Score risque global'],
        insight: 'Quantifie la dépendance aux clients stratégiques et la fragilité commerciale.',
    },
]

export default function AnalysePredictivePage() {
    return (
        <>
            <Header />

            <main>
                {/* ── HERO ── */}
                <section className="bg-slate-950 text-white pt-24 pb-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <div className="text-center">
                            <p className="text-[11px] text-gray-500 font-semibold tracking-[0.2em] uppercase mb-6">
                                Analyse Financière Prédictive · Avis &amp; Test
                            </p>
                            <h1 className="font-serif text-4xl lg:text-5xl font-medium leading-tight tracking-tight text-white mb-6 max-w-3xl mx-auto">
                                FinSight Advanced — le diagnostic financier PME en 7 minutes
                            </h1>
                            <p className="text-lg text-gray-400 leading-relaxed mb-4 max-w-2xl mx-auto">
                                Score FinSight™ de 0 à 100, 4 piliers, benchmarks sectoriels réels (Banque de France 2024).
                                Un avis honnête sur ce que l'outil fait — et ce qu'il ne fait pas.
                            </p>

                            {/* Trust bar */}
                            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10" aria-label="Signaux de confiance">
                                <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                    <Shield className="w-3.5 h-3.5 text-gray-600" aria-hidden="true" />
                                    Banque de France 2024
                                </span>
                                <span className="w-px h-3 bg-gray-800" aria-hidden="true" />
                                <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                    <CheckCircle className="w-3.5 h-3.5 text-gray-600" aria-hidden="true" />
                                    Altares / INSEE
                                </span>
                                <span className="w-px h-3 bg-gray-800" aria-hidden="true" />
                                <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                    <Lock className="w-3.5 h-3.5 text-gray-600" aria-hidden="true" />
                                    RGPD — 0 donnée transmise
                                </span>
                                <span className="w-px h-3 bg-gray-800" aria-hidden="true" />
                                <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                                    {SOCIAL_PROOF_LABEL}
                                </span>
                            </div>

                            <Link
                                href="/diagnostic/guide"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950 transition-all shadow-lg shadow-white/10"
                                aria-label="Démarrer le diagnostic financier FinSight Advanced"
                            >
                                Démarrer le diagnostic gratuit
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Link>
                            <p className="text-[11px] text-gray-600 mt-3">~7 min · Données locales · Sans inscription</p>
                        </div>
                    </div>
                </section>

                {/* ── WHAT IS IT ── */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
                            Qu'est-ce que FinSight Advanced ?
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg mb-6 text-center max-w-3xl mx-auto">
                            FinSight Advanced est un protocole de <strong>diagnostic financier prédictif</strong> conçu
                            pour les dirigeants de PME (2–20 M€ de CA). En 7 minutes, il génère un{' '}
                            <strong>Score FinSight™ de 0 à 100</strong> en analysant 9 indicateurs financiers sur
                            4 piliers, comparés aux médianes sectorielles réelles.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: <Clock className="w-5 h-5" />, title: '7 minutes', desc: 'Pour un diagnostic complet — pas une simplification.' },
                                { icon: <TrendingUp className="w-5 h-5" />, title: '4 piliers', desc: 'CASH, MARGIN, RÉSILIENCE, RISQUE — les fondamentaux du PCG.' },
                                { icon: <Target className="w-5 h-5" />, title: 'Benchmark réel', desc: "M\u00E9dianes Banque de France 2024 par secteur d\u2019activit\u00E9." },
                            ].map((item) => (
                                <div key={item.title} className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center mx-auto mb-3 text-white">
                                        {item.icon}
                                    </div>
                                    <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                                    <p className="text-sm text-slate-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── BEFORE / AFTER SCORE VISUAL ── */}
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
                            Score FinSight™ — avant / après optimisation
                        </h2>
                        <p className="text-slate-600 text-center mb-10">
                            Exemple réel : PME distribution 8 M€, 90 jours d'accompagnement DAF externalisé.
                        </p>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
                            {PILLARS.map((p) => (
                                <div key={p.label}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-slate-700">{p.label}</span>
                                        <span className="text-xs text-slate-500">{p.before} → <strong className="text-slate-900">{p.after}</strong> / 100</span>
                                    </div>
                                    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                                        {/* before */}
                                        <div
                                            className="absolute inset-y-0 left-0 bg-slate-300 rounded-full"
                                            style={{ width: `${p.before}%` }}
                                            aria-hidden="true"
                                        />
                                        {/* after */}
                                        <div
                                            className={`absolute inset-y-0 left-0 ${p.color} rounded-full opacity-80 transition-all`}
                                            style={{ width: `${p.after}%` }}
                                            role="progressbar"
                                            aria-valuenow={p.after}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label={`${p.label} — score après : ${p.after}/100`}
                                        />
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-slate-400 text-right">Gris = avant · Couleur = après 90 jours DAF externalisé</p>
                        </div>
                    </div>
                </section>

                {/* ── 4 PILLARS DETAIL ── */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
                            Ce que l'outil analyse — les 4 piliers
                        </h2>
                        <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
                            Chaque pilier regroupe 2 à 3 indicateurs clés, positionnés face aux médianes sectorielles réelles.
                            La{' '}
                            <Link href="/methodologie" className="text-blue-600 hover:underline">
                                méthodologie complète
                            </Link>{' '}
                            est publique et transparente.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            {PILLAR_DETAILS.map((pillar) => (
                                <div
                                    key={pillar.key}
                                    className={`p-6 rounded-xl border ${pillar.border} ${pillar.bg}`}
                                >
                                    <p className={`text-xs font-bold uppercase tracking-wide ${pillar.color} mb-3`}>{pillar.key}</p>
                                    <p className="font-semibold text-slate-900 mb-3">{pillar.title}</p>
                                    <ul className="space-y-1.5 mb-4">
                                        {pillar.indicators.map((ind) => (
                                            <li key={ind} className="flex items-center gap-2 text-sm text-slate-700">
                                                <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${pillar.color}`} aria-hidden="true" />
                                                {ind}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-xs text-slate-500 italic">{pillar.insight}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── TESTIMONIALS / AVIS ── */}
                <section className="py-16 bg-slate-50" aria-labelledby="avis-heading">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <h2 id="avis-heading" className="text-3xl font-bold text-slate-900 mb-3 text-center">
                            Avis utilisateurs
                        </h2>
                        <p className="text-slate-600 text-center mb-10">
                            Ce que les dirigeants disent après avoir utilisé FinSight Advanced.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {TESTIMONIALS.map((t, i) => (
                                <blockquote
                                    key={i}
                                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col"
                                >
                                    <div className="flex gap-0.5 mb-4" aria-label={`Note : ${t.rating}/5`}>
                                        {Array.from({ length: t.rating }).map((_, j) => (
                                            <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                                        ))}
                                    </div>
                                    <p className="text-slate-700 text-sm leading-relaxed mb-4 flex-1">&ldquo;{t.quote}&rdquo;</p>
                                    <footer>
                                        <p className="font-semibold text-slate-900 text-sm">{t.author}</p>
                                        <p className="text-xs text-slate-500">{t.role}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Score : {t.before} → <strong className="text-slate-700">{t.after}</strong> / 100
                                        </p>
                                    </footer>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── HONEST REVIEW — what it does NOT do ── */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
                            Avis honnête — ce que FinSight Advanced ne fait pas
                        </h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Remplace un expert-comptable', no: true, note: "Il identifie les signaux d\u2019alerte \u2014 l\u2019interpr\u00E9tation approfondie reste humaine." },
                                { label: 'Analyse vos pièces comptables', no: true, note: 'Vous saisissez 9 chiffres clés — pas de connexion à votre logiciel comptable.' },
                                { label: 'Transmet vos données', no: true, note: 'Tout reste dans votre navigateur. Aucun serveur ne stocke vos données.' },
                                { label: 'Positionne vos ratios face à votre secteur', no: false, note: '7 secteurs disponibles avec médianes Banque de France 2024.' },
                                { label: 'Identifie les 2–3 leviers prioritaires', no: false, note: 'Chaque pilier génère une recommandation actionnable.' },
                                { label: 'Génère un score global sur 100', no: false, note: 'Score FinSight™ pondéré selon les 4 piliers du PCG.' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.no ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`} aria-hidden="true">
                                        {item.no ? '✕' : '✓'}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="py-16 bg-slate-950 text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
                        <p className="text-[11px] text-gray-500 font-semibold tracking-[0.2em] uppercase mb-4">
                            Protocole de diagnostic
                        </p>
                        <h2 className="font-serif text-3xl font-medium leading-tight text-white mb-4">
                            Votre Score FinSight™ en 7 minutes
                        </h2>
                        <p className="text-gray-400 mb-8">
                            9 indicateurs · 4 piliers · Benchmarks sectoriels réels · 0 donnée transmise
                        </p>
                        <Link
                            href="/diagnostic/guide"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950 transition-all shadow-lg shadow-white/10"
                            aria-label="Démarrer le diagnostic FinSight Advanced"
                        >
                            Démarrer le diagnostic
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <p className="text-[11px] text-gray-600 mt-4">Sans inscription · Données locales · RGPD</p>

                        <div className="mt-12 pt-10 border-t border-gray-800 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                            <Link href="/methodologie" className="hover:text-gray-300 transition-colors">Méthodologie →</Link>
                            <Link href="/pilotage-financier-pme" className="hover:text-gray-300 transition-colors">Pilotage financier PME →</Link>
                            <Link href="/calculateurs/dso" className="hover:text-gray-300 transition-colors">Calculateur DSO →</Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}

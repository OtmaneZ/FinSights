'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Check,
    ArrowRight,
    TrendingUp,
    BarChart3,
    Linkedin,
    Mail,
    Target,
    Shield,
    ChevronRight,
    LineChart,
    PieChart,
    Calendar,
    Users,
    Sparkles,
    Play,
    Quote
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import {
    CONSULTING_RATING_VALUE,
    CONSULTING_REVIEW_COUNT,
    BEST_RATING,
} from '@/config/social-proof'

export default function ConsultingPage() {
    // Schema.org structured data for rich snippets
    const professionalServiceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "FinSight - Architecture Financière & Systèmes Décisionnels",
        "description": "Services de conseil financier et direction financière externalisée (DAF) pour PME. Audit financier, tableaux de bord, pilotage trésorerie.",
        "url": "https://finsight.zineinsight.com/consulting",
        "provider": {
            "@type": "Person",
            "name": "Otmane Boulahia",
            "jobTitle": "Architecte de Systèmes Décisionnels Financiers",
            "url": "https://finsight.zineinsight.com/consulting",
            "sameAs": [
                "https://www.linkedin.com/in/otmaneboulahia"
            ]
        },
        "areaServed": {
            "@type": "Country",
            "name": "France"
        },
        "serviceType": [
            "Audit financier",
            "DAF externalisé",
            "Pilotage de trésorerie",
            "Tableaux de bord financiers",
            "Conseil stratégique PME"
        ],
        "offers": [
            {
                "@type": "Offer",
                "name": "Diagnostic Stratégique",
                "description": "Audit financier flash avec feuille de route prioritaire",
                "price": "2490",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "Audit Complet",
                "description": "Analyse approfondie trésorerie, marges et rentabilité avec plan d'optimisation",
                "price": "6990",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "Système de Décision",
                "description": "Direction financière externalisée avec tableaux de bord automatisés",
                "price": "12500",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": CONSULTING_RATING_VALUE,
            "reviewCount": CONSULTING_REVIEW_COUNT,
            "bestRating": BEST_RATING
        }
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Qu'est-ce que le conseil DAF externalisé ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le conseil DAF externalisé permet aux PME de bénéficier d'une expertise de directeur financier à temps partagé, sans le coût d'un recrutement permanent. Je travaille 2 à 4 jours par mois sur votre pilotage financier."
                }
            },
            {
                "@type": "Question",
                "name": "Combien coûte un audit financier ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le diagnostic stratégique démarre à 2 490€ HT pour un audit flash de 2-3 semaines. L'audit complet est à 6 990€ HT et inclut une analyse approfondie de vos marges, trésorerie et un plan d'optimisation chiffré."
                }
            },
            {
                "@type": "Question",
                "name": "Pour quels types d'entreprises ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "J'accompagne principalement les PME de 2 à 20 millions d'euros de chiffre d'affaires, dans les secteurs Services B2B, SaaS, Commerce et Industrie."
                }
            }
        ]
    }

    return (
        <div className="min-h-screen bg-background-primary text-text-primary font-sans">
            <StructuredData data={professionalServiceSchema} />
            <StructuredData data={faqSchema} />
            <Header />

            {/* ============================================
                HERO SECTION - Premium avec image de fond
               ============================================ */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/bureau.png"
                        alt="Bureau professionnel"
                        fill
                        className="object-cover opacity-15"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/70" />
                </div>

                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-accent-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24 lg:pt-40 lg:pb-32">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* LEFT: Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full">
                                <Sparkles className="w-4 h-4 text-accent-primary" />
                                <span className="text-accent-primary text-sm font-semibold">
                                    Architecture Financière &amp; Systèmes Décisionnels
                                </span>
                            </div>

                            {/* H1 */}
                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                                Transformez vos données en{' '}
                                <span className="text-accent-primary">décisions stratégiques</span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                                Audit stratégique, architecture décisionnelle et pilotage financier.
                                <span className="text-white font-semibold"> Anticipez avec 90 jours d&apos;avance.</span>
                            </p>

                            {/* Stats row */}
                            <div className="flex flex-col md:flex-row gap-8 py-4">
                                <div className="text-left md:text-center flex-1">
                                    <p className="text-3xl font-bold text-white mb-2">10+</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        ans d&apos;expertise en finance &amp; pédagogie
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">Formation académique + terrain + data</p>
                                </div>
                                <div className="text-left md:text-center flex-1">
                                    <p className="text-3xl font-bold text-accent-primary mb-2">Testée</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        Méthodes utilisées par des PME &amp; institutions
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">Approche rigoureuse, testée et outillée</p>
                                </div>
                                <div className="text-left md:text-center flex-1">
                                    <p className="text-3xl font-bold text-white mb-2">90j</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        Visibilité cash pilotée par l&apos;IA
                                    </p>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <a
                                    href="https://calendly.com/zineinsight"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Réserver un échange stratégique
                                </a>
                                <a
                                    href="#offres"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl border border-white/20 transition-all duration-200"
                                >
                                    Voir les offres
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                            </div>

                            {/* Trust */}
                            <div className="flex items-center gap-4 text-sm text-gray-400 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span>Réponse sous 24h</span>
                                </div>
                                <span className="text-gray-600">•</span>
                                <span>30 min · Confidentiel · Sans engagement</span>
                            </div>
                        </motion.div>

                        {/* RIGHT: Photo + Dashboard preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative">
                                {/* Glow effect */}
                                <div className="absolute -inset-4 bg-accent-primary/20 rounded-3xl blur-2xl" />

                                {/* Dashboard mockup */}
                                <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                        </div>
                                        <span className="text-xs text-gray-500">Cockpit décisionnel dirigeant</span>
                                    </div>

                                    {/* KPIs Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="w-4 h-4 text-green-400" />
                                                <span className="text-xs text-gray-400">Marge brute</span>
                                            </div>
                                            <p className="text-2xl font-bold text-white">+23%</p>
                                            <p className="text-xs text-green-400">↑ vs N-1</p>
                                        </div>
                                        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <BarChart3 className="w-4 h-4 text-accent-primary" />
                                                <span className="text-xs text-gray-400">Cash-flow</span>
                                            </div>
                                            <p className="text-2xl font-bold text-white">+145k€</p>
                                            <p className="text-xs text-accent-primary">90j ahead</p>
                                        </div>
                                        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <PieChart className="w-4 h-4 text-purple-400" />
                                                <span className="text-xs text-gray-400">ROI identifié</span>
                                            </div>
                                            <p className="text-2xl font-bold text-white">3.2x</p>
                                            <p className="text-xs text-purple-400">potentiel</p>
                                        </div>
                                        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-4 h-4 text-orange-400" />
                                                <span className="text-xs text-gray-400">DSO</span>
                                            </div>
                                            <p className="text-2xl font-bold text-white">-15j</p>
                                            <p className="text-xs text-orange-400">optimisé</p>
                                        </div>
                                    </div>

                                    {/* Chart - Animated */}
                                    <div className="bg-slate-900/40 rounded-xl p-4 border border-white/5">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm text-gray-300 font-medium">Évolution trésorerie</span>
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                </span>
                                                <span className="text-xs text-green-400 font-semibold">Live</span>
                                            </div>
                                        </div>
                                        {/* Bars with animation */}
                                        <div className="flex items-end gap-1.5 h-24 mb-2">
                                            {[
                                                { h: 40, month: 'J' },
                                                { h: 55, month: 'F' },
                                                { h: 45, month: 'M' },
                                                { h: 60, month: 'A' },
                                                { h: 50, month: 'M' },
                                                { h: 75, month: 'J' },
                                                { h: 65, month: 'J' },
                                                { h: 80, month: 'A' },
                                                { h: 70, month: 'S' },
                                                { h: 85, month: 'O' },
                                                { h: 90, month: 'N' },
                                                { h: 95, month: 'D' }
                                            ].map((bar, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${bar.h}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                                                    className="flex-1 bg-gradient-to-t from-accent-primary via-blue-400 to-cyan-300 rounded-t shadow-lg shadow-accent-primary/20"
                                                />
                                            ))}
                                        </div>
                                        {/* Month labels */}
                                        <div className="flex gap-1.5">
                                            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, i) => (
                                                <span key={i} className="flex-1 text-center text-[10px] text-gray-500">{month}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                PROBLÉMATIQUES - Cards modernes
               ============================================ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary-subtle rounded-full mb-4">
                            Diagnostic
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Vous vous reconnaissez ?
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Deux situations, une même exigence de clarté financière
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card 1 - Stabilisation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="group relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl" />
                            <div className="relative">
                                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                                    <Shield className="w-7 h-7 text-red-600" />
                                </div>
                                <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Contexte A</span>
                                <h3 className="text-2xl font-bold text-text-primary mt-2 mb-4">Pilotage sous tension</h3>
                                <p className="text-text-secondary mb-6">
                                    Votre pilotage financier manque de visibilité. Vous devez stabiliser, clarifier et anticiper.
                                </p>
                                <ul className="space-y-3">
                                    {['Trésorerie difficile à anticiper', 'Marges par activité floues', 'Reporting manuel chronophage', 'Décisions sur données incomplètes'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-text-secondary">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 pt-6 border-t border-border-subtle">
                                    <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                        <Target className="w-4 h-4 text-red-600" />
                                        Objectif : Stabiliser. Clarifier. Anticiper.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2 - Croissance */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="group relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-2xl" />
                            <div className="relative">
                                <div className="w-14 h-14 bg-accent-primary-subtle rounded-2xl flex items-center justify-center mb-6">
                                    <TrendingUp className="w-7 h-7 text-accent-primary" />
                                </div>
                                <span className="text-xs font-semibold text-accent-primary uppercase tracking-wider">Contexte B</span>
                                <h3 className="text-2xl font-bold text-text-primary mt-2 mb-4">Pilotage de croissance</h3>
                                <p className="text-text-secondary mb-6">
                                    Votre activité fonctionne. Vous voulez structurer l&apos;accélération et identifier vos leviers.
                                </p>
                                <ul className="space-y-3">
                                    {['Croissance rapide, visibilité réduite', 'Leviers de rentabilité non exploités', 'Besoin de structuration data', 'Préparation de phase stratégique'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-text-secondary">
                                            <div className="w-1.5 h-1.5 bg-accent-primary rounded-full" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 pt-6 border-t border-border-subtle">
                                    <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                        <Target className="w-4 h-4 text-accent-primary" />
                                        Objectif : Accélérer. Structurer. Conquérir.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                À PROPOS - Section avec photo
               ============================================ */}
            <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Photo */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-accent-primary/20 rounded-3xl blur-2xl" />
                            <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                                <Image
                                    src="/images/Photo_profil.jpeg"
                                    alt="Otmane Boulahia - Architecte de Systèmes Décisionnels Financiers"
                                    width={500}
                                    height={600}
                                    className="object-cover w-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent-primary flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">OB</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">Otmane Boulahia</p>
                                            <p className="text-gray-300 text-sm">Architecte de Systèmes Décisionnels Financiers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-full">
                                Fondateur
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Un partenaire engagé pour votre{' '}
                                <span className="text-accent-primary">réussite financière</span>
                            </h2>

                            <div className="space-y-4 text-gray-300 leading-relaxed">
                                <p>
                                    <span className="text-white font-semibold">+10 ans d&apos;expérience</span> en finance d&apos;entreprise et data analyse.
                                    Master en Finance, certification Data Analyst, enseignant en Sciences Économiques.
                                </p>
                                <p>
                                    J&apos;ai fondé ZineInsights avec une conviction : trop de dirigeants prennent des décisions
                                    stratégiques sur des données incomplètes ou en retard.
                                </p>
                                <p>
                                    Ma mission est de transformer vos données financières en{' '}
                                    <span className="text-accent-primary font-semibold">avantage concurrentiel mesurable</span>.
                                </p>
                            </div>

                            {/* Credentials */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {[
                                    { icon: BarChart3, label: 'Finance & Data' },
                                    { icon: Users, label: 'PME 2-20M€' },
                                    { icon: Target, label: 'ROI mesurable' },
                                    { icon: Shield, label: 'Confidentialité' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                                        <item.icon className="w-5 h-5 text-accent-primary" />
                                        <span className="text-sm text-gray-300">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <a
                                    href="https://www.linkedin.com/in/otmane-boulahia/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    LinkedIn
                                </a>
                                <a
                                    href="https://calendly.com/zineinsight"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover rounded-xl font-semibold transition-all"
                                >
                                    Échanger
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                ÉTUDES DE CAS - Cards premium
               ============================================ */}
            <section className="py-20 bg-background-primary">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary-subtle rounded-full mb-4">
                            Études de cas
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Missions récentes
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Des résultats concrets pour des entreprises comme la vôtre
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                sector: 'Formation professionnelle',
                                size: '500M€ CA',
                                icon: Users,
                                color: 'purple',
                                challenge: 'Identification des centres de coût déficitaires. Données RH et comptables dispersées.',
                                solution: 'Centralisation multi-sources, analyse de rentabilité par centre de profit, vision consolidée en temps réel.',
                                result: 'Récupération de trésorerie significative',
                                tags: ['Consolidation', 'Rentabilité', 'Vision temps réel']
                            },
                            {
                                sector: 'BTP / Services',
                                size: '7M€ CA',
                                icon: TrendingUp,
                                color: 'blue',
                                challenge: 'Croissance 40%/an avec perte de visibilité sur les marges chantier et le cash.',
                                solution: 'Modèle rentabilité par projet, pilotage cash à 90 jours, arbitrages avant engagement.',
                                result: 'Arbitrages rapides, croissance rentable',
                                tags: ['Cash-flow', 'Pilotage', 'Projet']
                            },
                            {
                                sector: 'Services / Conseil',
                                size: 'PME',
                                icon: BarChart3,
                                color: 'green',
                                challenge: 'Dépendance aux retraitements Excel manuels. Indicateurs non fiables en comité.',
                                solution: 'Cadre de pilotage structuré, production automatique des indicateurs, reporting fiable en comité de direction.',
                                result: 'Pilotage fiable sans intervention manuelle',
                                tags: ['Pilotage', 'Automatisation', 'Comité direction']
                            }
                        ].map((study, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="group bg-white rounded-2xl p-6 border border-border-default hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${study.color === 'purple' ? 'bg-purple-100' : study.color === 'blue' ? 'bg-accent-primary-subtle' : 'bg-green-100'}`}>
                                        <study.icon className={`w-6 h-6 ${study.color === 'purple' ? 'text-purple-600' : study.color === 'blue' ? 'text-accent-primary' : 'text-green-600'}`} />
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-text-primary">{study.sector}</p>
                                        <p className="text-sm text-text-tertiary">{study.size}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Problématique</p>
                                        <p className="text-sm text-text-secondary">{study.challenge}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Solution</p>
                                        <p className="text-sm text-text-secondary">{study.solution}</p>
                                    </div>
                                    <div className="bg-accent-success-subtle rounded-xl px-4 py-3">
                                        <p className="text-sm font-semibold text-accent-success flex items-center gap-2">
                                            <Check className="w-4 h-4" />
                                            {study.result}
                                        </p>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border-subtle">
                                    {study.tags.map((tag, j) => (
                                        <span key={j} className="px-3 py-1 text-xs font-medium text-text-secondary bg-background-primary rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                MÉTHODOLOGIE - Section sombre
               ============================================ */}
            <section id="methode" className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-4">
                            Notre approche
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ce que nous construisons ensemble
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Une méthodologie éprouvée pour des résultats mesurables
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Shield, title: 'Stabiliser', desc: 'Anticipation trésorerie 90 jours, identification des fuites de cash, sécurisation des marges.', color: 'red' },
                            { icon: TrendingUp, title: 'Accélérer', desc: 'Identification des leviers de croissance, optimisation des marges, analyse de rentabilité.', color: 'blue' },
                            { icon: Target, title: 'Structurer', desc: 'Préparation levée de fonds, due diligence, modèles financiers fiables et documentés.', color: 'purple' },
                            { icon: BarChart3, title: 'Automatiser', desc: 'Mise en place d\'un système décisionnel autonome : indicateurs consolidés, alertes ciblées, suppression des retraitements manuels.', color: 'green' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent-primary/30 hover:bg-white/10 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color === 'red' ? 'bg-red-500/20' : item.color === 'blue' ? 'bg-accent-primary/20' : item.color === 'purple' ? 'bg-purple-500/20' : 'bg-green-500/20'}`}>
                                    <item.icon className={`w-6 h-6 ${item.color === 'red' ? 'text-red-400' : item.color === 'blue' ? 'text-accent-primary' : item.color === 'purple' ? 'text-purple-400' : 'text-green-400'}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                OFFRES - Pricing cards premium
               ============================================ */}
            <section id="offres" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary-subtle rounded-full mb-4">
                            Offres
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Trois niveaux d&apos;accompagnement
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Choisissez l&apos;offre adaptée à vos enjeux
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Diagnostic */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-background-primary rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Offre Signature</p>
                            <h3 className="text-2xl font-bold text-text-primary mb-2">Diagnostic FinSight™ 90J</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold text-text-primary">2 490</span>
                                <span className="text-text-secondary">€ HT</span>
                            </div>
                            <p className="text-text-secondary mb-6">Clarté stratégique complète en 5 jours ouvrés.</p>

                            <ul className="space-y-3 mb-8">
                                {[
                                    'Score FinSight™ 0–100 détaillé',
                                    'Décomposition 4 piliers Cash · Marges · Résilience · Risques',
                                    '3 leviers prioritaires chiffrés (anomalies incluses)',
                                    'Simulation d\'impact à 90 jours',
                                    'Restitution stratégique 60 min avec plan d\'action'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                        <Check className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a href="https://calendly.com/zineinsight" target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center bg-white border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white font-bold rounded-xl transition-all duration-200">
                                Lancer le diagnostic
                            </a>
                        </motion.div>

                        {/* Audit - Featured */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl scale-105"
                        >
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent-primary text-white text-xs font-bold rounded-full">
                                Recommandé
                            </div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Structuration &amp; Pilotage</p>
                            <h3 className="text-2xl font-bold mb-2">Audit Complet</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold">6 990</span>
                                <span className="text-gray-400">€ HT</span>
                            </div>
                            <p className="text-gray-300 mb-6">Visibilité complète, arbitrages rapides, décisions structurées.</p>

                            <ul className="space-y-3 mb-8">
                                {[
                                    'Tout le Diagnostic FinSight™ 90J',
                                    'Analyse de rentabilité réelle par activité',
                                    'Vision trésorerie fiabilisée sur 24 mois',
                                    'Cockpit décisionnel sur mesure',
                                    'Modèle de rentabilité analytique',
                                    'Plan d\'action chiffré sur 6 mois',
                                    'Formation 2h + 1 mois de support'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a href="https://calendly.com/zineinsight" target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center bg-accent-primary hover:bg-accent-primary-hover text-white font-bold rounded-xl transition-all duration-200 shadow-lg">
                                Réserver un audit
                            </a>
                        </motion.div>

                        {/* Decision System */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-background-primary rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Système décisionnel</p>
                            <h3 className="text-2xl font-bold text-text-primary mb-2">Decision System</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold text-text-primary">12 500</span>
                                <span className="text-text-secondary">€ HT</span>
                            </div>
                            <p className="text-text-secondary mb-6">Un pilotage financier autonome, fiable et durable.</p>

                            <ul className="space-y-3 mb-8">
                                {[
                                    'Tout l\'Audit Complet',
                                    'Cockpit décisionnel dirigeant temps réel',
                                    'Alertes automatiques sur anomalies clés',
                                    'Scénarios de croissance simulés en continu',
                                    'Maîtrise totale des marges et du cash',
                                    'Formation équipe + 3 mois d\'accompagnement'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                        <Check className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a href="https://calendly.com/zineinsight" target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center bg-white border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white font-bold rounded-xl transition-all duration-200">
                                Planifier un échange stratégique
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                APPROCHE TECHNIQUE - Supprimée (stack sous-entendue)
               ============================================ */}

            {/* ============================================
                SECTION FAQ
               ============================================ */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-4">
                            Questions fréquentes
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Vous vous posez des questions ?
                        </h2>
                        <p className="text-lg text-slate-600">
                            Voici les réponses aux questions les plus courantes sur le conseil DAF externalisé
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {faqSchema.mainEntity.map((faq, i) => (
                            <motion.details
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-accent-primary transition-all"
                            >
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <h3 className="font-semibold text-slate-900 pr-4 text-lg">
                                        {faq.name}
                                    </h3>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                                </summary>
                                <div className="px-6 pb-6">
                                    <p className="text-slate-600 leading-relaxed">
                                        {faq.acceptedAnswer.text}
                                    </p>
                                </div>
                            </motion.details>
                        ))}

                        {/* Questions supplémentaires */}
                        <motion.details
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                            className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-accent-primary transition-all"
                        >
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <h3 className="font-semibold text-slate-900 pr-4 text-lg">
                                    Quelle est la différence avec un expert-comptable ?
                                </h3>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                            </summary>
                            <div className="px-6 pb-6">
                                <p className="text-slate-600 leading-relaxed">
                                    L&apos;expert-comptable s&apos;occupe de la <strong>comptabilité légale</strong> et des déclarations fiscales. 
                                    Le DAF externalisé va plus loin : pilotage stratégique, optimisation trésorerie, tableaux de bord, 
                                    analyse marges par produit/client, et accompagnement décisions (investissements, recrutements, levées de fonds).
                                </p>
                            </div>
                        </motion.details>

                        <motion.details
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-accent-primary transition-all"
                        >
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <h3 className="font-semibold text-slate-900 pr-4 text-lg">
                                    Travaillez-vous à distance ou sur site ?
                                </h3>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                            </summary>
                            <div className="px-6 pb-6">
                                <p className="text-slate-600 leading-relaxed">
                                    <strong>Mode hybride</strong> : 1-2 jours sur site par mois pour réunions stratégiques et points direction, 
                                    le reste à distance (analyse données, construction tableaux de bord, suivi trésorerie). 
                                    Cette flexibilité réduit les coûts et augmente la réactivité.
                                </p>
                            </div>
                        </motion.details>

                        <motion.details
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.25 }}
                            className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-accent-primary transition-all"
                        >
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <h3 className="font-semibold text-slate-900 pr-4 text-lg">
                                    Y a-t-il un engagement minimum ?
                                </h3>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                            </summary>
                            <div className="px-6 pb-6">
                                <p className="text-slate-600 leading-relaxed">
                                    Le <strong>diagnostic</strong> et l&apos;<strong>audit</strong> sont des missions ponctuelles sans engagement. 
                                    Pour l&apos;accompagnement DAF externalisé récurrent, je recommande un minimum de <strong>3 mois</strong> pour voir des résultats concrets, 
                                    mais vous restez libre d&apos;arrêter quand vous voulez.
                                </p>
                            </div>
                        </motion.details>

                        <motion.details
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-accent-primary transition-all"
                        >
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <h3 className="font-semibold text-slate-900 pr-4 text-lg">
                                    Combien de jours par mois pour un DAF externalisé ?
                                </h3>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                            </summary>
                            <div className="px-6 pb-6">
                                <p className="text-slate-600 leading-relaxed mb-3">
                                    Selon la taille de votre entreprise et vos besoins :
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                    <li><strong>PME 1-5M€</strong> : 1-2 jours/mois (focus sur trésorerie et reporting)</li>
                                    <li><strong>PME 5-20M€</strong> : 2-3 jours/mois (+ analyse marges, optimisations)</li>
                                    <li><strong>PME 20-100M€</strong> : 3-4 jours/mois (+ projets structurants, levées de fonds)</li>
                                </ul>
                            </div>
                        </motion.details>

                        <motion.details
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.35 }}
                            className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-accent-primary transition-all"
                        >
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <h3 className="font-semibold text-slate-900 pr-4 text-lg">
                                    Quels résultats concrets puis-je attendre ?
                                </h3>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                            </summary>
                            <div className="px-6 pb-6">
                                <p className="text-slate-600 leading-relaxed mb-3">
                                    Résultats typiques après <strong>90 jours</strong> :
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                    <li>Visibilité trésorerie <strong>90 jours</strong> (vs 30 jours avant)</li>
                                    <li>DSO réduit de <strong>15-30%</strong></li>
                                    <li>Marges optimisées de <strong>2-5 points</strong></li>
                                    <li>Temps dirigeant sur la finance <strong>divisé par 3</strong></li>
                                    <li>Décisions basées sur des <strong>données fiables</strong> plutôt que l&apos;intuition</li>
                                </ul>
                            </div>
                        </motion.details>

                        <motion.details
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-accent-primary transition-all"
                        >
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <h3 className="font-semibold text-slate-900 pr-4 text-lg">
                                    Quels secteurs d&apos;activité accompagnez-vous ?
                                </h3>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                            </summary>
                            <div className="px-6 pb-6">
                                <p className="text-slate-600 leading-relaxed mb-3">
                                    J&apos;accompagne principalement :
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                    <li><strong>Services B2B</strong> : ESN, conseil, agences (marketing, comm, dev)</li>
                                    <li><strong>SaaS et Tech</strong> : Éditeurs logiciels, plateformes, API</li>
                                    <li><strong>Commerce et Distribution</strong> : E-commerce, retail, grossistes</li>
                                    <li><strong>Industrie / BTP</strong> : Fabrication, sous-traitance, construction</li>
                                </ul>
                                <p className="text-slate-600 mt-3">
                                    Mon expertise <strong>data</strong> me permet de m&apos;adapter rapidement aux spécificités sectorielles.
                                </p>
                            </div>
                        </motion.details>
                    </div>

                    {/* CTA après FAQ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-12 text-center bg-slate-50 rounded-2xl p-8 border border-slate-200"
                    >
                        <p className="text-slate-900 font-semibold mb-3">
                            D&apos;autres questions ?
                        </p>
                        <p className="text-slate-600 mb-6">
                            Réservez un échange exploratoire de 30 minutes pour en discuter.
                        </p>
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all shadow-lg"
                        >
                            <Calendar className="w-5 h-5" />
                            Réserver un échange exploratoire
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ============================================
                CTA FINAL - Premium
               ============================================ */}
            <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-6">
                            Passez à l&apos;action
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Prêt à transformer votre{' '}
                            <span className="text-accent-primary">pilotage financier</span> ?
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Échangeons 30 minutes sur vos enjeux stratégiques.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-accent-primary hover:bg-accent-primary-hover text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Calendar className="w-6 h-6" />
                                Réserver un créneau
                            </a>
                            <a
                                href="mailto:otmane@zineinsight.com"
                                className="inline-flex items-center gap-2 px-8 py-5 bg-white/10 hover:bg-white/20 border border-white/20 text-lg font-semibold rounded-xl transition-all"
                            >
                                <Mail className="w-5 h-5" />
                                otmane@zineinsight.com
                            </a>
                        </div>

                        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mt-8">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>Réponse sous 24h</span>
                            </div>
                            <span className="text-gray-600">•</span>
                            <span>30 min · Exploratoire</span>
                            <span className="text-gray-600">•</span>
                            <span>Sans engagement</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

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
    Quote,
    Layers
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
        "name": "FinSight - Missions BI Finance",
        "description": "Consultant BI Finance pour TPE et PME. Audit Power BI, modélisation de données financières, automatisation Python. Forfaits packagés et missions longues.",
        "url": "https://finsight.zineinsight.com/consulting",
        "provider": {
            "@type": "Person",
            "name": "Otmane Boulahia",
            "jobTitle": "Consultant BI Finance",
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
            "Audit Power BI",
            "Modélisation Power BI",
            "Automatisation Python",
            "Missions BI Finance"
        ],
        "offers": [
            {
                "@type": "Offer",
                "name": "Audit Power BI",
                "description": "Audit complet modèle .pbix, rapport technique, restitution 1h",
                "price": "2490",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "Modélisation Power BI",
                "description": "Construction modèle de données financier, DAX documenté, connecteurs ERP",
                "price": "5000",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "Mission longue",
                "description": "Régie TJM via Malt : audit, modélisation, pipeline Python, transfert de compétences",
                "price": "700",
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
                "name": "Qu'est-ce qu'un audit Power BI ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Un audit Power BI analyse la structure technique d'un modèle .pbix : mesures DAX, relations, requêtes Power Query, performance et fiabilité des KPI. Le livrable est un rapport technique structuré avec plan de remédiation, livré en 5 jours ouvrés."
                }
            },
            {
                "@type": "Question",
                "name": "Combien coûte un audit Power BI ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "L'audit Power BI est proposé en forfait à 2 490€ HT. Il inclut l'analyse complète du modèle, le rapport technique et une restitution d'1 heure. La modélisation from scratch est sur devis entre 5 000 et 12 000€ HT."
                }
            },
            {
                "@type": "Question",
                "name": "Pour quels types d'entreprises ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "TPE et PME avec un modèle Power BI Finance existant ou un projet de modélisation à lancer. Secteurs : services, industrie, retail, réseaux multi-sites. Stack : Power BI, Power Query, DAX, Python, SQL."
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
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full">
                                <Sparkles className="w-4 h-4 text-accent-primary" />
                                <span className="text-accent-primary text-sm font-semibold">
                                    Missions BI Finance
                                </span>
                            </div>

                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                                Consultant BI Finance{' '}
                                <span className="text-accent-primary">pour TPE et PME</span>
                            </h1>

                            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                                Audit Power BI, modélisation de données financières, automatisation Python.
                                Forfaits packagés et missions longues.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                                <a
                                    href="https://calendly.com/zineinsight/15min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Demander un devis
                                </a>
                                <a
                                    href="#offres"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-lg font-semibold rounded-xl transition-all duration-200"
                                >
                                    Voir les forfaits
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span>Réponse sous 24h</span>
                                </div>
                                <span className="text-gray-600">•</span>
                                <span>15 min · Confidentiel · Sans engagement</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                PROBLÉMATIQUES - Contextes techniques
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
                            Votre contexte
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Vous vous reconnaissez ?
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Deux situations techniques, deux forfaits adaptés
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="group relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-accent-primary-subtle rounded-2xl flex items-center justify-center mb-6">
                                <BarChart3 className="w-7 h-7 text-accent-primary" />
                            </div>
                            <span className="text-xs font-semibold text-accent-primary uppercase tracking-wider">Contexte A</span>
                            <h3 className="text-2xl font-bold text-text-primary mt-2 mb-4">
                                Un Power BI qui tourne, mais vous doutez de sa fiabilité
                            </h3>
                            <p className="text-text-secondary mb-6">
                                Mesures incohérentes, performance dégradante, dépendance à une seule personne pour le refresh.
                                Vous avez besoin d&apos;un audit technique avant d&apos;investir davantage.
                            </p>
                            <ul className="space-y-3">
                                {['KPI qui ne concordent pas avec la compta', 'Modèle devenu opaque avec le temps', 'Refresh manuel fragile', "Besoin d'un rapport technique objectif"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                                        <div className="w-1.5 h-1.5 bg-accent-primary rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-8 pt-6 border-t border-border-subtle text-sm font-semibold text-text-primary">
                                → Forfait Audit Power BI · 2 490€ HT
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="group relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                                <Layers className="w-7 h-7 text-slate-700" />
                            </div>
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Contexte B</span>
                            <h3 className="text-2xl font-bold text-text-primary mt-2 mb-4">
                                Construire un modèle Power BI Finance from scratch
                            </h3>
                            <p className="text-text-secondary mb-6">
                                Pas de modèle fiable, données éparpillées (Sage, Cegid, FEC, ERP).
                                Vous voulez une architecture dimensionnelle documentée et maintenable.
                            </p>
                            <ul className="space-y-3">
                                {['Cadrage technique et fonctionnel', 'Modèle mono ou multi-entités', 'Mesures DAX documentées', 'Connecteurs et documentation livrés'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                                        <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-8 pt-6 border-t border-border-subtle text-sm font-semibold text-text-primary">
                                → Forfait Modélisation Power BI · Sur devis
                            </p>
                        </motion.div>
                    </div>

                    <div className="mt-12 text-center">
                        <a
                            href="https://calendly.com/zineinsight/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Demander un devis
                            <ArrowRight className="w-5 h-5" />
                        </a>
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
                                    alt="Otmane Boulahia - Consultant BI Finance"
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
                                            <p className="text-gray-300 text-sm">Consultant BI Finance</p>
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
                                Mon angle
                            </h2>

                            <div className="space-y-4 text-gray-300 leading-relaxed">
                                <p>
                                    Master 2 Finance (Université Côte d&apos;Azur). 10 ans d&apos;enseignement de l&apos;économie.
                                    Reconversion data analyst (Le Wagon).
                                </p>
                                <p>
                                    Un dashboard peut tourner depuis 3 ans sans qu&apos;on sache qu&apos;il est à deux erreurs de s&apos;effondrer.
                                    Mesures DAX en O(n²), jointures fragiles, refresh manuel dépendant d&apos;une seule personne.
                                    Le BI n&apos;est pas un livrable graphique — c&apos;est une infrastructure qui doit tenir.
                                </p>
                                <p>
                                    J&apos;interviens, j&apos;audite, je modélise, je documente.
                                    Je repars en laissant quelque chose qui tourne sans moi.
                                </p>
                            </div>

                            {/* Credentials */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {[
                                    { icon: BarChart3, label: 'Power BI & DAX' },
                                    { icon: Target, label: 'Audit technique' },
                                    { icon: Shield, label: 'Python & SQL' },
                                    { icon: Users, label: 'Multi-sites' }
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
                                    href="https://calendly.com/zineinsight/15min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover rounded-xl font-semibold transition-all"
                                >
                                    Demander un devis
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
                            Réseau multisites santé animale (30 sites)
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Client anonymisé — mission de référence
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
                        {[{
                                sector: 'Réseau santé animale',
                                size: '30 sites',
                                icon: BarChart3,
                                color: 'blue',
                                challenge: 'Modèle Power BI consolidé existant. Doutes sur la fiabilité des mesures, performance dégradante, dépendance à une manipulation manuelle mensuelle.',
                                solution: 'Audit complet : 20 tables, 80 mesures DAX, 16 requêtes Power Query, 9 relations. Extraction via pbixray (Python). Rapport technique structuré.',
                                result: '11 anomalies structurelles identifiées, plan de remédiation par priorité',
                                tags: ['Audit Power BI', 'DAX', 'Multi-sites']
                            }].map((study, i) => (
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
                            Méthode
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ma méthode d&apos;audit Power BI
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Quatre étapes techniques, livrable documenté en 5 jours ouvrés
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Extraction & inventaire', desc: 'Lecture du .pbix (pbixray), inventaire des tables, mesures, relations et requêtes Power Query.' },
                            { step: '02', title: 'Analyse DAX & performance', desc: 'Patterns problématiques : EARLIER, jointures fragiles, doublons de mesures.' },
                            { step: '03', title: 'Tests de cohérence', desc: 'Vérification des KPI critiques, contrôle des jointures, simulation de volumes.' },
                            { step: '04', title: 'Rapport & remédiation', desc: "Document structuré + restitution technique d'1 heure." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent-primary/30 hover:bg-white/10 transition-all duration-300"
                            >
                                <p className="text-accent-primary text-sm font-bold mb-3">{item.step}</p>
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
                            Trois forfaits techniques
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Audit packagé, modélisation sur devis ou mission longue en régie
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
                            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Audit Power BI</p>
                            <h3 className="text-2xl font-bold text-text-primary mb-2">Auditer un modèle existant</h3>
                            <p className="text-text-secondary mb-6">Livrable clé en main - 5 jours ouvrés.</p>

                            <ul className="space-y-3 mb-4">
                                {[
                                    'Audit complet du modèle .pbix',
                                    'Analyse des mesures DAX, relations, performance',
                                    'Identification des anomalies structurelles',
                                    'Rapport technique documenté',
                                    'Restitution 1h'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                        <Check className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm italic text-text-tertiary">Livré en 5 jours ouvrés · 2 490€ HT</p>
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
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Modélisation Power BI</p>
                            <h3 className="text-2xl font-bold mb-2">Construire un modèle from scratch</h3>
                            <p className="text-gray-300 mb-6">Vous n&apos;avez pas de modèle Power BI ou vous voulez tout refondre. Je conçois l&apos;architecture data finance. Sur devis · 5 000 à 12 000€ HT · 2 à 4 semaines.</p>

                            <ul className="space-y-3 mb-4">
                                {[
                                    'Cadrage technique et fonctionnel',
                                    'Modèle de données dimensionnel',
                                    'Mesures DAX documentées',
                                    'Connecteurs (Sage, Cegid, FEC, ERP)',
                                    'Documentation technique'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm italic text-gray-500">Forfait recommandé pour un modèle from scratch</p>
                        </motion.div>

                        {/* Pilotage Augmenté */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-background-primary rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Mission longue</p>
                            <h3 className="text-2xl font-bold text-text-primary mb-2">Régie au jour via Malt</h3>
                            <p className="text-text-secondary mb-6">Pour des missions plus larges : audit + modélisation + pipeline Python + accompagnement équipe. TJM 700€ HT via Malt.</p>

                            <ul className="space-y-3 mb-4">
                                {[
                                    'Engagement de 2 semaines à 3 mois',
                                    'Présence régulière chez le client',
                                    'Stack Power BI + Python + SQL',
                                    'Transfert de compétences'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                        <Check className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm italic text-text-tertiary">Profil Malt disponible sur demande</p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mt-12 text-center max-w-xl mx-auto"
                    >
                        <p className="text-text-secondary text-sm mb-4">
                            Voir les tarifs détaillés et comparer les offres
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://calendly.com/zineinsight/15min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Calendar className="w-5 h-5" />
                                Demander un devis
                            </a>
                            <Link
                                href="/tarifs"
                                className="inline-flex items-center gap-2 px-6 py-4 border-2 border-accent-primary/40 text-accent-primary font-semibold rounded-xl hover:bg-accent-primary/5 transition-all duration-200"
                            >
                                Voir les tarifs →
                            </Link>
                        </div>
                    </motion.div>
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
                            Voici les réponses aux questions les plus courantes sur les missions BI Finance
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
                                    FinSight va plus loin : connecter vos données (ERP, comptabilité, exports) via SQL et Python,
                                    construire un pilotage Power BI fiable et réconcilié, produire le Score FinSight™ et accompagner
                                    les décisions stratégiques (investissements, recrutements, cash à 90 jours).
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
                                    Pour un accompagnement récurrent (structuration continue, alertes automatiques, scénarios),
                                    je recommande un minimum de <strong>3 mois</strong> pour produire des résultats consolidés,
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
                                    Quelle est la cadence d&apos;une mission de structuration ?
                                </h3>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                            </summary>
                            <div className="px-6 pb-6">
                                <p className="text-slate-600 leading-relaxed mb-3">
                                    Selon la taille de votre entreprise et vos besoins :
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                    <li><strong>PME 500k€-2M€</strong> : 1-2 jours/mois (focus sur trésorerie et reporting)</li>
                                    <li><strong>PME 2-5M€</strong> : 2-3 jours/mois (+ analyse marges, optimisations)</li>
                                    <li><strong>PME 5M€+</strong> : 3-4 jours/mois (+ projets structurants, levées de fonds)</li>
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
                            href="https://calendly.com/zineinsight/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all shadow-lg"
                        >
                            <Calendar className="w-5 h-5" />
                            Demander un devis
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
                            Un échange de 30 min pour identifier{' '}
                            <span className="text-accent-primary">vos 3 leviers prioritaires</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Échangeons 30 minutes sur vos enjeux stratégiques.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://calendly.com/zineinsight/15min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-accent-primary hover:bg-accent-primary-hover text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Calendar className="w-6 h-6" />
                                On échange 30 min - sans engagement
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

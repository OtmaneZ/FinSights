'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Check,
    ArrowRight,
    ChevronRight,
    Calendar,
    Mail,
    Shield,
    Target,
    TrendingUp,
    Users,
    BarChart3,
    Clock,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import {
    AGGREGATE_RATING_VALUE,
    AGGREGATE_REVIEW_COUNT,
    BEST_RATING,
    WORST_RATING,
    SOCIAL_PROOF_LABEL,
} from '@/config/social-proof'

/* ──────────────────────────────────────────────────────
   FAQ Data — tarifs-specific (not duplicated from /consulting)
   ────────────────────────────────────────────────────── */
const faqItems = [
    {
        question: 'Comment choisir entre le Diagnostic, l\'Audit Complet et le Decision System ?',
        answer:
            'Le Diagnostic FinSight™ 90J convient si vous souhaitez un état des lieux précis et rapide. L\'Audit Complet est recommandé lorsque vous avez besoin d\'un cockpit décisionnel, d\'une analyse de rentabilité par activité et d\'un plan d\'action chiffré. Le Decision System s\'adresse aux dirigeants qui veulent un pilotage financier autonome et durable avec alertes, scénarios et accompagnement sur 3 mois.',
    },
    {
        question: 'Les tarifs incluent-ils la TVA ?',
        answer:
            'Les tarifs affichés sont en euros HT. La TVA applicable (20 %) est ajoutée sur la facture. Pour les entreprises hors UE ou en autoliquidation, la TVA n\'est pas facturée.',
    },
    {
        question: 'Proposez-vous un paiement échelonné ?',
        answer:
            'Pour l\'Audit Complet et le Decision System, un paiement en 2 ou 3 échéances est possible. Le Diagnostic FinSight™ 90J est réglé en une fois à la commande.',
    },
    {
        question: 'Y a-t-il un engagement de durée ?',
        answer:
            'Non. Le Diagnostic et l\'Audit sont des missions ponctuelles sans engagement. Le Decision System inclut 3 mois d\'accompagnement ; au-delà, vous restez libre de renouveler ou non.',
    },
    {
        question: 'Quelle est la différence avec un cabinet de conseil traditionnel ?',
        answer:
            'FinSight combine l\'expertise financière d\'un DAF avec des outils d\'analyse avancés (Score FinSight™, benchmarks Banque de France, cockpit décisionnel temps réel). Vous obtenez des livrables actionnables avec des données chiffrées, pas simplement des recommandations PowerPoint.',
    },
    {
        question: 'Comment se déroule la première étape ?',
        answer:
            'Un échange exploratoire de 30 minutes (gratuit, sans engagement) permet de comprendre vos enjeux. Si le projet est pertinent, nous lançons le Diagnostic FinSight™ 90J qui livre un état des lieux complet en 5 jours ouvrés.',
    },
    {
        question: 'Quels types de PME accompagnez-vous ?',
        answer:
            'PME de 2 à 20 M€ de chiffre d\'affaires, tous secteurs : services B2B, SaaS & Tech, commerce, industrie, BTP. L\'approche data de FinSight s\'adapte rapidement aux spécificités de chaque secteur.',
    },
]

export default function TarifsPage() {
    /* ── JSON-LD : Offer + FAQPage ── */
    const offersSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'FinSight — Direction Financière Externalisée',
        url: 'https://finsight.zineinsight.com/tarifs',
        description:
            'Missions de DAF externalisé pour PME : diagnostic financier, audit complet, système décisionnel.',
        areaServed: { '@type': 'Country', name: 'France' },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: AGGREGATE_RATING_VALUE,
            reviewCount: AGGREGATE_REVIEW_COUNT,
            bestRating: BEST_RATING,
            worstRating: WORST_RATING,
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Offres DAF Externalisé FinSight',
            itemListElement: [
                {
                    '@type': 'Offer',
                    name: 'Diagnostic FinSight™ 90J',
                    price: '1990',
                    priceCurrency: 'EUR',
                    description:
                        'Score FinSight™ 0-100, décomposition 4 piliers, 3 leviers prioritaires chiffrés, simulation d\'impact 90 jours, restitution stratégique 60 min.',
                    url: 'https://finsight.zineinsight.com/tarifs#diagnostic',
                },
                {
                    '@type': 'Offer',
                    name: 'Audit Complet',
                    price: '4990',
                    priceCurrency: 'EUR',
                    description:
                        'Diagnostic + analyse rentabilité par activité, vision trésorerie 24 mois, cockpit décisionnel, plan d\'action chiffré sur 6 mois, formation + 1 mois support.',
                    url: 'https://finsight.zineinsight.com/tarifs#audit',
                },
                {
                    '@type': 'Offer',
                    name: 'Decision System',
                    price: '9990',
                    priceCurrency: 'EUR',
                    description:
                        'Audit Complet + cockpit dirigeant temps réel, alertes automatiques, scénarios de croissance, formation équipe + 3 mois d\'accompagnement.',
                    url: 'https://finsight.zineinsight.com/tarifs#decision-system',
                },
            ],
        },
    }

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://finsight.zineinsight.com' },
            { '@type': 'ListItem', position: 2, name: 'Tarifs', item: 'https://finsight.zineinsight.com/tarifs' },
        ],
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <StructuredData data={offersSchema} />
            <StructuredData data={faqSchema} />
            <StructuredData data={breadcrumbSchema} />
            <Header />

            {/* ============================================
                HERO — Clarté sur les tarifs
               ============================================ */}
            <section className="pt-20 pb-16 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-6">
                            Tarifs
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            Un pilotage financier{' '}
                            <span className="text-accent-primary">à la hauteur de vos enjeux</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                            Trois niveaux d&apos;accompagnement pour les PME de 2 à 20&nbsp;M€ de CA.
                            Missions ponctuelles, tarifs transparents, sans engagement récurrent.
                        </p>

                        {/* Trust strip */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-accent-primary" />
                                <span>Tarifs HT · Sans surprise</span>
                            </div>
                            <span className="hidden sm:block text-slate-300">|</span>
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-accent-primary" />
                                <span>Sans engagement</span>
                            </div>
                            <span className="hidden sm:block text-slate-300">|</span>
                            <div className="flex items-center gap-2">
                                <span className="text-amber-500">★</span>
                                <span>{SOCIAL_PROOF_LABEL}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============================================
                OFFRES — 3 cartes DAF
               ============================================ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* ── Diagnostic FinSight™ 90J ── */}
                        <motion.div
                            id="diagnostic"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Offre Signature
                            </p>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                Diagnostic FinSight™ 90J
                            </h2>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-4xl font-bold text-slate-900">1&nbsp;990</span>
                                <span className="text-slate-500">€ HT</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-6">Mission ponctuelle · 5 jours ouvrés</p>

                            <p className="text-slate-600 mb-6">
                                Clarté stratégique complète : un état des lieux chiffré de votre santé financière avec plan d&apos;action.
                            </p>

                            <ul className="space-y-3 mb-8">
                                {[
                                    'Score FinSight™ 0–100 détaillé',
                                    'Décomposition 4 piliers Cash · Marges · Résilience · Risques',
                                    '3 leviers prioritaires chiffrés (anomalies incluses)',
                                    'Simulation d\'impact à 90 jours',
                                    'Restitution stratégique 60 min avec plan d\'action',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-4 text-center bg-white border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white font-bold rounded-xl transition-all duration-200"
                            >
                                Lancer le diagnostic
                            </a>
                        </motion.div>

                        {/* ── Audit Complet — Featured ── */}
                        <motion.div
                            id="audit"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl lg:scale-105"
                        >
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent-primary text-white text-xs font-bold rounded-full shadow-lg">
                                Recommandé
                            </div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Structuration &amp; Pilotage
                            </p>
                            <h2 className="text-2xl font-bold mb-2">Audit Complet</h2>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-4xl font-bold">4&nbsp;990</span>
                                <span className="text-gray-400">€ HT</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">Mission structurante · Paiement échelonnable</p>

                            <p className="text-gray-300 mb-6">
                                Visibilité complète, arbitrages rapides, décisions structurées sur 6 mois.
                            </p>

                            <ul className="space-y-3 mb-8">
                                {[
                                    'Tout le Diagnostic FinSight™ 90J',
                                    'Analyse de rentabilité réelle par activité',
                                    'Vision trésorerie fiabilisée sur 24 mois',
                                    'Cockpit décisionnel sur mesure',
                                    'Modèle de rentabilité analytique',
                                    'Plan d\'action chiffré sur 6 mois',
                                    'Formation 2h + 1 mois de support',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-4 text-center bg-accent-primary hover:bg-accent-primary-hover text-white font-bold rounded-xl transition-all duration-200 shadow-lg"
                            >
                                Réserver un audit
                            </a>
                        </motion.div>

                        {/* ── Decision System ── */}
                        <motion.div
                            id="decision-system"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Système décisionnel
                            </p>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Decision System</h2>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-4xl font-bold text-slate-900">9&nbsp;990</span>
                                <span className="text-slate-500">€ HT</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-6">Accompagnement complet · 3 mois inclus</p>

                            <p className="text-slate-600 mb-6">
                                Un pilotage financier autonome, fiable et durable pour prendre le contrôle de votre croissance.
                            </p>

                            <ul className="space-y-3 mb-8">
                                {[
                                    'Tout l\'Audit Complet',
                                    'Cockpit décisionnel dirigeant temps réel',
                                    'Alertes automatiques sur anomalies clés',
                                    'Scénarios de croissance simulés en continu',
                                    'Maîtrise totale des marges et du cash',
                                    'Formation équipe + 3 mois d\'accompagnement',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-4 text-center bg-white border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white font-bold rounded-xl transition-all duration-200"
                            >
                                Planifier un échange stratégique
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                COMPARATIF — Tableau simple 
               ============================================ */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Comparatif des offres
                        </h2>
                        <p className="text-lg text-slate-600">
                            Chaque niveau intègre les livrables du précédent
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="overflow-x-auto"
                    >
                        <table className="w-full text-sm border-collapse bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="text-left p-4 font-semibold">Livrable</th>
                                    <th className="text-center p-4 font-semibold">Diagnostic<br /><span className="text-xs font-normal text-gray-400">1 990 €</span></th>
                                    <th className="text-center p-4 font-semibold bg-accent-primary/20">Audit Complet<br /><span className="text-xs font-normal text-gray-300">4 990 €</span></th>
                                    <th className="text-center p-4 font-semibold">Decision System<br /><span className="text-xs font-normal text-gray-400">9 990 €</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { label: 'Score FinSight™ 0–100', d: true, a: true, s: true },
                                    { label: 'Décomposition 4 piliers', d: true, a: true, s: true },
                                    { label: '3 leviers prioritaires chiffrés', d: true, a: true, s: true },
                                    { label: 'Simulation impact 90 jours', d: true, a: true, s: true },
                                    { label: 'Restitution stratégique 60 min', d: true, a: true, s: true },
                                    { label: 'Analyse rentabilité par activité', d: false, a: true, s: true },
                                    { label: 'Vision trésorerie 24 mois', d: false, a: true, s: true },
                                    { label: 'Cockpit décisionnel sur mesure', d: false, a: true, s: true },
                                    { label: 'Plan d\'action chiffré 6 mois', d: false, a: true, s: true },
                                    { label: 'Formation 2h + 1 mois support', d: false, a: true, s: true },
                                    { label: 'Cockpit temps réel dirigeant', d: false, a: false, s: true },
                                    { label: 'Alertes automatiques anomalies', d: false, a: false, s: true },
                                    { label: 'Scénarios de croissance continus', d: false, a: false, s: true },
                                    { label: 'Formation équipe + 3 mois accompagnement', d: false, a: false, s: true },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-slate-700 font-medium">{row.label}</td>
                                        <td className="p-4 text-center">
                                            {row.d ? (
                                                <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center bg-accent-primary/5">
                                            {row.a ? (
                                                <Check className="w-5 h-5 text-accent-primary mx-auto" />
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {row.s ? (
                                                <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </section>

            {/* ============================================
                QUALIFICATION — Diagnostic gratuit avant achat
               ============================================ */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 text-center"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-6">
                            Pas encore sûr ?
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Commencez par le diagnostic en ligne — 7 min
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto">
                            Obtenez votre Score FinSight™ (0→100) sur les 4 piliers CASH, MARGES, RÉSILIENCE, RISQUES.
                            Le résultat identifie précisément l&apos;accompagnement qui vous correspond.
                        </p>
                        <Link
                            href="/diagnostic/guide"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg shadow-white/10"
                        >
                            Lancer le diagnostic gratuit
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <p className="text-xs text-gray-600 mt-4">
                            Sans inscription · Données locales · RGPD
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ============================================
                GARANTIES & ENGAGEMENTS
               ============================================ */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Nos engagements
                        </h2>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Clock,
                                title: 'Livrables sous 5 jours',
                                desc: 'Le Diagnostic FinSight™ 90J est livré en 5 jours ouvrés maximum.',
                            },
                            {
                                icon: Shield,
                                title: 'Confidentialité totale',
                                desc: 'NDA signé avant toute transmission de données. Conformité RGPD.',
                            },
                            {
                                icon: TrendingUp,
                                title: 'ROI mesurable',
                                desc: 'Chaque mission inclut des KPIs de résultat chiffrés et vérifiables.',
                            },
                            {
                                icon: Users,
                                title: 'Interlocuteur unique',
                                desc: 'Un seul expert senior dédié à votre mission, de A à Z.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white rounded-xl p-6 border border-slate-200 text-center"
                            >
                                <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-6 h-6 text-accent-primary" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                FAQ — Tarifs-specific
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
                            Tout savoir sur nos tarifs
                        </h2>
                        <p className="text-lg text-slate-600">
                            Les réponses aux questions les plus courantes sur nos offres et nos conditions
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {faqItems.map((faq, i) => (
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
                                        {faq.question}
                                    </h3>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                                </summary>
                                <div className="px-6 pb-6">
                                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            </motion.details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                CTA FINAL — Premium
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
                            Prêt à structurer votre{' '}
                            <span className="text-accent-primary">pilotage financier</span>&nbsp;?
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Échangeons 30 minutes sur vos enjeux — sans engagement.
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

                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mt-8">
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

            {/* ============================================
                MAILLAGE — Liens stratégiques
               ============================================ */}
            <section className="py-12 bg-white border-t border-slate-100">
                <div className="max-w-5xl mx-auto px-6 lg:px-12">
                    <div className="grid sm:grid-cols-3 gap-6">
                        <Link
                            href="/consulting"
                            className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-accent-primary/30 hover:shadow-md transition-all"
                        >
                            <BarChart3 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-slate-900 group-hover:text-accent-primary transition-colors">
                                    Accompagnement DAF
                                </p>
                                <p className="text-xs text-slate-500">Détails des missions</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/methodologie"
                            className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-accent-primary/30 hover:shadow-md transition-all"
                        >
                            <Target className="w-5 h-5 text-accent-primary flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-slate-900 group-hover:text-accent-primary transition-colors">
                                    Méthodologie FinSight™
                                </p>
                                <p className="text-xs text-slate-500">Score 0–100 & 4 piliers</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/mon-diagnostic"
                            className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-accent-primary/30 hover:shadow-md transition-all"
                        >
                            <TrendingUp className="w-5 h-5 text-accent-primary flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-slate-900 group-hover:text-accent-primary transition-colors">
                                    Diagnostic en ligne
                                </p>
                                <p className="text-xs text-slate-500">Score gratuit en 7 min</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

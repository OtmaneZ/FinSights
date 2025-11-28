'use client'

import Link from 'next/link'
import { FileText, Calendar, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface BlogPost {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
}

const blogPosts: BlogPost[] = [
    {
        slug: 'calcul-dso-formule-2025',
        title: 'Comment calculer son DSO (formule PCG 2025)',
        description: 'Guide complet pour calculer le DSO avec exemples pratiques et benchmarks sectoriels français',
        date: '28 novembre 2025',
        readTime: '8 min',
        category: 'KPIs'
    },
    {
        slug: '5-kpis-financiers-pme',
        title: 'Les 5 KPIs financiers essentiels pour PME',
        description: 'Découvrez les indicateurs clés que tout dirigeant de PME devrait suivre mensuellement',
        date: '28 novembre 2025',
        readTime: '6 min',
        category: 'Gestion'
    },
    {
        slug: 'bfr-formule-optimisation',
        title: 'BFR : formule de calcul et optimisation 2025',
        description: 'Tout savoir sur le Besoin en Fonds de Roulement : calcul, interprétation et leviers d\'optimisation',
        date: '28 novembre 2025',
        readTime: '10 min',
        category: 'Trésorerie'
    },
    {
        slug: 'marge-nette-vs-brute',
        title: 'Marge nette vs marge brute : différences et calculs',
        description: 'Comprenez la différence entre marge brute et marge nette avec formules et benchmarks sectoriels',
        date: '28 novembre 2025',
        readTime: '7 min',
        category: 'Rentabilité'
    },
    {
        slug: 'cash-flow-previsionnel-pme',
        title: 'Cash flow prévisionnel : méthode pratique pour PME',
        description: 'Guide complet pour construire un cash flow prévisionnel fiable et anticiper vos besoins de trésorerie',
        date: '28 novembre 2025',
        readTime: '9 min',
        category: 'Trésorerie'
    },
    {
        slug: 'top-7-kpis-startups-saas',
        title: 'Top 7 KPIs financiers pour startups SaaS',
        description: 'Les indicateurs essentiels pour piloter une startup SaaS : MRR, Churn, CAC, LTV et plus',
        date: '28 novembre 2025',
        readTime: '8 min',
        category: 'SaaS'
    },
    {
        slug: 'creances-clients-reduire-impayes',
        title: 'Créances clients : comment réduire les impayés',
        description: 'Stratégies concrètes pour améliorer le recouvrement et diminuer les retards de paiement',
        date: '28 novembre 2025',
        readTime: '7 min',
        category: 'Recouvrement'
    },
    {
        slug: 'tresorerie-pme-5-erreurs-eviter',
        title: 'Trésorerie PME : 5 erreurs à éviter',
        description: 'Les erreurs fréquentes qui mettent en péril la trésorerie des PME et comment les éviter',
        date: '28 novembre 2025',
        readTime: '6 min',
        category: 'Trésorerie'
    },
    {
        slug: 'ratio-liquidite-interpretation',
        title: 'Ratio de liquidité : interpréter les résultats',
        description: 'Comprendre les ratios de liquidité et évaluer la santé financière de votre entreprise',
        date: '28 novembre 2025',
        readTime: '8 min',
        category: 'Analyse'
    },
    {
        slug: 'budget-previsionnel-dashboard-ia',
        title: 'Budget prévisionnel : template Excel vs dashboard IA',
        description: 'Comparaison des méthodes pour construire et suivre votre budget prévisionnel efficacement',
        date: '28 novembre 2025',
        readTime: '7 min',
        category: 'Outils'
    }
]

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section */}
            <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                        <FileText className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-medium">Blog Finance</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4">
                        Finance × Data × IA
                    </h1>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">
                        Guides pratiques, formules financières et conseils pour CFO et DAF
                    </p>
                </div>

                {/* Articles Grid */}
                <div className="space-y-6">
                    {blogPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="block surface rounded-xl p-8 border border-border-default hover:border-accent-primary-border transition-all hover:shadow-lg group"
                        >
                            <div className="flex items-start justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 bg-accent-primary-subtle text-accent-primary text-xs font-medium rounded-full">
                                            {post.category}
                                        </span>
                                        <span className="flex items-center gap-2 text-tertiary text-sm">
                                            <Calendar className="w-4 h-4" />
                                            {post.date}
                                        </span>
                                        <span className="text-tertiary text-sm">
                                            • {post.readTime} de lecture
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-accent-primary transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-secondary leading-relaxed">
                                        {post.description}
                                    </p>
                                </div>
                                <ArrowRight className="w-6 h-6 text-accent-primary flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 surface rounded-2xl p-12 border border-accent-primary-border text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Automatisez votre analyse financière
                    </h2>
                    <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
                        FinSight calcule automatiquement tous vos KPIs depuis vos exports comptables
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
                    >
                        Essayer gratuitement
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

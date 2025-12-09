'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FileText, Calendar, ArrowRight, Search, TrendingUp, DollarSign, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useMemo } from 'react'

interface BlogPost {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
    tags: string[] // 🏷️ Tags pour navigation granulaire
    featured?: boolean // Pour l'article hero
}

const blogPosts: BlogPost[] = [
    {
        slug: 'calcul-dso-formule-2025',
        title: 'Comment calculer son DSO (formule PCG 2025)',
        description: 'Guide complet pour calculer le DSO avec exemples pratiques et benchmarks sectoriels français',
        date: '28 novembre 2025',
        readTime: '8 min',
        category: 'KPIs',
        tags: ['DSO', 'Trésorerie', 'Formule', 'PCG 2025'],
        featured: true // 🌟 Article hero
    },
    {
        slug: '5-kpis-financiers-pme',
        title: 'Les 5 KPIs financiers essentiels pour PME',
        description: 'Découvrez les indicateurs clés que tout dirigeant de PME devrait suivre mensuellement',
        date: '28 novembre 2025',
        readTime: '6 min',
        category: 'Gestion',
        tags: ['KPIs', 'PME', 'Indicateurs', 'Pilotage']
    },
    {
        slug: 'bfr-formule-optimisation',
        title: 'BFR : formule de calcul et optimisation 2025',
        description: 'Tout savoir sur le Besoin en Fonds de Roulement : calcul, interprétation et leviers d\'optimisation',
        date: '28 novembre 2025',
        readTime: '10 min',
        category: 'Trésorerie',
        tags: ['BFR', 'Trésorerie', 'Optimisation', 'Formule']
    },
    {
        slug: 'marge-nette-vs-brute',
        title: 'Marge nette vs marge brute : différences et calculs',
        description: 'Comprenez la différence entre marge brute et marge nette avec formules et benchmarks sectoriels',
        date: '28 novembre 2025',
        readTime: '7 min',
        category: 'Rentabilité',
        tags: ['Marges', 'Rentabilité', 'Calcul', 'Benchmark']
    },
    {
        slug: 'cash-flow-previsionnel-pme',
        title: 'Cash flow prévisionnel : méthode pratique pour PME',
        description: 'Guide complet pour construire un cash flow prévisionnel fiable et anticiper vos besoins de trésorerie',
        date: '28 novembre 2025',
        readTime: '9 min',
        category: 'Trésorerie',
        tags: ['Cash Flow', 'Prévisionnel', 'PME', 'Méthode']
    },
    {
        slug: 'top-7-kpis-startups-saas',
        title: 'Top 7 KPIs financiers pour startups SaaS',
        description: 'Les indicateurs essentiels pour piloter une startup SaaS : MRR, Churn, CAC, LTV et plus',
        date: '28 novembre 2025',
        readTime: '8 min',
        category: 'SaaS',
        tags: ['SaaS', 'MRR', 'Churn', 'CAC', 'LTV']
    },
    {
        slug: 'creances-clients-reduire-impayes',
        title: 'Créances clients : comment réduire les impayés',
        description: 'Stratégies concrètes pour améliorer le recouvrement et diminuer les retards de paiement',
        date: '28 novembre 2025',
        readTime: '7 min',
        category: 'Recouvrement',
        tags: ['Créances', 'Impayés', 'Recouvrement', 'DSO']
    },
    {
        slug: 'tresorerie-pme-5-erreurs-eviter',
        title: 'Trésorerie PME : 5 erreurs à éviter',
        description: 'Les erreurs fréquentes qui mettent en péril la trésorerie des PME et comment les éviter',
        date: '28 novembre 2025',
        readTime: '6 min',
        category: 'Trésorerie',
        tags: ['Trésorerie', 'PME', 'Erreurs', 'Conseils']
    },
    {
        slug: 'ratio-liquidite-interpretation',
        title: 'Ratio de liquidité : interpréter les résultats',
        description: 'Comprendre les ratios de liquidité et évaluer la santé financière de votre entreprise',
        date: '28 novembre 2025',
        readTime: '8 min',
        category: 'Analyse',
        tags: ['Ratios', 'Liquidité', 'Analyse', 'Santé financière']
    },
    {
        slug: 'budget-previsionnel-dashboard-ia',
        title: 'Budget prévisionnel : template Excel vs dashboard IA',
        description: 'Comparaison des méthodes pour construire et suivre votre budget prévisionnel efficacement',
        date: '28 novembre 2025',
        readTime: '7 min',
        category: 'Outils',
        tags: ['Budget', 'IA', 'Excel', 'Dashboard']
    }
]

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous')

    // Extract unique categories
    const categories = ['Tous', ...Array.from(new Set(blogPosts.map(p => p.category)))]

    // Filter posts
    const filteredPosts = useMemo(() => {
        return blogPosts.filter(post => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [searchQuery, selectedCategory])

    // Split featured and regular posts
    const featuredPost = filteredPosts.find(p => p.featured)
    const regularPosts = filteredPosts.filter(p => !p.featured)

    // Icon pour catégories
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'KPIs': return <TrendingUp className="w-4 h-4" />
            case 'Trésorerie': return <DollarSign className="w-4 h-4" />
            case 'SaaS': return <Sparkles className="w-4 h-4" />
            default: return <FileText className="w-4 h-4" />
        }
    }

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
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

                {/* 🔍 Search + Filters */}
                <div className="mb-12 space-y-4">
                    {/* Barre de recherche */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                        <input
                            type="text"
                            placeholder="Rechercher un article..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 surface rounded-xl border border-border-default focus:border-accent-primary-border focus:ring-2 focus:ring-accent-primary/20 transition-all text-base"
                        />
                    </div>

                    {/* Filtres catégories */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${selectedCategory === category
                                    ? 'bg-accent-primary text-white shadow-lg'
                                    : 'bg-surface-elevated text-secondary hover:bg-accent-primary-subtle hover:text-accent-primary border border-border-subtle'
                                    }`}
                            >
                                {category !== 'Tous' && getCategoryIcon(category)}
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 🌟 Featured Article (Hero) */}
                {featuredPost && (
                    <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="block mb-12 surface rounded-2xl overflow-hidden border border-border-default hover:border-accent-primary-border transition-all hover:shadow-2xl group"
                    >
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Image article vedette */}
                            <div className="relative h-80 md:h-auto overflow-hidden">
                                <Image
                                    src="/blog/calcul_dso.png"
                                    alt={featuredPost.title}
                                    width={800}
                                    height={600}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    priority
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-accent-primary text-sm font-bold rounded-full shadow-lg">
                                        ⭐ Article vedette
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-accent-primary-subtle text-accent-primary text-xs font-medium rounded-full">
                                        {featuredPost.category}
                                    </span>
                                    <span className="flex items-center gap-2 text-tertiary text-sm">
                                        <Calendar className="w-4 h-4" />
                                        {featuredPost.date}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-accent-primary transition-colors">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-lg text-secondary leading-relaxed mb-6">
                                    {featuredPost.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-tertiary">⏱️ {featuredPost.readTime} de lecture</span>
                                    <div className="flex items-center gap-2 text-accent-primary font-semibold group-hover:gap-3 transition-all">
                                        Lire l'article
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* 📚 Regular Articles Grid */}
                <div className="space-y-6">
                    {regularPosts.length > 0 ? (
                        regularPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="block surface rounded-xl p-8 border border-border-default hover:border-accent-primary-border transition-all hover:shadow-lg group"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setSelectedCategory(post.category)
                                                }}
                                                className="px-3 py-1 bg-accent-primary-subtle text-accent-primary text-xs font-medium rounded-full hover:bg-accent-primary hover:text-white transition-all"
                                            >
                                                {post.category}
                                            </button>
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
                        ))
                    ) : (
                        <div className="text-center py-16 surface rounded-xl border border-border-default">
                            <Search className="w-16 h-16 mx-auto text-tertiary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                            <p className="text-secondary mb-6">
                                Essayez de modifier votre recherche ou sélectionner une autre catégorie
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('Tous')
                                }}
                                className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-hover transition-all"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    )}
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

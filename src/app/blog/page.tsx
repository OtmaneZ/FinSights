'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FileText, Calendar, ArrowRight, Search, TrendingUp, DollarSign, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReadingProgressBar from '@/components/ReadingProgressBar'
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
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

    // Extract unique categories and tags
    const categories = ['Tous', ...Array.from(new Set(blogPosts.map(p => p.category)))]
    const allTags = Array.from(new Set(blogPosts.flatMap(p => p.tags)))

    // Filter posts
    const filteredPosts = useMemo(() => {
        return blogPosts.filter(post => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory
            const matchesTag = !selectedTag || post.tags.includes(selectedTag)
            return matchesSearch && matchesCategory && matchesTag
        })
    }, [searchQuery, selectedCategory, selectedTag])

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
            {/* 📊 Barre de progression de lecture */}
            <ReadingProgressBar />

            <Header />

            {/* Hero Section - Corporate */}
            <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-primary tracking-tight">
                        Ressources Finance & Data
                    </h1>
                    <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
                        Guides méthodologiques, formules de calcul et best practices pour le pilotage financier
                    </p>
                </div>

                {/* Search + Filters - Plus sobre */}
                <div className="mb-16 space-y-6">
                    {/* Barre de recherche */}
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 surface rounded-lg border border-border-default focus:border-accent-primary transition-all text-base"
                        />
                    </div>

                    {/* Filtres catégories minimalistes */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category
                                    ? 'bg-accent-primary text-white'
                                    : 'bg-surface-elevated text-secondary hover:text-accent-primary border border-border-default hover:border-accent-primary'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Badge tag actif sobre */}
                    {selectedTag && (
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border-default rounded-lg text-sm">
                                <span className="text-secondary">Filtre : <strong className="text-primary">{selectedTag}</strong></span>
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className="ml-1 text-tertiary hover:text-primary"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Featured Article - Plus sobre */}
                {featuredPost && (
                    <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="block mb-16 surface rounded-xl p-10 border border-border-default hover:border-accent-primary transition-all group"
                    >
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-xs text-tertiary uppercase tracking-wider font-medium">
                                    {featuredPost.category}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-border-default"></span>
                                <span className="text-sm text-tertiary">
                                    {featuredPost.date}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-border-default"></span>
                                <span className="text-sm text-tertiary">
                                    {featuredPost.readTime}
                                </span>
                            </div>
                            <h2 className="text-4xl font-bold mb-4 text-primary group-hover:text-accent-primary transition-colors leading-tight">
                                {featuredPost.title}
                            </h2>
                            <p className="text-lg text-secondary leading-relaxed mb-6">
                                {featuredPost.description}
                            </p>
                            <div className="flex items-center gap-2 text-accent-primary font-semibold">
                                Lire l'article
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                )}

                {/* Articles Grid - Corporate clean */}
                <div className="space-y-6">
                    {regularPosts.length > 0 ? (
                        regularPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="block surface rounded-lg p-8 border border-border-default hover:border-accent-primary transition-all group"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs text-tertiary uppercase tracking-wider font-medium">
                                                {post.category}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-border-default"></span>
                                            <span className="text-sm text-tertiary">
                                                {post.date}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-border-default"></span>
                                            <span className="text-sm text-tertiary">
                                                {post.readTime}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-3 text-primary group-hover:text-accent-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-secondary leading-relaxed">
                                            {post.description}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-accent-primary flex-shrink-0 group-hover:translate-x-1 transition-transform mt-1" />
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
                                    setSelectedTag(null)
                                }}
                                className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-hover transition-all"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    )}
                </div>

                {/* CTA Section sobre */}
                <div className="mt-20 surface rounded-xl p-12 border border-border-default text-center">
                    <h2 className="text-3xl font-bold mb-4 text-primary">
                        Automatisez votre pilotage financier
                    </h2>
                    <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                        Dashboards FP&A sur-mesure avec calcul automatique de vos KPIs
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"
                        >
                            Voir la démo
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/consulting"
                            className="inline-flex items-center gap-2 px-8 py-4 border border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold transition-all"
                        >
                            Projets sur-mesure
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

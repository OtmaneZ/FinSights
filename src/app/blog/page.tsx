'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
    FileText, 
    Calendar, 
    ArrowRight, 
    Search, 
    TrendingUp, 
    DollarSign, 
    Sparkles,
    Clock,
    ChevronRight,
    BookOpen,
    Target,
    BarChart3,
    Zap
} from 'lucide-react'
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
    tags: string[]
    featured?: boolean
    image?: string
}

const blogPosts: BlogPost[] = [
    {
        slug: 'dashboard-financier-mort-agents-ia-2026',
        title: 'Pourquoi votre Dashboard Financier est mort (et ce qui le remplace en 2026)',
        description: 'Le Dashboard affiche le passé. Les Agents IA prédisent l\'avenir. Découvrez DASHIS, TRESORIS, MARGIS et SCENARIS : la révolution du pilotage automatique 24/7',
        date: '9 février 2026',
        readTime: '8 min',
        category: 'Intelligence Artificielle',
        tags: ['Agents IA', 'Automation', 'Trésorerie', 'Pilotage', 'Dashboard'],
        featured: true,
        image: '/images/ai-oversight-control.png'
    },
    {
        slug: 'lire-bilan-compte-resultat-guide-pratique',
        title: 'Lire un bilan et un compte de résultat : guide pratique',
        description: 'Apprenez à décrypter vos états financiers en 15 minutes : bilan, compte de résultat, signaux d\'alerte et questions à poser à votre comptable',
        date: '25 janvier 2026',
        readTime: '12 min',
        category: 'Gestion',
        tags: ['Bilan', 'Compte de résultat', 'États financiers', 'Comptabilité'],
        featured: false,
        image: '/images/bureau-nuit.png'
    },
    {
        slug: 'eva-roic-illusion-performance',
        title: 'Pourquoi une entreprise rentable peut détruire de la valeur',
        description: 'EVA, ROIC et WACC : découvrez pourquoi la rentabilité comptable ne suffit pas et comment mesurer la création de valeur réelle',
        date: '25 janvier 2026',
        readTime: '14 min',
        category: 'Analyse',
        tags: ['EVA', 'ROIC', 'WACC', 'Valeur', 'Performance'],
        featured: false,
        image: '/images/bureau.png'
    },
    {
        slug: '5-erreurs-tresorerie-pme',
        title: '5 erreurs de trésorerie qui coûtent cher aux PME',
        description: 'Les erreurs fatales que commettent 80% des dirigeants de PME avec leur trésorerie, et comment les éviter',
        date: '18 décembre 2025',
        readTime: '7 min',
        category: 'Trésorerie',
        tags: ['Trésorerie', 'PME', 'Erreurs', 'Cash', 'Pilotage'],
        featured: false,
        image: '/images/bureau-nuit.png'
    },
    {
        slug: 'calcul-dso-formule-2025',
        title: 'Comment calculer son DSO (formule PCG 2025)',
        description: 'Guide complet pour calculer le DSO avec exemples pratiques et benchmarks sectoriels français',
        date: '16 décembre 2025',
        readTime: '8 min',
        category: 'KPIs',
        tags: ['DSO', 'Trésorerie', 'Formule', 'PCG 2025'],
        image: '/images/vue-NY.png'
    },
    {
        slug: '5-kpis-financiers-pme',
        title: 'Les 5 KPIs financiers essentiels pour PME',
        description: 'Découvrez les indicateurs clés que tout dirigeant de PME devrait suivre mensuellement',
        date: '18 décembre 2025',
        readTime: '6 min',
        category: 'Gestion',
        tags: ['KPIs', 'PME', 'Indicateurs', 'Pilotage'],
        image: '/images/bureau.png'
    },
    {
        slug: 'bfr-formule-optimisation',
        title: 'BFR : formule de calcul et optimisation 2025',
        description: 'Tout savoir sur le Besoin en Fonds de Roulement : calcul, interprétation et leviers d\'optimisation',
        date: '17 décembre 2025',
        readTime: '10 min',
        category: 'Trésorerie',
        tags: ['BFR', 'Trésorerie', 'Optimisation', 'Formule'],
        image: '/images/bfr.png'   
    },
    {
        slug: 'marge-nette-vs-brute',
        title: 'Marge nette vs marge brute : différences et calculs',
        description: 'Comprenez la différence entre marge brute et marge nette avec formules et benchmarks sectoriels',
        date: '10 décembre 2025',
        readTime: '7 min',
        category: 'Rentabilité',
        tags: ['Marges', 'Rentabilité', 'Calcul', 'Benchmark'],
        image: '/images/marge.png'
    },
    {
        slug: 'cash-flow-previsionnel-pme',
        title: 'Cash flow prévisionnel : méthode pratique pour PME',
        description: 'Guide complet pour construire un cash flow prévisionnel fiable et anticiper vos besoins de trésorerie',
        date: '5 décembre 2025',
        readTime: '9 min',
        category: 'Trésorerie',
        tags: ['Cash Flow', 'Prévisionnel', 'PME', 'Méthode'],
        image: '/images/cash-flow-prev.png',
    },
    {
        slug: 'top-7-kpis-startups-saas',
        title: 'Top 7 KPIs financiers pour startups SaaS',
        description: 'Les indicateurs essentiels pour piloter une startup SaaS : MRR, Churn, CAC, LTV et plus',
        date: '2 décembre 2025',
        readTime: '8 min',
        category: 'SaaS',
        tags: ['SaaS', 'MRR', 'Churn', 'CAC', 'LTV'],
        image: '/images/7kpisfiSaaS.png'
    },
    {
        slug: 'creances-clients-reduire-impayes',
        title: 'Créances clients : comment réduire les impayés',
        description: 'Stratégies concrètes pour améliorer le recouvrement et diminuer les retards de paiement',
        date: '25 novembre 2025',
        readTime: '7 min',
        category: 'Recouvrement',
        tags: ['Créances', 'Impayés', 'Recouvrement', 'DSO'],
        image: '/images/impayés.png'
    },
    {
        slug: 'tresorerie-pme-5-erreurs-eviter',
        title: 'Trésorerie PME : 5 erreurs à éviter',
        description: 'Les erreurs fréquentes qui mettent en péril la trésorerie des PME et comment les éviter',
        date: '18 novembre 2025',
        readTime: '6 min',
        category: 'Trésorerie',
        tags: ['Trésorerie', 'PME', 'Erreurs', 'Conseils'],
        image: '/images/5-erreurs.png'
    },
    {
        slug: 'ratio-liquidite-interpretation',
        title: 'Ratio de liquidité : interpréter les résultats',
        description: 'Comprendre les ratios de liquidité et évaluer la santé financière de votre entreprise',
        date: '12 novembre 2025',
        readTime: '8 min',
        category: 'Analyse',
        tags: ['Ratios', 'Liquidité', 'Analyse', 'Santé financière'],
        image: '/images/ratio-liquidité.png'
    },
    {
        slug: 'budget-previsionnel-dashboard-ia',
        title: 'Budget prévisionnel : template Excel vs dashboard IA',
        description: 'Comparaison des méthodes pour construire et suivre votre budget prévisionnel efficacement',
        date: '5 novembre 2025',
        readTime: '7 min',
        category: 'Outils',
        tags: ['Budget', 'IA', 'Excel', 'Dashboard'],
        image: '/images/moi-bureau.png'
    },
    // SEO optimized articles (January 2026)
    {
        slug: 'reduire-dso-50-pourcent-90-jours',
        title: 'Réduire son DSO de 50% en 90 jours : Guide Pratique',
        description: 'Méthode éprouvée pour améliorer votre DSO et libérer jusqu\'à 200k€ de trésorerie. 10 actions concrètes + cas client.',
        date: '28 janvier 2026',
        readTime: '12 min',
        category: 'Trésorerie',
        tags: ['DSO', 'Réduire DSO', 'Trésorerie', 'Recouvrement', 'PME'],
        featured: true,
        image: '/images/bureau-nuit.png'
    },
    {
        slug: 'bfr-negatif-bon-ou-mauvais',
        title: 'BFR Négatif : Bon ou Mauvais pour Votre Entreprise ?',
        description: 'Un BFR négatif est-il signe de bonne santé ou de danger ? Exemples par secteur : grande distribution, SaaS, e-commerce.',
        date: '28 janvier 2026',
        readTime: '10 min',
        category: 'Trésorerie',
        tags: ['BFR', 'BFR Négatif', 'Trésorerie', 'Analyse'],
        image: '/images/bfr.png'
    },
    {
        slug: 'dso-vs-dpo-optimiser-tresorerie',
        title: 'DSO vs DPO : Optimiser l\'Équilibre Clients-Fournisseurs',
        description: 'Comprendre la différence DSO/DPO et optimiser votre Cash Conversion Cycle pour libérer de la trésorerie.',
        date: '28 janvier 2026',
        readTime: '9 min',
        category: 'Trésorerie',
        tags: ['DSO', 'DPO', 'Cash Conversion Cycle', 'Trésorerie'],
        image: '/images/vue-NY.png'
    },
    // SEO Priority Articles (February 2026)
    {
        slug: 'daf-externalise-pme-prix-2026',
        title: 'DAF Externalisé PME : Prix, Tarifs et ROI en 2026',
        description: 'Combien coûte un DAF externalisé pour une PME ? Grille tarifaire 2026, comparaison DAF temps plein vs externalisé, et calcul du ROI réel.',
        date: '6 février 2026',
        readTime: '15 min',
        category: 'Gestion',
        tags: ['DAF Externalisé', 'Prix', 'Tarifs', 'ROI', 'PME', 'CFO'],
        featured: true,
        image: '/images/bureau.png'
    },
    {
        slug: 'probleme-tresorerie-pme-10-signes',
        title: 'Problème de Trésorerie PME : 10 Signes d\'Alerte (et Solutions)',
        description: 'Comment détecter un problème de trésorerie avant qu\'il ne soit trop tard ? 10 signaux d\'alerte + plan d\'action en 30 jours.',
        date: '6 février 2026',
        readTime: '12 min',
        category: 'Trésorerie',
        tags: ['Problème Trésorerie', 'PME', 'Alerte', 'Cash', 'Solutions'],
        featured: true,
        image: '/images/bureau-nuit.png'
    },
    {
        slug: 'calculer-bfr-excel-template-2026',
        title: 'Calculer son BFR avec Excel : Template Gratuit 2026',
        description: 'Tutoriel complet pour calculer et analyser votre BFR dans Excel. Template gratuit + formules automatiques + exemples par secteur.',
        date: '6 février 2026',
        readTime: '10 min',
        category: 'Trésorerie',
        tags: ['BFR', 'Excel', 'Template', 'Calcul', 'Formules'],
        image: '/images/bfr.png'
    },
    {
        slug: 'pilotage-tresorerie-90-jours-methode',
        title: 'Pilotage Trésorerie 90 Jours : Méthode Complète PME',
        description: 'Comment piloter sa trésorerie sur 90 jours ? Méthode éprouvée avec prévisionnel, suivi hebdomadaire et alertes automatiques.',
        date: '6 février 2026',
        readTime: '14 min',
        category: 'Trésorerie',
        tags: ['Pilotage Trésorerie', '90 Jours', 'Prévisionnel', 'Méthode', 'PME'],
        image: '/images/cash-flow-prev.png'
    },
    {
        slug: 'fractional-cfo-france-guide-2026',
        title: 'Fractional CFO France : Guide Complet 2026',
        description: 'Qu\'est-ce qu\'un Fractional CFO ? Différences avec DAF externalisé, cas d\'usage, tarifs et comment choisir le bon profil pour votre PME.',
        date: '6 février 2026',
        readTime: '13 min',
        category: 'Gestion',
        tags: ['Fractional CFO', 'CFO', 'DAF', 'France', 'Guide'],
        image: '/images/moi-bureau.png'
    }
]

// Catégorie icons
const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    'Trésorerie': { 
        icon: <DollarSign className="w-4 h-4" />, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-100' 
    },
    'KPIs': { 
        icon: <TrendingUp className="w-4 h-4" />, 
        color: 'text-blue-600', 
        bg: 'bg-blue-100' 
    },
    'SaaS': { 
        icon: <Sparkles className="w-4 h-4" />, 
        color: 'text-purple-600', 
        bg: 'bg-purple-100' 
    },
    'Gestion': { 
        icon: <BarChart3 className="w-4 h-4" />, 
        color: 'text-orange-600', 
        bg: 'bg-orange-100' 
    },
    'Rentabilité': { 
        icon: <Target className="w-4 h-4" />, 
        color: 'text-rose-600', 
        bg: 'bg-rose-100' 
    },
    'Recouvrement': { 
        icon: <FileText className="w-4 h-4" />, 
        color: 'text-amber-600', 
        bg: 'bg-amber-100' 
    },
    'Analyse': { 
        icon: <BookOpen className="w-4 h-4" />, 
        color: 'text-cyan-600', 
        bg: 'bg-cyan-100' 
    },
    'Outils': { 
        icon: <Sparkles className="w-4 h-4" />, 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-100' 
    }
}

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous')

    const categories = ['Tous', ...Array.from(new Set(blogPosts.map(p => p.category)))]

    const filteredPosts = useMemo(() => {
        return blogPosts.filter(post => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [searchQuery, selectedCategory])

    const featuredPost = filteredPosts.find(p => p.featured)
    const regularPosts = filteredPosts.filter(p => !p.featured)

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* ============================================
                HERO SECTION - Premium Blog Style
               ============================================ */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/bureau-nuit.png"
                        alt="Blog Finance"
                        fill
                        className="object-cover opacity-15"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
                </div>

                {/* Decorative */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-accent-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-6">
                            <BookOpen className="w-4 h-4 text-accent-primary" />
                            <span className="text-accent-primary text-sm font-semibold">
                                Ressources Finance & Data
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Guides, formules et
                            <span className="text-accent-primary"> best practices</span>
                            <br />pour le pilotage financier
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                            Méthodes éprouvées, exemples concrets et benchmarks sectoriels 
                            pour optimiser la gestion de votre PME.
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-8 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <FileText className="w-4 h-4 text-accent-primary" />
                                <span><strong className="text-white">{blogPosts.length}</strong> articles</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <TrendingUp className="w-4 h-4 text-accent-primary" />
                                <span><strong className="text-white">{categories.length - 1}</strong> catégories</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-4 h-4 text-accent-primary" />
                                <span>Mis à jour <strong className="text-white">chaque semaine</strong></span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============================================
                SEARCH & FILTERS
               ============================================ */}
            <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un article..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all text-sm"
                            />
                        </div>

                        {/* Category Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {categories.map((category) => {
                                const config = categoryConfig[category]
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                            selectedCategory === category
                                                ? 'bg-accent-primary text-white shadow-md'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {config?.icon}
                                        {category}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                FEATURED ARTICLE
               ============================================ */}
            {featuredPost && selectedCategory === 'Tous' && (
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href={`/blog/${featuredPost.slug}`} className="group block">
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                                {/* Background Image */}
                                {featuredPost.image && (
                                    <div className="absolute inset-0">
                                        <Image
                                            src={featuredPost.image}
                                            alt={featuredPost.title}
                                            fill
                                            className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
                                    </div>
                                )}

                                <div className="relative p-8 lg:p-12">
                                    <div className="max-w-2xl">
                                        {/* Badge Featured */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-primary rounded-full mb-6">
                                            <Sparkles className="w-4 h-4 text-white" />
                                            <span className="text-white text-xs font-bold uppercase tracking-wider">
                                                À la une
                                            </span>
                                        </div>

                                        {/* Category */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${categoryConfig[featuredPost.category]?.bg} ${categoryConfig[featuredPost.category]?.color}`}>
                                                {categoryConfig[featuredPost.category]?.icon}
                                                {featuredPost.category}
                                            </span>
                                            <span className="text-slate-400 text-sm">{featuredPost.date}</span>
                                            <span className="text-slate-500">•</span>
                                            <span className="text-slate-400 text-sm">{featuredPost.readTime} de lecture</span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-accent-primary transition-colors leading-tight">
                                            {featuredPost.title}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                                            {featuredPost.description}
                                        </p>

                                        {/* CTA */}
                                        <div className="inline-flex items-center gap-2 text-accent-primary font-semibold group-hover:gap-4 transition-all">
                                            Lire l&apos;article
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </section>
            )}

            {/* ============================================
                ARTICLES GRID
               ============================================ */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {regularPosts.length > 0 ? (
                    <>
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {selectedCategory === 'Tous' ? 'Tous les articles' : selectedCategory}
                            </h2>
                            <span className="text-sm text-slate-500">
                                {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {regularPosts.map((post, index) => (
                                <motion.div
                                    key={post.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link 
                                        href={`/blog/${post.slug}`}
                                        className="group block h-full"
                                    >
                                        <article className="h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-accent-primary/50 transition-all duration-300">
                                            {/* Image */}
                                            <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                                                {post.image ? (
                                                    <Image
                                                        src={post.image}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className={`w-16 h-16 rounded-2xl ${categoryConfig[post.category]?.bg || 'bg-slate-200'} flex items-center justify-center`}>
                                                            <span className={`${categoryConfig[post.category]?.color || 'text-slate-400'}`}>
                                                                {categoryConfig[post.category]?.icon || <FileText className="w-8 h-8" />}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Category Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${categoryConfig[post.category]?.bg} ${categoryConfig[post.category]?.color}`}>
                                                        {categoryConfig[post.category]?.icon}
                                                        {post.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                {/* Meta */}
                                                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        {post.date}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        {post.readTime}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-accent-primary transition-colors line-clamp-2 leading-snug">
                                                    {post.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
                                                    {post.description}
                                                </p>

                                                {/* Read More */}
                                                <div className="flex items-center gap-2 text-accent-primary font-medium text-sm group-hover:gap-3 transition-all">
                                                    Lire l&apos;article
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun article trouvé</h3>
                        <p className="text-slate-600 mb-6">
                            Essayez de modifier votre recherche ou sélectionner une autre catégorie
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedCategory('Tous')
                            }}
                            className="px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold hover:bg-accent-primary-hover transition-all"
                        >
                            Voir tous les articles
                        </button>
                    </div>
                )}
            </section>

            {/* ============================================
                CTA SECTION
               ============================================ */}
            <section className="relative py-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <Image
                        src="/images/bureau.png"
                        alt="CTA Background"
                        fill
                        className="object-cover opacity-10"
                    />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-accent-primary" />
                            <span className="text-accent-primary text-sm font-semibold">
                                Prêt à agir ?
                            </span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                            Pilotage financier et agents IA au service de vos décisions
                        </h2>

                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Que vous ayez besoin de structurer votre pilotage financier ou de vous appuyer sur des agents IA décisionnels, FinSight vous accompagne pour anticiper, arbitrer et décider au bon moment.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/agents"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
                            >
                                <Zap className="w-5 h-5" />
                                Pilotage & Conseil
                            </Link>
                            <Link
                                href="/consulting"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
                            >
                                Découvrir les agents IA
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <p className="text-slate-400 text-sm mt-8">
                            ✓ 30 min gratuit • ✓ Sans engagement • ✓ Réponse sous 24h
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

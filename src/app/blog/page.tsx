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
    Zap,
    Shield,
    Briefcase,
    TrendingDown
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useMemo } from 'react'
import { BLOG_INDEX_POSTS, type BlogIndexPost } from '@/lib/blog/articlesRegistry'

const blogPosts: BlogIndexPost[] = BLOG_INDEX_POSTS

// Catégorie icons
const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    'Note Stratégique': {
        icon: <Shield className="w-4 h-4" />,
        color: 'text-slate-800',
        bg: 'bg-slate-200'
    },
    'Étude de cas': {
        icon: <TrendingDown className="w-4 h-4" />,
        color: 'text-emerald-800',
        bg: 'bg-emerald-100'
    },
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
    },
    'Intelligence Artificielle': {
        icon: <Zap className="w-4 h-4" />,
        color: 'text-purple-700',
        bg: 'bg-purple-100',
    },
    'Réglementation': {
        icon: <FileText className="w-4 h-4" />,
        color: 'text-slate-700',
        bg: 'bg-slate-100',
    },
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
                            {regularPosts.map((post, index) => {
                                const isStrategique = post.type === 'strategique'
                                return (
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
                                        <article className={`h-full rounded-2xl overflow-hidden transition-all duration-300 ${
                                            isStrategique
                                                ? 'bg-slate-950 border border-slate-800 hover:border-slate-600 hover:shadow-2xl hover:shadow-slate-900/50'
                                                : 'bg-white border border-slate-200 hover:shadow-xl hover:border-accent-primary/50'
                                        }`}>
                                            {/* Image */}
                                            <div className={`relative h-48 overflow-hidden ${
                                                isStrategique
                                                    ? 'bg-gradient-to-br from-slate-900 to-slate-800'
                                                    : 'bg-gradient-to-br from-slate-100 to-slate-200'
                                            }`}>
                                                {post.image ? (
                                                    <Image
                                                        src={post.image}
                                                        alt={post.title}
                                                        fill
                                                        className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                                                            isStrategique ? 'opacity-30' : ''
                                                        }`}
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
                                                    {post.category === 'Étude de cas' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 backdrop-blur-sm border border-emerald-400/30">
                                                            <TrendingDown className="w-3.5 h-3.5" />
                                                            Étude de cas
                                                        </span>
                                                    ) : isStrategique ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-sm border border-white/20">
                                                            <Shield className="w-3.5 h-3.5" />
                                                            Note Stratégique
                                                        </span>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${categoryConfig[post.category]?.bg} ${categoryConfig[post.category]?.color}`}>
                                                            {categoryConfig[post.category]?.icon}
                                                            {post.category}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Filet vertical Note Stratégique */}
                                                {isStrategique && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className={`p-6 ${isStrategique ? 'border-l-2 border-slate-700 ml-0' : ''}`}>
                                                {/* Meta */}
                                                <div className={`flex items-center gap-3 text-sm mb-3 ${
                                                    isStrategique ? 'text-slate-500' : 'text-slate-500'
                                                }`}>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        {post.date}
                                                    </span>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        {post.readTime}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className={`text-lg font-bold mb-3 line-clamp-2 leading-snug transition-colors ${
                                                    isStrategique
                                                        ? 'text-white font-serif group-hover:text-slate-300'
                                                        : 'text-slate-900 group-hover:text-accent-primary'
                                                }`}>
                                                    {post.title}
                                                </h3>

                                                {/* Description */}
                                                <p className={`text-sm leading-relaxed line-clamp-2 mb-4 ${
                                                    isStrategique ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                    {post.description}
                                                </p>

                                                {/* Read More */}
                                                <div className={`flex items-center gap-2 font-medium text-sm group-hover:gap-3 transition-all ${
                                                    isStrategique ? 'text-slate-400 group-hover:text-white' : 'text-accent-primary'
                                                }`}>
                                                    {post.category === 'Étude de cas' ? 'Voir les résultats' : isStrategique ? 'Lire l\u2019analyse' : 'Lire l\u2019article'}
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                                )
                            })}
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
                            Votre structure financière est-elle réellement optimisée ?
                        </h2>

                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            DSO au-dessus de la médiane, BFR qui dérive, marges qui s&apos;érodent sans que personne ne le voie - un diagnostic structuré identifie les fuites de cash avant qu&apos;elles ne deviennent critiques.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/diagnostic/guide"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 text-lg font-bold rounded-xl shadow-xl hover:bg-slate-100 transition-all"
                            >
                                <Zap className="w-5 h-5" />
                                Lancer mon diagnostic
                            </Link>
                            <a
                                href="https://calendly.com/zineinsight/15min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
                            >
                                Échanger sur ma situation
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>

                        <p className="text-slate-400 text-sm mt-8">
                            ✓ Confidentiel • ✓ Sans engagement • ✓ Réponse sous 24h
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

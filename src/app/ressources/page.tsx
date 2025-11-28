import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Calculator, Filter, Search, FileSpreadsheet } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BLOG_ARTICLES } from '@/lib/seo'

export const metadata: Metadata = {
    title: 'Ressources Financières pour PME | Articles & Calculateurs | FinSight',
    description: 'Découvrez nos articles de blog sur les KPIs financiers, calculateurs DSO et BFR, et guides pratiques pour optimiser la gestion financière de votre PME.',
    openGraph: {
        title: 'Ressources Financières pour PME | FinSight',
        description: 'Articles, calculateurs et guides gratuits pour maîtriser vos finances',
        type: 'website'
    }
}

export default function RessourcesPage() {
    // Groupe articles par catégorie
    const articlesByCategory = BLOG_ARTICLES.reduce((acc, article) => {
        if (!acc[article.category]) {
            acc[article.category] = []
        }
        acc[article.category].push(article)
        return acc
    }, {} as Record<string, typeof BLOG_ARTICLES>)

    const calculateurs = [
        {
            slug: 'dso',
            title: 'Calculateur DSO',
            description: 'Calculez votre délai moyen de paiement clients',
            icon: '📊',
            href: '/calculateurs/dso'
        },
        {
            slug: 'bfr',
            title: 'Calculateur BFR',
            description: 'Évaluez votre besoin en fonds de roulement',
            icon: '💰',
            href: '/calculateurs/bfr'
        }
    ]

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                        <BookOpen className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-medium">Ressources Gratuites</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4">
                        Centre de Ressources Financières
                    </h1>
                    <p className="text-xl text-secondary max-w-3xl mx-auto">
                        Articles, calculateurs et guides pratiques pour optimiser la gestion financière de votre PME
                    </p>
                </div>

                {/* Templates Excel - NEW */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <FileSpreadsheet className="w-6 h-6 text-accent-primary" />
                            <h2 className="text-3xl font-bold">Templates Excel Professionnels</h2>
                        </div>
                        <Link
                            href="/ressources/templates"
                            className="inline-flex items-center gap-2 px-4 py-2 text-accent-primary hover:underline font-medium"
                        >
                            Voir tous les templates →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            href="/ressources/templates"
                            className="surface rounded-2xl p-6 border-2 border-border-default hover:border-accent-primary transition-all group"
                        >
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                                Budget Prévisionnel 2025
                            </h3>
                            <p className="text-secondary text-sm mb-4">
                                12 mois de prévisions avec formules automatiques et graphiques
                            </p>
                            <span className="text-accent-primary text-sm font-medium">
                                Télécharger (.xlsx) →
                            </span>
                        </Link>
                        <Link
                            href="/ressources/templates"
                            className="surface rounded-2xl p-6 border-2 border-border-default hover:border-accent-primary transition-all group"
                        >
                            <div className="text-4xl mb-4">⏱️</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                                Tracker DSO Clients
                            </h3>
                            <p className="text-secondary text-sm mb-4">
                                Suivi des délais de paiement avec alertes conditionnelles
                            </p>
                            <span className="text-accent-primary text-sm font-medium">
                                Télécharger (.xlsx) →
                            </span>
                        </Link>
                        <Link
                            href="/ressources/templates"
                            className="surface rounded-2xl p-6 border-2 border-border-default hover:border-accent-primary transition-all group"
                        >
                            <div className="text-4xl mb-4">💰</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                                Dashboard Cash Flow
                            </h3>
                            <p className="text-secondary text-sm mb-4">
                                Pilotez votre trésorerie avec projections 6 mois
                            </p>
                            <span className="text-accent-primary text-sm font-medium">
                                Télécharger (.xlsx) →
                            </span>
                        </Link>
                    </div>
                </section>

                {/* Calculateurs */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <Calculator className="w-6 h-6 text-accent-primary" />
                        <h2 className="text-3xl font-bold">Calculateurs Gratuits</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {calculateurs.map((calc) => (
                            <Link
                                key={calc.slug}
                                href={calc.href}
                                className="surface rounded-2xl p-8 border-2 border-border-default hover:border-accent-primary transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-5xl">{calc.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                                            {calc.title}
                                        </h3>
                                        <p className="text-secondary mb-4">{calc.description}</p>
                                        <div className="inline-flex items-center gap-2 text-accent-primary font-semibold">
                                            Calculer maintenant
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Articles par catégorie */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen className="w-6 h-6 text-accent-primary" />
                        <h2 className="text-3xl font-bold">Articles de Blog</h2>
                    </div>

                    {Object.entries(articlesByCategory).map(([category, articles]) => (
                        <div key={category} className="mb-12">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-accent-primary">#</span>
                                {category}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {articles.map((article) => (
                                    <Link
                                        key={article.slug}
                                        href={`/blog/${article.slug}`}
                                        className="surface rounded-xl p-6 border border-border-default hover:border-accent-primary transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="inline-block px-3 py-1 bg-accent-primary-subtle text-accent-primary text-xs font-medium rounded-full">
                                                {article.category}
                                            </span>
                                            <span className="text-sm text-tertiary">
                                                {article.readTime} min
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </h4>
                                        <p className="text-sm text-secondary line-clamp-3 mb-4">
                                            {article.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-tertiary">
                                                {new Date(article.date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-accent-primary font-semibold group-hover:underline">
                                                Lire →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* CTA Dashboard */}
                <section className="surface rounded-2xl p-12 border-2 border-accent-primary bg-accent-primary-subtle text-center mt-16">
                    <h2 className="text-3xl font-bold mb-4">
                        Prêt à automatiser votre gestion financière ?
                    </h2>
                    <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
                        Connectez votre comptabilité et obtenez un dashboard complet avec 50+ KPIs calculés automatiquement
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
                    >
                        Essayer gratuitement
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                    <p className="text-sm text-tertiary mt-4">
                        ✅ Sans engagement • ✅ 10 questions IA gratuites • ✅ Dashboard complet
                    </p>
                </section>
            </div>

            <Footer />
        </div>
    )
}

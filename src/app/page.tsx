'use client'

import Link from 'next/link'
import {
    Sparkles,
    TrendingUp,
    Zap,
    Mail,
    Users,
    FileBarChart,
    Upload,
    ExternalLink,
    Linkedin,
    Github
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Testimonials from '@/components/Testimonials'

export default function Home() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section */}
            <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-32 text-center">
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-8 text-sm">
                    <span className="text-accent-primary font-semibold">⚡ 10 secondes</span>
                    <div className="w-px h-4 bg-accent-primary-border"></div>
                    <span className="text-accent-primary font-semibold">🔒 RGPD France</span>
                    <div className="w-px h-4 bg-accent-primary-border"></div>
                    <span className="text-accent-primary font-semibold">⭐ 4.8/5 CFO</span>
                </div>

                {/* Content */}
                <div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight text-primary">
                        Trésorerie OK ou pas ?<br />
                        <span className="text-accent-primary">Réponse en 10 secondes.</span>
                    </h1>

                    <p className="text-xl text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
                        Uploadez votre export Sage/Cegid. 15 KPIs calculés automatiquement.<br />
                        <span className="font-semibold text-primary">Vous savez si vous tenez 6 mois</span> — sans Excel, sans formules.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/auth/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-base transition-all hover:shadow-lg"
                        >
                            <Zap className="w-5 h-5" />
                            Diagnostic Gratuit →
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold text-base transition-all hover:bg-surface-elevated"
                        >
                            Voir démo (30 sec)
                        </Link>
                    </div>

                    <p className="text-sm text-tertiary mt-8">
                        ⚡ Sans installation • 🔒 RGPD conforme • ✓ Sans engagement
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <h2 className="text-2xl font-bold text-center mb-10 text-primary">Fonctionnalités</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Feature 1 - Import CSV/Excel */}
                    <div className="surface rounded-xl p-6 surface-hover group">
                        <Upload className="w-10 h-10 text-accent-primary mb-3 transition-transform group-hover:scale-110" />
                        <h3 className="text-lg font-semibold mb-2 text-primary">Import CSV/Excel</h3>
                        <p className="text-secondary text-sm leading-relaxed">
                            Drag & drop fichiers, parsing auto, 15+ KPIs calculés en temps réel
                        </p>
                    </div>

                    {/* Feature 2 - AI Copilot */}
                    <div className="surface rounded-xl p-6 surface-hover group">
                        <Sparkles className="w-10 h-10 text-accent-primary mb-3 transition-transform group-hover:scale-110" />
                        <h3 className="text-lg font-semibold mb-2 text-primary">AI Copilot</h3>
                        <p className="text-secondary text-sm leading-relaxed">
                            Interrogez vos données en langage naturel avec GPT-4o et Pinecone
                        </p>
                    </div>

                    {/* Feature 3 - D3.js Charts */}
                    <div className="surface rounded-xl p-6 surface-hover group">
                        <TrendingUp className="w-10 h-10 text-accent-primary mb-3 transition-transform group-hover:scale-110" />
                        <h3 className="text-lg font-semibold mb-2 text-primary">D3.js Charts</h3>
                        <p className="text-secondary text-sm leading-relaxed">
                            Visualisations premium : Sankey flows, Sunburst, drill-down 3 niveaux
                        </p>
                    </div>

                    {/* Feature 4 - Notifications & Collab */}
                    <div className="surface rounded-xl p-6 surface-hover group">
                        <Users className="w-10 h-10 text-accent-primary mb-3 transition-transform group-hover:scale-110" />
                        <h3 className="text-lg font-semibold mb-2 text-primary">Notifications & Collab</h3>
                        <p className="text-secondary text-sm leading-relaxed">
                            Alertes email (Resend), collaboration temps réel (Pusher), cron daily
                        </p>
                    </div>

                    {/* Feature 5 - ML Anomaly Detection */}
                    <div className="surface rounded-xl p-6 surface-hover group">
                        <Zap className="w-10 h-10 text-accent-primary mb-3 transition-transform group-hover:scale-110" />
                        <h3 className="text-lg font-semibold mb-2 text-primary">ML Anomaly Detection</h3>
                        <p className="text-secondary text-sm leading-relaxed">
                            3 algorithmes ML (Z-score, IQR, Moving Average) pour transactions suspectes
                        </p>
                    </div>

                    {/* Feature 6 - Export Pro */}
                    <div className="surface rounded-xl p-6 surface-hover group">
                        <FileBarChart className="w-10 h-10 text-accent-primary mb-3 transition-transform group-hover:scale-110" />
                        <h3 className="text-xl font-semibold mb-2">Export Pro</h3>
                        <p className="text-secondary text-sm leading-relaxed">
                            Génération PDF/Excel automatisée avec formules financières PCG 2025
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <Testimonials />

            <Footer />
        </div>
    )
}

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
    Github,
    Linkedin,
    ExternalLink
} from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
            {/* Header */}
            <header className="border-b border-border-subtle backdrop-blur-sm bg-bg-primary/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img
                            src="/images/zineinsights_logo.jpeg"
                            alt="FinSight"
                            className="w-10 h-10 rounded-lg"
                        />
                        <span className="text-xl font-semibold">FinSight</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                            Démo Live
                        </Link>
                        <a
                            href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                        </a>
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-accent-green hover:bg-accent-green-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Discutons
                        </a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-green-subtle border border-accent-green-border rounded-full mb-8">
                    <span className="text-accent-green text-sm font-medium">Portfolio Project • Production-Ready</span>
                </div>

                <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                    Dashboard Financier IA<br />
                    <span className="text-text-secondary">pour DAF & CFO</span>
                </h1>

                <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
                    Analyse temps réel • AI Copilot conversationnel • Export automatisé
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-green hover:bg-accent-green-hover text-white rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                        Voir la démo live
                        <ExternalLink className="w-5 h-5" />
                    </Link>
                    <a
                        href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-border-strong text-text-primary rounded-xl font-semibold text-lg transition-all hover:bg-surface-elevated"
                    >
                        <Linkedin className="w-5 h-5" />
                        Me contacter
                    </a>
                </div>

                <p className="text-sm text-text-tertiary mt-8">
                    3 scénarios réalistes : PME Services • Startup SaaS • Scale-up Tech
                </p>
            </section>

            {/* Screenshot Section */}
            <section className="max-w-6xl mx-auto px-6 pb-32">
                <div className="glass rounded-2xl p-2 border-2 border-border-default">
                    <img
                        src="/images/dashboard-demo.png"
                        alt="FinSight Dashboard"
                        className="w-full rounded-xl"
                        onError={(e) => {
                            // Placeholder si pas d'image
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-96 bg-surface-elevated rounded-xl flex items-center justify-center text-text-tertiary">Dashboard Screenshot (Coming Soon)</div>';
                        }}
                    />
                </div>
            </section>

            {/* About Section */}
            <section className="max-w-4xl mx-auto px-6 pb-32">
                <div className="surface rounded-2xl p-12 text-center">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-4">Créé par Otmane Boulahia</h2>
                        <p className="text-xl text-text-secondary">
                            Finance × Data Engineer
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {[
                            'TypeScript',
                            'Next.js',
                            'Python',
                            'SQL',
                            'Power BI',
                            'Finance d\'entreprise',
                            'KPIs & Modélisation',
                            'GPT-4o & Pinecone'
                        ].map((skill) => (
                            <span
                                key={skill}
                                className="px-4 py-2 bg-surface-elevated border border-border-default rounded-lg text-sm font-medium text-text-secondary"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        <a
                            href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg"
                        >
                            <Linkedin className="w-5 h-5" />
                            LinkedIn
                        </a>
                        <a
                            href="https://github.com/OtmaneZ/FinSights"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border-default hover:border-border-strong text-text-primary rounded-lg font-semibold text-sm transition-all hover:bg-surface-elevated"
                        >
                            <Github className="w-5 h-5" />
                            Code Source
                        </a>
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border-default hover:border-border-strong text-text-primary rounded-lg font-semibold text-sm transition-all hover:bg-surface-elevated"
                        >
                            Prendre RDV
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-6xl mx-auto px-6 pb-32">
                <h2 className="text-3xl font-bold text-center mb-12">7 Features Production</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Feature 1 - Import CSV/Excel */}
                    <div className="surface rounded-xl p-8 surface-hover">
                        <Upload className="w-12 h-12 text-accent-blue mb-4" />
                        <h3 className="text-2xl font-semibold mb-3">Import CSV/Excel</h3>
                        <p className="text-text-secondary leading-relaxed">
                            Drag & drop vos fichiers financiers, parsing automatique, 15+ KPIs calculés en temps réel
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="surface rounded-xl p-8 surface-hover">
                        <Sparkles className="w-12 h-12 text-accent-green mb-4" />
                        <h3 className="text-2xl font-semibold mb-3">AI Copilot</h3>
                        <p className="text-text-secondary leading-relaxed">
                            Interrogez vos données en langage naturel avec GPT-4o et mémoire vectorielle Pinecone
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="surface rounded-xl p-8 surface-hover">
                        <TrendingUp className="w-12 h-12 text-accent-blue mb-4" />
                        <h3 className="text-2xl font-semibold mb-3">D3.js Charts</h3>
                        <p className="text-text-secondary leading-relaxed">
                            Visualisations premium : Sankey flows, Sunburst expenses, drill-down interactif 3 niveaux
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="surface rounded-xl p-8 surface-hover">
                        <Mail className="w-12 h-12 text-accent-orange mb-4" />
                        <h3 className="text-2xl font-semibold mb-3">Email Alerts</h3>
                        <p className="text-text-secondary leading-relaxed">
                            Alertes automatiques (trésorerie, DSO, marges) avec Resend + Vercel Cron daily
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="surface rounded-xl p-8 surface-hover">
                        <Users className="w-12 h-12 text-accent-green mb-4" />
                        <h3 className="text-2xl font-semibold mb-3">Real-Time Collab</h3>
                        <p className="text-text-secondary leading-relaxed">
                            Collaboration temps réel avec Pusher : presence indicators, cursor tracking, notifications
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="surface rounded-xl p-8 surface-hover">
                        <Zap className="w-12 h-12 text-accent-red mb-4" />
                        <h3 className="text-2xl font-semibold mb-3">ML Anomaly Detection</h3>
                        <p className="text-text-secondary leading-relaxed">
                            3 algorithmes ML (Z-score, IQR, Moving Average) pour détecter transactions suspectes
                        </p>
                    </div>

                    {/* Feature 7 - Export */}
                    <div className="surface rounded-xl p-8 surface-hover">
                        <FileBarChart className="w-12 h-12 text-accent-blue mb-4" />
                        <h3 className="text-2xl font-semibold mb-3">Export Pro</h3>
                        <p className="text-text-secondary leading-relaxed">
                            Génération PDF/Excel automatisée avec formules financières conformes PCG 2025
                        </p>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="max-w-4xl mx-auto px-6 pb-32 text-center">
                <h2 className="text-3xl font-bold mb-12">Stack Technique</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        'Next.js 14',
                        'React',
                        'TypeScript',
                        'Tailwind CSS',
                        'OpenAI GPT-4o',
                        'Pinecone',
                        'Pusher',
                        'Resend',
                        'D3.js',
                        'Recharts',
                        'Vercel'
                    ].map((tech) => (
                        <span
                            key={tech}
                            className="px-4 py-2 bg-surface-elevated border border-border-default rounded-lg text-sm font-medium text-text-secondary hover:border-border-strong hover:text-text-primary transition-all"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border-subtle py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/zineinsights_logo.jpeg"
                                alt="FinSight"
                                className="w-8 h-8 rounded-lg"
                            />
                            <div>
                                <div className="text-lg font-semibold">FinSight</div>
                                <div className="text-xs text-text-tertiary">by Otmane Boulahia</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
                                Démo Live
                            </Link>
                            <a
                                href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-sm"
                            >
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                            </a>
                            <a
                                href="https://github.com/OtmaneZ/FinSights"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-sm"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </a>
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-secondary hover:text-text-primary transition-colors text-sm"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border-subtle text-center text-sm text-text-tertiary">
                        <p>
                            © 2025 Otmane Boulahia • Finance × Data Engineer •
                            <a href="https://www.zineinsight.com" className="hover:text-text-secondary transition-colors ml-1">ZineInsight</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

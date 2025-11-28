'use client'

import Link from 'next/link'
import { FileText, Calendar, Sparkles, Wrench, Bug, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface ChangeItem {
    type: 'new' | 'improve' | 'fix'
    text: string
}

interface ChangelogVersion {
    version: string
    date: string
    badge?: 'latest' | 'coming-soon'
    changes: ChangeItem[]
}

const changelog: ChangelogVersion[] = [
    {
        version: '2.0',
        date: 'Décembre 2025',
        badge: 'coming-soon',
        changes: [
            { type: 'new', text: 'Authentification & comptes utilisateurs (Next-Auth)' },
            { type: 'new', text: 'Plans Pro & Scale avec paiement Stripe' },
            { type: 'new', text: 'Sauvegarde cloud des dashboards (Vercel Blob)' },
            { type: 'new', text: 'API REST v1 publique avec API keys' },
            { type: 'new', text: 'Webhooks pour intégrations tierces' },
            { type: 'new', text: 'Templates CSV Sage, Cegid, QuickBooks' },
            { type: 'improve', text: 'Parser CSV 2x plus rapide' },
            { type: 'improve', text: 'Nouveau design pricing page' },
            { type: 'improve', text: 'Rate limiting intelligent par plan' }
        ]
    },
    {
        version: '1.5',
        date: '28 novembre 2025',
        badge: 'latest',
        changes: [
            { type: 'new', text: 'ML Anomaly Detection (Z-score, IQR, Moving Average)' },
            { type: 'new', text: 'D3.js Sankey flows & Sunburst charts' },
            { type: 'new', text: 'Real-time collaboration avec Pusher' },
            { type: 'new', text: 'Email alerts automatiques (Resend)' },
            { type: 'new', text: 'Vercel Cron pour rapports quotidiens' },
            { type: 'new', text: 'Keyboard shortcuts (Cmd+K command palette)' },
            { type: 'new', text: 'Drill-down interactif 3 niveaux' },
            { type: 'new', text: 'Calculateur DSO gratuit' },
            { type: 'new', text: 'Blog avec articles SEO (finance)' },
            { type: 'improve', text: 'Design system corporate (blanc + bleu)' },
            { type: 'improve', text: 'Testimonials avec 6 témoignages réalistes' },
            { type: 'fix', text: 'Contraste texte sur fond clair' },
            { type: 'fix', text: 'Formules DSO conformes PCG 2025' }
        ]
    },
    {
        version: '1.0',
        date: '5 novembre 2025',
        changes: [
            { type: 'new', text: 'Dashboard financier complet (15 KPIs)' },
            { type: 'new', text: 'AI Copilot GPT-4o + Pinecone vector memory' },
            { type: 'new', text: 'Import CSV/Excel robuste' },
            { type: 'new', text: 'Export PDF & Excel professionnels' },
            { type: 'new', text: 'Charts Recharts (cash flow, marges, clients)' },
            { type: 'new', text: 'Benchmarks sectoriels (Services, Commerce, SaaS)' },
            { type: 'new', text: 'KPI tooltips avec formules détaillées' },
            { type: 'new', text: '3 scénarios démo réalistes' },
            { type: 'new', text: 'Dark theme professionnel' },
            { type: 'new', text: 'Responsive design mobile' }
        ]
    }
]

const getChangeIcon = (type: ChangeItem['type']) => {
    switch (type) {
        case 'new':
            return <Sparkles className="w-4 h-4 text-green-500" />
        case 'improve':
            return <TrendingUp className="w-4 h-4 text-blue-500" />
        case 'fix':
            return <Bug className="w-4 h-4 text-amber-500" />
    }
}

const getChangeLabel = (type: ChangeItem['type']) => {
    switch (type) {
        case 'new':
            return 'Nouveau'
        case 'improve':
            return 'Amélioré'
        case 'fix':
            return 'Corrigé'
    }
}

const getBadge = (badge?: 'latest' | 'coming-soon') => {
    if (!badge) return null

    if (badge === 'latest') {
        return (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Dernière version
            </span>
        )
    }

    return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            À venir
        </span>
    )
}

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                        <FileText className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-medium">Historique produit</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4">
                        Changelog FinSight
                    </h1>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">
                        Suivez l'évolution de FinSight : nouvelles fonctionnalités, améliorations et corrections
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Ligne verticale */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border-default hidden md:block"></div>

                    {/* Versions */}
                    <div className="space-y-12">
                        {changelog.map((version, index) => (
                            <div key={version.version} className="relative">
                                {/* Point sur timeline */}
                                <div className="absolute left-0 top-0 w-16 h-16 bg-accent-primary rounded-full flex items-center justify-center hidden md:flex">
                                    <Wrench className="w-7 h-7 text-white" />
                                </div>

                                {/* Contenu */}
                                <div className="md:ml-24">
                                    <div className="surface rounded-2xl p-8 border border-border-default hover:border-accent-primary-border transition-all">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h2 className="text-3xl font-bold">
                                                        Version {version.version}
                                                    </h2>
                                                    {getBadge(version.badge)}
                                                </div>
                                                <p className="flex items-center gap-2 text-secondary">
                                                    <Calendar className="w-4 h-4" />
                                                    {version.date}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Changes */}
                                        <div className="space-y-3">
                                            {version.changes.map((change, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-elevated transition-colors"
                                                >
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {getChangeIcon(change.type)}
                                                        <span className={`text-xs font-medium ${
                                                            change.type === 'new' ? 'text-green-600' :
                                                            change.type === 'improve' ? 'text-blue-600' :
                                                            'text-amber-600'
                                                        }`}>
                                                            {getChangeLabel(change.type)}
                                                        </span>
                                                    </div>
                                                    <p className="text-secondary leading-relaxed">
                                                        {change.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 surface rounded-2xl p-12 border-2 border-accent-primary bg-accent-primary-subtle text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Essayez la dernière version
                    </h2>
                    <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
                        Dashboard financier complet, AI Copilot, 15 KPIs automatiques, et bien plus
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
                    >
                        Essayer gratuitement
                    </Link>
                    <p className="text-sm text-tertiary mt-4">
                        ✅ Sans engagement • ✅ 10 questions IA gratuites • ✅ Export PDF/Excel
                    </p>
                </div>

                {/* Footer note */}
                <div className="mt-12 text-center text-sm text-tertiary">
                    <p>
                        💡 Vous avez une suggestion de fonctionnalité ?{' '}
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-primary hover:underline"
                        >
                            Prenons rendez-vous
                        </a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

import { Suspense } from 'react'
import DashisAgentUI from '@/components/DashisAgentUI'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft, Sparkles, BarChart3, Brain, Zap } from 'lucide-react'

// Loading component for Suspense
function DashboardLoading() {
    return (
        <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary">Chargement du dashboard DASHIS...</p>
            </div>
        </div>
    )
}

export default function DemoDashisPage() {
    return (
        <div className="min-h-screen bg-primary text-primary flex flex-col">
            {/* Header - Cohérent avec tout le site */}
            <Header />

            {/* Context Bar - DASHIS specific */}
            <div className="bg-gradient-to-r from-accent-primary/5 via-accent-primary/10 to-accent-primary/5 border-b border-border-subtle">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/agents" 
                            className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Tous les agents
                        </Link>
                        <div className="w-px h-4 bg-border-subtle" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-accent-primary" />
                            </div>
                            <span className="font-semibold text-primary">DASHIS</span>
                            <span className="px-2 py-0.5 text-xs font-medium bg-accent-primary/10 text-accent-primary rounded-full">
                                Demo Interactive
                            </span>
                        </div>
                    </div>
                    <Link 
                        href="/agents/dashis" 
                        className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors font-medium"
                    >
                        En savoir plus →
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1">
                {/* Dashboard */}
                <Suspense fallback={<DashboardLoading />}>
                    <DashisAgentUI />
                </Suspense>

                {/* Capabilities Summary - Business-focused, not dev-focused */}
                <section className="bg-secondary border-t border-border-subtle">
                    <div className="max-w-7xl mx-auto px-6 py-12">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-semibold text-primary mb-2">
                                Ce que DASHIS analyse pour vous
                            </h2>
                            <p className="text-secondary">
                                Vision 360° de votre performance financière en quelques secondes
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center p-6 bg-primary rounded-xl border border-border-subtle">
                                <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <BarChart3 className="w-6 h-6 text-accent-primary" />
                                </div>
                                <h3 className="font-semibold text-primary mb-2">5 KPIs Clés</h3>
                                <p className="text-sm text-tertiary">
                                    CA, Charges, Marge, Cash Flow, DSO calculés automatiquement
                                </p>
                            </div>
                            <div className="text-center p-6 bg-primary rounded-xl border border-border-subtle">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Brain className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h3 className="font-semibold text-primary mb-2">IA Prédictive</h3>
                                <p className="text-sm text-tertiary">
                                    Détection d'anomalies et prévisions à 90 jours
                                </p>
                            </div>
                            <div className="text-center p-6 bg-primary rounded-xl border border-border-subtle">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="font-semibold text-primary mb-2">Score FinSight™</h3>
                                <p className="text-sm text-tertiary">
                                    Note de santé financière de 0 à 100
                                </p>
                            </div>
                            <div className="text-center p-6 bg-primary rounded-xl border border-border-subtle">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="font-semibold text-primary mb-2">Simulations</h3>
                                <p className="text-sm text-tertiary">
                                    Testez vos scénarios What-If en temps réel
                                </p>
                            </div>
                        </div>
                        <div className="text-center mt-8">
                            <Link 
                                href="/agents/dashis"
                                className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-primary/80 transition-colors font-medium"
                            >
                                Découvrir toutes les fonctionnalités DASHIS
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Cohérent avec tout le site */}
            <Footer />
        </div>
    )
}

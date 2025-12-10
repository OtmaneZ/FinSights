import Link from 'next/link'
import { Sparkles, BarChart3, TrendingUp, Database } from 'lucide-react'

export default function ConsultingSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-900">Allons plus loin ensemble</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Du diagnostic express au dashboard IA sur-mesure — choisissez le format adapté à votre besoin.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Card 0: Diagnostic FinSight™ - NEW */}
                    <div className="surface rounded-2xl p-6 border border-border-subtle surface-hover">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-accent-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Diagnostic FinSight™</h3>
                                <p className="text-tertiary text-xs">Découverte</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl font-bold text-accent-primary">290€</span>
                            </div>
                            <p className="text-secondary text-xs">Livrable en 48h</p>
                        </div>

                        <ul className="space-y-2 mb-6 text-xs text-gray-600">
                            <li>Score FinSight™ détaillé</li>
                            <li>Lecture instantanée trésorerie</li>
                            <li>3 actions prioritaires immédiatement exploitables</li>
                        </ul>

                        <Link href="/consulting" className="block w-full px-4 py-2.5 border-2 border-accent-primary hover:bg-blue-50 text-accent-primary rounded-lg font-semibold text-sm text-center transition-all">
                            Commander
                        </Link>
                    </div>

                    {/* Card 1: Audit FinSight™ */}
                    <div className="surface rounded-2xl p-6 border border-border-subtle surface-hover">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-accent-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Audit FinSight™</h3>
                                <p className="text-tertiary text-xs">Analyse approfondie</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl font-bold text-accent-primary">2 900€</span>
                            </div>
                            <p className="text-secondary text-xs">Livrable en 3-5 jours</p>
                        </div>

                        <ul className="space-y-2 mb-6 text-xs text-gray-600">
                            <li>Audit de votre stack (Excel, ERP, BI)</li>
                            <li>Analyse KPIs avancée (DSO, BFR, marge)</li>
                            <li>Recommandations prioritaires + rapport PDF</li>
                        </ul>

                        <Link href="/consulting" className="block w-full px-4 py-2.5 border-2 border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold text-sm text-center transition-all hover:bg-surface-elevated">
                            Réserver un audit
                        </Link>
                    </div>

                    {/* Card 2: Dashboard IA */}
                    <div className="surface rounded-2xl p-6 border-2 border-accent-primary relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-accent-primary text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">Le plus demandé</div>

                        <div className="flex items-center gap-2 mb-4 mt-2">
                            <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Dashboard IA</h3>
                                <p className="text-tertiary text-xs">Sur-mesure</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl font-bold text-accent-primary">6 900€</span>
                            </div>
                            <p className="text-secondary text-xs">Livrable en 2-3 semaines</p>
                        </div>

                        <ul className="space-y-2 mb-6 text-xs text-gray-600">
                            <li>Tout l'Audit FinSight™</li>
                            <li>Dashboard financier IA (Next.js + Python)</li>
                            <li>AI Copilot GPT-4 intégré + formation</li>
                        </ul>

                        <Link href="/consulting" className="block w-full px-4 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm text-center transition-all hover:shadow-xl">
                            Planifier un appel
                        </Link>
                    </div>

                    {/* Card 3: Data Platform */}
                    <div className="surface rounded-2xl p-6 border border-border-subtle surface-hover">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                                <Database className="w-5 h-5 text-accent-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Data Platform</h3>
                                <p className="text-tertiary text-xs">Enterprise-grade</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-2xl font-bold text-accent-primary">À partir de 12k€</span>
                            </div>
                            <p className="text-secondary text-xs">4-8 semaines (selon scope)</p>
                        </div>

                        <ul className="space-y-2 mb-6 text-xs text-gray-600">
                            <li>Data warehouse & pipelines ETL</li>
                            <li>Modèles prédictifs & dashboards multi-départements</li>
                            <li>Documentation technique & support post-livraison</li>
                        </ul>

                        <Link href="/consulting" className="block w-full px-4 py-2.5 border-2 border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold text-sm text-center transition-all hover:bg-surface-elevated">
                            Discutons du projet
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

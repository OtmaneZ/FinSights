'use client'

import Link from 'next/link'
import {
    Sparkles,
    Zap,
    DollarSign,
    BarChart3,
    AlertTriangle,
    Shield
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

                    {/* Social Proof */}
                    <div className="flex flex-col items-center gap-4 mt-12 pt-8 border-t border-border-default">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-primary flex items-center justify-center text-white text-xs font-bold">
                                    CF
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-primary flex items-center justify-center text-white text-xs font-bold">
                                    DA
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-primary flex items-center justify-center text-white text-xs font-bold">
                                    FI
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-primary flex items-center justify-center text-white text-xs font-bold">
                                    +250
                                </div>
                            </div>
                            <p className="text-sm text-secondary font-medium">
                                Utilisé par <span className="text-primary font-semibold">250+ CFO/DAF</span> en France
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-yellow-500">
                                <span>⭐⭐⭐⭐⭐</span>
                            </div>
                            <span className="text-sm text-secondary">
                                <span className="font-bold text-primary">4.8/5</span> • 120+ avis
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Before/After Section */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                        Excel → FinSight : <span className="text-accent-primary">2 heures → 10 secondes</span>
                    </h2>
                    <p className="text-lg text-secondary max-w-2xl mx-auto">
                        Arrêtez de perdre du temps sur des calculs manuels. Concentrez-vous sur vos décisions.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* AVANT - Excel */}
                    <div className="surface rounded-2xl p-8 border-2 border-border-default relative">
                        <div className="absolute -top-4 left-6 px-4 py-1 bg-red-50 border border-red-200 rounded-full">
                            <span className="text-red-700 text-sm font-semibold">❌ Avec Excel (aujourd'hui)</span>
                        </div>

                        <h3 className="text-2xl font-bold mt-4 mb-6 text-primary">2 heures de travail manuel</h3>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-secondary">
                                <span className="text-red-500 font-bold text-xl flex-shrink-0">×</span>
                                <span className="leading-relaxed">Formules manuelles DSO, BFR, marge nette à recalculer chaque mois</span>
                            </li>
                            <li className="flex items-start gap-3 text-secondary">
                                <span className="text-red-500 font-bold text-xl flex-shrink-0">×</span>
                                <span className="leading-relaxed">Consolidation de plusieurs exports comptables (Sage, Excel, PDF)</span>
                            </li>
                            <li className="flex items-start gap-3 text-secondary">
                                <span className="text-red-500 font-bold text-xl flex-shrink-0">×</span>
                                <span className="leading-relaxed">Recherche manuelle d'erreurs de saisie et doublons</span>
                            </li>
                            <li className="flex items-start gap-3 text-secondary">
                                <span className="text-red-500 font-bold text-xl flex-shrink-0">×</span>
                                <span className="leading-relaxed">Graphiques à refaire pour chaque présentation CODIR</span>
                            </li>
                            <li className="flex items-start gap-3 text-secondary">
                                <span className="text-red-500 font-bold text-xl flex-shrink-0">×</span>
                                <span className="leading-relaxed">Aucune détection automatique des anomalies financières</span>
                            </li>
                        </ul>

                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 italic leading-relaxed">
                                "Je passe 2 heures par semaine sur Excel juste pour savoir où j'en suis.
                                Et encore, je ne détecte pas tout..."
                            </p>
                            <p className="text-xs text-red-600 mt-2 font-semibold">
                                — DAF, PME 50 personnes
                            </p>
                        </div>
                    </div>

                    {/* APRÈS - FinSight */}
                    <div className="surface rounded-2xl p-8 border-2 border-accent-primary relative bg-gradient-to-br from-accent-primary-subtle to-primary">
                        <div className="absolute -top-4 left-6 px-4 py-1 bg-accent-primary text-white rounded-full shadow-lg">
                            <span className="text-sm font-semibold">✨ Avec FinSight (10 secondes)</span>
                        </div>

                        <h3 className="text-2xl font-bold mt-4 mb-6 text-primary">Upload → Diagnostic instantané</h3>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-primary">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span className="leading-relaxed font-medium">15 KPIs calculés automatiquement (DSO, BFR, marge, cash flow...)</span>
                            </li>
                            <li className="flex items-start gap-3 text-primary">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span className="leading-relaxed font-medium">Détection IA des anomalies (paie en doublon, client tardif, erreur saisie)</span>
                            </li>
                            <li className="flex items-start gap-3 text-primary">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span className="leading-relaxed font-medium">Simulations what-if en temps réel (et si j'augmente mes prix de 10% ?)</span>
                            </li>
                            <li className="flex items-start gap-3 text-primary">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span className="leading-relaxed font-medium">Export PDF branded prêt pour présentation CODIR</span>
                            </li>
                            <li className="flex items-start gap-3 text-primary">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span className="leading-relaxed font-medium">Alertes automatiques si trésorerie &lt; 3 mois</span>
                            </li>
                        </ul>

                        <div className="p-4 bg-white border-2 border-accent-primary rounded-lg shadow-sm">
                            <p className="text-sm text-primary font-medium leading-relaxed">
                                "10 secondes pour savoir si je tiens 6 mois.
                                Je peux enfin me concentrer sur la stratégie, pas sur Excel."
                            </p>
                            <p className="text-xs text-accent-primary mt-2 font-bold">
                                — CFO, Scale-up 120 personnes
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid - Simplified to 3 Essential Blocks */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <h2 className="text-2xl font-bold text-center mb-10 text-primary">Ce que vous obtenez</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 - Diagnostic instantané */}
                    <div className="surface rounded-xl p-8 surface-hover group">
                        <DollarSign className="w-12 h-12 text-accent-primary mb-4 transition-transform group-hover:scale-110" />
                        <h3 className="text-xl font-bold mb-3 text-primary">Diagnostic instantané</h3>
                        <p className="text-secondary text-base leading-relaxed">
                            Uploadez votre export comptable.<br />
                            <span className="font-semibold text-primary">10 secondes plus tard : vous savez si votre trésorerie tient 6 mois.</span>
                        </p>
                    </div>

                    {/* Feature 2 - Anomalies détectées automatiquement */}
                    <div className="surface rounded-xl p-8 surface-hover group">
                        <AlertTriangle className="w-12 h-12 text-accent-primary mb-4 transition-transform group-hover:scale-110" />
                        <h3 className="text-xl font-bold mb-3 text-primary">Anomalies détectées</h3>
                        <p className="text-secondary text-base leading-relaxed">
                            L'IA repère automatiquement les erreurs :<br />
                            <span className="font-semibold text-primary">paie en doublon, client qui paie toujours en retard, saisies incorrectes.</span>
                        </p>
                    </div>

                    {/* Feature 3 - Projection 6 mois cash-flow */}
                    <div className="surface rounded-xl p-8 surface-hover group">
                        <BarChart3 className="w-12 h-12 text-accent-primary mb-4 transition-transform group-hover:scale-110" />
                        <h3 className="text-xl font-bold mb-3 text-primary">Projection 6 mois</h3>
                        <p className="text-secondary text-base leading-relaxed">
                            Visualisez votre cash-flow sur 6 mois.<br />
                            <span className="font-semibold text-primary">Alerte automatique si vous passez sous 3 mois de trésorerie.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <Testimonials />

            {/* Security & Compliance Section */}
            <section className="max-w-6xl mx-auto px-6 py-24 border-t border-border-default">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-primary">Sécurité & Conformité</h2>
                    <p className="text-lg text-secondary max-w-2xl mx-auto">
                        Vos données restent en France. Aucune transmission externe. Chiffrement de bout en bout.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="surface rounded-2xl p-10 text-center border-2 border-accent-primary-border">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary-subtle rounded-2xl mb-6">
                            <Shield className="w-10 h-10 text-accent-primary" />
                        </div>

                        <ul className="text-base text-secondary space-y-4 text-left max-w-xl mx-auto">
                            <li className="flex items-start gap-3">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span><strong className="text-primary">Données en France</strong> — hébergement serveurs OVH Paris</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span><strong className="text-primary">Chiffrement AES-256</strong> — au repos et en transit (TLS 1.3)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span><strong className="text-primary">RGPD conforme</strong> — droit d'accès, rectification, suppression</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span><strong className="text-primary">Authentification sécurisée</strong> — sessions JWT httpOnly</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span><strong className="text-primary">Serveurs rapides</strong> — temps de réponse &lt; 100ms</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

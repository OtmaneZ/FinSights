import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CalculatorHub } from '@/components/CalculatorHub'
import CalculatorHistory from '@/components/CalculatorHistory'
import RecommendedPath from '@/components/RecommendedPath'

export const metadata: Metadata = {
    title: 'Pré-Diagnostic Financier PME : DSO, BFR, Marge, ROI | FinSight',
    description: 'Évaluez vos indicateurs clés en quelques clics. Les mêmes outils que nous utilisons en mission DAF — DSO, BFR, Marge, ROI — avec benchmarks sectoriels et recommandations.',
    keywords: 'diagnostic financier pme, analyse dso, analyse bfr, analyse marge, analyse roi, pré-diagnostic financier, indicateurs financiers pme, audit financier, pilotage financier',
    openGraph: {
        title: 'Pré-Diagnostic Financier PME — DSO, BFR, Marge, ROI | FinSight',
        description: 'Évaluez vos indicateurs clés : DSO, BFR, Marge, ROI. Benchmarks sectoriels et recommandations d\'expert inclus.',
        type: 'website',
        url: 'https://finsight.zineinsight.com/calculateurs',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs',
    },
}

export default function CalculateursPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full px-4 py-2 mb-6">
                        <svg className="w-4 h-4 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-sm font-semibold text-accent-primary">Pré-diagnostic stratégique</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-primary">
                        Mesurez votre performance<br />
                        <span className="text-accent-primary">avant de décider</span>
                    </h1>

                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-8">
                        Les mêmes outils que nous utilisons en mission DAF.<br />
                        Obtenez un <strong>premier niveau de lecture</strong> de votre situation financière.
                    </p>

                    <div className="flex items-center justify-center gap-6 text-sm text-tertiary">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Résultat instantané</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Benchmarks sectoriels</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Recommandations d'expert</span>
                        </div>
                    </div>
                </div>

                {/* Historique des calculs récents (localStorage) */}
                <CalculatorHistory />

                {/* Parcours recommandé après un calcul */}
                <RecommendedPath />

                {/* Calculators Grid with Modals */}
                <CalculatorHub />

                {/* CTA Section */}
                <div className="surface rounded-2xl p-12 border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 mt-16">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full px-4 py-2 mb-4">
                            <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span className="text-sm font-semibold text-accent-primary">Aller plus loin</span>
                        </div>
                        
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Ces indicateurs ne sont qu'un premier niveau de lecture
                        </h2>
                        
                        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                            Un échange stratégique de 30 minutes permet d'aller à l'essentiel :<br />
                            <strong>cash, marges, risques cachés — et vos leviers d'action concrets.</strong>
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Option 1 : Échange stratégique */}
                        <div className="bg-white rounded-xl p-6 border-2 border-accent-primary hover:shadow-lg transition-all">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Échange stratégique 30 min
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Avec Otmane Boulahia · Visio · Confidentiel
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-700 mb-6">
                                        <li className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Audit complet de votre cycle cash</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Plan d'action personnalisé immédiat</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Identification de vos leviers prioritaires</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Premières recommandations concrètes</span>
                                        </li>
                                    </ul>
                                    <a
                                        href="https://calendly.com/zineinsight"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all shadow-lg"
                                    >
                                        Identifier mes leviers financiers
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Option 2 : Accompagnement */}
                        <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-accent-primary transition-all">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Audit & Pilotage complet
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Score FinSight™ + plan d'action chiffré · À partir de 1 990€
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-700 mb-6">
                                        <li className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Analyse complète 15+ KPIs vs benchmark</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Simulation cash : impact sur 12 mois</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Roadmap priorisée : actions rapides puis structurelles</span>
                                        </li>
                                    </ul>
                                    <a
                                        href="/consulting"
                                        className="block w-full text-center px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all"
                                    >
                                        Découvrir l'accompagnement
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        Confidentialité garantie · Aucune donnée transmise sans votre accord · Réponse sous 24h
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

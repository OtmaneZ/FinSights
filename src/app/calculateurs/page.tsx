import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CalculatorHub } from '@/components/CalculatorHub'

export const metadata: Metadata = {
    title: 'Diagnostic Financier Gratuit PME : Votre Trésorerie est-elle en Danger ? | FinSight',
    description: 'Testez en 30 secondes les 9 indicateurs qui révèlent les risques invisibles de votre PME : DSO, BFR, ROI, Marge. Résultat instantané + benchmark sectoriel. Zéro inscription.',
    keywords: 'diagnostic financier pme, risque trésorerie, tension cash, dso élevé, bfr trop haut, audit financier gratuit, analyse finance pme, problème trésorerie',
    openGraph: {
        title: 'Votre trésorerie est-elle en danger sans que vous le sachiez ?',
        description: 'Diagnostic financier gratuit : testez les 9 indicateurs qui révèlent les risques invisibles de votre PME en 30 secondes.',
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
                    <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-red-600">Diagnostic financier gratuit</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-primary">
                        Votre trésorerie est-elle en danger<br />
                        <span className="text-red-600">sans que vous le sachiez ?</span>
                    </h1>

                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-8">
                        Testez en <strong>30 secondes</strong> les indicateurs qui révèlent<br />
                        les <strong>risques invisibles</strong> de votre PME.
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
                            <span>Benchmark sectoriel</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Zéro inscription</span>
                        </div>
                    </div>
                </div>

                {/* Calculators Grid with Modals */}
                <CalculatorHub />

                {/* CTA Section */}
                <div className="surface rounded-2xl p-12 border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 mt-16">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-red-100 border border-red-300 rounded-full px-4 py-2 mb-4">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-semibold text-red-700">Vous découvrez un problème ?</span>
                        </div>
                        
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            DSO &gt; 45 jours ? BFR trop élevé ? Marge sous pression ?
                        </h2>
                        
                        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                            Ne restez pas seul face aux tensions financières.<br />
                            <strong>Audit express en 72h</strong> : Plan d'action chiffré, priorisé, actionnable.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Option 1 : Diagnostic gratuit */}
                        <div className="bg-white rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Diagnostic gratuit 30 min
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Avec notre expert CFO · Visio · Aucun engagement
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
                                            <span>Méthode pour libérer 50-100k€ rapidement</span>
                                        </li>
                                    </ul>
                                    <a
                                        href="https://calendly.com/zineinsight"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                                    >
                                        Prendre RDV gratuit
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Option 2 : Consulting */}
                        <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Audit approfondi 72h
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Rapport complet + 3 actions prioritaires · 1 490€
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
                                        className="block w-full text-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                                    >
                                        Voir les offres consulting
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        🔒 Confidentialité garantie · 📊 Aucune donnée transmise sans votre accord · ⚡ Réponse sous 24h
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CalculatorHub } from '@/components/CalculatorHub'

export const metadata: Metadata = {
    title: 'Les 9 indicateurs qui décident de la trajectoire d\'une PME | FinSight',
    description: '9 calculateurs financiers pour piloter votre PME : DSO, BFR, ROI, Seuil de rentabilité, Marge commerciale, EBITDA, Burn Rate, Valorisation. Résultats instantanés + interprétation DAF.',
    keywords: 'indicateurs financiers pme, calculateurs finance daf, calculateur dso bfr, kpi finance, tableau bord daf, analyse financière pme, pilotage trésorerie',
    openGraph: {
        title: 'Les 9 indicateurs qui décident de la trajectoire d\'une PME',
        description: 'Utilisés en direction financière pour piloter cash, croissance et risque. Résultats instantanés avec interprétation.',
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
                    <p className="text-sm uppercase tracking-widest text-secondary mb-6">
                        Utilisés en direction financière pour piloter cash, croissance et risque.
                    </p>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
                        Les 9 indicateurs qui décident<br />
                        de la trajectoire d&apos;une PME
                    </h1>

                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-4">
                        Calculez vos KPIs financiers en temps réel.<br />
                        Résultats instantanés avec interprétation et recommandations d&apos;expert.
                    </p>

                    <p className="text-sm text-tertiary">
                        Calcul instantané · Benchmarks sectoriels · Aucune inscription requise
                    </p>
                </div>

                {/* Calculators Grid with Modals */}
                <CalculatorHub />

                {/* CTA Section */}
                <div className="surface rounded-2xl p-12 border-2 border-accent-primary-border bg-gradient-to-br from-accent-primary-subtle to-primary text-center mt-16">
                    <h2 className="text-3xl font-bold mb-4">
                        Automatisez tous vos KPIs avec FinSight
                    </h2>
                    <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
                        Plus besoin de calculer manuellement. FinSight importe votre comptabilité<br />
                        et calcule automatiquement 15+ KPIs en 10 secondes.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all shadow-lg"
                        >
                            Demander une analyse FinSight
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                        <a
                            href="/ressources/templates"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white rounded-lg font-semibold transition-all"
                        >
                            Télécharger Templates Excel
                        </a>
                    </div>
                    <p className="text-sm text-tertiary mt-4">
                        Sans engagement · Dashboard complet · 10 questions IA incluses
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

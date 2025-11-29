import { Metadata } from 'next'
import { Calculator } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CalculatorHub } from '@/components/CalculatorHub'

export const metadata: Metadata = {
    title: 'Calculateurs Financiers Gratuits | DSO, BFR, ROI, Marge | FinSight',
    description: 'Collection de 6 calculateurs financiers gratuits pour CFO/DAF : DSO, BFR, ROI, Seuil de rentabilité, Marge commerciale, EBITDA. Résultats instantanés avec interprétation.',
    openGraph: {
        title: 'Calculateurs Financiers Gratuits pour CFO/DAF | FinSight',
        description: '6 calculateurs gratuits pour piloter vos finances : DSO, BFR, ROI, Marges...',
        type: 'website'
    }
}

export default function CalculateursPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                        <Calculator className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-semibold">100% Gratuits</span>
                    </div>

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Calculateurs Financiers<br />
                        <span className="text-accent-primary">pour CFO/DAF</span>
                    </h1>

                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-4">
                        6 outils gratuits pour calculer vos KPIs en temps réel.<br />
                        Résultats instantanés avec interprétation et recommandations.
                    </p>

                    <p className="text-sm text-tertiary">
                        ⚡ Calcul instantané • 📊 Benchmarks sectoriels • ✅ Aucune inscription
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
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all shadow-lg"
                        >
                            Essayer FinSight Gratuitement
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
                        ✅ Sans engagement • ✅ Dashboard complet • ✅ 10 questions IA gratuites
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

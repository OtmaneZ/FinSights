import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SimulateurGate from '@/components/SimulateurGate'
import SimulateurCoutSalarieContent from './SimulateurContent'

export default function SimulateurCoutSalariePage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />
            <div className="max-w-5xl mx-auto px-6 py-16">
                <Link
                    href="/simulateurs"
                    className="inline-flex items-center gap-2 text-secondary hover:text-accent-primary transition-colors mb-8 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux simulateurs
                </Link>
                {/* En-tête toujours visible — SEO */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                            Recrutement
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
                        Simulateur coût réel d&apos;un salarié
                    </h1>
                    <p className="text-secondary text-lg max-w-2xl">
                        Ajustez le salaire brut et obtenez instantanément le vrai coût pour votre entreprise —
                        charges patronales, mutuelle et coût annuel inclus.
                    </p>
                </div>
                {/* Gate : simulateur ou mur d'accès */}
                <SimulateurGate>
                    <SimulateurCoutSalarieContent />
                </SimulateurGate>
            </div>
            <Footer />
        </div>
    )
}



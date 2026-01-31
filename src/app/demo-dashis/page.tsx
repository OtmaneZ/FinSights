import { Suspense } from 'react'
import DashisAgentUI from '@/components/DashisAgentUI'
import Link from 'next/link'
import Image from 'next/image'

// Loading component for Suspense
function DashboardLoading() {
    return (
        <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary">Chargement du dashboard DASHIS Agent...</p>
            </div>
        </div>
    )
}

export default function DemoDashisPage() {
    return (
        <main className="min-h-screen bg-primary text-primary">
            {/* Header - Aligned with /demo */}
            <header className="border-b border-border-subtle backdrop-blur-sm bg-primary/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Image
                            src="/images/zineinsights_logo.jpeg"
                            alt="FinSight"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg"
                        />
                        <div>
                            <span className="text-xl font-semibold">FinSight</span>
                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-accent-primary/10 text-accent-primary rounded">DASHIS</span>
                        </div>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/agents" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
                            ← Tous les agents
                        </Link>
                        <Link href="/pricing" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
                            Nos Offres
                        </Link>
                        <a
                            href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-all text-sm font-medium"
                        >
                            <span>Discutons Projet</span>
                        </a>
                    </nav>
                </div>
            </header>

            {/* Dashboard */}
            <Suspense fallback={<DashboardLoading />}>
                <DashisAgentUI />
            </Suspense>

            {/* Footer - Info technique */}
            <footer className="border-t border-border-subtle bg-secondary mt-12">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-semibold mb-2">🧬 Architecture Autonome</h4>
                            <p className="text-sm text-tertiary">
                                Backend pur TypeScript, zéro dépendance UI, testable & réutilisable
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">🔗 Fusionnable</h4>
                            <p className="text-sm text-tertiary">
                                Compatible TRESORIS, MARGIS, SCORIS, SCENARIS via IFinancialAgent
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">🚀 Performances</h4>
                            <p className="text-sm text-tertiary">
                                6 engines modulaires, ML/AI parallélisés, state machine optimisée
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-border-subtle text-center text-xs text-tertiary">
                        <p>
                            DASHIS Agent v1.0.0 - Built with Next.js 14, TypeScript, TensorFlow.js, GPT-4
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}

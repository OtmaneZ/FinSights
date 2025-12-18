import { Suspense } from 'react'
import FinancialDashboardV2 from '@/components/FinancialDashboardV2'
import CTAFixed from '@/components/CTAFixed'
import TutorialButton from '@/components/TutorialButton'
import Link from 'next/link'
import Image from 'next/image'
import { Linkedin } from 'lucide-react'

// Loading component for Suspense
function DashboardLoading() {
    return (
        <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary">Chargement du dashboard...</p>
            </div>
        </div>
    )
}

export default function DemoPage() {
    return (
        <main className="min-h-screen bg-primary text-primary">
            {/* Header - Aligned with Homepage */}
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
                            <span className="text-xs text-tertiary ml-2">Démo Interactive</span>
                        </div>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
                            Accueil
                        </Link>
                        <Link href="/pricing" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
                            Nos Offres
                        </Link>
                        <a
                            href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:text-primary transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                        </a>
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Discutons
                        </a>
                    </nav>
                </div>
            </header>

            <div className="pt-4">
                <Suspense fallback={<DashboardLoading />}>
                    <FinancialDashboardV2 />
                </Suspense>
            </div>

            {/* Tutorial Button */}
            <TutorialButton />

            {/* CTA Fixe */}
            <CTAFixed />

            {/* Footer - Aligned with Homepage */}
            <footer className="border-t border-border-subtle py-12 bg-primary">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/images/zineinsights_logo.jpeg"
                                alt="FinSight"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-lg"
                            />
                            <div>
                                <div className="text-lg font-semibold">FinSight</div>
                                <div className="text-xs text-tertiary">by Otmane Boulahia</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-secondary hover:text-primary transition-colors text-sm">
                                Accueil
                            </Link>
                            <Link href="/pricing" className="text-secondary hover:text-primary transition-colors text-sm">
                                Nos Offres
                            </Link>
                            <a
                                href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-primary transition-colors flex items-center gap-2 text-sm"
                            >
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                            </a>
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-primary transition-colors text-sm"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border-subtle text-center text-sm text-tertiary">
                        <p>
                            © 2025 Otmane Boulahia •
                            <a href="https://www.zineinsight.com" className="hover:text-secondary transition-colors ml-1">ZineInsight</a>
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}

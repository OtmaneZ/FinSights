import { Metadata } from 'next'
import Link from 'next/link'
import { FileSpreadsheet, TrendingUp, ArrowRight, Zap, RefreshCw, GraduationCap } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TemplatesResourceCards from '@/components/ressources/TemplatesResourceCards'
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

export const metadata: Metadata = {
    title: 'Templates Excel Gratuits Finance | Budget, DSO, Cash Flow | FinSight',
    description: 'Téléchargez gratuitement nos templates Excel professionnels : Budget prévisionnel 2026, Tracker DSO, Dashboard Cash Flow. Prêts à l\'emploi avec formules automatiques.',
    openGraph: {
        title: 'Templates Excel Gratuits pour Dirigeants PME | FinSight',
        description: '3 templates Excel professionnels gratuits pour piloter votre PME',
        type: 'website'
    }
}

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Header />

            {/* ── Section 1 - Hero (bg-white) ── */}
            <section className="bg-white pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <FadeIn direction="up" duration={0.6}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm mb-8">
                            <FileSpreadsheet className="w-4 h-4 text-accent-primary" />
                            <span className="text-xs font-medium tracking-widest text-accent-primary uppercase">Accès immédiat</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.1] text-gray-900 mb-6">
                            Templates Excel Professionnels<br />
                            <span className="text-accent-primary">pour Dirigeants PME</span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-6">
                            3 fichiers Excel prêts à l&apos;emploi avec formules automatiques,
                            graphiques intégrés et compatibles import FinSight
                        </p>

                        <a
                            href="#templates-grid"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm mb-4"
                        >
                            Télécharger les templates gratuitement →
                        </a>

                        <p className="text-sm text-gray-400 tracking-wide">
                            Indiquez prénom et email pour recevoir le fichier Excel · Compatible Excel/Google Sheets
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* ── Section 2 - Feature blocks (bg-gray-50) ── */}
            <section className="bg-gray-50 py-14">
                <div className="max-w-5xl mx-auto px-6">
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StaggerItem>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 mx-auto p-2.5">
                                    <Zap className="w-5 h-5 text-gray-700" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-2">Prêts à l&apos;emploi</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Ouvrez et utilisez immédiatement, formules déjà configurées
                                </p>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 mx-auto p-2.5">
                                    <RefreshCw className="w-5 h-5 text-gray-700" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-2">Prêts en 2 minutes</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Ouvrez, saisissez vos chiffres, obtenez vos indicateurs.
                                </p>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 mx-auto p-2.5">
                                    <GraduationCap className="w-5 h-5 text-gray-700" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-2">100% Finance FR</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Conformes PCG 2025, terminologie française, benchmarks sectoriels
                                </p>
                            </div>
                        </StaggerItem>
                    </StaggerContainer>
                </div>
            </section>

            {/* ── Section 3 - Templates Grid (bg-white) ── */}
            <section id="templates-grid" className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <FadeIn className="text-center mb-12">
                        <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
                            TEMPLATES GRATUITS
                        </span>
                        <h2 className="font-serif text-3xl lg:text-4xl font-medium text-gray-900 mt-4 mb-4">
                            3 fichiers Excel professionnels
                        </h2>
                        <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto">
                            Téléchargement immédiat par email · Aucune carte bancaire requise
                        </p>
                    </FadeIn>

                    {/* Templates Grid - capture email avant envoi du xlsx */}
                    <TemplatesResourceCards />
                </div>
            </section>

            {/* ── Section 4 - Prévisionnel 90j (bg-gray-50) ── */}
            <section className="bg-gray-50 py-14">
                <div className="max-w-5xl mx-auto px-6">
                    <FadeIn>
                        <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                                    <TrendingUp className="w-7 h-7 text-gray-700" />
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                    <span className="px-2.5 py-0.5 bg-accent-primary/10 text-accent-primary text-xs font-medium rounded-full">
                                        Nouveau
                                    </span>
                                </div>
                                <h3 className="font-serif text-2xl font-medium text-gray-900 mb-2">
                                    Prévisionnel Trésorerie 90 jours
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-1">
                                    Anticipez vos besoins de trésorerie avec un fichier Excel complet :
                                    encaissements, décaissements, graphiques automatiques et alertes conditionnelles.
                                </p>
                                <p className="text-sm text-gray-700 font-semibold">
                                    ⚡ Le template le plus demandé par les dirigeants PME
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <Link
                                    href="/templates/previsionnel-tresorerie-90j"
                                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-sm tracking-wide border border-gray-800 shadow-sm hover:bg-gray-800 transition-all duration-200 whitespace-nowrap"
                                >
                                    Télécharger ce template
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── Section 5 - FAQ (bg-white) ── */}
            <section className="bg-white py-20">
                <div className="max-w-3xl mx-auto px-6">
                    <FadeIn className="text-center mb-12">
                        <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
                            FAQ
                        </span>
                        <h2 className="font-serif text-3xl lg:text-4xl font-medium text-gray-900 mt-4">
                            Questions fréquentes
                        </h2>
                    </FadeIn>

                    <StaggerContainer className="space-y-4">
                        <StaggerItem>
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Pourquoi c&apos;est gratuit ?</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Ces templates sont offerts pour vous aider à améliorer votre gestion financière.
                                    Si vous voulez aller plus loin avec l&apos;analyse IA, découvrez FinSight.
                                </p>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Comment importer dans FinSight ?</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Remplissez le template Excel → Exportez en CSV → Uploadez sur FinSight.
                                    Le dashboard se génère automatiquement avec tous les KPIs.
                                </p>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Compatible Google Sheets ?</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Oui ! Uploadez le fichier .xlsx sur Google Sheets. Les formules sont compatibles
                                    (quelques ajustements mineurs possibles sur certaines fonctions avancées).
                                </p>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Mes données sont-elles sécurisées ?</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Nous utilisons votre email uniquement pour vous envoyer le fichier demandé et des conseils
                                    pilotage financier (désabonnement en 1 clic). Une fois le fichier reçu, les données que vous
                                    saisissez dans Excel restent sur votre poste tant que vous ne les importez pas dans FinSight.
                                </p>
                            </div>
                        </StaggerItem>
                    </StaggerContainer>
                </div>
            </section>

            <Footer />
        </div>
    )
}

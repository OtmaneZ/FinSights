import { Metadata } from 'next'
import Link from 'next/link'
import { FileSpreadsheet, TrendingUp, ArrowRight, Zap, RefreshCw, GraduationCap } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TemplatesResourceCards from '@/components/ressources/TemplatesResourceCards'

export const metadata: Metadata = {
    title: 'Templates Excel Gratuits Finance | Budget, DSO, Cash Flow | FinSight',
    description: 'Téléchargez gratuitement nos templates Excel professionnels : Budget prévisionnel 2026, Tracker DSO, Dashboard Cash Flow. Prêts à l\'emploi avec formules automatiques.',
    openGraph: {
        title: 'Templates Excel Gratuits pour CFO/DAF | FinSight',
        description: '3 templates Excel professionnels gratuits pour piloter votre PME',
        type: 'website'
    }
}

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                        <FileSpreadsheet className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-semibold">100% Gratuits</span>
                    </div>

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Templates Excel Professionnels<br />
                        <span className="text-accent-primary">pour CFO/DAF</span>
                    </h1>

                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-4">
                        3 fichiers Excel prêts à l'emploi avec formules automatiques,<br />
                        graphiques intégrés et compatibles import FinSight
                    </p>

                    <p className="text-sm text-tertiary">
                        Indiquez prénom et email pour recevoir le fichier Excel • Compatible Excel/Google Sheets
                    </p>
                </div>

                {/* Value Proposition Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="surface rounded-xl p-6 border-2 border-border-default">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                            <Zap className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold mb-2 text-center">Prêts à l'emploi</h3>
                        <p className="text-sm text-secondary text-center">
                            Ouvrez et utilisez immédiatement, formules déjà configurées
                        </p>
                    </div>
                    <div className="surface rounded-xl p-6 border-2 border-border-default">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 mx-auto">
                            <RefreshCw className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-bold mb-2 text-center">Import FinSight</h3>
                        <p className="text-sm text-secondary text-center">
                            Exportez vos données vers FinSight pour analyse IA instantanée
                        </p>
                    </div>
                    <div className="surface rounded-xl p-6 border-2 border-border-default">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                            <GraduationCap className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold mb-2 text-center">100% Finance FR</h3>
                        <p className="text-sm text-secondary text-center">
                            Conformes PCG 2025, terminologie française, benchmarks sectoriels
                        </p>
                    </div>
                </div>

                {/* Templates Grid — capture email avant envoi du xlsx */}
                <TemplatesResourceCards />

                {/* Prévisionnel Trésorerie 90j CTA */}
                <div className="surface rounded-2xl p-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-primary mb-12">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-2">
                                Nouveau : Prévisionnel Trésorerie 90 jours
                            </h3>
                            <p className="text-secondary mb-1">
                                Anticipez vos besoins de trésorerie avec un fichier Excel complet : 
                                encaissements, décaissements, graphiques automatiques et alertes conditionnelles.
                            </p>
                            <p className="text-sm text-green-700 font-semibold">
                                ⚡ Le template le plus demandé par les dirigeants PME
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <Link
                                href="/templates/previsionnel-tresorerie-90j"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-lg whitespace-nowrap"
                            >
                                Télécharger gratuitement
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="surface rounded-2xl p-12 border-2 border-accent-primary-border bg-gradient-to-br from-accent-primary-subtle to-primary text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Vous voulez automatiser tout ça avec l'IA ?
                    </h2>
                    <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
                        FinSight importe vos fichiers Excel et calcule automatiquement 15+ KPIs<br />
                        en 10 secondes. Plus besoin de formules manuelles.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/auth/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all shadow-lg"
                        >
                            Essayer FinSight Gratuitement
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white rounded-lg font-semibold transition-all"
                        >
                            Voir la démo (30 sec)
                        </Link>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10">Questions fréquentes</h2>

                    <div className="space-y-6">
                        <div className="surface rounded-xl p-6 border-2 border-border-default">
                            <h3 className="font-bold mb-2">Pourquoi c'est gratuit ?</h3>
                            <p className="text-secondary text-sm">
                                Ces templates sont offerts pour vous aider à améliorer votre gestion financière.
                                Si vous voulez aller plus loin avec l'analyse IA, découvrez FinSight.
                            </p>
                        </div>

                        <div className="surface rounded-xl p-6 border-2 border-border-default">
                            <h3 className="font-bold mb-2">Comment importer dans FinSight ?</h3>
                            <p className="text-secondary text-sm">
                                Remplissez le template Excel → Exportez en CSV → Uploadez sur FinSight.
                                Le dashboard se génère automatiquement avec tous les KPIs.
                            </p>
                        </div>

                        <div className="surface rounded-xl p-6 border-2 border-border-default">
                            <h3 className="font-bold mb-2">Compatible Google Sheets ?</h3>
                            <p className="text-secondary text-sm">
                                Oui ! Uploadez le fichier .xlsx sur Google Sheets. Les formules sont compatibles
                                (quelques ajustements mineurs possibles sur certaines fonctions avancées).
                            </p>
                        </div>

                        <div className="surface rounded-xl p-6 border-2 border-border-default">
                            <h3 className="font-bold mb-2">Mes données sont-elles sécurisées ?</h3>
                            <p className="text-secondary text-sm">
                                Nous utilisons votre email uniquement pour vous envoyer le fichier demandé et des conseils
                                pilotage financier (désabonnement en 1 clic). Une fois le fichier reçu, les données que vous
                                saisissez dans Excel restent sur votre poste tant que vous ne les importez pas dans FinSight.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

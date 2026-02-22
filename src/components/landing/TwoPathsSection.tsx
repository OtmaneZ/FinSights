import Link from 'next/link'
import { Sparkles, Rocket, ArrowRight } from 'lucide-react'

export default function TwoPathsSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                        Deux façons de travailler ensemble
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Selon votre besoin : accompagnement personnalisé ou plateforme en autonomie
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* LEFT: Consulting Path */}
                    <div className="surface rounded-2xl p-8 lg:p-10 border-2 border-accent-primary hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                        {/* Badge "Accompagnement" */}
                        <div className="absolute top-0 right-0 bg-accent-primary text-white px-4 py-1.5 text-xs font-bold rounded-bl-xl">
                            ACCOMPAGNEMENT
                        </div>

                        <div className="flex items-start gap-4 mb-6 mt-2">
                            <div className="w-14 h-14 rounded-xl bg-accent-primary flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Consulting FP&A sur-mesure
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Audit, dashboard IA personnalisé, refonte data complète
                                </p>
                            </div>
                        </div>

                        {/* Offres tarifaires */}
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                <span className="text-sm font-medium text-gray-700">Diagnostic FinSight™</span>
                                <span className="text-lg font-bold text-accent-primary">290€</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                <span className="text-sm font-medium text-gray-700">Audit approfondi</span>
                                <span className="text-lg font-bold text-accent-primary">2 900€</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <span className="text-sm font-bold text-gray-900">Dashboard IA complet</span>
                                <span className="text-lg font-bold text-accent-primary">6 900€</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-indigo-200">
                                <span className="text-sm font-medium text-gray-700">Data Platform Enterprise</span>
                                <span className="text-base font-bold text-accent-primary">À partir de 12k€</span>
                            </div>
                        </div>

                        {/* Pour qui ? */}
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Idéal pour :</p>
                            <ul className="space-y-1.5 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Scale-ups avec besoins spécifiques (intégration ERP, prédictif)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>PME cherchant une refonte complète du pilotage financier</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Cabinets d'expertise comptable (solution white-label)</span>
                                </li>
                            </ul>
                        </div>

                        <Link
                            href="/consulting"
                            className="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all"
                        >
                            Voir les offres consulting
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* RIGHT: SaaS Path */}
                    <div className="surface rounded-2xl p-8 lg:p-10 border-2 border-gray-200 hover:border-accent-primary hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                        {/* Badge "Self-Service" */}
                        <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1.5 text-xs font-bold rounded-bl-xl">
                            SELF-SERVICE
                        </div>

                        <div className="flex items-start gap-4 mb-6 mt-2">
                            <div className="w-14 h-14 rounded-xl bg-green-100 border-2 border-green-300 flex items-center justify-center flex-shrink-0">
                                <Rocket className="w-7 h-7 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Plateforme SaaS FinSight
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Score instantané, dashboards, CFO virtuel — en autonomie
                                </p>
                            </div>
                        </div>

                        {/* Plans tarifaires */}
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg border border-green-100">
                                <span className="text-sm font-medium text-gray-700">Plan Starter</span>
                                <span className="text-lg font-bold text-green-600">Gratuit</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-sm font-bold text-gray-900">Plan Business</span>
                                <span className="text-lg font-bold text-green-600">249€/mois</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg border border-green-100">
                                <span className="text-sm font-medium text-gray-700">Plan Growth</span>
                                <span className="text-lg font-bold text-green-600">499€/mois</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-emerald-200">
                                <span className="text-sm font-medium text-gray-700">Plan Enterprise</span>
                                <span className="text-base font-bold text-green-600">Sur devis</span>
                            </div>
                        </div>

                        {/* Pour qui ? */}
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Idéal pour :</p>
                            <ul className="space-y-1.5 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Startups et PME cherchant un outil clé en main</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>DAF/CFO voulant tester avant de s'engager</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Équipes finance autonomes sur leur stack</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/dashboard"
                                className="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all"
                            >
                                Essayer gratuitement
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/tarifs"
                                className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 rounded-xl font-semibold text-sm transition-all"
                            >
                                Voir tous les tarifs
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">Pas sûr de votre choix ?</span> Commencez par le{' '}
                        <Link href="/dashboard" className="text-accent-primary hover:underline font-semibold">
                            plan gratuit
                        </Link>{' '}
                        ou{' '}
                        <a href="https://calendly.com/zineinsight" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline font-semibold">
                            discutons 30 min
                        </a>
                    </p>
                </div>
            </div>
        </section>
    )
}

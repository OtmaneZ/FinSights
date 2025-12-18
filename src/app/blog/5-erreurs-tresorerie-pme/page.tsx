import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, AlertTriangle, TrendingDown, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: '5 Erreurs de Trésorerie qui Coûtent Cher aux PME | FinSight',
    description: 'Les erreurs fatales que commettent 80% des dirigeants de PME avec leur trésorerie. Découvrez comment les éviter et sécuriser votre cash.',
    openGraph: {
        title: '5 Erreurs de Trésorerie qui Coûtent Cher aux PME',
        description: 'Évitez les pièges qui mettent en danger 80% des PME françaises',
        type: 'article',
        publishedTime: '2025-12-18T09:00:00Z'
    }
}

export default function ArticlePage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <article className="max-w-4xl mx-auto px-6 py-24">
                {/* Back button */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-secondary hover:text-accent-primary transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux articles
                </Link>

                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                            Trésorerie
                        </span>
                        <span className="text-sm text-tertiary flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            18 décembre 2025
                        </span>
                        <span className="text-sm text-tertiary flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            7 min de lecture
                        </span>
                    </div>

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        5 erreurs de trésorerie qui coûtent cher aux PME
                    </h1>

                    <p className="text-xl text-secondary leading-relaxed">
                        Après 10 ans d'accompagnement de PME, j'ai identifié 5 erreurs récurrentes qui mettent en danger la trésorerie de 80% des entreprises. Voici comment les détecter et les corriger.
                    </p>
                </header>

                {/* Intro */}
                <div className="surface rounded-xl p-8 border-l-4 border-accent-primary mb-12">
                    <p className="text-lg leading-relaxed text-secondary">
                        <strong className="text-primary">La réalité :</strong> En France, 25% des défaillances d'entreprises sont dues à des problèmes de trésorerie,
                        alors que l'activité est rentable sur le papier. La plupart de ces échecs auraient pu être évités.
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    {/* Erreur 1 */}
                    <section className="mb-12">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-primary mb-3">
                                    1. Ne pas suivre le DSO chaque mois
                                </h2>
                                <p className="text-lg text-red-600 font-semibold">
                                    Impact moyen : -50k€ à -200k€ de cash immobilisé
                                </p>
                            </div>
                        </div>

                        <p className="text-secondary leading-relaxed mb-4">
                            <strong>Le symptôme :</strong> Vous envoyez vos factures, mais vous ne suivez pas précisément le délai moyen de paiement.
                            Résultat : votre DSO (Days Sales Outstanding) passe de 45 à 65 jours sans que vous vous en rendiez compte.
                        </p>

                        <p className="text-secondary leading-relaxed mb-4">
                            <strong>Cas réel :</strong> PME services 2M€ CA. DSO passé de 42 à 68 jours en 6 mois = 140k€ de cash "gelé" chez les clients.
                            L'entreprise payait des agios bancaires alors que l'argent était juste… en retard.
                        </p>

                        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-6">
                            <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                La solution
                            </h3>
                            <ul className="space-y-2 text-green-900">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Calculer votre DSO le 5 de chaque mois (formule : (Créances clients / CA) × 365)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Automatiser les relances à J+15, J+30, J+45</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Dashboard avec alerte si DSO {'>'}objectif +5 jours</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Erreur 2 */}
                    <section className="mb-12">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-primary mb-3">
                                    2. Confondre rentabilité et trésorerie
                                </h2>
                                <p className="text-lg text-red-600 font-semibold">
                                    Impact : Faillite alors que l'entreprise est rentable
                                </p>
                            </div>
                        </div>

                        <p className="text-secondary leading-relaxed mb-4">
                            <strong>Le piège :</strong> Votre P&L affiche +15% de marge nette, mais votre compte bancaire est à découvert.
                            Vous êtes rentable… mais sans cash.
                        </p>

                        <p className="text-secondary leading-relaxed mb-4">
                            <strong>Pourquoi ça arrive :</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-secondary mb-4 ml-4">
                            <li>Vos clients paient à 60j, vos fournisseurs à 30j</li>
                            <li>Vous investissez (recrutement, équipements) avant d'encaisser</li>
                            <li>Le BFR augmente plus vite que votre CA</li>
                        </ul>

                        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-6">
                            <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                La solution
                            </h3>
                            <ul className="space-y-2 text-green-900">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Suivre le cash-flow prévisionnel à 90 jours (pas le P&L)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Calculer votre BFR chaque trimestre</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Règle d'or : ne jamais investir sans avoir le cash d'avance</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Erreur 3 */}
                    <section className="mb-12">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-primary mb-3">
                                    3. Négliger les petites factures impayées
                                </h2>
                                <p className="text-lg text-red-600 font-semibold">
                                    Impact moyen : 5-10% du CA immobilisé
                                </p>
                            </div>
                        </div>

                        <p className="text-secondary leading-relaxed mb-4">
                            <strong>L'erreur :</strong> "C'est que 500€, je relancerai plus tard." Sauf que vous avez 40 factures comme ça.
                            Total : 20k€ en retard.
                        </p>

                        <p className="text-secondary leading-relaxed mb-4">
                            <strong>Stat réelle :</strong> Les PME qui ne relancent pas systématiquement les factures {"<"} 1000€ ont en moyenne
                            8% de leur CA en créances de +90 jours.
                        </p>

                        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-6">
                            <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                La solution
                            </h3>
                            <ul className="space-y-2 text-green-900">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Process automatique : toute facture non payée à J+30 = relance automatique</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Tableau de bord "Créances +60j" consulté chaque semaine</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Pas d'exception : même 200€, on relance</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Erreur 4 */}
                    <section className="mb-12">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-primary mb-3">
                                    4. Payer les fournisseurs trop tôt
                                </h2>
                                <p className="text-lg text-red-600 font-semibold">
                                    Impact : Cash utilisé inutilement
                                </p>
                            </div>
                        </div>

                        <p className="text-secondary leading-relaxed mb-4">
                            <strong>L'erreur :</strong> Vous payez vos fournisseurs dès réception de facture, alors que vous avez négocié 30j.
                            Vous "offrez" 30 jours de cash gratuit.
                        </p>

                        <p className="text-secondary leading-relaxed mb-4">
                            <strong>Exemple chiffré :</strong> 50k€ de charges mensuelles. En payant à J+30 au lieu de J+5,
                            vous gardez ~45k€ de plus en trésorerie permanente.
                        </p>

                        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-6">
                            <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                La solution
                            </h3>
                            <ul className="space-y-2 text-green-900">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Payer à J+28 (pas avant) si vos conditions sont 30j</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Négocier 45-60j avec vos principaux fournisseurs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Automatiser le paiement au dernier jour autorisé</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Erreur 5 */}
                    <section className="mb-12">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-primary mb-3">
                                    5. Ne pas avoir de prévisionnel trésorerie
                                </h2>
                                <p className="text-lg text-red-600 font-semibold">
                                    Impact : Découverts imprévus et crises
                                </p>
                            </div>
                        </div>

                        <p className="text-secondary leading-relaxed mb-4">
                            <strong>Le problème :</strong> Vous pilotez à vue. Vous découvrez que vous serez à découvert…
                            le jour où vous l'êtes.
                        </p>

                        <p className="text-secondary leading-relaxed mb-4">
                            <strong>Stat alarmante :</strong> 60% des PME n'ont pas de cash-flow prévisionnel à 90 jours.
                            Elles gèrent leur trésorerie comme leur compte perso.
                        </p>

                        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-6">
                            <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                La solution
                            </h3>
                            <ul className="space-y-2 text-green-900">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Construire un prévisionnel de trésorerie à 3-6 mois minimum</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Mettre à jour chaque semaine (pas chaque mois)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>Alerte automatique si tréso prévisionnelle {"<"} seuil critique</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6">
                            Ce qu'il faut retenir
                        </h2>

                        <div className="surface rounded-xl p-8 border-2 border-accent-primary-border mb-8">
                            <h3 className="text-xl font-bold mb-4 text-primary">
                                Les 3 règles d'or pour sécuriser votre trésorerie :
                            </h3>
                            <ol className="space-y-3 text-secondary">
                                <li className="flex items-start gap-3">
                                    <span className="font-bold text-accent-primary">1.</span>
                                    <span><strong>Suivre 3 KPIs chaque mois :</strong> DSO, BFR, Cash-flow prévisionnel 90j</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="font-bold text-accent-primary">2.</span>
                                    <span><strong>Automatiser les relances :</strong> Aucune facture ne doit passer 45j sans relance</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="font-bold text-accent-primary">3.</span>
                                    <span><strong>Avoir un tableau de bord :</strong> Pas d'Excel manuel, un vrai dashboard mis à jour automatiquement</span>
                                </li>
                            </ol>
                        </div>

                        <p className="text-secondary leading-relaxed">
                            La bonne nouvelle ? Ces 5 erreurs sont faciles à corriger une fois identifiées.
                            La mauvaise ? Si vous ne les corrigez pas, elles coûteront tôt ou tard très cher.
                        </p>
                    </section>
                </div>

                {/* CTA Final */}
                <div className="surface rounded-2xl p-8 border-2 border-accent-primary-border text-center mt-16">
                    <h3 className="text-2xl font-bold mb-4">Besoin d'aide pour sécuriser votre trésorerie ?</h3>
                    <p className="text-secondary mb-6 max-w-2xl mx-auto">
                        Je peux auditer votre situation en 48h et vous proposer un plan d'action concret
                        pour améliorer votre cash-flow.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"
                        >
                            Audit trésorerie express (990€)
                            <ArrowRight className="w-5 h-5" />
                        </a>
                        <Link
                            href="/consulting"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold transition-all"
                        >
                            Voir toutes les offres
                        </Link>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    )
}

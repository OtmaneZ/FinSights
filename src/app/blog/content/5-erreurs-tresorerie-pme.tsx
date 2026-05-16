import Link from 'next/link'
import { CheckCircle2, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react'

export const articleBody = (
<div className="published-article-body">
{/* Back button */}
                {/* Header */}
                {/* Intro */}
                <div className="bg-slate-50 rounded-xl p-8 border-l-4 border-blue-500 mb-12">
                    <p className="text-lg leading-relaxed text-slate-700">
                        <strong className="text-slate-900">La réalité :</strong> En France, 25% des défaillances d'entreprises sont dues à des problèmes de trésorerie,
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
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                    1. Ne pas suivre le DSO chaque mois
                                </h2>
                                <p className="text-lg text-red-600 font-semibold">
                                    Impact moyen : -50k€ à -200k€ de cash immobilisé
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>Le symptôme :</strong> Vous envoyez vos factures, mais vous ne suivez pas précisément le délai moyen de paiement.
                            Résultat : votre DSO (Days Sales Outstanding) passe de 45 à 65 jours sans que vous vous en rendiez compte.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-4">
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
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                    2. Confondre rentabilité et trésorerie
                                </h2>
                                <p className="text-lg text-red-600 font-semibold">
                                    Impact : Faillite alors que l'entreprise est rentable
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>Le piège :</strong> Votre P&L affiche +15% de marge nette, mais votre compte bancaire est à découvert.
                            Vous êtes rentable… mais sans cash.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>Pourquoi ça arrive :</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4 ml-4">
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
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                    3. Négliger les petites factures impayées
                                </h2>
                                <p className="text-lg text-red-600 font-semibold">
                                    Impact moyen : 5-10% du CA immobilisé
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>L'erreur :</strong> "C'est que 500€, je relancerai plus tard." Sauf que vous avez 40 factures comme ça.
                            Total : 20k€ en retard.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-4">
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
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                    4. Payer les fournisseurs trop tôt
                                </h2>
                                <p className="text-lg text-red-600 font-semibold">
                                    Impact : Cash utilisé inutilement
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>L'erreur :</strong> Vous payez vos fournisseurs dès réception de facture, alors que vous avez négocié 30j.
                            Vous "offrez" 30 jours de cash gratuit.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-4">
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
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                    5. Ne pas avoir de prévisionnel trésorerie
                                </h2>
                                <p className="text-lg text-red-600 font-semibold">
                                    Impact : Découverts imprévus et crises
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>Le problème :</strong> Vous pilotez à vue. Vous découvrez que vous serez à découvert…
                            le jour où vous l'êtes.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-4">
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
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                            Ce qu'il faut retenir
                        </h2>

                        <div className="bg-slate-50 rounded-xl p-8 border-2 border-accent-primary-border mb-8">
                            <h3 className="text-xl font-bold mb-4 text-slate-900">
                                Les 3 règles d'or pour sécuriser votre trésorerie :
                            </h3>
                            <ol className="space-y-3 text-slate-700">
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

                        <p className="text-slate-700 leading-relaxed">
                            La bonne nouvelle ? Ces 5 erreurs sont faciles à corriger une fois identifiées.
                            La mauvaise ? Si vous ne les corrigez pas, elles coûteront tôt ou tard très cher.
                        </p>
                    </section>
                </div>

                {/* CTA Final */}
</div>
)

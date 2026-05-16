import Link from 'next/link'
import { CheckCircle2, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react'

export const articleBody = (
<div className="published-article-body">
{/* Retour */}
                {/* En-tête */}
                {/* Corps */}
                <div className="prose prose-lg max-w-none space-y-8 text-slate-700 leading-relaxed">

                    <p>
                        Ce que j&apos;observe depuis quelques mois, c&apos;est une configuration particulièrement vicieuse : deux pressions distinctes qui s&apos;exercent simultanément sur la trésorerie des PME françaises. L&apos;une vient de l&apos;intérieur - les PGE arrivent à échéance. L&apos;autre vient de l&apos;extérieur - les clients paient de plus en plus tard. Séparément, chacune est gérable. Ensemble, elles forment un étau.
                    </p>

                    {/* Section 1 */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Ce que disent les chiffres</h2>

                    <p>
                        Je n&apos;aime pas les articles qui citent des études pour paraître sérieux. Mais là, les données méritent d&apos;être lues.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4 my-8">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
                            <p className="text-3xl font-bold text-red-700 mb-1">65 j</p>
                            <p className="text-sm text-red-800">DSO moyen des PME françaises en 2025 <span className="block text-xs text-red-600 mt-1">(Agicap, 8 000 entreprises)</span></p>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
                            <p className="text-3xl font-bold text-orange-700 mb-1">55 %</p>
                            <p className="text-sm text-orange-800">des PME ayant souscrit un PGE prévoient de le solder d&apos;ici fin 2026 <span className="block text-xs text-orange-600 mt-1">(Bpifrance)</span></p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                            <p className="text-3xl font-bold text-amber-700 mb-1">−6,3 %</p>
                            <p className="text-sm text-amber-800">de contraction des crédits de trésorerie bancaires <span className="block text-xs text-amber-600 mt-1">(Banque de France)</span></p>
                        </div>
                    </div>

                    <p>
                        La Banque de France projette un retard de paiement moyen à 13 jours en 2026, contre 11,9 jours fin 2023. Ce n&apos;est pas une dégradation marginale - c&apos;est une tendance structurelle qui s&apos;installe. Et le robinet court terme se referme exactement au moment où on en aurait besoin.
                    </p>

                    {/* Section 2 */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Le mécanisme du double étau</h2>

                    <p>Voilà comment ça se combine, concrètement.</p>

                    <div className="space-y-4 my-6">
                        <div className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 mb-1">PGE en sortie</p>
                                <p className="text-slate-600 text-sm">Un PGE de 150 000 € sur 5 ans, c&apos;est environ 2 500 € de remboursement mensuel. Ça semble gérable isolément. Mais ce n&apos;est jamais isolé.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 mb-1">DSO qui s&apos;allonge</p>
                                <p className="text-slate-600 text-sm">Sur 1 M€ de CA annuel, passer de 45 à 65 jours de DSO, c&apos;est <strong>55 000 € de cash supplémentaire immobilisé</strong> en permanence dans les créances clients. Ce cash n&apos;est pas perdu - il reviendra. Mais il n&apos;est pas disponible maintenant.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 mb-1">Crédit de trésorerie qui se resserre</p>
                                <p className="text-slate-600 text-sm">Les banques, plus sélectives depuis 2024, hésitent à accorder des lignes de découvert à des PME qui portent déjà un PGE en cours. Le filet de sécurité traditionnel disparaît.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
                        <p className="font-bold text-red-900 mb-1">Ces trois phénomènes se renforcent mutuellement. C&apos;est ça, l&apos;étau.</p>
                        <p className="text-red-800 text-sm">Aucun des trois pris isolément n&apos;est fatal. Ensemble, ils peuvent mettre à genoux une PME parfaitement rentable.</p>
                    </div>

                    {/* Section 3 */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Ce que j&apos;observe sur le terrain</h2>

                    <p>
                        <strong>Le premier pattern que je vois : les dirigeants réagissent trop tard.</strong> La trésorerie se dégrade sur 3 à 4 mois avant que quelqu&apos;un pose le diagnostic. Et à ce moment-là, les options se réduisent.
                    </p>

                    <p>
                        <strong>Le deuxième pattern : on confond le symptôme et la cause.</strong> Un DSO à 65 jours sur un secteur Services dont la médiane est à 48 jours, ce n&apos;est pas un problème de relance. C&apos;est souvent un problème de cycle de facturation - on facture en fin de mois au lieu de facturer à la livraison, on accorde des délais pour ne pas froisser un gros client, on laisse les avenants traîner. Le recouvrement ne résout pas ça.
                    </p>

                    <p>
                        <strong>Le troisième pattern, et c&apos;est celui qui me préoccupe le plus : les PGE ont anesthésié la vigilance.</strong> Entre 2020 et 2022, beaucoup de PME ont traversé des situations difficiles avec de la liquidité artificielle. Aujourd&apos;hui cette liquidité disparaît, et elles se retrouvent face à leurs vraies conditions d&apos;exploitation - sans les réflexes qui vont avec.
                    </p>

                    {/* Section 4 */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">3 décisions à prendre maintenant</h2>

                    <div className="space-y-6">
                        <div className="border-l-4 border-emerald-500 pl-6">
                            <p className="font-bold text-slate-900 text-lg mb-2">1. Mesurer avant d&apos;agir</p>
                            <p className="text-slate-600">
                                Calculez votre DSO réel aujourd&apos;hui - pas celui de votre dernier bilan, celui de ce mois-ci. Croisez-le avec votre balance âgée : combien de jours de CA sont immobilisés dans vos créances ? Quel est votre burn net mensuel une fois le PGE inclus ? Ces trois chiffres vous donnent une image exacte de votre situation. Sans eux, vous pilotez à l&apos;aveugle.
                            </p>
                        </div>

                        <div className="border-l-4 border-emerald-500 pl-6">
                            <p className="font-bold text-slate-900 text-lg mb-2">2. Reprendre la main sur le cycle de facturation</p>
                            <p className="text-slate-600">
                                Chaque jour de retard à facturer devient un jour supplémentaire d&apos;attente. C&apos;est mécanique. Si vous facturez en fin de mois et que votre délai contractuel est 30 jours, vous attendez en réalité 45 à 60 jours en moyenne. Facturez à la livraison. Sur 1 M€ de CA, ramener le cycle de facturation de J+15 à J+0 libère environ <strong>40 000 € de cash - sans toucher à un seul client.</strong>
                            </p>
                        </div>

                        <div className="border-l-4 border-emerald-500 pl-6">
                            <p className="font-bold text-slate-900 text-lg mb-2">3. Renégocier maintenant, pas en urgence</p>
                            <p className="text-slate-600">
                                Si vous anticipez une tension de trésorerie dans les 3 mois qui viennent, c&apos;est maintenant qu&apos;il faut appeler votre banquier - pas quand le compte est dans le rouge. Les lignes de découvert se négocient en position de force. Un rééchelonnement de PGE se demande avant de rater une échéance. Passé ce point, les options changent de nature.
                            </p>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Ce que ça révèle au fond</h2>

                    <p>
                        La double pression PGE + DSO n&apos;est pas une mauvaise période à traverser. C&apos;est un révélateur. Les PME qui s&apos;en sortent bien ne sont pas celles qui ont le plus de cash - ce sont celles qui pilotent leur cycle d&apos;exploitation avec précision : elles connaissent leur DSO hebdomadaire, leur BFR réel, leur runway. Elles ne découvrent pas leur situation de trésorerie dans les comptes du trimestre précédent.
                    </p>

                    <div className="bg-slate-900 rounded-xl p-6 my-8">
                        <p className="text-white text-lg font-medium leading-relaxed">
                            &ldquo; La maîtrise du cash n&apos;est plus une fonction financière qu&apos;on délègue à l&apos;expert-comptable. C&apos;est redevenu ce qu&apos;elle a toujours été : le cœur du réacteur. &rdquo;
                        </p>
                    </div>

                    {/* Liens calculateurs */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 my-8">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <p className="font-bold text-emerald-900">Calculez votre DSO et votre BFR en 2 minutes</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/calculateurs/dso"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-emerald-300 text-emerald-700 font-medium text-sm rounded-lg hover:bg-emerald-50 transition-colors"
                            >
                                Calculateur DSO →
                            </Link>
                            <Link
                                href="/calculateurs/bfr"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-emerald-300 text-emerald-700 font-medium text-sm rounded-lg hover:bg-emerald-50 transition-colors"
                            >
                                Calculateur BFR →
                            </Link>
                            <Link
                                href="/calculateurs/burn-rate"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-emerald-300 text-emerald-700 font-medium text-sm rounded-lg hover:bg-emerald-50 transition-colors"
                            >
                                Calculateur Burn Rate →
                            </Link>
                        </div>
                    </div>

                </div>

                {/* CTA bas d'article */}
</div>
)

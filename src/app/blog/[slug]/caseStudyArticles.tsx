/**
 * ÉTUDES DE CAS — Conversion par la preuve
 * 
 * Ton : cabinet, chiffres précis, avant/après.
 * Format : contexte → diagnostic → actions → résultats → enseignement.
 * L'IA est absente. L'expertise financière est centrale.
 * Chaque étude se termine par un CTA orienté dirigeant.
 */

import Link from 'next/link'
import { ArrowRight, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react'

// ─── Bloc de transition étude de cas ───────────────────────────
function TransitionCaseStudy({ situation, resultat }: {
    situation: string
    resultat: string
}) {
    return (
        <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="bg-emerald-50 rounded-xl p-8 border border-emerald-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif">
                    Ce que cette situation révèle
                </h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Situation de départ</span>
                            <p className="text-slate-800 mt-1">{situation}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Résultat obtenu</span>
                            <p className="text-slate-800 mt-1">{resultat}</p>
                        </div>
                    </div>
                </div>
                <div className="pt-6 border-t border-emerald-200">
                    <p className="text-slate-600 text-sm mb-4">
                        Votre PME est dans une situation similaire ?
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="https://calendly.com/zineinsight/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all text-sm"
                        >
                            Identifier mes leviers financiers
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <Link
                            href="/diagnostic/guide"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg font-semibold transition-all text-sm"
                        >
                            Lancer mon diagnostic
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const caseStudyArticles: Record<string, {
    slug: string
    title: string
    category: string
    readTime: string
    date: string
    metaDescription: string
    content: React.ReactNode
}> = {

    // ═══════════════════════════════════════════════════════════
    // ÉTUDE 1 — PME B2B 6M€ → 240k€ de cash libéré en 4 mois
    // ═══════════════════════════════════════════════════════════
    'pme-b2b-6m-240k-cash-libere-4-mois': {
        slug: 'pme-b2b-6m-240k-cash-libere-4-mois',
        title: 'Comment une PME B2B à 6M€ a libéré 240k€ de cash en 4 mois',
        category: 'Étude de cas',
        readTime: '11 min',
        date: '21 février 2026',
        metaDescription: 'PME B2B services, 6M€ de CA. DSO de 72 jours, BFR en dérive. Diagnostic structuré et plan d\'action : 240k€ de cash libéré en 4 mois.',
        content: (
            <>
                <h2 className="font-serif">Contexte : une PME rentable sous tension de trésorerie</h2>
                <p>
                    PME de services B2B, région parisienne. <strong>6,2M€ de chiffre d&apos;affaires</strong>, 
                    12 collaborateurs, croissance régulière de 8-10% par an depuis 3 ans.
                </p>
                <p>
                    Sur le papier, tout va bien. Marge brute à 42%, résultat net positif, carnet de commandes plein.
                    Le dirigeant investit : recrutement, nouveau bureau, outillage digital.
                </p>
                <p>
                    Sauf que la trésorerie ne suit pas. Découverts ponctuels. Relances fournisseurs.
                    Le dirigeant compense en injectant du cash personnel. <strong>&laquo; C&apos;est temporaire &raquo;</strong>, dit-il.
                </p>

                <div className="my-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                    <p className="font-semibold text-amber-800 mb-2">Signal d&apos;alerte ignoré</p>
                    <p className="text-amber-700">
                        Quand un dirigeant injecte du cash personnel dans une entreprise rentable, 
                        le problème n&apos;est pas la rentabilité — c&apos;est la structure du BFR.
                    </p>
                </div>

                <h2 className="font-serif">Diagnostic : les chiffres avant intervention</h2>
                
                <div className="my-8 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-slate-300">
                                <th className="text-left py-3 px-4 font-semibold text-slate-600">Indicateur</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Valeur constatée</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Médiane sectorielle</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Écart</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">DSO (délai client)</td>
                                <td className="text-right py-3 px-4 text-red-600 font-bold">72 jours</td>
                                <td className="text-right py-3 px-4">48 jours</td>
                                <td className="text-right py-3 px-4 text-red-600">+24 jours</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">BFR en jours de CA</td>
                                <td className="text-right py-3 px-4 text-red-600 font-bold">68 jours</td>
                                <td className="text-right py-3 px-4">42 jours</td>
                                <td className="text-right py-3 px-4 text-red-600">+26 jours</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">Trésorerie nette</td>
                                <td className="text-right py-3 px-4 text-red-600 font-bold">-85k€</td>
                                <td className="text-right py-3 px-4">+120k€</td>
                                <td className="text-right py-3 px-4 text-red-600">-205k€</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-medium">Créances &gt;60 jours</td>
                                <td className="text-right py-3 px-4 text-red-600 font-bold">340k€</td>
                                <td className="text-right py-3 px-4">—</td>
                                <td className="text-right py-3 px-4 text-red-600">23% du CA annuel encaissable</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p>
                    <strong>Diagnostic :</strong> l&apos;entreprise finance la croissance de ses clients. 
                    72 jours de DSO signifie que chaque euro de CA met 2,5 mois à rentrer. 
                    Pendant ce temps, les salaires, le loyer, les charges tombent chaque mois.
                </p>

                <h2 className="font-serif">Phase 1 (Mois 1) — Cartographie et segmentation créances</h2>
                <p>Première action : cartographier les créances par client, par ancienneté, par montant.</p>
                <ul>
                    <li><strong>Top 5 clients</strong> = 62% des créances &gt;60 jours. Pas un problème systémique — un problème concentré.</li>
                    <li><strong>2 clients sur 5</strong> payaient à 90+ jours par habitude, pas par difficulté. Aucune relance structurée n&apos;existait.</li>
                    <li><strong>1 client</strong> (18% du CA) imposait un délai contractuel de 75 jours — jamais renégocié depuis 4 ans.</li>
                </ul>

                <h2 className="font-serif">Phase 2 (Mois 2-3) — Actions correctives</h2>
                <h3>Processus de facturation</h3>
                <ul>
                    <li>Facturation à J+1 de la livraison (vs J+7 en moyenne avant).</li>
                    <li>Relance automatique à J+30, J+45, J+55.</li>
                    <li>Appel téléphonique systématique à J+50 (pas un mail — un appel).</li>
                </ul>

                <h3>Renégociation ciblée</h3>
                <ul>
                    <li>Client principal : passage de 75 à 55 jours, en échange d&apos;un engagement volume annualisé.</li>
                    <li>2 clients &laquo; retardataires par habitude &raquo; : passage de 90+ à 45 jours après un simple échange direct avec le dirigeant.</li>
                </ul>

                <h3>Conditions commerciales</h3>
                <ul>
                    <li>Escompte de 1,5% pour paiement à 15 jours sur les nouveaux contrats.</li>
                    <li>Pénalités de retard activées (pas appliquées systématiquement, mais mentionnées dans les CGV et rappelées en relance).</li>
                </ul>

                <h2 className="font-serif">Phase 3 (Mois 4) — Optimisation fournisseurs</h2>
                <p>
                    En parallèle, renégociation des délais fournisseurs. L&apos;entreprise payait à 25 jours en moyenne. 
                    Passage à 40 jours sur les 3 principaux fournisseurs (70% des achats), 
                    sans dégradation de la relation.
                </p>

                <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="font-semibold text-slate-800 mb-2">Levier souvent négligé</p>
                    <p className="text-slate-600">
                        Allonger les délais fournisseurs de 15 jours quand vous achetez pour 2,4M€/an, 
                        c&apos;est <strong>100k€ de cash qui reste dans votre trésorerie</strong> en permanence.
                    </p>
                </div>

                <h2 className="font-serif">Résultats à 4 mois</h2>

                <div className="my-8 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-slate-300">
                                <th className="text-left py-3 px-4 font-semibold text-slate-600">Indicateur</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Avant</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Après (M+4)</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">DSO</td>
                                <td className="text-right py-3 px-4">72 jours</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">49 jours</td>
                                <td className="text-right py-3 px-4 text-emerald-600">-23 jours</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">BFR en jours de CA</td>
                                <td className="text-right py-3 px-4">68 jours</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">41 jours</td>
                                <td className="text-right py-3 px-4 text-emerald-600">-27 jours</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">Trésorerie nette</td>
                                <td className="text-right py-3 px-4">-85k€</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">+155k€</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">+240k€</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-medium">Découvert bancaire</td>
                                <td className="text-right py-3 px-4">Fréquent</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">Supprimé</td>
                                <td className="text-right py-3 px-4 text-emerald-600">12k€/an économisés en agios</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 className="font-serif">Ce que cette mission enseigne</h2>
                <p>
                    <strong>Le cash n&apos;est pas un résultat — c&apos;est une discipline.</strong> Cette PME 
                    n&apos;avait pas un problème de rentabilité. Elle avait un problème de structure : 
                    elle encaissait trop tard et payait trop tôt.
                </p>
                <p>
                    Les 240k€ libérés n&apos;ont pas été &laquo; créés &raquo;. Ils étaient là, immobilisés dans les créances clients 
                    et dans un BFR que personne ne pilotait. Il a suffi de restructurer les flux.
                </p>
                <p>
                    Le dirigeant n&apos;a plus injecté de cash personnel depuis.
                </p>

                <TransitionCaseStudy
                    situation="PME rentable à 6M€ avec trésorerie négative, DSO de 72 jours et BFR en dérive."
                    resultat="+240k€ de cash libéré en 4 mois. Découvert supprimé. BFR ramené à la médiane sectorielle."
                />
            </>
        )
    },

    // ═══════════════════════════════════════════════════════════
    // ÉTUDE 2 — DSO de 62 à 41 jours sans casser la relation
    // ═══════════════════════════════════════════════════════════
    'reduire-dso-62-41-jours-relation-client': {
        slug: 'reduire-dso-62-41-jours-relation-client',
        title: 'Comment réduire un DSO de 62 à 41 jours sans détériorer la relation client',
        category: 'Étude de cas',
        readTime: '10 min',
        date: '21 février 2026',
        metaDescription: 'PME de services à 4,5M€. DSO de 62 jours. 3 leviers activés en 90 jours : segmentation, process, relance structurée. Résultat : DSO à 41 jours.',
        content: (
            <>
                <h2 className="font-serif">Le problème : un DSO qui ne baisse jamais</h2>
                <p>
                    PME de services informatiques, <strong>4,5M€ de CA</strong>, 8 salariés, 
                    clientèle mixte (PME et ETI). Le dirigeant le sait : ses clients paient tard. 
                    Il a essayé les relances, les pénalités dans les CGV, l&apos;affacturage.
                </p>
                <p>
                    Rien ne bouge. <strong>DSO stable à 62 jours</strong> depuis 18 mois.
                </p>
                <p>
                    Le problème principal : le dirigeant a peur de &laquo; froisser &raquo; ses clients. 
                    Et l&apos;ADV (administration des ventes) n&apos;a aucun process formalisé.
                </p>

                <div className="my-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                    <p className="font-semibold text-amber-800 mb-2">L&apos;erreur classique</p>
                    <p className="text-amber-700">
                        Traiter tous les clients de la même façon. Un client à 15k€/an et un client à 
                        400k€/an ne se relancent pas avec le même process ni le même interlocuteur.
                    </p>
                </div>

                <h2 className="font-serif">Diagnostic : ce que les chiffres révèlent</h2>
                <p>Analyse du poste clients par segment :</p>

                <div className="my-8 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-slate-300">
                                <th className="text-left py-3 px-4 font-semibold text-slate-600">Segment</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">% du CA</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">DSO moyen</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Créances &gt;45j</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">ETI (3 clients)</td>
                                <td className="text-right py-3 px-4">45%</td>
                                <td className="text-right py-3 px-4 text-red-600 font-bold">78 jours</td>
                                <td className="text-right py-3 px-4 text-red-600">285k€</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">PME (&gt;50k€/an)</td>
                                <td className="text-right py-3 px-4">35%</td>
                                <td className="text-right py-3 px-4 text-amber-600 font-bold">52 jours</td>
                                <td className="text-right py-3 px-4 text-amber-600">95k€</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-medium">Petits clients (&lt;50k€)</td>
                                <td className="text-right py-3 px-4">20%</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">38 jours</td>
                                <td className="text-right py-3 px-4 text-emerald-600">15k€</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p>
                    <strong>Le DSO de 62 jours est une moyenne qui masque tout.</strong> 
                    Le problème est concentré sur 3 clients ETI qui paient à 78 jours 
                    et représentent 45% du CA.
                </p>

                <h2 className="font-serif">Levier 1 — Segmentation du process de relance</h2>
                <p>
                    Chaque segment a désormais un circuit de relance distinct :
                </p>
                <ul>
                    <li><strong>ETI :</strong> relance par le dirigeant directement (pair-à-pair avec le DAF client). 
                    Appel à J+35, mail formel à J+45, mise en demeure douce à J+60.</li>
                    <li><strong>PME :</strong> relance automatisée + appel ADV à J+40.</li>
                    <li><strong>Petits clients :</strong> relance 100% automatique, avec lien de paiement en ligne.</li>
                </ul>

                <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="font-semibold text-slate-800 mb-2">Le changement décisif</p>
                    <p className="text-slate-600">
                        Quand le dirigeant appelle le DAF d&apos;une ETI pour parler de délais de paiement, 
                        c&apos;est une conversation entre pairs. Quand l&apos;ADV envoie un mail de relance, 
                        c&apos;est du bruit administratif. <strong>Même sujet, impact radicalement différent.</strong>
                    </p>
                </div>

                <h2 className="font-serif">Levier 2 — Facturation à la livraison</h2>
                <ul>
                    <li>Facturation passée de J+5 à J+0 (jour de livraison/validation).</li>
                    <li>Gain mécanique : <strong>5 jours de DSO</strong> supprimés sans aucune négociation.</li>
                    <li>Mise en place d&apos;acomptes de 30% sur les nouveaux contrats ETI (&gt;50k€).</li>
                </ul>

                <h2 className="font-serif">Levier 3 — Conditions contractuelles</h2>
                <ul>
                    <li>Renégociation du client ETI principal : passage de &laquo; 60 jours fin de mois &raquo; à &laquo; 45 jours nets &raquo;, en échange d&apos;un prix bloqué 12 mois.</li>
                    <li>Introduction d&apos;un escompte de 2% pour paiement à 10 jours sur les contrats récurrents.</li>
                    <li>Refus poli mais ferme des conditions &laquo; 90 jours &raquo; sur les nouveaux prospects.</li>
                </ul>

                <h2 className="font-serif">Résultats à 90 jours</h2>

                <div className="my-8 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-slate-300">
                                <th className="text-left py-3 px-4 font-semibold text-slate-600">Indicateur</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Avant</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Après (M+3)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">DSO global</td>
                                <td className="text-right py-3 px-4">62 jours</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">41 jours</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">DSO segment ETI</td>
                                <td className="text-right py-3 px-4">78 jours</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">51 jours</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">Créances &gt;45 jours</td>
                                <td className="text-right py-3 px-4">395k€</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">110k€</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-medium">Cash libéré</td>
                                <td className="text-right py-3 px-4">—</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">+175k€</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p>
                    <strong>Aucun client perdu.</strong> Un client ETI a même augmenté son budget 
                    après la renégociation — la clarté des conditions a renforcé la confiance.
                </p>

                <h2 className="font-serif">Ce que cette mission enseigne</h2>
                <p>
                    Réduire le DSO, ce n&apos;est pas &laquo; être agressif avec ses clients &raquo;. 
                    C&apos;est <strong>professionnaliser la gestion du poste clients</strong>.
                </p>
                <p>
                    Les dirigeants qui ne relancent pas par peur de froisser financent, 
                    sans le savoir, la trésorerie de leurs propres clients.
                </p>
                <p>
                    21 jours de DSO en moins sur 4,5M€ de CA = <strong>260k€ de cash en jeu chaque année</strong>.
                </p>

                <TransitionCaseStudy
                    situation="DSO de 62 jours chronique, pas de process de relance, peur de froisser les clients."
                    resultat="DSO à 41 jours en 90 jours. +175k€ de cash. Aucun client perdu."
                />
            </>
        )
    },

    // ═══════════════════════════════════════════════════════════
    // ÉTUDE 3 — PME 8M€ et risque de dépendance sous-estimé
    // ═══════════════════════════════════════════════════════════
    'pme-8m-risque-dependance-sous-estime': {
        slug: 'pme-8m-risque-dependance-sous-estime',
        title: 'Pourquoi cette PME à 8M€ de CA sous-estimait son risque de dépendance',
        category: 'Étude de cas',
        readTime: '12 min',
        date: '21 février 2026',
        metaDescription: 'PME industrielle, 8M€ de CA. Un client à 38% du chiffre. Marge correcte, dirigeant serein. Analyse structurelle : le risque était systémique.',
        content: (
            <>
                <h2 className="font-serif">Contexte : une PME qui va bien — en apparence</h2>
                <p>
                    PME industrielle, sous-traitance technique, <strong>8,1M€ de CA</strong>, 
                    28 collaborateurs. Marge brute à 35%, résultat net à 5,2%.
                </p>
                <p>
                    Le dirigeant vient avec une demande simple : structurer son reporting 
                    pour convaincre sa banque d&apos;un financement d&apos;investissement (nouvelle machine-outil, 450k€).
                </p>
                <p>
                    Le problème n&apos;est pas le reporting. C&apos;est ce que le reporting va révéler.
                </p>

                <h2 className="font-serif">Ce que l&apos;analyse révèle</h2>
                
                <h3>Concentration client</h3>
                <div className="my-8 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-slate-300">
                                <th className="text-left py-3 px-4 font-semibold text-slate-600">Client</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">CA annuel</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">% du CA total</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Marge réelle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200 bg-red-50">
                                <td className="py-3 px-4 font-medium">Client A (ETI automobile)</td>
                                <td className="text-right py-3 px-4 font-bold">3,08M€</td>
                                <td className="text-right py-3 px-4 text-red-600 font-bold">38%</td>
                                <td className="text-right py-3 px-4 text-red-600">22%</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">Client B</td>
                                <td className="text-right py-3 px-4">1,22M€</td>
                                <td className="text-right py-3 px-4">15%</td>
                                <td className="text-right py-3 px-4">38%</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">Client C</td>
                                <td className="text-right py-3 px-4">0,89M€</td>
                                <td className="text-right py-3 px-4">11%</td>
                                <td className="text-right py-3 px-4">41%</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-medium">Autres (12 clients)</td>
                                <td className="text-right py-3 px-4">2,91M€</td>
                                <td className="text-right py-3 px-4">36%</td>
                                <td className="text-right py-3 px-4">44%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="my-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <p className="font-semibold text-red-800 mb-2">3 risques structurels combinés</p>
                    <ul className="text-red-700 space-y-1">
                        <li><strong>Dépendance :</strong> 38% du CA sur un seul client. Le seuil d&apos;alerte est à 20%.</li>
                        <li><strong>Marge dégradée :</strong> le client A génère la marge la plus faible (22% vs 44% sur les autres). Il utilise son poids pour négocier les prix.</li>
                        <li><strong>Concentration sectorielle :</strong> le client A est dans l&apos;automobile — un secteur en mutation structurelle.</li>
                    </ul>
                </div>

                <h3>Simulation : perte du client A</h3>
                <p>
                    Si le client A réduit ses commandes de 50% (scénario &laquo; réaliste &raquo;, pas &laquo; catastrophe &raquo;) :
                </p>
                <ul>
                    <li>CA : 8,1M€ → <strong>6,56M€</strong> (-19%)</li>
                    <li>Les charges fixes ne bougent pas (28 salariés, loyer, machines).</li>
                    <li>Résultat net : +420k€ → <strong>-85k€</strong>. L&apos;entreprise passe en perte.</li>
                    <li>Trésorerie : épuisée en <strong>4 mois</strong>.</li>
                </ul>

                <p>
                    Le dirigeant ne l&apos;avait jamais simulé. Sa réaction : 
                    <em>&laquo; Mais ils sont là depuis 12 ans, ils ne vont pas partir. &raquo;</em>
                </p>

                <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="font-semibold text-slate-800 mb-2">Ce que 12 ans de relation ne protègent pas</p>
                    <p className="text-slate-600">
                        Un changement de direction chez l&apos;ETI. Un plan de réduction des coûts. 
                        Une internalisation de la sous-traitance. <strong>La fidélité d&apos;un acheteur 
                        ne survit pas à un changement de stratégie.</strong>
                    </p>
                </div>

                <h2 className="font-serif">Plan d&apos;action structuré</h2>
                
                <h3>Court terme (0-6 mois)</h3>
                <ul>
                    <li><strong>Renégociation marge client A :</strong> augmentation de 3 points (22% → 25%) justifiée par la hausse des matières premières. Acceptée partiellement (+2 points).</li>
                    <li><strong>Clause de volume minimum :</strong> engagement contractuel sur 70% du volume actuel pendant 24 mois.</li>
                    <li><strong>Reporting mensuel :</strong> suivi de la concentration client comme KPI prioritaire.</li>
                </ul>

                <h3>Moyen terme (6-18 mois)</h3>
                <ul>
                    <li><strong>Prospection active :</strong> objectif de ramener le client A sous 28% du CA en 18 mois.</li>
                    <li><strong>Diversification sectorielle :</strong> ciblage aéronautique et médical (mêmes compétences techniques, meilleure marge).</li>
                    <li><strong>Investissement machine :</strong> maintenu, mais financé à 70% pour préserver la trésorerie.</li>
                </ul>

                <h2 className="font-serif">Résultats à 12 mois</h2>

                <div className="my-8 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-slate-300">
                                <th className="text-left py-3 px-4 font-semibold text-slate-600">Indicateur</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Avant</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Après (M+12)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">Poids client A</td>
                                <td className="text-right py-3 px-4 text-red-600">38%</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">29%</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">Marge brute globale</td>
                                <td className="text-right py-3 px-4">35%</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">38%</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-3 px-4 font-medium">CA total</td>
                                <td className="text-right py-3 px-4">8,1M€</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">8,7M€</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-medium">Nouveaux clients signés</td>
                                <td className="text-right py-3 px-4">—</td>
                                <td className="text-right py-3 px-4 text-emerald-600 font-bold">4 (dont 2 aéronautique)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 className="font-serif">Ce que cette mission enseigne</h2>
                <p>
                    <strong>La concentration client est le risque le plus sous-estimé en PME.</strong> 
                    Parce qu&apos;il ne se voit pas dans le compte de résultat. 
                    Parce que le client paie, et que tout semble normal.
                </p>
                <p>
                    Jusqu&apos;au jour où il ne paie plus, ou moins, ou moins vite. 
                    Et là, les charges fixes sont toujours là.
                </p>
                <p>
                    Ce dirigeant a demandé un reporting. Il a obtenu un diagnostic de survie 
                    qui a réorienté toute sa stratégie commerciale. La banque a financé 
                    l&apos;investissement — <strong>parce que le risque avait été identifié et traité</strong>.
                </p>

                <TransitionCaseStudy
                    situation="PME à 8M€, client principal à 38% du CA, marge dégradée, aucune diversification."
                    resultat="Concentration ramenée à 29% en 12 mois. Marge globale +3 points. 4 nouveaux clients signés."
                />
            </>
        )
    }
}

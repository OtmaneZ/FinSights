/**
 * NOTES STRATÉGIQUES — Analyse & Positionnement DAF
 * 
 * Ton : cabinet, pas formateur.
 * "Ce que ce ratio révèle" — jamais "Comment calculer".
 * Chaque article se termine par une transition DAF structurée :
 * 1. Priorité immédiate
 * 2. Risque structurel
 * 3. Arbitrage à court terme
 * → CTA mission DAF
 */

import Link from 'next/link'

// ─── Bloc de transition DAF réutilisable ───────────────────────────
function TransitionDAF({ priorite, risque, arbitrage }: {
    priorite: string
    risque: string
    arbitrage: string
}) {
    return (
        <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif">
                    Ce que révèle ce diagnostic
                </h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <span className="text-sm font-bold text-slate-500 mt-0.5 w-4 flex-shrink-0">1.</span>
                        <div>
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Priorité immédiate</span>
                            <p className="text-slate-800 mt-1">{priorite}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-sm font-bold text-slate-500 mt-0.5 w-4 flex-shrink-0">2.</span>
                        <div>
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Risque structurel</span>
                            <p className="text-slate-800 mt-1">{risque}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-sm font-bold text-slate-500 mt-0.5 w-4 flex-shrink-0">3.</span>
                        <div>
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Arbitrage à court terme</span>
                            <p className="text-slate-800 mt-1">{arbitrage}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <p className="text-slate-600 text-sm mb-4">
                        Pour transformer ce diagnostic en plan d&apos;action priorisé :
                    </p>
                    <a
                        href="https://calendly.com/zineinsight/15min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all text-sm"
                    >
                        Réserver un échange stratégique
                    </a>
                </div>
            </div>
        </div>
    )
}

export const strategicArticles: Record<string, {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
    image?: string
    content: React.ReactNode
}> = {

    // ═══════════════════════════════════════════════════════════════
    // ARTICLE 1 — DSO supérieur à la médiane sectorielle
    // ═══════════════════════════════════════════════════════════════
    'dso-superieur-mediane-sectorielle-modele': {
        slug: 'dso-superieur-mediane-sectorielle-modele',
        title: 'DSO supérieur à la médiane sectorielle : que révèle vraiment votre modèle ?',
        description: 'Un DSO élevé n\'est pas qu\'un problème de recouvrement. C\'est souvent le symptôme d\'un déséquilibre structurel entre modèle commercial et organisation financière.',
        date: '21 février 2026',
        readTime: '11 min',
        category: 'Note Stratégique',
        image: '/images/bureau-nuit.png',
        content: (
            <>
                <p className="lead">
                    Un DSO de 72 jours quand votre secteur affiche une médiane à 48 n&apos;est pas un &laquo;&nbsp;retard de recouvrement&nbsp;&raquo;.
                    C&apos;est un signal structurel. La question n&apos;est pas &laquo;&nbsp;comment relancer plus vite&nbsp;&raquo; mais
                    &laquo;&nbsp;pourquoi votre modèle produit-il mécaniquement ce décalage&nbsp;&raquo;.
                </p>

                <h2>Ce que le DSO ne dit pas</h2>
                <p>
                    Le DSO mesure un symptôme. Il ne désigne pas la cause. Un DSO élevé peut traduire :
                </p>
                <ul>
                    <li>Un cycle de facturation mal structuré (facturation à livraison vs facturation à commande)</li>
                    <li>Une politique commerciale qui accorde des délais pour compenser un manque de différenciation</li>
                    <li>Un portefeuille client concentré sur des grands comptes à cycle de paiement long</li>
                    <li>Un processus de validation interne qui retarde l&apos;émission des factures</li>
                </ul>
                <p>
                    Dans chacun de ces cas, la solution &laquo;&nbsp;relancer plus tôt&nbsp;&raquo; ne résout rien.
                    Elle traite l&apos;aval sans corriger l&apos;amont.
                </p>

                <h2>La lecture croisée qui change la donne</h2>
                <p>
                    Un DAF ne regarde jamais le DSO seul. Il le croise avec trois indicateurs :
                </p>
                <div className="warning-box">
                    <strong>Grille d&apos;analyse structurelle</strong>
                    <ul>
                        <li><strong>DSO &times; Marge brute</strong> &mdash; Un DSO élevé avec une marge élevée peut être tolérable. Avec une marge faible, c&apos;est une hémorragie.</li>
                        <li><strong>DSO &times; Concentration client</strong> &mdash; Si 3 clients représentent 60% du CA et paient à 75 jours, le DSO n&apos;est pas un problème de process. C&apos;est un problème de dépendance.</li>
                        <li><strong>DSO &times; Croissance CA</strong> &mdash; Une entreprise en forte croissance avec un DSO élevé accumule du BFR plus vite que du cash. C&apos;est le piège classique.</li>
                    </ul>
                </div>

                <h2>Ce que font les entreprises qui maîtrisent leur DSO</h2>
                <p>
                    Les PME dont le DSO est inférieur à la médiane sectorielle ne sont pas celles qui relancent le mieux.
                    Ce sont celles qui ont structuré trois éléments :
                </p>
                <ol>
                    <li><strong>Un cycle de facturation aligné sur la livraison de valeur</strong> &mdash; facturation à l&apos;avancement, pas à la fin.</li>
                    <li><strong>Des conditions de paiement intégrées à la négociation commerciale</strong> &mdash; le délai de paiement est un élément du prix, pas un geste commercial.</li>
                    <li><strong>Un suivi hebdomadaire du balance âgée</strong> &mdash; pas mensuel, hebdomadaire. Le décalage se crée en semaines, pas en mois.</li>
                </ol>

                <h2>L&apos;erreur classique : optimiser le recouvrement sans toucher au modèle</h2>
                <p>
                    J&apos;observe régulièrement des PME qui investissent dans des outils de relance automatique
                    (Upflow, Agicap, etc.) sans modifier leur cycle de facturation. Le DSO baisse de 5 jours.
                    Puis stagne. Parce que le problème n&apos;était pas l&apos;outil. C&apos;était l&apos;architecture du flux.
                </p>
                <p>
                    La question que pose un DAF n&apos;est pas &laquo;&nbsp;comment relancer plus vite&nbsp;&raquo;
                    mais &laquo;&nbsp;pourquoi ce client paie-t-il à 70 jours alors que le contrat dit 30&nbsp;&raquo;.
                    La réponse est presque toujours : parce que la facturation arrive 20 jours après la prestation.
                </p>

                <h2>Quand le DSO révèle un problème de positionnement</h2>
                <p>
                    Dans les services B2B, un DSO structurellement élevé est parfois le marqueur d&apos;un
                    déficit de pouvoir de négociation. L&apos;entreprise accorde des délais parce qu&apos;elle ne
                    peut pas se permettre de perdre le client. Ce n&apos;est plus un problème de trésorerie.
                    C&apos;est un problème de stratégie commerciale.
                </p>

                <TransitionDAF
                    priorite="Cartographier les 5 clients qui concentrent 80% du retard DSO et analyser la cause racine pour chacun."
                    risque="Un DSO supérieur de 50% à la médiane sectorielle sur 3 trimestres consécutifs signale un déséquilibre structurel, pas conjoncturel."
                    arbitrage="Avant d'investir dans un outil de recouvrement, auditer le cycle de facturation complet : de la commande à l'encaissement."
                />
            </>
        )
    },

    // ═══════════════════════════════════════════════════════════════
    // ARTICLE 2 — BFR structurellement élevé
    // ═══════════════════════════════════════════════════════════════
    'bfr-structurellement-eleve-commercial-organisationnel': {
        slug: 'bfr-structurellement-eleve-commercial-organisationnel',
        title: 'BFR structurellement élevé : problème commercial ou problème organisationnel ?',
        description: 'Quand le BFR dépasse durablement les normes sectorielles, la cause est rarement unique. Lecture croisée des facteurs commerciaux, opérationnels et financiers.',
        date: '21 février 2026',
        readTime: '13 min',
        category: 'Note Stratégique',
        image: '/images/bfr.png',
        content: (
            <>
                <p className="lead">
                    Un BFR à 45 jours de CA dans un secteur qui tourne à 25 n&apos;est pas une fatalité.
                    C&apos;est le résultat de décisions &mdash; commerciales, opérationnelles, financières &mdash;
                    qui se sont accumulées sans arbitrage. La question est : lesquelles corriger en premier.
                </p>

                <h2>Les trois sources d&apos;un BFR structurel</h2>
                <p>
                    Le BFR est la résultante de trois cycles qui se superposent :
                </p>
                <ul>
                    <li><strong>Le cycle client</strong> (DSO) &mdash; Combien de temps entre la prestation et l&apos;encaissement.</li>
                    <li><strong>Le cycle stock/production</strong> (DIO) &mdash; Combien de temps la valeur reste immobilisée en stock ou en-cours.</li>
                    <li><strong>Le cycle fournisseur</strong> (DPO) &mdash; Combien de temps vous financez-vous auprès de vos fournisseurs.</li>
                </ul>
                <p>
                    Un BFR élevé signifie que le solde de ces trois cycles est défavorable.
                    Mais la cause dominante varie selon les cas.
                </p>

                <h2>Quand c&apos;est un problème commercial</h2>
                <p>
                    Le BFR est un problème commercial quand :
                </p>
                <ul>
                    <li>Les conditions de paiement sont systématiquement négociées en faveur du client</li>
                    <li>Les acomptes ne sont pas pratiqués alors que le secteur le permet</li>
                    <li>Le modèle de facturation est en fin de projet (pas à l&apos;avancement)</li>
                    <li>Les retards de paiement sont tolérés pour &laquo;&nbsp;ne pas froisser le client&nbsp;&raquo;</li>
                </ul>
                <p>
                    Dans ce cas, la correction est commerciale : renégocier les conditions,
                    introduire des jalons de facturation, conditionner les commandes suivantes au paiement des précédentes.
                </p>

                <h2>Quand c&apos;est un problème organisationnel</h2>
                <p>
                    Le BFR est un problème organisationnel quand :
                </p>
                <ul>
                    <li>Le stock représente plus de 2 mois de consommation sans justification saisonnière</li>
                    <li>Les factures sont émises avec 15 jours de retard par rapport à la livraison</li>
                    <li>Le process de validation des factures fournisseurs prend 3 semaines</li>
                    <li>Il n&apos;y a pas de suivi hebdomadaire du balance âgée</li>
                </ul>

                <h2>Le diagnostic croisé</h2>
                <div className="warning-box">
                    <strong>Matrice de lecture BFR</strong>
                    <ul>
                        <li><strong>DSO élevé + DPO bas</strong> = vous financez vos clients avec votre cash. Urgence absolue.</li>
                        <li><strong>DIO élevé + DPO élevé</strong> = vous stockez beaucoup mais vous êtes financé par vos fournisseurs. Tenable mais fragile.</li>
                        <li><strong>DSO bas + DIO élevé</strong> = le problème est dans le cycle de production/stock, pas dans le commercial.</li>
                        <li><strong>Tout élevé</strong> = problème systémique. Le BFR est le symptôme d&apos;une absence de pilotage.</li>
                    </ul>
                </div>

                <h2>Ce qu&apos;un DAF fait dans les 30 premiers jours</h2>
                <ol>
                    <li><strong>Semaine 1</strong> &mdash; Décomposer le BFR en DSO, DIO, DPO et les comparer aux médianes sectorielles.</li>
                    <li><strong>Semaine 2</strong> &mdash; Identifier les 3 leviers de réduction à impact maximal.</li>
                    <li><strong>Semaine 3</strong> &mdash; Chiffrer l&apos;impact de chaque levier en trésorerie libérée.</li>
                    <li><strong>Semaine 4</strong> &mdash; Présenter au dirigeant un plan de réduction avec séquençage et responsables.</li>
                </ol>

                <TransitionDAF
                    priorite="Décomposer le BFR en ses 3 composantes (DSO, DIO, DPO) et identifier laquelle contribue le plus à l'écart sectoriel."
                    risque="Un BFR supérieur à 40 jours de CA dans les services ou 60 jours dans l'industrie signale un besoin de financement structurel non maîtrisé."
                    arbitrage="Prioriser la réduction du composant le plus éloigné de la médiane sectorielle — c'est là que le gain de trésorerie sera le plus rapide."
                />
            </>
        )
    },

    // ═══════════════════════════════════════════════════════════════
    // ARTICLE 3 — 70% des PME sous-estiment leur fragilité cash
    // ═══════════════════════════════════════════════════════════════
    'pme-sous-estiment-fragilite-cash': {
        slug: 'pme-sous-estiment-fragilite-cash',
        title: 'Pourquoi 70 % des PME sous-estiment leur fragilité cash',
        description: 'La rentabilité masque souvent une vulnérabilité de trésorerie. Analyse des mécanismes qui conduisent les PME rentables à une impasse de liquidité.',
        date: '21 février 2026',
        readTime: '10 min',
        category: 'Note Stratégique',
        image: '/images/cash-flow-prev.png',
        content: (
            <>
                <p className="lead">
                    &laquo;&nbsp;On est rentable, donc on va bien.&nbsp;&raquo; C&apos;est la phrase que j&apos;entends le plus
                    souvent chez les dirigeants de PME. Et c&apos;est la plus dangereuse. Parce que la rentabilité
                    et la liquidité sont deux réalités distinctes. On peut mourir rentable.
                </p>

                <h2>Le biais cognitif du résultat positif</h2>
                <p>
                    Un résultat net positif rassure. Il rassure le dirigeant, le banquier, l&apos;expert-comptable.
                    Mais il ne dit rien sur la capacité de l&apos;entreprise à honorer ses échéances à 30 jours.
                </p>
                <p>
                    Le décalage entre rentabilité et liquidité s&apos;explique par trois mécanismes :
                </p>
                <ol>
                    <li><strong>Le décalage d&apos;encaissement</strong> &mdash; Le CA est comptabilisé à la facturation. Le cash arrive 45, 60, 90 jours plus tard.</li>
                    <li><strong>L&apos;investissement en BFR</strong> &mdash; Chaque euro de croissance consomme du BFR avant de générer du cash.</li>
                    <li><strong>Les remboursements d&apos;emprunts</strong> &mdash; Le capital remboursé ne passe pas en charge mais consomme du cash.</li>
                </ol>

                <h2>L&apos;illusion des comptes annuels</h2>
                <p>
                    Les comptes annuels sont une photographie au 31 décembre. Ils ne montrent pas les
                    tensions de mars, les creux de juillet, les pics de novembre. Une entreprise peut
                    afficher un bilan solide au 31/12 et avoir été à 15 jours de la cessation de paiement en septembre.
                </p>
                <div className="warning-box">
                    <strong>Les signaux que masquent les comptes annuels</strong>
                    <ul>
                        <li>Un solde de trésorerie nette positif au 31/12 peut masquer 3 mois de trésorerie négative en cours d&apos;année</li>
                        <li>Un résultat positif peut coexister avec un cash-flow opérationnel négatif</li>
                        <li>Un ratio de liquidité correct peut masquer une dépendance totale à une ligne de crédit</li>
                    </ul>
                </div>

                <h2>Le test des 90 jours</h2>
                <p>
                    La question que pose un DAF n&apos;est pas &laquo;&nbsp;êtes-vous rentable ?&nbsp;&raquo;
                    mais &laquo;&nbsp;pouvez-vous tenir 90 jours sans encaissement nouveau ?&nbsp;&raquo;
                </p>
                <p>
                    Ce test simple révèle la fragilité réelle. La plupart des PME entre 2 et 10M&euro; ne
                    passent pas ce test. Elles sont en flux tendu permanent, structurellement dépendantes
                    de l&apos;encaissement du mois pour payer les charges du mois.
                </p>

                <h2>Ce qui change quand on installe un pilotage cash</h2>
                <p>
                    Un prévisionnel de trésorerie glissant sur 13 semaines transforme la visibilité du dirigeant.
                    Il ne s&apos;agit pas d&apos;un tableau Excel supplémentaire. C&apos;est un changement de paradigme :
                    passer d&apos;une gestion au résultat à une gestion à la trésorerie.
                </p>
                <ul>
                    <li>Le dirigeant voit les tensions 6 semaines avant qu&apos;elles ne surviennent</li>
                    <li>Les décisions d&apos;investissement sont prises en connaissance de l&apos;impact cash</li>
                    <li>Les négociations fournisseurs intègrent la réalité des flux, pas seulement les marges</li>
                </ul>

                <TransitionDAF
                    priorite="Construire un prévisionnel de trésorerie glissant 13 semaines et identifier les 3 premiers creux à risque."
                    risque="Une PME rentable sans visibilité cash à 90 jours est structurellement exposée à un accident de trésorerie."
                    arbitrage="Avant tout investissement ou recrutement, valider l'impact sur le cash-flow des 3 prochains mois — pas seulement sur le compte de résultat."
                />
            </>
        )
    },

    // ═══════════════════════════════════════════════════════════════
    // ARTICLE 4 — Marge correcte, cash fragile
    // ═══════════════════════════════════════════════════════════════
    'marge-correcte-cash-fragile-piege-croissance': {
        slug: 'marge-correcte-cash-fragile-piege-croissance',
        title: 'Marge correcte, cash fragile : le piège classique des PME en croissance',
        description: 'Une marge brute confortable ne protège pas de la rupture de trésorerie. Pourquoi la croissance est le moment le plus dangereux pour le cash.',
        date: '21 février 2026',
        readTime: '12 min',
        category: 'Note Stratégique',
        image: '/images/marge.png',
        content: (
            <>
                <p className="lead">
                    Une PME qui affiche 35% de marge brute et croît de 30% par an devrait
                    aller bien. C&apos;est souvent celle qui se retrouve en cessation de paiement.
                    Le paradoxe est connu des DAF. Il reste invisible aux dirigeants opérationnels.
                </p>

                <h2>Le mécanisme du piège</h2>
                <p>
                    La croissance consomme du cash avant d&apos;en générer. Chaque nouveau client, chaque
                    nouveau contrat crée un besoin de financement immédiat (production, stocks, main-d&apos;&oelig;uvre)
                    alors que l&apos;encaissement interviendra 45 à 90 jours plus tard.
                </p>
                <p>
                    Plus la croissance est forte, plus le décalage s&apos;amplifie. Une entreprise à 30% de
                    croissance annuelle qui passe de 5M&euro; à 6,5M&euro; de CA crée un besoin de BFR
                    supplémentaire de 200 à 400k&euro; selon le secteur. Si ce besoin n&apos;est pas anticipé et financé,
                    il s&apos;absorbe dans la trésorerie disponible.
                </p>

                <h2>Pourquoi la marge ne protège pas</h2>
                <div className="warning-box">
                    <strong>Le décalage temporel</strong>
                    <p>
                        La marge est un concept comptable instantané. Le cash est un flux temporel.
                        Une marge de 35% sur une facture émise aujourd&apos;hui ne génère aucun cash si le client paie dans 60 jours.
                        Pendant ces 60 jours, les salaires, les loyers, les fournisseurs se paient rubis sur l&apos;ongle.
                    </p>
                </div>
                <p>
                    La marge dit &laquo;&nbsp;chaque euro de CA laisse 35 centimes&nbsp;&raquo;.
                    Le cash-flow dit &laquo;&nbsp;quand est-ce que ces 35 centimes arrivent sur le compte&nbsp;&raquo;.
                    Ce sont deux conversations différentes.
                </p>

                <h2>Les signaux d&apos;alerte</h2>
                <ul>
                    <li>La trésorerie baisse alors que le CA et la marge progressent</li>
                    <li>Le recours aux lignes de crédit augmente trimestre après trimestre</li>
                    <li>Les fournisseurs commencent à être payés avec retard</li>
                    <li>Le dirigeant repousse des investissements malgré un carnet de commandes plein</li>
                </ul>
                <p>
                    Chacun de ces signaux, pris isolément, peut sembler bénin. Ensemble, ils dessinent
                    le profil d&apos;une PME en danger de croissance.
                </p>

                <h2>La réponse DAF : modéliser avant de croître</h2>
                <p>
                    Un DAF qui accompagne une PME en croissance commence par une question simple :
                    &laquo;&nbsp;Quel est le coût cash de chaque point de croissance ?&nbsp;&raquo;
                </p>
                <ol>
                    <li><strong>Modéliser le BFR incrémental</strong> &mdash; Combien de cash chaque M&euro; de CA supplémentaire consomme-t-il.</li>
                    <li><strong>Planifier le financement</strong> &mdash; Affacturage, ligne de crédit, acomptes clients, délais fournisseurs.</li>
                    <li><strong>Séquencer la croissance</strong> &mdash; Si le cash ne suit pas, ralentir la prise de commandes n&apos;est pas un échec. C&apos;est du pilotage.</li>
                </ol>

                <TransitionDAF
                    priorite="Calculer le BFR incrémental par M€ de CA supplémentaire et vérifier si le financement est en place."
                    risque="Une PME en croissance >20% sans modélisation cash est en situation de fragilité latente, indépendamment de sa marge."
                    arbitrage="Si le cash ne suit pas la croissance, la priorité est de sécuriser le financement du BFR — avant d'accélérer le commercial."
                />
            </>
        )
    },

    // ═══════════════════════════════════════════════════════════════
    // ARTICLE 5 — DAF externalisé vs expert-comptable
    // ═══════════════════════════════════════════════════════════════
    'daf-externalise-vs-expert-comptable-confusion': {
        slug: 'daf-externalise-vs-expert-comptable-confusion',
        title: 'DAF externalisé vs expert-comptable : rôles et confusion dangereuse',
        description: 'L\'expert-comptable produit les comptes. Le DAF les interprète et arbitre. Confondre les deux expose l\'entreprise à des décisions prises sans lecture financière.',
        date: '21 février 2026',
        readTime: '9 min',
        category: 'Note Stratégique',
        image: '/images/bureau.png',
        content: (
            <>
                <p className="lead">
                    &laquo;&nbsp;Mon expert-comptable s&apos;en occupe.&nbsp;&raquo; Cette phrase coûte cher à des milliers de PME
                    chaque année. Non pas parce que l&apos;expert-comptable fait mal son travail.
                    Mais parce qu&apos;on lui demande de faire un travail qui n&apos;est pas le sien.
                </p>

                <h2>Deux métiers, deux temporalités</h2>
                <p>
                    L&apos;expert-comptable regarde en arrière. Il produit les comptes, certifie la conformité,
                    dépose les déclarations. Son horizon est le passé. C&apos;est un métier de rigueur et de conformité.
                </p>
                <p>
                    Le DAF regarde en avant. Il anticipe les flux, modélise les scénarios, arbitre les
                    investissements. Son horizon est les 3 à 18 mois à venir. C&apos;est un métier de décision.
                </p>
                <div className="warning-box">
                    <strong>La confusion type</strong>
                    <ul>
                        <li><strong>Expert-comptable</strong> : &laquo;&nbsp;Votre résultat net est de 150k&euro;.&nbsp;&raquo;</li>
                        <li><strong>DAF</strong> : &laquo;&nbsp;Votre résultat net est de 150k&euro;, mais votre cash-flow opérationnel est de -30k&euro;. Si vous recrutez 2 commerciaux comme prévu, vous serez en tension cash dès avril. Je recommande de séquencer : 1 en mars, 1 en juin après l&apos;encaissement du contrat X.&nbsp;&raquo;</li>
                    </ul>
                </div>

                <h2>Ce que l&apos;expert-comptable ne peut pas faire</h2>
                <p>
                    Ce n&apos;est pas une question de compétence. C&apos;est une question de positionnement et de mandat.
                </p>
                <ul>
                    <li>Il n&apos;a pas accès aux projections commerciales pour modéliser le cash futur</li>
                    <li>Il n&apos;est pas mandaté pour arbitrer entre investissement et prudence</li>
                    <li>Il ne challenge pas les décisions du dirigeant — ce n&apos;est pas son rôle</li>
                    <li>Il produit un bilan annuel, pas un pilotage mensuel</li>
                </ul>

                <h2>Ce que fait un DAF externalisé</h2>
                <ol>
                    <li><strong>Pilotage cash</strong> &mdash; Prévisionnel glissant, suivi des encaissements/décaissements, alertes.</li>
                    <li><strong>Modélisation</strong> &mdash; Scénarios de croissance, impact des décisions sur la trésorerie.</li>
                    <li><strong>Arbitrage</strong> &mdash; Prioriser les dépenses, séquencer les investissements, négocier le financement.</li>
                    <li><strong>Reporting dirigeant</strong> &mdash; Tableau de bord mensuel avec les 5 indicateurs qui comptent.</li>
                </ol>

                <h2>Le coût de la confusion</h2>
                <p>
                    Une PME qui confie son pilotage financier à son expert-comptable par défaut se retrouve
                    dans une situation où les décisions sont prises sur des comptes passés, sans modélisation
                    de l&apos;impact futur. Le dirigeant navigue au feeling, avec des comptes qui arrivent 3 mois après la clôture.
                </p>
                <p>
                    Le coût n&apos;est pas l&apos;honoraire du DAF qu&apos;on n&apos;a pas pris.
                    C&apos;est la décision qu&apos;on a prise trop tard, le recrutement qu&apos;on n&apos;a pas séquencé,
                    l&apos;investissement qu&apos;on a fait sans vérifier le cash.
                </p>

                <TransitionDAF
                    priorite="Identifier les décisions des 6 derniers mois qui ont été prises sans modélisation cash préalable."
                    risque="Confondre production comptable et pilotage financier expose l'entreprise à des décisions structurellement sous-informées."
                    arbitrage="Un DAF externalisé à 2-4 jours/mois coûte 2 à 5k€. Le coût d'une décision mal calibrée sur le cash dépasse souvent 50k€."
                />
            </>
        )
    },

    // ═══════════════════════════════════════════════════════════════
    // ARTICLE 6 — À partir de quel CA faut-il un DAF
    // ═══════════════════════════════════════════════════════════════
    'a-partir-quel-ca-faut-il-un-daf': {
        slug: 'a-partir-quel-ca-faut-il-un-daf',
        title: 'À partir de quel chiffre d\'affaires faut-il un DAF ?',
        description: 'Le seuil de complexité financière ne dépend pas que du CA. Nombre de clients, saisonnalité, BFR structurel : les vrais critères de déclenchement.',
        date: '21 février 2026',
        readTime: '10 min',
        category: 'Note Stratégique',
        image: '/images/moi-bureau.png',
        content: (
            <>
                <p className="lead">
                    La réponse courte : à partir de 1 à 2M&euro; de CA. La réponse utile : ça dépend
                    de la complexité de votre modèle, pas de votre taille. Une entreprise à 3M&euro; avec
                    10 clients récurrents et un BFR stable n&apos;a pas les mêmes besoins qu&apos;une PME à 1,5M&euro;
                    avec 200 clients, de la saisonnalité et un BFR à 50 jours.
                </p>

                <h2>Les critères qui comptent plus que le CA</h2>
                <ul>
                    <li><strong>Le nombre de flux</strong> &mdash; Plus de 50 factures clients/mois, plus de 30 fournisseurs = complexité suffisante pour justifier un pilotage structuré.</li>
                    <li><strong>La saisonnalité</strong> &mdash; Un CA qui varie de plus de 30% entre le mois haut et le mois bas crée des tensions de trésorerie mécaniques.</li>
                    <li><strong>Le BFR structurel</strong> &mdash; Un BFR supérieur à 30 jours de CA nécessite un pilotage actif.</li>
                    <li><strong>La phase de l&apos;entreprise</strong> &mdash; Levée de fonds, acquisition, restructuration = besoin immédiat, indépendamment du CA.</li>
                    <li><strong>Le nombre de décisions financières par mois</strong> &mdash; Si le dirigeant arbitre plus de 3 décisions à impact cash par mois sans données structurées, il a besoin d&apos;un DAF.</li>
                </ul>

                <h2>Le vrai seuil : quand le dirigeant pilote au feeling</h2>
                <p>
                    Le meilleur indicateur n&apos;est pas financier. C&apos;est comportemental.
                    Si le dirigeant prend des décisions d&apos;investissement, de recrutement ou de
                    négociation fournisseur en se basant sur le solde du compte en banque du jour,
                    il a dépassé le seuil. Depuis longtemps.
                </p>

                <h2>DAF temps plein vs externalisé</h2>
                <div className="warning-box">
                    <strong>Grille de décision</strong>
                    <ul>
                        <li><strong>1-5M&euro; CA</strong> &mdash; DAF externalisé 2-4 jours/mois. Coût : 2-5k&euro;/mois.</li>
                        <li><strong>5-15M&euro; CA</strong> &mdash; DAF externalisé 4-8 jours/mois ou DAF temps partiel. Coût : 4-8k&euro;/mois.</li>
                        <li><strong>&gt;15M&euro; CA</strong> &mdash; DAF temps plein ou Directeur financier. Coût : 80-120k&euro;/an.</li>
                    </ul>
                    <p>
                        Le DAF externalisé n&apos;est pas un &laquo;&nbsp;petit DAF&nbsp;&raquo;. C&apos;est un profil senior
                        qui intervient à temps partiel. Il apporte la même rigueur méthodologique qu&apos;un DAF interne,
                        avec un coût adapté à la taille de l&apos;entreprise.
                    </p>
                </div>

                <h2>Le retour sur investissement</h2>
                <p>
                    Un DAF externalisé à 3k&euro;/mois sur une PME à 3M&euro; de CA représente 1,2% du CA.
                    Si son intervention réduit le DSO de 10 jours (libérant 80k&euro; de trésorerie),
                    optimise le BFR de 15% (économisant 45k&euro;), et évite un découvert bancaire de 6 mois
                    (économisant 8k&euro; d&apos;agios), le ROI est de 3x à 5x dès la première année.
                </p>

                <TransitionDAF
                    priorite="Lister les 5 dernières décisions financières prises sans modélisation préalable et évaluer leur impact cash réel."
                    risque="Au-delà de 2M€ de CA avec plus de 30 jours de BFR, l'absence de pilotage financier structuré est un facteur de risque identifiable."
                    arbitrage="Le coût d'un DAF externalisé (2-5k€/mois) est à comparer au coût des décisions mal calibrées — rarement inférieur à 50k€/an."
                />
            </>
        )
    },

    // ═══════════════════════════════════════════════════════════════
    // ARTICLE 7 — Les 4 priorités d'un DAF sur 90 jours
    // ═══════════════════════════════════════════════════════════════
    '4-priorites-daf-90-jours': {
        slug: '4-priorites-daf-90-jours',
        title: 'Les 4 priorités d\'un DAF sur 90 jours',
        description: 'Trésorerie, marge, structure, reporting : la séquence d\'intervention d\'un DAF qui prend un mandat. Ce qui se joue dans les 3 premiers mois.',
        date: '21 février 2026',
        readTime: '11 min',
        category: 'Note Stratégique',
        image: '/images/vue-NY.png',
        content: (
            <>
                <p className="lead">
                    Quand un DAF externalisé prend un mandat, il ne commence pas par un audit complet de 6 semaines.
                    Il commence par sécuriser. La séquence des 90 premiers jours est toujours la même :
                    trésorerie, puis marge, puis structure, puis reporting.
                </p>

                <h2>Jours 1-30 : Sécuriser la trésorerie</h2>
                <p>
                    La première priorité est toujours le cash. Pas parce que c&apos;est le plus important stratégiquement,
                    mais parce que c&apos;est le plus urgent vitalement.
                </p>
                <ul>
                    <li>Construire le prévisionnel de trésorerie glissant 13 semaines</li>
                    <li>Identifier les 3 tensions cash des 90 prochains jours</li>
                    <li>Cartographier le balance âgée et lancer les relances prioritaires</li>
                    <li>Vérifier les lignes de crédit disponibles et leur utilisation</li>
                    <li>Mettre en place le reporting cash hebdomadaire</li>
                </ul>
                <p>
                    À la fin du premier mois, le dirigeant a une visibilité cash qu&apos;il n&apos;a jamais eue.
                    Les décisions des semaines suivantes se prennent sur cette base.
                </p>

                <h2>Jours 30-60 : Comprendre la marge réelle</h2>
                <p>
                    La marge comptable et la marge réelle divergent souvent. Le deuxième mois est consacré
                    à comprendre où se crée et se détruit la valeur.
                </p>
                <ul>
                    <li>Analyser la marge par client / par produit / par canal</li>
                    <li>Identifier les clients ou projets à marge négative</li>
                    <li>Comparer les marges aux médianes sectorielles</li>
                    <li>Chiffrer l&apos;impact d&apos;une hausse de prix de 2-3% sur les segments les plus élastiques</li>
                </ul>

                <h2>Jours 60-80 : Structurer</h2>
                <p>
                    Avec la visibilité cash et la compréhension marge, le DAF peut maintenant structurer :
                </p>
                <ul>
                    <li>Mettre en place le tableau de bord dirigeant mensuel (5 indicateurs, pas 30)</li>
                    <li>Définir les seuils d&apos;alerte automatiques</li>
                    <li>Structurer le process de validation des dépenses</li>
                    <li>Préparer le budget prévisionnel N+1 si nécessaire</li>
                </ul>

                <h2>Jours 80-90 : Restituer et planifier</h2>
                <p>
                    Le livrable des 90 jours est un document de 5 pages qui contient :
                </p>
                <ol>
                    <li>Le diagnostic financier structuré (forces, vulnérabilités, priorité)</li>
                    <li>Les 3 actions à impact maximal identifiées et chiffrées</li>
                    <li>Le plan d&apos;action des 6 prochains mois avec jalons et responsables</li>
                    <li>Les indicateurs de suivi et leur fréquence</li>
                </ol>

                <TransitionDAF
                    priorite="Construire le prévisionnel cash 13 semaines — c'est le premier livrable, toujours."
                    risque="Sans séquençage rigoureux, un mandat DAF se disperse. La trésorerie d'abord, la marge ensuite, la structure enfin."
                    arbitrage="Les 90 premiers jours définissent la crédibilité du DAF et la confiance du dirigeant. Chaque livrable doit être concret et chiffré."
                />
            </>
        )
    },

    // ═══════════════════════════════════════════════════════════════
    // ARTICLE 8 — Ce qu'un vrai pilotage financier change
    // ═══════════════════════════════════════════════════════════════
    'pilotage-financier-change-pme-5-20m': {
        slug: 'pilotage-financier-change-pme-5-20m',
        title: 'Ce qu\'un vrai pilotage financier change dans une PME 5\u201320M\u20ac',
        description: 'Avant/après : les transformations concrètes quand une PME passe d\'une comptabilité subie à un pilotage financier structuré.',
        date: '21 février 2026',
        readTime: '14 min',
        category: 'Note Stratégique',
        image: '/images/bureau-nuit.png',
        content: (
            <>
                <p className="lead">
                    La différence entre une PME qui subit ses comptes et une PME qui pilote ses finances
                    ne se mesure pas en outils. Elle se mesure en qualité de décision. Voici ce qui change
                    concrètement quand une entreprise passe d&apos;une comptabilité annuelle à un pilotage mensuel structuré.
                </p>

                <h2>Avant : la comptabilité subie</h2>
                <p>
                    Le profil type d&apos;une PME entre 5 et 20M&euro; sans pilotage financier :
                </p>
                <ul>
                    <li>Les comptes arrivent 2-3 mois après la clôture</li>
                    <li>Le dirigeant regarde le solde bancaire pour décider</li>
                    <li>Les marges par client ne sont pas connues</li>
                    <li>Le prévisionnel de trésorerie n&apos;existe pas ou date de la dernière levée</li>
                    <li>Les décisions d&apos;investissement se prennent &laquo;&nbsp;au feeling&nbsp;&raquo;</li>
                    <li>Le rapport avec la banque est réactif, jamais proactif</li>
                </ul>

                <h2>Après : le pilotage structuré</h2>
                <div className="warning-box">
                    <strong>Les 6 transformations concrètes</strong>
                    <ol>
                        <li><strong>Visibilité cash à 13 semaines</strong> &mdash; Le dirigeant sait exactement quand et combien de cash entre et sort. Il anticipe les tensions 6 semaines à l&apos;avance.</li>
                        <li><strong>Marge par client connue</strong> &mdash; Les clients à marge négative sont identifiés. Les décisions commerciales intègrent la profitabilité réelle.</li>
                        <li><strong>Tableau de bord mensuel en 5 indicateurs</strong> &mdash; DSO, BFR, marge brute, cash-flow opérationnel, runway. Le dirigeant lit sa situation en 5 minutes.</li>
                        <li><strong>Décisions modélisées</strong> &mdash; Chaque recrutement, chaque investissement est simulé avec son impact cash avant validation.</li>
                        <li><strong>Relation bancaire proactive</strong> &mdash; Le dirigeant présente son prévisionnel au banquier, pas l&apos;inverse. La confiance change la qualité du financement.</li>
                        <li><strong>Reporting investisseur/actionnaire structuré</strong> &mdash; Les reportings trimestriels sont prêts en J+5, pas en J+45.</li>
                    </ol>
                </div>

                <h2>L&apos;impact sur la prise de décision</h2>
                <p>
                    Le changement le plus profond n&apos;est pas technique. Il est cognitif. Un dirigeant qui
                    dispose d&apos;un pilotage financier structuré prend des décisions différentes :
                </p>
                <ul>
                    <li>Il refuse un gros contrat à marge faible au lieu de le prendre &laquo;&nbsp;pour le CA&nbsp;&raquo;</li>
                    <li>Il séquence un recrutement sur 3 mois au lieu de le faire d&apos;un bloc</li>
                    <li>Il négocie un délai fournisseur de 60 jours au lieu d&apos;accepter 30 par défaut</li>
                    <li>Il anticipe un besoin de financement 6 mois avant la tension</li>
                </ul>

                <h2>Le coût de ne pas piloter</h2>
                <p>
                    Le coût d&apos;un pilotage financier structuré pour une PME 5-20M&euro; est de l&apos;ordre de
                    3 à 8k&euro;/mois. Le coût de ne pas piloter est invisible mais mesurable :
                </p>
                <ul>
                    <li>DSO supérieur de 15 jours à la médiane = 100-300k&euro; de cash immobilisé</li>
                    <li>BFR non optimisé = 50-200k&euro; de financement inutile</li>
                    <li>Marges non suivies par client = 5-10% de CA sur des projets non rentables</li>
                    <li>Décisions non modélisées = au moins une erreur à 50k&euro;+ par an</li>
                </ul>

                <TransitionDAF
                    priorite="Identifier les 3 décisions des 12 derniers mois qui auraient été différentes avec une visibilité cash et marge structurée."
                    risque="Une PME 5-20M€ sans pilotage financier mensuel opère en dessous de son potentiel de 10 à 20% — en cash, en marge et en qualité de décision."
                    arbitrage="Le premier investissement à faire n'est pas un outil. C'est une méthodologie de pilotage. L'outil vient après."
                />
            </>
        )
    }
}

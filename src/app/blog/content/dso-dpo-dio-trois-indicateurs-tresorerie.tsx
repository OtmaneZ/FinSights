import Link from 'next/link'

export const articleBody = (
<div className="published-article-body space-y-6">

    {/* Intro box */}
    <div className="not-prose bg-slate-800 rounded-xl p-8 border-l-4 border-blue-400 mb-12">
        <p className="text-lg leading-relaxed text-slate-200">
            Votre comptable vous parle de résultat. Votre banquier regarde le BFR.
            Et votre trésorerie, elle, répond à trois questions simples que presque personne ne pose.
        </p>
    </div>

    <p className="text-slate-300 leading-relaxed mb-6">
        DSO, DPO, DIO. Trois acronymes. Trois fenêtres sur la même réalité : comment l'argent circule
        dans votre entreprise, où il se bloque, et combien de temps il reste immobilisé avant de revenir
        sur votre compte.
    </p>
    <p className="text-slate-300 leading-relaxed mb-8">
        Séparément, chacun raconte une partie de l'histoire. Ensemble, ils racontent tout.
    </p>

    {/* Section 1 - DSO */}
    <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Le DSO : le temps que mettent vos clients à payer</h2>

        <p className="text-slate-300 leading-relaxed mb-4">
            DSO signifie <em>Days Sales Outstanding</em>. En français : le délai moyen de paiement de vos clients.
            Si votre DSO est à 60 jours, vos clients mettent en moyenne deux mois à vous régler après la facturation.
        </p>

        <p className="text-slate-300 leading-relaxed mb-6">La formule :</p>

        <div className="not-prose bg-slate-800 rounded-xl p-6 border-2 border-blue-400 mb-6 text-center">
            <p className="text-xl font-bold text-blue-300">
                DSO = (Créances clients / CA TTC) x Nombre de jours
            </p>
        </div>

        <p className="text-slate-300 leading-relaxed mb-4">
            Ce que cet indicateur révèle réellement, ce n'est pas seulement la qualité de votre recouvrement.
            C'est aussi la nature de votre relation commerciale, votre pouvoir de négociation, et parfois
            des signaux faibles sur la santé financière de vos clients.
        </p>

        <p className="text-slate-300 leading-relaxed mb-6">
            Un DSO qui monte progressivement, sans que votre CA n'ait changé, c'est souvent le premier signe
            qu'un client a des difficultés. Avant même qu'il vous en parle.
        </p>

        {/* Cas illustratif DSO */}
        <div className="not-prose bg-slate-800 rounded-xl p-6 border-l-4 border-yellow-400 mb-6">
            <p className="text-slate-200 leading-relaxed italic">
                Une entreprise de services B2B voit son DSO passer de 45 à 72 jours sur deux trimestres.
                Le dirigeant attribue ça à une "période chargée". En réalité, l'un de ses trois clients
                principaux accumule les retards. Six mois plus tard, ce client est en procédure collective.
                Le DSO avait sonné l'alarme bien avant le bilan.
            </p>
        </div>

        <p className="text-slate-300 leading-relaxed mb-4">
            La force du DSO, c'est qu'il est actionnable. On peut le réduire par des relances structurées,
            des conditions de paiement revues, des escomptes ciblés, ou simplement en identifiant les
            clients chroniquement en retard et en ajustant les conditions commerciales.
        </p>

        <p className="text-slate-300 leading-relaxed">
            Réduire son DSO de 60 à 40 jours sur un CA de 2M euros, c'est environ 110 000 euros de trésorerie
            libérée. Sans toucher à aucun autre paramètre.
        </p>
    </section>

    {/* Section 2 - DPO */}
    <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Le DPO : le temps que vous prenez pour payer vos fournisseurs</h2>

        <p className="text-slate-300 leading-relaxed mb-4">
            DPO signifie <em>Days Payable Outstanding</em>. C'est le délai moyen que vous accordez
            à vos fournisseurs avant de les régler. Contrairement au DSO, un DPO élevé est souvent
            un avantage, pas un problème.
        </p>

        <p className="text-slate-300 leading-relaxed mb-6">La formule :</p>

        <div className="not-prose bg-slate-800 rounded-xl p-6 border-2 border-blue-400 mb-6 text-center">
            <p className="text-xl font-bold text-blue-300">
                DPO = (Dettes fournisseurs / Achats TTC) x Nombre de jours
            </p>
        </div>

        <p className="text-slate-300 leading-relaxed mb-4">
            Plus votre DPO est long, plus vous utilisez l'argent de vos fournisseurs pour financer votre
            activité. C'est ce qu'on appelle le crédit fournisseur, et c'est l'une des sources de
            financement les moins chères qui soit.
        </p>

        <p className="text-slate-300 leading-relaxed mb-6">
            Mais le DPO a une limite. Payer trop tard abîme les relations. Et dans certains secteurs,
            un DPO anormalement long est perçu comme un signal de fragilité financière, non comme
            une stratégie de gestion.
        </p>

        {/* Cas illustratif DPO */}
        <div className="not-prose bg-slate-800 rounded-xl p-6 border-l-4 border-yellow-400 mb-6">
            <p className="text-slate-200 leading-relaxed italic">
                Un distributeur négocie des conditions à 90 jours avec ses principaux fournisseurs.
                Son concurrent paie à 30 jours. À volume d'activité identique, le premier dispose
                d'une réserve de trésorerie structurelle que l'autre n'a pas. Cette différence seule
                peut financer une ligne de produits supplémentaire sans emprunt.
            </p>
        </div>

        <p className="text-slate-300 leading-relaxed">
            La bonne question à se poser sur le DPO n'est pas "est-ce que je peux payer plus tard"
            mais "est-ce que je profite intelligemment du délai que mes fournisseurs m'accordent,
            sans mettre en danger la relation ni ma réputation de payeur".
        </p>
    </section>

    {/* Section 3 - DIO */}
    <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Le DIO : le temps que la valeur dort dans vos stocks</h2>

        <p className="text-slate-300 leading-relaxed mb-4">
            DIO signifie <em>Days Inventory Outstanding</em>. C'est le nombre de jours pendant lesquels
            une marchandise, une matière première ou un en-cours de production reste immobilisé avant
            d'être vendu ou transformé en chiffre d'affaires.
        </p>

        <p className="text-slate-300 leading-relaxed mb-6">La formule :</p>

        <div className="not-prose bg-slate-800 rounded-xl p-6 border-2 border-blue-400 mb-6 text-center">
            <p className="text-xl font-bold text-blue-300">
                DIO = (Stock moyen / Coût des ventes) x Nombre de jours
            </p>
        </div>

        <p className="text-slate-300 leading-relaxed mb-4">
            Le DIO est souvent le plus oublié des trois. Pourtant, dans les entreprises qui ont des
            stocks, c'est fréquemment le poste qui pèse le plus lourd sur le besoin en fonds de roulement.
        </p>

        <p className="text-slate-300 leading-relaxed mb-6">
            Un DIO élevé peut venir de plusieurs causes très différentes : sur-approvisionnement,
            rotation lente sur certaines références, problèmes de production, saisonnalité mal
            anticipée, ou simplement des habitudes de commande jamais remises en question.
        </p>

        {/* Cas illustratif DIO */}
        <div className="not-prose bg-slate-800 rounded-xl p-6 border-l-4 border-yellow-400 mb-6">
            <p className="text-slate-200 leading-relaxed italic">
                Un fabricant de mobilier professionnel a un DIO de 110 jours. En analysant par référence,
                il découvre que 20% de ses références représentent 80% de ce stock dormant. Ces références
                sont commandées "par précaution" depuis des années. En révisant simplement ses seuils de
                réapprovisionnement, il libère plusieurs mois de trésorerie en quelques semaines.
            </p>
        </div>

        <p className="text-slate-300 leading-relaxed">
            Ce qui est intéressant avec le DIO, c'est qu'il touche souvent à des habitudes opérationnelles
            profondément enracinées. Réduire le DIO, c'est souvent plus un travail de fond sur les
            processus que de simples ajustements comptables.
        </p>
    </section>

    {/* Section 4 - CCC */}
    <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Les combiner : le Cash Conversion Cycle</h2>

        <p className="text-slate-300 leading-relaxed mb-4">
            Pris séparément, DSO, DPO et DIO donnent des angles de lecture. Combinés, ils donnent
            un seul chiffre qui résume tout le cycle de transformation du cash dans votre entreprise.
            Ce chiffre s'appelle le Cash Conversion Cycle, ou CCC.
        </p>

        <p className="text-slate-300 leading-relaxed mb-6">La formule :</p>

        <div className="not-prose bg-slate-800 rounded-xl p-6 border-2 border-blue-400 mb-6 text-center">
            <p className="text-xl font-bold text-blue-300">
                CCC = DSO + DIO - DPO
            </p>
        </div>

        <p className="text-slate-300 leading-relaxed mb-4">
            Le CCC mesure combien de jours s'écoulent entre le moment où vous dépensez de l'argent
            pour votre activité et le moment où cet argent vous revient sous forme de paiement client.
            Plus le CCC est bas, moins vous avez besoin de financement externe pour fonctionner.
        </p>

        <p className="text-slate-300 leading-relaxed mb-4">
            Un CCC négatif est possible et même enviable. Certaines grandes enseignes de distribution
            ont un CCC largement négatif : elles encaissent leurs clients avant de payer leurs
            fournisseurs. Elles se font financer par leur propre cycle d'exploitation.
        </p>

        {/* Cas illustratif CCC */}
        <div className="not-prose bg-slate-800 rounded-xl p-6 border-l-4 border-yellow-400 mb-6">
            <p className="text-slate-200 leading-relaxed italic">
                Deux entreprises du même secteur, même taille, même CA. La première a un DSO de 55 jours,
                un DIO de 40 jours, un DPO de 30 jours : son CCC est de 65 jours. La seconde a négocié
                un DSO de 35 jours, maintient un DIO de 25 jours et a obtenu 60 jours chez ses fournisseurs :
                son CCC est de 0. La deuxième n'a structurellement pas besoin de BFR. La première en a un
                considérable. Même activité, gestion radicalement différente.
            </p>
        </div>

        <p className="text-slate-300 leading-relaxed">
            C'est là que les trois indicateurs révèlent leur vraie puissance. Chacun pris seul peut
            sembler acceptable. Ensemble, ils montrent si votre cycle d'exploitation est structurellement
            consommateur de cash ou au contraire générateur de liquidités.
        </p>
    </section>

    {/* Section 5 - Force de chaque indicateur */}
    <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">La force propre de chaque indicateur</h2>

        <p className="text-slate-300 leading-relaxed mb-8">
            Chaque indicateur a un terrain d'action particulier. Savoir lequel surveiller en priorité
            dépend de votre secteur, de votre modèle commercial et de là où se situe votre point de friction.
        </p>

        {/* DSO card */}
        <div className="not-prose bg-slate-800 rounded-xl p-6 border border-slate-600 mb-4">
            <p className="text-base font-bold text-blue-300 mb-2">Le DSO parle de votre relation commerciale</p>
            <p className="text-slate-300 leading-relaxed text-sm">
                Il est particulièrement pertinent dans les activités B2B à facturation différée : services,
                conseil, IT, BTP. C'est là que les délais de paiement ont le plus d'impact sur la trésorerie
                courante. Un travail sur le DSO produit des effets rapides et mesurables.
            </p>
        </div>

        {/* DPO card */}
        <div className="not-prose bg-slate-800 rounded-xl p-6 border border-slate-600 mb-4">
            <p className="text-base font-bold text-blue-300 mb-2">Le DPO parle de votre pouvoir de négociation</p>
            <p className="text-slate-300 leading-relaxed text-sm">
                Il est stratégique dans les secteurs où les achats représentent une part importante du
                chiffre d'affaires : distribution, industrie, e-commerce. Améliorer le DPO ne se fait
                pas par urgence mais par anticipation, dans la durée, en construisant des relations
                fournisseurs solides.
            </p>
        </div>

        {/* DIO card */}
        <div className="not-prose bg-slate-800 rounded-xl p-6 border border-slate-600 mb-4">
            <p className="text-base font-bold text-blue-300 mb-2">Le DIO parle de votre efficacité opérationnelle</p>
            <p className="text-slate-300 leading-relaxed text-sm">
                Il s'applique aux entreprises qui gèrent des stocks physiques ou des en-cours de production.
                Un DIO trop élevé signale souvent un problème de prévision de la demande, de politique
                d'achat, ou de rotation des références. C'est le plus difficile à réduire rapidement car
                il touche aux processus internes.
            </p>
        </div>

    </section>

    {/* Section 6 - Comment les utiliser ensemble */}
    <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Comment les lire ensemble</h2>

        <p className="text-slate-300 leading-relaxed mb-6">
            La vraie intelligence de ces trois indicateurs vient de leur lecture croisée. Certaines
            combinaisons sont révélatrices.
        </p>

        <div className="not-prose bg-slate-800 rounded-xl p-6 border border-slate-600 mb-4">
            <p className="text-base font-bold text-white mb-2">DSO elevé + DPO court + DIO faible</p>
            <p className="text-slate-300 leading-relaxed text-sm">
                Votre problème est clairement dans le recouvrement client. Votre cycle opérationnel
                est sain mais vous financez vos clients avec votre propre trésorerie. Priorité aux
                conditions de paiement et aux relances.
            </p>
        </div>

        <div className="not-prose bg-slate-800 rounded-xl p-6 border border-slate-600 mb-4">
            <p className="text-base font-bold text-white mb-2">DSO correct + DPO court + DIO élevé</p>
            <p className="text-slate-300 leading-relaxed text-sm">
                Le goulot d'étranglement est dans les stocks. Vos clients paient bien, vous payez vite,
                mais la valeur dort dans vos entrepôts ou en production. Un travail sur la gestion des
                approvisionnements s'impose avant tout.
            </p>
        </div>

        <div className="not-prose bg-slate-800 rounded-xl p-6 border border-slate-600 mb-4">
            <p className="text-base font-bold text-white mb-2">DSO élevé + DPO élevé + DIO élevé</p>
            <p className="text-slate-300 leading-relaxed text-sm">
                Tout le cycle est engorgé. Vous avez besoin d'une analyse complète du BFR. Le DPO
                élevé atténue l'impact, mais c'est une position fragile : si les fournisseurs réduisent
                leurs délais, la situation se dégrade brutalement.
            </p>
        </div>

        <div className="not-prose bg-slate-800 rounded-xl p-6 border-l-4 border-yellow-400 mb-6">
            <p className="text-slate-200 leading-relaxed italic">
                J'interviens souvent chez des dirigeants qui pensent avoir un problème de rentabilité.
                Quand on décompose le BFR en DSO, DPO et DIO, on découvre que la rentabilité est là.
                C'est le cycle de cash qui absorbe tout. Un bon EBITDA avec un mauvais CCC, ça donne
                un dirigeant à l'aise sur son P&L et à court de cash sur son compte bancaire.
            </p>
        </div>
    </section>

    {/* Section 7 - Ce que vous devez faire */}
    <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Par où commencer</h2>

        <p className="text-slate-300 leading-relaxed mb-4">
            Calculez les trois. Une fois. Avec les chiffres de votre dernier trimestre. Ça prend
            moins d'une heure avec votre balance comptable.
        </p>

        <p className="text-slate-300 leading-relaxed mb-4">
            Comparez-les aux médianes de votre secteur. Pas pour avoir une bonne note, mais pour
            identifier où vous êtes en dessous de la norme et ce que ça coûte réellement en
            trésorerie immobilisée.
        </p>

        <p className="text-slate-300 leading-relaxed mb-4">
            Puis identifiez le levier le plus actionnable. Pas forcément le plus grand. Celui sur
            lequel vous pouvez agir dans les 90 prochains jours avec les ressources que vous avez.
        </p>

        <p className="text-slate-300 leading-relaxed">
            Réduire son CCC de 20 jours sur un CA de 1,5M euros, c'est environ 80 000 euros de
            trésorerie qui réapparaissent. Sans lever de fonds. Sans emprunt. Sans vendre plus.
            Juste en gérant mieux ce que vous avez déjà.
        </p>
    </section>

    {/* CTA */}
    <div className="not-prose bg-slate-800 rounded-xl p-8 border border-slate-600 text-center mt-12">
        <p className="text-lg font-semibold text-white mb-2">
            Suivez votre DSO avec le Tracker Excel gratuit
        </p>
        <p className="text-sm text-slate-400 mb-6">
            Calcul automatique, alertes impayés, suivi des relances.
        </p>
        <Link
            href="/ressources/templates"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all"
        >
            Télécharger le Tracker DSO gratuit →
        </Link>
    </div>

</div>
)

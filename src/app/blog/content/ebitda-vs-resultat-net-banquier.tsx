import Link from 'next/link'

export const articleBody = (
<div className="published-article-body">

    <div className="not-prose bg-slate-50 rounded-xl p-8 border-l-4 border-blue-500 mb-12">
        <p className="text-lg leading-relaxed text-slate-700">
            Votre expert-comptable vous montre un résultat net positif. Vous souriez.
            Votre banquier, lui, regarde autre chose. Et il ne sourit pas de la même façon.
        </p>
    </div>

    <div className="prose prose-lg max-w-none">

        <p className="text-slate-700 leading-relaxed mb-6">
            Ce décalage coûte des refus de crédit, des négociations ratées, des dirigeants qui ne comprennent pas
            pourquoi la banque dit non alors que les chiffres sont bons.
        </p>
        <p className="text-slate-700 leading-relaxed mb-8">
            Les chiffres sont bons. Mais pas les bons chiffres.
        </p>

        {/* Section 1 */}
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Le résultat net : une photo retouchée</h2>

            <p className="text-slate-700 leading-relaxed mb-4">
                Le résultat net, c'est ce qui reste après tout. Après les intérêts de votre emprunt. Après les impôts.
                Après les amortissements de votre matériel, votre véhicule, vos logiciels.
            </p>

            <p className="text-slate-700 leading-relaxed mb-4">
                Le problème ? Ces éléments n'ont rien à voir avec la performance de votre activité. Deux boîtes
                identiques, même secteur, même CA, même équipe, peuvent afficher des résultats nets radicalement
                différents juste parce que l'une est endettée et l'autre pas. Ou parce que l'une amortit vite et
                l'autre lentement.
            </p>

            <p className="text-slate-700 leading-relaxed">
                Le résultat net est une photo retouchée. Utile pour le fisc. Pas pour comprendre si votre moteur
                économique tourne.
            </p>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">L'EBITDA : le moteur nu</h2>

            <p className="text-slate-700 leading-relaxed mb-4">
                EBITDA, ça veut dire <em>Earnings Before Interest, Taxes, Depreciation and Amortization</em>.
                En français : ce que génère votre activité avant qu'on y touche.
            </p>

            <p className="text-slate-700 leading-relaxed mb-6">La formule :</p>

            <div className="not-prose bg-white rounded-xl p-6 border-2 border-blue-500 mb-6 text-center">
                <p className="text-xl font-bold text-blue-700">
                    EBITDA = Résultat net + Impôts + Intérêts + Amortissements
                </p>
            </div>

            <p className="text-slate-700 leading-relaxed mb-4">
                Vous prenez le résultat net et vous rajoutez tout ce qu'on a soustrait pour des raisons financières,
                fiscales ou comptables. Ce qui reste, c'est la vraie performance opérationnelle.
            </p>

            <p className="text-slate-700 leading-relaxed">
                Votre activité génère-t-elle du cash par elle-même ? Oui ou non. C'est la question que répond l'EBITDA.
            </p>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pourquoi le banquier s'arrête là</h2>

            <p className="text-slate-700 leading-relaxed mb-4">
                Quand une banque analyse votre dossier de crédit, elle regarde un ratio précis :
            </p>

            <div className="not-prose bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6 text-center">
                <p className="text-xl font-bold text-slate-900">Dette nette / EBITDA</p>
            </div>

            <p className="text-slate-700 leading-relaxed mb-4">
                Ce ratio lui dit combien d'années de performance opérationnelle seraient nécessaires pour rembourser
                votre dette. En dessous de 3, vous êtes sain et finançable. Entre 3 et 5, la banque surveille.
                Au-dessus de 5, c'est un signal rouge.
            </p>

            <p className="text-slate-700 leading-relaxed mb-4">
                Pourquoi l'EBITDA et pas le résultat net ? Parce que le banquier veut savoir si votre activité peut
                rembourser, indépendamment de votre structure de financement actuelle. Il veut financer une machine
                économique solide. L'EBITDA lui montre ça.
            </p>

            <div className="not-prose bg-slate-50 rounded-xl p-6 border-l-4 border-yellow-500 mb-6">
                <p className="text-slate-700 leading-relaxed italic">
                    J'ai vu des dirigeants refusés avec 200k€ de résultat net. Et d'autres financés avec un résultat
                    net à zéro. La différence tenait à un seul chiffre.
                </p>
            </div>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ce que vous devez retenir</h2>

            <p className="text-slate-700 leading-relaxed mb-4">
                Le résultat net parle à votre comptable et au fisc. L'EBITDA parle à votre banquier, à un investisseur,
                à un repreneur potentiel.
            </p>

            <p className="text-slate-700 leading-relaxed mb-4">
                Connaissez votre EBITDA. Connaissez votre marge EBITDA — EBITDA divisé par votre CA. Comparez-la à
                la médiane de votre secteur. C'est l'un des premiers chiffres que je regarde quand j'interviens chez
                un dirigeant.
            </p>

            <p className="text-slate-700 leading-relaxed">
                Parce que c'est l'un des premiers chiffres qui dit la vérité.
            </p>
        </section>

        {/* CTA */}
        <div className="not-prose bg-slate-50 rounded-xl p-8 border border-slate-200 text-center mt-12">
            <p className="text-lg font-semibold text-slate-900 mb-4">
                Calculez votre EBITDA maintenant
            </p>
            <Link
                href="/calculateurs/ebitda"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-xl transition-all"
            >
                Accéder au calculateur EBITDA →
            </Link>
        </div>

    </div>
</div>
)

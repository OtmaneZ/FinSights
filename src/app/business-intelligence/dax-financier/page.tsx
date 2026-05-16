'use client'

import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function DaxFinancierPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Header />

            {/* ─── HERO ─── */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(49,130,206,0.15),_transparent_60%)]" />
                <div className="relative max-w-[840px] mx-auto px-6 pt-28 pb-16 lg:pt-36 lg:pb-20">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-300 border border-blue-400/40 px-3 py-1.5 rounded-sm mb-6">
                        Power BI &amp; Finance
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-white mb-3">
                        DAX Financier<br />les formules qui comptent
                    </h1>
                    <p className="text-[0.95rem] text-blue-200/90 mb-2">
                        CALCULATE &mdash; TOTALYTD &mdash; DATEADD &mdash; VAR/RETURN &mdash; DIVIDE
                    </p>
                    <p className="text-base text-gray-300 max-w-[640px] leading-relaxed font-light mt-6">
                        Power BI est livré sans mode d&rsquo;emploi financier.<br />
                        <span className="font-medium text-white">Les formules DAX génériques ne produisent pas les KPI dont un DAF a besoin.</span><br /><br />
                        Cette page documente les patterns DAX utilisés en mission : marge filtrée,
                        comparatif N/N-1, DSO dynamique, cumul annuel recalculé. Chaque formule
                        est accompagnée de son contexte d&rsquo;usage et du résultat attendu dans le dashboard.
                    </p>

                    {/* Metrics bar */}
                    <div className="mt-10 space-y-3">
                        <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/10 rounded overflow-hidden">
                            {[
                                { value: '5 patterns', label: 'DAX couverts' },
                                { value: 'Finance', label: 'Contexte métier' },
                                { value: 'PME / ETI', label: 'Cible prioritaire' },
                                { value: 'Copier-coller', label: 'Prêt à l\'emploi' },
                            ].map((m, i) => (
                                <div key={i} className={`text-center py-5 px-3 ${i < 3 ? 'border-r border-white/10' : ''} ${i < 2 ? 'border-b lg:border-b-0 border-white/10' : i === 2 ? 'border-b lg:border-b-0 border-white/10 lg:border-r' : ''}`}>
                                    <span className="block text-2xl font-bold text-white leading-none mb-1">{m.value}</span>
                                    <span className="text-[0.65rem] font-medium tracking-wider uppercase text-gray-400">{m.label}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[0.7rem] text-gray-400 text-center italic">
                            Formules validees en conditions reelles sur missions 2024-2026
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── CONTEXTE ─── */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Pourquoi le DAX standard ne suffit pas en finance
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        La documentation Microsoft couvre la syntaxe. Elle ne couvre pas les pieges
                        specifiques aux donnees comptables.
                    </p>

                    <div className="grid md:grid-cols-2 gap-5 mb-8">
                        {[
                            {
                                titre: 'Les dates fiscales ne sont pas les dates calendaires',
                                desc: 'Un exercice qui commence en juillet casse TOTALYTD par defaut. Sans table de dates dediee, les cumuls sont faux.',
                            },
                            {
                                titre: 'La marge depend du contexte de filtre',
                                desc: 'Calculer la marge globale est trivial. La recalculer correctement quand l\'utilisateur filtre par famille produit ou par commercial, c\'est CALCULATE.',
                            },
                            {
                                titre: 'Le N-1 doit etre homogene',
                                desc: 'Comparer mars 2025 a mars 2024 ne suffit pas si le perimetre a change. DATEADD seul ne gere pas les retraitements de perimetre.',
                            },
                            {
                                titre: 'Le DSO varie selon la methode de calcul',
                                desc: 'DSO = Creances / CA * 30 est une simplification. La version rigoureuse necessite une VAR intermediaire pour eviter les divisions par zero et les incoherences de clature.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded p-5">
                                <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">{item.titre}</h3>
                                <p className="text-[0.8rem] text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 bg-slate-900 text-white rounded">
                        <p className="text-[0.88rem] leading-relaxed">
                            <span className="font-semibold">Ce que cette page documente :</span> les cinq patterns DAX
                            les plus utiles en contexte finance d&rsquo;entreprise, avec la logique metier derriere chaque choix
                            de syntaxe.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── PATTERN 01 : CALCULATE ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-600 border border-blue-200 px-3 py-1 rounded-sm mb-4">
                        Pattern 01
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        CALCULATE &mdash; Marge filtrée par contexte
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        La formule la plus importante de Power BI finance. Elle permet de recalculer
                        n&rsquo;importe quel KPI dans un contexte de filtre modifie.
                    </p>

                    <div className="space-y-6">
                        {/* Contexte métier */}
                        <div className="bg-blue-50 border border-blue-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-blue-700 mb-2">
                                Contexte metier
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                Votre tableau de bord affiche la marge brute totale. Un directeur commercial
                                filtre sur sa region : la marge affichee doit etre recalculee sur son perimetre,
                                pas ramenee a une valeur globale divisee. CALCULATE reecrit le contexte de filtre
                                avant d&rsquo;evaluer la mesure.
                            </p>
                        </div>

                        {/* Code */}
                        <div className="border-l-2 border-blue-400 pl-5 bg-gray-950 rounded-r py-4 pr-5 overflow-x-auto">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`Marge Brute Filtrée =
CALCULATE(
    [Marge Brute],               -- mesure a recalculer
    REMOVEFILTERS('Produits'[Famille]),  -- supprime le filtre famille
    KEEPFILTERS('Region'[Code])  -- conserve le filtre region
)`}</pre>
                        </div>

                        {/* Quand l'utiliser */}
                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Quand l&rsquo;utiliser
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Marge par famille produit independante des filtres visuels croisés',
                                    'Part de marché d\'une région vs total groupe',
                                    'Contribution d\'un commercial au CA total (sans que le filtre nom ne coupe les autres)',
                                    'Recalcul du budget sur périmètre réel quand le périmètre a changé en cours d\'année',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['-'] before:absolute before:left-0 before:text-gray-300">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Résultat */}
                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Resultat dans le dashboard
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Une carte KPI &ldquo;Marge Brute&rdquo; qui affiche la bonne valeur quel que soit le filtre
                                appliqué sur d&rsquo;autres visuels. Fini les chiffres qui ne collent pas avec le rapport comptable
                                quand on segmente par business unit.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PATTERN 02 : TOTALYTD ─── */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-amber-600 border border-amber-200 px-3 py-1 rounded-sm mb-4">
                        Pattern 02
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        TOTALYTD &mdash; Cumul annuel sur exercice fiscal
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Le cumul depuis le debut de l&rsquo;exercice, pas depuis le 1er janvier. Le parametre
                        year_end_date est la cle que la plupart des tutoriels omettent.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-amber-700 mb-2">
                                Contexte metier
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                Une PME dont l&rsquo;exercice court du 1er juillet au 30 juin. En mars, le cumul
                                annuel doit afficher 9 mois (juillet a mars), pas 3 mois (janvier a mars). Sans
                                le parametre year_end_date, TOTALYTD repart systematiquement du 1er janvier.
                                Resultat : les graphiques ne correspondent jamais aux etats financiers.
                            </p>
                        </div>

                        <div className="border-l-2 border-amber-400 pl-5 bg-gray-950 rounded-r py-4 pr-5 overflow-x-auto">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`CA Cumulé YTD =
TOTALYTD(
    SUM('Ventes'[Montant HT]),  -- mesure a cumuler
    'Calendrier'[Date],          -- colonne date de la table calendrier
    "30/06"                      -- fin d'exercice si hors 31/12
)

-- Variante explicite (recommandée en production) :
CA Cumulé YTD v2 =
CALCULATE(
    SUM('Ventes'[Montant HT]),
    DATESYTD('Calendrier'[Date], "30/06")
)`}</pre>
                        </div>

                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Quand l&rsquo;utiliser
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    'CA cumulé depuis le debut de l\'exercice dans la carte KPI principale',
                                    'Charges cumulées pour suivi budgétaire en cours d\'année',
                                    'EBITDA YTD comparé au budget YTD (même logique de cumul)',
                                    'Tout KPI presenté en "depuis le debut de l\'exercice" dans un reporting DAF',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['-'] before:absolute before:left-0 before:text-gray-300">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Resultat dans le dashboard
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Un indicateur &ldquo;CA YTD : 2,4 M&euro;&rdquo; qui affiche exactement le meme chiffre
                                que le grand livre comptable, quel que soit le mois selectionné dans le filtre de date.
                                Zero ecart avec la balance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PATTERN 03 : DATEADD ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-purple-600 border border-purple-200 px-3 py-1 rounded-sm mb-4">
                        Pattern 03
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        DATEADD &mdash; Comparatif N vs N-1
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        L&rsquo;indicateur de glissement annuel que tout DAF demande en premiere slide.
                        Avec la gestion correcte des periodes incompletes.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-purple-50 border border-purple-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-purple-700 mb-2">
                                Contexte metier
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                Le reporting de fevrier 2025 doit comparer fevrier 2025 a fevrier 2024,
                                pas a la totalite de 2024. DATEADD decale le contexte de filtre de 12 mois en arriere,
                                en conservant exactement le meme grain temporel (mois, semaine, jour) que la selection active.
                                Le calcul d&rsquo;ecart et du taux de croissance s&rsquo;appuie ensuite sur cette valeur N-1.
                            </p>
                        </div>

                        <div className="border-l-2 border-purple-400 pl-5 bg-gray-950 rounded-r py-4 pr-5 overflow-x-auto">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`-- CA de la meme periode l'annee precedente
CA N-1 =
CALCULATE(
    SUM('Ventes'[Montant HT]),
    DATEADD('Calendrier'[Date], -1, YEAR)
)

-- Ecart en valeur absolue
Ecart CA N vs N-1 =
[CA] - [CA N-1]

-- Taux de croissance (avec protection division par zero)
Croissance CA % =
DIVIDE(
    [CA] - [CA N-1],
    [CA N-1],
    BLANK()   -- retourne vide plutot qu'une erreur si N-1 = 0
)`}</pre>
                        </div>

                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Quand l&rsquo;utiliser
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Fleche de tendance sur chaque KPI (CA, marge, EBITDA) avec glissement N/N-1',
                                    'Graphique ligne avec deux series : annee en cours vs annee precedente',
                                    'Tableau comparatif mensuel : Realise / N-1 / Ecart / % Evolution',
                                    'Alertes automatiques quand la croissance passe sous un seuil (-5 %, -10 %)',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['-'] before:absolute before:left-0 before:text-gray-300">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Resultat dans le dashboard
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Chaque carte KPI affiche : valeur periode, valeur N-1, ecart en euros,
                                fleche de tendance. Quand le DAF change la periode dans le filtre,
                                tout se recalcule automatiquement. Aucune formule a modifier.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PATTERN 04 : DIVIDE ─── */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-emerald-600 border border-emerald-200 px-3 py-1 rounded-sm mb-4">
                        Pattern 04
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        DIVIDE &mdash; Taux de marge sans erreur
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        La division securisee. En finance, les denominateurs a zero ne sont pas
                        des cas rares : nouveaux produits sans CA, periodes hors exercice, filtres agressifs.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-emerald-50 border border-emerald-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-emerald-700 mb-2">
                                Contexte metier
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                Un ratio CA / Charges affiche une erreur quand un segment n&rsquo;a aucun chiffre
                                sur la periode selectionnee. Avec un operateur `/` natif, Power BI retourne ERROR
                                ou INFINITY, ce qui casse visuellement le tableau de bord et inquiete le DAF.
                                DIVIDE renvoie BLANK() ou une valeur par defaut, selon ce que vous choisissez.
                            </p>
                        </div>

                        <div className="border-l-2 border-emerald-400 pl-5 bg-gray-950 rounded-r py-4 pr-5 overflow-x-auto">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`-- Taux de marge brute securise
Taux Marge Brute % =
DIVIDE(
    [Marge Brute],      -- numerateur
    [CA HT],            -- denominateur
    0                   -- valeur si denominateur = 0 (ici : 0 %)
)

-- Taux d'evolution securise (preferer BLANK() pour ne pas fausser les moyennes)
Taux Evolution % =
DIVIDE(
    [CA] - [CA N-1],
    [CA N-1],
    BLANK()
)

-- Cout par unite vendue (avec seuil minimum pour eviter les aberrations)
Cout Unitaire =
VAR _qte = SUM('Ventes'[Quantite])
RETURN
DIVIDE(
    SUM('Achats'[Montant]),
    IF(_qte > 0, _qte, BLANK())
)`}</pre>
                        </div>

                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Quand l&rsquo;utiliser
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Tous les taux et ratios financiers sans exception (marge, ROE, ratio d\'endettement)',
                                    'Indicateurs de productivite (CA par employe, marge par affaire)',
                                    'Calculs de part de marche et pourcentages de contribution',
                                    'Tout denominateur susceptible d\'etre zero sur un segment ou une periode',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['-'] before:absolute before:left-0 before:text-gray-300">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Resultat dans le dashboard
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Un tableau de bord qui ne s&rsquo;affiche jamais en erreur, meme sur des segments
                                ou des periodes sans donnees. Les cellules vides restent vides, sans perturber
                                les moyennes et les visualisations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PATTERN 05 : VAR/RETURN ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-rose-600 border border-rose-200 px-3 py-1 rounded-sm mb-4">
                        Pattern 05
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        VAR / RETURN &mdash; DSO dynamique
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Le pattern de lisibilite. En finance, les formules DAX deviennent rapidement
                        illisibles. VAR/RETURN permet de les decomposer en etapes nommees,
                        auditables, et reutilisables.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-rose-50 border border-rose-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-rose-700 mb-2">
                                Contexte metier
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                Le DSO (Delai de Paiement Clients) est un KPI critique pour le BFR. Sa formule
                                rigoureuse implique plusieurs etapes : calcul du CA sur 90 jours glissants,
                                encours clients a date, puis division securisee. Une formule DAX imbriquee
                                sur une ligne est inauditable. VAR decompose le calcul en etapes explicites.
                            </p>
                        </div>

                        <div className="border-l-2 border-rose-400 pl-5 bg-gray-950 rounded-r py-4 pr-5 overflow-x-auto">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`DSO Dynamique (jours) =
VAR _dateMax = MAX('Calendrier'[Date])           -- date de fin de periode
VAR _date90  = _dateMax - 89                     -- fenetre glissante 90 jours

VAR _ca90 =
    CALCULATE(
        SUM('Ventes'[Montant HT]),
        DATESBETWEEN('Calendrier'[Date], _date90, _dateMax)
    )

VAR _encours =
    CALCULATE(
        SUM('Creances'[Solde]),
        'Calendrier'[Date] <= _dateMax
    )

VAR _caJour = DIVIDE(_ca90, 90, BLANK())         -- CA moyen journalier

RETURN
DIVIDE(_encours, _caJour, BLANK())               -- DSO en jours`}</pre>
                        </div>

                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Quand l&rsquo;utiliser
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Tous les KPI a plusieurs etapes de calcul : DSO, DPO, BFR en jours de CA',
                                    'Formules qui reutilisent un meme sous-total plusieurs fois (evite les recalculs)',
                                    'Mesures que d\'autres personnes devront maintenir (nommage explicite)',
                                    'Calculs conditionnels complexes (if/switch imbriques sur des valeurs intermediaires)',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['-'] before:absolute before:left-0 before:text-gray-300">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Resultat dans le dashboard
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Une carte KPI &ldquo;DSO : 47 jours&rdquo; qui se recalcule dynamiquement quand
                                l&rsquo;utilisateur change la periode ou filtre par client. La formule reste lisible
                                par n&rsquo;importe quel analyste qui reprend le fichier six mois plus tard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── RECAP TABLE ─── */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Recapitulatif des 5 patterns
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Quand utiliser chaque pattern selon le KPI finance a produire.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-[0.82rem] border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider w-[140px]">Pattern</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">KPI finance concerne</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">Difficulte</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { pattern: 'CALCULATE', kpi: 'Marge filtrée, part de marché, contribution segmentée', diff: 'Intermediaire' },
                                    { pattern: 'TOTALYTD', kpi: 'CA YTD, charges cumulées, EBITDA depuis debut exercice', diff: 'Debutant' },
                                    { pattern: 'DATEADD', kpi: 'Glissement N/N-1, taux de croissance, ecart budgetaire', diff: 'Debutant' },
                                    { pattern: 'DIVIDE', kpi: 'Taux de marge, ROE, ratios, pourcentages de contribution', diff: 'Debutant' },
                                    { pattern: 'VAR / RETURN', kpi: 'DSO, DPO, BFR jours CA, formules multi-etapes', diff: 'Intermediaire' },
                                ].map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-3 font-mono font-bold text-blue-700 border-b border-gray-100">{row.pattern}</td>
                                        <td className="px-4 py-3 text-gray-700 border-b border-gray-100">{row.kpi}</td>
                                        <td className="px-4 py-3 text-gray-500 border-b border-gray-100">{row.diff}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ─── PRE-REQUIS ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Pre-requis : ce qui doit etre en place avant les formules
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Les formules DAX sont fiables seulement si le modele de donnees sous-jacent
                        l&rsquo;est aussi. Trois elements non-negociables.
                    </p>

                    <div className="grid md:grid-cols-3 gap-5 mb-8">
                        {[
                            {
                                num: '01',
                                titre: 'Table de dates dediee',
                                desc: 'Une table \'Calendrier\' marquee comme table de dates dans Power BI, avec une ligne par jour, des colonnes Annee / Mois / SemaineExercice. Sans elle, TOTALYTD et DATEADD sont instables.',
                            },
                            {
                                num: '02',
                                titre: 'Mesures centralisees',
                                desc: 'Toutes les mesures dans une table \'_Mesures\' vide, jamais directement sur les tables de faits. Facilite la maintenance, evite les duplications, rend le modele auditable.',
                            },
                            {
                                num: '03',
                                titre: 'Relations etoile propres',
                                desc: 'Un schema en etoile avec une table de faits centrale (Ventes, Ecritures) et des dimensions (Clients, Produits, Calendrier) en relation 1-to-many. Les relations many-to-many cassent CALCULATE.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded p-5">
                                <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">{item.num}</div>
                                <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">{item.titre}</h3>
                                <p className="text-[0.78rem] text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 bg-slate-900 text-white rounded">
                        <p className="text-[0.88rem] leading-relaxed">
                            <span className="font-semibold">La regle de base :</span> avant d&rsquo;ecrire la premiere formule DAX,
                            30 minutes de verification du modele de donnees evitent 3 heures de debogage
                            sur des resultats incoherents.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6 text-center">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4">
                        Mise en oeuvre
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Appliquer ces formules a vos donnees
                    </h2>
                    <p className="text-[0.9rem] text-gray-600 max-w-[520px] mx-auto mb-10 leading-relaxed">
                        Les patterns DAX documentés ici sont implementes dans chaque mission de reporting financier.
                        Si vous partez de zero ou reprenez un modele Power BI existant, voici les deux prochaines etapes.
                    </p>

                    <div className="grid md:grid-cols-2 gap-5 mb-10 text-left">
                        <div className="bg-white border border-gray-200 rounded p-5">
                            <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">
                                Connecter vos donnees comptables
                            </h3>
                            <p className="text-[0.78rem] text-gray-600 leading-relaxed mb-4">
                                Sage, Cegid, EBP ou FEC : chaque source a sa methode d&rsquo;import dans Power BI.
                                La page connecteurs documente les etapes pour chaque logiciel.
                            </p>
                            <Link
                                href="/business-intelligence/connecteurs-comptables"
                                className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                            >
                                Voir les connecteurs <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-5">
                            <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">
                                Faire implementer le reporting complet
                            </h3>
                            <p className="text-[0.78rem] text-gray-600 leading-relaxed mb-4">
                                Mission de 3 semaines : connexion des sources, modelisation, formules DAX,
                                dashboard livre avec formation. Autonomie totale a l&rsquo;issue.
                            </p>
                            <Link
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                            >
                                Planifier un echange <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    <Link
                        href="https://calendly.com/zineinsight"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded text-[0.85rem] font-semibold hover:bg-slate-800 transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                        Discuter de votre reporting Power BI
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

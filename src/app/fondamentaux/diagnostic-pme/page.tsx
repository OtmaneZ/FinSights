'use client'

import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function DiagnosticPmePage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Header />

            {/* HERO */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(49,130,206,0.15),_transparent_60%)]" />
                <div className="relative max-w-[840px] mx-auto px-6 pt-28 pb-16 lg:pt-36 lg:pb-20">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-300 border border-blue-400/40 px-3 py-1.5 rounded-sm mb-6">
                        Methode &amp; Fondamentaux
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-white mb-3">
                        Diagnostic financier<br />d&rsquo;une PME en 7 etapes
                    </h1>
                    <p className="text-[0.95rem] text-blue-200/90 mb-2">
                        Compte de resultat &mdash; Bilan &mdash; BFR &mdash; Structure financiere &mdash; Flux de tresorerie
                    </p>
                    <p className="text-base text-gray-300 max-w-[640px] leading-relaxed font-light mt-6">
                        La plupart des dirigeants regardent leurs chiffres dans le mauvais ordre.<br />
                        <span className="font-medium text-white">Ils commencent par le resultat net alors que la tresorerie est en train de s&rsquo;effondrer.</span><br /><br />
                        Cette page documente les 7 etapes d&rsquo;un diagnostic financier rigoureux,
                        dans l&rsquo;ordre ou les analyser a du sens. Inspire de la methodologie Vernimmen,
                        adapte aux realites d&rsquo;une PME de 500k a 10M&euro; de CA.
                    </p>

                    {/* Metrics bar */}
                    <div className="mt-10 space-y-3">
                        <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/10 rounded overflow-hidden">
                            {[
                                { value: '7 etapes', label: 'Dans le bon ordre' },
                                { value: 'Vernimmen', label: 'Methode de reference' },
                                { value: 'PME', label: '500k a 10M CA' },
                                { value: 'Actionnables', label: 'Chaque etape produit un signal' },
                            ].map((m, i) => (
                                <div key={i} className={`text-center py-5 px-3 ${i < 3 ? 'border-r border-white/10' : ''} ${i < 2 ? 'border-b lg:border-b-0 border-white/10' : i === 2 ? 'border-b lg:border-b-0 border-white/10 lg:border-r' : ''}`}>
                                    <span className="block text-2xl font-bold text-white leading-none mb-1">{m.value}</span>
                                    <span className="text-[0.65rem] font-medium tracking-wider uppercase text-gray-400">{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* POURQUOI L'ORDRE COMPTE */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Pourquoi l&rsquo;ordre du diagnostic change tout
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Un diagnostic financier n&rsquo;est pas une liste de ratios a cocher. C&rsquo;est une lecture
                        en entonnoir : du contexte vers les flux, du general vers le specifique.
                    </p>

                    <div className="grid md:grid-cols-2 gap-5 mb-8">
                        {[
                            {
                                titre: 'Le resultat net ne dit pas si l\'entreprise est saine',
                                desc: 'Une PME peut afficher 200k euros de benefice et se retrouver en cessation de paiement six mois plus tard. Resultat et tresorerie sont deux choses differentes. Le diagnostic doit traiter les deux.',
                            },
                            {
                                titre: 'Les ratios hors contexte sont trompeurs',
                                desc: 'Un DSO de 90 jours est catastrophique dans la restauration, normal dans le BTP, excellent dans le conseil en ingenierie. Sans connaitre le secteur et le modele economique, les chiffres ne veulent rien dire.',
                            },
                            {
                                titre: 'Le bilan est une photo, le compte de resultat un film',
                                desc: 'Regarder uniquement le bilan revient a juger la sante d\'un sportif a l\'arret. La dynamique (evolution sur 3 ans, tendances) est plus revelatrice que le chiffre instantane.',
                            },
                            {
                                titre: 'La banque lit les chiffres dans un ordre precis',
                                desc: 'Votre banquier regarde d\'abord l\'EBE, puis le ratio dette/EBE, puis la CAF. Si vous ne lisez pas vos etats dans le meme ordre, vous ne voyez pas ce qu\'il voit et vous ne pouvez pas anticiper ses questions.',
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
                            <span className="font-semibold">La regle de Vernimmen :</span> commencer par comprendre
                            l&rsquo;activite avant de toucher un seul chiffre. Un bon diagnostic financier commence
                            par une conversation sur le metier, pas par une extraction comptable.
                        </p>
                    </div>
                </div>
            </section>

            {/* ETAPE 01 : CONTEXTE */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-600 border border-blue-200 px-3 py-1 rounded-sm mb-4">
                        Etape 01
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Comprendre le contexte avant les chiffres
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Secteur, modele economique, saisonnalite, cycle d&rsquo;exploitation.
                        Les ratios n&rsquo;ont de sens que rapportes a ces elements.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-blue-700 mb-2">
                                Pourquoi cette etape est non-negociable
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                Deux PME avec exactement les memes ratios peuvent avoir des santes financieres
                                radicalement differentes. Une entreprise de BTP avec 120 jours de BFR
                                est en bonne sante. Une entreprise de e-commerce avec le meme BFR est en danger.
                                Le contexte transforme la lecture.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Les quatre questions a poser en premier
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Quel est le cycle d\'exploitation ? (de la commande client a l\'encaissement, combien de jours s\'ecoulent)',
                                    'Y a-t-il de la saisonnalite ? (si oui, a quelle periode l\'entreprise consomme-t-elle le plus de cash)',
                                    'Quel est le modele de facturation ? (a la livraison, a l\'avancement, abonnement mensuel, licence annuelle)',
                                    'Qui sont les 3 premiers clients et quelle est leur part du CA ? (concentration = risque)',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['-'] before:absolute before:left-0 before:text-gray-300">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Signal attendu
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                A la fin de cette etape, vous avez une hypothese sur la nature du risque principal :
                                risque commercial (dependance client), risque operationnel (cycle long), ou
                                risque structurel (modele peu scalable). Cette hypothese guide toute la lecture qui suit.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ETAPE 02 : COMPTE DE RESULTAT */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-amber-600 border border-amber-200 px-3 py-1 rounded-sm mb-4">
                        Etape 02
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Lire le compte de resultat en cascade
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Du chiffre d&rsquo;affaires au resultat net, chaque niveau de marge
                        repond a une question precise. Les lire dans l&rsquo;ordre, c&rsquo;est comprendre
                        ou l&rsquo;argent disparait.
                    </p>

                    <div className="space-y-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[0.82rem] border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">Niveau</th>
                                        <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">Ce qu&rsquo;il mesure</th>
                                        <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">Signal d&rsquo;alerte</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { niveau: 'Marge brute', mesure: 'Richesse creee par l\'activite avant toute charge de structure', alerte: 'En baisse sur 2 exercices = pression concurrentielle ou hausse couts directs' },
                                        { niveau: 'EBE / EBITDA', mesure: 'Capacite a degager du cash depuis l\'exploitation, hors financement et hors comptabilite d\'amortissement', alerte: 'Negatif = l\'entreprise detruit de la valeur avant meme de payer ses dettes' },
                                        { niveau: 'Resultat d\'exploitation', mesure: 'Performance apres amortissements (prise en compte du vieillissement des actifs)', alerte: 'Ecart fort entre EBE et Rex = investissements lourds a amortir' },
                                        { niveau: 'Resultat net', mesure: 'Ce qui reste apres impots et charges financieres', alerte: 'Ne pas confondre avec le cash disponible : le resultat net peut etre positif et la tresorerie nulle' },
                                    ].map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-3 font-semibold text-gray-900 border-b border-gray-100">{row.niveau}</td>
                                            <td className="px-4 py-3 text-gray-700 border-b border-gray-100">{row.mesure}</td>
                                            <td className="px-4 py-3 text-gray-500 text-[0.78rem] border-b border-gray-100">{row.alerte}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-amber-700 mb-2">
                                Le ratio cle a ce stade
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                Taux d&rsquo;EBE = EBE / CA. En dessous de 5%, la PME n&rsquo;a aucune marge de manoeuvre
                                pour rembourser ses dettes ou investir. Entre 10 et 15%, c&rsquo;est la zone de confort
                                pour la plupart des secteurs. Au-dela de 20%, l&rsquo;entreprise a un avantage
                                concurrentiel structurel a proteger.
                            </p>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Signal attendu
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Vous identifiez a quel niveau la profitabilite se degrade. Si la marge brute est
                                bonne mais l&rsquo;EBE mauvais, les charges de structure sont le probleme.
                                Si l&rsquo;EBE est bon mais le resultat net mauvais, regardez les charges financieres.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ETAPE 03 : BILAN */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-purple-600 border border-purple-200 px-3 py-1 rounded-sm mb-4">
                        Etape 03
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Decortiquer le bilan en deux lectures
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Le bilan est une photo a date. Il repond a une seule question :
                        comment l&rsquo;entreprise finance-t-elle ce qu&rsquo;elle possede ?
                        La reponse revele sa solidite structurelle.
                    </p>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="bg-purple-50 border border-purple-100 rounded p-5">
                                <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-purple-700 mb-3">
                                    Lecture 1 : l&rsquo;actif (ce que l&rsquo;entreprise possede)
                                </h3>
                                <ul className="space-y-2">
                                    {[
                                        { label: 'Actif immobilise', desc: 'Les outils de production (machines, logiciels, fonds de commerce). Leur poids dans le total actif indique l\'intensite capitalistique.' },
                                        { label: 'Stocks', desc: 'Cash transforme en marchandises ou en encours de production. Un stock qui grossit plus vite que le CA est un signal d\'alerte.' },
                                        { label: 'Creances clients', desc: 'CA facture mais pas encore encaisse. C\'est du cash que l\'entreprise a prete a ses clients gratuitement.' },
                                        { label: 'Tresorerie', desc: 'Ce qu\'il reste. Un actif courant superieur au passif courant signifie que l\'entreprise peut honorer ses echeances a court terme.' },
                                    ].map((item, i) => (
                                        <li key={i} className="text-[0.8rem] text-gray-700 leading-snug">
                                            <span className="font-semibold text-gray-900">{item.label} :</span> {item.desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded p-5">
                                <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-slate-600 mb-3">
                                    Lecture 2 : le passif (comment c&rsquo;est finance)
                                </h3>
                                <ul className="space-y-2">
                                    {[
                                        { label: 'Capitaux propres', desc: 'La mise de l\'actionnaire plus les benefices cumules non distribues. C\'est le coussin absorbeur de pertes.' },
                                        { label: 'Dettes financieres LT', desc: 'Les emprunts bancaires. Leur rapport a l\'EBE definit la capacite de remboursement.' },
                                        { label: 'Dettes fournisseurs', desc: 'Cash que l\'entreprise n\'a pas encore verse a ses fournisseurs. C\'est un financement gratuit a optimiser.' },
                                        { label: 'Dettes fiscales et sociales', desc: 'TVA, cotisations, IS a payer. Leur retard de paiement est le premier indicateur de tension de tresorerie.' },
                                    ].map((item, i) => (
                                        <li key={i} className="text-[0.8rem] text-gray-700 leading-snug">
                                            <span className="font-semibold text-gray-900">{item.label} :</span> {item.desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Signal attendu
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Le Fonds de Roulement Net Global (FRNG = ressources durables minus emplois stables).
                                S&rsquo;il est positif, l&rsquo;entreprise finance une partie de son cycle d&rsquo;exploitation
                                avec des ressources longues. S&rsquo;il est negatif, elle finance des actifs longs
                                avec des dettes courtes. Situation fragile.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ETAPE 04 : BFR */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-600 border border-blue-200 px-3 py-1 rounded-sm mb-4">
                        Etape 04
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Analyser le BFR et le cycle d&rsquo;exploitation
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Le Besoin en Fonds de Roulement est le cash que l&rsquo;entreprise doit avoir en permanence
                        pour financer le decalage entre ses encaissements et ses paiements.
                        C&rsquo;est souvent la ou se joue la survie.
                    </p>

                    <div className="space-y-6">
                        <div className="border-l-2 border-blue-400 pl-5 bg-gray-950 rounded-r py-4 pr-5">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`BFR = Creances clients + Stocks - Dettes fournisseurs

BFR en jours de CA = BFR / (CA / 365)

DSO (jours clients)  = Creances TTC / (CA TTC / 365)
DPO (jours fournis.) = Dettes fourn. / (Achats TTC / 365)
DIO (jours de stock) = Stock / (Cout des ventes / 365)`}</pre>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5">
                            {[
                                {
                                    kpi: 'DSO elevé',
                                    couleur: 'bg-red-50 border-red-200',
                                    titre: 'text-red-700',
                                    desc: 'Vos clients vous paient tard. Chaque jour supplementaire = CA / 365 euros de cash immobilise. Sur 10M de CA, 10 jours de DSO en trop = 274k euros de cash bloque.',
                                },
                                {
                                    kpi: 'DPO faible',
                                    couleur: 'bg-amber-50 border-amber-200',
                                    titre: 'text-amber-700',
                                    desc: 'Vous payez vos fournisseurs trop vite. Negocier 30 jours supplementaires sur des achats annuels de 2M euros libere immediatement 164k euros de tresorerie. Sans lever un centime de dette.',
                                },
                                {
                                    kpi: 'Stock qui grossit',
                                    couleur: 'bg-orange-50 border-orange-200',
                                    titre: 'text-orange-700',
                                    desc: 'Du cash transforme en marchandises qui n\'ont pas encore trouve d\'acheteur. La rotation des stocks (CA / Stock moyen) doit etre comparee au secteur. En dessous de la mediane, c\'est du cash dormant.',
                                },
                            ].map((item, i) => (
                                <div key={i} className={`border rounded p-4 ${item.couleur}`}>
                                    <h3 className={`text-[0.8rem] font-bold uppercase tracking-wider mb-2 ${item.titre}`}>{item.kpi}</h3>
                                    <p className="text-[0.78rem] text-gray-700 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Signal attendu
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Un BFR superieur a 60 jours de CA merite une investigation approfondie.
                                La question n&rsquo;est pas seulement &ldquo;combien&rdquo; mais &ldquo;pourquoi&rdquo; :
                                conditions contractuelles, retards de recouvrement, ou inefficacite operationnelle.
                                Chaque cause appelle une action differente.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/calculateurs/bfr"
                                className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-blue-700 border border-blue-200 bg-blue-50 px-4 py-2 rounded hover:bg-blue-100 transition-colors"
                            >
                                Calculer mon BFR <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                                href="/calculateurs/dso"
                                className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-blue-700 border border-blue-200 bg-blue-50 px-4 py-2 rounded hover:bg-blue-100 transition-colors"
                            >
                                Calculer mon DSO <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ETAPE 05 : STRUCTURE FINANCIERE */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-emerald-600 border border-emerald-200 px-3 py-1 rounded-sm mb-4">
                        Etape 05
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Evaluer la structure financiere
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        C&rsquo;est la grille de lecture de votre banquier. Il regarde trois ratios
                        dans cet ordre precis avant de decider s&rsquo;il vous prete de l&rsquo;argent.
                    </p>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-5">
                            {[
                                {
                                    num: '01',
                                    ratio: 'Dette nette / EBE',
                                    seuil: 'Seuil : 3x',
                                    couleurNum: 'text-emerald-600',
                                    desc: 'Combien d\'annees d\'EBE faut-il pour rembourser la dette ? En dessous de 3x : situation saine. Entre 3 et 5x : surveillance. Au-dela de 5x : la banque commence a s\'inquieter serieusement.',
                                },
                                {
                                    num: '02',
                                    ratio: 'Capitaux propres / Total bilan',
                                    seuil: 'Seuil : > 20%',
                                    couleurNum: 'text-emerald-600',
                                    desc: 'Le taux d\'autonomie financiere. Un actionnaire qui a mis peu et emprunte beaucoup fait porter le risque a la banque. En dessous de 20%, le financement externe additionnel sera difficile et couteux.',
                                },
                                {
                                    num: '03',
                                    ratio: 'CAF / Remboursements annuels',
                                    seuil: 'Seuil : > 1,2x',
                                    couleurNum: 'text-emerald-600',
                                    desc: 'La capacite de remboursement : est-ce que l\'entreprise genere assez de cash pour honorer ses echeances ? En dessous de 1x, l\'entreprise rembourse sa dette avec de la dette. Cercle dangereux.',
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded p-5">
                                    <div className={`text-[0.65rem] font-bold tracking-[0.15em] uppercase mb-2 ${item.couleurNum}`}>{item.num}</div>
                                    <h3 className="text-[0.88rem] font-bold text-gray-900 mb-0.5">{item.ratio}</h3>
                                    <p className="text-[0.72rem] font-semibold text-emerald-600 mb-3">{item.seuil}</p>
                                    <p className="text-[0.78rem] text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-emerald-700 mb-2">
                                Ce que le banquier ne vous dit pas
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                La banque calcule ces ratios sur les 3 derniers exercices et les compare
                                a la mediane sectorielle (base Banque de France). Si vous etes en dessous
                                de la mediane sur deux ratios, le credit supplementaire sera refuse ou
                                assorti de garanties. Connaitre ces seuils avant la negociation, c&rsquo;est
                                pouvoir presenter un plan credible plutot qu&rsquo;une demande nue.
                            </p>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Signal attendu
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Vous sortez de cette etape avec une note implicite de risque : faible, moyen, eleve.
                                Elle determinera vos conditions d&rsquo;acces au financement pour les
                                12 prochains mois. La corriger prend du temps : mieux vaut le savoir tot.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ETAPE 06 : FLUX DE TRESORERIE */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-rose-600 border border-rose-200 px-3 py-1 rounded-sm mb-4">
                        Etape 06
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Lire les flux de tresorerie
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Le tableau de flux de tresorerie est le document le plus honnete de la comptabilite.
                        Contrairement au compte de resultat, on ne peut pas le maquiller.
                        Le cash est arrive, ou il n&rsquo;est pas arrive.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-rose-50 border border-rose-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-rose-700 mb-3">
                                Les trois flux a distinguer
                            </h3>
                            <div className="space-y-3">
                                {[
                                    {
                                        label: 'Flux d\'exploitation (FCF operationnel)',
                                        desc: 'Le cash produit par l\'activite courante. C\'est le flux fondamental. Il doit etre positif de maniere reguliere. Une entreprise dont l\'exploitation consomme du cash chaque annee financera sa croissance avec de la dette, pas avec ses benefices.',
                                    },
                                    {
                                        label: 'Flux d\'investissement',
                                        desc: 'Le cash depense en acquisitions d\'actifs (machines, logiciels, rachats). Un flux d\'investissement eleve n\'est pas mauvais en soi : il revele une strategie de croissance. La question est : le flux d\'exploitation couvre-t-il cet investissement ?',
                                    },
                                    {
                                        label: 'Flux de financement',
                                        desc: 'Emprunts contractes, remboursements effectues, dividendes verses. Si ce flux est le seul positif, l\'entreprise vit sous perfusion bancaire. Signal d\'alerte critique.',
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="border-l-2 border-rose-300 pl-4">
                                        <p className="text-[0.82rem] font-semibold text-gray-900 mb-0.5">{item.label}</p>
                                        <p className="text-[0.78rem] text-gray-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-l-2 border-rose-400 pl-5 bg-gray-950 rounded-r py-4 pr-5">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`CAF (Capacite d'Autofinancement) = Resultat net + Dotations aux amortissements
                                   - Reprises - Plus-values de cession

Free Cash-Flow = CAF - Variation du BFR - Investissements nets

Interpretation :
  FCF > 0  : l'entreprise s'autofinance et peut rembourser ou distribuer
  FCF = 0  : equilibre fragile, aucune marge
  FCF < 0  : l'entreprise consomme du cash, la dette augmente`}</pre>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Signal attendu
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Un FCF negatif sur un exercice peut etre volontaire (annee d&rsquo;investissement).
                                Un FCF negatif sur trois exercices consecutifs revele un probleme structurel :
                                soit le modele ne degage pas assez de marge, soit le BFR croit plus vite
                                que le CA, soit les investissements ne produisent pas de retour suffisant.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ETAPE 07 : BENCHMARKS ET SYNTHESE */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-slate-600 border border-slate-300 px-3 py-1 rounded-sm mb-4">
                        Etape 07
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Comparer aux benchmarks sectoriels et synthetiser
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Un ratio n&rsquo;a de sens qu&rsquo;en comparaison. La Banque de France publie chaque annee
                        les medianes sectorielles sur 45 ratios. C&rsquo;est la reference qui compte.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded p-5">
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                Les 6 ratios a positionner par rapport a la mediane sectorielle
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-[0.82rem] border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="text-left px-3 py-2.5 font-semibold text-[0.75rem] uppercase tracking-wider text-gray-500 border-b border-gray-200">Ratio</th>
                                            <th className="text-left px-3 py-2.5 font-semibold text-[0.75rem] uppercase tracking-wider text-gray-500 border-b border-gray-200">Formule</th>
                                            <th className="text-left px-3 py-2.5 font-semibold text-[0.75rem] uppercase tracking-wider text-gray-500 border-b border-gray-200">Ce que la position revele</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { ratio: 'Taux d\'EBE', formule: 'EBE / CA', signal: 'Capacite beneficiaire brute vs pairs' },
                                            { ratio: 'BFR en jours', formule: 'BFR / (CA/365)', signal: 'Efficacite du cycle d\'exploitation' },
                                            { ratio: 'Dette nette / EBE', formule: 'Dettes fin. nettes / EBE', signal: 'Endettement relatif, lecture banquier' },
                                            { ratio: 'Taux de marge brute', formule: 'MB / CA', signal: 'Pression sur les couts directs' },
                                            { ratio: 'Rotation actif', formule: 'CA / Total actif', signal: 'Intensite d\'utilisation des ressources' },
                                            { ratio: 'Couverture interets', formule: 'EBE / Charges financieres', signal: 'Confort de remboursement de la dette' },
                                        ].map((row, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-3 py-2.5 font-semibold text-gray-900 border-b border-gray-100">{row.ratio}</td>
                                                <td className="px-3 py-2.5 font-mono text-[0.78rem] text-blue-700 border-b border-gray-100">{row.formule}</td>
                                                <td className="px-3 py-2.5 text-gray-600 border-b border-gray-100">{row.signal}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5">
                            {[
                                {
                                    badge: 'Vert',
                                    bg: 'bg-green-50 border-green-200',
                                    badgeCss: 'bg-green-100 text-green-700',
                                    desc: 'Au-dessus de la mediane sur 4 ratios ou plus. L\'entreprise est dans le quartile superieur de son secteur. Priorite : proteger la position et financer la croissance.',
                                },
                                {
                                    badge: 'Orange',
                                    bg: 'bg-amber-50 border-amber-200',
                                    badgeCss: 'bg-amber-100 text-amber-700',
                                    desc: 'Autour de la mediane, avec 1 ou 2 ratios en dessous. Situation normale mais fragile. Identifier le ratio le plus eloigne de la mediane : c\'est le premier levier a activer.',
                                },
                                {
                                    badge: 'Rouge',
                                    bg: 'bg-red-50 border-red-200',
                                    badgeCss: 'bg-red-100 text-red-700',
                                    desc: 'En dessous de la mediane sur 3 ratios ou plus. Le diagnostic doit produire un plan d\'action chiffre avec des jalons a 90 jours. Attendre aggrave toujours la situation.',
                                },
                            ].map((item, i) => (
                                <div key={i} className={`border rounded p-4 ${item.bg}`}>
                                    <span className={`inline-block text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3 ${item.badgeCss}`}>{item.badge}</span>
                                    <p className="text-[0.78rem] text-gray-700 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Le livrable de la synthese
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Trois signaux d&rsquo;alerte classes par ordre de gravite. Pour chacun : le ratio concerne,
                                l&rsquo;ecart a la mediane, la cause probable, et l&rsquo;action recommandee a 90 jours.
                                Un diagnostic sans plan d&rsquo;action chiffre est un rapport de constat, pas un outil de pilotage.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* RECAPITULATIF */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Les 7 etapes en un coup d&rsquo;oeil
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Le bon ordre, le bon ratio cle, le bon signal a chaque etape.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-[0.82rem] border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider w-8">#</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">Etape</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">Ratio cle</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">Signal produit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { num: '01', etape: 'Contexte metier', ratio: 'Cycle d\'exploitation (jours)', signal: 'Nature du risque dominant' },
                                    { num: '02', etape: 'Compte de resultat', ratio: 'Taux d\'EBE', signal: 'Ou la profitabilite se degrade' },
                                    { num: '03', etape: 'Bilan', ratio: 'FRNG', signal: 'Solidite structurelle' },
                                    { num: '04', etape: 'BFR et cycle', ratio: 'DSO + DPO + DIO', signal: 'Cash immobilise et levier accessible' },
                                    { num: '05', etape: 'Structure financiere', ratio: 'Dette nette / EBE', signal: 'Note de risque implicite banque' },
                                    { num: '06', etape: 'Flux de tresorerie', ratio: 'Free Cash-Flow', signal: 'Capacite reelle d\'autofinancement' },
                                    { num: '07', etape: 'Benchmarks et synthese', ratio: '6 ratios vs mediane BdF', signal: 'Plan d\'action chiffre, 3 leviers' },
                                ].map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-3 font-bold text-gray-400 border-b border-gray-100">{row.num}</td>
                                        <td className="px-4 py-3 font-semibold text-gray-900 border-b border-gray-100">{row.etape}</td>
                                        <td className="px-4 py-3 font-mono text-[0.78rem] text-blue-700 border-b border-gray-100">{row.ratio}</td>
                                        <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{row.signal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6 text-center">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4">
                        Passer a la pratique
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Appliquer ces 7 etapes a votre entreprise
                    </h2>
                    <p className="text-[0.9rem] text-gray-600 max-w-[520px] mx-auto mb-10 leading-relaxed">
                        La methode est la. Deux chemins pour l&rsquo;appliquer : le diagnostic interactif
                        en 7 minutes, ou un accompagnement structure sur 3 semaines.
                    </p>

                    <div className="grid md:grid-cols-3 gap-5 mb-10 text-left">
                        <div className="bg-white border border-gray-200 rounded p-5">
                            <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">
                                Score FinSight
                            </h3>
                            <p className="text-[0.78rem] text-gray-600 leading-relaxed mb-4">
                                Diagnostic interactif 0-100 en 7 minutes. Les 4 piliers
                                (CASH, MARGIN, RESILIENCE, RISQUE) compares aux medianes sectorielles
                                Banque de France. Sans inscription.
                            </p>
                            <Link
                                href="/diagnostic/guide"
                                className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                            >
                                Lancer le diagnostic <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-5">
                            <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">
                                Calculateurs financiers
                            </h3>
                            <p className="text-[0.78rem] text-gray-600 leading-relaxed mb-4">
                                BFR, DSO, EBITDA, seuil de rentabilite : chaque ratio de la methode
                                dispose d&rsquo;un calculateur dedie avec interpretation et benchmark.
                            </p>
                            <Link
                                href="/fondamentaux/les-4-essentiels"
                                className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                            >
                                Voir les calculateurs <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-5">
                            <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">
                                Accompagnement structure
                            </h3>
                            <p className="text-[0.78rem] text-gray-600 leading-relaxed mb-4">
                                Mission de 3 semaines : diagnostic complet, identification des
                                leviers chiffres, plan d&rsquo;action priorise. Autonomie totale a l&rsquo;issue.
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
                        href="/diagnostic/guide"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded text-[0.85rem] font-semibold hover:bg-slate-800 transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                        Demarrer le diagnostic maintenant
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, AlertTriangle, Calculator, Calendar } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Les4EssentielsPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Header />

            {/* ─── HERO ─── */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(49,130,206,0.15),_transparent_60%)]" />
                <div className="relative max-w-[840px] mx-auto px-6 pt-28 pb-16 lg:pt-36 lg:pb-20">

                    <Link
                        href="/fondamentaux"
                        className="inline-flex items-center gap-1.5 text-[0.75rem] text-gray-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Fondamentaux
                    </Link>

                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-300 border border-blue-400/40 px-3 py-1.5 rounded-sm mb-6">
                        Finance PME · Les essentiels
                    </span>

                    <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-white mb-3">
                        Rentable sur le papier,<br />
                        <span className="text-blue-300">a decouvert en pratique.</span>
                    </h1>

                    <p className="text-[0.95rem] text-blue-200/90 mb-2">
                        BFR · DSO / DPO · Cash-flow vs Resultat · EBITDA
                    </p>

                    <p className="text-base text-gray-300 max-w-[640px] leading-relaxed font-light mt-6">
                        60 % des PME qui deposent le bilan etaient rentables quelques mois avant.
                        Pas de fraude. Pas de mauvaise gestion. Juste quatre concepts mal compris
                        qui, ensemble, expliquent presque toutes les crises de tresorerie.
                        <br /><br />
                        <span className="font-medium text-white">Cette page vous donne les quatre en 15 minutes.</span>
                    </p>

                    {/* Metrics bar */}
                    <div className="mt-10 space-y-3">
                        <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/10 rounded overflow-hidden">
                            {[
                                { value: '4', label: 'Concepts cles' },
                                { value: '15 min', label: 'Lecture totale' },
                                { value: '60 %', label: 'PME concernees' },
                                { value: '0', label: 'Jargon inutile' },
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

            {/* ─── ACCROCHE : LE PARADOXE ─── */}
            <section className="py-16 border-b border-gray-200 bg-red-50/30">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Le paradoxe que personne n&apos;explique
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Le scenario qui ruine des entreprises saines chaque annee.
                    </p>

                    <div className="bg-white border border-red-200/60 rounded p-6 space-y-5">
                        <p className="text-[0.9rem] text-gray-700 leading-relaxed">
                            Imaginez une PME de services. Chiffre d&apos;affaires en hausse de 30 % cette annee.
                            Marge nette positive. Comptable satisfait. Dirigeant confiant.
                        </p>
                        <p className="text-[0.9rem] text-gray-700 leading-relaxed">
                            En mars, elle ne peut plus payer ses charges sociales. En mai, la banque
                            refuse de renouveler la ligne de credit. En septembre, elle est en cessation
                            de paiement.
                        </p>
                        <div className="bg-slate-900 text-white rounded p-5">
                            <p className="text-[0.9rem] leading-relaxed">
                                <span className="font-semibold text-red-400">Ce n&apos;est pas une contradiction.</span>
                                <br />
                                C&apos;est la consequence directe de ne pas comprendre la difference entre
                                <span className="font-semibold text-white"> ce qu&apos;on gagne</span> et
                                <span className="font-semibold text-white"> ce qu&apos;on a en banque</span>.
                                Et les quatre concepts qui suivent expliquent exactement pourquoi ca arrive.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CONCEPT 1 : BFR ─── */}
            <section id="bfr" className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">

                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[0.6rem] font-semibold tracking-[0.12em] uppercase bg-blue-600 text-white px-2.5 py-1 rounded-sm">
                            Concept 01
                        </span>
                        <span className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Le socle de tout</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        BFR : le cash que votre activite immobilise chaque jour
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-blue-600" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Besoin en Fonds de Roulement. Pas un ratio. Un mecanisme de survie.
                    </p>

                    <div className="space-y-6">

                        {/* Definition simple */}
                        <div className="bg-white border border-gray-200 rounded p-6">
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                En une phrase
                            </h3>
                            <p className="text-[0.95rem] text-gray-800 leading-relaxed">
                                Le BFR, c&apos;est l&apos;argent que votre activite &quot;mange&quot; avant meme que vous ayez encaisse
                                vos ventes. Vous avez paye vos fournisseurs, stocke des marchandises,
                                livre un client qui ne vous a pas encore regle. Tout cet argent est bloque.
                                C&apos;est votre BFR.
                            </p>
                        </div>

                        {/* Formule */}
                        <div className="bg-slate-50 rounded p-5 border-l-2 border-blue-500">
                            <span className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 block mb-2">
                                Formule
                            </span>
                            <code className="text-[0.9rem] text-slate-800 font-mono">
                                BFR = Creances clients + Stocks - Dettes fournisseurs
                            </code>
                        </div>

                        {/* L'analogie */}
                        <div className="bg-white border border-gray-200 rounded p-6">
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                L&apos;analogie qui rend ca concret
                            </h3>
                            <p className="text-[0.85rem] text-gray-600 leading-relaxed mb-4">
                                Vous tenez une boulangerie. Chaque matin vous achetez de la farine (sortie de cash)
                                avant d&apos;avoir vendu une seule baguette (entree de cash). Entre l&apos;achat
                                et la vente, vous etes &quot;a decouvert&quot; sur ce cycle.
                                Multipliez ca par des centaines de cycles simultanes, avec des clients
                                qui vous paient a 45 jours, et vous comprenez le BFR.
                            </p>
                            <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                                Plus votre chiffre d&apos;affaires augmente, plus votre BFR augmente.
                                <span className="font-semibold text-gray-900"> La croissance consomme du cash.</span>
                                C&apos;est le piege que personne ne vous dit quand vous celebrez une annee record.
                            </p>
                        </div>

                        {/* Signaux */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 border border-emerald-200/60 rounded p-5">
                                <h4 className="text-[0.75rem] font-semibold uppercase tracking-wider text-emerald-700 mb-2">
                                    BFR faible ou negatif
                                </h4>
                                <p className="text-[0.8rem] text-gray-600 leading-snug">
                                    Vos clients paient vite, vos fournisseurs vous font credit.
                                    L&apos;activite finance elle-meme sa croissance.
                                    Modele type : grande distribution, SaaS a paiement mensuel.
                                </p>
                            </div>
                            <div className="bg-red-50 border border-red-200/60 rounded p-5">
                                <h4 className="text-[0.75rem] font-semibold uppercase tracking-wider text-red-700 mb-2">
                                    BFR eleve et croissant
                                </h4>
                                <p className="text-[0.8rem] text-gray-600 leading-snug">
                                    Chaque commande supplementaire cree un besoin de financement.
                                    Sans credit bancaire ou fonds propres suffisants,
                                    la croissance peut tuer l&apos;entreprise.
                                </p>
                            </div>
                        </div>

                        {/* CTA calculateur */}
                        <div className="flex items-center gap-3 pt-2">
                            <Link
                                href="/calculateurs/bfr"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[0.8rem] font-semibold rounded transition-all"
                            >
                                <Calculator className="w-3.5 h-3.5" />
                                Calculer mon BFR
                            </Link>
                            <span className="text-[0.75rem] text-gray-400">Gratuit, en 2 minutes</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CONCEPT 2 : DSO / DPO ─── */}
            <section id="dso-dpo" className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">

                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[0.6rem] font-semibold tracking-[0.12em] uppercase bg-amber-500 text-white px-2.5 py-1 rounded-sm">
                            Concept 02
                        </span>
                        <span className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Les deux leviers du BFR</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        DSO / DPO : vous financez peut-etre vos clients sans le savoir
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-amber-500" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Vos clients vous paient en 60 jours. Vous reglez vos fournisseurs en 30 jours.
                        Pendant 30 jours, c&apos;est vous qui portez le financement.
                    </p>

                    <div className="space-y-6">

                        {/* DSO */}
                        <div className="bg-white border border-gray-200 rounded p-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-[0.95rem] font-semibold text-gray-900">DSO - Days Sales Outstanding</h3>
                                    <p className="text-[0.8rem] text-gray-500">Delai moyen de paiement de vos clients</p>
                                </div>
                                <code className="text-[0.75rem] bg-slate-900 text-white px-3 py-1.5 rounded font-mono whitespace-nowrap flex-shrink-0">
                                    (Creances clients / CA) x 365
                                </code>
                            </div>
                            <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                                Un DSO de 60 signifie que vos clients mettent en moyenne 60 jours
                                a vous regler apres la facturation. Pendant ces 60 jours, vous avez
                                paye vos salaries, votre loyer, vos charges. L&apos;argent est sorti.
                                Il n&apos;est pas encore rentre.
                            </p>
                        </div>

                        {/* DPO */}
                        <div className="bg-white border border-gray-200 rounded p-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-[0.95rem] font-semibold text-gray-900">DPO - Days Payable Outstanding</h3>
                                    <p className="text-[0.8rem] text-gray-500">Delai moyen de paiement de vos fournisseurs</p>
                                </div>
                                <code className="text-[0.75rem] bg-slate-900 text-white px-3 py-1.5 rounded font-mono whitespace-nowrap flex-shrink-0">
                                    (Dettes fournisseurs / Achats) x 365
                                </code>
                            </div>
                            <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                                Un DPO de 30 signifie que vous reglez vos fournisseurs en 30 jours.
                                Si votre DSO est a 60 et votre DPO a 30, il y a un ecart de 30 jours
                                pendant lesquels c&apos;est votre tresorerie qui absorbe la difference.
                            </p>
                        </div>

                        {/* La regle d'or */}
                        <div className="bg-slate-900 text-white rounded p-6">
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                La regle d&apos;or
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4 text-center mb-4">
                                <div className="py-3 px-4 bg-white/5 rounded">
                                    <span className="block text-[0.65rem] text-gray-400 uppercase mb-1">Idealement</span>
                                    <span className="block text-base font-bold text-emerald-400">DSO &lt; DPO</span>
                                </div>
                                <div className="py-3 px-4 bg-white/5 rounded">
                                    <span className="block text-[0.65rem] text-gray-400 uppercase mb-1">Acceptable</span>
                                    <span className="block text-base font-bold text-amber-400">DSO = DPO</span>
                                </div>
                                <div className="py-3 px-4 bg-white/5 rounded">
                                    <span className="block text-[0.65rem] text-gray-400 uppercase mb-1">Danger</span>
                                    <span className="block text-base font-bold text-red-400">DSO &gt; DPO</span>
                                </div>
                            </div>
                            <p className="text-[0.8rem] text-gray-400 leading-relaxed">
                                Reduire le DSO de 10 jours sur un CA de 2 M€ libere environ 55 000 € de tresorerie
                                sans rien changer au niveau d&apos;activite. C&apos;est l&apos;un des leviers les plus
                                sous-exploites en PME.
                            </p>
                        </div>

                        {/* Benchmarks sectoriels */}
                        <div className="bg-white border border-gray-200 rounded p-6">
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                Benchmarks sectoriels indicatifs
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { secteur: 'Services B2B', dso: '45-60 j', dpo: '30-45 j', alerte: false },
                                    { secteur: 'BTP', dso: '60-90 j', dpo: '45-60 j', alerte: true },
                                    { secteur: 'Distribution', dso: '30-45 j', dpo: '60-90 j', alerte: false },
                                    { secteur: 'Industrie', dso: '50-70 j', dpo: '45-60 j', alerte: true },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-[0.82rem] text-gray-700 font-medium w-40">{row.secteur}</span>
                                        <span className="text-[0.78rem] text-gray-500 w-24">DSO : {row.dso}</span>
                                        <span className="text-[0.78rem] text-gray-500 w-24">DPO : {row.dpo}</span>
                                        {row.alerte && (
                                            <span className="text-[0.65rem] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                                                Vigilance
                                            </span>
                                        )}
                                        {!row.alerte && (
                                            <span className="text-[0.65rem] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                                                Correct
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Link
                                href="/calculateurs/dso"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[0.8rem] font-semibold rounded transition-all"
                            >
                                <Calculator className="w-3.5 h-3.5" />
                                Calculer mon DSO
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CONCEPT 3 : CASH-FLOW VS RESULTAT ─── */}
            <section id="cash-flow" className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">

                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[0.6rem] font-semibold tracking-[0.12em] uppercase bg-purple-600 text-white px-2.5 py-1 rounded-sm">
                            Concept 03
                        </span>
                        <span className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Le malentendu le plus dangereux</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Cash-flow vs Resultat : deux chiffres, deux realites
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-purple-600" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Le resultat net, c&apos;est ce que vous avez gagne. Le cash-flow, c&apos;est ce que vous avez en banque.
                        Ce n&apos;est pas la meme chose. Pas meme proche.
                    </p>

                    <div className="space-y-6">

                        {/* Tableau comparatif */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden">
                            <div className="grid grid-cols-2 divide-x divide-gray-200">
                                <div className="p-5 bg-slate-50">
                                    <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-500 mb-3">
                                        Resultat net
                                    </h3>
                                    <p className="text-[0.85rem] text-gray-700 leading-relaxed mb-3">
                                        Produits minus Charges sur une periode donnee.
                                        Calcule selon les regles comptables.
                                    </p>
                                    <ul className="space-y-1.5">
                                        {[
                                            'Inclut des produits pas encore encaisses',
                                            'Deduit des amortissements (pas de sortie cash)',
                                            'Peut etre positif meme sans cash disponible',
                                        ].map((item, i) => (
                                            <li key={i} className="text-[0.78rem] text-gray-500 pl-3 relative before:content-[\'o\'] before:absolute before:left-0 before:text-gray-300">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-500 mb-3">
                                        Cash-flow operationnel
                                    </h3>
                                    <p className="text-[0.85rem] text-gray-700 leading-relaxed mb-3">
                                        Les entrees et sorties reelles de tresorerie liees a l&apos;activite.
                                    </p>
                                    <ul className="space-y-1.5">
                                        {[
                                            'Seulement ce qui est reellement encaisse',
                                            'Tient compte du BFR et de sa variation',
                                            'C&apos;est ce que la banque voit sur votre compte',
                                        ].map((item, i) => (
                                            <li key={i} className="text-[0.78rem] text-gray-500 pl-3 relative before:content-[\'o\'] before:absolute before:left-0 before:text-gray-300">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Le scenario concret */}
                        <div className="bg-white border border-gray-200 rounded p-6">
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                Le scenario concret
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { poste: 'Resultat net comptable', valeur: '+120 000 €', type: 'positif' },
                                    { poste: 'Amortissements reintegres (non-cash)', valeur: '+30 000 €', type: 'neutre' },
                                    { poste: 'Variation BFR (croissance de 30 %)', valeur: '-180 000 €', type: 'negatif' },
                                    { poste: 'Cash-flow operationnel reel', valeur: '-30 000 €', type: 'alerte' },
                                ].map((row, i) => (
                                    <div key={i} className={`flex items-center justify-between py-2.5 px-4 rounded ${row.type === 'alerte' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                                        <span className={`text-[0.82rem] ${row.type === 'alerte' ? 'font-bold text-red-900' : 'text-gray-700'}`}>
                                            {row.poste}
                                        </span>
                                        <span className={`text-[0.82rem] font-mono font-semibold ${
                                            row.type === 'positif' ? 'text-emerald-700' :
                                            row.type === 'negatif' ? 'text-red-600' :
                                            row.type === 'alerte' ? 'text-red-700 font-bold' :
                                            'text-blue-700'
                                        }`}>
                                            {row.valeur}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Explication */}
                        <div className="bg-slate-900 text-white rounded p-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[0.9rem] font-semibold mb-2">
                                        Rentable a +120 K€. A decouvert en pratique.
                                    </p>
                                    <p className="text-[0.82rem] text-gray-400 leading-relaxed">
                                        La croissance a consomme 180 000 € de BFR supplementaire.
                                        Le resultat est beau sur le compte de resultats.
                                        Mais la tresorerie, elle, est negative.
                                        Ce dirigeant va recevoir une excellente liasse fiscale
                                        et un refus de decouvert le meme mois.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ─── CONCEPT 4 : EBITDA ─── */}
            <section id="ebitda" className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">

                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[0.6rem] font-semibold tracking-[0.12em] uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-sm">
                            Concept 04
                        </span>
                        <span className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Ce que banquiers et acheteurs regardent en premier</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        EBITDA : le seul chiffre que votre banquier regarde vraiment
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-emerald-600" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Earnings Before Interest, Taxes, Depreciation and Amortization.
                        Ou en francais : ce que l&apos;entreprise genere avant les choix financiers et fiscaux.
                    </p>

                    <div className="space-y-6">

                        {/* Pourquoi EBITDA plutot que resultat net */}
                        <div className="bg-white border border-gray-200 rounded p-6">
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                Pourquoi pas simplement le resultat net ?
                            </h3>
                            <p className="text-[0.85rem] text-gray-600 leading-relaxed mb-4">
                                Le resultat net varie selon la structure financiere de l&apos;entreprise :
                                est-elle endetee ou non, comment amortit-elle ses actifs, dans quel pays
                                paye-t-elle ses impots ? Deux entreprises identiques peuvent avoir des
                                resultats nets tres differents uniquement a cause de ces choix.
                            </p>
                            <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                                L&apos;EBITDA neutralise tout ca. Il mesure la performance brute
                                de l&apos;activite, independamment de la structure de financement.
                                C&apos;est pour ca que c&apos;est l&apos;indicateur universel de comparaison.
                            </p>
                        </div>

                        {/* Formule */}
                        <div className="bg-slate-50 rounded p-5 border-l-2 border-emerald-500">
                            <span className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 block mb-2">
                                Formule
                            </span>
                            <code className="text-[0.85rem] text-slate-800 font-mono block mb-2">
                                EBITDA = Resultat net + Impots + Interets + Amortissements
                            </code>
                            <code className="text-[0.85rem] text-slate-800 font-mono block">
                                ou plus simplement : Resultat d&apos;exploitation + Dotations aux amortissements
                            </code>
                        </div>

                        {/* Ce que ca change concrètement */}
                        <div className="bg-white border border-gray-200 rounded p-6">
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                Ce que ca change concretement pour vous
                            </h3>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <h4 className="text-[0.8rem] font-semibold text-slate-800 mb-2">Votre banquier</h4>
                                    <p className="text-[0.78rem] text-gray-500 leading-relaxed">
                                        Calcule votre capacite de remboursement en faisant
                                        <span className="font-semibold text-gray-700"> Dette nette / EBITDA</span>.
                                        Un ratio superieur a 3 et il s&apos;inquiete. Superieur a 5
                                        et le credit est refuse.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[0.8rem] font-semibold text-slate-800 mb-2">Un acheteur potentiel</h4>
                                    <p className="text-[0.78rem] text-gray-500 leading-relaxed">
                                        Valorise votre entreprise en multipliant l&apos;EBITDA par un
                                        coefficient sectoriel (en general entre 4 et 8 pour une PME).
                                        Un EBITDA de 500 K€ peut valoriser l&apos;entreprise entre
                                        2 M€ et 4 M€.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[0.8rem] font-semibold text-slate-800 mb-2">Vous, dirigeant</h4>
                                    <p className="text-[0.78rem] text-gray-500 leading-relaxed">
                                        Comparer votre EBITDA d&apos;annee en annee vous dit si votre
                                        activite progresse, independamment de vos choix de financement
                                        ou de politique d&apos;amortissement.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[0.8rem] font-semibold text-slate-800 mb-2">Votre comptable</h4>
                                    <p className="text-[0.78rem] text-gray-500 leading-relaxed">
                                        L&apos;utilise pour construire le plan de financement et
                                        demontrer la viabilite de l&apos;entreprise dans les
                                        dossiers bancaires et les levees de fonds.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Benchmarks */}
                        <div className="bg-slate-900 text-white rounded p-6">
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                Reperes par type d&apos;entreprise
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    { label: 'PME services', marge: '15-25 %', interpretation: 'Marge EBITDA / CA. Seuil minimum bancaire souvent a 10 %.' },
                                    { label: 'PME industrie', marge: '8-15 %', interpretation: 'Investissements eleves compriment la marge. L&apos;EBE compense.' },
                                    { label: 'Distribution', marge: '3-8 %', interpretation: 'Marges faibles, volumes eleves. Le ratio Dette/EBITDA est critique.' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 rounded p-4">
                                        <span className="block text-[0.65rem] text-gray-500 uppercase tracking-wider mb-1">{item.label}</span>
                                        <span className="block text-xl font-bold text-emerald-400 mb-2">{item.marge}</span>
                                        <p className="text-[0.72rem] text-gray-400 leading-snug"
                                           dangerouslySetInnerHTML={{ __html: item.interpretation }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Link
                                href="/calculateurs/ebitda"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[0.8rem] font-semibold rounded transition-all"
                            >
                                <Calculator className="w-3.5 h-3.5" />
                                Calculer mon EBITDA
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CE QUE CA CHANGE ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Ce que ca change de maitriser ces quatre concepts
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Pas des connaissances academiques. Des capacites concretes dans chaque conversation
                        avec votre banquier, votre comptable ou un acheteur potentiel.
                    </p>

                    <div className="grid md:grid-cols-2 gap-5 mb-10">
                        {[
                            {
                                situation: 'Avec votre banquier',
                                avant: 'Vous attendez qu&apos;il explique pourquoi il refuse ou reduit votre credit.',
                                apres: 'Vous arrivez avec votre ratio Dette/EBITDA calcule, votre plan de reduction du DSO, votre prevision de BFR sur 6 mois.',
                            },
                            {
                                situation: 'Avec votre comptable',
                                avant: 'Vous demandez &quot;c&apos;est bon cette annee ?&quot; en esperant une reponse rassurante.',
                                apres: 'Vous demandez &quot;quelle est la variation de mon BFR et comment mon cash-flow operationnel explique la tension de mars ?&quot;',
                            },
                            {
                                situation: 'En periode de croissance',
                                avant: 'Vous celebrez la hausse du CA sans anticiper les tensions de tresorerie qui suivent.',
                                apres: 'Vous calculez l&apos;impact du BFR avant d&apos;accepter un gros contrat et decidez si vous avez les fonds propres pour le porter.',
                            },
                            {
                                situation: 'En phase de cession',
                                avant: 'Vous decouvrez la valorisation le jour ou un acheteur vous la presente.',
                                apres: 'Vous comprenez sur quoi jouer (EBITDA, structure du bilan) pour maximiser la valeur 2 ans avant la cession.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded p-5 hover:border-slate-400 transition-colors">
                                <h3 className="text-[0.85rem] font-semibold text-slate-800 mb-3">{item.situation}</h3>
                                <div className="space-y-2">
                                    <p className="text-[0.78rem] text-red-700 bg-red-50 rounded px-3 py-2 leading-snug"
                                       dangerouslySetInnerHTML={{ __html: 'Avant : ' + item.avant }} />
                                    <p className="text-[0.78rem] text-emerald-800 bg-emerald-50 rounded px-3 py-2 leading-snug"
                                       dangerouslySetInnerHTML={{ __html: 'Apres : ' + item.apres }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recap des 4 */}
                    <div className="bg-white border border-gray-200 rounded overflow-hidden">
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-500">
                                Recap des 4 concepts
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {[
                                { sigle: 'BFR', nom: 'Besoin en Fonds de Roulement', formule: 'Creances + Stocks - Dettes fournisseurs', message: 'L&apos;argent immobilise par votre activite au quotidien', href: '#bfr' },
                                { sigle: 'DSO', nom: 'Delai de paiement clients', formule: '(Creances / CA) x 365', message: 'Combien de jours vos clients mettent a vous payer', href: '#dso-dpo' },
                                { sigle: 'DPO', nom: 'Delai de paiement fournisseurs', formule: '(Dettes fournisseurs / Achats) x 365', message: 'Combien de jours vous mettez a payer vos fournisseurs', href: '#dso-dpo' },
                                { sigle: 'EBITDA', nom: 'Resultat avant interets, impots, amortissements', formule: 'Resultat net + IS + Interets + Amortissements', message: 'La performance brute de l&apos;activite, comparable sectoriellement', href: '#ebitda' },
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-[60px_1fr_1fr] gap-3 items-center px-5 py-3.5 hover:bg-slate-50 transition-colors">
                                    <a href={row.href} className="text-[0.75rem] font-bold text-slate-700 hover:text-blue-600 transition-colors">{row.sigle}</a>
                                    <div>
                                        <p className="text-[0.78rem] text-gray-700 font-medium"
                                           dangerouslySetInnerHTML={{ __html: row.message }} />
                                        <code className="text-[0.65rem] text-gray-400 font-mono">{row.formule}</code>
                                    </div>
                                    <a href={row.href} className="text-[0.7rem] text-blue-600 hover:underline text-right">
                                        Voir le detail
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-20 bg-gray-50/60">
                <div className="max-w-[640px] mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Maitriser ces concepts, c&apos;est une chose.
                        Les piloter en est une autre.
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 leading-relaxed">
                        Si vous voulez voir vos propres BFR, DSO, EBITDA et cash-flow mis en
                        tableau de bord et interpretes, c&apos;est exactement ce que font les missions
                        de pilotage financier.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded transition-all"
                        >
                            <Calendar className="w-4 h-4" />
                            Prendre rendez-vous
                        </a>
                        <Link
                            href="/consulting"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 hover:border-slate-400 text-gray-900 font-semibold rounded transition-all"
                        >
                            Voir le consulting Finance
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <p className="text-xs text-gray-400">
                        Gratuit. Sans engagement. Reponse sous 24h.
                    </p>

                    {/* Liens vers les calculateurs */}
                    <div className="mt-10 pt-10 border-t border-gray-200">
                        <p className="text-[0.8rem] text-gray-500 mb-4">
                            Calculateurs gratuits disponibles
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {[
                                { label: 'Calculateur BFR', href: '/calculateurs/bfr' },
                                { label: 'Calculateur DSO', href: '/calculateurs/dso' },
                                { label: 'Calculateur EBITDA', href: '/calculateurs/ebitda' },
                                { label: 'Tous les calculateurs', href: '/calculateurs' },
                            ].map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-slate-400 text-gray-700 text-[0.78rem] font-medium rounded transition-all"
                                >
                                    <Calculator className="w-3 h-3" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Retour fondamentaux */}
                    <div className="mt-8">
                        <Link
                            href="/fondamentaux"
                            className="inline-flex items-center gap-2 text-[0.8rem] text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Retour aux fondamentaux
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

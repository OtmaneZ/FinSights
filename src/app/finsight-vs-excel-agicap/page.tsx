import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import {
    CheckCircle2,
    XCircle,
    MinusCircle,
    ArrowRight,
    Calendar,
    Zap,
    AlertTriangle,
    Brain,
    BarChart3,
    Users,
    Clock,
    TrendingUp,
    Shield,
    ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'FinSight vs Excel vs Agicap : Quel outil de pilotage pour votre PME ? | FinSight',
    description:
        'Comparatif honnête : Excel, Agicap/Fygr et FinSight. Forces, limites et profil idéal de chaque approche pour le pilotage financier PME 500k–5M€.',
    keywords: [
        'FinSight vs Excel',
        'FinSight vs Agicap',
        'alternative Agicap PME',
        'pilotage financier PME comparatif',
        'logiciel trésorerie PME',
        'Excel finance PME',
        'outil pilotage financier',
        'comparatif gestion trésorerie',
    ],
    openGraph: {
        title: 'FinSight vs Excel vs Agicap — Le comparatif honnête pour les PME',
        description:
            'Excel est gratuit mais chronophage. Agicap est puissant mais surdimensionné. FinSight est l\'entre-deux : outil + accompagnement + méthode.',
        type: 'article',
    },
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const FEATURES = [
    {
        category: 'Mise en place',
        rows: [
            {
                label: 'Délai pour avoir un premier tableau de bord',
                excel: { val: '2–10 jours', note: 'selon compétences' },
                agicap: { val: '24–48h', note: 'onboarding guidé' },
                finsight: { val: '5 jours', note: 'diagnostic livrable' },
            },
            {
                label: 'Nécessite des compétences techniques',
                excel: { val: 'Modéré', note: 'formules, TCD, macros' },
                agicap: { val: 'Faible', note: 'interface SaaS clé en main' },
                finsight: { val: 'Zéro', note: 'le consultant fait, vous lisez' },
            },
            {
                label: 'Connexion bancaire automatique',
                excel: 'none',
                agicap: 'yes',
                finsight: { val: 'Via FEC', note: 'export comptable universel' },
            },
        ],
    },
    {
        category: 'Pilotage trésorerie',
        rows: [
            {
                label: 'Prévisionnel 90 jours',
                excel: { val: 'Manuel', note: 'à reconstruire chaque mois' },
                agicap: 'yes',
                finsight: 'yes',
            },
            {
                label: 'Alertes automatiques sur seuils critiques',
                excel: 'none',
                agicap: 'yes',
                finsight: 'yes',
            },
            {
                label: 'Scénarios (recrutement, investissement…)',
                excel: { val: 'Oui', note: 'mais tout à la main' },
                agicap: 'yes',
                finsight: { val: 'Oui', note: 'modélisé avec vous' },
            },
        ],
    },
    {
        category: 'Analyse financière',
        rows: [
            {
                label: 'Score de santé financière 0–100',
                excel: 'none',
                agicap: 'none',
                finsight: 'yes',
            },
            {
                label: 'Benchmarks sectoriels (BdF)',
                excel: 'none',
                agicap: 'none',
                finsight: 'yes',
            },
            {
                label: 'Analyse BFR, DSO, DPO par client',
                excel: { val: 'Possible', note: 'si tout est configuré' },
                agicap: { val: 'DSO uniquement', note: 'module poste client' },
                finsight: 'yes',
            },
            {
                label: 'Diagnostic marges par activité',
                excel: { val: 'Oui', note: 'si données disponibles' },
                agicap: 'none',
                finsight: 'yes',
            },
        ],
    },
    {
        category: 'Accompagnement & compréhension',
        rows: [
            {
                label: 'Explication des chiffres en langage dirigeant',
                excel: 'none',
                agicap: 'none',
                finsight: 'yes',
            },
            {
                label: 'Plan d\'action priorisé et chiffré',
                excel: 'none',
                agicap: 'none',
                finsight: 'yes',
            },
            {
                label: 'Formation à la lecture des indicateurs',
                excel: 'none',
                agicap: { val: 'Docs + support', note: 'centre d\'aide et webinars' },
                finsight: { val: 'Inclus', note: 'session dirigeant dédiée' },
            },
            {
                label: 'Suivi mensuel post-mission',
                excel: 'none',
                agicap: 'none',
                finsight: { val: 'En option', note: '3 mois inclus dans l\'offre complète' },
            },
        ],
    },
    {
        category: 'Coût & modèle',
        rows: [
            {
                label: 'Coût de départ',
                excel: { val: '0€', note: 'hors temps passé' },
                agicap: { val: '~300–600€/mois', note: 'selon modules' },
                finsight: { val: '2 490€', note: 'diagnostic one-shot' },
            },
            {
                label: 'Temps dirigeant par mois',
                excel: { val: '8–16h', note: 'saisie, vérification, correction' },
                agicap: { val: '1–2h', note: 'supervision + analyse' },
                finsight: { val: '< 1h', note: 'lecture du dashboard livré' },
            },
            {
                label: 'Sans engagement',
                excel: 'yes',
                agicap: 'yes',
                finsight: 'yes',
            },
        ],
    },
]

const PROFILES = [
    {
        tool: 'Excel',
        icon: '📊',
        color: 'border-green-300 bg-green-50',
        headerColor: 'bg-green-100 text-green-800',
        ideal: [
            'TPE < 500k€ de CA, flux simples',
            'Dirigeant à l\'aise avec les formules',
            'Budget zéro — phase de démarrage',
            'Contrôleur de gestion dédié en interne',
        ],
        notIdeal: [
            'PME avec plusieurs flux croisés',
            'Décisions stratégiques mensuelles',
            'Dirigeant sans temps pour maintenir les fichiers',
        ],
    },
    {
        tool: 'Agicap / Fygr',
        icon: '🏦',
        color: 'border-blue-300 bg-blue-50',
        headerColor: 'bg-blue-100 text-blue-800',
        ideal: [
            'PME avec plusieurs comptes bancaires à consolider',
            'Équipe finance qui veut de l\'autonomie SaaS',
            'CA > 5M€, flux bancaires complexes',
            'Multi-entités ou groupe avec plusieurs sociétés',
        ],
        notIdeal: [
            'Dirigeant qui veut comprendre ses chiffres, pas juste les voir',
            'Besoin d\'analyse de marges ou de benchmarks',
            'PME sans DAF ni contrôleur de gestion interne',
        ],
    },
    {
        tool: 'FinSight',
        icon: '🎯',
        color: 'border-slate-900 bg-slate-900',
        headerColor: 'bg-slate-800 text-white',
        textColor: 'text-slate-200',
        ideal: [
            'PME 500k–5M€, dirigeant décideur non-financier',
            'Besoin de comprendre ET de piloter',
            'Aucun DAF interne — ou DAF surchargé',
            'Décisions clés imminentes : embauche, investissement, levée',
            'Excel qui ne scale plus, mais pas envie d\'un abonnement SaaS de plus',
        ],
        notIdeal: [
            'TPE < 500k€ (overkill)',
            'ETI avec équipe finance déjà structurée',
            'Besoin d\'un outil purement bancaire en temps réel',
        ],
    },
]

const FAQ = [
    {
        q: 'FinSight remplace-t-il Excel ?',
        a: 'Non, FinSight le complète ou s\'y substitue selon votre situation. Si vous avez un bon fichier Excel qui fonctionne, on peut construire dessus. Si votre Excel est devenu ingérable, on le remplace par un dashboard Power BI automatisé que vous n\'avez plus à maintenir.',
    },
    {
        q: 'Pourquoi ne pas simplement prendre Agicap ou Fygr ?',
        a: 'Agicap et Fygr sont d\'excellents outils SaaS pour la trésorerie bancaire en temps réel. Ce qu\'ils ne font pas : analyser vos marges, benchmarker vos ratios, vous expliquer ce que les chiffres signifient pour vos décisions, ni vous accompagner sur un plan d\'action. Si vous voulez un logiciel à piloter vous-même — prenez Fygr. Si vous voulez comprendre et être guidé — FinSight.',
    },
    {
        q: 'Est-ce que FinSight peut coexister avec mon abonnement Agicap ?',
        a: 'Oui, et c\'est même une combinaison efficace. Agicap gère le flux bancaire quotidien. FinSight apporte l\'analyse stratégique mensuelle : Score de santé, benchmarks sectoriels, diagnostic marges. Les deux se nourrissent mutuellement.',
    },
    {
        q: 'Quel est le vrai coût d\'Excel "gratuit" ?',
        a: 'Le fichier est gratuit. Le temps dirigeant ne l\'est pas. Une PME type passe 8 à 16 heures par mois à alimenter, vérifier et corriger ses tableaux Excel. À 150€/h de valeur temps dirigeant, c\'est 1 200 à 2 400€ par mois de coût caché — sans compter les décisions prises sur des données en retard d\'une semaine.',
    },
    {
        q: 'FinSight convient-il si j\'ai déjà un expert-comptable ?',
        a: 'Votre expert-comptable fait la comptabilité légale et les déclarations fiscales. FinSight fait le pilotage décisionnel : trésorerie prévisionnelle, analyse de rentabilité, benchmarks, Score de santé. Ce sont deux missions complémentaires — pas concurrentes. La plupart de nos clients gardent leur expert-comptable et utilisent FinSight pour décider.',
    },
]

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

type CellValue =
    | 'yes'
    | 'none'
    | 'partial'
    | { val: string; note?: string }

function Cell({ value, highlight = false }: { value: CellValue; highlight?: boolean }) {
    if (value === 'yes') {
        return (
            <td className={`px-4 py-3.5 text-center align-top ${highlight ? 'bg-slate-900/5' : ''}`}>
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mx-auto" />
            </td>
        )
    }
    if (value === 'none') {
        return (
            <td className={`px-4 py-3.5 text-center align-top ${highlight ? 'bg-slate-900/5' : ''}`}>
                <XCircle className="w-4.5 h-4.5 text-red-300 mx-auto" />
            </td>
        )
    }
    if (value === 'partial') {
        return (
            <td className={`px-4 py-3.5 text-center align-top ${highlight ? 'bg-slate-900/5' : ''}`}>
                <MinusCircle className="w-4.5 h-4.5 text-amber-400 mx-auto" />
            </td>
        )
    }
    return (
        <td className={`px-4 py-3.5 align-top ${highlight ? 'bg-slate-900/5' : ''}`}>
            <p className={`text-[0.8rem] font-semibold text-center ${highlight ? 'text-slate-900' : 'text-slate-700'}`}>
                {value.val}
            </p>
            {value.note && (
                <p className="text-[0.68rem] text-slate-400 text-center mt-0.5 leading-tight">{value.note}</p>
            )}
        </td>
    )
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function ComparatifPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Header />

            {/* ─── HERO ─── */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(49,130,206,0.15),_transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.08),_transparent_60%)]" />
                <div className="relative max-w-[900px] mx-auto px-6 pt-28 pb-18 lg:pt-36 lg:pb-24">

                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-purple-300 border border-purple-400/40 px-3 py-1.5 rounded-sm mb-6">
                        Comparatif honnete
                    </span>

                    <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.1] tracking-tight mb-5">
                        FinSight, Excel ou Agicap —
                        <br />
                        <span className="text-purple-300">lequel pour votre PME ?</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-[640px] mb-8">
                        Trois outils, trois vocations radicalement differentes. Pas de mauvaise reponse —
                        juste le mauvais choix au mauvais moment. Ce comparatif est volontairement honnete
                        sur les limites de FinSight autant que sur celles des autres.
                    </p>

                    {/* 3 pills */}
                    <div className="flex flex-wrap gap-3 mb-10 pb-10 border-b border-white/10">
                        {[
                            { label: 'Excel', tag: 'Gratuit & flexible', color: 'border-green-400/40 text-green-300' },
                            { label: 'Agicap / Fygr', tag: 'SaaS bancaire puissant', color: 'border-blue-400/40 text-blue-300' },
                            { label: 'FinSight', tag: 'Analyse + accompagnement', color: 'border-purple-400/40 text-purple-300' },
                        ].map((p) => (
                            <div key={p.label} className={`flex items-center gap-2.5 border ${p.color} px-4 py-2 rounded-full`}>
                                <span className={`text-[0.75rem] font-bold ${p.color.split(' ')[1]}`}>{p.label}</span>
                                <span className="text-[0.65rem] text-slate-400">{p.tag}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-[0.78rem] text-slate-500 italic">
                        Comparatif construit depuis l&rsquo;audit des sites agicap.com et fygr.io (mai 2026)
                        + retours terrain de dirigeants PME 500k–5M&euro;.
                    </p>
                </div>
            </section>

            {/* ─── ENCADRE POSITIONNEMENT ─── */}
            <section className="bg-slate-50 border-b border-slate-200">
                <div className="max-w-[900px] mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: BarChart3,
                                color: 'text-green-600',
                                bg: 'bg-green-50 border-green-200',
                                title: 'Excel',
                                pitch: 'L\'outil universel. Gratuit, infiniment flexible — mais vous êtes seul face aux formules, aux erreurs et à la maintenance.',
                                best: 'Ideal pour : TPE, démarrage, dirigeant technique',
                            },
                            {
                                icon: Zap,
                                color: 'text-blue-600',
                                bg: 'bg-blue-50 border-blue-200',
                                title: 'Agicap / Fygr',
                                pitch: 'Le SaaS trésorerie de référence. Connexion bancaire automatique, prévisionnel IA, scénarios. Pensé pour la gestion quotidienne des flux.',
                                best: 'Ideal pour : PME 5M€+, équipe finance, multi-banques',
                            },
                            {
                                icon: Brain,
                                color: 'text-purple-600',
                                bg: 'bg-purple-50 border-purple-200',
                                title: 'FinSight',
                                pitch: 'Outil + méthode + accompagnement. Vous ne pilotez pas juste la trésorerie — vous comprenez vos chiffres et vous savez quoi faire.',
                                best: 'Ideal pour : Dirigeant PME 500k–5M€ sans DAF interne',
                            },
                        ].map((item) => (
                            <div key={item.title} className={`p-5 rounded-xl border ${item.bg}`}>
                                <item.icon className={`w-5 h-5 ${item.color} mb-3`} />
                                <p className={`text-[0.9rem] font-bold ${item.color} mb-2`}>{item.title}</p>
                                <p className="text-[0.8rem] text-slate-600 leading-relaxed mb-3">{item.pitch}</p>
                                <p className={`text-[0.68rem] font-semibold uppercase tracking-wider ${item.color}`}>{item.best}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TABLEAU COMPARATIF ─── */}
            <section className="max-w-[900px] mx-auto px-6 py-16">
                <div className="mb-10">
                    <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-slate-500 mb-2">
                        Comparatif detaille
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900 pb-3 relative">
                        Fonctionnalite par fonctionnalite
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-sm text-slate-500 mt-4">
                        Legende :&nbsp;
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline -mt-0.5" /> Inclus&nbsp;&nbsp;
                        <XCircle className="w-3.5 h-3.5 text-red-300 inline -mt-0.5" /> Absent&nbsp;&nbsp;
                        <MinusCircle className="w-3.5 h-3.5 text-amber-400 inline -mt-0.5" /> Partiel
                    </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full text-sm border-collapse">
                        {/* Sticky header */}
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left px-4 py-4 bg-white text-[0.72rem] font-semibold uppercase tracking-wider text-slate-400 w-[40%]">
                                    Critere
                                </th>
                                <th className="px-4 py-4 bg-green-50 text-center text-[0.8rem] font-bold text-green-700 w-[20%]">
                                    📊 Excel
                                </th>
                                <th className="px-4 py-4 bg-blue-50 text-center text-[0.8rem] font-bold text-blue-700 w-[20%]">
                                    🏦 Agicap / Fygr
                                </th>
                                <th className="px-4 py-4 bg-slate-900 text-center text-[0.8rem] font-bold text-white w-[20%]">
                                    🎯 FinSight
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {FEATURES.map((section) => (
                                <>
                                    {/* Category header */}
                                    <tr key={`cat-${section.category}`} className="bg-slate-50 border-t border-b border-slate-200">
                                        <td colSpan={4} className="px-4 py-2.5">
                                            <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-slate-500">
                                                {section.category}
                                            </span>
                                        </td>
                                    </tr>
                                    {section.rows.map((row, ri) => (
                                        <tr
                                            key={`${section.category}-${ri}`}
                                            className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="px-4 py-3.5 text-[0.82rem] text-slate-700 align-top">
                                                {row.label}
                                            </td>
                                            <Cell value={row.excel as CellValue} />
                                            <Cell value={row.agicap as CellValue} />
                                            <Cell value={row.finsight as CellValue} highlight />
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ─── POUR QUI ─── */}
            <section className="bg-slate-50 border-y border-slate-200">
                <div className="max-w-[900px] mx-auto px-6 py-16">
                    <div className="mb-10">
                        <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-slate-500 mb-2">
                            Le bon outil pour le bon profil
                        </p>
                        <h2 className="text-2xl font-bold text-slate-900 pb-3 relative">
                            A qui s&rsquo;adresse vraiment chaque approche ?
                            <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {PROFILES.map((p) => (
                            <div
                                key={p.tool}
                                className={`rounded-xl border-2 overflow-hidden ${p.color}`}
                            >
                                <div className={`px-5 py-3.5 ${p.headerColor}`}>
                                    <p className="text-[0.85rem] font-bold">
                                        {p.icon} {p.tool}
                                    </p>
                                </div>
                                <div className="p-5">
                                    <p className={`text-[0.65rem] font-bold uppercase tracking-wider mb-2.5 ${p.textColor ?? 'text-emerald-700'}`}>
                                        Parfait si vous...
                                    </p>
                                    <ul className="space-y-2 mb-5">
                                        {p.ideal.map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${p.textColor ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                                <span className={`text-[0.78rem] leading-snug ${p.textColor ?? 'text-slate-700'}`}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className={`text-[0.65rem] font-bold uppercase tracking-wider mb-2.5 ${p.textColor ? 'text-red-400' : 'text-red-600'}`}>
                                        Moins adapte si...
                                    </p>
                                    <ul className="space-y-2">
                                        {p.notIdeal.map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <XCircle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${p.textColor ? 'text-red-400' : 'text-red-400'}`} />
                                                <span className={`text-[0.78rem] leading-snug ${p.textColor ?? 'text-slate-600'}`}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── VOCATION FINSIGHT ─── */}
            <section className="max-w-[900px] mx-auto px-6 py-16">
                <div className="mb-10">
                    <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-purple-600 mb-2">
                        La vocation FinSight
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900 pb-3 relative">
                        Ce que ni Excel ni Agicap ne font
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-sm text-slate-500 mt-4 max-w-[580px]">
                        Excel mesure. Agicap suit les flux. FinSight repond a la question que vous posez
                        vraiment : &laquo;&nbsp;Qu&rsquo;est-ce que ces chiffres signifient pour mes decisions ?&nbsp;&raquo;
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    {[
                        {
                            icon: TrendingUp,
                            title: 'Diagnostic 0–100 sur 4 piliers',
                            desc: 'Cash, Marge, Resilience, Risque. Chaque pilier est score et compare aux medianes sectorielles de la Banque de France. Vous savez ou vous en etes — pas juste vos chiffres bruts.',
                            badge: 'Score FinSight™',
                        },
                        {
                            icon: Shield,
                            title: 'Benchmarks sectoriels integres',
                            desc: 'Votre DSO a 52 jours est-il bon ou mauvais ? Depends du secteur. FinSight repond en contexte : mediane BTP, services, industrie, SaaS — automatiquement appliquee a votre situation.',
                            badge: 'Banque de France 2024',
                        },
                        {
                            icon: Users,
                            title: 'Langage dirigeant, pas jargon DAF',
                            desc: 'Un dashboard ne vaut rien si vous ne savez pas ce qu\'il dit. FinSight traduit chaque indicateur en decision concrete : "Votre BFR a augmente de 40k€ — voici pourquoi et quoi faire."',
                            badge: 'Pedagogie metier',
                        },
                        {
                            icon: Clock,
                            title: 'Plan d\'action, pas juste des graphiques',
                            desc: '3 leviers prioritaires, chiffres et priorises. Pas un rapport de 50 pages — une feuille de route actionnable en 30 minutes de restitution.',
                            badge: 'Livrable en 5 jours',
                        },
                    ].map((item) => (
                        <div key={item.title} className="p-6 border border-slate-200 rounded-xl hover:border-purple-200 hover:bg-purple-50/20 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-4.5 h-4.5 text-purple-700" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <h3 className="text-[0.9rem] font-semibold text-slate-900">{item.title}</h3>
                                    </div>
                                    <span className="inline-block text-[0.6rem] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded mb-2">
                                        {item.badge}
                                    </span>
                                    <p className="text-[0.8rem] text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Encadre honest */}
                <div className="mt-8 p-5 border border-amber-200 bg-amber-50 rounded-xl flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[0.85rem] font-semibold text-amber-900 mb-1">
                            Ce que FinSight ne fait pas
                        </p>
                        <p className="text-[0.78rem] text-amber-800 leading-relaxed">
                            FinSight n&rsquo;est pas un logiciel bancaire temps reel. Si votre besoin principal
                            est de surveiller vos soldes bancaires chaque matin et d&rsquo;automatiser les virements,
                            Agicap ou Fygr sont mieux adaptes. FinSight intervient sur la couche strategique :
                            comprendre, decider, piloter — pas sur le flux operationnel quotidien.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section className="bg-slate-50 border-y border-slate-200">
                <div className="max-w-[900px] mx-auto px-6 py-16">
                    <div className="mb-10">
                        <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-slate-500 mb-2">
                            Questions frequentes
                        </p>
                        <h2 className="text-2xl font-bold text-slate-900 pb-3 relative">
                            Les vraies questions que vous vous posez
                            <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {FAQ.map((item) => (
                            <details
                                key={item.q}
                                className="group border border-slate-200 rounded-xl bg-white overflow-hidden"
                            >
                                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                                    <h3 className="text-[0.9rem] font-semibold text-slate-900 pr-4">{item.q}</h3>
                                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-6 pb-5">
                                    <p className="text-[0.82rem] text-slate-600 leading-relaxed">{item.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── LIENS CONNEXES ─── */}
            <section className="max-w-[900px] mx-auto px-6 py-14">
                <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-slate-400 mb-6">
                    Pour aller plus loin
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { href: '/tresorerie-pme', label: 'Trésorerie PME : méthode complète', tag: 'Guide' },
                        { href: '/fondamentaux/diagnostic-pme', label: 'Diagnostic financier PME en 7 étapes', tag: 'Méthode' },
                        { href: '/mon-diagnostic', label: 'Score FinSight™ — 7 minutes', tag: 'Outil' },
                        { href: '/agents/tresoris', label: 'TRESORIS — surveillance cash IA', tag: 'Technologie' },
                        { href: '/consulting', label: 'Accompagnement pilotage financier', tag: 'Consulting' },
                        { href: '/tarifs', label: 'Tarifs FinSight', tag: 'Tarifs' },
                    ].map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="group flex items-start gap-3 p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/30 transition-all"
                        >
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 flex-shrink-0 mt-0.5 transition-colors" />
                            <div>
                                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 mb-1">{l.tag}</p>
                                <p className="text-[0.82rem] font-medium text-slate-800 group-hover:text-purple-700 leading-snug transition-colors">{l.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── CTA FINAL ─── */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-[900px] mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-purple-400 border border-purple-400/40 px-3 py-1.5 rounded-sm mb-5">
                                Prochaine etape
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Vous ne savez pas encore
                                ce qu&rsquo;il vous faut ?
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Le Score FinSight&trade; evalue votre pilotage actuel en 7 minutes.
                                A l&rsquo;issue, vous savez si Excel suffit, si un SaaS vous aidera,
                                ou si un accompagnement change vraiment la donne.
                            </p>
                            <p className="text-[0.78rem] text-slate-500 italic">
                                ⭐ 4.8/5 &middot; +10 dirigeants PME accompagnes &middot; Reponse sous 24h
                            </p>
                        </div>
                        <div className="space-y-3">
                            <Link
                                href="/mon-diagnostic"
                                className="flex items-center justify-between gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Zap className="w-5 h-5" />
                                    <div>
                                        <p className="text-[0.88rem] font-bold">Score FinSight™ gratuit</p>
                                        <p className="text-[0.72rem] text-purple-200">Diagnostic 0–100 en 7 minutes</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                            </Link>
                            <Link
                                href="/consulting"
                                className="flex items-center justify-between gap-3 px-6 py-4 bg-white/8 hover:bg-white/12 border border-white/15 text-white font-medium rounded-xl transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-slate-300" />
                                    <div>
                                        <p className="text-[0.88rem] font-semibold">Voir l&rsquo;accompagnement</p>
                                        <p className="text-[0.72rem] text-slate-400">Diagnostic 2 490€ · Mission complete 6 990€</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 flex-shrink-0 text-slate-400" />
                            </Link>
                            <Link
                                href="https://calendly.com/zineinsight/15min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-6 py-3.5 border border-white/15 hover:border-white/30 text-slate-300 hover:text-white text-sm rounded-xl transition-all"
                            >
                                <Calendar className="w-4 h-4" />
                                Echange 30 min — sans engagement
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

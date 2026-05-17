import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import {
    ArrowRight,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle2,
    BarChart3,
    Zap,
    Shield,
    Target,
    Calendar,
    FileText,
    Brain,
    ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'Trésorerie PME : Pilotage, Prévisionnel et Gestion du Cash | FinSight',
    description:
        'Méthode complète pour piloter la trésorerie de votre PME : prévisionnel 90 jours, BFR, méthode directe, alertes cash. Accompagnement + outils FinSight.',
    keywords: [
        'trésorerie PME',
        'gestion trésorerie PME',
        'prévisionnel trésorerie',
        'pilotage cash PME',
        'BFR trésorerie',
        'trésorerie 90 jours',
        'diagnostic trésorerie',
        'cash flow PME',
    ],
    openGraph: {
        title: 'Trésorerie PME — Pilotage, Prévisionnel & Gestion du Cash',
        description:
            'Passez d\'un tableur à un pilotage de trésorerie structuré. Méthode directe, prévisionnel 90 jours, Score FinSight. Pour les PME 500k–5M€.',
        type: 'article',
    },
}

const ALERTES = [
    {
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
        label: '60% des défaillances PME',
        desc: 'surviennent chez des entreprises rentables mais à court de liquidités. La trésorerie tue avant le résultat.',
    },
    {
        icon: Clock,
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        label: 'DSO moyen PME françaises',
        desc: '48 jours (BdF 2024). Chaque jour supplémentaire immobilise du cash dans vos créances clients.',
    },
    {
        icon: TrendingDown,
        color: 'text-orange-600',
        bg: 'bg-orange-50 border-orange-200',
        label: '1 dirigeant sur 3',
        desc: 'ne connaît pas sa position de trésorerie à 30 jours. Il réagit. Il n\'anticipe pas.',
    },
]

const PILLIERS = [
    {
        num: '01',
        title: 'Solde bancaire vs trésorerie réelle',
        desc: 'Le solde de votre compte bancaire n\'est pas votre trésorerie disponible. Il faut soustraire les chèques en transit, les prélèvements en attente et les décalages de valeur.',
        color: 'border-l-blue-500',
        badge: 'Fondamental',
        badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
        num: '02',
        title: 'Méthode directe vs méthode indirecte',
        desc: 'La méthode directe part des flux bancaires réels (encaissements/décaissements). Elle est plus précise à court terme. La méthode indirecte part du résultat net et retraite les flux non-cash.',
        color: 'border-l-purple-500',
        badge: 'Prévisionnel',
        badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
        num: '03',
        title: 'BFR et cycle d\'exploitation',
        desc: 'Le BFR (= Stocks + Créances clients – Dettes fournisseurs) est votre principal levier cash. Une PME qui réduit son DSO de 10 jours libère en moyenne 2-3% de son CA en trésorerie.',
        color: 'border-l-emerald-500',
        badge: 'Levier #1',
        badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
        num: '04',
        title: 'Prévisionnel 90 jours',
        desc: 'L\'horizon minimal pour anticiper un besoin de financement. En dessous de 90 jours, vous subissez. Au-delà de 12 mois, la précision chute. Le 90 jours est la zone de valeur.',
        color: 'border-l-amber-500',
        badge: 'Horizon clé',
        badgeColor: 'bg-amber-100 text-amber-700',
    },
]

const ETAPES_PREVISIONNEL = [
    {
        step: '1',
        title: 'Partir du solde bancaire consolidé',
        detail: 'Tous comptes confondus, à J-1. C\'est votre point de départ. Jamais le résultat comptable.',
    },
    {
        step: '2',
        title: 'Projeter les encaissements certains',
        detail: 'Factures clients émises non réglées + contrats récurrents + calendrier de paiement connu. Appliquez votre DSO réel.',
    },
    {
        step: '3',
        title: 'Projeter les décaissements certains',
        detail: 'Salaires (J+5 du mois), charges sociales (J+15), loyers, remboursements de dettes, TVA trimestrielle.',
    },
    {
        step: '4',
        title: 'Identifier les flux incertains',
        detail: 'Prospects en cours (pondérés par probabilité), investissements en discussion, opérations exceptionnelles.',
    },
    {
        step: '5',
        title: 'Calculer le solde bas prévisionnel',
        detail: 'Le point le plus bas de votre courbe de trésorerie sur 90 jours. C\'est le chiffre qui compte — pas la moyenne.',
    },
]

const OUTILS = [
    {
        icon: Brain,
        title: 'TRESORIS — Agent IA Trésorerie',
        desc: 'Surveillance automatisée de votre position cash à 90 jours. Alerte avant la rupture. Analyse des écarts au prévisionnel.',
        href: '/agents/tresoris',
        cta: 'Découvrir TRESORIS',
        color: 'bg-slate-900 text-white',
        ctaColor: 'text-blue-400 hover:text-blue-300',
    },
    {
        icon: BarChart3,
        title: 'Score FinSight™ — Pilier CASH',
        desc: 'Notez votre gestion de trésorerie de 0 à 100. Identifiez les failles et les leviers prioritaires en 7 minutes.',
        href: '/mon-diagnostic',
        cta: 'Lancer le diagnostic',
        color: 'bg-blue-50 border border-blue-200',
        ctaColor: 'text-blue-700 hover:text-blue-900',
    },
    {
        icon: Target,
        title: 'Calculateur BFR & DSO',
        desc: 'Calculez votre BFR actuel, simulez l\'impact d\'une réduction du DSO ou du DPO sur votre trésorerie nette.',
        href: '/calculateurs',
        cta: 'Calculer mon BFR',
        color: 'bg-emerald-50 border border-emerald-200',
        ctaColor: 'text-emerald-700 hover:text-emerald-900',
    },
]

const SIGNAUX_ALERTE = [
    { signal: 'Vous avez un bon mois de CA mais le compte bancaire baisse', cause: 'BFR en hausse — vos créances clients absorbent le cash avant qu\'il arrive.' },
    { signal: 'Vous repoussez les paiements fournisseurs chaque fin de mois', cause: 'Trésorerie structurellement insuffisante. Le DPO compense un DSO trop long.' },
    { signal: 'Vous découvrez les problèmes le jour J', cause: 'Absence de prévisionnel. Vous pilotez dans le rétroviseur.' },
    { signal: 'Votre banquier vous appelle en premier', cause: 'Votre solde est tombé sous un seuil. Vous n\'avez pas d\'alertes propres.' },
    { signal: 'Vous ne savez pas combien vous pourrez vous verser le mois prochain', cause: 'Confusion entre résultat comptable et trésorerie disponible.' },
]

const BENCHMARKS = [
    { label: 'Réserve minimum recommandée', value: '45–60 jours', note: 'de charges fixes. En dessous : zone de danger.', color: 'text-slate-900' },
    { label: 'DSO médiane PME services', value: '48 jours', note: 'BdF 2024. Objectif top quartile : < 35 jours.', color: 'text-slate-900' },
    { label: 'DSO médiane PME BTP', value: '62 jours', note: 'Avec acomptes et situations de travaux.', color: 'text-slate-900' },
    { label: 'DPO moyen (dettes fournisseurs)', value: '38 jours', note: 'Légalement plafonné à 60 jours (LME).', color: 'text-slate-900' },
    { label: 'Ratio tréso / CA annuel sain', value: '> 8%', note: 'En dessous, fragilité structurelle élevée.', color: 'text-slate-900' },
    { label: 'FCF positif (hors saisonnalité)', value: '2 trimestres', note: 'consécutifs = signal de solidité bancable.', color: 'text-slate-900' },
]

export default function TresoreriePmePage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Header />

            {/* ─── HERO ─── */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(49,130,206,0.18),_transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.08),_transparent_60%)]" />
                <div className="relative max-w-[860px] mx-auto px-6 pt-28 pb-18 lg:pt-36 lg:pb-24">

                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-emerald-300 border border-emerald-400/40 px-3 py-1.5 rounded-sm mb-6">
                        Tresorerie PME
                    </span>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.12] tracking-tight mb-5">
                        Votre PME est rentable.
                        <br />
                        <span className="text-emerald-400">Mais gere-t-elle son cash ?</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-[640px] mb-8">
                        60% des defaillances PME touchent des entreprises profitables. Le probleme n&rsquo;est pas le resultat
                        — c&rsquo;est le decalage entre encaissements et decaissements.
                        Voici comment le piloter.
                    </p>

                    {/* Metrics bar */}
                    <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10 pb-10 border-b border-white/10">
                        {[
                            { val: '90 jours', label: 'Horizon minimal' },
                            { val: 'Methode directe', label: 'Approche recommandee' },
                            { val: 'BFR + DSO + DPO', label: '3 leviers cles' },
                            { val: 'PME 500k–5M€', label: 'Public cible' },
                        ].map((m) => (
                            <div key={m.val}>
                                <span className="block text-[0.78rem] font-bold text-white tracking-wide">{m.val}</span>
                                <span className="text-[0.65rem] text-slate-400 uppercase tracking-widest">{m.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/mon-diagnostic"
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg hover:-translate-y-0.5"
                        >
                            Diagnostiquer mon cash <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/agents/tresoris"
                            className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl text-sm transition-all hover:bg-white/5"
                        >
                            Voir TRESORIS — Agent IA <Brain className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── 3 CHIFFRES CHOCS ─── */}
            <section className="bg-slate-50 border-b border-slate-200">
                <div className="max-w-[860px] mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-5">
                        {ALERTES.map((a) => (
                            <div key={a.label} className={`p-5 rounded-xl border ${a.bg}`}>
                                <a.icon className={`w-5 h-5 ${a.color} mb-3`} />
                                <p className={`text-[0.9rem] font-bold ${a.color} mb-1.5`}>{a.label}</p>
                                <p className="text-[0.8rem] text-gray-600 leading-relaxed">{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 4 PILLIERS A COMPRENDRE ─── */}
            <section className="max-w-[860px] mx-auto px-6 py-16">
                <div className="mb-10">
                    <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-600 mb-2">
                        Les fondamentaux
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900 pb-3 relative">
                        4 concepts que tout dirigeant PME doit maitriser sur sa tresorerie
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-sm text-slate-500 mt-4 max-w-[520px]">
                        Avant les outils, avant le prévisionnel — comprendre ces 4 mecanismes change la lecture que vous avez de votre compte bancaire.
                    </p>
                </div>
                <div className="space-y-5">
                    {PILLIERS.map((p) => (
                        <div key={p.num} className={`p-6 border border-slate-200 border-l-4 ${p.color} rounded-lg`}>
                            <div className="flex items-start gap-4">
                                <span className="text-[0.7rem] font-mono font-bold text-slate-400 mt-0.5 flex-shrink-0 w-6">{p.num}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-[0.95rem] font-semibold text-slate-900">{p.title}</h3>
                                        <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${p.badgeColor}`}>
                                            {p.badge}
                                        </span>
                                    </div>
                                    <p className="text-[0.82rem] text-slate-600 leading-relaxed">{p.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CONSTRUIRE LE PREVISIONNEL 90J ─── */}
            <section className="bg-slate-50 border-y border-slate-200">
                <div className="max-w-[860px] mx-auto px-6 py-16">
                    <div className="mb-10">
                        <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-emerald-600 mb-2">
                            Methode pas a pas
                        </p>
                        <h2 className="text-2xl font-bold text-slate-900 pb-3 relative">
                            Construire votre previsionnel de tresorerie 90 jours
                            <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                        </h2>
                        <p className="text-sm text-slate-500 mt-4 max-w-[560px]">
                            La methode directe en 5 etapes. Faisable sur Excel en 2 heures, automatisable avec TRESORIS.
                        </p>
                    </div>
                    <div className="space-y-4">
                        {ETAPES_PREVISIONNEL.map((e, i) => (
                            <div key={e.step} className="flex gap-5 items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                                    {e.step}
                                </div>
                                <div className={`flex-1 pb-4 ${i < ETAPES_PREVISIONNEL.length - 1 ? 'border-b border-slate-200' : ''}`}>
                                    <p className="text-[0.9rem] font-semibold text-slate-900 mb-1">{e.title}</p>
                                    <p className="text-[0.8rem] text-slate-600 leading-relaxed">{e.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Encadre cle */}
                    <div className="mt-8 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[0.85rem] font-semibold text-emerald-900 mb-1">
                                    Le chiffre qui compte : le solde bas, pas le solde moyen
                                </p>
                                <p className="text-[0.78rem] text-emerald-800 leading-relaxed">
                                    Sur 90 jours, identifiez le point le plus bas de votre courbe de tresorerie.
                                    C&rsquo;est a ce moment que vous pouvez etre en rupture. Si ce point est negatif
                                    ou inferieur a 30 jours de charges fixes, vous devez agir maintenant.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 5 SIGNAUX D'ALERTE ─── */}
            <section className="max-w-[860px] mx-auto px-6 py-16">
                <div className="mb-10">
                    <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-red-600 mb-2">
                        Autodiagnostic
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900 pb-3 relative">
                        5 signaux que votre tresorerie PME est en danger
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                </div>
                <div className="space-y-3">
                    {SIGNAUX_ALERTE.map((s, i) => (
                        <div key={i} className="flex gap-4 p-5 border border-slate-200 rounded-lg hover:border-red-200 hover:bg-red-50/30 transition-colors">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[0.88rem] font-semibold text-slate-900 mb-1">{s.signal}</p>
                                <p className="text-[0.78rem] text-slate-600">
                                    <span className="font-medium text-red-700">Cause probable : </span>
                                    {s.cause}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── BENCHMARKS ─── */}
            <section className="bg-slate-900 text-white">
                <div className="max-w-[860px] mx-auto px-6 py-16">
                    <div className="mb-10">
                        <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-slate-400 mb-2">
                            References sectorielles
                        </p>
                        <h2 className="text-2xl font-bold text-white pb-3 relative">
                            Benchmarks tresorerie PME — ou vous situez-vous ?
                            <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-white/40" />
                        </h2>
                        <p className="text-sm text-slate-400 mt-4">
                            Sources : Banque de France (2024), INSEE, BPI France, mediane entreprises 1–10M€.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {BENCHMARKS.map((b) => (
                            <div key={b.label} className="p-5 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-slate-400 mb-1">{b.label}</p>
                                <p className="text-2xl font-bold text-white mb-1">{b.value}</p>
                                <p className="text-[0.75rem] text-slate-400">{b.note}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-[0.72rem] text-slate-500 mt-6">
                        Votre Score FinSight™ compare automatiquement vos ratios a ces medianes sectorielles.
                    </p>
                </div>
            </section>

            {/* ─── OUTILS FINSIGHT ─── */}
            <section className="max-w-[860px] mx-auto px-6 py-16">
                <div className="mb-10">
                    <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-600 mb-2">
                        Outils FinSight
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900 pb-3 relative">
                        3 outils pour piloter votre tresorerie autrement
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-sm text-slate-500 mt-4 max-w-[540px]">
                        De l&rsquo;analyse au suivi automatise — chaque outil s&rsquo;adresse a une etape de votre maturite de pilotage.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                    {OUTILS.map((o) => (
                        <div key={o.title} className={`p-6 rounded-xl flex flex-col ${o.color}`}>
                            <o.icon className={`w-6 h-6 mb-4 ${o.color.includes('slate-900') ? 'text-blue-400' : 'text-slate-700'}`} />
                            <h3 className={`text-[0.88rem] font-bold mb-2 ${o.color.includes('slate-900') ? 'text-white' : 'text-slate-900'}`}>
                                {o.title}
                            </h3>
                            <p className={`text-[0.78rem] leading-relaxed flex-1 ${o.color.includes('slate-900') ? 'text-slate-400' : 'text-slate-600'}`}>
                                {o.desc}
                            </p>
                            <Link
                                href={o.href}
                                className={`inline-flex items-center gap-1.5 text-[0.8rem] font-semibold mt-4 transition-colors ${o.ctaColor}`}
                            >
                                {o.cta} <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── ACCOMPAGNEMENT ─── */}
            <section className="bg-slate-50 border-y border-slate-200">
                <div className="max-w-[860px] mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-2 gap-10 items-start">
                        <div>
                            <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-600 mb-2">
                                Accompagnement
                            </p>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                La tresorerie se pilote —
                                pas seulement se mesure
                            </h2>
                            <p className="text-[0.88rem] text-slate-600 leading-relaxed mb-6">
                                Un tableau de bord trésorerie sans interpretation reste un tableur. FinSight vous accompagne
                                sur les 3 phases qui font la difference : diagnostic de la situation actuelle, mise en place
                                du prévisionnel, puis pilotage mensuel avec alertes.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Analyse du BFR et identification des fuites de cash',
                                    'Construction du previsionnel 90 jours en methode directe',
                                    'Dashboard trésorerie automatise (Power BI ou Google Sheets)',
                                    'Formation du dirigeant a la lecture des indicateurs',
                                    'Alertes automatiques sur les seuils critiques',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-[0.82rem] text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/consulting"
                                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-all"
                            >
                                Voir l&rsquo;accompagnement <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 bg-white border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4.5 h-4.5 text-blue-700" />
                                    </div>
                                    <div>
                                        <p className="text-[0.85rem] font-semibold text-slate-900">Diagnostic FinSight</p>
                                        <p className="text-[0.7rem] text-slate-400">Livrable en 5 jours</p>
                                    </div>
                                </div>
                                <p className="text-[0.78rem] text-slate-600 leading-relaxed mb-3">
                                    Audit complet de votre situation trésorerie : BFR analyse, DSO reel, prévisionnel
                                    90 jours, 3 leviers prioritaires identifies et chiffres.
                                </p>
                                <p className="text-[0.82rem] font-bold text-slate-900">2 490€</p>
                            </div>

                            <div className="p-5 bg-white border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-4.5 h-4.5 text-emerald-700" />
                                    </div>
                                    <div>
                                        <p className="text-[0.85rem] font-semibold text-slate-900">Systeme de pilotage complet</p>
                                        <p className="text-[0.7rem] text-slate-400">Mission 3 semaines + suivi 3 mois</p>
                                    </div>
                                </div>
                                <p className="text-[0.78rem] text-slate-600 leading-relaxed mb-3">
                                    Diagnostic + dashboard tresorerie automatise + TRESORIS configure + formation
                                    equipe + 3 mois d&rsquo;accompagnement mensuel.
                                </p>
                                <p className="text-[0.82rem] font-bold text-slate-900">6 990€</p>
                            </div>

                            <div className="p-4 bg-slate-900 rounded-xl text-center">
                                <p className="text-[0.75rem] text-slate-400 mb-3">
                                    Echange confidentiel de 30 min — sans engagement
                                </p>
                                <Link
                                    href="https://calendly.com/zineinsight/15min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[0.82rem] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Planifier un echange
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── LIENS CONNEXES ─── */}
            <section className="max-w-[860px] mx-auto px-6 py-14">
                <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-slate-400 mb-6">
                    Pour aller plus loin
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { href: '/fondamentaux/diagnostic-pme', label: 'Diagnostic financier PME en 7 etapes', tag: 'Methode' },
                        { href: '/fondamentaux/les-4-essentiels', label: 'Les 4 indicateurs financiers essentiels', tag: 'Fondamentaux' },
                        { href: '/calculateurs', label: 'Calculateurs DSO, BFR, marge', tag: 'Outils gratuits' },
                        { href: '/agents/tresoris', label: 'TRESORIS — agent IA surveillance cash', tag: 'Technologie' },
                        { href: '/pilotage-financier-pme', label: 'Guide complet pilotage financier PME', tag: 'Guide' },
                        { href: '/blog', label: 'Articles trésorerie et finance PME', tag: 'Blog' },
                    ].map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="group flex items-start gap-3 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-all"
                        >
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5 transition-colors" />
                            <div>
                                <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-slate-400 mb-1">{l.tag}</p>
                                <p className="text-[0.82rem] font-medium text-slate-800 group-hover:text-blue-700 leading-snug transition-colors">{l.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── CTA FINAL ─── */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-[860px] mx-auto px-6 py-16 text-center">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-emerald-400 border border-emerald-400/40 px-3 py-1.5 rounded-sm mb-6">
                        Prochaine etape
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Ou en est votre tresorerie aujourd&rsquo;hui ?
                    </h2>
                    <p className="text-slate-400 max-w-[480px] mx-auto text-sm mb-10">
                        Le Score FinSight™ evalue votre pilier CASH en 7 minutes : BFR, DSO, reservoirs, prévisionnel.
                        Vous obtenez un score de 0 a 100 et vos 3 actions prioritaires.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/mon-diagnostic"
                            className="inline-flex items-center gap-2 px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            <Zap className="w-5 h-5" />
                            Evaluer mon cash — Score FinSight™
                        </Link>
                        <Link
                            href="https://calendly.com/zineinsight/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-7 py-4 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl text-sm transition-all hover:bg-white/5"
                        >
                            <Calendar className="w-4 h-4" />
                            Parler a un expert
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

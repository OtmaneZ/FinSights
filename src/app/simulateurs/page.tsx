import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Users, TrendingUp, Clock, Percent, Lock, CheckCircle2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Simulateurs Financiers pour Dirigeants PME 2026 | FinSight',
    description: 'Simulateurs interactifs pour dirigeants : coût réel d\'un salarié, trésorerie à 90 jours, impact DSO, dilution levée de fonds. Résultats en temps réel.',
    keywords: 'simulateur financier pme, simulateur salaire, simulateur trésorerie, simulateur dso, simulateur levée de fonds',
    openGraph: {
        title: 'Simulateurs Financiers pour Dirigeants PME 2026 | FinSight',
        description: 'Simulez vos décisions financières avant de les prendre : recrutement, trésorerie, DSO, levée de fonds.',
        type: 'website',
        url: 'https://finsight.zineinsight.com/simulateurs',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/simulateurs',
    },
}

const simulateurs = [
    {
        slug: 'cout-reel-salarie',
        icon: Users,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        badgeColor: 'bg-emerald-100 text-emerald-700',
        available: true,
        title: 'Coût réel d\'un salarié',
        description: 'Entrez un salaire brut, obtenez le coût employeur réel mois par mois — charges, mutuelle, prévoyance incluses.',
        tag: 'Recrutement',
        tagColor: 'bg-slate-100 text-slate-600',
        cta: 'Simuler maintenant',
    },
    {
        slug: null,
        icon: TrendingUp,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-50',
        badgeColor: 'bg-slate-100 text-slate-500',
        available: false,
        title: 'Trésorerie à 90 jours',
        description: 'Saisissez vos entrées et sorties, visualisez votre trésorerie projetée en temps réel sur 3 mois.',
        tag: 'Trésorerie',
        tagColor: 'bg-slate-100 text-slate-400',
        cta: 'Bientôt disponible',
    },
    {
        slug: null,
        icon: Clock,
        iconColor: 'text-orange-400',
        iconBg: 'bg-orange-50',
        badgeColor: 'bg-slate-100 text-slate-500',
        available: false,
        title: 'Impact DSO',
        description: 'Faites glisser votre DSO de 30 à 90 jours et voyez instantanément le cash libéré ou immobilisé.',
        tag: 'Recouvrement',
        tagColor: 'bg-slate-100 text-slate-400',
        cta: 'Bientôt disponible',
    },
    {
        slug: null,
        icon: Percent,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-50',
        badgeColor: 'bg-slate-100 text-slate-500',
        available: false,
        title: 'Dilution / Levée de fonds',
        description: 'Entrez votre valorisation et le montant levé, visualisez votre dilution et la valeur résiduelle.',
        tag: 'Levée de fonds',
        tagColor: 'bg-slate-100 text-slate-400',
        cta: 'Bientôt disponible',
    },
]

export default function SimulateursPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-6xl mx-auto px-6 py-16">

                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full px-4 py-2 mb-6">
                        <TrendingUp className="w-4 h-4 text-accent-primary" />
                        <span className="text-sm font-semibold text-accent-primary">Décisions éclairées</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
                        Simulez avant de décider
                    </h1>

                    <p className="text-xl text-secondary max-w-2xl mx-auto mb-8">
                        Des simulateurs interactifs pour mesurer l&apos;impact financier de vos décisions
                        avant de les prendre. En temps réel, sans inscription.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-tertiary">
                        {[
                            'Résultat instantané',
                            'Entièrement côté client',
                            'Gratuit et sans inscription',
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid des simulateurs */}
                <div className="grid md:grid-cols-2 gap-6 mb-20">
                    {simulateurs.map((sim) => {
                        const Icon = sim.icon
                        return (
                            <div
                                key={sim.title}
                                className={`surface rounded-2xl p-8 border transition-all duration-200 flex flex-col ${
                                    sim.available
                                        ? 'border-slate-200 hover:border-accent-primary/50 hover:shadow-lg'
                                        : 'border-slate-100 opacity-70'
                                }`}
                            >
                                {/* Header card */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className={`w-12 h-12 rounded-xl ${sim.iconBg} flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${sim.iconColor}`} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sim.tagColor}`}>
                                            {sim.tag}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sim.badgeColor}`}>
                                            {sim.available ? '● Disponible' : 'Bientôt disponible'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <h2 className="text-xl font-bold text-primary mb-2">{sim.title}</h2>
                                <p className="text-secondary text-sm leading-relaxed flex-1 mb-6">{sim.description}</p>

                                {/* CTA */}
                                {sim.available && sim.slug ? (
                                    <Link
                                        href={`/simulateurs/${sim.slug}`}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary text-slate-900 font-semibold rounded-xl hover:bg-accent-primary-hover transition-colors text-sm"
                                    >
                                        {sim.cta}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 font-semibold rounded-xl cursor-not-allowed text-sm"
                                    >
                                        <Lock className="w-4 h-4" />
                                        {sim.cta}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* CTA bas de page */}
                <div className="surface rounded-2xl p-10 border border-slate-200 text-center">
                    <h2 className="text-2xl font-bold text-primary mb-3">
                        Un simulateur ne remplace pas un regard expert
                    </h2>
                    <p className="text-secondary mb-8 max-w-xl mx-auto">
                        Ces outils donnent un ordre de grandeur. Pour une analyse précise de votre situation
                        financière — recrutement, trésorerie, financement — échangeons 30 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/consulting"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-slate-900 font-semibold rounded-xl hover:bg-accent-primary-hover transition-colors"
                        >
                            Parler à un architecte de pilotage financier
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/calculateurs"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-200 text-primary font-semibold rounded-xl hover:border-accent-primary/50 transition-colors"
                        >
                            Voir les calculateurs
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Zap, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, Target, BarChart3, Shield } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Pourquoi votre Dashboard Financier est mort (et ce qui le remplace en 2026) | FinSight',
    description: 'Le Dashboard affiche le passé. Les Agents IA prédisent l\'avenir. Découvrez comment DASHIS, TRESORIS, MARGIS et SCENARIS automatisent le pilotage financier 24/7 pour les PME.',
    keywords: 'agent ia finance, automatisation trésorerie, dashboard financier pme, ia finance 2026, tresoris, dashis, pilotage automatique pme',
    openGraph: {
        title: 'Pourquoi votre Dashboard Financier est mort en 2026',
        description: 'Dashboard vs Agent IA : La révolution du pilotage financier automatique pour PME',
        type: 'article',
        publishedTime: '2026-02-09T09:00:00Z',
        url: 'https://finsight.zineinsight.com/blog/dashboard-financier-mort-agents-ia-2026'
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/blog/dashboard-financier-mort-agents-ia-2026'
    }
}

export default function ArticlePage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <article className="max-w-4xl mx-auto px-6 py-24">
                {/* Back button */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-secondary hover:text-accent-primary transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux articles
                </Link>

                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                            Intelligence Artificielle
                        </span>
                        <span className="text-sm text-tertiary flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            9 février 2026
                        </span>
                        <span className="text-sm text-tertiary flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            8 min de lecture
                        </span>
                    </div>

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Pourquoi votre Dashboard Financier est mort (et ce qui le remplace en 2026)
                    </h1>

                    <p className="text-xl text-secondary leading-relaxed">
                        La plupart des dirigeants reçoivent leur reporting le 15 du mois. <strong>C&apos;est trop tard.</strong> 
                        C&apos;est comme conduire une voiture en regardant uniquement dans le rétroviseur. 
                        Bienvenue dans l&apos;ère de la prédiction : les Agents IA financiers.
                    </p>
                </header>

                {/* Introduction */}
                <div className="prose prose-lg max-w-none mb-12">
                    <div className="bg-slate-50 border-l-4 border-accent-primary p-6 rounded-r-xl mb-8">
                        <p className="text-lg font-semibold text-slate-900 mb-2">
                            ⚡ Le constat brutal
                        </p>
                        <p className="text-slate-700 mb-0">
                            L&apos;ère du <strong>&quot;Constat&quot;</strong> est finie. Bienvenue dans l&apos;ère de la <strong>&quot;Prédiction&quot;</strong>. 
                            Les Agents IA ne vous montrent plus ce qui s&apos;est passé hier. Ils vous disent ce qui va se passer dans 8 semaines 
                            et proposent des actions correctives <em>avant</em> que le problème n&apos;arrive.
                        </p>
                    </div>
                </div>

                {/* Section 1 */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Zap className="w-8 h-8 text-accent-primary" />
                        La différence fondamentale entre un Dashboard et un Agent IA
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Dashboard Passif */}
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-red-900 mb-4">
                                📊 Le Dashboard (Passif)
                            </h3>
                            <ul className="space-y-2 text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">❌</span>
                                    <span>Il <strong>attend</strong> que vous veniez le voir</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">❌</span>
                                    <span>Il affiche des <strong>courbes</strong> (passé)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">❌</span>
                                    <span>Il demande à être <strong>interprété</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">❌</span>
                                    <span>Il ne travaille <strong>que si vous l&apos;ouvrez</strong></span>
                                </li>
                            </ul>
                        </div>

                        {/* Agent IA Actif */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-green-900 mb-4">
                                🤖 L&apos;Agent IA (Actif)
                            </h3>
                            <ul className="space-y-2 text-slate-700">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Il travaille <strong>sans vous</strong> (24/7)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Il <strong>pousse</strong> l&apos;information critique</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Il <strong>interprète</strong> les données pour vous</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Il <strong>propose des actions</strong> correctives</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-accent-primary-light border-l-4 border-accent-primary p-6 rounded-r-xl">
                        <p className="text-lg font-semibold mb-2">💡 Exemple concret FinSight</p>
                        <p className="mb-0">
                            Là où un <strong>Excel</strong> vous montre votre solde bancaire, l&apos;agent <strong>TRESORIS</strong> détecte 
                            un risque de trésorerie à 8 semaines et propose une action corrective immédiate 
                            (ex: relance automatique des 3 clients qui pèsent 42% de votre DSO).
                        </p>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Target className="w-8 h-8 text-accent-primary" />
                        3 Cas concrets où l&apos;IA sauve votre marge (que Excel ne voit pas)
                    </h2>

                    {/* Cas 1 - TRESORIS */}
                    <div className="mb-8 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">
                                    1. La surveillance de trésorerie (Agent TRESORIS)
                                </h3>
                                <span className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                                    Prévention cash-flow
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-red-600 mb-2">❌ Problème classique :</p>
                                <p className="text-slate-700">
                                    Un &quot;mur de cash&quot; imprévu à cause d&apos;un décalage TVA + retard client. 
                                    Vous découvrez la situation le 15 du mois, alors qu&apos;il fallait agir 3 semaines avant.
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-green-600 mb-2">✅ Solution avec TRESORIS :</p>
                                <p className="text-slate-700 mb-3">
                                    TRESORIS analyse <strong>26 situations de risque</strong> en continu et trie les menaces par criticité 
                                    (Certain / Incertain / Critique). Il vous prévient <strong>8 semaines à l&apos;avance</strong> et suggère :
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                                    <li>Relancer les 3 clients à fort impact DSO</li>
                                    <li>Décaler le paiement du fournisseur X de 15 jours</li>
                                    <li>Activer une ligne de crédit court terme</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    <strong>Cas client réel :</strong> PME industrielle (22M€ CA) a évité une rupture de trésorerie de 380K€ 
                                    grâce à l&apos;alerte TRESORIS détectée 6 semaines avant l&apos;échéance.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/calculateurs/dso"
                            className="inline-flex items-center gap-2 mt-6 text-accent-primary hover:text-accent-primary-hover font-semibold"
                        >
                            → Avant d&apos;automatiser, calculez votre DSO gratuitement
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Cas 2 - MARGIS */}
                    <div className="mb-8 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <BarChart3 className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">
                                    2. La rentabilité réelle (Agent MARGIS)
                                </h3>
                                <span className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                                    Détection produits toxiques
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-red-600 mb-2">❌ Problème classique :</p>
                                <p className="text-slate-700">
                                    Vous pensez être rentable globalement, mais <strong>certains produits détruisent de la valeur</strong>. 
                                    Le volume masque la marge faible, et vous perdez de l&apos;argent sans le savoir.
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-green-600 mb-2">✅ Solution avec MARGIS :</p>
                                <p className="text-slate-700 mb-3">
                                    MARGIS identifie les <strong>&quot;produits toxiques&quot;</strong> en analysant :
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                                    <li>Marge brute réelle (coûts directs + indirects)</li>
                                    <li>Temps de cycle de production caché</li>
                                    <li>Coût d&apos;acquisition client par segment</li>
                                </ul>
                                <p className="text-slate-700 mt-3">
                                    Il suggère des <strong>hausses de prix ciblées</strong> (+12-18%) ou des arrêts de commercialisation 
                                    pour protéger votre cash.
                                </p>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-lg">
                                <p className="text-sm text-orange-900">
                                    <strong>Cas client réel :</strong> Scale-up SaaS (8M€ ARR) a stoppé 2 offres &quot;entrée de gamme&quot; 
                                    après détection MARGIS : marge de -8% masquée par le volume. +420K€ de cash libéré en 6 mois.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/calculateurs/marge"
                            className="inline-flex items-center gap-2 mt-6 text-accent-primary hover:text-accent-primary-hover font-semibold"
                        >
                            → Calculez vos marges produits gratuitement
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Cas 3 - SCENARIS */}
                    <div className="mb-8 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">
                                    3. La simulation stratégique (Agent SCENARIS)
                                </h3>
                                <span className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                                    Pilotage prédictif
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-red-600 mb-2">❌ Problème classique :</p>
                                <p className="text-slate-700">
                                    &quot;Dois-je recruter 2 ou 3 commerciaux ?&quot; Décision prise au <strong>feeling</strong> 
                                    ou sur un Excel statique qui ne simule pas les effets de bord (charges sociales, délai de montée en compétence, etc.).
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-green-600 mb-2">✅ Solution avec SCENARIS :</p>
                                <p className="text-slate-700 mb-3">
                                    SCENARIS génère <strong>3 scénarios</strong> (Optimiste / Réaliste / Pessimiste) et calcule :
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                                    <li>Impact sur votre <strong>Runway</strong> (durée de vie financière) à 12 mois</li>
                                    <li>Point mort du recrutement (combien de temps avant ROI positif)</li>
                                    <li>Effet domino sur BFR et trésorerie</li>
                                </ul>
                                <p className="text-slate-700 mt-3">
                                    Vous prenez la décision avec <strong>3 mois d&apos;avance</strong>, pas au dernier moment.
                                </p>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm text-purple-900">
                                    <strong>Cas client réel :</strong> PME BTP (12M€ CA) a simulé l&apos;ouverture d&apos;une 2e agence 
                                    avec SCENARIS : scénario pessimiste révélait un besoin de 280K€ de tréso supplémentaire. 
                                    Décision reportée de 6 mois pour sécuriser le cash.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/calculateurs/roi"
                            className="inline-flex items-center gap-2 mt-6 text-accent-primary hover:text-accent-primary-hover font-semibold"
                        >
                            → Calculez le ROI de vos projets stratégiques
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>

                {/* Section 3 - Sécurité */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-accent-primary" />
                        Est-ce fiable ? La question de la sécurité et des données
                    </h2>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                        <p className="text-lg text-slate-700 mb-6">
                            C&apos;est <strong>le frein n°1</strong> quand on parle d&apos;IA en finance. Voici comment FinSight garantit la fiabilité :
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Connexion aux données comptables réelles</h4>
                                    <p className="text-slate-700">
                                        <strong>DASHIS</strong> (l&apos;agent Dashboard) se connecte à vos logiciels comptables 
                                        (QuickBooks, Pennylane, Sage, etc.) pour calculer des KPIs <strong>certifiés</strong> en temps réel. 
                                        Pas de saisie manuelle = zéro erreur de formule.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Sécurité RGPD et conformité bancaire</h4>
                                    <p className="text-slate-700">
                                        Toutes les données transitent par des <strong>API sécurisées</strong> (niveau bancaire). 
                                        Vos données restent <strong>chiffrées</strong> et hébergées en Europe (OVH France).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">L&apos;IA augmente le DAF, elle ne le remplace pas</h4>
                                    <p className="text-slate-700">
                                        Les agents automatisent les tâches <strong>chronophages</strong> (consolidation, analyse de variance, relances) 
                                        pour permettre au DAF de se concentrer sur la <strong>prise de décision stratégique</strong> et le pilotage de la performance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4 - ROI */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-accent-primary" />
                        Combien coûte l&apos;aveuglement ?
                    </h2>

                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-6">
                        <p className="text-lg font-semibold text-red-900 mb-2">
                            Le coût d&apos;une mauvaise décision financière
                        </p>
                        <p className="text-red-800 mb-0">
                            Une <strong>rupture de trésorerie</strong> vous coûte entre 50K€ et 200K€ (découvert bancaire, perte de confiance investisseurs). 
                            Un <strong>recrutement raté</strong> coûte 2x le salaire annuel en moyenne. 
                            Un <strong>produit non rentable</strong> détruit silencieusement 15-25% de votre marge.
                        </p>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl mb-6">
                        <p className="text-lg font-semibold text-green-900 mb-2">
                            Le ROI d&apos;un système de pilotage automatique
                        </p>
                        <p className="text-green-800 mb-0">
                            Le <strong>Pack 4 Agents FinSight</strong> offre une vision 360° (Cash + Rentabilité + Stratégie) clé en main. 
                            Nos clients économisent en moyenne <strong>15h/mois de reporting</strong> et évitent <strong>1 à 2 crises de tréso par an</strong>.
                        </p>
                    </div>

                    <div className="bg-slate-100 p-6 rounded-xl">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-3xl font-bold text-accent-primary mb-1">24/7</p>
                                <p className="text-sm text-slate-600">Surveillance automatique</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-accent-primary mb-1">8 sem</p>
                                <p className="text-sm text-slate-600">Prédiction cash-flow</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-accent-primary mb-1">15h/mois</p>
                                <p className="text-sm text-slate-600">Temps économisé</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conclusion & CTA */}
                <section className="mb-16">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-10 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ne pilotez plus votre PME avec des outils des années 2000
                        </h2>
                        <p className="text-xl text-slate-300 mb-8">
                            Passez au pilotage augmenté. Découvrez ce que nos 4 Agents IA peuvent révéler sur vos données.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/agents"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all shadow-lg"
                            >
                                Découvrir le Pack 4 Agents
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <Link
                                href="/consulting"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                            >
                                Commencer par un audit gratuit
                            </Link>
                        </div>

                        <p className="text-sm text-slate-400 mt-6">
                            🚀 Déploiement en 2 semaines • Formation incluse • Support DAF dédié
                        </p>
                    </div>
                </section>

                {/* Navigation */}
                <div className="border-t border-slate-200 pt-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-primary-hover font-semibold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voir tous les articles
                    </Link>
                </div>
            </article>

            <Footer />
        </div>
    )
}

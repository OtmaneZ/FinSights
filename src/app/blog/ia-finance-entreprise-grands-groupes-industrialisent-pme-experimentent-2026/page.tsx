import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, ArrowRight, TrendingUp, Brain, BarChart3, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: "L'IA en Finance d'entreprise : les grands groupes industrialisent, les PME expérimentent | FinSight",
    description: "Seulement 10% des cas d'usage financiers sont réellement déployés en France. Ce que font les grands groupes que les PME ne font pas encore — et les 3 cas d'usage accessibles dès maintenant.",
    openGraph: {
        title: "L'IA en Finance d'entreprise : les grands groupes industrialisent, les PME expérimentent. Et toi, tu en es où ?",
        description: "Seulement 10% des cas d'usage strictement financiers sont déployés dans les entreprises françaises. La méthode, pas le budget, fait la différence.",
        type: 'article',
        publishedTime: '2026-05-13T09:00:00Z'
    }
}

export default function ArticlePage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <article className="max-w-4xl mx-auto px-6 py-24">
                {/* Retour */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-secondary hover:text-accent-primary transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux articles
                </Link>

                {/* En-tête */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                            Intelligence Artificielle
                        </span>
                        <span className="text-sm text-tertiary flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            13 mai 2026
                        </span>
                        <span className="text-sm text-tertiary flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            6 min de lecture
                        </span>
                    </div>

                    {/* Signature auteur */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <Image
                            src="/images/Photo_profil.jpeg"
                            alt="Otmane Boulahia - Consultant Finance & DAF Externalisé"
                            width={64}
                            height={64}
                            className="rounded-full object-cover"
                        />
                        <div>
                            <p className="font-bold text-slate-900 text-lg">Par Otmane Boulahia</p>
                            <p className="text-sm text-slate-600">Consultant Finance & Data | DAF Externalisé</p>
                            <Link
                                href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                                target="_blank"
                                className="text-sm text-accent-primary hover:text-accent-primary-hover inline-flex items-center gap-1 mt-1"
                            >
                                Voir mon profil LinkedIn →
                            </Link>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                        L&apos;IA en Finance d&apos;entreprise : les grands groupes industrialisent, les PME expérimentent. Et toi, tu en es où&nbsp;?
                    </h1>

                    <p className="text-xl text-secondary leading-relaxed">
                        Il y a un chiffre qui devrait interpeller tout dirigeant de PME en ce moment. Selon l&apos;étude KPMG Trends of AI 2026 menée auprès de 356 décideurs français, seulement <strong>10&nbsp;% des cas d&apos;usage strictement financiers</strong> sont aujourd&apos;hui réellement déployés dans les entreprises françaises. Pas en test, pas en réflexion. Déployés.
                    </p>
                </header>

                {/* Chiffre clé */}
                <div className="surface rounded-xl p-6 border-l-4 border-blue-500 mb-12 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <p className="text-secondary leading-relaxed">
                        <strong className="text-primary">La fonction Finance est la dernière à intégrer concrètement l&apos;IA dans ses processus.</strong>{' '}
                        Derrière le marketing, les RH, et même la relation client. Ce n&apos;est pas une question de volonté. C&apos;est une question de structure.
                    </p>
                </div>

                <div className="prose prose-lg max-w-none">

                    {/* Section 1 */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
                        Ce que font les grands groupes que les PME ne font pas encore
                    </h2>

                    <p>
                        Toujours selon KPMG, <strong>60&nbsp;% des grandes organisations françaises ont déployé un dispositif de pilotage transverse pour industrialiser l&apos;IA en 2026</strong>. Elles ne laissent plus les équipes utiliser ChatGPT dans leur coin. Elles ont défini des cas d&apos;usage prioritaires, connecté les outils aux données réelles de l&apos;entreprise, et mis en place une gouvernance. 86&nbsp;% d&apos;entre elles ont même validé une charte d&apos;usage responsable, portée par le COMEX.
                    </p>

                    <p>
                        Le résultat concret : deux tiers de ces organisations savent désormais mesurer le retour sur investissement de leurs projets IA, contre seulement un tiers en 2025.
                    </p>

                    <div className="not-prose grid sm:grid-cols-2 gap-6 my-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <BarChart3 className="w-5 h-5 text-blue-700" />
                                <p className="font-bold text-blue-900 text-sm uppercase tracking-wider">Grands groupes</p>
                            </div>
                            <p className="text-3xl font-bold text-blue-900 mb-1">60&nbsp;%</p>
                            <p className="text-sm text-slate-600">ont un dispositif de pilotage transverse IA déployé en 2026</p>
                            <p className="text-xs text-slate-400 mt-3">Source : KPMG Trends of AI 2026, 356 décideurs français</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Brain className="w-5 h-5 text-orange-700" />
                                <p className="font-bold text-orange-900 text-sm uppercase tracking-wider">PME & ETI</p>
                            </div>
                            <p className="text-3xl font-bold text-orange-900 mb-1">57&nbsp;%</p>
                            <p className="text-sm text-slate-600">n&apos;ont défini aucune stratégie IA formalisée</p>
                            <p className="text-xs text-slate-400 mt-3">Source : BPI France, 1 200 dirigeants PME et ETI</p>
                        </div>
                    </div>

                    <p>
                        Côté PME, le tableau est différent. L&apos;étude BPI France menée auprès de 1&nbsp;200 dirigeants de PME et ETI révèle que 57&nbsp;% d&apos;entre eux n&apos;ont défini aucune stratégie IA formalisée. Et parmi ceux qui utilisent des outils IA, la moitié s&apos;arrête aux outils gratuits, sans intégration dans les processus, sans mesure, sans données métier connectées. C&apos;est de l&apos;expérimentation individuelle, pas de la transformation.
                    </p>

                    <div className="bg-slate-900 rounded-xl p-6 my-8">
                        <p className="text-white text-lg font-medium leading-relaxed">
                            &ldquo; La différence entre les deux n&apos;est pas le budget. C&apos;est la méthode. &rdquo;
                        </p>
                    </div>

                    {/* Section 2 */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
                        Les 3 cas d&apos;usage Finance accessibles dès maintenant pour une PME
                    </h2>

                    <div className="not-prose space-y-6 my-6">
                        <div className="flex items-start gap-5 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-accent-primary text-white font-bold flex items-center justify-center flex-shrink-0 text-lg">1</div>
                            <div>
                                <p className="font-bold text-slate-900 text-base mb-1">La détection d&apos;anomalies sur les données financières</p>
                                <p className="text-sm text-slate-600">
                                    Identifier automatiquement une facture atypique, un poste de charges qui dérive, une variation de marge inexpliquée. L&apos;étude KPMG indique que <strong>21&nbsp;% des grandes entreprises l&apos;ont déjà déployé</strong> dans leur fonction Finance. Pour une PME avec des données propres, c&apos;est un projet de quelques semaines, pas de plusieurs mois.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-accent-primary text-white font-bold flex items-center justify-center flex-shrink-0 text-lg">2</div>
                            <div>
                                <p className="font-bold text-slate-900 text-base mb-1">La prévision de trésorerie assistée</p>
                                <p className="text-sm text-slate-600">
                                    Pas remplacer l&apos;humain, mais <strong>accélérer la construction du prévisionnel</strong> et tester des scénarios en quelques minutes plutôt qu&apos;en quelques heures. À partir du moment où une PME a ses flux bancaires et ses données comptables centralisées, c&apos;est accessible.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-accent-primary text-white font-bold flex items-center justify-center flex-shrink-0 text-lg">3</div>
                            <div>
                                <p className="font-bold text-slate-900 text-base mb-1">L&apos;analyse de la qualité des données financières</p>
                                <p className="text-sm text-slate-600">
                                    C&apos;est moins visible mais fondamental. Beaucoup de PME prennent des décisions sur des données mal consolidées, avec des référentiels qui ne se parlent pas entre la compta, le CRM et les tableaux Excel du dirigeant. <strong>L&apos;IA peut cartographier ces incohérences et les corriger de façon structurée.</strong> C&apos;est le prérequis à tout le reste.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3 — ROI */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
                        Le ROI réel, pas celui des plaquettes commerciales
                    </h2>

                    <p>
                        Une analyse de 200 projets IA déployés en PME françaises entre 2022 et 2025 par Denis Atlan donne un <strong>ROI médian de 159,8&nbsp;%</strong>, avec un taux de succès de 73&nbsp;%. Ce n&apos;est pas le chiffre d&apos;une étude commandée par un éditeur de logiciels. C&apos;est une analyse de projets réels, avec des données vérifiées.
                    </p>

                    <div className="not-prose bg-green-50 border border-green-200 rounded-xl p-6 my-6">
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="w-5 h-5 text-green-700" />
                            <p className="font-bold text-green-900">La condition du succès</p>
                        </div>
                        <p className="text-sm text-slate-700">
                            Dans <strong>66&nbsp;% des cas</strong> (BPI France), le facteur déterminant de réussite est un <strong>programme de formation structuré</strong> pour les équipes qui utilisent l&apos;outil. Donner accès à un outil ne suffit pas.
                        </p>
                    </div>

                    {/* Conclusion */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
                        Ce que ça veut dire concrètement
                    </h2>

                    <p>
                        L&apos;IA en Finance n&apos;est plus réservée aux grandes entreprises. Mais elle ne se déploie pas par accident. Les PME qui vont décrocher un vrai avantage concurrentiel dans les 18 prochains mois ne seront pas celles qui ont le plus de budget. Ce seront celles qui auront <strong>défini deux ou trois cas d&apos;usage précis, connecté leurs données réelles, et mesuré les résultats dès la première itération</strong>.
                    </p>

                    <p>Le reste, c&apos;est du bruit.</p>

                    <p className="text-xs text-slate-400 mt-8">
                        Sources : KPMG Trends of AI 2026 (356 décideurs français), BPI France (1&nbsp;200 dirigeants PME et ETI), Denis Atlan — analyse de 200 projets IA en PME françaises 2022-2025.
                    </p>

                </div>

                {/* CTA bas d'article */}
                <div className="mt-16 p-8 bg-slate-900 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">
                        Pilote ta Finance avec les bons outils
                    </h3>
                    <p className="text-slate-300 mb-6">
                        FinSight intègre des agents IA Finance (TRESORIS, DASHIS, MARGIS) connectés à tes données réelles — pour passer de l&apos;expérimentation au pilotage concret.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/mon-diagnostic"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-colors"
                        >
                            Lancer mon diagnostic
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/agents"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                        >
                            Découvrir les agents IA Finance
                        </Link>
                    </div>
                </div>

            </article>

            <Footer />
        </div>
    )
}

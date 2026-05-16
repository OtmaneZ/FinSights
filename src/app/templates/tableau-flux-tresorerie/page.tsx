'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Download,
    FileSpreadsheet,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Calendar,
    BarChart3,
    Zap,
    Lock,
    Mail,
    ChevronRight,
    Eye,
    ArrowDownUp,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function TemplateTableauFluxTresoreriePage() {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        company: '',
        sector: ''
    })
    const [showPreview, setShowPreview] = useState(false)
    const [downloadStarted, setDownloadStarted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleDownload = async () => {
        if (!formData.email || !formData.email.includes('@')) {
            setError('Merci de saisir un email valide')
            return
        }
        if (!formData.firstName || formData.firstName.trim().length < 2) {
            setError('Merci de saisir votre prénom')
            return
        }
        setError('')
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/leads/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    firstName: formData.firstName,
                    company: formData.company,
                    sector: formData.sector,
                    templateName: 'Tableau de Flux de Trésorerie',
                    source: 'template_download',
                }),
            })

            if (!response.ok) throw new Error('Erreur lors de l\'envoi')

            setDownloadStarted(true)

            const link = document.createElement('a')
            link.href = '/templates/excel/Tableau_Flux_Tresorerie_FinSight_2026.xlsx'
            link.download = 'finsight-tableau-flux-tresorerie-2026.xlsx'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'template_download', {
                    template_name: 'tableau-flux-tresorerie',
                    email: formData.email,
                    firstName: formData.firstName,
                })
            }
        } catch (err) {
            console.error('Erreur capture lead:', err)
            setError('Une erreur est survenue. Merci de réessayer.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            {/* Hero */}
            <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-6">
                            <FileSpreadsheet className="inline w-3.5 h-3.5 mr-1.5" />
                            Template Excel Gratuit
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Tableau de Flux de Trésorerie<br />
                            <span className="text-accent-primary">Méthode Indirecte PCG</span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                            Construisez le troisième état financier réglementaire et comprenez enfin d&apos;où vient
                            votre cash. <strong className="text-white">Structure PCG complète</strong>,
                            <strong className="text-white"> réconciliation automatique</strong> et
                            <strong className="text-white"> comparatif N vs N-1</strong>.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                Téléchargement immédiat
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                Compatible Excel / Google Sheets
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                Conforme PCG 2026
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Problèmes */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-red-600 bg-red-50 border border-red-200 rounded-full mb-4">
                            Problèmes fréquents
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Votre résultat net est positif. Pourquoi votre compte est vide ?
                        </h2>
                        <p className="text-lg text-slate-600">
                            Le tableau de flux répond à cette question. La plupart des PME ne le produisent pas.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: AlertCircle,
                                title: 'Résultat net positif, trésorerie négative',
                                description: 'Vous faites des bénéfices sur le papier mais votre compte bancaire ne le montre pas. Vous ne comprenez pas pourquoi.',
                                impact: 'Décisions mal informées, stress de gestion'
                            },
                            {
                                icon: AlertCircle,
                                title: 'Cash qui disparaît sans explication',
                                description: 'Votre trésorerie baisse chaque mois sans cause évidente. Le BFR grossit silencieusement.',
                                impact: 'Découverts récurrents malgré une activité saine'
                            },
                            {
                                icon: AlertCircle,
                                title: 'Pas d\'état financier complet pour le CAC',
                                description: 'Le commissaire aux comptes ou la banque demande un tableau de flux. Vous n\'en avez pas.',
                                impact: 'Retards de clôture, image dégradée auprès des partenaires financiers'
                            },
                            {
                                icon: AlertCircle,
                                title: 'Investissements qui pèsent sur le cash sans être visibles',
                                description: 'Les capex et remboursements d\'emprunts n\'apparaissent pas dans le P&L. Leur impact sur la trésorerie est invisible.',
                                impact: 'Mauvaise lecture de la capacité d\'autofinancement réelle'
                            }
                        ].map((problem, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="bg-red-50 border-l-4 border-red-600 rounded-xl p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <problem.icon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-2">{problem.title}</h3>
                                        <p className="text-slate-700 mb-3">{problem.description}</p>
                                        <p className="text-sm text-red-700 font-medium">Impact : {problem.impact}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solution */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-green-600 bg-green-50 border border-green-200 rounded-full mb-4">
                            La solution
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Le tableau de flux structure votre cash en trois blocs
                        </h2>
                        <p className="text-lg text-slate-600">
                            Exploitation, investissement, financement. Chaque euro tracé, chaque mouvement expliqué.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {[
                            {
                                icon: ArrowDownUp,
                                title: 'Structure PCG complète',
                                description: 'Les trois sections réglementaires : flux d\'exploitation, d\'investissement et de financement'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Réconciliation automatique',
                                description: 'Partez du résultat net et arrivez à la variation de trésorerie réelle, pas à pas'
                            },
                            {
                                icon: BarChart3,
                                title: 'Variation BFR intégrée',
                                description: 'Calcul automatique de l\'impact des créances clients, stocks et dettes fournisseurs'
                            },
                            {
                                icon: CheckCircle2,
                                title: 'Méthode indirecte',
                                description: 'La méthode reconnue par le commissaire aux comptes et les banques françaises'
                            },
                            {
                                icon: Zap,
                                title: 'Comparatif N vs N-1',
                                description: 'Visualisez l\'évolution de vos flux sur deux exercices côte à côte'
                            },
                            {
                                icon: FileSpreadsheet,
                                title: 'Prêt à l\'emploi',
                                description: 'Formules et structure déjà en place. Saisissez vos chiffres, le reste est calculé.'
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-accent-primary transition-all"
                            >
                                <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-accent-primary" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 font-semibold rounded-xl hover:bg-slate-200 transition-all border border-slate-300"
                        >
                            <Eye className="w-5 h-5" />
                            {showPreview ? "Masquer l'aperçu" : "Voir un aperçu du template"}
                        </button>

                        {showPreview && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.4 }}
                                className="mt-8 bg-white rounded-xl p-6 border-2 border-accent-primary shadow-lg"
                            >
                                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                                    <p className="text-slate-500 text-sm">
                                        [Capture d&apos;écran du tableau de flux à ajouter]
                                    </p>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Le template inclut 3 onglets : <strong>Tableau de flux</strong>,{' '}
                                    <strong>Saisie des données</strong> et <strong>Comparatif N/N-1</strong>.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contenu */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                            Les trois blocs du tableau de flux
                        </h2>
                        <p className="text-lg text-slate-600 mb-8">
                            Chaque bloc répond à une question précise sur l&apos;origine et l&apos;utilisation de votre cash.
                        </p>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white text-sm font-bold">1</span>
                                    Flux d&apos;exploitation
                                </h3>
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <p className="text-slate-600 text-sm mb-4">
                                        Ce bloc répond à : votre activité génère-t-elle du cash par elle-même ?
                                        C&apos;est le flux le plus important. Un flux d&apos;exploitation négatif signale
                                        une activité qui consomme de la trésorerie, même si le résultat comptable est positif.
                                    </p>
                                    <ul className="space-y-2">
                                        {[
                                            'Résultat net de l\'exercice (point de départ)',
                                            'Réintégration des amortissements et provisions',
                                            'Variation des créances clients (DSO)',
                                            'Variation des stocks (DIO)',
                                            'Variation des dettes fournisseurs (DPO)',
                                            'Autres variations du BFR',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white text-sm font-bold">2</span>
                                    Flux d&apos;investissement
                                </h3>
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <p className="text-slate-600 text-sm mb-4">
                                        Ce bloc répond à : combien avez-vous investi ou cédé d&apos;actifs ?
                                        Un flux négatif est souvent sain : il signifie que vous investissez dans
                                        la capacité future. Un flux nul peut signaler un sous-investissement chronique.
                                    </p>
                                    <ul className="space-y-2">
                                        {[
                                            'Acquisitions d\'immobilisations corporelles et incorporelles (capex)',
                                            'Cessions d\'actifs',
                                            'Acquisitions / cessions de titres de participation',
                                            'Autres flux d\'investissement',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white text-sm font-bold">3</span>
                                    Flux de financement
                                </h3>
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <p className="text-slate-600 text-sm mb-4">
                                        Ce bloc répond à : comment avez-vous financé votre activité et vos investissements ?
                                        Il trace les mouvements avec les actionnaires et les créanciers financiers.
                                    </p>
                                    <ul className="space-y-2">
                                        {[
                                            'Augmentations de capital',
                                            'Nouveaux emprunts bancaires',
                                            'Remboursements d\'emprunts',
                                            'Dividendes versés aux associés',
                                            'Subventions d\'investissement reçues',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mode d'emploi */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                            En 4 étapes, votre tableau est produit
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    step: '1',
                                    title: 'Saisissez votre résultat net',
                                    description: 'Point de départ de la méthode indirecte. Reprenez le chiffre de votre liasse fiscale (2052).'
                                },
                                {
                                    step: '2',
                                    title: 'Renseignez les retraitements non-cash',
                                    description: 'Amortissements, provisions, plus-values de cession. Le template les réintègre automatiquement.'
                                },
                                {
                                    step: '3',
                                    title: 'Entrez les variations de bilan',
                                    description: 'Créances N vs N-1, stocks N vs N-1, dettes fournisseurs N vs N-1. La variation BFR est calculée automatiquement.'
                                },
                                {
                                    step: '4',
                                    title: 'Renseignez capex et flux financiers',
                                    description: 'Investissements, emprunts contractés et remboursés, dividendes. Le tableau se boucle sur votre variation de trésorerie réelle.'
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-primary text-white text-lg font-bold flex-shrink-0">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                        <p className="text-slate-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Téléchargement */}
            <section className="py-20 bg-gradient-to-br from-accent-primary to-accent-primary-hover text-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <FileSpreadsheet className="w-16 h-16 mx-auto mb-6 opacity-90" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Téléchargez le template maintenant
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Remplissez le formulaire et recevez immédiatement le fichier Excel
                        </p>

                        {!downloadStarted ? (
                            <div className="max-w-2xl mx-auto">
                                {error && (
                                    <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Prénom *"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-4 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                                        required
                                    />
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="Email professionnel *"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-4 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Entreprise (optionnel)"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-4 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <select
                                        value={formData.sector}
                                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                        className="w-full px-4 py-4 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-white appearance-none bg-white"
                                    >
                                        <option value="">Secteur (optionnel)</option>
                                        <option value="SaaS / Tech">SaaS / Tech</option>
                                        <option value="Services B2B">Services B2B</option>
                                        <option value="Commerce / E-commerce">Commerce / E-commerce</option>
                                        <option value="Industrie">Industrie</option>
                                        <option value="BTP / Construction">BTP / Construction</option>
                                        <option value="Santé / Médical">Santé / Médical</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleDownload}
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Télécharger gratuitement
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-2 text-sm opacity-75 mt-4">
                                    <Lock className="w-4 h-4" />
                                    <span>Vos données restent privées. Pas de spam.</span>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-md mx-auto bg-white/10 rounded-xl p-8 border border-white/20">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-300" />
                                <p className="text-lg font-semibold mb-2">Téléchargement démarré !</p>
                                <p className="text-sm opacity-90 mb-6">
                                    Le fichier <strong>finsight-tableau-flux-tresorerie-2026.xlsx</strong> a été téléchargé.
                                </p>
                                <Link
                                    href="/blog/dso-dpo-dio-trois-indicateurs-tresorerie"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all"
                                >
                                    Lire : DSO, DPO et DIO expliqués
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        )}

                        <p className="text-sm mt-8 opacity-75">
                            En téléchargeant, vous acceptez de recevoir des emails utiles sur le pilotage financier PME
                            (désabonnement en 1 clic).{' '}
                            <Link href="/politique-confidentialite" className="underline">Politique de confidentialité</Link>.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Questions fréquentes</h2>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Quelle est la différence entre tableau de flux et prévisionnel de trésorerie ?',
                                a: 'Le prévisionnel de trésorerie regarde vers l\'avenir : il anticipe les encaissements et décaissements à venir. Le tableau de flux regarde vers le passé : il explique, après clôture, pourquoi la trésorerie a évolué comme elle l\'a fait sur l\'exercice écoulé. Les deux sont complémentaires.'
                            },
                            {
                                q: 'Est-ce obligatoire pour une PME ?',
                                a: 'Non, le tableau de flux n\'est obligatoire que pour les grandes entreprises et les sociétés cotées. Mais il est fortement recommandé par les commissaires aux comptes et les banques dès lors que votre entreprise dépasse 2 à 3 M€ de CA ou contracte des financements significatifs.'
                            },
                            {
                                q: 'Quelle est la différence entre méthode directe et indirecte ?',
                                a: 'La méthode directe liste tous les encaissements et décaissements réels. La méthode indirecte, utilisée dans ce template, part du résultat net et le réconcilie avec la variation de trésorerie via les retraitements non-cash et les variations de bilan. La méthode indirecte est plus simple à produire depuis une comptabilité standard et est préférée en France.'
                            },
                            {
                                q: 'Comment lire un flux d\'exploitation négatif ?',
                                a: 'Un flux d\'exploitation négatif signifie que votre activité consomme de la trésorerie plutôt qu\'elle n\'en génère. Cela peut venir d\'une croissance rapide (le BFR augmente vite), d\'un allongement des délais clients, d\'un sur-stockage ou d\'une rentabilité insuffisante. C\'est un signal à analyser en priorité.'
                            },
                            {
                                q: 'Le template est-il compatible Google Sheets ?',
                                a: 'Oui, uploadez le fichier .xlsx dans Google Drive et ouvrez-le avec Google Sheets. Les formules sont compatibles à 95%.'
                            }
                        ].map((faq, i) => (
                            <motion.details
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-accent-primary transition-all"
                            >
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <h3 className="font-semibold text-slate-900 pr-4">{faq.q}</h3>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                                </summary>
                                <div className="px-6 pb-6">
                                    <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                                </div>
                            </motion.details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl p-8 border-2 border-accent-primary shadow-lg text-center"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Besoin d&apos;accompagnement personnalisé ?
                        </h2>
                        <p className="text-lg text-slate-600 mb-6">
                            Un architecte de pilotage financier produit votre tableau de flux, analyse votre cycle de cash
                            et vous accompagne dans la lecture de vos états financiers.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/consulting"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all shadow-lg"
                            >
                                Découvrir l&apos;offre de pilotage financier
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a
                                href="https://calendly.com/zineinsight/15min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-900 font-semibold rounded-xl hover:bg-slate-200 transition-all border border-slate-300"
                            >
                                <Calendar className="w-5 h-5" />
                                Réserver un appel gratuit
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

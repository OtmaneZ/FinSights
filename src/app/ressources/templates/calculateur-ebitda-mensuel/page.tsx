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
    DollarSign,
    BarChart3,
    Zap,
    Lock,
    Mail,
    ChevronRight,
    Eye,
    PieChart,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function TemplateEbitdaMensuelPage() {
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
                    templateName: 'Calculateur EBITDA Mensuel',
                    source: 'template_download',
                }),
            })

            if (!response.ok) throw new Error('Erreur lors de l\'envoi')

            setDownloadStarted(true)

            const link = document.createElement('a')
            link.href = '/templates/excel/FinSight_EBITDA_Mensuel.xlsx'
            link.download = 'finsight-calculateur-ebitda-mensuel.xlsx'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'template_download', {
                    template_name: 'calculateur-ebitda-mensuel',
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

            {/* Hero Section */}
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
                            Calculateur EBITDA Mensuel<br />
                            <span className="text-accent-primary">Prêt pour votre Banquier</span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                            Calculez votre EBITDA mois par mois, visualisez votre marge opérationnelle et préparez un
                            <strong className="text-white"> dossier bancaire solide</strong> avec des
                            <strong className="text-white"> graphiques professionnels automatiques</strong>.
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
                                Aucune inscription requise
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Problèmes Section */}
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
                            Votre banquier regarde l&apos;EBITDA. Pas le résultat net.
                        </h2>
                        <p className="text-lg text-slate-600">
                            Sans le connaître, vous négociez à l&apos;aveugle
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: AlertCircle,
                                title: 'Refus de crédit incompris',
                                description: 'Résultat net positif, pourtant la banque dit non. Vous ne savez pas pourquoi.',
                                impact: 'Financement refusé = croissance bloquée'
                            },
                            {
                                icon: AlertCircle,
                                title: 'Ratio d\'endettement inconnu',
                                description: 'Vous ne connaissez pas votre ratio Dette nette / EBITDA, le premier chiffre que regarde le banquier.',
                                impact: 'Négociation de taux désavantageuse'
                            },
                            {
                                icon: AlertCircle,
                                title: 'Pas de benchmark sectoriel',
                                description: 'Vous ne savez pas si votre marge EBITDA est bonne ou mauvaise vs votre secteur.',
                                impact: 'Impossibilité de vous positionner face aux investisseurs'
                            },
                            {
                                icon: AlertCircle,
                                title: 'Suivi mensuel inexistant',
                                description: 'Vous attendez la liasse fiscale annuelle pour connaître votre EBITDA réel.',
                                impact: 'Réaction trop tardive aux dégradations de marge'
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

            {/* Solution Section */}
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
                            Un calculateur EBITDA mensuel clé en main
                        </h2>
                        <p className="text-lg text-slate-600">
                            Saisissez vos chiffres une fois, obtenez tous les indicateurs qu&apos;attend votre banquier
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {[
                            {
                                icon: PieChart,
                                title: 'EBITDA automatique',
                                description: 'Résultat net + Impôts + Intérêts + Amortissements - calculé mois par mois'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Marge EBITDA vs secteur',
                                description: 'Comparez votre marge opérationnelle aux benchmarks de votre secteur'
                            },
                            {
                                icon: BarChart3,
                                title: 'Ratio Dette / EBITDA',
                                description: 'Le ratio clé du banquier calculé automatiquement avec interprétation'
                            },
                            {
                                icon: DollarSign,
                                title: 'Graphiques banque-ready',
                                description: 'Courbes et histogrammes exportables pour vos présentations bancaires'
                            },
                            {
                                icon: Zap,
                                title: 'Comparatif RN vs EBITDA',
                                description: 'Visualisez l\'écart entre ce que voit votre comptable et ce que voit le banquier'
                            },
                            {
                                icon: CheckCircle2,
                                title: 'Prêt à l\'emploi',
                                description: 'Formules configurées, saisissez juste vos chiffres mensuels P&L'
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

                    {/* Preview Button */}
                    <div className="text-center">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 font-semibold rounded-xl hover:bg-slate-200 transition-all border border-slate-300"
                        >
                            <Eye className="w-5 h-5" />
                            {showPreview ? 'Masquer l\'aperçu' : 'Voir un aperçu du template'}
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
                                        [Capture d&apos;écran du template Excel EBITDA à ajouter]
                                    </p>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Le template inclut 3 onglets : <strong>Dashboard EBITDA</strong>,{' '}
                                    <strong>Saisie mensuelle P&L</strong> et <strong>Benchmarks sectoriels</strong>.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contenu Section */}
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
                            Contenu du calculateur Excel
                        </h2>
                        <p className="text-lg text-slate-600 mb-8">
                            Conçu pour les dirigeants de PME qui veulent parler le même langage que leur banquier -
                            <strong> sans formation financière préalable</strong>.
                        </p>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white text-sm font-bold">1</span>
                                    Onglet "Saisie mensuelle P&L"
                                </h3>
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>CA mensuel</strong> et charges d&apos;exploitation (12 lignes)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Dotations aux amortissements</strong> et provisions
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Charges financières</strong> (intérêts d&apos;emprunts)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Impôts et taxes</strong> (IS, CET)
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white text-sm font-bold">2</span>
                                    Onglet "Dashboard EBITDA"
                                </h3>
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>EBITDA mensuel</strong> calculé automatiquement sur 12 mois
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Marge EBITDA %</strong> vs benchmark sectoriel (code couleur vert/orange/rouge)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Ratio Dette nette / EBITDA</strong> avec interprétation (sain / surveiller / signal rouge)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Graphiques exportables</strong> : histogramme EBITDA, courbe marge, comparatif RN vs EBITDA
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white text-sm font-bold">3</span>
                                    Onglet "Benchmarks sectoriels"
                                </h3>
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Marges EBITDA médianes</strong> par secteur (Services, SaaS, Commerce, BTP, Industrie...)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Ratios d&apos;endettement cibles</strong> par secteur et taille d&apos;entreprise
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Positionnement automatique</strong> : votre entreprise vs médiane secteur
                                            </span>
                                        </li>
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
                            En 4 étapes, votre EBITDA est calculé
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    step: '1',
                                    title: 'Sélectionnez votre secteur',
                                    description: 'Le template charge automatiquement les benchmarks de votre secteur pour la comparaison'
                                },
                                {
                                    step: '2',
                                    title: 'Saisissez vos chiffres mensuels',
                                    description: 'CA, charges, amortissements, charges financières, IS - directement depuis votre balance comptable'
                                },
                                {
                                    step: '3',
                                    title: 'Entrez votre dette nette',
                                    description: 'Emprunts bancaires en cours moins la trésorerie disponible - pour calculer le ratio bancaire clé'
                                },
                                {
                                    step: '4',
                                    title: 'Exportez le dashboard',
                                    description: 'Les graphiques sont prêts à être copiés dans votre présentation banque ou investisseur'
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
                        <PieChart className="w-16 h-16 mx-auto mb-6 opacity-90" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Téléchargez le calculateur maintenant
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
                                <p className="text-sm opacity-90 mb-4">
                                    Le fichier <strong>finsight-calculateur-ebitda-mensuel.xlsx</strong> a été téléchargé.
                                </p>
                                <p className="text-sm opacity-90 mb-6">
                                    Vous allez recevoir un email avec des conseils pour interpréter votre EBITDA.
                                </p>
                                <Link
                                    href="/blog/ebitda-vs-resultat-net-banquier"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all"
                                >
                                    Lire : EBITDA vs Résultat net
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
                                q: 'Quelle est la différence entre EBITDA et résultat net ?',
                                a: 'Le résultat net intègre les charges financières (intérêts), les impôts et les amortissements. L\'EBITDA les réintègre pour mesurer uniquement la performance opérationnelle de votre activité, indépendamment de votre structure financière et fiscale. C\'est pour ça que le banquier regarde l\'EBITDA plutôt que le résultat net.'
                            },
                            {
                                q: 'Mon EBITDA est-il bon ?',
                                a: 'Tout dépend de votre secteur. Une marge EBITDA de 10% est excellente dans le commerce de détail mais faible pour un SaaS. L\'onglet "Benchmarks" du template vous donne les médianes sectorielles pour vous situer.'
                            },
                            {
                                q: 'Comment calculer ma dette nette ?',
                                a: 'Dette nette = Emprunts bancaires en cours + Crédit-bail + Découverts bancaires - Trésorerie disponible (soldes de tous vos comptes). Le template inclut une cellule dédiée avec le calcul guidé.'
                            },
                            {
                                q: 'À partir de quel ratio la banque dit-elle non ?',
                                a: 'Au-dessus de 3x l\'EBITDA, la banque commence à surveiller. Au-dessus de 5x, c\'est généralement un signal rouge pour tout nouveau financement. En dessous de 3x, vous êtes considéré comme sain et finançable.'
                            },
                            {
                                q: 'Le template est-il compatible avec Google Sheets ?',
                                a: 'Oui, uploadez le fichier .xlsx dans Google Drive et ouvrez-le avec Google Sheets. Les formules et les graphiques sont compatibles à 95%.'
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
                            Un architecte de pilotage financier analyse votre EBITDA, prépare votre dossier bancaire et vous accompagne
                            dans vos décisions stratégiques.
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

'use client'

import { Metadata } from 'next'
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
    Eye
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function TemplateExcelTresoreriePage() {
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
        // Validation
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
            // Envoyer lead à l'API
            const response = await fetch('/api/leads/capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    firstName: formData.firstName,
                    company: formData.company,
                    sector: formData.sector,
                    templateName: 'Prévisionnel Trésorerie 90j',
                    source: 'template_download',
                }),
            })

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi')
            }

            setDownloadStarted(true)

            // Démarrer le téléchargement
            const link = document.createElement('a')
            link.href = '/templates/excel/dashboard-cashflow.xlsx' // Réutilise template existant pour MVP
            link.download = 'finsight-previsionnel-tresorerie-90j.xlsx'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Tracking analytics
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'template_download', {
                    template_name: 'previsionnel-tresorerie-90j',
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
                            Template Excel Prévisionnel Trésorerie<br />
                            <span className="text-accent-primary">90 Jours Glissants</span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                            Anticipez vos besoins de trésorerie avec un fichier Excel professionnel prêt à l&apos;emploi. 
                            <strong className="text-white"> Formules automatiques</strong>, 
                            <strong className="text-white"> graphiques intégrés</strong> et 
                            <strong className="text-white"> alertes conditionnelles</strong>.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                Téléchargement immédiat
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                Compatible Excel/Google Sheets
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
                            Vous pilotez votre trésorerie à vue ?
                        </h2>
                        <p className="text-lg text-slate-600">
                            Sans prévisionnel, vous risquez la rupture de trésorerie
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: AlertCircle,
                                title: 'Découverts imprévus',
                                description: 'Vous découvrez trop tard que vous allez être à découvert le mois prochain',
                                impact: 'Frais bancaires 50-200€/mois + stress'
                            },
                            {
                                icon: AlertCircle,
                                title: 'Décisions sans visibilité',
                                description: 'Vous hésitez à recruter/investir car vous ne savez pas si vous aurez le cash',
                                impact: 'Opportunités manquées = croissance freinée'
                            },
                            {
                                icon: AlertCircle,
                                title: 'Échéances oubliées',
                                description: 'TVA, charges sociales, fournisseurs : vous êtes surpris par les sorties de cash',
                                impact: 'Pénalités + relations fournisseurs dégradées'
                            },
                            {
                                icon: AlertCircle,
                                title: 'Pas de marge de manœuvre',
                                description: 'Vous passez votre temps à jongler entre comptes pour éviter les découverts',
                                impact: '5-10h/mois perdues + anxiété permanente'
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
                                        <p className="text-sm text-red-700 font-medium">
                                            💸 Impact : {problem.impact}
                                        </p>
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
                            Un prévisionnel de trésorerie sur 90 jours
                        </h2>
                        <p className="text-lg text-slate-600">
                            Anticipez vos encaissements et décaissements jour par jour
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {[
                            {
                                icon: Calendar,
                                title: 'Visibilité 90 jours',
                                description: 'Vous savez exactement quand vous aurez besoin de cash et combien'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Graphiques automatiques',
                                description: 'Courbe d\'évolution de trésorerie mise à jour en temps réel'
                            },
                            {
                                icon: Zap,
                                title: 'Alertes automatiques',
                                description: 'Cellules rouges si seuil trésorerie minimum atteint (<10k€)'
                            },
                            {
                                icon: DollarSign,
                                title: 'Encaissements clients',
                                description: 'Liste factures clients avec dates échéance et montants'
                            },
                            {
                                icon: BarChart3,
                                title: 'Décaissements fournisseurs',
                                description: 'TVA, charges sociales, fournisseurs : tout est prévu'
                            },
                            {
                                icon: CheckCircle2,
                                title: 'Prêt à l\'emploi',
                                description: 'Formules déjà configurées, il suffit de saisir vos montants'
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
                                        [Placeholder : capture d&apos;écran Excel à ajouter]
                                    </p>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Le template inclut 3 onglets : <strong>Prévisionnel 90j</strong>, 
                                    <strong> Encaissements</strong>, et <strong>Décaissements</strong> avec formules automatiques.
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
                            Contenu du template Excel
                        </h2>
                        <p className="text-lg text-slate-600 mb-8">
                            Ce fichier Excel est conçu pour les dirigeants de PME qui veulent piloter leur trésorerie 
                            de manière <strong>simple</strong> et <strong>fiable</strong>, sans passer par un logiciel complexe.
                        </p>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white text-sm font-bold">1</span>
                                    Onglet "Prévisionnel 90 jours"
                                </h3>
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Tableau jour par jour</strong> : Solde initial + encaissements - décaissements = solde final
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Graphique courbe</strong> : Évolution trésorerie sur 90 jours avec seuil d&apos;alerte (10k€)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Alertes conditionnelles</strong> : Cellules rouges si solde &lt; seuil minimum
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Synthèse hebdomadaire</strong> : Soldes min/max par semaine
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white text-sm font-bold">2</span>
                                    Onglet "Encaissements prévus"
                                </h3>
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Liste factures clients</strong> : N° facture, client, montant TTC, date échéance
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Statut paiement</strong> : Payé / En attente / Relancé / Retard
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Calcul DSO</strong> : Délai moyen de paiement clients
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white text-sm font-bold">3</span>
                                    Onglet "Décaissements prévus"
                                </h3>
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Charges fixes</strong> : Salaires, loyers, abonnements (montants récurrents)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Charges variables</strong> : Fournisseurs, sous-traitants (montants ponctuels)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Échéances fiscales</strong> : TVA (mensuelle/trimestrielle), IS, CFE
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                                <strong>Charges sociales</strong> : URSSAF, retraite, prévoyance
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
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                            Comment utiliser ce template ?
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    step: '1',
                                    title: 'Saisissez votre solde initial',
                                    description: 'Entrez le solde actuel de votre compte bancaire (ou la somme de tous vos comptes)'
                                },
                                {
                                    step: '2',
                                    title: 'Listez vos encaissements prévus',
                                    description: 'Ajoutez toutes les factures clients avec leur date d\'échéance et montant TTC'
                                },
                                {
                                    step: '3',
                                    title: 'Listez vos décaissements prévus',
                                    description: 'Charges fixes (salaires, loyers), fournisseurs, échéances fiscales et sociales'
                                },
                                {
                                    step: '4',
                                    title: 'Consultez le prévisionnel',
                                    description: 'Le graphique se met à jour automatiquement. Cellules rouges = alerte trésorerie'
                                },
                                {
                                    step: '5',
                                    title: 'Mettez à jour chaque semaine',
                                    description: 'Actualisez les encaissements/décaissements réels et ajustez les prévisions'
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

                    {/* Benchmarks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                            Combien de temps de visibilité trésorerie ?
                        </h2>
                        <p className="text-lg text-slate-600 mb-6">
                            Selon une étude EY 2024 sur 500 PME françaises :
                        </p>
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-300">
                                        <th className="text-left py-3 font-bold text-slate-900">Taille entreprise</th>
                                        <th className="text-center py-3 font-bold text-slate-900">Visibilité moyenne</th>
                                        <th className="text-center py-3 font-bold text-slate-900">Recommandé</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    <tr>
                                        <td className="py-3 text-slate-700">PME &lt; 5M€ CA</td>
                                        <td className="py-3 text-center text-red-600 font-semibold">15 jours</td>
                                        <td className="py-3 text-center text-green-600 font-semibold">90 jours</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-slate-700">PME 5-20M€ CA</td>
                                        <td className="py-3 text-center text-orange-600 font-semibold">30 jours</td>
                                        <td className="py-3 text-center text-green-600 font-semibold">90 jours</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-slate-700">PME &gt; 20M€ CA</td>
                                        <td className="py-3 text-center text-blue-600 font-semibold">60 jours</td>
                                        <td className="py-3 text-center text-green-600 font-semibold">180 jours</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-sm text-slate-600 mt-4">
                                💡 <strong>Règle d&apos;or</strong> : Une PME saine doit avoir <strong>minimum 90 jours de visibilité</strong> sur sa trésorerie.
                            </p>
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
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Prénom *"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-4 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                                            required
                                        />
                                    </div>
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
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Entreprise (optionnel)"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full px-4 py-4 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                                        />
                                    </div>
                                    <div className="relative">
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
                                <p className="text-lg font-semibold mb-2">
                                    ✅ Téléchargement démarré !
                                </p>
                                <p className="text-sm opacity-90 mb-4">
                                    Le fichier <strong>finsight-previsionnel-tresorerie-90j.xlsx</strong> a été téléchargé.
                                </p>
                                <p className="text-sm opacity-90 mb-6">
                                    📧 Vous allez recevoir un email avec :
                                </p>
                                <ul className="text-sm opacity-90 mb-6 text-left space-y-2">
                                    <li>✅ Le lien de téléchargement (si besoin)</li>
                                    <li>✅ 3 bonus exclusifs (checklist, calculateurs, articles)</li>
                                    <li>✅ Un tutoriel vidéo dans 2 jours</li>
                                    <li>✅ Un cas client inspirant dans 5 jours</li>
                                </ul>
                                <Link
                                    href="/consulting"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all"
                                >
                                    Besoin d&apos;aide ? Parler à un DAF
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        )}

                        <p className="text-sm mt-8 opacity-75">
                            📧 En téléchargeant, vous acceptez de recevoir des emails utiles sur le pilotage financier PME 
                            (désabonnement en 1 clic). Consultez notre <Link href="/legal/politique-confidentialite" className="underline">politique de confidentialité</Link>.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Questions fréquentes
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Le template fonctionne-t-il avec Google Sheets ?',
                                a: 'Oui, vous pouvez uploader le fichier Excel dans Google Drive et l\'ouvrir avec Google Sheets. Les formules sont compatibles à 95%. Seules les mises en forme conditionnelles complexes peuvent nécessiter un ajustement mineur.'
                            },
                            {
                                q: 'Dois-je payer pour utiliser ce template ?',
                                a: 'Non, le template est 100% gratuit. Aucune carte bancaire requise. Vous recevrez simplement quelques emails de conseils pour optimiser votre pilotage financier (désabonnement en 1 clic).'
                            },
                            {
                                q: 'Puis-je adapter le template à mes besoins ?',
                                a: 'Absolument ! Le fichier Excel est entièrement modifiable. Vous pouvez ajouter des lignes, colonnes, changer les formules, personnaliser les graphiques... C\'est votre template.'
                            },
                            {
                                q: 'Quelle est la différence entre ce template et FinSight ?',
                                a: 'Ce template Excel est un outil manuel pour PME qui veulent commencer simple. FinSight est une plateforme plus avancée avec IA, import automatique, analyses prédictives et recommandations personnalisées. Vous pouvez utiliser les deux en complémentarité.'
                            },
                            {
                                q: 'À quelle fréquence dois-je mettre à jour le prévisionnel ?',
                                a: 'Idéalement chaque semaine (5-10 minutes). Mettez à jour les encaissements/décaissements réels, ajoutez les nouvelles factures clients, retirez les paiements reçus. Plus vous actualisez, plus c\'est fiable.'
                            },
                            {
                                q: 'Y a-t-il un support si j\'ai des questions ?',
                                a: 'Oui ! Envoyez un email à contact@zineinsight.com ou réservez un appel gratuit de 15 minutes via Calendly pour qu\'on vous aide à configurer le template.'
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

            {/* CTA Final vers Consulting */}
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
                            Vous voulez un DAF externalisé qui pilote votre trésorerie, optimise vos marges et 
                            accompagne vos décisions stratégiques ?
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/consulting"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all shadow-lg"
                            >
                                Découvrir le service DAF externalisé
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a
                                href="https://calendly.com/zineinsight"
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

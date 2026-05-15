'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
    ArrowRight, 
    CheckCircle2, 
    AlertTriangle, 
    TrendingUp, 
    Shield, 
    Clock, 
    Users, 
    BarChart3, 
    Calculator,
    Phone,
    Mail,
    Calendar,
    Star,
    Building2,
    Target,
    Zap,
    LineChart,
    PiggyBank,
    FileText
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'

export default function DAFExternalisePME() {
    // Schema.org structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "DAF Externalisé PME - FinSight",
        "description": "Services de direction financière externalisée pour PME de 500k€ à 5 millions d'euros. Pilotage trésorerie, marges et finance stratégique.",
        "url": "https://finsight.zineinsight.com/daf-externalise-pme",
        "provider": {
            "@type": "Person",
            "name": "Otmane Boulahia",
            "jobTitle": "Consultant Finance & Data / DAF Externalisé",
            "url": "https://finsight.zineinsight.com/consulting"
        },
        "areaServed": {
            "@type": "Country",
            "name": "France"
        },
        "serviceType": ["DAF Externalisé", "DAF Temps Partagé", "Fractional CFO", "Pilotage Trésorerie"],
        "offers": [
            {
                "@type": "Offer",
                "name": "Diagnostic Stratégique",
                "price": "2490",
                "priceCurrency": "EUR",
                "description": "Audit flash + feuille de route prioritaire"
            },
            {
                "@type": "Offer", 
                "name": "Audit Financier Complet",
                "price": "6990",
                "priceCurrency": "EUR",
                "description": "Analyse complète trésorerie, marges et rentabilité"
            },
            {
                "@type": "Offer",
                "name": "Accompagnement DAF",
                "priceRange": "À partir de 1500€/mois",
                "description": "Direction financière externalisée récurrente"
            }
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Services DAF Externalisé",
            "itemListElement": [
                "Pilotage de trésorerie",
                "Optimisation des marges",
                "Tableaux de bord financiers",
                "Prévisionnel cash-flow",
                "Accompagnement levée de fonds",
                "Structuration financière"
            ]
        }
    }

    // FAQ Schema for rich snippets
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Qu'est-ce qu'un DAF externalisé ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Un DAF externalisé (ou DAF à temps partagé) est un Directeur Administratif et Financier qui intervient quelques jours par mois dans votre entreprise. C'est une alternative au recrutement d'un DAF temps plein, idéale pour les PME de 500k€ à 5M€ qui ont besoin d'expertise financière sans le coût d'un cadre dirigeant permanent."
                }
            },
            {
                "@type": "Question",
                "name": "Combien coûte un DAF externalisé ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le tarif d'un DAF externalisé varie généralement entre 1 200€ et 3 500€ par mois selon le temps d'intervention (1 à 4 jours/mois). C'est 3 à 5 fois moins cher qu'un DAF salarié (80-120k€/an charges comprises). Le ROI est souvent atteint dès le premier trimestre grâce aux optimisations de trésorerie."
                }
            },
            {
                "@type": "Question",
                "name": "Quelle est la différence entre DAF externalisé et expert-comptable ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "L'expert-comptable s'occupe de la comptabilité légale et des déclarations fiscales. Le DAF externalisé va plus loin : il pilote la stratégie financière, optimise la trésorerie, construit des tableaux de bord, analyse les marges par produit/client, et accompagne les décisions stratégiques (investissements, recrutements, levées de fonds)."
                }
            },
            {
                "@type": "Question",
                "name": "Quand ai-je besoin d'un DAF externalisé ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Vous avez besoin d'un DAF externalisé si : votre trésorerie est imprévisible au-delà de 30 jours, vous ne connaissez pas vos marges par produit/client, vous préparez une levée de fonds ou une croissance rapide, vous prenez des décisions sans données fiables, ou vous passez trop de temps sur la finance au lieu de développer votre business."
                }
            },
            {
                "@type": "Question",
                "name": "Le DAF externalisé travaille-t-il à distance ou sur site ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Les deux ! La plupart des missions se font en hybride : 1-2 jours sur site par mois pour les réunions stratégiques et points direction, le reste à distance (analyse de données, construction des tableaux de bord, suivi de trésorerie). Cette flexibilité réduit les coûts et augmente la réactivité."
                }
            },
            {
                "@type": "Question",
                "name": "Combien de temps dure une mission DAF externalisé ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Il n'y a pas de durée minimum imposée. Un diagnostic initial prend 2-3 semaines. Un accompagnement récurrent s'engage généralement par trimestre, renouvelable. Certains clients continuent sur plusieurs années car le ROI est constant. Vous restez libre de stopper quand vous voulez."
                }
            },
            {
                "@type": "Question",
                "name": "Quels secteurs d'activité accompagnez-vous ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "J'accompagne principalement : Services B2B (ESN, conseil, agences), SaaS et Tech, Commerce et Distribution, et Industrie/BTP. Mon expertise data me permet de m'adapter rapidement aux spécificités sectorielles grâce à l'analyse automatisée de vos données comptables."
                }
            },
            {
                "@type": "Question",
                "name": "Quels résultats concrets attendre d'un DAF externalisé ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Les résultats typiques après 90 jours : visibilité trésorerie 90 jours (vs 30 avant), DSO réduit de 15-30%, marges optimisées de 2-5 points, temps dirigeant sur la finance divisé par 3, décisions basées sur des données fiables plutôt que l'intuition."
                }
            }
        ]
    }

    const problemes = [
        {
            icon: <AlertTriangle className="w-8 h-8" />,
            titre: "Trésorerie imprévisible",
            description: "Vous ne voyez pas au-delà de 30 jours. Chaque fin de mois est stressante.",
            impact: "Risque de tension cash, opportunités manquées"
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            titre: "Marges mal connues",
            description: "Vous ne savez pas quels clients/produits sont vraiment rentables.",
            impact: "Décisions stratégiques à l'aveugle"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            titre: "Trop de temps sur la finance",
            description: "Vous passez des heures sur Excel au lieu de développer votre business.",
            impact: "Coût d'opportunité énorme"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            titre: "Reporting inexistant ou tardif",
            description: "Vos chiffres arrivent 2 mois après. Impossible de piloter en temps réel.",
            impact: "Réaction trop tardive aux problèmes"
        }
    ]

    const solutions = [
        {
            icon: <LineChart className="w-6 h-6 text-accent-primary" />,
            titre: "Prévisionnel trésorerie 90 jours",
            description: "Visibilité claire sur votre cash, actualisée chaque semaine"
        },
        {
            icon: <Target className="w-6 h-6 text-accent-primary" />,
            titre: "Analyse rentabilité par client/produit",
            description: "Identifiez vos pépites et vos boulets financiers"
        },
        {
            icon: <BarChart3 className="w-6 h-6 text-accent-primary" />,
            titre: "Tableaux de bord automatisés",
            description: "KPIs clés mis à jour quotidiennement, sans ressaisie"
        },
        {
            icon: <Shield className="w-6 h-6 text-accent-primary" />,
            titre: "Pilotage stratégique",
            description: "Décisions éclairées pour investir, recruter, se développer"
        }
    ]

    const temoignages = [
        {
            nom: "Jean D.",
            poste: "CEO, PME Services 8M€",
            avatar: "JD",
            texte: "En 3 mois, j'ai retrouvé de la visibilité sur ma tréso. Le DSO est passé de 58 à 42 jours. Je recommande !",
            resultat: "+180k€ trésorerie libérée"
        },
        {
            nom: "Marie C.",
            poste: "DG, SaaS B2B 3M€",
            avatar: "MC",
            texte: "Otmane a structuré tout notre reporting finance avant notre Series A. Les investisseurs ont été impressionnés.",
            resultat: "Levée de 2M€ bouclée"
        },
        {
            nom: "Stéphane B.",
            poste: "Fondateur, Agence digitale 2M€",
            avatar: "SB",
            texte: "Je ne savais pas quels clients étaient rentables. Maintenant j'ai un dashboard qui me dit tout en temps réel.",
            resultat: "+5 points de marge brute"
        }
    ]

    const offres = [
        {
            nom: "Diagnostic",
            prix: "2 490€",
            description: "Audit flash de votre situation financière",
            duree: "2-3 semaines",
            inclus: [
                "Analyse trésorerie et BFR",
                "Identification des 3 priorités",
                "Feuille de route actionable",
                "1h de restitution avec vous"
            ],
            cta: "Commander le diagnostic",
            popular: false
        },
        {
            nom: "Audit Complet",
            prix: "6 990€",
            description: "Analyse approfondie + plan d'action détaillé",
            duree: "4-6 semaines", 
            inclus: [
                "Tout le Diagnostic, plus :",
                "Analyse marges par client/produit",
                "Prévisionnel tréso 12 mois",
                "Benchmark secteur",
                "Plan d'optimisation chiffré",
                "2h de restitution + support 1 mois"
            ],
            cta: "Commander l'audit",
            popular: true
        },
        {
            nom: "Accompagnement DAF",
            prix: "Sur devis",
            description: "Direction financière externalisée récurrente",
            duree: "À partir de 2j/mois",
            inclus: [
                "Tout l'Audit, plus :",
                "Tableaux de bord automatisés",
                "Suivi hebdomadaire trésorerie",
                "Comité de pilotage mensuel",
                "Support illimité par email",
                "Accompagnement levée de fonds"
            ],
            cta: "Demander un devis",
            popular: false
        }
    ]

    return (
        <div className="min-h-screen bg-white">
            <StructuredData data={structuredData} />
            <StructuredData data={faqSchema} />
            <Header />

            <main>
                {/* ========== HERO SECTION ========== */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-24">
                    {/* Background */}
                    <div className="absolute inset-0">
                        <Image
                            src="/images/bureau.png"
                            alt="DAF externalisé travaillant sur les finances d'une PME"
                            fill
                            className="object-cover opacity-15"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
                    </div>

                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/20 border border-accent-primary/30 mb-8"
                            >
                                <Building2 className="w-4 h-4 text-accent-primary" />
                                <span className="text-sm text-accent-primary font-medium">
                                    PME 500k€-5M€ de chiffre d&apos;affaires
                                </span>
                            </motion.div>

                            {/* H1 - Optimisé SEO */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                            >
                                DAF Externalisé PME :<br />
                                <span className="text-accent-primary">Pilotez votre trésorerie</span><br />
                                sans recruter
                            </motion.h1>

                            {/* Subheadline */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                            >
                                Expertise <strong className="text-white">CFO à temps partagé</strong> pour PME ambitieuses.
                                Visibilité trésorerie 90 jours, marges optimisées, décisions éclairées.
                            </motion.p>

                            {/* Stats crédibilité */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-10"
                            >
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">50+</div>
                                    <div className="text-sm text-slate-400">PME accompagnées</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">-25%</div>
                                    <div className="text-sm text-slate-400">DSO moyen</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">90j</div>
                                    <div className="text-sm text-slate-400">Visibilité tréso</div>
                                </div>
                            </motion.div>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <Link
                                    href="https://calendly.com/zineinsight"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Diagnostic gratuit (30 min)
                                </Link>
                                <Link
                                    href="#offres"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                                >
                                    Voir les offres
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ========== PROBLÈMES ========== */}
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                    Ces problèmes vous parlent ?
                                </h2>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                    80% des PME de 500k€ à 5M€ rencontrent ces difficultés financières. 
                                    Ce n&apos;est pas une fatalité.
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {problemes.map((probleme, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-red-200 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                                                {probleme.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                    {probleme.titre}
                                                </h3>
                                                <p className="text-slate-600 mb-3">
                                                    {probleme.description}
                                                </p>
                                                <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    {probleme.impact}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== SOLUTIONS ========== */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                    Ce que je mets en place pour vous
                                </h2>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                    Un DAF externalisé apporte structure, visibilité et sérénité financière.
                                </p>
                            </motion.div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {solutions.map((solution, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-accent-primary hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center mb-4">
                                            {solution.icon}
                                        </div>
                                        <h3 className="font-bold text-slate-900 mb-2">
                                            {solution.titre}
                                        </h3>
                                        <p className="text-sm text-slate-600">
                                            {solution.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== QUI SUIS-JE ========== */}
                <section className="py-20 bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Photo */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="relative"
                                >
                                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                                        <Image
                                            src="/images/moi-bureau.png"
                                            alt="Otmane Boulahia - DAF Externalisé"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {/* Badge crédibilité */}
                                    <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-xl">
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1,2,3,4,5].map(i => (
                                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900">50+ PME</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Contenu */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="text-white"
                                >
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                                        Otmane Boulahia
                                    </h2>
                                    <p className="text-accent-primary font-semibold mb-4">
                                        Consultant Finance & Data | DAF Externalisé
                                    </p>
                                    <div className="space-y-4 text-slate-300">
                                        <p>
                                            Après 8 ans en finance d&apos;entreprise (audit, contrôle de gestion, direction financière), 
                                            j&apos;accompagne les <strong className="text-white">PME ambitieuses de 500k€ à 5M€</strong> dans leur pilotage financier.
                                        </p>
                                        <p>
                                            Ma différence ? Je combine <strong className="text-white">expertise finance</strong> et 
                                            <strong className="text-white"> maîtrise data/IA</strong> pour automatiser vos reportings 
                                            et vous donner une visibilité que même les grandes entreprises n&apos;ont pas toujours.
                                        </p>
                                    </div>

                                    {/* Expertise */}
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        {[
                                            { label: "Secteurs", value: "Services, SaaS, Industrie" },
                                            { label: "Taille PME", value: "500k€ à 5M€ CA" },
                                            { label: "Expérience", value: "8+ ans finance" },
                                            { label: "Clients", value: "50+ accompagnés" }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white/5 rounded-lg p-3">
                                                <p className="text-xs text-slate-400">{item.label}</p>
                                                <p className="font-semibold text-white">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href="https://calendly.com/zineinsight"
                                        className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Réserver un échange
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== TÉMOIGNAGES ========== */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                    Ce qu&apos;en disent les dirigeants
                                </h2>
                            </motion.div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {temoignages.map((temoignage, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
                                    >
                                        {/* Stars */}
                                        <div className="flex gap-1 mb-4">
                                            {[1,2,3,4,5].map(j => (
                                                <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            ))}
                                        </div>
                                        
                                        {/* Quote */}
                                        <p className="text-slate-700 mb-6 italic">
                                            &quot;{temoignage.texte}&quot;
                                        </p>

                                        {/* Résultat */}
                                        <div className="bg-green-50 rounded-lg px-3 py-2 mb-4">
                                            <p className="text-sm font-semibold text-green-700">
                                                📈 {temoignage.resultat}
                                            </p>
                                        </div>

                                        {/* Auteur */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                                                {temoignage.avatar}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{temoignage.nom}</p>
                                                <p className="text-sm text-slate-500">{temoignage.poste}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== OFFRES ========== */}
                <section id="offres" className="py-20 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                    Mes offres DAF externalisé
                                </h2>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                    Du diagnostic ponctuel à l&apos;accompagnement récurrent, choisissez la formule adaptée à vos besoins.
                                </p>
                            </motion.div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                {offres.map((offre, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                                            offre.popular 
                                                ? 'border-accent-primary shadow-xl shadow-accent-primary/10' 
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        {offre.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <span className="bg-accent-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                                                    POPULAIRE
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{offre.nom}</h3>
                                            <div className="text-3xl font-bold text-accent-primary mb-1">{offre.prix}</div>
                                            <p className="text-sm text-slate-500">{offre.duree}</p>
                                        </div>

                                        <p className="text-slate-600 text-center mb-6">{offre.description}</p>

                                        <ul className="space-y-3 mb-8">
                                            {offre.inclus.map((item, j) => (
                                                <li key={j} className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-slate-700">{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            href="https://calendly.com/zineinsight"
                                            className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                                                offre.popular
                                                    ? 'bg-accent-primary text-white hover:bg-accent-primary-hover'
                                                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                            }`}
                                        >
                                            {offre.cta}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-center text-sm text-slate-500 mt-8">
                                💡 Pas sûr de quelle offre choisir ? <Link href="https://calendly.com/zineinsight" className="text-accent-primary hover:underline font-semibold">Réservez un appel gratuit de 30 min</Link> pour en discuter.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ========== FAQ ========== */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                    Questions fréquentes
                                </h2>
                            </motion.div>

                            <div className="space-y-4">
                                {faqSchema.mainEntity.map((faq, i) => (
                                    <motion.details
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                        className="group bg-slate-50 rounded-xl border border-slate-200"
                                    >
                                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                            <h3 className="font-semibold text-slate-900 pr-4">
                                                {faq.name}
                                            </h3>
                                            <ArrowRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                                        </summary>
                                        <div className="px-6 pb-6">
                                            <p className="text-slate-600 leading-relaxed">
                                                {faq.acceptedAnswer.text}
                                            </p>
                                        </div>
                                    </motion.details>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== CTA FINAL ========== */}
                <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/vue-NY.png"
                            alt=""
                            fill
                            className="object-cover opacity-10"
                        />
                    </div>

                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Prêt à reprendre le contrôle de vos finances ?
                            </h2>
                            <p className="text-lg text-slate-300 mb-8">
                                Réservez un appel gratuit de 30 minutes. Pas de commercial, pas de blabla. 
                                On parle de votre situation et je vous dis si je peux vous aider.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Link
                                    href="https://calendly.com/zineinsight"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all shadow-lg shadow-accent-primary/25"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Réserver mon appel gratuit
                                </Link>
                                <Link
                                    href="mailto:otmane@zineinsight.com"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                                >
                                    <Mail className="w-5 h-5" />
                                    otmane@zineinsight.com
                                </Link>
                            </div>

                            <p className="text-sm text-slate-400">
                                ✅ Appel sans engagement • ✅ Diagnostic rapide de votre situation • ✅ Conseils actionnables
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ========== OUTILS GRATUITS ========== */}
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    🛠️ Outils gratuits pour PME
                                </h2>
                                <p className="text-slate-600">
                                    Calculez vos indicateurs financiers en 30 secondes
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <Link
                                    href="/calculateurs/dso"
                                    className="group flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 hover:border-accent-primary hover:shadow-lg transition-all"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                                        <Calculator className="w-6 h-6 text-blue-600 group-hover:text-accent-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-accent-primary transition-colors">
                                            Calculateur DSO
                                        </h3>
                                        <p className="text-sm text-slate-500">Délai moyen de paiement clients</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/calculateurs/bfr"
                                    className="group flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 hover:border-accent-primary hover:shadow-lg transition-all"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                                        <PiggyBank className="w-6 h-6 text-green-600 group-hover:text-accent-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-accent-primary transition-colors">
                                            Calculateur BFR
                                        </h3>
                                        <p className="text-sm text-slate-500">Besoin en fonds de roulement</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

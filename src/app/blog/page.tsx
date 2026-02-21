'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
    FileText, 
    Calendar, 
    ArrowRight, 
    Search, 
    TrendingUp, 
    DollarSign, 
    Sparkles,
    Clock,
    ChevronRight,
    BookOpen,
    Target,
    BarChart3,
    Zap,
    Shield,
    Briefcase,
    TrendingDown
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useMemo } from 'react'

interface BlogPost {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
    tags: string[]
    featured?: boolean
    image?: string
    type?: 'operationnel' | 'strategique'
}

const blogPosts: BlogPost[] = [
    // ═══════════════════════════════════════════════
    // NOTES STRATÉGIQUES — Analyse & Positionnement DAF
    // ═══════════════════════════════════════════════
    {
        slug: 'dso-superieur-mediane-sectorielle-modele',
        title: 'DSO supérieur à la médiane sectorielle : que révèle vraiment votre modèle ?',
        description: 'Un DSO élevé n\'est pas qu\'un problème de recouvrement. C\'est souvent le symptôme d\'un déséquilibre structurel entre modèle commercial et organisation financière.',
        date: '21 février 2026',
        readTime: '11 min',
        category: 'Note Stratégique',
        tags: ['DSO', 'Analyse structurelle', 'Modèle économique', 'DAF'],
        featured: true,
        image: '/images/bureau-nuit.png',
        type: 'strategique'
    },
    {
        slug: 'bfr-structurellement-eleve-commercial-organisationnel',
        title: 'BFR structurellement élevé : problème commercial ou problème organisationnel ?',
        description: 'Quand le BFR dépasse durablement les normes sectorielles, la cause est rarement unique. Lecture croisée des facteurs commerciaux, opérationnels et financiers.',
        date: '21 février 2026',
        readTime: '13 min',
        category: 'Note Stratégique',
        tags: ['BFR', 'Analyse structurelle', 'Organisation', 'DAF'],
        image: '/images/bfr.png',
        type: 'strategique'
    },
    {
        slug: 'pme-sous-estiment-fragilite-cash',
        title: 'Pourquoi 70 % des PME sous-estiment leur fragilité cash',
        description: 'La rentabilité masque souvent une vulnérabilité de trésorerie. Analyse des mécanismes qui conduisent les PME rentables à une impasse de liquidité.',
        date: '21 février 2026',
        readTime: '10 min',
        category: 'Note Stratégique',
        tags: ['Cash', 'Fragilité', 'PME', 'Trésorerie', 'DAF'],
        image: '/images/cash-flow-prev.png',
        type: 'strategique'
    },
    {
        slug: 'marge-correcte-cash-fragile-piege-croissance',
        title: 'Marge correcte, cash fragile : le piège classique des PME en croissance',
        description: 'Une marge brute confortable ne protège pas de la rupture de trésorerie. Pourquoi la croissance est le moment le plus dangereux pour le cash.',
        date: '21 février 2026',
        readTime: '12 min',
        category: 'Note Stratégique',
        tags: ['Marge', 'Cash', 'Croissance', 'PME', 'DAF'],
        image: '/images/marge.png',
        type: 'strategique'
    },
    {
        slug: 'daf-externalise-vs-expert-comptable-confusion',
        title: 'DAF externalisé vs expert-comptable : rôles et confusion dangereuse',
        description: 'L\'expert-comptable produit les comptes. Le DAF les interprète et arbitre. Confondre les deux expose l\'entreprise à des décisions prises sans lecture financière.',
        date: '21 février 2026',
        readTime: '9 min',
        category: 'Note Stratégique',
        tags: ['DAF externalisé', 'Expert-comptable', 'Positionnement', 'Direction financière'],
        image: '/images/bureau.png',
        type: 'strategique'
    },
    {
        slug: 'a-partir-quel-ca-faut-il-un-daf',
        title: 'À partir de quel chiffre d\'affaires faut-il un DAF ?',
        description: 'Le seuil de complexité financière ne dépend pas que du CA. Nombre de clients, saisonnalité, BFR structurel : les vrais critères de déclenchement.',
        date: '21 février 2026',
        readTime: '10 min',
        category: 'Note Stratégique',
        tags: ['DAF', 'Seuil CA', 'Direction financière', 'PME'],
        image: '/images/moi-bureau.png',
        type: 'strategique'
    },
    {
        slug: '4-priorites-daf-90-jours',
        title: 'Les 4 priorités d\'un DAF sur 90 jours',
        description: 'Trésorerie, marge, structure, reporting : la séquence d\'intervention d\'un DAF qui prend un mandat. Ce qui se joue dans les 3 premiers mois.',
        date: '21 février 2026',
        readTime: '11 min',
        category: 'Note Stratégique',
        tags: ['DAF', 'Priorités', '90 jours', 'Méthodologie', 'PME'],
        image: '/images/vue-NY.png',
        type: 'strategique'
    },
    {
        slug: 'pilotage-financier-change-pme-5-20m',
        title: 'Ce qu\'un vrai pilotage financier change dans une PME 5–20M\u20ac',
        description: 'Avant/après : les transformations concrètes quand une PME passe d\'une comptabilité subie à un pilotage financier structuré.',
        date: '21 février 2026',
        readTime: '14 min',
        category: 'Note Stratégique',
        tags: ['Pilotage financier', 'PME', 'Transformation', 'DAF', 'Direction financière'],
        image: '/images/bureau-nuit.png',
        type: 'strategique'
    },
    // ═══════════════════════════════════════════════
    // ÉTUDES DE CAS — Conversion par la preuve
    // ═══════════════════════════════════════════════
    {
        slug: 'pme-b2b-6m-240k-cash-libere-4-mois',
        title: 'Comment une PME B2B à 6M€ a libéré 240k€ de cash en 4 mois',
        description: 'DSO de 72 jours, BFR en dérive, trésorerie sous tension. Diagnostic structuré, plan d\'action en 3 phases, résultat chiffré : +240k€ de cash disponible.',
        date: '21 février 2026',
        readTime: '11 min',
        category: 'Étude de cas',
        tags: ['Cash', 'DSO', 'BFR', 'PME B2B', 'Résultats'],
        image: '/images/bureau.png',
        type: 'strategique'
    },
    {
        slug: 'reduire-dso-62-41-jours-relation-client',
        title: 'Comment réduire un DSO de 62 à 41 jours sans détériorer la relation client',
        description: 'PME de services à 4,5M€ de CA. DSO chroniquement élevé. 3 leviers activés en 90 jours : segmentation client, process facturation, relance structurée.',
        date: '21 février 2026',
        readTime: '10 min',
        category: 'Étude de cas',
        tags: ['DSO', 'Recouvrement', 'Relation client', 'PME Services'],
        image: '/images/vue-NY.png',
        type: 'strategique'
    },
    {
        slug: 'pme-8m-risque-dependance-sous-estime',
        title: 'Pourquoi cette PME à 8M€ de CA sous-estimait son risque de dépendance',
        description: 'Un client représente 38% du CA. Marge confortable, dirigeant serein. Analyse structurelle : le risque était systémique et invisible dans les tableaux de bord.',
        date: '21 février 2026',
        readTime: '12 min',
        category: 'Étude de cas',
        tags: ['Concentration client', 'Risque', 'PME', 'Diversification'],
        image: '/images/marge.png',
        type: 'strategique'
    },
    // ═══════════════════════════════════════════════
    // ARTICLES OPÉRATIONNELS — Socle SEO
    // ═══════════════════════════════════════════════
    {
        slug: 'dashboard-financier-mort-agents-ia-2026',
        title: 'Pourquoi votre Dashboard Financier est mort (et ce qui le remplace en 2026)',
        description: 'Le Dashboard affiche le passé. Les Agents IA prédisent l\'avenir. Découvrez DASHIS, TRESORIS, MARGIS et SCENARIS : la révolution du pilotage automatique 24/7',
        date: '9 février 2026',
        readTime: '8 min',
        category: 'Intelligence Artificielle',
        tags: ['Agents IA', 'Automation', 'Trésorerie', 'Pilotage', 'Dashboard'],
        featured: true,
        image: '/images/ai-oversight-control.png'
    },
    {
        slug: 'lire-bilan-compte-resultat-guide-pratique',
        title: 'Lire un bilan et un compte de résultat : guide pratique',
        description: 'Apprenez à décrypter vos états financiers en 15 minutes : bilan, compte de résultat, signaux d\'alerte et questions à poser à votre comptable',
        date: '25 janvier 2026',
        readTime: '12 min',
        category: 'Gestion',
        tags: ['Bilan', 'Compte de résultat', 'États financiers', 'Comptabilité'],
        featured: false,
        image: '/images/bureau-nuit.png'
    },
    {
        slug: 'eva-roic-illusion-performance',
        title: 'Pourquoi une entreprise rentable peut détruire de la valeur',
        description: 'EVA, ROIC et WACC : découvrez pourquoi la rentabilité comptable ne suffit pas et comment mesurer la création de valeur réelle',
        date: '25 janvier 2026',
        readTime: '14 min',
        category: 'Analyse',
        tags: ['EVA', 'ROIC', 'WACC', 'Valeur', 'Performance'],
        featured: false,
        image: '/images/bureau.png'
    },
    {
        slug: '5-erreurs-tresorerie-pme',
        title: '5 erreurs de trésorerie qui coûtent cher aux PME',
        description: 'Les erreurs fatales que commettent 80% des dirigeants de PME avec leur trésorerie, et comment les éviter',
        date: '18 décembre 2025',
        readTime: '7 min',
        category: 'Trésorerie',
        tags: ['Trésorerie', 'PME', 'Erreurs', 'Cash', 'Pilotage'],
        featured: false,
        image: '/images/bureau-nuit.png'
    },
    {
        slug: 'calcul-dso-formule-2025',
        title: 'Comment calculer son DSO (formule PCG 2025)',
        description: 'Guide complet pour calculer le DSO avec exemples pratiques et benchmarks sectoriels français',
        date: '16 décembre 2025',
        readTime: '8 min',
        category: 'KPIs',
        tags: ['DSO', 'Trésorerie', 'Formule', 'PCG 2025'],
        image: '/images/vue-NY.png'
    },
    {
        slug: '5-kpis-financiers-pme',
        title: 'Les 5 KPIs financiers essentiels pour PME',
        description: 'Découvrez les indicateurs clés que tout dirigeant de PME devrait suivre mensuellement',
        date: '18 décembre 2025',
        readTime: '6 min',
        category: 'Gestion',
        tags: ['KPIs', 'PME', 'Indicateurs', 'Pilotage'],
        image: '/images/bureau.png'
    },
    {
        slug: 'bfr-formule-optimisation',
        title: 'BFR : formule de calcul et optimisation 2025',
        description: 'Tout savoir sur le Besoin en Fonds de Roulement : calcul, interprétation et leviers d\'optimisation',
        date: '17 décembre 2025',
        readTime: '10 min',
        category: 'Trésorerie',
        tags: ['BFR', 'Trésorerie', 'Optimisation', 'Formule'],
        image: '/images/bfr.png'   
    },
    {
        slug: 'marge-nette-vs-brute',
        title: 'Marge nette vs marge brute : différences et calculs',
        description: 'Comprenez la différence entre marge brute et marge nette avec formules et benchmarks sectoriels',
        date: '10 décembre 2025',
        readTime: '7 min',
        category: 'Rentabilité',
        tags: ['Marges', 'Rentabilité', 'Calcul', 'Benchmark'],
        image: '/images/marge.png'
    },
    {
        slug: 'cash-flow-previsionnel-pme',
        title: 'Cash flow prévisionnel : méthode pratique pour PME',
        description: 'Guide complet pour construire un cash flow prévisionnel fiable et anticiper vos besoins de trésorerie',
        date: '5 décembre 2025',
        readTime: '9 min',
        category: 'Trésorerie',
        tags: ['Cash Flow', 'Prévisionnel', 'PME', 'Méthode'],
        image: '/images/cash-flow-prev.png',
    },
    {
        slug: 'top-7-kpis-startups-saas',
        title: 'Top 7 KPIs financiers pour startups SaaS',
        description: 'Les indicateurs essentiels pour piloter une startup SaaS : MRR, Churn, CAC, LTV et plus',
        date: '2 décembre 2025',
        readTime: '8 min',
        category: 'SaaS',
        tags: ['SaaS', 'MRR', 'Churn', 'CAC', 'LTV'],
        image: '/images/7kpisfiSaaS.png'
    },
    {
        slug: 'creances-clients-reduire-impayes',
        title: 'Créances clients : comment réduire les impayés',
        description: 'Stratégies concrètes pour améliorer le recouvrement et diminuer les retards de paiement',
        date: '25 novembre 2025',
        readTime: '7 min',
        category: 'Recouvrement',
        tags: ['Créances', 'Impayés', 'Recouvrement', 'DSO'],
        image: '/images/impayés.png'
    },
    {
        slug: 'tresorerie-pme-5-erreurs-eviter',
        title: 'Trésorerie PME : 5 erreurs à éviter',
        description: 'Les erreurs fréquentes qui mettent en péril la trésorerie des PME et comment les éviter',
        date: '18 novembre 2025',
        readTime: '6 min',
        category: 'Trésorerie',
        tags: ['Trésorerie', 'PME', 'Erreurs', 'Conseils'],
        image: '/images/5-erreurs.png'
    },
    {
        slug: 'ratio-liquidite-interpretation',
        title: 'Ratio de liquidité : interpréter les résultats',
        description: 'Comprendre les ratios de liquidité et évaluer la santé financière de votre entreprise',
        date: '12 novembre 2025',
        readTime: '8 min',
        category: 'Analyse',
        tags: ['Ratios', 'Liquidité', 'Analyse', 'Santé financière'],
        image: '/images/ratio-liquidité.png'
    },
    {
        slug: 'budget-previsionnel-dashboard-ia',
        title: 'Budget prévisionnel : template Excel vs dashboard IA',
        description: 'Comparaison des méthodes pour construire et suivre votre budget prévisionnel efficacement',
        date: '5 novembre 2025',
        readTime: '7 min',
        category: 'Outils',
        tags: ['Budget', 'IA', 'Excel', 'Dashboard'],
        image: '/images/moi-bureau.png'
    },
    // SEO optimized articles (January 2026)
    {
        slug: 'reduire-dso-50-pourcent-90-jours',
        title: 'Réduire son DSO de 50% en 90 jours : Guide Pratique',
        description: 'Méthode éprouvée pour améliorer votre DSO et libérer jusqu\'à 200k€ de trésorerie. 10 actions concrètes + cas client.',
        date: '28 janvier 2026',
        readTime: '12 min',
        category: 'Trésorerie',
        tags: ['DSO', 'Réduire DSO', 'Trésorerie', 'Recouvrement', 'PME'],
        featured: true,
        image: '/images/bureau-nuit.png'
    },
    {
        slug: 'bfr-negatif-bon-ou-mauvais',
        title: 'BFR Négatif : Bon ou Mauvais pour Votre Entreprise ?',
        description: 'Un BFR négatif est-il signe de bonne santé ou de danger ? Exemples par secteur : grande distribution, SaaS, e-commerce.',
        date: '28 janvier 2026',
        readTime: '10 min',
        category: 'Trésorerie',
        tags: ['BFR', 'BFR Négatif', 'Trésorerie', 'Analyse'],
        image: '/images/bfr.png'
    },
    {
        slug: 'dso-vs-dpo-optimiser-tresorerie',
        title: 'DSO vs DPO : Optimiser l\'Équilibre Clients-Fournisseurs',
        description: 'Comprendre la différence DSO/DPO et optimiser votre Cash Conversion Cycle pour libérer de la trésorerie.',
        date: '28 janvier 2026',
        readTime: '9 min',
        category: 'Trésorerie',
        tags: ['DSO', 'DPO', 'Cash Conversion Cycle', 'Trésorerie'],
        image: '/images/vue-NY.png'
    },
    // SEO Priority Articles (February 2026)
    {
        slug: 'daf-externalise-pme-prix-2026',
        title: 'DAF Externalisé PME : Prix, Tarifs et ROI en 2026',
        description: 'Combien coûte un DAF externalisé pour une PME ? Grille tarifaire 2026, comparaison DAF temps plein vs externalisé, et calcul du ROI réel.',
        date: '6 février 2026',
        readTime: '15 min',
        category: 'Gestion',
        tags: ['DAF Externalisé', 'Prix', 'Tarifs', 'ROI', 'PME', 'CFO'],
        featured: true,
        image: '/images/bureau.png'
    },
    {
        slug: 'probleme-tresorerie-pme-10-signes',
        title: 'Problème de Trésorerie PME : 10 Signes d\'Alerte (et Solutions)',
        description: 'Comment détecter un problème de trésorerie avant qu\'il ne soit trop tard ? 10 signaux d\'alerte + plan d\'action en 30 jours.',
        date: '6 février 2026',
        readTime: '12 min',
        category: 'Trésorerie',
        tags: ['Problème Trésorerie', 'PME', 'Alerte', 'Cash', 'Solutions'],
        featured: true,
        image: '/images/bureau-nuit.png'
    },
    {
        slug: 'calculer-bfr-excel-template-2026',
        title: 'Calculer son BFR avec Excel : Template Gratuit 2026',
        description: 'Tutoriel complet pour calculer et analyser votre BFR dans Excel. Template gratuit + formules automatiques + exemples par secteur.',
        date: '6 février 2026',
        readTime: '10 min',
        category: 'Trésorerie',
        tags: ['BFR', 'Excel', 'Template', 'Calcul', 'Formules'],
        image: '/images/bfr.png'
    },
    {
        slug: 'pilotage-tresorerie-90-jours-methode',
        title: 'Pilotage Trésorerie 90 Jours : Méthode Complète PME',
        description: 'Comment piloter sa trésorerie sur 90 jours ? Méthode éprouvée avec prévisionnel, suivi hebdomadaire et alertes automatiques.',
        date: '6 février 2026',
        readTime: '14 min',
        category: 'Trésorerie',
        tags: ['Pilotage Trésorerie', '90 Jours', 'Prévisionnel', 'Méthode', 'PME'],
        image: '/images/cash-flow-prev.png'
    },
    {
        slug: 'fractional-cfo-france-guide-2026',
        title: 'Fractional CFO France : Guide Complet 2026',
        description: 'Qu\'est-ce qu\'un Fractional CFO ? Différences avec DAF externalisé, cas d\'usage, tarifs et comment choisir le bon profil pour votre PME.',
        date: '6 février 2026',
        readTime: '13 min',
        category: 'Gestion',
        tags: ['Fractional CFO', 'CFO', 'DAF', 'France', 'Guide'],
        image: '/images/moi-bureau.png'
    }
]

// Catégorie icons
const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    'Note Stratégique': {
        icon: <Shield className="w-4 h-4" />,
        color: 'text-slate-800',
        bg: 'bg-slate-200'
    },
    'Étude de cas': {
        icon: <TrendingDown className="w-4 h-4" />,
        color: 'text-emerald-800',
        bg: 'bg-emerald-100'
    },
    'Trésorerie': { 
        icon: <DollarSign className="w-4 h-4" />, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-100' 
    },
    'KPIs': { 
        icon: <TrendingUp className="w-4 h-4" />, 
        color: 'text-blue-600', 
        bg: 'bg-blue-100' 
    },
    'SaaS': { 
        icon: <Sparkles className="w-4 h-4" />, 
        color: 'text-purple-600', 
        bg: 'bg-purple-100' 
    },
    'Gestion': { 
        icon: <BarChart3 className="w-4 h-4" />, 
        color: 'text-orange-600', 
        bg: 'bg-orange-100' 
    },
    'Rentabilité': { 
        icon: <Target className="w-4 h-4" />, 
        color: 'text-rose-600', 
        bg: 'bg-rose-100' 
    },
    'Recouvrement': { 
        icon: <FileText className="w-4 h-4" />, 
        color: 'text-amber-600', 
        bg: 'bg-amber-100' 
    },
    'Analyse': { 
        icon: <BookOpen className="w-4 h-4" />, 
        color: 'text-cyan-600', 
        bg: 'bg-cyan-100' 
    },
    'Outils': { 
        icon: <Sparkles className="w-4 h-4" />, 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-100' 
    }
}

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous')

    const categories = ['Tous', ...Array.from(new Set(blogPosts.map(p => p.category)))]

    const filteredPosts = useMemo(() => {
        return blogPosts.filter(post => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [searchQuery, selectedCategory])

    const featuredPost = filteredPosts.find(p => p.featured)
    const regularPosts = filteredPosts.filter(p => !p.featured)

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* ============================================
                HERO SECTION - Premium Blog Style
               ============================================ */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/bureau-nuit.png"
                        alt="Blog Finance"
                        fill
                        className="object-cover opacity-15"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
                </div>

                {/* Decorative */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-accent-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-6">
                            <BookOpen className="w-4 h-4 text-accent-primary" />
                            <span className="text-accent-primary text-sm font-semibold">
                                Ressources Finance & Data
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Guides, formules et
                            <span className="text-accent-primary"> best practices</span>
                            <br />pour le pilotage financier
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                            Méthodes éprouvées, exemples concrets et benchmarks sectoriels 
                            pour optimiser la gestion de votre PME.
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-8 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <FileText className="w-4 h-4 text-accent-primary" />
                                <span><strong className="text-white">{blogPosts.length}</strong> articles</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <TrendingUp className="w-4 h-4 text-accent-primary" />
                                <span><strong className="text-white">{categories.length - 1}</strong> catégories</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-4 h-4 text-accent-primary" />
                                <span>Mis à jour <strong className="text-white">chaque semaine</strong></span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============================================
                SEARCH & FILTERS
               ============================================ */}
            <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un article..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all text-sm"
                            />
                        </div>

                        {/* Category Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {categories.map((category) => {
                                const config = categoryConfig[category]
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                            selectedCategory === category
                                                ? 'bg-accent-primary text-white shadow-md'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {config?.icon}
                                        {category}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                FEATURED ARTICLE
               ============================================ */}
            {featuredPost && selectedCategory === 'Tous' && (
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href={`/blog/${featuredPost.slug}`} className="group block">
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                                {/* Background Image */}
                                {featuredPost.image && (
                                    <div className="absolute inset-0">
                                        <Image
                                            src={featuredPost.image}
                                            alt={featuredPost.title}
                                            fill
                                            className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
                                    </div>
                                )}

                                <div className="relative p-8 lg:p-12">
                                    <div className="max-w-2xl">
                                        {/* Badge Featured */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-primary rounded-full mb-6">
                                            <Sparkles className="w-4 h-4 text-white" />
                                            <span className="text-white text-xs font-bold uppercase tracking-wider">
                                                À la une
                                            </span>
                                        </div>

                                        {/* Category */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${categoryConfig[featuredPost.category]?.bg} ${categoryConfig[featuredPost.category]?.color}`}>
                                                {categoryConfig[featuredPost.category]?.icon}
                                                {featuredPost.category}
                                            </span>
                                            <span className="text-slate-400 text-sm">{featuredPost.date}</span>
                                            <span className="text-slate-500">•</span>
                                            <span className="text-slate-400 text-sm">{featuredPost.readTime} de lecture</span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-accent-primary transition-colors leading-tight">
                                            {featuredPost.title}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                                            {featuredPost.description}
                                        </p>

                                        {/* CTA */}
                                        <div className="inline-flex items-center gap-2 text-accent-primary font-semibold group-hover:gap-4 transition-all">
                                            Lire l&apos;article
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </section>
            )}

            {/* ============================================
                ARTICLES GRID
               ============================================ */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {regularPosts.length > 0 ? (
                    <>
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {selectedCategory === 'Tous' ? 'Tous les articles' : selectedCategory}
                            </h2>
                            <span className="text-sm text-slate-500">
                                {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {regularPosts.map((post, index) => {
                                const isStrategique = post.type === 'strategique'
                                return (
                                <motion.div
                                    key={post.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link 
                                        href={`/blog/${post.slug}`}
                                        className="group block h-full"
                                    >
                                        <article className={`h-full rounded-2xl overflow-hidden transition-all duration-300 ${
                                            isStrategique
                                                ? 'bg-slate-950 border border-slate-800 hover:border-slate-600 hover:shadow-2xl hover:shadow-slate-900/50'
                                                : 'bg-white border border-slate-200 hover:shadow-xl hover:border-accent-primary/50'
                                        }`}>
                                            {/* Image */}
                                            <div className={`relative h-48 overflow-hidden ${
                                                isStrategique
                                                    ? 'bg-gradient-to-br from-slate-900 to-slate-800'
                                                    : 'bg-gradient-to-br from-slate-100 to-slate-200'
                                            }`}>
                                                {post.image ? (
                                                    <Image
                                                        src={post.image}
                                                        alt={post.title}
                                                        fill
                                                        className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                                                            isStrategique ? 'opacity-30' : ''
                                                        }`}
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className={`w-16 h-16 rounded-2xl ${categoryConfig[post.category]?.bg || 'bg-slate-200'} flex items-center justify-center`}>
                                                            <span className={`${categoryConfig[post.category]?.color || 'text-slate-400'}`}>
                                                                {categoryConfig[post.category]?.icon || <FileText className="w-8 h-8" />}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Category Badge */}
                                                <div className="absolute top-4 left-4">
                                                    {post.category === 'Étude de cas' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 backdrop-blur-sm border border-emerald-400/30">
                                                            <TrendingDown className="w-3.5 h-3.5" />
                                                            Étude de cas
                                                        </span>
                                                    ) : isStrategique ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-sm border border-white/20">
                                                            <Shield className="w-3.5 h-3.5" />
                                                            Note Stratégique
                                                        </span>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${categoryConfig[post.category]?.bg} ${categoryConfig[post.category]?.color}`}>
                                                            {categoryConfig[post.category]?.icon}
                                                            {post.category}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Filet vertical Note Stratégique */}
                                                {isStrategique && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className={`p-6 ${isStrategique ? 'border-l-2 border-slate-700 ml-0' : ''}`}>
                                                {/* Meta */}
                                                <div className={`flex items-center gap-3 text-sm mb-3 ${
                                                    isStrategique ? 'text-slate-500' : 'text-slate-500'
                                                }`}>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        {post.date}
                                                    </span>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        {post.readTime}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className={`text-lg font-bold mb-3 line-clamp-2 leading-snug transition-colors ${
                                                    isStrategique
                                                        ? 'text-white font-serif group-hover:text-slate-300'
                                                        : 'text-slate-900 group-hover:text-accent-primary'
                                                }`}>
                                                    {post.title}
                                                </h3>

                                                {/* Description */}
                                                <p className={`text-sm leading-relaxed line-clamp-2 mb-4 ${
                                                    isStrategique ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                    {post.description}
                                                </p>

                                                {/* Read More */}
                                                <div className={`flex items-center gap-2 font-medium text-sm group-hover:gap-3 transition-all ${
                                                    isStrategique ? 'text-slate-400 group-hover:text-white' : 'text-accent-primary'
                                                }`}>
                                                    {post.category === 'Étude de cas' ? 'Voir les résultats' : isStrategique ? 'Lire l\u2019analyse' : 'Lire l\u2019article'}
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                                )
                            })}
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun article trouvé</h3>
                        <p className="text-slate-600 mb-6">
                            Essayez de modifier votre recherche ou sélectionner une autre catégorie
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedCategory('Tous')
                            }}
                            className="px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold hover:bg-accent-primary-hover transition-all"
                        >
                            Voir tous les articles
                        </button>
                    </div>
                )}
            </section>

            {/* ============================================
                CTA SECTION
               ============================================ */}
            <section className="relative py-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <Image
                        src="/images/bureau.png"
                        alt="CTA Background"
                        fill
                        className="object-cover opacity-10"
                    />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-accent-primary" />
                            <span className="text-accent-primary text-sm font-semibold">
                                Prêt à agir ?
                            </span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                            Votre structure financière est-elle réellement optimisée ?
                        </h2>

                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            DSO au-dessus de la médiane, BFR qui dérive, marges qui s&apos;érodent sans que personne ne le voie — un diagnostic structuré identifie les fuites de cash avant qu&apos;elles ne deviennent critiques.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/diagnostic/guide"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 text-lg font-bold rounded-xl shadow-xl hover:bg-slate-100 transition-all"
                            >
                                <Zap className="w-5 h-5" />
                                Lancer mon diagnostic
                            </Link>
                            <a
                                href="https://calendly.com/zineinsight/15min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
                            >
                                Échanger sur ma situation
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>

                        <p className="text-slate-400 text-sm mt-8">
                            ✓ Confidentiel • ✓ Sans engagement • ✓ Réponse sous 24h
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

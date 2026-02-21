/**
 * SEO UTILITIES - FinSight
 * Helpers pour metadata, structured data, et optimisations SEO
 */

import type { Metadata } from 'next'

const SITE_URL = 'https://finsight.zineinsight.com'
const SITE_NAME = 'FinSight'
const SITE_DESCRIPTION = 'DAF externalisé & analyse financière pour PME. Pilotage de trésorerie, tableau de bord et agents IA pour dirigeants et directeurs financiers.'

// ============================================
// DATE HELPERS
// ============================================

const MONTHS_FR: Record<string, string> = {
    'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
    'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
    'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
}

/**
 * Converts a French date string like "21 février 2026" or an ISO string "2026-02-21"
 * to a valid ISO 8601 string. Falls back to current date if parsing fails.
 */
function parseDateToISO(dateStr: string): string {
    if (!dateStr) return new Date().toISOString()
    // Already ISO format
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const d = new Date(dateStr)
        return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
    }
    // French format: "21 février 2026"
    const match = dateStr.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/)
    if (match) {
        const day = match[1].padStart(2, '0')
        const month = MONTHS_FR[match[2].toLowerCase()]
        const year = match[3]
        if (month) {
            const d = new Date(`${year}-${month}-${day}T00:00:00Z`)
            if (!isNaN(d.getTime())) return d.toISOString()
        }
    }
    // Fallback: try native parse
    const fallback = new Date(dateStr)
    return isNaN(fallback.getTime()) ? new Date().toISOString() : fallback.toISOString()
}

// ============================================
// METADATA GENERATORS
// ============================================

interface SEOPageProps {
    title: string
    description: string
    path: string
    keywords?: string[]
    image?: string
    publishedTime?: string
    modifiedTime?: string
    author?: string
    type?: 'website' | 'article'
}

/**
 * Generate complete metadata for a page
 */
export function generateSEOMetadata({
    title,
    description,
    path,
    keywords = [],
    image = '/images/og-default.png',
    publishedTime,
    modifiedTime,
    author = 'FinSight',
    type = 'website'
}: SEOPageProps): Metadata {
    const url = `${SITE_URL}${path}`
    const fullTitle = title.includes('FinSight') ? title : `${title} | ${SITE_NAME}`

    return {
        title: fullTitle,
        description,
        keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
        authors: author ? [{ name: author }] : undefined,
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_NAME,
            locale: 'fr_FR',
            type,
            images: [
                {
                    url: `${SITE_URL}${image}`,
                    width: 1200,
                    height: 630,
                    alt: title
                }
            ],
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime })
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [`${SITE_URL}${image}`]
        },
        alternates: {
            canonical: url
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
                'max-video-preview': -1
            }
        }
    }
}

/**
 * Generate metadata for blog article
 */
export function generateBlogMetadata({
    slug,
    title,
    description,
    keywords = [],
    publishedDate,
    readTime,
    category
}: {
    slug: string
    title: string
    description: string
    keywords?: string[]
    publishedDate: string
    readTime: string
    category: string
}): Metadata {
    return generateSEOMetadata({
        title,
        description,
        path: `/blog/${slug}`,
        keywords: [
            ...keywords,
            'finance',
            'kpi financiers',
            'cfo',
            'daf',
            'pme',
            category.toLowerCase()
        ],
        publishedTime: parseDateToISO(publishedDate),
        modifiedTime: parseDateToISO(publishedDate),
        type: 'article'
    })
}

/**
 * Generate metadata for calculator page
 */
export function generateCalculatorMetadata({
    name,
    slug,
    description,
    keywords = []
}: {
    name: string
    slug: string
    description: string
    keywords?: string[]
}): Metadata {
    return generateSEOMetadata({
        title: `Calculateur ${name} gratuit`,
        description,
        path: `/calculateurs/${slug}`,
        keywords: [
            ...keywords,
            'calculateur gratuit',
            'outil finance',
            'calcul financier',
            'pme',
            'cfo',
            'daf'
        ]
    })
}

// ============================================
// JSON-LD STRUCTURED DATA
// ============================================

/**
 * Generate Article JSON-LD
 */
export function generateArticleJsonLd({
    title,
    description,
    slug,
    publishedDate,
    modifiedDate,
    author = 'FinSight',
    category
}: {
    title: string
    description: string
    slug: string
    publishedDate: string
    modifiedDate?: string
    author?: string
    category: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        image: `${SITE_URL}/images/og-default.png`,
        datePublished: parseDateToISO(publishedDate),
        dateModified: modifiedDate
            ? parseDateToISO(modifiedDate)
            : parseDateToISO(publishedDate),
        author: {
            '@type': 'Organization',
            name: author,
            url: SITE_URL
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/blog/${slug}`
        },
        articleSection: category,
        inLanguage: 'fr-FR'
    }
}

/**
 * Generate HowTo JSON-LD (for calculators)
 */
export function generateHowToJsonLd({
    name,
    description,
    slug,
    steps
}: {
    name: string
    description: string
    slug: string
    steps: Array<{ name: string; text: string }>
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        description,
        image: `${SITE_URL}/images/og-default.png`,
        step: steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text
        })),
        inLanguage: 'fr-FR',
        url: `${SITE_URL}/calculateurs/${slug}`
    }
}

/**
 * Generate FAQPage JSON-LD
 */
export function generateFAQJsonLd(
    questions: Array<{ question: string; answer: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer
            }
        }))
    }
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbJsonLd(
    items: Array<{ name: string; path: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}${item.path}`
        }))
    }
}

/**
 * Generate Organization JSON-LD
 */
export function generateOrganizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description: SITE_DESCRIPTION,
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Support',
            email: 'contact@finsight.fr'
        },
        sameAs: [
            'https://www.linkedin.com/company/finsight',
            'https://twitter.com/finsight'
        ]
    }
}

/**
 * Generate WebApplication JSON-LD
 */
export function generateWebApplicationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'EUR'
        }
    }
}

// ============================================
// SITEMAP UTILITIES
// ============================================

export interface SitemapEntry {
    url: string
    lastModified: Date
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority?: number
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry(
    path: string,
    options: {
        lastModified?: Date
        changeFrequency?: SitemapEntry['changeFrequency']
        priority?: number
    } = {}
): SitemapEntry {
    return {
        url: `${SITE_URL}${path}`,
        lastModified: options.lastModified || new Date(),
        changeFrequency: options.changeFrequency || 'monthly',
        priority: options.priority || 0.5
    }
}

// ============================================
// BLOG ARTICLE DATA
// ============================================

export interface BlogArticleData {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
    keywords: string[]
}

/**
 * List of all blog articles for sitemap and metadata generation
 */
export const BLOG_ARTICLES: BlogArticleData[] = [
    {
        slug: 'calcul-dso-formule-2025',
        title: 'Comment calculer son DSO (formule PCG 2025)',
        description: 'Guide complet pour calculer le DSO avec exemples pratiques et benchmarks sectoriels français',
        date: '2025-11-28',
        readTime: '8 min',
        category: 'KPIs',
        keywords: ['dso', 'délai paiement', 'créances clients', 'pcg 2025', 'kpi financier']
    },
    {
        slug: '5-kpis-financiers-pme',
        title: 'Les 5 KPIs financiers essentiels pour PME',
        description: 'Découvrez les indicateurs clés que tout dirigeant de PME devrait suivre mensuellement',
        date: '2025-11-28',
        readTime: '6 min',
        category: 'Gestion',
        keywords: ['kpi financier', 'pme', 'indicateurs', 'pilotage', 'gestion financière']
    },
    {
        slug: 'bfr-formule-optimisation',
        title: 'BFR : formule de calcul et optimisation 2025',
        description: 'Tout savoir sur le Besoin en Fonds de Roulement : calcul, interprétation et leviers d\'optimisation pour PME',
        date: '2025-11-28',
        readTime: '10 min',
        category: 'Trésorerie',
        keywords: ['bfr', 'besoin fonds roulement', 'trésorerie', 'stocks', 'fournisseurs', 'pcg']
    },
    {
        slug: 'marge-nette-vs-brute',
        title: 'Marge nette vs marge brute : différences et calculs',
        description: 'Comprenez la différence entre marge brute et marge nette, avec formules de calcul et benchmarks sectoriels',
        date: '2025-11-28',
        readTime: '7 min',
        category: 'Rentabilité',
        keywords: ['marge nette', 'marge brute', 'rentabilité', 'profitabilité', 'ebitda']
    },
    {
        slug: 'cash-flow-previsionnel-pme',
        title: 'Cash flow prévisionnel : méthode pratique pour PME',
        description: 'Guide complet pour construire un cash flow prévisionnel fiable et anticiper vos besoins de trésorerie',
        date: '2025-11-28',
        readTime: '9 min',
        category: 'Trésorerie',
        keywords: ['cash flow', 'prévisionnel', 'trésorerie', 'budget', 'pme']
    },
    {
        slug: 'top-7-kpis-startups-saas',
        title: 'Top 7 KPIs financiers pour startups SaaS',
        description: 'Les indicateurs essentiels à suivre pour piloter efficacement une startup SaaS : MRR, Churn, CAC, LTV',
        date: '2025-11-28',
        readTime: '8 min',
        category: 'SaaS',
        keywords: ['kpi saas', 'mrr', 'arr', 'churn', 'cac', 'ltv', 'startup']
    },
    {
        slug: 'creances-clients-reduire-impayes',
        title: 'Créances clients : comment réduire les impayés',
        description: 'Stratégies concrètes pour améliorer le recouvrement et diminuer les retards de paiement clients',
        date: '2025-11-28',
        readTime: '7 min',
        category: 'Recouvrement',
        keywords: ['créances', 'impayés', 'recouvrement', 'relance', 'facture', 'dso']
    },
    {
        slug: 'tresorerie-pme-5-erreurs-eviter',
        title: 'Trésorerie PME : 5 erreurs à éviter',
        description: 'Les erreurs fréquentes qui mettent en péril la trésorerie des PME et comment les éviter',
        date: '2025-11-28',
        readTime: '6 min',
        category: 'Trésorerie',
        keywords: ['trésorerie', 'pme', 'erreurs', 'cash', 'gestion financière']
    },
    {
        slug: 'ratio-liquidite-interpretation',
        title: 'Ratio de liquidité : interpréter les résultats',
        description: 'Comprendre les ratios de liquidité (current ratio, quick ratio) et évaluer la santé financière de votre entreprise',
        date: '2025-11-28',
        readTime: '8 min',
        category: 'Analyse',
        keywords: ['ratio liquidité', 'current ratio', 'quick ratio', 'solvabilité', 'analyse financière']
    },
    {
        slug: 'budget-previsionnel-dashboard-ia',
        title: 'Budget prévisionnel : template Excel vs dashboard IA',
        description: 'Comparaison des méthodes traditionnelles et modernes pour construire et suivre votre budget prévisionnel',
        date: '2025-11-28',
        readTime: '7 min',
        category: 'Outils',
        keywords: ['budget', 'prévisionnel', 'excel', 'ia', 'automatisation', 'dashboard']
    },
    // SEO Priority Articles (February 2026)
    {
        slug: 'daf-externalise-pme-prix-2026',
        title: 'DAF Externalisé PME : Prix, Tarifs et ROI en 2026',
        description: 'Combien coûte un DAF externalisé pour une PME ? Grille tarifaire 2026, comparaison DAF temps plein vs externalisé, et calcul du ROI réel.',
        date: '2026-02-06',
        readTime: '15 min',
        category: 'Gestion',
        keywords: ['daf externalisé prix', 'tarif daf externalisé', 'coût daf pme', 'fractional cfo prix', 'roi daf']
    },
    {
        slug: 'probleme-tresorerie-pme-10-signes',
        title: 'Problème de Trésorerie PME : 10 Signes d\'Alerte (et Solutions)',
        description: 'Comment détecter un problème de trésorerie avant qu\'il ne soit trop tard ? 10 signaux d\'alerte + plan d\'action en 30 jours.',
        date: '2026-02-06',
        readTime: '12 min',
        category: 'Trésorerie',
        keywords: ['problème trésorerie pme', 'difficulté trésorerie', 'alerte trésorerie', 'manque cash', 'solutions trésorerie']
    },
    {
        slug: 'calculer-bfr-excel-template-2026',
        title: 'Calculer son BFR avec Excel : Template Gratuit 2026',
        description: 'Tutoriel complet pour calculer et analyser votre BFR dans Excel. Template gratuit + formules automatiques + exemples par secteur.',
        date: '2026-02-06',
        readTime: '10 min',
        category: 'Trésorerie',
        keywords: ['calculer bfr excel', 'template bfr gratuit', 'formule bfr excel', 'bfr tutorial', 'besoin fonds roulement excel']
    },
    {
        slug: 'pilotage-tresorerie-90-jours-methode',
        title: 'Pilotage Trésorerie 90 Jours : Méthode Complète PME',
        description: 'Comment piloter sa trésorerie sur 90 jours ? Méthode éprouvée avec prévisionnel, suivi hebdomadaire et alertes automatiques.',
        date: '2026-02-06',
        readTime: '14 min',
        category: 'Trésorerie',
        keywords: ['pilotage trésorerie', 'prévisionnel 90 jours', 'gestion trésorerie pme', 'suivi trésorerie', 'cash management']
    },
    {
        slug: 'fractional-cfo-france-guide-2026',
        title: 'Fractional CFO France : Guide Complet 2026',
        description: 'Qu\'est-ce qu\'un Fractional CFO ? Différences avec DAF externalisé, cas d\'usage, tarifs et comment choisir le bon profil pour votre PME.',
        date: '2026-02-06',
        readTime: '13 min',
        category: 'Gestion',
        keywords: ['fractional cfo france', 'cfo temps partiel', 'daf externalisé', 'part-time cfo', 'cfo pme']
    },
    {
        slug: 'dso-superieur-mediane-sectorielle-modele',
        title: 'DSO supérieur à la médiane sectorielle : que révèle vraiment votre modèle ?',
        description: 'Un DSO élevé n\'est pas qu\'un problème de recouvrement. C\'est souvent le symptôme d\'un déséquilibre structurel entre modèle commercial et organisation financière.',
        date: '2026-02-21',
        readTime: '11 min',
        category: 'Note Stratégique',
        keywords: ['dso', 'délai paiement clients', 'trésorerie', 'modèle commercial', 'cash management']
    },
    {
        slug: 'bfr-structurellement-eleve-commercial-organisationnel',
        title: 'BFR structurellement élevé : problème commercial ou problème organisationnel ?',
        description: 'Quand le BFR dépasse durablement les normes sectorielles, la cause est rarement unique. Lecture croisée des facteurs commerciaux, opérationnels et financiers.',
        date: '2026-02-21',
        readTime: '13 min',
        category: 'Note Stratégique',
        keywords: ['bfr', 'besoin fonds roulement', 'trésorerie pme', 'cycle exploitation', 'cash']
    },
    {
        slug: 'pme-sous-estiment-fragilite-cash',
        title: 'Pourquoi 70 % des PME sous-estiment leur fragilité cash',
        description: 'La rentabilité masque souvent une vulnérabilité de trésorerie. Analyse des mécanismes qui conduisent les PME rentables à une impasse de liquidité.',
        date: '2026-02-21',
        readTime: '10 min',
        category: 'Note Stratégique',
        keywords: ['trésorerie pme', 'fragilité cash', 'liquidité', 'pilotage financier']
    },
    {
        slug: 'marge-correcte-cash-fragile-piege-croissance',
        title: 'Marge correcte, cash fragile : le piège classique des PME en croissance',
        description: 'Une marge brute confortable ne protège pas de la rupture de trésorerie. Pourquoi la croissance est le moment le plus dangereux pour le cash.',
        date: '2026-02-21',
        readTime: '12 min',
        category: 'Note Stratégique',
        keywords: ['marge brute', 'trésorerie', 'pme croissance', 'cash flow', 'bfr']
    },
    {
        slug: 'daf-externalise-vs-expert-comptable-confusion',
        title: 'DAF externalisé vs expert-comptable : rôles et confusion dangereuse',
        description: 'L\'expert-comptable produit les comptes. Le DAF les interprète et arbitre. Confondre les deux expose l\'entreprise à des décisions prises sans lecture financière.',
        date: '2026-02-21',
        readTime: '9 min',
        category: 'Note Stratégique',
        keywords: ['daf externalisé', 'expert comptable', 'direction financière', 'pilotage pme']
    },
    {
        slug: 'a-partir-quel-ca-faut-il-un-daf',
        title: 'À partir de quel chiffre d\'affaires faut-il un DAF ?',
        description: 'Le seuil de complexité financière ne dépend pas que du CA. Nombre de clients, saisonnalité, BFR structurel : les vrais critères de déclenchement.',
        date: '2026-02-21',
        readTime: '10 min',
        category: 'Note Stratégique',
        keywords: ['daf externalisé', 'daf pme', 'direction financière externalisée', 'quand recruter daf']
    },
    {
        slug: '4-priorites-daf-90-jours',
        title: 'Les 4 priorités d\'un DAF sur 90 jours',
        description: 'Trésorerie, marge, structure, reporting : la séquence d\'intervention d\'un DAF qui prend un mandat. Ce qui se joue dans les 3 premiers mois.',
        date: '2026-02-21',
        readTime: '11 min',
        category: 'Note Stratégique',
        keywords: ['daf externalisé', 'direction financière', 'pilotage financier', '90 jours']
    },
    {
        slug: 'pilotage-financier-change-pme-5-20m',
        title: 'Ce qu\'un vrai pilotage financier change dans une PME 5–20M€',
        description: 'Avant/après : les transformations concrètes quand une PME passe d\'une comptabilité subie à un pilotage financier structuré.',
        date: '2026-02-21',
        readTime: '14 min',
        category: 'Note Stratégique',
        keywords: ['pilotage financier', 'pme', 'tableaux de bord', 'daf', 'reporting financier']
    },
    {
        slug: 'reduire-dso-50-pourcent-90-jours',
        title: 'Réduire son DSO de 50% en 90 jours : Guide Pratique PME (2026)',
        description: 'Méthode éprouvée pour améliorer votre DSO et libérer jusqu\'à 200k€ de trésorerie. 10 actions concrètes + cas client avant/après.',
        date: '2026-01-28',
        readTime: '12 min',
        category: 'Trésorerie',
        keywords: ['réduire dso', 'dso 2026', 'trésorerie pme', 'délai paiement', 'cash management']
    },
    {
        slug: 'bfr-negatif-bon-ou-mauvais',
        title: 'BFR Négatif : Est-ce Bon ou Mauvais pour Votre Entreprise ? (Guide 2026)',
        description: 'Un BFR négatif est-il signe de bonne santé ou de danger ? Explication complète avec exemples par secteur (grande distribution, SaaS, e-commerce).',
        date: '2026-01-28',
        readTime: '10 min',
        category: 'Analyse',
        keywords: ['bfr négatif', 'besoin fonds roulement', 'cash flow', 'saas', 'grande distribution']
    },
    {
        slug: 'dso-vs-dpo-optimiser-tresorerie',
        title: 'DSO vs DPO : Comment Optimiser l\'Équilibre Clients-Fournisseurs (2026)',
        description: 'Comprendre la différence DSO/DPO et optimiser votre Cash Conversion Cycle. Formules, exemples et stratégies pour libérer de la trésorerie.',
        date: '2026-01-28',
        readTime: '9 min',
        category: 'Trésorerie',
        keywords: ['dso', 'dpo', 'cash conversion cycle', 'trésorerie', 'fournisseurs clients']
    },
    {
        slug: 'pme-b2b-6m-240k-cash-libere-4-mois',
        title: 'Comment une PME B2B à 6M€ a libéré 240k€ de cash en 4 mois',
        description: 'Étude de cas : DSO à 62 jours, BFR structurel élevé, trésorerie tendue. La séquence d\'intervention complète et les résultats chiffrés.',
        date: '2026-02-21',
        readTime: '11 min',
        category: 'Étude de cas',
        keywords: ['étude de cas', 'trésorerie pme', 'dso', 'cash libéré', 'daf externalisé']
    },
    {
        slug: 'reduire-dso-62-41-jours-relation-client',
        title: 'Comment réduire un DSO de 62 à 41 jours sans détériorer la relation client',
        description: 'Cas client réel : de 62 à 41 jours de DSO en 90 jours. Méthode, actions concrètes et résultats chiffrés sur une PME services B2B.',
        date: '2026-02-21',
        readTime: '10 min',
        category: 'Étude de cas',
        keywords: ['réduire dso', 'relation client', 'pme b2b', 'cash management', 'recouvrement']
    },
    {
        slug: 'pme-8m-risque-dependance-sous-estime',
        title: 'Pourquoi cette PME à 8M€ de CA sous-estimait son risque de dépendance',
        description: 'Étude de cas : quand 3 clients concentrent 72% du CA, le risque de dépendance est systémique. Comment l\'identifier et le corriger.',
        date: '2026-02-21',
        readTime: '12 min',
        category: 'Étude de cas',
        keywords: ['risque dépendance client', 'concentration client', 'pme', 'diagnostic financier', 'daf']
    },
    {
        slug: 'lire-bilan-compte-resultat-guide-pratique',
        title: 'Lire un bilan et un compte de résultat : guide pratique',
        description: 'Apprenez à décrypter vos états financiers en 15 minutes : bilan, compte de résultat, signaux d\'alerte et questions à poser à votre comptable.',
        date: '2026-01-25',
        readTime: '12 min',
        category: 'Gestion',
        keywords: ['bilan comptable', 'compte de résultat', 'états financiers', 'lecture bilan', 'comptabilité pme']
    },
    {
        slug: 'eva-roic-illusion-performance',
        title: 'Pourquoi une entreprise rentable peut détruire de la valeur',
        description: 'EVA, ROIC et WACC : découvrez pourquoi la rentabilité comptable ne suffit pas et comment mesurer la création de valeur réelle.',
        date: '2026-01-25',
        readTime: '14 min',
        category: 'Analyse',
        keywords: ['eva', 'roic', 'wacc', 'création de valeur', 'rentabilité économique', 'performance financière']
    }
]

/**
 * Get article metadata by slug
 */
export function getArticleBySlug(slug: string): BlogArticleData | undefined {
    return BLOG_ARTICLES.find((article) => article.slug === slug)
}

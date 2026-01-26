/**
 * SEO UTILITIES - FinSight
 * Helpers pour metadata, structured data, et optimisations SEO
 */

import type { Metadata } from 'next'

const SITE_URL = 'https://getfinsight.fr'
const SITE_NAME = 'FinSight'
const SITE_DESCRIPTION = 'Dashboard financier intelligent pour CFO et DAF. Analyse automatique de vos données comptables avec IA.'

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
        publishedTime: new Date(publishedDate).toISOString(),
        modifiedTime: new Date(publishedDate).toISOString(),
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
        datePublished: new Date(publishedDate).toISOString(),
        dateModified: modifiedDate
            ? new Date(modifiedDate).toISOString()
            : new Date(publishedDate).toISOString(),
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
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '127'
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
    }
]

/**
 * Get article metadata by slug
 */
export function getArticleBySlug(slug: string): BlogArticleData | undefined {
    return BLOG_ARTICLES.find((article) => article.slug === slug)
}

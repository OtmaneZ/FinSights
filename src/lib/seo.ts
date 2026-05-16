/**
 * SEO UTILITIES - FinSight
 * Helpers pour metadata, structured data, et optimisations SEO
 */

import type { Metadata } from 'next'

const SITE_URL = 'https://finsight.zineinsight.com'
const SITE_NAME = 'FinSight'
const SITE_DESCRIPTION = 'Architecte de pilotage financier pour PME ambitieuses. Pilotage de trésorerie, tableau de bord et agents IA pour dirigeants et directeurs financiers.'

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
// BLOG ARTICLE DATA (source: articlesRegistry)
// ============================================

export type { BlogArticleData } from '@/lib/blog/articlesRegistry'
export { BLOG_ARTICLES_FROM_REGISTRY as BLOG_ARTICLES } from '@/lib/blog/articlesRegistry'

import {
    getRegistryEntry,
    toBlogArticleData,
    type BlogArticleData,
} from '@/lib/blog/articlesRegistry'

export function getArticleBySlug(slug: string): BlogArticleData | undefined {
    const entry = getRegistryEntry(slug)
    return entry ? toBlogArticleData(entry) : undefined
}

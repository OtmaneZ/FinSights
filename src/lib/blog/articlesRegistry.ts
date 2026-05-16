import { BLOG_REGISTRY_ENTRIES } from './registryData'

/** Métadonnées article pour SEO, sitemap et layout [slug] */
export interface BlogArticleData {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
    keywords: string[]
}

export type BlogArticleType = 'operationnel' | 'strategique'

export interface BlogArticleRegistryEntry {
    slug: string
    title: string
    description: string
    /** Date affichée sur le blog (libellé FR) */
    displayDate: string
    /** Date ISO pour sitemap / JSON-LD */
    publishedAt: string
    readTime: string
    category: string
    tags: string[]
    keywords: string[]
    featured?: boolean
    image?: string
    type?: BlogArticleType
}

export const BLOG_ARTICLE_REGISTRY: BlogArticleRegistryEntry[] = BLOG_REGISTRY_ENTRIES

export function getRegistryEntry(slug: string): BlogArticleRegistryEntry | undefined {
    return BLOG_ARTICLE_REGISTRY.find((a) => a.slug === slug)
}

/** Métadonnées SEO / sitemap / generateStaticParams */
export function toBlogArticleData(entry: BlogArticleRegistryEntry): BlogArticleData {
    return {
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        date: entry.publishedAt,
        readTime: entry.readTime,
        category: entry.category,
        keywords: entry.keywords,
    }
}

export const BLOG_ARTICLES_FROM_REGISTRY: BlogArticleData[] =
    BLOG_ARTICLE_REGISTRY.map(toBlogArticleData)

/** Index /blog (cartes, filtres) */
export interface BlogIndexPost {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
    tags: string[]
    featured?: boolean
    image?: string
    type?: BlogArticleType
}

export function toBlogIndexPost(entry: BlogArticleRegistryEntry): BlogIndexPost {
    return {
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        date: entry.displayDate,
        readTime: entry.readTime,
        category: entry.category,
        tags: entry.tags,
        featured: entry.featured,
        image: entry.image,
        type: entry.type,
    }
}

export const BLOG_INDEX_POSTS: BlogIndexPost[] = BLOG_ARTICLE_REGISTRY.map(toBlogIndexPost)

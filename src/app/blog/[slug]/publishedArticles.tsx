import type { ReactNode } from 'react'
import { articleBody as pgeDsoBody } from '../content/pge-dso-double-pression-tresorerie-2026'
import { articleBody as iaFinanceBody } from '../content/ia-finance-entreprise-grands-groupes-industrialisent-pme-experimentent-2026'
import { articleBody as dashboardAgentsBody } from '../content/dashboard-financier-mort-agents-ia-2026'
import { articleBody as cinqErreursBody } from '../content/5-erreurs-tresorerie-pme'
import { articleBody as ebitdaBody } from '../content/ebitda-vs-resultat-net-banquier'
import { articleBody as dsoDpoDioBody } from '../content/dso-dpo-dio-trois-indicateurs-tresorerie'
import { getRegistryEntry } from '@/lib/blog/articlesRegistry'

export interface PublishedBlogArticle {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
    image?: string
    content: ReactNode
}

function fromRegistry(
    slug: string,
    content: ReactNode,
): PublishedBlogArticle | null {
    const entry = getRegistryEntry(slug)
    if (!entry) return null
    return {
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        date: entry.displayDate,
        readTime: entry.readTime,
        category: entry.category,
        image: entry.image,
        content,
    }
}

/** Articles migrés depuis les anciennes routes statiques /blog/{slug}/page.tsx */
export const publishedArticles: Record<string, PublishedBlogArticle> = {
    'dso-dpo-dio-trois-indicateurs-tresorerie': fromRegistry('dso-dpo-dio-trois-indicateurs-tresorerie', dsoDpoDioBody)!,
    'ebitda-vs-resultat-net-banquier': fromRegistry('ebitda-vs-resultat-net-banquier', ebitdaBody)!,
    'pge-dso-double-pression-tresorerie-2026': fromRegistry(
        'pge-dso-double-pression-tresorerie-2026',
        pgeDsoBody,
    )!,
    'ia-finance-entreprise-grands-groupes-industrialisent-pme-experimentent-2026': fromRegistry(
        'ia-finance-entreprise-grands-groupes-industrialisent-pme-experimentent-2026',
        iaFinanceBody,
    )!,
    'dashboard-financier-mort-agents-ia-2026': fromRegistry(
        'dashboard-financier-mort-agents-ia-2026',
        dashboardAgentsBody,
    )!,
    '5-erreurs-tresorerie-pme': fromRegistry('5-erreurs-tresorerie-pme', cinqErreursBody)!,
}

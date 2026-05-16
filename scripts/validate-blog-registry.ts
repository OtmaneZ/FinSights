/**
 * Vérifie la cohérence registre ↔ contenu [slug] (sans exécuter le JSX).
 * Usage: npx tsx scripts/validate-blog-registry.ts
 */
import fs from 'fs'
import path from 'path'
import { BLOG_ARTICLE_REGISTRY, BLOG_ARTICLES_FROM_REGISTRY } from '../src/lib/blog/articlesRegistry'

const ROOT = path.join(__dirname, '..')
const SLUG_DIR = path.join(ROOT, 'src/app/blog/[slug]')

const BASE_ARTICLE_SLUGS = [
    'lire-bilan-compte-resultat-guide-pratique',
    'eva-roic-illusion-performance',
    'calcul-dso-formule-2025',
    '5-kpis-financiers-pme',
    'bfr-formule-optimisation',
    'marge-nette-vs-brute',
    'cash-flow-previsionnel-pme',
]

const PUBLISHED_ARTICLE_SLUGS = [
    'pge-dso-double-pression-tresorerie-2026',
    'ia-finance-entreprise-grands-groupes-industrialisent-pme-experimentent-2026',
    'dashboard-financier-mort-agents-ia-2026',
    '5-erreurs-tresorerie-pme',
]

const CONTENT_FILES = [
    'additionalArticles.tsx',
    'moreArticles.tsx',
    'finalArticles.tsx',
    'seoArticles.tsx',
    'strategicArticles.tsx',
    'caseStudyArticles.tsx',
    'publishedArticles.tsx',
]

function slugsFromFile(filePath: string): string[] {
    const src = fs.readFileSync(filePath, 'utf8')
    return [...src.matchAll(/slug: '([^']+)'/g)].map((m) => m[1])
}

const contentSlugs = new Set<string>([
    ...BASE_ARTICLE_SLUGS,
    ...CONTENT_FILES.flatMap((f) => slugsFromFile(path.join(SLUG_DIR, f))),
    ...PUBLISHED_ARTICLE_SLUGS,
])

const registrySlugs = new Set(BLOG_ARTICLE_REGISTRY.map((a) => a.slug))
const seoSlugs = new Set(BLOG_ARTICLES_FROM_REGISTRY.map((a) => a.slug))

let failed = false

function fail(msg: string) {
    console.error(`✗ ${msg}`)
    failed = true
}

function ok(msg: string) {
    console.log(`✓ ${msg}`)
}

for (const slug of registrySlugs) {
    if (!contentSlugs.has(slug)) {
        fail(`Registre sans contenu [slug]: ${slug}`)
    }
}

for (const slug of contentSlugs) {
    if (!registrySlugs.has(slug)) {
        fail(`Contenu [slug] absent du registre: ${slug}`)
    }
}

if (registrySlugs.size !== seoSlugs.size) {
    fail(`Taille registre (${registrySlugs.size}) ≠ export SEO (${seoSlugs.size})`)
}

for (const slug of registrySlugs) {
    if (!seoSlugs.has(slug)) fail(`Slug manquant dans export SEO: ${slug}`)
}

if (BLOG_ARTICLE_REGISTRY.length !== registrySlugs.size) {
    fail(`Doublons dans le registre`)
}

if (!failed) {
    ok(`${registrySlugs.size} articles - registre, SEO et contenu alignés`)
}

process.exit(failed ? 1 : 0)

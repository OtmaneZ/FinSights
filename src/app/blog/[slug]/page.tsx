import { notFound } from 'next/navigation'
import { BLOG_ARTICLES } from '@/lib/seo'
import { BlogArticlePageClient } from './BlogArticlePageClient'

interface PageProps {
    params: { slug: string }
}

export default function BlogArticlePage({ params }: PageProps) {
    const article = BLOG_ARTICLES.find((a) => a.slug === params.slug)
    if (!article) {
        notFound()
    }

    return <BlogArticlePageClient slug={params.slug} />
}

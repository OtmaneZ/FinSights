import { Metadata } from 'next'
import { getArticleBySlug } from '@/lib/seo'

interface SlugLayoutProps {
    children: React.ReactNode
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const article = getArticleBySlug(params.slug)
    
    if (!article) {
        return {
            title: '404 - Article non trouvé',
            robots: { index: false, follow: false }
        }
    }

    return {
        title: `${article.title} | FinSight Blog`,
        description: article.description,
        keywords: [article.category, 'finance', 'pme', 'daf', article.title.split(' ')[0]],
        openGraph: {
            type: 'article',
            title: article.title,
            description: article.description,
            url: `https://finsight.zineinsight.com/blog/${article.slug}`,
            images: [{
                url: 'https://finsight.zineinsight.com/images/og-blog.png',
                width: 1200,
                height: 630,
                alt: article.title
            }],
            publishedTime: article.date,
            authors: ['FinSight']
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.description,
            images: ['https://finsight.zineinsight.com/images/og-blog.png']
        },
        alternates: {
            canonical: `https://finsight.zineinsight.com/blog/${article.slug}`
        },
        robots: {
            index: true,
            follow: true
        }
    }
}

export default function SlugLayout({ children }: SlugLayoutProps) {
    return <>{children}</>
}

export const metadata = {
    title: 'Blog FinSight - Notes Stratégiques & Guides Finance | DAF Externalisé',
    description: 'Notes stratégiques et guides opérationnels pour dirigeants de PME : DSO, BFR, pilotage cash, marge, direction financière externalisée. Benchmarks France 2026.',
    keywords: ['blog finance', 'DAF externalisé', 'note stratégique', 'pilotage financier', 'DSO', 'BFR', 'trésorerie PME', 'direction financière'],
    openGraph: {
        type: 'website',
        title: 'Blog FinSight - Notes Stratégiques & Guides Finance',
        description: 'Notes stratégiques, analyses structurelles et guides opérationnels pour le pilotage financier des PME.',
        url: 'https://finsight.zineinsight.com/blog',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-blog.png',
            width: 1200,
            height: 630,
            alt: 'Blog FinSight Finance'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog FinSight - Notes Stratégiques & Guides Finance',
        description: 'Analyses structurelles, pilotage financier et direction financière externalisée pour PME.',
        images: ['https://finsight.zineinsight.com/images/og-blog.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/blog'
    }
}

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

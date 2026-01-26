export const metadata = {
    title: 'Blog FinSight - Guides Finance CFO & DAF | KPIs, DSO, BFR, Trésorerie',
    description: '10+ guides gratuits pour CFO et DAF : calculer DSO, BFR, ratios financiers, budget prévisionnel, trésorerie. Benchmarks sectoriels France 2025.',
    keywords: ['blog finance', 'guide CFO', 'KPI financier', 'DSO', 'BFR', 'trésorerie', 'budget prévisionnel', 'benchmark finance'],
    openGraph: {
        type: 'website',
        title: 'Blog FinSight - Guides Finance pour CFO & DAF',
        description: '10+ guides pratiques : DSO, BFR, ratios, trésorerie, budget. Benchmarks France 2025.',
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
        title: 'Blog FinSight - Guides Finance CFO & DAF',
        description: '10+ guides gratuits : DSO, BFR, ratios, trésorerie',
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

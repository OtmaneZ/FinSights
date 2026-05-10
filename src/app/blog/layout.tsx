export const metadata = {
    title: 'Blog Finance PME - Notes Stratégiques & Guides Pilotage | FinSight',
    description: '33 articles sur le pilotage financier PME : DSO, BFR, marge, trésorerie. Notes stratégiques et guides pratiques pour dirigeants.',
    keywords: ['blog finance', 'DAF externalisé', 'note stratégique', 'pilotage financier', 'DSO', 'BFR', 'trésorerie PME', 'direction financière'],
    openGraph: {
        type: 'website',
        title: 'Blog Finance PME - Notes Stratégiques & Guides Pilotage | FinSight',
        description: '33 articles sur le pilotage financier PME : DSO, BFR, marge, trésorerie. Notes stratégiques et guides pratiques pour dirigeants.',
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
        title: 'Blog Finance PME - Notes Stratégiques & Guides Pilotage | FinSight',
        description: '33 articles sur le pilotage financier PME : DSO, BFR, marge, trésorerie. Notes stratégiques et guides pratiques pour dirigeants.',
        images: ['https://finsight.zineinsight.com/images/og-blog.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/blog'
    },
    robots: {
        index: true,
        follow: true,
    }
}

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

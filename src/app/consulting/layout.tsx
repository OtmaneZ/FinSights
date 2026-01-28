import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Consulting Finance | DAF Externalisé & Pilotage Financier - FinSight',
    description: 'Expertise DAF externalisé pour TPE/PME : audit financier, pilotage de trésorerie, levée de fonds, construction de business model. Obtenez des recommandations stratégiques actionnables par un expert finance senior.',
    keywords: [
        'daf externalisé',
        'directeur financier externe',
        'consulting finance pme',
        'audit financier',
        'pilotage trésorerie',
        'levée de fonds',
        'fractional cfo',
        'expert comptable stratégique'
    ],
    openGraph: {
        title: 'Consulting Finance | DAF Externalisé pour TPE/PME',
        description: 'Expertise DAF externalisé : audit, pilotage, levée de fonds. Bénéficiez de l\'expérience d\'un CFO senior sans le coût d\'un temps plein.',
        url: 'https://finsight.zineinsight.com/consulting',
        siteName: 'FinSight',
        images: [
            {
                url: 'https://finsight.zineinsight.com/og-consulting.png',
                width: 1200,
                height: 630,
                alt: 'FinSight Consulting - DAF Externalisé'
            }
        ],
        locale: 'fr_FR',
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Consulting Finance | DAF Externalisé pour TPE/PME',
        description: 'Expertise DAF externalisé : audit, pilotage, levée de fonds. Sans le coût d\'un temps plein.',
        images: ['https://finsight.zineinsight.com/og-consulting.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/consulting'
    }
}

export default function ConsultingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

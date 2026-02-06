import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'DAF Externalisé PME (1-100M€) | Conseil Finance & Pilotage Trésorerie - Otmane Boulahia',
    description: 'DAF externalisé pour dirigeants PME. Audit financier, pilotage trésorerie 90j, tableaux de bord IA. 10+ ans d\'expérience. Diagnostic gratuit 30 min. Tarif dès 1200€/mois.',
    keywords: [
        'daf externalisé',
        'daf externalisé pme',
        'directeur financier externe',
        'consulting finance pme',
        'conseil finance pme',
        'pilotage trésorerie pme',
        'fractional cfo france',
        'audit financier pme',
        'consultant finance freelance',
        'daf à temps partagé'
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

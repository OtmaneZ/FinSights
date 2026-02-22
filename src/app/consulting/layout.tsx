import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Direction Financière Externalisée PME (2M€ à 20M€) | Audit & Pilotage Stratégique - FinSight',
    description: 'Direction financière externalisée pour dirigeants PME ambitieux. Score FinSight™, audit stratégique, pilotage trésorerie 90j, agents IA. Échange stratégique 30 min offert.',
    keywords: [
        'direction financière externalisée',
        'daf externalisé pme',
        'pilotage financier stratégique',
        'consulting finance pme',
        'audit financier pme',
        'pilotage trésorerie pme',
        'fractional cfo france',
        'score finsight',
        'consultant finance dirigeant',
        'daf à temps partagé'
    ],
    openGraph: {
        title: 'Direction Financière Externalisée | Audit & Pilotage PME | FinSight',
        description: 'Structurez votre pilotage financier. Score FinSight™, audit stratégique, agents IA. Pour dirigeants PME de 2M€ à 20M€.',
        url: 'https://finsight.zineinsight.com/consulting',
        siteName: 'FinSight',
        images: [
            {
                url: 'https://finsight.zineinsight.com/og-consulting.png',
                width: 1200,
                height: 630,
                alt: 'FinSight - Direction Financière Externalisée'
            }
        ],
        locale: 'fr_FR',
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Direction Financière Externalisée | FinSight',
        description: 'Score FinSight™ + audit stratégique + pilotage augmenté. Pour dirigeants PME ambitieux.',
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

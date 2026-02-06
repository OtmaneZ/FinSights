import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'DAF Externalisé PME (1-50M€) | Pilotage Trésorerie & Finance Stratégique',
    description: 'DAF externalisé à temps partagé pour PME ambitieuses. Visibilité trésorerie 90 jours, optimisation marges, pilotage financier. Diagnostic gratuit 30 min. Dès 1490€.',
    keywords: [
        'daf externalisé',
        'daf externalisé pme',
        'daf temps partagé',
        'daf externalisé prix',
        'fractional cfo france',
        'directeur financier externalisé',
        'pilotage trésorerie pme',
        'daf à temps partagé tarif',
        'cfo externe pme',
        'direction financière externalisée'
    ],
    openGraph: {
        title: 'DAF Externalisé PME | Pilotez Votre Trésorerie Sans Recruter',
        description: 'Expertise CFO à temps partagé pour PME 1-50M€. Visibilité trésorerie 90 jours, marges optimisées. Diagnostic gratuit.',
        url: 'https://finsight.zineinsight.com/daf-externalise-pme',
        type: 'website',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-daf-externalise.png',
            width: 1200,
            height: 630,
            alt: 'DAF Externalisé PME - FinSight'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DAF Externalisé PME | Pilotage Trésorerie',
        description: 'Expertise CFO à temps partagé pour PME 1-50M€. Diagnostic gratuit 30 min.',
        images: ['https://finsight.zineinsight.com/images/og-daf-externalise.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/daf-externalise-pme'
    }
}

export default function DAFExternalisePMELayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}

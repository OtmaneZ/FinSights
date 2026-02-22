import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tarifs DAF Externalisé PME | Diagnostic 2 490€ · Audit 6 990€ — FinSight',
    description:
        'Tarifs transparents pour les missions de direction financière externalisée FinSight. Diagnostic FinSight™ 90J dès 2 490 €, Audit Complet 6 990 €, Decision System 12 500 €. PME de 2 à 20 M€ de CA.',
    keywords: [
        'tarifs daf externalisé',
        'prix audit financier pme',
        'coût direction financière externalisée',
        'tarifs diagnostic financier',
        'prix pilotage trésorerie pme',
        'daf externalisé coût',
        'prix conseil financier pme',
        'tarif daf temps partagé',
    ],
    openGraph: {
        title: 'Tarifs DAF Externalisé — FinSight | De 2 490 € à 12 500 €',
        description:
            'Trois niveaux d\'accompagnement financier pour PME. Diagnostic 2 490 €, Audit Complet 6 990 €, Decision System 12 500 €. Sans engagement.',
        url: 'https://finsight.zineinsight.com/tarifs',
        siteName: 'FinSight',
        images: [
            {
                url: 'https://finsight.zineinsight.com/og-pricing.png',
                width: 1200,
                height: 630,
                alt: 'FinSight — Tarifs DAF Externalisé PME',
            },
        ],
        locale: 'fr_FR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tarifs DAF Externalisé — FinSight',
        description:
            'Diagnostic dès 2 490 €, Audit Complet 6 990 €, Decision System 12 500 €. PME 2–20 M€ CA.',
        images: ['https://finsight.zineinsight.com/og-pricing.png'],
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/tarifs',
    },
}

export default function TarifsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

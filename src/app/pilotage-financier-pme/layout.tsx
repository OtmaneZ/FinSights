import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Guide complet du pilotage financier PME (2026) | FinSight',
    description:
        'Méthode structurée de pilotage financier pour PME de 1 à 100 M\u20AC. Indicateurs cl\u00E9s, tableau de bord, pr\u00E9visionnel de tr\u00E9sorerie 90 jours et r\u00F4le du DAF externalis\u00E9.',
    keywords: [
        'pilotage financier pme',
        'indicateurs financiers pme',
        'dashboard financier pme',
        'pilotage trésorerie pme',
        'daf externalisé pme',
        'direction financière externalisée pme',
        'tableau de bord financier pme',
        'kpi financier pme',
        'bfr pme',
        'dso pme',
        'marge nette pme',
        'cash flow prévisionnel',
    ],
    alternates: {
        canonical: 'https://finsight.zineinsight.com/pilotage-financier-pme',
    },
    openGraph: {
        type: 'article',
        locale: 'fr_FR',
        url: 'https://finsight.zineinsight.com/pilotage-financier-pme',
        siteName: 'FinSight',
        title: 'Guide complet du pilotage financier PME (2026)',
        description:
            'Méthode structurée de pilotage financier pour PME. Indicateurs, tableau de bord, trésorerie 90 jours et rôle du DAF externalisé.',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-default.png',
                width: 1200,
                height: 630,
                alt: 'Guide pilotage financier PME — FinSight',
            },
        ],
        publishedTime: '2026-02-22',
        authors: ['Otmane Boulahia'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Guide complet du pilotage financier PME (2026)',
        description:
            'Indicateurs clés, tableau de bord, prévisionnel de trésorerie et rôle du DAF externalisé. Méthode structurée pour dirigeants PME.',
        images: ['https://finsight.zineinsight.com/images/og-default.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function PilotageFinancierLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

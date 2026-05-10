import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pilotage Financier PME : méthode, outils et KPIs | FinSight',
    description:
        'Calculez votre DSO, BFR et marge en 2 minutes. Guide complet du pilotage financier pour dirigeants PME 2M€-20M€. Gratuit.',
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
        title: 'Pilotage Financier PME : méthode, outils et KPIs | FinSight',
        description:
            'Calculez votre DSO, BFR et marge en 2 minutes. Guide complet du pilotage financier pour dirigeants PME 2M€-20M€. Gratuit.',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-default.png',
                width: 1200,
                height: 630,
                alt: 'Guide pilotage financier PME - FinSight',
            },
        ],
        publishedTime: '2026-02-22',
        authors: ['Otmane Boulahia'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pilotage Financier PME : méthode, outils et KPIs | FinSight',
        description:
            'Calculez votre DSO, BFR et marge en 2 minutes. Guide complet du pilotage financier pour dirigeants PME 2M€-20M€. Gratuit.',
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

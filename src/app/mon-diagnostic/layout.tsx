import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Mon Diagnostic Financier - Score FinSight™ | FinSight',
    description:
        'Votre Score FinSight™ (0→100) sur 4 piliers : Cash, Marges, Résilience, Risques. Diagnostic financier PME gratuit, résultat immédiat.',
    alternates: {
        canonical: 'https://finsight.zineinsight.com/mon-diagnostic',
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://finsight.zineinsight.com/mon-diagnostic',
        siteName: 'FinSight',
        title: 'Mon Diagnostic Financier - Score FinSight™ | FinSight',
        description:
            'Votre Score FinSight™ (0→100) sur 4 piliers : Cash, Marges, Résilience, Risques. Diagnostic financier PME gratuit, résultat immédiat.',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-default.png',
                width: 1200,
                height: 630,
                alt: 'Diagnostic financier PME - Score FinSight™',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mon Diagnostic Financier - Score FinSight™ | FinSight',
        description:
            'Votre Score FinSight™ (0→100) sur 4 piliers : Cash, Marges, Résilience, Risques. Diagnostic financier PME gratuit, résultat immédiat.',
        images: ['https://finsight.zineinsight.com/images/og-default.png'],
    },
    robots: {
        index: false,
        follow: true,
    },
}

export default function MonDiagnosticLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

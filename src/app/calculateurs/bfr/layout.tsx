import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Simulateur BFR Gratuit 2026 : Calculez votre Besoin en Fonds de Roulement',
    description: 'Calculez votre BFR en 30 secondes avec notre simulateur gratuit. Formule PCG, benchmarks sectoriels et conseils d\'optimisation. Utilisé par 500+ dirigeants de PME.',
    keywords: 'simulateur calcul bfr, calculateur bfr gratuit, besoin fonds roulement pme, bfr formule, bfr négatif, optimiser bfr, trésorerie pme, working capital',
    openGraph: {
        title: 'Simulateur BFR Gratuit 2026 | Calculez en 30 secondes',
        description: 'Calculateur BFR avec interprétation automatique et benchmarks par secteur. Découvrez combien de trésorerie immobilise votre cycle d\'exploitation.',
        url: 'https://finsight.zineinsight.com/calculateurs/bfr',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-bfr.png',
                width: 1200,
                height: 630,
                alt: 'Simulateur BFR gratuit FinSight - Calculez votre Besoin en Fonds de Roulement',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Simulateur BFR Gratuit 2026 | FinSight',
        description: 'Calculez votre Besoin en Fonds de Roulement en 30 secondes. Formule PCG + benchmarks sectoriels.',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/bfr',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function BFRLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

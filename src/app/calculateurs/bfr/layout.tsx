import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Simulateur BFR : Calculez votre Besoin en Fonds de Roulement',
    description: 'Combien de cash est bloqué dans vos stocks et créances ? Simulez votre BFR sans inscription. Inclus : benchmarks sectoriels + leviers de déblocage cash. Gratuit.',
    keywords: 'simulateur calcul bfr, calculateur bfr gratuit, besoin fonds roulement pme, bfr formule, bfr négatif, optimiser bfr, trésorerie pme, working capital, cash immobilisé',
    openGraph: {
        title: 'Simulateur BFR | Calculez votre Besoin en Fonds de Roulement',
        description: 'Combien de cash bloqué dans vos stocks/créances ? Calculez BFR + benchmarks sectoriels + leviers déblocage. Sans inscription.',
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
        title: 'Simulateur BFR | Besoin en Fonds de Roulement',
        description: 'Calculez votre BFR + interprétation DAF expert + leviers d\'optimisation. Sans inscription.',
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

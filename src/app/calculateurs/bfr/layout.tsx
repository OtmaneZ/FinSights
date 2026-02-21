import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Analyse BFR — Évaluez votre Besoin en Fonds de Roulement | FinSight',
    description: 'Combien de cash immobilisé dans vos stocks et créances ? Évaluez votre BFR, comparez aux benchmarks sectoriels et identifiez vos leviers de déblocage cash.',
    keywords: 'analyse bfr, calculateur bfr, besoin fonds roulement pme, bfr formule, bfr négatif, optimiser bfr, trésorerie pme, working capital, cash immobilisé, pré-diagnostic financier',
    openGraph: {
        title: 'Analyse BFR — Besoin en Fonds de Roulement | FinSight',
        description: 'Évaluez votre BFR + benchmarks sectoriels + leviers de déblocage cash. Premier niveau de diagnostic financier.',
        url: 'https://finsight.zineinsight.com/calculateurs/bfr',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-bfr.png',
                width: 1200,
                height: 630,
                alt: 'Analyse BFR FinSight - Besoin en Fonds de Roulement',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Analyse BFR — Besoin en Fonds de Roulement | FinSight',
        description: 'Évaluez votre BFR + interprétation DAF expert + leviers d\'optimisation.',
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

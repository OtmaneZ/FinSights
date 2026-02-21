import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur BFR 2026 – Besoin en Fonds de Roulement en 30s | PME & Dirigeants',
    description: 'Calculez votre BFR en 30 secondes et découvrez combien de cash est immobilisé dans vos stocks et créances. Benchmarks sectoriels 2026, interprétation DAF, leviers de libération cash. Outil pour dirigeants PME.',
    keywords: 'calculateur bfr 2026, analyse bfr, besoin fonds roulement pme, bfr formule, bfr négatif, optimiser bfr, trésorerie pme, working capital, cash immobilisé, pré-diagnostic financier, bfr pme',
    openGraph: {
        title: 'Calculateur BFR 2026 – Besoin en Fonds de Roulement en 30s | PME',
        description: 'Calculez votre BFR en 30 secondes. Cash immobilisé, benchmarks sectoriels 2026, leviers de libération. Outil de diagnostic DAF pour PME.',
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
        title: 'Calculateur BFR 2026 – Fonds de Roulement en 30s | PME',
        description: 'BFR en 30 secondes + cash immobilisé + benchmarks sectoriels + leviers d\'optimisation.',
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

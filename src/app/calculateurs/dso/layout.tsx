import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur DSO Gratuit — Délai de Paiement & Cash Immobilisé | FinSight',
    description: 'Calculez votre DSO en 30 secondes : combien de trésorerie est bloquée chez vos clients ? Benchmarks sectoriels Banque de France 2024, score FinSight, leviers pour réduire votre DSO. Outil DAF pour PME 2–20 M€.',
    keywords: 'calculateur dso gratuit, dso calcul en ligne, simulateur calcul dso, formule dso, days sales outstanding pme, réduire dso, délai paiement clients, dso moyen secteur banque de france, créances clients pme, cash immobilisé dso',
    openGraph: {
        title: 'Calculateur DSO Gratuit — Libérez du Cash en 30 secondes | FinSight',
        description: 'Combien de trésorerie est bloquée chez vos clients ? Calculez votre DSO et comparez-le aux médianes sectorielles Banque de France 2024.',
        url: 'https://finsight.zineinsight.com/calculateurs/dso',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-dso.png',
                width: 1200,
                height: 630,
                alt: 'Calculateur DSO FinSight - Benchmarks sectoriels & cash immobilisé',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calculateur DSO Gratuit — Cash Immobilisé en 30s | FinSight',
        description: 'DSO en 30 secondes + benchmarks sectoriels Banque de France 2024 + leviers cash. Outil DAF pour PME.',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/dso',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function DSOLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

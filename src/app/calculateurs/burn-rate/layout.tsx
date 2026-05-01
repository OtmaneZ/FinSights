import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur Burn Rate & Runway 2026 — Trésorerie PME | FinSight',
    description: 'Calculez votre burn rate net, votre runway (mois) et votre date de rupture cash. Niveau d’alerte visuel vert/orange/rouge pour décider vite.',
    keywords: 'calculateur burn rate, runway pme, simulation trésorerie startup, date rupture cash, burn rate net, calcul runway',
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/burn-rate',
    },
    openGraph: {
        title: 'Calculateur Burn Rate & Runway — Alerte Cash | FinSight',
        description: 'Anticipez votre rupture de trésorerie avec burn rate net + runway en mois.',
        url: 'https://finsight.zineinsight.com/calculateurs/burn-rate',
        type: 'website',
    },
}

export default function BurnRatePathLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

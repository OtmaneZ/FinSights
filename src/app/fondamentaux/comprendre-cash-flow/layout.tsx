import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Comprendre le Cash Flow : Guide Complet PME (2026) | FinSight',
    description: 'Qu\'est-ce que le cash flow ? Comment le calculer, l\'interpréter et l\'optimiser ? Cash flow opérationnel, d\'investissement et de financement expliqués avec exemples PME.',
    keywords: [
        'comprendre cash flow',
        'cash flow pme',
        'flux de trésorerie',
        'cash flow opérationnel',
        'free cash flow',
        'gestion trésorerie pme',
        'différence résultat trésorerie',
    ],
    openGraph: {
        title: 'Comprendre le Cash Flow : Guide Complet PME | FinSight',
        description: 'Cash flow opérationnel, d\'investissement, de financement : tout comprendre avec exemples chiffrés. Guide gratuit pour PME.',
        url: 'https://finsight.zineinsight.com/fondamentaux/comprendre-cash-flow',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'article',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-default.png',
            width: 1200,
            height: 630,
            alt: 'Comprendre le cash flow - Guide PME'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Comprendre le Cash Flow | Guide PME - FinSight',
        description: 'Cash flow, flux de trésorerie, free cash flow : guide pratique pour PME.',
        images: ['https://finsight.zineinsight.com/images/og-default.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/fondamentaux/comprendre-cash-flow'
    },
    robots: { index: true, follow: true }
}

export default function ComprendreCashFlowLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}

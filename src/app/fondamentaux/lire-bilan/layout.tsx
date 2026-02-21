import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Lire un Bilan Comptable : Guide Pratique PME (2026) | FinSight',
    description: 'Comment lire et interpréter un bilan comptable en 15 minutes ? Actif, passif, capitaux propres, ratios clés et signaux d\'alerte. Guide illustré pour dirigeants PME.',
    keywords: [
        'lire un bilan comptable',
        'comprendre le bilan',
        'actif passif bilan',
        'capitaux propres pme',
        'interprétation bilan',
        'analyse bilan comptable',
        'bilan simplifié pme',
    ],
    openGraph: {
        title: 'Lire un Bilan Comptable : Guide Pratique PME | FinSight',
        description: 'Décryptez votre bilan comptable en 15 min : actif, passif, ratios clés et signaux d\'alerte. Guide gratuit pour dirigeants.',
        url: 'https://finsight.zineinsight.com/fondamentaux/lire-bilan',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'article',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-default.png',
            width: 1200,
            height: 630,
            alt: 'Lire un bilan comptable - Guide PME'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lire un Bilan Comptable | Guide PME - FinSight',
        description: 'Actif, passif, capitaux propres : décryptez votre bilan en 15 minutes.',
        images: ['https://finsight.zineinsight.com/images/og-default.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/fondamentaux/lire-bilan'
    },
    robots: { index: true, follow: true }
}

export default function LireBilanLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}

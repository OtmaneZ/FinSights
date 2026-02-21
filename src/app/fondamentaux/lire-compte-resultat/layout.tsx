import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Lire un Compte de Résultat : Guide Complet PME (2026) | FinSight',
    description: 'Comment lire et analyser un compte de résultat ? Du chiffre d\'affaires au résultat net : marge brute, EBE, EBITDA. Guide pratique avec exemples chiffrés pour PME.',
    keywords: [
        'lire compte de résultat',
        'comprendre compte de résultat',
        'résultat net pme',
        'marge brute calcul',
        'ebitda pme',
        'analyse compte résultat',
        'soldes intermédiaires gestion',
    ],
    openGraph: {
        title: 'Lire un Compte de Résultat : Guide Complet PME | FinSight',
        description: 'Du CA au résultat net : décryptez votre compte de résultat avec exemples chiffrés. Guide gratuit pour dirigeants PME.',
        url: 'https://finsight.zineinsight.com/fondamentaux/lire-compte-resultat',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'article',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-default.png',
            width: 1200,
            height: 630,
            alt: 'Lire un compte de résultat - Guide PME'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lire un Compte de Résultat | Guide PME - FinSight',
        description: 'CA, marge brute, EBITDA, résultat net : tout comprendre en un guide.',
        images: ['https://finsight.zineinsight.com/images/og-default.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/fondamentaux/lire-compte-resultat'
    },
    robots: { index: true, follow: true }
}

export default function LireCompteResultatLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}

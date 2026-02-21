import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Fondamentaux Finance PME | Bilan, Résultat, Cash Flow — FinSight',
    description: 'Maîtrisez les fondamentaux financiers de votre PME : lire un bilan, comprendre le compte de résultat, gérer le cash flow, analyser les ratios clés. Guides pratiques gratuits.',
    keywords: [
        'fondamentaux finance pme',
        'lire un bilan',
        'comprendre compte de résultat',
        'cash flow entreprise',
        'ratios financiers pme',
        'guide finance dirigeant',
        'comptabilité pme expliquée',
    ],
    openGraph: {
        title: 'Fondamentaux Finance PME | Guides Pratiques Gratuits - FinSight',
        description: 'Guides pratiques pour maîtriser les fondamentaux financiers : bilan, résultat, cash flow, ratios. Gratuit, pour dirigeants PME.',
        url: 'https://finsight.zineinsight.com/fondamentaux',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-default.png',
            width: 1200,
            height: 630,
            alt: 'Fondamentaux Finance PME - FinSight'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Fondamentaux Finance PME | Guides Gratuits - FinSight',
        description: 'Guides pratiques : lire un bilan, compte de résultat, cash flow, ratios financiers.',
        images: ['https://finsight.zineinsight.com/images/og-default.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/fondamentaux'
    },
    robots: { index: true, follow: true }
}

export default function FondamentauxLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}

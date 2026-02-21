import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Analyse ROI — Retour sur Investissement & Délai de Rentabilité | FinSight',
    description: 'Quel est le vrai retour de vos investissements ? Évaluez ROI + payback, comparez aux benchmarks par type de projet et identifiez la rentabilité réelle.',
    keywords: 'analyse roi, return on investment calcul, retour sur investissement, roi formule, payback period, délai récupération investissement, rentabilité projet, analyse investissement, diagnostic roi',
    openGraph: {
        title: 'Analyse ROI — Retour sur Investissement | FinSight',
        description: 'Évaluez votre ROI + payback + benchmarks par type de projet. Premier niveau de diagnostic financier.',
        url: 'https://finsight.zineinsight.com/calculateurs/roi',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-roi.png',
                width: 1200,
                height: 630,
                alt: 'Analyse ROI FinSight',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Analyse ROI — Retour sur Investissement | FinSight',
        description: 'ROI + Payback period + benchmarks par projet + recommandations d\'expert.',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/roi',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function ROILayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

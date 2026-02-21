import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur ROI 2026 – Retour sur Investissement en 30s | PME & Dirigeants',
    description: 'Calculez le ROI et le délai de récupération de vos projets en 30 secondes. Benchmarks par type de projet, interprétation experte, décision d\'investissement structurée. Outil DAF pour PME.',
    keywords: 'calculateur roi, retour sur investissement, calcul roi, roi formule, payback period, délai récupération investissement, rentabilité projet, roi pme, analyse investissement, roi professionnel 2026',
    openGraph: {
        title: 'Calculateur ROI 2026 – Retour Investissement en 30s | PME',
        description: 'ROI + Payback + Benchmarks par projet + Interprétation experte. Outil de décision financière pour dirigeants PME.',
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
        title: 'Calculateur ROI 2026 – Retour Investissement en 30s | PME',
        description: 'ROI + Payback + Benchmarks par projet + Interprétation experte. Décision d\'investissement structurée pour dirigeants.',
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

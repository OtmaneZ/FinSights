import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur ROI : Retour sur Investissement & Délai de Rentabilité',
    description: 'Quel est le vrai retour de vos investissements ? Calculez ROI + payback sans inscription. Inclus : benchmarks par type de projet + analyse DAF. Gratuit.',
    keywords: 'calculateur roi, return on investment calcul, retour sur investissement, roi formule, payback period, délai récupération investissement, rentabilité projet, analyse investissement',
    openGraph: {
        title: 'Calculateur ROI | Retour sur Investissement en 30s',
        description: 'Quel est le vrai retour de vos investissements ? Calculez ROI + payback + benchmarks par projet. Sans inscription.',
        url: 'https://finsight.zineinsight.com/calculateurs/roi',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-roi.png',
                width: 1200,
                height: 630,
                alt: 'Calculateur ROI gratuit FinSight',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calculateur ROI | Retour sur Investissement',
        description: 'ROI + Payback period en 30s. Formule + conseils DAF. Sans inscription.',
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

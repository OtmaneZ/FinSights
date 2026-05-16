import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur ROI PME : rentabilité et payback | FinSight',
    description:
        'Machine, recrutement ou logiciel ? Saisissez coûts et gains : ROI, délai de récupération et benchmark sectoriel. Décidez avant de signer.',
    keywords: 'calculateur roi, retour sur investissement, calcul roi, roi formule, payback period, délai récupération investissement, rentabilité projet, roi pme, analyse investissement, roi professionnel 2026',
    openGraph: {
        title: 'Calculateur ROI PME : rentabilité et payback | FinSight',
        description:
            'Machine, recrutement ou logiciel ? Saisissez coûts et gains : ROI, délai de récupération et benchmark sectoriel. Décidez avant de signer.',
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
        title: 'Calculateur ROI PME : rentabilité et payback | FinSight',
        description:
            'Machine, recrutement ou logiciel ? Saisissez coûts et gains : ROI, délai de récupération et benchmark sectoriel. Décidez avant de signer.',
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

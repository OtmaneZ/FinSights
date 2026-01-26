export const metadata = {
    title: 'Plateforme Intelligence Financière | Score FinSight™ | Prévisions & Risques',
    description: 'Moteur d\'analyse stratégique pour CFO/DAF : Score FinSight™ instantané, détection signaux faibles, prévisions trésorerie, stress tests, CFO Virtuel IA.',
    robots: 'noindex, nofollow', // Protected page, not for public indexing
    openGraph: {
        title: 'Plateforme Intelligence Financière | Score FinSight™',
        description: 'Analyse stratégique CFO : Score FinSight™, prévisions, détection risques, CFO Virtuel',
        url: 'https://finsight.zineinsight.com/dashboard',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-dashboard.png',
            width: 1200,
            height: 630,
            alt: 'FinSight - Moteur Intelligence Financière'
        }]
    }
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

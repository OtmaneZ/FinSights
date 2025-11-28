export const metadata = {
    title: 'Dashboard Financier IA | Analyse KPIs Temps Réel | FinSight',
    description: 'Tableau de bord financier intelligent : 15 KPIs calculés automatiquement (DSO, BFR, marges, trésorerie). Upload Excel/CSV, analyse IA, alertes anomalies.',
    robots: 'noindex, nofollow', // Protected page, not for public indexing
    openGraph: {
        title: 'Dashboard Financier IA | FinSight',
        description: '15 KPIs calculés automatiquement avec IA',
        url: 'https://finsight.zineinsight.com/dashboard',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-dashboard.png',
            width: 1200,
            height: 630,
            alt: 'FinSight Dashboard'
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

import './globals.css'
// import '../styles/finsight-revolutionary.css' // ❌ Désactivé - Utiliser design-system.css à la place
// import '../styles/design-system.css' // ❌ DARK THEME - Désactivé pour corporate theme
import '../styles/driver-custom.css'
import { Inter } from 'next/font/google'
import { FinancialDataProvider } from '@/lib/financialContext'
import { CompanyProvider } from '@/lib/companyContext'
import { ThemeProvider } from '@/lib/themeContext'
import SessionProvider from '@/components/SessionProvider'
import Analytics from '@/components/Analytics'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'FinSight - Dashboard Financier IA pour CFO & DAF | Analyse Excel Automatisée',
    description: 'Dashboard financier intelligent pour CFO et DAF. Uploadez vos exports comptables (Sage, Cegid, QuickBooks), l\'IA calcule 15 KPIs et détecte les anomalies automatiquement. Essai gratuit.',
    keywords: ['dashboard financier', 'CFO', 'DAF', 'KPI financiers', 'analyse comptable', 'IA finance', 'Excel automatisation', 'DSO', 'BFR', 'trésorerie'],
    authors: [{ name: 'FinSight' }],
    creator: 'FinSight',
    publisher: 'FinSight',
    manifest: '/manifest.json',
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: 'https://finsight.zineinsight.com',
      siteName: 'FinSight',
      title: 'FinSight - Dashboard Financier IA pour CFO & DAF',
      description: 'Transformez vos exports comptables en insights actionnables avec l\'IA. 15 KPIs calculés automatiquement, détection d\'anomalies, copilot finance.',
      images: [{
        url: 'https://finsight.zineinsight.com/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'FinSight Dashboard Financier'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FinSight - Dashboard Financier IA pour CFO & DAF',
      description: 'Transformez vos exports comptables en insights actionnables avec l\'IA',
      images: ['https://finsight.zineinsight.com/images/og-default.png']
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
        ]
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'FinSight'
    }
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#0F3D7A'
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={inter.className}>
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-58BZSL7W"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    />
                </noscript>

                <Analytics />
                <CookieConsent />
                <SessionProvider>
                    <CompanyProvider>
                        <ThemeProvider>
                            <FinancialDataProvider>
                                {children}
                            </FinancialDataProvider>
                        </ThemeProvider>
                    </CompanyProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
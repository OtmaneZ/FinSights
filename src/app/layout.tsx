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
    title: 'FinSight - Moteur d\'Intelligence Financière pour Dirigeants | Score FinSight™ 0-100',
    description: 'Moteur d\'intelligence financière pour CFO/DAF. Analyse stratégique, prévisions & stress tests, moteur de risque IA, CFO virtuel. Score FinSight™ 0-100 instantané. Essai gratuit.',
    keywords: ['intelligence financière', 'CFO virtuel', 'Score FinSight', 'analyse stratégique', 'prévisions cash-flow', 'stress tests', 'risque financier', 'signaux faibles trésorerie', 'structure de marge', 'résilience financière', 'DSO', 'BFR', 'runway'],
    authors: [{ name: 'FinSight' }],
    creator: 'FinSight',
    publisher: 'FinSight',
    manifest: '/manifest.json',
    verification: {
        google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '', // Add GSC verification code here
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: 'https://finsight.zineinsight.com',
      siteName: 'FinSight',
      title: 'FinSight - Moteur d\'Intelligence Financière | Score FinSight™',
      description: 'Analyse stratégique, prévisions & scénarios, moteur de risque IA. Comprenez votre santé financière. Anticipez les risques. Décidez en confiance.',
      images: [{
        url: 'https://finsight.zineinsight.com/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'FinSight - Moteur d\'Intelligence Financière'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FinSight - Moteur d\'Intelligence Financière | Score FinSight™',
      description: 'Analyse stratégique + Prévisions + Risque IA + CFO Virtuel. Score santé financière 0-100.',
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

                {/* Schema.org Organization */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'FinSight',
                            url: 'https://finsight.zineinsight.com',
                            logo: 'https://finsight.zineinsight.com/images/logo.png',
                            description: 'Dashboard financier intelligent pour CFO et DAF. Analyse automatisée des données comptables avec intelligence artificielle.',
                            founder: {
                                '@type': 'Person',
                                name: 'Otmane Zinelabidine'
                            },
                            foundingDate: '2024',
                            contactPoint: {
                                '@type': 'ContactPoint',
                                contactType: 'customer support',
                                email: 'contact@finsight.zineinsight.com'
                            },
                            sameAs: [
                                'https://www.linkedin.com/company/finsight-ai'
                            ]
                        })
                    }}
                />
            </body>
        </html>
    )
}
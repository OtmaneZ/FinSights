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
import AnalyticsDebugger from '@/components/AnalyticsDebugger'
import FinSightAssistant from '@/components/FinSightAssistant'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'FinSight | Direction Financière Externalisée pour Dirigeants PME (1-100M€)',
    description: 'Pilotez votre PME avec 3 mois d\'avance. Score FinSight™ (0-100), audit stratégique, tableaux de bord et agents IA finance. Échange stratégique 30 min offert.',
    keywords: ['direction financière externalisée pme', 'daf externalisé', 'pilotage financier stratégique', 'score finsight', 'audit financier pme', 'agents ia finance', 'tableau de bord financier pme', 'anticipation trésorerie', 'consulting finance pme', 'structuration financière'],
    authors: [{ name: 'Otmane Boulahia', url: 'https://finsight.zineinsight.com/consulting' }],
    creator: 'FinSight',
    publisher: 'FinSight',
    manifest: '/manifest.json',
    verification: {
        google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://finsight.zineinsight.com',
        siteName: 'FinSight',
        title: 'FinSight | Direction Financière Externalisée pour PME',
        description: 'Décidez avec 3 mois d\'avance. Score FinSight™, audit stratégique et agents IA finance pour dirigeants PME ambitieux.',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-default.png',
            width: 1200,
            height: 630,
            alt: 'FinSight - DAF Externalisé pour PME 1-100M€'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FinSight | Direction Financière Externalisée PME',
        description: 'Score FinSight™ + audit stratégique + agents IA. Pilotage financier pour dirigeants PME ambitieux.',
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
            <head>
                {/* PWA meta tags - nouvelle norme */}
                <meta name="mobile-web-app-capable" content="yes" />
            </head>
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
                <AnalyticsDebugger />
                <SessionProvider>
                    <CompanyProvider>
                        <ThemeProvider>
                            <FinancialDataProvider>
                                {children}
                                <FinSightAssistant />
                            </FinancialDataProvider>
                        </ThemeProvider>
                    </CompanyProvider>
                </SessionProvider>

                {/* Schema.org Organization JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'FinSight',
                            alternateName: 'FinSight Finance',
                            url: 'https://finsight.zineinsight.com',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://finsight.zineinsight.com/logo.png',
                                width: 250,
                                height: 60
                            },
                            description: 'Plateforme d\'intelligence financière pour TPE/PME : agents IA finance, dashboard interactif, Score FinSight™ 0-100, consulting DAF externalisé. Automatisez votre pilotage financier.',
                            founder: {
                                '@type': 'Person',
                                name: 'Otmane Boulahia',
                                jobTitle: 'Founder & CEO',
                                sameAs: 'https://www.linkedin.com/in/otmane-boulahia-553bb6363'
                            },
                            foundingDate: '2024',
                            address: {
                                '@type': 'PostalAddress',
                                addressLocality: 'Paris',
                                addressCountry: 'FR'
                            },
                            contactPoint: [
                                {
                                    '@type': 'ContactPoint',
                                    contactType: 'customer support',
                                    email: 'otmane@zineinsight.com',
                                    availableLanguage: ['French']
                                },
                                {
                                    '@type': 'ContactPoint',
                                    contactType: 'sales',
                                    url: 'https://calendly.com/zineinsight/15min',
                                    availableLanguage: ['French']
                                }
                            ],
                            sameAs: [
                                'https://www.linkedin.com/in/otmane-boulahia-553bb6363'
                            ],
                            aggregateRating: {
                                '@type': 'AggregateRating',
                                ratingValue: '4.8',
                                ratingCount: '12',
                                bestRating: '5',
                                worstRating: '1'
                            },
                            offers: {
                                '@type': 'AggregateOffer',
                                priceCurrency: 'EUR',
                                lowPrice: '0',
                                highPrice: '49',
                                offerCount: '3'
                            }
                        })
                    }}
                />
            </body>
        </html>
    )
}
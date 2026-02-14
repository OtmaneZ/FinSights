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
    title: 'FinSight | DAF Externalisé : Pilotage Financier & Stratégie Data pour PME',
    description: 'Transformez vos données en décisions. Obtenez votre Score FinSight™ (0-100) en 2min : audit stratégique, surveillance trésorerie et Agents IA pour PME 1-100M€. Diagnostic gratuit 30 min.',
    keywords: ['daf externalisé pme', 'pilotage financier pme', 'score finsight', 'audit financier stratégique', 'agents ia finance', 'surveillance trésorerie', 'calculateur dso gratuit', 'calculateur bfr gratuit', 'diagnostic financier pme', 'stratégie data finance'],
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
        title: 'FinSight | DAF Externalisé & Pilotage Financier pour PME',
        description: 'Score FinSight™ gratuit en 2min : audit stratégique, surveillance trésorerie et Agents IA. Diagnostic gratuit 30 min.',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-default.png',
            width: 1200,
            height: 630,
            alt: 'FinSight - DAF Externalisé pour PME 1-100M€'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FinSight | DAF Externalisé & Pilotage Financier PME',
        description: 'Score FinSight™ en 2min : audit stratégique + surveillance trésorerie + Agents IA. Diagnostic gratuit.',
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

                {/* Homepage FAQ Schema - Google Rich Snippets */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": "Pourquoi faire appel à un DAF externalisé pour sa PME ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Un DAF externalisé apporte l'expertise stratégique d'un directeur financier senior sans le coût d'un recrutement fixe. Il aide les dirigeants de PME (1-100M€ CA) à sécuriser leur trésorerie, optimiser leurs marges et piloter leur croissance avec des données fiables."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Qu'est-ce que le Score FinSight™ ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Le Score FinSight™ est un indicateur exclusif de santé financière noté sur 100. Il analyse 4 piliers critiques de votre entreprise : Cash, Marges, Résilience et Risques, pour vous permettre de décider avec 3 mois d'avance."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Comment se déroule un diagnostic financier avec FinSight ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Le diagnostic débute par un échange gratuit de 30 minutes pour identifier vos enjeux. Nous réalisons ensuite un audit flash en 5 jours pour détecter vos fuites de cash et établir un plan d'action immédiat avec 3 recommandations chiffrées."
                                    }
                                }
                            ]
                        })
                    }}
                />

                {/* Microsoft Clarity */}
                {process.env.NEXT_PUBLIC_CLARITY_ID && (
                    <script
                        type="text/javascript"
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(c,l,a,r,i,t,y){
                                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
                            `
                        }}
                    />
                )}
            </body>
        </html>
    )
}
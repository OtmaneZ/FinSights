import './globals.css'
// import '../styles/finsight-revolutionary.css' // ❌ Désactivé - Utiliser design-system.css à la place
import '../styles/design-system.css'
import { Inter } from 'next/font/google'
import { FinancialDataProvider } from '@/lib/financialContext'
import { ThemeProvider } from '@/lib/themeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'FinSight - Finance Augmentée',
    description: 'Plateforme de finance augmentée pour DAF modernes',
    manifest: '/manifest.json',
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
                <ThemeProvider>
                    <FinancialDataProvider>
                        {children}
                    </FinancialDataProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
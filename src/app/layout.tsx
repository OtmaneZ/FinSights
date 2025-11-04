import './globals.css'
import '../styles/finsight-revolutionary.css'
import { Inter } from 'next/font/google'
import { FinancialDataProvider } from '@/lib/financialContext'
import { ThemeProvider } from '@/lib/themeContext'
import { ThemeToggle } from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'FinSight - Finance Augmentée',
    description: 'Plateforme de finance augmentée pour DAF modernes',
    manifest: '/manifest.json',
    themeColor: '#0F3D7A',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'FinSight'
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false
    }
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
                        <ThemeToggle />
                        {children}
                    </FinancialDataProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
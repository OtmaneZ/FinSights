'use client'

import ScoreMethodologyPage from '@/components/ScoreMethodologyPage'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Methodology() {
    return (
        <div className="min-h-screen bg-primary">
            <Header />
            <main className="max-w-6xl mx-auto px-6 py-20">
                <ScoreMethodologyPage />
            </main>
            <Footer />
        </div>
    )
}

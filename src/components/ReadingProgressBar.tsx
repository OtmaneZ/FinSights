'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgressBar() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const updateProgress = () => {
            // Hauteur totale du document
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
            // Position actuelle du scroll
            const scrollTop = window.scrollY
            // Calcul du pourcentage
            const scrollPercentage = (scrollTop / scrollHeight) * 100

            setProgress(Math.min(scrollPercentage, 100))
        }

        // Écouter le scroll
        window.addEventListener('scroll', updateProgress)
        // Calcul initial
        updateProgress()

        return () => window.removeEventListener('scroll', updateProgress)
    }, [])

    return (
        <>
            {/* Barre de progression fixe en haut */}
            <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200/80 z-[60]">
                <div
                    className="h-full bg-gradient-to-r from-accent-primary to-blue-600 transition-all duration-150 ease-out shadow-sm"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Indicateur de % lu (optionnel, apparaît après 10% de scroll) */}
            {progress > 10 && (
                <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
                    <div className="surface px-4 py-2 rounded-full shadow-lg border border-border-default">
                        <span className="text-sm font-semibold text-accent-primary">
                            {Math.round(progress)}% lu
                        </span>
                    </div>
                </div>
            )}
        </>
    )
}

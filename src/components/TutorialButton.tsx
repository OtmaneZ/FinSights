'use client'

import { HelpCircle } from 'lucide-react'
import useTutorial from '@/hooks/useTutorial'

export default function TutorialButton() {
    const { startTutorial } = useTutorial()

    return (
        <button
            onClick={startTutorial}
            className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-full font-semibold text-sm transition-all hover:shadow-xl flex items-center gap-2 group"
            title="Lancer le tutoriel"
        >
            <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline">Aide</span>
        </button>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export default function useTutorial() {
    const [hasCompletedTutorial, setHasCompletedTutorial] = useState(true)

    useEffect(() => {
        // Check if user has completed tutorial
        const completed = localStorage.getItem('finsight_tutorial_completed')
        setHasCompletedTutorial(completed === 'true')
    }, [])

    const startTutorial = () => {
        const driverObj = driver({
            showProgress: true,
            showButtons: ['next', 'previous', 'close'],
            steps: [
                {
                    element: '.demo-scenarios',
                    popover: {
                        title: '👋 Bienvenue sur FinSight !',
                        description: 'Commencez par tester un de nos 3 scénarios réalistes : PME Services, Startup SaaS, ou Scale-up Tech.',
                        side: 'bottom',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: '📊 Dashboard adaptatif',
                        description: 'FinSight analyse automatiquement vos données et génère les KPIs pertinents : CA, Trésorerie, DSO, Marge Nette, BFR... Tout est conforme au PCG 2025.'
                    }
                },
                {
                    popover: {
                        title: '🤖 AI Copilot GPT-4',
                        description: 'Posez vos questions en langage naturel. Exemple : "Quelle est la part de mon top client ?" L\'IA analyse vos données réelles et répond instantanément.'
                    }
                },
                {
                    popover: {
                        title: '📥 Import vos données',
                        description: 'Uploadez votre export comptable (CSV/Excel). Nous fournissons des templates pour Sage, Cegid, QuickBooks. Vos données restent 100% locales et sécurisées.'
                    }
                },
                {
                    popover: {
                        title: '💾 Export & Sauvegarde',
                        description: 'Téléchargez vos analyses en PDF ou Excel. Créez un compte gratuit pour sauvegarder vos dashboards dans le cloud.'
                    }
                }
            ],
            onDestroyStarted: () => {
                localStorage.setItem('finsight_tutorial_completed', 'true')
                setHasCompletedTutorial(true)
                driverObj.destroy()
            }
        })

        driverObj.drive()
    }

    const resetTutorial = () => {
        localStorage.removeItem('finsight_tutorial_completed')
        setHasCompletedTutorial(false)
    }

    return {
        startTutorial,
        resetTutorial,
        hasCompletedTutorial,
        shouldShowTutorial: !hasCompletedTutorial
    }
}

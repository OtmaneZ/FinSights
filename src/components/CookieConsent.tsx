'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    useEffect(() => {
        // Vérifier si l'utilisateur a déjà donné son consentement
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            setShowBanner(true)
        }
    }, [])

    const handleAcceptAll = () => {
        localStorage.setItem('cookie-consent', JSON.stringify({
            necessary: true,
            analytics: true,
            timestamp: new Date().toISOString()
        }))
        setShowBanner(false)
        // Recharger pour charger les scripts analytics
        window.location.reload()
    }

    const handleRejectAll = () => {
        localStorage.setItem('cookie-consent', JSON.stringify({
            necessary: true,
            analytics: false,
            timestamp: new Date().toISOString()
        }))
        setShowBanner(false)
    }

    const handleSaveSettings = (analytics: boolean) => {
        localStorage.setItem('cookie-consent', JSON.stringify({
            necessary: true,
            analytics,
            timestamp: new Date().toISOString()
        }))
        setShowBanner(false)
        if (analytics) {
            // Recharger pour charger les scripts analytics
            window.location.reload()
        }
    }

    if (!showBanner) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 pointer-events-none">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 pointer-events-auto" />

            {/* Banner */}
            <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 pointer-events-auto animate-slide-up">
                {!showSettings ? (
                    <>
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Nous respectons votre vie privée 🍪
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic du site et comprendre comment vous utilisez FinSight.
                                    En cliquant sur "Tout accepter", vous consentez à l'utilisation de tous les cookies.
                                    Vous pouvez personnaliser vos préférences à tout moment.
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleAcceptAll}
                                className="flex-1 min-w-[140px] px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-[#0a2d5c] hover:shadow-lg transition-all"
                            >
                                Tout accepter
                            </button>
                            <button
                                onClick={handleRejectAll}
                                className="flex-1 min-w-[140px] px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Tout refuser
                            </button>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="flex-1 min-w-[140px] px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
                            >
                                Personnaliser
                            </button>
                        </div>

                        {/* Footer links */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-xs text-gray-500">
                            <Link href="/politique-confidentialite" className="hover:text-primary transition-colors">
                                Politique de confidentialité
                            </Link>
                            <Link href="/cookies" className="hover:text-primary transition-colors">
                                Politique des cookies
                            </Link>
                            <Link href="/mentions-legales" className="hover:text-primary transition-colors">
                                Mentions légales
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Settings Panel */}
                        <div className="mb-4">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Retour
                            </button>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Paramètres des cookies
                            </h3>
                            <p className="text-sm text-gray-600">
                                Gérez vos préférences en matière de cookies. Les cookies nécessaires sont toujours activés.
                            </p>
                        </div>

                        {/* Cookie Categories */}
                        <div className="space-y-4 mb-6">
                            {/* Necessary Cookies */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-6 bg-primary rounded-full flex items-center px-1 cursor-not-allowed opacity-50">
                                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-gray-900">Cookies nécessaires</h4>
                                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Toujours actifs</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Ces cookies sont essentiels au fonctionnement du site (authentification, sécurité, préférences).
                                    </p>
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <AnalyticsCookieToggle onSave={handleSaveSettings} />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleSaveSettings(false)}
                                className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Enregistrer sans analytics
                            </button>
                            <button
                                onClick={() => handleSaveSettings(true)}
                                className="flex-1 px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-[#0a2d5c] hover:shadow-lg transition-all"
                            >
                                Enregistrer avec analytics
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function AnalyticsCookieToggle({ onSave }: { onSave: (enabled: boolean) => void }) {
    const [enabled, setEnabled] = useState(false)

    return (
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 mt-1">
                <button
                    onClick={() => setEnabled(!enabled)}
                    className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${enabled ? 'bg-primary' : 'bg-gray-300'
                        }`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'ml-auto' : 'mr-auto'
                        }`} />
                </button>
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Cookies analytiques</h4>
                <p className="text-sm text-gray-600 mb-2">
                    Ces cookies nous aident à comprendre comment vous utilisez notre site (Google Analytics, Microsoft Clarity).
                    Aucune donnée personnelle identifiable n'est collectée.
                </p>
                <div className="text-xs text-gray-500">
                    <strong>Services :</strong> Google Analytics 4, Microsoft Clarity, Google Tag Manager
                </div>
            </div>
        </div>
    )
}

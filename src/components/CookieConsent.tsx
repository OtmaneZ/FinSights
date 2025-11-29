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
        <div className="fixed bottom-4 right-4 z-[100] max-w-sm pointer-events-none">
            {/* Banner - Compact à droite */}
            <div className="relative bg-white rounded-xl shadow-2xl p-6 pointer-events-auto animate-slide-up border-2 border-accent-primary-border">
                {!showSettings ? (
                    <>
                        {/* Header */}
                        <div className="mb-4">
                            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <span>🍪</span> Cookies
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleAcceptAll}
                                className="w-full px-4 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-lg transition-all hover:shadow-lg text-sm"
                            >
                                Tout accepter
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRejectAll}
                                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Refuser
                                </button>
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:border-gray-400 transition-colors"
                                >
                                    Personnaliser
                                </button>
                            </div>
                        </div>

                        {/* Footer links */}
                        <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap gap-2 text-xs text-gray-500">
                            <Link href="/politique-confidentialite" className="hover:text-accent-primary transition-colors">
                                Confidentialité
                            </Link>
                            <span>•</span>
                            <Link href="/cookies" className="hover:text-accent-primary transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Settings Panel - Compact */}
                        <div className="mb-4">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors mb-3"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Retour
                            </button>
                            <h3 className="text-base font-semibold text-gray-900 mb-2">
                                Paramètres des cookies
                            </h3>
                        </div>

                        {/* Cookie Categories - Compact */}
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                            {/* Necessary Cookies */}
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-xs font-semibold text-gray-900">Nécessaires</h4>
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Actifs</span>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Essentiels au fonctionnement (authentification, sécurité).
                                </p>
                            </div>

                            {/* Analytics Cookies */}
                            <AnalyticsCookieToggle onSave={handleSaveSettings} />
                        </div>

                        {/* Action Buttons - Compact */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleSaveSettings(true)}
                                className="w-full px-4 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-lg transition-all text-sm"
                            >
                                Enregistrer
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
        <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3 mb-2">
                <button
                    onClick={() => setEnabled(!enabled)}
                    className={`flex-shrink-0 w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${enabled ? 'bg-accent-primary' : 'bg-gray-300'
                        }`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'ml-auto' : 'mr-auto'
                        }`} />
                </button>
                <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-900 mb-1">Analytics</h4>
                    <p className="text-xs text-gray-600">
                        Nous aide à comprendre l'usage du site (Google Analytics, Clarity).
                    </p>
                </div>
            </div>
        </div>
    )
}

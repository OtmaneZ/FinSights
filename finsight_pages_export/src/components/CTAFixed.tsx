'use client'

import { useState } from 'react'

export default function CTAFixed() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 relative">
                {/* Bouton fermer */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 text-white rounded-full text-xs hover:bg-gray-600 transition-colors"
                >
                    ×
                </button>

                {/* Badge urgence */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-semibold text-red-600">3 places restantes</span>
                    </div>
                    <span className="text-xs text-gray-500">Cette semaine</span>
                </div>

                <h3 className="font-bold text-gray-900 mb-2">Dashboard Finance en 48h ?</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Audit gratuit de vos données + devis personnalisé
                </p>

                <div className="space-y-2">
                    <a
                        href="/methodologie"
                        className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                    >
                        📞 Réserver l'audit gratuit
                    </a>
                    <a
                        href="/dashboard"
                        className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                    >
                        🎯 Voir la démo
                    </a>
                </div>

                {/* Social proof mini */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <span>⭐ 4.9/5</span>
                        <span>•</span>
                        <span>50+ dashboards</span>
                        <span>•</span>
                        <span>24 DAF ravis</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
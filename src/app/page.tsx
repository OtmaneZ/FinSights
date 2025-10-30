'use client'

import { useState } from 'react'

export default function Home() {
    const [cashFlow, setCashFlow] = useState(150000)

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">FinSight</h1>
                            <span className="ml-2 text-sm text-gray-500">Finance Augmentée</span>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="/dashboard" className="text-gray-500 hover:text-gray-900">Tableau de bord</a>
                            <a href="/methodologie" className="text-gray-500 hover:text-gray-900">Méthodologie</a>
                            <a href="/copilot" className="text-gray-500 hover:text-gray-900">Copilote IA</a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Démonstration technologique — Oct 2025
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">
                        La Finance
                        <span className="text-blue-600"> Augmentée</span>
                    </h2>
                    <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                        FinSight transforme la fonction financière avec l'IA.
                        Consolidation automatique, analyses prédictives et copilote intelligent
                        pour les DAF modernes.
                    </p>
                    <div className="mt-10 flex gap-4 justify-center">
                        <a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium">
                            Voir le Dashboard
                        </a>
                        <a href="/copilot" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg font-medium">
                            Voir une simulation IA
                        </a>
                    </div>
                </div>

                {/* Key Metrics Dashboard Preview */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Trésorerie Projetée</h3>
                            <span className="text-green-600 text-sm font-medium">+12%</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {cashFlow.toLocaleString('fr-FR')} €
                        </p>
                        <p className="text-gray-500 text-sm mt-2">À 90 jours</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Marge Brute</h3>
                            <span className="text-red-600 text-sm font-medium">-2.3%</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mt-2">42.8%</p>
                        <p className="text-gray-500 text-sm mt-2">vs mois précédent</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Délai Moyen de Paiement</h3>
                            <span className="text-orange-600 text-sm font-medium">+5 jours</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mt-2">47 j</p>
                        <p className="text-gray-500 text-sm mt-2">Alerte: augmentation</p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="bg-blue-100 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center">
                            <span className="text-2xl">🧩</span>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Consolidation</h3>
                        <p className="text-gray-600 text-sm mt-2">
                            Connexion automatique aux banques, compta et Excel
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-green-100 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Analyse IA</h3>
                        <p className="text-gray-600 text-sm mt-2">
                            Détection d'anomalies et insights automatiques
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-purple-100 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center">
                            <span className="text-2xl">🔮</span>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Prévisions</h3>
                        <p className="text-gray-600 text-sm mt-2">
                            Cash flow et scénarios "what if" instantanés
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-orange-100 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center">
                            <span className="text-2xl">💬</span>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Copilote IA</h3>
                        <p className="text-gray-600 text-sm mt-2">
                            Questions en langage naturel sur vos finances
                        </p>
                    </div>
                </div>

                {/* AI Copilot Demo */}
                <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Copilote IA en Action</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700">
                            <strong>Vous :</strong> "Quel est mon cash net projeté à 90 jours ?"
                        </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-gray-700">
                            <strong>FinSight IA :</strong> Votre cash net projeté à 90 jours s'élève à <strong>150 000€</strong> (+12% vs aujourd'hui).
                            Cette progression s'explique par l'encaissement prévu de 3 factures importantes (85k€)
                            et la réduction des délais de paiement clients. ⚠️ Attention : un décalage de 15 jours
                            sur ces encaissements ferait chuter la position à 95k€.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-400">
                            Prototype développé par <span className="text-white font-medium">Otmane Boulahia</span> — <span className="text-blue-400">Zine Insight</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            FinSight © 2025. Démonstration technologique.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
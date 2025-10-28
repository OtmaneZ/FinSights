import AICopilot from '@/components/AICopilot'

export default function CopilotPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">FinSight</h1>
                            <span className="ml-2 text-sm text-gray-500">Copilote IA</span>
                        </div>
                        <nav className="flex space-x-8">
                            <a href="/" className="text-gray-500 hover:text-gray-900">Accueil</a>
                            <a href="/dashboard" className="text-gray-500 hover:text-gray-900">Dashboard</a>
                            <a href="/copilot" className="text-blue-600 font-medium">Copilote IA</a>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Copilote IA FinSight</h2>
                    <p className="text-xl text-gray-600 max-w-3xl">
                        Posez vos questions financières en langage naturel et obtenez des réponses
                        analytiques instantanées basées sur vos données réelles.
                    </p>
                </div>

                <AICopilot />

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 Questions Trésorerie</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>"Quelle sera ma position de trésorerie dans 3 mois ?"</li>
                            <li>"Quels sont mes plus gros risques de liquidité ?"</li>
                            <li>"Comment optimiser ma gestion de cash ?"</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Questions Performances</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>"Pourquoi ma marge diminue-t-elle ?"</li>
                            <li>"Quels sont mes clients les plus rentables ?"</li>
                            <li>"Comment améliorer mes ratios financiers ?"</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">🔮 Questions Prédictives</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>"Que se passe-t-il si je perds ce gros client ?"</li>
                            <li>"Quel impact aura cette nouvelle embauche ?"</li>
                            <li>"Comment évolueront mes charges l'an prochain ?"</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}
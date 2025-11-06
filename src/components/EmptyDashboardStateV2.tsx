'use client'

interface EmptyDashboardStateProps {
    onDemoLoad: (scenario: 'saine' | 'difficulte' | 'croissance') => void
}

export default function EmptyDashboardStateV2({ onDemoLoad }: EmptyDashboardStateProps) {
    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-gold-subtle border border-accent-gold-border rounded-full mb-8 animate-pulse">
                    <span className="text-accent-gold text-sm font-medium">Dashboard Adaptatif</span>
                </div>
                <h2 className="text-5xl font-bold mb-6">
                    Votre Dashboard s'adapte à vos données
                </h2>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                    FinSight analyse automatiquement votre fichier et génère les KPIs pertinents.
                </p>
            </div>

            {/* Scénarios de Démonstration */}
            <div className="mb-16">
                <h3 className="text-2xl font-bold text-center mb-4">
                    Choisissez un scénario de démonstration
                </h3>
                <p className="text-center text-text-secondary mb-12">
                    3 scénarios réalistes : PME Services • Startup SaaS • Scale-up Tech
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* PME Services - Santé financière solide */}
                    <button
                        onClick={() => onDemoLoad('saine')}
                        className="surface rounded-xl p-8 surface-hover group text-left transition-all hover:scale-105"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                            <span className="text-4xl">🟢</span>
                        </div>
                        <h4 className="text-2xl font-bold mb-2">PME Services</h4>
                        <p className="text-green-500 font-semibold mb-4">Santé financière solide</p>
                        <div className="text-sm text-text-secondary space-y-1">
                            <p>• 243k€ CA • Marges saines</p>
                            <p>• Cash flow positif</p>
                            <p>• DSO contrôlé</p>
                        </div>
                    </button>

                    {/* Startup SaaS - Difficulté trésorerie */}
                    <button
                        onClick={() => onDemoLoad('difficulte')}
                        className="surface rounded-xl p-8 surface-hover group text-left transition-all hover:scale-105"
                    >
                        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                            <span className="text-4xl">🟠</span>
                        </div>
                        <h4 className="text-2xl font-bold mb-2">Startup SaaS</h4>
                        <p className="text-orange-500 font-semibold mb-4">Difficulté trésorerie</p>
                        <div className="text-sm text-text-secondary space-y-1">
                            <p>• 30k€ CA • Créances bloquées</p>
                            <p>• Runway 3 mois</p>
                            <p>• Relances urgentes</p>
                        </div>
                    </button>

                    {/* Scale-up Tech - Hypercroissance */}
                    <button
                        onClick={() => onDemoLoad('croissance')}
                        className="surface rounded-xl p-8 surface-hover group text-left transition-all hover:scale-105"
                    >
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <h4 className="text-2xl font-bold mb-2">Scale-up Tech</h4>
                        <p className="text-blue-500 font-semibold mb-4">Hypercroissance</p>
                        <div className="text-sm text-text-secondary space-y-1">
                            <p>• 1.2M€ CA • Série A 500k€</p>
                            <p>• +300% YoY</p>
                            <p>• Pipeline massif</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Upload Zone */}
            <div className="surface rounded-2xl p-12 text-center">
                <h3 className="text-2xl font-bold mb-4">Ou importez vos propres données</h3>
                <p className="text-text-secondary mb-8">
                    Glissez votre fichier CSV/Excel ou cliquez pour sélectionner
                </p>

                <div className="relative mb-6">
                    <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                            const event = new CustomEvent('fileSelected', { detail: e.target.files })
                            window.dispatchEvent(event)
                        }}
                    />
                    <div className="border-2 border-dashed border-border-default rounded-xl p-16 hover:border-accent-gold-border hover:bg-surface-elevated transition-all cursor-pointer">
                        <div className="text-accent-gold font-semibold text-xl mb-2">
                            📂 Cliquez ici ou glissez votre fichier
                        </div>
                        <div className="text-sm text-text-tertiary">
                            Formats supportés : .xlsx, .xls, .csv (max 10MB)
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-8 text-sm text-text-secondary">
                    <span>🔒 100% sécurisé</span>
                    <span>⚡ Analyse instantanée</span>
                    <span>🎯 KPIs auto-générés</span>
                </div>
            </div>
        </div>
    )
}

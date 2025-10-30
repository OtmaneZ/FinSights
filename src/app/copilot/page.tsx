import AICopilot from '@/components/AICopilot'
import CTAFixed from '@/components/CTAFixed'

export default function CopilotPage() {
    return (
        <main className="finsight-body">
            {/* Header */}
            <header className="finsight-header">
                <div className="finsight-nav-container">
                    <div className="finsight-brand-container">
                        <h1 className="finsight-brand">FinSight</h1>
                        <span className="finsight-brand-subtitle">Copilote IA</span>
                    </div>
                    <nav className="finsight-nav-menu finsight-nav-hidden">
                        <a href="/" className="finsight-nav-link">Accueil</a>
                        <a href="/dashboard" className="finsight-nav-link">Dashboard</a>
                        <a href="/methodologie" className="finsight-nav-link">Méthodologie</a>
                        <a href="/copilot" className="finsight-nav-link finsight-nav-active">Copilote IA</a>
                    </nav>
                </div>
            </header>

            <div className="finsight-main">
                <div className="finsight-copilot-intro">
                    <h2 className="finsight-copilot-title">Copilote IA FinSight</h2>
                    <p className="finsight-copilot-description">
                        Posez vos questions financières en langage naturel et obtenez des réponses
                        analytiques instantanées basées sur vos données réelles.
                    </p>
                    <div className="finsight-copilot-badge">
                        🤖 Propulsé par IA Skfolio + OpenAI (simulation)
                    </div>
                </div>

                <AICopilot />

                <div className="finsight-examples-grid">
                    <div className="finsight-example-card">
                        <h3 className="finsight-example-title">💰 Questions Trésorerie</h3>
                        <ul className="finsight-example-list">
                            <li>"Quelle sera ma position de trésorerie dans 3 mois ?"</li>
                            <li>"Quels sont mes plus gros risques de liquidité ?"</li>
                            <li>"Comment optimiser ma gestion de cash ?"</li>
                        </ul>
                    </div>

                    <div className="finsight-example-card">
                        <h3 className="finsight-example-title">📊 Questions Performances</h3>
                        <ul className="finsight-example-list">
                            <li>"Pourquoi ma marge diminue-t-elle ?"</li>
                            <li>"Quels sont mes clients les plus rentables ?"</li>
                            <li>"Comment améliorer mes ratios financiers ?"</li>
                        </ul>
                    </div>

                    <div className="finsight-example-card">
                        <h3 className="finsight-example-title">🔮 Questions Prédictives</h3>
                        <ul className="finsight-example-list">
                            <li>"Que se passe-t-il si je perds ce gros client ?"</li>
                            <li>"Quel impact aura cette nouvelle embauche ?"</li>
                            <li>"Comment évolueront mes charges l'an prochain ?"</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="finsight-footer">
                <div className="finsight-footer-content">
                    <div className="finsight-footer-center">
                        <p className="finsight-footer-main">
                            Prototype développé par <span className="finsight-footer-highlight">Otmane Boulahia</span> — <span className="finsight-footer-brand">Zine Insight</span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* CTA Fixe */}
            <CTAFixed />
        </main>
    )
}
import MethodologyPage from '@/components/MethodologyPage'
import CTAFixed from '@/components/CTAFixed'

export default function Methodology() {
    return (
        <main className="finsight-body">
            {/* Header */}
            <header className="finsight-header">
                <div className="finsight-nav-container">
                    <div className="finsight-brand-container">
                        <h1 className="finsight-brand">FinSight</h1>
                        <span className="finsight-brand-subtitle">Méthodologie</span>
                    </div>
                    <nav className="finsight-nav-menu finsight-nav-hidden">
                        <a href="/" className="finsight-nav-link">Accueil</a>
                        <a href="/dashboard" className="finsight-nav-link">Dashboard</a>
                        <a href="/dashboard" className="finsight-nav-link">Dashboard & IA</a>
                        <a href="/methodologie" className="finsight-nav-link finsight-nav-active">Méthodologie</a>
                    </nav>
                </div>
            </header>

            <div className="finsight-main">
                <MethodologyPage />
            </div>

            {/* Footer */}
            <footer className="finsight-footer">
                <div className="finsight-footer-content">
                    <div className="finsight-footer-center">
                        <p className="finsight-footer-main">
                            Solution développée par <span className="finsight-footer-highlight">Otmane Boulahia</span> — <span className="finsight-footer-brand">Zine Insight</span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* CTA Fixe */}
            <CTAFixed />
        </main>
    )
}
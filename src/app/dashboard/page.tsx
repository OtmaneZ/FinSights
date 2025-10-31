import FinancialDashboard from '@/components/FinancialDashboard'
import CTAFixed from '@/components/CTAFixed'

export default function DashboardPage() {
    return (
        <main className="finsight-body">
            {/* Header */}
            <header className="finsight-header">
                <div className="finsight-nav-container">
                    <div className="finsight-brand-container">
                        <h1 className="finsight-brand">FinSight</h1>
                        <span className="finsight-brand-subtitle">Dashboard</span>
                    </div>
                    <nav className="finsight-nav-menu finsight-nav-hidden">
                        <a href="/" className="finsight-nav-link">Accueil</a>
                        <a href="/methodologie" className="finsight-nav-link">Méthodologie</a>
                        <a href="https://zineinsight.com" className="finsight-nav-link" target="_blank" rel="noopener noreferrer">Zine Insight</a>
                    </nav>
                </div>
            </header>

            <div className="finsight-main">
                <FinancialDashboard />
            </div>

            {/* CTA Fixe */}
            <CTAFixed />

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
        </main>
    )
}
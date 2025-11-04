import FinancialDashboard from '@/components/FinancialDashboard'
import CTAFixed from '@/components/CTAFixed'

export default function DashboardPage() {
    return (
        <main className="finsight-body">
            {/* Header */}
            <header className="finsight-header">
                <div className="finsight-nav-container">
                    <div className="finsight-brand-container">
                        <a href="/" className="finsight-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src="/images/zineinsights_logo.jpeg" alt="FinSight Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                            <span>FinSight</span>
                        </a>
                        <span className="finsight-brand-subtitle">Dashboard</span>
                    </div>
                    <nav className="finsight-nav-menu finsight-nav-hidden" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <a href="https://calendly.com/zineinsight" target="_blank" rel="noopener noreferrer" className="finsight-nav-link">
                            Prendre rendez-vous
                        </a>
                        <a href="/" className="finsight-nav-link">Accueil</a>
                        <a href="https://www.zineinsight.com" className="finsight-nav-link">ZineInsight</a>
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
                            🚀 Propulsé par <a href="https://www.zineinsight.com" className="finsight-footer-brand text-blue-600 hover:underline font-bold">ZineInsight</a> — Dashboards sur-mesure pour PME/ETI
                        </p>
                        <p className="finsight-footer-sub">
                            FinSight © 2025
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
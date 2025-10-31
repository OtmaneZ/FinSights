'use client'

import { useState } from 'react'

export default function Home() {
    const [cashFlow, setCashFlow] = useState(150000)

    return (
        <main className="finsight-body">
            {/* Header */}
            <header className="finsight-header">
                <div className="finsight-nav-container">
                    <div className="finsight-brand-container">
                        <a href="/" className="finsight-brand">FinSight</a>
                        <span className="finsight-brand-subtitle">Demo</span>
                    </div>
                    <nav className="finsight-nav-menu finsight-nav-hidden">
                        <a href="/dashboard" className="finsight-nav-link">Dashboard</a>
                        <a href="https://www.zineinsight.com" className="finsight-nav-link">ZineInsight.com</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <div className="finsight-main">
                <div className="text-center finsight-animate-fade-in">
                    <div className="finsight-section-header">
                        <div className="finsight-section-badge">
                            🎯 Outil gratuit • Aucune inscription requise
                        </div>
                        <h1 className="finsight-section-title">
                            Transformez vos données CSV
                            <span style={{ background: 'var(--gradient-revolutionary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}><br />en dashboard intelligent</span>
                        </h1>
                        <p className="finsight-section-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
                            Uploadez votre fichier, obtenez instantanément des KPI, graphiques et analyse IA.
                        </p>
                        <div className="finsight-cta-buttons">
                            <a href="/dashboard" className="finsight-btn finsight-btn-revolutionary">
                                Tester Gratuitement
                            </a>
                            <a href="#demo" className="finsight-btn finsight-btn-secondary" onClick={(e) => { e.preventDefault(); document.querySelector('.finsight-kpi-grid')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                Voir un exemple
                            </a>
                        </div>

                    </div>
                </div>

                {/* Key Metrics Dashboard Preview */}
                <div className="finsight-kpi-grid" style={{ marginTop: '4rem', marginBottom: '3rem' }}>
                    <div className="finsight-kpi-card" style={{ padding: '2rem 1.5rem' }}>
                        <div className="finsight-kpi-value" style={{ marginBottom: '0.75rem' }}>
                            {cashFlow.toLocaleString('fr-FR')} €
                        </div>
                        <div className="finsight-kpi-label" style={{ marginBottom: '0.5rem' }}>Trésorerie Projetée</div>
                        <div className="finsight-kpi-trend finsight-trend-up">+12% à 90 jours</div>
                    </div>

                    <div className="finsight-kpi-card" style={{ padding: '2rem 1.5rem' }}>
                        <div className="finsight-kpi-value" style={{ marginBottom: '0.75rem' }}>42.8%</div>
                        <div className="finsight-kpi-label" style={{ marginBottom: '0.5rem' }}>Marge Brute</div>
                        <div className="finsight-kpi-trend finsight-trend-down">-2.3% vs mois précédent</div>
                    </div>

                    <div className="finsight-kpi-card finsight-card-alert" style={{ padding: '2rem 1.5rem' }}>
                        <div className="finsight-kpi-value" style={{ marginBottom: '0.75rem' }}>47 j</div>
                        <div className="finsight-kpi-label" style={{ marginBottom: '0.5rem' }}>Délai Moyen de Paiement</div>
                        <div className="finsight-kpi-trend finsight-trend-down">+5 jours - Alerte</div>
                    </div>
                </div>

                {/* AI Copilot Demo */}
                <div className="finsight-copilot-demo" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                    <h3 className="finsight-demo-title" style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '600' }}>Copilote IA en Action</h3>
                    <div className="finsight-demo-user-message">
                        <p>
                            <strong>Vous :</strong> "Quel est mon cash net projeté à 90 jours ?"
                        </p>
                    </div>
                    <div className="finsight-demo-ai-response">
                        <p>
                            <strong>FinSight IA :</strong> Votre cash net projeté à 90 jours s'élève à <strong>150 000€</strong> (+12% vs aujourd'hui).
                            Cette progression s'explique par l'encaissement prévu de 3 factures importantes (85k€)
                            et la réduction des délais de paiement clients. ⚠️ Attention : un décalage de 15 jours
                            sur ces encaissements ferait chuter la position à 95k€.
                        </p>
                    </div>
                </div>

                {/* Tunnel de Conversion */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 mt-20" style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <h3 className="text-3xl font-bold text-gray-900 mb-6" style={{ lineHeight: '1.2' }}>
                            Vous aimez ce que vous voyez ?
                        </h3>
                        <p className="text-xl text-gray-700 mb-8" style={{ lineHeight: '1.6' }}>
                            Passez au niveau supérieur avec un dashboard <strong style={{ color: '#1d4ed8' }}>sur-mesure</strong> pour votre métier
                        </p>
                        <div className="flex justify-center gap-4 mb-6 flex-wrap">
                            <a
                                href="https://www.zineinsight.com/#contact"
                                className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                                style={{
                                    background: '#1d4ed8',
                                    fontSize: '1.1rem'
                                }}
                            >
                                📞 Obtenir un Audit Gratuit
                            </a>
                            <a
                                href="https://www.zineinsight.com/#portfolio"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-semibold rounded-lg border-2 border-gray-300 shadow-md transition-all duration-200 hover:border-blue-600 hover:shadow-lg"
                                style={{
                                    fontSize: '1.1rem'
                                }}
                            >
                                💼 Voir nos Réalisations
                            </a>
                        </div>
                        <p className="text-sm text-gray-600 mt-6" style={{ opacity: '0.8' }}>
                            900-3600€ • 2-8 jours • Formation incluse
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="finsight-footer">
                <div className="finsight-footer-content">
                    <div className="finsight-footer-center">
                        <p className="finsight-footer-main">
                            Outil développé par <span className="finsight-footer-highlight">Otmane Boulahia</span> — <a href="https://www.zineinsight.com" className="finsight-footer-brand text-blue-600 hover:underline">ZineInsight.com</a>
                        </p>
                        <p className="finsight-footer-sub">
                            FinSight © 2025. Testez gratuitement notre vision • <a href="https://www.zineinsight.com" className="text-blue-600 hover:underline">Dashboards sur-mesure</a>
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
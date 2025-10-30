'use client'

import { useState } from 'react'
import CTAFixed from '@/components/CTAFixed'

export default function Home() {
    const [cashFlow, setCashFlow] = useState(150000)

    return (
        <main className="finsight-body">
            {/* Header */}
            <header className="finsight-header">
                <div className="finsight-nav-container">
                    <div className="finsight-brand-container">
                        <a href="/" className="finsight-brand">FinSight</a>
                        <span className="finsight-brand-subtitle">Finance Augmentée</span>
                    </div>
                    <nav className="finsight-nav-menu finsight-nav-hidden">
                        <a href="/dashboard" className="finsight-nav-link">Tableau de bord</a>
                        <a href="/methodologie" className="finsight-nav-link">Méthodologie</a>
                        <a href="/copilot" className="finsight-nav-link">Copilote IA</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <div className="finsight-main">
                <div className="text-center finsight-animate-fade-in">
                    <div className="finsight-section-header">
                        <div className="finsight-section-badge">
                            ⚡ De vos données Excel au pilotage clair en 48h
                        </div>
                        <h1 className="finsight-section-title">
                            Dashboard Financier
                            <span style={{ background: 'var(--gradient-revolutionary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> Personnalisé</span>
                        </h1>
                        <p className="finsight-section-subtitle">
                            <strong>Fini les heures perdues sur Excel.</strong> FinSight transforme vos données financières
                            en tableau de bord intelligent avec IA copilote.
                            <span className="text-blue-600 font-semibold">Livraison en 48h, formation incluse.</span>
                        </p>
                        <div className="finsight-cta-buttons">
                            <a href="/dashboard" className="finsight-btn finsight-btn-revolutionary">
                                🎯 Voir la Démo Live
                            </a>
                            <a href="/methodologie" className="finsight-btn finsight-btn-secondary">
                                📞 Audit Gratuit 15min
                            </a>
                        </div>

                        {/* Urgence + Social Proof */}
                        <div className="mt-8 text-center">
                            <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span>3 créneaux libres cette semaine</span>
                                </div>
                                <span>•</span>
                                <span>⭐ 4.9/5 (24 DAF)</span>
                                <span>•</span>
                                <span>🚀 +50 dashboards livrés</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Dashboard Preview */}
                <div className="finsight-kpi-grid">
                    <div className="finsight-kpi-card">
                        <div className="finsight-kpi-value">
                            {cashFlow.toLocaleString('fr-FR')} €
                        </div>
                        <div className="finsight-kpi-label">Trésorerie Projetée</div>
                        <div className="finsight-kpi-trend finsight-trend-up">+12% à 90 jours</div>
                    </div>

                    <div className="finsight-kpi-card">
                        <div className="finsight-kpi-value">42.8%</div>
                        <div className="finsight-kpi-label">Marge Brute</div>
                        <div className="finsight-kpi-trend finsight-trend-down">-2.3% vs mois précédent</div>
                    </div>

                    <div className="finsight-kpi-card finsight-card-alert">
                        <div className="finsight-kpi-value">47 j</div>
                        <div className="finsight-kpi-label">Délai Moyen de Paiement</div>
                        <div className="finsight-kpi-trend finsight-trend-down">+5 jours - Alerte</div>
                    </div>
                </div>

                {/* Social Proof Section */}
                <div className="finsight-section mt-16">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Déjà adopté par 50+ dirigeants</h2>
                        <div className="flex justify-center items-center space-x-8 text-gray-600 text-sm">
                            <div className="flex items-center space-x-2">
                                <span className="text-green-600">✅</span>
                                <span>PME 2-50M€ CA</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-blue-600">🏭</span>
                                <span>Industrie & Services</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-purple-600">⚡</span>
                                <span>Livraison 48-72h</span>
                            </div>
                        </div>
                    </div>

                    {/* Témoignage principal */}
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">👨‍💼</span>
                                </div>
                            </div>
                            <blockquote className="text-xl text-gray-700 italic mb-4">
                                "Avant FinSight, je passais 2 jours par mois sur Excel pour mes reportings.
                                Maintenant c'est automatique et l'IA m'alerte sur les anomalies.
                                J'ai récupéré 140k€ de créances grâce aux alertes de relances."
                            </blockquote>
                            <div className="text-gray-600">
                                <div className="font-semibold">Sylvain D.</div>
                                <div className="text-sm">DAF - TechnoMétal (28M€ CA)</div>
                                <div className="flex justify-center mt-2">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <span key={i} className="text-yellow-400 text-lg">⭐</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expertise */}
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center space-x-6 bg-gray-50 rounded-lg p-6">
                            <div className="text-center">
                                <div className="font-bold text-2xl text-blue-600">10+</div>
                                <div className="text-sm text-gray-600">Ans Finance Corporate</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-2xl text-green-600">50+</div>
                                <div className="text-sm text-gray-600">Dashboards Livrés</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-2xl text-purple-600">4.9/5</div>
                                <div className="text-sm text-gray-600">Satisfaction Client</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-2xl text-orange-600">48h</div>
                                <div className="text-sm text-gray-600">Livraison Moyenne</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="finsight-dashboard-grid">
                    <div className="finsight-card finsight-card-center">
                        <div className="finsight-card-icon">
                            🧩
                        </div>
                        <h3 className="finsight-card-title">Consolidation</h3>
                        <p className="finsight-card-description">
                            Connexion automatique aux banques, compta et Excel
                        </p>
                    </div>

                    <div className="finsight-card finsight-card-center">
                        <div className="finsight-card-icon finsight-icon-analysis">
                            📊
                        </div>
                        <h3 className="finsight-card-title">Analyse IA</h3>
                        <p className="finsight-card-description">
                            Détection d'anomalies et insights automatiques
                        </p>
                    </div>

                    <div className="finsight-card finsight-card-center">
                        <div className="finsight-card-icon finsight-icon-forecast">
                            🔮
                        </div>
                        <h3 className="finsight-card-title">Prévisions</h3>
                        <p className="finsight-card-description">
                            Cash flow et scénarios "what if" instantanés
                        </p>
                    </div>

                    <div className="finsight-card finsight-card-center">
                        <div className="finsight-card-icon finsight-icon-copilot">
                            💬
                        </div>
                        <h3 className="finsight-card-title">Copilote IA</h3>
                        <p className="finsight-card-description">
                            Questions en langage naturel sur vos finances
                        </p>
                    </div>
                </div>

                {/* AI Copilot Demo */}
                <div className="finsight-copilot-demo">
                    <h3 className="finsight-demo-title">Copilote IA en Action</h3>
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
            </div>

            {/* Footer */}
            <footer className="finsight-footer">
                <div className="finsight-footer-content">
                    <div className="finsight-footer-center">
                        <p className="finsight-footer-main">
                            Prototype développé par <span className="finsight-footer-highlight">Otmane Boulahia</span> — <span className="finsight-footer-brand">Zine Insight</span>
                        </p>
                        <p className="finsight-footer-sub">
                            FinSight © 2025. Démonstration technologique.
                        </p>
                    </div>
                </div>
            </footer>

            {/* CTA Fixe */}
            <CTAFixed />
        </main>
    )
}
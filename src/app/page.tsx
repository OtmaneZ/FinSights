'use client'

import { useState, useEffect, useRef } from 'react'

export default function Home() {
    const [cashFlow, setCashFlow] = useState(150000)
    const [animatedCashFlow, setAnimatedCashFlow] = useState(0)
    const [animatedMargin, setAnimatedMargin] = useState(0)
    const [animatedDSO, setAnimatedDSO] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const kpiRef = useRef<HTMLDivElement>(null)

    // Animation au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )

        if (kpiRef.current) {
            observer.observe(kpiRef.current)
        }

        return () => observer.disconnect()
    }, [isVisible])

    // Animations des compteurs
    useEffect(() => {
        if (!isVisible) return

        // Animation CashFlow
        const cashFlowDuration = 2000
        const cashFlowSteps = 60
        const cashFlowIncrement = 150000 / cashFlowSteps
        let cashFlowCount = 0

        const cashFlowTimer = setInterval(() => {
            cashFlowCount++
            setAnimatedCashFlow(Math.min(Math.floor(cashFlowCount * cashFlowIncrement), 150000))
            if (cashFlowCount >= cashFlowSteps) clearInterval(cashFlowTimer)
        }, cashFlowDuration / cashFlowSteps)

        // Animation Marge
        const marginDuration = 1800
        const marginSteps = 50
        const marginIncrement = 42.8 / marginSteps
        let marginCount = 0

        const marginTimer = setInterval(() => {
            marginCount++
            setAnimatedMargin(Math.min(marginCount * marginIncrement, 42.8))
            if (marginCount >= marginSteps) clearInterval(marginTimer)
        }, marginDuration / marginSteps)

        // Animation DSO
        const dsoDuration = 1600
        const dsoSteps = 47
        const dsoIncrement = 47 / dsoSteps
        let dsoCount = 0

        const dsoTimer = setInterval(() => {
            dsoCount++
            setAnimatedDSO(Math.min(Math.floor(dsoCount * dsoIncrement), 47))
            if (dsoCount >= dsoSteps) clearInterval(dsoTimer)
        }, dsoDuration / dsoSteps)

        return () => {
            clearInterval(cashFlowTimer)
            clearInterval(marginTimer)
            clearInterval(dsoTimer)
        }
    }, [isVisible])

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
                    </div>
                    <nav className="finsight-nav-menu finsight-nav-hidden">
                        <a href="/dashboard" className="finsight-nav-link">Tester notre outil</a>
                        <a href="https://www.zineinsight.com" className="finsight-nav-link">ZineInsight.com</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <div className="finsight-main">
                <div className="text-center finsight-animate-fade-in">
                    <div className="finsight-section-header">
                        <div className="finsight-section-badge">
                            🎯 Test gratuit • Aucune inscription requise
                        </div>
                        <h1 className="finsight-section-title">
                            Fini les heures perdues sur Excel
                            <span style={{ background: 'var(--gradient-revolutionary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}><br />Dashboard + IA financière instantanée</span>
                        </h1>
                        <p className="finsight-section-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
                            De CSV bordélique à insights actionnables en 2 clics. Uploadez, visualisez, questionnez.
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
                <div ref={kpiRef} className="finsight-kpi-grid" style={{ marginTop: '4rem', marginBottom: '3rem', gap: '2rem' }}>
                    <div className="finsight-kpi-card" style={{
                        padding: '2rem 1.5rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)'
                            e.currentTarget.style.boxShadow = '0 20px 50px rgba(59, 130, 246, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) translateY(0)'
                            e.currentTarget.style.boxShadow = ''
                        }}>
                        <div className="finsight-kpi-value" style={{ marginBottom: '0.75rem' }}>
                            {animatedCashFlow.toLocaleString('fr-FR')} €
                        </div>
                        <div className="finsight-kpi-label" style={{ marginBottom: '0.5rem' }}>Trésorerie Actuelle</div>
                        <div className="finsight-kpi-trend finsight-trend-up">Projection : 168k€ à 90j</div>
                    </div>

                    <div className="finsight-kpi-card" style={{
                        padding: '2rem 1.5rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)'
                            e.currentTarget.style.boxShadow = '0 20px 50px rgba(34, 197, 94, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) translateY(0)'
                            e.currentTarget.style.boxShadow = ''
                        }}>
                        <div className="finsight-kpi-value" style={{ marginBottom: '0.75rem' }}>
                            {animatedMargin.toFixed(1)}%
                        </div>
                        <div className="finsight-kpi-label" style={{ marginBottom: '0.5rem' }}>Marge Brute</div>
                        <div className="finsight-kpi-trend finsight-trend-down">-2.3% vs mois précédent</div>
                    </div>

                    <div className="finsight-kpi-card finsight-card-alert" style={{
                        padding: '2rem 1.5rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)'
                            e.currentTarget.style.boxShadow = '0 20px 50px rgba(251, 146, 60, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) translateY(0)'
                            e.currentTarget.style.boxShadow = ''
                        }}>
                        <div className="finsight-kpi-value" style={{ marginBottom: '0.75rem' }}>
                            {animatedDSO} j
                        </div>
                        <div className="finsight-kpi-label" style={{ marginBottom: '0.5rem' }}>Délai Moyen de Paiement</div>
                        <div className="finsight-kpi-trend finsight-trend-down">Dégradation de 5j ⚠️</div>
                    </div>
                </div>

                {/* AI Copilot Demo - NOUVEAU DESIGN INTERACTIF */}
                <div className="finsight-copilot-demo" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                    <div className="text-center mb-8">
                        <h3 className="finsight-demo-title" style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: '700', color: '#fff' }}>
                            Posez vos questions en français
                        </h3>
                        <p style={{ fontSize: '1.1rem', color: '#9ca3af' }}>
                            L'IA analyse vos vraies données et répond instantanément
                        </p>
                    </div>

                    {/* Interface Chat Interactive */}
                    <div className="finsight-chat-container" style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        background: 'rgba(30, 41, 59, 0.4)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                    }}>
                        {/* Message Utilisateur */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem',
                                maxWidth: '85%'
                            }}>
                                <div style={{
                                    background: '#2563eb',
                                    color: 'white',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '16px 16px 4px 16px',
                                    fontSize: '1rem',
                                    lineHeight: '1.5',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                                }}>
                                    Quel est mon cash net projeté à 90 jours ?
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    flexShrink: 0
                                }}>
                                    👤
                                </div>
                            </div>
                        </div>

                        {/* Message IA avec Animation */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem',
                                maxWidth: '85%'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                                }}>
                                    🤖
                                </div>
                                <div style={{
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(148, 163, 184, 0.2)',
                                    padding: '1.25rem',
                                    borderRadius: '16px 16px 16px 4px',
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                    color: '#e2e8f0'
                                }}>
                                    <p style={{ margin: '0 0 0.75rem 0' }}>
                                        📊 Votre trésorerie actuelle : <strong style={{ color: '#94a3b8' }}>150 000€</strong>
                                    </p>
                                    <p style={{ margin: '0.5rem 0 0.75rem 0' }}>
                                        📈 Projection à 90 jours :{' '}
                                        <strong style={{
                                            color: '#22c55e',
                                            fontSize: '1.15rem',
                                            background: 'rgba(34, 197, 94, 0.15)',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '6px',
                                            fontWeight: '700',
                                            border: '1px solid rgba(34, 197, 94, 0.3)'
                                        }}>168 000€</strong>
                                        {' '}(+12%)
                                    </p>
                                    <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.95rem', color: '#cbd5e1' }}>
                                        💡 <strong style={{ color: '#60a5fa' }}>3 grosses factures arrivent</strong> (85k€) + vos clients paient plus vite.
                                    </p>
                                    <p style={{
                                        margin: '0.75rem 0 0 0',
                                        padding: '0.75rem',
                                        background: 'rgba(251, 191, 36, 0.15)',
                                        borderLeft: '3px solid #fbbf24',
                                        borderRadius: '6px',
                                        fontSize: '0.95rem',
                                        color: '#fde047'
                                    }}>
                                        ⚠️ <strong>Scénario de risque :</strong> si ces factures ont 15j de retard → cash à{' '}
                                        <strong style={{ color: '#f87171' }}>95k€</strong> (-37%)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Exemples de questions */}
                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: '600' }}>
                                💡 Autres questions que vous pourrez poser :
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <span style={{
                                    background: 'rgba(30, 41, 59, 0.6)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    color: '#cbd5e1',
                                    border: '1px solid rgba(148, 163, 184, 0.3)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                                        e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                                    }}>
                                    "Quel est mon DSO ?"
                                </span>
                                <span style={{
                                    background: 'rgba(30, 41, 59, 0.6)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    color: '#cbd5e1',
                                    border: '1px solid rgba(148, 163, 184, 0.3)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                                        e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                                    }}>
                                    "Analyse ma marge brute"
                                </span>
                                <span style={{
                                    background: 'rgba(30, 41, 59, 0.6)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    color: '#cbd5e1',
                                    border: '1px solid rgba(148, 163, 184, 0.3)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                                        e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                                    }}>
                                    "Qui sont mes meilleurs clients ?"
                                </span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <a
                                href="/dashboard"
                                style={{
                                    display: 'inline-block',
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    color: 'white',
                                    padding: '0.875rem 2rem',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                                }}
                            >
                                💬 Tester avec mes données
                            </a>
                        </div>
                    </div>
                </div>

                {/* Tunnel de Conversion */}
                <div style={{
                    background: 'rgba(30, 41, 59, 0.3)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '16px',
                    padding: '4rem 1.5rem',
                    marginTop: '5rem',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                }}>
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <h3 className="text-3xl font-bold mb-6" style={{ lineHeight: '1.2', color: '#fff' }}>
                            Imaginez la même puissance sur VOS processus métier
                        </h3>
                        <p className="text-xl mb-4" style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
                            📞 <strong style={{ color: '#60a5fa' }}>Audit gratuit de 30min avec un expert</strong>
                        </p>
                        <p className="text-lg mb-8" style={{ lineHeight: '1.6', color: '#94a3b8' }}>
                            Nous analysons votre cas et vous montrons ce qui est possible
                        </p>
                        <div className="flex justify-center gap-4 mb-6 flex-wrap">
                            <a
                                href="https://www.zineinsight.com/#contact"
                                className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                                    fontSize: '1.1rem'
                                }}
                            >
                                📅 Réserver mon audit gratuit
                            </a>
                            <a
                                href="https://www.zineinsight.com/#portfolio"
                                className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg border-2 shadow-md transition-all duration-200 hover:shadow-lg"
                                style={{
                                    fontSize: '1.1rem',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    color: '#e2e8f0',
                                    borderColor: 'rgba(148, 163, 184, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                }}
                            >
                                💼 Voir nos Réalisations
                            </a>
                        </div>
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
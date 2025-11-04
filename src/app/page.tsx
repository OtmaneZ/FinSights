'use client'

export default function Home() {
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
                    <nav className="finsight-nav-menu finsight-nav-hidden" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <a href="https://calendly.com/zineinsight" target="_blank" rel="noopener noreferrer" className="finsight-nav-link">
                            Prendre rendez-vous
                        </a>
                        <a href="/dashboard" className="finsight-nav-link">Démo</a>
                        <a href="/methodologie" className="finsight-nav-link">Méthodologie</a>
                        <a href="https://www.zineinsight.com" className="finsight-nav-link">ZineInsight</a>
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
                            Automatisez votre reporting financier
                            <span style={{ background: 'var(--gradient-revolutionary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}><br />Dashboard + IA financière instantanée</span>
                        </h1>
                        <p className="finsight-section-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
                            Transformez vos exports comptables en tableaux de bord professionnels. Économisez 8h/mois de reporting manuel.
                        </p>
                        <div className="finsight-cta-buttons">
                            <a href="/dashboard" className="finsight-btn finsight-btn-revolutionary" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px 40px' }}>
                                <span style={{ fontSize: '18px', fontWeight: '700' }}>Voir le Dashboard Démo</span>
                                <span style={{ fontSize: '13px', opacity: '0.9', fontWeight: '400' }}>Dashboard complet • Démo interactive • Aucune inscription</span>
                            </a>
                        </div>

                    </div>
                </div>

                {/* Section Beta Privée */}
                <div style={{ textAlign: 'center', marginTop: '5rem', marginBottom: '3rem', maxWidth: '900px', margin: '5rem auto 3rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>🧪</span>
                        <span style={{ color: '#10b981', fontWeight: '600', fontSize: '0.9rem' }}>En beta privée</span>
                    </div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fff', marginBottom: '1rem' }}>
                        Testé par 5 PME françaises
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: '#9ca3af', marginBottom: '2rem' }}>
                        Secteurs : Services B2B, E-commerce, Distribution
                    </p>
                    <div style={{ display: 'inline-block', padding: '1.5rem 2rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <p style={{ color: '#60a5fa', fontSize: '1rem', fontStyle: 'italic' }}>
                            💬 "Enfin un outil qui me donne une vision claire en temps réel. Fini les heures perdues sur Excel."
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            — DAF, PME Services 8M€ CA
                        </p>
                    </div>
                </div>

                {/* AI Copilot Demo - NOUVEAU DESIGN INTERACTIF */}
                <div className="finsight-copilot-demo" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                    <div className="text-center mb-8">
                        <h3 className="finsight-demo-title" style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: '700', color: '#fff' }}>
                            Posez vos questions
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
                                � Voir la démo complète
                            </a>
                        </div>
                    </div>
                </div>

                {/* Comment ça marche - Process 4 étapes */}
                <div style={{ marginTop: '6rem', marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '50px', fontSize: '13px', fontWeight: '600', color: '#3b82f6', marginBottom: '20px' }}>
                            ⚡ Process Ultra-Rapide
                        </div>
                        <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '15px', color: '#fff' }}>
                            Comment ça marche ?
                        </h2>
                        <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)', maxWidth: '600px', margin: '0 auto' }}>
                            De l'upload à l'analyse avancée en 4 étapes simples
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', maxWidth: '900px', margin: '0 auto' }}>
                        {/* Étape 1 */}
                        <div style={{ position: 'relative', background: 'rgba(255, 255, 255, 0.03)', padding: '40px 30px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
                                1
                            </div>
                            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📤</div>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>Importez votre CSV</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: '1.6' }}>
                                Exportez vos données d'Excel ou de votre logiciel comptable. Glissez-déposez le fichier.
                            </p>
                        </div>

                        {/* Étape 2 */}
                        <div style={{ position: 'relative', background: 'rgba(255, 255, 255, 0.03)', padding: '40px 30px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)' }}>
                                2
                            </div>
                            <div style={{ fontSize: '50px', marginBottom: '20px' }}>🔄</div>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>Analyse automatique</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: '1.6' }}>
                                Notre IA structure vos données et calcule 15+ KPIs financiers en 30 secondes.
                            </p>
                        </div>

                        {/* Étape 3 */}
                        <div style={{ position: 'relative', background: 'rgba(255, 255, 255, 0.03)', padding: '40px 30px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)' }}>
                                3
                            </div>
                            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📊</div>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>Visualisez vos KPIs</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: '1.6' }}>
                                Dashboard interactif avec graphiques temps réel : trésorerie, marges, DSO, top clients.
                            </p>
                        </div>

                        {/* Étape 4 */}
                        <div style={{ position: 'relative', background: 'rgba(255, 255, 255, 0.03)', padding: '40px 30px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)' }}>
                                4
                            </div>
                            <div style={{ fontSize: '50px', marginBottom: '20px' }}>🤖</div>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>Interrogez l'IA</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: '1.6' }}>
                                Posez vos questions en français. L'IA analyse vos chiffres et répond en langage naturel.
                            </p>
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
                            Besoin d'un dashboard sur-mesure pour votre entreprise ?
                        </h3>
                        <p className="text-xl mb-4" style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
                            📞 <strong style={{ color: '#60a5fa' }}>Audit gratuit de 30min avec un expert</strong>
                        </p>
                        <p className="text-lg mb-8" style={{ lineHeight: '1.6', color: '#94a3b8' }}>
                            Nous analysons vos besoins et construisons la solution adaptée à votre activité
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

            {/* Sécurité & Conformité */}
            <div style={{ background: 'linear-gradient(135deg, rgba(15, 61, 122, 0.05) 0%, rgba(15, 61, 122, 0.02) 100%)', padding: '80px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '50px', fontSize: '13px', fontWeight: '600', color: '#22c55e', marginBottom: '30px' }}>
                        🔒 Sécurité & Conformité
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', color: '#fff' }}>
                        Vos données financières en sécurité
                    </h2>
                    <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px' }}>
                        Conformité RGPD, hébergement France, chiffrement de bout-en-bout
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🇫🇷</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#fff' }}>Hébergement France</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>Données stockées exclusivement sur serveurs français</p>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🛡️</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#fff' }}>Conformité RGPD</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>Respect total du règlement européen sur les données</p>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔐</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#fff' }}>Chiffrement SSL</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>Protocole AES-256 pour vos données sensibles</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Tarifs Sur-Mesure */}
            <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(15, 61, 122, 0.05) 100%)', padding: '100px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '50px', fontSize: '13px', fontWeight: '600', color: '#60a5fa', marginBottom: '30px' }}>
                        💼 Dashboards Sur-Mesure
                    </div>
                    <h2 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '25px', color: '#fff', lineHeight: '1.2' }}>
                        Tarifs adaptés à votre projet
                    </h2>
                    <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px', lineHeight: '1.6' }}>
                        Chaque entreprise a des besoins uniques. Nous construisons votre solution financière personnalisée.
                    </p>

                    {/* Pricing Box */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '50px 40px', borderRadius: '24px', border: '2px solid rgba(59, 130, 246, 0.2)', maxWidth: '600px', margin: '0 auto 50px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '0', right: '0', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '8px 20px', borderBottomLeftRadius: '16px', fontSize: '12px', fontWeight: '700', color: '#fff' }}>
                            ⭐ SUR-MESURE
                        </div>
                        <div style={{ fontSize: '48px', fontWeight: '800', color: '#3b82f6', marginBottom: '10px' }}>
                            À partir de 2 500€
                        </div>
                        <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '40px' }}>
                            Projet complet • Tarif selon complexité
                        </p>

                        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px' }}>
                                <span style={{ fontSize: '20px' }}>✓</span>
                                <span style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)' }}><strong>Analyse gratuite</strong> de vos besoins (30 min)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px' }}>
                                <span style={{ fontSize: '20px' }}>✓</span>
                                <span style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)' }}><strong>Devis personnalisé</strong> sous 48h</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px' }}>
                                <span style={{ fontSize: '20px' }}>✓</span>
                                <span style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)' }}><strong>Accompagnement</strong> de A à Z</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px' }}>
                                <span style={{ fontSize: '20px' }}>✓</span>
                                <span style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)' }}><strong>Formation</strong> & documentation incluses</span>
                            </div>
                        </div>

                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                padding: '16px 40px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '700',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.3)';
                            }}
                        >
                            📧 Demander un devis gratuit
                        </a>
                    </div>

                    {/* Trust Elements */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Livraison express<br /><strong style={{ color: '#fff' }}>7-14 jours</strong></p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎓</div>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Certifié Data Analytics<br /><strong style={{ color: '#fff' }}>LeWagon 2025</strong></p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎯</div>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Formation & support<br /><strong style={{ color: '#fff' }}>inclus</strong></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="finsight-footer">
                <div className="finsight-footer-content">
                    <div className="finsight-footer-center">
                        <p className="finsight-footer-main">
                            🚀 Propulsé par <a href="https://www.zineinsight.com" className="finsight-footer-brand text-blue-600 hover:underline font-bold">ZineInsight</a> — Dashboards sur-mesure pour PME/ETI
                        </p>
                        <p className="finsight-footer-sub">
                            Outil développé par <span className="finsight-footer-highlight">Otmane Boulahia</span> • FinSight © 2025 • Outil de démonstration
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
'use client'

import { useState } from 'react'

interface EmptyDashboardStateProps {
    onDemoLoad: (scenario: 'saine' | 'difficulte' | 'croissance') => void
}

export default function EmptyDashboardStateV2({ onDemoLoad }: EmptyDashboardStateProps) {
    const [showUploadModal, setShowUploadModal] = useState(false)
    return (
        <>
            {/* Radial gradient glow effect - Resend style (full width, behind everything) */}
            <div className="fixed inset-x-0 top-0 h-[800px] pointer-events-none overflow-hidden z-0">
                <div
                    className="absolute inset-0 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)'
                    }}>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-8 animate-pulse">
                        <span className="text-accent-primary text-sm font-medium">Dashboard Adaptatif</span>
                    </div>
                    <h2 className="text-5xl font-bold mb-6">
                        Votre Dashboard s'adapte à vos données
                    </h2>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">
                        FinSight analyse automatiquement votre fichier et génère les KPIs pertinents.
                    </p>
                </div>

                {/* Scénarios de Démonstration */}
                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-center mb-4">
                        Choisissez un scénario de démonstration
                    </h3>
                    <p className="text-center text-secondary mb-12">
                        3 scénarios réalistes : PME Services • Startup SaaS • Scale-up Tech
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* PME Services - Santé financière solide */}
                        <button
                            onClick={() => onDemoLoad('saine')}
                            className="surface rounded-xl p-8 surface-hover group text-left transition-all hover:scale-105"
                        >
                            <h4 className="text-2xl font-bold mb-2">PME Services</h4>
                            <p className="text-green-500 font-semibold mb-4">Santé financière solide</p>
                            <div className="text-sm text-secondary space-y-1">
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
                            <h4 className="text-2xl font-bold mb-2">Startup SaaS</h4>
                            <p className="text-orange-500 font-semibold mb-4">Difficulté trésorerie</p>
                            <div className="text-sm text-secondary space-y-1">
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
                            <h4 className="text-2xl font-bold mb-2">Scale-up Tech</h4>
                            <p className="text-blue-500 font-semibold mb-4">Hypercroissance</p>
                            <div className="text-sm text-secondary space-y-1">
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
                    <p className="text-secondary mb-8">
                        Glissez votre fichier CSV/Excel ou cliquez pour sélectionner
                    </p>

                    <div className="relative mb-6">
                        <div
                            onClick={() => setShowUploadModal(true)}
                            className="border-2 border-dashed border-border-default rounded-xl p-16 hover:border-accent-primary-border hover:bg-surface-elevated transition-all cursor-pointer"
                        >
                            <div className="text-accent-primary font-semibold text-xl mb-2">
                                📂 Cliquez ici ou glissez votre fichier
                            </div>
                            <div className="text-sm text-tertiary">
                                Formats supportés : .xlsx, .xls, .csv (max 10MB)
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-8 text-sm text-secondary">
                        <span>🔒 100% sécurisé</span>
                        <span>⚡ Analyse instantanée</span>
                        <span>🎯 KPIs auto-générés</span>
                    </div>
                </div>

                {/* 🔒 Modal Upload sur RDV */}
                {showUploadModal && (
                    <div
                        onClick={() => setShowUploadModal(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999,
                            padding: '20px',
                            overflowY: 'auto'
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                borderRadius: '20px',
                                padding: '32px 28px',
                                maxWidth: '550px',
                                maxHeight: '90vh',
                                width: '90%',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                position: 'relative',
                                overflowY: 'auto'
                            }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowUploadModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    transition: 'all 0.2s',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                            >
                                ✕
                            </button>

                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                                    Analyse de VOS données
                                </h3>
                                <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                                    Cette fonctionnalité est disponible uniquement sur rendez-vous pour garantir une analyse optimale et personnalisée.
                                </p>
                            </div>

                            {/* Bénéfices */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>✓</span>
                                    <div>
                                        <strong style={{ color: '#60a5fa', fontSize: '15px' }}>Audit gratuit de 30 min</strong>
                                        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0' }}>
                                            Analyse de vos besoins avec un expert
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>✓</span>
                                    <div>
                                        <strong style={{ color: '#60a5fa', fontSize: '15px' }}>Configuration personnalisée</strong>
                                        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0' }}>
                                            Dashboard adapté à votre système comptable
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>✓</span>
                                    <div>
                                        <strong style={{ color: '#60a5fa', fontSize: '15px' }}>Formation & support inclus</strong>
                                        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0' }}>
                                            Prise en main complète de votre outil
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <a
                                    href="https://calendly.com/zineinsight"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: '1',
                                        minWidth: '200px',
                                        padding: '16px 24px',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        color: '#fff',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                                        cursor: 'pointer',
                                        border: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
                                    }}
                                >
                                    📅 Prendre rendez-vous
                                </a>
                                <a
                                    href="mailto:otmane@zineinsight.com?subject=Analyse de mes données financières&body=Bonjour Otmane,%0A%0AJe suis intéressé(e) par l'analyse de mes données financières avec FinSight.%0A%0APouvez-vous me recontacter pour discuter de mes besoins ?%0A%0AMerci !"
                                    style={{
                                        flex: '1',
                                        minWidth: '200px',
                                        padding: '16px 24px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        color: '#fff',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        transition: 'all 0.3s',
                                        border: '2px solid rgba(255, 255, 255, 0.2)',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                    }}
                                >
                                    ✉️ Envoyer un email
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PricingCard from '@/components/PricingCard'
import PricingToggle from '@/components/PricingToggle'
import { Zap, Shield, Rocket, Building2 } from 'lucide-react'

// Note: metadata export not allowed in client components
// SEO handled by layout.tsx + OG tags dynamically

export default function PricingPage() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

    const plans = [
        {
            name: 'Starter',
            icon: Zap,
            price: 0,
            priceYearly: 0,
            features: [
                '✅ 1 entreprise',
                '✅ 10 uploads/mois',
                '✅ Score FinSight™ instantané',
                '✅ Analyse financière stratégique',
                '✅ 10 questions CFO Virtuel/jour',
                '✅ Visualisations interactives',
                '✅ Export PDF avec watermark',
                '❌ Sauvegarde cloud',
                '❌ Alertes email'
            ],
            cta: 'Commencer gratuitement',
            highlight: false,
            popular: false
        },
        {
            name: 'Business',
            icon: Shield,
            price: 99,
            priceYearly: 950, // -20%
            features: [
                '✅ 3 entreprises',
                '✅ CFO Virtuel illimité (GPT-4)',
                '✅ Analyses illimitées',
                '✅ Prévisions & Stress tests avancés',
                '✅ Sauvegarde cloud 90 jours',
                '✅ Alertes signaux faibles temps réel',
                '✅ Export PDF/Excel branded',
                '✅ Support email 48h',
                '❌ API REST'
            ],
            cta: 'Essai gratuit 14 jours',
            highlight: true,
            popular: true
        },
        {
            name: 'Growth',
            icon: Rocket,
            price: 199,
            priceYearly: 1910, // -20%
            features: [
                '✅ Entreprises illimitées',
                '✅ Multi-utilisateurs (5 sièges)',
                '✅ Score FinSight™ temps réel',
                '✅ API REST complète (10k calls/jour)',
                '✅ Historique données 3 ans',
                '✅ Webhooks événements critiques',
                '✅ Support prioritaire 24h',
                '✅ Onboarding personnalisé',
                '✅ Monitoring performances'
            ],
            cta: 'Démo avec expert',
            highlight: false,
            popular: false
        },
        {
            name: 'Enterprise',
            icon: Building2,
            price: null,
            features: [
                '✅ Score FinSight™ + tous piliers avancés',
                '✅ Utilisateurs illimités (équipes DAF/CFO)',
                '✅ Intégrations ERP/CRM sur-mesure',
                '✅ Déploiement on-premise ou cloud dédié',
                '✅ CFO Virtuel personnalisé (modèle métier)',
                '✅ Formation équipe + Onboarding stratégique',
                '✅ Audit sécurité & conformité RGPD',
                '✅ Contrat annuel avec SLA personnalisé',
                '✅ Roadmap prioritaire (développement features)'
            ],
            cta: 'Nous contacter',
            highlight: false,
            popular: false
        }
    ]

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
                <h1 className="text-5xl font-bold mb-6 text-primary">
                    Votre moteur d'intelligence financière
                </h1>
                <p className="text-xl text-secondary max-w-2xl mx-auto mb-4">
                    Choisissez la puissance d'analyse adaptée à votre croissance
                </p>
                <p className="text-sm text-tertiary">
                    Pas d'engagement • Annulation à tout moment • Support en français
                </p>
            </section>

            {/* Pricing Toggle */}
            <section className="max-w-6xl mx-auto px-6">
                <PricingToggle value={billingPeriod} onChange={setBillingPeriod} />
            </section>

            {/* Pricing Cards */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <PricingCard
                            key={plan.name}
                            name={plan.name}
                            price={plan.price}
                            priceYearly={plan.priceYearly}
                            billingPeriod={billingPeriod}
                            features={plan.features}
                            cta={plan.cta}
                            highlight={plan.highlight}
                            popular={plan.popular}
                            ctaAction={() => {
                                if (plan.name === 'Starter' || plan.name === 'Business') {
                                    // ✨ Pure SaaS: redirect to signup for STARTER and BUSINESS
                                    window.location.href = '/auth/signup'
                                } else {
                                    // Keep Calendly for GROWTH and ENTERPRISE (higher touch)
                                    window.location.href = 'https://calendly.com/zineinsight'
                                }
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto px-6 pb-20">
                <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
                <div className="space-y-6">
                    <div className="surface rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-2">Puis-je changer de plan à tout moment ?</h3>
                        <p className="text-secondary text-sm">
                            Oui, vous pouvez upgrader immédiatement. Pour un downgrade, il prend effet à la fin de la période en cours.
                        </p>
                    </div>
                    <div className="surface rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-2">Mes données sont-elles sécurisées ?</h3>
                        <p className="text-secondary text-sm">
                            Absolument. Chiffrement SSL, hébergement EU (Vercel), conformité RGPD. En version gratuite, les données restent en local uniquement.
                        </p>
                    </div>
                    <div className="surface rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-2">Quels formats de fichiers acceptez-vous ?</h3>
                        <p className="text-secondary text-sm">
                            CSV et Excel (.xlsx, .xls). Nous fournissons des templates pour Sage, Cegid, QuickBooks et Excel générique.
                        </p>
                    </div>
                    <div className="surface rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-2">L'IA GPT-4 a-t-elle accès à mes données ?</h3>
                        <p className="text-secondary text-sm">
                            Oui, mais uniquement en contexte chiffré pour répondre à vos questions. Vos données ne sont jamais stockées chez OpenAI.
                        </p>
                    </div>
                    <div className="surface rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-2">Proposez-vous des réductions pour les ONG ou éducation ?</h3>
                        <p className="text-secondary text-sm">
                            Oui, contactez-nous pour un tarif adapté aux organisations à but non lucratif et établissements d'enseignement.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="max-w-4xl mx-auto px-6 pb-32 text-center">
                <div className="surface rounded-2xl p-12">
                    <h2 className="text-3xl font-bold mb-4">Prenez le contrôle de votre santé financière</h2>
                    <p className="text-secondary mb-8">
                        Rejoignez les CFO/DAF qui anticipent leurs risques au lieu de les subir
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/dashboard"
                            className="px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all hover:shadow-xl"
                        >
                            Essayer gratuitement
                        </a>
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold transition-all hover:bg-surface-elevated"
                        >
                            Planifier une démo
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

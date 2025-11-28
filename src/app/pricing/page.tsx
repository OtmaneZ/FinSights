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
            name: 'Gratuit',
            icon: Zap,
            price: 0,
            priceYearly: 0,
            features: [
                '✅ 1 entreprise',
                '✅ 10 uploads CSV/mois',
                '✅ Dashboard complet (15 KPIs)',
                '✅ 10 questions IA/jour',
                '✅ Export PDF avec watermark',
                '✅ Visualisations standards',
                '❌ Sauvegarde cloud',
                '❌ Alertes email',
                '❌ API REST'
            ],
            cta: 'Commencer gratuitement',
            highlight: false,
            popular: false
        },
        {
            name: 'Pro',
            icon: Shield,
            price: 79,
            priceYearly: 758, // -20%
            features: [
                '✅ 5 entreprises',
                '✅ IA illimitée (GPT-4)',
                '✅ Uploads CSV illimités',
                '✅ Sauvegarde cloud 90 jours',
                '✅ Alertes email temps réel',
                '✅ Export PDF/Excel branded',
                '✅ Support email 24h',
                '✅ API REST (1000 calls/jour)',
                '✅ Webhooks basiques',
                '✅ Drill-down 3 niveaux'
            ],
            cta: 'Essai gratuit 14 jours',
            highlight: true,
            popular: true
        },
        {
            name: 'Scale',
            icon: Rocket,
            price: 199,
            priceYearly: 1910, // -20%
            features: [
                '✅ Entreprises illimitées',
                '✅ Multi-utilisateurs (5 sièges)',
                '✅ API REST complète (10k calls/jour)',
                '✅ Historique 3 ans de données',
                '✅ Webhooks avancés',
                '✅ Support prioritaire 4h',
                '✅ Onboarding personnalisé',
                '✅ White-label (logo custom)',
                '✅ SLA 99.9%'
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
                '✅ Tout Scale +',
                '✅ Utilisateurs illimités',
                '✅ Intégrations sur-mesure',
                '✅ SSO/SAML',
                '✅ Hébergement dédié',
                '✅ Account manager dédié',
                '✅ Formation équipe complète',
                '✅ Audit sécurité',
                '✅ Contrat annuel'
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
                    Choisissez votre plan
                </h1>
                <p className="text-xl text-secondary max-w-2xl mx-auto mb-4">
                    Des tarifs transparents pour chaque étape de votre croissance
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
                                if (plan.name === 'Gratuit' || plan.name === 'Pro') {
                                    // ✨ Pure SaaS: redirect to signup for FREE and PRO
                                    window.location.href = '/auth/signup'
                                } else {
                                    // Keep Calendly for SCALE and ENTERPRISE (higher touch)
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
                    <h2 className="text-3xl font-bold mb-4">Prêt à transformer votre analyse financière ?</h2>
                    <p className="text-secondary mb-8">
                        Rejoignez les DAF modernes qui automatisent leur reporting
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

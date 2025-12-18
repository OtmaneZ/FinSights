/**
 * Integrations Hub - Page publique
 * /integrations
 *
 * Présente les 3 plateformes d'automatisation supportées
 */

import Link from 'next/link';
import { Zap, Workflow, Boxes, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';

export default function IntegrationsHubPage() {
    const platforms = [
        {
            name: 'n8n',
            logo: '/images/n8n-logo.svg',
            tagline: 'Workflows personnalisables',
            description: 'Open-source et self-hosted. Idéal pour les équipes techniques qui veulent un contrôle total.',
            features: [
                'Gratuit (self-hosted)',
                'Workflows visuels',
                'Connecteurs illimités',
                'Hébergement flexible'
            ],
            price: 'Gratuit à partir de 20€/mois',
            difficulty: 'Technique',
            href: '/integrations/n8n',
            color: 'from-pink-500 to-rose-500'
        },
        {
            name: 'Zapier',
            logo: '/images/zapier-logo.svg',
            tagline: 'Automatisation no-code',
            description: 'La solution la plus populaire. Interface simple, parfaite pour démarrer rapidement.',
            features: [
                'Interface intuitive',
                '5000+ apps connectées',
                'Templates prêts à l\'emploi',
                'Support client excellent'
            ],
            price: 'À partir de 29€/mois',
            difficulty: 'Débutant',
            href: '/integrations/zapier',
            color: 'from-orange-500 to-amber-500'
        },
        {
            name: 'Make',
            logo: '/images/make-logo.svg',
            tagline: 'Scénarios avancés',
            description: 'Anciennement Integromat. Pour les workflows complexes avec conditions et boucles.',
            features: [
                'Interface visuelle avancée',
                'Logique conditionnelle',
                'Gestion d\'erreurs robuste',
                'Prix compétitif'
            ],
            price: 'À partir de 9€/mois',
            difficulty: 'Intermédiaire',
            href: '/integrations/make',
            color: 'from-purple-500 to-indigo-500'
        }
    ];

    return (
        <div className="min-h-screen bg-primary">
            <Header />

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-primary mb-4">
                        Automatisez vos imports financiers
                    </h1>
                    <p className="text-xl text-secondary max-w-3xl mx-auto">
                        Connectez FinSight à vos outils comptables favoris via n8n, Zapier ou Make.
                        Plus besoin d'importer manuellement vos fichiers.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: Zap, title: 'Temps réel', desc: 'Dashboards mis à jour automatiquement' },
                        { icon: CheckCircle, title: 'Sans erreur', desc: 'Fini les copier-coller manuels' },
                        { icon: Workflow, title: 'Flexible', desc: 'Choisissez la plateforme qui vous convient' }
                    ].map((benefit, i) => (
                        <div key={i} className="surface rounded-xl p-6 border border-border-default text-center">
                            <benefit.icon className="w-10 h-10 text-accent-primary mx-auto mb-3" />
                            <h3 className="font-semibold text-primary mb-2">{benefit.title}</h3>
                            <p className="text-sm text-secondary">{benefit.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Platforms Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {platforms.map((platform) => (
                        <Link
                            key={platform.name}
                            href={platform.href}
                            className="surface rounded-2xl p-8 border border-border-default hover:border-accent-primary transition-all hover:shadow-xl group"
                        >
                            {/* Header */}
                            <div className="mb-6">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4`}>
                                    <Boxes className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-primary mb-2">{platform.name}</h2>
                                <p className="text-sm text-accent-primary font-medium">{platform.tagline}</p>
                            </div>

                            {/* Description */}
                            <p className="text-secondary mb-6 leading-relaxed">
                                {platform.description}
                            </p>

                            {/* Features */}
                            <ul className="space-y-2 mb-6">
                                {platform.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-secondary">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Footer */}
                            <div className="pt-6 border-t border-border-default">
                                <div className="flex items-center justify-center gap-2 text-accent-primary font-medium group-hover:gap-3 transition-all">
                                    Voir le guide
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center surface rounded-2xl p-12 border border-accent-primary-border bg-accent-primary-subtle">
                    <h2 className="text-3xl font-bold text-primary mb-4">
                        Besoin d'aide pour configurer ?
                    </h2>
                    <p className="text-secondary mb-6 max-w-2xl mx-auto">
                        Nos guides pas-à-pas vous accompagnent dans la configuration de chaque plateforme.
                        Templates prêts à l'emploi inclus.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-accent-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-primary-hover transition-colors"
                    >
                        Contactez-nous
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

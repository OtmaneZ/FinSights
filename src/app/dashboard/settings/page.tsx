/**
 * Settings Hub Page
 * /dashboard/settings
 *
 * Page centrale des paramètres avec navigation vers :
 * - Profil utilisateur
 * - Gestion des entreprises
 * - Intégrations (n8n, Zapier, Make)
 * - API Keys
 * - Webhooks
 * - Notifications
 * - Facturation
 */

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User,
    Building2,
    Zap,
    Key,
    Webhook,
    Bell,
    CreditCard,
    ChevronRight,
    Crown,
    CheckCircle
} from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const userPlan = (session?.user as any)?.plan || 'FREE';

    const settingsCards = [
        {
            icon: User,
            title: 'Profil',
            description: 'Gérez vos informations personnelles et préférences',
            href: '/dashboard/settings/profile',
            available: true,
            planRequired: null
        },
        {
            icon: Building2,
            title: 'Entreprises',
            description: `${userPlan === 'FREE' ? '1 entreprise' : userPlan === 'PRO' ? '5 entreprises' : 'Illimité'} • Gérez vos entités`,
            href: '/dashboard/settings/companies',
            available: true,
            planRequired: null
        },
        {
            icon: Zap,
            title: 'Intégrations',
            description: 'Connectez n8n, Zapier, Pennylane, Sellsy',
            href: '/dashboard/settings/integrations',
            available: true,
            planRequired: null,
            badge: 'Nouveau'
        },
        {
            icon: Key,
            title: 'Clés API',
            description: 'Créez et gérez vos clés d\'authentification API',
            href: '/dashboard/api-keys',
            available: true,
            planRequired: null
        },
        {
            icon: Webhook,
            title: 'Webhooks',
            description: 'Recevez des événements en temps réel sur vos endpoints',
            href: '/dashboard/webhooks',
            available: userPlan !== 'FREE',
            planRequired: 'PRO'
        },
        {
            icon: Bell,
            title: 'Notifications',
            description: 'Configurez les alertes email et seuils critiques',
            href: '/dashboard/settings/notifications',
            available: true,
            planRequired: null
        },
        {
            icon: CreditCard,
            title: 'Facturation',
            description: userPlan === 'FREE' ? 'Passez à Business pour débloquer toutes les fonctionnalités' : 'Gérez votre abonnement et moyens de paiement',
            href: userPlan === 'FREE' ? '/tarifs' : '/dashboard/settings/billing',
            available: true,
            planRequired: null
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Paramètres</h1>
                <p className="text-secondary">
                    Gérez votre compte, vos intégrations et vos préférences
                </p>
            </div>

            {/* Plan Badge */}
            {userPlan !== 'FREE' && (
                <div className="surface rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Crown className="w-6 h-6 text-accent-primary" />
                        <div>
                            <h3 className="font-semibold text-primary">Plan {userPlan}</h3>
                            <p className="text-sm text-secondary">
                                Toutes les fonctionnalités avancées débloquées
                            </p>
                        </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
            )}

            {/* Settings Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settingsCards.map((card) => {
                    const Icon = card.icon;
                    const isLocked = !card.available;

                    return (
                        <Link
                            key={card.title}
                            href={isLocked ? '#' : card.href}
                            className={`
                                surface rounded-xl p-6
                                transition-all duration-200
                                ${isLocked
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer surface-hover'
                                }
                            `}
                            onClick={(e) => {
                                if (isLocked) {
                                    e.preventDefault();
                                    router.push('/tarifs');
                                }
                            }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-lg bg-accent-primary/10">
                                    <Icon className="w-6 h-6 text-accent-primary" />
                                </div>
                                {card.badge && !isLocked && (
                                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                                        {card.badge}
                                    </span>
                                )}
                                {isLocked && (
                                    <span className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-semibold flex items-center gap-1">
                                        <Crown className="w-3 h-3" />
                                        {card.planRequired}
                                    </span>
                                )}
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                                    {card.title}
                                    {!isLocked && (
                                        <ChevronRight className="w-4 h-4 text-secondary group-hover:text-accent-primary transition-colors" />
                                    )}
                                </h3>
                                <p className="text-sm text-secondary">
                                    {card.description}
                                </p>
                            </div>

                            {isLocked && (
                                <div className="mt-4 pt-4 border-t border-border-default">
                                    <button
                                        className="text-sm text-accent-primary hover:underline font-medium"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push('/tarifs');
                                        }}
                                    >
                                        Passer à {card.planRequired} →
                                    </button>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            {userPlan === 'FREE' && (
                <div className="mt-8 surface rounded-xl p-6 border-2 border-accent-primary/20">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-accent-primary/10">
                            <Crown className="w-6 h-6 text-accent-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-primary mb-2">
                                Débloquez tout le potentiel de FinSights
                            </h3>
                            <p className="text-sm text-secondary mb-4">
                                Passez à Business pour accéder aux webhooks, 5 entreprises, intégrations avancées et support prioritaire.
                            </p>
                            <Link
                                href="/tarifs"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-medium transition-colors"
                            >
                                Voir les offres
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="mt-8 text-center">
                <p className="text-sm text-secondary mb-2">
                    Besoin d'aide pour configurer vos paramètres ?
                </p>
                <Link
                    href="/faq"
                    className="text-sm text-accent-primary hover:underline font-medium"
                >
                    Consultez notre FAQ →
                </Link>
            </div>
        </div>
    );
}

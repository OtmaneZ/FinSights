/**
 * Make Integration Guide - Page publique
 * /integrations/make
 */

import Link from 'next/link';
import { Download, ExternalLink, ArrowLeft, Boxes, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';

export default function MakeGuidePage() {
    return (
        <div className="min-h-screen bg-primary">
            <Header />

            <div className="max-w-5xl mx-auto px-6 py-12">
                <Link href="/integrations" className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux intégrations
                </Link>

                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                            <Boxes className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-primary">Guide Make</h1>
                            <p className="text-secondary">Créez des scénarios avancés avec Make (ex-Integromat)</p>
                        </div>
                    </div>
                </div>

                {/* Quick Setup */}
                <div className="surface rounded-xl p-6 border border-border-default mb-8">
                    <h2 className="text-xl font-semibold text-primary mb-4">🎯 Configuration</h2>
                    <div className="space-y-4">
                        {[
                            { step: '1', text: 'Téléchargez le scénario JSON ci-dessous' },
                            { step: '2', text: 'Créez un compte Make (gratuit jusqu\'à 1000 opérations/mois)' },
                            { step: '3', text: 'Importez le scénario : Create a new scenario → Import Blueprint' },
                            { step: '4', text: 'Configurez vos connexions (Pennylane, FinSight API)' },
                            { step: '5', text: 'Activez le scénario avec le toggle ON' }
                        ].map((item) => (
                            <div key={item.step} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    {item.step}
                                </div>
                                <p className="text-secondary pt-0.5">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Template Download */}
                <div className="surface rounded-xl p-6 border border-border-default mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4">📦 Scénario Pennylane</h3>
                    <p className="text-secondary mb-4">
                        Synchronisation quotidienne automatique de vos factures Pennylane → FinSight.
                    </p>
                    <a
                        href="/templates/make/pennylane-daily-sync.json"
                        download
                        className="inline-flex items-center gap-2 bg-accent-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-primary-hover transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Télécharger le blueprint
                    </a>
                </div>

                {/* Make Advantages */}
                <div className="surface rounded-xl p-6 border border-border-default mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4">✨ Pourquoi Make ?</h3>
                    <ul className="space-y-3">
                        {[
                            'Interface visuelle claire avec flux de données',
                            'Gestion avancée des erreurs et retry automatique',
                            'Débogage facile avec historique des exécutions',
                            'Prix compétitif : 9€/mois pour 10 000 opérations'
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-secondary">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* API Configuration */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                        🔧 Configuration HTTP Module
                    </h3>
                    <p className="text-secondary mb-4">
                        Dans le module HTTP Make, configurez :
                    </p>
                    <div className="space-y-2 text-sm">
                        <div className="bg-surface-secondary rounded p-3">
                            <span className="text-tertiary">URL :</span>{' '}
                            <code className="text-secondary">https://finsight.zineinsight.com/api/upload</code>
                        </div>
                        <div className="bg-surface-secondary rounded p-3">
                            <span className="text-tertiary">Method :</span>{' '}
                            <code className="text-secondary">POST</code>
                        </div>
                        <div className="bg-surface-secondary rounded p-3">
                            <span className="text-tertiary">Headers :</span>{' '}
                            <code className="text-secondary">Authorization: Bearer YOUR_API_KEY</code>
                        </div>
                    </div>
                    <p className="text-sm text-secondary mt-4">
                        Générez votre clé API dans{' '}
                        <Link href="/dashboard/settings/integrations" className="text-accent-primary underline">
                            Dashboard → Integrations
                        </Link>
                    </p>
                </div>

                {/* CTA */}
                <div className="surface rounded-xl p-8 border border-accent-primary-border bg-accent-primary-subtle text-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">Support personnalisé</h2>
                    <p className="text-secondary mb-6">
                        Notre équipe peut configurer votre premier scénario Make gratuitement.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-accent-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-primary-hover transition-colors"
                    >
                        Réserver un appel
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

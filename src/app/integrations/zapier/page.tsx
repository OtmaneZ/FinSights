/**
 * Zapier Integration Guide - Page publique
 * /integrations/zapier
 */

import Link from 'next/link';
import { Download, ExternalLink, ArrowLeft, Zap, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';

export default function ZapierGuidePage() {
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
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-primary">Guide Zapier</h1>
                            <p className="text-secondary">Connectez FinSight en quelques clics</p>
                        </div>
                    </div>
                </div>

                {/* Quick Setup */}
                <div className="surface rounded-xl p-6 border border-border-default mb-8">
                    <h2 className="text-xl font-semibold text-primary mb-4">⚡ Configuration rapide</h2>
                    <div className="space-y-4">
                        {[
                            { step: '1', text: 'Téléchargez le template ci-dessous' },
                            { step: '2', text: 'Créez un compte Zapier (gratuit pour 100 tâches/mois)' },
                            { step: '3', text: 'Importez le Zap avec "Use this Zap"' },
                            { step: '4', text: 'Connectez vos comptes (Pennylane + FinSight API)' },
                            { step: '5', text: 'Activez votre Zap ✅' }
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
                    <h3 className="text-lg font-semibold text-primary mb-4">📦 Template Pennylane</h3>
                    <p className="text-secondary mb-4">
                        Synchronise automatiquement vos factures Pennylane vers FinSight chaque jour.
                    </p>
                    <a
                        href="/templates/zapier/pennylane-daily-sync.json"
                        download
                        className="inline-flex items-center gap-2 bg-accent-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-primary-hover transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Télécharger le template
                    </a>
                </div>

                {/* API Key Setup */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-3">
                        🔑 Configuration API FinSight
                    </h3>
                    <p className="text-secondary mb-4">
                        Pour que Zapier puisse envoyer des données à FinSight, vous devez :
                    </p>
                    <ol className="space-y-2 text-secondary">
                        <li>1. Générer une clé API dans <Link href="/dashboard/settings/integrations" className="text-accent-primary underline">Dashboard → Integrations</Link></li>
                        <li>2. Dans votre Zap, ajouter un header HTTP :</li>
                    </ol>
                    <div className="bg-surface-secondary rounded-lg p-4 font-mono text-sm text-secondary mt-4">
                        Authorization: Bearer VOTRE_CLE_API
                    </div>
                </div>

                {/* CTA */}
                <div className="surface rounded-xl p-8 border border-accent-primary-border bg-accent-primary-subtle text-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">Besoin d'aide ?</h2>
                    <p className="text-secondary mb-6">
                        Notre équipe peut vous aider à configurer votre premier Zap gratuitement.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-accent-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-primary-hover transition-colors"
                    >
                        Contactez-nous
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

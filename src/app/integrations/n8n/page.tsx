/**
 * n8n Integration Guide - Page publique
 * /integrations/n8n
 *
 * Guide complet pour configurer n8n avec FinSight
 */

import Link from 'next/link';
import { Download, ExternalLink, Copy, CheckCircle, ArrowLeft, Play } from 'lucide-react';
import Header from '@/components/Header';

export default function N8nGuidePage() {
    const templates = [
        {
            name: 'Pennylane Daily Sync',
            description: 'Synchronise vos factures Pennylane chaque matin à 8h',
            file: '/templates/n8n/pennylane-daily-sync.json',
            difficulty: 'Facile',
            time: '5 min'
        },
        {
            name: 'Sellsy Realtime Webhook',
            description: 'Reçoit les événements Sellsy en temps réel',
            file: '/templates/n8n/sellsy-realtime-webhook.json',
            difficulty: 'Moyen',
            time: '10 min'
        },
        {
            name: 'Generic CSV Upload',
            description: 'Transforme n\'importe quel CSV au format FinSight',
            file: '/templates/n8n/generic-csv-upload.json',
            difficulty: 'Facile',
            time: '3 min'
        }
    ];

    return (
        <div className="min-h-screen bg-primary">
            <Header />

            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Breadcrumb */}
                <Link href="/integrations" className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux intégrations
                </Link>

                {/* Hero */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-primary">Guide n8n</h1>
                            <p className="text-secondary">Automatisez FinSight avec des workflows personnalisables</p>
                        </div>
                    </div>
                </div>

                {/* Prerequisites */}
                <div className="surface rounded-xl p-6 border border-border-default mb-8">
                    <h2 className="text-xl font-semibold text-primary mb-4">📋 Prérequis</h2>
                    <ul className="space-y-2">
                        {[
                            'Un compte n8n (cloud ou self-hosted)',
                            'Votre clé API FinSight (générée dans /dashboard/settings/integrations)',
                            'Votre ID d\'entreprise FinSight',
                            'Accès API à votre outil source (Pennylane, Sellsy, etc.)'
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-secondary">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Step-by-step Guide */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-primary mb-6">🚀 Configuration en 4 étapes</h2>

                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="surface rounded-xl p-6 border border-border-default">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                                    1
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-primary mb-2">
                                        Téléchargez un template
                                    </h3>
                                    <p className="text-secondary mb-4">
                                        Choisissez le workflow correspondant à votre cas d'usage ci-dessous.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="surface rounded-xl p-6 border border-border-default">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                                    2
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-primary mb-2">
                                        Importez dans n8n
                                    </h3>
                                    <p className="text-secondary mb-4">
                                        Dans n8n, cliquez sur <code className="bg-surface-secondary px-2 py-1 rounded text-sm">Import Workflow</code> et sélectionnez le fichier JSON téléchargé.
                                    </p>
                                    <div className="bg-surface-secondary rounded-lg p-4 font-mono text-sm text-secondary">
                                        Menu → Workflows → Import from file → Sélectionner le .json
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="surface rounded-xl p-6 border border-border-default">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                                    3
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-primary mb-2">
                                        Configurez vos clés API
                                    </h3>
                                    <p className="text-secondary mb-4">
                                        Remplacez les placeholders par vos vraies clés :
                                    </p>
                                    <ul className="space-y-2 mb-4">
                                        <li className="flex items-start gap-2">
                                            <Copy className="w-4 h-4 text-accent-primary mt-1 flex-shrink-0" />
                                            <span className="text-secondary">
                                                <code className="bg-surface-secondary px-2 py-1 rounded text-sm">YOUR_FINSIGHT_API_KEY</code> → Votre clé FinSight
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Copy className="w-4 h-4 text-accent-primary mt-1 flex-shrink-0" />
                                            <span className="text-secondary">
                                                <code className="bg-surface-secondary px-2 py-1 rounded text-sm">YOUR_PENNYLANE_API_KEY</code> → Votre clé Pennylane
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Copy className="w-4 h-4 text-accent-primary mt-1 flex-shrink-0" />
                                            <span className="text-secondary">
                                                <code className="bg-surface-secondary px-2 py-1 rounded text-sm">YOUR_COMPANY_ID</code> → Votre ID entreprise FinSight
                                            </span>
                                        </li>
                                    </ul>
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                            💡 <strong>Astuce :</strong> Pour générer votre clé API FinSight, allez dans{' '}
                                            <Link href="/dashboard/settings/integrations" className="underline">
                                                Dashboard → Settings → Integrations
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="surface rounded-xl p-6 border border-border-default">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                                    4
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-primary mb-2">
                                        Activez le workflow
                                    </h3>
                                    <p className="text-secondary mb-4">
                                        Cliquez sur le toggle <code className="bg-surface-secondary px-2 py-1 rounded text-sm">Active</code> en haut à droite de n8n.
                                    </p>
                                    <p className="text-secondary">
                                        Testez immédiatement en cliquant sur <code className="bg-surface-secondary px-2 py-1 rounded text-sm">Execute Workflow</code> ✅
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Templates Download Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-primary mb-6">📦 Templates disponibles</h2>
                    <div className="grid gap-4">
                        {templates.map((template) => (
                            <div key={template.name} className="surface rounded-xl p-6 border border-border-default hover:border-accent-primary transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-primary mb-2">{template.name}</h3>
                                        <p className="text-secondary mb-4">{template.description}</p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-tertiary">
                                                Difficulté: <span className="text-secondary font-medium">{template.difficulty}</span>
                                            </span>
                                            <span className="text-tertiary">
                                                Temps: <span className="text-secondary font-medium">{template.time}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <a
                                        href={template.file}
                                        download
                                        className="flex items-center gap-2 bg-accent-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-primary-hover transition-colors whitespace-nowrap"
                                    >
                                        <Download className="w-4 h-4" />
                                        Télécharger
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Video Tutorial */}
                <div className="surface rounded-xl p-8 border border-accent-primary-border bg-accent-primary-subtle text-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">🎥 Vidéo tutoriel</h2>
                    <p className="text-secondary mb-6">
                        Regardez notre guide vidéo de 3 minutes pour configurer votre premier workflow n8n.
                    </p>
                    <a
                        href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-accent-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-primary-hover transition-colors"
                    >
                        Voir la vidéo
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}

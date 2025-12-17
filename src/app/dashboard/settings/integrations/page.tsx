/**
 * Integrations Settings Page
 * /dashboard/settings/integrations
 *
 * Permet aux users de :
 * - Générer API Key pour n8n
 * - Copier endpoint URL
 * - Télécharger templates n8n
 * - Voir logs de sync
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Webhook,
    Copy,
    Check,
    Download,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle,
    XCircle,
    ExternalLink,
    Zap
} from 'lucide-react';

export default function IntegrationsPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [apiKey, setApiKey] = useState<string | null>(null);
    const [showApiKey, setShowApiKey] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [syncLogs, setSyncLogs] = useState<any[]>([]);

    const endpointUrl = 'https://finsight.zineinsight.com/api/integrations/n8n/ingest';

    useEffect(() => {
        fetchApiKey();
        fetchSyncLogs();
    }, []);

    const fetchApiKey = async () => {
        try {
            const res = await fetch('/api/keys');
            const data = await res.json();
            if (data.keys && data.keys.length > 0) {
                setApiKey(data.keys[0].key);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching API key:', error);
            setLoading(false);
        }
    };

    const generateApiKey = async () => {
        try {
            const res = await fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'n8n Integration' })
            });
            const data = await res.json();
            if (data.success) {
                setApiKey(data.key.key);
            }
        } catch (error) {
            console.error('Error generating API key:', error);
        }
    };

    const fetchSyncLogs = async () => {
        // TODO: Implement logs endpoint
        setSyncLogs([
            { date: '2025-12-17 08:00', status: 'success', transactions: 12, source: 'Pennylane' },
            { date: '2025-12-16 08:00', status: 'success', transactions: 8, source: 'Pennylane' },
            { date: '2025-12-15 08:00', status: 'error', transactions: 0, source: 'Pennylane', error: 'API timeout' },
        ]);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadTemplate = (templateName: string) => {
        // TODO: Implement template download
        const templates = {
            'pennylane': '/templates/n8n-pennylane-daily-sync.json',
            'sellsy': '/templates/n8n-sellsy-realtime.json',
            'generic': '/templates/n8n-generic-csv.json'
        };
        // window.location.href = templates[templateName];
        alert(`Template ${templateName} téléchargé (à implémenter)`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
                    <p className="mt-4 text-secondary">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.push('/dashboard/settings')}
                    className="text-secondary hover:text-primary mb-4 flex items-center gap-2"
                >
                    ← Retour
                </button>
                <h1 className="text-3xl font-bold text-primary mb-2">Intégrations</h1>
                <p className="text-secondary">
                    Automatisez vos imports de données avec n8n, Zapier ou Make.
                </p>
            </div>

            {/* API Key Section */}
            <div className="surface rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-accent-primary" />
                    <h2 className="text-xl font-bold text-primary">API Key</h2>
                </div>

                {!apiKey ? (
                    <div className="text-center py-8">
                        <p className="text-secondary mb-4">
                            Générez une API Key pour connecter n8n, Zapier ou Make
                        </p>
                        <button
                            onClick={generateApiKey}
                            className="btn-primary"
                        >
                            Générer API Key
                        </button>
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                            Votre API Key (à garder secrète)
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type={showApiKey ? 'text' : 'password'}
                                value={apiKey}
                                readOnly
                                className="flex-1 px-4 py-2 surface-elevated rounded-lg font-mono text-sm"
                            />
                            <button
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="p-2 surface-elevated rounded-lg hover:bg-surface transition-colors"
                            >
                                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => copyToClipboard(apiKey)}
                                className="p-2 surface-elevated rounded-lg hover:bg-surface transition-colors"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Endpoint URL */}
            <div className="surface rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Webhook className="w-6 h-6 text-accent-primary" />
                    <h2 className="text-xl font-bold text-primary">Endpoint URL</h2>
                </div>

                <label className="block text-sm font-medium text-secondary mb-2">
                    URL à utiliser dans votre workflow n8n
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={endpointUrl}
                        readOnly
                        className="flex-1 px-4 py-2 surface-elevated rounded-lg font-mono text-sm"
                    />
                    <button
                        onClick={() => copyToClipboard(endpointUrl)}
                        className="p-2 surface-elevated rounded-lg hover:bg-surface transition-colors"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>

                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-secondary">
                        <strong>Headers requis :</strong>
                        <br />
                        <code className="text-xs">Authorization: Bearer {apiKey ? 'VOTRE_API_KEY' : '[générez une API Key]'}</code>
                        <br />
                        <code className="text-xs">Content-Type: application/json</code>
                    </p>
                </div>
            </div>

            {/* Templates n8n */}
            <div className="surface rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-primary mb-4">Templates n8n Prêts à l'Emploi</h2>

                <div className="grid gap-4">
                    {/* Template 1 */}
                    <div className="surface-elevated rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-primary">Pennylane Daily Sync</h3>
                            <p className="text-sm text-secondary">Synchronisation quotidienne automatique (8h)</p>
                        </div>
                        <button
                            onClick={() => downloadTemplate('pennylane')}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Télécharger
                        </button>
                    </div>

                    {/* Template 2 */}
                    <div className="surface-elevated rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-primary">Sellsy Real-Time</h3>
                            <p className="text-sm text-secondary">Webhook temps réel sur nouvelle facture</p>
                        </div>
                        <button
                            onClick={() => downloadTemplate('sellsy')}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Télécharger
                        </button>
                    </div>

                    {/* Template 3 */}
                    <div className="surface-elevated rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-primary">Generic CSV Import</h3>
                            <p className="text-sm text-secondary">Import CSV via webhook manuel</p>
                        </div>
                        <button
                            onClick={() => downloadTemplate('generic')}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Télécharger
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    <a
                        href="https://docs.finsight.zineinsight.com/integrations/n8n"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-primary hover:underline flex items-center gap-2 text-sm"
                    >
                        Voir la documentation complète
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Sync Logs */}
            <div className="surface rounded-xl p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Dernières Synchronisations</h2>

                {syncLogs.length === 0 ? (
                    <p className="text-secondary text-center py-8">
                        Aucune synchronisation pour le moment
                    </p>
                ) : (
                    <div className="space-y-3">
                        {syncLogs.map((log, index) => (
                            <div
                                key={index}
                                className="surface-elevated rounded-lg p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    {log.status === 'success' ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                    <div>
                                        <p className="font-medium text-primary">{log.source}</p>
                                        <p className="text-sm text-secondary">{log.date}</p>
                                        {log.error && (
                                            <p className="text-sm text-red-500 mt-1">{log.error}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-primary">{log.transactions}</p>
                                    <p className="text-sm text-secondary">transactions</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

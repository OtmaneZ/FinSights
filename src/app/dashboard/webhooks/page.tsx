/**
 * Webhooks Management Page
 *
 * Features:
 * - Create webhook with URL and event subscriptions
 * - List all webhooks with status
 * - Toggle active/inactive
 * - View delivery logs
 * - Delete webhooks
 * - One-time secret display on creation
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';
import {
    Webhook,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle,
    Copy,
    Activity,
    AlertCircle,
    Globe,
    Clock,
} from 'lucide-react';

interface WebhookData {
    id: string;
    url: string;
    events: string[];
    active: boolean;
    lastTriggered?: string;
    totalDeliveries: number;
    createdAt: string;
}

interface WebhookLog {
    id: string;
    event: string;
    success: boolean;
    statusCode?: number;
    attempts: number;
    errorReason?: string;
    createdAt: string;
}

const AVAILABLE_EVENTS = [
    { value: 'dashboard.created', label: 'Dashboard créé', description: 'Déclenché après upload' },
    { value: 'dashboard.updated', label: 'Dashboard mis à jour', description: 'Déclenché après modification' },
    { value: 'dashboard.deleted', label: 'Dashboard supprimé', description: 'Déclenché après suppression' },
    { value: 'kpi.threshold_reached', label: 'Seuil KPI atteint', description: 'Alerte sur métriques' },
    { value: 'company.created', label: 'Entreprise créée', description: 'Nouvelle entreprise ajoutée' },
    { value: 'company.updated', label: 'Entreprise modifiée', description: 'Informations mises à jour' },
];

export default function WebhooksPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);
    const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
    const [showLogsModal, setShowLogsModal] = useState(false);
    const [newSecret, setNewSecret] = useState<string | null>(null);

    // Form state
    const [formUrl, setFormUrl] = useState('');
    const [formEvents, setFormEvents] = useState<string[]>([]);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        } else if (status === 'authenticated') {
            fetchWebhooks();
        }
    }, [status, router]);

    const fetchWebhooks = async () => {
        try {
            const res = await fetch('/api/webhooks');
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur lors du chargement');
            }
            const data = await res.json();
            setWebhooks(data.webhooks);
        } catch (error: any) {
            logger.error('Error fetching webhooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWebhook = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!formUrl.startsWith('http')) {
            setFormError('URL invalide (doit commencer par http:// ou https://)');
            return;
        }

        if (formEvents.length === 0) {
            setFormError('Sélectionnez au moins un événement');
            return;
        }

        try {
            const res = await fetch('/api/webhooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: formUrl, events: formEvents }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors de la création');
            }

            // Show secret modal
            setNewSecret(data.webhook.secret);
            setShowCreateModal(false);
            setFormUrl('');
            setFormEvents([]);
            fetchWebhooks();
        } catch (error: any) {
            setFormError(error.message);
        }
    };

    const handleToggleActive = async (id: string, currentActive: boolean) => {
        try {
            const res = await fetch(`/api/webhooks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !currentActive }),
            });

            if (res.ok) {
                fetchWebhooks();
            }
        } catch (error) {
            logger.error('Error toggling webhook:', error);
        }
    };

    const handleDeleteWebhook = async (id: string) => {
        if (!confirm('Supprimer ce webhook ?')) return;

        try {
            const res = await fetch(`/api/webhooks/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchWebhooks();
            }
        } catch (error) {
            logger.error('Error deleting webhook:', error);
        }
    };

    const handleViewLogs = async (id: string) => {
        try {
            const res = await fetch(`/api/webhooks/${id}/logs`);
            const data = await res.json();
            setWebhookLogs(data.logs || []);
            setSelectedWebhook(id);
            setShowLogsModal(true);
        } catch (error) {
            logger.error('Error fetching logs:', error);
        }
    };

    const copySecret = () => {
        if (newSecret) {
            navigator.clipboard.writeText(newSecret);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">Chargement...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Webhook className="w-8 h-8 text-blue-600" />
                                <h1 className="text-3xl font-bold text-slate-900">Webhooks</h1>
                            </div>
                            <p className="text-slate-600">
                                Recevez des notifications en temps réel sur vos événements FinSight
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Nouveau Webhook
                        </button>
                    </div>
                </div>

                {/* Webhooks List */}
                {webhooks.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Webhook className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun webhook configuré</h3>
                        <p className="text-slate-600 mb-6">
                            Les webhooks permettent de recevoir des notifications HTTP en temps réel
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Créer mon premier webhook
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {webhooks.map((webhook) => (
                            <div
                                key={webhook.id}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Globe className="w-5 h-5 text-slate-400" />
                                            <span className="font-mono text-sm text-slate-700">{webhook.url}</span>
                                            {webhook.active ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                    Actif
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                                                    Inactif
                                                </span>
                                            )}
                                        </div>

                                        {/* Events */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {webhook.events.map((event) => (
                                                <span
                                                    key={event}
                                                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                                                >
                                                    {event}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-6 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-4 h-4" />
                                                <span>{webhook.totalDeliveries} livraisons</span>
                                            </div>
                                            {webhook.lastTriggered && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        Dernier: {new Date(webhook.lastTriggered).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleActive(webhook.id, webhook.active)}
                                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                            title={webhook.active ? 'Désactiver' : 'Activer'}
                                        >
                                            {webhook.active ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleViewLogs(webhook.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Voir les logs"
                                        >
                                            <Activity className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWebhook(webhook.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Créer un webhook</h2>

                            <form onSubmit={handleCreateWebhook}>
                                {/* URL */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        URL de destination
                                    </label>
                                    <input
                                        type="url"
                                        value={formUrl}
                                        onChange={(e) => setFormUrl(e.target.value)}
                                        placeholder="https://votre-domaine.com/webhooks/finsight"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Events */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        Événements à suivre
                                    </label>
                                    <div className="space-y-2">
                                        {AVAILABLE_EVENTS.map((event) => (
                                            <label
                                                key={event.value}
                                                className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formEvents.includes(event.value)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormEvents([...formEvents, event.value]);
                                                        } else {
                                                            setFormEvents(formEvents.filter((ev) => ev !== event.value));
                                                        }
                                                    }}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <div className="font-medium text-slate-900">{event.label}</div>
                                                    <div className="text-sm text-slate-600">{event.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {formError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                        <AlertCircle className="w-5 h-5" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setFormUrl('');
                                            setFormEvents([]);
                                            setFormError('');
                                        }}
                                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Créer le webhook
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Secret Display Modal */}
                {newSecret && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                            <div className="text-center mb-6">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Webhook créé !</h2>
                                <p className="text-slate-600">
                                    Voici votre secret de signature. <strong>Copiez-le maintenant</strong>, il ne
                                    sera plus affiché.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700">Secret de signature</span>
                                    <button
                                        onClick={copySecret}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Copier
                                    </button>
                                </div>
                                <code className="block font-mono text-sm text-slate-900 break-all">
                                    {newSecret}
                                </code>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
                                <strong>💡 Important :</strong> Utilisez ce secret pour vérifier la signature des
                                webhooks (header <code>X-FinSight-Signature</code>).
                            </div>

                            <button
                                onClick={() => setNewSecret(null)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                J'ai copié le secret
                            </button>
                        </div>
                    </div>
                )}

                {/* Logs Modal */}
                {showLogsModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Logs de livraison</h2>
                                <button
                                    onClick={() => setShowLogsModal(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            </div>

                            {webhookLogs.length === 0 ? (
                                <div className="text-center py-8 text-slate-600">Aucune livraison enregistrée</div>
                            ) : (
                                <div className="space-y-3">
                                    {webhookLogs.map((log) => (
                                        <div
                                            key={log.id}
                                            className={`p-4 rounded-lg border ${log.success
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-red-50 border-red-200'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {log.success ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600" />
                                                    )}
                                                    <span className="font-medium text-slate-900">{log.event}</span>
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    {new Date(log.createdAt).toLocaleString('fr-FR')}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-slate-700">
                                                {log.statusCode && <span>Status: {log.statusCode}</span>}
                                                <span>Tentatives: {log.attempts}</span>
                                                {log.errorReason && (
                                                    <span className="text-red-600">Erreur: {log.errorReason}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

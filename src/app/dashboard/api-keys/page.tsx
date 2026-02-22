/**
 * API Keys Management Page
 * /dashboard/api-keys
 * Generate, list, and revoke API keys for REST API access
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Key, Plus, Copy, Trash2, Check, AlertCircle, ArrowLeft, Eye, EyeOff, Crown } from 'lucide-react';
import { logger } from '@/lib/logger';

interface ApiKey {
    id: string;
    name: string;
    keyPreview: string;
    lastUsed: string | null;
    createdAt: string;
}

export default function ApiKeysPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Create modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // One-time display modal
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [newApiKey, setNewApiKey] = useState('');
    const [copied, setCopied] = useState(false);
    const [showFullKey, setShowFullKey] = useState(false);

    // Delete confirmation
    const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const userPlan = (session?.user as any)?.plan || 'FREE';
    const canUseApiKeys = userPlan !== 'FREE';

    useEffect(() => {
        if (session) {
            fetchApiKeys();
        }
    }, [session]);

    const fetchApiKeys = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/keys');
            const data = await response.json();

            if (response.ok) {
                setApiKeys(data.apiKeys || []);
            } else {
                setError(data.error || 'Failed to load API keys');
            }
        } catch (err) {
            logger.error('Fetch API keys error:', err);
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');
        setCreating(true);

        try {
            const response = await fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName })
            });

            const data = await response.json();

            if (response.ok) {
                // Show one-time key display modal
                setNewApiKey(data.apiKey.key);
                setShowKeyModal(true);
                setShowCreateModal(false);
                setNewKeyName('');
                await fetchApiKeys();
            } else {
                setCreateError(data.error || data.message || 'Failed to create API key');
            }
        } catch (err) {
            logger.error('Create API key error:', err);
            setCreateError('Network error');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteKeyId) return;

        setDeleting(true);

        try {
            const response = await fetch(`/api/keys?id=${deleteKeyId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setDeleteKeyId(null);
                await fetchApiKeys();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete API key');
            }
        } catch (err) {
            logger.error('Delete API key error:', err);
            alert('Network error');
        } finally {
            setDeleting(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(newApiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </button>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-primary mb-2">
                                Clés API
                            </h1>
                            <p className="text-secondary">
                                Générez des clés pour accéder à l'API REST FinSight.
                                {!canUseApiKeys && ' (Upgrade vers PRO requis)'}
                            </p>
                        </div>

                        {canUseApiKeys && (
                            <button
                                onClick={() => {
                                    setNewKeyName('');
                                    setCreateError('');
                                    setShowCreateModal(true);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Nouvelle clé API
                            </button>
                        )}
                    </div>
                </div>

                {/* FREE Plan Warning */}
                {!canUseApiKeys && (
                    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                        <Crown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-500 mb-1">
                                Fonctionnalité PRO requise
                            </p>
                            <p className="text-sm text-secondary">
                                Les clés API sont disponibles à partir du plan PRO.
                                <button
                                    onClick={() => router.push('/tarifs')}
                                    className="ml-1 text-accent-primary hover:underline font-medium"
                                >
                                    Passer à PRO →
                                </button>
                            </p>
                        </div>
                    </div>
                )}

                {/* API Keys List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                ) : apiKeys.length === 0 ? (
                    <div className="text-center py-12">
                        <Key className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
                        <p className="text-secondary mb-4">Aucune clé API créée</p>
                        {canUseApiKeys && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Créer votre première clé
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {apiKeys.map((key) => (
                            <div
                                key={key.id}
                                className="bg-surface border border-border rounded-lg p-6 hover:border-accent-primary/30 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Key className="w-5 h-5 text-accent-primary" />
                                            <h3 className="text-lg font-semibold text-primary">
                                                {key.name}
                                            </h3>
                                        </div>
                                        <p className="text-sm font-mono text-secondary mb-2 bg-background px-3 py-2 rounded border border-border inline-block">
                                            {key.keyPreview}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-secondary">
                                            <span>
                                                Créée le {new Date(key.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                            {key.lastUsed && (
                                                <span>
                                                    Dernière utilisation : {new Date(key.lastUsed).toLocaleDateString('fr-FR')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setDeleteKeyId(key.id)}
                                        className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                                        title="Révoquer"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create API Key Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-primary mb-4">
                                Nouvelle clé API
                            </h2>
                            <form onSubmit={handleCreate}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Nom de la clé *
                                    </label>
                                    <input
                                        type="text"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                                        placeholder="Production API"
                                        maxLength={50}
                                        required
                                    />
                                </div>
                                {createError && (
                                    <div className="mb-4 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-500">{createError}</p>
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        disabled={creating}
                                        className="flex-1 px-4 py-2 border border-border rounded-lg font-medium text-primary hover:bg-surface-hover transition-colors disabled:opacity-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating || !newKeyName.trim()}
                                        className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {creating ? 'Génération...' : 'Générer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* One-Time Key Display Modal */}
                {showKeyModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-lg">
                            <h2 className="text-xl font-bold text-primary mb-2">
                                ✅ Clé API générée !
                            </h2>
                            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-500">
                                    <strong>Copiez cette clé maintenant.</strong> Vous ne pourrez plus la revoir.
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Votre clé API
                                </label>
                                <div className="relative">
                                    <input
                                        type={showFullKey ? 'text' : 'password'}
                                        value={newApiKey}
                                        readOnly
                                        className="w-full px-3 py-2 pr-20 bg-background border border-border rounded-lg text-primary font-mono text-sm"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowFullKey(!showFullKey)}
                                            className="p-1.5 hover:bg-surface-hover rounded transition-colors"
                                            title={showFullKey ? 'Masquer' : 'Afficher'}
                                        >
                                            {showFullKey ? (
                                                <EyeOff className="w-4 h-4 text-secondary" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-secondary" />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={copyToClipboard}
                                            className="p-1.5 hover:bg-surface-hover rounded transition-colors"
                                            title="Copier"
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-secondary" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setShowKeyModal(false);
                                    setNewApiKey('');
                                    setShowFullKey(false);
                                }}
                                className="w-full px-4 py-2 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors"
                            >
                                J'ai sauvegardé la clé
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteKeyId && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-primary mb-4">
                                Révoquer la clé API ?
                            </h2>
                            <p className="text-secondary mb-4">
                                Cette action est irréversible. Toutes les requêtes utilisant cette clé seront refusées.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteKeyId(null)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 border border-border rounded-lg font-medium text-primary hover:bg-surface-hover transition-colors disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {deleting ? 'Suppression...' : 'Révoquer'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

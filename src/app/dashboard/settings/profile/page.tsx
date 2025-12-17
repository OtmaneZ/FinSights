/**
 * Profile Settings Page
 * /dashboard/settings/profile
 *
 * Gestion du profil utilisateur :
 * - Informations personnelles (nom, email)
 * - Changement de mot de passe
 * - Préférences de langue et timezone
 * - Suppression de compte
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    User,
    Mail,
    Lock,
    ArrowLeft,
    Save,
    AlertTriangle,
    Eye,
    EyeOff,
    CheckCircle
} from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, update } = useSession();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setEmail(session.user.email || '');
        }
    }, [session]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
                // Update session
                await update({ name });
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur lors du changement de mot de passe' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        // TODO: Implement account deletion
        alert('Fonctionnalité à implémenter : suppression de compte');
        setShowDeleteModal(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.push('/dashboard/settings')}
                    className="text-secondary hover:text-primary mb-4 flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux paramètres
                </button>
                <h1 className="text-3xl font-bold text-primary mb-2">Profil</h1>
                <p className="text-secondary">
                    Gérez vos informations personnelles et votre sécurité
                </p>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
                    message.type === 'success'
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertTriangle className="w-5 h-5" />
                    )}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            {/* Profile Information */}
            <div className="surface rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-accent-primary" />
                    <h2 className="text-xl font-bold text-primary">Informations personnelles</h2>
                </div>

                <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Nom complet
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 surface-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                placeholder="Jean Dupont"
                            />
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Email
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="flex-1 px-4 py-2 surface-elevated rounded-lg opacity-50 cursor-not-allowed"
                                />
                                <span className="text-xs text-secondary">Non modifiable</span>
                            </div>
                        </div>

                        {/* Plan Badge */}
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Plan actuel
                            </label>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-primary/10 text-accent-primary font-semibold text-sm">
                                {(session?.user as any)?.plan || 'FREE'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password */}
            <div className="surface rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <Lock className="w-6 h-6 text-accent-primary" />
                    <h2 className="text-xl font-bold text-primary">Sécurité</h2>
                </div>

                <form onSubmit={handleChangePassword}>
                    <div className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Mot de passe actuel
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 surface-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 surface-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-secondary mt-1">Minimum 8 caractères</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Confirmer le nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 surface-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                            className="btn-primary"
                        >
                            {loading ? 'Modification...' : 'Changer le mot de passe'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="surface rounded-xl p-6 border-2 border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <h2 className="text-xl font-bold text-primary">Zone dangereuse</h2>
                </div>

                <p className="text-sm text-secondary mb-4">
                    La suppression de votre compte est irréversible. Toutes vos données, dashboards et configurations seront définitivement perdus.
                </p>

                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-medium transition-colors"
                >
                    Supprimer mon compte
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="surface rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-primary mb-4">Confirmer la suppression</h3>
                        <p className="text-secondary mb-6">
                            Êtes-vous absolument sûr de vouloir supprimer votre compte ? Cette action est irréversible.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 btn-secondary"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

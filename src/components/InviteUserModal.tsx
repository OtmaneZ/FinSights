/**
 * Composant: InviteUserModal
 * Modal pour inviter un utilisateur à rejoindre l'entreprise
 */

'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string, role: 'VIEWER' | 'EDITOR' | 'ADMIN') => Promise<void>;
}

export default function InviteUserModal({
    isOpen,
    onClose,
    onInvite,
}: InviteUserModalProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'VIEWER' | 'EDITOR' | 'ADMIN'>('VIEWER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!email) {
            setError('Email requis');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email invalide');
            return;
        }

        setLoading(true);
        try {
            await onInvite(email, role);
            // Réinitialiser le formulaire
            setEmail('');
            setRole('VIEWER');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'invitation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Inviter un membre
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="mt-4">
                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="utilisateur@exemple.com"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Rôle */}
                                    <div className="mt-4">
                                        <label
                                            htmlFor="role"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Rôle
                                        </label>
                                        <select
                                            id="role"
                                            value={role}
                                            onChange={(e) =>
                                                setRole(
                                                    e.target.value as 'VIEWER' | 'EDITOR' | 'ADMIN'
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="VIEWER">
                                                Lecteur - Consultation uniquement
                                            </option>
                                            <option value="EDITOR">
                                                Éditeur - Peut uploader et modifier
                                            </option>
                                            <option value="ADMIN">
                                                Administrateur - Gestion complète
                                            </option>
                                        </select>
                                        <p className="mt-2 text-xs text-gray-500">
                                            {role === 'VIEWER' &&
                                                '✓ Consultation des dashboards uniquement'}
                                            {role === 'EDITOR' &&
                                                '✓ Upload de fichiers, édition dashboards'}
                                            {role === 'ADMIN' &&
                                                '✓ Tous les droits sauf suppression entreprise'}
                                        </p>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="mt-4 rounded-md bg-red-50 p-3">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-6 flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            {loading ? 'Envoi...' : 'Envoyer l\'invitation'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

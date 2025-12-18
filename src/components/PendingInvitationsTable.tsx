/**
 * Composant: PendingInvitationsTable
 * Affiche les invitations en attente
 */

'use client';

import { useState } from 'react';
import { EnvelopeIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Invitation {
    id: string;
    email: string;
    role: 'ADMIN' | 'EDITOR' | 'VIEWER';
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
    expiresAt: string;
    createdAt: string;
    inviter: {
        name: string | null;
        email: string;
    };
}

interface PendingInvitationsTableProps {
    invitations: Invitation[];
    onRevokeInvitation: (invitationId: string) => Promise<void>;
}

export default function PendingInvitationsTable({
    invitations,
    onRevokeInvitation,
}: PendingInvitationsTableProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleRevoke = async (invitationId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir révoquer cette invitation ?')) return;

        setLoadingId(invitationId);
        try {
            await onRevokeInvitation(invitationId);
        } finally {
            setLoadingId(null);
        }
    };

    const getRoleLabel = (role: Invitation['role']) => {
        switch (role) {
            case 'ADMIN':
                return 'Administrateur';
            case 'EDITOR':
                return 'Éditeur';
            case 'VIEWER':
                return 'Lecteur';
        }
    };

    const getStatusBadge = (status: Invitation['status']) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED':
                return 'bg-green-100 text-green-800';
            case 'DECLINED':
                return 'bg-red-100 text-red-800';
            case 'EXPIRED':
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: Invitation['status']) => {
        switch (status) {
            case 'PENDING':
                return 'En attente';
            case 'ACCEPTED':
                return 'Acceptée';
            case 'DECLINED':
                return 'Refusée';
            case 'EXPIRED':
                return 'Expirée';
        }
    };

    const isExpiringSoon = (expiresAt: string) => {
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        const diffHours = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return diffHours < 24 && diffHours > 0;
    };

    const pendingInvitations = invitations.filter((inv) => inv.status === 'PENDING');

    if (pendingInvitations.length === 0) {
        return (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Aucune invitation en attente</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Invitations en attente ({pendingInvitations.length})
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Invitations envoyées non encore acceptées
                </p>
            </div>

            <div className="border-t border-gray-200">
                <ul role="list" className="divide-y divide-gray-200">
                    {pendingInvitations.map((invitation) => {
                        const expiringSoon = isExpiringSoon(invitation.expiresAt);

                        return (
                            <li key={invitation.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <EnvelopeIcon className="h-10 w-10 text-gray-400" />

                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                {invitation.email}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Invité par {invitation.inviter.name || invitation.inviter.email}
                                            </p>
                                            {expiringSoon && (
                                                <p className="mt-1 flex items-center text-xs text-orange-600">
                                                    <ClockIcon className="mr-1 h-4 w-4" />
                                                    Expire dans moins de 24h
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                                                invitation.status
                                            )}`}
                                        >
                                            {getRoleLabel(invitation.role)}
                                        </span>

                                        <button
                                            onClick={() => handleRevoke(invitation.id)}
                                            disabled={loadingId === invitation.id}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            title="Révoquer l'invitation"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

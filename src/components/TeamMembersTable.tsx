/**
 * Composant: TeamMembersTable
 * Affiche la liste des membres de l'équipe avec leurs rôles
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Member {
    id: string;
    user: {
        id: string;
        name: string | null;
        email: string;
        avatar: string | null;
    };
    role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
    createdAt: string;
}

interface TeamMembersTableProps {
    members: Member[];
    currentUserId: string;
    onRemoveMember: (memberId: string) => Promise<void>;
    onChangeRole: (memberId: string, newRole: Member['role']) => Promise<void>;
}

export default function TeamMembersTable({
    members,
    currentUserId,
    onRemoveMember,
    onChangeRole,
}: TeamMembersTableProps) {
    const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);

    const handleRemove = async (memberId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) return;

        setLoadingMemberId(memberId);
        try {
            await onRemoveMember(memberId);
        } finally {
            setLoadingMemberId(null);
        }
    };

    const handleRoleChange = async (memberId: string, newRole: Member['role']) => {
        setLoadingMemberId(memberId);
        try {
            await onChangeRole(memberId, newRole);
        } finally {
            setLoadingMemberId(null);
        }
    };

    const getRoleBadgeColor = (role: Member['role']) => {
        switch (role) {
            case 'OWNER':
                return 'bg-purple-100 text-purple-800';
            case 'ADMIN':
                return 'bg-blue-100 text-blue-800';
            case 'EDITOR':
                return 'bg-green-100 text-green-800';
            case 'VIEWER':
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleLabel = (role: Member['role']) => {
        switch (role) {
            case 'OWNER':
                return 'Propriétaire';
            case 'ADMIN':
                return 'Administrateur';
            case 'EDITOR':
                return 'Éditeur';
            case 'VIEWER':
                return 'Lecteur';
        }
    };

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Membres de l'équipe ({members.length})
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Gérez les accès et les rôles de votre équipe
                </p>
            </div>

            <div className="border-t border-gray-200">
                <ul role="list" className="divide-y divide-gray-200">
                    {members.map((member) => {
                        const isCurrentUser = member.user.id === currentUserId;
                        const isOwner = member.role === 'OWNER';
                        const canEdit = !isCurrentUser && !isOwner;

                        return (
                            <li key={member.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {member.user.avatar ? (
                                            <Image
                                                src={member.user.avatar}
                                                alt={member.user.name || member.user.email}
                                                width={40}
                                                height={40}
                                                className="h-10 w-10 rounded-full"
                                            />
                                        ) : (
                                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                        )}

                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                {member.user.name || member.user.email}
                                                {isCurrentUser && (
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        (vous)
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {member.user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {/* Sélecteur de rôle */}
                                        {canEdit ? (
                                            <select
                                                value={member.role}
                                                onChange={(e) =>
                                                    handleRoleChange(
                                                        member.id,
                                                        e.target.value as Member['role']
                                                    )
                                                }
                                                disabled={loadingMemberId === member.id}
                                                className="block w-32 rounded-md border-gray-300 py-1 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                            >
                                                <option value="VIEWER">Lecteur</option>
                                                <option value="EDITOR">Éditeur</option>
                                                <option value="ADMIN">Administrateur</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(
                                                    member.role
                                                )}`}
                                            >
                                                {getRoleLabel(member.role)}
                                            </span>
                                        )}

                                        {/* Bouton supprimer */}
                                        {canEdit && (
                                            <button
                                                onClick={() => handleRemove(member.id)}
                                                disabled={loadingMemberId === member.id}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                title="Retirer ce membre"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
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

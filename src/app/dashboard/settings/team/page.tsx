/**
 * Team Settings Page
 * /dashboard/settings/team
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import TeamMembersTable from '@/components/TeamMembersTable';
import InviteUserModal from '@/components/InviteUserModal';
import PendingInvitationsTable from '@/components/PendingInvitationsTable';

export default function TeamPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [members, setMembers] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchCompanies();
        }
    }, [session]);

    useEffect(() => {
        if (selectedCompanyId) {
            fetchMembers();
            fetchInvitations();
        }
    }, [selectedCompanyId]);

    const fetchCompanies = async () => {
        try {
            const res = await fetch('/api/companies');
            const data = await res.json();
            setCompanies(data.companies || []);
            if (data.companies?.length > 0) {
                setSelectedCompanyId(data.companies[0].id);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const fetchMembers = async () => {
        try {
            const res = await fetch(`/api/companies/${selectedCompanyId}/members`);
            const data = await res.json();
            setMembers(data.members || []);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvitations = async () => {
        try {
            const res = await fetch(`/api/invitations?companyId=${selectedCompanyId}`);
            const data = await res.json();
            setInvitations(data.invitations || []);
        } catch (error) {
            console.error('Error fetching invitations:', error);
        }
    };

    const handleInvite = async (email: string, role: 'VIEWER' | 'EDITOR' | 'ADMIN') => {
        const res = await fetch('/api/invitations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ companyId: selectedCompanyId, email, role }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Erreur lors de l\'invitation');
        }

        await fetchInvitations();
    };

    const handleRemoveMember = async (memberId: string) => {
        const res = await fetch(`/api/companies/${selectedCompanyId}/members/${memberId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            await fetchMembers();
        }
    };

    const handleChangeRole = async (memberId: string, newRole: string) => {
        const res = await fetch(`/api/companies/${selectedCompanyId}/members/${memberId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole }),
        });

        if (res.ok) {
            await fetchMembers();
        }
    };

    const handleRevokeInvitation = async (invitationId: string) => {
        const res = await fetch(`/api/invitations/${invitationId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            await fetchInvitations();
        }
    };

    if (!session) {
        return null;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Gestion de l'équipe
                    </h1>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <UserPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Inviter un membre
                    </button>
                </div>
            </div>

            {/* Company selector */}
            {companies.length > 1 && (
                <div className="mt-6">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                        Entreprise
                    </label>
                    <select
                        id="company"
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                        {companies.map((company: any) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Members table */}
            <div className="mt-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                    </div>
                ) : (
                    <TeamMembersTable
                        members={members}
                        currentUserId={session.user.id}
                        onRemoveMember={handleRemoveMember}
                        onChangeRole={handleChangeRole}
                    />
                )}
            </div>

            {/* Pending invitations */}
            <div className="mt-8">
                <PendingInvitationsTable
                    invitations={invitations}
                    onRevokeInvitation={handleRevokeInvitation}
                />
            </div>

            {/* Invite modal */}
            <InviteUserModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInvite}
            />
        </div>
    );
}

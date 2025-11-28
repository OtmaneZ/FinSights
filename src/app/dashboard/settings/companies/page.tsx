/**
 * Company Management Page
 * /dashboard/settings/companies
 * CRUD interface for managing user companies
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCompanies } from '@/hooks/useCompanies';
import { Building2, Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function CompaniesPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { companies, loading, fetchCompanies, createCompany, updateCompany, deleteCompany } = useCompanies();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);

    const [formName, setFormName] = useState('');
    const [formSector, setFormSector] = useState('');
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const userPlan = (session?.user as any)?.plan || 'FREE';
    const companyQuotas: Record<string, number> = {
        FREE: 1,
        PRO: 5,
        SCALE: 999,
        ENTERPRISE: 999
    };
    const maxCompanies = companyQuotas[userPlan];
    const canCreateMore = companies.length < maxCompanies;

    // Sector options
    const sectors = [
        { value: 'services', label: 'Services' },
        { value: 'commerce', label: 'Commerce' },
        { value: 'industrie', label: 'Industrie' },
        { value: 'saas', label: 'SaaS' },
        { value: 'conseil', label: 'Conseil' },
        { value: 'autre', label: 'Autre' }
    ];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSubmitting(true);

        const result = await createCompany(formName, formSector || undefined);

        if (result.success) {
            setShowCreateModal(false);
            setFormName('');
            setFormSector('');
        } else {
            setFormError(result.error || 'Erreur création');
        }

        setSubmitting(false);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompany) return;

        setFormError('');
        setSubmitting(true);

        const result = await updateCompany(selectedCompany.id, formName, formSector || undefined);

        if (result.success) {
            setShowEditModal(false);
            setFormName('');
            setFormSector('');
            setSelectedCompany(null);
        } else {
            setFormError(result.error || 'Erreur mise à jour');
        }

        setSubmitting(false);
    };

    const handleDelete = async () => {
        if (!selectedCompany) return;

        setFormError('');
        setSubmitting(true);

        const result = await deleteCompany(selectedCompany.id);

        if (result.success) {
            setShowDeleteModal(false);
            setSelectedCompany(null);
        } else {
            setFormError(result.error || 'Erreur suppression');
        }

        setSubmitting(false);
    };

    const openEditModal = (company: any) => {
        setSelectedCompany(company);
        setFormName(company.name);
        setFormSector(company.sector || '');
        setFormError('');
        setShowEditModal(true);
    };

    const openDeleteModal = (company: any) => {
        setSelectedCompany(company);
        setFormError('');
        setShowDeleteModal(true);
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
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        Gestion des Entreprises
                    </h1>
                    <p className="text-secondary">
                        Créez et gérez vos entreprises. Plan {userPlan} : {companies.length} / {maxCompanies === 999 ? '∞' : maxCompanies} entreprise(s).
                    </p>
                </div>

                {/* Create Button */}
                <div className="mb-6">
                    <button
                        onClick={() => {
                            if (canCreateMore) {
                                setFormName('');
                                setFormSector('');
                                setFormError('');
                                setShowCreateModal(true);
                            }
                        }}
                        disabled={!canCreateMore}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${canCreateMore
                                ? 'bg-accent-primary text-white hover:bg-accent-primary/90'
                                : 'bg-surface text-secondary cursor-not-allowed'
                            }`}
                    >
                        <Plus className="w-4 h-4" />
                        Nouvelle Entreprise
                    </button>
                    {!canCreateMore && (
                        <p className="text-sm text-secondary mt-2">
                            ⚠️ Quota atteint. Passez à PRO pour gérer jusqu'à 5 entreprises.
                        </p>
                    )}
                </div>

                {/* Companies List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-accent-primary" />
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                className="bg-surface border border-border rounded-lg p-6 hover:border-accent-primary/30 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-5 h-5 text-accent-primary" />
                                            <h3 className="text-lg font-semibold text-primary">
                                                {company.name}
                                            </h3>
                                        </div>
                                        {company.sector && (
                                            <p className="text-sm text-secondary mb-2">
                                                Secteur : {company.sector}
                                            </p>
                                        )}
                                        <p className="text-xs text-secondary">
                                            {company.dashboardsCount} dashboard(s) • Créée le{' '}
                                            {new Date(company.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(company)}
                                            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <Edit2 className="w-4 h-4 text-secondary" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(company)}
                                            disabled={companies.length === 1}
                                            className="p-2 hover:bg-surface-hover rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={companies.length === 1 ? 'Impossible de supprimer la dernière entreprise' : 'Supprimer'}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-primary mb-4">
                                Nouvelle Entreprise
                            </h2>
                            <form onSubmit={handleCreate}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Nom de l'entreprise *
                                    </label>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                                        placeholder="Ma Startup"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Secteur (optionnel)
                                    </label>
                                    <select
                                        value={formSector}
                                        onChange={(e) => setFormSector(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                                    >
                                        <option value="">Sélectionner...</option>
                                        {sectors.map((sector) => (
                                            <option key={sector.value} value={sector.value}>
                                                {sector.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {formError && (
                                    <div className="mb-4 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-500">{formError}</p>
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        disabled={submitting}
                                        className="flex-1 px-4 py-2 border border-border rounded-lg font-medium text-primary hover:bg-surface-hover transition-colors disabled:opacity-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || !formName.trim()}
                                        className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Créer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && selectedCompany && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-primary mb-4">
                                Modifier l'Entreprise
                            </h2>
                            <form onSubmit={handleEdit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Nom de l'entreprise *
                                    </label>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Secteur (optionnel)
                                    </label>
                                    <select
                                        value={formSector}
                                        onChange={(e) => setFormSector(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                                    >
                                        <option value="">Sélectionner...</option>
                                        {sectors.map((sector) => (
                                            <option key={sector.value} value={sector.value}>
                                                {sector.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {formError && (
                                    <div className="mb-4 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-500">{formError}</p>
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        disabled={submitting}
                                        className="flex-1 px-4 py-2 border border-border rounded-lg font-medium text-primary hover:bg-surface-hover transition-colors disabled:opacity-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || !formName.trim()}
                                        className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {showDeleteModal && selectedCompany && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-primary mb-4">
                                Supprimer l'Entreprise
                            </h2>
                            <p className="text-secondary mb-4">
                                Êtes-vous sûr de vouloir supprimer <strong>{selectedCompany.name}</strong> ?
                            </p>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                                <p className="text-sm text-red-500">
                                    ⚠️ Cette action est irréversible. Tous les dashboards associés ({selectedCompany.dashboardsCount}) seront également supprimés.
                                </p>
                            </div>
                            {formError && (
                                <div className="mb-4 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-500">{formError}</p>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 border border-border rounded-lg font-medium text-primary hover:bg-surface-hover transition-colors disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

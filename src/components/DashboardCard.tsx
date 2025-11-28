/**
 * DashboardCard Component
 * Displays a saved dashboard with KPI preview
 */

import { FileText, Trash2, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { useState } from 'react';

interface Company {
    id: string;
    name: string;
    sector: string;
}

interface DashboardCardProps {
    id: string;
    fileName: string;
    fileUrl: string;
    kpis: any;
    company: Company;
    createdAt: string;
    onOpen: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
}

export default function DashboardCard({
    id,
    fileName,
    kpis,
    company,
    createdAt,
    onOpen,
    onDelete,
}: DashboardCardProps) {
    const [deleting, setDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(id);
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('Erreur lors de la suppression');
        } finally {
            setDeleting(false);
            setShowConfirm(false);
        }
    };

    // Extract main KPIs from saved data
    const getMainKPIs = () => {
        if (!kpis || !Array.isArray(kpis)) return null;

        const revenue = kpis.find((k: any) => k.title?.includes('Chiffre') || k.title?.includes('CA'));
        const margin = kpis.find((k: any) => k.title?.includes('Marge'));
        const dso = kpis.find((k: any) => k.title?.includes('DSO'));

        return { revenue, margin, dso };
    };

    const mainKPIs = getMainKPIs();

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    // Sector icon/emoji
    const getSectorEmoji = (sector: string) => {
        const map: Record<string, string> = {
            services: '🎯',
            commerce: '🛒',
            industrie: '🏭',
            saas: '💻',
        };
        return map[sector] || '🏢';
    };

    return (
        <div className="surface rounded-xl p-6 surface-hover group transition-all hover:shadow-lg relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-accent-primary flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-primary break-all">{fileName}</h3>
                </div>
            </div>

            {/* Company Info */}
            <div className="flex items-center gap-2 mb-3 text-sm text-secondary">
                <Building2 className="w-4 h-4" />
                <span>{getSectorEmoji(company.sector)} {company.name}</span>
                <span className="text-tertiary">•</span>
                <span className="capitalize">{company.sector}</span>
            </div>

            {/* KPI Preview */}
            {mainKPIs && (
                <div className="flex flex-wrap gap-3 mb-4">
                    {mainKPIs.revenue && (
                        <div className="text-sm">
                            <span className="text-tertiary">CA:</span>{' '}
                            <span className="font-semibold text-accent-primary">{mainKPIs.revenue.value}</span>
                        </div>
                    )}
                    {mainKPIs.margin && (
                        <div className="text-sm">
                            <span className="text-tertiary">Marge:</span>{' '}
                            <span className="font-semibold text-secondary">{mainKPIs.margin.value}</span>
                        </div>
                    )}
                    {mainKPIs.dso && (
                        <div className="text-sm">
                            <span className="text-tertiary">DSO:</span>{' '}
                            <span className="font-semibold text-secondary">{mainKPIs.dso.value}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 mb-4 text-xs text-tertiary">
                <Calendar className="w-3.5 h-3.5" />
                <span>Créé le {formatDate(createdAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onOpen(id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                >
                    <ExternalLink className="w-4 h-4" />
                    Ouvrir
                </button>

                {!showConfirm ? (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-border-default hover:border-accent-danger text-accent-danger rounded-lg font-semibold text-sm transition-all hover:bg-accent-red-subtle"
                        disabled={deleting}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="px-3 py-2 bg-accent-danger hover:bg-accent-danger-hover text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                        >
                            {deleting ? 'Suppression...' : 'Confirmer'}
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            disabled={deleting}
                            className="px-3 py-2 border border-border-default rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                        >
                            Annuler
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

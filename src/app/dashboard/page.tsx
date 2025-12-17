/**
 * Dashboard Page - Authentifié uniquement
 * /dashboard
 *
 * 2 modes d'alimentation des données :
 * 1. Import Manuel : Upload CSV/Excel
 * 2. Workflow Auto : Configuration n8n/Zapier/Make
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Upload,
    Zap,
    FileSpreadsheet,
    Workflow,
    Settings,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Download,
    FileText,
    PlayCircle
} from 'lucide-react';
import Header from '@/components/Header';
import { CompanySwitcher } from '@/components/CompanySwitcher';

type TabType = 'manual' | 'auto';

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<TabType>('manual');

    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return null;
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent-primary-border border-t-accent-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-secondary">Chargement...</p>
                </div>
            </div>
        );
    }

    const userPlan = (session?.user as any)?.plan || 'FREE';

    return (
        <div className="min-h-screen bg-primary">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-primary mb-2">
                                Tableau de Bord
                            </h1>
                            <p className="text-secondary text-lg">
                                Alimentez votre dashboard financier en temps réel
                            </p>
                        </div>

                        {/* Company Switcher */}
                        <CompanySwitcher />
                    </div>

                    {/* Info Banner */}
                    <div className="surface rounded-xl p-4 border border-accent-primary-border bg-accent-primary-subtle">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-accent-primary mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-primary mb-1">
                                    Choisissez votre méthode d'import
                                </h3>
                                <p className="text-sm text-secondary">
                                    <strong>Import manuel</strong> : Rapide, idéal pour tester ou analyses ponctuelles<br />
                                    <strong>Workflow automatique</strong> : Synchronisation continue depuis Pennylane, Sellsy, etc.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex gap-2 mb-8 border-b border-border-default">
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`flex items-center gap-2 px-6 py-3 font-semibold text-base transition-all border-b-2 ${
                            activeTab === 'manual'
                                ? 'border-accent-primary text-accent-primary'
                                : 'border-transparent text-secondary hover:text-primary'
                        }`}
                    >
                        <Upload className="w-5 h-5" />
                        Import Manuel
                    </button>
                    <button
                        onClick={() => setActiveTab('auto')}
                        className={`flex items-center gap-2 px-6 py-3 font-semibold text-base transition-all border-b-2 ${
                            activeTab === 'auto'
                                ? 'border-accent-primary text-accent-primary'
                                : 'border-transparent text-secondary hover:text-primary'
                        }`}
                    >
                        <Zap className="w-5 h-5" />
                        Workflow Auto
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'manual' && <ManualImportTab userPlan={userPlan} />}
                {activeTab === 'auto' && <AutoWorkflowTab userPlan={userPlan} />}
            </div>
        </div>
    );
}

/* ============================================
   TAB 1 : IMPORT MANUEL
   ============================================ */
function ManualImportTab({ userPlan }: { userPlan: string }) {
    const [isDragging, setIsDragging] = useState(false);
    const [quota, setQuota] = useState<any>(null);
    const [loadingQuota, setLoadingQuota] = useState(true);

    // Fetch user quota on mount
    useState(() => {
        fetchQuota();
    });

    const fetchQuota = async () => {
        try {
            const res = await fetch('/api/user/quota');
            if (res.ok) {
                const data = await res.json();
                setQuota(data.quota);
            }
        } catch (error) {
            console.error('Error fetching quota:', error);
        } finally {
            setLoadingQuota(false);
        }
    };

    const handleFileUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        // Dispatch event pour FinancialDashboardV2 (si on garde ce composant)
        const event = new CustomEvent('fileUpload', {
            detail: files
        });
        window.dispatchEvent(event);
    };    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Zone */}
            <div className="surface rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <FileSpreadsheet className="w-6 h-6 text-accent-primary" />
                    <h2 className="text-2xl font-bold text-primary">Importer un fichier</h2>
                </div>

                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleFileUpload(e.dataTransfer.files);
                    }}
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                        isDragging
                            ? 'border-accent-primary bg-accent-primary-subtle'
                            : 'border-border-default hover:border-accent-primary-border hover:bg-surface-elevated'
                    }`}
                >
                    <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-primary mb-2">
                        Glissez votre fichier ici
                    </h3>
                    <p className="text-secondary mb-4">
                        ou cliquez pour sélectionner
                    </p>

                    <input
                        id="file-input"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    <label
                        htmlFor="file-input"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold cursor-pointer transition-all"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                        Sélectionner un fichier
                    </label>

                    <p className="text-xs text-tertiary mt-4">
                        Formats acceptés : CSV, Excel (.xlsx, .xls) • Max 10 MB
                    </p>
                </div>

                {/* Quota Info */}
                <div className="mt-6 p-4 surface-elevated rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary">Imports ce mois</span>
                        {loadingQuota ? (
                            <span className="text-sm text-secondary">Chargement...</span>
                        ) : quota ? (
                            <span className="text-sm font-semibold text-primary">
                                {quota.used}/{quota.limit}
                            </span>
                        ) : (
                            <span className="text-sm font-semibold text-primary">
                                {userPlan === 'FREE' ? '0/10' : '∞'}
                            </span>
                        )}
                    </div>
                    {quota && quota.limit !== '∞' && (
                        <div className="mt-2">
                            <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-accent-primary h-full transition-all"
                                    style={{ width: `${quota.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info & Templates */}
            <div className="space-y-6">
                {/* Requirements Card */}
                <div className="surface rounded-xl p-6">
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent-success" />
                        Données requises
                    </h3>
                    <ul className="space-y-3 text-secondary">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-accent-success mt-0.5" />
                            <div>
                                <strong className="text-primary">Date</strong> : Format JJ/MM/AAAA ou AAAA-MM-JJ
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-accent-success mt-0.5" />
                            <div>
                                <strong className="text-primary">Montant</strong> : Montant TTC de la transaction
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-accent-success mt-0.5" />
                            <div>
                                <strong className="text-primary">Catégorie</strong> : Vente/Achat ou Revenus/Charges
                            </div>
                        </li>
                    </ul>

                    <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-secondary">
                            <strong>💡 Astuce :</strong> Plus de colonnes = plus de KPIs ! (clients, produits, marges, échéances...)
                        </p>
                    </div>
                </div>

                {/* Templates Download */}
                <div className="surface rounded-xl p-6">
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <Download className="w-5 h-5 text-accent-primary" />
                        Templates gratuits
                    </h3>
                    <p className="text-secondary mb-4 text-sm">
                        Fichiers Excel pré-formatés pour un import sans erreur
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/ressources/templates"
                            className="flex items-center justify-between p-3 surface-elevated hover:bg-surface-hover rounded-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-accent-primary" />
                                <span className="font-semibold text-primary">Template Niveau 1</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-secondary group-hover:text-accent-primary transition-colors" />
                        </Link>

                        <Link
                            href="/ressources/templates"
                            className="flex items-center justify-between p-3 surface-elevated hover:bg-surface-hover rounded-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-accent-primary" />
                                <span className="font-semibold text-primary">Template Niveau 2</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-secondary group-hover:text-accent-primary transition-colors" />
                        </Link>

                        <Link
                            href="/ressources/templates"
                            className="flex items-center justify-between p-3 surface-elevated hover:bg-surface-hover rounded-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-accent-primary" />
                                <span className="font-semibold text-primary">Template Niveau 3</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-secondary group-hover:text-accent-primary transition-colors" />
                        </Link>
                    </div>
                </div>

                {/* Demo CTA */}
                <div className="surface rounded-xl p-6 border-2 border-accent-primary-border bg-accent-primary-subtle">
                    <h3 className="text-xl font-bold text-primary mb-2">
                        Voir des exemples ?
                    </h3>
                    <p className="text-secondary mb-4 text-sm">
                        Testez 3 scénarios réalistes (Scale-up, Startup, PME)
                    </p>
                    <Link
                        href="/demo"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"
                    >
                        <PlayCircle className="w-5 h-5" />
                        Accéder à la démo
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ============================================
   TAB 2 : WORKFLOW AUTOMATIQUE
   ============================================ */
function AutoWorkflowTab({ userPlan }: { userPlan: string }) {
    const workflows = [
        {
            name: 'n8n',
            logo: '⚡',
            title: 'n8n Cloud',
            description: 'Workflow automation open-source et flexible',
            status: 'Disponible',
            color: 'blue'
        },
        {
            name: 'zapier',
            logo: '🔄',
            title: 'Zapier',
            description: 'Plateforme no-code avec 6000+ intégrations',
            status: 'Bientôt',
            color: 'orange'
        },
        {
            name: 'make',
            logo: '🎯',
            title: 'Make (ex-Integromat)',
            description: 'Workflows visuels avancés pour automatiser',
            status: 'Bientôt',
            color: 'purple'
        }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Workflow Cards */}
            <div className="space-y-6">
                <div className="surface rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                        <Workflow className="w-6 h-6 text-accent-primary" />
                        Plateformes supportées
                    </h2>

                    <div className="space-y-4">
                        {workflows.map((workflow) => (
                            <div
                                key={workflow.name}
                                className="surface-elevated rounded-lg p-5 border-2 border-border-default hover:border-accent-primary-border transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{workflow.logo}</span>
                                        <div>
                                            <h3 className="text-lg font-bold text-primary">{workflow.title}</h3>
                                            <p className="text-sm text-secondary">{workflow.description}</p>
                                        </div>
                                    </div>
                                    {workflow.status === 'Disponible' ? (
                                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-semibold rounded-full">
                                            {workflow.status}
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-500/10 text-gray-500 text-xs font-semibold rounded-full">
                                            {workflow.status}
                                        </span>
                                    )}
                                </div>

                                {workflow.status === 'Disponible' && (
                                    <Link
                                        href="/dashboard/settings/integrations"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm transition-all"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Configurer
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Benefits & Setup */}
            <div className="space-y-6">
                {/* Benefits */}
                <div className="surface rounded-xl p-6">
                    <h3 className="text-xl font-bold text-primary mb-4">
                        Pourquoi automatiser ?
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-accent-success mt-0.5" />
                            <div>
                                <strong className="text-primary">Synchronisation temps réel</strong>
                                <p className="text-sm text-secondary">Dashboard toujours à jour sans action manuelle</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-accent-success mt-0.5" />
                            <div>
                                <strong className="text-primary">0 erreur humaine</strong>
                                <p className="text-sm text-secondary">Fini les oublis d'export ou mauvais formats</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-accent-success mt-0.5" />
                            <div>
                                <strong className="text-primary">Multi-sources</strong>
                                <p className="text-sm text-secondary">Agrégez Pennylane, Sellsy, Stripe, PayPal...</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-accent-success mt-0.5" />
                            <div>
                                <strong className="text-primary">Historique automatique</strong>
                                <p className="text-sm text-secondary">Chaque sync enregistrée, traçabilité totale</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Setup Steps */}
                <div className="surface rounded-xl p-6 border-2 border-accent-primary-border bg-accent-primary-subtle">
                    <h3 className="text-xl font-bold text-primary mb-4">
                        Configuration rapide (15 min)
                    </h3>
                    <ol className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary text-white text-sm font-bold">1</span>
                            <div className="flex-1">
                                <strong className="text-primary">Générer une API Key</strong>
                                <p className="text-sm text-secondary">Dans Paramètres → Intégrations</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary text-white text-sm font-bold">2</span>
                            <div className="flex-1">
                                <strong className="text-primary">Télécharger template n8n</strong>
                                <p className="text-sm text-secondary">Workflow pré-configuré Pennylane → FinSight</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary text-white text-sm font-bold">3</span>
                            <div className="flex-1">
                                <strong className="text-primary">Importer dans n8n</strong>
                                <p className="text-sm text-secondary">Coller l'API Key et activer le workflow</p>
                            </div>
                        </li>
                    </ol>

                    <Link
                        href="/dashboard/settings/integrations"
                        className="mt-6 inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"
                    >
                        <Zap className="w-5 h-5" />
                        Commencer la configuration
                    </Link>
                </div>

                {/* Limits by Plan */}
                {userPlan === 'FREE' && (
                    <div className="surface rounded-xl p-6 border border-orange-500/20 bg-orange-500/5">
                        <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                            Limite Plan Starter
                        </h3>
                        <p className="text-sm text-secondary mb-4">
                            Votre plan actuel limite les syncs automatiques à <strong>1 workflow actif</strong>.
                        </p>
                        <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-all"
                        >
                            Passer à Business
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
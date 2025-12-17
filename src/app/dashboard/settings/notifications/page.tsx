/**
 * Notifications Settings Page
 * /dashboard/settings/notifications
 *
 * Configuration des alertes et notifications :
 * - Alertes email sur seuils critiques
 * - Notifications de sync (intégrations)
 * - Rapports hebdomadaires/mensuels
 * - Alertes anomalies détectées
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Bell,
    Mail,
    AlertTriangle,
    TrendingDown,
    Calendar,
    Zap,
    ArrowLeft,
    Save,
    CheckCircle
} from 'lucide-react';

interface NotificationSettings {
    emailAlerts: boolean;
    cashFlowThreshold: boolean;
    cashFlowAmount: number;
    anomalyDetection: boolean;
    syncErrors: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
}

export default function NotificationsPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [settings, setSettings] = useState<NotificationSettings>({
        emailAlerts: true,
        cashFlowThreshold: true,
        cashFlowAmount: 10000,
        anomalyDetection: true,
        syncErrors: true,
        weeklyReport: false,
        monthlyReport: true
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const userPlan = (session?.user as any)?.plan || 'FREE';

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/user/notifications');
            if (res.ok) {
                const data = await res.json();
                if (data.settings) {
                    setSettings(data.settings);
                }
            }
        } catch (error) {
            // Default settings will be used if fetch fails
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Préférences enregistrées avec succès' });
            } else {
                setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key: keyof NotificationSettings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleAmountChange = (value: number) => {
        setSettings(prev => ({
            ...prev,
            cashFlowAmount: value
        }));
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
                <h1 className="text-3xl font-bold text-primary mb-2">Notifications</h1>
                <p className="text-secondary">
                    Configurez vos alertes et rapports automatiques
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

            {/* Email Alerts */}
            <div className="surface rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <Mail className="w-6 h-6 text-accent-primary" />
                    <h2 className="text-xl font-bold text-primary">Alertes Email</h2>
                </div>

                <div className="space-y-4">
                    {/* Master Toggle */}
                    <div className="flex items-center justify-between p-4 surface-elevated rounded-lg">
                        <div className="flex-1">
                            <h3 className="font-semibold text-primary mb-1">Activer les alertes email</h3>
                            <p className="text-sm text-secondary">
                                Recevoir des notifications par email pour les événements importants
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.emailAlerts}
                                onChange={() => handleToggle('emailAlerts')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                        </label>
                    </div>

                    {/* Cash Flow Threshold */}
                    <div className={`p-4 surface-elevated rounded-lg ${!settings.emailAlerts && 'opacity-50'}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                                <TrendingDown className="w-5 h-5 text-red-500 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-primary mb-1">Seuil de trésorerie critique</h3>
                                    <p className="text-sm text-secondary mb-3">
                                        Recevoir une alerte quand le cash flow tombe en dessous d'un seuil
                                    </p>
                                    {settings.cashFlowThreshold && (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={settings.cashFlowAmount}
                                                onChange={(e) => handleAmountChange(parseInt(e.target.value) || 0)}
                                                disabled={!settings.emailAlerts}
                                                className="w-32 px-3 py-1.5 surface rounded-lg text-sm"
                                                placeholder="10000"
                                            />
                                            <span className="text-sm text-secondary">€</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.cashFlowThreshold}
                                    onChange={() => handleToggle('cashFlowThreshold')}
                                    disabled={!settings.emailAlerts}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-surface peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                            </label>
                        </div>
                    </div>

                    {/* Anomaly Detection */}
                    <div className={`flex items-center justify-between p-4 surface-elevated rounded-lg ${!settings.emailAlerts && 'opacity-50'}`}>
                        <div className="flex items-start gap-3 flex-1">
                            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-primary mb-1">Détection d'anomalies</h3>
                                <p className="text-sm text-secondary">
                                    Alerte sur transactions suspectes ou patterns inhabituels
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.anomalyDetection}
                                onChange={() => handleToggle('anomalyDetection')}
                                disabled={!settings.emailAlerts}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                        </label>
                    </div>

                    {/* Sync Errors */}
                    <div className={`flex items-center justify-between p-4 surface-elevated rounded-lg ${!settings.emailAlerts && 'opacity-50'}`}>
                        <div className="flex items-start gap-3 flex-1">
                            <Zap className="w-5 h-5 text-accent-primary mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-primary mb-1">Erreurs de synchronisation</h3>
                                <p className="text-sm text-secondary">
                                    Notifier en cas d'échec d'import via n8n, Zapier ou Make
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.syncErrors}
                                onChange={() => handleToggle('syncErrors')}
                                disabled={!settings.emailAlerts}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Reports */}
            <div className="surface rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-6 h-6 text-accent-primary" />
                    <h2 className="text-xl font-bold text-primary">Rapports Automatiques</h2>
                </div>

                <div className="space-y-4">
                    {/* Weekly Report */}
                    <div className={`flex items-center justify-between p-4 surface-elevated rounded-lg ${!settings.emailAlerts && 'opacity-50'}`}>
                        <div className="flex-1">
                            <h3 className="font-semibold text-primary mb-1">Rapport hebdomadaire</h3>
                            <p className="text-sm text-secondary">
                                Résumé de vos KPIs chaque lundi matin (8h)
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.weeklyReport}
                                onChange={() => handleToggle('weeklyReport')}
                                disabled={!settings.emailAlerts}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                        </label>
                    </div>

                    {/* Monthly Report */}
                    <div className={`flex items-center justify-between p-4 surface-elevated rounded-lg ${!settings.emailAlerts && 'opacity-50'}`}>
                        <div className="flex-1">
                            <h3 className="font-semibold text-primary mb-1">Rapport mensuel</h3>
                            <p className="text-sm text-secondary">
                                Analyse complète de vos performances le 1er du mois
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.monthlyReport}
                                onChange={() => handleToggle('monthlyReport')}
                                disabled={!settings.emailAlerts}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Enregistrement...' : 'Enregistrer les préférences'}
                </button>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-secondary">
                    <strong>Note :</strong> Les notifications sont envoyées à l'adresse <strong>{session?.user?.email}</strong>.
                    Pour changer votre email, rendez-vous dans les paramètres de profil.
                </p>
            </div>
        </div>
    );
}

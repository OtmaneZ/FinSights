/**
 * AlertSettings Component
 * Modal de configuration des alertes email FinSight
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
    BellAlertIcon,
    XMarkIcon,
    EnvelopeIcon,
    EyeIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import {
    AlertSettings as AlertSettingsType,
    AlertThreshold,
    AlertType,
    DEFAULT_ALERT_SETTINGS,
    ALERT_LABELS,
    saveAlertSettings,
    loadAlertSettings,
    resetAlertSettings,
    formatThreshold,
} from '@/lib/alerts/alertConfig';
import { getEmailTemplate, getEmailSubject } from '@/lib/emails/templates';

interface AlertSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    companyName?: string;
}

export default function AlertSettings({ isOpen, onClose, companyName }: AlertSettingsProps) {
    const [settings, setSettings] = useState<AlertSettingsType>(DEFAULT_ALERT_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewAlertType, setPreviewAlertType] = useState<AlertType>('tresorerie');
    const [hasChanges, setHasChanges] = useState(false);

    // Charger les settings au montage
    useEffect(() => {
        if (isOpen) {
            const loaded = loadAlertSettings();
            if (companyName && !loaded.companyName) {
                loaded.companyName = companyName;
            }
            setSettings(loaded);
            setHasChanges(false);
        }
    }, [isOpen, companyName]);

    const handleSave = () => {
        setIsSaving(true);
        saveAlertSettings(settings);

        setTimeout(() => {
            setIsSaving(false);
            setHasChanges(false);
            onClose();
        }, 500);
    };

    const handleReset = () => {
        if (confirm('Réinitialiser toutes les alertes aux valeurs par défaut ?')) {
            const reset = resetAlertSettings();
            if (companyName) reset.companyName = companyName;
            setSettings(reset);
            setHasChanges(true);
        }
    };

    const updateAlert = (index: number, updates: Partial<AlertThreshold>) => {
        const newAlerts = [...settings.alerts];
        newAlerts[index] = { ...newAlerts[index], ...updates };
        setSettings({ ...settings, alerts: newAlerts });
        setHasChanges(true);
    };

    const toggleAlertEnabled = (index: number) => {
        updateAlert(index, { enabled: !settings.alerts[index].enabled });
    };

    const toggleEmailEnabled = (index: number) => {
        updateAlert(index, { emailEnabled: !settings.alerts[index].emailEnabled });
    };

    const handlePreview = (type: AlertType) => {
        setPreviewAlertType(type);
        setShowPreview(true);
    };

    // Générer l'aperçu HTML
    const previewHTML = React.useMemo(() => {
        const alert = settings.alerts.find(a => a.type === previewAlertType);
        if (!alert) return '';

        return getEmailTemplate({
            companyName: settings.companyName || 'Votre Entreprise',
            userName: settings.userName,
            alertType: previewAlertType,
            severity: alert.severity,
            value: alert.threshold,
            threshold: alert.threshold,
            details: `Exemple d'alerte ${ALERT_LABELS[previewAlertType].title}`,
            actionUrl: 'https://finsight.zineinsight.com/dashboard',
        });
    }, [previewAlertType, settings]);

    return (
        <>
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
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl surface dark:bg-gray-800 shadow-2xl transition-all">
                                    {/* Header */}
                                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                    <BellAlertIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                                                        Configuration des Alertes
                                                    </Dialog.Title>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Personnalisez vos alertes email
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={onClose}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <XMarkIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                                        {/* Informations utilisateur */}
                                        <div className="mb-6 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Email de notification
                                                </label>
                                                <input
                                                    type="email"
                                                    value={settings.userEmail}
                                                    onChange={(e) => {
                                                        setSettings({ ...settings, userEmail: e.target.value });
                                                        setHasChanges(true);
                                                    }}
                                                    placeholder="votre@email.com"
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg surface dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Les alertes seront envoyées à cette adresse
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Votre nom
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={settings.userName || ''}
                                                        onChange={(e) => {
                                                            setSettings({ ...settings, userName: e.target.value });
                                                            setHasChanges(true);
                                                        }}
                                                        placeholder="Prénom Nom"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg surface dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Entreprise
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={settings.companyName || ''}
                                                        onChange={(e) => {
                                                            setSettings({ ...settings, companyName: e.target.value });
                                                            setHasChanges(true);
                                                        }}
                                                        placeholder="Nom de l'entreprise"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg surface dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Liste des alertes */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Types d'alertes
                                            </h3>

                                            {settings.alerts.map((alert, index) => {
                                                const label = ALERT_LABELS[alert.type];
                                                return (
                                                    <div
                                                        key={alert.type}
                                                        className={`border rounded-xl p-4 transition-all ${alert.enabled
                                                                ? 'border-gray-200 dark:border-gray-700 surface dark:bg-gray-700/50'
                                                                : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-start gap-3">
                                                                <span className="text-2xl">{label.icon}</span>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                        {label.title}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {label.description}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handlePreview(alert.type)}
                                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                                                    title="Aperçu de l'email"
                                                                >
                                                                    <EyeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                                </button>

                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={alert.enabled}
                                                                        onChange={() => toggleAlertEnabled(index)}
                                                                        className="sr-only peer"
                                                                    />
                                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {alert.enabled && alert.type !== 'anomalie' && (
                                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                        Seuil d'alerte
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={alert.threshold}
                                                                        onChange={(e) =>
                                                                            updateAlert(index, { threshold: parseFloat(e.target.value) || 0 })
                                                                        }
                                                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg surface dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    />
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                        {formatThreshold(alert.type, alert.threshold)}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                        Email activé
                                                                    </label>
                                                                    <button
                                                                        onClick={() => toggleEmailEnabled(index)}
                                                                        className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${alert.emailEnabled
                                                                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                                                            }`}
                                                                    >
                                                                        <EnvelopeIcon className="w-4 h-4" />
                                                                        {alert.emailEnabled ? 'Activé' : 'Désactivé'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {alert.enabled && alert.type === 'anomalie' && (
                                                            <div className="mt-4">
                                                                <label className="flex items-center gap-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={alert.emailEnabled}
                                                                        onChange={() => toggleEmailEnabled(index)}
                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                    />
                                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                        Recevoir un email pour chaque anomalie détectée
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={handleReset}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <ArrowPathIcon className="w-4 h-4" />
                                                Réinitialiser
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={onClose}
                                                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    disabled={isSaving || !hasChanges}
                                                    className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-all ${isSaving || !hasChanges
                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                            : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50'
                                                        }`}
                                                >
                                                    {isSaving ? 'Enregistrement...' : hasChanges ? 'Enregistrer' : 'Sauvegardé'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Preview Modal */}
            <Transition appear show={showPreview} as={Fragment}>
                <Dialog as="div" className="relative z-[60]" onClose={() => setShowPreview(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl surface shadow-2xl transition-all">
                                    <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                Aperçu: {ALERT_LABELS[previewAlertType].title}
                                            </Dialog.Title>
                                            <button
                                                onClick={() => setShowPreview(false)}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                <XMarkIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 max-h-[80vh] overflow-y-auto bg-gray-100">
                                        <div
                                            className="surface rounded-lg shadow-lg"
                                            dangerouslySetInnerHTML={{ __html: previewHTML }}
                                        />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

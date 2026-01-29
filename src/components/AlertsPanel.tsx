import React from 'react';
import {
    ExclamationTriangleIcon,
    XCircleIcon,
    CheckCircleIcon,
    LightBulbIcon,
} from '@heroicons/react/24/outline';

interface Alert {
    id: string;
    type: 'critical' | 'warning' | 'success' | 'info';
    title: string;
    message: string;
    actions: string[];
    metric?: {
        current: number;
        threshold: number;
        unit: string;
    };
}

// Interface pour les alertes venant du demo config JSON
export interface DemoAlert {
    type: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    value: number;
    threshold: number;
    actions: string[];
}

interface AlertsPanelProps {
    dso?: number;
    cashFlow?: number;
    netMargin?: number;
    grossMargin?: number;
    bfr?: number;
    // Nouvelles props pour alertes externes (mode demo)
    externalAlerts?: DemoAlert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
    dso,
    cashFlow,
    netMargin,
    grossMargin,
    bfr,
    externalAlerts,
}) => {
    // Convertit les alertes demo config en format Alert interne
    const convertExternalAlerts = (external: DemoAlert[]): Alert[] => {
        return external.map((alert, index) => ({
            id: `external-${index}`,
            type: alert.type === 'info' ? 'success' : alert.type, // 'info' devient 'success' pour le styling
            title: alert.title,
            message: alert.description,
            actions: alert.actions,
            metric: {
                current: alert.value,
                threshold: alert.threshold,
                unit: alert.value > 100 ? '€' : (alert.value <= 1 ? 'mois' : '%'),
            },
        }));
    };

    const generateAlerts = (): Alert[] => {
        const alerts: Alert[] = [];

        // Alerte 1: DSO > 60 jours (Délai de paiement trop long)
        if (dso !== undefined && dso > 60) {
            alerts.push({
                id: 'dso-high',
                type: dso > 90 ? 'critical' : 'warning',
                title: '⚠️ Signal: Risque de tension de trésorerie',
                message: `Délai moyen paiement clients: ${Math.round(dso)} jours. Seuil de vigilance dépassé (objectif < 45j). Impact potentiel sur votre runway.`,
                metric: {
                    current: dso,
                    threshold: 60,
                    unit: 'jours',
                },
                actions: [
                    'Relancer systématiquement les factures > 30 jours',
                    'Mettre en place des pénalités de retard',
                    'Proposer un escompte pour paiement anticipé (2% à 10j)',
                    'Analyser les 3 plus gros retardataires et les contacter',
                ],
            });
        }

        // Alerte 2: Cash Flow négatif (Situation critique)
        if (cashFlow !== undefined && cashFlow < 0) {
            alerts.push({
                id: 'cashflow-negative',
                type: 'critical',
                title: '🚨 Signal Critique: Risque de rupture cash immédiat',
                message: `Trésorerie négative détectée: ${cashFlow.toFixed(0)}€. Runway en zone rouge. Action immédiate requise.`,
                metric: {
                    current: cashFlow,
                    threshold: 0,
                    unit: '€',
                },
                actions: [
                    'ACTION URGENTE: Établir un plan de trésorerie à 90 jours',
                    'Négocier avec vos fournisseurs (délais de paiement)',
                    'Accélérer le recouvrement clients (affacturage si nécessaire)',
                    'Reporter les investissements non critiques',
                    'Contacter votre banquier pour une ligne de crédit',
                ],
            });
        } else if (cashFlow !== undefined && cashFlow > 0 && cashFlow < 10000) {
            alerts.push({
                id: 'cashflow-low',
                type: 'warning',
                title: '⚡ Signal: Résilience trésorerie faible',
                message: `Cash flow actuel: ${cashFlow.toFixed(0)}€. Seuil de sécurité non atteint (<10k€). Vulnérabilité aux chocs.`,
                metric: {
                    current: cashFlow,
                    threshold: 10000,
                    unit: '€',
                },
                actions: [
                    'Surveiller quotidiennement votre trésorerie',
                    'Constituer une réserve de sécurité (1-2 mois de charges)',
                    'Optimiser vos délais de paiement fournisseurs',
                ],
            });
        }

        // Alerte 3: Marge nette < 10% (Rentabilité faible)
        if (netMargin !== undefined && netMargin < 10) {
            const severity = netMargin < 5 ? 'critical' : 'warning';
            alerts.push({
                id: 'margin-low',
                type: severity,
                title: severity === 'critical' ? '🔴 Signal Critique: Structure de marge dégradée' : '⚠️ Signal: Erosion de marge',
                message: `Marge nette: ${netMargin.toFixed(1)}%. ${severity === 'critical' ? 'Seuil critique (<5%)' : 'Sous objectif santé (10%)'} - Pression sur rentabilité.`,
                metric: {
                    current: netMargin,
                    threshold: 10,
                    unit: '%',
                },
                actions: [
                    'Analyser vos 10 plus grosses charges et identifier les réductions possibles',
                    'Revoir votre grille tarifaire (+5% à +15%)',
                    'Renégocier vos contrats fournisseurs',
                    'Automatiser les tâches à faible valeur ajoutée',
                    'Stopper les offres/produits non rentables',
                ],
            });
        }

        // Alerte 4: BFR > 30 jours de CA (Besoin en fonds de roulement élevé)
        if (bfr !== undefined && bfr > 30) {
            alerts.push({
                id: 'bfr-high',
                type: 'warning',
                title: '⏱️ Signal: Cycle de conversion cash ralenti',
                message: `BFR élevé: ${Math.round(bfr)} jours de CA immobilisés. Frein à la liquidité opérationnelle.`,
                metric: {
                    current: bfr,
                    threshold: 30,
                    unit: 'jours',
                },
                actions: [
                    'Réduire vos stocks si applicable (-20% à -30%)',
                    'Accélérer les encaissements clients (voir alerte DSO)',
                    'Négocier des délais fournisseurs plus longs',
                    'Facturer des acomptes (30% à 50% à la commande)',
                ],
            });
        }

        // Alerte positive: Tout va bien !
        if (alerts.length === 0) {
            alerts.push({
                id: 'all-good',
                type: 'success',
                title: '✅ Aucun signal faible détecté - Santé financière robuste',
                message: 'Tous vos indicateurs sont en zone verte. Résilience confirmée. Position favorable pour croissance.',
                actions: [
                    'Maintenir votre discipline financière',
                    'Constituer une réserve de trésorerie (3-6 mois)',
                    'Anticiper les investissements de croissance',
                ],
            });
        }

        return alerts;
    };

    // Utilise les alertes externes (demo config) si disponibles, sinon génère automatiquement
    const alerts = externalAlerts && externalAlerts.length > 0 
        ? convertExternalAlerts(externalAlerts) 
        : generateAlerts();

    const getAlertIcon = (type: Alert['type']) => {
        switch (type) {
            case 'critical':
                return <XCircleIcon className="w-6 h-6 text-red-600" />;
            case 'warning':
                return <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />;
            case 'success':
            case 'info':
                return <CheckCircleIcon className="w-6 h-6 text-emerald-600" />;
        }
    };

    const getAlertBorderColor = (type: Alert['type']) => {
        switch (type) {
            case 'critical':
                return 'border-l-red-600 bg-red-50';
            case 'warning':
                return 'border-l-orange-500 bg-orange-50';
            case 'success':
            case 'info':
                return 'border-l-emerald-600 bg-emerald-50';
        }
    };

    const getAlertTextColor = (type: Alert['type']) => {
        switch (type) {
            case 'critical':
                return 'text-red-900';
            case 'warning':
                return 'text-orange-900';
            case 'success':
            case 'info':
                return 'text-emerald-900';
        }
    };

    return (
        <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 mb-4">
                <LightBulbIcon className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    🔍 Signaux Faibles & Recommandations
                </h2>
                <span className="text-xs text-slate-500 dark:text-gray-400 ml-2">
                    Détection automatique des risques financiers
                </span>
            </div>

            <div className="grid gap-4">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`border-l-4 ${getAlertBorderColor(alert.type)} rounded-lg p-5 shadow-sm`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>

                            <div className="flex-1">
                                <h3 className={`font-bold text-lg mb-2 ${getAlertTextColor(alert.type)}`}>
                                    {alert.title}
                                </h3>

                                <p className="text-slate-700 mb-3">{alert.message}</p>

                                {alert.metric && (
                                    <div className="mb-4 p-3 surface rounded-lg border border-slate-200">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-slate-800">
                                                {alert.metric.current.toFixed(alert.metric.unit === '€' ? 0 : 1)}
                                            </span>
                                            <span className="text-sm text-slate-500">{alert.metric.unit}</span>
                                            <span className="text-sm text-slate-400 ml-2">
                                                vs seuil: {alert.metric.threshold}
                                                {alert.metric.unit}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Actions recommandées:
                                    </p>
                                    <ul className="space-y-1.5 ml-4">
                                        {alert.actions.map((action, idx) => (
                                            <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                                <span className="text-blue-500 font-bold mt-0.5">•</span>
                                                <span>{action}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

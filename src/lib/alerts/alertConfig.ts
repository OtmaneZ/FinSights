/**
 * Configuration et types pour le système d'alertes FinSight
 */

export type AlertType = 'tresorerie' | 'dso' | 'marge' | 'anomalie' | 'echeance';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertThreshold {
    type: AlertType;
    enabled: boolean;
    threshold: number;
    comparison: 'below' | 'above' | 'equal';
    severity: AlertSeverity;
    emailEnabled: boolean;
}

export interface AlertSettings {
    userEmail: string;
    userName?: string;
    companyName?: string;
    alerts: AlertThreshold[];
    lastUpdated: string;
}

/**
 * Configuration par défaut des alertes
 */
export const DEFAULT_ALERT_SETTINGS: AlertSettings = {
    userEmail: '',
    userName: '',
    companyName: '',
    lastUpdated: new Date().toISOString(),
    alerts: [
        {
            type: 'tresorerie',
            enabled: true,
            threshold: 10000,
            comparison: 'below',
            severity: 'critical',
            emailEnabled: true,
        },
        {
            type: 'dso',
            enabled: true,
            threshold: 45,
            comparison: 'above',
            severity: 'warning',
            emailEnabled: true,
        },
        {
            type: 'marge',
            enabled: true,
            threshold: 20,
            comparison: 'below',
            severity: 'warning',
            emailEnabled: true,
        },
        {
            type: 'anomalie',
            enabled: true,
            threshold: 0, // Score d'anomalie (pas de seuil numérique)
            comparison: 'above',
            severity: 'warning',
            emailEnabled: true,
        },
        {
            type: 'echeance',
            enabled: true,
            threshold: 3, // Jours avant échéance
            comparison: 'below',
            severity: 'info',
            emailEnabled: true,
        },
    ],
};

/**
 * Labels pour l'UI
 */
export const ALERT_LABELS: Record<AlertType, { title: string; icon: string; description: string }> = {
    tresorerie: {
        title: 'Trésorerie Critique',
        icon: '💰',
        description: 'Alertes lorsque la trésorerie passe sous un seuil critique',
    },
    dso: {
        title: 'DSO Élevé',
        icon: '⏱️',
        description: 'Délai moyen de paiement trop long',
    },
    marge: {
        title: 'Marge Faible',
        icon: '📉',
        description: 'Marge opérationnelle en baisse',
    },
    anomalie: {
        title: 'Anomalies Détectées',
        icon: '🔍',
        description: 'Transactions inhabituelles détectées par ML',
    },
    echeance: {
        title: 'Échéances Proches',
        icon: '📅',
        description: 'Factures arrivant à échéance prochainement',
    },
};

/**
 * Sauvegarde les settings dans localStorage
 */
export function saveAlertSettings(settings: AlertSettings): void {
    if (typeof window === 'undefined') return;
    try {
        settings.lastUpdated = new Date().toISOString();
        localStorage.setItem('finsight_alert_settings', JSON.stringify(settings));
        logger.debug('✅ Alert settings saved:', settings);
    } catch (error) {
        logger.error('❌ Error saving alert settings:', error);
    }
}

/**
 * Charge les settings depuis localStorage
 */
export function loadAlertSettings(): AlertSettings {
    if (typeof window === 'undefined') return DEFAULT_ALERT_SETTINGS;

    try {
        const saved = localStorage.getItem('finsight_alert_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            logger.debug('✅ Alert settings loaded:', settings);
            return settings;
        }
    } catch (error) {
        logger.error('❌ Error loading alert settings:', error);
    }

    return DEFAULT_ALERT_SETTINGS;
}

/**
 * Réinitialise les settings aux valeurs par défaut
 */
export function resetAlertSettings(): AlertSettings {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('finsight_alert_settings');
    }
    return DEFAULT_ALERT_SETTINGS;
}

/**
 * Formate le seuil pour l'affichage
 */
export function formatThreshold(type: AlertType, value: number): string {
    switch (type) {
        case 'tresorerie':
            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
        case 'dso':
            return `${value} jours`;
        case 'marge':
            return `${value}%`;
        case 'echeance':
            return `J-${value}`;
        case 'anomalie':
            return 'Activé';
        default:
            return String(value);
    }
}

/**
 * KPI DEFINITIONS & METADATA
 * 
 * Définitions professionnelles pour tooltips McKinsey-style
 * Icônes métier spécifiques par KPI
 */

import {
    DollarSign,
    TrendingUp,
    Wallet,
    Clock,
    Percent,
    FileText,
    Target,
    Activity
} from 'lucide-react'

export interface KPIMetadata {
    icon: any; // Lucide icon component
    color: string; // Tailwind color class
    definition: string; // Définition courte pour tooltip
    formula?: string; // Formule de calcul (optionnel)
}

export const KPI_METADATA: Record<string, KPIMetadata> = {
    // Revenus
    'Revenus & Croissance': {
        icon: DollarSign,
        color: 'text-emerald-600',
        definition: 'Chiffre d\'affaires total généré sur la période. Indicateur de performance commerciale.',
        formula: 'Σ Montants type "Revenu"'
    },
    'Chiffre d\'Affaires': {
        icon: DollarSign,
        color: 'text-emerald-600',
        definition: 'Total des ventes de biens et services. Mesure la taille de l\'activité.',
        formula: 'CA HT'
    },

    // Charges
    'Charges & Contrôle': {
        icon: FileText,
        color: 'text-orange-600',
        definition: 'Total des dépenses opérationnelles. À optimiser pour améliorer la rentabilité.',
        formula: 'Σ Montants type "Charge"'
    },
    'Total Charges': {
        icon: FileText,
        color: 'text-orange-600',
        definition: 'Ensemble des coûts supportés (fixes + variables).',
    },

    // Marges
    'Marge Brute & Rentabilité': {
        icon: Percent,
        color: 'text-blue-600',
        definition: 'Pourcentage du CA restant après déduction des coûts directs. Indicateur clé de rentabilité.',
        formula: '(CA - Coûts directs) / CA × 100'
    },
    'Marge Nette & Profitabilité': {
        icon: Percent,
        color: 'text-purple-600',
        definition: 'Profit net après toutes charges. Mesure la profitabilité finale de l\'entreprise.',
        formula: '(CA - Total Charges) / CA × 100'
    },
    'Marge Brute': {
        icon: Percent,
        color: 'text-blue-600',
        definition: 'Marge après coûts de production/achats.',
    },
    'Marge Nette': {
        icon: Percent,
        color: 'text-purple-600',
        definition: 'Résultat net / CA. Performance finale.',
    },

    // Trésorerie
    'Cash & Liquidité': {
        icon: Wallet,
        color: 'text-teal-600',
        definition: 'Trésorerie disponible. Vital pour la survie et les opportunités de croissance.',
        formula: 'Encaissements - Décaissements'
    },
    'Cash Flow': {
        icon: Wallet,
        color: 'text-teal-600',
        definition: 'Flux de trésorerie net généré.',
    },
    'Trésorerie': {
        icon: Wallet,
        color: 'text-teal-600',
        definition: 'Liquidités immédiatement disponibles.',
    },

    // DSO
    'DSO & Cycles Paiement': {
        icon: Clock,
        color: 'text-amber-600',
        definition: 'Days Sales Outstanding : délai moyen de paiement clients. Plus bas = meilleur cash.',
        formula: '(Créances / CA) × 365 jours'
    },
    'DSO': {
        icon: Clock,
        color: 'text-amber-600',
        definition: 'Délai moyen d\'encaissement clients.',
    },

    // BFR
    'BFR & Résilience': {
        icon: Activity,
        color: 'text-indigo-600',
        definition: 'Besoin en Fonds de Roulement : montant immobilisé dans le cycle d\'exploitation.',
        formula: 'Stocks + Créances - Dettes fournisseurs'
    },
    'BFR': {
        icon: Activity,
        color: 'text-indigo-600',
        definition: 'Besoin de financement court terme.',
    },

    // Croissance
    'Croissance': {
        icon: TrendingUp,
        color: 'text-green-600',
        definition: 'Évolution du CA sur la période.',
    },
    'Performance': {
        icon: Target,
        color: 'text-slate-600',
        definition: 'Indicateur de performance globale.',
    }
};

/**
 * Récupère les métadonnées d'un KPI par son titre
 */
export function getKPIMetadata(title: string): KPIMetadata {
    // Recherche exacte
    if (KPI_METADATA[title]) {
        return KPI_METADATA[title];
    }

    // Recherche partielle (fallback)
    for (const [key, metadata] of Object.entries(KPI_METADATA)) {
        if (title.includes(key) || key.includes(title)) {
            return metadata;
        }
    }

    // Défaut générique
    return {
        icon: Activity,
        color: 'text-slate-600',
        definition: 'Indicateur de performance financière.',
    };
}

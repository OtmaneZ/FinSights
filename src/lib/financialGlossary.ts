/**
 * LEXIQUE FINANCIER - Définitions et formules pour DAF/CFO
 *
 * Chaque KPI inclut :
 * - Définition claire en français
 * - Formule de calcul exacte
 * - Benchmarks sectoriels
 * - Seuils d'alerte
 * - Interprétation pour la prise de décision
 *
 * Sources : PCG 2025, DFCG, Normes IFRS
 */

export interface FinancialGlossaryEntry {
    id: string;
    title: string;
    shortName: string;
    category: 'tresorerie' | 'rentabilite' | 'activite' | 'structure';
    definition: string;
    formula: string;
    formulaExplanation: string;
    interpretation: {
        excellent: string;
        good: string;
        warning: string;
        critical: string;
    };
    benchmarks: {
        sector: string;
        min: number | string;
        median: number | string;
        max: number | string;
        unit: string;
    }[];
    example: string;
    relatedKPIs: string[];
    actionableInsights: string[];
}

export const FINANCIAL_GLOSSARY: Record<string, FinancialGlossaryEntry> = {
    // ========================================
    // TRÉSORERIE
    // ========================================
    DSO: {
        id: 'DSO',
        title: 'DSO - Days Sales Outstanding',
        shortName: 'Délai de paiement clients',
        category: 'tresorerie',
        definition: 'Nombre de jours moyen entre l\'émission d\'une facture et son encaissement effectif. Indicateur clé de la gestion du poste clients.',
        formula: 'DSO = (Créances clients / Chiffre d\'affaires) × 365',
        formulaExplanation: 'Créances clients = Factures émises non encore payées | CA = Chiffre d\'affaires annuel',
        interpretation: {
            excellent: '< 30 jours → Paiements très rapides, trésorerie optimale',
            good: '30-45 jours → Standard secteur services, situation saine',
            warning: '45-60 jours → À surveiller, négocier conditions de paiement',
            critical: '> 60 jours → Risque majeur de trésorerie, relances urgentes'
        },
        benchmarks: [
            { sector: 'Services / Conseil', min: 30, median: 45, max: 60, unit: 'jours' },
            { sector: 'Commerce', min: 15, median: 30, max: 45, unit: 'jours' },
            { sector: 'Industrie', min: 45, median: 60, max: 75, unit: 'jours' },
            { sector: 'SaaS / Software', min: 0, median: 15, max: 30, unit: 'jours' }
        ],
        example: 'Créances 50k€, CA 600k€ → DSO = (50k / 600k) × 365 = 30 jours',
        relatedKPIs: ['BFR', 'CASH_FLOW', 'ROTATION_CLIENTS'],
        actionableInsights: [
            'Automatiser les relances à J+15, J+30, J+45',
            'Négocier escompte 2% pour paiement anticipé',
            'Pénalités de retard contractuelles (3× taux BCE)',
            'Affacturage si DSO > 60 jours chronique'
        ]
    },

    BFR: {
        id: 'BFR',
        title: 'BFR - Besoin en Fonds de Roulement',
        shortName: 'Besoin en Fonds de Roulement',
        category: 'tresorerie',
        definition: 'Montant de trésorerie nécessaire pour financer le décalage entre les encaissements clients et les décaissements fournisseurs. Un BFR élevé consomme de la trésorerie.',
        formula: 'BFR = Stocks + Créances clients - Dettes fournisseurs',
        formulaExplanation: 'Stocks = Valeur des stocks immobilisés | Créances = Factures clients impayées | Dettes = Factures fournisseurs à payer',
        interpretation: {
            excellent: 'BFR négatif → Trésorerie structurellement positive (modèle distributeur)',
            good: '< 15% du CA → Situation financière saine',
            warning: '15-30% du CA → Surveiller, optimiser cycle d\'exploitation',
            critical: '> 30% du CA → Tension forte, risque de cessation de paiement'
        },
        benchmarks: [
            { sector: 'Services', min: '5%', median: '10%', max: '15%', unit: '% du CA' },
            { sector: 'Commerce', min: '10%', median: '20%', max: '30%', unit: '% du CA' },
            { sector: 'Industrie', min: '20%', median: '30%', max: '40%', unit: '% du CA' },
            { sector: 'Distribution', min: '-10%', median: '-5%', max: '5%', unit: '% du CA' }
        ],
        example: 'Stocks 80k€, Créances 120k€, Dettes 90k€ → BFR = 80k + 120k - 90k = 110k€',
        relatedKPIs: ['DSO', 'DPO', 'ROTATION_STOCKS'],
        actionableInsights: [
            'Réduire stocks dormants (inventaire trimestriel)',
            'Accélérer encaissements (DSO -10j = -X% BFR)',
            'Négocier délais fournisseurs (+15j = économie trésorerie)',
            'Ligne de crédit court terme si BFR > 25% CA'
        ]
    },

    CASH_FLOW: {
        id: 'CASH_FLOW',
        title: 'Cash Flow Net',
        shortName: 'Flux de trésorerie',
        category: 'tresorerie',
        definition: 'Différence entre les encaissements et décaissements sur une période. Indicateur de la capacité de l\'entreprise à générer de la trésorerie.',
        formula: 'Cash Flow = Encaissements - Décaissements',
        formulaExplanation: 'Encaissements = Paiements clients reçus | Décaissements = Paiements fournisseurs + Charges',
        interpretation: {
            excellent: '> 20% du CA → Forte génération de cash, capacité d\'investissement',
            good: '10-20% du CA → Cash flow positif, situation saine',
            warning: '0-10% du CA → Marge de manœuvre limitée',
            critical: '< 0 → Brûle du cash, risque de rupture de trésorerie'
        },
        benchmarks: [
            { sector: 'SaaS mature', min: '20%', median: '30%', max: '40%', unit: '% du CA' },
            { sector: 'Services', min: '10%', median: '15%', max: '25%', unit: '% du CA' },
            { sector: 'Commerce', min: '5%', median: '8%', max: '12%', unit: '% du CA' },
            { sector: 'Startup croissance', min: '-30%', median: '-20%', max: '0%', unit: '% du CA' }
        ],
        example: 'Encaissements 500k€, Décaissements 450k€ → Cash Flow = +50k€',
        relatedKPIs: ['BFR', 'EBITDA', 'RUNWAY'],
        actionableInsights: [
            'Projection rolling 12 mois pour anticiper tensions',
            'Seuil d\'alerte < 2 mois de charges fixes',
            'Optimiser timing paiements (fournisseurs en fin de mois)',
            'Convertir excédent cash en placements court terme'
        ]
    },

    // ========================================
    // RENTABILITÉ
    // ========================================
    MARGE_BRUTE: {
        id: 'MARGE_BRUTE',
        title: 'Marge Brute',
        shortName: 'Marge commerciale',
        category: 'rentabilite',
        definition: 'Rentabilité sur les ventes après déduction du coût d\'achat des marchandises. Mesure l\'efficacité de la politique de prix et d\'achat.',
        formula: 'Marge Brute (%) = ((CA - Coût d\'achat) / CA) × 100',
        formulaExplanation: 'CA = Chiffre d\'affaires | Coût d\'achat = Prix d\'achat marchandises + frais approvisionnement',
        interpretation: {
            excellent: '> 70% → Très forte valeur ajoutée (conseil, SaaS)',
            good: '40-70% → Bonne rentabilité commerciale',
            warning: '20-40% → Marge faible, surveiller prix/coûts',
            critical: '< 20% → Rentabilité insuffisante, revoir modèle économique'
        },
        benchmarks: [
            { sector: 'SaaS / Software', min: 70, median: 80, max: 90, unit: '%' },
            { sector: 'Services / Conseil', min: 60, median: 70, max: 80, unit: '%' },
            { sector: 'Industrie', min: 30, median: 40, max: 50, unit: '%' },
            { sector: 'Commerce / Distribution', min: 20, median: 30, max: 40, unit: '%' }
        ],
        example: 'CA 1M€, Coût achat 400k€ → Marge Brute = (600k / 1M) × 100 = 60%',
        relatedKPIs: ['MARGE_NETTE', 'EBITDA', 'PRIX_MOYEN'],
        actionableInsights: [
            'Augmenter prix si marge < benchmark secteur',
            'Renégocier conditions achats (volumes, délais)',
            'Analyser mix produit (favoriser produits forte marge)',
            'Éliminer références à marge < 30%'
        ]
    },

    MARGE_NETTE: {
        id: 'MARGE_NETTE',
        title: 'Marge Nette',
        shortName: 'Rentabilité nette',
        category: 'rentabilite',
        definition: 'Rentabilité finale après déduction de TOUTES les charges (achats, salaires, loyer, etc.). Indicateur clé de performance globale.',
        formula: 'Marge Nette (%) = ((CA - Total charges) / CA) × 100',
        formulaExplanation: 'Total charges = Achats + Charges fixes + Charges variables + Impôts',
        interpretation: {
            excellent: '> 20% → Entreprise très profitable',
            good: '10-20% → Rentabilité solide',
            warning: '5-10% → Rentabilité fragile, optimiser coûts',
            critical: '< 5% → Rentabilité insuffisante, restructuration urgente'
        },
        benchmarks: [
            { sector: 'SaaS mature', min: 20, median: 30, max: 40, unit: '%' },
            { sector: 'Services', min: 10, median: 15, max: 25, unit: '%' },
            { sector: 'Industrie', min: 5, median: 10, max: 15, unit: '%' },
            { sector: 'Commerce', min: 3, median: 5, max: 10, unit: '%' }
        ],
        example: 'CA 1M€, Charges 850k€ → Marge Nette = (150k / 1M) × 100 = 15%',
        relatedKPIs: ['MARGE_BRUTE', 'EBITDA', 'ROI'],
        actionableInsights: [
            'Benchmark charges par poste vs concurrents',
            'Plan d\'optimisation coûts (objectif +2pt marge)',
            'Automatisation processus chronophages',
            'Externalisation activités non-stratégiques'
        ]
    },

    EBITDA: {
        id: 'EBITDA',
        title: 'EBITDA',
        shortName: 'Résultat opérationnel',
        category: 'rentabilite',
        definition: 'Earnings Before Interest, Taxes, Depreciation and Amortization. Mesure la performance opérationnelle pure (avant financier et comptable).',
        formula: 'EBITDA = Résultat net + Intérêts + Impôts + Dotations amortissements',
        formulaExplanation: 'Résultat net = Bénéfice ou perte | Intérêts = Charges financières | Impôts = IS + taxes | Dotations = Amortissements actifs',
        interpretation: {
            excellent: '> 25% du CA → Très forte rentabilité opérationnelle',
            good: '15-25% du CA → Bonne performance',
            warning: '5-15% du CA → Performance moyenne',
            critical: '< 5% du CA → Rentabilité opérationnelle faible'
        },
        benchmarks: [
            { sector: 'SaaS', min: '20%', median: '30%', max: '40%', unit: '% du CA' },
            { sector: 'Services', min: '15%', median: '20%', max: '30%', unit: '% du CA' },
            { sector: 'Industrie', min: '10%', median: '15%', max: '20%', unit: '% du CA' },
            { sector: 'Commerce', min: '5%', median: '8%', max: '12%', unit: '% du CA' }
        ],
        example: 'Résultat net 100k€, Intérêts 10k€, Impôts 30k€, Amort. 20k€ → EBITDA = 160k€',
        relatedKPIs: ['MARGE_NETTE', 'CASH_FLOW', 'ROI'],
        actionableInsights: [
            'Indicateur clé pour valorisation entreprise (multiple d\'EBITDA)',
            'Objectif : maintenir > 15% pour attirer investisseurs',
            'Focus sur rentabilité opérationnelle avant financements'
        ]
    },

    // ========================================
    // ACTIVITÉ
    // ========================================
    CA: {
        id: 'CA',
        title: 'Chiffre d\'Affaires',
        shortName: 'CA / Revenus',
        category: 'activite',
        definition: 'Total des ventes de biens ou services sur une période. Indicateur principal de la taille et de la croissance de l\'activité.',
        formula: 'CA = Σ (Prix de vente × Quantité vendue)',
        formulaExplanation: 'Somme de toutes les factures émises (HT ou TTC selon contexte)',
        interpretation: {
            excellent: 'Croissance > 30% annuel → Hyper-croissance',
            good: 'Croissance 10-30% annuel → Croissance saine',
            warning: 'Croissance 0-10% annuel → Stagnation',
            critical: 'Croissance < 0% → Décroissance, pivoter'
        },
        benchmarks: [
            { sector: 'Startup tech', min: '50%', median: '100%', max: '200%', unit: 'croissance annuelle' },
            { sector: 'PME services', min: '10%', median: '20%', max: '40%', unit: 'croissance annuelle' },
            { sector: 'Industrie', min: '5%', median: '10%', max: '20%', unit: 'croissance annuelle' },
            { sector: 'Commerce', min: '3%', median: '8%', max: '15%', unit: 'croissance annuelle' }
        ],
        example: '100 ventes × 5000€ → CA = 500k€',
        relatedKPIs: ['MARGE_BRUTE', 'PANIER_MOYEN', 'TAUX_CONVERSION'],
        actionableInsights: [
            'Décomposer croissance : Volume vs Prix vs Mix',
            'Tracker par segment / produit / région',
            'Objectif Rule of 40 (croissance + marge) pour SaaS'
        ]
    },

    ROTATION_STOCKS: {
        id: 'ROTATION_STOCKS',
        title: 'Rotation des Stocks',
        shortName: 'Vitesse écoulement stocks',
        category: 'activite',
        definition: 'Nombre de fois où le stock est renouvelé sur une année. Indicateur d\'efficacité de la gestion des stocks.',
        formula: 'Rotation = Coût d\'achat annuel / Stock moyen',
        formulaExplanation: 'Coût achat annuel = Total achats sur 12 mois | Stock moyen = (Stock début + Stock fin) / 2',
        interpretation: {
            excellent: '> 12 → Stock renouvelé chaque mois (excellent)',
            good: '6-12 → Rotation correcte',
            warning: '3-6 → Stock dormant partiel',
            critical: '< 3 → Stock mort, risque d\'obsolescence'
        },
        benchmarks: [
            { sector: 'Alimentaire frais', min: 24, median: 52, max: 104, unit: 'rotations/an' },
            { sector: 'Commerce mode', min: 4, median: 6, max: 12, unit: 'rotations/an' },
            { sector: 'Industrie', min: 3, median: 6, max: 10, unit: 'rotations/an' },
            { sector: 'Équipements', min: 2, median: 4, max: 8, unit: 'rotations/an' }
        ],
        example: 'Achats 600k€, Stock moyen 100k€ → Rotation = 600k / 100k = 6× par an',
        relatedKPIs: ['BFR', 'MARGE_BRUTE', 'STOCK_MORT'],
        actionableInsights: [
            'Inventaire trimestriel pour détecter stocks dormants',
            'Soldes / déstockage si rotation < 4',
            'Optimiser commandes (méthode Kanban/Just-in-time)',
            'Analyser ABC : 20% références = 80% CA'
        ]
    }
};

/**
 * Fonction utilitaire pour obtenir une entrée du glossaire
 */
export function getGlossaryEntry(kpiId: string): FinancialGlossaryEntry | null {
    return FINANCIAL_GLOSSARY[kpiId] || null;
}

/**
 * Fonction pour obtenir toutes les entrées d'une catégorie
 */
export function getGlossaryByCategory(category: FinancialGlossaryEntry['category']): FinancialGlossaryEntry[] {
    return Object.values(FINANCIAL_GLOSSARY).filter(entry => entry.category === category);
}

/**
 * Fonction pour rechercher dans le glossaire
 */
export function searchGlossary(query: string): FinancialGlossaryEntry[] {
    const lowerQuery = query.toLowerCase();
    return Object.values(FINANCIAL_GLOSSARY).filter(entry =>
        entry.title.toLowerCase().includes(lowerQuery) ||
        entry.shortName.toLowerCase().includes(lowerQuery) ||
        entry.definition.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Mapping KPI → ID Glossaire
 */
export const KPI_TO_GLOSSARY_MAP: Record<string, string> = {
    "Chiffre d'Affaires": 'CA',
    "DSO Clients": 'DSO',
    "BFR": 'BFR',
    "Cash Flow Net": 'CASH_FLOW',
    "Marge Brute": 'MARGE_BRUTE',
    "Marge Nette": 'MARGE_NETTE',
    "EBITDA": 'EBITDA',
    "Rotation Stocks": 'ROTATION_STOCKS'
};

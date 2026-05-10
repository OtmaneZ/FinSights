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
    category: 'tresorerie' | 'rentabilite' | 'activite' | 'structure' | 'financement' | 'valorisation';
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

    CHARGES: {
        id: 'CHARGES',
        title: 'Charges',
        shortName: 'Dépenses totales',
        category: 'rentabilite',
        definition: 'Total des dépenses engagées pour faire fonctionner l\'entreprise. Inclut achats, salaires, loyers, marketing, etc.',
        formula: 'Charges = Achats + Charges fixes + Charges variables',
        formulaExplanation: 'Achats = COGS (marchandises) | Fixes = Loyers, salaires, assurances | Variables = Marketing, commissions',
        interpretation: {
            excellent: '< 70% du CA → Marge nette > 30% (très rentable)',
            good: '70-85% du CA → Marge nette 15-30% (rentable)',
            warning: '85-95% du CA → Marge nette 5-15% (faible)',
            critical: '> 95% du CA → Marge < 5% (risque perte)'
        },
        benchmarks: [
            { sector: 'Services', min: '60%', median: '75%', max: '85%', unit: '% du CA' },
            { sector: 'Commerce', min: '85%', median: '92%', max: '97%', unit: '% du CA' },
            { sector: 'Industrie', min: '75%', median: '85%', max: '92%', unit: '% du CA' },
            { sector: 'SaaS', min: '50%', median: '70%', max: '85%', unit: '% du CA' }
        ],
        example: 'CA 500k€, Charges 400k€ → 80% du CA → Marge nette 20%',
        relatedKPIs: ['MARGE_NETTE', 'MARGE_BRUTE', 'EBITDA'],
        actionableInsights: [
            'Catégoriser : Fixes vs Variables vs COGS',
            'Ratio charges fixes < 40% du CA pour résilience',
            'Automatiser pour réduire charges opérationnelles',
            'Négocier contrats annuels (-10 à -20%)'
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
    },

    // ========================================
    // TRÉSORERIE — SUITE
    // ========================================
    DPO: {
        id: 'DPO',
        title: 'DPO - Délai de Paiement Fournisseurs',
        shortName: 'Délai de paiement fournisseurs',
        category: 'tresorerie',
        definition: 'Nombre de jours moyen mis pour régler les fournisseurs. Un DPO long améliore la trésorerie mais peut dégrader la relation fournisseur.',
        formula: 'DPO = (Dettes fournisseurs / Achats TTC) × 365',
        formulaExplanation: 'Dettes fournisseurs = Factures reçues non encore payées | Achats TTC = Total achats annuels toutes taxes comprises',
        interpretation: {
            excellent: '< 30 jours → Paiement rapide, excellente relation fournisseur',
            good: '30-45 jours → Standard marché, équilibre sain',
            warning: '45-60 jours → Tension possible avec fournisseurs',
            critical: '> 60 jours → Risque de rupture d\'approvisionnement, LME à surveiller'
        },
        benchmarks: [
            { sector: 'Services / Conseil', min: 20, median: 35, max: 50, unit: 'jours' },
            { sector: 'Commerce', min: 30, median: 45, max: 60, unit: 'jours' },
            { sector: 'Industrie', min: 35, median: 50, max: 65, unit: 'jours' },
            { sector: 'BTP', min: 45, median: 60, max: 75, unit: 'jours' }
        ],
        example: 'Dettes fournisseurs 60k€, Achats 480k€ → DPO = (60k / 480k) × 365 = 45 jours',
        relatedKPIs: ['BFR', 'CCC', 'TRESORERIE_NETTE'],
        actionableInsights: [
            'Allonger le DPO améliore le cash mais fragilise la chaîne d\'approvisionnement',
            'Négocier délais 60j avec contreparties (prix, volumes)',
            'Attention à la Loi LME : plafond légal 60j nets ou 45j fin de mois',
            'Escompte dynamique : payer tôt si taux > coût du crédit'
        ]
    },

    CCC: {
        id: 'CCC',
        title: 'CCC - Cash Conversion Cycle',
        shortName: 'Cycle de conversion du cash',
        category: 'tresorerie',
        definition: 'Nombre de jours entre le décaissement fournisseur et l\'encaissement client. Mesure la durée pendant laquelle la trésorerie est immobilisée dans le cycle d\'exploitation.',
        formula: 'CCC = DSO + Rotation Stocks (en jours) − DPO',
        formulaExplanation: 'DSO = délai client | Rotation Stocks = 365 / taux rotation | DPO = délai fournisseur',
        interpretation: {
            excellent: '< 30 jours → Cycle court, trésorerie peu mobilisée',
            good: '30-60 jours → Cycle acceptable',
            warning: '60-90 jours → Cycle long, BFR élevé',
            critical: '> 90 jours → Cycle très long, risque de rupture de cash'
        },
        benchmarks: [
            { sector: 'Distribution / GMS', min: -30, median: -10, max: 10, unit: 'jours' },
            { sector: 'Services', min: 20, median: 40, max: 60, unit: 'jours' },
            { sector: 'Industrie', min: 40, median: 70, max: 100, unit: 'jours' },
            { sector: 'Commerce', min: 15, median: 35, max: 55, unit: 'jours' }
        ],
        example: 'DSO 45j + Stocks 30j − DPO 35j → CCC = 40 jours',
        relatedKPIs: ['DSO', 'DPO', 'BFR', 'ROTATION_STOCKS'],
        actionableInsights: [
            'Un CCC négatif (grande distribution) signifie que le client finance l\'activité',
            'Réduire le CCC de 10j libère ~2,7% du CA en trésorerie',
            'Agir sur les 3 leviers simultanément : DSO ↓, DPO ↑, Stocks ↓',
            'Affacturage ou reverse factoring pour compresser le cycle'
        ]
    },

    BURN_RATE: {
        id: 'BURN_RATE',
        title: 'Burn Rate',
        shortName: 'Vitesse de consommation du cash',
        category: 'tresorerie',
        definition: 'Vitesse de consommation mensuelle de la trésorerie. Indicateur critique pour les startups et entreprises en phase d\'investissement.',
        formula: 'Burn Rate = (Trésorerie N−1 − Trésorerie N) / Nombre de mois',
        formulaExplanation: 'Trésorerie N−1 = solde début de période | Trésorerie N = solde fin de période',
        interpretation: {
            excellent: 'Positif (cash flow positif) → L\'entreprise génère du cash',
            good: '< 5 000 €/mois → Consommation maîtrisée',
            warning: '5 000–15 000 €/mois → Surveiller le runway',
            critical: '> 15 000 €/mois → Levée ou pivot urgent'
        },
        benchmarks: [
            { sector: 'Startup early-stage', min: '10k€', median: '30k€', max: '100k€', unit: '€/mois' },
            { sector: 'PME en croissance', min: '5k€', median: '20k€', max: '50k€', unit: '€/mois' },
            { sector: 'Entreprise mature', min: '0€', median: '0€', max: '5k€', unit: '€/mois (négatif = bon)' },
            { sector: 'Scale-up tech', min: '50k€', median: '150k€', max: '500k€', unit: '€/mois' }
        ],
        example: 'Tréso jan 200k€, tréso juin 80k€ → Burn Rate = (200k − 80k) / 6 = 20k€/mois',
        relatedKPIs: ['RUNWAY', 'CASH_FLOW', 'FREE_CASH_FLOW'],
        actionableInsights: [
            'Runway = Trésorerie disponible / Burn Rate mensuel',
            'Seuil critique : 6 mois de runway → déclencher levée ou plan d\'économies',
            'Burn net vs burn brut : tenir compte des revenus entrants',
            'Distinguer burn d\'investissement (sain) vs burn opérationnel (à contrôler)'
        ]
    },

    RUNWAY: {
        id: 'RUNWAY',
        title: 'Runway',
        shortName: 'Autonomie de trésorerie',
        category: 'tresorerie',
        definition: 'Nombre de mois de trésorerie restant au rythme de consommation actuel. Indicateur de survie à court terme.',
        formula: 'Runway = Trésorerie disponible / Burn Rate mensuel',
        formulaExplanation: 'Trésorerie disponible = Solde bancaire disponible | Burn Rate = consommation mensuelle nette',
        interpretation: {
            excellent: '> 18 mois → Confort total, capacité d\'investissement',
            good: '12–18 mois → Situation saine, anticiper la suite',
            warning: '6–12 mois → Déclencher les démarches de financement',
            critical: '< 6 mois → Urgence : plan de survie ou levée immédiate'
        },
        benchmarks: [
            { sector: 'Startup pré-revenu', min: 12, median: 18, max: 24, unit: 'mois' },
            { sector: 'Startup post-Series A', min: 18, median: 24, max: 36, unit: 'mois' },
            { sector: 'PME profitable', min: 3, median: 6, max: 12, unit: 'mois (buffer)' },
            { sector: 'Entreprise mature', min: 2, median: 4, max: 8, unit: 'mois (buffer)' }
        ],
        example: 'Trésorerie 150k€, Burn Rate 12k€/mois → Runway = 150k / 12k = 12,5 mois',
        relatedKPIs: ['BURN_RATE', 'CASH_FLOW', 'TRESORERIE_NETTE'],
        actionableInsights: [
            'Mettre à jour le runway chaque fin de mois, pas trimestriellement',
            'Stress test : runway à −30% de revenus',
            'Dès 9 mois de runway : initier les discussions investisseurs (délai moyen levée = 6 mois)',
            'Inclure les engagements hors-bilan dans le calcul (loyers, salaires, abonnements)'
        ]
    },

    RATIO_LIQUIDITE_GENERALE: {
        id: 'RATIO_LIQUIDITE_GENERALE',
        title: 'Ratio de Liquidité Générale',
        shortName: 'Current Ratio',
        category: 'tresorerie',
        definition: 'Capacité à honorer les dettes à court terme avec l\'ensemble des actifs circulants. Indicateur de solvabilité à court terme.',
        formula: 'Ratio de Liquidité Générale = Actif circulant / Passif circulant',
        formulaExplanation: 'Actif circulant = Stocks + Créances + Trésorerie | Passif circulant = Dettes fournisseurs + Dettes fiscales + Emprunts < 1 an',
        interpretation: {
            excellent: '> 2 → Très bonne solvabilité court terme',
            good: '1,5–2 → Situation saine',
            warning: '1–1,5 → Marge de sécurité limitée',
            critical: '< 1 → Passif > Actif circulant, risque d\'insolvabilité'
        },
        benchmarks: [
            { sector: 'Services', min: 1.2, median: 1.8, max: 2.5, unit: 'ratio' },
            { sector: 'Industrie', min: 1.5, median: 2.0, max: 3.0, unit: 'ratio' },
            { sector: 'Commerce', min: 1.0, median: 1.4, max: 2.0, unit: 'ratio' },
            { sector: 'BTP', min: 1.1, median: 1.5, max: 2.2, unit: 'ratio' }
        ],
        example: 'Actif circulant 300k€, Passif circulant 180k€ → Ratio = 300k / 180k = 1,67',
        relatedKPIs: ['RATIO_LIQUIDITE_REDUITE', 'BFR', 'FONDS_ROULEMENT_NET'],
        actionableInsights: [
            'Un ratio < 1 déclenche souvent une alerte bancaire',
            'Améliorer en accélérant l\'encaissement ou en refinançant les dettes CT en LT',
            'Comparer avec le secteur : le commerce vit souvent avec un ratio proche de 1',
            'Ne pas confondre solvabilité (long terme) et liquidité (court terme)'
        ]
    },

    RATIO_LIQUIDITE_REDUITE: {
        id: 'RATIO_LIQUIDITE_REDUITE',
        title: 'Ratio de Liquidité Réduite',
        shortName: 'Quick Ratio',
        category: 'tresorerie',
        definition: 'Liquidité immédiate hors stocks — actifs les moins liquides. Plus prudent que le ratio général, élimine l\'hypothèse de vente rapide des stocks.',
        formula: 'Ratio de Liquidité Réduite = (Actif circulant − Stocks) / Passif circulant',
        formulaExplanation: 'On retire les stocks car ils sont difficiles à convertir rapidement en cash sans décote',
        interpretation: {
            excellent: '> 1,2 → Excellente liquidité immédiate',
            good: '1–1,2 → Liquidité satisfaisante',
            warning: '0,7–1 → Liquidité tendue',
            critical: '< 0,7 → Risque de défaut de paiement'
        },
        benchmarks: [
            { sector: 'Services (peu de stocks)', min: 1.0, median: 1.5, max: 2.0, unit: 'ratio' },
            { sector: 'Industrie', min: 0.7, median: 1.0, max: 1.5, unit: 'ratio' },
            { sector: 'Commerce', min: 0.5, median: 0.8, max: 1.2, unit: 'ratio' },
            { sector: 'SaaS', min: 1.5, median: 2.0, max: 3.0, unit: 'ratio' }
        ],
        example: 'Actif circulant 300k€, Stocks 80k€, Passif circulant 180k€ → Ratio = (300k − 80k) / 180k = 1,22',
        relatedKPIs: ['RATIO_LIQUIDITE_GENERALE', 'BFR', 'TRESORERIE_NETTE'],
        actionableInsights: [
            'Indicateur préféré des banquiers pour évaluer le risque court terme',
            'Un Quick Ratio < 0,8 peut bloquer l\'accès à un crédit de trésorerie',
            'Réduire les stocks améliore simultanément Quick Ratio et BFR',
            'Comparer l\'évolution trimestrielle, pas seulement le niveau absolu'
        ]
    },

    FONDS_ROULEMENT_NET: {
        id: 'FONDS_ROULEMENT_NET',
        title: 'Fonds de Roulement Net (FRN)',
        shortName: 'Fonds de roulement',
        category: 'tresorerie',
        definition: 'Excédent de ressources longues (capitaux permanents) disponible pour financer le cycle d\'exploitation après couverture des actifs immobilisés.',
        formula: 'FRN = Capitaux permanents − Actif immobilisé',
        formulaExplanation: 'Capitaux permanents = Capitaux propres + Dettes long terme | Actif immobilisé = Immobilisations nettes',
        interpretation: {
            excellent: 'Positif et > 20% du CA → Sécurité financière élevée',
            good: 'Positif → Ressources longues couvrent les immobilisations',
            warning: 'Proche de 0 → Équilibre précaire',
            critical: 'Négatif → Les immobilisations sont financées par des dettes CT (risque)'
        },
        benchmarks: [
            { sector: 'Services', min: '10%', median: '20%', max: '35%', unit: '% du CA' },
            { sector: 'Industrie', min: '15%', median: '25%', max: '40%', unit: '% du CA' },
            { sector: 'Commerce', min: '5%', median: '12%', max: '20%', unit: '% du CA' },
            { sector: 'BTP', min: '8%', median: '15%', max: '25%', unit: '% du CA' }
        ],
        example: 'Capitaux permanents 500k€, Actif immobilisé 350k€ → FRN = +150k€',
        relatedKPIs: ['BFR', 'TRESORERIE_NETTE', 'RATIO_LIQUIDITE_GENERALE'],
        actionableInsights: [
            'FRN positif est le prérequis d\'une situation financière saine',
            'Un FRN négatif chronique impose une recapitalisation ou un emprunt LT',
            'Augmenter le FRN : augmenter le capital, générer des bénéfices, allonger les dettes',
            'Relation : Trésorerie nette = FRN − BFR (l\'équation du bilan)'
        ]
    },

    TRESORERIE_NETTE: {
        id: 'TRESORERIE_NETTE',
        title: 'Trésorerie Nette',
        shortName: 'Position de trésorerie',
        category: 'tresorerie',
        definition: 'Solde final de trésorerie après financement complet du cycle d\'exploitation. L\'équation fondamentale du bilan : FRN − BFR = Trésorerie nette.',
        formula: 'Trésorerie Nette = FRN − BFR',
        formulaExplanation: 'FRN = Fonds de Roulement Net | BFR = Besoin en Fonds de Roulement',
        interpretation: {
            excellent: '> 50 000 € → Trésorerie confortable, capacité d\'opportunité',
            good: '> 0 → Situation équilibrée',
            warning: '< 0 ponctuel → Découvert géré, surveiller',
            critical: 'Structurellement négatif → Dépendance permanente au crédit court terme'
        },
        benchmarks: [
            { sector: 'Services', min: '5%', median: '10%', max: '20%', unit: '% du CA' },
            { sector: 'Commerce', min: '-5%', median: '2%', max: '8%', unit: '% du CA' },
            { sector: 'Industrie', min: '-10%', median: '0%', max: '10%', unit: '% du CA' },
            { sector: 'SaaS', min: '10%', median: '20%', max: '40%', unit: '% du CA' }
        ],
        example: 'FRN 150k€, BFR 110k€ → Trésorerie nette = +40k€',
        relatedKPIs: ['FONDS_ROULEMENT_NET', 'BFR', 'RUNWAY'],
        actionableInsights: [
            'Analyser les 3 composantes séparément : FRN, BFR, Trésorerie',
            'Une trésorerie nette négative n\'est pas forcément catastrophique si le BFR est maîtrisé',
            'Projection mensuelle sur 12 mois glissants pour anticiper les creux',
            'Placer les excédents > 3 mois de charges en instruments court terme'
        ]
    },

    // ========================================
    // RENTABILITÉ — SUITE
    // ========================================
    ROI: {
        id: 'ROI',
        title: 'ROI - Retour sur Investissement',
        shortName: 'Retour sur investissement',
        category: 'rentabilite',
        definition: 'Rentabilité d\'un projet ou d\'un actif — mesure le gain généré pour chaque euro investi.',
        formula: 'ROI = (Gain − Coût) / Coût × 100',
        formulaExplanation: 'Gain = Revenus ou économies générés | Coût = Investissement initial total',
        interpretation: {
            excellent: '> 30% → Investissement très rentable',
            good: '15–30% → Bonne rentabilité',
            warning: '5–15% → Rentabilité modeste, vérifier alternatives',
            critical: '< 5% → Rentabilité insuffisante au regard du risque'
        },
        benchmarks: [
            { sector: 'Marketing digital', min: '100%', median: '200%', max: '500%', unit: '%' },
            { sector: 'Immobilier professionnel', min: '5%', median: '8%', max: '12%', unit: '%' },
            { sector: 'Équipement industriel', min: '10%', median: '20%', max: '35%', unit: '%' },
            { sector: 'Formation / RH', min: '15%', median: '30%', max: '100%', unit: '%' }
        ],
        example: 'Investissement 50k€, gains générés 80k€ → ROI = (80k − 50k) / 50k × 100 = 60%',
        relatedKPIs: ['EBITDA', 'ROCE', 'EVA'],
        actionableInsights: [
            'Toujours inclure le coût du temps (main d\'œuvre interne) dans le coût',
            'Comparer le ROI au coût du capital (WACC) pour décider d\'investir',
            'ROI > coût opportunité = créer de la valeur',
            'Distinguer ROI prévisionnel vs ROI réel (post-mortem 12 mois)'
        ]
    },

    EBIT: {
        id: 'EBIT',
        title: 'EBIT - Résultat d\'Exploitation',
        shortName: 'Résultat opérationnel',
        category: 'rentabilite',
        definition: 'Résultat opérationnel avant charges financières et impôts. Mesure la performance industrielle et commerciale pure, indépendamment de la structure financière.',
        formula: 'EBIT = EBITDA − Dotations aux amortissements et provisions',
        formulaExplanation: 'EBITDA = résultat opérationnel brut | Dotations = consommation comptable des actifs immobilisés',
        interpretation: {
            excellent: '> 15% du CA → Excellente rentabilité opérationnelle',
            good: '10–15% du CA → Bonne performance',
            warning: '5–10% du CA → Rentabilité correcte mais fragile',
            critical: '< 5% du CA → Faible, surveiller les amortissements et la structure de coûts'
        },
        benchmarks: [
            { sector: 'SaaS / Tech', min: '15%', median: '20%', max: '35%', unit: '% du CA' },
            { sector: 'Services', min: '10%', median: '15%', max: '25%', unit: '% du CA' },
            { sector: 'Industrie', min: '5%', median: '10%', max: '15%', unit: '% du CA' },
            { sector: 'Commerce', min: '2%', median: '5%', max: '8%', unit: '% du CA' }
        ],
        example: 'EBITDA 200k€, Amortissements 40k€ → EBIT = 160k€ (16% sur CA 1M€)',
        relatedKPIs: ['EBITDA', 'RESULTAT_NET', 'ROCE'],
        actionableInsights: [
            'L\'EBIT = Résultat d\'exploitation au sens du PCG français',
            'Un EBIT négatif avec EBITDA positif → poids excessif des amortissements',
            'Comparer EBIT/EBITDA : si ratio < 50%, les amortissements sont très élevés',
            'Base de calcul des covenants bancaires (EBIT / charges d\'intérêts)'
        ]
    },

    EBITDA_MARGIN: {
        id: 'EBITDA_MARGIN',
        title: 'Taux d\'EBITDA',
        shortName: 'Marge EBITDA',
        category: 'rentabilite',
        definition: 'Part du chiffre d\'affaires convertie en EBITDA. Indicateur de référence pour comparer la rentabilité opérationnelle entre entreprises, indépendamment des choix de financement.',
        formula: 'Taux EBITDA = EBITDA / CA × 100',
        formulaExplanation: 'EBITDA = Résultat avant intérêts, impôts, amortissements | CA = Chiffre d\'affaires',
        interpretation: {
            excellent: '> 25% → Très forte rentabilité opérationnelle',
            good: '15–25% → Bonne performance',
            warning: '8–15% → Performance moyenne',
            critical: '< 8% → Rentabilité opérationnelle insuffisante'
        },
        benchmarks: [
            { sector: 'SaaS mature', min: '20%', median: '30%', max: '45%', unit: '%' },
            { sector: 'Services / Conseil', min: '12%', median: '18%', max: '28%', unit: '%' },
            { sector: 'Industrie', min: '8%', median: '13%', max: '20%', unit: '%' },
            { sector: 'Commerce', min: '3%', median: '7%', max: '12%', unit: '%' }
        ],
        example: 'EBITDA 250k€, CA 1M€ → Taux EBITDA = 250k / 1M × 100 = 25%',
        relatedKPIs: ['EBITDA', 'EBIT', 'MARGE_NETTE'],
        actionableInsights: [
            'Indicateur principal pour la valorisation par multiple (Valeur = EBITDA × multiple)',
            'Un taux EBITDA croissant = levier opérationnel positif',
            'Objectif Rule of 40 (SaaS) : croissance CA + taux EBITDA ≥ 40%',
            'Un taux EBITDA > 30% attire les investisseurs PE'
        ]
    },

    RESULTAT_NET: {
        id: 'RESULTAT_NET',
        title: 'Résultat Net',
        shortName: 'Bénéfice net',
        category: 'rentabilite',
        definition: 'Bénéfice ou perte finale après déduction de toutes les charges — exploitation, financières, exceptionnelles et impôts. La ligne du bas du compte de résultat.',
        formula: 'Résultat Net = EBIT − Charges financières − Impôt sur les sociétés ± Résultat exceptionnel',
        formulaExplanation: 'Charges financières = intérêts d\'emprunts | IS = taux légal (25% en France en 2026)',
        interpretation: {
            excellent: '> 10% du CA → Très profitable',
            good: '5–10% du CA → Rentabilité solide',
            warning: '0–5% du CA → Rentabilité fragile',
            critical: '< 0% → Perte nette — capitaux propres en diminution'
        },
        benchmarks: [
            { sector: 'SaaS', min: '10%', median: '20%', max: '35%', unit: '% du CA' },
            { sector: 'Services', min: '5%', median: '10%', max: '18%', unit: '% du CA' },
            { sector: 'Industrie', min: '2%', median: '6%', max: '12%', unit: '% du CA' },
            { sector: 'Commerce', min: '1%', median: '3%', max: '7%', unit: '% du CA' }
        ],
        example: 'EBIT 160k€, Charges financières 15k€, IS 36k€ → Résultat net = 109k€',
        relatedKPIs: ['EBIT', 'ROE', 'CAF'],
        actionableInsights: [
            'Un résultat net positif ne garantit pas une trésorerie positive (décalage BFR)',
            'Distinguer résultat comptable et cash-flow : les amortissements réduisent le résultat mais pas le cash',
            'Optimisation IS : holding, CIR, provisions réglementées',
            'Base de distribution des dividendes et de calcul du ROE'
        ]
    },

    ROE: {
        id: 'ROE',
        title: 'ROE - Rentabilité des Capitaux Propres',
        shortName: 'Return on Equity',
        category: 'rentabilite',
        definition: 'Rentabilité des fonds propres investis par les actionnaires. Mesure combien l\'entreprise génère pour chaque euro de capital apporté.',
        formula: 'ROE = Résultat Net / Capitaux Propres × 100',
        formulaExplanation: 'Résultat net = bénéfice annuel | Capitaux propres = capital + réserves + report à nouveau',
        interpretation: {
            excellent: '> 20% → Très attractive pour les investisseurs',
            good: '12–20% → Bonne rentabilité',
            warning: '7–12% → Rentabilité modeste',
            critical: '< 7% → En dessous du coût des fonds propres'
        },
        benchmarks: [
            { sector: 'SaaS / Tech', min: '15%', median: '25%', max: '50%', unit: '%' },
            { sector: 'Services', min: '10%', median: '18%', max: '30%', unit: '%' },
            { sector: 'Industrie', min: '8%', median: '14%', max: '22%', unit: '%' },
            { sector: 'Commerce', min: '5%', median: '10%', max: '18%', unit: '%' }
        ],
        example: 'Résultat net 100k€, Capitaux propres 500k€ → ROE = 100k / 500k × 100 = 20%',
        relatedKPIs: ['ROCE', 'RESULTAT_NET', 'EVA'],
        actionableInsights: [
            'Un ROE élevé via levier financier n\'est pas toujours sain (vérifier le gearing)',
            'Décomposition DuPont : ROE = Marge nette × Rotation actifs × Levier financier',
            'Comparer au coût des fonds propres (CAPM) : ROE > Ke = création de valeur',
            'Un ROE < 7% en 2026 signifie que les actionnaires seraient mieux en obligations'
        ]
    },

    ROCE: {
        id: 'ROCE',
        title: 'ROCE - Rentabilité du Capital Employé',
        shortName: 'Return on Capital Employed',
        category: 'rentabilite',
        definition: 'Rentabilité du capital total employé (fonds propres + dettes). Mesure l\'efficacité avec laquelle l\'entreprise utilise l\'ensemble de son capital.',
        formula: 'ROCE = EBIT / (Capitaux Propres + Dettes Financières) × 100',
        formulaExplanation: 'Capital employé = Capitaux propres + Dettes financières nettes = Actif économique',
        interpretation: {
            excellent: '> 20% → Capital très bien utilisé',
            good: '12–20% → Bonne efficacité du capital',
            warning: '8–12% → Utilisation correcte mais perfectible',
            critical: '< 8% → Capital mal employé, remettre en question les investissements'
        },
        benchmarks: [
            { sector: 'Tech / SaaS', min: '20%', median: '30%', max: '50%', unit: '%' },
            { sector: 'Services', min: '15%', median: '22%', max: '35%', unit: '%' },
            { sector: 'Industrie', min: '8%', median: '14%', max: '20%', unit: '%' },
            { sector: 'Commerce', min: '6%', median: '10%', max: '16%', unit: '%' }
        ],
        example: 'EBIT 160k€, Capitaux propres 400k€, Dettes 200k€ → ROCE = 160k / 600k × 100 = 26,7%',
        relatedKPIs: ['ROE', 'WACC', 'EVA'],
        actionableInsights: [
            'ROCE > WACC = création de valeur économique',
            'Indicateur préféré pour comparer des entreprises de structures financières différentes',
            'Un ROCE > ROE indique que la dette est utilisée efficacement (effet de levier positif)',
            'Améliorer le ROCE : augmenter l\'EBIT ou réduire le capital immobilisé'
        ]
    },

    SEUIL_RENTABILITE: {
        id: 'SEUIL_RENTABILITE',
        title: 'Seuil de Rentabilité',
        shortName: 'Point mort (CA)',
        category: 'rentabilite',
        definition: 'Chiffre d\'affaires minimum à réaliser pour couvrir l\'ensemble des charges et atteindre l\'équilibre financier. En dessous : perte. Au-dessus : profit.',
        formula: 'Seuil de Rentabilité = Charges Fixes / Taux de Marge sur Coûts Variables',
        formulaExplanation: 'Charges fixes = loyers, salaires, abonnements | Taux MCV = (CA − Charges variables) / CA',
        interpretation: {
            excellent: 'Atteint avant le 1er trimestre → Grande marge de sécurité',
            good: 'Atteint au 1er semestre → Situation confortable',
            warning: 'Atteint au 3e trimestre → Faible marge de sécurité',
            critical: 'Non atteint → L\'entreprise perd de l\'argent sur l\'année entière'
        },
        benchmarks: [
            { sector: 'Services', min: '50%', median: '60%', max: '75%', unit: '% du CA max atteignable' },
            { sector: 'Commerce', min: '70%', median: '80%', max: '90%', unit: '% du CA max atteignable' },
            { sector: 'Industrie', min: '55%', median: '65%', max: '80%', unit: '% du CA max atteignable' },
            { sector: 'SaaS', min: '40%', median: '55%', max: '70%', unit: '% du CA max atteignable' }
        ],
        example: 'Charges fixes 300k€, Taux MCV 60% → Seuil = 300k / 0,60 = 500k€ de CA',
        relatedKPIs: ['POINT_MORT', 'MARGE_CONTRIBUTION', 'EBIT'],
        actionableInsights: [
            'Calculer le seuil par produit / ligne de service',
            'Marge de sécurité = (CA réel − Seuil) / CA réel → objectif > 20%',
            'Réduire les charges fixes pour abaisser le seuil et gagner en résilience',
            'Modèles à charges variables élevées = seuil bas mais marge plafonnée'
        ]
    },

    POINT_MORT: {
        id: 'POINT_MORT',
        title: 'Point Mort',
        shortName: 'Date de rentabilité annuelle',
        category: 'rentabilite',
        definition: 'Date dans l\'année calendaire à partir de laquelle l\'entreprise a couvert toutes ses charges fixes et commence à générer du profit.',
        formula: 'Point Mort (jours) = Seuil de Rentabilité / (CA annuel / 365)',
        formulaExplanation: 'Seuil de rentabilité = CA minimum d\'équilibre | CA annuel / 365 = CA moyen journalier',
        interpretation: {
            excellent: '< 90 jours (avant fin mars) → Très rentable dès le 1er trimestre',
            good: '90–180 jours (avant fin juin) → Situation confortable',
            warning: '180–270 jours (avant fin septembre) → Peu de marge',
            critical: '> 270 jours (après fin septembre) → Risque de perte annuelle'
        },
        benchmarks: [
            { sector: 'Services', min: 60, median: 120, max: 200, unit: 'jours' },
            { sector: 'Commerce', min: 100, median: 160, max: 240, unit: 'jours' },
            { sector: 'Industrie', min: 80, median: 150, max: 220, unit: 'jours' },
            { sector: 'SaaS', min: 45, median: 100, max: 180, unit: 'jours' }
        ],
        example: 'Seuil 500k€, CA annuel 800k€ → Point mort = 500k / (800k/365) = 228 jours → fin juillet',
        relatedKPIs: ['SEUIL_RENTABILITE', 'MARGE_CONTRIBUTION', 'CHARGES'],
        actionableInsights: [
            'Communiquer la date du point mort en CODIR pour mobiliser les équipes',
            'Simuler l\'impact d\'une hausse de prix de 5% sur la date du point mort',
            'Un point mort au-delà de novembre = entreprise structurellement déficitaire',
            'Challenger : peut-on atteindre le seuil un mois plus tôt chaque année ?'
        ]
    },

    MARGE_CONTRIBUTION: {
        id: 'MARGE_CONTRIBUTION',
        title: 'Marge sur Coûts Variables',
        shortName: 'Marge de contribution',
        category: 'rentabilite',
        definition: 'Contribution de chaque unité vendue à la couverture des charges fixes. C\'est la marge restante après déduction de tous les coûts qui varient avec le volume d\'activité.',
        formula: 'Marge sur Coûts Variables = CA − Charges Variables',
        formulaExplanation: 'Charges variables = tout ce qui varie avec le volume : matières, commissions, frais de livraison',
        interpretation: {
            excellent: '> 60% du CA → Fort levier opérationnel (SaaS, conseil)',
            good: '40–60% du CA → Bonne structure de coûts',
            warning: '20–40% du CA → Levier limité, charges variables élevées',
            critical: '< 20% du CA → Très faible marge de contribution (modèle distribution)'
        },
        benchmarks: [
            { sector: 'SaaS / Logiciel', min: '60%', median: '75%', max: '90%', unit: '%' },
            { sector: 'Services / Conseil', min: '40%', median: '55%', max: '70%', unit: '%' },
            { sector: 'Industrie', min: '25%', median: '35%', max: '50%', unit: '%' },
            { sector: 'Commerce / Distribution', min: '15%', median: '25%', max: '40%', unit: '%' }
        ],
        example: 'CA 1M€, Charges variables 400k€ → MCV = 600k€ soit 60%',
        relatedKPIs: ['SEUIL_RENTABILITE', 'MARGE_BRUTE', 'EBITDA'],
        actionableInsights: [
            'Classer les produits par taux de MCV pour concentrer les efforts commerciaux',
            'Augmenter le prix de 1% = hausse MCV directe de ~1,5–2%',
            'Externaliser les activités à faible MCV pour concentrer la valeur',
            'MCV par canal de vente : comparer direct vs indirect vs e-commerce'
        ]
    },

    EVA: {
        id: 'EVA',
        title: 'EVA - Valeur Économique Ajoutée',
        shortName: 'Economic Value Added',
        category: 'rentabilite',
        definition: 'Valeur économique créée au-delà du coût du capital. L\'indicateur ultime de création de valeur — une entreprise peut avoir un résultat net positif et détruire de la valeur si son ROCE < WACC.',
        formula: 'EVA = NOPAT − (WACC × Capital Investi)',
        formulaExplanation: 'NOPAT = Résultat opérationnel net d\'impôt (EBIT × (1−t)) | WACC = coût moyen pondéré du capital',
        interpretation: {
            excellent: 'EVA fortement positive et croissante → Création de valeur significative',
            good: 'EVA positive → Rentabilité supérieure au coût du capital',
            warning: 'EVA proche de 0 → Rentabilité égale au coût du capital',
            critical: 'EVA négative → Destruction de valeur même si le résultat net est positif'
        },
        benchmarks: [
            { sector: 'Tech / SaaS', min: '5%', median: '15%', max: '30%', unit: '% du capital investi' },
            { sector: 'Services', min: '3%', median: '8%', max: '15%', unit: '% du capital investi' },
            { sector: 'Industrie', min: '0%', median: '4%', max: '10%', unit: '% du capital investi' },
            { sector: 'Commerce', min: '-2%', median: '2%', max: '8%', unit: '% du capital investi' }
        ],
        example: 'NOPAT 120k€, WACC 8%, Capital investi 1M€ → EVA = 120k − (8% × 1M) = +40k€',
        relatedKPIs: ['ROCE', 'WACC', 'ROE'],
        actionableInsights: [
            'Une EVA négative = les actionnaires auraient mieux fait d\'investir en Bourse',
            'Utiliser l\'EVA pour arbitrer les investissements : projets EVA > 0 uniquement',
            'L\'EVA est la base de la rémunération variable des DAF dans les grands groupes',
            'Levier EVA : augmenter NOPAT, réduire le capital investi, ou négocier le WACC'
        ]
    },

    // ========================================
    // ACTIVITÉ — SUITE
    // ========================================
    CROISSANCE_CA: {
        id: 'CROISSANCE_CA',
        title: 'Taux de Croissance du CA',
        shortName: 'Croissance du chiffre d\'affaires',
        category: 'activite',
        definition: 'Variation relative du chiffre d\'affaires entre deux périodes. Indicateur principal de dynamisme commercial.',
        formula: 'Taux de Croissance = (CA N − CA N−1) / CA N−1 × 100',
        formulaExplanation: 'CA N = chiffre d\'affaires de la période courante | CA N−1 = chiffre d\'affaires de la période précédente',
        interpretation: {
            excellent: '> 20% → Forte croissance, entreprise en développement',
            good: '10–20% → Croissance saine et soutenue',
            warning: '0–10% → Stagnation relative, surveiller la part de marché',
            critical: '< 0% → Décroissance — analyser causes et pivoter si nécessaire'
        },
        benchmarks: [
            { sector: 'Startup tech', min: '50%', median: '100%', max: '300%', unit: '%/an' },
            { sector: 'PME en croissance', min: '10%', median: '20%', max: '40%', unit: '%/an' },
            { sector: 'Industrie mature', min: '2%', median: '5%', max: '10%', unit: '%/an' },
            { sector: 'Commerce', min: '1%', median: '4%', max: '8%', unit: '%/an' }
        ],
        example: 'CA N-1 : 800k€, CA N : 1M€ → Croissance = (1M − 800k) / 800k × 100 = +25%',
        relatedKPIs: ['CA', 'MARGE_BRUTE', 'CAC'],
        actionableInsights: [
            'Décomposer la croissance : volume vs prix vs mix produit',
            'Comparer à la croissance du marché pour évaluer la part de marché',
            'Une forte croissance sans marge = piège de la vanité (vanity metric)',
            'Tracker par canal, segment, géographie pour identifier les moteurs'
        ]
    },

    PRODUCTIVITE_SALARIES: {
        id: 'PRODUCTIVITE_SALARIES',
        title: 'Productivité par Salarié',
        shortName: 'Valeur ajoutée par ETP',
        category: 'activite',
        definition: 'Richesse créée par employé (en équivalent temps plein). Indicateur d\'efficacité opérationnelle et de performance RH.',
        formula: 'Productivité = Valeur Ajoutée / Effectif ETP',
        formulaExplanation: 'Valeur Ajoutée = CA − Consommations intermédiaires | ETP = équivalent temps plein (ex : 2 mi-temps = 1 ETP)',
        interpretation: {
            excellent: '> 100 000 €/salarié → Très haute productivité',
            good: '60 000–100 000 €/salarié → Bonne productivité',
            warning: '40 000–60 000 €/salarié → Productivité dans la moyenne',
            critical: '< 40 000 €/salarié → Productivité faible, revoir organisation'
        },
        benchmarks: [
            { sector: 'Services / Conseil', min: 60000, median: 80000, max: 120000, unit: '€/salarié' },
            { sector: 'Industrie', min: 80000, median: 100000, max: 140000, unit: '€/salarié' },
            { sector: 'Commerce', min: 30000, median: 50000, max: 80000, unit: '€/salarié' },
            { sector: 'SaaS', min: 100000, median: 150000, max: 300000, unit: '€/salarié' }
        ],
        example: 'VA 1,2M€, 15 ETP → Productivité = 1,2M / 15 = 80 000 €/salarié',
        relatedKPIs: ['TAUX_CHARGES_PERSONNEL', 'CA', 'TAUX_VALEUR_AJOUTEE'],
        actionableInsights: [
            'Comparer à l\'évolution des salaires : si salaires croissent plus vite → perte de compétitivité',
            'Automatiser les tâches répétitives pour dégager de la VA par salarié',
            'Montée en compétences : formation ciblée = gain de VA sans recrutement',
            'Benchmarker par département (commercial vs production vs admin)'
        ]
    },

    TAUX_CHARGES_PERSONNEL: {
        id: 'TAUX_CHARGES_PERSONNEL',
        title: 'Taux de Charges de Personnel',
        shortName: 'Poids de la masse salariale',
        category: 'activite',
        definition: 'Part du chiffre d\'affaires absorbée par les charges de personnel (salaires + charges sociales). Indicateur de la structure de coûts humains.',
        formula: 'Taux = Charges de Personnel / CA × 100',
        formulaExplanation: 'Charges de personnel = salaires bruts + charges patronales + intéressement + formation',
        interpretation: {
            excellent: '< 30% → Levier d\'exploitation fort, marge importante',
            good: '30–40% → Structure saine pour les services',
            warning: '40–50% → Poids important, surveiller la productivité',
            critical: '> 50% → Masse salariale excessive par rapport au CA'
        },
        benchmarks: [
            { sector: 'Services / Conseil', min: '35%', median: '45%', max: '55%', unit: '%' },
            { sector: 'Commerce', min: '12%', median: '20%', max: '28%', unit: '%' },
            { sector: 'Industrie', min: '25%', median: '33%', max: '42%', unit: '%' },
            { sector: 'SaaS', min: '20%', median: '30%', max: '45%', unit: '%' }
        ],
        example: 'Charges personnel 400k€, CA 1M€ → Taux = 400k / 1M × 100 = 40%',
        relatedKPIs: ['PRODUCTIVITE_SALARIES', 'MARGE_BRUTE', 'EBITDA'],
        actionableInsights: [
            'Un taux en hausse avec CA stable = perte de levier opérationnel',
            'Plan d\'intéressement : transforme charges fixes en charges variables',
            'Comparer l\'évolution du taux vs l\'évolution de la productivité',
            'Externalisation partielle si taux > 50% sans levier d\'amélioration rapide'
        ]
    },

    ROTATION_CREANCES: {
        id: 'ROTATION_CREANCES',
        title: 'Rotation des Créances Clients',
        shortName: 'Rotation créances',
        category: 'activite',
        definition: 'Nombre de fois que les créances clients sont renouvelées dans l\'année. Plus le ratio est élevé, plus l\'encaissement est rapide.',
        formula: 'Rotation des Créances = CA TTC / Créances Clients',
        formulaExplanation: 'CA TTC = chiffre d\'affaires toutes taxes comprises | Créances clients = montant des factures impayées',
        interpretation: {
            excellent: '> 12 → Créances renouvelées chaque mois (DSO ≈ 30j)',
            good: '8–12 → Bonne rotation (DSO 30–45j)',
            warning: '4–8 → Rotation lente (DSO 45–90j)',
            critical: '< 4 → Créances très lentes, risque de trésorerie'
        },
        benchmarks: [
            { sector: 'SaaS / Abonnements', min: 12, median: 24, max: 52, unit: 'fois/an' },
            { sector: 'Services', min: 6, median: 10, max: 15, unit: 'fois/an' },
            { sector: 'Commerce', min: 8, median: 12, max: 20, unit: 'fois/an' },
            { sector: 'Industrie', min: 4, median: 7, max: 10, unit: 'fois/an' }
        ],
        example: 'CA TTC 1,2M€, Créances 100k€ → Rotation = 1,2M / 100k = 12 fois/an',
        relatedKPIs: ['DSO', 'BFR', 'CCC'],
        actionableInsights: [
            'Améliorer la rotation = réduire le DSO = libérer du cash',
            'Automatiser les relances pour maintenir une rotation élevée',
            'Surveiller les gros clients : un seul client à 60j peut dégrader tout le ratio',
            'Affacturage si rotation < 6 et BFR tendu'
        ]
    },

    ROTATION_DETTES: {
        id: 'ROTATION_DETTES',
        title: 'Rotation des Dettes Fournisseurs',
        shortName: 'Rotation dettes fournisseurs',
        category: 'activite',
        definition: 'Nombre de fois que les dettes fournisseurs sont renouvelées dans l\'année. Un faible ratio indique un DPO long (bon pour la trésorerie, risqué pour les relations).',
        formula: 'Rotation des Dettes = Achats TTC / Dettes Fournisseurs',
        formulaExplanation: 'Achats TTC = total des achats annuels TTC | Dettes fournisseurs = factures reçues non encore payées',
        interpretation: {
            excellent: '> 12 → Paiement rapide, relation fournisseur excellente',
            good: '8–12 → DPO 30–45j, équilibre sain',
            warning: '4–8 → DPO 45–90j, surveiller les tensions',
            critical: '< 4 → DPO > 90j, risque LME et rupture fournisseur'
        },
        benchmarks: [
            { sector: 'Services', min: 8, median: 10, max: 15, unit: 'fois/an' },
            { sector: 'Commerce', min: 6, median: 8, max: 12, unit: 'fois/an' },
            { sector: 'Industrie', min: 5, median: 7, max: 10, unit: 'fois/an' },
            { sector: 'BTP', min: 4, median: 6, max: 9, unit: 'fois/an' }
        ],
        example: 'Achats TTC 600k€, Dettes fournisseurs 75k€ → Rotation = 600k / 75k = 8 fois/an',
        relatedKPIs: ['DPO', 'BFR', 'CCC'],
        actionableInsights: [
            'Un ratio faible améliore la trésorerie mais dégrade la relation fournisseur',
            'Négocier les délais plutôt que de les étirer unilatéralement',
            'La Loi LME plafonne légalement à 60j nets ou 45j fin de mois',
            'Reverse factoring : le fournisseur se fait payer tôt via la banque'
        ]
    },

    TAUX_VALEUR_AJOUTEE: {
        id: 'TAUX_VALEUR_AJOUTEE',
        title: 'Taux de Valeur Ajoutée',
        shortName: 'Valeur ajoutée / CA',
        category: 'activite',
        definition: 'Part de valeur créée par l\'entreprise sur son chiffre d\'affaires, après déduction des consommations intermédiaires (achats, sous-traitance).',
        formula: 'Taux de Valeur Ajoutée = (CA − Consommations Externes) / CA × 100',
        formulaExplanation: 'Consommations externes = achats de marchandises + services externalisés + matières premières',
        interpretation: {
            excellent: '> 60% → Forte intégration, grande valeur créée en interne',
            good: '40–60% → Bonne valeur ajoutée',
            warning: '20–40% → Valeur ajoutée limitée',
            critical: '< 20% → Faible intégration, modèle de négoce pur'
        },
        benchmarks: [
            { sector: 'Services / Conseil', min: '60%', median: '75%', max: '90%', unit: '%' },
            { sector: 'Industrie', min: '30%', median: '45%', max: '60%', unit: '%' },
            { sector: 'Commerce / Négoce', min: '10%', median: '20%', max: '35%', unit: '%' },
            { sector: 'SaaS', min: '65%', median: '80%', max: '95%', unit: '%' }
        ],
        example: 'CA 1M€, Consommations externes 300k€ → TVA = (1M − 300k) / 1M × 100 = 70%',
        relatedKPIs: ['PRODUCTIVITE_SALARIES', 'MARGE_BRUTE', 'EBITDA'],
        actionableInsights: [
            'Un taux élevé = plus de valeur créée en interne = meilleure protection des marges',
            'Arbitrage make-or-buy : internaliser si la VA générée > coût de la ressource',
            'La VA est la base de l\'IS, de la taxe professionnelle et du calcul de la CAF',
            'Comparer l\'évolution du taux : une baisse signale une perte d\'efficacité'
        ]
    },

    CAC: {
        id: 'CAC',
        title: 'CAC - Coût d\'Acquisition Client',
        shortName: 'Coût acquisition client',
        category: 'activite',
        definition: 'Coût moyen dépensé pour acquérir un nouveau client, toutes dépenses marketing et commerciales incluses.',
        formula: 'CAC = Dépenses Marketing & Ventes / Nombre de Nouveaux Clients Acquis',
        formulaExplanation: 'Dépenses = publicité + salaires équipes commerciales + outils + événements | sur la même période',
        interpretation: {
            excellent: 'LTV / CAC > 5 → Modèle très rentable',
            good: 'LTV / CAC de 3–5 → Modèle économique sain',
            warning: 'LTV / CAC de 1–3 → Rentabilité limitée, optimiser',
            critical: 'LTV / CAC < 1 → Perd de l\'argent sur chaque client'
        },
        benchmarks: [
            { sector: 'SaaS B2B', min: '500€', median: '2 000€', max: '10 000€', unit: '€/client' },
            { sector: 'E-commerce', min: '20€', median: '80€', max: '250€', unit: '€/client' },
            { sector: 'Services B2B', min: '1 000€', median: '5 000€', max: '30 000€', unit: '€/client' },
            { sector: 'Retail', min: '5€', median: '30€', max: '100€', unit: '€/client' }
        ],
        example: 'Dépenses 50k€/mois, 25 nouveaux clients → CAC = 50k / 25 = 2 000€',
        relatedKPIs: ['LTV', 'CROISSANCE_CA', 'MARGE_BRUTE'],
        actionableInsights: [
            'Ratio LTV/CAC > 3 = modèle économique viable',
            'Payback period = CAC / (Revenu mensuel × Marge) → objectif < 12 mois',
            'Segmenter le CAC par canal : SEO vs Ads vs Outbound vs Referral',
            'Réduire le CAC : SEO, referral, onboarding self-service, inbound content'
        ]
    },

    LTV: {
        id: 'LTV',
        title: 'LTV - Valeur Vie Client',
        shortName: 'Lifetime Value',
        category: 'activite',
        definition: 'Valeur totale générée par un client sur toute la durée de la relation commerciale. Indicateur clé pour évaluer la rentabilité à long terme du modèle économique.',
        formula: 'LTV = Revenu Moyen par Client × Durée de Vie Moyenne × Taux de Marge',
        formulaExplanation: 'Revenu moyen = panier moyen ou MRR | Durée de vie = 1 / Taux de churn | Taux de marge = marge brute',
        interpretation: {
            excellent: 'LTV / CAC > 5 → Exceptionnel',
            good: 'LTV / CAC 3–5 → Viable et scalable',
            warning: 'LTV / CAC 1–3 → Rentabilité marginale',
            critical: 'LTV / CAC < 1 → Modèle non viable, perd de l\'argent sur chaque client'
        },
        benchmarks: [
            { sector: 'SaaS B2B (PME)', min: '5 000€', median: '15 000€', max: '60 000€', unit: '€/client' },
            { sector: 'SaaS B2C', min: '200€', median: '800€', max: '3 000€', unit: '€/client' },
            { sector: 'E-commerce', min: '100€', median: '400€', max: '1 500€', unit: '€/client' },
            { sector: 'Services B2B', min: '10 000€', median: '50 000€', max: '200 000€', unit: '€/client' }
        ],
        example: 'Revenu 500€/mois, churn 5%/mois (durée 20 mois), marge 60% → LTV = 500 × 20 × 0,60 = 6 000€',
        relatedKPIs: ['CAC', 'CROISSANCE_CA', 'MARGE_BRUTE'],
        actionableInsights: [
            'Augmenter la LTV : réduire le churn, faire de l\'upsell, lancer un programme de fidélité',
            'Segmenter la LTV par type de client pour identifier les ICP (Ideal Customer Profile)',
            'LTV / CAC > 3 est le seuil d\'investissement pour les VCs',
            'Un churn de 2% vs 5%/mois = LTV × 2,5 : la rétention est le levier le plus puissant'
        ]
    },

    // ========================================
    // FINANCEMENT
    // ========================================
    LEVIER_FINANCIER: {
        id: 'LEVIER_FINANCIER',
        title: 'Levier Financier',
        shortName: 'Dette / EBITDA',
        category: 'financement',
        definition: 'Nombre d\'années d\'EBITDA nécessaires pour rembourser la dette nette. Mesure la capacité de remboursement et le risque financier.',
        formula: 'Levier Financier = Dettes Financières Nettes / EBITDA',
        formulaExplanation: 'Dettes financières nettes = emprunts LT et CT − trésorerie disponible | EBITDA = résultat opérationnel brut',
        interpretation: {
            excellent: '< 1× → Très faiblement endetté, grande capacité de financement',
            good: '1–2× → Endettement raisonnable',
            warning: '2–3,5× → Vigilance, covenant proche',
            critical: '> 3,5× → Risque de covenant breach, les banques refusent généralement'
        },
        benchmarks: [
            { sector: 'SaaS profitable', min: 0, median: 1, max: 2, unit: 'x EBITDA' },
            { sector: 'Services', min: 0.5, median: 1.5, max: 3, unit: 'x EBITDA' },
            { sector: 'Industrie', min: 1, median: 2, max: 3.5, unit: 'x EBITDA' },
            { sector: 'LBO / PE', min: 3, median: 4.5, max: 7, unit: 'x EBITDA' }
        ],
        example: 'Dettes nettes 800k€, EBITDA 400k€ → Levier = 800k / 400k = 2× EBITDA',
        relatedKPIs: ['GEARING', 'RATIO_COUVERTURE_INTERETS', 'EBITDA'],
        actionableInsights: [
            'Les banques refusent généralement au-delà de 3–4× EBITDA',
            'Un levier < 2× laisse de la capacité pour une acquisition ou un investissement',
            'Améliorer l\'EBITDA est plus efficace que rembourser pour réduire le levier rapidement',
            'Surveiller le covenant associé dans le contrat de crédit'
        ]
    },

    GEARING: {
        id: 'GEARING',
        title: 'Gearing - Taux d\'Endettement',
        shortName: 'Ratio dettes / fonds propres',
        category: 'financement',
        definition: 'Niveau d\'endettement financier net rapporté aux fonds propres. Mesure la structure du passif et le risque de solvabilité à long terme.',
        formula: 'Gearing = Dettes Financières Nettes / Capitaux Propres × 100',
        formulaExplanation: 'Dettes financières nettes = emprunts − trésorerie | Capitaux propres = capital + réserves + résultat',
        interpretation: {
            excellent: '< 30% → Très solide, peu dépendant des créanciers',
            good: '30–60% → Endettement raisonnable',
            warning: '60–100% → Vigilance, potentiel de refinancement limité',
            critical: '> 100% → Dettes > Fonds propres, risque solvabilité'
        },
        benchmarks: [
            { sector: 'SaaS / Services', min: '0%', median: '20%', max: '60%', unit: '%' },
            { sector: 'Industrie', min: '20%', median: '50%', max: '100%', unit: '%' },
            { sector: 'Commerce', min: '10%', median: '40%', max: '90%', unit: '%' },
            { sector: 'Immobilier / BTP', min: '50%', median: '100%', max: '200%', unit: '%' }
        ],
        example: 'Dettes nettes 600k€, Capitaux propres 800k€ → Gearing = 600k / 800k × 100 = 75%',
        relatedKPIs: ['LEVIER_FINANCIER', 'DETTE_NETTE', 'ROE'],
        actionableInsights: [
            'Un gearing > 100% peut bloquer l\'accès à de nouveaux financements',
            'Recapitalisation ou conversion de dettes en equity pour réduire le gearing',
            'Le gearing élevé amplifie le ROE en bonne conjoncture (effet de levier)',
            'Stress test : que devient le gearing si l\'EBITDA baisse de 30% ?'
        ]
    },

    CAF: {
        id: 'CAF',
        title: 'CAF - Capacité d\'Autofinancement',
        shortName: 'Cash flow potentiel',
        category: 'financement',
        definition: 'Flux de trésorerie potentiel généré par l\'activité, avant variation du BFR. Ressource interne disponible pour rembourser les dettes, investir ou distribuer des dividendes.',
        formula: 'CAF = Résultat Net + Dotations aux Amortissements − Reprises − Plus-values de cession',
        formulaExplanation: 'Les dotations sont réintégrées car elles réduisent le résultat sans décaissement réel',
        interpretation: {
            excellent: '> 15% du CA → Forte capacité d\'autofinancement',
            good: '8–15% du CA → CAF saine',
            warning: '3–8% du CA → Capacité limitée',
            critical: '< 3% ou négative → Dépendance aux financements externes'
        },
        benchmarks: [
            { sector: 'SaaS', min: '15%', median: '25%', max: '40%', unit: '% du CA' },
            { sector: 'Services', min: '8%', median: '12%', max: '20%', unit: '% du CA' },
            { sector: 'Industrie', min: '6%', median: '10%', max: '15%', unit: '% du CA' },
            { sector: 'Commerce', min: '2%', median: '5%', max: '9%', unit: '% du CA' }
        ],
        example: 'Résultat net 80k€, Amortissements 40k€ → CAF = 120k€',
        relatedKPIs: ['FREE_CASH_FLOW', 'LEVIER_FINANCIER', 'RESULTAT_NET'],
        actionableInsights: [
            'La CAF finance les investissements, le remboursement de dettes et les dividendes',
            'Ratio CAF / Dettes financières → objectif > 25% (remboursement en moins de 4 ans)',
            'Une CAF négative = l\'entreprise consume ses réserves ou s\'endette pour fonctionner',
            'Distinguer CAF et free cash flow : le FCF intègre la variation du BFR et le CAPEX'
        ]
    },

    RATIO_COUVERTURE_INTERETS: {
        id: 'RATIO_COUVERTURE_INTERETS',
        title: 'Ratio de Couverture des Intérêts',
        shortName: 'Interest Coverage Ratio',
        category: 'financement',
        definition: 'Capacité à payer les charges d\'intérêts de la dette avec le résultat opérationnel. Mesure le confort du service de la dette.',
        formula: 'Ratio de Couverture = EBIT / Charges d\'Intérêts',
        formulaExplanation: 'EBIT = résultat avant intérêts et impôts | Charges d\'intérêts = coût annuel de la dette',
        interpretation: {
            excellent: '> 5× → Très confortable, pression nulle de la dette',
            good: '3–5× → Situation saine',
            warning: '1,5–3× → Marge faible, tout ralentissement est risqué',
            critical: '< 1,5× → L\'EBIT ne couvre pas bien les intérêts, risque de défaut'
        },
        benchmarks: [
            { sector: 'SaaS / Services', min: 5, median: 10, max: 20, unit: 'x' },
            { sector: 'Industrie', min: 3, median: 5, max: 10, unit: 'x' },
            { sector: 'Commerce', min: 2, median: 4, max: 8, unit: 'x' },
            { sector: 'Startup / LBO', min: 1.2, median: 2, max: 3.5, unit: 'x' }
        ],
        example: 'EBIT 160k€, Intérêts 25k€ → Ratio = 160k / 25k = 6,4× → très confortable',
        relatedKPIs: ['EBIT', 'LEVIER_FINANCIER', 'GEARING'],
        actionableInsights: [
            'Covenant bancaire typique : ratio > 2–3× selon les établissements',
            'Un ratio en dessous de 2× déclenche souvent une renégociation forcée',
            'Refinancer à taux fixe en période de hausse des taux pour sécuriser le ratio',
            'Comparer à l\'évolution des taux BCE pour anticiper l\'impact sur les intérêts variables'
        ]
    },

    WACC: {
        id: 'WACC',
        title: 'WACC - Coût Moyen Pondéré du Capital',
        shortName: 'Coût du capital',
        category: 'financement',
        definition: 'Taux de rendement minimum exigé par l\'ensemble des pourvoyeurs de fonds (actionnaires et créanciers). Tout investissement dont le ROI > WACC crée de la valeur.',
        formula: 'WACC = (E/V × Re) + (D/V × Rd × (1−T))',
        formulaExplanation: 'E = Valeur fonds propres | D = Dettes | V = E+D | Re = coût fonds propres | Rd = coût dettes | T = taux d\'IS',
        interpretation: {
            excellent: 'ROCE >> WACC → Création de valeur forte',
            good: 'ROCE > WACC → Création de valeur',
            warning: 'ROCE ≈ WACC → Équilibre, pas de création nette',
            critical: 'ROCE < WACC → Destruction de valeur'
        },
        benchmarks: [
            { sector: 'PME services (France 2026)', min: '7%', median: '9%', max: '12%', unit: '%' },
            { sector: 'Industrie', min: '8%', median: '10%', max: '14%', unit: '%' },
            { sector: 'Tech / SaaS', min: '9%', median: '12%', max: '18%', unit: '%' },
            { sector: 'Startup', min: '15%', median: '20%', max: '30%', unit: '%' }
        ],
        example: '70% fonds propres à 12%, 30% dettes à 4% net IS → WACC = 0,7×12% + 0,3×4% = 9,6%',
        relatedKPIs: ['EVA', 'ROCE', 'DCF'],
        actionableInsights: [
            'Tout projet dont le ROI > WACC crée de la valeur pour les actionnaires',
            'Réduire le WACC : augmenter la part de dettes (moins chères) sans excès de levier',
            'Le WACC est le taux d\'actualisation du DCF — il impacte directement la valorisation',
            'En période de hausse des taux, le WACC augmente mécaniquement → valorisations baissent'
        ]
    },

    DETTE_NETTE: {
        id: 'DETTE_NETTE',
        title: 'Dette Nette',
        shortName: 'Endettement réel',
        category: 'financement',
        definition: 'Endettement financier réel après déduction de la trésorerie disponible. Mesure la position nette vis-à-vis des créanciers financiers.',
        formula: 'Dette Nette = Dettes Financières − Trésorerie Disponible',
        formulaExplanation: 'Dettes financières = emprunts bancaires + obligations + crédit-bail | Trésorerie = soldes bancaires disponibles',
        interpretation: {
            excellent: 'Trésorerie nette positive (cash > dettes) → Pas de dette nette',
            good: 'Dette nette < 1× EBITDA → Endettement faible',
            warning: 'Dette nette 1–3× EBITDA → Endettement significatif',
            critical: 'Dette nette > 3× EBITDA → Endettement élevé, risque de covenant'
        },
        benchmarks: [
            { sector: 'SaaS profitable', min: '-50%', median: '0%', max: '100%', unit: '% des capitaux propres' },
            { sector: 'Services', min: '0%', median: '30%', max: '80%', unit: '% des capitaux propres' },
            { sector: 'Industrie', min: '20%', median: '60%', max: '120%', unit: '% des capitaux propres' },
            { sector: 'Commerce', min: '10%', median: '40%', max: '90%', unit: '% des capitaux propres' }
        ],
        example: 'Emprunts 500k€, Trésorerie 120k€ → Dette nette = 500k − 120k = 380k€',
        relatedKPIs: ['LEVIER_FINANCIER', 'GEARING', 'VALEUR_ENTREPRISE'],
        actionableInsights: [
            'La dette nette est la base de calcul du levier financier',
            'Une trésorerie > dettes = position de cash net → atout pour une acquisition',
            'Inclure le crédit-bail dans les dettes financières (norme IFRS 16)',
            'Monitorer mensuellement : la dette nette fluctue avec le BFR et le CAPEX'
        ]
    },

    COVENANT_BANCAIRE: {
        id: 'COVENANT_BANCAIRE',
        title: 'Covenant Bancaire',
        shortName: 'Clause contractuelle bancaire',
        category: 'financement',
        definition: 'Clause contractuelle imposée par la banque dans un accord de crédit — ratio financier à respecter sous peine de remboursement anticipé du prêt.',
        formula: 'Variable selon l\'accord (ex: Dette nette / EBITDA < 3×, Ratio de couverture > 2×)',
        formulaExplanation: 'Les covenants les plus courants portent sur le levier (Dette/EBITDA), la couverture des intérêts (EBIT/Intérêts) et les fonds propres minimum',
        interpretation: {
            excellent: 'Tous les covenants respectés avec marge > 30% → Sérénité financière',
            good: 'Covenants respectés avec marge de 10–30% → Situation normale',
            warning: 'Marge < 10% sur un covenant → Risque de breach si moindre choc',
            critical: 'Covenant breach → Mise en demeure possible, renegociation forcée'
        },
        benchmarks: [
            { sector: 'Covenant Levier (standard)', min: '3x', median: '2.5x', max: '2x', unit: 'maximum autorisé' },
            { sector: 'Covenant Couverture (standard)', min: '1.5x', median: '2x', max: '3x', unit: 'minimum requis' },
            { sector: 'Covenant Fonds propres', min: '200k€', median: '500k€', max: '1M€', unit: 'minimum requis' },
            { sector: 'Fréquence de contrôle', min: 'Annuelle', median: 'Semestrielle', max: 'Trimestrielle', unit: '' }
        ],
        example: 'Banque impose Dette/EBITDA < 3× — si EBITDA baisse à 200k€ et dettes à 700k€, levier = 3,5× → breach',
        relatedKPIs: ['LEVIER_FINANCIER', 'RATIO_COUVERTURE_INTERETS', 'EBITDA'],
        actionableInsights: [
            'La violation d\'un covenant peut déclencher une mise en demeure même si l\'entreprise est solvable',
            'Monitorer les covenants mensuellement, pas seulement à la clôture annuelle',
            'Négocier une waiver (dérogation) proactivement avant d\'être en breach',
            'Anticiper 6 mois avant : si tendance défavorable, renégocier les termes'
        ]
    },

    FREE_CASH_FLOW: {
        id: 'FREE_CASH_FLOW',
        title: 'Free Cash Flow',
        shortName: 'Cash disponible après investissements',
        category: 'financement',
        definition: 'Cash disponible après financement de l\'activité et des investissements. Le vrai indicateur de génération de valeur — ce que l\'entreprise peut réellement distribuer ou réinvestir.',
        formula: 'FCF = EBITDA − Variation BFR − CAPEX − Impôts sur les Sociétés',
        formulaExplanation: 'CAPEX = dépenses d\'investissement (immobilisations) | Variation BFR = augmentation ou diminution du besoin en fonds de roulement',
        interpretation: {
            excellent: 'Positif et croissant → Génère du cash et investit dans la croissance',
            good: 'Positif stable → Génération de cash saine',
            warning: 'Négatif ponctuel → Phase d\'investissement, acceptable si temporaire',
            critical: 'Structurellement négatif → Dépendance aux financements externes chronique'
        },
        benchmarks: [
            { sector: 'SaaS mature', min: '15%', median: '25%', max: '40%', unit: '% du CA' },
            { sector: 'Services', min: '8%', median: '14%', max: '22%', unit: '% du CA' },
            { sector: 'Industrie', min: '3%', median: '7%', max: '12%', unit: '% du CA' },
            { sector: 'Commerce', min: '2%', median: '5%', max: '9%', unit: '% du CA' }
        ],
        example: 'EBITDA 300k€, ΔBFR +30k€, CAPEX 50k€, IS 55k€ → FCF = 300k − 30k − 50k − 55k = 165k€',
        relatedKPIs: ['CAF', 'EBITDA', 'DETTE_NETTE'],
        actionableInsights: [
            'Le FCF est la base de la valorisation DCF',
            'Un EBITDA élevé mais FCF faible = attention au CAPEX ou au BFR',
            'Surveiller le ratio CAPEX/CA : > 10% signifie une forte intensité capitalistique',
            'FCF yield = FCF / Valeur d\'entreprise → indicateur d\'attractivité d\'investissement'
        ]
    },

    // ========================================
    // VALORISATION
    // ========================================
    MULTIPLE_EBITDA: {
        id: 'MULTIPLE_EBITDA',
        title: 'Multiple d\'EBITDA',
        shortName: 'Valorisation par EBITDA',
        category: 'valorisation',
        definition: 'Méthode de valorisation par les comparables boursiers ou transactionnels — multiple appliqué à l\'EBITDA pour estimer la valeur d\'entreprise.',
        formula: 'Valeur d\'Entreprise = EBITDA × Multiple Sectoriel',
        formulaExplanation: 'Multiple = rapport Valeur Entreprise / EBITDA observé sur des transactions comparables',
        interpretation: {
            excellent: 'Multiple élevé (> 10×) → Forte prime de croissance ou de qualité',
            good: 'Multiple marché (5–10×) → Valorisation standard',
            warning: 'Multiple faible (< 5×) → Décote de risque ou faible croissance',
            critical: 'EBITDA négatif → Méthode non applicable, valoriser sur CA ou assets'
        },
        benchmarks: [
            { sector: 'SaaS / Tech', min: '8×', median: '12×', max: '20×', unit: 'x EBITDA' },
            { sector: 'Services / Conseil', min: '5×', median: '7×', max: '10×', unit: 'x EBITDA' },
            { sector: 'Industrie', min: '4×', median: '6×', max: '9×', unit: 'x EBITDA' },
            { sector: 'Commerce', min: '3×', median: '5×', max: '7×', unit: 'x EBITDA' }
        ],
        example: 'EBITDA 500k€, multiple sectoriel 7× → Valeur Entreprise = 500k × 7 = 3,5M€',
        relatedKPIs: ['EBITDA', 'EBITDA_MARGIN', 'VALEUR_ENTREPRISE'],
        actionableInsights: [
            'Améliorer l\'EBITDA d\'100k€ avec un multiple de 7× = +700k€ de valeur créée',
            'La qualité des revenus (récurrence, concentration clients) impacte le multiple',
            'Préparer un exit : viser 2–3 ans d\'EBITDA en croissance avant la cession',
            'Les acquéreurs stratégiques paient 1–3× plus que les financiers (PE)'
        ]
    },

    MULTIPLE_CA: {
        id: 'MULTIPLE_CA',
        title: 'Multiple de CA',
        shortName: 'Valorisation par chiffre d\'affaires',
        category: 'valorisation',
        definition: 'Valorisation rapide basée sur un multiple du chiffre d\'affaires — moins précise que le multiple EBITDA mais utilisée pour les entreprises non profitables ou à forte croissance.',
        formula: 'Valeur d\'Entreprise = CA × Multiple Sectoriel',
        formulaExplanation: 'Multiple CA = Valeur Entreprise / CA (ou ARR pour SaaS)',
        interpretation: {
            excellent: 'Multiple élevé (> 5×) → Forte prime de croissance (SaaS hyper-growth)',
            good: 'Multiple marché (1–5×) → Valorisation standard pour croissance',
            warning: 'Multiple faible (< 1×) → Croissance limitée ou rentabilité faible',
            critical: 'CA décroissant → Multiple pénalisé, difficile de lever ou de céder'
        },
        benchmarks: [
            { sector: 'SaaS B2B (ARR)', min: '3×', median: '6×', max: '12×', unit: 'x ARR' },
            { sector: 'Services / Conseil', min: '0,4×', median: '0,8×', max: '1,5×', unit: 'x CA' },
            { sector: 'Commerce', min: '0,2×', median: '0,5×', max: '0,9×', unit: 'x CA' },
            { sector: 'Industrie', min: '0,3×', median: '0,6×', max: '1×', unit: 'x CA' }
        ],
        example: 'CA (ARR) 1M€, multiple SaaS 6× → Valeur d\'Entreprise = 6M€',
        relatedKPIs: ['MULTIPLE_EBITDA', 'CROISSANCE_CA', 'VALEUR_ENTREPRISE'],
        actionableInsights: [
            'Utilisé principalement pour SaaS (ARR) et startups pré-profitables',
            'Le multiple CA dépend fortement du taux de croissance : 100%/an → multiple 2× plus élevé',
            'Pour PME services, privilégier le multiple EBITDA (plus stable)',
            'Récurrence = prime de multiple : MRR > projets = valorisation plus élevée'
        ]
    },

    DCF: {
        id: 'DCF',
        title: 'DCF - Discounted Cash Flow',
        shortName: 'Actualisation des flux futurs',
        category: 'valorisation',
        definition: 'Méthode de valorisation par actualisation des flux de trésorerie futurs. La méthode de référence des analystes financiers — valorise l\'entreprise selon sa capacité à générer du cash dans le futur.',
        formula: 'Valeur = Σ (FCF_n / (1+WACC)^n) + Valeur Terminale / (1+WACC)^N',
        formulaExplanation: 'FCF_n = free cash flow de l\'année n | WACC = taux d\'actualisation | Valeur terminale = FCF × (1+g) / (WACC−g)',
        interpretation: {
            excellent: 'DCF > Valeur de marché → Sous-valorisé, opportunité d\'achat',
            good: 'DCF ≈ Valeur de marché → Valorisation cohérente',
            warning: 'DCF < Valeur de marché → Survalorisation, prime injustifiée',
            critical: 'FCF négatifs sur 5 ans → DCF difficile, valoriser autrement'
        },
        benchmarks: [
            { sector: 'Taux d\'actualisation PME (2026)', min: '8%', median: '10%', max: '15%', unit: 'WACC' },
            { sector: 'Taux de croissance terminal', min: '1%', median: '2%', max: '3%', unit: '%' },
            { sector: 'Horizon de projection', min: '3 ans', median: '5 ans', max: '10 ans', unit: '' },
            { sector: 'Valeur terminale / Valeur totale', min: '50%', median: '65%', max: '80%', unit: '%' }
        ],
        example: 'FCF an 1-5 : 100k, 120k, 140k, 160k, 180k€ actualisés à 10% + VT → Valeur ≈ 1,8M€',
        relatedKPIs: ['FREE_CASH_FLOW', 'WACC', 'VALEUR_ENTREPRISE'],
        actionableInsights: [
            'Très sensible au WACC : +1pt de taux d\'actualisation = −10 à −15% de valeur',
            'La valeur terminale représente 60–80% de la valeur totale — soigner les hypothèses',
            'Construire 3 scénarios (bear / base / bull) pour encadrer la valeur',
            'Le DCF est une conversation sur les hypothèses, pas une vérité absolue'
        ]
    },

    VALEUR_ENTREPRISE: {
        id: 'VALEUR_ENTREPRISE',
        title: 'Valeur d\'Entreprise (VE)',
        shortName: 'Enterprise Value',
        category: 'valorisation',
        definition: 'Valeur totale de l\'entreprise indépendamment de sa structure financière — ce que paierait un acquéreur pour reprendre 100% de l\'activité, dette incluse.',
        formula: 'VE = Capitalisation Boursière + Dette Nette − Trésorerie',
        formulaExplanation: 'Pour PME non cotée : VE = estimation par multiple ou DCF | Dette nette = dettes financières − trésorerie disponible',
        interpretation: {
            excellent: 'VE croissante et multiple élevé → Valeur créée pour les actionnaires',
            good: 'VE stable et rentable → Entreprise de valeur',
            warning: 'VE stagnante malgré CA croissant → Compression des marges ou levier élevé',
            critical: 'VE < actif net → Décote actif, valeur détruite'
        },
        benchmarks: [
            { sector: 'PME services (France)', min: '3×', median: '5×', max: '8×', unit: 'x EBITDA' },
            { sector: 'PME industrie', min: '3×', median: '5×', max: '7×', unit: 'x EBITDA' },
            { sector: 'SaaS PME', min: '5×', median: '8×', max: '15×', unit: 'x ARR' },
            { sector: 'Startups tech (Series A+)', min: '5×', median: '10×', max: '30×', unit: 'x ARR' }
        ],
        example: 'Multiple 6×, EBITDA 500k€ → VE = 3M€. Si dettes nettes 300k€ → Valeur fonds propres = 2,7M€',
        relatedKPIs: ['VALEUR_FONDS_PROPRES', 'DETTE_NETTE', 'MULTIPLE_EBITDA'],
        actionableInsights: [
            'VE = ce que paie un acheteur | Valeur fonds propres = ce que reçoit le vendeur',
            'Réduire la dette nette avant une cession pour maximiser le prix actionnaire',
            'La VE est indépendante de la structure financière → utile pour comparer des entreprises',
            'Travailler la VE 2–3 ans avant une cession : EBITDA, dette, croissance, contrats'
        ]
    },

    VALEUR_FONDS_PROPRES: {
        id: 'VALEUR_FONDS_PROPRES',
        title: 'Valeur des Fonds Propres',
        shortName: 'Equity Value',
        category: 'valorisation',
        definition: 'Valeur revenant aux actionnaires après remboursement de la dette nette. C\'est le prix que reçoit effectivement le cédant lors d\'une cession.',
        formula: 'Valeur Fonds Propres = Valeur d\'Entreprise − Dette Nette',
        formulaExplanation: 'VE = valorisation totale de l\'activité | Dette nette = dettes financières − trésorerie',
        interpretation: {
            excellent: 'VFP >> Valeur comptable des fonds propres → Fort goodwill, valeur immatérielle élevée',
            good: 'VFP > Valeur comptable → Prime justifiée par la rentabilité',
            warning: 'VFP ≈ Valeur comptable → Pas de création de valeur immatérielle',
            critical: 'VFP < Valeur comptable → Décote, perte de valeur'
        },
        benchmarks: [
            { sector: 'PME profitable', min: '2×', median: '3×', max: '6×', unit: 'x Capitaux propres comptables' },
            { sector: 'SaaS à forte croissance', min: '5×', median: '10×', max: '30×', unit: 'x Capitaux propres comptables' },
            { sector: 'Commerce / Négoce', min: '1×', median: '1,5×', max: '3×', unit: 'x Capitaux propres comptables' },
            { sector: 'Industrie capitalistique', min: '0,8×', median: '1,5×', max: '3×', unit: 'x Capitaux propres comptables' }
        ],
        example: 'VE 3M€, Dette nette 300k€ → Valeur fonds propres = 2,7M€ pour les actionnaires',
        relatedKPIs: ['VALEUR_ENTREPRISE', 'DETTE_NETTE', 'GOODWILL'],
        actionableInsights: [
            'Maximiser la VFP : augmenter l\'EBITDA ET réduire la dette nette',
            'La trésorerie accumulée augmente la VFP euro pour euro',
            'Les dettes hors-bilan (crédit-bail, garanties) réduisent la VFP réelle',
            'Ajustements de prix courants : normalisation de l\'EBITDA, working capital peg'
        ]
    },

    GOODWILL: {
        id: 'GOODWILL',
        title: 'Goodwill - Écart d\'Acquisition',
        shortName: 'Survaleur',
        category: 'valorisation',
        definition: 'Valeur immatérielle payée lors d\'une acquisition au-delà de la valeur nette des actifs tangibles — reflète la marque, la clientèle, le savoir-faire et les synergies attendues.',
        formula: 'Goodwill = Prix d\'Acquisition − Actif Net Réévalué',
        formulaExplanation: 'Actif net réévalué = Actif total à la juste valeur − Passif total à la juste valeur',
        interpretation: {
            excellent: 'Goodwill modéré (< 30% du prix) → Prime justifiée et raisonnable',
            good: 'Goodwill de 30–50% → Normale pour une acquisition d\'entreprise de qualité',
            warning: 'Goodwill > 50% → Prix élevé, synergies difficiles à réaliser',
            critical: 'Dépréciation du goodwill → Prise de conscience que l\'acquisition a surpayé'
        },
        benchmarks: [
            { sector: 'Acquisitions PME services', min: '20%', median: '40%', max: '60%', unit: '% du prix total' },
            { sector: 'Acquisitions SaaS', min: '40%', median: '60%', max: '80%', unit: '% du prix total' },
            { sector: 'Acquisitions industrie', min: '10%', median: '25%', max: '45%', unit: '% du prix total' },
            { sector: 'Test de dépréciation', min: 'Annuel', median: 'Annuel', max: 'Annuel', unit: '(IFRS/PCG)' }
        ],
        example: 'Prix d\'acquisition 5M€, Actif net réévalué 3M€ → Goodwill = 2M€ (40% du prix)',
        relatedKPIs: ['VALEUR_ENTREPRISE', 'VALEUR_FONDS_PROPRES', 'MULTIPLE_EBITDA'],
        actionableInsights: [
            'Le goodwill doit être testé pour dépréciation chaque année (impairment test)',
            'Une dépréciation de goodwill = aveu que l\'acquisition a été surpayée',
            'Due diligence : vérifier que le goodwill correspond à des actifs intangibles réels',
            'Trop de goodwill au bilan = risque de correction comptable future'
        ]
    },

    PER: {
        id: 'PER',
        title: 'PER - Price Earning Ratio',
        shortName: 'Ratio cours / bénéfice',
        category: 'valorisation',
        definition: 'Nombre d\'années de bénéfices reflété dans le prix de l\'action ou la valorisation. Indicateur de la prime de croissance et de qualité accordée par le marché.',
        formula: 'PER = Prix de l\'Action / Bénéfice par Action',
        formulaExplanation: 'Pour PME non cotée : PER = Valeur fonds propres / Résultat net',
        interpretation: {
            excellent: 'PER élevé (> 20×) → Marché anticipe une forte croissance future',
            good: 'PER standard (12–20×) → Valorisation normale',
            warning: 'PER faible (8–12×) → Croissance limitée ou décote de risque',
            critical: 'PER < 8× → Secteur en difficulté ou entreprise en risque'
        },
        benchmarks: [
            { sector: 'PME non cotées France', min: '6×', median: '10×', max: '15×', unit: 'x résultat net' },
            { sector: 'Tech / SaaS coté', min: '20×', median: '35×', max: '80×', unit: 'x résultat net' },
            { sector: 'Commerce coté', min: '10×', median: '18×', max: '30×', unit: 'x résultat net' },
            { sector: 'Industrie cotée', min: '8×', median: '15×', max: '25×', unit: 'x résultat net' }
        ],
        example: 'Valeur fonds propres 2M€, Résultat net 200k€ → PER = 2M / 200k = 10× les bénéfices',
        relatedKPIs: ['RESULTAT_NET', 'VALEUR_FONDS_PROPRES', 'ROE'],
        actionableInsights: [
            'Un PER élevé = le marché parie sur la croissance future — il faut la délivrer',
            'Comparer le PER à celui du secteur, pas en absolu',
            'PER croissant avec résultat stable = hausse de la prime de valorisation',
            'Pour PME en cession, le PER est moins utilisé que le multiple d\'EBITDA'
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
 * Mapping KPI → ID Glossaire (V3)
 * Map les titres exacts des KPIs du dashboard vers les IDs du glossaire
 * Support V2 + V3 pour rétrocompatibilité
 */
export const KPI_TO_GLOSSARY_MAP: Record<string, string> = {
    // V3 (nouveaux noms)
    "Revenus & Croissance": 'CA',
    "Charges & Contrôle": 'CHARGES',
    "DSO & Cycles Paiement": 'DSO',
    "BFR & Résilience": 'BFR',
    "Cash & Liquidité": 'CASH_FLOW',
    "Marge Brute & Rentabilité": 'MARGE_BRUTE',
    "Marge Nette & Profitabilité": 'MARGE_NETTE',

    // V2 (anciens noms - rétrocompatibilité)
    "Chiffre d'Affaires": 'CA',
    "Charges": 'CHARGES',
    "DSO Clients": 'DSO',
    "BFR Estimé": 'BFR',
    "BFR": 'BFR',
    "Cash Flow Net": 'CASH_FLOW',
    "Marge Brute": 'MARGE_BRUTE',
    "Marge Nette": 'MARGE_NETTE',
    "EBITDA": 'EBITDA',
    "Rotation Stocks": 'ROTATION_STOCKS'
};

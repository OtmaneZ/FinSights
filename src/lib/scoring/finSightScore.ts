/**
 * SCORE FINSIGHT™ - ALGORITHME 0-100
 * Évalue la santé financière globale d'une entreprise
 *
 * 4 Piliers (25 points chacun):
 * 1. CASH (Trésorerie & Runway)
 * 2. MARGIN (Marges & Rentabilité)
 * 3. RESILIENCE (Charges fixes & Dépendance clients)
 * 4. RISK (Anomalies & Volatilité)
 */

import { ProcessedData, FinancialRecord } from '../dataModel';
import { calculateDSOFromTransactions } from '../financialFormulas';
import { detectAnomalies } from '../ml/anomalyDetector';
import { generateSmartRecommendations } from '../ai/recommendations';

export type ScoreLevel = 'critical' | 'warning' | 'good' | 'excellent';
export type ScoreConfidence = 'low' | 'medium' | 'high';

export interface ScoreBreakdown {
    cash: number;           // 0-25 points
    margin: number;         // 0-25 points
    resilience: number;     // 0-25 points
    risk: number;           // 0-25 points
}

export interface DataQualityInfo {
    recordCount: number;
    hasRevenue: boolean;
    hasExpenses: boolean;
    counterpartyRate: number;   // Pourcentage de transactions avec contrepartie
    categoryRate: number;       // Pourcentage de transactions avec catégorie
    timeSpanMonths: number;     // Nombre de mois couverts
}

export interface ValidationResult {
    valid: boolean;
    confidence: ScoreConfidence;
    errors: string[];
    warnings: string[];
    dataQuality: DataQualityInfo;
}

export interface FinSightScore {
    total: number;                  // 0-100
    level: ScoreLevel;
    confidence: ScoreConfidence;    // Confiance dans le score
    breakdown: ScoreBreakdown;
    insights: string[];
    recommendations: string[];
    dataQuality: DataQualityInfo;   // Stats qualité données
    calculatedAt: Date;
}

export interface ScoreFactors {
    // Cash factors
    cashFlowNet: number;
    runway: number;              // Mois de trésorerie restante
    dso: number | null;          // Days Sales Outstanding (nullable if insufficient data)

    // Margin factors
    marginPercentage: number;
    revenueGrowth: number;
    expenseGrowth: number;

    // Resilience factors
    fixedCostsRatio: number;     // % charges fixes / CA
    topClientDependency: number; // % CA du top client
    categoryDiversity: number;   // Nombre de catégories actives

    // Risk factors
    anomalyCount: number;
    criticalAnomalies: number;
    volatility: number;          // Écart-type des flux
}

/**
 * Valide la qualité des données avant calcul du score
 * Retourne erreurs bloquantes + warnings + niveau de confiance
 */
export function validateDataQuality(data: ProcessedData): ValidationResult {
    const { records, kpis, summary } = data;

    const errors: string[] = [];
    const warnings: string[] = [];

    // Compter les éléments
    const recordCount = records.length;
    const revenueRecords = records.filter(r => r.type === 'income');
    const expenseRecords = records.filter(r => r.type === 'expense');
    const withCounterparty = records.filter(r => r.counterparty && r.counterparty !== 'Inconnu');
    const withCategory = records.filter(r => r.category);

    // Calculer totaux
    const totalRevenue = revenueRecords.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = expenseRecords.reduce((sum, r) => sum + Math.abs(r.amount), 0);

    // Calculer période couverte
    const dates = records.map(r => new Date(r.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const timeSpanMonths = Math.max(1, Math.round((maxDate - minDate) / (1000 * 60 * 60 * 24 * 30)));

    // ERREURS BLOQUANTES (score impossible)
    if (recordCount < 10) {
        errors.push(`Minimum 10 transactions requises (actuellement ${recordCount})`);
    }

    if (totalRevenue === 0) {
        errors.push("Aucun revenu détecté dans le fichier");
    }

    if (totalExpenses === 0) {
        errors.push("Aucune charge détectée dans le fichier");
    }

    if (timeSpanMonths < 1) {
        errors.push("Période trop courte (minimum 1 mois de données)");
    }

    // WARNINGS (score possible mais qualité réduite)
    const counterpartyRate = (withCounterparty.length / recordCount) * 100;
    const categoryRate = (withCategory.length / recordCount) * 100;

    if (counterpartyRate < 30) {
        warnings.push("Peu de contreparties identifiées (< 30%)");
    }

    if (categoryRate < 50) {
        warnings.push("Catégories manquantes (< 50% des transactions)");
    }

    if (timeSpanMonths < 3) {
        warnings.push("Historique court (moins de 3 mois)");
    }

    if (recordCount < 30) {
        warnings.push("Peu de transactions (moins de 30)");
    }

    // NIVEAU DE CONFIANCE
    let confidence: ScoreConfidence = 'high';

    if (errors.length > 0) {
        confidence = 'low'; // Données insuffisantes
    } else if (warnings.length >= 3) {
        confidence = 'low'; // Trop de problèmes
    } else if (warnings.length >= 1) {
        confidence = 'medium'; // Quelques problèmes
    }

    const dataQuality: DataQualityInfo = {
        recordCount,
        hasRevenue: totalRevenue > 0,
        hasExpenses: totalExpenses > 0,
        counterpartyRate: Math.round(counterpartyRate),
        categoryRate: Math.round(categoryRate),
        timeSpanMonths
    };

    return {
        valid: errors.length === 0,
        confidence,
        errors,
        warnings,
        dataQuality
    };
}

/**
 * Calcule le Score FinSight™ 0-100
 */
export async function calculateFinSightScore(data: ProcessedData): Promise<FinSightScore> {
    // Valider qualité des données
    const validation = validateDataQuality(data);

    const factors = extractScoreFactors(data);

    const cashScore = calculateCashScore(factors);
    const marginScore = calculateMarginScore(factors);
    const resilienceScore = calculateResilienceScore(factors);
    const riskScore = calculateRiskScore(factors);

    const breakdown: ScoreBreakdown = {
        cash: Math.round(cashScore),
        margin: Math.round(marginScore),
        resilience: Math.round(resilienceScore),
        risk: Math.round(riskScore)
    };

    const total = Math.round(cashScore + marginScore + resilienceScore + riskScore);
    const level = getScoreLevel(total);
    const insights = generateInsights(breakdown, factors, level, validation);

    // 🤖 Générer recommandations IA avec fallback
    let recommendations: string[] = [];
    try {
        const aiResult = await generateSmartRecommendations(
            breakdown,
            factors,
            level,
            data.records
        );

        if (aiResult.success && aiResult.recommendations) {
            recommendations = aiResult.recommendations;
        } else {
            // Fallback: recommandations hardcodées
            recommendations = generateRecommendations(breakdown, factors, level);
        }
    } catch (error) {
        // Silent fallback to hardcoded recommendations in production
        // (Error already logged by AI service layer)
        recommendations = generateRecommendations(breakdown, factors, level);
    }

    return {
        total,
        level,
        confidence: validation.confidence,
        breakdown,
        insights,
        recommendations,
        dataQuality: validation.dataQuality,
        calculatedAt: new Date()
    };
}

/**
 * Extrait les facteurs nécessaires au calcul du score
 */
function extractScoreFactors(data: ProcessedData): ScoreFactors {
    const { kpis, summary, records, qualityMetrics } = data;

    // Cash factors
    const cashFlowNet = summary.netCashFlow;
    const runway = calculateProjectedRunway(records, cashFlowNet); // ✅ AMÉLIORATION 1
    const dso = calculateDSOFromTransactions(records);

    // Margin factors
    const marginPercentage = kpis.marginPercentage;
    const revenueGrowth = kpis.trends?.revenueGrowth ?? 0;
    const expenseGrowth = kpis.trends?.expenseGrowth ?? 0;

    // Resilience factors
    const fixedCostsRatio = calculateSmartFixedCostsRatio(records, kpis.revenue); // ✅ AMÉLIORATION 2
    const topClientDependency = calculateTopClientDependency(records, kpis.revenue);
    const categoryDiversity = summary.categories?.length ?? 0;

    // Risk factors
    const anomalyResult = detectAnomalies(records);
    const anomalyCount = anomalyResult.anomalies.length;
    const criticalAnomalies = anomalyResult.anomalies.filter(a =>
        a.riskLevel === 'critical' || a.riskLevel === 'high'
    ).length;
    const volatility = calculateVolatility(records);

    return {
        cashFlowNet,
        runway,
        dso,
        marginPercentage,
        revenueGrowth,
        expenseGrowth,
        fixedCostsRatio,
        topClientDependency,
        categoryDiversity,
        anomalyCount,
        criticalAnomalies,
        volatility
    };
}

/**
 * 1. SCORE CASH (0-25 points)
 * - Runway > 6 mois = excellent (25pts)
 * - Cash Flow positif = bonus
 * - DSO faible = bonus
 */
function calculateCashScore(factors: ScoreFactors): number {
    let score = 0;

    // Runway (15 points max)
    if (factors.runway >= 12) {
        score += 15; // Excellent: > 1 an de runway
    } else if (factors.runway >= 6) {
        score += 12; // Bon: 6-12 mois
    } else if (factors.runway >= 3) {
        score += 8; // Attention: 3-6 mois
    } else {
        score += 3; // Critique: < 3 mois
    }

    // Cash Flow positif (5 points max)
    if (factors.cashFlowNet > 0) {
        score += 5;
    } else if (factors.cashFlowNet > -50000) {
        score += 2;
    }

    // DSO - Days Sales Outstanding (5 points max)
    if (factors.dso !== null) {
        if (factors.dso <= 30) {
            score += 5; // Excellent: paiements < 30j
        } else if (factors.dso <= 45) {
            score += 3; // Bon: 30-45j
        } else if (factors.dso <= 60) {
            score += 1; // Moyen: 45-60j
        }
        // > 60j = 0 points (problème trésorerie)
    }
    // null = skip DSO scoring (insufficient data)

    return Math.min(25, score);
}

/**
 * 2. SCORE MARGIN (0-25 points)
 * - Marge nette > 15% = excellent
 * - Croissance CA positive = bonus
 * - Contrôle des charges = bonus
 */
function calculateMarginScore(factors: ScoreFactors): number {
    let score = 0;

    // Marge nette (15 points max)
    const margin = factors.marginPercentage;
    if (margin >= 20) {
        score += 15; // Excellent: > 20%
    } else if (margin >= 15) {
        score += 12; // Très bon: 15-20%
    } else if (margin >= 10) {
        score += 9; // Bon: 10-15%
    } else if (margin >= 5) {
        score += 5; // Faible: 5-10%
    } else if (margin >= 0) {
        score += 2; // Très faible: 0-5%
    }
    // Marge négative = 0 points

    // Croissance CA (5 points max)
    if (factors.revenueGrowth >= 15) {
        score += 5; // Forte croissance
    } else if (factors.revenueGrowth >= 5) {
        score += 3; // Croissance modérée
    } else if (factors.revenueGrowth >= 0) {
        score += 1; // Stagnation
    }

    // Contrôle charges (5 points max)
    if (factors.expenseGrowth <= 0) {
        score += 5; // Réduction charges = excellent
    } else if (factors.expenseGrowth < factors.revenueGrowth) {
        score += 3; // Charges < croissance CA = bon
    } else if (factors.expenseGrowth < factors.revenueGrowth * 1.5) {
        score += 1; // Charges contrôlées
    }

    return Math.min(25, score);
}

/**
 * 3. SCORE RESILIENCE (0-25 points)
 * - Charges fixes faibles = meilleur
 * - Diversification clients = meilleur
 * - Diversité catégories = bonus
 */
function calculateResilienceScore(factors: ScoreFactors): number {
    let score = 0;

    // Charges fixes (10 points max)
    const fixedRatio = factors.fixedCostsRatio;
    if (fixedRatio <= 30) {
        score += 10; // Excellent: < 30% charges fixes
    } else if (fixedRatio <= 50) {
        score += 7; // Bon: 30-50%
    } else if (fixedRatio <= 70) {
        score += 4; // Moyen: 50-70%
    } else {
        score += 1; // Risque: > 70%
    }

    // Dépendance client (10 points max)
    const dependency = factors.topClientDependency;
    if (dependency <= 20) {
        score += 10; // Excellent: < 20% du CA sur top client
    } else if (dependency <= 35) {
        score += 7; // Bon: 20-35%
    } else if (dependency <= 50) {
        score += 4; // Risque: 35-50%
    } else {
        score += 1; // Critique: > 50%
    }

    // Diversité catégories (5 points max)
    const diversity = factors.categoryDiversity;
    if (diversity >= 8) {
        score += 5; // Très diversifié
    } else if (diversity >= 5) {
        score += 3; // Diversification correcte
    } else if (diversity >= 3) {
        score += 1; // Peu diversifié
    }

    return Math.min(25, score);
}

/**
 * 4. SCORE RISK (0-25 points)
 * - Peu d'anomalies = meilleur
 * - Pas d'anomalies critiques = bonus
 * - Faible volatilité = bonus
 */
function calculateRiskScore(factors: ScoreFactors): number {
    let score = 25; // On part du max et on déduit

    // Anomalies critiques (-10 points max)
    score -= Math.min(10, factors.criticalAnomalies * 3);

    // Anomalies totales (-5 points max)
    score -= Math.min(5, factors.anomalyCount * 0.5);

    // Volatilité (-10 points max)
    // Volatilité normalisée (0-1) → pénalité 0-10
    const volatilityPenalty = Math.min(10, factors.volatility * 10);
    score -= volatilityPenalty;

    return Math.max(0, Math.round(score));
}

/**
 * ✅ AMÉLIORATION 1: Calcule runway projeté avec tendance (au lieu de moyenne simple)
 */
function calculateProjectedRunway(records: FinancialRecord[], cashFlowNet: number): number {
    if (records.length < 2) {
        // Fallback: moyenne simple si pas assez de données
        const totalExpenses = records
            .filter(r => r.type === 'expense')
            .reduce((sum, r) => sum + Math.abs(r.amount), 0);
        const avgMonthly = totalExpenses / Math.max(1, records.length / 30); // Approx 30 jours/mois
        return avgMonthly > 0 ? Math.max(0, cashFlowNet / avgMonthly) : 12;
    }

    // Grouper charges par mois
    const expensesByMonth = groupExpensesByMonth(records);
    const monthlyExpenses = Object.values(expensesByMonth);

    if (monthlyExpenses.length < 2) {
        const avgMonthly = monthlyExpenses[0] || 1;
        return avgMonthly > 0 ? Math.max(0, cashFlowNet / avgMonthly) : 12;
    }

    // Prendre les 3 derniers mois (ou moins si pas assez)
    const last3Months = monthlyExpenses.slice(-3);
    const avgLast3 = last3Months.reduce((sum, val) => sum + val, 0) / last3Months.length;

    // Calculer tendance: (dernier mois - premier mois) / premier mois
    const firstMonth = last3Months[0];
    const lastMonth = last3Months[last3Months.length - 1];
    const trend = firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) : 0;

    // Projeter charges avec tendance (limitée à ±50% pour éviter aberrations)
    const cappedTrend = Math.max(-0.5, Math.min(0.5, trend));
    const projectedMonthlyBurn = avgLast3 * (1 + cappedTrend);

    return projectedMonthlyBurn > 0 ? Math.max(0, cashFlowNet / projectedMonthlyBurn) : 12;
}

/**
 * Groupe les charges par mois
 */
function groupExpensesByMonth(records: FinancialRecord[]): Record<string, number> {
    const byMonth: Record<string, number> = {};

    records
        .filter(r => r.type === 'expense')
        .forEach(r => {
            const date = new Date(r.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            byMonth[monthKey] = (byMonth[monthKey] || 0) + Math.abs(r.amount);
        });

    return byMonth;
}

/**
 * ✅ AMÉLIORATION 2: Détection intelligente charges fixes (récurrence + stabilité)
 */
function calculateSmartFixedCostsRatio(records: FinancialRecord[], revenue: number): number {
    if (revenue <= 0) return 100;

    // 1. Grouper charges par fournisseur/contrepartie
    const expensesByCounterparty = groupExpensesByCounterparty(records);

    // 2. Identifier charges récurrentes ET stables
    let totalFixedCosts = 0;

    Object.entries(expensesByCounterparty).forEach(([counterparty, transactions]) => {
        if (transactions.length < 2) return; // Pas récurrent

        // Vérifier récurrence (au moins 2 transactions)
        const amounts = transactions.map(t => Math.abs(t.amount));
        const avgAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;

        // Calculer coefficient de variation
        const variance = amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) / amounts.length;
        const stdDev = Math.sqrt(variance);
        const cv = avgAmount > 0 ? stdDev / avgAmount : 1;

        // Charge fixe si: variance < 20% (CV < 0.2)
        if (cv < 0.2) {
            totalFixedCosts += amounts.reduce((sum, a) => sum + a, 0);
        }
    });

    // 3. Ajouter mots-clés évidents (loyer, salaire) même si une seule occurrence
    const keywordFixedCosts = records
        .filter(r => r.type === 'expense')
        .filter(r => {
            const cat = (r.category || '').toLowerCase();
            const desc = (r.description || '').toLowerCase();
            const text = `${cat} ${desc}`;
            return /loyer|salaire|assurance|abonnement/i.test(text);
        })
        .reduce((sum, r) => sum + Math.abs(r.amount), 0);

    // Prendre le max (éviter double comptage)
    const fixedCosts = Math.max(totalFixedCosts, keywordFixedCosts);

    return Math.round((fixedCosts / revenue) * 100);
}

/**
 * Groupe les charges par fournisseur
 */
function groupExpensesByCounterparty(records: FinancialRecord[]): Record<string, FinancialRecord[]> {
    const byCounterparty: Record<string, FinancialRecord[]> = {};

    records
        .filter(r => r.type === 'expense')
        .forEach(r => {
            const key = (r.counterparty || r.description || 'Inconnu').toLowerCase().trim();
            if (!byCounterparty[key]) byCounterparty[key] = [];
            byCounterparty[key].push(r);
        });

    return byCounterparty;
}

/**
 * @deprecated - Ancienne version simple (gardée pour référence)
 * Calcule le ratio charges fixes / CA (méthode mots-clés)
 */
function calculateFixedCostsRatio(records: FinancialRecord[], revenue: number): number {
    if (revenue <= 0) return 100;

    // Catégories considérées comme charges fixes
    const fixedCategories = [
        'loyer', 'loyers', 'salaire', 'salaires', 'assurance', 'assurances',
        'abonnement', 'abonnements', 'charges personnel', 'personnel'
    ];

    const fixedCosts = records
        .filter(r => r.type === 'expense')
        .filter(r => {
            const cat = (r.category || '').toLowerCase();
            return fixedCategories.some(fc => cat.includes(fc));
        })
        .reduce((sum, r) => sum + Math.abs(r.amount), 0);

    return Math.round((fixedCosts / revenue) * 100);
}

/**
 * Calcule la dépendance au top client (% CA)
 */
function calculateTopClientDependency(records: FinancialRecord[], revenue: number): number {
    if (revenue <= 0) return 0;

    // Grouper par client
    const byClient: Record<string, number> = {};
    records
        .filter(r => r.type === 'income')
        .forEach(r => {
            const client = r.counterparty || 'Inconnu';
            byClient[client] = (byClient[client] || 0) + r.amount;
        });

    // Trouver le top client
    const topClientRevenue = Math.max(...Object.values(byClient), 0);

    return Math.round((topClientRevenue / revenue) * 100);
}

/**
 * Calcule la volatilité des flux (écart-type normalisé)
 */
function calculateVolatility(records: FinancialRecord[]): number {
    if (records.length < 3) return 0;

    const amounts = records.map(r => Math.abs(r.amount));
    const mean = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;

    if (mean === 0) return 0;

    const variance = amounts.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // Normaliser: volatilité relative (coefficient de variation)
    const cv = stdDev / mean;

    // Mapper 0-2+ vers 0-1 (volatilité > 2 = max)
    return Math.min(1, cv / 2);
}

/**
 * Détermine le niveau de score
 */
function getScoreLevel(total: number): ScoreLevel {
    if (total >= 80) return 'excellent';
    if (total >= 60) return 'good';
    if (total >= 40) return 'warning';
    return 'critical';
}

/**
 * Génère les insights clés
 */
function generateInsights(
    breakdown: ScoreBreakdown,
    factors: ScoreFactors,
    level: ScoreLevel,
    validation: ValidationResult
): string[] {
    const insights: string[] = [];

    // Ajouter warnings de qualité données en premier
    if (validation.warnings.length > 0) {
        insights.push(`Données ${validation.confidence === 'medium' ? 'partielles' : 'limitées'} : ${validation.warnings[0]}`);
    }

    // Insight global
    if (level === 'excellent') {
        insights.push('Santé financière excellente - Tous les indicateurs sont au vert');
    } else if (level === 'good') {
        insights.push('Santé financière correcte - Quelques axes d\'amélioration identifiés');
    } else if (level === 'warning') {
        insights.push('Santé financière fragile - Actions recommandées rapidement');
    } else {
        insights.push('Situation critique - Nécessite intervention immédiate');
    }

    // Insights par pilier (meilleur et pire)
    const scores = [
        { name: 'Trésorerie', value: breakdown.cash, max: 25 },
        { name: 'Marges', value: breakdown.margin, max: 25 },
        { name: 'Résilience', value: breakdown.resilience, max: 25 },
        { name: 'Risques', value: breakdown.risk, max: 25 }
    ];

    const sorted = scores.sort((a, b) => (b.value / b.max) - (a.value / a.max));

    // Point fort
    const strongest = sorted[0];
    if (strongest.value / strongest.max >= 0.8) {
        insights.push(`💪 Point fort: ${strongest.name} (${strongest.value}/${strongest.max})`);
    }

    // Point faible
    const weakest = sorted[sorted.length - 1];
    if (weakest.value / weakest.max <= 0.5) {
        insights.push(`⚡ Attention: ${weakest.name} nécessite amélioration (${weakest.value}/${weakest.max})`);
    }

    // Insights spécifiques
    if (factors.runway < 3) {
        insights.push(`🔴 Runway critique: ${factors.runway.toFixed(1)} mois de trésorerie`);
    }

    if (factors.marginPercentage < 5) {
        insights.push(`📉 Marge très faible: ${factors.marginPercentage.toFixed(1)}% - Optimisation urgente`);
    }

    if (factors.topClientDependency > 50) {
        insights.push(`⚠️ Dépendance client élevée: ${factors.topClientDependency}% du CA sur 1 client`);
    }

    if (factors.criticalAnomalies > 0) {
        insights.push(`🔍 ${factors.criticalAnomalies} anomalie(s) critique(s) détectée(s)`);
    }

    return insights;
}

/**
 * Génère les recommandations actionnables
 */
function generateRecommendations(
    breakdown: ScoreBreakdown,
    factors: ScoreFactors,
    level: ScoreLevel
): string[] {
    const recommendations: string[] = [];

    // Recommendations basées sur les piliers faibles
    if (breakdown.cash < 15) {
        if (factors.dso !== null && factors.dso > 60) {
            recommendations.push('📞 Relancer les factures en retard > 60 jours');
        }
        if (factors.runway < 6) {
            recommendations.push('💰 Sécuriser trésorerie: ligne crédit ou financement court terme');
        }
        recommendations.push('📊 Optimiser cycle de conversion cash (BFR)');
    }

    if (breakdown.margin < 15) {
        if (factors.marginPercentage < 10) {
            recommendations.push('💡 Réviser grille tarifaire (+5-10% selon clients)');
        }
        if (factors.expenseGrowth > factors.revenueGrowth) {
            recommendations.push('✂️ Audit charges: identifier 10-15% économies possibles');
        }
        recommendations.push('🎯 Focus clients haute marge (analyse ABC)');
    }

    if (breakdown.resilience < 15) {
        if (factors.topClientDependency > 35) {
            recommendations.push('🌐 Diversifier: cibler 3-5 nouveaux clients stratégiques');
        }
        if (factors.fixedCostsRatio > 60) {
            recommendations.push('⚖️ Variabiliser charges fixes (freelance, commission, flex)');
        }
        recommendations.push('🔄 Développer mix produit/services');
    }

    if (breakdown.risk < 15) {
        if (factors.criticalAnomalies > 0) {
            recommendations.push('🔎 Investiguer anomalies critiques identifiées');
        }
        if (factors.volatility > 0.5) {
            recommendations.push('📈 Lisser revenus: modèles récurrents (abonnements, contrats)');
        }
        recommendations.push('🛡️ Mettre en place contrôles internes renforcés');
    }

    // Recommandations générales si bon score
    if (level === 'excellent' || level === 'good') {
        recommendations.push('📊 Maintenir monitoring hebdomadaire des KPIs');
        recommendations.push('🚀 Position favorable pour investissement croissance');
    }

    return recommendations.slice(0, 5); // Max 5 recommandations
}

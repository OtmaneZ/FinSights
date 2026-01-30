/**
 * Simulation Engine - What-If Scenarios
 * Simule l'impact de décisions stratégiques sur les KPIs
 */

import type { 
    FinancialData, 
    KPI, 
    SimulationParams, 
    SimulationResult 
} from './types';

export class SimulationEngine {
    /**
     * Simule l'impact de changements sur les KPIs
     */
    simulate(
        data: FinancialData,
        currentKPIs: KPI[],
        params: SimulationParams
    ): SimulationResult {
        const { chargesReduction = 0, paiementsAcceleration = 0, prixAugmentation = 0 } = params;

        // Extraction valeurs actuelles
        const totalRevenue = data.totalRevenue;
        const totalExpenses = data.totalExpenses;
        const currentMargin = totalRevenue > 0 
            ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 
            : 0;

        // Calcul factures en attente
        const pendingInvoices = data.records
            .filter(r => r.type === 'income' && r.paymentStatus === 'pending')
            .reduce((sum, r) => sum + r.amount, 0);

        // ═══════════════════════════════════════════════════════════════════════
        // SIMULATION 1: Réduction des charges
        // ═══════════════════════════════════════════════════════════════════════
        const newExpenses = totalExpenses * (1 - chargesReduction / 100);
        const savingsExpenses = totalExpenses - newExpenses;
        const newMarginWithReduction = totalRevenue > 0
            ? ((totalRevenue - newExpenses) / totalRevenue) * 100
            : 0;
        const marginDiff = newMarginWithReduction - currentMargin;

        // ═══════════════════════════════════════════════════════════════════════
        // SIMULATION 2: Accélération des paiements
        // ═══════════════════════════════════════════════════════════════════════
        // Hypothèse: accélérer de X jours = libérer (factures_en_attente / 30) * X
        const cashLiberated = (pendingInvoices / 30) * paiementsAcceleration;
        const newCashFlow = data.netCashFlow + cashLiberated;

        // ═══════════════════════════════════════════════════════════════════════
        // SIMULATION 3: Augmentation des prix
        // ═══════════════════════════════════════════════════════════════════════
        const newRevenue = totalRevenue * (1 + prixAugmentation / 100);
        const revenueDiff = newRevenue - totalRevenue;
        const newMarginWithPrice = newRevenue > 0
            ? ((newRevenue - totalExpenses) / newRevenue) * 100
            : 0;

        // ═══════════════════════════════════════════════════════════════════════
        // SIMULATION COMBINÉE (tous paramètres actifs)
        // ═══════════════════════════════════════════════════════════════════════
        const combinedRevenue = newRevenue;
        const combinedExpenses = newExpenses;
        const combinedMargin = combinedRevenue > 0
            ? ((combinedRevenue - combinedExpenses) / combinedRevenue) * 100
            : 0;
        const combinedCashFlow = (combinedRevenue - combinedExpenses) + cashLiberated;

        // ═══════════════════════════════════════════════════════════════════════
        // CRÉATION DES KPIs SIMULÉS
        // ═══════════════════════════════════════════════════════════════════════
        const simulatedKPIs: KPI[] = currentKPIs.map(kpi => {
            // KPI Chiffre d'Affaires
            if (kpi.id === 'revenue' || kpi.title.includes('Chiffre d\'Affaires')) {
                if (prixAugmentation > 0) {
                    return {
                        ...kpi,
                        value: `${Math.round(combinedRevenue).toLocaleString('fr-FR')} €`,
                        numericValue: combinedRevenue,
                        change: `+${Math.round(revenueDiff).toLocaleString('fr-FR')} € (${prixAugmentation}%)`,
                        changeType: 'positive'
                    };
                }
            }

            // KPI Charges
            if (kpi.id === 'expenses' || kpi.title.includes('Charges')) {
                if (chargesReduction > 0) {
                    return {
                        ...kpi,
                        value: `${Math.round(combinedExpenses).toLocaleString('fr-FR')} €`,
                        numericValue: combinedExpenses,
                        change: `-${Math.round(savingsExpenses).toLocaleString('fr-FR')} € (${chargesReduction}%)`,
                        changeType: 'positive'
                    };
                }
            }

            // KPI Marge
            if (kpi.id === 'margin' || kpi.title.includes('Marge')) {
                if (chargesReduction > 0 || prixAugmentation > 0) {
                    return {
                        ...kpi,
                        value: `${combinedMargin.toFixed(1)}%`,
                        numericValue: combinedMargin,
                        change: `+${(combinedMargin - currentMargin).toFixed(1)}% (+${Math.round(savingsExpenses + revenueDiff).toLocaleString('fr-FR')} €)`,
                        changeType: 'positive'
                    };
                }
            }

            // KPI Cash Flow
            if (kpi.id === 'cashflow' || kpi.title.includes('Cash Flow') || kpi.title.includes('Trésorerie')) {
                if (paiementsAcceleration > 0 || chargesReduction > 0 || prixAugmentation > 0) {
                    return {
                        ...kpi,
                        value: `${Math.round(combinedCashFlow).toLocaleString('fr-FR')} €`,
                        numericValue: combinedCashFlow,
                        change: `+${Math.round(combinedCashFlow - data.netCashFlow).toLocaleString('fr-FR')} €`,
                        changeType: 'positive'
                    };
                }
            }

            // KPI non impacté
            return kpi;
        });

        // ═══════════════════════════════════════════════════════════════════════
        // IMPACT SUMMARY
        // ═══════════════════════════════════════════════════════════════════════
        const impact = {
            revenueChange: revenueDiff,
            expensesChange: -savingsExpenses,
            cashFlowChange: combinedCashFlow - data.netCashFlow,
            marginChange: combinedMargin - currentMargin
        };

        // ═══════════════════════════════════════════════════════════════════════
        // SUMMARY TEXT
        // ═══════════════════════════════════════════════════════════════════════
        const summaryParts: string[] = [];

        if (chargesReduction > 0) {
            summaryParts.push(
                `Réduction charges de ${chargesReduction}% = économie de ${Math.round(savingsExpenses).toLocaleString('fr-FR')} €`
            );
        }

        if (paiementsAcceleration > 0) {
            summaryParts.push(
                `Accélération paiements de ${paiementsAcceleration} jours = ${Math.round(cashLiberated).toLocaleString('fr-FR')} € libérés`
            );
        }

        if (prixAugmentation > 0) {
            summaryParts.push(
                `Augmentation prix de ${prixAugmentation}% = +${Math.round(revenueDiff).toLocaleString('fr-FR')} € de CA`
            );
        }

        const summary = summaryParts.length > 0
            ? summaryParts.join(' • ')
            : 'Aucune simulation active';

        return {
            simulatedKPIs,
            impact,
            summary
        };
    }

    /**
     * Simule un seul paramètre pour analyse isolée
     */
    simulateSingle(
        data: FinancialData,
        currentKPIs: KPI[],
        param: 'charges' | 'paiements' | 'prix',
        value: number
    ): SimulationResult {
        const params: SimulationParams = {};

        switch (param) {
            case 'charges':
                params.chargesReduction = value;
                break;
            case 'paiements':
                params.paiementsAcceleration = value;
                break;
            case 'prix':
                params.prixAugmentation = value;
                break;
        }

        return this.simulate(data, currentKPIs, params);
    }

    /**
     * Calcule le meilleur scénario parmi plusieurs options
     */
    findBestScenario(
        data: FinancialData,
        currentKPIs: KPI[],
        scenarios: Array<{ name: string; params: SimulationParams }>
    ): { name: string; result: SimulationResult; score: number }[] {
        const results = scenarios.map(scenario => {
            const result = this.simulate(data, currentKPIs, scenario.params);
            
            // Score = pondération des impacts
            const score = 
                result.impact.revenueChange * 0.3 +
                Math.abs(result.impact.expensesChange) * 0.3 +
                result.impact.cashFlowChange * 0.4;

            return {
                name: scenario.name,
                result,
                score
            };
        });

        // Tri par score décroissant
        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * Valide que les paramètres sont dans les limites acceptables
     */
    validateParams(params: SimulationParams): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (params.chargesReduction !== undefined) {
            if (params.chargesReduction < 0 || params.chargesReduction > 30) {
                errors.push('Réduction charges doit être entre 0 et 30%');
            }
        }

        if (params.paiementsAcceleration !== undefined) {
            if (params.paiementsAcceleration < 0 || params.paiementsAcceleration > 15) {
                errors.push('Accélération paiements doit être entre 0 et 15 jours');
            }
        }

        if (params.prixAugmentation !== undefined) {
            if (params.prixAugmentation < 0 || params.prixAugmentation > 15) {
                errors.push('Augmentation prix doit être entre 0 et 15%');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

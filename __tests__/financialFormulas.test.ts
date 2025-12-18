/**
 * Tests Unitaires - Formules Financières Critiques
 * Objectif : Garantir fiabilité des calculs métier (DSO, BFR, marges)
 */

import {
    calculateNetMargin,
    calculateGrossMargin,
    calculateDSOFromTransactions,
    calculateOperatingCashFlow,
    calculatePeriodVariations,
} from '@/lib/financialFormulas';

describe('Formules Financières Critiques', () => {
    // ============================================
    // 1. MARGE NETTE (Net Margin)
    // ============================================
    describe('calculateNetMargin', () => {
        it('calcule correctement marge nette positive', () => {
            const revenue = 100000;
            const expenses = 70000;
            const margin = calculateNetMargin(revenue, expenses);

            expect(margin).toBe(30); // (100k - 70k) / 100k = 30%
        });

        it('calcule correctement marge nette négative (perte)', () => {
            const revenue = 50000;
            const expenses = 60000;
            const margin = calculateNetMargin(revenue, expenses);

            expect(margin).toBe(-20); // (50k - 60k) / 50k = -20%
        });

        it('retourne 0 si revenue = 0', () => {
            const margin = calculateNetMargin(0, 10000);
            expect(margin).toBe(0);
        });

        it('gère les nombres décimaux', () => {
            const revenue = 12345.67;
            const expenses = 7890.12;
            const margin = calculateNetMargin(revenue, expenses);

            expect(margin).toBeCloseTo(36.09, 1); // ~36.09%
        });
    });

    // ============================================
    // 2. MARGE BRUTE (Gross Margin)
    // ============================================
    describe('calculateGrossMargin', () => {
        it('calcule correctement marge brute', () => {
            const revenue = 100000;
            const cogs = 40000; // Cost of Goods Sold
            const margin = calculateGrossMargin(revenue, cogs);

            expect(margin).toBe(60); // (100k - 40k) / 100k = 60%
        });

        it('retourne 0 si revenue = 0', () => {
            const margin = calculateGrossMargin(0, 5000);
            expect(margin).toBe(0);
        });
    });

    // ============================================
    // 3. DSO (Days Sales Outstanding) - CRITIQUE
    // ============================================
    describe('calculateDSOFromTransactions', () => {
        it('calcule DSO avec créances en retard', () => {
            const now = new Date('2024-01-31');
            const transactions = [
                {
                    id: '1',
                    date: '2024-01-01',
                    amount: 10000,
                    type: 'income' as const,
                    description: 'Facture Client A',
                    counterparty: 'Client A',
                    category: 'Ventes',
                    dueDate: '2024-01-15', // 16 jours de retard
                    isPaid: false,
                },
                {
                    id: '2',
                    date: '2024-01-10',
                    amount: 5000,
                    type: 'income' as const,
                    description: 'Facture Client B',
                    counterparty: 'Client B',
                    category: 'Ventes',
                    dueDate: '2024-01-25', // 6 jours de retard
                    isPaid: false,
                },
            ];

            const result = calculateDSOFromTransactions(transactions, now);

            expect(result.dso).toBeGreaterThan(0);
            expect(result.overdueAmount).toBe(15000);
            expect(result.overdueCount).toBe(2);
        });

        it('retourne DSO = 0 si aucune créance', () => {
            const result = calculateDSOFromTransactions([], new Date());

            expect(result.dso).toBe(0);
            expect(result.overdueAmount).toBe(0);
            expect(result.overdueCount).toBe(0);
        });

        it('ignore transactions sans dueDate', () => {
            const transactions = [
                {
                    id: '1',
                    date: '2024-01-01',
                    amount: 10000,
                    type: 'income' as const,
                    description: 'Vente comptant',
                    counterparty: 'Client',
                    category: 'Ventes',
                    // Pas de dueDate
                },
            ];

            const result = calculateDSOFromTransactions(transactions, new Date());
            expect(result.dso).toBe(0);
        });
    });

    // ============================================
    // 4. CASH-FLOW OPÉRATIONNEL
    // ============================================
    describe('calculateOperatingCashFlow', () => {
        it('calcule cash-flow positif', () => {
            const cashFlow = calculateOperatingCashFlow(100000, 70000);
            expect(cashFlow).toBe(30000);
        });

        it('calcule cash-flow négatif (burn)', () => {
            const cashFlow = calculateOperatingCashFlow(50000, 80000);
            expect(cashFlow).toBe(-30000);
        });

        it('gère revenue = 0', () => {
            const cashFlow = calculateOperatingCashFlow(0, 10000);
            expect(cashFlow).toBe(-10000);
        });
    });

    // ============================================
    // 5. VARIATIONS PÉRIODES (Croissance)
    // ============================================
    describe('calculatePeriodVariations', () => {
        it('calcule variation positive (croissance)', () => {
            const current = 120000;
            const previous = 100000;
            const variation = calculatePeriodVariations(current, previous);

            expect(variation).toBe(20); // +20%
        });

        it('calcule variation négative (décroissance)', () => {
            const current = 80000;
            const previous = 100000;
            const variation = calculatePeriodVariations(current, previous);

            expect(variation).toBe(-20); // -20%
        });

        it('retourne 0 si période précédente = 0', () => {
            const variation = calculatePeriodVariations(50000, 0);
            expect(variation).toBe(0);
        });

        it('gère les nombres décimaux', () => {
            const current = 12500.50;
            const previous = 10000.25;
            const variation = calculatePeriodVariations(current, previous);

            expect(variation).toBeCloseTo(25, 0); // ~25%
        });
    });

    // ============================================
    // 6. CAS LIMITES & EDGE CASES
    // ============================================
    describe('Edge Cases', () => {
        it('gère nombres négatifs dans calculateNetMargin', () => {
            const margin = calculateNetMargin(-1000, 5000);
            expect(margin).toBe(0); // Revenue négatif = invalide
        });

        it('gère très grandes valeurs', () => {
            const revenue = 1_000_000_000; // 1 milliard
            const expenses = 750_000_000;
            const margin = calculateNetMargin(revenue, expenses);

            expect(margin).toBe(25);
        });

        it('gère valeurs très proches de 0', () => {
            const margin = calculateNetMargin(0.01, 0.005);
            expect(margin).toBeCloseTo(50, 0);
        });
    });
});

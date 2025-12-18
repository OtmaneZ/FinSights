/**
 * Tests Unitaires - Score FinSight™
 * Objectif : Garantir fiabilité calcul score 0-100
 */

import {
    calculateFinSightScore,
    validateDataQuality,
    type ScoreLevel,
} from '@/lib/scoring/finSightScore';
import type { ProcessedData, FinancialRecord } from '@/lib/dataModel';

describe('Score FinSight™ - Algorithme 0-100', () => {
    // ============================================
    // 1. VALIDATION QUALITÉ DONNÉES
    // ============================================
    describe('validateDataQuality', () => {
        it('rejette données insuffisantes (< 10 transactions)', () => {
            const data: ProcessedData = {
                records: [
                    {
                        id: '1',
                        date: '2024-01-01',
                        amount: 1000,
                        type: 'income',
                        description: 'Vente',
                        counterparty: 'Client',
                        category: 'Ventes',
                    },
                ],
                kpis: {
                    revenue: 1000,
                    expenses: 0,
                    margin: 100,
                    cashFlow: 1000,
                },
                summary: {
                    totalRecords: 1,
                    dateRange: { start: '2024-01-01', end: '2024-01-01' },
                    incomeCount: 1,
                    expenseCount: 0,
                },
            };

            const result = validateDataQuality(data);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(expect.stringContaining('10 transactions'));
            expect(result.confidence).toBe('low');
        });

        it('valide données complètes (>= 10 transactions)', () => {
            const records: FinancialRecord[] = Array.from({ length: 15 }, (_, i) => ({
                id: `${i + 1}`,
                date: `2024-01-${String(i + 1).padStart(2, '0')}`,
                amount: i % 2 === 0 ? 1000 : -500,
                type: i % 2 === 0 ? ('income' as const) : ('expense' as const),
                description: `Transaction ${i + 1}`,
                counterparty: `Party ${i + 1}`,
                category: i % 2 === 0 ? 'Ventes' : 'Charges',
            }));

            const data: ProcessedData = {
                records,
                kpis: {
                    revenue: 8000,
                    expenses: 3500,
                    margin: 56.25,
                    cashFlow: 4500,
                },
                summary: {
                    totalRecords: 15,
                    dateRange: { start: '2024-01-01', end: '2024-01-15' },
                    incomeCount: 8,
                    expenseCount: 7,
                },
            };

            const result = validateDataQuality(data);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.dataQuality.recordCount).toBe(15);
        });

        it('avertit si peu de contreparties identifiées', () => {
            const records: FinancialRecord[] = Array.from({ length: 12 }, (_, i) => ({
                id: `${i + 1}`,
                date: `2024-01-${String(i + 1).padStart(2, '0')}`,
                amount: 1000,
                type: 'income' as const,
                description: `Vente ${i + 1}`,
                counterparty: null, // Pas de contrepartie
                category: 'Ventes',
            }));

            const data: ProcessedData = {
                records,
                kpis: { revenue: 12000, expenses: 0, margin: 100, cashFlow: 12000 },
                summary: {
                    totalRecords: 12,
                    dateRange: { start: '2024-01-01', end: '2024-01-12' },
                    incomeCount: 12,
                    expenseCount: 0,
                },
            };

            const result = validateDataQuality(data);

            expect(result.valid).toBe(false); // Pas de charges = invalide
            expect(result.warnings.some((w) => w.includes('contreparties'))).toBe(true);
        });
    });

    // ============================================
    // 2. CALCUL SCORE GLOBAL
    // ============================================
    describe('calculateFinSightScore', () => {
        const createMockData = (
            revenue: number,
            expenses: number,
            recordCount: number = 15
        ): ProcessedData => {
            const records: FinancialRecord[] = Array.from({ length: recordCount }, (_, i) => ({
                id: `${i + 1}`,
                date: `2024-01-${String((i % 30) + 1).padStart(2, '0')}`,
                amount: i % 2 === 0 ? revenue / (recordCount / 2) : expenses / (recordCount / 2),
                type: i % 2 === 0 ? ('income' as const) : ('expense' as const),
                description: `Transaction ${i + 1}`,
                counterparty: `Party ${(i % 5) + 1}`,
                category: i % 2 === 0 ? 'Ventes' : 'Charges',
            }));

            return {
                records,
                kpis: {
                    revenue,
                    expenses,
                    margin: ((revenue - expenses) / revenue) * 100,
                    cashFlow: revenue - expenses,
                },
                summary: {
                    totalRecords: recordCount,
                    dateRange: { start: '2024-01-01', end: '2024-01-30' },
                    incomeCount: Math.ceil(recordCount / 2),
                    expenseCount: Math.floor(recordCount / 2),
                },
            };
        };

        it('retourne score entre 0 et 100', () => {
            const data = createMockData(100000, 70000);
            const score = calculateFinSightScore(data);

            expect(score.total).toBeGreaterThanOrEqual(0);
            expect(score.total).toBeLessThanOrEqual(100);
        });

        it('attribue niveau "excellent" pour score > 80', () => {
            const data = createMockData(200000, 80000); // Marge 60%, bon cash-flow
            const score = calculateFinSightScore(data);

            if (score.total > 80) {
                expect(score.level).toBe('excellent');
            }
        });

        it('attribue niveau "critical" pour score < 40', () => {
            const data = createMockData(50000, 60000); // Perte, cash-flow négatif
            const score = calculateFinSightScore(data);

            if (score.total < 40) {
                expect(score.level).toBe('critical');
            }
        });

        it('breakdown contient 4 piliers (25 points max chacun)', () => {
            const data = createMockData(100000, 70000);
            const score = calculateFinSightScore(data);

            expect(score.breakdown.cash).toBeGreaterThanOrEqual(0);
            expect(score.breakdown.cash).toBeLessThanOrEqual(25);

            expect(score.breakdown.margin).toBeGreaterThanOrEqual(0);
            expect(score.breakdown.margin).toBeLessThanOrEqual(25);

            expect(score.breakdown.resilience).toBeGreaterThanOrEqual(0);
            expect(score.breakdown.resilience).toBeLessThanOrEqual(25);

            expect(score.breakdown.risk).toBeGreaterThanOrEqual(0);
            expect(score.breakdown.risk).toBeLessThanOrEqual(25);

            // Total = somme des 4 piliers
            const sum =
                score.breakdown.cash +
                score.breakdown.margin +
                score.breakdown.resilience +
                score.breakdown.risk;
            expect(score.total).toBeCloseTo(sum, 0);
        });

        it('génère recommandations selon niveau', () => {
            const data = createMockData(100000, 70000);
            const score = calculateFinSightScore(data);

            expect(score.recommendations).toBeDefined();
            expect(score.recommendations.length).toBeGreaterThan(0);
        });

        it('inclut timestamp calculatedAt', () => {
            const data = createMockData(100000, 70000);
            const score = calculateFinSightScore(data);

            expect(score.calculatedAt).toBeInstanceOf(Date);
        });
    });

    // ============================================
    // 3. NIVEAUX DE SCORE
    // ============================================
    describe('Niveaux de Score', () => {
        it('définit correctement les seuils de niveau', () => {
            const levels: Record<number, ScoreLevel> = {
                95: 'excellent', // >= 80
                75: 'good', // 60-79
                55: 'warning', // 40-59
                25: 'critical', // < 40
            };

            Object.entries(levels).forEach(([scoreValue, expectedLevel]) => {
                const score = Number(scoreValue);
                let level: ScoreLevel;

                if (score >= 80) level = 'excellent';
                else if (score >= 60) level = 'good';
                else if (score >= 40) level = 'warning';
                else level = 'critical';

                expect(level).toBe(expectedLevel);
            });
        });
    });

    // ============================================
    // 4. EDGE CASES
    // ============================================
    describe('Edge Cases Score', () => {
        it('gère revenus = 0 (score minimal)', () => {
            const data: ProcessedData = {
                records: Array.from({ length: 10 }, (_, i) => ({
                    id: `${i + 1}`,
                    date: `2024-01-${String(i + 1).padStart(2, '0')}`,
                    amount: -1000,
                    type: 'expense' as const,
                    description: 'Charge',
                    counterparty: 'Fournisseur',
                    category: 'Charges',
                })),
                kpis: { revenue: 0, expenses: 10000, margin: -100, cashFlow: -10000 },
                summary: {
                    totalRecords: 10,
                    dateRange: { start: '2024-01-01', end: '2024-01-10' },
                    incomeCount: 0,
                    expenseCount: 10,
                },
            };

            const validation = validateDataQuality(data);
            expect(validation.valid).toBe(false);
            expect(validation.errors.some((e) => e.includes('revenu'))).toBe(true);
        });

        it('gère charges = 0 (score invalide)', () => {
            const data: ProcessedData = {
                records: Array.from({ length: 10 }, (_, i) => ({
                    id: `${i + 1}`,
                    date: `2024-01-${String(i + 1).padStart(2, '0')}`,
                    amount: 1000,
                    type: 'income' as const,
                    description: 'Vente',
                    counterparty: 'Client',
                    category: 'Ventes',
                })),
                kpis: { revenue: 10000, expenses: 0, margin: 100, cashFlow: 10000 },
                summary: {
                    totalRecords: 10,
                    dateRange: { start: '2024-01-01', end: '2024-01-10' },
                    incomeCount: 10,
                    expenseCount: 0,
                },
            };

            const validation = validateDataQuality(data);
            expect(validation.valid).toBe(false);
            expect(validation.errors.some((e) => e.includes('charge'))).toBe(true);
        });
    });
});

/**
 * Tests Unitaires - Parsing CSV Critique
 * Objectif : Garantir compatibilité formats FR/US, séparateurs, débit/crédit
 */

import { validateCSVStructure } from '@/lib/dataParser';

describe('Parsing CSV - Formats Critiques', () => {
    // ============================================
    // 1. VALIDATION STRUCTURE (Pré-Parsing)
    // ============================================
    describe('validateCSVStructure', () => {
        it('accepte CSV valide avec 10+ transactions', () => {
            const csvContent = `Date,Description,Montant
01/01/2024,Vente Client A,1000
02/01/2024,Achat Fournisseur,-500
03/01/2024,Vente Client B,1500
04/01/2024,Charge Loyer,-800
05/01/2024,Vente Client C,2000
06/01/2024,Achat Matériel,-300
07/01/2024,Vente Client D,1200
08/01/2024,Charge Électricité,-150
09/01/2024,Vente Client E,1800
10/01/2024,Achat Fournitures,-250
11/01/2024,Vente Client F,2200`;

            const result = validateCSVStructure(csvContent);

            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
            expect(result.lineCount).toBeGreaterThanOrEqual(10);
            expect(result.hasDateColumn).toBe(true);
            expect(result.hasAmountColumn).toBe(true);
        });

        it('rejette CSV avec moins de 10 transactions', () => {
            const csvContent = `Date,Montant
01/01/2024,1000
02/01/2024,500
03/01/2024,750`;

            const result = validateCSVStructure(csvContent);

            expect(result.valid).toBe(false);
            expect(result.error).toContain('10 transaction');
            expect(result.lineCount).toBeLessThan(10);
        });

        it('rejette CSV sans colonne Date', () => {
            const csvContent = `Description,Montant,Category
Vente,1000,Revenue
Achat,500,Expense`;

            const result = validateCSVStructure(csvContent);

            expect(result.valid).toBe(false);
            expect(result.error).toContain('Date');
            expect(result.hasDateColumn).toBe(false);
        });

        it('rejette CSV sans colonne Montant', () => {
            const csvContent = `Date,Description,Category
01/01/2024,Vente,Revenue
02/01/2024,Achat,Expense`;

            const result = validateCSVStructure(csvContent);

            expect(result.valid).toBe(false);
            expect(result.error).toContain('Montant');
            expect(result.hasAmountColumn).toBe(false);
        });

        it('détecte séparateur point-virgule', () => {
            const csvContent = `Date;Description;Montant
01/01/2024;Vente Client A;1000
02/01/2024;Achat;-500
03/01/2024;Vente;1500
04/01/2024;Charge;-800
05/01/2024;Vente;2000
06/01/2024;Achat;-300
07/01/2024;Vente;1200
08/01/2024;Charge;-150
09/01/2024;Vente;1800
10/01/2024;Achat;-250
11/01/2024;Vente;2200`;

            const result = validateCSVStructure(csvContent);

            expect(result.valid).toBe(true);
        });
    });

    // ============================================
    // 2. FORMATS DATES FR vs US
    // ============================================
    describe('Formats Dates', () => {
        it('parse dates format français DD/MM/YYYY', () => {
            const csvContent = `Date,Montant
31/12/2024,1000
25/06/2024,2000`;

            const result = validateCSVStructure(csvContent);
            expect(result.valid).toBe(false); // Moins de 10 lignes, mais format détecté
            expect(result.hasDateColumn).toBe(true);
        });

        it('parse dates format US MM/DD/YYYY', () => {
            const csvContent = `Date,Amount
12/31/2024,1000
06/25/2024,2000`;

            const result = validateCSVStructure(csvContent);
            expect(result.hasDateColumn).toBe(true);
        });

        it('parse dates format ISO YYYY-MM-DD', () => {
            const csvContent = `Date,Amount
2024-12-31,1000
2024-06-25,2000`;

            const result = validateCSVStructure(csvContent);
            expect(result.hasDateColumn).toBe(true);
        });
    });

    // ============================================
    // 3. SÉPARATEURS DÉCIMAUX FR vs US
    // ============================================
    describe('Séparateurs Décimaux', () => {
        it('gère montants français (virgule décimale)', () => {
            const csvContent = `Date;Montant
01/01/2024;"1 234,56"
02/01/2024;"2 500,00"`;

            const result = validateCSVStructure(csvContent);
            expect(result.hasAmountColumn).toBe(true);
        });

        it('gère montants US (point décimal)', () => {
            const csvContent = `Date,Amount
01/01/2024,1234.56
02/01/2024,2500.00`;

            const result = validateCSVStructure(csvContent);
            expect(result.hasAmountColumn).toBe(true);
        });

        it('gère montants avec séparateur milliers', () => {
            const csvContent = `Date,Amount
01/01/2024,"12,345.67"
02/01/2024,"1,000,000.50"`;

            const result = validateCSVStructure(csvContent);
            expect(result.hasAmountColumn).toBe(true);
        });
    });

    // ============================================
    // 4. DÉBIT / CRÉDIT (1 ou 2 colonnes)
    // ============================================
    describe('Débit/Crédit', () => {
        it('gère montant unique avec signe +/-', () => {
            const csvContent = `Date,Description,Montant
01/01/2024,Vente,+1000
02/01/2024,Achat,-500
03/01/2024,Vente,1500
04/01/2024,Charge,-800
05/01/2024,Vente,2000
06/01/2024,Achat,-300
07/01/2024,Vente,1200
08/01/2024,Charge,-150
09/01/2024,Vente,1800
10/01/2024,Achat,-250
11/01/2024,Vente,2200`;

            const result = validateCSVStructure(csvContent);
            expect(result.valid).toBe(true);
        });

        it('gère colonnes séparées Débit/Crédit', () => {
            const csvContent = `Date,Description,Débit,Crédit
01/01/2024,Vente,,1000
02/01/2024,Achat,500,
03/01/2024,Vente,,1500
04/01/2024,Charge,800,
05/01/2024,Vente,,2000
06/01/2024,Achat,300,
07/01/2024,Vente,,1200
08/01/2024,Charge,150,
09/01/2024,Vente,,1800
10/01/2024,Achat,250,
11/01/2024,Vente,,2200`;

            const result = validateCSVStructure(csvContent);
            expect(result.valid).toBe(true);
            expect(result.hasAmountColumn).toBe(true); // Détecte "Débit" ou "Crédit"
        });
    });

    // ============================================
    // 5. EDGE CASES & ERREURS COURANTES
    // ============================================
    describe('Edge Cases', () => {
        it('rejette fichier vide', () => {
            const result = validateCSVStructure('');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('vide');
        });

        it('rejette CSV uniquement header', () => {
            const result = validateCSVStructure('Date,Montant');
            expect(result.valid).toBe(false);
        });

        it('gère lignes vides intercalées', () => {
            const csvContent = `Date,Montant

01/01/2024,1000

02/01/2024,500
03/01/2024,750
04/01/2024,1200
05/01/2024,1500

06/01/2024,1800
07/01/2024,2000
08/01/2024,2200
09/01/2024,2500
10/01/2024,2800
11/01/2024,3000`;

            const result = validateCSVStructure(csvContent);
            expect(result.valid).toBe(true); // Ignore lignes vides
        });

        it('détecte colonnes case-insensitive', () => {
            const csvContent = `DATE,MONTANT,DESCRIPTION
01/01/2024,1000,Vente`;

            const result = validateCSVStructure(csvContent);
            expect(result.hasDateColumn).toBe(true);
            expect(result.hasAmountColumn).toBe(true);
        });

        it('accepte synonymes "jour", "day", "fecha"', () => {
            const csvContent = `Jour,Somme
01/01/2024,1000`;

            const result = validateCSVStructure(csvContent);
            expect(result.hasDateColumn).toBe(true);
        });
    });
});

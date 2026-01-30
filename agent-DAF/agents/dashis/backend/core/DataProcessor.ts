/**
 * Data Processor - Transformation et préparation des données
 * Gère la validation, le nettoyage et la structuration des données
 */

import type { FinancialRecord, FinancialData } from './types';

export class DataProcessor {
    /**
     * Transforme les données brutes en FinancialData structuré
     */
    process(rawRecords: any[]): FinancialData {
        // 1. Validation et nettoyage
        const cleanedRecords = this.cleanRecords(rawRecords);
        
        // 2. Tri chronologique
        const sortedRecords = this.sortRecords(cleanedRecords);
        
        // 3. Calculs agrégés
        const totalRevenue = this.calculateTotal(sortedRecords, 'income');
        const totalExpenses = this.calculateTotal(sortedRecords, 'expense');
        const netCashFlow = totalRevenue - totalExpenses;
        
        // 4. Période
        const period = this.calculatePeriod(sortedRecords);
        
        return {
            records: sortedRecords,
            totalRevenue,
            totalExpenses,
            netCashFlow,
            period
        };
    }

    /**
     * Nettoie et valide les enregistrements
     */
    private cleanRecords(rawRecords: any[]): FinancialRecord[] {
        return rawRecords
            .filter(record => this.isValidRecord(record))
            .map(record => this.normalizeRecord(record));
    }

    /**
     * Valide qu'un enregistrement a les champs minimum requis
     */
    private isValidRecord(record: any): boolean {
        return !!(
            record &&
            record.date &&
            record.type &&
            typeof record.amount === 'number' &&
            record.amount > 0
        );
    }

    /**
     * Normalise un enregistrement au format FinancialRecord
     */
    private normalizeRecord(record: any): FinancialRecord {
        return {
            date: this.normalizeDate(record.date),
            type: this.normalizeType(record.type),
            amount: Math.abs(record.amount),
            category: record.category || record.categorie || undefined,
            client: record.client || record.counterparty || record.contrepartie || undefined,
            description: record.description || record.libelle || undefined,
            invoiceId: record.invoiceId || record.invoice_id || undefined,
            status: this.normalizeStatus(record.status || record.statut),
            dueDate: record.dueDate || record.due_date || record.dateEcheance || undefined
        };
    }

    /**
     * Normalise une date au format ISO
     */
    private normalizeDate(date: any): string {
        if (typeof date === 'string') {
            // Déjà au format ISO
            if (date.match(/^\d{4}-\d{2}-\d{2}/)) {
                return date;
            }
            
            // Format français DD/MM/YYYY
            if (date.match(/^\d{2}\/\d{2}\/\d{4}/)) {
                const [day, month, year] = date.split('/');
                return `${year}-${month}-${day}`;
            }
        }
        
        // Fallback: créer Date et convertir
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    /**
     * Normalise le type de transaction
     */
    private normalizeType(type: any): 'income' | 'expense' {
        if (typeof type !== 'string') return 'expense';
        
        const t = type.toLowerCase();
        if (t.includes('income') || t.includes('revenu') || t.includes('recette') || t.includes('vente')) {
            return 'income';
        }
        if (t.includes('expense') || t.includes('charge') || t.includes('dépense') || t.includes('achat')) {
            return 'expense';
        }
        
        return 'expense'; // Par défaut
    }

    /**
     * Normalise le statut de paiement
     */
    private normalizeStatus(status: any): 'paid' | 'pending' | 'overdue' | undefined {
        if (!status) return undefined;
        
        const s = status.toLowerCase();
        if (s.includes('paid') || s.includes('payé') || s.includes('reglé')) {
            return 'paid';
        }
        if (s.includes('pending') || s.includes('attente') || s.includes('en cours')) {
            return 'pending';
        }
        if (s.includes('overdue') || s.includes('retard') || s.includes('impayé')) {
            return 'overdue';
        }
        
        return undefined;
    }

    /**
     * Trie les enregistrements par date (chronologique)
     */
    private sortRecords(records: FinancialRecord[]): FinancialRecord[] {
        return [...records].sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    }

    /**
     * Calcule le total pour un type de transaction
     */
    private calculateTotal(records: FinancialRecord[], type: 'income' | 'expense'): number {
        return records
            .filter(r => r.type === type)
            .reduce((sum, r) => sum + r.amount, 0);
    }

    /**
     * Calcule la période couverte par les données
     */
    private calculatePeriod(records: FinancialRecord[]): { start: Date; end: Date } {
        if (records.length === 0) {
            const now = new Date();
            return { start: now, end: now };
        }

        const dates = records.map(r => new Date(r.date).getTime());
        const start = new Date(Math.min(...dates));
        const end = new Date(Math.max(...dates));

        return { start, end };
    }

    /**
     * Valide la qualité des données
     */
    validateQuality(data: FinancialData): {
        valid: boolean;
        quality: 'high' | 'medium' | 'low';
        issues: string[];
    } {
        const issues: string[] = [];
        
        // Vérifier nombre minimum d'enregistrements
        if (data.records.length < 10) {
            issues.push('Moins de 10 transactions (données insuffisantes)');
        }
        
        // Vérifier présence de revenus ET dépenses
        const hasRevenue = data.records.some(r => r.type === 'income');
        const hasExpenses = data.records.some(r => r.type === 'expense');
        
        if (!hasRevenue) {
            issues.push('Aucun revenu détecté');
        }
        if (!hasExpenses) {
            issues.push('Aucune charge détectée');
        }
        
        // Vérifier période couverte (minimum 1 mois)
        const periodDays = (data.period.end.getTime() - data.period.start.getTime()) / (1000 * 60 * 60 * 24);
        if (periodDays < 30) {
            issues.push('Période couverte < 1 mois');
        }
        
        // Vérifier présence de catégories
        const withCategory = data.records.filter(r => r.category).length;
        const categoryRate = withCategory / data.records.length;
        if (categoryRate < 0.5) {
            issues.push('Moins de 50% des transactions ont une catégorie');
        }
        
        // Déterminer qualité globale
        let quality: 'high' | 'medium' | 'low';
        if (issues.length === 0 && data.records.length > 50 && categoryRate > 0.8) {
            quality = 'high';
        } else if (issues.length <= 2 && data.records.length > 20) {
            quality = 'medium';
        } else {
            quality = 'low';
        }
        
        return {
            valid: hasRevenue && hasExpenses && data.records.length >= 10,
            quality,
            issues
        };
    }

    /**
     * Enrichit les données avec des métadonnées calculées
     */
    enrich(data: FinancialData): FinancialData & { 
        metadata: {
            avgTransactionAmount: number;
            transactionCount: number;
            uniqueCategories: number;
            uniqueClients: number;
        }
    } {
        const records = data.records;
        
        const avgTransactionAmount = records.length > 0
            ? records.reduce((sum, r) => sum + r.amount, 0) / records.length
            : 0;
        
        const uniqueCategories = new Set(
            records.filter(r => r.category).map(r => r.category)
        ).size;
        
        const uniqueClients = new Set(
            records.filter(r => r.client).map(r => r.client)
        ).size;
        
        return {
            ...data,
            metadata: {
                avgTransactionAmount,
                transactionCount: records.length,
                uniqueCategories,
                uniqueClients
            }
        };
    }
}

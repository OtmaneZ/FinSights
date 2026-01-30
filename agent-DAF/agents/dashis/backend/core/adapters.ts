/**
 * DASHIS Agent - Type Adapters
 * 
 * Adapters pour convertir entre les types de l'agent et les types du projet.
 * Garantit la compatibilité robuste entre les différents formats de données.
 */

import type { FinancialRecord } from '@/lib/dataModel';

/**
 * Convertit les données brutes (upload CSV/Excel) en FinancialRecord du projet
 * Gère les conversions de types (string → Date, etc.)
 */
export function normalizeFinancialRecord(raw: any): FinancialRecord {
    // Générer un ID unique si manquant
    const id = raw.id || `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Convertir date (string ou Date → Date)
    const date = raw.date instanceof Date 
        ? raw.date 
        : new Date(raw.date);
    
    // Convertir dueDate si présente
    const dueDate = raw.dueDate 
        ? (raw.dueDate instanceof Date ? raw.dueDate : new Date(raw.dueDate))
        : undefined;
    
    return {
        id,
        date,
        description: raw.description || raw.client || raw.counterparty || 'N/A',
        amount: Number(raw.amount) || 0,
        type: raw.type || 'expense',
        category: raw.category,
        subcategory: raw.subcategory,
        account: raw.account,
        reference: raw.invoiceId || raw.reference,
        counterparty: raw.counterparty || raw.client,
        sourceId: raw.sourceId || 'dashis-agent',
        rawData: raw.rawData || raw,
        confidence: raw.confidence ?? 1.0,
        dueDate,
        paymentStatus: raw.status || raw.paymentStatus
    };
}

/**
 * Convertit un tableau de données brutes en FinancialRecord[]
 */
export function normalizeFinancialRecords(rawRecords: any[]): FinancialRecord[] {
    return rawRecords.map(normalizeFinancialRecord);
}

/**
 * Extrait les propriétés essentielles d'un FinancialRecord pour le logging
 */
export function serializeFinancialRecord(record: FinancialRecord): any {
    return {
        id: record.id,
        date: record.date.toISOString().split('T')[0],
        amount: record.amount,
        type: record.type,
        category: record.category,
        counterparty: record.counterparty,
        description: record.description
    };
}

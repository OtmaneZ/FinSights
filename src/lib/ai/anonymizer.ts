/**
 * Utility for anonymizing sensitive financial data before sending to AI
 * Focuses on French accounting patterns (IBAN, SIREN, Names, Emails)
 */

export interface AnonymizedRecord {
    date: string;
    description: string;
    amount: number;
    type: string;
    category?: string;
    counterparty?: string;
}

/**
 * Scrub sensitive information from a string
 */
export function scrubText(text: string): string {
    if (!text) return text;

    let scrubbed = text;

    // 1. IBAN (French & International)
    const ibanRegex = /[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}/gi;
    scrubbed = scrubbed.replace(ibanRegex, '[IBAN_ANONYMIZED]');

    // 2. Emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    scrubbed = scrubbed.replace(emailRegex, '[EMAIL_ANONYMIZED]');

    // 3. SIREN / SIRET (9 or 14 digits)
    const siretRegex = /\b\d{9}\b|\b\d{14}\b/g;
    scrubbed = scrubbed.replace(siretRegex, '[ID_ENTREPRISE]');

    // 4. Phone numbers (French format)
    const phoneRegex = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/g;
    scrubbed = scrubbed.replace(phoneRegex, '[PHONE_ANONYMIZED]');

    return scrubbed;
}

/**
 * Anonymize a list of financial records
 */
export function anonymizeFinancialData(records: any[]): AnonymizedRecord[] {
    if (!records || !Array.isArray(records)) return [];

    // Map of real names to generic labels to maintain consistency in AI analysis
    // e.g. "Jean Dupont" -> "Client_A", "Jean Dupont" again -> "Client_A"
    const counterpartyMap = new Map<string, string>();
    let clientCounter = 1;
    let supplierCounter = 1;

    return records.map(record => {
        const type = record.type || 'unknown';
        let counterparty = record.counterparty || '';
        let description = record.description || '';

        // Anonymize counterparty while keeping consistency
        if (counterparty) {
            if (!counterpartyMap.has(counterparty)) {
                const label = type === 'income'
                    ? `CLIENT_${String.fromCharCode(64 + clientCounter++)}`
                    : `FOURNISSEUR_${supplierCounter++}`;
                counterpartyMap.set(counterparty, label);
            }
            counterparty = counterpartyMap.get(counterparty)!;
        }

        return {
            date: record.date instanceof Date ? record.date.toISOString().split('T')[0] : String(record.date),
            description: scrubText(description),
            amount: record.amount,
            type: type,
            category: record.category,
            counterparty: counterparty
        };
    });
}

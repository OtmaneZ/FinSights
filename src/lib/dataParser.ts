// Utilitaires avancés pour parser les données financières
// Version robuste avec détection intelligente et validation

import {
    FinancialRecord,
    ProcessedData,
    DataSummary,
    FinancialKPIs,
    DataQuality,
    ColumnDetectionResult,
    ColumnMapping,
    ParseConfig,
    ParseResult,
    ParseError,
    DataAnomaly,
    RawDataRow,
    CategorySummary,
    FINANCIAL_CATEGORIES,
    DATE_FORMATS,
    CURRENCY_PATTERNS
} from './dataModel';

// Configuration par défaut
const DEFAULT_CONFIG: ParseConfig = {
    delimiter: ',',
    hasHeader: true,
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: '€',
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    encoding: 'utf-8'
};

// Parse CSV robuste avec détection automatique
export function parseCSV(csvText: string, config: ParseConfig = DEFAULT_CONFIG): ParseResult {
    const errors: ParseError[] = [];
    const warnings: string[] = [];

    try {
        // Détection du délimiteur si pas spécifié
        const detectedConfig = { ...config };
        if (!config.delimiter) {
            detectedConfig.delimiter = detectDelimiter(csvText);
        }

        const lines = csvText.split('\n').filter(line => line.trim().length > 0);
        if (lines.length < 2) {
            errors.push({
                row: 0,
                column: 'general',
                message: 'Fichier vide ou avec moins de 2 lignes',
                severity: 'error'
            });
            return { success: false, errors, warnings, config: detectedConfig, detectedMappings: [] };
        }

        // Parse header
        const headers = parseCSVLine(lines[0], detectedConfig.delimiter);

        // Détection automatique des colonnes
        const detectedMappings = detectColumns(headers, lines.slice(1, 6), detectedConfig);

        if (detectedMappings.length === 0) {
            errors.push({
                row: 0,
                column: 'general',
                message: 'Aucune colonne de données financières détectée',
                severity: 'error'
            });
            return { success: false, errors, warnings, config: detectedConfig, detectedMappings };
        }

        // Parse des données
        const records = parseRecords(lines, headers, detectedMappings, detectedConfig, errors);

        if (records.length === 0) {
            errors.push({
                row: 0,
                column: 'general',
                message: 'Aucun enregistrement valide trouvé',
                severity: 'error'
            });
            return { success: false, errors, warnings, config: detectedConfig, detectedMappings };
        }

        // Traitement et validation
        const processedData = processFinancialData(records, 'csv-import');

        return {
            success: true,
            data: processedData,
            errors,
            warnings,
            config: detectedConfig,
            detectedMappings
        };

    } catch (error) {
        errors.push({
            row: 0,
            column: 'general',
            message: `Erreur de parsing: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
            severity: 'error'
        });
        return { success: false, errors, warnings, config, detectedMappings: [] };
    }
}

// Parse une ligne CSV en gérant les guillemets
function parseCSVLine(line: string, delimiter: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

// Détection automatique du délimiteur
function detectDelimiter(csvText: string): string {
    const sample = csvText.split('\n').slice(0, 5).join('\n');
    const delimiters = [',', ';', '\t', '|'];

    let bestDelimiter = ',';
    let maxColumns = 0;

    for (const delimiter of delimiters) {
        const lines = sample.split('\n');
        const columnCounts = lines.map(line => line.split(delimiter).length);
        const avgColumns = columnCounts.reduce((a, b) => a + b, 0) / columnCounts.length;

        if (avgColumns > maxColumns && avgColumns >= 2) {
            maxColumns = avgColumns;
            bestDelimiter = delimiter;
        }
    }

    return bestDelimiter;
}

// Détection intelligente des colonnes
function detectColumns(headers: string[], sampleData: string[], config: ParseConfig): ColumnMapping[] {
    const mappings: ColumnMapping[] = [];

    headers.forEach((header, index) => {
        const headerLower = header.toLowerCase().trim();
        const samples = sampleData.map(line => parseCSVLine(line, config.delimiter)[index]).filter(v => v);

        // Détection de la colonne date
        if (isDateColumn(headerLower, samples)) {
            mappings.push({
                sourceColumn: header,
                targetField: 'date',
                confidence: calculateDateConfidence(headerLower, samples),
                dataType: 'date'
            });
        }

        // Détection de la colonne montant
        else if (isAmountColumn(headerLower, samples)) {
            mappings.push({
                sourceColumn: header,
                targetField: 'amount',
                confidence: calculateAmountConfidence(headerLower, samples),
                dataType: 'currency'
            });
        }

        // Détection de la colonne description
        else if (isDescriptionColumn(headerLower, samples)) {
            mappings.push({
                sourceColumn: header,
                targetField: 'description',
                confidence: calculateDescriptionConfidence(headerLower, samples),
                dataType: 'string'
            });
        }

        // Détection autres colonnes
        else if (isAccountColumn(headerLower)) {
            mappings.push({
                sourceColumn: header,
                targetField: 'account',
                confidence: 0.8,
                dataType: 'string'
            });
        }

        else if (isReferenceColumn(headerLower)) {
            mappings.push({
                sourceColumn: header,
                targetField: 'reference',
                confidence: 0.7,
                dataType: 'string'
            });
        }
    });

    return mappings.sort((a, b) => b.confidence - a.confidence);
}
// Fonctions de détection des types de colonnes
function isDateColumn(header: string, samples: string[]): boolean {
    const dateKeywords = ['date', 'datum', 'période', 'period', 'time', 'temps'];
    const hasDateKeyword = dateKeywords.some(keyword => header.includes(keyword));

    if (hasDateKeyword) return true;

    // Test sur les échantillons
    const dateMatches = samples.filter(sample => {
        const cleaned = sample.replace(/[^\d\/\-\.]/g, '');
        return /\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4}/.test(cleaned);
    });

    return dateMatches.length / samples.length > 0.6;
}

function isAmountColumn(header: string, samples: string[]): boolean {
    const amountKeywords = ['amount', 'montant', 'valeur', 'value', 'sum', 'total', 'prix', 'price'];
    const hasAmountKeyword = amountKeywords.some(keyword => header.includes(keyword));

    if (hasAmountKeyword) return true;

    // Test sur les échantillons
    const numberMatches = samples.filter(sample => {
        const cleaned = sample.replace(/[€$£,\s]/g, '').replace(',', '.');
        return !isNaN(parseFloat(cleaned));
    });

    return numberMatches.length / samples.length > 0.8;
}

function isDescriptionColumn(header: string, samples: string[]): boolean {
    const descKeywords = ['description', 'libellé', 'libelle', 'desc', 'label', 'motif', 'raison'];
    const hasDescKeyword = descKeywords.some(keyword => header.includes(keyword));

    if (hasDescKeyword) return true;

    // Test sur les échantillons - recherche de texte varié
    const avgLength = samples.reduce((acc, sample) => acc + sample.length, 0) / samples.length;
    return avgLength > 10; // Descriptions généralement > 10 caractères
}

function isAccountColumn(header: string): boolean {
    const accountKeywords = ['account', 'compte', 'iban', 'rib'];
    return accountKeywords.some(keyword => header.includes(keyword));
}

function isReferenceColumn(header: string): boolean {
    const refKeywords = ['reference', 'ref', 'id', 'transaction', 'numero', 'number'];
    return refKeywords.some(keyword => header.includes(keyword));
}

// Fonctions de calcul de confiance
function calculateDateConfidence(header: string, samples: string[]): number {
    const dateKeywords = ['date', 'datum', 'période', 'period'];
    let confidence = 0.5;

    if (dateKeywords.some(keyword => header.includes(keyword))) {
        confidence += 0.3;
    }

    const validDates = samples.filter(sample => {
        const parsed = parseDate(sample);
        return parsed !== null;
    });

    confidence += (validDates.length / samples.length) * 0.2;
    return Math.min(confidence, 1);
}

function calculateAmountConfidence(header: string, samples: string[]): number {
    const amountKeywords = ['amount', 'montant', 'valeur', 'value'];
    let confidence = 0.5;

    if (amountKeywords.some(keyword => header.includes(keyword))) {
        confidence += 0.3;
    }

    const validNumbers = samples.filter(sample => {
        const parsed = parseAmount(sample);
        return !isNaN(parsed);
    });

    confidence += (validNumbers.length / samples.length) * 0.2;
    return Math.min(confidence, 1);
}

function calculateDescriptionConfidence(header: string, samples: string[]): number {
    const descKeywords = ['description', 'libellé', 'desc', 'label'];
    let confidence = 0.4;

    if (descKeywords.some(keyword => header.includes(keyword))) {
        confidence += 0.4;
    }

    const avgLength = samples.reduce((acc, sample) => acc + sample.length, 0) / samples.length;
    if (avgLength > 15) confidence += 0.2;

    return Math.min(confidence, 1);
}

// Parse des enregistrements
function parseRecords(
    lines: string[],
    headers: string[],
    mappings: ColumnMapping[],
    config: ParseConfig,
    errors: ParseError[]
): FinancialRecord[] {
    const records: FinancialRecord[] = [];

    // Création de la map des colonnes
    const columnMap = new Map<keyof FinancialRecord, number>();
    mappings.forEach(mapping => {
        const columnIndex = headers.findIndex(h => h === mapping.sourceColumn);
        if (columnIndex >= 0) {
            columnMap.set(mapping.targetField, columnIndex);
        }
    });

    // Parse chaque ligne de données
    for (let i = 1; i < lines.length; i++) {
        try {
            const cols = parseCSVLine(lines[i], config.delimiter);
            if (cols.length < headers.length) continue;

            // Extraction des champs obligatoires
            const dateCol = columnMap.get('date');
            const amountCol = columnMap.get('amount');
            const descCol = columnMap.get('description');

            if (dateCol === undefined || amountCol === undefined) continue;

            const dateValue = parseDate(cols[dateCol]);
            const amountValue = parseAmount(cols[amountCol]);

            if (!dateValue || isNaN(amountValue)) {
                errors.push({
                    row: i + 1,
                    column: dateCol === undefined ? 'amount' : 'date',
                    message: 'Valeur invalide',
                    severity: 'warning'
                });
                continue;
            }

            const record: FinancialRecord = {
                id: `record-${Date.now()}-${i}`,
                date: dateValue,
                description: descCol !== undefined ? cols[descCol].trim() : `Transaction ${i}`,
                amount: Math.abs(amountValue),
                type: amountValue >= 0 ? 'income' : 'expense',
                sourceId: 'csv-import',
                confidence: 0.8,
                rawData: {}
            };

            // Ajout des champs optionnels
            const accountCol = columnMap.get('account');
            if (accountCol !== undefined && cols[accountCol]) {
                record.account = cols[accountCol].trim();
            }

            const referenceCol = columnMap.get('reference');
            if (referenceCol !== undefined && cols[referenceCol]) {
                record.reference = cols[referenceCol].trim();
            }

            records.push(record);

        } catch (error) {
            errors.push({
                row: i + 1,
                column: 'general',
                message: `Erreur de parsing: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
                severity: 'warning'
            });
        }
    }

    return records;
}

// Utilitaires de parsing
function parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.trim() === '') return null;

    const cleaned = dateStr.trim();

    // Essai de différents formats
    const formats = [
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,  // DD/MM/YYYY
        /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,  // YYYY/MM/DD
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/   // DD/MM/YY
    ];

    for (const format of formats) {
        const match = cleaned.match(format);
        if (match) {
            let day, month, year;

            if (format === formats[1]) { // YYYY/MM/DD
                [, year, month, day] = match;
            } else { // DD/MM/YYYY ou DD/MM/YY
                [, day, month, year] = match;
                if (year.length === 2) {
                    year = parseInt(year) < 50 ? `20${year}` : `19${year}`;
                }
            }

            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            if (!isNaN(date.getTime())) return date;
        }
    }

    // Fallback: essai de Date.parse
    const fallback = new Date(cleaned);
    return !isNaN(fallback.getTime()) ? fallback : null;
}

function parseAmount(amountStr: string): number {
    if (!amountStr || amountStr.trim() === '') return NaN;

    // Nettoyage: suppression des symboles monétaires et espaces
    let cleaned = amountStr.trim()
        .replace(/€|EUR|$|USD|£|GBP/gi, '')
        .replace(/\s/g, '');

    // Gestion des séparateurs français (1 234,56) vs anglais (1,234.56)
    const commaCount = (cleaned.match(/,/g) || []).length;
    const dotCount = (cleaned.match(/\./g) || []).length;

    if (commaCount === 1 && dotCount === 0) {
        // Format français: 1234,56
        cleaned = cleaned.replace(',', '.');
    } else if (commaCount > 1 || (commaCount === 1 && dotCount === 1)) {
        // Format avec séparateurs de milliers
        if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
            // 1.234,56 (français)
            cleaned = cleaned.replace(/\./g, '').replace(',', '.');
        } else {
            // 1,234.56 (anglais)
            cleaned = cleaned.replace(/,/g, '');
        }
    }

    return parseFloat(cleaned);
}

// Traitement des données pour créer des KPIs complets
export function processFinancialData(records: FinancialRecord[], sourceId: string): ProcessedData {
    const income = records.filter(r => r.type === 'income');
    const expenses = records.filter(r => r.type === 'expense');

    const totalIncome = income.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = expenses.reduce((sum, r) => sum + r.amount, 0);
    const netCashFlow = totalIncome - totalExpenses;

    // Détection période
    const dates = records.map(r => r.date).filter(d => d instanceof Date);
    const startDate = dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
    const endDate = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();

    // Calcul des catégories
    const categoryStats = calculateCategoryStats(records);

    // Détection des comptes
    const accountsSet = new Set<string>();
    records.forEach(r => {
        if (r.account) accountsSet.add(r.account);
    });
    const accounts = Array.from(accountsSet);

    const summary: DataSummary = {
        totalRecords: records.length,
        totalIncome,
        totalExpenses,
        netCashFlow,
        period: {
            start: startDate,
            end: endDate
        },
        accounts,
        categories: categoryStats
    };

    const kpis: FinancialKPIs = {
        revenue: totalIncome,
        expenses: totalExpenses,
        margin: netCashFlow,
        marginPercentage: totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0,
        averageTransaction: records.length > 0 ? totalIncome / income.length : 0,
        transactionFrequency: calculateTransactionFrequency(records, startDate, endDate),
        topCategories: {
            income: categoryStats.filter(c => c.type === 'income').slice(0, 5),
            expense: categoryStats.filter(c => c.type === 'expense').slice(0, 5)
        },
        trends: {
            revenueGrowth: 0, // TODO: calculer vs période précédente
            expenseGrowth: 0,
            marginTrend: 0
        }
    };

    const qualityMetrics: DataQuality = calculateDataQuality(records);

    return {
        sourceId,
        records,
        summary,
        kpis,
        qualityMetrics
    };
}

// Calcul des statistiques par catégorie
function calculateCategoryStats(records: FinancialRecord[]): CategorySummary[] {
    const categoryMap = new Map<string, { type: 'income' | 'expense', amount: number, count: number }>();

    records.forEach(record => {
        const category = record.category || 'Non catégorisé';
        const key = `${category}-${record.type}`;

        if (categoryMap.has(key)) {
            const existing = categoryMap.get(key)!;
            existing.amount += record.amount;
            existing.count += 1;
        } else {
            categoryMap.set(key, {
                type: record.type,
                amount: record.amount,
                count: 1
            });
        }
    });

    const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);

    return Array.from(categoryMap.entries()).map(([key, data]) => {
        const [name] = key.split('-');
        return {
            name,
            type: data.type,
            amount: data.amount,
            count: data.count,
            percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0
        };
    }).sort((a, b) => b.amount - a.amount);
}

// Calcul de la fréquence des transactions
function calculateTransactionFrequency(records: FinancialRecord[], startDate: Date, endDate: Date): number {
    const daysDiff = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return records.length / daysDiff;
}

// Calcul de la qualité des données
function calculateDataQuality(records: FinancialRecord[]): DataQuality {
    let completeness = 0;
    let fieldsCount = 0;
    const anomalies: DataAnomaly[] = [];
    const duplicates = new Set<string>();

    records.forEach(record => {
        // Complétude
        const fields = ['date', 'description', 'amount'];
        fields.forEach(field => {
            fieldsCount++;
            if (record[field as keyof FinancialRecord]) completeness++;
        });

        // Détection de doublons
        const signature = `${record.date.toISOString()}-${record.amount}-${record.description}`;
        if (duplicates.has(signature)) {
            anomalies.push({
                type: 'duplicate',
                recordId: record.id,
                description: 'Transaction potentiellement dupliquée',
                severity: 'medium'
            });
        }
        duplicates.add(signature);

        // Détection de montants suspects
        if (record.amount > 1000000) {
            anomalies.push({
                type: 'suspicious_amount',
                recordId: record.id,
                description: 'Montant exceptionnellement élevé',
                severity: 'low',
                suggestion: 'Vérifier la validité de ce montant'
            });
        }

        if (record.amount === 0) {
            anomalies.push({
                type: 'suspicious_amount',
                recordId: record.id,
                description: 'Montant à zéro',
                severity: 'low'
            });
        }
    });

    return {
        completeness: fieldsCount > 0 ? completeness / fieldsCount : 0,
        accuracy: Math.max(0, 1 - (anomalies.length / records.length)),
        consistency: 0.9, // TODO: calculer basé sur la cohérence des formats
        duplicates: duplicates.size - records.length,
        anomalies,
        suggestions: [
            'Considérer ajouter des catégories pour une meilleure analyse',
            'Vérifier les montants exceptionnels identifiés'
        ]
    };
}

// Génération des KPIs pour le dashboard avec nouvelles données
export function generateDashboardKPIs(data: ProcessedData) {
    const { kpis, summary } = data;

    return [
        {
            title: 'Chiffre d\'Affaires',
            value: `${Math.round(kpis.revenue).toLocaleString('fr-FR')} €`,
            change: `${kpis.trends.revenueGrowth.toFixed(1)}%`,
            changeType: kpis.trends.revenueGrowth > 0 ? 'positive' : kpis.trends.revenueGrowth < 0 ? 'negative' : 'neutral',
            description: `Période: ${summary.period.start.toLocaleDateString('fr-FR')} à ${summary.period.end.toLocaleDateString('fr-FR')}`,
            confidence: data.qualityMetrics.accuracy
        },
        {
            title: 'Charges',
            value: `${Math.round(kpis.expenses).toLocaleString('fr-FR')} €`,
            change: `${kpis.trends.expenseGrowth.toFixed(1)}%`,
            changeType: kpis.trends.expenseGrowth < 0 ? 'positive' : kpis.trends.expenseGrowth > 0 ? 'negative' : 'neutral',
            description: 'Total des dépenses',
            confidence: data.qualityMetrics.accuracy
        },
        {
            title: 'Marge Nette',
            value: `${kpis.marginPercentage.toFixed(1)}%`,
            change: `${kpis.trends.marginTrend.toFixed(1)}pt`,
            changeType: kpis.marginPercentage > 20 ? 'positive' : kpis.marginPercentage > 10 ? 'neutral' : 'negative',
            description: 'Marge bénéficiaire',
            confidence: data.qualityMetrics.consistency
        },
        {
            title: 'Cash Flow Net',
            value: `${Math.round(summary.netCashFlow).toLocaleString('fr-FR')} €`,
            change: `${kpis.trends.marginTrend.toFixed(1)}%`,
            changeType: summary.netCashFlow > 0 ? 'positive' : 'negative',
            description: 'Flux de trésorerie net',
            confidence: data.qualityMetrics.completeness
        }
    ];
}
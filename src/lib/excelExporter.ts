/**
 * EXPORT EXCEL PROFESSIONNEL
 *
 * Génération de rapports financiers au format Excel (.xlsx)
 * - Feuille KPIs avec mise en forme
 * - Feuille Données brutes
 * - Feuille Analyses (optionnelle)
 * - Mise en forme professionnelle (couleurs, bordures, largeurs colonnes)
 */

import * as XLSX from 'xlsx';

export interface ExcelExportOptions {
    companyName: string;
    reportPeriod: {
        start: Date;
        end: Date;
    };
    kpis: Array<{
        title: string;
        value: string;
        change: string;
        description: string;
        changeType?: 'positive' | 'negative' | 'neutral';
    }>;
    rawData?: Array<{
        date: string;
        description: string;
        amount: number;
        client?: string;
        category?: string;
        status?: string;
    }>;
    includeRawData: boolean;
}

export class FinancialExcelExporter {
    /**
     * Génère et télécharge un fichier Excel
     */
    async generate(options: ExcelExportOptions): Promise<void> {
        const workbook = XLSX.utils.book_new();

        // Feuille 1: Page de garde + KPIs
        this.addKPISheet(workbook, options);

        // Feuille 2: Données brutes (si demandé)
        if (options.includeRawData && options.rawData && options.rawData.length > 0) {
            this.addRawDataSheet(workbook, options.rawData);
        }

        // Feuille 3: Analyse (résumé des tendances)
        this.addAnalysisSheet(workbook, options);

        // Télécharger le fichier
        const filename = `rapport-financier-${options.companyName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, filename);
    }

    /**
     * Feuille 1: KPIs avec mise en forme
     */
    private addKPISheet(workbook: XLSX.WorkBook, options: ExcelExportOptions) {
        const { companyName, reportPeriod, kpis } = options;

        const data: any[][] = [];

        // En-tête du rapport
        data.push(['RAPPORT FINANCIER']);
        data.push([companyName]);
        data.push([`Période: ${this.formatDate(reportPeriod.start)} - ${this.formatDate(reportPeriod.end)}`]);
        data.push([`Généré le: ${this.formatDate(new Date())}`]);
        data.push([]); // Ligne vide

        // En-têtes des colonnes KPIs
        data.push(['Indicateur', 'Valeur', 'Évolution', 'Description']);

        // Données KPIs
        kpis.forEach(kpi => {
            data.push([
                kpi.title,
                kpi.value,
                kpi.change,
                kpi.description
            ]);
        });

        // Créer la feuille
        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // Largeurs de colonnes
        worksheet['!cols'] = [
            { wch: 25 },  // Indicateur
            { wch: 20 },  // Valeur
            { wch: 20 },  // Évolution
            { wch: 50 }   // Description
        ];

        // Ajouter au classeur
        XLSX.utils.book_append_sheet(workbook, worksheet, 'KPIs');
    }

    /**
     * Feuille 2: Données brutes
     */
    private addRawDataSheet(workbook: XLSX.WorkBook, rawData: any[]) {
        if (!rawData || rawData.length === 0) return;

        const data: any[][] = [];

        // En-têtes
        const headers = Object.keys(rawData[0]);
        data.push(headers);

        // Données
        rawData.forEach(row => {
            const rowData = headers.map(header => {
                const value = row[header];
                // Formater les dates
                if (header.toLowerCase().includes('date') && value) {
                    return this.formatDate(new Date(value));
                }
                // Formater les montants
                if (typeof value === 'number' && header.toLowerCase().includes('amount')) {
                    return value;
                }
                return value || '';
            });
            data.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // Largeurs de colonnes auto
        const maxWidths = headers.map((header, colIndex) => {
            const columnData = data.map(row => String(row[colIndex] || ''));
            const maxLength = Math.max(...columnData.map(val => val.length));
            return { wch: Math.min(maxLength + 2, 50) }; // Max 50 caractères
        });
        worksheet['!cols'] = maxWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
    }

    /**
     * Feuille 3: Analyse et tendances
     */
    private addAnalysisSheet(workbook: XLSX.WorkBook, options: ExcelExportOptions) {
        const { kpis } = options;

        const data: any[][] = [];

        // Titre
        data.push(['ANALYSE DES TENDANCES']);
        data.push([]);

        // Analyser les KPIs positifs/négatifs
        const positiveKPIs = kpis.filter(k => k.changeType === 'positive');
        const negativeKPIs = kpis.filter(k => k.changeType === 'negative');

        if (positiveKPIs.length > 0) {
            data.push(['✅ POINTS POSITIFS']);
            positiveKPIs.forEach(kpi => {
                data.push([kpi.title, kpi.change, kpi.description]);
            });
            data.push([]);
        }

        if (negativeKPIs.length > 0) {
            data.push(['⚠️ POINTS D\'ATTENTION']);
            negativeKPIs.forEach(kpi => {
                data.push([kpi.title, kpi.change, kpi.description]);
            });
            data.push([]);
        }

        // Recommandations
        data.push(['RECOMMANDATIONS']);
        data.push([]);

        if (negativeKPIs.some(k => k.title.includes('Cash Flow'))) {
            data.push(['• Surveiller la trésorerie de près']);
        }
        if (negativeKPIs.some(k => k.title.includes('DSO') || k.title.includes('délai'))) {
            data.push(['• Accélérer les relances clients']);
        }
        if (negativeKPIs.some(k => k.title.includes('Charges'))) {
            data.push(['• Analyser les postes de dépenses']);
        }
        if (positiveKPIs.some(k => k.title.includes('CA') || k.title.includes('Affaires'))) {
            data.push(['• Capitaliser sur la croissance du CA']);
        }

        const worksheet = XLSX.utils.aoa_to_sheet(data);

        worksheet['!cols'] = [
            { wch: 30 },
            { wch: 20 },
            { wch: 50 }
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Analyse');
    }

    /**
     * Formater une date en FR
     */
    private formatDate(date: Date): string {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

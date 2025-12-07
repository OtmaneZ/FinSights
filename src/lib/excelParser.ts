// Utilitaire pour convertir Excel (.xlsx) en CSV
// Compatible avec le navigateur et Node.js

import * as XLSX from 'xlsx';
import { logger } from '@/lib/logger';

export interface ExcelToCSVResult {
    success: boolean;
    csvContent?: string;
    error?: string;
    sheetName?: string;
    rowCount?: number;
    columnCount?: number;
}

/**
 * Convertit un fichier Excel (.xlsx, .xls) en CSV
 * @param fileContent - Contenu du fichier en base64 ou ArrayBuffer
 * @param sheetIndex - Index de la feuille à convertir (0 par défaut)
 * @returns Résultat de la conversion avec le contenu CSV
 */
export function excelToCSV(
    fileContent: string | ArrayBuffer,
    sheetIndex: number = 0
): ExcelToCSVResult {
    try {
        // Convertir base64 en ArrayBuffer si nécessaire
        let arrayBuffer: ArrayBuffer;

        if (typeof fileContent === 'string') {
            // Si c'est une string base64, la décoder
            const base64 = fileContent.includes('base64,')
                ? fileContent.split('base64,')[1]
                : fileContent;
            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            arrayBuffer = bytes.buffer;
        } else {
            arrayBuffer = fileContent;
        }

        // Lire le fichier Excel
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Vérifier qu'il y a des feuilles
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            return {
                success: false,
                error: 'Aucune feuille trouvée dans le fichier Excel',
            };
        }

        // Sélectionner la feuille
        const sheetName = workbook.SheetNames[sheetIndex];
        if (!sheetName) {
            return {
                success: false,
                error: `La feuille n°${sheetIndex} n'existe pas. Feuilles disponibles: ${workbook.SheetNames.join(', ')}`,
            };
        }

        const worksheet = workbook.Sheets[sheetName];

        // Convertir en CSV avec point-virgule comme séparateur (standard français)
        const csvContent = XLSX.utils.sheet_to_csv(worksheet, {
            FS: ',', // Field separator
            RS: '\n', // Record separator
        });

        // Compter les lignes et colonnes
        const lines = csvContent.trim().split('\n');
        const rowCount = lines.length;
        const columnCount = lines[0] ? lines[0].split(',').length : 0;

        return {
            success: true,
            csvContent,
            sheetName,
            rowCount,
            columnCount,
        };
    } catch (error) {
        logger.error('Erreur lors de la conversion Excel → CSV:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
        };
    }
}

/**
 * Liste toutes les feuilles d'un fichier Excel
 * @param fileContent - Contenu du fichier en base64 ou ArrayBuffer
 * @returns Liste des noms de feuilles
 */
export function listExcelSheets(fileContent: string | ArrayBuffer): string[] {
    try {
        let arrayBuffer: ArrayBuffer;

        if (typeof fileContent === 'string') {
            const base64 = fileContent.includes('base64,')
                ? fileContent.split('base64,')[1]
                : fileContent;
            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            arrayBuffer = bytes.buffer;
        } else {
            arrayBuffer = fileContent;
        }

        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        return workbook.SheetNames;
    } catch (error) {
        logger.error('Erreur lors de la lecture des feuilles Excel:', error);
        return [];
    }
}

/**
 * Détecte automatiquement la meilleure feuille à utiliser
 * (celle qui contient le plus de données)
 */
export function detectBestSheet(fileContent: string | ArrayBuffer): number {
    try {
        let arrayBuffer: ArrayBuffer;

        if (typeof fileContent === 'string') {
            const base64 = fileContent.includes('base64,')
                ? fileContent.split('base64,')[1]
                : fileContent;
            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            arrayBuffer = bytes.buffer;
        } else {
            arrayBuffer = fileContent;
        }

        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        let maxRows = 0;
        let bestSheetIndex = 0;

        workbook.SheetNames.forEach((sheetName: string, index: number) => {
            const worksheet = workbook.Sheets[sheetName];
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            const rowCount = range.e.r - range.s.r + 1;

            if (rowCount > maxRows) {
                maxRows = rowCount;
                bestSheetIndex = index;
            }
        });

        return bestSheetIndex;
    } catch (error) {
        logger.error('Erreur lors de la détection de la meilleure feuille:', error);
        return 0;
    }
}

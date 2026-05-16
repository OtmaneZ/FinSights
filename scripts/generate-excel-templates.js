#!/usr/bin/env node
/**
 * Générateur de Templates Excel pour FinSight
 * Crée 3 fichiers Excel professionnels avec formules automatiques
 *
 * Usage: node scripts/generate-excel-templates.js
 *
 * Prérequis: npm install exceljs
 */

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/templates/excel');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ========================================
// TEMPLATE 1: Budget Prévisionnel 2025
// ========================================
async function createBudgetPrevisionnel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Budget 2025', {
        properties: { tabColor: { argb: 'FF3B82F6' } }
    });

    // 🎨 TITRE PRINCIPAL VISUEL (ligne 1)
    sheet.mergeCells('A1:F1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'BUDGET PRÉVISIONNEL 2025 - TEMPLATE PME';
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3B82F6' } // Bleu FinSight
    };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 30;

    // Empty row for spacing
    sheet.addRow([]);

    // Header styling (ligne 3 maintenant)
    sheet.getRow(3).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F2937' } // Gris foncé
    };
    sheet.getRow(3).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(3).height = 25;

    // Columns (avec couleurs visuelles pour headers)
    sheet.columns = [
        { header: 'Mois', key: 'mois', width: 15 },
        { header: 'CA Prévu (€)', key: 'ca', width: 18 },
        { header: 'Charges Prévues (€)', key: 'charges', width: 20 },
        { header: 'Marge (€)', key: 'marge', width: 18 },
        { header: 'Marge %', key: 'marge_pct', width: 15 },
        { header: 'Cash Flow Cumulé (€)', key: 'cashflow', width: 22 }
    ];

    // Apply color coding to headers (row 3)
    sheet.getCell('B3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } }; // CA = Bleu
    sheet.getCell('C3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } }; // Charges = Rouge
    sheet.getCell('D3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } }; // Marge = Vert
    sheet.getCell('E3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } }; // Marge % = Vert
    sheet.getCell('F3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }; // Cash Flow = Bleu foncé

    // Data rows (12 mois)
    const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    // Données exemples pré-remplies (varient entre 35k et 55k)
    const exempleCA = [42000, 45000, 38000, 48000, 52000, 47000, 43000, 39000, 50000, 53000, 49000, 55000];
    const exempleCharges = [28000, 30000, 25000, 32000, 35000, 31000, 29000, 26000, 33000, 36000, 32000, 37000];

    mois.forEach((m, idx) => {
        const rowNum = idx + 4; // Start at row 4 now (title + empty + header)
        sheet.addRow({
            mois: m,
            ca: exempleCA[idx],
            charges: exempleCharges[idx],
            marge: { formula: `B${rowNum}-C${rowNum}` },
            marge_pct: { formula: `IF(B${rowNum}=0,0,D${rowNum}/B${rowNum})` },
            cashflow: idx === 0
                ? { formula: `D${rowNum}` }
                : { formula: `D${rowNum}+F${rowNum - 1}` }
        });

        // Format numbers
        sheet.getCell(`B${rowNum}`).numFmt = '#,##0 €';
        sheet.getCell(`C${rowNum}`).numFmt = '#,##0 €';
        sheet.getCell(`D${rowNum}`).numFmt = '#,##0 €';
        sheet.getCell(`E${rowNum}`).numFmt = '0.0%';
        sheet.getCell(`F${rowNum}`).numFmt = '#,##0 €';

        // 🎨 COLOR CODING: CA Bleu, Charges Rouge, Marge Vert, Cash Flow Bleu foncé
        sheet.getCell(`B${rowNum}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDBEAFE' } // Bleu clair
        };
        sheet.getCell(`C${rowNum}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFECACA' } // Rouge clair
        };
        sheet.getCell(`D${rowNum}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD1FAE5' } // Vert clair
        };
        sheet.getCell(`E${rowNum}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD1FAE5' } // Vert clair
        };
        sheet.getCell(`F${rowNum}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFBFDBFE' } // Bleu foncé clair
        };

        // Apply borders
        ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
            sheet.getCell(`${col}${rowNum}`).border = {
                top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
            };
        });

        // Conditional formatting: RED BOLD if negative margin (override)
        const margeValue = exempleCA[idx] - exempleCharges[idx];
        const margeCell = sheet.getCell(`D${rowNum}`);
        if (margeValue < 0) {
            margeCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDC2626' } // Rouge vif
            };
            margeCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        }

        // Add data validation to ensure numeric input
        sheet.getCell(`B${rowNum}`).dataValidation = {
            type: 'decimal',
            operator: 'greaterThanOrEqual',
            showErrorMessage: true,
            formulae: [0],
            errorTitle: 'Erreur',
            error: 'Entrez un montant positif'
        };
        sheet.getCell(`C${rowNum}`).dataValidation = {
            type: 'decimal',
            operator: 'greaterThanOrEqual',
            showErrorMessage: true,
            formulae: [0],
            errorTitle: 'Erreur',
            error: 'Entrez un montant positif'
        };
    });

    // Total row (row 16 now)
    const totalRow = sheet.addRow({
        mois: 'TOTAL ANNUEL',
        ca: { formula: 'SUM(B4:B15)' },
        charges: { formula: 'SUM(C4:C15)' },
        marge: { formula: 'SUM(D4:D15)' },
        marge_pct: { formula: 'IF(B16=0,0,D16/B16)' },
        cashflow: ''
    });

    totalRow.font = { bold: true, size: 12 };
    totalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE5E7EB' }
    };
    ['B16', 'C16', 'D16', 'E16'].forEach(cell => {
        sheet.getCell(cell).border = {
            top: { style: 'double', color: { argb: 'FF3B82F6' } },
            bottom: { style: 'double', color: { argb: 'FF3B82F6' } }
        };
    });

    // 🎨 CTA FINSIGHT DISCRET (plus visible, row 18-26)
    sheet.addRow([]);
    sheet.addRow([]);

    // CTA Header with icon
    sheet.mergeCells('A18:F18');
    const ctaHeaderCell = sheet.getCell('A18');
    ctaHeaderCell.value = '🧠 GAGNEZ DU TEMPS : IMPORTEZ CE FICHIER DANS FINSIGHT';
    ctaHeaderCell.font = { bold: true, size: 13, color: { argb: 'FF3B82F6' } };
    ctaHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ctaHeaderCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDBEAFE' } // Bleu clair
    };
    sheet.getRow(18).height = 25;

    sheet.addRow([]);

    // Benefits list
    sheet.mergeCells('A20:F20');
    sheet.getCell('A20').value = '→ Analyse complète en 10 secondes (au lieu de 2h sur Excel)';
    sheet.getCell('A20').font = { size: 11 };

    sheet.mergeCells('A21:F21');
    sheet.getCell('A21').value = '→ KPIs automatiques : DSO, BFR, taux croissance, saisonnalité';
    sheet.getCell('A21').font = { size: 11 };

    sheet.mergeCells('A22:F22');
    sheet.getCell('A22').value = '→ Prédictions cash flow sur 6 mois avec alertes trésorerie';
    sheet.getCell('A22').font = { size: 11 };

    sheet.mergeCells('A23:F23');
    sheet.getCell('A23').value = '→ IA CFO virtuelle : posez vos questions en langage naturel';
    sheet.getCell('A23').font = { size: 11 };

    sheet.addRow([]);

    // Link
    sheet.mergeCells('A25:F25');
    const linkCell = sheet.getCell('A25');
    linkCell.value = {
        text: '👉 Essayez gratuitement : https://finsight.zineinsight.com',
        hyperlink: 'https://finsight.zineinsight.com'
    };
    linkCell.font = { bold: true, size: 12, color: { argb: 'FF3B82F6' }, underline: true };
    linkCell.alignment = { horizontal: 'center' };

    // Subtle hint
    sheet.addRow([]);
    sheet.mergeCells('A27:F27');
    sheet.getCell('A27').value = '💡 Ce fichier est bien… mais FinSight, c\'est 100× plus rapide.';
    sheet.getCell('A27').font = { italic: true, size: 10, color: { argb: 'FF6B7280' } };
    sheet.getCell('A27').alignment = { horizontal: 'center' };

    // Old CTA section removed, replaced by new one above

    // Protection: lock formula cells
    sheet.protect('finsight2025', {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        deleteColumns: false,
        deleteRows: false
    });

    // Unlock only CA and Charges columns (rows 4-15)
    for (let i = 4; i <= 15; i++) {
        sheet.getCell(`B${i}`).protection = { locked: false };
        sheet.getCell(`C${i}`).protection = { locked: false };
    }

    // Instructions sheet
    const instructions = workbook.addWorksheet('📖 Instructions');
    instructions.columns = [{ width: 90 }];

    instructions.addRow(['']);
    const titleRow = instructions.addRow(['💰 BUDGET PRÉVISIONNEL 2025 - MODE D\'EMPLOI']);
    titleRow.font = { bold: true, size: 18, color: { argb: 'FF3B82F6' } };
    instructions.addRow(['']);

    const subtitleRow = instructions.addRow(['📝 Comment utiliser ce template :']);
    subtitleRow.font = { bold: true, size: 13, color: { argb: 'FF1F2937' } };
    instructions.addRow(['']);
    instructions.addRow(['1️⃣  Les données sont PRÉ-REMPLIES avec des valeurs exemples']);
    instructions.addRow(['2️⃣  Modifiez uniquement les colonnes "CA Prévu" et "Charges Prévues"']);
    instructions.addRow(['3️⃣  Les formules (Marge, %, Cash Flow) se calculent AUTOMATIQUEMENT']);
    instructions.addRow(['4️⃣  Les marges négatives apparaissent en ROUGE (alerte visuelle)']);
    instructions.addRow(['5️⃣  Pour repartir de zéro : remplacez les montants par vos vraies données']);
    instructions.addRow(['']);

    const graphRow = instructions.addRow(['📊 Comment ajouter un graphique (2 minutes) :']);
    graphRow.font = { bold: true, size: 13, color: { argb: 'FF1F2937' } };
    instructions.addRow(['']);
    instructions.addRow(['   • Sélectionnez A1:C13 (Mois + CA + Charges)']);
    instructions.addRow(['   • Insertion > Graphique > Courbes']);
    instructions.addRow(['   • Personnalisez le titre : "Évolution CA vs Charges 2025"']);
    instructions.addRow(['']);

    const tipRow = instructions.addRow(['🎯 Astuce Pro :']);
    tipRow.font = { bold: true, size: 13, color: { argb: 'FFEF4444' } };
    instructions.addRow(['']);
    instructions.addRow(['Ce fichier contient les BASES de votre budget. Pour aller plus loin :']);
    instructions.addRow(['']);
    instructions.addRow(['   ✅ Analyse IA en 10 secondes (au lieu de 2h sur Excel)']);
    instructions.addRow(['   ✅ 15 KPIs automatiques (DSO, BFR, croissance, saisonnalité...)']);
    instructions.addRow(['   ✅ Prédictions 6 mois avec alertes trésorerie']);
    instructions.addRow(['   ✅ Détection d\'anomalies et recommandations personnalisées']);
    instructions.addRow(['']);

    const ctaRow2 = instructions.addRow(['� Importez ce fichier gratuitement dans FinSight : https://finsight.zineinsight.com']);
    ctaRow2.font = { bold: true, size: 12, color: { argb: 'FF3B82F6' }, underline: true };
    instructions.getCell('A26').value = {
        text: '👉 Importez ce fichier gratuitement dans FinSight : https://finsight.zineinsight.com',
        hyperlink: 'https://finsight.zineinsight.com'
    };
    instructions.addRow(['']);
    instructions.addRow(['📞 Support : contact@zineinsight.com']);

    await workbook.xlsx.writeFile(path.join(OUTPUT_DIR, 'budget-previsionnel-2026.xlsx'));
    console.log('✅ Budget Prévisionnel 2026 créé');
}

// ========================================
// TEMPLATE 2: Tracker DSO
// ========================================
async function createTrackerDSO() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Tracker DSO', {
        properties: { tabColor: { argb: 'FF10B981' } }
    });

    // Header
    sheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF10B981' }
    };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 25;

    // Columns
    sheet.columns = [
        { header: 'N° Facture', key: 'numero', width: 15 },
        { header: 'Client', key: 'client', width: 25 },
        { header: 'Date Facture', key: 'date_facture', width: 15 },
        { header: 'Date Échéance', key: 'date_echeance', width: 15 },
        { header: 'Montant (€)', key: 'montant', width: 15 },
        { header: 'Statut', key: 'statut', width: 12 },
        { header: 'Jours Retard', key: 'jours_retard', width: 15 },
        { header: 'Actions', key: 'actions', width: 20 }
    ];

    // Example data
    const today = new Date();
    const exemples = [
        { numero: 'F2025-001', client: 'Client A', days: -10, montant: 5000, statut: 'Payée' },
        { numero: 'F2025-002', client: 'Client B', days: 15, montant: 12000, statut: 'Impayée' },
        { numero: 'F2025-003', client: 'Client C', days: 45, montant: 8500, statut: 'Impayée' },
        { numero: 'F2025-004', client: 'Client D', days: 70, montant: 3200, statut: 'Impayée' }
    ];

    exemples.forEach((ex, idx) => {
        const rowNum = idx + 2;
        const dateFacture = new Date(today);
        dateFacture.setDate(dateFacture.getDate() - ex.days - 30);
        const dateEcheance = new Date(dateFacture);
        dateEcheance.setDate(dateEcheance.getDate() + 30);

        sheet.addRow({
            numero: ex.numero,
            client: ex.client,
            date_facture: dateFacture,
            date_echeance: dateEcheance,
            montant: ex.montant,
            statut: ex.statut,
            jours_retard: { formula: `IF(F${rowNum}="Payée",0,TODAY()-D${rowNum})` },
            actions: ''
        });

        sheet.getCell(`C${rowNum}`).numFmt = 'dd/mm/yyyy';
        sheet.getCell(`D${rowNum}`).numFmt = 'dd/mm/yyyy';
        sheet.getCell(`E${rowNum}`).numFmt = '#,##0 €';

        // Borders
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
            sheet.getCell(`${col}${rowNum}`).border = {
                top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
            };
        });

        // Conditional formatting: RED for delays > 60 days, ORANGE > 30 days
        const joursCell = sheet.getCell(`G${rowNum}`);
        if (ex.days > 60) {
            joursCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };
            joursCell.font = { color: { argb: 'FFDC2626' }, bold: true };
            sheet.getCell(`H${rowNum}`).value = '🚨 RELANCE URGENTE';
        } else if (ex.days > 30) {
            joursCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
            joursCell.font = { color: { argb: 'FFD97706' } };
            sheet.getCell(`H${rowNum}`).value = '⚠️ Relancer';
        } else if (ex.statut === 'Payée') {
            joursCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
            joursCell.font = { color: { argb: 'FF10B981' } };
            sheet.getCell(`H${rowNum}`).value = '✅ OK';
        }
    });

    // Summary section
    sheet.addRow([]);
    const summaryRow = sheet.addRow(['📊 INDICATEURS DSO', '', '', '', '', '', '']);
    summaryRow.font = { bold: true, size: 13, color: { argb: 'FF10B981' } };
    sheet.addRow([]);

    sheet.addRow(['DSO Moyen (jours)', '', '', '', '', '', { formula: 'AVERAGEIF(F2:F100,"Impayée",G2:G100)' }]);
    sheet.addRow(['Montant Total Impayés', '', '', '', '', '', { formula: 'SUMIF(F2:F100,"Impayée",E2:E100)' }]);
    sheet.addRow(['Nombre Factures en retard', '', '', '', '', '', { formula: 'COUNTIFS(F2:F100,"Impayée",G2:G100,">0")' }]);

    ['G9', 'G10', 'G11'].forEach(cell => {
        sheet.getCell(cell).font = { bold: true, size: 12 };
        sheet.getCell(cell).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF3F4F6' }
        };
    });
    sheet.getCell('G10').numFmt = '#,##0 €';

    // CTA FinSight
    sheet.addRow([]);
    sheet.addRow([]);
    const ctaRow = sheet.addRow(['💡 AUTOMATISEZ VOS RELANCES AVEC FINSIGHT']);
    ctaRow.font = { bold: true, size: 13, color: { argb: 'FF10B981' } };
    sheet.addRow([]);
    sheet.addRow(['Importez ce tracker dans FinSight pour :']);
    sheet.addRow(['   ✅ Calcul DSO automatique en temps réel']);
    sheet.addRow(['   ✅ Alertes email avant échéance']);
    sheet.addRow(['   ✅ Prédictions de trésorerie sur 90 jours']);
    sheet.addRow(['   ✅ Suggestions de relances personnalisées par IA']);
    sheet.addRow([]);
    const linkRow = sheet.addRow(['👉 Essayer gratuitement : https://finsight.zineinsight.com']);
    linkRow.font = { bold: true, size: 11, color: { argb: 'FF10B981' } };
    sheet.getCell('A21').value = {
        text: '👉 Essayer gratuitement : https://finsight.zineinsight.com',
        hyperlink: 'https://finsight.zineinsight.com'
    };

    // Protection
    sheet.protect('finsight2025', {
        selectLockedCells: true,
        selectUnlockedCells: true
    });

    // Unlock input cells (allow editing invoices)
    for (let i = 2; i <= 100; i++) {
        ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
            sheet.getCell(`${col}${i}`).protection = { locked: false };
        });
    }

    await workbook.xlsx.writeFile(path.join(OUTPUT_DIR, 'tracker-dso.xlsx'));
    console.log('✅ Tracker DSO créé');
}

// ========================================
// TEMPLATE 3: Dashboard Cash Flow
// ========================================
async function createDashboardCashFlow() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Cash Flow', {
        properties: { tabColor: { argb: 'FF8B5CF6' } }
    });

    // Header
    sheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF8B5CF6' }
    };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 25;

    // Columns
    sheet.columns = [
        { header: 'Mois', key: 'mois', width: 15 },
        { header: 'Encaissements (€)', key: 'encaissements', width: 20 },
        { header: 'Décaissements (€)', key: 'decaissements', width: 20 },
        { header: 'Solde Mensuel (€)', key: 'solde', width: 20 },
        { header: 'Trésorerie Cumulée (€)', key: 'tresorerie', width: 22 },
        { header: 'Seuil Alerte', key: 'alerte', width: 15 }
    ];

    // Last 6 months
    const mois = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        mois.push(d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
    }

    // Données exemples pré-remplies (dernier semestre)
    const exempleEncaissements = [45000, 52000, 48000, 55000, 51000, 58000];
    const exempleDecaissements = [38000, 44000, 41000, 47000, 43000, 49000];

    const tresoInit = 50000; // Trésorerie initiale
    mois.forEach((m, idx) => {
        const rowNum = idx + 2;
        sheet.addRow({
            mois: m,
            encaissements: exempleEncaissements[idx],
            decaissements: exempleDecaissements[idx],
            solde: { formula: `B${rowNum}-C${rowNum}` },
            tresorerie: idx === 0
                ? { formula: `${tresoInit}+D${rowNum}` }
                : { formula: `E${rowNum - 1}+D${rowNum}` },
            alerte: { formula: `IF(E${rowNum}<10000,"🔴 ALERTE","✅ OK")` }
        });

        sheet.getCell(`B${rowNum}`).numFmt = '#,##0 €';
        sheet.getCell(`C${rowNum}`).numFmt = '#,##0 €';
        sheet.getCell(`D${rowNum}`).numFmt = '#,##0 €';
        sheet.getCell(`E${rowNum}`).numFmt = '#,##0 €';

        // Borders
        ['B', 'C', 'D', 'E', 'F'].forEach(col => {
            sheet.getCell(`${col}${rowNum}`).border = {
                top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
            };
        });

        // Conditional: RED alert if below threshold
        const tresoValue = (idx === 0 ? tresoInit : 0) + (exempleEncaissements[idx] - exempleDecaissements[idx]);
        const alerteCell = sheet.getCell(`F${rowNum}`);
        if (tresoValue < 10000) {
            alerteCell.font = { bold: true, color: { argb: 'FFDC2626' } };
        } else {
            alerteCell.font = { bold: true, color: { argb: 'FF10B981' } };
        }
    });

    // CTA FinSight
    sheet.addRow([]);
    sheet.addRow([]);
    const ctaRow = sheet.addRow(['💡 PILOTEZ VOTRE TRÉSORERIE AVEC FINSIGHT']);
    ctaRow.font = { bold: true, size: 13, color: { argb: 'FF8B5CF6' } };
    sheet.addRow([]);
    sheet.addRow(['Transformez ce suivi manuel en tableau de bord intelligent :']);
    sheet.addRow(['   ✅ Prévisions de trésorerie 6 mois (scénarios optimiste/pessimiste)']);
    sheet.addRow(['   ✅ Alertes automatiques avant rupture de cash']);
    sheet.addRow(['   ✅ Simulations : "Et si je perds 20% de CA ?"']);
    sheet.addRow(['   ✅ Recommandations IA pour optimiser votre BFR']);
    sheet.addRow([]);
    const linkRow = sheet.addRow(['👉 Essayer gratuitement : https://finsight.zineinsight.com']);
    linkRow.font = { bold: true, size: 11, color: { argb: 'FF8B5CF6' } };
    sheet.getCell('A17').value = {
        text: '👉 Essayer gratuitement : https://finsight.zineinsight.com',
        hyperlink: 'https://finsight.zineinsight.com'
    };

    // Protection
    sheet.protect('finsight2025', {
        selectLockedCells: true,
        selectUnlockedCells: true
    });

    // Unlock input cells
    for (let i = 2; i <= 7; i++) {
        sheet.getCell(`B${i}`).protection = { locked: false };
        sheet.getCell(`C${i}`).protection = { locked: false };
    }

    await workbook.xlsx.writeFile(path.join(OUTPUT_DIR, 'dashboard-cashflow.xlsx'));
    console.log('✅ Dashboard Cash Flow créé');
}

// ========================================
// Main execution
// ========================================
async function main() {
    console.log('🚀 Génération des templates Excel FinSight...\n');

    try {
        await createBudgetPrevisionnel();
        await createTrackerDSO();
        await createDashboardCashFlow();

        console.log('\n✨ Terminé ! Fichiers créés dans /public/templates/excel/');
        console.log('\n📁 Fichiers générés :');
        console.log('   - budget-previsionnel-2026.xlsx');
        console.log('   - tracker-dso.xlsx');
        console.log('   - dashboard-cashflow.xlsx');
        console.log('\n🔗 Page disponible sur : /ressources/templates');
    } catch (error) {
        console.error('❌ Erreur lors de la génération:', error);
        process.exit(1);
    }
}

main();

#!/usr/bin/env node
/**
 * Générateur de Templates PDF pour FinSight
 * Crée 3 fichiers PDF professionnels visuels
 *
 * Usage: node scripts/generate-pdf-templates.js
 *
 * Prérequis: npm install pdfkit
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/templates/pdf');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Colors FinSight
const COLORS = {
    primary: '#3B82F6',      // Bleu
    success: '#10B981',      // Vert
    danger: '#EF4444',       // Rouge
    warning: '#F59E0B',      // Orange
    purple: '#8B5CF6',       // Violet
    darkBlue: '#1E40AF',     // Bleu foncé
    gray: '#6B7280',         // Gris
    lightGray: '#F3F4F6',    // Gris clair
    white: '#FFFFFF'
};

// Helper: Draw table
function drawTable(doc, x, y, headers, rows, columnWidths) {
    const rowHeight = 30;
    const headerHeight = 35;

    // Headers
    let currentX = x;
    headers.forEach((header, i) => {
        doc.rect(currentX, y, columnWidths[i], headerHeight)
            .fillAndStroke(COLORS.primary, COLORS.primary);

        doc.fillColor(COLORS.white)
            .fontSize(10)
            .font('Helvetica-Bold')
            .text(header, currentX + 5, y + 12, {
                width: columnWidths[i] - 10,
                align: 'center'
            });

        currentX += columnWidths[i];
    });

    // Rows
    let currentY = y + headerHeight;
    rows.forEach((row, rowIdx) => {
        currentX = x;
        const bgColor = rowIdx % 2 === 0 ? COLORS.white : COLORS.lightGray;

        row.forEach((cell, colIdx) => {
            doc.rect(currentX, currentY, columnWidths[colIdx], rowHeight)
                .fillAndStroke(bgColor, COLORS.gray);

            doc.fillColor('#000000')
                .fontSize(9)
                .font('Helvetica')
                .text(cell, currentX + 5, currentY + 10, {
                    width: columnWidths[colIdx] - 10,
                    align: colIdx === 0 ? 'left' : 'right'
                });

            currentX += columnWidths[colIdx];
        });

        currentY += rowHeight;
    });
}

// ========================================
// TEMPLATE 1: Budget Prévisionnel 2025 PDF
// ========================================
function createBudgetPrevisionnelPDF() {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const outputPath = path.join(OUTPUT_DIR, 'budget-previsionnel-2025.pdf');
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Title
    doc.rect(0, 0, 595, 100).fill(COLORS.primary);
    doc.fillColor(COLORS.white)
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('BUDGET PREVISIONNEL 2025', 50, 35, { align: 'center' });
    doc.fontSize(14)
        .font('Helvetica')
        .text('TEMPLATE PME', 50, 65, { align: 'center' });

    // Subtitle
    doc.fillColor('#000000')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Previsions financieres mensuelles', 50, 130);

    // Table data
    const headers = ['Mois', 'CA (€)', 'Charges (€)', 'Marge (€)', 'Marge %'];
    const columnWidths = [80, 90, 90, 90, 80];

    const data = [
        ['Janvier', '42 000', '28 000', '14 000', '33.3%'],
        ['Fevrier', '45 000', '30 000', '15 000', '33.3%'],
        ['Mars', '38 000', '25 000', '13 000', '34.2%'],
        ['Avril', '48 000', '32 000', '16 000', '33.3%'],
        ['Mai', '52 000', '35 000', '17 000', '32.7%'],
        ['Juin', '47 000', '31 000', '16 000', '34.0%'],
        ['Juillet', '43 000', '29 000', '14 000', '32.6%'],
        ['Aout', '39 000', '26 000', '13 000', '33.3%'],
        ['Septembre', '50 000', '33 000', '17 000', '34.0%'],
        ['Octobre', '53 000', '36 000', '17 000', '32.1%'],
        ['Novembre', '49 000', '32 000', '17 000', '34.7%'],
        ['Decembre', '55 000', '37 000', '18 000', '32.7%']
    ];

    drawTable(doc, 50, 160, headers, data, columnWidths);

    // Total
    doc.rect(50, 550, 430, 35).fillAndStroke(COLORS.lightGray, COLORS.primary);
    doc.fillColor('#000000')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('TOTAL ANNUEL', 55, 563)
        .text('561 000 €', 140, 563)
        .text('374 000 €', 230, 563)
        .text('187 000 €', 320, 563)
        .text('33.3%', 410, 563);

    // CTA Section
    doc.rect(50, 620, 495, 120).fillAndStroke('#DBEAFE', COLORS.primary);

    doc.fillColor(COLORS.primary)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('GAGNEZ DU TEMPS : IMPORTEZ CE FICHIER DANS FINSIGHT', 60, 635);

    doc.fillColor('#000000')
        .fontSize(10)
        .font('Helvetica')
        .text('> Analyse complete en 10 secondes (au lieu de 2h sur Excel)', 60, 665)
        .text('> KPIs automatiques : DSO, BFR, taux croissance, saisonnalite', 60, 685)
        .text('> Predictions cash flow sur 6 mois avec alertes tresorerie', 60, 705);

    doc.fillColor(COLORS.primary)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('>> Essayez gratuitement : https://finsight.zineinsight.com', 60, 725, {
            link: 'https://finsight.zineinsight.com',
            underline: true
        });

    doc.end();
    console.log('✅ Budget Prévisionnel 2025 PDF créé');
}

// ========================================
// TEMPLATE 2: Tracker DSO PDF
// ========================================
function createTrackerDSOPDF() {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const outputPath = path.join(OUTPUT_DIR, 'tracker-dso.pdf');
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Title
    doc.rect(0, 0, 595, 100).fill(COLORS.success);
    doc.fillColor(COLORS.white)
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('TRACKER DSO', 50, 40, { align: 'center' });
    doc.fontSize(14)
        .font('Helvetica')
        .text('Suivi des Delais de Paiement Clients', 50, 70, { align: 'center' });

    // Subtitle
    doc.fillColor('#000000')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Factures en cours', 50, 130);

    // Table data
    const headers = ['N° Facture', 'Client', 'Montant', 'Echeance', 'Jours Retard', 'Statut'];
    const columnWidths = [80, 100, 80, 80, 70, 80];

    const data = [
        ['F2025-001', 'Client A', '5 000 €', '15/11/2025', '0', 'OK Payee'],
        ['F2025-002', 'Client B', '12 000 €', '10/11/2025', '15', 'Relancer'],
        ['F2025-003', 'Client C', '8 500 €', '05/10/2025', '45', 'URGENT'],
        ['F2025-004', 'Client D', '3 200 €', '15/09/2025', '70', 'URGENT']
    ];

    drawTable(doc, 50, 160, headers, data, columnWidths);

    // Indicateurs
    doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('INDICATEURS DSO', 50, 330);

    doc.rect(50, 360, 495, 100).fillAndStroke(COLORS.lightGray, COLORS.gray);

    doc.fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text('DSO Moyen (jours)', 60, 375)
        .text('43 jours', 400, 375)
        .text('Montant Total Impayes', 60, 405)
        .text('23 700 €', 400, 405)
        .text('Factures en retard', 60, 435)
        .text('3 factures', 400, 435);

    // CTA Section
    doc.rect(50, 490, 495, 120).fillAndStroke('#D1FAE5', COLORS.success);

    doc.fillColor(COLORS.success)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('AUTOMATISEZ VOS RELANCES AVEC FINSIGHT', 60, 505);

    doc.fillColor('#000000')
        .fontSize(10)
        .font('Helvetica')
        .text('> Calcul DSO automatique en temps reel', 60, 535)
        .text('> Alertes email avant echeance', 60, 555)
        .text('> Suggestions de relances personnalisees par IA', 60, 575);

    doc.fillColor(COLORS.success)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('>> Essayer gratuitement : https://finsight.zineinsight.com', 60, 595, {
            link: 'https://finsight.zineinsight.com',
            underline: true
        });

    doc.end();
    console.log('✅ Tracker DSO PDF créé');
}

// ========================================
// TEMPLATE 3: Dashboard Cash Flow PDF
// ========================================
function createDashboardCashFlowPDF() {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const outputPath = path.join(OUTPUT_DIR, 'dashboard-cashflow.pdf');
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Title
    doc.rect(0, 0, 595, 100).fill(COLORS.purple);
    doc.fillColor(COLORS.white)
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('DASHBOARD CASH FLOW', 50, 40, { align: 'center' });
    doc.fontSize(14)
        .font('Helvetica')
        .text('Suivi Tresorerie sur 6 Mois', 50, 70, { align: 'center' });

    // Subtitle
    doc.fillColor('#000000')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Evolution mensuelle de la tresorerie', 50, 130);

    // Table data
    const headers = ['Mois', 'Encaissements', 'Decaissements', 'Solde', 'Treso Cumulee'];
    const columnWidths = [90, 100, 100, 90, 110];

    const data = [
        ['Juillet 2025', '45 000 €', '38 000 €', '7 000 €', '57 000 €'],
        ['Aout 2025', '52 000 €', '44 000 €', '8 000 €', '65 000 €'],
        ['Septembre 2025', '48 000 €', '41 000 €', '7 000 €', '72 000 €'],
        ['Octobre 2025', '55 000 €', '47 000 €', '8 000 €', '80 000 €'],
        ['Novembre 2025', '51 000 €', '43 000 €', '8 000 €', '88 000 €'],
        ['Decembre 2025', '58 000 €', '49 000 €', '9 000 €', '97 000 €']
    ];

    drawTable(doc, 50, 160, headers, data, columnWidths);

    // Alertes
    doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('SEUILS D\'ALERTE', 50, 370);

    doc.rect(50, 400, 495, 80).fillAndStroke(COLORS.lightGray, COLORS.gray);

    doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#000000')
        .text('Seuil minimum recommande : 10 000 €', 60, 415)
        .text('Tresorerie actuelle : 97 000 €', 60, 440);

    doc.fillColor(COLORS.success)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('OK - SITUATION SAINE', 60, 460);

    // CTA Section
    doc.rect(50, 510, 495, 120).fillAndStroke('#EDE9FE', COLORS.purple);

    doc.fillColor(COLORS.purple)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('PILOTEZ VOTRE TRESORERIE AVEC FINSIGHT', 60, 525);

    doc.fillColor('#000000')
        .fontSize(10)
        .font('Helvetica')
        .text('> Previsions de tresorerie 6 mois (scenarios optimiste/pessimiste)', 60, 555)
        .text('> Alertes automatiques avant rupture de cash', 60, 575)
        .text('> Simulations : "Et si je perds 20% de CA ?"', 60, 595);

    doc.fillColor(COLORS.purple)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('>> Essayer gratuitement : https://finsight.zineinsight.com', 60, 615, {
            link: 'https://finsight.zineinsight.com',
            underline: true
        });

    doc.end();
    console.log('✅ Dashboard Cash Flow PDF créé');
}

// ========================================
// Main execution
// ========================================
async function main() {
    console.log('🚀 Génération des templates PDF FinSight...\n');

    try {
        createBudgetPrevisionnelPDF();
        createTrackerDSOPDF();
        createDashboardCashFlowPDF();

        // Wait for files to be written
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('\n✨ Terminé ! Fichiers créés dans /public/templates/pdf/');
        console.log('\n📁 Fichiers générés :');
        console.log('   - budget-previsionnel-2025.pdf');
        console.log('   - tracker-dso.pdf');
        console.log('   - dashboard-cashflow.pdf');
    } catch (error) {
        console.error('❌ Erreur lors de la génération:', error);
        process.exit(1);
    }
}

main();

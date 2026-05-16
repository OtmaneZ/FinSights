#!/usr/bin/env node
/**
 * Générateur du Guide PDF : "Optimisez votre Cash Flow — Guide complet pour PME"
 * Lead magnet pour ExitIntentPopup
 *
 * Output: public/ressources/guides/guide-optimiser-cash-flow-pme.pdf
 * Usage:  node scripts/generate-guide-cash-flow.js
 *
 * Prérequis: npm install pdfkit (déjà installé)
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/ressources/guides');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'guide-optimiser-cash-flow-pme.pdf');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ── Palette FinSight ──────────────────────────────────────────────────────────
const C = {
    dark:    '#0f172a',   // Slate-900
    blue:    '#2563eb',   // Blue-600
    blueLight: '#dbeafe', // Blue-100
    green:   '#059669',   // Emerald-600
    greenLight: '#d1fae5',
    orange:  '#d97706',   // Amber-600
    orangeLight: '#fef3c7',
    gray:    '#64748b',   // Slate-500
    grayLight: '#f1f5f9', // Slate-100
    white:   '#ffffff',
    black:   '#1e293b',
    border:  '#e2e8f0',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const W  = 595.28;  // A4 width  (pt)
const H  = 841.89;  // A4 height (pt)
const ML = 52;      // margin left
const MR = 52;      // margin right
const CONTENT_W = W - ML - MR;

function addPage(doc) {
    doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });
}

function headerBar(doc, title, pageNum, total) {
    // Top bar
    doc.rect(0, 0, W, 36).fill(C.dark);
    doc.fillColor(C.white).font('Helvetica').fontSize(8)
        .text('FINSIGHT', ML, 13)
        .text(`Architecte de pilotage financier · PME 500k€–5M€`, ML + 60, 13)
        .text(`${pageNum} / ${total}`, W - MR - 25, 13);

    // Chapter title
    if (title) {
        doc.fillColor(C.dark).font('Helvetica-Bold').fontSize(11)
            .text(title, ML, 48, { width: CONTENT_W });
    }
}

function footerBar(doc) {
    doc.rect(0, H - 32, W, 32).fill(C.grayLight);
    doc.fillColor(C.gray).font('Helvetica').fontSize(7.5)
        .text('© 2026 FinSight — finsight.zineinsight.com  ·  Tous droits réservés  ·  Ce guide est fourni à titre informatif.', ML, H - 20, {
            width: CONTENT_W, align: 'center'
        });
}

function sectionTitle(doc, text, y) {
    doc.rect(ML - 4, y, 4, 18).fill(C.blue);
    doc.fillColor(C.dark).font('Helvetica-Bold').fontSize(13)
        .text(text, ML + 8, y, { width: CONTENT_W - 8 });
    return y + 26;
}

function paragraph(doc, text, y, options = {}) {
    doc.fillColor(options.color || C.black).font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(options.size || 9.5)
        .text(text, ML, y, { width: CONTENT_W, lineGap: 3, ...options });
    return y + doc.heightOfString(text, { width: CONTENT_W, lineGap: 3 }) + (options.after || 6);
}

function bullet(doc, text, y, indent = 0) {
    const bx = ML + indent;
    doc.rect(bx, y + 5, 5, 5).fill(C.blue);
    doc.fillColor(C.black).font('Helvetica').fontSize(9.5)
        .text(text, bx + 12, y, { width: CONTENT_W - 12 - indent, lineGap: 3 });
    return y + doc.heightOfString(text, { width: CONTENT_W - 12 - indent, lineGap: 3 }) + 6;
}

function callout(doc, label, text, y, color = C.blueLight, borderColor = C.blue) {
    const h = 18 + doc.heightOfString(text, { width: CONTENT_W - 32, lineGap: 3 });
    doc.rect(ML, y, CONTENT_W, h + 14).fillAndStroke(color, borderColor);
    doc.fillColor(borderColor).font('Helvetica-Bold').fontSize(8.5).text(label, ML + 10, y + 8);
    doc.fillColor(C.black).font('Helvetica').fontSize(9).text(text, ML + 10, y + 20, {
        width: CONTENT_W - 20, lineGap: 3
    });
    return y + h + 22;
}

function keyNumber(doc, value, label, x, y, w) {
    doc.rect(x, y, w, 70).fillAndStroke(C.blueLight, C.blue);
    doc.fillColor(C.blue).font('Helvetica-Bold').fontSize(22)
        .text(value, x, y + 10, { width: w, align: 'center' });
    doc.fillColor(C.dark).font('Helvetica').fontSize(8)
        .text(label, x + 6, y + 42, { width: w - 12, align: 'center', lineGap: 2 });
}

function tableRow(doc, cols, widths, y, isHeader = false, isAlt = false) {
    const rowH = 22;
    const bg = isHeader ? C.dark : isAlt ? C.grayLight : C.white;
    let x = ML;
    widths.forEach((w, i) => {
        doc.rect(x, y, w, rowH).fillAndStroke(bg, C.border);
        doc.fillColor(isHeader ? C.white : C.black)
            .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
            .fontSize(8.5)
            .text(cols[i] || '', x + 5, y + 7, { width: w - 10, lineGap: 0 });
        x += w;
    });
    return y + rowH;
}

// ── PAGE 1 — Couverture ───────────────────────────────────────────────────────
function page1(doc) {
    // Background
    doc.rect(0, 0, W, H).fill(C.dark);

    // Accent bar top
    doc.rect(0, 0, W, 6).fill(C.blue);

    // Logo area
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(14)
        .text('FINSIGHT', ML, 40);
    doc.fillColor(C.gray).font('Helvetica').fontSize(9)
        .text('Architecte de pilotage financier', ML, 58);

    // Badge
    doc.rect(ML, 110, 130, 24).fill(C.blue);
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(9)
        .text('GUIDE GRATUIT · PDF', ML + 8, 118);

    // Title
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(32)
        .text('Optimisez votre\nCash Flow', ML, 150, { width: 380, lineGap: 4 });
    doc.fillColor('#93c5fd').font('Helvetica-Bold').fontSize(24)
        .text('Le guide complet\npour PME', ML, 228, { width: 380, lineGap: 4 });

    // Sub
    doc.fillColor(C.gray).font('Helvetica').fontSize(10)
        .text('15 pages · Benchmarks Banque de France 2024 · Plan d\'action en 7 étapes', ML, 292, { width: 400 });

    // Separator
    doc.moveTo(ML, 330).lineTo(ML + 120, 330).lineWidth(2).stroke(C.blue);

    // Contents preview
    const items = [
        '01  Pourquoi le cash flow tue plus d\'entreprises que les pertes',
        '02  Les 3 flux à maîtriser : opérationnel, investissement, financement',
        '03  Calculer et interpréter votre BFR (avec benchmark BdF 2024)',
        '04  7 leviers actionnables pour réduire votre BFR',
        '05  Template de suivi de trésorerie 12 mois',
        '06  Plan d\'action en 7 étapes — PME 500k€–5M€',
        '07  Benchmarks sectoriels DSO / BFR (Banque de France)',
    ];
    let y = 350;
    items.forEach(item => {
        doc.fillColor(C.gray).font('Helvetica').fontSize(9).text('—', ML, y);
        doc.fillColor(C.white).font('Helvetica').fontSize(9).text(item, ML + 14, y, { width: 360 });
        y += 22;
    });

    // Author
    doc.rect(ML, 520, CONTENT_W, 1).fill('#1e3a5f');
    doc.fillColor(C.gray).font('Helvetica').fontSize(8)
        .text('Rédigé par', ML, 534);
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(10)
        .text('Otmane Boulahia', ML, 548);
    doc.fillColor(C.gray).font('Helvetica').fontSize(8.5)
        .text('Architecte de pilotage financier · PME 500k€–5M€ · finsight.zineinsight.com', ML, 564);

    // Bottom bar
    doc.rect(0, H - 50, W, 50).fill('#060f1e');
    doc.fillColor(C.gray).font('Helvetica').fontSize(7.5)
        .text('© 2026 FinSight — Ce guide est fourni à titre informatif et pédagogique. Les benchmarks proviennent de la Banque de France et de l\'INSEE.', ML, H - 36, {
            width: CONTENT_W, align: 'center'
        });
}

// ── PAGE 2 — Introduction + contexte ─────────────────────────────────────────
function page2(doc) {
    headerBar(doc, 'Introduction', 2, 15);
    footerBar(doc);
    let y = 70;

    y = sectionTitle(doc, 'Pourquoi ce guide ?', y);
    y += 4;
    y = paragraph(doc, `En France, 25 % des PME rentables déposent le bilan à cause d'un problème de trésorerie, non de rentabilité. Le cash flow n'est pas une notion comptable abstraite : c'est le pouls réel de votre entreprise. Ce guide vous donne les outils concrets pour le comprendre, le mesurer et surtout l'optimiser — sans jargon inutile.`, y);
    y += 8;

    // Key numbers
    keyNumber(doc, '25 %', 'des PME rentables\nen difficulté de trésorerie', ML, y, 145);
    keyNumber(doc, '60 j', 'DSO moyen\nsecteur services B2B', ML + 155, y, 145);
    keyNumber(doc, '45 j', 'BFR médian PME\nindustrielles (BdF 2024)', ML + 310, y, 145);
    y += 90;

    y = callout(doc, '💡 CE QUE VOUS ALLEZ APPRENDRE',
        'Les 3 flux qui composent votre cash flow · Comment calculer votre BFR · 7 leviers pour libérer du cash · Un plan d\'action immédiatement actionnable.',
        y);
    y += 4;

    y = sectionTitle(doc, 'À qui s\'adresse ce guide ?', y);
    y = paragraph(doc, `Ce guide est conçu pour les dirigeants et DAF de PME générant entre 500k€ et 5M€ de chiffre d'affaires, confrontés à l'un de ces symptômes :`, y);

    const symptoms = [
        'Trésorerie tendue malgré une activité en croissance',
        'Découverts bancaires récurrents en fin de mois',
        'Délais de paiement clients qui s\'allongent',
        'Difficulté à financer les investissements sans endettement excessif',
        'Absence de visibilité sur le cash à 90 jours',
    ];
    symptoms.forEach(s => { y = bullet(doc, s, y); });
    y += 8;

    y = callout(doc, '📌 NOTE IMPORTANTE',
        'Les benchmarks présentés dans ce guide proviennent des rapports de la Banque de France 2024 (Observatoire des délais de paiement, statistiques PME) et de l\'INSEE. Ils constituent des références sectorielles, pas des normes absolues.',
        y, C.orangeLight, C.orange);
}

// ── PAGE 3 — Les 3 flux du cash flow ─────────────────────────────────────────
function page3(doc) {
    headerBar(doc, 'Chapitre 1 · Les 3 flux du cash flow', 3, 15);
    footerBar(doc);
    let y = 70;

    y = sectionTitle(doc, 'Cash flow ≠ Résultat : la confusion qui coûte cher', y);
    y = paragraph(doc, `Une entreprise peut afficher un bénéfice comptable et être en rupture de cash le mois suivant. Pourquoi ? Parce que le résultat mesure la richesse créée, pas l'argent disponible. Une vente comptabilisée en décembre peut n'être encaissée qu'en mars.`, y);
    y += 6;

    y = callout(doc, '📊 EXEMPLE CONCRET',
        'PME B2B — 6 M€ CA — Résultat net : +180 k€ en T4\nMais : DSO à 62 jours → encaissements décalés de 2 mois\nRésultat : découvert bancaire de 95 k€ en janvier malgré la rentabilité.',
        y, C.grayLight, C.gray);
    y += 6;

    y = sectionTitle(doc, 'Les 3 composantes du cash flow', y);

    const flows = [
        ['Cash Flow Opérationnel (CFO)', 'L\'argent généré par l\'activité courante. C\'est le plus important. Il inclut les encaissements clients, les paiements fournisseurs, les salaires et charges. Un CFO négatif sur 3 trimestres est un signal d\'alarme majeur.', C.greenLight, C.green],
        ['Cash Flow d\'Investissement (CFI)', 'Les flux liés aux acquisitions/cessions d\'actifs (machines, logiciels, immobilier). Structurellement négatif dans une PME en croissance — c\'est normal. Attention si le CFI dépasse 40 % du CFO.', C.blueLight, C.blue],
        ['Cash Flow de Financement (CFF)', 'Les flux liés aux emprunts, remboursements, dividendes, augmentations de capital. À surveiller : un CFF positif chronique signifie que l\'entreprise vit de la dette pour financer son activité.', C.orangeLight, C.orange],
    ];

    flows.forEach(([title, desc, bg, border]) => {
        const h = 16 + doc.heightOfString(desc, { width: CONTENT_W - 24, lineGap: 2 });
        doc.rect(ML, y, CONTENT_W, h + 28).fillAndStroke(bg, border);
        doc.fillColor(border).font('Helvetica-Bold').fontSize(9.5).text(title, ML + 12, y + 10);
        doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text(desc, ML + 12, y + 24, { width: CONTENT_W - 24, lineGap: 2 });
        y += h + 36;
    });
}

// ── PAGE 4 — Calculer le BFR ──────────────────────────────────────────────────
function page4(doc) {
    headerBar(doc, 'Chapitre 2 · Calculer et interpréter votre BFR', 4, 15);
    footerBar(doc);
    let y = 70;

    y = sectionTitle(doc, 'La formule du BFR', y);
    // Formula box
    doc.rect(ML, y, CONTENT_W, 48).fill(C.dark);
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(14)
        .text('BFR = Créances clients + Stocks — Dettes fournisseurs', ML + 12, y + 17, { width: CONTENT_W - 24, align: 'center' });
    y += 62;

    y = paragraph(doc, `Le BFR (Besoin en Fonds de Roulement) représente le besoin de financement lié au cycle d'exploitation. Un BFR positif signifie que votre entreprise doit financer l'écart entre ce qu'elle a déjà payé et ce qu'elle n'a pas encore encaissé.`, y);
    y += 6;

    y = sectionTitle(doc, 'BFR en jours de CA — La mesure qui parle', y);
    y = paragraph(doc, 'Exprimer le BFR en jours de CA permet de comparer dans le temps et avec les benchmarks sectoriels :', y);

    doc.rect(ML, y, CONTENT_W, 36).fill(C.blueLight);
    doc.fillColor(C.blue).font('Helvetica-Bold').fontSize(11)
        .text('BFR en jours = (BFR / CA annuel) × 365', ML + 12, y + 12, { width: CONTENT_W - 24, align: 'center' });
    y += 50;

    y = callout(doc, '📊 EXEMPLE',
        'CA annuel : 8 M€  |  BFR : 1 100 k€\nBFR en jours = (1 100 000 / 8 000 000) × 365 = 50 jours\nInterprétation : votre entreprise doit financer 50 jours de CA en permanence.',
        y, C.greenLight, C.green);
    y += 6;

    y = sectionTitle(doc, 'Benchmarks BFR par secteur (Banque de France 2024)', y);
    y = paragraph(doc, 'Source : Banque de France — Observatoire des entreprises, données 2024', y, { color: C.gray, size: 8 });

    const headers = ['Secteur', 'BFR médian (jours CA)', 'BFR P75 (alerte)', 'DSO médian'];
    const rows = [
        ['Services B2B', '38 j', '55 j', '52 j'],
        ['Commerce de gros', '42 j', '62 j', '44 j'],
        ['Industrie manufacturière', '48 j', '70 j', '55 j'],
        ['BTP / Construction', '55 j', '80 j', '62 j'],
        ['Distribution / Retail', '22 j', '38 j', '18 j'],
        ['Tech / Logiciels', '28 j', '45 j', '48 j'],
    ];
    const widths = [160, 120, 100, 110];
    y = tableRow(doc, headers, widths, y, true);
    rows.forEach((row, i) => { y = tableRow(doc, row, widths, y, false, i % 2 === 1); });
    y += 8;

    y = callout(doc, '🎯 SEUIL D\'ALERTE',
        'Si votre BFR dépasse le P75 de votre secteur, vous absorbez trop de cash dans le cycle opérationnel. Sur 8 M€ de CA, chaque 10 jours de BFR supplémentaire représente ~220 k€ de cash immobilisé.',
        y, C.orangeLight, C.orange);
}

// ── PAGE 5 — DSO ──────────────────────────────────────────────────────────────
function page5(doc) {
    headerBar(doc, 'Chapitre 2 (suite) · Le DSO — Votre indicateur trésorerie n°1', 5, 15);
    footerBar(doc);
    let y = 70;

    y = sectionTitle(doc, 'Calculer votre DSO', y);

    doc.rect(ML, y, CONTENT_W, 36).fill(C.dark);
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(12)
        .text('DSO = (Créances clients / CA TTC) × Nombre de jours', ML + 12, y + 12, { width: CONTENT_W - 24, align: 'center' });
    y += 50;

    y = callout(doc, '📊 EXEMPLE',
        'Créances clients au bilan : 820 k€  |  CA TTC annuel : 6 M€\nDSO = (820 000 / 6 000 000) × 365 = 50 jours\nImpact : chaque réduction de 10 jours de DSO libère ~164 k€ de cash.',
        y, C.blueLight, C.blue);
    y += 8;

    y = sectionTitle(doc, 'Benchmarks DSO sectoriels (Banque de France 2024)', y);
    y = paragraph(doc, 'Source : Observatoire des délais de paiement — Banque de France 2024', y, { color: C.gray, size: 8 });

    const headers = ['Secteur', 'DSO médian', 'Objectif cible', 'Niveau critique'];
    const rows = [
        ['Services B2B / Conseil', '52 j', '≤ 45 j', '> 70 j'],
        ['Commerce de gros', '44 j', '≤ 38 j', '> 60 j'],
        ['Industrie', '55 j', '≤ 48 j', '> 72 j'],
        ['BTP / Construction', '62 j', '≤ 55 j', '> 80 j'],
        ['Distribution', '18 j', '≤ 15 j', '> 30 j'],
        ['Tech / SaaS', '48 j', '≤ 38 j', '> 65 j'],
    ];
    const widths = [160, 110, 110, 110];
    y = tableRow(doc, headers, widths, y, true);
    rows.forEach((row, i) => { y = tableRow(doc, row, widths, y, false, i % 2 === 1); });
    y += 8;

    y = sectionTitle(doc, 'Règle des 3 paliers', y);
    const paliers = [
        { label: '✅ DSO < médian secteur', desc: 'Situation saine. Focalisez sur les autres leviers du BFR.', color: C.green },
        { label: '⚠️  DSO entre médian et P75', desc: 'Zone d\'alerte. Mettre en place une politique de recouvrement formalisée.', color: C.orange },
        { label: '🚨 DSO > P75 secteur', desc: 'Zone critique. Impact direct sur la trésorerie et la capacité d\'investissement.', color: '#dc2626' },
    ];
    paliers.forEach(p => {
        doc.rect(ML, y, 5, 26).fill(p.color);
        doc.fillColor(C.dark).font('Helvetica-Bold').fontSize(9).text(p.label, ML + 12, y + 2, { width: CONTENT_W - 12 });
        doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text(p.desc, ML + 12, y + 14, { width: CONTENT_W - 12 });
        y += 34;
    });
}

// ── PAGE 6–12 — Les 7 leviers ─────────────────────────────────────────────────
const LEVIERS = [
    {
        num: '01', title: 'Réduire votre DSO par une politique de recouvrement structurée',
        gain: '-10 à -20 jours de DSO = +150 à 450 k€ sur 8 M€ CA',
        desc: 'Le recouvrement ad hoc est la première source de DSO élevé. Chaque facture doit avoir une date d\'échéance, une relance automatique à J-5, J+1 et J+15, et un responsable nommé.',
        actions: [
            'Segmenter les clients par risque (A/B/C) et adapter les conditions de paiement',
            'Implémenter des relances automatiques (email + SMS) avant et après échéance',
            'Mettre en place un tableau de suivi des impayés mis à jour chaque semaine',
            'Négocier des acomptes sur commandes > 50 k€ (30 % à la commande)',
            'Calculer le coût réel du crédit client (taux implicite de financement)',
        ],
        kpi: 'KPI : DSO hebdomadaire + taux de créances > 60 jours',
    },
    {
        num: '02', title: 'Optimiser les délais de paiement fournisseurs',
        gain: '+5 à +15 jours DPO = +100 à 330 k€ libérés sur 8 M€ CA',
        desc: 'Le DPO (Days Payable Outstanding) est le miroir du DSO. Allonger vos délais fournisseurs sans dégrader la relation est un levier de financement gratuit.',
        actions: [
            'Cartographier vos 20 fournisseurs clés et analyser les conditions actuelles',
            'Renégocier les délais sur les fournisseurs non stratégiques (passer de 30 à 45 jours)',
            'Utiliser les escomptes pour paiement anticipé quand le taux implicite est > coût de crédit',
            'Centraliser les paiements fournisseurs sur 2 dates fixes/mois (gain de trésorerie prévisible)',
        ],
        kpi: 'KPI : DPO mensuel par catégorie fournisseur',
    },
    {
        num: '03', title: 'Réduire les stocks au strict nécessaire',
        gain: '-15 à -25 jours de rotation = +300 à 550 k€ sur 8 M€ CA pour une PME industrielle',
        desc: 'Les stocks immobilisent du cash silencieusement. Une rotation améliorée de 20 % peut représenter plusieurs centaines de milliers d\'euros de cash libéré.',
        actions: [
            'Segmenter les stocks en ABC (valeur) × XYZ (variabilité de la demande)',
            'Éliminer les références à faible rotation (< 2 rotations/an)',
            'Négocier des livraisons just-in-time avec les fournisseurs stratégiques',
            'Mettre en place des seuils de réapprovisionnement automatiques',
            'Calculer le coût de portage (financement + assurance + espace = 15–25 % de la valeur stock)',
        ],
        kpi: 'KPI : Rotation des stocks (jours) + valeur stock vs CA',
    },
    {
        num: '04', title: 'Mettre en place un prévisionnel de trésorerie 90 jours',
        gain: 'Réduction des incidents bancaires de 60 à 80 % en moyenne',
        desc: 'Un prévisionnel de trésorerie n\'est pas une option dans une PME en croissance — c\'est la différence entre anticiper une tension et subir une crise. La règle : le voir avant qu\'il arrive.',
        actions: [
            'Construire un modèle de trésorerie hebdomadaire sur 13 semaines (template fourni page 11)',
            'Alimenter le modèle chaque lundi matin (30 minutes maximum)',
            'Intégrer les variations saisonnières et les échéances fiscales/sociales connues',
            'Définir 2 scénarios : optimiste (DSO actuel) et pessimiste (DSO + 15 jours)',
            'Déclencher les lignes de crédit court terme avant la tension, pas pendant',
        ],
        kpi: 'KPI : Écart prévisionnel vs réel sur 4 semaines glissantes',
    },
    {
        num: '05', title: 'Facturer rapidement — La règle des 48h',
        gain: '-3 à -8 jours de DSO structurel = +60 à 175 k€ sur 8 M€ CA',
        desc: 'Chaque jour de retard à la facturation est un jour de crédit client gratuit non voulu. La règle : la facture part dans les 48h suivant la livraison ou la fin de prestation, sans exception.',
        actions: [
            'Auditer le délai moyen entre livraison et émission de facture (souvent 5 à 15 jours)',
            'Automatiser l\'émission des factures récurrentes (abonnements, forfaits mensuels)',
            'Facturer en plusieurs fois sur les projets longs (jalons contractuels)',
            'Envoyer les factures en PDF + accès portail client pour validation immédiate',
        ],
        kpi: 'KPI : Délai moyen facturation (jours entre livraison et envoi facture)',
    },
    {
        num: '06', title: 'Optimiser la structure de financement du cycle d\'exploitation',
        gain: 'Réduction du coût de financement de 0,5 à 1,5 % du CA',
        desc: 'La plupart des PME utilisent le découvert bancaire comme financement de BFR — c\'est le plus cher (souvent 8–12 % annualisé). Des alternatives structurées existent.',
        actions: [
            'Mettre en place une ligne de crédit court terme dédiée au BFR (Dailly, RCF) avant d\'en avoir besoin',
            'Évaluer l\'affacturage (factor) pour les créances > 60 jours sur clients grands comptes',
            'Négocier un crédit de campagne si activité saisonnière marquée',
            'Calculer le taux implicite du découvert vs les alternatives de financement',
            'Cartographier les garanties disponibles (BPI, Siagi) pour sécuriser les lignes',
        ],
        kpi: 'KPI : Coût moyen du financement court terme (% annualisé)',
    },
    {
        num: '07', title: 'Instaurer un reporting trésorerie hebdomadaire',
        gain: 'Réduction du temps de détection des dérives : de 6 à 8 semaines à 1 semaine',
        desc: 'Ce qui ne se mesure pas ne s\'améliore pas. Un reporting trésorerie hebdomadaire de 1 page, partagé avec la direction, est le meilleur système d\'alerte précoce qui existe.',
        actions: [
            'Définir 5 indicateurs hebdomadaires : trésorerie nette, DSO, BFR, prévisionnel 4 semaines, écart S-1',
            'Automatiser la collecte depuis le logiciel comptable (exports hebdomadaires)',
            'Envoyer le rapport chaque lundi avant 9h — sans exception',
            'Mettre en place des seuils d\'alerte automatiques (ex: trésorerie < seuil critique)',
            'Analyser les écarts budget/réel mensuellement pour améliorer le modèle prévisionnel',
        ],
        kpi: 'KPI : Trésorerie nette hebdomadaire + DSO rolling 4 semaines',
    },
];

function pageLevierIntro(doc) {
    headerBar(doc, 'Chapitre 3 · Les 7 leviers pour optimiser votre cash flow', 6, 15);
    footerBar(doc);
    let y = 70;

    y = sectionTitle(doc, 'Vue d\'ensemble des 7 leviers', y);
    y = paragraph(doc, `Ces 7 leviers couvrent l'ensemble du cycle de trésorerie d'une PME. Chacun est indépendant et peut être activé séparément. La priorité dépend de votre diagnostic (voir benchmarks pages 4–5). En règle générale : commencez par le levier 1 (DSO) — il offre le retour sur effort le plus rapide.`, y);
    y += 8;

    LEVIERS.forEach((l, i) => {
        doc.rect(ML, y, CONTENT_W, 34).fill(i % 2 === 0 ? C.grayLight : C.white);
        doc.rect(ML, y, 36, 34).fill(C.dark);
        doc.fillColor(C.white).font('Helvetica-Bold').fontSize(14).text(l.num, ML, y + 8, { width: 36, align: 'center' });
        doc.fillColor(C.dark).font('Helvetica-Bold').fontSize(9).text(l.title, ML + 44, y + 4, { width: CONTENT_W - 80 });
        doc.fillColor(C.green).font('Helvetica').fontSize(8).text(l.gain, ML + 44, y + 18, { width: CONTENT_W - 80 });
        y += 36;
    });
    y += 8;

    y = callout(doc, '⚡ RÈGLE DES 80/20',
        'Sur les 7 leviers, les leviers 1 (DSO), 4 (prévisionnel) et 7 (reporting) génèrent typiquement 80 % des gains de trésorerie. Commencez par ceux-là avant de vous attaquer aux stocks ou au financement.',
        y, C.blueLight, C.blue);
}

function pageLevier(doc, levier, pageNum) {
    headerBar(doc, `Levier ${levier.num} · ${levier.title.substring(0, 55)}${levier.title.length > 55 ? '...' : ''}`, pageNum, 15);
    footerBar(doc);
    let y = 70;

    // Title card
    doc.rect(ML, y, CONTENT_W, 52).fill(C.dark);
    doc.rect(ML, y, 44, 52).fill(C.blue);
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(20).text(levier.num, ML, y + 14, { width: 44, align: 'center' });
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(10).text(levier.title, ML + 52, y + 10, { width: CONTENT_W - 62, lineGap: 2 });
    doc.fillColor('#93c5fd').font('Helvetica').fontSize(8).text('📈 ' + levier.gain, ML + 52, y + 38, { width: CONTENT_W - 62 });
    y += 66;

    y = paragraph(doc, levier.desc, y);
    y += 6;

    y = sectionTitle(doc, 'Actions à mettre en place', y);
    levier.actions.forEach(a => { y = bullet(doc, a, y); });
    y += 6;

    // KPI
    doc.rect(ML, y, CONTENT_W, 30).fill(C.grayLight);
    doc.fillColor(C.blue).font('Helvetica-Bold').fontSize(8.5).text('🎯 ' + levier.kpi, ML + 10, y + 10, { width: CONTENT_W - 20 });
}

// ── PAGE 13 — Template de suivi trésorerie ────────────────────────────────────
function page13(doc) {
    headerBar(doc, 'Chapitre 4 · Template de suivi de trésorerie 12 semaines', 13, 15);
    footerBar(doc);
    let y = 70;

    y = sectionTitle(doc, 'Comment utiliser ce template', y);
    y = paragraph(doc, `Complétez ce tableau chaque lundi. La colonne "Réel" est remplie après les mouvements ; la colonne "Prévu" est estimée 4 semaines à l'avance. L'écart vous permet d'affiner le modèle et d'anticiper les tensions.`, y);
    y += 6;

    // Mini-template
    const headers = ['Semaine', 'Tréso. départ', 'Encaissements', 'Décaissements', 'Tréso. fin', 'Prévu', 'Écart'];
    const semaines = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12'];
    const colW = [52, 72, 80, 80, 72, 62, 68];
    y = tableRow(doc, headers, colW, y, true);
    semaines.forEach((s, i) => {
        y = tableRow(doc, [s, '___', '___', '___', '___', '___', '___'], colW, y, false, i % 2 === 1);
    });
    y += 10;

    y = sectionTitle(doc, 'Indicateurs clés à suivre chaque semaine', y);
    const kpis = [
        ['Trésorerie nette', 'Soldes bancaires consolidés — objectif : > seuil critique défini'],
        ['DSO rolling 4 semaines', 'Recalculer toutes les 4 semaines — alerte si > médian secteur'],
        ['Prévision J+28', 'Cash disponible dans 4 semaines — scénario central'],
        ['Écart prévisionnel', 'Réel vs prévu S-1 — identifier les sources d\'erreur'],
    ];
    const kpiW = [160, CONTENT_W - 160];
    y = tableRow(doc, ['Indicateur', 'Description / Règle de gestion'], kpiW, y, true);
    kpis.forEach((row, i) => { y = tableRow(doc, row, kpiW, y, false, i % 2 === 1); });
    y += 8;

    y = callout(doc, '📥 VERSION EXCEL DU TEMPLATE',
        'Téléchargez la version Excel complète de ce template sur :\nfinsight.zineinsight.com/templates/previsionnel-tresorerie-90j\n\nLe fichier inclut : formules automatiques, graphiques, scénarios optimiste/pessimiste et alertes conditionnelles.',
        y, C.blueLight, C.blue);
}

// ── PAGE 14 — Plan d'action en 7 étapes ──────────────────────────────────────
function page14(doc) {
    headerBar(doc, 'Chapitre 5 · Plan d\'action en 7 étapes', 14, 15);
    footerBar(doc);
    let y = 70;

    y = sectionTitle(doc, 'Votre roadmap 90 jours', y);
    y = paragraph(doc, `Ce plan d'action est séquencé pour maximiser l'impact sur la trésorerie en 90 jours. Chaque étape est indépendante mais les 3 premières sont prioritaires.`, y);
    y += 6;

    const steps = [
        { phase: 'J0–J7', title: 'Photographier la situation', actions: 'Calculer DSO, BFR, DPO actuels · Comparer aux benchmarks sectoriels · Identifier les 3 tensions principales' },
        { phase: 'J7–J21', title: 'Mettre en place le prévisionnel', actions: 'Démarrer le template 12 semaines · Identifier les 5 encaissements et décaissements majeurs à venir · Définir le seuil de trésorerie critique' },
        { phase: 'J14–J30', title: 'Activer le recouvrement', actions: 'Segmenter les créances par ancienneté · Lancer les relances systématiques · Appeler les 3 plus gros impayés' },
        { phase: 'J21–J45', title: 'Renégocier les délais fournisseurs', actions: 'Cartographier le top 10 fournisseurs · Négocier +10 à +15 jours sur les non-stratégiques · Calculer le gain de trésorerie' },
        { phase: 'J30–J60', title: 'Accélérer la facturation', actions: 'Auditer le délai facturation actuel · Implémenter la règle des 48h · Automatiser les factures récurrentes' },
        { phase: 'J45–J75', title: 'Sécuriser le financement', actions: 'Évaluer les lignes court terme disponibles · Mettre en place une RCF ou ligne Dailly · Déclencher avant la tension' },
        { phase: 'J60–J90', title: 'Installer le reporting hebdo', actions: 'Définir les 5 indicateurs hebdomadaires · Automatiser la collecte · Partager chaque lundi à 9h' },
    ];

    steps.forEach((s, i) => {
        const h = 18 + doc.heightOfString(s.actions, { width: CONTENT_W - 130, lineGap: 2 });
        const bg = i % 2 === 0 ? C.grayLight : C.white;
        doc.rect(ML, y, CONTENT_W, h + 14).fillAndStroke(bg, C.border);
        // Phase badge
        doc.rect(ML, y, 82, h + 14).fill(C.dark);
        doc.fillColor(C.white).font('Helvetica-Bold').fontSize(8).text(s.phase, ML + 4, y + 5, { width: 74, align: 'center' });
        doc.fillColor('#93c5fd').font('Helvetica').fontSize(7.5).text(`Étape ${i + 1}`, ML + 4, y + 18, { width: 74, align: 'center' });
        // Content
        doc.fillColor(C.dark).font('Helvetica-Bold').fontSize(9).text(s.title, ML + 92, y + 5, { width: CONTENT_W - 102 });
        doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text(s.actions, ML + 92, y + 18, { width: CONTENT_W - 102, lineGap: 2 });
        y += h + 16;
    });
}

// ── PAGE 15 — CTA final ───────────────────────────────────────────────────────
function page15(doc) {
    // Dark background
    doc.rect(0, 0, W, H).fill(C.dark);
    doc.rect(0, 0, W, 6).fill(C.blue);

    // Logo
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(14).text('FINSIGHT', ML, 40);
    doc.fillColor(C.gray).font('Helvetica').fontSize(9).text('Architecte de pilotage financier · PME 500k€–5M€', ML, 58);

    // Separator
    doc.rect(ML, 82, CONTENT_W, 1).fill('#1e3a5f');

    // Headline
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(24)
        .text('Vous avez le guide.\nPassons à l\'action.', ML, 100, { width: 400, lineGap: 4 });

    doc.fillColor(C.gray).font('Helvetica').fontSize(10)
        .text('Un diagnostic personnalisé de 90 jours pour identifier vos leviers prioritaires, chiffrer les gains et mettre en place le système de pilotage adapté à votre PME.', ML, 164, { width: 380, lineGap: 3 });

    doc.rect(ML, 220, CONTENT_W, 1).fill('#1e3a5f');

    // Offres
    const offres = [
        {
            title: 'Diagnostic FinSight™ 90J',
            price: '2 490 € HT',
            desc: '90 jours · Score financier sur 4 piliers · 3 leviers chiffrés · Feuille de route',
        },
        {
            title: 'Audit Complet',
            price: '6 990 € HT',
            desc: '6 mois · Diagnostic + implémentation + reporting · DAF temps partiel inclus',
        },
        {
            title: 'Decision System',
            price: '12 500 € HT',
            desc: 'Mission complète · Système de pilotage complet · Accompagnement direction',
        },
    ];

    let y = 236;
    offres.forEach((o, i) => {
        const isFeatured = i === 0;
        doc.rect(ML, y, CONTENT_W, 52).fill(isFeatured ? '#0f2a4a' : '#0a1628');
        if (isFeatured) doc.rect(ML, y, 3, 52).fill(C.blue);
        doc.fillColor(C.white).font('Helvetica-Bold').fontSize(10).text(o.title, ML + 12, y + 8, { width: CONTENT_W - 120 });
        doc.fillColor(C.blue).font('Helvetica-Bold').fontSize(10).text(o.price, W - MR, y + 8, { width: 90, align: 'right' });
        doc.fillColor(C.gray).font('Helvetica').fontSize(8.5).text(o.desc, ML + 12, y + 24, { width: CONTENT_W - 16, lineGap: 2 });
        y += 56;
    });

    y += 10;
    // CTA buttons
    doc.rect(ML, y, 200, 38).fill(C.blue);
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(10)
        .text('Réserver un échange 30 min', ML + 12, y + 13, { width: 176 });

    doc.rect(ML + 215, y, 190, 38).fillAndStroke('#0f172a', '#1e3a5f');
    doc.fillColor(C.gray).font('Helvetica').fontSize(9)
        .text('Diagnostic en ligne — 10 min', ML + 227, y + 14, { width: 166 });

    y += 55;

    doc.fillColor(C.gray).font('Helvetica').fontSize(8)
        .text('calendly.com/zineinsight  ·  finsight.zineinsight.com/diagnostic/guide', ML, y);

    // Divider
    y += 25;
    doc.rect(ML, y, CONTENT_W, 1).fill('#1e3a5f');
    y += 12;

    // Tools gratuits
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(9).text('Outils gratuits disponibles maintenant :', ML, y);
    y += 16;
    const tools = [
        'Calculateur DSO — finsight.zineinsight.com/calculateurs/dso',
        'Calculateur BFR — finsight.zineinsight.com/calculateurs/bfr',
        'Template trésorerie Excel — finsight.zineinsight.com/templates/previsionnel-tresorerie-90j',
        'Diagnostic en ligne (10 min) — finsight.zineinsight.com/diagnostic/guide',
    ];
    tools.forEach(t => {
        doc.rect(ML, y + 5, 4, 4).fill(C.blue);
        doc.fillColor(C.gray).font('Helvetica').fontSize(8.5).text(t, ML + 12, y, { width: CONTENT_W - 12 });
        y += 18;
    });

    // Footer
    doc.rect(0, H - 40, W, 40).fill('#060f1e');
    doc.fillColor(C.gray).font('Helvetica').fontSize(7)
        .text('© 2026 FinSight — otmane@zineinsight.com — finsight.zineinsight.com  ·  Ce guide est fourni à titre informatif. Les benchmarks proviennent de la Banque de France et de l\'INSEE.', ML, H - 24, {
            width: CONTENT_W, align: 'center'
        });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    console.log('📄 Génération du guide "Optimisez votre Cash Flow — PME" ...\n');

    const doc = new PDFDocument({
        size: 'A4',
        autoFirstPage: false,
        info: {
            Title:    'Optimisez votre Cash Flow — Guide complet pour PME',
            Author:   'Otmane Boulahia — FinSight',
            Subject:  'Cash flow, BFR, DSO, trésorerie PME — 7 leviers actionnables',
            Keywords: 'cash flow, BFR, DSO, trésorerie, PME, guide, benchmarks banque de france',
            Creator:  'FinSight — finsight.zineinsight.com',
        },
        compress: true,
    });

    const stream = fs.createWriteStream(OUTPUT_FILE);
    doc.pipe(stream);

    // Page 1 — Couverture
    doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });
    page1(doc);

    // Page 2 — Introduction
    addPage(doc); page2(doc);

    // Page 3 — Les 3 flux
    addPage(doc); page3(doc);

    // Page 4 — BFR
    addPage(doc); page4(doc);

    // Page 5 — DSO
    addPage(doc); page5(doc);

    // Page 6 — Vue d'ensemble leviers
    addPage(doc); pageLevierIntro(doc);

    // Pages 7–13 — Levier par levier
    LEVIERS.forEach((l, i) => {
        addPage(doc);
        pageLevier(doc, l, 7 + i);
    });

    // Page 14 — Template
    addPage(doc); page13(doc);

    // Page 15 — Plan d'action
    addPage(doc); page14(doc);

    // Page 15 — CTA
    addPage(doc); page15(doc);

    doc.end();

    await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
    });

    console.log(`✅ PDF généré : ${OUTPUT_FILE}`);
    console.log(`📏 Taille : ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(0)} KB`);
    console.log(`\n🌐 Accessible sur : https://finsight.zineinsight.com/ressources/guides/guide-optimiser-cash-flow-pme.pdf`);
}

main().catch(err => {
    console.error('❌ Erreur :', err.message);
    process.exit(1);
});

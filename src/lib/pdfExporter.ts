/**
 * EXPORT PDF PROFESSIONNEL
 *
 * Génération de rapports financiers de qualité DAF/CFO
 * - Page de couverture avec logo
 * - Table des matières
 * - KPIs avec graphiques
 * - Section méthodologie
 * - Footer professionnel sur chaque page
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FINSIGHT_LOGO_BASE64 } from './logo';

export interface PDFExportOptions {
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
    }>;
    includeCharts: boolean;
    includeMethodology: boolean;
    confidential: boolean;
}

export class FinancialPDFExporter {
    private pdf: jsPDF;
    private pageWidth: number;
    private pageHeight: number;
    private margin: number = 20;
    private currentY: number = 20;
    private pageNumber: number = 1;
    private footerHeight: number = 15;

    // Couleurs FinSight
    private colors = {
        primary: '#0066FF',      // Bleu principal
        secondary: '#00D4AA',    // Vert/turquoise
        dark: '#1E293B',         // Gris foncé
        light: '#F8FAFC',        // Gris clair
        text: '#334155',         // Texte
        border: '#E2E8F0'        // Bordure
    };

    constructor() {
        this.pdf = new jsPDF('p', 'mm', 'a4');
        this.pageWidth = this.pdf.internal.pageSize.getWidth();
        this.pageHeight = this.pdf.internal.pageSize.getHeight();
    }

    /**
     * Page de couverture professionnelle
     */
    private addCoverPage(options: PDFExportOptions) {
        const { companyName } = options;

        // Header avec logo - on charge l'image directement
        try {
            // Chemin relatif depuis la racine du projet
            const logoPath = '/images/logo.png';
            this.pdf.addImage(logoPath, 'PNG', this.margin, 20, 40, 40);
        } catch (e) {
            // Fallback: texte si l'image ne charge pas
            this.pdf.setFontSize(32);
            this.pdf.setTextColor(0, 102, 255);
            this.pdf.text('FinSight', this.margin, 40);
        }

        // Ligne de séparation
        this.pdf.setDrawColor(0, 102, 255);
        this.pdf.setLineWidth(1);
        this.pdf.line(this.margin, 70, this.pageWidth - this.margin, 70);

        // Titre principal
        this.pdf.setFontSize(28);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(30, 41, 59);
        this.pdf.text('Rapport Financier', this.pageWidth / 2, 100, { align: 'center' });

        // Nom de l'entreprise
        this.pdf.setFontSize(18);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setTextColor(71, 85, 105);
        this.pdf.text(companyName, this.pageWidth / 2, 120, { align: 'center' });

        // Période du rapport
        this.pdf.setFontSize(14);
        this.pdf.setTextColor(100, 116, 139);
        const periodText = `Periode: ${options.reportPeriod.start.toLocaleDateString('fr-FR')} - ${options.reportPeriod.end.toLocaleDateString('fr-FR')}`;
        this.pdf.text(periodText, this.pageWidth / 2, 135, { align: 'center' });

        // Informations du rapport
        const infoY = 170;
        this.pdf.setFontSize(10);
        this.pdf.setTextColor(100, 116, 139);

        const infoLines = [
            `Date : ${new Date().toLocaleDateString('fr-FR')}`,
            `Type : Analyse Financiere Augmentee`,
            `Confidentialite : ${options.confidential ? 'Document confidentiel' : 'Document interne'}`,
            `Genere par : FinSight AI Platform`
        ];

        infoLines.forEach((line, index) => {
            this.pdf.text(line, this.pageWidth / 2, infoY + (index * 8), { align: 'center' });
        });

        // Footer
        this.pdf.setFontSize(8);
        this.pdf.setTextColor(148, 163, 184);
        this.pdf.text(
            'Ce document contient des informations confidentielles',
            this.pageWidth / 2,
            this.pageHeight - 20,
            { align: 'center' }
        );

        this.addPageFooter();
    }

    /**
     * Table des matières
     */
    private addTableOfContents(options: PDFExportOptions) {
        this.pdf.addPage();
        this.pageNumber++;
        this.currentY = this.margin;

        // Titre
        this.pdf.setFontSize(20);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(30, 41, 59);
        this.pdf.text('Sommaire', this.margin, this.currentY);
        this.currentY += 15;

        // Ligne de séparation
        this.pdf.setDrawColor(0, 102, 255);
        this.pdf.setLineWidth(1);
        this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
        this.currentY += 10;

        // Sections
        const sections = [
            { title: '1. Indicateurs Clés de Performance (KPIs)', page: 3 },
            { title: '2. Analyse Graphique', page: 4, condition: options.includeCharts },
            { title: '3. Méthodologie et Formules', page: 5, condition: options.includeMethodology },
            { title: '4. Recommandations', page: 6 }
        ].filter(section => section.condition !== false);

        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setTextColor(51, 65, 85);

        sections.forEach(section => {
            // Titre de section
            this.pdf.text(section.title, this.margin + 5, this.currentY);

            // Points de suspension
            const dots = '...................................................................';
            this.pdf.setTextColor(148, 163, 184);
            this.pdf.text(dots, this.margin + 80, this.currentY);

            // Numéro de page
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.setTextColor(0, 102, 255);
            this.pdf.text(`p.${section.page}`, this.pageWidth - this.margin - 10, this.currentY);

            this.pdf.setFont('helvetica', 'normal');
            this.pdf.setTextColor(51, 65, 85);
            this.currentY += 10;
        });

        this.addPageFooter();
    }

    /**
     * Page KPIs
     */
    private addKPIsPage(options: PDFExportOptions) {
        this.pdf.addPage();
        this.pageNumber++;
        this.currentY = this.margin;

        // Titre
        this.pdf.setFontSize(18);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(30, 41, 59);
        this.pdf.text('Indicateurs Clés de Performance', this.margin, this.currentY);
        this.currentY += 12;

        // KPIs en grille 2x2
        const kpiWidth = (this.pageWidth - (3 * this.margin)) / 2;
        const kpiHeight = 35;
        let col = 0;
        let row = 0;

        options.kpis.forEach((kpi, index) => {
            const x = this.margin + (col * (kpiWidth + this.margin));
            const y = this.currentY + (row * (kpiHeight + 10));

            // Carte KPI
            this.pdf.setFillColor(248, 250, 252);
            this.pdf.setDrawColor(226, 232, 240);
            this.pdf.roundedRect(x, y, kpiWidth, kpiHeight, 3, 3, 'FD');

            // Titre KPI
            this.pdf.setFontSize(11);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.setTextColor(71, 85, 105);
            this.pdf.text(kpi.title, x + 5, y + 8);

            // Valeur
            this.pdf.setFontSize(18);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.setTextColor(0, 102, 255);
            this.pdf.text(kpi.value, x + 5, y + 20);

            // Variation
            this.pdf.setFontSize(10);
            this.pdf.setFont('helvetica', 'normal');
            this.pdf.setTextColor(34, 197, 94); // Vert
            this.pdf.text(kpi.change, x + 5, y + 28);

            // Description
            this.pdf.setFontSize(8);
            this.pdf.setTextColor(100, 116, 139);
            const descLines = this.pdf.splitTextToSize(kpi.description, kpiWidth - 10);
            this.pdf.text(descLines[0] || '', x + 5, y + 33);

            // Passage à la colonne/ligne suivante
            col++;
            if (col >= 2) {
                col = 0;
                row++;
            }
        });

        this.currentY = this.currentY + Math.ceil(options.kpis.length / 2) * (kpiHeight + 10) + 20;
        this.addPageFooter();
    }

    /**
     * Page méthodologie
     */
    private addMethodologyPage() {
        this.pdf.addPage();
        this.pageNumber++;
        this.currentY = this.margin;

        // Titre
        this.pdf.setFontSize(18);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(30, 41, 59);
        this.pdf.text('Méthodologie & Formules', this.margin, this.currentY);
        this.currentY += 12;

        // Intro
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setTextColor(71, 85, 105);
        const intro = 'Les calculs suivent les standards comptables français (Plan Comptable Général 2025) et les normes IFRS internationales.';
        const introLines = this.pdf.splitTextToSize(intro, this.pageWidth - (2 * this.margin));
        this.pdf.text(introLines, this.margin, this.currentY);
        this.currentY += 15;

        // Formules principales
        const formulas = [
            {
                name: 'DSO (Days Sales Outstanding)',
                formula: 'DSO = (Créances clients / Chiffre d\'affaires) × 365',
                description: 'Délai moyen de paiement des clients en jours'
            },
            {
                name: 'BFR (Besoin en Fonds de Roulement)',
                formula: 'BFR = Stocks + Créances clients - Dettes fournisseurs',
                description: 'Montant nécessaire pour financer le cycle d\'exploitation'
            },
            {
                name: 'Marge Nette',
                formula: 'Marge Nette (%) = ((CA - Total charges) / CA) × 100',
                description: 'Rentabilité après déduction de toutes les charges'
            },
            {
                name: 'Cash Flow',
                formula: 'Cash Flow = Encaissements - Décaissements',
                description: 'Flux de trésorerie net sur la période'
            }
        ];

        formulas.forEach(item => {
            // Encadré formule
            const boxHeight = 25;
            this.pdf.setFillColor(239, 246, 255);
            this.pdf.setDrawColor(191, 219, 254);
            this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), boxHeight, 2, 2, 'FD');

            // Nom
            this.pdf.setFontSize(11);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.setTextColor(30, 58, 138);
            this.pdf.text(item.name, this.margin + 5, this.currentY + 7);

            // Formule
            this.pdf.setFontSize(9);
            this.pdf.setFont('courier', 'normal');
            this.pdf.setTextColor(0, 102, 255);
            this.pdf.text(item.formula, this.margin + 5, this.currentY + 14);

            // Description
            this.pdf.setFontSize(8);
            this.pdf.setFont('helvetica', 'italic');
            this.pdf.setTextColor(100, 116, 139);
            this.pdf.text(item.description, this.margin + 5, this.currentY + 20);

            this.currentY += boxHeight + 5;
        });

        // Sources
        this.currentY += 10;
        this.pdf.setFontSize(9);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(51, 65, 85);
        this.pdf.text('Références :', this.margin, this.currentY);

        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setTextColor(100, 116, 139);
        const refs = [
            '• Plan Comptable Général (PCG) 2025',
            '• Normes IFRS (International Financial Reporting Standards)',
            '• Standards DFCG (Directeurs Financiers et Contrôleurs de Gestion)'
        ];

        refs.forEach((ref, index) => {
            this.pdf.text(ref, this.margin + 5, this.currentY + 7 + (index * 5));
        });

        this.addPageFooter();
    }

    /**
     * Footer professionnel sur chaque page
     */
    private addPageFooter() {
        const y = this.pageHeight - this.footerHeight;

        // Ligne de séparation
        this.pdf.setDrawColor(226, 232, 240);
        this.pdf.setLineWidth(0.3);
        this.pdf.line(this.margin, y, this.pageWidth - this.margin, y);

        // Footer gauche
        this.pdf.setFontSize(8);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setTextColor(148, 163, 184);
        this.pdf.text('FinSight © 2025', this.margin, y + 8);

        // Footer centre
        this.pdf.text('CONFIDENTIEL - Usage interne uniquement', this.pageWidth / 2 - 40, y + 8);

        // Footer droite - Numéro de page
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(`Page ${this.pageNumber}`, this.pageWidth - this.margin - 15, y + 8);
    }

    /**
     * Génération complète du PDF
     */
    public async generate(options: PDFExportOptions): Promise<jsPDF> {
        // 1. Page de couverture
        this.addCoverPage(options);

        // 2. Table des matières
        this.addTableOfContents(options);

        // 3. KPIs
        this.addKPIsPage(options);

        // 4. Graphiques (si demandé)
        if (options.includeCharts) {
            await this.addChartsPage();
        }

        // 5. Méthodologie
        if (options.includeMethodology) {
            this.addMethodologyPage();
        }

        return this.pdf;
    }

    /**
     * Capture et ajout des graphiques dans le PDF
     */
    private async addChartsPage(): Promise<void> {
        this.pdf.addPage();
        this.pageNumber++;
        this.currentY = this.margin;

        // Titre de la page
        this.pdf.setFontSize(24);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(30, 41, 59);
        this.pdf.text('Graphiques d\'Analyse', this.margin, this.currentY);

        this.currentY += 15;

        try {
            // Chercher les graphiques dans le DOM
            const chartElements = [
                { id: 'cash-flow-chart', title: 'Évolution Trésorerie' },
                { id: 'dso-client-chart', title: 'DSO par Client' },
                { id: 'margin-analysis-chart', title: 'Analyse des Marges' }
            ];

            let chartsAdded = 0;

            for (const chart of chartElements) {
                const element = document.getElementById(chart.id);

                if (element) {
                    // Titre du graphique
                    this.pdf.setFontSize(14);
                    this.pdf.setFont('helvetica', 'bold');
                    this.pdf.setTextColor(51, 65, 85);
                    this.pdf.text(chart.title, this.margin, this.currentY);

                    this.currentY += 8;

                    // Capturer le graphique avec html2canvas
                    const canvas = await html2canvas(element, {
                        scale: 2,
                        backgroundColor: '#ffffff',
                        logging: false,
                    });

                    // Convertir en image
                    const imgData = canvas.toDataURL('image/png');

                    // Calculer dimensions pour garder le ratio
                    const imgWidth = this.pageWidth - 2 * this.margin;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    // Vérifier si on a assez d'espace, sinon nouvelle page
                    if (this.currentY + imgHeight > this.pageHeight - this.footerHeight - 10) {
                        this.addPageFooter();
                        this.pdf.addPage();
                        this.pageNumber++;
                        this.currentY = this.margin;
                    }

                    // Ajouter l'image
                    this.pdf.addImage(imgData, 'PNG', this.margin, this.currentY, imgWidth, imgHeight);

                    this.currentY += imgHeight + 15;
                    chartsAdded++;
                } else {
                    console.warn(`Graphique "${chart.id}" non trouvé dans le DOM`);
                }
            }

            if (chartsAdded === 0) {
                // Aucun graphique trouvé, afficher un message
                this.pdf.setFontSize(12);
                this.pdf.setFont('helvetica', 'normal');
                this.pdf.setTextColor(148, 163, 184);
                this.pdf.text('Aucun graphique disponible pour le moment.', this.margin, this.currentY);
            }
        } catch (error) {
            console.error('Erreur lors de la capture des graphiques:', error);

            // Message d'erreur dans le PDF
            this.pdf.setFontSize(12);
            this.pdf.setFont('helvetica', 'normal');
            this.pdf.setTextColor(239, 68, 68);
            this.pdf.text('Erreur lors de la capture des graphiques.', this.margin, this.currentY);
        }

        this.addPageFooter();
    }

    /**
     * Téléchargement du PDF
     */
    public download(filename: string = 'rapport-financier-finsight.pdf') {
        this.pdf.save(filename);
    }

    /**
     * Obtenir le PDF en blob
     */
    public getBlob(): Blob {
        return this.pdf.output('blob');
    }
}

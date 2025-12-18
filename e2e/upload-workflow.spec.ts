/**
 * Test E2E - Upload CSV → Score → Dashboard
 * Objectif : Valider workflow critique utilisateur
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Workflow Upload → Score → Dashboard', () => {
    test('utilisateur upload CSV, obtient score, voit dashboard', async ({ page }) => {
        // 1. Accéder à la page démo
        await page.goto('/demo');
        await expect(page).toHaveTitle(/FinSight/);

        // 2. Trouver le bouton d'upload
        const uploadButton = page.locator('button:has-text("Import"), button:has-text("Importer")').first();
        await expect(uploadButton).toBeVisible({ timeout: 10000 });

        // 3. Upload fichier CSV de démonstration
        const fileChooserPromise = page.waitForEvent('filechooser');
        await uploadButton.click();
        const fileChooser = await fileChooserPromise;

        const csvPath = path.join(__dirname, '../public/demo-data.csv');
        await fileChooser.setFiles(csvPath);

        // 4. Attendre que le parsing soit terminé (loader disparaît)
        await page.waitForSelector('[data-testid="upload-loader"]', { state: 'hidden', timeout: 30000 }).catch(() => {
            // Si pas de loader explicite, attendre que le score apparaisse
        });

        // 5. Vérifier que le Score FinSight™ apparaît
        const scoreCard = page.locator('text=/Score FinSight|FinSight Score/i').first();
        await expect(scoreCard).toBeVisible({ timeout: 15000 });

        // 6. Vérifier que le score est un nombre entre 0 et 100
        const scoreValue = page.locator('[data-testid="score-value"], .text-6xl, .text-5xl').first();
        await expect(scoreValue).toBeVisible({ timeout: 5000 });

        const scoreText = await scoreValue.textContent();
        if (scoreText) {
            const score = parseInt(scoreText.replace(/\D/g, ''), 10);
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(100);
        }

        // 7. Vérifier présence des KPIs principaux
        await expect(page.locator('text=/Chiffre d\'affaires|Revenue|CA/i')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('text=/Marge|Margin/i')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('text=/Cash.?flow|Trésorerie/i')).toBeVisible({ timeout: 5000 });

        // 8. Vérifier présence d'au moins un graphique
        const charts = page.locator('canvas, svg[class*="recharts"]').first();
        await expect(charts).toBeVisible({ timeout: 10000 });

        // 9. Vérifier que le Copilot IA est présent
        const copilot = page.locator('[data-testid="ai-copilot"], button:has-text("Copilot"), button:has-text("IA")').first();
        await expect(copilot).toBeVisible({ timeout: 5000 });
    });

    test('affiche erreur si CSV invalide (< 10 transactions)', async ({ page }) => {
        await page.goto('/demo');

        // Créer un CSV invalide (seulement 3 transactions)
        const invalidCSV = `Date,Montant
01/01/2024,1000
02/01/2024,500
03/01/2024,750`;

        // Utiliser DataTransfer pour simuler upload via paste ou drag
        await page.evaluate((csvContent) => {
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const file = new File([blob], 'invalid.csv', { type: 'text/csv' });

            // Déclencher upload programmatiquement
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (input) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, invalidCSV);

        // Attendre message d'erreur
        const errorMessage = page.locator('text=/10 transaction|moins de 10|insuffisant/i').first();
        await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });

    test('peut télécharger rapport PDF', async ({ page }) => {
        // 1. Charger dashboard avec données
        await page.goto('/demo');

        const uploadButton = page.locator('button:has-text("Import"), button:has-text("Importer")').first();
        await uploadButton.click();

        const fileChooserPromise = page.waitForEvent('filechooser');
        await uploadButton.click();
        const fileChooser = await fileChooserPromise;

        const csvPath = path.join(__dirname, '../public/demo-data.csv');
        await fileChooser.setFiles(csvPath);

        // 2. Attendre chargement dashboard
        await page.waitForSelector('text=/Score FinSight/i', { timeout: 30000 });

        // 3. Trouver bouton export PDF
        const pdfButton = page.locator('button:has-text("PDF"), button:has-text("Export"), button:has-text("Télécharger")').first();

        if (await pdfButton.isVisible({ timeout: 5000 })) {
            // 4. Déclencher download
            const downloadPromise = page.waitForEvent('download');
            await pdfButton.click();
            const download = await downloadPromise;

            // 5. Vérifier que le fichier est bien un PDF
            expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
        }
    });

    test('Copilot IA répond aux questions', async ({ page }) => {
        // 1. Charger dashboard avec données
        await page.goto('/demo');

        // Upload CSV
        const uploadButton = page.locator('button:has-text("Import")').first();
        if (await uploadButton.isVisible({ timeout: 5000 })) {
            const fileChooserPromise = page.waitForEvent('filechooser');
            await uploadButton.click();
            const fileChooser = await fileChooserPromise;
            const csvPath = path.join(__dirname, '../public/demo-data.csv');
            await fileChooser.setFiles(csvPath);
        }

        await page.waitForSelector('text=/Score FinSight/i', { timeout: 30000 });

        // 2. Ouvrir Copilot
        const copilotButton = page.locator('[data-testid="ai-copilot"], button:has-text("Copilot")').first();
        await copilotButton.click();

        // 3. Poser une question
        const inputField = page.locator('input[placeholder*="question"], textarea[placeholder*="question"]').first();
        await expect(inputField).toBeVisible({ timeout: 5000 });

        await inputField.fill('Quel est mon chiffre d\'affaires ?');
        await inputField.press('Enter');

        // 4. Attendre réponse IA (timeout plus long car appel API)
        const aiResponse = page.locator('[data-testid="ai-response"], .ai-message, .copilot-response').first();
        await expect(aiResponse).toBeVisible({ timeout: 20000 });

        // 5. Vérifier que la réponse contient un montant
        const responseText = await aiResponse.textContent();
        expect(responseText).toMatch(/€|\$|euro|chiffre|affaires/i);
    });
});

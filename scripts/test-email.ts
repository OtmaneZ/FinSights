/**
 * Script de test pour l'API d'envoi d'emails Resend
 * Usage: npx tsx scripts/test-email.ts
 */

const testEmailAlert = async () => {
    console.log('🧪 Test d\'envoi d\'email FinSight Alerts\n');

    // Configuration du test
    const testEmail = 'otmane@zineinsight.com';
    const apiUrl = 'http://localhost:3000/api/alerts/send';

    // Test 1: Alerte Trésorerie Critique
    console.log('📧 Test 1: Alerte Trésorerie Critique...');
    const tresoData = {
        to: testEmail,
        alertData: {
            companyName: 'TechStartup SAS',
            userName: 'Otmane Boulahia',
            alertType: 'tresorerie',
            severity: 'critical',
            value: 8500,
            threshold: 10000,
            details: 'Votre trésorerie est passée sous le seuil critique de 10 000€. Action immédiate requise.',
            actionUrl: 'https://finsights.vercel.app/dashboard',
        },
    };

    try {
        const response1 = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tresoData),
        });

        const result1 = await response1.json();
        if (result1.success) {
            console.log(`✅ Email trésorerie envoyé! ID: ${result1.messageId}\n`);
        } else {
            console.error(`❌ Erreur: ${result1.error}\n`);
        }
    } catch (error: any) {
        console.error(`❌ Erreur réseau: ${error.message}\n`);
    }

    // Test 2: Alerte Anomalie ML
    console.log('📧 Test 2: Alerte Anomalie ML...');
    const anomalieData = {
        to: testEmail,
        alertData: {
            companyName: 'TechStartup SAS',
            alertType: 'anomalie',
            severity: 'warning',
            value: 15000,
            details: 'Transaction de 15 000€ détectée comme inhabituelle par l\'algorithme Isolation Forest.',
            actionUrl: 'https://finsights.vercel.app/dashboard',
        },
    };

    try {
        const response2 = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(anomalieData),
        });

        const result2 = await response2.json();
        if (result2.success) {
            console.log(`✅ Email anomalie envoyé! ID: ${result2.messageId}\n`);
        } else {
            console.error(`❌ Erreur: ${result2.error}\n`);
        }
    } catch (error: any) {
        console.error(`❌ Erreur réseau: ${error.message}\n`);
    }

    // Test 3: Alerte Échéance
    console.log('📧 Test 3: Alerte Échéance J-3...');
    const echeanceData = {
        to: testEmail,
        alertData: {
            companyName: 'TechStartup SAS',
            alertType: 'echeance',
            severity: 'warning',
            value: 25000,
            details: 'Dans 3 jours (12 novembre 2025)',
            actionUrl: 'https://finsights.vercel.app/dashboard',
        },
    };

    try {
        const response3 = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(echeanceData),
        });

        const result3 = await response3.json();
        if (result3.success) {
            console.log(`✅ Email échéance envoyé! ID: ${result3.messageId}\n`);
        } else {
            console.error(`❌ Erreur: ${result3.error}\n`);
        }
    } catch (error: any) {
        console.error(`❌ Erreur réseau: ${error.message}\n`);
    }

    console.log('✅ Tests terminés! Vérifie ta boîte email 📬');
};

// Exécuter le test
testEmailAlert().catch(console.error);

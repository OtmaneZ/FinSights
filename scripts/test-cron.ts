/**
 * Script de test pour le Cron Job d'alertes
 * Usage: npx tsx scripts/test-cron.ts
 */

const testCronAlerts = async () => {
    console.log('🧪 Test du Cron Job Check Alerts\n');

    const apiUrl = 'http://localhost:3000/api/cron/check-alerts';

    console.log('⏰ Simulation d\'exécution du cron...\n');

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                // En prod, Vercel ajoute automatiquement le header Authorization
                // Pour les tests locaux, on peut l'omettre si CRON_SECRET n'est pas défini
            },
        });

        const result = await response.json();

        console.log('📊 Résultat du cron:');
        console.log('─────────────────────────────────────');
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`Success: ${result.success ? '✅' : '❌'}`);
        console.log(`Timestamp: ${result.timestamp}`);
        console.log(`Alertes vérifiées: ${result.alertsChecked}`);
        console.log(`Alertes déclenchées: ${result.alertsTriggered}`);
        console.log(`Emails envoyés: ${result.emailsSent}`);

        if (result.errors && result.errors.length > 0) {
            console.log('\n❌ Erreurs:');
            result.errors.forEach((error: string, i: number) => {
                console.log(`  ${i + 1}. ${error}`);
            });
        }

        if (result.details && result.details.length > 0) {
            console.log('\n📧 Détails des emails:');
            result.details.forEach((detail: any, i: number) => {
                console.log(`  ${i + 1}. ${detail.type}: ${detail.status} (${detail.messageId || 'N/A'})`);
                console.log(`     Valeur: ${detail.value}, Seuil: ${detail.threshold}`);
            });
        }

        console.log('─────────────────────────────────────\n');

        if (result.success) {
            console.log('✅ Test réussi ! Le cron fonctionne correctement.');

            if (result.emailsSent > 0) {
                console.log(`\n📬 ${result.emailsSent} email(s) envoyé(s) !`);
                console.log('Vérifie ta boîte email (otmaneboulahia@gmail.com)');
            } else {
                console.log('\nℹ️  Aucune alerte déclenchée (toutes les valeurs sont normales).');
            }
        } else {
            console.error('❌ Test échoué !');
        }

    } catch (error: any) {
        console.error('❌ Erreur lors du test:', error.message);
        console.log('\n💡 Assure-toi que le dev server tourne (npm run dev)');
    }
};

// Exécuter le test
testCronAlerts().catch(console.error);

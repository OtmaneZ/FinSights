// Test script pour vérifier le nouveau dataParser
import { parseCSV, generateDashboardKPIs } from './src/lib/dataParser.js';

const testCSV = `Date,Description,Montant,Compte,Reference
01/10/2024,"Vente produit A",1250.50,COMPTA001,VT-2024-001
02/10/2024,"Achat matériel bureau",-450.00,COMPTA001,ACH-2024-001
03/10/2024,"Prestations consulting",2800.00,COMPTA001,PREST-2024-001`;

console.log('🧪 Test du nouveau parser CSV...\n');

try {
    const parseResult = parseCSV(testCSV);

    if (parseResult.success && parseResult.data) {
        console.log('✅ Parsing réussi !');
        console.log('📊 Nombre d\'enregistrements:', parseResult.data.records.length);
        console.log('💰 Chiffre d\'affaires:', parseResult.data.kpis.revenue);
        console.log('💸 Charges:', parseResult.data.kpis.expenses);
        console.log('📈 Marge:', parseResult.data.kpis.marginPercentage.toFixed(2) + '%');
        console.log('🎯 Qualité des données:', (parseResult.data.qualityMetrics.accuracy * 100).toFixed(1) + '%');

        console.log('\n📋 Mappings détectés:');
        parseResult.detectedMappings.forEach(mapping => {
            console.log(`  ${mapping.sourceColumn} → ${mapping.targetField} (confiance: ${(mapping.confidence * 100).toFixed(0)}%)`);
        });

        console.log('\n🔍 Premier enregistrement:');
        console.log(parseResult.data.records[0]);

        console.log('\n📊 KPIs du dashboard:');
        const dashboardKPIs = generateDashboardKPIs(parseResult.data);
        dashboardKPIs.forEach(kpi => {
            console.log(`  ${kpi.title}: ${kpi.value} (${kpi.change})`);
        });

    } else {
        console.log('❌ Erreurs de parsing:');
        parseResult.errors.forEach(error => {
            console.log(`  Ligne ${error.row}: ${error.message}`);
        });
    }

} catch (error) {
    console.error('💥 Erreur:', error.message);
}
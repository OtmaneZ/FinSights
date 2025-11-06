/**
 * Script de test pour la détection ML d'anomalies
 * Usage: npx tsx scripts/test-ml-detection.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { detectAnomalies } from '../src/lib/ml/anomalyDetector';
import { DEFAULT_CONFIG } from '../src/lib/ml/types';

// Lire le fichier CSV de démo
const csvPath = path.join(process.cwd(), 'public', 'demo-data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parser le CSV (simple version)
function parseCSV(content: string): any[] {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const row: any = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        return row;
    });
}

// Parser les données
const rawData = parseCSV(csvContent);

console.log('🔍 TEST ML ANOMALY DETECTION\n');
console.log(`📊 Données chargées: ${rawData.length} transactions`);
console.log(`📅 Période: ${rawData[0].Date} - ${rawData[rawData.length - 1].Date}\n`);

// Statistiques de base
const amounts = rawData.map(r => parseFloat(r.Montant)).filter(a => !isNaN(a));
const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
const max = Math.max(...amounts);
const min = Math.min(...amounts);

console.log('💰 Statistiques montants:');
console.log(`   Moyenne: ${mean.toFixed(2)}€`);
console.log(`   Max: ${max.toFixed(2)}€`);
console.log(`   Min: ${min.toFixed(2)}€\n`);

// Détecter les anomalies avec configuration par défaut
console.log('🤖 Détection ML en cours...\n');

const result = detectAnomalies(rawData, DEFAULT_CONFIG);

console.log(`✅ ${result.anomalies.length} anomalies détectées\n`);

// Afficher par niveau de risque
const byRisk = {
    critical: result.anomalies.filter(a => a.riskLevel === 'critical'),
    high: result.anomalies.filter(a => a.riskLevel === 'high'),
    medium: result.anomalies.filter(a => a.riskLevel === 'medium'),
    low: result.anomalies.filter(a => a.riskLevel === 'low'),
};

console.log('📊 Répartition par risque:');
console.log(`   🚨 Critical: ${byRisk.critical.length}`);
console.log(`   ⚠️  High: ${byRisk.high.length}`);
console.log(`   ⚡ Medium: ${byRisk.medium.length}`);
console.log(`   ℹ️  Low: ${byRisk.low.length}\n`);

// Afficher par type
const byType = {
    amount_outlier: result.anomalies.filter(a => a.type === 'amount_outlier'),
    payment_delay: result.anomalies.filter(a => a.type === 'payment_delay'),
    category_spike: result.anomalies.filter(a => a.type === 'category_spike'),
};

console.log('📈 Répartition par type:');
console.log(`   💵 Montants suspects: ${byType.amount_outlier.length}`);
console.log(`   ⏰ Retards paiement: ${byType.payment_delay.length}`);
console.log(`   📊 Spikes catégorie: ${byType.category_spike.length}\n`);

// Détails des anomalies critiques et high
console.log('🔍 DÉTAILS DES ANOMALIES CRITIQUES/HIGH:\n');

[...byRisk.critical, ...byRisk.high].forEach((anomaly, index) => {
    console.log(`${index + 1}. [${anomaly.riskLevel.toUpperCase()}] ${anomaly.title}`);
    console.log(`   Type: ${anomaly.type}`);
    console.log(`   Description: ${anomaly.description}`);
    console.log(`   Valeur: ${anomaly.value}`);
    if (anomaly.expectedValue) {
        console.log(`   Attendu: ${anomaly.expectedValue}`);
    }
    if (anomaly.deviation) {
        console.log(`   Déviation: ${anomaly.deviation}`);
    }
    console.log(`   Confiance: ${(anomaly.confidence * 100).toFixed(1)}%`);
    console.log('');
});

// Vérifications spécifiques attendues
console.log('✅ VÉRIFICATIONS ATTENDUES:\n');

// 1. Montant outlier 28,900€ (si existe)
const largeAmounts = amounts.filter(a => a > 25000);
if (largeAmounts.length > 0) {
    console.log(`✓ Montants > 25,000€: ${largeAmounts.length} trouvé(s)`);
    console.log(`  Max: ${Math.max(...largeAmounts).toFixed(2)}€`);
} else {
    console.log(`✗ Pas de montant > 25,000€ trouvé`);
}

// 2. Retards paiement "En attente"
const enAttente = rawData.filter(r => r.Statut_paiement === 'En attente');
console.log(`✓ Transactions 'En attente': ${enAttente.length}`);

// 3. Spike Masse Salariale
const masseSalariale = rawData.filter(r => r.Categorie === 'Masse Salariale');
console.log(`✓ Transactions 'Masse Salariale': ${masseSalariale.length}`);
if (masseSalariale.length > 0) {
    const salaryAmounts = masseSalariale.map(r => Math.abs(parseFloat(r.Montant)));
    console.log(`  Montant: ${Math.max(...salaryAmounts).toFixed(2)}€`);
}

console.log('\n✅ Test terminé\n');

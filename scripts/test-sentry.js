/**
 * Script de test pour vérifier la configuration Sentry
 * Usage: node scripts/test-sentry.js
 */

const Sentry = require('@sentry/nextjs');

// Initialiser Sentry
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
});

console.log('🧪 Test de configuration Sentry...\n');

// Test 1: Message simple
console.log('📤 Test 1: Message de log...');
Sentry.captureMessage('Test message from test-sentry.js', 'info');

// Test 2: Erreur avec contexte
console.log('📤 Test 2: Erreur avec contexte...');
Sentry.captureException(new Error('Test error from test-sentry.js'), {
  tags: {
    test: 'true',
    script: 'test-sentry.js',
  },
  extra: {
    description: 'This is a test error to verify Sentry integration',
    timestamp: new Date().toISOString(),
  },
});

// Test 3: Transaction de performance
console.log('📤 Test 3: Transaction de performance...');
const transaction = Sentry.startTransaction({
  op: 'test',
  name: 'Test Transaction',
});

setTimeout(() => {
  transaction.finish();
  console.log('✅ Transaction terminée');
}, 1000);

// Attendre que tous les événements soient envoyés
setTimeout(async () => {
  console.log('\n⏳ Envoi des événements à Sentry...');
  await Sentry.close(2000);
  console.log('✅ Tests terminés! Vérifier le dashboard Sentry.\n');
  console.log(`🔗 https://sentry.io/organizations/zineinsights-xy/projects/finsights/\n`);
}, 2000);

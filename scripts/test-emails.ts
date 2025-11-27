/**
 * Test script for email templates
 * Usage: tsx scripts/test-emails.ts
 */

import 'dotenv/config'
import {
    sendWelcomeEmail,
    sendUpgradeSuccessEmail,
    sendPaymentFailedEmail,
    sendUsageAlertEmail,
    isEmailEnabled,
} from '../src/lib/emails/emailService'

async function testEmails() {
    console.log('🧪 Test des templates emails\n')

    if (!isEmailEnabled()) {
        console.error('❌ RESEND_API_KEY non configurée')
        console.log('📝 Ajoutez RESEND_API_KEY dans .env.local')
        process.exit(1)
    }

    const testEmail = process.env.TEST_EMAIL || 'test@example.com'

    console.log(`📧 Email de test: ${testEmail}\n`)

    // Test 1: Welcome Email
    console.log('1️⃣  Test Welcome Email...')
    const welcome = await sendWelcomeEmail({
        to: testEmail,
        userName: 'Jean Dupont',
        userEmail: testEmail,
    })
    console.log(welcome.success ? '   ✅ Envoyé' : '   ❌ Échec', '\n')

    // Test 2: Upgrade Success Email
    console.log('2️⃣  Test Upgrade Success Email (PRO)...')
    const upgradePro = await sendUpgradeSuccessEmail({
        to: testEmail,
        userName: 'Jean Dupont',
        plan: 'PRO',
        amount: 79,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
            'fr-FR'
        ),
    })
    console.log(upgradePro.success ? '   ✅ Envoyé' : '   ❌ Échec', '\n')

    // Test 3: Upgrade Success Email SCALE
    console.log('3️⃣  Test Upgrade Success Email (SCALE)...')
    const upgradeScale = await sendUpgradeSuccessEmail({
        to: testEmail,
        userName: 'Marie Martin',
        plan: 'SCALE',
        amount: 199,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
            'fr-FR'
        ),
    })
    console.log(upgradeScale.success ? '   ✅ Envoyé' : '   ❌ Échec', '\n')

    // Test 4: Payment Failed Email
    console.log('4️⃣  Test Payment Failed Email...')
    const paymentFailed = await sendPaymentFailedEmail({
        to: testEmail,
        userName: 'Jean Dupont',
        plan: 'PRO',
        amount: 79,
        invoiceUrl: 'https://invoice.stripe.com/i/test_123',
    })
    console.log(paymentFailed.success ? '   ✅ Envoyé' : '   ❌ Échec', '\n')

    // Test 5: Usage Alert Email (FREE - 80%)
    console.log('5️⃣  Test Usage Alert Email (FREE - 80% copilot)...')
    const usageAlert80 = await sendUsageAlertEmail({
        to: testEmail,
        userName: 'Jean Dupont',
        plan: 'FREE',
        resource: 'copilot_queries',
        currentUsage: 8,
        limit: 10,
        percentage: 80,
    })
    console.log(usageAlert80.success ? '   ✅ Envoyé' : '   ❌ Échec', '\n')

    // Test 6: Usage Alert Email (FREE - 90%)
    console.log('6️⃣  Test Usage Alert Email (FREE - 90% copilot)...')
    const usageAlert90 = await sendUsageAlertEmail({
        to: testEmail,
        userName: 'Jean Dupont',
        plan: 'FREE',
        resource: 'copilot_queries',
        currentUsage: 9,
        limit: 10,
        percentage: 90,
    })
    console.log(usageAlert90.success ? '   ✅ Envoyé' : '   ❌ Échec', '\n')

    // Test 7: Usage Alert Email (SCALE - API)
    console.log('7️⃣  Test Usage Alert Email (SCALE - 85% API)...')
    const usageAlertApi = await sendUsageAlertEmail({
        to: testEmail,
        userName: 'Marie Martin',
        plan: 'SCALE',
        resource: 'api_calls',
        currentUsage: 8500,
        limit: 10000,
        percentage: 85,
    })
    console.log(usageAlertApi.success ? '   ✅ Envoyé' : '   ❌ Échec', '\n')

    console.log('✅ Tests terminés !')
    console.log(`\n📬 Vérifiez votre boîte ${testEmail}`)
}

testEmails().catch(console.error)

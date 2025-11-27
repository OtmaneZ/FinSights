import { sendWelcomeEmail } from './src/lib/emails/emailService'

async function test() {
    console.log('🧪 Test Production Email')
    console.log('📧 From: FinSight <noreply@finsight.zineinsight.com>')
    console.log('📧 To: otmaneboulahia@gmail.com\n')

    const result = await sendWelcomeEmail({
        to: 'otmaneboulahia@gmail.com',
        userName: 'Otmane',
        userEmail: 'otmaneboulahia@gmail.com',
    })

    if (result.success) {
        console.log('\n✅✅✅ EMAIL ENVOYÉ AVEC SUCCÈS! ✅✅✅')
        console.log('📬 ID:', result.id)
        console.log('\n🎉 CHECK GMAIL - INBOX (pas Spam cette fois!)')
        console.log('✉️  From: FinSight <noreply@finsight.zineinsight.com>')
        console.log('🔒 Authentification: DKIM ✅ SPF ✅ DMARC ✅\n')
    } else {
        console.error('\n❌ Échec:', result.error)
    }
}

test().catch(console.error)

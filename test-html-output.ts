import 'dotenv/config';
import { render } from '@react-email/components';
import WelcomeEmail from './src/lib/emails/templates/WelcomeEmail';

async function testHTML() {
    const html = await render(
        WelcomeEmail({
            userName: 'Otmane',
            userEmail: 'otmaneboulahia@gmail.com',
        })
    );
    
    console.log('=== HTML OUTPUT (first 500 chars) ===');
    console.log(html.substring(0, 500));
    console.log('\n=== Recherche de texte "Bonjour" ===');
    console.log(html.includes('Bonjour') ? '✅ FOUND' : '❌ NOT FOUND');
    console.log('\n=== Recherche de "Votre compte" ===');
    console.log(html.includes('Votre compte') ? '✅ FOUND' : '❌ NOT FOUND');
}

testHTML();

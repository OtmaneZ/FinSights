/**
 * Script de test Pusher Real-Time
 * Usage: npx tsx scripts/test-pusher.ts
 */

import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// IMPORTANT: Remplacer ces valeurs par vos vrais credentials Pusher
const PUSHER_CONFIG = {
    appId: process.env.PUSHER_APP_ID || 'TEST_APP_ID',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || 'TEST_KEY',
    secret: process.env.PUSHER_SECRET || 'TEST_SECRET',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
};

console.log('🔍 TEST PUSHER REAL-TIME CONNECTION\n');

// Test 1: Server-side Pusher instance
console.log('📡 Test 1: Server-side Pusher instance...');
try {
    const pusherServer = new Pusher({
        appId: PUSHER_CONFIG.appId,
        key: PUSHER_CONFIG.key,
        secret: PUSHER_CONFIG.secret,
        cluster: PUSHER_CONFIG.cluster,
        useTLS: true,
    });

    console.log('✅ Server Pusher instance created');
    console.log(`   App ID: ${PUSHER_CONFIG.appId}`);
    console.log(`   Cluster: ${PUSHER_CONFIG.cluster}\n`);

    // Test 2: Trigger a test event
    console.log('📤 Test 2: Trigger test event...');

    pusherServer.trigger('test-channel', 'test-event', {
        message: 'Hello from FinSight!',
        timestamp: new Date().toISOString(),
    })
        .then(() => {
            console.log('✅ Event triggered successfully\n');
        })
        .catch((error: Error) => {
            console.error('❌ Event trigger failed:', error.message);
            console.log('\n⚠️  IMPORTANT: Si vous voyez cette erreur:');
            console.log('   1. Créez un compte Pusher gratuit: https://dashboard.pusher.com/');
            console.log('   2. Créez une app "FinSight"');
            console.log('   3. Copiez vos credentials dans .env.local:');
            console.log('      NEXT_PUBLIC_PUSHER_KEY=...');
            console.log('      PUSHER_APP_ID=...');
            console.log('      PUSHER_SECRET=...');
            console.log('      NEXT_PUBLIC_PUSHER_CLUSTER=eu\n');
        });

    // Test 3: Client-side connection
    console.log('📱 Test 3: Client-side Pusher connection...');

    const pusherClient = new PusherClient(PUSHER_CONFIG.key, {
        cluster: PUSHER_CONFIG.cluster,
    });

    pusherClient.connection.bind('connected', () => {
        console.log('✅ Client connected to Pusher');
        console.log(`   Socket ID: ${pusherClient.connection.socket_id}\n`);
    });

    pusherClient.connection.bind('error', (error: any) => {
        console.error('❌ Client connection error:', error);
    });

    // Test 4: Subscribe to channel
    console.log('📻 Test 4: Subscribe to test channel...');

    const channel = pusherClient.subscribe('test-channel');

    channel.bind('pusher:subscription_succeeded', () => {
        console.log('✅ Subscribed to test-channel\n');
    });

    channel.bind('test-event', (data: any) => {
        console.log('📨 Received event:', data);
    });

    // Clean up after 5 seconds
    setTimeout(() => {
        pusherClient.disconnect();
        console.log('\n✅ Test completed - Connection closed');
        process.exit(0);
    }, 5000);

} catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n⚠️  Vérifiez vos credentials Pusher dans .env.local');
    process.exit(1);
}

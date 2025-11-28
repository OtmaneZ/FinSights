/**
 * Test script for API v1 endpoints
 * Usage: node scripts/test-api-v1.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const API_KEY = process.env.TEST_API_KEY || '';

async function testApiEndpoints() {
    console.log('🧪 Testing FinSight API v1...\n');

    if (!API_KEY) {
        console.error('❌ Error: TEST_API_KEY environment variable not set');
        console.log('Generate an API key from /dashboard/api-keys and set it:');
        console.log('export TEST_API_KEY=fsk_live_your_key_here\n');
        process.exit(1);
    }

    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    };

    // Test 1: GET /api/v1/dashboards
    console.log('📊 Test 1: GET /api/v1/dashboards');
    try {
        const response = await fetch(`${BASE_URL}/api/v1/dashboards?page=1&limit=5`, {
            headers,
        });
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Success');
            console.log(`   Found ${data.meta.total} dashboards`);
            console.log(`   Page ${data.meta.page}/${data.meta.totalPages}`);
        } else {
            console.log(`❌ Failed: ${data.error} (${data.code})`);
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }

    console.log('');

    // Test 2: GET /api/v1/dashboards (first dashboard)
    console.log('📄 Test 2: GET /api/v1/dashboards/:id');
    try {
        // First get the list to get an ID
        const listResponse = await fetch(`${BASE_URL}/api/v1/dashboards?limit=1`, {
            headers,
        });
        const listData = await listResponse.json();

        if (listData.data && listData.data.length > 0) {
            const dashboardId = listData.data[0].id;
            const response = await fetch(
                `${BASE_URL}/api/v1/dashboards/${dashboardId}?includeRawData=false`,
                { headers }
            );
            const data = await response.json();

            if (response.ok) {
                console.log('✅ Success');
                console.log(`   Dashboard: ${data.data.fileName}`);
                console.log(`   Company: ${data.data.company.name}`);
                console.log(`   KPIs: ${Object.keys(data.data.kpis).length} metrics`);
            } else {
                console.log(`❌ Failed: ${data.error} (${data.code})`);
            }
        } else {
            console.log('⚠️  Skipped: No dashboards found');
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }

    console.log('');

    // Test 3: GET /api/v1/kpis
    console.log('📈 Test 3: GET /api/v1/kpis');
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/kpis?metrics=revenue,margin,cashflow`,
            { headers }
        );
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Success');
            if (data.data.metrics) {
                const metrics = Object.keys(data.data.metrics);
                console.log(`   Metrics: ${metrics.join(', ')}`);
                if (data.data.dashboardCount) {
                    console.log(`   Aggregated from ${data.data.dashboardCount} dashboards`);
                }
            }
        } else {
            console.log(`❌ Failed: ${data.error} (${data.code})`);
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }

    console.log('');

    // Test 4: GET /api/v1/docs
    console.log('📚 Test 4: GET /api/v1/docs (OpenAPI spec)');
    try {
        const response = await fetch(`${BASE_URL}/api/v1/docs`);
        const data = await response.json();

        if (response.ok && data.openapi) {
            console.log('✅ Success');
            console.log(`   OpenAPI version: ${data.openapi}`);
            console.log(`   API title: ${data.info.title}`);
            console.log(`   Endpoints: ${Object.keys(data.paths).length}`);
        } else {
            console.log('❌ Failed: Invalid OpenAPI spec');
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }

    console.log('\n✨ Tests completed!\n');
}

// Run tests
testApiEndpoints().catch(console.error);

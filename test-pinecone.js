/**
 * Script de test Pinecone - Vérifie la connexion et la mémoire vectorielle
 */

const fs = require('fs');
const path = require('path');

// Charger .env.local manuellement
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=:#]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            process.env[key] = value;
        }
    });
}

const { Pinecone } = require('@pinecone-database/pinecone');

async function testPinecone() {
    console.log('\n🧪 TEST MÉMOIRE VECTORIELLE PINECONE\n');
    console.log('═'.repeat(60));

    // 1. Vérifier les variables d'environnement
    console.log('\n1️⃣ Variables d\'environnement:');
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME;

    console.log(`   PINECONE_API_KEY: ${apiKey ? '✅ Définie (' + apiKey.substring(0, 10) + '...' + apiKey.slice(-6) + ')' : '❌ MANQUANTE'}`);
    console.log(`   PINECONE_INDEX_NAME: ${indexName ? '✅ ' + indexName : '❌ MANQUANTE'}`);

    if (!apiKey || !indexName) {
        console.log('\n❌ ERREUR: Variables manquantes dans .env.local\n');
        process.exit(1);
    }

    try {
        // 2. Connexion Pinecone
        console.log('\n2️⃣ Connexion à Pinecone...');
        const pc = new Pinecone({ apiKey });
        console.log('   ✅ Client Pinecone initialisé');

        // 3. Vérifier que l'index existe
        console.log(`\n3️⃣ Vérification de l'index "${indexName}"...`);
        const indexList = await pc.listIndexes();
        const indexExists = indexList.indexes?.some(idx => idx.name === indexName);

        if (!indexExists) {
            console.log(`   ❌ ERREUR: L'index "${indexName}" n'existe pas !`);
            console.log('\n   📋 Index disponibles:');
            if (indexList.indexes && indexList.indexes.length > 0) {
                indexList.indexes.forEach(idx => {
                    console.log(`      - ${idx.name} (${idx.dimension} dimensions, ${idx.metric})`);
                });
            } else {
                console.log('      (Aucun index trouvé)');
            }
            process.exit(1);
        }

        console.log('   ✅ Index trouvé');

        // 4. Récupérer les détails de l'index
        console.log('\n4️⃣ Détails de l\'index:');
        const index = pc.index(indexName);
        const stats = await index.describeIndexStats();

        console.log(`   📊 Dimensions: ${stats.dimension || 'N/A'}`);
        console.log(`   📦 Total de vecteurs: ${stats.totalRecordCount || 0}`);

        if (stats.namespaces) {
            console.log('   🗂️  Namespaces:');
            Object.entries(stats.namespaces).forEach(([ns, data]) => {
                console.log(`      - ${ns}: ${data.recordCount || 0} vecteurs`);
            });
        }

        // 5. Test d'écriture (conversation test)
        console.log('\n5️⃣ Test d\'écriture (stockage conversation)...');
        const testVector = Array(1536).fill(0.1); // Vecteur test 1536 dimensions
        const testId = `test-${Date.now()}`;

        await index.namespace('conversations').upsert([{
            id: testId,
            values: testVector,
            metadata: {
                userId: 'test-user',
                companyName: 'test-company',
                message: 'Test de connexion Pinecone',
                response: 'Connexion réussie !',
                timestamp: new Date().toISOString()
            }
        }]);

        console.log(`   ✅ Vecteur test écrit (ID: ${testId})`);

        // 6. Test de lecture (recherche)
        console.log('\n6️⃣ Test de lecture (recherche similarité)...');
        const searchResults = await index.namespace('conversations').query({
            vector: testVector,
            topK: 1,
            includeMetadata: true
        });

        if (searchResults.matches && searchResults.matches.length > 0) {
            console.log(`   ✅ Recherche réussie: ${searchResults.matches.length} résultat(s)`);
            console.log(`   📝 Message: "${searchResults.matches[0].metadata?.message}"`);
            console.log(`   🎯 Score: ${searchResults.matches[0].score?.toFixed(4)}`);
        } else {
            console.log('   ⚠️  Aucun résultat trouvé');
        }

        // 7. Nettoyage (optionnel)
        console.log('\n7️⃣ Nettoyage du vecteur test...');
        await index.namespace('conversations').deleteOne(testId);
        console.log('   ✅ Vecteur test supprimé');

        // RÉSULTAT FINAL
        console.log('\n' + '═'.repeat(60));
        console.log('\n🎉 RÉSULTAT: Mémoire vectorielle OPÉRATIONNELLE ✅');
        console.log('\n✅ Pinecone est correctement configuré');
        console.log('✅ L\'index est accessible');
        console.log('✅ Écriture/Lecture fonctionne');
        console.log('\n💡 Ton copilot IA a bien une mémoire vectorielle active !');
        console.log('\n' + '═'.repeat(60) + '\n');

    } catch (error) {
        console.log('\n❌ ERREUR lors du test:');
        console.error(error);
        console.log('\n' + '═'.repeat(60));
        console.log('\n⚠️  DIAGNOSTIC:');

        if (error.message?.includes('API key')) {
            console.log('   • Problème avec PINECONE_API_KEY');
            console.log('   • Vérifie que la clé est valide dans Pinecone dashboard');
        } else if (error.message?.includes('index')) {
            console.log('   • Problème avec l\'index');
            console.log(`   • Vérifie que "${indexName}" existe dans Pinecone`);
        } else if (error.message?.includes('dimension')) {
            console.log('   • Problème de dimensions');
            console.log('   • L\'index doit avoir 1536 dimensions (OpenAI embeddings)');
        } else {
            console.log('   • Erreur inconnue, voir détails ci-dessus');
        }

        console.log('\n' + '═'.repeat(60) + '\n');
        process.exit(1);
    }
}

// Exécuter le test
testPinecone();

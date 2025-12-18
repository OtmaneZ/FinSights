#!/bin/bash

# ============================================
# Script de migration API Keys vers SHA-256
# ============================================
# À exécuter APRÈS avoir déployé le code avec
# le nouveau schéma Prisma et la colonne keyHash

set -e

echo "🔐 Migration des API Keys vers SHA-256..."
echo ""

# Vérifier que Prisma est disponible
if ! command -v npx &> /dev/null; then
    echo "❌ npm/npx non trouvé. Installer Node.js d'abord."
    exit 1
fi

# 1. Exécuter la migration Prisma
echo "📦 Étape 1: Migration base de données..."
npx prisma migrate deploy

# 2. Script Node.js pour hasher les clés existantes
echo "🔒 Étape 2: Hashage des clés existantes..."
node <<'EOF'
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function migrateKeys() {
  try {
    // Récupérer toutes les clés existantes
    const existingKeys = await prisma.apiKey.findMany({
      where: {
        keyHash: null, // Anciennes clés non hashées
      },
    });

    console.log(`📊 ${existingKeys.length} clés à migrer`);

    for (const apiKey of existingKeys) {
      // Si la clé existe encore (non hashée)
      if (apiKey.key) {
        const keyHash = crypto
          .createHash('sha256')
          .update(apiKey.key)
          .digest('hex');

        const prefix = apiKey.key.substring(0, 8);

        // Mettre à jour avec le hash
        await prisma.apiKey.update({
          where: { id: apiKey.id },
          data: {
            keyHash,
            prefix,
            // Retirer la clé en clair (optionnel selon votre schéma)
          },
        });

        console.log(`✅ Clé ${apiKey.id} migrée (prefix: ${prefix})`);
      }
    }

    console.log('✨ Migration terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateKeys();
EOF

echo ""
echo "✅ Migration complète!"
echo ""
echo "⚠️  IMPORTANT:"
echo "   - Les anciennes clés API ne fonctionneront plus"
echo "   - Communiquer aux utilisateurs qu'ils doivent regénérer leurs clés"
echo "   - Utiliser src/lib/apiKeySecurity.ts:generateAPIKey() pour créer de nouvelles clés"
echo ""

#!/bin/bash

# ============================================
# Script de migration : Initialiser les membres OWNER
# ============================================
# À exécuter APRÈS la migration Prisma
# Crée un CompanyMember OWNER pour chaque Company existante

set -e

echo "🔧 Initialisation des membres OWNER..."
echo ""

# Vérifier que Prisma est disponible
if ! command -v npx &> /dev/null; then
    echo "❌ npm/npx non trouvé. Installer Node.js d'abord."
    exit 1
fi

# Script Node.js pour initialiser les OWNER
node <<'EOF'
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initializeOwners() {
  try {
    console.log('📊 Récupération des entreprises existantes...');

    // Récupérer toutes les entreprises
    const companies = await prisma.company.findMany({
      include: {
        members: true,
      },
    });

    console.log(`✓ ${companies.length} entreprises trouvées`);

    let ownersCreated = 0;
    let alreadyHasOwner = 0;

    for (const company of companies) {
      // Vérifier si l'entreprise a déjà un OWNER
      const hasOwner = company.members.some((m) => m.role === 'OWNER');

      if (hasOwner) {
        console.log(`⏭️  ${company.name} a déjà un OWNER`);
        alreadyHasOwner++;
        continue;
      }

      // Créer le membre OWNER (le créateur de l'entreprise)
      await prisma.companyMember.create({
        data: {
          companyId: company.id,
          userId: company.userId,
          role: 'OWNER',
        },
      });

      console.log(`✅ OWNER créé pour ${company.name}`);
      ownersCreated++;
    }

    console.log('');
    console.log('✨ Migration terminée!');
    console.log(`   - ${ownersCreated} OWNER créés`);
    console.log(`   - ${alreadyHasOwner} entreprises avaient déjà un OWNER`);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializeOwners();
EOF

echo ""
echo "✅ Script terminé!"
echo ""

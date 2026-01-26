#!/bin/bash

# Script de migration des URLs de finsight.zineinsight.com vers getfinsight.fr
# Ce script remplace toutes les occurrences dans les fichiers TypeScript/JavaScript

echo "🚀 Début de la migration des URLs..."

# Couleurs pour le terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour remplacer les URLs dans un fichier
replace_in_file() {
    local file="$1"
    if grep -q "finsight.zineinsight.com" "$file"; then
        sed -i '' 's|https://finsight.zineinsight.com|https://getfinsight.fr|g' "$file"
        echo -e "${GREEN}✓${NC} Mis à jour: $file"
    fi
}

# Fichiers à traiter
files=(
    "src/app/pricing/layout.tsx"
    "src/app/calculateurs/bfr/layout.tsx"
    "src/app/calculateurs/dso/layout.tsx"
    "src/app/integrations/make/page.tsx"
    "src/app/dashboard/layout.tsx"
    "src/app/dashboard/settings/integrations/page.tsx"
    "src/app/blog/metadata.ts"
    "src/app/blog/layout.tsx"
    "src/app/pour-qui/metadata.ts"
    "src/lib/seo.ts"
    "src/lib/middleware/cors.ts"
    "src/components/AlertSettings.tsx"
    "src/lib/emails/templates/WelcomeEmail.tsx"
    "src/lib/emails/templates/UpgradeSuccessEmail.tsx"
    "src/lib/emails/templates/PaymentFailedEmail.tsx"
    "src/lib/emails/templates/UsageAlertEmail.tsx"
    "src/app/robots.ts"
)

echo -e "${BLUE}📁 Mise à jour des fichiers...${NC}"
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        replace_in_file "$file"
    else
        echo "⚠️  Fichier non trouvé: $file"
    fi
done

echo ""
echo -e "${GREEN}✅ Migration des URLs terminée !${NC}"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Vérifier les modifications: git diff"
echo "2. Mettre à jour NEXTAUTH_URL sur Vercel"
echo "3. Configurer les DNS chez votre registrar"
echo "4. Commit et push: git add . && git commit -m 'Migrate to getfinsight.fr'"
echo "5. Déployer: vercel --prod"

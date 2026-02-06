#!/bin/bash

# 🚀 Script de setup Prisma + Email Automation
# Lance les 3 étapes nécessaires pour activer l'automation

set -e  # Arrêt si erreur

echo "🚀 Setup Email Automation - FinSights"
echo "======================================"
echo ""

# Étape 1 : Générer le client Prisma
echo "📦 1/3 - Génération du client Prisma..."
npx prisma generate
echo "✅ Client Prisma généré"
echo ""

# Étape 2 : Appliquer le schema en base
echo "💾 2/3 - Application du schema en base..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL non définie dans .env.local"
    echo "   Pour tester en local, vous pouvez utiliser SQLite :"
    echo "   DATABASE_URL=\"file:./dev.db\""
    echo ""
    echo "   Ou PostgreSQL (Vercel Postgres recommandé) :"
    echo "   DATABASE_URL=\"postgresql://user:password@host:5432/dbname\""
    echo ""
    read -p "   Voulez-vous continuer quand même ? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup annulé. Configurez DATABASE_URL et relancez."
        exit 1
    fi
fi

# Choix entre migrate dev (local) ou db push (production)
if [ "$NODE_ENV" = "production" ]; then
    echo "   Mode production : utilisation de 'db push'"
    npx prisma db push --accept-data-loss
else
    echo "   Mode développement : utilisation de 'migrate dev'"
    npx prisma migrate dev --name add_lead_nurturing
fi

echo "✅ Schema appliqué en base"
echo ""

# Étape 3 : Vérifier les variables d'environnement
echo "🔐 3/3 - Vérification des variables d'environnement..."

missing_vars=()

if [ -z "$RESEND_API_KEY" ]; then
    missing_vars+=("RESEND_API_KEY")
fi

if [ -z "$CRON_SECRET" ]; then
    missing_vars+=("CRON_SECRET")
fi

if [ -z "$NEXTAUTH_URL" ]; then
    missing_vars+=("NEXTAUTH_URL")
fi

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo "✅ Toutes les variables sont configurées"
else
    echo "⚠️  Variables manquantes :"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "   Ajoutez-les dans .env.local (local) ou Vercel Dashboard (production)"
fi

echo ""
echo "======================================"
echo "✨ Setup terminé !"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Tester la capture de lead :"
echo "      npm run dev"
echo "      → Aller sur /templates/previsionnel-tresorerie-90j"
echo "      → Remplir le formulaire et télécharger"
echo ""
echo "   2. Vérifier la DB avec Prisma Studio :"
echo "      npx prisma studio"
echo ""
echo "   3. Tester le cron manuellement :"
echo "      curl http://localhost:3000/api/automation/trigger \\"
echo "        -H \"Authorization: Bearer \$CRON_SECRET\""
echo ""
echo "   4. En production, ajouter CRON_SECRET dans Vercel :"
echo "      Vercel Dashboard → Settings → Environment Variables"
echo ""
echo "📊 Monitoring :"
echo "   - Resend Dashboard : https://resend.com/emails"
echo "   - Prisma Studio : npx prisma studio"
echo "   - Vercel Logs : Dashboard → Deployments → Function Logs"
echo ""

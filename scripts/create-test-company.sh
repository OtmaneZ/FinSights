#!/bin/bash

# Script pour créer une company de test via l'API
# Usage: ./scripts/create-test-company.sh

API_URL="https://finsight.zineinsight.com/api/companies"

echo "🏢 Création d'une company de test pour n8n..."
echo ""
echo "⚠️  Tu dois être connecté sur finsight.zineinsight.com"
echo "    Copie ton cookie de session et remplace AUTH_COOKIE ci-dessous"
echo ""

# TODO: Remplacer par ton vrai cookie de session
AUTH_COOKIE="next-auth.session-token=REMPLACER_PAR_TON_COOKIE"

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Cookie: $AUTH_COOKIE" \
  -d '{
    "name": "Demo N8N Company",
    "sector": "saas"
  }' | jq

echo ""
echo "✅ Company créée ! Copie le 'id' retourné pour l'utiliser dans n8n"

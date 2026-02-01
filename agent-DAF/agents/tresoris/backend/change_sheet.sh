#!/bin/bash
# Script rapide pour changer le Google Sheet surveillé par TRESORIS

echo "🔧 TRESORIS - Configuration Sheet"
echo "=================================="
echo ""

# Lire le Sheet ID actuel
if [ -f .env ]; then
    current_id=$(grep "^SPREADSHEET_ID=" .env | cut -d'=' -f2)
    echo "📊 Sheet actuel: $current_id"
else
    echo "⚠️  Fichier .env non trouvé"
    echo "   Création depuis .env.example..."
    cp .env.example .env
fi

echo ""
echo "🔍 Pour trouver votre Sheet ID:"
echo "   1. Ouvrez votre Google Sheet"
echo "   2. Regardez l'URL:"
echo "      https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit"
echo ""

read -p "📝 Nouveau Sheet ID (ou ENTER pour garder actuel): " new_id

if [ -z "$new_id" ]; then
    echo "✅ Sheet ID inchangé"
else
    # Remplacer dans .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/^SPREADSHEET_ID=.*/SPREADSHEET_ID=$new_id/" .env
    else
        # Linux
        sed -i "s/^SPREADSHEET_ID=.*/SPREADSHEET_ID=$new_id/" .env
    fi
    
    echo "✅ Sheet ID mis à jour: $new_id"
fi

echo ""
echo "🚀 Pour appliquer les changements:"
echo "   1. Arrêtez l'API (Ctrl+C)"
echo "   2. Relancez: python main.py"
echo ""

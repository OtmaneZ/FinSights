#!/bin/bash

# Script d'installation des dépendances FinSight
# Exécuter avec: chmod +x install-deps.sh && ./install-deps.sh

echo "📦 Installation des dépendances FinSight..."

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Installer xlsx pour le support Excel
echo "📊 Installation de xlsx (support Excel)..."
npm install xlsx@^0.18.5

# Vérifier l'installation
if [ $? -eq 0 ]; then
    echo "✅ Toutes les dépendances sont installées avec succès!"
    echo ""
    echo "🚀 Vous pouvez maintenant lancer le projet avec:"
    echo "   npm run dev"
else
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

#!/bin/bash

# Script de démarrage rapide pour Agent DAF
# Usage: ./start.sh

echo "🚀 Démarrage de l'Agent DAF..."

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env non trouvé. Créez-le avec votre clé OpenRouter."
    exit 1
fi

# Démarrer le backend
echo "📦 Démarrage du backend..."
cd backend

# Créer venv si n'existe pas
if [ ! -d "venv" ]; then
    echo "  📌 Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer venv et installer deps
source venv/bin/activate
pip install -q -r requirements.txt

# Lancer le backend en arrière-plan
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "  ✅ Backend démarré (PID: $BACKEND_PID)"

cd ..

# Démarrer le frontend
echo "🎨 Démarrage du frontend..."
cd frontend

# Installer deps si nécessaire
if [ ! -d "node_modules" ]; then
    echo "  📌 Installation des dépendances npm..."
    npm install
fi

# Lancer le frontend
npm run dev &
FRONTEND_PID=$!
echo "  ✅ Frontend démarré (PID: $FRONTEND_PID)"

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Agent DAF prêt!"
echo ""
echo "  🌐 Frontend: http://localhost:5173"
echo "  🔌 API:      http://localhost:8000"
echo "  📚 Docs:     http://localhost:8000/docs"
echo ""
echo "  Pour arrêter: Ctrl+C ou kill $BACKEND_PID $FRONTEND_PID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Attendre les processus
wait

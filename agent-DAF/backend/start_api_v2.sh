#!/bin/bash
# Script de démarrage API TRESORIS V2

cd "$(dirname "$0")"

echo "🚀 Démarrage TRESORIS API V2..."

# Vérifier si déjà en cours
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 déjà utilisé. Arrêt du processus..."
    kill $(lsof -t -i:8000) 2>/dev/null
    sleep 2
fi

# Lancer l'API
echo "📡 Lancement sur http://localhost:8000"
nohup python main.py > api_v2.log 2>&1 &
API_PID=$!

echo "✅ API démarrée (PID: $API_PID)"
echo "📋 Logs: tail -f api_v2.log"
echo ""
echo "Pour arrêter: kill $API_PID"
echo "           ou: ./stop_api.sh"

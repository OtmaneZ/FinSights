#!/bin/bash
# Script d'arrêt API TRESORIS V2

echo "🛑 Arrêt TRESORIS API V2..."

if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    PID=$(lsof -t -i:8000)
    echo "Arrêt processus $PID..."
    kill $PID
    sleep 2
    echo "✅ API arrêtée"
else
    echo "ℹ️  Aucun processus sur le port 8000"
fi

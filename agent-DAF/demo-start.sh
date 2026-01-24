#!/bin/bash

# ============================================
# 🎬 SCRIPT DÉMO BPI - Agent DAF
# Lance tout proprement pour la démo
# ============================================

set -e  # Arrêt si erreur

echo "🎬 Préparation démo Agent DAF BPI..."
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# 1. NETTOYAGE
# ============================================
echo "${BLUE}🧹 Nettoyage des anciens processus...${NC}"

# Tuer backend
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
sleep 1

# Tuer frontend
lsof -ti:5175 | xargs kill -9 2>/dev/null || true
sleep 1

echo "${GREEN}✅ Processus nettoyés${NC}"
echo ""

# ============================================
# 2. RESET DONNÉES "ÉTAT VEILLE"
# ============================================
echo "${BLUE}📁 Reset données état 'veille'...${NC}"

cd "$(dirname "$0")"
PROJECT_ROOT="$(pwd)"

# Backup du CSV actuel (au cas où)
if [ -f "$PROJECT_ROOT/backend/data/customer_invoices.csv" ]; then
    cp "$PROJECT_ROOT/backend/data/customer_invoices.csv" "$PROJECT_ROOT/backend/data/customer_invoices.csv.backup-$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
fi

# Copier le CSV propre
cp "$PROJECT_ROOT/backend/data/customer_invoices_CLEAN.csv" "$PROJECT_ROOT/backend/data/customer_invoices.csv"

# Nettoyer la mémoire de l'agent
MEMORY_FILE="$PROJECT_ROOT/backend/storage/memory/agent_memory.json"
if [ -f "$MEMORY_FILE" ]; then
    cp "$MEMORY_FILE" "$MEMORY_FILE.backup-$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
    echo '{"_default": {}}' > "$MEMORY_FILE"
fi

echo "${GREEN}✅ Données réinitialisées (25 factures état 'veille')${NC}"
echo ""

# ============================================
# 3. LANCEMENT BACKEND
# ============================================
echo "${BLUE}🚀 Démarrage backend (port 8000)...${NC}"

cd "$PROJECT_ROOT/backend"

# Lancer uvicorn en arrière-plan
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload > /tmp/agent-daf-demo.log 2>&1 &
BACKEND_PID=$!

echo "   PID backend: $BACKEND_PID"

# Attendre que le backend soit prêt
echo "   Attente démarrage..."
for i in {1..20}; do
    if curl -s http://localhost:8000/agent/autonomous/status > /dev/null 2>&1; then
        echo "${GREEN}✅ Backend opérationnel${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# ============================================
# 4. ACTIVATION MODE AUTONOME
# ============================================
echo "${BLUE}🤖 Activation mode autonome...${NC}"

sleep 2
RESPONSE=$(curl -s -X POST http://localhost:8000/agent/autonomous/start)

if echo "$RESPONSE" | grep -q "started"; then
    echo "${GREEN}✅ Mode autonome activé${NC}"
else
    echo "${RED}⚠️  Erreur activation mode autonome${NC}"
    echo "   Réponse: $RESPONSE"
fi
echo ""

# Attendre que le premier run se fasse
echo "   Attente première analyse (20s)..."
sleep 20

# ============================================
# 5. LANCEMENT FRONTEND
# ============================================
echo "${BLUE}🎨 Démarrage frontend (port 5175)...${NC}"

cd "$PROJECT_ROOT/frontend-bpi"

# Vérifier que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "   Installation dépendances npm..."
    npm install --silent
fi

# Lancer en arrière-plan
nohup npm run dev > /tmp/agent-daf-frontend.log 2>&1 &
FRONTEND_PID=$!

echo "   PID frontend: $FRONTEND_PID"

# Attendre que le frontend soit prêt
echo "   Attente démarrage frontend..."
for i in {1..30}; do
    if curl -s http://localhost:5175 > /dev/null 2>&1; then
        echo "${GREEN}✅ Frontend opérationnel${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""
echo ""

# ============================================
# 6. RÉSUMÉ
# ============================================
echo "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo "${GREEN}║                                            ║${NC}"
echo "${GREEN}║   ✅  DÉMO PRÊTE !                         ║${NC}"
echo "${GREEN}║                                            ║${NC}"
echo "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo "📊 Dashboard:     ${BLUE}http://localhost:5175${NC}"
echo "📤 Import page:   ${BLUE}http://localhost:5175/import${NC}"
echo "🔧 API Backend:   ${BLUE}http://localhost:8000${NC}"
echo ""
echo "📝 État initial:"
echo "   • 25 factures 'état veille'"
echo "   • ~7 risques HIGH connus"
echo "   • Balance ~4.5M€"
echo "   • Agent en surveillance active"
echo ""
echo "🎬 Scénario démo:"
echo "   1. Montrer dashboard 'situation normale'"
echo "   2. Aller sur /import"
echo "   3. Ajouter facture critique (850K€, 52j retard)"
echo "   4. Revenir sur dashboard → voir actualisation temps réel"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f /tmp/agent-daf-demo.log"
echo "   Frontend: tail -f /tmp/agent-daf-frontend.log"
echo ""
echo "🛑 Pour arrêter:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   ou: lsof -ti:8000 | xargs kill -9 && lsof -ti:5175 | xargs kill -9"
echo ""
echo "${GREEN}🎥 Prêt pour l'enregistrement OBS !${NC}"
echo ""

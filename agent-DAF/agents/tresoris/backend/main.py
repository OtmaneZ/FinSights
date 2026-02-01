"""
Agent DAF - API FastAPI V2 - Architecture Hyper-Spécialisée
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRESORIS Risk Agent V2 - API complète pour surveillance trésorerie

═══════════════════════════════════════════════════════════════════
ENDPOINTS AGENT (Contrôle)
═══════════════════════════════════════════════════════════════════
- POST /agent/start         → Démarre surveillance autonome
- POST /agent/stop          → Arrête l'agent
- GET  /agent/status        → Statut actuel
- GET  /agent/analysis/latest → Dernière analyse
- POST /agent/validate      → Validation DAF d'une action
- GET  /agent/audit         → Rapport d'audit

═══════════════════════════════════════════════════════════════════
ENDPOINTS DATA (Nouveaux - pour Frontend)
═══════════════════════════════════════════════════════════════════
- POST /upload              → Upload CSV/Excel factures clients
- POST /demo/init           → Charger données démo + lancer analyse
- GET  /client/{id}         → Détails complet d'un client
- GET  /dashboard           → Données agrégées pour dashboard

═══════════════════════════════════════════════════════════════════
ENDPOINT SIMULATION (Killer Feature)
═══════════════════════════════════════════════════════════════════
- POST /agent/simulate      → Simule ajout facture → retourne impact
                              (runway, rating, warnings, actions)
                              PARFAIT pour démonstrations interactives

═══════════════════════════════════════════════════════════════════
WEBSOCKET
═══════════════════════════════════════════════════════════════════
- WS /ws                    → Updates temps réel
"""

import asyncio
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from pathlib import Path
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import shutil
import io

# V2 - Nouvelle architecture
from agent import RiskRequalificationAgent, TresorisMemory, get_version_info

# V2 Engines pour API enrichie
from engine.payment_patterns import ClientPaymentAnalyzer
from engine.client_scoring import ClientRiskScorer
from engine.early_warning import EarlyWarningDetector
from engine.smart_forecast import SmartForecaster

# V3 - Google Sheets Integration
from api.gsheet_router import router as gsheet_router, storage as gsheet_storage, run_analysis, gsheet_to_dataframe
from api.apikey_router import router as apikey_router
from sheets_poller import SheetsPoller


# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class StartResponse(BaseModel):
    status: str
    message: str
    version: str


class ValidationRequest(BaseModel):
    action_id: str
    decision: str  # "approved" | "rejected"
    validated_by: str = "DAF"
    comment: Optional[str] = None


class StatusResponse(BaseModel):
    running: bool
    mode: str
    version: str
    last_decision: Optional[Dict]
    current_analysis_summary: Optional[Dict]


# ═══════════════════════════════════════════════════════════════════════════════
# NOUVEAUX MODÈLES - API Enrichie pour Frontend
# ═══════════════════════════════════════════════════════════════════════════════

class SimulateInvoiceRequest(BaseModel):
    """Requête pour simuler l'ajout d'une facture"""
    client_name: str                    # Nom client (existant ou nouveau)
    amount: float                       # Montant en €
    days_overdue: int = 0               # Jours de retard (0 = pas en retard)
    due_date: Optional[str] = None      # Date échéance (optionnel, calculée si absent)


class SimulationResult(BaseModel):
    """Résultat de simulation d'impact"""
    # Impact global
    runway_before_weeks: float
    runway_after_weeks: float
    runway_delta_weeks: float
    
    # Impact client
    client_rating_before: Optional[str]
    client_rating_after: str
    client_score_before: Optional[float]
    client_score_after: float
    rating_changed: bool
    
    # Risques déclenchés
    risk_status: str                    # "CERTAIN" | "UNCERTAIN" | "CRITICAL"
    risk_score: int                     # 0-100
    
    # Alertes générées
    warnings_triggered: List[Dict]
    
    # Actions recommandées
    actions_generated: List[Dict]
    
    # Contexte
    simulation_summary: str
    is_demo: bool = True


class DashboardData(BaseModel):
    """Données agrégées pour le dashboard"""
    # Position cash
    total_pending: float
    total_overdue: float
    runway_weeks: float
    
    # Répartition risques
    risks_by_status: Dict[str, int]
    amount_by_status: Dict[str, float]
    
    # Top clients à risque
    top_risky_clients: List[Dict]
    
    # Alertes actives
    active_warnings: List[Dict]
    
    # Actions pending
    pending_actions: List[Dict]
    
    # Stats
    dso_moyen: float
    nb_clients: int
    nb_factures_pending: int


# ═══════════════════════════════════════════════════════════════════════════════
# GLOBAL STATE
# ═══════════════════════════════════════════════════════════════════════════════

class AppState:
    def __init__(self):
        self.agent: Optional[RiskRequalificationAgent] = None
        self.memory: Optional[TresorisMemory] = None
        self.websocket_clients: List[WebSocket] = []
        self.sheets_poller: Optional[SheetsPoller] = None  # ← Nouveau


state = AppState()


# ═══════════════════════════════════════════════════════════════════════════════
# WEBSOCKET BROADCAST
# ═══════════════════════════════════════════════════════════════════════════════

async def broadcast_event(event: Dict):
    """Broadcast un événement à tous les clients WebSocket connectés"""
    if not state.websocket_clients:
        return
    
    message = json.dumps(event, default=str)
    
    # Envoyer à tous les clients
    disconnected = []
    for client in state.websocket_clients:
        try:
            await client.send_text(message)
        except:
            disconnected.append(client)
    
    # Nettoyer les déconnectés
    for client in disconnected:
        state.websocket_clients.remove(client)


# ═══════════════════════════════════════════════════════════════════════════════
# LIFESPAN
# ═══════════════════════════════════════════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup et shutdown de l'application"""
    
    # ═══════════════════════════════════════════════════════════════════
    # CHARGER CONFIGURATION .env
    # ═══════════════════════════════════════════════════════════════════
    load_dotenv()
    
    # Startup
    version = get_version_info()
    print(f"🚀 Démarrage TRESORIS - {version['name']}")
    print(f"📦 Version: {version['current']}")
    print(f"🔄 Architecture: {' → '.join(version['architecture']['steps'])}")
    
    # Paths
    data_path = Path(__file__).parent / "data"
    storage_path = Path(__file__).parent / "storage" / "memory_v2"
    
    # Initialiser la mémoire
    state.memory = TresorisMemory(storage_path)
    print(f"💾 Mémoire initialisée: {len(state.memory.analyses)} analyses")
    
    # Créer l'agent
    state.agent = RiskRequalificationAgent(data_path, state.memory)
    state.agent.register_event_callback(broadcast_event)
    print(f"✅ Agent créé")
    
    print("💡 API prête sur http://localhost:8000")
    print("📡 WebSocket sur ws://localhost:8000/ws")
    
    # ═══════════════════════════════════════════════════════════════════
    # GOOGLE SHEETS POLLING AUTOMATIQUE
    # ═══════════════════════════════════════════════════════════════════
    
    async def on_sheet_change(data: Dict):
        """Callback appelé quand le Google Sheet change"""
        try:
            factures_list = data.get('factures', [])
            print(f"[SHEETS POLLER] 🔄 Changement détecté - {len(factures_list)} factures")
            
            # Créer un objet GSheetWebhookPayload pour gsheet_to_dataframe
            from api.gsheet_router import GSheetWebhookPayload
            payload = GSheetWebhookPayload(
                timestamp=data.get("timestamp", datetime.now().isoformat()),
                spreadsheet_id=data.get("spreadsheet_id", SPREADSHEET_ID),
                spreadsheet_name=data.get("spreadsheet_name", ""),
                factures=factures_list,
                encaissements=data.get("encaissements", []),
                parametres=data.get("parametres", {})
            )
            
            # Convertir en DataFrame
            df = gsheet_to_dataframe(payload)
            
            if df.empty:
                print("[SHEETS POLLER] ⚠️ Aucune donnée, skip analyse")
                return
            
            # Lancer l'analyse
            analysis_result = await run_analysis(df, payload.parametres)
            
            # Créer dashboard
            from api.gsheet_router import create_dashboard_data, create_alerts_from_analysis
            dashboard = create_dashboard_data(df, analysis_result)
            alerts = create_alerts_from_analysis(analysis_result)
            
            # Stocker
            gsheet_storage.store_analysis(
                payload.spreadsheet_id,
                analysis_result,
                alerts,
                dashboard
            )
            
            print(f"[SHEETS POLLER] ✅ Analyse stockée - {len(alerts)} alertes")
            
            # Broadcast via WebSocket
            await broadcast_event({
                "type": "analysis_complete",
                "spreadsheet_id": payload.spreadsheet_id,
                "timestamp": datetime.now().isoformat(),
                "factures_count": len(factures_list),
                "alerts_count": len(alerts)
            })
            
        except Exception as e:
            print(f"[SHEETS POLLER] ❌ Erreur analyse: {e}")
    
    # Configuration depuis .env
    SPREADSHEET_ID = os.getenv("SPREADSHEET_ID", "1b0ZrJRUMpjdEyNXqVRpUV8VWKepakd8hJhfGM9smtJs")
    POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", "30"))
    AUTO_POLLING_ENABLED = os.getenv("AUTO_POLLING_ENABLED", "true").lower() == "true"
    
    print(f"📊 Configuration:")
    print(f"   • Sheet ID: {SPREADSHEET_ID[:20]}...")
    print(f"   • Polling: {POLL_INTERVAL}s")
    print(f"   • Auto-polling: {'✅' if AUTO_POLLING_ENABLED else '❌'}")
    
    CREDENTIALS_PATH = Path(__file__).parent / "client_secret_39527606151-kji3n4t7ksquqb5pvie9ebr5t1hi1q5m.apps.googleusercontent.com.json"
    
    if AUTO_POLLING_ENABLED and CREDENTIALS_PATH.exists():
        try:
            state.sheets_poller = SheetsPoller(
                spreadsheet_id=SPREADSHEET_ID,
                credentials_path=str(CREDENTIALS_PATH),
                on_change_callback=on_sheet_change,
                poll_interval=POLL_INTERVAL
            )
            
            # Lancer le polling en tâche de fond
            asyncio.create_task(state.sheets_poller.start())
            print(f"📊 Google Sheets Polling activé (30s)")
        except Exception as e:
            print(f"⚠️ Google Sheets Polling désactivé: {e}")
    else:
        print(f"⚠️ Credentials non trouvés: {CREDENTIALS_PATH}")
    
    yield
    
    # Shutdown
    print("👋 Arrêt TRESORIS")
    if state.sheets_poller:
        state.sheets_poller.stop()
    if state.agent and state.agent.running:
        await state.agent.stop()


# ═══════════════════════════════════════════════════════════════════════════════
# APP
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="TRESORIS API V3",
    description="Agent hyper-spécialisé requalification risques trésorerie - Avec intégration Google Sheets",
    version="3.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# V3 - Ajouter les routers
app.include_router(gsheet_router)
app.include_router(apikey_router)


# ═══════════════════════════════════════════════════════════════════════════════
# WEBSOCKET
# ═══════════════════════════════════════════════════════════════════════════════

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket pour updates temps réel"""
    await websocket.accept()
    state.websocket_clients.append(websocket)
    
    print(f"🔌 Client WebSocket connecté (total: {len(state.websocket_clients)})")
    
    try:
        # Envoyer le statut initial
        await websocket.send_json({
            "type": "connected",
            "version": get_version_info(),
            "timestamp": datetime.now().isoformat()
        })
        
        # Garder la connexion ouverte
        while True:
            data = await websocket.receive_text()
            # Echo ou traitement si nécessaire
            
    except WebSocketDisconnect:
        state.websocket_clients.remove(websocket)
        print(f"🔌 Client WebSocket déconnecté (reste: {len(state.websocket_clients)})")


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTES - CHAT ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/v1/chat")
async def chat_with_agent(request: Dict[str, Any]):
    """
    Chat avec l'agent TRESORIS pour obtenir des réponses contextuelles.
    """
    try:
        question = request.get("question", "")
        spreadsheet_id = request.get("spreadsheet_id", "demo")
        
        print(f"[CHAT] Question: {question[:50]}... | Sheet: {spreadsheet_id}")
        # Test Git refresh
        
        if not question:
            return {
                "success": False,
                "error": "Question vide"
            }
        
        # Récupérer la dernière analyse
        latest_analysis = gsheet_storage.get_latest_analysis(spreadsheet_id)
        
        # Debug: afficher les clés disponibles dans le storage
        print(f"[CHAT] Storage keys: {list(gsheet_storage._analyses.keys()) if hasattr(gsheet_storage, '_analyses') else 'unknown'}")
        print(f"[CHAT] Analysis found: {latest_analysis is not None}")
        
        if not latest_analysis:
            # Fallback: essayer de récupérer les données du dernier fetch
            # Construire un contexte minimal à partir de rien
            return {
                "success": True,
                "response": "Je n'ai pas encore analysé vos données. Assurez-vous que le Google Sheet contient des factures et attendez quelques secondes pour que je les analyse. 🔄"
            }
        
        # Contexte pour l'agent
        context = {
            "kpis": latest_analysis.get("dashboard", {}).get("kpis", {}),
            "health_score": latest_analysis.get("analysis", {}).get("health_score", 0),
            "concentration": latest_analysis.get("analysis", {}).get("concentration_risk", {}),
            "alerts_count": len(latest_analysis.get("alerts", []))
        }
        
        # Générer une réponse intelligente avec Gemini 2.5 Flash
        response = await generate_chat_response(question, context)
        
        return {
            "success": True,
            "response": response,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"❌ Erreur chat: {e}")
        return {
            "success": False,
            "error": str(e)
        }


async def generate_chat_response(question: str, context: Dict) -> str:
    """
    Génère une réponse intelligente via Gemini 2.5 Flash.
    Utilise le contexte financier réel pour des réponses précises.
    """
    try:
        # Préparer le contexte financier
        kpis = context.get("kpis", {})
        health_score = context.get("health_score", 0)
        concentration = context.get("concentration", {})
        alerts_count = context.get("alerts_count", 0)
        
        # Construire le prompt système
        system_prompt = f"""Tu es TRESORIS, un agent IA expert en trésorerie d'entreprise.

CONTEXTE FINANCIER ACTUEL:
- Cash à recevoir: {kpis.get('montant_total', 0):,.0f}€
- Factures en retard: {kpis.get('factures_en_retard', 0)} ({kpis.get('montant_en_retard', 0):,.0f}€)
- DSO moyen: {kpis.get('dso_jours', 0):.0f} jours
- Runway: {kpis.get('runway_jours', 0)} jours
- Score de santé: {health_score:.0f}/100
- Client principal: {concentration.get('top_client', 'N/A')} ({concentration.get('top_client_pct', 0):.0f}% du CA)
- Alertes actives: {alerts_count}

INSTRUCTIONS:
- Réponds en français, de manière concise (2-3 phrases max)
- Sois direct et actionnable
- Utilise les chiffres exacts du contexte
- Si demande conseil, donne 1-2 actions concrètes
- Ton style: professionnel mais accessible (comme un CFO bienveillant)
"""

        # Appel à OpenRouter avec Gemini 2.5 Flash
        import httpx
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://tresoris.app",
                    "X-Title": "TRESORIS Agent"
                },
                json={
                    "model": os.getenv("LLM_MODEL", "google/gemini-2.5-flash"),
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": question}
                    ],
                    "max_tokens": 300,
                    "temperature": 0.7
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                print(f"❌ Erreur OpenRouter: {response.status_code}")
                return fallback_response(question, context)
                
    except Exception as e:
        print(f"❌ Erreur LLM: {e}")
        return fallback_response(question, context)


def fallback_response(question: str, context: Dict) -> str:
    """Réponses de secours si le LLM échoue"""
    question_lower = question.lower()
    kpis = context.get("kpis", {})
    
    if "cash" in question_lower or "trésorerie" in question_lower:
        return f"Vous avez {kpis.get('montant_total', 0):,.0f}€ à recevoir. Santé financière: {context.get('health_score', 0):.0f}/100."
    elif "retard" in question_lower:
        count = kpis.get("factures_en_retard", 0)
        return "Aucune facture en retard. Excellent!" if count == 0 else f"{count} facture(s) en retard pour {kpis.get('montant_en_retard', 0):,.0f}€."
    else:
        return f"Je surveille {kpis.get('total_factures', 0)} factures. Score: {context.get('health_score', 0):.0f}/100. Posez-moi une question précise!"


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTES - AGENT CONTROL
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    """Root endpoint avec info version"""
    version = get_version_info()
    return {
        "service": "TRESORIS API",
        "version": version["current"],
        "description": version["description"],
        "status": "operational",
        "endpoints": {
            "agent": "/agent/*",
            "data": "/upload, /demo/init, /client/{id}",
            "simulate": "/agent/simulate",
            "dashboard": "/dashboard",
            "websocket": "/ws",
            "docs": "/docs"
        }
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTES - DATA MANAGEMENT (Nouveaux endpoints pour frontend)
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/upload")
async def upload_invoices(file: UploadFile = File(...)):
    """
    Upload CSV/Excel factures clients.
    
    Colonnes attendues:
    - invoice_id, client_id, client_name, invoice_date, due_date, amount, status
    - Optionnel: payment_date, days_overdue, risk_level
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Fichier requis")
    
    # Vérifier extension
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Format CSV ou Excel requis")
    
    try:
        # Lire le fichier
        contents = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
        
        # Vérifier colonnes minimales
        required = ['client_name', 'amount', 'due_date']
        missing = [c for c in required if c not in df.columns]
        if missing:
            raise HTTPException(
                status_code=400, 
                detail=f"Colonnes manquantes: {', '.join(missing)}"
            )
        
        # Générer IDs si absents
        if 'invoice_id' not in df.columns:
            df['invoice_id'] = [f"INV-{i+1:04d}" for i in range(len(df))]
        if 'client_id' not in df.columns:
            df['client_id'] = df['client_name'].apply(lambda x: f"CLI-{hash(x) % 10000:04d}")
        if 'status' not in df.columns:
            df['status'] = 'pending'
        
        # Calculer days_overdue si pas présent
        if 'days_overdue' not in df.columns:
            df['due_date'] = pd.to_datetime(df['due_date'], errors='coerce')
            df['days_overdue'] = (datetime.now() - df['due_date']).dt.days
            df['days_overdue'] = df['days_overdue'].clip(lower=0).fillna(0).astype(int)
        
        # Sauvegarder
        data_path = Path(__file__).parent / "data" / "customer_invoices.csv"
        df.to_csv(data_path, index=False)
        
        # Stats
        pending = df[df['status'] != 'paid']
        
        return {
            "status": "success",
            "message": f"✅ {len(df)} factures importées",
            "stats": {
                "total_invoices": len(df),
                "pending_invoices": len(pending),
                "total_amount": float(df['amount'].sum()),
                "pending_amount": float(pending['amount'].sum()) if not pending.empty else 0,
                "clients": int(df['client_name'].nunique()),
                "overdue_count": int((df['days_overdue'] > 0).sum())
            },
            "preview": df.head(5).to_dict(orient='records')
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur traitement: {str(e)}")


@app.post("/demo/init")
async def init_demo_data():
    """
    Charge le dataset démo et lance une analyse initiale.
    Idéal pour démonstrations et tests.
    """
    if not state.agent:
        raise HTTPException(status_code=500, detail="Agent non initialisé")
    
    try:
        data_path = Path(__file__).parent / "data" / "customer_invoices.csv"
        
        if not data_path.exists():
            raise HTTPException(status_code=404, detail="Fichier demo introuvable")
        
        # Charger données
        df = pd.read_csv(data_path)
        
        # Recalculer days_overdue (dates peuvent être obsolètes)
        if 'due_date' in df.columns:
            df['due_date'] = pd.to_datetime(df['due_date'], errors='coerce')
            df['days_overdue'] = (datetime.now() - df['due_date']).dt.days
            df['days_overdue'] = df['days_overdue'].clip(lower=0).fillna(0).astype(int)
            df.to_csv(data_path, index=False)
        
        # Lancer analyse si agent pas déjà en cours
        if not state.agent.running:
            await state.agent.start()
        
        # Forcer une analyse
        result = await state.agent.run_analysis("Initialisation demo")
        
        # Stats
        pending = df[df['status'] != 'paid']
        overdue = df[df['days_overdue'] > 0]
        
        return {
            "status": "success",
            "message": "✅ Demo initialisée avec analyse complète",
            "data_stats": {
                "total_invoices": len(df),
                "pending_invoices": len(pending),
                "overdue_invoices": len(overdue),
                "total_amount": float(df['amount'].sum()),
                "pending_amount": float(pending['amount'].sum()) if not pending.empty else 0,
                "clients": int(df['client_name'].nunique())
            },
            "analysis_summary": result.summary if result else None,
            "analysis_id": result.id if result else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur init demo: {str(e)}")


@app.get("/client/{client_id}")
async def get_client_details(client_id: str):
    """
    Détails complets d'un client:
    - Pattern de paiement
    - Score risque (A/B/C/D)
    - Factures pending
    - Early warnings
    - Historique
    """
    data_path = Path(__file__).parent / "data" / "customer_invoices.csv"
    
    if not data_path.exists():
        raise HTTPException(status_code=404, detail="Aucune donnée chargée")
    
    try:
        df = pd.read_csv(data_path)
        
        # Chercher par client_id ou client_name
        client_col = 'client_name'
        client_data = df[df[client_col] == client_id]
        
        if client_data.empty:
            # Essayer avec client_id
            if 'client_id' in df.columns:
                client_data = df[df['client_id'] == client_id]
        
        if client_data.empty:
            raise HTTPException(status_code=404, detail=f"Client '{client_id}' non trouvé")
        
        client_name = client_data[client_col].iloc[0]
        
        # Analyser pattern
        analyzer = ClientPaymentAnalyzer(df)
        try:
            pattern = analyzer.analyze_client(client_name)
        except:
            pattern = None
        
        # Scorer client
        pending = df[df['status'] != 'paid']
        total_pending = pending['amount'].sum()
        client_pending = client_data[client_data['status'] != 'paid']['amount'].sum()
        
        scorer = ClientRiskScorer()
        if pattern:
            score = scorer.calculate_risk_score(
                pattern=pattern,
                pending_amount=float(client_pending),
                total_portfolio=float(total_pending) if total_pending > 0 else 1
            )
        else:
            score = None
        
        # Early warnings
        warnings = []
        if state.agent and state.agent.current_analysis:
            for risk in state.agent.current_analysis.risks:
                if risk.client == client_name:
                    warnings.append({
                        "type": risk.type,
                        "status": risk.status.value,
                        "amount": risk.amount,
                        "days_overdue": risk.days_overdue,
                        "score": risk.score,
                        "justification": risk.justification
                    })
        
        return {
            "client_id": client_id,
            "client_name": client_name,
            "pattern": {
                "avg_delay_days": pattern.avg_delay_days if pattern else None,
                "on_time_rate": pattern.on_time_rate if pattern else None,
                "trend": pattern.trend if pattern else None,
                "reliability_score": pattern.reliability_score if pattern else None,
                "risk_level": pattern.risk_level if pattern else None
            } if pattern else None,
            "scoring": {
                "rating": score.rating if score else None,
                "risk_score": score.risk_score if score else None,
                "explanation": score.explanation if score else None,
                "risk_factors": score.risk_factors if score else [],
                "positive_factors": score.positive_factors if score else [],
                "confidence": score.confidence if score else None
            } if score else None,
            "invoices": {
                "total": len(client_data),
                "pending": len(client_data[client_data['status'] != 'paid']),
                "paid": len(client_data[client_data['status'] == 'paid']),
                "total_amount": float(client_data['amount'].sum()),
                "pending_amount": float(client_pending),
                "overdue_amount": float(client_data[client_data['days_overdue'] > 0]['amount'].sum())
            },
            "warnings": warnings,
            "pending_invoices": client_data[client_data['status'] != 'paid'].to_dict(orient='records')
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


@app.post("/agent/simulate", response_model=SimulationResult)
async def simulate_invoice_impact(request: SimulateInvoiceRequest):
    """
    🎯 KILLER FEATURE: Simule l'ajout d'une facture et retourne l'impact TRESORIS.
    
    NE PERSISTE PAS la facture (simulation pure).
    Montre la réaction agentique selon:
    - Montant
    - Retard
    - Historique client
    
    Parfait pour démonstrations interactives.
    """
    data_path = Path(__file__).parent / "data" / "customer_invoices.csv"
    
    if not data_path.exists():
        raise HTTPException(status_code=404, detail="Aucune donnée chargée. Utilisez /demo/init ou /upload d'abord.")
    
    try:
        # Charger données actuelles
        df = pd.read_csv(data_path)
        
        # ─── ÉTAT AVANT ───
        pending_before = df[df['status'] != 'paid']
        total_pending_before = pending_before['amount'].sum()
        
        # Runway avant (approximation: pending / moyenne mensuelle)
        avg_monthly = total_pending_before / 3  # Hypothèse 3 mois de data
        runway_before = (total_pending_before / avg_monthly * 4) if avg_monthly > 0 else 12  # en semaines
        
        # Score client avant (si existe)
        client_exists = request.client_name in df['client_name'].values
        client_rating_before = None
        client_score_before = None
        
        if client_exists:
            analyzer = ClientPaymentAnalyzer(df)
            try:
                pattern_before = analyzer.analyze_client(request.client_name)
                scorer = ClientRiskScorer()
                client_pending = pending_before[pending_before['client_name'] == request.client_name]['amount'].sum()
                score_before = scorer.calculate_risk_score(
                    pattern=pattern_before,
                    pending_amount=float(client_pending),
                    total_portfolio=float(total_pending_before) if total_pending_before > 0 else 1
                )
                client_rating_before = score_before.rating
                client_score_before = score_before.risk_score
            except:
                pass
        
        # ─── AJOUTER FACTURE SIMULÉE ───
        due_date = request.due_date or (datetime.now() - timedelta(days=request.days_overdue)).strftime('%Y-%m-%d')
        
        simulated_invoice = {
            'invoice_id': f'SIM-{datetime.now().strftime("%H%M%S")}',
            'client_id': f'CLI-{hash(request.client_name) % 10000:04d}',
            'client_name': request.client_name,
            'invoice_date': (datetime.now() - timedelta(days=request.days_overdue + 30)).strftime('%Y-%m-%d'),
            'due_date': due_date,
            'amount': request.amount,
            'status': 'overdue' if request.days_overdue > 0 else 'pending',
            'payment_date': None,
            'days_overdue': request.days_overdue,
            'risk_level': 'critical' if request.days_overdue > 60 else 'high' if request.days_overdue > 30 else 'medium' if request.days_overdue > 0 else 'low'
        }
        
        df_with_sim = pd.concat([df, pd.DataFrame([simulated_invoice])], ignore_index=True)
        
        # ─── ÉTAT APRÈS ───
        pending_after = df_with_sim[df_with_sim['status'] != 'paid']
        total_pending_after = pending_after['amount'].sum()
        
        # Runway après
        runway_after = (total_pending_after / avg_monthly * 4) if avg_monthly > 0 else 12
        
        # Score client après
        analyzer_after = ClientPaymentAnalyzer(df_with_sim)
        try:
            pattern_after = analyzer_after.analyze_client(request.client_name)
            scorer = ClientRiskScorer()
            client_pending_after = pending_after[pending_after['client_name'] == request.client_name]['amount'].sum()
            score_after = scorer.calculate_risk_score(
                pattern=pattern_after,
                pending_amount=float(client_pending_after),
                total_portfolio=float(total_pending_after) if total_pending_after > 0 else 1
            )
            client_rating_after = score_after.rating
            client_score_after = score_after.risk_score
        except:
            # Nouveau client sans historique = rating C par défaut
            client_rating_after = "C" if request.days_overdue < 30 else "D"
            client_score_after = 55 if request.days_overdue < 30 else 75
        
        # ─── DÉTECTER WARNINGS ───
        warnings_triggered = []
        
        # Warning: Retard critique
        if request.days_overdue > 60:
            warnings_triggered.append({
                "type": "critical_delay",
                "severity": "critical",
                "message": f"Retard > 60 jours ({request.days_overdue}j) - Action immédiate requise",
                "amount_at_risk": request.amount
            })
        elif request.days_overdue > 30:
            warnings_triggered.append({
                "type": "significant_delay",
                "severity": "high",
                "message": f"Retard significatif ({request.days_overdue}j) - Surveillance renforcée",
                "amount_at_risk": request.amount
            })
        
        # Warning: Montant élevé
        if request.amount > 200000:
            warnings_triggered.append({
                "type": "high_amount",
                "severity": "high" if request.amount > 400000 else "medium",
                "message": f"Montant élevé ({request.amount/1000:.0f}K€) - Impact runway significatif",
                "amount_at_risk": request.amount
            })
        
        # Warning: Concentration
        client_total = pending_after[pending_after['client_name'] == request.client_name]['amount'].sum()
        concentration = (client_total / total_pending_after * 100) if total_pending_after > 0 else 0
        if concentration > 30:
            warnings_triggered.append({
                "type": "concentration_risk",
                "severity": "critical" if concentration > 40 else "high",
                "message": f"Concentration client: {concentration:.0f}% du portefeuille",
                "amount_at_risk": client_total
            })
        
        # Warning: Dégradation rating
        if client_rating_before and client_rating_after:
            rating_order = {'A': 1, 'B': 2, 'C': 3, 'D': 4}
            if rating_order.get(client_rating_after, 0) > rating_order.get(client_rating_before, 0):
                warnings_triggered.append({
                    "type": "rating_degradation",
                    "severity": "high",
                    "message": f"Dégradation rating: {client_rating_before} → {client_rating_after}",
                    "amount_at_risk": client_total
                })
        
        # ─── DÉTERMINER RISK STATUS ───
        risk_status = "CERTAIN"
        risk_score = 25
        
        if request.days_overdue > 60 or concentration > 40:
            risk_status = "CRITICAL"
            risk_score = 85
        elif request.days_overdue > 30 or concentration > 30 or request.amount > 300000:
            risk_status = "UNCERTAIN"
            risk_score = 60
        elif request.days_overdue > 0 or request.amount > 100000:
            risk_status = "UNCERTAIN"
            risk_score = 45
        
        # ─── GÉNÉRER ACTIONS ───
        actions_generated = []
        
        if risk_status == "CRITICAL":
            actions_generated.append({
                "priority": "P1",
                "title": f"Relancer immédiatement {request.client_name}",
                "description": f"Facture {request.amount/1000:.0f}K€ en retard de {request.days_overdue}j",
                "deadline": "Immédiat",
                "impact_amount": request.amount
            })
        
        if risk_status in ["CRITICAL", "UNCERTAIN"]:
            actions_generated.append({
                "priority": "P2",
                "title": f"Requalifier forecast {request.client_name}",
                "description": "Mettre à jour les prévisions de trésorerie",
                "deadline": "Cette semaine",
                "impact_amount": request.amount
            })
        
        if concentration > 25:
            actions_generated.append({
                "priority": "P2" if concentration > 35 else "P3",
                "title": f"Analyser exposition {request.client_name}",
                "description": f"Concentration à {concentration:.0f}% - diversifier si possible",
                "deadline": "2 semaines",
                "impact_amount": client_total
            })
        
        # ─── CONSTRUIRE SUMMARY ───
        summary_parts = []
        
        if risk_status == "CRITICAL":
            summary_parts.append(f"🔴 ALERTE CRITIQUE: Cette facture déclenche un risque majeur")
        elif risk_status == "UNCERTAIN":
            summary_parts.append(f"🟡 ATTENTION: Cette facture nécessite une surveillance renforcée")
        else:
            summary_parts.append(f"🟢 OK: Cette facture ne déclenche pas d'alerte particulière")
        
        summary_parts.append(f"Impact runway: {runway_before:.1f} → {runway_after:.1f} semaines ({runway_after - runway_before:+.1f})")
        
        if client_rating_before and client_rating_before != client_rating_after:
            summary_parts.append(f"Rating client: {client_rating_before} → {client_rating_after}")
        elif not client_rating_before:
            summary_parts.append(f"Nouveau client détecté avec rating initial: {client_rating_after}")
        
        if warnings_triggered:
            summary_parts.append(f"{len(warnings_triggered)} alerte(s) déclenchée(s)")
        
        simulation_summary = " | ".join(summary_parts)
        
        return SimulationResult(
            runway_before_weeks=round(runway_before, 1),
            runway_after_weeks=round(runway_after, 1),
            runway_delta_weeks=round(runway_after - runway_before, 1),
            client_rating_before=client_rating_before,
            client_rating_after=client_rating_after,
            client_score_before=client_score_before,
            client_score_after=client_score_after,
            rating_changed=client_rating_before != client_rating_after if client_rating_before else True,
            risk_status=risk_status,
            risk_score=risk_score,
            warnings_triggered=warnings_triggered,
            actions_generated=actions_generated,
            simulation_summary=simulation_summary,
            is_demo=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur simulation: {str(e)}")


@app.get("/dashboard")
async def get_dashboard_data():
    """
    Données agrégées pour le dashboard frontend.
    Tout ce dont le frontend a besoin en un seul appel.
    """
    data_path = Path(__file__).parent / "data" / "customer_invoices.csv"
    
    if not data_path.exists():
        raise HTTPException(status_code=404, detail="Aucune donnée chargée")
    
    try:
        df = pd.read_csv(data_path)
        
        # Calculer days_overdue si pas présent
        if 'days_overdue' not in df.columns and 'due_date' in df.columns:
            df['due_date'] = pd.to_datetime(df['due_date'], errors='coerce')
            df['days_overdue'] = (datetime.now() - df['due_date']).dt.days
            df['days_overdue'] = df['days_overdue'].clip(lower=0).fillna(0).astype(int)
        
        pending = df[df['status'] != 'paid']
        overdue = pending[pending['days_overdue'] > 0]
        
        # Position cash
        total_pending = float(pending['amount'].sum()) if not pending.empty else 0
        total_overdue = float(overdue['amount'].sum()) if not overdue.empty else 0
        
        # Runway (approximation)
        avg_monthly = total_pending / 3 if total_pending > 0 else 1
        runway_weeks = round(total_pending / avg_monthly * 4, 1) if avg_monthly > 0 else 12
        
        # Répartition par status (depuis analyse)
        risks_by_status = {"CERTAIN": 0, "UNCERTAIN": 0, "CRITICAL": 0}
        amount_by_status = {"CERTAIN": 0.0, "UNCERTAIN": 0.0, "CRITICAL": 0.0}
        
        if state.agent and state.agent.current_analysis:
            for risk in state.agent.current_analysis.risks:
                status = risk.status.value.upper()
                risks_by_status[status] = risks_by_status.get(status, 0) + 1
                amount_by_status[status] = amount_by_status.get(status, 0) + risk.amount
        
        # Top clients à risque
        top_risky_clients = []
        if state.agent and state.agent.current_analysis:
            # Grouper risques par client
            client_risks = {}
            for risk in state.agent.current_analysis.risks:
                if risk.client not in client_risks:
                    client_risks[risk.client] = {
                        "client_name": risk.client,
                        "total_amount": 0,
                        "max_days_overdue": 0,
                        "risk_count": 0,
                        "max_score": 0,
                        "status": "CERTAIN"
                    }
                client_risks[risk.client]["total_amount"] += risk.amount
                client_risks[risk.client]["max_days_overdue"] = max(
                    client_risks[risk.client]["max_days_overdue"], 
                    risk.days_overdue
                )
                client_risks[risk.client]["risk_count"] += 1
                client_risks[risk.client]["max_score"] = max(
                    client_risks[risk.client]["max_score"],
                    risk.score
                )
                if risk.status.value.upper() in ["CRITICAL", "UNCERTAIN"]:
                    client_risks[risk.client]["status"] = risk.status.value.upper()
            
            # Trier par score max
            top_risky_clients = sorted(
                client_risks.values(),
                key=lambda x: x["max_score"],
                reverse=True
            )[:5]
        
        # Alertes actives
        active_warnings = []
        if state.agent and state.agent.current_analysis:
            for risk in state.agent.current_analysis.risks:
                if risk.status.value.upper() in ["CRITICAL", "UNCERTAIN"]:
                    active_warnings.append({
                        "id": risk.id,
                        "client": risk.client,
                        "type": risk.type,
                        "severity": "critical" if risk.status.value == "critical" else "high",
                        "amount": risk.amount,
                        "days_overdue": risk.days_overdue,
                        "message": risk.justification
                    })
        
        # Actions pending
        pending_actions = []
        if state.agent and state.agent.current_analysis:
            for action in state.agent.current_analysis.actions:
                if action.validation_status == "pending":
                    pending_actions.append({
                        "id": action.id,
                        "priority": action.priority.name,
                        "title": action.title,
                        "deadline": action.deadline,
                        "impact_amount": action.impact_amount
                    })
        
        # DSO moyen
        dso_moyen = float(pending['days_overdue'].mean()) if not pending.empty else 0
        
        return {
            "total_pending": total_pending,
            "total_overdue": total_overdue,
            "runway_weeks": runway_weeks,
            "risks_by_status": risks_by_status,
            "amount_by_status": amount_by_status,
            "top_risky_clients": top_risky_clients,
            "active_warnings": active_warnings[:10],  # Max 10
            "pending_actions": pending_actions,
            "dso_moyen": round(dso_moyen, 1),
            "nb_clients": int(df['client_name'].nunique()),
            "nb_factures_pending": len(pending),
            "last_analysis": state.agent.current_analysis.id if state.agent and state.agent.current_analysis else None,
            "agent_running": state.agent.running if state.agent else False
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur dashboard: {str(e)}")


@app.post("/agent/start", response_model=StartResponse)
async def start_agent():
    """Démarre la surveillance autonome"""
    if not state.agent:
        raise HTTPException(status_code=500, detail="Agent non initialisé")
    
    if state.agent.running:
        return StartResponse(
            status="already_running",
            message="Agent déjà en cours d'exécution",
            version=get_version_info()["current"]
        )
    
    # Démarrer l'agent
    await state.agent.start()
    
    return StartResponse(
        status="started",
        message="Agent TRESORIS démarré - Surveillance active",
        version=get_version_info()["current"]
    )


@app.post("/agent/stop")
async def stop_agent():
    """Arrête l'agent"""
    if not state.agent:
        raise HTTPException(status_code=500, detail="Agent non initialisé")
    
    if not state.agent.running:
        return {
            "status": "not_running",
            "message": "Agent non actif"
        }
    
    await state.agent.stop()
    
    return {
        "status": "stopped",
        "message": "Agent arrêté"
    }


@app.get("/agent/status", response_model=StatusResponse)
async def get_agent_status():
    """Retourne le statut de l'agent"""
    if not state.agent:
        raise HTTPException(status_code=500, detail="Agent non initialisé")
    
    status = state.agent.get_status()
    
    # Résumé de l'analyse courante
    analysis_summary = None
    if state.agent.current_analysis:
        analysis_summary = {
            "id": state.agent.current_analysis.id,
            "timestamp": state.agent.current_analysis.timestamp.isoformat(),
            "risks_count": len(state.agent.current_analysis.risks),
            "actions_count": len(state.agent.current_analysis.actions),
            "critical_risks": len([r for r in state.agent.current_analysis.risks if r.status.value == "critical"])
        }
    
    return StatusResponse(
        running=status["running"],
        mode=status["mode"],
        version=get_version_info()["current"],
        last_decision=status["last_decision"],
        current_analysis_summary=analysis_summary
    )


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTES - ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/agent/analysis/latest")
async def get_latest_analysis():
    """Retourne la dernière analyse complète"""
    if not state.agent or not state.agent.current_analysis:
        # Essayer de récupérer depuis la mémoire
        if state.memory:
            last = state.memory.get_last_analysis()
            if last:
                return last
        
        raise HTTPException(status_code=404, detail="Aucune analyse disponible")
    
    return state.agent.current_analysis.to_dict()


@app.get("/agent/analysis/history")
async def get_analysis_history(limit: int = 10):
    """Retourne l'historique des analyses"""
    if not state.memory:
        raise HTTPException(status_code=500, detail="Mémoire non initialisée")
    
    history = state.memory.get_analyses_history(limit=limit)
    return {
        "total": len(history),
        "analyses": history
    }


@app.get("/agent/risks")
async def get_current_risks():
    """Retourne les risques de l'analyse courante"""
    if not state.agent or not state.agent.current_analysis:
        raise HTTPException(status_code=404, detail="Aucune analyse en cours")
    
    return {
        "risks": [r.to_dict() for r in state.agent.current_analysis.risks],
        "summary": {
            "total": len(state.agent.current_analysis.risks),
            "critical": len([r for r in state.agent.current_analysis.risks if r.status.value == "critical"]),
            "uncertain": len([r for r in state.agent.current_analysis.risks if r.status.value == "uncertain"]),
            "certain": len([r for r in state.agent.current_analysis.risks if r.status.value == "certain"])
        }
    }


@app.get("/agent/actions")
async def get_current_actions():
    """Retourne les actions proposées"""
    if not state.agent or not state.agent.current_analysis:
        raise HTTPException(status_code=404, detail="Aucune analyse en cours")
    
    return {
        "actions": [a.to_dict() for a in state.agent.current_analysis.actions],
        "pending_count": len([a for a in state.agent.current_analysis.actions if a.validation_status == "pending"])
    }


@app.get("/agent/crisis-note")
async def get_crisis_note():
    """Retourne la note DG/DAF"""
    if not state.agent or not state.agent.current_analysis:
        raise HTTPException(status_code=404, detail="Aucune analyse en cours")
    
    return {
        "note": state.agent.current_analysis.crisis_note,
        "analysis_id": state.agent.current_analysis.id,
        "timestamp": state.agent.current_analysis.timestamp.isoformat()
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTES - VALIDATION DAF
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/agent/validate")
async def validate_action(request: ValidationRequest):
    """
    Valide ou rejette une action proposée par l'agent.
    
    GOUVERNANCE : L'agent ne fait rien sans validation DAF.
    """
    if not state.agent:
        raise HTTPException(status_code=500, detail="Agent non initialisé")
    
    result = await state.agent.validate_action(
        action_id=request.action_id,
        decision=request.decision,
        validated_by=request.validated_by,
        comment=request.comment
    )
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result


@app.get("/agent/decisions")
async def get_daf_decisions(analysis_id: Optional[str] = None):
    """Retourne les décisions DAF"""
    if not state.memory:
        raise HTTPException(status_code=500, detail="Mémoire non initialisée")
    
    if analysis_id:
        decisions = state.memory.get_decisions_for_analysis(analysis_id)
    else:
        decisions = state.memory.decisions
    
    return {
        "decisions": decisions,
        "total": len(decisions)
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTES - AUDIT & INTELLIGENCE
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/agent/audit")
async def get_audit_trail(limit: int = 50, event_type: Optional[str] = None):
    """Retourne l'audit trail"""
    if not state.memory:
        raise HTTPException(status_code=500, detail="Mémoire non initialisée")
    
    trail = state.memory.get_audit_trail(limit=limit, event_type=event_type)
    return {
        "audit_trail": trail,
        "total": len(trail)
    }


@app.get("/agent/audit/report")
async def get_audit_report():
    """Génère un rapport d'audit complet"""
    if not state.memory:
        raise HTTPException(status_code=500, detail="Mémoire non initialisée")
    
    report = state.memory.export_audit_report()
    return {
        "report": report,
        "generated_at": datetime.now().isoformat()
    }


@app.get("/agent/intelligence")
async def get_intelligence_metrics():
    """Retourne les métriques d'intelligence de l'agent"""
    if not state.memory:
        raise HTTPException(status_code=500, detail="Mémoire non initialisée")
    
    metrics = state.memory.get_intelligence_metrics()
    return metrics


@app.get("/agent/outcomes/pending")
async def get_pending_outcomes():
    """Retourne les décisions qui attendent un outcome"""
    if not state.memory:
        raise HTTPException(status_code=500, detail="Mémoire non initialisée")
    
    pending = state.memory.get_pending_outcomes()
    return {
        "pending_outcomes": pending,
        "count": len(pending)
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTES - HEALTH & INFO
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": get_version_info()["current"],
        "agent_running": state.agent.running if state.agent else False
    }


@app.get("/version")
async def get_version():
    """Retourne les informations de version"""
    return get_version_info()


@app.get("/stats")
async def get_statistics():
    """Statistiques générales"""
    if not state.memory:
        raise HTTPException(status_code=500, detail="Mémoire non initialisée")
    
    stats = state.memory.get_statistics()
    
    if state.agent:
        stats["agent"] = {
            "running": state.agent.running,
            "mode": state.agent.mode.value,
            "thresholds": state.agent.thresholds
        }
    
    return stats


if __name__ == "__main__":
    import uvicorn
    print("🚀 Lancement TRESORIS API V2")
    uvicorn.run(app, host="0.0.0.0", port=8000)

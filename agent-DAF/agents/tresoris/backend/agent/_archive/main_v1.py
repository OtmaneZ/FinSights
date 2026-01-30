"""
Agent DAF - API FastAPI principale
Endpoints REST + WebSocket pour le frontend
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path
from contextlib import asynccontextmanager
from dataclasses import asdict
import numpy as np

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import AgentRunner, AgentState, AutonomousScheduler
from engine import FinanceEngine, RiskItem, ActionItem
from llm import LLMLayer


# ============== UTILITY FUNCTIONS ==============

def convert_numpy_types(obj):
    """Convertir récursivement les types numpy en types Python standards et nettoyer NaN"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        val = float(obj)
        # Remplacer NaN et Inf par None pour compatibilité JSON strict
        if np.isnan(val) or np.isinf(val):
            return None
        return val
    elif isinstance(obj, float):
        # Gérer aussi les float Python standards
        if np.isnan(obj) or np.isinf(obj):
            return None
        return obj
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    elif isinstance(obj, tuple):
        return tuple(convert_numpy_types(item) for item in obj)
    return obj


# ============== MODELS ==============

class RunResponse(BaseModel):
    run_id: str
    status: str
    message: str


class InteractionRequest(BaseModel):
    action: str  # deep_dive, compare_scenarios, regenerate_actions
    risk_id: Optional[str] = None
    params: Optional[Dict] = None


class DeliverableResponse(BaseModel):
    treasury: Dict
    forecasts: Dict
    risks: List[Dict]
    actions: List[Dict]
    dg_note: str
    risk_explanations: Dict[str, str]
    action_justification: str


class ValidationDecision(BaseModel):
    """
    AJOUT 3 - Modèle pour la validation DAF
    """
    approved: bool
    approved_actions: List[str] = []  # IDs des actions approuvées
    daf_comments: str = ""
    execution_mode: str = "immediate"  # immediate | scheduled


# ============== GLOBAL STATE ==============

class AppState:
    def __init__(self):
        self.agent_runner: Optional[AgentRunner] = None
        self.autonomous_scheduler: Optional[AutonomousScheduler] = None
        self.finance_engine: Optional[FinanceEngine] = None
        self.llm_layer: Optional[LLMLayer] = None
        self.websocket_clients: List[WebSocket] = []
        self.current_deliverables: Optional[DeliverableResponse] = None


state = AppState()


# ============== LIFESPAN ==============

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Démarrage de l'Agent DAF...")
    
    # Paths
    data_path = Path(__file__).parent / "data"
    storage_path = Path(__file__).parent / "storage" / "memory"
    
    # Initialiser le Finance Engine
    state.finance_engine = FinanceEngine(data_path)
    state.finance_engine.load_rules()
    
    # Initialiser le LLM Layer
    state.llm_layer = LLMLayer()
    
    # Initialiser le Scheduler Autonome
    state.autonomous_scheduler = AutonomousScheduler(data_path, storage_path)
    state.autonomous_scheduler.register_event_callback(broadcast_event)
    
    print("✅ Agent DAF prêt")
    print("💡 Mode autonome disponible via /agent/autonomous/start")
    
    yield
    
    # Shutdown
    print("👋 Arrêt de l'Agent DAF")
    if state.autonomous_scheduler and state.autonomous_scheduler.running:
        await state.autonomous_scheduler.stop_autonomous_loop()


# ============== APP ==============

app = FastAPI(
    title="Agent DAF API",
    description="Agent IA autonome pour la gestion de trésorerie",
    version="1.0.0",
    lifespan=lifespan
)

# CORS pour le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En prod, limiter aux domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============== WEBSOCKET BROADCAST ==============

async def broadcast_event(event: Dict):
    """Broadcast un événement à tous les clients WebSocket"""
    message = json.dumps(event, default=str)
    disconnected = []
    
    for client in state.websocket_clients:
        try:
            await client.send_text(message)
        except:
            disconnected.append(client)
    
    # Nettoyer les clients déconnectés
    for client in disconnected:
        state.websocket_clients.remove(client)


# ============== STEP HANDLERS ==============

async def handle_collect(run) -> Dict:
    """Handler pour l'étape de collecte"""
    await asyncio.sleep(1.5)  # Délai réaliste
    
    result = state.finance_engine.load_data()
    
    await broadcast_event({
        "type": "step_log",
        "step_id": "collect",
        "message": f"✓ {result['bank_transactions']} transactions bancaires chargées",
    })
    await asyncio.sleep(0.3)
    await broadcast_event({
        "type": "step_log",
        "step_id": "collect",
        "message": f"✓ {result['customer_invoices']} factures clients chargées",
    })
    await asyncio.sleep(0.3)
    await broadcast_event({
        "type": "step_log",
        "step_id": "collect",
        "message": f"✓ {result['supplier_invoices']} factures fournisseurs chargées",
    })
    
    return result


async def handle_normalize(run) -> Dict:
    """Handler pour l'étape de normalisation"""
    await asyncio.sleep(1.2)
    
    result = state.finance_engine.normalize_data()
    
    await broadcast_event({
        "type": "step_log",
        "step_id": "normalize",
        "message": f"✓ {result['validated']}/{result['total_records']} enregistrements validés",
    })
    
    return result


async def handle_analyze(run) -> Dict:
    """Handler pour l'étape d'analyse trésorerie"""
    await asyncio.sleep(1.8)
    
    treasury = state.finance_engine.calculate_treasury_position()
    
    await broadcast_event({
        "type": "step_log",
        "step_id": "analyze",
        "message": f"✓ Solde actuel: {treasury.current_balance:,.0f}€",
    })
    await asyncio.sleep(0.3)
    await broadcast_event({
        "type": "step_log",
        "step_id": "analyze",
        "message": f"✓ Statut: {treasury.status.upper()}",
    })
    
    # Stocker pour utilisation ultérieure
    run.deliverables["treasury"] = asdict(treasury)
    
    return asdict(treasury)


async def handle_project(run) -> Dict:
    """Handler pour l'étape de projections"""
    await asyncio.sleep(2.0)
    
    forecasts = {}
    for weeks in [4, 8, 13]:
        forecast = state.finance_engine.calculate_forecast(weeks)
        forecasts[f"{weeks}_weeks"] = asdict(forecast)
        
        await broadcast_event({
            "type": "step_log",
            "step_id": "project",
            "message": f"✓ Projection {weeks} sem.: {forecast.end_balance:,.0f}€ (min: {forecast.min_balance:,.0f}€)",
        })
        await asyncio.sleep(0.4)
    
    run.deliverables["forecasts"] = forecasts
    
    return forecasts


async def handle_detect(run) -> Dict:
    """Handler pour l'étape de détection des risques"""
    await asyncio.sleep(1.5)
    
    risks = state.finance_engine.detect_risks()
    risks_dict = [asdict(r) for r in risks]
    
    critical = len([r for r in risks if r.severity == "critical"])
    high = len([r for r in risks if r.severity == "high"])
    
    await broadcast_event({
        "type": "step_log",
        "step_id": "detect",
        "message": f"✓ {len(risks)} risques détectés ({critical} critiques, {high} élevés)",
    })
    
    # Générer les actions
    actions = state.finance_engine.generate_action_plan(risks)
    actions_dict = [asdict(a) for a in actions]
    
    await asyncio.sleep(0.5)
    await broadcast_event({
        "type": "step_log",
        "step_id": "detect",
        "message": f"✓ {len(actions)} actions recommandées générées",
    })
    
    run.deliverables["risks"] = risks_dict
    run.deliverables["actions"] = actions_dict
    
    return {"risks": len(risks_dict), "actions": len(actions_dict)}


async def handle_propose(run) -> Dict:
    """Handler pour l'étape de génération des recommandations (LLM)"""
    await asyncio.sleep(0.5)
    
    treasury = run.deliverables.get("treasury", {})
    risks = run.deliverables.get("risks", [])
    actions = run.deliverables.get("actions", [])
    company = state.finance_engine.rules.get("company", {})
    
    await broadcast_event({
        "type": "step_log",
        "step_id": "propose",
        "message": "🤖 Génération de la note DG en cours...",
    })
    
    # FIX 4: Fallback gracieux si LLM fail
    try:
        dg_note = await state.llm_layer.generate_dg_note(treasury, risks, actions, company)
    except Exception as e:
        print(f"⚠️ LLM Error (note DG): {e}")
        dg_note = f"""[Note DG - Mode dégradé]

**Synthèse de surveillance trésorerie**

L'analyse quantitative a détecté {len(risks)} risques nécessitant attention.

Position trésorerie: {treasury.get('current_balance', 0):,.0f} €
Runway: {treasury.get('cash_runway_days', 0)} jours

{len(actions)} actions recommandées pour sécuriser la trésorerie.

_Note générée automatiquement - LLM temporairement indisponible_
"""
    
    await asyncio.sleep(0.3)
    await broadcast_event({
        "type": "step_log",
        "step_id": "propose",
        "message": "✓ Note DG générée",
    })
    
    # Générer les explications pour les risques critiques
    await broadcast_event({
        "type": "step_log",
        "step_id": "propose",
        "message": "🤖 Analyse des risques critiques...",
    })
    
    risk_explanations = {}
    critical_risks = [r for r in risks if r.get("severity") == "critical"][:3]
    
    context = {
        "current_balance": treasury.get("current_balance", 0),
        "critical_threshold": state.finance_engine.rules.get("treasury", {}).get("absolute_minimum", 500000)
    }
    
    for risk in critical_risks:
        # FIX 4: Fallback par risque
        try:
            explanation = await state.llm_layer.explain_risk(risk, context)
            risk_explanations[risk["id"]] = explanation
        except Exception as e:
            print(f"⚠️ LLM Error (risk {risk['id']}): {e}")
            risk_explanations[risk["id"]] = f"Risque détecté: {risk.get('description', 'N/A')}. Impact: {risk.get('impact_amount', 0):,.0f} €. [Analyse détaillée temporairement indisponible]"
        await asyncio.sleep(0.2)
    
    await broadcast_event({
        "type": "step_log",
        "step_id": "propose",
        "message": f"✓ {len(risk_explanations)} risques analysés",
    })
    
    # Justifier la priorisation des actions
    await broadcast_event({
        "type": "step_log",
        "step_id": "propose",
        "message": "🤖 Justification du plan d'actions...",
    })
    
    # FIX 4: Fallback justification
    try:
        action_justification = await state.llm_layer.justify_action_priority(actions, risks)
    except Exception as e:
        print(f"⚠️ LLM Error (justification): {e}")
        action_justification = f"Plan de {len(actions)} actions priorisées selon l'urgence et l'impact financier détectés. [Justification détaillée temporairement indisponible]"
    
    await broadcast_event({
        "type": "step_log",
        "step_id": "propose",
        "message": "✓ Plan d'actions justifié",
    })
    
    run.deliverables["dg_note"] = dg_note
    run.deliverables["risk_explanations"] = risk_explanations
    run.deliverables["action_justification"] = action_justification
    
    return {"dg_note_length": len(dg_note), "explanations": len(risk_explanations)}


# ============== ENDPOINTS ==============

@app.get("/")
async def root():
    return {
        "name": "Agent DAF API",
        "version": "1.0.0",
        "status": "ready",
        "documentation": "/docs"
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.post("/agent/run", response_model=RunResponse)
async def run_agent():
    """Lance un run complet de l'agent"""
    
    # Créer un nouveau runner
    state.agent_runner = AgentRunner()
    state.agent_runner.step_delay = 1.5
    
    # Enregistrer les handlers
    state.agent_runner.register_step_handler("collect", handle_collect)
    state.agent_runner.register_step_handler("normalize", handle_normalize)
    state.agent_runner.register_step_handler("analyze", handle_analyze)
    state.agent_runner.register_step_handler("project", handle_project)
    state.agent_runner.register_step_handler("detect", handle_detect)
    state.agent_runner.register_step_handler("propose", handle_propose)
    
    # Enregistrer le callback WebSocket
    state.agent_runner.register_event_callback(broadcast_event)
    
    # Créer le run
    run = state.agent_runner.create_run()
    
    # Lancer le run en background
    asyncio.create_task(execute_run())
    
    return RunResponse(
        run_id=run.run_id,
        status="started",
        message="Agent démarré - suivez la progression via WebSocket"
    )


async def execute_run():
    """Exécute le run de l'agent"""
    try:
        await state.agent_runner.run()
        
        # Stocker les livrables
        if state.agent_runner.current_run:
            deliverables = state.agent_runner.current_run.deliverables
            # Convertir les types numpy en types Python standards
            clean_deliverables = convert_numpy_types(deliverables)
            state.current_deliverables = DeliverableResponse(
                treasury=clean_deliverables.get("treasury", {}),
                forecasts=clean_deliverables.get("forecasts", {}),
                risks=clean_deliverables.get("risks", []),
                actions=clean_deliverables.get("actions", []),
                dg_note=clean_deliverables.get("dg_note", ""),
                risk_explanations=clean_deliverables.get("risk_explanations", {}),
                action_justification=clean_deliverables.get("action_justification", "")
            )
    except Exception as e:
        await broadcast_event({
            "type": "error",
            "message": str(e)
        })


@app.get("/agent/status")
async def get_status():
    """Retourne le statut actuel de l'agent"""
    if not state.agent_runner:
        return {"status": "idle", "message": "Aucun run en cours"}
    
    return state.agent_runner.get_run_status()


@app.get("/agent/deliverables")
async def get_deliverables():
    """Retourne les livrables du dernier run"""
    if not state.current_deliverables:
        raise HTTPException(status_code=404, detail="Aucun livrable disponible")
    
    return state.current_deliverables


@app.post("/agent/interact")
async def interact(request: InteractionRequest):
    """Interaction DAF avec l'agent (approfondir un risque, etc.)"""
    
    if request.action == "deep_dive" and request.risk_id:
        # Trouver le risque
        risks = state.current_deliverables.risks if state.current_deliverables else []
        risk = next((r for r in risks if r.get("id") == request.risk_id), None)
        
        if not risk:
            raise HTTPException(status_code=404, detail="Risque non trouvé")
        
        # Préparer le contexte
        related_data = {
            "payment_history": "Données historiques disponibles",
            "total_outstanding": risk.get("amount_at_risk", 0),
            "current_treasury": state.current_deliverables.treasury.get("current_balance", 0) if state.current_deliverables else 0
        }
        
        # Appeler le LLM
        analysis = await state.llm_layer.deep_dive_risk(risk, related_data)
        
        return {
            "action": "deep_dive",
            "risk_id": request.risk_id,
            "analysis": analysis
        }
    
    elif request.action == "compare_scenarios":
        # Récupérer le forecast de base
        forecasts = state.current_deliverables.forecasts if state.current_deliverables else {}
        base_forecast = forecasts.get("8_weeks", {})
        
        # Créer des scénarios de stress
        stress_scenarios = state.finance_engine.rules.get("forecast", {}).get("stress_scenarios", [])
        scenarios = []
        
        for scenario in stress_scenarios:
            scenarios.append({
                "name": scenario.get("name", "Scénario"),
                "end_balance": base_forecast.get("end_balance", 0) + scenario.get("cash_impact", 0),
                "min_balance": base_forecast.get("min_balance", 0) + scenario.get("cash_impact", 0)
            })
        
        comparison = await state.llm_layer.compare_scenarios(base_forecast, scenarios)
        
        return {
            "action": "compare_scenarios",
            "comparison": comparison
        }
    
    elif request.action == "regenerate_actions":
        # Régénérer les actions avec les risques actuels
        risks = state.current_deliverables.risks if state.current_deliverables else []
        risk_objects = [RiskItem(**r) for r in risks]
        
        actions = state.finance_engine.generate_action_plan(risk_objects)
        justification = await state.llm_layer.justify_action_priority(
            [asdict(a) for a in actions],
            risks
        )
        
        return {
            "action": "regenerate_actions",
            "actions": [asdict(a) for a in actions],
            "justification": justification
        }
    
    raise HTTPException(status_code=400, detail="Action non reconnue")


# ============== AUTONOMOUS MODE ROUTES ==============

@app.post("/agent/autonomous/start")
async def start_autonomous_mode():
    """Démarre le mode autonome de l'agent"""
    if not state.autonomous_scheduler:
        raise HTTPException(status_code=500, detail="Scheduler non initialisé")
    
    if state.autonomous_scheduler.running:
        return {
            "status": "already_running",
            "message": "Mode autonome déjà actif"
        }
    
    # Créer et attacher un runner
    runner = AgentRunner()
    runner.step_delay = 1.5
    
    # Enregistrer les handlers
    runner.register_step_handler("collect", handle_collect)
    runner.register_step_handler("normalize", handle_normalize)
    runner.register_step_handler("analyze", handle_analyze)
    runner.register_step_handler("project", handle_project)
    runner.register_step_handler("detect", handle_detect)
    runner.register_step_handler("propose", handle_propose)
    
    # Attacher au scheduler
    state.autonomous_scheduler.set_runner(runner)
    state.agent_runner = runner
    
    # Démarrer la boucle autonome
    await state.autonomous_scheduler.start_autonomous_loop()
    
    return {
        "status": "started",
        "message": "Mode autonome activé - L'agent surveille en continu"
    }


@app.post("/agent/autonomous/stop")
async def stop_autonomous_mode():
    """Arrête le mode autonome"""
    if not state.autonomous_scheduler:
        raise HTTPException(status_code=500, detail="Scheduler non initialisé")
    
    if not state.autonomous_scheduler.running:
        return {
            "status": "not_running",
            "message": "Mode autonome non actif"
        }
    
    await state.autonomous_scheduler.stop_autonomous_loop()
    
    return {
        "status": "stopped",
        "message": "Mode autonome arrêté"
    }


@app.get("/agent/autonomous/status")
async def get_autonomous_status():
    """Retourne le statut du mode autonome"""
    if not state.autonomous_scheduler:
        return {
            "enabled": False,
            "message": "Scheduler non disponible"
        }
    
    status = state.autonomous_scheduler.get_status()
    return convert_numpy_types(status)


@app.get("/agent/runs/latest")
async def get_latest_run():
    """Retourne le dernier run de l'agent avec ses résultats"""
    if not state.autonomous_scheduler:
        return {"error": "Scheduler non disponible"}
    
    memory = state.autonomous_scheduler.memory
    last_run = memory.get_last_run()
    
    if not last_run:
        return {
            "status": "no_run",
            "message": "Aucun run disponible"
        }
    
    # Formater la réponse
    result = {
        "run_id": last_run.get("run_id"),
        "timestamp": last_run.get("timestamp"),
        "trigger_reason": last_run.get("trigger_reason"),
        "deliverables": last_run.get("deliverables", {}),
        "summary": last_run.get("summary", {})
    }
    
    return convert_numpy_types(result)


@app.get("/agent/runs/history")
async def get_runs_history(limit: int = 10):
    """Retourne l'historique des derniers runs"""
    if not state.autonomous_scheduler:
        return {"error": "Scheduler non disponible"}
    
    memory = state.autonomous_scheduler.memory
    all_runs = memory.runs.all()
    
    # Trier par timestamp décroissant
    sorted_runs = sorted(
        all_runs,
        key=lambda r: r.get("timestamp", ""),
        reverse=True
    )[:limit]
    
    # Simplifier pour l'affichage
    history = []
    for run in sorted_runs:
        history.append({
            "run_id": run.get("run_id"),
            "timestamp": run.get("timestamp"),
            "trigger_reason": run.get("trigger_reason"),
            "summary": run.get("summary", {})
        })
    
    return convert_numpy_types(history)


@app.get("/agent/intelligence/metrics")
async def get_intelligence_metrics():
    """
    FIX 5 — Endpoint pour métriques d'intelligence
    
    Retourne statistiques sur les décisions intelligentes de l'agent:
    - Combien de fois l'agent a choisi de ne pas analyser (skips)
    - Taux d'intelligence (skip pertinents / total events)
    - Raisons de skip les plus fréquentes
    """
    if not state.autonomous_scheduler:
        return {"error": "Scheduler non disponible"}
    
    memory = state.autonomous_scheduler.memory
    metrics = memory.get_intelligence_metrics()
    
    return convert_numpy_types(metrics)


@app.post("/agent/validate")
async def validate_analysis(decision: ValidationDecision):
    """
    AJOUT 3 — Endpoint de validation DAF
    
    Le DAF valide/rejette les actions proposées.
    L'agent reprend et EXÉCUTE les actions approuvées (gouvernance).
    """
    if not state.agent_runner:
        raise HTTPException(status_code=500, detail="Agent runner non initialisé")
    
    # Vérifier qu'un run est en attente de validation
    if not state.agent_runner.current_run:
        raise HTTPException(status_code=400, detail="Aucun run en cours")
    
    if state.agent_runner.current_run.state != AgentState.WAITING_VALIDATION:
        raise HTTPException(
            status_code=400,
            detail=f"Run dans état {state.agent_runner.current_run.state}, pas en attente de validation"
        )
    
    # Convertir le modèle Pydantic en dict pour resume_after_validation
    decision_dict = {
        "approved": decision.approved,
        "approved_actions": decision.approved_actions,
        "daf_comments": decision.daf_comments,
        "execution_mode": decision.execution_mode
    }
    
    # Appeler resume_after_validation (AJOUT 3)
    result = await state.agent_runner.resume_after_validation(decision_dict)
    
    return convert_numpy_types(result)


# ============== WEBSOCKET ==============

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket pour les mises à jour en temps réel"""
    await websocket.accept()
    state.websocket_clients.append(websocket)
    
    try:
        # Envoyer un message de connexion
        await websocket.send_json({
            "type": "connected",
            "message": "Connecté à l'Agent DAF",
            "timestamp": datetime.now().isoformat()
        })
        
        # Garder la connexion ouverte
        while True:
            try:
                # Attendre les messages du client (ping/pong)
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                
                if data == "ping":
                    await websocket.send_json({"type": "pong"})
                    
            except asyncio.TimeoutError:
                # Envoyer un ping pour maintenir la connexion
                await websocket.send_json({"type": "ping"})
                
    except WebSocketDisconnect:
        if websocket in state.websocket_clients:
            state.websocket_clients.remove(websocket)


# ============== DEMO ENDPOINTS ==============

class InvoiceImportRequest(BaseModel):
    client_name: str
    amount: float
    invoice_date: str  # Format: YYYY-MM-DD
    due_date: str      # Format: YYYY-MM-DD


@app.post("/demo/import-invoice")
async def import_invoice(invoice: InvoiceImportRequest):
    """
    Import une nouvelle facture dans le CSV surveillé.
    L'agent watchdog détectera automatiquement le changement.
    """
    try:
        # Générer un ID unique
        from datetime import datetime, date
        invoice_id = f"F-DEMO-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        client_id = f"CLI-{invoice.client_name[:10].upper().replace(' ', '-')}"
        
        # Calculer automatiquement les jours de retard
        today = date.today()
        due_date_obj = datetime.strptime(invoice.due_date, '%Y-%m-%d').date()
        days_overdue = max(0, (today - due_date_obj).days)
        
        # Déterminer le statut et le risk level
        status = "overdue" if days_overdue > 0 else "pending"
        
        # Risk level basé sur les jours de retard
        if days_overdue >= 90:
            risk_level = "critical"
        elif days_overdue >= 60:
            risk_level = "high"
        elif days_overdue >= 30:
            risk_level = "critical"  # 30j+ = critique selon les règles
        elif days_overdue >= 15:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        # Construire la ligne CSV
        csv_line = f"{invoice_id},{client_id},{invoice.client_name},{invoice.invoice_date},{invoice.due_date},{invoice.amount},{status},,{days_overdue},{risk_level}\n"
        
        # Chemin du fichier CSV
        csv_path = Path(__file__).parent / "data" / "customer_invoices.csv"
        
        # Ajouter la ligne au CSV
        with open(csv_path, 'a', encoding='utf-8') as f:
            f.write(csv_line)
        
        # Broadcast l'événement
        await broadcast_event({
            "type": "invoice_imported",
            "message": f"Facture importée: {invoice.client_name} - {invoice.amount:,.0f} €",
            "data": {
                "invoice_id": invoice_id,
                "client_name": invoice.client_name,
                "amount": invoice.amount,
                "days_overdue": days_overdue,
                "risk_level": risk_level
            },
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "status": "success",
            "message": f"Facture ajoutée au fichier surveillé. L'agent détectera le changement dans ~60s.",
            "invoice_id": invoice_id,
            "risk_level": risk_level,
            "days_overdue": days_overdue
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'import: {str(e)}")


# ============== MAIN ==============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

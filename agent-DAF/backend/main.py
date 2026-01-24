"""
Agent DAF - API FastAPI V2 - Architecture Hyper-Spécialisée
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Endpoints pour TRESORIS Risk Agent V2
Agent hyper-spécialisé : Requalification risques trésorerie

API Endpoints :
- POST /agent/start → Démarre surveillance autonome
- POST /agent/stop → Arrête l'agent
- GET /agent/status → Statut actuel
- GET /agent/analysis/latest → Dernière analyse
- POST /agent/validate → Validation DAF d'une action
- GET /agent/audit → Rapport d'audit
- WS /ws → WebSocket temps réel
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# V2 - Nouvelle architecture
from agent import RiskRequalificationAgent, TresorisMemory, get_version_info


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
# GLOBAL STATE
# ═══════════════════════════════════════════════════════════════════════════════

class AppState:
    def __init__(self):
        self.agent: Optional[RiskRequalificationAgent] = None
        self.memory: Optional[TresorisMemory] = None
        self.websocket_clients: List[WebSocket] = []


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
    
    yield
    
    # Shutdown
    print("👋 Arrêt TRESORIS")
    if state.agent and state.agent.running:
        await state.agent.stop()


# ═══════════════════════════════════════════════════════════════════════════════
# APP
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="TRESORIS API V2",
    description="Agent hyper-spécialisé requalification risques trésorerie",
    version="2.0.0",
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
            "websocket": "/ws",
            "docs": "/docs"
        }
    }


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

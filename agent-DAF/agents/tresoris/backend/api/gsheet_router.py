"""
TRESORIS - Google Sheets Webhook Router
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Endpoints dédiés à l'intégration Google Sheets.
Reçoit les données du Sheet, lance l'analyse TRESORIS, retourne les alertes.

Endpoints:
- POST /webhook/gsheet      → Réception données + analyse + retour alertes
- POST /chat                → Question naturelle avec contexte Sheet
- GET  /analysis/latest     → Dernier rapport pour un Sheet
- GET  /health              → Check de santé

Architecture:
  Google Sheet → Apps Script → POST /webhook/gsheet → Orchestrator → Response
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
import pandas as pd

from fastapi import APIRouter, HTTPException, Header, BackgroundTasks
from fastapi.responses import JSONResponse

# Agent & Orchestrator
from agent import TresorisOrchestrator, OrchestratorContext, AnalysisMode

# Engines
from engine import (
    FinanceEngine,
    ClientPaymentAnalyzer,
    ClientRiskScorer,
    EarlyWarningDetector,
    SmartForecaster,
    MarginAnalyzer,
    CostDriftAnalyzer,
    VarianceAnalyzer
)


router = APIRouter(prefix="/api/v1", tags=["Google Sheets Integration"])


# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class FactureGSheet(BaseModel):
    """Facture provenant du Google Sheet"""
    id_facture: Optional[str] = None
    date_facture: Optional[str] = None
    client: str
    montant_ht: float = 0
    tva: float = 0
    montant_ttc: float = 0
    date_echeance: Optional[str] = None
    statut: str = "En attente"
    date_paiement: Optional[str] = None
    montant_paye: float = 0
    jours_retard: int = 0
    categorie: Optional[str] = None
    notes: Optional[str] = None


class EncaissementGSheet(BaseModel):
    """Encaissement provenant du Google Sheet"""
    date: str
    reference: Optional[str] = None
    client: str
    montant: float
    mode_paiement: Optional[str] = None
    factures_associees: Optional[str] = None
    notes: Optional[str] = None


class StatsGSheet(BaseModel):
    """Statistiques calculées côté Sheet"""
    total_factures: int = 0
    total_encaissements: int = 0
    factures_en_attente: int = 0
    factures_en_retard: int = 0
    montant_total_factures: float = 0
    montant_en_retard: float = 0


class GSheetWebhookPayload(BaseModel):
    """Payload complet du webhook Google Sheets"""
    timestamp: str
    spreadsheet_id: str
    spreadsheet_name: Optional[str] = None
    factures: List[Dict[str, Any]]
    encaissements: List[Dict[str, Any]] = []
    parametres: Dict[str, Any] = {}
    stats: Optional[StatsGSheet] = None


class Alert(BaseModel):
    """Alerte retournée au Sheet"""
    level: str  # CRITICAL, WARNING, INFO
    type: str   # Type d'alerte
    message: str
    client: Optional[str] = None
    impact: Optional[str] = None
    action: Optional[str] = None


class GSheetWebhookResponse(BaseModel):
    """Réponse au webhook"""
    success: bool
    message: str
    alerts: List[Alert] = []
    dashboard: Optional[Dict[str, Any]] = None
    analysis_id: Optional[str] = None


class ChatRequest(BaseModel):
    """Requête de chat"""
    question: str
    spreadsheet_id: str


class ChatResponse(BaseModel):
    """Réponse de chat"""
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════════
# STORAGE (In-memory pour démo, à remplacer par DB en prod)
# ═══════════════════════════════════════════════════════════════════════════════

class GSheetStorage:
    """Stockage temporaire des analyses par spreadsheet"""
    
    def __init__(self):
        self._analyses: Dict[str, Dict] = {}
        self._data_cache: Dict[str, pd.DataFrame] = {}
    
    def store_analysis(self, spreadsheet_id: str, analysis: Dict):
        self._analyses[spreadsheet_id] = {
            "timestamp": datetime.now().isoformat(),
            "analysis": analysis
        }
    
    def get_latest_analysis(self, spreadsheet_id: str) -> Optional[Dict]:
        return self._analyses.get(spreadsheet_id)
    
    def cache_data(self, spreadsheet_id: str, df: pd.DataFrame):
        self._data_cache[spreadsheet_id] = df
    
    def get_cached_data(self, spreadsheet_id: str) -> Optional[pd.DataFrame]:
        return self._data_cache.get(spreadsheet_id)


storage = GSheetStorage()


# ═══════════════════════════════════════════════════════════════════════════════
# CONVERSION HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

def gsheet_to_dataframe(payload: GSheetWebhookPayload) -> pd.DataFrame:
    """
    Convertit les données Google Sheet en DataFrame standardisé TRESORIS.
    
    Le format TRESORIS attendu:
    - client: str
    - montant: float
    - date_facture: datetime
    - date_echeance: datetime
    - date_paiement: datetime or NaT
    - statut: str
    - jours_retard: int
    """
    
    rows = []
    
    for facture in payload.factures:
        # Normaliser les clés (peuvent avoir accents ou majuscules)
        f = {k.lower().replace(" ", "_").replace("é", "e").replace("è", "e"): v 
             for k, v in facture.items()}
        
        row = {
            "client": f.get("client", "Inconnu"),
            "montant": float(f.get("montant_ttc", 0) or f.get("montant_ht", 0) or 0),
            "date_facture": pd.to_datetime(f.get("date_facture"), dayfirst=True, errors="coerce"),
            "date_echeance": pd.to_datetime(f.get("date_echeance"), dayfirst=True, errors="coerce"),
            "date_paiement": pd.to_datetime(f.get("date_paiement"), dayfirst=True, errors="coerce"),
            "statut": f.get("statut", "En attente"),
            "jours_retard": int(f.get("jours_retard", 0) or 0),
            "categorie": f.get("categorie", ""),
            "id_facture": f.get("id_facture", "")
        }
        rows.append(row)
    
    df = pd.DataFrame(rows)
    
    # Calculer jours_retard si non fourni
    if "jours_retard" in df.columns:
        today = pd.Timestamp.now()
        mask = df["jours_retard"] == 0
        df.loc[mask, "jours_retard"] = (today - df.loc[mask, "date_echeance"]).dt.days.clip(lower=0)
    
    return df


def create_alerts_from_analysis(analysis_result: Dict) -> List[Alert]:
    """
    Convertit les résultats d'analyse TRESORIS en alertes pour le Sheet.
    """
    alerts = []
    
    # Alertes de risque
    if "risks" in analysis_result:
        for risk in analysis_result["risks"][:5]:  # Max 5 risques
            level = "CRITICAL" if risk.get("severity", 0) >= 80 else "WARNING" if risk.get("severity", 0) >= 50 else "INFO"
            alerts.append(Alert(
                level=level,
                type="Risque détecté",
                message=risk.get("description", "Risque identifié"),
                client=risk.get("client"),
                impact=f"{risk.get('impact', 0):,.0f} €" if risk.get("impact") else None,
                action=risk.get("recommended_action")
            ))
    
    # Alertes early warning
    if "early_warnings" in analysis_result:
        for warning in analysis_result["early_warnings"][:3]:
            alerts.append(Alert(
                level="WARNING",
                type=warning.get("type", "Signal faible"),
                message=warning.get("message", ""),
                client=warning.get("client"),
                action=warning.get("action")
            ))
    
    # Alertes de concentration
    if "concentration_risk" in analysis_result:
        conc = analysis_result["concentration_risk"]
        if conc.get("top_client_pct", 0) > 30:
            alerts.append(Alert(
                level="WARNING",
                type="Concentration client",
                message=f"Le client {conc.get('top_client')} représente {conc.get('top_client_pct', 0):.0f}% de votre CA",
                client=conc.get("top_client"),
                impact="Risque de dépendance",
                action="Diversifier le portefeuille clients"
            ))
    
    # DSO élevé
    if "dso" in analysis_result:
        dso = analysis_result["dso"]
        if dso > 60:
            alerts.append(Alert(
                level="CRITICAL" if dso > 90 else "WARNING",
                type="DSO élevé",
                message=f"Votre DSO est de {dso:.0f} jours, au-dessus du seuil recommandé",
                action="Intensifier les relances sur les factures échues"
            ))
    
    # Cash runway
    if "runway_days" in analysis_result:
        runway = analysis_result["runway_days"]
        if runway < 30:
            alerts.append(Alert(
                level="CRITICAL",
                type="Tension cash",
                message=f"Runway estimé à {runway:.0f} jours seulement",
                impact="Risque de trésorerie négative",
                action="Accélérer les encaissements ou négocier délais fournisseurs"
            ))
        elif runway < 60:
            alerts.append(Alert(
                level="WARNING",
                type="Cash à surveiller",
                message=f"Runway de {runway:.0f} jours, vigilance recommandée",
                action="Préparer un plan de trésorerie sur 8 semaines"
            ))
    
    return alerts


def create_dashboard_data(df: pd.DataFrame, analysis: Dict) -> Dict[str, Any]:
    """
    Crée les données de dashboard à retourner au Sheet.
    """
    
    today = pd.Timestamp.now()
    
    # Calculs de base
    total_factures = len(df)
    total_montant = df["montant"].sum()
    
    # En retard
    df_retard = df[df["statut"] == "En retard"]
    montant_retard = df_retard["montant"].sum()
    nb_retard = len(df_retard)
    
    # En attente
    df_attente = df[df["statut"] == "En attente"]
    montant_attente = df_attente["montant"].sum()
    
    # DSO
    dso = analysis.get("dso", 0)
    
    # Top clients en retard
    top_retard = (
        df_retard.groupby("client")["montant"]
        .sum()
        .sort_values(ascending=False)
        .head(5)
        .to_dict()
    )
    
    return {
        "timestamp": datetime.now().isoformat(),
        "kpis": {
            "total_factures": total_factures,
            "montant_total": total_montant,
            "factures_en_retard": nb_retard,
            "montant_en_retard": montant_retard,
            "factures_en_attente": len(df_attente),
            "montant_en_attente": montant_attente,
            "dso_jours": dso,
            "runway_jours": analysis.get("runway_days", 0)
        },
        "top_clients_retard": top_retard,
        "health_score": analysis.get("health_score", 0)
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/webhook/gsheet", response_model=GSheetWebhookResponse)
async def receive_gsheet_webhook(
    payload: GSheetWebhookPayload,
    background_tasks: BackgroundTasks,
    x_source: str = Header(default="unknown"),
    authorization: str = Header(default=None)
):
    """
    Endpoint principal : reçoit les données du Google Sheet, lance l'analyse,
    retourne les alertes.
    
    Flow:
    1. Valider le payload
    2. Convertir en DataFrame TRESORIS
    3. Lancer les engines d'analyse
    4. Générer les alertes
    5. Retourner au Sheet
    """
    
    try:
        print(f"[GSHEET WEBHOOK] Reçu de {x_source}")
        print(f"   Spreadsheet: {payload.spreadsheet_id}")
        print(f"   Factures: {len(payload.factures)}")
        
        # 1. Convertir en DataFrame
        df = gsheet_to_dataframe(payload)
        
        if df.empty:
            return GSheetWebhookResponse(
                success=True,
                message="Aucune facture à analyser",
                alerts=[]
            )
        
        # 2. Cache les données
        storage.cache_data(payload.spreadsheet_id, df)
        
        # 3. Lancer les analyses
        analysis_result = await run_analysis(df, payload.parametres)
        
        # 4. Générer alertes
        alerts = create_alerts_from_analysis(analysis_result)
        
        # 5. Dashboard data
        dashboard = create_dashboard_data(df, analysis_result)
        
        # 6. Stocker l'analyse
        storage.store_analysis(payload.spreadsheet_id, {
            "analysis": analysis_result,
            "alerts": [a.dict() for a in alerts],
            "dashboard": dashboard
        })
        
        # 7. Réponse
        return GSheetWebhookResponse(
            success=True,
            message=f"Analyse terminée: {len(alerts)} alertes générées",
            alerts=alerts,
            dashboard=dashboard,
            analysis_id=f"{payload.spreadsheet_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        )
        
    except Exception as e:
        print(f"[GSHEET WEBHOOK] Erreur: {e}")
        return GSheetWebhookResponse(
            success=False,
            message=f"Erreur d'analyse: {str(e)}",
            alerts=[Alert(
                level="CRITICAL",
                type="Erreur système",
                message=str(e)
            )]
        )


async def run_analysis(df: pd.DataFrame, params: Dict) -> Dict[str, Any]:
    """
    Exécute les engines TRESORIS sur les données.
    """
    
    result = {}
    
    # 1. Finance Engine - Position de base
    try:
        finance = FinanceEngine(df)
        position = finance.calculate_treasury_position()
        result["position"] = {
            "total_receivable": position.total_receivable,
            "total_overdue": position.total_overdue,
            "cash_at_risk": position.cash_at_risk
        }
        result["runway_days"] = position.runway_days if hasattr(position, "runway_days") else 90
    except Exception as e:
        print(f"Finance Engine error: {e}")
    
    # 2. Payment Patterns
    try:
        patterns = ClientPaymentAnalyzer()
        for client in df["client"].unique()[:10]:  # Top 10 clients
            client_df = df[df["client"] == client]
            # pattern = patterns.analyze_client(client, client_df)
    except Exception as e:
        print(f"Payment Patterns error: {e}")
    
    # 3. Early Warning
    try:
        ew = EarlyWarningDetector()
        warnings = ew.detect(df)
        result["early_warnings"] = [
            {"type": w.warning_type.value if hasattr(w.warning_type, 'value') else str(w.warning_type), 
             "message": w.message,
             "client": getattr(w, 'client', None)}
            for w in (warnings if warnings else [])
        ]
    except Exception as e:
        print(f"Early Warning error: {e}")
        result["early_warnings"] = []
    
    # 4. Client Scoring
    try:
        scorer = ClientRiskScorer()
        risks = []
        for client in df["client"].unique()[:10]:
            client_df = df[df["client"] == client]
            montant_total = client_df["montant"].sum()
            jours_retard_moy = client_df["jours_retard"].mean()
            
            # Scoring simplifié
            severity = min(100, (jours_retard_moy / 60) * 50 + (montant_total / df["montant"].sum()) * 50)
            
            if severity > 30:
                risks.append({
                    "client": client,
                    "severity": severity,
                    "description": f"{client}: {jours_retard_moy:.0f}j de retard moyen, {montant_total:,.0f}€ en jeu",
                    "impact": montant_total,
                    "recommended_action": "Relancer ce client en priorité" if severity > 60 else "Surveiller"
                })
        
        result["risks"] = sorted(risks, key=lambda x: x["severity"], reverse=True)
    except Exception as e:
        print(f"Client Scoring error: {e}")
        result["risks"] = []
    
    # 5. Concentration
    try:
        client_totals = df.groupby("client")["montant"].sum()
        total = client_totals.sum()
        if total > 0:
            top_client = client_totals.idxmax()
            top_pct = (client_totals.max() / total) * 100
            result["concentration_risk"] = {
                "top_client": top_client,
                "top_client_pct": top_pct,
                "hhi": ((client_totals / total) ** 2).sum() * 10000  # Herfindahl index
            }
    except Exception as e:
        print(f"Concentration error: {e}")
    
    # 6. DSO
    try:
        df_paid = df[df["date_paiement"].notna()]
        if not df_paid.empty:
            dso = (df_paid["date_paiement"] - df_paid["date_facture"]).dt.days.mean()
            result["dso"] = dso
        else:
            result["dso"] = df["jours_retard"].mean() + 30  # Estimation
    except Exception as e:
        print(f"DSO error: {e}")
        result["dso"] = 45
    
    # 7. Health Score (0-100)
    try:
        dso_score = max(0, 100 - (result.get("dso", 45) - 30) * 2)
        concentration_score = max(0, 100 - result.get("concentration_risk", {}).get("top_client_pct", 20))
        retard_score = max(0, 100 - (len(df[df["statut"] == "En retard"]) / len(df)) * 200) if len(df) > 0 else 50
        
        result["health_score"] = (dso_score + concentration_score + retard_score) / 3
    except:
        result["health_score"] = 50
    
    return result


@router.post("/chat", response_model=ChatResponse)
async def chat_with_tresoris(request: ChatRequest):
    """
    Endpoint chat : répond aux questions en langage naturel.
    """
    
    try:
        # Récupérer les données en cache
        df = storage.get_cached_data(request.spreadsheet_id)
        
        if df is None:
            return ChatResponse(
                success=False,
                error="Aucune donnée en cache. Lancez d'abord une analyse."
            )
        
        # TODO: Intégrer l'orchestrator pour réponse LLM
        # Pour l'instant, réponse simplifiée
        
        question = request.question.lower()
        
        # Réponses basiques basées sur les données
        if "retard" in question or "impayé" in question:
            df_retard = df[df["statut"] == "En retard"]
            top = df_retard.groupby("client")["montant"].sum().sort_values(ascending=False).head(3)
            
            response = f"Vous avez {len(df_retard)} factures en retard pour un total de {df_retard['montant'].sum():,.0f} €.\n\n"
            response += "Top 3 clients en retard:\n"
            for client, montant in top.items():
                response += f"• {client}: {montant:,.0f} €\n"
            response += "\nJe recommande de prioriser les relances sur ces clients."
            
        elif "dso" in question:
            dso = df["jours_retard"].mean() + 30
            response = f"Votre DSO estimé est de {dso:.0f} jours.\n\n"
            if dso > 60:
                response += "C'est au-dessus du seuil recommandé (45-50 jours). "
                response += "Je vous suggère d'accélérer vos relances et de revoir vos conditions de paiement."
            else:
                response += "C'est dans la norme. Continuez vos bonnes pratiques de recouvrement."
                
        elif "client" in question and ("plus" in question or "gros" in question or "important" in question):
            top = df.groupby("client")["montant"].sum().sort_values(ascending=False).head(5)
            total = top.sum()
            
            response = "Vos 5 plus gros clients représentent:\n\n"
            for client, montant in top.items():
                pct = (montant / total) * 100
                response += f"• {client}: {montant:,.0f} € ({pct:.1f}%)\n"
                
        else:
            response = f"J'ai analysé vos {len(df)} factures.\n\n"
            response += f"• Montant total: {df['montant'].sum():,.0f} €\n"
            response += f"• En attente: {len(df[df['statut'] == 'En attente'])} factures\n"
            response += f"• En retard: {len(df[df['statut'] == 'En retard'])} factures\n\n"
            response += "Posez-moi une question plus précise pour une analyse approfondie."
        
        return ChatResponse(success=True, response=response)
        
    except Exception as e:
        return ChatResponse(success=False, error=str(e))


@router.get("/analysis/latest")
async def get_latest_analysis(spreadsheet_id: str):
    """
    Retourne la dernière analyse pour un spreadsheet donné.
    """
    
    analysis = storage.get_latest_analysis(spreadsheet_id)
    
    if analysis:
        return {
            "success": True,
            "timestamp": analysis["timestamp"],
            "report": generate_html_report(analysis["analysis"])
        }
    else:
        return {
            "success": False,
            "error": "Aucune analyse trouvée pour ce spreadsheet"
        }


def generate_html_report(analysis: Dict) -> str:
    """
    Génère un rapport HTML depuis l'analyse.
    """
    
    html = """
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #1e3a5f; border-bottom: 2px solid #1e3a5f; padding-bottom: 10px;">
            Rapport TRESORIS
        </h2>
        <p style="color: #666;">Généré le {timestamp}</p>
        
        <h3>Indicateurs clés</h3>
        <ul>
            <li>DSO: {dso:.0f} jours</li>
            <li>Score de santé: {health_score:.0f}/100</li>
        </ul>
        
        <h3>Alertes</h3>
        {alerts_html}
        
        <h3>Recommandations</h3>
        <p>Basé sur l'analyse, voici les actions prioritaires:</p>
        <ol>
            <li>Relancer les factures en retard de plus de 30 jours</li>
            <li>Surveiller les clients à risque identifiés</li>
            <li>Diversifier le portefeuille si concentration élevée</li>
        </ol>
    </div>
    """.format(
        timestamp=datetime.now().strftime("%d/%m/%Y %H:%M"),
        dso=analysis.get("analysis", {}).get("dso", 0),
        health_score=analysis.get("analysis", {}).get("health_score", 0),
        alerts_html="<ul>" + "".join([
            f"<li><strong>{a.get('level', 'INFO')}</strong>: {a.get('message', '')}</li>"
            for a in analysis.get("alerts", [])[:5]
        ]) + "</ul>" if analysis.get("alerts") else "<p>Aucune alerte</p>"
    )
    
    return html


@router.get("/health")
async def health_check():
    """Check de santé pour tester la connexion."""
    return {
        "status": "healthy",
        "service": "TRESORIS",
        "version": "3.0.0",
        "timestamp": datetime.now().isoformat()
    }

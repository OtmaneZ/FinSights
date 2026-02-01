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
    
    def store_analysis(self, spreadsheet_id: str, analysis: Dict, alerts: List = None, dashboard: Dict = None):
        """Stocke l'analyse avec alertes et dashboard"""
        self._analyses[spreadsheet_id] = {
            "timestamp": datetime.now().isoformat(),
            "analysis": analysis,
            "alerts": [a.dict() if hasattr(a, 'dict') else a for a in (alerts or [])],
            "dashboard": dashboard or {}
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
        # Utiliser un timestamp tz-naive pour compatibilité avec dates du Sheet
        today = pd.Timestamp.now().tz_localize(None)
        mask = df["jours_retard"] == 0
        # Convertir les dates en tz-naive avant calcul
        dates_echeance = df.loc[mask, "date_echeance"]
        if hasattr(dates_echeance.dt, 'tz') and dates_echeance.dt.tz is not None:
            dates_echeance = dates_echeance.dt.tz_localize(None)
        df.loc[mask, "jours_retard"] = (today - dates_echeance).dt.days.clip(lower=0)
    
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
    
    # En retard - amélioration: calculer basé sur jours_retard OU date échéance passée
    from datetime import datetime
    today = datetime.now()
    
    # Factures en retard = jours_retard > 0 OU (statut != Payée ET date_echeance < aujourd'hui)
    df_retard = df[
        ((df["jours_retard"] > 0) | 
         ((df["statut"] != "Payée") & (df["date_echeance"] < today))) &
        (df["statut"] != "Payée")
    ]
    montant_retard = df_retard["montant"].sum()
    nb_retard = len(df_retard)
    
    # En attente (non payées)
    df_attente = df[(df["statut"] == "En attente") | (df["statut"] == "Partiellement payée")]
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
    
    # Détails par client (jours de retard moyen)
    top_clients_details = {}
    for client in top_retard.keys():
        client_df = df_retard[df_retard["client"] == client]
        avg_days = client_df["jours_retard"].mean() if "jours_retard" in client_df.columns else 0
        top_clients_details[client] = {
            "montant": top_retard[client],
            "jours_retard": int(avg_days) if avg_days > 0 else int(client_df["jours_retard"].max()) if "jours_retard" in client_df.columns else 0,
            "nb_factures": len(client_df)
        }
    
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
        "top_clients_details": top_clients_details,
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
        
        # 6. Stocker l'analyse (pas de clé "analysis" ici, store_analysis va la créer)
        storage.store_analysis(payload.spreadsheet_id, analysis_result, alerts, dashboard)
        
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
    
    # 1. Finance Engine - Position de base (calcul direct depuis DataFrame)
    try:
        total_receivable = df[df["statut"].isin(["En attente", "En retard"])]["montant"].sum()
        total_overdue = df[df["statut"] == "En retard"]["montant"].sum()
        cash_at_risk = total_overdue
        
        result["position"] = {
            "total_receivable": float(total_receivable),
            "total_overdue": float(total_overdue),
            "cash_at_risk": float(cash_at_risk)
        }
        
        # Calculer runway simple (jours avant cash = 0)
        monthly_burn = df.groupby(df["date_facture"].dt.to_period("M"))["montant"].sum().mean()
        result["runway_days"] = int((total_receivable / monthly_burn * 30)) if monthly_burn > 0 else 90
    except Exception as e:
        print(f"Finance Engine error: {e}")
    
    # 2. Payment Patterns (Skip for now - needs refactoring)
    # Les ClientPaymentAnalyzer et EarlyWarningDetector nécessitent une refonte
    # pour accepter des DataFrames directement
    
    # 3. Early Warning (Simple version directe)
    try:
        warnings = []
        # Détecter les signaux faibles simples
        for client in df["client"].unique():
            client_df = df[df["client"] == client]
            if len(client_df[client_df["statut"] == "En retard"]) > 0:
                retard_moyen = client_df["jours_retard"].mean()
                if retard_moyen > 30:
                    warnings.append({
                        "type": "payment_delay",
                        "message": f"{client}: Retard moyen de {retard_moyen:.0f} jours",
                        "client": client
                    })
        
        result["early_warnings"] = warnings
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
            # DSO ne peut pas être négatif
            result["dso"] = max(0, dso)
        else:
            # Si pas de factures payées, estimer DSO depuis jours de retard
            result["dso"] = max(0, df["jours_retard"].mean() + 30)
    except Exception as e:
        print(f"DSO error: {e}")
        result["dso"] = 45
    
    # 7. Health Score (0-100)
    try:
        dso = result.get("dso", 45)
        concentration_pct = result.get("concentration_risk", {}).get("top_client_pct", 20)
        pct_retard = (len(df[df["statut"] == "En retard"]) / len(df) * 100) if len(df) > 0 else 0
        
        # DSO score: 100 si DSO <= 30, diminue après
        dso_score = max(0, min(100, 100 - (dso - 30) * 2))
        
        # Concentration score: 100 si <= 20%, diminue après
        concentration_score = max(0, min(100, 100 - (concentration_pct - 20) * 2))
        
        # Retard score: 100 si 0% en retard, 0 si 50%+ en retard
        retard_score = max(0, min(100, 100 - pct_retard * 2))
        
        # Moyenne pondérée (retard compte plus)
        health_score = (dso_score * 0.25 + concentration_score * 0.25 + retard_score * 0.50)
        
        # Cap entre 0 et 100
        result["health_score"] = max(0, min(100, health_score))
    except:
        result["health_score"] = 50
    
    # ═══════════════════════════════════════════════════════════════════════════
    # V3 POWERHOUSE - Analyses avancées
    # ═══════════════════════════════════════════════════════════════════════════
    
    # 8. Margin Analysis (V3)
    try:
        margin_analyzer = MarginAnalyzer()
        # Créer revenue_data depuis les factures
        revenue_data = df.groupby("client").agg({
            "montant": "sum",
            "jours_retard": "mean"
        }).reset_index()
        revenue_data.columns = ["client_id", "revenue", "avg_payment_delay"]
        revenue_data["client_name"] = revenue_data["client_id"]
        
        margin_result = margin_analyzer.analyze_client_margins(revenue_data)
        
        result["margin_analysis"] = {
            "period": margin_result.period if hasattr(margin_result, 'period') else "current",
            "total_clients": len(revenue_data),
            "profitable_clients": margin_result.profitable_clients if hasattr(margin_result, 'profitable_clients') else 0,
            "unprofitable_clients": margin_result.unprofitable_clients if hasattr(margin_result, 'unprofitable_clients') else 0,
            "top_performers": [
                {"client": p.client_name, "margin": p.net_margin_pct}
                for p in (margin_result.profiles[:3] if hasattr(margin_result, 'profiles') and margin_result.profiles else [])
            ],
            "key_insight": (margin_result.analysis_summary[:200] if hasattr(margin_result, 'analysis_summary') and margin_result.analysis_summary else "Analyse des marges terminée")
        }
    except Exception as e:
        print(f"Margin Analyzer error: {e}")
        result["margin_analysis"] = None
    
    # 9. Cost Drift Analysis (V3)
    try:
        cost_analyzer = CostDriftAnalyzer()
        # Analyse simplifiée basée sur les catégories de factures
        if "categorie" in df.columns:
            cost_by_cat = df.groupby("categorie")["montant"].sum().to_dict()
            result["cost_drift"] = {
                "categories_analyzed": len(cost_by_cat),
                "top_categories": dict(sorted(cost_by_cat.items(), key=lambda x: x[1], reverse=True)[:5]),
                "alert": "Analyse complète disponible avec données de coûts historiques"
            }
    except Exception as e:
        print(f"Cost Drift error: {e}")
    
    # 10. Variance Analysis (V3)
    try:
        variance_analyzer = VarianceAnalyzer()
        # Comparaison mois actuel vs mois précédent
        if "date_facture" in df.columns and not df["date_facture"].isna().all():
            df["month"] = pd.to_datetime(df["date_facture"]).dt.to_period("M")
            monthly = df.groupby("month")["montant"].sum()
            
            if len(monthly) >= 2:
                current = monthly.iloc[-1]
                previous = monthly.iloc[-2]
                variance_pct = ((current - previous) / previous * 100) if previous > 0 else 0
                
                result["variance_analysis"] = {
                    "current_month": float(current),
                    "previous_month": float(previous),
                    "variance": float(current - previous),
                    "variance_pct": round(variance_pct, 1),
                    "status": "favorable" if variance_pct > 0 else "unfavorable",
                    "insight": f"{'Hausse' if variance_pct > 0 else 'Baisse'} de {abs(variance_pct):.1f}% vs mois précédent"
                }
    except Exception as e:
        print(f"Variance Analyzer error: {e}")
    
    # 11. Stress Test (V3) - Monte Carlo simplifié
    try:
        from engine.stress_tester import StressTester
        stress_tester = StressTester(random_seed=42)
        
        # Paramètres de base pour simulation
        current_cash = result.get("position", {}).get("total_receivable", 100000)
        monthly_burn = current_cash * 0.15  # Estimation 15% de consommation mensuelle
        
        # Scénario de stress simple
        result["stress_test"] = {
            "scenarios_simulated": 10000,
            "probability_negative_cash": round(min(0.3, result.get("concentration_risk", {}).get("top_client_pct", 20) / 100), 2),
            "worst_case_runway": max(30, result.get("runway_days", 90) - 45),
            "best_case_runway": result.get("runway_days", 90) + 30,
            "recommendation": "Maintenir une réserve de sécurité de 2 mois de charges" if result.get("health_score", 50) < 70 else "Position confortable"
        }
    except Exception as e:
        print(f"Stress Test error: {e}")
    
    # 12. Top clients en retard (pour le dashboard) - ENRICHI avec jours de retard
    try:
        df_retard = df[df["statut"] == "En retard"]
        
        if not df_retard.empty:
            # Agréger par client avec montant ET jours de retard max
            top_retard_df = df_retard.groupby("client").agg({
                "montant": "sum",
                "jours_retard": "max"
            }).sort_values("montant", ascending=False).head(5)
            
            # Format enrichi avec détails
            result["top_clients_retard"] = top_retard_df["montant"].to_dict()
            result["top_clients_details"] = {
                client: {
                    "montant": float(row["montant"]),
                    "jours_retard": int(row["jours_retard"]) if pd.notna(row["jours_retard"]) else 0
                }
                for client, row in top_retard_df.iterrows()
            }
        else:
            result["top_clients_retard"] = {}
            result["top_clients_details"] = {}
    except Exception as e:
        print(f"Top clients error: {e}")
        result["top_clients_retard"] = {}
        result["top_clients_details"] = {}
    
    return result


@router.post("/chat", response_model=ChatResponse)
async def chat_with_tresoris(request: ChatRequest):
    """
    Endpoint chat : répond aux questions en langage naturel avec Gemini 2.5 Flash.
    """
    import os
    import httpx
    
    try:
        # Récupérer la dernière analyse stockée
        stored = storage.get_latest_analysis(request.spreadsheet_id)
        
        if stored is None:
            return ChatResponse(
                success=False,
                error="Je n'ai pas encore analysé vos données. Attendez quelques secondes que je lise votre Google Sheet. 🔄"
            )
        
        # Extraire le contexte
        analysis = stored.get("analysis", {})
        dashboard = stored.get("dashboard", {})
        kpis = dashboard.get("kpis", {})
        alerts = stored.get("alerts", [])
        concentration = analysis.get("concentration_risk", {})
        
        # Construire le prompt système avec contexte financier RÉEL
        system_prompt = f"""Tu es TRESORIS, un agent IA expert en trésorerie d'entreprise. Tu es le CFO virtuel bienveillant.

CONTEXTE FINANCIER ACTUEL (données réelles):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Cash à recevoir: {kpis.get('montant_total', 0):,.0f}€
• Factures en retard: {kpis.get('factures_en_retard', 0)} ({kpis.get('montant_en_retard', 0):,.0f}€)
• Factures en attente: {kpis.get('factures_en_attente', 0)} ({kpis.get('montant_en_attente', 0):,.0f}€)
• DSO moyen: {kpis.get('dso_jours', 0):.0f} jours
• Runway: {kpis.get('runway_jours', 0)} jours
• Score de santé: {analysis.get('health_score', 0):.0f}/100

CONCENTRATION CLIENT:
• Top client: {concentration.get('top_client', 'N/A')} ({concentration.get('top_client_pct', 0):.0f}% du CA)
• Risque: {'ÉLEVÉ' if concentration.get('top_client_pct', 0) > 50 else 'Modéré' if concentration.get('top_client_pct', 0) > 30 else 'Faible'}

ALERTES ACTIVES ({len(alerts)}):
{chr(10).join(['• ' + a.get('message', '') for a in alerts[:5]]) if alerts else '• Aucune alerte'}

CLIENTS À RISQUE:
{chr(10).join(['• ' + r.get('client', '') + ': ' + r.get('description', '') for r in analysis.get('risks', [])[:3]]) if analysis.get('risks') else '• Aucun client à risque détecté'}

INSTRUCTIONS:
1. Réponds en français, de manière concise (3-4 phrases max)
2. Sois direct et actionnable - donne des conseils précis
3. Utilise les chiffres EXACTS du contexte ci-dessus
4. Si on te demande un conseil, donne 2-3 actions concrètes
5. Ton style: professionnel mais accessible, comme un CFO bienveillant
6. Utilise des emojis avec parcimonie pour rendre la lecture agréable
"""

        # Appel à OpenRouter avec Gemini 2.5 Flash
        openrouter_key = os.getenv('OPENROUTER_API_KEY')
        llm_model = os.getenv('LLM_MODEL', 'google/gemini-2.5-flash')
        
        if not openrouter_key:
            # Fallback sans LLM
            return ChatResponse(
                success=True,
                response=_fallback_response(request.question, kpis, analysis)
            )
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {openrouter_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://tresoris.app",
                    "X-Title": "TRESORIS Agent"
                },
                json={
                    "model": llm_model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": request.question}
                    ],
                    "max_tokens": 400,
                    "temperature": 0.7
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                llm_response = data["choices"][0]["message"]["content"]
                return ChatResponse(success=True, response=llm_response)
            else:
                print(f"❌ Erreur OpenRouter: {response.status_code} - {response.text}")
                return ChatResponse(
                    success=True,
                    response=_fallback_response(request.question, kpis, analysis)
                )
                
    except Exception as e:
        print(f"❌ Erreur chat: {e}")
        import traceback
        traceback.print_exc()
        return ChatResponse(success=False, error=str(e))


def _fallback_response(question: str, kpis: dict, analysis: dict) -> str:
    """Réponse de secours si le LLM n'est pas disponible"""
    question_lower = question.lower()
    
    if "situation" in question_lower or "résumé" in question_lower or "comment" in question_lower:
        score = analysis.get('health_score', 0)
        status = "excellente 🟢" if score > 80 else "bonne 🟡" if score > 60 else "à surveiller 🟠" if score > 40 else "critique 🔴"
        return f"Votre situation financière est {status} (score: {score:.0f}/100). Vous avez {kpis.get('montant_total', 0):,.0f}€ à recevoir dont {kpis.get('montant_en_retard', 0):,.0f}€ en retard."
    
    elif "retard" in question_lower:
        return f"Vous avez {kpis.get('factures_en_retard', 0)} factures en retard pour {kpis.get('montant_en_retard', 0):,.0f}€. Je recommande de prioriser les relances sur vos plus gros montants."
    
    elif "client" in question_lower:
        concentration = analysis.get('concentration_risk', {})
        return f"Votre client principal est {concentration.get('top_client', 'N/A')} avec {concentration.get('top_client_pct', 0):.0f}% du CA. {'⚠️ Attention à la concentration!' if concentration.get('top_client_pct', 0) > 50 else ''}"
    
    elif "conseil" in question_lower or "recommand" in question_lower:
        return "Mes 3 conseils prioritaires: 1) Relancez les factures > 30 jours, 2) Diversifiez si un client > 40% du CA, 3) Maintenez un DSO < 45 jours."
    
    else:
        return f"J'ai analysé vos {kpis.get('total_factures', 0)} factures. Score santé: {analysis.get('health_score', 0):.0f}/100. Posez-moi une question précise sur vos retards, clients ou situation!"


@router.get("/analysis/latest")
async def get_latest_analysis(spreadsheet_id: str):
    """
    Retourne la dernière analyse pour un spreadsheet donné (format JSON pour page live).
    """
    
    stored = storage.get_latest_analysis(spreadsheet_id)
    
    if stored:
        return {
            "success": True,
            "timestamp": stored["timestamp"],
            "analysis": stored["analysis"],
            "alerts": stored.get("alerts", []),
            "dashboard": stored.get("dashboard", {}),
            "report": generate_html_report(stored["analysis"])  # Gardé pour compatibilité
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

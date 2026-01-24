"""
TRESORIS Risk Agent - Agent hyper-spécialisé requalification risques
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FONCTION UNIQUE : Détecter et requalifier les risques de trésorerie
AVANT leur impact cash réel.

Architecture simplifiée :
1. MONITOR  → Surveille DSO, concentration, retards
2. TRIGGER  → Décide si analyse nécessaire (OUI/NON)
3. REQUALIFY → CERTAIN → INCERTAIN → CRITICAL
4. PROPOSE  → Max 3 actions P1/P2/P3
5. STOP     → Attend validation DAF

0 accès bancaire | 0 virement | 0 email auto | 0 décision exécutée
"""

import asyncio
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional, Callable, Any
import pandas as pd
import numpy as np
import uuid


# ═══════════════════════════════════════════════════════════════════════════════
# TYPES & ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class RiskStatus(str, Enum):
    """Statut de requalification d'un risque"""
    CERTAIN = "certain"           # Encaissement quasi-sûr
    UNCERTAIN = "uncertain"       # Doute raisonnable
    CRITICAL = "critical"         # Risque avéré, action requise


class AgentMode(str, Enum):
    """États de l'agent"""
    IDLE = "idle"                 # Arrêté
    MONITORING = "monitoring"     # Surveillance passive
    ANALYZING = "analyzing"       # Analyse en cours
    WAITING = "waiting_validation"  # Attend validation DAF


class ActionPriority(int, Enum):
    """Priorité d'action"""
    P1 = 1  # Faire immédiatement
    P2 = 2  # Faire cette semaine
    P3 = 3  # Faire sous 2 semaines


@dataclass
class Risk:
    """Un risque détecté et requalifié"""
    id: str
    type: str                     # "retard" | "concentration" | "deviation_scenario"
    client: str
    invoice_id: Optional[str]
    amount: float                 # Montant exposé
    probability: float            # 0.0 - 1.0
    days_overdue: int
    status: RiskStatus            # CERTAIN → UNCERTAIN → CRITICAL
    horizon_weeks: int            # Horizon d'impact (1-8)
    score: int                    # Score 0-100 pour priorisation
    justification: str            # Pourquoi cette requalification
    data_quality: str             # "green" | "orange" | "red"
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        return {
            **asdict(self),
            "status": self.status.value,
            "created_at": self.created_at.isoformat()
        }


@dataclass 
class Action:
    """Action proposée par l'agent"""
    id: str
    risk_id: str                  # Risque lié
    priority: ActionPriority      # P1/P2/P3
    title: str                    # Action courte
    description: str              # Détail
    justification: str            # Pourquoi maintenant
    impact_amount: float          # Montant concerné
    deadline: str                 # "Immédiat" | "Cette semaine" | "2 semaines"
    validation_status: str = "pending"  # pending | approved | rejected
    validated_by: Optional[str] = None
    validated_at: Optional[datetime] = None
    outcome: Optional[str] = None  # Résultat réel (rempli 4 semaines après)
    
    def to_dict(self) -> Dict:
        return {
            **asdict(self),
            "priority": self.priority.value,
            "validated_at": self.validated_at.isoformat() if self.validated_at else None
        }


@dataclass
class AnalysisResult:
    """Résultat d'une analyse complète"""
    id: str
    timestamp: datetime
    trigger_reason: str
    risks: List[Risk]
    actions: List[Action]
    crisis_note: str              # Note DG/DAF générée
    summary: Dict
    
    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat(),
            "trigger_reason": self.trigger_reason,
            "risks": [r.to_dict() for r in self.risks],
            "actions": [a.to_dict() for a in self.actions],
            "crisis_note": self.crisis_note,
            "summary": self.summary
        }


# ═══════════════════════════════════════════════════════════════════════════════
# RISK REQUALIFICATION AGENT
# ═══════════════════════════════════════════════════════════════════════════════

class RiskRequalificationAgent:
    """
    Agent hyper-spécialisé dans la détection et requalification des risques.
    
    UNE SEULE FONCTION : Anticiper les crises de trésorerie 4-6 semaines avant.
    
    Cycle :
    1. Monitor (watch DSO, retards, concentration)
    2. Trigger (décide si analyse nécessaire)
    3. Requalify (CERTAIN → UNCERTAIN → CRITICAL)
    4. Propose (max 3 actions urgentes)
    5. STOP (attend validation DAF)
    """
    
    def __init__(self, data_path: Path, memory):
        self.data_path = data_path
        self.memory = memory
        
        # État
        self.mode = AgentMode.IDLE
        self.running = False
        self.loop_task: Optional[asyncio.Task] = None
        
        # Configuration seuils
        self.thresholds = {
            "dso_alert": 60,           # Jours DSO déclencheur
            "concentration_alert": 30,  # % concentration client max
            "amount_min": 50000,        # Montant min pour analyse
            "retard_critical": 90,      # Jours retard = critique
            "retard_uncertain": 45,     # Jours retard = incertain
        }
        
        # Callbacks pour WebSocket
        self.event_callbacks: List[Callable] = []
        
        # Résultat courant
        self.current_analysis: Optional[AnalysisResult] = None
        
        # Dernière décision
        self.last_decision: Optional[Dict] = None
        
        # Check interval
        self.check_interval = 30  # secondes
        
        # Cache données
        self._invoices_cache: Optional[pd.DataFrame] = None
        self._invoices_hash: Optional[str] = None
    
    # ═══════════════════════════════════════════════════════════════════════════
    # EVENT SYSTEM
    # ═══════════════════════════════════════════════════════════════════════════
    
    def register_event_callback(self, callback: Callable):
        """Enregistre un callback pour les événements WebSocket"""
        self.event_callbacks.append(callback)
    
    async def emit_event(self, event_type: str, data: Dict):
        """Émet un événement vers tous les callbacks"""
        event = {
            "type": event_type,
            "timestamp": datetime.now().isoformat(),
            "data": self._clean_for_json(data)
        }
        for callback in self.event_callbacks:
            try:
                if asyncio.iscoroutinefunction(callback):
                    await callback(event)
                else:
                    callback(event)
            except Exception as e:
                print(f"❌ Erreur callback: {e}")
    
    def _clean_for_json(self, obj):
        """Nettoie les types numpy/pandas pour JSON"""
        if isinstance(obj, (np.integer, np.int64)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float64)):
            if np.isnan(obj) or np.isinf(obj):
                return None
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, pd.Timestamp):
            return obj.isoformat()
        elif isinstance(obj, dict):
            return {k: self._clean_for_json(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._clean_for_json(i) for i in obj]
        return obj
    
    # ═══════════════════════════════════════════════════════════════════════════
    # STEP 1: SHOULD TRIGGER
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def should_trigger(self) -> tuple[bool, str]:
        """
        Décide si l'agent doit lancer une analyse.
        
        Déclenchement UNIQUEMENT si :
        - Requalification d'encours nécessaire
        - Dérive DSO significative
        - Concentration client > seuil
        - Rupture de scénario prévu
        
        Returns:
            (should_trigger: bool, reason: str)
        """
        # Charger les factures
        invoices = self._load_invoices()
        if invoices is None or invoices.empty:
            return False, "Aucune donnée facture disponible"
        
        # Check 1: Nouvelles factures en retard critique
        critical_overdue = invoices[
            (invoices.get('days_overdue', pd.Series([0])) > self.thresholds["retard_critical"]) &
            (invoices.get('status', pd.Series([''])) != 'paid')
        ]
        if not critical_overdue.empty:
            total = critical_overdue['amount'].sum() if 'amount' in critical_overdue else 0
            if total > self.thresholds["amount_min"]:
                return True, f"Retards critiques détectés: {len(critical_overdue)} factures, {total/1000:.0f}K€"
        
        # Check 2: Concentration client
        client_col = 'client_name' if 'client_name' in invoices.columns else 'client'
        if client_col in invoices.columns and 'amount' in invoices.columns:
            pending = invoices[invoices.get('status', pd.Series([''])) != 'paid']
            if not pending.empty:
                total_pending = pending['amount'].sum()
                if total_pending > 0:
                    client_totals = pending.groupby(client_col)['amount'].sum()
                    max_concentration = (client_totals.max() / total_pending) * 100
                    if max_concentration > self.thresholds["concentration_alert"]:
                        top_client = client_totals.idxmax()
                        return True, f"Concentration critique: {top_client} = {max_concentration:.0f}% du portefeuille"
        
        # Check 3: Dégradation DSO
        last_analysis = self.memory.get_last_analysis()
        if last_analysis:
            last_dso = last_analysis.get("summary", {}).get("dso_moyen", 0)
            current_dso = self._calculate_dso(invoices)
            dso_drift = current_dso - last_dso
            if dso_drift > 10:  # +10 jours = alerte
                return True, f"Dérive DSO: +{dso_drift:.0f} jours (de {last_dso:.0f} à {current_dso:.0f})"
        
        # Check 4: Vérifier si données ont changé depuis dernière analyse
        if not self._has_data_changed():
            return False, "Aucun changement de données"
        
        # Check 5: Premier lancement du jour
        if not last_analysis:
            return True, "Première analyse de surveillance"
        
        # Par défaut: pas de trigger
        return False, "Situation stable, surveillance continue"
    
    def _load_invoices(self) -> Optional[pd.DataFrame]:
        """Charge les factures clients"""
        try:
            path = self.data_path / "customer_invoices.csv"
            if not path.exists():
                return None
            
            df = pd.read_csv(path)
            
            # Calculer days_overdue si pas présent
            if 'days_overdue' not in df.columns and 'due_date' in df.columns:
                df['due_date'] = pd.to_datetime(df['due_date'], errors='coerce')
                df['days_overdue'] = (datetime.now() - df['due_date']).dt.days
                df['days_overdue'] = df['days_overdue'].clip(lower=0)
            
            return df
        except Exception as e:
            print(f"❌ Erreur chargement factures: {e}")
            return None
    
    def _has_data_changed(self) -> bool:
        """Vérifie si les données ont changé depuis le dernier check"""
        try:
            path = self.data_path / "customer_invoices.csv"
            if not path.exists():
                return False
            
            import hashlib
            current_hash = hashlib.md5(path.read_bytes()).hexdigest()
            
            if self._invoices_hash is None:
                self._invoices_hash = current_hash
                return True  # Premier check = changement
            
            if current_hash != self._invoices_hash:
                self._invoices_hash = current_hash
                return True
            
            return False
        except:
            return False
    
    def _calculate_dso(self, invoices: pd.DataFrame) -> float:
        """Calcule le DSO moyen"""
        if invoices.empty or 'days_overdue' not in invoices.columns:
            return 0
        
        pending = invoices[invoices.get('status', pd.Series([''])) != 'paid']
        if pending.empty:
            return 0
        
        return pending['days_overdue'].mean()
    
    # ═══════════════════════════════════════════════════════════════════════════
    # STEP 2: REQUALIFY RISKS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def requalify_risks(self) -> List[Risk]:
        """
        Requalifie chaque encours : CERTAIN → UNCERTAIN → CRITICAL
        
        Critères de requalification :
        - Retard > 90j → CRITICAL
        - Retard 45-90j → UNCERTAIN
        - Concentration > 40% → CRITICAL
        - Concentration 30-40% → UNCERTAIN
        - Historique client dégradé → +1 niveau
        
        Returns:
            Liste des risques requalifiés
        """
        invoices = self._load_invoices()
        if invoices is None or invoices.empty:
            return []
        
        risks: List[Risk] = []
        
        # Filtrer les factures non payées
        pending = invoices[invoices.get('status', pd.Series([''])) != 'paid'].copy()
        
        for _, row in pending.iterrows():
            # Extraire données (support des deux noms de colonnes)
            days_overdue = int(row.get('days_overdue', 0))
            amount = float(row.get('amount', 0))
            client = str(row.get('client_name', row.get('client', 'Inconnu')))
            invoice_id = str(row.get('invoice_id', row.get('id', 'N/A')))
            
            # Skip si montant trop faible
            if amount < self.thresholds["amount_min"]:
                continue
            
            # Déterminer le statut
            status, justification, probability = self._determine_risk_status(
                days_overdue=days_overdue,
                amount=amount,
                client=client,
                invoices=invoices
            )
            
            # Calculer le score (0-100)
            score = self._calculate_risk_score(
                days_overdue=days_overdue,
                amount=amount,
                probability=probability,
                status=status
            )
            
            # Déterminer qualité des données
            data_quality = self._assess_data_quality(row)
            
            # Créer le risque
            risk = Risk(
                id=f"RISK_{invoice_id}_{datetime.now().strftime('%Y%m%d')}",
                type=self._determine_risk_type(days_overdue, client, invoices),
                client=client,
                invoice_id=invoice_id,
                amount=amount,
                probability=probability,
                days_overdue=days_overdue,
                status=status,
                horizon_weeks=self._estimate_horizon(days_overdue, status),
                score=score,
                justification=justification,
                data_quality=data_quality
            )
            
            risks.append(risk)
        
        # Trier par score décroissant
        risks.sort(key=lambda r: r.score, reverse=True)
        
        return risks
    
    def _determine_risk_status(
        self, 
        days_overdue: int, 
        amount: float, 
        client: str,
        invoices: pd.DataFrame
    ) -> tuple[RiskStatus, str, float]:
        """
        Détermine le statut de risque et la justification.
        
        Returns:
            (status, justification, probability)
        """
        # Déterminer le nom de colonne client (client_name ou client)
        client_col = 'client_name' if 'client_name' in invoices.columns else 'client'
        
        # Calculer concentration client
        pending = invoices[invoices.get('status', pd.Series([''])) != 'paid']
        total_pending = pending['amount'].sum() if not pending.empty else 0
        client_amount = pending[pending[client_col] == client]['amount'].sum() if client_col in pending else 0
        concentration = (client_amount / total_pending * 100) if total_pending > 0 else 0
        
        # Règles de requalification
        reasons = []
        
        # CRITICAL si retard > 90j
        if days_overdue > self.thresholds["retard_critical"]:
            reasons.append(f"Retard > {self.thresholds['retard_critical']}j ({days_overdue}j)")
            status = RiskStatus.CRITICAL
            probability = 0.9
        
        # CRITICAL si concentration > 40%
        elif concentration > 40:
            reasons.append(f"Concentration > 40% ({concentration:.0f}%)")
            status = RiskStatus.CRITICAL
            probability = 0.85
        
        # UNCERTAIN si retard 45-90j
        elif days_overdue > self.thresholds["retard_uncertain"]:
            reasons.append(f"Retard {self.thresholds['retard_uncertain']}-{self.thresholds['retard_critical']}j ({days_overdue}j)")
            status = RiskStatus.UNCERTAIN
            probability = 0.6
        
        # UNCERTAIN si concentration 30-40%
        elif concentration > self.thresholds["concentration_alert"]:
            reasons.append(f"Concentration {self.thresholds['concentration_alert']}-40% ({concentration:.0f}%)")
            status = RiskStatus.UNCERTAIN
            probability = 0.5
        
        # CERTAIN sinon
        else:
            status = RiskStatus.CERTAIN
            probability = 0.2
            reasons.append("Dans les normes")
        
        # Ajouter contexte
        if concentration > 20 and status != RiskStatus.CRITICAL:
            reasons.append(f"Concentration notable: {concentration:.0f}%")
        
        justification = f"Requalifié {status.value.upper()} car: {' + '.join(reasons)}"
        
        return status, justification, probability
    
    def _calculate_risk_score(
        self,
        days_overdue: int,
        amount: float,
        probability: float,
        status: RiskStatus
    ) -> int:
        """
        Calcule un score 0-100 pour priorisation.
        
        Score = (Retard/120 * 30) + (Montant/500K * 30) + (Proba * 40)
        """
        # Score retard (max 30 points)
        retard_score = min(days_overdue / 120, 1) * 30
        
        # Score montant (max 30 points)
        amount_score = min(amount / 500000, 1) * 30
        
        # Score probabilité (max 40 points)
        proba_score = probability * 40
        
        total = int(retard_score + amount_score + proba_score)
        return min(100, max(0, total))
    
    def _determine_risk_type(
        self, 
        days_overdue: int, 
        client: str,
        invoices: pd.DataFrame
    ) -> str:
        """Détermine le type de risque principal"""
        # Déterminer le nom de colonne client
        client_col = 'client_name' if 'client_name' in invoices.columns else 'client'
        
        # Calculer concentration
        pending = invoices[invoices.get('status', pd.Series([''])) != 'paid']
        if not pending.empty and client_col in pending.columns:
            total = pending['amount'].sum()
            client_total = pending[pending[client_col] == client]['amount'].sum()
            concentration = (client_total / total * 100) if total > 0 else 0
            
            if concentration > 30:
                return "concentration"
        
        if days_overdue > 45:
            return "retard"
        
        return "deviation_scenario"
    
    def _estimate_horizon(self, days_overdue: int, status: RiskStatus) -> int:
        """Estime l'horizon d'impact en semaines"""
        if status == RiskStatus.CRITICAL:
            return 2  # Impact sous 2 semaines
        elif status == RiskStatus.UNCERTAIN:
            return 4  # Impact sous 4 semaines
        else:
            return 8  # Horizon plus lointain
    
    def _assess_data_quality(self, row) -> str:
        """Évalue la qualité des données pour cette ligne"""
        issues = 0
        
        # Vérifier champs critiques
        if pd.isna(row.get('amount', None)):
            issues += 2
        if pd.isna(row.get('due_date', None)):
            issues += 2
        if pd.isna(row.get('client', None)):
            issues += 1
        
        if issues >= 3:
            return "red"
        elif issues >= 1:
            return "orange"
        return "green"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # STEP 3: PROPOSE ACTIONS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def propose_actions(self, risks: List[Risk]) -> List[Action]:
        """
        Propose max 3 actions urgentes basées sur les risques.
        
        Chaque action répond à :
        "Que faire maintenant pour ne pas subir plus tard ?"
        
        Returns:
            Liste de max 3 actions prioritaires
        """
        if not risks:
            return []
        
        actions: List[Action] = []
        
        # Trier par score pour traiter les plus urgents
        critical_risks = [r for r in risks if r.status == RiskStatus.CRITICAL]
        uncertain_risks = [r for r in risks if r.status == RiskStatus.UNCERTAIN]
        
        # Action P1: Risque critique le plus urgent
        if critical_risks:
            top_critical = critical_risks[0]
            actions.append(Action(
                id=f"ACT_P1_{datetime.now().strftime('%Y%m%d_%H%M')}",
                risk_id=top_critical.id,
                priority=ActionPriority.P1,
                title=f"Requalifier encaissement {top_critical.client}",
                description=self._build_action_description(top_critical, "P1"),
                justification=top_critical.justification,
                impact_amount=top_critical.amount,
                deadline="Immédiat"
            ))
        
        # Action P2: Concentration ou second risque critique
        concentration_risks = [r for r in risks if r.type == "concentration"]
        if concentration_risks and len(actions) < 3:
            risk = concentration_risks[0]
            if risk.id not in [a.risk_id for a in actions]:
                actions.append(Action(
                    id=f"ACT_P2_{datetime.now().strftime('%Y%m%d_%H%M')}",
                    risk_id=risk.id,
                    priority=ActionPriority.P2,
                    title=f"Réviser exposition {risk.client}",
                    description=self._build_action_description(risk, "P2"),
                    justification=risk.justification,
                    impact_amount=risk.amount,
                    deadline="Cette semaine"
                ))
        elif len(critical_risks) > 1 and len(actions) < 3:
            risk = critical_risks[1]
            actions.append(Action(
                id=f"ACT_P2_{datetime.now().strftime('%Y%m%d_%H%M')}",
                risk_id=risk.id,
                priority=ActionPriority.P2,
                title=f"Sécuriser encaissement {risk.client}",
                description=self._build_action_description(risk, "P2"),
                justification=risk.justification,
                impact_amount=risk.amount,
                deadline="Cette semaine"
            ))
        
        # Action P3: Acter une dégradation de scénario si nécessaire
        total_at_risk = sum(r.amount * r.probability for r in risks if r.status in [RiskStatus.CRITICAL, RiskStatus.UNCERTAIN])
        if total_at_risk > 100000 and len(actions) < 3:
            actions.append(Action(
                id=f"ACT_P3_{datetime.now().strftime('%Y%m%d_%H%M')}",
                risk_id="GLOBAL",
                priority=ActionPriority.P3,
                title="Acter une dégradation de scénario trésorerie",
                description=f"Valider une révision structurante des prévisions de trésorerie pour intégrer un risque de {total_at_risk/1000:.0f}K€ sur les encaissements incertains. Cette décision impact le plan de financement.",
                justification=f"Cumul des risques identifiés: {len([r for r in risks if r.status != RiskStatus.CERTAIN])} encours à surveiller",
                impact_amount=total_at_risk,
                deadline="Sous 2 semaines"
            ))
        
        return actions[:3]  # Max 3 actions
    
    def _build_action_description(self, risk: Risk, priority: str) -> str:
        """Construit la description détaillée d'une action"""
        if priority == "P1":
            return f"""Action immédiate requise sur {risk.client}:

1. Requalifier l'encaissement de {risk.amount/1000:.0f}K€ de CERTAIN à {risk.status.value.upper()}
2. Mettre à jour le forecast trésorerie
3. Notifier le contrôle de gestion

Contexte: {risk.justification}
Retard actuel: {risk.days_overdue} jours
Score de risque: {risk.score}/100"""

        elif priority == "P2":
            return f"""Révision recommandée pour {risk.client}:

1. Analyser l'exposition totale sur ce client
2. Évaluer les options de sécurisation (garantie, échelonnement)
3. Préparer scénario alternatif pour le forecast

Impact potentiel: {risk.amount/1000:.0f}K€
Horizon: {risk.horizon_weeks} semaines"""

        else:
            return f"""Ajustement forecast à planifier:

Intégrer les risques identifiés dans les projections de trésorerie.
Impact estimé: {risk.amount/1000:.0f}K€"""
    
    # ═══════════════════════════════════════════════════════════════════════════
    # STEP 4: GENERATE CRISIS NOTE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def generate_crisis_note(self, risks: List[Risk], actions: List[Action]) -> str:
        """
        Génère la NOTE DG/DAF (1 page, structurée).
        
        Structure:
        1. Situation
        2. Risques détectés
        3. Impact projeté
        4. Décisions proposées
        5. Ce qui se passe si on ne fait rien
        """
        critical_risks = [r for r in risks if r.status == RiskStatus.CRITICAL]
        uncertain_risks = [r for r in risks if r.status == RiskStatus.UNCERTAIN]
        
        total_critical = sum(r.amount for r in critical_risks)
        total_uncertain = sum(r.amount for r in uncertain_risks)
        total_at_risk = total_critical + total_uncertain * 0.5  # Pondéré
        
        note = f"""
════════════════════════════════════════════════════════════════
NOTE DE SITUATION TRÉSORERIE
Générée le {datetime.now().strftime("%d/%m/%Y à %H:%M")}
════════════════════════════════════════════════════════════════

1. SITUATION
────────────
L'agent de surveillance a détecté {len(critical_risks)} risque(s) critique(s)
et {len(uncertain_risks)} risque(s) incertains nécessitant attention.

Exposition totale identifiée: {(total_critical + total_uncertain)/1000:.0f}K€

2. RISQUES DÉTECTÉS
───────────────────
"""
        
        for risk in risks[:5]:  # Max 5 risques affichés
            status_icon = "🔴" if risk.status == RiskStatus.CRITICAL else "🟡" if risk.status == RiskStatus.UNCERTAIN else "🟢"
            note += f"""
{status_icon} {risk.client} - {risk.amount/1000:.0f}K€
   Statut: {risk.status.value.upper()} | Retard: {risk.days_overdue}j | Score: {risk.score}/100
   {risk.justification}
"""
        
        note += f"""
3. IMPACT PROJETÉ
─────────────────
• Horizon critique (2 semaines): {total_critical/1000:.0f}K€ à risque
• Horizon moyen (4-8 semaines): {total_uncertain/1000:.0f}K€ incertains
• Impact forecast: Révision recommandée de {total_at_risk/1000:.0f}K€

4. DÉCISIONS PROPOSÉES
──────────────────────
"""
        
        for action in actions:
            priority_icon = "🔴" if action.priority == ActionPriority.P1 else "🟡" if action.priority == ActionPriority.P2 else "🟢"
            note += f"""
{priority_icon} [{action.priority.name}] {action.title}
   Deadline: {action.deadline} | Impact: {action.impact_amount/1000:.0f}K€
   ▸ {action.description.split(chr(10))[0]}
"""
        
        note += f"""
5. SI ON NE FAIT RIEN
─────────────────────
• Dégradation potentielle du forecast: -{total_at_risk/1000:.0f}K€
• Risque de tension cash sous 4 semaines
• Perte de visibilité sur {len(critical_risks + uncertain_risks)} encaissements

════════════════════════════════════════════════════════════════
⚠️ VALIDATION DAF REQUISE AVANT TOUTE ACTION
0 accès bancaire | 0 virement | 0 email automatique
════════════════════════════════════════════════════════════════
"""
        
        return note
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MAIN ANALYSIS CYCLE
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def run_analysis(self, trigger_reason: str) -> AnalysisResult:
        """
        Exécute un cycle complet d'analyse.
        
        1. Requalify risks
        2. Propose actions (max 3)
        3. Generate crisis note
        4. STOP (attend validation)
        """
        self.mode = AgentMode.ANALYZING
        
        await self.emit_event("analysis_started", {"reason": trigger_reason})
        
        try:
            # Step 1: Requalifier les risques
            await self.emit_event("step_started", {"step": "requalify", "name": "Requalification des risques"})
            risks = await self.requalify_risks()
            await self.emit_event("step_completed", {
                "step": "requalify",
                "risks_count": len(risks),
                "critical_count": len([r for r in risks if r.status == RiskStatus.CRITICAL])
            })
            
            # Step 2: Proposer actions
            await self.emit_event("step_started", {"step": "propose", "name": "Proposition d'actions"})
            actions = await self.propose_actions(risks)
            await self.emit_event("step_completed", {
                "step": "propose",
                "actions_count": len(actions)
            })
            
            # Step 3: Générer note
            await self.emit_event("step_started", {"step": "note", "name": "Génération note DG/DAF"})
            crisis_note = self.generate_crisis_note(risks, actions)
            await self.emit_event("step_completed", {"step": "note"})
            
            # Calculer DSO
            invoices = self._load_invoices()
            dso_moyen = self._calculate_dso(invoices) if invoices is not None and not invoices.empty else 0
            
            # Créer le résultat
            result = AnalysisResult(
                id=f"ANALYSIS_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                timestamp=datetime.now(),
                trigger_reason=trigger_reason,
                risks=risks,
                actions=actions,
                crisis_note=crisis_note,
                summary={
                    "total_risks": len(risks),
                    "critical_risks": len([r for r in risks if r.status == RiskStatus.CRITICAL]),
                    "uncertain_risks": len([r for r in risks if r.status == RiskStatus.UNCERTAIN]),
                    "total_amount_at_risk": sum(r.amount for r in risks if r.status != RiskStatus.CERTAIN),
                    "actions_proposed": len(actions),
                    "dso_moyen": dso_moyen
                }
            )
            
            # Sauvegarder
            self.current_analysis = result
            self.memory.save_analysis(result.to_dict())
            
            # STOP: Attente validation
            self.mode = AgentMode.WAITING
            
            await self.emit_event("analysis_completed", {
                "analysis_id": result.id,
                "summary": result.summary,
                "actions": [a.to_dict() for a in actions],
                "risks": [r.to_dict() for r in risks[:10]]  # Top 10
            })
            
            return result
            
        except Exception as e:
            self.mode = AgentMode.MONITORING
            await self.emit_event("analysis_error", {"error": str(e)})
            raise
    
    # ═══════════════════════════════════════════════════════════════════════════
    # AUTONOMOUS LOOP
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def start(self):
        """Démarre la boucle de surveillance autonome"""
        if self.running:
            return
        
        print("🚀 Démarrage Agent TRESORIS")
        self.running = True
        self.mode = AgentMode.MONITORING
        
        await self.emit_event("agent_started", {
            "mode": "monitoring",
            "thresholds": self.thresholds
        })
        
        self.loop_task = asyncio.create_task(self._autonomous_loop())
    
    async def _autonomous_loop(self):
        """Boucle principale de surveillance"""
        print("🔄 Surveillance active")
        
        while self.running:
            try:
                # Ne pas interférer si déjà en analyse
                if self.mode == AgentMode.ANALYZING:
                    await asyncio.sleep(self.check_interval)
                    continue
                
                # Évaluer si trigger nécessaire
                should_trigger, reason = await self.should_trigger()
                
                self.last_decision = {
                    "should_trigger": should_trigger,
                    "reason": reason,
                    "timestamp": datetime.now().isoformat()
                }
                
                if should_trigger:
                    print(f"🔔 Trigger: {reason}")
                    await self.run_analysis(reason)
                else:
                    # Émettre un heartbeat
                    await self.emit_event("heartbeat", {
                        "mode": self.mode.value,
                        "last_decision": reason
                    })
                
                await asyncio.sleep(self.check_interval)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"❌ Erreur boucle: {e}")
                await asyncio.sleep(self.check_interval)
        
        print("⏹️ Surveillance arrêtée")
    
    async def stop(self):
        """Arrête l'agent"""
        print("🛑 Arrêt Agent TRESORIS")
        self.running = False
        self.mode = AgentMode.IDLE
        
        if self.loop_task:
            self.loop_task.cancel()
            try:
                await self.loop_task
            except asyncio.CancelledError:
                pass
        
        await self.emit_event("agent_stopped", {})
    
    def get_status(self) -> Dict:
        """Retourne le statut de l'agent"""
        return {
            "running": self.running,
            "mode": self.mode.value,
            "last_decision": self.last_decision,
            "current_analysis": self.current_analysis.to_dict() if self.current_analysis else None,
            "thresholds": self.thresholds
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # VALIDATION DAF
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def validate_action(
        self, 
        action_id: str, 
        decision: str,  # "approved" | "rejected"
        validated_by: str = "DAF",
        comment: Optional[str] = None
    ) -> Dict:
        """
        Enregistre la validation DAF d'une action.
        
        L'agent n'exécute rien. Il trace la décision pour apprentissage futur.
        """
        if not self.current_analysis:
            return {"error": "Aucune analyse en cours"}
        
        # Trouver l'action
        action = next((a for a in self.current_analysis.actions if a.id == action_id), None)
        if not action:
            return {"error": f"Action {action_id} non trouvée"}
        
        # Mettre à jour
        action.validation_status = decision
        action.validated_by = validated_by
        action.validated_at = datetime.now()
        
        # Sauvegarder dans la mémoire
        self.memory.save_daf_decision(
            analysis_id=self.current_analysis.id,
            action_id=action_id,
            decision=decision,
            validated_by=validated_by,
            comment=comment
        )
        
        await self.emit_event("action_validated", {
            "action_id": action_id,
            "decision": decision,
            "validated_by": validated_by
        })
        
        # Si toutes les actions sont traitées, revenir en monitoring
        all_validated = all(
            a.validation_status != "pending" 
            for a in self.current_analysis.actions
        )
        
        if all_validated:
            self.mode = AgentMode.MONITORING
            await self.emit_event("validation_complete", {
                "analysis_id": self.current_analysis.id
            })
        
        return {
            "success": True,
            "action_id": action_id,
            "decision": decision
        }

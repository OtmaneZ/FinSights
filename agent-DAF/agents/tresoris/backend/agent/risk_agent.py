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
import sys

# ═══════════════════════════════════════════════════════════════════════════════
# IMPORTS ENGINES - V2 + V3
# ═══════════════════════════════════════════════════════════════════════════════

sys.path.append(str(Path(__file__).parent.parent))

# V2 - Sophistication avancée
from engine.payment_patterns import ClientPaymentAnalyzer, ClientPaymentPattern
from engine.smart_forecast import SmartForecaster, SmartForecast
from engine.early_warning import EarlyWarningDetector, EarlyWarning
from engine.client_scoring import ClientRiskScorer, ClientRiskScore
from engine.action_optimizer import ActionPrioritizer, OptimizedAction
from engine.seasonality import SeasonalityAdjuster

# V3 - Powerhouse (modules avancés)
from engine.margin_analyzer import MarginAnalyzer, ClientMarginProfile, MarginAnalysisResult
from engine.cost_drift_analyzer import CostDriftAnalyzer, CostDriftAnalysisResult
from engine.causal_analyzer import CausalAnalyzer, CausalAnalysisResult
from engine.variance_analyzer import VarianceAnalyzer, VarianceAnalysisResult
from engine.stress_tester import StressTester, StressTestResult
from engine.decision_arbiter import DecisionArbiter, ArbitrationResult


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
        
        # ═══════════════════════════════════════════════════════════════════════
        # ENGINES V2 - Sophistication avancée (initialisés plus tard avec données)
        # ═══════════════════════════════════════════════════════════════════════
        
        self.payment_analyzer: Optional[ClientPaymentAnalyzer] = None
        self.forecaster: Optional[SmartForecaster] = None
        self.warning_detector: Optional[EarlyWarningDetector] = None
        self.risk_scorer: Optional[ClientRiskScorer] = None
        self.action_prioritizer = ActionPrioritizer(treasury_runway_days=60)
        self.seasonality_adjuster: Optional[SeasonalityAdjuster] = None
        
        print("✅ Engines V2 configurés (seront initialisés avec les données):")
        print("   - ClientPaymentAnalyzer (patterns clients)")
        print("   - SmartForecaster (prévisions intelligentes)")
        print("   - EarlyWarningDetector (signaux faibles)")
        print("   - ClientRiskScorer (scoring 0-100)")
        print("   - ActionPrioritizer (impact×0.7 + ease×0.3)")
        print("   - SeasonalityAdjuster (facteurs saisonniers)")
        
        # ═══════════════════════════════════════════════════════════════════════
        # ENGINES V3 - Powerhouse (WTF moment demo)
        # ═══════════════════════════════════════════════════════════════════════
        
        self.margin_analyzer = MarginAnalyzer()
        self.cost_drift_analyzer = CostDriftAnalyzer()
        self.causal_analyzer = CausalAnalyzer()
        self.variance_analyzer = VarianceAnalyzer()
        self.stress_tester = StressTester(random_seed=42)
        self.decision_arbiter = DecisionArbiter(discount_rate=0.08)
        
        print("✅ Engines V3 Powerhouse initialisés:")
        print("   - MarginAnalyzer (analyse marges client/produit)")
        print("   - CostDriftAnalyzer (dérive coûts, coûts fantômes)")
        print("   - CausalAnalyzer (analyse causale WHY)")
        print("   - VarianceAnalyzer (écarts budget vs réel)")
        print("   - StressTester (Monte Carlo 10K simulations)")
        print("   - DecisionArbiter (arbitrage recruter vs sous-traiter)")

        
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
    # STEP 2: REQUALIFY RISKS (V2 avec Engines sophistiqués)
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def requalify_risks(self) -> List[Risk]:
        """
        Requalifie chaque encours avec sophistication V2 :
        
        V2 ENGINES:
        1. ClientPaymentAnalyzer → Analyse patterns historiques par client
        2. ClientRiskScorer → Score 0-100 + rating A/B/C/D
        3. EarlyWarningDetector → Détecte signaux faibles (progressive_delay, concentration, etc.)
        4. SmartForecaster → Prévisions ajustées par trend + probabilités
        
        Returns:
            Liste des risques requalifiés avec sophistication V2
        """
        invoices = self._load_invoices()
        if invoices is None or invoices.empty:
            return []
        
        risks: List[Risk] = []
        
        print("\n🔍 REQUALIFICATION V2 avec engines sophistiqués...")
        
        # ─────────────────────────────────────────────────────────────────────
        # ÉTAPE 1: Analyser patterns de paiement par client
        # ─────────────────────────────────────────────────────────────────────
        
        client_patterns = {}
        client_col = 'client_name' if 'client_name' in invoices.columns else 'client'
        
        print("📊 Analyse patterns clients...")
        for client in invoices[client_col].unique():
            try:
                pattern = self.payment_analyzer.analyze_client(invoices, str(client))
                client_patterns[str(client)] = pattern
            except Exception as e:
                print(f"⚠️  Erreur pattern {client}: {e}")
                continue
        
        print(f"✅ {len(client_patterns)} patterns clients analysés")
        
        # ─────────────────────────────────────────────────────────────────────
        # ÉTAPE 2: Scorer chaque client (0-100 + A/B/C/D)
        # ─────────────────────────────────────────────────────────────────────
        
        client_scores = {}
        pending = invoices[invoices.get('status', '') != 'paid'].copy()
        total_pending = pending['amount'].sum() if not pending.empty else 0
        
        print("🎯 Scoring risque clients...")
        for client, pattern in client_patterns.items():
            try:
                client_pending = pending[pending[client_col] == client]['amount'].sum() if not pending.empty else 0
                
                score = self.risk_scorer.calculate_risk_score(
                    pattern=pattern,
                    pending_amount=float(client_pending),
                    total_portfolio=float(total_pending) if total_pending > 0 else 1
                )
                client_scores[client] = score
            except Exception as e:
                print(f"⚠️  Erreur scoring {client}: {e}")
                continue
        
        print(f"✅ {len(client_scores)} clients scorés")
        
        # ─────────────────────────────────────────────────────────────────────
        # ÉTAPE 3: Détecter early warnings (signaux faibles)
        # ─────────────────────────────────────────────────────────────────────
        
        print("🚨 Détection early warnings...")
        early_warnings = self.warning_detector.detect_all_warnings(
            invoices_df=invoices,
            client_patterns=client_patterns
        )
        print(f"✅ {len(early_warnings)} warnings détectés")
        
        # Grouper warnings par client
        warnings_by_client = {}
        for warning in early_warnings:
            if warning.client_id not in warnings_by_client:
                warnings_by_client[warning.client_id] = []
            warnings_by_client[warning.client_id].append(warning)
        
        # ─────────────────────────────────────────────────────────────────────
        # ÉTAPE 4: Créer risques avec toute la sophistication V2
        # ─────────────────────────────────────────────────────────────────────
        
        print("📋 Création risques sophistiqués...")
        
        for _, row in pending.iterrows():
            days_overdue = int(row.get('days_overdue', 0))
            amount = float(row.get('amount', 0))
            client = str(row.get(client_col, 'Inconnu'))
            invoice_id = str(row.get('invoice_id', row.get('id', 'N/A')))
            
            # Skip si montant trop faible
            if amount < self.thresholds["amount_min"]:
                continue
            
            # Récupérer données V2
            client_score = client_scores.get(client)
            client_warnings = warnings_by_client.get(client, [])
            
            # Déterminer statut avec sophistication V2
            status, justification, probability = self._determine_risk_status_v2(
                days_overdue=days_overdue,
                amount=amount,
                client=client,
                client_score=client_score,
                warnings=client_warnings,
                invoices=invoices
            )
            
            # Calculer score final (intégration V2)
            score = self._calculate_risk_score_v2(
                days_overdue=days_overdue,
                amount=amount,
                probability=probability,
                client_score=client_score,
                status=status
            )
            
            # Déterminer type de risque
            risk_type = self._determine_risk_type_v2(
                days_overdue=days_overdue,
                client=client,
                warnings=client_warnings,
                invoices=invoices
            )
            
            # Créer risque
            risk = Risk(
                id=f"RISK_{invoice_id}_{datetime.now().strftime('%Y%m%d')}",
                type=risk_type,
                client=client,
                invoice_id=invoice_id,
                amount=amount,
                probability=probability,
                days_overdue=days_overdue,
                status=status,
                horizon_weeks=self._estimate_horizon_v2(days_overdue, status, client_score),
                score=score,
                justification=justification,
                data_quality=self._assess_data_quality(row)
            )
            
            risks.append(risk)
        
        # Trier par score décroissant
        risks.sort(key=lambda r: r.score, reverse=True)
        
        print(f"✅ {len(risks)} risques créés avec engines V2\n")
        
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
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MÉTHODES V2 - Utilisant engines sophistiqués
    # ═══════════════════════════════════════════════════════════════════════════
    
    def _determine_risk_status_v2(
        self,
        days_overdue: int,
        amount: float,
        client: str,
        client_score: Optional[ClientRiskScore],
        warnings: List[EarlyWarning],
        invoices: pd.DataFrame
    ) -> tuple[RiskStatus, str, float]:
        """
        Détermine statut risque avec sophistication V2.
        
        Intègre:
        - Client risk score (A/B/C/D)
        - Early warnings détectés
        - Patterns de paiement
        
        Returns:
            (status, justification, probability)
        """
        reasons = []
        
        # ─── CRITICAL si warnings critiques ───
        critical_warnings = [w for w in warnings if w.severity == "critical"]
        if critical_warnings:
            reasons.append(f"{len(critical_warnings)} warning(s) critique(s)")
            status = RiskStatus.CRITICAL
            probability = 0.95
        
        # ─── CRITICAL si client rating D ───
        elif client_score and client_score.rating == "D":
            reasons.append(f"Client rating D (score {client_score.risk_score:.0f})")
            reasons.extend(client_score.risk_factors[:2])  # Top 2 facteurs
            status = RiskStatus.CRITICAL
            probability = 0.9
        
        # ─── CRITICAL si retard > 90j ───
        elif days_overdue > self.thresholds["retard_critical"]:
            reasons.append(f"Retard > {self.thresholds['retard_critical']}j ({days_overdue}j)")
            status = RiskStatus.CRITICAL
            probability = 0.85
        
        # ─── UNCERTAIN si warnings high + client C ───
        elif warnings and client_score and client_score.rating in ["C", "D"]:
            high_warnings = [w for w in warnings if w.severity == "high"]
            if high_warnings:
                reasons.append(f"Client {client_score.rating} + {len(high_warnings)} warning(s)")
                status = RiskStatus.UNCERTAIN
                probability = 0.7
            else:
                reasons.append(f"Client {client_score.rating} + warnings détectés")
                status = RiskStatus.UNCERTAIN
                probability = 0.6
        
        # ─── UNCERTAIN si retard 45-90j ───
        elif days_overdue > self.thresholds["retard_uncertain"]:
            reasons.append(f"Retard {self.thresholds['retard_uncertain']}-{self.thresholds['retard_critical']}j")
            if client_score:
                reasons.append(f"Client rating {client_score.rating}")
            status = RiskStatus.UNCERTAIN
            probability = 0.55
        
        # ─── CERTAIN si client A/B sans warnings ───
        elif client_score and client_score.rating in ["A", "B"] and not warnings:
            reasons.append(f"Client fiable (rating {client_score.rating})")
            if client_score.positive_factors:
                reasons.append(client_score.positive_factors[0])
            status = RiskStatus.CERTAIN
            probability = 0.15
        
        # ─── CERTAIN par défaut ───
        else:
            status = RiskStatus.CERTAIN
            probability = 0.25
            reasons.append("Dans les normes")
            if client_score:
                reasons.append(f"Rating {client_score.rating}")
        
        justification = f"V2: {status.value.upper()} - {' | '.join(reasons)}"
        
        return status, justification, probability
    
    def _calculate_risk_score_v2(
        self,
        days_overdue: int,
        amount: float,
        probability: float,
        client_score: Optional[ClientRiskScore],
        status: RiskStatus
    ) -> int:
        """
        Calcule score risque avec sophistication V2.
        
        Formule: 
        - Retard (20%)
        - Montant (20%)
        - Probabilité (30%)
        - Client risk_score (30%)
        
        Returns:
            Score 0-100
        """
        # Score retard (max 20 points)
        retard_score = min(days_overdue / 120, 1) * 20
        
        # Score montant (max 20 points)
        amount_score = min(amount / 500000, 1) * 20
        
        # Score probabilité (max 30 points)
        proba_score = probability * 30
        
        # Score client V2 (max 30 points)
        if client_score:
            # Utiliser directement le risk_score du client (0-100)
            client_risk = client_score.risk_score * 0.3  # Max 30 points
        else:
            client_risk = 15  # Valeur moyenne si pas de score
        
        total = int(retard_score + amount_score + proba_score + client_risk)
        
        # Booster si status CRITICAL
        if status == RiskStatus.CRITICAL:
            total = min(100, total + 15)
        
        return min(100, max(0, total))
    
    def _determine_risk_type_v2(
        self,
        days_overdue: int,
        client: str,
        warnings: List[EarlyWarning],
        invoices: pd.DataFrame
    ) -> str:
        """
        Détermine type risque avec sophistication V2.
        
        Types V2:
        - "progressive_delay" : Dégradation progressive
        - "concentration" : Risque concentration
        - "seasonal_risk" : Risque saisonnier
        - "retard" : Retard classique
        - "deviation_scenario" : Déviation scénario
        """
        # Prioriser type basé sur warnings V2
        if warnings:
            # Grouper par type
            warning_types = [w.warning_type for w in warnings]
            
            if "progressive_delay" in warning_types:
                return "progressive_delay"
            elif "concentration_risk" in warning_types:
                return "concentration"
            elif "seasonal_risk" in warning_types:
                return "seasonal_risk"
            elif "partial_payments" in warning_types:
                return "partial_payments"
        
        # Fallback sur logique classique
        client_col = 'client_name' if 'client_name' in invoices.columns else 'client'
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
    
    def _estimate_horizon_v2(
        self,
        days_overdue: int,
        status: RiskStatus,
        client_score: Optional[ClientRiskScore]
    ) -> int:
        """
        Estime horizon impact avec sophistication V2.
        
        Facteurs:
        - Status (CRITICAL/UNCERTAIN/CERTAIN)
        - Client rating (D=immédiat, A=plus long)
        - Retard actuel
        
        Returns:
            Horizon en semaines (1-12)
        """
        if status == RiskStatus.CRITICAL:
            # Critique: impact immédiat
            if client_score and client_score.rating == "D":
                return 1  # 1 semaine si client D
            return 2  # 2 semaines sinon
        
        elif status == RiskStatus.UNCERTAIN:
            # Incertain: impact moyen terme
            if client_score and client_score.rating == "C":
                return 3  # 3 semaines si client C
            return 4  # 4 semaines sinon
        
        else:
            # Certain: horizon plus long
            if client_score and client_score.rating == "A":
                return 12  # 12 semaines si client A (très fiable)
            elif client_score and client_score.rating == "B":
                return 8   # 8 semaines si client B
            return 6  # 6 semaines par défaut
    
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
    # STEP 3: PROPOSE ACTIONS (V2 avec ActionPrioritizer)
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def propose_actions(self, risks: List[Risk]) -> List[Action]:
        """
        Propose actions avec ActionPrioritizer V2.
        
        V2 Features:
        - Priorisation intelligente (impact×0.7 + ease×0.3)
        - Quick wins detection
        - Success rate estimation par client
        - Niveaux P1/P2/P3 dynamiques
        
        Returns:
            Liste max 3 actions optimisées
        """
        if not risks:
            return []
        
        print("\n🎯 PROPOSITION ACTIONS V2 avec ActionPrioritizer...")
        
        # ─────────────────────────────────────────────────────────────────────
        # Préparer actions brutes pour le prioritizer
        # ─────────────────────────────────────────────────────────────────────
        
        actions_data = []
        
        for risk in risks:
            # Action relance pour risques critiques/incertains
            if risk.status in [RiskStatus.CRITICAL, RiskStatus.UNCERTAIN]:
                actions_data.append({
                    "action_type": "relance_client",
                    "client_id": risk.client,
                    "client_name": risk.client,
                    "invoice_id": risk.invoice_id,
                    "amount": risk.amount,
                    "title": f"Relancer {risk.client}",
                    "description": f"Requalifier encaissement {risk.amount/1000:.0f}K€",
                    "detailed_steps": [
                        "1. Contacter client pour statut paiement",
                        "2. Requalifier forecast si nécessaire",
                        "3. Notifier contrôle de gestion"
                    ],
                    "time_required_minutes": 20 if risk.status == RiskStatus.CRITICAL else 30,
                    "client_responsiveness": "high" if risk.days_overdue < 30 else "medium",
                    "complexity": "low" if risk.amount < 50000 else "medium",
                    "runway_impact_days": max(1, 30 - risk.horizon_weeks * 7),
                    "deadline": datetime.now() + timedelta(days=2 if risk.status == RiskStatus.CRITICAL else 7)
                })
        
        # Action concentration si détectée
        concentration_risks = [r for r in risks if r.type == "concentration"]
        if concentration_risks:
            top_conc = concentration_risks[0]
            actions_data.append({
                "action_type": "negocier_delai",
                "client_id": top_conc.client,
                "client_name": top_conc.client,
                "amount": top_conc.amount,
                "title": f"Réviser exposition {top_conc.client}",
                "description": "Analyser et sécuriser concentration client",
                "detailed_steps": [
                    "1. Analyser exposition totale",
                    "2. Évaluer options sécurisation",
                    "3. Préparer scénario alternatif"
                ],
                "time_required_minutes": 60,
                "client_responsiveness": "medium",
                "complexity": "high",
                "runway_impact_days": 21,
                "deadline": datetime.now() + timedelta(days=10)
            })
        
        # ─────────────────────────────────────────────────────────────────────
        # Utiliser ActionPrioritizer V2
        # ─────────────────────────────────────────────────────────────────────
        
        # Calculer runway actuel (approximation)
        total_at_risk = sum(r.amount * r.probability for r in risks)
        estimated_monthly_revenue = sum(r.amount for r in risks) * 2  # Approximation
        runway_days = int((estimated_monthly_revenue - total_at_risk) / (estimated_monthly_revenue / 30)) if estimated_monthly_revenue > 0 else 60
        
        prioritizer = ActionPrioritizer(treasury_runway_days=max(30, runway_days))
        optimized_actions = prioritizer.prioritize_actions(actions_data)
        
        print(f"✅ {len(optimized_actions)} actions priorisées")
        
        # ─────────────────────────────────────────────────────────────────────
        # Convertir en format Action (max 3)
        # ─────────────────────────────────────────────────────────────────────
        
        final_actions = []
        
        for opt_action in optimized_actions[:3]:  # Top 3
            # Mapper priority_level V2 vers ActionPriority
            priority_map = {
                "P1": ActionPriority.P1,
                "P2": ActionPriority.P2,
                "P3": ActionPriority.P3
            }
            
            # Trouver risque associé
            related_risk = next((r for r in risks if r.client == opt_action.client_name), None)
            
            action = Action(
                id=opt_action.action_id,
                risk_id=related_risk.id if related_risk else "GLOBAL",
                priority=priority_map.get(opt_action.priority_level, ActionPriority.P2),
                title=opt_action.title,
                description=self._build_action_description_v2(opt_action, related_risk),
                justification=f"Priority={opt_action.priority_score:.0f} (Impact={opt_action.impact_score:.0f}, Ease={opt_action.ease_score:.0f}) | Success rate={opt_action.estimated_success_rate*100:.0f}%",
                impact_amount=opt_action.amount,
                deadline=opt_action.deadline.strftime("%d/%m/%Y")
            )
            
            final_actions.append(action)
        
        # Ajouter action globale si fort risque cumulé
        if len(final_actions) < 3:
            total_at_risk = sum(r.amount * r.probability for r in risks if r.status in [RiskStatus.CRITICAL, RiskStatus.UNCERTAIN])
            if total_at_risk > 100000:
                final_actions.append(Action(
                    id=f"ACT_GLOBAL_{datetime.now().strftime('%Y%m%d_%H%M')}",
                    risk_id="GLOBAL",
                    priority=ActionPriority.P3,
                    title="Réviser forecast trésorerie",
                    description=f"Intégrer {total_at_risk/1000:.0f}K€ de risque dans prévisions",
                    justification=f"{len([r for r in risks if r.status != RiskStatus.CERTAIN])} risques identifiés",
                    impact_amount=total_at_risk,
                    deadline=(datetime.now() + timedelta(days=14)).strftime("%d/%m/%Y")
                ))
        
        print(f"✅ {len(final_actions)} actions finales proposées\n")
        
        return final_actions
    
    def _build_action_description_v2(
        self,
        opt_action: OptimizedAction,
        related_risk: Optional[Risk]
    ) -> str:
        """Construit description action avec détails V2"""
        
        priority_text = {
            "P1": "Action immédiate requise",
            "P2": "Action importante cette semaine",
            "P3": "Action à planifier"
        }
        
        desc = f"""{priority_text.get(opt_action.priority_level, 'Action')} sur {opt_action.client_name}:

{opt_action.description}

ÉTAPES:
"""
        for step in opt_action.detailed_steps:
            desc += f"\n{step}"
        
        desc += f"""

CONTEXTE V2:
• Montant: {opt_action.amount/1000:.0f}K€
• Temps requis: {opt_action.time_required_minutes}min
• Succès estimé: {opt_action.estimated_success_rate*100:.0f}%
• Impact runway: +{opt_action.expected_impact_days}j si réussi
"""
        
        if related_risk:
            desc += f"• Retard actuel: {related_risk.days_overdue}j\n"
            desc += f"• Score risque: {related_risk.score}/100\n"
        
        return desc
    
    def _build_action_description(self, risk: Risk, priority: str) -> str:
        """Construit la description détaillée d'une action (legacy)"""
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

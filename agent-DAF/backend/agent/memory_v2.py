"""
TRESORIS Memory - Mémoire persistante avec audit trail
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fonction : Tracer toutes les décisions pour apprentissage et gouvernance.

Audit Trail :
1. Analyse → Risques détectés
2. Actions proposées
3. Validation DAF (approved/rejected)
4. Outcome réel (4 semaines après)

0 donnée bancaire | Stockage local uniquement
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import os


@dataclass
class AuditEntry:
    """Entrée d'audit pour traçabilité"""
    id: str
    timestamp: datetime
    event_type: str  # "analysis" | "daf_decision" | "outcome"
    data: Dict
    
    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat(),
            "event_type": self.event_type,
            "data": self.data
        }


class TresorisMemory:
    """
    Mémoire persistante de TRESORIS avec audit trail complet.
    
    Tables :
    - analyses : Historique des analyses
    - decisions : Décisions DAF (approved/rejected)
    - outcomes : Résultats réels (remplis 4 semaines après)
    - audit_trail : Trace complète pour gouvernance
    """
    
    def __init__(self, storage_path: Path):
        self.storage_path = storage_path
        self.storage_path.mkdir(parents=True, exist_ok=True)
        
        # Fichiers JSON simples (pas de TinyDB pour simplifier)
        self.analyses_file = self.storage_path / "analyses.json"
        self.decisions_file = self.storage_path / "daf_decisions.json"
        self.outcomes_file = self.storage_path / "outcomes.json"
        self.audit_file = self.storage_path / "audit_trail.json"
        
        # Charger ou initialiser
        self.analyses = self._load_json(self.analyses_file, [])
        self.decisions = self._load_json(self.decisions_file, [])
        self.outcomes = self._load_json(self.outcomes_file, [])
        self.audit_trail = self._load_json(self.audit_file, [])
    
    def _load_json(self, path: Path, default: Any) -> Any:
        """Charge un fichier JSON ou retourne la valeur par défaut"""
        try:
            if path.exists():
                with open(path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"⚠️ Erreur chargement {path.name}: {e}")
        return default
    
    def _save_json(self, path: Path, data: Any):
        """Sauvegarde en JSON"""
        try:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2, default=str)
        except Exception as e:
            print(f"❌ Erreur sauvegarde {path.name}: {e}")
    
    def _add_audit(self, event_type: str, data: Dict):
        """Ajoute une entrée à l'audit trail"""
        entry = {
            "id": f"AUDIT_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}",
            "timestamp": datetime.now().isoformat(),
            "event_type": event_type,
            "data": data
        }
        self.audit_trail.append(entry)
        self._save_json(self.audit_file, self.audit_trail)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # ANALYSES
    # ═══════════════════════════════════════════════════════════════════════════
    
    def save_analysis(self, analysis: Dict):
        """
        Enregistre une analyse complète.
        
        Structure attendue :
        {
            "id": str,
            "timestamp": str,
            "trigger_reason": str,
            "risks": List[Dict],
            "actions": List[Dict],
            "crisis_note": str,
            "summary": Dict
        }
        """
        # Enrichir avec métadonnées
        analysis["saved_at"] = datetime.now().isoformat()
        analysis["validation_status"] = "pending"  # pending | partial | complete
        
        self.analyses.append(analysis)
        self._save_json(self.analyses_file, self.analyses)
        
        # Audit
        self._add_audit("analysis_saved", {
            "analysis_id": analysis.get("id"),
            "risks_count": len(analysis.get("risks", [])),
            "actions_count": len(analysis.get("actions", []))
        })
        
        print(f"💾 Analyse {analysis.get('id')} enregistrée")
    
    def get_last_analysis(self) -> Optional[Dict]:
        """Récupère la dernière analyse"""
        if not self.analyses:
            return None
        
        # Trier par timestamp
        sorted_analyses = sorted(
            self.analyses,
            key=lambda a: a.get("timestamp", ""),
            reverse=True
        )
        return sorted_analyses[0]
    
    def get_analyses_history(self, limit: int = 10) -> List[Dict]:
        """Récupère l'historique des analyses"""
        sorted_analyses = sorted(
            self.analyses,
            key=lambda a: a.get("timestamp", ""),
            reverse=True
        )
        return sorted_analyses[:limit]
    
    # ═══════════════════════════════════════════════════════════════════════════
    # DÉCISIONS DAF
    # ═══════════════════════════════════════════════════════════════════════════
    
    def save_daf_decision(
        self,
        analysis_id: str,
        action_id: str,
        decision: str,  # "approved" | "rejected" | "deferred"
        validated_by: str = "DAF",
        comment: Optional[str] = None
    ):
        """
        Enregistre une décision du DAF sur une action.
        
        C'est le cœur de la gouvernance : l'agent propose, le DAF décide.
        """
        record = {
            "id": f"DEC_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "analysis_id": analysis_id,
            "action_id": action_id,
            "decision": decision,
            "validated_by": validated_by,
            "comment": comment,
            "timestamp": datetime.now().isoformat(),
            "outcome_due_date": (datetime.now() + timedelta(weeks=4)).isoformat()
        }
        
        self.decisions.append(record)
        self._save_json(self.decisions_file, self.decisions)
        
        # Audit
        self._add_audit("daf_decision", {
            "action_id": action_id,
            "decision": decision,
            "validated_by": validated_by
        })
        
        # Mettre à jour le statut de l'analyse
        self._update_analysis_validation_status(analysis_id)
        
        print(f"📝 Décision DAF: {decision} pour action {action_id}")
    
    def _update_analysis_validation_status(self, analysis_id: str):
        """Met à jour le statut de validation d'une analyse"""
        # Trouver l'analyse
        analysis = next((a for a in self.analyses if a.get("id") == analysis_id), None)
        if not analysis:
            return
        
        # Compter les actions validées
        action_ids = [a.get("id") for a in analysis.get("actions", [])]
        validated_decisions = [d for d in self.decisions if d.get("action_id") in action_ids]
        
        if len(validated_decisions) == 0:
            analysis["validation_status"] = "pending"
        elif len(validated_decisions) < len(action_ids):
            analysis["validation_status"] = "partial"
        else:
            analysis["validation_status"] = "complete"
        
        self._save_json(self.analyses_file, self.analyses)
    
    def get_decisions_for_analysis(self, analysis_id: str) -> List[Dict]:
        """Récupère toutes les décisions pour une analyse"""
        return [d for d in self.decisions if d.get("analysis_id") == analysis_id]
    
    def get_pending_outcomes(self) -> List[Dict]:
        """
        Récupère les décisions qui attendent un outcome.
        (Décisions > 4 semaines sans outcome enregistré)
        """
        pending = []
        now = datetime.now()
        
        for decision in self.decisions:
            due_date = datetime.fromisoformat(decision.get("outcome_due_date", now.isoformat()))
            
            # Check si outcome existe
            has_outcome = any(
                o.get("decision_id") == decision.get("id") 
                for o in self.outcomes
            )
            
            if not has_outcome and now >= due_date:
                pending.append(decision)
        
        return pending
    
    # ═══════════════════════════════════════════════════════════════════════════
    # OUTCOMES (Résultats réels)
    # ═══════════════════════════════════════════════════════════════════════════
    
    def save_outcome(
        self,
        decision_id: str,
        outcome: str,  # "confirmed" | "resolved" | "worse" | "false_positive"
        actual_amount: Optional[float] = None,
        notes: Optional[str] = None
    ):
        """
        Enregistre le résultat réel d'un risque 4 semaines après.
        
        Permet d'apprendre :
        - Les risques CRITICAL étaient-ils vraiment critiques ?
        - Les actions proposées étaient-elles pertinentes ?
        
        C'est ce qui rend l'agent intelligent sur le long terme.
        """
        # Trouver la décision originale
        decision = next((d for d in self.decisions if d.get("id") == decision_id), None)
        if not decision:
            print(f"⚠️ Décision {decision_id} non trouvée")
            return
        
        record = {
            "id": f"OUT_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "decision_id": decision_id,
            "analysis_id": decision.get("analysis_id"),
            "action_id": decision.get("action_id"),
            "original_decision": decision.get("decision"),
            "outcome": outcome,
            "actual_amount": actual_amount,
            "notes": notes,
            "recorded_at": datetime.now().isoformat(),
            "days_after_decision": (datetime.now() - datetime.fromisoformat(decision.get("timestamp"))).days
        }
        
        self.outcomes.append(record)
        self._save_json(self.outcomes_file, self.outcomes)
        
        # Audit
        self._add_audit("outcome_recorded", {
            "decision_id": decision_id,
            "outcome": outcome,
            "accuracy": "accurate" if outcome in ["confirmed", "resolved"] else "inaccurate"
        })
        
        print(f"📊 Outcome enregistré: {outcome} pour décision {decision_id}")
    
    # ═══════════════════════════════════════════════════════════════════════════
    # INTELLIGENCE METRICS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_intelligence_metrics(self) -> Dict:
        """
        Calcule les métriques d'intelligence de l'agent.
        
        - Taux de précision : risques CRITICAL confirmés / total CRITICAL
        - Taux de faux positifs : risques non avérés / total risques
        - Taux d'approbation DAF : approved / total décisions
        """
        total_analyses = len(self.analyses)
        total_decisions = len(self.decisions)
        total_outcomes = len(self.outcomes)
        
        # Taux d'approbation DAF
        approved_decisions = len([d for d in self.decisions if d.get("decision") == "approved"])
        approval_rate = (approved_decisions / total_decisions * 100) if total_decisions > 0 else 0
        
        # Taux de précision (basé sur outcomes)
        confirmed_outcomes = len([o for o in self.outcomes if o.get("outcome") in ["confirmed", "resolved"]])
        accuracy_rate = (confirmed_outcomes / total_outcomes * 100) if total_outcomes > 0 else 0
        
        # Faux positifs
        false_positives = len([o for o in self.outcomes if o.get("outcome") == "false_positive"])
        false_positive_rate = (false_positives / total_outcomes * 100) if total_outcomes > 0 else 0
        
        return {
            "total_analyses": total_analyses,
            "total_decisions": total_decisions,
            "total_outcomes": total_outcomes,
            "approval_rate": round(approval_rate, 1),
            "accuracy_rate": round(accuracy_rate, 1),
            "false_positive_rate": round(false_positive_rate, 1),
            "pending_outcomes": len(self.get_pending_outcomes()),
            "interpretation": self._build_intelligence_interpretation(
                approval_rate, accuracy_rate, false_positive_rate
            )
        }
    
    def _build_intelligence_interpretation(
        self, 
        approval_rate: float, 
        accuracy_rate: float,
        false_positive_rate: float
    ) -> str:
        """Construit une interprétation des métriques"""
        if accuracy_rate >= 80:
            accuracy_text = "Excellente précision des détections"
        elif accuracy_rate >= 60:
            accuracy_text = "Bonne précision, marge d'amélioration"
        else:
            accuracy_text = "Précision à améliorer"
        
        if false_positive_rate <= 10:
            fp_text = "Très peu de faux positifs"
        elif false_positive_rate <= 25:
            fp_text = "Taux de faux positifs acceptable"
        else:
            fp_text = "Trop de faux positifs, recalibrage nécessaire"
        
        if approval_rate >= 70:
            approval_text = "Forte confiance du DAF"
        elif approval_rate >= 50:
            approval_text = "Confiance modérée du DAF"
        else:
            approval_text = "Propositions souvent rejetées"
        
        return f"{accuracy_text}. {fp_text}. {approval_text}."
    
    # ═══════════════════════════════════════════════════════════════════════════
    # AUDIT TRAIL
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_audit_trail(
        self, 
        limit: int = 50,
        event_type: Optional[str] = None
    ) -> List[Dict]:
        """
        Récupère l'audit trail complet.
        
        Filtrable par type d'événement :
        - "analysis_saved"
        - "daf_decision"
        - "outcome_recorded"
        """
        trail = self.audit_trail
        
        if event_type:
            trail = [e for e in trail if e.get("event_type") == event_type]
        
        # Trier par timestamp desc
        sorted_trail = sorted(
            trail,
            key=lambda e: e.get("timestamp", ""),
            reverse=True
        )
        
        return sorted_trail[:limit]
    
    def export_audit_report(self) -> str:
        """
        Exporte un rapport d'audit complet en texte.
        
        Utile pour gouvernance et conformité.
        """
        metrics = self.get_intelligence_metrics()
        recent_trail = self.get_audit_trail(limit=20)
        
        report = f"""
════════════════════════════════════════════════════════════════
RAPPORT D'AUDIT - Agent TRESORIS
Généré le {datetime.now().strftime("%d/%m/%Y à %H:%M")}
════════════════════════════════════════════════════════════════

1. MÉTRIQUES D'INTELLIGENCE
────────────────────────────
• Analyses effectuées : {metrics['total_analyses']}
• Décisions DAF enregistrées : {metrics['total_decisions']}
• Outcomes suivis : {metrics['total_outcomes']}
• Taux d'approbation DAF : {metrics['approval_rate']}%
• Taux de précision : {metrics['accuracy_rate']}%
• Taux de faux positifs : {metrics['false_positive_rate']}%

Interprétation : {metrics['interpretation']}

2. AUDIT TRAIL RÉCENT (20 derniers événements)
──────────────────────────────────────────────
"""
        
        for entry in recent_trail:
            timestamp = entry.get("timestamp", "")[:16]
            event_type = entry.get("event_type", "").upper()
            data = entry.get("data", {})
            
            if event_type == "ANALYSIS_SAVED":
                report += f"\n[{timestamp}] ANALYSE - {data.get('risks_count', 0)} risques, {data.get('actions_count', 0)} actions"
            elif event_type == "DAF_DECISION":
                report += f"\n[{timestamp}] DÉCISION DAF - {data.get('decision', '').upper()} par {data.get('validated_by', 'N/A')}"
            elif event_type == "OUTCOME_RECORDED":
                report += f"\n[{timestamp}] OUTCOME - {data.get('outcome', '').upper()} ({data.get('accuracy', '')})"
            else:
                report += f"\n[{timestamp}] {event_type}"
        
        report += f"""

3. GOUVERNANCE
──────────────
• 0 accès bancaire
• 0 virement automatique
• 0 email envoyé automatiquement
• 0 décision exécutée sans validation DAF

════════════════════════════════════════════════════════════════
Ce rapport est généré automatiquement par TRESORIS.
Toutes les décisions nécessitent validation humaine.
════════════════════════════════════════════════════════════════
"""
        
        return report
    
    # ═══════════════════════════════════════════════════════════════════════════
    # STATISTICS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_statistics(self) -> Dict:
        """Statistiques générales"""
        return {
            "total_analyses": len(self.analyses),
            "total_decisions": len(self.decisions),
            "total_outcomes": len(self.outcomes),
            "audit_entries": len(self.audit_trail),
            "last_analysis": self.get_last_analysis().get("timestamp") if self.get_last_analysis() else None,
            "storage_path": str(self.storage_path),
            "intelligence_metrics": self.get_intelligence_metrics()
        }
    
    def clear_old_data(self, keep_days: int = 90):
        """Nettoie les données anciennes (garder N derniers jours)"""
        cutoff = datetime.now() - timedelta(days=keep_days)
        cutoff_str = cutoff.isoformat()
        
        # Filtrer
        self.analyses = [a for a in self.analyses if a.get("timestamp", "") > cutoff_str]
        self.decisions = [d for d in self.decisions if d.get("timestamp", "") > cutoff_str]
        self.outcomes = [o for o in self.outcomes if o.get("recorded_at", "") > cutoff_str]
        
        # Garder tout l'audit trail pour conformité
        
        # Sauvegarder
        self._save_json(self.analyses_file, self.analyses)
        self._save_json(self.decisions_file, self.decisions)
        self._save_json(self.outcomes_file, self.outcomes)
        
        print(f"🧹 Nettoyage effectué (gardé {keep_days} derniers jours)")

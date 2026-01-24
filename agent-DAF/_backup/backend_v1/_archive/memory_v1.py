"""
Agent Memory - Mémoire persistante des runs et décisions
Permet contexte et traçabilité
"""

import json
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
from tinydb import TinyDB, Query


class AgentMemory:
    """
    Gère la mémoire persistante de l'agent :
    - Historique des runs
    - Décisions DAF
    - Contexte évolutif
    """
    
    def __init__(self, storage_path: Path):
        self.storage_path = storage_path
        self.storage_path.mkdir(parents=True, exist_ok=True)
        
        # Base de données TinyDB
        self.db = TinyDB(self.storage_path / "agent_memory.json")
        
        # Tables
        self.runs = self.db.table("runs")
        self.decisions = self.db.table("decisions")
        self.triggers = self.db.table("triggers")
        self.context = self.db.table("context")
    
    def save_run(self, run_id: str, deliverables: Dict, 
                 trigger_reason: Optional[str] = None):
        """Enregistre un run complet"""
        record = {
            "run_id": run_id,
            "timestamp": datetime.now().isoformat(),
            "trigger_reason": trigger_reason,
            "deliverables": deliverables,
            "run_type": "complete",  # FIX 2: Ajout type
            "summary": {
                "balance": deliverables.get("treasury", {}).get("current_balance", 0),
                "runway_days": deliverables.get("treasury", {}).get("cash_runway_days", 0),
                "risks_count": len(deliverables.get("risks", [])),
                "actions_count": len(deliverables.get("actions", [])),
            }
        }
        
        self.runs.insert(record)
        print(f"💾 Run {run_id} enregistré en mémoire")
    
    def save_skip_decision(self, reason: str, severity: str, context: Dict):
        """
        FIX 2: Enregistre quand l'agent décide de NE PAS analyser
        Prouve l'intelligence: savoir quand ne rien faire
        """
        record = {
            "event_type": "intelligent_skip",
            "timestamp": datetime.now().isoformat(),
            "reason": reason,
            "severity": severity,
            "run_type": "skipped",
            "context_summary": {
                "trigger_type": context.get("trigger_type"),
                "changes_detected": len(context.get("recent_changes", [])),
                "total_new_amount": context.get("changes", {}).get("total_new_amount", 0)
            }
        }
        
        self.runs.insert(record)
        print(f"🧠 Skip intelligent enregistré: {reason}")
    
    def save_daf_decision(self, run_id: str, action_id: str, 
                         decision: str, comment: Optional[str] = None):
        """Enregistre une décision du DAF"""
        record = {
            "run_id": run_id,
            "action_id": action_id,
            "decision": decision,  # "validated", "rejected", "deferred"
            "comment": comment,
            "timestamp": datetime.now().isoformat()
        }
        
        self.decisions.insert(record)
        print(f"📝 Décision DAF enregistrée: {decision} pour {action_id}")
    
    def save_trigger_event(self, trigger_data: Dict):
        """Enregistre un événement de déclenchement"""
        self.triggers.insert({
            **trigger_data,
            "saved_at": datetime.now().isoformat()
        })
    
    def get_last_run(self) -> Optional[Dict]:
        """Récupère le dernier run"""
        all_runs = self.runs.all()
        if not all_runs:
            return None
        
        # Trier par timestamp
        sorted_runs = sorted(
            all_runs,
            key=lambda r: r.get("timestamp", ""),
            reverse=True
        )
        
        return sorted_runs[0]
    
    def get_runs_history(self, limit: int = 10) -> List[Dict]:
        """Récupère l'historique des runs"""
        all_runs = self.runs.all()
        sorted_runs = sorted(
            all_runs,
            key=lambda r: r.get("timestamp", ""),
            reverse=True
        )
        return sorted_runs[:limit]
    
    def detect_changes_since_last_run(self, current_data: Dict) -> Dict:
        """Compare les données actuelles avec le dernier run"""
        last_run = self.get_last_run()
        
        if not last_run:
            return {
                "first_run": True,
                "message": "Premier run de l'agent"
            }
        
        last_summary = last_run.get("summary", {})
        
        changes = {
            "balance_delta": current_data.get("balance", 0) - last_summary.get("balance", 0),
            "runway_delta": current_data.get("runway_days", 0) - last_summary.get("runway_days", 0),
            "new_risks": current_data.get("risks_count", 0) - last_summary.get("risks_count", 0),
            "time_since_last_run": self._time_since(last_run.get("timestamp")),
        }
        
        return changes
    
    def _time_since(self, timestamp_iso: str) -> str:
        """Calcule le temps écoulé depuis un timestamp"""
        if not timestamp_iso:
            return "unknown"
        
        try:
            last_time = datetime.fromisoformat(timestamp_iso)
            delta = datetime.now() - last_time
            
            if delta.days > 0:
                return f"{delta.days}j"
            elif delta.seconds > 3600:
                return f"{delta.seconds // 3600}h"
            else:
                return f"{delta.seconds // 60}min"
        except:
            return "unknown"
    
    def get_daf_decisions_for_run(self, run_id: str) -> List[Dict]:
        """Récupère toutes les décisions DAF pour un run"""
        RunQuery = Query()
        return self.decisions.search(RunQuery.run_id == run_id)
    
    def get_action_history(self, action_type: str) -> List[Dict]:
        """Historique des décisions pour un type d'action"""
        ActionQuery = Query()
        # Recherche dans les décisions
        # Note: nécessite structure plus détaillée pour filtrer par type
        return self.decisions.all()
    
    def update_context(self, key: str, value: any):
        """Met à jour le contexte global"""
        ContextQuery = Query()
        
        # Chercher si existe
        existing = self.context.get(ContextQuery.key == key)
        
        record = {
            "key": key,
            "value": value,
            "updated_at": datetime.now().isoformat()
        }
        
        if existing:
            self.context.update(record, ContextQuery.key == key)
        else:
            self.context.insert(record)
    
    def get_context(self, key: str, default=None):
        """Récupère une valeur du contexte"""
        ContextQuery = Query()
        result = self.context.get(ContextQuery.key == key)
        
        if result:
            return result.get("value", default)
        return default
    
    def get_statistics(self) -> Dict:
        """Statistiques sur la mémoire"""
        return {
            "total_runs": len(self.runs),
            "total_decisions": len(self.decisions),
            "total_triggers": len(self.triggers),
            "last_run_date": self.get_last_run().get("timestamp") if self.get_last_run() else None,
            "storage_path": str(self.storage_path)
        }
    
    def clear_old_runs(self, keep_last_n: int = 50):
        """Nettoie les vieux runs (garder les N derniers)"""
        all_runs = self.runs.all()
        
        if len(all_runs) <= keep_last_n:
            return
        
        sorted_runs = sorted(
            all_runs,
            key=lambda r: r.get("timestamp", ""),
            reverse=True
        )
        
        # Garder les N derniers
        to_keep = sorted_runs[:keep_last_n]
        to_keep_ids = [r.doc_id for r in to_keep]
        
        # Supprimer les autres
        RunQuery = Query()
        for run in all_runs:
            if run.doc_id not in to_keep_ids:
                self.runs.remove(doc_ids=[run.doc_id])
        
        print(f"🧹 Nettoyage: gardé {keep_last_n} derniers runs")
    
    def get_intelligence_metrics(self) -> Dict:
        """
        FIX 2: Métriques d'intelligence de l'agent
        Combien de fois l'agent a choisi intelligemment de ne rien faire ?
        """
        all_events = self.runs.all()
        
        total_events = len(all_events)
        complete_runs = len([e for e in all_events if e.get("run_type") == "complete"])
        skipped_runs = len([e for e in all_events if e.get("run_type") == "skipped"])
        
        # Calcul du taux d'intelligence (skip pertinents / total events)
        intelligence_rate = (skipped_runs / total_events * 100) if total_events > 0 else 0
        
        # Raisons de skip les plus fréquentes
        skip_reasons = {}
        for event in all_events:
            if event.get("run_type") == "skipped":
                reason = event.get("reason", "unknown")
                skip_reasons[reason] = skip_reasons.get(reason, 0) + 1
        
        return {
            "total_events": total_events,
            "complete_runs": complete_runs,
            "skipped_runs": skipped_runs,
            "intelligence_rate": round(intelligence_rate, 1),
            "skip_reasons": skip_reasons,
            "interpretation": f"L'agent a choisi de ne pas analyser {skipped_runs} fois sur {total_events} événements ({intelligence_rate:.0f}%)"
        }


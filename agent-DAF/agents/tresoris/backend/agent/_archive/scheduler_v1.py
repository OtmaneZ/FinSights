"""
Agent Scheduler - Orchestrateur autonome avec boucle de surveillance
Gère le cycle de vie autonome de l'agent
"""

import asyncio
from typing import Optional, Dict
from datetime import datetime
from pathlib import Path
import numpy as np

from .runner import AgentRunner
from .monitor import AgentMonitor
from .triggers import TriggerEngine, create_default_triggers
from .memory import AgentMemory


def convert_numpy_types(obj):
    """Convertit récursivement les types numpy en types Python natifs"""
    if isinstance(obj, (np.integer, np.int64, np.int32)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64, np.float32)):
        if np.isnan(obj) or np.isinf(obj):
            return None  # Convertir NaN et Inf en None (null en JSON)
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_numpy_types(item) for item in obj]
    elif obj is None or (isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj))):
        return None
    return obj


class AgentMode:
    """États possibles de l'agent"""
    IDLE = "idle"
    MONITORING = "monitoring"
    ANALYZING = "analyzing"
    WAITING_VALIDATION = "waiting_validation"
    STOPPED = "stopped"


class AutonomousScheduler:
    """
    Scheduler autonome qui :
    1. Surveille les données en continu
    2. Décide quand analyser
    3. Lance les runs automatiquement
    4. Gère le cycle de vie complet
    """
    
    def __init__(self, data_path: Path, storage_path: Path):
        self.data_path = data_path
        self.storage_path = storage_path
        
        # Composants
        self.monitor = AgentMonitor(data_path)
        self.trigger_engine = TriggerEngine()
        self.memory = AgentMemory(storage_path)
        self.runner: Optional[AgentRunner] = None
        
        # État
        self.mode = AgentMode.IDLE
        self.running = False
        self.loop_task: Optional[asyncio.Task] = None
        self.event_callbacks = []
        
        # Configuration
        self.check_interval = 60  # Check toutes les 60 secondes
        self.last_decision = None
        
        # Initialiser les triggers par défaut
        for trigger in create_default_triggers():
            self.trigger_engine.register_rule(trigger)
        
        # Connecter le monitor
        self.monitor.register_change_callback(self.on_data_changed)
    
    def register_event_callback(self, callback):
        """Enregistre un callback pour les événements"""
        self.event_callbacks.append(callback)
    
    async def emit_event(self, event_type: str, data: Dict):
        """Émet un événement vers tous les callbacks"""
        event = {
            "type": event_type,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        
        for callback in self.event_callbacks:
            try:
                if asyncio.iscoroutinefunction(callback):
                    await callback(event)
                else:
                    callback(event)
            except Exception as e:
                print(f"Erreur callback événement: {e}")
    
    async def on_data_changed(self, changes):
        """Handler appelé quand données changent"""
        print(f"📊 Changements détectés: {len(changes)} événements")
        
        await self.emit_event("data_changed", {
            "changes_count": len(changes),
            "changes": [
                {
                    "file": c.file_path,
                    "type": c.change_type,
                    "severity": c.severity
                }
                for c in changes
            ]
        })
        
        # Évaluer si déclenchement nécessaire
        await self.evaluate_and_decide()
    
    async def evaluate_and_decide(self):
        """
        CŒUR DE LA DÉCISION AUTONOME
        L'agent décide s'il doit analyser maintenant
        """
        if self.mode == AgentMode.ANALYZING:
            print("⏳ Analyse en cours, attente...")
            return
        
        # Préparer le contexte pour le trigger engine
        context = await self._build_context()
        
        # Demander au trigger engine
        trigger_event = await self.trigger_engine.evaluate(context)
        
        if trigger_event:
            # DÉCISION : OUI, il faut analyser
            reason = trigger_event.get("rule_name", "unknown")
            priority = trigger_event.get("priority", 3)
            
            await self.emit_event("decision_made", {
                "decision": "trigger_analysis",
                "reason": reason,
                "priority": priority,
                "context": context
            })
            
            # Sauvegarder dans la mémoire
            self.memory.save_trigger_event(trigger_event)
            
            # Lancer l'analyse
            await self.trigger_analysis(reason)
        else:
            # DÉCISION : NON, pas besoin
            self.last_decision = {
                "decision": "no_action",
                "reason": "no_trigger_condition_met",
                "timestamp": datetime.now().isoformat()
            }
            
            print("✅ Évaluation: Aucune action nécessaire")
    
    async def _build_context(self) -> Dict:
        """Construit le contexte pour l'évaluation des triggers"""
        # Récupérer derniers changements du monitor
        should_trigger, reason = self.monitor.should_trigger_analysis()
        
        # Récupérer contexte de la mémoire
        last_run = self.memory.get_last_run()
        
        context = {
            "recent_changes": [
                {
                    "severity": c.severity,
                    "type": c.change_type,
                    "details": convert_numpy_types(c.details)  # Nettoyer NaN
                }
                for c in self.monitor.changes_detected
            ],
            "monitor_decision": {
                "should_trigger": should_trigger,
                "reason": reason
            },
            "last_run_date": last_run.get("timestamp") if last_run else None,
            "current_balance": last_run.get("summary", {}).get("balance", 0) if last_run else 0,
            "cash_runway_days": last_run.get("summary", {}).get("runway_days", 180) if last_run else 180,
        }
        
        return context
    
    async def trigger_analysis(self, reason: str):
        """
        Lance une analyse automatiquement.
        AJOUT 1 intégré: Vérifie should_run() AVANT de lancer.
        """
        if not self.runner:
            print("❌ Runner non initialisé")
            return
        
        # AJOUT 1 — DECISION GATE
        # Construire le contexte enrichi pour should_run()
        context = await self._build_context()
        context["trigger_reason"] = reason
        context["trigger_type"] = "file_change" if "customer_invoices" in reason or "bank_transactions" in reason else "scheduled"
        
        # Extraire les changements récents pour should_run()
        recent_changes = self.monitor.changes_detected
        if recent_changes:
            last_change = recent_changes[-1]
            context["changes"] = {
                "file_path": last_change.file_path,
                "num_lines_changed": len(last_change.details.get("changes", [])),
                "total_new_amount": sum([
                    abs(c.get("amount", 0)) 
                    for c in last_change.details.get("changes", [])
                    if isinstance(c, dict)
                ]),
                "new_high_risk_invoices": sum([
                    1 for c in last_change.details.get("changes", [])
                    if isinstance(c, dict) and c.get("risk_level") in ["high", "critical"]
                ])
            }
        
        # Récupérer la mémoire pour should_run()
        last_run = self.memory.get_last_run()
        context["memory"] = {
            "last_analysis_time": last_run.get("timestamp") if last_run else None,
            "last_data_change_time": context.get("recent_changes", [{}])[-1].get("timestamp") if context.get("recent_changes") else None
        }
        
        # APPEL DE LA DÉCISION GATE
        should_run, decision_reason, severity = self.runner.should_run(context)
        
        if not should_run:
            # L'AGENT CHOISIT DE NE RIEN FAIRE
            print(f"🤖 Agent décision: SKIP - {decision_reason}")
            
            # FIX 2: Sauvegarder le skip intelligent en mémoire
            self.memory.save_skip_decision(
                reason=decision_reason,
                severity=severity,
                context=context
            )
            
            # FIX 3: Event narratif pour le frontend
            narrative = self._build_skip_narrative(decision_reason, severity, context)
            
            await self.emit_event("decision_narrative", {
                "decision": "skip",
                "narrative": narrative,
                "severity": severity,
                "reason": decision_reason
            })
            
            await self.emit_event("run_skipped", {
                "trigger_reason": reason,
                "decision_reason": decision_reason,
                "severity": severity,
                "context_summary": {
                    "recent_changes": len(context.get("recent_changes", [])),
                    "total_new_amount": context.get("changes", {}).get("total_new_amount", 0)
                }
            })
            
            # Retour immédiat en monitoring
            self.mode = AgentMode.MONITORING
            return
        
        # Si on arrive ici: L'agent DÉCIDE d'analyser
        print(f"🤖 Agent décision: RUN ({severity}) - {decision_reason}")
        
        # FIX 3: Event narratif pour l'analyse
        narrative = self._build_run_narrative(decision_reason, severity, context)
        
        await self.emit_event("decision_narrative", {
            "decision": "run",
            "narrative": narrative,
            "severity": severity,
            "reason": decision_reason
        })
        
        self.mode = AgentMode.ANALYZING
        
        await self.emit_event("analysis_started", {
            "trigger_reason": reason,
            "decision_reason": decision_reason,
            "severity": severity,
            "auto_triggered": True
        })
        
        try:
            # Créer et lancer le run AVEC SÉVÉRITÉ (AJOUT 2)
            run = self.runner.create_run()
            await self.runner.run(context=context, severity=severity)
            
            # Sauvegarder dans la mémoire (nettoyer les types numpy)
            if self.runner.current_run:
                clean_deliverables = convert_numpy_types(self.runner.current_run.deliverables)
                self.memory.save_run(
                    run.run_id,
                    clean_deliverables,
                    trigger_reason=reason
                )
                
                # Notifier via WebSocket avec les résultats
                await self.emit_event("analysis_completed", {
                    "run_id": run.run_id,
                    "trigger_reason": reason,
                    "severity": severity,
                    "deliverables": clean_deliverables,
                    "timestamp": datetime.now().isoformat()
                })
            
            # Clear les changements du monitor
            self.monitor.clear_changes()
            
            # Retour en mode monitoring (agent autonome continue)
            self.mode = AgentMode.MONITORING
            print(f"✅ Analyse terminée - Retour en surveillance")
            
        except Exception as e:
            print(f"❌ Erreur durant l'analyse: {e}")
            self.mode = AgentMode.MONITORING
            
            await self.emit_event("analysis_error", {
                "error": str(e)
            })
    
    def _build_skip_narrative(self, reason: str, severity: str, context: Dict) -> str:
        """
        FIX 3: Construit une phrase narrative pour un skip intelligent
        """
        changes = context.get("changes", {})
        amount = changes.get("total_new_amount", 0)
        
        if "seuil" in reason.lower():
            return f"L'agent a détecté un changement de {amount/1000:.0f}K€, en-dessous du seuil d'alerte. Aucune analyse n'est nécessaire. Surveillance continue."
        
        elif "aucune modification" in reason.lower() or "aucun changement" in reason.lower():
            return f"L'agent surveille en continu. Aucune modification de données détectée. Situation stable, pas d'analyse requise."
        
        elif "mineur" in reason.lower():
            return f"L'agent a évalué le changement ({amount/1000:.0f}K€) comme mineur. Pas d'impact sur la trésorerie. Analyse non déclenchée."
        
        else:
            return f"L'agent a décidé de ne pas analyser : {reason}. Intelligence = savoir quand ne rien faire."
    
    def _build_run_narrative(self, reason: str, severity: str, context: Dict) -> str:
        """
        FIX 3: Construit une phrase narrative pour un run
        """
        changes = context.get("changes", {})
        amount = changes.get("total_new_amount", 0)
        high_risk_count = changes.get("new_high_risk_invoices", 0)
        
        if severity == "CRITICAL":
            if high_risk_count > 0:
                return f"🔴 L'agent a détecté une dégradation critique : {high_risk_count} facture(s) à risque HIGH pour {amount/1000:.0f}K€. Analyse complète en cours avec génération de recommandations DAF."
            else:
                return f"🔴 Situation critique détectée : {reason}. L'agent lance une analyse complète du portefeuille trésorerie."
        
        elif severity == "MODERATE":
            return f"🟡 L'agent a détecté un changement modéré ({amount/1000:.0f}K€). Analyse partielle en cours pour vérifier l'impact sur le forecast."
        
        else:
            return f"L'agent a décidé d'analyser : {reason}. Analyse standard en cours."
    
    async def start_autonomous_loop(self):
        """
        Démarre la boucle autonome principale
        L'agent tourne en continu
        """
        if self.running:
            print("⚠️ Boucle déjà en cours")
            return
        
        print("🚀 Démarrage boucle autonome Agent DAF")
        
        # Démarrer le monitoring
        self.monitor.start_monitoring()
        
        self.running = True
        self.mode = AgentMode.MONITORING
        
        await self.emit_event("autonomous_mode_started", {
            "check_interval": self.check_interval,
            "data_path": str(self.data_path)
        })
        
        # Lancer la boucle principale
        self.loop_task = asyncio.create_task(self._autonomous_loop())
    
    async def _autonomous_loop(self):
        """Boucle principale qui tourne en continu"""
        print("🔄 Boucle de surveillance active")
        
        while self.running:
            try:
                # Vérifier les changements en attente dans le monitor
                pending_changes = self.monitor.check_for_changes()
                if pending_changes:
                    print(f"📊 {len(pending_changes)} changements récupérés")
                    await self.monitor.on_data_changed(pending_changes)
                
                # Check périodique (même sans changement fichier)
                if self.mode == AgentMode.MONITORING:
                    # Évaluer si trigger temporel ou autre
                    await self.evaluate_and_decide()
                
                # Attendre avant prochain check
                await asyncio.sleep(self.check_interval)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"❌ Erreur boucle autonome: {e}")
                await asyncio.sleep(self.check_interval)
        
        print("⏹️ Boucle autonome arrêtée")
    
    async def stop_autonomous_loop(self):
        """Arrête la boucle autonome"""
        print("🛑 Arrêt de la boucle autonome...")
        
        self.running = False
        self.mode = AgentMode.IDLE
        
        # Réinitialiser la dernière décision
        self.last_decision = None
        
        # Arrêter le monitoring
        self.monitor.stop_monitoring()
        
        # Annuler la tâche de loop
        if self.loop_task:
            self.loop_task.cancel()
            try:
                await self.loop_task
            except asyncio.CancelledError:
                pass
        
        await self.emit_event("autonomous_mode_stopped", {})
        
        print("✅ Agent arrêté")
    
    def get_status(self) -> Dict:
        """Retourne le statut complet de l'agent autonome"""
        status = {
            "mode": self.mode,
            "running": self.running,
            "monitor": self.monitor.get_status(),
            "triggers": self.trigger_engine.get_trigger_status(),
            "memory": self.memory.get_statistics(),
            "last_decision": self.last_decision
        }
        # Nettoyer tous les NaN pour éviter erreurs JSON
        return convert_numpy_types(status)
    
    def set_runner(self, runner: AgentRunner):
        """Attache un runner pour exécuter les analyses"""
        self.runner = runner
        print("✅ Runner attaché au scheduler")

"""
Agent Runner - Orchestrateur autonome pour l'Agent DAF
Gère le workflow complet: collect -> normalize -> analyze -> project -> detect -> propose -> STOP
"""

import asyncio
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Callable, Any
from pydantic import BaseModel
import uuid


class AgentState(str, Enum):
    IDLE = "idle"
    RUNNING = "running"
    COMPLETED = "completed"
    WAITING_VALIDATION = "waiting_validation"
    ERROR = "error"


class StepStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"


class AgentStep(BaseModel):
    id: str
    name: str
    description: str
    status: StepStatus = StepStatus.PENDING
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_ms: Optional[int] = None
    output: Optional[Dict] = None
    logs: List[str] = []


class AgentRun(BaseModel):
    run_id: str
    state: AgentState = AgentState.IDLE
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    steps: List[AgentStep] = []
    current_step_index: int = 0
    deliverables: Dict[str, Any] = {}
    metadata: Dict[str, Any] = {}


# Définition des étapes du workflow DAF
WORKFLOW_STEPS = [
    {
        "id": "collect",
        "name": "Collecte des données",
        "description": "Récupération des transactions bancaires, factures clients et fournisseurs"
    },
    {
        "id": "normalize",
        "name": "Normalisation",
        "description": "Standardisation des formats et validation des données"
    },
    {
        "id": "analyze",
        "name": "Analyse trésorerie",
        "description": "Calcul de la position de trésorerie actuelle et des encours"
    },
    {
        "id": "project",
        "name": "Projections",
        "description": "Prévisions de trésorerie à 4, 8 et 13 semaines"
    },
    {
        "id": "detect",
        "name": "Détection des risques",
        "description": "Identification des tensions de cash et risques clients"
    },
    {
        "id": "propose",
        "name": "Recommandations",
        "description": "Génération du plan d'actions et de la note DG"
    },
    {
        "id": "stop",
        "name": "Validation requise",
        "description": "Attente de validation DAF avant exécution"
    }
]


class AgentRunner:
    """
    Moteur d'orchestration de l'agent DAF autonome.
    Exécute un workflow complet sans intervention humaine jusqu'au STOP.
    """
    
    def __init__(self):
        self.current_run: Optional[AgentRun] = None
        self.step_handlers: Dict[str, Callable] = {}
        self.event_callbacks: List[Callable] = []
        self.step_delay: float = 1.5  # Délai réaliste entre étapes (1-2s)
    
    def register_step_handler(self, step_id: str, handler: Callable):
        """Enregistre un handler pour une étape spécifique"""
        self.step_handlers[step_id] = handler
    
    def register_event_callback(self, callback: Callable):
        """Enregistre un callback pour les événements (WebSocket)"""
        self.event_callbacks.append(callback)
    
    def should_run(self, context: Dict) -> tuple[bool, str, str]:
        """
        AJOUT 1 — Décision AVANT le run
        
        Analyse le contexte et décide si l'agent doit se déclencher.
        Intelligence = savoir quand NE PAS agir.
        
        Returns:
            (should_run: bool, reason: str, severity: str)
            severity: "MINOR" | "MODERATE" | "CRITICAL"
        """
        # Extraire les métriques du contexte
        trigger_type = context.get("trigger_type", "unknown")
        changes = context.get("changes", {})
        memory = context.get("memory", {})
        
        # Règle 1: Premier run de la journée → toujours analyser
        last_run = memory.get("last_analysis_time")
        if not last_run:
            return True, "Premier run de surveillance", "MODERATE"
        
        # Règle 2: Changement de données → analyser le delta
        if trigger_type == "file_change":
            file_path = changes.get("file_path", "")
            
            # Factures clients → toujours critique
            if "customer_invoices" in file_path:
                num_changes = changes.get("num_lines_changed", 0)
                if num_changes == 0:
                    return False, "Aucune modification détectée", "MINOR"
                
                # Analyser la gravité des changements
                new_high_risk = changes.get("new_high_risk_invoices", 0)
                total_amount = changes.get("total_new_amount", 0)
                
                if new_high_risk > 0 or total_amount > 500000:
                    return True, f"Nouveau risque critique: {new_high_risk} factures HIGH, {total_amount/1000:.0f}K€", "CRITICAL"
                elif total_amount > 100000:
                    return True, f"Changement modéré: {total_amount/1000:.0f}K€ ajoutés", "MODERATE"
                else:
                    return False, f"Changement mineur: {total_amount/1000:.0f}K€ (seuil: 100K€)", "MINOR"
            
            # Transactions bancaires → analyser montants
            elif "bank_transactions" in file_path:
                total_amount = changes.get("total_new_amount", 0)
                if abs(total_amount) > 200000:
                    return True, f"Mouvement bancaire significatif: {total_amount/1000:.0f}K€", "MODERATE"
                else:
                    return False, f"Mouvement bancaire mineur: {total_amount/1000:.0f}K€ (seuil: 200K€)", "MINOR"
            
            # Fournisseurs → moins critique
            elif "supplier" in file_path:
                total_amount = changes.get("total_new_amount", 0)
                if total_amount > 300000:
                    return True, f"Nouvelle dette fournisseur importante: {total_amount/1000:.0f}K€", "MODERATE"
                else:
                    return False, f"Dette fournisseur mineure: {total_amount/1000:.0f}K€ (seuil: 300K€)", "MINOR"
        
        # Règle 3: Trigger temporel → vérifier si changement depuis dernier run
        elif trigger_type == "scheduled":
            # Si aucun changement de données depuis dernier run → skip
            last_data_change = memory.get("last_data_change_time")
            if last_data_change and last_data_change <= last_run:
                return False, "Aucun changement de données depuis dernière analyse", "MINOR"
            
            return True, "Analyse programmée avec données récentes", "MODERATE"
        
        # Par défaut: analyser (principe de précaution)
        return True, "Trigger non catégorisé → analyse par précaution", "MODERATE"
    
    async def emit_event(self, event_type: str, data: Dict):
        """Émet un événement vers tous les callbacks enregistrés"""
        event = {
            "type": event_type,
            "timestamp": datetime.now().isoformat(),
            "run_id": self.current_run.run_id if self.current_run else None,
            "data": data
        }
        for callback in self.event_callbacks:
            try:
                if asyncio.iscoroutinefunction(callback):
                    await callback(event)
                else:
                    callback(event)
            except Exception as e:
                print(f"Error in event callback: {e}")
    
    def create_run(self) -> AgentRun:
        """Crée une nouvelle exécution de l'agent"""
        steps = [
            AgentStep(
                id=step["id"],
                name=step["name"],
                description=step["description"]
            )
            for step in WORKFLOW_STEPS
        ]
        
        run = AgentRun(
            run_id=str(uuid.uuid4()),
            steps=steps,
            metadata={
                "created_at": datetime.now().isoformat(),
                "version": "1.0.0"
            }
        )
        
        self.current_run = run
        return run
    
    async def execute_step(self, step: AgentStep) -> Dict:
        """Exécute une étape individuelle du workflow"""
        step.status = StepStatus.RUNNING
        step.started_at = datetime.now()
        step.logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Démarrage: {step.name}")
        
        await self.emit_event("step_started", {
            "step_id": step.id,
            "step_name": step.name,
            "description": step.description
        })
        
        try:
            # Exécute le handler si enregistré
            if step.id in self.step_handlers:
                handler = self.step_handlers[step.id]
                if asyncio.iscoroutinefunction(handler):
                    result = await handler(self.current_run)
                else:
                    result = handler(self.current_run)
                step.output = result
            else:
                # Simulation par défaut si pas de handler
                await asyncio.sleep(self.step_delay)
                step.output = {"status": "simulated"}
            
            step.status = StepStatus.COMPLETED
            step.completed_at = datetime.now()
            step.duration_ms = int((step.completed_at - step.started_at).total_seconds() * 1000)
            step.logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Terminé en {step.duration_ms}ms")
            
            await self.emit_event("step_completed", {
                "step_id": step.id,
                "step_name": step.name,
                "duration_ms": step.duration_ms,
                "output": step.output
            })
            
            return step.output
            
        except Exception as e:
            step.status = StepStatus.ERROR
            step.logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] ERREUR: {str(e)}")
            
            await self.emit_event("step_error", {
                "step_id": step.id,
                "step_name": step.name,
                "error": str(e)
            })
            
            raise
    
    async def run(self, context: Optional[Dict] = None, severity: str = "CRITICAL") -> AgentRun:
        """
        AJOUT 2 — Workflow adaptatif par sévérité
        
        Lance l'exécution du workflow agent de manière intelligente:
        - MINOR: Pas de run (géré en amont par should_run)
        - MODERATE: Run partiel jusqu'à 'detect' (collect → normalize → analyze → project → detect)
        - CRITICAL: Run complet avec STOP pour validation DAF (tous les steps)
        
        Args:
            context: Contexte du trigger (optionnel)
            severity: Niveau de sévérité ("MINOR" | "MODERATE" | "CRITICAL")
        """
        if not self.current_run:
            self.create_run()
        
        self.current_run.state = AgentState.RUNNING
        self.current_run.started_at = datetime.now()
        
        # FIX 2: Intelligence metrics dans metadata
        self.current_run.metadata["severity"] = severity
        self.current_run.metadata["intelligent_decision"] = True
        self.current_run.metadata["workflow_depth"] = "partial" if severity == "MODERATE" else "complete"
        if context:
            self.current_run.metadata["trigger_context"] = {
                "trigger_type": context.get("trigger_type"),
                "changes_detected": len(context.get("recent_changes", [])),
                "total_new_amount": context.get("changes", {}).get("total_new_amount", 0)
            }
        
        # Déterminer jusqu'où exécuter selon sévérité
        # AJOUT 2: Run partiel / adaptatif
        if severity == "MODERATE":
            # Arrêt après 'detect' → pas de recommandations ni STOP
            max_step_id = "detect"
            final_state = AgentState.COMPLETED
            completion_message = "Analyse modérée terminée (pas de recommandations critiques)"
        else:  # CRITICAL
            # Run complet jusqu'à STOP
            max_step_id = "stop"
            final_state = AgentState.WAITING_VALIDATION
            completion_message = "Analyse critique terminée - Validation DAF requise"
        
        await self.emit_event("run_started", {
            "run_id": self.current_run.run_id,
            "total_steps": len(self.current_run.steps),
            "severity": severity,
            "max_step": max_step_id
        })
        
        try:
            for i, step in enumerate(self.current_run.steps):
                self.current_run.current_step_index = i
                
                # AJOUT 2: Arrêt adaptatif selon sévérité
                if severity == "MODERATE" and step.id in ["propose", "stop"]:
                    # Skip les étapes propose et stop pour risque modéré
                    step.status = StepStatus.PENDING
                    step.logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] ⏭️ SKIPPED - Sévérité modérée (pas de recommandations requises)")
                    continue
                
                # Dernière étape = STOP pour validation (uniquement si CRITICAL)
                if step.id == "stop":
                    step.status = StepStatus.COMPLETED
                    step.started_at = datetime.now()
                    step.completed_at = datetime.now()
                    step.logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] ⏸️ STOP - Validation DAF requise")
                    
                    self.current_run.state = AgentState.WAITING_VALIDATION
                    
                    await self.emit_event("validation_required", {
                        "run_id": self.current_run.run_id,
                        "deliverables": list(self.current_run.deliverables.keys()),
                        "severity": severity,
                        "message": "L'agent a terminé son analyse. Validation DAF requise avant toute action."
                    })
                    break
                
                await self.execute_step(step)
                
                # Si on a atteint le step max pour MODERATE, on arrête
                if severity == "MODERATE" and step.id == max_step_id:
                    self.current_run.state = AgentState.COMPLETED
                    self.current_run.completed_at = datetime.now()
                    
                    await self.emit_event("run_completed_moderate", {
                        "run_id": self.current_run.run_id,
                        "severity": severity,
                        "message": completion_message,
                        "steps_executed": i + 1,
                        "deliverables": list(self.current_run.deliverables.keys())
                    })
                    
                    return self.current_run
                
                # Petit délai entre les étapes pour l'effet visuel
                if i < len(self.current_run.steps) - 2:  # Pas de délai avant STOP
                    await asyncio.sleep(0.3)
            
            self.current_run.completed_at = datetime.now()
            
            await self.emit_event("run_completed", {
                "run_id": self.current_run.run_id,
                "state": self.current_run.state,
                "severity": severity,
                "total_duration_ms": int((self.current_run.completed_at - self.current_run.started_at).total_seconds() * 1000),
                "deliverables": list(self.current_run.deliverables.keys())
            })
            
        except Exception as e:
            self.current_run.state = AgentState.ERROR
            await self.emit_event("run_error", {
                "run_id": self.current_run.run_id,
                "error": str(e)
            })
            raise
        
        return self.current_run
    
    async def resume_after_validation(self, decision: Dict) -> Dict:
        """
        AJOUT 3 — Reprise post-validation (capacité d'action gouvernée)
        
        Après WAITING_VALIDATION, le DAF peut valider/rejeter les actions.
        L'agent reprend alors et EXÉCUTE les actions approuvées.
        
        Intelligence autonome SOUS CONTRÔLE HUMAIN = vrai agent.
        
        Args:
            decision: {
                "approved": bool,
                "approved_actions": List[str],  # IDs des actions validées
                "daf_comments": str,
                "execution_mode": "immediate" | "scheduled"
            }
        
        Returns:
            {
                "status": "executed" | "rejected" | "partially_executed",
                "executed_actions": List[Dict],
                "failed_actions": List[Dict],
                "message": str
            }
        """
        if not self.current_run:
            return {
                "status": "error",
                "message": "Aucun run actif à reprendre"
            }
        
        if self.current_run.state != AgentState.WAITING_VALIDATION:
            return {
                "status": "error",
                "message": f"Run dans état {self.current_run.state}, pas en attente de validation"
            }
        
        approved = decision.get("approved", False)
        approved_actions = decision.get("approved_actions", [])
        daf_comments = decision.get("daf_comments", "")
        execution_mode = decision.get("execution_mode", "immediate")
        
        await self.emit_event("validation_received", {
            "run_id": self.current_run.run_id,
            "approved": approved,
            "num_approved_actions": len(approved_actions),
            "daf_comments": daf_comments,
            "execution_mode": execution_mode
        })
        
        # Cas 1: Rejet total
        if not approved or len(approved_actions) == 0:
            self.current_run.state = AgentState.COMPLETED
            self.current_run.metadata["validation_status"] = "rejected"
            self.current_run.metadata["daf_comments"] = daf_comments
            
            await self.emit_event("validation_rejected", {
                "run_id": self.current_run.run_id,
                "reason": daf_comments
            })
            
            return {
                "status": "rejected",
                "message": "Actions rejetées par le DAF",
                "executed_actions": [],
                "failed_actions": []
            }
        
        # Cas 2: Validation (totale ou partielle)
        self.current_run.state = AgentState.RUNNING
        executed_actions = []
        failed_actions = []
        
        await self.emit_event("execution_started", {
            "run_id": self.current_run.run_id,
            "num_actions": len(approved_actions),
            "execution_mode": execution_mode
        })
        
        # Récupérer les actions du run
        actions = self.current_run.deliverables.get("actions", [])
        
        for action_data in actions:
            action_id = action_data.get("id") or action_data.get("action")
            
            # Vérifier si cette action est approuvée
            if action_id not in approved_actions:
                continue
            
            try:
                # SIMULATION d'exécution (en prod: appels API, mails, etc.)
                await asyncio.sleep(0.5)  # Simule action
                
                executed_actions.append({
                    "action_id": action_id,
                    "action": action_data.get("action"),
                    "category": action_data.get("category"),
                    "status": "executed",
                    "executed_at": datetime.now().isoformat()
                })
                
                await self.emit_event("action_executed", {
                    "run_id": self.current_run.run_id,
                    "action_id": action_id,
                    "action": action_data.get("action")
                })
                
            except Exception as e:
                failed_actions.append({
                    "action_id": action_id,
                    "action": action_data.get("action"),
                    "error": str(e)
                })
                
                await self.emit_event("action_failed", {
                    "run_id": self.current_run.run_id,
                    "action_id": action_id,
                    "error": str(e)
                })
        
        # Finaliser le run
        self.current_run.state = AgentState.COMPLETED
        self.current_run.completed_at = datetime.now()
        self.current_run.metadata["validation_status"] = "approved"
        self.current_run.metadata["daf_comments"] = daf_comments
        self.current_run.metadata["executed_actions"] = len(executed_actions)
        self.current_run.metadata["failed_actions"] = len(failed_actions)
        
        status = "executed" if len(failed_actions) == 0 else "partially_executed"
        
        await self.emit_event("execution_completed", {
            "run_id": self.current_run.run_id,
            "status": status,
            "executed": len(executed_actions),
            "failed": len(failed_actions)
        })
        
        return {
            "status": status,
            "message": f"{len(executed_actions)} actions exécutées, {len(failed_actions)} échecs",
            "executed_actions": executed_actions,
            "failed_actions": failed_actions
        }
    
    def add_deliverable(self, key: str, value: Any):
        """Ajoute un livrable à l'exécution courante"""
        if self.current_run:
            self.current_run.deliverables[key] = value
    
    def get_run_status(self) -> Optional[Dict]:
        """Retourne le statut actuel de l'exécution"""
        if not self.current_run:
            return None
        
        return {
            "run_id": self.current_run.run_id,
            "state": self.current_run.state,
            "current_step": self.current_run.current_step_index,
            "total_steps": len(self.current_run.steps),
            "steps": [
                {
                    "id": s.id,
                    "name": s.name,
                    "status": s.status,
                    "duration_ms": s.duration_ms
                }
                for s in self.current_run.steps
            ],
            "deliverables": list(self.current_run.deliverables.keys())
        }

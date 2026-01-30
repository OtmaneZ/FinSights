"""
Agent Triggers - Règles de déclenchement intelligentes
Détermine QUAND et POURQUOI l'agent doit agir
"""

from dataclasses import dataclass
from typing import Callable, List, Dict, Optional
from datetime import datetime, time, timedelta
from enum import Enum


class TriggerPriority(int, Enum):
    CRITICAL = 1
    HIGH = 2
    NORMAL = 3
    LOW = 4


@dataclass
class TriggerRule:
    """Règle de déclenchement d'analyse"""
    id: str
    name: str
    description: str
    condition: Callable  # Fonction async qui retourne bool
    priority: TriggerPriority
    cooldown_hours: int = 24  # Éviter déclenchements trop fréquents
    enabled: bool = True


class TriggerEngine:
    """
    Moteur de décision : Évalue si l'agent doit se déclencher
    """
    
    def __init__(self):
        self.rules: List[TriggerRule] = []
        self.last_triggers: Dict[str, datetime] = {}
        self.trigger_history: List[Dict] = []
    
    def register_rule(self, rule: TriggerRule):
        """Enregistre une règle de déclenchement"""
        self.rules.append(rule)
        print(f"✅ Règle enregistrée: {rule.name} (P{rule.priority})")
    
    def is_in_cooldown(self, rule: TriggerRule) -> bool:
        """Vérifie si la règle est en cooldown"""
        if rule.id not in self.last_triggers:
            return False
        
        last_trigger = self.last_triggers[rule.id]
        cooldown_end = last_trigger + timedelta(hours=rule.cooldown_hours)
        return datetime.now() < cooldown_end
    
    async def evaluate(self, context: Dict) -> Optional[Dict]:
        """
        Évalue toutes les règles et décide si déclenchement nécessaire
        Retourne: Dict avec trigger_rule, reason, priority
        """
        # Trier par priorité (CRITICAL d'abord)
        sorted_rules = sorted(
            [r for r in self.rules if r.enabled],
            key=lambda r: r.priority
        )
        
        for rule in sorted_rules:
            # Vérifier cooldown
            if self.is_in_cooldown(rule):
                continue
            
            try:
                # Évaluer la condition
                should_trigger = await rule.condition(context)
                
                if should_trigger:
                    # Marquer le déclenchement
                    self.last_triggers[rule.id] = datetime.now()
                    
                    trigger_event = {
                        "rule_id": rule.id,
                        "rule_name": rule.name,
                        "priority": rule.priority,
                        "timestamp": datetime.now().isoformat(),
                        "context": context
                    }
                    
                    self.trigger_history.append(trigger_event)
                    
                    print(f"🔔 Trigger activé: {rule.name} (P{rule.priority})")
                    
                    return trigger_event
                    
            except Exception as e:
                print(f"❌ Erreur évaluation règle {rule.name}: {e}")
        
        return None
    
    def get_trigger_status(self) -> Dict:
        """Retourne le statut des triggers"""
        return {
            "total_rules": len(self.rules),
            "enabled_rules": len([r for r in self.rules if r.enabled]),
            "last_trigger": self.trigger_history[-1] if self.trigger_history else None,
            "cooldowns": {
                rule_id: (
                    self.last_triggers[rule_id] + 
                    timedelta(hours=next(r.cooldown_hours for r in self.rules if r.id == rule_id))
                ).isoformat()
                for rule_id in self.last_triggers
            }
        }


# ============== RÈGLES PRÉDÉFINIES ==============

async def rule_daily_schedule(context: Dict) -> bool:
    """Déclenchement quotidien planifié (8h du matin)"""
    now = datetime.now()
    target_hour = context.get("daily_run_hour", 8)
    
    # Vérifie si on est à l'heure cible (avec tolérance 5 min)
    if now.hour == target_hour and now.minute < 5:
        # Vérifier qu'on n'a pas déjà run aujourd'hui
        last_run = context.get("last_run_date")
        if last_run:
            last_run_date = datetime.fromisoformat(last_run).date()
            if last_run_date == now.date():
                return False
        return True
    
    return False


async def rule_balance_critical(context: Dict) -> bool:
    """Déclenchement si solde sous seuil critique"""
    balance = context.get("current_balance", 0)
    critical_threshold = context.get("critical_threshold", 500000)
    
    return balance < critical_threshold


async def rule_new_critical_invoice(context: Dict) -> bool:
    """Déclenchement si nouvelle facture critique détectée"""
    changes = context.get("recent_changes", [])
    
    for change in changes:
        if change.get("severity") == "critical":
            # Vérifier si c'est lié à une facture
            if "invoice" in str(change.get("details", "")).lower():
                return True
    
    return False


async def rule_overdue_threshold(context: Dict) -> bool:
    """Déclenchement si facture dépasse 120 jours de retard"""
    changes = context.get("recent_changes", [])
    
    for change in changes:
        details = change.get("details", {})
        days_overdue = details.get("days_overdue", 0)
        
        if days_overdue > 120:
            return True
    
    return False


async def rule_runway_low(context: Dict) -> bool:
    """Déclenchement si runway < 90 jours"""
    runway = context.get("cash_runway_days", 180)
    return runway < 90


async def rule_significant_data_volume(context: Dict) -> bool:
    """Déclenchement si beaucoup de changements accumulés"""
    changes = context.get("recent_changes", [])
    return len(changes) >= 5


async def rule_forecast_degradation(context: Dict) -> bool:
    """Déclenchement si prévision se dégrade significativement"""
    last_forecast = context.get("last_forecast_balance", 0)
    current_forecast = context.get("current_forecast_balance", 0)
    
    if last_forecast > 0:
        degradation = (last_forecast - current_forecast) / last_forecast
        return degradation > 0.15  # 15% de dégradation
    
    return False


def create_default_triggers() -> List[TriggerRule]:
    """Crée les règles de déclenchement par défaut"""
    return [
        TriggerRule(
            id="daily_8am",
            name="Run quotidien planifié",
            description="Analyse automatique tous les jours à 8h",
            condition=rule_daily_schedule,
            priority=TriggerPriority.NORMAL,
            cooldown_hours=23  # Une fois par jour
        ),
        
        TriggerRule(
            id="balance_critical",
            name="Solde critique",
            description="Solde sous seuil critique détecté",
            condition=rule_balance_critical,
            priority=TriggerPriority.CRITICAL,
            cooldown_hours=6  # Re-check après 6h
        ),
        
        TriggerRule(
            id="new_critical_invoice",
            name="Facture critique détectée",
            description="Nouvelle facture avec statut critique",
            condition=rule_new_critical_invoice,
            priority=TriggerPriority.CRITICAL,
            cooldown_hours=1  # Analyse immédiate si critique
        ),
        
        TriggerRule(
            id="overdue_120_days",
            name="Retard > 120 jours",
            description="Facture dépassant 120 jours de retard",
            condition=rule_overdue_threshold,
            priority=TriggerPriority.HIGH,
            cooldown_hours=12
        ),
        
        TriggerRule(
            id="runway_low",
            name="Runway < 90 jours",
            description="Trésorerie inférieure à 90 jours",
            condition=rule_runway_low,
            priority=TriggerPriority.HIGH,
            cooldown_hours=24
        ),
        
        TriggerRule(
            id="data_volume",
            name="Volume de changements significatif",
            description="Accumulation de changements nécessitant analyse",
            condition=rule_significant_data_volume,
            priority=TriggerPriority.NORMAL,
            cooldown_hours=12
        ),
        
        TriggerRule(
            id="forecast_degradation",
            name="Dégradation forecast",
            description="Prévisions se dégradent de >15%",
            condition=rule_forecast_degradation,
            priority=TriggerPriority.HIGH,
            cooldown_hours=12
        ),
    ]

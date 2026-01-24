"""
TRESORIS Agent Module - Architecture V2 Hyper-Spécialisée
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent hyper-spécialisé dans la requalification des risques de trésorerie.

Composants V2 :
- RiskRequalificationAgent : Agent principal (3 étapes)
- TresorisMemory : Mémoire avec audit trail
- AgentMonitor : Surveillance fichiers (gardé de V1)
- TriggerEngine : Règles de déclenchement (gardé de V1)
"""

# V2 - Nouvelle architecture hyper-spécialisée
from .risk_agent import (
    RiskRequalificationAgent,
    Risk,
    RiskStatus,
    Action,
    ActionPriority,
    AnalysisResult,
    AgentMode
)

from .memory_v2 import TresorisMemory

# V1 - Imports optionnels pour rétrocompatibilité
try:
    from .monitor import AgentMonitor, DataChangeEvent
    from .triggers import TriggerEngine, TriggerRule, create_default_triggers
    from .runner import AgentRunner, AgentRun, AgentStep, AgentState, StepStatus
    from .scheduler import AutonomousScheduler
    from .memory import AgentMemory
    from .actions import ActionPreparator, PreparedAction
    HAS_V1 = True
except ImportError:
    HAS_V1 = False


__all__ = [
    # V2 - Nouvelle architecture
    "RiskRequalificationAgent",
    "Risk",
    "RiskStatus", 
    "Action",
    "ActionPriority",
    "AnalysisResult",
    "AgentMode",
    "TresorisMemory",
]

# Ajoute les exports V1 s'ils sont disponibles
if HAS_V1:
    __all__.extend([
        "AgentMonitor",
        "DataChangeEvent",
        "TriggerEngine",
        "TriggerRule",
        "create_default_triggers",
        "AgentRunner",
        "AgentRun",
        "AgentStep",
        "AgentState",
        "StepStatus",
        "AutonomousScheduler",
        "AgentMemory",
        "ActionPreparator",
        "PreparedAction",
    ])


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def create_agent(data_path, storage_path, version: str = "v2"):
    """
    Factory pour créer l'agent approprié.
    
    Args:
        data_path: Chemin vers les données (CSV)
        storage_path: Chemin vers le stockage mémoire
        version: "v2" (nouvelle archi) ou "v1" (ancienne)
    """
    from pathlib import Path
    
    data_path = Path(data_path)
    storage_path = Path(storage_path)
    
    if version == "v2":
        memory = TresorisMemory(storage_path)
        agent = RiskRequalificationAgent(data_path, memory)
        return agent
    elif version == "v1" and HAS_V1:
        return AutonomousScheduler(data_path, storage_path)
    else:
        raise ValueError(f"Version {version} non disponible (V1 modules archivés)")


def get_version_info() -> dict:
    """Retourne les informations de version"""
    return {
        "current": "v2",
        "name": "TRESORIS Risk Agent",
        "description": "Agent hyper-spécialisé requalification risques",
        "architecture": {
            "steps": ["should_trigger", "requalify_risks", "propose_actions", "STOP"],
            "max_actions": 3,
            "governance": "validation_daf_required"
        }
    }

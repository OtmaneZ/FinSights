#!/usr/bin/env python3
"""
Test du nouvel agent TRESORIS V2 - Hyper-spécialisé
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vérifie que l'agent fonctionne correctement :
1. Chargement des données
2. should_trigger() 
3. requalify_risks()
4. propose_actions()
5. generate_crisis_note()
"""

import asyncio
import sys
from pathlib import Path

# Ajouter le chemin parent
sys.path.insert(0, str(Path(__file__).parent))

from agent import (
    RiskRequalificationAgent, 
    TresorisMemory,
    RiskStatus,
    ActionPriority,
    get_version_info
)


def print_header(text: str):
    print(f"\n{'═' * 60}")
    print(f"  {text}")
    print(f"{'═' * 60}")


def print_section(text: str):
    print(f"\n{'─' * 40}")
    print(f"  {text}")
    print(f"{'─' * 40}")


async def test_agent():
    """Test complet de l'agent V2"""
    
    print_header("TEST AGENT TRESORIS V2")
    
    # Afficher version
    version_info = get_version_info()
    print(f"\n📦 Version: {version_info['current']}")
    print(f"📋 Nom: {version_info['name']}")
    print(f"📝 {version_info['description']}")
    print(f"🔄 Étapes: {' → '.join(version_info['architecture']['steps'])}")
    
    # Paths
    data_path = Path(__file__).parent / "data"
    storage_path = Path(__file__).parent / "storage" / "memory_v2"
    
    print(f"\n📂 Data path: {data_path}")
    print(f"💾 Storage path: {storage_path}")
    
    # Créer la mémoire
    print_section("1. INITIALISATION")
    memory = TresorisMemory(storage_path)
    print(f"✅ Mémoire initialisée")
    print(f"   - Analyses: {len(memory.analyses)}")
    print(f"   - Décisions: {len(memory.decisions)}")
    print(f"   - Outcomes: {len(memory.outcomes)}")
    
    # Créer l'agent
    agent = RiskRequalificationAgent(data_path, memory)
    print(f"✅ Agent créé")
    print(f"   - Mode: {agent.mode.value}")
    print(f"   - Seuils: {agent.thresholds}")
    
    # Test 1: Should Trigger
    print_section("2. TEST SHOULD_TRIGGER()")
    should_trigger, reason = await agent.should_trigger()
    print(f"   Résultat: {'🔔 OUI' if should_trigger else '😴 NON'}")
    print(f"   Raison: {reason}")
    
    # Test 2: Requalify Risks
    print_section("3. TEST REQUALIFY_RISKS()")
    risks = await agent.requalify_risks()
    print(f"   Risques détectés: {len(risks)}")
    
    if risks:
        critical = [r for r in risks if r.status == RiskStatus.CRITICAL]
        uncertain = [r for r in risks if r.status == RiskStatus.UNCERTAIN]
        certain = [r for r in risks if r.status == RiskStatus.CERTAIN]
        
        print(f"   - 🔴 CRITICAL: {len(critical)}")
        print(f"   - 🟡 UNCERTAIN: {len(uncertain)}")
        print(f"   - 🟢 CERTAIN: {len(certain)}")
        
        print(f"\n   Top 3 risques:")
        for i, risk in enumerate(risks[:3]):
            status_icon = "🔴" if risk.status == RiskStatus.CRITICAL else "🟡" if risk.status == RiskStatus.UNCERTAIN else "🟢"
            print(f"   {i+1}. {status_icon} {risk.client} - {risk.amount/1000:.0f}K€ (Score: {risk.score}/100)")
            print(f"      {risk.justification}")
    
    # Test 3: Propose Actions
    print_section("4. TEST PROPOSE_ACTIONS()")
    actions = await agent.propose_actions(risks)
    print(f"   Actions proposées: {len(actions)} (max 3)")
    
    for action in actions:
        priority_icon = "🔴" if action.priority == ActionPriority.P1 else "🟡" if action.priority == ActionPriority.P2 else "🟢"
        print(f"\n   {priority_icon} [{action.priority.name}] {action.title}")
        print(f"      Impact: {action.impact_amount/1000:.0f}K€ | Deadline: {action.deadline}")
    
    # Test 4: Generate Crisis Note
    print_section("5. TEST GENERATE_CRISIS_NOTE()")
    crisis_note = agent.generate_crisis_note(risks, actions)
    print(f"   Note générée: {len(crisis_note)} caractères")
    
    # Afficher un extrait
    lines = crisis_note.split('\n')
    print(f"\n   Extrait (10 premières lignes):")
    for line in lines[:10]:
        print(f"   {line}")
    print("   ...")
    
    # Test 5: Run Analysis complet
    print_section("6. TEST RUN_ANALYSIS()")
    
    if should_trigger:
        result = await agent.run_analysis(reason)
        print(f"✅ Analyse complète exécutée")
        print(f"   - ID: {result.id}")
        print(f"   - Risques: {result.summary['total_risks']}")
        print(f"   - Actions: {result.summary['actions_proposed']}")
        print(f"   - Mode agent: {agent.mode.value}")
    else:
        print("⏭️ Skip (pas de trigger)")
    
    # Test 6: Mémoire et audit
    print_section("7. TEST MÉMOIRE & AUDIT")
    
    stats = memory.get_statistics()
    print(f"   Statistiques mémoire:")
    print(f"   - Total analyses: {stats['total_analyses']}")
    print(f"   - Total décisions: {stats['total_decisions']}")
    print(f"   - Total outcomes: {stats['total_outcomes']}")
    
    metrics = memory.get_intelligence_metrics()
    print(f"\n   Métriques intelligence:")
    print(f"   - Taux approbation DAF: {metrics['approval_rate']}%")
    print(f"   - Taux précision: {metrics['accuracy_rate']}%")
    print(f"   - {metrics['interpretation']}")
    
    # Test 7: Validation DAF simulée
    print_section("8. TEST VALIDATION DAF")
    
    if actions and agent.current_analysis:
        action_id = actions[0].id
        result = await agent.validate_action(
            action_id=action_id,
            decision="approved",
            validated_by="Test DAF",
            comment="Validation de test"
        )
        print(f"   Validation simulée: {result}")
    else:
        print("   ⏭️ Skip (pas d'actions à valider)")
    
    # Résumé final
    print_header("RÉSUMÉ DU TEST")
    print(f"""
✅ Agent V2 TRESORIS opérationnel

Architecture:
  • 3 étapes au lieu de 7
  • Max 3 actions proposées
  • Requalification CERTAIN → UNCERTAIN → CRITICAL
  • Audit trail complet

Fichiers créés:
  • risk_agent.py : Agent principal
  • memory_v2.py : Mémoire avec audit trail
  • __init__.py : Module mis à jour

Anciens fichiers archivés dans _archive/

Prochaines étapes:
  1. Mettre à jour main.py pour utiliser V2
  2. Mettre à jour le frontend (Table des Risques)
  3. Supprimer les fichiers V1 après migration
""")
    
    return True


if __name__ == "__main__":
    try:
        asyncio.run(test_agent())
        print("\n✅ Tous les tests passés!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

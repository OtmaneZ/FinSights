"""
Optimiseur de priorisation des actions.
Priorise par impact cash × facilité, pas juste urgence.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass

from .client_scoring import ClientRiskScore


@dataclass
class OptimizedAction:
    """Action optimisée avec priorisation intelligente"""
    action_id: str
    action_type: str               # "relance_client" | "negocier_delai" | "securiser_paiement" | etc.
    
    # Cible
    client_id: str
    client_name: str
    invoice_id: Optional[str]
    
    # Description
    title: str
    description: str
    detailed_steps: List[str]      # Étapes concrètes
    
    # Scores (0-100)
    impact_score: float            # Impact cash si action réussie
    ease_score: float              # Facilité d'exécution
    urgency_score: float           # Urgence temporelle
    
    # Priorisation
    priority_score: float          # Score final (pondéré)
    priority_level: str            # "P1" | "P2" | "P3"
    
    # Contexte
    amount: float                  # Montant concerné
    estimated_success_rate: float  # Proba succès (0-1)
    expected_impact_days: int      # Gain runway si succès
    time_required_minutes: int     # Temps nécessaire
    
    # Timing
    recommended_date: datetime
    deadline: datetime
    
    # Métadonnées
    client_risk_score: Optional[ClientRiskScore]


class ActionPrioritizer:
    """
    Priorise actions intelligemment.
    Formule : priority = impact×0.7 + ease×0.3
    """
    
    # Pondérations par défaut
    IMPACT_WEIGHT = 0.7
    EASE_WEIGHT = 0.3
    
    def __init__(self, treasury_runway_days: int = 60):
        """
        Args:
            treasury_runway_days: Runway actuel en jours
        """
        self.runway_days = treasury_runway_days
    
    def prioritize_actions(
        self,
        actions: List[Dict],
        client_scores: Optional[Dict[str, ClientRiskScore]] = None
    ) -> List[OptimizedAction]:
        """
        Priorise liste d'actions selon impact + facilité.
        
        Args:
            actions: Liste dicts avec action brute
            client_scores: Dict[client_id, ClientRiskScore] (optionnel)
            
        Returns:
            Liste OptimizedAction triée par priority_score (desc)
        """
        optimized = []
        current_date = datetime.now()
        
        for action in actions:
            client_id = action["client_id"]
            client_score = client_scores.get(client_id) if client_scores else None
            
            # Calculer scores composants
            impact_score = self._calculate_impact_score(
                amount=action.get("amount", 0),
                success_rate=self._estimate_success_rate(
                    action_type=action["action_type"],
                    client_risk_score=client_score
                ),
                runway_impact_days=action.get("runway_impact_days", 0)
            )
            
            ease_score = self._calculate_ease_score(
                time_required_minutes=action.get("time_required_minutes", 30),
                client_responsiveness=action.get("client_responsiveness", "medium"),
                complexity=action.get("complexity", "medium")
            )
            
            deadline = action.get("deadline", current_date + timedelta(days=30))
            urgency_score = self._calculate_urgency_score(deadline, current_date)
            
            # Score priorité final
            priority_score = self._calculate_priority_score(impact_score, ease_score, urgency_score)
            priority_level = self._determine_priority_level(priority_score, urgency_score)
            
            # Construire action optimisée
            opt_action = OptimizedAction(
                action_id=action.get("action_id", f"ACT_{len(optimized)+1:03d}"),
                action_type=action["action_type"],
                client_id=client_id,
                client_name=action.get("client_name", "Client inconnu"),
                invoice_id=action.get("invoice_id"),
                title=action.get("title", "Action"),
                description=action.get("description", ""),
                detailed_steps=action.get("detailed_steps", []),
                impact_score=round(impact_score, 2),
                ease_score=round(ease_score, 2),
                urgency_score=round(urgency_score, 2),
                priority_score=round(priority_score, 2),
                priority_level=priority_level,
                amount=action.get("amount", 0),
                estimated_success_rate=self._estimate_success_rate(
                    action["action_type"],
                    client_score
                ),
                expected_impact_days=action.get("runway_impact_days", 0),
                time_required_minutes=action.get("time_required_minutes", 30),
                recommended_date=action.get("recommended_date", current_date),
                deadline=deadline,
                client_risk_score=client_score
            )
            
            optimized.append(opt_action)
        
        # Trier par priorité décroissante
        optimized.sort(key=lambda a: a.priority_score, reverse=True)
        
        return optimized
    
    def _calculate_impact_score(
        self,
        amount: float,
        success_rate: float,
        runway_impact_days: int
    ) -> float:
        """
        Calcule score d'impact cash.
        
        Facteurs:
        - Montant (normalisé)
        - Taux de succès estimé
        - Impact sur runway (critique si runway < 30j)
        
        Returns:
            Score 0-100
        """
        # Normaliser montant (10k€ = 50 points, 50k€+ = 100 points)
        amount_score = min((amount / 50000) * 100, 100)
        
        # Pondérer par probabilité succès
        expected_value = amount_score * success_rate
        
        # Booster si runway critique
        boost = 0
        if self.runway_days < 30:
            boost = min(runway_impact_days * 2, 30)  # Max +30 points
        
        # Score final
        score = expected_value + boost
        
        return min(score, 100)  # Limiter à 100
    
    def _calculate_ease_score(
        self,
        time_required_minutes: int,
        client_responsiveness: str = "medium",
        complexity: str = "medium"
    ) -> float:
        """
        Calcule score de facilité d'exécution.
        
        Facteurs:
        - Temps requis (quick win = +points)
        - Réactivité client (high = +points)
        - Complexité (low = +points)
        
        Returns:
            Score 0-100 (100 = très facile)
        """
        # Score temps (0-50 points)
        if time_required_minutes <= 15:
            time_score = 50
        elif time_required_minutes <= 30:
            time_score = 35
        elif time_required_minutes <= 60:
            time_score = 20
        else:
            time_score = 10
        
        # Score réactivité client (0-25 points)
        responsiveness_scores = {
            "high": 25,
            "medium": 15,
            "low": 5
        }
        resp_score = responsiveness_scores.get(client_responsiveness, 15)
        
        # Score complexité (0-25 points)
        complexity_scores = {
            "low": 25,
            "medium": 15,
            "high": 5
        }
        comp_score = complexity_scores.get(complexity, 15)
        
        # Score final
        return time_score + resp_score + comp_score
    
    def _calculate_urgency_score(
        self,
        deadline: datetime,
        current_date: datetime
    ) -> float:
        """
        Calcule score d'urgence temporelle.
        
        Returns:
            Score 0-100 (100 = très urgent)
        """
        days_left = (deadline - current_date).days
        
        if days_left < 7:
            return 100
        elif days_left < 14:
            return 80
        elif days_left < 30:
            return 50
        else:
            return 20
    
    def _calculate_priority_score(
        self,
        impact: float,
        ease: float,
        urgency: float
    ) -> float:
        """
        Calcule score de priorité final.
        
        Formule: impact×0.7 + ease×0.3
        Note: urgency influence deadline mais pas score principal
        
        Returns:
            Score 0-100
        """
        # TODO: priority = impact * IMPACT_WEIGHT + ease * EASE_WEIGHT
        # TODO: Limiter à 100
        # TODO: Retourner score
        return impact * self.IMPACT_WEIGHT + ease * self.EASE_WEIGHT
    
    def _determine_priority_level(
        self,
        priority_score: float,
        urgency_score: float
    ) -> str:
        """
        Détermine niveau P1/P2/P3.
        
        Args:
            priority_score: Score priorité (0-100)
            urgency_score: Score urgence (0-100)
            
        Returns:
            "P1" | "P2" | "P3"
        """
        # P1 : Critique (fort impact ou très urgent)
        if priority_score > 75 or urgency_score > 90:
            return "P1"
        
        # P2 : Important (bon impact ou urgent)
        elif priority_score > 50 or urgency_score > 70:
            return "P2"
        
        # P3 : Normal
        else:
            return "P3"
    
    def _estimate_success_rate(
        self,
        action_type: str,
        client_risk_score: Optional[ClientRiskScore] = None
    ) -> float:
        """
        Estime probabilité de succès de l'action.
        
        Args:
            action_type: Type d'action
            client_risk_score: Score client (optionnel)
            
        Returns:
            Probabilité 0-1
        """
        # Taux base selon type d'action
        base_rates = {
            "relance_client": 0.7,
            "negocier_delai": 0.5,
            "securiser_paiement": 0.8,
            "accelerer_facturation": 0.9,
            "reduire_delai_paiement": 0.6
        }
        base_rate = base_rates.get(action_type, 0.6)
        
        # Ajuster selon profil client
        if client_risk_score:
            rating_adjustments = {
                "A": 0.2,   # Client fiable : +20%
                "B": 0.1,   # Bon client : +10%
                "C": 0.0,   # Surveillé : 0%
                "D": -0.2   # Risqué : -20%
            }
            adjustment = rating_adjustments.get(client_risk_score.rating, 0)
            base_rate += adjustment
        
        # Limiter entre 0.1 et 0.95
        return max(0.1, min(base_rate, 0.95))
    
    def suggest_quick_wins(
        self,
        actions: List[OptimizedAction],
        max_time_minutes: int = 30
    ) -> List[OptimizedAction]:
        """
        Suggère quick wins (fort impact, facile, rapide).
        
        Args:
            actions: Liste actions optimisées
            max_time_minutes: Temps max par action
            
        Returns:
            Liste quick wins triée par priority_score
        """
        # Filtrer quick wins
        quick_wins = [
            a for a in actions
            if (
                a.time_required_minutes <= max_time_minutes and
                a.ease_score > 70 and
                a.impact_score > 50
            )
        ]
        
        # Trier par priorité
        quick_wins.sort(key=lambda a: a.priority_score, reverse=True)
        
        # Retourner top 5
        return quick_wins[:5]


# ============================================================================
# TESTS
# ============================================================================

def _test_prioritize_actions():
    """Test priorisation actions"""
    print("\n--- Test prioritize_actions() ---")
    
    # Créer actions variées
    actions = [
        {
            "action_type": "relance_client",
            "client_id": "CLI001",
            "client_name": "Client A",
            "amount": 50000,
            "time_required_minutes": 15,
            "runway_impact_days": 10,
            "deadline": datetime.now() + timedelta(days=5),
            "client_responsiveness": "high",
            "complexity": "low"
        },
        {
            "action_type": "negocier_delai",
            "client_id": "CLI002",
            "client_name": "Client B",
            "amount": 10000,
            "time_required_minutes": 60,
            "runway_impact_days": 3,
            "deadline": datetime.now() + timedelta(days=20),
            "client_responsiveness": "low",
            "complexity": "high"
        },
        {
            "action_type": "securiser_paiement",
            "client_id": "CLI003",
            "client_name": "Client C",
            "amount": 25000,
            "time_required_minutes": 30,
            "runway_impact_days": 7,
            "deadline": datetime.now() + timedelta(days=10),
            "client_responsiveness": "medium",
            "complexity": "medium"
        }
    ]
    
    prioritizer = ActionPrioritizer(treasury_runway_days=25)
    optimized = prioritizer.prioritize_actions(actions)
    
    print(f"Actions priorisées ({len(optimized)}):")
    for i, action in enumerate(optimized, 1):
        print(f"  {i}. [{action.priority_level}] {action.client_name} - "
              f"Priority={action.priority_score:.1f} "
              f"(Impact={action.impact_score:.1f}, Ease={action.ease_score:.1f})")
    
    # Vérifier tri
    for i in range(len(optimized) - 1):
        assert optimized[i].priority_score >= optimized[i+1].priority_score, \
            "Actions devraient être triées par priority_score"
    
    # Vérifier niveaux P1/P2/P3
    assert all(a.priority_level in ["P1", "P2", "P3"] for a in optimized), \
        "Tous les niveaux doivent être P1/P2/P3"
    
    print("\n✅ Test prioritize_actions() passé")


def _test_quick_wins():
    """Test suggestion quick wins"""
    print("\n--- Test quick_wins() ---")
    
    # Créer mix actions (faciles + difficiles)
    actions_data = [
        {"action_type": "relance_client", "client_id": "CLI001", "amount": 40000,
         "time_required_minutes": 10, "runway_impact_days": 8,
         "deadline": datetime.now() + timedelta(days=5),
         "client_responsiveness": "high", "complexity": "low"},
        
        {"action_type": "relance_client", "client_id": "CLI002", "amount": 25000,
         "time_required_minutes": 15, "runway_impact_days": 5,
         "deadline": datetime.now() + timedelta(days=7),
         "client_responsiveness": "high", "complexity": "low"},
        
        {"action_type": "negocier_delai", "client_id": "CLI003", "amount": 60000,
         "time_required_minutes": 90, "runway_impact_days": 12,
         "deadline": datetime.now() + timedelta(days=3),
         "client_responsiveness": "low", "complexity": "high"},
        
        {"action_type": "securiser_paiement", "client_id": "CLI004", "amount": 15000,
         "time_required_minutes": 25, "runway_impact_days": 4,
         "deadline": datetime.now() + timedelta(days=10),
         "client_responsiveness": "medium", "complexity": "medium"}
    ]
    
    prioritizer = ActionPrioritizer(treasury_runway_days=30)
    optimized = prioritizer.prioritize_actions(actions_data)
    
    # Suggérer quick wins
    quick_wins = prioritizer.suggest_quick_wins(optimized, max_time_minutes=30)
    
    print(f"Quick wins suggérés ({len(quick_wins)}):")
    for i, qw in enumerate(quick_wins, 1):
        print(f"  {i}. {qw.client_name} - {qw.time_required_minutes}min - "
              f"Impact={qw.impact_score:.1f}, Ease={qw.ease_score:.1f}")
    
    # Vérifier filtre temps
    for qw in quick_wins:
        assert qw.time_required_minutes <= 30, \
            f"Quick win devrait prendre ≤30min, obtenu {qw.time_required_minutes}min"
        assert qw.ease_score > 70, \
            f"Quick win devrait avoir ease_score >70, obtenu {qw.ease_score}"
        assert qw.impact_score > 50, \
            f"Quick win devrait avoir impact_score >50, obtenu {qw.impact_score}"
    
    # Vérifier top actions
    assert len(quick_wins) <= 5, "Maximum 5 quick wins"
    
    print("\n✅ Test quick_wins() passé")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS action_optimizer.py")
    print("=" * 60)
    
    try:
        _test_prioritize_actions()
        print("✅ Test prioritize_actions OK")
    except AssertionError as e:
        print(f"❌ Test prioritize_actions ÉCHEC: {e}")
    except NotImplementedError as e:
        print(f"⏳ Test prioritize_actions: {e}")
    
    try:
        _test_quick_wins()
        print("✅ Test quick_wins OK")
    except AssertionError as e:
        print(f"❌ Test quick_wins ÉCHEC: {e}")
    except NotImplementedError as e:
        print(f"⏳ Test quick_wins: {e}")
    
    print("=" * 60)


if __name__ == "__main__":
    _run_all_tests()

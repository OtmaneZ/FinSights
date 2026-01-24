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
        # TODO: Pour chaque action:
        #       - Calculer impact_score
        #       - Calculer ease_score
        #       - Calculer urgency_score
        #       - Calculer priority_score
        #       - Déterminer priority_level (P1/P2/P3)
        #       - Enrichir avec client_risk_score si disponible
        # TODO: Trier par priority_score (desc)
        # TODO: Retourner liste OptimizedAction
        raise NotImplementedError("TODO: Implémenter prioritize_actions()")
    
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
        # TODO: Normaliser montant (ex: 10k€ = 50 points, 50k€ = 100 points)
        # TODO: Pondérer par success_rate
        # TODO: Booster si runway critique (< 30j)
        # TODO: Calculer score final 0-100
        # TODO: Retourner score
        raise NotImplementedError("TODO: Implémenter _calculate_impact_score()")
    
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
        # TODO: Score temps: < 15min = 100, 30min = 70, 60min = 40, >60 = 20
        # TODO: Score réactivité: high = +20, medium = +10, low = 0
        # TODO: Score complexité: low = +20, medium = +10, high = 0
        # TODO: Calculer moyenne pondérée
        # TODO: Retourner score 0-100
        raise NotImplementedError("TODO: Implémenter _calculate_ease_score()")
    
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
        # TODO: Calculer jours restants
        # TODO: < 7 jours = 100
        # TODO: 7-14 jours = 80
        # TODO: 14-30 jours = 50
        # TODO: > 30 jours = 20
        # TODO: Retourner score
        raise NotImplementedError("TODO: Implémenter _calculate_urgency_score()")
    
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
        # TODO: P1 si priority > 75 OU urgency > 90
        # TODO: P2 si priority > 50 OU urgency > 70
        # TODO: P3 sinon
        # TODO: Retourner level
        raise NotImplementedError("TODO: Implémenter _determine_priority_level()")
    
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
        # TODO: Taux base selon action_type:
        #       - relance_client: 0.7
        #       - negocier_delai: 0.5
        #       - securiser_paiement: 0.8
        # TODO: Ajuster selon client_risk_score:
        #       - Rating A: +0.2
        #       - Rating B: +0.1
        #       - Rating C: 0
        #       - Rating D: -0.2
        # TODO: Limiter à 0.1-0.95
        # TODO: Retourner proba
        raise NotImplementedError("TODO: Implémenter _estimate_success_rate()")
    
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
        # TODO: Filtrer actions avec:
        #       - time_required <= max_time_minutes
        #       - ease_score > 70
        #       - impact_score > 50
        # TODO: Trier par priority_score
        # TODO: Retourner top 5
        raise NotImplementedError("TODO: Implémenter suggest_quick_wins()")


# ============================================================================
# TESTS
# ============================================================================

def _test_prioritize_actions():
    """Test priorisation actions"""
    # TODO: Créer 5 actions variées
    # TODO: Appeler prioritize_actions()
    # TODO: Vérifier tri par priority_score
    # TODO: Vérifier niveaux P1/P2/P3 cohérents
    print("TODO: Implémenter _test_prioritize_actions()")


def _test_quick_wins():
    """Test suggestion quick wins"""
    # TODO: Créer mix actions (faciles + difficiles)
    # TODO: Appeler suggest_quick_wins()
    # TODO: Vérifier filtre temps correct
    # TODO: Vérifier top actions retournées
    print("TODO: Implémenter _test_quick_wins()")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS action_optimizer.py")
    print("=" * 60)
    
    try:
        _test_prioritize_actions()
        print("✅ Test prioritize_actions OK")
    except NotImplementedError as e:
        print(f"⏳ Test prioritize_actions: {e}")
    
    try:
        _test_quick_wins()
        print("✅ Test quick_wins OK")
    except NotImplementedError as e:
        print(f"⏳ Test quick_wins: {e}")


if __name__ == "__main__":
    _run_all_tests()

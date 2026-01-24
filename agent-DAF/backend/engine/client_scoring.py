"""
Système de scoring risque client avancé.
Score 0-100 avec ratings A/B/C/D et explications détaillées.
"""

from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass

from .payment_patterns import ClientPaymentPattern


@dataclass
class ClientRiskScore:
    """Score de risque complet d'un client"""
    client_id: str
    client_name: str
    
    # Score global
    risk_score: float              # 0-100 (100 = risque max)
    rating: str                    # "A" | "B" | "C" | "D"
    
    # Scores composants (0-100 chacun)
    payment_behavior_score: float  # Basé sur historique paiements
    trend_score: float             # Basé sur évolution
    stability_score: float         # Basé sur prévisibilité
    amount_score: float            # Basé sur exposition
    
    # Pondérations utilisées
    weights: Dict[str, float]
    
    # Explications
    explanation: str               # Texte explicatif
    risk_factors: List[str]        # Liste facteurs de risque
    positive_factors: List[str]    # Liste points positifs
    
    # Métadonnées
    calculated_at: datetime
    confidence: str                # "high" | "medium" | "low"


class ClientRiskScorer:
    """
    Calcule score de risque multi-facteurs pour chaque client.
    Plus sophistiqué que simple reliability_score.
    """
    
    # Pondérations par défaut (total = 100%)
    DEFAULT_WEIGHTS = {
        "payment_behavior": 0.40,   # 40% : Historique paiements
        "trend": 0.25,              # 25% : Évolution récente
        "stability": 0.20,          # 20% : Prévisibilité
        "amount": 0.15              # 15% : Exposition montant
    }
    
    def __init__(self, weights: Optional[Dict[str, float]] = None):
        """
        Args:
            weights: Pondérations personnalisées (optionnel)
        """
        self.weights = weights or self.DEFAULT_WEIGHTS
    
    def calculate_risk_score(
        self,
        pattern: ClientPaymentPattern,
        pending_amount: float = 0,
        total_portfolio: float = 1
    ) -> ClientRiskScore:
        """
        Calcule score de risque complet pour un client.
        
        Args:
            pattern: Pattern de paiement du client
            pending_amount: Montant factures en attente
            total_portfolio: Total encours portefeuille
            
        Returns:
            ClientRiskScore avec score, rating, explications
        """
        # TODO: Calculer payment_behavior_score (inversé de reliability_score)
        # TODO: Calculer trend_score
        # TODO: Calculer stability_score
        # TODO: Calculer amount_score
        # TODO: Calculer risk_score (moyenne pondérée)
        # TODO: Déterminer rating (A/B/C/D)
        # TODO: Générer explications
        # TODO: Identifier facteurs risque et points positifs
        # TODO: Évaluer confiance
        # TODO: Construire et retourner ClientRiskScore
        raise NotImplementedError("TODO: Implémenter calculate_risk_score()")
    
    def _calculate_payment_behavior_score(self, pattern: ClientPaymentPattern) -> float:
        """
        Score basé sur comportement de paiement.
        
        Returns:
            Score 0-100 (0 = excellent, 100 = très mauvais)
        """
        # TODO: Inverser reliability_score (100 - reliability)
        # TODO: Pénaliser si late_rate > 0.3 (+10 points)
        # TODO: Pénaliser si very_late_rate > 0.1 (+20 points)
        # TODO: Pénaliser si has_partial_payments (+15 points)
        # TODO: Limiter à 100 max
        # TODO: Retourner score
        raise NotImplementedError("TODO: Implémenter _calculate_payment_behavior_score()")
    
    def _calculate_trend_score(self, pattern: ClientPaymentPattern) -> float:
        """
        Score basé sur tendance d'évolution.
        
        Returns:
            Score 0-100 (0 = amélioration, 100 = forte dégradation)
        """
        # TODO: Si trend == "improving": score = 20
        # TODO: Si trend == "stable": score = 50
        # TODO: Si trend == "worsening":
        #       - Base score = 70
        #       - Ajouter trend_slope * 5 (max 100)
        # TODO: Retourner score
        raise NotImplementedError("TODO: Implémenter _calculate_trend_score()")
    
    def _calculate_stability_score(self, pattern: ClientPaymentPattern) -> float:
        """
        Score basé sur stabilité/prévisibilité.
        
        Returns:
            Score 0-100 (0 = très stable, 100 = très imprévisible)
        """
        # TODO: Normaliser std_delay_days (0-30 jours)
        # TODO: score = (std_delay_days / 30) * 100
        # TODO: Limiter à 100 max
        # TODO: Retourner score
        raise NotImplementedError("TODO: Implémenter _calculate_stability_score()")
    
    def _calculate_amount_score(
        self,
        pending_amount: float,
        total_portfolio: float
    ) -> float:
        """
        Score basé sur exposition montant.
        
        Returns:
            Score 0-100 (0 = faible exposition, 100 = très forte)
        """
        # TODO: Calculer concentration = pending_amount / total_portfolio
        # TODO: score = concentration * 200 (max 100)
        # TODO: Si concentration > 0.5: score = 100
        # TODO: Retourner score
        raise NotImplementedError("TODO: Implémenter _calculate_amount_score()")
    
    def _determine_rating(self, risk_score: float) -> str:
        """
        Détermine rating A/B/C/D selon score.
        
        Args:
            risk_score: Score 0-100
            
        Returns:
            Rating: "A" (0-25), "B" (25-50), "C" (50-75), "D" (75-100)
        """
        # TODO: 0-25: "A" (excellent)
        # TODO: 25-50: "B" (bon)
        # TODO: 50-75: "C" (surveillé)
        # TODO: 75-100: "D" (à risque)
        raise NotImplementedError("TODO: Implémenter _determine_rating()")
    
    def _generate_explanation(
        self,
        pattern: ClientPaymentPattern,
        scores: Dict[str, float],
        rating: str
    ) -> str:
        """
        Génère texte explicatif du score.
        
        Returns:
            Texte clair pour DAF
        """
        # TODO: Construire phrase basée sur rating
        # TODO: Mentionner facteurs principaux
        # TODO: Donner contexte chiffré
        # TODO: Retourner texte
        raise NotImplementedError("TODO: Implémenter _generate_explanation()")
    
    def _identify_risk_factors(self, pattern: ClientPaymentPattern) -> List[str]:
        """Identifie facteurs de risque spécifiques"""
        factors = []
        
        # TODO: Si late_rate > 0.3: ajouter "Retards fréquents"
        # TODO: Si trend worsening: ajouter "Dégradation progressive"
        # TODO: Si has_partial_payments: ajouter "Paiements partiels"
        # TODO: Si std_delay_days > 20: ajouter "Comportement imprévisible"
        
        return factors
    
    def _identify_positive_factors(self, pattern: ClientPaymentPattern) -> List[str]:
        """Identifie points positifs"""
        factors = []
        
        # TODO: Si on_time_rate > 0.8: ajouter "Paye à temps régulièrement"
        # TODO: Si trend improving: ajouter "Amélioration récente"
        # TODO: Si std_delay_days < 10: ajouter "Comportement stable"
        
        return factors
    
    def score_portfolio(self, clients_data: List[Dict]) -> List[ClientRiskScore]:
        """
        Score tout le portefeuille clients.
        
        Args:
            clients_data: Liste dicts avec pattern + pending_amount
            
        Returns:
            Liste ClientRiskScore triée par risk_score (desc)
        """
        # TODO: Pour chaque client, appeler calculate_risk_score()
        # TODO: Trier par risk_score (desc)
        # TODO: Retourner liste
        raise NotImplementedError("TODO: Implémenter score_portfolio()")


# ============================================================================
# TESTS
# ============================================================================

def _test_calculate_risk_score():
    """Test calcul score complet"""
    # TODO: Créer pattern client fiable
    # TODO: Calculer score
    # TODO: Vérifier risk_score faible (< 30)
    # TODO: Vérifier rating = "A" ou "B"
    # TODO: Créer pattern client à risque
    # TODO: Vérifier risk_score élevé (> 70)
    # TODO: Vérifier rating = "D"
    print("TODO: Implémenter _test_calculate_risk_score()")


def _test_ratings_consistency():
    """Vérifie cohérence ratings"""
    # TODO: Tester limites ratings (25, 50, 75)
    # TODO: Vérifier transitions correctes
    print("TODO: Implémenter _test_ratings_consistency()")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS client_scoring.py")
    print("=" * 60)
    
    try:
        _test_calculate_risk_score()
        print("✅ Test calculate_risk_score OK")
    except NotImplementedError as e:
        print(f"⏳ Test calculate_risk_score: {e}")
    
    try:
        _test_ratings_consistency()
        print("✅ Test ratings_consistency OK")
    except NotImplementedError as e:
        print(f"⏳ Test ratings_consistency: {e}")


if __name__ == "__main__":
    _run_all_tests()

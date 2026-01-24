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
        # 1. Calculer scores composants
        payment_behavior_score = self._calculate_payment_behavior_score(pattern)
        trend_score = self._calculate_trend_score(pattern)
        stability_score = self._calculate_stability_score(pattern)
        amount_score = self._calculate_amount_score(pending_amount, total_portfolio)
        
        # 2. Score global (moyenne pondérée)
        risk_score = (
            payment_behavior_score * self.weights["payment_behavior"] +
            trend_score * self.weights["trend"] +
            stability_score * self.weights["stability"] +
            amount_score * self.weights["amount"]
        )
        
        # 3. Déterminer rating
        rating = self._determine_rating(risk_score)
        
        # 4. Générer explications
        scores_dict = {
            "payment_behavior": payment_behavior_score,
            "trend": trend_score,
            "stability": stability_score,
            "amount": amount_score
        }
        explanation = self._generate_explanation(pattern, scores_dict, rating)
        
        # 5. Identifier facteurs
        risk_factors = self._identify_risk_factors(pattern)
        positive_factors = self._identify_positive_factors(pattern)
        
        # 6. Évaluer confiance
        if pattern.invoice_count >= 12 and pattern.days_in_analysis >= 180:
            confidence = "high"
        elif pattern.invoice_count >= 5 and pattern.days_in_analysis >= 90:
            confidence = "medium"
        else:
            confidence = "low"
        
        # 7. Construire et retourner score complet
        return ClientRiskScore(
            client_id=pattern.client_id,
            client_name=pattern.client_name,
            risk_score=round(risk_score, 2),
            rating=rating,
            payment_behavior_score=round(payment_behavior_score, 2),
            trend_score=round(trend_score, 2),
            stability_score=round(stability_score, 2),
            amount_score=round(amount_score, 2),
            weights=self.weights,
            explanation=explanation,
            risk_factors=risk_factors,
            positive_factors=positive_factors,
            calculated_at=datetime.now(),
            confidence=confidence
        )
    
    def _calculate_payment_behavior_score(self, pattern: ClientPaymentPattern) -> float:
        """
        Score basé sur comportement de paiement.
        
        Returns:
            Score 0-100 (0 = excellent, 100 = très mauvais)
        """
        # Inverser reliability_score (100 = risque max)
        base_score = 100 - pattern.reliability_score
        
        # Pénalités additionnelles
        penalties = 0
        
        # Pénalité retards fréquents
        if pattern.late_rate > 0.3:
            penalties += 10
        
        # Pénalité retards graves
        if pattern.very_late_rate > 0.1:
            penalties += 20
        
        # Pénalité paiements partiels
        if pattern.has_partial_payments:
            penalties += 15
        
        # Score final
        score = base_score + penalties
        
        return min(score, 100)  # Limiter à 100 max
    
    def _calculate_trend_score(self, pattern: ClientPaymentPattern) -> float:
        """
        Score basé sur tendance d'évolution.
        
        Returns:
            Score 0-100 (0 = amélioration, 100 = forte dégradation)
        """
        if pattern.trend == "improving":
            # Client s'améliore = faible risque
            score = 20
        elif pattern.trend == "stable":
            # Client stable = risque moyen
            score = 50
        else:  # worsening
            # Client se dégrade = risque élevé
            base_score = 70
            
            # Ajouter gravité selon pente
            penalty = pattern.trend_slope * 5
            score = base_score + penalty
        
        return min(score, 100)  # Limiter à 100 max
    
    def _calculate_stability_score(self, pattern: ClientPaymentPattern) -> float:
        """
        Score basé sur stabilité/prévisibilité.
        
        Returns:
            Score 0-100 (0 = très stable, 100 = très imprévisible)
        """
        # Normaliser écart-type (0-30 jours typique)
        std_delay = min(pattern.std_delay_days, 30)
        
        # Convertir en score 0-100
        score = (std_delay / 30) * 100
        
        return min(score, 100)  # Limiter à 100 max
    
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
        if total_portfolio <= 0:
            return 0
        
        # Calculer concentration (0-1)
        concentration = pending_amount / total_portfolio
        
        # Convertir en score (doubler pour pénaliser forte concentration)
        score = concentration * 200
        
        # Concentration >50% = risque max
        if concentration > 0.5:
            score = 100
        
        return min(score, 100)  # Limiter à 100 max
    
    def _determine_rating(self, risk_score: float) -> str:
        """
        Détermine rating A/B/C/D selon score.
        
        Args:
            risk_score: Score 0-100
            
        Returns:
            Rating: "A" (0-25), "B" (25-50), "C" (50-75), "D" (75-100)
        """
        if risk_score < 25:
            return "A"  # Excellent
        elif risk_score < 50:
            return "B"  # Bon
        elif risk_score < 75:
            return "C"  # Surveillé
        else:
            return "D"  # À risque
    
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
        # Texte selon rating
        if rating == "A":
            base = f"Client {pattern.client_name} présente un risque très faible (rating A)."
        elif rating == "B":
            base = f"Client {pattern.client_name} présente un risque modéré (rating B)."
        elif rating == "C":
            base = f"Client {pattern.client_name} nécessite une surveillance (rating C)."
        else:  # D
            base = f"Client {pattern.client_name} présente un risque élevé (rating D)."
        
        # Ajouter facteurs principaux
        main_factor = max(scores.items(), key=lambda x: x[1])
        factor_name = main_factor[0].replace("_", " ")
        
        context = (
            f" Le facteur principal est le {factor_name} (score {main_factor[1]:.0f}/100). "
            f"Paiements à temps: {pattern.on_time_rate*100:.0f}%, "
            f"retards: {pattern.late_rate*100:.0f}%, "
            f"tendance: {pattern.trend}."
        )
        
        return base + context
    
    def _identify_risk_factors(self, pattern: ClientPaymentPattern) -> List[str]:
        """Identifie facteurs de risque spécifiques"""
        factors = []
        
        # Retards fréquents
        if pattern.late_rate > 0.3:
            factors.append(f"Retards fréquents ({pattern.late_rate*100:.0f}% des factures)")
        
        # Dégradation
        if pattern.trend == "worsening":
            factors.append(f"Dégradation progressive (+{pattern.trend_slope:.1f}j/mois)")
        
        # Paiements partiels
        if pattern.has_partial_payments:
            factors.append("Paiements partiels récurrents")
        
        # Imprévisibilité
        if pattern.std_delay_days > 20:
            factors.append(f"Comportement imprévisible (écart-type {pattern.std_delay_days:.1f}j)")
        
        # Retards graves
        if pattern.very_late_rate > 0.1:
            factors.append(f"Retards graves ({pattern.very_late_rate*100:.0f}% >30j)")
        
        return factors
    
    def _identify_positive_factors(self, pattern: ClientPaymentPattern) -> List[str]:
        """Identifie points positifs"""
        factors = []
        
        # Ponctualité
        if pattern.on_time_rate > 0.8:
            factors.append(f"Paye à temps régulièrement ({pattern.on_time_rate*100:.0f}%)")
        
        # Amélioration
        if pattern.trend == "improving":
            factors.append(f"Amélioration récente ({abs(pattern.trend_slope):.1f}j/mois)")
        
        # Stabilité
        if pattern.std_delay_days < 10:
            factors.append(f"Comportement stable (écart-type {pattern.std_delay_days:.1f}j)")
        
        # Aucun retard grave
        if pattern.very_late_rate == 0:
            factors.append("Aucun retard grave (>30j)")
        
        return factors
    
    def score_portfolio(self, clients_data: List[Dict]) -> List[ClientRiskScore]:
        """
        Score tout le portefeuille clients.
        
        Args:
            clients_data: Liste dicts avec pattern + pending_amount
            
        Returns:
            Liste ClientRiskScore triée par risk_score (desc)
        """
        scores = []
        
        # Calculer total portefeuille
        total_portfolio = sum(c.get("pending_amount", 0) for c in clients_data)
        
        # Scorer chaque client
        for client in clients_data:
            pattern = client["pattern"]
            pending_amount = client.get("pending_amount", 0)
            
            score = self.calculate_risk_score(
                pattern=pattern,
                pending_amount=pending_amount,
                total_portfolio=total_portfolio
            )
            scores.append(score)
        
        # Trier par risque décroissant (D puis C puis B puis A)
        scores.sort(key=lambda s: s.risk_score, reverse=True)
        
        return scores


# ============================================================================
# TESTS
# ============================================================================

def _test_calculate_risk_score():
    """Test calcul score complet"""
    print("\n--- Test calculate_risk_score() ---")
    
    # Client fiable (A)
    reliable_pattern = ClientPaymentPattern(
        client_id="CLI001",
        client_name="Client Fiable SA",
        invoice_count=20,
        days_in_analysis=365,
        avg_delay_days=2.0,
        median_delay_days=1.0,
        std_delay_days=5.0,
        on_time_rate=0.9,
        late_rate=0.1,
        very_late_rate=0.0,
        has_partial_payments=False,
        trend="stable",
        trend_slope=0.0,
        reliability_score=85.0,
        first_invoice_date=datetime.now(),
        last_invoice_date=datetime.now()
    )
    
    scorer = ClientRiskScorer()
    score_reliable = scorer.calculate_risk_score(
        pattern=reliable_pattern,
        pending_amount=10000,
        total_portfolio=100000
    )
    
    print(f"Client fiable: Score={score_reliable.risk_score}, Rating={score_reliable.rating}")
    print(f"  Composants: behavior={score_reliable.payment_behavior_score}, "
          f"trend={score_reliable.trend_score}, stability={score_reliable.stability_score}, "
          f"amount={score_reliable.amount_score}")
    print(f"  Explication: {score_reliable.explanation}")
    
    assert score_reliable.risk_score < 30, f"Score devrait être <30, obtenu {score_reliable.risk_score}"
    assert score_reliable.rating in ["A", "B"], f"Rating devrait être A ou B, obtenu {score_reliable.rating}"
    
    # Client à risque (D)
    risky_pattern = ClientPaymentPattern(
        client_id="CLI002",
        client_name="Client Risqué SARL",
        invoice_count=15,
        days_in_analysis=180,
        avg_delay_days=45.0,
        median_delay_days=40.0,
        std_delay_days=25.0,
        on_time_rate=0.1,
        late_rate=0.6,
        very_late_rate=0.3,
        has_partial_payments=True,
        trend="worsening",
        trend_slope=5.0,
        reliability_score=20.0,
        first_invoice_date=datetime.now(),
        last_invoice_date=datetime.now()
    )
    
    score_risky = scorer.calculate_risk_score(
        pattern=risky_pattern,
        pending_amount=60000,
        total_portfolio=100000
    )
    
    print(f"\nClient risqué: Score={score_risky.risk_score}, Rating={score_risky.rating}")
    print(f"  Facteurs risque: {score_risky.risk_factors}")
    
    assert score_risky.risk_score > 70, f"Score devrait être >70, obtenu {score_risky.risk_score}"
    assert score_risky.rating == "D", f"Rating devrait être D, obtenu {score_risky.rating}"
    
    print("\n✅ Test calculate_risk_score() passé")


def _test_ratings_consistency():
    """Vérifie cohérence ratings"""
    print("\n--- Test ratings_consistency() ---")
    
    scorer = ClientRiskScorer()
    
    # Tester limites
    test_cases = [
        (0, "A"),
        (24.9, "A"),
        (25, "B"),
        (49.9, "B"),
        (50, "C"),
        (74.9, "C"),
        (75, "D"),
        (100, "D")
    ]
    
    for risk_score, expected_rating in test_cases:
        actual_rating = scorer._determine_rating(risk_score)
        print(f"Score {risk_score:5.1f} → Rating {actual_rating} (attendu: {expected_rating})")
        assert actual_rating == expected_rating, \
            f"Score {risk_score} devrait donner {expected_rating}, obtenu {actual_rating}"
    
    print("\n✅ Test ratings_consistency() passé")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS client_scoring.py")
    print("=" * 60)
    
    try:
        _test_calculate_risk_score()
        print("✅ Test calculate_risk_score OK")
    except AssertionError as e:
        print(f"❌ Test calculate_risk_score ÉCHEC: {e}")
    except NotImplementedError as e:
        print(f"⏳ Test calculate_risk_score: {e}")
    
    try:
        _test_ratings_consistency()
        print("✅ Test ratings_consistency OK")
    except AssertionError as e:
        print(f"❌ Test ratings_consistency ÉCHEC: {e}")
    except NotImplementedError as e:
        print(f"⏳ Test ratings_consistency: {e}")
    
    print("=" * 60)


if __name__ == "__main__":
    _run_all_tests()


"""
Module de prévisions intelligentes basées sur patterns clients.
Ajuste probabilités et dates selon historique comportement.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
import pandas as pd
from dataclasses import dataclass

from .payment_patterns import ClientPaymentAnalyzer, ClientPaymentPattern


@dataclass
class SmartForecast:
    """Prévision intelligente d'un encaissement"""
    invoice_id: str
    client_id: str
    client_name: str
    
    # Dates
    due_date: datetime
    expected_payment_date: datetime    # Ajusté selon pattern client
    earliest_date: datetime            # Scénario optimiste
    latest_date: datetime              # Scénario pessimiste
    
    # Montants
    amount: float
    expected_amount: float             # Si risque paiement partiel
    
    # Probabilités
    probability_on_time: float         # Proba paiement à temps
    probability_late: float            # Proba retard <30j
    probability_very_late: float       # Proba retard >30j
    probability_default: float         # Proba impayé
    
    # Confiance
    confidence_level: str              # "high" | "medium" | "low"
    confidence_score: float            # 0-1
    
    # Contexte
    client_pattern: ClientPaymentPattern
    seasonal_factor: float             # Ajustement saisonnier (0.8-1.2)
    warnings: List[str]                # Alertes spécifiques


class SmartForecaster:
    """
    Génère prévisions intelligentes basées sur patterns clients.
    Plus précis que simple pondération probabilité.
    """
    
    def __init__(self, payment_analyzer: ClientPaymentAnalyzer):
        """
        Args:
            payment_analyzer: Analyzer initialisé avec données historiques
        """
        self.analyzer = payment_analyzer
    
    def forecast_invoice(
        self, 
        invoice: Dict,
        include_seasonality: bool = True
    ) -> SmartForecast:
        """
        Génère prévision intelligente pour une facture.
        
        Args:
            invoice: Dict avec invoice_id, client_id, client_name, due_date, amount
            include_seasonality: Ajuster selon saison (défaut True)
            
        Returns:
            SmartForecast complet avec dates, probabilités, confiance
        """
        # TODO: Extraire données invoice
        # TODO: Récupérer pattern client via self.analyzer.analyze_client()
        # TODO: Calculer expected_payment_date avec _calculate_expected_date()
        # TODO: Calculer earliest_date et latest_date (±std_delay)
        # TODO: Calculer probabilités avec _calculate_probabilities()
        # TODO: Calculer expected_amount (réduire si has_partial_payments)
        # TODO: Évaluer confiance avec _assess_confidence()
        # TODO: Détecter warnings avec _detect_warnings()
        # TODO: Si include_seasonality, ajuster avec seasonal_factor
        # TODO: Construire et retourner SmartForecast
        raise NotImplementedError("TODO: Implémenter forecast_invoice()")
    
    def _calculate_expected_date(
        self,
        due_date: datetime,
        pattern: ClientPaymentPattern
    ) -> datetime:
        """
        Calcule date paiement attendue selon pattern client.
        
        Args:
            due_date: Date d'échéance facture
            pattern: Pattern de paiement du client
            
        Returns:
            Date attendue (due_date + délai moyen ajusté)
        """
        # TODO: Récupérer avg_delay_days du pattern
        # TODO: Si trend == "worsening", ajouter 5 jours supplémentaires
        # TODO: Si trend == "improving", réduire de 3 jours
        # TODO: Calculer expected_date = due_date + timedelta(days=adjusted_delay)
        # TODO: Retourner expected_date
        raise NotImplementedError("TODO: Implémenter _calculate_expected_date()")
    
    def _calculate_probabilities(
        self,
        pattern: ClientPaymentPattern,
        days_until_due: int
    ) -> Dict[str, float]:
        """
        Calcule probabilités selon pattern client.
        
        Args:
            pattern: Pattern de paiement
            days_until_due: Jours avant échéance (peut être négatif si dépassée)
            
        Returns:
            Dict avec clés: on_time, late, very_late, default
            Somme des probabilités doit = 1.0
        """
        # TODO: Extraire reliability_score, trend, has_partial_payments
        # TODO: Calculer proba_on_time basée sur on_time_rate
        #       - Réduire si trend worsening (-0.1)
        #       - Augmenter si trend improving (+0.1)
        # TODO: Calculer proba_late basée sur late_rate
        # TODO: Calculer proba_very_late basée sur very_late_rate
        #       - Augmenter si trend worsening
        # TODO: Calculer proba_default:
        #       - Base: 0.02 (2%)
        #       - Si has_partial_payments: 0.05 (5%)
        #       - Si reliability_score < 30: 0.10 (10%)
        # TODO: Normaliser pour que somme = 1.0
        # TODO: Retourner dict
        raise NotImplementedError("TODO: Implémenter _calculate_probabilities()")
    
    def _assess_confidence(
        self,
        pattern: ClientPaymentPattern
    ) -> tuple[str, float]:
        """
        Évalue niveau de confiance de la prévision.
        
        Confiance haute si:
        - reliability_score > 80
        - std_delay_days < 10 (comportement prévisible)
        - trend == "stable"
        - Historique riche (total_invoices > 20)
        
        Args:
            pattern: Pattern client
            
        Returns:
            (confidence_level, confidence_score)
            level = "high" | "medium" | "low"
            score = 0-1
        """
        # TODO: Calculer score_reliability = reliability_score / 100
        # TODO: Calculer score_stability = 1 - (std_delay_days / 30)  # normaliser
        # TODO: Calculer score_trend:
        #       - stable: 1.0
        #       - improving: 0.9
        #       - worsening: 0.5
        # TODO: Calculer score_history = min(total_invoices / 20, 1.0)
        # TODO: confidence_score = moyenne pondérée (40% reliab, 30% stab, 20% trend, 10% hist)
        # TODO: Déterminer level:
        #       - > 0.8: "high"
        #       - 0.6-0.8: "medium"
        #       - < 0.6: "low"
        # TODO: Retourner (level, score)
        raise NotImplementedError("TODO: Implémenter _assess_confidence()")
    
    def _detect_warnings(
        self,
        invoice: Dict,
        pattern: ClientPaymentPattern
    ) -> List[str]:
        """
        Détecte signaux d'alerte spécifiques pour cette facture.
        
        Args:
            invoice: Données facture
            pattern: Pattern client
            
        Returns:
            Liste de messages d'alerte
        """
        warnings = []
        
        # TODO: Warning si trend == "worsening"
        #       → "⚠️ Délais de paiement en augmentation"
        # TODO: Warning si has_partial_payments
        #       → "⚠️ Historique de paiements partiels"
        # TODO: Warning si invoice.amount > avg_invoice_amount * 1.5
        #       → "⚠️ Montant supérieur à l'habitude"
        # TODO: Warning si due_date.month in [7, 8, 12]
        #       → "⚠️ Période à risque (vacances/fin d'année)"
        # TODO: Warning si reliability_score < 50
        #       → "🚨 Client à haut risque"
        
        return warnings
    
    def forecast_portfolio(
        self,
        pending_invoices: List[Dict],
        horizon_weeks: int = 13
    ) -> Dict:
        """
        Prévisions pour tout le portefeuille sur N semaines.
        
        Args:
            pending_invoices: Liste factures en attente
            horizon_weeks: Horizon prévision (défaut 13 semaines = 1 trimestre)
            
        Returns:
            Dict avec:
            {
                "weekly_forecasts": [
                    {
                        "week": int,
                        "expected_amount": float,
                        "min_amount": float,
                        "max_amount": float,
                        "confidence": str
                    }
                ],
                "risk_weeks": [int],  # Semaines avec encaissement < seuil
                "total_expected": float,
                "total_at_risk": float
            }
        """
        # TODO: Pour chaque facture, appeler forecast_invoice()
        # TODO: Grouper prévisions par semaine
        # TODO: Pour chaque semaine:
        #       - Calculer expected_amount (somme pondérée par probabilités)
        #       - Calculer min_amount (scénario pessimiste)
        #       - Calculer max_amount (scénario optimiste)
        #       - Évaluer confidence moyenne
        # TODO: Identifier risk_weeks (expected < seuil tréso)
        # TODO: Calculer totaux
        # TODO: Retourner dict structuré
        raise NotImplementedError("TODO: Implémenter forecast_portfolio()")


# ============================================================================
# TESTS
# ============================================================================

def _test_forecast_invoice():
    """Test prévision d'une facture"""
    # TODO: Créer données test
    # TODO: Créer analyzer et forecaster
    # TODO: Tester prévision pour client fiable
    # TODO: Vérifier expected_date proche de due_date
    # TODO: Vérifier proba_on_time > 0.8
    # TODO: Tester prévision pour client à risque
    # TODO: Vérifier warnings générés
    print("TODO: Implémenter _test_forecast_invoice()")


def _test_probabilities_sum():
    """Vérifie que somme probabilités = 1.0"""
    # TODO: Créer plusieurs scénarios
    # TODO: Calculer probabilités
    # TODO: Vérifier somme = 1.0 (± 0.001)
    print("TODO: Implémenter _test_probabilities_sum()")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS smart_forecast.py")
    print("=" * 60)
    
    try:
        _test_forecast_invoice()
        print("✅ Test forecast_invoice OK")
    except NotImplementedError as e:
        print(f"⏳ Test forecast_invoice: {e}")
    
    try:
        _test_probabilities_sum()
        print("✅ Test probabilities_sum OK")
    except NotImplementedError as e:
        print(f"⏳ Test probabilities_sum: {e}")


if __name__ == "__main__":
    _run_all_tests()

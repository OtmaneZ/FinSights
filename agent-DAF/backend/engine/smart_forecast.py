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
        # Extraire données invoice
        invoice_id = invoice['invoice_id']
        client_id = invoice['client_id']
        client_name = invoice.get('client_name', client_id)
        due_date = invoice['due_date']
        if isinstance(due_date, str):
            due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
        amount = float(invoice['amount'])
        
        # Récupérer pattern client
        try:
            pattern = self.analyzer.analyze_client(client_id)
        except:
            # Client sans historique : utiliser valeurs par défaut conservatrices
            from .payment_patterns import ClientPaymentPattern
            pattern = ClientPaymentPattern(
                client_id=client_id,
                client_name=client_name,
                avg_delay_days=15.0,
                std_delay_days=10.0,
                median_delay_days=15.0,
                on_time_rate=0.5,
                late_rate=0.3,
                very_late_rate=0.2,
                trend="stable",
                trend_slope=0.0,
                has_partial_payments=False,
                partial_payment_count=0,
                reliability_score=50.0,
                risk_level="medium",
                total_invoices=0,
                analysis_period_months=0,
                last_payment_date=None
            )
        
        # Calculer expected_payment_date
        expected_payment_date = self._calculate_expected_date(due_date, pattern)
        
        # Calculer earliest et latest dates
        earliest_date = due_date + timedelta(days=max(0, pattern.avg_delay_days - pattern.std_delay_days))
        latest_date = due_date + timedelta(days=pattern.avg_delay_days + 2 * pattern.std_delay_days)
        
        # Calculer probabilités
        days_until_due = (due_date - datetime.now()).days
        probabilities = self._calculate_probabilities(pattern, days_until_due)
        
        # Calculer expected_amount (réduire si paiements partiels)
        expected_amount = amount
        if pattern.has_partial_payments:
            expected_amount = amount * 0.9  # Réduction conservatrice de 10%
        
        # Évaluer confiance
        confidence_level, confidence_score = self._assess_confidence(pattern)
        
        # Détecter warnings
        warnings = self._detect_warnings(invoice, pattern)
        
        # Ajustement saisonnier
        seasonal_factor = 1.0
        if include_seasonality:
            month = expected_payment_date.month
            if month in [7, 8]:  # Juillet-Août
                seasonal_factor = 0.85
            elif month == 12:  # Décembre
                seasonal_factor = 0.90
        
        # Construire SmartForecast
        return SmartForecast(
            invoice_id=invoice_id,
            client_id=client_id,
            client_name=client_name,
            due_date=due_date,
            expected_payment_date=expected_payment_date,
            earliest_date=earliest_date,
            latest_date=latest_date,
            amount=amount,
            expected_amount=expected_amount,
            probability_on_time=probabilities['on_time'],
            probability_late=probabilities['late'],
            probability_very_late=probabilities['very_late'],
            probability_default=probabilities['default'],
            confidence_level=confidence_level,
            confidence_score=confidence_score,
            client_pattern=pattern,
            seasonal_factor=seasonal_factor,
            warnings=warnings
        )
    
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
        # Délai de base
        adjusted_delay = pattern.avg_delay_days
        
        # Ajuster selon tendance
        if pattern.trend == "worsening":
            adjusted_delay += 5  # Ajouter 5 jours si dégradation
        elif pattern.trend == "improving":
            adjusted_delay = max(0, adjusted_delay - 3)  # Réduire 3 jours si amélioration
        
        # Calculer date attendue
        expected_date = due_date + timedelta(days=adjusted_delay)
        
        return expected_date
    
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
        # Probabilités de base
        proba_on_time = pattern.on_time_rate
        proba_late = pattern.late_rate
        proba_very_late = pattern.very_late_rate
        
        # Ajuster selon tendance
        if pattern.trend == "worsening":
            proba_on_time = max(0, proba_on_time - 0.1)
            proba_very_late = min(1, proba_very_late + 0.1)
        elif pattern.trend == "improving":
            proba_on_time = min(1, proba_on_time + 0.1)
            proba_very_late = max(0, proba_very_late - 0.05)
        
        # Calculer proba défaut
        if pattern.reliability_score < 30:
            proba_default = 0.10
        elif pattern.has_partial_payments:
            proba_default = 0.05
        else:
            proba_default = 0.02
        
        # Normaliser pour que somme = 1.0
        total = proba_on_time + proba_late + proba_very_late + proba_default
        if total > 0:
            proba_on_time /= total
            proba_late /= total
            proba_very_late /= total
            proba_default /= total
        
        return {
            'on_time': proba_on_time,
            'late': proba_late,
            'very_late': proba_very_late,
            'default': proba_default
        }
    
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
        # Score fiabilité (40%)
        score_reliability = pattern.reliability_score / 100
        
        # Score stabilité (30%)
        score_stability = max(0, 1 - (pattern.std_delay_days / 30))
        
        # Score tendance (20%)
        if pattern.trend == "stable":
            score_trend = 1.0
        elif pattern.trend == "improving":
            score_trend = 0.9
        else:  # worsening
            score_trend = 0.5
        
        # Score historique (10%)
        score_history = min(pattern.total_invoices / 20, 1.0)
        
        # Moyenne pondérée
        confidence_score = (
            score_reliability * 0.40 +
            score_stability * 0.30 +
            score_trend * 0.20 +
            score_history * 0.10
        )
        
        # Déterminer level
        if confidence_score > 0.8:
            confidence_level = "high"
        elif confidence_score > 0.6:
            confidence_level = "medium"
        else:
            confidence_level = "low"
        
        return confidence_level, confidence_score
    
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
        
        # Warning si trend worsening
        if pattern.trend == "worsening":
            warnings.append("⚠️ Délais de paiement en augmentation")
        
        # Warning si paiements partiels
        if pattern.has_partial_payments:
            warnings.append("⚠️ Historique de paiements partiels")
        
        # Warning si montant élevé (si avg disponible dans pattern)
        amount = invoice.get('amount', 0)
        if amount > 50000:  # Seuil arbitraire
            warnings.append("⚠️ Montant élevé nécessitant suivi rapproché")
        
        # Warning période à risque
        due_date = invoice.get('due_date')
        if due_date:
            if isinstance(due_date, str):
                due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
            if due_date.month in [7, 8]:
                warnings.append("⚠️ Période à risque (vacances d'été)")
            elif due_date.month == 12:
                warnings.append("⚠️ Période à risque (fin d'année)")
        
        # Warning si client à haut risque
        if pattern.reliability_score < 50:
            warnings.append("🚨 Client à haut risque")
        
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
            Dict avec prévisions agrégées par semaine
        """
        # Générer prévisions pour toutes les factures
        forecasts = []
        for invoice in pending_invoices:
            try:
                forecast = self.forecast_invoice(invoice)
                forecasts.append(forecast)
            except Exception as e:
                # Skip factures avec erreurs
                continue
        
        # Grouper par semaine
        weekly_forecasts = []
        reference_date = datetime.now()
        
        for week_num in range(horizon_weeks):
            week_start = reference_date + timedelta(weeks=week_num)
            week_end = week_start + timedelta(days=7)
            
            # Factures attendues cette semaine
            week_forecasts = [
                f for f in forecasts
                if week_start <= f.expected_payment_date < week_end
            ]
            
            if len(week_forecasts) > 0:
                # Calculer montants pondérés par probabilités
                expected_amount = sum(
                    f.expected_amount * (f.probability_on_time + f.probability_late)
                    for f in week_forecasts
                )
                
                # Scénario optimiste (tout à temps)
                max_amount = sum(f.amount for f in week_forecasts)
                
                # Scénario pessimiste (retards + defaults)
                min_amount = sum(
                    f.expected_amount * (1 - f.probability_default)
                    for f in week_forecasts
                )
                
                # Confiance moyenne
                avg_confidence = sum(f.confidence_score for f in week_forecasts) / len(week_forecasts)
                if avg_confidence > 0.8:
                    confidence = "high"
                elif avg_confidence > 0.6:
                    confidence = "medium"
                else:
                    confidence = "low"
            else:
                expected_amount = 0
                max_amount = 0
                min_amount = 0
                confidence = "high"
            
            weekly_forecasts.append({
                'week': week_num + 1,
                'week_start': week_start.isoformat(),
                'expected_amount': round(expected_amount, 2),
                'min_amount': round(min_amount, 2),
                'max_amount': round(max_amount, 2),
                'confidence': confidence,
                'invoice_count': len(week_forecasts)
            })
        
        # Identifier semaines à risque (encaissement < seuil)
        risk_threshold = 10000  # Seuil arbitraire
        risk_weeks = [
            w['week'] for w in weekly_forecasts
            if w['expected_amount'] < risk_threshold and w['invoice_count'] > 0
        ]
        
        # Totaux
        total_expected = sum(w['expected_amount'] for w in weekly_forecasts)
        total_at_risk = sum(
            f.expected_amount * f.probability_default
            for f in forecasts
        )
        
        return {
            'weekly_forecasts': weekly_forecasts,
            'risk_weeks': risk_weeks,
            'total_expected': round(total_expected, 2),
            'total_at_risk': round(total_at_risk, 2),
            'horizon_weeks': horizon_weeks,
            'total_invoices': len(forecasts)
        }


# ============================================================================
# TESTS
# ============================================================================

def _test_forecast_invoice():
    """Test prévision d'une facture"""
    print("\n🧪 Test forecast_invoice()...")
    
    from .payment_patterns import ClientPaymentAnalyzer
    import pandas as pd
    
    # Créer données test simples
    data = [{
        'client_id': 'TEST_A',
        'client_name': 'Test Client',
        'invoice_id': 'INV_1',
        'due_date': datetime(2025, 1, 1),
        'payment_date': datetime(2025, 1, 3),
        'amount': 10000,
        'amount_paid': 10000,
        'status': 'paid'
    }]
    
    df = pd.DataFrame(data)
    analyzer = ClientPaymentAnalyzer(df)
    forecaster = SmartForecaster(analyzer)
    
    # Test prévision
    invoice = {
        'invoice_id': 'INV_TEST',
        'client_id': 'TEST_A',
        'client_name': 'Test Client',
        'due_date': datetime.now() + timedelta(days=30),
        'amount': 15000
    }
    
    forecast = forecaster.forecast_invoice(invoice)
    
    assert forecast.invoice_id == 'INV_TEST'
    assert forecast.amount == 15000
    assert forecast.confidence_level in ['high', 'medium', 'low']
    
    # Vérifier somme probabilités
    total_proba = (forecast.probability_on_time + forecast.probability_late + 
                   forecast.probability_very_late + forecast.probability_default)
    assert abs(total_proba - 1.0) < 0.01, f"Somme probas = {total_proba}, devrait être 1.0"
    
    print("  ✅ Test forecast_invoice PASSED")


def _test_probabilities_sum():
    """Vérifie que somme probabilités = 1.0"""
    print("\n🧪 Test probabilities_sum()...")
    
    from .payment_patterns import ClientPaymentPattern
    
    pattern = ClientPaymentPattern(
        client_id='TEST',
        client_name='Test',
        avg_delay_days=10,
        std_delay_days=5,
        median_delay_days=10,
        on_time_rate=0.7,
        late_rate=0.2,
        very_late_rate=0.1,
        trend='stable',
        trend_slope=0,
        has_partial_payments=False,
        partial_payment_count=0,
        reliability_score=75,
        risk_level='low',
        total_invoices=10,
        analysis_period_months=6,
        last_payment_date=None
    )
    
    from .payment_patterns import ClientPaymentAnalyzer
    analyzer = ClientPaymentAnalyzer(pd.DataFrame())  # Dummy
    forecaster = SmartForecaster(analyzer)
    
    probas = forecaster._calculate_probabilities(pattern, 30)
    total = sum(probas.values())
    
    assert abs(total - 1.0) < 0.001, f"Somme = {total}"
    print(f"  Probas: {probas}")
    print("  ✅ Test probabilities_sum PASSED")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS smart_forecast.py")
    print("=" * 60)
    
    try:
        _test_forecast_invoice()
        print("✅ Test forecast_invoice OK")
    except Exception as e:
        print(f"⚠️ Test forecast_invoice: {e}")
    
    try:
        _test_probabilities_sum()
        print("✅ Test probabilities_sum OK")
    except Exception as e:
        print(f"⚠️ Test probabilities_sum: {e}")
    
    print("\n" + "=" * 60)
    print("TESTS TERMINÉS")
    print("=" * 60)


if __name__ == "__main__":
    _run_all_tests()

"""
Module d'analyse des patterns de paiement par client.
Détecte tendances, délais moyens, et comportements anormaux.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
import pandas as pd
import numpy as np
from dataclasses import dataclass


@dataclass
class ClientPaymentPattern:
    """Pattern de paiement d'un client"""
    client_id: str
    client_name: str
    
    # Statistiques de base
    avg_delay_days: float          # Délai moyen en jours
    std_delay_days: float          # Écart-type délai
    median_delay_days: float       # Médiane délai
    
    # Fiabilité
    on_time_rate: float            # % paiements à temps (0-1)
    late_rate: float               # % paiements en retard (0-1)
    very_late_rate: float          # % retards >60j (0-1)
    
    # Tendances (3-6 derniers mois)
    trend: str                     # "stable" | "improving" | "worsening"
    trend_slope: float             # Pente tendance (jours/mois)
    
    # Comportement
    has_partial_payments: bool     # A déjà fait paiements partiels
    partial_payment_count: int     # Nombre paiements partiels
    
    # Score global
    reliability_score: float       # 0-100 (100 = très fiable)
    risk_level: str               # "low" | "medium" | "high" | "critical"
    
    # Métadonnées
    total_invoices: int
    analysis_period_months: int
    last_payment_date: Optional[datetime]


class ClientPaymentAnalyzer:
    """
    Analyse les patterns de paiement des clients.
    Détecte tendances et comportements à risque.
    """
    
    def __init__(self, invoices_df: pd.DataFrame):
        """
        Args:
            invoices_df: DataFrame avec colonnes:
                - client_id, client_name, invoice_id
                - due_date, payment_date, amount, status
        """
        self.invoices = invoices_df
        self._prepare_data()
    
    def _prepare_data(self):
        """Prépare les données pour l'analyse"""
        # Convertir dates en datetime si nécessaire
        if 'due_date' in self.invoices.columns:
            self.invoices['due_date'] = pd.to_datetime(self.invoices['due_date'])
        if 'payment_date' in self.invoices.columns:
            self.invoices['payment_date'] = pd.to_datetime(self.invoices['payment_date'])
        
        # Calculer delay_days pour chaque facture payée
        if 'payment_date' in self.invoices.columns and 'due_date' in self.invoices.columns:
            self.invoices['delay_days'] = (
                self.invoices['payment_date'] - self.invoices['due_date']
            ).dt.days
        
        # Filtrer uniquement les factures payées pour l'analyse
        if 'status' in self.invoices.columns:
            self.paid_invoices = self.invoices[
                self.invoices['status'].isin(['paid', 'payé', 'Paid', 'Payé'])
            ].copy()
        else:
            # Si pas de colonne status, considérer celles avec payment_date
            self.paid_invoices = self.invoices[
                self.invoices['payment_date'].notna()
            ].copy()
    
    def analyze_client(self, client_id: str) -> ClientPaymentPattern:
        """
        Analyse complète du pattern de paiement d'un client.
        
        Args:
            client_id: ID du client à analyser
            
        Returns:
            ClientPaymentPattern avec toutes les métriques
        """
        # Filtrer factures du client
        client_invoices = self.paid_invoices[
            self.paid_invoices['client_id'] == client_id
        ].copy()
        
        if len(client_invoices) == 0:
            raise ValueError(f"Aucune facture payée trouvée pour client {client_id}")
        
        # Récupérer nom client
        client_name = client_invoices['client_name'].iloc[0] if 'client_name' in client_invoices.columns else client_id
        
        # Calculer statistiques de base
        delays = client_invoices['delay_days'].dropna()
        avg_delay = float(delays.mean())
        std_delay = float(delays.std()) if len(delays) > 1 else 0.0
        median_delay = float(delays.median())
        
        # Calculer taux de paiements
        total_invoices = len(client_invoices)
        on_time_count = len(client_invoices[client_invoices['delay_days'] <= 0])
        late_count = len(client_invoices[(client_invoices['delay_days'] > 0) & (client_invoices['delay_days'] <= 60)])
        very_late_count = len(client_invoices[client_invoices['delay_days'] > 60])
        
        on_time_rate = on_time_count / total_invoices if total_invoices > 0 else 0.0
        late_rate = late_count / total_invoices if total_invoices > 0 else 0.0
        very_late_rate = very_late_count / total_invoices if total_invoices > 0 else 0.0
        
        # Analyser tendance
        trend, trend_slope = self._calculate_trend(client_invoices)
        
        # Détecter paiements partiels (si colonne amount_paid vs amount)
        has_partial_payments = False
        partial_payment_count = 0
        if 'amount' in client_invoices.columns and 'amount_paid' in client_invoices.columns:
            partial_payments = client_invoices[
                (client_invoices['amount_paid'] < client_invoices['amount']) & 
                (client_invoices['amount_paid'] > 0)
            ]
            has_partial_payments = len(partial_payments) > 0
            partial_payment_count = len(partial_payments)
        
        # Calculer reliability_score
        pattern_data = {
            'on_time_rate': on_time_rate,
            'std_delay_days': std_delay,
            'trend': trend,
            'has_partial_payments': has_partial_payments
        }
        reliability_score = self._calculate_reliability_score(pattern_data)
        
        # Déterminer risk_level
        if reliability_score >= 80:
            risk_level = "low"
        elif reliability_score >= 60:
            risk_level = "medium"
        elif reliability_score >= 40:
            risk_level = "high"
        else:
            risk_level = "critical"
        
        # Période d'analyse
        if len(client_invoices) > 0:
            date_range = (client_invoices['payment_date'].max() - client_invoices['payment_date'].min())
            analysis_period_months = max(1, int(date_range.days / 30))
            last_payment_date = client_invoices['payment_date'].max()
        else:
            analysis_period_months = 0
            last_payment_date = None
        
        # Construire et retourner ClientPaymentPattern
        return ClientPaymentPattern(
            client_id=client_id,
            client_name=client_name,
            avg_delay_days=avg_delay,
            std_delay_days=std_delay,
            median_delay_days=median_delay,
            on_time_rate=on_time_rate,
            late_rate=late_rate,
            very_late_rate=very_late_rate,
            trend=trend,
            trend_slope=trend_slope,
            has_partial_payments=has_partial_payments,
            partial_payment_count=partial_payment_count,
            reliability_score=reliability_score,
            risk_level=risk_level,
            total_invoices=total_invoices,
            analysis_period_months=analysis_period_months,
            last_payment_date=last_payment_date
        )
    
    def _calculate_trend(self, client_invoices: pd.DataFrame) -> tuple[str, float]:
        """
        Calcule la tendance des délais (amélioration/dégradation).
        
        Args:
            client_invoices: Factures du client triées par date
            
        Returns:
            (trend, slope) où trend = "stable"|"improving"|"worsening"
            slope = pente en jours/mois
        """
        if len(client_invoices) < 6:
            # Pas assez de données pour calculer une tendance fiable
            return "stable", 0.0
        
        # Trier par date de paiement
        sorted_invoices = client_invoices.sort_values('payment_date').copy()
        
        # Grouper par mois et calculer délai moyen
        sorted_invoices['year_month'] = sorted_invoices['payment_date'].dt.to_period('M')
        monthly_delays = sorted_invoices.groupby('year_month')['delay_days'].mean()
        
        if len(monthly_delays) < 3:
            # Pas assez de mois pour tendance
            return "stable", 0.0
        
        # Préparer données pour régression linéaire
        x = np.arange(len(monthly_delays))
        y = monthly_delays.values
        
        # Régression linéaire
        try:
            coefficients = np.polyfit(x, y, 1)
            slope = float(coefficients[0])  # Pente en jours/mois
            
            # Déterminer tendance
            if slope > 3:
                trend = "worsening"
            elif slope < -3:
                trend = "improving"
            else:
                trend = "stable"
            
            return trend, slope
        except:
            return "stable", 0.0
    
    def _calculate_reliability_score(self, pattern_data: Dict) -> float:
        """
        Calcule un score de fiabilité 0-100.
        
        Formule pondérée:
        - 40% : Taux paiements à temps
        - 30% : Stabilité (1 - normalized_std)
        - 20% : Tendance (bonus si improving, malus si worsening)
        - 10% : Absence paiements partiels
        
        Args:
            pattern_data: Dict avec on_time_rate, std_delay_days, trend, has_partial_payments
            
        Returns:
            Score 0-100
        """
        # Extraire données
        on_time_rate = pattern_data.get('on_time_rate', 0.0)
        std_delay_days = pattern_data.get('std_delay_days', 0.0)
        trend = pattern_data.get('trend', 'stable')
        has_partial_payments = pattern_data.get('has_partial_payments', False)
        
        # Score timing (40 points max)
        score_timing = on_time_rate * 40
        
        # Score stabilité (30 points max)
        # Normaliser std : 0 jours = 30 points, 30+ jours = 0 points
        normalized_std = min(std_delay_days / 30, 1.0)
        score_stability = (1 - normalized_std) * 30
        
        # Score tendance (20 points max)
        if trend == "improving":
            score_trend = 20
        elif trend == "stable":
            score_trend = 10
        else:  # worsening
            score_trend = 0
        
        # Score comportement (10 points max)
        score_behavior = 0 if has_partial_payments else 10
        
        # Score total
        total_score = score_timing + score_stability + score_trend + score_behavior
        
        # Limiter à 0-100
        return max(0.0, min(100.0, total_score))
    
    def get_all_clients_summary(self) -> List[Dict]:
        """
        Retourne résumé de tous les clients.
        Utile pour dashboard.
        
        Returns:
            Liste de dicts triée par risk_level (critical first)
        """
        # Récupérer liste unique des clients
        client_ids = self.paid_invoices['client_id'].unique()
        
        summaries = []
        for client_id in client_ids:
            try:
                pattern = self.analyze_client(client_id)
                # Convertir en dict
                summary = {
                    'client_id': pattern.client_id,
                    'client_name': pattern.client_name,
                    'avg_delay_days': pattern.avg_delay_days,
                    'std_delay_days': pattern.std_delay_days,
                    'on_time_rate': pattern.on_time_rate,
                    'late_rate': pattern.late_rate,
                    'trend': pattern.trend,
                    'trend_slope': pattern.trend_slope,
                    'reliability_score': pattern.reliability_score,
                    'risk_level': pattern.risk_level,
                    'total_invoices': pattern.total_invoices,
                    'has_partial_payments': pattern.has_partial_payments
                }
                summaries.append(summary)
            except Exception as e:
                # Skip clients avec erreurs
                continue
        
        # Trier par risk_level (critical > high > medium > low)
        risk_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        summaries.sort(key=lambda x: (risk_order.get(x['risk_level'], 4), -x['reliability_score']))
        
        return summaries
    
    def detect_degradation(self, client_id: str, threshold_days: int = 10) -> Optional[Dict]:
        """
        Détecte si un client montre une dégradation récente.
        Compare 3 derniers mois vs 6 mois précédents.
        
        Args:
            client_id: ID du client
            threshold_days: Seuil dégradation en jours (défaut 10)
            
        Returns:
            None si pas de dégradation, sinon dict avec:
            {
                "client_id": str,
                "degradation_days": float,
                "recent_avg": float,
                "historical_avg": float,
                "severity": str  # "low" | "medium" | "high"
            }
        """
        # Filtrer factures du client
        client_invoices = self.paid_invoices[
            self.paid_invoices['client_id'] == client_id
        ].copy()
        
        if len(client_invoices) < 10:
            # Pas assez d'historique pour détecter dégradation
            return None
        
        # Trier par date
        client_invoices = client_invoices.sort_values('payment_date')
        
        # Date de référence (aujourd'hui ou dernière facture)
        reference_date = client_invoices['payment_date'].max()
        
        # Séparer périodes
        three_months_ago = reference_date - timedelta(days=90)
        nine_months_ago = reference_date - timedelta(days=270)
        
        recent_invoices = client_invoices[
            client_invoices['payment_date'] >= three_months_ago
        ]
        historical_invoices = client_invoices[
            (client_invoices['payment_date'] < three_months_ago) &
            (client_invoices['payment_date'] >= nine_months_ago)
        ]
        
        if len(recent_invoices) < 3 or len(historical_invoices) < 3:
            # Pas assez de données dans chaque période
            return None
        
        # Calculer délais moyens
        recent_avg = float(recent_invoices['delay_days'].mean())
        historical_avg = float(historical_invoices['delay_days'].mean())
        
        # Calculer dégradation
        degradation_days = recent_avg - historical_avg
        
        # Vérifier si dégradation significative
        if degradation_days <= threshold_days:
            return None
        
        # Déterminer severity
        if degradation_days < 20:
            severity = "low"
        elif degradation_days < 30:
            severity = "medium"
        else:
            severity = "high"
        
        return {
            "client_id": client_id,
            "degradation_days": degradation_days,
            "recent_avg": recent_avg,
            "historical_avg": historical_avg,
            "severity": severity
        }


# ============================================================================
# TESTS
# ============================================================================

def _create_test_data() -> pd.DataFrame:
    """Crée données de test pour valider le module"""
    data = []
    base_date = datetime(2025, 1, 1)
    
    # Client A: Très fiable (toujours à temps ou léger retard)
    for i in range(20):
        data.append({
            'client_id': 'CLIENT_A',
            'client_name': 'Client Fiable SA',
            'invoice_id': f'INV_A_{i}',
            'due_date': base_date + timedelta(days=i*15),
            'payment_date': base_date + timedelta(days=i*15 + np.random.randint(-2, 3)),
            'amount': 10000,
            'amount_paid': 10000,
            'status': 'paid'
        })
    
    # Client B: Retards croissants (trend worsening)
    for i in range(20):
        delay = 5 + i * 2  # Retard qui augmente progressivement
        data.append({
            'client_id': 'CLIENT_B',
            'client_name': 'Client Dégradé SARL',
            'invoice_id': f'INV_B_{i}',
            'due_date': base_date + timedelta(days=i*15),
            'payment_date': base_date + timedelta(days=i*15 + delay),
            'amount': 15000,
            'amount_paid': 15000,
            'status': 'paid'
        })
    
    # Client C: Paiements partiels fréquents
    for i in range(20):
        amount = 20000
        amount_paid = amount if i % 3 != 0 else amount * 0.7  # Partiel 1 fois sur 3
        data.append({
            'client_id': 'CLIENT_C',
            'client_name': 'Client Partiel SAS',
            'invoice_id': f'INV_C_{i}',
            'due_date': base_date + timedelta(days=i*15),
            'payment_date': base_date + timedelta(days=i*15 + np.random.randint(10, 25)),
            'amount': amount,
            'amount_paid': amount_paid,
            'status': 'paid'
        })
    
    return pd.DataFrame(data)


def _test_analyze_client():
    """Test analyse d'un client"""
    print("\n🧪 Test analyze_client()...")
    
    # Créer données test
    df = _create_test_data()
    analyzer = ClientPaymentAnalyzer(df)
    
    # Test Client A (fiable)
    pattern_a = analyzer.analyze_client('CLIENT_A')
    print(f"  Client A - Reliability: {pattern_a.reliability_score:.1f}, Risk: {pattern_a.risk_level}")
    assert pattern_a.reliability_score > 85, "Client A devrait avoir score > 85"
    assert pattern_a.risk_level == "low", "Client A devrait être low risk"
    assert pattern_a.trend in ["stable", "improving"], "Client A devrait être stable/improving"
    
    # Test Client B (dégradation)
    pattern_b = analyzer.analyze_client('CLIENT_B')
    print(f"  Client B - Reliability: {pattern_b.reliability_score:.1f}, Risk: {pattern_b.risk_level}, Trend: {pattern_b.trend}")
    assert pattern_b.trend == "worsening", "Client B devrait avoir trend worsening"
    assert pattern_b.reliability_score < 60, "Client B devrait avoir score < 60"
    assert pattern_b.trend_slope > 0, "Client B devrait avoir slope positive"
    
    # Test Client C (paiements partiels)
    pattern_c = analyzer.analyze_client('CLIENT_C')
    print(f"  Client C - Reliability: {pattern_c.reliability_score:.1f}, Partial payments: {pattern_c.has_partial_payments}")
    assert pattern_c.has_partial_payments, "Client C devrait avoir paiements partiels"
    assert pattern_c.partial_payment_count > 0, "Client C devrait avoir count > 0"
    
    print("  ✅ Test analyze_client PASSED")


def _test_detect_degradation():
    """Test détection dégradation"""
    print("\n🧪 Test detect_degradation()...")
    
    # Créer données avec dégradation progressive
    df = _create_test_data()
    analyzer = ClientPaymentAnalyzer(df)
    
    # Client B a une dégradation
    degradation = analyzer.detect_degradation('CLIENT_B', threshold_days=10)
    assert degradation is not None, "Dégradation devrait être détectée pour Client B"
    assert degradation['degradation_days'] > 10, "Dégradation devrait être > 10 jours"
    assert degradation['severity'] in ['low', 'medium', 'high'], "Severity invalide"
    print(f"  Dégradation détectée: {degradation['degradation_days']:.1f} jours, severity: {degradation['severity']}")
    
    # Client A ne devrait pas avoir de dégradation
    degradation_a = analyzer.detect_degradation('CLIENT_A', threshold_days=10)
    assert degradation_a is None, "Client A ne devrait pas avoir de dégradation"
    
    print("  ✅ Test detect_degradation PASSED")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS payment_patterns.py")
    print("=" * 60)
    
    try:
        _test_analyze_client()
        print("✅ Test analyze_client OK")
    except AssertionError as e:
        print(f"❌ Test analyze_client FAILED: {e}")
    except Exception as e:
        print(f"⚠️  Test analyze_client ERROR: {e}")
    
    try:
        _test_detect_degradation()
        print("✅ Test detect_degradation OK")
    except AssertionError as e:
        print(f"❌ Test detect_degradation FAILED: {e}")
    except Exception as e:
        print(f"⚠️  Test detect_degradation ERROR: {e}")
    
    print("\n" + "=" * 60)
    print("TESTS TERMINÉS")
    print("=" * 60)


if __name__ == "__main__":
    _run_all_tests()

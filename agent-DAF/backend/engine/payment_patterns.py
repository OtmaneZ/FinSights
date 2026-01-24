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
        # TODO: Convertir dates en datetime
        # TODO: Calculer delay_days pour chaque facture
        # TODO: Filtrer factures payées uniquement
        raise NotImplementedError("TODO: Implémenter _prepare_data()")
    
    def analyze_client(self, client_id: str) -> ClientPaymentPattern:
        """
        Analyse complète du pattern de paiement d'un client.
        
        Args:
            client_id: ID du client à analyser
            
        Returns:
            ClientPaymentPattern avec toutes les métriques
        """
        # TODO: Filtrer factures du client
        # TODO: Calculer statistiques de base (avg, std, median)
        # TODO: Calculer taux (on_time_rate, late_rate, very_late_rate)
        # TODO: Analyser tendance avec _calculate_trend()
        # TODO: Détecter comportements anormaux (paiements partiels)
        # TODO: Calculer reliability_score avec _calculate_reliability_score()
        # TODO: Déterminer risk_level basé sur score
        # TODO: Construire et retourner ClientPaymentPattern
        raise NotImplementedError("TODO: Implémenter analyze_client()")
    
    def _calculate_trend(self, client_invoices: pd.DataFrame) -> tuple[str, float]:
        """
        Calcule la tendance des délais (amélioration/dégradation).
        
        Args:
            client_invoices: Factures du client triées par date
            
        Returns:
            (trend, slope) où trend = "stable"|"improving"|"worsening"
            slope = pente en jours/mois
        """
        # TODO: Grouper factures par mois
        # TODO: Calculer délai moyen par mois
        # TODO: Faire régression linéaire (np.polyfit)
        # TODO: Déterminer si tendance significative:
        #       - slope > 3 jours/mois = "worsening"
        #       - slope < -3 jours/mois = "improving"
        #       - sinon = "stable"
        # TODO: Retourner (trend, slope)
        raise NotImplementedError("TODO: Implémenter _calculate_trend()")
    
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
        # TODO: Extraire données du dict
        # TODO: Calculer score_timing = on_time_rate * 40
        # TODO: Calculer score_stability = (1 - std/30) * 30  # normaliser std
        # TODO: Calculer score_trend:
        #       - improving: +20
        #       - stable: +10
        #       - worsening: 0
        # TODO: Calculer score_behavior = 10 si pas partial payments, sinon 0
        # TODO: Sommer et limiter à 0-100
        raise NotImplementedError("TODO: Implémenter _calculate_reliability_score()")
    
    def get_all_clients_summary(self) -> List[Dict]:
        """
        Retourne résumé de tous les clients.
        Utile pour dashboard.
        
        Returns:
            Liste de dicts triée par risk_level (critical first)
        """
        # TODO: Récupérer liste unique client_ids
        # TODO: Pour chaque client, appeler analyze_client()
        # TODO: Convertir ClientPaymentPattern en dict
        # TODO: Trier par risk_level: critical > high > medium > low
        # TODO: Retourner liste
        raise NotImplementedError("TODO: Implémenter get_all_clients_summary()")
    
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
        # TODO: Filtrer factures du client
        # TODO: Séparer 3 derniers mois vs 6-12 mois avant
        # TODO: Calculer avg_delay pour chaque période
        # TODO: Calculer différence
        # TODO: Si différence > threshold_days:
        #       - Déterminer severity (10-20j=low, 20-30j=medium, >30j=high)
        #       - Retourner dict avec détails
        # TODO: Sinon retourner None
        raise NotImplementedError("TODO: Implémenter detect_degradation()")


# ============================================================================
# TESTS
# ============================================================================

def _create_test_data() -> pd.DataFrame:
    """Crée données de test pour valider le module"""
    # TODO: Créer DataFrame avec 3 clients fictifs:
    #       - Client A: Très fiable (toujours à temps)
    #       - Client B: Retards croissants (worsening trend)
    #       - Client C: Paiements partiels fréquents
    # TODO: 20 factures par client sur 12 mois
    raise NotImplementedError("TODO: Créer données test")


def _test_analyze_client():
    """Test analyse d'un client"""
    # TODO: Créer données test
    # TODO: Créer analyzer
    # TODO: Analyser Client A (fiable)
    # TODO: Vérifier reliability_score > 85
    # TODO: Vérifier risk_level = "low"
    # TODO: Analyser Client B (worsening)
    # TODO: Vérifier trend = "worsening"
    # TODO: Vérifier reliability_score < 60
    print("TODO: Implémenter _test_analyze_client()")


def _test_detect_degradation():
    """Test détection dégradation"""
    # TODO: Créer données avec dégradation progressive
    # TODO: Appeler detect_degradation()
    # TODO: Vérifier détection correcte
    # TODO: Vérifier calcul degradation_days
    print("TODO: Implémenter _test_detect_degradation()")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS payment_patterns.py")
    print("=" * 60)
    
    try:
        _test_analyze_client()
        print("✅ Test analyze_client OK")
    except NotImplementedError as e:
        print(f"⏳ Test analyze_client: {e}")
    
    try:
        _test_detect_degradation()
        print("✅ Test detect_degradation OK")
    except NotImplementedError as e:
        print(f"⏳ Test detect_degradation: {e}")


if __name__ == "__main__":
    _run_all_tests()

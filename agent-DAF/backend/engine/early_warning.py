"""
Système de détection précoce des risques.
Détecte signaux faibles AVANT que le risque devienne critique.
"""

from datetime import datetime, timedelta
from typing import List, Dict, Optional
import pandas as pd
from dataclasses import dataclass

from .payment_patterns import ClientPaymentAnalyzer


@dataclass
class EarlyWarning:
    """Signal d'alerte précoce"""
    warning_id: str
    client_id: str
    client_name: str
    
    # Type d'alerte
    warning_type: str              # "progressive_delay" | "partial_payments" | "frequency_increase" | etc.
    severity: str                  # "low" | "medium" | "high" | "critical"
    
    # Description
    title: str
    message: str
    evidence: str                  # Données qui prouvent l'alerte
    
    # Impact potentiel
    amount_at_risk: float
    estimated_impact_days: int     # Impact sur runway si risque se réalise
    probability: float             # Probabilité que risque se réalise (0-1)
    
    # Timing
    detected_at: datetime
    estimated_occurrence: datetime # Quand le risque va se réaliser
    days_advance_warning: int      # Jours d'avance de détection
    
    # Actions recommandées
    recommended_actions: List[str]
    urgency: str                   # "immediate" | "this_week" | "this_month"


class EarlyWarningDetector:
    """
    Détecte signaux faibles annonciateurs de risques.
    Permet d'agir AVANT que le risque devienne critique.
    """
    
    def __init__(self, payment_analyzer: ClientPaymentAnalyzer):
        """
        Args:
            payment_analyzer: Analyzer initialisé avec historique
        """
        self.analyzer = payment_analyzer
        self.warnings = []
    
    def detect_all_warnings(
        self,
        pending_invoices: pd.DataFrame
    ) -> List[EarlyWarning]:
        """
        Détecte tous les signaux faibles dans le portefeuille.
        
        Args:
            pending_invoices: DataFrame factures en attente
            
        Returns:
            Liste warnings triée par severity puis probability
        """
        warnings = []
        
        # TODO: Récupérer liste unique client_ids
        # TODO: Pour chaque client avec factures pending:
        #       - Appeler detect_progressive_delay()
        #       - Appeler detect_partial_payments()
        #       - Appeler detect_payment_frequency_increase()
        #       - Appeler detect_concentration_risk()
        #       - Appeler detect_seasonal_risk()
        # TODO: Filtrer warnings None
        # TODO: Trier par severity (critical > high > medium > low)
        #       puis par probability (desc)
        # TODO: Retourner liste
        
        raise NotImplementedError("TODO: Implémenter detect_all_warnings()")
    
    def detect_progressive_delay(self, client_id: str) -> Optional[EarlyWarning]:
        """
        Détecte si délais paiement s'allongent progressivement.
        
        Signal faible clé : Client qui rallonge doucement = tension cash
        
        Args:
            client_id: ID client à analyser
            
        Returns:
            EarlyWarning si dégradation détectée, sinon None
        """
        # TODO: Récupérer pattern client
        # TODO: Vérifier si trend == "worsening"
        # TODO: Si oui, récupérer trend_slope
        # TODO: Calculer dégradation totale sur 6 mois
        # TODO: Si dégradation > 15 jours:
        #       - Créer warning avec severity basée sur dégradation
        #       - Calculer estimated_occurrence (dans 30-60 jours)
        #       - Ajouter actions recommandées
        # TODO: Retourner warning ou None
        raise NotImplementedError("TODO: Implémenter detect_progressive_delay()")
    
    def detect_partial_payments(self, client_id: str) -> Optional[EarlyWarning]:
        """
        Détecte paiements partiels récents.
        
        Signal faible : Paiement partiel = problème trésorerie client
        
        Args:
            client_id: ID client
            
        Returns:
            EarlyWarning si comportement détecté
        """
        # TODO: Récupérer pattern client
        # TODO: Vérifier has_partial_payments
        # TODO: Vérifier partial_payment_count > 1 sur 3 derniers mois
        # TODO: Si comportement répété:
        #       - Créer warning severity "high"
        #       - Calculer amount_at_risk (factures pending)
        #       - Actions: relance anticipée, conditions paiement
        # TODO: Retourner warning ou None
        raise NotImplementedError("TODO: Implémenter detect_partial_payments()")
    
    def detect_payment_frequency_increase(self, client_id: str) -> Optional[EarlyWarning]:
        """
        Détecte augmentation fréquence demandes report.
        
        Signal faible : Demandes répétées = stress financier client
        
        Args:
            client_id: ID client
            
        Returns:
            EarlyWarning si pattern détecté
        """
        # TODO: Analyser fréquence retards (rolling window 3 mois)
        # TODO: Comparer vs moyenne historique 12 mois
        # TODO: Si augmentation > 50%:
        #       - Créer warning severity "medium"
        #       - Recommander analyse crédit client
        # TODO: Retourner warning ou None
        raise NotImplementedError("TODO: Implémenter detect_payment_frequency_increase()")
    
    def detect_concentration_risk(
        self,
        client_id: str,
        pending_invoices: pd.DataFrame,
        total_pending: float
    ) -> Optional[EarlyWarning]:
        """
        Détecte concentration excessive sur un client.
        
        Signal faible : >30% encours sur 1 client = risque systémique
        
        Args:
            client_id: ID client
            pending_invoices: Toutes factures pending
            total_pending: Total encours
            
        Returns:
            EarlyWarning si concentration > seuil
        """
        # TODO: Calculer encours client (somme factures pending)
        # TODO: Calculer % concentration = encours_client / total_pending
        # TODO: Si concentration > 30%:
        #       - Créer warning severity "high"
        #       - Calculer impact si défaut (= encours_client)
        #       - Actions: diversification, garanties
        # TODO: Si concentration > 50%: severity "critical"
        # TODO: Retourner warning ou None
        raise NotImplementedError("TODO: Implémenter detect_concentration_risk()")
    
    def detect_seasonal_risk(
        self,
        client_id: str,
        current_month: int
    ) -> Optional[EarlyWarning]:
        """
        Détecte risques liés à période difficile.
        
        Signal faible : Août/Décembre = retards prévisibles
        
        Args:
            client_id: ID client
            current_month: Mois actuel (1-12)
            
        Returns:
            EarlyWarning si période à risque
        """
        # TODO: Vérifier si current_month in [7, 8, 12]
        # TODO: Récupérer pattern client
        # TODO: Analyser historique dans ces mois
        # TODO: Si taux retard > moyenne:
        #       - Créer warning severity "medium"
        #       - Anticiper retard probable (10-20 jours)
        #       - Actions: relance préventive avant échéance
        # TODO: Retourner warning ou None
        raise NotImplementedError("TODO: Implémenter detect_seasonal_risk()")
    
    def _calculate_days_advance(
        self,
        current_date: datetime,
        estimated_occurrence: datetime
    ) -> int:
        """
        Calcule nombre de jours d'avance de la détection.
        
        Args:
            current_date: Date actuelle
            estimated_occurrence: Date prévue du risque
            
        Returns:
            Nombre de jours (positif = avance)
        """
        return (estimated_occurrence - current_date).days
    
    def _generate_warning_id(self) -> str:
        """Génère ID unique pour warning"""
        # TODO: Générer ID unique (timestamp + random)
        from uuid import uuid4
        return f"EW-{datetime.now().strftime('%Y%m%d')}-{str(uuid4())[:8]}"


# ============================================================================
# TESTS
# ============================================================================

def _test_detect_progressive_delay():
    """Test détection dégradation progressive"""
    # TODO: Créer données client avec trend worsening
    # TODO: Appeler detect_progressive_delay()
    # TODO: Vérifier warning généré
    # TODO: Vérifier severity appropriée
    print("TODO: Implémenter _test_detect_progressive_delay()")


def _test_detect_concentration_risk():
    """Test détection concentration"""
    # TODO: Créer portefeuille avec 1 client = 40% encours
    # TODO: Appeler detect_concentration_risk()
    # TODO: Vérifier warning severity "high"
    # TODO: Vérifier calcul impact correct
    print("TODO: Implémenter _test_detect_concentration_risk()")


def _test_days_advance_calculation():
    """Test calcul jours d'avance"""
    # TODO: Tester différents scénarios
    # TODO: Vérifier calculs corrects
    print("TODO: Implémenter _test_days_advance_calculation()")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS early_warning.py")
    print("=" * 60)
    
    try:
        _test_detect_progressive_delay()
        print("✅ Test progressive_delay OK")
    except NotImplementedError as e:
        print(f"⏳ Test progressive_delay: {e}")
    
    try:
        _test_detect_concentration_risk()
        print("✅ Test concentration_risk OK")
    except NotImplementedError as e:
        print(f"⏳ Test concentration_risk: {e}")
    
    try:
        _test_days_advance_calculation()
        print("✅ Test days_advance OK")
    except NotImplementedError as e:
        print(f"⏳ Test days_advance: {e}")


if __name__ == "__main__":
    _run_all_tests()

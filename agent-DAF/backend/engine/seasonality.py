"""
Ajustements saisonniers pour prévisions.
Intègre patterns saisonniers (vacances, fin d'année, etc.)
"""

from datetime import datetime
from typing import Dict, Optional


class SeasonalityAdjuster:
    """
    Applique facteurs saisonniers aux prévisions.
    """
    
    # Facteurs saisonniers par mois (1.0 = neutre)
    # Basé sur observations PME françaises
    MONTHLY_FACTORS = {
        1: 0.95,   # Janvier: reprise douce
        2: 1.00,   # Février: normal
        3: 1.05,   # Mars: bon mois
        4: 1.00,   # Avril: normal
        5: 0.95,   # Mai: ponts
        6: 1.00,   # Juin: normal
        7: 0.85,   # Juillet: vacances
        8: 0.80,   # Août: très ralenti
        9: 1.05,   # Septembre: reprise
        10: 1.00,  # Octobre: normal
        11: 1.00,  # Novembre: normal
        12: 0.90   # Décembre: fin d'année
    }
    
    # Facteurs par secteur (optionnel)
    SECTOR_ADJUSTMENTS = {
        "retail": {
            11: 1.20,  # Black Friday
            12: 1.50   # Noël
        },
        "services": {
            7: 0.70,   # Très ralenti
            8: 0.60
        },
        "industry": {
            8: 0.85    # Maintenance estivale
        }
    }
    
    def __init__(self, sector: Optional[str] = None):
        """
        Args:
            sector: Secteur activité (optionnel) - "retail" | "services" | "industry"
        """
        self.sector = sector
    
    def get_seasonal_factor(self, date: datetime) -> float:
        """
        Retourne facteur saisonnier pour une date.
        
        Args:
            date: Date à ajuster
            
        Returns:
            Facteur multiplicateur (0.6-1.5)
        """
        # TODO: Récupérer mois
        # TODO: Récupérer facteur base
        # TODO: Si sector défini, appliquer ajustement sectoriel
        # TODO: Retourner facteur final
        raise NotImplementedError("TODO: Implémenter get_seasonal_factor()")
    
    def adjust_amount(self, amount: float, date: datetime) -> float:
        """
        Ajuste montant selon saison.
        
        Args:
            amount: Montant brut
            date: Date encaissement prévu
            
        Returns:
            Montant ajusté
        """
        # TODO: Récupérer facteur saisonnier
        # TODO: Appliquer: adjusted = amount * factor
        # TODO: Retourner montant ajusté
        raise NotImplementedError("TODO: Implémenter adjust_amount()")
    
    def adjust_date(self, date: datetime, client_sector: Optional[str] = None) -> datetime:
        """
        Ajuste date si période critique.
        
        Args:
            date: Date prévue initiale
            client_sector: Secteur du client (optionnel)
            
        Returns:
            Date ajustée (peut ajouter jours si période difficile)
        """
        # TODO: Si mois in [7, 8, 12], ajouter délai
        # TODO: Juillet/Août: +7 jours
        # TODO: Décembre: +5 jours
        # TODO: Retourner date ajustée
        raise NotImplementedError("TODO: Implémenter adjust_date()")
    
    def get_risk_periods(self, year: int) -> list[tuple[datetime, datetime, str]]:
        """
        Retourne périodes à risque dans l'année.
        
        Args:
            year: Année
            
        Returns:
            Liste tuples (start_date, end_date, reason)
        """
        # TODO: Définir périodes:
        #       - Juillet-Août: vacances
        #       - 20 déc - 5 jan: fêtes
        #       - Ponts mai
        # TODO: Retourner liste
        raise NotImplementedError("TODO: Implémenter get_risk_periods()")


# ============================================================================
# TESTS
# ============================================================================

def _test_seasonal_factors():
    """Test facteurs saisonniers"""
    # TODO: Tester août (devrait être ~0.8)
    # TODO: Tester mars (devrait être ~1.05)
    # TODO: Tester décembre retail (devrait être élevé)
    print("TODO: Implémenter _test_seasonal_factors()")


def _test_adjust_amount():
    """Test ajustement montants"""
    # TODO: Tester montant août (devrait réduire)
    # TODO: Tester montant normal (devrait être proche)
    print("TODO: Implémenter _test_adjust_amount()")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS seasonality.py")
    print("=" * 60)
    
    try:
        _test_seasonal_factors()
        print("✅ Test seasonal_factors OK")
    except NotImplementedError as e:
        print(f"⏳ Test seasonal_factors: {e}")
    
    try:
        _test_adjust_amount()
        print("✅ Test adjust_amount OK")
    except NotImplementedError as e:
        print(f"⏳ Test adjust_amount: {e}")


if __name__ == "__main__":
    _run_all_tests()

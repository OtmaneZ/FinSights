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
        month = date.month
        
        # Facteur base
        factor = self.MONTHLY_FACTORS.get(month, 1.0)
        
        # Ajustement sectoriel si applicable
        if self.sector and self.sector in self.SECTOR_ADJUSTMENTS:
            sector_adjustments = self.SECTOR_ADJUSTMENTS[self.sector]
            if month in sector_adjustments:
                # Combiner facteurs (moyenne pondérée 50/50)
                sector_factor = sector_adjustments[month]
                factor = (factor + sector_factor) / 2
        
        return factor
    
    def adjust_amount(self, amount: float, date: datetime) -> float:
        """
        Ajuste montant selon saison.
        
        Args:
            amount: Montant brut
            date: Date encaissement prévu
            
        Returns:
            Montant ajusté
        """
        factor = self.get_seasonal_factor(date)
        adjusted = amount * factor
        
        return round(adjusted, 2)
    
    def adjust_date(self, date: datetime, client_sector: Optional[str] = None) -> datetime:
        """
        Ajuste date si période critique.
        
        Args:
            date: Date prévue initiale
            client_sector: Secteur du client (optionnel)
            
        Returns:
            Date ajustée (peut ajouter jours si période difficile)
        """
        from datetime import timedelta
        
        month = date.month
        adjusted_date = date
        
        # Juillet-Août : +7 jours (vacances)
        if month in [7, 8]:
            adjusted_date = date + timedelta(days=7)
        
        # Décembre : +5 jours (fêtes)
        elif month == 12:
            adjusted_date = date + timedelta(days=5)
        
        # Mai : +3 jours (ponts)
        elif month == 5:
            adjusted_date = date + timedelta(days=3)
        
        return adjusted_date
    
    def get_risk_periods(self, year: int) -> list[tuple[datetime, datetime, str]]:
        """
        Retourne périodes à risque dans l'année.
        
        Args:
            year: Année
            
        Returns:
            Liste tuples (start_date, end_date, reason)
        """
        periods = [
            # Vacances d'été
            (datetime(year, 7, 1), datetime(year, 8, 31), "Vacances d'été"),
            
            # Fêtes de fin d'année
            (datetime(year, 12, 20), datetime(year+1, 1, 5), "Fêtes de fin d'année"),
            
            # Ponts de mai
            (datetime(year, 5, 1), datetime(year, 5, 10), "Ponts de mai"),
        ]
        
        return periods


# ============================================================================
# TESTS
# ============================================================================

def _test_seasonal_factors():
    """Test facteurs saisonniers"""
    print("\n--- Test seasonal_factors() ---")
    
    adjuster = SeasonalityAdjuster()
    
    # Test août (très ralenti)
    august_factor = adjuster.get_seasonal_factor(datetime(2024, 8, 15))
    print(f"Facteur août: {august_factor} (attendu ~0.8)")
    assert 0.75 <= august_factor <= 0.85, f"Août devrait être ~0.8, obtenu {august_factor}"
    
    # Test mars (bon mois)
    march_factor = adjuster.get_seasonal_factor(datetime(2024, 3, 15))
    print(f"Facteur mars: {march_factor} (attendu ~1.05)")
    assert 1.0 <= march_factor <= 1.1, f"Mars devrait être ~1.05, obtenu {march_factor}"
    
    # Test décembre retail (élevé)
    retail_adjuster = SeasonalityAdjuster(sector="retail")
    december_retail = retail_adjuster.get_seasonal_factor(datetime(2024, 12, 15))
    print(f"Facteur décembre retail: {december_retail} (attendu élevé)")
    assert december_retail > 1.0, f"Décembre retail devrait être >1.0, obtenu {december_retail}"
    
    print("\n✅ Test seasonal_factors() passé")


def _test_adjust_amount():
    """Test ajustement montants"""
    print("\n--- Test adjust_amount() ---")
    
    adjuster = SeasonalityAdjuster()
    base_amount = 10000
    
    # Test août (devrait réduire)
    august_amount = adjuster.adjust_amount(base_amount, datetime(2024, 8, 15))
    print(f"Montant août: {august_amount}€ (base: {base_amount}€)")
    assert august_amount < base_amount, f"Montant août devrait être réduit"
    assert 7500 <= august_amount <= 8500, f"Montant août devrait être ~8000€, obtenu {august_amount}€"
    
    # Test février (normal)
    february_amount = adjuster.adjust_amount(base_amount, datetime(2024, 2, 15))
    print(f"Montant février: {february_amount}€ (base: {base_amount}€)")
    assert abs(february_amount - base_amount) < 500, \
        f"Montant février devrait être proche de {base_amount}€, obtenu {february_amount}€"
    
    # Test mars (légère hausse)
    march_amount = adjuster.adjust_amount(base_amount, datetime(2024, 3, 15))
    print(f"Montant mars: {march_amount}€ (base: {base_amount}€)")
    assert march_amount >= base_amount, f"Montant mars devrait être ≥ base"
    
    print("\n✅ Test adjust_amount() passé")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS seasonality.py")
    print("=" * 60)
    
    try:
        _test_seasonal_factors()
        print("✅ Test seasonal_factors OK")
    except AssertionError as e:
        print(f"❌ Test seasonal_factors ÉCHEC: {e}")
    except NotImplementedError as e:
        print(f"⏳ Test seasonal_factors: {e}")
    
    try:
        _test_adjust_amount()
        print("✅ Test adjust_amount OK")
    except AssertionError as e:
        print(f"❌ Test adjust_amount ÉCHEC: {e}")
    except NotImplementedError as e:
        print(f"⏳ Test adjust_amount: {e}")
    
    print("=" * 60)


if __name__ == "__main__":
    _run_all_tests()

    
    try:
        _test_adjust_amount()
        print("✅ Test adjust_amount OK")
    except NotImplementedError as e:
        print(f"⏳ Test adjust_amount: {e}")


if __name__ == "__main__":
    _run_all_tests()

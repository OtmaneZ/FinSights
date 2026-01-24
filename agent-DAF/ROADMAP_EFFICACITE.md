# 🎯 Roadmap Efficacité TRESORIS - Implémentation Rigoureuse

**Objectif :** Rendre l'agent ultra efficace dans la détection précoce des risques  
**Timeline :** 3 semaines  
**Approche :** TODOs organisés par module

---

## 📁 Structure de Dossiers Finale

```
agent-DAF/backend/
├── engine/
│   ├── finance.py                    # ✅ Existant - Calculs base
│   ├── payment_patterns.py           # 🆕 TODO - Analyse patterns clients
│   ├── smart_forecast.py             # 🆕 TODO - Prévisions intelligentes
│   ├── early_warning.py              # 🆕 TODO - Détection signaux faibles
│   ├── client_scoring.py             # 🆕 TODO - Scoring risque client
│   ├── action_optimizer.py           # 🆕 TODO - Priorisation actions
│   └── seasonality.py                # 🆕 TODO - Ajustements saisonniers
│
├── agent/
│   ├── risk_agent.py                 # ✅ Existant - Agent principal
│   └── memory_v2.py                  # ✅ Existant - Mémoire
│
├── tests/
│   ├── test_payment_patterns.py      # 🆕 TODO - Tests patterns
│   ├── test_smart_forecast.py        # 🆕 TODO - Tests prévisions
│   ├── test_client_scoring.py        # 🆕 TODO - Tests scoring
│   └── test_efficacity_metrics.py    # 🆕 TODO - Métriques efficacité
│
└── data/
    ├── customer_invoices.csv         # ✅ Existant
    └── historical_payments.csv       # 🆕 TODO - Historique paiements
```

---

## 📋 SEMAINE 1 : Analyse Patterns & Prévisions Intelligentes

### TODO 1.1 : payment_patterns.py - Analyse Historique Client
**Fichier :** `backend/engine/payment_patterns.py`  
**Dépendances :** `customer_invoices.csv`  
**Effort :** 1 jour

#### Code à implémenter :
```python
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
        pass
    
    def analyze_client(self, client_id: str) -> ClientPaymentPattern:
        """
        Analyse complète du pattern de paiement d'un client.
        
        Args:
            client_id: ID du client à analyser
            
        Returns:
            ClientPaymentPattern avec toutes les métriques
        """
        # TODO: Filtrer factures du client
        # TODO: Calculer statistiques de base
        # TODO: Analyser tendance
        # TODO: Détecter comportements anormaux
        # TODO: Calculer reliability_score
        # TODO: Déterminer risk_level
        pass
    
    def _calculate_trend(self, client_invoices: pd.DataFrame) -> tuple[str, float]:
        """
        Calcule la tendance des délais (amélioration/dégradation).
        
        Returns:
            (trend, slope) où trend = "stable"|"improving"|"worsening"
        """
        # TODO: Grouper par mois
        # TODO: Calculer délai moyen par mois
        # TODO: Régression linéaire
        # TODO: Déterminer si tendance significative
        pass
    
    def _calculate_reliability_score(self, pattern_data: Dict) -> float:
        """
        Calcule un score de fiabilité 0-100.
        
        Facteurs:
        - 40% : Taux paiements à temps
        - 30% : Stabilité (faible écart-type)
        - 20% : Tendance (improving = bonus)
        - 10% : Absence paiements partiels
        """
        # TODO: Implémenter calcul pondéré
        pass
    
    def get_all_clients_summary(self) -> List[Dict]:
        """
        Retourne résumé de tous les clients.
        Utile pour dashboard.
        """
        # TODO: Analyser tous les clients
        # TODO: Trier par risk_level
        # TODO: Retourner liste dictionnaires
        pass
    
    def detect_degradation(self, client_id: str, threshold_days: int = 10) -> Optional[Dict]:
        """
        Détecte si un client montre une dégradation récente.
        
        Args:
            threshold_days: Seuil dégradation en jours (défaut 10)
            
        Returns:
            None si pas de dégradation, sinon dict avec détails
        """
        # TODO: Comparer 3 derniers mois vs 6 mois précédents
        # TODO: Alerter si augmentation > threshold_days
        pass


# TODO: Tests unitaires
def _run_tests():
    """Tests basiques du module"""
    # TODO: Créer données test
    # TODO: Tester analyze_client
    # TODO: Tester detect_degradation
    # TODO: Vérifier calculs mathématiques
    pass


if __name__ == "__main__":
    _run_tests()
```

**Checklist TODO 1.1 :**
- [ ] Créer fichier `payment_patterns.py`
- [ ] Implémenter classe `ClientPaymentPattern` (dataclass)
- [ ] Implémenter `ClientPaymentAnalyzer.__init__`
- [ ] Implémenter `_prepare_data()`
- [ ] Implémenter `analyze_client()`
- [ ] Implémenter `_calculate_trend()`
- [ ] Implémenter `_calculate_reliability_score()`
- [ ] Implémenter `get_all_clients_summary()`
- [ ] Implémenter `detect_degradation()`
- [ ] Écrire tests unitaires
- [ ] Tester avec données réelles
- [ ] Documenter formules mathématiques

---

### TODO 1.2 : smart_forecast.py - Prévisions Intelligentes
**Fichier :** `backend/engine/smart_forecast.py`  
**Dépendances :** `payment_patterns.py`, `finance.py`  
**Effort :** 1-2 jours

#### Code à implémenter :
```python
"""
Module de prévisions intelligentes basées sur patterns clients.
Ajuste probabilités et dates selon historique comportement.
"""

from datetime import datetime, timedelta
from typing import Dict, Optional
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
    seasonal_factor: float             # Ajustement saisonnier
    warnings: List[str]                # Alertes spécifiques


class SmartForecaster:
    """
    Génère prévisions intelligentes basées sur patterns clients.
    Plus précis que simple pondération probabilité.
    """
    
    def __init__(self, payment_analyzer: ClientPaymentAnalyzer):
        self.analyzer = payment_analyzer
    
    def forecast_invoice(
        self, 
        invoice: Dict,
        include_seasonality: bool = True
    ) -> SmartForecast:
        """
        Génère prévision intelligente pour une facture.
        
        Args:
            invoice: Dict avec invoice_id, client_id, due_date, amount
            include_seasonality: Ajuster selon saison
            
        Returns:
            SmartForecast complet
        """
        # TODO: Récupérer pattern client
        # TODO: Calculer expected_payment_date
        # TODO: Calculer probabilités
        # TODO: Calculer confiance
        # TODO: Détecter warnings
        # TODO: Ajuster saisonnalité
        pass
    
    def _calculate_expected_date(
        self,
        due_date: datetime,
        pattern: ClientPaymentPattern
    ) -> datetime:
        """Calcule date paiement attendue selon pattern"""
        # TODO: Ajouter avg_delay_days à due_date
        # TODO: Ajuster si tendance worsening
        pass
    
    def _calculate_probabilities(
        self,
        pattern: ClientPaymentPattern,
        days_until_due: int
    ) -> Dict[str, float]:
        """
        Calcule probabilités selon pattern client.
        
        Returns:
            Dict avec on_time, late, very_late, default
        """
        # TODO: Baseé sur reliability_score
        # TODO: Ajuster si trend worsening
        # TODO: Augmenter default si has_partial_payments
        pass
    
    def _assess_confidence(
        self,
        pattern: ClientPaymentPattern
    ) -> tuple[str, float]:
        """
        Évalue niveau de confiance prévision.
        
        Confiance = haute si :
        - Client fiable (reliability_score > 80)
        - Écart-type faible (comportement prévisible)
        - Tendance stable
        """
        # TODO: Calculer confidence_score
        # TODO: Déterminer confidence_level
        pass
    
    def _detect_warnings(
        self,
        invoice: Dict,
        pattern: ClientPaymentPattern
    ) -> List[str]:
        """Détecte signaux d'alerte spécifiques"""
        warnings = []
        
        # TODO: Warning si trend worsening
        # TODO: Warning si has_partial_payments
        # TODO: Warning si montant > habituel
        # TODO: Warning si période difficile (août, décembre)
        
        return warnings
    
    def forecast_portfolio(
        self,
        pending_invoices: List[Dict],
        horizon_weeks: int = 13
    ) -> Dict:
        """
        Prévisions pour tout le portefeuille.
        
        Returns:
            Dict avec prévisions agrégées par semaine
        """
        # TODO: Forecaster toutes les factures
        # TODO: Grouper par semaine
        # TODO: Calculer montants pondérés par probabilité
        # TODO: Identifier semaines à risque
        pass


# TODO: Tests
def _run_tests():
    """Tests prévisions"""
    # TODO: Tester forecast_invoice
    # TODO: Comparer vs prévisions basiques
    # TODO: Vérifier cohérence probabilités (somme = 1)
    pass
```

**Checklist TODO 1.2 :**
- [ ] Créer fichier `smart_forecast.py`
- [ ] Implémenter dataclass `SmartForecast`
- [ ] Implémenter `SmartForecaster.__init__`
- [ ] Implémenter `forecast_invoice()`
- [ ] Implémenter `_calculate_expected_date()`
- [ ] Implémenter `_calculate_probabilities()`
- [ ] Implémenter `_assess_confidence()`
- [ ] Implémenter `_detect_warnings()`
- [ ] Implémenter `forecast_portfolio()`
- [ ] Écrire tests unitaires
- [ ] Comparer précision vs méthode actuelle

---

### TODO 1.3 : early_warning.py - Détection Signaux Faibles
**Fichier :** `backend/engine/early_warning.py`  
**Dépendances :** `payment_patterns.py`  
**Effort :** 1 jour

#### Code à implémenter :
```python
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
    probability: float             # Probabilité que risque se réalise
    
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
        self.analyzer = payment_analyzer
        self.warnings = []
    
    def detect_all_warnings(
        self,
        pending_invoices: pd.DataFrame
    ) -> List[EarlyWarning]:
        """
        Détecte tous les signaux faibles.
        
        Returns:
            Liste warnings triée par severity
        """
        warnings = []
        
        # TODO: Pour chaque client avec factures pending
        # TODO: Détecter progressive_delay
        # TODO: Détecter partial_payments
        # TODO: Détecter frequency_increase
        # TODO: Détecter concentration_risk
        # TODO: Détecter seasonal_risk
        
        # TODO: Trier par severity + probability
        
        return warnings
    
    def detect_progressive_delay(self, client_id: str) -> Optional[EarlyWarning]:
        """
        Détecte si délais paiement s'allongent progressivement.
        
        Signal faible clé : Client qui rallonge doucement = tension cash
        """
        # TODO: Récupérer pattern client
        # TODO: Vérifier trend == "worsening"
        # TODO: Calculer dégradation (jours)
        # TODO: Si significatif, créer warning
        pass
    
    def detect_partial_payments(self, client_id: str) -> Optional[EarlyWarning]:
        """
        Détecte paiements partiels récents.
        
        Signal faible : Paiement partiel = problème trésorerie client
        """
        # TODO: Vérifier has_partial_payments
        # TODO: Compter occurrences récentes (3 mois)
        # TODO: Si > 1, créer warning
        pass
    
    def detect_payment_frequency_increase(self, client_id: str) -> Optional[EarlyWarning]:
        """
        Détecte augmentation fréquence demandes report.
        
        Signal faible : Demandes répétées = stress financier
        """
        # TODO: Analyser demandes de report (si données disponibles)
        # TODO: Comparer fréquence actuelle vs historique
        pass
    
    def detect_concentration_risk(
        self,
        client_id: str,
        pending_invoices: pd.DataFrame
    ) -> Optional[EarlyWarning]:
        """
        Détecte concentration excessive sur un client.
        
        Signal faible : >30% encours sur 1 client = risque systémique
        """
        # TODO: Calculer % encours client vs total
        # TODO: Si > 30%, créer warning
        # TODO: Calculer impact si défaut
        pass
    
    def detect_seasonal_risk(
        self,
        client_id: str,
        current_month: int
    ) -> Optional[EarlyWarning]:
        """
        Détecte risques liés à période difficile.
        
        Signal faible : Août/Décembre = retards prévisibles
        """
        # TODO: Vérifier si mois à risque (7, 8, 12)
        # TODO: Vérifier pattern client dans ces périodes
        # TODO: Anticiper retard probable
        pass
    
    def _calculate_days_advance(
        self,
        current_date: datetime,
        estimated_occurrence: datetime
    ) -> int:
        """Calcule jours d'avance de la détection"""
        return (estimated_occurrence - current_date).days


# TODO: Tests
def _run_tests():
    """Tests détection signaux faibles"""
    # TODO: Créer scénarios test
    # TODO: Vérifier détection progressive_delay
    # TODO: Vérifier détection partial_payments
    pass
```

**Checklist TODO 1.3 :**
- [ ] Créer fichier `early_warning.py`
- [ ] Implémenter dataclass `EarlyWarning`
- [ ] Implémenter `EarlyWarningDetector.__init__`
- [ ] Implémenter `detect_all_warnings()`
- [ ] Implémenter `detect_progressive_delay()`
- [ ] Implémenter `detect_partial_payments()`
- [ ] Implémenter `detect_payment_frequency_increase()`
- [ ] Implémenter `detect_concentration_risk()`
- [ ] Implémenter `detect_seasonal_risk()`
- [ ] Écrire tests unitaires
- [ ] Valider avec données réelles

---

## 📋 SEMAINE 2 : Scoring & Optimisation Actions

### TODO 2.1 : client_scoring.py - Score Risque Client Avancé
**Fichier :** `backend/engine/client_scoring.py`  
**Effort :** 1-2 jours

**Checklist :**
- [ ] Créer fichier `client_scoring.py`
- [ ] Classe `ClientRiskScorer`
- [ ] Méthode `calculate_risk_score()` (multi-facteurs)
- [ ] Ratings A/B/C/D
- [ ] Explications score
- [ ] Tests unitaires

---

### TODO 2.2 : action_optimizer.py - Priorisation Intelligente
**Fichier :** `backend/engine/action_optimizer.py`  
**Effort :** 1-2 jours

**Checklist :**
- [ ] Créer fichier `action_optimizer.py`
- [ ] Classe `ActionPrioritizer`
- [ ] Score impact cash + facilité
- [ ] Priorisation P1/P2/P3 intelligente
- [ ] Tests unitaires

---

### TODO 2.3 : seasonality.py - Ajustements Saisonniers
**Fichier :** `backend/engine/seasonality.py`  
**Effort :** 1 jour

**Checklist :**
- [ ] Créer fichier `seasonality.py`
- [ ] Facteurs saisonniers par mois
- [ ] Ajustement prévisions
- [ ] Tests unitaires

---

## 📋 SEMAINE 3 : Intégration & Tests

### TODO 3.1 : Intégrer dans risk_agent.py
**Fichier :** `backend/agent/risk_agent.py` (modifier existant)  
**Effort :** 2 jours

**Checklist :**
- [ ] Importer nouveaux modules
- [ ] Remplacer prévisions basiques par `SmartForecaster`
- [ ] Intégrer `EarlyWarningDetector`
- [ ] Intégrer `ClientRiskScorer`
- [ ] Intégrer `ActionPrioritizer`
- [ ] Tester agent complet

---

### TODO 3.2 : Tests Efficacité Globaux
**Fichier :** `backend/tests/test_efficacity_metrics.py`  
**Effort :** 2 jours

**Checklist :**
- [ ] Créer métriques efficacité
- [ ] Tester précision prévisions
- [ ] Tester détection précoce
- [ ] Comparer avant/après
- [ ] Documenter gains

---

### TODO 3.3 : Documentation
**Effort :** 1 jour

**Checklist :**
- [ ] Documenter formules mathématiques
- [ ] Guide utilisation nouveaux modules
- [ ] Exemples code
- [ ] README mis à jour

---

## 🎯 Métriques de Succès

À la fin des 3 semaines, mesurer :

- [ ] **Précision prévisions** : >85% précision ±7 jours
- [ ] **Détection précoce** : >80% risques détectés avec >15j avance
- [ ] **Faux positifs** : <15%
- [ ] **Actions pertinentes** : >90% actions jugées utiles

---

## 🚀 Prochaine Action

**LUNDI MATIN :**
1. Créer `backend/engine/payment_patterns.py`
2. Implémenter `ClientPaymentPattern` dataclass
3. Commencer `ClientPaymentAnalyzer`

**Prêt à commencer ?**

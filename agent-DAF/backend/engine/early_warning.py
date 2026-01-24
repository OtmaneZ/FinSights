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
        
        # Récupérer liste unique des clients avec factures pending
        client_ids = pending_invoices['client_id'].unique()
        
        # Calculer total encours pour concentration
        total_pending = pending_invoices['amount'].sum() if 'amount' in pending_invoices.columns else 1
        
        # Mois actuel pour saisonnalité
        current_month = datetime.now().month
        
        # Pour chaque client, détecter signaux faibles
        for client_id in client_ids:
            client_name = pending_invoices[pending_invoices['client_id'] == client_id]['client_name'].iloc[0] \
                if 'client_name' in pending_invoices.columns else client_id
            
            # 1. Dégradation progressive
            warning = self.detect_progressive_delay(client_id)
            if warning:
                warnings.append(warning)
            
            # 2. Paiements partiels
            warning = self.detect_partial_payments(client_id)
            if warning:
                warnings.append(warning)
            
            # 3. Augmentation fréquence retards
            warning = self.detect_payment_frequency_increase(client_id)
            if warning:
                warnings.append(warning)
            
            # 4. Risque de concentration
            client_pending = pending_invoices[pending_invoices['client_id'] == client_id]
            warning = self.detect_concentration_risk(client_id, pending_invoices, total_pending)
            if warning:
                warnings.append(warning)
            
            # 5. Risque saisonnier
            warning = self.detect_seasonal_risk(client_id, current_month)
            if warning:
                warnings.append(warning)
        
        # Trier par severity puis probability
        severity_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        warnings.sort(key=lambda w: (severity_order.get(w.severity, 4), -w.probability))
        
        return warnings
    
    def detect_progressive_delay(self, client_id: str) -> Optional[EarlyWarning]:
        """
        Détecte si délais paiement s'allongent progressivement.
        
        Signal faible clé : Client qui rallonge doucement = tension cash
        
        Args:
            client_id: ID client à analyser
            
        Returns:
            EarlyWarning si dégradation détectée, sinon None
        """
        try:
            # Récupérer pattern client
            pattern = self.analyzer.analyze_client(client_id)
            
            # Vérifier tendance
            if pattern.trend != "worsening":
                return None
            
            # Calculer dégradation totale sur 6 mois
            degradation_6_months = pattern.trend_slope * 6
            
            # Seuil : au moins 15 jours de dégradation
            if degradation_6_months < 15:
                return None
            
            # Déterminer severity
            if degradation_6_months > 30:
                severity = "high"
                probability = 0.85
            elif degradation_6_months > 20:
                severity = "medium"
                probability = 0.70
            else:
                severity = "low"
                probability = 0.55
            
            # Date occurrence estimée (dans 30-60 jours)
            estimated_occurrence = datetime.now() + timedelta(days=45)
            days_advance = self._calculate_days_advance(datetime.now(), estimated_occurrence)
            
            # Calculer montant à risque (factures futures)
            # Note: nécessiterait accès aux factures pending du client
            amount_at_risk = 0  # À améliorer avec données réelles
            
            # Actions recommandées
            recommended_actions = [
                f"Appeler {pattern.client_name} pour comprendre difficultés",
                "Proposer échéancier de paiement",
                "Sécuriser prochaines factures (acompte)",
                "Surveiller encours de près"
            ]
            
            # Urgence
            if severity == "high":
                urgency = "this_week"
            elif severity == "medium":
                urgency = "this_month"
            else:
                urgency = "this_month"
            
            return EarlyWarning(
                warning_id=self._generate_warning_id(),
                client_id=client_id,
                client_name=pattern.client_name,
                warning_type="progressive_delay",
                severity=severity,
                title=f"Dégradation progressive des délais - {pattern.client_name}",
                message=f"Les délais de paiement augmentent de {pattern.trend_slope:.1f} jours/mois. "
                        f"Dégradation totale sur 6 mois: {degradation_6_months:.0f} jours.",
                evidence=f"Trend slope: {pattern.trend_slope:.1f} j/mois, "
                        f"Délai moyen actuel: {pattern.avg_delay_days:.0f} jours",
                amount_at_risk=amount_at_risk,
                estimated_impact_days=int(degradation_6_months),
                probability=probability,
                detected_at=datetime.now(),
                estimated_occurrence=estimated_occurrence,
                days_advance_warning=days_advance,
                recommended_actions=recommended_actions,
                urgency=urgency
            )
        
        except Exception as e:
            # Client sans historique ou erreur
            return None
    
    def detect_partial_payments(self, client_id: str) -> Optional[EarlyWarning]:
        """
        Détecte paiements partiels récents.
        
        Signal faible : Paiement partiel = problème trésorerie client
        
        Args:
            client_id: ID client
            
        Returns:
            EarlyWarning si comportement détecté
        """
        try:
            # Récupérer pattern client
            pattern = self.analyzer.analyze_client(client_id)
            
            # Vérifier paiements partiels
            if not pattern.has_partial_payments:
                return None
            
            # Vérifier si comportement répété (au moins 2 occurrences)
            if pattern.partial_payment_count < 2:
                return None
            
            # Severity élevée car signal fort de problème tréso
            severity = "high"
            probability = 0.75
            
            # Date occurrence (sous 30 jours)
            estimated_occurrence = datetime.now() + timedelta(days=30)
            days_advance = self._calculate_days_advance(datetime.now(), estimated_occurrence)
            
            # Actions recommandées
            recommended_actions = [
                f"Relance anticipée avant échéance",
                "Demander confirmation capacité paiement intégral",
                "Proposer conditions de paiement adaptées",
                "Exiger acompte sur nouvelles commandes"
            ]
            
            return EarlyWarning(
                warning_id=self._generate_warning_id(),
                client_id=client_id,
                client_name=pattern.client_name,
                warning_type="partial_payments",
                severity=severity,
                title=f"Paiements partiels répétés - {pattern.client_name}",
                message=f"Le client a effectué {pattern.partial_payment_count} paiements partiels. "
                        f"Indique probable tension de trésorerie.",
                evidence=f"{pattern.partial_payment_count} paiements partiels détectés, "
                        f"Score fiabilité: {pattern.reliability_score:.0f}/100",
                amount_at_risk=0,  # À calculer avec factures pending
                estimated_impact_days=15,
                probability=probability,
                detected_at=datetime.now(),
                estimated_occurrence=estimated_occurrence,
                days_advance_warning=days_advance,
                recommended_actions=recommended_actions,
                urgency="this_week"
            )
        
        except Exception as e:
            return None
    
    def detect_payment_frequency_increase(self, client_id: str) -> Optional[EarlyWarning]:
        """
        Détecte augmentation fréquence demandes report.
        
        Signal faible : Demandes répétées = stress financier
        
        Args:
            client_id: ID client
            
        Returns:
            EarlyWarning si pattern détecté
        """
        try:
            # Récupérer pattern client
            pattern = self.analyzer.analyze_client(client_id)
            
            # Vérifier si taux de retard élevé ET en hausse
            if pattern.late_rate < 0.3:
                return None
            
            if pattern.trend != "worsening":
                return None
            
            # Calculer augmentation (basée sur trend)
            # Si late_rate élevé + trend worsening = augmentation fréquence
            increase_percentage = pattern.late_rate * 100
            
            # Seuil : au moins 30% de retards
            if increase_percentage < 30:
                return None
            
            severity = "medium"
            probability = 0.65
            
            estimated_occurrence = datetime.now() + timedelta(days=60)
            days_advance = self._calculate_days_advance(datetime.now(), estimated_occurrence)
            
            recommended_actions = [
                "Analyser santé financière du client",
                "Demander bilans comptables récents",
                "Réduire limite de crédit si nécessaire",
                "Planifier appel commercial pour évaluer situation"
            ]
            
            return EarlyWarning(
                warning_id=self._generate_warning_id(),
                client_id=client_id,
                client_name=pattern.client_name,
                warning_type="frequency_increase",
                severity=severity,
                title=f"Augmentation fréquence retards - {pattern.client_name}",
                message=f"Taux de retard de {pattern.late_rate*100:.0f}% avec tendance dégradante. "
                        f"Possible stress financier.",
                evidence=f"Late rate: {pattern.late_rate*100:.0f}%, Trend: {pattern.trend}, "
                        f"Slope: {pattern.trend_slope:.1f} j/mois",
                amount_at_risk=0,
                estimated_impact_days=20,
                probability=probability,
                detected_at=datetime.now(),
                estimated_occurrence=estimated_occurrence,
                days_advance_warning=days_advance,
                recommended_actions=recommended_actions,
                urgency="this_month"
            )
        
        except Exception as e:
            return None
    
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
        try:
            # Calculer encours client
            client_invoices = pending_invoices[pending_invoices['client_id'] == client_id]
            
            if len(client_invoices) == 0:
                return None
            
            client_pending = client_invoices['amount'].sum() if 'amount' in client_invoices.columns else 0
            
            if total_pending == 0:
                return None
            
            # Calculer concentration
            concentration = client_pending / total_pending
            
            # Seuil : 30%
            if concentration < 0.30:
                return None
            
            # Déterminer severity
            if concentration > 0.50:
                severity = "critical"
                probability = 0.90
                urgency = "immediate"
            elif concentration > 0.40:
                severity = "high"
                probability = 0.80
                urgency = "this_week"
            else:
                severity = "medium"
                probability = 0.70
                urgency = "this_month"
            
            # Récupérer pattern pour contexte
            try:
                pattern = self.analyzer.analyze_client(client_id)
                client_name = pattern.client_name
            except:
                client_name = client_id
            
            estimated_occurrence = datetime.now() + timedelta(days=90)
            days_advance = self._calculate_days_advance(datetime.now(), estimated_occurrence)
            
            # Impact = tout l'encours client si défaut
            estimated_impact_days = int(client_pending / (total_pending / 30))  # Estimation simplifiée
            
            recommended_actions = [
                "Diversifier portefeuille clients immédiatement",
                f"Demander garanties sur encours {client_name}",
                "Activer prospection nouveaux clients",
                "Réduire dépendance progressive",
                "Souscrire assurance-crédit si disponible"
            ]
            
            return EarlyWarning(
                warning_id=self._generate_warning_id(),
                client_id=client_id,
                client_name=client_name,
                warning_type="concentration_risk",
                severity=severity,
                title=f"Concentration excessive - {client_name}",
                message=f"Le client représente {concentration*100:.0f}% de l'encours total "
                        f"({client_pending:,.0f}€ sur {total_pending:,.0f}€). "
                        f"Risque systémique si défaut.",
                evidence=f"Concentration: {concentration*100:.0f}%, "
                        f"Encours client: {client_pending:,.0f}€, "
                        f"Total portefeuille: {total_pending:,.0f}€",
                amount_at_risk=client_pending,
                estimated_impact_days=estimated_impact_days,
                probability=probability,
                detected_at=datetime.now(),
                estimated_occurrence=estimated_occurrence,
                days_advance_warning=days_advance,
                recommended_actions=recommended_actions,
                urgency=urgency
            )
        
        except Exception as e:
            return None
    
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
        # Vérifier si période à risque
        if current_month not in [7, 8, 12]:
            return None
        
        try:
            # Récupérer pattern client
            pattern = self.analyzer.analyze_client(client_id)
            
            # Analyser historique : si client déjà en retard normalement,
            # risque encore plus élevé pendant périodes critiques
            if pattern.late_rate < 0.2:
                # Client généralement à temps, risque saisonnier faible
                return None
            
            # Déterminer période
            if current_month in [7, 8]:
                period_name = "vacances d'été"
                expected_delay = 15
            else:  # décembre
                period_name = "fin d'année"
                expected_delay = 10
            
            severity = "medium"
            probability = 0.60
            
            estimated_occurrence = datetime.now() + timedelta(days=expected_delay)
            days_advance = self._calculate_days_advance(datetime.now(), estimated_occurrence)
            
            recommended_actions = [
                "Relancer AVANT échéance (prévention)",
                f"Anticiper retard de {expected_delay} jours",
                "Ajuster prévisions trésorerie",
                "Planifier communications durant période"
            ]
            
            return EarlyWarning(
                warning_id=self._generate_warning_id(),
                client_id=client_id,
                client_name=pattern.client_name,
                warning_type="seasonal_risk",
                severity=severity,
                title=f"Risque saisonnier - {pattern.client_name}",
                message=f"Période à risque ({period_name}). Client avec taux retard historique "
                        f"de {pattern.late_rate*100:.0f}%. Retard supplémentaire probable.",
                evidence=f"Mois actuel: {current_month}, Late rate historique: {pattern.late_rate*100:.0f}%, "
                        f"Période: {period_name}",
                amount_at_risk=0,
                estimated_impact_days=expected_delay,
                probability=probability,
                detected_at=datetime.now(),
                estimated_occurrence=estimated_occurrence,
                days_advance_warning=days_advance,
                recommended_actions=recommended_actions,
                urgency="this_month"
            )
        
        except Exception as e:
            return None
    
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
    print("\n🧪 Test detect_progressive_delay()...")
    
    from .payment_patterns import ClientPaymentAnalyzer
    import pandas as pd
    import numpy as np
    
    # Créer données avec trend worsening
    data = []
    base_date = datetime(2025, 1, 1)
    
    for i in range(20):
        delay = 5 + i * 3  # Retard qui augmente de 3j par facture
        data.append({
            'client_id': 'CLIENT_WORSENING',
            'client_name': 'Client Dégradé',
            'invoice_id': f'INV_{i}',
            'due_date': base_date + timedelta(days=i*15),
            'payment_date': base_date + timedelta(days=i*15 + delay),
            'amount': 10000,
            'amount_paid': 10000,
            'status': 'paid'
        })
    
    df = pd.DataFrame(data)
    analyzer = ClientPaymentAnalyzer(df)
    detector = EarlyWarningDetector(analyzer)
    
    # Détecter
    warning = detector.detect_progressive_delay('CLIENT_WORSENING')
    
    assert warning is not None, "Warning devrait être généré"
    assert warning.warning_type == "progressive_delay"
    assert warning.severity in ['low', 'medium', 'high'], f"Severity invalide: {warning.severity}"
    assert warning.days_advance_warning > 0, "Devrait avoir jours d'avance"
    assert len(warning.recommended_actions) > 0, "Devrait avoir actions"
    
    print(f"  Warning: {warning.title}")
    print(f"  Severity: {warning.severity}, Probability: {warning.probability:.2f}")
    print("  ✅ Test detect_progressive_delay PASSED")


def _test_detect_concentration_risk():
    """Test détection concentration"""
    print("\n🧪 Test detect_concentration_risk()...")
    
    from .payment_patterns import ClientPaymentAnalyzer
    import pandas as pd
    
    # Créer analyzer dummy
    df_paid = pd.DataFrame([{
        'client_id': 'BIG_CLIENT',
        'client_name': 'Gros Client',
        'invoice_id': 'INV_1',
        'due_date': datetime(2025, 1, 1),
        'payment_date': datetime(2025, 1, 5),
        'amount': 10000,
        'amount_paid': 10000,
        'status': 'paid'
    }])
    
    analyzer = ClientPaymentAnalyzer(df_paid)
    detector = EarlyWarningDetector(analyzer)
    
    # Créer portefeuille avec concentration
    pending = pd.DataFrame([
        {'client_id': 'BIG_CLIENT', 'client_name': 'Gros Client', 'amount': 45000},
        {'client_id': 'SMALL_1', 'client_name': 'Petit 1', 'amount': 5000},
        {'client_id': 'SMALL_2', 'client_name': 'Petit 2', 'amount': 5000}
    ])
    
    total = 55000
    
    # Détecter
    warning = detector.detect_concentration_risk('BIG_CLIENT', pending, total)
    
    assert warning is not None, "Warning devrait être généré (45k/55k = 82%)"
    assert warning.warning_type == "concentration_risk"
    assert warning.severity in ['medium', 'high', 'critical']
    assert warning.amount_at_risk == 45000
    
    print(f"  Warning: {warning.title}")
    print(f"  Amount at risk: {warning.amount_at_risk:,.0f}€")
    print("  ✅ Test detect_concentration_risk PASSED")


def _test_days_advance_calculation():
    """Test calcul jours d'avance"""
    print("\n🧪 Test days_advance_calculation()...")
    
    from .payment_patterns import ClientPaymentAnalyzer
    import pandas as pd
    
    df = pd.DataFrame()
    analyzer = ClientPaymentAnalyzer(df)
    detector = EarlyWarningDetector(analyzer)
    
    now = datetime.now()
    future = now + timedelta(days=30)
    
    days = detector._calculate_days_advance(now, future)
    
    assert days == 30, f"Devrait être 30, got {days}"
    
    print("  ✅ Test days_advance PASSED")


def _run_all_tests():
    """Lance tous les tests du module"""
    print("=" * 60)
    print("TESTS early_warning.py")
    print("=" * 60)
    
    try:
        _test_detect_progressive_delay()
        print("✅ Test progressive_delay OK")
    except AssertionError as e:
        print(f"❌ Test progressive_delay FAILED: {e}")
    except Exception as e:
        print(f"⚠️  Test progressive_delay ERROR: {e}")
    
    try:
        _test_detect_concentration_risk()
        print("✅ Test concentration_risk OK")
    except AssertionError as e:
        print(f"❌ Test concentration_risk FAILED: {e}")
    except Exception as e:
        print(f"⚠️  Test concentration_risk ERROR: {e}")
    
    try:
        _test_days_advance_calculation()
        print("✅ Test days_advance OK")
    except AssertionError as e:
        print(f"❌ Test days_advance FAILED: {e}")
    except Exception as e:
        print(f"⚠️  Test days_advance ERROR: {e}")
    
    print("\n" + "=" * 60)
    print("TESTS TERMINÉS")
    print("=" * 60)


if __name__ == "__main__":
    _run_all_tests()

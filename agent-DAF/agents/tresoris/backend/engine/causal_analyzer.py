"""
TRESORIS V3 - Causal Analyzer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyse causale : comprend le POURQUOI, pas juste le QUOI.
Relie les effets à leurs causes profondes.

Effet démo visé :
"La trésorerie se dégrade malgré +12% de CA. Voici pourquoi."
"Le vrai problème n'est pas le CA, c'est le DSO de 3 clients."
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
import pandas as pd
import numpy as np


class CauseType(str, Enum):
    """Types de causes identifiées"""
    # Causes liées aux clients
    CLIENT_PAYMENT_DELAY = "client_payment_delay"
    CLIENT_CONCENTRATION = "client_concentration"
    CLIENT_CHURN = "client_churn"
    CLIENT_MARGIN_EROSION = "client_margin_erosion"
    
    # Causes liées aux coûts
    COST_INFLATION = "cost_inflation"
    COST_STRUCTURE = "cost_structure"
    COST_CREEP = "cost_creep"
    
    # Causes liées à l'activité
    REVENUE_DECLINE = "revenue_decline"
    REVENUE_MIX = "revenue_mix"
    VOLUME_DROP = "volume_drop"
    PRICE_EROSION = "price_erosion"
    SEASONALITY = "seasonality"
    
    # Causes structurelles
    WORKING_CAPITAL = "working_capital"
    INVESTMENT = "investment"
    FINANCING = "financing"
    
    # Causes externes
    MARKET_CONDITIONS = "market_conditions"
    COMPETITION = "competition"


class ImpactType(str, Enum):
    """Type d'impact observé"""
    CASH_POSITION = "cash_position"
    RUNWAY = "runway"
    MARGIN = "margin"
    PROFITABILITY = "profitability"
    GROWTH = "growth"


class CausalConfidence(str, Enum):
    """Niveau de confiance dans l'analyse causale"""
    HIGH = "high"           # Cause clairement identifiée avec données
    MEDIUM = "medium"       # Probable mais données partielles
    LOW = "low"             # Hypothèse à valider


@dataclass
class CausalLink:
    """Lien causal entre une cause et un effet"""
    cause_type: CauseType
    cause_description: str
    
    impact_type: ImpactType
    impact_description: str
    impact_amount: float        # Impact en €
    impact_pct: float           # Impact en %
    
    confidence: CausalConfidence
    evidence: List[str]         # Preuves qui supportent le lien
    
    # Contribution relative
    contribution_to_total: float  # % de l'effet total expliqué par cette cause
    
    # Chaîne causale
    root_cause: Optional[str]   # Cause racine si cette cause est un symptôme
    downstream_effects: List[str]  # Effets en cascade
    
    # Actionnable ?
    is_actionable: bool
    recommended_action: Optional[str]
    action_difficulty: str      # "easy" | "medium" | "hard"
    
    def to_dict(self) -> Dict:
        return {
            "cause_type": self.cause_type.value,
            "cause_description": self.cause_description,
            "impact_type": self.impact_type.value,
            "impact_description": self.impact_description,
            "impact_amount": self.impact_amount,
            "impact_pct": round(self.impact_pct * 100, 1),
            "confidence": self.confidence.value,
            "evidence": self.evidence,
            "contribution_to_total": round(self.contribution_to_total * 100, 1),
            "root_cause": self.root_cause,
            "downstream_effects": self.downstream_effects,
            "is_actionable": self.is_actionable,
            "recommended_action": self.recommended_action,
            "action_difficulty": self.action_difficulty
        }


@dataclass
class CausalChain:
    """Chaîne causale complète pour expliquer un phénomène"""
    phenomenon: str             # Ce qu'on observe
    phenomenon_value: float     # Valeur mesurée
    phenomenon_trend: str       # "degrading" | "improving" | "stable"
    
    # Causes identifiées
    causes: List[CausalLink]
    
    # Synthèse
    primary_cause: CausalLink   # Cause principale
    secondary_causes: List[CausalLink]
    
    # Couverture explicative
    total_explained_pct: float  # % du phénomène expliqué
    unexplained_pct: float      # % non expliqué
    
    # Narratif
    narrative: str              # Explication en prose
    
    def to_dict(self) -> Dict:
        return {
            "phenomenon": self.phenomenon,
            "phenomenon_value": self.phenomenon_value,
            "phenomenon_trend": self.phenomenon_trend,
            "causes": [c.to_dict() for c in self.causes],
            "primary_cause": self.primary_cause.to_dict(),
            "secondary_causes": [c.to_dict() for c in self.secondary_causes],
            "total_explained_pct": round(self.total_explained_pct * 100, 1),
            "unexplained_pct": round(self.unexplained_pct * 100, 1),
            "narrative": self.narrative
        }


@dataclass
class CausalAnalysisResult:
    """Résultat complet de l'analyse causale"""
    timestamp: datetime
    analysis_period: str
    
    # Phénomènes analysés
    causal_chains: List[CausalChain]
    
    # Causes racines identifiées
    root_causes: List[Dict]
    
    # Impact ranking
    causes_by_impact: List[Dict]  # Triées par impact €
    
    # Ce qui va arriver ensuite
    projected_consequences: List[Dict]
    
    # Fenêtre d'action
    action_window_days: int
    urgency_level: str          # "immediate" | "this_week" | "this_month"
    
    # Diagnostic synthétique
    one_line_diagnosis: str     # Le problème en 1 phrase
    detailed_diagnosis: str
    
    def to_dict(self) -> Dict:
        return {
            "timestamp": self.timestamp.isoformat(),
            "analysis_period": self.analysis_period,
            "causal_chains": [c.to_dict() for c in self.causal_chains],
            "root_causes": self.root_causes,
            "causes_by_impact": self.causes_by_impact,
            "projected_consequences": self.projected_consequences,
            "action_window_days": self.action_window_days,
            "urgency_level": self.urgency_level,
            "one_line_diagnosis": self.one_line_diagnosis,
            "detailed_diagnosis": self.detailed_diagnosis
        }


class CausalAnalyzer:
    """
    Analyseur causal intelligent.
    
    Ne dit pas juste "la tréso baisse de 50k€".
    Dit "la tréso baisse de 50k€ PARCE QUE :
    - 35k€ (70%) : 2 clients paient 30j plus tard
    - 10k€ (20%) : coûts cloud ont dérivé
    - 5k€ (10%) : effet saisonnier normal"
    
    Approche :
    1. Observer un phénomène (ex: baisse de tréso)
    2. Décomposer en facteurs contributifs
    3. Identifier les causes profondes de chaque facteur
    4. Prioriser par impact et actionnabilité
    5. Projeter les conséquences si inaction
    """
    
    def __init__(self):
        pass
    
    def analyze_cash_degradation(
        self,
        current_cash: float,
        previous_cash: float,
        period_days: int,
        client_data: Optional[pd.DataFrame] = None,
        cost_data: Optional[pd.DataFrame] = None,
        revenue_data: Optional[pd.DataFrame] = None
    ) -> CausalAnalysisResult:
        """
        Analyse les causes de dégradation de trésorerie.
        
        Args:
            current_cash: Position actuelle
            previous_cash: Position précédente
            period_days: Nombre de jours entre les deux
            client_data: Données clients avec DSO, retards
            cost_data: Données de coûts
            revenue_data: Données de revenus
        """
        
        cash_variation = current_cash - previous_cash
        cash_variation_pct = cash_variation / previous_cash if previous_cash != 0 else 0
        
        causes: List[CausalLink] = []
        
        # Analyser chaque source potentielle
        
        # 1. Analyser les retards clients
        if client_data is not None and not client_data.empty:
            client_causes = self._analyze_client_causes(client_data, cash_variation)
            causes.extend(client_causes)
        
        # 2. Analyser les coûts
        if cost_data is not None and not cost_data.empty:
            cost_causes = self._analyze_cost_causes(cost_data, cash_variation)
            causes.extend(cost_causes)
        
        # 3. Analyser les revenus
        if revenue_data is not None and not revenue_data.empty:
            revenue_causes = self._analyze_revenue_causes(revenue_data, cash_variation)
            causes.extend(revenue_causes)
        
        # 4. Ajouter effet saisonnier si applicable
        seasonal_cause = self._check_seasonality(period_days)
        if seasonal_cause:
            causes.append(seasonal_cause)
        
        # Si pas assez de données, créer une cause générique
        if not causes:
            causes.append(self._create_generic_cause(cash_variation))
        
        # Calculer les contributions
        total_explained = sum(abs(c.impact_amount) for c in causes)
        for cause in causes:
            if total_explained > 0:
                cause.contribution_to_total = abs(cause.impact_amount) / total_explained
            else:
                cause.contribution_to_total = 0
        
        # Trier par impact
        causes.sort(key=lambda c: abs(c.impact_amount), reverse=True)
        
        # Identifier cause principale et secondaires
        primary = causes[0] if causes else None
        secondary = causes[1:3] if len(causes) > 1 else []
        
        # Calculer couverture explicative
        total_explained_pct = min(1.0, total_explained / abs(cash_variation)) if cash_variation != 0 else 1.0
        
        # Créer la chaîne causale
        chain = CausalChain(
            phenomenon="Variation de trésorerie",
            phenomenon_value=cash_variation,
            phenomenon_trend="degrading" if cash_variation < 0 else "improving",
            causes=causes,
            primary_cause=primary,
            secondary_causes=secondary,
            total_explained_pct=total_explained_pct,
            unexplained_pct=1 - total_explained_pct,
            narrative=self._generate_narrative(causes, cash_variation)
        )
        
        # Identifier causes racines
        root_causes = self._identify_root_causes(causes)
        
        # Causes par impact
        causes_by_impact = [
            {
                "cause": c.cause_description,
                "impact_amount": c.impact_amount,
                "impact_pct": c.contribution_to_total,
                "actionable": c.is_actionable
            }
            for c in causes
        ]
        
        # Projeter conséquences
        consequences = self._project_consequences(causes, cash_variation, period_days)
        
        # Calculer urgence
        action_window, urgency = self._calculate_urgency(current_cash, cash_variation, period_days)
        
        # Générer diagnostic
        one_line = self._generate_one_line_diagnosis(primary, cash_variation)
        detailed = self._generate_detailed_diagnosis(causes, cash_variation, consequences)
        
        return CausalAnalysisResult(
            timestamp=datetime.now(),
            analysis_period=f"{period_days} jours",
            causal_chains=[chain],
            root_causes=root_causes,
            causes_by_impact=causes_by_impact,
            projected_consequences=consequences,
            action_window_days=action_window,
            urgency_level=urgency,
            one_line_diagnosis=one_line,
            detailed_diagnosis=detailed
        )
    
    def _analyze_client_causes(
        self,
        client_data: pd.DataFrame,
        total_variation: float
    ) -> List[CausalLink]:
        """Analyse les causes liées aux clients"""
        causes = []
        
        # Vérifier retards de paiement
        if 'days_overdue' in client_data.columns and 'amount' in client_data.columns:
            overdue = client_data[client_data['days_overdue'] > 0]
            
            if not overdue.empty:
                total_overdue = overdue['amount'].sum()
                avg_delay = overdue['days_overdue'].mean()
                top_late_clients = overdue.nlargest(3, 'amount')
                
                # Estimation impact cash : montant bloqué
                impact = -total_overdue * 0.7  # 70% impact direct sur cash
                
                evidence = [
                    f"{len(overdue)} factures en retard",
                    f"Montant total bloqué: {total_overdue:,.0f}€",
                    f"Retard moyen: {avg_delay:.0f} jours"
                ]
                
                if 'client_name' in top_late_clients.columns:
                    top_names = top_late_clients['client_name'].tolist()
                    evidence.append(f"Principaux retardataires: {', '.join(str(n) for n in top_names[:3])}")
                
                causes.append(CausalLink(
                    cause_type=CauseType.CLIENT_PAYMENT_DELAY,
                    cause_description=f"Retards de paiement clients ({len(overdue)} factures, {avg_delay:.0f}j en moyenne)",
                    impact_type=ImpactType.CASH_POSITION,
                    impact_description=f"{total_overdue:,.0f}€ bloqués en attente de paiement",
                    impact_amount=impact,
                    impact_pct=impact / total_variation if total_variation != 0 else 0,
                    confidence=CausalConfidence.HIGH,
                    evidence=evidence,
                    contribution_to_total=0,  # Calculé après
                    root_cause="Processus de recouvrement insuffisant ou clients en difficulté",
                    downstream_effects=["Réduction du runway", "Tension sur BFR", "Risque de découvert"],
                    is_actionable=True,
                    recommended_action="Relancer immédiatement les top retardataires, mettre en place acomptes",
                    action_difficulty="medium"
                ))
        
        # Vérifier concentration
        if 'amount' in client_data.columns:
            total_ar = client_data['amount'].sum()
            if total_ar > 0:
                sorted_clients = client_data.sort_values('amount', ascending=False)
                top3_amount = sorted_clients.head(3)['amount'].sum()
                concentration = top3_amount / total_ar
                
                if concentration > 0.50:  # >50% sur top 3
                    impact = -total_ar * 0.1 * (concentration - 0.4)  # Impact estimé
                    
                    causes.append(CausalLink(
                        cause_type=CauseType.CLIENT_CONCENTRATION,
                        cause_description=f"Concentration excessive: top 3 clients = {concentration*100:.0f}% des encours",
                        impact_type=ImpactType.RUNWAY,
                        impact_description="Fragilité structurelle en cas de défaut",
                        impact_amount=impact,
                        impact_pct=0.1,
                        confidence=CausalConfidence.MEDIUM,
                        evidence=[
                            f"Top 3 = {concentration*100:.0f}% du portefeuille",
                            f"Risque si défaut: {top3_amount:,.0f}€"
                        ],
                        contribution_to_total=0,
                        root_cause="Dépendance commerciale à quelques clients",
                        downstream_effects=["Vulnérabilité aux impayés", "Pouvoir de négociation réduit"],
                        is_actionable=True,
                        recommended_action="Diversifier le portefeuille, prospecter nouveaux clients",
                        action_difficulty="hard"
                    ))
        
        return causes
    
    def _analyze_cost_causes(
        self,
        cost_data: pd.DataFrame,
        total_variation: float
    ) -> List[CausalLink]:
        """Analyse les causes liées aux coûts"""
        causes = []
        
        if 'amount' in cost_data.columns and 'previous_amount' in cost_data.columns:
            cost_data['variation'] = cost_data['amount'] - cost_data['previous_amount']
            
            # Identifier les coûts en forte hausse
            increasing = cost_data[cost_data['variation'] > 0]
            
            if not increasing.empty:
                total_increase = increasing['variation'].sum()
                top_increases = increasing.nlargest(3, 'variation')
                
                impact = -total_increase  # Impact négatif sur cash
                
                evidence = []
                if 'name' in top_increases.columns:
                    for _, row in top_increases.iterrows():
                        evidence.append(f"{row['name']}: +{row['variation']:,.0f}€")
                
                causes.append(CausalLink(
                    cause_type=CauseType.COST_INFLATION,
                    cause_description=f"Hausse des coûts: +{total_increase:,.0f}€ sur la période",
                    impact_type=ImpactType.CASH_POSITION,
                    impact_description=f"Décaissements supplémentaires de {total_increase:,.0f}€",
                    impact_amount=impact,
                    impact_pct=impact / total_variation if total_variation != 0 else 0,
                    confidence=CausalConfidence.HIGH,
                    evidence=evidence,
                    contribution_to_total=0,
                    root_cause="Inflation interne ou dérive non contrôlée",
                    downstream_effects=["Érosion de la marge", "Réduction du cash disponible"],
                    is_actionable=True,
                    recommended_action="Auditer les postes en hausse, renégocier ou couper",
                    action_difficulty="medium"
                ))
        
        return causes
    
    def _analyze_revenue_causes(
        self,
        revenue_data: pd.DataFrame,
        total_variation: float
    ) -> List[CausalLink]:
        """Analyse les causes liées aux revenus"""
        causes = []
        
        if 'current' in revenue_data.columns and 'previous' in revenue_data.columns:
            current_revenue = revenue_data['current'].sum()
            previous_revenue = revenue_data['previous'].sum()
            revenue_variation = current_revenue - previous_revenue
            
            if revenue_variation < 0:  # Baisse de CA
                impact = revenue_variation * 0.3  # Impact sur cash (marge estimée 30%)
                
                causes.append(CausalLink(
                    cause_type=CauseType.REVENUE_DECLINE,
                    cause_description=f"Baisse du chiffre d'affaires: {revenue_variation:,.0f}€",
                    impact_type=ImpactType.CASH_POSITION,
                    impact_description=f"Moins de cash entrant estimé: {impact:,.0f}€",
                    impact_amount=impact,
                    impact_pct=impact / total_variation if total_variation != 0 else 0,
                    confidence=CausalConfidence.MEDIUM,
                    evidence=[
                        f"CA période actuelle: {current_revenue:,.0f}€",
                        f"CA période précédente: {previous_revenue:,.0f}€",
                        f"Variation: {revenue_variation:,.0f}€ ({revenue_variation/previous_revenue*100:.1f}%)" if previous_revenue > 0 else ""
                    ],
                    contribution_to_total=0,
                    root_cause="Perte de clients, baisse de demande, ou saisonnalité",
                    downstream_effects=["Moins d'encaissements futurs", "Pression sur la marge"],
                    is_actionable=True,
                    recommended_action="Identifier les clients perdus, intensifier la prospection",
                    action_difficulty="hard"
                ))
        
        return causes
    
    def _check_seasonality(self, period_days: int) -> Optional[CausalLink]:
        """Vérifie l'effet saisonnier"""
        current_month = datetime.now().month
        
        # Mois typiquement faibles
        weak_months = [1, 7, 8, 12]  # Janvier, été, décembre
        
        if current_month in weak_months:
            return CausalLink(
                cause_type=CauseType.SEASONALITY,
                cause_description=f"Effet saisonnier (mois {current_month})",
                impact_type=ImpactType.CASH_POSITION,
                impact_description="Baisse normale d'activité en cette période",
                impact_amount=0,  # Impact estimé à part
                impact_pct=0.1,
                confidence=CausalConfidence.MEDIUM,
                evidence=[
                    f"Mois actuel: {current_month}",
                    "Historiquement période faible"
                ],
                contribution_to_total=0.1,
                root_cause="Cycle saisonnier naturel de l'activité",
                downstream_effects=["Tension temporaire sur cash", "Reprise attendue"],
                is_actionable=False,
                recommended_action="Anticiper avec réserve de trésorerie, ajuster prévisions",
                action_difficulty="easy"
            )
        
        return None
    
    def _create_generic_cause(self, cash_variation: float) -> CausalLink:
        """Crée une cause générique si pas assez de données"""
        return CausalLink(
            cause_type=CauseType.WORKING_CAPITAL,
            cause_description="Variation du besoin en fonds de roulement",
            impact_type=ImpactType.CASH_POSITION,
            impact_description=f"Mouvement de trésorerie de {cash_variation:,.0f}€",
            impact_amount=cash_variation,
            impact_pct=1.0,
            confidence=CausalConfidence.LOW,
            evidence=["Données détaillées insuffisantes pour analyse fine"],
            contribution_to_total=1.0,
            root_cause="À analyser avec données complémentaires",
            downstream_effects=["Impact sur runway à surveiller"],
            is_actionable=True,
            recommended_action="Collecter plus de données pour analyse détaillée",
            action_difficulty="medium"
        )
    
    def _identify_root_causes(self, causes: List[CausalLink]) -> List[Dict]:
        """Identifie les causes racines"""
        root_causes = []
        
        for cause in causes:
            if cause.root_cause and cause.confidence != CausalConfidence.LOW:
                root_causes.append({
                    "cause": cause.root_cause,
                    "manifested_as": cause.cause_description,
                    "impact": cause.impact_amount,
                    "actionable": cause.is_actionable,
                    "recommended_action": cause.recommended_action
                })
        
        # Dédupliquer et trier par impact
        seen = set()
        unique_roots = []
        for rc in root_causes:
            if rc["cause"] not in seen:
                seen.add(rc["cause"])
                unique_roots.append(rc)
        
        return sorted(unique_roots, key=lambda x: abs(x["impact"]), reverse=True)
    
    def _project_consequences(
        self,
        causes: List[CausalLink],
        cash_variation: float,
        period_days: int
    ) -> List[Dict]:
        """Projette les conséquences si aucune action"""
        consequences = []
        
        # Extrapoler la tendance
        daily_burn = cash_variation / period_days if period_days > 0 else 0
        
        if daily_burn < 0:  # Cash diminue
            consequences.append({
                "horizon": "30 jours",
                "scenario": "Si tendance continue",
                "projected_impact": daily_burn * 30,
                "description": f"Perte additionnelle de {abs(daily_burn * 30):,.0f}€",
                "severity": "warning" if abs(daily_burn * 30) < 50000 else "critical"
            })
            
            consequences.append({
                "horizon": "90 jours",
                "scenario": "Si aucune action",
                "projected_impact": daily_burn * 90,
                "description": f"Perte cumulée de {abs(daily_burn * 90):,.0f}€",
                "severity": "critical"
            })
        
        # Conséquences spécifiques des causes
        for cause in causes[:2]:  # Top 2 causes
            for effect in cause.downstream_effects:
                consequences.append({
                    "horizon": "Variable",
                    "scenario": f"Effet cascade de: {cause.cause_type.value}",
                    "projected_impact": None,
                    "description": effect,
                    "severity": "warning"
                })
        
        return consequences
    
    def _calculate_urgency(
        self,
        current_cash: float,
        cash_variation: float,
        period_days: int
    ) -> Tuple[int, str]:
        """Calcule la fenêtre d'action et le niveau d'urgence"""
        
        if cash_variation >= 0:
            return 90, "this_month"
        
        daily_burn = abs(cash_variation / period_days) if period_days > 0 else 0
        
        if daily_burn == 0:
            return 90, "this_month"
        
        # Jours avant épuisement
        days_until_zero = current_cash / daily_burn
        
        if days_until_zero < 30:
            return int(days_until_zero), "immediate"
        elif days_until_zero < 60:
            return int(days_until_zero), "this_week"
        else:
            return int(days_until_zero), "this_month"
    
    def _generate_narrative(self, causes: List[CausalLink], cash_variation: float) -> str:
        """Génère un récit explicatif"""
        
        if not causes:
            return "Données insuffisantes pour analyse causale détaillée."
        
        direction = "baisse" if cash_variation < 0 else "hausse"
        amount = abs(cash_variation)
        
        narrative = f"La {direction} de {amount:,.0f}€ s'explique principalement par :\n\n"
        
        for i, cause in enumerate(causes[:3], 1):
            contribution = cause.contribution_to_total * 100
            narrative += f"{i}. {cause.cause_description} ({contribution:.0f}% de l'effet)\n"
            if cause.evidence:
                narrative += f"   Preuves: {'; '.join(cause.evidence[:2])}\n"
        
        if causes[0].is_actionable:
            narrative += f"\nAction prioritaire: {causes[0].recommended_action}"
        
        return narrative
    
    def _generate_one_line_diagnosis(
        self,
        primary_cause: Optional[CausalLink],
        cash_variation: float
    ) -> str:
        """Génère diagnostic en une ligne"""
        
        if not primary_cause:
            return f"Variation de trésorerie de {cash_variation:,.0f}€ - analyse détaillée requise."
        
        direction = "baisse" if cash_variation < 0 else "hausse"
        
        return (
            f"La {direction} de {abs(cash_variation):,.0f}€ est due à: "
            f"{primary_cause.cause_description} ({primary_cause.contribution_to_total*100:.0f}%)"
        )
    
    def _generate_detailed_diagnosis(
        self,
        causes: List[CausalLink],
        cash_variation: float,
        consequences: List[Dict]
    ) -> str:
        """Génère diagnostic détaillé"""
        
        diagnosis = "ANALYSE CAUSALE\n"
        diagnosis += "=" * 40 + "\n\n"
        
        # Constat
        direction = "dégradation" if cash_variation < 0 else "amélioration"
        diagnosis += f"CONSTAT : {direction} de {abs(cash_variation):,.0f}€\n\n"
        
        # Causes
        diagnosis += "CAUSES IDENTIFIÉES :\n"
        for i, cause in enumerate(causes, 1):
            diagnosis += f"\n{i}. {cause.cause_description}\n"
            diagnosis += f"   Impact: {cause.impact_amount:,.0f}€ ({cause.contribution_to_total*100:.0f}%)\n"
            diagnosis += f"   Confiance: {cause.confidence.value}\n"
            if cause.is_actionable:
                diagnosis += f"   Action: {cause.recommended_action}\n"
        
        # Conséquences
        if consequences:
            diagnosis += "\nCONSÉQUENCES SI INACTION :\n"
            for cons in consequences[:3]:
                diagnosis += f"- {cons['horizon']}: {cons['description']}\n"
        
        return diagnosis


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def _test_causal_analyzer():
    """Test de l'analyseur causal"""
    
    # Données de test
    client_data = pd.DataFrame({
        'client_id': ['C001', 'C002', 'C003', 'C004', 'C005'],
        'client_name': ['Acme Corp', 'TechStart', 'BigRetail', 'PME Services', 'NewClient'],
        'amount': [45000, 12000, 85000, 18000, 8000],
        'days_overdue': [0, 0, 35, 22, 0]
    })
    
    cost_data = pd.DataFrame({
        'name': ['Salaires', 'Cloud AWS', 'Marketing', 'Loyer'],
        'amount': [42000, 3500, 8000, 5500],
        'previous_amount': [42000, 2200, 6500, 5500]
    })
    
    # Analyser dégradation
    analyzer = CausalAnalyzer()
    result = analyzer.analyze_cash_degradation(
        current_cash=125000,
        previous_cash=185000,
        period_days=30,
        client_data=client_data,
        cost_data=cost_data
    )
    
    print("\n" + "="*60)
    print("CAUSAL ANALYSIS TEST")
    print("="*60)
    
    print(f"\n📊 Diagnostic en 1 ligne:")
    print(f"   {result.one_line_diagnosis}")
    
    print(f"\n🔍 Causes identifiées:")
    for cause in result.causes_by_impact:
        print(f"   • {cause['cause']}")
        print(f"     Impact: {cause['impact_amount']:,.0f}€ ({cause['impact_pct']*100:.0f}%)")
    
    print(f"\n🌱 Causes racines:")
    for root in result.root_causes:
        print(f"   • {root['cause']}")
        print(f"     → {root['recommended_action']}")
    
    print(f"\n⚠️ Conséquences si inaction:")
    for cons in result.projected_consequences[:3]:
        print(f"   • {cons['horizon']}: {cons['description']}")
    
    print(f"\n⏰ Urgence: {result.urgency_level}")
    print(f"   Fenêtre d'action: {result.action_window_days} jours")
    
    print(f"\n📝 Narratif:")
    print(result.causal_chains[0].narrative)
    
    return result


if __name__ == "__main__":
    _test_causal_analyzer()

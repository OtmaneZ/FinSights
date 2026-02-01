"""
TRESORIS V3 - Cost Drift Analyzer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyse la dérive des coûts dans le temps.
Identifie les coûts fantômes, l'effet cliquet, l'inflation interne.

Effet démo visé :
"3 lignes de coûts expliquent 71% de la dégradation du résultat."
"Vos coûts SaaS ont augmenté de 340% en 18 mois sans décision explicite."
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from enum import Enum
import pandas as pd
import numpy as np


class CostCategory(str, Enum):
    """Catégories de coûts"""
    SALARIES = "salaries"           # Masse salariale
    RENT = "rent"                   # Loyers et locaux
    SUBSCRIPTIONS = "subscriptions" # Abonnements SaaS, outils
    MARKETING = "marketing"         # Marketing et communication
    CLOUD = "cloud"                 # Infrastructure cloud
    PROFESSIONAL = "professional"   # Prestataires, consultants
    TRAVEL = "travel"               # Déplacements
    SUPPLIES = "supplies"           # Fournitures
    INSURANCE = "insurance"         # Assurances
    TAXES = "taxes"                 # Taxes et impôts
    FINANCIAL = "financial"         # Frais financiers
    OTHER = "other"                 # Autres


class CostBehavior(str, Enum):
    """Comportement d'un coût"""
    FIXED = "fixed"                 # Fixe (ne varie pas)
    VARIABLE = "variable"           # Variable (varie avec activité)
    SEMI_VARIABLE = "semi_variable" # Semi-variable
    STEP = "step"                   # Par paliers


class DriftType(str, Enum):
    """Types de dérive détectés"""
    RATCHET = "ratchet"             # Effet cliquet (monte, ne descend jamais)
    GHOST = "ghost"                 # Coût fantôme (oublié mais facturé)
    INFLATION = "inflation"         # Inflation interne (augmente sans décision)
    SCOPE_CREEP = "scope_creep"     # Glissement de périmètre
    UNNECESSARY = "unnecessary"     # Devenu inutile
    DUPLICATE = "duplicate"         # Doublon


class AlertSeverity(str, Enum):
    """Sévérité d'alerte"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class CostLine:
    """Une ligne de coût analysée"""
    cost_id: str
    name: str
    category: CostCategory
    behavior: CostBehavior
    
    # Montants
    current_amount: float           # Montant actuel (mensuel)
    amount_12m_ago: float           # Montant il y a 12 mois
    amount_6m_ago: float            # Montant il y a 6 mois
    
    # Évolution
    variation_12m: float            # Variation en € sur 12 mois
    variation_12m_pct: float        # Variation en % sur 12 mois
    variation_6m: float             # Variation en € sur 6 mois
    variation_6m_pct: float         # Variation en % sur 6 mois
    
    # Trend
    trend: str                      # "increasing" | "stable" | "decreasing"
    monthly_growth_rate: float      # Taux de croissance mensuel moyen
    
    # Analyse
    is_compressible: bool           # Peut être réduit ?
    compression_potential: float    # Économie potentielle si optimisé
    
    # Dérives détectées
    drift_types: List[DriftType]
    drift_severity: AlertSeverity
    
    # Contexte
    last_review_date: Optional[datetime]  # Dernière revue
    owner: Optional[str]            # Responsable
    notes: Optional[str]
    
    def to_dict(self) -> Dict:
        return {
            "cost_id": self.cost_id,
            "name": self.name,
            "category": self.category.value,
            "behavior": self.behavior.value,
            "current_amount": self.current_amount,
            "amount_12m_ago": self.amount_12m_ago,
            "amount_6m_ago": self.amount_6m_ago,
            "variation_12m": self.variation_12m,
            "variation_12m_pct": round(self.variation_12m_pct * 100, 1),
            "variation_6m": self.variation_6m,
            "variation_6m_pct": round(self.variation_6m_pct * 100, 1),
            "trend": self.trend,
            "monthly_growth_rate": round(self.monthly_growth_rate * 100, 2),
            "is_compressible": self.is_compressible,
            "compression_potential": self.compression_potential,
            "drift_types": [d.value for d in self.drift_types],
            "drift_severity": self.drift_severity.value,
            "last_review_date": self.last_review_date.isoformat() if self.last_review_date else None,
            "owner": self.owner,
            "notes": self.notes
        }


@dataclass
class CostDriftAlert:
    """Alerte de dérive de coût"""
    alert_id: str
    cost_line: CostLine
    drift_type: DriftType
    severity: AlertSeverity
    
    # Description
    title: str
    message: str
    evidence: str                   # Preuves chiffrées
    
    # Impact
    annual_impact: float            # Impact annuel en €
    impact_on_margin_pct: float     # Impact sur marge en points
    
    # Action
    recommended_action: str
    potential_savings: float
    effort_level: str               # "low" | "medium" | "high"
    
    def to_dict(self) -> Dict:
        return {
            "alert_id": self.alert_id,
            "cost_name": self.cost_line.name,
            "drift_type": self.drift_type.value,
            "severity": self.severity.value,
            "title": self.title,
            "message": self.message,
            "evidence": self.evidence,
            "annual_impact": self.annual_impact,
            "impact_on_margin_pct": round(self.impact_on_margin_pct, 2),
            "recommended_action": self.recommended_action,
            "potential_savings": self.potential_savings,
            "effort_level": self.effort_level
        }


@dataclass
class CostDriftAnalysisResult:
    """Résultat complet de l'analyse de dérive"""
    timestamp: datetime
    period_analyzed: str            # "12 mois" ou "6 mois"
    
    # Totaux
    total_costs_current: float
    total_costs_12m_ago: float
    total_variation: float
    total_variation_pct: float
    
    # Décomposition
    fixed_costs: float
    variable_costs: float
    fixed_costs_pct: float
    
    # Par catégorie
    costs_by_category: Dict[str, float]
    variation_by_category: Dict[str, float]
    
    # Lignes analysées
    cost_lines: List[CostLine]
    
    # Alertes
    alerts: List[CostDriftAlert]
    critical_alerts_count: int
    
    # Top contributeurs à la dérive
    top_drift_contributors: List[Dict]  # Top 5 lignes qui dérivent le plus
    
    # Potentiel d'économie
    total_compression_potential: float
    easy_wins: List[Dict]           # Économies faciles à réaliser
    
    # Effet cliquet
    ratchet_costs: List[str]        # Coûts qui ne descendent jamais
    ratchet_total: float
    
    # Coûts fantômes
    ghost_costs: List[str]          # Coûts oubliés
    ghost_total: float
    
    # Diagnostic
    diagnosis: str
    key_findings: List[str]
    
    def to_dict(self) -> Dict:
        return {
            "timestamp": self.timestamp.isoformat(),
            "period_analyzed": self.period_analyzed,
            "total_costs_current": self.total_costs_current,
            "total_costs_12m_ago": self.total_costs_12m_ago,
            "total_variation": self.total_variation,
            "total_variation_pct": round(self.total_variation_pct * 100, 1),
            "fixed_costs": self.fixed_costs,
            "variable_costs": self.variable_costs,
            "fixed_costs_pct": round(self.fixed_costs_pct * 100, 1),
            "costs_by_category": self.costs_by_category,
            "variation_by_category": self.variation_by_category,
            "cost_lines": [c.to_dict() for c in self.cost_lines],
            "alerts": [a.to_dict() for a in self.alerts],
            "critical_alerts_count": self.critical_alerts_count,
            "top_drift_contributors": self.top_drift_contributors,
            "total_compression_potential": self.total_compression_potential,
            "easy_wins": self.easy_wins,
            "ratchet_costs": self.ratchet_costs,
            "ratchet_total": self.ratchet_total,
            "ghost_costs": self.ghost_costs,
            "ghost_total": self.ghost_total,
            "diagnosis": self.diagnosis,
            "key_findings": self.key_findings
        }


class CostDriftAnalyzer:
    """
    Analyseur de dérive des coûts.
    
    Ce qui le rend puissant :
    1. Détecte l'effet cliquet (coûts qui montent sans redescendre)
    2. Identifie les coûts fantômes (facturés mais oubliés)
    3. Mesure l'inflation interne (augmentation sans décision)
    4. Calcule le potentiel de compression
    5. Priorise les actions par impact
    """
    
    # Seuils
    SIGNIFICANT_DRIFT_THRESHOLD = 0.10   # 10% de variation = significatif
    HIGH_DRIFT_THRESHOLD = 0.25          # 25% = élevé
    CRITICAL_DRIFT_THRESHOLD = 0.50      # 50% = critique
    
    GHOST_COST_THRESHOLD_MONTHS = 6      # Pas de revue depuis 6 mois
    
    # Catégories compressibles
    COMPRESSIBLE_CATEGORIES = [
        CostCategory.SUBSCRIPTIONS,
        CostCategory.MARKETING,
        CostCategory.CLOUD,
        CostCategory.PROFESSIONAL,
        CostCategory.TRAVEL,
        CostCategory.SUPPLIES
    ]
    
    def __init__(self, annual_revenue: float = None):
        """
        Args:
            annual_revenue: CA annuel (pour calculer impact sur marge)
        """
        self.annual_revenue = annual_revenue or 1000000  # 1M par défaut
    
    def analyze_cost_drift(
        self,
        costs_history: pd.DataFrame,
        cost_metadata: Optional[pd.DataFrame] = None
    ) -> CostDriftAnalysisResult:
        """
        Analyse la dérive des coûts sur l'historique.
        
        Args:
            costs_history: DataFrame avec colonnes [cost_id, name, category, date, amount]
            cost_metadata: DataFrame optionnel [cost_id, behavior, last_review, owner]
            
        Returns:
            CostDriftAnalysisResult complet
        """
        
        # Préparer données
        df = self._prepare_data(costs_history, cost_metadata)
        
        # Calculer les montants agrégés par période
        current, m6_ago, m12_ago = self._calculate_period_amounts(df)
        
        # Analyser chaque ligne de coût
        cost_lines = []
        for cost_id in df['cost_id'].unique():
            cost_data = df[df['cost_id'] == cost_id]
            line = self._analyze_cost_line(cost_data, current, m6_ago, m12_ago)
            if line:
                cost_lines.append(line)
        
        # Générer alertes
        alerts = self._generate_alerts(cost_lines)
        
        # Calculer totaux
        total_current = sum(c.current_amount for c in cost_lines)
        total_12m = sum(c.amount_12m_ago for c in cost_lines)
        total_variation = total_current - total_12m
        total_variation_pct = total_variation / total_12m if total_12m > 0 else 0
        
        # Répartition fixe/variable
        fixed = sum(c.current_amount for c in cost_lines if c.behavior == CostBehavior.FIXED)
        variable = total_current - fixed
        
        # Par catégorie
        costs_by_cat = {}
        variation_by_cat = {}
        for cat in CostCategory:
            cat_costs = [c for c in cost_lines if c.category == cat]
            if cat_costs:
                costs_by_cat[cat.value] = sum(c.current_amount for c in cat_costs)
                variation_by_cat[cat.value] = sum(c.variation_12m for c in cat_costs)
        
        # Top contributeurs à la dérive
        sorted_by_drift = sorted(cost_lines, key=lambda x: abs(x.variation_12m), reverse=True)
        top_contributors = []
        for c in sorted_by_drift[:5]:
            top_contributors.append({
                "name": c.name,
                "variation": c.variation_12m,
                "variation_pct": round(c.variation_12m_pct * 100, 1),
                "contribution_to_total_drift": round(c.variation_12m / total_variation * 100, 1) if total_variation != 0 else 0
            })
        
        # Potentiel de compression
        compression_total = sum(c.compression_potential for c in cost_lines)
        
        # Easy wins (impact élevé, effort faible)
        easy_wins = []
        for c in cost_lines:
            if c.compression_potential > 0 and c.category in self.COMPRESSIBLE_CATEGORIES:
                easy_wins.append({
                    "name": c.name,
                    "savings": c.compression_potential,
                    "action": self._suggest_quick_action(c)
                })
        easy_wins.sort(key=lambda x: x['savings'], reverse=True)
        
        # Effet cliquet
        ratchet = [c.name for c in cost_lines if DriftType.RATCHET in c.drift_types]
        ratchet_total = sum(c.current_amount for c in cost_lines if DriftType.RATCHET in c.drift_types)
        
        # Coûts fantômes
        ghosts = [c.name for c in cost_lines if DriftType.GHOST in c.drift_types]
        ghost_total = sum(c.current_amount for c in cost_lines if DriftType.GHOST in c.drift_types)
        
        # Diagnostic
        diagnosis, findings = self._generate_diagnosis(
            cost_lines, total_variation, total_variation_pct,
            ratchet, ghosts, compression_total
        )
        
        return CostDriftAnalysisResult(
            timestamp=datetime.now(),
            period_analyzed="12 mois",
            total_costs_current=total_current,
            total_costs_12m_ago=total_12m,
            total_variation=total_variation,
            total_variation_pct=total_variation_pct,
            fixed_costs=fixed,
            variable_costs=variable,
            fixed_costs_pct=fixed / total_current if total_current > 0 else 0,
            costs_by_category=costs_by_cat,
            variation_by_category=variation_by_cat,
            cost_lines=cost_lines,
            alerts=alerts,
            critical_alerts_count=len([a for a in alerts if a.severity == AlertSeverity.CRITICAL]),
            top_drift_contributors=top_contributors,
            total_compression_potential=compression_total,
            easy_wins=easy_wins[:5],
            ratchet_costs=ratchet,
            ratchet_total=ratchet_total,
            ghost_costs=ghosts,
            ghost_total=ghost_total,
            diagnosis=diagnosis,
            key_findings=findings
        )
    
    def _prepare_data(
        self,
        costs_history: pd.DataFrame,
        cost_metadata: Optional[pd.DataFrame]
    ) -> pd.DataFrame:
        """Prépare les données"""
        df = costs_history.copy()
        
        # Colonnes requises
        if 'cost_id' not in df.columns:
            df['cost_id'] = df['name'].astype(str)
        if 'category' not in df.columns:
            df['category'] = CostCategory.OTHER.value
        if 'date' not in df.columns:
            df['date'] = datetime.now()
        else:
            df['date'] = pd.to_datetime(df['date'])
        
        # Merger metadata
        if cost_metadata is not None:
            df = df.merge(cost_metadata, on='cost_id', how='left')
        
        # Valeurs par défaut
        if 'behavior' not in df.columns:
            df['behavior'] = CostBehavior.FIXED.value
        if 'last_review' not in df.columns:
            df['last_review'] = None
        if 'owner' not in df.columns:
            df['owner'] = None
        
        return df
    
    def _calculate_period_amounts(self, df: pd.DataFrame) -> Tuple[datetime, datetime, datetime]:
        """Calcule les dates de référence"""
        now = datetime.now()
        m6_ago = now - timedelta(days=180)
        m12_ago = now - timedelta(days=365)
        return now, m6_ago, m12_ago
    
    def _analyze_cost_line(
        self,
        cost_data: pd.DataFrame,
        current_date: datetime,
        m6_date: datetime,
        m12_date: datetime
    ) -> Optional[CostLine]:
        """Analyse une ligne de coût"""
        
        if cost_data.empty:
            return None
        
        # Infos de base
        first_row = cost_data.iloc[0]
        cost_id = str(first_row['cost_id'])
        name = str(first_row.get('name', cost_id))
        category = CostCategory(first_row.get('category', 'other'))
        behavior = CostBehavior(first_row.get('behavior', 'fixed'))
        
        # Trier par date
        sorted_data = cost_data.sort_values('date')
        
        # Montants par période
        current_amount = sorted_data.iloc[-1]['amount'] if not sorted_data.empty else 0
        
        # Montant il y a 6 mois (chercher le plus proche)
        m6_data = sorted_data[sorted_data['date'] <= m6_date]
        amount_6m_ago = m6_data.iloc[-1]['amount'] if not m6_data.empty else current_amount
        
        # Montant il y a 12 mois
        m12_data = sorted_data[sorted_data['date'] <= m12_date]
        amount_12m_ago = m12_data.iloc[-1]['amount'] if not m12_data.empty else amount_6m_ago
        
        # Variations
        variation_12m = current_amount - amount_12m_ago
        variation_12m_pct = variation_12m / amount_12m_ago if amount_12m_ago > 0 else 0
        variation_6m = current_amount - amount_6m_ago
        variation_6m_pct = variation_6m / amount_6m_ago if amount_6m_ago > 0 else 0
        
        # Trend
        if variation_12m_pct > 0.05:
            trend = "increasing"
        elif variation_12m_pct < -0.05:
            trend = "decreasing"
        else:
            trend = "stable"
        
        # Taux de croissance mensuel
        if amount_12m_ago > 0 and current_amount > 0:
            monthly_growth = (current_amount / amount_12m_ago) ** (1/12) - 1
        else:
            monthly_growth = 0
        
        # Compressibilité
        is_compressible = category in self.COMPRESSIBLE_CATEGORIES
        compression_potential = 0
        if is_compressible and variation_12m > 0:
            # On peut potentiellement revenir au niveau d'il y a 12 mois
            compression_potential = variation_12m * 0.7  # 70% récupérable
        
        # Détecter dérives
        drift_types = []
        
        # Effet cliquet : monte depuis 12 mois, jamais descendu
        values = sorted_data['amount'].tolist()
        if len(values) >= 3:
            is_always_increasing = all(values[i] <= values[i+1] for i in range(len(values)-1))
            if is_always_increasing and variation_12m_pct > 0.1:
                drift_types.append(DriftType.RATCHET)
        
        # Coût fantôme : pas de revue depuis longtemps
        last_review = first_row.get('last_review')
        if last_review:
            if isinstance(last_review, str):
                last_review = datetime.fromisoformat(last_review)
            months_since_review = (datetime.now() - last_review).days / 30
            if months_since_review > self.GHOST_COST_THRESHOLD_MONTHS:
                drift_types.append(DriftType.GHOST)
        else:
            # Pas de date de revue = potentiellement fantôme si stable
            if trend == "stable" and current_amount > 500:
                drift_types.append(DriftType.GHOST)
        
        # Inflation interne
        if variation_12m_pct > self.HIGH_DRIFT_THRESHOLD:
            drift_types.append(DriftType.INFLATION)
        
        # Sévérité
        if variation_12m_pct >= self.CRITICAL_DRIFT_THRESHOLD:
            severity = AlertSeverity.CRITICAL
        elif variation_12m_pct >= self.HIGH_DRIFT_THRESHOLD:
            severity = AlertSeverity.HIGH
        elif variation_12m_pct >= self.SIGNIFICANT_DRIFT_THRESHOLD:
            severity = AlertSeverity.MEDIUM
        else:
            severity = AlertSeverity.LOW
        
        return CostLine(
            cost_id=cost_id,
            name=name,
            category=category,
            behavior=behavior,
            current_amount=current_amount,
            amount_12m_ago=amount_12m_ago,
            amount_6m_ago=amount_6m_ago,
            variation_12m=variation_12m,
            variation_12m_pct=variation_12m_pct,
            variation_6m=variation_6m,
            variation_6m_pct=variation_6m_pct,
            trend=trend,
            monthly_growth_rate=monthly_growth,
            is_compressible=is_compressible,
            compression_potential=compression_potential,
            drift_types=drift_types,
            drift_severity=severity,
            last_review_date=last_review if isinstance(last_review, datetime) else None,
            owner=first_row.get('owner'),
            notes=None
        )
    
    def _generate_alerts(self, cost_lines: List[CostLine]) -> List[CostDriftAlert]:
        """Génère les alertes de dérive"""
        alerts = []
        
        for line in cost_lines:
            if line.drift_severity in [AlertSeverity.HIGH, AlertSeverity.CRITICAL]:
                for drift_type in line.drift_types:
                    alert = self._create_alert(line, drift_type)
                    if alert:
                        alerts.append(alert)
        
        # Trier par sévérité puis impact
        alerts.sort(key=lambda a: (
            0 if a.severity == AlertSeverity.CRITICAL else 1 if a.severity == AlertSeverity.HIGH else 2,
            -a.annual_impact
        ))
        
        return alerts
    
    def _create_alert(self, line: CostLine, drift_type: DriftType) -> Optional[CostDriftAlert]:
        """Crée une alerte pour une ligne et un type de dérive"""
        
        annual_impact = line.variation_12m * 12  # Annualisé
        impact_on_margin = annual_impact / self.annual_revenue if self.annual_revenue > 0 else 0
        
        if drift_type == DriftType.RATCHET:
            return CostDriftAlert(
                alert_id=f"ALR-{line.cost_id}-RATCHET",
                cost_line=line,
                drift_type=DriftType.RATCHET,
                severity=line.drift_severity,
                title=f"Effet cliquet: {line.name}",
                message=f"Ce coût n'a jamais baissé en 12 mois malgré des variations d'activité.",
                evidence=f"Progression constante: {line.amount_12m_ago:,.0f}€ → {line.current_amount:,.0f}€ (+{line.variation_12m_pct*100:.0f}%)",
                annual_impact=annual_impact,
                impact_on_margin_pct=impact_on_margin * 100,
                recommended_action=f"Renégocier le contrat ou chercher alternative moins chère",
                potential_savings=line.compression_potential,
                effort_level="medium"
            )
        
        elif drift_type == DriftType.GHOST:
            return CostDriftAlert(
                alert_id=f"ALR-{line.cost_id}-GHOST",
                cost_line=line,
                drift_type=DriftType.GHOST,
                severity=AlertSeverity.MEDIUM,
                title=f"Coût fantôme: {line.name}",
                message=f"Ce coût n'a pas été revu depuis plus de 6 mois. Est-il toujours nécessaire ?",
                evidence=f"Montant mensuel: {line.current_amount:,.0f}€ × 12 = {line.current_amount*12:,.0f}€/an",
                annual_impact=line.current_amount * 12,
                impact_on_margin_pct=(line.current_amount * 12 / self.annual_revenue) * 100,
                recommended_action=f"Auditer l'utilisation et la nécessité de ce coût",
                potential_savings=line.current_amount * 12 * 0.5,  # 50% potentiellement économisable
                effort_level="low"
            )
        
        elif drift_type == DriftType.INFLATION:
            return CostDriftAlert(
                alert_id=f"ALR-{line.cost_id}-INFLATION",
                cost_line=line,
                drift_type=DriftType.INFLATION,
                severity=line.drift_severity,
                title=f"Inflation interne: {line.name}",
                message=f"Ce coût a augmenté de {line.variation_12m_pct*100:.0f}% sans décision explicite.",
                evidence=f"Évolution: {line.amount_12m_ago:,.0f}€ → {line.current_amount:,.0f}€ en 12 mois",
                annual_impact=annual_impact,
                impact_on_margin_pct=impact_on_margin * 100,
                recommended_action=f"Identifier la cause et mettre un plafond budgétaire",
                potential_savings=line.compression_potential,
                effort_level="medium"
            )
        
        return None
    
    def _suggest_quick_action(self, cost_line: CostLine) -> str:
        """Suggère une action rapide pour un coût"""
        if cost_line.category == CostCategory.SUBSCRIPTIONS:
            return "Auditer les licences inutilisées, renégocier ou résilier"
        elif cost_line.category == CostCategory.CLOUD:
            return "Optimiser les instances, réserver les ressources, supprimer le non-utilisé"
        elif cost_line.category == CostCategory.MARKETING:
            return "Mesurer le ROI par canal, couper ce qui ne convertit pas"
        elif cost_line.category == CostCategory.PROFESSIONAL:
            return "Internaliser ou renégocier les tarifs"
        elif cost_line.category == CostCategory.TRAVEL:
            return "Passer en visio, négocier tarifs corporate"
        else:
            return "Analyser la nécessité et chercher alternatives"
    
    def _generate_diagnosis(
        self,
        cost_lines: List[CostLine],
        total_variation: float,
        total_variation_pct: float,
        ratchet_costs: List[str],
        ghost_costs: List[str],
        compression_potential: float
    ) -> Tuple[str, List[str]]:
        """Génère le diagnostic"""
        
        findings = []
        
        # Variation totale
        if total_variation_pct > 0.20:
            findings.append(f"🔴 Coûts en dérive critique: +{total_variation_pct*100:.0f}% en 12 mois (+{total_variation:,.0f}€)")
        elif total_variation_pct > 0.10:
            findings.append(f"🟡 Coûts en hausse significative: +{total_variation_pct*100:.0f}% en 12 mois")
        elif total_variation_pct > 0:
            findings.append(f"🟢 Coûts en légère hausse: +{total_variation_pct*100:.1f}%")
        else:
            findings.append(f"✅ Coûts maîtrisés: {total_variation_pct*100:.1f}%")
        
        # Top 3 contributeurs
        sorted_lines = sorted(cost_lines, key=lambda x: abs(x.variation_12m), reverse=True)
        if sorted_lines and total_variation != 0:
            top3 = sorted_lines[:3]
            top3_contribution = sum(c.variation_12m for c in top3) / total_variation * 100 if total_variation != 0 else 0
            top3_names = [c.name for c in top3]
            findings.append(
                f"📊 {len(top3)} postes expliquent {abs(top3_contribution):.0f}% de la variation: {', '.join(top3_names)}"
            )
        
        # Effet cliquet
        if ratchet_costs:
            findings.append(f"⚠️ Effet cliquet sur {len(ratchet_costs)} poste(s): {', '.join(ratchet_costs[:3])}")
        
        # Coûts fantômes
        if ghost_costs:
            findings.append(f"👻 {len(ghost_costs)} coût(s) fantôme(s) détecté(s): {', '.join(ghost_costs[:3])}")
        
        # Potentiel
        if compression_potential > 0:
            findings.append(f"💰 Potentiel d'économie identifié: {compression_potential:,.0f}€/an")
        
        # Diagnostic principal
        if total_variation_pct > 0.20:
            diagnosis = (
                f"Structure de coûts en dérive. "
                f"Sans action, la marge sera impactée de {total_variation_pct*100:.0f} points. "
                f"Priorité: auditer les {len(ratchet_costs)} coûts en cliquet."
            )
        elif ghost_costs:
            diagnosis = (
                f"Coûts globalement stables mais {len(ghost_costs)} coût(s) fantôme(s) identifié(s). "
                f"Économie rapide possible: {compression_potential:,.0f}€/an."
            )
        else:
            diagnosis = (
                f"Structure de coûts saine. "
                f"Maintenir la vigilance sur les postes en croissance."
            )
        
        return diagnosis, findings


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def _test_cost_drift_analyzer():
    """Test de l'analyseur de dérive"""
    
    # Générer données historiques (12 mois)
    dates = pd.date_range(end=datetime.now(), periods=12, freq='ME')
    
    # Différents patterns de coûts
    costs_data = []
    
    # 1. Coût stable (loyer)
    for i, date in enumerate(dates):
        costs_data.append({
            'cost_id': 'RENT-001',
            'name': 'Loyer bureaux',
            'category': 'rent',
            'date': date,
            'amount': 5500
        })
    
    # 2. Coût en cliquet (SaaS qui augmente)
    base_saas = 800
    for i, date in enumerate(dates):
        costs_data.append({
            'cost_id': 'SAAS-001',
            'name': 'Licences Salesforce',
            'category': 'subscriptions',
            'date': date,
            'amount': base_saas + (i * 100)  # +100€/mois
        })
    
    # 3. Coût fantôme (jamais revu)
    for i, date in enumerate(dates):
        costs_data.append({
            'cost_id': 'TOOL-OLD',
            'name': 'Outil legacy jamais utilisé',
            'category': 'subscriptions',
            'date': date,
            'amount': 250
        })
    
    # 4. Coût en inflation
    base_cloud = 2000
    for i, date in enumerate(dates):
        costs_data.append({
            'cost_id': 'CLOUD-001',
            'name': 'AWS Infrastructure',
            'category': 'cloud',
            'date': date,
            'amount': base_cloud * (1.05 ** i)  # +5%/mois
        })
    
    # 5. Coût variable maîtrisé
    for i, date in enumerate(dates):
        costs_data.append({
            'cost_id': 'MKT-001',
            'name': 'Google Ads',
            'category': 'marketing',
            'date': date,
            'amount': 3000 + np.random.randint(-200, 200)
        })
    
    df = pd.DataFrame(costs_data)
    
    # Metadata
    metadata = pd.DataFrame({
        'cost_id': ['RENT-001', 'SAAS-001', 'TOOL-OLD', 'CLOUD-001', 'MKT-001'],
        'behavior': ['fixed', 'fixed', 'fixed', 'variable', 'variable'],
        'last_review': [
            datetime.now() - timedelta(days=30),
            datetime.now() - timedelta(days=60),
            datetime.now() - timedelta(days=400),  # Jamais revu
            datetime.now() - timedelta(days=90),
            datetime.now() - timedelta(days=15)
        ],
        'owner': ['DAF', 'CTO', None, 'CTO', 'CMO']
    })
    
    # Analyser
    analyzer = CostDriftAnalyzer(annual_revenue=2000000)
    result = analyzer.analyze_cost_drift(df, metadata)
    
    print("\n" + "="*60)
    print("COST DRIFT ANALYSIS TEST")
    print("="*60)
    
    print(f"\n📊 Totaux:")
    print(f"   Coûts actuels: {result.total_costs_current:,.0f}€/mois")
    print(f"   Coûts il y a 12 mois: {result.total_costs_12m_ago:,.0f}€/mois")
    print(f"   Variation: {result.total_variation:+,.0f}€ ({result.total_variation_pct*100:+.1f}%)")
    
    print(f"\n⚠️ Alertes: {len(result.alerts)} ({result.critical_alerts_count} critiques)")
    for alert in result.alerts[:3]:
        print(f"   [{alert.severity.value.upper()}] {alert.title}")
        print(f"      → {alert.message}")
        print(f"      Impact: {alert.annual_impact:,.0f}€/an")
    
    print(f"\n👻 Coûts fantômes: {result.ghost_costs}")
    print(f"⚙️ Effet cliquet: {result.ratchet_costs}")
    
    print(f"\n💰 Potentiel d'économie: {result.total_compression_potential:,.0f}€/an")
    
    print(f"\n🔍 Diagnostic: {result.diagnosis}")
    
    print(f"\n📋 Findings:")
    for f in result.key_findings:
        print(f"   {f}")
    
    return result


if __name__ == "__main__":
    _test_cost_drift_analyzer()

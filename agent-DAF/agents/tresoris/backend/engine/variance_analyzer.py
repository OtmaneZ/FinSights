"""
TRESORIS V3 - Variance Analyzer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyse des écarts entre réalisé et budget/prévisions.
Comme un contrôleur de gestion classique, mais automatisé.

Effet démo visé :
"+12% de CA ce mois-ci… mais -18% de résultat opérationnel. Voici pourquoi."
"L'écart de 45k€ sur le cash est expliqué à 89% par 3 postes."
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from enum import Enum
import pandas as pd
import numpy as np


class VarianceStatus(str, Enum):
    """Statut de l'écart"""
    FAVORABLE = "favorable"         # Mieux que prévu
    UNFAVORABLE = "unfavorable"     # Moins bien que prévu
    ON_TARGET = "on_target"         # Dans la cible (±5%)
    CRITICAL = "critical"           # Écart critique


class VarianceCategory(str, Enum):
    """Catégorie d'écart"""
    REVENUE = "revenue"
    COST = "cost"
    MARGIN = "margin"
    CASH = "cash"
    VOLUME = "volume"
    PRICE = "price"
    MIX = "mix"


@dataclass
class VarianceLine:
    """Une ligne d'écart analysée"""
    line_id: str
    name: str
    category: VarianceCategory
    
    # Valeurs
    actual: float
    budget: float
    variance: float
    variance_pct: float
    
    # Status
    status: VarianceStatus
    is_material: bool               # Écart significatif ?
    
    # Analyse
    drivers: List[str]              # Explications de l'écart
    root_cause: Optional[str]
    
    # Impact
    impact_on_total: float          # Contribution à l'écart total
    
    # Action
    corrective_action: Optional[str]
    action_owner: Optional[str]
    
    def to_dict(self) -> Dict:
        return {
            "line_id": self.line_id,
            "name": self.name,
            "category": self.category.value,
            "actual": self.actual,
            "budget": self.budget,
            "variance": self.variance,
            "variance_pct": round(self.variance_pct * 100, 1),
            "status": self.status.value,
            "is_material": self.is_material,
            "drivers": self.drivers,
            "root_cause": self.root_cause,
            "impact_on_total": round(self.impact_on_total * 100, 1),
            "corrective_action": self.corrective_action,
            "action_owner": self.action_owner
        }


@dataclass
class VarianceDecomposition:
    """Décomposition volume/prix/mix"""
    total_variance: float
    
    volume_effect: float            # Effet du changement de volume
    volume_effect_pct: float
    
    price_effect: float             # Effet du changement de prix
    price_effect_pct: float
    
    mix_effect: float               # Effet du changement de mix produit/client
    mix_effect_pct: float
    
    residual: float                 # Non expliqué
    
    explanation: str
    
    def to_dict(self) -> Dict:
        return {
            "total_variance": self.total_variance,
            "volume_effect": self.volume_effect,
            "volume_effect_pct": round(self.volume_effect_pct * 100, 1),
            "price_effect": self.price_effect,
            "price_effect_pct": round(self.price_effect_pct * 100, 1),
            "mix_effect": self.mix_effect,
            "mix_effect_pct": round(self.mix_effect_pct * 100, 1),
            "residual": self.residual,
            "explanation": self.explanation
        }


@dataclass
class VarianceAnalysisResult:
    """Résultat complet de l'analyse des écarts"""
    timestamp: datetime
    period: str                     # "Janvier 2026" ou "Q1 2026"
    
    # Résumé haut niveau
    total_revenue_actual: float
    total_revenue_budget: float
    revenue_variance: float
    revenue_variance_pct: float
    revenue_status: VarianceStatus
    
    total_costs_actual: float
    total_costs_budget: float
    costs_variance: float
    costs_variance_pct: float
    costs_status: VarianceStatus
    
    operating_result_actual: float
    operating_result_budget: float
    result_variance: float
    result_variance_pct: float
    result_status: VarianceStatus
    
    cash_position_actual: float
    cash_position_budget: float
    cash_variance: float
    cash_variance_pct: float
    cash_status: VarianceStatus
    
    # Détail par ligne
    variance_lines: List[VarianceLine]
    
    # Top contributeurs
    top_favorable: List[VarianceLine]
    top_unfavorable: List[VarianceLine]
    
    # Décomposition volume/prix/mix
    revenue_decomposition: Optional[VarianceDecomposition]
    
    # Analyse des tendances
    is_trend_worsening: bool
    months_of_consecutive_miss: int
    predictability_score: float     # 0-100 : fiabilité des prévisions
    
    # Actions correctives
    corrective_actions: List[Dict]
    
    # Forecast impact
    forecast_at_risk: float         # Montant du forecast à risque
    revised_forecast: float
    
    # Diagnostic
    summary: str
    key_findings: List[str]
    
    def to_dict(self) -> Dict:
        return {
            "timestamp": self.timestamp.isoformat(),
            "period": self.period,
            "revenue": {
                "actual": self.total_revenue_actual,
                "budget": self.total_revenue_budget,
                "variance": self.revenue_variance,
                "variance_pct": round(self.revenue_variance_pct * 100, 1),
                "status": self.revenue_status.value
            },
            "costs": {
                "actual": self.total_costs_actual,
                "budget": self.total_costs_budget,
                "variance": self.costs_variance,
                "variance_pct": round(self.costs_variance_pct * 100, 1),
                "status": self.costs_status.value
            },
            "operating_result": {
                "actual": self.operating_result_actual,
                "budget": self.operating_result_budget,
                "variance": self.result_variance,
                "variance_pct": round(self.result_variance_pct * 100, 1),
                "status": self.result_status.value
            },
            "cash": {
                "actual": self.cash_position_actual,
                "budget": self.cash_position_budget,
                "variance": self.cash_variance,
                "variance_pct": round(self.cash_variance_pct * 100, 1),
                "status": self.cash_status.value
            },
            "variance_lines": [v.to_dict() for v in self.variance_lines],
            "top_favorable": [v.to_dict() for v in self.top_favorable],
            "top_unfavorable": [v.to_dict() for v in self.top_unfavorable],
            "revenue_decomposition": self.revenue_decomposition.to_dict() if self.revenue_decomposition else None,
            "is_trend_worsening": self.is_trend_worsening,
            "months_of_consecutive_miss": self.months_of_consecutive_miss,
            "predictability_score": self.predictability_score,
            "corrective_actions": self.corrective_actions,
            "forecast_at_risk": self.forecast_at_risk,
            "revised_forecast": self.revised_forecast,
            "summary": self.summary,
            "key_findings": self.key_findings
        }


class VarianceAnalyzer:
    """
    Analyseur d'écarts budget vs réalisé.
    
    Ce qui le rend puissant :
    1. Analyse multi-niveaux (revenus, coûts, marge, cash)
    2. Décomposition volume/prix/mix
    3. Identification des drivers d'écart
    4. Tendance et patterns
    5. Impact sur forecast
    6. Actions correctives priorisées
    """
    
    # Seuils
    MATERIALITY_THRESHOLD = 0.05    # 5% = écart significatif
    CRITICAL_THRESHOLD = 0.15       # 15% = écart critique
    ON_TARGET_RANGE = 0.03          # ±3% = on target
    
    def __init__(self):
        pass
    
    def analyze_variances(
        self,
        actual_data: pd.DataFrame,
        budget_data: pd.DataFrame,
        period: str = None,
        historical_data: Optional[pd.DataFrame] = None
    ) -> VarianceAnalysisResult:
        """
        Analyse complète des écarts réalisé vs budget.
        
        Args:
            actual_data: DataFrame avec [line_id, name, category, amount]
            budget_data: DataFrame avec [line_id, name, category, amount]
            period: Période analysée ("Janvier 2026")
            historical_data: Données historiques pour tendance
        """
        
        if period is None:
            period = datetime.now().strftime("%B %Y")
        
        # Merger actual et budget
        df = self._merge_data(actual_data, budget_data)
        
        # Analyser chaque ligne
        variance_lines = []
        for _, row in df.iterrows():
            line = self._analyze_line(row)
            variance_lines.append(line)
        
        # Calculer totaux
        revenues = [v for v in variance_lines if v.category == VarianceCategory.REVENUE]
        costs = [v for v in variance_lines if v.category == VarianceCategory.COST]
        
        total_rev_actual = sum(v.actual for v in revenues)
        total_rev_budget = sum(v.budget for v in revenues)
        rev_variance = total_rev_actual - total_rev_budget
        rev_variance_pct = rev_variance / total_rev_budget if total_rev_budget != 0 else 0
        
        total_cost_actual = sum(v.actual for v in costs)
        total_cost_budget = sum(v.budget for v in costs)
        cost_variance = total_cost_actual - total_cost_budget
        cost_variance_pct = cost_variance / total_cost_budget if total_cost_budget != 0 else 0
        
        op_result_actual = total_rev_actual - total_cost_actual
        op_result_budget = total_rev_budget - total_cost_budget
        result_variance = op_result_actual - op_result_budget
        result_variance_pct = result_variance / op_result_budget if op_result_budget != 0 else 0
        
        # Cash (simplifié : on prend une ligne cash si elle existe)
        cash_lines = [v for v in variance_lines if 'cash' in v.name.lower()]
        if cash_lines:
            cash_actual = cash_lines[0].actual
            cash_budget = cash_lines[0].budget
        else:
            # Estimer cash = résultat opérationnel ajusté
            cash_actual = op_result_actual * 0.8  # Simplification
            cash_budget = op_result_budget * 0.8
        
        cash_variance = cash_actual - cash_budget
        cash_variance_pct = cash_variance / cash_budget if cash_budget != 0 else 0
        
        # Status
        rev_status = self._determine_status(rev_variance_pct, is_revenue=True)
        cost_status = self._determine_status(cost_variance_pct, is_revenue=False)
        result_status = self._determine_status(result_variance_pct, is_revenue=True)
        cash_status = self._determine_status(cash_variance_pct, is_revenue=True)
        
        # Calculer contribution à l'écart total
        total_variance = abs(result_variance)
        for line in variance_lines:
            if total_variance > 0:
                line.impact_on_total = abs(line.variance) / total_variance
            else:
                line.impact_on_total = 0
        
        # Top favorable et unfavorable
        favorable = sorted(
            [v for v in variance_lines if v.status == VarianceStatus.FAVORABLE],
            key=lambda x: abs(x.variance),
            reverse=True
        )[:5]
        
        unfavorable = sorted(
            [v for v in variance_lines if v.status in [VarianceStatus.UNFAVORABLE, VarianceStatus.CRITICAL]],
            key=lambda x: abs(x.variance),
            reverse=True
        )[:5]
        
        # Décomposition volume/prix/mix (si données disponibles)
        decomposition = self._decompose_revenue_variance(
            actual_data, budget_data, rev_variance
        ) if 'volume' in actual_data.columns else None
        
        # Analyser tendance
        trend_worsening = result_variance < 0 and rev_variance < 0
        consecutive_miss = self._count_consecutive_misses(historical_data)
        predictability = self._calculate_predictability(historical_data)
        
        # Actions correctives
        actions = self._generate_corrective_actions(variance_lines, unfavorable)
        
        # Impact forecast
        forecast_at_risk = abs(result_variance) * 3 if result_variance < 0 else 0  # Simplifié
        revised_forecast = op_result_budget * 12 - forecast_at_risk  # Annualisé
        
        # Générer synthèse
        summary, findings = self._generate_summary(
            rev_variance, rev_variance_pct,
            cost_variance, cost_variance_pct,
            result_variance, result_variance_pct,
            unfavorable
        )
        
        return VarianceAnalysisResult(
            timestamp=datetime.now(),
            period=period,
            total_revenue_actual=total_rev_actual,
            total_revenue_budget=total_rev_budget,
            revenue_variance=rev_variance,
            revenue_variance_pct=rev_variance_pct,
            revenue_status=rev_status,
            total_costs_actual=total_cost_actual,
            total_costs_budget=total_cost_budget,
            costs_variance=cost_variance,
            costs_variance_pct=cost_variance_pct,
            costs_status=cost_status,
            operating_result_actual=op_result_actual,
            operating_result_budget=op_result_budget,
            result_variance=result_variance,
            result_variance_pct=result_variance_pct,
            result_status=result_status,
            cash_position_actual=cash_actual,
            cash_position_budget=cash_budget,
            cash_variance=cash_variance,
            cash_variance_pct=cash_variance_pct,
            cash_status=cash_status,
            variance_lines=variance_lines,
            top_favorable=favorable,
            top_unfavorable=unfavorable,
            revenue_decomposition=decomposition,
            is_trend_worsening=trend_worsening,
            months_of_consecutive_miss=consecutive_miss,
            predictability_score=predictability,
            corrective_actions=actions,
            forecast_at_risk=forecast_at_risk,
            revised_forecast=revised_forecast,
            summary=summary,
            key_findings=findings
        )
    
    def _merge_data(
        self,
        actual: pd.DataFrame,
        budget: pd.DataFrame
    ) -> pd.DataFrame:
        """Fusionne données actual et budget"""
        
        actual = actual.copy()
        budget = budget.copy()
        
        actual.columns = [c + '_actual' if c == 'amount' else c for c in actual.columns]
        budget.columns = [c + '_budget' if c == 'amount' else c for c in budget.columns]
        
        # Merge sur line_id ou name
        merge_key = 'line_id' if 'line_id' in actual.columns else 'name'
        
        df = actual.merge(budget[[merge_key, 'amount_budget']], on=merge_key, how='outer')
        
        # Remplir NaN
        df['amount_actual'] = df['amount_actual'].fillna(0)
        df['amount_budget'] = df['amount_budget'].fillna(0)
        
        return df
    
    def _analyze_line(self, row: pd.Series) -> VarianceLine:
        """Analyse une ligne d'écart"""
        
        line_id = str(row.get('line_id', row.get('name', 'unknown')))
        name = str(row.get('name', line_id))
        category_str = str(row.get('category', 'cost')).lower()
        
        if 'revenue' in category_str or 'ca' in category_str:
            category = VarianceCategory.REVENUE
        else:
            category = VarianceCategory.COST
        
        actual = float(row['amount_actual'])
        budget = float(row['amount_budget'])
        variance = actual - budget
        variance_pct = variance / budget if budget != 0 else 0
        
        # Status (attention : pour coûts, une hausse est défavorable)
        if category == VarianceCategory.REVENUE:
            status = self._determine_status(variance_pct, is_revenue=True)
        else:
            status = self._determine_status(variance_pct, is_revenue=False)
        
        is_material = abs(variance_pct) >= self.MATERIALITY_THRESHOLD
        
        # Drivers (simplifié - en production, viendrait d'une analyse plus poussée)
        drivers = self._identify_drivers(name, variance, variance_pct, category)
        
        # Root cause
        root_cause = self._identify_root_cause(name, variance, category)
        
        # Action corrective
        action = self._suggest_action(name, variance, status, category)
        
        return VarianceLine(
            line_id=line_id,
            name=name,
            category=category,
            actual=actual,
            budget=budget,
            variance=variance,
            variance_pct=variance_pct,
            status=status,
            is_material=is_material,
            drivers=drivers,
            root_cause=root_cause,
            impact_on_total=0,  # Calculé après
            corrective_action=action,
            action_owner=None
        )
    
    def _determine_status(self, variance_pct: float, is_revenue: bool) -> VarianceStatus:
        """Détermine le status d'un écart"""
        
        abs_var = abs(variance_pct)
        
        if abs_var <= self.ON_TARGET_RANGE:
            return VarianceStatus.ON_TARGET
        
        if abs_var >= self.CRITICAL_THRESHOLD:
            if is_revenue:
                return VarianceStatus.CRITICAL if variance_pct < 0 else VarianceStatus.FAVORABLE
            else:
                return VarianceStatus.CRITICAL if variance_pct > 0 else VarianceStatus.FAVORABLE
        
        if is_revenue:
            return VarianceStatus.FAVORABLE if variance_pct > 0 else VarianceStatus.UNFAVORABLE
        else:
            return VarianceStatus.FAVORABLE if variance_pct < 0 else VarianceStatus.UNFAVORABLE
    
    def _identify_drivers(
        self,
        name: str,
        variance: float,
        variance_pct: float,
        category: VarianceCategory
    ) -> List[str]:
        """Identifie les drivers d'un écart"""
        
        drivers = []
        
        if variance_pct > 0.20:
            drivers.append(f"Écart majeur: +{variance_pct*100:.0f}%")
        elif variance_pct < -0.20:
            drivers.append(f"Écart majeur: {variance_pct*100:.0f}%")
        
        if category == VarianceCategory.REVENUE and variance < 0:
            drivers.append("Possible : perte client, retard commande, ou baisse activité")
        elif category == VarianceCategory.COST and variance > 0:
            drivers.append("Possible : dépassement budget, inflation, ou scope creep")
        
        if not drivers:
            drivers.append("Écart mineur dans la marge de tolérance")
        
        return drivers
    
    def _identify_root_cause(
        self,
        name: str,
        variance: float,
        category: VarianceCategory
    ) -> Optional[str]:
        """Identifie la cause racine probable"""
        
        name_lower = name.lower()
        
        if category == VarianceCategory.REVENUE:
            if variance < 0:
                return "Sous-performance commerciale ou marché"
        else:
            if variance > 0:
                if 'salaire' in name_lower or 'personnel' in name_lower:
                    return "Recrutements ou augmentations non planifiés"
                elif 'marketing' in name_lower:
                    return "Campagnes non budgétées ou dépassement"
                elif 'cloud' in name_lower or 'infra' in name_lower:
                    return "Croissance usage ou mauvais sizing"
                else:
                    return "Dérive de coûts ou dépenses imprévues"
        
        return None
    
    def _suggest_action(
        self,
        name: str,
        variance: float,
        status: VarianceStatus,
        category: VarianceCategory
    ) -> Optional[str]:
        """Suggère action corrective"""
        
        if status == VarianceStatus.ON_TARGET:
            return None
        
        if status == VarianceStatus.FAVORABLE:
            return "Maintenir et documenter les bonnes pratiques"
        
        name_lower = name.lower()
        
        if category == VarianceCategory.REVENUE:
            return "Intensifier actions commerciales, revoir pipeline"
        else:
            if 'marketing' in name_lower:
                return "Auditer ROI des campagnes, réallouer ou couper"
            elif 'cloud' in name_lower or 'infra' in name_lower:
                return "Optimiser instances, réserver capacity, supprimer unused"
            elif 'consultant' in name_lower or 'presta' in name_lower:
                return "Évaluer internalisation ou renégociation"
            else:
                return "Analyser le poste et identifier économies possibles"
    
    def _decompose_revenue_variance(
        self,
        actual: pd.DataFrame,
        budget: pd.DataFrame,
        total_variance: float
    ) -> Optional[VarianceDecomposition]:
        """Décompose l'écart revenue en volume/prix/mix"""
        
        # Simplifié - en production nécessite données détaillées
        if 'volume' not in actual.columns or 'price' not in actual.columns:
            return None
        
        # Calcul basique volume/prix
        volume_actual = actual['volume'].sum()
        volume_budget = budget['volume'].sum()
        price_actual = actual['amount'].sum() / volume_actual if volume_actual > 0 else 0
        price_budget = budget['amount'].sum() / volume_budget if volume_budget > 0 else 0
        
        # Effet volume = (Qactual - Qbudget) × Pbudget
        volume_effect = (volume_actual - volume_budget) * price_budget
        
        # Effet prix = (Pactual - Pbudget) × Qactual
        price_effect = (price_actual - price_budget) * volume_actual
        
        # Mix = résiduel
        mix_effect = total_variance - volume_effect - price_effect
        
        # Pourcentages
        total = abs(volume_effect) + abs(price_effect) + abs(mix_effect)
        
        return VarianceDecomposition(
            total_variance=total_variance,
            volume_effect=volume_effect,
            volume_effect_pct=volume_effect / total if total > 0 else 0,
            price_effect=price_effect,
            price_effect_pct=price_effect / total if total > 0 else 0,
            mix_effect=mix_effect,
            mix_effect_pct=mix_effect / total if total > 0 else 0,
            residual=0,
            explanation=self._explain_decomposition(volume_effect, price_effect, mix_effect)
        )
    
    def _explain_decomposition(
        self,
        volume: float,
        price: float,
        mix: float
    ) -> str:
        """Explique la décomposition"""
        
        effects = [
            ("volume", volume),
            ("prix", price),
            ("mix produit", mix)
        ]
        
        # Trier par impact
        effects.sort(key=lambda x: abs(x[1]), reverse=True)
        
        main_effect = effects[0]
        
        if main_effect[1] > 0:
            return f"L'écart est principalement dû à un effet {main_effect[0]} positif (+{main_effect[1]:,.0f}€)"
        else:
            return f"L'écart est principalement dû à un effet {main_effect[0]} négatif ({main_effect[1]:,.0f}€)"
    
    def _count_consecutive_misses(self, historical: Optional[pd.DataFrame]) -> int:
        """Compte les mois consécutifs de miss budget"""
        if historical is None:
            return 0
        # Simplifié
        return 0
    
    def _calculate_predictability(self, historical: Optional[pd.DataFrame]) -> float:
        """Calcule le score de prévisibilité"""
        if historical is None:
            return 70  # Score par défaut
        
        # En production : MAPE ou autre métrique
        return 70
    
    def _generate_corrective_actions(
        self,
        all_lines: List[VarianceLine],
        unfavorable: List[VarianceLine]
    ) -> List[Dict]:
        """Génère liste d'actions correctives"""
        
        actions = []
        
        for i, line in enumerate(unfavorable[:5]):
            if line.corrective_action:
                actions.append({
                    "priority": f"P{i+1}",
                    "line": line.name,
                    "variance": line.variance,
                    "action": line.corrective_action,
                    "owner": line.action_owner,
                    "deadline": "Cette semaine" if i < 2 else "Ce mois"
                })
        
        return actions
    
    def _generate_summary(
        self,
        rev_var: float,
        rev_var_pct: float,
        cost_var: float,
        cost_var_pct: float,
        result_var: float,
        result_var_pct: float,
        unfavorable: List[VarianceLine]
    ) -> Tuple[str, List[str]]:
        """Génère synthèse et findings"""
        
        findings = []
        
        # Revenue
        if rev_var_pct >= 0:
            findings.append(f"✅ CA en ligne ou au-dessus : +{rev_var_pct*100:.1f}% ({rev_var:+,.0f}€)")
        else:
            findings.append(f"🔴 CA sous budget : {rev_var_pct*100:.1f}% ({rev_var:,.0f}€)")
        
        # Coûts
        if cost_var_pct <= 0:
            findings.append(f"✅ Coûts maîtrisés : {cost_var_pct*100:.1f}% ({cost_var:,.0f}€)")
        else:
            findings.append(f"⚠️ Dépassement coûts : +{cost_var_pct*100:.1f}% (+{cost_var:,.0f}€)")
        
        # Résultat
        if result_var_pct >= 0:
            findings.append(f"✅ Résultat opérationnel OK : +{result_var_pct*100:.1f}%")
        else:
            findings.append(f"🔴 Résultat dégradé : {result_var_pct*100:.1f}% ({result_var:,.0f}€)")
        
        # Top unfavorable
        if unfavorable:
            top3 = unfavorable[:3]
            top3_names = [f"{l.name} ({l.variance:+,.0f}€)" for l in top3]
            findings.append(f"📊 Principaux écarts négatifs : {', '.join(top3_names)}")
        
        # Synthèse
        if result_var_pct >= 0:
            summary = f"Performance globale satisfaisante. Résultat en ligne avec le budget (+{result_var_pct*100:.1f}%)."
        elif result_var_pct > -0.10:
            summary = f"Léger écart au budget ({result_var_pct*100:.1f}%). Actions correctives recommandées sur {len(unfavorable)} poste(s)."
        else:
            summary = f"Écart significatif au budget ({result_var_pct*100:.1f}%). Intervention urgente requise. Top 3 postes à traiter immédiatement."
        
        return summary, findings


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def _test_variance_analyzer():
    """Test de l'analyseur de variances"""
    
    # Données de test
    actual_data = pd.DataFrame({
        'line_id': ['REV-001', 'REV-002', 'COST-001', 'COST-002', 'COST-003', 'COST-004'],
        'name': ['CA Produit A', 'CA Produit B', 'Salaires', 'Marketing', 'Cloud AWS', 'Loyer'],
        'category': ['revenue', 'revenue', 'cost', 'cost', 'cost', 'cost'],
        'amount': [320000, 85000, 125000, 28000, 12000, 16500]
    })
    
    budget_data = pd.DataFrame({
        'line_id': ['REV-001', 'REV-002', 'COST-001', 'COST-002', 'COST-003', 'COST-004'],
        'name': ['CA Produit A', 'CA Produit B', 'Salaires', 'Marketing', 'Cloud AWS', 'Loyer'],
        'category': ['revenue', 'revenue', 'cost', 'cost', 'cost', 'cost'],
        'amount': [350000, 80000, 120000, 22000, 8000, 16500]
    })
    
    # Analyser
    analyzer = VarianceAnalyzer()
    result = analyzer.analyze_variances(
        actual_data=actual_data,
        budget_data=budget_data,
        period="Janvier 2026"
    )
    
    print("\n" + "="*60)
    print("VARIANCE ANALYSIS TEST")
    print("="*60)
    
    print(f"\n📊 Période: {result.period}")
    
    print(f"\n💰 REVENUS:")
    print(f"   Réel: {result.total_revenue_actual:,.0f}€")
    print(f"   Budget: {result.total_revenue_budget:,.0f}€")
    print(f"   Écart: {result.revenue_variance:+,.0f}€ ({result.revenue_variance_pct*100:+.1f}%)")
    print(f"   Status: {result.revenue_status.value}")
    
    print(f"\n📉 COÛTS:")
    print(f"   Réel: {result.total_costs_actual:,.0f}€")
    print(f"   Budget: {result.total_costs_budget:,.0f}€")
    print(f"   Écart: {result.costs_variance:+,.0f}€ ({result.costs_variance_pct*100:+.1f}%)")
    print(f"   Status: {result.costs_status.value}")
    
    print(f"\n📈 RÉSULTAT OPÉRATIONNEL:")
    print(f"   Réel: {result.operating_result_actual:,.0f}€")
    print(f"   Budget: {result.operating_result_budget:,.0f}€")
    print(f"   Écart: {result.result_variance:+,.0f}€ ({result.result_variance_pct*100:+.1f}%)")
    print(f"   Status: {result.result_status.value}")
    
    print(f"\n🔴 TOP ÉCARTS DÉFAVORABLES:")
    for line in result.top_unfavorable[:3]:
        print(f"   • {line.name}: {line.variance:+,.0f}€ ({line.variance_pct*100:+.1f}%)")
        if line.root_cause:
            print(f"     Cause: {line.root_cause}")
    
    print(f"\n🎯 ACTIONS CORRECTIVES:")
    for action in result.corrective_actions[:3]:
        print(f"   [{action['priority']}] {action['line']}: {action['action']}")
    
    print(f"\n📝 SYNTHÈSE:")
    print(f"   {result.summary}")
    
    print(f"\n📋 FINDINGS:")
    for f in result.key_findings:
        print(f"   {f}")
    
    return result


if __name__ == "__main__":
    _test_variance_analyzer()

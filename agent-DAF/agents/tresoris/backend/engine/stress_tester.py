"""
TRESORIS V3 - Stress Tester
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Simulations de stress sur la trésorerie.
Monte Carlo, worst-case, et scénarios choc.

Effet démo visé :
"J'ai simulé 10 000 scénarios : vous avez 12% de chances de passer en cash négatif en Juin."
"Si Client X part + matières +15%, votre runway tombe à 2.3 mois."
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from enum import Enum
import pandas as pd
import numpy as np
from scipy import stats


class StressType(str, Enum):
    """Type de stress test"""
    MONTE_CARLO = "monte_carlo"        # Simulation probabiliste
    SCENARIO = "scenario"               # Scénario déterministe
    SENSITIVITY = "sensitivity"         # Analyse de sensibilité
    REVERSE = "reverse"                 # Stress inversé (quel choc pour casser?)


class RiskLevel(str, Enum):
    """Niveau de risque résultant"""
    LOW = "low"                 # < 10% de probabilité de stress
    MODERATE = "moderate"       # 10-25%
    HIGH = "high"               # 25-50%
    CRITICAL = "critical"       # > 50%


@dataclass
class StressScenario:
    """Un scénario de stress"""
    scenario_id: str
    name: str
    description: str
    
    # Chocs appliqués
    revenue_shock_pct: float = 0        # -20% = baisse de 20%
    cost_shock_pct: float = 0           # +15% = hausse de 15%
    dso_shock_days: int = 0             # +30 = clients paient 30j plus tard
    client_loss_pct: float = 0          # 10% = perte de 10% des clients
    
    # Résultat
    impact_on_cash: float = 0
    impact_on_runway: float = 0         # En mois
    survival_probability: float = 1.0
    
    def to_dict(self) -> Dict:
        return {
            "scenario_id": self.scenario_id,
            "name": self.name,
            "description": self.description,
            "shocks": {
                "revenue": f"{self.revenue_shock_pct:+.0f}%",
                "costs": f"{self.cost_shock_pct:+.0f}%",
                "dso": f"{self.dso_shock_days:+d} jours",
                "client_loss": f"{self.client_loss_pct:.0f}%"
            },
            "impact_cash": self.impact_on_cash,
            "impact_runway_months": round(self.impact_on_runway, 1),
            "survival_probability": round(self.survival_probability * 100, 1)
        }


@dataclass
class MonteCarloResult:
    """Résultat d'une simulation Monte Carlo"""
    n_simulations: int
    
    # Distribution cash
    cash_mean: float
    cash_median: float
    cash_std: float
    cash_p5: float                      # 5ème percentile (worst case réaliste)
    cash_p95: float                     # 95ème percentile (best case réaliste)
    cash_min: float
    cash_max: float
    
    # Probabilités
    prob_negative_cash: float           # P(cash < 0)
    prob_under_safety: float            # P(cash < safety_threshold)
    prob_severe_stress: float           # P(cash < 50% safety)
    
    # Runway
    runway_mean: float
    runway_p5: float
    runway_p95: float
    
    # Value at Risk
    var_95: float                       # Perte max à 95% de confiance
    cvar_95: float                      # Expected shortfall
    
    # Simulations détaillées (sample)
    sample_paths: List[Dict]
    
    def to_dict(self) -> Dict:
        return {
            "n_simulations": self.n_simulations,
            "cash_distribution": {
                "mean": round(self.cash_mean, 0),
                "median": round(self.cash_median, 0),
                "std": round(self.cash_std, 0),
                "p5": round(self.cash_p5, 0),
                "p95": round(self.cash_p95, 0),
                "min": round(self.cash_min, 0),
                "max": round(self.cash_max, 0)
            },
            "probabilities": {
                "negative_cash_pct": round(self.prob_negative_cash * 100, 1),
                "under_safety_pct": round(self.prob_under_safety * 100, 1),
                "severe_stress_pct": round(self.prob_severe_stress * 100, 1)
            },
            "runway_months": {
                "mean": round(self.runway_mean, 1),
                "p5_worst": round(self.runway_p5, 1),
                "p95_best": round(self.runway_p95, 1)
            },
            "value_at_risk": {
                "var_95": round(self.var_95, 0),
                "cvar_95": round(self.cvar_95, 0)
            },
            "sample_paths": self.sample_paths[:5]  # Top 5 pour affichage
        }


@dataclass
class SensitivityResult:
    """Résultat d'une analyse de sensibilité"""
    variable_name: str
    base_value: float
    
    # Impact de variations
    impacts: List[Dict]  # [{change: -20%, cash_impact: -50k, runway_impact: -2m}]
    
    # Élasticité
    elasticity: float   # 1% de changement -> X% d'impact sur cash
    
    # Seuil critique
    critical_threshold: float   # À partir de quelle valeur ça casse
    
    def to_dict(self) -> Dict:
        return {
            "variable": self.variable_name,
            "base_value": self.base_value,
            "elasticity": round(self.elasticity, 2),
            "critical_threshold": self.critical_threshold,
            "impacts": self.impacts
        }


@dataclass
class ReverseStressResult:
    """Résultat d'un reverse stress test"""
    question: str                       # "Quel choc pour atteindre cash négatif?"
    
    # Réponses par variable
    breaking_points: Dict[str, float]   # {revenue: -35%, dso: +65j, ...}
    
    # Scénario combiné minimal
    minimal_combined_shock: Dict
    
    # Probabilité du scénario
    scenario_probability: float
    
    # Temps avant impact
    time_to_impact_months: float
    
    interpretation: str
    
    def to_dict(self) -> Dict:
        return {
            "question": self.question,
            "breaking_points": self.breaking_points,
            "minimal_combined_shock": self.minimal_combined_shock,
            "scenario_probability_pct": round(self.scenario_probability * 100, 2),
            "time_to_impact_months": round(self.time_to_impact_months, 1),
            "interpretation": self.interpretation
        }


@dataclass
class StressTestResult:
    """Résultat complet du stress testing"""
    timestamp: datetime
    
    # Situation actuelle
    current_cash: float
    current_monthly_burn: float
    current_runway: float               # Mois
    safety_threshold: float             # Niveau de cash de sécurité
    
    # Monte Carlo
    monte_carlo: Optional[MonteCarloResult]
    
    # Scénarios déterministes
    scenarios: List[StressScenario]
    worst_scenario: StressScenario
    
    # Sensibilité
    sensitivities: List[SensitivityResult]
    most_sensitive_variable: str
    
    # Reverse stress
    reverse_stress: Optional[ReverseStressResult]
    
    # Risk assessment
    overall_risk_level: RiskLevel
    risk_score: float                   # 0-100
    
    # Recommandations
    hedging_actions: List[Dict]
    contingency_plan: Dict
    
    # Synthèse
    summary: str
    key_insights: List[str]
    
    def to_dict(self) -> Dict:
        return {
            "timestamp": self.timestamp.isoformat(),
            "current_state": {
                "cash": self.current_cash,
                "monthly_burn": self.current_monthly_burn,
                "runway_months": round(self.current_runway, 1),
                "safety_threshold": self.safety_threshold
            },
            "monte_carlo": self.monte_carlo.to_dict() if self.monte_carlo else None,
            "scenarios": [s.to_dict() for s in self.scenarios],
            "worst_scenario": self.worst_scenario.to_dict(),
            "sensitivities": [s.to_dict() for s in self.sensitivities],
            "most_sensitive_variable": self.most_sensitive_variable,
            "reverse_stress": self.reverse_stress.to_dict() if self.reverse_stress else None,
            "risk_assessment": {
                "level": self.overall_risk_level.value,
                "score": self.risk_score
            },
            "hedging_actions": self.hedging_actions,
            "contingency_plan": self.contingency_plan,
            "summary": self.summary,
            "key_insights": self.key_insights
        }


class StressTester:
    """
    Module de stress testing trésorerie.
    
    Ce qui le rend impressionnant :
    1. Simulations Monte Carlo (10 000 scénarios)
    2. Scénarios choc prédéfinis + custom
    3. Analyse de sensibilité multi-variables
    4. Reverse stress test ("quel choc pour casser?")
    5. Value at Risk et Expected Shortfall
    6. Plans de contingence automatiques
    """
    
    # Paramètres par défaut
    N_SIMULATIONS = 10000
    CONFIDENCE_LEVEL = 0.95
    HORIZON_MONTHS = 12
    
    def __init__(self, random_seed: int = 42):
        np.random.seed(random_seed)
    
    def run_full_stress_test(
        self,
        current_cash: float,
        monthly_revenues: float,
        monthly_costs: float,
        revenue_volatility: float = 0.15,
        cost_volatility: float = 0.08,
        safety_threshold: Optional[float] = None,
        custom_scenarios: Optional[List[Dict]] = None
    ) -> StressTestResult:
        """
        Lance le stress test complet.
        
        Args:
            current_cash: Trésorerie actuelle
            monthly_revenues: Revenus mensuels moyens
            monthly_costs: Coûts mensuels moyens
            revenue_volatility: Volatilité des revenus (0.15 = 15%)
            cost_volatility: Volatilité des coûts
            safety_threshold: Seuil de sécurité (défaut: 2 mois de coûts)
            custom_scenarios: Scénarios personnalisés
        """
        
        # Calculs de base
        monthly_burn = monthly_costs - monthly_revenues  # Négatif si profitable
        runway = current_cash / max(monthly_burn, 1) if monthly_burn > 0 else float('inf')
        
        if safety_threshold is None:
            safety_threshold = monthly_costs * 2  # 2 mois de coûts
        
        # 1. Monte Carlo
        monte_carlo = self._run_monte_carlo(
            current_cash=current_cash,
            monthly_revenues=monthly_revenues,
            monthly_costs=monthly_costs,
            revenue_volatility=revenue_volatility,
            cost_volatility=cost_volatility,
            safety_threshold=safety_threshold,
            horizon_months=self.HORIZON_MONTHS
        )
        
        # 2. Scénarios déterministes
        scenarios = self._run_scenarios(
            current_cash=current_cash,
            monthly_revenues=monthly_revenues,
            monthly_costs=monthly_costs,
            custom_scenarios=custom_scenarios
        )
        
        worst_scenario = min(scenarios, key=lambda s: s.survival_probability)
        
        # 3. Sensibilité
        sensitivities = self._run_sensitivity(
            current_cash=current_cash,
            monthly_revenues=monthly_revenues,
            monthly_costs=monthly_costs
        )
        
        most_sensitive = max(sensitivities, key=lambda s: abs(s.elasticity)).variable_name
        
        # 4. Reverse stress
        reverse = self._run_reverse_stress(
            current_cash=current_cash,
            monthly_revenues=monthly_revenues,
            monthly_costs=monthly_costs,
            safety_threshold=safety_threshold
        )
        
        # 5. Risk assessment
        risk_level, risk_score = self._assess_risk(
            monte_carlo=monte_carlo,
            worst_scenario=worst_scenario,
            runway=runway
        )
        
        # 6. Actions et contingence
        hedging = self._generate_hedging_actions(
            sensitivities=sensitivities,
            risk_level=risk_level,
            monte_carlo=monte_carlo
        )
        
        contingency = self._generate_contingency_plan(
            current_cash=current_cash,
            monthly_costs=monthly_costs,
            reverse=reverse
        )
        
        # 7. Synthèse
        summary, insights = self._generate_summary(
            monte_carlo=monte_carlo,
            scenarios=scenarios,
            risk_level=risk_level,
            most_sensitive=most_sensitive
        )
        
        return StressTestResult(
            timestamp=datetime.now(),
            current_cash=current_cash,
            current_monthly_burn=monthly_burn,
            current_runway=runway,
            safety_threshold=safety_threshold,
            monte_carlo=monte_carlo,
            scenarios=scenarios,
            worst_scenario=worst_scenario,
            sensitivities=sensitivities,
            most_sensitive_variable=most_sensitive,
            reverse_stress=reverse,
            overall_risk_level=risk_level,
            risk_score=risk_score,
            hedging_actions=hedging,
            contingency_plan=contingency,
            summary=summary,
            key_insights=insights
        )
    
    def _run_monte_carlo(
        self,
        current_cash: float,
        monthly_revenues: float,
        monthly_costs: float,
        revenue_volatility: float,
        cost_volatility: float,
        safety_threshold: float,
        horizon_months: int
    ) -> MonteCarloResult:
        """Simulation Monte Carlo"""
        
        n = self.N_SIMULATIONS
        
        # Simuler n trajectoires
        final_cash = np.zeros(n)
        negative_count = 0
        under_safety_count = 0
        severe_stress_count = 0
        
        sample_paths = []
        
        for i in range(n):
            cash = current_cash
            cash_path = [cash]
            
            for m in range(horizon_months):
                # Revenus avec volatilité (distribution log-normale)
                rev = monthly_revenues * np.exp(
                    np.random.normal(-0.5 * revenue_volatility**2, revenue_volatility)
                )
                
                # Coûts avec volatilité
                cost = monthly_costs * np.exp(
                    np.random.normal(-0.5 * cost_volatility**2, cost_volatility)
                )
                
                # Update cash
                cash = cash + rev - cost
                cash_path.append(cash)
            
            final_cash[i] = cash
            
            if cash < 0:
                negative_count += 1
            if cash < safety_threshold:
                under_safety_count += 1
            if cash < safety_threshold * 0.5:
                severe_stress_count += 1
            
            # Garder quelques trajectoires pour visualisation
            if i < 50:
                sample_paths.append({
                    "simulation_id": i,
                    "path": [round(c, 0) for c in cash_path],
                    "final_cash": round(cash, 0)
                })
        
        # Statistiques
        cash_mean = np.mean(final_cash)
        cash_median = np.median(final_cash)
        cash_std = np.std(final_cash)
        cash_p5 = np.percentile(final_cash, 5)
        cash_p95 = np.percentile(final_cash, 95)
        
        # Runway (simplifié)
        monthly_burn = monthly_costs - monthly_revenues
        runway_samples = np.where(
            monthly_burn > 0,
            final_cash / monthly_burn,
            np.inf
        )
        runway_mean = np.mean(np.clip(runway_samples, 0, 120))
        runway_p5 = np.percentile(np.clip(runway_samples, 0, 120), 5)
        runway_p95 = np.percentile(np.clip(runway_samples, 0, 120), 95)
        
        # VaR et CVaR
        var_95 = current_cash - cash_p5
        losses = current_cash - final_cash
        cvar_95 = np.mean(losses[losses >= var_95])
        
        return MonteCarloResult(
            n_simulations=n,
            cash_mean=cash_mean,
            cash_median=cash_median,
            cash_std=cash_std,
            cash_p5=cash_p5,
            cash_p95=cash_p95,
            cash_min=np.min(final_cash),
            cash_max=np.max(final_cash),
            prob_negative_cash=negative_count / n,
            prob_under_safety=under_safety_count / n,
            prob_severe_stress=severe_stress_count / n,
            runway_mean=runway_mean,
            runway_p5=runway_p5,
            runway_p95=runway_p95,
            var_95=var_95,
            cvar_95=cvar_95,
            sample_paths=sorted(sample_paths, key=lambda x: x['final_cash'])[:10]
        )
    
    def _run_scenarios(
        self,
        current_cash: float,
        monthly_revenues: float,
        monthly_costs: float,
        custom_scenarios: Optional[List[Dict]] = None
    ) -> List[StressScenario]:
        """Scénarios déterministes"""
        
        scenarios = []
        monthly_burn = monthly_costs - monthly_revenues
        
        # Scénarios standards
        standard_scenarios = [
            {
                "id": "recession_legere",
                "name": "Récession légère",
                "description": "Baisse modérée de l'activité",
                "revenue_shock": -0.15,
                "cost_shock": 0.05
            },
            {
                "id": "recession_severe",
                "name": "Récession sévère",
                "description": "Crise économique majeure (type 2020)",
                "revenue_shock": -0.35,
                "cost_shock": 0.10
            },
            {
                "id": "perte_client_majeur",
                "name": "Perte client majeur",
                "description": "Perte du plus gros client (25% du CA)",
                "revenue_shock": -0.25,
                "client_loss": 0.25
            },
            {
                "id": "inflation_costs",
                "name": "Choc inflationniste",
                "description": "Hausse généralisée des coûts (+20%)",
                "cost_shock": 0.20
            },
            {
                "id": "retards_paiements",
                "name": "Retards paiements massifs",
                "description": "Clients retardent de 60 jours",
                "dso_shock": 60
            },
            {
                "id": "tempete_parfaite",
                "name": "Tempête parfaite",
                "description": "Cumul : -25% CA, +15% coûts, +45j DSO",
                "revenue_shock": -0.25,
                "cost_shock": 0.15,
                "dso_shock": 45
            }
        ]
        
        for s in standard_scenarios:
            scenario = self._evaluate_scenario(
                scenario_def=s,
                current_cash=current_cash,
                monthly_revenues=monthly_revenues,
                monthly_costs=monthly_costs
            )
            scenarios.append(scenario)
        
        # Scénarios custom
        if custom_scenarios:
            for cs in custom_scenarios:
                scenario = self._evaluate_scenario(
                    scenario_def=cs,
                    current_cash=current_cash,
                    monthly_revenues=monthly_revenues,
                    monthly_costs=monthly_costs
                )
                scenarios.append(scenario)
        
        return scenarios
    
    def _evaluate_scenario(
        self,
        scenario_def: Dict,
        current_cash: float,
        monthly_revenues: float,
        monthly_costs: float
    ) -> StressScenario:
        """Évalue un scénario"""
        
        # Appliquer les chocs
        shocked_revenues = monthly_revenues * (1 + scenario_def.get('revenue_shock', 0))
        shocked_costs = monthly_costs * (1 + scenario_def.get('cost_shock', 0))
        
        # Impact DSO sur cash (simplifié)
        dso_impact = scenario_def.get('dso_shock', 0) / 30 * monthly_revenues
        
        # Nouveau burn mensuel
        shocked_burn = shocked_costs - shocked_revenues
        
        # Cash après 6 mois
        cash_6m = current_cash - dso_impact + (shocked_revenues - shocked_costs) * 6
        
        # Impact
        base_cash_6m = current_cash + (monthly_revenues - monthly_costs) * 6
        impact_cash = cash_6m - base_cash_6m
        
        # Runway
        if shocked_burn > 0:
            new_runway = (current_cash - dso_impact) / shocked_burn
        else:
            new_runway = float('inf')
        
        base_burn = monthly_costs - monthly_revenues
        if base_burn > 0:
            base_runway = current_cash / base_burn
        else:
            base_runway = float('inf')
        
        impact_runway = new_runway - base_runway
        
        # Probabilité de survie
        survival = 1.0 if cash_6m > 0 else max(0, cash_6m / current_cash + 1)
        
        return StressScenario(
            scenario_id=scenario_def.get('id', 'custom'),
            name=scenario_def.get('name', 'Custom'),
            description=scenario_def.get('description', ''),
            revenue_shock_pct=scenario_def.get('revenue_shock', 0) * 100,
            cost_shock_pct=scenario_def.get('cost_shock', 0) * 100,
            dso_shock_days=scenario_def.get('dso_shock', 0),
            client_loss_pct=scenario_def.get('client_loss', 0) * 100,
            impact_on_cash=impact_cash,
            impact_on_runway=impact_runway if impact_runway != float('inf') else 999,
            survival_probability=survival
        )
    
    def _run_sensitivity(
        self,
        current_cash: float,
        monthly_revenues: float,
        monthly_costs: float
    ) -> List[SensitivityResult]:
        """Analyse de sensibilité"""
        
        sensitivities = []
        
        # Variables à tester
        variables = [
            ("revenues", monthly_revenues, [-0.30, -0.20, -0.10, 0.10, 0.20]),
            ("costs", monthly_costs, [-0.20, -0.10, 0.10, 0.20, 0.30]),
            ("dso_days", 45, [-20, -10, 10, 20, 30, 45, 60])  # Jours de variation
        ]
        
        for var_name, base_value, changes in variables:
            impacts = []
            
            for change in changes:
                if var_name == "revenues":
                    new_rev = monthly_revenues * (1 + change)
                    cash_impact = (new_rev - monthly_revenues) * 6  # Sur 6 mois
                elif var_name == "costs":
                    new_cost = monthly_costs * (1 + change)
                    cash_impact = -(new_cost - monthly_costs) * 6
                else:  # DSO
                    cash_impact = -change / 30 * monthly_revenues
                
                runway_impact = cash_impact / monthly_costs if monthly_costs > 0 else 0
                
                impacts.append({
                    "change": f"{change:+.0%}" if var_name != "dso_days" else f"{change:+d}j",
                    "cash_impact": round(cash_impact, 0),
                    "runway_impact_months": round(runway_impact, 1)
                })
            
            # Élasticité (approximation)
            if len(impacts) >= 2:
                delta_change = 0.10  # 10% de variation
                delta_impact = impacts[-1]["cash_impact"] - impacts[0]["cash_impact"]
                elasticity = (delta_impact / current_cash) / delta_change if current_cash > 0 else 0
            else:
                elasticity = 0
            
            # Seuil critique
            if var_name == "revenues":
                # À quel % de baisse le cash devient négatif?
                critical = -current_cash / (monthly_revenues * 6) if monthly_revenues > 0 else -1
            elif var_name == "costs":
                critical = current_cash / (monthly_costs * 6) if monthly_costs > 0 else 1
            else:
                critical = current_cash / monthly_revenues * 30 if monthly_revenues > 0 else 999
            
            sensitivities.append(SensitivityResult(
                variable_name=var_name,
                base_value=base_value,
                impacts=impacts,
                elasticity=elasticity,
                critical_threshold=critical
            ))
        
        return sensitivities
    
    def _run_reverse_stress(
        self,
        current_cash: float,
        monthly_revenues: float,
        monthly_costs: float,
        safety_threshold: float
    ) -> ReverseStressResult:
        """Reverse stress test"""
        
        # Calculer les seuils de rupture
        breaking_points = {}
        
        # Baisse de revenus pour atteindre 0
        # current_cash + (rev * (1+x) - cost) * 6 = 0
        # x = (cost * 6 - current_cash) / (rev * 6) - 1
        rev_break = ((monthly_costs * 6 - current_cash) / (monthly_revenues * 6)) - 1 if monthly_revenues > 0 else 0
        breaking_points["revenue_drop"] = f"{rev_break*100:.0f}%"
        
        # Hausse de coûts
        # current_cash + (rev - cost * (1+x)) * 6 = 0
        cost_break = (current_cash / (monthly_costs * 6)) + (monthly_revenues / monthly_costs) - 1 if monthly_costs > 0 else 0
        breaking_points["cost_increase"] = f"{cost_break*100:.0f}%"
        
        # DSO
        dso_break = current_cash / monthly_revenues * 30 if monthly_revenues > 0 else 999
        breaking_points["dso_increase"] = f"+{dso_break:.0f} jours"
        
        # Scénario combiné minimal
        minimal = {
            "revenue": f"{rev_break*0.5*100:.0f}%",
            "costs": f"+{cost_break*0.3*100:.0f}%",
            "dso": f"+{dso_break*0.3:.0f}j",
            "description": "Combinaison probable amenant au seuil critique"
        }
        
        # Probabilité (estimation heuristique)
        probability = 0.05 if abs(rev_break) > 0.40 else 0.15 if abs(rev_break) > 0.25 else 0.30
        
        # Temps avant impact
        monthly_burn = monthly_costs - monthly_revenues
        if monthly_burn > 0:
            time_to_impact = current_cash / monthly_burn
        else:
            time_to_impact = 24  # Plus d'un an
        
        interpretation = (
            f"Il faudrait une baisse de revenus de {abs(rev_break)*100:.0f}% pour atteindre le cash négatif, "
            f"ou une hausse de coûts de {cost_break*100:.0f}%. "
            f"Ces niveaux de stress ont une probabilité estimée à {probability*100:.0f}%."
        )
        
        return ReverseStressResult(
            question="Quel niveau de choc pour atteindre un cash négatif à 6 mois?",
            breaking_points=breaking_points,
            minimal_combined_shock=minimal,
            scenario_probability=probability,
            time_to_impact_months=time_to_impact,
            interpretation=interpretation
        )
    
    def _assess_risk(
        self,
        monte_carlo: MonteCarloResult,
        worst_scenario: StressScenario,
        runway: float
    ) -> Tuple[RiskLevel, float]:
        """Évalue le niveau de risque global"""
        
        # Score basé sur plusieurs facteurs
        scores = []
        
        # 1. Probabilité de cash négatif (MC)
        prob_neg = monte_carlo.prob_negative_cash
        if prob_neg < 0.05:
            scores.append(90)
        elif prob_neg < 0.10:
            scores.append(70)
        elif prob_neg < 0.25:
            scores.append(50)
        else:
            scores.append(20)
        
        # 2. Runway
        if runway > 12:
            scores.append(95)
        elif runway > 6:
            scores.append(75)
        elif runway > 3:
            scores.append(45)
        else:
            scores.append(15)
        
        # 3. Worst scenario survival
        if worst_scenario.survival_probability > 0.8:
            scores.append(85)
        elif worst_scenario.survival_probability > 0.5:
            scores.append(55)
        else:
            scores.append(25)
        
        # Score moyen
        risk_score = np.mean(scores)
        
        # Level
        if risk_score >= 75:
            level = RiskLevel.LOW
        elif risk_score >= 50:
            level = RiskLevel.MODERATE
        elif risk_score >= 30:
            level = RiskLevel.HIGH
        else:
            level = RiskLevel.CRITICAL
        
        return level, risk_score
    
    def _generate_hedging_actions(
        self,
        sensitivities: List[SensitivityResult],
        risk_level: RiskLevel,
        monte_carlo: MonteCarloResult
    ) -> List[Dict]:
        """Génère actions de couverture"""
        
        actions = []
        
        # Trouver la variable la plus sensible
        most_sensitive = max(sensitivities, key=lambda s: abs(s.elasticity))
        
        if most_sensitive.variable_name == "revenues":
            actions.append({
                "type": "revenue_protection",
                "action": "Diversifier le portefeuille clients, négocier des contrats pluriannuels",
                "priority": "haute" if risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL] else "moyenne",
                "impact_expected": "Réduction volatilité revenus de 20-30%"
            })
        
        if most_sensitive.variable_name == "costs":
            actions.append({
                "type": "cost_hedging",
                "action": "Convertir coûts variables en fixes, négocier prix bloqués fournisseurs",
                "priority": "haute" if risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL] else "moyenne",
                "impact_expected": "Prévisibilité coûts améliorée"
            })
        
        # Actions standards selon risque
        if risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
            actions.extend([
                {
                    "type": "cash_buffer",
                    "action": "Constituer réserve de cash supplémentaire (3-6 mois de coûts)",
                    "priority": "urgente",
                    "impact_expected": f"VaR réduite de {monte_carlo.var_95*0.3:,.0f}€"
                },
                {
                    "type": "credit_facility",
                    "action": "Négocier ligne de crédit non tirée comme filet de sécurité",
                    "priority": "haute",
                    "impact_expected": "Runway étendu de 3-6 mois en cas de crise"
                }
            ])
        
        return actions
    
    def _generate_contingency_plan(
        self,
        current_cash: float,
        monthly_costs: float,
        reverse: ReverseStressResult
    ) -> Dict:
        """Génère plan de contingence"""
        
        return {
            "trigger_level_1": {
                "threshold": f"Cash < {monthly_costs * 4:,.0f}€ (4 mois)",
                "actions": [
                    "Gel des recrutements",
                    "Report investissements non essentiels",
                    "Revue mensuelle des coûts"
                ]
            },
            "trigger_level_2": {
                "threshold": f"Cash < {monthly_costs * 2:,.0f}€ (2 mois)",
                "actions": [
                    "Réduction des coûts de 15-20%",
                    "Activation ligne de crédit",
                    "Négociation délais fournisseurs"
                ]
            },
            "trigger_level_3": {
                "threshold": f"Cash < {monthly_costs:,.0f}€ (1 mois)",
                "actions": [
                    "Plan de restructuration",
                    "Recherche financement d'urgence",
                    "Vente d'actifs non stratégiques"
                ]
            },
            "breaking_point": reverse.breaking_points,
            "probability_of_activation": f"{reverse.scenario_probability*100:.0f}%"
        }
    
    def _generate_summary(
        self,
        monte_carlo: MonteCarloResult,
        scenarios: List[StressScenario],
        risk_level: RiskLevel,
        most_sensitive: str
    ) -> Tuple[str, List[str]]:
        """Génère synthèse"""
        
        insights = []
        
        # Insight MC
        insights.append(
            f"📊 Sur {monte_carlo.n_simulations:,} simulations, {monte_carlo.prob_negative_cash*100:.1f}% "
            f"aboutissent à un cash négatif à 12 mois."
        )
        
        # VaR
        insights.append(
            f"💰 Value at Risk (95%): {monte_carlo.var_95:,.0f}€ - "
            f"vous avez 5% de chances de perdre plus que ce montant."
        )
        
        # Worst scenario
        worst = min(scenarios, key=lambda s: s.survival_probability)
        insights.append(
            f"⚠️ Pire scénario '{worst.name}': survie à {worst.survival_probability*100:.0f}%, "
            f"impact cash de {worst.impact_on_cash:,.0f}€"
        )
        
        # Sensibilité
        sens_label = {
            "revenues": "les revenus",
            "costs": "les coûts", 
            "dso_days": "les délais de paiement"
        }
        insights.append(
            f"🎯 Variable la plus sensible: {sens_label.get(most_sensitive, most_sensitive)}. "
            f"Prioriser les actions de couverture sur ce levier."
        )
        
        # Synthèse
        if risk_level == RiskLevel.LOW:
            summary = (
                f"Situation robuste : seulement {monte_carlo.prob_negative_cash*100:.1f}% de probabilité "
                f"de stress critique. Runway moyen de {monte_carlo.runway_mean:.0f} mois."
            )
        elif risk_level == RiskLevel.MODERATE:
            summary = (
                f"Vigilance requise : {monte_carlo.prob_negative_cash*100:.1f}% de risque de stress. "
                f"Recommandation : constituer buffer supplémentaire."
            )
        elif risk_level == RiskLevel.HIGH:
            summary = (
                f"Risque élevé : {monte_carlo.prob_negative_cash*100:.1f}% de probabilité de cash négatif. "
                f"Actions correctives urgentes recommandées."
            )
        else:
            summary = (
                f"Situation critique : {monte_carlo.prob_negative_cash*100:.1f}% de risque. "
                f"Activation immédiate du plan de contingence recommandée."
            )
        
        return summary, insights


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def _test_stress_tester():
    """Test du stress tester"""
    
    print("\n" + "="*70)
    print("STRESS TEST - 10 000 SIMULATIONS MONTE CARLO")
    print("="*70)
    
    tester = StressTester(random_seed=42)
    
    result = tester.run_full_stress_test(
        current_cash=250000,
        monthly_revenues=120000,
        monthly_costs=100000,
        revenue_volatility=0.18,
        cost_volatility=0.08
    )
    
    print(f"\n📊 SITUATION ACTUELLE:")
    print(f"   Cash: {result.current_cash:,.0f}€")
    print(f"   Burn mensuel: {result.current_monthly_burn:,.0f}€")
    print(f"   Runway: {result.current_runway:.1f} mois")
    
    mc = result.monte_carlo
    print(f"\n🎲 MONTE CARLO ({mc.n_simulations:,} simulations):")
    print(f"   Cash moyen à 12 mois: {mc.cash_mean:,.0f}€")
    print(f"   Cash median: {mc.cash_median:,.0f}€")
    print(f"   Intervalle 90%: [{mc.cash_p5:,.0f}€ - {mc.cash_p95:,.0f}€]")
    print(f"   P(cash < 0): {mc.prob_negative_cash*100:.1f}%")
    print(f"   P(cash < seuil sécurité): {mc.prob_under_safety*100:.1f}%")
    print(f"   VaR 95%: {mc.var_95:,.0f}€")
    print(f"   CVaR 95%: {mc.cvar_95:,.0f}€")
    
    print(f"\n⚡ SCÉNARIOS DE STRESS:")
    for s in result.scenarios[:4]:
        emoji = "🟢" if s.survival_probability > 0.8 else "🟡" if s.survival_probability > 0.5 else "🔴"
        print(f"   {emoji} {s.name}: survie {s.survival_probability*100:.0f}%, impact {s.impact_on_cash:,.0f}€")
    
    print(f"\n🎯 SENSIBILITÉ:")
    for s in result.sensitivities:
        print(f"   • {s.variable_name}: élasticité {s.elasticity:.2f}, seuil critique {s.critical_threshold:.1f}")
    
    print(f"\n🔄 REVERSE STRESS TEST:")
    rs = result.reverse_stress
    print(f"   Breaking points:")
    for k, v in rs.breaking_points.items():
        print(f"     • {k}: {v}")
    print(f"   Probabilité: {rs.scenario_probability*100:.1f}%")
    
    print(f"\n⚠️ ÉVALUATION RISQUE:")
    print(f"   Niveau: {result.overall_risk_level.value.upper()}")
    print(f"   Score: {result.risk_score:.0f}/100")
    
    print(f"\n🛡️ ACTIONS DE COUVERTURE:")
    for a in result.hedging_actions[:3]:
        print(f"   [{a['priority'].upper()}] {a['action']}")
    
    print(f"\n📋 PLAN DE CONTINGENCE:")
    for level, details in result.contingency_plan.items():
        if isinstance(details, dict) and 'threshold' in details:
            print(f"   {level}: {details['threshold']}")
    
    print(f"\n📝 SYNTHÈSE:")
    print(f"   {result.summary}")
    
    print(f"\n💡 INSIGHTS CLÉS:")
    for insight in result.key_insights:
        print(f"   {insight}")
    
    return result


if __name__ == "__main__":
    _test_stress_tester()

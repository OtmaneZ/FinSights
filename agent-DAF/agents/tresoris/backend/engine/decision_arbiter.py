"""
TRESORIS V3 - Decision Arbiter
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Module d'arbitrage décisionnel financier.
Compare des options, calcule le vrai coût/bénéfice, recommande.

Effet démo visé :
"Recruter vs sous-traiter ? Sur 3 ans, l'embauche vous coûte 12% de moins 
 mais nécessite 45k€ d'avance de trésorerie."
"Leasing vs achat ? Le leasing coûte 8 400€ de plus au total, 
 mais préserve 35k€ de cash disponible."
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
import pandas as pd
import numpy as np
from abc import ABC, abstractmethod


class DecisionType(str, Enum):
    """Types de décisions supportées"""
    HIRE_VS_OUTSOURCE = "hire_vs_outsource"
    BUY_VS_LEASE = "buy_vs_lease"
    MAKE_VS_BUY = "make_vs_buy"
    EARLY_PAYMENT_DISCOUNT = "early_payment_discount"
    CREDIT_LINE_VS_FACTORING = "credit_vs_factoring"
    GROWTH_INVESTMENT = "growth_investment"
    COST_REDUCTION = "cost_reduction"
    PRICING_STRATEGY = "pricing_strategy"
    CUSTOM = "custom"


class RecommendationStrength(str, Enum):
    """Force de la recommandation"""
    STRONG_A = "strongly_recommend_a"      # Option A clairement meilleure
    SLIGHT_A = "slightly_prefer_a"         # Option A légèrement meilleure
    NEUTRAL = "neutral"                     # Équivalent
    SLIGHT_B = "slightly_prefer_b"
    STRONG_B = "strongly_recommend_b"


@dataclass
class CashFlowImpact:
    """Impact cash d'une option sur une période"""
    year: int
    initial_outlay: float                   # Investissement initial
    operating_costs: float                  # Coûts opérationnels
    operating_benefits: float               # Bénéfices/économies
    net_cash_flow: float                    # Flux net
    cumulative_cash_flow: float             # Cumul
    
    def to_dict(self) -> Dict:
        return {
            "year": self.year,
            "initial_outlay": round(self.initial_outlay, 0),
            "operating_costs": round(self.operating_costs, 0),
            "operating_benefits": round(self.operating_benefits, 0),
            "net_cash_flow": round(self.net_cash_flow, 0),
            "cumulative": round(self.cumulative_cash_flow, 0)
        }


@dataclass
class DecisionOption:
    """Une option dans une décision"""
    option_id: str
    name: str
    description: str
    
    # Financier
    total_cost: float                       # Coût total sur la période
    total_benefit: float                    # Bénéfices totaux
    net_value: float                        # Valeur nette
    npv: float                              # Valeur actuelle nette
    irr: Optional[float]                    # Taux de rentabilité interne
    payback_months: Optional[float]         # Délai de récupération
    
    # Cash flow
    max_cash_outflow: float                 # Besoin max de cash
    time_to_positive_cf: Optional[float]    # Mois avant cash flow positif
    cash_flows: List[CashFlowImpact]
    
    # Risque
    risk_score: float                       # 0-100
    risk_factors: List[str]
    sensitivity: Dict[str, float]           # Sensibilité aux variables
    
    # Qualitatif
    pros: List[str]
    cons: List[str]
    hidden_costs: List[Dict]
    
    # Score final
    weighted_score: float                   # Score pondéré multi-critères
    
    def to_dict(self) -> Dict:
        return {
            "option_id": self.option_id,
            "name": self.name,
            "description": self.description,
            "financials": {
                "total_cost": round(self.total_cost, 0),
                "total_benefit": round(self.total_benefit, 0),
                "net_value": round(self.net_value, 0),
                "npv": round(self.npv, 0),
                "irr": f"{self.irr*100:.1f}%" if self.irr else None,
                "payback_months": round(self.payback_months, 1) if self.payback_months else None
            },
            "cash_impact": {
                "max_outflow": round(self.max_cash_outflow, 0),
                "months_to_positive": self.time_to_positive_cf
            },
            "cash_flows": [cf.to_dict() for cf in self.cash_flows],
            "risk": {
                "score": self.risk_score,
                "factors": self.risk_factors,
                "sensitivity": self.sensitivity
            },
            "qualitative": {
                "pros": self.pros,
                "cons": self.cons,
                "hidden_costs": self.hidden_costs
            },
            "weighted_score": round(self.weighted_score, 1)
        }


@dataclass
class ArbitrationResult:
    """Résultat d'un arbitrage décisionnel"""
    timestamp: datetime
    decision_type: DecisionType
    question: str                           # La question posée
    horizon_years: int
    discount_rate: float
    
    # Options analysées
    option_a: DecisionOption
    option_b: DecisionOption
    
    # Recommandation
    recommendation: str                     # "option_a" ou "option_b"
    recommendation_strength: RecommendationStrength
    confidence_score: float                 # 0-100%
    
    # Comparaison
    cost_difference: float                  # A - B (positif = A plus cher)
    npv_difference: float
    cash_difference: float                  # Différence besoin cash
    risk_difference: float
    
    # Breakeven
    breakeven_point: Optional[Dict]         # À partir de quand une option devient meilleure
    
    # Conditions
    conditions_favor_a: List[str]
    conditions_favor_b: List[str]
    
    # Synthèse
    summary: str
    key_insight: str
    one_liner: str                          # La phrase choc
    
    # Données pour graphiques
    comparison_chart_data: Dict
    
    def to_dict(self) -> Dict:
        return {
            "timestamp": self.timestamp.isoformat(),
            "decision_type": self.decision_type.value,
            "question": self.question,
            "horizon_years": self.horizon_years,
            "discount_rate": f"{self.discount_rate*100:.1f}%",
            "option_a": self.option_a.to_dict(),
            "option_b": self.option_b.to_dict(),
            "recommendation": {
                "choice": self.recommendation,
                "strength": self.recommendation_strength.value,
                "confidence": round(self.confidence_score, 0)
            },
            "comparison": {
                "cost_difference": round(self.cost_difference, 0),
                "npv_difference": round(self.npv_difference, 0),
                "cash_difference": round(self.cash_difference, 0),
                "risk_difference": round(self.risk_difference, 1)
            },
            "breakeven": self.breakeven_point,
            "conditions": {
                "favor_a": self.conditions_favor_a,
                "favor_b": self.conditions_favor_b
            },
            "summary": self.summary,
            "key_insight": self.key_insight,
            "one_liner": self.one_liner,
            "chart_data": self.comparison_chart_data
        }


class DecisionArbiter:
    """
    Module d'arbitrage décisionnel.
    
    Ce qui le rend impressionnant :
    1. Compare vraiment les options (pas juste les coûts évidents)
    2. Calcule NPV, IRR, payback
    3. Identifie les coûts cachés
    4. Analyse de sensibilité
    5. Conditions de bascule
    6. Recommandation pondérée multi-critères
    """
    
    # Poids par défaut pour scoring
    DEFAULT_WEIGHTS = {
        "npv": 0.35,
        "cash_impact": 0.25,
        "risk": 0.20,
        "flexibility": 0.10,
        "strategic_fit": 0.10
    }
    
    def __init__(self, discount_rate: float = 0.08):
        self.discount_rate = discount_rate
    
    # ═══════════════════════════════════════════════════════════════════════
    # ARBITRAGES PRÉDÉFINIS
    # ═══════════════════════════════════════════════════════════════════════
    
    def arbitrate_hire_vs_outsource(
        self,
        monthly_salary: float,
        employer_charges_rate: float = 0.45,
        recruitment_cost: float = 8000,
        training_months: float = 2,
        monthly_outsource_rate: float = 0,
        outsource_markup: float = 1.8,
        horizon_years: int = 3,
        workload_hours_per_month: float = 160,
        productivity_ramp_months: int = 6
    ) -> ArbitrationResult:
        """
        Arbitrage Embaucher vs Sous-traiter.
        
        Args:
            monthly_salary: Salaire brut mensuel
            employer_charges_rate: Taux de charges patronales (0.45 = 45%)
            recruitment_cost: Coût du recrutement
            training_months: Mois de formation (coût sans productivité)
            monthly_outsource_rate: Tarif mensuel sous-traitance (si 0, calculé)
            outsource_markup: Markup prestataire vs salarié
            horizon_years: Horizon d'analyse
            workload_hours_per_month: Heures de travail par mois
            productivity_ramp_months: Mois pour atteindre pleine productivité
        """
        
        question = f"Recruter un salarié à {monthly_salary:,.0f}€/mois ou sous-traiter?"
        
        # Coûts employé
        monthly_employee_cost = monthly_salary * (1 + employer_charges_rate)
        annual_employee_cost = monthly_employee_cost * 12
        
        # Ajouter coûts cachés
        hidden_costs_employee = [
            {"name": "Congés payés", "annual": monthly_employee_cost * 2.5 / 12 * 12},  # ~2.5 jours/mois
            {"name": "Arrêts maladie", "annual": annual_employee_cost * 0.03},
            {"name": "Matériel/Outils", "annual": 3000},
            {"name": "Management overhead", "annual": annual_employee_cost * 0.10},
            {"name": "Turnover risk", "annual": annual_employee_cost * 0.08}
        ]
        total_hidden_annual = sum(h["annual"] for h in hidden_costs_employee)
        real_annual_employee = annual_employee_cost + total_hidden_annual
        
        # Coûts sous-traitance
        if monthly_outsource_rate == 0:
            monthly_outsource_rate = monthly_employee_cost * outsource_markup
        annual_outsource = monthly_outsource_rate * 12
        
        hidden_costs_outsource = [
            {"name": "Temps de coordination", "annual": annual_outsource * 0.08},
            {"name": "Risque qualité", "annual": annual_outsource * 0.05},
            {"name": "Risque dépendance", "annual": annual_outsource * 0.03}
        ]
        real_annual_outsource = annual_outsource + sum(h["annual"] for h in hidden_costs_outsource)
        
        # Cash flows Employé
        cf_employee = []
        cumul = 0
        for y in range(1, horizon_years + 1):
            if y == 1:
                initial = recruitment_cost + (monthly_employee_cost * training_months)
                # Productivité réduite les premiers mois
                productivity_loss = monthly_employee_cost * productivity_ramp_months * 0.3
                operating = real_annual_employee * 0.7 + productivity_loss
            else:
                initial = 0
                operating = real_annual_employee
            
            net = -(initial + operating)
            cumul += net
            cf_employee.append(CashFlowImpact(
                year=y,
                initial_outlay=initial,
                operating_costs=operating,
                operating_benefits=0,
                net_cash_flow=net,
                cumulative_cash_flow=cumul
            ))
        
        # Cash flows Sous-traitance
        cf_outsource = []
        cumul = 0
        for y in range(1, horizon_years + 1):
            operating = real_annual_outsource
            net = -operating
            cumul += net
            cf_outsource.append(CashFlowImpact(
                year=y,
                initial_outlay=0,
                operating_costs=operating,
                operating_benefits=0,
                net_cash_flow=net,
                cumulative_cash_flow=cumul
            ))
        
        # NPV
        npv_employee = self._calculate_npv([cf.net_cash_flow for cf in cf_employee])
        npv_outsource = self._calculate_npv([cf.net_cash_flow for cf in cf_outsource])
        
        # Total costs
        total_employee = sum(cf.initial_outlay + cf.operating_costs for cf in cf_employee)
        total_outsource = sum(cf.operating_costs for cf in cf_outsource)
        
        # Options
        option_a = DecisionOption(
            option_id="hire",
            name="Embauche CDI",
            description=f"Recruter en CDI à {monthly_salary:,.0f}€ brut/mois",
            total_cost=total_employee,
            total_benefit=0,
            net_value=-total_employee,
            npv=npv_employee,
            irr=None,
            payback_months=None,
            max_cash_outflow=recruitment_cost + monthly_employee_cost * 3,
            time_to_positive_cf=None,
            cash_flows=cf_employee,
            risk_score=45,
            risk_factors=[
                "Risque turnover (coût de remplacement)",
                "Rigidité en cas de baisse d'activité",
                "Temps de montée en compétence"
            ],
            sensitivity={"salary": 0.85, "charges": 0.15, "turnover": 0.20},
            pros=[
                "Coût unitaire inférieur long terme",
                "Fidélisation et culture d'entreprise",
                "Capital humain interne",
                "Flexibilité des missions"
            ],
            cons=[
                "Investissement initial important",
                "Rigidité (CDI)",
                "Management et RH overhead"
            ],
            hidden_costs=hidden_costs_employee,
            weighted_score=0  # Calculé après
        )
        
        option_b = DecisionOption(
            option_id="outsource",
            name="Sous-traitance",
            description=f"Externaliser à {monthly_outsource_rate:,.0f}€/mois",
            total_cost=total_outsource,
            total_benefit=0,
            net_value=-total_outsource,
            npv=npv_outsource,
            irr=None,
            payback_months=None,
            max_cash_outflow=monthly_outsource_rate,
            time_to_positive_cf=None,
            cash_flows=cf_outsource,
            risk_score=55,
            risk_factors=[
                "Dépendance au prestataire",
                "Risque qualité et disponibilité",
                "Augmentation des tarifs"
            ],
            sensitivity={"tarif": 0.90, "volume": 0.50},
            pros=[
                "Flexibilité totale (arrêt facile)",
                "Pas d'investissement initial",
                "Expertise immédiate",
                "Cash flow préservé"
            ],
            cons=[
                "Coût unitaire plus élevé",
                "Pas de capital humain",
                "Moins de contrôle"
            ],
            hidden_costs=hidden_costs_outsource,
            weighted_score=0
        )
        
        # Scoring
        option_a.weighted_score = self._calculate_weighted_score(option_a, option_b, prefer_cash=False)
        option_b.weighted_score = self._calculate_weighted_score(option_b, option_a, prefer_cash=True)
        
        # Recommandation
        cost_diff = total_employee - total_outsource
        npv_diff = npv_employee - npv_outsource
        
        if cost_diff < -total_outsource * 0.15:
            reco = "option_a"
            strength = RecommendationStrength.STRONG_A
        elif cost_diff < -total_outsource * 0.05:
            reco = "option_a"
            strength = RecommendationStrength.SLIGHT_A
        elif cost_diff > total_employee * 0.10:
            reco = "option_b"
            strength = RecommendationStrength.SLIGHT_B
        else:
            reco = "option_a" if npv_employee > npv_outsource else "option_b"
            strength = RecommendationStrength.NEUTRAL
        
        # Breakeven
        annual_saving = real_annual_outsource - real_annual_employee
        upfront = recruitment_cost + monthly_employee_cost * training_months * 1.3
        breakeven_months = upfront / (annual_saving / 12) if annual_saving > 0 else None
        
        # Conditions
        conditions_a = [
            f"Volume de travail stable sur {horizon_years}+ ans",
            "Compétence stratégique à internaliser",
            f"Possibilité d'absorber l'investissement initial ({upfront:,.0f}€)"
        ]
        conditions_b = [
            "Besoin temporaire ou incertain",
            "Expertise ponctuelle non stratégique",
            "Cash flow tendu"
        ]
        
        # One-liner
        savings_pct = abs(cost_diff) / total_outsource * 100
        if cost_diff < 0:
            one_liner = (
                f"Recruter vs sous-traiter ? Sur {horizon_years} ans, l'embauche vous fait économiser "
                f"{abs(cost_diff):,.0f}€ ({savings_pct:.0f}%), mais nécessite {upfront:,.0f}€ d'avance."
            )
        else:
            one_liner = (
                f"La sous-traitance coûte {savings_pct:.0f}% de moins au total, "
                f"et préserve {upfront:,.0f}€ de trésorerie."
            )
        
        return ArbitrationResult(
            timestamp=datetime.now(),
            decision_type=DecisionType.HIRE_VS_OUTSOURCE,
            question=question,
            horizon_years=horizon_years,
            discount_rate=self.discount_rate,
            option_a=option_a,
            option_b=option_b,
            recommendation=reco,
            recommendation_strength=strength,
            confidence_score=75 if strength in [RecommendationStrength.STRONG_A, RecommendationStrength.STRONG_B] else 60,
            cost_difference=cost_diff,
            npv_difference=npv_diff,
            cash_difference=option_a.max_cash_outflow - option_b.max_cash_outflow,
            risk_difference=option_a.risk_score - option_b.risk_score,
            breakeven_point={
                "months": round(breakeven_months, 0) if breakeven_months else None,
                "description": f"L'embauche devient rentable après {breakeven_months:.0f} mois" if breakeven_months else "N/A"
            },
            conditions_favor_a=conditions_a,
            conditions_favor_b=conditions_b,
            summary=self._generate_summary("Embauche", "Sous-traitance", cost_diff, strength),
            key_insight=f"Économie de {abs(cost_diff):,.0f}€ sur {horizon_years} ans" if cost_diff < 0 else f"Surcoût de {cost_diff:,.0f}€ compensé par flexibilité",
            one_liner=one_liner,
            comparison_chart_data=self._generate_chart_data(option_a, option_b)
        )
    
    def arbitrate_buy_vs_lease(
        self,
        purchase_price: float,
        useful_life_years: int = 5,
        residual_value_pct: float = 0.10,
        monthly_lease_rate: float = 0,
        lease_rate_pct: float = 0.025,
        lease_term_months: int = 36,
        maintenance_annual: float = 0,
        horizon_years: int = 5
    ) -> ArbitrationResult:
        """
        Arbitrage Acheter vs Louer (leasing).
        """
        
        question = f"Acheter à {purchase_price:,.0f}€ ou leaser sur {lease_term_months} mois?"
        
        # Calcul leasing
        if monthly_lease_rate == 0:
            monthly_lease_rate = purchase_price * lease_rate_pct
        
        total_lease_payments = monthly_lease_rate * lease_term_months
        
        # Achat
        residual_value = purchase_price * residual_value_pct
        total_depreciation = purchase_price - residual_value
        annual_depreciation = total_depreciation / useful_life_years
        
        # Cash flows Achat
        cf_buy = []
        cumul = 0
        for y in range(1, horizon_years + 1):
            if y == 1:
                initial = purchase_price
            else:
                initial = 0
            
            operating = maintenance_annual
            benefit = annual_depreciation * 0.25  # Économie d'impôt (taux 25%)
            
            if y == horizon_years:
                benefit += residual_value  # Revente
            
            net = -(initial + operating) + benefit
            cumul += net
            cf_buy.append(CashFlowImpact(
                year=y,
                initial_outlay=initial,
                operating_costs=operating,
                operating_benefits=benefit,
                net_cash_flow=net,
                cumulative_cash_flow=cumul
            ))
        
        # Cash flows Leasing
        cf_lease = []
        cumul = 0
        for y in range(1, horizon_years + 1):
            if y <= lease_term_months / 12:
                operating = monthly_lease_rate * 12
            else:
                operating = 0  # Fin du lease
            
            benefit = operating * 0.25  # Déductible
            
            net = -operating + benefit
            cumul += net
            cf_lease.append(CashFlowImpact(
                year=y,
                initial_outlay=0,
                operating_costs=operating,
                operating_benefits=benefit,
                net_cash_flow=net,
                cumulative_cash_flow=cumul
            ))
        
        # NPV
        npv_buy = self._calculate_npv([cf.net_cash_flow for cf in cf_buy])
        npv_lease = self._calculate_npv([cf.net_cash_flow for cf in cf_lease])
        
        # Coûts totaux
        total_buy = purchase_price + maintenance_annual * horizon_years - residual_value
        total_lease = total_lease_payments * (horizon_years / (lease_term_months/12))
        
        # Options
        option_a = DecisionOption(
            option_id="buy",
            name="Achat",
            description=f"Acheter à {purchase_price:,.0f}€",
            total_cost=total_buy,
            total_benefit=residual_value,
            net_value=-total_buy,
            npv=npv_buy,
            irr=None,
            payback_months=None,
            max_cash_outflow=purchase_price,
            time_to_positive_cf=None,
            cash_flows=cf_buy,
            risk_score=40,
            risk_factors=[
                "Risque de dépréciation",
                "Obsolescence technologique",
                "Immobilisation de capital"
            ],
            sensitivity={"prix": 0.80, "revente": 0.20},
            pros=[
                "Propriété de l'actif",
                "Pas de paiements mensuels après achat",
                "Valeur résiduelle"
            ],
            cons=[
                "Investissement initial important",
                "Risque d'obsolescence",
                "Maintenance à charge"
            ],
            hidden_costs=[
                {"name": "Coût d'opportunité du capital", "annual": purchase_price * self.discount_rate},
                {"name": "Assurance", "annual": purchase_price * 0.02}
            ],
            weighted_score=0
        )
        
        option_b = DecisionOption(
            option_id="lease",
            name="Leasing",
            description=f"Louer à {monthly_lease_rate:,.0f}€/mois sur {lease_term_months} mois",
            total_cost=total_lease,
            total_benefit=0,
            net_value=-total_lease,
            npv=npv_lease,
            irr=None,
            payback_months=None,
            max_cash_outflow=monthly_lease_rate * 3,  # Dépôt + 2 mois
            time_to_positive_cf=None,
            cash_flows=cf_lease,
            risk_score=30,
            risk_factors=[
                "Engagement contractuel",
                "Pénalités de sortie anticipée"
            ],
            sensitivity={"mensualité": 0.95},
            pros=[
                "Cash flow préservé",
                "Flexibilité de renouvellement",
                "Matériel toujours récent",
                "Déductibilité fiscale totale"
            ],
            cons=[
                "Coût total généralement plus élevé",
                "Pas de propriété",
                "Engagement sur durée"
            ],
            hidden_costs=[
                {"name": "Frais de dossier", "annual": 200},
                {"name": "Pénalités potentielles", "annual": monthly_lease_rate * 0.5}
            ],
            weighted_score=0
        )
        
        # Scoring
        option_a.weighted_score = self._calculate_weighted_score(option_a, option_b, prefer_cash=False)
        option_b.weighted_score = self._calculate_weighted_score(option_b, option_a, prefer_cash=True)
        
        # Recommandation
        cost_diff = total_buy - total_lease
        
        if cost_diff < -total_lease * 0.15:
            reco = "option_a"
            strength = RecommendationStrength.STRONG_A
        elif cost_diff < -total_lease * 0.05:
            reco = "option_a"
            strength = RecommendationStrength.SLIGHT_A
        elif cost_diff > total_buy * 0.10:
            reco = "option_b"
            strength = RecommendationStrength.SLIGHT_B
        else:
            reco = "option_b"  # En cas de doute, leasing pour préserver cash
            strength = RecommendationStrength.NEUTRAL
        
        # One-liner
        if cost_diff > 0:
            one_liner = (
                f"Leasing vs achat ? Le leasing coûte {cost_diff:,.0f}€ de plus au total, "
                f"mais préserve {purchase_price - option_b.max_cash_outflow:,.0f}€ de cash."
            )
        else:
            one_liner = (
                f"L'achat économise {abs(cost_diff):,.0f}€ sur {horizon_years} ans, "
                f"mais immobilise {purchase_price:,.0f}€ de capital."
            )
        
        return ArbitrationResult(
            timestamp=datetime.now(),
            decision_type=DecisionType.BUY_VS_LEASE,
            question=question,
            horizon_years=horizon_years,
            discount_rate=self.discount_rate,
            option_a=option_a,
            option_b=option_b,
            recommendation=reco,
            recommendation_strength=strength,
            confidence_score=70,
            cost_difference=cost_diff,
            npv_difference=npv_buy - npv_lease,
            cash_difference=option_a.max_cash_outflow - option_b.max_cash_outflow,
            risk_difference=option_a.risk_score - option_b.risk_score,
            breakeven_point=None,
            conditions_favor_a=[
                "Trésorerie suffisante",
                "Usage long terme prévu",
                "Valeur résiduelle significative"
            ],
            conditions_favor_b=[
                "Préservation du cash prioritaire",
                "Technologie à évolution rapide",
                "Incertitude sur besoins futurs"
            ],
            summary=self._generate_summary("Achat", "Leasing", cost_diff, strength),
            key_insight=one_liner,
            one_liner=one_liner,
            comparison_chart_data=self._generate_chart_data(option_a, option_b)
        )
    
    def arbitrate_early_payment_discount(
        self,
        invoice_amount: float,
        discount_rate: float = 0.02,
        discount_days: int = 10,
        normal_days: int = 30,
        current_cash: float = 100000,
        opportunity_cost_rate: float = 0.08
    ) -> ArbitrationResult:
        """
        Arbitrage escompte pour paiement anticipé.
        
        Example: 2/10 net 30 = 2% de remise si paiement à 10j au lieu de 30j
        """
        
        question = f"Payer {invoice_amount:,.0f}€ maintenant avec {discount_rate*100:.0f}% de remise ou attendre {normal_days}j?"
        
        # Économie avec escompte
        discount_amount = invoice_amount * discount_rate
        discounted_price = invoice_amount - discount_amount
        
        # Coût d'opportunité de payer plus tôt
        days_early = normal_days - discount_days
        opportunity_cost = discounted_price * (opportunity_cost_rate / 365) * days_early
        
        # Rendement annualisé de l'escompte
        annualized_return = (discount_rate / (1 - discount_rate)) * (365 / days_early)
        
        # Option A: Payer tôt avec escompte
        option_a = DecisionOption(
            option_id="early_pay",
            name="Paiement anticipé",
            description=f"Payer {discounted_price:,.0f}€ à J+{discount_days}",
            total_cost=discounted_price,
            total_benefit=discount_amount,
            net_value=discount_amount - opportunity_cost,
            npv=discounted_price,
            irr=annualized_return,
            payback_months=0,
            max_cash_outflow=discounted_price,
            time_to_positive_cf=0,
            cash_flows=[],
            risk_score=20,
            risk_factors=["Sortie de cash anticipée"],
            sensitivity={"taux_escompte": 0.90},
            pros=[
                f"Économie de {discount_amount:,.0f}€ ({discount_rate*100:.0f}%)",
                f"Rendement annualisé de {annualized_return*100:.1f}%",
                "Bonne relation fournisseur"
            ],
            cons=[
                "Sortie de cash anticipée",
                f"Coût d'opportunité: {opportunity_cost:,.0f}€"
            ],
            hidden_costs=[],
            weighted_score=0
        )
        
        # Option B: Payer à échéance normale
        option_b = DecisionOption(
            option_id="normal_pay",
            name="Paiement à échéance",
            description=f"Payer {invoice_amount:,.0f}€ à J+{normal_days}",
            total_cost=invoice_amount,
            total_benefit=0,
            net_value=0,
            npv=invoice_amount,
            irr=0,
            payback_months=0,
            max_cash_outflow=invoice_amount,
            time_to_positive_cf=normal_days / 30,
            cash_flows=[],
            risk_score=10,
            risk_factors=[],
            sensitivity={},
            pros=[
                f"Cash préservé {days_early} jours de plus",
                "Flexibilité financière"
            ],
            cons=[
                f"Perte de remise: {discount_amount:,.0f}€"
            ],
            hidden_costs=[],
            weighted_score=0
        )
        
        # Recommandation
        net_benefit = discount_amount - opportunity_cost
        
        if annualized_return > opportunity_cost_rate * 1.5:
            reco = "option_a"
            strength = RecommendationStrength.STRONG_A
        elif annualized_return > opportunity_cost_rate:
            reco = "option_a"
            strength = RecommendationStrength.SLIGHT_A
        elif current_cash < invoice_amount * 3:
            reco = "option_b"
            strength = RecommendationStrength.SLIGHT_B
        else:
            reco = "option_a"
            strength = RecommendationStrength.NEUTRAL
        
        one_liner = (
            f"L'escompte de {discount_rate*100:.0f}% équivaut à un rendement annualisé de {annualized_return*100:.0f}%. "
            f"{'Prenez-le!' if reco == 'option_a' else 'Mais préservez votre cash.'}"
        )
        
        return ArbitrationResult(
            timestamp=datetime.now(),
            decision_type=DecisionType.EARLY_PAYMENT_DISCOUNT,
            question=question,
            horizon_years=0,
            discount_rate=self.discount_rate,
            option_a=option_a,
            option_b=option_b,
            recommendation=reco,
            recommendation_strength=strength,
            confidence_score=85,
            cost_difference=discounted_price - invoice_amount,
            npv_difference=0,
            cash_difference=-days_early,
            risk_difference=10,
            breakeven_point={
                "opportunity_cost_breakeven": f"{annualized_return*100:.1f}%",
                "description": f"L'escompte est rentable si votre coût du capital est < {annualized_return*100:.1f}%"
            },
            conditions_favor_a=[
                f"Trésorerie > {invoice_amount * 3:,.0f}€",
                f"Coût du capital < {annualized_return*100:.0f}%"
            ],
            conditions_favor_b=[
                "Trésorerie tendue",
                "Meilleur usage du cash disponible"
            ],
            summary=f"L'escompte représente un rendement de {annualized_return*100:.1f}% annualisé.",
            key_insight=f"Économie nette: {net_benefit:,.0f}€",
            one_liner=one_liner,
            comparison_chart_data={}
        )
    
    # ═══════════════════════════════════════════════════════════════════════
    # UTILITAIRES
    # ═══════════════════════════════════════════════════════════════════════
    
    def _calculate_npv(self, cash_flows: List[float]) -> float:
        """Calcule la NPV"""
        npv = 0
        for i, cf in enumerate(cash_flows):
            npv += cf / ((1 + self.discount_rate) ** (i + 1))
        return npv
    
    def _calculate_irr(self, cash_flows: List[float], initial_investment: float) -> Optional[float]:
        """Calcule le TRI (simplifié)"""
        try:
            all_flows = [-initial_investment] + cash_flows
            return np.irr(all_flows)
        except:
            return None
    
    def _calculate_weighted_score(
        self,
        option: DecisionOption,
        other: DecisionOption,
        prefer_cash: bool = False
    ) -> float:
        """Score pondéré multi-critères"""
        
        score = 50  # Base
        
        # NPV
        if option.npv > other.npv:
            score += 15
        elif option.npv < other.npv:
            score -= 15
        
        # Cash impact
        if option.max_cash_outflow < other.max_cash_outflow:
            score += 10 if prefer_cash else 5
        else:
            score -= 10 if prefer_cash else 5
        
        # Risk
        if option.risk_score < other.risk_score:
            score += 8
        else:
            score -= 5
        
        # Cost
        if option.total_cost < other.total_cost:
            score += 12
        else:
            score -= 8
        
        return max(0, min(100, score))
    
    def _generate_summary(
        self,
        name_a: str,
        name_b: str,
        cost_diff: float,
        strength: RecommendationStrength
    ) -> str:
        """Génère un résumé"""
        
        if strength == RecommendationStrength.STRONG_A:
            return f"{name_a} est clairement recommandé avec {abs(cost_diff):,.0f}€ d'économies."
        elif strength == RecommendationStrength.SLIGHT_A:
            return f"{name_a} est légèrement préférable mais les deux options sont viables."
        elif strength == RecommendationStrength.SLIGHT_B:
            return f"{name_b} offre un meilleur compromis, surtout pour la flexibilité."
        elif strength == RecommendationStrength.STRONG_B:
            return f"{name_b} est recommandé avec un avantage significatif."
        else:
            return "Les deux options sont équivalentes, le choix dépend de votre contexte."
    
    def _generate_chart_data(
        self,
        option_a: DecisionOption,
        option_b: DecisionOption
    ) -> Dict:
        """Génère données pour graphiques de comparaison"""
        
        return {
            "cumulative_cash_flow": {
                "labels": [f"Année {cf.year}" for cf in option_a.cash_flows],
                "option_a": [cf.cumulative_cash_flow for cf in option_a.cash_flows],
                "option_b": [cf.cumulative_cash_flow for cf in option_b.cash_flows]
            },
            "comparison_bar": {
                "categories": ["Coût total", "NPV", "Max cash", "Score risque"],
                "option_a": [option_a.total_cost, option_a.npv, option_a.max_cash_outflow, option_a.risk_score],
                "option_b": [option_b.total_cost, option_b.npv, option_b.max_cash_outflow, option_b.risk_score]
            },
            "pros_cons": {
                "option_a": {"pros": option_a.pros, "cons": option_a.cons},
                "option_b": {"pros": option_b.pros, "cons": option_b.cons}
            }
        }


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def _test_decision_arbiter():
    """Test du decision arbiter"""
    
    arbiter = DecisionArbiter(discount_rate=0.08)
    
    print("\n" + "="*70)
    print("DECISION ARBITER - RECRUTER VS SOUS-TRAITER")
    print("="*70)
    
    result = arbiter.arbitrate_hire_vs_outsource(
        monthly_salary=4500,
        employer_charges_rate=0.45,
        recruitment_cost=8000,
        training_months=2,
        horizon_years=3
    )
    
    print(f"\n❓ QUESTION: {result.question}")
    
    print(f"\n📊 OPTION A - {result.option_a.name}:")
    print(f"   Coût total: {result.option_a.total_cost:,.0f}€")
    print(f"   NPV: {result.option_a.npv:,.0f}€")
    print(f"   Max cash out: {result.option_a.max_cash_outflow:,.0f}€")
    print(f"   Risque: {result.option_a.risk_score}/100")
    
    print(f"\n📊 OPTION B - {result.option_b.name}:")
    print(f"   Coût total: {result.option_b.total_cost:,.0f}€")
    print(f"   NPV: {result.option_b.npv:,.0f}€")
    print(f"   Max cash out: {result.option_b.max_cash_outflow:,.0f}€")
    print(f"   Risque: {result.option_b.risk_score}/100")
    
    print(f"\n🎯 RECOMMANDATION:")
    print(f"   Choix: {result.recommendation.upper()}")
    print(f"   Force: {result.recommendation_strength.value}")
    print(f"   Confiance: {result.confidence_score:.0f}%")
    
    print(f"\n📈 COMPARAISON:")
    print(f"   Différence coût: {result.cost_difference:+,.0f}€")
    print(f"   Différence NPV: {result.npv_difference:+,.0f}€")
    print(f"   Différence cash: {result.cash_difference:+,.0f}€")
    
    if result.breakeven_point:
        print(f"\n⏰ BREAKEVEN: {result.breakeven_point['description']}")
    
    print(f"\n💬 ONE-LINER:")
    print(f"   \"{result.one_liner}\"")
    
    # Test Buy vs Lease
    print("\n" + "="*70)
    print("DECISION ARBITER - ACHETER VS LEASING")
    print("="*70)
    
    result2 = arbiter.arbitrate_buy_vs_lease(
        purchase_price=45000,
        useful_life_years=5,
        residual_value_pct=0.15,
        lease_term_months=48,
        horizon_years=5
    )
    
    print(f"\n❓ QUESTION: {result2.question}")
    print(f"\n💬 ONE-LINER:")
    print(f"   \"{result2.one_liner}\"")
    print(f"\n🎯 RECOMMANDATION: {result2.recommendation.upper()} ({result2.recommendation_strength.value})")
    
    # Test Escompte
    print("\n" + "="*70)
    print("DECISION ARBITER - ESCOMPTE PAIEMENT ANTICIPÉ")
    print("="*70)
    
    result3 = arbiter.arbitrate_early_payment_discount(
        invoice_amount=25000,
        discount_rate=0.02,
        discount_days=10,
        normal_days=30
    )
    
    print(f"\n❓ QUESTION: {result3.question}")
    print(f"\n💬 ONE-LINER:")
    print(f"   \"{result3.one_liner}\"")
    print(f"\n🎯 RECOMMANDATION: {result3.recommendation.upper()}")
    
    return result, result2, result3


if __name__ == "__main__":
    _test_decision_arbiter()

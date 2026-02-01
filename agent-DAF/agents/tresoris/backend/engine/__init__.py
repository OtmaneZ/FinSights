"""
TRESORIS V3 - Engine Module
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tous les moteurs d'analyse financière.

V1 - Base:
  • finance - Calculs trésorerie de base

V2 - Sophistication:
  • payment_patterns - Patterns de paiement clients
  • smart_forecast - Prévisions intelligentes
  • early_warning - Détection précoce
  • client_scoring - Scoring clients
  • action_optimizer - Optimisation actions
  • seasonality - Ajustements saisonniers

V3 - Powerhouse:
  • margin_analyzer - Analyse marges client/produit
  • cost_drift_analyzer - Détection dérive coûts
  • causal_analyzer - Analyse causale (WHY)
  • variance_analyzer - Écarts budget vs réel
  • stress_tester - Simulations Monte Carlo
  • decision_arbiter - Arbitrage décisionnel
"""

# ═══════════════════════════════════════════════════════════════════════════════
# V1 - BASE
# ═══════════════════════════════════════════════════════════════════════════════
from .finance import FinanceEngine, TreasuryPosition, CashForecast, RiskItem, ActionItem

# ═══════════════════════════════════════════════════════════════════════════════
# V2 - SOPHISTICATION
# ═══════════════════════════════════════════════════════════════════════════════
from .payment_patterns import ClientPaymentAnalyzer, ClientPaymentPattern
from .smart_forecast import SmartForecaster, SmartForecast
from .early_warning import EarlyWarningDetector, EarlyWarning
from .client_scoring import ClientRiskScorer, ClientRiskScore
from .action_optimizer import ActionPrioritizer, OptimizedAction
from .seasonality import SeasonalityAdjuster

# ═══════════════════════════════════════════════════════════════════════════════
# V3 - POWERHOUSE
# ═══════════════════════════════════════════════════════════════════════════════
from .margin_analyzer import (
    MarginAnalyzer,
    ClientMarginAnalysis,
    MarginDrivers,
    MarginAnomaly
)
from .cost_drift_analyzer import (
    CostDriftAnalyzer,
    CostDrift,
    GhostCost,
    CostCategory
)
from .causal_analyzer import (
    CausalAnalyzer,
    CausalLink,
    CausalChain,
    CausalAnalysisResult
)
from .variance_analyzer import (
    VarianceAnalyzer,
    VarianceLine,
    VarianceDecomposition,
    VarianceAnalysisResult
)
from .stress_tester import (
    StressTester,
    StressScenario,
    MonteCarloResult,
    SensitivityResult,
    ReverseStressResult,
    StressTestResult
)
from .decision_arbiter import (
    DecisionArbiter,
    DecisionOption,
    ArbitrationResult,
    DecisionType,
    CashFlowImpact
)


__all__ = [
    # ═══════════════════════════════════════════════════════════════════════════
    # V1 - BASE
    # ═══════════════════════════════════════════════════════════════════════════
    "FinanceEngine",
    "TreasuryPosition",
    "CashForecast",
    "RiskItem",
    "ActionItem",
    
    # ═══════════════════════════════════════════════════════════════════════════
    # V2 - SOPHISTICATION
    # ═══════════════════════════════════════════════════════════════════════════
    "ClientPaymentAnalyzer",
    "ClientPaymentPattern",
    "SmartForecaster",
    "SmartForecast",
    "EarlyWarningDetector",
    "EarlyWarning",
    "ClientRiskScorer",
    "ClientRiskScore",
    "ActionPrioritizer",
    "OptimizedAction",
    "SeasonalityAdjuster",
    
    # ═══════════════════════════════════════════════════════════════════════════
    # V3 - POWERHOUSE
    # ═══════════════════════════════════════════════════════════════════════════
    # Margin Analysis
    "MarginAnalyzer",
    "ClientMarginAnalysis",
    "MarginDrivers",
    "MarginAnomaly",
    
    # Cost Drift
    "CostDriftAnalyzer",
    "CostDrift",
    "GhostCost",
    "CostCategory",
    
    # Causal Analysis
    "CausalAnalyzer",
    "CausalLink",
    "CausalChain",
    "CausalAnalysisResult",
    
    # Variance
    "VarianceAnalyzer",
    "VarianceLine",
    "VarianceDecomposition",
    "VarianceAnalysisResult",
    
    # Stress Testing
    "StressTester",
    "StressScenario",
    "MonteCarloResult",
    "SensitivityResult",
    "ReverseStressResult",
    "StressTestResult",
    
    # Decision Arbitration
    "DecisionArbiter",
    "DecisionOption",
    "ArbitrationResult",
    "DecisionType",
    "CashFlowImpact",
]

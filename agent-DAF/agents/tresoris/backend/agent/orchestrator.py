"""
TRESORIS V3 - Orchestrator Brain
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Le cerveau central qui:
1. Décide QUELS engines utiliser
2. Combine les résultats intelligemment
3. Génère des insights narratifs
4. Apprend des interactions

C'est le "ChatGPT" de Tresoris - l'interface intelligente au-dessus des engines.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
import pandas as pd
import json

# LLM Layer
from llm.claude import LLMLayer, LLMResponse

# Identity & Personality
from agent.identity import (
    get_system_prompt,
    get_identity,
    get_personality,
    SYSTEM_PROMPTS,
    PRIORITIZATION_RULES,
    SIGNATURE_PHRASES,
    RESPONSE_TEMPLATES
)


class AnalysisMode(str, Enum):
    """Mode d'analyse demandé"""
    QUICK_CHECK = "quick_check"              # Check rapide routine
    DEEP_DIVE = "deep_dive"                  # Analyse approfondie
    SCENARIO_PLANNING = "scenario_planning"  # Planification scénarios
    DECISION_SUPPORT = "decision_support"    # Support décision
    VARIANCE_ANALYSIS = "variance_analysis"  # Analyse écarts
    STRESS_TEST = "stress_test"              # Test de stress
    MARGIN_ANALYSIS = "margin_analysis"      # Analyse marges
    COST_ANALYSIS = "cost_analysis"          # Analyse coûts


@dataclass
class OrchestratorContext:
    """Contexte pour l'orchestrateur"""
    mode: AnalysisMode
    question: Optional[str]                  # Question du DAF
    focus_area: Optional[str]                # Zone de focus (client, produit, etc)
    time_horizon: str = "4_weeks"            # Horizon temporel
    risk_appetite: str = "moderate"          # Appétit risque
    
    # Données disponibles
    has_invoices: bool = False
    has_costs: bool = False
    has_budget: bool = False
    has_payments: bool = False
    
    # Préférences utilisateur
    detail_level: str = "executive"          # "executive" | "detailed" | "deep"
    output_format: str = "narrative"         # "narrative" | "bullet_points" | "table"


@dataclass
class OrchestratedInsight:
    """Insight orchestré combinant plusieurs engines"""
    timestamp: datetime
    mode: AnalysisMode
    question: str
    
    # Résultats engines utilisés
    engines_used: List[str]
    raw_results: Dict[str, Any]
    
    # Synthèse intelligente
    executive_summary: str                   # 2-3 phrases pour CEO
    key_findings: List[str]                  # 3-5 findings principaux
    narrative: str                           # Histoire complète générée par LLM
    
    # Actions recommandées
    immediate_actions: List[Dict]            # À faire maintenant
    watchlist: List[Dict]                    # À surveiller
    
    # Méta
    confidence_score: float                  # 0-100
    data_quality: str                        # "excellent" | "good" | "limited"
    
    def to_dict(self) -> Dict:
        return {
            "timestamp": self.timestamp.isoformat(),
            "mode": self.mode.value,
            "question": self.question,
            "engines_used": self.engines_used,
            "executive_summary": self.executive_summary,
            "key_findings": self.key_findings,
            "narrative": self.narrative,
            "immediate_actions": self.immediate_actions,
            "watchlist": self.watchlist,
            "confidence_score": self.confidence_score,
            "data_quality": self.data_quality
        }


class TresorisOrchestrator:
    """
    Le cerveau de TRESORIS.
    
    Orchestration intelligente:
    - Décide quels engines appeler selon le contexte
    - Combine les résultats de manière cohérente
    - Génère des insights narratifs via LLM
    - Apprend des interactions passées
    
    Identité: Chargée depuis agent/identity.py
    """
    
    # IDENTITY chargée depuis identity.py
    IDENTITY = get_identity()
    PERSONALITY = get_personality()

    def __init__(self, agent):
        """
        Args:
            agent: Instance de RiskRequalificationAgent avec tous les engines
        """
        self.agent = agent
        self.llm = LLMLayer()
        self.identity = get_identity()
        self.personality = get_personality()
        
        # Historique des analyses pour apprentissage
        self.analysis_history: List[Dict] = []
        
        print("🧠 TRESORIS Orchestrator initialisé")
        print(f"   Identité: {self.personality['name']} - {self.personality['role']}")
        print("   13 engines disponibles")
        print("   LLM: Claude 3.5 Sonnet via OpenRouter")
    
    # ═══════════════════════════════════════════════════════════════════════════
    # ORCHESTRATION PRINCIPALE
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def analyze(
        self,
        question: str,
        context: OrchestratorContext,
        data: Dict[str, pd.DataFrame]
    ) -> OrchestratedInsight:
        """
        Point d'entrée principal : analyse orchestrée.
        
        Workflow:
        1. Comprendre la question
        2. Sélectionner les engines pertinents
        3. Exécuter les analyses
        4. Combiner les résultats
        5. Générer narrative LLM
        6. Recommandations actionnables
        
        Args:
            question: Question du DAF ("Pourquoi ma marge baisse?")
            context: Contexte d'analyse
            data: DataFrames disponibles
        """
        
        print(f"\n🧠 Analyse orchestrée: {question}")
        print(f"   Mode: {context.mode.value}")
        
        # 1. Sélectionner engines
        engines_to_use = self._select_engines(context)
        print(f"   Engines sélectionnés: {', '.join(engines_to_use)}")
        
        # 2. Exécuter analyses
        raw_results = await self._execute_engines(engines_to_use, data, context)
        
        # 3. Extraire key findings
        key_findings = self._extract_key_findings(raw_results, engines_to_use)
        
        # 4. Générer executive summary
        exec_summary = self._generate_executive_summary(key_findings, raw_results)
        
        # 5. Générer narrative complète via LLM
        narrative = await self._generate_narrative(
            question=question,
            findings=key_findings,
            raw_results=raw_results,
            context=context
        )
        
        # 6. Actions recommandées
        immediate, watchlist = self._extract_actions(raw_results, engines_to_use)
        
        # 7. Évaluer confiance et qualité
        confidence = self._calculate_confidence(raw_results, data)
        quality = self._assess_data_quality(data)
        
        # Créer insight
        insight = OrchestratedInsight(
            timestamp=datetime.now(),
            mode=context.mode,
            question=question,
            engines_used=engines_to_use,
            raw_results=raw_results,
            executive_summary=exec_summary,
            key_findings=key_findings,
            narrative=narrative,
            immediate_actions=immediate,
            watchlist=watchlist,
            confidence_score=confidence,
            data_quality=quality
        )
        
        # Stocker pour apprentissage
        self._store_analysis(insight)
        
        return insight
    
    # ═══════════════════════════════════════════════════════════════════════════
    # SÉLECTION INTELLIGENTE DES ENGINES
    # ═══════════════════════════════════════════════════════════════════════════
    
    def _select_engines(self, context: OrchestratorContext) -> List[str]:
        """Sélectionne intelligemment les engines selon le mode"""
        
        engines = []
        
        if context.mode == AnalysisMode.QUICK_CHECK:
            # Check routine rapide
            engines = ["payment_patterns", "early_warning", "smart_forecast"]
        
        elif context.mode == AnalysisMode.DEEP_DIVE:
            # Analyse complète
            engines = [
                "payment_patterns",
                "early_warning",
                "client_scoring",
                "smart_forecast",
                "margin_analyzer",      # V3
                "causal_analyzer"       # V3
            ]
        
        elif context.mode == AnalysisMode.MARGIN_ANALYSIS:
            # Focus marges
            engines = [
                "margin_analyzer",      # V3
                "causal_analyzer",      # V3
                "variance_analyzer"     # V3 (si budget disponible)
            ]
        
        elif context.mode == AnalysisMode.COST_ANALYSIS:
            # Focus coûts
            engines = [
                "cost_drift_analyzer",  # V3
                "variance_analyzer",    # V3
                "causal_analyzer"       # V3
            ]
        
        elif context.mode == AnalysisMode.STRESS_TEST:
            # Stress testing
            engines = [
                "stress_tester",        # V3
                "smart_forecast",
                "early_warning"
            ]
        
        elif context.mode == AnalysisMode.DECISION_SUPPORT:
            # Aide à la décision
            engines = [
                "decision_arbiter",     # V3
                "stress_tester",        # V3
                "smart_forecast"
            ]
        
        elif context.mode == AnalysisMode.VARIANCE_ANALYSIS:
            # Analyse écarts
            engines = [
                "variance_analyzer",    # V3
                "causal_analyzer",      # V3
                "cost_drift_analyzer"   # V3
            ]
        
        elif context.mode == AnalysisMode.SCENARIO_PLANNING:
            # Planification scénarios
            engines = [
                "smart_forecast",
                "stress_tester",        # V3
                "seasonality"
            ]
        
        # Filtrer selon données disponibles
        if not context.has_costs:
            engines = [e for e in engines if e not in ["cost_drift_analyzer", "margin_analyzer"]]
        
        if not context.has_budget:
            engines = [e for e in engines if e != "variance_analyzer"]
        
        return engines
    
    # ═══════════════════════════════════════════════════════════════════════════
    # EXÉCUTION DES ENGINES
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def _execute_engines(
        self,
        engines: List[str],
        data: Dict[str, pd.DataFrame],
        context: OrchestratorContext
    ) -> Dict[str, Any]:
        """Exécute les engines sélectionnés"""
        
        results = {}
        
        for engine_name in engines:
            try:
                if engine_name == "margin_analyzer" and "invoices" in data:
                    result = self.agent.margin_analyzer.analyze_client_margin(
                        invoices=data["invoices"],
                        costs=data.get("costs"),
                        payments=data.get("payments")
                    )
                    results["margin"] = result.to_dict() if hasattr(result, 'to_dict') else result
                
                elif engine_name == "cost_drift_analyzer" and "costs" in data:
                    result = self.agent.cost_drift_analyzer.analyze_drift(
                        cost_history=data["costs"]
                    )
                    results["cost_drift"] = result.to_dict() if hasattr(result, 'to_dict') else result
                
                elif engine_name == "causal_analyzer":
                    # Analyse causale nécessite effet + données
                    result = self.agent.causal_analyzer.analyze(
                        effect="Variation observée",
                        data=data
                    )
                    results["causal"] = result.to_dict() if hasattr(result, 'to_dict') else result
                
                elif engine_name == "variance_analyzer" and "budget" in data:
                    result = self.agent.variance_analyzer.analyze_variances(
                        actual_data=data["actual"],
                        budget_data=data["budget"]
                    )
                    results["variance"] = result.to_dict() if hasattr(result, 'to_dict') else result
                
                elif engine_name == "stress_tester":
                    # Stress test nécessite données tréso
                    result = self.agent.stress_tester.run_full_stress_test(
                        current_cash=data.get("current_cash", 100000),
                        monthly_revenues=data.get("monthly_revenues", 50000),
                        monthly_costs=data.get("monthly_costs", 40000)
                    )
                    results["stress"] = result.to_dict() if hasattr(result, 'to_dict') else result
                
                # Engines V2
                elif engine_name == "payment_patterns" and "invoices" in data:
                    # Patterns de paiement
                    results["patterns"] = "TODO: Implement payment patterns call"
                
                elif engine_name == "smart_forecast":
                    results["forecast"] = "TODO: Implement smart forecast call"
                
                elif engine_name == "early_warning":
                    results["warnings"] = "TODO: Implement early warning call"
                
                print(f"     ✅ {engine_name}")
                
            except Exception as e:
                print(f"     ❌ {engine_name}: {e}")
                results[engine_name] = {"error": str(e)}
        
        return results
    
    # ═══════════════════════════════════════════════════════════════════════════
    # EXTRACTION & SYNTHÈSE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def _extract_key_findings(
        self,
        raw_results: Dict[str, Any],
        engines_used: List[str]
    ) -> List[str]:
        """Extrait les findings clés de chaque engine"""
        
        findings = []
        
        # Margin analysis
        if "margin" in raw_results:
            m = raw_results["margin"]
            if isinstance(m, dict):
                findings.append(f"Marge nette globale: {m.get('net_margin_pct', 0):.1f}%")
                if m.get('anomalies'):
                    findings.append(f"{len(m['anomalies'])} anomalies de marge détectées")
        
        # Cost drift
        if "cost_drift" in raw_results:
            cd = raw_results["cost_drift"]
            if isinstance(cd, dict):
                findings.append(f"Inflation interne: {cd.get('internal_inflation', 0)*100:.1f}%")
                if cd.get('ghost_costs'):
                    findings.append(f"{len(cd['ghost_costs'])} coûts fantômes détectés")
        
        # Variance
        if "variance" in raw_results:
            v = raw_results["variance"]
            if isinstance(v, dict):
                findings.append(f"Écart budget: {v.get('result_variance_pct', 0)*100:.1f}%")
        
        # Stress test
        if "stress" in raw_results:
            s = raw_results["stress"]
            if isinstance(s, dict) and "monte_carlo" in s:
                mc = s["monte_carlo"]
                findings.append(f"Probabilité cash négatif: {mc.get('prob_negative_cash', 0)*100:.1f}%")
        
        # Causal
        if "causal" in raw_results:
            c = raw_results["causal"]
            if isinstance(c, dict) and "chains" in c:
                findings.append(f"{len(c['chains'])} chaînes causales identifiées")
        
        return findings[:5]  # Top 5
    
    def _generate_executive_summary(
        self,
        findings: List[str],
        raw_results: Dict
    ) -> str:
        """Génère executive summary (2-3 phrases)"""
        
        if not findings:
            return "Analyse en cours, données insuffisantes pour synthèse."
        
        # Synthèse basique (sera enrichie par LLM)
        summary = f"{len(findings)} insights clés détectés. "
        
        # Ajouter contexte risque
        if "stress" in raw_results:
            s = raw_results["stress"]
            if isinstance(s, dict):
                risk_level = s.get("overall_risk_level", "moderate")
                summary += f"Niveau de risque: {risk_level}. "
        
        summary += "Actions recommandées disponibles ci-dessous."
        
        return summary
    
    def _get_prompt_for_mode(self, mode: AnalysisMode) -> str:
        """Retourne le system prompt adapté au mode d'analyse"""
        
        mode_to_prompt = {
            AnalysisMode.QUICK_CHECK: "quick_check",
            AnalysisMode.DEEP_DIVE: "deep_dive",
            AnalysisMode.SCENARIO_PLANNING: "stress_test",
            AnalysisMode.DECISION_SUPPORT: "decision_support",
            AnalysisMode.VARIANCE_ANALYSIS: "causal_explanation",
            AnalysisMode.STRESS_TEST: "stress_test",
            AnalysisMode.MARGIN_ANALYSIS: "deep_dive",
            AnalysisMode.COST_ANALYSIS: "causal_explanation",
        }
        
        prompt_key = mode_to_prompt.get(mode, "orchestrator")
        return get_system_prompt(prompt_key)
    
    async def _generate_narrative(
        self,
        question: str,
        findings: List[str],
        raw_results: Dict,
        context: OrchestratorContext
    ) -> str:
        """Génère narrative complète via LLM avec identité TRESORIS"""
        
        # Récupérer le system prompt adapté au mode
        base_prompt = self._get_prompt_for_mode(context.mode)
        
        # Enrichir avec contexte spécifique
        system_prompt = f"""{base_prompt}

---
CONTEXTE DE L'ANALYSE:
- Mode: {context.mode.value}
- Engines utilisés: {len(raw_results)}
- Horizon: {context.time_horizon}
- Niveau de détail: {context.detail_level}

Question du DAF: "{question}"
"""

        # Préparer les résultats pour le LLM
        results_summary = self._format_results_for_llm(raw_results, findings)
        
        user_prompt = f"""J'ai besoin de ton analyse complète.

## FINDINGS CLÉS:
{chr(10).join([f"• {f}" for f in findings])}

## RÉSULTATS DÉTAILLÉS DES ENGINES:
{results_summary}

---

Rédige une réponse complète qui:
1. Répond directement à la question "{question}"
2. Synthétise les findings de manière narrative
3. Explique les CAUSES (pas juste les symptômes)
4. Propose 2-3 actions concrètes et priorisées
5. Termine par une phrase de suivi

N'oublie pas: tu es TRESORIS, le DAF augmenté. Sois précis, factuel, orienté action."""

        try:
            response = await self.llm._call_llm([
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ], max_tokens=1500)
            
            return response.content if response.success else self._fallback_narrative(findings)
        
        except Exception as e:
            print(f"⚠️ LLM error: {e}")
            return self._fallback_narrative(findings)
    
    def _format_results_for_llm(self, raw_results: Dict, findings: List[str]) -> str:
        """Formate les résultats pour le LLM"""
        
        formatted = []
        
        for engine, result in raw_results.items():
            if isinstance(result, dict) and "error" not in result:
                formatted.append(f"\n{engine.upper()}:")
                # Extraire 3-5 points clés
                formatted.append(json.dumps(result, indent=2, ensure_ascii=False)[:500])
        
        return "\n".join(formatted)
    
    def _fallback_narrative(self, findings: List[str]) -> str:
        """Narrative de fallback si LLM indisponible"""
        
        narrative = "# Analyse Tresoris\n\n"
        narrative += "## Synthèse\n\n"
        narrative += "\n".join([f"- {f}" for f in findings])
        narrative += "\n\n## Recommandations\n\n"
        narrative += "Actions détaillées disponibles ci-dessous."
        
        return narrative
    
    def _extract_actions(
        self,
        raw_results: Dict,
        engines_used: List[str]
    ) -> Tuple[List[Dict], List[Dict]]:
        """Extrait actions immédiates et watchlist"""
        
        immediate = []
        watchlist = []
        
        # Extraction basique (à enrichir)
        if "variance" in raw_results:
            v = raw_results["variance"]
            if isinstance(v, dict) and "corrective_actions" in v:
                immediate.extend(v["corrective_actions"][:3])
        
        if "stress" in raw_results:
            s = raw_results["stress"]
            if isinstance(s, dict) and "hedging_actions" in s:
                immediate.extend(s["hedging_actions"][:2])
        
        return immediate, watchlist
    
    # ═══════════════════════════════════════════════════════════════════════════
    # QUALITÉ & CONFIANCE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def _calculate_confidence(self, raw_results: Dict, data: Dict) -> float:
        """Calcule score de confiance 0-100"""
        
        score = 50  # Base
        
        # +10 par engine réussi
        successful = sum(1 for r in raw_results.values() if "error" not in str(r))
        score += successful * 10
        
        # +20 si données riches
        if len(data) >= 3:
            score += 20
        
        return min(100, score)
    
    def _assess_data_quality(self, data: Dict) -> str:
        """Évalue qualité des données"""
        
        if len(data) >= 4:
            return "excellent"
        elif len(data) >= 2:
            return "good"
        else:
            return "limited"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # APPRENTISSAGE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def _store_analysis(self, insight: OrchestratedInsight):
        """Stocke l'analyse pour apprentissage futur"""
        
        self.analysis_history.append({
            "timestamp": insight.timestamp.isoformat(),
            "mode": insight.mode.value,
            "question": insight.question,
            "engines_used": insight.engines_used,
            "confidence": insight.confidence_score
        })
        
        # Garder seulement les 100 dernières
        if len(self.analysis_history) > 100:
            self.analysis_history = self.analysis_history[-100:]


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS
# ═══════════════════════════════════════════════════════════════════════════════

async def _test_orchestrator():
    """Test de l'orchestrateur"""
    
    print("\n" + "="*70)
    print("TRESORIS ORCHESTRATOR - TEST")
    print("="*70)
    
    # Mock agent avec engines
    class MockAgent:
        def __init__(self):
            from engine.margin_analyzer import MarginAnalyzer
            from engine.cost_drift_analyzer import CostDriftAnalyzer
            from engine.causal_analyzer import CausalAnalyzer
            from engine.variance_analyzer import VarianceAnalyzer
            from engine.stress_tester import StressTester
            from engine.decision_arbiter import DecisionArbiter
            
            self.margin_analyzer = MarginAnalyzer()
            self.cost_drift_analyzer = CostDriftAnalyzer()
            self.causal_analyzer = CausalAnalyzer()
            self.variance_analyzer = VarianceAnalyzer()
            self.stress_tester = StressTester()
            self.decision_arbiter = DecisionArbiter()
    
    agent = MockAgent()
    orchestrator = TresorisOrchestrator(agent)
    
    # Test context
    context = OrchestratorContext(
        mode=AnalysisMode.STRESS_TEST,
        question="Quel est le risque de cash négatif dans les 6 prochains mois?",
        focus_area="trésorerie",
        has_invoices=True,
        has_costs=True
    )
    
    # Mock data
    data = {
        "current_cash": 150000,
        "monthly_revenues": 80000,
        "monthly_costs": 65000
    }
    
    # Exécuter
    result = await orchestrator.analyze(
        question=context.question,
        context=context,
        data=data
    )
    
    print(f"\n📊 RÉSULTAT:")
    print(f"   Engines utilisés: {', '.join(result.engines_used)}")
    print(f"   Confiance: {result.confidence_score:.0f}%")
    print(f"   Qualité données: {result.data_quality}")
    
    print(f"\n💡 EXECUTIVE SUMMARY:")
    print(f"   {result.executive_summary}")
    
    print(f"\n📋 KEY FINDINGS:")
    for f in result.key_findings:
        print(f"   • {f}")
    
    print(f"\n📝 NARRATIVE (extrait):")
    print(result.narrative[:300] + "...")
    
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# MÉTHODES QUICK ACCESS (Raccourcis pour le chat/API)
# ═══════════════════════════════════════════════════════════════════════════════

class TresorisQuickMethods:
    """
    Méthodes rapides pour accès depuis l'API ou le chat.
    Encapsule les appels fréquents avec des contextes pré-configurés.
    """
    
    def __init__(self, orchestrator: TresorisOrchestrator):
        self.orchestrator = orchestrator
    
    async def morning_check(self, data: Dict) -> OrchestratedInsight:
        """
        Check rapide du matin - 30 secondes de lecture.
        
        Usage: Routine quotidienne du DAF au café.
        """
        context = OrchestratorContext(
            mode=AnalysisMode.QUICK_CHECK,
            question="Quelle est ma situation cash ce matin ?",
            detail_level="executive",
            output_format="bullet_points",
            has_invoices=True,
            has_payments=True
        )
        
        return await self.orchestrator.analyze(
            question=context.question,
            context=context,
            data=data
        )
    
    async def explain_variance(self, metric: str, data: Dict) -> OrchestratedInsight:
        """
        Explique pourquoi une métrique a changé.
        
        Usage: "Pourquoi ma marge a baissé de 3 points ?"
        """
        context = OrchestratorContext(
            mode=AnalysisMode.VARIANCE_ANALYSIS,
            question=f"Pourquoi {metric} a changé ?",
            focus_area=metric,
            detail_level="detailed",
            has_invoices=True,
            has_costs=True,
            has_budget=True
        )
        
        return await self.orchestrator.analyze(
            question=context.question,
            context=context,
            data=data
        )
    
    async def stress_test_scenario(self, scenario: str, data: Dict) -> OrchestratedInsight:
        """
        Test de stress sur un scénario spécifique.
        
        Usage: "Que se passe-t-il si je perds 2 gros clients ?"
        """
        context = OrchestratorContext(
            mode=AnalysisMode.STRESS_TEST,
            question=f"Simulation: {scenario}",
            focus_area="trésorerie",
            time_horizon="6_months",
            detail_level="detailed"
        )
        
        return await self.orchestrator.analyze(
            question=context.question,
            context=context,
            data=data
        )
    
    async def decision_compare(self, option_a: str, option_b: str, data: Dict) -> OrchestratedInsight:
        """
        Compare deux options de décision.
        
        Usage: "Recruter un CDI vs freelance pour ce poste ?"
        """
        context = OrchestratorContext(
            mode=AnalysisMode.DECISION_SUPPORT,
            question=f"Comparer: {option_a} vs {option_b}",
            detail_level="detailed",
            output_format="table"
        )
        
        return await self.orchestrator.analyze(
            question=context.question,
            context=context,
            data=data
        )
    
    async def generate_dg_note(self, data: Dict) -> str:
        """
        Génère une note pour la Direction Générale.
        
        Usage: Préparer un point trésorerie pour le COMEX.
        """
        context = OrchestratorContext(
            mode=AnalysisMode.DEEP_DIVE,
            question="Générer une note trésorerie pour la DG",
            detail_level="executive",
            output_format="narrative"
        )
        
        insight = await self.orchestrator.analyze(
            question=context.question,
            context=context,
            data=data
        )
        
        # Formater en note DG
        from datetime import datetime
        note = f"""# Point Trésorerie - {datetime.now().strftime('%B %Y')}

{insight.executive_summary}

## Synthèse
{insight.narrative}

## Actions en cours
"""
        for action in insight.immediate_actions[:3]:
            if isinstance(action, dict):
                note += f"- {action.get('action', action.get('description', str(action)))}\n"
            else:
                note += f"- {action}\n"
        
        note += "\n---\n*Note générée par TRESORIS*"
        
        return note


if __name__ == "__main__":
    import asyncio
    asyncio.run(_test_orchestrator())

"""
LLM Layer - Intégration Claude via OpenRouter
Le LLM génère UNIQUEMENT du texte explicatif, jamais de chiffres.
"""

import os
import httpx
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()


@dataclass
class LLMResponse:
    """Réponse du LLM"""
    content: str
    model: str
    tokens_used: int
    success: bool
    error: Optional[str] = None


class LLMLayer:
    """
    Couche d'abstraction pour l'appel au LLM via OpenRouter.
    Génère les explications, notes DG et recommandations.
    AUCUN calcul n'est fait par le LLM.
    """
    
    OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
    
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.model = os.getenv("LLM_MODEL", "anthropic/claude-3.5-sonnet")
        
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY non définie dans .env")
    
    async def _call_llm(self, messages: List[Dict], max_tokens: int = 2000) -> LLMResponse:
        """Appel générique au LLM via OpenRouter"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://agent-daf.app",
            "X-Title": "Agent DAF"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": 0.7
        }
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    self.OPENROUTER_URL,
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                tokens = data.get("usage", {}).get("total_tokens", 0)
                
                return LLMResponse(
                    content=content,
                    model=self.model,
                    tokens_used=tokens,
                    success=True
                )
                
        except Exception as e:
            return LLMResponse(
                content="",
                model=self.model,
                tokens_used=0,
                success=False,
                error=str(e)
            )
    
    async def explain_risk(self, risk: Dict, context: Dict) -> str:
        """Génère une explication détaillée d'un risque"""
        system_prompt = """Tu es l'assistant IA d'un DAF (Directeur Administratif et Financier).
Tu dois expliquer les risques financiers de manière claire, professionnelle et actionnable.
Tu NE FAIS JAMAIS de calculs - les chiffres te sont fournis.
Tu dois être concis (3-4 phrases max) et aller droit au but.
Réponds en français."""

        user_prompt = f"""Explique ce risque financier de manière professionnelle:

RISQUE: {risk.get('title', '')}
CATÉGORIE: {risk.get('category', '')}
SÉVÉRITÉ: {risk.get('severity', '')}
MONTANT À RISQUE: {risk.get('amount_at_risk', 0):,.0f}€
DÉTAILS: {risk.get('description', '')}
JOURS DE RETARD: {risk.get('days_overdue', 'N/A')}

CONTEXTE TRÉSORERIE:
- Solde actuel: {context.get('current_balance', 0):,.0f}€
- Seuil critique: {context.get('critical_threshold', 0):,.0f}€

Explique pourquoi ce risque est {risk.get('severity', 'important')} et ce que ça implique pour l'entreprise."""

        response = await self._call_llm([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ], max_tokens=500)
        
        return response.content if response.success else f"Analyse indisponible: {response.error}"
    
    async def generate_dg_note(self, treasury: Dict, risks: List[Dict], actions: List[Dict], company: Dict) -> str:
        """Génère une note professionnelle pour la Direction Générale"""
        system_prompt = """Tu es l'assistant IA d'un DAF.
Tu rédiges une note de synthèse pour la Direction Générale.
Le ton doit être professionnel, factuel et orienté décision.
Tu utilises UNIQUEMENT les chiffres fournis, tu ne calcules rien.
Structure: Situation actuelle → Points de vigilance → Recommandations
Longueur: 300-400 mots maximum.
Format: Markdown avec sections et bullet points.
Réponds en français."""

        # Préparer les données risques
        critical_risks = [r for r in risks if r.get('severity') == 'critical']
        high_risks = [r for r in risks if r.get('severity') == 'high']
        total_at_risk = sum(r.get('amount_at_risk', 0) for r in risks)
        
        # Préparer les actions prioritaires
        priority_actions = [a for a in actions if a.get('priority', 99) <= 2]

        user_prompt = f"""Rédige une note DAF pour la Direction Générale avec ces données:

ENTREPRISE: {company.get('name', 'N/A')}
DATE: Aujourd'hui

SITUATION TRÉSORERIE:
- Solde actuel: {treasury.get('current_balance', 0):,.0f}€
- Statut: {treasury.get('status', 'N/A')}
- Runway: {treasury.get('cash_runway_days', 0)} jours
- Encours clients: {treasury.get('pending_client_payments', 0):,.0f}€
- Encours fournisseurs: {treasury.get('pending_supplier_payments', 0):,.0f}€

RISQUES IDENTIFIÉS:
- Risques critiques: {len(critical_risks)}
- Risques élevés: {len(high_risks)}
- Montant total à risque: {total_at_risk:,.0f}€

TOP 3 RISQUES CRITIQUES:
{chr(10).join([f"- {r.get('title', '')}: {r.get('amount_at_risk', 0):,.0f}€" for r in critical_risks[:3]])}

ACTIONS PRIORITAIRES RECOMMANDÉES:
{chr(10).join([f"- {a.get('action', '')}" for a in priority_actions[:3]])}

Rédige la note complète en Markdown."""

        response = await self._call_llm([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ], max_tokens=1500)
        
        return response.content if response.success else f"# Note indisponible\n\nErreur: {response.error}"
    
    async def justify_action_priority(self, actions: List[Dict], risks: List[Dict]) -> str:
        """Justifie l'ordre de priorité des actions recommandées"""
        system_prompt = """Tu es l'assistant IA d'un DAF.
Tu dois justifier la priorisation des actions recommandées.
Sois concis et factuel. 2-3 phrases par action principale.
Réponds en français."""

        actions_text = "\n".join([
            f"- P{a.get('priority', 0)}: {a.get('action', '')} (impact: {a.get('expected_impact', 0):,.0f}€)"
            for a in actions[:5]
        ])

        user_prompt = f"""Justifie la priorisation de ces actions:

ACTIONS (par priorité):
{actions_text}

CONTEXTE RISQUES:
- {len([r for r in risks if r.get('severity') == 'critical'])} risques critiques
- {len([r for r in risks if r.get('severity') == 'high'])} risques élevés

Explique brièvement pourquoi cet ordre de priorité est optimal."""

        response = await self._call_llm([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ], max_tokens=800)
        
        return response.content if response.success else f"Justification indisponible: {response.error}"
    
    async def deep_dive_risk(self, risk: Dict, related_data: Dict) -> str:
        """Analyse approfondie d'un risque spécifique (pour interaction DAF)"""
        system_prompt = """Tu es l'assistant IA d'un DAF.
Le DAF te demande d'approfondir un risque spécifique.
Fournis une analyse détaillée avec:
1. Contexte et historique du risque
2. Impact potentiel sur la trésorerie
3. Scénarios possibles (optimiste, pessimiste, réaliste)
4. Recommandations spécifiques
Utilise UNIQUEMENT les données fournies.
Réponds en français, format Markdown."""

        user_prompt = f"""Analyse approfondie de ce risque:

RISQUE: {risk.get('title', '')}
CATÉGORIE: {risk.get('category', '')}
SÉVÉRITÉ: {risk.get('severity', '')}
SCORE: {risk.get('score', 0)}/100
MONTANT: {risk.get('amount_at_risk', 0):,.0f}€
ENTITÉ: {risk.get('entity_name', 'N/A')}
RETARD: {risk.get('days_overdue', 'N/A')} jours
DESCRIPTION: {risk.get('description', '')}

DONNÉES CONTEXTUELLES:
- Historique paiements entité: {related_data.get('payment_history', 'Non disponible')}
- Encours total entité: {related_data.get('total_outstanding', 0):,.0f}€
- Trésorerie actuelle: {related_data.get('current_treasury', 0):,.0f}€

Fournis une analyse complète."""

        response = await self._call_llm([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ], max_tokens=1200)
        
        return response.content if response.success else f"# Analyse indisponible\n\nErreur: {response.error}"
    
    async def compare_scenarios(self, base_forecast: Dict, scenarios: List[Dict]) -> str:
        """Compare différents scénarios de trésorerie"""
        system_prompt = """Tu es l'assistant IA d'un DAF.
Tu compares des scénarios de trésorerie pour aider à la décision.
Présente les résultats de manière claire et comparative.
Recommande le scénario le plus prudent ou optimal selon le contexte.
Réponds en français, format Markdown avec tableau comparatif."""

        scenarios_text = "\n".join([
            f"- {s.get('name', 'Scénario')}: Solde final {s.get('end_balance', 0):,.0f}€, Min {s.get('min_balance', 0):,.0f}€"
            for s in scenarios
        ])

        user_prompt = f"""Compare ces scénarios de trésorerie:

SCÉNARIO DE BASE:
- Horizon: {base_forecast.get('horizon_weeks', 0)} semaines
- Solde initial: {base_forecast.get('start_balance', 0):,.0f}€
- Solde final prévu: {base_forecast.get('end_balance', 0):,.0f}€
- Minimum atteint: {base_forecast.get('min_balance', 0):,.0f}€

SCÉNARIOS ALTERNATIFS:
{scenarios_text}

Compare et recommande le meilleur plan d'action."""

        response = await self._call_llm([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ], max_tokens=1000)
        
        return response.content if response.success else f"# Comparaison indisponible\n\nErreur: {response.error}"

"""
Agent Actions - Préparation d'actions concrètes exécutables
Transforme le plan d'actions en actions préparées avec contenus réels
"""

from dataclasses import dataclass, asdict
from typing import Optional, Dict, List
from datetime import datetime
from jinja2 import Template


@dataclass
class PreparedAction:
    """Action concrète prête à être exécutée (après validation DAF)"""
    id: str
    type: str  # "email_relance", "payment_hold", "alert_dg", "forecast_adjust"
    priority: int  # 1-4
    target: str  # Email destinataire, compte bancaire, etc.
    subject: Optional[str] = None
    content: str = ""  # Email draft, ordre détaillé, etc.
    justification: str = ""  # Pourquoi cette action maintenant
    risk_linked: Optional[str] = None  # ID du risque lié
    estimated_impact: float = 0.0  # Montant concerné
    deadline: Optional[str] = None
    requires_validation: bool = True
    status: str = "prepared"  # prepared, validated, rejected, executed


class ActionPreparator:
    """
    Prépare des actions concrètes depuis le plan d'actions générique
    """
    
    def __init__(self, llm_layer=None):
        self.llm = llm_layer
        self.templates = self._load_templates()
    
    def _load_templates(self) -> Dict[str, Template]:
        """Charge les templates Jinja2 pour emails"""
        
        relance_template = """Objet: Relance facture {{ invoice_id }} - {{ amount }}€

Madame, Monsieur,

Nous constatons que la facture {{ invoice_id }} d'un montant de {{ amount }}€, 
émise le {{ invoice_date }} avec échéance au {{ due_date }}, reste impayée 
depuis {{ days_overdue }} jours.

Nous vous remercions de bien vouloir régulariser cette situation dans les 48 heures.

Pour tout complément d'information, vous pouvez nous contacter.

Cordialement,
{{ company_name }}
Direction Administrative et Financière
"""
        
        alert_dg_template = """Objet: [ALERTE TRÉSORERIE] {{ alert_type }}

Direction Générale,

L'Agent DAF a détecté une situation nécessitant votre attention :

{{ situation_description }}

Impact estimé : {{ impact }}€
Échéance : {{ deadline }}

Actions recommandées :
{{ recommended_actions }}

Ce rapport a été généré automatiquement le {{ timestamp }}.

Agent DAF - Sous gouvernance humaine
"""
        
        return {
            "relance_client": Template(relance_template),
            "alert_dg": Template(alert_dg_template)
        }
    
    async def prepare_action(self, action_item: Dict, context: Dict) -> PreparedAction:
        """
        Transforme une action DAF générique en action concrète.
        Adapté aux nouvelles catégories: pilotage, forecast, gouvernance, risque, comptable
        """
        action_category = action_item.get("category", "comptable")
        
        # Nouvelles catégories DAF
        if action_category == "pilotage":
            return await self._prepare_pilotage_action(action_item, context)
        
        elif action_category == "forecast":
            return await self._prepare_forecast_action(action_item, context)
        
        elif action_category == "gouvernance":
            return await self._prepare_gouvernance_action(action_item, context)
        
        elif action_category == "risque":
            return await self._prepare_risque_action(action_item, context)
        
        elif action_category == "comptable":
            return await self._prepare_comptable_action(action_item, context)
        
        else:
            # Fallback pour anciennes catégories (rétrocompatibilité)
            return self._prepare_generic_action(action_item, context)
    
    async def _prepare_pilotage_action(self, action_item: Dict, context: Dict) -> PreparedAction:
        """
        Prépare une décision de PILOTAGE (requalification, ajustement)
        Exemple: "Requalifier encaissement BioPharm: CERTAIN → INCERTAIN"
        """
        action_text = action_item.get("action", "")
        
        # Brief décision stratégique pour équipe finance
        decision_brief = f"""
═══════════════════════════════════════════════════════
DÉCISION DE PILOTAGE TRÉSORERIE
═══════════════════════════════════════════════════════

{action_text}

CONTEXTE:
{action_item.get("justification", "Détection automatique par agent de surveillance")}

IMPACT ESTIMÉ: {action_item.get("impact_amount", 0):,.0f} €
ÉCHÉANCE: {action_item.get("deadline", "Immédiat")}

ACTIONS OPÉRATIONNELLES ATTENDUES:
1. Mise à jour forecast trésorerie (TMS/ERP)
2. Révision scenarii de projection
3. Notification équipe contrôle de gestion

⚠️ Cette décision nécessite validation DAF avant mise en œuvre.

Agent DAF - Surveillance autonome
Généré le {datetime.now().strftime("%d/%m/%Y à %H:%M")}
═══════════════════════════════════════════════════════
"""
        
        return PreparedAction(
            id=f"action_pilotage_{action_item.get('id', 'unknown')}",
            type="pilotage_decision",
            priority=1,  # Pilotage = toujours prioritaire
            target="Équipe Finance + DAF",
            subject=f"Décision Pilotage: {action_text[:60]}...",
            content=decision_brief,
            justification=action_item.get("justification", ""),
            estimated_impact=action_item.get("impact_amount", 0),
            deadline=action_item.get("deadline"),
            requires_validation=True,
            status="prepared"
        )
    
    async def _prepare_forecast_action(self, action_item: Dict, context: Dict) -> PreparedAction:
        """
        Prépare un ajustement de FORECAST
        Exemple: "Ajuster forecast trésorerie: -850K€ sur 8 semaines"
        """
        action_text = action_item.get("action", "")
        
        forecast_brief = f"""
═══════════════════════════════════════════════════════
AJUSTEMENT FORECAST TRÉSORERIE
═══════════════════════════════════════════════════════

{action_text}

RÉVISION ATTENDUE:
{action_item.get("justification", "Révision basée sur détection de dégradation")}

IMPACT CHIFFRÉ: {action_item.get("impact_amount", 0):,.0f} €
HORIZON: {action_item.get("deadline", "8 semaines")}

LIVRABLES REQUIS:
• Forecast glissant 13 semaines révisé
• Note de synthèse pour Comité de Direction
• Mise à jour dashboard trésorerie

Agent DAF - Prévision autonome
Généré le {datetime.now().strftime("%d/%m/%Y à %H:%M")}
═══════════════════════════════════════════════════════
"""
        
        return PreparedAction(
            id=f"action_forecast_{action_item.get('id', 'unknown')}",
            type="forecast_adjustment",
            priority=1,
            target="Contrôle de gestion + DAF",
            subject=f"Ajustement Forecast: {action_text[:60]}...",
            content=forecast_brief,
            justification=action_item.get("justification", ""),
            estimated_impact=action_item.get("impact_amount", 0),
            deadline=action_item.get("deadline"),
            requires_validation=True,
            status="prepared"
        )
    
    async def _prepare_gouvernance_action(self, action_item: Dict, context: Dict) -> PreparedAction:
        """
        Prépare une décision de GOUVERNANCE (changement mode, validation process)
        Exemple: "Passage en mode VIGILANCE CASH"
        """
        action_text = action_item.get("action", "")
        
        governance_brief = f"""
═══════════════════════════════════════════════════════
DÉCISION DE GOUVERNANCE TRÉSORERIE
═══════════════════════════════════════════════════════

{action_text}

JUSTIFICATION:
{action_item.get("justification", "Franchissement de seuil critique détecté")}

IMPACTS ORGANISATIONNELS:
• Processus de validation renforcé
• Reporting accéléré vers Direction Générale
• Restrictions temporaires sur décaissements

DURÉE: {action_item.get("deadline", "Jusqu'à amélioration indicateurs")}

⚠️ Cette décision modifie les règles de gouvernance.
Validation DAF + DG recommandée.

Agent DAF - Gestion des risques
Généré le {datetime.now().strftime("%d/%m/%Y à %H:%M")}
═══════════════════════════════════════════════════════
"""
        
        return PreparedAction(
            id=f"action_gouvernance_{action_item.get('id', 'unknown')}",
            type="governance_change",
            priority=1,
            target="DAF + Direction Générale",
            subject=f"Gouvernance: {action_text[:60]}...",
            content=governance_brief,
            justification=action_item.get("justification", ""),
            estimated_impact=action_item.get("impact_amount", 0),
            deadline=action_item.get("deadline"),
            requires_validation=True,
            status="prepared"
        )
    
    async def _prepare_risque_action(self, action_item: Dict, context: Dict) -> PreparedAction:
        """
        Prépare une recommandation RISQUE (blocage, alerte)
        Exemple: "Recommandation: Bloquer nouvelles commandes BioPharm"
        """
        action_text = action_item.get("action", "")
        
        risk_brief = f"""
═══════════════════════════════════════════════════════
RECOMMANDATION GESTION DES RISQUES
═══════════════════════════════════════════════════════

{action_text}

ANALYSE:
{action_item.get("justification", "Détection de risque client significatif")}

EXPOSITION: {action_item.get("impact_amount", 0):,.0f} €
DÉLAI RECOMMANDÉ: {action_item.get("deadline", "Immédiat")}

OPTIONS D'ACTION:
A. Blocage immédiat (sécurité maximale)
B. Validation au cas par cas (compromis)
C. Maintien avec garantie bancaire (alternative)

Cette recommandation est basée sur analyse quantitative.
Décision finale: DAF + Direction Commerciale

Agent DAF - Alerte risque client
Généré le {datetime.now().strftime("%d/%m/%Y à %H:%M")}
═══════════════════════════════════════════════════════
"""
        
        return PreparedAction(
            id=f"action_risque_{action_item.get('id', 'unknown')}",
            type="risk_mitigation",
            priority=2,
            target="DAF + Direction Commerciale",
            subject=f"Risque Client: {action_text[:60]}...",
            content=risk_brief,
            justification=action_item.get("justification", ""),
            estimated_impact=action_item.get("impact_amount", 0),
            deadline=action_item.get("deadline"),
            requires_validation=True,
            status="prepared"
        )
    
    async def _prepare_comptable_action(self, action_item: Dict, context: Dict) -> PreparedAction:
        """
        Prépare une action COMPTABLE (provision, écriture)
        Exemple: "Provisionner 425K€ sur créances douteuses"
        """
        action_text = action_item.get("action", "")
        
        accounting_brief = f"""
═══════════════════════════════════════════════════════
ACTION COMPTABLE REQUISE
═══════════════════════════════════════════════════════

{action_text}

FONDEMENT:
{action_item.get("justification", "Principe de prudence - norme comptable")}

MONTANT: {action_item.get("impact_amount", 0):,.0f} €
COMPTE: 68174 (Dotation provisions créances douteuses)
ÉCHÉANCE CLÔTURE: {action_item.get("deadline", "Avant arrêté mensuel")}

PIÈCES JUSTIFICATIVES:
• Analyse d'ancienneté créances
• Rapport agent DAF (présent document)
• Validation DAF

Agent DAF - Conformité comptable
Généré le {datetime.now().strftime("%d/%m/%Y à %H:%M")}
═══════════════════════════════════════════════════════
"""
        
        return PreparedAction(
            id=f"action_comptable_{action_item.get('id', 'unknown')}",
            type="accounting_entry",
            priority=3,
            target="Service comptabilité + DAF",
            subject=f"Comptable: {action_text[:60]}...",
            content=accounting_brief,
            justification=action_item.get("justification", ""),
            estimated_impact=action_item.get("impact_amount", 0),
            deadline=action_item.get("deadline"),
            requires_validation=True,
            status="prepared"
        )
    
    async def _prepare_relance_email(self, action_item: Dict, context: Dict) -> PreparedAction:
        """Prépare un email de relance client"""
        
        # Extraire infos du risque lié
        risk_id = action_item.get("linked_risks", [None])[0]
        risk_data = context.get("risks", {}).get(risk_id, {})
        
        # Données pour le template
        template_data = {
            "invoice_id": risk_data.get("invoice_id", "N/A"),
            "amount": int(action_item.get("impact_amount", 0)),
            "invoice_date": risk_data.get("invoice_date", "N/A"),
            "due_date": risk_data.get("due_date", "N/A"),
            "days_overdue": risk_data.get("days_overdue", 0),
            "company_name": context.get("company_name", "Demo PME-ETI")
        }
        
        # Générer le contenu depuis template
        email_content = self.templates["relance_client"].render(**template_data)
        
        # Personnaliser avec LLM si disponible
        if self.llm:
            try:
                personalized = await self.llm.personalize_relance_email(
                    email_content,
                    risk_data
                )
                email_content = personalized
            except:
                pass  # Garder template si LLM fail
        
        return PreparedAction(
            id=f"action_{action_item.get('id', 'unknown')}",
            type="email_relance",
            priority=action_item.get("priority", 2),
            target=risk_data.get("customer_email", "client@example.com"),
            subject=f"Relance facture {template_data['invoice_id']}",
            content=email_content,
            justification=action_item.get("description", ""),
            risk_linked=risk_id,
            estimated_impact=template_data["amount"],
            deadline=action_item.get("deadline", None),
            requires_validation=True
        )
    
    async def _prepare_payment_action(self, action_item: Dict, context: Dict) -> PreparedAction:
        """Prépare une action de paiement fournisseur"""
        
        risk_id = action_item.get("linked_risks", [None])[0]
        risk_data = context.get("risks", {}).get(risk_id, {})
        
        payment_details = f"""
Action : Régulariser paiement fournisseur

Fournisseur : {risk_data.get('supplier_name', 'N/A')}
Facture : {risk_data.get('invoice_id', 'N/A')}
Montant : {int(action_item.get('impact_amount', 0))}€
Retard : {risk_data.get('days_overdue', 0)} jours

Justification :
{action_item.get('description', '')}

⚠️ Cette action nécessite validation DAF avant exécution.
"""
        
        return PreparedAction(
            id=f"action_{action_item.get('id', 'unknown')}",
            type="payment_hold",
            priority=action_item.get("priority", 3),
            target=risk_data.get("supplier_id", "N/A"),
            content=payment_details,
            justification=action_item.get("description", ""),
            risk_linked=risk_id,
            estimated_impact=action_item.get("impact_amount", 0),
            requires_validation=True
        )
    
    async def _prepare_strategic_action(self, action_item: Dict, context: Dict) -> PreparedAction:
        """Prépare une action stratégique (ex: diversification)"""
        
        strategic_plan = f"""
Action stratégique : {action_item.get('description', '')}

Objectif : Réduire le risque de concentration client

Échéance : {action_item.get('deadline', 'Q2 2026')}
Effort estimé : {action_item.get('effort', 'Élevé')}

Cette action nécessite planification avec la Direction Générale.
"""
        
        return PreparedAction(
            id=f"action_{action_item.get('id', 'unknown')}",
            type="strategic_plan",
            priority=action_item.get("priority", 4),
            target="Direction Générale",
            content=strategic_plan,
            justification=action_item.get("description", ""),
            estimated_impact=0,
            deadline=action_item.get("deadline"),
            requires_validation=True
        )
    
    def _prepare_generic_action(self, action_item: Dict, context: Dict) -> PreparedAction:
        """Action générique fallback"""
        return PreparedAction(
            id=f"action_{action_item.get('id', 'unknown')}",
            type="generic",
            priority=action_item.get("priority", 3),
            target="DAF",
            content=action_item.get("description", ""),
            justification=action_item.get("description", ""),
            estimated_impact=action_item.get("impact_amount", 0),
            requires_validation=True
        )
    
    async def prepare_all_actions(self, actions: List[Dict], context: Dict) -> List[PreparedAction]:
        """Prépare toutes les actions d'un plan"""
        prepared = []
        
        for action in actions:
            try:
                prepared_action = await self.prepare_action(action, context)
                prepared.append(prepared_action)
            except Exception as e:
                print(f"Erreur préparation action {action.get('id')}: {e}")
        
        return prepared
    
    def serialize_prepared_actions(self, actions: List[PreparedAction]) -> List[Dict]:
        """Sérialise les actions pour JSON"""
        return [asdict(action) for action in actions]

"""
TRESORIS - Gmail Alert Notifications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Endpoints pour envoyer alertes DAF via Gmail API.
Templates d'alertes pour différents types de risques trésorerie.

Endpoints:
- POST /alerts/send              → Envoie alerte email via Gmail
- POST /alerts/send-batch        → Envoie alertes batch
- GET  /alerts/history           → Historique des alertes envoyées
- POST /alerts/templates/list    → Liste templates disponibles
- POST /alerts/templates/create  → Crée template d'alerte personnalisé
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum
import os
import json
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from services.google_auth_service import get_google_auth
from googleapiclient.errors import HttpError

load_dotenv()

router = APIRouter(prefix="/api/v1", tags=["Alert Notifications"])


# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class AlertLevel(str, Enum):
    """Niveau d'alerte"""
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class AlertType(str, Enum):
    """Types d'alertes"""
    CASH_LOW = "cash_low"
    CLIENT_RISK = "client_risk"
    PAYMENT_OVERDUE = "payment_overdue"
    DSO_HIGH = "dso_high"
    MARGIN_DROP = "margin_drop"
    COST_DRIFT = "cost_drift"
    VARIANCE_ALERT = "variance_alert"
    STRESS_TEST_FAIL = "stress_test_fail"
    CUSTOM = "custom"


class AlertTemplate(BaseModel):
    """Template d'alerte email"""
    template_id: str
    name: str
    alert_type: AlertType
    subject_template: str
    html_template: str
    language: str = "fr"
    variables: List[str]  # Variables à injecter dans template


class SendAlertRequest(BaseModel):
    """Requête pour envoyer une alerte"""
    recipient_emails: List[EmailStr]
    alert_type: AlertType
    level: AlertLevel
    title: str
    message: str
    template_id: Optional[str] = None
    template_variables: Optional[Dict[str, str]] = None
    data: Dict[str, Any]  # Données métier (pour analytics)
    language: str = "fr"
    attachments: Optional[List[str]] = None  # Chemins fichiers à attacher


class SendBatchAlertRequest(BaseModel):
    """Requête pour envoyer alertes batch"""
    alerts: List[SendAlertRequest]
    send_as_digest: bool = False  # Grouper en 1 email par destinataire


class AlertHistoryEntry(BaseModel):
    """Entrée historique d'alerte"""
    alert_id: str
    sent_at: str
    alert_type: AlertType
    level: AlertLevel
    recipient_emails: List[str]
    subject: str
    status: str  # "sent" | "failed" | "bounced"
    error_message: Optional[str] = None


class TemplateListResponse(BaseModel):
    """Liste des templates"""
    total: int
    templates: List[AlertTemplate]


# ═══════════════════════════════════════════════════════════════════════════════
# STORAGE (in-memory pour démo)
# ═══════════════════════════════════════════════════════════════════════════════

class AlertStorage:
    """Gestion des alertes et templates"""
    
    def __init__(self):
        self._alerts: Dict[str, Dict] = {}
        self._templates: Dict[str, Dict] = {}
        self._alert_counter = 1
        self._init_default_templates()
    
    def _init_default_templates(self):
        """Initialise templates par défaut"""
        templates = [
            {
                "template_id": "tpl_cash_low_fr",
                "name": "Trésorerie Faible",
                "alert_type": AlertType.CASH_LOW,
                "subject_template": "ALERTE: Trésorerie critique - {runway_days} jours",
                "html_template": """
                <h2>Alerte Trésorerie Critique</h2>
                <p>Votre trésorerie actuelle est de <strong>{current_cash}</strong>.</p>
                <p>Runway estimé: <strong>{runway_days} jours</strong></p>
                <p>Recommandations:</p>
                <ul>
                  <li>Accélérer encaissements clients</li>
                  <li>Négocer délais fournisseurs</li>
                  <li>Envisager financement court terme</li>
                </ul>
                """,
                "language": "fr",
                "variables": ["current_cash", "runway_days"]
            },
            {
                "template_id": "tpl_client_risk_fr",
                "name": "Client Risqué",
                "alert_type": AlertType.CLIENT_RISK,
                "subject_template": "ALERTE: Client {client_name} - Risque {risk_level}",
                "html_template": """
                <h2>Alerte Risque Client</h2>
                <p>Client: <strong>{client_name}</strong></p>
                <p>Score de risque: <strong>{risk_score}/100</strong></p>
                <p>Rating: <strong>{rating}</strong></p>
                <p>Montant en retard: <strong>{overdue_amount}</strong></p>
                <p>Jours de retard: <strong>{days_overdue}</strong></p>
                <p>Actions recommandées:</p>
                <ul>
                  <li>Contacter client immédiatement</li>
                  <li>Vérifier historique paiements</li>
                  <li>Considérer réduction crédit</li>
                </ul>
                """,
                "language": "fr",
                "variables": ["client_name", "risk_score", "rating", "overdue_amount", "days_overdue"]
            },
            {
                "template_id": "tpl_payment_overdue_fr",
                "name": "Facture en Retard",
                "alert_type": AlertType.PAYMENT_OVERDUE,
                "subject_template": "ALERTE: Facture en retard - {days_overdue}j - {client_name}",
                "html_template": """
                <h2>Alerte Facture en Retard</h2>
                <p>Client: <strong>{client_name}</strong></p>
                <p>Facture #: <strong>{invoice_number}</strong></p>
                <p>Montant: <strong>{invoice_amount}</strong></p>
                <p>Date d'échéance: <strong>{due_date}</strong></p>
                <p>Jours de retard: <strong>{days_overdue}</strong></p>
                """,
                "language": "fr",
                "variables": ["client_name", "invoice_number", "invoice_amount", "due_date", "days_overdue"]
            }
        ]
        
        for tpl in templates:
            self._templates[tpl["template_id"]] = tpl
    
    def record_alert(
        self,
        alert_type: AlertType,
        level: AlertLevel,
        recipient_emails: List[str],
        subject: str,
        status: str,
        error_message: Optional[str] = None
    ) -> str:
        """Enregistre une alerte dans l'historique"""
        alert_id = f"alr_{self._alert_counter:06d}"
        self._alert_counter += 1
        
        self._alerts[alert_id] = {
            "alert_id": alert_id,
            "sent_at": datetime.now().isoformat(),
            "alert_type": alert_type.value,
            "level": level.value,
            "recipient_emails": recipient_emails,
            "subject": subject,
            "status": status,
            "error_message": error_message
        }
        
        return alert_id
    
    def get_alert_history(
        self,
        limit: int = 50,
        offset: int = 0,
        alert_type: Optional[AlertType] = None,
        level: Optional[AlertLevel] = None
    ) -> tuple[List[Dict], int]:
        """Récupère historique des alertes avec filtres optionnels"""
        alerts = list(self._alerts.values())
        
        # Filtrer
        if alert_type:
            alerts = [a for a in alerts if a["alert_type"] == alert_type.value]
        if level:
            alerts = [a for a in alerts if a["level"] == level.value]
        
        # Trier par date descendante
        alerts.sort(key=lambda x: x["sent_at"], reverse=True)
        
        # Pagination
        total = len(alerts)
        alerts = alerts[offset:offset+limit]
        
        return alerts, total
    
    def get_template(self, template_id: str) -> Optional[Dict]:
        """Récupère un template"""
        return self._templates.get(template_id)
    
    def list_templates(
        self,
        alert_type: Optional[AlertType] = None,
        language: str = "fr"
    ) -> List[Dict]:
        """Liste les templates avec filtres optionnels"""
        templates = list(self._templates.values())
        
        if alert_type:
            templates = [t for t in templates if AlertType(t["alert_type"]) == alert_type]
        
        templates = [t for t in templates if t["language"] == language]
        
        return templates
    
    def create_custom_template(
        self,
        name: str,
        alert_type: AlertType,
        subject_template: str,
        html_template: str,
        variables: List[str],
        language: str = "fr"
    ) -> str:
        """Crée un template personnalisé"""
        template_id = f"tpl_custom_{len(self._templates):03d}_{datetime.now().timestamp()}"
        
        self._templates[template_id] = {
            "template_id": template_id,
            "name": name,
            "alert_type": alert_type.value,
            "subject_template": subject_template,
            "html_template": html_template,
            "language": language,
            "variables": variables
        }
        
        return template_id


alert_storage = AlertStorage()


# ═══════════════════════════════════════════════════════════════════════════════
# GMAIL SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class GmailService:
    """Service pour envoyer emails via Gmail API"""
    
    def __init__(self):
        self.auth = get_google_auth()
        self.gmail_service = None
        self.from_email = os.getenv("GMAIL_FROM_EMAIL", "me")  # "me" = compte authentifié
    
    def _get_gmail_service(self):
        """Lazy load du service Gmail"""
        if self.gmail_service is None:
            self.gmail_service = self.auth.get_gmail_service()
        return self.gmail_service
    
    async def send_email(
        self,
        to_emails: List[str],
        subject: str,
        html_content: str,
        attachments: Optional[List[str]] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Envoie un email via Gmail API.
        
        Args:
            to_emails: Liste d'emails destinataires
            subject: Sujet
            html_content: Contenu HTML
            attachments: Chemins fichiers à attacher
            
        Returns:
            (success, error_message)
        """
        try:
            gmail = self._get_gmail_service()
            
            # Créer message MIME
            message = MIMEMultipart('alternative')
            message['To'] = ', '.join(to_emails)
            message['Subject'] = subject
            
            # Ajouter contenu HTML
            html_part = MIMEText(html_content, 'html')
            message.attach(html_part)
            
            # TODO: Gérer attachments si nécessaire
            
            # Encoder message en base64
            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
            
            # Envoyer via Gmail API
            send_result = gmail.users().messages().send(
                userId=self.from_email,
                body={'raw': raw_message}
            ).execute()
            
            message_id = send_result.get('id')
            print(f"✅ Email envoyé via Gmail: {message_id} → {to_emails}")
            
            return True, None
        except HttpError as e:
            error_msg = f"Gmail API error: {str(e)}"
            print(f"❌ {error_msg}")
            return False, error_msg
        except Exception as e:
            error_msg = f"Error sending email: {str(e)}"
            print(f"❌ {error_msg}")
            return False, error_msg


gmail_service = GmailService()


# ═══════════════════════════════════════════════════════════════════════════════
# TEMPLATE RENDERING
# ═══════════════════════════════════════════════════════════════════════════════

class TemplateRenderer:
    """Rend templates avec données"""
    
    @staticmethod
    def render_template(template: Dict, variables: Dict[str, str]) -> tuple[str, str]:
        """
        Rend un template avec variables.
        
        Args:
            template: Template dict
            variables: Variables a injecter
            
        Returns:
            (subject, html_content)
        """
        subject = template["subject_template"]
        html = template["html_template"]
        
        # Remplacer variables dans format {variable_name}
        for var_name, var_value in variables.items():
            subject = subject.replace(f"{{{var_name}}}", str(var_value))
            html = html.replace(f"{{{var_name}}}", str(var_value))
        
        return subject, html


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/alerts/send")
async def send_alert(
    request: SendAlertRequest,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """
    Envoie une alerte email via Gmail.
    
    Si template_id fourni, utilise template et variables.
    Sinon utilise title et message fournis.
    """
    try:
        # Valider emails
        if not request.recipient_emails:
            raise HTTPException(status_code=400, detail="At least one recipient email required")
        
        subject = request.title
        html_content = request.message
        
        # Si template fourni, l'utiliser
        if request.template_id:
            template = alert_storage.get_template(request.template_id)
            if not template:
                raise HTTPException(status_code=404, detail=f"Template {request.template_id} not found")
            
            # Rendre template
            template_vars = request.template_variables or {}
            subject, html_content = TemplateRenderer.render_template(template, template_vars)
        
        # Envoyer email
        success, error = await gmail_service.send_email(
            to_emails=request.recipient_emails,
            subject=subject,
            html_content=html_content,
            attachments=request.attachments
        )
        
        if not success:
            status = "failed"
            error_msg = error
        else:
            status = "sent"
            error_msg = None
        
        # Enregistrer dans historique
        alert_id = alert_storage.record_alert(
            alert_type=request.alert_type,
            level=request.level,
            recipient_emails=request.recipient_emails,
            subject=subject,
            status=status,
            error_message=error_msg
        )
        
        return {
            "alert_id": alert_id,
            "status": status,
            "recipients": request.recipient_emails,
            "subject": subject,
            "error": error_msg
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending alert: {str(e)}")


@router.post("/alerts/send-batch")
async def send_batch_alerts(
    request: SendBatchAlertRequest,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """Envoie multiple alertes"""
    try:
        results = []
        
        for alert_req in request.alerts:
            result = await send_alert(alert_req, api_key)
            results.append(result)
        
        successful = sum(1 for r in results if r["status"] == "sent")
        
        return {
            "total": len(results),
            "successful": successful,
            "failed": len(results) - successful,
            "results": results
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending batch alerts: {str(e)}")


@router.get("/alerts/history")
async def get_alert_history(
    limit: int = 50,
    offset: int = 0,
    alert_type: Optional[str] = None,
    level: Optional[str] = None,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """Récupère historique des alertes"""
    try:
        alert_type_enum = AlertType[alert_type.upper()] if alert_type else None
        level_enum = AlertLevel[level.upper()] if level else None
        
        alerts, total = alert_storage.get_alert_history(
            limit=limit,
            offset=offset,
            alert_type=alert_type_enum,
            level=level_enum
        )
        
        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "alerts": alerts
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving alert history: {str(e)}")


@router.get("/alerts/templates/list")
async def list_templates(
    alert_type: Optional[str] = None,
    language: str = "fr",
    api_key: Optional[str] = Header(None)
) -> TemplateListResponse:
    """Liste les templates d'alerte disponibles"""
    try:
        alert_type_enum = AlertType[alert_type.upper()] if alert_type else None
        
        templates = alert_storage.list_templates(
            alert_type=alert_type_enum,
            language=language
        )
        
        return TemplateListResponse(
            total=len(templates),
            templates=[AlertTemplate(**t) for t in templates]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing templates: {str(e)}")


@router.post("/alerts/templates/create")
async def create_template(
    request: AlertTemplate,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """Crée un template d'alerte personnalisé"""
    try:
        template_id = alert_storage.create_custom_template(
            name=request.name,
            alert_type=request.alert_type,
            subject_template=request.subject_template,
            html_template=request.html_template,
            variables=request.variables,
            language=request.language
        )
        
        return {
            "template_id": template_id,
            "name": request.name,
            "alert_type": request.alert_type.value,
            "message": "Template created successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating template: {str(e)}")

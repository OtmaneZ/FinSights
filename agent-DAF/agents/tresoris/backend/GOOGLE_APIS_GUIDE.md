# TRESORIS V3 - Google APIs Integration Guide

## Vue d'ensemble

TRESORIS V3 intègre **3 APIs Google** majeures pour une automatisation financière complète:

1. **Google Docs API** - Génération rapports financiers automatisés
2. **Gmail API** - Envoi alertes trésorerie aux DAF
3. **Google Calendar API** - Synchronisation calendrier (échéances, alertes)

---

## 1. Google Docs API - Report Generation

### Endpoints

#### ✅ `POST /api/v1/reports/generate`
Crée un nouveau rapport financier en Google Docs.

**Request:**
```json
{
  "report_type": "cash_flow",
  "title": "Trésorerie Mars 2025",
  "description": "Analyse complète de la position de trésorerie",
  "spreadsheet_id": "optional-sheet-id",
  "include_charts": true,
  "include_recommendations": true,
  "date_range": {
    "from": "2025-03-01",
    "to": "2025-03-31"
  },
  "language": "fr"
}
```

**Report Types:**
- `cash_flow` - Rapport trésorerie complet
- `margin_analysis` - Analyse marges par client/produit
- `risk_summary` - Résumé risques clients
- `full_dashboard` - Dashboard complet

**Response:**
```json
{
  "report_id": "rep_000001",
  "title": "Trésorerie Mars 2025",
  "google_doc_id": "doc_1234567890_Tresorier",
  "status": "generated",
  "url": "https://docs.google.com/document/d/doc_1234567890_Tresorier/edit",
  "created_at": "2025-03-01T10:30:00",
  "message": "Report 'Trésorerie Mars 2025' generated successfully"
}
```

#### ✅ `GET /api/v1/reports/{report_id}`
Récupère métadonnées d'un rapport.

#### ✅ `POST /api/v1/reports/{report_id}/export`
Exporte rapport en PDF ou DOCX.

**Request:**
```json
{
  "format": "pdf",
  "include_metadata": true,
  "filename": "Tresoris_Mars_2025.pdf"
}
```

#### ✅ `GET /api/v1/reports/list`
Liste tous les rapports générés.

#### ✅ `POST /api/v1/reports/{report_id}/share`
Partage rapport avec utilisateurs.

**Request:**
```json
{
  "emails": ["daf1@company.com", "cfo@company.com"],
  "role": "viewer",
  "send_notification": true,
  "message": "Rapport trésorerie à votre attention"
}
```

### Workflow Exemple

```bash
# 1. Générer rapport
curl -X POST http://localhost:8000/api/v1/reports/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "report_type": "cash_flow",
    "title": "Trésorerie Hebdo",
    "language": "fr"
  }'

# Response: report_id = rep_000001

# 2. Exporter en PDF
curl -X POST http://localhost:8000/api/v1/reports/rep_000001/export \
  -H "Content-Type: application/json" \
  -d '{"format": "pdf"}'

# 3. Partager avec DAF
curl -X POST http://localhost:8000/api/v1/reports/rep_000001/share \
  -H "Content-Type: application/json" \
  -d '{
    "emails": ["daf@company.com"],
    "role": "viewer",
    "send_notification": true
  }'
```

---

## 2. Gmail API - Alert Notifications

### Endpoints

#### ✅ `POST /api/v1/alerts/send`
Envoie une alerte email via Gmail.

**Request:**
```json
{
  "recipient_emails": ["daf@company.com"],
  "alert_type": "cash_low",
  "level": "CRITICAL",
  "title": "ALERTE: Trésorerie critique",
  "message": "Runway: 15 jours",
  "template_id": "tpl_cash_low_fr",
  "template_variables": {
    "current_cash": "EUR 50,000",
    "runway_days": "15"
  },
  "data": {
    "current_cash": 50000,
    "runway_days": 15
  },
  "language": "fr"
}
```

**Alert Types:**
- `cash_low` - Trésorerie faible
- `client_risk` - Client risqué
- `payment_overdue` - Facture en retard
- `dso_high` - DSO trop élevé
- `margin_drop` - Baisse marges
- `cost_drift` - Dérive coûts
- `variance_alert` - Variance budget
- `stress_test_fail` - Simulation échouée

**Alert Levels:**
- `INFO` - Information simple
- `WARNING` - Attention requise
- `CRITICAL` - Action immédiate

**Response:**
```json
{
  "alert_id": "alr_000001",
  "status": "sent",
  "recipients": ["daf@company.com"],
  "subject": "ALERTE: Trésorerie critique - 15 jours",
  "error": null
}
```

#### ✅ `POST /api/v1/alerts/send-batch`
Envoie multiple alertes.

**Request:**
```json
{
  "alerts": [
    { "recipient_emails": [...], "alert_type": "cash_low", ... },
    { "recipient_emails": [...], "alert_type": "client_risk", ... }
  ],
  "send_as_digest": true
}
```

#### ✅ `GET /api/v1/alerts/history`
Récupère historique des alertes.

**Query Parameters:**
- `limit` - Nombre d'alertes (défaut: 50)
- `offset` - Pagination
- `alert_type` - Filtrer par type
- `level` - Filtrer par niveau (INFO, WARNING, CRITICAL)

#### ✅ `GET /api/v1/alerts/templates/list`
Liste templates d'alertes disponibles.

**Query Parameters:**
- `alert_type` - Filtrer par type
- `language` - "fr" ou "en" (défaut: "fr")

**Response:**
```json
{
  "total": 3,
  "templates": [
    {
      "template_id": "tpl_cash_low_fr",
      "name": "Trésorerie Faible",
      "alert_type": "cash_low",
      "subject_template": "ALERTE: Trésorerie critique - {runway_days} jours",
      "html_template": "...",
      "language": "fr",
      "variables": ["current_cash", "runway_days"]
    }
  ]
}
```

#### ✅ `POST /api/v1/alerts/templates/create`
Crée un template d'alerte personnalisé.

**Request:**
```json
{
  "name": "Mon alerte personnalisée",
  "alert_type": "custom",
  "subject_template": "Alerte custom: {variable1}",
  "html_template": "<h2>Alerte personnalisée</h2><p>{variable1}</p>",
  "variables": ["variable1"],
  "language": "fr"
}
```

### Templates Par Défaut

#### 1. Trésorerie Faible (`cash_low`)
```
Subject: ALERTE: Trésorerie critique - {runway_days} jours
Variables: current_cash, runway_days
```

#### 2. Client Risqué (`client_risk`)
```
Subject: ALERTE: Client {client_name} - Risque {risk_level}
Variables: client_name, risk_score, rating, overdue_amount, days_overdue
```

#### 3. Facture en Retard (`payment_overdue`)
```
Subject: ALERTE: Facture en retard - {days_overdue}j - {client_name}
Variables: client_name, invoice_number, invoice_amount, due_date, days_overdue
```

### Workflow Exemple

```bash
# 1. Lister templates disponibles
curl http://localhost:8000/api/v1/alerts/templates/list?language=fr

# 2. Envoyer alerte avec template
curl -X POST http://localhost:8000/api/v1/alerts/send \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_emails": ["daf@company.com"],
    "alert_type": "cash_low",
    "level": "CRITICAL",
    "template_id": "tpl_cash_low_fr",
    "template_variables": {
      "current_cash": "EUR 50,000",
      "runway_days": "15"
    },
    "data": {}
  }'

# 3. Récupérer historique
curl http://localhost:8000/api/v1/alerts/history?level=CRITICAL&limit=10
```

---

## 3. Google Calendar API - Calendar Integration

### Endpoints

#### ✅ `POST /api/v1/calendar/events/create`
Crée un nouvel événement calendrier.

**Request:**
```json
{
  "title": "Facture due: Acme Corp (INV-001)",
  "description": "Montant: EUR 15,000",
  "event_type": "invoice_due",
  "start_time": "2025-03-15T23:59:59Z",
  "end_time": "2025-03-16T00:00:00Z",
  "location": "Online",
  "attendees": ["daf@company.com"],
  "reminder_minutes": 1440,
  "color_id": "red",
  "metadata": {
    "invoice_number": "INV-001",
    "client": "Acme Corp",
    "amount": 15000
  },
  "calendar_id": "primary"
}
```

**Event Types:**
- `invoice_due` - Échéance facture
- `alert_cash_low` - Alerte trésorerie
- `alert_client_risk` - Alerte client
- `action_recommended` - Action recommandée
- `daf_meeting` - Réunion DAF
- `payment_expected` - Paiement attendu
- `custom` - Événement personnalisé

**Response:**
```json
{
  "event_id": "evt_000001",
  "title": "Facture due: Acme Corp (INV-001)",
  "event_type": "invoice_due",
  "start_time": "2025-03-15T23:59:59Z",
  "status": "created",
  "google_calendar_url": "https://calendar.google.com/...",
  "message": "Event created successfully"
}
```

#### ✅ `POST /api/v1/calendar/sync/invoices`
Synchronise échéances factures vers calendrier.

**Request:**
```json
{
  "spreadsheet_id": "optional-sheet-id",
  "days_ahead": 90,
  "min_amount": 1000,
  "auto_create_events": true,
  "calendar_id": "primary"
}
```

**Response:**
```json
{
  "status": "synced",
  "events_created": 5,
  "event_ids": ["evt_000001", "evt_000002", ...],
  "message": "Synced 5 invoice due dates to calendar"
}
```

#### ✅ `POST /api/v1/calendar/sync/alerts`
Synchronise alertes trésorerie vers calendrier.

**Request:**
```json
{
  "alert_types": ["cash_low", "client_risk"],
  "days_ahead": 30,
  "auto_create_events": true,
  "calendar_id": "primary"
}
```

#### ✅ `GET /api/v1/calendar/events/list`
Liste les événements calendrier.

**Query Parameters:**
- `calendar_id` - ID calendrier (défaut: "primary")
- `event_type` - Filtrer par type
- `start_time_from` - Date debut (ISO 8601)
- `start_time_to` - Date fin (ISO 8601)
- `limit` - Nombre d'événements (défaut: 100)

#### ✅ `PUT /api/v1/calendar/events/{event_id}`
Met à jour un événement.

**Request:**
```json
{
  "title": "Nouveau titre",
  "description": "Nouvelle description",
  "start_time": "2025-03-20T10:00:00Z",
  "reminder_minutes": 60
}
```

#### ✅ `DELETE /api/v1/calendar/events/{event_id}`
Supprime un événement.

### Workflow Exemple

```bash
# 1. Sync automatique des échéances factures
curl -X POST http://localhost:8000/api/v1/calendar/sync/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "days_ahead": 90,
    "min_amount": 500,
    "calendar_id": "primary"
  }'

# Response: 5 events created

# 2. Sync automatique des alertes
curl -X POST http://localhost:8000/api/v1/calendar/sync/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "alert_types": ["cash_low", "client_risk"],
    "calendar_id": "primary"
  }'

# 3. Lister les événements à venir
curl http://localhost:8000/api/v1/calendar/events/list?calendar_id=primary&limit=20

# 4. Mettre à jour un événement
curl -X PUT http://localhost:8000/api/v1/calendar/events/evt_000001 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

---

## Setup Google APIs

### 1. Créer Google Cloud Project

1. Aller sur https://console.cloud.google.com
2. Créer nouveau projet
3. Activer les APIs:
   - Google Docs API
   - Gmail API
   - Google Calendar API
   - Google Drive API

### 2. Créer Service Account

1. Aller sur **IAM & Admin → Service Accounts**
2. Créer nouveau service account
3. Télécharger la clé JSON
4. Placer le fichier dans `/path/to/service-account-key.json`

### 3. Configuration Environment

Copier `.env.complete` vers `.env`:
```bash
cp .env.complete .env
```

Modifier les variables:
```env
GOOGLE_SERVICE_ACCOUNT_JSON=/path/to/service-account-key.json
GMAIL_FROM_EMAIL=noreply@tresoris.ai
GMAIL_DAF_RECIPIENTS=daf@company.com
GOOGLE_CALENDAR_ID=primary
```

### 4. Permissions Service Account

Pour que le service account puisse envoyer des emails au nom de votre domaine:

1. Dans Google Admin Console:
   - Aller sur **Admin Settings → Security → Less secure app access**
   - Activer pour le service account

Ou mieux: Utiliser [Domain-wide Delegation](https://developers.google.com/identity/protocols/oauth2/service-account/impersonation)

---

## Intégration avec TRESORIS Orchestrator

### Déclencher Rapports Automatiquement

```python
# Dans orchestrator.py
from api.doc_router import report_storage
from api.notification_router import alert_storage
from api.calendar_router import calendar_storage

async def generate_daily_report(analysis_result):
    """Génère rapport automatique chaque jour"""
    report_id = report_storage.create_report(
        title=f"Trésorerie {datetime.now().strftime('%Y-%m-%d')}",
        report_type="cash_flow",
        description="Rapport automatique quotidien"
    )
    # ... générer contenu et envoyer email
    await notify_daf_report_ready(report_id)

async def notify_daf_report_ready(report_id):
    """Notifie DAF que rapport est prêt"""
    await send_alert(
        recipients=["daf@company.com"],
        alert_type=AlertType.CUSTOM,
        level=AlertLevel.INFO,
        template_variables={"report_id": report_id}
    )
```

### Déclencher Alertes Automatiquement

```python
async def trigger_cash_alert_if_needed(treasury_position):
    """Déclenche alerte si trésorerie critique"""
    if treasury_position.runway_days < 15:
        await send_alert(
            recipients=GMAIL_DAF_RECIPIENTS,
            alert_type=AlertType.CASH_LOW,
            level=AlertLevel.CRITICAL,
            template_variables={
                "current_cash": treasury_position.current_balance,
                "runway_days": treasury_position.runway_days
            }
        )
```

---

## Architecture de Production

### Recommandations

1. **Database**: Remplacer in-memory storage par PostgreSQL/MongoDB
2. **Queue**: Ajouter Celery/RabbitMQ pour async jobs (exports, syncs)
3. **Caching**: Redis pour cache templates et rapports
4. **Monitoring**: Sentry pour error tracking
5. **Rate Limiting**: Ajouter rate limiter pour les APIs Google
6. **Logging**: ELK stack pour logs centralisés

### Déploiement

```bash
# Build Docker
docker build -t tresoris-v3 .

# Run
docker run -p 8000:8000 \
  -e GOOGLE_SERVICE_ACCOUNT_JSON=/secrets/service-account.json \
  -e GMAIL_DAF_RECIPIENTS=daf@company.com \
  -v /path/to/secrets:/secrets:ro \
  tresoris-v3
```

---

## Support & Troubleshooting

### Erreurs Communes

**"Impossible de créer document Google"**
- Vérifier que `GOOGLE_SERVICE_ACCOUNT_JSON` est correctement configuré
- Vérifier permissions service account

**"Email non envoyé"**
- Vérifier `GMAIL_FROM_EMAIL` est configuré
- Vérifier credentials Gmail API
- Vérifier destinataire email est valide

**"Événement calendrier non créé"**
- Vérifier `GOOGLE_CALENDAR_ID` existe
- Vérifier permissions service account sur calendrier

### Logs Debug

```bash
# Activer debug mode
DEBUG_MODE=true

# Voir les logs
docker logs -f tresoris-v3
```

---

## Prochaines Étapes

- [ ] Ajouter intégration avec Tableau/Power BI
- [ ] Ajouter webhooks pour notifications temps-réel
- [ ] Ajouter support pour OneDrive (Microsoft Docs)
- [ ] Ajouter support pour Slack notifications
- [ ] Ajouter support pour Teams notifications

---

**Version**: TRESORIS V3.0
**Last Updated**: 01/02/2025

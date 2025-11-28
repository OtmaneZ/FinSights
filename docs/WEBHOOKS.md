# Webhooks System - Documentation

## Overview

Le système de webhooks permet de recevoir des notifications HTTP en temps réel lorsqu'un événement se produit sur FinSight.

**Quotas par plan :**

- FREE : Aucun webhook
- PRO : 5 webhooks max
- SCALE : 20 webhooks max
- ENTERPRISE : 100 webhooks max

---

## Configuration

### 1. Créer un webhook

**Interface Web :** `/dashboard/webhooks`

**Via API (bientôt disponible) :**

```bash
curl -X POST https://finsight.zineinsight.com/api/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhooks/finsight",
    "events": ["dashboard.created", "kpi.threshold_reached"]
  }'
```

**Réponse :**

```json
{
  "webhook": {
    "id": "wh_abc123",
    "url": "https://your-domain.com/webhooks/finsight",
    "events": ["dashboard.created", "kpi.threshold_reached"],
    "secret": "whsec_xxxxxxxxxxxxxxxxxxxx",
    "active": true
  }
}
```

⚠️ **Important :** Le `secret` n'est affiché qu'une seule fois lors de la création.

---

## Événements disponibles

| Événement | Description | Données payload |
|-----------|-------------|----------------|
| `dashboard.created` | Dashboard uploadé | `dashboardId`, `fileName`, `companyId`, `kpis` |
| `dashboard.updated` | Dashboard modifié | `dashboardId`, `changes` |
| `dashboard.deleted` | Dashboard supprimé | `dashboardId` |
| `kpi.threshold_reached` | Seuil KPI atteint | `metric`, `value`, `threshold`, `dashboardId` |
| `company.created` | Entreprise ajoutée | `companyId`, `name`, `sector` |
| `company.updated` | Entreprise modifiée | `companyId`, `changes` |

---

## Format de la requête

### Headers

```
Content-Type: application/json
X-FinSight-Signature: sha256_signature_here
X-FinSight-Event: dashboard.created
User-Agent: FinSight-Webhooks/1.0
```

### Payload

```json
{
  "event": "dashboard.created",
  "timestamp": "2025-11-28T10:30:00.000Z",
  "userId": "user_abc123",
  "data": {
    "dashboardId": "dash_xyz789",
    "fileName": "compta-q4.csv",
    "companyId": "comp_abc",
    "kpis": {
      "revenue": 125000,
      "cashFlow": -12000
    }
  }
}
```

---

## Vérification de signature

Le header `X-FinSight-Signature` contient un HMAC SHA256 du payload, signé avec votre secret.

### Exemple Node.js

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express endpoint
app.post('/webhooks/finsight', (req, res) => {
  const signature = req.headers['x-finsight-signature'];
  const secret = 'whsec_your_secret';

  if (!verifyWebhookSignature(req.body, signature, secret)) {
    return res.status(401).send('Invalid signature');
  }

  const { event, data } = req.body;

  // Handle event
  console.log(`Received event: ${event}`, data);

  res.status(200).send('OK');
});
```

### Exemple Python (Flask)

```python
import hmac
import hashlib
from flask import Flask, request

app = Flask(__name__)

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

@app.route('/webhooks/finsight', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-FinSight-Signature')
    secret = 'whsec_your_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return 'Invalid signature', 401

    event_data = request.json
    event = event_data['event']
    data = event_data['data']

    # Handle event
    print(f"Received event: {event}", data)

    return 'OK', 200
```

---

## Delivery & Retry

### Politique de retry

- **Timeout :** 10 secondes
- **Tentatives :** 3 maximum
- **Backoff exponentiel :** 0s, 5s, 25s

### Conditions de retry

- ✅ Erreurs serveur (5xx)
- ✅ Erreurs réseau (timeout, connexion refusée)
- ❌ Erreurs client (4xx) → Pas de retry

### Réponses attendues

Votre endpoint doit répondre avec un status `2xx` (200, 201, 204) pour indiquer une réception réussie.

---

## Logs de livraison

Consultez les logs dans `/dashboard/webhooks` :

- Status HTTP
- Nombre de tentatives
- Erreurs rencontrées
- Date de livraison

Les 100 dernières livraisons sont conservées par webhook.

---

## Désactiver temporairement

Vous pouvez désactiver un webhook sans le supprimer :

```bash
# Via l'interface web
/dashboard/webhooks → Toggle "Actif/Inactif"

# Via API (bientôt)
curl -X PUT https://finsight.zineinsight.com/api/webhooks/wh_abc123 \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"active": false}'
```

---

## Exemples d'intégration

### Slack notification

```javascript
app.post('/webhooks/finsight', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'kpi.threshold_reached') {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 Alerte KPI: ${data.metric} = ${data.value} (seuil: ${data.threshold})`
      })
    });
  }

  res.status(200).send('OK');
});
```

### CRM sync (Hubspot)

```javascript
app.post('/webhooks/finsight', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'dashboard.created') {
    // Create activity in Hubspot
    await fetch('https://api.hubapi.com/crm/v3/objects/companies', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          name: data.fileName,
          last_dashboard_upload: data.timestamp
        }
      })
    });
  }

  res.status(200).send('OK');
});
```

---

## Sécurité

✅ **Bonnes pratiques :**

- Toujours vérifier la signature HMAC
- Utiliser HTTPS pour votre endpoint
- Valider le format du payload
- Limiter le taux de requêtes acceptées
- Logger les tentatives suspectes

❌ **À éviter :**

- Exposer votre secret dans le code client
- Accepter des webhooks sans vérification
- Utiliser HTTP au lieu de HTTPS
- Exposer des endpoints publics sans authentification

---

## Limites

- **Taille payload max :** 1 MB
- **Timeout :** 10 secondes
- **Retry max :** 3 tentatives
- **Conservation logs :** 100 dernières livraisons

---

## Support

Pour toute question :

- 📧 Email : <support@finsight.com>
- 📚 Documentation : [finsight.zineinsight.com/docs](https://finsight.zineinsight.com/docs)
- 💬 Discord : [discord.gg/finsight](https://discord.gg/finsight)

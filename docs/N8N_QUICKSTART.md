# 🔗 FinSights × n8n - Quick Start

## 🎯 Use Case : CRM → Pennylane → Dashboard Auto

### Architecture
```
Sellsy/HubSpot → n8n → Pennylane API → n8n → FinSights Webhook → Dashboard mis à jour
```

## ⚡ Setup rapide (15 min)

### 1. Créer compte n8n Cloud
- https://n8n.io (gratuit 5000 exécutions/mois)

### 2. Importer workflow prêt à l'emploi
- Télécharger : `docs/n8n-workflow-pennylane-finsights.json`
- n8n → Import from File

### 3. Configurer credentials

**Pennylane API :**
- Type : `HTTP Header Auth`
- Header Name : `Authorization`
- Header Value : `Bearer YOUR_PENNYLANE_API_KEY`

**FinSights Webhook :**
- Type : `HTTP Header Auth`
- Header Name : `x-webhook-signature`
- Header Value : `YOUR_N8N_WEBHOOK_SECRET`

### 4. Variables d'environnement n8n
```bash
FINSIGHTS_COMPANY_ID=cuid_de_votre_company
N8N_WEBHOOK_SECRET=votre_secret_partagé
```

### 5. Activer workflow
- Test manuel : clic "Execute Workflow"
- Production : Toggle "Active" → sync automatique quotidien

---

## 🔌 Endpoints API FinSights

### POST `/api/integrations/n8n/ingest`
Recevoir transactions depuis n8n

**Headers :**
```
Content-Type: application/json
x-webhook-signature: sha256_hmac_signature
```

**Body :**
```json
{
  "transactions": [
    {
      "date": "2025-12-16",
      "description": "Client ABC - Facture F2025-123",
      "amount": 5000,
      "type": "income",
      "category": "Ventes",
      "paymentStatus": "Payé",
      "source": "pennylane"
    }
  ],
  "companyId": "clxxx",
  "source": "pennylane"
}
```

**Response :**
```json
{
  "success": true,
  "inserted": 1,
  "companyId": "clxxx",
  "source": "pennylane"
}
```

---

## 🔐 Sécurité

### Signature HMAC-SHA256
```javascript
// n8n Function Node
const crypto = require('crypto');
const payload = JSON.stringify($json);
const secret = $env.N8N_WEBHOOK_SECRET;

const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

return {
  json: {
    ...input,
    headers: {
      'x-webhook-signature': signature
    }
  }
};
```

---

## 📚 Documentation complète
- **Setup détaillé :** `docs/N8N_INTEGRATION.md`
- **Guide stratégique :** `docs/HUGO_RESPONSE_GUIDE.md`

---

## 🎬 Démo Live
**Dashboard :** https://finsight.zineinsight.com
**Contact :** Otmane Boulahia

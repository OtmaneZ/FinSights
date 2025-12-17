# 🔗 n8n Integration Guide - FinSights

## 🎯 Use Case Hugo : CRM → Comptabilité → Dashboard

### Architecture
```
Sellsy/HubSpot (CRM)
    ↓ webhook/polling
n8n Workflow
    ↓ API Pennylane
Pennylane (Comptabilité)
    ↓ webhook custom
n8n Workflow
    ↓ POST /api/webhooks
FinSights Dashboard (auto-update)
```

---

## 📋 Setup n8n (Local ou Cloud)

### Option A : n8n Cloud (le + simple)
1. Créer compte sur https://n8n.io (gratuit 5000 exécutions/mois)
2. Créer nouveau workflow

### Option B : n8n Self-hosted (Docker)
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Accès : http://localhost:5678

---

## 🔌 Workflow 1 : Sellsy → Pennylane

### Nodes n8n

**1. Trigger : Sellsy Webhook**
- Node type : `Webhook`
- Method : `POST`
- Path : `/sellsy-invoice`
- Response : `200 OK`

**2. Transform : Extract Data**
- Node type : `Function`
```javascript
// Extraire données facture Sellsy
const invoice = $input.item.json;

return [{
  json: {
    client: invoice.client_name,
    amount: invoice.total_amount,
    date: invoice.created_at,
    reference: invoice.invoice_number,
    type: 'income'
  }
}];
```

**3. Action : Create Pennylane Transaction**
- Node type : `HTTP Request`
- Method : `POST`
- URL : `https://api.pennylane.com/api/v1/customer_invoices`
- Headers :
  - `Authorization: Bearer {{PENNYLANE_API_KEY}}`
  - `Content-Type: application/json`
- Body :
```json
{
  "customer": {
    "name": "{{$json.client}}"
  },
  "line_items": [{
    "label": "{{$json.reference}}",
    "amount": "{{$json.amount}}",
    "currency": "EUR"
  }],
  "date": "{{$json.date}}"
}
```

**4. Success : Send to FinSights**
- Node type : `HTTP Request`
- Method : `POST`
- URL : `https://finsight.zineinsight.com/api/webhooks`
- Headers :
  - `x-webhook-signature: {{FINSIGHTS_WEBHOOK_SECRET}}`
  - `Content-Type: application/json`
- Body :
```json
{
  "event": "dashboard.updated",
  "data": {
    "transaction": {
      "date": "{{$json.date}}",
      "description": "Facture {{$json.reference}} - {{$json.client}}",
      "amount": {{$json.amount}},
      "type": "income",
      "source": "pennylane"
    }
  }
}
```

---

## 🔌 Workflow 2 : Pennylane → FinSights (Sync Quotidien)

### Nodes n8n

**1. Trigger : Schedule (Cron)**
- Node type : `Schedule Trigger`
- Cron : `0 8 * * *` (tous les jours 8h)

**2. Fetch : Get Pennylane Transactions**
- Node type : `HTTP Request`
- Method : `GET`
- URL : `https://api.pennylane.com/api/v1/customer_invoices`
- Query : `?filter[date][gte]={{$now.minus({days: 1}).toISO()}}`
- Auth : Bearer Token

**3. Transform : Format for FinSights**
- Node type : `Function`
```javascript
const invoices = $input.item.json.invoices;

return invoices.map(inv => ({
  json: {
    date: inv.date,
    description: `${inv.customer.name} - ${inv.invoice_number}`,
    amount: inv.amount,
    type: 'income',
    category: 'Ventes',
    paymentStatus: inv.status === 'paid' ? 'Payé' : 'En attente',
    source: 'pennylane_sync'
  }
}));
```

**4. Action : Batch Upload to FinSights**
- Node type : `HTTP Request`
- Method : `POST`
- URL : `https://finsight.zineinsight.com/api/v1/transactions/batch`
- Headers :
  - `Authorization: Bearer {{FINSIGHTS_API_KEY}}`
  - `Content-Type: application/json`
- Body :
```json
{
  "transactions": {{$json}}
}
```

---

## 🔐 Endpoint FinSights pour n8n

### Créer `/api/integrations/n8n/ingest`

**Fichier :** `src/pages/api/integrations/n8n/ingest.ts`

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { verifyWebhookSignature } from '@/lib/webhooks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 🔐 Vérifier signature webhook
        const signature = req.headers['x-webhook-signature'] as string;
        const isValid = verifyWebhookSignature(
            JSON.stringify(req.body),
            signature,
            process.env.N8N_WEBHOOK_SECRET!
        );

        if (!isValid) {
            logger.warn('[n8n] ❌ Signature invalide');
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const { transactions, companyId } = req.body;

        // 📊 Insérer transactions
        const created = await prisma.financialRecord.createMany({
            data: transactions.map((t: any) => ({
                ...t,
                companyId,
                source: 'n8n_integration'
            }))
        });

        logger.info(`[n8n] ✅ ${created.count} transactions insérées`);

        return res.status(200).json({
            success: true,
            inserted: created.count
        });

    } catch (error: any) {
        logger.error('[n8n] Erreur ingestion:', error);
        return res.status(500).json({
            error: 'Internal error',
            message: error.message
        });
    }
}
```

---

## 📸 Screenshots pour Hugo

### Workflow n8n visuel
![n8n Workflow](https://docs.n8n.io/images/workflows/example.png)

### Dashboard FinSights auto-updaté
- Avant : 15 transactions
- **Après trigger n8n** : +8 nouvelles transactions Pennylane
- KPIs recalculés automatiquement

---

## 🎯 Points à mettre en avant avec Hugo

### ✅ Ce que tu maîtrises
1. **APIs** : Tu codes des endpoints REST sécurisés
2. **Webhooks** : Système complet avec retry + logs
3. **Authentication** : API keys + signature HMAC
4. **n8n** : Orchestration workflows (tu vas apprendre en 2h)

### 🔥 Valeur ajoutée pour ses clients
- **Automation complète** : CRM → Compta → Dashboard (0 saisie manuelle)
- **Multi-sources** : Connecte plusieurs outils (Sellsy, Pennylane, HubSpot...)
- **Temps réel** : Dashboards à jour automatiquement
- **Custom** : Tu codes ce que les connecteurs ne peuvent pas faire

### 💡 Proposition de valeur
> "Je peux industrialiser la chaîne complète de données pour tes clients :
> - n8n pour orchestrer les flux standards
> - Code custom quand il faut + de contrôle (transformations métier, calculs spécifiques)
> - Dashboard FinSights pour la visualisation finale
>
> Exemple concret : Sellsy → Pennylane → Dashboard temps réel, le tout automatisé."

---

## 📚 Ressources n8n

- **Docs** : https://docs.n8n.io
- **Templates** : https://n8n.io/workflows
- **Pennylane node** : Custom HTTP Request
- **Sellsy connector** : Existe dans n8n

---

## ⏱️ Timeline apprentissage

**2h** : Maîtriser n8n base (nodes, workflow, triggers)
**1h** : Créer workflow test Pennylane → FinSights
**1h** : Polir + screenshots démo pour Hugo

**Total : 4h max** → Tu seras opérationnel demain

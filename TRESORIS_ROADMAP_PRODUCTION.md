# 🚀 TRESORIS - Roadmap vers Production Agent Autonome

**Date**: 31 janvier 2026  
**Objectif**: Transformer la demo en véritable agent autonome commercialisable  
**Cible**: CFO/DAF de PME/ETI avec comptabilité cloud (Pennylane, Agicap, QuickBooks)

---

## 📊 État des Lieux - Ce qui existe DÉJÀ

### ✅ **Infrastructure en place**

#### 1. **Intégrations Comptables** (OAuth flow complet)
```typescript
✅ Pennylane OAuth
   - /api/integrations/pennylane/connect
   - /api/integrations/pennylane/callback
   - /api/integrations/pennylane/sync
   - Gestion token + refresh

✅ QuickBooks OAuth
   - /api/integrations/quickbooks/connect
   - /api/integrations/quickbooks/callback
   - /api/integrations/quickbooks/sync
   
⚠️ Agicap: Non implémenté (API existe, à faire)
```

**Localisation code**:
- `src/app/api/integrations/pennylane/`
- `src/app/api/integrations/quickbooks/`
- Schema Prisma: `AccountingIntegration` model

#### 2. **Email Service Complet** (Resend)
```typescript
✅ Infrastructure email
   - Service: /lib/emails/emailService.ts
   - Provider: Resend (déjà configuré)
   - Templates React Email
   
✅ Templates existants:
   - WelcomeEmail
   - UpgradeSuccessEmail
   - PaymentFailedEmail
   - UsageAlertEmail
   
⚠️ À créer:
   - ClientReminderEmail (relance client)
   - CFOAlertEmail (alerte DAF)
```

**Localisation code**:
- `src/lib/emails/emailService.ts`
- `src/lib/emails/templates/`
- Variable env: `RESEND_API_KEY`

#### 3. **AI/LLM déjà intégré** (OpenRouter)
```typescript
✅ OpenAI client configuré
   - baseURL: 'https://openrouter.ai/api/v1'
   - Utilisé dans:
     * /api/ai/predictions.ts
     * /api/ai/patterns.ts
     * /api/copilot/chat.ts
   
✅ Modèles supportés:
   - GPT-4 (recommandé pour agent)
   - Claude 3.5 Sonnet (via OpenRouter)
   - DeepSeek (low cost)
```

**Localisation code**:
- `src/pages/api/ai/predictions.ts` (ligne 20)
- `src/pages/api/copilot/chat.ts` (ligne 4)
- Variable env: `OPENAI_API_KEY` (fonctionne avec OpenRouter)

#### 4. **Agent Backend Python** (6 Engines V2 - 100% validés)
```python
✅ Risk Agent complet:
   - ClientPaymentAnalyzer (537 lignes)
   - ClientRiskScorer (502 lignes)
   - SmartForecaster (448 lignes)
   - EarlyWarningDetector (687 lignes)
   - ActionPrioritizer (513 lignes)
   - SeasonalityAdjuster (186 lignes)

⚠️ À connecter:
   - Intégration avec données réelles (Pennylane/Agicap)
   - Webhook vers frontend
   - Actions email automatiques
```

**Localisation code**:
- `agent-DAF/agents/tresoris/backend/agent/risk_agent.py`
- `agent-DAF/agents/tresoris/backend/engine/`

---

## 🎯 Roadmap - Ce qu'il faut FAIRE

### Phase 1: **Connexions Comptabilité** (Semaine 1-2)

#### Objectif: L'agent lit les données réelles

**1.1 Agicap Integration**
```typescript
// À créer:
src/app/api/integrations/agicap/
├── connect/route.ts       // OAuth flow
├── callback/route.ts      // Handle token
├── sync/route.ts          // Fetch invoices + clients
└── webhook/route.ts       // Real-time updates

// Endpoints Agicap à utiliser:
GET /invoices              // Factures clients
GET /transactions          // Flux trésorerie
GET /forecasts             // Prévisions existantes
```

**Documentation Agicap API**: https://developers.agicap.com

**1.2 Pennylane Enhanced Sync**
```typescript
// Améliorer:
src/app/api/integrations/pennylane/sync/route.ts

// Ajouter récupération:
- Détail factures (date émission, échéance, montant)
- Historique paiements clients
- DSO par client
- Catégorisation automatique
```

**1.3 Data Sync Service**
```typescript
// À créer:
src/lib/integrations/syncService.ts

export async function syncAllAccountingData(companyId: string) {
    // 1. Detect active integration (Pennylane | Agicap | QuickBooks)
    // 2. Fetch invoices + payments
    // 3. Transform to unified format
    // 4. Store in Prisma (Invoice, Client, Payment models)
    // 5. Trigger agent analysis
}
```

**Deliverables**:
- ✅ Agicap OAuth complet
- ✅ Sync auto journalier (cron)
- ✅ Webhook temps réel
- ✅ Dashboard "Data Sources" montrant statut sync

---

### Phase 2: **Agent Autonome avec LLM** (Semaine 3-4)

#### Objectif: L'agent analyse ET conseille avec OpenRouter

**2.1 Agent Service avec LLM**
```typescript
// À créer:
src/lib/tresoris/agentService.ts

import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
})

export async function analyzeClientRisk(clientData) {
    // 1. Récupérer pattern de paiement (backend Python)
    // 2. Enrichir avec contexte GPT-4
    // 3. Générer insights personnalisés
    
    const insights = await client.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet', // ou gpt-4
        messages: [
            {
                role: 'system',
                content: `Tu es un agent DAF expert en trésorerie.
                Analyse les patterns de paiement et donne des conseils actionnables.
                Format JSON: { insight, risk_level, recommended_actions }`
            },
            {
                role: 'user',
                content: JSON.stringify(clientData)
            }
        ]
    })
    
    return JSON.parse(insights.choices[0].message.content)
}
```

**2.2 Insights Generation API**
```typescript
// À créer:
src/app/api/tresoris/insights/route.ts

POST /api/tresoris/insights
{
    "companyId": "...",
    "analysisType": "client_risk" | "cash_forecast" | "portfolio_health"
}

Response:
{
    "insights": [
        {
            "type": "risk",
            "client": "InnovCorp",
            "message": "Retard progressif +15j/mois sur 3 derniers paiements",
            "confidence": 0.85,
            "recommended_actions": [
                "Relancer avant échéance prochaine",
                "Proposer plan paiement échelonné"
            ]
        }
    ],
    "generated_by": "claude-3.5-sonnet",
    "timestamp": "..."
}
```

**2.3 Continuous Learning Loop**
```typescript
// À créer:
src/lib/tresoris/learningService.ts

// L'agent apprend des actions validées/rejetées par le DAF
export async function recordActionFeedback(actionId, decision, comment) {
    // Store dans Prisma
    await prisma.agentFeedback.create({
        data: { actionId, decision, comment, timestamp: new Date() }
    })
    
    // Améliorer prompts futurs avec ce feedback
    // (fine-tuning ou few-shot examples)
}
```

**Deliverables**:
- ✅ Agent génère insights textuels (pas juste chiffres)
- ✅ Recommandations personnalisées par client
- ✅ Apprentissage des décisions DAF
- ✅ Confidence score sur chaque insight

---

### Phase 3: **Email Automation** (Semaine 5)

#### Objectif: L'agent prépare (mais n'envoie PAS automatiquement) les emails

**3.1 Client Reminder Email Template**
```typescript
// À créer:
src/lib/emails/templates/ClientReminderEmail.tsx

interface ClientReminderEmailProps {
    clientName: string
    invoiceNumber: string
    amount: number
    dueDate: string
    daysOverdue: number
    paymentLink?: string
}

export const ClientReminderEmail = ({ ... }: ClientReminderEmailProps) => (
    <Html>
        <Head />
        <Preview>Rappel facture {invoiceNumber} - {amount}€</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Rappel de paiement</Heading>
                
                <Text style={text}>
                    Bonjour {clientName},
                </Text>
                
                <Text style={text}>
                    Nous constatons que la facture <strong>{invoiceNumber}</strong> 
                    d'un montant de <strong>{amount}€</strong>, arrivée à échéance 
                    le {dueDate}, reste impayée depuis {daysOverdue} jours.
                </Text>
                
                {/* Tone adapté selon retard */}
                {daysOverdue < 15 ? (
                    <Text>Si le paiement a déjà été effectué, merci de ne pas 
                    tenir compte de ce message.</Text>
                ) : (
                    <Text>Merci de régulariser cette situation dans les 48 heures.</Text>
                )}
                
                {paymentLink && (
                    <Button href={paymentLink}>Régler maintenant</Button>
                )}
            </Container>
        </Body>
    </Html>
)
```

**3.2 Email Preparation API (PAS envoi automatique)**
```typescript
// À créer:
src/app/api/tresoris/prepare-email/route.ts

POST /api/tresoris/prepare-email
{
    "actionId": "action_123",
    "type": "client_reminder",
    "clientId": "client_456"
}

Response:
{
    "emailDraft": {
        "to": "client@example.com",
        "subject": "Rappel facture #1234 - 85 000€",
        "htmlPreview": "<html>...</html>",
        "textContent": "...",
        "tone": "firm", // courteous | firm | formal
        "llm_enhanced": true
    },
    "requires_validation": true,
    "estimated_impact": "+2.1 semaines runway"
}
```

**3.3 Email Validation + Send**
```typescript
// À créer:
src/app/api/tresoris/send-validated-email/route.ts

POST /api/tresoris/send-validated-email
{
    "emailDraftId": "...",
    "approved_by": "daf@company.com",
    "modifications": "..." // Si DAF modifie
}

// ONLY après validation DAF → resend.emails.send()
```

**Deliverables**:
- ✅ Templates email professionnels
- ✅ Preview avant envoi (obligatoire)
- ✅ Validation DAF requise
- ✅ Historique emails envoyés (traçabilité)

---

### Phase 4: **Dashboard Production** (Semaine 6)

#### Objectif: Interface pro pour pilotage agent

**4.1 Agent Control Panel**
```typescript
// Améliorer:
src/components/tresoris/AutonomousAgentPanel.tsx

// Ajouter:
- Bouton "Connect Data Source" (Pennylane/Agicap)
- Status sync (dernière sync, prochaine dans X min)
- Logs détaillés (avec filtres)
- Stats performance agent (ROI, taux validation)
```

**4.2 Email Queue Dashboard**
```typescript
// À créer:
src/app/dashboard/tresoris/emails/page.tsx

// Vue liste emails:
- Draft (en attente validation)
- Sent (envoyés)
- Rejected (refusés par DAF)

// Actions:
- Preview email
- Edit + Send
- Reject + Feedback
```

**4.3 Insights Feed**
```typescript
// À créer:
src/components/tresoris/InsightsFeed.tsx

// Timeline style Notion:
- Insight généré par agent
- Timestamp
- Confidence
- Actions liées
- Feedback DAF (si action prise)
```

**Deliverables**:
- ✅ UI complète gestion agent
- ✅ Validation emails en 1 clic
- ✅ Reporting ROI agent
- ✅ Export actions (PDF/Excel)

---

### Phase 5: **Production & Monitoring** (Semaine 7)

#### Objectif: Agent en prod avec observabilité

**5.1 Monitoring Agent**
```typescript
// À créer:
src/lib/tresoris/monitoring.ts

export async function trackAgentMetrics() {
    // Métriques clés:
    - Nombre analyses/jour
    - Taux validation actions (%)
    - ROI moyen par action validée
    - Temps réponse agent
    - Errors/warnings
    
    // Envoyer à:
    - PostHog (déjà intégré)
    - Sentry (errors)
    - Dashboard interne
}
```

**5.2 Agent Health Check**
```typescript
// À créer:
GET /api/tresoris/health

Response:
{
    "status": "healthy" | "degraded" | "down",
    "last_analysis": "2026-01-31T14:30:00Z",
    "active_integrations": ["pennylane"],
    "llm_status": "operational",
    "email_service": "operational",
    "issues": []
}
```

**5.3 Alert System**
```typescript
// À créer:
src/lib/tresoris/alerting.ts

// Alerter si:
- Agent down > 30 min
- Sync fail > 3 fois
- LLM errors > 10%
- Email bounce rate élevé

// Envoyer:
- Email admin
- Slack notification (optionnel)
```

**Deliverables**:
- ✅ Monitoring temps réel
- ✅ Alertes automatiques
- ✅ SLA dashboard
- ✅ Logs centralisés

---

## 💰 Modèle Commercial

### **Pricing Tiers**

#### Free (Demo)
- 1 entreprise
- Données CSV uniquement
- 0 intégration comptable
- 0 agent autonome

#### Pro (99€/mois)
- ✅ 1 intégration comptable
- ✅ Agent analyse + insights LLM
- ✅ 50 emails/mois préparés
- ✅ Dashboard complet
- ⛔ Pas d'envoi email automatique (validation manuelle)

#### Scale (299€/mois)
- ✅ Intégrations illimitées
- ✅ Agent full autonome
- ✅ Emails illimités
- ✅ API access
- ✅ Custom webhooks
- ✅ Onboarding dédié

---

## 🔧 Stack Technique Final

### Frontend
```
Next.js 14 + React + TypeScript
Tailwind CSS
Framer Motion
Recharts
```

### Backend
```
Next.js API Routes (TypeScript)
Python FastAPI (Agent Engines)
Prisma ORM + PostgreSQL
```

### AI/LLM
```
OpenRouter API
- Claude 3.5 Sonnet (analysis)
- GPT-4 (insights)
- DeepSeek (cost optimization)
```

### Intégrations
```
Pennylane OAuth
Agicap API
QuickBooks OAuth
Resend (emails)
Stripe (paiements)
PostHog (analytics)
```

### Infrastructure
```
Vercel (frontend + API)
Railway/Render (Python agent)
Supabase/Neon (PostgreSQL)
Upstash Redis (rate limiting)
```

---

## 📝 Variables d'Environnement Requises

### Existantes
```bash
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://finsights.app

# AI
OPENAI_API_KEY=sk-or-v1-...  # OpenRouter API key

# Email
RESEND_API_KEY=re_...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### À ajouter
```bash
# Accounting Integrations
PENNYLANE_CLIENT_ID=...
PENNYLANE_CLIENT_SECRET=...
AGICAP_CLIENT_ID=...
AGICAP_CLIENT_SECRET=...
QUICKBOOKS_CLIENT_ID=...
QUICKBOOKS_CLIENT_SECRET=...

# Agent Backend (Python)
AGENT_BACKEND_URL=https://agent.finsights.app
AGENT_API_KEY=...

# Monitoring
SENTRY_DSN=...
```

---

## ✅ Checklist Go-to-Market

### Technique
- [ ] Agicap OAuth complet
- [ ] Pennylane sync enrichi
- [ ] Agent LLM intégré (OpenRouter)
- [ ] Email templates créés
- [ ] Validation workflow
- [ ] Monitoring production
- [ ] Tests end-to-end

### Business
- [ ] Pricing page
- [ ] Onboarding flow
- [ ] Documentation API
- [ ] Support client (email)
- [ ] Legal (CGU, RGPD)
- [ ] Factu Stripe automatique

### Marketing
- [ ] Landing page "Agent Autonome"
- [ ] Demo video (Loom)
- [ ] Case study PME
- [ ] SEO content
- [ ] LinkedIn ads

---

## 🚀 Timeline Réaliste

**Semaine 1-2**: Intégrations comptables (Agicap + Pennylane)  
**Semaine 3-4**: Agent LLM autonome (insights + recommandations)  
**Semaine 5**: Email automation (préparation + validation)  
**Semaine 6**: Dashboard production  
**Semaine 7**: Tests + monitoring  
**Semaine 8**: Go-live production 🎉

**Date cible MVP**: 28 mars 2026

---

## 📊 Métriques de Succès

### Adoption
- 10 early adopters (M1)
- 50 clients payants (M3)
- 200 clients (M6)

### Engagement
- 80%+ taux validation actions agent
- 60%+ amélioration DSO
- 4.5+ score satisfaction

### Financier
- MRR 10K€ (M3)
- MRR 30K€ (M6)
- Break-even (M8)

---

## 🎯 Next Steps Immédiats

1. **Choisir intégration prioritaire**: Pennylane ou Agicap?
2. **Tester OpenRouter**: Claude 3.5 vs GPT-4 pour insights
3. **Créer premier email template**: ClientReminderEmail
4. **Setup monitoring**: PostHog events pour agent actions
5. **Pricing page**: Ajouter plan "Agent Autonome"

**Question stratégique**: On commence par quelle intégration?  
- **Pennylane** = Plus de PME françaises  
- **Agicap** = Spécialistes trésorerie (meilleur fit produit)

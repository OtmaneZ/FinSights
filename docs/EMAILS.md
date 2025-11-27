# 📧 Email System - FinSight

Système d'emails transactionnels avec **Resend** et **React Email**.

## 📦 Templates disponibles

### 1. Welcome Email (Bienvenue)

**Trigger:** Lors de la création de compte (signup)

**Contenu:**

- Message de bienvenue personnalisé
- Lien vers le dashboard
- Liste des fonctionnalités disponibles
- CTA "Accéder au dashboard"

**Variables:**

```typescript
{
  to: string
  userName: string
  userEmail: string
}
```

---

### 2. Upgrade Success Email (Confirmation d'upgrade)

**Trigger:** Après un paiement Stripe réussi (checkout.session.completed)

**Contenu:**

- Confirmation du passage au plan PRO ou SCALE
- Détails de facturation (montant, prochain paiement)
- Liste des nouvelles fonctionnalités débloquées
- CTA "Découvrir mes nouvelles fonctionnalités"

**Variables:**

```typescript
{
  to: string
  userName: string
  plan: 'PRO' | 'SCALE'
  amount: number
  nextBillingDate: string
}
```

---

### 3. Payment Failed Email (Échec de paiement)

**Trigger:** Quand un paiement Stripe échoue (invoice.payment_failed)

**Contenu:**

- Alerte échec de paiement
- Raisons possibles (carte expirée, fonds insuffisants)
- Timeline de désactivation (7 jours de grâce)
- CTA "Mettre à jour mon paiement"
- Lien vers la facture

**Variables:**

```typescript
{
  to: string
  userName: string
  plan: 'PRO' | 'SCALE'
  amount: number
  invoiceUrl: string
}
```

---

### 4. Usage Alert Email (Alerte de quota)

**Trigger:** Quand un utilisateur atteint 80% ou 90% de son quota

**Contenu:**

- Indicateur de quota (barre de progression)
- Détails d'utilisation (8/10 requêtes IA)
- Suggestions d'upgrade selon le plan actuel
- CTA adapté au plan (Passer à PRO/SCALE/ENTERPRISE)

**Variables:**

```typescript
{
  to: string
  userName: string
  plan: 'FREE' | 'PRO' | 'SCALE'
  resource: 'copilot_queries' | 'api_calls' | 'storage'
  currentUsage: number
  limit: number
  percentage: number
}
```

**Logique d'alerte:**

- FREE (copilot_queries): Suggère PRO (illimité)
- PRO (storage): Suggère SCALE (stockage premium)
- SCALE (api_calls): Suggère ENTERPRISE (quota custom)

---

## 🚀 Setup

### 1. Installer les dépendances

```bash
npm install resend react-email @react-email/components
```

### 2. Configurer Resend API Key

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Obtenir une clé API Resend

1. Créer un compte sur [resend.com](https://resend.com)
2. Vérifier votre domaine (ou utiliser `onboarding@resend.dev` pour les tests)
3. Générer une API Key dans Settings > API Keys

---

## 🧪 Tester les emails

```bash
# Test avec email par défaut
npx tsx scripts/test-emails.ts

# Test avec votre email
TEST_EMAIL=votre@email.com npx tsx scripts/test-emails.ts
```

Le script envoie 7 emails de test :

1. Welcome Email
2. Upgrade PRO
3. Upgrade SCALE
4. Payment Failed
5. Usage Alert 80% (FREE)
6. Usage Alert 90% (FREE - rouge)
7. Usage Alert 85% API (SCALE)

---

## 📝 Utilisation dans le code

### Exemple 1: Signup

```typescript
import { sendWelcomeEmail } from '@/lib/emails/emailService'

const user = await prisma.user.create({ ... })

await sendWelcomeEmail({
  to: user.email,
  userName: user.name || 'Utilisateur',
  userEmail: user.email
})
```

### Exemple 2: Stripe Webhook

```typescript
import { sendUpgradeSuccessEmail } from '@/lib/emails/emailService'

// Dans checkout.session.completed
await sendUpgradeSuccessEmail({
  to: user.email,
  userName: user.name || 'Utilisateur',
  plan: 'PRO',
  amount: 79,
  nextBillingDate: '27/12/2025'
})
```

### Exemple 3: Rate Limiting

```typescript
import { sendUsageAlertEmail } from '@/lib/emails/emailService'

// Quand l'utilisateur atteint 80% de son quota
if (percentage >= 80) {
  await sendUsageAlertEmail({
    to: user.email,
    userName: user.name,
    plan: user.plan,
    resource: 'copilot_queries',
    currentUsage: 8,
    limit: 10,
    percentage: 80
  })
}
```

---

## 🎨 Personnaliser les templates

Les templates sont des composants React dans `/src/lib/emails/templates/`.

**Structure d'un template:**

```tsx
import { Html, Head, Body, Container, Button } from '@react-email/components'

export const MyEmail = ({ userName }: { userName: string }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <h1>Bonjour {userName}</h1>
        <Button href="https://..." style={button}>
          Call to Action
        </Button>
      </Container>
    </Body>
  </Html>
)
```

**Design System:**

- Background: `#f0f2f5` (gris clair)
- Surface: `#ffffff` (blanc)
- Primary: `#0078d4` (bleu FinSight)
- Text: `#212529` (noir)
- Secondary: `#6c757d` (gris)
- Danger: `#dc3545` (rouge)
- Warning: `#ffc107` (jaune)
- Success: `#28a745` (vert)

---

## 📊 Métriques Resend

Dashboard Resend affiche :

- ✅ Delivered (emails livrés)
- 📬 Opened (taux d'ouverture)
- 🔗 Clicked (clics sur CTA)
- ❌ Bounced (rebonds)
- 🚫 Complained (spam)

**Accès:** [resend.com/dashboard](https://resend.com/dashboard)

---

## ⚠️ Limites FREE Resend

- 100 emails/jour
- 3 000 emails/mois
- Domaine onboarding uniquement

**Pour production:**

- Vérifier votre domaine custom
- Passer au plan PRO (20$/mois) pour 50k emails/mois

---

## 🔒 Sécurité

### Email spoofing

- Utiliser un domaine vérifié avec SPF/DKIM
- Ne jamais exposer la RESEND_API_KEY côté client

### Fail-safe

- Tous les emails sont en `.catch()` pour ne pas bloquer l'API
- Logs explicites en console pour debug

### Rate limiting

- Resend limite automatiquement les envois abusifs
- Vérifier `isEmailEnabled()` avant chaque envoi

---

## 📚 Ressources

- [Resend Docs](https://resend.com/docs)
- [React Email](https://react.email)
- [Email Components](https://react.email/docs/components/button)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

---

## ✅ Checklist Déploiement

- [ ] Ajouter `RESEND_API_KEY` dans Vercel
- [ ] Vérifier domaine custom dans Resend
- [ ] Tester avec `scripts/test-emails.ts`
- [ ] Vérifier délivrabilité (inbox, spam folder)
- [ ] Monitorer dashboard Resend pendant 48h
- [ ] Configurer alertes Resend (bounce rate > 5%)

---

**Fait avec ❤️ par l'équipe FinSight**

# Posthog Analytics - Documentation

## Overview

FinSight utilise **Posthog** pour tracker les événements utilisateurs et analyser les comportements.

**Événements trackés :**

- ✅ `user.signup` - Inscription utilisateur
- ✅ `dashboard.upload` - Upload de fichier
- ✅ `ai.analysis_requested` - Requête IA Copilot
- ✅ `file.export` - Export PDF/Excel
- ✅ `plan.upgrade_clicked` - Clic sur upgrade PRO/SCALE
- ✅ `company.created` - Création entreprise
- ✅ `api_key.generated` - Génération clé API
- ✅ `webhook.created` - Création webhook

---

## Configuration

### 1. Variables d'environnement

Ajoutez dans `.env.local` :

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 2. Obtenir une clé Posthog

1. Créez un compte sur [posthog.com](https://posthog.com)
2. Créez un nouveau projet
3. Copiez votre **Project API Key** (format `phc_xxx`)

---

## Utilisation dans le code

### Wrapper layout.tsx

Le `PosthogProvider` est déjà intégré dans `/src/app/layout.tsx` :

```tsx
import { PosthogProvider } from '@/lib/posthog';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PosthogProvider>
          {children}
        </PosthogProvider>
      </body>
    </html>
  );
}
```

### Tracking d'événements

Importez `analytics` depuis `/lib/posthog.tsx` :

```tsx
import { analytics } from '@/lib/posthog';

// Track signup
analytics.trackSignup('user@example.com', 'PRO');

// Track upload
analytics.trackUpload('compta-q4.csv', 124567, 'comp_abc');

// Track AI analysis
analytics.trackAIAnalysis('dash_xyz', 'Quel est mon cash flow ?');

// Track export
analytics.trackExport('pdf', 'dash_xyz');

// Track upgrade click
analytics.trackUpgradeClick('FREE', 'PRO');

// Identify user (after login)
analytics.identifyUser('user@example.com', {
  plan: 'PRO',
  company: 'Startup Inc.',
});

// Reset (after logout)
analytics.reset();
```

---

## Événements trackés par défaut

### 1. Pageviews

Automatiquement trackés par `PosthogProvider` :

```tsx
posthog.capture('$pageview', {
  $current_url: window.location.href,
});
```

### 2. User Signup

Fichier : `/src/app/auth/signup/page.tsx`

```tsx
analytics.trackSignup(email, 'FREE');
analytics.identifyUser(email, {
  email,
  plan: 'FREE',
  signupDate: new Date().toISOString(),
});
```

### 3. Dashboard Upload

Fichier : `/src/components/EmptyDashboardStateV2.tsx`

```tsx
analytics.trackUpload(file.name, file.size, activeCompanyId);
```

### 4. AI Analysis

Fichier : `/src/components/AICopilot.tsx`

```tsx
analytics.trackAIAnalysis(dashboardId, userQuery);
```

### 5. File Export

Fichier : `/src/components/FinancialDashboardV2.tsx`

```tsx
analytics.trackExport('pdf', dashboardId);
```

### 6. Upgrade Click

Fichier : `/src/components/PricingCard.tsx`

```tsx
analytics.trackUpgradeClick(currentPlan, targetPlan);
```

---

## Dashboard Analytics

### Page Admin

URL : `/dashboard/analytics`

**Accès :** Réservé aux utilisateurs `ENTERPRISE` (admin).

**Métriques affichées :**

- Inscriptions totales
- Uploads totaux
- Requêtes IA
- Exports (PDF/Excel)
- Clics Upgrade
- Utilisateurs actifs

**Visualisations :**

- Event timeline (événements récents)
- Conversion funnel (Homepage → Signup → Upload → IA → Upgrade)
- Stats par plan (FREE/PRO/SCALE)

---

## Posthog Features

### 1. Session Recording

Enregistre les sessions utilisateurs (optionnel) :

```tsx
posthog.init(POSTHOG_KEY, {
  session_recording: {
    enabled: true,
    recordCrossOriginIframes: true,
  }
});
```

### 2. Feature Flags

Test A/B et feature toggles :

```tsx
const showNewDashboard = posthog.isFeatureEnabled('new-dashboard-v2');

if (showNewDashboard) {
  return <NewDashboard />;
} else {
  return <OldDashboard />;
}
```

### 3. Surveys

Questionnaires in-app :

```tsx
posthog.capture('survey_shown', {
  survey_id: 'nps-score',
});
```

---

## Exemples avancés

### Track custom events

```tsx
posthog.capture('custom_event', {
  property1: 'value1',
  property2: 123,
});
```

### Group analytics (par entreprise)

```tsx
posthog.group('company', 'comp_abc', {
  name: 'Startup Inc.',
  plan: 'PRO',
  mrr: 199,
});
```

### Track errors

```tsx
try {
  // Code qui peut échouer
} catch (error) {
  posthog.capture('error', {
    error_message: error.message,
    error_stack: error.stack,
  });
}
```

---

## Intégrations tierces

### Slack notifications

Configurez un webhook Posthog → Slack pour recevoir des notifications :

```
Événement: plan.upgrade_clicked
→ Slack #sales: "🚀 Nouveau lead PRO : user@example.com"
```

### CRM sync (Hubspot, Salesforce)

Utilisez les webhooks Posthog pour synchroniser les événements :

```javascript
// Posthog webhook endpoint
app.post('/webhooks/posthog', async (req, res) => {
  const { event, properties } = req.body;

  if (event === 'user.signup') {
    // Create contact in Hubspot
    await createHubspotContact(properties.email);
  }

  res.status(200).send('OK');
});
```

---

## Best Practices

### ✅ Bonnes pratiques

- Identifiez les utilisateurs dès la connexion
- Trackez les événements clés (signup, upload, upgrade)
- Utilisez des noms d'événements cohérents (`snake_case`)
- Ajoutez des propriétés contextuelles (plan, company, timestamp)
- Réinitialisez Posthog à la déconnexion (`analytics.reset()`)

### ❌ À éviter

- Tracker des données sensibles (mots de passe, tokens)
- Envoyer trop d'événements (rate limiting)
- Utiliser des noms d'événements génériques (`click`, `action`)
- Oublier de tester en développement

---

## Privacy & GDPR

### Anonymisation

Posthog supporte l'anonymisation des IPs :

```tsx
posthog.init(POSTHOG_KEY, {
  ip: false, // Don't track IP addresses
});
```

### Opt-out

Permettre aux utilisateurs de refuser le tracking :

```tsx
// Opt-out
posthog.opt_out_capturing();

// Opt-in
posthog.opt_in_capturing();
```

### Cookie consent

Intégration avec `CookieConsent.tsx` :

```tsx
if (cookieConsent.analytics) {
  posthog.opt_in_capturing();
} else {
  posthog.opt_out_capturing();
}
```

---

## Troubleshooting

### Événements non trackés

1. Vérifiez que `NEXT_PUBLIC_POSTHOG_KEY` est défini
2. Ouvrez la console navigateur → Network → Filtrer `posthog`
3. Vérifiez que les requêtes sont envoyées à `app.posthog.com`

### Sessions non enregistrées

1. Activez `session_recording` dans la config Posthog
2. Vérifiez que le plan Posthog supporte les recordings

### Dashboard vide

1. Attendez quelques minutes (latence Posthog ~5 min)
2. Vérifiez que les événements sont bien capturés (Console Posthog)
3. Vérifiez les filtres de date dans le dashboard

---

## Limites & Quotas

### Posthog Free Plan

- 1M événements/mois gratuits
- Session recordings illimités
- Feature flags illimités

### Posthog Paid Plans

- À partir de $0.00031/événement après 1M
- Recordings additionnels payants
- Support prioritaire

---

## Ressources

- 📚 Documentation officielle : [posthog.com/docs](https://posthog.com/docs)
- 🎓 Tutorials : [posthog.com/tutorials](https://posthog.com/tutorials)
- 💬 Community Slack : [posthog.com/slack](https://posthog.com/slack)
- 📧 Support : <support@posthog.com>

# 🚀 GUIDE DÉPLOIEMENT PRODUCTION-READY - FINSIGHTS

**Date:** 18 décembre 2025
**Version:** 1.0.0
**Objectif:** Checklist complète pour déploiement production sécurisé

---

## ✅ RÉSUMÉ DES AMÉLIORATIONS

### Tests Automatisés
- ✅ **Tests Jest** : Formules financières critiques (DSO, BFR, marges)
- ✅ **Tests Jest** : Parsing CSV (formats FR/US, séparateurs, débit/crédit)
- ✅ **Tests E2E Playwright** : Workflow upload → score → dashboard

### Sécurité Renforcée
- ✅ **API Keys hachées** : SHA-256 en base de données (migration Prisma)
- ✅ **CSP Headers** : Content Security Policy anti-XSS (déjà configuré ✨)
- ✅ **CORS Whitelist** : Protection CSRF avec domaines autorisés

### Monitoring Production
- ✅ **Sentry Client** : Monitoring erreurs frontend
- ✅ **Sentry Server** : Monitoring erreurs API routes
- ✅ **Sentry Edge** : Monitoring middleware

---

## 📦 INSTALLATION & CONFIGURATION

### 1. Installer les Dépendances

```bash
# Tests
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest ts-jest @playwright/test

# Monitoring
npm install --save @sentry/nextjs
```

### 2. Mettre à Jour `.env.local`

```bash
# Sentry (obligatoire production)
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# App URL (CORS)
NEXT_PUBLIC_APP_URL="https://finsight.zineinsight.com"
```

### 3. Migration Base de Données (API Keys Sécurisées)

```bash
# Générer migration Prisma
npx prisma migrate dev --name hash_api_keys

# Appliquer en production
npx prisma migrate deploy
```

⚠️ **IMPORTANT** : Les anciennes API keys en clair seront invalidées. Les utilisateurs devront régénérer leurs clés.

---

## 🧪 LANCER LES TESTS

### Tests Unitaires (Jest)

```bash
# Mode watch (développement)
npm run test

# CI/CD avec coverage
npm run test:ci

# Coverage attendu : ~70% sur calculs critiques
```

**Fichiers testés** :
- `src/lib/financialFormulas.ts` → DSO, marges, cash-flow
- `src/lib/dataParser.ts` → Validation CSV, formats
- `src/lib/scoring/finSightScore.ts` → Score 0-100, breakdown

### Tests E2E (Playwright)

```bash
# Lancer les tests
npm run test:e2e

# Mode UI (debug)
npm run test:e2e:ui
```

**Scénarios testés** :
1. Upload CSV → Score affiché → Dashboard visible
2. Erreur CSV invalide (< 10 transactions)
3. Export PDF fonctionne
4. Copilot IA répond aux questions

---

## 🔒 CHECKLIST SÉCURITÉ

### Avant Déploiement Production

- [ ] **Variables d'environnement** :
  - [ ] `NEXTAUTH_SECRET` généré avec `openssl rand -base64 32`
  - [ ] `DATABASE_URL` pointe vers Postgres production
  - [ ] `OPENAI_API_KEY` configurée (OpenRouter)
  - [ ] `STRIPE_SECRET_KEY` en mode live (pas test)
  - [ ] `NEXT_PUBLIC_SENTRY_DSN` configuré

- [ ] **Base de Données** :
  - [ ] Migration Prisma appliquée (`prisma migrate deploy`)
  - [ ] Backup automatique configuré
  - [ ] Indexes optimisés (`@@index` dans schema.prisma)

- [ ] **API Keys** :
  - [ ] Anciennes clés révoquées (`revoked: true`)
  - [ ] Nouvelles clés générées avec `generateAPIKey()` (hash SHA-256)
  - [ ] Documentation utilisateurs mise à jour

- [ ] **Headers Sécurité** :
  - [ ] CSP configuré (✅ déjà dans `next.config.js`)
  - [ ] `X-Frame-Options: SAMEORIGIN` (✅)
  - [ ] `X-Content-Type-Options: nosniff` (✅)

- [ ] **Rate Limiting** :
  - [ ] Redis KV configuré (Vercel KV ou Upstash)
  - [ ] Limites testées (FREE: 10/j, PRO: illimité)

---

## 📊 MONITORING & ALERTES

### Configuration Sentry

#### 1. Créer Projet Sentry

1. Aller sur [sentry.io](https://sentry.io)
2. Créer nouveau projet "finsights-production"
3. Copier DSN → `.env.local`

#### 2. Alertes Recommandées

Configurer dans Sentry → **Alerts** :

| Alerte | Seuil | Action |
|--------|-------|--------|
| **Taux d'erreur > 5%** | 1 heure | Slack + Email |
| **Erreur critique** | Immédiat | PagerDuty |
| **Latence API > 3s** | 10min | Slack |
| **Parsing échec > 20%** | 30min | Email |

#### 3. Dashboards Sentry

Créer dashboards personnalisés :

- **Errors Dashboard** : Erreurs par type, fréquence, users impactés
- **Performance** : P50/P95/P99 latences API
- **Business Metrics** : Uploads/jour, scores calculés, copilot queries

### Logs Vercel

```bash
# CLI Vercel
vercel logs <project-name> --since 1h
vercel logs <project-name> --follow

# Filtrer erreurs critiques
vercel logs <project-name> | grep "ERROR"
```

---

## 🧬 MIGRATION API KEYS (PRODUCTION)

### Script de Migration

Créer fichier `scripts/migrate-api-keys.ts` :

```typescript
import { prisma } from '@/lib/prisma';
import { hashAPIKey } from '@/lib/apiKeySecurity';

async function migrateAPIKeys() {
    console.log('🔐 Migration API Keys → Hash SHA-256...');

    // 1. Récupérer toutes les clés existantes
    const oldKeys = await prisma.apiKey.findMany();

    if (oldKeys.length === 0) {
        console.log('✅ Aucune clé à migrer');
        return;
    }

    console.log(`📊 ${oldKeys.length} clés à migrer`);

    // 2. Pour chaque clé, créer hash et prefix
    for (const oldKey of oldKeys) {
        const hashedKey = hashAPIKey(oldKey.key);
        const prefix = oldKey.key.substring(0, 8);

        await prisma.apiKey.update({
            where: { id: oldKey.id },
            data: {
                keyHash: hashedKey,
                prefix,
            },
        });

        console.log(`✅ Migré: ${oldKey.name} (${prefix}...)`);
    }

    console.log('🎉 Migration terminée !');
}

migrateAPIKeys()
    .catch((e) => {
        console.error('❌ Erreur migration:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
```

Exécuter :

```bash
npx tsx scripts/migrate-api-keys.ts
```

---

## 📈 TESTS DE CHARGE (OPTIONNEL)

### k6 Load Testing

Installer [k6](https://k6.io/docs/getting-started/installation/) :

```bash
# macOS
brew install k6

# Linux
sudo apt-get install k6
```

Créer `tests/load/upload-test.js` :

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 10, // 10 utilisateurs virtuels
    duration: '30s',
};

export default function () {
    const url = 'https://finsight.zineinsight.com/api/dashboards/upload';
    const file = open('./public/demo-data.csv');

    const data = {
        file: http.file(file, 'demo-data.csv'),
    };

    const res = http.post(url, data);

    check(res, {
        'status 200': (r) => r.status === 200,
        'parse time < 5s': (r) => r.timings.duration < 5000,
    });
}
```

Lancer test :

```bash
k6 run tests/load/upload-test.js
```

---

## 🎯 CHECKLIST PRÉ-PRODUCTION

### Phase 1 : Tests

- [ ] Tous les tests Jest passent (`npm run test:ci`)
- [ ] Tests E2E Playwright passent (`npm run test:e2e`)
- [ ] Coverage ≥ 70% sur calculs critiques
- [ ] Aucun warning TypeScript (`npm run typecheck`)

### Phase 2 : Sécurité

- [ ] API keys migrées vers hashes SHA-256
- [ ] CSP headers vérifiés (Chrome DevTools → Network → Headers)
- [ ] CORS testé avec domaines externes
- [ ] Rate limiting testé (FREE: 10 copilot/jour)

### Phase 3 : Monitoring

- [ ] Sentry DSN configuré
- [ ] Alertes Sentry actives (Slack webhook)
- [ ] Logs Vercel accessibles
- [ ] Dashboards PostHog configurés

### Phase 4 : Performance

- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices)
- [ ] Time to Interactive < 3s
- [ ] First Contentful Paint < 1.5s
- [ ] API latency P95 < 500ms

---

## 🚨 TROUBLESHOOTING

### Tests Jest échouent

**Erreur** : `Cannot find module '@/lib/...'`

**Solution** :

```bash
# Vérifier jest.config.ts
moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Playwright ne trouve pas les éléments

**Erreur** : `Timeout waiting for selector`

**Solution** :

```typescript
// Augmenter timeout
await expect(element).toBeVisible({ timeout: 15000 });

// Utiliser data-testid
<button data-testid="upload-btn">Upload</button>
await page.click('[data-testid="upload-btn"]');
```

### Sentry ne capture pas les erreurs

**Vérification** :

```bash
# Tester manuellement
import * as Sentry from '@sentry/nextjs';
Sentry.captureException(new Error('Test error'));
```

---

## 📚 RESSOURCES

### Documentation
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [Playwright E2E](https://playwright.dev/docs/intro)
- [Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

### Support
- **Slack** : #finsights-dev
- **Email** : dev@finsights.app
- **Status Page** : [status.finsights.app](https://status.finsights.app)

---

## 🎉 DÉPLOIEMENT FINAL

```bash
# 1. Vérifier tout est prêt
npm run check
npm run test:ci

# 2. Build production
npm run build

# 3. Déployer sur Vercel
vercel --prod

# 4. Vérifier santé
curl https://finsight.zineinsight.com/api/health

# 5. Monitorer Sentry
# → Vérifier 0 erreur dans les 10 premières minutes
```

---

**✅ FinSights est maintenant production-ready !**

*Dernière mise à jour : 18 décembre 2025*

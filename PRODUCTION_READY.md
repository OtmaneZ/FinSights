# 🚀 FinSights - Tests & Sécurité Production

Ce fichier documente les **tests automatisés** et **améliorations sécurité** implémentés pour rendre FinSights production-ready.

---

## ✅ CE QUI A ÉTÉ IMPLÉMENTÉ

### 1. Tests Automatisés Ciblés

#### Tests Jest (Calculs Financiers)
- ✅ **`__tests__/financialFormulas.test.ts`** : Formules critiques (DSO, marges, cash-flow)
- ✅ **`__tests__/dataParser.test.ts`** : Parsing CSV (formats FR/US, séparateurs, validation)
- ✅ **`__tests__/finSightScore.test.ts`** : Score FinSight™ 0-100 + breakdown

#### Tests E2E (Playwright)
- ✅ **`e2e/upload-workflow.spec.ts`** : Workflow complet upload → score → dashboard
- ✅ Scénarios : upload valide, erreur CSV invalide, export PDF, Copilot IA

### 2. Sécurité Renforcée

#### API Keys Hachées (SHA-256)
- ✅ **`src/lib/apiKeySecurity.ts`** : Hash, génération, vérification API keys
- ✅ **`src/lib/middleware/apiKeyAuth.ts`** : Middleware validation hashes
- ✅ **Migration Prisma** : Schéma mis à jour (`keyHash`, `prefix`, `revoked`, `expiresAt`)

#### Headers Sécurité
- ✅ **CSP (Content Security Policy)** : Déjà configuré dans `next.config.js` ✨
- ✅ **`src/lib/middleware/cors.ts`** : CORS avec whitelist domaines

### 3. Monitoring Production

#### Sentry
- ✅ **`sentry.client.config.ts`** : Monitoring frontend
- ✅ **`sentry.server.config.ts`** : Monitoring backend/API
- ✅ **`sentry.edge.config.ts`** : Monitoring middleware

---

## 🧪 LANCER LES TESTS

### Installation Dépendances

```bash
npm install
```

### Tests Unitaires (Jest)

```bash
# Mode watch (développement)
npm run test

# CI/CD avec coverage
npm run test:ci
```

**Couverture attendue** : ~70% sur calculs métier critiques

### Tests E2E (Playwright)

```bash
# Lancer tests
npm run test:e2e

# Mode UI (debug visuel)
npm run test:e2e:ui
```

**Prérequis** : Serveur Next.js démarre automatiquement sur `localhost:3000`

---

## 🔐 MIGRATION API KEYS (PRODUCTION)

### Étapes

1. **Mettre à jour schéma Prisma** (✅ déjà fait)

2. **Créer migration**

```bash
npx prisma migrate dev --name hash_api_keys
```

3. **Appliquer en production**

```bash
npx prisma migrate deploy
```

4. **Migrer clés existantes** (script fourni dans `PRODUCTION_READY_GUIDE.md`)

⚠️ **Important** : Les anciennes API keys en clair seront invalidées. Prévenez les utilisateurs de régénérer leurs clés.

---

## 📊 CONFIGURATION SENTRY

### 1. Créer Projet Sentry

1. Aller sur [sentry.io](https://sentry.io)
2. Créer projet "finsights-production"
3. Copier DSN

### 2. Ajouter à `.env.local`

```bash
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### 3. Vérifier Capture Erreurs

```typescript
import * as Sentry from '@sentry/nextjs';

// Test manuel
Sentry.captureException(new Error('Test error'));
```

---

## 🛡️ CHECKLIST PRÉ-DÉPLOIEMENT

### Tests
- [ ] `npm run test:ci` passe (Jest)
- [ ] `npm run test:e2e` passe (Playwright)
- [ ] `npm run typecheck` OK (TypeScript)
- [ ] `npm run lint` OK (ESLint)

### Sécurité
- [ ] API keys migrées vers SHA-256
- [ ] Sentry DSN configuré
- [ ] CSP headers vérifiés (DevTools → Network)
- [ ] CORS testé avec domaines externes

### Performance
- [ ] Lighthouse score > 90
- [ ] Time to Interactive < 3s
- [ ] API latency P95 < 500ms

---

## 📚 DOCUMENTATION COMPLÈTE

Voir **`docs/PRODUCTION_READY_GUIDE.md`** pour :
- Checklist sécurité détaillée
- Configuration Sentry alertes
- Tests de charge (k6)
- Troubleshooting

---

## 🎯 OBJECTIF ATTEINT

FinSights est maintenant **production-ready** avec :

- ✅ Tests automatisés sur **calculs métier critiques**
- ✅ Sécurité renforcée (SHA-256, CSP, CORS)
- ✅ Monitoring production (Sentry + alertes)

**Sans sur-ingénierie** : focus pragmatique sur fiabilité métier.

---

**Date** : 18 décembre 2025
**Version** : 1.0.0

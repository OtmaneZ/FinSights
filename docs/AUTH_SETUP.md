# 🔐 AUTH + PRISMA + STRIPE - SETUP GUIDE

**Status**: ✅ Code créé et prêt
**Prochaines étapes**: Installation packages + Configuration BDD + Tests

---

## 📦 1. INSTALLATION PACKAGES

```bash
# Installer les dépendances
npm install next-auth @prisma/client bcryptjs stripe @stripe/stripe-js

# Installer les dev dependencies
npm install -D prisma @types/bcryptjs

# Initialiser Prisma (déjà fait, schema.prisma créé)
npx prisma generate
```

---

## 🗄️ 2. CONFIGURATION DATABASE (Vercel Postgres)

### Option A : Via Vercel Dashboard (recommandé)

1. Aller sur <https://vercel.com/otmanez/finsights>
2. Storage → Create Database → Postgres
3. Copier `DATABASE_URL` dans `.env.local`

### Option B : Via CLI Vercel

```bash
vercel link
vercel env pull .env.local
vercel postgres create finsights-db
```

### Après setup BDD

```bash
# Créer les tables
npx prisma db push

# Ou avec migrations (prod)
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate
```

---

## 🔑 3. CONFIGURATION NEXT-AUTH

### Générer NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Ajouter dans `.env.local`

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<généré-ci-dessus>
```

---

## 💳 4. CONFIGURATION STRIPE

### 4.1 Créer compte Stripe Test

1. <https://dashboard.stripe.com/register>
2. Mode Test activé (toggle en haut à droite)

### 4.2 Récupérer les clés

1. Developers → API Keys
2. Copier :
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

### 4.3 Créer les produits & prix

```javascript
// Dans Stripe Dashboard :
Products → Create Product

PRODUIT 1 : FinSight Pro
- Prix 1 : 79€/mois (price_xxx) → NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY
- Prix 2 : 758€/an (price_yyy) → NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY

PRODUIT 2 : FinSight Scale
- Prix 1 : 199€/mois (price_zzz) → NEXT_PUBLIC_STRIPE_PRICE_SCALE_MONTHLY
- Prix 2 : 1910€/an (price_aaa) → NEXT_PUBLIC_STRIPE_PRICE_SCALE_YEARLY
```

### 4.4 Configurer Webhooks (local dev)

```bash
# Installer Stripe CLI
brew install stripe/stripe-brew/stripe

# Login
stripe login

# Forward webhooks vers local
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copier le webhook secret (whsec_xxx) → STRIPE_WEBHOOK_SECRET
```

### 4.5 Webhooks (production)

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint : `https://finsight.zineinsight.com/api/stripe/webhook`
3. Select events :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copier `Signing secret` → `STRIPE_WEBHOOK_SECRET` (prod)

---

## ✅ 5. VÉRIFICATION

### Test 1 : Base de données

```bash
npx prisma studio
# Ouvre interface GUI → http://localhost:5555
```

### Test 2 : Signup API

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@exemple.com","password":"password123","name":"Test User"}'
```

Réponse attendue :

```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "id": "clxxx",
    "email": "test@exemple.com",
    "name": "Test User",
    "plan": "FREE",
    "createdAt": "2025-11-27T..."
  }
}
```

### Test 3 : Signin (Next-Auth)

1. Aller sur <http://localhost:3000/auth/signin>
2. Login avec email/password créé
3. Devrait rediriger vers `/dashboard`

### Test 4 : Stripe Checkout (après login)

```bash
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"priceId":"price_xxx"}'
```

Réponse attendue :

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

## 🐛 6. DEBUGGING

### Prisma ne trouve pas la BDD

```bash
# Vérifier DATABASE_URL
echo $DATABASE_URL

# Re-générer le client
npx prisma generate

# Reset BDD (⚠️ supprime les données)
npx prisma migrate reset
```

### Next-Auth erreurs

```bash
# Vérifier NEXTAUTH_SECRET est défini
echo $NEXTAUTH_SECRET

# Vérifier NEXTAUTH_URL
echo $NEXTAUTH_URL

# Logs détaillés
# Ajouter dans [...nextauth]/route.ts :
debug: process.env.NODE_ENV === 'development'
```

### Stripe webhooks ne marchent pas

```bash
# Mode dev : Stripe CLI doit être actif
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Vérifier signature
# Dans webhook route, logger : console.log('Signature:', signature)
```

---

## 📁 7. FICHIERS CRÉÉS

```
✅ prisma/
   └── schema.prisma (User, Company, Dashboard, ApiKey models)

✅ src/lib/
   ├── prisma.ts (Prisma Client singleton)
   └── stripe.ts (Stripe config + helpers)

✅ src/types/
   └── next-auth.d.ts (TypeScript types extensions)

✅ src/app/api/auth/
   ├── [...nextauth]/route.ts (Next-Auth config)
   └── signup/route.ts (Signup endpoint)

✅ src/app/api/stripe/
   ├── checkout/route.ts (Créer session checkout)
   └── webhook/route.ts (Gérer événements Stripe)

✅ middleware.ts (Protection routes authentifiées)

✅ .env.example (Variables d'env complètes)
```

---

## 🚀 8. PROCHAINES ÉTAPES

### Frontend à créer (ton côté)

- [ ] `/auth/signin/page.tsx` (Page login)
- [ ] `/auth/signup/page.tsx` (Page signup)
- [ ] `/pricing/page.tsx` (Page pricing avec boutons Stripe)
- [ ] Component `<UpgradeButton />` (Trigger checkout)
- [ ] Component `<UserMenu />` (Afficher plan actuel)

### Tests E2E

- [ ] Test signup → login → dashboard
- [ ] Test upgrade PRO → webhook → plan updated
- [ ] Test subscription cancel → downgrade FREE

---

## 💾 9. COMMANDES UTILES

```bash
# Prisma Studio (GUI BDD)
npx prisma studio

# Voir les migrations
npx prisma migrate status

# Générer client après modif schema
npx prisma generate

# Reset BDD (dev uniquement)
npx prisma migrate reset

# Stripe CLI
stripe listen
stripe trigger payment_intent.succeeded

# Logs Vercel (prod)
vercel logs
```

---

## 🎯 ARCHITECTURE FLOW

```
User signup
  → POST /api/auth/signup
  → Bcrypt hash password
  → Prisma.user.create()
  → Return user (sans password)

User login
  → Next-Auth CredentialsProvider
  → Verify email + password
  → Generate JWT token
  → Store in cookie (httpOnly)

User upgrade
  → POST /api/stripe/checkout
  → Verify session (Next-Auth)
  → stripe.checkout.sessions.create()
  → Redirect to Stripe Checkout
  → User pays
  → Stripe webhook POST /api/stripe/webhook
  → Event: checkout.session.completed
  → Prisma.user.update({ plan: 'PRO', stripeCustomerId, ... })
  → Email confirmation (TODO)
```

---

## ✅ CHECKLIST DÉPLOIEMENT PROD

### Avant push

- [ ] `.env.local` → `.gitignore` ✅
- [ ] `DATABASE_URL` configuré (Vercel Postgres)
- [ ] `NEXTAUTH_SECRET` généré (nouveau, pas celui de dev)
- [ ] Stripe mode LIVE (pas test)
- [ ] Webhook Stripe pointe vers prod URL
- [ ] `npx prisma migrate deploy` (sur prod)

### Après déploiement

- [ ] Test signup prod
- [ ] Test login prod
- [ ] Test payment Stripe (vraie carte ou test)
- [ ] Vérifier webhook reçu (Stripe Dashboard → Developers → Webhooks)
- [ ] Vérifier plan updated dans BDD (Prisma Studio ou SQL)

---

**🔥 CODE PRÊT À L'EMPLOI !**

Tous les fichiers backend Auth + Prisma + Stripe sont créés.
Il manque juste :

1. Installer les packages (`npm install`)
2. Configurer les env vars
3. Setup BDD Vercel Postgres
4. Créer les pages frontend signin/signup/pricing

**Questions ?** Ping moi ! 🚀

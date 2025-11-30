# 🧪 User Workflow Test - FinSight V3

**Date**: 30 Novembre 2025
**Objectif**: Vérifier le parcours utilisateur complet (signup → dashboard → save → logout → login → reload)

---

## ✅ 1. SIGNUP (Création de compte)

### **Route**: `/auth/signup`

**Flow**:

1. User remplit formulaire:
   - Nom complet
   - Email professionnel
   - Mot de passe (min 8 caractères)
   - Confirmation mot de passe
2. Validation côté client:
   - ✅ Passwords match
   - ✅ Email valide
   - ✅ Password >= 8 chars
3. POST `/api/auth/signup`:

   ```json
   {
     "name": "Jean Dupont",
     "email": "jean@entreprise.com",
     "password": "motdepasse123"
   }
   ```

4. Backend:
   - ✅ Hash password (bcryptjs)
   - ✅ Create user in DB (Prisma)
   - ✅ Default plan: `FREE`
5. Auto-login après signup:
   - ✅ `signIn('credentials')` automatique
   - ✅ JWT token créé (session 30 jours)
6. Redirect: `/dashboard?welcome=true`

**Comportement attendu**:

- ✅ Compte créé avec plan FREE
- ✅ Session active immédiatement
- ✅ Redirection dashboard avec welcome banner (optionnel)

**Points de test**:

- [ ] Formulaire validation fonctionne
- [ ] Email déjà existant → erreur "Email déjà utilisé"
- [ ] Passwords différents → erreur client-side
- [ ] Auto-login fonctionne (pas besoin de se reconnecter)
- [ ] Dashboard accessible immédiatement

---

## ✅ 2. DASHBOARD ACCESS (Première visite)

### **Route**: `/dashboard`

**Session State**:

```typescript
session = {
  user: {
    id: "user_abc123",
    email: "jean@entreprise.com",
    name: "Jean Dupont",
    plan: "FREE"
  }
}
```

**Flow**:

1. Page dashboard load
2. `useSession()` hook récupère session JWT
3. **Deux modes possibles**:

   **Mode A: Demo publique (non-auth)**
   - User clique sur un des 3 boutons démo
   - Charge fichier CSV démo en mémoire
   - Pas de sauvegarde DB
   - Data perdue au refresh

   **Mode B: Upload perso (auth)**
   - User upload son fichier CSV/Excel
   - Parse data en mémoire
   - Si connecté → Peut sauvegarder
   - Si non connecté → Data perdue au refresh

**Comportement attendu FREE user**:

- ✅ Peut upload fichiers (limite: 10/mois)
- ✅ Dashboard complet visible
- ✅ Score FinSight™ calculé
- ✅ ML Anomaly Detection active
- ✅ AI Copilot: 10 questions/jour max
- ✅ Export PDF/Excel: watermark "Plan FREE"
- ✅ Pas de sauvegarde cloud (data en local storage uniquement)
- ⚠️ Banner "Upgrade PRO" visible après upload

**Points de test**:

- [ ] Session user visible dans Header dropdown
- [ ] Plan badge "Starter" affiché
- [ ] Upload fonctionne (drag & drop + file picker)
- [ ] Score FinSight™ calculé correctement
- [ ] Charts s'affichent (cash flow, margins, expenses)
- [ ] AI Copilot répond (compteur 10/10 questions)
- [ ] Export PDF ajoute watermark "Plan FREE - Upgrade pour enlever"

---

## ✅ 3. SAVE DASHBOARD (Si user PRO+)

### **Condition**: `session.user.plan !== 'FREE'`

**Flow**:

1. User click "💾 Sauvegarder" dans dashboard
2. Modal s'ouvre:
   - Input: Nom du dashboard
   - Input: Nom entreprise (optionnel)
   - Select: Secteur (optionnel)
3. POST `/api/dashboards/upload`:

   ```json
   {
     "fileName": "Q4 2024 Analysis",
     "kpis": [...],
     "rawData": [...],
     "company": {
       "name": "Mon Entreprise SAS",
       "sector": "services"
     }
   }
   ```

4. Backend:
   - ✅ Vérifie session user
   - ✅ Vérifie plan (FREE → reject avec upgrade CTA)
   - ✅ Save to DB (Prisma)
   - ✅ Associe dashboard à user + company
5. Response: `{ dashboardId: "dash_xyz789" }`
6. Toast: "✅ Dashboard sauvegardé !"

**Comportement attendu**:

- ✅ Dashboard enregistré dans DB
- ✅ Lié au user actuel
- ✅ Lié à une company (activeCompanyId)
- ✅ Accessible via `/dashboard/list`
- ✅ Chargeable via `/dashboard?id=dash_xyz789`

**Points de test FREE**:

- [ ] Bouton "Sauvegarder" → Modal upgrade PRO
- [ ] Message: "Sauvegarde cloud réservée aux plans Business+"

**Points de test PRO+**:

- [ ] Modal sauvegarde s'ouvre
- [ ] Sauvegarde réussit
- [ ] Toast confirmation visible
- [ ] Dashboard ID stocké (pour reload)

---

## ✅ 4. LOGOUT

### **Route**: Header dropdown → "Déconnexion"

**Flow**:

1. User click "Déconnexion"
2. `signOut({ callbackUrl: '/' })` appelé
3. Session JWT invalidée
4. Cookies cleared
5. Redirect: `/` (homepage)

**Comportement attendu**:

- ✅ Session détruite
- ✅ Cookie `next-auth.session-token` supprimé
- ✅ Redirect homepage
- ✅ Header affiche "Se connecter" + "Essai gratuit"

**Points de test**:

- [ ] Déconnexion fonctionne
- [ ] Redirect homepage OK
- [ ] Session complètement détruite
- [ ] Impossible d'accéder `/dashboard/list` (redirect `/auth/signin`)

---

## ✅ 5. LOGIN (Retour utilisateur)

### **Route**: `/auth/signin`

**Flow**:

1. User remplit formulaire:
   - Email
   - Password
2. POST via `signIn('credentials')`:

   ```json
   {
     "email": "jean@entreprise.com",
     "password": "motdepasse123",
     "redirect": false
   }
   ```

3. Backend:
   - ✅ Find user by email (Prisma)
   - ✅ Compare password hash (bcryptjs)
   - ✅ If valid → JWT token
4. JWT payload:

   ```json
   {
     "id": "user_abc123",
     "email": "jean@entreprise.com",
     "name": "Jean Dupont",
     "plan": "FREE"
   }
   ```

5. Redirect: `/dashboard`

**Comportement attendu**:

- ✅ Login réussi si credentials valides
- ✅ Session JWT créée (30 jours)
- ✅ Redirect dashboard
- ✅ User retrouve son état (plan, nom)

**Points de test**:

- [ ] Login avec bon password → OK
- [ ] Login avec mauvais password → erreur "Email ou mot de passe incorrect"
- [ ] Login avec email inexistant → même erreur (sécurité)
- [ ] Session persistent 30 jours (pas de re-login avant expiration)

---

## ✅ 6. RELOAD SAVED DASHBOARD

### **Route**: `/dashboard?id=dash_xyz789` ou `/dashboard/list`

**Flow A: Direct link**

1. User clique lien `/dashboard?id=dash_xyz789`
2. `useSearchParams()` détecte `id` param
3. `loadSavedDashboard(dashboardId)` appelé
4. GET `/api/dashboards?id=dash_xyz789`
5. Backend:
   - ✅ Vérifie session user
   - ✅ Vérifie ownership (dashboard.userId === session.user.id)
   - ✅ Return dashboard data
6. Frontend reconstruit:
   - `setKpis(dashboard.kpis)`
   - `setRawData(dashboard.rawData)`
   - `setCompanyName(dashboard.company.name)`
   - `setIsDataLoaded(true)`
7. Dashboard s'affiche avec données chargées

**Flow B: Via /dashboard/list**

1. User va sur `/dashboard/list`
2. Liste affichée (cards avec fileName, date, company)
3. User clique sur une card
4. Redirect `/dashboard?id=dash_xyz789`
5. Flow A se déclenche

**Comportement attendu**:

- ✅ Dashboard reload avec données exactes
- ✅ KPIs identiques à la sauvegarde
- ✅ Charts identiques
- ✅ Score FinSight™ recalculé (même valeur)
- ✅ Badge "📂 Dashboard: [Nom]" affiché en haut

**Points de test**:

- [ ] Load saved dashboard via URL fonctionne
- [ ] Load saved dashboard via /list fonctionne
- [ ] User ne peut pas charger dashboard d'un autre user (403)
- [ ] Dashboard inexistant → erreur + redirect `/dashboard/list`
- [ ] Animation loading visible (progress bar)

---

## ✅ 7. MULTI-COMPANY SUPPORT

### **Feature**: CompanySwitcher dans Header

**Flow**:

1. User PRO+ crée plusieurs companies via `/dashboard/settings/companies`
2. Header affiche dropdown "Company Switcher"
3. User sélectionne company → `setActiveCompanyId()`
4. Tous les dashboards filtrés par `activeCompanyId`
5. Nouveaux dashboards sauvegardés sous company active

**Comportement attendu**:

- ✅ User peut avoir plusieurs companies
- ✅ Dashboards isolés par company
- ✅ Switch company → liste dashboards change
- ✅ FREE user: 1 company max

**Points de test**:

- [ ] Company switcher visible (si PRO+)
- [ ] Création company fonctionne
- [ ] Switch company → dashboards filtrés
- [ ] Sauvegarde dashboard associe bonne company

---

## 🔥 EDGE CASES À TESTER

### **1. Session expirée pendant utilisation**

- [ ] User upload data, laisse onglet ouvert 31 jours
- [ ] Token JWT expiré
- [ ] Action suivante (save, AI copilot) → redirect `/auth/signin`
- [ ] Message: "Session expirée. Reconnectez-vous."

### **2. Upload limite FREE (10/mois)**

- [ ] User FREE upload 10 fichiers
- [ ] 11ème upload → modal "Limite atteinte. Upgrade Business."
- [ ] Counter affiche "10/10 uploads utilisés"

### **3. AI Copilot limite (10 questions/jour)**

- [ ] User FREE pose 10 questions
- [ ] 11ème question → modal "Limite quotidienne atteinte. Upgrade Business."
- [ ] Counter "10/10 questions utilisées"
- [ ] Reset à minuit (00:00 UTC)

### **4. Concurrent sessions**

- [ ] User login desktop + mobile
- [ ] Upload sur desktop → data visible ?
- [ ] Logout desktop → mobile logout aussi ? (NON, JWT indépendant)

### **5. Plan downgrade**

- [ ] User Business downgrade vers FREE (via Stripe portal)
- [ ] Webhook update user.plan = 'FREE'
- [ ] Dashboards sauvegardés restent accessibles (read-only)
- [ ] Pas de nouvelles sauvegardes possibles

---

## 📊 PROTECTION DES ROUTES (Middleware)

### **Routes protégées** (require auth)

```typescript
'/dashboard/:path*'      // Sauf /dashboard (démo publique OK)
'/settings/:path*'
'/api/dashboards/:path*'
'/api/stripe/checkout'
```

**Comportement**:

- ✅ Si session valide → accès OK
- ✅ Si pas de session → redirect `/auth/signin`
- ✅ Si session expirée → redirect `/auth/signin`

**Points de test**:

- [ ] Accès `/dashboard/list` sans session → redirect signin
- [ ] Accès `/dashboard/api-keys` sans session → redirect signin
- [ ] Accès `/dashboard` sans session → OK (démo publique)
- [ ] Accès `/api/dashboards/upload` sans session → 401 Unauthorized

---

## ✅ CHECKLIST FINALE

### **Signup → Dashboard**

- [ ] Signup crée user avec plan FREE
- [ ] Auto-login après signup
- [ ] Redirect dashboard fonctionne
- [ ] Session persistante (refresh page → toujours connecté)

### **Dashboard → Save (PRO+)**

- [ ] Upload fichier fonctionne
- [ ] Dashboard calculé (KPIs, Score, Charts)
- [ ] Sauvegarde fonctionne (PRO+)
- [ ] Dashboard lié au user + company

### **Logout → Login → Reload**

- [ ] Logout détruit session
- [ ] Login restore session
- [ ] Saved dashboards visibles dans /list
- [ ] Reload dashboard via URL fonctionne
- [ ] Data identique à la sauvegarde

### **Permissions FREE vs PRO**

- [ ] FREE: pas de save cloud (modal upgrade)
- [ ] FREE: 10 uploads/mois max
- [ ] FREE: 10 questions AI/jour max
- [ ] PRO: save illimité
- [ ] PRO: uploads illimités
- [ ] PRO: AI illimité

---

## 🚀 COMMENT TESTER EN LIVE

### **Option 1: Test manuel (recommandé)**

1. Ouvre navigateur incognito
2. Va sur `https://finsight.zineinsight.com`
3. Click "Essai gratuit" → Signup
4. Upload un fichier démo
5. Explore dashboard (KPIs, charts, AI copilot)
6. Si PRO: Sauvegarde dashboard
7. Logout
8. Login
9. Va sur `/dashboard/list`
10. Reload dashboard sauvegardé
11. Vérifie data identique

### **Option 2: Test avec compte existant**

1. Login avec ton compte admin
2. Vérifie plan (FREE/PRO/SCALE/ENTERPRISE)
3. Test upload + save
4. Test reload depuis /list
5. Test AI copilot (compteur questions)

### **Option 3: Test API direct (Postman/curl)**

```bash
# 1. Signup
curl -X POST https://finsight.zineinsight.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test1234"}'

# 2. Login
curl -X POST https://finsight.zineinsight.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'

# 3. Get dashboards (needs cookie from login)
curl https://finsight.zineinsight.com/api/dashboards \
  -H "Cookie: next-auth.session-token=..."
```

---

## 📝 RÉSULTAT ATTENDU

**✅ Workflow complet fonctionnel si**:

1. User peut créer compte
2. User peut uploader données
3. Dashboard s'affiche correctement
4. User PRO peut sauvegarder
5. User peut logout/login
6. Dashboards sauvegardés rechargeables
7. Permissions FREE vs PRO respectées
8. Session persistent 30 jours
9. Middleware protège routes sensibles

**🐛 Si bug détecté**:

- Note l'étape exacte qui fail
- Copie message d'erreur console
- Screenshot si nécessaire
- Report ici avec détails

---

**Status**: ⏳ À tester en live
**Testeur**: Otmane
**Environnement**: Production (finsight.zineinsight.com)

# 🚀 Guide de Migration - Collaboration, SSO & Intégrations

## 📋 Checklist de déploiement

### ✅ Phase 1 : Base de données

1. **Créer la migration Prisma**
   ```bash
   npx prisma migrate dev --name collaboration_sso_integrations
   ```

2. **Générer le client Prisma**
   ```bash
   npx prisma generate
   ```

3. **Initialiser les OWNER existants**
   ```bash
   ./scripts/init-company-owners.sh
   ```

### ✅ Phase 2 : Variables d'environnement

1. **Copier le template**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Remplir les nouvelles variables**
   ```env
   # SSO (optionnel au début)
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   AZURE_AD_CLIENT_ID="..."
   AZURE_AD_CLIENT_SECRET="..."

   # Intégrations comptables (optionnel au début)
   PENNYLANE_CLIENT_ID="..."
   PENNYLANE_CLIENT_SECRET="..."
   QUICKBOOKS_CLIENT_ID="..."
   QUICKBOOKS_CLIENT_SECRET="..."
   ```

3. **Configuration Vercel (production)**
   ```bash
   vercel env add GOOGLE_CLIENT_ID production
   vercel env add GOOGLE_CLIENT_SECRET production
   vercel env add AZURE_AD_CLIENT_ID production
   vercel env add AZURE_AD_CLIENT_SECRET production
   vercel env add PENNYLANE_CLIENT_ID production
   vercel env add PENNYLANE_CLIENT_SECRET production
   vercel env add QUICKBOOKS_CLIENT_ID production
   vercel env add QUICKBOOKS_CLIENT_SECRET production
   ```

### ✅ Phase 3 : Configuration OAuth

#### Google Cloud Console

1. Aller sur https://console.cloud.google.com
2. Sélectionner projet "FinSights" (ou créer)
3. **APIs & Services** → **Credentials**
4. **Create Credentials** → **OAuth client ID**
5. Application type : **Web application**
6. Name : "FinSights Production"
7. **Authorized redirect URIs** :
   - Dev : `http://localhost:3000/api/auth/callback/google`
   - Prod : `https://finsights.fr/api/auth/callback/google`
8. Copier `Client ID` et `Client Secret` dans `.env.local`

#### Microsoft Azure Portal

1. Aller sur https://portal.azure.com
2. **Azure Active Directory** → **App registrations**
3. **New registration**
   - Name : "FinSights"
   - Supported account types : **Accounts in any organizational directory (Multi-tenant)**
   - Redirect URI (Web) : `https://finsights.fr/api/auth/callback/azure-ad`
4. **Certificates & secrets** → **New client secret**
5. Copier :
   - Application (client) ID → `AZURE_AD_CLIENT_ID`
   - Client secret value → `AZURE_AD_CLIENT_SECRET`
   - Directory (tenant) ID → `AZURE_AD_TENANT_ID` (ou laisser "common")

#### Pennylane Developer

1. Aller sur https://developers.pennylane.com
2. **My Applications** → **Create Application**
3. Name : "FinSights"
4. **Redirect URIs** :
   - Dev : `http://localhost:3000/api/integrations/pennylane/callback`
   - Prod : `https://finsights.fr/api/integrations/pennylane/callback`
5. **Scopes** :
   - ✅ `accounting:read`
   - ✅ `invoices:read`
   - ✅ `customers:read`
6. Copier `Client ID` et `Client Secret`

#### QuickBooks Developer

1. Aller sur https://developer.intuit.com
2. **My Apps** → **Create an app**
3. Select APIs : **QuickBooks Online and Payments**
4. App name : "FinSights"
5. **Keys & OAuth** :
   - Redirect URIs :
     - Dev : `http://localhost:3000/api/integrations/quickbooks/callback`
     - Prod : `https://finsights.fr/api/integrations/quickbooks/callback`
   - Scopes : `Accounting` (com.intuit.quickbooks.accounting)
6. Copier `Client ID` et `Client Secret`

### ✅ Phase 4 : Tests locaux

1. **Démarrer le serveur**
   ```bash
   npm run dev
   ```

2. **Tester la collaboration**
   - Créer une entreprise
   - Aller sur `/dashboard/settings/team`
   - Inviter un utilisateur (vérifier email)
   - Accepter l'invitation depuis le lien
   - Vérifier les rôles et permissions

3. **Tester le SSO**
   - Aller sur `/auth/signin`
   - Cliquer "Se connecter avec Google"
   - Autoriser l'application
   - Vérifier que le compte est créé/connecté
   - Répéter avec Microsoft

4. **Tester les intégrations**
   - Aller sur `/dashboard/settings/integrations`
   - Connecter Pennylane (ou QuickBooks)
   - Autoriser l'application
   - Synchroniser les factures
   - Vérifier les transactions importées

### ✅ Phase 5 : Déploiement production

1. **Build local**
   ```bash
   npm run build
   ```
   Vérifier qu'il n'y a pas d'erreurs TypeScript

2. **Push sur GitHub**
   ```bash
   git add .
   git commit -m "feat: collaboration, SSO & intégrations comptables"
   git push origin main
   ```

3. **Déployer sur Vercel**
   ```bash
   vercel --prod
   ```

4. **Vérifier les logs Vercel**
   - Pas d'erreurs 500
   - Routes API accessibles
   - Callbacks OAuth fonctionnels

### ✅ Phase 6 : Post-déploiement

1. **Tester en production**
   - SSO Google/Microsoft
   - Invitations (vérifier emails Resend)
   - Intégrations Pennylane/QuickBooks

2. **Monitorer Sentry**
   - Vérifier qu'il n'y a pas d'erreurs
   - Surveiller les performances

3. **Communiquer aux utilisateurs**
   - Annoncer les nouvelles fonctionnalités
   - Créer un article de blog ou newsletter
   - Mettre à jour la documentation utilisateur

---

## 🔧 Troubleshooting

### Erreur : "Property 'companyMember' does not exist"

**Cause** : Prisma client pas régénéré

**Solution** :
```bash
npx prisma generate
npm run dev
```

### Erreur : "Invitation email not sent"

**Cause** : Resend API key invalide ou manquant

**Solution** :
1. Vérifier `RESEND_API_KEY` dans `.env.local`
2. Tester avec :
   ```bash
   curl https://api.resend.com/emails \
     -H "Authorization: Bearer $RESEND_API_KEY" \
     -H "Content-Type: application/json"
   ```

### Erreur : "OAuth callback failed"

**Cause** : Redirect URI mal configuré

**Solution** :
1. Vérifier que l'URL dans le provider OAuth correspond exactement à :
   - Dev : `http://localhost:3000/api/auth/callback/[provider]`
   - Prod : `https://finsights.fr/api/auth/callback/[provider]`
2. Pas de trailing slash
3. Protocol correct (http vs https)

### Erreur : "Token expired" (Pennylane/QuickBooks)

**Cause** : Access token expiré, pas de refresh token

**Solution** :
1. Implémenter le refresh token flow dans les routes sync
2. Ou demander à l'utilisateur de reconnecter

---

## 📊 Métriques de succès

| Métrique | Objectif | Vérification |
|----------|----------|--------------|
| Invitations envoyées | > 0 | Dashboard admin |
| Taux d'acceptation | > 70% | Logs Prisma |
| Connexions SSO | > 20% des nouvelles inscriptions | PostHog |
| Intégrations actives | > 5 entreprises | Dashboard admin |
| Syncs réussies | > 95% | Logs Prisma |

---

## 🎯 Améliorations futures

1. **Collaboration avancée**
   - [ ] Commentaires sur dashboards
   - [ ] Notifications temps réel (Pusher)
   - [ ] Logs d'activité (audit trail)
   - [ ] Permissions granulaires par dashboard

2. **SSO avancé**
   - [ ] SAML pour entreprises
   - [ ] LinkedIn OAuth
   - [ ] Apple Sign-In

3. **Intégrations avancées**
   - [ ] Xero, Sage, Cegid
   - [ ] Sync bidirectionnel (push data)
   - [ ] Webhooks entrants
   - [ ] Cron job sync automatique

---

**✅ Migration complète - Prêt pour production !**

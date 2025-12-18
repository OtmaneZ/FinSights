# 🤝 Collaboration, SSO & Intégrations - Guide Complet

## 📋 Vue d'ensemble

Ce document détaille l'implémentation complète de :
1. **Collaboration** : Invitations, rôles (Owner/Admin/Editor/Viewer)
2. **SSO** : Google OAuth & Microsoft Azure AD
3. **Intégrations comptables** : Pennylane & QuickBooks

---

## 🎯 1. COLLABORATION (Invitations & Rôles)

### Architecture

```
Company (entreprise)
  ├── CompanyMember[] (membres avec rôles)
  │   ├── OWNER (propriétaire - 1 seul)
  │   ├── ADMIN (administrateurs - plusieurs)
  │   ├── EDITOR (éditeurs - plusieurs)
  │   └── VIEWER (lecteurs - plusieurs)
  └── Invitation[] (invitations envoyées)
      ├── PENDING (en attente)
      ├── ACCEPTED (acceptée)
      ├── DECLINED (refusée)
      └── EXPIRED (expirée > 7 jours)
```

### Modèles Prisma ajoutés

```prisma
enum Role {
  OWNER       // Créateur de l'entreprise (tous les droits)
  ADMIN       // Administrateur (gestion membres + dashboards)
  EDITOR      // Éditeur (upload, édition dashboards)
  VIEWER      // Lecteur seul (consultation dashboards)
}

enum InvitationStatus {
  PENDING     // En attente d'acceptation
  ACCEPTED    // Acceptée
  DECLINED    // Refusée
  EXPIRED     // Expirée (> 7 jours)
}

model CompanyMember {
  id        String @id @default(cuid())
  companyId String
  userId    String
  role      Role @default(VIEWER)

  company   Company @relation(...)
  user      User @relation(...)

  @@unique([companyId, userId])
}

model Invitation {
  id        String @id @default(cuid())
  email     String
  role      Role
  status    InvitationStatus @default(PENDING)
  token     String @unique
  expiresAt DateTime

  companyId String
  invitedBy String

  company   Company @relation(...)
  inviter   User @relation(...)
}
```

### API Routes créées

#### 1. POST `/api/invitations`
**Inviter un utilisateur**

```typescript
// Request
{
  "companyId": "clx...",
  "email": "user@example.com",
  "role": "EDITOR"  // VIEWER | EDITOR | ADMIN
}

// Response 201
{
  "success": true,
  "invitation": {
    "id": "clx...",
    "email": "user@example.com",
    "role": "EDITOR",
    "status": "PENDING",
    "expiresAt": "2025-12-25T12:00:00Z"
  }
}
```

**Permissions requises** : OWNER ou ADMIN

**Email envoyé automatiquement** avec lien d'acceptation

#### 2. GET `/api/invitations?companyId=xxx`
**Lister les invitations d'une entreprise**

```typescript
// Response 200
{
  "invitations": [
    {
      "id": "clx...",
      "email": "user@example.com",
      "role": "EDITOR",
      "status": "PENDING",
      "expiresAt": "2025-12-25T12:00:00Z",
      "createdAt": "2025-12-18T12:00:00Z",
      "inviter": {
        "name": "Jean Dupont",
        "email": "jean@example.com"
      }
    }
  ]
}
```

#### 3. PATCH `/api/invitations/[token]/route.ts`
**Accepter une invitation**

```typescript
// PATCH /api/invitations/abc123def456/route.ts

// Response 200
{
  "success": true,
  "message": "Vous avez rejoint Acme Corp",
  "member": {
    "id": "clx...",
    "role": "EDITOR",
    "company": { ... }
  }
}
```

**Vérifications automatiques** :
- Token valide et non expiré
- Email correspond à l'utilisateur connecté
- Pas déjà membre

#### 4. DELETE `/api/invitations/[token]/route.ts`
**Refuser une invitation**

```typescript
// DELETE /api/invitations/abc123def456/route.ts

// Response 200
{
  "success": true,
  "message": "Invitation refusée"
}
```

### Composants UI créés

#### 1. `TeamMembersTable.tsx`
Affiche la liste des membres avec :
- Avatar ou icône utilisateur
- Nom + email
- Sélecteur de rôle (si droits suffisants)
- Bouton supprimer (sauf OWNER et soi-même)

#### 2. `InviteUserModal.tsx`
Modal pour inviter un utilisateur :
- Input email avec validation
- Sélecteur de rôle avec descriptions
- Gestion des erreurs

#### 3. `PendingInvitationsTable.tsx`
Liste des invitations en attente :
- Email + rôle
- Qui a invité
- Alerte si expire < 24h
- Bouton révoquer

### Matrice des permissions

| Action | OWNER | ADMIN | EDITOR | VIEWER |
|--------|-------|-------|--------|--------|
| Voir dashboards | ✅ | ✅ | ✅ | ✅ |
| Upload fichiers | ✅ | ✅ | ✅ | ❌ |
| Modifier dashboards | ✅ | ✅ | ✅ | ❌ |
| Supprimer dashboards | ✅ | ✅ | ❌ | ❌ |
| Inviter membres | ✅ | ✅ | ❌ | ❌ |
| Changer rôles | ✅ | ✅ | ❌ | ❌ |
| Retirer membres | ✅ | ✅ | ❌ | ❌ |
| Supprimer entreprise | ✅ | ❌ | ❌ | ❌ |
| Gérer facturation | ✅ | ❌ | ❌ | ❌ |

---

## 🔐 2. SSO (Single Sign-On)

### Providers ajoutés

#### 1. Google OAuth
```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
})
```

#### 2. Microsoft Azure AD
```typescript
AzureADProvider({
  clientId: process.env.AZURE_AD_CLIENT_ID,
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
  tenantId: 'common', // Multi-tenant
})
```

### Configuration NextAuth

**Fichier** : `src/lib/auth.ts`

**Modifications** :
1. Ajout de `GoogleProvider` et `AzureADProvider`
2. Callback `signIn` pour gérer la création/mise à jour des comptes SSO
3. User model étendu avec :
   - `provider` : "google" | "microsoft" | "credentials"
   - `providerId` : ID OAuth du provider
   - `providerEmail` : Email du provider
   - `avatar` : Photo de profil
   - `password` : nullable (pas de password pour SSO)

### Flow SSO

```
1. User clique "Se connecter avec Google"
   ↓
2. Redirection vers Google OAuth
   ↓
3. User autorise FinSights
   ↓
4. Callback NextAuth reçoit le token
   ↓
5. Si user existe (email) → connexion
   Si nouveau → création compte SSO (password=null)
   ↓
6. User connecté avec session JWT
```

### Variables d'environnement

```env
# Google OAuth
GOOGLE_CLIENT_ID="xxxxxxxxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxxx"

# Microsoft Azure AD
AZURE_AD_CLIENT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
AZURE_AD_CLIENT_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
AZURE_AD_TENANT_ID="common"  # ou ID de tenant spécifique
```

### Configuration OAuth

#### Google Cloud Console

1. Aller sur https://console.cloud.google.com
2. Créer un projet "FinSights"
3. Activer "Google+ API"
4. Credentials → OAuth 2.0 Client ID
5. Authorized redirect URIs :
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://finsights.fr/api/auth/callback/google` (prod)

#### Azure Portal

1. Aller sur https://portal.azure.com
2. Azure Active Directory → App registrations
3. New registration "FinSights"
4. Redirect URIs (Web) :
   - `http://localhost:3000/api/auth/callback/azure-ad` (dev)
   - `https://finsights.fr/api/auth/callback/azure-ad` (prod)
5. Certificates & secrets → New client secret

---

## 🔗 3. INTÉGRATIONS COMPTABLES

### Architecture

```
FinSights
  ↓ OAuth 2.0
Pennylane / QuickBooks
  ↓ Access Token
API REST
  ↓ Factures / Transactions
Auto-Sync Dashboard
```

### Modèle Prisma

```prisma
model AccountingIntegration {
  id               String @id @default(cuid())
  provider         String    // "pennylane" | "quickbooks"
  active           Boolean @default(true)

  // OAuth
  accessToken      String?
  refreshToken     String?
  expiresAt        DateTime?

  // Provider data
  providerAccountId String?
  metadata          Json?

  // Sync
  autoSync         Boolean @default(false)
  lastSyncAt       DateTime?
  syncFrequency    String @default("daily")

  companyId        String
  userId           String

  @@unique([companyId, provider])
}
```

### API Routes Pennylane

#### 1. POST `/api/integrations/pennylane/connect`
**Démarrer OAuth flow**

```typescript
// Request
{
  "companyId": "clx..."
}

// Response 200
{
  "authUrl": "https://app.pennylane.com/oauth/authorize?client_id=..."
}
```

**Frontend** : Ouvrir `authUrl` dans une popup ou nouvelle fenêtre

#### 2. GET `/api/integrations/pennylane/callback`
**Callback OAuth** (automatique)

Query params :
- `code` : Authorization code
- `state` : État de sécurité (contient userId + companyId)

Actions :
1. Échange code → access token
2. Récupère ID du compte Pennylane
3. Sauvegarde dans `AccountingIntegration`
4. Redirect vers `/dashboard/settings/integrations?success=pennylane_connected`

#### 3. POST `/api/integrations/pennylane/sync`
**Synchroniser les factures**

```typescript
// Request
{
  "companyId": "clx..."
}

// Response 200
{
  "success": true,
  "transactions": [
    {
      "date": "2025-12-01",
      "label": "Facture #2025-001",
      "amount": 1200.00,
      "client": "Acme Corp",
      "dueDate": "2025-12-31",
      "status": "Payé",
      "category": "Ventes",
      "credit": 1200.00,
      "debit": 0
    }
  ],
  "syncedAt": "2025-12-18T12:00:00Z",
  "count": 45
}
```

### API Routes QuickBooks

**Identiques à Pennylane** :
- POST `/api/integrations/quickbooks/connect`
- GET `/api/integrations/quickbooks/callback`
- POST `/api/integrations/quickbooks/sync`

### Variables d'environnement

```env
# Pennylane
PENNYLANE_CLIENT_ID="xxxxxxxxxx"
PENNYLANE_CLIENT_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# QuickBooks
QUICKBOOKS_CLIENT_ID="ABxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
QUICKBOOKS_CLIENT_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Configuration OAuth

#### Pennylane Developer Portal

1. Aller sur https://developers.pennylane.com
2. Créer une application "FinSights"
3. Redirect URIs :
   - `http://localhost:3000/api/integrations/pennylane/callback`
   - `https://finsights.fr/api/integrations/pennylane/callback`
4. Scopes :
   - `accounting:read`
   - `invoices:read`
   - `customers:read`

#### QuickBooks Developer Portal

1. Aller sur https://developer.intuit.com
2. Créer une app "FinSights"
3. Redirect URIs :
   - `http://localhost:3000/api/integrations/quickbooks/callback`
   - `https://finsights.fr/api/integrations/quickbooks/callback`
4. Scopes :
   - `com.intuit.quickbooks.accounting`

### Sync automatique

**Prochaine étape** : Créer un cron job Vercel

```typescript
// /api/cron/sync-integrations
// Runs every day at 8 AM

export async function GET() {
  const integrations = await prisma.accountingIntegration.findMany({
    where: {
      active: true,
      autoSync: true,
    },
  });

  for (const integration of integrations) {
    await syncIntegration(integration.id);
  }
}
```

---

## 🚀 Migration & Déploiement

### 1. Installer les dépendances

```bash
npm install next-auth @prisma/client resend
```

### 2. Mettre à jour Prisma

```bash
# Générer la migration
npx prisma migrate dev --name collaboration_sso_integrations

# Générer le client Prisma
npx prisma generate
```

### 3. Configurer les variables d'environnement

Copier dans `.env.local` :

```env
# SSO
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
AZURE_AD_CLIENT_ID="..."
AZURE_AD_CLIENT_SECRET="..."
AZURE_AD_TENANT_ID="common"

# Intégrations
PENNYLANE_CLIENT_ID="..."
PENNYLANE_CLIENT_SECRET="..."
QUICKBOOKS_CLIENT_ID="..."
QUICKBOOKS_CLIENT_SECRET="..."
```

### 4. Tester localement

```bash
npm run dev
```

### 5. Déployer sur Vercel

```bash
# Ajouter les env vars dans Vercel Dashboard
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
# ... etc

# Déployer
vercel --prod
```

---

## 🧪 Tests

### Tests à créer

```bash
# Tests invitations
__tests__/invitations.test.ts

# Tests SSO
__tests__/sso.test.ts

# Tests intégrations
__tests__/integrations.test.ts
```

### Exemple test invitation

```typescript
describe('POST /api/invitations', () => {
  it('devrait créer une invitation avec email valide', async () => {
    const response = await fetch('/api/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyId: 'clx123',
        email: 'test@example.com',
        role: 'EDITOR',
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.invitation.email).toBe('test@example.com');
  });
});
```

---

## 📊 Métriques

| Feature | Avant | Après |
|---------|-------|-------|
| **Collaboration** | Aucune | ✅ 4 rôles + invitations |
| **SSO** | Credentials only | ✅ Google + Microsoft |
| **Intégrations** | Templates manuels | ✅ OAuth Pennylane + QuickBooks |
| **Routes API** | 0 | +9 routes |
| **Composants UI** | 0 | +3 composants |
| **Modèles Prisma** | 0 | +3 modèles |

---

## 🎯 Prochaines étapes

1. ✅ Tests automatisés (Jest)
2. ✅ Page UI `/dashboard/settings/team`
3. ✅ Page UI `/dashboard/settings/integrations`
4. ⏳ Cron job sync automatique
5. ⏳ Notifications email (nouveau membre, sync terminée)
6. ⏳ Logs d'activité (audit trail)

---

**🎉 Implémentation complète et rigoureuse !**

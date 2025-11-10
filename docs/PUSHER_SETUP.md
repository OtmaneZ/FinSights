# 🚀 Setup Pusher Real-Time pour FinSight

## 1️⃣ Créer un compte Pusher (Gratuit)

1. Aller sur https://dashboard.pusher.com/accounts/sign_up
2. Créer un compte avec email ou GitHub
3. Plan gratuit: **100 connexions simultanées** (largement suffisant)

## 2️⃣ Créer une App Pusher

1. Dans le dashboard: **Create app**
2. Nom: `finsight-realtime`
3. Cluster: **eu** (Europe - meilleure latence)
4. Frontend tech: **React**
5. Backend tech: **Node.js**
6. Cliquer **Create app**

## 3️⃣ Récupérer les Credentials

Dans votre app Pusher, onglet **App Keys**, copier :

```
app_id: 1234567
key: abc123def456
secret: xyz789abc123
cluster: eu
```

## 4️⃣ Configurer les Variables d'Environnement

Créer/éditer le fichier `.env.local` à la racine du projet :

```bash
# Pusher Configuration
NEXT_PUBLIC_PUSHER_KEY=abc123def456       # Votre "key"
NEXT_PUBLIC_PUSHER_CLUSTER=eu              # Votre "cluster"
PUSHER_APP_ID=1234567                      # Votre "app_id"
PUSHER_SECRET=xyz789abc123                 # Votre "secret"
```

⚠️ **Important** : Ne JAMAIS commit `.env.local` sur Git !

## 5️⃣ Tester la Configuration

```bash
# Lancer le test Pusher
npx tsx scripts/test-pusher.ts
```

Résultat attendu :
```
✅ Server Pusher instance created
✅ Event triggered successfully
✅ Client connected to Pusher
✅ Subscribed to test-channel
```

## 6️⃣ Architecture Pusher dans FinSight

### Channels

**`presence-dashboard`** : Collaboration temps réel
- Voir qui est connecté
- Avatars utilisateurs
- Cursors tracking

**`private-dashboard`** : Événements dashboard
- KPI updates
- File uploads
- Drill-down events
- Anomaly detections

### Events

- `kpi-updated`: Nouveau calcul KPI
- `file-uploaded`: Fichier importé
- `cursor-move`: Position souris utilisateur
- `anomaly-detected`: Nouvelle anomalie ML

## 7️⃣ Limites Plan Gratuit

- ✅ 200k messages/jour
- ✅ 100 connexions simultanées
- ✅ SSL inclus
- ✅ Webhooks
- ❌ Pas de support prioritaire

Pour un MVP/démo, c'est **parfait** ! 🚀

## 8️⃣ Déploiement Vercel

Ajouter les variables d'environnement dans Vercel :

```bash
vercel env add NEXT_PUBLIC_PUSHER_KEY
vercel env add NEXT_PUBLIC_PUSHER_CLUSTER
vercel env add PUSHER_APP_ID
vercel env add PUSHER_SECRET
```

Ou via le dashboard Vercel : **Settings > Environment Variables**

## 9️⃣ Monitoring

Dashboard Pusher : https://dashboard.pusher.com/

- 📊 Connexions actives
- 📈 Messages envoyés
- 🔍 Debug console
- ⚠️ Erreurs

## 🆘 Troubleshooting

**Erreur "Invalid key"** :
→ Vérifier `NEXT_PUBLIC_PUSHER_KEY` dans `.env.local`

**Erreur "Invalid credentials"** :
→ Vérifier `PUSHER_SECRET` et `PUSHER_APP_ID`

**Erreur "Connection failed"** :
→ Vérifier cluster (doit être 'eu', pas 'us2')

**Channels ne se connectent pas** :
→ Vérifier API route `/api/pusher/auth` fonctionne

---

✅ **Setup complet !** Vous êtes prêt pour le real-time collaboration 🎉

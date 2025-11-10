# ⏰ Vercel Cron Jobs - Email Alerts Automation

## 📋 Overview

Ce projet utilise **Vercel Cron Jobs** pour automatiser l'envoi d'alertes email quotidiennes basées sur les conditions financières configurées par l'utilisateur.

---

## 🔧 Configuration

### 1. **Fichier `vercel.json`**

```json
{
  "crons": [
    {
      "path": "/api/cron/check-alerts",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Schedule**: Tous les jours à 9h UTC (10h CET en hiver, 11h CEST en été)

### 2. **API Route `/api/cron/check-alerts`**

- **Méthode**: `GET`
- **Auth**: Bearer token (optionnel via `CRON_SECRET`)
- **Fonction**: Vérifie les KPIs et envoie des emails si alertes détectées

---

## 📊 Logique de Vérification

Le cron vérifie automatiquement :

1. **Trésorerie** : `< 10 000€` → Email critique
2. **DSO** : `> 45 jours` → Email warning
3. **Marge** : `< 20%` → Email warning
4. **Anomalies ML** : Détection → Email warning
5. **Échéances** : J-3 → Email info

Les seuils sont **configurables** via le modal AlertSettings (localStorage).

---

## 🧪 Test en Local

### 1. **Lancer le dev server**
```bash
npm run dev
```

### 2. **Tester le cron manuellement**
```bash
npx tsx scripts/test-cron.ts
```

### 3. **Tester via curl**
```bash
curl http://localhost:3000/api/cron/check-alerts
```

**Résultat attendu** :
```json
{
  "success": true,
  "timestamp": "2025-11-06T09:00:00.000Z",
  "alertsChecked": 5,
  "alertsTriggered": 2,
  "emailsSent": 2,
  "errors": [],
  "details": [...]
}
```

---

## 🚀 Déploiement Production

### 1. **Variables d'environnement Vercel**

Ajouter dans Vercel Dashboard (`Settings > Environment Variables`) :

| Variable | Valeur | Environments |
|----------|--------|--------------|
| `RESEND_API_KEY` | `re_bBhZttjV_...` | Production, Preview, Development |
| `CRON_SECRET` | (optionnel) | Production |

### 2. **Activer Vercel Cron**

Le cron s'active automatiquement au déploiement si `vercel.json` est présent.

### 3. **Vérifier les logs**

Dans Vercel Dashboard :
- `Deployments > Functions > /api/cron/check-alerts`
- Voir les logs d'exécution quotidienne

---

## 📝 Format de Cron Schedule

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6)
│ │ │ │ │
* * * * *
```

**Exemples** :
- `0 9 * * *` : Tous les jours à 9h UTC
- `0 9 * * 1-5` : Tous les jours ouvrés à 9h UTC
- `0 9,18 * * *` : 2x par jour (9h et 18h UTC)
- `0 */6 * * *` : Toutes les 6h

---

## 🔐 Sécurité

### Auth Cron (optionnel)

Pour sécuriser l'endpoint cron :

1. **Générer un secret** :
```bash
openssl rand -base64 32
```

2. **Ajouter dans Vercel** :
```
CRON_SECRET=<votre_secret_généré>
```

3. **Vercel ajoute automatiquement** le header :
```
Authorization: Bearer <CRON_SECRET>
```

L'API route vérifie ce header avant d'exécuter.

---

## 📧 Emails Envoyés

Lorsqu'une alerte est déclenchée, un email est envoyé via `/api/alerts/send` avec :

- **Template HTML** responsive
- **Sujet dynamique** selon le type d'alerte
- **CTA button** vers le dashboard
- **Valeurs actuelles** vs seuils configurés

---

## 🐛 Debugging

### Logs en production

Vercel Dashboard > Functions > Logs

### Test manuel en prod

```bash
curl https://finsight.zineinsight.com/api/cron/check-alerts \
  -H "Authorization: Bearer <CRON_SECRET>"
```

### Vérifier l'exécution

Vercel Dashboard > Cron Jobs > Executions

---

## 📚 Références

- [Vercel Cron Jobs Docs](https://vercel.com/docs/cron-jobs)
- [Cron Expression Generator](https://crontab.guru/)
- [Resend Email API](https://resend.com/docs)

---

## ✅ TODO

- [ ] Implémenter la récupération des données depuis une DB (actuellement mock)
- [ ] Ajouter un dashboard admin pour voir l'historique des alertes
- [ ] Implémenter un système de rate limiting (max 1 email/type/jour)
- [ ] Ajouter des webhooks pour notifier Slack/Discord
- [ ] Créer des rapports hebdomadaires automatiques

---

**🚀 Feature #7 TODO 11 COMPLETE !**

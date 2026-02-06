# 🚀 Setup Automation Email (5 minutes)

## ✅ Ce qui est déjà fait
- 5 templates React Email créés (J+0 → J+20)
- 2 API routes configurées (/api/leads/capture + /api/automation/trigger)
- Formulaire de capture sur /templates/previsionnel-tresorerie-90j
- Cron Vercel configuré (9:00 AM daily)
- Email & Calendly corrects : `otmane@zineinsight.com` + `calendly.com/zineinsight/15min`
- Modèle Prisma Lead ajouté au schema

## 🎯 3 étapes pour activer

### 1️⃣ Générer le client Prisma (30 sec)
```bash
npx prisma generate
```

### 2️⃣ Créer la table Lead en base (1 min)
```bash
# Si DATABASE_URL est configurée (Vercel Postgres)
npx prisma migrate dev --name add_lead_nurturing

# OU en production Vercel
npx prisma db push
```

### 3️⃣ Ajouter CRON_SECRET dans Vercel (2 min)
1. Aller sur Vercel Dashboard → FinSights → Settings → Environment Variables
2. Ajouter `CRON_SECRET` = `votre-secret-unique-ici` (ex: `fs_cron_2026_xyz123`)
3. Redéployer le projet

---

## 🧪 Test manuel rapide (optionnel)

### Tester la capture de lead :
```bash
curl -X POST http://localhost:3000/api/leads/capture \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Thomas",
    "company": "Test SAS",
    "sector": "SaaS/Tech",
    "templateName": "Prévisionnel Trésorerie 90j"
  }'
```

**Résultat attendu** :
- ✅ Email J+0 envoyé à test@example.com
- ✅ Lead créé en DB avec `nextEmailScheduled` = J+2
- ✅ Response JSON : `{"success": true, "leadId": "..."}`

### Tester le cron d'automation :
```bash
curl -X GET http://localhost:3000/api/automation/trigger \
  -H "Authorization: Bearer votre-CRON_SECRET"
```

**Résultat attendu** :
- ✅ Requête DB pour leads avec `nextEmailScheduled` ≈ maintenant
- ✅ Envoi emails J+2/J+5/J+10/J+20 si leads trouvés
- ✅ Response JSON : `{"success": true, "stats": {"j2_sent": 0, ...}}`

---

## 📊 Monitoring (après activation)

### Vérifier les leads capturés :
```bash
npx prisma studio
# Ouvrir navigateur : localhost:5555
# Aller dans table "leads"
```

### Vérifier les emails envoyés :
- Dashboard Resend : https://resend.com/emails
- Filtrer par tags : `nurturing_j0`, `nurturing_j2`, etc.

### Vérifier les logs cron :
- Vercel Dashboard → Deployments → Function Logs
- Chercher : `/api/automation/trigger`
- Voir stats quotidiennes : `j2_sent`, `j5_sent`, etc.

---

## 🎯 Séquence complète automatique

| Jour | Email | Trigger | Contenu |
|------|-------|---------|---------|
| J+0 | Welcome | Form submit | Template + 3 bonus + Calendly |
| J+2 | Tutorial | Cron 9AM | Video 3min + 4 key points |
| J+5 | Case Study | Cron 9AM | Thomas Mercier PME 8M€ |
| J+10 | Alert Signals | Cron 9AM | 3 signaux + self-assessment |
| J+20 | DAF Offer | Cron 9AM | 3 formulas pricing + FAQ |

---

## 🔧 Troubleshooting

### Erreur : `Property 'lead' does not exist on PrismaClient`
**Solution** : Lancer `npx prisma generate` pour régénérer le client

### Erreur : `P3009: migrate found failed migrations`
**Solution** : 
```bash
npx prisma migrate reset  # ⚠️ Efface toutes les données
npx prisma migrate dev
```

### Email J+0 envoyé mais pas en DB
**Solution** : Vérifier `DATABASE_URL` dans `.env.local`

### Cron ne se déclenche pas
**Solutions** :
1. Vérifier `CRON_SECRET` dans Vercel env vars
2. Vérifier vercel.json : `"schedule": "0 9 * * *"`
3. Tester manuellement avec curl + Authorization header

---

## 📈 Métriques à suivre (première semaine)

- **Leads capturés** : Nombre de soumissions formulaire
- **Taux d'ouverture J+0** : Resend dashboard (objectif >40%)
- **Taux de clic J+0** : Clics sur Calendly (objectif >5%)
- **Progression séquence** : % leads qui arrivent à J+20
- **Conversions Calendly** : Bookings depuis emails (objectif 2-3%)

---

## 🚀 Prochaines optimisations (après validation)

1. **Unsubscribe link** : Ajouter `GET /api/leads/unsubscribe?email=xxx&token=yyy`
2. **Email opens tracking** : Pixel invisible dans templates
3. **Link click tracking** : UTM params sur tous les liens
4. **Segmentation** : Emails différents selon `sector`
5. **A/B testing** : Tester 2 subject lines par email

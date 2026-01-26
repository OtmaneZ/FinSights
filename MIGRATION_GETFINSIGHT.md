# Migration vers getfinsight.fr

## ✅ Étapes complétées

1. ✅ Domaine `getfinsight.fr` ajouté à Vercel
2. ✅ Domaine `www.getfinsight.fr` ajouté à Vercel

## 🔧 Configuration DNS requise

Pour que votre domaine fonctionne, vous devez configurer les DNS chez votre registrar (OVH, Gandi, Cloudflare, etc.).

### Option A : Configuration DNS recommandée (rapide)

Ajoutez ces enregistrements DNS chez votre registrar :

```
Type: A
Nom: @
Valeur: 76.76.21.21
TTL: 3600 (ou Auto)

Type: A
Nom: www
Valeur: 76.76.21.21
TTL: 3600 (ou Auto)
```

### Option B : Utiliser les nameservers Vercel (plus long)

Si vous préférez laisser Vercel gérer entièrement vos DNS :

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

## 📝 Étapes suivantes

1. **Connectez-vous à votre registrar** (où vous avez acheté getfinsight.fr)
2. **Accédez à la gestion DNS** du domaine
3. **Ajoutez les enregistrements A** (Option A recommandée)
4. **Attendez la propagation** (15 minutes à 48h, généralement < 1h)
5. **Vérifiez** avec : `dig getfinsight.fr` ou `nslookup getfinsight.fr`

## 🔍 Vérification

Une fois les DNS configurés, Vercel vérifiera automatiquement et vous enverra un email.

Vous pouvez aussi vérifier manuellement :

```bash
vercel domains ls
```

## 🌐 URLs après migration

- **Production** : https://getfinsight.fr
- **Production (www)** : https://www.getfinsight.fr
- **Ancien domaine** : https://finsight.zineinsight.com (à rediriger ou désactiver)

## 🚀 Redéploiement

Une fois les DNS configurés, redéployez pour activer le nouveau domaine :

```bash
vercel --prod
```

## 📧 Variables d'environnement à vérifier

Si vous avez des URLs hardcodées dans vos variables d'environnement :

```bash
# Vérifier les variables actuelles
vercel env ls

# Mettre à jour si nécessaire
vercel env add NEXT_PUBLIC_SITE_URL production
# Entrez : https://getfinsight.fr
```

## 🔗 Redirection de l'ancien domaine (optionnel)

Si vous voulez rediriger `finsight.zineinsight.com` vers `getfinsight.fr`, configurez une redirection 301 dans votre fichier `next.config.js` ou dans les paramètres Vercel du projet zineinsight.

---

**Date de migration** : 26 janvier 2026
**Projet Vercel** : fin-sights
**Scope** : otmanes-projects-eb39f3fe

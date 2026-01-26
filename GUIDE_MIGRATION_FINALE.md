# 🎯 Guide Final de Migration vers getfinsight.fr

## ✅ Ce qui a été fait automatiquement

### 1. Configuration Vercel
- ✅ Domaine `getfinsight.fr` ajouté au projet
- ✅ Domaine `www.getfinsight.fr` ajouté au projet

### 2. Mise à jour du code
- ✅ **17 fichiers** mis à jour avec les nouvelles URLs
- ✅ Fichiers de métadonnées SEO (`layout.tsx`, `metadata.ts`)
- ✅ Sitemap (`sitemap.ts`)
- ✅ Templates d'emails
- ✅ Composants React
- ✅ Configuration CORS
- ✅ Robots.txt
- ✅ `.env.example`

## 🔧 Étapes manuelles restantes (IMPORTANTES)

### Étape 1 : Configurer les DNS ⚠️ OBLIGATOIRE

Allez chez votre registrar de domaine (OVH, Gandi, Cloudflare, etc.) et ajoutez :

```
Type: A
Nom: @
Valeur: 76.76.21.21
TTL: 3600

Type: A
Nom: www
Valeur: 76.76.21.21
TTL: 3600
```

**⏱️ Délai de propagation** : 15 min à 48h (généralement < 1h)

### Étape 2 : Mettre à jour les variables d'environnement Vercel

```bash
# 1. Supprimer l'ancienne NEXTAUTH_URL
vercel env rm NEXTAUTH_URL production

# 2. Ajouter la nouvelle
vercel env add NEXTAUTH_URL production
# Entrez: https://getfinsight.fr

# 3. Ajouter NEXT_PUBLIC_SITE_URL (recommandé pour SEO)
vercel env add NEXT_PUBLIC_SITE_URL production
# Entrez: https://getfinsight.fr
```

### Étape 3 : Commit et Push

```bash
# Vérifier les modifications
git status
git diff

# Commit
git add .
git commit -m "chore: migrate from finsight.zineinsight.com to getfinsight.fr

- Update all URLs in codebase
- Update SEO metadata and sitemap
- Update email templates
- Add robots.txt
- Configure domain in Vercel"

# Push
git push origin main
```

### Étape 4 : Déployer

```bash
# Déploiement automatique via GitHub (recommandé)
# Le push déclenche automatiquement le déploiement

# OU déploiement manuel
vercel --prod
```

### Étape 5 : Vérification post-déploiement

```bash
# Vérifier que le domaine répond
curl -I https://getfinsight.fr

# Vérifier les DNS
dig getfinsight.fr
nslookup getfinsight.fr

# Vérifier le SSL
echo | openssl s_client -connect getfinsight.fr:443 -servername getfinsight.fr 2>/dev/null | grep "subject="
```

### Étape 6 : Tester en production

1. **Page d'accueil** : https://getfinsight.fr
2. **Dashboard** : https://getfinsight.fr/dashboard
3. **Pricing** : https://getfinsight.fr/pricing
4. **Blog** : https://getfinsight.fr/blog
5. **Sitemap** : https://getfinsight.fr/sitemap.xml
6. **Robots** : https://getfinsight.fr/robots.txt

### Étape 7 : SEO & Analytics (Important pour le référencement)

#### Google Search Console
```bash
1. Aller sur https://search.google.com/search-console
2. Ajouter propriété "getfinsight.fr"
3. Vérifier via balise HTML ou DNS
4. Soumettre le sitemap: https://getfinsight.fr/sitemap.xml
```

#### Google Analytics / GTM
- Mettre à jour la propriété avec le nouveau domaine
- Vérifier que le tracking fonctionne

#### Microsoft Clarity
- Mettre à jour le domaine du projet
- Vérifier l'installation

#### Stripe
- Mettre à jour les URLs de callback/webhook si nécessaire
- Tester les paiements sur le nouveau domaine

## 📊 Vérification des variables d'environnement

Vérifier que ces variables sont bien configurées sur Vercel :

```bash
vercel env ls
```

Variables critiques :
- ✅ `NEXTAUTH_URL` → `https://getfinsight.fr`
- ✅ `NEXT_PUBLIC_SITE_URL` → `https://getfinsight.fr` (optionnel mais recommandé)
- ✅ `DATABASE_URL` → doit être configuré
- ✅ `STRIPE_SECRET_KEY` → doit être configuré
- ✅ `OPENAI_API_KEY` → doit être configuré

## 🔄 Redirection de l'ancien domaine (Optionnel)

Si vous voulez rediriger `finsight.zineinsight.com` vers `getfinsight.fr` :

### Option A : Via Vercel (si vous contrôlez le projet zineinsight)
1. Aller dans les paramètres du projet zineinsight
2. Ajouter une redirection 301 vers getfinsight.fr

### Option B : Via middleware Next.js
Créer un middleware de redirection dans le projet actuel (déjà fait si `middleware.ts` existe).

## 📈 Checklist finale

- [ ] DNS configurés chez le registrar
- [ ] Variables d'environnement mises à jour sur Vercel
- [ ] Code commité et pushé
- [ ] Site accessible sur https://getfinsight.fr
- [ ] Site accessible sur https://www.getfinsight.fr
- [ ] SSL actif (cadenas vert dans le navigateur)
- [ ] Google Search Console configuré
- [ ] Sitemap soumis à Google
- [ ] Analytics/GTM mis à jour
- [ ] Stripe webhooks mis à jour
- [ ] Tests manuels des fonctionnalités principales :
  - [ ] Inscription/Connexion
  - [ ] Upload de fichiers
  - [ ] Dashboard
  - [ ] AI Copilot
  - [ ] Paiement (en mode test)
  - [ ] Emails (vérifier les liens dans les emails)

## 🚨 Troubleshooting

### Le site ne charge pas
```bash
# Vérifier les DNS
dig getfinsight.fr
nslookup getfinsight.fr

# Si pas de réponse, attendre la propagation DNS (jusqu'à 48h)
# Si toujours rien, vérifier la configuration chez votre registrar
```

### Erreur de certificat SSL
```bash
# Attendre que Vercel génère le certificat (automatique après DNS valides)
# Cela prend généralement 5-10 minutes après la propagation DNS
```

### Variables d'environnement manquantes
```bash
# Lister toutes les variables
vercel env ls

# Ajouter une variable manquante
vercel env add NOM_DE_LA_VARIABLE production
```

### Redéployer manuellement
```bash
vercel --prod --force
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier les logs Vercel : https://vercel.com/otmanes-projects-eb39f3fe/fin-sights
2. Vérifier le statut des DNS : https://dnschecker.org/#A/getfinsight.fr
3. Documentation Vercel : https://vercel.com/docs/concepts/projects/domains

---

**Date de migration** : 26 janvier 2026  
**Ancien domaine** : https://finsight.zineinsight.com  
**Nouveau domaine** : https://getfinsight.fr  
**Projet Vercel** : fin-sights  
**Compte** : otmanes-projects-eb39f3fe

# Checklist de mise à jour des URLs - Migration vers getfinsight.fr

## 🔄 Modifications nécessaires dans le code

### 1. Variables d'environnement Vercel (À FAIRE MANUELLEMENT)

```bash
# Mettre à jour NEXTAUTH_URL
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Entrez: https://getfinsight.fr

# Ajouter NEXT_PUBLIC_SITE_URL si nécessaire
vercel env add NEXT_PUBLIC_SITE_URL production
# Entrez: https://getfinsight.fr
```

### 2. Fichiers à mettre à jour

#### ✅ Fichiers avec URLs hardcodées trouvés :

- [ ] `src/pages/api/cron/check-alerts.ts` - Ligne 161
  - Changer : `https://finsight.zineinsight.com/dashboard`
  - En : `https://getfinsight.fr/dashboard`

- [ ] `src/app/mentions-legales/page.tsx` - Ligne 28
  - Changer : `finsight.zineinsight.com`
  - En : `getfinsight.fr`

#### ℹ️ URLs Calendly (optionnel - à garder si toujours valides)
- `https://calendly.com/zineinsight` (dans plusieurs fichiers)

#### ℹ️ Mentions ZineInsight (à garder)
- Les mentions légales de ZineInsight doivent rester (éditeur légal)
- Emails `contact@zineinsight.com` peuvent rester

### 3. Configuration Next.js

Vérifier `next.config.js` pour d'éventuelles URLs hardcodées.

### 4. Fichiers de configuration SEO

- [ ] Vérifier `src/app/layout.tsx` pour les métadonnées
- [ ] Vérifier `public/robots.txt`
- [ ] Vérifier `public/sitemap.xml` s'il existe

### 5. Variables d'environnement locales

- [ ] Mettre à jour `.env.local` si vous en avez un
- [ ] Mettre à jour `.env.example` si vous en avez un

## 🚀 Ordre d'exécution recommandé

1. ✅ Domaine ajouté à Vercel
2. ⏳ **Configurer les DNS** (chez votre registrar)
3. ⏳ **Mettre à jour les URLs dans le code** (étape 2 ci-dessus)
4. ⏳ **Mettre à jour les variables d'environnement** (étape 1 ci-dessus)
5. ⏳ **Commit et push** les modifications
6. ⏳ **Redéployer** : `vercel --prod`
7. ⏳ **Tester** le nouveau domaine
8. ⏳ **Mettre à jour Google Search Console** (nouveau domaine)
9. ⏳ **Mettre à jour Analytics** (nouveau domaine)

## 📊 Services tiers à mettre à jour

- [ ] Google Search Console - Ajouter propriété getfinsight.fr
- [ ] Google Analytics / GTM - Mettre à jour le domaine
- [ ] Microsoft Clarity - Mettre à jour le domaine
- [ ] Stripe - Mettre à jour les URLs de callback si nécessaire
- [ ] NextAuth - Via variable d'environnement NEXTAUTH_URL

## 🔍 Vérifications post-déploiement

```bash
# Vérifier que le domaine est actif
curl -I https://getfinsight.fr

# Vérifier les DNS
dig getfinsight.fr
nslookup getfinsight.fr

# Vérifier le certificat SSL
openssl s_client -connect getfinsight.fr:443 -servername getfinsight.fr
```

---

**Créé le** : 26 janvier 2026

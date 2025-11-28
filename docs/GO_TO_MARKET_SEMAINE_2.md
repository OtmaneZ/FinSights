# 🚀 GO-TO-MARKET - Semaine 2
**Date début**: 2 Décembre 2025  
**Objectif**: Obtenir les 50-100 premiers utilisateurs

---

## 🎯 Mission Semaine 2

**STOP CODER. LANCER LE PRODUIT.**

FinSight V2 est techniquement prêt (voir `STABILISATION_FINALE.md`).  
Maintenant : **traction utilisateurs**.

---

## 📋 TODO Semaine 2 (7 tâches)

### 1. ✨ Page d'accueil simplifiée (4h)

**Objectif**: Message clair pour CFO/DAF

**Punchline à choisir**:
```
Option A: "Déposez votre export comptable → obtenez un rapport clair en 10 secondes."
Option B: "Votre dashboard financier instantané, sans Excel."
Option C: "Données comptables → KPIs + IA financière. En 2 minutes."
```

**À faire**:
- [ ] Réécrire hero section `/src/app/page.tsx`
- [ ] Ajouter 3 screenshots dashboard (PME, Startup, Scale-up)
- [ ] CTA principal: "Essayer gratuitement" (pas "Démo")
- [ ] Section "Comment ça marche" (3 étapes visuelles)
- [ ] Testimonials section (vides pour l'instant, ready)
- [ ] Footer: Liens légaux (CGU, Politique confidentialité)

**Design**:
- Hero avec gradient + screenshot dashboard animé
- 3 colonnes features: Upload → Analyse → Export
- Trust badges: "Données sécurisées" + "Export PDF pro"

---

### 2. 💰 Pricing simplifié (2h)

**Objectif**: Clarifier la value FREE vs PRO

**À faire**:
- [ ] Table comparative claire (comme Notion, Linear)
- [ ] FREE: "Pour tester" → 10 questions IA/jour, 5 uploads/mois
- [ ] PRO: "Pour analyser" → Illimité, 90 jours historique, export clean
- [ ] SCALE: "Pour équipes" → Multi-users, 3 ans historique
- [ ] CTA: "Commencer gratuitement" puis upgrade in-app

**Fichier**: `/src/app/pricing/page.tsx` (déjà bon, polish UI)

---

### 3. 🎥 Démo vidéo 60s (3h)

**Objectif**: Montrer la valeur en 1 minute

**Script**:
```
00-10s: "CFO/DAF, vous perdez des heures sur Excel ?"
10-20s: [Screen] Upload CSV demo-data.csv
20-35s: [Screen] Dashboard génère 7 KPIs automatiquement
35-45s: [Screen] IA Copilot répond "Quelle est ma marge nette ?"
45-55s: [Screen] Export PDF professionnel en 1 clic
55-60s: CTA "Essayez gratuitement → finsight.fr"
```

**Outils**:
- Loom (enregistrement écran)
- OU Kapwing (montage simple)
- Voix-off FR ou sous-titres

**Diffusion**:
- Intégrer sur homepage
- YouTube (SEO)
- LinkedIn post

---

### 4. 📝 Article LinkedIn (2h)

**Objectif**: Attirer CFO/DAF early adopters

**Titre suggéré**:
```
"J'ai construit un dashboard financier IA en 30 jours.
Voici ce que j'ai appris sur les besoins des CFO."
```

**Structure**:
1. **Problème**: CFO passent 10h/semaine sur Excel pour des KPIs basiques
2. **Solution**: Upload CSV → Dashboard adaptatif en 10s
3. **Tech**: Next.js + OpenAI + Stripe (credibility)
4. **Demo**: 3 scénarios (PME, Startup, Scale-up)
5. **CTA**: "Testez gratuitement" + lien

**Ton**: Founder transparent, pas marketer

**Hashtags**: #FinTech #CFO #SaaS #IA #Finance

---

### 5. 🧮 Calculateur DSO gratuit (4h)

**Objectif**: Lead magnet SEO

**Fonctionnalité**:
- Input: Créances clients (€) + CA annuel (€)
- Output: DSO (jours) + interpretation colorée
- Design: Landing page `/dso-calculator`
- CTA: "Analysez tout votre fichier avec FinSight"

**Formule DSO**:
```typescript
DSO = (Créances clients / CA annuel) × 365
```

**SEO**:
- Title: "Calculateur DSO gratuit - Délai de paiement clients"
- Meta: "Calculez votre DSO en 10 secondes. Outil gratuit pour CFO/DAF."
- Keywords: "dso calculator", "délai paiement clients", "kpi financier"

---

### 6. 📊 Post SEO (Cash Flow) (3h)

**Objectif**: Trafic organique Google

**Article blog** `/blog/cash-flow-prevision`:
```markdown
# Comment prévoir son cash flow en 2025 (guide CFO)

## Introduction
Le cash flow est le KPI #1 pour les PME...

## Méthode classique (Excel)
[Capture Excel compliqué]

## Méthode moderne (FinSight)
[Screenshot dashboard Cash Flow Evolution]

## 5 erreurs à éviter
1. Oublier les créances à 60 jours
2. Ne pas prévoir la saisonnalité
...

## Conclusion
CTA: "Automatisez votre suivi avec FinSight"
```

**SEO**:
- Title: "Prévoir son cash flow : guide CFO 2025"
- Meta: "Méthodes, formules et outils pour anticiper votre trésorerie. Guide complet avec exemples PME/Startup."
- Keywords: "cash flow prévision", "trésorerie entreprise", "kpi cfo"

---

### 7. 🎯 Test utilisateurs (ongoing)

**Objectif**: 50 signups semaine 2

**Canaux**:

1. **LinkedIn organique** (0€)
   - Post article founder story
   - Commenter posts #CFO #SaaS
   - DM 20 CFO/DAF avec message perso

2. **Product Hunt** (0€)
   - Launch mardi/mercredi (meilleur trafic)
   - Titre: "FinSight - Dashboard financier IA instantané"
   - Tagline: "Upload CSV → KPIs en 10s"
   - GIF démo workflow complet

3. **Communautés** (0€)
   - Reddit: r/SaaS, r/entrepreneur (pas spam)
   - Discord: communities SaaS founders
   - Slack: groupes finance/CFO

4. **Email direct** (0€)
   - Liste 50 CFO startups (LinkedIn scraping)
   - Message court: "Bonjour [Prénom], j'ai créé outil pour CFO, 2 min pour tester ?"

**Tracking**:
```
Google Analytics: Conversions signup
Stripe: Upgrades FREE → PRO
Copilot usage: Questions posées/jour
```

---

## 📈 Métriques Success Semaine 2

### Objectifs Minimaux
- [ ] 50 signups FREE
- [ ] 500 visitors homepage
- [ ] 1 article LinkedIn (100+ vues)
- [ ] 1 démo vidéo (publiée)
- [ ] Page d'accueil simplifiée (live)

### Objectifs Stretch
- [ ] 100 signups FREE
- [ ] 1000 visitors homepage
- [ ] 3 upgrades PRO (3 × 79€ = 237€)
- [ ] Product Hunt top 10 daily
- [ ] 1 article blog SEO indexé

---

## 🛠️ Outils Semaine 2

### Gratuits
- ✅ **Google Analytics**: Déjà installé (GTM-58BZSL7W)
- ✅ **Microsoft Clarity**: Heatmaps (ud37rbzjnx)
- ✅ **Vercel Analytics**: Performance monitoring
- ✅ **Stripe Dashboard**: Conversion tracking
- ⏳ **Loom**: Vidéo démo (plan gratuit)
- ⏳ **Canva**: Visuels LinkedIn/Product Hunt

### Payants (optionnel)
- LinkedIn Premium (80€/mois) → accès InMail CFO
- Google Ads (budget test 100€) → si organic insufficient

---

## ⚠️ Règles Semaine 2

### ✅ À FAIRE
1. Publier contenu (LinkedIn, blog, vidéo)
2. Parler à utilisateurs (DM, calls, feedback)
3. Tracker métriques (signups, usage, churn)
4. Itérer messaging (A/B test punchlines)
5. Répondre questions (support réactif)

### ❌ À NE PAS FAIRE
1. **Coder nouvelles features** → Produit déjà complet
2. **Perfectionnisme design** → Homepage "good enough" suffit
3. **Publicité massive** → Organic d'abord, ads après validation
4. **Ignorer feedback** → Early users = gold insights
5. **Spam LinkedIn** → Quality > quantity

---

## 📅 Planning Semaine 2

### Lundi 2 Déc
- [ ] Matin: Réécrire homepage (punchline + hero)
- [ ] AM: Créer vidéo démo 60s (Loom)
- [ ] Soir: Publier vidéo YouTube + intégrer homepage

### Mardi 3 Déc
- [ ] Matin: Écrire article LinkedIn founder story
- [ ] AM: Publish LinkedIn + répondre comments
- [ ] Soir: Launch Product Hunt (préparer assets)

### Mercredi 4 Déc
- [ ] Toute journée: Product Hunt (répondre comments, upvotes)
- [ ] Soir: DM 10 premiers CFO LinkedIn

### Jeudi 5 Déc
- [ ] Matin: Créer calculateur DSO landing page
- [ ] AM: SEO optimization (meta tags, sitemap)
- [ ] Soir: DM 10 CFO supplémentaires

### Vendredi 6 Déc
- [ ] Matin: Écrire article blog cash flow
- [ ] AM: Publish blog + submit Google indexing
- [ ] Soir: Analyser métriques semaine (GA, Stripe)

### Weekend 7-8 Déc
- [ ] Calls utilisateurs early adopters (30 min chacun)
- [ ] Noter feedback produit (features requests, bugs)
- [ ] Préparer roadmap semaine 3 selon learnings

---

## 🎤 Messages Clés (Elevator Pitch)

### Version courte (1 phrase)
```
"FinSight transforme votre export comptable en dashboard professionnel avec IA en 10 secondes."
```

### Version LinkedIn (3 phrases)
```
Les CFO/DAF passent 10h/semaine sur Excel pour des KPIs basiques.

FinSight analyse automatiquement votre CSV et génère un dashboard adaptatif avec 15+ KPIs, 
charts interactifs et copilote IA pour répondre à vos questions financières.

Essayez gratuitement → pas de CB requise.
```

### Version pitch call (30s)
```
"Bonjour, je suis Otmane, j'ai créé FinSight pour les CFO/DAF qui perdent du temps sur Excel.

Vous uploadez votre export comptable CSV, en 10 secondes vous avez un dashboard professionnel 
avec CA, marges, cash flow, DSO... Le copilote IA répond à vos questions en français sur vos 
vraies données.

C'est gratuit pour tester, pas de carte bancaire. Ça vous intéresse de voir une démo 2 minutes ?"
```

---

## 🔍 Feedback à Collecter

### Questions pour Early Users

Après signup:
1. "Comment avez-vous découvert FinSight ?"
2. "Quel problème cherchez-vous à résoudre ?"
3. "Utilisez-vous déjà un outil pour vos KPIs financiers ?"

Après 1er upload:
1. "Le dashboard affiche-t-il les KPIs que vous cherchez ?"
2. "Manque-t-il des métriques importantes pour vous ?"
3. "Le design est-il clair / professionnel ?"

Après 1 semaine:
1. "Utilisez-vous FinSight régulièrement ?"
2. "Si non, qu'est-ce qui bloque ?"
3. "Paieriez-vous 79€/mois pour la version PRO ?"

### Méthode
- Email automatique (Resend) avec Typeform link
- OU appels Calendly 15 min
- Noter dans Notion database

---

## 💰 Coûts Semaine 2

### Infrastructure (déjà payé)
- Vercel Pro: 20$/mois (déjà actif)
- Vercel Postgres: 0$ (free tier pour <100 users)
- Vercel KV: 0$ (free tier)
- Stripe: 0% (pas de transactions encore)
- OpenAI API: ~10$/mois (GPT-4o-mini cheap)
- Pinecone: 0$ (free tier 1 index)

### Marketing (budget 0€)
- LinkedIn organic: 0€
- Product Hunt: 0€
- Reddit/Discord: 0€
- Blog SEO: 0€
- DM outreach: 0€

**Total semaine 2: ~25-30€ (infra only)**

---

## 🎯 Success Criteria

**Semaine 2 réussie si**:
1. ✅ 50+ signups FREE
2. ✅ 5+ utilisateurs actifs (upload + copilot)
3. ✅ 1+ upgrade PRO (validation pricing)
4. ✅ Homepage live avec message clair
5. ✅ Contenu publié (LinkedIn + vidéo + blog)
6. ✅ Feedback users collecté (10+ réponses)

**Semaine 2 échouée si**:
- < 20 signups → problème messaging/distribution
- 0 upgrades PRO → problème pricing/value
- 0 engagement copilot → feature pas utile
- Bugs critiques → retour stabilisation

---

## 📝 Notes Finales

### Mindset Founder
- **Patience**: Traction prend 4-8 semaines minimum
- **Itération**: Tester messaging, écouter feedback
- **Focus**: Go-to-market only, pas de nouvelles features
- **Réalisme**: 50 users semaine 2 = excellent pour solo founder

### Prochaines Étapes (Semaine 3+)
1. Si traction OK → Doubler distribution (ads, partnerships)
2. Si traction faible → Pivoter messaging ou niche
3. Si feedback négatif → Améliorer UX/features demandés
4. Si upgrades PRO → Scaler infra, préparer SCALE plan

---

**Document créé le**: 28 Novembre 2025  
**Phase**: GO-TO-MARKET READY  
**Next Review**: 6 Décembre 2025 (fin semaine 2)


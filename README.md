# FinSight - Finance Augmentée pour CFO/DAF 🚀

**Dashboard financier automatisé + Copilote IA pour dirigeants d'entreprise**

> **Plateforme d'analyse financière intelligente propulsée par GPT-4o**  
> Transformez vos données CSV/Excel en insights actionnables en 3 minutes

---

## 🎯 **CE QUE JE PROPOSE**

### Dashboard Financier Automatisé + IA CFO

**Pour qui ?**  
✅ CFO/DAF de PME et ETI françaises  
✅ Dirigeants d'entreprise sans équipe finance dédiée  
✅ Responsables financiers cherchant à automatiser leur reporting

**Que fait FinSight ?**
1. **📤 Import automatique** : Uploadez votre fichier CSV/Excel (données bancaires, compta, ERP)
2. **🔄 Analyse instantanée** : L'IA structure vos données et calcule 15+ KPIs financiers en 30 secondes
3. **📊 Dashboard interactif** : Visualisez CA, trésorerie, marges, DSO, créances, top clients
4. **🤖 Copilote CFO** : Posez vos questions en langage naturel, obtenez des réponses d'expert avec GPT-4o
5. **💡 Insights automatiques** : Détection d'anomalies, alertes trésorerie, recommandations actionnables

**Technologie :**
- 🧠 **IA CFO** : Prompts engineering spécialisés finance française (DSO, BFR, marge nette)
- 🔌 **OpenAI GPT-4o** : Analyse conversationnelle temps réel
- 📊 **Benchmarks sectoriels** : Comparaison automatique (Services, Commerce, Industrie, SaaS)
- 🎯 **Adaptatif** : Le dashboard s'enrichit selon vos données (créances, catégories, clients)

---

## 🚀 **DÉMO EN LIGNE**

**🌐 Testez maintenant :** [finsight.zineinsight.com](https://finsight.zineinsight.com)

- Cliquez sur **"Voir la démo"** pour charger des données fictives PME Services (243k€ CA)
- Testez le **Copilote IA** avec des questions comme :
  - "Quelle est la part de Société Générale Digital dans le CA ?"
  - "Comment se compare la marge au benchmark SaaS B2B ?"
  - "Quels sont les 3 plus gros postes de dépenses ?"

---

## ✨ **FONCTIONNALITÉS**

### 📊 **Dashboard Automatisé**
- **KPIs temps réel** : CA, Trésorerie, Marge nette, DSO, BFR, EBITDA
- **Indicateurs visuels** : Icons différenciés (💰📉📊💵), variations contextualisées
- **Benchmarks sectoriels** : Barres visuelles comparant votre performance au marché
- **Alertes intelligentes** : ⚠️ Marge exceptionnelle, créances en retard, trésorerie critique

### 🤖 **Copilote IA CFO** (GPT-4o)
- **Analyse conversationnelle** : Questions en français naturel
- **Expertise finance** : Prompts engineering spécialisés (tutoiement professionnel, format structuré)
- **Réponses actionnables** : 📊 Constat → 🔍 Analyse → 💡 Actions prioritaires
- **Suggestions dynamiques** : Questions adaptées à vos données réelles

### 📈 **Visualisations Avancées**
- **Cash Flow Evolution** : Graphique temporel avec projections
- **Structure des charges** : Breakdown par catégorie
- **Évolution des marges** : Tendances sur plusieurs mois
- **Top clients** : Analyse de concentration commerciale
- **Créances** : Suivi des impayés et retards

### 🔒 **Sécurité & Confidentialité**
- **100% local** : Vos données restent dans votre navigateur
- **Pas de stockage serveur** : Analyse en temps réel uniquement
- **Protocole sécurisé** : HTTPS + validation côté client

---

## 🛠️ **STACK TECHNIQUE**

### **Frontend**
- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage strict pour robustesse
- **Tailwind CSS** : Styling moderne et responsive

### **IA & Analyse**
- **OpenAI GPT-4o** : Copilote conversationnel expert finance
- **Prompts Engineering** : Système de prompts spécialisés CFO/DAF français
- **Analyse adaptative** : KPIs calculés selon données disponibles (DSO, BFR, marges)

### **Visualisation**
- **Recharts** : Graphiques interactifs (cash flow, marges, créances)
- **Custom Components** : KPI cards avec icons, benchmarks, tooltips
- **Dark mode** : Interface professionnelle optimisée

### **Sécurité**
- **Traitement client-side** : Vos données ne quittent jamais votre navigateur
- **API sécurisées** : Calls OpenAI via backend proxy Next.js
- **Validation** : Parsing strict des données CSV/Excel

---

## 🚀 **INSTALLATION & DÉMARRAGE**

### Prérequis
```bash
Node.js 18+ 
npm ou yarn
```

### Installation
```bash
# Cloner le repo
git clone https://github.com/OtmaneZ/FinSights.git
cd finsights

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Ajouter votre clé OpenAI dans .env.local :
# OPENAI_API_KEY=sk-...

# Lancer en développement
npm run dev
```

### URLs Locales
- **Homepage** : `http://localhost:3000`
- **Dashboard Démo** : `http://localhost:3000/dashboard`

### Build Production
```bash
npm run build
npm start
```

---

## 📋 **STRUCTURE DU PROJET**

```
/src
  /app                          # Pages Next.js
    page.tsx                    # Homepage (présentation)
    /dashboard                  # Dashboard financier
      page.tsx
    /methodologie               # Méthodologie (redirect)
      page.tsx
  
  /components                   # Composants React
    FinancialDashboard.tsx      # Dashboard principal (1400+ lignes)
    AICopilot.tsx               # Copilote IA conversationnel
    BenchmarkBar.tsx            # Barres de benchmark sectorielles
    AlertsPanel.tsx             # Alertes financières
    KPITooltip.tsx              # Tooltips explicatifs KPIs
    /charts                     # Visualisations Recharts
      CashFlowEvolutionChart.tsx
      ExpenseBreakdownChart.tsx
      MarginEvolutionChart.tsx
      TopClientsVerticalChart.tsx
      OutstandingInvoicesChart.tsx
  
  /lib                          # Logique métier
    /copilot
      prompts.ts                # Système de prompts GPT-4o CFO
    dataParser.ts               # Parsing CSV/Excel
    financialFormulas.ts        # Calculs KPIs (DSO, BFR, marges)
    dashboardConfig.ts          # Configuration adaptative
    benchmarks.ts               # Benchmarks sectoriels
  
  /pages/api                    # API Routes Next.js
    /copilot
      chat.ts                   # Endpoint GPT-4o
    /financial
      data.ts                   # Processing données
    upload.ts                   # Upload CSV
  
  /styles
    finsight-revolutionary.css  # Design system global
    globals.css
  
/public
  /images                       # Assets
  demo-data.csv                 # Données démo PME Services
```

---

## 🎓 **CRÉDITS & AUTEUR**

**Développé par Otmane Boulahia**  
🎓 Master Finance Internationale (Université Côte d'Azur)  
👨‍🏫 10 ans d'enseignement Finance & Gestion  
💻 Data Analytics (LeWagon Bootcamp 2025)

**Projet Final LeWagon 2025**  
*Thème : Finance Augmentée par IA pour PME/ETI françaises*

**Contact :**  
- 🌐 Website : [zineinsight.com](https://www.zineinsight.com)
- 💼 LinkedIn : [Otmane Boulahia](https://www.linkedin.com/in/otmane-boulahia-553bb6363/)
- 📧 Email : contact@zineinsight.com
- 📅 Calendly : [Prendre RDV](https://calendly.com/zineinsight)

---

## 📄 **LICENCE**

Propriété privée © 2025 ZineInsights  
Tous droits réservés

---

## 🚀 **ROADMAP 2025**

### ✅ **Q4 2025 - MVP Production**
- [x] Dashboard automatisé avec 15+ KPIs
- [x] Copilote IA GPT-4o intégré
- [x] Benchmarks sectoriels
- [x] Design professionnel dark mode
- [x] Démo en ligne fonctionnelle

### 🔄 **Q1 2026 - Industrialisation**
- [ ] Templates sectoriels (Services, Commerce, Industrie, SaaS)
- [ ] Export PDF personnalisé (logo client, charte graphique)
- [ ] Module upload automatique banques/compta
- [ ] Dashboard responsive mobile-first

### 🎯 **Q2 2026 - Scale**
- [ ] Connecteurs API (Qonto, Pennylane, Sage)
- [ ] Multi-utilisateurs avec permissions
- [ ] Alertes email automatiques
- [ ] Projections IA avancées (ML forecasting)

---

**⭐ Si vous trouvez ce projet utile, pensez à le star sur GitHub !**

**Avantages :**
- ✅ **Cash rapide** pour financer la suite
- ✅ **Faisable solo** avec laptop
- ✅ **Proof of concept** pour futures offres
- ✅ **Différenciation** vs SaaS génériques

## 🔗 **Intégration ZineInsight**

FinSight s'intègre dans l'écosystème ZineInsight avec **Option A** :
- **Préservation** du contenu ZineInsight existant
- **Ajout** des pages FinSight (/finsight/)
- **Navigation unifiée** entre les deux univers
- **Design Revolutionary** harmonisé

## 📧 **Contact & Développement**

**Développé par :** Otmane Boulahia - Zine Insight
**Positionnement :** Expert en solutions financières sur-mesure pour PME/ETI
**Spécialité :** Dashboard intelligents + IA + Design entreprise

---

*FinSight © 2025 - Démonstration technologique "Product-enabled Services"*
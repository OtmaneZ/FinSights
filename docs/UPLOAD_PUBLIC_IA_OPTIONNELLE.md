# 🔓 Upload Public + IA Optionnelle

## ✅ Changements appliqués

### 1. **Upload API désormais PUBLIC** (sans auth requise)

**Avant** :
```typescript
const session = await getServerSession(req, res, authOptions);

if (!session?.user) {
    return res.status(401).json({ error: 'Authentification requise' });
}
```

**Après** :
```typescript
const session = await getServerSession(req, res, authOptions);

const isAuthenticated = !!session?.user;
const userId = session?.user?.id || null;

// ✅ Visiteurs anonymes acceptés
// Rate limit par IP (3 uploads permanent)
```

---

### 2. **IA Optionnelle** (fallback sur parser classique)

**aiParser.ts** :
```typescript
export async function parseWithAI(...) {
    // ⚠️ Si pas de clé API, skip IA
    if (!process.env.OPENAI_API_KEY) {
        return {
            success: false,
            error: 'IA indisponible (clé API manquante)',
        };
    }
    
    // Sinon, utilise Gemini Flash via OpenRouter
}
```

**upload.ts** :
```typescript
// ✅ FALLBACK automatique
if (!aiParseResult.success) {
    // Tente parser classique (parseCSV)
    const classicParseResult = parseCSV(csvContent);
}
```

---

### 3. **Rate Limiting Intelligent**

| État | Limite Uploads | Reset |
|------|---------------|-------|
| **Anonyme (IP)** | 3 uploads | Permanent |
| **Connecté FREE** | 10 uploads | Par mois |
| **Connecté PRO** | Illimité | - |

**Message utilisateur anonyme (après 3 uploads)** :
```
📂 Limite atteinte (3 uploads).
Créez un compte gratuit pour uploads illimités !
```

---

## 🧠 IA Utilisée Où ?

### Mode 1 : **Petits fichiers (< 500 lignes)**
- ✅ IA fait **tout le parsing** (nettoyage intelligent)
- Modèle : `google/gemini-2.0-flash-exp:free` (gratuit via OpenRouter)
- Corrige fautes frappe, normalise dates, déduit catégories

### Mode 2 : **Gros fichiers (> 500 lignes)**
- ✅ **Parser classique** : extraction exhaustive (TOUTES les lignes)
- ✅ **IA sur échantillon** (100 premières lignes) : enrichissement catégories
- Hybride = rapidité + qualité

### Mode 3 : **Fallback (IA indisponible)**
- ✅ Parser classique **seul** (0% IA)
- Parsing basique mais fonctionnel
- Formules financières automatiques (DSO, BFR, marges)

---

## 📊 Ce Qui Fonctionne SANS IA

### Parsing Classique (`parseCSV`)
- ✅ Détecte colonnes automatiquement (date, montant, description)
- ✅ Normalise formats dates (DD/MM/YYYY, MM-DD-YYYY, etc.)
- ✅ Détecte débit/crédit ou montants signés
- ✅ Catégorise basiquement (mots-clés)

### Calculs Financiers (`financialFormulas.ts`)
- ✅ DSO (délai paiement) depuis dates transactions
- ✅ BFR estimé depuis DSO + flux trésorerie
- ✅ Marges (brute, nette) depuis revenus/dépenses
- ✅ Variations période N vs N-1

### Alertes Basiques (`AlertsPanel.tsx`)
- ✅ DSO > 60j → Alerte tension trésorerie
- ✅ Cash < 0 → Alerte rupture cash
- ✅ Marge < 10% → Alerte érosion marge
- ✅ BFR > 30j CA → Alerte cycle ralenti

---

## 🎯 Flux Utilisateur Anonyme

### Étape 1 : Upload
```
Visiteur → /demo → "Importer Données" → Sélectionne CSV
         ↓
API /upload (PUBLIC, rate limit IP: 3/permanent)
         ↓
Parsing (IA si disponible, sinon classique)
         ↓
Dashboard affiché avec KPIs auto-calculés
```

### Étape 2 : Alertes
```
Dashboard → Calcul DSO, Cash, Marge (automatique)
          ↓
AlertsPanel → Génère alertes (4 règles basiques)
          ↓
Affichage des signaux faibles
```

### Étape 3 : Limitation
```
Après 3 uploads → Message :
"📂 Limite atteinte. Créez un compte gratuit pour uploads illimités !"
                    ↓
               /auth/signup
```

---

## 🔧 Configuration Environnement

### Variables .env (optionnelles)

```bash
# IA (optionnel - fallback si absent)
OPENAI_API_KEY=sk-or-v1-xxxxx  # OpenRouter key

# Auth (optionnel pour upload public)
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=http://localhost:3000

# Rate Limit (requis pour uploads anonymes)
KV_REST_API_URL=xxx
KV_REST_API_TOKEN=xxx
```

**Si `OPENAI_API_KEY` absente** :
- ✅ Parser classique utilisé automatiquement
- ⚠️ Pas de nettoyage intelligent / correction fautes
- ⚠️ Catégories moins précises

---

## ✅ Avantages

### Pour Visiteurs Anonymes
- ✅ Tester **sans compte** (3 uploads)
- ✅ Voir KPIs calculés automatiquement
- ✅ Découvrir alertes basiques
- ✅ Évaluer valeur produit

### Pour Conversion
- ✅ Message clair après 3 uploads : "Créez un compte gratuit"
- ✅ Compte FREE → 10 uploads/mois (largement suffisant)
- ✅ Upgrade PRO → Illimité + IA avancée

### Pour Coûts
- ✅ IA gratuite (Gemini Flash via OpenRouter)
- ✅ Parser classique = 0€
- ✅ Rate limit évite abus

---

## 📝 Tests Recommandés

### Test 1 : Upload Anonyme
1. Ouvre `/demo` (sans compte)
2. Upload `test-vraies-donnees.csv`
3. Vérifie KPIs calculés automatiquement
4. Vérifie alertes affichées

### Test 2 : Limite Anonyme
1. Upload 3 fichiers CSV
2. Tentative 4ème upload
3. Vérifie message : "📂 Limite atteinte..."

### Test 3 : Fallback Sans IA
1. Supprime `OPENAI_API_KEY` de .env
2. Upload CSV
3. Vérifie parser classique fonctionne
4. Vérifie KPIs corrects

---

## 🚀 Prochaines Étapes

### Phase 1 : Validation (maintenant)
- [x] Upload public fonctionnel
- [x] IA optionnelle avec fallback
- [x] Rate limit IP (3 uploads)
- [ ] Tester avec vrais CSV comptables

### Phase 2 : Amélioration Conversion
- [ ] Popup après 1er upload : "Créez un compte pour sauvegarder"
- [ ] Tracking analytics : combien d'anonymes → signup ?
- [ ] A/B test : 3 vs 5 uploads avant blocage

### Phase 3 : Qualité IA
- [ ] Logs parsing IA vs classique
- [ ] Métriques qualité catégories détectées
- [ ] Feedback utilisateur sur précision

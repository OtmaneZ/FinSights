# 🔒 PROTECTION API OPENAI

## ✅ Ce qui a été implémenté

### 1. Rate Limiting (10 requêtes/heure par IP)

**Fichier** : `src/lib/rateLimit.ts`

**Configuration actuelle** :
- ✅ **10 requêtes max par heure** par IP
- ✅ Fenêtre glissante (1 heure)
- ✅ Nettoyage automatique des entrées expirées
- ✅ Message d'erreur avec heure de reset

**Code protection** :
```typescript
const rateLimit = checkRateLimit(clientIP, {
    maxRequests: 10,      // ← Modifier ici pour changer la limite
    windowMs: 60 * 60 * 1000  // ← 1 heure (en millisecondes)
})
```

---

## 📊 Monitoring

### Logs dans le terminal
Chaque requête log :
```
🤖 Copilot v2.0 - Requête: {
  message: '...',
  ip: '123.456.789.0',
  remaining: 7  ← Requêtes restantes
}
```

### API Admin (WIP)
- `/api/admin/usage` : Stats d'utilisation
- Auth : `Authorization: Bearer YOUR_PASSWORD`

---

## ⚙️ Configuration

### Modifier les limites

**Dans** `src/pages/api/copilot/chat.ts` ligne ~45 :

```typescript
const rateLimit = checkRateLimit(clientIP, {
    maxRequests: 10,  // ← Augmenter/réduire ici
    windowMs: 60 * 60 * 1000  // ← Changer la fenêtre (1h = 3600000ms)
})
```

**Exemples de config** :
```typescript
// 5 requêtes par 30 minutes (strict)
{ maxRequests: 5, windowMs: 30 * 60 * 1000 }

// 20 requêtes par heure (permissif)
{ maxRequests: 20, windowMs: 60 * 60 * 1000 }

// 50 requêtes par jour (très permissif)
{ maxRequests: 50, windowMs: 24 * 60 * 60 * 1000 }
```

---

## 🚨 Comportement utilisateur

### Quand la limite est atteinte

**HTTP 429 - Too Many Requests**

```json
{
  "success": false,
  "error": "Limite de requêtes atteinte (10/heure). Réessayez après 15:34:22.",
  "rateLimitInfo": {
    "remaining": 0,
    "resetTime": 1699627462000
  }
}
```

**Message affiché dans l'UI** :
```
⚠️ Limite de requêtes atteinte (10/heure).
Réessayez après 15:34:22.
```

---

## 🛡️ Protection actuelle

### ✅ Ce qui est protégé
- [x] API OpenAI GPT-4 (`/api/copilot/chat`)
- [x] Rate limiting par IP (10/heure)
- [x] Messages d'erreur clairs
- [x] Logs de monitoring

### ⚠️ Limites actuelles (in-memory)
- ❌ Reset au redémarrage serveur
- ❌ Pas de persistance entre déploiements
- ❌ Pas de protection multi-instance (Vercel scale)

### 🚀 Pour améliorer (optionnel)

**Option 1 : Vercel KV (Redis)**
```bash
# Persistance entre déploiements
npm install @vercel/kv
```

**Option 2 : Auth avec clés API**
```typescript
// Générer des clés uniques par utilisateur
const apiKey = req.headers['x-api-key']
if (!apiKey || !isValidKey(apiKey)) {
  return res.status(401).json({ error: 'Clé API invalide' })
}
```

**Option 3 : Captcha pour demo**
```typescript
// Ajouter reCAPTCHA v3 sur le formulaire
const captchaValid = await verifyCaptcha(token)
```

---

## 💰 Coût estimé

**Avec 10 requêtes/heure max par IP** :

Hypothèses :
- 100 visiteurs uniques/jour
- 50% utilisent le copilot (50 users)
- Chacun fait 3 requêtes en moyenne

**Calcul** :
```
50 users × 3 requêtes × 30 jours = 4 500 requêtes/mois
4 500 × $0.002 (GPT-4o-mini) = $9/mois
```

**Avec limite actuelle (10/h)** :
- Max théorique : 10 req/h × 24h × 30j = 7 200 req/mois par IP
- Coût max par IP : $14.4/mois
- Peu probable d'atteindre ce max (users partent après 2-3 questions)

---

## 🎯 Recommandations

### Pour une demo publique :
✅ **Limite actuelle OK** : 10 req/heure = assez pour tester, pas assez pour abuser

### Pour production payante :
1. Implémenter auth avec API keys
2. Migrer vers Vercel KV (Redis)
3. Ajouter tiers (Free: 5/h, Pro: 50/h, Enterprise: illimité)

### Pour usage interne :
1. Ajouter whitelist d'IPs
2. Augmenter limite à 50/heure
3. Monitoring avec alertes email

---

## 🧪 Tester la protection

### 1. Test normal (OK)
```bash
# Requête 1-10 : OK
curl -X POST http://localhost:3000/api/copilot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test"}'
```

### 2. Test rate limit (11e requête)
```bash
# Requête 11 : HTTP 429
# Message : "Limite atteinte, réessayez après..."
```

### 3. Vérifier les logs
```bash
# Terminal npm run dev :
🤖 Copilot v2.0 - Requête: { ip: '127.0.0.1', remaining: 9 }
🤖 Copilot v2.0 - Requête: { ip: '127.0.0.1', remaining: 8 }
...
🤖 Copilot v2.0 - Requête: { ip: '127.0.0.1', remaining: 0 }
⚠️ Rate limit hit: 127.0.0.1
```

---

## 📝 TODO (optionnel)

- [ ] Ajouter dashboard admin (`/admin/usage`)
- [ ] Migrer vers Vercel KV pour persistence
- [ ] Implémenter API keys pour users authentifiés
- [ ] Ajouter alertes email si coût > $50/mois
- [ ] Créer tiers de pricing (Free/Pro/Enterprise)

---

**Protection active** : ✅ 10 requêtes/heure par IP
**Coût estimé** : ~$9-15/mois
**Status** : Production-ready pour demo 🚀

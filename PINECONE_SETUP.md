# 🧠 Configuration de la Mémoire Vectorielle (Pinecone)

La mémoire vectorielle permet au copilot IA de :
- Se souvenir des conversations passées
- Fournir des réponses contextuelles
- Éviter de régénérer les mêmes insights
- Comparer avec des entreprises similaires

## 📋 Setup (Optionnel - 5 min)

### 1. Créer un compte Pinecone

1. Aller sur https://www.pinecone.io/
2. S'inscrire (plan gratuit : 100k vecteurs, 1 index)
3. Créer un nouveau projet

### 2. Créer un index

Dans le dashboard Pinecone :
- **Index name** : `finsight-memory`
- **Dimensions** : `1536` (OpenAI text-embedding-3-small)
- **Metric** : `cosine`
- **Region** : Choisir la plus proche (ex: `us-east-1`)

### 3. Récupérer l'API Key

Dashboard Pinecone → API Keys → Copier la clé

### 4. Configurer .env.local

```bash
PINECONE_API_KEY=your-api-key-here
PINECONE_INDEX_NAME=finsight-memory
```

### 5. Redémarrer le serveur

```bash
npm run dev
```

## ✅ Vérification

Ouvrir la console du serveur :
- Si configuré correctement : `🧠 X conversations similaires trouvées`
- Si non configuré : `⚠️ Erreur mémoire vectorielle (non-bloquant)` (normal, l'app continue de fonctionner)

## 🔍 Namespaces utilisés

- `conversations` : Historique des chats
- `insights` : Insights financiers générés
- `companies` : Profils d'entreprises (benchmarking)
- `transactions` : Transactions similaires

## 💰 Coûts

**Pinecone (plan gratuit)** :
- 100 000 vecteurs
- 1 index
- Parfait pour une démo

**OpenAI Embeddings** :
- `text-embedding-3-small` : $0.02 / 1M tokens
- ~500 conversations = ~$0.01

## 🚀 Alternative sans Pinecone

Si vous ne configurez pas Pinecone, l'app fonctionne quand même ! La mémoire vectorielle est optionnelle.

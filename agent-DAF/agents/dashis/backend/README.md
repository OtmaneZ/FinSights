# DASHIS Backend - Moteurs IA/ML

Source de vérité pour les capacités d'intelligence artificielle de DASHIS.

## 📁 Structure

### `ai/` - Intelligence Artificielle (GPT-4)
- `predictions.ts` - Prédictions cash-flow 3-6 mois
- `patterns.ts` - Détection patterns clients avancés
- `copilot.ts` - Chat GPT-4 pour requêtes naturelles

### `ml/` - Machine Learning (TensorFlow.js)
- `anomalyDetector.ts` - Détection valeurs aberrantes
- `types.ts` - Types TypeScript pour ML
- `models/` - Modèles entraînés

### `scoring/` - Scoring Financier
- `finSightScore.ts` - Calcul score santé 0-100
- `benchmarks.ts` - Comparaison sectorielle

## 🔗 Utilisation
Ces modules sont importés depuis `src/lib/` via symlinks :
```typescript
import { detectAnomalies } from '@/lib/ml/anomalyDetector'
import { generateCashFlowPredictions } from '@/lib/ai/predictions'
import { calculateFinSightScore } from '@/lib/scoring/finSightScore'
```

## ⚠️ Important
**NE PAS dupliquer** ces fichiers dans `src/lib/`. Les symlinks garantissent une seule source de vérité.

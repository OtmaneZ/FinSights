# 📋 Améliorations Progressives - FinSight

## ✅ Fait (17 décembre 2025)

### Sécurité
- [x] CSP Headers ajoutés (protection XSS)
- [x] Headers de sécurité (X-Frame-Options, X-Content-Type-Options)

### Qualité
- [x] Scripts `lint:fix`, `typecheck`, `check` ajoutés

---

## 🔜 Roadmap Progressive (à faire QUAND NÉCESSAIRE)

### Phase 1 : Quand tu ajoutes une grosse feature au dashboard

**Objectif** : Refactoring `FinancialDashboardV2.tsx`

- [ ] Créer `components/dashboard/sections/KPISection.tsx`
- [ ] Créer `components/dashboard/sections/ChartsSection.tsx`
- [ ] Créer `hooks/useDashboardData.ts` (logique isolée)
- [ ] Tester que tout fonctionne toujours

**Temps estimé** : 3-4 heures
**Déclencheur** : Quand le fichier dépasse 2500 lignes OU que tu dois ajouter une section complexe

---

### Phase 2 : Quand tu as des vrais utilisateurs

**Objectif** : Tests automatisés critiques

- [ ] Installer Vitest : `npm install -D vitest @testing-library/react`
- [ ] Tester `calculateDSO()`, `calculateFinSightScore()` (formules critiques)
- [ ] Tester parsing CSV/Excel (fonctionnalité core)
- [ ] Setup CI/CD avec tests automatiques

**Temps estimé** : 1 journée
**Déclencheur** : 10+ utilisateurs actifs OU 1 bug critique détecté

---

### Phase 3 : Amélioration TypeScript (progressive)

**Objectif** : Éliminer les `any` petit à petit

**Stratégie incrémentale** :
1. Activer `"noImplicitAny": false` mais surveiller les nouveaux `any`
2. Chaque fois que tu modifies un fichier, corriger les `any` dedans
3. Dans 2-3 mois, activer `"noImplicitAny": true`

**Fichiers prioritaires** (ceux que tu modifies souvent) :
- [ ] `src/lib/dataParser.ts`
- [ ] `src/lib/financialFormulas.ts`
- [ ] `src/components/FinancialDashboardV2.tsx`

**Temps estimé** : 30 minutes par fichier
**Déclencheur** : Chaque fois que tu travailles sur un fichier

---

### Phase 4 : Performance (si nécessaire)

**Objectif** : Optimiser si les utilisateurs se plaignent de lenteur

- [ ] React.memo() sur `FinancialDashboardV2` si re-renders inutiles
- [ ] useMemo() sur calculs lourds (getMonthlyData, etc.)
- [ ] Lazy loading des graphiques D3 (Sankey, Sunburst)

**Temps estimé** : 2-3 heures
**Déclencheur** : Temps de chargement > 3 secondes OU utilisateurs se plaignent

---

## 📊 Métriques de Succès

| Métrique | Avant | Cible | Statut |
|----------|-------|-------|--------|
| Score Sécurité | 7/10 | 8.5/10 | ✅ **Atteint** |
| Lignes FinancialDashboardV2 | 1986 | <1000 | 🔜 Phase 1 |
| Tests automatisés | 0 | 20+ | 🔜 Phase 2 |
| Occurrences `any` | 50+ | <10 | 🔜 Phase 3 |
| Bundle size | ~1.2MB | <800KB | 🔜 Phase 4 |

---

## 🚦 Règle d'Or

> **"Si ça marche en production, ne touche pas sans raison"**

Améliore le code **quand tu y travailles**, pas "pour le principe".

---

*Document créé le 17 décembre 2025*

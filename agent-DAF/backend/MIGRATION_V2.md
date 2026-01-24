# 🔄 Migration V1 → V2 - TRESORIS

## 📦 Nouvelle Architecture (V2)

### Changements majeurs

**AVANT (V1)** : 7 étapes autonomes
```
collect → normalize → analyze → project → detect → propose → STOP
```

**APRÈS (V2)** : 3 étapes hyper-spécialisées
```
should_trigger → requalify_risks → propose_actions → STOP
```

---

## 📁 Organisation des fichiers

### ✅ Fichiers actifs (V2)

| Fichier | Description |
|---------|-------------|
| `main_v2.py` | API FastAPI V2 |
| `agent/risk_agent.py` | Agent hyper-spécialisé |
| `agent/memory_v2.py` | Mémoire avec audit trail |
| `agent/__init__.py` | Module mis à jour |
| `test_agent_v2.py` | Tests agent |
| `test_api_v2.py` | Tests API |
| `start_api_v2.sh` | Script démarrage |
| `stop_api.sh` | Script arrêt |

### 📦 Fichiers backupés (V1)

| Fichier | Backup |
|---------|--------|
| `main.py` | `main_v1_backup.py` |
| `agent/runner.py` | `agent/_archive/runner_v1.py` |
| `agent/scheduler.py` | `agent/_archive/scheduler_v1.py` |
| `agent/actions.py` | `agent/_archive/actions_v1.py` |
| `agent/memory.py` | `agent/_archive/memory_v1.py` |

### 🔧 Fichiers gardés (compatibilité)

- `agent/monitor.py` - Surveillance fichiers (utilisé par V2)
- `agent/triggers.py` - Règles déclenchement (utilisé par V2)
- `engine/finance.py` - Calculs trésorerie (à intégrer en V2 plus tard)
- `llm/claude.py` - LLM layer (à intégrer en V2 plus tard)

---

## 🚀 Utilisation V2

### Démarrer l'API

```bash
cd backend
./start_api_v2.sh
```

### Tester l'API

```bash
python test_api_v2.py
```

### Arrêter l'API

```bash
./stop_api.sh
```

### API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/agent/start` | POST | Démarre surveillance |
| `/agent/stop` | POST | Arrête l'agent |
| `/agent/status` | GET | Statut actuel |
| `/agent/analysis/latest` | GET | Dernière analyse |
| `/agent/risks` | GET | Risques détectés |
| `/agent/actions` | GET | Actions proposées |
| `/agent/validate` | POST | Validation DAF |
| `/agent/audit` | GET | Audit trail |
| `/agent/intelligence` | GET | Métriques |
| `/ws` | WebSocket | Temps réel |

---

## 🎯 Prochaines étapes

### Backend (en cours)
- ✅ Agent hyper-spécialisé créé
- ✅ Mémoire avec audit trail
- ✅ API V2 fonctionnelle
- ⏳ Intégrer engine/finance.py
- ⏳ Intégrer llm/claude.py pour notes

### Frontend (à faire)
- ⏳ Remplacer Timeline par Table des Risques
- ⏳ Boutons Valider/Rejeter
- ⏳ Note DG/DAF exportable PDF
- ⏳ Mise à jour WebSocket

### Nettoyage
- ⏳ Supprimer fichiers V1 après validation complète
- ⏳ Migrer frontend vers API V2
- ⏳ Documentation utilisateur

---

## 📊 Comparaison V1 vs V2

| Aspect | V1 | V2 |
|--------|----|----|
| **Étapes** | 7 | 3 |
| **Actions max** | Illimité | 3 (P1/P2/P3) |
| **Requalification** | Basique | CERTAIN → UNCERTAIN → CRITICAL |
| **Audit trail** | Partiel | Complet (décision → outcome) |
| **Scoring** | Non | Oui (0-100) |
| **Justifications** | Génériques | Explicites et défendables |
| **Gouvernance** | Basique | Validation DAF + traçabilité |

---

## ⚠️ Points d'attention

1. **Ne pas supprimer V1 tant que frontend pas migré**
2. **Les deux versions peuvent coexister**
3. **Données V1 et V2 sont séparées** (storage/memory vs storage/memory_v2)
4. **Tests à faire avant de passer en prod**

---

## 🔧 Développement

### Structure V2

```
backend/
├── main_v2.py                 # API V2
├── agent/
│   ├── risk_agent.py          # Agent principal
│   ├── memory_v2.py           # Mémoire V2
│   ├── monitor.py             # Surveillance (gardé)
│   ├── triggers.py            # Triggers (gardé)
│   └── _archive/              # Fichiers V1 archivés
├── storage/
│   └── memory_v2/             # Stockage V2
│       ├── analyses.json
│       ├── daf_decisions.json
│       ├── outcomes.json
│       └── audit_trail.json
└── test_*.py                  # Tests
```

### Tests

```bash
# Test agent seul
python test_agent_v2.py

# Test API complète
./start_api_v2.sh
python test_api_v2.py
./stop_api.sh
```

---

## 📝 Notes de version

### V2.0.0 (22 janvier 2026)
- ✅ Architecture hyper-spécialisée
- ✅ 3 étapes au lieu de 7
- ✅ Max 3 actions prioritaires
- ✅ Requalification CERTAIN → UNCERTAIN → CRITICAL
- ✅ Audit trail complet
- ✅ API REST + WebSocket
- ✅ Tests validés

### V1.0.0 (archivée)
- Architecture 7 étapes
- Actions illimitées
- Scoring basique
- Audit trail partiel

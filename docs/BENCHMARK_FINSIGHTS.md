# Benchmark Sectoriel FIBEN 2024 — Guide d'intégration FinSights

> Données certifiées Banque de France, Fascicules d'indicateurs sectoriels
> Base FIBEN, exercices 2024, publiés novembre 2025.
> Source : https://www.banque-france.fr/fr/publications-et-statistiques/statistiques/fascicules-dindicateurs-sectoriels

## Ce qui a été importé

| Fichier FinSights | Origine |
|---|---|
| `src/app/benchmark/page.tsx` | Page standalone benchmark (UI complète) |
| `src/app/api/benchmark/route.ts` | Proxy Next.js → FastAPI backend |

## Fichiers backend à déployer sur le serveur FastAPI FinSights

Ces fichiers viennent de `agent-ia-copilot/backend/` :

```
core/engines/accounting/sector_benchmark.py   ← Moteur principal (426 codes NAF)
api/v1/endpoints/benchmark.py                 ← Endpoints FastAPI REST
db/accounting_models.py                       ← Modèle BDD SectorBenchmarkRecord
alembic/versions/*_create_accounting_tables_*.py ← Migration BDD
```

### Installer les dépendances Python

```bash
pip install pdfplumber  # si re-extraction future des PDFs BdF
```

### Enregistrer le router FastAPI

Dans `main.py` de FinSights (ou équivalent) :

```python
from api.v1.endpoints.benchmark import router as benchmark_router
app.include_router(benchmark_router, prefix="/api/v1/benchmark", tags=["benchmark"])
```

## Configuration environnement

Dans `.env` du frontend FinSights :

```env
# URL du backend FastAPI FinSights
BACKEND_URL=https://api.finsights.fr   # ou Railway / Render URL

# Optionnel : commentaire IA
OPENROUTER_API_KEY=sk-or-...
```

La variable `BACKEND_URL` est utilisée par `src/app/api/benchmark/route.ts`
pour proxifier les appels vers FastAPI.

## Données couvertes

- **426 codes NAF** couverts (fallback par préfixe 2 chiffres = couverture totale)
- **69 divisions** économiques (fascicule 82 = 404 sur le site BdF)
- **5 ratios par secteur** :
  - Marge EBITDA (Q1 / Médiane / Q3) — EBITDA = Résultat net + Impôts + Intérêts + Amortissements & Dépréciations
  - Marge nette
  - Charges de personnel / CA
  - Taux d'approvisionnement (Achats / CA)
  - Rentabilité des fonds propres

## Ajouter le lien dans la navigation FinSights

Dans le composant de navigation :

```tsx
{ href: '/benchmark', label: 'Benchmark', icon: TrendingUp }
```

## Re-extraire les données BdF (futur)

Le script d'extraction industrielle est dans `agent-ia-copilot` :

```bash
cd /Users/otmaneboulahia/Agents/agent-ia-copilot/backend
python3 scripts/extract_fiben_sectors.py
```

Il télécharge automatiquement les ~70 PDFs de la Banque de France
et régénère `core/engines/accounting/sector_benchmark.py`.

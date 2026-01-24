# TRESORIS — Spécifications Techniques

## Vision
Surveiller la trésorerie en continu, requalifier les risques (26 situations → 2-5 vrais risques), proposer des décisions cash prioritaires.

## Cycle Autonome

```
Surveillance
    ↓
Calcul (position, runway, prévisions)
    ↓
Détection (26 situations anormales)
    ↓
Requalification (Certain / Incertain / Critique)
    ↓
Recommandations (3 actions max, chiffrées)
    ↓
STOP (validation DAF requise)
```

## Données d'entrée

- Fichiers transactions bancaires (CSV, OFX)
- Factures clients (PDF, CSV)
- Échéanciers de paiement
- Contrats fournisseurs
- Prévisions ventes (optionnel)

## Sorties

### Dashboard
- Position trésorerie actuelle
- Cash runway (4, 8, 13 semaines)
- Risques critiques & incertains (2-5 max)
- Actions recommandées (P1, P2, P3)

### Rapports
- Alerte trésorerie (email quotidien/hebdo)
- Synthèse risques (PDF mensuel)
- Scénarios trésorerie (export Excel)

## Règles métier

**26 Situations détectées** :
- Retards clients
- Charges fixes importantes
- Pics de trésorerie
- Variations saisonnières
- Etc.

**Requalification** : Certain / Incertain / Critique selon :
- Montant exposé
- Impact runway
- Probabilité occurrence
- Contrôle possible

## Stack Technique

- **Backend** : FastAPI (Python)
- **LLM** : Claude 3.5 Sonnet (contextualisation)
- **Frontend** : Next.js 14 + Tailwind CSS
- **Stockage** : JSON local (production → DB)

## Gouvernance

- ✅ Lecture seule sur données financières
- ❌ Aucun accès exécution (transactions, virements)
- ❌ Aucun engagement automatique
- ✅ 100% du pouvoir chez DAF/CEO

---

**Dernière mise à jour : 23 janvier 2026**

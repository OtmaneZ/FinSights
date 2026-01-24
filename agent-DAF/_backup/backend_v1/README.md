# 📦 Backup Backend V1 - TRESORIS

Ce dossier contient les fichiers de l'ancienne architecture (V1) avant migration vers V2.

## 📁 Contenu

- `main_v1_backup.py` - API FastAPI V1 complète
- `_archive/` - Modules agent V1
  - `runner_v1.py` - Orchestrateur 7 étapes
  - `scheduler_v1.py` - Scheduler autonome V1
  - `actions_v1.py` - Préparateur d'actions V1
  - `memory_v1.py` - Mémoire V1

## 📅 Date de backup

22 janvier 2026

## ⚠️ Important

Ces fichiers sont gardés pour référence historique.
La version V2 est maintenant active dans `/backend/`.

Pour restaurer V1 en cas de besoin :
```bash
cp _backup/backend_v1/main_v1_backup.py backend/main.py
cp -r _backup/backend_v1/_archive/* backend/agent/
```

## 🔄 Migration

Voir `/backend/MIGRATION_V2.md` pour les détails de la migration.

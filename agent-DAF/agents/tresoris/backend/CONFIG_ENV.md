# 🔧 Configuration TRESORIS

## Fichier `.env`

TRESORIS utilise un fichier `.env` pour la configuration. Cela vous permet de changer facilement le Google Sheet surveillé sans modifier le code.

---

## 🚀 Quick Start

### 1. Copiez l'exemple

```bash
cp .env.example .env
```

### 2. Modifiez `.env` avec votre Sheet ID

```bash
# Trouvez votre Sheet ID dans l'URL:
# https://docs.google.com/spreadsheets/d/[VOTRE_SHEET_ID]/edit
#                                       ↑━━━━━━━━━━━━━━━━━↑

SPREADSHEET_ID=votre_sheet_id_ici
```

### 3. Lancez l'API

```bash
python main.py
```

---

## 📊 Comment trouver votre Sheet ID ?

### Méthode 1: Dans l'URL

Ouvrez votre Google Sheet, l'URL ressemble à:
```
https://docs.google.com/spreadsheets/d/1b0ZrJRUMpjdEyNXqVRpUV8VWKepakd8hJhfGM9smtJs/edit#gid=0
```

Votre Sheet ID est: `1b0ZrJRUMpjdEyNXqVRpUV8VWKepakd8hJhfGM9smtJs`

### Méthode 2: Bouton Partager

1. Cliquez sur **"Partager"** (en haut à droite du Sheet)
2. Cliquez sur **"Copier le lien"**
3. Extraire l'ID de l'URL copiée

---

## ⚙️ Variables disponibles

### `SPREADSHEET_ID` (requis)
L'identifiant unique de votre Google Sheet.

**Exemple:**
```
SPREADSHEET_ID=1b0ZrJRUMpjdEyNXqVRpUV8VWKepakd8hJhfGM9smtJs
```

---

### `POLL_INTERVAL` (optionnel, défaut: 30)
Intervalle en secondes entre chaque vérification du Sheet.

**Recommandations:**
- **30s** → Équilibre idéal (réactivité + limite API Google)
- **15s** → Plus réactif (attention quotas API)
- **60s** → Plus économe (moins réactif)

**Exemple:**
```
POLL_INTERVAL=30
```

---

### `AUTO_POLLING_ENABLED` (optionnel, défaut: true)
Active ou désactive le polling automatique.

**Valeurs:** `true` ou `false`

**Exemple:**
```
AUTO_POLLING_ENABLED=true
```

---

### `SHEET_NAME_FACTURES` (optionnel, défaut: Factures)
Nom de l'onglet contenant les factures dans votre Google Sheet.

**Exemple:**
```
SHEET_NAME_FACTURES=Factures
```

---

### `DEBUG_MODE` (optionnel, défaut: true)
Active les logs détaillés pour le débogage.

**Exemple:**
```
DEBUG_MODE=true
```

---

## 📝 Exemple de configuration complète

```env
# Sheet à surveiller
SPREADSHEET_ID=1b0ZrJRUMpjdEyNXqVRpUV8VWKepakd8hJhfGM9smtJs

# Polling toutes les 30 secondes
POLL_INTERVAL=30

# Noms des onglets
SHEET_NAME_FACTURES=Factures
SHEET_NAME_ENCAISSEMENTS=Encaissements

# Options
AUTO_POLLING_ENABLED=true
DEBUG_MODE=true
```

---

## 🧪 Tester avec plusieurs Sheets

### Scenario 1: Client A (production)
```env
SPREADSHEET_ID=1b0ZrJRUMpjdEyNXqVRpUV8VWKepakd8hJhfGM9smtJs
POLL_INTERVAL=30
```

### Scenario 2: Test / Demo
```env
SPREADSHEET_ID=abc123xyz_votre_sheet_de_test
POLL_INTERVAL=15
DEBUG_MODE=true
```

**Changez simplement le `.env` et relancez l'API !**

---

## 🔐 Sécurité

⚠️ **N'OUBLIEZ PAS:**

1. Le fichier `.env` contient des informations sensibles
2. **Ne le committez JAMAIS dans Git** (déjà dans `.gitignore`)
3. Utilisez `.env.example` pour documenter les variables nécessaires

---

## 🆘 Problèmes courants

### Erreur: "SPREADSHEET_ID non trouvé"
→ Vérifiez que le `.env` existe et contient bien `SPREADSHEET_ID=...`

### Erreur: "Permission denied"
→ Votre Sheet doit être partagé avec votre compte Google ou en lecture publique

### Le polling ne démarre pas
→ Vérifiez `AUTO_POLLING_ENABLED=true` dans `.env`

---

## 📚 Plus d'infos

- [Documentation Google Sheets API](https://developers.google.com/sheets/api)
- [OAuth2 Flow](https://developers.google.com/identity/protocols/oauth2)

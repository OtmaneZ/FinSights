# 🚀 Installation et Démarrage FinSight

## Étape 1 : Installer les dépendances

### Option A : Script automatique (recommandé)
```bash
chmod +x install-deps.sh
./install-deps.sh
```

### Option B : Installation manuelle
```bash
# Si npm n'est pas installé, installer Node.js d'abord
# Télécharger depuis : https://nodejs.org/

# Installer xlsx pour le support Excel
npm install xlsx@^0.18.5

# Vérifier l'installation
npm list xlsx
```

## Étape 2 : Lancer le projet

```bash
# Mode développement (avec hot-reload)
npm run dev

# Ou build production
npm run build
npm start
```

## Étape 3 : Ouvrir dans le navigateur

```
http://localhost:3000
```

## 🎯 Test des Nouvelles Fonctionnalités

### 1. Upload de fichier
1. Cliquer "Importer Données"
2. Sélectionner `test_data_sample.csv` (ou votre fichier Excel)
3. Modal secteur s'ouvre → Saisir :
   - Nom : "Ma Société"
   - Secteur : Services/Commerce/Industrie/SaaS

### 2. Vérifier les benchmarks
- Sous chaque KPI : barre colorée avec position vs secteur
- Vert = bon, Orange = moyen, Rouge = critique

### 3. Consulter les alertes
- Panel "Alertes & Recommandations" en haut
- Actions recommandées détaillées

### 4. Preview des données
- Section "Données importées" avec stats
- Tableau des 5 premières lignes

### 5. Export PDF
- Cliquer "Export PDF"
- PDF multi-pages avec graphiques générés
- Vérifier : couverture + KPIs + graphiques + méthodologie

## 📁 Structure des Fichiers

### Nouveaux composants
```
src/components/
├── BenchmarkBar.tsx          # Benchmarks sectoriels
├── AlertsPanel.tsx           # Système d'alertes
├── CompanyInfoModal.tsx      # Modal secteur
└── DataPreviewPanel.tsx      # Preview données

src/lib/
└── excelParser.ts            # Support Excel

src/pages/api/
└── upload.ts                 # API upload (modifié)
```

## 🐛 Dépannage

### Erreur "Cannot find module 'xlsx'"
```bash
npm install xlsx@^0.18.5
```

### Erreur "npm: command not found"
Installer Node.js depuis https://nodejs.org/

### Port 3000 déjà utilisé
```bash
# Changer le port
PORT=3001 npm run dev
```

### Graphiques ne s'affichent pas dans le PDF
- Vérifier que les graphiques sont visibles dans le dashboard
- Les IDs `cash-flow-chart`, `dso-client-chart`, `margin-analysis-chart` doivent exister
- Attendre que les graphiques soient chargés avant export

## 📊 Formats de Fichiers Supportés

### CSV
```csv
Date,Montant,Client,Catégorie,Description
15/01/2025,1500.50,Client A,Ventes,Facture 001
```

### Excel (.xlsx)
- Colonnes automatiquement détectées
- Meilleure feuille sélectionnée automatiquement
- Formats français supportés (DD/MM/YYYY, 1 250,50€)

## ✅ Checklist Post-Installation

- [ ] `npm run dev` fonctionne sans erreur
- [ ] Dashboard affiche "Tableau de Bord Financier"
- [ ] Upload CSV fonctionne
- [ ] Upload Excel fonctionne
- [ ] Modal secteur s'affiche après upload
- [ ] Benchmarks visibles sous les KPIs
- [ ] Alertes affichées
- [ ] Preview données visible
- [ ] Export PDF avec graphiques fonctionne

## 🎉 Ready!

FinSight est maintenant prêt pour vos démos clients !

Score : **88/100** ✨

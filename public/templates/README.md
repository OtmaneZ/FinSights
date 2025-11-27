# Templates CSV FinSight

## 📋 Description

Ces templates sont conçus pour importer vos données financières dans FinSight.

## 🎯 Colonnes disponibles

### Colonnes obligatoires :
- **Date** : Format DD/MM/YYYY (ex: 15/11/2024)
- **Montant** : Nombre positif pour revenus, négatif pour dépenses (ex: 15000 ou -3500)
- **Type** : `income` (revenu) ou `expense` (dépense)

### Colonnes optionnelles (recommandées) :
- **Contrepartie** : Nom du client ou fournisseur (ex: "Société Générale")
- **Catégorie** : Type de transaction (ex: "Vente", "Salaires", "Infrastructure")
- **Description** : Détails supplémentaires (ex: "Facture #2024-001")
- **DateEchéance** : Date d'échéance de paiement (format DD/MM/YYYY)

## 📁 Templates disponibles

### 1. `template-sage.csv`
Format compatible Sage Compta
- Adapté pour export comptabilité Sage
- Colonnes standards PCG 2025

### 2. `template-cegid.csv`
Format compatible Cegid
- Structure export Cegid classique
- Catégories détaillées

### 3. `template-quickbooks.csv`
Format compatible QuickBooks
- Import/Export QuickBooks Online
- Nomenclature internationale

### 4. `template-excel.csv`
Format Excel générique
- Pour saisie manuelle
- Template le plus simple

## 🚀 Comment utiliser ?

1. Téléchargez le template correspondant à votre logiciel comptable
2. Remplissez avec vos données (gardez les en-têtes de colonnes)
3. Uploadez le fichier sur FinSight
4. Le dashboard se génère automatiquement !

## 💡 Conseils

- **Dates** : Utilisez toujours le format DD/MM/YYYY
- **Montants** : Pas de symbole € ni espaces (15000 et non 15 000€)
- **Types** : Respectez `income` et `expense` en minuscules
- **Encodage** : UTF-8 pour les caractères spéciaux (é, è, à)

## 📞 Support

Besoin d'aide ? Contactez-nous : [calendly.com/zineinsight](https://calendly.com/zineinsight)

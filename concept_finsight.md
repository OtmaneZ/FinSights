# 🚀 FinSight – Visualisez et Parlez à vos Données
**Date :** 30 octobre 2025
**Auteur :** Otmane Boulahia
**Statut :** Concept validé – Phase de structuration produit

---

## 🎯 Vision
FinSight est une plateforme de **finance augmentée** où les données deviennent un langage vivant.
Le produit repose sur un double axe :
1. **Visualisez vos données** → compréhension immédiate par le regard.
2. **Parlez à vos données** → interaction naturelle par le langage.

> “FinSight, c’est la rencontre entre l’œil et la parole.
>  Entre le chiffre qui s’affiche et le sens qu’il exprime.”

---

## 🧠 Concept central
Le tableau de bord n’est plus une simple interface figée.
Il **s’adapte** au niveau de données importées et permet à l’utilisateur de **dialoguer** avec ses chiffres.

### 1. Visualisez vos données
- Upload d’un fichier (CSV, Excel, API comptable)
- Parsing automatique et attribution d’un “profil de données”
- Génération dynamique de KPI selon la richesse du fichier
- Dashboard évolutif :
  - 4 KPI si données basiques
  - 8 KPI si données enrichies
  - 12+ KPI si données complètes

### 2. Parlez à vos données
- Interface de **copilote interactif**
- L’utilisateur choisit ou écrit une question du type :
  - “Quelle est ma marge brute ?”
  - “Quel est mon cashflow net ?”
  - “Et si je réduisais mon DSO de 10 jours ?”
- FinSight interprète la question et exécute la fonction correspondante :
  - `calculerMarge()`
  - `calculerCashflow()`
  - `simulerDSO(10)`
- Réponse textuelle + visuelle immédiate :
  - “Votre marge brute actuelle est de 42,8 %.”
  - Graphique contextuel affiché automatiquement.

---

## ⚙️ Fonctionnement technique (V1 locale)

### Parsing
1. Détection automatique des colonnes clés.
2. Attribution d’un **niveau de données** :
   - Niveau 1 : Basique (Date, Montant)
   - Niveau 2 : Intermédiaire (+ Client, Catégorie)
   - Niveau 3 : Avancé (+ Produit, Quantité, Coût)
3. Génération dynamique de la liste des KPI disponibles.

### Copilote statique (préprogrammé)
- Liste de questions prédéfinies :
  ```js
  [
    "Quelle est ma marge brute ?",
    "Quel est mon DSO moyen ?",
    "Quel est mon cashflow net ?",
    "Quelles sont mes charges fixes ?",
    "Si j’ajoute X ventes, quel serait mon CA projeté ?"
  ]
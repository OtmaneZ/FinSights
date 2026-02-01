# TRESORIS + Google Sheets - Guide d'Installation

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Google Sheet      │     │     Apps Script     │     │   TRESORIS API      │
│                     │     │                     │     │                     │
│  • Factures         │────▶│  • Détecte edits    │────▶│  POST /webhook/gsheet│
│  • Encaissements    │     │  • Collecte data    │     │                     │
│  • Paramètres       │◀────│  • Affiche alertes  │◀────│  • Analyse engines  │
│  • Alertes          │     │                     │     │  • Retourne alertes │
│  • Dashboard        │     │                     │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

## Étape 1 : Créer le Google Sheet

1. Aller sur [Google Sheets](https://sheets.google.com)
2. Créer un nouveau classeur
3. Le renommer "TRESORIS - [Nom Entreprise]"

## Étape 2 : Installer le Script Apps Script

1. Dans le Sheet, aller dans **Extensions > Apps Script**
2. Supprimer le code par défaut
3. Copier-coller le contenu de `integrations/google-sheets/Code.gs`
4. Sauvegarder (Ctrl+S)

## Étape 3 : Configurer le Script

1. Dans Apps Script, cliquer sur **Exécuter > setupTresorisSheet**
2. Autoriser les permissions demandées
3. Le script va créer automatiquement les 5 onglets :
   - Factures
   - Encaissements
   - Paramètres
   - Alertes TRESORIS
   - Dashboard

## Étape 4 : Configurer l'API Key

### Option A : Via le menu
1. Dans le Sheet, un nouveau menu "TRESORIS" apparaît
2. Cliquer sur **TRESORIS > Configurer API Key**
3. Entrer votre clé API

### Option B : Via Apps Script
1. Dans Apps Script, aller dans **Paramètres du projet > Propriétés du script**
2. Ajouter une propriété : `TRESORIS_API_KEY` = votre clé

## Étape 5 : Configurer l'URL de l'API

Dans le fichier `Code.gs`, modifier la constante :
```javascript
const CONFIG = {
  TRESORIS_API_URL: "https://votre-api.finsights.io/api/v1",
  // ...
};
```

## Étape 6 : Importer vos données

### Structure de l'onglet "Factures" :

| Colonne | Description | Format |
|---------|-------------|--------|
| ID Facture | Référence unique | FAC-001 |
| Date Facture | Date d'émission | JJ/MM/AAAA |
| Client | Nom du client | Texte |
| Montant HT | Montant hors taxes | Nombre |
| TVA | Montant TVA | Nombre |
| Montant TTC | Total TTC | Nombre |
| Date Échéance | Date limite paiement | JJ/MM/AAAA |
| Statut | État de la facture | En attente / Payée / En retard / Litige |
| Date Paiement | Date de règlement | JJ/MM/AAAA (si payée) |
| Montant Payé | Montant reçu | Nombre |
| Jours Retard | Calculé auto | Nombre |
| Catégorie | Type de prestation | Texte |
| Notes | Commentaires | Texte |

## Étape 7 : Tester la connexion

1. Dans le Sheet, aller dans **TRESORIS > Lancer une analyse**
2. Vérifier que les alertes apparaissent dans l'onglet "Alertes TRESORIS"

---

## Fonctionnalités

### Analyse automatique
À chaque modification dans les onglets Factures ou Encaissements, TRESORIS analyse automatiquement (avec un cooldown de 5 minutes pour éviter les surcharges).

### Analyse manuelle
Menu **TRESORIS > Lancer une analyse**

### Chat avec TRESORIS
Menu **TRESORIS > Demander une recommandation**

Exemples de questions :
- "Quels clients dois-je relancer en priorité ?"
- "Pourquoi ma marge baisse ?"
- "Quel est mon DSO actuel ?"

### Alertes automatiques
Les alertes sont classées par niveau :
- **CRITICAL** (rouge) : Action immédiate requise
- **WARNING** (orange) : À surveiller cette semaine
- **INFO** (bleu) : Information utile

---

## Démo "WTF Moment"

### Scénario de démonstration

1. **Préparation** (avant la démo)
   - Créer un Sheet avec quelques factures (10-20)
   - S'assurer que l'API TRESORIS tourne

2. **Pendant la démo**
   - Ouvrir le Sheet avec les factures
   - Modifier une facture : passer son statut de "En attente" à "En retard"
   - **MAGIE** : En quelques secondes, une alerte apparaît dans l'onglet "Alertes TRESORIS"
   - Montrer l'alerte : client identifié, impact estimé, action recommandée

3. **Effet WOW**
   - Poser une question via le chat : "Quels clients relancer en priorité ?"
   - TRESORIS répond avec une analyse personnalisée

### Script de démo (3 minutes)

```
[0:00] "Voici un Google Sheet classique avec des factures clients."

[0:15] "Je vais simplement modifier le statut de cette facture..."
       → Changer "En attente" → "En retard"

[0:30] "Regardez l'onglet Alertes..."
       → Montrer l'alerte qui apparaît automatiquement

[0:45] "TRESORIS a détecté le changement, analysé l'impact, et recommande une action."
       → Lire l'alerte à voix haute

[1:00] "Je peux aussi lui poser des questions en langage naturel..."
       → Menu TRESORIS > Demander une recommandation

[1:15] "Quels clients dois-je relancer en priorité ?"
       → Montrer la réponse personnalisée

[1:45] "Et tout cela sans aucune connexion bancaire, 100% sur vos propres données."

[2:00] "Questions ?"
```

---

## Troubleshooting

### Les alertes n'apparaissent pas
1. Vérifier que l'API Key est configurée
2. Vérifier que l'URL de l'API est correcte
3. Vérifier les logs dans Apps Script (Affichage > Journaux d'exécution)

### Erreur "API Key non configurée"
Reconfigurer via **TRESORIS > Configurer API Key**

### Erreur de permissions
Réexécuter **setupTresorisSheet** et autoriser toutes les permissions

---

## Support

Pour toute question : contact@finsights.io

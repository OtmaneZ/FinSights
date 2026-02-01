# Clés API TRESORIS - Documentation

## Qu'est-ce qu'une clé API ?

Une **clé API** (Application Programming Interface) est comme un mot de passe sécurisé qui autorise votre Google Sheet à communiquer avec TRESORIS.

**Analogie** : C'est comme la clé d'entrée de votre maison. Vous la donnez à des personnes de confiance pour qu'elles puissent entrer, mais la clé ne donne accès qu'à certaines parties.

---

## Processus de création

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Interface d'administration TRESORIS                         │
│     https://finsights.io/dashboard/api-keys                    │
│                                                                 │
│     ✓ Se connecter à son compte TRESORIS                       │
│     ✓ Cliquer sur "Créer une clé"                              │
│     ✓ Donner un nom (ex: "Mon Google Sheet")                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            |
                            v
┌─────────────────────────────────────────────────────────────────┐
│  2. La clé est générée                                          │
│                                                                 │
│     tre_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p                        │
│                                                                 │
│     ⚠️ IMPORTANT: Copier cette clé tout de suite!              │
│        Elle ne sera plus visible après!                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            |
                            v
┌─────────────────────────────────────────────────────────────────┐
│  3. Configurer dans le Google Sheet                             │
│                                                                 │
│     Menu TRESORIS > Configurer API Key                         │
│     [Coller la clé]                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            |
                            v
┌─────────────────────────────────────────────────────────────────┐
│  4. Google Sheet peut maintenant parler à TRESORIS              │
│                                                                 │
│     Quand vous modifiez une facture...                         │
│     Apps Script utilise cette clé pour envoyer les données     │
│     à TRESORIS de manière sécurisée.                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Caractéristiques des clés API

| Aspect | Description |
|--------|-------------|
| **Format** | `tre_` suivi de 43 caractères aléatoires (ex: `tre_a1b2c3...`) |
| **Longueur** | 47 caractères (ne pas modifier) |
| **Validité** | 365 jours par défaut (renouvelable) |
| **Sécurité** | Transmission chiffrée via HTTPS uniquement |
| **Affichage** | UNE SEULE FOIS lors de la création |
| **Révocation** | Peut être désactivée à tout moment |

---

## Bonnes pratiques

### ✅ À faire

- **Stocker la clé de manière sécurisée** : Ne la mettez pas en dur dans le code
  - Dans Google Sheets : utiliser les Propriétés du script
  - En production : utiliser un gestionnaire de secrets (Vault, etc.)

- **Limiter la durée de validité** : Ne pas utiliser 10 ans
  - 365 jours (1 an) est une bonne pratique
  - Renouveler régulièrement

- **Une clé par intégration** : Créer plusieurs clés
  - Une clé pour votre Google Sheet
  - Une clé pour votre API interne
  - Permet de révoquer une seule intégration si compromis

- **Monitorer l'utilisation** : Vérifier régulièrement
  - Quand la clé a été utilisée pour la dernière fois
  - Combien de fois elle a été utilisée

### ❌ À ne pas faire

- **Ne pas partager la clé publiquement** : Jamais sur GitHub, Discord, Slack publics
- **Ne pas utiliser la même clé partout** : Une clé = un usage
- **Ne pas ignorer les dates d'expiration** : Créer des alertes
- **Ne pas stocker en plain text** : Chiffrer toujours
- **Ne pas la mettre dans le code source** : Utiliser des variables d'environnement

---

## Gestion des clés

### Voir mes clés actives
```bash
curl https://votre-api.finsights.io/api/v1/api-keys/list \
  -H "Authorization: Bearer YOUR_MASTER_KEY"

# Réponse:
{
  "success": true,
  "keys": [
    {
      "key_id": "key_1",
      "name": "Mon Google Sheet",
      "created_at": "2026-02-01T10:00:00",
      "expires_at": "2027-02-01T10:00:00",
      "is_active": true,
      "last_used": "2026-02-01T14:32:00",
      "usage_count": 247
    }
  ]
}
```

### Désactiver une clé
Si vous pensez qu'une clé est compromis :

```bash
curl -X POST https://votre-api.finsights.io/api/v1/api-keys/key_1/revoke \
  -H "Authorization: Bearer YOUR_MASTER_KEY"

# Réponse:
{
  "success": true,
  "message": "Clé key_1 désactivée"
}
```

---

## Cas d'usage

### Créer une clé pour une PME cliente

```
1. DAF se connecte au dashboard TRESORIS
2. Va dans Paramètres > Clés API
3. Crée une clé "ACME Corp - Google Sheet"
4. Configure dans son Google Sheet
5. TRESORIS commence à analyser automatiquement

=> DAF gagne 10-15h/semaine d'analyse manuelle
```

### Créer une clé pour une intégration API interne

```
1. Créer une clé "API Interne - Planification"
2. Utiliser dans le backend pour appeler TRESORIS
3. Si compromis, désactiver sans affecter les autres intégrations
```

---

## Sécurité - Points importants

### Transport
- Toutes les clés sont transmises via **HTTPS chiffré**
- Jamais en HTTP plaintext
- Certificats SSL valides obligatoires

### Stockage
- Les clés sont **hashées** en base de données (impossible à récupérer en clair)
- Seul le hash est stocké, jamais la clé complète
- Si quelqu'un vole la base, les clés ne peuvent pas être retrouvées

### Révocation
- Une clé désactivée ne peut plus être utilisée
- Instantanée (effet immédiat)
- Pas de délai entre la révocation et l'arrêt du fonctionnement

### Logs
- Chaque utilisation de clé est loggée
- IP source, timestamp, endpoint utilisé
- Permet de détecter les utilisations suspectes

---

## Troubleshooting

### "Clé API invalide"
- Vérifier que vous avez copié la clé entière (47 caractères)
- Vérifier qu'il n'y a pas d'espaces avant/après
- Vérifier que la clé n'a pas expiré

### "Clé API non trouvée"
- La clé a peut-être été supprimée
- Créer une nouvelle clé

### "Accès refusé"
- Vérifier que la clé est au bon format (`tre_...`)
- Vérifier que vous utilisez le bon endpoint
- Vérifier les permissions associées à la clé

### Je ne vois pas le menu TRESORIS dans mon Sheet
- Rafraîchir la page (F5)
- Vérifier que le script Apps Script est bien installé
- Vérifier qu'il n'y a pas d'erreur dans la console (Ctrl+Shift+I)

---

## Support

Pour toute question : support@finsights.io

Pour signaler une clé compromis : security@finsights.io

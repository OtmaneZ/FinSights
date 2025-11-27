# 🎨 Règles de Design - FinSight Corporate Theme

## Contexte

- **Fond général** : `#f0f2f5` (gris clair)
- **Surfaces** : `#ffffff` (blanc)
- **Accent** : `#0078d4` (bleu Microsoft)

## ✅ Règles de contraste

### Texte sur fond clair

```css
/* ✅ BON */
.text-primary         /* #212529 - Noir profond */
.text-secondary       /* #6c757d - Gris moyen */
.text-accent-primary  /* #0078d4 - Bleu */

/* ❌ INTERDIT */
.text-white           /* Invisible sur fond blanc ! */
```

### Texte sur fond coloré (boutons, badges)

```css
/* ✅ BON - Sur bleu/vert/rouge */
.text-white           /* Sur bg-accent-primary, bg-accent-success, etc. */

/* ❌ INTERDIT - Sur fond clair */
.text-white           /* Sur bg-white, bg-primary, bg-surface-elevated */
```

### Boutons

```css
/* ✅ CTA Principal */
bg-accent-primary text-white  /* Bleu avec texte blanc */

/* ✅ CTA Secondaire */
border-2 border-accent-primary text-accent-primary  /* Outline bleu */

/* ❌ INTERDIT */
bg-white text-white  /* Invisible ! */
```

### Cards & Surfaces

```css
/* ✅ BON */
.surface              /* Blanc sur gris clair (bon contraste) */
bg-surface-elevated   /* Alias de surface */

/* ❌ INTERDIT */
bg-white on bg-primary  /* Trop peu de contraste */
```

### Tooltips & Popovers

```css
/* ✅ BON */
bg-gray-900 text-white  /* Tooltip sombre (contraste inversé) */

/* ❌ INTERDIT */
bg-white text-white  /* Invisible */
```

## 🔍 Checklist avant commit

1. [ ] Pas de `text-white` sur `bg-white` ou `bg-primary`
2. [ ] Tous les boutons ont un bon contraste
3. [ ] Les tooltips sont sombres (`bg-gray-900`)
4. [ ] Les badges utilisent les couleurs d'accent
5. [ ] Test visuel avec fond blanc activé

## 🛠️ Script de vérification

```bash
# Trouver les problèmes potentiels
grep -r "bg-white.*text-white" src/
grep -r "bg-primary.*text-white" src/
```

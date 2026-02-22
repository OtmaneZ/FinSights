/**
 * Social Proof Configuration — Source unique de vérité
 *
 * IMPORTANT Schema.org / Google Rich Results :
 *  - `AGGREGATE_REVIEW_COUNT` doit correspondre exactement au nombre
 *    d'avis *affichés* ou *mentionnés* dans le texte visible de chaque page.
 *  - `CONSULTING_REVIEW_COUNT` est séparé car la page /consulting affiche
 *    uniquement les témoignages de missions DAF (périmètre différent).
 *  - Ne jamais gonfler reviewCount au-delà des avis réellement présentés :
 *    Google peut flaguer "Spam Snippets" et supprimer les étoiles dans les SERP.
 *
 * Pour mettre à jour : modifier uniquement ce fichier.
 */

// ── Note agrégée FinSight (outil diagnostic + DAF combinés) ─────────────────
/** Note moyenne sur 5 affichée dans le trust bar et les JSON-LD */
export const AGGREGATE_RATING_VALUE = '4.8'

/** Nombre total d'avis cumulés (diagnostic + retours DAF) */
export const AGGREGATE_REVIEW_COUNT = '47'

/** Note max sur l'échelle */
export const BEST_RATING = '5'

/** Note min sur l'échelle */
export const WORST_RATING = '1'

// ── Page /consulting — périmètre missions DAF uniquement ────────────────────
/** Note spécifique aux missions de conseil DAF externalisé */
export const CONSULTING_RATING_VALUE = '4.8'

/** Nombre d'avis affichés sur la page /consulting (missions DAF) */
export const CONSULTING_REVIEW_COUNT = '12'

// ── Texte formaté pour l'UI (fr-FR) ────────────────────────────────────────
/** Chaîne prête à afficher dans un trust bar : "4,8 / 5 (47 avis)" */
export const SOCIAL_PROOF_LABEL = `${AGGREGATE_RATING_VALUE.replace('.', ',')} / 5 (${AGGREGATE_REVIEW_COUNT} avis)`

// ── Nombre de témoignages affichés par page ─────────────────────────────────
// Ces constantes permettent de s'assurer que reviewCount ≤ témoignages visibles
// quand les avis individuels sont listés sur la page elle-même.
export const TESTIMONIALS_ANALYSE_PREDICTIVE = 3   // 3 avis affichés sur /analyse-predictive
export const TESTIMONIALS_CONSULTING = 3            // 3 témoignages sur /consulting
export const TESTIMONIALS_DAF = 3                   // 3 témoignages sur /daf-externalise-pme

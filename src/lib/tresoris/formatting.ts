/**
 * Utilitaires de formatage pour TRESORIS
 */

/**
 * Formate un montant en euros de manière lisible
 * @example formatAmount(1000000) => "1M€"
 * @example formatAmount(150000) => "150K€"
 * @example formatAmount(5000) => "5K€"
 */
export function formatAmount(amount: number): string {
  if (amount >= 1000000) {
    const millions = amount / 1000000
    return millions % 1 === 0 
      ? `${millions.toFixed(0)}M€` 
      : `${millions.toFixed(1)}M€`
  }
  
  if (amount >= 1000) {
    const thousands = amount / 1000
    return thousands % 1 === 0
      ? `${thousands.toFixed(0)}K€`
      : `${thousands.toFixed(1)}K€`
  }
  
  return `${amount}€`
}

/**
 * Formate un nombre de semaines de runway de manière lisible
 * Limite les valeurs extrêmes et ajoute un indicateur visuel
 * @example formatRunway(18) => "18 sem"
 * @example formatRunway(-5) => "0 sem (critique)"
 * @example formatRunway(500) => "> 2 ans"
 */
export function formatRunway(weeks: number): string {
  if (weeks < 0) {
    return '0 sem (critique)'
  }
  
  if (weeks > 104) { // > 2 ans
    const years = Math.floor(weeks / 52)
    return `> ${years} an${years > 1 ? 's' : ''}`
  }
  
  if (weeks > 52) { // > 1 an
    const years = (weeks / 52).toFixed(1)
    return `${years} ans`
  }
  
  return `${Math.round(weeks)} sem`
}

/**
 * Calcule l'impact sur le runway de manière réaliste
 * Limite les valeurs extrêmes et évite les calculs absurdes
 * @param amount Montant de la facture
 * @param weeklyBurn Burn mensuel moyen
 * @param currentRunway Runway actuel en semaines
 */
export function calculateRunwayImpact(
  amount: number, 
  weeklyBurn: number = 45000,
  currentRunway: number = 18
): {
  impactWeeks: number
  runwayAfter: number
  isCritical: boolean
} {
  // Calcul de base
  const rawImpact = Math.round(amount / weeklyBurn)
  
  // Limiter l'impact à un maximum réaliste (ex: 52 semaines)
  const impactWeeks = Math.min(rawImpact, 52)
  
  // Calculer le runway après, ne peut pas être négatif
  const runwayAfter = Math.max(0, currentRunway - impactWeeks)
  
  // Critique si runway passe sous 8 semaines (2 mois)
  const isCritical = runwayAfter < 8
  
  return {
    impactWeeks,
    runwayAfter,
    isCritical
  }
}

/**
 * Formate un nombre avec des espaces pour la lisibilité
 * @example formatNumber(1000000) => "1 000 000"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num)
}

/**
 * FinSight AI Assistant — Configuration & System Prompt
 *
 * Architecture Pipeline (v2):
 *   1. Client envoie les données brutes (calculator history)
 *   2. Serveur enrichit via scoring.ts → benchmarks.ts → articles.ts
 *   3. Le system prompt reçoit un diagnostic PRÉ-CALCULÉ
 *   4. GPT traduit les faits en langage naturel — il ne calcule RIEN
 *
 * Ton: expert CFO sobre, McKinsey-like, pas de bullshit
 * Model: OpenRouter → claude-3.5-sonnet ou gpt-4o-mini
 */

// ---------------------------------------------------------------------------
// Site Map (injected into system prompt for navigation awareness)
// ---------------------------------------------------------------------------

export interface SitePage {
  href: string
  label: string
  description: string
  category: 'primary' | 'resource' | 'tool' | 'conversion'
}

export const SITE_MAP: SitePage[] = [
  // Primary pages
  { href: '/', label: 'Accueil', description: 'Presentation de FinSight, DAF externalise pour PME', category: 'primary' },
  { href: '/consulting', label: 'Consulting Finance', description: 'Offres de consulting : Audit Flash 5j, DAF externalise, missions ponctuelles. Tarifs et prises de RDV.', category: 'conversion' },
  { href: '/agents', label: 'Agents IA Finance', description: 'Presentation des 5 agents IA finance : Dashis, Tresoris, Margis, Scoris, Scenaris.', category: 'primary' },
  { href: '/contact', label: 'Contact', description: 'Formulaire de contact et coordonnees.', category: 'primary' },

  // Tools
  { href: '/calculateurs', label: 'Calculateurs financiers', description: '9 calculateurs gratuits : DSO, BFR, ROI, Marge, Seuil de rentabilite, EBITDA, CAC/LTV, Burn Rate, Valorisation.', category: 'tool' },
  { href: '/calculateurs/dso', label: 'Calculateur DSO', description: 'Calculez votre Days Sales Outstanding (delai moyen de paiement clients).', category: 'tool' },
  { href: '/calculateurs/bfr', label: 'Calculateur BFR', description: 'Calculez votre Besoin en Fonds de Roulement.', category: 'tool' },
  { href: '/calculateurs/roi', label: 'Calculateur ROI', description: 'Calculez le retour sur investissement de vos projets.', category: 'tool' },
  { href: '/calculateurs/marge', label: 'Calculateur Marge', description: 'Calculez votre marge brute, nette ou commerciale.', category: 'tool' },
  { href: '/calculateurs/seuil-rentabilite', label: 'Seuil de rentabilite', description: 'Calculez votre point mort (break-even).', category: 'tool' },
  { href: '/mon-diagnostic', label: 'Mon Diagnostic', description: 'Tableau de bord personnel avec Score FinSight (0-100), historique des calculs, indicateurs manquants.', category: 'tool' },

  // Resources
  { href: '/ressources', label: 'Ressources', description: 'Hub centralisant articles, templates, calculateurs et guides.', category: 'resource' },
  { href: '/ressources/templates', label: 'Templates Excel', description: 'Templates financiers telechargeables : previsionnel tresorerie, plan de financement, budget.', category: 'resource' },
  { href: '/ressources/guides', label: 'Guides pratiques', description: 'Guides methodologiques pour dirigeants de PME.', category: 'resource' },
  { href: '/fondamentaux', label: 'Fondamentaux finance', description: 'Articles pedagogiques sur les bases de la finance d\'entreprise.', category: 'resource' },
  { href: '/blog', label: 'Blog', description: 'Articles de fond sur la finance PME : DSO, BFR, tresorerie, marges, benchmark sectoriel.', category: 'resource' },
  { href: '/methodologie', label: 'Methodologie Score FinSight', description: 'Explication detaillee du calcul du Score FinSight (0-100).', category: 'resource' },
  { href: '/faq', label: 'FAQ', description: 'Questions frequentes sur FinSight et la finance PME.', category: 'resource' },

  // Conversion
  { href: '/tarifs', label: 'Tarifs', description: 'Tarifs des missions DAF externalisé FinSight : diagnostic, audit, decision system.', category: 'conversion' },
]

// ---------------------------------------------------------------------------
// Contextual Suggestions (based on current page)
// ---------------------------------------------------------------------------

export interface SuggestedQuestion {
  text: string
  category: 'navigation' | 'finance' | 'action'
}

export const PAGE_SUGGESTIONS: Record<string, SuggestedQuestion[]> = {
  '/': [
    { text: 'Quels services proposez-vous ?', category: 'navigation' },
    { text: 'Comment fonctionne le Score FinSight ?', category: 'finance' },
    { text: 'Je veux calculer mon DSO', category: 'action' },
  ],
  '/calculateurs': [
    { text: 'Par quel indicateur commencer ?', category: 'finance' },
    { text: 'Quel est le DSO moyen dans mon secteur ?', category: 'finance' },
    { text: 'Ou trouver les templates Excel ?', category: 'navigation' },
  ],
  '/calculateurs/dso': [
    { text: 'Mon DSO est eleve, que faire ?', category: 'finance' },
    { text: 'Quel lien entre DSO et BFR ?', category: 'finance' },
    { text: 'Je veux un diagnostic complet', category: 'action' },
  ],
  '/calculateurs/bfr': [
    { text: 'Un BFR negatif, c\'est bien ?', category: 'finance' },
    { text: 'Comment reduire mon BFR ?', category: 'finance' },
    { text: 'Je veux calculer mon seuil de rentabilite', category: 'action' },
  ],
  '/calculateurs/roi': [
    { text: 'Comment interpreter mon ROI ?', category: 'finance' },
    { text: 'ROI vs payback period, quelle difference ?', category: 'finance' },
  ],
  '/calculateurs/marge': [
    { text: 'Marge brute vs marge nette ?', category: 'finance' },
    { text: 'Comment ameliorer ma marge ?', category: 'finance' },
  ],
  '/calculateurs/seuil-rentabilite': [
    { text: 'Comment reduire mon point mort ?', category: 'finance' },
    { text: 'Charges fixes vs variables ?', category: 'finance' },
  ],
  '/mon-diagnostic': [
    { text: 'Comment ameliorer mon score ?', category: 'finance' },
    { text: 'Quels indicateurs me manquent ?', category: 'finance' },
    { text: 'Je veux parler a un expert', category: 'action' },
  ],
  '/consulting': [
    { text: 'Quelle offre correspond a ma situation ?', category: 'navigation' },
    { text: 'Comment se deroule un audit flash ?', category: 'navigation' },
    { text: 'Je veux prendre rendez-vous', category: 'action' },
  ],
  '/ressources': [
    { text: 'Ou trouver un template de tresorerie ?', category: 'navigation' },
    { text: 'Quel article lire en premier ?', category: 'navigation' },
    { text: 'Je veux calculer mes KPIs', category: 'action' },
  ],
  '/blog': [
    { text: 'Articles sur la tresorerie ?', category: 'navigation' },
    { text: 'Comment reduire mon DSO ?', category: 'finance' },
  ],
  '/ressources/templates': [
    { text: 'Quel template pour un previsionnel ?', category: 'navigation' },
    { text: 'Comment utiliser le template BFR ?', category: 'navigation' },
  ],
}

export function getSuggestionsForPage(pathname: string): SuggestedQuestion[] {
  // Exact match first
  if (PAGE_SUGGESTIONS[pathname]) return PAGE_SUGGESTIONS[pathname]

  // Prefix match for nested routes
  const prefix = Object.keys(PAGE_SUGGESTIONS)
    .filter((key) => pathname.startsWith(key) && key !== '/')
    .sort((a, b) => b.length - a.length)[0]

  if (prefix) return PAGE_SUGGESTIONS[prefix]

  // Fallback
  return PAGE_SUGGESTIONS['/']
}

// ---------------------------------------------------------------------------
// System Prompt — Pipeline v2 (enriched context)
// ---------------------------------------------------------------------------

/**
 * Build the system prompt with pre-computed enriched context.
 * GPT receives FACTS, not raw data. It translates, it does not calculate.
 */
export function buildSystemPrompt(context: {
  currentPage: string
  enrichedSummary?: string     // pre-computed by scoring.ts
  articlesPrompt?: string      // pre-computed by articles.ts
  hasData: boolean
}): string {
  const siteMapStr = SITE_MAP.map(
    (p) => `- ${p.href} → ${p.label}: ${p.description}`
  ).join('\n')

  const dataBlock = context.enrichedSummary
    ? `DIAGNOSTIC PRE-CALCULE (base tes reponses EXCLUSIVEMENT sur ces donnees) :
${context.enrichedSummary}`
    : 'Aucun calcul effectue pour le moment.'

  const articlesBlock = context.articlesPrompt || ''

  return `Tu es l'assistant FinSight, integre au site finsight.zineinsight.com.

TON ROLE :
Tu guides les visiteurs et reponds a leurs questions sur la finance d'entreprise (PME/ETI).
Tu es un expert CFO bilingue, avec un ton professionnel, sobre et factuel — style cabinet de conseil senior.

ARCHITECTURE IMPORTANTE :
Tu recois un diagnostic PRE-CALCULE avec des scores, benchmarks sectoriels et alertes.
Tu ne calcules JAMAIS rien toi-meme. Tu traduis les faits pre-calcules en langage clair et actionnable.
Les chiffres dans le diagnostic ci-dessous sont FIABLES — tu peux les citer directement.

REGLES ABSOLUES :
- Reponds en francais, vouvoiement systematique
- Reponses concises : 3-5 phrases maximum, pas de paves
- Jamais d'emojis
- Ne jamais inventer de chiffres. Cite UNIQUEMENT les donnees du diagnostic ci-dessous.
- Quand tu recommandes une page, fournis le lien : [Texte](lien)
- Format Markdown simple : **gras** pour les points cles, listes a puces si necessaire
- Ne mentionne jamais que tu es une IA, un chatbot ou un LLM. Tu es "l'assistant FinSight".
- Ne dis jamais "selon le diagnostic pre-calcule" ou "d'apres mes donnees". Presente les faits naturellement.

NAVIGATION — CARTE DU SITE :
${siteMapStr}

CONTEXTE UTILISATEUR :
- Page actuelle : ${context.currentPage}

${dataBlock}

${articlesBlock}

STRATEGIE DE REPONSE :

1. QUESTION NAVIGATION (ou trouver X, comment faire Y sur le site) :
   → Oriente avec un lien et explique brievement

2. QUESTION FINANCE avec diagnostic disponible :
   → Cite les chiffres exacts du diagnostic (score, benchmarks, alertes)
   → Compare au positionnement sectoriel (percentile, ecart vs mediane)
   → Donne 1-2 actions concretes issues des alertes pre-calculees
   → Cite un article pertinent si disponible
   → Si indicateur manquant, oriente vers le calculateur

3. QUESTION FINANCE sans diagnostic :
   → Reponds avec expertise generale, concis et factuel
   → Suggere le calculateur pertinent pour quantifier

4. NUDGING INTELLIGENT (subtil, jamais pushy) :
   → Si score < 50 ou alertes critiques : suggere [Mon Diagnostic](/mon-diagnostic) pour la vue consolidee
   → Si 3+ indicateurs completes : propose naturellement les analyses manquantes
   → Maximum 1 mention consulting par conversation, UNIQUEMENT si le contexte le justifie :
     [Prendre rendez-vous](https://calendly.com/zineinsight)
   → Privilegier les ressources gratuites (articles, templates, guides) AVANT le consulting

EXEMPLES DE BONNES REPONSES :

Question: "Mon DSO est eleve, que faire ?"
(si diagnostic disponible avec DSO a 65j, secteur services)
Reponse: "Votre DSO de 65 jours vous place au-dessus de la mediane sectorielle (45 jours pour les Services B2B), soit 44% de plus que vos pairs.
**Impact concret** : cela immobilise environ 82 000 € de tresorerie vs la cible sectorielle.
**Actions prioritaires** :
- Relances automatiques a J+30 (plus gros levier)
- Conditions de paiement a 30 jours pour les nouveaux contrats
- Analyser l'impact sur votre BFR : [Calculateur BFR](/calculateurs/bfr)

Pour aller plus loin : [Reduire son DSO de 50% en 90 jours](/blog/reduire-dso-50-pourcent-90-jours)"

Question: "Je comprends rien a la finance"
Reponse: "Commencez par nos articles sur les [Fondamentaux](/fondamentaux) — ils expliquent les bases de maniere accessible.
Puis testez un premier indicateur en 30 secondes : [Calculateur DSO](/calculateurs/dso). C'est le plus revelateur pour comprendre la sante de votre tresorerie."

REPONSE INTERDITE :
- "En tant qu'IA..." / "D'apres le diagnostic pre-calcule..."
- Longs paragraphes de 10+ lignes
- Recommendations de consulting a chaque reponse
- Emojis
- Inventer des statistiques ou des chiffres non presents dans le diagnostic`
}

// ---------------------------------------------------------------------------
// OpenRouter Configuration
// ---------------------------------------------------------------------------

export const OPENROUTER_CONFIG = {
  baseURL: 'https://openrouter.ai/api/v1',
  defaultModel: 'anthropic/claude-3.5-sonnet',
  fallbackModel: 'openai/gpt-4o-mini',
  maxTokens: 400,
  temperature: 0.3,
  headers: {
    'HTTP-Referer': 'https://finsight.zineinsight.com',
    'X-Title': 'FinSight Assistant',
  },
}

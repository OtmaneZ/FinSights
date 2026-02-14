/**
 * FinSight AI Assistant — Configuration & System Prompt
 *
 * Architecture:
 *   - Dual-mode: Navigation (guide le site) + Finance (contextualise les calculs)
 *   - Nudging éthique vers /consulting et /mon-diagnostic
 *   - Ton: expert CFO sobre, McKinsey-like, pas de bullshit
 *   - Model: OpenRouter → claude-3.5-sonnet ou gpt-4o-mini
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
  { href: '/pricing', label: 'Tarifs', description: 'Plans et tarifs des services FinSight.', category: 'conversion' },
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
// System Prompt
// ---------------------------------------------------------------------------

export function buildSystemPrompt(context: {
  currentPage: string
  calculatorHistory?: string
  finSightScore?: number
  completedIndicators?: number
  totalIndicators?: number
}): string {
  const siteMapStr = SITE_MAP.map(
    (p) => `- ${p.href} → ${p.label}: ${p.description}`
  ).join('\n')

  return `Tu es l'assistant FinSight, integre au site finsight.zineinsight.com.

TON ROLE :
Tu guides les visiteurs dans le site et reponds a leurs questions sur la finance d'entreprise (PME/ETI).
Tu es un expert CFO bilingue finance, avec un ton professionnel, sobre et factuel — style cabinet de conseil.

REGLES ABSOLUES :
- Reponds en francais, vouvoiement systematique
- Reponses concises : 3-5 phrases maximum, pas de pavés
- Jamais d'emojis
- Ne jamais inventer de chiffres ou de donnees. Si tu n'as pas l'information, dis-le clairement.
- Quand tu recommandes une page du site, fournis toujours le lien complet entre crochets : [Texte](lien)
- Format Markdown simple : **gras** pour les points cles, listes a puces si necessaire
- Ne mentionne jamais que tu es une IA, un chatbot ou un LLM. Tu es "l'assistant FinSight".

NAVIGATION — CARTE DU SITE :
${siteMapStr}

CONTEXTE UTILISATEUR ACTUEL :
- Page actuelle : ${context.currentPage}
${context.calculatorHistory ? `- Historique des calculs : ${context.calculatorHistory}` : '- Aucun calcul effectue pour le moment.'}
${context.finSightScore !== undefined ? `- Score FinSight actuel : ${context.finSightScore}/100` : ''}
${context.completedIndicators !== undefined ? `- Indicateurs completes : ${context.completedIndicators}/${context.totalIndicators || 9}` : ''}

STRATEGIE DE REPONSE :
1. Si la question porte sur la navigation (ou trouver X, comment faire Y sur le site) :
   → Oriente vers la page pertinente avec un lien
   → Explique brievement ce qu'il y trouvera

2. Si la question porte sur la finance (DSO, BFR, tresorerie, marge, etc.) :
   → Reponds avec expertise, de maniere concise et factuelle
   → Si l'utilisateur n'a pas encore calcule l'indicateur concerne, suggere le calculateur : "Vous pouvez calculer votre DSO en 30 secondes : [Calculateur DSO](/calculateurs/dso)"
   → Si l'utilisateur a deja des calculs, contextualise la reponse avec ses donnees

3. Si l'utilisateur semble interesse ou a un score faible :
   → Suggere naturellement (pas systematiquement) les ressources gratuites d'abord (templates, guides, articles)
   → Puis, seulement si pertinent, mentionne la possibilite d'un diagnostic gratuit de 30 min : [Prendre rendez-vous](https://calendly.com/zineinsight)
   → Ne jamais etre pushy. Maximum 1 mention consulting par conversation, et uniquement si le contexte le justifie.

4. Si l'utilisateur a fait 3+ calculs ou a un score < 50 :
   → Propose le tableau de bord [Mon Diagnostic](/mon-diagnostic) pour une vue consolidee
   → Si pertinent, mentionne qu'un echange avec un expert peut accelerer l'analyse

EXEMPLES DE BONNES REPONSES :

Question: "Ou trouver les templates ?"
Reponse: "Nos templates financiers (previsionnel tresorerie, plan de financement, budget) sont disponibles ici : [Templates Excel](/ressources/templates). Ils sont en acces libre et au format .xlsx."

Question: "Mon DSO est a 65 jours, c'est grave ?"
Reponse: "Un DSO de 65 jours depasse la mediane sectorielle (40-50 jours pour la plupart des PME B2B). Cela signifie que vos clients mettent en moyenne plus de 2 mois a vous payer, ce qui immobilise du cash.
**Actions prioritaires** :
- Relancer systematiquement a J+30
- Negocier des conditions de paiement plus courtes
- Verifier l'impact sur votre BFR : [Calculateur BFR](/calculateurs/bfr)"

Question: "Je comprends rien a la finance"
Reponse: "Commencez par nos articles pedagogiques sur les [Fondamentaux](/fondamentaux) — ils expliquent les bases (tresorerie, marges, rentabilite) de maniere accessible.
Ensuite, testez un premier indicateur en 30 secondes : [Calculateur DSO](/calculateurs/dso). C'est le plus revelateur pour comprendre la sante de votre tresorerie."

REPONSE INTERDITE :
- "En tant qu'IA..."
- Longs paragraphes de 10+ lignes
- Recommendations de consulting a chaque reponse
- Emojis
- Inventer des statistiques`
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

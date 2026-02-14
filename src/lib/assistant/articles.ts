/**
 * FinSight AI Assistant — Article Matching (RAG-lite)
 *
 * Matching local : pas de vector DB, pas d'embedding.
 * On indexe les articles du blog + fondamentaux par mots-clés,
 * et on matche contre la question utilisateur + les alertes du scoring.
 *
 * Résultat : 2-3 articles pertinents injectés dans le system prompt.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ArticleRef {
  slug: string
  title: string
  href: string
  tags: string[]
  keywords: string[]    // lowercase, for matching
  category: 'blog' | 'fondamentaux'
  readTime?: string
  relevance?: number    // computed at match time
}

// ---------------------------------------------------------------------------
// Article Index (static, exhaustive)
// ---------------------------------------------------------------------------

const ARTICLE_INDEX: ArticleRef[] = [
  // --- Blog articles ---
  {
    slug: 'calcul-dso-formule-2025',
    title: 'Comment calculer son DSO (formule PCG 2025)',
    href: '/blog/calcul-dso-formule-2025',
    tags: ['DSO', 'Trésorerie', 'Formule', 'PCG 2025'],
    keywords: ['dso', 'days sales outstanding', 'delai paiement', 'clients', 'creances', 'recouvrement', 'formule', 'calcul dso'],
    category: 'blog',
    readTime: '8 min',
  },
  {
    slug: 'reduire-dso-50-pourcent-90-jours',
    title: 'Réduire son DSO de 50% en 90 jours : Guide Pratique',
    href: '/blog/reduire-dso-50-pourcent-90-jours',
    tags: ['DSO', 'Réduire DSO', 'Trésorerie', 'Recouvrement'],
    keywords: ['reduire dso', 'ameliorer dso', 'optimiser dso', 'recouvrement', 'relance', 'impayes', 'delai paiement'],
    category: 'blog',
    readTime: '12 min',
  },
  {
    slug: 'bfr-formule-optimisation',
    title: 'BFR : formule de calcul et optimisation 2025',
    href: '/blog/bfr-formule-optimisation',
    tags: ['BFR', 'Trésorerie', 'Optimisation', 'Formule'],
    keywords: ['bfr', 'besoin fonds roulement', 'fond roulement', 'cycle exploitation', 'stock', 'fournisseur', 'tresorerie'],
    category: 'blog',
    readTime: '10 min',
  },
  {
    slug: 'bfr-negatif-bon-ou-mauvais',
    title: 'BFR Négatif : Bon ou Mauvais pour Votre Entreprise ?',
    href: '/blog/bfr-negatif-bon-ou-mauvais',
    tags: ['BFR', 'BFR Négatif', 'Trésorerie'],
    keywords: ['bfr negatif', 'bfr negative', 'bon ou mauvais', 'distribution', 'saas', 'ecommerce'],
    category: 'blog',
    readTime: '10 min',
  },
  {
    slug: 'dso-vs-dpo-optimiser-tresorerie',
    title: 'DSO vs DPO : Optimiser l\'Équilibre Clients-Fournisseurs',
    href: '/blog/dso-vs-dpo-optimiser-tresorerie',
    tags: ['DSO', 'DPO', 'Cash Conversion Cycle'],
    keywords: ['dso', 'dpo', 'cash conversion', 'cycle tresorerie', 'fournisseurs', 'clients', 'delai'],
    category: 'blog',
    readTime: '9 min',
  },
  {
    slug: 'marge-nette-vs-brute',
    title: 'Marge nette vs marge brute : différences et calculs',
    href: '/blog/marge-nette-vs-brute',
    tags: ['Marges', 'Rentabilité', 'Calcul', 'Benchmark'],
    keywords: ['marge', 'marge nette', 'marge brute', 'marge commerciale', 'rentabilite', 'benefice', 'resultat'],
    category: 'blog',
    readTime: '7 min',
  },
  {
    slug: 'cash-flow-previsionnel-pme',
    title: 'Cash flow prévisionnel : méthode pratique pour PME',
    href: '/blog/cash-flow-previsionnel-pme',
    tags: ['Cash Flow', 'Prévisionnel', 'PME'],
    keywords: ['cash flow', 'flux tresorerie', 'previsionnel', 'prevision', 'pme', 'budget', 'anticipation'],
    category: 'blog',
    readTime: '9 min',
  },
  {
    slug: 'top-7-kpis-startups-saas',
    title: 'Top 7 KPIs financiers pour startups SaaS',
    href: '/blog/top-7-kpis-startups-saas',
    tags: ['SaaS', 'MRR', 'Churn', 'CAC', 'LTV'],
    keywords: ['saas', 'kpi', 'mrr', 'churn', 'cac', 'ltv', 'arpu', 'startup', 'recurring', 'abonnement'],
    category: 'blog',
    readTime: '8 min',
  },
  {
    slug: 'creances-clients-reduire-impayes',
    title: 'Créances clients : comment réduire les impayés',
    href: '/blog/creances-clients-reduire-impayes',
    tags: ['Créances', 'Impayés', 'Recouvrement'],
    keywords: ['creances', 'impayes', 'recouvrement', 'relance', 'facture', 'retard paiement', 'encours'],
    category: 'blog',
    readTime: '7 min',
  },
  {
    slug: 'tresorerie-pme-5-erreurs-eviter',
    title: 'Trésorerie PME : 5 erreurs à éviter',
    href: '/blog/tresorerie-pme-5-erreurs-eviter',
    tags: ['Trésorerie', 'PME', 'Erreurs'],
    keywords: ['tresorerie', 'erreur', 'pme', 'cash', 'gestion tresorerie', 'pilotage'],
    category: 'blog',
    readTime: '6 min',
  },
  {
    slug: '5-erreurs-tresorerie-pme',
    title: '5 erreurs de trésorerie qui coûtent cher aux PME',
    href: '/blog/5-erreurs-tresorerie-pme',
    tags: ['Trésorerie', 'PME', 'Erreurs', 'Cash'],
    keywords: ['tresorerie', 'erreur', 'pme', 'cash', 'couteux', 'piege'],
    category: 'blog',
    readTime: '7 min',
  },
  {
    slug: 'ratio-liquidite-interpretation',
    title: 'Ratio de liquidité : interpréter les résultats',
    href: '/blog/ratio-liquidite-interpretation',
    tags: ['Ratios', 'Liquidité', 'Analyse'],
    keywords: ['ratio', 'liquidite', 'solvabilite', 'current ratio', 'quick ratio', 'analyse financiere'],
    category: 'blog',
    readTime: '8 min',
  },
  {
    slug: 'budget-previsionnel-dashboard-ia',
    title: 'Budget prévisionnel : template Excel vs dashboard IA',
    href: '/blog/budget-previsionnel-dashboard-ia',
    tags: ['Budget', 'IA', 'Excel', 'Dashboard'],
    keywords: ['budget', 'previsionnel', 'excel', 'template', 'dashboard', 'ia', 'planification'],
    category: 'blog',
    readTime: '7 min',
  },
  {
    slug: '5-kpis-financiers-pme',
    title: 'Les 5 KPIs financiers essentiels pour PME',
    href: '/blog/5-kpis-financiers-pme',
    tags: ['KPIs', 'PME', 'Indicateurs', 'Pilotage'],
    keywords: ['kpi', 'indicateur', 'pme', 'pilotage', 'tableau bord', 'performance', 'suivi'],
    category: 'blog',
    readTime: '6 min',
  },
  {
    slug: 'eva-roic-illusion-performance',
    title: 'Pourquoi une entreprise rentable peut détruire de la valeur',
    href: '/blog/eva-roic-illusion-performance',
    tags: ['EVA', 'ROIC', 'WACC', 'Valeur'],
    keywords: ['eva', 'roic', 'wacc', 'creation valeur', 'destruction', 'rentabilite', 'cout capital'],
    category: 'blog',
    readTime: '14 min',
  },
  {
    slug: 'lire-bilan-compte-resultat-guide-pratique',
    title: 'Lire un bilan et un compte de résultat : guide pratique',
    href: '/blog/lire-bilan-compte-resultat-guide-pratique',
    tags: ['Bilan', 'Compte de résultat', 'États financiers'],
    keywords: ['bilan', 'compte resultat', 'etats financiers', 'actif', 'passif', 'charges', 'produits', 'comptabilite'],
    category: 'blog',
    readTime: '12 min',
  },
  {
    slug: 'probleme-tresorerie-pme-10-signes',
    title: 'Problème de Trésorerie PME : 10 Signes d\'Alerte (et Solutions)',
    href: '/blog/probleme-tresorerie-pme-10-signes',
    tags: ['Problème Trésorerie', 'PME', 'Alerte', 'Solutions'],
    keywords: ['probleme tresorerie', 'signe alerte', 'difficulte', 'cash', 'pme', 'solution', 'urgence'],
    category: 'blog',
    readTime: '12 min',
  },
  {
    slug: 'calculer-bfr-excel-template-2026',
    title: 'Calculer son BFR avec Excel : Template Gratuit 2026',
    href: '/blog/calculer-bfr-excel-template-2026',
    tags: ['BFR', 'Excel', 'Template', 'Calcul'],
    keywords: ['bfr', 'excel', 'template', 'calcul', 'formule', 'tableur', 'gratuit'],
    category: 'blog',
    readTime: '10 min',
  },
  {
    slug: 'pilotage-tresorerie-90-jours-methode',
    title: 'Pilotage Trésorerie 90 Jours : Méthode Complète PME',
    href: '/blog/pilotage-tresorerie-90-jours-methode',
    tags: ['Trésorerie', 'Pilotage', 'Méthode'],
    keywords: ['pilotage', 'tresorerie', '90 jours', 'methode', 'suivi', 'hebdomadaire', 'previsionnel'],
    category: 'blog',
    readTime: '11 min',
  },
  {
    slug: 'daf-externalise-pme-prix-2026',
    title: 'DAF Externalisé PME : Prix, Tarifs et ROI en 2026',
    href: '/blog/daf-externalise-pme-prix-2026',
    tags: ['DAF Externalisé', 'Prix', 'ROI', 'PME'],
    keywords: ['daf', 'externalise', 'prix', 'tarif', 'roi', 'directeur financier', 'consulting', 'audit'],
    category: 'blog',
    readTime: '15 min',
  },
  {
    slug: 'dashboard-financier-mort-agents-ia-2026',
    title: 'Pourquoi votre Dashboard Financier est mort (et ce qui le remplace en 2026)',
    href: '/blog/dashboard-financier-mort-agents-ia-2026',
    tags: ['Agents IA', 'Automation', 'Dashboard'],
    keywords: ['dashboard', 'agent ia', 'automation', 'tresoris', 'dashis', 'margis', 'scenaris'],
    category: 'blog',
    readTime: '8 min',
  },

  // --- Fondamentaux ---
  {
    slug: 'comprendre-cash-flow',
    title: 'Comprendre le Cash Flow',
    href: '/fondamentaux/comprendre-cash-flow',
    tags: ['Cash Flow', 'Fondamentaux'],
    keywords: ['cash flow', 'flux tresorerie', 'comprendre', 'base', 'fondamental', 'definition'],
    category: 'fondamentaux',
  },
  {
    slug: 'lire-bilan',
    title: 'Lire un Bilan Comptable',
    href: '/fondamentaux/lire-bilan',
    tags: ['Bilan', 'Fondamentaux'],
    keywords: ['bilan', 'comptable', 'actif', 'passif', 'capitaux propres', 'dette', 'lecture'],
    category: 'fondamentaux',
  },
  {
    slug: 'lire-compte-resultat',
    title: 'Lire un Compte de Résultat',
    href: '/fondamentaux/lire-compte-resultat',
    tags: ['Compte de résultat', 'Fondamentaux'],
    keywords: ['compte resultat', 'charges', 'produits', 'resultat net', 'exploitation', 'benefice'],
    category: 'fondamentaux',
  },
  {
    slug: 'ratios-essentiels',
    title: 'Les Ratios Financiers Essentiels',
    href: '/fondamentaux/ratios-essentiels',
    tags: ['Ratios', 'Fondamentaux'],
    keywords: ['ratio', 'financier', 'liquidite', 'solvabilite', 'rentabilite', 'autonomie', 'endettement'],
    category: 'fondamentaux',
  },
  {
    slug: 'questions-comptable',
    title: 'Les Questions à Poser à Votre Comptable',
    href: '/fondamentaux/questions-comptable',
    tags: ['Comptable', 'Fondamentaux'],
    keywords: ['comptable', 'question', 'expert comptable', 'relation', 'conseil', 'dirigeant'],
    category: 'fondamentaux',
  },
]

// ---------------------------------------------------------------------------
// Matching Engine
// ---------------------------------------------------------------------------

/**
 * Normalise un texte pour le matching (lowercase, sans accents, sans ponctuation)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Calcule le score de pertinence d'un article par rapport à une requête.
 * Score = nombre de mots-clés matchés + bonus pour les tags.
 */
function scoreArticle(article: ArticleRef, queryNorm: string): number {
  let score = 0

  // Keyword match (highest weight)
  for (const kw of article.keywords) {
    if (queryNorm.includes(kw)) {
      score += 3
    } else {
      // Partial match (each word)
      const kwWords = kw.split(' ')
      const matched = kwWords.filter((w) => queryNorm.includes(w))
      if (matched.length > 0) {
        score += matched.length * 1
      }
    }
  }

  // Tag match
  for (const tag of article.tags) {
    const tagNorm = normalizeText(tag)
    if (queryNorm.includes(tagNorm)) {
      score += 2
    }
  }

  // Title word match (lower weight)
  const titleWords = normalizeText(article.title).split(' ').filter((w) => w.length > 3)
  for (const tw of titleWords) {
    if (queryNorm.includes(tw)) {
      score += 0.5
    }
  }

  return score
}

/**
 * Trouve les articles les plus pertinents pour une question utilisateur.
 * Combine le matching textuel avec les alertes du scoring pipeline.
 */
export function matchArticles(
  userQuery: string,
  alertSlugs: string[] = [],
  maxResults: number = 3
): ArticleRef[] {
  const queryNorm = normalizeText(userQuery)

  // Score all articles
  const scored = ARTICLE_INDEX.map((article) => {
    let relevance = scoreArticle(article, queryNorm)

    // Boost articles referenced by alerts (from scoring pipeline)
    if (alertSlugs.includes(article.slug)) {
      relevance += 5
    }

    return { ...article, relevance }
  })

  // Filter and sort
  return scored
    .filter((a) => a.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxResults)
}

/**
 * Formatte les articles matchés pour injection dans le system prompt.
 */
export function formatArticlesForPrompt(articles: ArticleRef[]): string {
  if (articles.length === 0) return ''

  const lines = ['ARTICLES PERTINENTS À CITER :']
  for (const a of articles) {
    lines.push(`- [${a.title}](${a.href})${a.readTime ? ` (${a.readTime})` : ''}`)
  }
  lines.push('')
  lines.push('Cite naturellement 1-2 de ces articles dans ta réponse quand ils sont pertinents.')

  return lines.join('\n')
}

/**
 * OPUS ENGINE — Claude Opus integration for SCORIS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * SERVER-SIDE ONLY — never import from client components.
 *
 * Provides:
 *   - callOpus()          → Full RecommendationPlan from ScoreContext
 *   - callOpusSummary()   → Executive summary string only (lighter)
 *   - buildFallbackPlan() → Deterministic fallback when Opus is unavailable
 *
 * Used by:
 *   - /api/diagnostic/opus-plan (P1 PDF + P2 orchestrator)
 *   - /api/ai/recommendations   (P0 finSightScore path)
 *   - /api/relance/generate     (P4 email relance)
 */

import OpenAI from 'openai'
import { SECTOR_BENCHMARKS, type SectorKey } from '@/lib/scoring/diagnosticScore'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ScoreContext {
  /** Score global 0–100 */
  score: number
  /** Scores par pilier (0–25 chacun) */
  pillars: { cash: number; margin: number; resilience: number; risk: number }
  /** Secteur d'activité */
  sector: SectorKey
  /** Nom de l'entreprise (optionnel) */
  companyName?: string
  /** CA annuel estimé en € */
  caAnnuel?: number
  /** Indicateurs mesurés et médianes sectorielles associées */
  indicators: {
    dso?: number
    dsoMedian: number
    bfrJours?: number
    bfrJoursMedian: number
    marge?: number
    margeMedian: number
    ebitdaPct?: number
    ebitdaMedian: number
    burnRate?: number
    gearing?: number
    cacLtv?: number
  }
  /** Forces identifiées (strings) */
  forces: string[]
  /** Vulnérabilités identifiées (strings) */
  vulnerabilites: string[]
  /** Priorité texte du moteur SCORIS (fallback P1) */
  prioriteScorisFallback?: string
}

export interface OpusPriority {
  rank: 1 | 2 | 3
  title: string
  detail: string
  impactEuros?: number
  urgency: 'critique' | 'haute' | 'moyenne'
  horizon: '30j' | '90j' | '6m'
}

export interface OpusActionStep {
  semaine: string
  action: string
  kpi: string
  impactEstime: string
}

export interface RecommendationPlan {
  /** 80–120 mots, prose DAF senior — utilisé dans PDF page 2 et synthèse wizard */
  executiveSummary: string
  /** 3 priorités contextualisées secteur + chiffres réels — PDF page 3 */
  priorities: [OpusPriority, OpusPriority, OpusPriority]
  /** 4–6 actions semaine par semaine — optionnel, pour future feature */
  actionPlan90j: OpusActionStep[]
  /** Source : 'opus' | 'fallback' */
  source: 'opus' | 'fallback'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SYSTÈME PROMPT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const OPUS_SYSTEM_PROMPT = `Tu es un Directeur Administratif et Financier senior avec 20 ans d'expérience en accompagnement de PME françaises (CA 500k€ à 15M€). Tu interviens en mission DAF externalisé court terme.

TON RÔLE :
- Analyser un diagnostic financier et produire des recommandations opérationnelles
- Raisonner comme un DAF terrain, pas comme un consultant théorique
- Prioriser par impact cash à 90 jours, pas par esthétique intellectuelle
- Quantifier chaque recommandation en euros ou en jours de trésorerie récupérés

RÈGLES ABSOLUES :
1. Ne jamais inventer de chiffres absents du contexte fourni
2. Toujours citer l'indicateur source (ex: "DSO de 67j vs médiane sectorielle 45j")
3. Différencier selon le secteur — les leviers BTP ≠ SaaS ≠ Commerce ≠ CHR
4. Rester sous 150 mots par recommandation
5. Format JSON strict — aucun commentaire, aucun texte hors du bloc JSON
6. L'executiveSummary est de la prose fluide (pas de bullet points, pas de tirets)

REGISTRE : professionnel, direct, sans jargon inutile. Tu t'adresses à un dirigeant occupé, pas à un analyste.`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROMPT BUILDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function buildOpusPrompt(ctx: ScoreContext): string {
  const bench = SECTOR_BENCHMARKS[ctx.sector]
  const { indicators: ind } = ctx

  const indicatorsBlock = [
    ind.dso != null
      ? `- DSO : ${ind.dso}j | médiane ${bench.label} : ${ind.dsoMedian}j | écart : ${ind.dso > ind.dsoMedian ? '+' : ''}${ind.dso - ind.dsoMedian}j`
      : '- DSO : non renseigné',
    ind.marge != null
      ? `- Marge brute : ${ind.marge}% | médiane : ${ind.margeMedian}% | écart : ${(ind.marge - ind.margeMedian) > 0 ? '+' : ''}${(ind.marge - ind.margeMedian).toFixed(1)}pts`
      : '- Marge brute : non renseignée',
    ind.bfrJours != null
      ? `- BFR : ${ind.bfrJours}j de CA | médiane : ${ind.bfrJoursMedian}j`
      : '- BFR : non renseigné',
    ind.ebitdaPct != null
      ? `- EBITDA : ${ind.ebitdaPct}% du CA | médiane : ${ind.ebitdaMedian}%`
      : '- EBITDA : non renseigné',
    ind.gearing != null ? `- Gearing (Dette nette / EBITDA) : ${ind.gearing.toFixed(2)}x` : null,
    ind.burnRate != null ? `- Burn rate mensuel : ${ind.burnRate.toLocaleString('fr-FR')} €/mois` : null,
    ind.cacLtv != null ? `- Ratio LTV/CAC : ${ind.cacLtv.toFixed(1)}x` : null,
  ].filter(Boolean).join('\n')

  return `DIAGNOSTIC FINSIGHT™ — ${ctx.companyName || 'Entreprise analysée'}
Secteur : ${bench.label} | Score global SCORIS : ${ctx.score}/100
Répartition : Trésorerie ${ctx.pillars.cash}/25 | Rentabilité ${ctx.pillars.margin}/25 | Résilience ${ctx.pillars.resilience}/25 | Risques ${ctx.pillars.risk}/25
CA annuel estimé : ${ctx.caAnnuel ? `${Math.round(ctx.caAnnuel / 1000)} k€` : 'non renseigné'}

INDICATEURS vs MÉDIANES SECTORIELLES (${bench.label}) :
${indicatorsBlock}

FORCES IDENTIFIÉES :
${ctx.forces.length > 0 ? ctx.forces.map(f => `• ${f}`).join('\n') : '• Aucune force identifiée avec les données disponibles'}

VULNÉRABILITÉS :
${ctx.vulnerabilites.length > 0 ? ctx.vulnerabilites.map(v => `• ${v}`).join('\n') : '• Aucune vulnérabilité critique détectée'}

Génère un objet JSON avec exactement ces champs :
{
  "executiveSummary": "<80-120 mots de prose, ton DAF senior, pas de bullet points — synthèse de la situation + point de blocage principal + recommandation directrice>",
  "priorities": [
    {
      "rank": 1,
      "title": "<titre court, 4-7 mots>",
      "detail": "<recommandation actionnable, contextualisée avec les vrais chiffres fournis, 50-120 mots>",
      "impactEuros": <estimation €, null si non calculable>,
      "urgency": "critique",
      "horizon": "30j"
    },
    { "rank": 2, ... "urgency": "haute", "horizon": "90j" },
    { "rank": 3, ... "urgency": "moyenne", "horizon": "6m" }
  ],
  "actionPlan90j": [
    { "semaine": "S1-S2", "action": "<action concrète>", "kpi": "<indicateur de suivi>", "impactEstime": "<impact chiffré>" }
  ]
}

IMPORTANT : priorities doit contenir exactement 3 objets. actionPlan90j doit contenir 4 à 6 objets. JSON strict, aucun texte autour.`
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLIENT ANTHROPIC (lazy init)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let _client: OpenAI | null = null

function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY manquante dans les variables d\'environnement')
  }
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    })
  }
  return _client
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// callOpus() — fonction principale
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function callOpus(
  context: ScoreContext,
  options: { maxRetries?: number } = {},
): Promise<RecommendationPlan> {
  const { maxRetries = 1 } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const client = getClient()

      const completion = await client.chat.completions.create({
        model: 'anthropic/claude-opus-4-5',
        max_tokens: 2048,
        messages: [
          { role: 'system', content: OPUS_SYSTEM_PROMPT },
          { role: 'user', content: buildOpusPrompt(context) },
        ],
      })

      const raw = completion.choices[0]?.message?.content ?? ''

      // Extraire le JSON — Opus peut wrapper dans ```json ... ```
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim()

      const parsed = JSON.parse(jsonStr) as Omit<RecommendationPlan, 'source'>

      // Validation minimale
      if (
        !parsed.executiveSummary ||
        !Array.isArray(parsed.priorities) ||
        parsed.priorities.length !== 3
      ) {
        throw new Error('Structure JSON Opus invalide (executiveSummary ou priorities manquants)')
      }

      return { ...parsed, source: 'opus' }

    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))

      // Ne pas retry sur erreur d'auth ou parsing définitif
      const msg = lastError.message
      if (msg.includes('401') || msg.includes('403') || msg.includes('OPENAI_API_KEY')) break

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1200 * (attempt + 1)))
      }
    }
  }

  console.error('[OpusEngine] Fallback déclenché:', lastError?.message)
  return buildFallbackPlan(context)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// callOpusSummary() — version allégée (exec summary uniquement)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function callOpusSummary(context: ScoreContext): Promise<string> {
  try {
    const client = getClient()
    const bench = SECTOR_BENCHMARKS[context.sector]

    const prompt = `Rédige une synthèse financière en 80 à 120 mots, ton DAF senior, prose fluide (pas de listes), pour l'entreprise suivante.

Score SCORIS ${context.score}/100 | Secteur : ${bench.label}
Piliers : Trésorerie ${context.pillars.cash}/25, Rentabilité ${context.pillars.margin}/25, Résilience ${context.pillars.resilience}/25, Risques ${context.pillars.risk}/25
${context.indicators.dso != null ? `DSO : ${context.indicators.dso}j (médiane ${context.indicators.dsoMedian}j)` : ''}
${context.indicators.marge != null ? `Marge : ${context.indicators.marge}% (médiane ${context.indicators.margeMedian}%)` : ''}
${context.vulnerabilites.length > 0 ? `Vulnérabilité principale : ${context.vulnerabilites[0]}` : ''}
${context.forces.length > 0 ? `Point fort : ${context.forces[0]}` : ''}

La synthèse doit : (1) qualifier l'état de santé globale, (2) nommer le point de blocage principal avec chiffres, (3) donner la recommandation directrice. Réponds uniquement avec le texte de la synthèse, aucun JSON.`

    const message = await client.chat.completions.create({
      model: 'anthropic/claude-opus-4-5',
      max_tokens: 300,
      messages: [
        { role: 'system', content: OPUS_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    })

    const text = (message.choices[0]?.message?.content ?? '').trim()
    return text || buildFallbackSummary(context)

  } catch (err) {
    console.error('[OpusEngine] callOpusSummary fallback:', err)
    return buildFallbackSummary(context)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FALLBACKS déterministes — garantissent que le PDF est toujours générable
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function buildFallbackPlan(ctx: ScoreContext): RecommendationPlan {
  const bench = SECTOR_BENCHMARKS[ctx.sector]
  const { indicators: ind } = ctx

  // Priorité 1 : tirée du moteur SCORIS ou générée selon le pilier le plus faible
  const worstPillar = Object.entries(ctx.pillars).sort(([, a], [, b]) => a - b)[0][0]
  const p1Detail =
    ctx.prioriteScorisFallback ||
    (worstPillar === 'cash'
      ? `Le pilier Trésorerie (${ctx.pillars.cash}/25) est le point de friction prioritaire. ${ind.dso != null ? `Le DSO de ${ind.dso}j dépasse la médiane sectorielle de ${ind.dsoMedian}j — optimiser le recouvrement est l'action à impact le plus rapide.` : 'Sécuriser les encaissements et réduire l\'exposition créances.'}`
      : worstPillar === 'margin'
      ? `Le pilier Rentabilité (${ctx.pillars.margin}/25) nécessite une intervention. ${ind.marge != null ? `La marge de ${ind.marge}% est en dessous de la médiane sectorielle (${ind.margeMedian}%) — réviser la grille tarifaire ou réduire les charges variables.` : 'Analyser la structure des coûts et identifier les postes optimisables.'}`
      : `Le pilier ${worstPillar} (${(ctx.pillars as Record<string, number>)[worstPillar]}/25) concentre les actions prioritaires. Consulter le détail des indicateurs pour les actions spécifiques.`)

  return {
    executiveSummary: buildFallbackSummary(ctx),
    priorities: [
      {
        rank: 1,
        title: 'Action prioritaire identifiée',
        detail: p1Detail,
        impactEuros: undefined,
        urgency: 'critique',
        horizon: '30j',
      },
      {
        rank: 2,
        title: 'Optimisation du cycle de trésorerie',
        detail: `Aligner les délais fournisseurs sur les délais clients pour stabiliser le BFR. Cible : remonter 10 à 15 jours de trésorerie immobilisée${ind.bfrJours != null && ind.bfrJours > ind.bfrJoursMedian ? ` (BFR actuel ${ind.bfrJours}j vs médiane ${ind.bfrJoursMedian}j)` : ''}.`,
        impactEuros: undefined,
        urgency: 'haute',
        horizon: '90j',
      },
      {
        rank: 3,
        title: 'Monitoring mensuel des indicateurs',
        detail: `Mettre en place un point financier mensuel sur les 4 piliers SCORIS. Secteur ${bench.label} : surveiller particulièrement le DSO (médiane ${bench.dsoMedian}j) et la marge brute (médiane ${bench.margeMedian}%).`,
        impactEuros: undefined,
        urgency: 'moyenne',
        horizon: '6m',
      },
    ],
    actionPlan90j: [
      { semaine: 'S1-S2', action: 'Audit des créances clients en retard', kpi: 'Montant créances > 30j', impactEstime: 'Réduction DSO de 5-10j' },
      { semaine: 'S3-S4', action: 'Mise en place relances automatiques J-7 avant échéance', kpi: 'Taux de paiement à l\'échéance', impactEstime: 'Cash libéré sous 30j' },
      { semaine: 'M2', action: 'Négociation délais fournisseurs', kpi: 'DPO (délai paiement fournisseurs)', impactEstime: 'Amélioration BFR de 10-15j' },
      { semaine: 'M3', action: 'Revue de la grille tarifaire', kpi: 'Marge brute %', impactEstime: '+2-5pts de marge si hausse de 3-5%' },
    ],
    source: 'fallback',
  }
}

function buildFallbackSummary(ctx: ScoreContext): string {
  const bench = SECTOR_BENCHMARKS[ctx.sector]
  const level =
    ctx.score >= 75
      ? 'solide'
      : ctx.score >= 55
      ? 'globalement positif'
      : ctx.score >= 35
      ? 'en zone de vigilance'
      : 'fragile'

  const blocage =
    ctx.vulnerabilites[0]
      ? `Le point de friction principal : ${ctx.vulnerabilites[0].charAt(0).toLowerCase() + ctx.vulnerabilites[0].slice(1)}.`
      : 'Aucun point de blocage critique détecté sur les indicateurs renseignés.'

  const action =
    ctx.prioriteScorisFallback
      ? `Recommandation directrice : ${ctx.prioriteScorisFallback.charAt(0).toLowerCase() + ctx.prioriteScorisFallback.slice(1)}.`
      : `Recommandation : consolider les acquis et surveiller les médianes sectorielles ${bench.label}.`

  return `Avec un Score FinSight™ de ${ctx.score}/100, le profil financier de l'entreprise est ${level}. ${blocage} ${action}`
}

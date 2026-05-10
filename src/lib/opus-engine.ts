/**
 * OPUS ENGINE - Claude Opus integration for SCORIS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * SERVER-SIDE ONLY - never import from client components.
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

/** Bundle envoyé par le wizard stratégique → PDF / Opus */
export type StrategiqueContextPayload = {
  swotForce: string
  swotMenace: string
  objectif12mois: string
  zScore: number
  zZone: 'danger' | 'grise' | 'saine'
  actifTotal: number
  capitauxPropres: number
}

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
  /** Données SCORIS Stratégique (wizard + Z-Score) - uniquement si parcours stratégique */
  strategique?: StrategiqueContextPayload
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
  /** 80–120 mots, prose DAF senior - utilisé dans PDF (synthèse executive) et wizard */
  executiveSummary: string
  /** Narration courte par pilier - utilisée dans le PDF page "Analyse par pilier" */
  narrativeParPilier: {
    cash: string
    margin: string
    resilience: string
    risques: string
  }
  /** 3 priorités contextualisées secteur + chiffres réels - PDF priorités d'action */
  priorities: OpusPriority[]
  /** 5 questions/réponses préparées pour un rendez-vous bancaire */
  packBanquier: Array<{
    question: string
    reponse: string
  }>
  /** 3 radars d'alerte à 30 jours */
  radarsJ30: Array<{
    signal: string
    seuil: string
    action: string
  }>
  /** 4–6 actions semaine par semaine - optionnel, pour future feature */
  actionPlan90j: OpusActionStep[]
  /** Blocs enrichis - SCORIS Stratégique uniquement */
  analyseStrategique?: {
    swotStructure: {
      forces: string[]
      faiblesses: string[]
      opportunites: string[]
      menaces: string[]
    }
    zScoreCommentaire: string
    valorisationFourchette: {
      basse: number
      haute: number
      methode: string
    }
    recommendationFinancement: string
  }
  /** Source : 'opus' | 'fallback' */
  source: 'opus' | 'fallback'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SYSTÈME PROMPT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const OPUS_REDACTION_STYLE = `STYLE RÉDACTIONNEL (obligatoire pour toute prose générée) :
Style : DAF humain. Phrases courtes. Verbes d'action. Chiffres concrets.
Interdit : métaphores, superlatifs, constructions « double X + Y », tirets em (-), points d'exclamation, adjectifs dramatisants (critique, structurel, hémorragie, asphyxie, étau).
Format cible : « Vos clients paient en 75 jours. La norme secteur est 45j. Vous immobilisez 14k€ inutilement. Action : relance systématique dès J+30. »`

const OPUS_SYSTEM_PROMPT = `Tu es un Directeur Administratif et Financier senior avec 20 ans d'expérience en accompagnement de PME françaises (CA 500k€ à 15M€). Tu interviens en mission DAF externalisé court terme.

${OPUS_REDACTION_STYLE}

TON RÔLE :
- Analyser un diagnostic financier et produire des recommandations opérationnelles
- Raisonner comme un DAF terrain, pas comme un consultant théorique
- Prioriser par impact cash à 90 jours, pas par esthétique intellectuelle
- Quantifier chaque recommandation en euros ou en jours de trésorerie récupérés

RÈGLES ABSOLUES :
1. Ne jamais inventer de chiffres absents du contexte fourni
2. Toujours citer l'indicateur source (ex: "DSO de 67j vs médiane sectorielle 45j")
3. Différencier selon le secteur - les leviers BTP ≠ SaaS ≠ Commerce ≠ CHR
4. Rester sous 150 mots par recommandation
5. Format JSON strict - aucun commentaire, aucun texte hors du bloc JSON
6. L'executiveSummary est de la prose fluide (pas de bullet points, pas de tirets)
7. narrativeParPilier : 3-4 lignes par pilier, ton DAF senior direct, expliquer POURQUOI le score avec les vrais chiffres du contexte
8. packBanquier : questions réalistes de banquier PME (BNP/CIC/CA), réponses préparées avec les vrais indicateurs du diagnostic
9. radarsJ30 : signaux concrets, seuils chiffrés, action immédiate en cas de déclenchement

REGISTRE : professionnel, direct, sans jargon inutile. Tu t'adresses à un dirigeant occupé, pas à un analyste.`

const OPUS_STRATEGIC_MODE_APPEND = `MODE STRATÉGIQUE SCORIS :
En mode Stratégique, tu intègres l'analyse SWOT déclarée et le Z-Score Altman dans tes recommandations. Le SWOT n'est pas un simple résumé - c'est du contexte dirigeant qui enrichit l'analyse chiffrée.
Tu complètes obligatoirement le bloc JSON "analyseStrategique" : quadrants SWOT structurés, interprétation du Z-Score en prose, fourchette de valorisation cohérente si des bases de rentabilité sont fournies, et recommandations de financement adaptées au profil et à l'objectif 12 mois.`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROMPT BUILDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function strategicZoneExplanation(z: 'danger' | 'grise' | 'saine'): string {
  if (z === 'danger') return 'Zone danger (<1.23) : risque de défaillance élevé à 24 mois'
  if (z === 'grise') return "Zone grise (1,23–2,9) : situation à surveiller"
  return 'Zone saine (>2,9) : structure financière solide'
}

function buildStrategicContextBlock(s: NonNullable<ScoreContext['strategique']>): string {
  return `ANALYSE STRATÉGIQUE COMPLÉMENTAIRE :
Z-Score Altman : ${s.zScore.toFixed(2)} - ${strategicZoneExplanation(s.zZone)}
  → Zone danger (<1.23) : risque de défaillance élevé à 24 mois
  → Zone grise (1.23-2.9) : situation à surveiller
  → Zone saine (>2.9) : structure financière solide

Avantage concurrentiel déclaré (dirigeant) : ${s.swotForce}
Menace principale identifiée : ${s.swotMenace}
Objectif 12 mois : ${s.objectif12mois}
Actif total (déclaratif) : ${Math.round(s.actifTotal).toLocaleString('fr-FR')} € · Capitaux propres : ${Math.round(s.capitauxPropres).toLocaleString('fr-FR')} €

Adapte tes recommandations en fonction de ces éléments :
- Si objectif = cession → orienter vers valorisation et présentation
- Si objectif = levée de fonds → orienter vers ratios bancaires
- Si objectif = croissance → orienter vers investissement et BFR
- Si Z-Score zone danger → prioriser la survie avant la croissance`
}

function buildAnalyseStrategiqueJsonBlock(): string {
  return `,
  "analyseStrategique": {
    "swotStructure": {
      "forces": ["<3-6 puces : forces financières + déclarées du dirigeant>"],
      "faiblesses": ["<2-5 puces>"],
      "opportunites": ["<2-5 puces liées à l'objectif 12 mois>"],
      "menaces": ["<2-5 puces : risques financiers + menace déclarée>"]
    },
    "zScoreCommentaire": "<80-140 mots : interpréter le Z-Score, la zone, le lien avec la structure du bilan et la priorité cash>",
    "valorisationFourchette": {
      "basse": <nombre €, 0 si non estimable>,
      "haute": <nombre €, 0 si non estimable>,
      "methode": "<ex: Multiple EBITDA sectoriel - ou Non estimable si pas d'EBITDA>"
    },
    "recommendationFinancement": "<affacturage, BPI, crédit MT, médiation - adapté au profil et à l'objectif>"
  }`
}

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

  return `DIAGNOSTIC FINSIGHT™ - ${ctx.companyName || 'Entreprise analysée'}
Secteur : ${bench.label} | Score global SCORIS : ${ctx.score}/100
Répartition : Trésorerie ${ctx.pillars.cash}/25 | Rentabilité ${ctx.pillars.margin}/25 | Résilience ${ctx.pillars.resilience}/25 | Risques ${ctx.pillars.risk}/25
CA annuel estimé : ${ctx.caAnnuel ? `${Math.round(ctx.caAnnuel / 1000)} k€` : 'non renseigné'}

INDICATEURS vs MÉDIANES SECTORIELLES (${bench.label}) :
${indicatorsBlock}

FORCES IDENTIFIÉES :
${ctx.forces.length > 0 ? ctx.forces.map(f => `• ${f}`).join('\n') : '• Aucune force identifiée avec les données disponibles'}

VULNÉRABILITÉS :
${ctx.vulnerabilites.length > 0 ? ctx.vulnerabilites.map(v => `• ${v}`).join('\n') : '• Aucune vulnérabilité critique détectée'}
${ctx.strategique ? `\n\n${buildStrategicContextBlock(ctx.strategique)}\n` : ''}

Génère un objet JSON avec exactement ces champs :
{
  "executiveSummary": "<80-120 mots de prose, ton DAF senior, pas de bullet points - synthèse de la situation + point de blocage principal + recommandation directrice>",
  "narrativeParPilier": {
    "cash": "<3-4 lignes max, pourquoi ce score cash et impact concret>",
    "margin": "<3-4 lignes max, pourquoi ce score margin et impact concret>",
    "resilience": "<3-4 lignes max, pourquoi ce score resilience et impact concret>",
    "risques": "<3-4 lignes max, pourquoi ce score risques et impact concret>"
  },
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
  "packBanquier": [
    { "question": "<question banquier>", "reponse": "<réponse préparée avec chiffres>" }
  ],
  "radarsJ30": [
    { "signal": "<signal>", "seuil": "<seuil d'alerte chiffré>", "action": "<action immédiate>" }
  ],
  "actionPlan90j": [
    { "semaine": "S1-S2", "action": "<action concrète>", "kpi": "<indicateur de suivi>", "impactEstime": "<impact chiffré>" }
  ]${ctx.strategique ? buildAnalyseStrategiqueJsonBlock() : ''}
}

IMPORTANT :
- priorities doit contenir exactement 3 objets
- packBanquier doit contenir exactement 5 objets
- radarsJ30 doit contenir exactement 3 objets
- actionPlan90j doit contenir 4 à 6 objets
${ctx.strategique ? '- analyseStrategique est obligatoire : swotStructure avec 4 tableaux de chaînes non vides, zScoreCommentaire non vide, valorisationFourchette avec nombres cohérents (0 si non estimable), recommendationFinancement non vide.\n' : ''}
JSON strict, aucun texte autour.`
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

function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0) : []
}

function buildStrategicAnalyseFallback(ctx: ScoreContext): NonNullable<RecommendationPlan['analyseStrategique']> {
  const s = ctx.strategique!
  const bench = SECTOR_BENCHMARKS[ctx.sector]
  const forcesFin = ctx.forces.slice(0, 3)
  const faiblesFin = ctx.vulnerabilites.slice(0, 3)

  const opportunites: string[] = []
  if (s.objectif12mois.includes('croître') || s.objectif12mois.includes('Croître')) {
    opportunites.push('Accélération commerciale structurée avec pilotage BFR et marge')
    opportunites.push(`Benchmark secteur ${bench.label} pour pricing et médiane DSO ${bench.dsoMedian}j`)
  }
  if (s.objectif12mois.includes('levée') || s.objectif12mois.includes('crédit')) {
    opportunites.push('Montage de dossier bancaire : ratios dette / EBITDA, projections cash')
    opportunites.push('Accompagnement BPI / garanties publiques selon taille et secteur')
  }
  if (s.objectif12mois.includes('transmission') || s.objectif12mois.includes('cession')) {
    opportunites.push('Préparation dataroom : qualité des agrégats, normalisation du EBIT/EBITDA')
    opportunites.push('Identification acquéreurs / advisors selon profil PME')
  }
  if (s.objectif12mois.includes('trésorerie') || s.objectif12mois.includes('Stabiliser')) {
    opportunites.push('Plan de réduction de fragilité cash (DSO, stock, dette fournisseur)')
  }
  if (opportunites.length === 0) {
    opportunites.push('Aligner les leviers opérationnels sur l’objectif prioritaire 12 mois')
  }

  const menaces: string[] = [
    ...faiblesFin,
    s.swotMenace.trim() ? `Déclaration dirigeant : ${s.swotMenace}` : '',
  ].filter(Boolean)

  const zScoreCommentaire =
    s.zZone === 'danger'
      ? `Le Z-Score ressort à ${s.zScore.toFixed(2)} (zone de danger). La structure laisse peu de marge : prioriser le cash, la négociation des échéances et la réduction des fragilités récurrentes avant toute offensive de croissance.`
      : s.zZone === 'grise'
        ? `Le Z-Score à ${s.zScore.toFixed(2)} se situe en zone d'incertitude. Le profil est gérable mais exige un suivi serré des encaissements, de la marge et de l'endettement.`
        : `Le Z-Score à ${s.zScore.toFixed(2)} indique une structure bilan plus confortable ; reste à aligner l'exécution opérationnelle (BFR, marge) avec l'ambition 12 mois.`

  const ca = ctx.caAnnuel ?? 0
  const e = ctx.indicators.ebitdaPct
  let basse = 0
  let haute = 0
  let methode = 'Non estimable - renseigner EBITDA / CA pour une fourchette'
  if (ca > 0 && e != null && e > 0) {
    const ebitdaEur = ca * (e / 100)
    basse = Math.round(ebitdaEur * 4)
    haute = Math.round(ebitdaEur * 7)
    methode = `Multiple EBITDA sectoriel (fourchette indicative 4x–7x appliquée à l'EBITDA déclaratif ${e}% du CA, secteur ${bench.label})`
  }

  let recommendationFinancement =
    'Envisager affacturage ciblant les gros comptes clients, ligne de trésorerie complémentaire, et médiation avec la banque sur le carnet d’échéances.'
  if (s.zZone === 'danger') {
    recommendationFinancement =
      'Priorité : plafond de trésorerie, report d’échéances, factoring/affacturage, BPI en garantie d’escompte ; limiter les investissements non critiques.'
  } else if (s.objectif12mois.includes('levée') || s.objectif12mois.includes('crédit')) {
    recommendationFinancement =
      'Préparer un dossier crédit moyen/long terme : business plan, sensibilité tréso, covenants - coupler banque et dispositifs BPI selon elgibilité.'
  }

  return {
    swotStructure: {
      forces: [
        ...forcesFin.map((x) => `Financier : ${x}`),
        s.swotForce.trim() ? `Dirigeant : ${s.swotForce}` : '',
      ].filter(Boolean),
      faiblesses: faiblesFin.length > 0 ? faiblesFin.map((x) => `Financier : ${x}`) : ['Données partielles - compléter le diagnostic pour affiner'],
      opportunites: opportunites.slice(0, 6),
      menaces: menaces.slice(0, 6),
    },
    zScoreCommentaire,
    valorisationFourchette: { basse, haute, methode },
    recommendationFinancement,
  }
}

function mergeAnalyseStrategiqueFromOpus(
  raw: unknown,
  ctx: ScoreContext,
): NonNullable<RecommendationPlan['analyseStrategique']> {
  const fb = buildStrategicAnalyseFallback(ctx)
  if (!raw || typeof raw !== 'object') return fb
  const a = raw as Record<string, unknown>
  const sw = a.swotStructure && typeof a.swotStructure === 'object' ? (a.swotStructure as Record<string, unknown>) : null
  const val = a.valorisationFourchette && typeof a.valorisationFourchette === 'object'
    ? (a.valorisationFourchette as Record<string, unknown>)
    : null

  const mergedSw = sw
    ? {
        forces: strArr(sw.forces).length ? strArr(sw.forces) : fb.swotStructure.forces,
        faiblesses: strArr(sw.faiblesses).length ? strArr(sw.faiblesses) : fb.swotStructure.faiblesses,
        opportunites: strArr(sw.opportunites).length ? strArr(sw.opportunites) : fb.swotStructure.opportunites,
        menaces: strArr(sw.menaces).length ? strArr(sw.menaces) : fb.swotStructure.menaces,
      }
    : fb.swotStructure

  const zc = typeof a.zScoreCommentaire === 'string' && a.zScoreCommentaire.trim().length > 10
    ? a.zScoreCommentaire.trim()
    : fb.zScoreCommentaire

  let vf = fb.valorisationFourchette
  if (val) {
    const basse = typeof val.basse === 'number' && Number.isFinite(val.basse) ? val.basse : fb.valorisationFourchette.basse
    const haute = typeof val.haute === 'number' && Number.isFinite(val.haute) ? val.haute : fb.valorisationFourchette.haute
    const methode = typeof val.methode === 'string' && val.methode.trim() ? val.methode.trim() : fb.valorisationFourchette.methode
    vf = { basse, haute, methode }
  }

  const rf = typeof a.recommendationFinancement === 'string' && a.recommendationFinancement.trim().length > 5
    ? a.recommendationFinancement.trim()
    : fb.recommendationFinancement

  return {
    swotStructure: mergedSw,
    zScoreCommentaire: zc,
    valorisationFourchette: vf,
    recommendationFinancement: rf,
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// callOpus() - fonction principale
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

      const systemContent = context.strategique
        ? `${OPUS_SYSTEM_PROMPT}\n\n${OPUS_STRATEGIC_MODE_APPEND}`
        : OPUS_SYSTEM_PROMPT

      const completion = await client.chat.completions.create({
        model: 'anthropic/claude-opus-4.5',
        max_tokens: 4500,
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: buildOpusPrompt(context) },
        ],
      })

      const raw = completion.choices[0]?.message?.content ?? ''

      // Extraire le JSON - Opus peut wrapper dans ```json ... ```
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim()

      const parsed = JSON.parse(jsonStr) as Omit<RecommendationPlan, 'source'>

      // Validation minimale
      if (
        !parsed.executiveSummary ||
        !Array.isArray(parsed.priorities) ||
        parsed.priorities.length !== 3 ||
        !parsed.narrativeParPilier ||
        !parsed.narrativeParPilier.cash ||
        !parsed.narrativeParPilier.margin ||
        !parsed.narrativeParPilier.resilience ||
        !parsed.narrativeParPilier.risques ||
        !Array.isArray(parsed.packBanquier) ||
        parsed.packBanquier.length !== 5 ||
        !Array.isArray(parsed.radarsJ30) ||
        parsed.radarsJ30.length !== 3
      ) {
        throw new Error('Structure JSON Opus invalide (blocs enrichis manquants)')
      }

      const out: RecommendationPlan = {
        ...parsed,
        source: 'opus',
        ...(context.strategique
          ? { analyseStrategique: mergeAnalyseStrategiqueFromOpus(parsed.analyseStrategique, context) }
          : {}),
      }

      return out

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
// callOpusSummary() - version allégée (exec summary uniquement)
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

    const summarySystem = context.strategique
      ? `${OPUS_SYSTEM_PROMPT}\n\n${OPUS_STRATEGIC_MODE_APPEND}`
      : OPUS_SYSTEM_PROMPT

    const strategicLines = context.strategique
      ? `
Contexte stratégique : Z-Score ${context.strategique.zScore.toFixed(2)} (${context.strategique.zZone}). Objectif 12 mois : ${context.strategique.objectif12mois}.
Avantage concurrentiel (dirigeant) : ${context.strategique.swotForce}
Menace déclarée : ${context.strategique.swotMenace}`
      : ''

    const message = await client.chat.completions.create({
      model: 'anthropic/claude-opus-4.5',
      max_tokens: 380,
      messages: [
        { role: 'system', content: summarySystem },
        { role: 'user', content: `${prompt}${strategicLines}` },
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
// FALLBACKS déterministes - garantissent que le PDF est toujours générable
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function buildFallbackPlan(ctx: ScoreContext): RecommendationPlan {
  const bench = SECTOR_BENCHMARKS[ctx.sector]
  const { indicators: ind } = ctx

  // Priorité 1 : tirée du moteur SCORIS ou générée selon le pilier le plus faible
  const worstPillar = Object.entries(ctx.pillars).sort(([, a], [, b]) => a - b)[0][0]
  const p1Detail =
    ctx.prioriteScorisFallback ||
    (worstPillar === 'cash'
      ? `Le pilier Trésorerie (${ctx.pillars.cash}/25) est le point de friction prioritaire. ${ind.dso != null ? `Le DSO de ${ind.dso}j dépasse la médiane sectorielle de ${ind.dsoMedian}j - optimiser le recouvrement est l'action à impact le plus rapide.` : 'Sécuriser les encaissements et réduire l\'exposition créances.'}`
      : worstPillar === 'margin'
      ? `Le pilier Rentabilité (${ctx.pillars.margin}/25) nécessite une intervention. ${ind.marge != null ? `La marge de ${ind.marge}% est en dessous de la médiane sectorielle (${ind.margeMedian}%) - réviser la grille tarifaire ou réduire les charges variables.` : 'Analyser la structure des coûts et identifier les postes optimisables.'}`
      : `Le pilier ${worstPillar} (${(ctx.pillars as Record<string, number>)[worstPillar]}/25) concentre les actions prioritaires. Consulter le détail des indicateurs pour les actions spécifiques.`)

  const weakestPillars = Object.entries(ctx.pillars)
    .sort(([, a], [, b]) => a - b)
    .map(([k]) => k)

  const narrativeParPilier = {
    cash: ind.dso != null
      ? `Le pilier CASH est noté ${ctx.pillars.cash}/25. Votre DSO est à ${ind.dso}j contre une médiane sectorielle de ${ind.dsoMedian}j, ce qui pèse directement sur la liquidité disponible. L'enjeu immédiat est d'accélérer les encaissements pour réduire la tension de trésorerie.`
      : `Le pilier CASH est noté ${ctx.pillars.cash}/25. Les données de cycle d'encaissement sont partielles, ce qui limite la précision d'analyse. Priorité à la mesure du délai client et du BFR pour objectiver le besoin de cash court terme.`,
    margin: ind.marge != null
      ? `Le pilier MARGIN est noté ${ctx.pillars.margin}/25. Votre marge ressort à ${ind.marge}% vs ${ind.margeMedian}% pour le secteur, ce qui explique le niveau de score observé. Le levier principal reste la combinaison pricing, mix offre et discipline de coûts variables.`
      : `Le pilier MARGIN est noté ${ctx.pillars.margin}/25. La rentabilité n'est pas encore assez documentée pour une lecture fine. Il faut prioriser la mesure de la marge réelle et de la marge de sécurité pour fiabiliser les décisions tarifaires.`,
    resilience: `Le pilier RESILIENCE est noté ${ctx.pillars.resilience}/25. Le niveau traduit la capacité de l'entreprise à absorber un choc sans rupture de trajectoire. L'objectif est de renforcer les marges de manœuvre structurelles (diversification clients, dette, capacité d'autofinancement).`,
    risques: `Le pilier RISQUES est noté ${ctx.pillars.risk}/25. Ce score reflète les effets croisés entre délais d'encaissement, marge et pression de financement. Plus les signaux convergent, plus la probabilité d'un stress de trésorerie à 30-90 jours augmente.`,
  }

  const packBanquier = [
    {
      question: 'Comment évolue votre capacité à rembourser la dette à 12 mois ?',
      reponse: `Notre Score FinSight est de ${ctx.score}/100 avec un suivi mensuel des 4 piliers. Nous pilotons en priorité ${weakestPillars[0]} pour réduire le risque court terme et sécuriser la capacité de remboursement.`,
    },
    {
      question: 'Quel est votre plan concret pour améliorer la trésorerie ?',
      reponse: ind.dso != null
        ? `Nous ciblons le DSO, actuellement à ${ind.dso}j vs ${ind.dsoMedian}j sectoriel, via relance structurée, acomptes et renégociation des conditions de règlement.`
        : 'Nous mettons en place un plan 90 jours de pilotage cash avec suivi hebdomadaire des encaissements, décaissements et BFR.',
    },
    {
      question: 'Votre rentabilité est-elle suffisante pour absorber un aléa ?',
      reponse: ind.marge != null
        ? `La marge est à ${ind.marge}% (médiane ${ind.margeMedian}%). Notre plan vise un relèvement progressif de la marge via actions prix et rationalisation des coûts directs.`
        : 'Nous fiabilisons la mesure de marge et activons un plan d’optimisation des coûts variables et fixes pour créer un coussin de sécurité.',
    },
    {
      question: 'Quels indicateurs suivez-vous pour prévenir une dérive ?',
      reponse: `Nous suivons chaque mois DSO, BFR, marge et score de risque. Les écarts aux médianes ${bench.label} déclenchent des actions correctives dans un délai court.`,
    },
    {
      question: 'Quelles mesures prenez-vous si la conjoncture se dégrade ?',
      reponse: 'Nous avons un plan graduel : réduction des dépenses discrétionnaires, renforcement du recouvrement, ajustement du mix commercial et arbitrage des investissements non prioritaires.',
    },
  ]

  const radarByPillar: Record<string, { signal: string; seuil: string; action: string }> = {
    cash: {
      signal: 'Allongement des délais clients',
      seuil: `Si DSO > ${ind.dsoMedian + 10}j`,
      action: 'Lancer relance systématique J+3/J+7 et imposer des acomptes sur nouveaux devis.',
    },
    margin: {
      signal: 'Erosion de la marge brute',
      seuil: `Si marge < ${Math.max(0, ind.margeMedian - 5)}%`,
      action: 'Revoir prix/mix offre et geler les coûts variables non essentiels sous 7 jours.',
    },
    resilience: {
      signal: 'Tension structurelle de financement',
      seuil: 'Si projection de trésorerie passe sous 30 jours de charges fixes',
      action: 'Activer plan de trésorerie d’urgence et renégocier les échéances court terme.',
    },
    risk: {
      signal: 'Accumulation de signaux croisés défavorables',
      seuil: 'Si score RISQUES < 12/25',
      action: 'Déclencher comité hebdomadaire de pilotage avec plan d’actions priorisé sur 30 jours.',
    },
  }

  const radarKeys = [weakestPillars[0], weakestPillars[1] ?? 'risk', weakestPillars[2] ?? 'margin']
  const radarsJ30 = radarKeys.map((pillarKey) => {
    const key = pillarKey === 'risk' ? 'risk' : pillarKey
    return radarByPillar[key] ?? radarByPillar.risk
  })

  const basePlan: RecommendationPlan = {
    executiveSummary: buildFallbackSummary(ctx),
    narrativeParPilier,
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
    packBanquier,
    radarsJ30,
    actionPlan90j: [
      { semaine: 'S1-S2', action: 'Audit des créances clients en retard', kpi: 'Montant créances > 30j', impactEstime: 'Réduction DSO de 5-10j' },
      { semaine: 'S3-S4', action: 'Mise en place relances automatiques J-7 avant échéance', kpi: 'Taux de paiement à l\'échéance', impactEstime: 'Cash libéré sous 30j' },
      { semaine: 'M2', action: 'Négociation délais fournisseurs', kpi: 'DPO (délai paiement fournisseurs)', impactEstime: 'Amélioration BFR de 10-15j' },
      { semaine: 'M3', action: 'Revue de la grille tarifaire', kpi: 'Marge brute %', impactEstime: '+2-5pts de marge si hausse de 3-5%' },
    ],
    source: 'fallback',
  }

  if (ctx.strategique) {
    return {
      ...basePlan,
      analyseStrategique: buildStrategicAnalyseFallback(ctx),
    }
  }

  return basePlan
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

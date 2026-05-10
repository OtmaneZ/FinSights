/**
 * Analyse narrative premium pour rapports calculateur (Claude via OpenRouter).
 * En cas d'échec : null - le PDF retombe sur le contenu statique existant.
 */

import OpenAI from 'openai'
import { logger } from '@/lib/logger'
import type { CalculatorPDFCalculatorType } from '@/lib/pdf/generateCalculatorPDF'

export type PlanActionHorizon = '30j' | '90j' | '6mois'

export interface CalculatorPlanActionItem {
  priorite: number
  horizon: PlanActionHorizon
  action: string
  impact: string
}

export interface CalculatorAnalysis {
  diagnosticNarratif: string
  coutInaction: string
  benchmarkContextualise: string
  planAction: CalculatorPlanActionItem[]
  signalAlerte: string
  prochaineEtape: string
}

const SYSTEM_PROMPT = `Tu es un analyste financier senior de niveau McKinsey, spécialisé dans le diagnostic des PME françaises (2M€ à 20M€ de CA).
Tu produis des analyses financières précises, chiffrées et actionnables.
Ton ton est direct, professionnel, sans jargon inutile.
Tu t'adresses au dirigeant, pas au comptable.
Tu ne répètes jamais les données brutes sans les interpréter.
Tu chiffres systématiquement l'impact business de chaque observation.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.`

const MODEL = 'anthropic/claude-opus-4.5'

let _client: OpenAI | null = null

function getOpenRouterClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    })
  }
  return _client
}

function buildUserPrompt(
  calculatorType: CalculatorPDFCalculatorType,
  inputs: Record<string, unknown>,
  result: Record<string, unknown>,
): string {
  return `Tu analyses les résultats d'un dirigeant de PME française sur le calculateur ${calculatorType}.

Données saisies :
${JSON.stringify(inputs, null, 2)}

Résultats calculés :
${JSON.stringify(result, null, 2)}

Génère une analyse financière complète en JSON avec exactement ces clés :
{
  "diagnosticNarratif": "2-3 paragraphes - pourquoi ce résultat est bon/moyen/critique pour ce profil spécifique, causes probables, impact cash",
  "coutInaction": "1 paragraphe - ce que coûte concrètement chaque mois de ne rien changer, chiffré à partir des données réelles",
  "benchmarkContextualise": "2 paragraphes - positionnement vs PME françaises du même secteur si disponible, avec narration",
  "planAction": [
    {
      "priorite": 1,
      "horizon": "30j",
      "action": "action concrète et spécifique",
      "impact": "impact chiffré ou estimé"
    }
  ],
  "signalAlerte": "1 paragraphe - le risque principal à surveiller spécifique à ce profil et ces chiffres",
  "prochaineEtape": "1 paragraphe - pourquoi cet indicateur est probablement un symptôme d'un déséquilibre plus large, et comment le Score FinSight™ complet (diagnostic 4 piliers) permet d'identifier les autres leviers. Ton incitatif, pas commercial."
}

Contraintes pour "planAction" : exactement 5 objets, priorité 1 à 5, horizons répartis parmi "30j", "90j", "6mois" (au moins une valeur différente si pertinent).
Utilise les chiffres réels fournis. Ne génère pas de placeholders.
Si le secteur est fourni dans les inputs, contextualise avec ce secteur.`
}

function stripJsonFence(raw: string): string {
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  return (m ? m[1] : raw).trim()
}

function normalizeHorizon(v: unknown): PlanActionHorizon | null {
  if (typeof v !== 'string') return null
  const x = v.toLowerCase().replace(/\s+/g, '')
  if (x === '30j') return '30j'
  if (x === '90j') return '90j'
  if (x === '6mois') return '6mois'
  if (v.includes('30')) return '30j'
  if (v.includes('90')) return '90j'
  if (v.includes('6') && (v.includes('mois') || v.includes('month'))) return '6mois'
  return null
}

function horizonLabel(h: PlanActionHorizon): string {
  if (h === '30j') return '30 j'
  if (h === '90j') return '90 j'
  return '6 mois'
}

/** Pour affichage PDF (ré-export utile côté generateCalculatorPDF) */
export function formatHorizonForPdf(h: PlanActionHorizon): string {
  return horizonLabel(h)
}

function validateAnalysis(parsed: unknown): CalculatorAnalysis | null {
  if (!parsed || typeof parsed !== 'object') return null
  const o = parsed as Record<string, unknown>

  const diagnosticNarratif = typeof o.diagnosticNarratif === 'string' ? o.diagnosticNarratif.trim() : ''
  const coutInaction = typeof o.coutInaction === 'string' ? o.coutInaction.trim() : ''
  const benchmarkContextualise =
    typeof o.benchmarkContextualise === 'string' ? o.benchmarkContextualise.trim() : ''
  const signalAlerte = typeof o.signalAlerte === 'string' ? o.signalAlerte.trim() : ''
  const prochaineEtape = typeof o.prochaineEtape === 'string' ? o.prochaineEtape.trim() : ''

  if (!diagnosticNarratif || !coutInaction || !benchmarkContextualise || !signalAlerte || !prochaineEtape) {
    return null
  }

  if (!Array.isArray(o.planAction) || o.planAction.length !== 5) return null

  const planAction: CalculatorPlanActionItem[] = []
  for (let i = 0; i < 5; i++) {
    const row = o.planAction[i]
    if (!row || typeof row !== 'object') return null
    const r = row as Record<string, unknown>
    const priorite = typeof r.priorite === 'number' ? r.priorite : Number(r.priorite)
    const action = typeof r.action === 'string' ? r.action.trim() : ''
    const impact = typeof r.impact === 'string' ? r.impact.trim() : ''
    const horizon = normalizeHorizon(r.horizon)
    if (!Number.isFinite(priorite) || priorite < 1 || priorite > 5 || !action || !impact || !horizon) {
      return null
    }
    planAction.push({ priorite, horizon, action, impact })
  }

  return {
    diagnosticNarratif,
    coutInaction,
    benchmarkContextualise,
    planAction,
    signalAlerte,
    prochaineEtape,
  }
}

export interface GenerateCalculatorAnalysisParams {
  calculatorType: CalculatorPDFCalculatorType
  inputs: Record<string, unknown>
  result: Record<string, unknown>
}

export async function generateCalculatorAnalysis({
  calculatorType,
  inputs,
  result,
}: GenerateCalculatorAnalysisParams): Promise<CalculatorAnalysis | null> {
  try {
    const client = getOpenRouterClient()
    if (!client) {
      logger.warn('[generateCalculatorAnalysis] OPENAI_API_KEY absente - analyse IA ignorée')
      return null
    }

    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(calculatorType, inputs, result) },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    const jsonStr = stripJsonFence(raw)

    let parsed: unknown
    try {
      parsed = JSON.parse(jsonStr)
    } catch (e) {
      logger.error('[generateCalculatorAnalysis] JSON invalide:', e)
      return null
    }

    const validated = validateAnalysis(parsed)
    if (!validated) {
      logger.warn('[generateCalculatorAnalysis] Structure CalculatorAnalysis invalide après parsing')
      return null
    }

    return validated
  } catch (err) {
    logger.error('[generateCalculatorAnalysis] Échec appel Claude/OpenRouter:', err)
    return null
  }
}

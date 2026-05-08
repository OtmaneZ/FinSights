/**
 * POST /api/relance/generate
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Génère un email de relance client professionnel via Claude Opus.
 * Calibré selon le montant, le délai de retard, le ton souhaité
 * et le nom de l'entreprise émettrice.
 *
 * Utilisé depuis : composant RelanceEmailModal (future UI)
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { logger } from '@/lib/logger'

export interface RelanceRequest {
  /** Nom ou raison sociale du client débiteur */
  clientName: string
  /** Montant de la facture en € */
  montant: number
  /** Numéro ou référence de la facture (optionnel) */
  refFacture?: string
  /** Date d'échéance initiale (ISO string) */
  dateEcheance: string
  /** Nombre de jours de retard */
  joursRetard: number
  /** Nom de l'entreprise qui relance */
  companyName?: string
  /** Ton souhaité */
  ton: 'amiable' | 'ferme' | 'mise-en-demeure'
  /** Inclure une référence légale (L441-6 du Code de Commerce) */
  mentionLegale?: boolean
}

export interface RelanceResponse {
  success: boolean
  sujet?: string
  corps?: string
  source?: 'opus' | 'fallback'
  error?: string
}

// ── Ton → instructions rédactionnelles ───────────────────────────────────────
const TON_INSTRUCTIONS: Record<RelanceRequest['ton'], string> = {
  'amiable':
    'Ton cordial et professionnel. Supposer une erreur ou un oubli de bonne foi. Formulation bienveillante. Proposer une solution (virement, échelonnement). Pas de menace.',
  'ferme':
    'Ton professionnel et direct. Rappeler que la facture est impayée depuis X jours. Exiger un règlement sous 5 jours ouvrés. Mentionner les pénalités de retard légales sans menacer de poursuites.',
  'mise-en-demeure':
    'Ton formel et juridique. Mettre en demeure de régler sous 8 jours. Mentionner explicitement les pénalités de retard (taux légal) et les frais de recouvrement forfaitaires (40€). Indiquer que sans règlement, une procédure judiciaire sera engagée.',
}

// ── Fallback déterministe ─────────────────────────────────────────────────────
function buildFallbackRelance(req: RelanceRequest): { sujet: string; corps: string } {
  const montantFormatted = req.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
  const sender = req.companyName || 'Notre société'

  const sujet =
    req.ton === 'mise-en-demeure'
      ? `MISE EN DEMEURE — Facture ${req.refFacture || ''} — ${montantFormatted} — ${req.joursRetard} jours de retard`
      : req.ton === 'ferme'
      ? `RELANCE — Facture ${req.refFacture || ''} impayée — ${montantFormatted}`
      : `Rappel de règlement — Facture ${req.refFacture || ''} — ${montantFormatted}`

  const corps = `Madame, Monsieur,

Sauf erreur ou omission de notre part, nous constatons que la facture ${req.refFacture ? `n°${req.refFacture}` : ''} d'un montant de ${montantFormatted}, dont l'échéance était fixée au ${new Date(req.dateEcheance).toLocaleDateString('fr-FR')}, demeure impayée à ce jour (${req.joursRetard} jours de retard).

Nous vous prions de bien vouloir procéder au règlement de cette somme dans les meilleurs délais.${
    req.ton !== 'amiable'
      ? `\n\nÀ défaut de règlement sous 5 jours ouvrés, des pénalités de retard au taux légal en vigueur seront appliquées conformément aux dispositions de l'article L.441-6 du Code de Commerce.`
      : '\n\nSi ce règlement a déjà été effectué, veuillez considérer ce message comme sans objet.'
  }

Dans l'attente de votre retour, nous restons à votre disposition pour tout renseignement complémentaire.

Cordialement,
${sender}`

  return { sujet, corps }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RelanceResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' })
  }

  try {
    const body = req.body as RelanceRequest

    // Validation
    if (!body.clientName || !body.montant || !body.dateEcheance || !body.joursRetard || !body.ton) {
      return res.status(400).json({
        success: false,
        error: 'Champs obligatoires : clientName, montant, dateEcheance, joursRetard, ton',
      })
    }

    const montantFormatted = body.montant.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    })
    const dateFormatted = new Date(body.dateEcheance).toLocaleDateString('fr-FR')

    // Pas de clé OpenRouter → fallback
    if (!process.env.OPENAI_API_KEY) {
      logger.warn('[relance] OPENAI_API_KEY manquante — fallback déterministe')
      const fallback = buildFallbackRelance(body)
      return res.status(200).json({ success: true, ...fallback, source: 'fallback' })
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    })

    const prompt = `Rédige un email de relance commercial en français pour les paramètres suivants.

DESTINATAIRE : ${body.clientName}
EXPÉDITEUR : ${body.companyName || 'Notre société'}
RÉFÉRENCE FACTURE : ${body.refFacture || 'non précisée'}
MONTANT DÛ : ${montantFormatted}
DATE D'ÉCHÉANCE : ${dateFormatted}
JOURS DE RETARD : ${body.joursRetard} jours
TON SOUHAITÉ : ${body.ton}
INSTRUCTIONS TON : ${TON_INSTRUCTIONS[body.ton]}
MENTION LÉGALE : ${body.mentionLegale ? 'Inclure une référence à l\'article L.441-6 du Code de Commerce' : 'Non requise'}

Génère uniquement un objet JSON avec deux champs :
{
  "sujet": "<ligne objet de l'email, concise et professionnelle>",
  "corps": "<corps complet de l'email, avec formule d'appel, contenu, formule de politesse — utiliser \\n pour les sauts de ligne>"
}

Règles :
- Pas de placeholders comme [Votre nom] — utiliser les vraies valeurs fournies
- Formule d'appel : "Madame, Monsieur,"
- Formule de politesse adaptée au ton
- Corps entre 80 et 200 mots selon le ton
- JSON strict, aucun texte autour`

    const completion = await client.chat.completions.create({
      model: 'anthropic/claude-opus-4-5',
      max_tokens: 600,
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en recouvrement et communication B2B française. Tu rédiges des emails professionnels calibrés au contexte exact fourni.',
        },
        { role: 'user', content: prompt },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim()
    const parsed = JSON.parse(jsonStr) as { sujet: string; corps: string }

    if (!parsed.sujet || !parsed.corps) throw new Error('Structure JSON invalide')

    logger.debug('[relance] Email Opus généré pour', body.clientName)

    return res.status(200).json({
      success: true,
      sujet: parsed.sujet,
      corps: parsed.corps,
      source: 'opus',
    })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    logger.error('[relance] Erreur:', message)

    // Toujours retourner un email utilisable via fallback
    try {
      const fallback = buildFallbackRelance(req.body as RelanceRequest)
      return res.status(200).json({ success: true, ...fallback, source: 'fallback' })
    } catch {
      return res.status(500).json({ success: false, error: message })
    }
  }
}

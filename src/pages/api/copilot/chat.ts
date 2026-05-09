import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'
import { SYSTEM_PROMPT, buildFinancialContext } from '@/lib/copilot/prompts'
import { storeConversation, searchSimilarConversations } from '@/lib/vectordb/collections'
import { checkUnifiedRateLimit } from '@/lib/rateLimit'
import { getClientIP } from '@/lib/rateLimitKV'
import { logger } from '@/lib/logger';
import { anonymizeFinancialData } from '@/lib/ai/anonymizer'

// ── Routing heuristique : détecter les questions complexes ────────────────
// Les questions complexes méritent Claude Opus (analyse approfondie, plan d'action)
// Les questions simples restent sur gpt-4o-mini (réactivité conversationnelle)

const OPUS_TRIGGER_KEYWORDS = [
  'plan d\'action', 'stratégie', 'analyse approfondie', 'identifie tous',
  'explique en détail', 'que faire pour', 'comment améliorer', 'comment optimiser',
  'recommande', 'recommandations', 'risques principaux', 'risques de trésorerie',
  'plan 90', 'plan à 90', 'roadmap', 'priorise', 'priorités', 'diagnostic complet',
  'situation globale', 'synthèse complète', 'que penses-tu de', 'analyse ma',
  'analyse mon', 'analyse mes', 'évalue', 'compare', 'benchmark',
]

function requiresOpus(message: string): boolean {
  const lower = message.toLowerCase()
  // Question longue (> 100 chars) → probablement complexe
  if (message.length > 100) return true
  // Mots-clés déclencheurs
  return OPUS_TRIGGER_KEYWORDS.some(kw => lower.includes(kw))
}

interface CopilotRequest {
    message: string
    rawData?: any[]
    precomputedContext?: string
    companyName?: string
    conversationHistory?: Array<{
        role: 'user' | 'assistant'
        content: string
    }>
}

interface CopilotResponse {
    success: boolean
    response?: string
    error?: string
    rateLimitInfo?: {
        remaining: number
        limit: number
        message?: string
        upgradeUrl?: string
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CopilotResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Méthode non autorisée'
        })
    }

    // 🔐 Récupérer session utilisateur
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentification requise'
        })
    }

    const isAuthenticated = true
    const userId = session.user.id
    const userPlan = (session.user.plan as any) || 'FREE'
    const clientIP = getClientIP(req)

    // Identifier : userId
    const identifier = userId

    // 🛡️ RATE LIMITING UNIFIÉ (IP ou User selon session)
    const rateLimit = await checkUnifiedRateLimit(
        identifier,
        'copilot_queries',
        userPlan,
        isAuthenticated
    )

    if (!rateLimit.allowed) {
        return res.status(429).json({
            success: false,
            error: rateLimit.message || `Limite atteinte (${rateLimit.limit} questions/${rateLimit.resetAt ? 'jour' : 'total'})`,
            rateLimitInfo: {
                remaining: 0,
                limit: rateLimit.limit,
                message: rateLimit.message,
                upgradeUrl: rateLimit.upgradeUrl
            }
        })
    }

    try {
        const { message, rawData, precomputedContext, companyName, conversationHistory }: CopilotRequest = req.body

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Message requis'
            })
        }

        logger.debug('🤖 Copilot v3.0 - Requête:', {
            message: message.substring(0, 100),
            hasData: !!rawData || !!precomputedContext,
            dataCount: rawData?.length || 0,
            company: companyName,
            user: isAuthenticated ? userId : `IP:${clientIP}`,
            plan: userPlan,
            remaining: rateLimit.remaining
        })

        // 🏗️ Construire le contexte financier pour l'IA
        // Si le contexte est pré-calculé (client-side), on l'utilise directement pour économiser la bande passante
        // Sinon, on le construit à partir des données brutes (backward compatibility)
        let financialContext = '';
        
        if (precomputedContext) {
            financialContext = precomputedContext;
        } else {
            // 🛡️ ANONYMISATION RGPD (seulement si on traite les données brutes côté serveur)
            const anonymizedData = rawData ? anonymizeFinancialData(rawData) : null;
            financialContext = buildFinancialContext(anonymizedData || []);
        }

        // 🧠 Rechercher conversations similaires dans Pinecone
        let contextFromMemory = '';
        if (process.env.PINECONE_API_KEY) {
            try {
                const similarConvs = await searchSimilarConversations(message, companyName, 3);
                if (similarConvs.length > 0) {
                    contextFromMemory = '\n\n💭 Mémoire (conversations similaires passées):\n' +
                        similarConvs.map((conv, i) =>
                            `${i + 1}. ${conv.metadata.message} → ${conv.metadata.response.substring(0, 100)}...`
                        ).join('\n');
                    logger.debug(`🧠 ${similarConvs.length} conversations similaires trouvées`);
                }
            } catch (err) {
                logger.warn('⚠️ Erreur mémoire vectorielle (non-bloquant):', err);
            }
        }

        // Pas de clé API ? Mode démo
        if (!process.env.OPENAI_API_KEY) {
            logger.warn('⚠️ OPENAI_API_KEY manquante - Mode démo')
            return res.status(200).json({
                success: true,
                response: `🤖 **Mode Démo** (clé OpenRouter manquante)

Votre question : "${message}"

Pour activer l'IA complète, ajoutez votre clé dans \`.env.local\`:
\`\`\`
OPENAI_API_KEY=sk-or-...
\`\`\`

En attendant, voici ce que je peux dire sur vos données :
${rawData ? buildFinancialContext(rawData).substring(0, 500) + '...' : 'Aucune donnée chargée'}`
            })
        }

        // Client OpenRouter unique (compatible OpenAI SDK)
        const openrouter = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1',
        })

        // ── Routing : Opus pour les questions complexes, gpt-4o-mini pour le reste ──
        const useOpus = requiresOpus(message)
        const model = useOpus ? 'anthropic/claude-opus-4.5' : 'openai/gpt-4o-mini'
        const maxTokens = useOpus ? 1200 : 800
        const userContent = `Contexte financier actuel :\n${financialContext}\n\nQuestion de l'utilisateur : ${message}`

        logger.debug(`🧠 Routing copilot → ${model} (${message.length} chars)`)

        const completion = await openrouter.chat.completions.create({
            model,
            max_tokens: maxTokens,
            temperature: 0.3,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT + contextFromMemory },
                ...(conversationHistory || []),
                { role: 'user', content: userContent },
            ],
        })

        const response = completion.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.'

        logger.debug('✅ Réponse générée:', response.substring(0, 100) + '...')

        // 💾 Stocker la conversation dans Pinecone (async, non-bloquant)
        if (process.env.PINECONE_API_KEY && companyName) {
            storeConversation(
                companyName, // userId = companyName pour demo
                companyName,
                message,
                response
            ).catch(err => logger.warn('⚠️ Erreur stockage conversation (non-bloquant):', err));
        }

        return res.status(200).json({
            success: true,
            response,
            rateLimitInfo: {
                remaining: rateLimit.remaining,
                limit: rateLimit.limit,
                message: rateLimit.message,
                upgradeUrl: rateLimit.upgradeUrl
            }
        })

    } catch (error: any) {
        logger.error('❌ Erreur Copilot:', error)

        // Erreur OpenAI spécifique
        if (error?.error?.type === 'invalid_request_error') {
            return res.status(400).json({
                success: false,
                error: 'Requête invalide vers OpenAI'
            })
        }

        if (error?.error?.code === 'insufficient_quota') {
            return res.status(503).json({
                success: false,
                error: 'Quota OpenAI dépassé. Réessayez plus tard.'
            })
        }

        return res.status(500).json({
            success: false,
            error: 'Erreur serveur lors de la génération de la réponse'
        })
    }
}

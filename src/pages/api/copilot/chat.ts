import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { SYSTEM_PROMPT, buildFinancialContext } from '@/lib/copilot/prompts'
import { storeConversation, searchSimilarConversations } from '@/lib/vectordb/collections'

interface CopilotRequest {
    message: string
    rawData?: any[]
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

    try {
        const { message, rawData, companyName, conversationHistory }: CopilotRequest = req.body

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Message requis'
            })
        }

        console.log('🤖 Copilot v2.0 - Requête:', {
            message: message.substring(0, 100),
            hasData: !!rawData,
            dataCount: rawData?.length || 0,
            company: companyName
        })

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
                    console.log(`🧠 ${similarConvs.length} conversations similaires trouvées`);
                }
            } catch (err) {
                console.warn('⚠️ Erreur mémoire vectorielle (non-bloquant):', err);
            }
        }

        // Pas de clé API ? Mode démo
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️ OPENAI_API_KEY manquante - Mode démo')
            return res.status(200).json({
                success: true,
                response: `🤖 **Mode Démo** (clé OpenAI manquante)

Votre question : "${message}"

Pour activer l'IA complète, ajoutez votre clé OpenAI dans \`.env.local\`:
\`\`\`
OPENAI_API_KEY=sk-...
\`\`\`

En attendant, voici ce que je peux dire sur vos données :
${rawData ? buildFinancialContext(rawData).substring(0, 500) + '...' : 'Aucune donnée chargée'}`
            })
        }

        // Initialiser OpenAI
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })

        // Construire les messages pour GPT
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            }
        ]

        // Ajouter contexte financier si données disponibles
        if (rawData && rawData.length > 0) {
            messages.push({
                role: 'system',
                content: buildFinancialContext(rawData) + contextFromMemory
            })
        } else if (contextFromMemory) {
            messages.push({
                role: 'system',
                content: contextFromMemory
            })
        }

        // Ajouter historique conversation (max 5 derniers messages)
        if (conversationHistory && conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-5)
            messages.push(...recentHistory)
        }

        // Ajouter question utilisateur
        messages.push({
            role: 'user',
            content: message
        })

        console.log('🧠 Appel OpenAI GPT-4o-mini...')

        // Appel OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.3, // Précis, pas créatif
            max_tokens: 600,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        })

        const response = completion.choices[0].message.content || 'Désolé, je n\'ai pas pu générer de réponse.'

        console.log('✅ Réponse générée:', response.substring(0, 100) + '...')

        // 💾 Stocker la conversation dans Pinecone (async, non-bloquant)
        if (process.env.PINECONE_API_KEY && companyName) {
            storeConversation(
                companyName, // userId = companyName pour demo
                companyName,
                message,
                response
            ).catch(err => console.warn('⚠️ Erreur stockage conversation (non-bloquant):', err));
        }

        return res.status(200).json({
            success: true,
            response
        })

    } catch (error: any) {
        console.error('❌ Erreur Copilot:', error)

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

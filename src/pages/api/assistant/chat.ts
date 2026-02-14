import type { NextApiRequest, NextApiResponse } from 'next'
import { buildSystemPrompt, OPENROUTER_CONFIG } from '@/lib/assistant/config'
import { enrichContext } from '@/lib/assistant/scoring'
import { matchArticles, formatArticlesForPrompt } from '@/lib/assistant/articles'
import type { Calculation } from '@/hooks/useCalculatorHistory'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AssistantRequest {
  message: string
  currentPage: string
  /** Full calculator history (raw Calculation[]) — enriched server-side */
  calculatorHistory?: Calculation[]
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
}

// ---------------------------------------------------------------------------
// Rate limiter (simple in-memory, per IP)
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 }) // 1 minute window
    return true
  }

  if (entry.count >= 15) return false // 15 messages per minute

  entry.count++
  return true
}

// Cleanup stale entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key)
    }
  }, 300_000) // every 5 minutes
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limit
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown'

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Trop de requetes. Reessayez dans une minute.' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Configuration manquante.' })
  }

  try {
    const {
      message,
      currentPage,
      calculatorHistory,
      conversationHistory,
    }: AssistantRequest = req.body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message requis.' })
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message trop long (max 1000 caracteres).' })
    }

    // -----------------------------------------------------------------------
    // ENRICHMENT PIPELINE (server-side, before GPT)
    // -----------------------------------------------------------------------

    const history: Calculation[] = Array.isArray(calculatorHistory) ? calculatorHistory : []
    const hasData = history.length > 0

    // 1. Run scoring + benchmark enrichment
    let enrichedSummary: string | undefined
    let alertSlugs: string[] = []

    if (hasData) {
      const enriched = enrichContext(history)
      enrichedSummary = enriched.summary
      // Collect article slugs from alerts for RAG-lite boost
      alertSlugs = enriched.alerts
        .flatMap((a) => a.articleSlugs || [])
        .filter((s, i, arr) => arr.indexOf(s) === i)
    }

    // 2. RAG-lite: match articles based on user query + alert context
    const matchedArticles = matchArticles(message, alertSlugs, 3)
    const articlesPrompt = formatArticlesForPrompt(matchedArticles)

    // 3. Build system prompt with enriched context
    const systemPrompt = buildSystemPrompt({
      currentPage: currentPage || '/',
      enrichedSummary,
      articlesPrompt,
      hasData,
    })

    // Build conversation messages
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
    ]

    // Add conversation history (last 6 messages max)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-6)
      for (const msg of recentHistory) {
        messages.push({ role: msg.role, content: msg.content })
      }
    }

    messages.push({ role: 'user', content: message })

    // Set up streaming
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    })

    const response = await fetch(`${OPENROUTER_CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...OPENROUTER_CONFIG.headers,
      },
      body: JSON.stringify({
        model: OPENROUTER_CONFIG.defaultModel,
        messages,
        max_tokens: OPENROUTER_CONFIG.maxTokens,
        temperature: OPENROUTER_CONFIG.temperature,
        stream: true,
      }),
    })

    if (!response.ok) {
      // Fallback to secondary model
      const fallbackResponse = await fetch(
        `${OPENROUTER_CONFIG.baseURL}/chat/completions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            ...OPENROUTER_CONFIG.headers,
          },
          body: JSON.stringify({
            model: OPENROUTER_CONFIG.fallbackModel,
            messages,
            max_tokens: OPENROUTER_CONFIG.maxTokens,
            temperature: OPENROUTER_CONFIG.temperature,
            stream: true,
          }),
        }
      )

      if (!fallbackResponse.ok) {
        res.write(
          `data: ${JSON.stringify({ error: 'Service temporairement indisponible.' })}\n\n`
        )
        res.end()
        return
      }

      await streamResponse(fallbackResponse, res)
      return
    }

    await streamResponse(response, res)
  } catch (error) {
    console.error('[Assistant] Error:', error)
    try {
      res.write(
        `data: ${JSON.stringify({ error: 'Erreur interne du serveur.' })}\n\n`
      )
      res.end()
    } catch {
      // Response already closed
    }
  }
}

// ---------------------------------------------------------------------------
// Stream helper
// ---------------------------------------------------------------------------

async function streamResponse(
  response: Response,
  res: NextApiResponse
): Promise<void> {
  const reader = response.body?.getReader()
  if (!reader) {
    res.write(`data: ${JSON.stringify({ error: 'Erreur de streaming.' })}\n\n`)
    res.end()
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        const data = trimmed.slice(6)
        if (data === '[DONE]') {
          res.write('data: [DONE]\n\n')
          continue
        }

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`)
          }
        } catch {
          // Skip malformed chunks
        }
      }
    }
  } finally {
    reader.releaseLock()
    res.end()
  }
}

// Disable body parser for streaming
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '16kb',
    },
  },
}

'use client'

import { useState, useCallback, useRef } from 'react'
import type { Calculation } from '@/hooks/useCalculatorHistory'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AssistantMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AssistantContext {
  currentPage: string
  calculatorHistory?: Calculation[]
}

interface UseAssistantReturn {
  messages: AssistantMessage[]
  isStreaming: boolean
  error: string | null
  sendMessage: (content: string, context: AssistantContext) => Promise<void>
  clearMessages: () => void
}

// ---------------------------------------------------------------------------
// Session ID (persisted in localStorage)
// ---------------------------------------------------------------------------

const SESSION_KEY = 'finsight_assistant_session'
const MESSAGES_KEY = 'finsight_assistant_messages'
const MAX_STORED_MESSAGES = 20

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function loadStoredMessages(): AssistantMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(MESSAGES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.slice(-MAX_STORED_MESSAGES)
  } catch {
    return []
  }
}

function persistMessages(messages: AssistantMessage[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      MESSAGES_KEY,
      JSON.stringify(messages.slice(-MAX_STORED_MESSAGES))
    )
  } catch {
    // localStorage full or unavailable
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAssistant(): UseAssistantReturn {
  const [messages, setMessages] = useState<AssistantMessage[]>(() =>
    loadStoredMessages()
  )
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string, context: AssistantContext) => {
      if (!content.trim() || isStreaming) return

      setError(null)

      // Add user message
      const userMsg: AssistantMessage = {
        id: `u_${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      }

      const updatedMessages = [...messages, userMsg]
      setMessages(updatedMessages)

      // Prepare assistant placeholder
      const assistantId = `a_${Date.now()}`
      const assistantMsg: AssistantMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      }

      setMessages([...updatedMessages, assistantMsg])
      setIsStreaming(true)

      // Build conversation history for API
      const conversationHistory = updatedMessages
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }))

      // Abort previous request if any
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const response = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content.trim(),
            currentPage: context.currentPage,
            calculatorHistory: context.calculatorHistory,
            conversationHistory,
          }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Erreur ${response.status}`)
        }

        // Read SSE stream
        const reader = response.body?.getReader()
        if (!reader) throw new Error('Streaming non disponible')

        const decoder = new TextDecoder()
        let accumulated = ''
        let buffer = ''

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
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)

              if (parsed.error) {
                throw new Error(parsed.error)
              }

              if (parsed.content) {
                accumulated += parsed.content
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: accumulated } : m
                  )
                )
              }
            } catch (e) {
              if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
                // Only rethrow actual errors, not parsing issues
                if (
                  e.message !== '[DONE]' &&
                  !e.message.includes('Unexpected')
                ) {
                  throw e
                }
              }
            }
          }
        }

        // Persist final messages
        setMessages((prev) => {
          const final = prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
          persistMessages(final)
          return final
        })
      } catch (err) {
        if ((err as Error).name === 'AbortError') return

        const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue'
        setError(errorMsg)

        // Remove empty assistant message on error
        setMessages((prev) => {
          const cleaned = prev.filter((m) => m.id !== assistantId)
          persistMessages(cleaned)
          return cleaned
        })
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [messages, isStreaming]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MESSAGES_KEY)
    }
  }, [])

  return { messages, isStreaming, error, sendMessage, clearMessages }
}

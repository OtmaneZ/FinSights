'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, X, Send, ArrowRight, RotateCcw, Minus } from 'lucide-react'
import { useAssistant, type AssistantMessage } from '@/hooks/useAssistant'
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory'
import { getSuggestionsForPage } from '@/lib/assistant/config'

// ---------------------------------------------------------------------------
// Markdown-lite renderer (links + bold + lists)
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): string {
  return text
    // Links: [text](url)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="assistant-link" data-internal>$1</a>'
    )
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // List items
    .replace(/^- (.+)$/gm, '<span class="assistant-list-item">$1</span>')
    // Line breaks
    .replace(/\n/g, '<br />')
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FinSightAssistant() {
  const pathname = usePathname()
  const { messages, isStreaming, error, sendMessage, clearMessages } = useAssistant()
  const { history } = useCalculatorHistory()

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [mounted, setMounted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // SSR guard
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, isMinimized])

  // Track first interaction (hide badge after first use)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasInteracted(!!localStorage.getItem('finsight_assistant_used'))
    }
  }, [])

  // Build context for API calls — sends full calculation data for server-side enrichment
  const buildContext = useCallback(() => {
    return {
      currentPage: pathname || '/',
      calculatorHistory: history.length > 0 ? history : undefined,
    }
  }, [pathname, history])

  // Handle send
  const handleSend = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return

    setInput('')
    if (!hasInteracted) {
      setHasInteracted(true)
      localStorage.setItem('finsight_assistant_used', '1')
    }

    await sendMessage(trimmed, buildContext())
  }, [input, isStreaming, hasInteracted, sendMessage, buildContext])

  // Handle suggestion click
  const handleSuggestion = useCallback(
    async (text: string) => {
      if (isStreaming) return

      if (!hasInteracted) {
        setHasInteracted(true)
        localStorage.setItem('finsight_assistant_used', '1')
      }

      await sendMessage(text, buildContext())
    },
    [isStreaming, hasInteracted, sendMessage, buildContext]
  )

  // Handle link clicks inside rendered markdown
  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' && target.dataset.internal !== undefined) {
        const href = target.getAttribute('href')
        if (href && href.startsWith('/')) {
          e.preventDefault()
          setIsOpen(false)
          window.location.href = href
        }
      }
    },
    []
  )

  if (!mounted) return null

  const suggestions = getSuggestionsForPage(pathname || '/')

  // Don't show on dashboard pages (they have their own AICopilot)
  if (pathname?.startsWith('/dashboard')) return null

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/* Trigger Button (bottom-right)                                     */}
      {/* ----------------------------------------------------------------- */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            setIsMinimized(false)
          }}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--accent-primary)] text-white shadow-lg hover:bg-[var(--accent-primary-hover)] hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          aria-label="Ouvrir l'assistant FinSight"
        >
          <MessageSquare className="w-5 h-5" />
          {/* Notification dot for new users */}
          {!hasInteracted && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--accent-danger)] rounded-full border-2 border-white" />
          )}
        </button>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Chat Panel                                                        */}
      {/* ----------------------------------------------------------------- */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[380px] rounded-xl shadow-2xl border border-[var(--border-default)] overflow-hidden flex flex-col transition-all duration-200 ${
            isMinimized ? 'h-[52px]' : 'h-[520px]'
          }`}
          style={{ backgroundColor: 'var(--surface-elevated)' }}
        >
          {/* -------------------------------------------------------------- */}
          {/* Header                                                         */}
          {/* -------------------------------------------------------------- */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-default)] flex-shrink-0 cursor-pointer select-none"
            style={{ backgroundColor: 'var(--background-secondary)' }}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)] leading-tight">
                  Assistant FinSight
                </p>
                {!isMinimized && (
                  <p className="text-[10px] text-[var(--text-tertiary)] leading-tight">
                    Questions finance et navigation
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMinimized(!isMinimized)
                }}
                className="w-7 h-7 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors"
                aria-label={isMinimized ? 'Agrandir' : 'Reduire'}
              >
                <Minus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                }}
                className="w-7 h-7 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors"
                aria-label="Fermer"
              >
                <X className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Messages Area                                                  */}
          {/* -------------------------------------------------------------- */}
          {!isMinimized && (
            <>
              <div
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
                style={{ backgroundColor: 'var(--background-primary)' }}
              >
                {/* Welcome message when empty */}
                {messages.length === 0 && (
                  <div className="pt-2">
                    <p className="text-sm text-[var(--text-primary)] font-semibold mb-1">
                      Bonjour, comment puis-je vous aider ?
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mb-4 leading-relaxed">
                      Posez vos questions sur la finance d'entreprise ou la navigation du site.
                    </p>

                    {/* Suggested questions */}
                    <div className="space-y-1.5">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(s.text)}
                          disabled={isStreaming}
                          className="w-full text-left px-3 py-2.5 rounded-lg border border-[var(--border-default)] hover:border-[var(--accent-primary-border)] hover:bg-[var(--accent-primary-subtle)] transition-all text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium flex items-center justify-between group disabled:opacity-50"
                        >
                          <span>{s.text}</span>
                          <ArrowRight className="w-3 h-3 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onContentClick={handleContentClick}
                    isStreaming={isStreaming && msg.role === 'assistant' && msg.content === ''}
                  />
                ))}

                {/* Streaming indicator */}
                {isStreaming &&
                  messages.length > 0 &&
                  messages[messages.length - 1].content === '' && (
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="flex gap-1">
                        <span
                          className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                      <span className="text-[10px] text-[var(--text-tertiary)]">
                        Analyse en cours
                      </span>
                    </div>
                  )}

                {/* Error */}
                {error && (
                  <div className="px-3 py-2 bg-[var(--accent-danger-subtle)] border border-[var(--accent-danger-border)] rounded-lg">
                    <p className="text-xs text-[var(--accent-danger)]">{error}</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* -------------------------------------------------------------- */}
              {/* Input Area                                                     */}
              {/* -------------------------------------------------------------- */}
              <div
                className="flex-shrink-0 px-4 py-3 border-t border-[var(--border-default)]"
                style={{ backgroundColor: 'var(--background-secondary)' }}
              >
                {/* Quick suggestions after conversation */}
                {messages.length > 0 && messages.length < 4 && !isStreaming && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {suggestions.slice(0, 2).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(s.text)}
                        className="px-2.5 py-1 rounded-md border border-[var(--border-default)] text-[10px] font-medium text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary-border)] transition-all"
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder="Votre question..."
                    disabled={isStreaming}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--border-default)] bg-[var(--background-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--accent-primary-border)] transition-all disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isStreaming || !input.trim()}
                    className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white flex items-center justify-center hover:bg-[var(--accent-primary-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
                    aria-label="Envoyer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Footer: clear + branding */}
                <div className="flex items-center justify-between mt-2">
                  {messages.length > 0 && (
                    <button
                      onClick={clearMessages}
                      className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      Nouvelle conversation
                    </button>
                  )}
                  <span className="text-[9px] text-[var(--text-disabled)] ml-auto">
                    FinSight
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Message Bubble Sub-component
// ---------------------------------------------------------------------------

function MessageBubble({
  message,
  onContentClick,
  isStreaming,
}: {
  message: AssistantMessage
  onContentClick: (e: React.MouseEvent<HTMLDivElement>) => void
  isStreaming: boolean
}) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] px-3 py-2 rounded-lg bg-[var(--accent-primary)] text-white">
          <p className="text-xs leading-relaxed">{message.content}</p>
        </div>
      </div>
    )
  }

  // Assistant message
  if (!message.content && isStreaming) return null

  return (
    <div className="flex justify-start">
      <div
        className="max-w-[90%] px-3 py-2 rounded-lg border border-[var(--border-default)]"
        style={{ backgroundColor: 'var(--background-secondary)' }}
        onClick={onContentClick}
      >
        <div
          className="text-xs leading-relaxed text-[var(--text-primary)] assistant-content"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(message.content),
          }}
        />
      </div>
    </div>
  )
}

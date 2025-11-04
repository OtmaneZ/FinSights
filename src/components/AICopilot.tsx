'use client'

import { useState, useEffect, useRef } from 'react'
import { useFinancialData } from '@/lib/financialContext'
import { generateAutoSummary, generateSmartSuggestions } from '@/lib/copilot/prompts'

interface Message {
    id: string
    content: string
    isUser: boolean
    timestamp: Date
}

export default function AICopilot() {
    const { rawData, isDataLoaded } = useFinancialData()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [autoSummaryGenerated, setAutoSummaryGenerated] = useState(false)
    const [shouldAutoScroll, setShouldAutoScroll] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll vers le bas UNIQUEMENT après interaction utilisateur
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (shouldAutoScroll) {
            scrollToBottom()
            setShouldAutoScroll(false)
        }
    }, [messages, shouldAutoScroll])

    // Générer auto-summary quand données chargées
    useEffect(() => {
        if (isDataLoaded && rawData && rawData.length > 0 && !autoSummaryGenerated) {
            const summary = generateAutoSummary(rawData)
            const summaryMessage: Message = {
                id: Date.now().toString(),
                content: summary,
                isUser: false,
                timestamp: new Date()
            }
            setMessages([summaryMessage])
            setAutoSummaryGenerated(true)
        }
    }, [isDataLoaded, rawData, autoSummaryGenerated])

    // Suggestions dynamiques basées sur les données
    const suggestions = rawData && rawData.length > 0
        ? generateSmartSuggestions(rawData)
        : [
            "Qu'est-ce que FinSight ?",
            "Analyse l'évolution de ma trésorerie",
            "Quels sont mes plus gros clients ?",
            "Comment améliorer mon DSO ?"
        ]

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            isUser: true,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)
        setShouldAutoScroll(true) // ✅ Active scroll après envoi message

        try {
            const response = await fetch('/api/copilot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    rawData: rawData || [],
                    conversationHistory: messages.slice(-5).map(m => ({
                        role: m.isUser ? 'user' as const : 'assistant' as const,
                        content: m.content
                    }))
                })
            })

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`)
            }

            const result = await response.json()

            if (result.success) {
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    content: result.response || 'Désolé, je n\'ai pas pu générer de réponse.',
                    isUser: false,
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, aiResponse])
                setShouldAutoScroll(true) // ✅ Scroll après réponse IA
            } else {
                throw new Error(result.error || 'Erreur inconnue')
            }
        } catch (error) {
            console.error('❌ Erreur Copilot:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: `⚠️ Erreur : ${error instanceof Error ? error.message : 'Erreur serveur'}. Vérifiez que votre clé OpenAI est configurée dans \`.env.local\`.`,
                isUser: false,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
            setShouldAutoScroll(true) // ✅ Scroll même sur erreur
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion)
    }

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Copilote IA FinSight</h2>
                        <p className="text-sm text-blue-100">Propulsé par GPT-4o • Analyse temps réel</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="h-[500px] overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
                {messages.length === 0 && !isDataLoaded && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Prêt à analyser vos finances
                        </h3>
                        <p className="text-sm text-gray-600">
                            Importez votre fichier CSV ci-dessus, puis posez vos questions ici
                        </p>
                    </div>
                )}

                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${message.isUser
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-2 border-blue-200 text-gray-900 shadow-md'
                            }`}>
                            <div className="prose prose-sm max-w-none">
                                {message.isUser ? (
                                    <p className="text-sm font-medium whitespace-pre-wrap">{message.content}</p>
                                ) : (
                                    <div
                                        className="text-sm whitespace-pre-wrap markdown-content"
                                        dangerouslySetInnerHTML={{
                                            __html: message.content
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/\n/g, '<br />')
                                        }}
                                    />
                                )}
                            </div>
                            <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                {message.timestamp.toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border-2 border-gray-200 rounded-2xl px-5 py-3 shadow-md">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <p className="text-sm text-gray-600 ml-2">IA en train d'analyser...</p>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input zone */}
            <div className="border-t border-gray-200 bg-white px-6 py-4">
                <div className="flex gap-3 mb-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Posez votre question... (ex: Quel est mon DSO ?)"
                        className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                        {isLoading ? '⏳' : 'Envoyer'}
                    </button>
                </div>

                {/* Suggestions Pills */}
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-sm bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 px-5 py-2.5 rounded-full border border-blue-200 transition-all hover:shadow-md font-medium"
                            disabled={isLoading}
                        >
                            {suggestion.length > 60 ? suggestion.substring(0, 60) + '...' : suggestion}
                        </button>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .markdown-content strong {
                    font-weight: 600;
                    color: #1e40af;
                }
            `}</style>
        </div>
    )
}

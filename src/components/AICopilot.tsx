'use client'

import { useState, useEffect, useRef } from 'react'
import { ShieldCheck, Info } from 'lucide-react'
import { useFinancialData } from '@/lib/financialContext'
import { generateAutoSummary, buildFinancialContext } from '@/lib/copilot/prompts'
import { logger } from '@/lib/logger';

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
            // 🧠 Optimisation : On construit le contexte côté client pour éviter d'envoyer tout le CSV
            const context = buildFinancialContext(rawData || []);

            const response = await fetch('/api/copilot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    precomputedContext: context, // ✅ Envoi du contexte optimisé (string)
                    // rawData: rawData || [], // ❌ On n'envoie plus les données brutes pour économiser la bande passante
                    companyName: 'demo-user', // Pour la démo, utiliser un ID générique
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
            logger.error('❌ Erreur Copilot:', error)
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

    return (
        <div className="surface rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent-primary to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 surface/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Copilote IA FinSight</h2>
                            <p className="text-sm text-blue-100">Propulsé par GPT-4o • Analyse temps réel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm group relative cursor-help">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">RGPD Safe</span>

                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <p>Vos données sont <strong>anonymisées localement</strong> (nettoyage des noms, IBAN, emails) avant d'être analysées par l'IA.</p>
                            </div>
                        </div>
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
                            ? 'bg-accent-primary text-white shadow-lg'
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
                        <div className="surface border-2 border-gray-200 rounded-2xl px-5 py-3 shadow-md">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <p className="text-sm text-gray-600 ml-2">IA en train d'analyser...</p>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input zone */}
            <div className="border-t border-gray-200 surface px-6 py-4">
                <div className="flex gap-3 mb-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Posez votre question... (ex: Quelle est ma marge nette ?)"
                        className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-accent-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-accent-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                        {isLoading ? '⏳' : 'Envoyer'}
                    </button>
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

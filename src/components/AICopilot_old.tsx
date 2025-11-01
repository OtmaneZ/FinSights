'use client'

import { useState } from 'react'
import { useFinancialData } from '@/lib/financialContext'

interface Message {
    id: string
    content: string
    isUser: boolean
    timestamp: Date
}

export default function AICopilot() {
    const { finSightData, rawData, isDataLoaded } = useFinancialData()
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: isDataLoaded
                ? 'Bonjour ! Je suis votre copilote FinSight. Vos données financières sont chargées. Posez-moi des questions sur votre trésorerie, marges, DSO, ou demandez-moi une simulation.'
                : 'Bonjour ! Je suis votre copilote FinSight. Uploadez d\'abord vos données CSV dans le Dashboard, puis revenez ici pour poser vos questions financières.',
            isUser: false,
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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

        try {
            // Appel à notre nouvelle API copilot
            const response = await fetch('/api/copilot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    context: {
                        finSightData,
                        conversationHistory: messages.slice(-5) // Derniers 5 messages pour contexte
                    }
                })
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la communication avec l\'IA')
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
            } else {
                throw new Error(result.error || 'Erreur inconnue')
            }
        } catch (error) {
            console.error('❌ Erreur Copilot:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: `Désolé, j'ai rencontré une erreur : ${error instanceof Error ? error.message : 'Erreur inconnue'}. Veuillez réessayer.`,
                isUser: false,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const generateResponse = (query: string): string => {
        // Si pas de données chargées, rediriger vers le dashboard
        if (!isDataLoaded || !finSightData) {
            return `� Aucune donnée financière n'est chargée. Veuillez d'abord aller dans le Dashboard pour uploader votre fichier CSV, puis revenez ici pour analyser vos données.`
        }

        // Initialiser le calculateur avec les vraies données
        const calculator = new FinancialCalculator(finSightData, rawData)
        const lowerQuery = query.toLowerCase()

        // Analyser la question et appeler la bonne fonction de calcul
        if (lowerQuery.includes('trésorerie') || lowerQuery.includes('cash') || lowerQuery.includes('liquidité')) {
            return calculator.calculerTresorerie()
        }

        if (lowerQuery.includes('marge') || lowerQuery.includes('rentabilité') || lowerQuery.includes('profit')) {
            return calculator.calculerMarge()
        }

        if (lowerQuery.includes('créances') || lowerQuery.includes('paiement') || lowerQuery.includes('dso') || lowerQuery.includes('délai')) {
            return calculator.calculerDSO()
        }

        if (lowerQuery.includes('performance') || lowerQuery.includes('kpi') || lowerQuery.includes('indicateur') || lowerQuery.includes('résultat')) {
            return calculator.analyserPerformance()
        }

        if (lowerQuery.includes('risque') || lowerQuery.includes('alerte') || lowerQuery.includes('danger') || lowerQuery.includes('problème')) {
            return calculator.detecterRisques()
        }

        // Simulations what-if
        if (lowerQuery.includes('si je') || lowerQuery.includes('simulation') || lowerQuery.includes('que se passerait-il')) {
            // Extraire le type de simulation et la valeur
            if (lowerQuery.includes('dso') && lowerQuery.includes('jour')) {
                // Extraire le nombre de jours
                const match = lowerQuery.match(/(\d+)\s*jours?/)
                const jours = match ? parseInt(match[1]) : 10
                return calculator.simulerScenario('dso', jours)
            }

            if (lowerQuery.includes('marge') && lowerQuery.includes('%')) {
                // Extraire le pourcentage
                const match = lowerQuery.match(/(\d+(?:\.\d+)?)\s*%/)
                const pourcentage = match ? parseFloat(match[1]) : 5
                return calculator.simulerScenario('marge', pourcentage)
            }

            return `💡 Pour les simulations, précisez le type et la valeur. Exemples :\n` +
                `• "Que se passerait-il si je réduisais mon DSO de 10 jours ?"\n` +
                `• "Et si j'augmentais ma marge de 3% ?"`
        }

        // Réponse générale avec données disponibles
        return `🤖 Question reçue : "${query}"\n\n` +
            `📊 Données disponibles : ${finSightData.recordCount} transactions de ${finSightData.period.label}\n` +
            `💡 Questions suggérées :\n` +
            `• "Quelle est ma trésorerie actuelle ?"\n` +
            `• "Comment évolue ma marge ?"\n` +
            `• "Quel est mon DSO ?"\n` +
            `• "Quels sont les risques détectés ?"\n` +
            `• "Et si je réduisais mon DSO de 5 jours ?"`
    }

    return (
        <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">Copilote IA FinSight</h2>
                <p className="text-sm text-gray-600">Posez vos questions financières en langage naturel</p>
            </div>

            <div className="h-96 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isUser
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                                }`}
                        >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'
                                }`}>
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
                        <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ex: Quel est mon cash flow projeté à 90 jours ?"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
                    >
                        Envoyer
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    <button
                        onClick={() => setInput('Quel est mon délai moyen de paiement client ?')}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                    >
                        Délais de paiement
                    </button>
                    <button
                        onClick={() => setInput('Analyse ma marge brute ce mois')}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                    >
                        Analyse marge
                    </button>
                    <button
                        onClick={() => setInput('Projection trésorerie 3 mois')}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                    >
                        Projection trésorerie
                    </button>
                    <button
                        onClick={() => setInput('Quels sont mes principaux risques financiers ?')}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                    >
                        Analyse risques
                    </button>
                    <button
                        onClick={() => setInput('Comment ma performance se compare au secteur ?')}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                    >
                        Benchmark secteur
                    </button>
                    <button
                        onClick={() => setInput('Quelle est ma capacité d\'investissement ?')}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                    >
                        Capacité d'investissement
                    </button>
                </div>
            </div>
        </div>
    )
}
'use client'

import { useState } from 'react'

interface Message {
    id: string
    content: string
    isUser: boolean
    timestamp: Date
}

export default function AICopilot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Bonjour ! Je suis votre copilote FinSight. Posez-moi des questions sur vos finances en langage naturel.',
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

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: generateMockResponse(input),
                isUser: false,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiResponse])
            setIsLoading(false)
        }, 2000)
    }

    const generateMockResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase()

        if (lowerQuery.includes('trésorerie') || lowerQuery.includes('cash')) {
            return `💰 Votre position de trésorerie actuelle est de 245 000€. La projection à 30 jours montre 198 000€ (-19%), principalement due aux échéances fournisseurs du 15 novembre (85k€). Je recommande de négocier un échelonnement avec le fournisseur principal ou d'accélérer l'encaissement des factures en cours (125k€ disponibles).`
        }

        if (lowerQuery.includes('marge') || lowerQuery.includes('rentabilité')) {
            return `📊 Votre marge brute s'établit à 42.8% ce mois-ci, en baisse de 2.3 points vs septembre. Cette dégradation s'explique par l'augmentation des coûts matières premières (+8%) et un mix produit défavorable. Les lignes "Premium" maintiennent 65% de marge. Actions suggérées : réviser les prix ou optimiser les achats.`
        }

        if (lowerQuery.includes('créances') || lowerQuery.includes('paiement') || lowerQuery.includes('dso')) {
            return `⏰ Le délai moyen de paiement client atteint 47 jours (+5j vs N-1). 3 clients représentent 65% du retard : SARL Dupont (125k€, 73j), SAS Martin (89k€, 68j), EURL Blanc (45k€, 52j). Je suggère une relance ciblée avec conditions préférentielles en cas de règlement rapide.`
        }

        if (lowerQuery.includes('budget') || lowerQuery.includes('prévision') || lowerQuery.includes('forecast')) {
            return `🔮 Selon vos tendances actuelles, votre budget Q4 devrait être atteint à 103%. Risques identifiés : inflation des coûts énergétiques (+12%) et retard sur 2 gros contrats. Opportunités : nouveau marché export (+15% potentiel) et optimisation fiscale possible (économie 25k€).`
        }

        if (lowerQuery.includes('performance') || lowerQuery.includes('kpi') || lowerQuery.includes('indicateur')) {
            return `📈 Performance globale : CA +8.5% (excellent), marge -2.3pt (attention), trésorerie +12.3% (très bon). Vos KPIs sont dans la moyenne haute de votre secteur. Points d'amélioration prioritaires : maîtrise des coûts et accélération des encaissements.`
        }

        if (lowerQuery.includes('concurrent') || lowerQuery.includes('marché') || lowerQuery.includes('secteur')) {
            return `🏆 Votre position concurrentielle est solide. Marges supérieures au secteur (+3pt), croissance soutenue, mais DSO dégradé vs concurrents. Benchmark sectoriel : CA médian 850k€, marge 39%, DSO 42j. Vous surperformez globalement.`
        }

        if (lowerQuery.includes('risque') || lowerQuery.includes('alerte') || lowerQuery.includes('danger')) {
            return `⚠️ Risques détectés : concentration client (top 3 = 67% CA), dépendance fournisseur unique pour 45% des achats, trésorerie tendue en novembre. Actions préventives : diversification portefeuille, négociation échéancier, ligne de crédit de précaution.`
        }

        if (lowerQuery.includes('investissement') || lowerQuery.includes('projet') || lowerQuery.includes('expansion')) {
            return `💡 Capacité d'investissement estimée à 180k€ sur 12 mois (basée sur cash-flow opérationnel). Projets éligibles : digitalisation (ROI 24 mois), recrutement commercial (break-even 8 mois), extension géographique (étude préalable recommandée).`
        }

        return `🤖 Je comprends votre question sur "${query}". Pour une analyse précise, j'aurais besoin d'accéder aux données en temps réel. En attendant, consultez le tableau de bord pour les métriques actualisées ou reformulez votre question avec des termes spécifiques (trésorerie, marges, créances, performance, risques, etc.).`
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
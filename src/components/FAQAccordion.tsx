'use client'

import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

interface FAQItem {
    question: string
    answer: string
}

interface FAQCategory {
    category: string
    items: FAQItem[]
}

const faqData: FAQCategory[] = [
    {
        category: 'Général',
        items: [
            {
                question: 'FinSight remplace-t-il mon expert-comptable ?',
                answer: 'Non, FinSight complète votre expert-comptable en automatisant le reporting et l\'analyse. Les données restent sous votre contrôle. Notre outil génère des insights actionnables, mais nous recommandons toujours de consulter un professionnel pour les décisions stratégiques importantes.'
            },
            {
                question: 'Mes données sont-elles sécurisées ?',
                answer: 'Absolument. Chiffrement SSL, hébergement EU (Vercel), conformité RGPD. En version gratuite, vos données restent en local dans votre navigateur uniquement. En version Pro/Scale, elles sont stockées de manière chiffrée sur des serveurs européens avec backup quotidien.'
            },
            {
                question: 'Puis-je utiliser FinSight sans connexion internet ?',
                answer: 'La version gratuite fonctionne en mode local (vos données ne quittent jamais votre navigateur). Pour les fonctionnalités avancées (IA, alertes email, sauvegarde cloud), une connexion internet est nécessaire.'
            },
            {
                question: 'Combien de temps prend l\'analyse d\'un fichier ?',
                answer: 'L\'analyse est quasi instantanée. Pour un fichier de 1000 lignes, comptez 2-3 secondes. Les KPIs sont calculés en temps réel dès l\'import terminé.'
            }
        ]
    },
    {
        category: 'Tarifs & Abonnement',
        items: [
            {
                question: 'Puis-je changer de plan à tout moment ?',
                answer: 'Oui, vous pouvez upgrader immédiatement (accès instantané). Pour un downgrade, il prend effet à la fin de la période de facturation en cours.'
            },
            {
                question: 'Y a-t-il un engagement ?',
                answer: 'Non, aucun engagement. Vous pouvez annuler à tout moment. Pour les plans mensuels, annulation effective fin du mois. Pour les plans annuels, remboursement au prorata des mois non utilisés (à partir du 4ème mois).'
            },
            {
                question: 'Proposez-vous des réductions pour les ONG ou éducation ?',
                answer: 'Oui, nous offrons -50% sur le plan Pro pour les organisations à but non lucratif, associations et établissements d\'enseignement. Contactez-nous avec un justificatif.'
            },
            {
                question: 'Quels moyens de paiement acceptez-vous ?',
                answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard, Amex) et virements SEPA pour les plans annuels. Paiements sécurisés via Stripe.'
            },
            {
                question: 'Puis-je obtenir une facture ?',
                answer: 'Oui, une facture est générée automatiquement à chaque paiement et envoyée par email. Vous pouvez également les télécharger depuis votre espace client.'
            }
        ]
    },
    {
        category: 'Technique',
        items: [
            {
                question: 'Quels formats de fichiers acceptez-vous ?',
                answer: 'CSV et Excel (.xlsx, .xls). Nous fournissons des templates pour Sage, Cegid, QuickBooks et Excel générique. Le fichier doit contenir au minimum : Date, Montant, Type (income/expense).'
            },
            {
                question: 'L\'IA GPT-4 a-t-elle accès à mes données ?',
                answer: 'Oui, mais uniquement en contexte chiffré pour répondre à vos questions. Vos données ne sont jamais stockées chez OpenAI ni utilisées pour entraîner leurs modèles. Chaque requête est anonymisée et supprimée après traitement.'
            },
            {
                question: 'Puis-je importer des données de plusieurs exercices ?',
                answer: 'Oui, il n\'y a pas de limite de période. Vous pouvez importer des données sur 1 mois, 1 an ou 5 ans. FinSight s\'adapte automatiquement à la période détectée.'
            },
            {
                question: 'Comment fonctionne l\'API REST ?',
                answer: 'L\'API REST (plans Pro et Scale) permet d\'uploader des fichiers, récupérer des KPIs, et créer des webhooks. Documentation complète disponible à /api/v1/docs avec exemples Postman.'
            },
            {
                question: 'Puis-je exporter mes données ?',
                answer: 'Oui, export PDF (rapports) et Excel (données brutes + KPIs) disponibles. En plan Scale, export automatisé via API ou webhooks vers vos outils (Zapier, Make, etc.).'
            }
        ]
    }
]

interface FAQAccordionItemProps {
    item: FAQItem
    isOpen: boolean
    onToggle: () => void
}

function FAQAccordionItem({ item, isOpen, onToggle }: FAQAccordionItemProps) {
    return (
        <div className="surface rounded-xl overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-surface-hover transition-colors"
            >
                <span className="font-semibold text-text-primary pr-4">{item.question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-accent-gold flex-shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>
            {isOpen && (
                <div className="px-6 pb-5 text-text-secondary text-sm leading-relaxed border-t border-border-subtle">
                    <p className="pt-4">{item.answer}</p>
                </div>
            )}
        </div>
    )
}

export default function FAQAccordion() {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')

    const toggleItem = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`
        setOpenItems(prev => {
            const newSet = new Set(prev)
            if (newSet.has(key)) {
                newSet.delete(key)
            } else {
                newSet.add(key)
            }
            return newSet
        })
    }

    // Filter FAQ items based on search
    const filteredData = faqData.map(category => ({
        ...category,
        items: category.items.filter(
            item =>
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.items.length > 0)

    return (
        <div>
            {/* Search Bar */}
            <div className="relative mb-12">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                    type="text"
                    placeholder="Rechercher une question..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 surface rounded-xl border-2 border-border-default focus:border-accent-gold-border outline-none text-text-primary placeholder-text-tertiary transition-colors"
                />
            </div>

            {/* FAQ Categories */}
            <div className="space-y-12">
                {filteredData.map((category, categoryIndex) => (
                    <div key={category.category}>
                        <h3 className="text-2xl font-bold mb-6">{category.category}</h3>
                        <div className="space-y-3">
                            {category.items.map((item, itemIndex) => (
                                <FAQAccordionItem
                                    key={itemIndex}
                                    item={item}
                                    isOpen={openItems.has(`${categoryIndex}-${itemIndex}`)}
                                    onToggle={() => toggleItem(categoryIndex, itemIndex)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredData.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-text-secondary">
                        Aucune question trouvée pour "{searchQuery}"
                    </p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="mt-4 text-accent-gold hover:text-accent-gold-hover transition-colors"
                    >
                        Réinitialiser la recherche
                    </button>
                </div>
            )}
        </div>
    )
}

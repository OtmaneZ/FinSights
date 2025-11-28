'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQAccordion from '@/components/FAQAccordion'
import { MessageCircle, Mail } from 'lucide-react'

export default function FAQPage() {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'FinSight remplace-t-il mon expert-comptable ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Non, FinSight complète votre expert-comptable en automatisant le reporting et l\'analyse. Les données restent sous votre contrôle. Notre outil génère des insights actionnables, mais nous recommandons toujours de consulter un professionnel pour les décisions stratégiques importantes.'
                }
            },
            {
                '@type': 'Question',
                name: 'Mes données sont-elles sécurisées ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolument. Chiffrement SSL, hébergement EU (Vercel), conformité RGPD. En version gratuite, vos données restent en local dans votre navigateur uniquement. En version Pro/Scale, elles sont stockées de manière chiffrée sur des serveurs européens avec backup quotidien.'
                }
            },
            {
                '@type': 'Question',
                name: 'Puis-je utiliser FinSight sans connexion internet ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'La version gratuite fonctionne en mode local (vos données ne quittent jamais votre navigateur). Pour les fonctionnalités avancées (IA, alertes email, sauvegarde cloud), une connexion internet est nécessaire.'
                }
            },
            {
                '@type': 'Question',
                name: 'Combien de temps prend l\'analyse d\'un fichier ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'L\'analyse est quasi instantanée. Pour un fichier de 1000 lignes, comptez 2-3 secondes. Les KPIs sont calculés en temps réel dès l\'import terminé.'
                }
            },
            {
                '@type': 'Question',
                name: 'Puis-je changer de plan à tout moment ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Oui, vous pouvez upgrader immédiatement (accès instantané). Pour un downgrade, il prend effet à la fin de la période de facturation en cours.'
                }
            },
            {
                '@type': 'Question',
                name: 'Y a-t-il un engagement ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Non, aucun engagement. Vous pouvez annuler à tout moment. Pour les plans mensuels, annulation effective fin du mois. Pour les plans annuels, remboursement au prorata des mois non utilisés (à partir du 4ème mois).'
                }
            },
            {
                '@type': 'Question',
                name: 'Proposez-vous des réductions pour les ONG ou éducation ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Oui, nous offrons -50% sur le plan Pro pour les organisations à but non lucratif, associations et établissements d\'enseignement. Contactez-nous avec un justificatif.'
                }
            },
            {
                '@type': 'Question',
                name: 'Quels moyens de paiement acceptez-vous ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Nous acceptons les cartes bancaires (Visa, Mastercard, Amex) et virements SEPA pour les plans annuels. Paiements sécurisés via Stripe.'
                }
            },
            {
                '@type': 'Question',
                name: 'Quels formats de fichiers acceptez-vous ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'CSV et Excel (.xlsx, .xls). Nous fournissons des templates pour Sage, Cegid, QuickBooks et Excel générique. Le fichier doit contenir au minimum : Date, Montant, Type (income/expense).'
                }
            },
            {
                '@type': 'Question',
                name: 'L\'IA GPT-4 a-t-elle accès à mes données ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Oui, mais uniquement en contexte chiffré pour répondre à vos questions. Vos données ne sont jamais stockées chez OpenAI ni utilisées pour entraîner leurs modèles. Chaque requête est anonymisée et supprimée après traitement.'
                }
            },
            {
                '@type': 'Question',
                name: 'Puis-je importer des données de plusieurs exercices ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Oui, il n\'y a pas de limite de période. Vous pouvez importer des données sur 1 mois, 1 an ou 5 ans. FinSight s\'adapte automatiquement à la période détectée.'
                }
            }
        ]
    }

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Schema.org FAQPage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Hero Section */}
            <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
                <h1 className="text-5xl font-bold mb-6 text-primary">
                    Questions fréquentes
                </h1>
                <p className="text-xl text-secondary max-w-2xl mx-auto">
                    Tout ce que vous devez savoir sur FinSight
                </p>
            </section>

            {/* FAQ Content */}
            <section className="max-w-4xl mx-auto px-6 pb-20">
                <FAQAccordion />
            </section>

            {/* Contact CTA */}
            <section className="max-w-4xl mx-auto px-6 pb-32">
                <div className="surface rounded-2xl p-12 text-center">
                    <MessageCircle className="w-12 h-12 text-accent-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
                    <p className="text-secondary mb-8">
                        Notre équipe est là pour vous aider
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all hover:shadow-xl"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Planifier un appel
                        </a>
                        <a
                            href="mailto:otmane@zineinsight.com?subject=Question sur FinSight"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold transition-all hover:bg-surface-elevated"
                        >
                            <Mail className="w-5 h-5" />
                            Envoyer un email
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

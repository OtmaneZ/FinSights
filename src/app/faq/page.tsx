'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQAccordion from '@/components/FAQAccordion'
import { MessageCircle, Mail } from 'lucide-react'

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section */}
            <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-accent-primary via-white to-accent-primary bg-clip-text text-transparent">
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

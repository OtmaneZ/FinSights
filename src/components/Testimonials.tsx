'use client'

import { Quote, Star } from 'lucide-react'

interface Testimonial {
    quote: string
    author: string
    role: string
    company: string
    rating: number
}

const testimonials: Testimonial[] = [
    {
        quote: "J'ai gagné 3h/semaine sur mon reporting. L'IA répond mieux que mon expert-comptable sur les questions métier.",
        author: "Sophie Martin",
        role: "DAF",
        company: "PME Services (24 employés)",
        rating: 5
    },
    {
        quote: "Le parsing Sage fonctionne parfaitement. Fini les copier-coller Excel interminables.",
        author: "Thomas Dubois",
        role: "Fondateur",
        company: "Startup SaaS (Seed 1M€)",
        rating: 5
    },
    {
        quote: "Les alertes DSO m'ont fait récupérer 85k€ de créances. ROI immédiat.",
        author: "Claire Rousseau",
        role: "CFO",
        company: "Scale-up Tech (Series A)",
        rating: 5
    },
    {
        quote: "Enfin un outil qui parle le langage des financiers. Les KPIs sont conformes au PCG 2025.",
        author: "Marc Lefevre",
        role: "Contrôleur de gestion",
        company: "Groupe industriel",
        rating: 5
    },
    {
        quote: "La visualisation Sankey m'a aidé à identifier 120k€ de fuites de trésorerie cachées.",
        author: "Amélie Bernard",
        role: "DAF",
        company: "E-commerce (15M€ CA)",
        rating: 5
    },
    {
        quote: "API REST impeccable. Intégration Zapier en 10 minutes. J'automatise tout mon workflow.",
        author: "Lucas Moreau",
        role: "CTO",
        company: "Fintech (Series B)",
        rating: 5
    }
]

export default function Testimonials() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Ils nous font confiance</h2>
                <p className="text-secondary text-lg">
                    Rejoignez les DAF et CFO qui transforment leur analyse financière
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="surface rounded-xl p-6 surface-hover transition-all duration-300 hover:scale-105"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <Quote className="w-8 h-8 text-accent-primary flex-shrink-0" />
                            <div className="flex gap-0.5">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-accent-primary text-accent-primary" />
                                ))}
                            </div>
                        </div>

                        <p className="text-primary text-sm leading-relaxed mb-6 italic">
                            "{testimonial.quote}"
                        </p>

                        <div className="border-t border-border-subtle pt-4">
                            <p className="font-semibold text-sm">{testimonial.author}</p>
                            <p className="text-secondary text-xs">{testimonial.role}</p>
                            <p className="text-tertiary text-xs mt-1">{testimonial.company}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border-subtle">
                <div className="text-center">
                    <div className="text-4xl font-bold text-accent-primary mb-2">200+</div>
                    <div className="text-secondary text-sm">Utilisateurs actifs</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-accent-primary mb-2">3h</div>
                    <div className="text-secondary text-sm">Gagnées/semaine</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-accent-primary mb-2">15+</div>
                    <div className="text-secondary text-sm">KPIs calculés</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-accent-primary mb-2">99.9%</div>
                    <div className="text-secondary text-sm">Uptime SLA</div>
                </div>
            </div>
        </section>
    )
}

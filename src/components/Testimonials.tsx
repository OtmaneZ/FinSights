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
        quote: "Interface intuitive, les KPIs sont bien structurés. Le parsing automatique des exports comptables fonctionne parfaitement.",
        author: "Sophie M.",
        role: "DAF",
        company: "PME Services (25 salariés)",
        rating: 5
    },
    {
        quote: "Exactement ce que je cherchais : un dashboard clair qui me donne l'essentiel en un coup d'œil. Gain de temps immédiat.",
        author: "Thomas D.",
        role: "Directeur Financier",
        company: "Startup SaaS",
        rating: 5
    },
    {
        quote: "L'IA Copilot répond de façon pertinente aux questions financières. Très utile pour analyser les tendances rapidement.",
        author: "Claire R.",
        role: "CFO",
        company: "Scale-up Tech (Series A)",
        rating: 5
    },
    {
        quote: "Les formules financières sont conformes aux standards. Enfin un outil qui parle le langage des DAF.",
        author: "Marc L.",
        role: "Contrôleur de gestion",
        company: "Groupe industriel",
        rating: 5
    },
    {
        quote: "La détection d'anomalies m'a permis d'identifier plusieurs points d'attention sur mes créances. Très efficace.",
        author: "Amélie B.",
        role: "Responsable Finance",
        company: "E-commerce",
        rating: 5
    },
    {
        quote: "Design professionnel, données bien visualisées. L'export PDF est parfait pour mes présentations au COMEX.",
        author: "Lucas M.",
        role: "DAF",
        company: "Agence digitale",
        rating: 5
    }
]

export default function Testimonials() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Utilisé par des DAF et CFO</h2>
                <p className="text-secondary text-lg">
                    Une analyse financière moderne, précise et accessible
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
                    <div className="text-4xl font-bold text-accent-primary mb-2">10s</div>
                    <div className="text-secondary text-sm">Upload → Dashboard</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-accent-primary mb-2">15+</div>
                    <div className="text-secondary text-sm">KPIs financiers</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-accent-primary mb-2">GPT-4</div>
                    <div className="text-secondary text-sm">IA Copilot intégrée</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-accent-primary mb-2">100%</div>
                    <div className="text-secondary text-sm">Conformité PCG</div>
                </div>
            </div>
        </section>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Sparkles } from 'lucide-react'

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Vérifier si l'utilisateur a déjà fermé/soumis la popup
        const hasSeenPopup = localStorage.getItem('newsletter-popup-seen')

        if (!hasSeenPopup) {
            // Afficher après 10 secondes de navigation
            const timer = setTimeout(() => {
                setIsOpen(true)
            }, 10000)

            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem('newsletter-popup-seen', 'true')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    source: 'popup',
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de l\'inscription')
            }

            setIsSubmitted(true)
            localStorage.setItem('newsletter-popup-seen', 'true')

            // Fermer après 4 secondes
            setTimeout(() => {
                setIsOpen(false)
            }, 4000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
                onClick={handleClose}
            />

            {/* Popup */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="surface rounded-2xl max-w-lg w-full p-8 shadow-2xl pointer-events-auto animate-slideUp relative">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-tertiary hover:text-primary transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {!isSubmitted ? (
                        <>
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-xl bg-accent-primary-subtle flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-accent-primary" />
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold text-center mb-3">
                                📬 Le Pilote
                            </h3>
                            <p className="text-center text-secondary mb-2">
                                <strong className="text-primary">Newsletter Finance PME</strong>
                            </p>
                            <p className="text-center text-sm text-tertiary mb-6">
                                1 analyse mensuelle + 1 outil gratuit + conseils actionnables
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        required
                                        disabled={isLoading}
                                        className="w-full pl-12 pr-4 py-3 surface rounded-lg border border-border-default focus:border-accent-primary transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>

                                {error && (
                                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Inscription en cours...' : 'M\'inscrire gratuitement'}
                                </button>
                            </form>

                            {/* Footer */}
                            <p className="text-xs text-center text-tertiary mt-4">
                                1 email/mois maximum • Désabonnement en 1 clic • Pas de spam
                            </p>
                        </>
                    ) : (
                        /* Success state */
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                Merci ! 🎉
                            </h3>
                            <p className="text-secondary">
                                Vous recevrez le prochain numéro du <strong>Pilote</strong> dans votre boîte mail.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    )
}

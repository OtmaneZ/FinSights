'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Mail, AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Une erreur est survenue')
                setIsLoading(false)
                return
            }

            setSuccess(true)
        } catch (err) {
            setError('Une erreur est survenue. Réessayez.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-primary text-primary font-sans flex flex-col">
            <Header />

            {/* Hero Section avec glow effect */}
            <div className="flex-1 flex items-center justify-center px-6 py-20">
                <div className="relative w-full max-w-md">
                    {/* Radial gradient glow */}
                    <div className="absolute inset-x-0 -top-40 h-96 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-radial from-accent-primary/15 via-accent-primary/5 to-transparent blur-3xl"></div>
                    </div>

                    {/* Card */}
                    <div className="relative surface rounded-2xl p-8 shadow-xl">
                        {/* Back Link */}
                        <Link
                            href="/auth/signin"
                            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour à la connexion
                        </Link>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">Mot de passe oublié ?</h1>
                            <p className="text-secondary text-sm">
                                Entrez votre email pour recevoir un lien de réinitialisation
                            </p>
                        </div>

                        {success ? (
                            /* Success Message */
                            <div className="text-center">
                                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <p className="text-sm text-green-500 font-medium">Email envoyé !</p>
                                        <p className="text-sm text-green-500/80 mt-1">
                                            Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-tertiary mb-6">
                                    Vérifiez votre boîte de réception et vos spams.
                                </p>
                                <Link
                                    href="/auth/signin"
                                    className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"
                                >
                                    Retour à la connexion
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-500">{error}</p>
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Email Input */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                                            Adresse email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="vous@exemple.com"
                                                required
                                                className="w-full pl-11 pr-4 py-3 bg-surface-elevated border border-border-default rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Envoi en cours...
                                            </>
                                        ) : (
                                            'Envoyer le lien de réinitialisation'
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    {/* Help Text */}
                    <p className="text-center text-sm text-tertiary mt-6">
                        Vous n'avez pas de compte ?{' '}
                        <Link href="/auth/signup" className="text-accent-primary hover:underline">
                            Créer un compte gratuit
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function SignInPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Email ou mot de passe incorrect')
                setIsLoading(false)
                return
            }

            // Redirection vers le dashboard
            router.push('/dashboard')
        } catch (err) {
            setError('Une erreur est survenue. Réessayez.')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary font-sans flex flex-col">
            <Header />

            {/* Hero Section avec glow effect */}
            <div className="flex-1 flex items-center justify-center px-6 py-20">
                <div className="relative w-full max-w-md">
                    {/* Radial gradient glow */}
                    <div className="absolute inset-x-0 -top-40 h-96 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-radial from-accent-gold/15 via-accent-gold/5 to-transparent blur-3xl"></div>
                    </div>

                    {/* Card */}
                    <div className="relative surface rounded-2xl p-8 shadow-xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">Connexion</h1>
                            <p className="text-text-secondary text-sm">
                                Accédez à votre dashboard financier
                            </p>
                        </div>

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
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="vous@exemple.com"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-surface-elevated border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        className="w-full pl-11 pr-4 py-3 bg-surface-elevated border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <Link
                                    href="/auth/reset-password"
                                    className="text-sm text-accent-gold hover:text-accent-gold-hover transition-colors"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-accent-gold hover:bg-accent-gold-hover text-white rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Connexion en cours...
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border-default"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-bg-primary text-text-tertiary">
                                    Pas encore de compte ?
                                </span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <Link
                            href="/auth/signup"
                            className="block w-full py-3 border-2 border-border-default hover:border-accent-gold-border text-text-primary rounded-lg font-semibold transition-all hover:bg-surface-elevated text-center"
                        >
                            Créer un compte gratuit
                        </Link>
                    </div>

                    {/* Help Text */}
                    <p className="text-center text-sm text-text-tertiary mt-6">
                        En vous connectant, vous acceptez nos{' '}
                        <Link href="/legal/terms" className="text-accent-gold hover:underline">
                            conditions d'utilisation
                        </Link>
                        {' '}et notre{' '}
                        <Link href="/legal/privacy" className="text-accent-gold hover:underline">
                            politique de confidentialité
                        </Link>
                        .
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

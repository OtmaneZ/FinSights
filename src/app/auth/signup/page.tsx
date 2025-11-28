'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react'

export default function SignUpPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }

        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères')
            return
        }

        setIsLoading(true)

        try {
            // Créer le compte
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Une erreur est survenue')
                setIsLoading(false)
                return
            }

            // Connexion automatique après signup
            const signInResult = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (signInResult?.error) {
                setError('Compte créé, mais erreur de connexion. Connectez-vous manuellement.')
                setIsLoading(false)
                return
            }

            // Redirection vers le dashboard
            router.push('/dashboard?welcome=true')
        } catch (err) {
            setError('Une erreur est survenue. Réessayez.')
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
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
                            <p className="text-secondary text-sm">
                                Commencez gratuitement, sans carte bancaire
                            </p>
                        </div>

                        {/* Benefits Pills */}
                        <div className="flex flex-wrap gap-2 mb-6 justify-center">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary-subtle border border-accent-primary-border rounded-full text-xs text-accent-primary">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Dashboard complet
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary-subtle border border-accent-primary-border rounded-full text-xs text-accent-primary">
                                <CheckCircle className="w-3.5 h-3.5" />
                                10 questions IA/jour
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary-subtle border border-accent-primary-border rounded-full text-xs text-accent-primary">
                                <CheckCircle className="w-3.5 h-3.5" />
                                10 uploads/mois
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary-subtle border border-accent-primary-border rounded-full text-xs text-accent-primary">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Aucun engagement
                            </div>
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
                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Nom complet
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Jean Dupont"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-surface-elevated border border-border-default rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email professionnel
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="vous@entreprise.com"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-surface-elevated border border-border-default rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        className="w-full pl-11 pr-4 py-3 bg-surface-elevated border border-border-default rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
                                    />
                                </div>
                                <p className="text-xs text-tertiary mt-1.5">
                                    Minimum 8 caractères
                                </p>
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
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
                                        Création du compte...
                                    </>
                                ) : (
                                    'Créer mon compte gratuit'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border-default"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-primary text-tertiary">
                                    Déjà un compte ?
                                </span>
                            </div>
                        </div>

                        {/* Sign In Link */}
                        <Link
                            href="/auth/signin"
                            className="block w-full py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold transition-all hover:bg-surface-elevated text-center"
                        >
                            Se connecter
                        </Link>
                    </div>

                    {/* Help Text */}
                    <p className="text-center text-sm text-tertiary mt-6">
                        En créant un compte, vous acceptez nos{' '}
                        <Link href="/legal/terms" className="text-accent-primary hover:underline">
                            conditions d'utilisation
                        </Link>
                        {' '}et notre{' '}
                        <Link href="/legal/privacy" className="text-accent-primary hover:underline">
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

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, User, LogOut, Crown, Settings, Key, Book, Webhook, ChevronDown, FolderOpen, Sparkles, Shield, Clock } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { CompanySwitcher } from './CompanySwitcher'
import ReadingProgressBar from './ReadingProgressBar'

export default function Header() {
    const { data: session, status } = useSession()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isResourcesOpen, setIsResourcesOpen] = useState(false)
    const [isTestAgentsOpen, setIsTestAgentsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const resourcesRef = useRef<HTMLDivElement>(null)
    const testAgentsRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
            if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
                setIsResourcesOpen(false)
            }
            if (testAgentsRef.current && !testAgentsRef.current.contains(event.target as Node)) {
                setIsTestAgentsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' })
    }

    const getPlanBadgeColor = (plan: string) => {
        switch (plan) {
            case 'PRO': return 'bg-blue-500/10 text-blue-500 border-blue-500/30' // Business (mapping DB)
            case 'SCALE': return 'bg-purple-500/10 text-purple-500 border-purple-500/30' // Growth (mapping DB)
            case 'ENTERPRISE': return 'bg-amber-500/10 text-amber-500 border-amber-500/30'
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30' // FREE = Starter
        }
    }

    const getPlanDisplayName = (plan: string) => {
        switch (plan) {
            case 'FREE': return 'Starter'
            case 'PRO': return 'Business'
            case 'SCALE': return 'Growth'
            case 'ENTERPRISE': return 'Enterprise'
            default: return plan
        }
    }

    return (
        <header className="border-b border-border-default backdrop-blur-md bg-primary/90 sticky top-0 z-50 shadow-sm">
            {/* Reading Progress Bar */}
            <ReadingProgressBar />

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <Image
                        src="/images/zineinsights_logo.jpeg"
                        alt="FinSight"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg shadow-sm"
                    />
                    <span className="text-2xl font-bold">FinSight</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    {/* Consulting */}
                    <Link href="/consulting" className="text-secondary hover:text-primary transition-colors text-base font-semibold">
                        Consulting Finance
                    </Link>

                    {/* Agents IA */}
                    <Link href="/agents" className="text-secondary hover:text-primary transition-colors text-base font-semibold">
                       Nos Agents IA
                    </Link>

                    {/* Testez nos Agents Dropdown */}
                    <div className="relative" ref={testAgentsRef}>
                        <button
                            onClick={() => setIsTestAgentsOpen(!isTestAgentsOpen)}
                            className="flex items-center gap-1 text-secondary hover:text-primary transition-colors text-base font-semibold"
                        >
                            Testez nos Agents
                            <ChevronDown className={`w-4 h-4 transition-transform ${isTestAgentsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Test Agents Dropdown Menu */}
                        {isTestAgentsOpen && (
                            <div className="absolute left-0 mt-2 w-64 bg-surface-elevated border border-border-default rounded-lg shadow-xl overflow-hidden z-50 animate-slide-up">
                                {/* DASHIS - Disponible */}
                                <Link
                                    href="/demo-dashis"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-all duration-200 border-b border-border-subtle"
                                    onClick={() => setIsTestAgentsOpen(false)}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-accent-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-primary">DASHIS</span>
                                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent-primary/10 text-accent-primary rounded">NOUVEAU</span>
                                        </div>
                                        <span className="text-xs text-tertiary">Dashboard IA 360°</span>
                                    </div>
                                </Link>

                                {/* TRESORIS - Disponible */}
                                <Link
                                    href="/demo-tresoris"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-all duration-200"
                                    onClick={() => setIsTestAgentsOpen(false)}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-primary">TRESORIS</span>
                                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 rounded">NOUVEAU</span>
                                        </div>
                                        <span className="text-xs text-tertiary">Expert Trésorerie</span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Ressources Dropdown */}
                    <div className="relative" ref={resourcesRef}>
                        <button
                            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                            className="flex items-center gap-1 text-secondary hover:text-primary transition-colors text-base font-semibold"
                        >
                            Ressources
                            <ChevronDown className={`w-4 h-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Resources Dropdown Menu */}
                        {isResourcesOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-surface-elevated border border-border-default rounded-lg shadow-xl overflow-hidden z-50 animate-slide-up">
                                <Link
                                    href="/fondamentaux"
                                    className="block px-4 py-2.5 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-all duration-200"
                                    onClick={() => setIsResourcesOpen(false)}
                                >
                                    Fondamentaux
                                </Link>
                                <Link
                                    href="/ressources/templates"
                                    className="block px-4 py-2.5 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-all duration-200"
                                    onClick={() => setIsResourcesOpen(false)}
                                >
                                    Templates
                                </Link>
                                <Link
                                    href="/calculateurs"
                                    className="block px-4 py-2.5 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-all duration-200"
                                    onClick={() => setIsResourcesOpen(false)}
                                >
                                    Calculateurs
                                </Link>
                                <Link
                                    href="/ressources/guides"
                                    className="block px-4 py-2.5 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-all duration-200"
                                    onClick={() => setIsResourcesOpen(false)}
                                >
                                    Guides
                                </Link>
                                <Link
                                    href="/blog"
                                    className="block px-4 py-2.5 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-all duration-200"
                                    onClick={() => setIsResourcesOpen(false)}
                                >
                                    Blog
                                </Link>
                                <Link
                                    href="/methodologie"
                                    className="block px-4 py-2.5 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-all duration-200"
                                    onClick={() => setIsResourcesOpen(false)}
                                >
                                    Méthodologie Score FinSight™
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Contact */}
                    <Link href="/contact" className="text-secondary hover:text-primary transition-colors text-base font-semibold">
                        Contact
                    </Link>

                    {/* Auth Section - Only show user dropdown if logged in */}
                    {status === 'loading' ? (
                        <div className="w-24 h-10 bg-surface-elevated animate-pulse rounded-lg" />
                    ) : session ? (
                        // User logged in - Show CompanySwitcher + User dropdown
                        <div className="flex items-center gap-3">
                            {/* Company Switcher */}
                            <CompanySwitcher />

                            {/* User Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 px-4 py-2 bg-surface-elevated hover:bg-surface-hover border border-border-default rounded-lg transition-all duration-200 hover:shadow-md"
                                >
                                    {/* Plan Badge */}
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getPlanBadgeColor(session.user?.plan || 'FREE')}`}>
                                        {getPlanDisplayName(session.user?.plan || 'FREE')}
                                    </span>

                                    {/* User Avatar */}
                                    <div className="w-8 h-8 bg-accent-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                        {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-surface-elevated border border-border-default rounded-lg shadow-xl overflow-hidden z-50 animate-slide-up">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-border-default">
                                            <p className="text-sm font-semibold text-primary truncate">
                                                {session.user?.name || 'Utilisateur'}
                                            </p>
                                            <p className="text-xs text-tertiary truncate">
                                                {session.user?.email}
                                            </p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            {session.user?.plan === 'FREE' && (
                                                <Link
                                                    href="/pricing"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-accent-primary hover:bg-accent-primary/5 transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Crown className="w-4 h-4" />
                                                    Passer à Business
                                                </Link>
                                            )}

                                            <Link
                                                href="/dashboard/api-keys"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Key className="w-4 h-4" />
                                                Clés API
                                            </Link>

                                            <Link
                                                href="/dashboard/api-docs"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Book className="w-4 h-4" />
                                                Documentation API
                                            </Link>

                                            <Link
                                                href="/dashboard/webhooks"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Webhook className="w-4 h-4" />
                                                Webhooks
                                            </Link>

                                            <Link
                                                href="/dashboard/settings"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                Paramètres
                                            </Link>
                                        </div>

                                        {/* Sign Out */}
                                        <div className="border-t border-border-default">
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </nav>
            </div>
        </header>
    )
}

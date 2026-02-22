'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, User, LogOut, Crown, Settings, Key, Book, Webhook, ChevronDown, Calculator, FileText, BarChart3, Brain, LayoutDashboard, BookOpen, Layers } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { CompanySwitcher } from './CompanySwitcher'
import ReadingProgressBar from './ReadingProgressBar'

const resourcesItems = {
    outils: [
        { href: '/calculateurs', label: 'Calculateurs financiers', icon: Calculator, desc: 'DSO, BFR, marge, ROI' },
        { href: '/ressources/templates', label: 'Templates financiers', icon: FileText, desc: 'Tableaux de bord Excel/Notion' },
        { href: '/diagnostic/guide', label: 'Score FinSight™', icon: BarChart3, desc: 'Diagnostic 0-100 en 7 min' },
    ],
    contenu: [
        { href: '/blog', label: 'Blog', icon: BookOpen, desc: 'Finance & pilotage PME' },
        { href: '/pilotage-financier-pme', label: 'Guide pilotage PME', icon: Layers, desc: 'Méthode complète DAF' },
        { href: '/fondamentaux', label: 'Fondamentaux', icon: BookOpen, desc: 'Cash, marges, résilience' },
    ],
    technologie: [
        { href: '/agents', label: 'Agents IA Finance', icon: Brain, desc: 'TRESORIS, MARGIS, SCENARIS' },
        { href: '/business-intelligence', label: 'Business Intelligence', icon: LayoutDashboard, desc: 'Dashboards & analytics' },
    ],
}

export default function Header() {
    const { data: session, status } = useSession()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isResourcesOpen, setIsResourcesOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const resourcesRef = useRef<HTMLDivElement>(null)
    const resourcesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const openResources = () => {
        if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current)
        setIsResourcesOpen(true)
    }

    const closeResources = () => {
        resourcesTimeoutRef.current = setTimeout(() => setIsResourcesOpen(false), 120)
    }

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' })
    }

    const getPlanBadgeColor = (plan: string) => {
        switch (plan) {
            case 'PRO': return 'bg-blue-500/10 text-blue-500 border-blue-500/30'
            case 'SCALE': return 'bg-purple-500/10 text-purple-500 border-purple-500/30'
            case 'ENTERPRISE': return 'bg-amber-500/10 text-amber-500 border-amber-500/30'
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30'
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
            <ReadingProgressBar />

            <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                    <Image
                        src="/images/zineinsights_logo.jpeg"
                        alt="FinSight"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-lg shadow-sm"
                    />
                    <span className="text-xl font-bold tracking-tight">FinSight</span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    <Link href="/consulting" className="px-3 py-2 text-sm text-secondary hover:text-primary font-medium rounded-md hover:bg-gray-100 transition-all">
                        Accompagnement
                    </Link>
                    <Link href="/methodologie" className="px-3 py-2 text-sm text-secondary hover:text-primary font-medium rounded-md hover:bg-gray-100 transition-all">
                        Méthodologie
                    </Link>
                    <Link href="/tarifs" className="px-3 py-2 text-sm text-secondary hover:text-primary font-medium rounded-md hover:bg-gray-100 transition-all">
                        Tarifs
                    </Link>

                    {/* Ressources — hover to open */}
                    <div
                        className="relative"
                        ref={resourcesRef}
                        onMouseEnter={openResources}
                        onMouseLeave={closeResources}
                    >
                        <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${isResourcesOpen ? 'text-accent-primary bg-accent-primary/5' : 'text-secondary hover:text-primary hover:bg-gray-100'}`}>
                            Ressources
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isResourcesOpen && (
                            <div
                                className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                                onMouseEnter={openResources}
                                onMouseLeave={closeResources}
                            >
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden w-[560px]">
                                    <div className="grid grid-cols-2 gap-0">
                                        {/* Colonne gauche — Outils */}
                                        <div className="p-5 border-r border-gray-100">
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Outils gratuits</p>
                                            <div className="space-y-1">
                                                {resourcesItems.outils.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsResourcesOpen(false)}
                                                        className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-all"
                                                    >
                                                        <div className="w-8 h-8 bg-accent-primary/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent-primary/15 transition-colors">
                                                            <item.icon className="w-4 h-4 text-accent-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 group-hover:text-accent-primary transition-colors leading-tight">{item.label}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Technologie</p>
                                                <div className="space-y-1">
                                                    {resourcesItems.technologie.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setIsResourcesOpen(false)}
                                                            className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-all"
                                                        >
                                                            <div className="w-8 h-8 bg-accent-primary/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent-primary/15 transition-colors">
                                                                <item.icon className="w-4 h-4 text-accent-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 group-hover:text-accent-primary transition-colors leading-tight">{item.label}</p>
                                                                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Colonne droite — Contenu */}
                                        <div className="p-5">
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Contenu & guides</p>
                                            <div className="space-y-1">
                                                {resourcesItems.contenu.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsResourcesOpen(false)}
                                                        className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-all"
                                                    >
                                                        <div className="w-8 h-8 bg-accent-primary/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent-primary/15 transition-colors">
                                                            <item.icon className="w-4 h-4 text-accent-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 group-hover:text-accent-primary transition-colors leading-tight">{item.label}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Encart diagnostic */}
                                            <div className="mt-4 p-3.5 bg-slate-900 rounded-xl">
                                                <p className="text-xs font-semibold text-white mb-0.5">Score FinSight™</p>
                                                <p className="text-xs text-gray-400 mb-2.5">Évaluez la santé financière de votre PME en 7 minutes.</p>
                                                <Link
                                                    href="/diagnostic/guide"
                                                    onClick={() => setIsResourcesOpen(false)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-primary hover:text-blue-400 transition-colors"
                                                >
                                                    Lancer le diagnostic →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/contact" className="px-3 py-2 text-sm text-secondary hover:text-primary font-medium rounded-md hover:bg-gray-100 transition-all">
                        Contact
                    </Link>
                </nav>

                {/* Right — CTA + Auth */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/diagnostic/guide"
                        className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                        Diagnostic gratuit
                    </Link>

                    {status === 'loading' ? (
                        <div className="w-20 h-9 bg-surface-elevated animate-pulse rounded-lg" />
                    ) : session ? (
                        <div className="flex items-center gap-2">
                            <CompanySwitcher />
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-surface-elevated hover:bg-surface-hover border border-border-default rounded-lg transition-all"
                                >
                                    <span className={`px-1.5 py-0.5 text-xs font-semibold rounded border ${getPlanBadgeColor(session.user?.plan || 'FREE')}`}>
                                        {getPlanDisplayName(session.user?.plan || 'FREE')}
                                    </span>
                                    <div className="w-7 h-7 bg-accent-primary text-white rounded-full flex items-center justify-center font-semibold text-xs">
                                        {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-surface-elevated border border-border-default rounded-xl shadow-xl overflow-hidden z-50 animate-slide-up">
                                        <div className="px-4 py-3 border-b border-border-default">
                                            <p className="text-sm font-semibold text-primary truncate">{session.user?.name || 'Utilisateur'}</p>
                                            <p className="text-xs text-tertiary truncate">{session.user?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            {session.user?.plan === 'FREE' && (
                                                <Link href="/tarifs" className="flex items-center gap-3 px-4 py-2 text-sm text-accent-primary hover:bg-accent-primary/5 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                    <Crown className="w-4 h-4" />
                                                    Découvrir les offres DAF
                                                </Link>
                                            )}
                                            <Link href="/dashboard/api-keys" className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <Key className="w-4 h-4" />Clés API
                                            </Link>
                                            <Link href="/dashboard/api-docs" className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <Book className="w-4 h-4" />Documentation API
                                            </Link>
                                            <Link href="/dashboard/webhooks" className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <Webhook className="w-4 h-4" />Webhooks
                                            </Link>
                                            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:bg-surface-hover hover:text-primary transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <Settings className="w-4 h-4" />Paramètres
                                            </Link>
                                        </div>
                                        <div className="border-t border-border-default">
                                            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-colors">
                                                <LogOut className="w-4 h-4" />Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    )
}

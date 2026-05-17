'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, User, LogOut, Crown, Settings, Key, Book, Webhook, ChevronDown, Calculator, FileText, BarChart3, Brain, LayoutDashboard, BookOpen, Layers, Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { CompanySwitcher } from './CompanySwitcher'
import ReadingProgressBar from './ReadingProgressBar'

const resourcesItems = {
    outils: [
        { href: '/calculateurs', label: 'Calculateurs financiers', icon: Calculator, desc: 'DSO, BFR, marge, ROI' },
        { href: '/ressources/templates', label: 'Templates financiers', icon: FileText, desc: 'Tableaux de bord Excel/Notion' },
        { href: '/simulateurs', label: 'Simulateurs financiers', icon: BarChart3, desc: 'Coût salarié, charges, RGDU' },
    ],
    contenu: [
        { href: '/blog', label: 'Blog', icon: BookOpen, desc: 'Finance & pilotage PME' },
        { href: '/pilotage-financier-pme', label: 'Guide pilotage PME', icon: Layers, desc: 'Structuration & pilotage' },
        { href: '/fondamentaux', label: 'Fondamentaux', icon: BookOpen, desc: 'Cash, marges, résilience' },
        { href: '/finsight-vs-excel-agicap', label: 'FinSight vs Excel vs Agicap', icon: BarChart3, desc: 'Comparatif honnête pour PME' },
    ],
    technologie: [
        { href: '/agents', label: 'Agents IA Finance', icon: Brain, desc: 'TRESORIS, DASHIS, MARGIS, SCENARIS' },
        { href: '/mon-diagnostic', label: 'Score FinSight™', icon: BarChart3, desc: 'Diagnostic 0-100 en 7 min' },
    ],
    bi: [
        { href: '/business-intelligence', label: 'Reporting multi-entités', icon: LayoutDashboard, desc: 'Consolidation groupe & pilotage multi-sites' },
        { href: '/business-intelligence/dax-financier', label: 'DAX Financier', icon: BarChart3, desc: 'Formules Power BI pour la finance' },
        { href: '/business-intelligence/connecteurs-comptables', label: 'Connecteurs comptables', icon: Webhook, desc: 'Sage, Cegid, EBP, FEC' },
        { href: '/fondamentaux/diagnostic-pme', label: 'Diagnostic financier PME', icon: FileText, desc: '7 étapes pour lire vos chiffres' },
    ],
}

/** Ordre d'affichage mobile pour la section Technologie (dropdown Ressources). */
const mobileTechnologieOrder = ['/mon-diagnostic', '/agents'] as const

const mobileTechnologieItems = mobileTechnologieOrder.map((href) =>
    resourcesItems.technologie.find((item) => item.href === href)!,
)

export default function Header() {
    const { data: session, status } = useSession()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isResourcesOpen, setIsResourcesOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false)
    const [mobilePanelEntered, setMobilePanelEntered] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const resourcesRef = useRef<HTMLDivElement>(null)
    const resourcesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (!isMobileMenuOpen) return
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prevOverflow
        }
    }, [isMobileMenuOpen])

    useEffect(() => {
        if (!isMobileMenuOpen) return
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') setIsMobileMenuOpen(false)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isMobileMenuOpen])

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)')
        function onViewportChange() {
            if (mq.matches) setIsMobileMenuOpen(false)
        }
        mq.addEventListener('change', onViewportChange)
        return () => mq.removeEventListener('change', onViewportChange)
    }, [])

    useEffect(() => {
        if (!isMobileMenuOpen) setIsMobileResourcesOpen(false)
    }, [isMobileMenuOpen])

    useEffect(() => {
        if (!isMobileMenuOpen) {
            setMobilePanelEntered(false)
            return
        }
        const id = requestAnimationFrame(() => setMobilePanelEntered(true))
        return () => cancelAnimationFrame(id)
    }, [isMobileMenuOpen])

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

            <div
                className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5 ${isMobileMenuOpen ? 'relative z-[80]' : ''}`}
            >
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
                    <Link href="/tresorerie-pme" className="px-3 py-2 text-sm text-secondary hover:text-primary font-medium rounded-md hover:bg-gray-100 transition-all">
                        Trésorerie PME
                    </Link>
                    <Link href="/methodologie" className="px-3 py-2 text-sm text-secondary hover:text-primary font-medium rounded-md hover:bg-gray-100 transition-all">
                        Score FinSight™
                    </Link>
                    <Link href="/tarifs" className="px-3 py-2 text-sm text-secondary hover:text-primary font-medium rounded-md hover:bg-gray-100 transition-all">
                        Tarifs
                    </Link>

                    {/* Ressources - hover to open */}
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
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden w-[780px]">
                                    <div className="grid grid-cols-3 gap-0">
                                        {/* Colonne 1 - Outils + Technologie */}
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

                                        {/* Colonne 2 - Data & BI */}
                                        <div className="p-5 border-r border-gray-100">
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Data & BI</p>
                                            <div className="space-y-1">
                                                {resourcesItems.bi.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsResourcesOpen(false)}
                                                        className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-all"
                                                    >
                                                        <div className="w-8 h-8 bg-blue-500/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/15 transition-colors">
                                                            <item.icon className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">{item.label}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Colonne 3 - Contenu */}
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
                                                    href="/mon-diagnostic"
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

                {/* Right - burger (mobile) + CTA + Auth */}
                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        type="button"
                        className="md:hidden inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-secondary transition-all hover:bg-gray-100 hover:text-primary"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-nav-drawer"
                        aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        onClick={() => setIsMobileMenuOpen((open) => !open)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
                    </button>

                    <Link
                        href="/mon-diagnostic"
                        className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                        Score FinSight™
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
                                                    Découvrir les offres
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

            {/* Drawer navigation mobile */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden" id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Menu de navigation">
                    <div
                        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ease-out ${mobilePanelEntered ? 'opacity-100' : 'opacity-0'}`}
                        onClick={closeMobileMenu}
                        aria-hidden
                    />
                    <div
                        className={`absolute inset-y-0 right-0 z-10 flex h-[100dvh] w-full flex-col bg-white shadow-2xl transition-transform duration-200 ease-out ${mobilePanelEntered ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <div className="flex min-h-0 flex-1 flex-col">
                            <nav className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-4" aria-label="Navigation principale">
                                <Link
                                    href="/consulting"
                                    onClick={closeMobileMenu}
                                    className="block rounded-md px-3 py-3 text-sm font-medium text-secondary transition-all hover:bg-gray-100 hover:text-primary"
                                >
                                    Accompagnement
                                </Link>
                                <Link
                                    href="/tresorerie-pme"
                                    onClick={closeMobileMenu}
                                    className="block rounded-md px-3 py-3 text-sm font-medium text-secondary transition-all hover:bg-gray-100 hover:text-primary"
                                >
                                    Trésorerie PME
                                </Link>
                                <Link
                                    href="/methodologie"
                                    onClick={closeMobileMenu}
                                    className="block rounded-md px-3 py-3 text-sm font-medium text-secondary transition-all hover:bg-gray-100 hover:text-primary"
                                >
                                    Score FinSight™
                                </Link>
                                <Link
                                    href="/tarifs"
                                    onClick={closeMobileMenu}
                                    className="block rounded-md px-3 py-3 text-sm font-medium text-secondary transition-all hover:bg-gray-100 hover:text-primary"
                                >
                                    Tarifs
                                </Link>

                                <div className="border-b border-gray-100 py-1">
                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium text-secondary transition-all hover:bg-gray-100 hover:text-primary"
                                        aria-expanded={isMobileResourcesOpen}
                                        onClick={() => setIsMobileResourcesOpen((v) => !v)}
                                    >
                                        Ressources
                                        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isMobileResourcesOpen ? 'rotate-180' : ''}`} aria-hidden />
                                    </button>
                                    {isMobileResourcesOpen && (
                                        <div className="space-y-4 border-l-2 border-accent-primary/15 pb-3 pl-4 pt-1 ml-3">
                                            <div>
                                                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Outils gratuits</p>
                                                <div className="space-y-1">
                                                    {resourcesItems.outils.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={closeMobileMenu}
                                                            className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-gray-50"
                                                        >
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent-primary/8">
                                                                <item.icon className="h-4 w-4 text-accent-primary" aria-hidden />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium leading-tight text-gray-900">{item.label}</p>
                                                                <p className="mt-0.5 text-xs text-gray-400">{item.desc}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Technologie</p>
                                                <div className="space-y-1">
                                                    {mobileTechnologieItems.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={closeMobileMenu}
                                                            className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-gray-50"
                                                        >
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent-primary/8">
                                                                <item.icon className="h-4 w-4 text-accent-primary" aria-hidden />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium leading-tight text-gray-900">{item.label}</p>
                                                                <p className="mt-0.5 text-xs text-gray-400">{item.desc}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Data &amp; BI</p>
                                                <div className="space-y-1">
                                                    {resourcesItems.bi.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={closeMobileMenu}
                                                            className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-blue-50"
                                                        >
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/8">
                                                                <item.icon className="h-4 w-4 text-blue-600" aria-hidden />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium leading-tight text-gray-900">{item.label}</p>
                                                                <p className="mt-0.5 text-xs text-gray-400">{item.desc}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Contenu &amp; guides</p>
                                                <div className="space-y-1">
                                                    {resourcesItems.contenu.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={closeMobileMenu}
                                                            className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-gray-50"
                                                        >
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent-primary/8">
                                                                <item.icon className="h-4 w-4 text-accent-primary" aria-hidden />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium leading-tight text-gray-900">{item.label}</p>
                                                                <p className="mt-0.5 text-xs text-gray-400">{item.desc}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/contact"
                                    onClick={closeMobileMenu}
                                    className="block rounded-md px-3 py-3 text-sm font-medium text-secondary transition-all hover:bg-gray-100 hover:text-primary"
                                >
                                    Contact
                                </Link>
                            </nav>

                            <div className="shrink-0 border-t border-border-default bg-primary/90 px-4 py-4 backdrop-blur-md">
                                <Link
                                    href="/mon-diagnostic"
                                    onClick={closeMobileMenu}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-primary-hover hover:shadow-md"
                                >
                                    Score FinSight™
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

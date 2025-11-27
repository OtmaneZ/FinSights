'use client'

import Link from 'next/link'
import { Linkedin } from 'lucide-react'

export default function Header() {
    return (
        <header className="border-b border-border-subtle backdrop-blur-sm bg-primary/80 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img
                        src="/images/zineinsights_logo.jpeg"
                        alt="FinSight"
                        className="w-10 h-10 rounded-lg"
                    />
                    <span className="text-xl font-semibold">FinSight</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/dashboard" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
                        Démo Live
                    </Link>
                    <Link href="/pricing" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
                        Tarifs
                    </Link>
                    <Link href="/faq" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
                        FAQ
                    </Link>
                    <Link href="/services" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
                        Nos Offres
                    </Link>
                    <a
                        href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:text-primary transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                    </a>
                    <a
                        href="https://calendly.com/zineinsight"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Discutons
                    </a>
                </nav>
            </div>
        </header>
    )
}

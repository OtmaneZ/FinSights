'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Linkedin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-border-default bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* About Section */}
                <div className="mb-12 pb-12 border-b border-border-default">
                    <div className="flex items-center gap-3 mb-4">
                        <Image
                            src="/images/zineinsights_logo.jpeg"
                            alt="FinSight"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg shadow-sm"
                        />
                        <div className="text-2xl font-bold">FinSight</div>
                    </div>
                    <p className="text-base text-gray-600 max-w-2xl leading-relaxed font-medium">
                        FinSight aide les dirigeants de PME à structurer leur pilotage financier et à décider sur des bases fiables, en s’appuyant sur des pratiques éprouvées de direction financière et de contrôle de gestion.
                    </p>
                </div>

                {/* Section 1: Navigation principale */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                    {/* Empty space for balance */}
                    <div></div>

                    {/* Navigation principale */}
                    <nav className="flex flex-wrap items-center gap-8">
                        <Link href="/consulting" className="text-secondary hover:text-primary transition-colors text-base font-semibold">
                            Accompagnement
                        </Link>
                        <Link href="/blog" className="text-secondary hover:text-primary transition-colors text-base font-semibold">
                            Blog
                        </Link>
                        <Link href="/calculateurs/dso" className="text-secondary hover:text-primary transition-colors text-base font-semibold">
                            Calculateurs
                        </Link>
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:text-primary transition-colors text-base font-semibold"
                        >
                            Prendre rendez-vous
                        </a>
                    </nav>
                </div>

                {/* Section 2: Legal + Social + Copyright */}
                <div className="pt-6 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Liens légaux */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-tertiary">
                        <Link href="/politique-confidentialite" className="hover:text-secondary transition-colors">
                            Politique de confidentialité
                        </Link>
                        <span className="text-border-default">•</span>
                        <Link href="/cookies" className="hover:text-secondary transition-colors">
                            Cookies
                        </Link>
                        <span className="text-border-default">•</span>
                        <Link href="/mentions-legales" className="hover:text-secondary transition-colors">
                            Mentions légales
                        </Link>
                    </div>

                    {/* Social + Copyright */}
                    <div className="flex items-center gap-6">
                        <a
                            href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-secondary hover:text-accent-primary transition-colors"
                        >
                            <Linkedin className="w-4 h-4" />
                            <span className="text-xs">LinkedIn</span>
                        </a>
                        <span className="text-xs text-tertiary">
                            © 2026 <a href="https://www.zineinsight.com" className="hover:text-secondary transition-colors">ZineInsight</a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

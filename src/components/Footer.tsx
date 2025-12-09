'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Linkedin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-border-subtle py-12">
            <div className="max-w-6xl mx-auto px-6">
                {/* About Section */}
                <div className="mb-8 pb-8 border-b border-border-subtle">
                    <div className="flex items-center gap-3 mb-4">
                        <Image
                            src="/images/zineinsights_logo.jpeg"
                            alt="FinSight"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-lg"
                        />
                        <div className="text-lg font-semibold">FinSight</div>
                    </div>
                    <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
                        FinSight est un moteur d'intelligence financière pour dirigeants de PME.
                        Conçu par Otmane Boulahia, analyste financier & data engineer,
                        inspiré des meilleures pratiques CFO, FP&A et pilotage BFR.
                    </p>
                </div>

                {/* Section 1: Navigation principale */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    {/* Empty space for balance */}
                    <div></div>

                    {/* Navigation principale */}
                    <nav className="flex flex-wrap items-center gap-6">
                        <Link href="/dashboard" className="text-secondary hover:text-primary transition-colors text-sm">
                            Essayer gratuitement
                        </Link>
                        <Link href="/pricing" className="text-secondary hover:text-primary transition-colors text-sm">
                            Tarifs
                        </Link>
                        <Link href="/blog" className="text-secondary hover:text-primary transition-colors text-sm">
                            Blog
                        </Link>
                        <Link href="/calculateurs/dso" className="text-secondary hover:text-primary transition-colors text-sm">
                            Calculateurs
                        </Link>
                        <Link href="/technique" className="text-secondary hover:text-primary transition-colors text-sm">
                            Stack Technique
                        </Link>
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:text-primary transition-colors text-sm"
                        >
                            Contact
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
                            © 2025 <a href="https://www.zineinsight.com" className="hover:text-secondary transition-colors">ZineInsight</a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

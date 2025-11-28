'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Linkedin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-border-subtle py-12">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/images/zineinsights_logo.jpeg"
                            alt="FinSight"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-lg"
                        />
                        <div>
                            <div className="text-lg font-semibold">FinSight</div>
                            <div className="text-xs text-tertiary">by Otmane Boulahia</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="text-secondary hover:text-primary transition-colors text-sm">
                            Démo Live
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
                    </div>
                </div>

                {/* Legal Links */}
                <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-tertiary">
                    <Link href="/politique-confidentialite" className="hover:text-secondary transition-colors">
                        Politique de confidentialité
                    </Link>
                    <Link href="/cookies" className="hover:text-secondary transition-colors">
                        Cookies
                    </Link>
                    <Link href="/mentions-legales" className="hover:text-secondary transition-colors">
                        Mentions légales
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-border-subtle text-center text-sm text-tertiary">
                    <p>
                        © 2025 Otmane Boulahia •
                        <a href="https://www.zineinsight.com" className="hover:text-secondary transition-colors ml-1">ZineInsight</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

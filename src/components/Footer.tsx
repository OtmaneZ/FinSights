import Link from 'next/link'
import Image from 'next/image'
import { Linkedin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-gray-400">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

                    {/* Col 1 — Brand */}
                    <div className="md:col-span-5">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6">
                            <Image
                                src="/images/zineinsights_logo.jpeg"
                                alt="FinSight"
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-lg"
                            />
                            <span className="text-xl font-semibold text-white">FinSight</span>
                        </Link>
                        <p className="text-[15px] leading-relaxed max-w-md mb-8">
                            Direction financière externalisée pour PME de 2 à 20&nbsp;M€.
                            Nous structurons le pilotage financier des entreprises en
                            croissance — trésorerie, marges, reporting — pour que chaque
                            décision repose sur des données fiables.
                        </p>
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Réserver un échange
                        </a>
                    </div>

                    {/* Col 2 — Services */}
                    <div className="md:col-span-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
                            Services
                        </p>
                        <nav className="space-y-3">
                            <Link href="/consulting" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Accompagnement DAF
                            </Link>
                            <Link href="/mon-diagnostic" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Diagnostic financier
                            </Link>
                            <Link href="/methodologie" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Méthodologie
                            </Link>
                            <Link href="/agents" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Agents IA Finance
                            </Link>
                            <Link href="/contact" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    {/* Col 3 — Ressources */}
                    <div className="md:col-span-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
                            Ressources
                        </p>
                        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                            <Link href="/pilotage-financier-pme" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Guide pilotage financier
                            </Link>
                            <Link href="/calculateurs" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Calculateurs financiers
                            </Link>
                            <Link href="/fondamentaux" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Fondamentaux finance
                            </Link>
                            <Link href="/calculateurs/dso" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Calculateur DSO
                            </Link>
                            <Link href="/daf-externalise-pme" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                DAF externalisé PME
                            </Link>
                            <Link href="/calculateurs/bfr" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Calculateur BFR
                            </Link>
                            <Link href="/ressources/guides" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Guides pratiques
                            </Link>
                            <Link href="/ressources/templates" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Templates financiers
                            </Link>
                            <Link href="/blog" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Blog
                            </Link>
                            <Link href="/faq" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                FAQ
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Legal */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-gray-500">
                        <Link href="/politique-confidentialite" className="hover:text-gray-300 transition-colors">
                            Politique de confidentialité
                        </Link>
                        <Link href="/cookies" className="hover:text-gray-300 transition-colors">
                            Cookies
                        </Link>
                        <Link href="/mentions-legales" className="hover:text-gray-300 transition-colors">
                            Mentions légales
                        </Link>
                    </div>

                    {/* Social + Copyright */}
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                        <a
                            href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-white transition-colors"
                        >
                            <Linkedin className="w-3.5 h-3.5" />
                            LinkedIn
                        </a>
                        <span>
                            © 2026{' '}
                            <a
                                href="https://www.zineinsight.com"
                                className="hover:text-gray-300 transition-colors"
                            >
                                ZineInsight
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

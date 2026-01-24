'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
    Sparkles,
    Zap,
    DollarSign,
    BarChart3,
    AlertTriangle,
    Shield,
    GraduationCap,
    Briefcase,
    Award,
    Linkedin,
    Calendar,
    ArrowRight,
    Users,
    TrendingUp,
    Target
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Testimonials from '@/components/Testimonials'

import AnimatedScoreDisplay from '@/components/landing/AnimatedScoreDisplay'
import NewsletterPopup from '@/components/NewsletterPopup'

export default function Home() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />
            <NewsletterPopup />

            {/* Hero Section - Premium Consultant Style */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                {/* Background Image - Bureau */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/bureau.png"
                        alt="Bureau professionnel"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 lg:pt-36 lg:pb-28">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* LEFT: Content */}
                        <div className="space-y-8">
                            {/* Badge Consultant */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full">
                                <Sparkles className="w-4 h-4 text-accent-primary" />
                                <span className="text-accent-primary text-sm font-semibold">
                                    DAF externalisé | Finance & Data
                                </span>
                            </div>

                            {/* H1 - Messaging clair */}
                            <h1 className="text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                                Pilotez votre cash,<br />
                                vos marges et votre<br />
                                <span className="text-accent-primary">
                                    trésorerie
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                                J'aide les dirigeants de PME et ETI à avoir une vision claire et anticipée de leur finance.
                                <span className="text-white font-semibold"> Avec la data et l'IA.</span>
                            </p>

                            {/* Value Props - Quick */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-accent-primary" />
                                    <span>De 1M€ à 100M€ CA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-accent-primary" />
                                    <span>3 agents spécialisés</span>
                                </div>
                            </div>

                            {/* CTAs - Clear Hierarchy */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a
                                    href="https://calendly.com/zineinsight"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Réserver un diagnostic
                                </a>

                                <Link
                                    href="/consulting"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl border border-white/20 transition-all duration-200"
                                >
                                    Voir les offres
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex items-center gap-6 text-sm text-gray-400 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Réponse sous 24h</span>
                                </div>
                                <span className="text-gray-600">•</span>
                                <span>30 min gratuit</span>
                                <span className="text-gray-600">•</span>
                                <span>Accompagnement personnalisé</span>
                            </div>
                        </div>

                        {/* RIGHT: Photo Otmane devant dashboard */}
                        <div className="relative lg:block hidden">
                            <div className="relative">
                                {/* Glow effect behind */}
                                <div className="absolute -inset-4 bg-accent-primary/20 rounded-3xl blur-2xl"></div>
                                
                                {/* Main image */}
                                <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                                    <Image
                                        src="/images/moi-bureau.png"
                                        alt="Otmane Boulahia - Consultant Finance & Data"
                                        width={600}
                                        height={500}
                                        className="object-cover w-full"
                                        priority
                                    />
                                    
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                                    
                                    {/* Caption overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-accent-primary flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">OB</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">Otmane Boulahia</p>
                                                <p className="text-gray-300 text-sm">Financial Strategy Consultant</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating stats card */}
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">10+</p>
                                            <p className="text-xs text-gray-500">Ans d'expertise</p>
                                            <p className="text-xs text-gray-500"> Finance & Data</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Otmane Section - Credibility */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* LEFT: Photo + Credentials */}
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/bureau-nuit.png"
                                    alt="Bureau Otmane Boulahia - Workspace"
                                    width={600}
                                    height={400}
                                    className="object-cover w-full"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                
                                {/* Bottom caption */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="text-white/80 text-sm italic">
                                        "Là où vos données deviennent des décisions"
                                    </p>
                                </div>
                            </div>
                            
                            {/* Floating credential badge */}
                            <div className="absolute -top-4 -right-4 bg-accent-primary text-white px-4 py-2 rounded-lg shadow-lg">
                                <p className="font-bold">10+ ans</p>
                                <p className="text-xs opacity-90">Finance & Data</p>
                            </div>
                        </div>

                        {/* RIGHT: About Content */}
                        <div className="space-y-6">
                            <div>
                                <p className="text-accent-primary font-semibold text-sm uppercase tracking-wider mb-2">
                                    Votre expert
                                </p>
                                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                                    Otmane Boulahia
                                </h2>
                                <p className="text-xl text-gray-600 font-medium">
                                    Financial Strategy Consultant
                                </p>
                            </div>

                            {/* Credentials Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <GraduationCap className="w-5 h-5 text-accent-primary" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Master Finance</p>
                                        <p className="text-xs text-gray-500">Université Côte d'Azur</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Briefcase className="w-5 h-5 text-accent-primary" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Data Analyst</p>
                                        <p className="text-xs text-gray-500">Le Wagon</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Award className="w-5 h-5 text-accent-primary" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">10 ans Enseignement</p>
                                        <p className="text-xs text-gray-500">Sciences Économiques</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Users className="w-5 h-5 text-accent-primary" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Double expertise</p>
                                        <p className="text-xs text-gray-500">Finance & Data</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mission statement */}
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-accent-primary">
                                <p className="text-gray-800 leading-relaxed">
                                    <span className="font-bold">"Trop de dirigeants pilotent leur boîte avec des chiffres en retard, incomplets, ou inexploitables."</span>
                                    <br /><br />
                                    Ma mission : transformer vos données en décisions stratégiques claires — avec la rigueur d'un cabinet d'audit et la réactivité d'un expert terrain.
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="flex gap-4">
                                <a
                                    href="https://www.linkedin.com/in/otmane-boulahia/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg font-semibold transition-all"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    LinkedIn
                                </a>
                                <a
                                    href="https://calendly.com/zineinsight"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white rounded-lg font-semibold transition-all"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Discutons
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition - What I Do */}
            <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                {/* Background Image - Moi Classe */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/moi-classe.png"
                        alt="Otmane Boulahia enseignement"
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60"></div>
                </div>

                <div className="relative max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-white mb-6">
                            Comment je peux vous aider
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Deux approches complémentaires pour transformer votre pilotage financier
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Phase 1: Audit */}
                        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-accent-primary transition-all shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Audit Stratégique</h3>
                                </div>
                            </div>
                            
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Une lecture claire et fiable de votre situation financière, validée par un expert, pour décider avec 3 mois d’avance.
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span>Analyse cash, marges, risques</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span>Score FinSight™ (0-100)</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span>Plan d'action chiffré</span>
                                </li>
                            </ul>

                            <div className="pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500 mb-2">À partir de</p>
                                <p className="text-3xl font-bold text-gray-900 mb-4">1 490€</p>
                                <Link
                                    href="/consulting"
                                    className="block w-full px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl font-semibold text-center transition-all"
                                >
                                    Découvrir les audits
                                </Link>
                            </div>
                        </div>

                        {/* Agents IA */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-slate-700 hover:border-accent-primary transition-all shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>                                    <h3 className="text-2xl font-bold text-white">Agents IA</h3>
                                </div>
                            </div>
                            
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Automatisez le monitoring quotidien avec 3 agents IA spécialisés. Plus de fichiers Excel manuels : uniquement des décisions basées sur vos données réelles.
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-gray-200">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <span><span className="font-semibold">TRESORIS</span> : Surveillance trésorerie</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-200">
                                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <BarChart3 className="w-3 h-3 text-purple-400" />
                                    </div>
                                    <span><span className="font-semibold">MARGIS</span> : Rentabilité réelle</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-200">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-3 h-3 text-green-400" />
                                    </div>
                                    <span><span className="font-semibold">SCENARIS</span> : Scénarios what-if</span>
                                </li>
                            </ul>

                            <div className="pt-6 border-t border-slate-700">
                                <p className="text-sm text-gray-400 mb-2">À partir de</p>
                                <p className="text-3xl font-bold text-white mb-4">15 000€<span className="text-lg text-gray-400"> clé en main</span></p>
                                <Link
                                    href="/agents"
                                    className="block w-full px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-center transition-all"
                                >
                                    Explorer les agents
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Témoignages - Social Proof */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                            Ils m'ont fait confiance
                        </h2>
                        <p className="text-xl text-gray-600">
                            Retours de dirigeants qui ont transformé leur pilotage financier
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Témoignage 1 */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-accent-primary transition-all">
                            <div className="mb-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-700 italic leading-relaxed mb-6">
                                    "Nous disposons désormais d’un cadre de pilotage financier fiable et homogène, aligné avec nos enjeux métiers et utilisable au quotidien."
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-lg">DA</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Directrice Administrative</p>
                                    <p className="text-sm text-gray-500">Groupe Formation (500M€)</p>
                                </div>
                            </div>
                        </div>

                        {/* Témoignage 2 */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-accent-primary transition-all">
                            <div className="mb-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-700 italic leading-relaxed mb-6">
                                    "Nous avons enfin une vision exploitable de nos chantiers, du cash et des marges, ce qui nous permet d’arbitrer rapidement et d’agir là où c’est nécessaire."
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-purple-600 font-bold text-lg">LB</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Dirigeant</p>
                                    <p className="text-sm text-gray-500">PME BTP/Services (7M€)</p>
                                </div>
                            </div>
                        </div>

                        {/* Témoignage 3 */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-accent-primary transition-all">
                            <div className="mb-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-700 italic leading-relaxed mb-6">
                                    " Le travail réalisé a permis de structurer un cadre de pilotage robuste et automatisé, sans dépendre de retraitements manuels, avec des indicateurs exploitables en comité de direction. "
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 font-bold text-lg">MC</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">CFO</p>
                                    <p className="text-sm text-gray-500">PME Services / Conseil</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final - Puissant */}
            <section className="py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                {/* Background Image - Vue NY */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/vue-NY.png"
                        alt="Vue New York bureau"
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                        Prêt à reprendre le contrôle ?
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Discutons de votre situation lors d'un appel de 30 minutes.<br />
                        <span className="text-white font-semibold">Gratuit. Sans engagement. Sous 24h.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-accent-primary hover:bg-accent-primary-hover text-white text-lg font-bold rounded-xl shadow-2xl hover:shadow-accent-primary/50 hover:-translate-y-1 transition-all duration-200"
                        >
                            <Calendar className="w-5 h-5" />
                            Réserver mon diagnostic
                        </a>

                        <Link
                            href="/consulting"
                            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl border border-white/20 transition-all duration-200"
                        >
                            Voir toutes les offres
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Réponse sous 24h</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Échange ciblé</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Approche terrain</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

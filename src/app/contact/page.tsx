'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowRight,
    TrendingUp,
    BarChart3,
    Linkedin,
    Mail,
    Target,
    Shield,
    Calendar,
    Users,
    Sparkles,
    Check,
    MessageSquare,
    Clock,
    Bot,
    FileText
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background-primary text-text-primary font-sans">
            <Header />

            {/* ============================================
                HERO SECTION - Invitation à l'échange
               ============================================ */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/bureau.png"
                        alt="Bureau professionnel"
                        fill
                        className="object-cover opacity-15"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/70" />
                </div>

                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-accent-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24 lg:pt-40 lg:pb-32">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full">
                                <MessageSquare className="w-4 h-4 text-accent-primary" />
                                <span className="text-accent-primary text-sm font-semibold">
                                    Échange gratuit et personnalisé
                                </span>
                            </div>

                            {/* H1 */}
                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                                Échangeons sur vos{' '}
                                <span className="text-accent-primary">enjeux financiers</span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                                30 minutes pour comprendre votre situation, identifier vos priorités et 
                                définir ensemble si un accompagnement peut vous aider.
                            </p>

                            {/* Trust badges */}
                            <div className="flex flex-wrap justify-center gap-6 pt-4">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Clock className="w-5 h-5 text-accent-primary" />
                                    <span className="text-sm">30 min offertes</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-5 h-5 text-accent-primary" />
                                    <span className="text-sm">Sans engagement</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Shield className="w-5 h-5 text-accent-primary" />
                                    <span className="text-sm">Confidentialité totale</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                CONTACT CARDS - Points de contact
               ============================================ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary-subtle rounded-full mb-4">
                            Me contacter
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Prenez contact directement
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Choisissez le mode d&apos;échange qui vous convient
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Calendly - Principal */}
                        <motion.a
                            href="https://calendly.com/zineinsight/20min"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent-primary text-white text-xs font-bold rounded-full">
                                Recommandé
                            </div>
                            <div className="w-14 h-14 bg-accent-primary/20 rounded-2xl flex items-center justify-center mb-6">
                                <Calendar className="w-7 h-7 text-accent-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Réserver un créneau</h3>
                            <p className="text-gray-300 mb-4">
                                20 minutes en visio pour un échange direct et efficace
                            </p>
                            <div className="flex items-center gap-2 text-accent-primary font-semibold group-hover:gap-3 transition-all">
                                Planifier maintenant
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </motion.a>

                        {/* Email */}
                        <motion.a
                            href="mailto:otmane@zineinsight.com"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="group bg-white rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-accent-primary-subtle rounded-2xl flex items-center justify-center mb-6">
                                <Mail className="w-7 h-7 text-accent-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">Par email</h3>
                            <p className="text-text-secondary mb-4">
                                Pour une première prise de contact écrite
                            </p>
                            <p className="text-accent-primary font-semibold">
                                otmane@zineinsight.com
                            </p>
                        </motion.a>

                        {/* LinkedIn */}
                        <motion.a
                            href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="group bg-white rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                <Linkedin className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">Sur LinkedIn</h3>
                            <p className="text-text-secondary mb-4">
                                Connectons-nous et échangeons sur vos enjeux
                            </p>
                            <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                                Voir le profil
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* ============================================
                POURQUOI ÉCHANGER - Services
               ============================================ */}
            <section className="py-20 bg-background-primary">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary-subtle rounded-full mb-4">
                            Nos accompagnements
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Sur quoi pouvons-nous échanger ?
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Audit Finance */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="group relative bg-white rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-2xl" />
                            <div className="relative">
                                <div className="w-14 h-14 bg-accent-primary-subtle rounded-2xl flex items-center justify-center mb-6">
                                    <FileText className="w-7 h-7 text-accent-primary" />
                                </div>
                                <span className="text-xs font-semibold text-accent-primary uppercase tracking-wider">Audit Finance</span>
                                <h3 className="text-2xl font-bold text-text-primary mt-2 mb-4">Accompagnement DAF externalisé</h3>
                                <p className="text-text-secondary mb-6">
                                    Diagnostic financier, pilotage du cash, analyse de rentabilité, tableaux de bord intelligents et structuration des décisions.
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {['Pilotage du cash et du BFR', 'Lecture réelle de la rentabilité', 'Prévisions et scénarios à 3-12 mois', 'Dashboards automatisés'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-text-secondary">
                                            <Check className="w-5 h-5 text-accent-success" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/consulting"
                                    className="inline-flex items-center gap-2 text-accent-primary font-semibold hover:gap-3 transition-all"
                                >
                                    Découvrir les offres
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Agents IA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="group relative bg-white rounded-2xl p-8 border border-border-default hover:border-accent-primary/30 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
                            <div className="relative">
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                                    <Bot className="w-7 h-7 text-purple-600" />
                                </div>
                                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Agents IA</span>
                                <h3 className="text-2xl font-bold text-text-primary mt-2 mb-4">Intelligence artificielle décisionnelle</h3>
                                <p className="text-text-secondary mb-6">
                                    Des agents IA autonomes conçus pour surveiller votre trésorerie, analyser votre rentabilité et simuler vos décisions stratégiques.
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {['Surveillance 24/7 de la trésorerie', 'Alertes intelligentes automatisées', 'Simulations de scénarios', 'Contrôle humain permanent'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-text-secondary">
                                            <Check className="w-5 h-5 text-purple-600" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/agents"
                                    className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
                                >
                                    Découvrir les agents
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                À PROPOS - Section avec photo (comme audit finance)
               ============================================ */}
            <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Photo */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-accent-primary/20 rounded-3xl blur-2xl" />
                            <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                                <Image
                                    src="/images/Photo_profil.jpeg"
                                    alt="Otmane Boulahia - DAF externalisé et consultant en intelligence financière"
                                    width={500}
                                    height={600}
                                    className="object-cover w-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent-primary flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">OB</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">Otmane Boulahia</p>
                                            <p className="text-gray-300 text-sm">DAF externalisé • Consultant IA Finance</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-full">
                                Mon parcours
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold">
                                DAF externalisé &amp; consultant en{' '}
                                <span className="text-accent-primary">intelligence financière</span>
                            </h2>

                            <div className="space-y-4 text-gray-300 leading-relaxed">
                                <p>
                                    J&apos;accompagne des dirigeants de PME (2 à 20 M€ de chiffre d&apos;affaires) 
                                    confrontés à une complexité croissante de leurs décisions financières : 
                                    <span className="text-white font-medium"> arbitrages d&apos;investissement, pilotage du cash, rentabilité réelle, timing des choix stratégiques.</span>
                                </p>
                                <p>
                                    Mon parcours combine une formation solide en finance, une pratique terrain du pilotage financier 
                                    et une maîtrise avancée des outils data et IA. Cette double compétence me permet de garder une 
                                    posture rare : <span className="text-accent-primary font-semibold">à la fois analytique et profondément orientée décision</span>.
                                </p>
                                <p>
                                    Je ne me positionne pas comme un producteur de reporting ni comme un intégrateur d&apos;outils. 
                                    Je travaille au plus près du dirigeant, là où les chiffres doivent devenir compréhensibles, 
                                    discutables et exploitables — avant qu&apos;ils ne s&apos;imposent sous forme de contraintes.
                                </p>
                            </div>

                            {/* Credentials */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {[
                                    { icon: BarChart3, label: 'Finance & Data' },
                                    { icon: Users, label: 'PME 2-20M€' },
                                    { icon: Target, label: 'ROI mesurable' },
                                    { icon: Shield, label: 'Confidentialité' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                                        <item.icon className="w-5 h-5 text-accent-primary" />
                                        <span className="text-sm text-gray-300">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                CE QU'IL FAIT - Interventions
               ============================================ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary-subtle rounded-full mb-4">
                            Mon approche
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Comment j&apos;interviens
                        </h2>
                        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                            Mon rôle est d&apos;aider les dirigeants à piloter leur trajectoire financière, 
                            que l&apos;entreprise traverse une phase de tension ou une phase de croissance.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {[
                            { icon: TrendingUp, title: 'Pilotage du cash et du BFR', desc: 'Visibilité à 90 jours, anticipation des tensions, optimisation du besoin en fonds de roulement.' },
                            { icon: BarChart3, title: 'Lecture réelle de la rentabilité', desc: 'Au-delà du résultat comptable : marges par activité, par client, par projet.' },
                            { icon: Target, title: 'Prévisions et scénarios', desc: 'Modélisation à 3-12 mois pour anticiper et préparer les décisions.' },
                            { icon: Sparkles, title: 'Identification des décalages', desc: 'Entre activité, budget et trésorerie : comprendre où se créent les tensions.' },
                            { icon: Shield, title: 'Structuration décisionnelle', desc: 'Cadrer les décisions financières clés avec méthode et clarté.' },
                            { icon: Clock, title: 'Timing optimal', desc: 'Prendre les bonnes décisions au bon moment, avant qu\'elles ne s\'imposent.' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="bg-background-primary rounded-2xl p-6 border border-border-default hover:border-accent-primary/30 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-accent-primary-subtle rounded-xl flex items-center justify-center mb-4">
                                    <item.icon className="w-6 h-6 text-accent-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Citation / Conviction */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto text-center bg-slate-50 rounded-2xl p-8 border border-border-subtle"
                    >
                        <p className="text-xl text-text-primary font-medium italic mb-4">
                            « Le problème n&apos;est pas le manque de données, mais le manque de décisions claires, prises au bon moment. »
                        </p>
                        <p className="text-text-secondary text-sm">
                            — Ma conviction fondatrice
                        </p>
                    </motion.div>

                    {/* Modes d'intervention */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-16"
                    >
                        <h3 className="text-2xl font-bold text-text-primary text-center mb-8">
                            Selon les besoins, deux modes d&apos;accompagnement possibles :
                        </h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl p-8 border border-border-default shadow-sm">
                                <div className="w-12 h-12 bg-accent-primary-subtle rounded-xl flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-accent-primary" />
                                </div>
                                <h4 className="text-xl font-bold text-text-primary mb-3">DAF externalisé</h4>
                                <p className="text-text-secondary leading-relaxed">
                                    Directement intégré au pilotage de l&apos;entreprise, pour un accompagnement opérationnel 
                                    et stratégique sur la durée.
                                </p>
                            </div>
                            <div className="bg-white rounded-2xl p-8 border border-border-default shadow-sm">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                    <Bot className="w-6 h-6 text-purple-600" />
                                </div>
                                <h4 className="text-xl font-bold text-text-primary mb-3">Agents IA décisionnels</h4>
                                <p className="text-text-secondary leading-relaxed">
                                    Comme TRESORIS, utilisés comme outils de surveillance, d&apos;analyse et de simulation — 
                                    toujours sous contrôle humain.
                                </p>
                            </div>
                        </div>
                        <p className="text-center text-text-secondary mt-8 text-lg">
                            Dans tous les cas, la finalité reste la même :{' '}
                            <span className="text-text-primary font-semibold">
                                réduire l&apos;incertitude financière, sécuriser les choix et redonner au dirigeant une maîtrise claire de sa trajectoire.
                            </span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ============================================
                CTA FINAL - Premium
               ============================================ */}
            <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-6">
                            Passez à l&apos;action
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Prêt à{' '}
                            <span className="text-accent-primary">échanger</span> ?
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            20 minutes pour comprendre votre situation et identifier si un accompagnement peut vous aider. Gratuit et sans engagement.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://calendly.com/zineinsight/20min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-accent-primary hover:bg-accent-primary-hover text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Calendar className="w-6 h-6" />
                                Réserver un créneau
                            </a>
                            <a
                                href="mailto:otmane@zineinsight.com"
                                className="inline-flex items-center gap-2 px-8 py-5 bg-white/10 hover:bg-white/20 border border-white/20 text-lg font-semibold rounded-xl transition-all"
                            >
                                <Mail className="w-5 h-5" />
                                otmane@zineinsight.com
                            </a>
                        </div>

                        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mt-8">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>Réponse sous 24h</span>
                            </div>
                            <span className="text-gray-600">•</span>
                            <span>20 min gratuit</span>
                            <span className="text-gray-600">•</span>
                            <span>Sans engagement</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

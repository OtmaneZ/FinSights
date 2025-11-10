'use client'

import Link from 'next/link'
import {
    Check,
    Sparkles,
    Zap,
    Users,
    Building2,
    Rocket,
    Clock,
    Shield,
    Code,
    FileCheck,
    Linkedin,
    Github,
    Mail,
    ArrowRight,
    CheckCircle2
} from 'lucide-react'

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
            {/* Header - identique à homepage */}
            <header className="border-b border-border-subtle backdrop-blur-sm bg-bg-primary/80 sticky top-0 z-50">
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
                        <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                            Accueil
                        </Link>
                        <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                            Démo Live
                        </Link>
                        <Link href="/services" className="text-accent-gold font-medium text-sm">
                            Nos Offres
                        </Link>
                        <a
                            href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                        </a>
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-accent-gold hover:bg-accent-gold-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Discutons
                        </a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
                {/* Radial gradient glow effect */}
                <div className="absolute inset-x-0 top-0 h-[400px] pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial from-accent-gold/20 via-accent-gold/5 to-transparent blur-3xl"
                        style={{
                            background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)'
                        }}>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-gold-subtle border border-accent-gold-border rounded-full mb-8">
                        <Sparkles className="w-4 h-4 text-accent-gold" />
                        <span className="text-accent-gold text-sm font-medium">Produit Clé en Main • Personnalisable</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                        FinSight pour<br />
                        <span className="text-accent-gold">Votre Entreprise</span>
                    </h1>

                    <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
                        Dashboard financier IA personnalisé, livré en 2 semaines.<br />
                        Vous gardez le code source et la propriété complète.
                    </p>

                    <div className="flex items-center justify-center gap-6 text-sm text-text-tertiary">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent-gold" />
                            <span>Déploiement rapide</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent-gold" />
                            <span>Code source inclus</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent-gold" />
                            <span>Licence perpétuelle</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packages Section */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Package 1: Express */}
                    <div className="surface rounded-2xl p-8 border border-border-subtle hover:border-accent-gold-border transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-gold-subtle border border-accent-gold-border flex items-center justify-center">
                                <Zap className="w-6 h-6 text-accent-gold" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Express</h3>
                                <p className="text-text-tertiary text-sm">Démarrage rapide</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-bold text-accent-gold">2 500€</span>
                            </div>
                            <p className="text-text-secondary text-sm">Livraison en 1 semaine</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Déploiement FinSight standard</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Import de vos données comptables</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Configuration 15 KPIs de base</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">1 session formation (2h)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Export PDF/Excel</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Documentation technique</span>
                            </li>
                        </ul>

                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-6 py-3 border-2 border-border-default hover:border-accent-gold-border text-text-primary rounded-lg font-semibold text-center transition-all hover:bg-surface-elevated"
                        >
                            Démarrer
                        </a>

                        <p className="text-xs text-text-tertiary mt-4 text-center">
                            Idéal pour : TPE, Startups, Test
                        </p>
                    </div>

                    {/* Package 2: Pro (Recommandé) */}
                    <div className="surface rounded-2xl p-8 border-2 border-accent-gold relative overflow-hidden">
                        {/* Badge "Recommandé" */}
                        <div className="absolute top-0 right-0 bg-accent-gold text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
                            Recommandé
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-gold flex items-center justify-center">
                                <Rocket className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Pro</h3>
                                <p className="text-text-tertiary text-sm">Solution complète</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-bold text-accent-gold">4 500€</span>
                            </div>
                            <p className="text-text-secondary text-sm">Livraison en 2 semaines</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary font-semibold">Tout du package Express +</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Design aux couleurs de votre marque</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">KPIs personnalisés selon votre secteur</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">AI Copilot configuré (questions métier)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Alertes email automatiques</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">2 sessions formation (CFO + équipe)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">1 mois support inclus</span>
                            </li>
                        </ul>

                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-6 py-3 bg-accent-gold hover:bg-accent-gold-hover text-white rounded-lg font-semibold text-center transition-all hover:shadow-xl"
                        >
                            Commander
                        </a>

                        <p className="text-xs text-text-tertiary mt-4 text-center">
                            Idéal pour : PME 20-100 salariés, Scale-ups
                        </p>
                    </div>

                    {/* Package 3: Enterprise */}
                    <div className="surface rounded-2xl p-8 border border-border-subtle hover:border-accent-gold-border transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-gold-subtle border border-accent-gold-border flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-accent-gold" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Enterprise</h3>
                                <p className="text-text-tertiary text-sm">Sur-mesure</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl font-bold text-accent-gold">Sur devis</span>
                            </div>
                            <p className="text-text-secondary text-sm">À partir de 8 000€</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary font-semibold">Tout du package Pro +</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Connexion à votre ERP (Sage, Cegid, SAP)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Multi-entités (filiales, BU)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Workflows personnalisés</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Dashboard C-level + Board</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Formation étendue (3 sessions)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">3 mois support inclus</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-text-secondary">Code source remis</span>
                            </li>
                        </ul>

                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-6 py-3 border-2 border-border-default hover:border-accent-gold-border text-text-primary rounded-lg font-semibold text-center transition-all hover:bg-surface-elevated"
                        >
                            Discutons
                        </a>

                        <p className="text-xs text-text-tertiary mt-4 text-center">
                            Idéal pour : Groupes, ETI 100-500 salariés
                        </p>
                    </div>
                </div>
            </section>

            {/* Inclus dans toutes les offres */}
            <section className="max-w-5xl mx-auto px-6 pb-24">
                <div className="surface rounded-2xl p-12 border border-accent-gold-border">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-3">🎁 Inclus dans toutes les offres</h2>
                        <p className="text-text-secondary">Ce que vous recevez, quel que soit le package</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-gold-subtle border border-accent-gold-border flex items-center justify-center flex-shrink-0">
                                <Code className="w-6 h-6 text-accent-gold" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Code source personnalisé</h3>
                                <p className="text-sm text-text-secondary">Vous êtes propriétaire à 100%. Modifiez comme vous voulez.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-gold-subtle border border-accent-gold-border flex items-center justify-center flex-shrink-0">
                                <Rocket className="w-6 h-6 text-accent-gold" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Déploiement clé en main</h3>
                                <p className="text-sm text-text-secondary">Sur Vercel ou votre propre serveur. Configuration complète.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-gold-subtle border border-accent-gold-border flex items-center justify-center flex-shrink-0">
                                <FileCheck className="w-6 h-6 text-accent-gold" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Documentation technique</h3>
                                <p className="text-sm text-text-secondary">Guide d'installation, architecture, et maintenance.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-gold-subtle border border-accent-gold-border flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-accent-gold" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Licence perpétuelle</h3>
                                <p className="text-sm text-text-secondary">Aucun abonnement. Payez une fois, gardez à vie.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comment ça marche */}
            <section className="max-w-5xl mx-auto px-6 pb-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Comment ça marche ?</h2>
                    <p className="text-xl text-text-secondary">Un processus simple en 4 étapes</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-gold-subtle border-2 border-accent-gold flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-gold">1</span>
                        </div>
                        <h3 className="font-semibold mb-2">Prise de contact</h3>
                        <p className="text-sm text-text-secondary">
                            RDV gratuit de 15min pour comprendre vos besoins
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-gold-subtle border-2 border-accent-gold flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-gold">2</span>
                        </div>
                        <h3 className="font-semibold mb-2">Devis & Validation</h3>
                        <p className="text-sm text-text-secondary">
                            Proposition détaillée sous 48h. Signature du contrat.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-gold-subtle border-2 border-accent-gold flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-gold">3</span>
                        </div>
                        <h3 className="font-semibold mb-2">Développement</h3>
                        <p className="text-sm text-text-secondary">
                            Personnalisation et déploiement (1-4 semaines selon package)
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-gold-subtle border-2 border-accent-gold flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-gold">4</span>
                        </div>
                        <h3 className="font-semibold mb-2">Formation & Livraison</h3>
                        <p className="text-sm text-text-secondary">
                            Remise du code, formation équipe, et mise en production
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto px-6 pb-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Questions fréquentes</h2>
                </div>

                <div className="space-y-6">
                    <div className="surface rounded-xl p-6 border border-border-subtle">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <span className="text-accent-gold">•</span>
                            Qui garde le code source ?
                        </h3>
                        <p className="text-sm text-text-secondary pl-5">
                            <strong>Vous.</strong> Le code source vous est remis à la fin de la mission. Vous en êtes propriétaire à 100% et pouvez le modifier librement.
                        </p>
                    </div>

                    <div className="surface rounded-xl p-6 border border-border-subtle">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <span className="text-accent-gold">•</span>
                            Quels sont les délais de livraison ?
                        </h3>
                        <p className="text-sm text-text-secondary pl-5">
                            Express : 1 semaine • Pro : 2 semaines • Enterprise : 3-4 semaines. Nous pouvons accélérer si besoin urgent.
                        </p>
                    </div>

                    <div className="surface rounded-xl p-6 border border-border-subtle">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <span className="text-accent-gold">•</span>
                            Y a-t-il des frais cachés ou d'abonnement ?
                        </h3>
                        <p className="text-sm text-text-secondary pl-5">
                            <strong>Non.</strong> Le prix indiqué est tout compris (développement, déploiement, formation). Aucun abonnement. Les seuls coûts optionnels sont l'hébergement (Vercel : ~20€/mois) et l'API OpenAI si vous utilisez le copilote IA (~30€/mois).
                        </p>
                    </div>

                    <div className="surface rounded-xl p-6 border border-border-subtle">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <span className="text-accent-gold">•</span>
                            Puis-je demander des évolutions après livraison ?
                        </h3>
                        <p className="text-sm text-text-secondary pl-5">
                            Oui, à tout moment. Tarif : 800€/jour de développement. Exemples : ajouter un nouveau KPI, connecter un outil externe, créer un nouveau rapport.
                        </p>
                    </div>

                    <div className="surface rounded-xl p-6 border border-border-subtle">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <span className="text-accent-gold">•</span>
                            Mes données sont-elles sécurisées ?
                        </h3>
                        <p className="text-sm text-text-secondary pl-5">
                            Oui. FinSight traite vos données <strong>côté client</strong> (dans votre navigateur). Aucune donnée n'est stockée sur nos serveurs. Vous pouvez également déployer sur votre propre infrastructure.
                        </p>
                    </div>

                    <div className="surface rounded-xl p-6 border border-border-subtle">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <span className="text-accent-gold">•</span>
                            Proposez-vous un essai gratuit ou une démo personnalisée ?
                        </h3>
                        <p className="text-sm text-text-secondary pl-5">
                            Vous pouvez tester gratuitement sur <Link href="/dashboard" className="text-accent-gold hover:underline">la démo live</Link> avec vos propres données CSV. Pour une démo personnalisée avec vos vrais exports comptables, prenez RDV (gratuit).
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="max-w-4xl mx-auto px-6 pb-32">
                <div className="surface rounded-2xl p-12 text-center border-2 border-accent-gold-border relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-radial from-accent-gold/10 via-transparent to-transparent opacity-50"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-4">Prêt à démarrer ?</h2>
                        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                            Discutons de votre projet lors d'un RDV gratuit de 15 minutes
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-accent-gold hover:bg-accent-gold-hover text-white rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-1"
                            >
                                Prendre RDV (gratuit)
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-accent-gold-border text-text-primary rounded-xl font-semibold text-lg transition-all hover:bg-surface-elevated"
                            >
                                Voir la démo live
                            </Link>
                        </div>

                        <p className="text-sm text-text-tertiary mt-6">
                            Réponse sous 24h • Sans engagement
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border-subtle py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/zineinsights_logo.jpeg"
                                alt="FinSight"
                                className="w-8 h-8 rounded-lg"
                            />
                            <div>
                                <div className="text-lg font-semibold">FinSight</div>
                                <div className="text-xs text-text-tertiary">by Otmane Boulahia</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
                                Accueil
                            </Link>
                            <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
                                Démo Live
                            </Link>
                            <Link href="/services" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
                                Nos Offres
                            </Link>
                            <a
                                href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-sm"
                            >
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                            </a>
                            <a
                                href="https://github.com/OtmaneZ/FinSights"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-sm"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border-subtle text-center text-sm text-text-tertiary">
                        <p>
                            © 2025 Otmane Boulahia •
                            <a href="https://www.zineinsight.com" className="hover:text-text-secondary transition-colors ml-1">ZineInsight</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

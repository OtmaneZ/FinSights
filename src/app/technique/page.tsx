'use client'

import Link from 'next/link'
import { Code, Brain, Database, Zap, Shield, GitBranch, Package, Cpu } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TechniquePage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section */}
            <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-8">
                    <Code className="w-4 h-4 text-accent-primary" />
                    <span className="text-accent-primary text-sm font-medium">Stack Technique</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight text-primary">
                    Infrastructure & Technologies
                </h1>

                <p className="text-xl text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
                    Une stack moderne, scalable et performante pour l'analyse financière en temps réel.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold text-sm transition-all"
                >
                    ← Retour à l'accueil
                </Link>
            </section>

            {/* Frontend Stack */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="surface rounded-2xl p-8 border border-border-subtle">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                            <Code className="w-6 h-6 text-accent-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Frontend & Framework</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Next.js 14 App Router</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Server Components, Streaming SSR, optimisations automatiques (images, fonts, bundles).
                                Route handlers pour API intégrées.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">TypeScript 5.3</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Typage strict sur toute la codebase. Interfaces pour données financières,
                                autocomplete IDE, détection erreurs à la compilation.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">React 18</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Hooks (useState, useEffect, useMemo), Context API pour state global,
                                Suspense pour lazy loading, Error Boundaries.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Tailwind CSS 3.4</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Utility-first CSS, design system custom (tokens couleurs, spacing),
                                dark mode ready, responsive design mobile-first.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI & Data Viz */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="surface rounded-2xl p-8 border border-border-subtle">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                            <Brain className="w-6 h-6 text-accent-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">IA & Visualisations</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">OpenAI GPT-4o</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Copilot conversationnel en français pour questions financières.
                                Streaming responses, context window 128k tokens, fine-tuned prompts.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">TensorFlow.js</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Détection anomalies financières avec 3 algorithmes : Z-score,
                                Isolation Forest, Moving Average. Exécution browser-side.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">D3.js v7</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Charts avancés : Sankey flow (flux trésorerie), Sunburst (hiérarchie dépenses),
                                Treemap. Interactions SVG temps réel.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Recharts</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Graphiques standards : Line, Bar, Area, Pie. Responsive, tooltips custom,
                                animations fluides. Composants React natifs.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Pinecone Vector DB</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                50k vecteurs embeddings pour RAG (Retrieval Augmented Generation).
                                Recherche sémantique sur historique financier.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Pusher Realtime</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                WebSockets pour collaboration temps réel : curseurs multi-users,
                                présence, notifications push.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Backend & Database */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="surface rounded-2xl p-8 border border-border-subtle">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                            <Database className="w-6 h-6 text-accent-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Backend & Base de Données</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">PostgreSQL 15</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Base relationnelle avec JSONB pour données flexibles.
                                Indexes optimisés queries financières, foreign keys intégrité.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Prisma ORM</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Type-safe database client. Migrations automatiques,
                                relations complexes, query builder avec autocomplete.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Next-Auth</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                JWT sessions avec httpOnly cookies. Providers OAuth (Google, LinkedIn),
                                credentials custom, middleware protection routes.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Stripe API</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Paiements récurrents (Business 99€, Growth 199€). Webhooks signature HMAC,
                                Customer Portal, gestion quotas par plan.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Resend Email</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Transactional emails : Welcome, UpgradeSuccess, PaymentFailed, UsageAlert.
                                Templates React Email avec branding.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Rate Limiting</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Protection API avec quotas par plan. Redis + upstash/ratelimit.
                                Headers X-RateLimit standardisés.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Deployment & DevOps */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="surface rounded-2xl p-8 border border-border-subtle">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                            <Zap className="w-6 h-6 text-accent-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Déploiement & Performance</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Vercel Edge Network</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Déploiement global 70+ régions. Edge Functions &lt;100ms latence.
                                Preview deployments par branch Git.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">GitHub Actions CI/CD</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Pipeline automatisé : lint → test → build → deploy.
                                Checks qualité code (ESLint, TypeScript), tests E2E Playwright.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Sentry Monitoring</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Error tracking frontend/backend. Source maps, breadcrumbs,
                                stack traces. Alertes Slack erreurs critiques.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">PostHog Analytics</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Product analytics : events (signup, upload, query), funnels conversion,
                                session replay, feature flags A/B testing.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Bundle Optimization</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Code splitting automatique Next.js. Lazy load D3.js (200KB),
                                tree shaking, compression Brotli. Bundle total &lt;350KB.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Lighthouse Score</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Performance 95/100, Accessibility 100/100, Best Practices 100/100,
                                SEO 100/100. Core Web Vitals excellents.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Details */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="surface rounded-2xl p-8 border border-border-subtle">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                            <Shield className="w-6 h-6 text-accent-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Sécurité & Conformité</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">Chiffrement AES-256</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Données au repos chiffrées base PostgreSQL. TLS 1.3 en transit.
                                Secrets env variables chiffrées Vercel.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">RGPD Compliance</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Consentement cookies, droit accès/rectification/suppression,
                                DPO contact, registre traitements, audits réguliers.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">JWT Sessions</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Tokens httpOnly secure cookies. Expiration 7 jours, refresh automatique,
                                logout révoque token serveur.
                            </p>
                        </div>

                        <div className="p-4 bg-surface-elevated rounded-xl">
                            <h3 className="font-semibold mb-2 text-primary">API Security</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Bearer tokens, HMAC signatures webhooks, CORS restrictif,
                                input validation Zod schemas, SQL injection prevention Prisma.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture Diagram Link */}
            <section className="max-w-4xl mx-auto px-6 pb-32 text-center">
                <div className="surface rounded-2xl p-12 border-2 border-accent-primary-border">
                    <GitBranch className="w-16 h-16 text-accent-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4 text-primary">Code Source Disponible</h2>
                    <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
                        FinSight est un projet open-source. Le code complet est disponible sur GitHub
                        pour audit, contributions et forks.
                    </p>
                    <a
                        href="https://github.com/OtmaneZ/FinSights"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-base transition-all hover:shadow-lg"
                    >
                        <Package className="w-5 h-5" />
                        Voir sur GitHub →
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    )
}

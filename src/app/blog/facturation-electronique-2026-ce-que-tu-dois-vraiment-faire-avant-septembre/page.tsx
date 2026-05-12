import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, ArrowRight, AlertTriangle, CheckCircle2, FileText, ShieldAlert } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Facturation électronique 2026 : ce que tu dois vraiment faire avant septembre | FinSight',
    description: 'À 4 mois de l\'échéance, 65% des dirigeants de TPE ne connaissent pas le contenu exact de la réforme. Calendrier, formats, sanctions et checklist actionnable en 3 étapes.',
    openGraph: {
        title: 'Facturation électronique 2026 : ce que tu dois vraiment faire avant septembre',
        description: 'Septembre 2026, c\'est dans 4 mois. Voici ce que tu dois faire concrètement pour être en conformité — et éviter les amendes.',
        type: 'article',
        publishedTime: '2026-05-12T09:00:00Z'
    }
}

export default function ArticlePage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <article className="max-w-4xl mx-auto px-6 py-24">
                {/* Retour */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-secondary hover:text-accent-primary transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux articles
                </Link>

                {/* En-tête */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                            Réglementation
                        </span>
                        <span className="text-sm text-tertiary flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            12 mai 2026
                        </span>
                        <span className="text-sm text-tertiary flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            6 min de lecture
                        </span>
                    </div>

                    {/* Signature auteur */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <Image
                            src="/images/Photo_profil.jpeg"
                            alt="Otmane Boulahia - Consultant Finance & DAF Externalisé"
                            width={64}
                            height={64}
                            className="rounded-full object-cover"
                        />
                        <div>
                            <p className="font-bold text-slate-900 text-lg">Par Otmane Boulahia</p>
                            <p className="text-sm text-slate-600">Consultant Finance & Data | DAF Externalisé</p>
                            <Link
                                href="https://www.linkedin.com/in/otmane-boulahia-553bb6363"
                                target="_blank"
                                className="text-sm text-accent-primary hover:text-accent-primary-hover inline-flex items-center gap-1 mt-1"
                            >
                                Voir mon profil LinkedIn →
                            </Link>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                        Facturation électronique 2026 : 65&nbsp;% des dirigeants de TPE ne savent pas encore ce qui les attend dans 4 mois
                    </h1>

                    <p className="text-xl text-secondary leading-relaxed">
                        À 4 mois de la première échéance, seulement 35&nbsp;% des dirigeants de TPE connaissent précisément le contenu de la réforme
                        <span className="text-tertiary text-sm ml-1">(sondage avril 2026, francenum.gouv.fr)</span>.
                        Les 65&nbsp;% restants ont <em>entendu parler</em> de la facturation électronique — mais ils confondent les dates, sous-estiment la première obligation,
                        et risquent concrètement d&apos;être bloqués dès le 1er septembre.
                    </p>
                </header>

                {/* Alerte urgence */}
                <div className="surface rounded-xl p-6 border-l-4 border-orange-500 mb-12 flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <p className="text-secondary leading-relaxed">
                        <strong className="text-primary">1er septembre 2026, c&apos;est dans 112 jours.</strong>{' '}
                        Si tu n&apos;as pas encore choisi et paramétré une plateforme agréée, tu es en retard. Cet article te donne ce que tu dois faire, dans l&apos;ordre.
                    </p>
                </div>

                <div className="prose prose-lg max-w-none">

                    {/* Section 1 — Calendrier */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
                        Le calendrier exact : deux dates, deux obligations bien différentes
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-6 mb-8 not-prose">
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">1er septembre 2026</p>
                            <p className="text-lg font-bold text-slate-900 mb-2">Obligation de RÉCEPTION</p>
                            <p className="text-sm text-slate-600">
                                Toutes les entreprises assujetties à la TVA — sans exception de taille — doivent pouvoir <strong>recevoir</strong> des factures électroniques au format structuré.
                            </p>
                            <p className="text-xs text-slate-400 mt-3">Source : economie.gouv.fr, impots.gouv.fr, service-public.fr</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">1er septembre 2027</p>
                            <p className="text-lg font-bold text-slate-900 mb-2">Obligation d&apos;ÉMISSION</p>
                            <p className="text-sm text-slate-600">
                                Les TPE et PME devront <strong>émettre</strong> leurs factures au format électronique via une plateforme agréée par la DGFiP.
                            </p>
                            <p className="text-xs text-slate-400 mt-3">Source : economie.gouv.fr, impots.gouv.fr, service-public.fr</p>
                        </div>
                    </div>

                    <p>
                        Retiens ces deux dates. Elles correspondent à deux actions différentes, et confondre les deux peut te coûter cher.
                    </p>

                    {/* Section 2 — Le piège */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
                        Le piège que personne ne voit — et qui te concerne dès septembre 2026
                    </h2>

                    <p>
                        Voilà le scénario type : tu es dirigeant d&apos;une SASU de conseil ou de commerce, tu as retenu que <em>&ldquo;la facturation électronique devient obligatoire en 2027&rdquo;</em>.
                        Tu te dis que tu as encore le temps. Tu notes ça dans un coin de ta tête pour t&apos;en occuper l&apos;été prochain.
                    </p>

                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg my-6">
                        <p className="font-bold text-red-900 mb-2">C&apos;est faux. Et c&apos;est là que le piège se referme.</p>
                        <p className="text-red-800">
                            L&apos;obligation de <strong>réception</strong> s&apos;applique en septembre 2026, pour tout le monde.
                            Ça ne veut pas dire que tu dois juste &ldquo;être au courant&rdquo;. Ça veut dire que tu dois avoir <strong>choisi et paramétré une plateforme agréée</strong> avant
                            cette date pour être techniquement capable de recevoir des factures au bon format.
                        </p>
                    </div>

                    <p>
                        Si un de tes fournisseurs t&apos;envoie une facture via la plateforme publique (Chorus Pro) ou via une plateforme privée agréée,
                        et que tu n&apos;es pas raccordé, la facture n&apos;arrive pas — ou arrive dans un format que tu ne peux pas traiter.
                        <strong> Résultat : un paiement bloqué, une relation fournisseur dégradée, un retard comptable.</strong>
                    </p>

                    <p>Choisir une plateforme, créer son compte, paramétrer ses préférences de réception : ça prend du temps. Août 2026, c&apos;est trop tard.</p>

                    {/* Section 3 — Fin du PDF */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
                        Ce que ça change concrètement : la fin du PDF par email
                    </h2>

                    <p>
                        Si aujourd&apos;hui tu envoies tes factures en PDF joint à un email, c&apos;est cette pratique-là qui devient non conforme.
                        La réforme impose des <strong>formats structurés lisibles par les machines</strong>, pas uniquement par les humains.
                    </p>

                    <div className="not-prose grid sm:grid-cols-3 gap-4 my-6">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-green-700" />
                                <p className="font-bold text-green-900 text-sm">Factur-X ✅ Recommandé</p>
                            </div>
                            <p className="text-xs text-slate-600">Format hybride PDF + données XML. Ton client le lit comme un PDF, son logiciel l&apos;intègre automatiquement. Le meilleur choix pour les TPE/PME.</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <p className="font-bold text-slate-700 text-sm mb-2">UBL</p>
                            <p className="text-xs text-slate-500">Format XML pur. Courant dans les systèmes EDI déjà en place.</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <p className="font-bold text-slate-700 text-sm mb-2">CII</p>
                            <p className="text-xs text-slate-500">Autre format XML. Fréquent dans les échanges inter-entreprises européens.</p>
                        </div>
                    </div>

                    <p>
                        Pour une TPE ou PME française, <strong>Factur-X est le point de départ logique</strong> : compatibilité maximale, adoption plus douce, pris en charge par la plupart des logiciels sérieux.
                        Toutes les factures devront transiter par une <strong>plateforme de dématérialisation partenaire (PDP)</strong> agréée par la DGFiP, ou par la plateforme publique Chorus Pro.
                    </p>

                    {/* Section 4 — Sanctions */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
                        Les sanctions si tu ne fais rien
                    </h2>

                    <p>Ce ne sont pas des menaces vagues. Les montants sont fixés dans le texte de loi :</p>

                    <div className="not-prose space-y-4 my-6">
                        <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-200 rounded-xl">
                            <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-900">15&nbsp;€ par facture non conforme</p>
                                <p className="text-sm text-red-700">Plafonnée à <strong>15&nbsp;000&nbsp;€ par an</strong>. Pour une entreprise émettant 100 factures/mois, le plafond est atteint en quelques semaines. <span className="text-red-400 text-xs">(Source : entrepreneur.lcl.fr)</span></p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-200 rounded-xl">
                            <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-900">250&nbsp;€ par manquement à l&apos;e-reporting</p>
                                <p className="text-sm text-red-700">Même plafond de 15&nbsp;000&nbsp;€ par an. <span className="text-red-400 text-xs">(Source : entrepreneur.lcl.fr)</span></p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-5 bg-orange-50 border border-orange-200 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-orange-900">Facture rejetée = paiement potentiellement bloqué</p>
                                <p className="text-sm text-orange-700">Le risque le plus immédiat pour ta trésorerie.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 5 — Checklist */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
                        Checklist actionnable : 3 étapes à faire cette semaine (45 min max)
                    </h2>

                    <p>Tu n&apos;as pas besoin d&apos;être expert-comptable pour faire ça. Voici les trois actions concrètes à enclencher maintenant.</p>

                    <div className="not-prose space-y-6 my-6">
                        <div className="flex items-start gap-5 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-accent-primary text-white font-bold flex items-center justify-center flex-shrink-0 text-lg">1</div>
                            <div>
                                <p className="font-bold text-slate-900 text-base mb-1">Consulte la liste officielle des plateformes agréées</p>
                                <p className="text-sm text-slate-600 mb-3">
                                    Rends-toi sur <strong>impots.gouv.fr</strong> → section <em>&ldquo;Je passe à la facturation électronique&rdquo;</em> → <em>&ldquo;Je consulte la liste des plateformes agréées&rdquo;</em>.
                                </p>
                                <Link
                                    href="https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees"
                                    target="_blank"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-accent-primary text-accent-primary font-medium text-sm rounded-lg hover:bg-accent-primary hover:text-white transition-colors"
                                >
                                    Voir la liste des plateformes agréées →
                                </Link>
                                <p className="text-xs text-slate-400 mt-3">Prends 10 minutes pour comparer 2 ou 3 plateformes selon ton secteur et ton volume de facturation. Certaines sont gratuites pour les petits volumes.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-accent-primary text-white font-bold flex items-center justify-center flex-shrink-0 text-lg">2</div>
                            <div>
                                <p className="font-bold text-slate-900 text-base mb-1">Si tu utilises Pennylane, Qonto ou Sage — vérifie ton inscription</p>
                                <p className="text-sm text-slate-600">
                                    Ces trois outils sont officiellement immatriculés comme <strong>plateformes de dématérialisation partenaires (PDP)</strong> par la DGFiP.
                                    Si tu es déjà client, tu n&apos;as pas forcément à changer de logiciel — mais tu dois vérifier que tu es bien inscrit sur leur
                                    <strong> module &ldquo;plateforme agréée&rdquo;</strong>, distinct de l&apos;abonnement de base.
                                </p>
                                <p className="text-xs text-slate-400 mt-3">Connecte-toi à ton espace, cherche la section facturation électronique / e-invoicing, et confirme ton activation. En cas de doute, contacte leur support.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-accent-primary text-white font-bold flex items-center justify-center flex-shrink-0 text-lg">3</div>
                            <div>
                                <p className="font-bold text-slate-900 text-base mb-1">Vérifie que ton logiciel gère le format Factur-X</p>
                                <p className="text-sm text-slate-600">
                                    Va dans les paramètres de ton logiciel de facturation → formats d&apos;export → Factur-X ou XML structuré.
                                    Si cette option n&apos;existe pas, <strong>commence la migration maintenant</strong>.
                                </p>
                                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <p className="text-xs text-orange-800">
                                        <strong>⚠️ Pas en juillet. Pas en août.</strong> Migrer un logiciel de facturation implique de repenser tes modèles, former ton équipe, et tester les flux avec clients et fournisseurs. Ça prend plusieurs semaines dans le meilleur des cas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conclusion */}
                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
                        Pour aller plus loin : l&apos;autonomie financière, ça commence par anticiper
                    </h2>

                    <p>
                        La facturation électronique n&apos;est pas une contrainte isolée. C&apos;est un signal parmi d&apos;autres : la gestion financière d&apos;une TPE/PME devient de plus en plus réglementée, de plus en plus numérique, et de plus en plus exigeante en matière de données structurées.
                    </p>

                    <p>
                        Les dirigeants qui s&apos;en sortent le mieux ne sont pas ceux qui ont le meilleur expert-comptable —
                        ce sont ceux qui <strong>comprennent leur propre situation financière</strong> et anticipent ces évolutions sans attendre qu&apos;un intermédiaire les prévienne.
                    </p>

                    <div className="bg-slate-900 rounded-xl p-6 my-8">
                        <p className="text-white text-lg font-medium leading-relaxed">
                            &ldquo; Anticiper ce type de réforme fait partie du pilotage financier autonome. Ce n&apos;est pas une urgence de dernière minute — c&apos;est une case à cocher dans ton tableau de bord. &rdquo;
                        </p>
                    </div>

                    <p className="text-xs text-slate-400">
                        Sources : francenum.gouv.fr (sondage avril 2026), economie.gouv.fr, impots.gouv.fr, service-public.fr, entrepreneur.lcl.fr
                    </p>

                </div>

                {/* CTA bas d'article */}
                <div className="mt-16 p-8 bg-slate-900 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">
                        Pilote ta conformité comme tu pilotes ta trésorerie
                    </h3>
                    <p className="text-slate-300 mb-6">
                        FinSight aide les dirigeants à lire leur situation financière en temps réel et à anticiper les obligations — sans dépendre d&apos;un intermédiaire.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/mon-diagnostic"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-colors"
                        >
                            Lancer mon diagnostic
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/consulting"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                        >
                            Parler à un DAF externalisé
                        </Link>
                    </div>
                </div>

            </article>

            <Footer />
        </div>
    )
}

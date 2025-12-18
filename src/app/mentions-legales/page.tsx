import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
    title: 'Mentions légales - FinSight',
    description: 'Mentions légales et informations juridiques de FinSight'
}

export default function MentionsLegales() {
    return (
        <div className="min-h-screen bg-primary">
            <Header />

            <main className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-primary mb-4">
                        Mentions légales
                    </h1>
                    <p className="text-sm text-secondary mb-8">
                        Dernière mise à jour : 10 décembre 2025
                    </p>

                    <div className="prose prose-lg max-w-none">
                        {/* Éditeur du site */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Éditeur du site</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Le site <strong>FinSight</strong> (accessible à l'adresse finsight.zineinsight.com) est édité par :
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <p className="text-gray-900 font-bold text-lg mb-3">ZINEINSIGHTS</p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Forme juridique :</strong> SASU (Société par Actions Simplifiée Unipersonnelle)
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Représentant légal :</strong> Otmane Boulahia, Président
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Capital social :</strong> 1 000,00 €
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>SIREN :</strong> 990 447 294
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>SIRET (siège) :</strong> 990 447 294 00010
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>RCS :</strong> Paris 990 447 294
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>TVA intracommunautaire :</strong> FR64990447294
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Code APE :</strong> 70.22Z (Conseil pour les affaires et autres conseils de gestion)
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Siège social :</strong> 60 rue François 1er, 75008 Paris, France
                                </p>
                                <p className="text-gray-600">
                                    <strong>Email :</strong> contact@zineinsight.com
                                </p>
                            </div>
                        </section>

                        {/* Directeur de publication */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Directeur de publication</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Le directeur de la publication du site est <strong>Otmane Boulahia</strong>,
                                en qualité de Président de ZINEINSIGHTS.
                            </p>
                        </section>

                        {/* Hébergement */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Hébergement</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Le site FinSight est hébergé par :
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <p className="text-gray-900 font-medium mb-2">Vercel Inc.</p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">vercel.com</a>
                                </p>
                            </div>
                        </section>

                        {/* Propriété intellectuelle */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, code source)
                                est la propriété exclusive de ZineInsight, sauf mention contraire.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Toute reproduction, distribution, modification, adaptation, retransmission ou publication,
                                même partielle, de ces différents éléments est strictement interdite sans l'accord exprès
                                par écrit de ZineInsight.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                La marque <strong>FinSight</strong> ainsi que les logos associés sont des marques déposées
                                ou en cours de dépôt par ZineInsight. Toute utilisation non autorisée de ces marques
                                constituerait une contrefaçon sanctionnée par les articles L.713-2 et suivants du Code de
                                la propriété intellectuelle.
                            </p>
                        </section>

                        {/* Données personnelles */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Données personnelles</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Les informations concernant la collecte et le traitement de vos données personnelles
                                sont détaillées dans notre <a href="/politique-confidentialite" className="text-accent-primary hover:underline">Politique de confidentialité</a>.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit
                                d'accès, de rectification, de suppression et de portabilité de vos données personnelles,
                                ainsi que d'un droit d'opposition et de limitation du traitement.
                                Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@zineinsight.com" className="text-accent-primary hover:underline">contact@zineinsight.com</a>
                            </p>
                        </section>

                        {/* Cookies */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Le site FinSight utilise des cookies pour améliorer votre expérience de navigation et
                                analyser l'utilisation du site. Pour plus d'informations sur les cookies utilisés et
                                la manière de les gérer, consultez notre <a href="/cookies" className="text-accent-primary hover:underline">Politique de cookies</a>.
                            </p>
                        </section>

                        {/* Limitation de responsabilité */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation de responsabilité</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                ZineInsight s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées
                                sur le site FinSight, dont elle se réserve le droit de corriger le contenu à tout moment
                                et sans préavis.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Toutefois, ZineInsight ne peut garantir l'exactitude, la précision ou l'exhaustivité des
                                informations mises à disposition sur ce site. En conséquence, ZineInsight décline toute
                                responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations
                                disponibles sur le site.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                FinSight est un outil d'aide à la décision financière. Les analyses, recommandations et
                                prédictions fournies par l'outil ne constituent pas des conseils financiers professionnels.
                                L'utilisateur reste seul responsable de ses décisions de gestion et stratégiques.
                            </p>
                        </section>

                        {/* Liens hypertextes */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Liens hypertextes</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Le site FinSight peut contenir des liens hypertextes vers d'autres sites internet.
                                ZineInsight n'exerce aucun contrôle sur ces sites tiers et décline toute responsabilité
                                quant à leur contenu, leur fonctionnement ou leur politique de confidentialité.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Tout lien hypertexte pointant vers le site FinSight doit faire l'objet d'une autorisation
                                préalable de ZineInsight. Pour toute demande, contactez-nous à :
                                <a href="mailto:contact@zineinsight.com" className="text-accent-primary hover:underline ml-1">contact@zineinsight.com</a>
                            </p>
                        </section>

                        {/* Droit applicable */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Droit applicable et juridiction compétente</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Les présentes mentions légales sont régies par le droit français.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                En cas de litige et à défaut d'accord amiable, le litige sera porté devant les
                                tribunaux français compétents conformément aux règles de droit commun.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Pour toute question concernant les présentes mentions légales ou le site FinSight,
                                vous pouvez nous contacter :
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <p className="text-gray-600 mb-2">
                                    <strong>Par email :</strong> <a href="mailto:contact@zineinsight.com" className="text-accent-primary hover:underline">contact@zineinsight.com</a>
                                </p>
                                <p className="text-gray-600">
                                    <strong>Via Calendly :</strong> <a href="https://calendly.com/zineinsight" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">Prendre rendez-vous</a>
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

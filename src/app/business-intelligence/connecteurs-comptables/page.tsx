'use client'

import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ConnecteursComptablesPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Header />

            {/* ─── HERO ─── */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(49,130,206,0.15),_transparent_60%)]" />
                <div className="relative max-w-[840px] mx-auto px-6 pt-28 pb-16 lg:pt-36 lg:pb-20">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-300 border border-blue-400/40 px-3 py-1.5 rounded-sm mb-6">
                        Power BI &amp; Comptabilite
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-white mb-3">
                        Connecteurs comptables<br />Sage, Cegid, EBP, FEC
                    </h1>
                    <p className="text-[0.95rem] text-blue-200/90 mb-2">
                        Import direct &mdash; Nettoyage a la source &mdash; Mise a jour automatisee
                    </p>
                    <p className="text-base text-gray-300 max-w-[640px] leading-relaxed font-light mt-6">
                        Le premier obstacle de tout projet Power BI finance n&rsquo;est pas les formules DAX.<br />
                        <span className="font-medium text-white">C&rsquo;est d&rsquo;obtenir des donnees comptables propres dans le bon format.</span><br /><br />
                        Cette page documente la methode d&rsquo;import pour chaque logiciel de comptabilite
                        couramment utilise en PME : Sage 100, Cegid Y2, EBP Compta, et le FEC
                        comme source universelle de dernier recours.
                    </p>

                    {/* Metrics bar */}
                    <div className="mt-10 space-y-3">
                        <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/10 rounded overflow-hidden">
                            {[
                                { value: '4 sources', label: 'Logiciels couverts' },
                                { value: 'FEC', label: 'Format universel' },
                                { value: 'Power Query', label: 'Outil de connexion' },
                                { value: '< 1 jour', label: 'Mise en place type' },
                            ].map((m, i) => (
                                <div key={i} className={`text-center py-5 px-3 ${i < 3 ? 'border-r border-white/10' : ''} ${i < 2 ? 'border-b lg:border-b-0 border-white/10' : i === 2 ? 'border-b lg:border-b-0 border-white/10 lg:border-r' : ''}`}>
                                    <span className="block text-2xl font-bold text-white leading-none mb-1">{m.value}</span>
                                    <span className="text-[0.65rem] font-medium tracking-wider uppercase text-gray-400">{m.label}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[0.7rem] text-gray-400 text-center italic">
                            Methodes validees en conditions reelles sur missions 2024-2026
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── CONTEXTE ─── */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Pourquoi la connexion comptable est toujours le premier probleme
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Chaque logiciel comptable a sa propre logique d&rsquo;export. Sans methode adaptee,
                        le nettoyage prend plus de temps que la construction du dashboard.
                    </p>

                    <div className="grid md:grid-cols-2 gap-5 mb-8">
                        {[
                            {
                                titre: 'Les exports bruts sont rarement exploitables directement',
                                desc: 'Comptes generaux en texte libre, libelles non normalises, dates au format DD/MM/YYYY non reconnu, colonnes fusionnees. Power BI requiert un format tabulaire propre.',
                            },
                            {
                                titre: 'Chaque logiciel a ses conventions de plan comptable',
                                desc: 'Sage 100 genere des journaux avec des colonnes differentes de Cegid. EBP numerote les comptes autrement. Impossible d\'utiliser le meme fichier Power Query sur deux sources.',
                            },
                            {
                                titre: 'La mise a jour mensuelle doit etre automatique',
                                desc: 'Si le DAF doit re-exporter, re-nettoyer, et re-importer chaque mois, le reporting n\'est pas autonome. L\'objectif : un clic, donnees a jour.',
                            },
                            {
                                titre: 'Le FEC est une securite, pas une solution principale',
                                desc: 'Le Fichier des Ecritures Comptables est normalise par la DGFiP et produit par tous les logiciels. Utile pour des projets ponctuels, mais pas optimal pour du reporting mensuel automatise.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded p-5">
                                <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">{item.titre}</h3>
                                <p className="text-[0.8rem] text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 bg-slate-900 text-white rounded">
                        <p className="text-[0.88rem] leading-relaxed">
                            <span className="font-semibold">La regle d&rsquo;or :</span> le travail de nettoyage se fait une seule fois,
                            dans Power Query, et s&rsquo;applique automatiquement a chaque actualisation.
                            Jamais de modification manuelle sur les donnees sources.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── SAGE 100 ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-600 border border-blue-200 px-3 py-1 rounded-sm mb-4">
                        Logiciel 01
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Sage 100 Comptabilite
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        La solution la plus repandue en PME francaise. Deux methodes d&rsquo;import
                        selon la version et les droits d&rsquo;acces disponibles.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-blue-700 mb-2">
                                Methode recommandee : connecteur ODBC natif
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                Sage 100 expose sa base de donnees via ODBC (Open Database Connectivity).
                                Power BI se connecte directement, sans export intermediaire. La mise a jour
                                est instantanee et la connexion survit aux clotures mensuelles.
                                Requiert un acces reseau a la base Sage et un driver ODBC Sage installe.
                            </p>
                        </div>

                        <div className="border-l-2 border-blue-400 pl-5 bg-gray-950 rounded-r py-4 pr-5 overflow-x-auto">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`-- Etapes dans Power BI Desktop :
1. Obtenir des données > Base de données ODBC
2. DSN : "Sage100_VOTRE_DOSSIER" (configuré au préalable)
3. Tables utiles :
   - F_ECRITUREC   → écritures comptables (journal, compte, débit, crédit)
   - F_COMPTEG     → plan comptable général
   - F_JOURNAL     → liste des journaux
   - F_PIECE       → pièces comptables avec libellés

-- Requête Power Query type pour F_ECRITUREC :
let
    Source = Odbc.DataSource("DSN=Sage100_MON_DOSSIER"),
    Ecritures = Source{[Name="F_ECRITUREC"]}[Data],
    Filtre = Table.SelectRows(Ecritures,
        each [EC_Date] >= #date(2024, 1, 1)),
    TypesCorriges = Table.TransformColumnTypes(Filtre, {
        {"EC_Date", type date},
        {"EC_Montant", type number}
    })
in
    TypesCorriges`}</pre>
                        </div>

                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Methode alternative : export CSV depuis Sage
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Sage 100 > Traitements > Export de donnees > Ecritures comptables',
                                    'Format : CSV separateur point-virgule, encodage ANSI (attention : pas UTF-8)',
                                    'Colonnes a conserver : Date, Journal, Compte, Libelle, Debit, Credit, Piece',
                                    'Power Query : changer encodage en 1252 (Windows ANSI) pour eviter les caracteres mal decodes',
                                    'Dossier de depot fixe + actualisation planifiee via Power BI Service ou passerelle locale',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['-'] before:absolute before:left-0 before:text-gray-300">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Pieges courants
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Encodage ANSI vs UTF-8 (accents corrompus), colonnes Debit/Credit en
                                texte au lieu de nombre (espaces invisibles), comptes de classe 8 et 9
                                presents dans l&rsquo;export mais inutiles pour le reporting financier standard.
                                Filtrer sur les classes 6 et 7 en priorite.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CEGID ─── */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-amber-600 border border-amber-200 px-3 py-1 rounded-sm mb-4">
                        Logiciel 02
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Cegid Y2 / Cegid Loop
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Cible ETI et cabinets. Cegid Y2 (on-premise) et Cegid Loop (cloud) ont
                        des methodes d&rsquo;export differentes mais des structures de donnees proches.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-amber-700 mb-2">
                                Methode recommandee : export parametrable Cegid
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                Cegid Y2 propose un module &ldquo;Export parametrable&rdquo; (menu Outils) qui genere
                                des fichiers CSV structures avec selection des colonnes. C&rsquo;est la methode la
                                plus propre : colonnes nommees, format de date coherent, montants en virgule
                                decimale. Pour Cegid Loop, l&rsquo;API REST est disponible si l&rsquo;abonnement
                                l&rsquo;inclut (connector Power BI natif en beta).
                            </p>
                        </div>

                        <div className="border-l-2 border-amber-400 pl-5 bg-gray-950 rounded-r py-4 pr-5 overflow-x-auto">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`-- Structure type d'un export Cegid Y2 (ecritures) :
Colonnes attendues :
  JournalCode | JournalLib | EcritureNum | EcritureDate
  CompteNum   | CompteLib  | Debit       | Credit
  PieceRef    | PieceDate  | EcritureLib | ValidDate

-- Power Query : nettoyage minimal
let
    Source = Csv.Document(
        File.Contents("C:\Exports\cegid_ecritures.csv"),
        [Delimiter=";", Encoding=65001, QuoteStyle=QuoteStyle.None]
    ),
    EnTetes = Table.PromoteHeaders(Source),
    TypesOk = Table.TransformColumnTypes(EnTetes, {
        {"EcritureDate", type date},
        {"Debit", type number},
        {"Credit", type number}
    }),
    -- Colonne montant net (Debit - Credit)
    MontantNet = Table.AddColumn(TypesOk, "MontantNet",
        each [Debit] - [Credit], type number)
in
    MontantNet`}</pre>
                        </div>

                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Specificites Cegid a connaitre
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Les ecritures d\'à-nouveau (journal AN) doivent etre incluses pour un bilan correct',
                                    'Cegid exporte Debit et Credit dans deux colonnes separees : creer une colonne MontantNet = Debit - Credit',
                                    'Le code journal "OD" (operations diverses) contient souvent les retraitements de cloture',
                                    'Pour Cegid Loop : le connecteur API retourne du JSON — utiliser Power Query JSON.Document()',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['-'] before:absolute before:left-0 before:text-gray-300">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Pieges courants
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Les montants negatifs en comptabilite francaise peuvent etre encodes comme
                                des Debits negatifs (au lieu de Credits). Verifier systematiquement
                                le signe des ecritures d&rsquo;avoir sur les comptes de produits (classe 7)
                                avant de construire les KPI.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── EBP ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-purple-600 border border-purple-200 px-3 py-1 rounded-sm mb-4">
                        Logiciel 03
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        EBP Compta
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Solution TPE/PME avec des exports relativement simples, mais des formats
                        variables selon la version (EBP Pro, EBP Compta Open Line, EBP en ligne).
                    </p>

                    <div className="space-y-6">
                        <div className="bg-purple-50 border border-purple-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-purple-700 mb-2">
                                Methode recommandee : export grand livre EBP
                            </h3>
                            <p className="text-[0.85rem] text-gray-700 leading-relaxed">
                                EBP Compta permet d&rsquo;exporter le grand livre au format Excel ou CSV depuis
                                Impressions &gt; Grand livre. Privilegier l&rsquo;export Excel (.xlsx) : les dates
                                sont en format numerique natif, evitant les problemes de parsing.
                                Pour EBP en ligne, le menu &ldquo;Export comptable&rdquo; genere directement un FEC.
                            </p>
                        </div>

                        <div className="border-l-2 border-purple-400 pl-5 bg-gray-950 rounded-r py-4 pr-5 overflow-x-auto">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`-- Etapes Power Query pour export EBP Excel :
1. Obtenir des données > Classeur Excel
2. Selectionner la feuille "Grand Livre" ou "Ecritures"

-- Nettoyage type EBP :
let
    Source = Excel.Workbook(
        File.Contents("C:\Exports\ebp_grand_livre.xlsx"),
        null, true
    ),
    Feuille = Source{[Item="Feuil1"]}[Data],
    EnTetes = Table.PromoteHeaders(Feuille),
    -- EBP inclut souvent des lignes de sous-total : les supprimer
    SansTotal = Table.SelectRows(EnTetes,
        each [Compte] <> null and
             not Text.StartsWith(Text.From([Compte]), "TOTAL")),
    TypesOk = Table.TransformColumnTypes(SansTotal, {
        {"Date", type date},
        {"Debit", type number},
        {"Credit", type number}
    })
in
    TypesOk`}</pre>
                        </div>

                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Specificites EBP a connaitre
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Les exports incluent des lignes de sous-total intercalees : les filtrer avec Table.SelectRows',
                                    'Les comptes EBP utilisent parfois des points comme separateurs (411.DUPONT) : normaliser avec Text.BeforeDelimiter',
                                    'EBP Compta Open Line stocke en base SQL Server accessible via ODBC si acces reseau disponible',
                                    'EBP en ligne genere un FEC standard : traiter comme documente en section suivante',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['-'] before:absolute before:left-0 before:text-gray-300">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Pieges courants
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                EBP exporte parfois les montants avec une virgule comme separateur decimal
                                et un espace comme separateur de milliers (ex : &ldquo;1 234,56&rdquo;). Power Query
                                interprete cela comme du texte. Utiliser Number.FromText apres
                                Text.Replace pour corriger les espaces.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FEC ─── */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-emerald-600 border border-emerald-200 px-3 py-1 rounded-sm mb-4">
                        Format universel
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        FEC &mdash; Fichier des Ecritures Comptables
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Le format normalise par la DGFiP (article L.47 A du LPF). Produit par
                        tous les logiciels comptables conformes. Structure identique quelle que
                        soit la source : le connecteur Power Query s&rsquo;ecrit une seule fois.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-emerald-50 border border-emerald-100 rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-emerald-700 mb-3">
                                Structure du FEC (18 colonnes obligatoires)
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {[
                                    'JournalCode', 'JournalLib', 'EcritureNum',
                                    'EcritureDate', 'CompteNum', 'CompteLib',
                                    'CompAuxNum', 'CompAuxLib', 'PieceRef',
                                    'PieceDate', 'EcritureLib', 'Debit',
                                    'Credit', 'EcritureLet', 'DateLet',
                                    'ValidDate', 'Montantdevise', 'Idevise',
                                ].map((col, i) => (
                                    <span key={i} className="text-[0.72rem] font-mono bg-white border border-emerald-200 px-2 py-1 rounded text-gray-700">
                                        {col}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="border-l-2 border-emerald-400 pl-5 bg-gray-950 rounded-r py-4 pr-5 overflow-x-auto">
                            <pre className="text-[0.8rem] text-green-300 leading-relaxed font-mono whitespace-pre">{`-- Connecteur FEC universel (fonctionne sur Sage, Cegid, EBP, QuadraCompta...)
ImportFEC = (cheminFichier as text) =>
let
    -- Le FEC est en UTF-8 avec separateur tabulation (|) selon norme DGFiP
    Source = Csv.Document(
        File.Contents(cheminFichier),
        [Delimiter="|", Encoding=65001, QuoteStyle=QuoteStyle.None]
    ),
    EnTetes = Table.PromoteHeaders(Source),
    TypesOk = Table.TransformColumnTypes(EnTetes, {
        {"EcritureDate", type date},
        {"PieceDate",    type date},
        {"ValidDate",    type date},
        {"Debit",        type number},
        {"Credit",       type number}
    }),
    -- Colonne montant net (convention : produits en Credit, charges en Debit)
    AvecMontantNet = Table.AddColumn(TypesOk, "MontantNet",
        each [Debit] - [Credit], type number),
    -- Classe comptable pour filtrage rapide
    AvecClasse = Table.AddColumn(AvecMontantNet, "ClasseCompte",
        each Number.IntegerDivide(Number.FromText(
            Text.Start([CompteNum], 1)), 1), Int64.Type)
in
    AvecClasse`}</pre>
                        </div>

                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Comment generer le FEC depuis chaque logiciel
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-[0.82rem] border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="text-left px-4 py-2.5 font-semibold text-[0.75rem] uppercase tracking-wider text-gray-500 border-b border-gray-200">Logiciel</th>
                                            <th className="text-left px-4 py-2.5 font-semibold text-[0.75rem] uppercase tracking-wider text-gray-500 border-b border-gray-200">Chemin menu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { logiciel: 'Sage 100', chemin: 'Traitements > Export comptable > FEC' },
                                            { logiciel: 'Cegid Y2', chemin: 'Outils > Export parametrable > Format FEC' },
                                            { logiciel: 'Cegid Loop', chemin: 'Parametres > Export > Fichier FEC' },
                                            { logiciel: 'EBP Compta', chemin: 'Impressions > Export comptable > FEC' },
                                            { logiciel: 'EBP en ligne', chemin: 'Exercices > Telechargement > FEC' },
                                            { logiciel: 'QuadraCompta', chemin: 'Traitements > Editions > Generation FEC' },
                                        ].map((row, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-4 py-2.5 font-medium text-gray-900 border-b border-gray-100">{row.logiciel}</td>
                                                <td className="px-4 py-2.5 font-mono text-[0.78rem] text-gray-600 border-b border-gray-100">{row.chemin}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Limites du FEC pour le reporting mensuel
                            </h3>
                            <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                                Le FEC couvre un exercice complet et se genere generalement a la cloture
                                ou sur demande. Il n&rsquo;est pas concu pour une mise a jour hebdomadaire
                                ou mensuelle automatique. Pour du reporting en temps reel, privilegier
                                le connecteur ODBC (Sage, EBP Open Line) ou l&rsquo;API (Cegid Loop).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── RECAP TABLE ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Comparatif des methodes par logiciel
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        Methode optimale, format de sortie, mise a jour et complexite de mise en place.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-[0.82rem] border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">Logiciel</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">Methode optimale</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">MAJ auto</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wider">Mise en place</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { logiciel: 'Sage 100', methode: 'ODBC natif', maj: 'Oui', duree: '2-4h' },
                                    { logiciel: 'Cegid Y2', methode: 'Export CSV parametrable', maj: 'Partielle', duree: '1-2h' },
                                    { logiciel: 'Cegid Loop', methode: 'API REST', maj: 'Oui', duree: '4-8h' },
                                    { logiciel: 'EBP Compta', methode: 'Export Excel grand livre', maj: 'Manuelle', duree: '1-2h' },
                                    { logiciel: 'EBP Open Line', methode: 'ODBC SQL Server', maj: 'Oui', duree: '2-4h' },
                                    { logiciel: 'Tout logiciel', methode: 'FEC (format DGFiP)', maj: 'Non', duree: '< 1h' },
                                ].map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-3 font-medium text-gray-900 border-b border-gray-100">{row.logiciel}</td>
                                        <td className="px-4 py-3 font-mono text-[0.8rem] text-blue-700 border-b border-gray-100">{row.methode}</td>
                                        <td className="px-4 py-3 border-b border-gray-100">
                                            <span className={`text-[0.72rem] font-semibold px-2 py-0.5 rounded ${row.maj === 'Oui' ? 'bg-green-100 text-green-700' : row.maj === 'Partielle' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                {row.maj}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{row.duree}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ─── POST-CONNEXION ─── */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Apres la connexion : trois etapes avant les formules DAX
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 max-w-[640px]">
                        La connexion etablie, le travail de structuration commence. Sans ces etapes,
                        les formules DAX produiront des resultats incorrects.
                    </p>

                    <div className="grid md:grid-cols-3 gap-5 mb-8">
                        {[
                            {
                                num: '01',
                                titre: 'Creer la table de dates',
                                desc: 'Une table Calendrier avec une ligne par jour, couvrant au moins 3 ans. Indispensable pour TOTALYTD, DATEADD, et toutes les comparaisons temporelles. Marquer comme "Table de dates" dans Power BI.',
                            },
                            {
                                num: '02',
                                titre: 'Structurer le plan comptable',
                                desc: 'Creer une table de correspondance CompteNum > Rubrique (ex : 706xxx > "Prestations de services") pour agréger les ecritures en KPI metier. Sans cette table, vous obtenez des listes de comptes, pas des ratios.',
                            },
                            {
                                num: '03',
                                titre: 'Valider la reconciliation',
                                desc: 'Calculer le Total Debit - Total Credit de l\'import. Ce montant doit etre nul (comptabilite en partie double). S\'il ne l\'est pas, des lignes ont ete perdues dans le nettoyage.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded p-5">
                                <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">{item.num}</div>
                                <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">{item.titre}</h3>
                                <p className="text-[0.78rem] text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 bg-slate-900 text-white rounded">
                        <p className="text-[0.88rem] leading-relaxed">
                            <span className="font-semibold">Le test de sante a faire en premier :</span>{' '}
                            <span className="font-mono text-green-300">SUM(Debit) - SUM(Credit) = 0</span>.
                            Si ce n&rsquo;est pas le cas, votre source de donnees contient des ecritures
                            orphelines ou le filtre de periode a coupe des contreparties.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6 text-center">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4">
                        Mise en oeuvre
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Connecter votre comptabilite a Power BI
                    </h2>
                    <p className="text-[0.9rem] text-gray-600 max-w-[520px] mx-auto mb-10 leading-relaxed">
                        La connexion est etablie. Les donnees sont propres. La prochaine etape :
                        construire les mesures DAX qui transforment ces ecritures en KPI financiers actionnables.
                    </p>

                    <div className="grid md:grid-cols-2 gap-5 mb-10 text-left">
                        <div className="bg-white border border-gray-200 rounded p-5">
                            <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">
                                Formules DAX pour la finance
                            </h3>
                            <p className="text-[0.78rem] text-gray-600 leading-relaxed mb-4">
                                CALCULATE, TOTALYTD, DATEADD, DIVIDE, VAR/RETURN :
                                les 5 patterns DAX pour produire marge filtree, DSO,
                                cumul YTD et comparatif N/N-1.
                            </p>
                            <Link
                                href="/business-intelligence/dax-financier"
                                className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                            >
                                Voir les formules DAX <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-5">
                            <h3 className="text-[0.9rem] font-semibold text-gray-900 mb-2">
                                Faire implementer le reporting complet
                            </h3>
                            <p className="text-[0.78rem] text-gray-600 leading-relaxed mb-4">
                                Mission de 3 semaines : connexion de vos sources comptables,
                                modelisation, formules DAX, dashboard livre avec formation.
                                Autonomie totale a l&rsquo;issue.
                            </p>
                            <Link
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                            >
                                Planifier un echange <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    <Link
                        href="https://calendly.com/zineinsight"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded text-[0.85rem] font-semibold hover:bg-slate-800 transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                        Discuter de votre source comptable
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

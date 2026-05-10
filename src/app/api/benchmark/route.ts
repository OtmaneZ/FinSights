import { NextResponse } from 'next/server'

/** URL du backend FastAPI - définie via variable d'environnement Railway */
const BACKEND_URL = process.env.BACKEND_URL

/**
 * GET /api/benchmark - liste les secteurs disponibles.
 *
 * Stratégie :
 *  1. Appel au backend FastAPI GET /api/v1/benchmark/sectors (source de vérité)
 *  2. Si le backend est injoignable → fallback sur FIBEN_SECTORS_FALLBACK
 *
 * La page /debug-view n'utilise PAS cette route - elle appelle RAILWAY_API directement.
 * Cette route est utilisée uniquement par la page standalone /benchmark.
 */
export async function GET() {
  // Tentative backend
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/benchmark/sectors`, {
        next: { revalidate: 3600 }, // cache 1h - les secteurs changent très rarement
      })
      if (res.ok) {
        const data = await res.json()
        const sectors = Array.isArray(data) ? data : []
        if (sectors.length > 0) {
          return NextResponse.json({ sectors })
        }
      }
    } catch { /* fallback ci-dessous */ }
  }

  // Fallback statique - dernière synchronisation avec EMBEDDED_DATA du backend
  // ⚠️ Mettre à jour ce fallback quand sector_benchmark.py change
  return NextResponse.json({ sectors: FIBEN_SECTORS_FALLBACK })
}

/** Fallback statique - 1 code NAF représentatif par division FIBEN (69 divisions) */
const FIBEN_SECTORS_FALLBACK = [
  { naf_code: '01.11Z', label: 'Culture de céréales', sample_size: 245 },
  { naf_code: '02.10Z', label: 'Sylviculture', sample_size: 328 },
  { naf_code: '03.11Z', label: 'Pêche en mer', sample_size: 189 },
  { naf_code: '08.11Z', label: 'Extraction de pierres ornementales', sample_size: 605 },
  { naf_code: '10.11Z', label: 'Transformation de viande de boucherie', sample_size: 299 },
  { naf_code: '11.01Z', label: 'Production de boissons alcooliques distillées', sample_size: 961 },
  { naf_code: '13.10Z', label: 'Préparation de fibres textiles et filature', sample_size: 668 },
  { naf_code: '14.13Z', label: 'Fabrication de vêtements de dessus', sample_size: 399 },
  { naf_code: '15.12Z', label: "Fabrication d'articles de voyage et de maroquinerie", sample_size: 235 },
  { naf_code: '16.10A', label: 'Sciage et rabotage du bois', sample_size: 470 },
  { naf_code: '17.12Z', label: 'Fabrication de papier et de carton', sample_size: 672 },
  { naf_code: '18.11Z', label: 'Imprimerie de journaux', sample_size: 907 },
  { naf_code: '20.11Z', label: 'Fabrication de gaz industriels', sample_size: 205 },
  { naf_code: '21.10Z', label: 'Fabrication de produits pharmaceutiques de base', sample_size: 264 },
  { naf_code: '22.11Z', label: 'Fabrication et rechapage de pneumatiques', sample_size: 790 },
  { naf_code: '23.11Z', label: 'Fabrication de verre plat', sample_size: 317 },
  { naf_code: '24.10Z', label: 'Sidérurgie', sample_size: 481 },
  { naf_code: '25.11Z', label: 'Fabrication de structures métalliques', sample_size: 689 },
  { naf_code: '26.11Z', label: 'Fabrication de composants électroniques', sample_size: 879 },
  { naf_code: '27.11Z', label: 'Fabrication de moteurs et transformateurs électriques', sample_size: 812 },
  { naf_code: '28.11Z', label: 'Fabrication de moteurs et turbines', sample_size: 151 },
  { naf_code: '29.10Z', label: 'Construction de véhicules automobiles', sample_size: 709 },
  { naf_code: '30.11Z', label: 'Construction de navires', sample_size: 249 },
  { naf_code: '31.01Z', label: 'Fabrication de meubles de bureau', sample_size: 585 },
  { naf_code: '32.12Z', label: "Fabrication d'articles de joaillerie", sample_size: 983 },
  { naf_code: '33.11Z', label: "Réparation d'ouvrages en métaux", sample_size: 103 },
  { naf_code: '35.11Z', label: "Production d'électricité", sample_size: 841 },
  { naf_code: '36.00Z', label: "Captage, traitement et distribution d'eau", sample_size: 123 },
  { naf_code: '37.00Z', label: 'Collecte et traitement des eaux usées', sample_size: 215 },
  { naf_code: '38.11Z', label: 'Collecte des déchets non dangereux', sample_size: 468 },
  { naf_code: '39.00Z', label: 'Dépollution et autres services de gestion des déchets', sample_size: 182 },
  { naf_code: '41.10A', label: 'Développement de projets résidentiels', sample_size: 458 },
  { naf_code: '42.11Z', label: 'Construction de routes et autoroutes', sample_size: 412 },
  { naf_code: '43.11Z', label: 'Travaux de démolition', sample_size: 681 },
  { naf_code: '45.11Z', label: 'Commerce de voitures et véhicules légers', sample_size: 533 },
  { naf_code: '46.11Z', label: 'Intermédiaires du commerce en matières premières agricoles', sample_size: 715 },
  { naf_code: '47.11B', label: "Commerce d'alimentation générale", sample_size: 689 },
  { naf_code: '49.10Z', label: 'Transport ferroviaire interurbain de voyageurs', sample_size: 374 },
  { naf_code: '52.10A', label: 'Entreposage et stockage frigorifique', sample_size: 966 },
  { naf_code: '55.10Z', label: 'Hôtels et hébergement similaire', sample_size: 428 },
  { naf_code: '56.10A', label: 'Restauration traditionnelle', sample_size: 768 },
  { naf_code: '58.11Z', label: 'Édition de livres', sample_size: 593 },
  { naf_code: '59.11A', label: 'Production de films pour la télévision', sample_size: 175 },
  { naf_code: '60.10Z', label: 'Édition et diffusion de programmes radio', sample_size: 112 },
  { naf_code: '61.10Z', label: 'Télécommunications filaires', sample_size: 475 },
  { naf_code: '62.01Z', label: 'Programmation informatique', sample_size: 498 },
  { naf_code: '63.11Z', label: 'Traitement de données, hébergement et activités connexes', sample_size: 688 },
  { naf_code: '68.10Z', label: 'Activités des marchands de biens immobiliers', sample_size: 340 },
  { naf_code: '69.10Z', label: 'Activités juridiques', sample_size: 91 },
  { naf_code: '70.10Z', label: 'Activités des sièges sociaux', sample_size: 843 },
  { naf_code: '71.11Z', label: "Activités d'architecture", sample_size: 484 },
  { naf_code: '72.11Z', label: 'Recherche-développement en biotechnologie', sample_size: 407 },
  { naf_code: '73.11Z', label: 'Activités des agences de publicité', sample_size: 421 },
  { naf_code: '74.10Z', label: 'Activités spécialisées de design', sample_size: 28 },
  { naf_code: '77.11A', label: 'Location courte durée de voitures', sample_size: 318 },
  { naf_code: '78.10Z', label: 'Activités des agences de placement', sample_size: 907 },
  { naf_code: '79.11Z', label: 'Activités des agences de voyage', sample_size: 899 },
  { naf_code: '80.10Z', label: 'Activités de sécurité privée', sample_size: 881 },
  { naf_code: '81.10Z', label: 'Activités de soutien aux bâtiments', sample_size: 943 },
  { naf_code: '85.10Z', label: 'Enseignement pré-primaire', sample_size: 492 },
  { naf_code: '86.10Z', label: 'Activités hospitalières', sample_size: 435 },
  { naf_code: '87.10A', label: 'Hébergement médicalisé pour personnes âgées', sample_size: 55 },
  { naf_code: '88.10A', label: 'Aide à domicile', sample_size: 555 },
  { naf_code: '90.01Z', label: 'Arts du spectacle vivant', sample_size: 602 },
  { naf_code: '91.01Z', label: 'Gestion des bibliothèques et archives', sample_size: 106 },
  { naf_code: '92.00Z', label: "Organisation de jeux de hasard et d'argent", sample_size: 214 },
  { naf_code: '93.11Z', label: "Gestion d'installations sportives", sample_size: 840 },
  { naf_code: '95.11Z', label: "Réparation d'ordinateurs", sample_size: 223 },
  { naf_code: '96.01A', label: 'Blanchisserie-teinturerie de gros', sample_size: 832 },
]

/** POST /api/benchmark - proxy vers le backend FastAPI */
export async function POST(request: Request) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: 'Variable BACKEND_URL non configurée sur ce déploiement.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const res = await fetch(`${BACKEND_URL}/api/v1/benchmark/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: res.status })
    }

    return NextResponse.json(await res.json())
  } catch (error) {
    console.error('Benchmark proxy error:', error)
    return NextResponse.json({ error: 'Erreur réseau vers le backend.' }, { status: 503 })
  }
}

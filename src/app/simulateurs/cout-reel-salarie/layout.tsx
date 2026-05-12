import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Simulateur Coût Réel d\'un Salarié 2026 — Charges Patronales Incluses | FinSight',
    description: 'Calculez en 30 secondes le vrai coût d\'un salarié pour votre entreprise : salaire brut, charges patronales, mutuelle. Curseur interactif, résultat immédiat.',
    keywords: 'simulateur coût salarié, charges patronales, coût employeur, salaire brut net, recrutement pme, coût embauche',
    openGraph: {
        title: 'Simulateur Coût Réel d\'un Salarié 2026 — Charges Patronales Incluses',
        description: 'Calculez en 30 secondes le vrai coût d\'un salarié : salaire brut, charges patronales, mutuelle.',
        type: 'website',
        url: 'https://finsight.zineinsight.com/simulateurs/cout-reel-salarie',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/simulateurs/cout-reel-salarie',
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

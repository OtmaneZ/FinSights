import { NextResponse } from 'next/server'
import { BDF_FIBEN_SOURCE_PREFIX, getSecteursSummary } from '@/lib/benchmarks/bdf-sectoriels'

export const dynamic = 'force-static'

/** GET /api/benchmarks/all — liste des 11 secteurs BDF FIBEN. */
export async function GET() {
    const secteurs = getSecteursSummary().map((s) => ({
        label_court: s.labelCourt,
        code_naf: s.codeNaf,
        mediane_q2: s.medianeQ2,
        nb_entreprises: s.nbEntreprises,
        source: s.sourceCitation,
    }))

    return NextResponse.json({
        source: BDF_FIBEN_SOURCE_PREFIX,
        count: secteurs.length,
        secteurs,
    })
}

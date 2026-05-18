import { NextRequest, NextResponse } from 'next/server'
import {
    buildBenchmarkSecteurFromLabel,
    buildBenchmarkSecteurFromResolution,
} from '@/lib/benchmarks/benchmarkSecteurResponse'
import { resolveNafToBenchmark } from '@/lib/benchmarks/nafResolver'

export const dynamic = 'force-dynamic'

/** GET /api/benchmarks/secteur?label=Transport | ?naf=56.10A */
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const label = searchParams.get('label')?.trim()
    const naf = searchParams.get('naf')?.trim()

    if (!label && !naf) {
        return NextResponse.json(
            { error: 'Paramètre requis : label ou naf' },
            { status: 400 },
        )
    }

    if (naf) {
        const resolution = resolveNafToBenchmark(naf)
        if (!resolution) {
            return NextResponse.json(
                { error: 'Code NAF invalide ou incomplet' },
                { status: 400 },
            )
        }
        return NextResponse.json(buildBenchmarkSecteurFromResolution(resolution))
    }

    const payload = buildBenchmarkSecteurFromLabel(label!)
    if (!payload) {
        return NextResponse.json(
            { error: `Secteur inconnu : ${label}` },
            { status: 404 },
        )
    }

    return NextResponse.json(payload)
}

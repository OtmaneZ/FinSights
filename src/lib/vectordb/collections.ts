/**
 * GESTION DES COLLECTIONS VECTORIELLES
 *
 * Store et search dans Pinecone pour :
 * - Conversations copilot (mémoire contextuelle)
 * - Transactions (détection similarités)
 * - Insights (éviter de régénérer)
 */

import { getPineconeClient, PINECONE_INDEX_NAME, NAMESPACES } from './pineconeClient';
import { generateEmbedding, prepareTextForEmbedding } from './embeddings';

export interface VectorMetadata {
    text: string;
    timestamp: number;
    userId?: string;
    companyName?: string;
    [key: string]: any;
}

export interface SearchResult {
    id: string;
    score: number;
    metadata: VectorMetadata;
}

/**
 * Stocke une conversation dans Pinecone
 */
export async function storeConversation(
    userId: string,
    companyName: string,
    message: string,
    response: string
): Promise<void> {
    try {
        const pinecone = await getPineconeClient();
        const index = pinecone.index(PINECONE_INDEX_NAME);

        // Combiner question + réponse pour l'embedding
        const fullText = `Question: ${message}\nRéponse: ${response}`;
        const preparedText = prepareTextForEmbedding(fullText);
        const embedding = await generateEmbedding(preparedText);

        const vectorId = `conv_${userId}_${Date.now()}`;

        await index.namespace(NAMESPACES.CONVERSATIONS).upsert([
            {
                id: vectorId,
                values: embedding,
                metadata: {
                    text: fullText,
                    message,
                    response,
                    userId,
                    companyName,
                    timestamp: Date.now(),
                },
            },
        ]);

        console.log(`✅ Conversation stockée: ${vectorId}`);
    } catch (error) {
        console.error('Erreur stockage conversation:', error);
        // Ne pas bloquer l'app si vectorDB échoue
    }
}

/**
 * Recherche des conversations similaires
 */
export async function searchSimilarConversations(
    query: string,
    userId?: string,
    topK: number = 5
): Promise<SearchResult[]> {
    try {
        const pinecone = await getPineconeClient();
        const index = pinecone.index(PINECONE_INDEX_NAME);

        const preparedQuery = prepareTextForEmbedding(query);
        const queryEmbedding = await generateEmbedding(preparedQuery);

        const searchResults = await index.namespace(NAMESPACES.CONVERSATIONS).query({
            vector: queryEmbedding,
            topK,
            includeMetadata: true,
            filter: userId ? { userId: { $eq: userId } } : undefined,
        });

        return (searchResults.matches || []).map(match => ({
            id: match.id,
            score: match.score || 0,
            metadata: match.metadata as VectorMetadata,
        }));
    } catch (error) {
        console.error('Erreur recherche conversations:', error);
        return [];
    }
}

/**
 * Stocke un insight financier
 */
export async function storeInsight(
    companyName: string,
    kpiType: string,
    insight: string,
    metadata: Record<string, any> = {}
): Promise<void> {
    try {
        const pinecone = await getPineconeClient();
        const index = pinecone.index(PINECONE_INDEX_NAME);

        const preparedText = prepareTextForEmbedding(insight);
        const embedding = await generateEmbedding(preparedText);

        const vectorId = `insight_${companyName}_${kpiType}_${Date.now()}`;

        await index.namespace(NAMESPACES.INSIGHTS).upsert([
            {
                id: vectorId,
                values: embedding,
                metadata: {
                    text: insight,
                    companyName,
                    kpiType,
                    timestamp: Date.now(),
                    ...metadata,
                },
            },
        ]);

        console.log(`✅ Insight stocké: ${vectorId}`);
    } catch (error) {
        console.error('Erreur stockage insight:', error);
    }
}

/**
 * Recherche des insights similaires (évite de régénérer)
 */
export async function searchSimilarInsights(
    query: string,
    companyName?: string,
    topK: number = 3
): Promise<SearchResult[]> {
    try {
        const pinecone = await getPineconeClient();
        const index = pinecone.index(PINECONE_INDEX_NAME);

        const preparedQuery = prepareTextForEmbedding(query);
        const queryEmbedding = await generateEmbedding(preparedQuery);

        const searchResults = await index.namespace(NAMESPACES.INSIGHTS).query({
            vector: queryEmbedding,
            topK,
            includeMetadata: true,
            filter: companyName ? { companyName: { $eq: companyName } } : undefined,
        });

        return (searchResults.matches || []).map(match => ({
            id: match.id,
            score: match.score || 0,
            metadata: match.metadata as VectorMetadata,
        }));
    } catch (error) {
        console.error('Erreur recherche insights:', error);
        return [];
    }
}

/**
 * Stocke le profil d'une entreprise
 */
export async function storeCompanyProfile(
    companyName: string,
    sector: string,
    kpis: Record<string, any>
): Promise<void> {
    try {
        const pinecone = await getPineconeClient();
        const index = pinecone.index(PINECONE_INDEX_NAME);

        // Créer une représentation textuelle du profil
        const profileText = `
            Entreprise: ${companyName}
            Secteur: ${sector}
            KPIs: ${JSON.stringify(kpis)}
        `;

        const preparedText = prepareTextForEmbedding(profileText);
        const embedding = await generateEmbedding(preparedText);

        const vectorId = `company_${companyName.replace(/\s+/g, '_')}_${Date.now()}`;

        await index.namespace(NAMESPACES.COMPANY_PROFILES).upsert([
            {
                id: vectorId,
                values: embedding,
                metadata: {
                    text: profileText,
                    companyName,
                    sector,
                    kpisJson: JSON.stringify(kpis),
                    timestamp: Date.now(),
                },
            },
        ]);

        console.log(`✅ Profil entreprise stocké: ${vectorId}`);
    } catch (error) {
        console.error('Erreur stockage profil:', error);
    }
}

/**
 * Trouve des entreprises similaires (benchmarking)
 */
export async function findSimilarCompanies(
    companyName: string,
    sector: string,
    kpis: Record<string, any>,
    topK: number = 5
): Promise<SearchResult[]> {
    try {
        const pinecone = await getPineconeClient();
        const index = pinecone.index(PINECONE_INDEX_NAME);

        const profileText = `
            Entreprise: ${companyName}
            Secteur: ${sector}
            KPIs: ${JSON.stringify(kpis)}
        `;

        const preparedText = prepareTextForEmbedding(profileText);
        const queryEmbedding = await generateEmbedding(preparedText);

        const searchResults = await index.namespace(NAMESPACES.COMPANY_PROFILES).query({
            vector: queryEmbedding,
            topK: topK + 1, // +1 car on exclura l'entreprise elle-même
            includeMetadata: true,
            filter: { sector: { $eq: sector } }, // Même secteur
        });

        // Exclure l'entreprise recherchée elle-même
        return (searchResults.matches || [])
            .filter(match => match.metadata?.companyName !== companyName)
            .slice(0, topK)
            .map(match => ({
                id: match.id,
                score: match.score || 0,
                metadata: match.metadata as VectorMetadata,
            }));
    } catch (error) {
        console.error('Erreur recherche entreprises similaires:', error);
        return [];
    }
}

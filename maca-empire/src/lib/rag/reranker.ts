/**
 * RAG Reranker
 * Filters and sorts retrieved chunks based on similarity scores.
 * Fix: F2.2
 */

export interface Chunk {
  id: string;
  booking_id: string;
  chunk_text: string;
  similarity: number;
  metadata: any;
}

const PRIMARY_THRESHOLD = 0.65;
const FALLBACK_THRESHOLD = 0.55;

export async function rerankChunks(chunks: Chunk[]): Promise<Chunk[]> {
  if (!chunks || chunks.length === 0) return [];

  // 1. Primary Filter
  let filtered = chunks.filter(c => c.similarity >= PRIMARY_THRESHOLD);

  // 2. Fallback if result set is too small
  if (filtered.length < 3) {
    filtered = chunks.filter(c => c.similarity >= FALLBACK_THRESHOLD);
  }

  // 3. Sort by similarity DESC and return top 5
  return filtered
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
}

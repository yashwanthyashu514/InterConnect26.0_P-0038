/**
 * RAG Context Builder
 * Concatenates chunks into a prompt-ready context block while respecting token limits.
 * Fix: F2.3
 */

import { Chunk } from "./reranker";

const MAX_TOKENS = 4000;
const BUFFER = 200; // Safety buffer for prompt overhead

export function buildContext(chunks: Chunk[]): { context: string; tokenCount: number } {
  if (!chunks || chunks.length === 0) return { context: "", tokenCount: 0 };

  const currentChunks = [...chunks];
  
  const getContextString = (cArray: Chunk[]) => 
    cArray.map((c, i) => `[Document Context ${i+1}] (Source: ${c.metadata.doc_type || 'Unknown'})\n${c.chunk_text}`).join("\n\n");

  const estimateTokens = (text: string) => Math.ceil(text.length / 4);

  let text = getContextString(currentChunks);
  let tokens = estimateTokens(text);

  // Truncate lowest-scoring chunks if over limit
  while (tokens > (MAX_TOKENS - BUFFER) && currentChunks.length > 0) {
    currentChunks.pop(); // Remove lowest scorer
    text = getContextString(currentChunks);
    tokens = estimateTokens(text);
  }

  return { context: text, tokenCount: tokens };
}

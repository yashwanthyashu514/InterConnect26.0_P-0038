/**
 * RAG Embedder with Failure Fallback
 * Primary: Nvidia NIM API.
 * Fallback: Supabase Keyword Search (Full-Text Search).
 * Fix: F6
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const NIM_TIMEOUT = 3000;
let circuitBreakerTrippedUntil = 0;
let consecutiveFailures = 0;

export async function getEmbedding(text: string): Promise<{ vector: number[] | null; fallback: boolean }> {
  // Check Circuit Breaker
  if (Date.now() < circuitBreakerTrippedUntil) {
    return { vector: null, fallback: true };
  }

  const callNIM = async () => {
    // REAL NIM Call logic
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), NIM_TIMEOUT);
    
    try {
      const apiKey = process.env.NVIDIA_API_KEY;
      if (!apiKey) throw new Error("NIM_KEY_MISSING");
      
      const response = await fetch("https://integrate.api.nvidia.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: [text],
          model: "nvidia/nv-embed-v1",
          encoding_format: "float",
          input_type: "query",
          truncate: "END"
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "NIM_API_ERROR");
      }

      const data: { data?: Array<{ embedding?: number[] }> } = await response.json();
      const embedding = data.data?.[0]?.embedding;
      if (!embedding) {
        throw new Error("NIM_INVALID_RESPONSE");
      }
      return embedding;
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    const vector = await callNIM();
    consecutiveFailures = 0;
    return { vector, fallback: false };
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : "UNKNOWN_ERROR";
    consecutiveFailures++;
    if (consecutiveFailures >= 5) {
      circuitBreakerTrippedUntil = Date.now() + 5 * 60 * 1000; // Open for 5 mins
    }
    
    // Log NIM failure to rag_test_logs
    await supabase.from("rag_test_logs").insert({
       test_id: "F6-NIM-FAIL",
       stage: "S2",
       passed: false,
       notes: `NIM Failure: ${errMessage}. Fallback triggered.`
    });

    return { vector: null, fallback: true };
  }
}

export async function keywordFallbackSearch(query: string, bookingId: string, limit: number = 5) {
  // Uses Supabase pgvector/fts capabilities or just basic ILIKE for MVP
  const { data, error } = await supabase
    .from("document_chunks")
    .select("*")
    .eq("booking_id", bookingId)
    .textSearch("content", query.split(" ").join(" | "))
    .limit(limit);

  if (error) throw error;
  
  // Transform to Chunk format with simulated similarity
  return (data || []).map(row => ({
    ...row,
    chunk_text: row.content,
    similarity: 0.51 // High enough for keyword match but distinct from vector score
  }));
}

/**
 * RAG Embedding Cache
 * Caches query embeddings to reduce NIM latency and costs.
 * Fix: F4.1
 */

import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const CACHE_TABLE = "rag_embedding_cache"; // Assumed created as (id, hash, embedding, created_at)

export async function getCachedEmbedding(query: string): Promise<number[] | null> {
  const hash = crypto.createHash("sha256").update(query).digest("hex");
  
  const { data, error } = await supabase
    .from(CACHE_TABLE)
    .select("embedding")
    .eq("hash", hash)
    .gt("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString()) // 1 hour TTL
    .single();

  if (error || !data) return null;
  return data.embedding;
}

export async function setCachedEmbedding(query: string, embedding: number[]) {
  const hash = crypto.createHash("sha256").update(query).digest("hex");
  await supabase.from(CACHE_TABLE).upsert({
    hash,
    embedding,
    created_at: new Date().toISOString()
  });
}

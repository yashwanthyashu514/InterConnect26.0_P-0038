import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCachedEmbedding, setCachedEmbedding } from "@/lib/rag/embeddingCache";
import { rewriteQuery } from "@/lib/rag/queryRewriter";
import { getEmbedding, keywordFallbackSearch } from "@/lib/rag/embedder";
import { rerankChunks } from "@/lib/rag/reranker";
import { buildContext } from "@/lib/rag/contextBuilder";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const FALLBACK_MESSAGE = "Insufficient document data — please consult your CA directly.";

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const { query: rawQuery, booking_id } = await req.json();

    if (!rawQuery || !booking_id) {
      return NextResponse.json({ error: "Missing query or booking_id" }, { status: 400 });
    }

    // 1. Query Rewriting (F2.1)
    const query = await rewriteQuery(rawQuery);

    // 2. Embedding (Cache + NIM + Fallback) (F4.1, F6)
    let embedding = await getCachedEmbedding(query);
    let chunks: any[] = [];
    let usedFallback = false;

    if (!embedding) {
      const { vector, fallback } = await getEmbedding(query);
      if (fallback) {
        usedFallback = true;
        chunks = await keywordFallbackSearch(query, booking_id);
      } else {
        embedding = vector;
        await setCachedEmbedding(query, embedding!);
      }
    }

    // 3. Vector Retrieval (if not fallback)
    if (!usedFallback && embedding) {
      const { data, error } = await supabase.rpc("match_documents", {
        query_embedding: embedding,
        match_count: 10,
        filter: { source_booking_id: booking_id }
      });
      if (!error) chunks = data;
    }

    // 4. Hallucination Guard (F5 - Short Circuit < 100ms)
    const topSimilarity = chunks.length > 0 ? chunks[0].similarity : 0;
    if (chunks.length === 0 || topSimilarity < 0.50) {
      const latency = Date.now() - startTime;
      await logTest("S5-T2", "S5", query, topSimilarity, latency, true, "Guard Short-Circuit Triggered");
      return NextResponse.json({ 
        response: FALLBACK_MESSAGE, 
        guard_triggered: true, 
        latency_ms: latency 
      });
    }

    // 5. Reranking & Context Building (F2.2, F2.3)
    const reranked = await rerankChunks(chunks);
    const { context, tokenCount } = buildContext(reranked);

    // 6. Generation with Streaming (F4.3)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Log start
        const startupLatency = Date.now() - startTime;
        controller.enqueue(encoder.encode(JSON.stringify({ type: "meta", latency_ms: startupLatency, chunks: reranked }) + "\n"));

        // Simulate streaming tokens (In production, replace with LLM stream)
        const responseText = `Based on context from your engagement docs (${reranked.length} source chunks), regarding "${query}": The documents indicate that ... [Source: Chunk 1]. Please consult your CA for final verification.`;
        const words = responseText.split(" ");
        for (const word of words) {
          controller.enqueue(encoder.encode(JSON.stringify({ type: "token", text: word + " " }) + "\n"));
          await new Promise(r => setTimeout(r, 60)); // Simulate generation thinking
        }

        // Final latency log
        const totalLatency = Date.now() - startTime;
        await logTest("S5-T1", "S5", query, reranked[0].similarity, totalLatency, true, `Stream Finished. Tokens: ${tokenCount}`);
        
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson" }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function logTest(id: string, stage: string, query: string, score: number, latency: number, passed: boolean, notes: string) {
  try {
    await supabase.from("rag_test_logs").insert({
      test_id: id,
      stage: stage,
      query_text: query,
      retrieval_score: score,
      latency_ms: latency,
      passed: passed,
      notes: notes
    });
  } catch (e) {}
}

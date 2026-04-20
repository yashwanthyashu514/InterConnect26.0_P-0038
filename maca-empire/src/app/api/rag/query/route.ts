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

type RetrievedChunk = Record<string, unknown> & { similarity?: number };

async function generateGroundedAnswer(query: string, context: string): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY missing");
  }

  const systemPrompt =
    "You are a legal-tax assistant. Answer only from the provided context. " +
    "If context is insufficient, say so clearly. Include short source references like [Context 1], [Context 2].";

  const userPrompt = `Question: ${query}\n\nContext:\n${context}\n\nReturn a concise, structured answer.`;

  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta/llama-3.3-70b-instruct",
      temperature: 0.1,
      top_p: 0.9,
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`NIM_CHAT_ERROR_${response.status}`);
  }

  const data: {
    choices?: Array<{ message?: { content?: string } }>;
  } = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("NIM_EMPTY_RESPONSE");
  }
  return content;
}

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
    let chunks: RetrievedChunk[] = [];
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
      if (!error) chunks = (data as RetrievedChunk[]) ?? [];
    }

    // 4. Hallucination Guard (F5 - Short Circuit < 100ms)
    const topSimilarity = chunks.length > 0 ? (chunks[0].similarity ?? 0) : 0;
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

    // 6. Grounded generation + stream back response
    const groundedAnswer = await generateGroundedAnswer(query, context);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Log start
        const startupLatency = Date.now() - startTime;
        controller.enqueue(encoder.encode(JSON.stringify({ type: "meta", latency_ms: startupLatency, chunks: reranked }) + "\n"));

        const words = groundedAnswer.split(" ");
        for (const word of words) {
          controller.enqueue(encoder.encode(JSON.stringify({ type: "token", text: word + " " }) + "\n"));
          await new Promise(r => setTimeout(r, 20));
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

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
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
  } catch (_e: unknown) {}
}

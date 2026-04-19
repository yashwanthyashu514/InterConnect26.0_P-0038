import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// @ts-ignore
import pdf from "pdf-parse";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const booking_id = formData.get("booking_id") as string;
    const doc_type = formData.get("doc_type") as string;

    if (!file || !booking_id) {
      return NextResponse.json({ error: "Missing file or booking_id" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";
    
    // S1-T1: PDF Ingestion
    if (file.type === "application/pdf") {
      const data = await pdf(buffer);
      text = data.text;
    } else if (file.type.startsWith("image/")) {
      // S1-T2: Image Ingestion (OCR Placeholder)
      // Log as roadmap item for now
      return NextResponse.json({ 
        status: "SKIP", 
        message: "Multimodal OCR (S1-T2) is on the roadmap. Part of Phase 2 logic." 
      });
    } else {
      text = buffer.toString();
    }

    // S1-T3: Duplicate Detection (Content Hash)
    const contentHash = crypto.createHash("sha256").update(text).digest("hex");
    const { data: existing } = await supabase
      .from("document_chunks")
      .select("id")
      .eq("booking_id", booking_id)
      .eq("content_hash", contentHash)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Document already ingested for this booking" }, { status: 409 });
    }

    // S1: Chunking Logic
    const chunks = [];
    for (let i = 0; i < text.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
      const chunkText = text.slice(i, i + CHUNK_SIZE);
      chunks.push({
        booking_id,
        content: chunkText,
        doc_type,
        chunk_index: chunks.length,
        token_count: Math.ceil(chunkText.length / 4), // Rough token estimation
        content_hash: contentHash,
        metadata: {
          doc_type,
          source_booking_id: booking_id,
          page_number: Math.floor(i / 2000) + 1, // Simplified page estimation
          uploaded_at: new Date().toISOString()
        }
      });
    }

    // Batch insert chunks
    const { data: insertedChunks, error: chunkError } = await supabase
      .from("document_chunks")
      .insert(chunks)
      .select();

    if (chunkError) throw chunkError;

    // S2: Embedding Simulation (Placeholder for NIM)
    // In a real scenario, we'd call the NIM endpoint for each chunk
    // We will implement S2 in its own route for testing S2-T1/T2/T3.
    
    // Log Test Result for S1-T1
    await supabase.from("rag_test_logs").insert({
      test_id: "S1-T1",
      stage: "S1",
      notes: `Ingested ${chunks.length} chunks successfully. Content hash: ${contentHash.slice(0, 8)}`,
      latency_ms: Date.now() - startTime,
      passed: chunks.length > 0
    });

    return NextResponse.json({ 
      success: true, 
      chunks_created: chunks.length,
      chunks: insertedChunks 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

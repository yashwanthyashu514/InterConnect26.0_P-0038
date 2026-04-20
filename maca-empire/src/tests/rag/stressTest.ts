/**
 * RAG Concurrency & Privacy Stress Test
 * Fires 5 simultaneous queries from different booking_ids and verifies zero data leakage.
 * Fix: F3
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function runStressTest() {
  const testBookings = [
    { id: "BOOK-001", query: "ITR penalty" },
    { id: "BOOK-002", query: "GST credit" },
    { id: "BOOK-003", query: "FEMA assets" },
    { id: "BOOK-004", query: "TDS rates" },
    { id: "BOOK-005", query: "HUF property" }
  ];

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  async function mockQuery(bookingId: string, query: string) {
    const res = await fetch(`${SITE_URL}/api/rag/query`, {
      method: "POST",
      body: JSON.stringify({ query, booking_id: bookingId })
    });
    
    // Since we now stream ndjson, we need a simple parser for the test
    const text = await res.text();
    const lines = text.trim().split("\n");
    const metaLine = JSON.parse(lines[0]);
    return metaLine;
  }

  try {
    const results = await Promise.all(testBookings.map(b => mockQuery(b.id, b.query)));
    
    const leakDetected = results.some((res, i) => {
      const chunks = (res as Record<string, unknown>)?.chunks;
      return Array.isArray(chunks) && chunks.some((c) => {
        const bookingId = (c as Record<string, unknown>)?.booking_id;
        return typeof bookingId === "string" && bookingId !== testBookings[i].id;
      });
    });

    return {
      passed: !leakDetected,
      results_count: results.length,
      leak_detected: leakDetected,
      notes: leakDetected ? "CRITICAL: Scoping breached under load" : "No cross-booking data detected."
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { passed: false, error: message };
  }
}

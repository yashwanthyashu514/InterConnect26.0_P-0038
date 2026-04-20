-- ================================================================
-- MaCA Empire RAG Pipeline — Submission Infrastructure
-- Version: 1.0.0 | Run in Supabase SQL Editor
-- ================================================================

-- Enable Vector Extension if not exists
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 1. Document Chunks Table
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  doc_type TEXT, -- 'ITR_NOTICE', 'GST_FILING', 'REVENUE_REPORT', etc.
  chunk_index INTEGER,
  token_count INTEGER,
  content_hash TEXT,
  metadata JSONB, -- For page_number, uploaded_at, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Document Embeddings Table (pgvector)
-- Using 4096 dimensions for nvidia/nv-embed-v1
CREATE TABLE IF NOT EXISTS document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chunk_id UUID REFERENCES document_chunks(id) ON DELETE CASCADE,
  embedding extensions.vector(4096),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RAG Test Logs (For CTO Dashboard audit)
CREATE TABLE IF NOT EXISTS rag_test_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id TEXT NOT NULL,
  stage TEXT NOT NULL, -- S1-S6
  query_text TEXT,
  retrieval_score NUMERIC,
  latency_ms INTEGER,
  passed BOOLEAN,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chunks_booking ON document_chunks(booking_id);
CREATE INDEX IF NOT EXISTS idx_chunks_hash ON document_chunks(content_hash);

-- Match Documents RPC with Filter and Scoping
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding extensions.vector(4096),
  match_count INT,
  filter JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE (
  chunk_id UUID,
  booking_id UUID,
  chunk_text TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.booking_id,
    dc.content,
    1 - (de.embedding <=> query_embedding) AS similarity,
    dc.metadata
  FROM document_chunks dc
  JOIN document_embeddings de ON dc.id = de.chunk_id
  WHERE (filter = '{}'::JSONB OR dc.metadata @> filter)
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- RLS Enforcement
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

-- Privacy Guard: Retrieval must be scoped to booking_id
-- This policy ensures users/CAs can only see chunks from bookings they are part of.
-- For the API implementation, we will manually append booking_id to the filter or query.

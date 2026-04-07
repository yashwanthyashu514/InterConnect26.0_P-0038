-- Create an extensions schema for security (Linter: extension_in_public)
CREATE SCHEMA IF NOT EXISTS extensions;

-- Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- If vector was previously installed in public schema, move it
ALTER EXTENSION vector SET SCHEMA extensions;

-- Create the documents table for RAG
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  embedding extensions.vector(4096),
  metadata JSONB,
  fts tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED
);

-- Migration: Add fts column to existing documents table if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='documents' AND column_name='fts') THEN
        ALTER TABLE documents ADD COLUMN fts tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_documents_fts ON documents USING GIN(fts);

-- Search function for finding similar documents
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding extensions.vector(4096), -- Updated Dimension for nvidia/nv-embed-v1
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
SET search_path = '' -- Linter constraint mitigation
AS $$
BEGIN
  RETURN QUERY
  SELECT
    public.documents.id,
    public.documents.content,
    public.documents.metadata,
    1 - (public.documents.embedding <=> query_embedding) AS similarity
  FROM public.documents
  WHERE 1 - (public.documents.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Create the vault table for document history
CREATE TABLE IF NOT EXISTS vault (
  doc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  content TEXT NOT NULL,
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast user filtering
CREATE INDEX IF NOT EXISTS idx_vault_user_id ON vault(user_id);

-- Create the court_cases table for RAG (Phase 4 - P1 Precedent Finder)
CREATE TABLE IF NOT EXISTS court_cases (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  embedding extensions.vector(4096),
  metadata JSONB,
  fts tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED
);

CREATE INDEX IF NOT EXISTS idx_court_cases_fts ON court_cases USING GIN(fts);

-- Migration: Add fts column to existing court_cases table if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='court_cases' AND column_name='fts') THEN
        ALTER TABLE court_cases ADD COLUMN fts tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
    END IF;
END $$;

-- Search function for finding similar court cases
CREATE OR REPLACE FUNCTION match_court_cases (
  query_embedding extensions.vector(4096),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
SET search_path = '' -- Linter constraint mitigation
AS $$
BEGIN
  RETURN QUERY
  SELECT
    public.court_cases.id,
    public.court_cases.content,
    public.court_cases.metadata,
    1 - (public.court_cases.embedding <=> query_embedding) AS similarity
  FROM public.court_cases
  WHERE 1 - (public.court_cases.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Create the users table for API key mapping (Phase 4 - FIX-001/005)
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT UNIQUE,
  api_key_public TEXT UNIQUE, -- client_id
  api_key_hashed TEXT, -- client_secret bcrypt hash
  plan_type TEXT DEFAULT 'standard', -- standard, enterprise
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed a demo user for local hackathon testing
INSERT INTO users (user_id, full_name, email, api_key_public, plan_type) 
VALUES ('user_demo_123', 'Demo User', 'demo@maca.in', 'maca_live_4f8e2190c128a8d7', 'enterprise')
ON CONFLICT DO NOTHING;

-- 1. Create the Supreme Tax Knowledge Vault
-- Ensure pgvector extension exists (Supabase usually has it, but this is safe)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS tax_knowledge (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_tag text,
    section_ref text,
    ay text DEFAULT '2025-26',
    content text,
    embedding vector(4096),
    created_at timestamptz DEFAULT now()
);

-- 2. Create the Sovereign Matching Function
-- Postgres cannot change return type via OR REPLACE if signature differs in schema cache.
DROP FUNCTION IF EXISTS match_tax_docs(vector, double precision, integer);
CREATE OR REPLACE FUNCTION match_tax_docs(
    query_embedding vector(4096), 
    match_threshold float DEFAULT 0.3, 
    match_count int DEFAULT 8
) 
RETURNS TABLE(
    id uuid, 
    topic_tag text, 
    section_ref text, 
    content text, 
    similarity float
) 
LANGUAGE sql 
AS $$ 
SELECT 
    id, 
    topic_tag, 
    section_ref, 
    content, 
    1 - (embedding <=> query_embedding) AS similarity 
FROM 
    tax_knowledge 
WHERE 
    1 - (embedding <=> query_embedding) > match_threshold 
ORDER BY 
    similarity DESC 
LIMIT 
    match_count; 
$$;

-- 3. Index for High-Speed Retrieval
-- IMPORTANT:
-- Your Supabase/pgvector build enforces a 2000-dimension limit for vector indexes
-- (both IVFFLAT and HNSW). Since `embedding` is vector(4096), a vector index will FAIL.
-- We intentionally skip creating a vector index here to keep schema creation working.
--
-- For true high-scale production performance, you have 2 options:
-- 1) Switch Supreme Tax embeddings to a <= 2000-dim model (e.g. 1536) and change vector size.
-- 2) Use an external vector DB / self-hosted Postgres with pgvector supporting your dims/indexing.
--
-- Helpful non-vector indexes:
CREATE INDEX IF NOT EXISTS tax_knowledge_topic_tag_idx ON tax_knowledge(topic_tag);
CREATE INDEX IF NOT EXISTS tax_knowledge_section_ref_idx ON tax_knowledge(section_ref);
CREATE INDEX IF NOT EXISTS tax_knowledge_ay_idx ON tax_knowledge(ay);

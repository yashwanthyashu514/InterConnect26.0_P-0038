-- 1. Create the Supreme Tax Knowledge Vault
CREATE TABLE IF NOT EXISTS tax_knowledge (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_tag text,
    section_ref text,
    ay text DEFAULT '2025-26',
    content text,
    embedding vector(1536),
    created_at timestamptz DEFAULT now()
);

-- 2. Create the Sovereign Matching Function
CREATE OR REPLACE FUNCTION match_tax_docs(
    query_embedding vector(1536), 
    match_threshold float, 
    match_count int
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
CREATE INDEX ON tax_knowledge USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

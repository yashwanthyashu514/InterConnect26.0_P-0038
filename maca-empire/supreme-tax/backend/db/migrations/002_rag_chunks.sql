CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE rag_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  source TEXT,
  section TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rag_agent ON rag_chunks(agent_id);

CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  target_agent_id TEXT,
  match_threshold FLOAT DEFAULT 0.72,
  match_count INT DEFAULT 4
) RETURNS TABLE(id UUID, content TEXT, section TEXT, similarity FLOAT)
LANGUAGE sql STABLE AS $$
  SELECT id, content, section,
    1 - (embedding <=> query_embedding) AS similarity
  FROM rag_chunks
  WHERE agent_id = target_agent_id
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

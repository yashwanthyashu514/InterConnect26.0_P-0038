-- ============================================================
-- A23: ESG Compass Table
-- ============================================================
CREATE TABLE IF NOT EXISTS esg_compass_documents (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  embedding vector(4096),
  source text,
  framework text,
  section text,
  category text,
  last_updated date DEFAULT CURRENT_DATE
);

CREATE OR REPLACE FUNCTION match_esg_documents(
  query_embedding vector(4096),
  match_count int DEFAULT 8
)
RETURNS TABLE(
  id bigint,
  content text,
  source text,
  framework text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    esg_compass_documents.id,
    esg_compass_documents.content,
    esg_compass_documents.source,
    esg_compass_documents.framework,
    1 - (esg_compass_documents.embedding <=> query_embedding) AS similarity
  FROM esg_compass_documents
  ORDER BY esg_compass_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================
-- A24: HeirGuard Table
-- ============================================================
CREATE TABLE IF NOT EXISTS heirguard_documents (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  embedding vector(4096),
  source text,
  act_name text,
  section_number text,
  religion text,
  category text,
  last_updated date DEFAULT CURRENT_DATE
);

CREATE OR REPLACE FUNCTION match_heirguard_documents(
  query_embedding vector(4096),
  match_count int DEFAULT 8
)
RETURNS TABLE(
  id bigint,
  content text,
  source text,
  act_name text,
  section_number text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    heirguard_documents.id,
    heirguard_documents.content,
    heirguard_documents.source,
    heirguard_documents.act_name,
    heirguard_documents.section_number,
    1 - (heirguard_documents.embedding <=> query_embedding) AS similarity
  FROM heirguard_documents
  ORDER BY heirguard_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

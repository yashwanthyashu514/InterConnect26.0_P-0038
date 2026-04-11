-- A21: DPDP Shield Table
CREATE TABLE IF NOT EXISTS dpdp_shield_documents (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  embedding vector(4096),
  source text,
  rule_number text,
  section text,
  category text,
  last_updated date DEFAULT CURRENT_DATE
);

CREATE OR REPLACE FUNCTION match_dpdp_documents(
  query_embedding vector(4096),
  match_count int DEFAULT 8
)
RETURNS TABLE(
  id bigint,
  content text,
  source text,
  rule_number text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dpdp_shield_documents.id,
    dpdp_shield_documents.content,
    dpdp_shield_documents.source,
    dpdp_shield_documents.rule_number,
    1 - (dpdp_shield_documents.embedding <=> query_embedding) AS similarity
  FROM dpdp_shield_documents
  ORDER BY dpdp_shield_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- A22: CryptoTax Pro Table
CREATE TABLE IF NOT EXISTS cryptotax_documents (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  embedding vector(4096),
  source text,
  section_number text,
  cbdt_circular text,
  category text,
  last_updated date DEFAULT CURRENT_DATE
);

CREATE OR REPLACE FUNCTION match_cryptotax_documents(
  query_embedding vector(4096),
  match_count int DEFAULT 6
)
RETURNS TABLE(
  id bigint,
  content text,
  source text,
  section_number text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cryptotax_documents.id,
    cryptotax_documents.content,
    cryptotax_documents.source,
    cryptotax_documents.section_number,
    1 - (cryptotax_documents.embedding <=> query_embedding) AS similarity
  FROM cryptotax_documents
  ORDER BY cryptotax_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Global Generic Document Table (A1-A20)
CREATE TABLE IF NOT EXISTS documents (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  embedding vector(4096),
  metadata jsonb,
  last_updated date DEFAULT CURRENT_DATE
);

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(4096),
  match_count int DEFAULT 5,
  match_threshold float DEFAULT 0.5
)
RETURNS TABLE(
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

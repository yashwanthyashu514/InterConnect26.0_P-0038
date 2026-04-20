-- Fix ambiguous id errors + improve match functions
-- Run this in Supabase SQL editor.

-- IMPORTANT:
-- If you see: "cannot change return type of existing function"
-- you must DROP the old function signature(s) first.

-- DPDP Shield
DROP FUNCTION IF EXISTS match_dpdp_documents(vector, integer);
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
LANGUAGE sql
AS $$
  SELECT
    d.id,
    d.content,
    d.source,
    d.rule_number,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM dpdp_shield_documents d
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- CryptoTax Pro
DROP FUNCTION IF EXISTS match_cryptotax_documents(vector, integer);
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
LANGUAGE sql
AS $$
  SELECT
    c.id,
    c.content,
    c.source,
    c.section_number,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM cryptotax_documents c
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ESG Compass (adds similarity output like other match fns)
DROP FUNCTION IF EXISTS match_esg_documents(vector, integer);
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
LANGUAGE sql
AS $$
  SELECT
    e.id,
    e.content,
    e.source,
    e.framework,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM esg_compass_documents e
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- HeirGuard (adds similarity output like other match fns)
DROP FUNCTION IF EXISTS match_heirguard_documents(vector, integer);
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
LANGUAGE sql
AS $$
  SELECT
    h.id,
    h.content,
    h.source,
    h.act_name,
    h.section_number,
    1 - (h.embedding <=> query_embedding) AS similarity
  FROM heirguard_documents h
  ORDER BY h.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Oracle Static (adds similarity output like other match fns)
DROP FUNCTION IF EXISTS match_oracle_static(vector, integer);
CREATE OR REPLACE FUNCTION match_oracle_static(
  query_embedding vector(4096),
  match_count int DEFAULT 8
)
RETURNS TABLE(
  id bigint,
  content text,
  source text,
  asset_class text,
  knowledge_type text,
  similarity float
)
LANGUAGE sql
AS $$
  SELECT
    o.id,
    o.content,
    o.source,
    o.asset_class,
    o.knowledge_type,
    1 - (o.embedding <=> query_embedding) AS similarity
  FROM oracle_static_kb o
  ORDER BY o.embedding <=> query_embedding
  LIMIT match_count;
$$;


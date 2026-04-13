-- ============================================================
-- maCA Empire — A25 & A26 Database Tables
-- Paste into Supabase SQL Editor
-- ============================================================

-- ============================================================
-- A25: AI Governance Counsel Table
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_governance_documents (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  embedding vector(4096),
  source text,
  framework text,
  jurisdiction text,
  risk_level text,
  category text,
  last_updated date DEFAULT CURRENT_DATE
);

CREATE OR REPLACE FUNCTION match_ai_governance_documents(
  query_embedding vector(4096),
  match_count int DEFAULT 8
)
RETURNS TABLE(
  id bigint,
  content text,
  source text,
  framework text,
  jurisdiction text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai_governance_documents.id,
    ai_governance_documents.content,
    ai_governance_documents.source,
    ai_governance_documents.framework,
    ai_governance_documents.jurisdiction,
    1 - (ai_governance_documents.embedding <=> query_embedding) AS similarity
  FROM ai_governance_documents
  ORDER BY ai_governance_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================
-- A26: The Oracle Table (Static KB + Live News)
-- ============================================================
CREATE TABLE IF NOT EXISTS oracle_static_kb (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  embedding vector(4096),
  source text,
  asset_class text,
  knowledge_type text,
  era text,
  category text,
  last_updated date DEFAULT CURRENT_DATE
);

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
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    oracle_static_kb.id,
    oracle_static_kb.content,
    oracle_static_kb.source,
    oracle_static_kb.asset_class,
    oracle_static_kb.knowledge_type,
    1 - (oracle_static_kb.embedding <=> query_embedding) AS similarity
  FROM oracle_static_kb
  ORDER BY oracle_static_kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

CREATE TABLE IF NOT EXISTS oracle_live_news (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  embedding vector(4096),
  source text,
  asset_class text,
  news_date date DEFAULT CURRENT_DATE,
  category text
);

CREATE OR REPLACE FUNCTION match_oracle_live(
  query_embedding vector(4096),
  match_count int DEFAULT 4
)
RETURNS TABLE(
  id bigint,
  content text,
  source text,
  news_date date,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    oracle_live_news.id,
    oracle_live_news.content,
    oracle_live_news.source,
    oracle_live_news.news_date,
    1 - (oracle_live_news.embedding <=> query_embedding) AS similarity
  FROM oracle_live_news
  ORDER BY oracle_live_news.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

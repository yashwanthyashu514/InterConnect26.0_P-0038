-- ================================================================
-- MaCA Empire RAG Pipeline — Production Hardening
-- Version: 1.0.0-production | Fixes: F8, F4, F7
-- ================================================================

-- 1. Data Retention (F8)
ALTER TABLE document_chunks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Embedding Cache (F4)
CREATE TABLE IF NOT EXISTS rag_embedding_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hash TEXT UNIQUE NOT NULL,
  embedding extensions.vector(1024),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cache_hash ON rag_embedding_cache(hash);

-- 3. Rate Limiting (F7)
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_user ON rate_limits(user_id, endpoint);

-- 4. Full-Text Search (F6)
-- Ensure 'content' is searchable
ALTER TABLE document_chunks ADD COLUMN IF NOT EXISTS fts tsvector 
GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
CREATE INDEX IF NOT EXISTS idx_chunks_fts ON document_chunks USING GIN(fts);

-- 5. Soft Delete Cleanup Logic (Trigger simulation)
-- Weekly hard delete can be run via pg_cron in Supabase or manual script.
-- DELETE FROM document_chunks WHERE deleted_at < NOW() - INTERVAL '7 days';

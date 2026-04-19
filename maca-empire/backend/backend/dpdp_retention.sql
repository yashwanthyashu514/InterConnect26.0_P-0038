-- DPDP 2023 Compliance — Data Retention Policy
-- Fix: F8

-- 1. Add deleted_at column
ALTER TABLE document_chunks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Index for cleanup scans
CREATE INDEX IF NOT EXISTS idx_chunks_deleted_at ON document_chunks(deleted_at);

-- 3. Trigger/Logic for marking deletion 
-- This is handled by the purge_chunks.py job which checks booking.status

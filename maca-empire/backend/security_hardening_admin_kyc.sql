-- Security hardening migration: admin auth/audit + CA KYC audit + masked payout view
-- Run in Supabase SQL editor.

-- 1) Admin action audit log
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES marketplace_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_admin_user_id ON admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created_at ON admin_audit_logs(created_at DESC);

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_audit_logs_service_only ON admin_audit_logs;
CREATE POLICY admin_audit_logs_service_only
  ON admin_audit_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2) CA KYC audit fields
ALTER TABLE ca_profiles
  ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS kyc_provider TEXT,
  ADD COLUMN IF NOT EXISTS kyc_reference_id TEXT,
  ADD COLUMN IF NOT EXISTS kyc_reason TEXT;

-- 3) Masked payout view (for admin/operator UIs)
CREATE OR REPLACE VIEW ca_payout_profiles_masked AS
SELECT
  cp.id,
  cp.user_id,
  cp.kyc_status,
  cp.is_available,
  cp.listed_price_paise,
  cp.created_at,
  cp.bank_ifsc,
  CASE
    WHEN cp.bank_ifsc IS NULL OR cp.bank_ifsc = '' THEN NULL
    ELSE LEFT(cp.bank_ifsc, 4) || 'XXXXXXX'
  END AS bank_ifsc_masked,
  CASE
    WHEN cp.bank_account_number_enc IS NULL OR cp.bank_account_number_enc = '' THEN NULL
    WHEN LENGTH(cp.bank_account_number_enc) <= 4 THEN '****'
    ELSE 'XXXXXX' || RIGHT(cp.bank_account_number_enc, 4)
  END AS bank_account_masked
FROM ca_profiles cp;

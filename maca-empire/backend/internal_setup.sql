-- ================================================================
-- IMPERIO NEURAL — Internal A2A Executive Team Database Schema
-- Version: 2.3 | UPDATED: Removed Sales AI
-- ================================================================

-- 1. Client Registry (CFO AI)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  full_name TEXT,
  retainer_tier TEXT CHECK (retainer_tier IN ('family_trust','elite_empire','sovereign_titan','custom')),
  retainer_amount_inr NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'current' CHECK (payment_status IN ('current','overdue','pending','cancelled')),
  retainer_start DATE,
  retainer_renewal DATE,
  onboarded_at TIMESTAMPTZ,
  relationship_manager TEXT,
  referral_source TEXT,
  entity_count INTEGER DEFAULT 1,
  jurisdiction_count INTEGER DEFAULT 1,
  net_worth_cr NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. API Usage Logs
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_name TEXT NOT NULL CHECK (api_name IN ('nvidia_nim','coingecko','alpha_vantage','scrapingdog','sarvam','elevenlabs')),
  calls_today INTEGER DEFAULT 0,
  tokens_today INTEGER DEFAULT 0,
  cost_today_inr NUMERIC DEFAULT 0,
  quota_limit INTEGER,
  quota_remaining INTEGER,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  logged_at DATE DEFAULT CURRENT_DATE,
  UNIQUE (api_name, logged_at)
);

-- 3. Invoices (CFO AI)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  amount_inr NUMERIC NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  due_date DATE,
  paid_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Agent Performance Logs (CTO AI monitors 16 agents)
CREATE TABLE IF NOT EXISTS agent_performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  agent_label TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','reserved','degraded','offline')),
  query_count INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  rag_retrieval_score NUMERIC DEFAULT 0,
  logged_at DATE DEFAULT CURRENT_DATE,
  UNIQUE (agent_id, logged_at)
);

-- 5. System Health Log
CREATE TABLE IF NOT EXISTS system_health_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backend_status TEXT DEFAULT 'UP' CHECK (backend_status IN ('UP','DOWN','DEGRADED')),
  frontend_status TEXT DEFAULT 'UP' CHECK (frontend_status IN ('UP','DOWN','DEGRADED')),
  supabase_latency_ms INTEGER DEFAULT 0,
  nvidia_latency_ms INTEGER DEFAULT 0,
  active_rag_tables INTEGER DEFAULT 7,
  total_rag_docs INTEGER DEFAULT 30,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Vendor Registry (HR AI)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  service_type TEXT CHECK (service_type IN ('rag_doc_prep','legal_review','freelance_dev','design','content','other')),
  contract_start DATE,
  contract_end DATE,
  monthly_cost_inr NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','expiring','expired','paused')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Team Members (HR AI)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  join_date DATE,
  review_date DATE,
  employment_type TEXT CHECK (employment_type IN ('full_time','part_time','contract','intern')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','onboarding','notice_period','separated')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Marketing Calendar
CREATE TABLE IF NOT EXISTS marketing_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT CHECK (content_type IN ('article','linkedin_post','press_release','case_study','email_sequence','pitch_deck_section')),
  title TEXT UNIQUE,
  target_publication TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned','draft','in_review','published','cancelled')),
  planned_date DATE,
  published_date DATE,
  assigned_by TEXT DEFAULT 'hr',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Marketing Performance Log
CREATE TABLE IF NOT EXISTS marketing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES marketing_calendar(id) ON DELETE SET NULL,
  content_type TEXT,
  title TEXT,
  draft_body TEXT,
  views INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  quality_score NUMERIC DEFAULT 0,
  logged_at DATE DEFAULT CURRENT_DATE
);

-- 10. Internal A2A Message Bus
CREATE TABLE IF NOT EXISTS internal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent TEXT NOT NULL CHECK (from_agent IN ('ceo','cfo','cto','hr','marketing')),
  to_agent TEXT NOT NULL CHECK (to_agent IN ('ceo','cfo','cto','hr','marketing','any')),
  message_type TEXT NOT NULL CHECK (message_type IN ('ALERT','REPORT','TASK','DECISION','DIRECTIVE','OVERRIDE')),
  subject TEXT,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread','read','actioned','archived')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('critical','high','normal','low')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Daily Briefings
CREATE TABLE IF NOT EXISTS daily_briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_date DATE DEFAULT CURRENT_DATE UNIQUE,
  marketing_section TEXT,
  hr_section TEXT,
  cto_section TEXT,
  cfo_section TEXT,
  alerts_summary TEXT,
  decisions_needed TEXT,
  status TEXT DEFAULT 'compiling' CHECK (status IN ('compiling','ready','acknowledged','error')),
  compiled_at TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ
);

-- 12. CEO Alert Queue
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_agent TEXT CHECK (source_agent IN ('cfo','cto','hr','marketing')),
  alert_type TEXT,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'normal' CHECK (severity IN ('critical','high','normal','low')),
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Allowed Message Pairs
CREATE TABLE IF NOT EXISTS allowed_message_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent TEXT NOT NULL,
  to_agent TEXT NOT NULL,
  allowed_types TEXT[],
  UNIQUE (from_agent, to_agent)
);

-- Seed valid command chain pairs
INSERT INTO allowed_message_pairs (from_agent, to_agent, allowed_types) VALUES
  ('ceo',       'cfo',       ARRAY['DIRECTIVE','DECISION','OVERRIDE']),
  ('cfo',       'ceo',       ARRAY['REPORT','ALERT','DECISION']),
  ('cfo',       'cto',       ARRAY['DIRECTIVE','TASK']),
  ('cto',       'cfo',       ARRAY['REPORT','ALERT']),
  ('cto',       'hr',        ARRAY['DIRECTIVE','TASK']),
  ('hr',        'cto',       ARRAY['REPORT','ALERT']),
  ('hr',        'marketing', ARRAY['TASK','DIRECTIVE']),
  ('marketing', 'hr',        ARRAY['REPORT']),
  ('ceo',       'any',       ARRAY['OVERRIDE'])
ON CONFLICT (from_agent, to_agent) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_internal_messages_to_agent ON internal_messages(to_agent, status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity, acknowledged);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_date ON api_usage_logs(api_name, logged_at);
CREATE INDEX IF NOT EXISTS idx_agent_perf_date ON agent_performance_logs(agent_id, logged_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_alerts_upsert_key ON alerts (source_agent, alert_type, acknowledged);

-- ================================================================
-- CONVERSION/CLEANUP: Remove Sales AI
-- ================================================================
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS sales_pipeline CASCADE;
DROP TRIGGER IF EXISTS trg_deal_won ON sales_pipeline;
DROP FUNCTION IF EXISTS handle_deal_won();

-- RLS LOCKDOWN
DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'clients', 'invoices', 'daily_briefings', 'internal_messages',
    'allowed_message_pairs', 'api_usage_logs', 'alerts',
    'marketing_logs', 'system_health_log', 'vendors', 'team_members',
    'marketing_calendar'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_service_only" ON %I;', tbl, tbl);
    EXECUTE format('
      CREATE POLICY "%s_service_only"
      ON %I
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    ', tbl, tbl);
  END LOOP;
END;
$$;

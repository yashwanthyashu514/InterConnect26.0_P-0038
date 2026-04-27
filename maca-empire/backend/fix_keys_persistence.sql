-- Create developer_keys table to fix the "keys vanish on refresh" issue
CREATE TABLE IF NOT EXISTS developer_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Optional for now to support demo keys
  key TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE developer_keys ENABLE ROW LEVEL SECURITY;

-- Allow all for demo purposes (Hardened in production)
CREATE POLICY "Allow all for demo" ON developer_keys FOR ALL USING (true) WITH CHECK (true);

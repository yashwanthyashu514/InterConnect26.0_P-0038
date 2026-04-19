CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  agent_id TEXT,
  input_tokens INT,
  output_tokens INT,
  cost_inr NUMERIC(10,4),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_usage_user ON usage_logs(user_id, created_at);
